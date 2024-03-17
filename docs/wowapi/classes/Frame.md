## CreateFontString

Creates a new FontString as a child of a frame.

### Parameters

- `name` (optional) - The name for a global variable that points to the newly created font string. If nil, the texture is anonymous and no global variable will be created.
- `layer` (optional) - The layer the font should be drawn in, e.g., "ARTWORK".
- `inheritsFrom` (optional) - The name of a virtual font string, created in XML, to inherit from. If nil, the font string does not inherit any properties.

### Returns

- `FontString` - The newly created FontString object.

### Example Usage

```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 100);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a custom font
const myFont = CreateFont("Fonts\\FRIZQT__.TTF", 16, "OUTLINE");

// Create a FontString as a child of the frame
const myText = myFrame.CreateFontString("MyText", "OVERLAY", "GameFontNormal");
myText.SetFont(myFont:GetFont());
myText.SetPoint("CENTER", myFrame, "CENTER", 0, 0);
myText.SetText("Hello, World!");
myText.SetTextColor(1, 0, 0);

// Create another FontString that inherits properties from a virtual font string
const myOtherText = myFrame.CreateFontString(nil, "OVERLAY", "MyVirtualFontString");
myOtherText.SetPoint("BOTTOM", myFrame, "BOTTOM", 0, 10);
myOtherText.SetText("This text inherits properties from MyVirtualFontString");

// Update the text dynamically based on an event
RegisterEvent("PLAYER_LOGIN", () => {
  const playerName = GetUnitName("player");
  myText.SetText(`Welcome, ${playerName}!`);
});
```

In this example:

1. We create a new frame named "MyFrame" and set its size and position.
2. We create a custom font using the `CreateFont` function.
3. We create a FontString named "MyText" as a child of "MyFrame" and set its font, position, text, and color.
4. We create another FontString that inherits properties from a virtual font string named "MyVirtualFontString" (assumed to be defined in XML).
5. We register an event listener for the "PLAYER_LOGIN" event.
6. When the event is triggered, we retrieve the player's name using `GetUnitName` and update the text of "MyText" to display a welcome message with the player's name.

This example demonstrates how to create FontStrings with different configurations, set their properties, and update them dynamically based on events.

## CreateTexture
Creates a Texture object within the specified widget.

### Parameters
- **name** (optional) string - Name of the newly created texture; the function will create a global variable mapping this value to the created texture. If nil, the texture is anonymous and no global variable is created.
- **layer** (optional) Layer - The layer to the texture should be drawn in, e.g. "ARTWORK".
- **inheritsFrom** (optional) string | Frame - A comma-delimited list of names of virtual textures (created in XML) to inherit from; if nil, the texture does not inherit any properties.
- **subLayer** (optional) number - The order in which the texture should be drawn, within the same layer.

### Returns
**Texture** - The newly created Texture object.

### Example Usage
```typescript
// Create a frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a texture within the frame
const texture = frame.CreateTexture("MyTexture", "ARTWORK");
texture.SetSize(100, 100);
texture.SetPoint("CENTER", frame, "CENTER", 0, 0);
texture.SetTexture("Interface\\Icons\\INV_Misc_QuestionMark");

// Create another texture that inherits from the first one
const inheritsTexture = frame.CreateTexture(nil, "ARTWORK", "MyTexture");
inheritsTexture.SetSize(50, 50);
inheritsTexture.SetPoint("BOTTOMRIGHT", frame, "BOTTOMRIGHT", -10, 10);
inheritsTexture.SetVertexColor(1, 0, 0); // Set the color to red

// Create an anonymous texture with a specific sublayer
const anonymousTexture = frame.CreateTexture(nil, "ARTWORK", nil, -1);
anonymousTexture.SetAllPoints(frame);
anonymousTexture.SetColorTexture(0, 0, 0, 0.5); // Set a semi-transparent black background
```

In this example, we first create a frame named "MyFrame" and set its size and position. Then, we create a texture named "MyTexture" within the frame, set its size, position, and texture file.

Next, we create another texture that inherits properties from "MyTexture" by passing the name of the first texture as the `inheritsFrom` parameter. We set its size, position, and change its color to red using `SetVertexColor`.

Finally, we create an anonymous texture with a specific sublayer by passing `nil` as the `name` parameter and `-1` as the `subLayer` parameter. We set the texture to cover the entire frame using `SetAllPoints` and give it a semi-transparent black background using `SetColorTexture`.

This example demonstrates various ways to create and customize textures within a frame using the `CreateTexture` method.

## EnableKeyboard
This method allows a frame to receive keyboard input via the `OnKeyUp` and `OnKeyDown` script handlers. By default, frames do not receive keyboard input, so this method must be called with `true` to enable keyboard input for a specific frame.

### Parameters
- **enableFlag** (boolean): Whether to enable (true, default) or disable (false) keyboard input for the frame.

### Returns
None

### Example Usage
```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Enable keyboard input for the frame
myFrame.EnableKeyboard(true);

// Define the OnKeyDown script handler
myFrame.SetScript("OnKeyDown", function(self, key) {
    if (key === "ESCAPE") {
        // Close the frame when the escape key is pressed
        self.Hide();
    } else if (key === "ENTER") {
        // Perform an action when the enter key is pressed
        self.PerformAction();
    }
});

// Define the OnKeyUp script handler
myFrame.SetScript("OnKeyUp", function(self, key) {
    if (key === "SHIFT") {
        // Change the frame's appearance when the shift key is released
        self.SetBackdropColor(0, 0, 0, 0.5);
    }
});

// Show the frame
myFrame.Show();
```

In this example:
1. A new frame named "MyFrame" is created and positioned at the center of the screen.
2. Keyboard input is enabled for the frame using `EnableKeyboard(true)`.
3. The `OnKeyDown` script handler is defined to handle key press events:
   - When the escape key is pressed, the frame is hidden using `self.Hide()`.
   - When the enter key is pressed, a custom action is performed using `self.PerformAction()` (not shown in the example).
4. The `OnKeyUp` script handler is defined to handle key release events:
   - When the shift key is released, the frame's backdrop color is changed using `self.SetBackdropColor(0, 0, 0, 0.5)`.
5. Finally, the frame is shown using `myFrame.Show()`.

With this setup, the frame will respond to keyboard input as defined in the script handlers. You can customize the behavior based on your specific requirements, such as performing different actions for different keys or modifying the frame's appearance based on key states.

## EnableMouse
This method allows a frame to receive mouse input events such as OnMouseDown, OnMouseUp, or OnClick. The frame must be visible (shown) to receive mouse events.

### Parameters
**enableFlag** boolean - Whether to enable (true, default) or disable (false) mouse input events for the frame.

### Returns
None

### Example Usage
Enable mouse input for a custom frame and handle the OnMouseDown event:
```typescript
// Create a custom frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 100);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Enable mouse input for the frame
myFrame.EnableMouse(true);

// Set up a background texture for the frame
const backgroundTexture = myFrame.CreateTexture(nil, "BACKGROUND");
backgroundTexture.SetColorTexture(0, 0, 0, 0.5);
backgroundTexture.SetAllPoints(myFrame);

// Create a font string to display the mouse click position
const mouseText = myFrame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
mouseText.SetPoint("CENTER", myFrame, "CENTER", 0, 0);
mouseText.SetText("Click me!");

// Handle the OnMouseDown event
myFrame.SetScript("OnMouseDown", (frame: Frame, button: string) => {
    if (button === "LeftButton") {
        const [cursorX, cursorY] = GetCursorPosition();
        const [frameX, frameY] = myFrame.GetCenter();
        const relativeX = cursorX - frameX;
        const relativeY = cursorY - frameY;
        mouseText.SetText(`Clicked at (${relativeX.toFixed(2)}, ${relativeY.toFixed(2)})`);
    }
});

// Show the frame
myFrame.Show();
```
In this example:
1. We create a custom frame named "MyFrame" and set its size and position.
2. We enable mouse input for the frame using `EnableMouse(true)`.
3. We create a background texture for the frame to provide visual feedback when the frame is clicked.
4. We create a font string to display the mouse click position.
5. We set up a script to handle the OnMouseDown event using `SetScript()`. When the left mouse button is clicked, we calculate the relative click position within the frame and update the font string's text to display the coordinates.
6. Finally, we show the frame using `Show()` to make it visible and start receiving mouse events.

This example demonstrates how to enable mouse input for a custom frame, handle the OnMouseDown event, and display the relative click position within the frame using a font string.

## EnableMouseWheel
This method allows a frame to receive mouse wheel input. By default, frames do not receive mouse wheel events, and this method must be called to enable them.

### Parameters
**enableFlag** boolean - Whether to enable (true, default) or disable (false) mouse wheel input for the frame.

### Returns
None

### Example Usage
```typescript
// Create a frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Enable mouse wheel input for the frame
myFrame.EnableMouseWheel(true);

// Create a font string to display the scroll amount
const scrollText = myFrame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
scrollText.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Variable to keep track of the total scroll amount
let totalScroll = 0;

// Register the OnMouseWheel event for the frame
myFrame.SetScript("OnMouseWheel", function(self, delta) {
    // Increment the total scroll amount
    totalScroll += delta;

    // Update the scroll text
    scrollText.SetText(`Total Scroll: ${totalScroll}`);

    // Perform actions based on the scroll amount
    if (totalScroll >= 10) {
        print("Scrolled up 10 or more times!");
    } else if (totalScroll <= -10) {
        print("Scrolled down 10 or more times!");
    }
});
```

In this example:
1. We create a frame using `CreateFrame` and set its size and position.
2. We enable mouse wheel input for the frame using `EnableMouseWheel(true)`.
3. We create a font string (`scrollText`) to display the total scroll amount and position it at the center of the frame.
4. We initialize a variable (`totalScroll`) to keep track of the total scroll amount.
5. We register the `OnMouseWheel` event for the frame using `SetScript`.
6. Inside the `OnMouseWheel` event handler:
   - We increment the `totalScroll` variable based on the `delta` value (positive for scrolling up, negative for scrolling down).
   - We update the `scrollText` to display the current total scroll amount.
   - We perform actions based on the total scroll amount, such as printing messages when the total scroll reaches certain thresholds (e.g., scrolling up or down 10 or more times).

This example demonstrates how to enable mouse wheel input for a frame, track the scroll amount, and perform actions based on the scroll amount. You can customize the behavior and actions taken based on your specific requirements.

## GetChildren
This method returns a table containing all the child frames and objects of the given frame.

### Parameters
None

### Returns
**...UIObject[]** - A table containing all the child frames and objects of the given frame.

### Example Usage:
```typescript
// Create a parent frame
const parentFrame = CreateFrame("Frame", "ParentFrame", UIParent);
parentFrame.SetSize(200, 200);
parentFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create child frames and objects
const childFrame1 = CreateFrame("Frame", "ChildFrame1", parentFrame);
childFrame1.SetSize(100, 100);
childFrame1.SetPoint("TOP", parentFrame, "TOP", 0, -20);

const childFrame2 = CreateFrame("Frame", "ChildFrame2", parentFrame);
childFrame2.SetSize(100, 100);
childFrame2.SetPoint("BOTTOM", parentFrame, "BOTTOM", 0, 20);

const childTexture = parentFrame.CreateTexture(nil, "BACKGROUND");
childTexture.SetSize(50, 50);
childTexture.SetPoint("CENTER", parentFrame, "CENTER", 0, 0);

// Get all child frames and objects
const children = parentFrame.GetChildren();

// Iterate through the child frames and objects
for (const child of children) {
    if (child instanceof Frame) {
        print(`Found child frame: ${child.GetName()}`);
    } else if (child instanceof Texture) {
        print("Found child texture");
    }
}
```

In this example:
1. We create a parent frame named "ParentFrame" using `CreateFrame()`.
2. We set the size and position of the parent frame.
3. We create two child frames ("ChildFrame1" and "ChildFrame2") and a child texture using `CreateFrame()` and `CreateTexture()` respectively.
4. We set the sizes and positions of the child frames and texture relative to the parent frame.
5. We call the `GetChildren()` method on the parent frame to retrieve all its child frames and objects.
6. We iterate through the returned table of child frames and objects.
7. For each child, we check if it is an instance of `Frame` or `Texture` using the `instanceof` operator.
8. If the child is a frame, we print its name using `GetName()`. If it is a texture, we simply print a message indicating that a child texture was found.

This example demonstrates how to use the `GetChildren()` method to retrieve all the child frames and objects of a frame, and how to work with the returned table to access and manipulate the child elements.

## GetID
This method returns the ID of the frame that was set using the `SetID` method.

### Parameters
None

### Returns
**number** - The ID of the frame.

### Example Usage
```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyAddonFrame", UIParent);

// Set the ID of the frame
myFrame.SetID(42);

// Get the ID of the frame
const frameID = myFrame.GetID();

// Print the ID of the frame
print("Frame ID:", frameID);

// Use the frame ID to perform some action
if (frameID === 42) {
  // Do something specific for frames with ID 42
  myFrame.SetSize(200, 200);
  myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
  
  // Create a font string within the frame
  const fontString = myFrame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
  fontString.SetPoint("CENTER", myFrame, "CENTER", 0, 0);
  fontString.SetText("This is a frame with ID 42");
  
  // Set a script to handle frame events
  myFrame.SetScript("OnEnter", () => {
    fontString.SetText("Mouse entered frame with ID 42");
  });
  
  myFrame.SetScript("OnLeave", () => {
    fontString.SetText("Mouse left frame with ID 42");
  });
}
```

In this example:
1. We create a new frame using `CreateFrame` and assign it to the variable `myFrame`.
2. We set the ID of the frame to `42` using the `SetID` method.
3. We retrieve the ID of the frame using the `GetID` method and store it in the `frameID` variable.
4. We print the ID of the frame using `print`.
5. We perform some actions specific to frames with ID `42`:
   - We set the size of the frame to 200x200 using `SetSize`.
   - We position the frame at the center of the screen using `SetPoint`.
   - We create a font string within the frame using `CreateFontString` and set its text.
   - We set scripts to handle the "OnEnter" and "OnLeave" events of the frame, updating the font string's text accordingly.

This example demonstrates how the `GetID` method can be used to retrieve the ID of a frame and perform specific actions based on that ID. It showcases a more complex usage scenario where the frame ID is used to conditionally execute code and interact with other frame elements.

## GetFrameLevel
This method returns the current Frame Level of the Frame instance.

### Parameters
None

### Returns
**number** - The current Frame Level of the Frame instance.

### Remarks
The Frame Level determines the order in which frames are rendered on the screen. Frames with higher Frame Levels will be rendered on top of frames with lower Frame Levels. By default, frames are created with a Frame Level of 0.

### Example Usage
```typescript
// Create a new Frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Set the size and position of the Frame
myFrame.SetSize(200, 100);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a new Button within the Frame
const myButton = CreateFrame("Button", "MyButton", myFrame);
myButton.SetSize(100, 50);
myButton.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Set the Frame Level of the Button to be higher than the Frame
myButton.SetFrameLevel(myFrame.GetFrameLevel() + 1);

// Create a Font String within the Frame
const myText = myFrame.CreateFontString("MyText", "OVERLAY", "GameFontNormal");
myText.SetPoint("TOP", myFrame, "TOP", 0, -10);
myText.SetText("Hello, World!");

// Set the Frame Level of the Font String to be higher than the Button
myText.SetFrameLevel(myButton.GetFrameLevel() + 1);

// Show the Frame
myFrame.Show();
```

In this example, we create a new Frame (`myFrame`) and set its size and position. We then create a Button (`myButton`) within the Frame and set its Frame Level to be higher than the Frame using `SetFrameLevel()` and `GetFrameLevel()`. This ensures that the Button will be rendered on top of the Frame.

Next, we create a Font String (`myText`) within the Frame and set its Frame Level to be higher than the Button. This ensures that the Font String will be rendered on top of both the Frame and the Button.

Finally, we show the Frame using `Show()`, which will display all of its child elements (the Button and Font String) on the screen according to their Frame Levels.

## GetScript

This method retrieves the assigned script for a specific event on a Frame object.

### Parameters

- **event** (Event.OnAny): The event for which to retrieve the assigned script.

### Returns

- **((frame: Frame, ...args: any[]) => void) | undefined**: The assigned script function for the specified event, or undefined if no script is assigned.

### Example Usage

```typescript
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Define a custom script function
function myOnUpdateScript(frame: Frame, elapsed: number) {
  // Calculate the total elapsed time
  frame.totalElapsed = (frame.totalElapsed || 0) + elapsed;

  // Update the frame's position based on the elapsed time
  const x = math.sin(frame.totalElapsed) * 100;
  const y = math.cos(frame.totalElapsed) * 100;
  frame.SetPoint("CENTER", UIParent, "CENTER", x, y);

  // Change the frame's color based on the elapsed time
  const r = math.sin(frame.totalElapsed) * 0.5 + 0.5;
  const g = math.cos(frame.totalElapsed) * 0.5 + 0.5;
  const b = math.sin(frame.totalElapsed + math.pi / 2) * 0.5 + 0.5;
  frame.SetBackdropColor(r, g, b);

  // Print a message every second
  if (math.floor(frame.totalElapsed) > frame.lastSecond) {
    frame.lastSecond = math.floor(frame.totalElapsed);
    print(`MyFrame has been running for ${frame.lastSecond} seconds`);
  }
}

// Assign the custom script to the OnUpdate event
myFrame.SetScript(Event.OnUpdate, myOnUpdateScript);

// Retrieve the assigned script for the OnUpdate event
const retrievedScript = myFrame.GetScript(Event.OnUpdate);
if (retrievedScript) {
  print("OnUpdate script is assigned");
} else {
  print("No OnUpdate script assigned");
}
```

In this example:

1. We create a custom Frame object using `CreateFrame`.

2. We define a custom script function called `myOnUpdateScript` that will be executed on every frame update.

3. Inside the script function, we calculate the total elapsed time and use it to update the frame's position and color based on mathematical functions.

4. We also print a message every second to indicate how long the frame has been running.

5. We assign the custom script to the OnUpdate event using `myFrame.SetScript(Event.OnUpdate, myOnUpdateScript)`.

6. Finally, we use `myFrame.GetScript(Event.OnUpdate)` to retrieve the assigned script for the OnUpdate event and check if it is assigned or not.

This example demonstrates how to assign a script to a specific event on a Frame object and retrieve it using the `GetScript` method. The script function can perform various actions based on the elapsed time, such as updating the frame's position, color, and printing messages.

# GetFrameStrata

Returns the Frame Strata the frame is in.

## Parameters

None

## Returns

**FrameStrata** - The current strata of the frame.

## Example Usage

```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Set the frame's strata to "MEDIUM"
myFrame.SetFrameStrata("MEDIUM");

// Get the current strata of the frame
const currentStrata = myFrame.GetFrameStrata();

// Print the current strata
print("Current Strata:", currentStrata);

// Create a button within the frame
const myButton = CreateFrame("Button", "MyButton", myFrame);

// Set the button's position and size
myButton.SetPoint("CENTER", myFrame, "CENTER", 0, 0);
myButton.SetSize(100, 30);

// Set the button's text
myButton.SetText("Click Me!");

// Set the button's script to change the frame's strata when clicked
myButton.SetScript("OnClick", () => {
    if (myFrame.GetFrameStrata() === "MEDIUM") {
        myFrame.SetFrameStrata("HIGH");
        print("Frame Strata changed to HIGH");
    } else {
        myFrame.SetFrameStrata("MEDIUM");
        print("Frame Strata changed to MEDIUM");
    }
});
```

In this example:

1. We create a new frame named "MyFrame" using the `CreateFrame` function.

2. We set the frame's strata to "MEDIUM" using the `SetFrameStrata` method.

3. We retrieve the current strata of the frame using the `GetFrameStrata` method and store it in the `currentStrata` variable.

4. We print the current strata using the `print` function.

5. We create a button named "MyButton" within the frame using the `CreateFrame` function.

6. We set the button's position to the center of the frame and set its size to 100x30 pixels using the `SetPoint` and `SetSize` methods.

7. We set the button's text to "Click Me!" using the `SetText` method.

8. We set a script for the button's "OnClick" event using the `SetScript` method.

9. In the "OnClick" event handler, we check the current strata of the frame using `GetFrameStrata`.
   - If the current strata is "MEDIUM", we change it to "HIGH" using `SetFrameStrata` and print a message.
   - If the current strata is not "MEDIUM", we change it to "MEDIUM" and print a message.

This example demonstrates how to use the `GetFrameStrata` method to retrieve the current strata of a frame and how to dynamically change the strata based on user interaction with a button. It showcases the usage of frame creation, button creation, setting properties, and handling events.

## IsKeyboardEnabled

This method returns a boolean value indicating whether the keyboard input is enabled for the frame.

### Parameters

None

### Returns

**boolean** - True if the keyboard input is enabled for the frame, false otherwise.

### Example Usage:

```typescript
// Create a frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);

// Set the size and position of the frame
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a font string for displaying the keyboard input status
const fontString = frame.CreateFontString("KeyboardStatus", "OVERLAY", "GameFontNormal");
fontString.SetPoint("CENTER", frame, "CENTER", 0, 0);

// Create a function to update the keyboard input status
function updateKeyboardStatus() {
    if (frame.IsKeyboardEnabled()) {
        fontString.SetText("Keyboard input enabled");
    } else {
        fontString.SetText("Keyboard input disabled");
    }
}

// Register events for enabling/disabling keyboard input
frame.RegisterEvent("PLAYER_LOGIN");
frame.RegisterEvent("PLAYER_LOGOUT");
frame.SetScript("OnEvent", function(self, event) {
    if (event === "PLAYER_LOGIN") {
        frame.EnableKeyboard(true);
    } else if (event === "PLAYER_LOGOUT") {
        frame.EnableKeyboard(false);
    }
    updateKeyboardStatus();
});

// Initially update the keyboard input status
updateKeyboardStatus();
```

In this example:

1. We create a frame using `CreateFrame` and set its size and position.

2. We create a font string (`fontString`) as a child of the frame to display the keyboard input status.

3. We define a function `updateKeyboardStatus` that checks the keyboard input status using `frame.IsKeyboardEnabled()` and updates the text of the font string accordingly.

4. We register events for `PLAYER_LOGIN` and `PLAYER_LOGOUT` to enable/disable keyboard input when the player logs in or out.

5. In the event handler function, we use `frame.EnableKeyboard(true/false)` to enable or disable keyboard input based on the event.

6. After enabling/disabling keyboard input, we call `updateKeyboardStatus` to update the displayed status.

7. Finally, we call `updateKeyboardStatus` initially to display the current keyboard input status.

This example demonstrates how to use the `IsKeyboardEnabled` method to check the keyboard input status of a frame and update the UI accordingly. It also shows how to enable/disable keyboard input based on specific events using `RegisterEvent` and `SetScript`.

## IsMouseEnabled
This method returns whether the mouse is enabled for the frame or not.

### Parameters
None

### Returns
**boolean** - True if the mouse is enabled for the frame, false otherwise.

### Example Usage:
```typescript
// Create a frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set a background color for the frame
frame.SetBackdrop({
  bgFile: "Interface\\DialogFrame\\UI-DialogBox-Background",
  edgeFile: "Interface\\DialogFrame\\UI-DialogBox-Border",
  tile: true,
  tileSize: 32,
  edgeSize: 32,
  insets: { left: 11, right: 12, top: 12, bottom: 11 },
});

// Create a button within the frame
const button = CreateFrame("Button", "MyButton", frame, "UIPanelButtonTemplate");
button.SetSize(100, 30);
button.SetPoint("CENTER", frame, "CENTER", 0, 0);
button.SetText("Click Me");

// Create an event handler for the button
button.SetScript("OnClick", () => {
  // Check if the mouse is enabled for the frame
  if (frame.IsMouseEnabled()) {
    print("Mouse is enabled for the frame.");
  } else {
    print("Mouse is not enabled for the frame.");
  }
});

// Initially disable the mouse for the frame
frame.EnableMouse(false);
```

In this example:
1. We create a frame named "MyFrame" and set its size and position.
2. We set a background color for the frame using the `SetBackdrop` method.
3. We create a button named "MyButton" within the frame and set its size, position, and text.
4. We create an event handler for the button's "OnClick" event.
5. Inside the event handler, we use the `IsMouseEnabled` method to check if the mouse is enabled for the frame.
   - If the mouse is enabled, it prints "Mouse is enabled for the frame."
   - If the mouse is not enabled, it prints "Mouse is not enabled for the frame."
6. Initially, we disable the mouse for the frame using the `EnableMouse(false)` method.

When the button is clicked, it will check the mouse enabled state of the frame and print the corresponding message.

This example demonstrates how to use the `IsMouseEnabled` method to determine whether the mouse is enabled for a frame. It also showcases creating a frame, setting its properties, creating a button within the frame, and handling button click events.

## IsMouseWheelEnabled
This method returns whether the mouse wheel is enabled for the Frame instance.

### Parameters
None

### Returns
**boolean** - True if the mouse wheel is enabled for the Frame, false otherwise.

### Example Usage:
```typescript
// Create a new Frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a FontString to display the scroll amount
const scrollText = myFrame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
scrollText.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Variable to keep track of the scroll amount
let scrollAmount = 0;

// Function to handle the mouse wheel scroll
function OnMouseWheel(self, delta)
    scrollAmount = scrollAmount + delta;
    scrollText.SetText("Scroll Amount: " + scrollAmount);
end

// Check if the mouse wheel is enabled for the Frame
if (myFrame.IsMouseWheelEnabled()) then
    // Enable the mouse wheel scrolling for the Frame
    myFrame.SetScript("OnMouseWheel", OnMouseWheel);
else
    print("Mouse wheel is not enabled for the Frame.");
end

// Enable the mouse wheel for the Frame
myFrame.EnableMouseWheel(true);

// Verify if the mouse wheel is now enabled
if (myFrame.IsMouseWheelEnabled()) then
    print("Mouse wheel is now enabled for the Frame.");
else
    print("Mouse wheel is still not enabled for the Frame.");
end
```

In this example:
1. We create a new Frame (`myFrame`) and set its size and position.
2. We create a FontString (`scrollText`) to display the scroll amount and position it at the center of the Frame.
3. We define a variable (`scrollAmount`) to keep track of the cumulative scroll amount.
4. We define a function (`OnMouseWheel`) to handle the mouse wheel scroll event. It updates the `scrollAmount` based on the scroll delta and sets the text of `scrollText` to display the current scroll amount.
5. We check if the mouse wheel is enabled for `myFrame` using `IsMouseWheelEnabled()`. If it is enabled, we set the `OnMouseWheel` script for the Frame to handle the scroll event. If it is not enabled, we print a message indicating that the mouse wheel is not enabled.
6. We enable the mouse wheel for `myFrame` using `EnableMouseWheel(true)`.
7. We verify again if the mouse wheel is now enabled for `myFrame` using `IsMouseWheelEnabled()` and print a message accordingly.

This example demonstrates how to check if the mouse wheel is enabled for a Frame, enable it if needed, and handle the mouse wheel scroll event to perform actions based on the scroll amount.

## RegisterEvent
Registers which events the object would like to monitor. This method allows a Frame object to subscribe to specific game events and execute custom logic when those events occur.

### Parameters
- **eventName** (Event): The name of the event to register the object as monitoring. This parameter is of type Event, which represents the various game events available for subscription.

### Returns
None

### Example Usage
```typescript
// Create a new Frame object
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Define a custom function to handle the event
function OnPlayerEnterCombat(event: Event) {
    // Custom logic to execute when the player enters combat
    print("Player has entered combat!");

    // Show the frame when the event occurs
    myFrame.Show();
}

// Register the frame to monitor the PLAYER_REGEN_DISABLED event
myFrame.RegisterEvent(Event.PLAYER_REGEN_DISABLED);

// Set the frame's event handler function
myFrame.SetScript("OnEvent", OnPlayerEnterCombat);

// Initially hide the frame
myFrame.Hide();

// Create a FontString as a child of the frame
const text = myFrame.CreateFontString("MyFrameText", "OVERLAY");
text.SetFont("Fonts\\FRIZQT__.TTF", 12, "OUTLINE");
text.SetText("You have entered combat!");
text.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Set the frame's size and position
myFrame.SetSize(200, 100);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
```

In this example:
1. We create a new Frame object called `myFrame` using the `CreateFrame` function.
2. We define a custom function called `OnPlayerEnterCombat` that will be executed when the registered event occurs. In this case, it prints a message and shows the frame.
3. We register the frame to monitor the `PLAYER_REGEN_DISABLED` event using the `RegisterEvent` method. This event is triggered when the player enters combat.
4. We set the frame's event handler function to `OnPlayerEnterCombat` using the `SetScript` method. This associates the custom function with the frame's event handling mechanism.
5. Initially, we hide the frame using the `Hide` method.
6. We create a FontString object called `text` as a child of the frame using the `CreateFontString` method.
7. We set the font, size, and flags for the FontString using the `SetFont` method.
8. We set the text content of the FontString using the `SetText` method.
9. We position the FontString at the center of the frame using the `SetPoint` method.
10. Finally, we set the size and position of the frame itself using the `SetSize` and `SetPoint` methods.

With this setup, whenever the player enters combat (triggering the `PLAYER_REGEN_DISABLED` event), the `OnPlayerEnterCombat` function will be called, displaying the frame with the text "You have entered combat!" at the center of the screen.

## RegisterForDrag
This method is used to register a frame for drag events, allowing it to be dragged around the screen using the specified mouse button.

### Parameters
- **button** (`MouseButton`): The mouse button that should trigger the drag event. Possible values are:
  - `"LeftButton"`
  - `"RightButton"`
  - `"MiddleButton"`
  - `"Button4"`
  - `"Button5"`

### Returns
None

### Example Usage
```typescript
// Create a new frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 150);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a texture for the frame
const texture = frame.CreateTexture(nil, "BACKGROUND");
texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\FrameBackground");
texture.SetAllPoints(frame);

// Create a title text for the frame
const titleText = frame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
titleText.SetText("Drag Me!");
titleText.SetPoint("TOP", frame, "TOP", 0, -10);

// Register the frame for drag events using the left mouse button
frame.RegisterForDrag("LeftButton");

// Set up event handlers for the frame
frame.SetScript("OnDragStart", (self) => {
    self.StartMoving();
});

frame.SetScript("OnDragStop", (self) => {
    self.StopMovingOrSizing();
});

// Create a close button for the frame
const closeButton = CreateFrame("Button", nil, frame, "UIPanelCloseButton");
closeButton.SetPoint("TOPRIGHT", frame, "TOPRIGHT", -5, -5);
closeButton.SetScript("OnClick", () => {
    frame.Hide();
});
```

In this example:
1. We create a new frame named `"MyFrame"` using `CreateFrame`.
2. We set the size and position of the frame using `SetSize` and `SetPoint`.
3. We create a texture for the frame's background using `CreateTexture` and set it to cover the entire frame using `SetAllPoints`.
4. We create a title text for the frame using `CreateFontString` and position it at the top of the frame.
5. We register the frame for drag events using the left mouse button by calling `RegisterForDrag` with `"LeftButton"` as the argument.
6. We set up event handlers for the frame using `SetScript`:
   - `"OnDragStart"`: When the drag starts, we call `StartMoving` to allow the frame to be moved.
   - `"OnDragStop"`: When the drag stops, we call `StopMovingOrSizing` to stop the frame from being moved or resized.
7. We create a close button for the frame using `CreateFrame` with the `"UIPanelCloseButton"` template.
8. We position the close button at the top-right corner of the frame.
9. We set up a click event handler for the close button using `SetScript`, which hides the frame when clicked.

This example demonstrates how to create a draggable frame with a background texture, title text, and a close button. The frame can be dragged around the screen using the left mouse button, and it can be closed by clicking the close button.

## SetFrameStrata
This method sets the frame strata of the frame. The frame strata determines the rendering order of frames relative to other frames.

### Parameters
**frameStrata** [FrameStrata](https://wowpedia.fandom.com/wiki/API_Region_SetFrameStrata#Arguments) - The frame strata the frame will be put in. Valid values are:
- "BACKGROUND"
- "LOW"
- "MEDIUM"
- "HIGH"
- "DIALOG"
- "FULLSCREEN"
- "FULLSCREEN_DIALOG"
- "TOOLTIP"

### Returns
None

### Example Usage
```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Set the size and position of the frame
myFrame.SetSize(200, 100);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a texture for the frame
const myTexture = myFrame.CreateTexture(nil, "BACKGROUND");
myTexture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture");
myTexture.SetAllPoints(myFrame);

// Create a button for the frame
const myButton = CreateFrame("Button", "MyButton", myFrame);
myButton.SetSize(100, 50);
myButton.SetPoint("CENTER", myFrame, "CENTER", 0, 0);
myButton.SetText("Click Me!");

// Set the frame strata of the button to be above the frame
myButton.SetFrameStrata("HIGH");

// Set the frame strata of the frame to be below the button
myFrame.SetFrameStrata("MEDIUM");

// Show the frame and button
myFrame.Show();
myButton.Show();
```

In this example, we create a new frame `myFrame` and set its size and position. We also create a texture for the background of the frame using `CreateTexture` and set it to cover the entire frame using `SetAllPoints`.

Next, we create a button `myButton` as a child of `myFrame` and set its size, position, and text.

We then use `SetFrameStrata` to set the frame strata of the button to "HIGH" and the frame to "MEDIUM". This ensures that the button is rendered above the frame.

Finally, we show both the frame and button using `Show()`.

By utilizing `SetFrameStrata`, you can control the rendering order of frames and their child elements, ensuring that certain elements appear above or below others as desired.

## SetScale
This method allows you to specify a size scaling factor to be applied to the Frame object and its children. The scaling factor affects the size of the Frame and its child elements, allowing you to proportionally resize them.

### Parameters
- **scale** (number): The new scaling factor to be applied to the Frame and its children. The value must be greater than 0, where 1 indicates no additional scaling (default size).

### Example Usage
```typescript
// Create a new Frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a child Frame within myFrame
const childFrame = CreateFrame("Frame", "ChildFrame", myFrame);
childFrame.SetSize(100, 100);
childFrame.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Create a texture within the child Frame
const texture = childFrame.CreateTexture(nil, "BACKGROUND");
texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture");
texture.SetAllPoints(childFrame);

// Set the scaling factor of myFrame to 1.5
myFrame.SetScale(1.5);

// The size of myFrame is now effectively 300x300 (200 * 1.5)
// The size of childFrame is now effectively 150x150 (100 * 1.5)
// The texture within childFrame is also scaled proportionally

// Set the scaling factor of myFrame back to 1 (default size)
myFrame.SetScale(1);
```

In this example:
1. We create a Frame called `myFrame` with a size of 200x200 and position it at the center of the screen using `SetPoint`.
2. We create a child Frame called `childFrame` within `myFrame` with a size of 100x100 and position it at the center of `myFrame`.
3. We create a texture within `childFrame` using `CreateTexture` and set its texture path using `SetTexture`. We also set the texture to cover the entire `childFrame` using `SetAllPoints`.
4. We set the scaling factor of `myFrame` to 1.5 using `SetScale`. This scales `myFrame` and its children (`childFrame` and the texture) by a factor of 1.5. The effective size of `myFrame` becomes 300x300 (200 * 1.5), and the effective size of `childFrame` becomes 150x150 (100 * 1.5). The texture within `childFrame` is also scaled proportionally.
5. Finally, we set the scaling factor of `myFrame` back to 1 using `SetScale`, which restores the default size of `myFrame` and its children.

By using `SetScale`, you can easily resize Frame objects and their children while maintaining their proportions. This is useful when you want to create resizable UI elements or apply dynamic scaling based on certain conditions.

## SetAttribute
This method sets an attribute on the frame with the specified name and value.

### Parameters
- **name** (string): The name of the attribute to set.
- **value** (any): The value to assign to the attribute.

### Returns
None

### Example Usage
```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);

// Set the frame's size and position
myFrame.SetSize(200, 150);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set a custom attribute on the frame
myFrame.SetAttribute("myCustomAttribute", "Hello, World!");

// Create a font string within the frame
const fontString = myFrame.CreateFontString(nil, "OVERLAY", "GameFontNormal");
fontString.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Set the font string's text based on the custom attribute
fontString.SetText(myFrame.GetAttribute("myCustomAttribute"));

// Define a function to update the custom attribute
function UpdateCustomAttribute(frame: Frame, value: string) {
  frame.SetAttribute("myCustomAttribute", value);
  fontString.SetText(value);
}

// Set a new value for the custom attribute after a delay
C_Timer.After(3, () => {
  UpdateCustomAttribute(myFrame, "Attribute updated!");
});

// Show the frame
myFrame.Show();
```

In this example:
1. We create a new frame named "MyFrame" using `CreateFrame`.
2. We set the frame's size and position using `SetSize` and `SetPoint`.
3. We set a custom attribute named "myCustomAttribute" on the frame using `SetAttribute`, assigning it the value "Hello, World!".
4. We create a font string within the frame using `CreateFontString`.
5. We set the font string's text based on the value of the custom attribute using `GetAttribute`.
6. We define a function `UpdateCustomAttribute` that takes a frame and a value as parameters. This function updates the custom attribute on the frame and sets the font string's text accordingly.
7. We use `C_Timer.After` to schedule a delayed execution of `UpdateCustomAttribute`, passing the frame and a new value. This will update the custom attribute and the font string's text after a 3-second delay.
8. Finally, we show the frame using `Show`.

This example demonstrates how to set and retrieve custom attributes on a frame, as well as how to update the attribute and reflect the changes in the frame's visual elements.

## SetHyperlinksEnabled
This method enables or disables hyperlinks in a Frame.

### Parameters
- **enabled** (boolean): Determines whether hyperlinks should be enabled or disabled in the Frame.

### Returns
None

### Example Usage
```typescript
// Create a new frame
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a font string within the frame
const fontString = myFrame.CreateFontString("MyFontString", "OVERLAY", "GameFontNormal");
fontString.SetPoint("CENTER", myFrame, "CENTER", 0, 0);
fontString.SetText("Click this link: |cff00ff00|Hitem:1234:0:0:0|h[Sample Item]|h|r");

// Enable hyperlinks in the frame
myFrame.SetHyperlinksEnabled(true);

// Set up a script to handle hyperlink clicks
myFrame.SetScript("OnHyperlinkClick", (self, link, text, button) => {
    if (link.startsWith("item")) {
        const itemId = parseInt(link.match(/item:(\d+)/)[1]);
        // Handle the item link click, e.g., show item tooltip
        GameTooltip.SetOwner(UIParent, "ANCHOR_CURSOR");
        GameTooltip.SetHyperlink(link);
        GameTooltip.Show();
    }
});

// Optionally, disable hyperlinks later if needed
// myFrame.SetHyperlinksEnabled(false);
```

In this example:
1. We create a new Frame named "MyFrame" using `CreateFrame` and set its size and position.
2. We create a FontString named "MyFontString" within the Frame using `CreateFontString` and set its text to include a hyperlink for an item.
3. We enable hyperlinks in the Frame by calling `SetHyperlinksEnabled(true)`.
4. We set up a script to handle hyperlink clicks using `SetScript("OnHyperlinkClick", ...)`. In this case, we check if the clicked link is an item link and handle it accordingly, such as showing the item tooltip.
5. If needed, we can disable hyperlinks later by calling `SetHyperlinksEnabled(false)`.

By enabling hyperlinks in the Frame, players can interact with the hyperlinked text, such as clicking on item links to view their tooltips or perform other actions based on the link type. The `OnHyperlinkClick` script allows you to define custom behavior when a hyperlink is clicked within the Frame.

## UnregisterEvent
This method unregisters the widget from receiving OnEvent notifications for a particular event.

### Parameters
**eventName** Event - The name of the event the object wishes to no longer monitor. See [Events](https://wowpedia.fandom.com/wiki/Events).

### Returns
None

### Example Usage
Unregister a frame from receiving PLAYER_ENTERING_WORLD and PLAYER_LEAVING_WORLD events.
```typescript
const frame = CreateFrame("Frame");

frame.RegisterEvent("PLAYER_ENTERING_WORLD");
frame.RegisterEvent("PLAYER_LEAVING_WORLD");

frame.SetScript("OnEvent", function(self, event, ...) {
    if (event === "PLAYER_ENTERING_WORLD") {
        print("Player has entered the world!");
    } else if (event === "PLAYER_LEAVING_WORLD") {
        print("Player is leaving the world!");
    }
});

// Sometime later, unregister the events
frame.UnregisterEvent("PLAYER_ENTERING_WORLD");
frame.UnregisterEvent("PLAYER_LEAVING_WORLD");

// The frame will no longer receive notifications for these events
// and the OnEvent script will not be triggered for them.
```

In this example, we create a Frame and register it to receive PLAYER_ENTERING_WORLD and PLAYER_LEAVING_WORLD events using the `RegisterEvent` method. We also set an OnEvent script using `SetScript` to handle these events and perform some action (in this case, just printing a message).

Later on, we decide that we no longer want this Frame to receive notifications for these events, so we use the `UnregisterEvent` method to unregister each event individually.

After unregistering the events, the Frame will no longer receive notifications for PLAYER_ENTERING_WORLD and PLAYER_LEAVING_WORLD, and the OnEvent script will not be triggered when these events occur.

This is useful when you only want to handle certain events temporarily or conditionally, and want to optimize performance by not processing events that are no longer needed.

