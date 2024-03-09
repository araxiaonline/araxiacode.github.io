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

# IsArena

Check if the current map is an Arena BattleGround. It can be useful to determine the type of battleground environment players are in to apply specific logic for arenas.

### Returns
`boolean`: Returns `true` if the current [Map](./map.md) is an Arena BattleGround, and `false` otherwise.

### Example Usage:
Prevent certain custom NPCs from spawning in Arena BattleGrounds to maintain competitive balance.
```typescript
const SpawnCustomNPC: custom_event_on_map_load = (event: number, map: EMap): void => {
    // Check if the map is an Arena
    if (!map.IsArena()) {
        // Coordinates where the custom NPC should spawn.
        const x = -1234.56;
        const y = 789.10;
        const z = 123.45;
        const orientation = 1.23;
        
        // ID of the custom NPC to spawn.
        const CUSTOM_NPC_ID = 12345;
        
        // Spawn the NPC if the map is not an Arena.
        SpawnNPC(map, CUSTOM_NPC_ID, x, y, z, orientation);
    }
}

// Register your custom logic with the appropriate map load event handler.
RegisterMapEvent(MapEvents.MAP_EVENT_ON_LOAD, (...args) => SpawnCustomNPC(...args));

function SpawnNPC(map: EMap, npcId: number, x: number, y: number, z: number, orientation: number): void {
    // Logic to spawn the NPC at the specified location on the given map.
    // This is a pseudo-function for demonstrative purposes.
}

```
In this example, we register an event that fires when a map is loaded. Inside this event, we use the `IsArena()` method to check if the map is an Arena or not. If it's not an Arena, we proceed to spawn a custom NPC at specified coordinates. This ensures that our custom NPCs do not affect the balance of competitive Arena gameplay.

This approach is particularly useful in custom server modifications where maintaining the integrity of competitive environments such as Arenas is crucial, while also enriching the world outside of those environments with custom NPCs or events.

## IsBattleground
Determines if the current map instance is a Battleground map that is not classified as an arena. 

### Returns
`true` if the map is a non-arena Battleground, `false` otherwise.

### Example Usage:
This script could be used within a larger function to modify player behavior or initiate specific events only when in a non-arena Battleground. 
```typescript
const onPlayerEnterMap: player_event_on_map = (event: number, player: Player, map: EMap): void => {

    if(map.IsBattleground()) {
        // Custom behavior or initialization for battlegrounds that are not arena
        player.SendBroadcastMessage("Welcome to the battleground!");
        // Additional logic to modify player behavior or initiate specific events in battleground
    } else {
        player.SendBroadcastMessage("This is not a battleground arena.");
        // Logic for non-battleground areas or handling errors
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP, (...args) => onPlayerEnterMap(...args));
```
This example demonstrates how you can utilize the `IsBattleground` method to check if the player has entered a map that is a battleground but not an arena. Depending on the result, different actions can be triggered, such as sending a welcome message to players entering battlegrounds, or handling logic for players in other types of maps.

The `IsBattleground` method is useful in scenarios where specific game behavior, events, or conditions must be applied or checked only in non-arena battleground maps, providing a straightforward way of distinguishing between different types of PvP environments in the game.

# IsDungeon

Determines if the current map is a dungeon.

### Returns
bool: `true` if the map is a dungeon, `false` otherwise.

### Example Usage
This snippet illustrates how to check if a player is currently in a dungeon instance and perform an action accordingly. Might be useful in scenarios where specific scripts should only run within dungeon environments.

```typescript
const OnPlayerMove: player_event_on_update_zone = (event: number, player: Player): void => {
    const playerMap = player.GetMap();

    if(playerMap.IsDungeon()) {
        // Player is in a dungeon
        console.log(`Player ${player.GetName()} is currently in a dungeon.`);
        // Perform further actions based on the dungeon status...
    } else {
        // Player is not in a dungeon
        console.log(`Player ${player.GetName()} is not in a dungeon.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => OnPlayerMove(...args));
```

This documentation and example aim to demonstrate how to efficiently utilize the `IsDungeon` method in mod-eluna on Azerothcore, empowering developers to tailor their mods based on the context of the map a player occupies.

## IsEmpty
Checks if the current game map has no players present.

### Returns
* `boolean` - Returns `true` if the map has no players, `false` otherwise.

### Example Usage:

This example script checks if a specific map is empty, and if so, it performs a specific action such as announcing to the server or logging for administrative purposes. The `map` object represents a specific game map on which this check is performed.

```typescript
// Example function to check if a specific map is empty and perform actions based on the result
const checkMapEmptyAndAct: () => void = (): void => {
    const MAP_ID = 530; // Example map ID, adjust as necessary
    const map = GetMapById(MAP_ID); // Function to get the map object by ID, assuming it exists in your scripting environment

    if (map.IsEmpty()) {
        // If map is empty, perform certain actions
        console.log(`Map with ID ${MAP_ID} is currently empty.`); // Example logging
        // You could also use in-game announcements or other actions based on your server setup
        AnnounceToServer(`The map with ID ${MAP_ID} is empty. It's a good time for maintenance or special events!`);
    } else {
        console.log(`Map with ID ${MAP_ID} is not empty.`);
    }
}

// Example usage with a hypothetical server event or a timed check
RegisterServerEvent(ServerEvents.MIDNIGHT_SERVER_MAINTENANCE_CHECK, checkMapEmptyAndAct);
```

In this example, `GetMapById` and `AnnounceToServer` are hypothetical functions that you would replace with your actual server's API functions for retrieving a map object and making server-wide announcements, respectively. The `ServerEvents.MIDNIGHT_SERVER_MAINTENANCE_CHECK` is an example of a server event that could trigger this check, adjusted as necessary to fit your server's event handling system.

## IsHeroic
Determines if the map the player is currently on is a Heroic difficulty map. Heroic maps often provide increased challenges and rewards.

### Returns 
boolean: Indicates whether the map is Heroic (`true`) or not (`false`).

### Example Usage:
This example script determines if the player is currently in a Heroic map. If so, it prints a message in the server console notifying that the player is in a Heroic instance. This could be useful for mods that adjust gameplay based on the difficulty level of the map the player is in.

```typescript
const onPlayerEnterMap: player_event_on_map_change = (event: number, player: Player, newMap: EMap): void => {

    if(newMap.IsHeroic()) {
        print(`Player ${player.GetName()} has entered a Heroic Map.`);
    } else {
        print(`Player ${player.GetName()} is in a non-heroic map.`);
    }

}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP_CHANGE, (...args) => onPlayerEnterMap(...args));
```

In this example, `player_event_on_map_change` is a hypothetical event that triggers when a player changes maps, and `PLAYER_EVENT_ON_MAP_CHANGE` is the corresponding event ID. The `newMap` argument is an instance of `EMap` related to the map the player has just entered. This script utilizes the `IsHeroic()` method to determine the map's difficulty and responds accordingly.

Replace `player_event_on_map_change` and `PLAYER_EVENT_ON_MAP_CHANGE` with actual event and ID applicable to your modding environment as necessary.

## IsRaid
This method determines if the current instance the player is in, is categorized as a raid. Being a critical condition for many raid-specific scripts or functionality within the game, it lets developers effortlessly adapt their scripts based on the environment the player is interacting with.

### Returns
`boolean` - A boolean value where `true` indicates the Map is a raid, and `false` indicates it is not a raid.

### Example Usage:
This example script demonstrates how you can utilize `IsRaid` to apply a specific buff to players only when they are inside a raid instance. This can be particularly useful for tuning gameplay experiences dynamically based on the players' current environment.

```typescript
const RAID_SPECIFIC_BUFF: number = 12345; // Example buff ID

// Event triggered when player enters the map
const onPlayerEnterMap: player_event_on_map_change = (event: number, player: Player): void => {
    const currentMap = player.GetMap();
    
    // Check if the current map is a raid
    if(currentMap.IsRaid()) {
        // Apply a specific buff when the player is in a raid
        player.CastSpell(player, RAID_SPECIFIC_BUFF, true);
        player.SendBroadcastMessage("Welcome to the Raid! A special buff has been applied to you.");
    } else {
        // Notify the player they are not in a raid (optional)
        player.SendBroadcastMessage("You are not in a Raid.");
    }
}

// Register the event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MAP_CHANGE, (...args) => onPlayerEnterMap(...args));
```
In this script, the `IsRaid` method is pivotal for determining the player's current map context, thereby allowing the script to conditionally apply enhancements or restrictions tailored to the raiding experience. Note, `12345` in the example should be replaced with an actual buff ID relevant to your gameplay mechanics. The message and buff applied are hypothetical and should be tailored to fit the context in which you are utilizing this method.


## SaveInstanceData

Persist the current state of the map's instance data into the database. This makes any changes or progress within the instance persistent across server restarts or player re-entries, ensuring the game world remains consistent for all players interacting within the instance.

### Example Usage

Scenario: Automatically save instance progress after a boss is defeated to prevent loss of progress in case of unexpected server restarts. 

```typescript
const BOSS_DEFEATED_EVENT = 1; // Assuming 1 is the event ID for a boss defeat, replace with actual value

const SaveInstanceProgress: creature_event_on_death = (event: number, creature: Creature, killer: Unit): void => {
    const map = creature.GetMap();

    // Check if the creature is a boss and the killer is a player (to exclude NPCs or environmental deaths)
    if(creature.IsBoss() && killer.IsPlayer()) {
        // Save instance data to persist the progress
        map.SaveInstanceData();
        console.log("Instance progress saved after boss defeat.");
    }
}

RegisterCreatureEvent(BOSS_NPC_ID, CreatureEvents.CREATURE_EVENT_ON_DEATH, (...args) => SaveInstanceProgress(...args));
```

In this example, `creature_event_on_death` is a hypothetical event that fires when a creature dies, and `BOSS_NPC_ID` represents the NPC ID of the boss in question. Replace it with the specific NPC ID you are working with. Upon the boss' defeat, the script checks if the creature is indeed a boss and that the killer is a player before calling `SaveInstanceData()` to save the instance's current state, ensuring that players' progress through the instance is not lost unexpectedly. 

Note: This example assumes the existence of the `IsBoss()` method to check if a creature is a boss. If no such method exists in your current scripting environment, you might need to check against a list of boss NPC IDs or use another indication of a boss creature.

## SetWeather
This method allows you to set the weather condition of a specific zone in the game dynamically. Weather conditions can range from clear skies to heavy rain or snow, providing an immersive experience for players. The `WeatherType` enum provides a variety of weather conditions that can be applied.

### Parameters
- `zone`: number - The zone ID where the weather condition will be applied. Zone IDs can be found in the game's data files or online resources.
- `type`: WeatherType - The type of weather condition to set. The possible values are defined in the `WeatherType` enum, including `WEATHER_TYPE_FINE`, `WEATHER_TYPE_RAIN`, `WEATHER_TYPE_SNOW`, `WEATHER_TYPE_STORM`, `WEATHER_TYPE_THUNDERS`, and `WEATHER_TYPE_BLACKRAIN`.
- `grade`: number - The intensity grade of the weather condition. This value can vary depending on the type of weather; for example, a higher value might represent heavier rain or thicker snow.

### Example Usage:
The script below sets the weather in Elwynn Forest (Zone ID: 12) to a heavy storm as part of a scripted event, enhancing the atmosphere for an in-game event.

```typescript
const ElwynnForestZoneId = 12;
const HeavyStormIntensity = 3;

enum WeatherType {
    WEATHER_TYPE_FINE = 0,
    WEATHER_TYPE_RAIN = 1,
    WEATHER_TYPE_SNOW = 2,
    WEATHER_TYPE_STORM = 3,
    WEATHER_TYPE_THUNDERS = 86,
    WEATHER_TYPE_BLACKRAIN = 90
}

const onEventTrigger: custom_events = (event: number): void => {
    const EMapInstance = GetEMapInstance(); // Assuming existing function to get EMap instance

    EMapInstance.SetWeather(ElwynnForestZoneId, WeatherType.WEATHER_TYPE_STORM, HeavyStormIntensity);
    print("Heavy storm has been set in Elwynn Forest.");
}

RegisterEvent(EventIds.CUSTOM_EVENT_TRIGGER, (...args) => onEventTrigger(...args));
```

In the above example:
- `GetEMapInstance()` is a hypothetical function used to obtain an instance of the `EMap` class where the `SetWeather` method is defined.
- `EventIds.CUSTOM_EVENT_TRIGGER` and `custom_events` are placeholders for an event ID and callback type respectively, assuming your mod or script infrastructure supports custom event triggers.

This script can be tailored and expanded to create dynamic weather conditions across multiple zones, enhancing the gameplay experience based on storylines, events, or other criteria.

