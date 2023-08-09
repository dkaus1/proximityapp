import Foundation
import CoreBluetooth
import UserNotifications

@objc(BluetoothModule)
class BluetoothModule: NSObject, RCTBridgeModule {
  // Expose methods to React Native
  @objc func startScanning() {
    // Implement Bluetooth scanning logic and proximity detection
    // When proximity is detected, trigger a local notification
    scheduleLocalNotification()
  }
  // Required method to expose module to React Native
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  private func scheduleLocalNotification() {
    let content = UNMutableNotificationContent()
    content.title = "Proximity Alert"
    content.body = "You are near another device!"
    
    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(identifier: "ProximityNotification", content: content, trigger: trigger)
    
    UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
  }
}
