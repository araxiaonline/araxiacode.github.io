# GetAngle

Calculate the angle (in radians) between this [WorldObject] and another [WorldObject] or a specific point in the world. This method computes the angle based on positions, ignoring the orientation of either object.

### Parameters
- `object`: [WorldObject](./worldobject.md) - The WorldObject to calculate the angle to. If specifying a point instead, this can be `null`.
- `x`: number - The X coordinate of the point to calculate the angle to. Required if `object` is `null`.
- `y`: number - The Y coordinate of the point to calculate the angle to. Required if `object` is `null`.

### Returns
- angle: number - The calculated angle in radians between the [WorldObject] and the specified [WorldObject] or point.

### Example Usage:

The following example demonstrates how to use `GetAngle` to determine the angle between two WorldObjects, and then how to use it to calculate the angle between a WorldObject and a specific point. This could be used for various purposes, such as orienting one object towards another or towards a specific location in the world.

```typescript
// Assume `worldObjectA` and `worldObjectB` are already defined WorldObjects.
// Example of calculating the angle between two WorldObjects:
const angleBetweenObjects = worldObjectA.GetAngle(worldObjectB, null, null);
console.log(`The angle between the two objects is: ${angleBetweenObjects} radians.`);

// Coordinates for a specific point in the world:
const targetX = 1234.56;
const targetY = 789.01;

// Example of calculating the angle between a WorldObject and a point:
const angleToObjectToPoint = worldObjectA.GetAngle(null, targetX, targetY);
console.log(`The angle from the object to the point is: ${angleToObjectToPoint} radians.`);

```

This method is particularly useful in scenarios where you need to guide NPC movements, orienting players or NPCs towards targets, or simply for calculating strategic positions based on angles in gameplay scripts.

## GetAreaId
Returns the current area ID of the `WorldObject`. This method is particularly useful when scripting events, quests, or actions that are meant to occur in specific areas within the game world. By obtaining the area ID, scripts can conditionally trigger functionality based on the player’s location.

### Returns
- **areaId**: `number` - The ID of the area where the `WorldObject` is located. Area IDs can be referenced in the World Database area_table. For more information about areas, consult the [AzerothCore area documentation](https://www.azerothcore.org/wiki/area_table).

### Example Usage:
In this example, we create a simple script that checks the area ID when a player enters a specific zone and then broadcasts a message to the player. This could be used to trigger zone-specific events or give players information about the area they’ve entered.

```typescript
const ZONE_ID_GRIZZLY_HILLS = 394;
const MESSAGE_ENTRY_GRIZZLY_HILLS = "Welcome to the Grizzly Hills!";

const OnPlayerZoneChange: player_event_on_update_zone = (event: number, player: Player) => {
    const currentAreaId = player.GetAreaId();

    if(currentAreaId == ZONE_ID_GRIZZLY_HILLS) {
        player.SendBroadcastMessage(MESSAGE_ENTRY_GRIZZLY_HILLS);         
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => OnPlayerZoneChange(...args));
```

This script leverages the `GetAreaId` method to identify when a player enters the Grizzly Hills area (`ZONE_ID_GRIZZLY_HILLS`). Upon entering, it sends a broadcast message to the player, welcoming them to the Grizzly Hills. This approach can be adapted to introduce players to various areas, trigger quests, or initiate events based on the player's location.

## GetCreaturesInRange

Finds and returns a list of [Creature](./creature.md) objects that are within a specified range of the WorldObject. This method can further filter creatures based on their entry ID, hostility, and whether they are alive or dead. It's a versatile method for scenarios where interaction with nearby creatures is required, whether for quests, events, or environmental awareness.

### Parameters
* `range?`: number - The maximum distance to search for creatures. If not specified, defaults to the visible range.
* `entryId?`: number - (Optional) If provided, only creatures with this entry ID will be considered.
* `hostile?`: number - (Optional) A flag indicating whether to filter by hostility. Use `1` to include only hostile creatures, `0` for neutral or friendly creatures.
* `dead?`: number - (Optional) Indicates whether to include dead creatures in the results. Use `1` to include dead creatures, `0` to exclude them.

### Returns
* `creatures`:  [Creature](./creature.md)[] - An array of Creature objects meeting the criteria.

### Example Usage:
Imagine a scenario where a special event is triggered once a player enters a certain area, and you need to assess if specific creatures are nearby, possibly to alter the NPC behavior or to spawn additional units dynamically.

```typescript
const ZOMBIE_ENTRY_ID = 12345; // Assuming we have a specific zombie we are interested in.
const SEARCH_RANGE = 50; // We want to check within 50 units range.

const onPlayerEnterSpecialArea: player_event_on_enter_area = (event: number, player: Player, areaId: number): void => {
    // Checking for specific creatures within range when a player enters a designated area.
    let zombiesInRange = player.GetCreaturesInRange(SEARCH_RANGE, ZOMBIE_ENTRY_ID, 1, 0); // Looking for live hostile zombies.
    
    if(zombiesInRange.length > 0) {
        // If any zombies are found, perhaps make them target the player or alter their behavior.
        zombiesInRange.forEach(zombie => {
            // Each zombie in the array could be made to behave differently, perhaps aggroing onto the player.
            // Example: zombie.EngageCombatWith(player); // This is conceptual, actual method names may vary.
        });
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_AREA, (...args) => onPlayerEnterSpecialArea(...args));
```

This script showcases how to use `GetCreaturesInRange` to interact with players and the environment dynamically. It's useful for creating engaging and immersive experiences in Azerothcore mod-eluna based mods.

## GetDistance
This method calculates the distance between the WorldObject it's called on and another WorldObject or a specific point in 3D space. It considers the sizes of the objects involved for a more accurate distance measurement. Useful in various scenarios including distance-based calculations for spells, aggro, and scripted events.

### Parameters
* **obj**: [WorldObject](./worldobject.md) - The target WorldObject to measure distance to. This can be null if x, y, z parameters are provided.
* **x**: number - The X-coordinate of the point to measure distance to; used if the first parameter is null.
* **y**: number - The Y-coordinate of the point to measure distance to; used if the first parameter is null.
* **z**: number - The Z-coordinate of the point to measure distance to; used if the first parameter is null.

### Returns
* **distance**: number - The calculated distance between the calling WorldObject and the target WorldObject or point in 3D space.

### Example Usage:
Implement a scripted event where a boss spawns adds when players are within a certain distance.

```typescript
const BOSS_ENTRY = 12345;
const SPAWN_ADD_ENTRY = 54321;
const TRIGGER_DISTANCE = 30; // Trigger distance in-game units

const onBossThink: creature_event_on_think = (event: number, creature: Creature): void => {
    const players = creature.GetPlayersInRange(TRIGGER_DISTANCE, false); 

    if (players.length > 0) {
        for (let player of players) {
            const distanceToPlayer = creature.GetDistance(null, player.GetX(), player.GetY(), player.GetZ());
            
            if (distanceToPlayer <= TRIGGER_DISTANCE) {
                creature.SpawnCreature(SPAWN_ADD_ENTRY, player.GetX(), player.GetY(), player.GetZ(), 0, true);
                break; // Spawn one add and exit loop
            }
        }
    }
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_THINK, (...args) => onBossThink(...args));
```

This script periodically checks if players are within 30 units of the specified boss. If a player is found within the trigger distance, an add is spawned at the player's location. This example demonstrates a practical use of `GetDistance` in controlling boss mechanics based on player positioning.

## GetDistance2d
Calculates the 2D distance between this [WorldObject] and another [WorldObject], or a specific point in 2D space. This method also considers the sizes of the objects involved when calculating the distance. For those looking for more specific distance calculations, refer to [WorldObject:GetDistance] and [WorldObject:GetExactDistance2d].

### Parameters
* `obj`: [WorldObject](./worldobject.md) - The WorldObject to measure the distance to. This parameter is optional. If not provided, `x` and `y` must be specified.
* `x`: number - The X coordinate of the point to measure the distance to. This parameter is required if `obj` is not provided.
* `y`: number - The Y coordinate of the point to measure the distance to. This parameter is required if `obj` is not provided.

### Returns
* number - The 2D distance between the two points or objects.

### Example Usage:
Calculating the distance between two WorldObjects without needing to consider their Z coordinate can be especially useful in situations where only the horizontal plane is of interest, such as checking if players are within a certain range on the same floor of a building.

Assuming we have two WorldObjects, `objectA` and `objectB`, the following example demonstrates how to calculate and utilize their 2D distance:

```typescript
function checkProximity(objectA: WorldObject, objectB: WorldObject): void {
    
    // Calculate the 2D distance between objectA and objectB
    const distance = objectA.GetDistance2d(objectB, null, null);

    // Check if the objects are within 10 units of each other
    if (distance <= 10) {
        console.log("Objects are within close proximity.");
    } else {
        console.log("Objects are too far apart.");
    }
}
```

Alternatively, to calculate the distance from a WorldObject to a specific point in 2D space:

```typescript
function checkDistanceToPoint(object: WorldObject, pointX: number, pointY: number): void {
    
    // Calculate the 2D distance from the object to the specified point
    const distance = object.GetDistance2d(null, pointX, pointY);

    // Check if the object is within 5 units of the specified point
    if (distance <= 5) {
        console.log("Object is close to the specified point.");
    } else {
        console.log("Object is too far from the specified point.");
    }
}
```

These examples help in evaluating proximity in gameplay scenarios, such as triggering events when a player or object moves within a specific range of a point or another object, without the complexity of 3D space considerations.

## GetExactDistance

This method calculates the precise distance between the current WorldObject and another target WorldObject or a specific point in 3D space. It's important to note that this calculation is purely geometrical and does not account for the sizes or shapes of the WorldObjects involved. This is particularly useful for situations where precision is key, such as creating mechanics that rely on exact positioning.

### Parameters
- **obj**: [WorldObject](./worldobject.md) (Optional) - The target WorldObject to measure the distance to. If not provided, x, y, z must be specified.
- **x**: number (Optional) - The X coordinate of the point to measure distance to if no `obj` is specified.
- **y**: number (Optional) - The Y coordinate of the point to measure distance to if no `obj` is specified.
- **z**: number (Optional) - The Z coordinate of the point to measure distance to if no `obj` is specified.

### Returns
- **distance**: number - The exact distance to the target WorldObject or point in 3D space.

### Example Usage:
In this example, we create an event listener that triggers when a player enters combat. It checks if the enemy is within a precise distance before allowing an attack or skill to be used. This can be especially helpful in custom encounters or mechanics that require exact positioning.

```typescript
const REQUIRED_DISTANCE = 5; // Required distance to initiate combat

// Event listener for entering combat
const onPlayerEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    // Convert enemy Unit to WorldObject to use GetExactDistance
    const enemyObject = enemy as unknown as WorldObject; 
    const playerObject = player as unknown as WorldObject; 
    
    const distanceToEnemy = playerObject.GetExactDistance(enemyObject, 0, 0, 0); // We are comparing two WorldObjects, so no need for x, y, z coordinates

    // Check if the distance to the enemy is less than or equal to the required distance
    if (distanceToEnemy <= REQUIRED_DISTANCE) {
        console.log("Enemy is within range! Attack!");
    } else {
        console.log("Enemy too far away. Move closer to attack.");
    }
};

// Register the PLAYER_EVENT_ON_ENTER_COMBAT with our custom combat distance checker
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onPlayerEnterCombat(...args));
```

In this example, `GetExactDistance` is used to precisely determine if an enemy is close enough to initiate combat. This approach ensures that mechanics requiring specific player positioning are accurate and consistent.

## GetExactDistance2d

This method calculates the exact 2D distance between the invoking `WorldObject` and another specified `WorldObject`, or a specific point in 2-dimensional space. It's important to note that this calculation does not take the sizes of the objects into account; it strictly compares the coordinates of the objects or the object and the specified point.

### Parameters
- `obj`: [WorldObject](./worldobject.md) (Optional) - The target WorldObject to measure distance to. If not provided, `x` and `y` must be used to specify a point.
- `x`: number (Optional) - The X coordinate of the point to measure distance to. Required if `obj` is not provided.
- `y`: number (Optional) - The Y coordinate of the point to measure distance to. Required if `obj` is not provided.

### Returns
- `distance`: number - The exact 2D distance to the target WorldObject or specified point.

### Example Usage

#### Calculating Distance to Another Object
Let's say you want to check if a player is within a specific range from a quest giver without considering the Z axis, which is particularly useful in flat areas to simplify calculations.

```typescript
const QUEST_GIVER_ID = 12345; // Example quest giver ID

// Hook when a player moves, you'll want to check their distance to the quest giver
const onPlayerMove: player_event_on_move = (event: number, player: Player) => {
    const questGiver = GetWorldObjectByID(QUEST_GIVER_ID);

    if (!questGiver) {
        return; // Quest giver not found, early exit
    }

    const distance = player.GetExactDistance2d(questGiver);
    if (distance <= 5) { // Replace 5 with your desired range check
        // Player is in range, proceed with your logic
        console.log(`Player ${player.GetName()} is within range of the quest giver.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (...args) => onPlayerMove(...args));
```

#### Calculating Distance to a Point
Imagine a scenario where a quest requires a player to reach a specific location, and you want to check their proximity to that point:

```typescript
const TARGET_X = 1234.56; // Example X coordinate of the target location
const TARGET_Y = 7890.12; // Example Y coordinate of the target location

const onPlayerMove: player_event_on_move = (event: number, player: Player) => {
    const distanceToPoint = player.GetExactDistance2d(null, TARGET_X, TARGET_Y);

    if (distanceToPoint <= 10) { // Consider 10 as the proximity range to the target point
        // Player has reached the vicinity of the target location
        console.log(`Player ${player.GetName()} has reached the target location.`);
        // Proceed with quest completion or next steps
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (...args) => onPlayerMove(...args));
```

These examples depict how mod-eluna and AzerothCore can utilize the `GetExactDistance2d` method to enhance gameplay experiences by incorporating distance-based mechanics or triggers into custom scripts or quests.

## GetGameObjectsInRange

Find game objects within a specified range from the current WorldObject. This can be further filtered by providing an optional game object entry ID and hostility flag. Useful for scripts that need to interact with or check for the presence of nearby game objects in the world.

### Parameters
- **range**: number (optional) - The maximum distance to search for game objects. If not specified, a default range is used.
- **entryId**: number (optional) - The entry ID of the game objects to search for. If not provided, all game objects within range are considered.
- **hostile**: number (optional) - A flag indicating whether to include hostile (1), friendly (0), or all (undefined) game objects in the results.

### Returns
- **gameObjects**: [GameObject](./gameobject.md)[] - An array of game objects within the specified range and, optionally, with the specified entry ID and hostility flag.

### Example Usage:
Script to find and interact with a specific type of game object near the player. This example searches for all friendly game objects of entry ID 190000 within 50 yards of the player to simulate a quest interaction or area effect.

```typescript
const GO_ENTRY_ID = 190000; // Example game object entry ID
const SEARCH_RANGE = 50; // Search within 50 yards

const onPlayerInteract: player_event_on_custom_event = (event: number, player: Player) => {
    const nearbyObjects = player.GetGameObjectsInRange(SEARCH_RANGE, GO_ENTRY_ID, 0);
    
    if(nearbyObjects && nearbyObjects.length > 0) {
        nearbyObjects.forEach((gameObject) => {
            // Perform an action with each game object, such as triggering a quest event
            console.log(`Found a game object with entry ID ${GO_ENTRY_ID} within ${SEARCH_RANGE} yards.`);
            // Trigger custom interaction here
        });
    } else {
        console.log("No suitable game objects found within the specified range.");
    }
}
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CUSTOM_EVENT, (...args) => onPlayerInteract(...args));
```
This script demonstrates how to search for specific game objects near the player character, check for their presence, and then execute a block of code to interact with each found object. It's a fundamental pattern for creating immersive and interactive environments in mods built on Azerothcore with mod-eluna.

## GetInstanceId
Retrieves the instance ID of the WorldObject. This can be used in scenarios where identifying or differentiating among instances is necessary -- for example, in managing instance-specific data or behaviors.

### Returns
number - The instance ID of the WorldObject.

### Example Usage:
Suppose we want to create a greeting for players entering different instances of a dungeon. For example, when players enter the first instance of the dungeon, they receive one message, and when they enter a new instance, they receive a different message. This requires tracking the instance IDs to provide the appropriate greeting.

```typescript
// Assume we have a function that fetches a greeting message based on the instance ID
function getDungeonGreeting(instanceId: number): string {
    const greetings = {
        1: "Welcome to the first instance of the dungeon. Good luck!",
        2: "This is the second instance. Hope you're prepared!",
        // Add more instance-specific greetings as needed
    };

    return greetings[instanceId] || "Welcome to the dungeon. Brave adventurers, beware!";
}

const onPlayerEnterDungeon: player_event_on_map_enter = (event: number, player: Player, mapId: number): void => {
    // Check if the map is a dungeon (pseudo code, replace with actual condition)
    if (isDungeonMap(mapId)) {
        const instanceId = player.GetInstanceId();
        const greeting = getDungeonGreeting(instanceId);

        // Send the greeting to the player entering the dungeon
        player.SendBroadcastMessage(greeting);
    }
}

// Register the event to handle player entering a map/dungeon
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP_ENTER, (...args) => onPlayerEnterDungeon(...args));
```

In this example, `GetInstanceId` is crucial for determining the correct greeting to display based on the instance ID. It enables a more dynamic and instance-specific interaction, enhancing the gameplay experience within modifiable environments like those in AzerothCore with mod-eluna.

## GetLocation
This method returns the exact geographical coordinates and orientation of the `WorldObject` within the game world. This is particularly useful for scripts or mods that need to interact with objects based on their location.

### Returns
A Lua multi-return value comprising four numbers:
- **`X` Coordinate** (`number`): The horizontal position on the map.
- **`Y` Coordinate** (`number`): The vertical position on the map.
- **`Z` Coordinate** (`number`): The height or altitude at the position.
- **`Orientation`** (`number`): The direction the object is facing, represented in radians.

### Example Usage:
The following script can be used to teleport a player to the location of a specific world object, such as an NPC or a game object. It captures the `WorldObject`'s location and applies it to the player's position. This can be particularly useful for custom quests or events where a player needs to be moved to a specific location.

```typescript
const TELEPORT_NPC_ENTRY = 12345; // Example NPC entry ID

// Event handler for when a player interacts with a specific NPC
const OnNPCInteract: player_event_on_gossip_hello = (event: number, player: Player, npc: Creature): void => {
    if (npc.GetEntry() === TELEPORT_NPC_ENTRY) {
        const [x, y, z, orientation] = npc.GetLocation();
        
        // Teleporting player to the NPC's location
        player.Teleport(player.GetMapId(), x, y, z, orientation);
        
        // Optional: Send a chat message to the player confirming the teleport
        player.SendAreaTriggerMessage("You have been teleported!");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnNPCInteract(...args));
```

In this example, the script listens for an interaction event with an NPC. If the interacted NPC matches the specified entry ID, it retrieves the NPC's location using `GetLocation()` and teleports the player to that exact location. Optionally, it sends a chat message to the player, confirming the action. This script can be modified to accommodate various scenarios, like teleporting a player to different NPCs or objects based on certain conditions.

# GetMap 

Retrieve the current [Map](./map.md) object that the [WorldObject](./worldobject.md) is located in.

### Returns
- **EMap** - The map object in which the WorldObject is currently present.

### Example Usage:

In this scenario, we want to execute an action specific to a map when a player interacts with a WorldObject, such as a custom teleporter or an interactive lore object. This script checks the map ID of the object when a player interacts with it. If the object is in a specific map, a unique message is displayed or a specific action is taken.

```typescript
const TARGET_MAP_ID = 571; // Example map ID, for Northrend (WotLK)

const onObjectInteract: worldobject_event_on_go_use = (event: number, player: Player, worldObject: WorldObject): void => {
    const objectMap = worldObject.GetMap();

    if(objectMap.GetMapId() === TARGET_MAP_ID) {
        // Perform actions specific to the object being in Northrend
        player.SendBroadcastMessage("This mystical object pulses with energy from Northrend.");
        // Additional action, such as teleportation or initiation of a custom quest/event
    } else {
        player.SendBroadcastMessage("This object seems dormant in this land.");
    }
}

RegisterWorldObjectEvent(WorldObjectEvents.WORLDOBJECT_EVENT_ON_GO_USE, (...args) => onObjectInteract(...args));
```

This script makes use of the `GetMap` method to obtain the current map of the WorldObject. Checking the map ID allows for context-specific interactions, adding depth to player experiences in different world zones. This can be particularly useful for creating dynamic world events, custom quests, or unique player interactions based on the location of objects within the game world.

For more detailed information on map methods and properties, please refer to the [Map documentation](./map.md).

## GetMapId
This method retrieves the current map ID where the WorldObject is located. Maps in AzerothCore are essentially different zones or instances within the game world. Each map has a unique ID which is used internally to manage locations, spawns, and events within the game. Knowing the map ID of a `WorldObject` can be crucial for scripts that need to operate differently based on the location of an object, player, or NPC.

### Returns
mapId: number - The numeric ID of the map where the WorldObject is located.

### Example Usage:
Let's say we want to create a custom script that congratulates players whenever they enter a specific zone, for demonstration purposes we'll use Stormwind City with a map ID of 0. This script will check the player's map ID upon movement and send a congratulation message if they've just arrived in Stormwind City.

```typescript
const STORMWIND_CITY_MAP_ID = 0;
const WELCOME_MESSAGE = "Welcome to Stormwind City, the heart of the Alliance!";

const onPlayerMove: player_event_on_movement = (event: number, player: Player): void => {
    // Check if the player's current map ID matches Stormwind City's ID.
    if(player.GetMapId() === STORMWIND_CITY_MAP_ID) {
        // Send a welcome message to the player.
        player.SendBroadcastMessage(WELCOME_MESSAGE); 
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVEMENT, (...args) => onPlayerMove(...args));
```

In this example, the `RegisterPlayerEvent` function hooks into the player movement event. The callback `onPlayerMove` is executed whenever a player moves, and it uses the `GetMapId()` method of the `player` object to check if the player is in Stormwind City by comparing the current map ID with `STORMWIND_CITY_MAP_ID`. If the condition is met, a welcoming message is sent to the player using the `SendBroadcastMessage` method.

This script can be tailored further based on requirements, such as adding checks to ensure the message is only sent once upon entering the city or adapting it for other map zones.

Notice: The example code and constants (e.g., `STORMWIND_CITY_MAP_ID` and `WELCOME_MESSAGE`) are created for demonstration purposes. Always refer to your project's documentation or source code for accurate map IDs and API usage.

# GetName

Retrieve the name of the [WorldObject]. This can be useful for identification purposes in various scripts, such as identifying NPCs or objects in the world.

### Returns
name: string - The name of the WorldObject.

### Example Usage:
Efficiently checking if a player is interacting with a specific NPC and responding with a custom message. 

```typescript
const NPC_TO_FIND = "Thrall";
const WELCOME_MESSAGE = "Lok'tar Ogar, champion! What brings you to me today?";

const onGossipHello: gossip_hello = (event: number, player: Player, unit: WorldObject): void => {
    
    // Check if the target NPC's name matches the one we're looking for
    if(unit.GetName() === NPC_TO_FIND) {
        // Send a custom welcome message to the player
        player.SendBroadcastMessage(WELCOME_MESSAGE);
    }
}

RegisterPlayerGossipEvent(GossipEvents.GOSSIP_EVENT_ON_HELLO, (...args) => onGossipHello(...args));
```

This script demonstrates how to utilize the `GetName` method to personalize player-NPC interactions. Upon a gossip event (usually a right-click interaction), it checks if the WorldObject's name matches "Thrall". If it does, a custom welcome message is broadcasted to the player. This implementation can enhance immersion and open up possibilities for dynamic questing, NPC interactions, or server events.

## GetNearObject
Returns the nearest `WorldObject` in sight of the calling `WorldObject` that matches the specified criteria. This can be useful for scripts that need to interact with or check the presence of nearby objects, such as NPCs, players, or game objects. The search criteria include range, type, entry, hostility, and whether the object is dead or alive.

### Parameters
- `range`: number (optional) - The maximum distance to search for the object. Defaults to checking within the entire visible area if not specified.
- `type`: number (optional) - The type of the object to search for. Use constants defined for object types, such as `GameObjectTypes` or `CreatureTypes`.
- `entry`: number (optional) - The specific entry ID of the object to search for. Useful for finding objects of a specific kind, such as a quest NPC or a specific kind of game object.
- `hostile`: number (optional) - Specifies whether to search for hostile (`1`), friendly (`0`), or any (`-1`) objects relative to the WorldObject. Defaults to `-1` if not specified.
- `dead`: number (optional) - Specifies whether to include dead (`1`), alive (`0`), or both types of entities (`-1`) in the search. Useful for abilities or mechanics that affect or detect dead entities.

### Returns
- `WorldObject` - The nearest `WorldObject` that matches the given criteria. Returns `null` if no matching object is found.

### Example Usage
The following script demonstrates how to use `GetNearObject` to find nearby hostile NPCs within a range of 50 units. If a matching hostile NPC is found, it prints the NPC's entry ID and name to the server log. This can be useful for creating custom NPC interactions or for scripts that need to monitor the presence of certain NPCs.

```typescript
const HOSTILE_NPC_TYPE = 4; // Assuming 4 represents the NPC type
const SEARCH_RANGE = 50;
const HOSTILE_SEARCH = 1;
const ALIVE_ONLY = 0;

// Custom event handler for when a specific event occurs
const OnCustomEvent: custom_event_handler = (player: Player) => {
    // Use GetNearObject to search for a nearby hostile NPC within 50 units
    const nearestHostileNPC = player.GetNearObject(SEARCH_RANGE, HOSTILE_NPC_TYPE, undefined, HOSTILE_SEARCH, ALIVE_ONLY);

    if (nearestHostileNPC) {
        // If a hostile NPC is found, log its entry ID and name
        console.log(`Found hostile NPC with Entry ID: ${nearestHostileNPC.GetEntry()}, Name: ${nearestHostileNPC.GetName()}`);
    } else {
        // If no hostile NPC is found within range
        console.log(`No hostile NPCs found within ${SEARCH_RANGE} units.`);
    }
};

RegisterCustomEvent(customEventId, (...args) => OnCustomEvent(...args));
```

In this example, `custom_event_handler` and `RegisterCustomEvent` are placeholders meant to represent how you might hook this functionality into an appropriate event within your mod or script. Adjust these parts according to your actual event handling system.

## GetNearObjects

This method returns an array of [WorldObject](./worldobject.md) IDs that are within sight of the calling [WorldObject], based on various filters such as range, type, entry ID, hostility, and whether the object is dead or alive.

### Parameters 
- `range` (optional): number - Search radius in game units. If omitted, a default range is used.
- `type` (optional): number - Type of WorldObjects to search for. This could be specific values like NPCs, players, etc. If omitted, all types are considered.
- `entry` (optional): number - Entry ID of the WorldObject to search for. Useful for finding objects of a specific kind, like a certain NPC. If omitted, all entry IDs are considered.
- `hostile` (optional): number - Specifies whether to look for hostile (1), friendly (0), or both types of WorldObjects towards the caller. If omitted, both are considered.
- `dead` (optional): number - Specifies whether to include dead (1) or alive (0) WorldObjects. If omitted, both states are considered.

### Returns
- `objectIds`: number[] - An array of WorldObject IDs that match the criteria.

### Example Usage:  
The example script demonstrates finding all nearby hostile NPCs within a 50-unit range and printing their IDs to the server console. This could be useful for a custom event where a player or NPC must interact with or avoid specific other NPCs within their vicinity.

```typescript
const FindHostileNpcsInRange: worldobject_event_on_update = (event: number, obj: WorldObject): void => {
  // Assuming '1' represents NPCs in the 'type' filter, and '1' also signifies 'hostile'
  const hostileNpcs = obj.GetNearObjects(50, 1, undefined, 1);

  // Logging the count of found NPCs
  console.log(`Found ${hostileNpcs.length} hostile NPCs within range.`);

  // Assuming there is a method to get WorldObject by ID for detailed operations
  hostileNpcs.forEach(npcId => {
    const npc = GetWorldObjectById(npcId);
    console.log(`Hostile NPC ID: ${npcId}, Name: ${npc.GetName()}`);
  });
}

RegisterWorldObjectEvent(WorldObjectEvents.WORLDOBJECT_EVENT_ON_UPDATE, (...args) => FindHostileNpcsInRange(...args));
```

This script utilizes the hypothetical method `GetWorldObjectById` to further interact with each found NPC, such as retrieving their name. The constants and method names used, like the event types and `GetWorldObjectById`, are for illustrative purposes and should be replaced with the actual implementations available in your modding environment.

## GetNearestCreature
Finds and returns the nearest creature in sight of the WorldObject based on specified criteria. This can include range, creature entry ID, hostile status, and whether the creature is alive or dead.  
    
### Parameters <hr />
- `range?`: number (optional) - The maximum distance to search for a nearby creature. If not specified, the default search range is used.
- `entryId?`: number (optional) - The entry ID of the creature to search for. If not specified, any nearby creature can be returned.
- `hostile?`: number (optional) - Specifies whether to search for hostile creatures (`1` = yes, `0` = no). If not specified, both hostile and friendly creatures are considered.
- `dead?`: number (optional) - Specifies whether to include dead creatures in the search (`1` = yes, `0` = no). If not specified, only living creatures are considered.
  
### Returns  
- `creature`: [Creature](./creature.md) - The nearest creature that matches the specified criteria.

### Example Usage:
Script to check for nearby hostile creatures within a 30-yard range and alert the player if any are found.

```typescript

// Define a custom event for players entering a specific area
const onPlayerEnterArea: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number): void => {
    
    // Specify the search criteria
    const HOSTILE_CREATURE_ENTRY_ID = 12345; // Example creature entry ID
    const SEARCH_RANGE = 30; // 30-yard search range
    const HOSTILE_STATUS = 1; // Search for hostile creatures
    const INCLUDE_DEAD = 0; // Exclude dead creatures from search
    
    // Find the nearest hostile creature within the range
    const nearestHostileCreature = player.GetNearestCreature(SEARCH_RANGE, HOSTILE_CREATURE_ENTRY_ID, HOSTILE_STATUS, INCLUDE_DEAD);
    
    if (nearestHostileCreature) {
        player.SendBroadcastMessage(`Beware! A hostile creature lurks nearby.`);
    }
    else {
        player.SendBroadcastMessage(`The area is clear. No immediate threats detected.`);
    }
};

// Registers the event to be triggered upon player zone update
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => onPlayerEnterArea(...args));
```
In this example, a custom event is created to execute whenever a player updates their zone (which could be upon entering a new area, for example). The script searches for the nearest hostile creature within a 30-yard radius. If a matching creature is found, the player is alerted of a nearby threat. This can be particularly useful for custom quests or zones where player awareness of potential dangers is crucial.

## GetNearestGameObject
Retrieves the nearest [GameObject](./gameobject.md) within the sight of the [WorldObject], allowing for optional filtering based on range, entry ID, and hostility.

### Parameters <hr />
* `range`: number (Optional) - The maximum distance to search for the GameObject.
* `entryId`: number (Optional) - Specific entry ID of the GameObject to find.
* `hostile`: number (Optional) - Hostility flag, where applicable, to filter GameObjects based on their hostility status.

### Returns 
* gameObject: [GameObject](./gameobject.md) - The nearest GameObject found based on the provided criteria. Returns `null` if no suitable GameObject is found.

### Example Usage: 
Script for a custom event where players must find a specific object within a range. This could be part of a scavenger hunt quest where players have to find hidden objects around them.

```typescript
const SCAVENGER_HUNT_OBJECT_ENTRY_ID = 190000; // Example entry ID for the scavenger hunt object
const SEARCH_RANGE = 50; // The search range in game units

// Handler for when a player triggers the custom scavenger hunt quest
const StartScavengerHunt: player_event_on_custom = (event: number, player: Player): void => {
    // Attempt to find the nearest scavenger hunt object within range
    const nearestObject = player.GetNearestGameObject(SEARCH_RANGE, SCAVENGER_HUNT_OBJECT_ENTRY_ID);

    if(nearestObject) {
        player.SendBroadcastMessage(`You have found the object: ${nearestObject.GetGUID()}! Return to the quest giver.`);
        // Implement additional logic for when the player finds the object
        // For example, updating a quest status, giving a reward, etc.
    } else {
        player.SendBroadcastMessage(`No scavenger hunt objects found within range. Keep looking!`);
    }
};

// Register the custom event with a hypothetical event handler for when a player starts the scavenger hunt quest
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CUSTOM, (...args) => StartScavengerHunt(...args));
```
In this example, when a player engages with the scavenger hunt quest, they are tasked with finding a specific GameObject within a predefined range. The script uses the `GetNearestGameObject` method to find the nearest object that matches the criteria (in this case, an object with a specific entry ID within a certain range). If such an object is found, the player is notified of their success; otherwise, they are encouraged to continue searching.

## GetNearestPlayer
Find the nearest player to the `WorldObject`, optionally filtering based on range, hostility, and life status.

### Parameters
- `range?`: number (optional) - The maximum distance to look for the player. If not specified, uses default sight range.
- `hostile?`: number (optional) - If set to 1, only searches for hostile players. If set to 0, ignores hostility. If not specified, includes all players regardless of hostility.
- `dead?`: number (optional) - If set to 1, includes dead players in the search. If set to 0 or not specified, only searches for alive players.

### Returns
- `player`: [Player](./player.md) - The nearest [Player] object found within the criteria or `null` if no suitable player was found.

### Example Usage:
Script to notify a player when they come close to an enemy player, potentially triggering a PvP scenario.

```typescript
const onWorldObjectUpdate: world_object_event_on_update = (event: number, worldObject: WorldObject): void => {
    // Try to find a nearby hostile player within 20 yards
    const nearestHostilePlayer = worldObject.GetNearestPlayer(20, 1, 0);
    
    if (nearestHostilePlayer != null) {
        // Inform the player about the nearby hostile
        nearestHostilePlayer.SendMessage("[Warning]: You are close to an enemy player!");
    }
}

RegisterWorldObjectEvent(WorldObjectEvents.WORLD_OBJECT_EVENT_ON_UPDATE, (...args) => onWorldObjectUpdate(...args));
```

This script attaches to the world object update event. It uses the `GetNearestPlayer` method to search for the nearest player within a 20-yard range who is hostile and alive. If such a player is found, it sends a warning message to the player, alerting them of the nearby enemy. This could be used in custom PvP encounters, questing areas with PvP-enabled objectives, or simply to enhance the world's interactiveness in PvP-enabled zones.

## GetO
Retrieve the current orientation of the WorldObject in the game world. This method will provide the direction where the object is facing in terms of radians. Orientation is measured clockwise from the north direction, and can be used to position or rotate objects correctly within the game environment.

### Returns
orientation: number - The current orientation of the WorldObject in radians.

### Example Usage:
This script sets an NPC to face towards a specific orientation when a player interacts with it, creating a dynamic interaction where the NPC appears to turn towards a point of interest based on the player's action.

```typescript
const NPC_ENTRY = 12345; // Example NPC Entry ID from creature_template
const SPECIFIC_ORIENTATION = 4.71239; // 270 degrees in radians; West

const OnNPCInteract: npc_event_on_gossip_hello = (event: number, player: Player, npc: Creature) => {
    if (npc.GetEntry() == NPC_ENTRY) {
        npc.SetOrientation(SPECIFIC_ORIENTATION);
        player.SendBroadcastMessage("The NPC turns to face West.");
    }
}

RegisterCreatureGossipEvent(NPC_ENTRY, NpcEvents.NPC_EVENT_ON_GOSSIP_HELLO, (...args) => OnNPCInteract(...args));
```
In this example, the `SetOrientation` method is hypothetically used to change the NPC's facing direction and is not part of the original class definitions provided. However, this showcases how to utilize the `GetO` method in a practical scenario, ensuring the NPC faces a predetermined direction when a player interacts with it. This can enhance gameplay by adding a level of interaction and realism to NPC behaviors.

## GetPhaseMask
This method retrieves the current phase mask of the WorldObject. In AzerothCore, phases are a way to control the visibility and interaction of objects, NPCs, and players within the world. Depending on the phase mask a player is in, they might see different NPCs, objects, or even complete different versions of quests. This method is particularly useful for scripting events or quests that require phase changes or checks.

### Returns
`phaseMask`: number - The phase mask assigned to the WorldObject. The phase mask is a bitmask with each bit representing a different phase. A phase mask of 1 represents the base phase that all players are in by default. Higher numbers represent custom phases.

### Example Usage
In this example, we're scripting a custom quest that teleports the player to a different phase once they reach a certain area, and we want to make sure they're not already in that phase to avoid unnecessary teleportation or phase changes.

```typescript
const PHASE_QUEST_AREA = 2; // Assume this is the phase for the special quest area

const OnPlayerMove: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number): void => {
    // Assuming 1000 is the area ID of interest
    if (newArea === 1000) {
        const currentPhase = player.GetPhaseMask();
        
        // Check if player is not already in the quest phase
        if (currentPhase !== PHASE_QUEST_AREA) {
            player.SetPhaseMask(PHASE_QUEST_AREA, true); // This hypothetical method sets the player's phase
            player.SendMessage("You feel the world around you change...");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => OnPlayerMove(...args));
```

In this script, when players move into the area with the ID of 1000, the game checks their current phase. If they're not already in the quest phase (designated with a phase mask of `2`), it changes their phase to match the quest requirements. A message is broadcasted to the player to notify them of this change, enhancing the immersive experience.

This is a crucial tool for developers when working with phased content, allowing for dynamic and engaging player experiences based on their progression and actions within the game world.

## GetPlayersInRange
This method retrieves a list of [Player](./player.md) objects that are within a certain range of the [WorldObject]. The method can further filter the players based on whether they are hostile or not, and whether they include dead players.

### Parameters
- `range`: number (optional) - Specifies the range in yards within which players should be detected. If not specified, uses the default visibility range.
- `hostile`: number (optional) - Specifies whether to include hostile (`1`), friendly (`0`), or both types of players (`2`). If not specified, it defaults to include both.
- `dead`: number (optional) - Specifies whether to include dead players (`1`) in the result. Alive players are always included. If not specified, dead players are not included.

### Returns 
- `players`: Array of [Player](./player.md) - A list of player objects found within the specified range and under the specified conditions.

### Example Usage:  
Script to send a warning message to all nearby hostile players when an important NPC is attacked.  
```typescript
const NPC_ENTRY_ID = 12345; // Example NPC entry ID
const WARNING_RANGE = 50; // Yards

const OnNPCAttacked: npc_event_on_receive_damage = (event: number, creature: Creature, attacker: Unit): void => {
    if(creature.GetEntry() === NPC_ENTRY_ID) {
        const nearbyHostilePlayers = creature.GetPlayersInRange(WARNING_RANGE, 1, 0);
        
        nearbyHostilePlayers.forEach(player => {
            player.SendAreaTriggerMessage("You dare to attack our leader? Guards, to me!");
        });
    }
}

RegisterCreatureEvent(NPC_ENTRY_ID, CreatureEvents.CREATURE_EVENT_ON_JUST_TOOK_DAMAGE, (...args) => OnNPCAttacked(...args));
```
In this example, when a specific NPC (identified by `NPC_ENTRY_ID`) is attacked, it triggers a search for hostile players within a 50-yard range (`WARNING_RANGE`). For each hostile player found, a warning message is sent. This scenario can enhance the immersion and interaction within the game, setting up potential PvP encounters or alerting players to the presence of an important NPC under attack.

Based on the provided Player class examples, here is how the documentation for the WorldObject's `GetRelativePoint` method could be formatted into a consistent markdown documentation style for modding with mod-eluna on AzerothCore.

## GetRelativePoint
Calculates the coordinates `(x, y, z)` of a point that is a certain distance away from the `[WorldObject]`, taking into account the provided angle. This is especially useful for positioning objects or characters in the world relative to an existing WorldObject, such as spawning NPCs in a circle around a central point.

### Parameters <hr />
* `distance`: number - The distance from the `[WorldObject]` to the desired point.
* `angle`: number - The angle (in radians) at which to project the point from the `[WorldObject]`. 

### Returns
* `(x, y, z)`: LuaMultiReturn<[number, number, number]> - A tuple containing the x, y, and z coordinates of the calculated point.

### Example Usage:
Let's say you want to create a script that spawns guardians in a circle around a player when they enter a specific zone. Here's how you might use `GetRelativePoint` to calculate the spawn points for these guardians.

```typescript
const ZONE_ID = 123; // Example zone ID
const GUARDIAN_ENTRY_ID = 98765; // NPC Entry ID of the guardian
const NUM_GUARDIANS = 8; // Number of guardians to spawn
const SPAWN_DISTANCE = 5; // Distance from the player at which to spawn the guardians

const onPlayerZone: player_event_on_zone = (event: number, player: Player, newZoneId: number, newAreaId: number): void => {
    if (newZoneId === ZONE_ID) {
        const angleStep = 2 * Math.PI / NUM_GUARDIANS; // Divide a circle into equal parts based on the number of guardians
        for (let i = 0; i < NUM_GUARDIANS; i++) {
            const angle = i * angleStep;
            const [x, y, z] = player.GetRelativePoint(SPAWN_DISTANCE, angle);
            // Here, you would spawn the guardian at the calculated coordinates
            // This is a conceptual example, actual NPC spawning code would depend on your server's API
            console.log(`Spawn guardian ${i + 1} at (${x}, ${y}, ${z})`);
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ZONE, (...args) => onPlayerZone(...args));
```

In this example, when a player enters the specified zone, the script calculates points in a circle around the player to spawn guardians evenly distributed. `GetRelativePoint` is used to find each point's coordinates, ensuring guardians are placed at the correct distance and angle from the player.

## GetX
Retrieves the current X coordinate position of the WorldObject within the game world. This can be valuable for numerous calculations such as distance checks, location validation, and more within custom scripts or modules.

### Returns
X: number - The current X coordinate of the WorldObject.

### Example Usage:
In the example below, we illustrate how to use the `GetX` method within a custom event handling function to determine a player's current location when they enter combat. This might be useful for scenarios where player position is crucial, such as initiating specific world events based on player coordinates, custom battleground mechanisms, or simply for gathering data on player movement across zones for analysis.

```typescript
const onPlayerEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const playerX = player.GetX();
    console.log(`Player entered combat at X coordinate: ${playerX}`);

    // Example: Trigger a custom event if the player is within a specific X coordinate range
    if (playerX > 1000 && playerX < 2000) {
        console.log("Player is within the event zone!");
        // Trigger a custom event or function based on player location
        // triggerCustomEventBasedOnLocation(player);
    } else {
        console.log("Player is outside the event zone.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onPlayerEnterCombat(...args));
```

In this script, when a player enters combat, it logs their current X position and checks if they are within a specified range (X coordinates 1000 to 2000). If the player is within this range, a custom log message is printed, potentially triggering other custom events or functions tailored to this location. Such precise handling enables developers to create immersive and dynamic content responsive to player actions and locations.

## GetY

This method allows you to obtain the current Y coordinate of the [WorldObject]. This can be particularly useful when you need to perform actions based on the object's location in the world. 

### Returns

number: The Y coordinate of the [WorldObject]

### Example Usage:

In this example, we will create a simple script that broadcasts a message in the world chat, informing players of the Y coordinate of a particular [WorldObject]. This could be particularly useful for custom events or quests where the location of an object or NPC matters.

```typescript
const BroadcastObjectYCoordinate: world_event_on_chat = (event: number, player: Player, msg: string, type: number, lang: number, receiver: Player) => {
    // Assuming there's a WorldObject of interest, like a unique NPC or object in the game
    let worldObject: WorldObject; // This would be obtained through some other means in a real script

    let yCoordinate = worldObject.GetY();
    let broadcastMessage = `The Y coordinate of the special object is: ${yCoordinate}. Hurry up and find it!`;

    // Broadcasts the Y coordinate in the world chat
    ChatHandler.SendGlobalSysMessage(broadcastMessage);
}

RegisterWorldEvent(WorldEvents.WORLD_EVENT_ON_CHAT, (...args) => BroadcastObjectYCoordinate(...args));
```

In this script:
- We assume there is a specific `WorldObject` we're interested in. This object could be anything from an NPC to a unique object in the game world.
- We obtain the Y coordinate of this object by using the `GetY()` method.
- We then construct a message that includes this Y coordinate.
- Finally, we broadcast this message to all players in the server using `ChatHandler.SendGlobalSysMessage()`, encouraging them to find the special object based on its Y coordinate.

This script illustrates how you can use the `GetY()` method in a practical scenario to enhance gameplay or event participation, by guiding players towards a specific in-game location.

## GetZ
Retrieves the current Z coordinate (height/altitude) of the WorldObject. This can be particularly useful for determining the position of a player, NPC, or object within the game world, especially when working with height-related functionalities such as flying or jumping. 

### Returns
number: The Z coordinate of the WorldObject.

### Example Usage:
This script shows how to use the GetZ method to check if a player is above a certain height before allowing them to engage in a scripted event. It demonstrates handling player altitude in custom script events.

```typescript
const PLAYER_EVENT_ON_CUSTOM_SCRIPT = 1;  // Custom event ID for demonstration
const REQUIRED_ALTITUDE = 100;  // Example required altitude to trigger the event

const checkPlayerAltitude: player_script_event = (eventId: number, player: Player): void => {
    const playerAltitude = player.GetZ();  

    if(playerAltitude > REQUIRED_ALTITUDE) {
        // Player is above the required altitude
        player.SendBroadcastMessage("You are high enough!");
        // Trigger event or action based on altitude
        // For example, enable access to a special flying challenge or area
    } else {
        // Player is not high enough
        player.SendBroadcastMessage("You need to be higher to start this challenge!");
    }
}

RegisterPlayerEvent(PLAYER_EVENT_ON_CUSTOM_SCRIPT, (...args) => checkPlayerAltitude(...args));
```

This example uses a custom player event to check the player's altitude when the event is triggered. Depending on the player's Z coordinate (`GetZ()`), it either allows them to proceed with an action/event or notifies them that they need to be at a higher altitude. Use cases include creating altitude-based triggers or conditions within custom scripts and mods for AzerothCore.

## GetZoneId
Retrieve the current zone ID where the [WorldObject] is located. This can be especially useful when writing scripts that require behavior changes based on the zone a player or another world object is in. For example, triggering specific events only in certain zones.

### Returns
zoneId: number - The ID of the zone. Zone IDs can be mapped to their respective names and details by consulting the `area_table` in the AzerothCore database.

### Example Usage:

A simple script to warn players entering a specific zone (e.g., a zone with ID 1234) that they are entering a dangerous area.

```typescript
const ZONE_DANGEROUS_AREA = 1234;
const WARNING_MESSAGE = "You are entering a dangerous area! Be prepared for tough battles.";

const onPlayerEnterZone: world_object_event_on_update_zone = (event: number, player: Player): void => {
    // Check if the WorldObject is a Player and in the dangerous zone
    if (player.GetZoneId() == ZONE_DANGEROUS_AREA) {
        player.SendBroadcastMessage(WARNING_MESSAGE); // Send a warning message to the player
    }
}

// Register event to check each time a player changes zones
RegisterWorldObjectEvent(WorldObjectEvents.WORLD_OBJECT_EVENT_ON_UPDATE_ZONE, (...args) => onPlayerEnterZone(...args));
```

This script utilizes the `GetZoneId` method to get the current zone of the player. When a player enters the zone with ID 1234, it sends a broadcast message warning them about the upcoming challenges. This is a simple yet effective way of dynamically interacting with players based on their location within the game world.

## IsInBack
Determines if the target is within a specified arc behind the [WorldObject]. This method is useful for implementing mechanics that require positional awareness, such as backstab attacks in combat scenarios.

### Parameters
* target: [WorldObject](./worldobject.md) - The target object to check the position of.
* arc: number (optional) - The arc angle in degrees to consider as "behind". If not specified, a default value defined by the implementation might be used.

### Returns
* boolean: Returns `true` if the target is in the specified arc behind the WorldObject, `false` otherwise.

### Example Usage:

In this example, a rogue character is implementing a backstab attack that can only be executed if the target is within a 90-degree arc behind the character. The specific arc value can be adjusted based on game mechanics or skill descriptions.

```typescript
const rogueBackstab: player_event_on_spell_cast = (event: number, player: Player, spellId: number, target: WorldObject): void => {
    // Assuming 1787 is the Spell ID for "Backstab"
    if (spellId === 1787) {
        // Check if the target is within a 90-degree arc behind the player
        if (player.IsInBack(target, 90)) {
            // Proceed with backstab mechanics, possibly including damage calculations
            console.log(`Backstab success! Target is in the required position.`);
            // Implement additional backstab logic here
        } else {
            console.log(`Backstab failed: Target needs to be behind the player.`);
            // Handle the case where the player cannot backstab due to positioning
            // This might involve cancelling the spell cast, notifying the player, etc.
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SPELL_CAST, (...args) => rogueBackstab(...args));
```
In this scenario, the `IsInBack` method is crucial for determining the positional validity of executing certain abilities such as a rogue's backstab. The example demonstrates how one might check for positional requirements before allowing specific combat actions to proceed. This increases the depth and strategy involved in combat encounters within the game.

# IsInFront

This method checks if a target is within a specified arc in front of the `WorldObject`. This can be particularly useful for determining if an entity is facing another before performing an action, such as casting a spell or initiating combat.

### Parameters
- `target`: [WorldObject](./worldobject.md) - The target to check against.
- `arc`: number (optional) - The arc angle in radians. If not specified, a default value is used.

### Returns
- `boolean`: Returns `true` if the target is within the specified arc in front of the `WorldObject`, otherwise returns `false`.

### Example Usage

Let's create a scenario where a caster checks if their target is in front of them within a 180-degree arc before casting a spell. This ensures the caster only performs the action if facing the target, adding a layer of strategy and realism to the encounter.

```typescript
const SPELL_CAST_EVENT = (caster: WorldObject, target: WorldObject): void => {
    // Define the arc as Pi radians (180 degrees)
    const arcInRadians = Math.PI; 
    
    // Check if the target is in front within the 180-degree arc
    if(caster.IsInFront(target, arcInRadians)) {
        // Cast the spell or perform the action here
        console.log(`Casting spell on target: ${target.GetGUID()}`);
    } else {
        console.log(`Target is not in front within the specified arc. Cannot cast spell.`);
    }
}

// Example registration for the event, depending on how your mod handles events
RegisterSomeEvent(SOME_EVENT_ID, (...args) => SPELL_CAST_EVENT(...args));
```

In this example, `SPELL_CAST_EVENT` is a function designed to take in a caster and a target `WorldObject`. Before performing the spell cast, it uses `IsInFront` to determine if the target is within a 180-degree arc in front of the caster. This approach can be particularly useful in mods where facing direction and positioning play critical roles in gameplay mechanics.

# IsInMap
Determines if two WorldObjects are located within the same map. This method is essential for checking spatial relations without needing the exact positions of the objects. Known applications include verifying if two characters can interact based on their current maps or triggering map-specific events based on player locations.

### Parameters
- `worldobject`: [WorldObject](./worldobject.md) - Another WorldObject to check against.

### Returns
- `boolean` - Returns `true` if both WorldObjects are on the same map, `false` otherwise.

### Example Usage:
Suppose there's a scenario where a special event should be triggered only if a certain NPC (Non-Player Character) and a player are in the same map. The following scripted event demonstrates how `IsInMap` could be utilized to check for this condition and initiate a quest or a dialogue accordingly.

```typescript
// Assuming there's an NPC with a known GUID (Global Unique Identifier)
const SPECIAL_NPC_GUID: number = 123456789;

const TriggerSpecialEvent: player_event_on_update_zone = (event: number, player: Player): void => {
    const npc: WorldObject = GetWorldObjectByGUID(SPECIAL_NPC_GUID);

    // Check if player and NPC are in the same map
    if (player.IsInMap(npc)) {
        console.log("Both player and the special NPC are in the same map. Triggering event...");

        // Trigger a special quest or dialogue
        StartSpecialQuest(player);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => TriggerSpecialEvent(...args));

function StartSpecialQuest(player: Player): void {
    // Code to start a quest or interaction
    console.log(`Starting special event for ${player.GetName()}`);
}
```

In this example, the `TriggerSpecialEvent` function is called every time a player changes zones (including moving to a different map). It retrieves a `WorldObject` for a specific NPC using a simulated `GetWorldObjectByGUID` function (Pseudocode, as accessing NPCs directly is not part of the provided API). It then checks whether the player and the NPC are on the same map using the `IsInMap` method of the `Player` class, which inherits from `WorldObject`. If they are on the same map, a special event is initialized for that player.

## IsInRange
This method checks if the target `WorldObject` is within a specific range from the caller `WorldObject`. The option to measure distance in two or three dimensions provides versatility in determining proximity for various gameplay elements.

### Parameters
- `target`: [WorldObject](./worldobject.md) - The WorldObject to check the distance to.
- `minrange`: number - The minimum distance from the caller WorldObject. The target is considered in range if it is further than this.
- `maxrange`: number - The maximum distance from the caller WorldObject. The target is considered in range if it is closer than this.
- `is3D`: boolean (optional) - If true, the distance is measured considering all three dimensions (x, y, z). Otherwise, only the horizontal distance (x, y) is considered.

### Returns
- `boolean` - Returns `true` if the target is within the specified range, `false` otherwise.

### Example Usage:
Check if a player needs to be closer to an NPC to start a quest interaction, considering only horizontal distance.
```typescript
const NPC_ENTRY_FOR_QUEST = 12345;
const INTERACTION_RANGE_MIN = 0;
const INTERACTION_RANGE_MAX = 5;

// This event is triggered when a player moves.
const OnPlayerMovement: player_event_on_movement = (event: number, player: Player): void => {
    const nearbyNpcs = player.GetNearbyCreatures(INTERACTION_RANGE_MAX, NPC_ENTRY_FOR_QUEST);
    nearbyNpcs.forEach(npc => {
        // Check if the NPC is within interaction range
        if (player.IsInRange(npc, INTERACTION_RANGE_MIN, INTERACTION_RANGE_MAX, false)) {
            // Proceed with quest interaction
            console.log(`Player ${player.GetName()} is in range with NPC for quest.`);
            // Add any interaction logic here...
        }
    });
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVEMENT, (...args) => OnPlayerMovement(...args));
```
In this example, when a player moves, it checks for nearby NPCs within 5 meters (ignoring vertical distance) that are relevant to a quest. If the player is within the specified range of the NPC, a message is logged to the console, and any intended interaction logic could be implemented at that point. This demonstrates a simple way to trigger quest interactions based on proximity.


## IsInRange2d

Determines if a given point in 2D space is within a specified range from the WorldObject. The distance check accounts for the WorldObject's boundaries, ensuring the point is checked against the object's edge rather than its center.

### Parameters
- `x`: number - The X coordinate of the point to check.
- `y`: number - The Y coordinate of the point to check.
- `minrange`: number - The minimum distance from the WorldObject for the point to be considered in range.
- `maxrange`: number - The maximum distance from the WorldObject for the point to be considered in range.

### Returns
- `boolean` - Returns `true` if the point `(x, y)` is within the specified range (`minrange` to `maxrange`) of the WorldObject, otherwise returns `false`.

### Example Usage:
Imagine a scenario where you want to trigger an event if a player is within a certain distance from a world object, such as entering a dangerous area or activating a trap. 

```typescript
const TRAP_X = 100.25;
const TRAP_Y = 50.75;
const MIN_DISTANCE_FOR_TRIGGER = 0;
const MAX_TRAP_TRIGGER_DISTANCE = 5;

const onPlayerMove: player_event_on_move = (event: number, player: Player, newX: number, newY: number): void => {
    let trap = getWorldObject(TRAP_X, TRAP_Y); // Custom function to retrieve the trap object

    if(trap.IsInRange2d(newX, newY, MIN_DISTANCE_FOR_TRIGGER, MAX_TRAP_TRIGGER_DISTANCE)) {
        console.log("Player has triggered the trap!");
        // Additional logic to handle the trap activation
    } else {
        console.log("Player is safe from the trap... for now.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (...args) => onPlayerMove(...args));
```

### Detailed Explanation:

This method is perfect for situations where you need to activate certain gameplay mechanics based on the player's or any other entity's position relative to an object in the game world. It accounts for the object's actual dimensions by measuring the distance from its edges, making it extremely useful for precision-based triggers or area-effect calculations within the modding environment of AzerothCore and mod-eluna.

## IsInRange3d

Checks whether a given point in 3D space is within a specified range from the edge of the WorldObject. This can be used to determine if entities or locations are within a certain distance, allowing for proximity-based logic in scripts.

### Parameters

* `x`: number - The x-coordinate of the point to check.
* `y`: number - The y-coordinate of the point to check.
* `z`: number - The z-coordinate of the point to check.
* `minrange`: number - The minimum range from the WorldObject's edge. The point must be further than this distance to return true.
* `maxrange`: number - The maximum range from the WorldObject's edge. The point cannot be further than this distance to return true.

### Returns

`true` if the point is within the specified range from the WorldObject, `false` otherwise.

### Example Usage

In this example, we will create an event where a custom spell triggers if an enemy player enters within a 5 to 30-yard radius of a game object (e.g., a trap).

```typescript
const TRAP_SPELL_ENTRY = 12345; // Example spell entry
const MIN_RANGE = 5;
const MAX_RANGE = 30;

const OnMoveOrSpawn: worldobject_event_on_update = (event: number, worldObject: WorldObject, enemy: Player) => {
    
    // Retrieve enemy player position
    const enemyX = enemy.GetX();
    const enemyY = enemy.GetY();
    const enemyZ = enemy.GetZ();

    // Check if enemy player is within specified range of the trap
    if(worldObject.IsInRange3d(enemyX, enemyY, enemyZ, MIN_RANGE, MAX_RANGE)) {
        // Cast spell if in range
        worldObject.CastSpell(enemy, TRAP_SPELL_ENTRY);
        console.log(`Trap activated for player at (${enemyX}, ${enemyY}, ${enemyZ})`);
    }
}

// Assuming we register this pseudocode function to fire on every movement update or spawn of a WorldObject and enemy player
RegisterWorldObjectEvent(WorldObjectEvents.WORLD_OBJECT_EVENT_ON_UPDATE, (...args) => OnMoveOrSpawn(...args));
```

In this example, `OnMoveOrSpawn` is invoked whenever there is an update event for any `WorldObject`. It checks if an enemy `Player` is within a specified range using `IsInRange3d`. If the condition is met, a spell (trap) is activated, affecting the player. This can be tailored for specific scenarios like setting traps around strategic locations in a custom PvP battleground or creating dynamic events based on player proximity to objects or NPCs.


## IsWithinDist

This method determines whether a target WorldObject is within a specified distance from the calling WorldObject. It accounts for the physical boundaries of both objects and can consider either 2D (ignoring elevation differences) or 3D distances based on the `is3D` parameter.

### Parameters
- `target`: [WorldObject](./worldobject.md) - The WorldObject to check the distance against.
- `distance`: number - The maximum distance to check. This is measured from the edges of both WorldObjects.
- `is3D`: boolean (optional) - If `true`, the method considers the 3D distance (taking height differences into account). If `false` or omitted, only the 2D distance (ignoring elevation) is considered.

### Returns
- `boolean` - Returns `true` if the target WorldObject is within the specified distance; otherwise, `false`.

### Example Usage:
The following example demonstrates a scripted event where a player's proximity to a special NPC triggers a custom greeting if they are within 10 units distance in a 2D plane.

```typescript
const SPECIAL_NPC_ENTRY = 12345;
const PROXIMITY_DISTANCE = 10;

const OnPlayerMove: player_event_on_movement = (event: number, player: Player) => {
    // Assuming GetClosestCreatureOfEntry is a helper function that retrieves the closest NPC of a given entry to the player
    const specialNpc = GetClosestCreatureOfEntry(player, SPECIAL_NPC_ENTRY);
    
    if(specialNpc && player.IsWithinDist(specialNpc, PROXIMITY_DISTANCE, false)) {
        player.SendBroadcastMessage("You've approached the mysterious figure. It eyes you curiously.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (...args) => OnPlayerMove(...args));
```

In this example, we use the `IsWithinDist` function to check if the player has moved within a 10-unit radius of a 'Special NPC'. If the condition is met, the player receives a custom broadcast message. This can be adapted for various use cases, such as triggering quests, spawning enemies, or creating proximity-based puzzles in a mod for AzerothCore.

## IsWithinDist2d
This method checks if a given point in two-dimensional space is within a specific distance from the [WorldObject]. It's particularly useful for situations where you need to check spatial relationships on a plane, ignoring vertical displacement. The method measures distance from the object's edge, enhancing precision in positioning-related checks.

### Parameters <hr />
- `x`: number - The X coordinate of the point to check against.
- `y`: number - The Y coordinate of the point to check against.
- `distance`: number - The radius within which the point must lie from the [WorldObject].

### Returns
- `boolean`: Returns `true` if the point (`x`, `y`) is within the specified `distance` from the [WorldObject], taking into account only the X and Y coordinates. Returns `false` otherwise.

### Example Usage:

Assuming you have a quest that requires a player to reach a specific location on the map, you may want to check if the player is close enough to a quest item or point of interest. This example demonstrates how you could use `IsWithinDist2d` to verify the player's position relative to an objective marked by its `x` and `y` coordinates on a two-dimensional plane. 

```typescript
// Quest Objective Location
const QUEST_TARGET_X = 2567.5;
const QUEST_TARGET_Y = 5422.3;
const QUEST_RADIUS = 10; // 10 units distance considered "reached"

// This function could be called whenever a player moves, to check if they've reached the objective
function checkQuestObjectiveReached(player: Player) {
    const playerPosition = player.GetPosition(); // Assuming GetPosition returns an object with x, y properties

    if(player.IsWithinDist2d(QUEST_TARGET_X, QUEST_TARGET_Y, QUEST_RADIUS)) {
        console.log("Quest objective reached! Congratulations.");
        // Further code to handle quest completion or update
    } else {
        console.log("Keep searching, you're not there yet.");
    }
}

// Hypothetical event registration for when a player moves
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (player: Player) => {
    checkQuestObjectiveReached(player);
});
```

In this script, when the player moves, `checkQuestObjectiveReached` is called to determine if the player has reached within 10 units of the quest target location, considering only the x and y coordinates for simplicity. If the player is close enough, a message is logged (or any other quest-related logic could be executed), and if not, a different message offers encouragement to continue.

# IsWithinDist3d

Determines if a specified point in three-dimensional space is within a given distance from the `WorldObject`, measured from the object's edge. This can be particularly useful for measuring proximity between players, NPCs, or any other world entities in custom scripts or gameplay mechanics.

### Parameters

- `x`: number - The X-coordinate of the point to check.
- `y`: number - The Y-coordinate of the point to check.
- `z`: number - The Z-coordinate of the point to check.
- `distance`: number - The distance to check against.

### Returns

- `boolean` - Returns `true` if the specified point is within the designated distance from the [WorldObject](./worldobject.md), otherwise returns `false`.

### Example Usage

In this example, we create a custom event that checks if players are within a certain distance of a quest NPC to trigger a custom interaction, such as providing a hint or summoning a helper NPC.

Given an NPC with coordinates `(npcX, npcY, npcZ)`, we want to check if players coming within 10 units of the NPC trigger the custom event.

```typescript
// Coordinates for our NPC
const npcX = 1234.56;
const npcY = 6543.21;
const npcZ = 78.90;
const proximityTriggerDistance = 10; // The distance within which the event is triggered

const npcProximityCheck: player_event_on_update_zone = (event: number, player: Player): void => {
    // Gets player's current position
    const playerX = player.GetPositionX();
    const playerY = player.GetPositionY();
    const playerZ = player.GetPositionZ();

    // Checks if the player is within the specified distance of the NPC
    if(player.IsWithinDist3d(npcX, npcY, npcZ, proximityTriggerDistance)) {
        // Custom interaction goes here
        player.SendBroadcastMessage("You sense a mysterious presence...");
        
        // Optionally, summon a helper NPC or create other interactions
        // This part of the script would depend on further API method calls
    }
}

// Registers our custom event to constantly check player's proximity to the NPC
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => npcProximityCheck(...args));
```

This script effectively demonstrates how the `IsWithinDist3d` method can be employed to enhance the gameplay experience in AzerothCore by triggering events based on spatial conditions.

## IsWithinDistInMap
Determines whether the current [WorldObject] is on the same map and within a specified distance from a target [WorldObject]. Unlike a straightforward distance check, this method takes into consideration the boundaries of each object, meaning it measures from their edges rather than their center points. An optional parameter allows for the specification of whether the distance calculation should be in three dimensions (considering height) or just two.

### Parameters
- **target:** [WorldObject](./worldobject.md) - The target WorldObject to compare distance with.
- **distance:** number - The maximum distance allowed between the edges of the two WorldObjects.
- **is3D:** boolean (optional) - Whether to calculate distance in three dimensions. Defaults to `false` for two-dimensional distance.

### Returns
- **boolean:** Returns `true` if the current WorldObject is within the specified distance of the target WorldObject on the same map, `false` otherwise.

### Example Usage
Below is a sample script that could be used in a custom boss fight. This script checks whether players are within a certain distance from the boss to determine if they get hit by a specific ability. This could be used to encourage players to spread out or to gather close, depending on the boss mechanics.

```typescript
const BOSS_ABILITY_DISTANCE = 30; // Distance within which players will be hit by the boss's ability.

const onBossAbility: event_script_code = (event: number, boss: Creature, args: any): void => {
    // Assuming 'boss' is a Creature derived from WorldObject and thus has access to IsWithinDistInMap
    const players = GetPlayersInMap(boss.GetMapId());
    players.forEach(player => {
        if (boss.IsWithinDistInMap(player, BOSS_ABILITY_DISTANCE)) {
            // Apply effect to players within distance
            // This could be a damaging spell, a debuff, etc., depending on the desired boss mechanic
            console.log(`Player ${player.GetName()} is hit by the boss's ability!`);
        } else {
            console.log(`Player ${player.GetName()} is safe from the boss's ability.`);
        }
    });
};

// Register this script to be called during the boss fight, perhaps as part of an AI event
RegisterCreatureEvent(MY_BOSS_ENTRY_ID, CreatureEvents.CREATURE_EVENT_ON_CUSTOM_EVENT_1, (...args) => onBossAbility(...args));
```

In this example, the `IsWithinDistInMap` method facilitates a pivotal game mechanic by allowing the script to dynamically assess player positions relative to the boss, executing gameplay logic based on spatial relationships in the game world.

## IsWithinLoS

Determines if a given [WorldObject] or a set of coordinates (x, y, z) is within the line of sight of the calling [WorldObject]. Ensuring that spells, ranged attacks, or visual effects are not obstructed is a common use for this method. This can enhance NPC AI or player interaction within scripted events.

### Parameters

* `worldobject`: [WorldObject](./WorldObject.md) - The WorldObject to check line of sight against. *(Optional if coordinates are provided)*
* `x`: number - The x coordinate. *(Required if no WorldObject is provided)*
* `y`: number - The y coordinate. *(Required if no WorldObject is provided)*
* `z`: number - The z coordinate. *(Required if no WorldObject is provided)*

### Returns

* `boolean`: Returns `true` if the [WorldObject] or coordinates are within the line of sight, `false` otherwise.

### Example Usage:

Below is a sample script where an NPC checks if a player is within its line of sight before casting a spell. This can be particularly useful in custom quests or events where NPC behavior needs to be precise and realistic.

```typescript
const NPC_ENTRY = 12345;
const SPELL_FIREBALL = 133;

// Custom event for an NPC casting a spell on sight
const CastSpellOnSight: creature_event_on_ai_update = (event: number, creature: Creature, diff: number): void => {
    // Assume 'player' is a globally accessible Player object in this context
    if (creature.IsWithinLoS(player)) {
        creature.CastSpell(player, SPELL_FIREBALL, true);
        console.log("Casting Fireball!");
    } else {
        console.log("Player is out of sight!");
    }
}

// Register the AI update event for your NPC
RegisterCreatureEvent(NPC_ENTRY, CreatureEvents.CREATURE_EVENT_ON_AI_UPDATE, (...args) => CastSpellOnSight(...args));
```

This script demonstrates how line of sight checks can be incorporated into NPC AI to make interactions more dynamic and engaging. In this case, the NPC will only cast a spell on the player if they are within line of sight, adding an element of strategy for players to consider during encounters.

## PlayDirectSound

This method allows a [WorldObject] to play a specific sound. If a [Player] is specified, the sound plays only for that player. If no player is specified, the sound is played for everyone within proximity. Unlike other sound methods, `PlayDirectSound` plays the sound immediately without interrupting any currently playing sound.

### Parameters
- `sound`: number - The sound ID to play. Sound IDs can be obtained from data extracted from the game client.
- `player`: [Player](./player.md) (Optional) - The player to whom the sound should be played exclusively. If not provided, the sound plays for all nearby players.

### Example Usage:

Demonstrates playing a victory sound to a player when they defeat an enemy, and a different sound to all nearby players when an important NPC is defeated.

```typescript
const VICTORY_SOUND = 12345;
const NPC_DEFEAT_SOUND = 54321;

// Play victory sound for player upon defeating any enemy.
const OnPlayerKill: player_event_on_kill = (event: number, player: Player, victim: Unit): void => {
    if (victim.GetType() === TypeId.TYPEID_UNIT) {
        player.GetMap().PlayDirectSound(VICTORY_SOUND, player);
    }
}

// Play special sound for everyone nearby when a specific NPC is defeated.
const OnNPCDeath: creature_event_on_death = (event: number, creature: Creature, killer: Unit): void => {
    if (creature.GetEntry() === SPECIAL_NPC_ENTRY) {
        creature.PlayDirectSound(NPC_DEFEAT_SOUND);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL, (...args) => OnPlayerKill(...args));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DEATH, (...args) => OnNPCDeath(...args));
```

In the example above, a victory sound is played directly to the player who kills an enemy, making their triumph feel more personal and immediate. Additionally, when a particular NPC, denoted by `SPECIAL_NPC_ENTRY`, is defeated, a unique sound plays to everyone in the vicinity, signaling the NPC's defeat to all nearby players. This method of sound playbacks enhances the immersive experience in gameplay, providing dynamic audio feedback based on in-game actions.

## PlayDistanceSound

This method allows a WorldObject to play a specific sound. If directed at a certain player, only they will hear it; otherwise, it's audible to everyone nearby. The volume decreases with distance from the source, creating an immersive experience. Unlike other methods, this immediately stops any currently playing sounds on the WorldObject.

### Parameters
- sound: number - The ID of the sound to play. Sound IDs can be found in the game files or databases.
- player?: [Player](./player.md) (Optional) - The target player to hear the sound. If not specified, all players within range will hear the sound.

### Example Usage:
In the following example, when a player interacts with a specific object (for instance, a quest item in the world), a unique sound will play. This could signify the item's activation or an atmospheric cue.

```typescript
// Define a specific sound ID and WorldObject ID for demonstration
const MYSTICAL_OBJECT_ID = 12345;
const ACTIVATION_SOUND_ID = 54321;

const OnObjectInteraction: world_object_event_on_go_use = (event: number, player: Player, gameObject: GameObject): void => {
    if (gameObject.GetGUIDLow() == MYSTICAL_OBJECT_ID) {
        // Play a unique sound when the mystical object is used
        gameObject.PlayDistanceSound(ACTIVATION_SOUND_ID, player);

        // Optionally send a message to the player for feedback
        player.SendBroadcastMessage(`You feel a strange energy as the object resonates with a deep hum.`);
    }
}

// Register the GameObject event for use interaction
RegisterGameObjectEvent(MYSTICAL_OBJECT_ID, GameObjectEvents.GO_EVENT_ON_USE, (...args) => OnObjectInteraction(...args));
```

In this script, the sound will directly play to the player who interacts with the specified GameObject, enhancing their immersive experience in the game world. The sound's diminishing volume with distance can also indicate the source's location, adding depth to environmental storytelling and gameplay mechanics.

## PlayMusic
Plays the specified music ID to a single player or everyone nearby the WorldObject without interrupting any previously played music. This function can enhance the atmosphere or highlight certain events in custom scripts. 

### Parameters
- **music**: number - The ID of the music to play. Music IDs can be found in the game's data files.
- **player**?: [Player](./player.md) (optional) - The player to whom the music should be played. If not specified, the music will be played to everyone nearby.

### Example Usage: 
Below is a script that plays a triumphant theme when a player completes a specific quest, enhancing the sense of achievement. If the player is not specified, this music is played to all nearby players, sharing the moment of celebration.

```typescript
const QUEST_ID_FOR_CELEBRATION = 12345; // Example Quest ID
const TRIUMPHANT_THEME_MUSIC_ID = 123; // Example Music ID

const onQuestComplete: quest_event_on_complete = (questId: number, player: Player): void => {
    if (questId === QUEST_ID_FOR_CELEBRATION) {
        // Retrieves the WorldObject (could be an NPC or any relevant object in the world)
        const worldObject: WorldObject = GetRelevantWorldObject();

        // Player specific
        worldObject.PlayMusic(TRIUMPHANT_THEME_MUSIC_ID, player);
        
        // Alternatively, for a broader effect, omitting the player parameter
        // worldObject.PlayMusic(TRIUMPHANT_THEME_MUSIC_ID);
        
        // Additional logic for the quest completion can be added here
    }
}

RegisterQuestEvent(QUEST_ID_FOR_CELEBRATION, QuestEvents.QUEST_EVENT_ON_COMPLETE, (...args) => onQuestComplete(...args));

function GetRelevantWorldObject(): WorldObject {
    // This is a placeholder function. In a real scenario, you would fetch
    // the WorldObject based on context, such as NPCs associated with the quest.
    return new WorldObject(); // Placeholder return
}
```

This example showcases how the `PlayMusic` method can be used to provide auditory feedback for game events, making the game world feel more immersive and responsive to player actions. Note that in an actual implementation, the `GetRelevantWorldObject` function would need to be replaced with logic specific to how you retrieve or reference your WorldObject in the game environment.

## RegisterEvent

Registers a timed event to the [WorldObject], calling a specified function after a delay. The event can repeat multiple times or indefinitely until the [WorldObject] is destroyed. This function allows for dynamic event handling based on time for all WorldObject derivatives, such as Players, Creatures, and GameObjects. Timed event ticks for Creatures and GameObjects require visibility, and all events are cleared upon the object's destruction or player logout.

### Parameters

- `func`: `(delay: number | [number, number], repeats: number, worldobj: WorldObject) => any` - A callback function that executes when the event fires. Receives the parameters: delay, repeats, and the world object.
- `delay`: `number | [number, number]` - The delay before the event fires in milliseconds. A single number indicates a fixed delay; a tuple `[min, max]` specifies a random delay within the range.
- `repeats?`: `number` - The number of times the event repeats. `0` for indefinite repetition.

### Returns

`eventId`: `number` - An identifier for the registered event. This ID can be used to reference or cancel the event later.

### Example Usage:

Scheduling a simple greeting for any world object that repeats a few times, demonstrating the basic use case.

```typescript
function GreetWorldObject(delay: number, repeats: number, worldObject: WorldObject): void {
    console.log(`Hello from ${worldObject.GetName()}!`);
}

const worldObject = /* assume this is a valid WorldObject derived instance, like Player or Creature */;
worldObject.RegisterEvent(GreetWorldObject, 5000, 3); // Greets after 5 seconds, repeats 3 times.
```

### Advanced Usage:

Creating a dynamic event for a creature that performs an action based on visibility and repeats indefinitely, showcasing the use of random delay intervals and indefinite repetition.

```typescript
function CheckVisibilityAndAct(delay: number, repeats: number, creature: Creature): void {
    if (creature.IsVisibleToPlayers()) {
        creature.Emote(1); // Performs an emote action when visible.
        console.log(`Performing action for ${creature.GetName()}`);
    } else {
        console.log(`Waiting for visibility for ${creature.GetName()}`);
    }
}

const creature = /* assume this is a valid Creature instance that has been spawned in the world */;
creature.RegisterEvent(CheckVisibilityAndAct, [1000, 3000], 0); // Checks visibility and acts every 1 to 3 seconds, indefinitely.
```

This example demonstrates extensive use of the `RegisterEvent` method to create engaging and reactive world interactions within mod-eluna on Azerothcore, leveraging TypeScript's strong typing for clear and maintainable code.


## RegisterEvent

This method allows you to register an event on a WorldObject with a specified function, delay, and repetition count. It can be particularly useful for implementing timers, random events, or any action that needs to be executed with a delay or at certain intervals for units.

### Parameters 
- **func**: (delay: number | [number, number], repeats: number, worldobj: Unit) => any - The function to be called when the event is triggered. This function can accept parameters for delay and repeats, as well as the WorldObject itself.
- **delay**: number | [number, number] - The delay before the event is first triggered. Can be a single number (for a specific delay in milliseconds) or a tuple of two numbers (for a random delay between the two specified values in milliseconds).
- **repeats**: number (optional) - The number of times the event should repeat after the first trigger. If not specified, the event will only trigger once.

### Returns
- **eventID**: number - The ID of the created event, which can be used for event cancellation or management.

### Example Usage: 
Creating a simple script where a unit periodically says something to nearby players, and then after a certain number of repetitions, casts a spell.

```typescript
const SAY_EVENT = 1;   // Custom event IDs should start from 1
const CAST_SPELL_EVENT = 2;

function scheduleSayEvent(unit: Unit): void {
    unit.RegisterEvent((delay, repeats, worldobj) => {
        worldobj.SendUnitSay("I will cast a spell soon...", ChatType.CHAT_TYPE_SAY);

        // Decrease repeats left and check if it's time to cast the spell
        if (repeats <= 1) {
            worldobj.RegisterEvent(castSpell, 5000, 1); // Schedule spell cast in 5 seconds
        }
    }, [2000, 5000], 3); // Say something every 2-5 seconds, three times
}

function castSpell(delay: number, repeats: number, worldobj: Unit): void {
    worldobj.CastSpell(worldobj, SPELL_ID, true);
    worldobj.SendUnitSay("Spell casting complete.", ChatType.CHAT_TYPE_SAY);
}

RegisterWorldEvent(WORLD_EVENT_ON_INIT, () => {
    const unit = GetUnitById(SOME_UNIT_ID);
    if(unit) {
        scheduleSayEvent(unit);
    }
});
```
In this script, `scheduleSayEvent` makes the unit say something to nearby players three times at random intervals between 2 to 5 seconds. After saying the phrase three times, `castSpell` is scheduled to make the unit cast a spell. This example showcases the versatility of `RegisterEvent` in creating dynamic world interactions based on timers and conditional logic.

# RegisterEvent

Schedules a function to be called after a delay for WorldObject, specifically for Creature objects in this overload. Useful for creating dynamic events or triggers within the game world.

### Parameters
- **func**: _function_ - The function to be called after the delay. The function signature takes a delay, repeats, and the world object (`Creature`) as parameters.
- **delay**: _number_ | _[number, number]_ - Time in milliseconds before the event is triggered. Can also be a tuple representing a range from which a random delay will be selected.
- **repeats**: _number_ (Optional) - The number of times the event will repeat. If not specified, defaults to no repeats.

### Returns
- **eventId**: _number_ - A unique ID for the created event. Can be used to cancel the event before it's triggered.

### Example Usage
In this example, we create a simple NPC behavior where a creature heals itself every 10 seconds for 5 times total. The heal effect and the chat message broadcast are scheduled using `RegisterEvent`.

```typescript
const HEAL_AMOUNT = 50000; // Amount of health restored by the heal.
const HEAL_INTERVAL = 10000; // Time in milliseconds between heals.
const HEAL_REPEATS = 5; // Number of times the heal event repeats.

function HealSelfAndBroadcast(creature: Creature): void {
  creature.SetHealth(creature.GetHealth() + HEAL_AMOUNT);
  creature.TextEmote("The creature's wounds begin to close!", null, true);
}

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
  creature.RegisterEvent((delay, repeats, self) => {
     HealSelfAndBroadcast(self);
  }, HEAL_INTERVAL, HEAL_REPEATS);
}

// Assuming you have the creature's entry ID, replace `CREATURE_ENTRY` with the actual ID.
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this more advanced example, there's a creature that schedules an event to heal itself for a set amount multiple times. The schedule can be randomized using a tuple for the delay parameter, providing a more unpredictable behavior which can be more engaging in player vs environment (PvE) scenarios.

# RegisterEvent

Schedules a custom event to be executed for the `Player`. The custom event can be set to execute after a specified delay and can be configured to repeat a certain number of times. This method is particularly useful for creating timed events or actions tied to specific `Player` activities or conditions in the game.

### Parameters
- **func**: (delay: number | [number, number], repeats: number, worldobj: Player) => any - The function to execute when the event triggers. The parameters of the function include `delay`, `repeats`, and the `Player` object itself.
- **delay**: number | [number, number] - The delay before the event is first triggered. Can be a single number (for a consistent delay) or a tuple with two numbers representing a random range ([minDelay, maxDelay]) from which the actual delay will be chosen.
- **repeats**?: number - Optional. The number of times the event should repeat. If not provided, the event will trigger only once. If set to a positive number, the event will repeat that many times at the specified delay interval. If set to -1, the event will repeat indefinitely until explicitly canceled.

### Returns
- **eventId**: number - A unique identifier for the registered event. This can be used to cancel the event before it completes.

### Example Usage:
In this example, we schedule an event for a `Player` that simulates the player finding an ancient relic in a dungeon. The event triggers after a random interval between 10 to 30 seconds, repeats 3 times to simulate the player finding a total of 3 relics, and each time gives the player a small experience boost and a relic item.

```typescript
function findRelicEvent(delay: number, repeats: number, player: Player) {
    if (repeats > 0) {
        player.AddExperience(500); // Add some experience for finding a relic
        player.AddItem(19019, 1); // Add an example relic item to the player's inventory
        player.SendBroadcastMessage(`You've found an ancient relic! ${repeats} left to find.`);
    }
}

const RELIC_QUEST_START: player_event_hook = (playerEventId: number, player: Player) => {
    // Trigger findRelicEvent with a random delay between 10 and 30 seconds, repeating 3 times.
    player.RegisterEvent(findRelicEvent, [10000, 30000], 3);
}

// Register the RELIC_QUEST_START function to the desired player event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CUSTOM_EVENT, (...args) => RELIC_QUEST_START(...args));
```

In this script, when the custom event `PLAYER_EVENT_ON_CUSTOM_EVENT` triggers for the `Player`, the `findRelicEvent` function is scheduled with a delay randomly chosen between 10 and 30 seconds. The `findRelicEvent` function gives the player an experience boost and a relic item upon each execution, simulating the player finding relics in a dungeon. The event repeats 3 times before automatically discontinuing.

Based on the provided examples and instructions, here’s how the documentation for `RegisterEvent` method might look like if included in a markdown doc for the `WorldObject` class in the context of mod-eluna on Azerothcore.

## RegisterEvent
This method is used to register an event on a `WorldObject`, `Unit`, `Creature`, or `Player`. The event function will be called after the specified delay and can repeat multiple times depending on the parameters given.

### Parameters
- **func**: `(delay: number | [number, number], repeats: number, worldObj: WorldObject | Unit | Creature | Player) => any` - The function that will be executed. The function will receive the parameters: delay, repeats, and worldObj, which represent the delay before the event is executed, number of times the event repeats, and the world object the event is bound to, respectively.
- **delay**: `number | [number, number]` - The delay in milliseconds before the event is triggered. This can be a single number or an array representing a range `[min, max]`, where a random delay is chosen from within the range for each repetition of the event.
- **repeats?**: `number` - (Optional) The number of times the event should repeat. If not specified, the event will trigger only once. If set to `-1`, the event will repeat indefinitely until explicitly removed.

### Returns
- **eventId**: `number` - The ID of the created event. This ID can be used to cancel the event if needed.

### Example Usage:
Creating a simple event to make a Creature speak a line of text after a delay of 3 seconds. This event will repeat 5 times, each with a delay randomly chosen between 3,000 ms (3 seconds) and 5,000 ms (5 seconds).

```typescript
const SPEAK_EVENT: unit_event_on_speak = (delay: number, repeats: number, creature: Creature): void => {
    creature.Say("The event system in mod-eluna is powerful!", 0);
};

let myCreature: Creature; // Assuming this is already defined elsewhere in your script

const EVENT_ID: number = myCreature.RegisterEvent(SPEAK_EVENT, [3000, 5000], 5);

// To cancel the event before it completes its run, you could use 
// myCreature.RemoveEvent(EVENT_ID);
```

This example demonstrates how to use `RegisterEvent` to schedule a repeating event with a variable delay. The `SPEAK_EVENT` function makes the creature say a message, which is a practical example of how events can interact with game entities. This approach allows for a wide range of possibilities, such as scheduling buffs, initiating custom scripts, or controlling NPC behavior dynamically.

## RemoveEventById
This method is used to cancel a timed event associated with a WorldObject using the specified event ID. Each timed event that is scheduled on a WorldObject is assigned a unique event ID which can be used to specifically target and remove the event before it finishes or triggers. This can be particularly useful for scripting dynamic encounters or events where the conditions may change before the event is supposed to be executed.

### Parameters
- **eventId**: number - The unique identifier of the event to be removed.

### Example Usage:
In this example, we schedule a timed event on an object that causes it to say something after 10 seconds. However, if a player interacts with the object before those 10 seconds are up, the event is canceled, and instead, the object says something immediately.

```typescript
const SAY_EVENT_ID = 1;
const OBJECT_ENTRY = 12345; // Example WorldObject entry ID

function SpawnHandler(event: number, object: WorldObject): void {
    // Schedule a "say" event to happen after 10 seconds
    object.ScheduleEvent(() => {
        object.Say("The time has come.");
    }, 10000, SAY_EVENT_ID);
}

function InteractionHandler(event: number, player: Player, object: WorldObject): void {
    // Check if the event is still pending
    if(object.HasEvent(SAY_EVENT_ID)) {
        // Remove the pending event
        object.RemoveEventById(SAY_EVENT_ID);
        
        // Immediate response due to the player's interaction
        object.Say("Ah, you've arrived sooner than I expected.");
    }
}

// Registers the spawn handler to execute when the WorldObject of specified entry is spawned.
RegisterWorldObjectEvent(OBJECT_ENTRY, WorldObjectEvents.WORLD_OBJECT_EVENT_ON_SPAWN, (...args) => SpawnHandler(...args));

// Registers an interaction handler that triggers when a player interacts with the WorldObject.
RegisterWorldObjectEvent(OBJECT_ENTRY, WorldObjectEvents.WORLD_OBJECT_EVENT_ON_PLAYER_INTERACTION, (...args) => InteractionHandler(...args));
```

In the above script:
- The `SpawnHandler` function schedules a timed event when the WorldObject is spawned. This event will make the WorldObject say "The time has come." after 10 seconds unless it is preemptively removed.
- The `InteractionHandler` function listens for player interactions with the WorldObject. If the player interacts with the object before the 10-second event occurs, the event is removed using `RemoveEventById`, and the object immediately says "Ah, you've arrived sooner than I expected." instead.
- This demonstrates how `RemoveEventById` can be used to dynamically adjust the behavior of objects in response to changing game conditions.

## RemoveEvents

Remove all timed events from a WorldObject. This method is used when you want to ensure that no scheduled events are pending on the WorldObject, effectively cleaning its event queue. This can be particularly useful for scripted encounters or when dynamically modifying the behavior of game objects or units without leaving lingering effects.

### Usage: 

No parameters required.

### Example Usage: 

Creating a script where a game object should stop all its actions before being destroyed. Imagine a scenario where this game object periodically spawns enemies, but under certain conditions, it must be deactivated instantly.

```typescript
const GO_DEACTIVATE: gameobject_event_on_event = (eventNumber: number, gameObject: GameObject): void => {
    // Assuming some conditions are met to stop the GameObject's actions
    gameObject.RemoveEvents();

    // Additional logic to safely deactivate or delete the GameObject 
    // without worrying about its pending events.
}

RegisterGameObjectEvent(GAME_OBJECT_ENTRY_ID, GameObjectEvents.GAMEOBJECT_EVENT_ON_EVENT, (...args) => GO_DEACTIVATE(...args));
```

### Notes
- Use this method with caution. Removing all events from a WorldObject can impact ongoing game mechanics.
- Typically, this method is called before a scripted event changes phase or before a WorldObject's behavior is drastically altered to ensure a clean transition.
- This method does not remove persistent effects or changes made by past events; it only stops future scheduled events from happening.

By employing `RemoveEvents()`, developers can manage WorldObjects more dynamically, ensuring that objects can transition between states without being hindered by previously set timed events. This functionality is essential for creating a responsive and controlled environment in mod scripting for Azerothcore using the mod-eluna plugin.

Based on the provided examples, here is how you can document the `SendPacket` method for a `WorldObject` class within a README documentation aimed to support development for mods on Azerothcore using mod-eluna. This documentation includes inline code comments and method signature as provided in the instructions. 

---

## SendPacket

This method is used to transmit custom packets to all players that are currently in the visibility range of the `WorldObject`. It's useful for sending updates or notifications that are not covered by the default AzerothCore functionalities. 

### Parameters

- **packet**: [WorldPacket](./worldpacket.md) - The custom packet to be sent to nearby players.

### Usage

When using `SendPacket`, you must first understand or have in mind the structure of the packet you're sending, as well as the impact it will have on the client-side. This is typically used for advanced modifications and requires a good understanding of the client-server data exchange protocol.

Here is an example of how one might use `SendPacket` to create a custom visual or audible effect around an object when a specific event occurs. This script adds a custom effect whenever a player interacts with a specific world object:

```typescript
const CUSTOM_PACKET_ENTRY = 123456; // Make sure this is unique and doesn't clash with existing packets

const onPlayerInteract: world_object_event_on_interact = (event: number, player: Player, worldObject: WorldObject) => {
    // Assuming createCustomPacket is a fictional function to demonstrate packet creation.
    let customPacket: WorldPacket = createCustomPacket(CUSTOM_PACKET_ENTRY);

    // Adding data to the packet (this is highly dependent on what the client expects to receive)
    customPacket.WriteUInt32(player.GetGUIDLow());
    customPacket.WriteFloat(worldObject.GetX());
    customPacket.WriteFloat(worldObject.GetY());
    customPacket.WriteFloat(worldObject.GetZ());

    // Sending the packet to players around
    worldObject.SendPacket(customPacket);
}

RegisterWorldObjectEvent(WorldObjectEvents.WORLD_OBJECT_EVENT_ON_INTERACT, (...args) => onPlayerInteract(...args));

function createCustomPacket(packetEntry: number): WorldPacket {
    // This would be where you create your packet to send to the client
    // For the purpose of this example, we'll return a placeholder
    return new WorldPacket(packetEntry); // The real implementation would be more complex
}
```

### Notes

- Always ensure the packet structure aligns with what the client expects. Misaligned structures can lead to unexpected behavior or crashes.
- The visibility range is determined by the server configurations and the environmental factors within the AzerothCore framework.
- Use this method responsibly as sending too many custom packets can lead to bandwidth issues or potential exploits.

Incorporating custom packets can significantly enhance the interaction within the game, offering a more dynamic and immersive experience for players, but it requires careful planning and testing to implement effectively.

## SetPhaseMask
This method sets the phase mask of the WorldObject. In World of Warcraft, phase masks are used to control visibility and interaction of objects and NPCs for players in different 'phases'. This can be useful for scripting phased content where certain objects or NPCs should only be interactable or visible to players in a specific phase.

### Parameters
- `phaseMask`: number - The phase mask to set. This controls the phasing visibility and interaction.
- `update?`: boolean - (Optional) Whether to update the phase mask for all players in sight. Defaults to `false` if not specified.

### Returns
This method does not return a value.

### Example Usage:
Here's an example script that sets the phase mask of an NPC to 2, making it only interactable by players in phase 2. This script might be part of a quest line where the NPC should only appear after a certain event has occurred.
```typescript
const PHASE_MASK = 2;
const UPDATE_SIGHT = true;

const onQuestAccepted: creature_event_on_quest_accept = (event: number, player: Player, creature: Creature, quest: Quest): void => {
    if(quest.GetId() === SOME_QUEST_ID) {
        creature.SetPhaseMask(PHASE_MASK, UPDATE_SIGHT);
    }
}

RegisterCreatureEvent(CREATURE_ID, CreatureEvents.CREATURE_EVENT_ON_QUEST_ACCEPT, (...args) => onQuestAccepted(...args));
```
In this example script, when the player accepts a specific quest (`SOME_QUEST_ID`), the `SetPhaseMask` method is called on the NPC (`creature`). The NPC's phase mask is set to 2 (`PHASE_MASK`), and the phase update is applied to all players in sight (`UPDATE_SIGHT`) making the NPC visible only to players in phase 2. This method can be key to creating immersive and dynamic environments in World of Warcraft modding.

## SpawnCreature
Spawns a creature at the specified location with optional parameters for the spawn type and despawn timer. The spawn type determines the condition under which the creature despawns, such as time-based or event-based conditions.

### Parameters
- **entry**: number - The entry ID of the creature to be spawned from the `creature_template` table.
- **x**: number - The X coordinate for the spawn location.
- **y**: number - The Y coordinate for the spawn location.
- **z**: number - The Z coordinate for the spawn location.
- **o**: number - The orientation of the creature at the spawn location.
- **spawnType**: TempSummonType (Optional) - An enum value that determines the despawn condition for the creature.
- **despawnTimer**: number (Optional) - Time in milliseconds after which the creature will despawn. The application of this timer depends on the `spawnType`.

### Enum: TempSummonType
- **TEMPSUMMON_TIMED_OR_DEAD_DESPAWN**: 1 - Despawns after a specified time OR when the creature is no longer alive.
- **TEMPSUMMON_TIMED_OR_CORPSE_DESPAWN**: 2 - Despawns after a specified time OR when the creature dies and leaves a corpse.
- **TEMPSUMMON_TIMED_DESPAWN**: 3 - Despawns strictly after a specified time.
- **TEMPSUMMON_TIMED_DESPAWN_OUT_OF_COMBAT**: 4 - Despawns after a specified time once the creature is out of combat.
- **TEMPSUMMON_CORPSE_DESPAWN**: 5 - Instantly despawns upon death.
- **TEMPSUMMON_CORPSE_TIMED_DESPAWN**: 6 - Despawns after a specified time post-death.
- **TEMPSUMMON_DEAD_DESPAWN**: 7 - Despawns when the creature disappears.
- **TEMPSUMMON_MANUAL_DESPAWN**: 8 - Despawns when manually instructed via `UnSummon()`.
- **TEMPSUMMON_TIMED_OOC_OR_CORPSE_DESPAWN**: 9 - Despawns after specified time out of combat (OOC) OR when the creature dies.
- **TEMPSUMMON_TIMED_OOC_OR_DEAD_DESPAWN**: 10 - Despawns after a specified time out of combat (OOC) OR when the creature disappears.

### Returns
- **Creature**: A reference to the spawned creature.

### Example Usage
Below is an example that spawns a creature when a player interacts with a GameObject. The creature despawns after 10 minutes or if killed.

```typescript
const CREATURE_ENTRY = 12345;
const DESPAWN_TIME_MS = 600000; // 10 minutes in milliseconds

const onGoUse: go_event_on_use = (event: number, player: Player, gameObject: GameObject): void => {
    // Spawn location near the GameObject
    const spawnX = gameObject.GetX() + 3;
    const spawnY = gameObject.GetY() + 3;
    const spawnZ = gameObject.GetZ();
    const spawnO = gameObject.GetO();

    // Spawn the creature with a timed despawn condition
    const spawnedCreature = gameObject.SpawnCreature(
      CREATURE_ENTRY, 
      spawnX, 
      spawnY, 
      spawnZ, 
      spawnO, 
      TempSummonType.TEMPSUMMON_TIMED_OR_DEAD_DESPAWN, // Despawns after time or if dead
      DESPAWN_TIME_MS
    );
    
    if (spawnedCreature) {
        player.SendBroadcastMessage(`A wild creature has appeared near ${gameObject.GetName()}!`);
    }
};

RegisterGameObjectEvent(GAMEOBJECT_TEMPLATE_ID, GameObjectEvents.GO_EVENT_ON_USE, (...args) => onGoUse(...args));
```
This setup creates an engaging experience for players by dynamically spawning creatures in the world, enhancing immersion and interaction within the game environment.

## SummonGameObject
Spawns a GameObject at the specified location with an optional respawn delay. The GameObject will appear in the game world at the coordinates (x, y, z) with orientation (o). The entry parameter corresponds to the GameObject ID as defined in the World Database (`gameobject_template` table).

### Parameters
- **entry**: number - GameObject Entry Id from `gameobject_template` table.
- **x**: number - The x-coordinate where the GameObject will appear.
- **y**: number - The y-coordinate where the GameObject will appear.
- **z**: number - The z-coordinate where the GameObject will appear.
- **o**: number - The orientation of the GameObject.
- **respawnDelay**: number (optional) - The time in seconds before the GameObject respawns after being interacted with or destroyed. If not specified, the default respawn delay defined in the database will be used.

### Returns
- **gameObject**: [GameObject](./gameobject.md) - The GameObject that was spawned.

### Example Usage:
Creates a script that spawns a chest containing treasures for players to find. The chest will respawn 2 hours after being opened.

```typescript
const CHEST_ENTRY = 190000; // Example GameObject ID for a treasure chest
const TREASURE_HUNT_EVENT_ID = 1;

const onTreasureHuntStart: global_event_on_start = (eventId: number): void => {
  if (eventId === TREASURE_HUNT_EVENT_ID) {
    // Coordinates for the treasure chest
    const x = -13276.88;
    const y = 83.5312;
    const z = 21.60645;
    const o = 1.57; // Facing south
    const respawnDelay = 7200; // 2 hours

    // Spawn the treasure chest
    World.Spell:SummonGameObject(CHEST_ENTRY, x, y, z, o, respawnDelay);
    
    print("A treasure chest has appeared somewhere in the world. Happy hunting!");
  }
}

RegisterGlobalEvent(GlobalEvents.GLOBAL_EVENT_ON_START, (...args) => onTreasureHuntStart(...args));
```

This script uses a global event to trigger the spawning of a treasure chest when the event `TREASURE_HUNT_EVENT_ID` starts. Players can participate in the treasure hunt, and once the chest is claimed, it will be available again after 2 hours, encouraging players to keep an eye out for the next one.

