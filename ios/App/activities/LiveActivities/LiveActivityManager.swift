import ActivityKit
import Foundation

enum LiveActivityTokenType: String {
    case start = "StartTokenReceived"
    case update = "UpdateTokenReceived"
}

protocol OutsLiveActivityAttributes: ActivityAttributes where ContentState: Codable & Hashable {}

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

    private func notifyToken(
        _ token: Data, type: LiveActivityTokenType, activityTypeName: String? = nil
    ) {
        let formattedToken = Self.formatPushToken(token)
        var userInfo: [String: Any] = ["token": formattedToken, "timestamp": Date()]

        // Add activityType if provided
        if let typeName = activityTypeName {
            userInfo["activityType"] = typeName
        }

        NotificationCenter.default.post(
            name: Notification.Name(type.rawValue),
            object: nil,
            userInfo: userInfo
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
        /*
        // Don't clear existing registrations - that would lose track of active activities
        // Instead, only register if not already registered
        
        // Check if the types are already registered
        let linearTypeName = String(describing: LinearAttributes.self)
        let radialTypeName = String(describing: RadialAttributes.self)
        
        // Only register if not already registered
        if registeredTypes[linearTypeName] == nil {
        
        }
        
        if registeredTypes[radialTypeName] == nil {
            register(LinearAttributes.self)
            register(RadialAttributes.self)
        }
        
        // Always log current activities for debugging
        logAllActivities()
        */
        register(LinearAttributes.self)
        register(RadialAttributes.self)
        logAllActivities()
    }

    // Generic method to monitor start tokens
    private func monitorStartTokens<T: OutsLiveActivityAttributes>(for attributeType: T.Type) {
        let typeName = String(describing: attributeType)

        Task {
            for await token in Activity<T>.pushToStartTokenUpdates {
                notifyToken(token, type: .start, activityTypeName: typeName)
            }
        }
    }

    private func monitorActivityUpdates<T: OutsLiveActivityAttributes>(for type: T.Type) {
        let typeName = String(describing: type)

        // Use detached task to continue running in background
        Task.detached(priority: .background) {

            for await activity in Activity<T>.activityUpdates {
                if Task.isCancelled {
                    break
                }

                if var activities = self.activities[typeName] as? [Activity<T>] {
                    // Update activity in our dictionary
                    if let index = activities.firstIndex(where: { $0.id == activity.id }) {
                        activities[index] = activity
                    } else {
                        activities.append(activity)
                    }
                    self.activities[typeName] = activities

                    // Set up token monitoring in a separate detached task
                    Task.detached(priority: .background) {

                        for await pushToken in activity.pushTokenUpdates {
                            // Handle token updates
                            self.notifyToken(pushToken, type: .update, activityTypeName: typeName)

                            // Only break if we successfully processed the token
                            break
                        }

                    }
                }
            }

            // If we get here, the monitoring stopped - restart it after delay
            try? await Task.sleep(nanoseconds: 5_000_000_000)  // 5 seconds
            print("Activity monitoring for \(typeName) stopped - restarting")
            self.monitorActivityUpdates(for: type)
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

        let statusMessage =
            activityCounts
            .map { "\($0.0): \($0.1)" }
            .joined(separator: ", ")

        print("Currently active: \(statusMessage)")
    }

    func ensureBackgroundMonitoring() {
        for (_, typeValue) in registeredTypes {
            if typeValue is LinearAttributes.Type {
                monitorActivityUpdates(for: LinearAttributes.self)
            } else if typeValue is RadialAttributes.Type {
                monitorActivityUpdates(for: RadialAttributes.self)
            }
            // Add more types as needed
        }
    }
}

extension LiveActivityManager: @unchecked Sendable {}
