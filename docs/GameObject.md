### Despawn
Despawns the GameObject from the game world. This method is commonly used to remove temporary GameObjects or objects that are no longer needed.

#### Parameters
None

#### Returns
void

#### Example Usage
In a scenario where you have a temporary crate GameObject that needs to be despawned after a player interacts with it:
```typescript
const onPlayerInteract: player_event_on_interact_gameobject = (event: number, player: Player, gameObj: GameObject): void => {

    // Logic to handle player interaction with the crate GameObject

    gameObj.Despawn();
}
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_INTERACT_GAMEOBJECT, (...args) => onPlayerInteract(...args));
```

This method is useful for managing GameObjects within the game world by removing them when they are no longer needed.

### AddLoot

Add loot to the game object based on the loot entry and count provided. This method allows for adding multiple loot entries at once if additional parameters are passed.

#### Parameters
* entry: number - The entry ID of the loot item to be added.
* count: number - The number of loot items to be added.
* additional: any[] - Additional parameters to customize the loot process (optional).

#### Returns
void

#### Example Usage
Add rare items to a treasure chest with a custom loot chance:

```typescript
const RARE_ITEM_ENTRY = 12345;
const RARE_ITEM_COUNT = 1;
const CUSTOM_LOOT_CHANCE = 20;

const CustomLoot: gameobject_event_on_use = (event: number, gameobject: GameObject, player: Player): void => {
    gameobject.AddLoot(RARE_ITEM_ENTRY, RARE_ITEM_COUNT, CustomLootChance(CUSTOM_LOOT_CHANCE));
}

RegisterGameObjectEvent(GameObjectEvents.GO_EVENT_ON_USE, (...args) => CustomLoot(...args));

function CustomLootChance(chance: number): any {
    return {
        chance: chance,
        minCount: 1,
        maxCount: 1,
        team: -1,
    };
}
```

In this example, the `AddLoot` method is used to add a rare item to a treasure chest game object when a player interacts with it. The custom `CustomLootChance` function is used to define a custom loot chance for the rare item addition.

### GetDBTableGUIDLow
Returns the low part of the GUID of the GameObject from the database table.

#### Returns
number - The low part of the GUID of the GameObject from the database table.

#### Example Usage
Retrieve the low part of the GUID of a GameObject and store it for future reference.

```typescript
const getGameObjectGUIDLow = (gameObject: GameObject): number => {
    const guidLow = gameObject.GetDBTableGUIDLow();
    return guidLow;
}

const someGameObject: GameObject = GetSomeGameObjectFromDB();
const guidLow = getGameObjectGUIDLow(someGameObject);
console.log(`Low part of the GUID of the GameObject: ${guidLow}`);
``` 

This example demonstrates how to retrieve the low part of the GUID of a GameObject from the database table and use it for further processing or logging purposes.

### GetDisplayId
Returns the display ID of the GameObject. This can be used to determine the visual appearance of the GameObject in-game.

#### Returns
number - The display ID of the GameObject.

#### Example Usage
```typescript
const CheckGameObjectAppearance: player_event_on_click_go = (event: number, player: Player, gameObject: GameObject): void => {
    const displayId = gameObject.GetDisplayId();
    
    console.log(`The display ID of the GameObject is: ${displayId}`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CLICK_GO, (...args) => CheckGameObjectAppearance(...args));
```

### GetGoState
Returns the current state of the game object.

#### Returns 
goState: [GOState](./GOState.md) - The current state of the game object.

#### Example Usage:
Checking the state of a specific game object and executing different actions based on the state.

```typescript
const specificGameObjectEntry = 12345;
const specificState = GOState.ACTIVE;

const CheckGameObjectState: player_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number) => {

    const gameObj = GetGameObjectNearestCoords(player.GetMapId(), player.GetPositionX(), player.GetPositionY(), player.GetPositionZ(), specificGameObjectEntry);
    
    if(gameObj) {
        const state = gameObj.GetGoState();
        
        if(state === specificState) {
            player.SendMessage("This game object is active!");
            // Perform action for active game object
        } else {
            player.SendMessage("This game object is inactive!");
            // Perform action for inactive game object
        }
    } else {
        player.SendMessage("Game object not found!");
    }

}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => CheckGameObjectState(...args));
```

### GetLootRecipient
Returns the player who is looting or interacting with the game object.

#### Returns
player: [Player](./player.md) - The player who is interacting with the game object.

#### Example Usage:
Implement a custom loot distribution system where the player interacting with the game object receives the loot.

```typescript
const LootDistribution: gameobject_event_on_loot = (event: number, go: GameObject, player: Player) => {
    
    const looter = go.GetLootRecipient();

    if(looter) {
        // Implement your custom loot distribution logic here
        // For example, give the loot to the player who is looting the game object
        looter.AddItem(ITEM_ENTRY, ITEM_COUNT);
    }
}

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_LOOT, (...args) => LootDistribution(...args));
```

### GetLootRecipientGroup
Get the group of players that are eligible to receive loot from this game object. 

#### Returns
group: [Group](./group.md) - The group of players that can receive loot from this game object.

#### Example Usage:
Check if the player's group can receive loot from the game object, and distribute loot accordingly. 

```typescript
const onGameObjLoot: gameobject_event_on_loot = (event: number, player: Player, gameObj: GameObject) => {
  
    const lootRecipientGroup = gameObj.GetLootRecipientGroup();

    if(lootRecipientGroup) {
        // Distribute loot to all players in the group
        const groupPlayers = lootRecipientGroup.GetPlayers();
        const loot = gameObj.GetLoot();
        
        groupPlayers.forEach((groupPlayer) => {
            for(const item of loot) {
                groupPlayer.AddItem(item.entry, item.count);
            }
        });
    }
}

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_LOOT, (...args) => onGameObjLoot(...args));
```

### GetLootState
Returns the loot state of the GameObject, indicating whether it can be looted, has been looted, or has despawned.

#### Returns
- [LootState](./lootstate.md) - The current loot state of the GameObject, which can be one of the following:
  - LOOT_STATE_CAN_LOOT: The GameObject can be looted.
  - LOOT_STATE_ALREADY_LOOTED: The GameObject has already been looted.
  - LOOT_STATE_DESPAWNED: The GameObject has despawned and cannot be looted.

#### Example Usage:
Check and handle different loot states of a GameObject.

```typescript
const handleGameObjectLootState = (gameObject: GameObject): void => {
    const lootState = gameObject.GetLootState();

    switch(lootState) {
        case LootState.LOOT_STATE_CAN_LOOT:
            // Handle when the GameObject can be looted
            break;
        case LootState.LOOT_STATE_ALREADY_LOOTED:
            // Handle when the GameObject has already been looted
            break;
        case LootState.LOOT_STATE_DESPAWNED:
            // Handle when the GameObject has despawned and cannot be looted
            break;
        default:
            // Handle default case
    }
}

// Register GameObject event and invoke the handling function
RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_LOOT, (...args) => handleGameObjectLootState(args[0]));
```

### HasQuest
Checks if a specific quest is available on the GameObject.

#### Parameters
* questId: number - The ID of the quest to check for on the GameObject

#### Returns
boolean - Returns 'true' if the quest is available on the GameObject, 'false' otherwise

#### Example Usage:
Check if a GameObject has a specific quest and react accordingly.
```typescript
const QUEST_ID = 1234;

const onGameObjectInteract: gameobject_event_on_interact = (event: number, player: Player, gameObject: GameObject): void => {
    if (gameObject.HasQuest(QUEST_ID)) {
        player.SendMessage("This GameObject is associated with Quest ID: " + QUEST_ID);
    } else {
        player.SendMessage("No Quest associated with this GameObject.");
    }
}

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_INTERACT, (...args) => onGameObjectInteract(...args));
```

### IsActive

This method checks if the GameObject is currently active.

#### Returns
boolean - Returns true if the GameObject is active, false otherwise.

#### Example Usage:

Check if a GameObject is active before triggering a specific behavior:
```typescript
const checkGameObject: player_event_on_gossip_select = (event: number, player: Player, object: GameObject) => {
    if(object.IsActive()) {
        player.SendBroadcastMessage("This object is currently active.");
    } else {
        player.SendBroadcastMessage("This object is inactive.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => checkGameObject(...args));
```

This example demonstrates how to use the `IsActive` method to determine if a GameObject is currently active before displaying a message to the player.

### IsSpawned

This method checks if the game object is currently spawned in the world.

#### Returns
boolean - Returns 'true' if the game object is spawned, 'false' otherwise.

#### Example Usage
Check if a specific game object is spawned before performing an action.

```typescript
const GAME_OBJECT_ID = 1234;
const ACTION_DELAY = 5000; // Delay in milliseconds before attempting to perform the action

const CheckGameObjectSpawned = (gameObject: GameObject): void => {
    if(gameObject.IsSpawned()) {
        // Perform action on the spawned game object
        PerformAction(gameObject);
    } else {
        // Retry after a delay if the game object is not spawned
        setTimeout(() => CheckGameObjectSpawned(gameObject), ACTION_DELAY);
    }
}

const myGameObject = GetGameObjectById(GAME_OBJECT_ID);
CheckGameObjectSpawned(myGameObject);
``` 

In this example, the method `CheckGameObjectSpawned` is used to check if a specific game object is spawned before performing any further action on it. The method utilizes a delay to retry checking if the game object is spawned if it is not initially detected.

