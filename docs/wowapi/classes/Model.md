## AdvanceTime
This method advances the time in the model's animation sequence by the specified amount. It allows you to progress the animation of a model, making it move or change its appearance over time.

### Parameters
* time: number - The amount of time, in seconds, to advance the animation.

### Example Usage
Here's an example of how to use the `AdvanceTime` method to create an animated NPC that moves and changes its appearance:

```typescript
const ANIMATION_INTERVAL = 2; // Animation interval in seconds

const onUpdate: world_event_on_update = (event: number, diff: number): void => {
    const modelEntry = 1234; // Replace with the desired model entry ID
    const position = { x: 0, y: 0, z: 0, o: 0 }; // Replace with the desired spawn position

    const npc = world.SpawnCreature(modelEntry, position.x, position.y, position.z, position.o, 1, 0);

    if (npc) {
        const model = npc.GetModel();
        if (model) {
            let elapsedTime = 0;
            const updateInterval = 1000; // Update interval in milliseconds

            const animateModel = (): void => {
                elapsedTime += updateInterval / 1000; // Convert milliseconds to seconds

                if (elapsedTime >= ANIMATION_INTERVAL) {
                    model.AdvanceTime(ANIMATION_INTERVAL);
                    elapsedTime = 0;
                }
            };

            const timerId = world.GetTimers().Start(updateInterval, animateModel, 0, updateInterval);

            world.GetTimers().Start(60000, (): void => {
                world.GetTimers().Stop(timerId);
                npc.DespawnOrUnsummon(0);
            }, 1);
        }
    }
};

RegisterWorldEvent(WorldEvents.WORLD_EVENT_ON_UPDATE, (...args) => onUpdate(...args));
```

In this example:
1. We define the desired animation interval (`ANIMATION_INTERVAL`) in seconds.
2. In the `onUpdate` event handler, we spawn an NPC using the `SpawnCreature` method, specifying the model entry ID and spawn position.
3. We retrieve the model of the spawned NPC using the `GetModel` method.
4. We initialize variables to track the elapsed time (`elapsedTime`) and the update interval (`updateInterval`).
5. We define a function called `animateModel` that will be called periodically to advance the animation.
6. Inside `animateModel`, we increment the `elapsedTime` by converting the `updateInterval` from milliseconds to seconds.
7. If the `elapsedTime` reaches or exceeds the `ANIMATION_INTERVAL`, we call the `AdvanceTime` method on the model, passing the `ANIMATION_INTERVAL` as the time to advance. We also reset the `elapsedTime` to zero.
8. We start a timer using `world.GetTimers().Start` to call `animateModel` periodically based on the `updateInterval`.
9. We start another timer that will stop the animation and despawn the NPC after 60 seconds (60000 milliseconds).

By using the `AdvanceTime` method in combination with timers, we can create animated NPCs that move and change their appearance over time, adding visual interest to the game world.

## GetFacing
Returns the direction the model is facing in radians.

### Parameters
This method does not take any parameters.

### Returns
facing: number - The direction the model is facing in radians.

### Example Usage
This example demonstrates how to use the `GetFacing()` method to determine the direction a model is facing and use that information to spawn a new creature facing the same direction.

```typescript
const MODEL_ENTRY = 1234;
const CREATURE_ENTRY = 5678;

const SpawnFacingCreature = (map: Map, x: number, y: number, z: number) => {
    const model = map.GetWorldObject(MODEL_ENTRY) as GameObject;
    if (!model) {
        console.log(`Model with entry ${MODEL_ENTRY} not found.`);
        return;
    }

    const facing = model.GetFacing();
    const creature = map.SpawnCreature(CREATURE_ENTRY, x, y, z, facing, 0, 0);
    if (!creature) {
        console.log(`Failed to spawn creature with entry ${CREATURE_ENTRY}.`);
        return;
    }

    console.log(`Spawned creature ${creature.GetName()} facing ${facing} radians.`);

    // Move the creature forward in the direction it's facing
    const distance = 10;
    const dx = Math.cos(facing) * distance;
    const dy = Math.sin(facing) * distance;
    creature.MoveTo(creature.GetX() + dx, creature.GetY() + dy, creature.GetZ(), true);
};

const map = GetMapById(0);
const x = 0;
const y = 0;
const z = 0;
SpawnFacingCreature(map, x, y, z);
```

In this example:
1. We define the `SpawnFacingCreature` function that takes the `map`, `x`, `y`, and `z` coordinates as parameters.
2. Inside the function, we retrieve the `GameObject` model using `map.GetWorldObject(MODEL_ENTRY)` and check if it exists.
3. If the model is found, we call `model.GetFacing()` to get the direction the model is facing in radians.
4. We then use `map.SpawnCreature(CREATURE_ENTRY, x, y, z, facing, 0, 0)` to spawn a new creature at the specified coordinates, facing the same direction as the model.
5. If the creature is successfully spawned, we log a message indicating the creature's name and the direction it's facing.
6. Finally, we calculate the new coordinates for the creature based on the facing direction and a specified `distance`, and use `creature.MoveTo()` to move the creature forward in that direction.

This example showcases how the `GetFacing()` method can be used in combination with other mod-eluna methods to create dynamic behavior based on the orientation of game objects or creatures.

## ClearModel
Clears the current model, removing all geometry, materials, and other associated data from memory.

### Parameters
None

### Returns
None

### Example Usage
This example demonstrates how to clear a model after it has been used, freeing up memory resources.

```typescript
// Load a model from file
const model = new Model();
model.LoadFile('path/to/model.mdx');

// Use the model for rendering or other purposes
// ...

// When finished with the model, clear it from memory
model.ClearModel();
```

In a more complex scenario, you might have a system that dynamically loads and unloads models based on the player's location or other game events. Here's an example of how you could manage this using the `ClearModel` method:

```typescript
const loadedModels: { [key: string]: Model } = {};

const LoadModelForZone = (zoneName: string): Model => {
    if (loadedModels[zoneName]) {
        return loadedModels[zoneName];
    }

    const model = new Model();
    model.LoadFile(`models/${zoneName}.mdx`);
    loadedModels[zoneName] = model;

    return model;
};

const UnloadModelForZone = (zoneName: string): void => {
    if (loadedModels[zoneName]) {
        loadedModels[zoneName].ClearModel();
        delete loadedModels[zoneName];
    }
};

const OnPlayerZoneChanged = (event: PlayerEvents, player: Player, newZone: number, newArea: number): void => {
    const zoneName = GetAreaName(newZone);

    // Unload models from the previous zone
    Object.keys(loadedModels).forEach((loadedZoneName) => {
        if (loadedZoneName !== zoneName) {
            UnloadModelForZone(loadedZoneName);
        }
    });

    // Load the model for the new zone
    const model = LoadModelForZone(zoneName);

    // Use the model for rendering or other purposes
    // ...
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ZONE_CHANGE, OnPlayerZoneChanged);
```

In this example, the `LoadModelForZone` function checks if the model for the given zone has already been loaded. If not, it loads the model from file and stores it in the `loadedModels` object. The `UnloadModelForZone` function clears the model using `ClearModel` and removes it from the `loadedModels` object.

When the player changes zones, the `OnPlayerZoneChanged` event handler is called. It unloads models from the previous zone and loads the model for the new zone using the `LoadModelForZone` function. This ensures that only the necessary models are kept in memory, while others are cleared to free up resources.

## GetLight
Retrieves the lighting information for the model.

### Parameters
None

### Returns
- enabled: boolean - Indicates whether lighting is enabled for the model.
- light: [ModelLight](./model-light.md) - The lighting information for the model.

### Example Usage
This example demonstrates how to retrieve the lighting information for a model and modify it based on certain conditions.

```typescript
function AdjustModelLighting(model: Model, lightIntensity: number, lightColor: [number, number, number, number]) {
    const [lightEnabled, light] = model.GetLight();

    if (lightEnabled) {
        // Adjust the light intensity
        light.Intensity = lightIntensity;

        // Set the light color
        light.ColorR = lightColor[0];
        light.ColorG = lightColor[1];
        light.ColorB = lightColor[2];
        light.ColorA = lightColor[3];

        // Update the light direction based on the model's orientation
        const [dirX, dirY, dirZ] = model.GetOrientation();
        light.DirectionX = dirX;
        light.DirectionY = dirY;
        light.DirectionZ = dirZ;

        // Apply the updated lighting to the model
        model.SetLight(light);
    } else {
        // Enable lighting for the model
        model.SetLight(true, light);
    }
}

// Usage example
const model = GetModelByEntry(1234);
const lightIntensity = 1.5;
const lightColor: [number, number, number, number] = [1.0, 0.8, 0.6, 1.0];

AdjustModelLighting(model, lightIntensity, lightColor);
```

In this example, the `AdjustModelLighting` function takes a `Model` object, a `lightIntensity` value, and a `lightColor` array as parameters. It retrieves the current lighting information of the model using the `GetLight` method.

If lighting is already enabled for the model, it adjusts the light intensity and color based on the provided values. It also updates the light direction by retrieving the model's orientation using the `GetOrientation` method.

If lighting is not enabled, it enables lighting for the model using the `SetLight` method, passing `true` as the first parameter and the `light` object as the second parameter.

Finally, the example demonstrates how to use the `AdjustModelLighting` function by retrieving a model by its entry ID using the `GetModelByEntry` function, specifying the desired light intensity and color, and calling the function with the model and lighting parameters.

This example showcases a more complex usage scenario where the lighting information of a model is retrieved, modified based on certain conditions, and applied back to the model.

## AdvanceTime
This method advances the time in the model's animation sequence by the specified amount.

### Parameters
None

### Returns
None

### Example Usage
```typescript
// Create a new model instance
const model = new Model();

// Set the model's path to a specific file
model.SetModel("Interface\\AddOns\\MyAddon\\Models\\MyModel.m2");

// Set the model's position and scale
model.SetPosition(0, 0, 0);
model.SetModelScale(1);

// Set up a basic animation sequence
model.SetSequence(0);
model.SetAnimation(0, 0, 0);

// Create a frame to hold the model
const frame = CreateFrame("Frame", "MyModelFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Add the model to the frame
model.SetParent(frame);
model.SetAllPoints(frame);

// Define a function to advance the animation
function advanceAnimation() {
  // Advance the animation time by 50 milliseconds
  model.AdvanceTime(50);

  // Schedule the next animation update
  setTimeout(advanceAnimation, 50);
}

// Start the animation loop
advanceAnimation();
```

In this example, we create a new `Model` instance and set its path to a specific model file. We then set the model's position, scale, and animation sequence using the appropriate methods.

Next, we create a frame to hold the model and set its size and position. We add the model to the frame using `SetParent` and `SetAllPoints`.

Finally, we define a function called `advanceAnimation` that advances the animation time by 50 milliseconds using the `AdvanceTime` method. We then use `setTimeout` to schedule the next animation update after a short delay.

By calling `advanceAnimation` initially, we start the animation loop, which continuously advances the model's animation time, creating a smooth and dynamic visual effect.

This example demonstrates how to use the `AdvanceTime` method in conjunction with other model-related methods to create an animated 3D model within a frame in an AIO plugin or World of Warcraft AddOn.

## GetFacing
This method returns the direction the model is facing in radians.

### Parameters
None

### Returns
**facing** number - The direction the model is facing in radians.

### Example Usage:
```typescript
// Create a model and set its initial facing direction
const model = CreateFrame("Model", "MyModel", UIParent);
model.SetModel("World\\Azeroth\\Elwynn\\Elwynn_Stormwind_02.M2");
model.SetFacing(0.5);

// Create a button to rotate the model
const button = CreateFrame("Button", "MyButton", UIParent, "UIPanelButtonTemplate");
button.SetPoint("CENTER", UIParent, "CENTER", 0, -50);
button.SetText("Rotate Model");
button.SetWidth(150);
button.SetHeight(30);

// Set up a click event handler for the button
button.SetScript("OnClick", () => {
  // Get the current facing direction of the model
  const currentFacing = model.GetFacing();

  // Calculate the new facing direction (rotate by 45 degrees)
  const newFacing = currentFacing + (Math.PI / 4);

  // Set the new facing direction of the model
  model.SetFacing(newFacing);

  // Print the current facing direction to the chat window
  print(`Current facing direction: ${currentFacing.toFixed(2)} radians`);
});

// Position the model and set its size
model.SetPoint("CENTER", UIParent, "CENTER", 0, 50);
model.SetWidth(200);
model.SetHeight(200);
```

In this example:
1. We create a model frame and set its initial facing direction using `SetFacing()`.
2. We create a button to trigger the rotation of the model.
3. We set up a click event handler for the button.
4. Inside the event handler:
   - We get the current facing direction of the model using `GetFacing()`.
   - We calculate the new facing direction by adding 45 degrees (π/4 radians) to the current facing direction.
   - We set the new facing direction of the model using `SetFacing()`.
   - We print the current facing direction to the chat window for debugging purposes.
5. Finally, we position the model frame and set its size.

When the button is clicked, the model will rotate by 45 degrees each time, and the current facing direction will be printed to the chat window.

This example demonstrates how to use the `GetFacing()` method to retrieve the current facing direction of a model and how to update the facing direction dynamically based on user interaction or other events in the addon.

## ClearModel
This method clears the current model and removes it from the rendering pipeline.

### Parameters
None

### Returns
None

### Example Usage
```typescript
// Create a new model instance
const model = new Model();

// Load a model file
model.LoadModel("Interface\\MyModels\\MyModel.m2");

// Set the model's position, rotation, and scale
model.SetPosition(0, 0, 0);
model.SetRotation(0, 0, 0);
model.SetScale(1);

// Enable the model for rendering
model.SetEnabled(true);

// Render the model for a few frames
for (let i = 0; i < 10; i++) {
    // Perform any necessary updates or animations
    model.SetRotation(0, i * 0.1, 0);

    // Render the frame
    RenderFrame();
}

// Clear the model when it's no longer needed
model.ClearModel();

// The model is now removed from the rendering pipeline
// and can be safely discarded or reused for a different model
```

In this example:
1. We create a new `Model` instance using the `new` keyword.
2. We load a model file using the `LoadModel` method, specifying the path to the model file.
3. We set the initial position, rotation, and scale of the model using the respective methods.
4. We enable the model for rendering using the `SetEnabled` method.
5. We enter a loop to render the model for a few frames. In each iteration:
   - We update the model's rotation to create a simple animation effect.
   - We call the `RenderFrame` function to render the current frame.
6. After rendering the desired frames, we call the `ClearModel` method to clear the model and remove it from the rendering pipeline.
7. The model is now cleared and can be safely discarded or reused for loading a different model.

This example demonstrates how to load a model, set its properties, render it for a few frames with a simple animation, and then clear the model when it's no longer needed. The `ClearModel` method is used to properly clean up the model and remove it from the rendering pipeline.

## GetLight
This method returns the current lighting information for the Model instance.

### Parameters
None

### Returns
**enabled** boolean - Indicates whether the lighting is enabled or not.
**light** ModelLight - The current lighting settings for the model.

### Example Usage:
```lua
-- Create a new Model instance
local model = CreateFrame("Model")
model:SetModel("World\\Azeroth\\Azeroth.m2")
model:SetCamera(0)
model:SetPosition(0, 0, 0)
model:SetFacing(0)

-- Enable lighting and set the lighting settings
model:SetLight(true)
model:SetModelLight(1, 0, 0, 0, 0, 1, 1.0, 1.0, 1.0)

-- Get the current lighting information
local isLightEnabled, light = model:GetLight()

if isLightEnabled then
    print("Lighting is enabled")
    print("Ambient color: " .. light.ambientColor.r .. ", " .. light.ambientColor.g .. ", " .. light.ambientColor.b)
    print("Diffuse color: " .. light.diffuseColor.r .. ", " .. light.diffuseColor.g .. ", " .. light.diffuseColor.b)
    print("Direction: " .. light.dirX .. ", " .. light.dirY .. ", " .. light.dirZ)
else
    print("Lighting is disabled")
end

-- Update the model's position and rotation
local function UpdateModel(self, elapsed)
    local facing = self:GetFacing() + elapsed * 0.5
    self:SetFacing(facing)
end

model:SetScript("OnUpdate", UpdateModel)
```

In this example:
1. We create a new Model instance using `CreateFrame("Model")`.
2. We set the model file using `SetModel()` and configure its initial camera, position, and facing.
3. We enable lighting for the model using `SetLight(true)`.
4. We set the lighting settings using `SetModelLight()`, specifying the ambient color, diffuse color, and light direction.
5. We retrieve the current lighting information using `GetLight()`, which returns a boolean indicating whether lighting is enabled and a table containing the lighting settings.
6. We print the lighting information, including the ambient color, diffuse color, and light direction.
7. We define an update function `UpdateModel()` that is called every frame to update the model's facing.
8. We set the update function as the script for the "OnUpdate" event of the model using `SetScript()`.

This example demonstrates how to create a Model instance, enable lighting, set the lighting settings, retrieve the current lighting information using `GetLight()`, and update the model's orientation over time.

## GetModel
Returns the file path of the model currently assigned to the Model frame.

### Parameters
None

### Returns
string - The file path of the model.

### Example Usage
```typescript
// Create a Model frame
const modelFrame = CreateFrame("Model", "MyModelFrame", UIParent);
modelFrame.SetSize(200, 200);
modelFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set the model to display
modelFrame.SetModel("Interface\\Buttons\\UI-GroupLoot-Dice-Up.mdx");

// Get the file path of the currently displayed model
const modelPath = modelFrame.GetModel();

// Print the model path
print("Current model path:", modelPath);

// Create a button to change the displayed model
const changeModelButton = CreateFrame("Button", "ChangeModelButton", UIParent, "UIPanelButtonTemplate");
changeModelButton.SetSize(150, 30);
changeModelButton.SetPoint("TOP", modelFrame, "BOTTOM", 0, -10);
changeModelButton.SetText("Change Model");

// Set the button's click event
changeModelButton.SetScript("OnClick", () => {
    // Change the displayed model
    modelFrame.SetModel("Interface\\Buttons\\UI-GroupLoot-Coin-Up.mdx");

    // Get the updated model path
    const newModelPath = modelFrame.GetModel();

    // Print the updated model path
    print("Updated model path:", newModelPath);
});
```

In this example:
1. We create a Model frame using `CreateFrame` and set its size and position.
2. We set the initial model to display using `SetModel` with the file path of the desired model.
3. We retrieve the file path of the currently displayed model using `GetModel` and store it in the `modelPath` variable.
4. We print the current model path using `print`.
5. We create a button frame using `CreateFrame` with the "UIPanelButtonTemplate" template and set its size, position, and text.
6. We set the button's click event using `SetScript` with "OnClick" as the event type.
7. Inside the click event handler, we change the displayed model using `SetModel` with a different file path.
8. We retrieve the updated model path using `GetModel` and store it in the `newModelPath` variable.
9. We print the updated model path using `print`.

This example demonstrates how to create a Model frame, set a model to display, retrieve the file path of the currently displayed model using `GetModel`, and update the displayed model dynamically using a button click event.

## GetModelFileID

This method returns the file ID associated with the currently displayed model.

### Parameters

None

### Returns

- `number` - The file ID of the currently displayed model.

### Example Usage

```typescript
// Create a new frame
const frame = CreateFrame("Frame", "ModelFrame", UIParent, "ModelFrameTemplate");
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Get the model from the frame
const model = frame.GetModel();

// Load a specific model by its file ID
model.SetModel(918); // Load the "Creature\\Illidan\\Illidan.m2" model

// Get the file ID of the currently displayed model
const fileID = model.GetModelFileID();
print("Current model file ID:", fileID);

// Create a button to toggle between two models
const button = CreateFrame("Button", "ToggleModelButton", frame, "UIPanelButtonTemplate");
button.SetSize(100, 30);
button.SetText("Toggle Model");
button.SetPoint("BOTTOM", frame, "BOTTOM", 0, -20);

let isAlternateModel = false;
button.SetScript("OnClick", () => {
    if (isAlternateModel) {
        model.SetModel(918); // Load the "Creature\\Illidan\\Illidan.m2" model
    } else {
        model.SetModel(1687); // Load the "Creature\\Arthaslichking\\arthaslichking.m2" model
    }
    isAlternateModel = !isAlternateModel;

    const currentFileID = model.GetModelFileID();
    print("Current model file ID:", currentFileID);
});

// Show the frame
frame.Show();
```

In this example:
1. We create a new frame using the "ModelFrameTemplate" and set its size and position.
2. We retrieve the model object from the frame using `GetModel()`.
3. We load a specific model by its file ID using `SetModel()`. In this case, we load the "Creature\\Illidan\\Illidan.m2" model with file ID 918.
4. We call `GetModelFileID()` to retrieve the file ID of the currently displayed model and print it.
5. We create a button labeled "Toggle Model" and set its size and position within the frame.
6. We define a variable `isAlternateModel` to keep track of the model state.
7. We set a script for the button's "OnClick" event. When clicked, it toggles between two different models based on the value of `isAlternateModel`.
8. Inside the button's click event, we call `SetModel()` to load the appropriate model based on the `isAlternateModel` flag.
9. We update the `isAlternateModel` flag to toggle between the two models.
10. We call `GetModelFileID()` again to retrieve the file ID of the newly loaded model and print it.
11. Finally, we show the frame to make it visible.

This example demonstrates how to create a frame with a model, load different models by their file IDs, retrieve the currently displayed model's file ID using `GetModelFileID()`, and toggle between two models using a button.

## GetModelScale

This method returns the current scale of the model.

### Parameters

None

### Returns

**scale** number - The current scale of the model.

### Example Usage

```typescript
// Create a frame to hold the model
const modelFrame = CreateFrame("PlayerModel", "MyModelFrame", UIParent);
modelFrame.SetSize(200, 200);
modelFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set the model to display
modelFrame.SetModel("creature\\illidan\\illidan.m2");

// Get the current scale of the model
const currentScale = modelFrame.GetModelScale();
print("Current model scale:", currentScale);

// Set a new scale for the model
const newScale = 1.5;
modelFrame.SetModelScale(newScale);

// Verify the scale has been updated
const updatedScale = modelFrame.GetModelScale();
print("Updated model scale:", updatedScale);

// Create a button to toggle between scales
const scaleButton = CreateFrame("Button", "ScaleToggleButton", UIParent, "UIPanelButtonTemplate");
scaleButton.SetSize(100, 30);
scaleButton.SetPoint("BOTTOM", UIParent, "BOTTOM", 0, 50);
scaleButton.SetText("Toggle Scale");

let isLargeScale = true;
scaleButton.SetScript("OnClick", () => {
    if (isLargeScale) {
        modelFrame.SetModelScale(1.0);
        isLargeScale = false;
    } else {
        modelFrame.SetModelScale(newScale);
        isLargeScale = true;
    }
});
```

In this example:

1. We create a frame (`modelFrame`) to hold the model using `CreateFrame` and set its size and position.

2. We set the model to display using `SetModel`, specifying the path to the model file.

3. We retrieve the current scale of the model using `GetModelScale` and print it.

4. We set a new scale for the model using `SetModelScale` and pass the desired scale value.

5. We verify that the scale has been updated by calling `GetModelScale` again and printing the updated value.

6. We create a button (`scaleButton`) using `CreateFrame` with the "UIPanelButtonTemplate" template.

7. We set the size, position, and text of the button.

8. We define a variable `isLargeScale` to keep track of the current scale state.

9. We set an "OnClick" script for the button using `SetScript`. When the button is clicked, it toggles between the original scale (1.0) and the new scale (1.5) by calling `SetModelScale` accordingly. The `isLargeScale` variable is updated to reflect the current scale state.

This example demonstrates how to retrieve the current scale of a model using `GetModelScale`, set a new scale using `SetModelScale`, and create a button to toggle between different scales. It provides a practical use case of adjusting the model's scale and interacting with it through a button click event.

## GetModelAlpha
This method returns the current alpha transparency of the model.

### Parameters
None

### Returns
**alpha** number - The current alpha transparency of the model, ranging from 0 (fully transparent) to 1 (fully opaque).

### Example Usage:
```typescript
// Create a frame
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a model
const model = CreateModel();
model.SetParent(frame);
model.SetSize(200, 200);
model.SetPoint("CENTER", frame, "CENTER", 0, 0);
model.SetModel("Interface\\Buttons\\CheckButtonHilight.m2");

// Set the initial alpha of the model
model.SetModelAlpha(0.5);

// Create a button to toggle the model's alpha
const button = CreateFrame("Button", "ToggleAlphaButton", frame, "UIPanelButtonTemplate");
button.SetSize(100, 30);
button.SetPoint("BOTTOM", frame, "BOTTOM", 0, -20);
button.SetText("Toggle Alpha");

// Set the button's click event
button.SetScript("OnClick", () => {
    const currentAlpha = model.GetModelAlpha();
    if (currentAlpha === 1) {
        // If the model is fully opaque, set it to half transparent
        model.SetModelAlpha(0.5);
    } else {
        // If the model is not fully opaque, set it to fully opaque
        model.SetModelAlpha(1);
    }
});

// Show the frame
frame.Show();
```

In this example:
1. We create a frame to hold our model and button.
2. We create a model and set its parent to the frame, size, position, and the actual model file to display.
3. We set the initial alpha of the model to 0.5 (half transparent) using `SetModelAlpha()`.
4. We create a button to toggle the model's alpha and set its parent, size, position, and text.
5. We set the button's click event using `SetScript()`. When the button is clicked, we retrieve the current alpha of the model using `GetModelAlpha()`. If the model is fully opaque (alpha = 1), we set it to half transparent (alpha = 0.5). Otherwise, we set it to fully opaque.
6. Finally, we show the frame to make it visible.

This example demonstrates how to use `GetModelAlpha()` to retrieve the current alpha transparency of a model and how to toggle the model's alpha using a button.

## GetModelPosition
This method returns the current position of the model within its frame.

### Parameters
None

### Returns
A tuple containing the following values:
- `x` (number): The x-coordinate of the model's position.
- `y` (number): The y-coordinate of the model's position.
- `z` (number): The z-coordinate of the model's position.

### Example Usage
```lua
-- Create a model frame
local modelFrame = CreateFrame("PlayerModel", "MyModelFrame", UIParent)
modelFrame:SetSize(200, 200)
modelFrame:SetPoint("CENTER", UIParent, "CENTER")

-- Set the model to display
modelFrame:SetModel("character\\bloodelf\\female\\bloodelffemale.m2")

-- Define a function to update the model's position
local function UpdateModelPosition()
    -- Get the current position of the model
    local x, y, z = modelFrame:GetModelPosition()

    -- Print the position coordinates
    print("Model Position:")
    print("X:", x)
    print("Y:", y)
    print("Z:", z)

    -- Calculate new position coordinates
    local newX = x + math.random(-1, 1) * 0.1
    local newY = y + math.random(-1, 1) * 0.1
    local newZ = z + math.random(-1, 1) * 0.1

    -- Set the new position of the model
    modelFrame:SetModelPosition(newX, newY, newZ)
end

-- Call the function every second to update the model's position
C_Timer.NewTicker(1, UpdateModelPosition)
```

In this example:
1. We create a model frame using `CreateFrame` and set its size and position.
2. We set the model to display using `SetModel`, specifying the path to the model file.
3. We define a function called `UpdateModelPosition` that retrieves the current position of the model using `GetModelPosition`.
4. Inside the function, we print the current position coordinates.
5. We calculate new position coordinates by adding small random offsets to the current coordinates.
6. We set the new position of the model using `SetModelPosition` with the calculated coordinates.
7. Finally, we use `C_Timer.NewTicker` to call the `UpdateModelPosition` function every second, continuously updating the model's position.

This example demonstrates how to retrieve the current position of the model using `GetModelPosition`, modify the position coordinates, and set the new position using `SetModelPosition`. The model's position will randomly change every second within a small range, creating a subtle animation effect.

## SetDisplayInfo
This method sets the display information of the model directly using the provided display ID.

### Parameters
- **displayId** (number): The display ID to set for the model.

### Returns
None

### Example Usage
```typescript
// Create a model frame
const modelFrame = CreateFrame("Model", "MyModelFrame", UIParent);
modelFrame.SetWidth(200);
modelFrame.SetHeight(200);
modelFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set the display info of the model
const displayId = 1234; // Replace with the desired display ID
modelFrame.SetDisplayInfo(displayId);

// Additional customization and configuration
modelFrame.SetRotation(0, 0); // Set the initial rotation angles
modelFrame.SetPosition(0, 0, 0); // Set the initial position
modelFrame.SetCamDistanceScale(1.5); // Adjust the camera distance

// Create a button to change the display info
const button = CreateFrame("Button", "ChangeDisplayButton", UIParent, "UIPanelButtonTemplate");
button.SetWidth(150);
button.SetHeight(30);
button.SetText("Change Display");
button.SetPoint("TOP", modelFrame, "BOTTOM", 0, -20);

button.SetScript("OnClick", () => {
    // Change the display info when the button is clicked
    const newDisplayId = 5678; // Replace with the new display ID
    modelFrame.SetDisplayInfo(newDisplayId);
});

// Show the model frame and button
modelFrame.Show();
button.Show();
```

In this example:
1. A model frame is created using `CreateFrame` with the name "MyModelFrame" and set as a child of `UIParent`.
2. The width and height of the model frame are set using `SetWidth` and `SetHeight`.
3. The model frame is positioned at the center of the screen using `SetPoint`.
4. The display information of the model is set using `SetDisplayInfo` with the provided `displayId`.
5. Additional customization and configuration options are applied to the model frame, such as setting the initial rotation angles, position, and camera distance.
6. A button is created using `CreateFrame` with the name "ChangeDisplayButton" and set as a child of `UIParent`.
7. The width, height, and text of the button are set using `SetWidth`, `SetHeight`, and `SetText`.
8. The button is positioned below the model frame using `SetPoint`.
9. An `OnClick` script is assigned to the button using `SetScript`. When the button is clicked, it changes the display information of the model using `SetDisplayInfo` with a new `newDisplayId`.
10. Finally, the model frame and button are shown using `Show`.

This example demonstrates how to create a model frame, set its display information using `SetDisplayInfo`, and provide a button to change the display info dynamically. It also includes additional customization options for the model frame, such as setting the rotation, position, and camera distance.

## SetGlow
This method sets the glow effect intensity for the Model instance.

### Parameters
- **glow** (number): The glow intensity value. It should be a non-negative number.

### Returns
- None

### Example Usage
```typescript
// Create a new Model instance
const myModel = new Model();

// Load a model file
myModel.Load("Models\\MyModel.m2");

// Set the model's position
myModel.SetPosition(0, 0, 0);

// Set the model's scale
myModel.SetScale(1);

// Enable the glow effect with an intensity of 2.5
myModel.SetGlow(2.5);

// Create a frame to hold the model
const frame = CreateFrame("Frame", "MyFrame", UIParent);
frame.SetSize(200, 200);
frame.SetPoint("CENTER");

// Add the model to the frame
const modelFrame = CreateFrame("Model", "MyModelFrame", frame);
modelFrame.SetAllPoints(frame);
modelFrame.SetModel(myModel);

// Define a function to update the glow intensity based on some condition
function updateGlow() {
  const glowIntensity = UnitHealth("player") / UnitHealthMax("player") * 5;
  myModel.SetGlow(glowIntensity);
}

// Set up an event to trigger the glow update function
frame.RegisterEvent("UNIT_HEALTH");
frame.SetScript("OnEvent", function(self, event, unit)
  if (unit === "player") {
    updateGlow();
  }
end);
```

In this example, we create a new `Model` instance and load a model file. We set the model's position, scale, and enable the glow effect with an initial intensity of 2.5 using the `SetGlow` method.

We then create a frame to hold the model and add the model to the frame using a `Model` frame.

Next, we define a function called `updateGlow` that calculates the glow intensity based on the player's health percentage. It multiplies the percentage by 5 to get a value between 0 and 5. We use this function to update the glow intensity dynamically.

Finally, we set up an event listener for the `UNIT_HEALTH` event, which triggers whenever the player's health changes. When the event occurs for the player unit, we call the `updateGlow` function to update the glow intensity based on the current health percentage.

This example demonstrates how the `SetGlow` method can be used to set the initial glow intensity and how it can be dynamically updated based on certain conditions or events in the game.

## SetModel
This method sets the model to a specific asset string `.mdx` / `.m2` file path.

### Parameters
- `path` (string): The file path to the model asset. It should be relative to the WoW base directory.
- `noMip` (boolean, optional): If set to `true`, the model will not use mipmapping. Default is `false`.

### Returns
None

### Example Usage
```typescript
// Create a new model instance
const myModel = new Model();

// Set the model to a female night elf character
myModel.SetModel("Character\\NightElf\\Female\\NightElfFemale.mdx");

// Create a frame to hold the model
const modelFrame = CreateFrame("PlayerModel", "myModelFrame", UIParent);
modelFrame.SetSize(200, 200);
modelFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set the model to the frame
modelFrame.SetModel(myModel);

// Create a button to change the model
const button = CreateFrame("Button", "myButton", UIParent, "UIPanelButtonTemplate");
button.SetSize(100, 30);
button.SetPoint("TOP", modelFrame, "BOTTOM", 0, -10);
button.SetText("Change Model");

// Set up a click event for the button
button.SetScript("OnClick", () => {
    // Change the model to a male human character when the button is clicked
    myModel.SetModel("Character\\Human\\Male\\HumanMale.mdx", true);
    modelFrame.SetModel(myModel);
});

// Create a function to rotate the model
function RotateModel() {
    modelFrame.SetFacing((modelFrame.GetFacing() + 0.05) % (2 * Math.PI));
}

// Set up an OnUpdate script to rotate the model every frame
modelFrame.SetScript("OnUpdate", RotateModel);
```

In this example, we create a new `Model` instance and set its model to a female night elf character using the `SetModel` method. We then create a frame to hold the model and set the model to the frame.

We also create a button that, when clicked, changes the model to a male human character using `SetModel` with the `noMip` parameter set to `true`.

Finally, we create a function to rotate the model and set up an `OnUpdate` script to call this function every frame, resulting in a continuously rotating model.

## SetModelScale
This method sets the size of the model within the frame.

### Parameters
- **scale** (number): The scale factor to apply to the model. A value of 1 represents the default size, while values greater than 1 will enlarge the model and values less than 1 will shrink it.

### Returns
None

### Example Usage
```typescript
// Create a new frame to hold the model
const modelFrame = CreateFrame("Frame", "MyModelFrame", UIParent);
modelFrame.SetSize(200, 200);
modelFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a new model instance
const model = modelFrame.CreateModel();

// Load a specific model file
model.SetModel("Interface\\Buttons\\ButtonHilight-Square.mdx");

// Set the initial model scale
model.SetModelScale(1.5);

// Create a button to increase the model scale
const scaleUpButton = CreateFrame("Button", "ScaleUpButton", modelFrame, "UIPanelButtonTemplate");
scaleUpButton.SetSize(100, 30);
scaleUpButton.SetPoint("BOTTOM", modelFrame, "BOTTOM", 0, -20);
scaleUpButton.SetText("Scale Up");
scaleUpButton.SetScript("OnClick", () => {
  const currentScale = model.GetModelScale();
  model.SetModelScale(currentScale + 0.1);
});

// Create a button to decrease the model scale
const scaleDownButton = CreateFrame("Button", "ScaleDownButton", modelFrame, "UIPanelButtonTemplate");
scaleDownButton.SetSize(100, 30);
scaleDownButton.SetPoint("BOTTOM", scaleUpButton, "TOP", 0, 10);
scaleDownButton.SetText("Scale Down");
scaleDownButton.SetScript("OnClick", () => {
  const currentScale = model.GetModelScale();
  model.SetModelScale(currentScale - 0.1);
});
```

In this example:

1. We create a new frame called `modelFrame` to hold the model.
2. We set the size and position of the `modelFrame` within the UI.
3. We create a new model instance using `modelFrame.CreateModel()`.
4. We load a specific model file using `model.SetModel()`.
5. We set the initial scale of the model using `model.SetModelScale()` with a value of 1.5.
6. We create a button called `scaleUpButton` to increase the model scale.
7. We set the size, position, and text of the `scaleUpButton`.
8. We define an `OnClick` event handler for the `scaleUpButton` that retrieves the current scale of the model using `model.GetModelScale()`, increases it by 0.1, and applies the new scale using `model.SetModelScale()`.
9. We create another button called `scaleDownButton` to decrease the model scale.
10. We set the size, position, and text of the `scaleDownButton`.
11. We define an `OnClick` event handler for the `scaleDownButton` that retrieves the current scale of the model, decreases it by 0.1, and applies the new scale.

This example demonstrates how to create a model, load a specific model file, set the initial scale, and provide buttons to interactively adjust the model scale using the `SetModelScale` method.

## SetPosition
This method sets the position of the 3D model relative to the bottom-left corner of its parent frame.

### Parameters
- **x** (number): The x-coordinate of the model's position.
- **y** (number): The y-coordinate of the model's position.
- **z** (number): The z-coordinate of the model's position.

### Returns
This method does not return any value.

### Example Usage
```typescript
// Create a new frame to hold the 3D model
const modelFrame = CreateFrame("Frame", "MyModelFrame", UIParent);
modelFrame.SetSize(200, 200);
modelFrame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Create a new 3D model and attach it to the frame
const model = modelFrame.CreateModel();
model.SetModel("Interface\\Models\\Creature\\Arthas\\Arthas.m2");

// Set the initial position of the model
model.SetPosition(0, 0, 0);

// Create a function to update the model's position based on the mouse cursor
function UpdateModelPosition()
{
    const cursorX, cursorY = GetCursorPosition();
    const frameX, frameY = modelFrame.GetCenter();
    const scale = modelFrame.GetEffectiveScale();

    const x = (cursorX - frameX) / scale;
    const y = (frameY - cursorY) / scale;
    const z = 0;

    model.SetPosition(x, y, z);
}

// Register the update function to be called on every frame
modelFrame.SetScript("OnUpdate", UpdateModelPosition);
```

In this example, we create a new frame called `MyModelFrame` to hold the 3D model. We set its size to 200x200 pixels and position it at the center of the screen using `SetSize` and `SetPoint`.

Next, we create a new `Model` object using `CreateModel` and attach it to the frame. We set the model's file path using `SetModel` to load the Arthas model.

We set the initial position of the model to (0, 0, 0) using `SetPosition`.

Then, we define a function called `UpdateModelPosition` that calculates the new position of the model based on the mouse cursor's position relative to the frame. We use `GetCursorPosition` to get the cursor's coordinates, `GetCenter` to get the frame's center point, and `GetEffectiveScale` to account for any scaling applied to the frame.

We calculate the new x, y, and z coordinates by subtracting the frame's center from the cursor's position and dividing by the scale. We pass these coordinates to `SetPosition` to update the model's position.

Finally, we register the `UpdateModelPosition` function to be called on every frame using `SetScript("OnUpdate", ...)`. This ensures that the model's position is continuously updated as the mouse cursor moves.

With this setup, the 3D model will follow the mouse cursor's position within the frame, creating an interactive experience.

## SetFacing
This method sets the direction the model is facing.

### Parameters
- **facing** (number): The direction in which the model should face, expressed as a radian value.

### Returns
This method does not return any value.

### Example Usage
```typescript
// Create a model and set its path
const model = CreateFrame("Model", "MyModel", UIParent);
model.SetModel("World\\Azeroth\\Azeroth.m2");

// Set the model's position and size
model.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
model.SetSize(200, 200);

// Create a function to smoothly rotate the model
function RotateModel(model: Model, targetFacing: number, duration: number) {
    const startFacing = model.GetFacing();
    const elapsed = 0;
    const timer = CreateTimer();

    timer.SetScript("OnUpdate", () => {
        elapsed += timer.GetElapsed();
        const progress = elapsed / duration;

        if (progress >= 1) {
            model.SetFacing(targetFacing);
            timer.Cancel();
        } else {
            const facing = startFacing + (targetFacing - startFacing) * progress;
            model.SetFacing(facing);
        }
    });

    timer.Start(0.01, 0);
}

// Rotate the model to face north (0 radians)
RotateModel(model, 0, 1);

// After 3 seconds, rotate the model to face east (PI/2 radians)
DelayExecute(3, () => {
    RotateModel(model, Math.PI / 2, 1);
});
```

In this example:

1. We create a `Model` frame named "MyModel" and set its model path to "World\\Azeroth\\Azeroth.m2".
2. We set the model's position to the center of the screen and its size to 200x200 pixels.
3. We define a helper function `RotateModel` that smoothly rotates the model from its current facing to a target facing over a specified duration. This function uses a timer to interpolate the facing value over time.
4. We call `RotateModel` to rotate the model to face north (0 radians) over a duration of 1 second.
5. After a delay of 3 seconds, we call `RotateModel` again to rotate the model to face east (PI/2 radians) over a duration of 1 second.

This example demonstrates how to use the `SetFacing` method to change the direction the model is facing. By using a smoothing function like `RotateModel`, you can create more visually appealing transitions when changing the model's facing.

## SetSequence
This method sets the sequence to be played on a Model object. The selected sequence seems to play only once, but for some sequences, it is repeated infinitely. It is recommended to use a third-party application to preview the animation sequences available for a certain mesh.

### Parameters
- **sequence** (number): The sequence number to be played on the Model object.

### Returns
None

### Example Usage
```typescript
// Create a new Model object
const myModel = new Model();

// Load a mesh file into the Model object
myModel.Load("World\\AZEROTH\\ELWYNN\\PASSIVEDOODADS\\Stormwind\\Stormwind_Cathedral\\StormwindCathedral.m2");

// Set the position and scale of the Model object
myModel.SetPosition(0, 0, 0);
myModel.SetScale(0.5);

// Get the number of available sequences for the loaded mesh
const sequenceCount = myModel.GetSequenceCount();

// Set the sequence to be played (assuming the mesh has at least 2 sequences)
const sequenceToPlay = 1;
if (sequenceToPlay < sequenceCount) {
  myModel.SetSequence(sequenceToPlay);
} else {
  console.error("Invalid sequence number. Please choose a valid sequence.");
}

// Create a frame to hold the Model object
const frame = CreateFrame("Frame", "MyModelFrame", UIParent);
frame.SetSize(500, 500);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Add the Model object to the frame
myModel.SetParent(frame);
myModel.SetAllPoints(frame);

// Show the frame
frame.Show();
```

In this example:
1. We create a new `Model` object using the `new` keyword.
2. We load a mesh file into the `Model` object using the `Load` method, specifying the path to the mesh file.
3. We set the position and scale of the `Model` object using the `SetPosition` and `SetScale` methods.
4. We retrieve the number of available sequences for the loaded mesh using the `GetSequenceCount` method.
5. We set the sequence to be played using the `SetSequence` method, passing the desired sequence number as an argument. We also include a check to ensure that the chosen sequence number is valid based on the available sequences.
6. We create a new frame using the `CreateFrame` function to hold the `Model` object.
7. We set the size and position of the frame using the `SetSize` and `SetPoint` methods.
8. We add the `Model` object to the frame using the `SetParent` method and make it fill the entire frame using the `SetAllPoints` method.
9. Finally, we show the frame using the `Show` method to display the `Model` object with the selected sequence playing.

This example demonstrates how to use the `SetSequence` method along with other related methods to load a mesh, set its properties, and display it within a frame while playing a specific animation sequence.

## SetCamera
This method sets the camera type for the Model instance.

### Parameters
- **type** (number): The camera type to set. Possible values are:
  - 0: Head camera
  - 1: Body camera

### Returns
None

### Example Usage
```typescript
// Create a model instance
const model = new Model();

// Load a model file
model.Load("path/to/model.m2");

// Set the model's position and scale
model.SetPosition(0, 0, 0);
model.SetScale(1);

// Set the camera type to body camera
model.SetCamera(1);

// Create a frame to hold the model
const frame = CreateFrame("Frame", "ModelFrame", UIParent);
frame.SetSize(400, 400);
frame.SetPoint("CENTER", UIParent, "CENTER", 0, 0);

// Set the model as a child of the frame
model.SetParent(frame);

// Enable mouse rotation for the model
model.EnableMouse(true);

// Set up event handlers for mouse interactions
frame.SetScript("OnMouseDown", (self, button) => {
  if (button === "LeftButton") {
    model.SetScript("OnUpdate", (self, elapsed) => {
      const x, y = GetCursorPosition();
      model.SetFacing(model.GetFacing() + (x - self.lastX) / 35);
      self.lastX, self.lastY = x, y;
    });
  }
});

frame.SetScript("OnMouseUp", (self, button) => {
  if (button === "LeftButton") {
    model.SetScript("OnUpdate", null);
  }
});
```

In this example:
1. We create a new `Model` instance using the `new` keyword.
2. We load a model file using the `Load` method, specifying the path to the model file.
3. We set the model's position and scale using `SetPosition` and `SetScale` methods.
4. We set the camera type to body camera using `SetCamera(1)`.
5. We create a frame named "ModelFrame" using `CreateFrame` to hold the model.
6. We set the size and position of the frame using `SetSize` and `SetPoint` methods.
7. We set the model as a child of the frame using `SetParent`.
8. We enable mouse rotation for the model using `EnableMouse(true)`.
9. We set up event handlers for mouse interactions using `SetScript`:
   - On "OnMouseDown" event, we start updating the model's facing based on the mouse movement.
   - On "OnMouseUp" event, we stop updating the model's facing.

This example demonstrates how to set the camera type for a model, create a frame to hold the model, and enable mouse interactions for rotating the model based on mouse movements.

## SetAlpha
This method sets the alpha (transparency) value of the model.

### Parameters
- **alpha** (number): The alpha value to set. It should be a number between 0 and 1, where 0 is fully transparent and 1 is fully opaque.

### Returns
- **void**

### Example Usage
```typescript
// Create a model and set its file path
const model = CreateFrame("Model", "MyModel", UIParent);
model.SetModel("Interface\\MyModels\\MyModel.m2");

// Set the model's position and size
model.SetPoint("CENTER", UIParent, "CENTER", 0, 0);
model.SetSize(200, 200);

// Create a function to handle alpha changes
function handleAlphaChange()
    // Get the current alpha value from a slider
    const alphaSlider = CreateFrame("Slider", "MyAlphaSlider", UIParent, "SliderTemplate");
    alphaSlider.SetMinMaxValues(0, 1);
    alphaSlider.SetValue(1);
    alphaSlider.SetValueStep(0.1);
    alphaSlider.SetPoint("BOTTOM", UIParent, "BOTTOM", 0, 20);

    // Set the model's alpha value based on the slider
    const alpha = alphaSlider.GetValue();
    model.SetAlpha(alpha);
end

// Create a button to toggle the model's visibility
const visibilityButton = CreateFrame("Button", "MyVisibilityButton", UIParent, "UIPanelButtonTemplate");
visibilityButton.SetSize(100, 30);
visibilityButton.SetPoint("TOP", UIParent, "TOP", 0, -20);
visibilityButton.SetText("Toggle Visibility");
visibilityButton.SetScript("OnClick", function()
    if (model.GetAlpha() > 0) then
        // Set the model to be fully transparent
        model.SetAlpha(0);
    else
        // Set the model to be fully opaque
        model.SetAlpha(1);
    end
end);

// Set the initial alpha value and register the alpha change event
model.SetAlpha(1);
alphaSlider.SetScript("OnValueChanged", handleAlphaChange);
```

In this example:
1. We create a model and set its file path using `SetModel()`.
2. We set the model's position and size using `SetPoint()` and `SetSize()`.
3. We create a function `handleAlphaChange()` to handle alpha value changes.
4. Inside the function, we create a slider (`alphaSlider`) to control the alpha value.
5. We set the slider's minimum and maximum values, initial value, and value step.
6. We position the slider at the bottom of the screen using `SetPoint()`.
7. We get the current value of the slider using `GetValue()` and set the model's alpha value using `SetAlpha()`.
8. We create a button (`visibilityButton`) to toggle the model's visibility.
9. We set the button's size, position, and text using `SetSize()`, `SetPoint()`, and `SetText()`.
10. We set the button's click event using `SetScript()` and an anonymous function.
11. Inside the click event, we check the current alpha value of the model using `GetAlpha()`.
12. If the alpha value is greater than 0, we set it to 0 (fully transparent), otherwise, we set it to 1 (fully opaque).
13. Finally, we set the initial alpha value of the model to 1 and register the `handleAlphaChange()` function to the slider's `OnValueChanged` event.

This example demonstrates how to use the `SetAlpha()` method to control the transparency of a model, and how to create interactive elements like sliders and buttons to dynamically change the alpha value based on user input.

