import ActivityKit
import Foundation

enum LiveActivityTokenType: String {
    case start = "StartTokenReceived"
    case update = "UpdateTokenReceived"
}

// Protocol for activity attributes to make our manager generic
protocol OutsLiveActivityAttributes: ActivityAttributes where ContentState: Codable & Hashable {}

// Make your existing and new attributes conform to this protocol
extension LinearAttributes: OutsLiveActivityAttributes {}
extension RadialAttributes: OutsLiveActivityAttributes {}

class LiveActivityManager {
    
    static let shared = LiveActivityManager()
    
    // Dictionary to store registered activity types
    private var registeredTypes: [String: Any.Type] = [:]
    
    // Dictionary to store activities by type
    private var activities: [String: Any] = [:]
    
    private static func formatPushToken(_ token: Data) -> String {
        return token.reduce("") { $0 + String(format: "%02x", $1) }
    }
    
    private func notifyToken(_ token: Data, type: LiveActivityTokenType) {
        let formattedToken = Self.formatPushToken(token)
        NotificationCenter.default.post(
            name: Notification.Name(type.rawValue),
            object: nil,
            userInfo: ["token": formattedToken, "timestamp": Date()]
        )
    }
    
    // Register a new activity type
    func register<T: OutsLiveActivityAttributes>(_ type: T.Type) {
        let typeName = String(describing: type)
        registeredTypes[typeName] = type
        activities[typeName] = [Activity<T>]()
        
        // Start monitoring this type
        monitorStartTokens(for: type)
        monitorActivityUpdates(for: type)
    }
    
    // Initialize with default types
    func initialize() {
        register(LinearAttributes.self)
        register(RadialAttributes.self)
        // Add more types here in the future without changing other code
    }
    
    // Generic method to monitor start tokens
    private func monitorStartTokens<T: OutsLiveActivityAttributes>(for attributeType: T.Type) {
        Task {
            for await token in Activity<T>.pushToStartTokenUpdates {
                notifyToken(token, type: .start)
            }
        }
    }
    
    // Generic method to monitor activity updates
    private func monitorActivityUpdates<T: OutsLiveActivityAttributes>(for attributeType: T.Type) {
        let typeName = String(describing: attributeType)
        
        Task {
            for await activity in Activity<T>.activityUpdates {
                // Store reference to activity
                if var activityArray = activities[typeName] as? [Activity<T>] {
                    activityArray.append(activity)
                    activities[typeName] = activityArray
                }
                
                await monitorPushTokens(for: activity)
            }
        }
    }
    
    // Generic function to monitor push tokens for any activity type
    private func monitorPushTokens<T: ActivityAttributes>(for activity: Activity<T>) async {
        for await token in activity.pushTokenUpdates {
            notifyToken(token, type: .update)
        }
    }
    
    // Helper to get all current live activities (for debugging)
    func logAllActivities() {
        var activityCounts: [(String, Int)] = []
        
        for (typeName, typeValue) in registeredTypes {
            if typeValue is LinearAttributes.Type {
                activityCounts.append((typeName, Activity<LinearAttributes>.activities.count))
            } else if typeValue is RadialAttributes.Type {
                activityCounts.append((typeName, Activity<RadialAttributes>.activities.count))
            }
            // Add more type checks as needed when you add new activity types
        }
        
        let statusMessage = activityCounts
            .map { "\($0.0): \($0.1)" }
            .joined(separator: ", ")
        
        print("Currently active: \(statusMessage)")
    }
    
    /*
    // Backward compatibility methods
    func monitorPushToStartTokens() {
        // This method is kept for backward compatibility
        // You can now just call initialize() instead
        initialize()
    }
    
    func monitorNewActivities() {
        // This method is kept for backward compatibility
        // The monitoring is now handled within initialize()
        // This does nothing but is kept to avoid breaking existing code
    }
    */
}

extension LiveActivityManager: @unchecked Sendable {}
