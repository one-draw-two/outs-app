
import ActivityKit
import Foundation

import Shared

class OutstandingLiveActivityManager {
    static let shared = OutstandingLiveActivityManager()
    private var currentActivity: Activity<OutstandingLiveActivityAttributes>?
    
    private static func formatPushToken(_ token: Data) -> String { return token.reduce("") { $0 + String(format: "%02x", $1) } }
    
    func startRoundActivity(roundId: String) {
        
        Logger.liveActivity.log("🎬 Starting live activity for round: \(roundId)")
        
        let attributes = OutstandingLiveActivityAttributes(title: "Round: \(roundId)")
        let contentState = OutstandingLiveActivityAttributes.ContentState(status: "Started", progress: 0.0)
        
        do {
            currentActivity = try Activity<OutstandingLiveActivityAttributes>.request(
                attributes: attributes,
                content: .init(state: contentState, staleDate: nil),
                pushType: .token
            )
            

        } catch {
            print("Error starting activity: \(error.localizedDescription)")
        }
        
        if let activity = currentActivity {
            Task {
                await monitorPushTokens(for: activity)
            }
        }
    }
    
    func monitorPushToStartToken() {
        Task {
            for await token in Activity<OutstandingLiveActivityAttributes>.pushToStartTokenUpdates {
                Logger.liveActivity.log("🔔 New push token received (without manual start): \(Self.formatPushToken(token))")
            }
        }
    }
    
    func monitorNewActivities() {
        Task {
            for await activity in Activity<OutstandingLiveActivityAttributes>.activityUpdates {
                Logger.liveActivity.log("🎯 New live activity detected: \(activity.id)")
                currentActivity = activity
                await monitorPushTokens(for: activity)
            }
        }
    }
    
    private func monitorPushTokens(for activity: Activity<OutstandingLiveActivityAttributes>) async {
        for await token in activity.pushTokenUpdates {
            Logger.liveActivity.log("📲 New push token registered (for updates): \(Self.formatPushToken(token))")
        }
    }
    
    func updateProgress(_ progress: Double, status: String) {
        Task {
            let contentState = OutstandingLiveActivityAttributes.ContentState(status: status, progress: progress)
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

extension OutstandingLiveActivityManager : @unchecked Sendable {}
