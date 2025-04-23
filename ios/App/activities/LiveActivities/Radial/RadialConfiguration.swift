import ActivityKit
import SwiftUI
import WidgetKit

struct RadialConfiguration: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: RadialAttributes.self) { context in
            // Lock screen/banner UI
            VStack {
                Text(context.state.endMessage ?? context.attributes.title)
                    .font(.headline)
                Text(context.state.status)
                    .font(.subheadline)
                
                // Radial progress
                ZStack {
                    Circle()
                        .stroke(lineWidth: 15)
                        .opacity(0.3)
                        .foregroundColor(.gray)
                    
                    Circle()
                        .trim(from: 0.0, to: min(CGFloat(context.state.progress) / 100.0, 1.0))
                        .stroke(style: StrokeStyle(lineWidth: 15, lineCap: .round, lineJoin: .round))
                        .foregroundColor(.green)
                        .rotationEffect(Angle(degrees: 270.0))
                        .animation(.linear, value: context.state.progress)
                    
                    Text("\(Int(context.state.progress))%")
                        .font(.title)
                        .bold()
                }
                .frame(width: 120, height: 120)
                .padding()
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
                        
                        ZStack {
                            Circle()
                                .stroke(lineWidth: 10)
                                .opacity(0.3)
                                .foregroundColor(.gray)
                            
                            Circle()
                                .trim(from: 0.0, to: min(CGFloat(context.state.progress) / 100.0, 1.0))
                                .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round, lineJoin: .round))
                                .foregroundColor(.green)
                                .rotationEffect(Angle(degrees: 270.0))
                            
                            Text("\(Int(context.state.progress))%")
                                .font(.body)
                                .bold()
                        }
                        .frame(width: 80, height: 80)
                        .padding(.vertical, 8)
                    }
                    .padding(.horizontal)
                }
            } compactLeading: {
                // Compact leading UI
                ZStack {
                    Circle()
                        .stroke(lineWidth: 2)
                        .opacity(0.3)
                        .foregroundColor(.gray)
                        .frame(width: 20, height: 20)
                    
                    Circle()
                        .trim(from: 0.0, to: min(CGFloat(context.state.progress) / 100.0, 1.0))
                        .stroke(style: StrokeStyle(lineWidth: 2, lineCap: .round))
                        .foregroundColor(.green)
                        .frame(width: 20, height: 20)
                        .rotationEffect(Angle(degrees: 270.0))
                }
            } compactTrailing: {
                // Compact trailing UI
                Text("\(Int(context.state.progress))%")
                    .font(.caption2)
            } minimal: {
                // Minimal UI
                ZStack {
                    Circle()
                        .fill(.green.opacity(0.3))
                        .frame(width: 18, height: 18)
                    
                    Text("\(Int(context.state.progress / 10))")
                        .font(.system(size: 10))
                        .bold()
                }
            }
        }
    }
}
