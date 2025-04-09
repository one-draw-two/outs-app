  # Restore Capacitor iOs

- Select team for Signing & Capabilities

- Add Capabilities
  - Push Notifications

- Add GoogleService-Info(plist)

- Edit Info(plist)
  -
    ```
    <key>NSSupportsLiveActivities</key>
    <true/>
    <key>NSSupportsLiveActivitiesFrequentUpdates</key>
    <true/>

    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
    <key>com.apple.security.application-groups</key>
    <array>
      <string>group.your.bundle.identifier</string>
    </array>
    ```
    
- Add Widgets bundle (WidgetExtensions target) and Shared (as a Framework target)
  - Important note: You need to convert thr directories into Groups otherwise Xcode witll give a build error:
  - https://www.reddit.com/r/iOSProgramming/comments/1exsax9/comment/lj8njst

- At AppDelegate
  - Add the LiveActivities starters
  - Add Notification listeners

- Generate Capacitor icons

- 
```
In Xcode, click on your project scheme selector in the top bar (next to the run/stop buttons)
Select "Edit Scheme..."
In the scheme editor, select the "Run" action on the left sidebar
Go to the "Arguments" tab
In the "Environment Variables" section, click the "+" button
Add a new variable with:

Name: _XCWidgetKind
Value: widgets (this should match one of your widget kinds defined in your WidgetBundle)
```

- Make sure to restart Xcode, and clear build folder and delete the app entirely. Otherwise some widget errors appear

- Also, Schemes get broken so you can try creating a new Scheme (on Xcode) and make sure you are including both targets.

- Sample json:

```
{
    "aps": {
        "timestamp": 1234,
        "event": "start",
        "content-state": {
            "status": "Started",
            "progress": 0
        },
        "attributes-type": "OutsWednesdayLiveActivityAttributes",
        "attributes": {
            "title": "New Round Started"
        },
        "alert": {
            "title": "New Round",
            "body": "Round has started!"
        }
    }
}
```