
import ActivityKit
import Foundation

enum LiveActivityTokenType: String {
    case start = "StartTokenReceived"
    case update = "UpdateTokenReceived"
}

class LiveActivityManager {
    
    static let shared = LiveActivityManager()
    private var currentActivity: Activity<OutsWednesdayLiveActivityAttributes>?    
    private static func formatPushToken(_ token: Data) -> String { return token.reduce("") { $0 + String(format: "%02x", $1) } }
    private func notifyToken(_ token: Data, type: LiveActivityTokenType) {
        let formattedToken = Self.formatPushToken(token)
        NotificationCenter.default.post(
            name: Notification.Name(type.rawValue),
            object: nil,
            userInfo: ["token": formattedToken]
        )
    }
        
    func monitorPushToStartToken() {
        Task {
            for await token in Activity<OutsWednesdayLiveActivityAttributes>.pushToStartTokenUpdates {
                notifyToken(token, type: .start)
            }
        }
    }

    private func monitorPushTokens(for activity: Activity<OutsWednesdayLiveActivityAttributes>) async {
        for await token in activity.pushTokenUpdates {
            notifyToken(token, type: .update)
        }
    }

    func monitorNewActivities() {
        Task {
            for await activity in Activity<OutsWednesdayLiveActivityAttributes>.activityUpdates {
                // Logger.liveActivity.log("🎯 New live activity detected: \(activity.id)")
                // currentActivity = activity
                await monitorPushTokens(for: activity)
            }
        }
    }
}

extension LiveActivityManager : @unchecked Sendable {}
