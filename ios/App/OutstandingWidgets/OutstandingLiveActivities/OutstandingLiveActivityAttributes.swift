//
//  PizzaDeliveryAttributes.swift
//  Outstanding
//
//  Created by Kemal Yalcinkaya on 19.12.24.
//


import Foundation
import ActivityKit


struct OutstandingLiveActivityAttributes: ActivityAttributes {
    public typealias OutstandingStatus = ContentState

    public struct ContentState: Codable, Hashable {
        var status: String
        var progress: Double
    }
    
    var title: String
}
