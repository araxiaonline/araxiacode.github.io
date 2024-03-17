## GetTexture
Returns the texture string from any Texture object.

### Parameters
None

### Returns
string - The path/filename without extension of the texture

### Example Usage
```typescript
// Create a new frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a texture for the frame
const texture = frame.CreateTexture(nil, "BACKGROUND");
texture.SetAllPoints(frame);
texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture");

// Get the texture path
const texturePath = texture.GetTexture();
print("Texture path:", texturePath);

// Create a button
const button = CreateFrame("Button", "MyButton", frame);
button.SetSize(100, 30);
button.SetPoint("CENTER", frame, "CENTER", 0, -50);

// Set the button's normal texture
const buttonNormalTexture = button.CreateTexture(nil, "BACKGROUND");
buttonNormalTexture.SetTexture("Interface\\Buttons\\UI-Panel-Button-Up");
buttonNormalTexture.SetAllPoints(button);

// Set the button's pushed texture
const buttonPushedTexture = button.CreateTexture(nil, "BACKGROUND");
buttonPushedTexture.SetTexture("Interface\\Buttons\\UI-Panel-Button-Down");
buttonPushedTexture.SetAllPoints(button);

// Set the button's highlight texture
const buttonHighlightTexture = button.CreateTexture(nil, "HIGHLIGHT");
buttonHighlightTexture.SetTexture("Interface\\Buttons\\UI-Panel-Button-Highlight");
buttonHighlightTexture.SetAllPoints(button);
buttonHighlightTexture.SetBlendMode("ADD");

// Set the button's text
const buttonText = button.CreateFontString(nil, "OVERLAY", "GameFontNormal");
buttonText.SetText("Click Me!");
buttonText.SetPoint("CENTER", button, "CENTER", 0, 0);

// Get the texture paths of the button's textures
const normalTexturePath = buttonNormalTexture.GetTexture();
const pushedTexturePath = buttonPushedTexture.GetTexture();
const highlightTexturePath = buttonHighlightTexture.GetTexture();

print("Button normal texture path:", normalTexturePath);
print("Button pushed texture path:", pushedTexturePath);
print("Button highlight texture path:", highlightTexturePath);
```

In this example:
1. We create a new frame using `CreateFrame` and set its size and position.
2. We create a texture for the frame using `frame.CreateTexture` and set its texture using the `SetTexture` method.
3. We retrieve the texture path of the frame's texture using the `GetTexture` method and print it.
4. We create a button using `CreateFrame` and set its size and position.
5. We create three textures for the button: normal, pushed, and highlight textures, using `button.CreateTexture` and set their textures using the `SetTexture` method.
6. We set the button's text using `button.CreateFontString` and position it at the center of the button.
7. We retrieve the texture paths of the button's textures using the `GetTexture` method and print them.

This demonstrates how to create textures for different UI elements (frames and buttons) and retrieve their texture paths using the `GetTexture` method.

## SetRotation
This method applies a counter-clockwise rotation to the texture.

### Parameters
- **angle** (number): The rotation angle in radians. Positive values rotate the texture counter-clockwise.
- **cx** (number): The horizontal coordinate of the rotation "center" point. Defaults to 0.5 if not provided.
- **cy** (number): The vertical coordinate of the rotation "center" point. Defaults to 0.5 if not provided.

### Example Usage
```typescript
// Create a texture and set its file path
const texture = new Texture();
texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture.tga");

// Set the texture's position and size
texture.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
texture.SetSize(256, 256);

// Apply a rotation to the texture
const rotationAngle = Math.PI / 4; // 45 degrees in radians
const centerX = 0.5;
const centerY = 0.5;
texture.SetRotation(rotationAngle, centerX, centerY);

// Create a frame to hold the texture
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(300, 300);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Add the texture to the frame
texture.SetParent(frame);

// Create a function to animate the texture rotation
let animationProgress = 0;
const animationDuration = 2; // Duration in seconds

function AnimateRotation()
{
    animationProgress += GetTickTime();
    const progress = animationProgress / animationDuration;

    if (progress <= 1)
    {
        const angle = progress * Math.PI * 2; // Full rotation (2π radians)
        texture.SetRotation(angle, centerX, centerY);
    }
    else
    {
        // Animation complete, reset the progress
        animationProgress = 0;
    }
}

// Set up a script to update the rotation every frame
frame.SetScript("OnUpdate", AnimateRotation);
```

In this example:
1. We create a new `Texture` object and set its file path using `SetTexture()`.
2. We set the texture's position and size using `SetPoint()` and `SetSize()`.
3. We apply an initial rotation to the texture using `SetRotation()`, specifying the rotation angle in radians and the center point coordinates.
4. We create a new frame using `CreateFrame()` to hold the texture.
5. We set the texture's parent to the frame using `SetParent()`.
6. We define a function called `AnimateRotation()` that will be used to animate the texture rotation over time.
7. Inside the animation function, we calculate the progress based on the elapsed time and the desired animation duration.
8. We update the rotation angle of the texture using `SetRotation()` based on the animation progress.
9. If the animation is complete (progress reaches 1), we reset the progress to start the animation again.
10. Finally, we set up a script on the frame using `SetScript()` to call the `AnimateRotation()` function every frame, creating a continuous rotation animation.

This example demonstrates how to apply a rotation to a texture and animate it over time using the `SetRotation()` method and the `OnUpdate` script event.

## SetRotation
This method sets the rotation of the texture in degrees.

### Parameters
**angle** number - The angle of rotation in degrees (0-360). Positive values rotate the texture clockwise, while negative values rotate it counterclockwise.

### Returns
None

### Example Usage:
```typescript
// Create a new texture
const myTexture = myFrame.CreateTexture();
myTexture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture.tga");

// Set the texture's size and position
myTexture.SetSize(100, 100);
myTexture.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Set the initial rotation of the texture to 45 degrees
myTexture.SetRotation(45);

// Create a function to smoothly rotate the texture
function RotateTexture()
{
    // Get the current rotation angle of the texture
    const currentAngle = myTexture.GetRotation();

    // Calculate the new rotation angle (increase by 1 degree per frame)
    const newAngle = currentAngle + 1;

    // If the new angle is greater than 360, wrap it back to 0
    if (newAngle > 360)
    {
        newAngle = 0;
    }

    // Set the new rotation angle
    myTexture.SetRotation(newAngle);
}

// Set up a script to call the RotateTexture function every frame
myFrame.SetScript("OnUpdate", RotateTexture);
```
In this example, we create a new texture and set its size and position. We then set its initial rotation to 45 degrees using `SetRotation(45)`.

Next, we define a function called `RotateTexture` that smoothly rotates the texture by 1 degree per frame. Inside the function, we get the current rotation angle of the texture using `GetRotation()`, calculate the new angle by adding 1 degree, and wrap it back to 0 if it exceeds 360 degrees. Finally, we set the new rotation angle using `SetRotation(newAngle)`.

To animate the texture's rotation, we set up a script on the frame that calls the `RotateTexture` function every frame using `SetScript("OnUpdate", RotateTexture)`. This creates a continuous rotation effect for the texture.

## SetTexCoord
This method modifies the region of a texture drawn by the Texture widget. It allows you to specify the coordinates of the texture region you want to display.

### Parameters
- **left** (number): The left coordinate of the texture region.
- **right** (number): The right coordinate of the texture region.
- **top** (number): The top coordinate of the texture region.
- **bottom** (number): The bottom coordinate of the texture region.

### Returns
None

### Example Usage
```typescript
// Create a frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a texture
const texture = frame.CreateTexture(nil, "BACKGROUND");
texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture.tga");
texture.SetAllPoints(frame);

// Set the texture coordinates to display only the top-left quarter of the texture
texture.SetTexCoord(0, 0.5, 0, 0.5);

// Create a button to toggle the texture coordinates
const button = CreateFrame("Button", "MyButton", frame, "UIPanelButtonTemplate");
button.SetSize(100, 30);
button.SetPoint("BOTTOM", frame, "BOTTOM", 0, 10);
button.SetText("Toggle Texture");

let showFullTexture = false;

button.SetScript("OnClick", function() {
    if (showFullTexture) {
        // Set the texture coordinates to display only the top-left quarter
        texture.SetTexCoord(0, 0.5, 0, 0.5);
    } else {
        // Set the texture coordinates to display the full texture
        texture.SetTexCoord(0, 1, 0, 1);
    }
    
    showFullTexture = !showFullTexture;
});
```

In this example:
1. We create a frame named "MyFrame" and set its size and position.
2. We create a texture within the frame and set its texture file using `SetTexture()`.
3. We set the texture coordinates using `SetTexCoord()` to display only the top-left quarter of the texture.
4. We create a button named "MyButton" within the frame.
5. We set the size, position, and text of the button.
6. We define a variable `showFullTexture` to keep track of the current state.
7. We set a script for the button's "OnClick" event.
8. Inside the "OnClick" script, we check the value of `showFullTexture`:
   - If `showFullTexture` is true, we set the texture coordinates to display only the top-left quarter using `SetTexCoord(0, 0.5, 0, 0.5)`.
   - If `showFullTexture` is false, we set the texture coordinates to display the full texture using `SetTexCoord(0, 1, 0, 1)`.
9. We toggle the value of `showFullTexture` after each button click.

This example demonstrates how you can use `SetTexCoord()` to modify the displayed region of a texture dynamically based on user interaction with a button.

## SetTexCoord
This method is used to set the texture coordinates for a texture. It allows you to specify the upper-left, lower-left, upper-right, and lower-right coordinates of the texture.

### Parameters
- **ULx** (number): The x-coordinate of the upper-left corner of the texture.
- **ULy** (number): The y-coordinate of the upper-left corner of the texture.
- **LLx** (number): The x-coordinate of the lower-left corner of the texture.
- **LLy** (number): The y-coordinate of the lower-left corner of the texture.
- **URx** (number): The x-coordinate of the upper-right corner of the texture.
- **URy** (number): The y-coordinate of the upper-right corner of the texture.
- **LRx** (number): The x-coordinate of the lower-right corner of the texture.
- **LRy** (number): The y-coordinate of the lower-right corner of the texture.

### Returns
This method does not return any value.

### Example Usage
```typescript
// Create a texture
const myTexture = myFrame.CreateTexture();

// Load the texture file
myTexture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture.tga");

// Set the texture coordinates to display a specific portion of the texture
myTexture.SetTexCoord(0.1, 0.1, 0.4, 0.1, 0.1, 0.4, 0.4, 0.4);

// Set the size and position of the texture
myTexture.SetSize(200, 200);
myTexture.SetPoint("CENTER", myFrame, "CENTER", 0, 0);

// Show the texture
myTexture.Show();

// Later, update the texture coordinates to display a different portion
myTexture.SetTexCoord(0.6, 0.6, 0.9, 0.6, 0.6, 0.9, 0.9, 0.9);
```

In this example:
1. We create a texture using `myFrame.CreateTexture()`.
2. We load a texture file using `SetTexture()` method, specifying the path to the texture file.
3. We set the initial texture coordinates using `SetTexCoord()` to display a specific portion of the texture. The coordinates are specified in normalized values (0 to 1) relative to the texture's dimensions.
4. We set the size and position of the texture using `SetSize()` and `SetPoint()` methods.
5. We show the texture using `Show()` method.
6. Later in the code, we update the texture coordinates using `SetTexCoord()` again to display a different portion of the texture.

By using `SetTexCoord()`, we can control which part of the texture is displayed on the texture object. This is useful when working with sprite sheets or atlas textures where multiple images are stored in a single texture file.

## SetTexture

This method changes the texture of a Texture widget.

### Parameters

- **file** (string | number): Path to a texture image or ID number specifying a Blizzard texture file. Returned by various API functions.
- **horizWrap** (Wrap): Optional. Wrap behavior specifying what should appear when sampling pixels with an x coordinate outside the (0, 1) region of the texture coordinate space.
- **vertWrap** (Wrap): Optional. Wrap behavior specifying what should appear when sampling pixels with a y coordinate outside the (0, 1) region of the texture coordinate space.
- **filterMode** (FilterMode): Optional. Texture filtering mode to use.

### Example Usage

```typescript
// Create a frame and a texture widget
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

const texture = frame.CreateTexture(nil, "BACKGROUND");
texture.SetSize(200, 200);
texture.SetPoint("CENTER", frame, "CENTER", 0, 0);

// Set the texture using a file path
texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture.tga");

// Set the texture using a Blizzard file ID and specify wrap and filter mode
const blizzardTextureId = 136235; // Example Blizzard texture ID
texture.SetTexture(blizzardTextureId, Wrap.Repeat, Wrap.Repeat, FilterMode.Linear);

// Change the texture dynamically based on a condition
let isAlternateTexture = false;
frame.SetScript("OnUpdate", function()
    if (isAlternateTexture) {
        texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\AlternateTexture.tga");
    } else {
        texture.SetTexture("Interface\\AddOns\\MyAddon\\Textures\\MyTexture.tga");
    }
    isAlternateTexture = !isAlternateTexture;
end);

// Set the texture to a solid color
texture.SetColorTexture(1, 0, 0); // Red color
```

In this example, we create a frame and a texture widget. We demonstrate setting the texture using a file path and a Blizzard texture ID. We also specify the wrap and filter mode when setting the texture using the Blizzard ID.

Additionally, we show an example of dynamically changing the texture based on a condition using the `OnUpdate` script of the frame. This allows for dynamic texture changes during runtime.

Finally, we set the texture to a solid color using the `SetColorTexture` method, which is useful for creating simple colored backgrounds or overlays.

## SetTexture
This method sets the texture color using RGBA values.

### Parameters
- **r** (number): The red component of the color (0-255).
- **g** (number): The green component of the color (0-255).
- **b** (number): The blue component of the color (0-255).
- **a** (number, optional): The alpha (opacity) component of the color (0-1). Default value is 1.

### Returns
None

### Example Usage
```typescript
// Create a texture and set its color to a semi-transparent red
const myTexture = new Texture();
myTexture.SetTexture(255, 0, 0, 0.5);

// Create a frame and apply the texture
const myFrame = CreateFrame("Frame", "MyFrame", UIParent);
myFrame.SetSize(200, 200);
myFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

const textureName = myFrame.CreateTexture();
textureName.SetTexture(myTexture);
textureName.SetAllPoints(myFrame);

// Create a button to toggle the texture color between red and green
const myButton = CreateFrame("Button", "MyButton", myFrame, "UIPanelButtonTemplate");
myButton.SetSize(100, 30);
myButton.SetPoint("CENTER", myFrame, "CENTER", 0, -50);
myButton.SetText("Toggle Color");

let isRed = true;
myButton.SetScript("OnClick", () => {
  if (isRed) {
    myTexture.SetTexture(0, 255, 0, 0.5);
  } else {
    myTexture.SetTexture(255, 0, 0, 0.5);
  }
  isRed = !isRed;
});
```

In this example:
1. We create a new `Texture` instance called `myTexture` and set its color to a semi-transparent red using `SetTexture(255, 0, 0, 0.5)`.
2. We create a frame named `MyFrame` using `CreateFrame` and set its size and position.
3. We create a texture for the frame using `CreateTexture` and apply the `myTexture` to it using `SetTexture(myTexture)`. We also set the texture to cover the entire frame using `SetAllPoints(myFrame)`.
4. We create a button named `MyButton` using `CreateFrame` with the `UIPanelButtonTemplate` template. We set its size, position, and text.
5. We define a variable `isRed` to keep track of the current color state.
6. We set a script for the button's `OnClick` event using `SetScript`. Inside the script, we check the value of `isRed` and toggle the texture color between red and green using `SetTexture`. We also update the `isRed` variable accordingly.

This example demonstrates how to create a texture, apply it to a frame, and dynamically change its color using the `SetTexture` method based on user interaction with a button.

## SetColorTexture
This method changes the color of a texture by setting its red, green, blue, and alpha components.

### Parameters
- **r** (number): The red component of the color (0.0 to 1.0).
- **g** (number): The green component of the color (0.0 to 1.0).
- **b** (number): The blue component of the color (0.0 to 1.0).
- **a** (number, optional): The alpha component of the color (0.0 to 1.0, default is 1.0). Controls the transparency of the texture.

### Returns
None

### Example Usage
```typescript
// Create a new texture
const myTexture = myFrame.CreateTexture();

// Set the texture's color to red with 50% opacity
myTexture.SetColorTexture(1.0, 0.0, 0.0, 0.5);

// Create a function to randomly change the texture's color
function RandomizeColor() {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    const a = Math.random() * 0.5 + 0.5; // Random alpha between 0.5 and 1.0
    myTexture.SetColorTexture(r, g, b, a);
}

// Call the RandomizeColor function every 1 second
setInterval(RandomizeColor, 1000);

// Set the texture's color based on a player's health percentage
function UpdateHealthColor() {
    const healthPercent = GetPlayerHealthPercent();
    const r = 1.0 - healthPercent;
    const g = healthPercent;
    myTexture.SetColorTexture(r, g, 0.0);
}

// Call the UpdateHealthColor function whenever the player's health changes
RegisterPlayerEvent(5, UpdateHealthColor); // PLAYER_EVENT_ON_HEALTH_CHANGE = 5
```

In this example, we create a new texture using `myFrame.CreateTexture()` and then set its color to red with 50% opacity using `SetColorTexture(1.0, 0.0, 0.0, 0.5)`.

We then define a function called `RandomizeColor()` that generates random values for the red, green, blue, and alpha components and sets the texture's color using `SetColorTexture()`. We use `setInterval()` to call this function every 1 second, resulting in the texture's color changing randomly.

Finally, we define another function called `UpdateHealthColor()` that sets the texture's color based on the player's current health percentage. We register this function to be called whenever the player's health changes using `RegisterPlayerEvent(5, UpdateHealthColor)`, where `5` corresponds to the `PLAYER_EVENT_ON_HEALTH_CHANGE` event.

This example demonstrates how `SetColorTexture()` can be used in various ways to dynamically change the color of a texture based on different conditions or events in the game.

