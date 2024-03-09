## GetFlags
Returns the flags associated with a quest. These flags provide additional information about the quest, such as whether it is repeatable, Epic, or is an Escort quest.

### Parameters
This method does not take any parameters.

### Returns
[QuestFlags](../Types/questflags.md): The flags associated with the quest.

### Example Usage
This example demonstrates how to check if a quest is repeatable and award bonus reputation if it is.

```typescript
const QUEST_ENTRY = 1234;
const FACTION_ID = 69;
const BONUS_REPUTATION = 500;

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number) => {
    const questTemplate = GetQuest(quest);

    if (!questTemplate) {
        return;
    }

    const questFlags = questTemplate.GetFlags();

    if (questFlags & QuestFlags.QUEST_FLAG_REPEATABLE) {
        player.ModifyReputation(FACTION_ID, BONUS_REPUTATION);
        player.SendBroadcastMessage("Thank you for your continued efforts! Here's a bonus to your reputation.");
    }

    // Additional rewards or actions for other quest flags can be handled here.
    if (questFlags & QuestFlags.QUEST_FLAG_EPIC) {
        // Award special items or titles for completing an Epic quest.
    }

    if (questFlags & QuestFlags.QUEST_FLAG_ESCORT) {
        // Grant a temporary buff or special currency for completing an Escort quest.
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example:
1. We define constants for the quest entry, faction ID, and the amount of bonus reputation to award.
2. In the `OnQuestComplete` event handler, we retrieve the quest template using the `GetQuest` function.
3. We then get the quest flags using the `GetFlags` method of the quest template.
4. We check if the `QUEST_FLAG_REPEATABLE` flag is set using a bitwise AND operation. If it is, we award bonus reputation to the player using `ModifyReputation` and send a broadcast message to the player.
5. We also demonstrate how to handle other quest flags, such as `QUEST_FLAG_EPIC` and `QUEST_FLAG_ESCORT`, by adding comments for awarding special items, titles, buffs, or currencies.

This example showcases how to use the `GetFlags` method to retrieve quest flags and make decisions based on them, such as awarding bonus rewards or triggering special actions for specific types of quests.

## GetId
Returns the entry ID of the quest. This ID is unique to each quest and can be used to identify and look up the quest in the database or perform other actions based on the specific quest.

### Parameters
This method does not take any parameters.

### Returns
questId: number - The unique identifier of the quest.

### Example Usage
Create a script that rewards players with bonus gold and experience when they complete specific quests.

```typescript
const QUEST_GNOMEREGAN = 2904;
const QUEST_DEADMINES = 36;
const BONUS_GOLD = 500;
const BONUS_XP = 1000;

const onQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    const questId = quest.GetId();

    switch (questId) {
        case QUEST_GNOMEREGAN:
            player.ModifyMoney(BONUS_GOLD);
            player.GiveXP(BONUS_XP);
            player.SendBroadcastMessage(`Congratulations on completing Gnomeregan! You have been awarded ${BONUS_GOLD} gold and ${BONUS_XP} experience.`);
            break;
        case QUEST_DEADMINES:
            player.ModifyMoney(BONUS_GOLD);
            player.GiveXP(BONUS_XP);
            player.SendBroadcastMessage(`Well done on clearing the Deadmines! You have been granted ${BONUS_GOLD} gold and ${BONUS_XP} experience.`);
            break;
        default:
            // No bonus for other quests
            break;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => onQuestComplete(...args));
```

In this example, we define constants for the specific quest IDs we want to reward (`QUEST_GNOMEREGAN` and `QUEST_DEADMINES`) and the bonus amounts for gold and experience.

Inside the `onQuestComplete` event handler, we retrieve the quest ID using `quest.GetId()`. We then use a switch statement to check if the completed quest matches any of the specified quest IDs.

If the quest ID matches `QUEST_GNOMEREGAN` or `QUEST_DEADMINES`, we reward the player with bonus gold using `player.ModifyMoney(BONUS_GOLD)` and bonus experience using `player.GiveXP(BONUS_XP)`. We also send a broadcast message to the player informing them of the bonus rewards they received.

If the completed quest does not match any of the specified IDs, no bonus rewards are given.

Finally, we register the `onQuestComplete` event handler to the `PLAYER_EVENT_ON_QUEST_COMPLETE` event using `RegisterPlayerEvent`.

This script demonstrates how you can use the `GetId()` method to identify specific quests and perform actions based on the quest ID, such as granting bonus rewards to players who complete certain quests.

## GetLevel
Returns the level of the quest. This is the level that is required to be able to accept the quest.

### Parameters
This method does not take any parameters.

### Returns
number - The level of the quest.

### Example Usage
This example checks if the player is high enough level to accept a quest, and if not, it will send a message to the player and not allow them to accept the quest.

```typescript
const QUEST_ENTRY = 1234;
const MIN_LEVEL = 10;

const OnQuestAccept: player_event_on_quest_accept = (event: number, player: Player, quest: Quest) => {
    if (quest.GetEntry() == QUEST_ENTRY) {
        const questLevel = quest.GetLevel();
        const playerLevel = player.GetLevel();

        if (playerLevel < questLevel) {
            player.SendBroadcastMessage(`You must be at least level ${MIN_LEVEL} to accept this quest.`);
            player.RemoveQuest(QUEST_ENTRY);
        } else {
            // Additional logic for when the player is high enough level to accept the quest.
            // This could include sending a message to the player, granting items, or setting flags.
            player.SendBroadcastMessage(`You have accepted the quest!`);
            
            // Example of granting an item to the player when they accept the quest.
            const ITEM_ENTRY = 5678;
            player.AddItem(ITEM_ENTRY, 1);

            // Example of setting a flag when the player accepts the quest.
            player.SetFlag(PlayerFlags.PLAYER_FLAGS_HIDE_HELM, 1);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_ACCEPT, (...args) => OnQuestAccept(...args));
```

In this example, when the player accepts a quest with the entry `QUEST_ENTRY`, it first checks the level of the quest using `quest.GetLevel()`. It then compares this level to the player's level using `player.GetLevel()`. 

If the player's level is below the quest level, it sends a message to the player using `player.SendBroadcastMessage()` and removes the quest from the player using `player.RemoveQuest()`.

If the player's level is high enough, it sends a different message to the player, grants them an item using `player.AddItem()`, and sets a flag on the player using `player.SetFlag()`.

This example demonstrates how you can use the `GetLevel()` method of the `Quest` class to create more complex quest acceptance logic based on the player's level and the quest's level requirement.

## GetMinLevel
Returns the minimum level required for a player to be able to accept and complete the quest. This is useful for determining if a player is eligible to accept a quest or not.

### Parameters
None

### Returns
number - The minimum level required to accept and complete the quest.

### Example Usage
In this example, we have a script that checks if a player is eligible to accept a quest based on their level. If the player's level is greater than or equal to the minimum level required for the quest, they will be able to accept it. Otherwise, they will receive a message indicating that they need to reach the required level.

```typescript
const QUEST_ENTRY = 1234; // Replace with the desired quest entry ID

const OnGossipHello: gossip_event_on_hello = (event: number, player: Player, object: GameObject | Item): void => {
    const quest = object.GetGossipQuest(0); // Assuming the quest is the first gossip option

    if (quest) {
        const minLevel = quest.GetMinLevel();

        if (player.GetLevel() >= minLevel) {
            player.AddQuest(quest.GetEntry());
            player.GossipComplete();
            player.SendAreaTriggerMessage("You have accepted the quest!");
        } else {
            player.SendAreaTriggerMessage(`You need to reach level ${minLevel} to accept this quest.`);
            player.GossipComplete();
        }
    }
};

RegisterGameObjectGossipEvent(GO_ENTRY, (event: number, player: Player, object: GameObject) => {
    OnGossipHello(event, player, object);
});
```

In this script:
1. We define the `QUEST_ENTRY` constant with the entry ID of the quest we want to check.
2. Inside the `OnGossipHello` function, we retrieve the quest object using `object.GetGossipQuest(0)`, assuming the quest is the first gossip option.
3. If the quest object is valid, we use `quest.GetMinLevel()` to get the minimum level required for the quest.
4. We compare the player's level (`player.GetLevel()`) with the minimum level required.
   - If the player's level is greater than or equal to the minimum level, we add the quest to the player's quest log using `player.AddQuest(quest.GetEntry())`, complete the gossip interaction with `player.GossipComplete()`, and send a message to the player indicating that they have accepted the quest.
   - If the player's level is below the minimum level, we send a message to the player informing them of the required level to accept the quest and complete the gossip interaction.
5. Finally, we register the `OnGossipHello` function to be triggered when the player interacts with the specified game object using `RegisterGameObjectGossipEvent(GO_ENTRY, ...)`.

This script ensures that players can only accept the quest if they meet the minimum level requirement, providing a more immersive and controlled quest experience.

## GetNextQuestId
Returns the next quest entry ID in a quest chain, if available.

### Parameters
This method does not take any parameters.

### Returns
questId: number - The next quest entry ID in the chain, or 0 if there is no next quest.

### Example Usage
This example demonstrates how to retrieve the next quest ID in a chain and offer it to the player upon completing the current quest.

```typescript
const QUEST_ENTRY = 1234; // Replace with the actual quest entry ID

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest) => {
    if (quest.GetEntry() === QUEST_ENTRY) {
        const nextQuestId = quest.GetNextQuestId();
        
        if (nextQuestId !== 0) {
            const nextQuest = player.GetQuestById(nextQuestId);
            
            if (nextQuest && player.CanTakeQuest(nextQuest, false)) {
                player.PrepareQuestMenu(player.GetGUID());
                player.SendPreparedQuest(player.GetGUID());
                
                player.PlayDirectSound(10875); // Play a sound to indicate a new quest is available
                player.SendBroadcastMessage("A new quest is available! Check your quest log.");
            } else {
                player.SendBroadcastMessage("You have completed the quest chain. Congratulations!");
            }
        } else {
            player.SendBroadcastMessage("You have completed the quest chain. Congratulations!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example:
1. We define the entry ID of the quest we want to check for the next quest in the chain.
2. When the player completes a quest, we check if it matches the desired quest entry ID.
3. If it does, we retrieve the next quest ID using the `GetNextQuestId()` method.
4. If a next quest exists (i.e., `nextQuestId` is not 0), we retrieve the next quest object using `player.GetQuestById(nextQuestId)`.
5. We check if the player can take the next quest using `player.CanTakeQuest(nextQuest, false)`.
6. If the player can take the next quest, we prepare the quest menu and send it to the player, along with a sound effect and a broadcast message indicating that a new quest is available.
7. If the player cannot take the next quest or there is no next quest, we send a broadcast message congratulating the player on completing the quest chain.

This example showcases how to use the `GetNextQuestId()` method to create a seamless quest progression experience for players, guiding them through a quest chain and providing appropriate feedback and rewards.

## GetNextQuestInChain
Returns the next quest entry ID in the specific quest chain. This method is useful for determining the next quest in a series of related quests.

### Parameters
This method does not take any parameters.

### Returns
* number - The entry ID of the next quest in the chain, or 0 if there is no next quest.

### Example Usage
Suppose you have a series of quests that players need to complete in a specific order. You can use the `GetNextQuestInChain` method to guide players to the next quest in the series after they complete each one.

```typescript
const QUEST_CHAIN_ENTRY_IDS = [1000, 1001, 1002, 1003];

const onQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    const completedQuestEntry = quest.GetEntry();
    const nextQuestEntry = quest.GetNextQuestInChain();

    if (QUEST_CHAIN_ENTRY_IDS.includes(completedQuestEntry)) {
        if (nextQuestEntry !== 0) {
            const nextQuest = new Quest(nextQuestEntry);
            if (player.CanTakeQuest(nextQuest)) {
                player.AddQuest(nextQuestEntry);
                player.SendBroadcastMessage(`You have unlocked the next quest in the chain: ${nextQuest.GetTitle()}`);
            } else {
                player.SendBroadcastMessage("You have completed the quest chain!");
            }
        } else {
            player.SendBroadcastMessage("You have completed the quest chain!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => onQuestComplete(...args));
```

In this example:
1. We define an array `QUEST_CHAIN_ENTRY_IDS` that contains the entry IDs of the quests in the chain.
2. When a player completes a quest, the `onQuestComplete` event handler is triggered.
3. We get the entry ID of the completed quest using `quest.GetEntry()` and the entry ID of the next quest using `quest.GetNextQuestInChain()`.
4. If the completed quest is part of the defined quest chain (checked using `QUEST_CHAIN_ENTRY_IDS.includes(completedQuestEntry)`):
   - If there is a next quest in the chain (`nextQuestEntry !== 0`):
     - We create a new `Quest` object using the `nextQuestEntry`.
     - We check if the player is eligible to take the next quest using `player.CanTakeQuest(nextQuest)`.
     - If the player is eligible, we add the next quest to their quest log using `player.AddQuest(nextQuestEntry)` and send them a message informing them about the next quest.
     - If the player is not eligible, we send them a message indicating that they have completed the quest chain.
   - If there is no next quest in the chain (`nextQuestEntry === 0`), we send the player a message indicating that they have completed the quest chain.

This example demonstrates how to use the `GetNextQuestInChain` method to guide players through a series of related quests, ensuring that they are directed to the next quest in the chain after completing each one.

## GetPrevQuestId
Returns the entry ID of the previous quest in a quest chain. If the quest is not part of a chain or is the first quest in the chain, it will return 0.

### Parameters
This method does not take any parameters.

### Returns
questId: number - The entry ID of the previous quest in the chain, or 0 if there is no previous quest.

### Example Usage
This example demonstrates how to use the `GetPrevQuestId` method to create a script that rewards players with bonus items for completing a quest chain in order.

```typescript
const QUEST_CHAIN = [1200, 1201, 1202, 1203, 1204];
const BONUS_ITEM = 12345;
const BONUS_AMOUNT = 5;

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    const completedQuestId = quest.GetEntry();
    const previousQuestId = quest.GetPrevQuestId();

    // Check if the completed quest is part of the desired chain
    if (QUEST_CHAIN.includes(completedQuestId)) {
        const currentIndex = QUEST_CHAIN.indexOf(completedQuestId);

        // If the quest is the first in the chain or if the previous quest was completed
        if (currentIndex === 0 || player.HasQuest(previousQuestId)) {
            // Reward bonus items for completing quests in order
            player.AddItem(BONUS_ITEM, BONUS_AMOUNT);
            player.SendBroadcastMessage(`You have been rewarded with ${BONUS_AMOUNT} bonus items for completing the quest chain in order!`);
        } else {
            player.SendBroadcastMessage(`Complete the previous quest in the chain to receive bonus items!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example:

1. We define an array `QUEST_CHAIN` containing the entry IDs of the quests in the desired order.
2. We specify the entry ID of the bonus item (`BONUS_ITEM`) and the amount to be rewarded (`BONUS_AMOUNT`).
3. In the `OnQuestComplete` event handler, we get the entry ID of the completed quest using `quest.GetEntry()` and store it in `completedQuestId`.
4. We call `quest.GetPrevQuestId()` to get the entry ID of the previous quest in the chain and store it in `previousQuestId`.
5. We check if the completed quest is part of the desired chain by using `QUEST_CHAIN.includes(completedQuestId)`.
6. If the completed quest is the first in the chain (`currentIndex === 0`) or if the player has completed the previous quest (`player.HasQuest(previousQuestId)`), we reward the player with bonus items using `player.AddItem(BONUS_ITEM, BONUS_AMOUNT)` and send a broadcast message informing them of the reward.
7. If the completed quest is not the first in the chain and the player has not completed the previous quest, we send a broadcast message indicating that they need to complete the previous quest to receive bonus items.

By using the `GetPrevQuestId` method, we can determine if the player is completing the quests in the desired order and reward them accordingly, encouraging them to follow the intended quest progression.

## GetType
Returns the type of the quest. Quest types determine how the quest is displayed and handled in the game.

### Returns
questType: number - The type of the quest.

### Quest Types
| Type | Description |
|------|-------------|
| 0    | Normal quest |
| 1    | Group quest |
| 21   | Life quest |
| 41   | PvP quest |
| 62   | Raid quest |
| 81   | Dungeon quest |
| 82   | World quest |
| 83   | Legendary quest |
| 84   | Escort quest |
| 85   | Heroic quest |
| 88   | Raid (10) quest |
| 89   | Raid (25) quest |

### Example Usage:
Adjust quest rewards based on the quest type.
```typescript
const GOLD_REWARD_MULTIPLIER: { [key: number]: number } = {
    [0]: 1,    // Normal quest
    [1]: 1.5,  // Group quest
    [62]: 2,   // Raid quest
    [81]: 1.8, // Dungeon quest
    [83]: 3,   // Legendary quest
    [85]: 2.2, // Heroic quest
    [88]: 2.5, // Raid (10) quest
    [89]: 3.2, // Raid (25) quest
};

const QuestCompleteHandler: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    const questType = quest.GetType();
    const baseGoldReward = quest.GetRewMoney();

    if (questType in GOLD_REWARD_MULTIPLIER) {
        const bonusGoldReward = Math.floor(baseGoldReward * (GOLD_REWARD_MULTIPLIER[questType] - 1));
        player.ModifyMoney(bonusGoldReward);
        player.SendBroadcastMessage(`You received an additional ${bonusGoldReward} gold for completing a ${questType} quest!`);
    }

    if (questType === 83) { // Legendary quest
        const LEGENDARY_ITEM_ENTRY = 123456;
        player.AddItem(LEGENDARY_ITEM_ENTRY, 1);
        player.SendBroadcastMessage(`You received a legendary item for completing a legendary quest!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => QuestCompleteHandler(...args));
```
In this example, the script adjusts the gold reward for completing a quest based on its type. Quests with higher difficulty or group requirements, such as raid quests or heroic quests, receive a larger gold bonus. Additionally, if the completed quest is a legendary quest, the player is awarded a special legendary item.

## HasFlag
Returns 'true' if the [Quest] has the specified flag, false otherwise.

### Parameters
flag: [QuestFlags](../QuestFlags.md) - The flag to check for on the quest.

### Returns
boolean

### Example Usage
Check if a quest is a daily quest and notify the player with a message.
```typescript
const questId = 13146;
const quest = GetQuest(questId);

if (quest && quest.HasFlag(QuestFlags.QUEST_FLAGS_DAILY)) {
    SendWorldMessage(`Quest ${questId} is a daily quest!`);
}
```

Another example could be to check if a quest is a weekly quest and award bonus reputation upon completion:

```typescript
const STORMWIND_FACTION = 72;
const WEEKLY_QUEST_BONUS_REPUTATION = 500;

const questRewardReputation: player_event_on_quest_complete = (event: number, player: Player, quest: Quest) => {
    if (quest.HasFlag(QuestFlags.QUEST_FLAGS_WEEKLY)) {
        player.ModifyFactionReputation(STORMWIND_FACTION, WEEKLY_QUEST_BONUS_REPUTATION);
        player.SendBroadcastMessage(`You have earned a ${WEEKLY_QUEST_BONUS_REPUTATION} bonus reputation with Stormwind for completing a weekly quest!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => questRewardReputation(...args));
```

In this example, we register a player event for when a quest is completed. We then check if the completed quest has the `QUEST_FLAGS_WEEKLY` flag using the `HasFlag` method. If it does, we award bonus reputation to the player using `ModifyFactionReputation` and send them a message letting them know they received bonus reputation for completing a weekly quest.

## IsDaily
Returns whether the quest is a daily quest or not.

### Parameters
None

### Returns
boolean - Returns 'true' if the quest is a daily quest, 'false' otherwise.

### Example Usage
This example shows how to check if a quest is a daily quest and modify the rewards accordingly.

```typescript
const GOLD_REWARD_MULTIPLIER = 2;
const XP_REWARD_MULTIPLIER = 1.5;

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    if (quest.IsDaily()) {
        // Double the gold reward for daily quests
        const goldReward = quest.GetRewMoney();
        quest.SetRewMoney(goldReward * GOLD_REWARD_MULTIPLIER);
        
        // Increase the XP reward by 50% for daily quests
        const xpReward = quest.GetRewXP();
        quest.SetRewXP(xpReward * XP_REWARD_MULTIPLIER);
        
        player.SendBroadcastMessage(`You have completed the daily quest '${quest.GetTitle()}' and received enhanced rewards!`);
    } else {
        player.SendBroadcastMessage(`You have completed the quest '${quest.GetTitle()}'.`);
    }
    
    // Reward the player with the modified quest rewards
    player.RewardQuest(quest.GetID(), 0, player);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example:
1. We define constants for the gold and XP reward multipliers.
2. In the `OnQuestComplete` event handler, we check if the completed quest is a daily quest using `quest.IsDaily()`.
3. If it is a daily quest:
   - We retrieve the original gold reward using `quest.GetRewMoney()` and double it.
   - We set the modified gold reward using `quest.SetRewMoney()`.
   - We retrieve the original XP reward using `quest.GetRewXP()` and increase it by 50%.
   - We set the modified XP reward using `quest.SetRewXP()`.
   - We send a broadcast message to the player indicating they completed a daily quest and received enhanced rewards.
4. If it is not a daily quest, we send a regular completion message to the player.
5. Finally, we reward the player with the modified quest rewards using `player.RewardQuest()`.

This script enhances the rewards for daily quests, providing players with additional incentives to complete them regularly.

## IsRepeatable
Returns a boolean value indicating whether the quest is repeatable or not. Repeatable quests can be completed multiple times by the same player.

### Parameters
This method does not take any parameters.

### Returns
* boolean - Returns `true` if the quest is repeatable, `false` otherwise.

### Example Usage
This example demonstrates how to check if a quest is repeatable and grant additional rewards to the player for completing repeatable quests multiple times.

```typescript
const REPEATABLE_QUEST_ENTRY = 12345;
const REPEATABLE_QUEST_REWARD_ITEM = 54321;
const REPEATABLE_QUEST_REWARD_COUNT = 5;
const REPEATABLE_QUEST_MAX_COMPLETIONS = 3;

const onQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    if (quest.GetEntry() === REPEATABLE_QUEST_ENTRY && quest.IsRepeatable()) {
        const completedCount = player.GetQuestRewardStatus(REPEATABLE_QUEST_ENTRY);

        if (completedCount < REPEATABLE_QUEST_MAX_COMPLETIONS) {
            player.AddItem(REPEATABLE_QUEST_REWARD_ITEM, REPEATABLE_QUEST_REWARD_COUNT);
            player.SendBroadcastMessage(`You have completed the repeatable quest ${completedCount + 1} times. Keep up the great work!`);

            if (completedCount + 1 === REPEATABLE_QUEST_MAX_COMPLETIONS) {
                player.SendBroadcastMessage(`Congratulations! You have reached the maximum number of completions for this repeatable quest.`);
            }
        } else {
            player.SendBroadcastMessage(`You have already reached the maximum number of completions for this repeatable quest.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => onQuestComplete(...args));
```

In this example:
1. We define constants for the repeatable quest entry, reward item, reward count, and maximum number of completions allowed.
2. In the `onQuestComplete` event handler, we check if the completed quest matches the repeatable quest entry and if it is indeed repeatable using the `IsRepeatable()` method.
3. If the quest is repeatable, we retrieve the number of times the player has already completed the quest using `GetQuestRewardStatus()`.
4. If the player has not reached the maximum number of completions, we grant them additional rewards using `AddItem()` and send a broadcast message informing them of their progress.
5. If the player reaches the maximum number of completions, we send a congratulatory message.
6. If the player has already reached the maximum number of completions, we send a message indicating that they cannot complete the quest again.

This example showcases how to leverage the `IsRepeatable()` method to create a system for handling repeatable quests and providing additional incentives for players to complete them multiple times, up to a specified limit.

