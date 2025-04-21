import ActivityKit
import SwiftUI
import WidgetKit

struct OutsLiveActivityConfiguration: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: OutsWednesdayLiveActivityAttributes.self) { context in
            // Lock screen/banner UI
            VStack {
                Text(context.state.endMessage ?? context.attributes.title)
                    .font(.headline)
                Text(context.state.status)
                    .font(.subheadline)

                // Progress bar with max value of 100
                ZStack(alignment: .leading) {
                    GeometryReader { geometry in
                        Rectangle()
                            .foregroundColor(.gray.opacity(0.3))
                            .frame(width: geometry.size.width, height: 12)

                        Rectangle()
                            .foregroundColor(.blue)
                            .frame(
                                width: min(
                                    CGFloat(context.state.progress) / 100.0 * geometry.size.width,
                                    geometry.size.width), height: 12)
                    }
                    .frame(height: 12)
                    .cornerRadius(6)
                }
                .padding(.vertical, 4)

                // Display numerical value
                Text("\(Int(context.state.progress))%")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI
                DynamicIslandExpandedRegion(.center) {
                    VStack {
                        Text(context.state.endMessage ?? context.attributes.title)
                            .font(.headline)
                        Text(context.state.status)
                            .font(.subheadline)

                        // Progress bar
                        ZStack(alignment: .leading) {
                            GeometryReader { geometry in
                                Rectangle()
                                    .foregroundColor(.gray.opacity(0.3))
                                    .frame(width: geometry.size.width, height: 8)

                                Rectangle()
                                    .foregroundColor(.blue)
                                    .frame(
                                        width: min(
                                            CGFloat(context.state.progress) / 100.0
                                                * geometry.size.width, geometry.size.width),
                                        height: 8)
                            }
                            .frame(height: 8)
                            .cornerRadius(4)
                        }
                        .padding(.vertical, 4)

                        Text("\(Int(context.state.progress))%")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)
                }
            } compactLeading: {
                // Compact leading UI
                Text("\(Int(context.state.progress))%")
            } compactTrailing: {
                // Compact trailing UI
                Image(systemName: "hourglass")
            } minimal: {
                // Minimal UI
                Text("\(Int(context.state.progress))")
                    .font(.caption2)
            }
        }
    }
}
