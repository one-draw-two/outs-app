//
//  Echo.swift
//  App
//
//  Created by Kemal Yalcinkaya on 02.04.25.
//


import Foundation

@objc public class Echo: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}