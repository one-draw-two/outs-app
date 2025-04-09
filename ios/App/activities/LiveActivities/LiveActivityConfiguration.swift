import SwiftUI
import WidgetKit
import ActivityKit

struct OutsLiveActivityConfiguration: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: OutsWednesdayLiveActivityAttributes.self) { context in
            // Lock screen/banner UI
            VStack {
                Text(context.attributes.title)
                    .font(.headline)
                Text(context.state.status)
                    .font(.subheadline)
                ProgressView(value: context.state.progress)
                    .tint(.blue)
            }
            .padding()
            
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI
                DynamicIslandExpandedRegion(.center) {
                    VStack {
                        Text(context.attributes.title)
                        Text(context.state.status)
                        ProgressView(value: context.state.progress)
                    }
                }
            } compactLeading: {
                // Compact leading UI
                Text("\(Int(context.state.progress * 100))%")
            } compactTrailing: {
                // Compact trailing UI
                Image(systemName: "hourglass")
            } minimal: {
                // Minimal UI
                Image(systemName: "dot.radiowaves.left.and.right")
            }
        }
    }
}
