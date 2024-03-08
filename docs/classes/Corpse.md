## GetGhostTime
Returns the time when the player died and spawned this corpse as a ghost.

### Parameters
None

### Returns
ghostTime: number - The time in milliseconds when the player became a ghost and spawned this corpse.

### Example Usage
This example demonstrates how to use the `GetGhostTime()` method to calculate the duration of a player's death and perform actions based on that duration.

```typescript
const LONG_DEATH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

const OnPlayerResurrect: player_event_on_resurrect = (event: number, player: Player): void => {
    const corpse = player.GetCorpse();
    if (corpse) {
        const ghostTime = corpse.GetGhostTime();
        const currentTime = GetGameTime();
        const deathDuration = currentTime - ghostTime;

        if (deathDuration >= LONG_DEATH_THRESHOLD) {
            // Player was dead for a long time
            player.SendBroadcastMessage("You were dead for a long time. Here's a bonus item!");
            player.AddItem(BONUS_ITEM_ENTRY, 1);
        } else {
            // Player had a short death duration
            player.SendBroadcastMessage("You had a quick resurrection. No bonus this time!");
        }

        // Remove the corpse after resurrection
        corpse.RemoveFromWorld(false);
        corpse.Delete();
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_RESURRECT, (...args) => OnPlayerResurrect(...args));
```

In this example:
1. We define a constant `LONG_DEATH_THRESHOLD` to represent the duration threshold for considering a death as "long" (e.g., 5 minutes in milliseconds).

2. Inside the `OnPlayerResurrect` event handler, we retrieve the player's corpse using `player.GetCorpse()`.

3. If the corpse exists, we call `corpse.GetGhostTime()` to get the time when the player became a ghost and spawned the corpse.

4. We calculate the duration of the player's death by subtracting the ghost time from the current game time using `GetGameTime()`.

5. We compare the death duration with the `LONG_DEATH_THRESHOLD`:
   - If the death duration is greater than or equal to the threshold, we consider it a long death and reward the player with a bonus item using `player.AddItem()`. We also send a broadcast message to the player informing them about the bonus.
   - If the death duration is shorter than the threshold, we send a broadcast message to the player indicating that they had a quick resurrection and won't receive a bonus this time.

6. After handling the resurrection logic, we remove the corpse from the world using `corpse.RemoveFromWorld()` and delete it using `corpse.Delete()` to clean up.

7. Finally, we register the `OnPlayerResurrect` event handler using `RegisterPlayerEvent()` to be triggered whenever a player resurrects.

This example showcases how the `GetGhostTime()` method can be used to track the duration of a player's death and perform actions based on that duration, such as rewarding players for long deaths or providing different messages based on the resurrection speed.

## GetOwnerGUID
Returns the GUID (Globally Unique Identifier) of the player who owns the corpse. This method is useful for identifying the owner of a corpse and performing actions based on that information.

### Parameters
This method does not take any parameters.

### Returns
- `number`: The GUID of the player who owns the corpse.

### Example Usage
Here's an example of how to use the `GetOwnerGUID()` method to identify the owner of a corpse and perform actions based on that information:

```typescript
const OnPlayerDeath: player_event_on_death = (event: number, player: Player): void => {
    const corpse = player.GetCorpse();
    if (corpse) {
        const ownerGUID = corpse.GetOwnerGUID();
        const owner = GetPlayerByGUID(ownerGUID);

        if (owner) {
            // Check if the owner is in a specific guild
            const guildId = 123; // Replace with the desired guild ID
            if (owner.IsInGuild(guildId)) {
                // Perform actions for guild members
                owner.SendBroadcastMessage("As a guild member, your corpse will be automatically released in 30 seconds.");
                owner.ResurrectPlayer(100, false);
                corpse.Despawn(30 * 1000); // Despawn the corpse after 30 seconds
            } else {
                // Perform actions for non-guild members
                owner.SendBroadcastMessage("Your corpse will remain at the location of your death. You can retrieve it manually.");
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, OnPlayerDeath);
```

In this example:
1. When a player dies, the `OnPlayerDeath` event is triggered.
2. We retrieve the player's corpse using `player.GetCorpse()`.
3. If the corpse exists, we get the owner's GUID using `corpse.GetOwnerGUID()`.
4. We retrieve the owner player object using `GetPlayerByGUID(ownerGUID)`.
5. If the owner player is found, we check if they belong to a specific guild using `owner.IsInGuild(guildId)`.
   - If the owner is a guild member, we send them a broadcast message indicating that their corpse will be automatically released in 30 seconds.
   - We then resurrect the player with full health using `owner.ResurrectPlayer(100, false)`.
   - Finally, we despawn the corpse after 30 seconds using `corpse.Despawn(30 * 1000)`.
6. If the owner is not a guild member, we send them a different broadcast message indicating that their corpse will remain at the location of their death and they can retrieve it manually.

This example demonstrates how to use the `GetOwnerGUID()` method to identify the owner of a corpse and perform different actions based on whether the owner belongs to a specific guild or not.

## GetType
Returns the type of the corpse. The type can be one of the following:
- `CORPSE_BONES`: The corpse is a skeleton and cannot be resurrected.
- `CORPSE_RESURRECTABLE_PVE`: The corpse can be resurrected and belongs to a player who died in PvE combat.
- `CORPSE_RESURRECTABLE_PVP`: The corpse can be resurrected and belongs to a player who died in PvP combat.

### Parameters
None

### Returns
[CorpseType](../Enums/CorpseType.md): The type of the corpse.

### Example Usage
This example demonstrates how to use the `GetType` method to determine if a player's corpse is resurrectable and display a message accordingly.

```typescript
const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit): void => {
    const corpse = player.GetCorpse();
    if (!corpse) {
        return;
    }

    const corpseType = corpse.GetType();
    switch (corpseType) {
        case CorpseType.CORPSE_RESURRECTABLE_PVE:
            SendMessageToPlayer(player, "Your corpse is resurrectable. You died in PvE combat.");
            break;
        case CorpseType.CORPSE_RESURRECTABLE_PVP:
            SendMessageToPlayer(player, "Your corpse is resurrectable. You died in PvP combat.");
            break;
        case CorpseType.CORPSE_BONES:
            SendMessageToPlayer(player, "Your corpse cannot be resurrected. It has decomposed into bones.");
            break;
        default:
            SendMessageToPlayer(player, "Unknown corpse type.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, OnPlayerDeath);
```

In this example:
1. When a player dies, the `OnPlayerDeath` event is triggered.
2. We retrieve the player's corpse using `player.GetCorpse()`.
3. If the corpse exists, we use the `GetType` method to determine the type of the corpse.
4. Based on the corpse type, we send an appropriate message to the player using `SendMessageToPlayer`:
   - If the corpse is resurrectable and the player died in PvE combat, we send a message indicating that the corpse can be resurrected.
   - If the corpse is resurrectable and the player died in PvP combat, we send a message indicating that the corpse can be resurrected.
   - If the corpse has decomposed into bones and cannot be resurrected, we send a message informing the player about it.
   - If the corpse type is unknown, we send a generic message.

This example showcases how the `GetType` method can be used to determine the type of a player's corpse and take different actions based on the corpse type.

## ResetGhostTime
Sets the corpse's "ghost time" to the current time. The ghost time is used to determine how long a ghost has been active for a player's corpse.

This method is useful when you want to manipulate the ghost duration of a corpse, such as extending or resetting the time until the corpse despawns.

### Parameters
None

### Returns
None

### Example Usage
In this example, we will reset the ghost time of a player's corpse when they die in a specific map. This can be useful if you want to give players more time to retrieve their corpse in certain areas.

```typescript
const MAP_ID_GHOSTLANDS = 530;
const GHOST_DURATION_EXTENSION = 60; // In seconds

const OnPlayerDeath: player_event_on_death = (event: number, player: Player): void => {
    const mapId = player.GetMapId();
    
    if (mapId === MAP_ID_GHOSTLANDS) {
        const corpse = player.GetCorpse();
        
        if (corpse) {
            corpse.ResetGhostTime();
            
            const ghostDuration = corpse.GetGhostTime() + GHOST_DURATION_EXTENSION;
            corpse.SetGhostTime(ghostDuration);
            
            player.SendBroadcastMessage(`Your corpse's ghost time has been extended by ${GHOST_DURATION_EXTENSION} seconds in Ghostlands.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this script:
1. We define the specific map ID (Ghostlands) and the duration in seconds by which we want to extend the ghost time.
2. When a player dies, we check if they are in the Ghostlands map using `player.GetMapId()`.
3. If the player is in Ghostlands, we retrieve their corpse using `player.GetCorpse()`.
4. If the corpse exists, we reset its ghost time using `corpse.ResetGhostTime()`.
5. We then calculate the new ghost duration by adding the extension duration to the current ghost time.
6. We set the new ghost duration using `corpse.SetGhostTime(ghostDuration)`.
7. Finally, we send a message to the player informing them that their corpse's ghost time has been extended in Ghostlands.

This script ensures that players have an extended time to retrieve their corpse when they die in the Ghostlands map, providing a more forgiving gameplay experience in that specific area.

## SaveToDB
Saves the corpse to the database, ensuring that the corpse and its contents persist across server restarts or crashes.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
This example demonstrates how to save a player's corpse to the database when they die, and then restore the corpse's contents to the player when they resurrect.

```typescript
const ITEM_ENTRY_HEARTHSTONE = 6948;

const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    const corpse = player.GetCorpse();
    if (corpse) {
        // Save the corpse to the database
        corpse.SaveToDB();
    }
}

const OnPlayerResurrect: player_event_on_resurrect = (event: number, player: Player) => {
    const corpse = player.GetCorpse();
    if (corpse) {
        // Restore the player's items from the corpse
        const itemCount = corpse.GetItemCount();
        for (let i = 0; i < itemCount; i++) {
            const item = corpse.GetItemByIndex(i);
            if (item && item.GetEntry() !== ITEM_ENTRY_HEARTHSTONE) {
                // Add the item to the player's inventory, excluding the Hearthstone
                player.AddItem(item.GetEntry(), item.GetItemCount());
            }
        }
        
        // Remove the corpse from the world and database
        corpse.RemoveFromWorld();
        corpse.DeleteFromDB();
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_RESURRECT, (...args) => OnPlayerResurrect(...args));
```

In this example:
1. When a player dies, the `OnPlayerDeath` event is triggered.
2. The script retrieves the player's corpse using `player.GetCorpse()`.
3. If the corpse exists, it is saved to the database using `corpse.SaveToDB()`, ensuring that the corpse and its contents are persisted.
4. When the player resurrects, the `OnPlayerResurrect` event is triggered.
5. The script retrieves the player's corpse again.
6. If the corpse exists, the script iterates through the items in the corpse using `corpse.GetItemCount()` and `corpse.GetItemByIndex(i)`.
7. For each item, excluding the Hearthstone (item entry 6948), the script adds the item to the player's inventory using `player.AddItem()`.
8. After restoring the items, the script removes the corpse from the world using `corpse.RemoveFromWorld()` and deletes it from the database using `corpse.DeleteFromDB()`.

This example showcases how to save a corpse to the database when a player dies and restore the corpse's contents to the player when they resurrect, providing a seamless experience across server restarts or crashes.

