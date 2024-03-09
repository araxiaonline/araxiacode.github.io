## GetByteValue

Extracts a byte value at a specified index and offset within the `EObject`, casting the result to an unsigned 8-bit integer. This function is particularly useful for accessing raw data of game objects in a detailed manner, allowing for advanced manipulation and inspection based on the data's storage sequence.

### Parameters
* `index`: number - The starting point within the data structure from where you want to begin reading.
* `offset`: number - The offset (in bytes) from the specified index, determining the exact byte to be read and returned.

### Returns
* `value`: number - The value of the byte at the given index and offset, represented as an unsigned 8-bit integer.

### Example Usage:

In this example, we're assuming an enhanced scenario where players can have custom attributes or states defined in their data, perhaps for a modded server feature. Let's say at data index `5`, we have custom bytes that represent various custom states (for simplicity, we'll say each byte at this index could represent a different state, such as invisibility, invulnerability, etc.). Using the `GetByteValue` method, we want to check if a player has a specific state enabled - invisibility in this case, hypothetically stored in the second byte at index `5`.

```typescript
// Define constants for readability
const CUSTOM_STATE_INDEX = 5; // Hypothetical index for custom states
const INVISIBILITY_OFFSET = 1; // Assuming invisibility state is stored as the second byte at the custom state index

// Function to check if a player is invisible based on the custom attribute
function checkPlayerInvisibility(player: EObject): boolean {
    const invisibilityByte = player.GetByteValue(CUSTOM_STATE_INDEX, INVISIBILITY_OFFSET);

    // Assuming a nonzero value indicates the state is active
    return invisibilityByte !== 0;
}

// Sample usage within an event where you might need to check a player's invisibility state
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_TARGETED, (event: number, player: EObject) => {
    if(checkPlayerInvisibility(player)) {
        // Handle scenario where player is invisible
        console.log("Player is currently invisible!");
    } else {
        console.log("Player is visible.");
    }
});
```

In the function `checkPlayerInvisibility`, we directly utilize the `GetByteValue` method to obtain the specific byte that indicates whether the invisibility state is active for the player. Based on the obtained value, the function returns true (for invisible) or false (for visible), which could then influence how the player is interacted with in various game scenarios.

# GetEntry

This method retrieves the unique entry ID associated with an object. It's important to note that *Players* do not have an "entry" in the same way other entities, such as NPCs or Items, do within the game. This method is particularly useful when trying to distinguish between different types of entities or when specific actions need to be taken based on the object's entry ID.

### Returns

- **entry:** number - The entry ID of the object. For Players, this method does not apply.

### Example Usage:

This example demonstrates how to check the entry ID of an item a player loots to trigger a special event if the item matches a certain entry ID.

```typescript
const SPECIAL_ITEM_ENTRY = 12345; // Example entry ID for a special item

const CheckSpecialItemLoot: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    if(item.GetEntry() === SPECIAL_ITEM_ENTRY) {
        // Execute special event, like giving the player a buff or starting a quest.
        console.log("Special item looted! Starting special event...");
        // Example: StartSpecialEventForPlayer(player);
    } else {
        console.log("Regular item looted. Carry on!");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => CheckSpecialItemLoot(...args));
```

In this script, the `GetEntry` method is utilized to check if the item looted by the player matches a specific entry ID we are interested in. Upon matching, it could trigger additional actions like granting the player a unique buff, starting a quest, or any special event associated with that item. This approach allows for a dynamic way to create interactions based on item loot events while still being general enough to be applied to various scenarios where an Object's entry ID is crucial.

## GetFloatValue
Retrieves a specific float value from an `EObject` based on the specified index. 
This method is essential for accessing various float-type data embedded within objects.

### Parameters
* `index`: number - The index at which the float value is stored. 

### Returns
* `number` - The floating-point value retrieved from the specified index of the `EObject`.

### Example Usage: 
Monitor a player's swimming height to trigger specific events when they reach a certain depth. This could be used to simulate underwater pressure effects or unlock underwater secrets when a player reaches a specific depth.

```typescript
const PLAYER_SWIM_DEPTH_EVENT = 25; // Custom event ID
const SWIM_DEPTH_INDEX = 3; // Hypothetical index where swim depth is stored
const CRITICAL_DEPTH = 50.0; // Example depth at which an event is triggered

// Function to check player's depth and react appropriately
const checkSwimDepth = (player: Player): void => {
    let eObject: EObject = player; // Assuming player extends EObject in this context
    let currentDepth = eObject.GetFloatValue(SWIM_DEPTH_INDEX);
    if(currentDepth >= CRITICAL_DEPTH) {
        triggerDeepDiveEvent(player);
    }
}

// Function to handle what happens when the critical depth is reached
const triggerDeepDiveEvent = (player: Player): void => {
    // Custom logic for handling the event, e.g., applying effects, sending notifications, etc.
    console.log(`Player ${player.GetName()} has reached a critical depth of ${CRITICAL_DEPTH} units.`);
    // You can apply effects like pressure, grant achievements, or unlock secrets here.
}

// Register the custom event
RegisterPlayerEvent(PLAYER_SWIM_DEPTH_EVENT, (...args) => checkSwimDepth(...args));
```
In this example, the `checkSwimDepth` function retrieves the player's current swim depth using the `GetFloatValue` method of the `EObject` (assumed here to be inherited by the `Player` class). When a player reaches or exceeds a critical depth, the `triggerDeepDiveEvent` function is called to manage the scenario, such as applying effects, granting achievements, or revealing underwater secrets.

This approach allows for a dynamic interaction with players based on their in-game behavior, especially for games or mods that feature detailed environmental interactions.

## GetGUID
This method retrieves the Global Unique Identifier (GUID) of an object. A GUID is a unique identifier that differentiates each entity in the game world. It is essential to note the GUID's uniqueness may vary depending on the core used by the server. For instance, on MaNGOS and cMaNGOS, creatures and game objects may share the same GUID if they are in different maps, but this is not possible within the same map. Conversely, on TrinityCore, each GUID is unique across all maps, ensuring each entity is distinct regardless of its location.

### Returns
guid: number - The numerical GUID of the object.

### Example Usage:
This example demonstrates retrieving the GUID of a creature and logging it. It might be particularly useful for debugging purposes or when you want to perform specific actions based on the unique identifier of entities in the game world.

```typescript
const OnCreatureInteract: creature_event_on_click = (event: number, creature: Creature, player: Player): void => {
    const creatureGuid = creature.GetGUID();
    console.log(`Creature GUID: ${creatureGuid}`);

    // Example conditional action based on GUID
    if (creatureGuid === someSpecificGuid) {
        // Perform specific actions, like starting a quest or triggering an event
        player.StartQuest(QUEST_ID);
    }
}

RegisterCreatureEvent(CREATURE_ID, CreatureEvents.CREATURE_EVENT_ON_CLICK, (...args) => OnCreatureInteract(...args));
```
In this sample script, when a player interacts with a specific creature, its GUID is retrieved and logged. Additionally, a conditional check is performed to see if the creature's GUID matches a predefined GUID, `someSpecificGuid`, to perform further custom actions such as starting a quest. This approach allows mod developers to implement functionality that reacts dynamically to interactions with unique entities in the game world.

## GetGUIDLow

Returns the low-part of the [Object]'s GUID, which is essential for unique identification across various instances or maps depending on the core used (TrinityCore, MaNGOS, or cMaNGOS).

### Returns
* **lowGuid**: number - The low part of the GUID for the object.

### Understanding GUIDs
For TrinityCore servers, each object of the same type has a distinct low GUID. This is particularly important for objects in instances, where new GUIDs are generated with each Map creation. Conversely, MaNGOS and cMaNGOS maintain unique low GUIDs on the same map rather than across all instances. Therefore, identifying an object like a creature in these environments requires knowing both the instance ID and its low GUID.

### Example Usage:
This script demonstrates how a developer might log the low GUID of an object, which could be a creature or player, to potentially track or reference it later uniquely.

```typescript
// Registers an event that triggers when a creature or object is interacted with.
RegisterGameObjectEvent(GAME_OBJECT_EVENT_ON_GOSSIP_HELLO, (event: number, player: Player, gameObject: GameObject): void => {
    const objectLowGuid = gameObject.GetGUIDLow();
    console.log(`GameObject with low GUID: ${objectLowGuid} interacted by ${player.GetName()}.`);
    
    // Additional logic here to handle interactions based on the object's low GUID.
});

// Another example focusing on creature interaction
RegisterCreatureEvent(CREATURE_EVENT_ON_DAMAGE_TAKEN, (event: number, creature: Creature, attacker: Unit, damage: number): void => {
    const creatureLowGuid = creature.GetGUIDLow();
    console.log(`Creature with low GUID: ${creatureLowGuid} took damage from ${attacker.GetTypeName()}. Damage: ${damage}`);
    
    // This could be useful for tracking damage to specific instances of creatures across different map instances.
});
```
In these examples, `gameObject.GetGUIDLow()` and `creature.GetGUIDLow()` are utilized to fetch the low GUIDs of various entities. This demonstrates how to uniquely identify and interact with different objects across server instances, pivotal for developing mods or scripts that depend on object identification in AzerothCore mods using Eluna.

# GetInt32Value

Retrieves the data located at the specified index and casts it to a signed 32-bit integer. This can be particularly useful when dealing with game objects or units' statuses, values, or identifiers that are stored as integers.

### Parameters

- `index`: number - The index position from which the integer value needs to be retrieved.

### Returns

- `value`: number - The data at the specified index, casted to a signed 32-bit integer.

### Example Usage:

Imagine a scenario where you need to check if an environmental object (like a chest or a door in a game) is locked or unlocked based on a status value stored in its properties. The status values could be set in a way where `0` represents "unlocked" and any non-zero value represents different locked states. Let's see how `GetInt32Value` can help in determining the lock state:

```typescript
const LOCK_STATUS_INDEX = 10; // Hypothetical index for lock status
const OBJECT_ID = 12345; // Example object ID for a specific game object

// Event listener for when a player interacts with an object
const onObjectInteract: game_event_on_object_interaction = (event: number, player: Player, object: EObject): void => {
    // Ensure the object is the specific object we're interested in
    if(object.GetEntry() == OBJECT_ID) {
        const lockStatus = object.GetInt32Value(LOCK_STATUS_INDEX);

        if(lockStatus == 0) {
            player.SendMessage("The object is unlocked!");
        } else {
            // Handle different locked states, for simplicity we're just informing it's locked
            player.SendMessage("The object is locked with status: " + lockStatus.toString());
        }
    }
}

// Register the event listener for object interaction
RegisterGameObjectEvent(OBJECT_ID, GameEvents.GAME_EVENT_ON_OBJECT_INTERACTION, (...args) => onObjectInteract(...args));
```

In this script, we define a listener for when a player interacts with a game object. When the interaction happens with our specific object of interest (identified by `OBJECT_ID`), we use `GetInt32Value` to retrieve the lock status from the object. Depending on the value, we send a message to the player indicating whether the object is locked or unlocked. This utility can be extended to a variety of game scenarios where object properties need to be quickly assessed and acted upon.

## GetScale
This method is used to retrieve the scale or size of the Object. It is applicable to WorldObjects, which include creatures, game objects, and other entities present in the game world. However, it is important to note that items do not have a "scale" property and therefore, this method will not affect them.

### Returns
* **scale**: number - The scale/size value of the Object. This is a numerical value representing how large or small an object appears in the game world.

### Example Usage:
Below is an example script that adjusts the scale of a creature based on certain conditions. If the creature is a dragon, it makes it larger; otherwise, it reduces the size.

```typescript
// Define constants for creature IDs to check against
const DRAGON_CREATURE_ID = 100; // Example creature ID for a dragon
const DEFAULT_SCALE = 1; // Default scale for most creatures
const DRAGON_SCALE = 3; // Increased scale for dragons

// Event handler for when a creature spawns.
const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    // Check if the creature is a dragon
    if (creature.GetEntry() == DRAGON_CREATURE_ID) {
        // Increase the scale for dragons
        creature.SetScale(DRAGON_SCALE);
    } else {
        // Set default scale for non-dragon creatures
        creature.SetScale(DEFAULT_SCALE);
    }
}

// Register the event handler for the CREATURE_EVENT_ON_SPAWN event
RegisterCreatureEvent(DRAGON_CREATURE_ID, CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```
In this script, when a creature spawns, it checks if the creature is a dragon by comparing its entry ID with a predefined constant `DRAGON_CREATURE_ID`. If it matches, it increases the creature's scale using the `SetScale` method with the `DRAGON_SCALE` value. For all other creatures, it resets their scale to the default value using `DEFAULT_SCALE`. This allows for dynamic adjustments of creature sizes based on their type, enhancing the gameplay experience or meeting specific scripting needs.

## GetTypeId

This method retrieves the `TypeId` of the Eluna `Object`, which helps in identifying the type of the Eluna `Object` instance in a broader enumeration. Each type in the enumeration corresponds to a different kind of entity in the World of Warcraft game. 

### Returns
`number` - The integer value representing the type id of the object. The possible `TypeID` values are documented as:
- `TYPEID_OBJECT`: 0
- `TYPEID_ITEM`: 1
- `TYPEID_CONTAINER`: 2
- `TYPEID_UNIT`: 3
- `TYPEID_PLAYER`: 4
- `TYPEID_GAMEOBJECT`: 5
- `TYPEID_DYNAMICOBJECT`: 6
- `TYPEID_CORPSE`: 7

### Example Usage:

Let's set up a scenario in which you would like to print the `TypeId` of various game entities to understand what type of entity you are interacting with. This might be especially useful inside generic handlers or when dealing with an array of different kinds of `Object`.

```typescript
// Generic handler for when any entity is clicked
const onEntityClicked: entity_event_on_click = (/* event parameters, usually includes the entity */ entity: EObject): void => {

    const typeId = entity.GetTypeId();

    console.log("Clicked entity TypeID:", typeId);

    // Example of using the typeId to perform specific logic based on the type of entity
    switch (typeId) {
        case 0:
            console.log("This is a base Object.");
            break;
        case 1:
            console.log("This is an Item.");
            break;
        case 3:
            console.log("This is a Unit.");
            break;
        case 4:
            console.log("This is a Player.");
            // Perform player-specific logic
            break;
        default:
            console.log("This is a different type of entity.");
    }
}

// Example of registering the event - the actual syntax for registration will depend on the system/framework in use
RegisterEntityEvent(/* appropriate event identifiers */, (...args) => onEntityClicked(...args));
```

### Notes:
- Understanding the `TypeId` of an object is critical for performing type-specific logic in your scripts.
- The `GetTypeId` method allows for efficient type checks and is integral in many systems within mod-eluna scripts. 
- Always ensure you compare the `TypeId` with the documented enum values for predictable behavior.

## GetUInt16Value
Retrieves the data located at the specific index and offset within an EObject, casted to a signed 16-bit integer. This is particularly useful when you need to extract a precise 16-bit piece of data from a larger structure, such as an entity's properties in AzerothCore's database.

### Parameters
- **index**: number - The index in the EObject where the desired data begins.
- **offset**: number - The offset within the 32-bit block at the specified index to retrieve a 16-bit value. For example, to get the second 16-bit value, you would use an offset of 1.

### Returns
- **value**: number - The data at the specified index and offset, casted to a signed 16-bit integer.

### Example Usage
Suppose you have an EObject representing some entity in the game where each index contains a 32-bit block of information. This example demonstrates how to retrieve the second half-word from the 10th index, which could contain important entity attributes like health, mana, or custom server-defined properties.

```typescript
const exampleObject: EObject = new EObject();

// Function to process entity attributes
function processAttributes(eObject: EObject): void {
    const INDEX = 10; // Assuming the 10th index holds the entity's attributes in 32-bit format
    const OFFSET = 1; // To get the second half-word of the 32-bit block

    let entityAttribute = eObject.GetUInt16Value(INDEX, OFFSET);

    console.log(`Entity Attribute at index ${INDEX} with offset ${OFFSET}:`, entityAttribute);
    // Additional logic to utilize the entityAttribute value can be placed here
}

// Example usage of processAttributes
processAttributes(exampleObject);
```
In this scenario, by calling `GetUInt16Value(10, 1)`, you're effectively retrieving the second 16-bit segment from a 32-bit block located at index 10 of the `EObject`. This can be incredibly valuable when working with custom scripts or mods in AzerothCore, especially in complex systems where entities have numerous attributes stored in a condensed format.

## GetUInt32Value

This method retrieves data from an object based on the specified index and casts it to an unsigned 32-bit integer. This can be especially useful when you need to access specific information about game objects, players, units, etc., where the data is stored in a structured manner, and each index corresponds to different pieces of information.

### Parameters

* **index**: number - The index at which the data is stored. Each index corresponds to different data, depending on the object.

### Returns

* **value**: number - The data stored at the specified index, casted to an unsigned 32-bit integer.

### Example Usage:

In this example, we will use the `GetUInt32Value` method to retrieve a player's level, assuming the level is stored at index 1 (Note: The actual index might differ; this is just for demonstration purposes).

```typescript
const PlayerLevelIndex = 1; // Hypothetical index where player's level is stored

const GetPlayerLevel: modPlayerEvent = (player: Player): void => {
    // Retrieve the player's level using GetUInt32Value
    let playerLevel = player.GetUInt32Value(PlayerLevelIndex);
    
    console.log(`Player Level: ${playerLevel}`);
    // Additional logic based on player level can be added here
}

// Register the event for when player information needs to be displayed or checked
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => GetPlayerLevel(...args));
```

This script snippet demonstrates how to retrieve and log the player's level on login. It showcases the practical use of the `GetUInt32Value` method in accessing specific data associated with an object within the AzerothCore framework and the mod-eluna scripting engine.

## GetUInt64Value

Retrieves stored data at the given index and returns it as an unsigned 64-bit integer. This method is particularly useful when interacting with game entities where properties are identified by their index, providing a way to access various entity attributes efficiently.

### Parameters 
- **index**: number - The index identifying the data to be retrieved.

### Returns 
- **value**: number - The data at the specified index, cast to an unsigned 64-bit integer.

### Example Usage:  
Scenario: Increasing a player's gold based on an item's sell price by retrieving its value from the database index.

Let's assume we have an item with the database index for its sell price. Using `GetUInt64Value`, we can fetch the sell price directly and then adjust the player's gold accordingly.

```typescript
const ITEM_SELL_PRICE_INDEX = 9; // Hypothetical index for item sell price
const GOLD_ADDED_PER_ITEM_SELL_PRICE = 100; // Hypothetical conversion rate

const AdjustPlayerGoldBasedOnItem: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    // Obtain the item's sell price
    const itemSellPrice = item.GetUInt64Value(ITEM_SELL_PRICE_INDEX);

    // Convert item sell price to additional gold for the player
    const additionalGold = itemSellPrice * GOLD_ADDED_PER_ITEM_SELL_PRICE;

    // Assuming a method exists to add gold to player
    player.ModifyGold(additionalGold); 

    console.log(`Added ${additionalGold} gold to player based on item's sell price.`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => AdjustPlayerGoldBasedOnItem(...args));
```
In this example, whenever a player loots an item, the `AdjustPlayerGoldBasedOnItem` function retrieves the item's sell price using `GetUInt64Value` with the specified index. It then calculates the additional gold to be added to the player's total based on a hypothetical conversion rate and adds it to the player's gold. This showcases how `GetUInt64Value` can be used in gameplay scripting to enhance player experience by dynamically adjusting game parameters based on item attributes.

Based on the provided examples, here is the markdown documentation for the `HasFlag` method of the `EObject` class.

## HasFlag
This method checks if the specified flag is set on the object. It can be used to verify various states or conditions of game entities facilitated by flags. 

### Parameters
* `index`: number - The index where the flag is stored. This could be tied to specific characteristics or states.
* `flag`: number - The specific flag to check for within the given index.

### Returns
boolean - Returns `true` if the flag is set, otherwise `false`.

### Example Usage:
In this example, we will check if a creature has a specific flag that enables a certain behavior or feature. Assuming `CREATURE_FLAG_UNK1 = 1` represents a hypothetical flag.

```typescript
const CREATURE_FLAG_UNK1 = 1;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    // Assuming `0` is an index where certain creature flags are stored
    if (creature.HasFlag(0, CREATURE_FLAG_UNK1)) {
        console.log("Creature has the special flag set!");
        // Additional logic can be implemented here, knowing the flag is set
    } else {
        console.log("Creature does not have the special flag set.");
    }
}

RegisterCreatureEvent(YOUR_CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this scenario, upon the spawning of the creature, it checks for a flag at index `0`. This logic enables developers to execute specific code based on whether the condition (the flag being set) is met. This functionality is critical for dynamic game behavior and conditions that depend on various states of game entities.

It is important to note that the `index` and `flag` values are highly dependent on the implementation details of the game's engine and scripts. Therefore, the selection of these values must align with the documented or known flag storage strategy within the game architecture.

# IsInWorld
Checks whether the [Object] is currently in the world map.

This method is critical for ensuring that operations are only performed on objects that are actively part of the game world, such as players, items, or creatures. Performing actions on objects not in the world can lead to unexpected behavior or errors. 

### Returns
- `boolean` - `true` if the [Object] is in the world, otherwise `false`.

### Example Usage:
The following script demonstrates how to use the `IsInWorld` method to check if a player is in the world before attempting to add an item to their inventory. This ensures that the operation only proceeds if the player is actively part of the game world. 

```typescript
// Define the item entry for a reward item
const REWARD_ITEM_ENTRY = 19019; // Thunderfury, Blessed Blade of the Windseeker

/**
 * Rewards a player with a specific item if they are in the world.
 * @param player - The player to reward the item to.
 */
function rewardPlayerItem(player: Player) {
  if (player.IsInWorld()) {
    // Attempt to add the item to the player's inventory
    const addedItem = player.AddItem(REWARD_ITEM_ENTRY, 1);
    if (addedItem) {
      console.log(`Successfully added reward item to ${player.GetName()}'s inventory.`);
    } else {
      console.error(`Failed to add reward item to ${player.GetName()}'s inventory. Inventory may be full.`);
    }
  } else {
    console.error(`${player.GetName()} is not in the world. Cannot proceed with giving the reward item.`);
  }
}

// Example usage: register a player event where upon login, the player receives a reward item (if in the world)
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (playerId: number, player: Player) => {
  rewardPlayerItem(player);
});
```

This example demonstrates a practical use of the `IsInWorld` method to add a level of safety and error handling to scripts. When developing mods for AzerothCore using mod-eluna, proper checks like this ensure a smoother and more stable gameplay experience.


## RemoveFlag
This method is used to manipulate the flags of an object by removing a specified flag from the value at the given index. Flags are generally used to toggle or indicate the presence of various states or capabilities. By removing a flag, you effectively change the properties or behavior associated with the object.

### Parameters
* `index`: number - The index at which the flag value is located. This parameter signifies the specific property or state you want to alter.
* `flag`: number - The numerical value of the flag you want to remove. Flags are often defined as enums or constants in code for better readability.

### Example Usage
Consider an object that represents a character status, and you have flags to toggle states like `IsInvisible`, `CanFly`, or `IsInvulnerable`. Below is a simplified example of how `RemoveFlag` might be used to make a character visible again by removing the `IsInvisible` flag.

```typescript
// Assume these are pre-defined constants for the sake of this example.
const StatusIndexes = {
    Abilities: 0, // Index for abilities-related flags
};

const AbilityFlags = {
    IsInvisible: 1 << 0, // For simplicity, assume this is 1
    CanFly: 1 << 1,
    IsInvulnerable: 1 << 2,
};

class Character extends EObject {
    // Example method to make the character visible.
    makeVisible() {
        this.RemoveFlag(StatusIndexes.Abilities, AbilityFlags.IsInvisible);
    }
}

const myCharacter = new Character();
// Initially, the character might be invisible due to certain gameplay mechanics.

// When a specific event occurs, we want to make the character visible again.
myCharacter.makeVisible();

// At this point, RemoveFlag would have been used to alter the Abilities flags by removing the IsInvisible part.
```

In this example, `RemoveFlag` is used as a method of the `Character` class, which is assumed to extend `EObject`. Depending on the internal implementation of `RemoveFlag`, the method directly manipulates the state indicated by the `index` parameter, ensuring the `flag` specified is cleared, hence toggling the associated state or behavior.

## SetByteValue
This method is used to modify specific data of an EObject by setting an 8-bit (byte-size) unsigned integer value at a given index and offset. This is particularly useful when dealing with low-level data manipulation tasks such as setting flags, statuses, or properties that are represented as bytes.

### Parameters  
- `index`: number - The index at which the byte value needs to be set.
- `offset`: number - The offset within the given index to target the specific byte.
- `value`: number - The value to set, which will be converted to an unsigned 8-bit integer.  

### Example Usage:
This example demonstrates how you might use `SetByteValue` to change the status of an EObject, such as toggling a flag that indicates whether an object is active or inactive.  
```typescript
// Assuming there's a function to get a specific game object that we want to modify.
const gameObject: EObject = GetSomeGameObject();

// Define constants or variables for indexes and offsets for readability
const STATUS_INDEX = 1; // Hypothetical index where status flags are stored
const ACTIVE_OFFSET = 0; // Hypothetical offset for an "active" status flag
const NEW_STATUS_VALUE = 1; // Value to indicate "active"

// Function to activate an EObject
function activateObject(obj: EObject) {
    obj.SetByteValue(STATUS_INDEX, ACTIVE_OFFSET, NEW_STATUS_VALUE);
}

// Call the function with our gameObject.
activateObject(gameObject);

// This could be part of a larger script, for example, activating a game object 
// when a player enters a certain zone or completes a quest.
```
In the above script, `STATUS_INDEX` and `ACTIVE_OFFSET` are used to target the specific byte within the game object's data structure that represents its "active" status. `NEW_STATUS_VALUE` is used to set this byte to 1, indicating that the object should now be considered active. This simplistic approach shows how you might encapsulate this functionality within a function for reuse throughout your scripts or mod.

## SetFlag

Sets a specific flag in the entity's data value located at the provided index. The operation ensures the flag remains set even if it was previously in place. This method is typically used to mark an entity with certain properties or states without altering other flags already set in the data value. To revert or remove a flag, refer to the complementary method `RemoveFlag`.

### Parameters
- `index`: number - The index in the data array where the flag is to be set. This index corresponds to a specific property or state of the entity.
- `value`: number - The flag value to be set. This is usually represented by a specific bit within the data value that, when set to 1, indicates the flag's presence.

### Example Usage:

Adding a fictional "Invincibility" flag to an entity, assuming the flag is represented by the value 2 (or, in binary, `10`) and is stored at index 0 of the entity's data array.

```typescript
const ENTITY_INVINCIBILITY_FLAG = 2; // Assuming the invincibility flag value is 2
const DATA_INDEX = 0; // Assuming the relevant data for flags is stored at index 0

const onEntitySpawn: entity_event_on_spawn = (event: number, spawnedEntity: EObject) => {
    // Set the invincibility flag for the spawned entity
    spawnedEntity.SetFlag(DATA_INDEX, ENTITY_INVINCIBILITY_FLAG);

    // Additional logic upon entity spawn can be placed here
}

// Assume this function registers an event for when an entity spawns in the game world
RegisterEntityEvent(EntityEvents.ENTITY_EVENT_ON_SPAWN, (...args) => onEntitySpawn(...args));
```

In the above example, `SetFlag` is invoked for an entity upon its spawn, applying the "Invincibility" flag based on predefined index and flag values. This showcases how to modify entity states dynamically through game events using `SetFlag`. Proper understanding of the underlying data structure and flag representation is crucial for effective use of this method.

## SetFloatValue
This method sets a floating point value on an `EObject` at the specified index. This is particularly useful for manipulating game object properties that expect a floating point number. The value is converted into a single-precision floating point before it's set, ensuring compatibility with the game's data handling.

### Parameters
* **index:** `number` - The index at which the value is to be set. This typically corresponds to specific properties or attributes of the object.
* **value:** `number` - The value to set, which will be converted to a floating-point number.

### Example Usage:
The following script demonstrates adjusting the scale of a game object dynamically. In this example, when a player interacts with a game object, its scale is increased by a factor of 1.5, making the object appear larger in the game world.

```typescript
const SCALE_INDEX = 3; // Assume 3 is the index where the object's scale is stored.
const SCALE_FACTOR = 1.5;

const onGameObjectUse: gameobject_event_on_use = (event: number, player: Player, gameObject: GameObject): void => {
    
    // Get the current scale of the game object.
    const currentScale = gameObject.GetFloatValue(SCALE_INDEX); 
    
    // Calculate the new scale
    const newScale = currentScale * SCALE_FACTOR;
    
    // Set the new scale back on the game object
    gameObject.SetFloatValue(SCALE_INDEX, newScale); 

    player.SendBroadcastMessage(`Adjusted the scale of ${gameObject.GetName()} to ${newScale}.`);
}

// Register the event handler for game object interaction
RegisterGameObjectEvent(YOUR_GAMEOBJECT_ENTRY, GameObjectEvents.GO_EVENT_ON_USE, (...args) => onGameObjectUse(...args));
```

This script could be tailored to various use-cases, such as dynamically adjusting the size of game objects based on specific triggers or conditions, among other potential modifications to game objects. Understanding the indices for different object properties is crucial for effectively using this method.

## SetInt16Value

The `SetInt16Value` method is used to store a value converted to a signed 16-bit integer (short) in the data for the `EObject`. This method takes an index to identify the data slot, an offset within that slot, and the value to be stored. This can be particularly useful for manipulating low-level data for custom gameplay mechanics or features.

### Parameters
- `index`: number - The index of the data slot. This identifies where in the object's data array the 16-bit integer will be stored.
- `offset`: number - The offset within the specified index where the 16-bit integer value starts. This allows for more precise data manipulation within a single index.
- `value`: number - The value to be converted to a 16-bit integer and stored. This value is then assigned at the specified index and offset.

### Example Usage:
The script ensures that when a special item is used, a custom value is stored in the player's data. This value could later influence gameplay features or unlock custom abilities. The example assumes there are predefined constants for index and offset for simplicity.

```typescript
const EOBJECT_DATA_INDEX = 10;
const EOBJECT_DATA_OFFSET = 2;

const SPECIAL_ITEM_USAGE: player_event_on_use_item = (event: number, player: Player, item: Item) => {
    const SPECIAL_ITEM_ENTRY = 12345;

    if(item.GetEntry() == SPECIAL_ITEM_ENTRY) {
        // Assuming '123' is a significant value in our custom mod logic.
        player.SetInt16Value(EOBJECT_DATA_INDEX, EOBJECT_DATA_OFFSET, 123);

        // Notify the player that a special power has been unlocked or modified.
        player.SendBroadcastMessage("A mysterious force imbues you with newfound abilities.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => SPECIAL_ITEM_USAGE(...args));
```
In this usage scenario, when a player uses the item with the entry ID `12345`, a value of `123` is stored in their object data at the specified index and offset. The stored value could be used by other scripts or game mechanics to alter the player's gameplay experience, such as activating special abilities or affecting status effects based on custom conditions defined within your mod for AzerothCore.

# SetInt32Value
Sets the data for an `EObject` at the specified index to a given value. The value is converted to and stored as a signed 32-bit integer. This is often used in manipulating game object states, character attributes, or any scripted behavior that involves numeric data changes at a granular level.

### Parameters

- **index**: number - The index at which the data will be set. This corresponds to specific object properties or attributes and is integral to correctly applying the value to the intended aspect of the `EObject`.

- **value**: number - The value to be set at the specified index. This value is converted to a signed 32-bit integer before being applied.

### Example Usage:

The following script demonstrates adjusting a player's health by directly manipulating game object data. In a more practical scenario, this method might be used within complex scripts where direct control over object states is necessary, such as custom event triggers or unique game mechanics.

```typescript
// Assume 'player' is an existing instance of a Player, which is an extension of EObject.
const HEALTH_INDEX = 2; // Theoretical index for health in the data array.
const EXTRA_HEALTH = 500; // Additional health to grant the player.

/**
 * This function adds extra health to a player.
 * It retrieves the current health value, adds the extra health,
 * and then sets the new health value.
 * @param player The player to adjust health for.
 */
function AddExtraHealth(player: Player): void {
    let currentHealth = player.GetInt32Value(HEALTH_INDEX); // Assuming GetInt32Value is a method to get current int32 values.
    let newHealth = currentHealth + EXTRA_HEALTH;
    player.SetInt32Value(HEALTH_INDEX, newHealth);
    
    console.log(`Added ${EXTRA_HEALTH} health to player. New health: ${newHealth}`);
}

// Event listener for a custom event when a player consumes a specific health potion.
RegisterPlayerEvent(PlayerEvents.CUSTOM_EVENT_PLAYER_CONSUME_HEALTH_POTION, (player: Player) => {
    AddExtraHealth(player);
});
```

This example demonstrates a scenario where a player consumes a particular health potion, triggering a custom event that grants them additional health. The `SetInt32Value` method is used to apply the health bonus directly to the player's health attribute, showcasing the method's utility in directly manipulating object data within game scripts.

## SetScale
Sets the scale/size of the [Object] to a specified value. This can be used to adjust the visual size of an in-game object without altering its inherent properties or behaviors.

### Parameters
* `scale`: number - The new scale value to set for the object. Values greater than 1 increase the size of the object, values less than 1 decrease the size, and a value of 1 sets the object to its default size.

### Example Usage:
This script can be used to dynamically adjust the size of an object when a player interacts with it, creating an effect where the object grows or shrinks based on certain conditions.

```typescript
// Define a custom event handler for when a player interacts with an object
const onObjectInteraction: player_event_on_gameobject_use = (player: Player, object: GameObject): void => {
    if(object.GetGUID() == YOUR_SPECIFIC_OBJECT_GUID) {
        // Scale up the object size by 50% upon interaction
        object.SetScale(1.5);
        // Optionally, notify the player
        player.SendBroadcastMessage("You have magically altered the size of the object!");
    }
}

// Register the custom event handler
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GAMEOBJECT_USE, (...args) => onObjectInteraction(...args));
```

In this example, `YOUR_SPECIFIC_OBJECT_GUID` should be replaced with the GUID (Globally Unique Identifier) of the object you wish to apply the scale change to. The `SendBroadcastMessage` method is used to send a feedback message to the player, indicating that their interaction has caused the object to change size. 

This example demonstrates how to integrate dynamic object interactions within the game world, enhancing player experience by making the environment responsive to their actions.

## SetUInt16Value
Sets the data for the object at the specified index and offset to the given value, converting the value to an unsigned 16-bit integer. This method is crucial when you need to manipulate complex data structures or update specific parts of an object's state efficiently.

### Parameters <hr />
* `index`: number - The index in the object's data store where the value should be set. Different indices may correspond to different attributes or properties of the object.
* `offset`: number - The offset within the specified index at which the value should be set. This allows for more granular control over the data being manipulated.
* `value`: number - The new value to set. This value is converted to an unsigned 16-bit integer before being stored.

### Example Usage:  
Below is an example script that demonstrates how to use `SetUInt16Value` to update a player's health status displayed as part of a custom UI feature. This method directly manipulates the underlying data structures for immediate effect, bypassing the usual API functions. Use with caution.

```typescript
// Assuming EObject is an extensible object class supporting direct data manipulation.
// A hypothetical scenario where we need to update a health display offset in a custom UI component for a player's health bar.

class CustomPlayerUI {
    private static readonly HEALTH_DISPLAY_INDEX: number = 1; // Hypothetical index for health display
    private static readonly HEALTH_OFFSET: number = 0; // Offset for the health in a larger 16-bit integer block

    /**
     * Updates the health display for the custom UI element of a player.
     * @param player The player object whose health display needs updating.
     * @param newHealth The new health value to display. Note: Values are capped at the unsigned 16-bit integer max value.
     */
    static updateHealthDisplay(player: EObject, newHealth: number): void {
        // Cap the health value to the max value of an unsigned 16-bit integer
        const healthValue = Math.min(65535, newHealth);

        // Update the player's UI health display by setting the new health value at the appropriate index and offset
        player.SetUInt16Value(CustomPlayerUI.HEALTH_DISPLAY_INDEX, CustomPlayerUI.HEALTH_OFFSET, healthValue);

        console.log(`Updated player's health display to ${healthValue}.`);
    }
}

// Example usage:
// player is an instance of EObject representing the player
// Let's assume we want to set the player's health display to 30000
CustomPlayerUI.updateHealthDisplay(player, 30000);
```

This method is especially useful in scenarios where the game's default UI components or data presentation layers are being extended or modified. Careful consideration and testing are recommended to ensure the game's stability and data integrity.

## SetUInt32Value
This method is used to modify the data of the EObject by setting a value at a specified index, converting the provided value to an unsigned 32-bit integer. Useful for altering characteristics of game entities that are represented by this object.

### Parameters
* `index`: number - The index at which the value should be set. Refer to the entity's documentation for details on what each index controls.
* `value`: number - The value to set at the specified index, which will be converted to an unsigned 32-bit integer.

### Example Usage:
In a scenario where you might want to adjust a player's health dynamically through an event, you could use the `SetUInt32Value` method as part of the event handling. Below is an illustrative example where we set the health of a player entity when they complete a specific task or action within the game.

Let's assume the health index for our player entity is `0` (this is an illustrative index; in practice, you will need to refer to the documentation or entity definition to find the correct index for health).

```typescript
const HEALTH_INDEX = 0; // Assuming 0 is the index for health
const NEW_HEALTH_VALUE = 10000; // Set a new health value

const onPlayerCompleteTask: player_event_on_complete_task = (player: EObject) => {
    
    // Checks if the player is in a condition that warrants health modification
    if (playerNeedsHealthAdjustment(player)) {
        // Sets the player's health to a new value
        player.SetUInt32Value(HEALTH_INDEX, NEW_HEALTH_VALUE);
        sendMessageToPlayer(player, `Your health has been set to ${NEW_HEALTH_VALUE}!`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMPLETE_TASK, (...args) => onPlayerCompleteTask(...args));

function playerNeedsHealthAdjustment(player: EObject): boolean {
    // Include logic to determine if the player's health needs to be adjusted
    // This could be based on the player's current health, achievements, or other conditions
    // For simplicity, this example returns true
    return true;
}

function sendMessageToPlayer(player: EObject, message: string): void {
    // Implement a function to send a message to the player
    // This could be through the game's chat system, a UI popup, or another method
    // This function is a placeholder to illustrate where you might notify the player of the health change
}
```

In this example:
- `onPlayerCompleteTask` defines an event that is triggered when a player completes a specific task.
- It checks if the player meets a condition where their health should be adjusted using `playerNeedsHealthAdjustment`.
- The player's health is then set to `NEW_HEALTH_VALUE` using `SetUInt32Value`.
- Optionally, you can notify the player of this change using a custom message function, `sendMessageToPlayer`, depending on your game's mechanism for player communication.

# SetUInt64Value

This method is used to set the data at a specified index to a given value, with the value being converted into an unsigned 64-bit integer. This operation is fundamental in controlling and managing the state of objects within the game, particularly for custom modifications that need to programmatically adjust object properties.

### Parameters

- **index**: `number` - The index at which to set the value. This typically corresponds to a specific property or attribute within an EObject.
- **value**: `number` - The value to set at the given index. This value is converted to an unsigned 64-bit integer before being applied.

### Example Usage:

In the following scenario, we have a custom mod that rewards players with a unique artifact that has its power level represented as an unsigned 64-bit integer. This script listens for a specific player event, checks if the player has the artifact, and then uses `SetUInt64Value` to enhance its power level.

```typescript
// An example event where a player completes a challenging dungeon
const onDungeonComplete: dungeon_event_on_complete = (eventId: number, player: Player, dungeonId: number): void => {
    // Assuming 100001 is the artifact's unique entry ID
    const ARTIFACT_ENTRY_ID = 100001;
    // The artifact's power level index
    const POWER_LEVEL_INDEX = 10; 
    // The amount of power to add to the artifact
    const POWER_BOOST = 1000; 

    // Check if a player has the artifact in their inventory
    let artifact = player.GetItemById(ARTIFACT_ENTRY_ID);
    if (artifact) {
        // Get the artifact's current power level
        let currentPower = artifact.GetUInt64Value(POWER_LEVEL_INDEX);
        // Set the artifact's new power level
        artifact.SetUInt64Value(POWER_LEVEL_INDEX, currentPower + POWER_BOOST);

        player.SendBroadcastMessage("Your artifact has grown more powerful!");
    }
}

RegisterDungeonEvent(DungeonEvents.DUNGEON_EVENT_ON_COMPLETE, (...args) => onDungeonComplete(...args));
```
In this script:
- We define `onDungeonComplete`, a function that reacts to the completion of a dungeon.
- We check if the player possesses a specific artifact by its entry ID.
- We retrieve the artifact's current power level using a theoretical `GetUInt64Value` method (for the sake of this example).
- We then increase the artifact's power level by a predetermined amount using `SetUInt64Value`.
- Finally, we provide feedback to the player by sending them a broadcast message.

This example illustrates how to use `SetUInt64Value` to manipulate game object properties dynamically, allowing for a broad range of custom behaviors and enhancements in mod development for Azerothcore with mod-eluna.

## ToCorpse
Attempt to convert the current Object to a Corpse type. This method is particularly useful when you need to perform actions or retrieve information specific to a Corpse object. If the object is not of type Corpse, it returns `nil`.  

### Returns
corpse: [Corpse](./corpse.md) - The Corpse object if the conversion was successful, `nil` otherwise.

### Example Usage:
This script aims to demonstrate how to check if a killed entity's corpse can be interacted with for quest or mechanic purposes within certain events or conditions. It checks if the entity is a corpse and then prints a message to the system log.

```typescript
// A sample event where an entity dies and you want to check if it's a corpse
const onEntityDeath: entity_event_on_death = (event: number, entity: EObject, killer: Unit): void => {
    
    let corpse = entity.ToCorpse(); // Attempt to convert the entity to a Corpse
    
    if (corpse) {
        console.log("Entity is a corpse. Proceed with quest or mechanic interactions.");
        // Additional logic can be implemented here, such as checking if the corpse meets certain quest conditions
    }
    else {
        console.log("Entity is not a corpse. No further action taken.");
    }
}

// Registering the custom event for demonstration purposes
RegisterEntityEvent(MyCustomEntityIDs.MY_ENTITY_ID, EntityEvents.ENTITY_EVENT_ON_DEATH, (...args) => onEntityDeath(...args));
```
This example is intended for situations where specific actions need to be taken with entities that can leave corpses (for example, checking if a player has killed a particular NPC for a quest). It succinctly checks if an entity is a corpse upon death and logs the outcome, which can be expanded with further logic as needed.

## ToCreature

This method attempts to convert a general [Object] into a more specific [Creature] object type. This can be particularly useful in situations where you have an object reference and you need to ensure it is a creature to perform creature-specific operations. If the conversion is not possible (i.e., the object is not actually a creature), the method will return `nil`, indicating the conversion failure. 

### Returns
* `Creature` or `nil` - Returns a [Creature](./creature.md) if the [Object] is indeed a [Creature]. If not, `nil` is returned.

### Example Usage:
The following script illustrates a scenario where an object might be a creature. It first checks if the conversion is possible by calling `ToCreature()`. If successful (i.e., not `nil`), it proceeds to call a [Creature]-specific method on the newly converted creature object.

```typescript
// The 'objectFound' variable simulates obtaining an object from the game world.
// The exact method of obtaining this object will depend on your specific scenario (e.g., collision, proximity event).
let objectFound: EObject = getObject(); 

const onObjectInteract: generic_event_handler = (): void => {
    let creature = objectFound.ToCreature();

    if (creature != null) {
        // Successfully converted to Creature; you can now call Creature-specific methods.
        creature.DoSomethingSpecificToCreatures();
        console.log("Object was a creature and has been handled accordingly.");
    } else {
        console.log("The object is not a creature.");
    }
}

// Register an event or callback that triggers 'onObjectInteract'.
// For the sake of this example, the triggering mechanism is left generic.
registerSomeEventOrCallback(...args => onObjectInteract(...args));
```

This example highlights a generic use case and should be adjusted to fit the specific circumstances in which you need to check and convert objects to creatures within the AzerothCore modding framework.

## ToGameObject

Attempts to convert the [Object] into a [GameObject]. This is particularly useful when the type of the [Object] is uncertain and you want to manipulate it as a [GameObject]. If the conversion is not possible (i.e., the [Object] is not a [GameObject]), the method will return `nil`, indicating that the operation failed.

### Returns
* GameObject or `nil`: The method returns the converted [GameObject] if the [Object] is indeed a [GameObject]. If the conversion is not possible, it returns `nil`.

### Example Usage:

The following script demonstrates how to safely attempt to convert an [Object] to a [GameObject] and then perform operations on the [GameObject] if the conversion was successful. The script checks if a unit's target is a GameObject and, if so, prints the GameObject's entry ID.

```typescript
const OnSpellCast: player_event_on_cast_spell = (event: number, player: Player, spell: Spell, skipCheck: boolean, target: Object): void => {
    // Attempt to convert the target to a GameObject
    const gameObject = target.ToGameObject();

    if (gameObject) {
        // Successfully converted to GameObject
        print(`Target GameObject Entry ID: ${gameObject.GetEntry()}`);
    } else {
        // Conversion failed
        print("Target is not a GameObject.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => OnSpellCast(...args));
```

In this example, `OnSpellCast` is a callback for the PLAYER_EVENT_ON_CAST_SPELL event. When a spell is cast, the script checks if the target of the spell is a GameObject by attempting to convert the target object. It then either prints the GameObject's entry ID if the conversion was successful or indicates that the target is not a GameObject.

This approach ensures type safety and allows for GameObject-specific operations to be performed only on objects that are indeed GameObjects, avoiding runtime errors and simplifying complex type-checking logic.

## ToPlayer

Attempts to convert the [Object] to a [Player]. If the [Object] is not a [Player], it returns `nil`. This method can be very useful when you're not sure if an object is a player, especially when scripting events where both [Player]s and other [Unit]s might be involved.

### Returns
- `nil` if the [Object] cannot be converted into a [Player]
- `[Player]` instance if the conversion is successful

### Example Usage
The following example demonstrates how to safely check if an object is a player and then perform some player-specific operations if the conversion is successful.

Imagine we have a script that is meant to grant a blessing buff to players when they interact with a certain NPC. We'll first check if the interacting entity is a `Player` and then grant them a buff.

```typescript
// Define a handler for when an entity interacts with our special NPC
const OnEntityInteractSpecialNPC: entity_event_on_player_interaction = (event: number, entity: EObject, specialNPCId: number): void => {
    
    // Check if the entity is indeed a player
    const player = entity.ToPlayer();
    
    // If not a player, do nothing
    if(!player) {
        return;
    }
    
    // Specific NPC Id we want to check interaction with
    const SPECIAL_NPC_ID = 12345; // Example NPC Id
    
    // Check if the interaction is with our special NPC
    if(specialNPCId == SPECIAL_NPC_ID) {
        
        // If so, grant the player a blessing buff
        const BLESSING_BUFF_ID = 43210; // Example Buff Id
        
        // Applying the blessing buff to the player
        player.AddAura(BLESSING_BUFF_ID, player);
        
        // Log or announce the blessing for the player
        console.log(`Blessing granted to ${player.GetName()}.`);
    }
}

// Register our handler for the Entity Interaction event
RegisterEntityEvent(EntityEvents.ENTITY_EVENT_ON_INTERACTION, (...args) => OnEntityInteractSpecialNPC(...args));
```

This script checks if the entity interacting with a specific NPC is a player and, if so, grants them a special "blessing" buff. This demonstrates how the `ToPlayer()` method can be integral in ensuring that scripts dealing with entities handle them appropriately based on their type.

## ToUnit

Attempts to convert the [EObject](./eobject.md) instance to a [Unit](./unit.md) instance. If the [EObject](./eobject.md) is not actually a [Unit](./unit.md) (for example, if it's an [Item](./item.md) or a [GameObject](./gameobject.md)), the method returns `nil`, indicating the conversion cannot be made. Useful for scripts where entity type checking is necessary before performing operations specific to [Unit](./unit.md) entities.

### Returns
unit: [Unit](./unit.md) or `nil` - The converted [Unit](./unit.md) if the [EObject](./eobject.md) is a [Unit](./unit.md), otherwise `nil`.

### Example Usage:
In a script that enhances a player's companion NPC upon entering a specific zone, ensuring the companion is indeed a [Unit](./unit.md) before applying changes.

```typescript
const ZONE_ID_FOR_EVENT = 400;  // Example zone ID

// Event handler when a player enters a new zone
const onPlayerEnterZone: player_event_on_enter_zone = (event: number, player: Player, newZone: number): void => {
    if (newZone === ZONE_ID_FOR_EVENT) {
        // Assuming GetCompanion returns an EObject which could be a Unit or something else
        let companion: EObject = player.GetCompanion(); 
        let companionUnit: Unit = companion.ToUnit();

        if (companionUnit != null) {
            // Perform operations on the companion Unit
            companionUnit.SetMaxHealth(2000);  // Example: setting max health of the companion
            console.log("Companion's max health has been set to 2000.");
        } else {
            console.log("Player's companion is not a Unit. Cannot enhance.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_ZONE, (...args) => onPlayerEnterZone(...args));
```

This code snippet demonstrates the use of `ToUnit` method to safely convert a player's companion from an [EObject](./eobject.md) to a [Unit](./unit.md) before attempting to adjust the companion's health. It ensures script integrity by checking the object type, thereby preventing potential errors that would arise from attempting to execute [Unit](./unit.md)-specific operations on a non-[Unit](./unit.md) object.

## UpdateUInt32Value
Sets the data for the entity at a specified index to the given value, converting it to an unsigned 32-bit integer. This method is typically used to modify the state or properties of game objects or entities in a controlled manner.

### Parameters<hr/>
* `index`: number - The index at which to update the data. This usually corresponds to specific attributes or properties of the entity.
* `value`: number - The new value to be set at the specified index. This value is converted to an unsigned 32-bit integer.

### Example Usage:
In this example, we are updating a player's health attribute. In a game context, this might be used within a custom healing spell or effect.

```typescript
const UPDATE_HEALTH_INDEX = 25; // Hypothetical index for health attribute
const HEAL_AMOUNT = 100;

/**
 * Custom function to heal a player using UpdateUInt32Value method. 
 * This is a simplified example; actual game mechanics can be more complex.
 * 
 * @param player - The player entity to heal.
 */
function healPlayer(player: EObject): void {
    // Retrieve current health, for demonstration purposes let's assume a GetHealth method exists
    let currentHealth = player.GetHealth();

    // Calculate new health value
    let newHealth = currentHealth + HEAL_AMOUNT;

    // Update player's health attribute to the new value
    player.UpdateUInt32Value(UPDATE_HEALTH_INDEX, newHealth);

    console.log(`Player healed! New health: ${newHealth}`);
}

// Example usage within an event listener or a similar context
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DAMAGE_TAKEN, (player: EObject) => {
    // Call healPlayer within an appropriate context, e.g., after taking damage
    healPlayer(player);
});
```

In this example, a hypothetical `healPlayer` function is defined, which utilizes the `UpdateUInt32Value` method to increase a player's health by a predetermined amount. This function can be invoked in various game scenarios, such as after a player takes damage, to simulate a healing effect. Note that index constants and methods like `GetHealth` are context-dependent and might vary based on the game's data structure.

