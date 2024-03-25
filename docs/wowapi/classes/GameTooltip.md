## AddDoubleLine

This method allows you to add a line to the game tooltip, consisting of a left-aligned and a right-aligned text, each with their individual color.

### Parameters

- **textLeft** `string` - The text that will show on the left side of the line.
- **textRight** `string` - The text that will show on the right side of the line.
- **textLeftRed** `number` (range 0 to 1) - Red color value for the left string.
- **textLeftGreen** `number` (range 0 to 1) - Green color value for the left string.
- **textLeftBlue** `number` (range 0 to 1) - Blue color value for the left string.
- **textRightRed** `number` (range 0 to 1) - Red color value for the right string.
- **textRightGreen** `number` (range 0 to 1) - Green color value for the right string.
- **textRightBlue** `number` (range 0 to 1) - Blue color value for the right string.

### Example Usage:

In this example, we're presenting an item within the game tooltip, using a green text for the item name on the left and stating its quantity with a blue text on the right. We conclude by showcasing the item's quality in a third line.

```typescript
// Let's assume gameTooltip is an instance of GameTooltip
// and items is an array of objects each containing name, quantity, and quality of items

items.forEach(item => {
    // Adding item name and quantity on the same line
    // Using green color (0,1,0) for item name and blue color (0,0,1) for item quantity
    gameTooltip.AddDoubleLine(
        item.name, `x${item.quantity}`,
        0, 1, 0, // green for item name
        0, 0, 1 // blue for quantity
    );

    // Example of adding another line for item quality
    // Let's interpret item quality: 1 as "Common", 2 as "Rare", etc. with respective colors
    const quality = item.quality;
    let qualityText = "";
    let color = [1, 1, 1]; // default white

    switch (quality) {
        case 1:
            qualityText = "Common";
            color = [0.65, 0.65, 0.65]; // gray for common
            break;
        case 2:
            qualityText = "Rare";
            color = [0, 0.44, 0.87]; // blue for rare
            break;
        // You could add more cases for other qualities
    }

    // Adding quality line without a right text
    gameTooltip.AddDoubleLine(qualityText, "", ...color, 0, 0, 0);
});

gameTooltip.Show();
```

This scripted example dynamically creates tooltip lines based on the items, showcasing wide-ranging usage possibilities such as dynamically displaying item details, qualities, or any contextual information in a visually distinguishable manner. We've utilized color coding to represent item qualities and quantities, providing an intuitive understanding at a glance.

Based on the provided structure and instructions, here's how you could document the `AddFontStrings` method for a `GameTooltip` class in Markdown, suitable for a README documentation targeted at developers working on AIO plugins similar to World of Warcraft AddOns:

---

## `AddFontStrings` Method

This method is used to dynamically expand the size of a tooltip by adding additional font strings to it. This can be particularly useful when you need to display a large amount of text or when you want to include both left-aligned and right-aligned text within the same tooltip. 

### Parameters

- **leftString**: `Unknown` - The text to be added on the left-hand side of the tooltip.
- **rightString**: `Unknown` - The text to be added on the right-hand side of the tooltip. It's positioned relative to the `leftString`, allowing for a dual-column appearance within the tooltip.

### Returns

- `Unknown` - The return type is unspecified, indicating that the focus is on the side effects (i.e., visual changes to the tooltip) rather than a value being returned.

### Example Usage

In this example, we demonstrate how to utilize the `AddFontStrings` method to display additional details about an item within a game tooltip. This example assumes you have an existing `GameTooltip` object and focuses on enhancing its display with extra information.

```typescript
// Assuming 'tooltip' is an instance of GameTooltip already configured to display basic item info
// We will now add extra details, potentially fetched from a game database or defined inline

// Define the text to add
const leftText = "Durability";
const rightText = "120/120";

// Dynamically expand the tooltip with extra info
tooltip.AddFontStrings(leftText, rightText);

// The tooltip now includes a line with "Durability" on the left and "120/120" on the right
// Additional styling or positioning might be applied elsewhere in your AddOn code
```

### Notes

- The precise data type of the parameters and return type are designated as `Unknown`. This implies that you may need to consult the API or experiment to understand the expected object or value types.
- The `AddFontStrings` method is a flexible way to augment the information displayed in tooltips. By leveraging this method, developers can create more informative and user-friendly interfaces within their AIO plugin or WoW AddOn.

---

To create a comprehensive readme documentation for the `GameTooltip.AddLine` method similar to the format provided for documenting TypeScript Class definitions, we would mimic the structure and details to ensure clarity and purpose. Here's how you could document this:

## GameTooltip.AddLine

Appends a line of text to the tooltip, optionally adjusting the text color and deciding whether the text should wrap.

### Parameters

- **text** `string` - The text string to be appended as a new line in the tooltip.
- **red** `number` (optional, range 0 to 1) - The red component of the text color. Defaults to 1 if not specified.
- **green** `number` (optional, range 0 to 1) - The green component of the text color. Defaults to 1 if not specified.
- **blue** `number` (optional, range 0 to 1) - The blue component of the text color. Defaults to 1 if not specified.
- **wrapText** `boolean` (optional) - Specifies whether the text should wrap. Defaults to `false`.

### Returns

This method does not return any value.

### Example Usage

In the example below, we demonstrate how to use the `AddLine` method to append various lines of text with different color and wrapping configurations to a game tooltip.

```typescript
// Assuming 'myTooltip' is an instantiated GameTooltip object
myTooltip.ClearLines(); // Clearing existing lines for a clean start

// Adding a simple line without specifying color or wrapping
myTooltip.AddLine("This is a simple line.");

// Adding a line with colored text (light blue)
myTooltip.AddLine("This is a colored line.", 0.5, 0.5, 1);

// Adding a wrapped line with green text
myTooltip.AddLine("This is a very long line that should wrap onto the next line for better readability.", 0, 1, 0, true);

// Displaying the tooltip at a specific location
myTooltip.SetAnchorType("ANCHOR_TOPLEFT");
myTooltip.SetPosition(200, 300); // Example coordinates
myTooltip.Show();
```

This code snippet demonstrates how to manipulate the game tooltip by adding different types of lines. `ClearLines` is called initially to ensure we start with a blank tooltip, after which several lines are added with varying properties. The final commands position and reveal the tooltip at a specified location on the screen.

### References

- GameTooltip documentation on WoW Wiki: [API GameTooltip AddLine](http://wowwiki.wikia.com/wiki/API_GameTooltip_AddLine)

Note: Ensure the readiness of the associated GameTooltip object and proper execution context (such as within an addon or a script running in the World of Warcraft client) when utilizing this method.

To create a markdown documentation for the `AddTexture` method in the `GameTooltip` class, you could follow a structured approach similar to the FontInstance documentation. Here's an example of how it would look:

---

## AddTexture

This method allows adding a texture (icon) to the beginning of the last line added by methods like `AddLine()`, `AddDoubleLine()`, etc., in a `GameTooltip` object.

### Parameters
- **texturePath**: `TexturePath` - The path to the texture file you want to add as an icon. Must be a valid texture file path relative to the World of Warcraft base directory.

### Limitations
- There's a limit of 10 textures per tooltip, as defined in `GameTooltipTemplate.xml`. Attempting to add more than 10 textures will not work, and only the first 10 will be displayed.

### Example Usage
This example shows how to create a tooltip, add some text with `AddLine()`, and then put an icon in front of the text using `AddTexture()`.

```typescript
// Suppose we have a GameTooltip object named myTooltip already initialized
// You might typically get this through a function in WoW API or create it yourself

// Add some text to the tooltip
myTooltip.AddLine("This item grants you incredible power!");

// Now add an icon to the beginning of the line just added
myTooltip.AddTexture("Interface\\Icons\\INV_Misc_Gem_Pearl_05");

// Show the tooltip
myTooltip.Show();
```

### Additional Notes
- Paths to texture files are case-sensitive and should use the correct directory separators for your operating system.
- Icons can help visually categorize or emphasize certain lines within your tooltips, making the information clearer at a glance.
- Keep the texture limit in mind when designing complex tooltips to ensure all icons are displayed as intended.

### See Also
- [`AddLine()`](http://wowwiki.wikia.com/wiki/API_GameTooltip_AddLine) for adding text lines to your tooltip.
- [`AddDoubleLine()`](http://wowwiki.wikia.com/wiki/API_GameTooltip_AddDoubleLine) for adding lines with a second column of text.
- [`Show()`](http://wowwiki.wikia.com/wiki/API_GameTooltip_Show) for making the tooltip visible after adding all elements.

For a deep dive into the WoW API and its capabilities, visiting the official World of Warcraft API documentation and community forums is highly recommended for the most current information and discussions.

Certainly! Below is an example of how to document the `AppendText` method of the `GameTooltip` class for markdown documentation, similar to the previous examples of documenting TypeScript Class definitions for AIO plugins or World of Warcraft AddOns.

---

## GameTooltip

The `GameTooltip` class provides functionalities to manipulate the game's tooltip. Tooltips are small boxes containing additional information about the items, spells, or objects in the game when you hover over them.

### AppendText

Appends text to the end of the first line of the tooltip.

#### Parameters

- **text**: `string` - The text to be added to the tooltip.

#### Returns

- **void**: No return value.

#### Example Usage

The following example demonstrates how to add additional text to an existing game tooltip. This can be useful for providing extra information such as stats, descriptions, or warnings about an item or spell.

```typescript
// Assume 'myGameTooltip' is an instance of GameTooltip already initialized and visible.
let extraInfo = "Bind on Pickup";

// Append extra information to the first line of the tooltip.
myGameTooltip.AppendText(extraInfo);

// Now, when the tooltip is displayed, it will include "Bind on Pickup" at
// the end of its first line, providing players with critical information at a glance.
```

This method is especially useful when you need to dynamically add information to tooltips based on the context, such as when items have unique qualities, effects, or conditions that aren't standard or when additional instructions are necessary for specific scenarios.

---

This format aims to cover method descriptions, parameters with types and descriptions, return values, and provide a practical, easy-to-understand example that illustrates the use of the method. The style and structure of this documentation are consistent with how you would document a TypeScript class for AIO plugins or add-ons like those used in World of Warcraft, focusing on clarity, detail, and practical application.

Here's how you would document the `ClearLines` method of the `GameTooltip` class, following the given examples for method documentation and adapting them to Markdown format. This considers the formatting used previously and adapts it for the `ClearLines` method specifically, including an example usage:

```markdown
# GameTooltip: ClearLines

Clears all lines of text from the GameTooltip, including both the left and right text lines. This method is useful for resetting the tooltip's state before populating it with new lines of text.

## Method Signature
`ClearLines(): void`

## Parameters
None

## Returns
None

## Example Usage
When interacting with a game object or item, you may want to display a tooltip with custom information. Before setting this information, it's important to clear any previous content to ensure outdated text doesn't remain. Here's how you can clear the GameTooltip and then set new text.

Assuming `itemTooltip` is an instance of `GameTooltip`:

```typescript
// Assuming this function is called when a player interacts with a specific item
function updateItemTooltip(itemTooltip: GameTooltip, itemName: string, itemDescription: string) {
  // First, clear all previous lines in the tooltip
  itemTooltip.ClearLines();

  // Now, you can add the item's name and description as new lines
  itemTooltip.AddLine(itemName, 1.0, 1.0, 1.0);
  itemTooltip.AddLine(itemDescription, 0.5, 0.5, 0.5);

  // Assuming there's a mechanism to display the tooltip, e.g. `itemTooltip.Show()`
}
```
This example demonstrates clearing the tooltip before populating it with new information, ensuring the displayed text is current and relevant to the item in question.
```

In the example above, methods like `AddLine` and hypothetical display mechanisms like `Show` are not detailed, as the focus is on `ClearLines`. This should fit within a larger documentation effort that explains all aspects of working with `GameTooltip` instances within the context of your addon development.

## GameTooltip Class

The `GameTooltip` class is a part of the World of Warcraft API environment, handling the display and behavior of tooltips in the game. These tooltips provide contextual information for objects, NPCs, items, and more within World of Warcraft's UI.

One of the capabilities of the `GameTooltip` class is to control the visibility of tooltips, including fading them out smoothly. Below is the documentation for the `FadeOut` method of the `GameTooltip` class.

### Method: `FadeOut`

The `FadeOut` method initiates the process of fading out the GameTooltip over the next few seconds. This method can be used to gradually hide the tooltip instead of instantly dismissing it, improving the user interface experience by providing a smoother visual transition.

#### Signature
```typescript
FadeOut(): void;
```

#### Parameters
None.

#### Returns
This method does not return any value.

#### Example Usage

```typescript
// Assuming `GameTooltip` has been properly initialized and is currently visible

// Example of using FadeOut to smoothly hide the GameTooltip
GameTooltip.FadeOut();

// This will begin the fading process, making the GameTooltip less opaque over time until it completely disappears.
```

#### Additional Notes

- Use the `FadeOut` method when you want to provide a smoother visual transition as the tooltip disappears.
- The `GameTooltip` must be visible for the `FadeOut` method to have any visible effect.
- The time it takes for the `GameTooltip` to fully fade out is managed by the game's UI system and cannot be adjusted through this method call.

#### See Also

- [GameTooltip:Show()](http://wowpedia.fandom.com/wiki/API_GameTooltip_Show) - Method to make the GameTooltip visible.
- [GameTooltip:SetOwner()](http://wowpedia.fandom.com/wiki/API_GameTooltip_SetOwner) - Method to set the frame that the tooltip is attached to.

This method documentation is designed to provide all the necessary information for developers looking to work with the `GameTooltip` class in developing AddOns for World of Warcraft, ensuring a consistent and helpful reference format.

Given the structure and examples provided, here is a markdown documentation for the `GetAnchorType` method within the `GameTooltip` class as requested:

---

## GetAnchorType

This method retrieves the current anchoring type of the `GameTooltip`. Anchoring type determines how the tooltip is positioned relative to its parent frame or specified anchor point.

### Returns

- **Point** `enum` - The anchoring type, expressed as one of the predefined point enumerations. Possible values include:
  - `TOPLEFT`
  - `TOPRIGHT`
  - `BOTTOMLEFT`
  - `BOTTOMRIGHT`
  - `CENTER`
  - `LEFT`
  - `RIGHT`
  - `TOP`
  - `BOTTOM`

### Example Usage:

This example demonstrates how to retrieve the current anchoring type of a `GameTooltip` instance and then print this information. This could be useful for debugging purposes or to dynamically adjust UI elements based on tooltip positioning.

```typescript
// Assuming 'myTooltip' is an instance of GameTooltip 
// and has been properly initialized elsewhere in your code.
const anchoringType = myTooltip.GetAnchorType();

console.log(`Current anchoring type: ${anchoringType}`);

// Output might be: "Current anchoring type: BOTTOMRIGHT"
// This indicates that the tooltip is anchored at the bottom-right position relative to its parent frame or specified anchor point.
```

### Additional Notes:

- The anchoring type is crucial for positioning tooltips correctly, especially in custom UIs where elements may move or hide based on user interaction.
- Understanding how anchoring works in the World of Warcraft UI system can greatly enhance the dynamic and adaptive capabilities of your addons or AIO plugins.
- The values returned are part of the `Point` enumeration, which is standard within the WoW API and consistent across various UI elements that support anchoring.

---

The provided documentation format concisely covers the method's purpose, its return values, and presents a practical example. This approach ensures both clarity and utility for developers working on AIO plugins similar to World of Warcraft AddOns.

To document the `GameTooltip.GetItem` method in a consistent markdown format suitable for API documentation or README documentation for AIO plugins similar to World of Warcraft AddOns, you may follow the structure demonstrated below:

# GameTooltip.GetItem

Retrieves the name and the link of the item currently being displayed by a `GameTooltip` object.

## Returns

**itemName**: `string` - The plain text name of the item (e.g., "Broken Fang").

**itemLink**: `ItemLink` - The formatted link of the item, which can be used to display the item link in chat frames, tooltips, etc. (e.g., "|cff9d9d9d|Hitem:7073:0:0:0:0:0:0:0|h[Broken Fang]|h|r").

## Example Usage

This example demonstrates how to use the `GetItem` method to fetch the name and link of the item displayed on a game tooltip and print it to the default chat frame.

```typescript
// Create a dummy GameTooltip instance (in practice, this should be a real GameTooltip object reference)
let gameTooltip = new GameTooltip();

// Simulate attaching an item to the GameTooltip for demonstration purposes
// In actual scenarios, the GameTooltip would be showing an item from the game UI
gameTooltip.SetItemByID(7073); // Assume SetItemByID is a method that lets you simulate setting an item by ID

// Use the GetItem method to retrieve the item's name and link
const [itemName, itemLink] = gameTooltip.GetItem();

// Print the item's name and link to the default chat frame
console.log(`Item Name: ${itemName}, Item Link: ${itemLink}`);

// Example Output: 
// Item Name: Broken Fang, Item Link: |cff9d9d9d|Hitem:7073:0:0:0:0:0:0:0|h[Broken Fang]|h|r
```

## Additional Notes

- The `GetItem` method is particularly useful for addons that need to provide detailed information about items displayed in tooltips, such as auction house helpers, inventory management addons, or tooltip enhancers.
- The `ItemLink` returned can be used anywhere in the WoW UI that accepts item links, allowing for easy sharing and reference of items.

## See Also

- [API GameTooltip SetItemByID](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetItemByID) - A method for demonstrating or simulating the setting of an item on a `GameTooltip` in example usage, if such method existed.
- [World of Warcraft API](https://wowpedia.fandom.com/wiki/World_of_Warcraft_API) - For further reference on other available APIs.

By adapting the structure of the provided `FontInstance` documentation, the formatting for the `GameTooltip.GetItem` method follows a concise, informative pattern. This example demonstrates integrating a description, return values, example usage, and additional notes or relevant links to other resources or related API methods.

Certainly! Following the format provided, here's how the documentation for the `GameTooltip` class method `GetMinimumWidth` can be presented:

---

## GetMinimumWidth
Retrieves the minimum width setting of the game tooltip object. The exact use and implications of this method in the context of the UI are not documented, leading to its classification as *unknown*. Understanding of its precise functionality may require direct experimentation or further research within the community.

### Parameters
None

### Returns
**Unknown** - Due to the lack of detailed Blizzard documentation and community consensus, the type and significance of the return value remain unspecified. It is recommended for developers to consider practical tests to decipher its utility.

### Example Usage:
Given the ambiguity surrounding this method, the example below is speculative. It assumes a scenario where a developer might want to log the minimum width of a `GameTooltip` object for debugging or UI design purposes.

```typescript
declare const GameTooltip: any;  // Assume GameTooltip is properly declared elsewhere

const tooltip = new GameTooltip();

// Attempt to retrieve and log the minimum width of the GameTooltip.
// Due to insufficient documentation, the result and its interpretation are uncertain.
const minWidth = tooltip.GetMinimumWidth();
console.log(`The minimum width of the GameTooltip is: ${minWidth}`);

// Based on experimentation, developers may adjust their usage or further investigate the method's impact.
```

Due to the incomplete understanding of this method's functionality, developers are advised to proceed with caution. Interpretations of the return value may vary, and reliance on this method for critical features should be thoroughly validated.

- **Caution:** It's important to note that this documentation entry is built upon an assumption of the method's behavior. Actual behavior may differ, and developers should validate the method's functionality through testing in their specific environment.

---

The format used above aims to reflect the structure provided in the original examples, with adjustments made to accommodate the uncertainties surrounding the `GetMinimumWidth` method. This template can be adapted for documenting other methods within the game's API, especially those with limited or unclear documentation.

# GetSpell

Returns the name and link of the spell currently displayed on a `GameTooltip` object. This method allows for extracting valuable information about spells directly from tooltips, which is especially useful in UI modifications where spell details need to be fetched dynamically.

## Parameters
None.

## Returns
* **spellName** string - The plain text name of the spell (e.g., "Explosive Shot").
* **spellId** number - The integer ID of the spell (e.g., 60053).

## Example Usage

This example demonstrates how to get the spell name and ID from a tooltip that appears when hovering over a spell button. This could be particularly useful for addons that need to display additional information or perform actions based on the spell displayed in the tooltip.

```typescript
// Assuming `mySpellButton` is a UI element that shows a tooltip for a spell when hovered over.
mySpellButton.SetScript("OnEnter", () => {
  // Get the current tooltip's spell name and ID.
  const [spellName, spellId] = GameTooltip.GetSpell();

  // You can now use `spellName` and `spellId` to perform further actions.
  // For example, logging the spell details to the console.
  console.log(`Hovered Spell: ${spellName} (ID: ${spellId})`);

  // Or use the spellId to fetch more information from a database or API
  fetchSpellDetails(spellId).then(details => {
    // Perform actions with the fetched spell details.
    console.log(details);
  });
});

function fetchSpellDetails(spellId: number) {
  // This function simulates fetching additional details for a spell from a database or an external API.
  // In a real scenario, this would likely involve asynchronous operations like fetch or XMLHttpRequest.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({name: "Explosive Shot", damage: "200-400", cooldown: "10s"});
    }, 1000);
  });
}
```

In this example, when the user hovers over a spell button (`mySpellButton`), the `OnEnter` script triggers, fetching the spell name and ID from the `GameTooltip`. These details are then logged to the console, and an asynchronous operation is simulated to fetch more detailed information about the spell, such as its damage range and cooldown. This showcases a practical use case within a WoW addon, leveraging the `GetSpell()` method of the `GameTooltip` class to enhance the player's UI with dynamic spell data.

Here's a detailed markdown documentation for the `GetOwner` method of the `GameTooltip` class, following the established format and incorporating aspects of mod-eluna and azerothcore references where applicable:

---

## GetOwner
This method retrieves the owner frame and the anchor point of the game tooltip. The owner frame is the UI frame to which the tooltip is attached, and the anchor specifies the position relative to the owner frame where the tooltip is displayed.

### Parameters
None

### Returns
- **UIObject**: The UI frame that owns the game tooltip.
- **Point**: The anchor point on the owner frame where the tooltip is displayed. The `Point` type is derived from the World of Warcraft API and represents a specific point in the UI's layout, such as "TOPLEFT", "TOPRIGHT", "BOTTOMLEFT", "BOTTOMRIGHT", etc. 

### Example Usage
The following example demonstrates how to use the `GetOwner` method to retrieve and manipulate the owner of a game tooltip. It's often used in addons to dynamically adjust tooltips based on the context or to implement custom tooltip behaviors.

```typescript
// Assuming `GameTooltip` has been properly initialized and displayed

// Retrieve the owner and anchor point of the tooltip
const [owner, anchor] = GameTooltip.GetOwner();

// Example: Check if the tooltip's owner is a specific frame
if (owner === mySpecificFrame) {
  console.log("The tooltip is attached to mySpecificFrame.");
}

// Example: Adjust tooltip position based on the anchor
switch (anchor) {
  case "TOPLEFT":
    console.log("Tooltip is anchored to the top left of its owner.");
    // Perform additional logic here, like moving the tooltip or adjusting its content
    break;
  case "TOPRIGHT":
    console.log("Tooltip is anchored to the top right.");
    // Additional logic
    break;
  // Add cases for other anchor points as needed
}

```

### Notes
- This method provides essential functionality for addons that need detailed control over tooltip positioning and behavior.
- When working with tooltips, remember that their content and visibility should be managed carefully to ensure a positive user experience.
- The actual behavior and availability of this method might vary slightly depending on the specifics of the addon environment or the version of the game client.

By leveraging the `GetOwner` method, addon developers can create more dynamic and context-aware tooltip experiences in their World of Warcraft addons.

---

# GameTooltip

The `GameTooltip` class is part of the UI framework that allows manipulation of the game's tooltip system. These tooltips can display a variety of informational texts and data points depending on what they are hovering over or are programmed to show.

## GetUnit

This method retrieves the name and ID of the unit associated with the current instance of the `GameTooltip`.

### Returns

- **unitName**: `string` - The name of the unit.
- **unitId**: `UnitId` - A unique identifier for the unit, typically a number or string that uniquely represents the unit within the game's ecosystem.

### Example Usage

```typescript
// Assuming `myTooltip` is an instance of `GameTooltip`
const [unitName, unitId] = myTooltip.GetUnit();

console.log(`Unit Name: ${unitName}`);
console.log(`Unit ID: ${unitId}`);

// Example output:
// Unit Name: Thral
// Unit ID: 100234
```

This method is particularly useful for addons that need to extract detailed information about the unit currently under the cursor or associated with a UI element that can display a tooltip. By using `GetUnit`, the addon can adapt its functionality based on the unit, such as displaying additional stats, offering contextual actions, or integrating with other data sources to enhance the game experience.

To document a method from the `GameTooltip` class in the style of the given examples, and taking into account the context of an AIO plugin similar to a World of Warcraft AddOn, the following markdown documentation could be prepared:

---

## GetName

This method returns the name of the GameTooltip frame instance.

### Parameters

None.

### Returns

**name** string - The unique name of the GameTooltip frame.

### Example Usage

This example demonstrates how to obtain the name of the GameTooltip instance and then use it for logging or conditional checks.

```typescript
// Assuming `gameTooltip` is an instance of GameTooltip
const tooltipName = gameTooltip.GetName();

// Log the name of the game tooltip
console.log("The name of the GameTooltip instance is: ", tooltipName);

// Example conditional check
if (tooltipName === "ExpectedTooltipName") {
    console.log("This is the tooltip we were looking for!");
} else {
    console.log("This is not the tooltip we were looking for.");
}
```

This method can be particularly useful for debugging purposes or when there's a need to differentiate between multiple tooltip instances dynamically at runtime. You could also use the tooltip name in conditional logic to apply specific actions or modifications to certain tooltips, enhancing your plugin's functionality and interactivity.

Sure, let's create a markdown documentation snippet for the `GetID` method of the `GameTooltip` class, following the formatting and detailing style provided earlier. 

```markdown
# GameTooltip.GetID
This method returns the ID of the GameTooltip. The ID could be used for uniquely identifying tooltips especially when dealing with multiple tooltips simultaneously.

## Parameters
None

## Returns
- **ID** number - The ID of the GameTooltip.

### Example Usage
Let's assume you are working with multiple tooltips and you need to distinguish between them based on their IDs. You might use the `GetID` method like so:

```typescript
// Assuming 'GameTooltip' is an instance of a GameTooltip that's already been initialized and displayed
const tooltipID = GameTooltip.GetID();
console.log(`The ID of the GameTooltip is: ${tooltipID}`);

// Output might be "The ID of the GameTooltip is: 1", depending on how many toolips have been initialized before this one.
```

This helps in identifying tooltips, especially in complex UIs where multiple tooltips might be displayed for different UI elements. Understanding which tooltip is currently active or needs to be modified becomes straightforward with the use of unique IDs.
```

This markdown documentation snippet for the `GameTooltip.GetID()` function gives an overview, details on parameters (in this case, none), what the function returns, and an example usage to illustrate how it might be used in a real-world scenario. This follows the structured approach seen in the TypeScript class to readme documentation translation example you provided, focusing on clear, concise information delivery that's immediately useful to a developer integrating this method into their project.

Creating a markdown documentation based on the provided specifications and focusing on the provided `GameTooltip` class with the `Hide` method. The documentation will aim for clarity, providing both a detailed description and a practical example of usage.

---

# GameTooltip Methods

## Hide

Hides the tooltip frame, making it invisible on the UI. This can be useful for clearing up the UI when information is no longer necessary to display to the player. The `Hide` method does not require any parameters.

### Parameters

None

### Returns

Void. No value is returned.

### Example Usage

In the following example, we will be creating a basic interaction within a World of Warcraft AddOn, using the `GameTooltip` functionality to provide information about an item when hovered over, but ensuring the tooltip is hidden as soon as the mouse leaves the item's frame.

```typescript
// Define a frame for an in-game item
const itemFrame = CreateFrame("Button", "MyUniqueItemFrame", UIParent, "GameTooltipTemplate");
itemFrame.SetAllPoints();
itemFrame.SetScript("OnEnter", function() {
  // Assuming 'GameTooltip' is a global object
  GameTooltip.SetOwner(this, "ANCHOR_CURSOR");
  GameTooltip.SetHyperlink("item:6948"); // An example item: Hearthstone
  GameTooltip.Show();
});

itemFrame.SetScript("OnLeave", function() {
  GameTooltip.Hide();
});
```

This example showcases creating a simple UI element that interacts with the `GameTooltip` API. Upon hovering over the item frame, the tooltip appears, anchored to the cursor, displaying information about the Hearthstone item. Once the cursor moves away from the item frame, the `Hide` method is called to remove the tooltip from the view, maintaining a clean and clutter-free UI.

### Notes

- It's important to manage the visibility of tooltips properly, ensuring they only appear when relevant and do not obstruct the user interface.
- The `SetOwner` method of `GameTooltip` is used prior to showing the tooltip, defining where and how the tooltip appears relative to the UI element it describes.

---

Creating a Markdown Documentation for the `IsUnit` Method in `GameTooltip` Class

# GameTooltip Documentation

The `GameTooltip` class provides functionalities to work with in-game tooltips in AIO plugins, similar to modifications made for World of Warcraft. It includes methods to interact and manipulate these tooltips, providing dynamic feedback and information to the player.

## IsUnit

This method checks if the provided unit identifier corresponds to the unit represented by the tooltip.

### Parameters

- **unit** (`UnitId`): The unique identifier for the unit you wish to check against the tooltip. The `UnitId` can be a variety of formats, commonly including player-controlled characters, NPCs, or any entity that can be interacted with in the game world.

### Returns

- **boolean**: `true` if the unit represented by the tooltip matches the provided unit identifier, `false` otherwise.

### Usage Example

The following example demonstrates how to use the `IsUnit` method within a context where a `GameTooltip` instance is interacted with. This scenario might occur within a larger function or event listener where tooltips are relevant.

```typescript
// Assuming `GameTooltip` has been properly instantiated or referenced.
// `myTooltip` is our reference to a GameTooltip instance.
// `unitId` is a variable that holds the UnitId of interest.

// Check if the unit represented by the tooltip matches 'unitId'
const isMatchingUnit = myTooltip.IsUnit(unitId);

if (isMatchingUnit) {
  console.log("The tooltip is indeed for the unit:", unitId);
} else {
  console.log("The tooltip does not correspond to the unit:", unitId);
}
```

This example provides a simple way of verifying whether the unit that the game's tooltip is currently referencing matches a specific `UnitId` that the developer is interested in. This could be particularly useful for addons or plugins that need to provide contextual information or actions based on the unit the player is interacting with via the tooltip.

## Implementation Tips

- Ensure that `UnitId` is correctly obtained from the game API or predefined correctly within your plugin, considering various possible formats (player, NPC, object, etc.).
- The method `IsUnit` can be pivotal in creating dynamic and interactive tooltips that respond to the game environment, making your plugin or addon more immersive and informative.
- Consider combining this method with other `GameTooltip` methods to enhance the functionality of your tooltips further, providing a rich user experience.

To document the `GameTooltip` class and its `NumLines` method in a similar fashion to your provided examples, here is how you might structure the documentation in Markdown format:

---

# `GameTooltip`

The `GameTooltip` class is used to manage tooltip objects within World of Warcraft's User Interface. Tooltips are small, informational windows that appear when you hover over UI elements or in-game items, NPCs, and other entities. They provide contextual information, such as descriptions, stats, and other relevant details.

## Methods

### `NumLines`

Returns the number of text lines that comprise the current tooltip object. This method is useful for dynamically adjusting UI elements based on the size of the tooltip content.

#### Parameters

None

#### Returns

- **number** - The total number of lines in the tooltip.

#### Example Usage:

The following example demonstrates how to use the `NumLines` method to retrieve the number of lines in a game tooltip and then perform some action based on that number. In this case, we're simply outputting the value to a hypothetical console or chat window.

```typescript
// Create a new GameTooltip object. 
// Note: In actual usage, GameTooltip objects are often provided by the WoW UI and this is just for illustrative purposes.
const myTooltip = new GameTooltip();

// Assume the tooltip has been populated elsewhere in your code.
// myTooltip : [...]

// Use the NumLines method to get the number of lines in the tooltip.
const linesCount = myTooltip.NumLines();

// Output the number of lines to the console/chat.
console.log(`The tooltip has ${linesCount} lines.`);
```

In this example, `myTooltip` represents a `GameTooltip` instance that has been previously populated with content. Using `NumLines`, we retrieve the total count of text lines present in the tooltip and then output this count. The `console.log` function is used here as a placeholder for any World of Warcraft addon-specific methods of displaying or logging information.

---
  
This documentation template follows the structure and formatting of your provided examples, using descriptive headings, clearly defined sections for parameters and return values, and an illustrative example to help understand the use of the `NumLines` method.

# GameTooltip.SetAction

This method displays the tooltip associated with a specified action button. Tooltips provide brief information about the function or effect of an action button in the user interface.

## Parameters
- **slot** `ActionBarSlotId` - The ID of the action button for which the tooltip is to be shown.

## Usage

The `GameTooltip.SetAction` method is particularly useful for addon developers needing to dynamically display tooltips based on user interactions or specific game states. Here's a detailed example demonstrating its use within an addon context:

```typescript
// Assuming 'GameTooltip' is properly initialized or referenced within the addon's scope

/**
 * ShowTooltipForSlot - Displays the game tooltip for a specific action bar slot.
 * @param slotId - The numerical ID of the action bar slot.
 * Note: Action bar slots are typically numbered left-to-right, top-to-bottom.
 */
function ShowTooltipForSlot(slotId: ActionBarSlotId): void {
  // Positioning the tooltip; for example, at the cursor's current location.
  // This is a common approach, but the positioning can be adjusted as needed.
  GameTooltip_SetDefaultAnchor(GameTooltip, UIParent);
  GameTooltip.SetAction(slotId);
  
  // Making the tooltip visible after setting its contents.
  GameTooltip:Show();
}

/**
 * An example use case where we want to display a tooltip for the first action slot
 * when a specific event occurs, e.g., a keybind press or a custom UI button click.
 */
ShowTooltipForSlot(1);

/**
 * It's important to ensure that the slot ID passed to ShowTooltipForSlot is valid 
 * and corresponds to an action button that has an associated action. 
 * The ID range and availability might vary based on the player's current UI setup 
 * and any modifications or action bar addons they have installed. 
 */
```
This example demonstrates a function called `ShowTooltipForSlot`, which takes an action bar slot ID as its parameter and utilizes the `GameTooltip.SetAction` method to show the tooltip for the specified action. The tooltip is anchored to the default position (which is often at the cursor's location but could be adjusted as needs dictate) and then made visible.

### Considerations

- Ensure the `slotId` passed to the method corresponds to a valid action button with an action assigned to avoid displaying an empty or irrelevant tooltip.
- The positioning of `GameTooltip` can be customized based on addon requirements or user preferences. The example uses a common approach of anchoring the tooltip to the default anchor, which is typically the cursor location.
- Tooltip visibility and content are managed by the game's UI system; thus, the correct initialization and usage of `GameTooltip` and related methods are crucial for the intended display of information.

### See Also
- [GameTooltip_SetDefaultAnchor](http://wowpedia.fandom.com/wiki/API_GameTooltip_SetDefaultAnchor) for information on setting the default anchor point of tooltips.
- [UIParent](http://wowpedia.fandom.com/wiki/UIParent) for understanding the general parent frame used in UI layout and anchoring.

Certainly! Following the structure provided in your examples, here's how documentation for the `SetAuctionCompareItem` method of the `GameTooltip` class could be written in markdown format for an AIO plugin similar to World of Warcraft AddOns. 

---

```typescript
declare class GameTooltip {
  /**
   * Attaches an Auction Item for comparison purposes in a tooltip.
   *
   * @param type The type of auction item, distinguishing between different auction sections (e.g., "list", "bid").
   * @param index The index of the item in the auction list to attach to the tooltip for comparison.
   * @param offset An optional parameter that specifies an offset in the list, modifying the item's index effectively.
   */
  SetAuctionCompareItem(type: AUCTION_TYPE, index: number, offset?: number): void;
}
```

## SetAuctionCompareItem

This method is used to attach an auction item to a `GameTooltip` instance, enabling item comparison within the tooltip. It's especially useful for auction-related AddOns to provide a better user experience by allowing users to compare items directly from the auction interface.

### Parameters
- **type** `AUCTION_TYPE` - The category or type of auction item. This parameter is used to specify the auction list from which to reference the item.
- **index** `number` - The index of the item within the specified auction list. This is the primary means of identifying which item to attach to the tooltip.
- **offset** `number` *optional* - An optional parameter that provides an additional positional adjustment to the index. This can be used to account for pagination or other UI elements that might affect item indexing.

### Behavior
This method does not return any value but modifies the `GameTooltip` instance it is called upon by adding an auction item for comparison. This makes examining item details and differences more convenient for users navigating through auction listings.

### Example Usage:
```typescript
// Assuming 'myGameTooltip' is an instance of GameTooltip and initialized properly
const AUCTION_TYPE_LIST = 'list'; // Hypothetical constant, replace with actual game constant
let itemIndex = 5; // Example item index
let pageIndexOffset = 0; // No offset in this example

// Attach an auction item to the tooltip for comparison
myGameTooltip.SetAuctionCompareItem(AUCTION_TYPE_LIST, itemIndex, pageIndexOffset);

// Show the tooltip with the item comparison
myGameTooltip.Show();
```
This example demonstrates how to use the `SetAuctionCompareItem` method to add an item from an auction list to a game tooltip for comparison. It's important to replace the `AUCTION_TYPE_LIST` with the actual constant defined by the game or AddOn API, and adjust `itemIndex` and `pageIndexOffset` based on the context in which the method is used.

---
This markdown documentation format provides a clear and consistent way to present method functionality, parameters, usage behavior, and examples, making it easier for developers to implement and utilize within their AIO plugins or AddOns.

Creating markdown documentation for method definitions within classes or interfaces for plugin development, similar to AIO plugins or WoW AddOns, is crucial for enabling developers to understand and use the API efficiently. Below is a structured template for documenting a `GameTooltip` class method, specifically `SetBackpackToken`, using the provided example format and adapting it to our scenario.

---

# GameTooltip
The `GameTooltip` class is used to manipulate and interact with the in-game tooltip UI components. Through this class, developers can customize tooltips, add specific data tokens, and manage tooltip behavior dynamically in response to game events or states.

## SetBackpackToken

This method controls the display of specific tokenized data in the backpack's tooltip. Tokens could represent currencies, resources, or other trackable game entities that need to be dynamically displayed in tooltips associated with the backpack UI component.

### Parameters 
- **id** (`Unknown`): This parameter represents the identifier for the specific token data to display in the backpack tooltip. The exact nature of this identifier depends on the implementation and the type of data being tokenized.

### Returns
- **Unknown**: The return value is currently not specified and depends on the implementation specifics. It might be utilized for error handling, confirming the successful addition of the token, or could be left unused.

### Example Usage:

The following example demonstrates how to use the `SetBackpackToken` method within a hypothetical scenario where you need to display a custom currency token within the backpack tooltip.

```typescript
declare const gameTooltip: GameTooltip; // Assume gameTooltip is an instantiated object of GameTooltip

// Example token ID for demonstration purposes
const customCurrencyTokenId: Unknown = "currency_123";

// Setting a custom currency token to be displayed in the backpack tooltip
gameTooltip.SetBackpackToken(customCurrencyTokenId);

// Further actions or logic can be implemented as needed
```

### Notes:
- The specifics of the `id` parameter and the return type are intentionally kept abstract (`Unknown`) due to the wide range of potential implementations. Developers should provide concrete types based on the actual data structure being utilized for tokens.
- It is important to verify the compatibility of the token data with the tooltip system to ensure seamless integration and avoid runtime exceptions or display issues.

---

This template enhances documentation readability, enabling developers to easily integrate and leverage the `SetBackpackToken` method within their custom mods or plugins. The inclusion of an example usage, along with a brief description of parameters and returns, ensures that even developers new to the system can understand and apply the method effectively in their projects.

Below is a markdown documentation that elaborates on the `GameTooltip.SetBagItem` method based on the provided template and details:

# GameTooltip.SetBagItem

This method is utilized to populate the `GameTooltip` with textual details regarding a specified item located within a player's bag. Additionally, it returns information on whether the item is undergoing a cooldown period and the associated repair cost—if applicable.

## Parameters
- **bag**: `WoWAPI.CONTAINER_ID` - The unique identifier of the bag.
- **slot**: `number` - The specific slot within the bag where the item is placed.

## Returns
- **hasCooldown**: `boolean` - Indicates whether the item is currently on cooldown.
- **repairCost**: `number` - Represents the cost required to repair the item. This value may be 0 or possibly `nil` if the item doesn't support repair functionality.

## Example Usage

Here's how the `SetBagItem` method can be tactically utilized within an add-on:

```typescript
declare let GameTooltip: GameTooltip; // Assuming GameTooltip is already defined elsewhere

// Function to display tooltip and additional information for an item in the player's bag
function displayItemTooltip(bagID: WoWAPI.CONTAINER_ID, slotID: number): void {
  // Setting up the tooltip for a specific bag slot
  const [hasCooldown, repairCost] = GameTooltip.SetBagItem(bagID, slotID);

  // Dynamically updating the tooltip based on the item's state
  let additionalInfo = "";

  if (hasCooldown) {
    additionalInfo += "This item is on cooldown. ";
  }

  if (repairCost > 0) {
    additionalInfo += `Repair Cost: ${repairCost} coins.`;
  } else if (repairCost === 0) {
    additionalInfo += "This item does not require repairs.";
  } else {
    additionalInfo += "Repair information is not available.";
  }

  // Show the tooltip with any additional information
  if (additionalInfo) {
    GameTooltip.AddLine(additionalInfo);
    GameTooltip.Show();
  }
}

// Example usage of the function for an item in bag slot 1 of the first bag
displayItemTooltip(0, 1);
```

This example demonstrates the integration of `GameTooltip.SetBagItem` within a function designed to enrich the item tooltips displayed to the user. It automatically appends information about cooldown status and repair costs, serving to enhance the interactive experience within the game's UI.

Converting documentation for the `GameTooltip` class method `SetBuybackItem` into a comprehensive markdown format, taking into account the standards set by the previous examples:

---

### SetBuybackItem

This method sets the tooltip to display the information of the item that can be bought back from a vendor. The exact details of what is displayed and the structure of the information are not publicly documented, hence considered unknown at this point.

#### Parameters
None

#### Returns
**Unknown**: The method's return values and types are not documented, reflecting the current understanding of the `SetBuybackItem` method's functionality.

#### Example Usage:

Using the `SetBuybackItem` method requires you to have an item that has been sold to a vendor and can be bought back. This is a hypothetical use case since specific details about the method's effects are unknown.

```typescript
declare const GameTooltip: GameTooltip;

// Assuming an item has been sold to a vendor, and we want to show its buyback information on a tooltip
GameTooltip.SetBuybackItem();
GameTooltip.Show();
```

In this mock example:
- We declare a GameTooltip instance (in a real-world scenario, the GameTooltip instance would be properly instantiated based on the game's API).
- We invoke `SetBuybackItem()` without parameters, implying it would internally fetch the latest or relevant item sold to the vendor for buyback.
- Finally, we call `GameTooltip.Show()` to display the tooltip, which now presumably contains the set buyback item's details.

#### Notes
- The functionality and outcomes of using `SetBuybackItem()` are speculative and based on the pattern observed in similar methods within game UI programming, particularly in the context of World of Warcraft addons.
- Due to the lack of comprehensive documentation, developers are encouraged to experiment with this method to discover its exact behavior and potential use cases.

---

This markdown documentation provides an overview, detailed parameter and return type descriptions (as much as known), example usage, and additional notes for clarification. The aim is to assist other developers in understanding and utilizing the `SetBuybackItem` method as part of their plugin or addon development, despite the gaps in official documentation.

Given the structure and the example provided for documenting TypeScript class definitions, here’s how you could document the `GameTooltip.SetCurrencyToken` method in markdown for readme documentation, keeping in mind the format used for AIO plugins similar to World of Warcraft AddOns:

```markdown
# GameTooltip Class

The `GameTooltip` class manages tooltips within the game, providing methods to set and customize their appearance and information based on different in-game elements like items, spells, or currencies.

## SetCurrencyToken

Sets the tooltip for the specified currency token. This method prepares the `GameTooltip` object to show detailed information about a currency, such as gold, silver, or any other form of in-game currency tracked by the player.

### Parameters

- **tokenId** `(number)`: The ID of the currency token to display the tooltip for.

### Returns

- **void**

### Usage Example

To display the tooltip for a specific currency token, you first need to identify the token ID you want to display the tooltip for. Once identified, you can use the `SetCurrencyToken` method to set up the tooltip.

```typescript
// Assuming you have a GameTooltip instance created and a valid tokenId
const gameTooltip = new GameTooltip();
const tokenId = 1; // The ID for the currency you want to show, e.g., gold

// Set the tooltip for the specified currency token
gameTooltip.SetCurrencyToken(tokenId);

// Now, the GameTooltip is ready and set up to display information about the currency
// You can now display the tooltip in the game UI as needed
```

This will configure the `GameTooltip` instance to show information about the specified currency token. It’s especially useful for addons dealing with currencies and needing to provide detailed information about them through tooltips.

### See Also

- [GameTooltip API Documentation](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetCurrencyToken)

This reference links you to the WoW API documentation where you can find more details about the `GameTooltip.SetCurrencyToken` method and other related tooltip functionalities.

---
```

This readme documentation outlines the usage of the `SetCurrencyToken` method within the `GameTooltip` class, providing a clear description, parameters, return value, an example usage, and a reference link for further reading.

## SetFrameStack
Displays the frame stack of the mouse cursor's current position on the GameTooltip. This method is usually not utilized in regular addons but is primarily part of Blizzard's Debug Tools, which mimic functionality found in various development tools to aid in UI development and debugging.

### Parameters
- **showHidden** (optional) boolean - If set to true, the tooltip will also include frames that are currently not visible.

### See Also
More information can be found on the official WoW API documentation: [GameTooltip_SetFrameStack](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetFrameStack).

### Example Usage:
This example demonstrates how to use `SetFrameStack` in an addon to display the frame stack for debugging purposes. This could be tied to a button or a specific event for quick access during development.

```typescript
// Assume `myTooltip` is an already created GameTooltip object in your addon
const myTooltip: GameTooltip = new GameTooltip();

// Function to toggle the debug frame stack view
function toggleFrameStackDebug(showHidden?: boolean): void {
  // Position the tooltip near the mouse cursor or at a specific on-screen position
  myTooltip.SetOwner(UIParent, "ANCHOR_CURSOR");

  // Optionally include hidden frames in the stack display based on the 'showHidden' parameter
  myTooltip.SetFrameStack(showHidden);

  // Show the tooltip with the frame stack
  myTooltip.Show();
}

// Example usage: Display the frame stack including hidden frames
toggleFrameStackDebug(true);

// Example usage: Display only visible frames in the stack
toggleFrameStackDebug();
```

This snippet showcases how to activate the frame stack display on your GameTooltip object. You can use this functionality to debug frame hierarchies and understand how frames are layered on top of each other within the World of Warcraft UI. The optional `showHidden` parameter allows you to also see frames that aren't currently displayed, providing a comprehensive view of the entire UI structure at the mouse cursor's position.

Translating the requested documentation format and content requirements for the `GameTooltip` class into markdown yields the following. This example takes into consideration the structure and detail provided in your initial examples.

---

## GameTooltip
`GameTooltip` is a class responsible for displaying tooltips in the game's UI. This includes information about items, spells, abilities, and more. One of the methods available in this class allows you to set a specific glyph in the tooltip, as detailed below.

### SetGlyph
This method is used to assign a glyph to the GameTooltip instance.

#### Parameters

- **glyphId**: `Unknown` - The ID of the glyph that you want to display information for in the tooltip. The exact type and details of this parameter are not documented here.

#### Returns

- **Unknown**: The return type and details are not documented. It might not return any value or the return type is not specified.

#### Example Usage:

In the example provided below, we assign a glyph to a `GameTooltip` instance. The `glyphId` parameter value is hypothetical as the exact details about the glyph IDs and how to obtain them are not provided.

```typescript
// Assuming 'gameTooltip' is an instance of GameTooltip
// and 'exampleGlyphId' is a valid glyph ID you've obtained.
gameTooltip.SetGlyph(exampleGlyphId);

// Additional logic may be needed to display the tooltip,
// interact with it, or handle the glyph information within the UI.
```

### Notes

- The use of the `SetGlyph` method requires knowledge of glyph IDs, which may be obtained through other means within the game's API or user interface.
- The exact effects and visual presentation of setting a glyph using this method will depend on the game's UI and the specific glyph ID provided.
- As the parameter types and return types are labeled `Unknown`, users of this method should exercise caution and validate the behavior in the game to ensure it meets expectations.

This documentation aims to provide a clear understanding of how to use the `SetGlyph` method within the `GameTooltip` class, even though some details are not fully documented.

---

# SetGuildBankItem

This method displays the tooltip for a specific item located in a guild bank tab and slot.

## Parameters

- **tabId**: `WoWAPI.CONTAINER_ID_BANK` - The ID of the guild bank tab.
- **slot**: `number` - The slot ID within the specified guild bank tab where the item is located.

## Example Usage

```typescript
declare const GameTooltip: {
  /**
   * Shows the tooltip for the specified guild bank item.
   * @param tabId the tab ID
   * @param slot the slot ID
   */
  SetGuildBankItem(tabId: WoWAPI.CONTAINER_ID_BANK, slot: number): void;
};

// Assuming we want to show the tooltip for an item in the first tab and first slot of the guild bank
const tabId: WoWAPI.CONTAINER_ID_BANK = 1;
const slot: number = 1;

// Show the tooltip for the item located at the first slot of the first tab in the guild bank
GameTooltip.SetGuildBankItem(tabId, slot);

// Use this function when you want to display information about an item stored in the guild bank.
// You need to know the specific tab and slot number where the item is located to use this method effectively.
```

### Notes

- Ensure you have a correct and valid `tabId` and `slot` for the item you want to display the tooltip for. Invalid values can lead to errors or unexpected behavior.
- This method is typically used in UI modifications to provide additional information to the user about specific items in a guild bank.

This approach provides detailed, actionable, and clear documentation for the `SetGuildBankItem` method, ensuring developers understand its purpose, usage, and requirements.

# GameTooltip

The `GameTooltip` class provides functionality for modifying the game's tooltip behavior, such as changing the displayed item or text based on certain conditions. Below is a documented method of the `GameTooltip` class.

## SetHyperlink

The `SetHyperlink` method changes the content displayed in the tooltip to match the item, enchant, spell, or a clickable string specified by the `itemIdentifier`.

### Parameters

- **itemIdentifier**: `string | ItemLink` - This parameter can be an in-game item ID, an itemLink string representing an item, enchant, or spell, or even a clickable string generated by the in-game API. This identifier dictates what the tooltip will display.

### Example Usage

In this example, the `SetHyperlink` method is used to change the content of the game tooltip to display details about a specific in-game item, referenced by its item link.

```typescript
// Assuming 'GameTooltip' is already instantiated 
// and corresponds to a UI element in the game.
// 'itemLink' represents the item link of "Ashbringer" for example

const itemLink: string = "item:19019"; // This is a placeholder item link for demonstration

// When the player hovers over the specific UI element,
// the tooltip will be adjusted to show the designated item's details.
GameTooltip.SetHyperlink(itemLink);

// The tooltip is now set to display the information of the item with the given link.
// Additional UI handling logic can be implemented here as needed.
```

### API Reference

This method relates closely to the World of Warcraft API functionality described at: [API GameTooltip SetHyperlink](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetHyperlink)

### Notes

- The use of this method is particularly useful in cases where dynamic updates to tooltip content are needed based on in-game interactions or conditions.
- The `itemIdentifier` must accurately represent an existing in-game item, enchant, or spell. Using an incorrect identifier will result in the tooltip not displaying the intended content.
- The `ItemLink` type mentioned as part of the parameter type is typically a string format that includes the item ID and possibly other item-specific metadata. It is commonly acquired through in-game functions or events that provide such links.

This method provides a versatile way to interact with the game's UI elements, enhancing the user experience by dynamically displaying relevant item information directly within tooltips.

Here is how you could document the `SetHyperlinkCompareItem` method of the `GameTooltip` class into Markdown, following a similar structure to the examples provided.

---

## SetHyperlinkCompareItem

This method is used within the GameTooltip class to initialize the tooltip for comparing items through hyperlinks. When a hyperlink for an item is clicked in the game, and comparison tooltips are enabled (e.g., by holding the "Shift" key), this method prepares the GameTooltip object to show the comparative data between the item of interest and any equipped item in the corresponding slot.

### Parameters

- **...args**: `Unknown[]` - The parameters for this method are currently undocumented. They likely involve the item's hyperlink information and perhaps other contextual flags or identifiers used to differentiate between different states or conditions in which an item comparison is requested.

### Returns

- **Unknown**: The exact return type and structure are not documented. It's conceivable that this method modifies the GameTooltip instance in place without returning a value, or it may return a status code, boolean, or object reflecting the outcome of the operation.

### Usage Example

Below is an illustrative example of how `SetHyperlinkCompareItem` might be used within the context of a World of Warcraft AddOn. Since the arguments and return type are unknown, this example is somewhat speculative and aims to give a general idea of context rather than precise syntax.

```typescript
// Assuming we have a GameTooltip instance and a hyperlink string of an item
declare let gameTooltip: GameTooltip;
let itemHyperlink: string = "item:12345:0:0:0:0:0:0:0";

// Speculatively calling SetHyperlinkCompareItem method
// The actual arguments needed are unknown, so this is merely an example
gameTooltip.SetHyperlinkCompareItem(itemHyperlink);

// Further code to show the tooltip, likely somewhere else in your AddOn
gameTooltip.Show();
```

**Note:** Because the signature and purpose of `SetHyperlinkCompareItem` are not fully documented, this example is based on assumptions drawn from typical usage patterns in World of Warcraft AddOns. Always refer to the latest API documentation and community resources for accurate information and best practices.

---

This Markdown documentation provides a structured overview of the `SetHyperlinkCompareItem` method, accounting for unknowns in the API and follows the format of explaining parameters, returns, and a usage example to help developers understand how it might be implemented in a World of Warcraft AddOn.

To convert the given TypeScript class definitions into readme documentation for creating AIO plugins similar to World of Warcraft AddOns, we follow the structure demonstrated with the `FontInstance` interface. Below is an example of how to transform the `GameTooltip` class method `SetInboxItem` into a markdown documentation.

---

# GameTooltip Methods

## `SetInboxItem`

Shows the tooltip for the specified mail inbox item.

### Parameters

- **index** `number`: The index of the message to get information from. This value must be within the range of the inbox items.
  
- **attachmentIndex** `number`: The index of the attachment to get information from. Values are in the range of `[1, ATTACHMENTS_MAX_RECEIVE(16)]`. This parameter specifies which attachment of the mail item to show the tooltip for.

### Returns

- `Unknown`: The exact return type for this function is not specified. It operates by side-effect, showing or updating a tooltip rather than returning data.

### Example Usage

```typescript
// Assuming 'GameTooltip' is an instantiated object of the GameTooltip class.
// Here we are showing the tooltip for the first attachment of the second inbox item.
GameTooltip.SetInboxItem(2, 1);

// This will make the tooltip visible on the UI for the specified inbox item
// and attachment, giving the player more details about the item without opening the mail.
```

### Remarks

- This method is crucial for AddOns that aim to enhance the user experience around mail interaction, by showing tooltips for inbox attachments without requiring the user to open each mail individually.
- Remember to handle cases where the specified indexes may exceed the actual number of inbox items or attachments to avoid errors.

### See Also

- [World of Warcraft API - GameTooltip](http://wowwiki.wikia.com/wiki/API_GameTooltip): For more information on other `GameTooltip` functions and classes. 

---

This structure concisely presents the method, its purpose, parameters, return type, example usage, remarks, and related links. It's critical to provide enough details in the examples to illustrate common use cases without being overly simple or overly complex.

To facilitate creating markdown documentation for methods, I'll create an example based on the GameTooltip class method `SetInventoryItem` as described. This documentation will follow similar formatting and structure as the provided TypeScript Class method documentation. 

```markdown
# GameTooltip

The `GameTooltip` class manages tooltip widgets, allowing the display of pertinent information for various game elements such as units and items.

## Methods

### SetInventoryItem

Set the tooltip to display information for a given unit's inventory slot.

#### Parameters

- **unit** `UnitId` - The unit whose inventory is to be interrogated.
- **slot** `number` - The specific inventory slot number to check.
- **nameOnly** `Unknown` (optional) - The purpose of this parameter is unknown.

#### Returns

- **hasItem** `boolean` - Indicates whether there is an item present in the specified slot.
- **hasCooldown** `boolean` - Unknown.
- **repairCost** `number` - The cost to repair the item, if applicable.

#### Example Usage:

Below is an example on how to use `SetInventoryItem` to check if a specific slot in the player's inventory contains an item, additionally capturing the presence of a cooldown and repair costs. The emphasis is on real-world application with context to make understanding easier.

```typescript
// Assuming GameTooltip is already instantiated as 'myTooltip'
// and aiming to check the first slot of the player's inventory

const unitId = "player"; // Target unit
const inventorySlot = 1; // Slot to be checked, e.g., 1 for the head slot in equipment

const [hasItem, hasCooldown, repairCost] = myTooltip.SetInventoryItem(unitId, inventorySlot);

if (hasItem) {
    console.log(`Item found in slot ${inventorySlot}.`);
    if (hasCooldown) {
        console.log(`Item has a cooldown.`);
    }
    if (repairCost > 0) {
        console.log(`Item repair cost: ${repairCost} gold.`);
    }
} else {
    console.log(`No item found in slot ${inventorySlot}.`);
}

```

This snippet demonstrates querying the player's head slot for an item presence, inspecting its cooldown status, and checking if there's an associated repair cost without directly engaging with the specific mechanics behind `nameOnly`.

---

See also:
- [GameTooltip](http://wowwiki.wikia.com/wiki/API_GameTooltip)
- [World of Warcraft API Documentation](https://wowpedia.fandom.com/wiki/World_of_Warcraft_API)

```

The documentation begins with a brief introduction to the `GameTooltip` class, followed by a more detailed explanation of the `SetInventoryItem` method. Parameters are clearly listed with types and optional states, the return values are described along with their types and meanings. An example usage section showcases practical application of the method, intended to help users understand how and when it could be used in their own scripts. Finally, references or links to related documentation or APIs are provided for further reading or exploration.

```markdown
# GameTooltip

`GameTooltip` provides methods for managing game tooltips, which offer in-game descriptions and specific information about items, spells, and other game elements. Below is the method to show an item key in a tooltip.

## SetItemKey

Displays the tooltip for an item, incorporating its ID, level, and suffix to offer players specific information about the item.

### Parameters

- **itemID** `number` - The ID of the item.
- **itemLevel** `number` - The item's level.
- **itemSuffix** `number` - The item's suffix identifier, which can denote variations of the same item.

### Usage

When you want to show detailed information about a specific item variation in a tooltip, you can use `SetItemKey` with the item's ID, level, and suffix. This method is particularly useful for addons that need to show enhanced item tooltips beyond the basic item description.

#### Example:

Let's imagine your addon wants to display enhanced tooltip information for a weapon that has different qualities and levels. You have the item's basic ID but also need to account for its level and suffix to correctly display all the data.

```typescript
declare const GameTooltip: GameTooltip;

// Example item details
const itemID = 12345; // This is a placeholder for a real item ID.
const itemLevel = 60; // Assuming this item has a level of 60.
const itemSuffix = 678; // Represents a specific variation of the item.

// Before calling SetItemKey, you should ensure the GameTooltip is properly anchored or positioned according to your UI design.
// Positioning the GameTooltip
GameTooltip.SetOwner(UIParent, "ANCHOR_CURSOR"); // Example: Anchor the tooltip to the cursor.

// Display the item information in the tooltip.
GameTooltip.SetItemKey(itemID, itemLevel, itemSuffix);

// Show the tooltip.
GameTooltip.Show();

// You might want to hide the tooltip when it's no longer needed, for example, when the user moves the mouse away.
// Hiding the tooltip could be handled elsewhere in your addon, depending on user interactions.
```

This example demonstrates how to use `SetItemKey` to show a tooltip with detailed information about an item, including its unique variations defined by the suffix and level. Incorporating `SetItemKey` into your addon can significantly enhance the way information is presented to the user, especially for items with complex variations and stats.

Below is a structured documentation for the `SetLootItem` method of the `GameTooltip` class, intended for use in a Readme documentation format similar to API documentation for AIO plugins or World of Warcraft AddOns. The format follows your provided examples, focusing on providing a clear and comprehensive overview of the method's use, parameters, and an example usage to guide developers.

---

## SetLootItem

Sets the `GameTooltip` object to show information about a specific loot item based on the provided loot index. This method is particularly useful for addons that interact with lootable objects or NPCs, allowing for a detailed tooltip that corresponds to an item's position in a loot table.

### Parameters
- **lootIndex** `number` - The index of the loot item within the loot table you wish to display info for. This index starts at 1 and goes up to the number returned by `GetNumLootItems()`.

### Returns
This method does not return any value.

### Example Usage

In this example, we're creating a simple event listener that waits for a player to loot an object. Once an item is looted, it retrieves the number of loot items available and sets the `GameTooltip` to display information for the first item in the loot table. This can be a valuable tool for addon developers looking to provide custom tooltips or additional information related to looted items.

```typescript
// Assuming 'GameTooltip' is an already instantiated tooltip object.
// Listen to an event that indicates an object has been looted. This is a placeholder for your actual loot detection logic.
myEventEmitter.on('objectLooted', () => {
  // Call a hypothetical function to get the number of items in the current loot table.
  const numLootItems = GetNumLootItems();

  if (numLootItems > 0) {
    // The loot index is 1-based, so we are looking at the first item in the loot table.
    const lootIndex = 1;

    // Set the GameTooltip to display information about the first loot item.
    GameTooltip.SetLootItem(lootIndex);

    // Additional logic here to display the tooltip, for example:
    GameTooltip.Show();
  } else {
    console.log('No items to loot.');
  }
});
```

### Notes
- It's critical to ensure that the loot table has been populated before calling `SetLootItem`. This is typically done by interacting with a lootable object in the game.
- The tooltip will not automatically update if the loot table changes. You must call `SetLootItem` again with the updated loot index to reflect any changes.
- This method interfaces directly with the World of Warcraft API, hence its functionality is dependent on the API's current version and availability.

### See Also
- `GetNumLootItems()` - A hypothetical method to retrieve the total number of items in the current loot table.
- `GameTooltip.Show()` - Displays the tooltip on screen. This method would be part of the `GameTooltip` class and is necessary to actually render the tooltip after setting it up.

Remember that the actual implementation of events and other referenced methods (like `GetNumLootItems`) will depend on your specific addon or plugin environment and the APIs provided by World of Warcraft or the addon framework you're working with.

Assuming you want a consistent documentation format similar to the `FontInstance` example, here's how the `SetLootRollItem` method of the `GameTooltip` class can be documented:

# SetLootRollItem

This method is used to show the tooltip for the specified loot roll item, providing players with detailed information about the item that's being rolled for in a loot contest.

### Parameters
- **rollId** `number` - The unique identifier for the loot roll. This ID is used to specify which loot's tooltip should be displayed.

### Returns
`void` - This method does not return any value.

### Example Usage
In this example, the `SetLootRollItem` method is used within a loot roll event handler. When a loot roll event occurs, it shows the tooltip for the item being rolled for, using the roll ID provided by the event:

```typescript
class LootRollEventHandler {
  private gameTooltip: GameTooltip;

  constructor(gameTooltip: GameTooltip) {
    this.gameTooltip = gameTooltip;
  }

  public onLootRollEvent(rollId: number): void {
    // Assuming rollId is the ID of the item received from the loot roll event
    this.gameTooltip.SetLootRollItem(rollId);
    // Additional logic to handle the loot roll event can be added here
  }
}

// Example usage
const gameTooltip = new GameTooltip();
const lootRollHandler = new LootRollEventHandler(gameTooltip);

// Example rollId received from an event
const exampleRollId = 12345;
lootRollHandler.onLootRollEvent(exampleRollId);
```
In the example above, `LootRollEventHandler` is a class designed to handle loot roll events within the game. It takes an instance of `GameTooltip` to display tooltips. The method `onLootRollEvent` is triggered by a loot roll event, using `SetLootRollItem` to show the tooltip for the contested loot item by passing the `rollId` it receives from the event.

### Notes
Ensure the `rollId` provided to `SetLootRollItem` is valid and corresponds to an actual item being rolled for in the game. Invalid IDs may result in undefined behavior or failure to display the tooltip as intended.

Creating comprehensive and detailed documentation is crucial for understanding and utilizing classes and methods effectively. Here's a markdown documentation example for the `GameTooltip` class based on the provided guidelines and examples:

---

# GameTooltip Class Documentation

`GameTooltip` is a class used within the context of the AIO plugins, similar to World of Warcraft (WoW) AddOns. This documentation focuses on one of its methods, `SetMerchantCompareItem`, detailing its purpose, parameters, and usage.

## SetMerchantCompareItem

This method is used to specify an item for comparison purposes within a merchant's frame. It is commonly used for showing tooltips that compare the merchant's item to the player's currently equipped item.

### Parameters

- **slot** (`number`): An integer representing the inventory slot of the item to be compared. The specific slot numbers can be found in the [InventorySlotId documentation](https://wowpedia.fandom.com/wiki/Enum.InventorySlotId).

- **offset** (`number?`): An optional parameter representing the offset to be used for the comparison tooltip. This can be used to adjust the positioning of the comparison tooltip relative to the default position.

### Returns

- **Unknown**: The return type of this method is unknown. It is not documented what, if any, value is returned upon its invocation.

### Usage Example

Below is an example of how `SetMerchantCompareItem` might be used within an AIO plugin. This example assumes the existence of a `GameTooltip` instance and demonstrates setting up a comparison for a merchant's item:

```typescript
// Create an instance of GameTooltip
let myGameTooltip = new GameTooltip();

// Assuming the slot number 1 (head slot) and no offset
myGameTooltip.SetMerchantCompareItem(1);

// If you want to use an offset for the comparison tooltip positioning
// Assuming the slot number 2 (neck slot) with an offset of 10
myGameTooltip.SetMerchantCompareItem(2, 10);
```

This example demonstrates the basic usage of `SetMerchantCompareItem` for comparing a merchant's item with one that a player might have equipped in a specific slot.

### Notes

- The specifics regarding the numerical values for `slot` and `offset` parameters, and how they influence the tooltip positioning and behavior, might require further research or experimentation, as the WoW API documentation can sometimes be sparse or outdated.

- The exact behavior and visual representation of tooltips created using `SetMerchantCompareItem` can vary based on several factors, including the user's interface (UI) settings and other AddOns that might be installed.

For more detailed information on inventory slots and other related API functions, please refer to the [WoW API documentation on Wowpedia](https://wowpedia.fandom.com/wiki/World_of_Warcraft_API).

---

This tailored documentation provides developers with a clear understanding of the `SetMerchantCompareItem` method's purpose, parameters, and usage within the `GameTooltip` class, following the structured format as illustrated through the previous examples.

To create markdown documentation for the `GameTooltip` class and its `SetMerchantItem` method, you can follow the structure provided in the examples. Here's how you could document it:

## GameTooltip
`GameTooltip` is an essential class used for handling in-game tooltips. Tooltips are small, pop-up boxes that display information about the items, spells, and UI elements the player hovers over. 

### Methods
#### SetMerchantItem
This method is utilized to set the tooltip for an item being sold by a merchant. 

### Parameters 
`...args: Unknown[]` - This method takes an unknown number of arguments of an unknown type. Since World of Warcraft's API documentation can sometimes be vague or incomplete, this indicates a need for further in-game testing to understand the parameters fully.

### Returns 
`Unknown` - The return type of this method is also unknown, indicating that it might not return a value or that the return value's type and significance are yet to be determined through testing.

### Example Usage 
The following example is speculative since the parameters and return value of `SetMerchantItem` are not well-documented. Normally, this method would be used when setting up custom UI elements that require displaying merchant item tooltips, such as when creating a custom merchant interface.

However, without knowing the exact parameters, we can only provide a generic implementation example:

```typescript
declare const GameTooltipInstance: GameTooltip;

// Assuming the first parameter is the merchant slot ID and we are working with a known slot ID
const merchantSlotId = 1;

// The actual parameters required by SetMerchantItem need to be determined by in-game testing
GameTooltipInstance.SetMerchantItem(merchantSlotId);

// Typically, after setting up the tooltip, you would show it on the UI
GameTooltipInstance.Show();
```

### Notes
- The use of `Unknown` types for both parameters and return values indicates a gap in the documentation or an aspect of the API that is dynamic and context-dependent. Players and addon developers might need to perform their tests in the game environment to determine how to use this method effectively.
- The `GameTooltip` class often interacts with in-game UI elements, so changes to the game's UI API can impact how methods like `SetMerchantItem` function. Always ensure your addons are updated for the latest game version.
- Since `SetMerchantItem` directly interacts with the game's merchant UI, improper use could lead to UI errors or conflicts with other addons. Always test extensively in a controlled environment. 

This template aims to provide a starting point for documenting methods with incomplete or unknown details. As more information becomes available or through community collaboration, the documentation can be revised to provide more accurate and helpful information.

Based on the provided example and instructions, below is a markdown documentation example for the `SetMinimumWidth` method in the `GameTooltip` class. The aim is to provide a consistent and informative documentation style for building AIO plugins similar to WoW AddOns.

---

# GameTooltip Documentation

`GameTooltip` is a predefined class in World of Warcraft. Game tooltips are interactive boxes that display information about various elements in the game, such as items, spells, and units. This documentation describes the `SetMinimumWidth` method of the `GameTooltip` class.

## SetMinimumWidth

The `SetMinimumWidth` method is used to set the minimum width of a game tooltip. This can be useful for ensuring that your tooltip text does not become too compressed or difficult to read, regardless of the content's width.

### Parameters

- **width** `number` - The minimum width for the tooltip, measured in pixels.

### Returns
This method does not return a value.

### Example Usage

Below is an example of how `SetMinimumWidth` might be used in a script. In this scenario, the goal is to create a tooltip with a minimum width of 200 pixels, ensuring that the textual information is well-presented and easy to read for the user.

```typescript
// Assuming `gameTooltip` is an instance of `GameTooltip`
// This example sets the minimum width of the tooltip to 200 pixels
gameTooltip.SetMinimumWidth(200);

// You might follow this by setting the tooltip's text, position, etc.
gameTooltip.SetText("This is an example tooltip.");
gameTooltip.SetOwner(UIParent, "ANCHOR_CURSOR");
gameTooltip.Show();
```

### Notes

- It is important to use this method wisely. Setting the minimum width too large could cause the tooltip to overlap other UI elements or extend beyond screen boundaries, especially on smaller screens.
- This method only sets the minimum width. The actual width of the tooltip might be larger to accommodate its content.
- Consider using this method in conjunction with `SetMinimumHeight` if you also need to control the tooltip's height for better display.

---

This documentation format aims to provide all the essential information about using the `SetMinimumWidth` method, including its purpose, parameters, an example of how to use it, and any important notes or considerations.

# GameTooltip

The `GameTooltip` class provides methods for managing in-game tooltips, which are small, interactive texts that provide information about game objects and UI elements. One of the key methods in this class is `SetOwner`, which positions the game tooltip based on a specified owner frame.

## SetOwner

This method positions the game tooltip based on the "owner" frame, allowing developers to specify where a tooltip should appear in relation to a UI element.

### Parameters

- **owner**: UIObject - The owner frame, which defines the element around which the tooltip is centered. This parameter requires a pointer to the frame, not the frame name itself. Use `_G['MyFrame']` to get a pointer from the frame name.
- **anchor**: Point - A string describing the anchor point, as it would be set via the `SetPoint()` function. For example, "TOPLEFT", "BOTTOMRIGHT", etc.
- **offsetX**: number (optional) - The horizontal offset from the anchor point.
- **offsetY**: number (optional) - The vertical offset from the anchor point.

### Description

`SetOwner` determines the tooltip's positioning relative to the specified owner frame. By setting an owner, you can also use `tooltip:IsOwned(frame)` to check if a tooltip is currently owned by a particular frame. It is common practice to first set an owner for the tooltip (e.g., `GameTooltip:SetOwner(UIParent)`) and then check ownership (e.g., `GameTooltip:IsOwned(UIParent)` returning `true`).

### Related API
- [SetPoint()](http://wowwiki.wikia.com/wiki/API_Region_SetPoint) for understanding anchor points.
- [GameTooltip:IsOwned()](http://wowwiki.wikia.com/wiki/API_GameTooltip_IsOwned) for checking if a tooltip has an owner.

### Example Usage

In this example, we create a simple frame and set up a tooltip that appears when the user mouse-overs the frame. The tooltip is positioned relative to the frame with specific offsets.

```typescript
// Create a simple frame for demonstration
const myFrame = new Frame("MyFrame", UIParent, 100, 100);
myFrame.SetPoint("CENTER"); // Position the frame in the center of the screen

// Trigger the tooltip on mouse-over
myFrame.SetScript("OnEnter", function() {
  GameTooltip.SetOwner(myFrame, "ANCHOR_RIGHT", 10, 0); // Position the tooltip to the right of the frame with a 10px offset
  GameTooltip.SetText("This is a tooltip for MyFrame."); // Set the text to display in the tooltip
  GameTooltip.Show(); // Make the tooltip visible
});

// Hide the tooltip when the mouse leaves the frame
myFrame.SetScript("OnLeave", function() {
  GameTooltip.Hide();
});
```

This code snippet demonstrates not only how to position a tooltip in relation to another UI element but also how to dynamically show and hide tooltips based on user interaction, providing enhanced interactivity and information within the user interface.

In the context of creating markdown documentation for a TypeScript class definition, particularly for a class method used in building AIO plugins similar to World of Warcraft Addons, here's how you can document the `SetPadding` method of the `GameTooltip` class:

---
## SetPadding

This method sets the amount of padding on the right-hand side of the `GameTooltip`. Adding padding can be useful for ensuring that the tooltip text does not touch or come too close to the tooltip border, thus improving readability and aesthetic appeal.
### Parameters

- **amount**: `number` - The amount of padding (blank space) to apply on the right-hand side of the tooltip. This is specified in pixels.

### Returns

`void` - This method does not return a value.

### Example Usage

The following example demonstrates how to use the `SetPadding` method to set a 10-pixel padding on the right side of a `GameTooltip` instance. This adjustment provides ample spacing, enhancing the tooltip's visual presentation within the game UI.

```typescript
// Assume 'gameTooltip' is a pre-existing GameTooltip instance
// Here's how to set a 10-pixel padding on its right-hand side

const paddingAmount: number = 10; // Padding in pixels

// Setting the right-hand side padding on the game tooltip
gameTooltip.SetPadding(paddingAmount);

// Following the SetPadding method, you can continue configuring your tooltip
// For instance, setting its text, positioning, and showing it
gameTooltip.SetText("This is an example tooltip text.");
gameTooltip.Show();
```

### Notes

- It's important to call `SetPadding` *before* setting the tooltip's text or content to ensure the padding applies correctly.
- The amount of padding required can vary depending on the length and format of the tooltip text, as well as the overall UI design. It may require some experimentation to find the optimal padding value for your specific use case.
- The `SetPadding` method is particularly useful when creating custom tooltips that may contain variable lengths of text or dynamic content.

### See Also
- [API_GameTooltip_SetText](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetText) - Method to set the text of a `GameTooltip`.
- [API_GameTooltip_Show](http://wowwiki.wikia.com/wiki/API_GameTooltip_Show) - Method to show the `GameTooltip`.

--- 

This markdown documentation format provides a clear and structured way to present information about the `SetPadding` method, including its purpose, parameters, usage example, and related methods.

To document the `SetPetAction` method of the `GameTooltip` class in a markdown format inspired by the previous examples, you would structure it like this:

## SetPetAction

This method is used to show the tooltip for the specified pet action.

### Parameters

- **slot**: `number` - The pet action slot ID.

### Returns

- **Unknown**: The return type is unknown.

### Example Usage

In this example, we will show how to use the `SetPetAction` method to display a tooltip for a pet action slot.

```typescript
// Assuming 'GameTooltip' is an instance of the 'GameTooltip' class
// and has already been properly initialized.

// Define the pet action slot ID
const petActionSlotID = 1; // Example slot ID

// Show the tooltip for the specified pet action
GameTooltip.SetPetAction(petActionSlotID);

// Additional logic can be added here
// to handle events after showing the pet action tooltip.
```

In this example, the `SetPetAction` method is called with a specific pet action slot ID. This operation will cause the game's UI to display a tooltip corresponding to the action slotted in the specified ID. This is particularly useful for developers looking to add detailed information or custom interfaces for managing pet actions within their addons.

To create consistent and detailed documentation for a TypeScript class representing a plugin system similar to World of Warcraft AddOns (such as for AIO plugins), let's use the structured approach illustrated in the previous examples. The documentation for a method `SetQuestItem` in a class `GameTooltip` will be akin to this:

---

## SetQuestItem

This method is tasked with setting the tooltip for a quest item. The specific mechanics and visual representation that are influenced by the invocation of this method remain undocumented in the source, thus requiring empirical exploration or further clarification. It accepts an undetermined number of arguments, which suggests its flexible utility in various contexts pertaining to quest items within the game interface.

### Parameters

`...args: Unknown[]` - The method accepts a variable number of arguments. The types and purposes of these arguments are not explicitly defined, indicating a need for dynamic input structures. Given the method's focus on quest items, it is reasonable to infer that these arguments could include identifiers, states, or other properties relevant to the quest items' representation within the game's user interface.

### Returns

`Unknown` - The return type signifies an uncertainty about what the method yields upon execution. It could be void, indicating no return value and, therefore, a sole emphasis on executing an action. Alternatively, it might provide feedback, such as success status or error information, which would be critical for debugging or conditional logic in the calling code.

### Example Usage

Due to the abstract nature of the `SetQuestItem` method's documentation, constructing a precise example is challenging without additional context. However, a conceptual usage scenario can be described as follows:

```typescript
const gameTooltip = new GameTooltip();

// Hypothetical usage, assuming args are quest item related identifiers
let questItemId = 12345; // Example quest item ID
let playerAction = "pick"; // Example action, e.g., picking up the item
gameTooltip.SetQuestItem(questItemId, playerAction);

// Potential expected behavior: updates the game tooltip to reflect that the quest item has been picked up.
```

Note: The above code is purely illustrative, highlighting a possible way to use the `SetQuestItem` method based on the conventional purposes of tooltip manipulation methods within gaming interfaces. Precise parameter values and method effects are speculative and require verification against official documentation or source code insights.

--- 

This template approach ensures that even with minimal or uncertain information about a method's functionality, the documentation remains structured, highlights knowns and unknowns, and provides a conceptual usage example to aid understanding.

To document the `SetQuestLogItem` method of the `GameTooltip` class in the same structured manner as in the example provided, we would write the following markdown documentation:

# GameTooltip
The `GameTooltip` class is a construct for creating and manipulating game tooltips, which are UI elements used to provide detailed information about game objects, such as items, spells, and units. It is part of the UI Toolkit utilized in creating AddOns similar to those in World of Warcraft.

## SetQuestLogItem
Sets the tooltip to display information about an item in the quest log. This method is typically used when creating custom UI elements that interact with quests and their associated items.

### Parameters
- `...args`: Unknown[] - The parameters passed to this method are not clearly defined. It's suggested to pass the item's index within the quest log or similar identifying information. Due to the nature of this method, experimentation with the input parameters might be necessary to achieve the desired outcome.

### Returns
- Unknown - The return type of this method is not documented. It could potentially alter the state of the `GameTooltip` object without returning any value, or it might return an identifier or a status code indicative of the operation's success or failure.

### Example Usage
The following TypeScript Code demonstrates how to use the `SetQuestLogItem` method within an AIO plugin. Since the method's parameters and return type are unspecified, we will assume a scenario where `SetQuestLogItem` is expected to take an item index from the quest log.

```typescript
// Assume we have a GameTooltip instance named 'gameTooltip'
declare const gameTooltip: GameTooltip;

// Index of the item in the quest log. This is hypothetical as the actual required parameters are unknown.
const questLogItemIndex = 1;

// Attempt to set the tool tip to display information about the specified item from the quest log.
// Since the parameters are unclear, one might need to adjust this based on the method's expectations.
try {
  gameTooltip.SetQuestLogItem(questLogItemIndex);

  console.log("The tooltip has been set to display the quest log item's information.");
} catch (error) {
  console.error("An error occurred while setting the tooltip for the quest log item:", error);
}
```

Note: The actual implementation details and parameters of `SetQuestLogItem` may vary since its signature is marked as unknown. Developers are encouraged to consult official documentation (if available) or explore the method through testing within their development environment.

Creating a markdown documentation for the `GameTooltip` class's `SetQuestLogRewardSpell` method based on the format provided can enhance the understandability and accessibility of its functionality. Below is an example of how the markdown documentation can be structured:

---

# GameTooltip

The `GameTooltip` class is responsible for controlling the behavior and contents of in-game tooltips. Tooltips are dynamic information panels most commonly used to give more detail about game objects, spells, items, and more.

## SetQuestLogRewardSpell

Displays the tooltip for the spell reward of the currently selected quest. This method can be particularly useful for UI addons that involve questing or spell information.

### Parameters

- **args**: `Unknown[]` - This parameter expects an array of unknown type. The specific requirements for this parameter are not clearly documented, however, it is presumed to include identifiers necessary to fetch the correct quest and its associated reward spell.

### Returns

- **Return Type**: `Unknown` - The return type is unspecified, indicating that the primary purpose of this method is to perform an action (showing the tooltip) rather than returning data.

### Example Usage

Below is a hypothetical example of how `SetQuestLogRewardSpell` might be used within an addon to display a tooltip for a quest's spell reward. Note that due to the lack of detailed information on the parameter structure, the example simplifies the usage context.

```typescript
// Assume 'GameTooltip' is an instance of the GameTooltip class
// The specific args needed are not documented, hence an empty array is passed for demonstration
GameTooltip.SetQuestLogRewardSpell([]);

// Positioning the tooltip (this step is necessary as showing the tooltip alone won't position it)
GameTooltip.SetOwner(UIParent, "ANCHOR_CURSOR");
GameTooltip.Show();
```

In this example, the `SetQuestLogRewardSpell` method is called with an empty array for demonstration purposes. The tooltip is then anchored to the cursor and made visible through the `Show` method. Ideally, the `args` parameter would include specific identifiers to target the correct quest reward spell.

### Note

Since the exact specification of the `args` parameter is unknown, addon developers may need to reference additional documentation or reverse-engineer the client to understand how to use this method effectively. The functionality to directly manipulate or interact with quest log rewards through tooltips signifies a powerful tool for enhancing player interaction and information display within addons.

---

This documentation format systematically provides an overview, detailed method description, parameters, return values, and practical usage examples, making it easier for developers to integrate such functionality into their projects.

Below is a markdown documentation example for the `SetQuestRewardSpell` method of the `GameTooltip` class, assuming the method and its parameters are not fully documented or known ("unknown"). This example follows the structure used for the `FontInstance` interface, tailored for a class method within the context of AIO plugin development for games like World of Warcraft.

---

## SetQuestRewardSpell

This method is presumed to set the spell reward information on a Game Tooltip, typically used when hovering over quest rewards that grant a spell or ability. The exact workings and parameters of this method are not fully documented.

### Parameters

- **args** `Unknown[]` - This method accepts an undetermined number of arguments of unknown types. Due to the lack of detailed documentation, the nature of these arguments (such as their types and purposes) cannot be precisely defined.

### Returns

- `Unknown` - The return type of this method is not clearly documented. It could potentially return a value providing feedback about the operation (like success or failure), but the exact nature of this return value, if any, is unspecified.

### Example Usage

Due to the unspecified nature of both the input parameters and the returned value, providing a precise example is challenging. However, an illustrative usage scenario might look as follows, keeping in mind that the actual code might significantly differ based on the method's true implementation.

```typescript
// Assuming GameTooltip is an already instantiated object of the GameTooltip class.

// Hypothetical usage based on the method's apparent intent.
// The following line represents a call to SetQuestRewardSpell with an unknown set of arguments.
// Replace `arg1`, `arg2`, etc., with actual parameters if and when they become known.
GameTooltip.SetQuestRewardSpell(arg1, arg2, ...);

// Due to the lack of information on what the method accepts and returns,
// this example is purely speculative and intended for illustrative purposes only.
```

**Note:** This documentation and the provided code example are based on assumptions and the currently available information. As such, they should not be considered definitive or accurate. Further research and clarification from the developers or through official documentation are required to properly implement this method.

--- 

This template provides a basis for documenting methods with unknown parameters and behaviors, adapting as more information becomes available.

Creating markdown documentation requires a structured format that highlights the purpose of the class, method parameters, return types, and example usage. Let's structure the documentation for the `GameTooltip` class's `SetSendMailItem` method based on the provided guidelines and examples.

---

# GameTooltip Class Documentation

The `GameTooltip` class encompasses methods for interacting with game tooltips. Tooltips provide contextual information and details about various UI elements, in-game items, characters, and more.

## Method: SetSendMailItem

The `SetSendMailItem` method sets the item to be displayed in a tooltip when sending mail. Its primary use is within the mail sending UI, allowing users to see information about the item they are attaching to a mail.

### Arguments

- **...args**: `Unknown[]` - The arguments for this method are currently unknown. They are presumed to involve identifiers or parameters related to the item being sent via mail.

### Returns

- **Unknown** - The specific return value of this method is currently unknown. It might not return any value or could return specific data related to the operation's success.

### Example Usage

Due to the unknown parameters and use case of the `SetSendMailItem` method, the following is a hypothetical example assuming the method takes item identifiers as an argument.

```typescript
const gameTooltip = new GameTooltip();

// Hypothetical example: This is assuming the method takes an item ID or similar identifier,
// which may not be accurate due to the unknown nature of the parameters.
gameTooltip.SetSendMailItem(itemID);

// Since the actual usage may vary, ensure to replace `itemID` with the appropriate arguments
// or parameters as per your use case or future API documentation updates.
```

### Notes

The usage of `SetSendMailItem` is highly speculative due to the lack of detailed documentation on the parameters and return types. This method's implementation, effects, and requirements might vary significantly. Developers are advised to consult the latest API documentation or source code comments for accurate details.

Always ensure your implementation aligns with the actual API definitions and consider this document as a starting point subject to revisions.

---

This Markdown documentation provides a structured way to describe the `SetSendMailItem` method belonging to the `GameTooltip` class, acknowledging the unknowns while offering a template for documentation practices.

Certainly! Below is an example on how to document the `SetShapeshift` method for the `GameTooltip` class in a README styled documentation, following the format suggested by your TypeScript class definition example.

---

## SetShapeshift
This method is used to show the tooltip for the specified shapeshift form by assigning it to the appropriate slot on the `GameTooltip` object.

### Parameters
- **slot** `number` - The unique slot identifier for the shapeshift form.

### Returns
*Unknown* - The details on the functionality or the return type of this method have not been provided, indicating either a void return, an unspecified type, or that the return type needs further investigation.

### Example Usage:
Below is a simplified example demonstrating how to use the `SetShapeshift` method. This example assumes you have already initialized a `GameTooltip` object and have a valid slot identifier for a shapeshift form.

```typescript
// Assuming `gameTooltip` is an instance of GameTooltip
// and `shapeshiftSlot` is a number representing a valid shapeshift form slot.

gameTooltip.SetShapeshift(shapeshiftSlot);

// At this point, the tooltip should be updated to display information
// regarding the specified shapeshift form. Additional functionality or
// UI updates might be required depending on the context.
```

Note: The actual behavior and context of this method depend significantly on the underlying game mechanics and the related UI systems. Ensure to test the integration thoroughly and handle any game-specific or API-related nuances that may influence how tooltips are managed or displayed for shapeshift forms.

---

This template provides a basic structure for documenting methods, including a brief description, parameter listing, return type information, and a code example for practical usage. While the specifics, like the `Unknown` return type, point towards areas needing further clarification or detail, the outline aims to deliver clear, concise, and useful information to developers working with similar APIs or modding systems.

# SetSpell

The `SetSpell` method displays the tooltip for the specified spell.

## Parameters

- **spellBookId** `number` - The ID of the spell from the tab in the spellbook. Note that this is not the same as the SpellId.
- **bookType** `"pet" | "spell"` - Indicates the type of the spell book. Can be either `BOOKTYPE_SPELL` ("spell") for regular spells or `BOOKTYPE_PET` ("pet") for pet spells.

## Usage

Typically, you would use `SetSpell` when you want to show additional information about a spell in your game's UI. For instance, when a player hovers over a spell icon, you could display a tooltip with details about that spell using this method.

Here's an example of how you might implement this in an AddOn:

```typescript
// Assume gameTooltip is an instance of GameTooltip
declare const gameTooltip: GameTooltip;

// Spell Book ID and Book Type for demonstration
const spellBookId = 118; // Example Spell Book ID for "Polymorph"
const bookType = "spell"; // We're using a spell from the player's spell book

// Hooking up to an event or a specific UI element's hover
// For demonstration, let's pretend we have a function that is called when a spell icon is hovered
function showSpellDetailsOnHover() {
  // Showing the tooltip for Polymorph based on its spell book ID and specifying it's a player spell
  gameTooltip.SetSpell(spellBookId, bookType);

  // Additional logic can be added here, such as positioning the tooltip next to the hovered item
}

// Calling the function to simulate hovering over the spell icon
// In a real scenario, you would link this function to an event listener or a framework's equivalent
showSpellDetailsOnHover();
```

## Notes

- Remember to import and properly initialize any instances or classes required to use the `GameTooltip` class and its methods.
- The `spellBookId` and `bookType` parameters must accurately match existing spells in your spellbook (or your pet's spellbook) to display the correct spell details.
- The `SetSpell` method is particularly useful for creating immersive and informative UIs, as it allows players to easily access spell details directly from your AddOn.

## References

- For more information on working with tooltips and spell details, consult the [World of Warcraft API documentation](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetSpell).
- To better understand the overarching framework in which `SetSpell` operates, familiarize yourself with general WoW AddOn development practices and the UIObject model used for creating UI elements.

Creating documentation for your method based on the guidance provided can be approached as follows. We'll break down the `SetTalent` method's purpose, parameters, return values, and provide an example usage. Remember, the goal is to make the documentation informative and easy to follow for developers who might utilize this in building their AIO plugins. 

---

# GameTooltip.SetTalent

This method is utilized to display a tooltip for a specific talent, given the talent's tab index and its index within that tab. It's a crucial method for AddOns that aim to provide more detailed information about talents directly within the game's UI, enhancing the player's experience by making talent details readily accessible.

### Parameters

- **tabIndex** (`number`): The index of the talent tab. Tabs are indexed starting from 1.
  
- **talentIndex** (`number`): The index of the talent within the specified tab. Talents are also indexed starting from 1.

### Returns

- **Unknown**: The documentation or the official API does not specify what, if anything, this method returns. It's typically used for its side effect of showing a tooltip rather than the value it returns. 

### Example Usage

This example demonstrates how to use the `GameTooltip.SetTalent` method within a World of Warcraft AddOn. Given a talent's tab index and talent index, it will show the tooltip for that talent.

```typescript
// Assuming this code is part of an event handler that reacts to mouseover events on talent icons
function showTalentTooltip(tabIndex: number, talentIndex: number) {
    // GameTooltip is a pre-defined global object in WoW's UI system.
    // First, we prepare the tooltip by clearing any previous information
    GameTooltip:ClearLines();
  
    // Then, we set the tooltip for the talent based on its tab and index.
    GameTooltip:SetTalent(tabIndex, talentIndex);
  
    // Finally, we display the tooltip at the current mouse position.
    GameTooltip:Show();
}

// Example usage for the first talent in the first tab
showTalentTooltip(1, 1);
```

### Notes

- The indexes `tabIndex` and `talentIndex` must accurately refer to a valid talent; otherwise, the tooltip will not display correctly.
- The `GameTooltip` object must be properly initialized and visible for `SetTalent` to function as expected.
- This method is part of the World of Warcraft's UI scripting API, which allows developers to create custom UI elements and interactions within the game.

---

By adhering to this format, you ensure that your documentation is both comprehensive and straightforward, making it a valuable resource for developers working on AIO plugins or similar projects.

Certainly, converting the method description from your given TypeScript format into a markdown documentation for the GameTooltip class can be done as follows:

# GameTooltip Documentation

The `GameTooltip` class provides an interface for manipulating the game's tooltip display. This class includes various methods for setting the tooltip's appearance and content. Below is the documentation for the `SetText` method of the `GameTooltip` class.

## SetText

Sets the content and style of the tooltip text. This method allows for the customization of the tooltip's text color and opacity, along with an option to wrap the text to fit within the tooltip's boundaries.

### Parameters

- **text** (string): The content to display within the tooltip. This can include variable data.
- **red** (number, optional): The red component of the text color, with a valid range between 0 and 1. Default value is not specified by the user.
- **green** (number, optional): The green component of the text color, with a valid range between 0 and 1. Default value is not specified by the user.
- **blue** (number, optional): The blue component of the text color, with a valid range between 0 and 1. Default value is not specified by the user.
- **alpha** (number, optional): The opacity level of the text, with a valid range between 0 and 1. A higher value means less transparency. Default is 1 if not specified.
- **textWrap** (boolean, optional): Determines whether the text should wrap within the tooltip box. `true` enables text wrapping, while `false` (the default) disables it.

### Usage Example

The following example demonstrates how to use the `SetText` method to create a tooltip with custom text content and styling. This tooltip will have a partially transparent blue color and text that wraps within the tooltip boundaries.

```typescript
// Assume 'myTooltip' is a GameTooltip object already initialized elsewhere
const tooltipText = "This is example tooltip text that demonstrates how to use the SetText method.";
const redComponent = 0; // No red component
const greenComponent = 0; // No green component
const blueComponent = 1; // Full blue component
const textOpacity = 0.8; // Slightly transparent
const shouldWrapText = true; // Enable text wrapping

// Set the text of the tooltip with custom styling
myTooltip.SetText(tooltipText, redComponent, greenComponent, blueComponent, textOpacity, shouldWrapText);

// The above code sets a tooltip with blue, slightly transparent text that wraps within the tooltip box.
```

Please be mindful that the appearance will also rely on other styling properties of the `GameTooltip` object, and the actual appearance may vary based on game state and other UI elements.

For more methods and information about handling tooltips within the World of Warcraft API, refer to the official documentation and community resources.

---

Note: Ensure that the `GameTooltip` object is correctly initialized and interacting within the game's UI system. The example provided assumes that the object `myTooltip` has been appropriately established elsewhere in the script or addon code.


Given the template and information you provided, let's create a markdown documentation for the `GameTooltip` class focusing on the `SetTracking` method. This class is an example and might not correspond directly to the existing World of Warcraft API or any modifications.

---

# GameTooltip

The `GameTooltip` class manages the display of tool tips within the game, offering a way to present details about various in-game elements like items, spells, NPCs, etc. It is a core UI component that provides players with context-specific information.

## Methods

### SetTracking

Changes the tracking behavior of the `GameTooltip`.

#### Parameters

- **...args**: `Unknown[]` - The parameters of this function are not clearly defined. It is expected that the function takes an array of arguments, the specifics of which depend on the implementation context within the game.

#### Returns

- `Unknown` - The return value of this method is not specified. It could vary based on what `SetTracking` is designed to do in the game's context.

#### Example Usage

```typescript
// Example of how you might work with GameTooltip's SetTracking method
// Note: This code is based on hypothetical usage scenarios
// and the actual implementation details are unknown.

// Assuming GameTooltip has been instantiated elsewhere as gameTooltip
let args = [/* Custom parameters relevant to tracking behavior */];

// Attempt to modify the tracking behavior of the tooltip
let result = gameTooltip.SetTracking(...args);

// The response of SetTracking is not defined, so handling it
// would be dependent on additional context or documentation.
if (result /* Check result based on expected outcome */) {
  // Handle successful tracking adjustment
} else {
  // Handle tracking adjustment failure or perform fallback
}
```

>Note: Due to the abstract nature of this method and the unknown aspects of its parameters and return type, it's crucial to refer to the implementation details in your specific environment. The above example is a starting point and may require adjustments to fit your application's needs.

---

This documentation follows the template and examples provided, offering a basic structure for documenting a method with unknown parameters and return types within the `GameTooltip` class. Adjustments might be necessary based on further details or specific project requirements.

Based on your example and request, here's how to create markdown documentation for the `GameTooltip` class's method `SetTradePlayerItem` in a similar style:

---

# GameTooltip

`GameTooltip` is a class that provides functionalities to manipulate the game's tooltip display, typically used to show information about different elements in the game like items, spells, NPCs, and others.

## SetTradePlayerItem

This method is used to set the tooltip for an item that the player is trading. The exact parameters and return type are currently unspecified.

### Parameters

- **...args**: `Unknown[]` - The parameters for this method are not fully documented. They are expected to be the details relevant to the item being traded, such as item ID, player identification, or trading session specifics.

### Returns

- `Unknown` - The return type is unspecified, suggesting that the function might modify the tooltip state directly without returning a value, or the exact return details are currently unknown.

### Example Usage

Due to the unspecified nature of the `args` parameter and return type, a general example of using `SetTradePlayerItem` would only serve as a placeholder:

```typescript
// Assuming GameTooltip is an instantiated object of the GameTooltip class
// and that SetTradePlayerItem method takes item details as arguments

// Sample item details placeholder
const itemId = 12345; // Placeholder item ID
const playerIdentifier = "PlayerName"; // Placeholder player name or ID
const tradeDetails = {/* other trade details if any */};

// Setting the game tooltip for a traded item
GameTooltip.SetTradePlayerItem(itemId, playerIdentifier, tradeDetails);

// This example is illustrative and does not represent actual API usage
// due to the lack of specific documentation on the parameters.
```

**Note:** This example is hypothetical and constructed based on the method signature provided. The actual use of `SetTradePlayerItem` requires specific details about the method's parameters that were not provided.

--- 

This markdown documentation follows the structure outlined in your example and aims to offer a similar level of detail and formatting. It interprets the method's usage as per the given signature, despite the lack of specific detail on parameters and return values.

# SetTradeSkillItem

Opens the tooltip window when you hover over items in the tradeskill window. This method is part of the GameTooltip class, which is a UI element that provides detailed information about items, spells, and other entities within the game.

## Parameters

- **tradeItemIndex**: `number` - The index of the selected item in the recipe list.
- **reagentIndex**: `number` (Optional) - Index of the selected reagent.

## Usage

```typescript
declare const GameTooltip: GameTooltip;

// Assuming you have a tradeskill window open with at least one item.
let tradeItemIndex = 1; // This is the first item in your tradeskill list.
let reagentIndex = 1; // This is the first reagent of the selected tradeskill item.

// To show tooltip for the trade item itself without focusing on a specific reagent.
GameTooltip.SetTradeSkillItem(tradeItemIndex);

// To show tooltip for a specific reagent of the selected trade skill item.
GameTooltip.SetTradeSkillItem(tradeItemIndex, reagentIndex);
```

### Detailed Example

Imagine you're developing an addon to enhance the crafting experience in World of Warcraft. One of the features of your addon is to show additional tooltips with useful information when the player hovers over a trade skill item or its reagents. You can use `SetTradeSkillItem` method to accomplish this.

```typescript
// This example assumes you're within the context of a UI frame creation and have access to GameTooltip object.

// First, let's simulate selecting a recipe from the tradeskill window. 
// For example, the user selected the first recipe which has index 1.
let selectedRecipeIndex = 1;

// Hovering over the selected recipe. Display basic information about it.
GameTooltip.SetTradeSkillItem(selectedRecipeIndex);

// The tooltip will automatically show the relevant information since WoW's UI API handles the display 
// details internally. What we do here is simply telling the GameTooltip object what item we're currently interested in.

// Now, let's say the user hovers over the first reagent of that selected recipe.
let selectedReagentIndex = 1;
GameTooltip.SetTradeSkillItem(selectedRecipeIndex, selectedReagentIndex);

// Again, GameTooltip knows how to display all relevant information about the reagent, such as its name, 
// any special properties it might have, etc. Our job as addon developers is to provide the correct indices 
// that represent the player's current interaction in the tradeskill window.

// Remember, for this to work, your addon should have some logic to keep track of the player's interactions 
// (selections) in the tradeskill window. This might involve event handling for mouse hovers, clicks, etc.

/* 
Note: This example is a simplified illustration. Developing a fully functional WoW addon requires knowledge of 
the game's API, event handling, and UI system. Always refer to the official documentation and guidelines provided 
by Blizzard for addon development.
*/
```

## See Also
- [GameTooltip API](http://wowwiki.wikia.com/wiki/API_GameTooltip_SetTradeSkillItem) at Wowpedia - Provides comprehensive details and examples on how to use GameTooltip API for various purposes.

Creating documentation for class methods, particularly for those involved with API or plugin development, such as World of Warcraft AddOns, is crucial for clarity and ease of use by other developers. Below is an example of how to document a class method, `SetTradeTargetItem`, intended for manipulating game tooltips in such AddOns.

### SetTradeTargetItem

This method is utilized to modify the tooltip information for an item that is being offered in a trade from the trade window. It dynamically updates the tooltip based on the item that has been placed into one of the trade slots. This functionality is critical within trade negotiations, providing players with immediate access to item specifics without having to navigate away from the trade window. Despite its backend mechanisms being obscured, the utility in UI interactions and player engagements is undeniable.

#### Parameters

- **...args**: `Unknown[]` - Represents the collection of parameters required by the `SetTradeTargetItem` method. The exact nature of these arguments is not explicitly defined, underscoring the method's adaptability to various item representations or trade states. Given the method's documentational opacity, users are encouraged to experiment with this function to determine the precise nature of required arguments for specific use cases.

#### Returns: `Unknown`

The return type remains unspecified, which either suggests an array of possibilities contingent on the passed arguments or denotes a lack of a tangible return value, focusing instead on the method's side effects on the game interface.

#### Usage Example

Given the abstract nature of the `SetTradeTargetItem` and the unspecified parameters it accepts, constructing a direct example proves challenging. However, a generic template for invoking this method within a WoW AddOn environment might look like the following:

```typescript
declare const gameTooltip: GameTooltip;

// Assume 'itemDetails' is an array holding necessary details about the trade item
const itemDetails: Unknown[] = prepareTradeItemDetails();

try {
  // Dynamically sets the trade target item's tooltip based on 'itemDetails'
  gameTooltip.SetTradeTargetItem(...itemDetails);
  
  console.log("Trade target item's tooltip has been set successfully.");
} catch (error) {
  console.error("Error setting trade target item's tooltip:", error);
}
```

#### Commentary

The `SetTradeTargetItem` method serves as an illustrative example of how advanced interactions within the World of Warcraft UI can be orchestrated, albeit its precise workings demand thorough investigation by the developer. Given the absence of detailed documentation, utilizing this method effectively necessitates a hands-on, exploratory approach, encouraging a deep dive into the contextual use cases within the game's trading system.

This template strives to balance between providing substantial information about the method's use and acknowledging the limitations imposed by undocumented parameters and return types. Such documentation aids developers in integrating advanced features into their AddOns, despite certain ambiguities that might necessitate empirical testing within the WoW environment.

## SetTrainerService

`SetTrainerService` is a method utilized within World of Warcraft's AddOn development to interact with the game's tooltip system, particularly for displaying information related to trainer services. While the specifics of the arguments and return values are not well-documented, this method plays a critical role in customizing how a GameTooltip object presents data about the services offered by NPC trainers in the game.

### Parameters

- `...args` Unknown[] - The arguments are not specifically documented, but they are likely to include identifiers or indices for the particular services offered by a trainer, as well as possibly customization options for how these services are displayed within the tooltip.

### Returns

The return value of this method is not well-documented (`Unknown`). It's possible that it could return a reference to the `GameTooltip` object for method chaining, or it might provide feedback on the success or failure of the operation through boolean values, error codes, or similar means.

### Usage Example:

The following example demonstrates a conceptual usage of the `SetTrainerService` method. Since the specifics of the parameters are unknown, this example serves as a generic illustration meant to guide the actual implementation when the necessary documentation or insight becomes available.

```typescript
// Assuming `GameTooltip` is already correctly instantiated and associated with a UI element.
declare let GameTooltip: GameTooltip;

// Hypothetical function to update a GameTooltip for a specific trainer's service.
// The serviceId represents a unique identifier for a service offered by a trainer.
function updateTrainerServiceTooltip(serviceId: number) {
  // The specifics of what arguments `SetTrainerService` expects are unknown.
  // This example passes a single serviceId which is just a placeholder for
  // whatever actual data the method requires.
  GameTooltip.SetTrainerService(serviceId);

  // Further customization or additional information could be added to the tooltip here.
  // For example, setting the tooltip's position, adding extra text, etc.
  
  // Displaying the tooltip.
  GameTooltip.Show();
}

// Usage of the hypothetical function with a specific service ID.
// Again, the actual implementation details would depend on understanding the required arguments.
updateTrainerServiceTooltip(101); // 101 is a placeholder for an actual trainer service ID.
```

This example is strictly illustrative, emphasizing the need to investigate the specific requirements for `SetTrainerService`'s arguments and how they interact with the World of Warcraft UI and AddOn APIs.

# GameTooltip Documentation

The `GameTooltip` class is an integral part of the World of Warcraft UI API, which allows developers to retrieve and interact with game tooltips. One of the key functionalities provided by this class is the ability to set the tooltip to display information about a specific unit through the `SetUnit` method.

## SetUnit
The `SetUnit` method associates the tooltip with a particular unit, allowing the tooltip to display information (name, level, health, etc.) about that unit. This is especially useful for UI elements like unit frames, where hovering over the frame can show detailed information about the character or NPC.

### Parameters

- **unitId**: `UnitId` - The unique identifier of the unit you want to associate with the tooltip. This can be player, target, party1, raid1target, and so forth.

### Example Usage

Below is an example of how to use the `SetUnit` method in a World of Warcraft addon. This example assumes you are creating a custom frame and want to display a tooltip with information about the player's target when hovering over the frame.

```typescript
const frame = CreateFrame("Frame", "MyCustomFrame", UIParent, "BackdropTemplate");
frame:SetSize(100, 50); // Width, Height
frame:SetPoint("CENTER"); // Place it in the center of the UI
frame:SetBackdrop({
  bgFile: "Interface\\DialogFrame\\UI-DialogBox-Background", 
  edgeFile: "Interface\\DialogFrame\\UI-DialogBox-Border", 
  tile: true, tileSize: 32, edgeSize: 32, 
  insets: { left: 8, right: 8, top: 8, bottom: 8 }
});

// Set up a script to handle the "OnEnter" event for the frame
frame:SetScript("OnEnter", function(self)
  GameTooltip_SetDefaultAnchor(GameTooltip, self); // Position the tooltip
  GameTooltip:SetUnit("target"); // Set the tooltip to display the current target's information
  GameTooltip:Show(); // Show the tooltip
end);

// Set up a script to handle the "OnLeave" event to hide the tooltip
frame:SetScript("OnLeave", function()
  GameTooltip:Hide(); // Hide the tooltip when the mouse leaves the frame
});
```

In this example, a frame is created and positioned at the center of the screen. Event handlers are set up for mouse enter (`OnEnter`) and leave (`OnLeave`) events on the frame. When the mouse enters the frame, the tooltip is anchored to the frame, set up to display information about the player's current target (`"target"`), and shown. When the mouse leaves the frame, the tooltip is hidden.

### API Reference
For more information on working with tooltips and units, refer to the World of Warcraft API documentation:

- GameTooltip API: [GameTooltip](https://wowpedia.fandom.com/wiki/GameTooltip)
- UnitID Documentation: [UnitId](https://wowpedia.fandom.com/wiki/UnitId)

## SetUnitAura

This method is used to display the tooltip for a specific aura on a unit. It's a part of the GameTooltip class, which is responsible for managing the appearance and contents of tooltips in the game interface.

### Parameters
- **unitId**: UnitId - The identifier for the unit whose aura you want to display. This can be a player, NPC, or any entity in the game that can have auras.
- **auraIndex**: number - The index of the aura to show. Auras are indexed starting at 1. To find the correct index for the aura you are interested in, you may need to iterate through the auras on the unit using a function like `UnitAura(...)`.
- **filter**: BuffFilterType (Optional) - A filter to determine which type of auras to show. This can be values like "HARMFUL" for debuffs, "HELP" for buffs, "RAID" for raid-specific auras, etc. If not specified, it defaults to showing all types of auras.

### Returns
- Unknown - The documentation doesn't specify the return type for this method, which implies the primary purpose is to perform an action (showing a tooltip) rather than return information.

### Example Usage:

The following example demonstrates how to use the `SetUnitAura` method within a script to show the tooltip for the first buff on the player character. This script could be part of an addon that aims to provide more information about the auras affecting a unit by hovering over a custom UI element designed to trigger this function.

```typescript
// Assuming this code is part of an addon's script with access to the GameTooltip object

// Define the unit ID and the index for the aura we're interested in
let unitId = "player"; // Targeting the player themselves
let auraIndex = 1; // Assuming we want to display the first aura, index starts at 1
let filter = "HELP"; // Looking for buffs only

// Method to handle showing the aura tooltip
function showAuraTooltip(unitId: string, auraIndex: number, filter?: string) {
  // Check if the GameTooltip object is ready and not already occupied
  if (GameTooltip && !GameTooltip:IsShown()) {
    GameTooltip:SetOwner(UIParent, "ANCHOR_CURSOR"); // Set the tooltip owner and position
    GameTooltip:SetUnitAura(unitId, auraIndex, filter); // Set the tooltip content to the unit's aura
    GameTooltip:Show(); // Display the tooltip
  }
}

// Example usage: Call the function to show the tooltip for the player's first buff
showAuraTooltip(unitId, auraIndex, filter);

// Additional handling could include clearing the tooltip when no longer needed
function clearTooltip() {
  if (GameTooltip) {
    GameTooltip:Hide();
  }
}

// Clear the tooltip when the user moves the mouse away or after a certain action
clearTooltip();

```
In this example, the `showAuraTooltip` function is designed to be triggered by a specific event in your addon, such as mousing over a custom UI element. The function checks if the `GameTooltip` is available and not already showing. It then sets the tooltip owner to the `UIParent` with a cursor anchor, showing the tooltip for the designated aura based on the parameters provided. Lastly, the `clearTooltip` function can be called to hide the tooltip, which might be linked to an event such as the user moving the mouse away.

To document the `SetUnitBuff` method within the `GameTooltip` class in a markdown format, similar to previous examples, here is how you could structure it:

---

## SetUnitBuff
Displays the tooltip for a specific buff on a unit. This is particularly useful for addons that need to provide more information about buffs on characters or NPCs.

### Parameters
- **unitId**: `UnitId` - The identifier for the unit. This can be player, target, party1, etc.
- **buffIndex**: `number` - The index of the buff in the unit's buff list to show in the tooltip.
- **filter**: `BuffFilterType` (optional) - Filters which buffs to consider based on their type; e.g., "HARMFUL" for debuffs or "HELP" for buffs. This parameter behaves the same as in `UnitAura(...)` calls.

### Returns
- `Unknown` - The specific return type is not documented, but it's generally used for interface updates rather than returning data.

### Usage Example
In this example, we're going to show a tooltip for the first buff on the player character that is considered beneficial. This can be useful for addons focused on monitoring player buffs or providing more interactive UI elements related to character status effects.

```typescript
// Assuming you have an instance of GameTooltip already created, named gameTooltip.
// The unit ID is "player" indicating we're looking at buffs on the player character.
// We are interested in the first buff (buffIndex = 1).
// We're filtering for beneficial buffs ("HELP").

gameTooltip.SetUnitBuff("player", 1, "HELP");

// Position the tooltip. Typically this would be anchored to an UI element or mouse position.
gameTooltip.SetOwner(UIParent, "ANCHOR_CURSOR");

// Show the tooltip. This is where the GameTooltip instance actually becomes visible.
gameTooltip.Show();

// This snippet when executed within a World of Warcraft addon's environment would display
// a tooltip corresponding to the player's first beneficial buff, following the mouse cursor.
```

### Notes
- The `SetUnitBuff` method is essentially a wrapper for the World of Warcraft API function with the same name, and its behavior is heavily influenced by the game's client and current UI state.
- The `unitId`, `buffIndex`, and `filter` parameters must match a valid buff on the specified unit for the tooltip to show accurately. Invalid or out-of-range values may result in no tooltip being displayed.
- As this method interacts directly with the game's UI, it's crucial to consider the timing and context of its calls within your addon's lifecycle.

### See Also
- [UnitAura](http://wowpedia.fandom.com/wiki/API_UnitAura) for more details on buff filtering and identification.
- [GameTooltip:SetOwner](http://wowpedia.fandom.com/wiki/API_GameTooltip_SetOwner) for positioning tooltips.

--- 

This format provides a clear and structured documentation of the `SetUnitBuff` method, incorporating usage examples and additional clarifications to assist addon developers in effectively utilizing this functionality within their addons.

# SetUnitDebuff
This method displays the tooltip for a specific debuff applied to a unit. It is a function under `GameTooltip`, which is part of the World of Warcraft API utilized to show data related to objects, units, etc., in-game.

### Parameters
- **unitId**: `UnitId` - The identifier for the unit. This can be a target designation (e.g., "player", "target", "party1", etc.)
- **buffIndex**: `number` - The index of the debuff to be shown. Index starts from 1 for the first debuff applied.
- **filter**: `BuffFilterType` - (Optional) A filter to apply when displaying the debuff. It can be "HARMFUL" for debuffs, "HELP" for buffs, "RAID" for raid-debuff specifics, and other known filters. This parameter aligns with the same filter logic used by `UnitAura(...)`.

### Example Usage:
In the following example, we are attaching a `GameTooltip` to a specific UI frame (here hypothetically named `myFrame`) and then using the `SetUnitDebuff` method to show the first debuff on the player character when the frame is hovered.

```typescript
// Assuming myFrame is an existing UI Frame element
myFrame:SetScript("OnEnter", function(self)
    GameTooltip:SetOwner(self, "ANCHOR_RIGHT");

    // Display the first debuff on the player
    // Here, "player" is the unitId, 1 is the buffIndex for the first debuff, and "HARMFUL" is the filter to show debuffs only
    GameTooltip:SetUnitDebuff("player", 1, "HARMFUL");

    GameTooltip:Show();
});

myFrame:SetScript("OnLeave", function(self)
    GameTooltip:Hide();
});
```

In this example, when a user hovers over `myFrame`, the `GameTooltip` will anchor to the right of this frame and display information about the first harmful effect (debuff) currently on the player. If the player has no debuffs, or if the specific debuff indexed does not exist, the tooltip may show default or no information. When the cursor leaves `myFrame`, the tooltip will hide.

Using `SetUnitDebuff` like this can be especially useful in creating custom UI elements for addons, where showing dynamic information such as debuffs directly on the game interface enhances the user experience and interaction within the game environment.

Below is a markdown documentation example for the `GameTooltip` class method `Show()` based on the provided guidelines and structure. 

---

# GameTooltip Class

`GameTooltip` class provides functionalities to manage game tooltips, which are small UI boxes that provide information about different elements in the game, such as items, spells, or NPCs. 

## Methods

### Show 

Displays the currently configured tooltip on the screen.

#### Signature

```typescript
Show(): void;
```

#### Parameters

None

#### Returns

Void - This method does not return any value.

#### Example Usage

```typescript
// Instantiate or get a reference to a GameTooltip object
const myTooltip = new GameTooltip();

// Set up the tooltip properties like where it should appear, what content it should display, etc.
// Assuming setContent and setPosition are other methods that set content and position of the tooltip
myTooltip.setContent("This is a tooltip text.");
myTooltip.setPosition(100, 200); // x, y coordinates on the user's screen

// Display the tooltip
myTooltip.Show();

// This will show a tooltip at screen coordinates (100, 200) with the text "This is a tooltip text."
```

#### Notes

- The tooltip must be properly configured before calling `Show()`. This includes setting its content, position, and any other relevant properties.
- Calling `Show()` on an improperly configured tooltip may result in unexpected behavior or display issues.
- The tooltip will remain visible until explicitly hidden through a corresponding method, such as `Hide()`, or until it is automatically hidden based on user actions or other in-game events.

---

This documentation aims to capture method functionality in a concise manner, similar to the example provided, giving users clear guidance on how to utilize the `Show` method of the `GameTooltip` class within the game environment.

