## Hook Event List

Hook Scripts attach to objects to enable scripts to respond to user actions

### Complete Events List 
The following events are built in as declarations: 

- OnShow
- OnHide
- OnEvent
- OnEnter
- OnLeave
- OnMouseDown
- OnMouseWheel
- OnUpdate
- OnValueChanged
- OnTextChanged

All other events can be used and referenced here: [Script Type events](https://warcraft.wiki.gg/wiki/Widget_script_handlers)

### Example Usage

```typescript
class MyAddon {
  private myFrame: Frame;

  constructor() {
    this.myFrame = CreateFrame("Frame", "MyFrame", UIParent);
    this.myFrame.SetSize(200, 100);
    this.myFrame.SetPoint("CENTER");

    this.myFrame.HookScript("OnShow", this.onFrameShow.bind(this));
    this.myFrame.HookScript("OnHide", this.onFrameHide.bind(this));
    this.myFrame.HookScript("OnEnter", this.onFrameEnter.bind(this));
    this.myFrame.HookScript("OnLeave", this.onFrameLeave.bind(this));

    const closeButton = CreateFrame("Button", "MyFrameCloseButton", this.myFrame, "UIPanelCloseButton");
    closeButton.SetPoint("TOPRIGHT", this.myFrame, "TOPRIGHT", -5, -5);
    closeButton.HookScript("OnClick", this.onCloseButtonClick.bind(this));
  }

  private onFrameShow(frame: Frame) {
    print("MyFrame is now visible!");
  }

  private onFrameHide(frame: Frame) {
    print("MyFrame is now hidden!");
  }

  private onFrameEnter(frame: Frame) {
    GameTooltip.SetOwner(frame, "ANCHOR_RIGHT");
    GameTooltip.SetText("This is my custom frame!");
    GameTooltip.Show();
  }

  private onFrameLeave(frame: Frame) {
    GameTooltip.Hide();
  }

  private onCloseButtonClick(button: Button) {
    this.myFrame.Hide();
  }
}

const addon = new MyAddon();
```

In this example, we create a custom addon class `MyAddon` that creates a frame named "MyFrame". We use the `HookScript` method to hook various event handlers to the frame:

- `OnShow`: Called when the frame becomes visible. We print a message to the console.
- `OnHide`: Called when the frame is hidden. We print a message to the console.
- `OnEnter`: Called when the mouse enters the frame. We display a tooltip with a custom message.
- `OnLeave`: Called when the mouse leaves the frame. We hide the tooltip.

We also create a close button for the frame and hook the `OnClick` event to hide the frame when the button is clicked.

By using `HookScript`, we can securely attach script handlers to widget events and customize the behavior of our addon's UI elements based on specific events.

## OnClick
This method is used to hook a script handler when the UIObject is clicked. 

### Parameters
- **event** (string): The name of the event to hook the script handler to. In this case, it is set to "OnClick", which represents the event triggered when the UI object is clicked.
- **handler** (function): The script handler function that will be called when the specified event occurs. It takes the following parameters:
  - **frame** (T): The UI object that triggered the event. It is of the same type as the object on which the `HookScript` method is called.
  - **button** (MouseButton): The mouse button that was clicked. It can be one of the following values: "LeftButton", "RightButton", "MiddleButton", "Button4", or "Button5".
  - **down** (boolean): Indicates whether the mouse button is in the down state (`true`) or up state (`false`).

### Returns
None

### Example Usage
```typescript
// Create a button
const myButton = CreateFrame("Button", "MyButton", UIParent, "UIPanelButtonTemplate");
myButton.SetSize(100, 30);
myButton.SetPoint("CENTER");
myButton.SetText("Click Me");

// Hook the OnClick event
myButton.HookScript("OnClick", (button, mouseButton, isButtonDown) => {
    if (mouseButton === "LeftButton" && isButtonDown) {
        print("Left button clicked!");
        // Perform additional actions here
        if (IsShiftKeyDown()) {
            print("Shift key is being held down.");
        }
        if (IsControlKeyDown()) {
            print("Control key is being held down.");
        }
        if (IsAltKeyDown()) {
            print("Alt key is being held down.");
        }
    }
});

// Show the button
myButton.Show();
```

In this example:
1. We create a button frame using `CreateFrame` and set its size, position, and text.
2. We use the `HookScript` method to hook the "OnClick" event of the button.
3. Inside the script handler function, we check if the left mouse button is clicked and if it is in the down state.
4. If the conditions are met, we print a message indicating that the left button was clicked.
5. We can perform additional actions based on the button click, such as checking if modifier keys (Shift, Control, Alt) are being held down using the corresponding functions (`IsShiftKeyDown`, `IsControlKeyDown`, `IsAltKeyDown`).
6. Finally, we show the button using the `Show` method.

When the button is clicked with the left mouse button, the script handler function will be executed, and the appropriate actions will be performed based on the button click and any modifier keys being held down.

## OnEnter & OnLeave

This hook handles when the cursor enters or leaves a region. 

### Parameters

**event** (`"OnEnter"` | `"OnLeave"`) - The event to hook the handler to. Can be either `"OnEnter"` or `"OnLeave"`.

**handler** (`(frame: T, motion: Unknown) => void`) - The script handler function to be called when the specified event occurs. The handler function receives the following parameters:
  - **frame** (T) - The frame that triggered the event.
  - **motion** (Unknown) - Additional information about the event, if available.

### Returns

None

### Example Usage

Hook script handlers to the "OnEnter" and "OnLeave" events of a button to display tooltips and perform actions.

```typescript
const button = CreateFrame("Button", "MyButton", UIParent, "UIPanelButtonTemplate");
button.SetPoint("CENTER");
button.SetSize(100, 30);
button.SetText("Click Me");

button.HookScript("OnEnter", (frame) => {
  GameTooltip.SetOwner(frame, "ANCHOR_RIGHT");
  GameTooltip.AddLine("This is a custom button");
  GameTooltip.AddLine("Click to perform an action");
  GameTooltip.Show();
});

button.HookScript("OnLeave", () => {
  GameTooltip.Hide();
});

button.HookScript("OnClick", () => {
  print("Button clicked!");

  // Perform additional actions here
  const playerName = UnitName("player");
  const playerLevel = UnitLevel("player");

  if (playerLevel >= 60) {
    button.Disable();
    print(`${playerName}, you have reached the maximum level!`);
  } else {
    print(`${playerName}, you are currently level ${playerLevel}`);
  }
});
```

In this example:
1. We create a custom button frame using `CreateFrame` and position it at the center of the screen.
2. We set the button's size and text using `SetSize` and `SetText`.
3. We hook a script handler to the "OnEnter" event of the button using `HookScript`. When the mouse enters the button, the handler function is called.
   - Inside the "OnEnter" handler, we set the owner of the tooltip to the button frame and anchor it to the right side using `GameTooltip.SetOwner`.
   - We add lines of text to the tooltip using `GameTooltip.AddLine` to provide information about the button.
   - We show the tooltip using `GameTooltip.Show`.
4. We hook a script handler to the "OnLeave" event of the button. When the mouse leaves the button, the handler function is called, and we hide the tooltip using `GameTooltip.Hide`.
5. We hook a script handler to the "OnClick" event of the button. When the button is clicked, the handler function is called.
   - Inside the "OnClick" handler, we print a message indicating that the button was clicked.
   - We retrieve the player's name and level using `UnitName` and `UnitLevel`.
   - If the player's level is greater than or equal to 60, we disable the button using `button.Disable()` and print a message indicating that the player has reached the maximum level.
   - If the player's level is below 60, we print a message showing the player's current level.


## OnEvent

Generic handler that attaches to allow you to attach a handler to listen to any event fired on ths UIObject. 

### Parameters

- **event** (string): The name of the event to hook. It should be a valid event name such as "OnEvent".
- **handler** (function): The script handler function to be called when the specified event occurs. The handler function receives the following parameters:
  - **frame** (T): The frame object on which the event occurred.
  - **eventName** (Event.OnAny & Event): The name of the event that triggered the script.
  - **...args** (any[]): Additional arguments passed to the script handler, depending on the specific event.

### Returns

This method does not return any value.

### Example Usage

```typescript
// Create a custom frame
const myFrame = CreateFrame("Frame");

// Define the script handler function
function handleEvent(frame: Frame, eventName: Event.OnAny & Event, ...args: any[]) {
  if (eventName === "PLAYER_ENTERING_WORLD") {
    print("Player entered the world!");
  } else if (eventName === "PLAYER_LEAVING_WORLD") {
    print("Player left the world!");
  }
}

// Hook the script handler to the "OnEvent" event of the frame
myFrame.HookScript("OnEvent", handleEvent);

// Register the events you want to handle
myFrame.RegisterEvent("PLAYER_ENTERING_WORLD");
myFrame.RegisterEvent("PLAYER_LEAVING_WORLD");

// Function to handle combat log events
function handleCombatLogEvent(frame: Frame, eventName: Event.OnAny & Event, ...args: any[]) {
  const [timestamp, subEvent, hideCaster, sourceGUID, sourceName, sourceFlags, sourceRaidFlags, destGUID, destName, destFlags, destRaidFlags, ...params] = args;

  if (subEvent === "SPELL_DAMAGE") {
    const [spellId, spellName, spellSchool, amount, overkill, school, resisted, blocked, absorbed, critical, glancing, crushing, isOffHand] = params;
    print(`${sourceName} dealt ${amount} damage to ${destName} with ${spellName}`);
  }
}

// Create a custom combat log frame
const combatLogFrame = CreateFrame("Frame");

// Hook the script handler to the "OnEvent" event of the combat log frame
combatLogFrame.HookScript("OnEvent", handleCombatLogEvent);

// Register the combat log event
combatLogFrame.RegisterEvent("COMBAT_LOG_EVENT_UNFILTERED");
```

In this example:
1. We create a custom frame using `CreateFrame`.
2. We define a script handler function called `handleEvent` that checks the event name and performs different actions based on the event.
3. We hook the `handleEvent` function to the "OnEvent" event of the frame using `myFrame.HookScript("OnEvent", handleEvent)`.
4. We register the desired events using `myFrame.RegisterEvent`. In this case, we register "PLAYER_ENTERING_WORLD" and "PLAYER_LEAVING_WORLD" events.
5. We create another custom frame called `combatLogFrame` to handle combat log events.
6. We define a script handler function called `handleCombatLogEvent` that processes the combat log event data and prints information about spell damage events.
7. We hook the `handleCombatLogEvent` function to the "OnEvent" event of the `combatLogFrame` using `combatLogFrame.HookScript("OnEvent", handleCombatLogEvent)`.
8. We register the "COMBAT_LOG_EVENT_UNFILTERED" event using `combatLogFrame.RegisterEvent` to receive combat log events.

## OnHide & OnShow & OnLoad

Hook for handling common events for when a UIObject is shown, hidden, or initially loaded. 

### Parameters

- **event** (string): The name of the event to hook. It can be one of the following:
  - `"OnHide"`: Triggered when the frame is hidden.
  - `"OnShow"`: Triggered when the frame is shown.
  - `"OnLoad"`: Triggered when the frame is loaded.
- **handler** (function): The function to be executed when the specified event occurs. It takes the frame object as a parameter.

### Example Usage

```typescript
class MyAddon {
  private myFrame: Frame;

  constructor() {
    this.myFrame = CreateFrame("Frame", "MyFrame", UIParent);
    this.myFrame.SetSize(200, 100);
    this.myFrame.SetPoint("CENTER");

    this.myFrame.HookScript("OnShow", this.handleOnShow);
    this.myFrame.HookScript("OnHide", this.handleOnHide);
    this.myFrame.HookScript("OnLoad", this.handleOnLoad);

    this.myFrame.Hide();
  }

  private handleOnShow(frame: Frame) {
    print("MyFrame is shown!");
    frame.SetBackdropColor(0, 1, 0, 0.5); // Set green background color when shown
  }

  private handleOnHide(frame: Frame) {
    print("MyFrame is hidden!");
    frame.SetBackdropColor(1, 0, 0, 0.5); // Set red background color when hidden
  }

  private handleOnLoad(frame: Frame) {
    print("MyFrame is loaded!");
    frame.SetBackdropColor(0, 0, 1, 0.5); // Set blue background color when loaded
    frame.RegisterEvent("PLAYER_ENTERING_WORLD");
    frame.SetScript("OnEvent", (_, event) => {
      if (event === "PLAYER_ENTERING_WORLD") {
        frame.Show();
      }
    });
  }
}

const addon = new MyAddon();
```

In this example:

1. We create a new frame called "MyFrame" using `CreateFrame` and set its size and position.

2. We use `HookScript` to register script handlers for the `"OnShow"`, `"OnHide"`, and `"OnLoad"` events.

3. In the `handleOnShow` function, we print a message indicating that the frame is shown and set its background color to green.

4. In the `handleOnHide` function, we print a message indicating that the frame is hidden and set its background color to red.

5. In the `handleOnLoad` function, we print a message indicating that the frame is loaded and set its background color to blue. We also register the `"PLAYER_ENTERING_WORLD"` event and set up an event handler using `SetScript`. When the player enters the world, the frame will be shown.

## OnMouseDown & OnMouseUp

Hooks for mouse related events

### Parameters

**event** (`"OnMouseDown"` | `"OnMouseUp"`) - The event to hook the handler to. Can be either `"OnMouseDown"` or `"OnMouseUp"`.

**handler** (`(frame: T, button: MouseButton) => void`) - The function to be called when the specified event occurs. It receives the following parameters:
  - `frame` (T): The frame that triggered the event.
  - `button` (MouseButton): The mouse button that was pressed or released.

### Returns

None

### Example Usage

```typescript
// Create a frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Define the event handlers
const onMouseDown = (frame: UIFrame, button: MouseButton) => {
  if (button === "LeftButton") {
    print("Left mouse button pressed on the frame!");
  } else if (button === "RightButton") {
    print("Right mouse button pressed on the frame!");
  }
};

const onMouseUp = (frame: UIFrame, button: MouseButton) => {
  if (button === "LeftButton") {
    print("Left mouse button released on the frame!");
  } else if (button === "RightButton") {
    print("Right mouse button released on the frame!");
  }
};

// Hook the event handlers to the frame
myFrame.HookScript("OnMouseDown", onMouseDown);
myFrame.HookScript("OnMouseUp", onMouseUp);

// Create a texture for the frame
const myTexture = myFrame.CreateTexture(nil, "BACKGROUND");
myTexture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture");
myTexture.SetAllPoints(myFrame);

// Enable mouse events on the frame
myFrame.EnableMouse(true);

// Show the frame
myFrame.Show();
```

In this example:
1. We create a frame named "MyFrame" using `CreateFrame()`.
2. We define two event handlers, `onMouseDown` and `onMouseUp`, which will be called when the corresponding mouse events occur on the frame.
3. Inside the event handlers, we check which mouse button was pressed or released using the `button` parameter and print a message accordingly.
4. We hook the event handlers to the frame using `myFrame.HookScript()`, specifying the event names and the corresponding handler functions.
5. We create a texture for the frame using `myFrame.CreateTexture()` and set its properties.
6. We enable mouse events on the frame using `myFrame.EnableMouse(true)` to allow the frame to receive mouse input.
7. Finally, we show the frame using `myFrame.Show()`.

Now, whenever the left or right mouse button is pressed or released on the frame, the corresponding event handler will be called, and the appropriate message will be printed.

## OnMouseWheel

Handles when a mouse scroll is used with a UIObject

### Parameters

- **event** (string): The name of the event to hook the script to. In this case, it should be `"OnMouseWheel"`.
- **handler** (function): The function to be called when the event is triggered. It takes the following parameters:
  - **frame** (T): The frame object that the event is hooked to.
  - **delta** (MouseWheelDelta): The delta value indicating the direction and magnitude of the mouse wheel scroll.

### Returns

- **void**

### Example Usage

```typescript
// Create a frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a font string to display the scroll delta
const scrollText = myFrame.CreateFontString("ScrollText", "OVERLAY", "GameFontNormal");
scrollText.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Hook the OnMouseWheel event to the frame
myFrame.HookScript("OnMouseWheel", (frame, delta) => {
  // Update the scroll text with the delta value
  scrollText.SetText(`Scroll Delta: ${delta}`);

  // Perform actions based on the scroll direction
  if (delta > 0) {
    // Scrolling up
    myFrame.SetAlpha(myFrame.GetAlpha() + 0.1);
  } else {
    // Scrolling down
    myFrame.SetAlpha(myFrame.GetAlpha() - 0.1);
  }

  // Clamp the frame's opacity between 0 and 1
  myFrame.SetAlpha(Math.max(0, Math.min(1, myFrame.GetAlpha())));
});
```

In this example:

1. We create a frame named "MyFrame" using the `CreateFrame` function and set its size and position.

2. We create a font string named "ScrollText" as a child of the frame to display the scroll delta value.

3. We use the `HookScript` method to hook the `"OnMouseWheel"` event to the frame.

4. Inside the event handler function, we update the scroll text to display the current scroll delta value using `scrollText.SetText()`.

5. We perform actions based on the scroll direction. If `delta` is positive, it means scrolling up, so we increase the frame's opacity using `myFrame.SetAlpha()`. If `delta` is negative, it means scrolling down, so we decrease the frame's opacity.

6. Finally, we clamp the frame's opacity between 0 and 1 using `Math.max()` and `Math.min()` to ensure it stays within a valid range.

This example demonstrates how to hook the `"OnMouseWheel"` event to a frame and perform actions based on the scroll direction and magnitude. The scroll delta value is displayed on the frame using a font string, and the frame's opacity is adjusted accordingly.

## OnUpdate

Is called when a UIObject is redrawn into the UI. 

### Parameters

- **event** (string): The name of the event to hook. In this case, it is `"OnUpdate"`.
- **handler** (function): The function to be called when the specified event occurs. It takes two parameters:
  - **frame** (T): The frame object that triggered the event.
  - **elapsed** (number): The time elapsed since the last frame update, in seconds.

### Returns

This method does not return any value.

### Example Usage

```typescript
class MyAddon {
  private frame: Frame;

  constructor() {
    this.frame = CreateFrame("Frame", "MyAddonFrame", UIParent);
    this.frame.SetSize(200, 100);
    this.frame.SetPoint("CENTER");

    this.frame.HookScript("OnUpdate", this.onUpdate.bind(this));
  }

  private onUpdate(frame: Frame, elapsed: number) {
    // Calculate the total elapsed time
    const totalElapsed = frame.GetAttribute<number>("totalElapsed") || 0;
    frame.SetAttribute("totalElapsed", totalElapsed + elapsed);

    // Update the frame every second
    if (totalElapsed >= 1) {
      frame.SetAttribute("totalElapsed", 0);
      this.updateFrame(frame);
    }
  }

  private updateFrame(frame: Frame) {
    // Perform frame updates here
    const text = frame.CreateFontString(frame.GetName() + "Text", "OVERLAY", "GameFontNormal");
    text.SetPoint("CENTER");
    text.SetText("Elapsed Time: " + GetTime());
  }
}

// Create an instance of the addon
const myAddon = new MyAddon();
```

In this example, we create a custom addon class called `MyAddon`. Inside the constructor, we create a new frame using `CreateFrame` and set its size and position.

We then use the `HookScript` method to register a script handler for the `"OnUpdate"` event on the frame. The `onUpdate` method will be called every frame update.

Inside the `onUpdate` method, we calculate the total elapsed time by storing it as an attribute on the frame using `SetAttribute`. We check if the total elapsed time has reached or exceeded 1 second. If so, we reset the total elapsed time and call the `updateFrame` method.

The `updateFrame` method is where you can perform any desired updates to the frame. In this example, we create a font string using `CreateFontString`, set its position to the center of the frame, and set its text to display the current elapsed time using `GetTime()`.

Finally, we create an instance of the `MyAddon` class to initialize the addon.

This example demonstrates how to use the `HookScript` method to register a script handler for the `"OnUpdate"` event and perform frame updates based on the elapsed time.

## OnValueChanged & OnTextChange

Handles when a UIObject with a set value or text is updated. 

### Parameters

**event** string - The event to hook the script to. In this case, the event is "OnValueChanged".

**handler** function - The script handler function to be called when the specified event occurs. The handler function takes the following parameters:
- **frame** T - The frame object that triggered the event.
- **changed** any - The value that changed.

### Returns

None

### Example Usage

```typescript
class MyAddon {
  private myFrame: Frame;

  constructor() {
    this.myFrame = CreateFrame("Frame", "MyFrame", UIParent);
    this.myFrame.SetSize(200, 100);
    this.myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

    const textInput = CreateFrame("EditBox", "MyTextInput", this.myFrame);
    textInput.SetSize(150, 20);
    textInput.SetPoint("CENTER", this.myFrame, "CENTER", 0, 0);
    textInput.SetFontObject("ChatFontNormal");
    textInput.SetText("Enter text here");
    textInput.SetAutoFocus(false);
    textInput.SetScript("OnEscapePressed", () => {
      textInput.ClearFocus();
    });

    textInput.HookScript("OnTextChanged", (frame: EditBox, changed: any) => {
      print(`Text changed: ${changed}`);
      if (changed === "secret") {
        print("You entered the secret word!");
      }
    });
  }
}

const addon = new MyAddon();
```

In this example:
1. We create a custom addon class called `MyAddon`.
2. Inside the constructor, we create a frame named "MyFrame" and set its size and position.
3. We create an `EditBox` frame named "MyTextInput" as a child of "MyFrame".
4. We set the size, position, font, and initial text of the `EditBox`.
5. We set the `OnEscapePressed` script to clear the focus when the Escape key is pressed.
6. We use the `HookScript` method to hook the "OnTextChanged" event of the `EditBox`.
7. In the hooked script handler, we print the changed text and check if it matches a specific string.
8. If the entered text is "secret", we print a message indicating that the secret word was entered.
9. Finally, we create an instance of the `MyAddon` class to initialize the addon.

