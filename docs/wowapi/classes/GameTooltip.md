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

