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

