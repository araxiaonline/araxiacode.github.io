## GetAreaId
This method returns the area ID of the [Map] based on the specified X, Y, and Z coordinates. The `phasemask` parameter allows specifying the phase for phased content, providing flexibility for scripting events or actions that depend on the game's current state.

### Parameters
- `x`: number - The X coordinate on the map
- `y`: number - The Y coordinate on the map
- `z`: number - The Z coordinate on the map
- `phasemask`: number (optional) - The phasemask for phased areas

### Returns
areaId: number - The area ID of the specified location on the map.

### Example Usage:
Scripting a scenario to check players' locations to trigger a custom event.
```typescript
const AREA_ID_ELVEN_FOREST = 123; // Example area ID for Elven Forest
const EVENT_PHASEMASK = 1; // Default phase

const onPlayerMove: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number): void => {
    const playerX = player.GetX();
    const playerY = player.GetY();
    const playerZ = player.GetZ();

    const playerAreaId = player.GetMap().GetAreaId(playerX, playerY, playerZ, EVENT_PHASEMASK);

    if(playerAreaId === AREA_ID_ELVEN_FOREST) {
        // Trigger a custom event or action for the player
        TriggerCustomEventForPlayer(player);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => onPlayerMove(...args));

function TriggerCustomEventForPlayer(player: Player) {
    // Logic to trigger the event for the player
    player.SendAreaTriggerMessage("Welcome to the Elven Forest! Custom Events await you.");
}
```
This snippet demonstrates how to use `GetAreaId` to trigger a custom event when a player enters a specific area. By checking the area ID where the player moves, developers can script immersive experiences tailored to different locations in the game.

# GetDifficulty
This method retrieves the difficulty level of the current map where the EMap instance is located. It's important to note that if the game expansion is before The Burning Crusade (pre-TBC), this method will always return `0`, implying that difficulty levels introduced in later expansions are not applicable.

### Returns
difficulty: `number` - The difficulty of the map. This is an integer where `0` usually signifies a normal difficulty setting. Higher numbers indicate increased difficulty levels such as heroic or mythic, depending on the context and game expansion.

### Example Usage:
```typescript
const onPlayerEnterMap: map_event_on_create = (event: number, map: EMap): void => {
    let mapDifficulty = map.GetDifficulty();

    // Log the difficulty level. If the game is pre-TBC, it will log '0'.
    console.log(`Entered map with difficulty level: ${mapDifficulty}`);

    // You can use the difficulty information to customize player experience
    if (mapDifficulty > 0) {
        console.log("This map has increased difficulty.");
        // Implement difficulty-based enhancements or challenges here.
    } else {
        console.log("Standard difficulty or pre-TBC map. Setting normal challenges.");
        // Implement standard gameplay features here.
    }
}

RegisterMapEvent(MapEvents.MAP_EVENT_ON_CREATE, (...args) => onPlayerEnterMap(...args));
```

In this example, whenever a player enters a map, it checks the difficulty of the map using `GetDifficulty()`. The script then logs the difficulty level, demonstrating how to use the method to adjust game logic based on map difficulty. This can be particularly useful for custom scripts or mods that aim to enhance player experience or provide challenges based on the difficulty level of the map they are in. The example also highlights the backward compatibility with pre-TBC expansions by handling cases where the difficulty level is always `0`.

## GetHeight

This method returns the elevation (height) of the terrain/map at a specific X and Y coordinate. It’s particularly useful for scripts that need to spawn objects or characters at precise locations above the ground. If the method cannot find a height (for example, if the coordinates are out of bounds), it returns `nil`.

### Parameters

* `x`: number - The X coordinate on the map.
* `y`: number - The Y coordinate on the map.

### Returns

* `height`: number | `nil` - The height at the given coordinates, or `nil` if no height data is available.

### Example Usage:

Let’s say you're creating a custom event where a treasure chest appears at random locations within a defined area, but you need to ensure it spawns on the ground. The `GetHeight` method can be used to dynamically adjust the Z (height) coordinate for the spawn location.

```typescript
function SpawnTreasureChest(map: EMap, minX: number, maxX: number, minY: number, maxY: number): void {
    // Generate random X and Y within the specified bounds
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    // Get the ground height at the generated X and Y coordinates
    const z = map.GetHeight(x, y);

    // Check if a height was found
    if (z !== null) {
        // Assuming SpawnChest is a function you've defined to spawn a chest at given coordinates
        SpawnChest(x, y, z);
        console.log(`Spawned a chest at coordinates: ${x}, ${y}, ${z}`);
    } else {
        console.log("Failed to find a suitable spawn height. Trying again...");
        SpawnTreasureChest(map, minX, maxX, minY, maxY); // Recursive call to try again
    }
}

// Example call to our function
const myMap = new EMap();
SpawnTreasureChest(myMap, 5000, 5500, 5000, 5500);
```

This script randomly selects X and Y coordinates within specified boundaries and uses the `GetHeight` method to find an appropriate Z coordinate so the chest spawns on the ground. If `GetHeight` returns `nil` (indicating no valid ground was found at those coordinates), the script tries again with new coordinates.

## GetInstanceData
Retrieves a data table for the map's instance if the instance has been scripted using Eluna. This method serves as a bridge for Lua scripted encounters to store and manage their data. Should the instance be managed through C++, this method will return `nil`, indicating the absence of a Lua-scripted data table.

### Returns
dataTable: `Record<string, any>[]` - A JavaScript object array with string keys, representative of the instance's data. If no data or if not scripted in Eluna, returns `nil`.

### Example Usage:  
Below is an example of how to retrieve instance data for a custom scripted boss encounter, checking for the existence of data before attempting to use it, and initializing the data if it does not exist.

```typescript
const initializeBossData = (map: EMap) => {
    // Attempt to retrieve existing instance data
    let instanceData = map.GetInstanceData();
  
    // If no data exists, initialize it
    if (instanceData == null) {
        instanceData = [{ bossDefeated: false, playersParticipated: [] }];
        console.log("Instance data initialized for scripted boss event.");
    } else {
        console.log("Instance data retrieved for ongoing boss event.");
    }

    // Check if the boss has already been defeated in this instance
    if (instanceData[0].bossDefeated) {
        console.log("The boss has already been defeated in this instance.");
    } else {
        console.log("The boss is still alive. Good luck adventurers!");
    }
};

const OnMapLoad: map_event_on_load = (event: number, map: EMap) => {
  // Initialize or retrieve boss data when a map loads
  initializeBossData(map);
};

RegisterMapEvent(MapEvents.MAP_EVENT_ON_LOAD, (...args) => OnMapLoad(...args));
```
This script demonstrates initializing or retrieving custom data for a given map instance. It can be particularly useful for server-side mods that enhance gameplay through scripted events, tracking player progress, or managing complex encounter states in AzerothCore via mod-eluna.

## GetInstanceId
This method retrieves the instance ID of the current [Map] where the player or unit resides. Instance IDs
are unique identifiers for instances (dungeons, raids, etc.) which are used to separate different instance runs
from each other. This can be useful for scripts that need to apply logic specific to a particular instance run.

### Returns
instanceId: number - The unique identifier for the instance of the current [Map].

### Example Usage:
In this example, we create a simple script that announces the instance ID to the player upon entering an instance. This can be particularly useful for custom dungeon or raid scripts where actions might depend on the specific instance run.

```typescript
const onPlayerEnterInstance: player_event_on_enter_instance = (event: number, player: Player, map: EMap): void => {
    const instanceId = map.GetInstanceId();
    player.SendBroadcastMessage(`Welcome! The Instance ID for this run is: ${instanceId}`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_INSTANCE, (...args) => onPlayerEnterInstance(...args));
```
In this script, we listen for the `PLAYER_EVENT_ON_ENTER_INSTANCE` event, which is triggered whenever a player enters an instance. Upon triggering, our `onPlayerEnterInstance` function is called, which fetches the instance ID of the [Map] the player has just entered using `GetInstanceId()`. Finally, it sends a broadcast message to the player, welcoming them and informing them about the current instance ID. This is a basic example to illustrate how `GetInstanceId()` can be used in modding efforts on AzerothCore with mod-eluna.

## GetMapId
This method retrieves the unique identifier of the current map in which the entity is present. This ID corresponds to the 'id' column in the 'maps' table of the AzerothCore database. Knowing the map ID can help with various scripting tasks, such as conditional events based on the player's location.

### Returns
* **mapId**: number - The unique identifier of the current map.

### Example Usage:
Let's create a script that announces the current map ID to the player upon entering a new map. This could be useful for debug purposes or specialized events that only occur in certain areas.

```typescript
const onMapChange: player_event_on_map_change = (event: number, player: Player): void => {
    // Retrieve the map ID where the player currently is
    const mapId = player.GetMapId();

    // Inform the player of their current map ID
    player.SendBroadcastMessage(`Welcome! You are currently in map ID: ${mapId}`);
}

// Register the event to trigger upon map change
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP_CHANGE, (...args) => onMapChange(...args));
```

In this example, we've used the `GetMapId` method to fetch the current map ID where the player is located. This information is then communicated to the player through a broadcast message. This script can be particularly useful for developers or administrators when testing map-specific features or simply to inform players about their current location in a more detailed manner.

## GetName

This method retrieves the name of the current [Map] the character is in. Map names can be used to check player locations against specific criteria in your scripts. 

### Returns
- **string** - The name of the map.

### Example Usage:

Imagine you want to create a welcome message for players when they enter a specific zone, such as Stormwind City. You can use the `GetName` method to check the player's current map and then trigger the welcome message.

```typescript
const welcomeMessage = {
  "Stormwind": "Welcome to Stormwind City, the pride of the Alliance!",
  "Orgrimmar": "Welcome to Orgrimmar, the heart of the Horde."
};

const onPlayerMapChange: player_event_on_map_change = (event: number, player: Player): void => {
  const currentMap = player.GetMap();
  const mapName = currentMap.GetName();
  
  // Check if welcome message exists for the current map
  const message = welcomeMessage[mapName];
  if(message) {
    player.SendAreaTriggerMessage(message);
  }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP_CHANGE, (...args) => onPlayerMapChange(...args));
```
In this script, when the `PLAYER_EVENT_ON_MAP_CHANGE` event is triggered, indicating the player has changed maps, it retrieves the map object the player is currently in using `GetMap()`. Then, it retrieves the name of the map with `GetName()`. Based on the map name, it looks up a predefined message in the `welcomeMessage` object. If a message exists for that map, it sends the message to the player using `SendAreaTriggerMessage()`.

This example demonstrates a practical application of the `GetName` method, where it's important to know the map's identifier to execute conditional logic.

## GetPlayerCount
This method retrieves the total number of players present on a specific [Map], excluding Game Masters (GMs). This can be useful for dynamically adjusting game mechanics based on player population or for collecting statistics.

### Returns
- **number**: The count of players currently on the map (excluding GMs).

### Example Usage:
Used in a scenario where an event is triggered based on the current player population on a map. The event starts only if there are at least 10 players on the map, excluding GMs. This ensures active participation and competition among players.

```typescript
const MIN_PLAYERS_FOR_EVENT = 10;

const StartEventIfEnoughPlayers: map_event_on_update = (event: number, map: EMap) => {
    const playerCount = map.GetPlayerCount();

    if (playerCount >= MIN_PLAYERS_FOR_EVENT) {
        console.log(`Starting event, player count: ${playerCount}`);
        // StartEvent(); // Placeholder for event start function
    } else {
        console.log(`Not enough players to start event. Current count: ${playerCount}`);
        // Wait or schedule to try again later
    }
}

// Example registration for a map update event, adjusting based on actual mod-eluna event system
RegisterMapEvent(MapEvents.MAP_EVENT_ON_UPDATE, (...args) => StartEventIfEnoughPlayers(...args));
```
This script checks the player count on a map at certain update intervals. It logs a message and starts an event when the player count meets or exceeds the minimum requirement. Conversely, it logs a different message when the condition isn't met, possibly waiting or scheduling a check for a later time.

## GetPlayers
Retrieves the players that are currently present in a specified map and belong to a particular team. This can be used to perform operations on a group of players based on their team affiliation within a map. Teams are identified by the `TeamId` enum, which includes `TEAM_ALLIANCE`, `TEAM_HORDE`, and `TEAM_NEUTRAL`.

### Parameters
- `team`: TeamId - The team ID to filter players. Choose from `TEAM_ALLIANCE`, `TEAM_HORDE`, or `TEAM_NEUTRAL`.

### Returns
- `players`: number[] - An array of player IDs that match the specified team criteria in the map.

### Examples
#### Creating a Buff Zone
In this example, we create an area where players of the Alliance team receive a temporary buff when they enter.

```typescript
enum TeamId {
    TEAM_ALLIANCE = 0,
    TEAM_HORDE = 1,
    TEAM_NEUTRAL = 2
};

const BUFF_SPELL_ID = 469; // Example buff spell ID

const ApplyBuffToAlliancePlayers: map_event_on_enter = (mapId: number, player: Player) => {
    const map = GetMapById(mapId);
    const alliancePlayers = map.GetPlayers(TeamId.TEAM_ALLIANCE);
  
    for (let playerId of alliancePlayers) {
        const player = GetPlayerById(playerId);
        player.CastSpell(player, BUFF_SPELL_ID, true); // Assumes a function exists to fetch player by ID
    }
}

RegisterMapEvent(MapEvents.MAP_EVENT_ON_PLAYER_ENTER, (...args) => ApplyBuffToAlliancePlayers(...args));
```

#### Horde vs Alliance Announcement
This script announces the number of Horde and Alliance players in a specific map, encouraging PvP interactions.

```typescript
enum TeamId {
    TEAM_ALLIANCE = 0,
    TEAM_HORDE = 1,
    TEAM_NEUTRAL = 2
};

const AnnounceTeamPresence: map_event_on_update = (mapId: number) => {
    const map = GetMapById(mapId);
  
    const alliancePlayers = map.GetPlayers(TeamId.TEAM_ALLIANCE).length;
    const hordePlayers = map.GetPlayers(TeamId.TEAM_HORDE).length;
  
    SendWorldMessage(`Alliance players in the area: ${alliancePlayers}. Horde players in the area: ${hordePlayers}. Let the battle begin!`);
}

RegisterMapEvent(MapEvents.MAP_EVENT_ON_UPDATE, (...args) => AnnounceTeamPresence(...args));
```

These examples demonstrate how to use the `GetPlayers` method to identify players of specific teams within a map to apply effects or send messages based on their team affiliation.

## GetWorldObject
Retrieve a [WorldObject](./worldobject.md) using its GUID if it's spawned on the map. This can be useful for scripts that need to interact with specific objects in the world, such as NPCs, items, or even dynamic objects that are part of quests or events. 

### Parameters
* `guid`: number - Globally Unique Identifier of the [WorldObject](./worldobject.md) you're trying to retrieve.

### Returns
* `WorldObject | null` - Returns the [WorldObject](./worldobject.md) if found on the current map; otherwise, `null`.

### Example Usage:  
This script demonstrates how to find a specific NPC by GUID and make it say something in the game world. This could be part of a larger event or a custom quest where interacting with specific world entities is required.

```typescript
const NPC_GUID: number = 12345; // Example GUID of an NPC
const SAY_TEXT: string = "Greetings, adventurers!";

// Example event: Player enters the area
const onPlayerEnterArea: player_event_on_area = (event: number, player: Player, newArea: number) => {
    // Attempt to find the NPC by its GUID
    const npc = player.GetMap().GetWorldObject(NPC_GUID) as Unit | null;

    if (npc !== null && npc.IsNPC()) {
        // Make the NPC say something if it's found
        npc.Say(SAY_TEXT, 0); // 0 is the default chat type for SAY
    } else {
        console.error(`NPC with GUID ${NPC_GUID} could not be found or is not spawned.`);
    }
}

// Register the event hook for demonstration purposes
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_CHANGE, (...args) => onPlayerEnterArea(...args));
```

This example attempts to retrieve a specific NPC on the map using its GUID when a player enters a new area. If the NPC is found and is currently spawned on the map, it will say designated text, offering countless opportunities for dynamic player interactions in the game world.

