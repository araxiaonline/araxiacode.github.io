## Despawn
Despawns the GameObject from the game world. The GameObject may be automatically respawned by the core based on its respawn settings.

#### Example Usage:
This example demonstrates how to despawn a GameObject after a player interacts with it, and then respawn it after a specified duration.

```typescript
const GAMEOBJECT_ENTRY = 123456;
const RESPAWN_DURATION = 30000; // 30 seconds

const onGameObjectUse: gameobject_event_on_use = (event: number, player: Player, gameObject: GameObject) => {
    if (gameObject.GetEntry() === GAMEOBJECT_ENTRY) {
        // Despawn the GameObject
        gameObject.Despawn();

        // Schedule the GameObject to respawn after the specified duration
        const respawnDelay = RESPAWN_DURATION;
        setTimeout(() => {
            // Get the GameObject's position
            const position = gameObject.GetPosition();

            // Respawn the GameObject at its original position
            const respawnedGameObject = GameObjectMgr.CreateGameObject(GAMEOBJECT_ENTRY, position.GetMapId(), position.GetX(), position.GetY(), position.GetZ(), position.GetO());
            respawnedGameObject.SetRespawnTime(0); // Respawn immediately
        }, respawnDelay);

        // Perform any additional actions or notifications
        player.SendBroadcastMessage(`You have interacted with the GameObject. It will respawn in ${RESPAWN_DURATION / 1000} seconds.`);
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (...args) => onGameObjectUse(...args));
```

In this example:
1. We define the entry ID of the GameObject we want to despawn and the desired respawn duration in milliseconds.
2. When a player interacts with the GameObject (triggers the `GAMEOBJECT_EVENT_ON_USE` event), we check if the GameObject's entry matches the specified entry ID.
3. If it matches, we despawn the GameObject using the `Despawn()` method.
4. We schedule the GameObject to respawn after the specified duration using `setTimeout()`.
5. Inside the timeout callback, we retrieve the GameObject's original position using `GetPosition()`.
6. We create a new instance of the GameObject using `GameObjectMgr.CreateGameObject()`, passing the entry ID, map ID, and position coordinates.
7. We set the respawn time of the new GameObject instance to 0 using `SetRespawnTime()` to make it respawn immediately.
8. Finally, we send a broadcast message to the player informing them about the interaction and the respawn duration.

Note: The respawned GameObject may have different properties or states compared to the original one, depending on how it is defined in the database or scripted.

This example demonstrates a more complex usage of the `Despawn()` method, including retrieving the GameObject's position, creating a new instance, and scheduling the respawn after a specified duration.

## AddLoot
This method allows you to add loot to a [GameObject] of type [GAMEOBJECT_TYPE_CHEST] (3) when it is looted. To use this method, the Loot_Template_ID of the [GameObject] must be set to 0. You can add multiple items as loot by providing the item entry and count as parameters.

### Parameters
- `entry`: number - The item entry ID from the `item_template` table.
- `count`: number - The number of items to add to the loot.
- `...additional`: any[] - Optional additional parameters to add more items to the loot. The parameters should be provided in the format of `entry, count, entry, count, ...`.

### Example Usage
In this example, we will create a custom chest that contains specific loot items when opened by players.

```typescript
const CHEST_ENTRY = 100000;
const ITEM_ENTRY_1 = 12345;
const ITEM_ENTRY_2 = 67890;
const ITEM_ENTRY_3 = 54321;

const OnGameObjectUse: gameobject_event_on_use = (event: number, go: GameObject, player: Player): void => {
    if (go.GetEntry() === CHEST_ENTRY) {
        // Add loot items to the chest
        go.AddLoot(ITEM_ENTRY_1, 1);
        go.AddLoot(ITEM_ENTRY_2, 3);
        go.AddLoot(ITEM_ENTRY_3, 2);

        // Despawn the chest after looting
        go.Despawn();

        // Send a message to the player
        player.SendBroadcastMessage("You have looted the special chest!");
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (...args) => OnGameObjectUse(...args));
```

In this script:
1. We define constants for the custom chest entry and the item entries we want to add as loot.
2. We register the `GAMEOBJECT_EVENT_ON_USE` event to trigger when a player uses (opens) a [GameObject].
3. Inside the event handler, we check if the used [GameObject] has the entry of our custom chest.
4. If it matches, we use the `AddLoot` method to add the desired items to the chest's loot. We specify the item entry and count for each item.
5. After adding the loot, we despawn the chest using the `Despawn` method to prevent multiple looting.
6. Finally, we send a broadcast message to the player indicating that they have looted the special chest.

Make sure to create the custom chest [GameObject] in the database with the corresponding entry and set its Loot_Template_ID to 0. This script will add the specified loot items to the chest when a player opens it.

Note: The `...additional` parameter allows you to add more items to the loot by providing additional entry and count pairs. For example, you can use `go.AddLoot(ITEM_ENTRY_1, 1, ITEM_ENTRY_2, 3, ITEM_ENTRY_3, 2)` to add multiple items in a single call.

## GetDBTableGUIDLow
Returns the guid of the [GameObject] that is used as the ID in the database. This method is useful for referencing the GameObject in the database for further operations or checks.

### Returns
- `number` - The low GUID of the GameObject in the database.

### Example Usage
Checking if a GameObject has been interacted with by a player and storing the interaction in the database.

```typescript
// Event handler for GameObject use
const onGameObjectUse = (event: number, player: Player, object: GameObject): void => {
    // Get the GameObject's GUID
    const objectGuid = object.GetDBTableGUIDLow();

    // Check if the player has already interacted with this GameObject
    const query = `SELECT COUNT(*) FROM player_gameobject_interactions WHERE player_guid = ${player.GetGUIDLow()} AND gameobject_guid = ${objectGuid}`;
    const result = WorldDBQuery(query);

    if (result && result.GetUInt32(0) > 0) {
        // Player has already interacted with this GameObject
        player.SendBroadcastMessage("You have already used this object.");
    } else {
        // Player hasn't interacted with this GameObject yet
        player.SendBroadcastMessage("You use the object for the first time!");

        // Store the interaction in the database
        const insertQuery = `INSERT INTO player_gameobject_interactions (player_guid, gameobject_guid) VALUES (${player.GetGUIDLow()}, ${objectGuid})`;
        WorldDBExecute(insertQuery);

        // Perform additional actions or rewards for first-time interaction
        player.AddItem(12345, 1); // Give the player a reward item
        player.GiveXP(1000); // Give the player some experience points
    }
};

// Register the event handler
RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, onGameObjectUse);
```

In this example:
1. When a player uses a GameObject, the `onGameObjectUse` event handler is triggered.
2. The method `GetDBTableGUIDLow()` is called on the GameObject to retrieve its low GUID.
3. A query is executed to check if the player has already interacted with this GameObject by searching the `player_gameobject_interactions` table in the database.
4. If the player has already interacted, a message is sent to the player indicating so.
5. If the player hasn't interacted yet:
   - A message is sent to the player indicating it's their first time using the object.
   - The interaction is stored in the `player_gameobject_interactions` table using an INSERT query.
   - Additional actions or rewards can be given to the player for their first-time interaction, such as adding an item to their inventory or granting experience points.

Note: Make sure to create the `player_gameobject_interactions` table in your database with the appropriate columns (`player_guid` and `gameobject_guid`) before using this script.

This example demonstrates how the `GetDBTableGUIDLow()` method can be used in combination with database queries to track and manage player interactions with GameObjects, enabling custom functionality and rewards based on those interactions.

## GetDisplayId
Returns the display ID of the GameObject. The display ID determines the visual appearance of the GameObject in the game world. It corresponds to the ID in the `gameobject_template` table in the world database.

### Parameters
None

### Returns
displayId: number - The display ID of the GameObject.

### Example Usage
Imagine a scenario where you want to create a script that interacts with specific GameObjects based on their display IDs. For example, you may want to trigger different actions when a player uses a lever with a specific appearance.

```typescript
const LEVER_DISPLAY_ID_1 = 1234;
const LEVER_DISPLAY_ID_2 = 5678;

const OnGameObjectUse: gameobject_event_on_use = (event, player, gameObject) => {
    const displayId = gameObject.GetDisplayId();

    switch (displayId) {
        case LEVER_DISPLAY_ID_1:
            // Perform action for lever with display ID 1
            player.SendBroadcastMessage("You have activated the first lever!");
            // Additional logic for lever 1
            break;
        case LEVER_DISPLAY_ID_2:
            // Perform action for lever with display ID 2
            player.SendBroadcastMessage("You have activated the second lever!");
            // Additional logic for lever 2
            break;
        default:
            // Handle unknown lever display IDs
            player.SendBroadcastMessage("Unknown lever activated.");
            break;
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (event, player, gameObject) => OnGameObjectUse(event, player, gameObject));
```

In this example, the script registers an event handler for the `GAMEOBJECT_EVENT_ON_USE` event, which is triggered when a player interacts with a GameObject. Inside the event handler, the `GetDisplayId()` method is called on the `gameObject` object to retrieve its display ID.

The script then uses a switch statement to perform different actions based on the display ID. If the display ID matches `LEVER_DISPLAY_ID_1`, it sends a broadcast message to the player indicating that they have activated the first lever and can execute additional logic specific to that lever. Similarly, if the display ID matches `LEVER_DISPLAY_ID_2`, it sends a different broadcast message and can perform actions specific to the second lever.

If the display ID doesn't match any of the defined constants, the script falls back to the default case and sends a generic message indicating an unknown lever activation.

By using the `GetDisplayId()` method, you can easily identify and differentiate between GameObjects based on their visual appearance, allowing you to create interactive scripts that respond to specific objects in the game world.

## GetGoState

Returns the current state of a GameObject. The state determines how the GameObject appears and interacts with the game world.

### Returns

* [GOState](#gostate-enum) - The current state of the GameObject.

### GOState Enum

The `GOState` enum represents the possible states of a GameObject. Here are the available states in version 3.3.5a:

```typescript
enum GOState
{
    GO_STATE_ACTIVE             = 0,    // show in world as used and not reset (closed door open)
    GO_STATE_READY              = 1,    // show in world as ready (closed door close)
    GO_STATE_ACTIVE_ALTERNATIVE = 2     // show in world as used in alt way and not reset (closed door open by cannon fire)
};
```

### Example Usage

This example demonstrates how to use the `GetGoState()` method to determine the state of a door GameObject and perform actions based on its state.

```typescript
const DOOR_ENTRY = 12345;

const UpdateDoorState: map_event_on_gameobject_update = (event: number, object: GameObject, map: Map) => {
    if (object.GetEntry() === DOOR_ENTRY) {
        const doorState = object.GetGoState();

        switch (doorState) {
            case GOState.GO_STATE_ACTIVE:
                // The door is currently open
                // Perform actions for an open door
                object.SetGoState(GOState.GO_STATE_READY); // Close the door after a certain time
                map.GetAllPlayers().forEach((player: Player) => {
                    player.SendBroadcastMessage('The door is closing in 10 seconds!');
                });
                break;
            case GOState.GO_STATE_READY:
                // The door is currently closed
                // Perform actions for a closed door
                map.GetAllCreatures().forEach((creature: Creature) => {
                    if (creature.GetEntry() === GUARD_ENTRY) {
                        creature.MoveToPosition(object.GetX(), object.GetY(), object.GetZ(), 0); // Move guards to the door
                    }
                });
                break;
            case GOState.GO_STATE_ACTIVE_ALTERNATIVE:
                // The door is open by alternative means (e.g., cannon fire)
                // Perform actions for an alternatively opened door
                map.GetAllPlayers().forEach((player: Player) => {
                    player.SendBroadcastMessage('The door has been blown open by cannon fire!');
                });
                break;
        }
    }
};

RegisterMapEvent(MapEvents.MAP_EVENT_ON_GAMEOBJECT_UPDATE, (...args) => UpdateDoorState(...args));
```

In this example:
1. We define the entry ID of the door GameObject we want to monitor.
2. In the `MAP_EVENT_ON_GAMEOBJECT_UPDATE` event, we check if the updated GameObject matches the desired door entry.
3. We use the `GetGoState()` method to retrieve the current state of the door.
4. Based on the state, we perform different actions:
   - If the door is open (`GO_STATE_ACTIVE`), we close it after a certain time and send a broadcast message to all players.
   - If the door is closed (`GO_STATE_READY`), we move nearby guard creatures to the door's position.
   - If the door is open by alternative means (`GO_STATE_ACTIVE_ALTERNATIVE`), we send a broadcast message to all players indicating that the door was blown open by cannon fire.

This example showcases how the `GetGoState()` method can be used to determine the state of a GameObject and trigger specific actions based on that state, allowing for dynamic interactions within the game world.

## GetLootRecipient
Returns the [Player](./player.md) that is currently able to loot the [GameObject](./gameobject.md). This may not always be the original looter, as loot rights can be passed to other players in the group. If no player has loot rights, this method will return `nil`.

### Parameters
This method does not take any parameters.

### Returns
[Player](./player.md) - The player that can currently loot the GameObject, or `nil` if no player has loot rights.

### Example Usage
This example demonstrates how to use the `GetLootRecipient` method to grant additional rewards to the player who can loot a specific GameObject.

```typescript
const GO_CHEST_ENTRY = 12345;
const BONUS_ITEM_ENTRY = 54321;
const BONUS_ITEM_COUNT = 1;

const OnGoLootStateChanged: gameobject_event_on_loot_state_changed = (event: number, go: GameObject, state: number) => {
    if (go.GetEntry() === GO_CHEST_ENTRY && state === 1) {
        const looter = go.GetLootRecipient();

        if (looter) {
            const hasQuestCompleted = looter.HasQuest(SOME_QUEST_ENTRY);
            const hasRequiredItem = looter.HasItem(SOME_ITEM_ENTRY);

            if (hasQuestCompleted && hasRequiredItem) {
                looter.AddItem(BONUS_ITEM_ENTRY, BONUS_ITEM_COUNT);
                SendSystemMessage(looter, "You have received a bonus reward for your efforts!");
            } else {
                SendSystemMessage(looter, "You do not meet the requirements for the bonus reward.");
            }
        }
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGED, (...args) => OnGoLootStateChanged(...args));
```

In this example:

1. We define constants for the specific GameObject entry we want to monitor, as well as the bonus item entry and count.

2. We register a callback function for the `GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGED` event, which triggers when the loot state of a GameObject changes.

3. Inside the callback, we first check if the GameObject's entry matches the one we're interested in and if the new loot state is 1 (ready for loot).

4. If the conditions are met, we use `GetLootRecipient` to get the player who can loot the GameObject.

5. If a valid looter is found, we perform additional checks to see if the player has completed a specific quest and possesses a required item.

6. If the player meets the requirements, we use the `AddItem` method to grant them the bonus item and send a success message using `SendSystemMessage`.

7. If the player does not meet the requirements, we send an appropriate message informing them of the situation.

This example showcases how `GetLootRecipient` can be used in conjunction with other methods and events to create more complex loot scenarios and reward systems based on player actions and achievements.

## GetLootRecipientGroup
Returns the [Group](./group.md) that is currently able to loot the [GameObject]. This may not always be the original looter, as loot rights can be passed to other players or groups in certain scenarios.

### Parameters
None

### Returns
[Group](./group.md) - The group that can currently loot the [GameObject], or `nil` if no group can loot it.

### Example Usage
In this example, we'll create a script that announces which group has looting rights for a particular [GameObject] whenever it is successfully opened.

```typescript
const GOOpen: gameobject_event_on_loot_state_changed = (event: number, go: GameObject, state: number) => {
    if (state === 1) { // 1 = GO_ACTIVATED
        const lootGroup = go.GetLootRecipientGroup();
        
        if (lootGroup) {
            const groupLeader = lootGroup.GetLeaderGUID();
            const leaderName = GetPlayerNameByGUID(groupLeader);
            
            const membersCount = lootGroup.GetMembersCount();
            
            let announcement = `The group led by ${leaderName} has looting rights for ${go.GetName()}!`;
            if (membersCount > 1) {
                announcement += ` The group consists of ${membersCount} members.`;
            }
            
            SendWorldMessage(announcement);
        } else {
            SendWorldMessage(`${go.GetName()} has been opened, but no group has looting rights.`);
        }
    }
};

RegisterGameObjectEvent(0, GameObjectEvents.GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGED, GOOpen);
```

In this script:
1. We register a handler for the `GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGED` event.
2. When the event is triggered, we check if the new state is `GO_ACTIVATED`, which means the [GameObject] has been successfully opened.
3. We then call `GetLootRecipientGroup()` to get the [Group] that can loot the [GameObject].
4. If a loot group is found, we retrieve the group leader's GUID and name using `GetLeaderGUID()` and `GetPlayerNameByGUID()`, respectively.
5. We also get the number of members in the group using `GetMembersCount()`.
6. We construct an announcement message that includes the leader's name, the [GameObject]'s name, and the number of group members (if greater than 1).
7. Finally, we send the announcement message to all players in the world using `SendWorldMessage()`.
8. If no loot group is found, we send a different message indicating that the [GameObject] has been opened but no group has looting rights.

This script provides valuable information to players about which group has obtained looting rights for a particular [GameObject], fostering a sense of competition and encouraging group play.

## GetLootState

Returns the current [LootState](../enums/LootState.md) of the [GameObject]. This can be useful for determining if a player can loot the object or if it's currently being looted by another player.

### Returns

[LootState](../enums/LootState.md) - The current loot state of the [GameObject].

### Example Usage

This example demonstrates how to use the `GetLootState()` method to prevent players from looting a chest while it's being looted by another player.

```typescript
const CHEST_ENTRY = 12345;
const CHEST_RESPAWN_TIME = 60; // In seconds

const OnGameObjectLootStateChanged: gameobject_event_on_loot_state_change = (event: number, go: GameObject, state: LootState) => {
    if (go.GetEntry() === CHEST_ENTRY && state === LootState.GO_ACTIVATED) {
        // Chest is being looted, start a respawn timer
        go.Despawn(0, CHEST_RESPAWN_TIME * IN_MILLISECONDS);
    }
};

const OnGameObjectUse: gameobject_event_on_use = (event: number, player: Player, go: GameObject) => {
    if (go.GetEntry() === CHEST_ENTRY) {
        const lootState = go.GetLootState();

        if (lootState === LootState.GO_READY) {
            // Chest is ready to be looted
            player.SendBroadcastMessage("You open the chest and find some treasure inside!");
        } else if (lootState === LootState.GO_ACTIVATED) {
            // Chest is currently being looted by another player
            player.SendBroadcastMessage("Someone else is already looting this chest. Please wait.");
        } else {
            // Chest is not ready to be looted
            player.SendBroadcastMessage("The chest appears to be empty. Perhaps it will refill later.");
        }
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_LOOT_STATE_CHANGED, (...args) => OnGameObjectLootStateChanged(...args));
RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (...args) => OnGameObjectUse(...args));
```

In this example, we register two event handlers:

1. `OnGameObjectLootStateChanged`: This handler is triggered when the loot state of a [GameObject] changes. If the chest is being looted (state == `LootState.GO_ACTIVATED`), we despawn it and set a respawn timer using the `Despawn()` method.

2. `OnGameObjectUse`: This handler is triggered when a player uses (clicks on) a [GameObject]. If the clicked object is our chest, we check its current loot state using `GetLootState()`. Based on the state, we send an appropriate message to the player, informing them if they can loot the chest, if it's being looted by someone else, or if it's empty.

This script ensures that players cannot loot the chest simultaneously and provides feedback to the player about the chest's current state.

## HasQuest
Determines if the [GameObject] has a specific [Quest] that can be started by interacting with it.

*Parameters*
* questId: number - The ID of the quest to check.

*Returns*
* boolean - Returns `true` if the [GameObject] can give the specified [Quest], `false` otherwise.

### Example Usage
This example demonstrates how to use the `HasQuest` method to determine if a game object is the starting point for a specific quest and display a message to the player accordingly.

```typescript
const QUEST_ENTRY = 1234; // Replace with the desired quest ID
const gameObjectId = 5678; // Replace with the desired game object ID

const ExamineGameObject: player_event_on_gossip_hello = (event: number, player: Player, gameObject: GameObject) => {
    if (gameObject.GetEntry() === gameObjectId) {
        if (gameObject.HasQuest(QUEST_ENTRY)) {
            if (!player.HasQuest(QUEST_ENTRY) && player.CanTakeQuest(QUEST_ENTRY)) {
                player.GossipMenuAddItem(0, "I am ready to start the quest.", 0, 1);
                player.GossipSendMenu(0, gameObject);
            } else {
                player.SendBroadcastMessage("You have already started or completed this quest.");
                player.GossipComplete();
            }
        } else {
            player.SendBroadcastMessage("This object does not offer the specified quest.");
            player.GossipComplete();
        }
    }
};

const SelectGameObject: player_event_on_gossip_select = (event: number, player: Player, gameObject: GameObject, sender: number, action: number) => {
    if (gameObject.GetEntry() === gameObjectId && action === 1) {
        player.AddQuest(QUEST_ENTRY);
        player.SendBroadcastMessage("Quest started: " + player.GetQuest(QUEST_ENTRY).GetTitle());
        player.GossipComplete();
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => ExamineGameObject(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => SelectGameObject(...args));
```

In this example:
1. The script defines the desired quest entry (`QUEST_ENTRY`) and the game object ID (`gameObjectId`) that triggers the quest.
2. When the player interacts with the game object (`PLAYER_EVENT_ON_GOSSIP_HELLO`), the script checks if the game object has the specified quest using `HasQuest`.
3. If the game object has the quest, the script further checks if the player has already started or completed the quest using `HasQuest` and `CanTakeQuest`.
4. If the player is eligible to start the quest, a gossip menu item is added to prompt the player to start the quest.
5. If the player selects the gossip option to start the quest (`PLAYER_EVENT_ON_GOSSIP_SELECT`), the script adds the quest to the player's quest log using `AddQuest` and sends a broadcast message to inform the player.
6. The script handles different scenarios, such as when the player has already started or completed the quest, or if the game object does not offer the specified quest, by sending appropriate messages to the player.

This example showcases how the `HasQuest` method can be used in combination with other methods and events to create a quest starter interaction with a game object.

## IsActive
Returns a boolean value indicating whether the GameObject is active or not.

### Parameters
None

### Returns
boolean - Returns `true` if the GameObject is active, `false` otherwise.

### Example Usage
This example demonstrates how to check if a GameObject is active and perform actions based on its state.

```typescript
const GOBJECT_ENTRY = 12345; // Replace with the desired GameObject entry ID

const OnGameObjectUse: gameobject_event_on_use = (event: GameObjectEvents, player: Player, gameObject: GameObject) => {
    if (gameObject.GetEntry() === GOBJECT_ENTRY) {
        if (gameObject.IsActive()) {
            player.SendBroadcastMessage("The GameObject is active!");

            // Perform actions when the GameObject is active
            const lootEntry = 54321; // Replace with the desired loot entry ID
            gameObject.AddLoot(lootEntry);

            // Spawn an additional GameObject near the active one
            const spawnEntry = 67890; // Replace with the desired spawn entry ID
            const spawnDuration = 30; // Duration in seconds for the spawned GameObject to remain
            const spawnDistance = 5; // Distance from the active GameObject to spawn the new one
            const spawnOrientation = gameObject.GetOrientation();
            const spawnPosition = gameObject.GetNearPosition(spawnDistance, spawnOrientation);
            gameObject.SummonGameObject(spawnEntry, spawnPosition.x, spawnPosition.y, spawnPosition.z, spawnOrientation, spawnDuration);
        } else {
            player.SendBroadcastMessage("The GameObject is not active. Activating it now!");
            gameObject.Activate();

            // Perform actions when the GameObject becomes active
            gameObject.SetGoState(GameObjectState.STATE_READY);
            gameObject.SetLootState(LootState.LOOT_STATE_READY);

            // Create a timed event to deactivate the GameObject after a certain duration
            const deactivationDelay = 60; // Delay in seconds before deactivating the GameObject
            player.RegisterTimedEvent(deactivationDelay * 1000, (eventId: number, delay: number, repeats: number) => {
                gameObject.Deactivate();
                player.SendBroadcastMessage("The GameObject has been deactivated.");
            });
        }
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, OnGameObjectUse);
```

In this example:
1. We define the `OnGameObjectUse` event handler for the `GAMEOBJECT_EVENT_ON_USE` event.
2. When a player uses a GameObject with the specified entry ID (`GOBJECT_ENTRY`), we check if the GameObject is active using `gameObject.IsActive()`.
3. If the GameObject is active:
   - We send a message to the player indicating that the GameObject is active.
   - We add loot to the GameObject using `gameObject.AddLoot()`.
   - We spawn an additional GameObject near the active one using `gameObject.SummonGameObject()`.
4. If the GameObject is not active:
   - We send a message to the player indicating that the GameObject is being activated.
   - We activate the GameObject using `gameObject.Activate()`.
   - We set the GameObject's state to `STATE_READY` and loot state to `LOOT_STATE_READY`.
   - We create a timed event using `player.RegisterTimedEvent()` to deactivate the GameObject after a certain delay.
5. Finally, we register the `OnGameObjectUse` event handler using `RegisterGameObjectEvent()`.

This example showcases various actions that can be performed based on the active state of a GameObject, such as adding loot, spawning additional GameObjects, and creating timed events for deactivation.

## IsSpawned
Returns a boolean value indicating whether the GameObject is currently spawned in the game world.

### Parameters
None

### Returns
boolean - Returns `true` if the GameObject is spawned, `false` otherwise.

### Example Usage
This example demonstrates how to check if a GameObject is spawned and perform actions based on the result.

```typescript
const GO_ENTRY = 180000;

const CheckGameObject = () => {
    const gameObject = GetGameObjectByEntry(GO_ENTRY);

    if (gameObject) {
        if (gameObject.IsSpawned()) {
            console.log(`GameObject with entry ${GO_ENTRY} is spawned.`);
            // Perform actions when the GameObject is spawned
            const x = gameObject.GetX();
            const y = gameObject.GetY();
            const z = gameObject.GetZ();
            console.log(`GameObject location: (${x}, ${y}, ${z})`);

            // Interact with the spawned GameObject
            gameObject.SetLootState(1); // Set loot state to ready
            gameObject.SetGoState(1); // Set state to active
        } else {
            console.log(`GameObject with entry ${GO_ENTRY} is not spawned.`);
            // Perform actions when the GameObject is not spawned
            const respawnDelay = 60; // Respawn delay in seconds
            gameObject.Respawn(respawnDelay);
            console.log(`Respawning GameObject in ${respawnDelay} seconds.`);
        }
    } else {
        console.log(`GameObject with entry ${GO_ENTRY} not found.`);
    }
};

// Call the function to check the GameObject
CheckGameObject();
```

In this example, we define a function called `CheckGameObject` that retrieves a GameObject by its entry ID using the `GetGameObjectByEntry` function. If the GameObject is found, we check if it is spawned using the `IsSpawned` method.

If the GameObject is spawned, we log a message indicating that it is spawned and perform actions such as accessing its location using `GetX`, `GetY`, and `GetZ` methods. We can also interact with the spawned GameObject by setting its loot state using `SetLootState` and its state using `SetGoState`.

If the GameObject is not spawned, we log a message indicating that it is not spawned and perform actions such as respawning the GameObject after a specified delay using the `Respawn` method.

If the GameObject is not found, we log a message indicating that the GameObject with the specified entry was not found.

This example showcases how to use the `IsSpawned` method to determine the spawned state of a GameObject and perform different actions based on the result.

