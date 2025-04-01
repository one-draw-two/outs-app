//
//  PizzaDeliveryAttributes.swift
//  OutsYo
//
//  Created by Kemal Yalcinkaya on 19.12.24.
//


import Foundation
import ActivityKit


struct OutsYoNewLiveActivityAttributes: ActivityAttributes {
    public typealias OutsYoStatus = ContentState

    public struct ContentState: Codable, Hashable {
        var status: String
        var progress: Double
    }
    
    var title: String
}
