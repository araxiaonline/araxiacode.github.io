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

