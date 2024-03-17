## SetScript

Changes the specified widget script handler.

### Parameters

- **event** (Event.OnAny): Name of the widget script handler to modify (OnShow, OnEvent, etc).
- **handler** ((frame: T, ...args: any[]) => void): The function to call when handling the specified widget event, or nil to remove the handler.

### Returns

None

### Example Usage

```typescript
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

myFrame.SetScript(Event.OnShow, (frame) => {
    print("Frame is shown!");
    
    // Create a button within the frame
    const myButton = CreateFrame("Button", "MyButton", frame, "UIPanelButtonTemplate");
    myButton.SetPoint("CENTER");
    myButton.SetSize(100, 50);
    myButton.SetText("Click Me!");
    
    // Set a click handler for the button
    myButton.SetScript(Event.OnClick, (button) => {
        print("Button clicked!");
        
        // Show a message box with a title and text
        UIErrorsFrame.AddMessage("Hello, World!", 1.0, 1.0, 1.0, 1.0, 5);
    });
});

myFrame.SetScript(Event.OnHide, (frame) => {
    print("Frame is hidden!");
    
    // Remove the button when the frame is hidden
    const myButton = frame.GetChild("MyButton") as Button;
    myButton.Hide();
    myButton.Destroy();
});

// Show the frame
myFrame.Show();

// Hide the frame after 5 seconds
AfterDelay(5, () => {
    myFrame.Hide();
});
```

In this example:

1. We create a new frame named "MyFrame" as a child of UIParent.

2. We set a script handler for the OnShow event of the frame using `SetScript`. Inside the handler, we print a message indicating that the frame is shown.

3. We create a button named "MyButton" as a child of the frame using `CreateFrame`. We set its position, size, and text using the respective methods.

4. We set a script handler for the OnClick event of the button using `SetScript`. Inside the handler, we print a message indicating that the button is clicked and show a message box using `UIErrorsFrame.AddMessage`.

5. We set a script handler for the OnHide event of the frame using `SetScript`. Inside the handler, we print a message indicating that the frame is hidden. We also retrieve the button using `GetChild`, hide it, and destroy it.

6. We show the frame using `myFrame.Show()`.

7. After a delay of 5 seconds using `AfterDelay`, we hide the frame using `myFrame.Hide()`, which triggers the OnHide event handler.

This example demonstrates how to use `SetScript` to associate script handlers with different events of a frame and its child elements, and how to perform actions based on those events.

## SetScript

This method is used to set a script handler for a specific event on a UI object. It allows you to define custom behavior when certain events occur, such as when a button is clicked or a frame is shown.

### Parameters

- **event** (string): The name of the event to set the script handler for. In this case, it is set to "OnClick".
- **handler** (function): The script handler function to be executed when the specified event occurs. The handler function takes the following parameters:
  - **frame** (T): The UI object that triggered the event.
  - **button** (MouseButton): The mouse button that was clicked (e.g., "LeftButton", "RightButton").
  - **down** (boolean): Indicates whether the button is in the down state (true) or up state (false).

### Returns

This method does not return any value.

### Example Usage

```typescript
const myButton = CreateFrame("Button", "MyButton", UIParent, "UIPanelButtonTemplate");
myButton.SetSize(100, 30);
myButton.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
myButton.SetText("Click Me!");

myButton.SetScript("OnClick", (frame, button, down) => {
  if (down) {
    if (button === "LeftButton") {
      print("Left button clicked!");
      // Perform action for left button click
      myButton.SetText("Left Clicked!");
    } else if (button === "RightButton") {
      print("Right button clicked!");
      // Perform action for right button click
      myButton.SetText("Right Clicked!");
    }
  } else {
    // Button is in the up state
    myButton.SetText("Click Me!");
  }
});
```

In this example:

1. We create a button frame named "MyButton" using the "UIPanelButtonTemplate".
2. We set the size of the button to 100 pixels wide and 30 pixels high.
3. We position the button at the center of the screen using the `SetPoint` method.
4. We set the text of the button to "Click Me!" using the `SetText` method.
5. We set the "OnClick" script handler for the button using the `SetScript` method.
6. Inside the script handler function, we check if the button is in the down state (`down` parameter is true).
   - If the left mouse button is clicked (`button` parameter is "LeftButton"), we print a message and set the button text to "Left Clicked!".
   - If the right mouse button is clicked (`button` parameter is "RightButton"), we print a message and set the button text to "Right Clicked!".
7. If the button is in the up state (`down` parameter is false), we reset the button text to "Click Me!".

This example demonstrates how to use the `SetScript` method to handle the "OnClick" event of a button and perform different actions based on the clicked mouse button.

## SetScript

Sets a script handler for a registered Eluna object.

### Parameters

**event** string - The event to register the script for. Can be one of the following:
- "OnEnter": Fired when the mouse enters the frame.
- "OnLeave": Fired when the mouse leaves the frame.

**handler** function - The script handler function to be called when the specified event occurs. The handler function receives the following parameters:
- **frame**: The frame that triggered the event.
- **motion**: Additional information about the event (e.g., mouse motion details).

### Returns

None

### Example Usage

```typescript
// Create a button frame
const myButton = CreateFrame("Button", "MyButton", UIParent, "UIPanelButtonTemplate");
myButton.SetSize(100, 30);
myButton.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
myButton.SetText("Hover Me!");

// Set the OnEnter script
myButton.SetScript("OnEnter", (frame, motion) => {
    // Change the button color on mouse enter
    frame.SetBackdropColor(1, 0, 0, 1);

    // Create a tooltip
    GameTooltip.SetOwner(frame, "ANCHOR_RIGHT");
    GameTooltip.SetText("This is a tooltip");
    GameTooltip.AddLine("Additional information", 1, 1, 1);
    GameTooltip.Show();
});

// Set the OnLeave script
myButton.SetScript("OnLeave", (frame, motion) => {
    // Restore the button color on mouse leave
    frame.SetBackdropColor(0.5, 0.5, 0.5, 1);

    // Hide the tooltip
    GameTooltip.Hide();
});
```

In this example, we create a button frame using `CreateFrame` and set its size, position, and text. We then use `SetScript` to register event handlers for the "OnEnter" and "OnLeave" events.

For the "OnEnter" event, we change the button color to red using `SetBackdropColor` to indicate that the mouse is hovering over the button. We also create a tooltip using `GameTooltip` to display additional information when the mouse enters the button. The tooltip is anchored to the right of the button and shows a title and an additional line of text.

For the "OnLeave" event, we restore the button color to its original state using `SetBackdropColor` and hide the tooltip using `GameTooltip.Hide()` when the mouse leaves the button.

This example demonstrates how to use `SetScript` to register event handlers for mouse enter and leave events on a frame, and how to manipulate the frame's appearance and display tooltips based on those events.

## SetScript

Sets a script handler for a specified event on a frame.

### Parameters

- **event** (string): The name of the event to be handled. Must be one of the valid event names for the frame.
- **handler** (function): The function to be called when the specified event occurs. The function should accept the following parameters:
  - **frame** (Frame): The frame that triggered the event.
  - **eventName** (string): The name of the event that occurred.
  - **...args** (any[]): Additional arguments passed by the event.

### Returns

None

### Example Usage

```typescript
// Create a frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Define the event handler function
function OnEventHandler(frame: Frame, eventName: Event, ...args: any[]) {
  if (eventName === "PLAYER_LOGIN") {
    print("Player logged in!");
    // Perform actions when the player logs in
    myFrame.Show();
    // ... other initialization logic ...
  } else if (eventName === "PLAYER_LOGOUT") {
    print("Player logged out!");
    // Perform cleanup or saving logic when the player logs out
    myFrame.Hide();
    // ... other cleanup logic ...
  }
}

// Set the event handler for the frame
myFrame.SetScript("OnEvent", OnEventHandler);

// Register the events you want to handle
myFrame.RegisterEvent("PLAYER_LOGIN");
myFrame.RegisterEvent("PLAYER_LOGOUT");
```

In this example:

1. We create a frame named "MyFrame" using the `CreateFrame` function.

2. We define an event handler function called `OnEventHandler` that accepts the `frame`, `eventName`, and additional `args` as parameters.

3. Inside the event handler function, we check the `eventName` to determine which event occurred.
   - If the event is "PLAYER_LOGIN", we perform actions related to player login, such as showing the frame and executing other initialization logic.
   - If the event is "PLAYER_LOGOUT", we perform cleanup or saving logic, such as hiding the frame and executing other cleanup tasks.

4. We set the event handler for the frame using the `SetScript` method, specifying "OnEvent" as the event and `OnEventHandler` as the handler function.

5. Finally, we register the events we want to handle using the `RegisterEvent` method. In this case, we register the "PLAYER_LOGIN" and "PLAYER_LOGOUT" events.

With this setup, whenever the registered events occur (player login or logout), the corresponding event handler function will be called, and the specified actions will be executed.

Note that the specific events and actions performed in the event handler function can vary based on your addon's requirements. You can customize the logic inside the event handler to suit your needs.

## SetScript

This method is used to set a script handler for a specific event on a UI Object. The script handler is a function that will be called when the specified event occurs.

### Parameters

**event** string - The name of the event to set the script handler for. Valid events are:
- "OnHide" - Fired when the UI Object is hidden.
- "OnShow" - Fired when the UI Object is shown.
- "OnLoad" - Fired when the UI Object is loaded.

**handler** function - The function to be called when the specified event occurs. The function will receive the UI Object as its only parameter.

### Example Usage

```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Set the size and position of the frame
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set a script handler for the OnLoad event
myFrame.SetScript("OnLoad", (frame) => {
    // Create a new button as a child of the frame
    const myButton = CreateFrame("Button", "MyButton", frame);
    myButton.SetSize(100, 50);
    myButton.SetPoint("CENTER", frame, "CENTER", 0, 0);
    
    // Set the text of the button
    const buttonText = myButton.CreateFontString(nil, "OVERLAY", "GameFontNormal");
    buttonText.SetText("Click me!");
    buttonText.SetPoint("CENTER", myButton, "CENTER", 0, 0);
    
    // Set a script handler for the OnClick event of the button
    myButton.SetScript("OnClick", () => {
        print("Button clicked!");
    });
});

// Set a script handler for the OnShow event
myFrame.SetScript("OnShow", (frame) => {
    print("Frame shown!");
});

// Set a script handler for the OnHide event
myFrame.SetScript("OnHide", (frame) => {
    print("Frame hidden!");
});

// Show the frame
myFrame.Show();
```

In this example, we create a new frame and set its size and position. We then set a script handler for the OnLoad event, which creates a new button as a child of the frame and sets its size, position, and text. We also set a script handler for the OnClick event of the button, which prints a message to the console when the button is clicked.

We then set script handlers for the OnShow and OnHide events of the frame, which print messages to the console when the frame is shown or hidden, respectively.

Finally, we show the frame, which triggers the OnLoad and OnShow events, causing their respective script handlers to be called.

## SetScript
This method is used to set a script handler for a specific event on a UI Object.

### Parameters
- **event** (string) - The event to set the script handler for. This can be one of the following values:
  - `"OnMouseDown"` - Fired when a mouse button is pressed down over the UI Object.
  - `"OnMouseUp"` - Fired when a mouse button is released over the UI Object.
- **handler** (function) - The function to be called when the specified event occurs. The handler function takes the following parameters:
  - **frame** (UIObject) - The UI Object that the event occurred on.
  - **button** (MouseButton) - The mouse button that triggered the event.

### Returns
This method does not return a value.

### Example Usage
```typescript
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 100);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

myFrame.SetScript("OnMouseDown", (frame, button) => {
  if (button === "LeftButton") {
    frame.SetBackdropColor(1, 0, 0, 1); // Set background color to red when left mouse button is pressed
  } else if (button === "RightButton") {
    frame.SetBackdropColor(0, 0, 1, 1); // Set background color to blue when right mouse button is pressed
  }
});

myFrame.SetScript("OnMouseUp", (frame, button) => {
  frame.SetBackdropColor(1, 1, 1, 1); // Reset background color when mouse button is released
});

myFrame.SetBackdrop({
  bgFile: "Interface\\DialogFrame\\UI-DialogBox-Background",
  edgeFile: "Interface\\DialogFrame\\UI-DialogBox-Border",
  tile: true,
  tileSize: 32,
  edgeSize: 32,
  insets: { left: 11, right: 12, top: 12, bottom: 11 },
});

myFrame.EnableMouse(true); // Enable mouse events for the frame
```

In this example, we create a new frame named "MyFrame" and set its size and position. We then use the `SetScript` method to set script handlers for the `"OnMouseDown"` and `"OnMouseUp"` events.

When the left mouse button is pressed down over the frame, the `"OnMouseDown"` handler is called, and we set the background color of the frame to red using `SetBackdropColor`. Similarly, when the right mouse button is pressed, we set the background color to blue.

When any mouse button is released over the frame, the `"OnMouseUp"` handler is called, and we reset the background color to white.

Finally, we set a backdrop for the frame using `SetBackdrop` to give it a visual appearance, and we enable mouse events for the frame using `EnableMouse(true)` so that the script handlers will be triggered.

This example demonstrates how to use the `SetScript` method to create interactive behavior for a UI Object based on mouse events.

## SetScript
This method is used to set a script handler for a specified event on a UI object.

### Parameters
- **event** string - The name of the event to set the script handler for. In this case, it is "OnMouseWheel".
- **handler** function - The function to be called when the specified event occurs. It takes the following parameters:
  - **frame** T - The UI object that the event occurred on.
  - **delta** MouseWheelDelta - The direction and magnitude of the mouse wheel scroll.

### Returns
None

### Example Usage
```typescript
// Create a frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a font string to display the scroll delta
const text = myFrame.CreateFontString("MyText", "OVERLAY", "GameFontNormal");
text.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Set the OnMouseWheel script handler
myFrame.SetScript("OnMouseWheel", (frame, delta) => {
  // Update the text to display the scroll delta
  text.SetText(`Scroll Delta: ${delta}`);

  // Adjust the frame's opacity based on the scroll direction
  if (delta > 0) {
    // Scrolled up, increase opacity
    myFrame.SetAlpha(myFrame.GetAlpha() + 0.1);
  } else {
    // Scrolled down, decrease opacity
    myFrame.SetAlpha(myFrame.GetAlpha() - 0.1);
  }

  // Clamp the opacity between 0 and 1
  const opacity = Math.min(Math.max(myFrame.GetAlpha(), 0), 1);
  myFrame.SetAlpha(opacity);
});
```

In this example:
1. We create a frame using `CreateFrame` and set its size and position.
2. We create a font string using `CreateFontString` to display the scroll delta.
3. We set the `OnMouseWheel` script handler using `SetScript`.
4. Inside the script handler function:
   - We update the text of the font string to display the scroll delta using `SetText`.
   - We adjust the frame's opacity based on the scroll direction:
     - If `delta` is positive (scrolled up), we increase the opacity using `SetAlpha`.
     - If `delta` is negative (scrolled down), we decrease the opacity using `SetAlpha`.
   - We clamp the opacity value between 0 and 1 to ensure it stays within a valid range.

When the user scrolls the mouse wheel over the frame, the `OnMouseWheel` script handler will be called. It will update the text to display the scroll delta and adjust the frame's opacity accordingly. Scrolling up will increase the opacity, making the frame more opaque, while scrolling down will decrease the opacity, making the frame more transparent.

## SetScript

The `SetScript` method is used to set a script handler for a specific event on an object. This allows you to define custom behavior for various events, such as updating the object every frame or handling user interactions.

### Parameters

- **event** (string): The name of the event to set the script handler for. In this case, it is set to `"OnUpdate"`.
- **handler** (function): The script handler function to be executed when the specified event occurs. The handler function takes two parameters:
  - **frame** (T): The object on which the script is set.
  - **elapsed** (number): The time elapsed since the last frame update.

### Returns

- **void**: This method does not return any value.

### Example Usage

```typescript
// Create a custom object
const myObject = CreateFrame("Frame");

// Set the OnUpdate script handler
myObject.SetScript("OnUpdate", (frame, elapsed) => {
  // Calculate the total elapsed time
  frame.totalElapsed = (frame.totalElapsed || 0) + elapsed;

  // Check if one second has passed
  if (frame.totalElapsed >= 1) {
    // Reset the total elapsed time
    frame.totalElapsed = 0;

    // Perform actions every second
    const currentTime = GetServerTime();
    const hours = math.floor(currentTime / 3600);
    const minutes = math.floor((currentTime % 3600) / 60);
    const seconds = currentTime % 60;

    // Format the time as HH:MM:SS
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Update the object's text with the current time
    frame.text = formattedTime;
  }
});
```

In this example:

1. We create a custom object using `CreateFrame("Frame")` and assign it to the variable `myObject`.

2. We set the `OnUpdate` script handler for `myObject` using the `SetScript` method.

3. Inside the script handler function, we calculate the total elapsed time by adding the `elapsed` parameter to the `frame.totalElapsed` property. If `frame.totalElapsed` doesn't exist, we initialize it to 0.

4. We check if the total elapsed time has reached or exceeded one second by comparing it with 1.

5. If one second has passed, we reset `frame.totalElapsed` to 0 to start counting again.

6. We perform actions that need to be executed every second. In this case, we retrieve the current server time using `GetServerTime()`.

7. We calculate the hours, minutes, and seconds from the current time using mathematical operations.

8. We format the time as "HH:MM:SS" using string manipulation and padding with leading zeros if necessary.

9. Finally, we update the `frame.text` property with the formatted time string. This assumes that the object has a text property that can be used to display the time.

This example demonstrates how to use the `SetScript` method to set an `OnUpdate` script handler that executes code every frame and performs specific actions every second, such as updating the object's text with the current time.

## SetScript
The `SetScript` method is used to set a script handler for a specific event on an object. This allows you to define custom behavior when certain events occur, such as when a value changes or when an object is clicked.

### Parameters
- **event** (string): The name of the event to set the script handler for. In this case, the event is `"OnValueChanged"`.
- **handler** (function): The function that will be called when the specified event occurs. The handler function takes the following parameters:
  - **frame** (T): The object that triggered the event.
  - **changed** (any): The value that changed, if applicable.

### Returns
- **void**: This method does not return any value.

### Example Usage
```typescript
class MyAddon {
  private myObject: ObjectSetScript;

  constructor() {
    this.myObject = new ObjectSetScript();
    this.myObject.SetScript("OnValueChanged", this.handleValueChanged.bind(this));
  }

  private handleValueChanged(frame: ObjectSetScript, changed: any) {
    const newValue = frame.GetValue();
    console.log(`Value changed from ${changed} to ${newValue}`);

    if (newValue > 100) {
      frame.SetValue(100);
      console.log("Value capped at 100");
    }

    if (newValue < 0) {
      frame.SetValue(0);
      console.log("Value cannot be negative");
    }

    // Perform additional actions based on the new value
    if (newValue === 50) {
      console.log("Half way there!");
    } else if (newValue === 100) {
      console.log("Reached the maximum value!");
    }
  }
}

const addon = new MyAddon();
```

In this example, we have a class called `MyAddon` that creates an instance of `ObjectSetScript`. We set a script handler for the `"OnValueChanged"` event using the `SetScript` method. The `handleValueChanged` function is defined as the event handler.

Inside the `handleValueChanged` function, we retrieve the new value using `frame.GetValue()`. We log a message indicating the value change. Then, we perform some additional checks and actions based on the new value.

If the new value is greater than 100, we cap it at 100 using `frame.SetValue(100)` and log a message. Similarly, if the new value is negative, we set it to 0 and log a message.

We also check for specific values and perform corresponding actions. If the value reaches 50, we log a message indicating that we're halfway there. If the value reaches 100, we log a message indicating that the maximum value has been reached.

This example demonstrates how you can use the `SetScript` method to define custom behavior when a value changes on an object. You can perform various actions, such as validating the new value, updating the object's state, triggering other events, or displaying messages based on the changed value.

## SetScript

Sets a script handler for a specified event on a frame.

### Parameters

- **event** (string): The name of the event to handle. In this case, it should be `"OnTextChanged"`.
- **handler** (function): The function to be called when the specified event occurs. The handler function receives the following parameters:
  - **frame** (T): The frame that triggered the event.
  - **isUserInput** (boolean): Indicates whether the text change was caused by user input or not.

### Returns

None

### Example Usage

```typescript
const inputFrame = CreateFrame("EditBox", "MyInputFrame", UIParent, "InputBoxTemplate");
inputFrame.SetSize(200, 20);
inputFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

inputFrame.SetScript("OnTextChanged", (frame, isUserInput) => {
  if (isUserInput) {
    const text = frame.GetText();
    if (text.length > 10) {
      frame.SetText(text.substring(0, 10));
      PrintError("Input is limited to 10 characters.");
    } else {
      Print(`You entered: ${text}`);
    }
  }
});

const button = CreateFrame("Button", "MyButton", UIParent, "UIPanelButtonTemplate");
button.SetSize(100, 30);
button.SetPoint("TOP", inputFrame, "BOTTOM", 0, -10);
button.SetText("Clear");

button.SetScript("OnClick", () => {
  inputFrame.SetText("");
  Print("Input cleared.");
});
```

In this example:

1. We create an `EditBox` frame named `"MyInputFrame"` using the `"InputBoxTemplate"`.
2. We set the size and position of the `EditBox` frame.
3. We set a script handler for the `"OnTextChanged"` event on the `EditBox` frame.
4. Inside the script handler, we check if the text change was caused by user input using the `isUserInput` parameter.
5. If it was user input, we get the current text using `frame.GetText()`.
6. We check if the length of the text exceeds 10 characters.
7. If it does, we truncate the text to the first 10 characters using `text.substring(0, 10)` and set it back to the `EditBox` using `frame.SetText()`.
8. We also display an error message using `PrintError()` to inform the user about the character limit.
9. If the text length is within the limit, we display the entered text using `Print()`.
10. We create a `Button` frame named `"MyButton"` using the `"UIPanelButtonTemplate"`.
11. We set the size and position of the `Button` frame below the `EditBox`.
12. We set the text of the `Button` to "Clear".
13. We set a script handler for the `"OnClick"` event on the `Button` frame.
14. Inside the script handler, we clear the text of the `EditBox` using `inputFrame.SetText("")` and display a message using `Print()`.

This example demonstrates how to use the `SetScript` method to handle the `"OnTextChanged"` event on an `EditBox` frame. It also shows how to create a `Button` frame and set a script handler for its `"OnClick"` event to clear the text in the `EditBox`.

## SetScript

The `SetScript` method is used to set a script handler for a specific event on a UI object. This allows you to define custom behavior when certain events occur, such as when a button is clicked or a frame is shown.

### Parameters

- **event** (string): The name of the event to set the script handler for. In this case, it is `"OnDragStart"`.
- **handler** (function): The script handler function to be called when the specified event occurs. The handler function takes the following parameters:
  - **frame** (T): The UI object that triggered the event.
  - **button** (MouseButton): The mouse button that was pressed to initiate the drag operation.

### Returns

None

### Example Usage

```typescript
// Create a custom frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER");
myFrame.SetBackdrop({
  bgFile: "Interface\\DialogFrame\\UI-DialogBox-Background",
  edgeFile: "Interface\\DialogFrame\\UI-DialogBox-Border",
  tile: true,
  tileSize: 32,
  edgeSize: 32,
  insets: { left: 11, right: 12, top: 12, bottom: 11 },
});

// Set the OnDragStart script handler
myFrame.SetScript("OnDragStart", (frame, button) => {
  if (button === "LeftButton") {
    frame.StartMoving();
  }
});

// Set the OnDragStop script handler
myFrame.SetScript("OnDragStop", (frame) => {
  frame.StopMovingOrSizing();
});

// Create a title for the frame
const titleFrame = myFrame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
titleFrame.SetPoint("TOP", 0, -5);
titleFrame.SetText("Draggable Frame");

// Create a close button for the frame
const closeButton = CreateFrame("Button", nil, myFrame, "UIPanelCloseButton");
closeButton.SetPoint("TOPRIGHT", -5, -5);
closeButton.SetScript("OnClick", () => {
  myFrame.Hide();
});
```

In this example, we create a custom frame called `MyFrame` and set its size, position, and backdrop. We then use the `SetScript` method to set the `OnDragStart` event handler. Inside the handler function, we check if the left mouse button was pressed and start moving the frame using the `StartMoving` method.

We also set the `OnDragStop` event handler to stop the frame from moving when the drag operation ends.

Finally, we create a title for the frame using a `FontString` and a close button using the `UIPanelCloseButton` template. The close button's `OnClick` event handler is set to hide the frame when clicked.

With these script handlers in place, the custom frame becomes draggable using the left mouse button, and it can be closed by clicking the close button.

## SetScript

This method is used to set a script handler for a specific event on a UI object. It allows you to define custom behavior when certain events occur, such as when the object is clicked, dragged, or updated.

### Parameters

- **event** (string): The name of the event to which you want to attach the script handler. In this case, the event is "OnDragStop".
- **handler** (function): The script handler function that will be called when the specified event occurs. The handler function takes two parameters:
  - **frame** (T): The UI object on which the event occurred. It is of the same type as the object on which the SetScript method is called.
  - **button** (MouseButton): The mouse button that was released to trigger the "OnDragStop" event.

### Returns

This method does not return any value.

### Example Usage

```typescript
// Create a frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER");
myFrame.SetBackdrop({
  bgFile: "Interface\\DialogFrame\\UI-DialogBox-Background",
  edgeFile: "Interface\\DialogFrame\\UI-DialogBox-Border",
  tile: true,
  tileSize: 32,
  edgeSize: 32,
  insets: { left: 11, right: 12, top: 12, bottom: 11 },
});

// Enable dragging for the frame
myFrame.SetMovable(true);
myFrame.EnableMouse(true);
myFrame.RegisterForDrag("LeftButton");

// Set the "OnDragStop" script handler
myFrame.SetScript("OnDragStop", (frame, button) => {
  // Get the current position of the frame
  const [point, relativeTo, relativePoint, xOfs, yOfs] = frame.GetPoint();

  // Print the position and button information
  print(`Frame position: (${xOfs}, ${yOfs})`);
  print(`Mouse button released: ${button}`);

  // Perform any additional actions or logic here
  // For example, you can save the frame position or trigger other events
});
```

In this example:

1. We create a frame named "MyFrame" using the `CreateFrame` function and set its size and position.

2. We enable dragging for the frame by setting it as movable, enabling mouse input, and registering it for dragging with the left mouse button.

3. We set the "OnDragStop" script handler using the `SetScript` method. The handler function is defined as an arrow function that takes two parameters: `frame` (the frame itself) and `button` (the mouse button that was released).

4. Inside the script handler, we retrieve the current position of the frame using the `GetPoint` method and store the relevant values in variables.

5. We print the frame position and the mouse button information using the `print` function.

6. You can perform any additional actions or logic inside the script handler based on your specific requirements. For example, you can save the frame position or trigger other events.

When the frame is dragged and released, the "OnDragStop" script handler will be called, executing the defined logic. This allows you to respond to the drag stop event and perform custom actions based on the frame and the released mouse button.

## SetScript

Sets a script handler for a specified event on a UI object.

### Parameters

- **event** (string): The name of the event to set the script handler for. In this case, the event is `"OnHyperlinkClick"`.
- **handler** (function): The script handler function to be called when the specified event occurs. The handler function takes the following parameters:
  - **frame** (T): The UI object on which the event occurred.
  - **link** (ItemLink): The hyperlink that was clicked.
  - **text** (string): The text associated with the hyperlink.
  - **button** (MouseButton): The mouse button that was used to click the hyperlink.
  - **region** (Region): The region of the UI object where the hyperlink was clicked.
  - **left** (number): The x-coordinate of the mouse click relative to the left edge of the UI object.

### Returns

This method does not return a value.

### Example Usage

```typescript
// Create a frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a font string within the frame
const fontString = frame.CreateFontString("MyFontString", "OVERLAY", "GameFontNormal");
fontString.SetPoint("CENTER", frame, "CENTER", 0, 0);
fontString.SetText("Click the |cff00ff00[Hyperlink]|r");

// Set the hyperlink click script
frame.SetScript("OnHyperlinkClick", (frame, link, text, button, region, left) => {
  // Check if the left mouse button was used
  if (button === "LeftButton") {
    // Extract the item ID from the hyperlink
    const itemId = link.match(/item:(\d+)/)?.[1];
    if (itemId) {
      // Open the item link in the default frame
      SetItemRef(link, text, "LeftButton", UIParent);
    }
  } else if (button === "RightButton") {
    // Show a message when right-clicking the hyperlink
    print(`You right-clicked the hyperlink: ${text}`);
  }
});
```

In this example:

1. We create a frame named "MyFrame" and set its size and position.
2. We create a font string named "MyFontString" within the frame and set its text to include a hyperlink.
3. We set the `OnHyperlinkClick` script on the frame using the `SetScript` method.
4. In the script handler function, we check which mouse button was used to click the hyperlink.
   - If the left mouse button was used, we extract the item ID from the hyperlink using a regular expression. If an item ID is found, we open the item link in the default frame using the `SetItemRef` function.
   - If the right mouse button was used, we display a message in the chat window indicating that the hyperlink was right-clicked.

This example demonstrates how to set a script handler for the `OnHyperlinkClick` event on a UI object and perform different actions based on the mouse button used to click the hyperlink.

## SetScript

The `SetScript` method is used to set a script handler for a specific event on a UI object. This method allows you to define a function that will be executed when the specified event occurs on the object.

### Parameters

- **event** (Event.OnAny): The event for which you want to set the script handler. It can be any valid event from the `Event.OnAny` enum.
- **handler** (optional) ((frame: T, ...args: any[]) => void): The function that will be called when the specified event occurs. It takes the following parameters:
  - **frame** (T): The UI object on which the event occurred.
  - **...args** (any[]): Additional arguments passed to the script handler, depending on the specific event.

### Returns

This method does not return any value.

### Example Usage

```typescript
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

myFrame.SetScript(Event.OnShow, (frame) => {
  print("MyFrame is shown!");

  // Perform additional actions when the frame is shown
  const titleText = frame.CreateFontString(undefined, "OVERLAY", "GameFontNormal");
  titleText.SetPoint("CENTER", frame, "TOP", 0, -20);
  titleText.SetText("Welcome to MyFrame!");

  const closeButton = CreateFrame("Button", undefined, frame, "UIPanelCloseButton");
  closeButton.SetPoint("TOPRIGHT", frame, "TOPRIGHT", -5, -5);
  closeButton.SetScript(Event.OnClick, () => {
    frame.Hide();
  });
});

myFrame.SetScript(Event.OnHide, (frame) => {
  print("MyFrame is hidden!");

  // Clean up resources or perform other actions when the frame is hidden
  frame.ReleaseChildren();
});

myFrame.SetScript(Event.OnUpdate, (frame, elapsed) => {
  // Perform actions on every frame update
  // `elapsed` represents the time in seconds since the last frame update
  print(`Frame update: ${elapsed} seconds`);

  // Example: Update a progress bar based on elapsed time
  const progressBar = frame.GetChildByName("ProgressBar") as StatusBar;
  if (progressBar) {
    progressBar.SetValue(progressBar.GetValue() + elapsed);
    if (progressBar.GetValue() >= 1.0) {
      frame.StopMovingOrSizing();
      frame.Hide();
    }
  }
});

// Show the frame
myFrame.Show();
```

In this example, we create a custom frame called `MyFrame` and set script handlers for the `OnShow`, `OnHide`, and `OnUpdate` events using the `SetScript` method.

- When the frame is shown (`OnShow` event), we create a title text and a close button as child elements of the frame. The close button is set to hide the frame when clicked.
- When the frame is hidden (`OnHide` event), we clean up resources by releasing the child elements of the frame.
- On every frame update (`OnUpdate` event), we perform actions based on the elapsed time since the last frame update. In this example, we update a progress bar and hide the frame when the progress reaches 100%.

Finally, we show the frame using the `Show` method, which triggers the `OnShow` event and executes the corresponding script handler.

This example demonstrates how to use the `SetScript` method to define custom behaviors for different events on a UI object, allowing you to create interactive and dynamic user interfaces in your addon.

