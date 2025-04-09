
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
    private var currentActivity: Activity<OutsWednesdayLiveActivityAttributes>?
    
    private static func formatPushToken(_ token: Data) -> String { return token.reduce("") { $0 + String(format: "%02x", $1) } }
        
    func monitorPushToStartToken() {
        Task {
            for await token in Activity<OutsWednesdayLiveActivityAttributes>.pushToStartTokenUpdates {
                Logger.liveActivity.log("🔔 New push token received (without manual start): \(Self.formatPushToken(token))")
            }
        }
    }
    
    func monitorNewActivities() {
        Task {
            for await activity in Activity<OutsWednesdayLiveActivityAttributes>.activityUpdates {
                Logger.liveActivity.log("🎯 New live activity detected: \(activity.id)")
                print(activity)
                currentActivity = activity
                await monitorPushTokens(for: activity)
            }
        }
    }
    
    private func monitorPushTokens(for activity: Activity<OutsWednesdayLiveActivityAttributes>) async {
        for await token in activity.pushTokenUpdates {
            Logger.liveActivity.log("📲 New push token registered (for updates): \(Self.formatPushToken(token))")
        }
    }
    
    func updateProgress(_ progress: Double, status: String) {
        Task {
            let contentState = OutsWednesdayLiveActivityAttributes.ContentState(status: status, progress: progress)
            await currentActivity?.update(ActivityContent(state: contentState, staleDate: nil))
        }
    }
    
    func endActivity() {
        Task {
            let finalContent = ActivityContent(state: currentActivity?.content.state ?? .init(status: "Completed", progress: 1.0), staleDate: nil)
            await currentActivity?.end(finalContent, dismissalPolicy: .immediate)
        }
    }
    
    func startLiveActivity() {
        let attributes = OutsWednesdayLiveActivityAttributes(title: "My Live Activity") // <-- Provide a title
        let contentState = OutsWednesdayLiveActivityAttributes.ContentState(status: "Starting...", progress: 0.0)
        
        do {
            let activity = try Activity.request(
                attributes: attributes,
                contentState: contentState,
                pushType: .token // Ensure push updates are enabled
            )
            currentActivity = activity
            Logger.liveActivity.log("🚀 Live Activity Started: \(activity.id)")
        } catch {
            Logger.liveActivity.log("❌ Failed to start Live Activity: \(error.localizedDescription)")
        }
    }
}

extension LiveActivityManager : @unchecked Sendable {}
