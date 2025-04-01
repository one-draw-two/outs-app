
import ActivityKit
import Foundation

import os.log

public extension Logger {
    private static let subsystem = Bundle.main.bundleIdentifier ?? "com.default"
    static let liveActivity = Logger(subsystem: subsystem, category: "⚽️ 🎯 liveactivity")
    static let deepLink = Logger(subsystem: subsystem, category: "⚽️ 🔗 deeplink")
}

class LiveActivityManager {
    
    static let shared = LiveActivityManager()
    private var currentActivity: Activity<OutsYoNewLiveActivityAttributes>?
    
    private static func formatPushToken(_ token: Data) -> String { return token.reduce("") { $0 + String(format: "%02x", $1) } }
        
    func monitorPushToStartToken() {
        Task {
            for await token in Activity<OutsYoNewLiveActivityAttributes>.pushToStartTokenUpdates {
                Logger.liveActivity.log("🔔 New push token received (without manual start): \(Self.formatPushToken(token))")
            }
        }
    }
    
    func monitorNewActivities() {
        Task {
            for await activity in Activity<OutsYoNewLiveActivityAttributes>.activityUpdates {
                Logger.liveActivity.log("🎯 New live activity detected: \(activity.id)")
                print(activity)
                currentActivity = activity
                await monitorPushTokens(for: activity)
            }
        }
    }
    
    private func monitorPushTokens(for activity: Activity<OutsYoNewLiveActivityAttributes>) async {
        for await token in activity.pushTokenUpdates {
            Logger.liveActivity.log("📲 New push token registered (for updates): \(Self.formatPushToken(token))")
        }
    }
    
    func updateProgress(_ progress: Double, status: String) {
        Task {
            let contentState = OutsYoNewLiveActivityAttributes.ContentState(status: status, progress: progress)
            await currentActivity?.update(ActivityContent(state: contentState, staleDate: nil))
        }
    }
    
    func endActivity() {
        Task {
            let finalContent = ActivityContent(state: currentActivity?.content.state ?? .init(status: "Completed", progress: 1.0), staleDate: nil)
            await currentActivity?.end(finalContent, dismissalPolicy: .immediate)
        }
    }
}

extension LiveActivityManager : @unchecked Sendable {}
