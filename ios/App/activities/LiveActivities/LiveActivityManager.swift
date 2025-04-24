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
        // Don't clear existing registrations - that would lose track of active activities
        // Instead, only register if not already registered

        // Check if the types are already registered
        let linearTypeName = String(describing: LinearAttributes.self)
        let radialTypeName = String(describing: RadialAttributes.self)

        // Only register if not already registered
        if registeredTypes[linearTypeName] == nil {
            register(LinearAttributes.self)
        }

        if registeredTypes[radialTypeName] == nil {
            register(RadialAttributes.self)
        }

        // Always log current activities for debugging
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

        Task {
            for await activity in Activity<T>.activityUpdates {
                if var activities = self.activities[typeName] as? [Activity<T>] {
                    // Update or add the activity in our dictionary
                    if let index = activities.firstIndex(where: { $0.id == activity.id }) {
                        activities[index] = activity
                    } else {
                        activities.append(activity)
                    }
                    self.activities[typeName] = activities

                    // Set up push token monitoring for this activity
                    Task {
                        // Simple monitoring for the first token without try/catch since
                        // nothing throws in this loop
                        for await pushToken in activity.pushTokenUpdates {
                            // This code will run for each new token

                            print("instanceId: \(activity.id)")
                            print("activityType: \(typeName)")
                            print("pushToken: \(Self.formatPushToken(pushToken))")
                            print("timestamp: \(Date())")
                            print("korsan: Kemal")

                            NotificationCenter.default.post(
                                name: Notification.Name(LiveActivityTokenType.update.rawValue),
                                object: nil,
                                userInfo: [
                                    "token": Self.formatPushToken(pushToken),
                                    "activityType": typeName,
                                    "instanceId": activity.id,
                                    "timestamp": Date(),
                                    "korsan": "Kemal",
                                ]
                            )

                            print(
                                "Live Activity update token received for \(typeName), id: \(activity.id)"
                            )

                            // We only need the first token from this sequence for now
                            break
                        }
                    }
                }
            }
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
}

extension LiveActivityManager: @unchecked Sendable {}
