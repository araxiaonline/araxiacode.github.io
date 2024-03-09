## CanBeTraded
Determines if the [Item] can be traded to other players. This can be helpful in scripts that need to confirm item tradability, for instance, in loot distribution systems or trade verification processes.

### Returns
boolean - Returns `true` if the [Item] can be traded, `false` otherwise.

### Example Usage
Implementing a system that ensures a specific valuable item can only be looted and then traded to players within a certain level range, to prevent abuse or exploitation of game mechanics. This script checks if the item can be traded before proceeding with the loot distribution logic.

```typescript
const VALUABLE_ITEM_ENTRY = 12345; // Example item entry ID
const MIN_LEVEL = 20; // Minimum player level to trade the item
const MAX_LEVEL = 40; // Maximum player level to trade the item

const OnLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    if (item.GetEntry() === VALUABLE_ITEM_ENTRY && item.CanBeTraded()) {
        const playerLevel = player.GetLevel();

        if (playerLevel >= MIN_LEVEL && playerLevel <= MAX_LEVEL) {
            // Logic to trade the item to the player
            console.log(`Item ${VALUABLE_ITEM_ENTRY} can be traded to ${player.GetName()}.`);
        } else {
            console.log(`Player ${player.GetName()} does not meet the level requirements to trade item ${VALUABLE_ITEM_ENTRY}.`);
        }
    } else {
        console.log(`Item ${VALUABLE_ITEM_ENTRY} cannot be traded.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnLootItem(...args));
```
In this script, after a player loots an item, it checks if the item is the specific valuable item and whether it can be traded. If both conditions are true, it further checks if the player's level is within the specified range. Based on these conditions, it either logs a message indicating that the item can be traded to the player, or it logs a message stating that the player does not meet the requirements to trade the item, or that the item itself cannot be traded.

## ClearEnchantment
This method removes an enchantment from an item at a specified slot. This functionality is particularly useful for customizing items, managing gear sets, or modifying items during debugging or special events.

### Parameters

- **enchantSlot**: number - The slot number where the enchantment to be removed is located.

### Returns

- **success**: boolean - Returns `true` if the enchantment was successfully removed from the item. Returns `false` if the operation failed (e.g., no enchantment in the specified slot).

### Example Usage:

In this example, a script is used to remove enchantments from a player’s weapon during a custom event. The enchantment slot numbers typically range from 0 to 4, with 0 usually representing the primary enchantment. 

```typescript
const CUSTOM_EVENT_ID: number = 123; // Example custom event ID
const WEAPON_ENCHANT_SLOT: number = 0; // Primary enchantment slot

// Event handler for custom item modification event
const onCustomEvent: custom_event_on_item_modify = (event: number, player: Player, item: Item): void => {
    if (event === CUSTOM_EVENT_ID) {
        // Assuming the item is a weapon and the player wants to clear the primary enchantment
        const success = item.ClearEnchantment(WEAPON_ENCHANT_SLOT);
        if (success) {
            player.SendBroadcastMessage("Enchantment successfully removed!");
        } else {
            player.SendBroadcastMessage("Failed to remove enchantment. Ensure the slot is correct.");
        }
    }
};

// Registering the custom event with the appropriate handler function
RegisterPlayerEvent(PlayerEvents.CUSTOM_EVENT_ID, (...args) => onCustomEvent(...args));

```

This script listens for a custom event, `CUSTOM_EVENT_ID`, which triggers the `onCustomEvent` function. When the event occurs for an item (in this scenario, presumed to be a weapon), the script attempts to clear the enchantment in the primary slot. The success or failure of this operation is communicated to the player via a broadcast message.

This example illustrates how to interact with an item's enchantments dynamically, offering customization or adaptation based on gameplay scenarios, helping maintain balance, or providing players with unique experiences during server events.

## GetAllowableClass
Returns a bitmask representing the player classes that are allowed to use the item. Classes not represented by the bitmask will be unable to use the item. Player class codes are defined in the game's core code and database, typically following a pattern where each class is represented by a power of 2 (e.g., Warrior = 1, Paladin = 2, Hunter = 4, etc.).

### Returns
- **classMask**: `number` - A bitmask representing the allowable classes for this item.

### Example Usage:
This script enables a custom item reward behavior where the item can only be rewarded if it's usable by the player's class. This enhances gameplay by ensuring players receive rewards tailored to their class.

```typescript
const CUSTOM_ITEM_ENTRY = 12345; // Example item entry ID

// Player event for item rewards based on class.
const RewardItemIfClassAllowed: player_event_on_level_up = (event: number, player: Player) => {
    let item = CreateItem(CUSTOM_ITEM_ENTRY, player); // Assume CreateItem instantiates an Item object.
    
    let allowableClassMask = item.GetAllowableClass();
    let playerClassMask = 1 << (player.GetClass() - 1); // Convert player's class into a bitmask.

    // Check if the player's class is allowed to use the item.
    if ((allowableClassMask & playerClassMask) !== 0) {
        player.AddItem(CUSTOM_ITEM_ENTRY, 1); // Reward item.
        player.SendBroadcastMessage("Congratulations! You've received a class-specific item reward.");
    } else {
        player.SendBroadcastMessage("This item is not suitable for your class.");
    }
}

// Register the event to trigger on player level up.
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_UP, (...args) => RewardItemIfClassAllowed(...args));
```

In this example, `GetAllowableClass` is used to determine whether an item is suitable for the player based on their class. It makes use of bitwise operations to check if the player's class is included in the allowable classes for the item. This script could be particularly useful in custom quests, events, or loot systems where class-specific rewards are a feature.

## GetAllowableRace
This method returns a bitmask representing the races that are allowed to use the given item. Each bit in the bitmask corresponds to a race as defined in the game. The method is especially useful for scripts or mods that need to enforce item restrictions based on player race.

### Returns 
`number` - A bitmask representing the races allowed to use the item. Each bit in the bitmask corresponds to a specific race. For example, if the bitmask is `3`, it means the first two races in the game's race enumeration can use this item.

### Example Usage: 
The following script example demonstrates how to use the `GetAllowableRace` method to check whether a human (race id 1 in the game's enumeration) can use the item or not. It involves bitwise operations to check if the specific bit related to humans is set in the bitmask returned by `GetAllowableRace`.

```typescript
const HUMAN_RACE_BITMASK = 1 << (1 - 1); // Humans are typically race id 1 in AzerothCore's enumeration, shifting 1 by 0 places.

const CanHumanUseItem = (item: Item): boolean => {
    const allowableRaces = item.GetAllowableRace();
    return (allowableRaces & HUMAN_RACE_BITMASK) !== 0; 
}

const CheckItemForHuman: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    if (player.GetRace() === 1) { // Assuming 1 is the ID for humans
        if (!CanHumanUseItem(item)) {
            player.SendNotification("You cannot use this item due to your race.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CheckItemForHuman(...args));
```

In this script:
- We define `HUMAN_RACE_BITMASK` to correspond to the bitmask value of Humans in the game. We assume 1 as the ID for humans in AzerothCore's enumeration of races, and we use bitwise left shift to set the first bit in our bitmask.
- The `CanHumanUseItem` function uses bitwise AND (`&`) to compare the item's allowable races with the `HUMAN_RACE_BITMASK`. If the result is non-zero, it means the bit for humans is set, and thus humans can use the item.
- In the `CheckItemForHuman` event handler function, we check if the looting player is a human (`player.GetRace() === 1`). If true, we then check if the human can use the looted item by calling `CanHumanUseItem`. If not, we send a notification to the player.

This script is a simple demonstration of how to use the `GetAllowableRace` method to enforce race-based item usage restrictions. Such checks could be essential for custom quests, items, or server rulesets to ensure that certain items remain exclusive to specific races.

# GetBagSize

Returns the bag size of a specified [Item] if it is a bag; otherwise, it returns 0. This method is useful when determining if an item can hold other items, which is essential for inventory management scripts or mods that interact with the player's carrying capacity.

### Returns
* **size**: number - The size of the bag (i.e., how many slots it has). Returns 0 if the item is not a bag.

### Example Usage:

In this example, we'll create a script that checks whether a newly acquired item is a bag. If the item is a bag, it logs the bag size to help with inventory management strategies, such as allocating items to bags with sufficient space or identifying which bags to replace for upgrades.

```typescript
const OnLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    const bagSize = item.GetBagSize();

    // Check if the item is a bag by seeing if the bag size is greater than 0
    if(bagSize > 0) {
        console.log(`Looted a bag with ${bagSize} slots.`);
        // Additional logic to handle the bag, like checking for bag upgrades.
    } else {
        console.log("Looted an item that's not a bag.");
    }
}

// Register the event to trigger the above script when a player loots an item.
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnLootItem(...args));
```
In this script, we're utilizing the `GetBagSize` method to check the item's capability as a container. This method aids significantly in inventory management scripts, where understanding an item's function as a storage unit is vital. It promotes a more interactive and dynamic approach to handling looted or acquired items, enhancing the gaming experience in mods built for AzerothCore using mod-eluna.

# GetBagSlot
This method retrieves the current bag slot number where the [Item] is located. This can be useful for inventory management scripts or functions that require to know in which slot a particular item is positioned within a player's inventory.

### Returns
- `number` - The bag slot number of the item. If the item is not in a bag, returns -1.

### Example Usage:
This script snippet demonstrates how to check the bag slot of a specific item and print a message with the slot number. If the item is not found in any bag slot, it prints a message stating the item is not placed in any bag.

```typescript
const ITEM_ENTRY = 12345; // Example item entry ID

const PrintItemBagSlot: player_event_on_login = (event: number, player: Player) => {
    // Assume the player has the item in their inventory
    const items = player.GetInventoryItems(ITEM_ENTRY);

    if (items.length > 0) {
        const item = items[0]; // Get the first item of the specified entry
        const bagSlot = item.GetBagSlot();

        if (bagSlot !== -1) {
            player.SendBroadcastMessage(`Your item is located in bag slot ${bagSlot}.`);
        } else {
            player.SendBroadcastMessage("Your item is not placed in any bag.");
        }
    } else {
        player.SendBroadcastMessage("You do not have the specified item in your inventory.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => PrintItemBagSlot(...args));
```
In this example, `GetInventoryItems` is a hypothetical function that retrieves a list of items by their entry ID from the player's inventory (this function is not defined in the provided class definitions, so replace it with the correct method to get items by entry ID if needed). The `SendBroadcastMessage` method sends a message visible to the player, informing them of the item's bag slot or if the item isn't located in any bag.

## GetBuyCount
This method returns the default purchase count of the specified item. This is particularly useful when trying to understand the quantity of an item that is bought by default from a vendor in-game. For items that can be purchased from NPCs, this could be used to programmatically verify or utilize the base purchase quantity in scripts or modifications.

### Returns
count: number - The default number of items purchased in a single transaction from a vendor.

### Example Usage:
Let's consider an example where a custom vendor sells exclusive items, and we want to ensure players receive the correct quantity for special items, based on their default buy count. This can be utilized in a function that handles player interactions with this custom vendor.

```typescript
const CUSTOM_ITEM_ENTRY = 12345; // Example Item Entry ID

const onPlayerVendorShow: player_event_on_vendor_show = (player: Player, vendor: Creature) => {
    // Assuming `GetVendorItems` is a hypothetical method returning item entries vendor sells
    const itemsForSale = vendor.GetVendorItems(); 

    // Check if our custom item is part of this vendor's items
    const hasCustomItem = itemsForSale.some(item => item.entry === CUSTOM_ITEM_ENTRY);

    if(hasCustomItem) {
        const customItem = new Item(CUSTOM_ITEM_ENTRY); // Assuming `Item` can be instantiated for the sake of example
        const buyCount = customItem.GetBuyCount();

        // Notify player about the item and its default buy count
        player.SendBroadcastMessage(`Special Offer! Get ${buyCount} units of a unique item from this vendor.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_VENDOR_SHOW, (...args) => onPlayerVendorShow(...args));
```
In this example, when a player interacts with a vendor, it checks if the vendor sells a specific custom item. If the item is available, it retrieves the item's default buy count by using the `GetBuyCount` method. Then, it notifies the player about the special offer including how many units of the item they would receive, enhancing the player's in-game shopping experience. This application can be particularly useful in custom scripts for modified servers where vendors offer unique items or rates.

## GetBuyPrice
This method returns the purchase price of the specified item. The purchase price is the amount of in-game currency (e.g., gold, silver, copper) that a player must pay to acquire the item from an NPC vendor.

### Returns
- `number`: The purchase price of the item in copper units. Note: In AzerothCore, prices are usually represented in copper units, where 100 copper = 1 silver and 10,000 copper = 1 gold.

### Example Usage:
This script allows you to adjust the pricing of items for players based on certain conditions (like being in a guild, having a reputation, or during special events). The idea is to offer discounts or increase prices dynamically.

```typescript
const SPECIAL_GUILD_ID = 1234; // Example guild ID
const DISCOUNT_PERCENTAGE = 10; // 10% Discount

const onItemPurchase: player_event_on_vendor_buy = (event: number, player: Player, item: Item, itemCount: number, vendor: Creature) => {
    let originalPrice = item.GetBuyPrice();
    let finalPrice = originalPrice;

    // Check if the player is in the special guild
    if (player.GetGuildId() === SPECIAL_GUILD_ID) {
        let discount = (originalPrice * DISCOUNT_PERCENTAGE) / 100;
        finalPrice -= discount;
        player.SendBroadcastMessage(`Congratulations! You have received a ${DISCOUNT_PERCENTAGE}% discount on your purchase.`);
    }
    
    // Further logic can be implemented to adjust `finalPrice` based on other conditions

    // Assuming there's a method to adjust the final price (this is a hypothetical example)
    player.AdjustFinalPrice(item, finalPrice); 

    // Note: This is a conceptual example. AzerothCore's actual methods and event triggers might differ.
    // Ensure to check the documentation or source code for precise implementation details.
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_VENDOR_BUY, (...args) => onItemPurchase(...args));
```
This script checks if the player is part of a specific guild and applies a discount to the purchase price of an item. It takes into consideration the original purchase price obtained via `GetBuyPrice()`, calculates a discount, and hypothetically adjusts the final purchase price (note that `AdjustFinalPrice` is used as a conceptual method in this example). The player is notified about the discount through a broadcast message. Remember, this example assumes the existence of certain methods and behaviors for illustrative purposes, and actual implementation may require adapting to the available API in AzerothCore and mod-eluna.

Based on your request, here is the documentation for the `GetClass` method in the `Item` class:

## GetClass
Retrieves the class categorization of the item. Item classes are defined within the game and represent broad categories like weapons, armor, consumables, etc. This can be especially useful for scripts that need to handle items differently based on their type. 

### Returns
classId: number - The numerical identifier for the item's class. This corresponds to values defined in the game's item class enumeration which can be referenced via the core documentation or database definitions.

### Example Usage:
In this example, we're defining a script that awards players with additional points in a custom leveling system anytime they loot an item of the 'weapon' class. The points awarded could be used in a custom vendor or upgrade system.

```typescript
const WEAPON_CLASS_ID = 2; // Assuming '2' represents the 'weapon' class in the game's item class enumeration
const POINTS_PER_WEAPON = 10;

const onItemLooted: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    // Check if the looted item is of the 'weapon' class
    if (item.GetClass() == WEAPON_CLASS_ID) {
        // Award points to the player for looting a weapon
        awardPoints(player, POINTS_PER_WEAPON);
        player.SendBroadcastMessage(`Congratulations! You've earned ${POINTS_PER_WEAPON} points for looting a weapon.`);
    }
}

/**
 * Awards points to a player in a custom leveling or reward system.
 * 
 * @param player - The player to award points to.
 * @param points - The number of points to award.
 */
function awardPoints(player: Player, points: number): void {
    // Implementation for awarding points could involve updating a database or in-memory store.
    console.log(`Awarding ${points} points to player with GUID: ${player.GetGUID()}.`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onItemLooted(...args));
```

This documentation and example provide an actionable and clear method for utilizing the `GetClass` function of an `Item` within the AzerothCore framework and its mod-eluna scripting engine.

## GetCount
Returns the current stack count of the Item. This is particularly useful for managing inventory, batch processing of items, and conditions that depend on the quantity of a specific item in the player's possession.

### Returns
count: number - The stack count of the item.

### Example Usage:
A simple script to check if the player has at least a certain number of a specific item and take action based on the result. In this example, we verify if the player has at least 10 units of an item with entry ID 12345. If so, an action is triggered - for instance, granting a reward, messaging, or starting an event.

```typescript
const ITEM_ENTRY_ID = 12345;
const REQUIRED_COUNT = 10;

const CheckPlayerItem: player_event_on_login = (event: number, player: Player): void => {
    const items = player.GetInventoryItemsByEntry(ITEM_ENTRY_ID);
    let totalCount = 0;
    
    for (let item of items) {
        totalCount += item.GetCount();
    }
    
    if(totalCount >= REQUIRED_COUNT) {
        // Player has the required number of items
        // Trigger your action here. For example:
        player.SendBroadcastMessage("Congratulations! You have enough items."); 
        // Consider adding more actions, such as rewarding the player.
    } else {
        player.SendBroadcastMessage("You don't have enough items. You need " + (REQUIRED_COUNT - totalCount) + " more.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => CheckPlayerItem(...args));
```

The `GetInventoryItemsByEntry` method isn't directly mentioned in the provided class definition but is used here for demonstration purposes, assuming an implementation that retrieves all items of a specified entry from the player's inventory. This code exemplifies a practical use scenario for the `GetCount` method, showcasing its utility in scripts that involve inventory management or conditional actions based on item quantities.

## GetDisplayId
Retrieves the display ID of the item. This can be particularly useful for custom scripts that alter the appearance of items dynamically, or for logging and debugging purposes to ensure the correct items are being manipulated based on their display IDs.

### Returns
displayId: number - The unique display ID of the item.

### Example Usage:
This script demonstrates how to log the display ID of an item when a player loots it. This can be helpful for tracking item usage or for debugging purposes in custom loot distribution systems.

```typescript
const OnItemLoot: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    const itemDisplayId = item.GetDisplayId();
    console.log(`Player ${player.GetName()} looted an item with Display ID: ${itemDisplayId}`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnItemLoot(...args));
```

In this example, every time a player loots an item, the item's display ID is logged to the console. This could be extended to check for specific display IDs to trigger custom effects, grant achievements, or alter item behavior dynamically.

## GetEnchantmentId
Retrieve the enchantment ID associated with a specific slot on the item. Each item can have multiple enchantment slots, where various enchantments with unique IDs can be applied. This function helps identify the specific enchantment applied to a designated slot. 

### Parameters
* enchantSlot: number - The specific slot number on the item from which you wish to retrieve the enchantment ID. Different slots represent different types of enchantments that can be applied to an item.

### Returns
* enchantmentId: number - The ID of the enchantment present in the specified slot or `-1` if no enchantment is found in the given slot.

### Example Usage:
The script below is designed to check if the weapon a player is currently equipped with has a specific enchantment (`Lifestealing Enchantment`, for instance, with an imaginary enchantment ID of `1234`). If the enchantment is found in one of the weapon slots, a special effect is applied to the player.

```typescript
const LIFESTEALING_ENCHANTMENT_ID = 1234;
const WEAPON_SLOT_MAIN_HAND = 15; // Assuming slot `15` is the main hand weapon slot
const WEAPON_SLOT_OFF_HAND = 16; // Assuming slot `16` is the off-hand weapon slot

const onPlayerEquip: player_event_on_equip_item = (event: number, player: Player, item: Item, bagSlot: number, slot: number) => {

    // Check both the main hand and off-hand weapon slots for the enchantment
    if(slot === WEAPON_SLOT_MAIN_HAND || slot === WEAPON_SLOT_OFF_HAND) {

        // Assuming '0' is the slot representing a primary enchantment on the weapon
        // This part might need to be adjusted as per the server's enchanting slot conventions
        const enchantmentId = item.GetEnchantmentId(0);

        if(enchantmentId === LIFESTEALING_ENCHANTMENT_ID) {
            // Apply a special effect because the weapon has the Lifestealing enchantment
            console.log(`Player ${player.GetName()} equipped a weapon with Lifestealing in slot ${slot}. Applying special effect.`);
            // Here, you could call another function or method to apply the specific effect to the player
        } else {
            console.log(`Player ${player.GetName()} equipped a weapon without Lifestealing in slot ${slot}.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => onPlayerEquip(...args));
```

This script could be enhanced to check for multiple enchantments, handle different slots more dynamically, or manage various special effects based on the enchantment found. It's an example of how to utilize `GetEnchantmentId` to trigger gameplay mechanics based on item enchantments.

## GetInventoryType

Returns the inventory type (slot category) of the item. This is useful for determining where an item can be worn or how it can be used. For a more detailed understanding of inventory types, refer to the `InventoryType` definitions in the World of Warcraft API documentation.

### Returns
- **type**: number - The inventory type identifier of the item. For example, `1` for head, `2` for neck, etc. 

### Example Usage
This example script will print the inventory type of a player's currently equipped head item. It demonstrates how to retrieve an item from a specific slot and then use the `GetInventoryType` method to identify its inventory type. This is particularly useful for customizing player gear checks or enhancing UI elements.

```typescript
const PLAYER_SLOT_HEAD: number = 1; // Slot ID for head items

const OnInspectPlayerHead: player_event_on_login = (event: number, player: Player): void => {
    const headItem: Item = player.GetItemBySlot(PLAYER_SLOT_HEAD);
    if(headItem) {
        const inventoryType: number = headItem.GetInventoryType();
        player.SendBroadcastMessage(`Your head item's inventory type is: ${inventoryType}`);
    } else {
        player.SendBroadcastMessage("You have no item equipped in the head slot.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnInspectPlayerHead(...args));
```

The above script should be attached to a player login event listener, where upon each login, it checks the player's head slot for an item. If an item is found, it retrieves and reports the inventory type of that item back to the player through a broadcast message. This example may be adapted to check different item slots or to perform actions based on the type of items a player is wearing or carrying.

## GetItemLevel
Returns the level of the item. This can be useful for scripts that need to check the level of items players are carrying or using, ultimately allowing for more complex interactions based on item level, such as custom rewards or restrictions based on gear level.

### Returns
level: number - The level of the item.

### Example Usage:
A script that provides players with a special reward if they're wielding an item of a certain level or higher. This can be particularly useful for custom events or challenges. 

```typescript
const MIN_ITEM_LEVEL_FOR_REWARD = 200;

const RewardPlayerWithHighLevelGear: player_event_on_equip_item = (event: number, player: Player, item: Item, bagSlot: number) => {

    // Only check the main hand weapon (slot 15) for this example
    if(bagSlot === 15) {
        let itemLevel = item.GetItemLevel();

        if (itemLevel >= MIN_ITEM_LEVEL_FOR_REWARD) {
            // Award the player for having a high-level item equipped
            // This could be a rare item, a title, etc. Depends on your server setup
            player.AddItem(YOUR_REWARD_ITEM_ENTRY, 1);
            player.SendBroadcastMessage("Congratulations! Your high-level gear has earned you a special reward!");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => RewardPlayerWithHighLevelGear(...args));
```

In this example, we're focusing on rewarding players who equip a main hand weapon of a certain item level or higher. The event `PLAYER_EVENT_ON_EQUIP_ITEM` triggers our custom function, which checks if the equipped item in the main hand (bag slot 15) meets the minimum item level requirement for a reward. 

Modify the `MIN_ITEM_LEVEL_FOR_REWARD` and `YOUR_REWARD_ITEM_ENTRY` to fit your server's conditions and rewards. This script encourages players to seek out higher level items for potential rewards, adding an extra layer of engagement with the game's loot system.

## GetItemLink
Generates and returns the chat link of the item in the specified or default locale. This chat link can be used in player chat messages to show details about the item directly in the chat window. Useful for sharing item details with other players or for scripting UI elements that require item information.

### Parameters
* locale?: `LocaleConstant` (optional) - The locale constant to determine the language of the item link. Defaults to `LOCALE_enUS` if not specified.

### Returns
* link: `string` - The generated chat link for the item that can be used in player messages.

### Locale Constants
The method supports the following locale constants for generating the item link in different languages:
```typescript
enum LocaleConstant {
    LOCALE_enUS = 0, // English (United States)
    LOCALE_koKR = 1, // Korean (Korea)
    LOCALE_frFR = 2, // French (France)
    LOCALE_deDE = 3, // German (Germany)
    LOCALE_zhCN = 4, // Chinese (China)
    LOCALE_zhTW = 5, // Chinese (Taiwan)
    LOCALE_esES = 6, // Spanish (Spain)
    LOCALE_esMX = 7, // Spanish (Mexico)
    LOCALE_ruRU = 8  // Russian (Russia)
};
```

### Example Usage:
To share an item link in a global chat or to embed item information within a custom UI element, use the `GetItemLink` method. Below is an example scenario where a player finds a rare item, and a script shares this achievement in the global chat with the item link.

```typescript
// Assuming we have a predefined function to react to an item being looted
const OnItemLooted: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    // Getting the item link in the default English language
    const itemLink = item.GetItemLink(LocaleConstant.LOCALE_enUS);
    
    // Constructing a message to share in global chat
    const message = `${player.GetName()} has found a rare item: ${itemLink}!`;
    
    // Send the message to the global chat (pseudo-function, replace with actual API call)
    SendGlobalMessage(message);
}

// Register the event with the PlayerEvents enum (pseudo-code for registering the event handler)
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnItemLooted(...args));
```
In this script, whenever a player loots an item, the `OnItemLooted` function is triggered. It retrieves the item's chat link in English and constructs a celebratory message that includes the item link. This message is then shared in a global chat channel, allowing other players to see the item's details directly in the chat by clicking on the link.

# GetItemSet

Retrieves the item set ID of the given item. Useful for scripting specific behaviors based on item sets, such as granting bonuses when a player equips multiple items from the same set. The item set IDs can be referenced in the World Database `item_set` table. For more information about item sets and their bonuses, you can find more details here: [AzerothCore item sets](https://www.azerothcore.org/wiki/item_set).

### Returns
`setId`: number - The ID of the item set to which the [Item](./item.md) belongs. If the item is not part of a set, the method returns 0.

### Example Usage:
Grant a special buff to the player if they complete an item set. In this example, a player receives a powerful buff if they equip all items from a fictional item set with the ID of `123`.

```typescript
const ITEM_SET_ID = 123;
const BUFF_ID = 54321; // Fictional buff ID for demonstration

const onItemEquipped: player_event_on_equip_item = (event: number, player: Player, item: Item, bag: number, slot: number): void => {
    // Checking if the equipped item contributes to the target item set
    if(item.GetItemSet() == ITEM_SET_ID) {
        // Check for player's equipped items to see if all items of the set are equipped
        let setItemCount = 0;
        const EQUIPPED_ITEMS = player.GetEquippedItems();
        for (let equippedItem of EQUIPPED_ITEMS) {
            if (equippedItem.GetItemSet() == ITEM_SET_ID) {
                setItemCount++;
            }
        }
        // Assuming the set consists of 4 items - apply buff if all items are equipped
        if(setItemCount == 4) {
            player.AddAura(BUFF_ID, player); // Apply the buff
            player.SendBroadcastMessage("You have equipped all items of the set. Special powers have been granted!");
        } 
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => onItemEquipped(...args));
```
In this example, when a player equips an item, the `onItemEquipped` event handler checks if the item is part of the specified item set. If so, the script counts how many items of the set the player has equipped. If all items of the set are equipped, it grants the player a special buff and sends a message to the player about their newly acquired powers.

## GetMaxStackCount

Returns the maximum number of times an item can stack within a single inventory slot. This might be particularly useful when scripting inventory-related checks or when trying to add items to a player's inventory programmatically.

### Returns

- **maxStackCount**: number - The maximum number of times the item can stack in the inventory.

### Example Usage:

In this example, a custom function is utilized to prevent the automatic addition of items to a player's inventory when the potential new stack would exceed the item's maximum stack count. It checks the player's current amount of the item, determines if adding more would exceed the max stack, and if so, splits the addition into multiple inventory slots if available.

```typescript
function addItemSafely(player: Player, itemEntry: number, amountToAdd: number): void {
    const existingStack = player.GetItemByEntry(itemEntry);
    const maxStack = existingStack.GetMaxStackCount();
    let currentCount = existingStack ? existingStack.GetCount() : 0;
    const spaceNeeded = Math.ceil((currentCount + amountToAdd) / maxStack);

    if (player.GetItemCount(itemEntry) + amountToAdd > maxStack * spaceNeeded) {
        console.log("Not enough space in inventory to add item without exceeding max stack size.");
        return;
    }

    while (amountToAdd > 0) {
        if (currentCount + amountToAdd > maxStack) {
            player.AddItem(itemEntry, maxStack - currentCount);
            amountToAdd -= (maxStack - currentCount);
            currentCount = 0; // Reset for next potential stack.
        } else {
            player.AddItem(itemEntry, amountToAdd);
            break;
        }
    }
}
```

This script ensures that when items are added to a player's inventory, they adhere to the maximum stack count specified for each item, reducing the risk of inadvertently overflowing an inventory slot and potentially losing items due to stack limits. 

Remember, actual behavior might slightly vary depending on the specifics of your AzerothCore server's configuration and the version of mod-eluna you're utilizing. Always test scripts in a controlled environment before deploying them on a live server.

## GetName
Retrieve the name of the item. This method can be especially useful when creating scripts that involve item transactions or logging item-related activities.

### Returns
name: string - The name of the item as defined in the World Database `item_template` table. 

### Example Usage: 
This example demonstrates how to announce the name of a looted item to the whole server. Such a feature might be utilized for broadcasting the loot of rare items, enhancing the community experience.

```typescript
const AnnounceLoot: player_event_on_loot_item = (event: number, player: Player, item: Item) => {

    const itemName = item.GetName();
    const announcement = `${player.GetName()} has looted: ${itemName}!`;
    
    // This fictional function represents a way to announce messages server-wide.
    // The implementation details can vary.
    AnnounceToServer(announcement);

}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => AnnounceLoot(...args));
```
In this example, when a player loots an item, the `AnnounceLoot` function is called. Inside this function, we extract the name of the item using `item.GetName()`. We then construct an announcement string that includes the name of the player (retrieved by a hypothetical `player.GetName()` function for demonstrative purposes) and the name of the item. Finally, we pass this announcement string to a fictional `AnnounceToServer` function, which we are assuming broadcasts the message to all players on the server. This example demonstrates an engaging way to utilize the `GetName` method of the `Item` class to enhance player interaction and engagement on the server.

## GetOwner
Retrieves the [Player](./player.md) instance who currently owns the item in question. This method is handy for identifying which player possesses a specific item, particularly useful in scenarios where item ownership needs to be verified or actions need to be taken based on the owner.

### Returns
Returns the [Player](./player.md) instance who owns the item. This can be used to interact with the player, such as sending notifications, granting additional items or experience, or any other player-specific interactions.

### Example Usage:
Script for rewarding the player with additional experience points upon identifying the owner of a rare item.

```typescript
const RARE_ITEM_ENTRY = 12345; // Placeholder for a rare item entry ID
const XP_BONUS_FOR_RARE_ITEM = 1000; // Experience points to grant

const onItemLooted: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    
    // Ensure the looted item matches the rare item entry ID
    if(item.GetEntry() == RARE_ITEM_ENTRY) {
        const itemOwner = item.GetOwner(); // Retrieves the owner of the item
        
        // Provide additional XP to the owner as a reward
        if (itemOwner) {
            itemOwner.GiveXP(XP_BONUS_FOR_RARE_ITEM);
            itemOwner.SendBroadcastMessage(`Congratulations! You've been awarded an additional ${XP_BONUS_FOR_RARE_ITEM} experience points for looting a rare item.`);
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onItemLooted(...args));
```

This example script demonstrates a scenario where a player loots a rare item, and upon doing so, the script checks the item's ownership. If the player is indeed the owner of the rare item, they are granted additional experience points as a reward. This use of the `GetOwner` method enables a direct and efficient way to enhance player engagement and reward systems based on item interactions.

## GetOwnerGUID
Retrieves the Globally Unique Identifier (GUID) of the owner of the item.

### Returns
No return value (`void`). This implies a potential use case of this method would involve additional steps to retrieve or work with the owner's GUID after it has been obtained.

### Example Usage:

Let's say we want to check if an item's owner is part of a specific Guild, and if so, apply a special effect to them. To do this, we first need to obtain the item owner's GUID using `GetOwnerGUID()`. Note that this example adds hypothetical methods for obtaining a player by their GUID and checking their guild membership for illustrative purposes.

```typescript
// Hypothetical method to get a player object by GUID
function GetPlayerByGUID(guid: string): Player | null {
    // Implementation to retrieve player by GUID
}

// Hypothetical method to check if a player is in a given guild by name
function IsPlayerInGuild(player: Player, guildName: string): boolean {
    // Implementation to check guild membership
}

const CheckItemOwnerGuild: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    // First obtain the item owner's GUID
    const ownerGUID = item.GetOwnerGUID();

    // Then, get the player object using the owner's GUID
    const itemOwner = GetPlayerByGUID(ownerGUID);

    if (itemOwner) {
        // Check if the item's owner is part of the "Elite Raiders" guild
        if (IsPlayerInGuild(itemOwner, "Elite Raiders")) {
            // If so, apply a special effect (hypothetical method)
            ApplySpecialEffectToPlayer(itemOwner);
        } else {
            // Handle case where the owner is not part of the specified guild
            console.log("Item's owner is not part of 'Elite Raiders' guild.");
        }
    } else {
        // Handle case where owner could not be found
        console.log("Item's owner could not be found.");
    }
}

// Registering the event to check the guild membership whenever an item is looted
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CheckItemOwnerGuild(...args));
```

In this example, `GetOwnerGUID()` is used in a more complex logic flow involving player and guild verification. Notice that this showcases how one might use such a method as part of a bigger system, even though the method itself does not return detailed information directly.

# GetQuality

 Retrieve the quality level of an item. Every item in World of Warcraft has an associated quality level that indicates its rarity and overall value. This method accesses that value directly from an item instance. For more detailed information about item quality and what each level represents, you can explore the [Item Quality](https://wowpedia.fandom.com/wiki/Item_quality) on Wowpedia.

### Returns
- **quality**: `number` - Numeric value representing the item's quality. These values correspond to the following qualities:
  - 0: Poor (Grey)
  - 1: Common (White)
  - 2: Uncommon (Green)
  - 3: Rare (Blue)
  - 4: Epic (Purple)
  - 5: Legendary (Orange)
  - 6: Artifact (Golden Yellow)
  - 7: Heirloom (Light Yellow)

### Example Usage:
Below is an example where we check the quality of a looted item and then execute specific logic based on the item's quality. The script prints a congratulatory message if the player loots an item of epic quality or higher.

```typescript
const onLootItem: player_event_on_loot_item =(event: number, player: Player, item: Item) => {
    const itemQuality = item.GetQuality();
    
    // Checks if the looted item is of Epic quality or higher.
    if(itemQuality >= 4) {
        player.SendBroadcastMessage("Congratulations! You've looted an item of Epic or higher quality!");
    }
}

// Registering the event that handles item looting
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onLootItem(...args));
```

In this snippet, the `GetQuality` method is used to retrieve the quality of the item that was just looted. Depending on the quality, it might trigger a congratulatory message for the player, making the moment of acquiring a high-quality item even more special. This example integrates seamlessly with mod-eluna on Azerothcore, allowing for enriched and interactive player experiences based on game events.


## GetRandomProperty

This method retrieves the random property ID assigned to an item. Each item in AzerothCore can have random properties which alter its characteristics. The random property ID corresponds to entries in the `item_random_properties` table of the World Database.

### Returns
- `number` - The random property ID of the item.

### Example Usage

This script example demonstrates how to check the random property of an item a player loots, specifically looking for a certain random property ID. If the item has the desired random property, a special message is logged.

```typescript
const DESIRED_RANDOM_PROPERTY_ID = 123; // Example random property ID

const OnLootRandomPropertyItem: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    let randomPropertyId = item.GetRandomProperty();
    
    if (randomPropertyId == DESIRED_RANDOM_PROPERTY_ID) {
        console.log(`Player ${player.GetName()} looted an item with the desired random property!`);
        // Additional actions could be performed here, such as rewarding the player
    } else {
        console.log(`The looted item does not have the desired random property. ID: ${randomPropertyId}`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnLootRandomPropertyItem(...args));
```

This script can be developed further depending on the server's needs, such as implementing specific actions when an item with the desired property is found, or tracking which players find items with rare properties.

## GetRandomSuffix
This method allows you to retrieve a random suffix for an item if applicable. Suffixes in Azerothcore can modify the name and attributes of an item, making it unique or more powerful. Applying a random suffix can be particularly useful in custom scripts where item variability is desired for quest rewards, loot drops, or other player interactions. 

### Parameters
This method does not require any parameters.

### Returns
This method returns `void`. It is typically used for its side effect rather than its return value. 

### Example Usage:  
In the following example, a custom function is created to award a player with a randomized item upon completing a special event. The `GetRandomSuffix` method is used to ensure the item has a random suffix, adding uniqueness and potential value to the reward.

```typescript
const SPECIAL_ITEM_ENTRY = 12345; // Example item entry ID

const AwardRandomizedSpecialItem: player_event_on_custom_event = (event: number, player: Player) => {
    // Create a new item instance from the item entry
    let specialItem = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
    
    // Apply a random suffix to the item
    if(specialItem) {
        specialItem.GetRandomSuffix();
    }
    
    // Notify the player
    player.SendBroadcastMessage("Congratulations! You've received a special item with a unique trait.");
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CUSTOM_EVENT, (...args) => AwardRandomizedSpecialItem(...args));
```

In this example, assuming that `SPECIAL_ITEM_ENTRY` corresponds to an item in the `item_template` table that supports suffixes, this script would grant players a unique version of the item each time the event is triggered. The use of `GetRandomSuffix` ensures each item awarded could have different attributes, enhancing gameplay variety and player interest.

## GetRequiredLevel
Retrieves the minimum character level required to use the specified item. Ensuring that players meet the necessary level requirements before equipping or using an item is crucial for maintaining game balance and enhancing the gaming experience by setting achievable progression goals.

### Returns
level: number - The minimum level a player needs to reach to be able to use the item.

### Example Usage:
Enforce level requirements for special event items to ensure they are used by the intended level bracket. This example checks if players are eligible to use an event reward item and sends a notification if they don't meet the requirement.

```typescript
const EVENT_REWARD_ITEM_ENTRY = 12345; // Example item entry

const CheckItemLevelRequirement: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() == EVENT_REWARD_ITEM_ENTRY) {
        const requiredLevel = item.GetRequiredLevel();
        if (player.GetLevel() < requiredLevel) {
            player.SendNotification(`You must be at least level ${requiredLevel} to use this item.`);
        } else {
            player.SendNotification(`Congratulations! You can use your event reward item.`);
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CheckItemLevelRequirement(...args));
```

In this script, when players loot an item with the entry ID of `EVENT_REWARD_ITEM_ENTRY`, the script checks if the player's level is less than the required level to use the item. If the player is not of the required level, they are sent a notification stating the level requirement; otherwise, they are congratulated and informed they can use the item. This enhances the gaming experience by providing clear feedback to players about item usage requirements.

## GetSellPrice

Returns the sell price in copper of the [Item].

### Returns
price: number - The sell price of the item in copper.

### Example Usage:

In this example, a script automatically calculates the total sell price of the player's items and prints it to the console. Useful for inventory management or deciding on loots.

```typescript
const CalculateTotalSellPrice: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    let totalSellPrice = 0;

    // Assume getInventoryItems is a function that returns an array of Item objects the player has
    const inventoryItems: Item[] = getInventoryItems(player); 

    for (let item of inventoryItems) {
        totalSellPrice += item.GetSellPrice();
    }

    console.log(`Total sell price of inventory: ${totalSellPrice} copper.`);
}

// Utility function to simulate fetching player's inventory items
function getInventoryItems(player: Player): Item[] {
    // This function is hypothetical and serves as a stand-in for how you might acquire items from a player's inventory.
    // In a real scenario, you would use appropriate methods provided by the mod-eluna API to access a player's inventory.
    return []; // Returning an empty array for the sake of this example.
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CalculateTotalSellPrice(...args));
```

In this script, we introduce a hypothetical `getInventoryItems` function that retrieves a list of `Item` objects from the player's inventory. For each item, we calculate the total sell price by summing up the sell prices of individual items. This total sell price is then logged to the console, giving a quick way to assess the potential gold return from selling all inventory items.

Please note that in a real mod-eluna script, the approach to retrieving a player's inventory items might differ based on the specific methods available within the mod-eluna API for Azerothcore. This example assumes a simplistic approach for illustrative purposes.

# GetSlot

Retrieves the current slot index where the item is located in the player's inventory.

### Returns
slotIndex: number - The index of the slot where the item is found, starting from 0.

### Example Usage:
This snippet ensures that a specific powerful item, identified by its entry ID, is equipped in the correct slot before allowing the player to enter a high-level dungeon. This demonstrates a practical use of `GetSlot` to verify item placement within a player's inventory.

```typescript
const POWERFUL_ITEM_ENTRY_ID = 12345; // Example item entry ID for a powerful item
const REQUIRED_SLOT_INDEX = 15; // Slot index for the main hand weapon

const onPlayerEnterDungeon: player_event_on_map_enter = (player: Player) => {
    const inventory = player.GetInventoryItems();
    
    let isPowerfulItemEquipped = inventory.some(item => {
        return item.GetEntry() === POWERFUL_ITEM_ENTRY_ID && item.GetSlot() === REQUIRED_SLOT_INDEX;
    });
    
    if (!isPowerfulItemEquipped) {
        player.SendNotification("You must equip the Legendary Sword in your main hand to enter this dungeon.");
        // Additional code to prevent entry or teleport out
    } else {
        player.SendNotification("Welcome, warrior. Your equipment is in order.");
        // Proceed with dungeon entry
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP_ENTER, (...args) => onPlayerEnterDungeon(...args));
```

In the example above, a player attempting to enter the dungeon will have their inventory scanned for a specific "Legendary Sword" (a placeholder for the actual item entry ID). This check is done using the `GetSlot` method to ensure not only that the player possesses the item but also that it is equipped in the correct slot (main hand weapon slot in this case). If the item is not equipped properly, the player is notified and could be prevented from entering the dungeon. This approach reinforces the importance of not only having certain items but also their proper use and placement for game mechanics or specific events.

## GetSpellId

This method retrieves the spell ID associated with the item by a specified spell index. Items in AzerothCore can have spells tied to them, such as on-use effects, procs, or other actions that occur under specific circumstances. The spell index refers to the position of the spell in the item's data structure, starting from 0.

### Parameters
- **spellIndex**: number - The index of the spell in the item's spell list.

### Returns
- **spellId**: number - The ID of the spell tied to the item at the specified index.

### Example Usage:
In this example, we implement a function to cast the spell of a specific item that a player has equipped. This can be particularly useful for custom scripts where you want to trigger item effects under custom conditions.

```typescript
const ITEM_SPELL_INDEX = 0; // Assuming we're interested in the first spell of the item

function castItemSpell(player: Player, itemEntry: number): void {
    const item: Item = player.GetItemByEntry(itemEntry);
    if (!item) {
        console.log("The player does not have the specified item.");
        return;
    }

    const spellId: number = item.GetSpellId(ITEM_SPELL_INDEX);
    if (spellId <= 0) {
        console.log("No valid spell found for the specified index.");
        return;
    }

    player.CastSpell(player, spellId, true);
}

// Usage example: Casting an effect of an item a player might have equipped or in inventory.
// Consider itemEntry to be the entry ID of an item with a usable spell effect.
const ITEM_ENTRY_ID = 12345; // Example item ID (replace with an actual item ID)

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (type: number, player: Player) => {
    castItemSpell(player, ITEM_ENTRY_ID);
});
```

In this implementation, we create a utility function `castItemSpell` that a player can trigger, potentially through a custom command or a specific gameplay event. It looks for an item with the given entry ID in the player's inventory. If the item exists, it retrieves the spell ID associated with the item at the specified index (`ITEM_SPELL_INDEX`) and casts that spell on the player.

This technique can be adapted for various gameplay mechanics, such as custom quests, events, or enhancing player interactions with items in unique ways.

## GetSpellTrigger
Retrieve the spell trigger associated with the item based on the specified spell index. 
This method helps in understanding the conditions under which a spell tied to an item is triggered.

### Parameters
* **spellIndex**: number - The index of the spell for which the trigger is to be retrieved. Index usually starts from 0.

### Returns
* **spellTrigger**: number - The trigger condition of the specified spell. Different numbers correspond to different types of triggers, as defined in your server's core documentation or source code.

### Example Usage:
Let's create a script to inform a player about the spell trigger condition of a specific item's spell. This is particularly useful when dealing with items that have multiple spell effects or triggers.

```typescript
const ITEM_ENTRY = 12345; // Example item entry
const SPELL_INDEX = 0; // Typically, the first spell associated with an item is at index 0

const onInspectItem: player_event_on_inspect_item = (player: Player, item: Item) => {
    if (item.GetEntry() == ITEM_ENTRY) {
        const spellTrigger = item.GetSpellTrigger(SPELL_INDEX);
        
        switch(spellTrigger){
            case 0:
                player.SendMessage("This spell is triggered by Use.");
                break;
            case 1:
                player.SendMessage("This spell is triggered on Equip.");
                break;
            case 2:
                player.SendMessage("This spell has a Chance on Hit trigger.");
                break;
            default:
                player.SendMessage("This item's spell trigger is not standard.");
                break;
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_INSPECT_ITEM, (...args) => onInspectItem(...args));
```

This example script can be expanded or refined according to your needs. It provides a basic framework for utilizing the `GetSpellTrigger` method to interact with players about item functionalities in the World of Azeroth. By adjusting the `ITEM_ENTRY` and `SPELL_INDEX`, you can tailor this script to any item and investigate its spell trigger conditions. Remember to consult your server's core documentation for the exact meanings of different spell trigger numeric codes.

# GetStatsCount
Retrieve the number of different stats the item has. This can include stats such as Strength, Agility, Stamina, etc., depending on the item's properties in the World Database's `item_template` table.

### Returns
void - No direct return value since the example provided lacks specific details.

### Example Usage:
The following example assumes you want to check the stats count of a particular item a player receives, possibly to log or implement custom behavior based on the complexity of the item (indicated by the number of stats it possesses).

```typescript
const ItemStatsLogger: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    // Assuming GetStatsCount should return a number rather than void,
    // and it's just an example limitation.
    // This would log the count of stats an item has when a player loots it.
    const statsCount = item.GetStatsCount();

    console.log(`Item ID ${item.GetEntry()} has ${statsCount} stats.`);

    // Custom behavior could be implemented here, such as:
    if (statsCount > 5) {
        console.log("This item is complex and highly valuable!");
        // Additional custom behavior can be implemented based on item complexity.
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => ItemStatsLogger(...args));
```

**Note:** In the given TypeScript class definition, `GetStatsCount()` is specified to return `void`, which doesn't align with its presumed functionality of returning a count value (typically a number). In practical documentation or implementation, the method signature should likely return a `number` instead of `void` to reflect its purpose. The example above is adjusted under the assumption that `GetStatsCount()` should indeed return a number, illustrating how it might be utilized in a scenario where the count of an item's stats is relevant.

## GetSubClass
This method retrieves the subclass of the item. The item subclass represents specific categories within the main item class, providing further distinction. For instance, in weapon items, subclasses define whether an item is a sword, axe, bow, etc. These subclasses are aligned with the `subclass` field within the `item_template` table in the AzerothCore database. More information about subclasses can be explored through the [AzerothCore documentation](https://www.azerothcore.org/wiki/item_template).

### Returns
- `number`: The subclass ID of the item as defined in the database.

### Example Usage
In this example, we check the subclass of a weapon looted by a player to apply a specific effect if it's a sword (subclass ID 0).

First, ensure you have a listener for the player looting an item, then check if the item looted is a weapon. If it is, identify whether its subclass indicates it's a sword. If all conditions are met, apply an effect to the player, such as increasing their experience gain temporarily.

```typescript
const SWORD_SUBCLASS_ID = 0; // Subclass ID for swords
const EXPERIENCE_BUFF_ID = 48406; // Hypothetical buff ID for increased experience gain

const onPlayerLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    // Confirm the item is a weapon by checking its class. For simplicity, let's assume class 2 is Weapons.
    if(item.GetClass() === 2) { 
        // Check if the subclass of the weapon is a sword
        if(item.GetSubClass() === SWORD_SUBCLASS_ID) {
            // Apply a hypothetical effect/buff to the player for looting a sword
            player.AddAura(EXPERIENCE_BUFF_ID, player);
            console.log("Sword looted! Experience gain increased temporarily.");
        }
    }
}

// Register the event listener for PLAYER_EVENT_ON_LOOT_ITEM
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onPlayerLootItem(...args));
```
This script enhancing gameplay by rewarding players who loot specific item types (in this case, swords) aligns with interesting event-driven mechanics that can be implemented in mods for AzerothCore.

## HasQuest
Determines if the item is associated with a specific quest. This is helpful when scripting interactions that depend on whether an item is a quest item.

### Parameters
- **questId:** number - The quest ID to check the item for.

### Returns
- **boolean:** Returns `true` if the Item has the specified quest tied to it, `false` otherwise.

### Example Usage:  
The following script checks if the looted item is part of a quest that requires collection. If so, it logs a message to the server console.

```typescript
const onItemLooted: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    
    const QUEST_ID_NEED_FOR_QUEST = 12345; // Example quest ID
    if(item.HasQuest(QUEST_ID_NEED_FOR_QUEST)) {
        console.log(`Player ${player.GetName()} has looted an item required for their quest.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onItemLooted(...args));
```

In this example, we're enhancing the player's interaction with looted items by providing feedback or altering the game's behavior based on whether the item is associated with an ongoing quest. This can be particularly useful in custom events or scenarios where quest items play a significant role.

This method simplifies quest-related item handling, especially when working with custom quests or adjusting loot tables dynamically. The provided example showcases a basic application within a loot event, but the potential applications can vary widely depending on the script's context within the game.

## IsArmorVellum
Determines if the current item is an Armor Vellum. Armor Vellums are special items that enchanters can use to store armor enchantments for later use or sale. 

### Returns
boolean - Returns `true` if the item is an Armor Vellum, `false` otherwise.

### Example Usage:

A common usage scenario for this could be to create a function that checks if the player has an Armor Vellum in their inventory, and if so, apply an enchantment to it. 

```typescript
const ARMOR_VELLUM_ENTRY = 38682; // Example entry ID for Armor Vellum, this value should be replaced by the actual entry ID from your database.

// Function to check if the player has an Armor Vellum in their inventory
function checkAndEnchantArmorVellum(player: Player, enchantmentId: number): void {
    const playerItems = player.GetInventoryItems(); // Assuming GetInventoryItems() is a method that retrieves all items in a player's inventory

    for (const item of playerItems) {
        if (item.GetEntry() === ARMOR_VELLUM_ENTRY && item.IsArmorVellum()) {
            // Logic to apply enchantment to the vellum
            console.log(`Enchantment ${enchantmentId} applied to Armor Vellum!`);
            return;
        }
    }

    console.log("No Armor Vellum found in the inventory.");
}

// This event hook could be placed somewhere in your mod where it makes sense to trigger this check. 
// Example: When player obtains a new item or interacts with something specific.
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_RECEIVE_ITEM, (player: Player) => {
    const ENCHANTMENT_ID = 54321; // Example enchantment ID, this should be replaced with actual id
    checkAndEnchantArmorVellum(player, ENCHANTMENT_ID);
});
```

This script attempts to find an Armor Vellum item in the player's inventory. If found, it "applies" an enchantment specified by `enchantmentId` to the vellum. This example doesn't cover the actual application of an enchantment, as that process depends on external systems and the specifics of mod-eluna and AzerothCore configurations. It's meant to illustrate how the `IsArmorVellum` method can be integrated into a larger gameplay mechanic.

## IsBag
Checks whether the item is a type of bag or not.

### Returns
boolean: 'true' if the [Item] is considered a bag, 'false' if it's not a bag.

### Example Usage:
Before equipping an item or adding it to a special inventory slot, it's useful to verify if the item is a bag. This is crucial for inventory management systems or automatic gear equipping scripts where bags should be handled differently from other types of items.

```typescript
const PLAYER_EVENT_ON_EQUIP_ITEM: number = 29; // This is a made up event for demonstration, replace with the actual event ID for equipping items.

const onEquipItem: (player: Player, item: Item) => void = (player, item) => {
    if (item.IsBag()) {
        console.log("The item trying to be equipped is a bag.");
        // Additional logic for handling bag items
        // Maybe move it to a bag-specific inventory slot, or alert the player, etc.
    } else {
        console.log("The item trying to be equipped is not a bag.");
        // Proceed with regular item equipping logic
    }
};

RegisterPlayerEvent(PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => onEquipItem(...args));
```

In this example, when a player attempts to equip an item, it first checks if the item is a bag. Depending on the result, it can execute different logic paths, such as managing inventory slots specific to bags or alerting the player. This approach is beneficial for creating more intuitive and error-free player interactions with their inventory.

## IsBoundAccountWide
Determines if the given item is bound to the account, meaning it can be accessed by other characters within the same account. Useful for checking the tradability and sharing of items across characters.

### Returns
boolean - Returns `true` if the item is account bound, `false` otherwise.

### Example Usage:
This script checks if a recently looted item is account bound. If it is, a message is sent to the player congratulating them. This could be part of a larger function to handle account-wide achievements or rewards.
```typescript
const CheckItemBoundStatus: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    if (item.IsBoundAccountWide()) {
        player.SendAreaTriggerMessage("Congratulations! Your looted item is account bound and can be shared with your other characters.");
    } else {
        player.SendAreaTriggerMessage("This item is character-specific and cannot be shared with your other characters.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CheckItemBoundStatus(...args));
```
This example script can be easily integrated into existing systems to provide clear feedback to players about the items they acquire, enhancing their understanding and planning for character development and item management.

## IsBoundByEnchant
Determines if an item is bound to a player as a result of an enchantment. Binds from enchantments are typically a result of certain enchanting procedures that make the item specifically attached to the player, preventing other players from using or picking up the item.

### Returns 
boolean: Returns `true` if the item is bound to a player by an enchant, `false` otherwise.

### Example Usage:  
This script checks if a player's equipped item is bound by enchantment when trying to trade it, and cancels the trade if the condition is true. This can be useful in preventing accidentally trading items that are personally enchanted and bound.

```typescript
const CancelTradeIfItemEnchanted: player_event_on_trade = (eventId: number, player: Player, tradeId: number) => {
    const trade = player.GetTrade();
    
    if (trade) {
        for (let i = 0; i < trade.GetItemCount(); i++) {
            const item = trade.GetItem(i);
            if(item.IsBoundByEnchant()) {
                player.SendMessageBox(`You cannot trade ${item.GetName()} as it is bound to you by an enchant.`);
                trade.Cancel();
                return;
            }
        }    
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_TRADE, (...args) => CancelTradeIfItemEnchanted(...args));
```
The above example begins with a function `CancelTradeIfItemEnchanted` that is called during the `PLAYER_EVENT_ON_TRADE` event. Inside, it checks each item in the ongoing trade for a bound by enchant condition using `IsBoundByEnchant()`. If any item returns true, indicating it is enchanted and bound to the player, the trade is canceled, and the player gets a warning message explaining why the trade was blocked.

Such precautions ensure that items which have been specifically enchanted to be bound to a player are not accidentally or inadvertently traded away, keeping personalized or valuable enchantments safe.

# IsBroken

Checks if the [Item](./item.md) is broken. In the context of AzerothCore and mod-Eluna, an item is considered broken if its durability has reached 0, meaning it cannot be used until it's repaired.

### Returns
*boolean* - Returns `true` if the item is broken (durability = 0), otherwise returns `false`.

### Example Usage:

This script demonstrates how to check if the player's equipped items are broken upon logging in, notifying the player if any of their gear needs repair.

```typescript
const onPlayerLogin: player_event_on_login = (event: number, player: Player): void => {
    const EQUIPMENT_SLOTS = 19; // Total number of equipment slots in WoW
    
    for (let i = 0; i < EQUIPMENT_SLOTS; i++) {
        const item = player.GetEquippedItemBySlot(i);
        if (item && item.IsBroken()) {
            player.SendNotification("One or more of your items are broken! Visit a repair NPC.");
            break; // Exit loop after finding the first broken item
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onPlayerLogin(...args));
```

In this script, we iterate through all possible equipment slots of a player when they log in. For each slot, we check if there is an item equipped and whether that item is broken using the `IsBroken` method. If a broken item is found, a notification is sent to the player advising them to repair their gear. The script then exits the loop to prevent spamming the player with multiple notifications if they have more than one broken item equipped.

## IsConjuredConsumable
Determines if the item is a conjured consumable or not. Conjured consumables are items that are generally created by spells or abilities, such as a Mage's ability to conjure food and water for consumption.

### Returns
`boolean` - Returns 'true' if the item is a conjured consumable product, 'false' otherwise.

### Example Usage:
This example script identifies conjured consumable items a player tries to use and sends a custom notification to the player.

```typescript
const onItemUse: player_event_on_use_item = (event: number, player: Player, item: Item): void => {

    if(item.IsConjuredConsumable()) {
        player.SendNotification("You are about to use a conjured consumable item!");
    } else {
        player.SendNotification("This item is not a conjured consumable.");
    }

}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => onItemUse(...args));
```

In this script, the `onItemUse` function is registered to the *PLAYER_EVENT_ON_USE_ITEM* event, ensuring it runs whenever a player uses an item. Inside the function, it checks if the used item is a conjured consumable by calling the `IsConjuredConsumable` method on the `item` object. Depending on the result, it sends a notification to the player using `SendNotification`.

This method can help in creating gameplay mechanics or features that rely on identifying whether an item is conjured, allowing for unique interactions or checks within a game's world facilitated by the mod-eluna environment on AzerothCore.

## IsCurrencyToken
Determines if the item is considered a currency token within the game. Currency tokens are typically used for transactions and purchases without being a traditional currency like gold. This method can be useful for scripts that need to differentiate between regular items and currency tokens, such as custom vendors or loot distribution systems.


### Returns
`boolean` - Returns `true` if the [Item](./item.md) is a currency token, `false` otherwise.

### Example Usage
In this example, we create a custom event where the player interacts with a specific object in the game world, let's say a custom NPC or object that represents a special vendor. When the player interacts with this entity, we check the player's inventory for a specific currency token item to determine if they can access special merchandise or rewards. 

```typescript
const SPECIAL_CURRENCY_ID = 12345; // This should be replaced with the actual Item entry ID of the currency token.

const OnSpecialVendorInteraction: player_event_on_gossip = (event: number, player: Player, object: GameObject) => {
    // Loop through the player's items
    for(let bagSlot = 0; bagSlot < MAX_PLAYER_BAG_SLOTS; bagSlot++) {
        const item = player.GetItemByPos(INVENTORY_SLOT_BAG_0, bagSlot); // INVENTORY_SLOT_BAG_0 represents the player's main bag.
        if(item !== null && item.GetEntry() == SPECIAL_CURRENCY_ID) {
            if(item.IsCurrencyToken()) {
                // The item is a currency token, proceed with the special interaction
                player.SendMessage("You have the special currency token! Access granted.");
                // Insert logic here for what happens next, such as opening a custom vendor list
                return;
            }
        }
    }

    // If the loop completes without finding the currency token, or it's not a currency token
    player.SendMessage("You do not have the required currency token.");
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP, (...args) => OnSpecialVendorInteraction(...args));
```

In this example, `MAX_PLAYER_BAG_SLOTS` represents a placeholder for the actual maximum number of slots in a player's bag, and `INVENTORY_SLOT_BAG_0` represents the main inventory bag. This script initializes upon a specific gossip event with an NPC or object. It iterates through the player’s bag slots, checking for an item with the specified ID. If the item exists and `IsCurrencyToken` returns true, it proceeds with the custom logic, such as granting access to special items or bonuses. If the currency token isn't found or doesn't meet the criteria, the player receives a message indicating the lack of required currency token.

## IsEquipped
This method determines whether the item is currently equipped by the player. It returns `true` if the item is equipped, otherwise `false`.

### Returns
- **boolean**: A boolean value indicating whether the item is equipped (`true`) or not (`false`).

### Example Usage:
This script checks whether the specified item is equipped by the player. If the item is equipped, it executes further actions such as enhancing the item's capabilities or integrating with other custom logic tailored for your AzerothCore mod environment.

```typescript
// Example Item Entry for Thunderfury, Blessed Blade of the Windseeker
const THUNDERFURY_ENTRY = 19019;

const OnPlayerEquip: player_event_on_equip_item = (event: number, player: Player, item: Item, bag: number, slot: number): void => {
    
    // Check if the equipped item is Thunderfury
    if (item.GetEntry() === THUNDERFURY_ENTRY) {
        
        // Check if Thunderfury is actually equipped to prevent unnecessary checks
        if (item.IsEquipped()) {
            console.log("Thunderfury, Blessed Blade of the Windseeker is equipped!");

            // Custom logic goes here, for example, applying an extra buff
            player.AddAura(22888, player); // Assuming 22888 is a custom buff for demonstration

            // Further custom logic can be added here
            // This could involve interacting with other parts of the player's state,
            // mod functionality, or triggering other events
        }
    }
}

// Registering the hook for the player equip item event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => OnPlayerEquip(...args));
```

In this example, when a player equips an item, the `OnPlayerEquip` function is triggered. It first checks if the equipped item is Thunderfury by comparing the item's entry ID. If it is Thunderfury and is confirmed to be equipped through the `IsEquipped` method, the script logs a message and applies a hypothetical buff to the player. This is a fundamental demonstration; however, the actual implementation can include more complex logic, such as integrating with custom systems or applying conditions based on the player's state.

## IsInBag
Determines whether the item is currently stored in a player's bag.

### Returns
boolean: Returns `true` if the item is in a bag, `false` otherwise.

### Example Usage:
This script checks if a specific item is in the player's bag and informs the player about it. Useful for quests or events that require players to gather specific items.

```typescript
const ITEM_ENTRY_ID = 12345; // Example Item Entry ID

const CheckItemInBag: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    // Check if the looted item is the one we're interested in
    if(item.GetEntry() == ITEM_ENTRY_ID) {
        // Now that we found the item, let's check if it's in the player's bag
        if(item.IsInBag()) {
            // Inform the player
            player.SendBroadcastMessage("You have the required item in your bag.");
        } else {
            player.SendBroadcastMessage("You found the item, but it's not in your bag yet. Make sure to store it properly!");
        }      
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CheckItemInBag(...args));
```
In this example, when a player loots an item, it checks if the item's entry ID matches the specified `ITEM_ENTRY_ID`. If it does, it then checks if the item is in the player's bag using the `IsInBag` method. Depending on the outcome, it sends a message to the player either acknowledging the item is properly stored in their bag or reminding them to put it in their bag.

## IsInTrade

Checks whether the item is currently being traded. It enables scripts to identify if an item is in the middle of a trade process, providing a way to prevent specific actions, or to log or manage trading behaviors in custom ways.

### Returns
- **isTrading**: boolean - Returns `true` if the item is currently in a trade window, `false` otherwise.

### Example Usage
Below is an example script to prevent an item with a specific entry ID from being traded if it meets certain conditions. It could be part of a larger system to log attempts to trade rare or unique items, or to enforce game rules around the trading of specific items.

```typescript
const ITEM_NOT_TRADEABLE_IF_EQUIPPED_ENTRY_ID = 12345; // Example item entry ID

// Hook into the trading system to check for item trade attempts
const onAttemptToTrade: player_event_on_attempt_trade = (event: number, player: Player, item: Item): void => {
    
    // Check if the item being traded matches our specific criteria
    if(item.GetEntry() == ITEM_NOT_TRADEABLE_IF_EQUIPPED_ENTRY_ID && item.IsEquipped()) {
        if(item.IsInTrade()) {
            player.SendNotification("This item cannot be traded right now.");
            CancelTrade(); // Hypothetical function to cancel the ongoing trade
        }
    }
}

// Register the event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ATTEMPT_TRADE, (...args) => onAttemptToTrade(...args));
```

In this example, the script adds a layer of control over the trading process of items by employing the `IsInTrade()` method from the `Item` class. If the item in question matches certain criteria (in this case, being a specific item and currently equipped), the trade attempt can be intervened with a notification to the player, and the operation could be cancelled. This pattern enables the creation of complex trade validation logic, enhancing the game's integrity or customizing the trading experience according to server rules or gameplay mechanics.

## IsLocked
This method checks if the player's selected item is locked or not. 

### Returns
bool: boolean - Returns `true` if the [Item](./item.md) is locked, and `false` otherwise.

### Example Usage
The following script is used to check if the player's currently equipped weapon is locked, and if so, it sends a warning message to the player. This can be useful for ensuring players are aware of their item's status or for implementing custom gameplay mechanics around item locking.

```typescript
const CheckWeaponLockStatus: player_event_on_equip_item = (event: number, player: Player, item: Item, bag: number, slot: number): void => {
    // Assuming the weapon is equipped in the main hand slot (slot 15)
    if (slot === 15) {
        if (item.IsLocked()) {
            player.SendBroadcastMessage("Your weapon is currently locked and cannot be used.");
        } else {
            player.SendBroadcastMessage("Your weapon is unlocked and ready for battle.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => CheckWeaponLockStatus(...args));
```
In this example, the `CheckWeaponLockStatus` function is hooked to the `PLAYER_EVENT_ON_EQUIP_ITEM` event. Every time a player equips an item, this function checks if the item equipped in the main hand (slot 15) is locked. Depending on the item's lock status, it sends a message to the player informing them about the state of their weapon.

Remember, in AzerothCore mod-eluna, specific slot indexes are used to identify where an item is equipped. In this example, slot 15 represents the main hand weapon slot. This script ensures that players are fully aware of the operability of their main weapon, enhancing gameplay integrity and immersion.

## IsNotBoundToPlayer
Determines if the item is not currently bound to the specified player. Item binding is a common mechanic in MMORPGs which restricts the transferability of items to other players after being equipped or picked up. This method allows for checking the item's binding status in relation to a given player.

### Parameters
* player: [Player](./player.md) - The player to check the item's binding status against.

### Returns
* boolean - Returns `true` if the item is not bound to the player, otherwise returns `false`.

### Example Usage
In this example, before allowing a player to trade an item, we check if the item is not bound to them. This could be part of a larger trading system within a custom mod for AzerothCore using mod-eluna. This system might include additional checks for item conditions such as durability, level requirements, or special status (e.g., quest items).

```typescript
// Function to initiate a trade between two players for a specific item
const initiateTrade: trade_event_on_trade_attempt = (event: number, sender: Player, receiver: Player, item: Item): void => {
    // Check if the item is not bound to the sender
    if (item.IsNotBoundToPlayer(sender)) {
        // Further code to handle item trade logistics
        console.log(`Item can be traded from ${sender.GetName()} to ${receiver.GetName()}.`);
        // Example code to physically transfer the item could go here
    } else {
        // Inform the sender the item cannot be traded as it's bound to them
        console.log(`Item is bound and cannot be traded.`);
        sender.SendNotification(`You cannot trade bound items.`);
    }
};

// Registering the custom trade attempt event with a hypothetical trade event listener
RegisterTradeEvent(TradeEvents.TRADE_EVENT_ON_TRADE_ATTEMPT, (...args) => initiateTrade(...args));
```

In this example, when a trade is attempted, it checks whether the item involved is bound to the sender. If the item is not bound, a message is logged to the console (presumably for debugging purposes or could be replaced with actual trade logic), and if it is bound, it informs the sender that the item cannot be traded. This helps ensure the game's item trading rules are respected, adding an extra layer of depth to player interactions and the virtual economy.

## IsNotEmptyBag
Determines whether the item is a bag that contains any items. Useful for validating inventory before performing operations that rely on empty or non-empty bags.

### Returns
- `boolean`: Returns `true` if the item is a bag and it is not empty, `false` otherwise.

### Example Usage:
This script checks if a specific bag in the player's inventory is not empty and sends a notification message to the player. This could be part of a larger inventory management system or a pre-check before an action that requires an empty bag.

```typescript
const CHECK_BAG_SLOT = 19; // Example bag slot ID

// Function to check and notify about bag status
const NotifyIfBagNotEmpty: player_event_on_login = (event: number, player: Player): void => {
    const bagItem: Item = player.GetItemByPos(255, CHECK_BAG_SLOT);
    
    if (bagItem && bagItem.IsNotEmptyBag()) {
        player.SendBroadcastMessage("The specified bag is not empty. Please empty your bag before proceeding.");
    } else {
        player.SendBroadcastMessage("Your bag is empty or not a bag. You can proceed.");
    }
}

// Register the event for player login to run the bag check
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => NotifyIfBagNotEmpty(...args));
```

In this example, `player.GetItemByPos(255, CHECK_BAG_SLOT)` is a fictional method assumed to retrieve an item based on its bag (255 for the main backpack) and slot position. Replace it with the actual method you would use to access an item in the player's inventory in your environment.

The example demonstrates a basic utility operation where the status of a player's bag might influence gameplay or system logic, serving as a template for more complex inventory interactions or checks.

## IsPotion
This method determines whether the Item instance is classified as a potion within the game. A potion typically refers to a consumable item that players can use to gain buffs, heal, or perform other specific functions. This method is essential for scripts that need to handle potions differently from other types of items. 

### Returns
boolean: Returns `true` if the Item is a potion; otherwise, returns `false`. 

### Example Usage:
The following script checks if an item looted by the player is a potion. If it is, the script grants the player an additional potion of the same type, simulating a "loot bonus" effect for potions.

```typescript
const POTION_BONUS_EVENT: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    
    // Check if the looted item is a potion
    if(item.IsPotion()) {
        // Get the entry ID of the potion
        const potionEntryId = item.GetEntry();
        
        // Grant the player an additional potion of the same type
        player.AddItem(potionEntryId, 1);  
        
        // Optionally, inform the player about the bonus potion
        player.SendBroadcastMessage(`You've received a bonus potion for looting a potion!`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => POTION_BONUS_EVENT(...args));
```
In this example, the `IsPotion` method is used to verify whether the item that triggered the `PLAYER_EVENT_ON_LOOT_ITEM` event is a potion. If the verification returns `true`, the script proceeds to give the player an additional potion of that type. Additionally, a broadcast message is sent to the player to inform them about the bonus potion received. This illustrates a creative way to enhance the gaming experience by rewarding players for looting specific types of items.

## IsSoulBound
Checks if the item is soulbound. Soulbound items are bound to the player and cannot be traded or sold to other players.

### Returns
* boolean - `true` if the item is soulbound, `false` otherwise.

### Example Usage:
Script to check if a recently looted item is soulbound and notify the player.

```typescript
const onLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    if (item.IsSoulBound()) {
        player.SendBroadcastMessage(`The item [${item.GetEntry()}] is soulbound.`);
    } else {
        player.SendBroadcastMessage(`The item [${item.GetEntry()}] is not soulbound, you can trade or sell it.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onLootItem(...args));
```

This script hooks into the `PLAYER_EVENT_ON_LOOT_ITEM` event to check every item a player loots. If the item is found to be soulbound, it notifies the player with a message that the item cannot be traded or sold. Otherwise, it informs the player that the item is not soulbound, indicating that it can be freely traded or sold.

## IsWeaponVellum
Checks if the item is a Weapon Vellum. Weapon Vellums are consumable items that players use to store enchantments for later application to weapons.

### Returns
boolean - Returns `true` if the item is a Weapon Vellum, `false` otherwise.

### Example Usage:

This function could be particularly useful in a scenario where you want to apply a specific action based on whether the item is a Weapon Vellum or not. For example, you might have a custom script that rewards players with enchantments but wants to ensure the player is using a Weapon Vellum.

```typescript
const OnItemReceive: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    // Check if the looted item is a weapon vellum
    if (item.IsWeaponVellum()) {
        // Assume we have a function that logs a special event when weapon vellums are looted
        LogSpecialEvent(player, item);
        player.SendBroadcastMessage("You've looted a Weapon Vellum! Make sure to use it wisely.");
    } else {
        player.SendBroadcastMessage("This item is not a Weapon Vellum.");
    }
}

// Register the loot event to trigger our custom Weapon Vellum check
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnItemReceive(...args));

function LogSpecialEvent(player: Player, item: Item): void {
    // Implementation of logging or handling the special event
    console.log(`Player ${player.GetName()} looted a Weapon Vellum.`);
}
```

The example illustrates how you might use the `IsWeaponVellum` method in a practical scenario within a mod for mod-eluna on AzerothCore. By identifying whether an item is a Weapon Vellum, you can trigger specific in-game events, notifications, or logging for further interaction or statistical analysis.

## SaveToDB
This method saves the state of the [Item] to the database. This is particularly useful for preserving changes to an item's state, such as ownership, enchantments, or quantity adjustments. This ensures that any modifications made to an item during runtime are retained across server restarts or player logouts, contributing to a consistent and continuous gameplay experience.

### Example Usage:
In this script, we automatically add a custom enchantment to a newly looted item and then save the item's state to the database to ensure the enchantment is retained.

```typescript
const ENCHANTMENT_ID = 333; // Example enchantment ID
const ITEM_ENTRY = 12345; // Example item entry

const AddEnchantmentAndSave: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    if(item.GetEntry() == ITEM_ENTRY) {
        // Simulate adding an enchantment to the item
        // Assuming AddEnchantment is a method that adds an enchantment to the item
        // This is a fictional example for demonstration purposes
        item.AddEnchantment(ENCHANTMENT_ID, 0); 

        // Save the item's state to the database
        item.SaveToDB();

        // Inform the player
        player.SendBroadcastMessage("A custom enchantment has been added to your item, and its state has been saved!");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => AddEnchantmentAndSave(...args));
```

In this sample, a custom function `AddEnchantmentAndSave` is registered to run whenever a player loots an item (`PLAYER_EVENT_ON_LOOT_ITEM`). When the looted item matches the specified `ITEM_ENTRY`, a fictional `AddEnchantment` method is called to simulate adding an enchantment to the item. Immediately following this alteration, `SaveToDB` is invoked to persist the item's modified state to the database. This ensures that the enchantment and any other changes remain attached to the item, even if the player logs out or the server restarts. The player is also notified via a broadcast message about the enchantment addition and the item's preservation.

## SetBinding

This method sets the binding status of an `Item`. By setting binding to 'true', the item becomes soulbound to the player and cannot be traded. Setting it to 'false' will make the item unbound, allowing it to be traded or sold. This method is particularly useful in custom scripts where certain items' binding statuses need to be dynamically altered based on specific conditions or events.

### Parameters
- setBinding: boolean - Determines the binding state of the item. `true` for soulbound and `false` for unbound.

### Example Usage:

In this example, we are rewarding a player with a special item when they complete a custom event. This item is initially not soulbound to allow the player a chance to trade or sell it. However, if the player equips the item, it will become soulbound to prevent it from being traded after use.

```typescript
const SPECIAL_ITEM_ENTRY = 12345; // Example item entry ID

const RewardItem: player_event_on_custom_event = (event: number, player: Player) => {
    // Add the special, initially unbound item to the player's inventory
    const item = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
    item.SetBinding(false);
}

const OnPlayerEquip: player_event_on_equip_item = (event: number, player: Player, item: Item, bag: number, slot: number) => {
    // Check if the equipped item is the special item
    if(item.GetEntry() == SPECIAL_ITEM_ENTRY) {
        // Make the item soulbound when equipped
        item.SetBinding(true);

        player.SendBroadcastMessage("Your special item has now become soulbound!");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CUSTOM, (...args) => RewardItem(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => OnPlayerEquip(...args));
```

In this script, the `RewardItem` function is called to reward a player with a special item that is not initially soulbound, allowing them the freedom to trade or sell the item if they decide not to use it. The `OnPlayerEquip` function listens for an event where the player equips an item. If the equipped item matches the special item's entry ID, it calls `SetBinding(true)` on the item to make it soulbound, and informs the player with a broadcast message. This ensures the item can be freely traded until it is consciously used by the player, at which point it becomes bound to them.

## SetCount

This method updates the stack count of the given [Item] in the player's inventory. It is particularly useful when managing items programmatically, for instance, in custom quests or events where the quantity of an item needs to be adjusted according to gameplay events. 

### Parameters
- `count`: number - The new stack count for the [Item]. Setting this to zero effectively removes the item from the player's inventory.

### Example Usage:
Let's say we want to create a system where a player can exchange a certain number of tokens for a reward. After the exchange, we need to update the quantity of the spent tokens in the player's inventory. Below is an example script that reduces the number of tokens by a fixed amount after an exchange action. 

```typescript
const TOKEN_ITEM_ENTRY = 12345; // Example Item Entry ID for a 'Token' item.
const TOKENS_NEEDED_FOR_EXCHANGE = 10;

// Function to handle the token exchange process.
const onExchangeTokens: some_event = (player: Player): void => {
    const tokens = player.GetItemByEntry(TOKEN_ITEM_ENTRY);
    
    if (tokens) {
        const currentTokenCount = tokens.GetCount();
        
        // Check if the player has enough tokens for the exchange
        if (currentTokenCount >= TOKENS_NEEDED_FOR_EXCHANGE) {
            // Reduce the tokens by the required amount for the exchange
            tokens.SetCount(currentTokenCount - TOKENS_NEEDED_FOR_EXCHANGE);
            
            // Reward the player, handle other parts of the exchange process here.
            // For example: player.AddItem(REWARD_ITEM_ENTRY, 1);
            
            player.SendBroadcastMessage("Exchange successful.");
        } else {
            player.SendBroadcastMessage("You do not have enough tokens for this exchange.");
        }
    } else {
        player.SendBroadcastMessage("You do not have any tokens.");
    }
}

// Register the custom function to some event, depending on when you want the token exchange to happen.
// Example: RegisterPlayerEvent(PlayerEvents.CUSTOM_EVENT_ON_TOKEN_EXCHANGE, onExchangeTokens);
```

This script showcases how to use the `SetCount` method to decrease the quantity of a particular item in the player's inventory. It first checks if the player owns the item and has enough quantity for the exchange. Then, it updates the item's quantity accordingly. This example can be modified to fit various gameplay mechanics involving items and their quantities.

## SetEnchantment
This method applies a specified enchantment to the item within a defined slot. It's commonly used to enchant gear pieces in-game, providing various enhancements to the player's abilities or stats. Enchantment IDs correspond to the specific abilities or boosts they provide, while the slot indicates where on the item the enchantment is applied.

### Parameters
- `enchantId`: number - The ID of the enchantment to apply. Refer to the enchantment definitions in the AzerothCore database for the correct IDs.
- `enchantSlot`: number - The slot number where the enchantment will be applied. Each item has a specific set of slots available for enchanting.

### Returns
- `result`: boolean - Returns `true` if the enchantment was successfully applied, `false` otherwise.

### Example Usage:
Boost a player's weapon by applying a Crusader enchantment when they reach a certain level. Crusader is known for its healing effect and strength increase, making it a valuable enchant for leveling players.

```typescript
const CRUSADER_ENCHANT_ID = 20034; // Example enchantment ID for Crusader
const WEAPON_SLOT = 0; // Assuming 0 is the main weapon slot

const onPlayerLevelUp: player_event_on_level_change = (event: number, player: Player, oldLevel: number, newLevel: number): void => {
    // Check if the player has reached level 60
    if (newLevel === 60) {
        const playerWeapon = player.GetEquippedItemBySlot(WEAPON_SLOT); // Retrieves the item in the weapon slot
        
        // Ensure the player has a weapon equipped in the designated slot
        if (playerWeapon) {
            const enchantApplied = playerWeapon.SetEnchantment(CRUSADER_ENCHANT_ID, WEAPON_SLOT);
            
            if (enchantApplied) {
                player.SendBroadcastMessage("Your weapon has been enchanted with Crusader!"); // Notify the player
            } else {
                player.SendBroadcastMessage("Failed to apply Crusader enchantment. Please check your weapon and try again.");
            }
        } else {
            player.SendBroadcastMessage("You need to have a weapon equipped to receive the Crusader enchantment.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => onPlayerLevelUp(...args));
```

This script checks for the player's level upon leveling up; if they've reached level 60, it attempts to apply the Crusader enchantment to their main weapon slot. It notifies the player about the success or failure of the operation. Note that the actual enchantment ID, weapon slot, and event hook should be adjusted to fit your server configuration and needs.

## SetOwner
Assigns ownership of the item to the specified player. The owner of an item is able to utilize or interact with the item within the game.

### Parameters
- player: [Player](./player.md) - The player to set as the item's owner.

### Example Usage:
The following script sets a recently looted item's owner to the player who looted it. This can be useful for tracking item ownership for custom events or mechanics.

```typescript
const onItemLooted: player_event_on_loot_item = (event: number, player: Player, item: Item): void => {
    // Sets the player as owner of the looted item
    item.SetOwner(player);

    // Optionally, you could have a message or a log here
    // e.g., console.log(player.GetName() + " is now the owner of the item " + item.GetEntry());
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => onItemLooted(...args));
```

In this example, the script is intended to be used within a larger system leveraging the mod-eluna framework on Azerothcore. The `SetOwner` method facilitates a fundamental aspect of player-item interaction by ensuring that items are associated with their rightful owners, which can be pivotal for both gameplay mechanics and administrative purposes.

