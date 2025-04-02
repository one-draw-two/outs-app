
import Foundation
import Capacitor

@objc(LiveActivityPlugin)
public class LiveActivityPlugin: CAPPlugin {

    @objc func startLiveActivity(_ call: CAPPluginCall) {
        
        print("I AM CALLED")
        
        DispatchQueue.main.async {
            
            print("I AM INSIDE")
            LiveActivityManager.shared.startLiveActivity()
            call.resolve(["message": "Live Activity started"])
        }
    }
}
