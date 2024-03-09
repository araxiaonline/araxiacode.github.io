## AddComboPoints
If the player is a rogue or druid, this method will add combo points to the player based on the target and the count of combo points to add.

### Parameters
* target: [Unit](./unit.md) - Unit to apply combo points to
* count: number - The number of combo points to apply 

### Example Usage:  
This script will add combo points to the player when they critically strike an enemy. The number of combo points added will depend on the player's level and the type of enemy they are fighting.

```typescript
const PLAYER_LEVEL_THRESHOLD = 30;
const ELITE_COMBO_POINTS = 2;
const NORMAL_COMBO_POINTS = 1;

const onPlayerCriticalStrike: player_event_on_crit = (event: number, player: Player, victim: Unit, spellInfo: SpellInfo, amount: number): void => {
    let comboPointsToAdd = NORMAL_COMBO_POINTS;

    if (player.GetLevel() >= PLAYER_LEVEL_THRESHOLD && victim.IsWorldBoss()) {
        comboPointsToAdd = ELITE_COMBO_POINTS;
    } else if (victim.IsElite()) {
        comboPointsToAdd = ELITE_COMBO_POINTS;
    }

    const currentComboPoints = player.GetComboPoints();
    const maxComboPoints = player.GetMaxComboPoints();

    if (currentComboPoints < maxComboPoints) {
        const newComboPoints = Math.min(currentComboPoints + comboPointsToAdd, maxComboPoints);
        player.AddComboPoints(victim, newComboPoints - currentComboPoints);
        player.SendAreaTriggerMessage(`You gained ${newComboPoints - currentComboPoints} combo point(s) on ${victim.GetName()}!`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CRIT, (...args) => onPlayerCriticalStrike(...args));
```

In this example:
1. We define constants for the player level threshold and the number of combo points to add based on the type of enemy (elite or normal).
2. When the player critically strikes an enemy, we determine the number of combo points to add based on the player's level and the type of enemy.
3. We get the current and maximum combo points for the player.
4. If the player has not reached the maximum combo points, we calculate the new combo points by adding the determined number of combo points to the current combo points, capped at the maximum.
5. We add the new combo points to the player using the `AddComboPoints` method.
6. Finally, we send a message to the player informing them of the number of combo points gained and on which enemy.

This script enhances the gameplay for rogues and druids by rewarding them with additional combo points when they critically strike enemies, with higher-level players and tougher enemies yielding more combo points.

## AddItem
Give the player an item based on the item entry. These items can be referenced in the World Database `item_template` table. For more information about items, you can find more details here: [https://www.azerothcore.org/wiki/item_template](https://www.azerothcore.org/wiki/item_template). Items will be added to the current bag inventory if there is space.

### Parameters
- `entry`: number - Item Entry ID from the `item_template` table
- `itemCount`: number (optional) - Number of items to grant (items that exceed unique counts or limits will fail)

### Returns
- `item`: [Item](./item.md) - The item(s) that was given to the player.

### Example Usage
Grant bonus Badges of Justice and a random epic item based on the player's class:

```typescript
const BADGE_OF_JUSTICE_ENTRY = 29434;
const BADGE_OF_JUSTICE_BONUS = 2;

const WARRIOR_EPIC_ITEM_ENTRIES = [12345, 23456, 34567];
const MAGE_EPIC_ITEM_ENTRIES = [45678, 56789, 67890];
const ROGUE_EPIC_ITEM_ENTRIES = [78901, 89012, 90123];

const LootToken: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() == BADGE_OF_JUSTICE_ENTRY) {
        player.AddItem(BADGE_OF_JUSTICE_ENTRY, BADGE_OF_JUSTICE_BONUS);

        let epicItemEntry: number;
        switch (player.GetClass()) {
            case Classes.CLASS_WARRIOR:
                epicItemEntry = WARRIOR_EPIC_ITEM_ENTRIES[Math.floor(Math.random() * WARRIOR_EPIC_ITEM_ENTRIES.length)];
                break;
            case Classes.CLASS_MAGE:
                epicItemEntry = MAGE_EPIC_ITEM_ENTRIES[Math.floor(Math.random() * MAGE_EPIC_ITEM_ENTRIES.length)];
                break;
            case Classes.CLASS_ROGUE:
                epicItemEntry = ROGUE_EPIC_ITEM_ENTRIES[Math.floor(Math.random() * ROGUE_EPIC_ITEM_ENTRIES.length)];
                break;
            default:
                return;
        }

        const epicItem = player.AddItem(epicItemEntry, 1);
        if (epicItem) {
            player.SendBroadcastMessage(`You have been granted a bonus epic item: ${epicItem.GetName()}!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => LootToken(...args));
```

In this example, when a player loots a Badge of Justice, they will receive 2 bonus Badges of Justice and a random epic item based on their class. The script checks the player's class and selects a random item entry from the corresponding array of epic item entries. If the item is successfully added to the player's inventory, a broadcast message is sent to the player informing them of the bonus epic item they received.

## AddLifetimeKills
Adds a lifetime kill to the player's statistics. This can be useful for custom scripting involving achievements, rewards, or other systems that track a player's total kills throughout their character's lifetime.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
In this example, we will create a custom event that rewards players with bonus gold and experience for every 100 lifetime kills they achieve.

```typescript
const BONUS_GOLD = 100;
const BONUS_EXP = 1000;
const KILLS_PER_BONUS = 100;

const RewardLifetimeKills: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    player.AddLifetimeKills();
    
    const lifetimeKills = player.GetUInt32Value(PlayerFields.PLAYER_FIELD_LIFETIME_HONORABLE_KILLS);
    
    if (lifetimeKills % KILLS_PER_BONUS === 0) {
        player.ModifyMoney(BONUS_GOLD);
        player.GiveXP(BONUS_EXP, Victim, ReferAFriend);
        
        player.SendNotification(`Congratulations! You have been rewarded for reaching ${lifetimeKills} lifetime kills.`);
        player.SendNotification(`You have received ${BONUS_GOLD} gold and ${BONUS_EXP} experience.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => RewardLifetimeKills(...args));
```

In this script:
1. We define constants for the bonus gold, bonus experience, and the number of kills required per bonus.
2. We create a custom event handler for the `PLAYER_EVENT_ON_KILL_CREATURE` event.
3. Inside the event handler, we call `AddLifetimeKills()` to increment the player's lifetime kill count.
4. We retrieve the updated lifetime kill count using `GetUInt32Value(PlayerFields.PLAYER_FIELD_LIFETIME_HONORABLE_KILLS)`.
5. We check if the lifetime kills is divisible by `KILLS_PER_BONUS` using the modulo operator (`%`).
6. If the condition is true, we reward the player with bonus gold using `ModifyMoney()` and bonus experience using `GiveXP()`.
7. We send notifications to the player informing them about the reward and their current lifetime kill count.

This script showcases how `AddLifetimeKills()` can be used in conjunction with other methods and events to create custom reward systems based on a player's lifetime kills.

## AddQuest
This method attempts to add a quest to the player's quest log based on the provided quest entry ID. The quest entry ID can be found in the `quest_template` table of the world database. If the quest is successfully added, it will appear in the player's quest log, and they can start working on completing the quest objectives.

### Parameters
* entry: number - The quest entry ID from the `quest_template` table.

### Example Usage
Here's an example of how to use the `AddQuest` method to add a quest to a player's quest log when they enter a specific area:

```typescript
const QUEST_ENTRY_ID = 1234; // Replace with the desired quest entry ID
const AREA_TRIGGER_ID = 5678; // Replace with the desired area trigger ID

const OnAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaId: number): void => {
    if (areaId === AREA_TRIGGER_ID) {
        if (!player.HasQuest(QUEST_ENTRY_ID)) {
            player.AddQuest(QUEST_ENTRY_ID);
            player.SendBroadcastMessage("You have discovered a new quest!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => OnAreaTrigger(...args));
```

In this example:
1. We define the constants `QUEST_ENTRY_ID` and `AREA_TRIGGER_ID` with the desired quest entry ID and area trigger ID, respectively.
2. We register the `OnAreaTrigger` event handler using `RegisterPlayerEvent` with the `PLAYER_EVENT_ON_AREA_TRIGGER` event.
3. Inside the event handler, we check if the triggered area ID matches the desired `AREA_TRIGGER_ID`.
4. If the area ID matches, we check if the player already has the quest using the `HasQuest` method.
5. If the player doesn't have the quest, we add the quest to their quest log using `AddQuest(QUEST_ENTRY_ID)`.
6. Finally, we send a broadcast message to the player informing them that they have discovered a new quest.

This script will automatically add the specified quest to the player's quest log when they enter the designated area, providing a seamless way to introduce new quests to players based on their exploration.

Note: Make sure to replace `QUEST_ENTRY_ID` and `AREA_TRIGGER_ID` with the appropriate quest entry ID and area trigger ID from your database.

## AdvanceAllSkills
This method allows you to advance all of the player's skills by a specified amount. This can be useful for quickly leveling up a player's skills for testing or other purposes.

### Parameters
* skillStep: number - The amount to advance each skill by.

### Example Usage
In this example, we'll create a command that allows a player to advance all of their skills by a specified amount.

```typescript
// Define the command
const AdvanceSkillsCommand = {
    name: 'advanceskills',
    execute: (player: Player, args: string[]) => {
        if (args.length < 1) {
            player.SendBroadcastMessage('Usage: .advanceskills <skillStep>');
            return;
        }

        const skillStep = parseInt(args[0]);
        if (isNaN(skillStep) || skillStep <= 0) {
            player.SendBroadcastMessage('Invalid skillStep. Please provide a positive number.');
            return;
        }

        player.AdvanceAllSkills(skillStep);
        player.SendBroadcastMessage(`All skills advanced by ${skillStep} points.`);
    }
};

// Register the command
const commandName = AdvanceSkillsCommand.name;
const commandHandler = (player: Player, command: string, args: string[]) => {
    if (command === commandName) {
        AdvanceSkillsCommand.execute(player, args);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, commandHandler);
```

In this script:
1. We define a command object `AdvanceSkillsCommand` with a `name` property and an `execute` method.
2. Inside the `execute` method, we first check if the player provided the required `skillStep` argument. If not, we send a usage message to the player.
3. We parse the `skillStep` argument as an integer and validate it. If it's not a valid positive number, we send an error message to the player.
4. If the `skillStep` is valid, we call the `AdvanceAllSkills` method on the player object, passing the `skillStep` value.
5. We send a confirmation message to the player, indicating that all skills have been advanced by the specified amount.
6. We define a `commandHandler` function that checks if the entered command matches the `AdvanceSkillsCommand.name`. If it does, it calls the `execute` method of the command object.
7. Finally, we register the `commandHandler` function to the `PLAYER_EVENT_ON_CHAT` event using `RegisterPlayerEvent`.

With this script, a player can use the `.advanceskills <skillStep>` command to advance all of their skills by the specified `skillStep` amount. For example, `.advanceskills 10` will advance all skills by 10 points.

This example demonstrates how to create a custom command that utilizes the `AdvanceAllSkills` method to provide a convenient way for players to level up their skills quickly.

## AdvanceSkill
Advances a specific skill of the player by the specified amount.

### Parameters
* skillId: number - The ID of the skill to advance. Skill IDs can be found in the SkillLineAbility.dbc file.
* skillStep: number - The amount to increase the skill by.

### Example Usage
Increase a player's Blacksmithing skill by 50 when they successfully craft an item.
```typescript
const BLACKSMITHING_SKILL_ID = 164;
const SKILL_STEP = 50;

const OnCraftItem: player_event_on_craft_item = (event: number, player: Player, item: Item, count: number) => {
    // Check if the crafted item is a blacksmithing item (example item IDs)
    const blacksmithingItems = [12773, 12774, 12775];

    if (blacksmithingItems.includes(item.GetEntry())) {
        // Get the player's current Blacksmithing skill level
        const currentSkillLevel = player.GetSkillValue(BLACKSMITHING_SKILL_ID);

        // Calculate the new skill level after advancing
        const newSkillLevel = currentSkillLevel + SKILL_STEP;

        // Advance the player's Blacksmithing skill
        player.AdvanceSkill(BLACKSMITHING_SKILL_ID, SKILL_STEP);

        // Send a message to the player
        player.SendBroadcastMessage(`Your Blacksmithing skill has increased by ${SKILL_STEP} points. Current skill level: ${newSkillLevel}`);

        // Check if the player has reached a certain skill level and reward them
        if (newSkillLevel >= 300) {
            const rewardItem = player.AddItem(29434, 1); // Reward item (example: Badge of Justice)
            if (rewardItem) {
                player.SendBroadcastMessage("Congratulations! You have reached Blacksmithing skill level 300 and received a reward.");
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CRAFT_ITEM, (...args) => OnCraftItem(...args));
```
In this example:
1. When a player successfully crafts an item, the `OnCraftItem` event is triggered.
2. The script checks if the crafted item is a blacksmithing item by comparing its entry ID with a predefined list of blacksmithing item IDs.
3. If the crafted item is a blacksmithing item, the player's current Blacksmithing skill level is retrieved using `GetSkillValue()`.
4. The player's Blacksmithing skill is advanced by the specified `SKILL_STEP` amount using `AdvanceSkill()`.
5. A message is sent to the player informing them about the skill increase and their current skill level.
6. The script checks if the player has reached a certain skill level (in this case, 300) and rewards them with an item (Badge of Justice) using `AddItem()`.
7. If the reward item is successfully added to the player's inventory, a congratulatory message is sent to the player.

This example demonstrates how the `AdvanceSkill()` method can be used in conjunction with other methods and events to create a more complex and interactive script for skill advancement and player rewards.

## AdvanceSkillsToMax
This method will advance all of the player's weapon skills to the maximum amount available based on the player's level and class.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
This script will advance all weapon skills of a player to the maximum available when they log in.

```typescript
const onLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's class
    const playerClass = player.GetClass();

    // Define the maximum weapon skill levels based on the player's class
    let maxSkillLevel = 0;
    switch (playerClass) {
        case Classes.CLASS_WARRIOR:
        case Classes.CLASS_PALADIN:
            maxSkillLevel = 440;
            break;
        case Classes.CLASS_HUNTER:
        case Classes.CLASS_ROGUE:
            maxSkillLevel = 420;
            break;
        case Classes.CLASS_SHAMAN:
        case Classes.CLASS_DRUID:
            maxSkillLevel = 410;
            break;
        default:
            maxSkillLevel = 400;
    }

    // Advance all weapon skills to the maximum level
    player.AdvanceSkillsToMax();

    // Send a message to the player
    player.SendBroadcastMessage(`Your weapon skills have been advanced to the maximum level of ${maxSkillLevel}!`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, onLogin);
```

In this example:
1. When a player logs in, the `onLogin` function is triggered.
2. We get the player's class using `player.GetClass()`.
3. Based on the player's class, we define the maximum weapon skill level they can achieve.
4. We call `player.AdvanceSkillsToMax()` to advance all of the player's weapon skills to the maximum level.
5. Finally, we send a message to the player using `player.SendBroadcastMessage()` to inform them that their weapon skills have been advanced to the maximum level.

This script ensures that players always have their weapon skills at the maximum level available based on their class, providing them with an advantage in combat and allowing them to use weapons effectively without the need for manual skill training.

## AreaExploredOrEventHappens
This method is used to complete a quest when a player either explores a specific area or triggers an event related to the quest. It's commonly used in scripting to handle quest completion based on exploration or event triggers.

### Parameters
* quest: number - The ID of the quest to be completed.

### Example Usage
In this example, we have a script that listens for the `PLAYER_EVENT_ON_EXPLORE_AREA` event. When a player explores a specific area, we check if the player has an active quest with the ID `1234`. If the player has the quest, we call the `AreaExploredOrEventHappens` method to complete the quest.

```typescript
const QUEST_ENTRY = 1234;
const AREA_TRIGGER_ID = 5678;

const onExploreArea: player_event_on_explore_area = (event: number, player: Player, areaId: number): void => {
    if (areaId === AREA_TRIGGER_ID) {
        if (player.HasQuest(QUEST_ENTRY)) {
            player.AreaExploredOrEventHappens(QUEST_ENTRY);
            player.SendBroadcastMessage("Congratulations! You have completed the quest by exploring the area.");
            
            // Additional rewards or actions can be added here
            const rewardItem = player.AddItem(REWARD_ITEM_ENTRY, 1);
            if (rewardItem) {
                player.SendBroadcastMessage(`You have received ${rewardItem.GetName()} as a reward!`);
            }
            
            // Grant additional experience points
            const rewardExp = 1000;
            player.GiveXP(rewardExp, null);
            player.SendBroadcastMessage(`You have gained ${rewardExp} experience points!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EXPLORE_AREA, (...args) => onExploreArea(...args));
```

In this script, we define the `QUEST_ENTRY` constant with the ID of the quest we want to complete and the `AREA_TRIGGER_ID` constant with the ID of the area trigger that corresponds to the quest exploration.

Inside the `onExploreArea` event handler, we check if the explored area ID matches the `AREA_TRIGGER_ID`. If it does, we further check if the player has the quest with the ID `QUEST_ENTRY` using the `HasQuest` method.

If the player has the quest, we call the `AreaExploredOrEventHappens` method, passing the `QUEST_ENTRY` as the argument to complete the quest. We also send a broadcast message to the player indicating that they have completed the quest by exploring the area.

Additionally, we can add more rewards or actions after completing the quest. In this example, we add a reward item to the player's inventory using the `AddItem` method and send a broadcast message with the name of the rewarded item. We also grant additional experience points to the player using the `GiveXP` method and send a broadcast message with the amount of experience points gained.

This script demonstrates how the `AreaExploredOrEventHappens` method can be used in combination with other methods and events to create a more engaging quest completion experience for the player.

## CanBlock
Returns a boolean value indicating whether the player can block incoming attacks or not. This is determined by the player's class, equipped items, and stance.

### Parameters
None

### Returns
boolean - Returns `true` if the player can block incoming attacks, `false` otherwise.

### Example Usage
In this example, we'll create a script that checks if the player can block incoming attacks and adjusts their damage taken accordingly.

```typescript
const onPlayerDamaged: player_event_on_damage = (event: number, player: Player, attacker: Unit, damage: number): void => {
    const originalDamage = damage;
    const canBlock = player.CanBlock();

    if (canBlock) {
        const blockChance = 30; // Example block chance, adjust as needed
        const blockValue = 0.5; // Example block value, adjust as needed

        if (Math.random() * 100 < blockChance) {
            damage *= (1 - blockValue);
            player.SendAreaTriggerMessage("You blocked the attack!");
        }
    }

    const damageTaken = originalDamage - damage;
    player.SendAreaTriggerMessage(`You took ${damageTaken.toFixed(2)} damage from the attack.`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DAMAGE, (...args) => onPlayerDamaged(...args));
```

In this script:
1. We define a function `onPlayerDamaged` that handles the `PLAYER_EVENT_ON_DAMAGE` event.
2. We store the original damage value in the `originalDamage` variable.
3. We call the `CanBlock()` method to determine if the player can block incoming attacks and store the result in the `canBlock` variable.
4. If the player can block (`canBlock` is `true`), we:
   - Define a `blockChance` variable to represent the chance of a successful block (adjust as needed).
   - Define a `blockValue` variable to represent the percentage of damage reduction when a block occurs (adjust as needed).
   - Generate a random number between 0 and 100 using `Math.random() * 100`.
   - If the random number is less than the `blockChance`, the block is successful:
     - Reduce the `damage` by multiplying it with `(1 - blockValue)`.
     - Send a message to the player indicating that they blocked the attack.
5. Calculate the actual damage taken by subtracting the reduced `damage` from the `originalDamage` and store it in the `damageTaken` variable.
6. Send a message to the player displaying the amount of damage they took from the attack.

This script demonstrates how the `CanBlock()` method can be used in combination with other game mechanics to create a more dynamic combat experience for the player. The script checks if the player can block, and if so, it applies a chance-based block mechanic to reduce the incoming damage. The player is then informed about the damage they took and whether they successfully blocked the attack.

## CanCompleteQuest
This method checks if the player satisfies all the requirements to complete a quest based on the quest entry ID. It will return true if the player can complete the quest, and false if the player cannot complete the quest.

### Parameters
* entry: number - The entry ID of the quest to check completion status for.

### Returns
* boolean - Returns 'true' if the player satisfies all requirements to complete the quest, 'false' otherwise.

### Example Usage
This example script listens for the `PLAYER_EVENT_ON_QUEST_ABANDON` event and checks if the player can complete the quest they are abandoning. If they can complete it, the script will send a message to the player informing them that they can complete the quest and should reconsider abandoning it.

```typescript
const QUEST_ENTRY = 1234; // Replace with the desired quest entry ID

const onQuestAbandon: player_event_on_quest_abandon = (event: number, player: Player, quest: number) => {
    if (quest === QUEST_ENTRY) {
        if (player.CanCompleteQuest(QUEST_ENTRY)) {
            player.SendBroadcastMessage(`You are about to abandon the quest "${GetQuestName(QUEST_ENTRY)}" which you can complete. Are you sure you want to abandon it?`);
            player.SendBroadcastMessage(`If you need help completing the quest, you can ask a Game Master for assistance or check the quest details in your quest log.`);
            
            // Optionally, you can add a delay before the player can abandon the quest
            // to give them time to reconsider their decision.
            player.DelayQuestAbandon(QUEST_ENTRY, 30); // Delay abandon by 30 seconds
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_ABANDON, (...args) => onQuestAbandon(...args));
```

In this example, when a player attempts to abandon a specific quest (identified by `QUEST_ENTRY`), the script checks if the player can complete the quest using the `CanCompleteQuest` method. If the player can complete the quest, the script sends them a message informing them that they can complete the quest and suggests that they reconsider abandoning it.

Additionally, the script offers a suggestion to the player to seek assistance from a Game Master or check the quest details in their quest log if they need help completing the quest.

As an optional step, the script uses the `DelayQuestAbandon` method to delay the quest abandonment by 30 seconds, giving the player time to reconsider their decision before the quest is actually abandoned.

## CanEquipItem
Determines if the player can equip a given item or item entry into a specific slot.

### Parameters
* item: [Item](./item.md) - (Optional) The item to check if it can be equipped
* entry: number - The item entry to check if it can be equipped
* slot: number - The slot to check if the item can be equipped to

### Returns
* boolean - Returns true if the item can be equipped, false otherwise

### Example Usage
This example checks if the player can equip a specific item, and if so, equips it to the player's main hand slot.

```typescript
const ITEM_ENTRY_ATIESH = 22589;
const ATIESH_MAIN_HAND_SLOT = 15;

function CanEquipAtiesh(player: Player): void {
    const item = player.GetItemByEntry(ITEM_ENTRY_ATIESH);

    if (item) {
        if (player.CanEquipItem(item, ITEM_ENTRY_ATIESH, ATIESH_MAIN_HAND_SLOT)) {
            player.EquipItem(item, ATIESH_MAIN_HAND_SLOT);
            player.SendBroadcastMessage("You have equipped Atiesh, Greatstaff of the Guardian!");
        }
        else {
            player.SendBroadcastMessage("You do not meet the requirements to equip Atiesh.");
        }
    }
    else {
        player.SendBroadcastMessage("You do not possess Atiesh, Greatstaff of the Guardian.");
    }
}

const OnLoginEquipAtiesh: player_event_on_login = (event: number, player: Player) => {
    CanEquipAtiesh(player);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLoginEquipAtiesh(...args));
```

In this example:
1. We define the item entry for Atiesh, Greatstaff of the Guardian and the main hand slot number.
2. The `CanEquipAtiesh` function checks if the player has Atiesh in their inventory using `GetItemByEntry`.
3. If the player has the item, we use `CanEquipItem` to check if the player meets the requirements to equip Atiesh in the main hand slot.
4. If the player can equip the item, we use `EquipItem` to equip Atiesh and send a broadcast message to the player.
5. If the player cannot equip the item, we send a message informing them they do not meet the requirements.
6. If the player does not have Atiesh, we send a message informing them they do not possess the item.
7. Finally, we register the `OnLoginEquipAtiesh` function to the `PLAYER_EVENT_ON_LOGIN` event to check if the player can equip Atiesh when they log in.

## CanFly
Returns whether the player is able to fly or not. This is determined by the player's current location, form, and abilities.

### Parameters
None

### Returns
boolean - `true` if the player can currently fly, `false` otherwise.

### Example Usage
The following script demonstrates how to use the `CanFly()` method to check if a player is able to fly before performing a specific action. In this case, the script listens for the `PLAYER_EVENT_ON_COMMAND` event and checks if the player can fly when they use the `.fly` command. If the player can fly, it will toggle their flying state. If they cannot fly, it will send them a message indicating that they are unable to fly at their current location.

```typescript
const FLY_COMMAND = "fly";

const OnPlayerCommand: player_event_on_command = (event: number, player: Player, command: string, chatHandler: ChatHandler): boolean => {
    if (command === FLY_COMMAND) {
        if (player.CanFly()) {
            if (player.IsFlying()) {
                player.SetFlying(false);
                chatHandler.SendSysMessage("You have stopped flying.");
            } else {
                player.SetFlying(true);
                chatHandler.SendSysMessage("You are now flying!");
            }
        } else {
            chatHandler.SendSysMessage("You cannot fly here.");
        }
        return false;
    }
    return true;
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => OnPlayerCommand(...args));
```

In this example, the script registers the `PLAYER_EVENT_ON_COMMAND` event and checks if the player used the `.fly` command. If they did, it proceeds to check if the player can fly using the `CanFly()` method.

If `CanFly()` returns `true`, the script then checks the player's current flying state using `IsFlying()`. If the player is already flying, it will stop their flying state using `SetFlying(false)` and send them a message saying "You have stopped flying." If the player is not currently flying, it will set their flying state using `SetFlying(true)` and send them a message saying "You are now flying!"

If `CanFly()` returns `false`, meaning the player is unable to fly at their current location, the script will send them a message saying "You cannot fly here."

By using the `CanFly()` method, you can ensure that players are only able to toggle their flying state in appropriate locations, such as in outdoor areas where flying is permitted. This helps maintain game balance and prevents players from accessing unintended areas or exploiting game mechanics.

## CanParry
Returns a boolean value indicating whether the player can parry incoming attacks or not. This is determined by the player's class, level, and equipment.

### Parameters
None

### Returns
* boolean - Returns `true` if the player can parry attacks, `false` otherwise.

### Example Usage
In this example, we'll create a script that adjusts the player's parry chance based on their level and class.

```typescript
const adjustParryChance: player_event_on_update = (event: number, player: Player, diff: number) => {
    const playerLevel = player.GetLevel();
    const playerClass = player.GetClass();
    let parryChanceBonus = 0;

    if (playerClass === Classes.CLASS_WARRIOR || playerClass === Classes.CLASS_PALADIN || playerClass === Classes.CLASS_ROGUE) {
        if (playerLevel >= 10 && playerLevel < 20) {
            parryChanceBonus = 2;
        } else if (playerLevel >= 20 && playerLevel < 30) {
            parryChanceBonus = 4;
        } else if (playerLevel >= 30) {
            parryChanceBonus = 6;
        }
    }

    if (player.CanParry()) {
        const currentParryChance = player.GetFloatValue(PlayerFields.PLAYER_PARRY_PERCENTAGE);
        const newParryChance = currentParryChance + parryChanceBonus;
        player.SetFloatValue(PlayerFields.PLAYER_PARRY_PERCENTAGE, newParryChance);
        player.SendMessage(`Your parry chance has been increased by ${parryChanceBonus}% based on your level and class.`);
    } else {
        player.SendMessage("Your class cannot parry attacks.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => adjustParryChance(...args));
```

In this script:
1. We define a function called `adjustParryChance` that takes the player and the time difference as arguments.
2. We retrieve the player's level and class using the `GetLevel()` and `GetClass()` methods.
3. We initialize a variable called `parryChanceBonus` to store the bonus parry chance percentage.
4. We check if the player's class is Warrior, Paladin, or Rogue, and if so, we assign a parry chance bonus based on their level range.
5. We use the `CanParry()` method to check if the player can parry attacks.
6. If the player can parry, we retrieve their current parry chance percentage using `GetFloatValue(PlayerFields.PLAYER_PARRY_PERCENTAGE)`.
7. We calculate the new parry chance by adding the `parryChanceBonus` to the current parry chance.
8. We update the player's parry chance using `SetFloatValue(PlayerFields.PLAYER_PARRY_PERCENTAGE, newParryChance)`.
9. We send a message to the player informing them about the increased parry chance.
10. If the player cannot parry, we send a message indicating that their class cannot parry attacks.

Finally, we register the `adjustParryChance` function to the `PLAYER_EVENT_ON_UPDATE` event using `RegisterPlayerEvent`.

This script demonstrates how the `CanParry()` method can be used in combination with other player-related methods and events to create a more dynamic gameplay experience based on the player's class and level.

## CanShareQuest
This method checks if the player is able to share a quest with other players in a group.

### Parameters
* entryId: number - The ID of the quest to check if it can be shared.

### Returns
* boolean - Returns 'true' if the player can share the specified quest, 'false' otherwise.

### Example Usage
This example demonstrates how to use `CanShareQuest` to prevent players from joining a group if they have a specific quest that cannot be shared.

```typescript
const UNPARALLELED_POWER_QUEST_ID = 13373;

const onGroupInvite: player_event_on_group_invite = (event: number, player: Player, groupGuid: number, inviterGuid: number): void => {
    const inviter = GetPlayerByGUID(inviterGuid);

    if (!inviter) {
        return;
    }

    const questId = UNPARALLELED_POWER_QUEST_ID;

    if (player.HasQuest(questId) && !player.CanShareQuest(questId)) {
        player.SendBroadcastMessage(`You cannot join the group because you have the quest "${GetQuestNameById(questId)}" which cannot be shared.`);
        inviter.SendBroadcastMessage(`${player.GetName()} cannot join the group because they have the quest "${GetQuestNameById(questId)}" which cannot be shared.`);
        player.DeclineGroup();
        return;
    }

    // Other group invite logic...
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GROUP_INVITE, (...args) => onGroupInvite(...args));
```

In this example:
1. We define a constant `UNPARALLELED_POWER_QUEST_ID` with the ID of the quest we want to check.
2. In the `onGroupInvite` event, we first check if the inviter exists using `GetPlayerByGUID`.
3. We store the quest ID in a variable `questId`.
4. We check if the player has the quest using `HasQuest` and if they can share it using `CanShareQuest`.
   - If the player has the quest and cannot share it:
     - We send a message to the player informing them that they cannot join the group due to the unshared quest.
     - We send a message to the inviter informing them that the player cannot join the group due to the unshared quest.
     - We decline the group invitation for the player using `DeclineGroup`.
     - We return to prevent further execution of the event.
5. If the player can share the quest or doesn't have it, the event continues with other group invite logic.

This example showcases how `CanShareQuest` can be used to enforce quest sharing restrictions when players attempt to join a group.

## CanSpeak
Returns a boolean value indicating whether the player can currently communicate through chat.

### Parameters
None

### Returns
boolean - Returns `true` if the player can speak in chat, `false` otherwise.

### Example Usage
This example demonstrates how to use the `CanSpeak` method to prevent players from using certain chat commands if they are muted or silenced.

```typescript
// Custom chat command
const MY_CUSTOM_COMMAND = "mycmd";

// Function to handle the chat command
const handleChatCommand: player_event_on_chat = (event: number, player: Player, msg: string, type: number, lang: Language): void => {
    // Check if the message starts with the custom command
    if (msg.startsWith(MY_CUSTOM_COMMAND)) {
        // Check if the player can speak
        if (player.CanSpeak()) {
            // Player can speak, process the command
            // ...
            // Example: Send a message to the player
            player.SendBroadcastMessage("You used the custom command!");
        } else {
            // Player cannot speak, send an error message
            player.SendBroadcastMessage("You are not allowed to use this command while muted or silenced.");
        }
    }
};

// Register the chat event handler
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => handleChatCommand(...args));
```

In this example:
1. We define a custom chat command `MY_CUSTOM_COMMAND`.
2. We create a function `handleChatCommand` to handle the chat event.
3. Inside the function, we check if the chat message starts with the custom command.
4. If it does, we use the `CanSpeak` method to check if the player can currently speak in chat.
   - If the player can speak, we process the command and send a message to the player.
   - If the player cannot speak (muted or silenced), we send an error message to the player.
5. Finally, we register the `handleChatCommand` function to be called whenever the `PLAYER_EVENT_ON_CHAT` event is triggered.

This example showcases how the `CanSpeak` method can be used to enforce chat restrictions and prevent muted or silenced players from using certain chat commands or features in the game.

## CanTitanGrip
Returns whether or not the player can use the Titan Grip ability. 

### Returns
boolean - Returns `true` if the player can use Titan Grip, `false` otherwise.

### Example Usage
Handling an event where a Warrior attempts to equip two two-handed weapons:
```typescript
const ItemEquip : player_event_on_equip_item = (event: number, player: Player, item: Item) => {
    // Check if the player is a Warrior
    if (player.GetClass() !== Classes.CLASS_WARRIOR) {
        return;
    }

    // Check if the equipped item is a two-handed weapon
    if (item.GetInventoryType() === InventoryType.INVTYPE_2HWEAPON) {
        // Get the item in the player's offhand slot
        const offhandItem = player.GetItemByPos(InventorySlot.INVENTORY_SLOT_BAG_0, EquipmentSlots.EQUIPMENT_SLOT_OFFHAND);

        // If the player has a two-handed weapon equipped in their offhand and they can't Titan Grip
        if (offhandItem && offhandItem.GetInventoryType() === InventoryType.INVTYPE_2HWEAPON && !player.CanTitanGrip()) {
            // Send a message to the player
            player.SendBroadcastMessage("You can't equip two two-handed weapons without the Titan Grip ability.");

            // Remove the offhand weapon
            player.RemoveItem(InventorySlot.INVENTORY_SLOT_BAG_0, EquipmentSlots.EQUIPMENT_SLOT_OFFHAND, true);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => ItemEquip(...args));
```

In this example, when a player equips an item, we first check if the player is a Warrior. If they are, we then check if the equipped item is a two-handed weapon. If it is, we get the item in the player's offhand slot and check if it's also a two-handed weapon. If the player has a two-handed weapon in their offhand and they can't use Titan Grip (determined by calling `CanTitanGrip()`), we send them a message indicating that they can't equip two two-handed weapons without the Titan Grip ability, and we remove the offhand weapon.

This script prevents Warriors from equipping two two-handed weapons unless they have the Titan Grip ability, providing a more authentic gameplay experience that adheres to the rules of the game.

## CanUninviteFromGroup
This method checks if the player has permission to uninvite other players from their current group. It takes into account factors such as the player's rank within the group and the group type (party or raid).

### Parameters
None

### Returns
boolean - Returns 'true' if the player has permission to uninvite others from the current group, 'false' otherwise.

### Example Usage
In this example, we create a command that allows a player to uninvite another player from their group, but only if they have the necessary permissions.

```typescript
// Define the command
const GroupUninviteCommand: player_gossip_event = (event: number, player: Player, receiver: Creature, message: string) => {
    // Check if the player is in a group
    if (!player.IsInGroup()) {
        player.SendBroadcastMessage("You are not in a group.");
        return;
    }

    // Check if the player has permission to uninvite others
    if (!player.CanUninviteFromGroup()) {
        player.SendBroadcastMessage("You do not have permission to uninvite players from the group.");
        return;
    }

    // Get the name of the player to uninvite from the command arguments
    const targetName = message.trim();

    // Find the target player by name
    const target = Player.GetPlayer(targetName);

    if (!target) {
        player.SendBroadcastMessage(`Player '${targetName}' not found.`);
        return;
    }

    // Check if the target player is in the same group as the uninviting player
    if (!player.IsInSameGroupWith(target)) {
        player.SendBroadcastMessage(`Player '${targetName}' is not in your group.`);
        return;
    }

    // Uninvite the target player from the group
    target.UninviteFromGroup();

    // Send a message to the group
    player.GetGroup().SendGroupMessage(`${target.GetName()} has been uninvited from the group by ${player.GetName()}.`);
};

// Register the command
RegisterPlayerGossipEvent(100, (...args) => GroupUninviteCommand(...args));
```

In this script:
1. We first check if the player is actually in a group using `IsInGroup()`.
2. We then check if the player has permission to uninvite others using `CanUninviteFromGroup()`.
3. We get the name of the player to uninvite from the command arguments.
4. We attempt to find the target player by name using `Player.GetPlayer()`.
5. We check if the target player is in the same group as the uninviting player using `IsInSameGroupWith()`.
6. If all checks pass, we uninvite the target player from the group using `UninviteFromGroup()`.
7. Finally, we send a message to the group informing them of the uninvite action.

This script demonstrates how `CanUninviteFromGroup()` can be used in combination with other group-related methods to implement group management functionality in a mod.

## CanUseItem
Determines if the player can use a specific item or item entry. This method checks for class, level, skill, and other requirements.

### Parameters
* item: [Item](./item.md) - The item to check if the player can use
* entry: number - The item entry to check if the player can use

### Returns
* boolean - Returns 'true' if the player can use the item or item entry, 'false' otherwise.

### Example Usage
Prevent warriors from using wands and create a custom message:
```typescript
const WAND_ITEM_CLASS = 2;
const WAND_ITEM_SUBCLASS = 19;
const WARRIOR_CLASS_MASK = 1;

const OnUseItemStart: player_event_on_use_item = (event, player, item, cast) => {
    if (player.GetClassMask() & WARRIOR_CLASS_MASK) {
        const itemClass = item.GetClass();
        const itemSubClass = item.GetSubClass();

        if (itemClass == WAND_ITEM_CLASS && itemSubClass == WAND_ITEM_SUBCLASS) {
            if (!player.CanUseItem(item)) {
                player.SendBroadcastMessage("Warriors cannot use wands.");
                player.SendEquipError(InventoryResult.EQUIP_ERR_CANT_DO_RIGHT_NOW, item);
                return false;
            }
        }
    }
    return true;
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, OnUseItemStart);
```
In this example, when a warrior tries to use a wand, the script checks if the player can use the item using the `CanUseItem` method. If the player cannot use the item, it sends a custom broadcast message to the player, sends the appropriate equip error message, and prevents the item usage by returning false.

You can also use the `CanUseItem` method with an item entry:
```typescript
const ITEM_ENTRY_DARK_PORTAL = 184871;
const ITEM_ENTRY_MEDIVH_JOURNAL = 184875;

const OnLoginCheckItems: player_event_on_login = (event, player) => {
    if (!player.CanUseItem(null, ITEM_ENTRY_DARK_PORTAL)) {
        player.AddItem(ITEM_ENTRY_MEDIVH_JOURNAL);
        player.SendBroadcastMessage("You found Medivh's Journal, which may help you to use the Dark Portal.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLoginCheckItems);
```
In this example, when a player logs in, the script checks if the player can use the Dark Portal item using the `CanUseItem` method with the item entry. If the player cannot use the Dark Portal, the script adds Medivh's Journal to the player's inventory and sends a broadcast message hinting that the journal may help them use the Dark Portal.

## ClearComboPoints
Clears the player's combo points. This is useful for situations where you want to remove any existing combo points from the player, such as when they change targets or leave combat.

### Parameters
None

### Returns
None

### Example Usage
In this example, we'll create a script that clears the player's combo points when they leave combat. This ensures that the player starts fresh with zero combo points when entering a new combat encounter.

```typescript
const onLeaveCombat: player_event_on_leave_combat = (event: number, player: Player) => {
    // Clear the player's combo points when leaving combat
    player.ClearComboPoints();

    // Notify the player that their combo points have been reset
    player.SendBroadcastMessage("Your combo points have been reset.");

    // You can also perform additional actions here, such as resetting other player states or buffs
    // For example, you might want to remove a stealth buff if the player is a rogue
    if (player.GetClass() == Classes.CLASS_ROGUE) {
        player.RemoveAura(1784); // Stealth spell ID
    }

    // Or, you could apply a "well rested" buff if the player is in an inn or city
    if (player.IsInCity() || player.IsInInn()) {
        player.AddAura(20591, player); // Restful Sleep spell ID
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEAVE_COMBAT, (...args) => onLeaveCombat(...args));
```

In this script, we register the `onLeaveCombat` callback function to be triggered whenever the player leaves combat. Inside the callback, we perform the following actions:

1. Clear the player's combo points using `player.ClearComboPoints()`.
2. Send a broadcast message to the player informing them that their combo points have been reset.
3. Check if the player is a rogue using `player.GetClass()` and compare it with the `Classes.CLASS_ROGUE` constant. If the player is a rogue, we remove the stealth buff using `player.RemoveAura(1784)`, where `1784` is the spell ID for stealth.
4. Check if the player is in a city or inn using `player.IsInCity()` or `player.IsInInn()`. If the player is in either of these locations, we apply the "Restful Sleep" buff using `player.AddAura(20591, player)`, where `20591` is the spell ID for the buff.

This example demonstrates how you can use the `ClearComboPoints` method in combination with other player-related methods and game events to create more complex and immersive gameplay experiences. By resetting the player's combo points when leaving combat and performing additional actions based on their class and location, you can provide a more dynamic and personalized experience for each player.

## ClearHonorInfo
This method clears all the weekly honor status for the player, resetting their honor points, kills, and other related statistics. This can be useful for implementing custom PvP systems or resetting player progress on a weekly basis.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage:
In this example, we'll create a script that resets all online players' weekly honor status every Sunday at midnight.

```typescript
// Function to reset weekly honor status for all online players
function ResetWeeklyHonor() {
    const players = GetPlayersInWorld();
    for (const player of players) {
        player.ClearHonorInfo();
        player.SendBroadcastMessage("Your weekly honor status has been reset.");
    }
}

// Function to check if it's Sunday at midnight
function IsSundayMidnight() {
    const now = new Date();
    return now.getDay() === 0 && now.getHours() === 0 && now.getMinutes() === 0;
}

// Register a server event to check for Sunday midnight every minute
RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_UPDATE, () => {
    if (IsSundayMidnight()) {
        ResetWeeklyHonor();
    }
});
```

In this script:

1. We define a function called `ResetWeeklyHonor` that retrieves all online players using `GetPlayersInWorld()`, then iterates through each player and calls the `ClearHonorInfo()` method to reset their weekly honor status. We also send a broadcast message to each player informing them of the reset.

2. We define a helper function called `IsSundayMidnight` that checks if the current date and time is Sunday at midnight (00:00).

3. We register a server event using `RegisterServerEvent` with the event type `ServerEvents.SERVER_EVENT_ON_UPDATE`. This event is triggered every server update tick (usually every few milliseconds).

4. Inside the event callback, we check if it's Sunday at midnight using the `IsSundayMidnight` function. If it is, we call the `ResetWeeklyHonor` function to reset the weekly honor status for all online players.

With this script in place, the server will automatically reset the weekly honor status for all online players every Sunday at midnight, providing a consistent and automated way to manage player progress in a custom PvP system.

## CompleteQuest
This method allows you to complete a quest for the player by providing the quest entry ID. It will attempt to satisfy all quest requirements and complete the quest if the player has it in their quest log.

### Parameters
* entry: number - The entry ID of the quest to be completed.

### Example Usage
Here's an example of how to use the `CompleteQuest` method to automatically complete a specific quest when the player reaches a certain level:

```typescript
const QUEST_ENTRY_ID = 1234; // Replace with the actual quest entry ID
const REQUIRED_LEVEL = 20; // Replace with the desired level requirement

const OnLevelUp: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    const newLevel = player.GetLevel();
    
    if (oldLevel < REQUIRED_LEVEL && newLevel >= REQUIRED_LEVEL) {
        if (player.HasQuest(QUEST_ENTRY_ID)) {
            player.CompleteQuest(QUEST_ENTRY_ID);
            player.SendBroadcastMessage("Congratulations! You have automatically completed the quest.");
        } else {
            player.SendBroadcastMessage("You have reached the required level, but you don't have the quest.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => OnLevelUp(...args));
```

In this example:
1. We define the `QUEST_ENTRY_ID` constant with the entry ID of the quest we want to complete automatically.
2. We define the `REQUIRED_LEVEL` constant with the desired level requirement for completing the quest.
3. We register the `OnLevelUp` event handler for the `PLAYER_EVENT_ON_LEVEL_CHANGE` event.
4. Inside the event handler, we retrieve the player's new level using `player.GetLevel()`.
5. We check if the player's old level is below the required level and the new level is greater than or equal to the required level.
6. If the level requirement is met, we check if the player has the quest using `player.HasQuest(QUEST_ENTRY_ID)`.
7. If the player has the quest, we call `player.CompleteQuest(QUEST_ENTRY_ID)` to complete the quest automatically.
8. We send a broadcast message to the player informing them about the automatic quest completion.
9. If the player doesn't have the quest, we send a different message indicating that they have reached the required level but don't have the quest.

This script ensures that when the player reaches the specified level (`REQUIRED_LEVEL`), if they have the quest with the given entry ID (`QUEST_ENTRY_ID`), it will be automatically completed. The player will receive a broadcast message confirming the completion or informing them if they don't have the quest.

Note: Make sure to replace `QUEST_ENTRY_ID` with the actual entry ID of the quest you want to complete, and adjust the `REQUIRED_LEVEL` according to your desired level requirement.

## DurabilityLoss
Damages the specified [Item](./item.md) by reducing its durability by a percentage. If the item's durability reaches 0, it will be destroyed.

### Parameters
* item: [Item](./item.md) - The item to damage.
* percent: number - The percentage of durability to remove from the item (0-100).

### Example Usage
Damage equipped items on death based on item quality:
```typescript
const onPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    const items = player.GetEquippedItems();
    for (const item of items) {
        switch (item.GetQuality()) {
            case ItemQuality.ITEM_QUALITY_POOR:
            case ItemQuality.ITEM_QUALITY_NORMAL:
                player.DurabilityLoss(item, 5);
                break;
            case ItemQuality.ITEM_QUALITY_UNCOMMON:
                player.DurabilityLoss(item, 7);
                break;
            case ItemQuality.ITEM_QUALITY_RARE:
                player.DurabilityLoss(item, 10);
                break;
            case ItemQuality.ITEM_QUALITY_EPIC:
                player.DurabilityLoss(item, 12);
                break;
            case ItemQuality.ITEM_QUALITY_LEGENDARY:
            case ItemQuality.ITEM_QUALITY_ARTIFACT:
                player.DurabilityLoss(item, 15);
                break;
            default:
                break;
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => onPlayerDeath(...args));
```

In this example, when a player dies, their equipped items will lose durability based on the item's quality. Poor and normal quality items will lose 5% durability, uncommon items will lose 7%, rare items will lose 10%, epic items will lose 12%, and legendary and artifact items will lose 15% durability.

This script adds an extra layer of item management for players, encouraging them to repair their gear regularly and be more cautious in combat to avoid losing valuable items due to durability loss.

## DurabilityLossAll
Damages all equipped items on the player by a percentage amount. Optionally, you can specify to damage items in the player's inventory as well.

### Parameters
* percent: number - The percentage of durability to be lost on each item. Value must be between 0 and 100.
* inventory?: boolean - (Optional) If set to true, items in the player's inventory will also lose durability. Default is false.

### Example Usage
In this example, we create a script that damages all equipped items and items in the inventory by 20% when the player dies in combat.

```typescript
const onPlayerDeath: player_event_on_death = (event: PlayerEvents, player: Player, killer: Unit) => {
    const DURABILITY_LOSS_PERCENT = 20;
    const DAMAGE_INVENTORY = true;

    // Check if the player was killed by another player or creature
    if (killer && (killer.IsPlayer() || killer.IsCreature())) {
        // Apply durability loss to all equipped items and items in the inventory
        player.DurabilityLossAll(DURABILITY_LOSS_PERCENT, DAMAGE_INVENTORY);

        // Send a message to the player
        player.SendBroadcastMessage(`You have lost ${DURABILITY_LOSS_PERCENT}% durability on all your items!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => onPlayerDeath(...args));
```

In this script:
1. We define the percentage of durability loss (`DURABILITY_LOSS_PERCENT`) as 20%.
2. We set `DAMAGE_INVENTORY` to `true` to indicate that we want to damage items in the player's inventory as well.
3. When the player dies, we check if the killer is either a player or a creature using the `IsPlayer()` and `IsCreature()` methods.
4. If the killer is valid, we call the `DurabilityLossAll()` method on the player, passing in the `DURABILITY_LOSS_PERCENT` and `DAMAGE_INVENTORY` values.
5. Finally, we send a broadcast message to the player informing them about the durability loss on their items.

This script ensures that when a player dies in combat against another player or a creature, they lose 20% durability on all their equipped items and items in their inventory. The player is also notified about the durability loss through a broadcast message.

Note: Make sure to adjust the `DURABILITY_LOSS_PERCENT` value according to your desired gameplay balance. A higher percentage will result in more significant durability loss, while a lower percentage will be less punishing.

## DurabilityPointLossForEquipSlot
This method sets the durability loss for an equipped item in a specific slot. The durability loss is applied when the player takes damage or dies. This can be used to adjust the rate at which equipped items lose durability in certain situations.

### Parameters
* slot: number - The equipment slot index. Use the EquipmentSlots enum for valid slot indices.

### Example Usage
Increase weapon durability loss in a challenging area:
```typescript
const CHALLENGING_AREA_MAP_ID = 123;
const CHALLENGING_AREA_DURABILITY_LOSS_MULTIPLIER = 2;

const updateDurabilityLoss: player_event_on_update = (event: number, player: Player, diff: number) => {
    if (player.GetMapId() === CHALLENGING_AREA_MAP_ID) {
        const weaponSlot = EquipmentSlots.EQUIPMENT_SLOT_MAINHAND;
        const offhandSlot = EquipmentSlots.EQUIPMENT_SLOT_OFFHAND;

        const weaponItem = player.GetItemByPos(255, weaponSlot);
        const offhandItem = player.GetItemByPos(255, offhandSlot);

        if (weaponItem) {
            const baseDurabilityLoss = player.GetUInt32Value(UnitFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS + weaponSlot);
            const increasedDurabilityLoss = baseDurabilityLoss * CHALLENGING_AREA_DURABILITY_LOSS_MULTIPLIER;
            player.DurabilityPointLossForEquipSlot(weaponSlot);
            player.SetUInt32Value(UnitFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS + weaponSlot, increasedDurabilityLoss);
        }

        if (offhandItem) {
            const baseDurabilityLoss = player.GetUInt32Value(UnitFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS + offhandSlot);
            const increasedDurabilityLoss = baseDurabilityLoss * CHALLENGING_AREA_DURABILITY_LOSS_MULTIPLIER;
            player.DurabilityPointLossForEquipSlot(offhandSlot);
            player.SetUInt32Value(UnitFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS + offhandSlot, increasedDurabilityLoss);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => updateDurabilityLoss(...args));
```
In this example:
1. We define a challenging area map ID and a durability loss multiplier.
2. In the `player_event_on_update` event, we check if the player is in the challenging area.
3. If the player is in the challenging area, we get the player's main-hand and off-hand weapon items.
4. For each equipped weapon, we:
   - Get the base durability loss value from the player's fields.
   - Calculate the increased durability loss by multiplying the base value with the multiplier.
   - Apply the durability point loss for the corresponding equipment slot using `DurabilityPointLossForEquipSlot`.
   - Set the increased durability loss value back to the player's fields.

This script will cause the player's weapons to lose durability at an increased rate while in the challenging area, making item maintenance more important and adding an extra layer of difficulty to the area.

## DurabilityPointsLoss
This method allows you to set the durability loss for a specific item equipped by the player. The durability loss is applied instantly, reducing the item's current durability by the specified number of points.

### Parameters
* item: [Item](./item.md) - The item to apply the durability loss to. The item must be equipped by the player.
* points: number - The number of durability points to subtract from the item's current durability.

### Example Usage
In this example, we create a script that applies a durability loss to a player's equipped weapon whenever they enter combat with a creature that has a specific entry ID.

```typescript
const CREATURE_ENTRY_ID = 1234; // Replace with the desired creature entry ID
const DURABILITY_LOSS_POINTS = 5;

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    if (enemy.IsCreature() && enemy.ToCreature().GetEntry() === CREATURE_ENTRY_ID) {
        const mainHandItem = player.GetItemByPos(InventorySlots.INVENTORY_SLOT_BAG_0, EquipmentSlots.EQUIPMENT_SLOT_MAINHAND);
        if (mainHandItem) {
            player.DurabilityPointsLoss(mainHandItem, DURABILITY_LOSS_POINTS);
            player.SendBroadcastMessage(`Your weapon loses ${DURABILITY_LOSS_POINTS} durability points!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script:
1. We define constants for the creature entry ID and the number of durability points to subtract.
2. We register a player event handler for the `PLAYER_EVENT_ON_ENTER_COMBAT` event using `RegisterPlayerEvent`.
3. Inside the event handler, we check if the enemy is a creature and if its entry ID matches the desired creature entry ID.
4. If the conditions are met, we retrieve the player's main hand item using `GetItemByPos` with the appropriate inventory and equipment slot constants.
5. If the main hand item exists, we call the `DurabilityPointsLoss` method, passing the item and the number of durability points to subtract.
6. Finally, we send a broadcast message to the player informing them about the durability loss on their weapon.

With this script, whenever the player enters combat with a creature that has the specified entry ID, their main hand weapon will lose the specified number of durability points. The player will also receive a broadcast message indicating the durability loss.

Note: Make sure to replace `CREATURE_ENTRY_ID` with the actual entry ID of the creature you want to trigger the durability loss for, and adjust `DURABILITY_LOSS_POINTS` to the desired number of durability points to subtract.

## DurabilityPointsLossAll
This method will reduce the durability of all equipped items on the player by the specified amount of points. Optionally, it can also reduce the durability of items in the player's inventory bags.

### Parameters
* points: number - The amount of durability points to reduce on each item. Each point represents 0.01% durability loss.
* inventory?: boolean - (Optional) If set to true, the durability loss will also be applied to items in the player's inventory bags.

### Example Usage
In this example, we create a script that applies a durability loss to all players in a raid group whenever a boss creature dies. The amount of durability loss is based on the raid difficulty, and it also applies to items in the inventory.

```typescript
const BOSS_ENTRY = 12345; // Replace with the actual boss creature entry ID

const onCreatureDeath: creature_event_on_creature_death = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        const players = creature.GetPlayersInRangeSet(100); // Get all players within 100 yards of the boss
        const raidDifficulty = creature.GetMapDifficulty(); // Get the raid difficulty (10 man, 25 man, etc.)
        
        let durabilityLoss = 0;
        switch (raidDifficulty) {
            case 1: // 10 man normal
                durabilityLoss = 1000; // 10% durability loss
                break;
            case 2: // 25 man normal
                durabilityLoss = 1500; // 15% durability loss
                break;
            case 3: // 10 man heroic
                durabilityLoss = 2000; // 20% durability loss
                break;
            case 4: // 25 man heroic
                durabilityLoss = 2500; // 25% durability loss
                break;
        }
        
        players.forEach((player) => {
            player.DurabilityPointsLossAll(durabilityLoss, true); // Apply durability loss to equipped items and inventory
            player.SendBroadcastMessage("Your items have suffered durability loss from the boss encounter!");
        });
    }
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_CREATURE_DEATH, (...args) => onCreatureDeath(...args));
```

In this script:
1. We define the boss creature entry ID (replace `BOSS_ENTRY` with the actual ID).
2. In the `onCreatureDeath` event handler, we check if the died creature is the boss.
3. If it's the boss, we get all players within 100 yards of the boss using `GetPlayersInRangeSet()`.
4. We determine the raid difficulty using `GetMapDifficulty()` and set the `durabilityLoss` accordingly.
5. We iterate over each player in the range and apply the durability loss to their equipped items and inventory using `DurabilityPointsLossAll()`.
6. We send a broadcast message to each player informing them about the durability loss.
7. Finally, we register the event handler for the boss creature's death event using `RegisterCreatureEvent()`.

This script adds an extra challenge and consequence to the boss encounter by causing durability loss to the players' items, requiring them to repair their gear after the fight.

## DurabilityRepair
Repairs an equipped item at a specific inventory slot position.  This can be used to repair an individual item on the player.  
The player must be able to afford the cost of the repair and must be near a vendor that can repair the item. 

### Parameters
* position: number - Equipment slot to repair item in.
* cost: boolean - If true, the player will be charged the cost of the repair
* discountMod: number - Reputation discount on the cost of the repair if any (default: 1 no discount).  
* guildBank: boolean - If true, the cost of the repair will be taken from the guild bank if the player has permissions (default: false)

### Returns
Returns: number - The total cost of the repair

### Example Usage:
This example will repair the players main hand weapon for free when they kill a creature based on the entry id of the creature. 
```typescript
const CREATURE_ID = 400;
const EQUIPMENT_SLOT_MAINHAND = 15;

const RepairOnKill: player_event_on_kill = (event: number, player: Player, creature: Creature) => {

    if(creature.GetEntry() === CREATURE_ID) {

        const [item] = player.GetItemByPos(255, EQUIPMENT_SLOT_MAINHAND);

        if(item) {
            // don't charge for repair
            const repairCost = player.DurabilityRepair(EQUIPMENT_SLOT_MAINHAND, false, 1);

            // Inform the player of the free repair
            player.SendBroadcastMessage(`Your item ${item.GetName()} has been repaired for free!`);
            player.SendBroadcastMessage(`This would normally cost: ${repairCost} copper`);
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => RepairOnKill(...args));
```

In this example, when a player kills a specific creature, their main hand weapon will be repaired for free if it exists. The player will be informed of the free repair and the cost it would have been.

## DurabilityRepairAll
Repairs all items in the player's inventory and equipped items. This method can be used to repair items at a discounted rate, and can also be used to repair items using the player's guild bank funds.

### Parameters
* cost?: boolean - If set to true, the method will only return the total repair cost without actually repairing the items. Default is false.
* discountMod?: number - A discount modifier to apply to the repair cost. Default is 1.0 (no discount).
* guidBank?: boolean - If set to true, the method will use the player's guild bank funds to pay for the repairs. Default is false.

### Returns
* number - The total repair cost.

### Example Usage
Repair all items at a 20% discount using the player's own funds:
```typescript
function repairItems(player: Player) {
    const discountMod = 0.8;
    const repairCost = player.DurabilityRepairAll(false, discountMod);
    
    if (repairCost == 0) {
        player.SendBroadcastMessage("All your items are fully repaired.");
    } else {
        player.SendBroadcastMessage(`Your items have been repaired for ${repairCost} gold.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (event, player, msg) => {
    if (msg == "!repair") {
        repairItems(player);
    }
});
```

In this example, when the player types "!repair" in the chat, the `repairItems` function will be called. The function repairs all the player's items at a 20% discount using the player's own funds. If the total repair cost is 0, it means all items are already fully repaired. Otherwise, the function sends a message to the player with the total repair cost.

Here's another example that repairs all items using the player's guild bank funds:

```typescript
function repairItemsGuildBank(player: Player) {
    const repairCost = player.DurabilityRepairAll(true, 1.0, true);
    
    if (repairCost == 0) {
        player.SendBroadcastMessage("All your items are fully repaired.");
        return;
    }
    
    const guild = player.GetGuild();
    
    if (!guild) {
        player.SendBroadcastMessage("You are not a member of a guild.");
        return;
    }
    
    const guildBankMoney = guild.GetBankMoney();
    
    if (guildBankMoney < repairCost) {
        player.SendBroadcastMessage("Your guild bank does not have enough funds to repair your items.");
        return;
    }
    
    guild.SetBankMoney(guildBankMoney - repairCost);
    player.DurabilityRepairAll(false, 1.0, true);
    player.SendBroadcastMessage(`Your items have been repaired for ${repairCost} gold using your guild bank funds.`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (event, player, msg) => {
    if (msg == "!repairguild") {
        repairItemsGuildBank(player);
    }
});
```

In this example, when the player types "!repairguild" in the chat, the `repairItemsGuildBank` function will be called. The function first checks the repair cost without actually repairing the items. If the cost is 0, it means all items are already fully repaired.

If the player is not a member of a guild, a message is sent to the player and the function returns. If the player is a member of a guild, the function checks if the guild bank has enough funds to cover the repair cost. If not, a message is sent to the player and the function returns.

If the guild bank has enough funds, the function subtracts the repair cost from the guild bank funds, repairs all the player's items using the guild bank funds, and sends a message to the player with the total repair cost.

## EquipItem
Equips an item to the specified equipment slot on the player. If an item is already equipped in that slot, it will be replaced.

### Parameters
- `item`: [Item](./item.md) - The item to be equipped. If `nil`, the `entry` parameter will be used to create the item.
- `entry`: number - The item entry ID from the `item_template` table. This is only used if `item` is `nil`.
- `slot`: number - The equipment slot to equip the item to. Use the `EquipmentSlots` enum for valid slot IDs.

### Returns
[Item](./item.md) - The item that was equipped, or `nil` if the operation failed.

### Example Usage
Equip a specific item to the player's main hand slot:
```typescript
const SULFURAS_HAND_OF_RAGNAROS_ENTRY = 17182;

const onLoginEquipLegendary: player_event_on_login = (event: number, player: Player) => {
    const legendaryWeapon = player.AddItem(SULFURAS_HAND_OF_RAGNAROS_ENTRY, 1);
    if (legendaryWeapon) {
        player.EquipItem(legendaryWeapon, 0, EquipmentSlots.EQUIPMENT_SLOT_MAINHAND);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onLoginEquipLegendary(...args));
```

Equip the best available item for each equipment slot:
```typescript
const onLevelUpImproveGear: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    const equipSlots = [
        EquipmentSlots.EQUIPMENT_SLOT_HEAD,
        EquipmentSlots.EQUIPMENT_SLOT_NECK,
        EquipmentSlots.EQUIPMENT_SLOT_SHOULDERS,
        EquipmentSlots.EQUIPMENT_SLOT_CHEST,
        EquipmentSlots.EQUIPMENT_SLOT_WAIST,
        EquipmentSlots.EQUIPMENT_SLOT_LEGS,
        EquipmentSlots.EQUIPMENT_SLOT_FEET,
        EquipmentSlots.EQUIPMENT_SLOT_WRISTS,
        EquipmentSlots.EQUIPMENT_SLOT_HANDS,
        EquipmentSlots.EQUIPMENT_SLOT_FINGER1,
        EquipmentSlots.EQUIPMENT_SLOT_FINGER2,
        EquipmentSlots.EQUIPMENT_SLOT_TRINKET1,
        EquipmentSlots.EQUIPMENT_SLOT_TRINKET2,
        EquipmentSlots.EQUIPMENT_SLOT_BACK,
        EquipmentSlots.EQUIPMENT_SLOT_MAINHAND,
        EquipmentSlots.EQUIPMENT_SLOT_OFFHAND,
        EquipmentSlots.EQUIPMENT_SLOT_RANGED,
        EquipmentSlots.EQUIPMENT_SLOT_TABARD,
    ];

    for (const slot of equipSlots) {
        const bestItemEntry = GetBestItemForPlayerBySlot(player, slot);
        if (bestItemEntry) {
            player.EquipItem(nil, bestItemEntry, slot);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => onLevelUpImproveGear(...args));
```
In this example, `GetBestItemForPlayerBySlot` is a custom function that would determine the best item for the player to equip in each slot based on their class, level, and other factors. The specific implementation is not shown here, but it would likely involve querying the `item_template` table and applying various heuristics to score and rank the available items.

## FailQuest
This method sets a specific quest as failed for the player. When a quest is failed, it is removed from the player's active quests and cannot be completed or turned in. This can be useful for scripting custom quest interactions or implementing quest failure conditions.

### Parameters
* entry: number - The ID of the quest to be marked as failed. Quest IDs can be found in the `quest_template` table in the world database.

### Example Usage
In this example, we have a custom script that checks if the player has an item in their inventory when they try to complete a quest. If the player does not have the required item, the quest is marked as failed.

```typescript
const REQUIRED_ITEM_ENTRY = 12345;
const QUEST_ENTRY = 678;

const onQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number) => {
    if (quest === QUEST_ENTRY) {
        const requiredItem = player.GetItemByEntry(REQUIRED_ITEM_ENTRY);

        if (!requiredItem) {
            player.SendBroadcastMessage("You do not have the required item to complete this quest.");
            player.FailQuest(QUEST_ENTRY);
            return false; // Prevent the quest from being completed
        }

        // Additional logic for successful quest completion
        player.SendBroadcastMessage("Quest completed! You had the required item.");
        player.RemoveItem(requiredItem, 1); // Remove the required item from the player's inventory
    }

    return true; // Allow the quest to be completed if conditions are met
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => onQuestComplete(...args));
```

In this script:
1. We define the required item entry (`REQUIRED_ITEM_ENTRY`) and the quest entry (`QUEST_ENTRY`) as constants.
2. We register a player event handler for the `PLAYER_EVENT_ON_QUEST_COMPLETE` event.
3. When the player tries to complete the specified quest, we check if they have the required item in their inventory using the `GetItemByEntry` method.
4. If the player does not have the required item, we send them a message using `SendBroadcastMessage`, fail the quest using `FailQuest`, and return `false` to prevent the quest from being completed.
5. If the player has the required item, we send them a success message, remove the required item from their inventory using `RemoveItem`, and return `true` to allow the quest to be completed.

By using the `FailQuest` method, we can implement custom quest failure conditions and handle them accordingly in our scripts.

## GetAccountId
Returns the unique account ID for the player. This ID corresponds to the ID in the `account` table of the `auth` database.

### Parameters
This method does not take any parameters.

### Returns
* `number` - The player's account ID.

### Example Usage
This example demonstrates how to retrieve a player's account ID and store it in the database for later use, such as tracking player activity or rewards.

```typescript
// Event handler for player login
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's account ID
    const accountId = player.GetAccountId();

    // Get the current date and time
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // Insert the player's account ID and login timestamp into the database
    const query = `
        INSERT INTO player_activity (account_id, last_login)
        VALUES (${accountId}, '${dateString}')
        ON DUPLICATE KEY UPDATE last_login = '${dateString}';
    `;

    // Execute the SQL query
    ExecuteQuery(query, (result: QueryResult) => {
        if (result) {
            console.log(`Logged player activity for account ID: ${accountId}`);
        } else {
            console.error(`Failed to log player activity for account ID: ${accountId}`);
        }
    });
};

// Register the event handler for player login
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. When a player logs in, the `OnLogin` event handler is triggered.
2. The player's account ID is retrieved using `player.GetAccountId()`.
3. The current date and time are formatted as a string.
4. An SQL query is constructed to insert or update the player's account ID and login timestamp in the `player_activity` table.
5. The query is executed using `ExecuteQuery()`, which takes the SQL query and a callback function.
6. If the query is successful, a success message is logged; otherwise, an error message is logged.

By storing the player's account ID and login timestamp in the database, you can track player activity, implement reward systems based on playtime, or perform other account-related operations.

Note: Make sure to replace `player_activity` with the actual name of your database table and adjust the table structure according to your needs.

## GetAccountName
Returns the account name of the player.

### Parameters
None

### Returns
string - The account name of the player.

### Example Usage
This example demonstrates how to retrieve the account name of a player and use it to log a message when the player enters the world.

```typescript
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const accountName = player.GetAccountName();
    
    // Log the player's account name and character name
    console.log(`Player ${player.GetName()} with account ${accountName} has logged in.`);

    // Check if the account name starts with "GM"
    if (accountName.startsWith("GM")) {
        // Send a welcome message to the player
        player.SendBroadcastMessage("Welcome, Game Master! Your presence is greatly appreciated.");

        // Grant the player a special item
        const gmItem = player.AddItem(12345, 1);
        if (gmItem) {
            player.SendBroadcastMessage(`You have been granted a special GM item: ${gmItem.GetName()}`);
        }
    } else {
        // Send a regular welcome message to the player
        player.SendBroadcastMessage("Welcome to the server! Enjoy your adventures.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:

1. We define a callback function `OnLogin` that is triggered when a player logs in.

2. Inside the callback, we retrieve the player's account name using `player.GetAccountName()` and store it in the `accountName` variable.

3. We log a message using `console.log()` to display the player's account name and character name.

4. We check if the account name starts with "GM" using the `startsWith()` method.

5. If the account name starts with "GM":
   - We send a special welcome message to the player using `player.SendBroadcastMessage()`.
   - We grant the player a special GM item using `player.AddItem()` and store the added item in the `gmItem` variable.
   - If the item is successfully added (i.e., `gmItem` is truthy), we send another message to the player informing them about the granted item.

6. If the account name does not start with "GM", we send a regular welcome message to the player.

7. Finally, we register the `OnLogin` callback function to the `PLAYER_EVENT_ON_LOGIN` event using `RegisterPlayerEvent()`.

This example showcases how the `GetAccountName()` method can be used to retrieve the account name of a player and perform different actions based on the account name, such as sending customized messages or granting special items to game masters.

## GetActiveSpec
Returns the active specialization ID for the player. This method can be used to determine which spec the player is currently using.

### Parameters
None

### Returns
number - The active specialization ID of the player.

### Example Usage
This example demonstrates how to reward players with different items based on their active specialization.

```typescript
const WARRIOR_SPEC_ARMS = 0;
const WARRIOR_SPEC_FURY = 1;
const WARRIOR_SPEC_PROTECTION = 2;

const REWARD_ITEM_ARMS = 30001;
const REWARD_ITEM_FURY = 30002;
const REWARD_ITEM_PROTECTION = 30003;

const RewardPlayerBySpec: player_event_on_quest_complete = (event: number, player: Player, quest: Quest, opt: number): void => {
    const activeSpec = player.GetActiveSpec();

    switch (activeSpec) {
        case WARRIOR_SPEC_ARMS:
            player.AddItem(REWARD_ITEM_ARMS, 1);
            break;
        case WARRIOR_SPEC_FURY:
            player.AddItem(REWARD_ITEM_FURY, 1);
            break;
        case WARRIOR_SPEC_PROTECTION:
            player.AddItem(REWARD_ITEM_PROTECTION, 1);
            break;
        default:
            // Default reward for other classes or unknown specs
            player.AddItem(REWARD_ITEM_ARMS, 1);
            break;
    }

    player.SendBroadcastMessage("You have been rewarded based on your active specialization!");
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => RewardPlayerBySpec(...args));
```

In this example, when a player completes a quest, the `RewardPlayerBySpec` function is called. It retrieves the player's active specialization using `player.GetActiveSpec()`. Based on the active spec, the player is rewarded with a specific item using `player.AddItem()`. The reward items are defined as constants (`REWARD_ITEM_ARMS`, `REWARD_ITEM_FURY`, `REWARD_ITEM_PROTECTION`) and correspond to different item entry IDs.

If the player is a Warrior, they will receive a different reward item based on their active spec (Arms, Fury, or Protection). For other classes or unknown specs, a default reward item is given.

Finally, a broadcast message is sent to the player using `player.SendBroadcastMessage()` to inform them that they have been rewarded based on their active specialization.

This example showcases how `GetActiveSpec()` can be used to customize rewards or actions based on a player's active specialization, providing a more tailored experience for different specs within a class.

## GetArenaPoints
Retrieves the current amount of Arena Points the player has accumulated through Arena PvP matches.

### Parameters
This method does not take any parameters.

### Returns
- `number` - The amount of Arena Points the player currently possesses.

### Example Usage
In this example, we will create a script that rewards players with bonus gold and items based on the amount of Arena Points they have accumulated. The script will be triggered when a player talks to an NPC.

```typescript
const ARENA_POINTS_THRESHOLD = 1000;
const BONUS_GOLD_AMOUNT = 100;
const BONUS_ITEM_ENTRY = 12345;
const BONUS_ITEM_COUNT = 5;

const OnGossipHello: npc_event_on_gossip_hello = (event: number, player: Player, object: WorldObject) => {
    const arenaPoints = player.GetArenaPoints();

    if (arenaPoints >= ARENA_POINTS_THRESHOLD) {
        player.ModifyMoney(BONUS_GOLD_AMOUNT * 10000); // Convert copper to gold
        player.SendNotification(`You have been rewarded with ${BONUS_GOLD_AMOUNT} gold for your Arena achievements!`);

        const item = player.AddItem(BONUS_ITEM_ENTRY, BONUS_ITEM_COUNT);
        if (item) {
            player.SendNotification(`You have also received ${BONUS_ITEM_COUNT}x [${item.GetName()}] as a bonus reward!`);
        } else {
            player.SendNotification("Your inventory is full. Please make room and talk to me again to claim your item reward.");
        }
    } else {
        player.SendNotification(`You need at least ${ARENA_POINTS_THRESHOLD} Arena Points to claim the bonus rewards. Keep up the good fight!`);
    }

    player.GossipComplete();
};

RegisterNpcEvent(NPC_ENTRY, NpcEvents.GOSSIP_HELLO, (...args) => OnGossipHello(...args));
```

In this script:
1. We define constants for the Arena Points threshold, bonus gold amount, bonus item entry, and bonus item count.
2. When a player interacts with the NPC (triggering the `GOSSIP_HELLO` event), we retrieve the player's current Arena Points using `player.GetArenaPoints()`.
3. If the player's Arena Points are greater than or equal to the defined threshold:
   - We reward the player with bonus gold using `player.ModifyMoney()` and send a notification.
   - We attempt to add the bonus item(s) to the player's inventory using `player.AddItem()`.
   - If the item(s) are successfully added, we send a notification to the player with the item details.
   - If the player's inventory is full, we send a notification asking them to make room and talk to the NPC again.
4. If the player's Arena Points are below the threshold, we send a notification encouraging them to continue participating in Arena matches.
5. Finally, we complete the gossip interaction with `player.GossipComplete()`.

This script demonstrates how `player.GetArenaPoints()` can be used in combination with other methods to create a more complex and interactive system that rewards players based on their Arena achievements.

## GetBaseSkillValue
Returns the base skill value for a given skill ID. The base skill value represents the player's proficiency in a particular skill without any temporary modifiers or bonuses.

### Parameters
* skill: number - The ID of the skill to retrieve the base value for. Skill IDs can be found in the SkillLine.dbc file.

### Returns
* number - The base skill value for the specified skill ID.

### Example Usage
```typescript
const SKILL_HERBALISM = 182;
const SKILL_ALCHEMY = 171;

const CheckProfessions: player_event_on_login = (event: number, player: Player) => {
    const herbalismSkill = player.GetBaseSkillValue(SKILL_HERBALISM);
    const alchemySkill = player.GetBaseSkillValue(SKILL_ALCHEMY);

    if (herbalismSkill >= 300 && alchemySkill >= 300) {
        // Player has both Herbalism and Alchemy skills at or above 300
        player.SendBroadcastMessage("You are a master of Herbalism and Alchemy!");

        // Reward the player with a special potion recipe
        const RECIPE_FLASK_OF_ENHANCED_INTELLECT = 22566;
        player.AddItem(RECIPE_FLASK_OF_ENHANCED_INTELLECT, 1);
    } else if (herbalismSkill >= 300) {
        // Player has Herbalism skill at or above 300
        player.SendBroadcastMessage("You are a master of Herbalism!");

        // Reward the player with a rare herb
        const HERB_GOLDEN_SANSAM = 13464;
        player.AddItem(HERB_GOLDEN_SANSAM, 5);
    } else if (alchemySkill >= 300) {
        // Player has Alchemy skill at or above 300
        player.SendBroadcastMessage("You are a master of Alchemy!");

        // Reward the player with a special potion
        const POTION_FLASK_OF_CHROMATIC_RESISTANCE = 13513;
        player.AddItem(POTION_FLASK_OF_CHROMATIC_RESISTANCE, 3);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => CheckProfessions(...args));
```
In this example, when a player logs in, their Herbalism and Alchemy skill levels are checked using the `GetBaseSkillValue` method. If the player has both skills at or above 300, they are considered a master of both professions and are rewarded with a special potion recipe. If they have only one of the skills at or above 300, they receive a corresponding reward based on their mastery in that profession.

This script demonstrates how the `GetBaseSkillValue` method can be used to retrieve the player's base skill levels and make decisions or grant rewards based on their proficiency in various skills.

## GetBattlegroundId
Returns the current battleground instance id the player is in. If the player is not in a battleground the value will be 0. 

### Parameters
This method does not have any parameters

### Returns
number - The current [BattleGround](./BattleGround.md) ID or 0 if not in a battleground.

### Example Usage:
Log to chat channel the player's current battleground
```typescript
const CHAT_MSG_ADDON = 0xFFFFFFFF;

function OnChat(event: OnChatEvent, player: Player, message: string, type: ChatMsg): void {
    // Check if the message is from a logged in player
    if (type == ChatMsg.CHAT_MSG_SYSTEM) {
        return;
    }

    if(message === '!bg') {
        const bgId = player.GetBattlegroundId(); 
        if(bgId === 0) {
            player.SendBroadcastMessage('You are currently not in a battleground');
        } else {
            const bgName = GetBattlegroundName(bgId);
            player.SendBroadcastMessage(`You are currently in Battleground: ${bgName} (${bgId})`);
        }
    }
}

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_CHAT, OnChat);
```
Create a timed loot bonus event for players in a BattleGround
```typescript
const BG_CHANCE = 25; // 25% chance to reward bonus loot 
const BG_ITEM_ENTRY_BONUS = 29434;  // Badge of Justice

function OnLootItem(event: PlayerEvents, player: Player, item: Item, count: number) {
    if(player.GetBattlegroundId() > 0) {
        // Player is in a battleground
        if(MathRand(1,100) <= BG_CHANCE) {
            // Award bonus loot
            player.SendBroadcastMessage(`You have won a BONUS ${GetItemLink(BG_ITEM_ENTRY_BONUS)}`);
            player.AddItem(BG_ITEM_ENTRY_BONUS); 
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, OnLootItem);
```

## GetBattlegroundTypeId
Returns the current battleground type ID for the player. This can be used to determine which battleground the player is currently in.

### Parameters
None

### Returns
BattleGroundTypeId: [BattleGroundTypeId](./constants.md#battlegroundtypeid) - The current battleground type ID.

### Example Usage
Reward players with bonus honor when they win a specific battleground.
```typescript
const BG_AV_ID = BattleGroundTypeId.BATTLEGROUND_AV;
const BG_BONUS_HONOR = 100;

const OnBattlegroundEnd: player_event_on_battleground_end = (event: number, player: Player, bgId: number, bgInstanceId: number, team: number, winner: number, duration: number) => {
    const playerTeam = player.GetTeam();
    const playerBGId = player.GetBattlegroundTypeId();

    if (playerBGId === BG_AV_ID && winner === playerTeam) {
        const honorBeforeBonus = player.GetHonorPoints();
        player.ModifyHonorPoints(BG_BONUS_HONOR);
        const honorAfterBonus = player.GetHonorPoints();

        player.SendBroadcastMessage(`Congratulations on winning Alterac Valley! You have been awarded ${BG_BONUS_HONOR} bonus honor!`);
        player.SendBroadcastMessage(`Your honor has increased from ${honorBeforeBonus} to ${honorAfterBonus}.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BATTLEGROUND_END, (...args) => OnBattlegroundEnd(...args));
```

In this example, when a player wins a battleground, the script checks if the battleground was Alterac Valley using `GetBattlegroundTypeId()`. If it was, the player is awarded bonus honor points using `ModifyHonorPoints()`. The script also sends the player messages using `SendBroadcastMessage()` to inform them of the bonus honor and their updated total honor points, which are obtained using `GetHonorPoints()` before and after the bonus is applied.

## GetChampioningFaction
Returns the faction ID the player is currently championing. This is used in Wrath of the Lich King for the Argent Tournament quests and rewards.

### Parameters
None

### Returns
factionId: number - The faction ID the player is currently championing, or 0 if not championing any faction.

### Example Usage
This example listens for the PLAYER_EVENT_ON_QUEST_ABANDON event and checks if the player is abandoning a quest from their championing faction. If so, it removes the championing flag and sends a message to the player.

```typescript
const ARGENT_TOURNAMENT_FACTION_ID = 1106;

const onQuestAbandon: player_event_on_quest_abandon = (event: number, player: Player, quest: Quest) => {
    const championingFaction = player.GetChampioningFaction();

    if (championingFaction === ARGENT_TOURNAMENT_FACTION_ID) {
        const questTemplate = quest.GetQuestTemplate();

        if (questTemplate && questTemplate.GetQuestFactionGroup() === championingFaction) {
            player.SetChampioningFaction(0);
            player.SendBroadcastMessage("You have abandoned a quest from your championing faction. Your championing status has been removed.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_ABANDON, (...args) => onQuestAbandon(...args));
```

In this example:
1. We define the constant `ARGENT_TOURNAMENT_FACTION_ID` with the value 1106, which represents the faction ID for the Argent Tournament.
2. We create a function `onQuestAbandon` that listens for the `PLAYER_EVENT_ON_QUEST_ABANDON` event.
3. Inside the function, we get the player's current championing faction using `player.GetChampioningFaction()`.
4. We check if the player is championing the Argent Tournament faction by comparing the returned faction ID with `ARGENT_TOURNAMENT_FACTION_ID`.
5. If the player is championing the Argent Tournament faction, we get the quest template using `quest.GetQuestTemplate()`.
6. We check if the quest template exists and if its faction group matches the player's championing faction.
7. If the conditions are met, we remove the player's championing status by calling `player.SetChampioningFaction(0)`.
8. Finally, we send a broadcast message to the player informing them that their championing status has been removed.

This example demonstrates how to use the `GetChampioningFaction` method to retrieve the player's current championing faction and take appropriate actions based on that information.

## GetChatTag
Returns the active GM chat tag for the player. GM chat tags are used to identify the rank or role of a GM in chat messages.

### Parameters
This method does not take any parameters.

### Returns
chat_tag: number - The active GM chat tag for the player.

### Example Usage
This example demonstrates how to retrieve a player's GM chat tag and use it to determine their GM rank. It then applies a buff to the player based on their rank.

```typescript
const GMRankHandler: player_event_on_login = (event: number, player: Player) => {
    const GM_CHAT_TAG_JUNIOR = 1;
    const GM_CHAT_TAG_SENIOR = 2;
    const GM_CHAT_TAG_LEAD = 3;

    const BUFF_JUNIOR_GM = 12345;
    const BUFF_SENIOR_GM = 23456;
    const BUFF_LEAD_GM = 34567;

    const chatTag = player.GetChatTag();

    switch (chatTag) {
        case GM_CHAT_TAG_JUNIOR:
            player.AddAura(BUFF_JUNIOR_GM, player);
            player.SendBroadcastMessage("Welcome, Junior GM! Your buff has been applied.");
            break;
        case GM_CHAT_TAG_SENIOR:
            player.AddAura(BUFF_SENIOR_GM, player);
            player.SendBroadcastMessage("Welcome, Senior GM! Your buff has been applied.");
            break;
        case GM_CHAT_TAG_LEAD:
            player.AddAura(BUFF_LEAD_GM, player);
            player.SendBroadcastMessage("Welcome, Lead GM! Your buff has been applied.");
            break;
        default:
            player.SendBroadcastMessage("Welcome, player! You do not have any GM privileges.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => GMRankHandler(...args));
```

In this example:
1. We define constants for the different GM chat tags and their corresponding buff IDs.
2. When a player logs in, we retrieve their GM chat tag using `player.GetChatTag()`.
3. We use a switch statement to determine the player's GM rank based on their chat tag.
4. Depending on the GM rank, we apply the appropriate buff to the player using `player.AddAura()`.
5. We send a personalized welcome message to the player using `player.SendBroadcastMessage()`, informing them of their GM rank and the applied buff.
6. If the player does not have any GM privileges (i.e., their chat tag doesn't match any of the defined constants), we send a generic welcome message.

This example showcases how the `GetChatTag()` method can be used to differentiate between players with different GM ranks and provide them with specific buffs or privileges based on their rank.

## GetCoinage
Returns the amount of money the player has in copper. Copper is the lowest denomination of currency in World of Warcraft. There are 100 copper in a silver, and 100 silver in a gold.

### Parameters
None

### Returns
coinage: number - The amount of money the player has in copper.

### Example Usage:
This example charges a player 1 gold when they die, and sends them a message with how much money they have left.
```typescript
const DEATH_COST = 10000; // 100 copper = 1 silver, 100 silver = 1 gold

const onPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    const playerMoney = player.GetCoinage();
    
    if (playerMoney >= DEATH_COST) {
        player.ModifyMoney(-DEATH_COST);
        player.SendBroadcastMessage(`You have paid ${DEATH_COST / 100} silver to recover from death. You now have ${(playerMoney - DEATH_COST) / 10000} gold remaining.`);
    } else {
        player.SendBroadcastMessage(`You do not have enough money to pay the death cost. You need ${(DEATH_COST - playerMoney) / 100} more silver.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => onPlayerDeath(...args));
```

Another example could be a script that rewards players with bonus money for killing a certain number of creatures:
```typescript
const KILL_COUNT_GOAL = 100;
const BONUS_MONEY = 50000; // 5 gold

let playerKillCounts: { [playerGuid: number]: number } = {};

const onCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const playerGuid = player.GetGUIDLow();
    
    if (!(playerGuid in playerKillCounts)) {
        playerKillCounts[playerGuid] = 0;
    }
    
    playerKillCounts[playerGuid]++;
    
    if (playerKillCounts[playerGuid] == KILL_COUNT_GOAL) {
        player.ModifyMoney(BONUS_MONEY);
        player.SendBroadcastMessage(`Congratulations! You have killed ${KILL_COUNT_GOAL} creatures and earned a bonus of ${BONUS_MONEY / 10000} gold!`);
        playerKillCounts[playerGuid] = 0;
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => onCreatureKill(...args));
```

## GetComboPoints
Returns the current number of combo points the player has on their target.

### Parameters
None

### Returns
* number - The current number of combo points the player has on their target.

### Example Usage
This example demonstrates how to retrieve the player's current combo points and use them to determine the damage of a custom spell.

```typescript
const CUSTOM_SPELL_ID = 123456;
const COMBO_POINT_DAMAGE_MODIFIER = 0.2;

const CustomSpellDamageCalculator: SpellCastFn = (event: number, caster: WorldObject, target: WorldObject, spell: number): boolean => {
    if (spell === CUSTOM_SPELL_ID && caster.IsPlayer()) {
        const player = caster.ToPlayer();
        const comboPoints = player.GetComboPoints();
        const baseDamage = 100;
        const totalDamage = baseDamage * (1 + (comboPoints * COMBO_POINT_DAMAGE_MODIFIER));

        player.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_SYSTEM, 0, `Casting custom spell with ${comboPoints} combo points for ${totalDamage} damage.`);

        target.ToUnit().DealDamage(player, totalDamage, DamageEffectType.DIRECT_DAMAGE, DamageSchoolMask.NORMAL, CUSTOM_SPELL_ID);

        player.ClearComboPoints();

        return false;
    }
    return true;
};

RegisterSpellCastFn(CUSTOM_SPELL_ID, CustomSpellDamageCalculator);
```

In this example:
1. We define a custom spell ID and a combo point damage modifier constant.
2. We create a `CustomSpellDamageCalculator` function that will be called when our custom spell is cast.
3. Inside the function, we check if the spell being cast is our custom spell and if the caster is a player.
4. If the conditions are met, we retrieve the player's current combo points using `GetComboPoints()`.
5. We calculate the total damage based on a base damage value and the number of combo points, using our damage modifier.
6. We send a message to the player informing them of the number of combo points used and the total damage dealt.
7. We deal the calculated damage to the target using `DealDamage()`.
8. We clear the player's combo points using `ClearComboPoints()` to consume them.
9. Finally, we register our `CustomSpellDamageCalculator` function to be called whenever our custom spell is cast using `RegisterSpellCastFn()`.

This example showcases how `GetComboPoints()` can be used in conjunction with other player methods and custom logic to create unique gameplay mechanics in your mod.

## GetComboTarget
Returns the current [Unit](./unit.md) that the player has combo points on. This is useful for abilities or effects that consume or modify combo points.

### Parameters
None

### Returns
[Unit](./unit.md) - The unit that the player has combo points on. If no combo points are active, this will return `nil`.

### Example Usage
In this example, we'll create a script that allows a rogue player to use a custom ability that consumes all combo points on their current target to deal bonus damage. If no combo points are active, the ability will have no effect.

```typescript
const CUSTOM_ABILITY_ENTRY = 12345;
const COMBO_POINT_DAMAGE_BONUS = 50;

const CustomAbility: player_event_on_cast_spell = (event: number, player: Player, spell: number, skipCheck: boolean) => {
    // Check if the spell cast is our custom ability
    if (spell == CUSTOM_ABILITY_ENTRY) {
        const comboTarget = player.GetComboTarget();

        // If a combo target exists, consume combo points and deal bonus damage
        if (comboTarget) {
            const comboPoints = player.GetComboPoints();
            const bonusDamage = comboPoints * COMBO_POINT_DAMAGE_BONUS;

            player.ClearComboPoints();
            player.DealDamage(comboTarget, bonusDamage, true);

            player.SendAreaTriggerMessage(`You consume ${comboPoints} combo points to deal ${bonusDamage} bonus damage!`);
        } else {
            player.SendAreaTriggerMessage("No combo points active. Custom ability has no effect.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => CustomAbility(...args));
```

In this script:

1. We define constants for our custom ability's entry ID and the damage bonus per combo point.
2. In the `CustomAbility` function, we check if the spell being cast matches our custom ability entry.
3. If it does, we use `GetComboTarget()` to retrieve the current combo target.
4. If a combo target exists, we:
   - Get the current number of combo points using `GetComboPoints()`.
   - Calculate the bonus damage based on the number of combo points.
   - Clear the combo points using `ClearComboPoints()`.
   - Deal the bonus damage to the combo target using `DealDamage()`.
   - Send a message to the player indicating the number of combo points consumed and bonus damage dealt.
5. If no combo target exists, we send a message to the player indicating that the custom ability has no effect.

This script demonstrates how `GetComboTarget()` can be used in conjunction with other methods to create custom abilities or effects that interact with the rogue/druid combo point mechanic.

## GetCompletedQuestCount
Returns the total number of quests that the player has completed across all zones and expansions.

### Parameters
None

### Returns
completedQuestCount: number - The total number of quests completed by the player.

### Example Usage
This example demonstrates how to reward players with bonus gold and experience based on the number of quests they have completed. The script listens for the `PLAYER_EVENT_ON_LEVEL_CHANGE` event and checks if the player's level is divisible by 10. If so, it calculates a bonus reward based on the number of completed quests and grants the player bonus gold and experience.

```typescript
const BONUS_GOLD_PER_QUEST = 10;
const BONUS_EXP_PER_QUEST = 100;

const onPlayerLevelChange: player_event_on_level_change = (event: number, player: Player, oldLevel: number): void => {
    const newLevel = player.GetLevel();

    if (newLevel % 10 === 0) {
        const completedQuestCount = player.GetCompletedQuestCount();
        const bonusGold = completedQuestCount * BONUS_GOLD_PER_QUEST;
        const bonusExp = completedQuestCount * BONUS_EXP_PER_QUEST;

        player.ModifyMoney(bonusGold);
        player.GiveXP(bonusExp, true);

        player.SendNotification(`Congratulations on reaching level ${newLevel}!`);
        player.SendNotification(`As a reward for completing ${completedQuestCount} quests, you have been granted ${bonusGold} bonus gold and ${bonusExp} bonus experience!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => onPlayerLevelChange(...args));
```

In this example:
1. We define constants `BONUS_GOLD_PER_QUEST` and `BONUS_EXP_PER_QUEST` to specify the amount of bonus gold and experience to grant per completed quest.

2. We register a callback function `onPlayerLevelChange` for the `PLAYER_EVENT_ON_LEVEL_CHANGE` event.

3. Inside the callback function, we check if the player's new level is divisible by 10 using the modulo operator (`%`).

4. If the level is divisible by 10, we retrieve the total number of completed quests using `player.GetCompletedQuestCount()`.

5. We calculate the bonus gold and experience by multiplying the number of completed quests by the respective bonus constants.

6. We grant the player the bonus gold using `player.ModifyMoney(bonusGold)` and bonus experience using `player.GiveXP(bonusExp, true)`.

7. Finally, we send notifications to the player informing them about reaching the new level and the bonus rewards they have received.

This script encourages players to complete more quests by rewarding them with bonus gold and experience at significant level milestones. The bonus rewards scale based on the number of quests completed, providing an incentive for players to actively engage in questing throughout their journey.

## GetCorpse
Retrieves the player's corpse object, which represents the player's physical remains upon death.

### Parameters
None

### Returns
corpse: [Corpse](./corpse.md) - The player's corpse object.

### Example Usage
This example demonstrates how to use the `GetCorpse` method to retrieve a player's corpse and perform actions based on its properties.

```typescript
const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    const corpse = player.GetCorpse();

    if (corpse) {
        const x = corpse.GetX();
        const y = corpse.GetY();
        const z = corpse.GetZ();
        const mapId = corpse.GetMapId();

        // Check if the corpse is in a specific area
        if (mapId === 0 && x > 0 && x < 1000 && y > 0 && y < 1000) {
            // Perform actions when the corpse is in the desired area
            player.SendBroadcastMessage("Your corpse is located in a special area!");
            
            // Create a visual effect at the corpse's location
            corpse.SummonGameObject(180647, 0, 0, 0, 0, 300);

            // Set a flag on the player to indicate special handling
            player.SetFlag(PlayerFlags.PLAYER_FLAGS_CUSTOM_FLAG, 1);
        } else {
            // Perform actions when the corpse is not in the desired area
            player.SendBroadcastMessage("Your corpse is not in a special area.");
        }
    } else {
        player.SendBroadcastMessage("No corpse found for the player.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this example, when a player dies, the script retrieves the player's corpse using the `GetCorpse` method. It then checks the corpse's location using the `GetX`, `GetY`, `GetZ`, and `GetMapId` methods to determine if it is within a specific area.

If the corpse is in the desired area, the script sends a broadcast message to the player indicating that their corpse is in a special location. It also summons a visual effect (game object) at the corpse's location using the `SummonGameObject` method and sets a custom flag on the player using the `SetFlag` method for further handling.

If the corpse is not in the desired area, the script sends a different broadcast message to the player.

If no corpse is found for the player, an appropriate message is sent to the player.

This example showcases how the `GetCorpse` method can be used in combination with other methods and game events to create custom behaviors and interactions based on the player's corpse.

## GetDbLocaleIndex
Returns the player's locale index from the database.

### Parameters
None

### Returns
localeIndex: number - The locale index of the player from the database.

### Example Usage
Reward players with different items based on their locale.
```typescript
const LOCALES = {
    enUS: 0,
    koKR: 1,
    frFR: 2,
    deDE: 3,
    zhCN: 4,
    zhTW: 5,
    esES: 6,
    esMX: 7,
    ruRU: 8
};

const LOCALE_REWARDS = {
    [LOCALES.enUS]: 1234,
    [LOCALES.koKR]: 5678,
    [LOCALES.frFR]: 9012,
    [LOCALES.deDE]: 3456,
    [LOCALES.zhCN]: 7890,
    [LOCALES.zhTW]: 2345,
    [LOCALES.esES]: 6789,
    [LOCALES.esMX]: 1234,
    [LOCALES.ruRU]: 5678
};

const RewardPlayerByLocale: player_event_on_login = (event: number, player: Player) => {
    const localeIndex = player.GetDbLocaleIndex();
    const rewardItemEntry = LOCALE_REWARDS[localeIndex];

    if (rewardItemEntry) {
        const rewardItem = player.AddItem(rewardItemEntry, 1);
        if (rewardItem) {
            player.SendBroadcastMessage(`You have been rewarded with ${rewardItem.GetName()} for your locale!`);
        } else {
            player.SendBroadcastMessage("Failed to reward item. Please contact an administrator.");
        }
    } else {
        player.SendBroadcastMessage("No reward found for your locale.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => RewardPlayerByLocale(...args));
```
In this example, we define a mapping of locale indices to reward item entries. When a player logs in, we retrieve their locale index using `GetDbLocaleIndex()` and check if there is a corresponding reward item entry in the `LOCALE_REWARDS` object. If a reward is found, we use the `AddItem()` method to grant the item to the player and send them a broadcast message informing them of the reward. If the item grant fails or if no reward is found for their locale, we send an appropriate message to the player.

This example demonstrates how `GetDbLocaleIndex()` can be used in combination with other player methods and game data to create a locale-based reward system.

## GetDbcLocale
Returns the player's game client locale, which represents the language and region settings configured in the game client.

### Parameters
None

### Returns
[LocaleConstant](./constants.md#localeconstant) - The locale constant corresponding to the player's game client locale.

### Example Usage
Sending a localized welcome message based on the player's client locale:
```typescript
const WELCOME_MESSAGES: Record<LocaleConstant, string> = {
    [LocaleConstant.LOCALE_enUS]: "Welcome to the server, adventurer!",
    [LocaleConstant.LOCALE_esES]: "¡Bienvenido al servidor, aventurero!",
    [LocaleConstant.LOCALE_esMX]: "¡Bienvenido al servidor, aventurero!",
    [LocaleConstant.LOCALE_frFR]: "Bienvenue sur le serveur, aventurier !",
    [LocaleConstant.LOCALE_deDE]: "Willkommen auf dem Server, Abenteurer!",
    [LocaleConstant.LOCALE_itIT]: "Benvenuto nel server, avventuriero!",
    [LocaleConstant.LOCALE_ptBR]: "Bem-vindo ao servidor, aventureiro!",
    [LocaleConstant.LOCALE_ruRU]: "Добро пожаловать на сервер, искатель приключений!",
    [LocaleConstant.LOCALE_zhCN]: "欢迎来到服务器，冒险者！",
    [LocaleConstant.LOCALE_zhTW]: "歡迎來到伺服器，冒險者！",
    [LocaleConstant.LOCALE_koKR]: "서버에 오신 것을 환영합니다, 모험가 님!",
};

const DEFAULT_WELCOME_MESSAGE = "Welcome to the server!";

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const locale = player.GetDbcLocale();
    const welcomeMessage = WELCOME_MESSAGES[locale] || DEFAULT_WELCOME_MESSAGE;

    player.SendBroadcastMessage(welcomeMessage);

    // Apply a localized buff based on the player's locale
    switch (locale) {
        case LocaleConstant.LOCALE_esES:
        case LocaleConstant.LOCALE_esMX:
            player.AddAura(1234, player); // Buff ID for Spanish locales
            break;
        case LocaleConstant.LOCALE_frFR:
            player.AddAura(5678, player); // Buff ID for French locale
            break;
        // Add more cases for other locales as needed
        default:
            player.AddAura(9012, player); // Default buff ID
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```
In this example, the script defines a dictionary (`WELCOME_MESSAGES`) that maps locale constants to localized welcome messages. When a player logs in, the script retrieves the player's game client locale using `GetDbcLocale()` and looks up the corresponding welcome message. If a localized message is found, it is sent to the player using `SendBroadcastMessage()`; otherwise, a default welcome message is used.

Additionally, the script applies a localized buff to the player based on their locale. The buff IDs are specified using a `switch` statement that matches the locale constant. This allows for providing unique buffs or effects tailored to specific locales, enhancing the player's experience based on their language and region settings.

## GetDifficulty
Returns the current difficulty level of the instance (raid or dungeon) the player is in.

### Parameters
* isRaid (optional): boolean - If set to true, it will return the difficulty of the raid instance. If false or not provided, it will return the difficulty of the dungeon instance.

### Returns
* number - The difficulty level of the instance. Possible return values:
  * 0 - Normal
  * 1 - Heroic
  * 2 - Epic
  * 3 - Legendary
  * 4 - Mythic

### Example Usage
Adjust loot based on the difficulty level of the instance.
```typescript
const ITEM_ENTRY_NORMAL = 12345;
const ITEM_ENTRY_HEROIC = 23456;
const ITEM_ENTRY_EPIC = 34567;
const ITEM_ENTRY_LEGENDARY = 45678;
const ITEM_ENTRY_MYTHIC = 56789;

const onCreatureDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    const players = creature.GetPlayersInRange(100);
    
    for (const player of players) {
        const difficulty = player.GetDifficulty(creature.IsWorldBoss());
        
        switch (difficulty) {
            case 0:
                player.AddItem(ITEM_ENTRY_NORMAL, 1);
                break;
            case 1:
                player.AddItem(ITEM_ENTRY_HEROIC, 1);
                break;
            case 2:
                player.AddItem(ITEM_ENTRY_EPIC, 1);
                break;
            case 3:
                player.AddItem(ITEM_ENTRY_LEGENDARY, 1);
                break;
            case 4:
                player.AddItem(ITEM_ENTRY_MYTHIC, 1);
                break;
        }
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => onCreatureDeath(...args));
```
In this example, when a creature dies, it retrieves all players within a range of 100 yards. For each player, it checks the difficulty level of the instance using `GetDifficulty()` method. If the creature is a world boss (`IsWorldBoss()`), it passes `true` to get the raid difficulty, otherwise, it gets the dungeon difficulty.

Based on the difficulty level, it adds a specific item to the player's inventory using `AddItem()` method. The item entry is determined by the predefined constants (`ITEM_ENTRY_NORMAL`, `ITEM_ENTRY_HEROIC`, etc.).

This script allows for adjusting the loot drops based on the difficulty level of the instance, providing appropriate rewards for each difficulty setting.

## GetDrunkValue
Returns the player's current level of intoxication, represented as a numeric value. The intoxication level increases when the player consumes alcoholic beverages and decreases over time. The specific effects of intoxication may vary depending on the level.

### Parameters
This method does not take any parameters.

### Returns
* number - The current intoxication level of the player.

### Example Usage
This example demonstrates how to create a custom alcoholic item that increases the player's intoxication level and applies a bonus to their movement speed based on the intoxication level.

```typescript
const CUSTOM_DRINK_ENTRY = 12345;
const INTOXICATION_INCREASE = 20;
const MOVEMENT_SPEED_BONUS_PER_LEVEL = 5;

const UseCustomDrink: player_event_on_use_item = (event: number, player: Player, item: Item, target: Unit) => {
    if (item.GetEntry() == CUSTOM_DRINK_ENTRY) {
        const currentIntoxication = player.GetDrunkValue();
        const newIntoxication = Math.min(currentIntoxication + INTOXICATION_INCREASE, 100);
        
        player.SetDrunkValue(newIntoxication);
        
        const movementSpeedBonus = (newIntoxication / 10) * MOVEMENT_SPEED_BONUS_PER_LEVEL;
        player.SetSpeed(UnitMoveType.MOVE_RUN, player.GetSpeed(UnitMoveType.MOVE_RUN) * (1 + movementSpeedBonus / 100), true);
        
        player.SendBroadcastMessage(`You feel the warmth of the drink spreading through your body. Your intoxication level is now ${newIntoxication}.`);
        
        if (newIntoxication >= 50) {
            player.SendBroadcastMessage("You start to feel a bit tipsy and your movements become slightly erratic.");
        }
        
        if (newIntoxication >= 80) {
            player.SendBroadcastMessage("The world around you begins to spin and you struggle to maintain your balance.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => UseCustomDrink(...args));
```

In this example:
1. We define constants for the custom drink item entry, the amount of intoxication increase per use, and the movement speed bonus per intoxication level.
2. When the player uses the custom drink item, we retrieve their current intoxication level using `player.GetDrunkValue()`.
3. We calculate the new intoxication level by adding the `INTOXICATION_INCREASE` to the current level, capped at a maximum of 100.
4. We update the player's intoxication level using `player.SetDrunkValue(newIntoxication)`.
5. We calculate the movement speed bonus based on the new intoxication level and apply it to the player's running speed using `player.SetSpeed()`.
6. We send a broadcast message to the player indicating their current intoxication level.
7. Depending on the intoxication level, we send additional broadcast messages to the player to describe the effects of intoxication.

This example showcases how the `GetDrunkValue()` method can be used in combination with other methods to create custom gameplay mechanics related to intoxication.

## GetEquippedItemBySlot
Returns the [Item](./item.md) object equipped in the specified gear slot of the player.

### Parameters
* slot: number - The gear slot to retrieve the item from. Valid gear slots are defined in the InventorySlots enum.

### Returns
[Item](./item.md) - The item equipped in the specified gear slot, or null if no item is equipped in that slot.

### Example Usage
This example demonstrates how to retrieve the item equipped in the player's main hand slot and check if it is a one-handed weapon. If it is, the script equips a shield in the off-hand slot.

```typescript
const MAIN_HAND_SLOT = 15;
const OFF_HAND_SLOT = 16;
const SHIELD_ITEM_ENTRY = 12345;

const equipShield: player_event_on_login = (event: number, player: Player): void => {
    const mainHandItem = player.GetEquippedItemBySlot(MAIN_HAND_SLOT);

    if (mainHandItem) {
        const itemSubClass = mainHandItem.GetSubClass();
        const itemInventoryType = mainHandItem.GetInventoryType();

        // Check if the main hand item is a one-handed weapon
        if (itemSubClass === 0 && (itemInventoryType === 0 || itemInventoryType === 4)) {
            const offHandItem = player.GetEquippedItemBySlot(OFF_HAND_SLOT);

            // Check if the off-hand slot is empty
            if (!offHandItem) {
                // Equip a shield in the off-hand slot
                const shieldItem = player.AddItem(SHIELD_ITEM_ENTRY, 1);

                if (shieldItem) {
                    player.EquipItem(shieldItem, OFF_HAND_SLOT);
                    player.SendBroadcastMessage("A shield has been equipped in your off-hand slot.");
                } else {
                    player.SendBroadcastMessage("Failed to equip a shield in your off-hand slot.");
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => equipShield(...args));
```

In this example, when the player logs in, the script retrieves the item equipped in the main hand slot using `GetEquippedItemBySlot`. It then checks if the item is a one-handed weapon by examining its item subclass and inventory type.

If the main hand item is a one-handed weapon and the off-hand slot is empty, the script adds a shield item to the player's inventory using `AddItem` and equips it in the off-hand slot using `EquipItem`. The player receives a broadcast message indicating the result of the shield equipment attempt.

This script ensures that players with a one-handed weapon in their main hand have a shield equipped in their off-hand slot when they log in, providing additional defense if they meet the specified conditions.

## GetFreeTalentPoints
Returns the number of free talent points the player currently has available to spend.

### Parameters
None

### Returns
- `number` - The number of free talent points the player has.

### Example Usage
This example demonstrates how to check if a player has enough talent points to learn a specific talent and if so, learn that talent.

```typescript
// Talent entries can be found in the TalentEntry.dbc file
const WARRIOR_TALENT_SECOND_WIND = 1838;

const onLevelUp: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    // Get the number of free talent points the player has
    const freeTalentPoints = player.GetFreeTalentPoints();

    // Check if the player is a warrior and has at least 1 free talent point
    if (player.GetClass() == Classes.CLASS_WARRIOR && freeTalentPoints > 0) {
        // Warrior class specific logic
        if (oldLevel < 40 && player.GetLevel() >= 40) {
            // Check if the player already has the Second Wind talent
            if (!player.HasSpell(WARRIOR_TALENT_SECOND_WIND)) {
                // Learn the Second Wind talent
                player.LearnTalent(WARRIOR_TALENT_SECOND_WIND);
                player.SendBroadcastMessage("You have learned the Second Wind talent!");
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => onLevelUp(...args));
```

In this example:
1. We define a constant `WARRIOR_TALENT_SECOND_WIND` with the talent entry for the warrior's Second Wind talent.
2. In the `PLAYER_EVENT_ON_LEVEL_CHANGE` event, we get the number of free talent points the player has using `player.GetFreeTalentPoints()`.
3. We check if the player is a warrior and has at least 1 free talent point.
4. If the player is a warrior and just reached level 40, we check if they already have the Second Wind talent using `player.HasSpell(WARRIOR_TALENT_SECOND_WIND)`.
5. If the player doesn't have the Second Wind talent, we use `player.LearnTalent(WARRIOR_TALENT_SECOND_WIND)` to automatically learn the talent and send a broadcast message to the player informing them that they have learned the talent.

This script ensures that when a warrior player reaches level 40 and has an available talent point, they will automatically learn the Second Wind talent if they haven't already learned it.

You can expand this script to handle other classes and talents based on your specific requirements and the talents available in the TalentEntry.dbc file.

## GetGMRank
Returns the [Player]'s current GM Rank. GM Ranks determine the level of access and permissions a player has to server commands and features.

### Parameters
None

### Returns
rank: number - The current GM Rank of the player.

GM Ranks:
* 0 - Player
* 1 - Moderator
* 2 - Gamemaster
* 3 - Administrator
* 4 - Console

### Example Usage:
Restrict access to a special vendor based on GM Rank.
```typescript
const SPECIAL_VENDOR_ENTRY = 123456;
const GM_RANK_REQUIRED = 3;

const OnGossipHello: gossip_event_on_hello = (event, player, creature) => {
    if (creature.GetEntry() === SPECIAL_VENDOR_ENTRY) {
        if (player.GetGMRank() >= GM_RANK_REQUIRED) {
            // Show special vendor options
            player.GossipMenuAddItem(0, "Access Special Vendor", 1, 1);
            player.GossipSendMenu(1, creature.GetObjectGuid());
        } else {
            // Inform player they do not have access
            player.GossipSetText("Sorry, you do not have permission to access this vendor.");
            player.GossipSendMenu(1, creature.GetObjectGuid());
        }
    }
};

const OnGossipSelect: gossip_event_on_select = (event, player, creature, sender, action) => {
    if (creature.GetEntry() === SPECIAL_VENDOR_ENTRY && action === 1) {
        // Send special vendor window
        player.SendListInventory(creature.GetObjectGuid());
    }
    player.GossipComplete();
};

RegisterCreatureGossipEvent(SPECIAL_VENDOR_ENTRY, 1, OnGossipHello);
RegisterCreatureGossipEvent(SPECIAL_VENDOR_ENTRY, 2, OnGossipSelect);
```
In this example, when a player interacts with the special vendor (defined by `SPECIAL_VENDOR_ENTRY`), their GM Rank is checked using `GetGMRank()`. If their rank is equal to or higher than the required rank (`GM_RANK_REQUIRED`), they are presented with the option to access the special vendor. Otherwise, they are informed that they do not have permission.

When the player selects the special vendor option, the `OnGossipSelect` event is triggered, and the special vendor window is sent to the player using `SendListInventory()`.

This script ensures that only players with the appropriate GM Rank can access the special vendor, providing an extra layer of control and security for server administrators.

## GetGossipTextId
Returns the gossip text ID from the database that corresponds to the WorldObject's gossip header text for the specific Player. This is useful when creating gossip menus that may change based on certain conditions.

### Parameters
None

### Returns
textId: number - The ID of the gossip text from the `npc_text` table in the world database.

### Example Usage
In this example, we create a gossip menu for a quest giver NPC that has different text depending on whether the player has completed a certain quest or not.

```typescript
const QUEST_ENTRY = 1234;
const NPC_TEXT_ID_INCOMPLETE = 100;
const NPC_TEXT_ID_COMPLETE = 101;

const onGossipHello: npc_event_on_gossip_hello = (event: number, player: Player, object: WorldObject) => {
    // Check if the player has completed the quest
    if (player.HasQuest(QUEST_ENTRY) && player.GetQuestStatus(QUEST_ENTRY) === QuestStatus.QUEST_STATUS_COMPLETE) {
        // Set the gossip header text to the "complete" version
        object.SetGossipMenuId(NPC_TEXT_ID_COMPLETE);
    } else {
        // Set the gossip header text to the "incomplete" version
        object.SetGossipMenuId(NPC_TEXT_ID_INCOMPLETE);
    }

    // Send the gossip menu to the player
    player.GossipSendMenu(player.GetGossipTextId(), object.GetGUID());
};

const onGossipSelect: npc_event_on_gossip_select = (event: number, player: Player, object: WorldObject, sender: number, action: number) => {
    // Handle gossip option selection here
    // ...

    // Close the gossip menu
    player.GossipComplete();
};

RegisterNpcEvent(NPC_ENTRY, NpcEvents.NPC_EVENT_ON_GOSSIP_HELLO, (...args) => onGossipHello(...args));
RegisterNpcEvent(NPC_ENTRY, NpcEvents.NPC_EVENT_ON_GOSSIP_SELECT, (...args) => onGossipSelect(...args));
```

In this script, we first register the `onGossipHello` function to handle the event when a player opens the gossip menu for the NPC. Inside the function, we check if the player has completed the quest with the entry `QUEST_ENTRY`. If they have, we set the gossip header text to the "complete" version using `SetGossipMenuId(NPC_TEXT_ID_COMPLETE)`, otherwise we set it to the "incomplete" version.

We then send the gossip menu to the player using `player.GossipSendMenu()`, passing in the gossip text ID obtained from `player.GetGossipTextId()` and the GUID of the WorldObject.

Finally, we register the `onGossipSelect` function to handle the event when the player selects a gossip option. After handling the selected option, we close the gossip menu using `player.GossipComplete()`.

This example demonstrates how `GetGossipTextId()` can be used in conjunction with other methods like `SetGossipMenuId()` and `GossipSendMenu()` to create dynamic gossip menus that change based on the player's quest progress or other conditions.

## GetGroup
Returns the player's current group. If the player is not in a group, this method will return `null`.

### Parameters
None

### Returns
group: [Group](./group.md) - The player's current group, or `null` if not in a group.

### Example Usage
This example demonstrates how to check if a player is in a group and perform actions based on their group membership.

```typescript
const EMBLEM_OF_VALOR_ENTRY = 40752;
const EMBLEM_OF_HEROISM_ENTRY = 40753;
const EMBLEM_OF_CONQUEST_ENTRY = 45624;

const CheckGroupStatus: player_event_on_login = (event: number, player: Player) => {
    const group = player.GetGroup();

    if (group) {
        const groupMembers = group.GetMembers();
        const groupSize = groupMembers.length;

        switch (groupSize) {
            case 5:
                // Full group, reward Emblem of Conquest
                player.AddItem(EMBLEM_OF_CONQUEST_ENTRY, 1);
                break;
            case 3:
            case 4:
                // Partial group, reward Emblem of Valor
                player.AddItem(EMBLEM_OF_VALOR_ENTRY, 1);
                break;
            default:
                // Solo or duo, reward Emblem of Heroism
                player.AddItem(EMBLEM_OF_HEROISM_ENTRY, 1);
                break;
        }

        player.SendBroadcastMessage("You have been rewarded based on your group size.");
    } else {
        // Player is not in a group
        player.SendBroadcastMessage("You are not currently in a group. Join a group for additional rewards!");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => CheckGroupStatus(...args));
```

In this example, when a player logs in, the script checks if they are in a group using the `GetGroup()` method. If the player is in a group, it retrieves the group members and group size using the `GetMembers()` method on the returned `Group` object.

Based on the group size, the script rewards the player with different emblems:
- If the group has 5 members (full group), the player receives an Emblem of Conquest.
- If the group has 3 or 4 members (partial group), the player receives an Emblem of Valor.
- If the player is solo or in a duo, they receive an Emblem of Heroism.

The player is then sent a broadcast message informing them of the reward based on their group size.

If the player is not in a group, they receive a message encouraging them to join a group for additional rewards.

This example showcases how to use the `GetGroup()` method to retrieve the player's group and perform actions based on the group size and membership status.

## GetGroupInvite
Returns the [Group](./group.md) invitation for the player. If the player does not have a pending group invitation, this method will return `null`.

### Parameters
This method does not take any parameters.

### Returns
group: [Group](./group.md) | null - The group invitation for the player, or `null` if the player does not have a pending group invitation.

### Example Usage
This example demonstrates how to check if a player has a pending group invitation and, if so, automatically accept the invitation if the group leader is on the player's friends list.

```typescript
const GROUP_INVITE_INTERVAL = 1000; // Check for group invites every 1 second

const CheckGroupInvite = (player: Player) => {
    const invite = player.GetGroupInvite();

    if (invite !== null) {
        const leader = invite.GetLeader();

        if (leader !== null && player.HasFriend(leader.GetGUIDLow())) {
            player.AcceptGroupInvite();
            player.SendBroadcastMessage("Automatically accepted group invitation from friend.");
        }
    }
}

const AutoAcceptGroupInvite: player_event_on_update = (event: number, player: Player) => {
    if (player.GetMapId() === 0 && !player.IsInGroup()) {
        CheckGroupInvite(player);
    }
}

const AutoAcceptGroupInviteRegister: player_event_on_login = (event, player) => {
    player.RegisterEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, AutoAcceptGroupInvite, GROUP_INVITE_INTERVAL);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => AutoAcceptGroupInviteRegister(...args));
```

In this example:
1. The `CheckGroupInvite` function is defined to check if the player has a pending group invitation. If an invitation exists, it checks if the group leader is on the player's friends list using the `HasFriend` method. If the leader is a friend, the invitation is automatically accepted using `AcceptGroupInvite`, and a message is sent to the player.

2. The `AutoAcceptGroupInvite` function is registered as an `PLAYER_EVENT_ON_UPDATE` event handler. It checks if the player is in the world (map ID 0) and not already in a group before calling the `CheckGroupInvite` function.

3. The `AutoAcceptGroupInviteRegister` function is registered as a `PLAYER_EVENT_ON_LOGIN` event handler. It registers the `AutoAcceptGroupInvite` function to be called every `GROUP_INVITE_INTERVAL` milliseconds (1 second in this example).

This script ensures that the player's pending group invitations are checked periodically, and if an invitation is from a friend, it is automatically accepted.

## GetGuild
Returns the player's guild object, which contains information about the guild the player belongs to.

### Parameters
None

### Returns
guild: [Guild](./guild.md) - The player's guild object

### Example Usage
This example demonstrates how to retrieve a player's guild information and send a message to the guild channel.

```typescript
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const guild = player.GetGuild();

    if (guild) {
        const guildName = guild.GetName();
        const guildMembers = guild.GetMembers();
        const guildMemberCount = guildMembers.length;

        let onlineMembers = 0;
        for (const member of guildMembers) {
            if (member.IsOnline()) {
                onlineMembers++;
            }
        }

        const message = `Welcome back to ${guildName}! There are currently ${onlineMembers} out of ${guildMemberCount} members online.`;
        guild.SendPacket(message);

        // Add a custom guild log entry
        const logEntry = `[${player.GetName()}] logged in.`;
        guild.AddGuildEventLogEntry(GuildEventLogTypes.GUILD_EVENT_LOG_LOGIN, player.GetGUID(), logEntry);
    } else {
        player.SendBroadcastMessage("You are not currently a member of any guild.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example:
1. When a player logs in, the `OnLogin` event is triggered.
2. We retrieve the player's guild object using `player.GetGuild()`.
3. If the player belongs to a guild:
   - We retrieve the guild name using `guild.GetName()`.
   - We retrieve the list of guild members using `guild.GetMembers()`.
   - We count the total number of guild members.
   - We iterate over the guild members and count the number of online members.
   - We construct a welcome message including the guild name and the count of online members.
   - We send the welcome message to the guild channel using `guild.SendPacket()`.
   - We add a custom guild log entry using `guild.AddGuildEventLogEntry()` to record the player's login event.
4. If the player doesn't belong to a guild, we send them a message indicating that they are not currently a member of any guild.

This example showcases how to retrieve a player's guild information, access guild properties, iterate over guild members, send messages to the guild channel, and add custom guild log entries.

## GetGuildId
Retrieves the current guild ID of the player. This method will return 0 if the player is not currently in a guild.

### Parameters
None

### Returns
guildId: number - The guild ID of the player's current guild. Returns 0 if the player is not in a guild.

### Example Usage:
Announce when a player from a specific guild logs in, and grant them a special item if they are the guild master.

```typescript
const GUILD_ID_TO_CHECK = 42; // Replace with the desired guild ID
const SPECIAL_ITEM_ENTRY = 12345; // Replace with the desired item entry

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const playerGuildId = player.GetGuildId();

    if (playerGuildId === GUILD_ID_TO_CHECK) {
        // Announce the player's login
        SendWorldMessage(`A member of the guild with ID ${GUILD_ID_TO_CHECK} has logged in: ${player.GetName()}`);

        // Check if the player is the guild master
        const guild = player.GetGuild();
        if (guild) {
            const guildLeaderGUID = guild.GetLeaderGUID();
            if (player.GetGUID() === guildLeaderGUID) {
                // Grant the special item to the guild master
                const specialItem = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
                if (specialItem) {
                    player.SendBroadcastMessage("As the guild master, you have received a special item!");
                } else {
                    player.SendBroadcastMessage("Failed to add the special item to your inventory.");
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. We define the desired guild ID (`GUILD_ID_TO_CHECK`) and the special item entry (`SPECIAL_ITEM_ENTRY`) that we want to grant to the guild master.
2. In the `OnLogin` event handler, we retrieve the player's current guild ID using `player.GetGuildId()`.
3. If the player's guild ID matches the desired guild ID, we announce their login to the world using `SendWorldMessage()`.
4. We then check if the player is the guild master by retrieving the guild object using `player.GetGuild()` and comparing the player's GUID with the guild leader's GUID.
5. If the player is the guild master, we attempt to add the special item to their inventory using `player.AddItem()`.
6. We send a broadcast message to the player indicating whether the item was successfully added or not.
7. Finally, we register the `OnLogin` event handler using `RegisterPlayerEvent()` to execute the script when a player logs in.

This example demonstrates how to use the `GetGuildId()` method to check a player's guild membership and perform actions based on their guild affiliation, such as granting special items or announcing their presence.

## GetGuildName
Returns the name of the player's current guild as a string.

### Parameters
None

### Returns
string - The name of the player's current guild, or an empty string if the player is not in a guild.

### Example Usage
This example demonstrates how to retrieve a player's guild name and use it to display a custom message when they enter the world.

```typescript
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const guildName = player.GetGuildName();

    if (guildName !== "") {
        // Player is in a guild
        const message = `Welcome back to the guild, ${player.GetName()}! Your guild, ${guildName}, is happy to have you.`;
        player.SendBroadcastMessage(message);

        // Log the player's return to the guild
        const logMessage = `[Guild Log] ${player.GetName()} has logged in as a member of ${guildName}.`;
        console.log(logMessage);

        // Check if the player has the "Guild Master" rank
        if (player.GetGuildRank() === 0) {
            // Send a special message to the guild master
            const gmMessage = "As the Guild Master, you have access to additional commands and features. Use them wisely!";
            player.SendBroadcastMessage(gmMessage);
        }
    } else {
        // Player is not in a guild
        const message = `Welcome back, ${player.GetName()}! You are not currently a member of any guild.`;
        player.SendBroadcastMessage(message);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. When a player logs in, their guild name is retrieved using `player.GetGuildName()`.
2. If the player is in a guild (i.e., `guildName` is not an empty string):
   - A custom welcome message is sent to the player using `player.SendBroadcastMessage()`, including their name and guild name.
   - A log message is generated and logged to the console, indicating the player's return to the guild.
   - If the player has the "Guild Master" rank (rank 0), an additional special message is sent to them.
3. If the player is not in a guild, a different welcome message is sent, informing them that they are not currently a member of any guild.

This example showcases how to retrieve a player's guild name, use it in custom messages, perform logging, and handle different scenarios based on the player's guild membership and rank.

## GetGuildRank
Returns the player's current guild rank as a number. Guild ranks are defined in the `guild_rank` table in the characters database. The rank value corresponds to the `rid` column in the table.

### Parameters
None

### Returns
* number - The player's current guild rank. Returns 0 if the player is not in a guild.

### Example Usage
This example script grants a bonus to players with a specific guild rank when they turn in a quest.

```typescript
const QUEST_ENTRY = 1234; // Replace with the desired quest entry
const GUILD_RANK_REQUIRED = 2; // Replace with the required guild rank
const BONUS_GOLD = 100; // Replace with the desired bonus gold amount

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number) => {
    if (quest === QUEST_ENTRY) {
        const guildRank = player.GetGuildRank();
        
        if (guildRank === GUILD_RANK_REQUIRED) {
            const bonusGold = player.GetCoinage() + BONUS_GOLD * 10000; // Convert bonus gold to copper
            player.SetCoinage(bonusGold);
            
            player.SendBroadcastMessage(`You have been awarded a bonus of ${BONUS_GOLD} gold for your guild rank!`);
        }
        
        // Additional quest completion logic...
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example:
1. We define constants for the desired quest entry (`QUEST_ENTRY`), the required guild rank (`GUILD_RANK_REQUIRED`), and the bonus gold amount (`BONUS_GOLD`).
2. When a player completes a quest, the `OnQuestComplete` event is triggered.
3. Inside the event handler, we check if the completed quest matches the desired quest entry.
4. If the quest matches, we retrieve the player's current guild rank using `player.GetGuildRank()`.
5. If the player's guild rank matches the required rank (`GUILD_RANK_REQUIRED`), we proceed to award the bonus.
6. We calculate the bonus gold amount by converting the `BONUS_GOLD` value to copper (multiplying by 10000) and adding it to the player's current coinage using `player.GetCoinage()`.
7. We update the player's coinage with the new bonus amount using `player.SetCoinage()`.
8. Finally, we send a broadcast message to the player informing them about the bonus gold they received for their guild rank.

This script demonstrates how to use the `GetGuildRank()` method to retrieve the player's guild rank and perform specific actions based on that rank. You can customize the script by modifying the constants and adding additional logic as needed.

## GetHealthBonusFromStamina
Returns the bonus health the player receives from their total stamina attribute.

### Parameters
None

### Returns
healthBonus: number - The amount of bonus health from stamina

### Example Usage:
Display bonus health in chat from stamina when a player enters the world, and compare it to another player that just leveled up.
```typescript
const PLAYER_NAME_TO_WATCH = "PlayerName";

let healthBonusInitial = 0;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.GetName() === PLAYER_NAME_TO_WATCH) {
        healthBonusInitial = player.GetHealthBonusFromStamina();
        player.SendBroadcastMessage(`Initial health bonus from stamina: ${healthBonusInitial}`);
    }
};

const OnLevelChanged: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    if (player.GetName() === PLAYER_NAME_TO_WATCH) {
        const healthBonusCurrent = player.GetHealthBonusFromStamina();
        const healthBonusDifference = healthBonusCurrent - healthBonusInitial;
        player.SendBroadcastMessage(`Health bonus from stamina at level ${player.GetLevel()}: ${healthBonusCurrent}`);
        player.SendBroadcastMessage(`Health bonus difference from level ${oldLevel} to ${player.GetLevel()}: ${healthBonusDifference}`);
        healthBonusInitial = healthBonusCurrent;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => OnLevelChanged(...args));
```
In this example:
1. We define a constant `PLAYER_NAME_TO_WATCH` to specify the player we want to monitor.
2. We initialize a variable `healthBonusInitial` to store the initial health bonus from stamina.
3. In the `OnLogin` event, we check if the logged-in player's name matches `PLAYER_NAME_TO_WATCH`.
   - If it does, we calculate the initial health bonus using `GetHealthBonusFromStamina()` and store it in `healthBonusInitial`.
   - We send a broadcast message to the player displaying their initial health bonus from stamina.
4. In the `OnLevelChanged` event, we check if the leveled-up player's name matches `PLAYER_NAME_TO_WATCH`.
   - If it does, we calculate the current health bonus using `GetHealthBonusFromStamina()` and store it in `healthBonusCurrent`.
   - We calculate the difference between the current and initial health bonus and store it in `healthBonusDifference`.
   - We send broadcast messages to the player displaying their current health bonus and the difference from the previous level.
   - We update `healthBonusInitial` with the current health bonus for the next level comparison.
5. We register the `OnLogin` and `OnLevelChanged` event handlers using `RegisterPlayerEvent`.

This script allows us to monitor a specific player's health bonus from stamina when they log in and each time they level up, providing insights into how their stamina affects their health bonus throughout their progression.

## GetHonorLastWeekStandingPos
Returns the player's standing position from the previous week's honor calculation.

### Parameters
None

### Returns
* `number` - The player's standing position from the previous week.

### Example Usage
This example retrieves the player's honor standing from the previous week and grants them bonus honor points based on their performance.

```typescript
const HONOR_BONUS_THRESHOLD = 10; // Top 10 players receive bonus
const HONOR_BONUS_AMOUNT = 500; // Bonus honor points

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const lastWeekPosition = player.GetHonorLastWeekStandingPos();

    if (lastWeekPosition <= HONOR_BONUS_THRESHOLD) {
        const bonusHonor = HONOR_BONUS_AMOUNT;
        player.ModifyHonorPoints(bonusHonor);

        // Send a message to the player
        const message = `Congratulations! Based on your outstanding performance last week, you have been awarded ${bonusHonor} bonus honor points!`;
        player.SendBroadcastMessage(message);

        // Log the bonus honor reward
        const logMessage = `Player ${player.GetName()} received ${bonusHonor} bonus honor points for placing ${lastWeekPosition} in last week's honor standings.`;
        console.log(logMessage);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. We define constants for the bonus honor threshold (top 10 players) and the bonus honor amount (500 points).

2. Inside the `OnLogin` event handler, we retrieve the player's standing position from the previous week using `GetHonorLastWeekStandingPos()`.

3. We check if the player's position is within the bonus threshold. If so, we proceed to grant them the bonus honor points.

4. We modify the player's honor points using `ModifyHonorPoints()` with the bonus amount.

5. We send a congratulatory message to the player using `SendBroadcastMessage()`, informing them about the bonus honor points they received.

6. We log the bonus honor reward details, including the player's name, bonus amount, and their standing position from the previous week.

This script rewards players who performed exceptionally well in the previous week's honor calculations, providing them with bonus honor points as an incentive for their achievements.

## GetHonorPoints
Retrieves the current total of Honor Points the player has acquired. 

### Parameters
This method does not take any parameters.

### Returns
number - The amount of honor points the player currently has.

### Example Usage
This example grants bonus honor points to the player based on their level each time they kill a creature, as long as they are at least level 70.

```typescript
const BONUS_HONOR_POINTS_PERCENT = 0.05;
const MIN_LEVEL_FOR_BONUS_HONOR = 70;

const CreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const playerLevel = player.GetLevel();
    
    if (playerLevel >= MIN_LEVEL_FOR_BONUS_HONOR) {
        const currentHonorPoints = player.GetHonorPoints();
        const bonusHonorPoints = Math.floor(currentHonorPoints * BONUS_HONOR_POINTS_PERCENT);

        if (bonusHonorPoints > 0) {
            player.ModifyHonorPoints(bonusHonorPoints);
            player.SendNotification(`You have been awarded ${bonusHonorPoints} bonus honor points!`);
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => CreatureKill(...args));
```

In this script:
1. We define constants for the bonus honor points percentage (5% in this case) and the minimum player level required to receive the bonus.
2. We create a handler function for the `PLAYER_EVENT_ON_KILL_CREATURE` event.
3. Inside the handler, we first retrieve the player's current level using `player.GetLevel()`.
4. We check if the player's level is greater than or equal to the minimum level required for the bonus.
5. If the player meets the level requirement, we retrieve their current honor points using `player.GetHonorPoints()`.
6. We calculate the bonus honor points by multiplying the current honor points by the bonus percentage and rounding down to the nearest integer using `Math.floor()`.
7. If the bonus honor points are greater than 0, we modify the player's honor points using `player.ModifyHonorPoints(bonusHonorPoints)` to add the bonus points.
8. Finally, we send a notification to the player informing them of the bonus honor points they received using `player.SendNotification()`.

This script encourages higher-level players to engage in creature kills by rewarding them with bonus honor points based on their existing honor points. The `GetHonorPoints()` method is used to retrieve the player's current honor points, which is then used to calculate the bonus honor points.

## GetHonorStoredKills
Returns the number of honor kills the player has accumulated. Honor kills are earned by killing players of the opposite faction in World PVP zones, Battlegrounds, and Arenas.

### Parameters
* honorable: boolean (optional) - If set to true, it will only return honorable kills. If set to false or not provided, it will return all kills (honorable and dishonorable).

### Returns
* number - The number of honor kills the player has accumulated.

### Example Usage
This script will reward players with bonus honor points based on their total honor kills when they log in.

```typescript
const HONOR_KILLS_THRESHOLD = 100;
const BONUS_HONOR_POINTS = 500;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const totalKills = player.GetHonorStoredKills();
    const honorableKills = player.GetHonorStoredKills(true);
    const dishonorableKills = totalKills - honorableKills;

    player.SendBroadcastMessage(`Welcome back, ${player.GetName()}!`);
    player.SendBroadcastMessage(`You have a total of ${totalKills} PVP kills, including ${honorableKills} honorable kills and ${dishonorableKills} dishonorable kills.`);

    if (totalKills >= HONOR_KILLS_THRESHOLD) {
        player.ModifyHonorPoints(BONUS_HONOR_POINTS);
        player.SendBroadcastMessage(`Congratulations! You have been awarded ${BONUS_HONOR_POINTS} bonus honor points for reaching ${HONOR_KILLS_THRESHOLD} total PVP kills!`);
    } else {
        const killsRemaining = HONOR_KILLS_THRESHOLD - totalKills;
        player.SendBroadcastMessage(`You need ${killsRemaining} more PVP kills to receive ${BONUS_HONOR_POINTS} bonus honor points. Keep up the good work!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, when a player logs in, the script retrieves their total honor kills and breaks it down into honorable and dishonorable kills. It then sends a welcome message to the player with their kill statistics.

If the player has reached a certain threshold of total PVP kills (defined by `HONOR_KILLS_THRESHOLD`), they are awarded a bonus amount of honor points (defined by `BONUS_HONOR_POINTS`). If they haven't reached the threshold yet, the script informs the player of how many more kills they need to receive the bonus.

This script encourages players to participate in PVP activities and rewards them for their achievements, providing an extra incentive to engage in World PVP, Battlegrounds, and Arenas.

## GetInGameTime
Returns the total time in seconds that the player has spent in-game on this character.

### Parameters
None

### Returns
* number - The total in-game time in seconds.

### Example Usage
This example tracks the amount of time a player spends in a specific map or zone and rewards them with bonus gold and experience if they spend a certain amount of time there.

```typescript
const ZONE_ELWYNN_FOREST = 12;
const BONUS_GOLD = 100;
const BONUS_XP = 1000;
const REQUIRED_TIME = 3600; // 1 hour in seconds

const playerZoneTimes: Map<number, number> = new Map();

const UpdateZoneTime = (event: number, player: Player, newZone: number, newArea: number) => {
    const playerId = player.GetGUID();
    const currentTime = player.GetInGameTime();

    if (playerZoneTimes.has(playerId)) {
        const previousTime = playerZoneTimes.get(playerId);
        const timeSpent = currentTime - previousTime;

        if (newZone === ZONE_ELWYNN_FOREST) {
            const totalTimeSpent = player.GetData("ElwynnForestTime", 0) + timeSpent;
            player.SetData("ElwynnForestTime", totalTimeSpent);

            if (totalTimeSpent >= REQUIRED_TIME) {
                player.ModifyMoney(BONUS_GOLD);
                player.GiveXP(BONUS_XP);
                player.SendBroadcastMessage(`You have spent ${REQUIRED_TIME / 3600} hour(s) in Elwynn Forest and received a bonus reward!`);
                player.SetData("ElwynnForestTime", 0);
            }
        }
    }

    playerZoneTimes.set(playerId, currentTime);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, UpdateZoneTime);
```

In this example:
1. We define constants for the zone ID of Elwynn Forest, the bonus gold and experience amounts, and the required time spent in seconds.
2. We create a `playerZoneTimes` map to store the last recorded in-game time for each player.
3. In the `UpdateZoneTime` function, we calculate the time spent in the previous zone by subtracting the last recorded time from the current in-game time using `player.GetInGameTime()`.
4. If the player is in Elwynn Forest, we add the time spent to their total time spent in that zone, which is stored using `player.SetData()`.
5. If the total time spent in Elwynn Forest reaches the required time, we reward the player with bonus gold using `player.ModifyMoney()` and bonus experience using `player.GiveXP()`, and reset their total time spent.
6. Finally, we update the last recorded in-game time for the player in the `playerZoneTimes` map.

This example demonstrates how `GetInGameTime()` can be used to track and reward player activity based on the time they spend in specific zones or areas of the game world.

## GetItemByEntry
Retrieves an item from the player's inventory, bank, or currently equipped items by the item's entry ID.

### Parameters
* entryId: number - The entry ID of the item to retrieve.

### Returns
* [Item](./item.md) - The first item found with the specified entry ID, or null if no item is found.

### Example Usage
This example demonstrates how to retrieve an item from the player's inventory by its entry ID and check if the player has a specific item equipped.

```typescript
const ITEM_HEARTHSTONE = 6948;
const ITEM_FISHING_POLE = 6256;

function CheckPlayerItems(player: Player) {
    // Get the player's hearthstone
    const hearthstone = player.GetItemByEntry(ITEM_HEARTHSTONE);
    if (hearthstone) {
        player.SendBroadcastMessage("You have a hearthstone in your inventory!");
    } else {
        player.SendBroadcastMessage("You don't have a hearthstone. You should get one!");
    }

    // Check if the player has a fishing pole equipped
    const fishingPole = player.GetItemByEntry(ITEM_FISHING_POLE);
    if (fishingPole && fishingPole.IsEquipped()) {
        player.SendBroadcastMessage("You have a fishing pole equipped. Ready to catch some fish!");
    } else {
        player.SendBroadcastMessage("You don't have a fishing pole equipped. Equip one to start fishing!");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (event, player) => {
    CheckPlayerItems(player);
});
```

In this example:
1. We define constants for the entry IDs of a hearthstone and a fishing pole.
2. The `CheckPlayerItems` function is called when a player logs in.
3. We use `player.GetItemByEntry(ITEM_HEARTHSTONE)` to retrieve the player's hearthstone from their inventory, bank, or equipped items.
4. If the hearthstone is found, we send a message to the player indicating they have one. Otherwise, we suggest they should get one.
5. We use `player.GetItemByEntry(ITEM_FISHING_POLE)` to check if the player has a fishing pole.
6. If a fishing pole is found, we check if it's currently equipped using the `IsEquipped()` method.
7. If the fishing pole is equipped, we send a message to the player indicating they are ready to fish. Otherwise, we suggest they equip a fishing pole to start fishing.

This example showcases how to use the `GetItemByEntry` method to retrieve items from a player's inventory and perform specific actions based on the presence or state of those items.

## GetItemByGUID
Retrieves an item from the player's inventory, bank, or currently equipped items using the specified GUID (Globally Unique Identifier).

### Parameters
* guid: number - The GUID of the item to retrieve.

### Returns
* [Item](./item.md) - The item matching the specified GUID, or null if no item is found.

### Example Usage
This example demonstrates how to retrieve an item from a player's inventory using its GUID and check if it's a quest item. If the item is found and it is a quest item, it will be destroyed and the player will receive a message indicating that the quest item was removed.

```typescript
const QUEST_ITEM_GUID = 123456; // Replace with the actual GUID of the quest item

const CheckQuestItem: player_event_on_login = (event: number, player: Player) => {
    const questItem = player.GetItemByGUID(QUEST_ITEM_GUID);

    if (questItem) {
        if (questItem.IsQuestItem()) {
            const itemName = questItem.GetName();
            questItem.RemoveFromWorld();
            player.SendNotification(`The quest item '${itemName}' has been removed from your inventory.`);
        }
    } else {
        player.SendNotification("The specified quest item was not found in your inventory.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => CheckQuestItem(...args));
```

In this example, when a player logs in, the script retrieves the item with the specified GUID using `GetItemByGUID()`. If the item is found (`questItem` is not null), it checks if the item is a quest item using the `IsQuestItem()` method. If it is a quest item, the script removes the item from the world using `RemoveFromWorld()` and sends a notification to the player indicating that the quest item has been removed. If the item is not found, the player receives a message stating that the specified quest item was not found in their inventory.

This example showcases how to use `GetItemByGUID()` to retrieve an item from a player's inventory and perform actions based on the item's properties, such as checking if it's a quest item and removing it if necessary.

## GetItemByPos
Retrieves an item from the player's inventory based on the specified bag and slot.

### Parameters
* bag: number - The bag identifier (see below for possible values)
* slot: number - The slot within the specified bag

### Returns
[Item](./item.md) - The item found at the specified bag and slot, or null if no item is found.

### Possible Bag and Slot Combinations
```typescript
bag = 255
  slots 0-18: Equipment
  slots 19-22: Equipped bag slots
  slots 23-38: Backpack
  slots 39-66: Bank main slots
  slots 67-74: Bank bag slots
  slots 86-117: Keyring

bag = 19-22
  slots 0-35: Equipped bags

bag = 67-74
  slots 0-35: Bank bags
```

### Example Usage
```typescript
const BACKPACK_BAG = 255;
const BACKPACK_SLOT_START = 23;
const BACKPACK_SLOT_END = 38;

const SearchBackpackForItem: player_event_On_Login = (event: number, player: Player) => {
    let itemCount = 0;
    
    for (let slot = BACKPACK_SLOT_START; slot <= BACKPACK_SLOT_END; slot++) {
        const item = player.GetItemByPos(BACKPACK_BAG, slot);
        
        if (item) {
            const [name, entry] = [item.GetName(), item.GetEntry()];
            SendSystemMessage(player, `Found item: ${name} (Entry: ${entry}) in backpack slot ${slot}`);
            itemCount++;
        }
    }
    
    SendSystemMessage(player, `Total items found in backpack: ${itemCount}`);
    
    const EQUIPPED_BAG_START = 19;
    const EQUIPPED_BAG_END = 22;
    
    for (let bag = EQUIPPED_BAG_START; bag <= EQUIPPED_BAG_END; bag++) {
        for (let slot = 0; slot < 36; slot++) {
            const item = player.GetItemByPos(bag, slot);
            
            if (item) {
                const [name, entry] = [item.GetName(), item.GetEntry()];
                SendSystemMessage(player, `Found item: ${name} (Entry: ${entry}) in equipped bag ${bag}, slot ${slot}`);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => SearchBackpackForItem(...args));
```

In this example, when a player logs in, the script searches their backpack (bags 255, slots 23-38) for any items. It sends a message to the player for each item found, including the item's name, entry, and slot number. It also keeps track of the total number of items found in the backpack.

Additionally, it searches the player's equipped bags (bags 19-22, slots 0-35) for any items and sends a message to the player for each item found, specifying the bag and slot numbers.

This script demonstrates how to use the `GetItemByPos` method to retrieve items from different bags and slots in a player's inventory, and how to extract information about the found items.

## GetItemCount
Returns the amount of a specific item that the player has in their inventory or bank.

### Parameters
* entry: number - The item entry to check for
* checkinBank: boolean (optional) - If set to true, the method will also check the player's bank for the item. Default is false.

### Returns
* number - The total amount of the specified item that the player has.

### Example Usage
This example script will check if the player has enough materials to craft an item, and if so, consume the materials and give the player the crafted item.

```typescript
const MATERIAL_1_ENTRY = 12345;
const MATERIAL_1_COUNT = 5;
const MATERIAL_2_ENTRY = 67890;
const MATERIAL_2_COUNT = 3;
const CRAFTED_ITEM_ENTRY = 54321;

const CraftItem: player_event_on_gossip_select = (event: number, player: Player, object: WorldObject, sender: number, intid: number, code: string, menu_id: number) => {
    const hasMaterial1 = player.GetItemCount(MATERIAL_1_ENTRY) >= MATERIAL_1_COUNT;
    const hasMaterial2 = player.GetItemCount(MATERIAL_2_ENTRY) >= MATERIAL_2_COUNT;

    if (hasMaterial1 && hasMaterial2) {
        player.RemoveItem(MATERIAL_1_ENTRY, MATERIAL_1_COUNT);
        player.RemoveItem(MATERIAL_2_ENTRY, MATERIAL_2_COUNT);

        const craftedItem = player.AddItem(CRAFTED_ITEM_ENTRY, 1);

        if (craftedItem) {
            player.SendBroadcastMessage("You have crafted the item successfully!");
        } else {
            // If the player's inventory is full, return the materials
            player.AddItem(MATERIAL_1_ENTRY, MATERIAL_1_COUNT);
            player.AddItem(MATERIAL_2_ENTRY, MATERIAL_2_COUNT);
            player.SendBroadcastMessage("Your inventory is full. Unable to craft the item.");
        }
    } else {
        player.SendBroadcastMessage("You don't have enough materials to craft this item.");
    }

    player.CloseGossip();
};

RegisterPlayerGossipEvent(12345, 1, (...args) => CraftItem(...args));
```

In this example, when the player selects a specific gossip option (with the menu ID 12345 and option ID 1), the script checks if the player has the required materials in their inventory using `GetItemCount()`. If the player has enough materials, they are consumed using `RemoveItem()`, and the crafted item is added to the player's inventory using `AddItem()`. If the player doesn't have enough space in their inventory, the materials are returned to the player. Finally, appropriate messages are sent to the player using `SendBroadcastMessage()`, and the gossip window is closed with `CloseGossip()`.

## GetLatency
Returns the current latency of the player in milliseconds. This latency represents the delay between the player's client and the server, indicating the responsiveness of the connection.

### Parameters
This method does not take any parameters.

### Returns
* number: The current latency of the player in milliseconds.

### Example Usage
Here's an example of how to use the `GetLatency` method to monitor player latency and take action based on the latency value:

```typescript
const LATENCY_THRESHOLD = 300; // Latency threshold in milliseconds

const CheckPlayerLatency: player_event_on_update = (event: number, player: Player, diff: number) => {
    const latency = player.GetLatency();

    if (latency > LATENCY_THRESHOLD) {
        // Player's latency exceeds the threshold
        player.SendBroadcastMessage(`Warning: High latency detected (${latency} ms)`);

        // Log the high latency event
        const playerName = player.GetName();
        const playerGUID = player.GetGUID();
        const latencyLog = `[Latency Alert] Player: ${playerName} (GUID: ${playerGUID}), Latency: ${latency} ms`;
        PrintInfo(latencyLog);

        // Teleport the player to a safe location if the latency is extremely high
        if (latency > LATENCY_THRESHOLD * 2) {
            const safeLoc = new WorldLocation(0, -8833.37, 628.62, 94.00, 1.06);
            player.Teleport(safeLoc);
            player.SendBroadcastMessage("You have been teleported to a safe location due to extremely high latency.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckPlayerLatency(...args));
```

In this example:
1. We define a `LATENCY_THRESHOLD` constant to set the maximum acceptable latency value in milliseconds.

2. We register a player event handler for the `PLAYER_EVENT_ON_UPDATE` event, which is triggered periodically for each player.

3. Inside the event handler, we retrieve the player's current latency using the `GetLatency` method.

4. We compare the latency value with the defined threshold. If the latency exceeds the threshold, we take the following actions:
   - Send a warning message to the player, informing them about the high latency.
   - Log the high latency event, including the player's name, GUID, and the latency value, using `PrintInfo`.
   - If the latency is extremely high (e.g., more than double the threshold), we teleport the player to a safe location using the `Teleport` method and send them a message indicating the reason for the teleportation.

5. The event handler is registered using `RegisterPlayerEvent` to be triggered on each player update.

This example demonstrates how to monitor player latency, provide warnings, log high latency events, and take preventive actions (such as teleportation) when the latency exceeds certain thresholds. You can customize the latency threshold, safe location, and actions taken based on your specific requirements.

## GetLevelPlayedTime
Returns the total time in seconds that the player has played at their current level.

### Parameters
None

### Returns
seconds: number - The total time played at the current level in seconds.

### Example Usage
This example tracks the time a player spends at each level and grants bonus gold and experience when they reach certain play time milestones at their current level.

```typescript
const BONUS_INTERVALS = [3600, 7200, 10800, 14400]; // 1 hour, 2 hours, 3 hours, 4 hours
const BONUS_GOLD = [100, 250, 500, 1000];
const BONUS_XP = [5000, 10000, 15000, 20000];

let playerLevelTimes: Map<number, number> = new Map();

const SaveLevelPlayTime = (event: number, player: Player): void => {
    const playerGuid = player.GetGUIDLow();
    const currentLevel = player.GetLevel();
    const playedTime = player.GetLevelPlayedTime();

    playerLevelTimes.set(playerGuid, playedTime);
};

const CheckLevelPlayTime = (event: number, player: Player): void => {
    const playerGuid = player.GetGUIDLow();
    const currentLevel = player.GetLevel();
    const playedTime = player.GetLevelPlayedTime();

    if (!playerLevelTimes.has(playerGuid)) {
        playerLevelTimes.set(playerGuid, playedTime);
        return;
    }

    const lastPlayedTime = playerLevelTimes.get(playerGuid);
    const timeDiff = playedTime - lastPlayedTime;

    for (let i = 0; i < BONUS_INTERVALS.length; i++) {
        if (timeDiff >= BONUS_INTERVALS[i]) {
            player.ModifyMoney(BONUS_GOLD[i]);
            player.GiveXP(BONUS_XP[i], null);
            player.SendBroadcastMessage(`You have been rewarded for playing ${BONUS_INTERVALS[i] / 3600} hours at level ${currentLevel}!`);
        }
    }

    playerLevelTimes.set(playerGuid, playedTime);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SAVE, (...args) => SaveLevelPlayTime(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckLevelPlayTime(...args));
```

In this script:
1. We define arrays `BONUS_INTERVALS`, `BONUS_GOLD`, and `BONUS_XP` to store the play time milestones and their corresponding bonus rewards.
2. We create a `Map` called `playerLevelTimes` to store each player's played time at their current level, using the player's GUID as the key.
3. In the `SaveLevelPlayTime` function, we save the player's current level played time whenever their character is saved.
4. In the `CheckLevelPlayTime` function, which is triggered periodically (e.g., on player update), we calculate the difference between the current played time and the last recorded played time.
5. We loop through the `BONUS_INTERVALS` array and check if the time difference exceeds any of the milestone intervals.
6. If a milestone is reached, we grant the player bonus gold and experience using `ModifyMoney` and `GiveXP`, and send them a congratulatory message using `SendBroadcastMessage`.
7. Finally, we update the player's last recorded played time in the `playerLevelTimes` map.

This script encourages players to spend more time at each level by rewarding them for reaching certain play time milestones, promoting a more immersive and engaging leveling experience.

## GetLifetimeKills
Returns the total number of lifetime honorable kills the player has acquired. This is a cumulative amount and represents the total number of honorable kills the player has gained throughout their lifetime.

### Parameters
None

### Returns
* number - The total lifetime honorable kills of the player.

### Example Usage
This example will keep track of a player's lifetime kills and grant rewards based on reaching certain milestones.

```typescript
const KILLS_MILESTONE_1 = 100;
const KILLS_MILESTONE_2 = 500;
const KILLS_MILESTONE_3 = 1000;

const REWARD_ITEM_1 = 12345;
const REWARD_ITEM_2 = 23456;
const REWARD_ITEM_3 = 34567;

let playerKills: Map<uint, number> = new Map();

const OnPlayerKill: player_event_on_kill_player = (event: number, killer: Player, killed: Player) => {
    if (!playerKills.has(killer.GetGUID())) {
        playerKills.set(killer.GetGUID(), 0);
    }

    playerKills.set(killer.GetGUID(), playerKills.get(killer.GetGUID()) + 1);
    const totalKills = killer.GetLifetimeKills();

    switch (totalKills) {
        case KILLS_MILESTONE_1:
            killer.AddItem(REWARD_ITEM_1, 1);
            killer.SendBroadcastMessage(`Congratulations on reaching ${KILLS_MILESTONE_1} lifetime honorable kills! You have been rewarded with a special item.`);
            break;
        case KILLS_MILESTONE_2:
            killer.AddItem(REWARD_ITEM_2, 1);
            killer.SendBroadcastMessage(`Congratulations on reaching ${KILLS_MILESTONE_2} lifetime honorable kills! You have been rewarded with a special item.`);
            break;
        case KILLS_MILESTONE_3:
            killer.AddItem(REWARD_ITEM_3, 1);
            killer.SendBroadcastMessage(`Congratulations on reaching ${KILLS_MILESTONE_3} lifetime honorable kills! You have been rewarded with a special item.`);
            break;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, (...args) => OnPlayerKill(...args));
```

This script keeps track of a player's lifetime honorable kills using a Map to store the kill counts. Whenever a player kills another player, their kill count is incremented, and the total lifetime kills are retrieved using `GetLifetimeKills()`.

The script checks if the total kills have reached certain milestones (100, 500, and 1000 in this example). If a milestone is reached, the player is rewarded with a special item using `AddItem()` and receives a congratulatory broadcast message.

By using `GetLifetimeKills()`, you can easily track and reward players based on their cumulative honorable kills throughout their entire gameplay experience.

## GetManaBonusFromIntellect
This method returns the bonus mana points a player receives based on their total intellect attribute. This takes into account any intellect the player receives from base stats, items, buffs, or talents.

### Parameters
This method does not take any parameters.

### Returns
number - The total bonus mana points the player receives from their intellect stat.

### Example Usage
This example demonstrates how to retrieve a player's bonus mana from intellect and display it as a chat message visible only to the player. This also calculates the player's total mana points by adding their base mana and bonus mana together.

```typescript
function DisplayPlayerManaInfo(player: Player): void {
    const bonusMana = player.GetManaBonusFromIntellect();
    const baseMana = player.GetMaxPower(PowerType.POWER_MANA);
    const totalMana = baseMana + bonusMana;

    player.SendNotification(`Base Mana: ${baseMana}`);
    player.SendNotification(`Bonus Mana from Intellect: ${bonusMana}`);
    player.SendNotification(`Total Mana: ${totalMana}`);
}

function OnLogin(event: PlayerEvents, player: Player): void {
    DisplayPlayerManaInfo(player);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example:
1. The `DisplayPlayerManaInfo` function is defined, which takes a `Player` object as a parameter.
2. Inside the function, `GetManaBonusFromIntellect()` is called on the player object to retrieve the bonus mana points from intellect.
3. `GetMaxPower(PowerType.POWER_MANA)` is used to retrieve the player's base mana points.
4. The total mana points are calculated by adding the base mana and bonus mana.
5. The base mana, bonus mana from intellect, and total mana are displayed to the player using `SendNotification`.
6. The `OnLogin` function is defined as an event handler for the `PLAYER_EVENT_ON_LOGIN` event.
7. Inside the `OnLogin` function, `DisplayPlayerManaInfo` is called, passing the `player` object.
8. `RegisterPlayerEvent` is used to register the `OnLogin` function as the event handler for the `PLAYER_EVENT_ON_LOGIN` event.

When a player logs in, the `OnLogin` event handler will be triggered, and the `DisplayPlayerManaInfo` function will be called. This will display the player's base mana, bonus mana from intellect, and total mana as chat messages visible only to the player.

This example demonstrates how to retrieve and utilize the bonus mana points a player receives from their intellect stat, and how to display this information to the player when they log in.

## GetMaxSkillValue
Returns the maximum value for a specified skill based on the player's current level, class, and race.

### Parameters
* skill: number - The ID of the skill to retrieve the maximum value for.

### Returns
* number - The maximum skill value achievable by the player.

### Example Usage
Suppose you want to create a script that rewards players with bonus skill points in their primary professions when they reach certain levels. Here's an example of how you can use the `GetMaxSkillValue` method to accomplish this:

```typescript
const SKILL_HERBALISM = 182;
const SKILL_MINING = 186;
const SKILL_SKINNING = 393;

const LevelUpReward: player_event_on_level_change = (event: number, player: Player, oldLevel: number): void => {
    const newLevel = player.GetLevel();
    const className = player.GetClass();

    let primarySkill = 0;

    // Determine the player's primary profession skill based on their class
    if (className === Classes.CLASS_DRUID || className === Classes.CLASS_ROGUE) {
        primarySkill = SKILL_HERBALISM;
    } else if (className === Classes.CLASS_WARRIOR || className === Classes.CLASS_PALADIN) {
        primarySkill = SKILL_MINING;
    } else if (className === Classes.CLASS_HUNTER) {
        primarySkill = SKILL_SKINNING;
    }

    // Check if the player has reached a milestone level
    if (newLevel === 20 || newLevel === 40 || newLevel === 60) {
        const currentSkill = player.GetSkillValue(primarySkill);
        const maxSkill = player.GetMaxSkillValue(primarySkill);

        // Calculate the bonus skill points to award
        const bonusPoints = Math.floor((maxSkill - currentSkill) * 0.1);

        if (bonusPoints > 0) {
            player.AdvanceSkill(primarySkill, bonusPoints);
            player.SendBroadcastMessage(`Congratulations! You have been awarded ${bonusPoints} bonus skill points in ${GetSkillName(primarySkill)}.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => LevelUpReward(...args));
```

In this example, the script determines the player's primary profession skill based on their class. When the player reaches levels 20, 40, or 60, it calculates the maximum skill value using `GetMaxSkillValue` and the player's current skill value using `GetSkillValue`. If the player's current skill is below the maximum, the script awards bonus skill points equal to 10% of the difference between the maximum and current skill values. Finally, it informs the player of the bonus points they received using `SendBroadcastMessage`.

This script encourages players to keep their primary profession skills up to date as they level up, rewarding them with bonus points at key milestones.

## GetNextRandomRaidMember
Returns a random raid member within the specified radius of the player. This can be useful for mechanics that require selecting a random player in the raid, such as applying a debuff or selecting a player to perform a specific task.

### Parameters
* radius: number - The maximum distance in yards to search for a random raid member.

### Returns
* [Player](./player.md) - A random raid member within the specified radius, or nil if no raid member is found.

### Example Usage
In this example, we create a script for a boss encounter where the boss periodically selects a random raid member within 30 yards to apply a debuff called "Curse of Doom". The selected player must run away from the raid to avoid spreading the curse to other players.

```typescript
const SPELL_CURSE_OF_DOOM = 12345;
const CURSE_OF_DOOM_RADIUS = 30;
const CURSE_OF_DOOM_DURATION = 10;

const ApplyCurseOfDoom = (boss: Creature): void => {
    const cursedPlayer = boss.GetNextRandomRaidMember(CURSE_OF_DOOM_RADIUS);
    if (cursedPlayer) {
        boss.CastSpell(cursedPlayer, SPELL_CURSE_OF_DOOM, true);
        cursedPlayer.AddAura(SPELL_CURSE_OF_DOOM, CURSE_OF_DOOM_DURATION);
        cursedPlayer.SendBroadcastMessage("You have been cursed with the Curse of Doom! Run away from the raid!");
        boss.SendUnitYell("${cursedPlayer.GetName()} has been cursed with the Curse of Doom!", 0);
    }
};

const OnBossEnterCombat = (event: number, boss: Creature, target: Unit): void => {
    boss.RegisterEvent(ApplyCurseOfDoom, 15000, 0);
};

const OnBossLeaveCombat = (event: number, boss: Creature): void => {
    boss.RemoveEvents();
};

const OnBossDied = (event: number, boss: Creature, killer: Unit): void => {
    boss.RemoveEvents();
};

RegisterCreatureEvent(12345, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, OnBossEnterCombat);
RegisterCreatureEvent(12345, CreatureEvents.CREATURE_EVENT_ON_LEAVE_COMBAT, OnBossLeaveCombat);
RegisterCreatureEvent(12345, CreatureEvents.CREATURE_EVENT_ON_DIED, OnBossDied);
```

In this script, we register event handlers for the boss's enter combat, leave combat, and died events. When the boss enters combat, we register a repeating event that calls the `ApplyCurseOfDoom` function every 15 seconds.

Inside the `ApplyCurseOfDoom` function, we use `GetNextRandomRaidMember` to select a random player within 30 yards of the boss. If a player is found, we cast the "Curse of Doom" spell on them, add an aura to the player with a duration of 10 seconds, send a broadcast message to the affected player, and make the boss yell to announce who has been cursed.

When the boss leaves combat or dies, we remove all registered events to clean up the script.

## GetOriginalGroup
Returns the original [Group](./group.md) object that the player was in before entering an instance. This can be useful for returning a player to their original group after completing an instance or a battleground.

### Parameters
None

### Returns
[Group](./group.md) - The original group the player was in before entering an instance.

### Example Usage
Here's an example of how to use `GetOriginalGroup()` to return a player to their original group after completing an instance:

```typescript
const OnPlayerCompleteInstance: player_event_on_complete_instance = (event: number, player: Player): void => {
    const originalGroup = player.GetOriginalGroup();

    if (originalGroup) {
        // Check if the player is currently in a group
        const currentGroup = player.GetGroup();
        if (currentGroup) {
            // Leave the current group
            player.RemoveFromGroup();
        }

        // Invite the player back to their original group
        originalGroup.AddMember(player);

        // Send a message to the player
        player.SendBroadcastMessage("You have been returned to your original group.");
    } else {
        // If the player had no original group, send them a message
        player.SendBroadcastMessage("You were not in a group before entering the instance.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMPLETE_INSTANCE, (...args) => OnPlayerCompleteInstance(...args));
```

In this example:

1. When a player completes an instance, the `OnPlayerCompleteInstance` event is triggered.
2. We retrieve the player's original group using `GetOriginalGroup()`.
3. If the player had an original group:
   - We check if the player is currently in a group using `GetGroup()`.
   - If the player is in a group, we remove them from the current group using `RemoveFromGroup()`.
   - We invite the player back to their original group using `AddMember()`.
   - We send a message to the player informing them that they have been returned to their original group.
4. If the player had no original group, we send them a message indicating that they were not in a group before entering the instance.

This script ensures that players are automatically returned to their original groups after completing an instance, providing a seamless experience for players who frequently run instances with different groups.

## GetOriginalSubGroup
Returns the player's original sub group. This is useful for determining which sub group the player was in before any changes were made to the raid group.

### Parameters
None

### Returns
number - The original sub group of the player.

### Example Usage
This example demonstrates how to use `GetOriginalSubGroup()` to determine if a player has been moved to a different sub group and then move them back to their original sub group.

```typescript
const HEALER_CLASS_MASK = 2;

const CheckSubGroup: player_event_on_update = (event: number, player: Player, diff: number) => {
    const currentSubGroup = player.GetSubGroup();
    const originalSubGroup = player.GetOriginalSubGroup();

    if (currentSubGroup !== originalSubGroup) {
        const className = player.GetClass();
        const isHealer = (HEALER_CLASS_MASK & (1 << (className - 1))) !== 0;

        if (isHealer) {
            // If the player is a healer, move them back to their original sub group
            player.SetSubGroup(originalSubGroup);
            player.SendBroadcastMessage("You have been moved back to your original sub group.");
        } else {
            // If the player is not a healer, send a message to the raid leader
            const raidLeader = player.GetRaidLeader();
            if (raidLeader) {
                raidLeader.SendBroadcastMessage(`${player.GetName()} has been moved to a different sub group.`);
            }
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckSubGroup(...args));
```

In this example, we first get the player's current sub group and original sub group using `GetSubGroup()` and `GetOriginalSubGroup()` respectively. We then check if the current sub group is different from the original sub group.

If the sub groups are different, we determine if the player is a healer by checking their class against a healer class mask. If the player is a healer, we move them back to their original sub group using `SetSubGroup()` and send them a message letting them know they have been moved.

If the player is not a healer, we get the raid leader using `GetRaidLeader()` and send them a message letting them know that the player has been moved to a different sub group.

This script can be useful for ensuring that healers stay in their designated sub groups, while also notifying the raid leader if any non-healers have been moved.

## GetPhaseMaskForSpawn
Returns the normal phase mask of the player, which represents the phases that the player is currently in. This method is useful when you need to know the player's phase without any GM phase modifications.

### Parameters
This method does not take any parameters.

### Returns
* number - The normal phase mask of the player.

### Example Usage
Suppose you want to create a custom NPC that is only visible to players in a specific phase. You can use the `GetPhaseMaskForSpawn` method to check if the player is in the required phase before spawning the NPC.

```typescript
const CUSTOM_NPC_ENTRY = 123456;
const REQUIRED_PHASE = 2;

const OnAreaTrigger: player_event_on_area_trigger = (event, player, areaTrigger) => {
    const phaseMask = player.GetPhaseMaskForSpawn();

    if ((phaseMask & REQUIRED_PHASE) !== 0) {
        // Player is in the required phase
        const npc = player.SummonCreature(CUSTOM_NPC_ENTRY, player.GetX(), player.GetY(), player.GetZ(), player.GetO(), 1, 0);
        
        if (npc) {
            // Set the NPC's phase to match the player's phase
            npc.SetPhaseMask(phaseMask, true);
            
            // Make the NPC follow the player
            npc.SetFollow(player, 5.0, 0);
            
            // Make the NPC despawn after 5 minutes (300000 milliseconds)
            npc.DespawnOrUnsummon(300000);
            
            player.SendBroadcastMessage("A mysterious NPC has appeared and is following you!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, OnAreaTrigger);
```

In this example, when a player enters a specific area trigger, the script checks if the player is in the required phase using `GetPhaseMaskForSpawn`. If the player is in the correct phase, a custom NPC is summoned at the player's location. The NPC's phase is set to match the player's phase using `SetPhaseMask`, ensuring that the NPC is only visible to players in the same phase. The NPC is then set to follow the player and despawn after 5 minutes.

This script demonstrates how `GetPhaseMaskForSpawn` can be used in combination with other methods to create phase-specific interactions and events in your Azeroth Core server.

## GetPlayerIP
Returns the IP address of the player as a string.

### Parameters
None

### Returns
string - The IP address of the player.

### Example Usage
This example demonstrates how to retrieve a player's IP address and store it in the database when they enter the world. It also checks if the player's IP address matches a list of banned IPs and kicks them from the server if there is a match.

```typescript
const BANNED_IPS = ["192.168.1.10", "10.0.0.5", "172.16.0.1"];

const storePlayerIP: player_event_on_login = (event: number, player: Player) => {
    const playerIP = player.GetPlayerIP();
    const playerGUID = player.GetGUIDLow();

    // Store the player's IP in the database
    let query = `INSERT INTO player_ips (guid, ip_address) VALUES (${playerGUID}, '${playerIP}')`;
    QueryWorld(WorldDatabaseQueries.QUERY_WORLD_DB_EXECUTE, query);

    // Check if the player's IP is in the banned list
    if (BANNED_IPS.includes(playerIP)) {
        player.KickPlayer();
        console.log(`Banned player with IP ${playerIP} attempted to log in.`);

        // Log the incident in the database
        query = `INSERT INTO banned_logins (guid, ip_address, timestamp) VALUES (${playerGUID}, '${playerIP}', NOW())`;
        QueryWorld(WorldDatabaseQueries.QUERY_WORLD_DB_EXECUTE, query);
    } else {
        console.log(`Player with IP ${playerIP} logged in successfully.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => storePlayerIP(...args));
```

In this example:

1. We define an array of banned IP addresses called `BANNED_IPS`.

2. We create a function called `storePlayerIP` that handles the `PLAYER_EVENT_ON_LOGIN` event.

3. Inside the function, we retrieve the player's IP address using `player.GetPlayerIP()` and their GUID using `player.GetGUIDLow()`.

4. We construct an SQL query to insert the player's GUID and IP address into a table called `player_ips` in the world database.

5. We execute the query using `QueryWorld` with the `QUERY_WORLD_DB_EXECUTE` query type.

6. We check if the player's IP address is included in the `BANNED_IPS` array.

7. If the IP is banned, we kick the player using `player.KickPlayer()`, log a message indicating that a banned player attempted to log in, and insert a record of the incident into a table called `banned_logins` in the world database.

8. If the IP is not banned, we log a message indicating that the player logged in successfully.

9. Finally, we register the `storePlayerIP` function to handle the `PLAYER_EVENT_ON_LOGIN` event using `RegisterPlayerEvent`.

This example showcases how to retrieve a player's IP address, store it in the database, and perform actions based on whether the IP is banned or not. It demonstrates the usage of the `GetPlayerIP` method, as well as interacting with the world database using `QueryWorld` and handling player events with `RegisterPlayerEvent`.

## GetPureMaxSkillValue
Returns the maximum value of a specified skill without any bonuses applied. This is useful for determining the base skill level of a player before any bonuses from gear, buffs, or other sources are applied.

### Parameters
* skill: number - The ID of the skill to retrieve the max value for. Skill IDs can be found in the `SkillLine.dbc` file.

### Returns
* number - The maximum skill value without any bonuses applied.

### Example Usage
This example demonstrates how to retrieve the pure max skill value for a player's mining skill and check if they have reached the required skill level to mine a specific ore.

```typescript
const MINING_SKILL_ID = 186;
const MITHRIL_ORE_REQUIRED_SKILL = 175;

const OnGossipHello: GossipMenuItems = (event, player, object): void => {
    const miningSkillMaxValue = player.GetPureMaxSkillValue(MINING_SKILL_ID);

    if (miningSkillMaxValue >= MITHRIL_ORE_REQUIRED_SKILL) {
        player.GossipMenuAddItem(0, "Mine Mithril Ore", 0, 1);
    } else {
        player.GossipMenuAddItem(0, "You need a mining skill of at least 175 to mine Mithril Ore.", 0, 1);
    }

    player.GossipSendMenu(0x7FFFFFFF, object.GetGUID());
};

const OnGossipSelect: GossipSelectMenu = (event, player, object, sender, intid, code): void => {
    if (intid === 1) {
        player.GossipComplete();
        // Code to handle mining Mithril Ore
        // ...
    }
};

RegisterGameObjectGossipEvent(12345, 1, OnGossipHello);
RegisterGameObjectGossipEvent(12345, 2, OnGossipSelect);
```

In this example:
1. We define constants for the mining skill ID and the required skill level to mine Mithril Ore.
2. In the `OnGossipHello` event, we retrieve the player's pure max mining skill value using `GetPureMaxSkillValue`.
3. We compare the player's mining skill level with the required skill level for Mithril Ore.
4. If the player's skill level is sufficient, we add a gossip menu item allowing them to mine Mithril Ore. Otherwise, we display a message indicating the required skill level.
5. We send the gossip menu to the player.
6. In the `OnGossipSelect` event, we handle the player's selection. If they chose to mine Mithril Ore (intid === 1), we complete the gossip interaction and execute the code to handle mining.

By using `GetPureMaxSkillValue`, we can determine the player's base mining skill level without any bonuses, ensuring that the skill check is based on their actual proficiency in the mining skill.

## GetPureSkillValue
Returns the player's skill value for a specified skill without any bonus points.

### Parameters
* skill: number - The ID of the skill to retrieve the value for.

### Returns
* number - The player's skill value without any bonus points.

### Example Usage
This example demonstrates how to retrieve a player's pure skill value for a specific skill and use it to determine if they are eligible for a special bonus or reward.

```typescript
const SKILL_FISHING = 356;
const FISHING_SKILL_THRESHOLD = 300;
const BONUS_ITEM_ENTRY = 12345;

const OnPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    const fishingSkill = player.GetPureSkillValue(SKILL_FISHING);

    if (fishingSkill >= FISHING_SKILL_THRESHOLD) {
        // Check if the player already has the bonus item
        const hasItem = player.HasItem(BONUS_ITEM_ENTRY);

        if (!hasItem) {
            // Award the bonus item for reaching the fishing skill threshold
            const bonusItem = player.AddItem(BONUS_ITEM_ENTRY, 1);

            if (bonusItem) {
                player.SendNotification("Congratulations! You have been awarded a special fishing bonus item for your exceptional fishing skills.");
            } else {
                player.SendNotification("You are eligible for a special fishing bonus item, but your inventory is full. Please make some space and log in again.");
            }
        }
    } else {
        player.SendNotification(`Improve your fishing skill to ${FISHING_SKILL_THRESHOLD} to be eligible for a special bonus!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnPlayerLogin(...args));
```

In this example:
1. We define constants for the fishing skill ID, the skill threshold for receiving the bonus, and the bonus item entry ID.
2. When a player logs in, we retrieve their pure fishing skill value using `GetPureSkillValue(SKILL_FISHING)`.
3. If the player's fishing skill is greater than or equal to the specified threshold:
   - We check if the player already has the bonus item using `HasItem(BONUS_ITEM_ENTRY)`.
   - If the player doesn't have the item, we attempt to add the bonus item to their inventory using `AddItem(BONUS_ITEM_ENTRY, 1)`.
   - If the item is successfully added, we send a congratulatory message to the player.
   - If the item cannot be added (e.g., due to a full inventory), we send a notification to the player to make space and log in again.
4. If the player's fishing skill is below the threshold, we send a message encouraging them to improve their skill to be eligible for the bonus.

This example showcases how `GetPureSkillValue` can be used in conjunction with other methods and game events to create engaging gameplay mechanics and reward players for their achievements.

## GetQuestLevel
Returns the quest level of the specified quest for the player. The quest level is determined by the player's level when they first accepted the quest.

### Parameters
* questId: number - The ID of the quest to get the level for.

### Returns
* number - The quest level of the specified quest for the player.

### Example Usage
This example demonstrates how to adjust the rewards given to a player based on the quest level when they complete a quest.

```typescript
const QUEST_ENTRY = 1234;
const ITEM_REWARD_ENTRY = 5678;

const onQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    if (quest.GetEntry() === QUEST_ENTRY) {
        const questLevel = player.GetQuestLevel(QUEST_ENTRY);
        let itemCount = 1;

        if (questLevel <= 10) {
            itemCount = 1;
        } else if (questLevel <= 20) {
            itemCount = 2;
        } else if (questLevel <= 30) {
            itemCount = 3;
        } else if (questLevel <= 40) {
            itemCount = 4;
        } else if (questLevel <= 50) {
            itemCount = 5;
        } else if (questLevel <= 60) {
            itemCount = 6;
        } else {
            itemCount = 7;
        }

        const rewardItem = player.AddItem(ITEM_REWARD_ENTRY, itemCount);
        if (rewardItem) {
            player.SendBroadcastMessage(`You have been rewarded with ${itemCount} x ${rewardItem.GetName()} for completing the quest at level ${questLevel}!`);
        } else {
            player.SendBroadcastMessage(`Failed to add reward item to your inventory. Please check if you have enough space.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => onQuestComplete(...args));
```

In this example:
1. We define the quest entry and the item reward entry as constants.
2. In the `onQuestComplete` event handler, we check if the completed quest matches the desired quest entry.
3. If it matches, we get the quest level using `player.GetQuestLevel(questId)`.
4. Based on the quest level, we determine the number of reward items to give to the player.
5. We use `player.AddItem(itemEntry, itemCount)` to add the reward item(s) to the player's inventory.
6. If the reward item(s) are successfully added, we send a broadcast message to the player informing them about the reward and the quest level.
7. If adding the reward item(s) fails (e.g., due to insufficient inventory space), we send an appropriate message to the player.

This example showcases how the `GetQuestLevel` method can be used in combination with other methods and game events to create a more dynamic and level-based reward system for quests.

## GetQuestRewardStatus
Determines if the player has completed the quest and received the rewards from the quest giver NPC.

### Parameters
questId: number - The ID of the quest to check the status of

### Returns
boolean - Returns true if the player has been rewarded for the quest, false otherwise

### Example Usage
This method can be useful to check if the player has completed a quest chain before offering them
a new quest that is a follow up, or to see if the player has received a special item or reward from a quest 
in order to unlock an event or special dialogue option.

```typescript
// Constants for the quest IDs
const QUEST_DISCOVER_KALIMDOR = 1001;
const QUEST_RETURN_TO_ORGRIMMAR = 1002;
const QUEST_REPORT_TO_WARCHIEF = 1003;

// Constants for the NPC ID
const NPC_WARCHIEF_THRALL = 4949;

// Function to handle gossip hello event for the Warchief
const OnGossipHello: creature_event_on_gossip_hello = (event, player, creature) => {
    // Check if the player has completed the quest chain
    if (player.GetQuestRewardStatus(QUEST_DISCOVER_KALIMDOR) &&
        player.GetQuestRewardStatus(QUEST_RETURN_TO_ORGRIMMAR) && 
        player.GetQuestRewardStatus(QUEST_REPORT_TO_WARCHIEF)) {

        // Player has completed the quest chain, offer them a special dialogue option
        player.GossipMenuAddItem(0, "I have completed your tasks, Warchief. What would you have me do next?", 1, 0);
    }
    else {
        // Player has not completed the quest chain, offer them the standard dialogue options
        player.GossipMenuAddItem(0, "I am ready to serve the Horde, Warchief!", 2, 0);
        player.GossipMenuAddItem(0, "Lok'tar ogar! Victory or death!", 2, 0);
    }

    // Send the gossip menu to the player
    player.GossipSendMenu(1, creature.GetGUID());
};

// Register the gossip hello event for the Warchief NPC
RegisterCreatureGossipEvent(NPC_WARCHIEF_THRALL, 1, OnGossipHello);
```

In this example, when the player interacts with Warchief Thrall, the script checks if they have completed a series of quests by checking the reward status of each quest ID. If the player has completed all the quests in the chain, they are offered a special dialogue option. Otherwise, they are offered the standard dialogue options.

## GetQuestStatus
Returns the current status of the specified quest for the player. The status is represented by a number value indicating the quest state.

### Parameters
* questId: number - The entry ID of the quest to check the status for.

### Returns
* number - The current status of the quest for the player. Possible values are:
  * 0 - Quest not found or not completed
  * 1 - Quest completed
  * 2 - Quest not completed but still in progress
  * 3 - Quest failed

### Example Usage
This example demonstrates how to check the status of a specific quest and perform actions based on the quest status.

```typescript
const QUEST_ENTRY = 1234; // Replace with the desired quest entry ID

const OnGossipHello: GossipEvents.OnGossipHello = (event, player, object) => {
    const questStatus = player.GetQuestStatus(QUEST_ENTRY);

    if (questStatus === 0) {
        // Quest not found or not completed
        player.GossipMenuAddItem(0, "I haven't started that quest yet.", 0, 1);
    } else if (questStatus === 1) {
        // Quest completed
        player.GossipMenuAddItem(0, "I have already completed that quest!", 0, 2);
    } else if (questStatus === 2) {
        // Quest not completed but still in progress
        player.GossipMenuAddItem(0, "I am still working on that quest.", 0, 3);
    } else if (questStatus === 3) {
        // Quest failed
        player.GossipMenuAddItem(0, "I have failed that quest.", 0, 4);
    }

    player.GossipSendMenu(1, object, MenuId);
};

const OnGossipSelect: GossipEvents.OnGossipSelect = (event, player, object, sender, intid, code) => {
    if (sender === 0) {
        if (intid === 1) {
            // Handle action for quest not started
            player.GossipClearMenu();
            player.GossipMenuAddItem(0, "I will start that quest now!", 0, 5);
            player.GossipSendMenu(2, object, MenuId);
        } else if (intid === 2) {
            // Handle action for quest completed
            player.SendBroadcastMessage("Congratulations on completing the quest!");
            player.GossipComplete();
        } else if (intid === 3) {
            // Handle action for quest in progress
            player.SendBroadcastMessage("Keep up the good work on that quest!");
            player.GossipComplete();
        } else if (intid === 4) {
            // Handle action for quest failed
            player.SendBroadcastMessage("Don't worry, you can always try the quest again!");
            player.GossipComplete();
        }
    }
};

RegisterGossipEvent(GossipEvents.GOSSIP_EVENT_ON_HELLO, OnGossipHello);
RegisterGossipEvent(GossipEvents.GOSSIP_EVENT_ON_SELECT, OnGossipSelect);
```

In this example, when the player interacts with an object (e.g., an NPC), the script checks the status of a specific quest using `player.GetQuestStatus(QUEST_ENTRY)`. Based on the quest status, different gossip options are added to the menu. When the player selects an option, the corresponding action is performed based on the quest status. This allows for dynamic interactions and dialogue based on the player's progress in the quest.

## GetRankPoints
Returns the current rank points of the player. Rank points are used in PvP ranking systems, such as Honor or Arena, to determine the player's standing and progress.

### Parameters
None

### Returns
- `number` - The current rank points of the player.

### Example Usage
```typescript
// Event handler for player login
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's current rank points
    const rankPoints = player.GetRankPoints();

    // Define the ranks and their corresponding rank point thresholds
    const ranks = [
        { name: 'Private', points: 0 },
        { name: 'Corporal', points: 500 },
        { name: 'Sergeant', points: 1000 },
        { name: 'Master Sergeant', points: 1500 },
        { name: 'Sergeant Major', points: 2000 },
        { name: 'Knight', points: 2500 },
        { name: 'Knight-Lieutenant', points: 3000 },
        { name: 'Knight-Captain', points: 3500 },
        { name: 'Knight-Champion', points: 4000 },
        { name: 'Lieutenant Commander', points: 4500 },
        { name: 'Commander', points: 5000 },
        { name: 'Marshal', points: 5500 },
        { name: 'Field Marshal', points: 6000 },
        { name: 'Grand Marshal', points: 6500 },
    ];

    // Find the player's current rank based on their rank points
    let currentRank = '';
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (rankPoints >= ranks[i].points) {
            currentRank = ranks[i].name;
            break;
        }
    }

    // Send a message to the player indicating their current rank and rank points
    player.SendBroadcastMessage(`Welcome, ${player.GetName()}! Your current rank is ${currentRank} with ${rankPoints} rank points.`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, when a player logs in, their current rank points are retrieved using the `GetRankPoints()` method. The script defines an array of ranks with their corresponding rank point thresholds. It then iterates through the ranks array in reverse order to find the player's current rank based on their rank points. Finally, it sends a broadcast message to the player, informing them of their current rank and rank points.

This script demonstrates how the `GetRankPoints()` method can be used in conjunction with a custom ranking system to provide players with information about their progress and standing in PvP activities.

## GetReputation
Returns the current reputation level the player has with the specified faction.

### Parameters
* faction: number - The ID of the faction to check reputation for. Faction IDs can be found in the `Faction.dbc` file.

### Returns
* reputation: number - The current reputation level the player has with the specified faction.

### Example Usage
This example checks if the player has reached exalted status with the Darkspear Trolls faction (ID 530) and rewards them with a special item if they have.

```typescript
const DARKSPEAR_TROLLS_FACTION_ID = 530;
const EXALTED_REPUTATION = 42000;
const REWARD_ITEM_ENTRY = 12345;

function CheckDarkspearReputation(player: Player): void {
    const reputation = player.GetReputation(DARKSPEAR_TROLLS_FACTION_ID);

    if (reputation >= EXALTED_REPUTATION) {
        const hasRewardItem = player.HasItem(REWARD_ITEM_ENTRY);

        if (!hasRewardItem) {
            const rewardItem = player.AddItem(REWARD_ITEM_ENTRY, 1);

            if (rewardItem) {
                player.SendBroadcastMessage("Congratulations on reaching Exalted status with the Darkspear Trolls! Here's a special reward for your dedication.");
            } else {
                player.SendBroadcastMessage("You have reached Exalted status with the Darkspear Trolls, but your inventory is full. Please make room and speak to me again.");
            }
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (event, player, msg, Type, lang) => {
    if (msg === "!darkspearrep") {
        CheckDarkspearReputation(player);
    }
});
```

In this example:
1. We define constants for the Darkspear Trolls faction ID, the minimum reputation level required for exalted status, and the reward item entry.
2. We create a function `CheckDarkspearReputation` that takes a `Player` object as a parameter.
3. Inside the function, we use `player.GetReputation()` to get the player's current reputation level with the Darkspear Trolls faction.
4. We check if the reputation level is greater than or equal to the exalted reputation level.
5. If the player has reached exalted status, we check if they already have the reward item using `player.HasItem()`.
6. If the player doesn't have the reward item, we attempt to add it to their inventory using `player.AddItem()`.
7. If the item is successfully added, we send a congratulatory message to the player using `player.SendBroadcastMessage()`.
8. If the player's inventory is full, we send a message informing them to make room and speak to the NPC again.
9. Finally, we register a player event for the `PLAYER_EVENT_ON_CHAT` event, which listens for the "!darkspearrep" command and triggers the `CheckDarkspearReputation` function when the command is detected.

## GetReputationRank
Returns the player's reputation rank with the specified faction. The rank is determined by the player's current standing with the faction and the thresholds defined in the database for each rank.

### Parameters
* faction: number - The ID of the faction to check the player's reputation rank for.

### Returns
* number - The player's reputation rank with the specified faction. The rank is returned as an integer value:
  * 0 - Hated
  * 1 - Hostile
  * 2 - Unfriendly
  * 3 - Neutral
  * 4 - Friendly
  * 5 - Honored
  * 6 - Revered
  * 7 - Exalted

### Example Usage
This example demonstrates how to check a player's reputation rank with a specific faction and grant them rewards based on their rank.

```typescript
const FACTION_KARAZHAN_CHESS = 1690;
const ITEM_CONJURED_MANA_CAKE = 22895;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const reputationRank = player.GetReputationRank(FACTION_KARAZHAN_CHESS);

    switch (reputationRank) {
        case 4: // Friendly
            player.AddItem(ITEM_CONJURED_MANA_CAKE, 1);
            break;
        case 5: // Honored
            player.AddItem(ITEM_CONJURED_MANA_CAKE, 2);
            break;
        case 6: // Revered
            player.AddItem(ITEM_CONJURED_MANA_CAKE, 3);
            player.CastSpell(player, 33077, true); // Cast "Blessing of the Silver Crescent"
            break;
        case 7: // Exalted
            player.AddItem(ITEM_CONJURED_MANA_CAKE, 5);
            player.CastSpell(player, 33078, true); // Cast "Blessing of the Silver Crescent"
            player.CastSpell(player, 33079, true); // Cast "Summon Chest of Spoils"
            break;
    }

    if (reputationRank >= 4) {
        player.SendBroadcastMessage(`Your reputation with the Karazhan Chess Event is ${GetReputationRankName(reputationRank)}!`);
    }
};

function GetReputationRankName(rank: number): string {
    switch (rank) {
        case 0: return "Hated";
        case 1: return "Hostile";
        case 2: return "Unfriendly";
        case 3: return "Neutral";
        case 4: return "Friendly";
        case 5: return "Honored";
        case 6: return "Revered";
        case 7: return "Exalted";
        default: return "Unknown";
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. When a player logs in, their reputation rank with the "Karazhan Chess Event" faction is checked using `GetReputationRank()`.
2. Based on the player's reputation rank, they receive different rewards:
   * Friendly: 1 Conjured Mana Cake
   * Honored: 2 Conjured Mana Cakes
   * Revered: 3 Conjured Mana Cakes and the "Blessing of the Silver Crescent" spell
   * Exalted: 5 Conjured Mana Cakes, the "Blessing of the Silver Crescent" spell, and a "Summon Chest of Spoils" spell
3. If the player's reputation rank is Friendly or higher, they receive a broadcast message informing them of their current rank.
4. The `GetReputationRankName()` function is used to convert the numeric reputation rank to a readable string for the broadcast message.

This script provides a way to reward players based on their reputation rank with a specific faction, encouraging them to improve their standing with that faction to receive better rewards.

## GetReqKillOrCastCurrentCount
Retrieves the current progress count for a required creature kill or gameobject cast quest objective.

### Parameters
* quest: number - The ID of the quest to check progress for
* entry: number - The ID of the required creature or gameobject

### Returns
* number - The current progress count for the specified quest objective

### Example Usage
This example script listens for the `PLAYER_EVENT_ON_KILL_CREATURE` event and checks if the killed creature is a quest objective for any of the player's active quests. If it is, the script checks the player's progress and sends them a message if they have completed the objective.

```typescript
const checkQuestProgress: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const activeQuests = player.GetActiveQuests();

    for (const questId of activeQuests) {
        const quest = player.GetQuest(questId);
        const requiredCount = quest.GetRequiredCreatureOrGOCount(creature.GetEntry());

        if (requiredCount > 0) {
            const currentCount = player.GetReqKillOrCastCurrentCount(questId, creature.GetEntry());

            if (currentCount >= requiredCount) {
                player.SendBroadcastMessage(`You have completed the objective for quest ${quest.GetTitle()}!`);
            } else {
                player.SendBroadcastMessage(`You have killed ${currentCount}/${requiredCount} ${creature.GetName()} for quest ${quest.GetTitle()}.`);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => checkQuestProgress(...args));
```

In this example:
1. We define a function `checkQuestProgress` that takes the event ID, the player, and the killed creature as arguments.
2. We retrieve the player's active quests using `GetActiveQuests()`.
3. For each active quest, we:
   - Get the quest object using `GetQuest(questId)`.
   - Check if the killed creature is a required objective for the quest using `GetRequiredCreatureOrGOCount(creature.GetEntry())`.
   - If the creature is required:
     - Get the player's current progress count for the objective using `GetReqKillOrCastCurrentCount(questId, creature.GetEntry())`.
     - Compare the current count with the required count.
     - Send a message to the player indicating their progress or completion of the objective.
4. Finally, we register the `checkQuestProgress` function to be called whenever the `PLAYER_EVENT_ON_KILL_CREATURE` event is triggered for any player.

This script helps players keep track of their quest progress by sending them informative messages when they kill creatures that are required for their active quests.

## GetRestBonus
Returns the player's current resting bonus as a number. The resting bonus is an experience multiplier that is applied when a player is resting in an inn or a city.

### Parameters
None

### Returns
* number - The current resting bonus multiplier

### Example Usage
This example demonstrates how to reward players with bonus experience when they are resting in a city or an inn.

```typescript
const KILL_XP_MULTIPLIER = 2;
const QUEST_XP_MULTIPLIER = 1.5;

const OnGiveXP: player_event_on_give_xp = (event: number, player: Player, amount: number, victim: Unit) => {
    const restBonus = player.GetRestBonus();
    let bonusMultiplier = 1;

    if (restBonus > 0) {
        if (victim) {
            bonusMultiplier = KILL_XP_MULTIPLIER;
        } else {
            bonusMultiplier = QUEST_XP_MULTIPLIER;
        }
    }

    const bonusXP = amount * (bonusMultiplier - 1);
    const totalXP = amount + bonusXP;

    player.SendBroadcastMessage(`You gained ${totalXP} experience points (${bonusXP} bonus XP from resting).`);

    return totalXP;
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GIVE_XP, (...args) => OnGiveXP(...args));
```

In this example:
1. We define constants for the bonus multipliers: `KILL_XP_MULTIPLIER` for experience gained from killing creatures and `QUEST_XP_MULTIPLIER` for experience gained from completing quests.

2. We register the `OnGiveXP` event handler using `RegisterPlayerEvent` and the `PLAYER_EVENT_ON_GIVE_XP` event.

3. Inside the event handler, we retrieve the player's current resting bonus using `player.GetRestBonus()`.

4. We initialize a `bonusMultiplier` variable to 1, which represents no bonus.

5. If the player has a resting bonus greater than 0, we set the `bonusMultiplier` based on the source of the experience:
   - If the experience is gained from killing a creature (`victim` is provided), we use the `KILL_XP_MULTIPLIER`.
   - Otherwise, we assume the experience is from completing a quest and use the `QUEST_XP_MULTIPLIER`.

6. We calculate the bonus experience points by multiplying the base experience amount (`amount`) by the difference between the `bonusMultiplier` and 1.

7. We calculate the total experience points by adding the base experience and the bonus experience.

8. We send a broadcast message to the player informing them about the total experience gained and the bonus experience from resting.

9. Finally, we return the total experience points, which will be awarded to the player.

This example showcases how to utilize the `GetRestBonus` method to provide additional rewards to players who are resting, encouraging them to spend time in inns and cities to gain bonus experience.

## GetSelection
Returns the [Unit](./unit.md) that the player currently has selected. This could be a creature, another player, or any other entity derived from [Unit](./unit.md).

### Parameters
This method does not take any parameters.

### Returns
[Unit](./unit.md) - The currently selected unit by the player.

### Example Usage
This example demonstrates how to use `GetSelection` to implement a basic mind control spell that can be cast on the currently selected unit.

```typescript
// Define the spell ID for the mind control spell
const SPELL_MIND_CONTROL = 605;

// Handler for the PLAYER_EVENT_ON_CAST_SPELL event
const OnPlayerCastSpell: player_event_on_cast_spell = (event: number, player: Player, spell: number, skipCheck: boolean) => {
    // Check if the cast spell is the mind control spell
    if (spell === SPELL_MIND_CONTROL) {
        // Get the currently selected unit
        const target = player.GetSelection();

        // Ensure the selected unit exists and is a player
        if (target && target.IsPlayer()) {
            // Get the selected player
            const targetPlayer = target.ToPlayer();

            // Check if the target player is in the same group as the caster
            if (player.IsInGroup() && targetPlayer.IsInGroup() && player.GetGroup() === targetPlayer.GetGroup()) {
                // Players in the same group cannot mind control each other
                player.SendBroadcastMessage("You cannot mind control players in your own group!");
            } else {
                // Apply the mind control aura to the target player
                targetPlayer.AddAura(SPELL_MIND_CONTROL, player);
                player.SendBroadcastMessage(`You have mind controlled ${targetPlayer.GetName()}!`);
            }
        } else {
            // If no valid player is selected, inform the caster
            player.SendBroadcastMessage("You must select a player to mind control.");
        }
    }
};

// Register the PLAYER_EVENT_ON_CAST_SPELL event handler
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => OnPlayerCastSpell(...args));
```

In this example:

1. We define the spell ID for the mind control spell as `SPELL_MIND_CONTROL`.

2. We create an event handler for the `PLAYER_EVENT_ON_CAST_SPELL` event, which is triggered whenever a player casts a spell.

3. Inside the event handler, we check if the cast spell is the mind control spell using the spell ID.

4. If the mind control spell is cast, we use `GetSelection` to get the currently selected unit by the player.

5. We ensure that the selected unit exists and is a player using `IsPlayer` and `ToPlayer`.

6. If the selected player is in the same group as the caster, we prevent the mind control and inform the caster.

7. If the selected player is valid and not in the same group, we apply the mind control aura to the target player using `AddAura` and inform the caster.

8. If no valid player is selected, we inform the caster that they must select a player to mind control.

9. Finally, we register the event handler for the `PLAYER_EVENT_ON_CAST_SPELL` event using `RegisterPlayerEvent`.

This example showcases how `GetSelection` can be used in conjunction with other methods and events to implement a mind control spell mechanic in the game.

## GetShieldBlockValue
Returns the player's current shield block value, which represents the amount of damage that can be blocked by the player's shield.

### Parameters
None

### Returns
number - The player's current shield block value.

### Example Usage
This example demonstrates how to retrieve the player's shield block value and use it to calculate the damage reduction when the player is attacked by an enemy.

```typescript
const SHIELD_BLOCK_MULTIPLIER = 0.5;

const onPlayerDamaged: player_event_on_damage = (event: number, player: Player, attacker: Unit, damage: number): void => {
    const shieldBlockValue = player.GetShieldBlockValue();

    if (shieldBlockValue > 0) {
        const damageBlocked = Math.min(damage, shieldBlockValue);
        const damageReduced = damageBlocked * SHIELD_BLOCK_MULTIPLIER;

        player.SetHealth(player.GetHealth() + damageReduced);

        player.SendBroadcastMessage(`Your shield blocked ${damageBlocked} damage and reduced the incoming damage by ${damageReduced}.`);

        if (attacker instanceof Player) {
            attacker.SendBroadcastMessage(`${player.GetName()}'s shield blocked ${damageBlocked} damage and reduced your damage by ${damageReduced}.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DAMAGE, (...args) => onPlayerDamaged(...args));
```

In this example:
1. We define a constant `SHIELD_BLOCK_MULTIPLIER` to represent the percentage of damage reduction when a shield blocks an attack.
2. We register a player event handler for the `PLAYER_EVENT_ON_DAMAGE` event using `RegisterPlayerEvent`.
3. Inside the event handler, we retrieve the player's current shield block value using `player.GetShieldBlockValue()`.
4. If the shield block value is greater than 0, it means the player has a shield equipped and can potentially block damage.
5. We calculate the actual damage blocked by taking the minimum value between the incoming damage and the shield block value.
6. We then calculate the damage reduced by multiplying the blocked damage with the `SHIELD_BLOCK_MULTIPLIER`.
7. We update the player's health by adding the reduced damage using `player.SetHealth()`.
8. We send a broadcast message to the player informing them about the amount of damage blocked and reduced.
9. If the attacker is another player, we send a broadcast message to the attacker as well, informing them about the damage reduction caused by the shield block.

This example showcases how the `GetShieldBlockValue` method can be used in a practical scenario to calculate and apply damage reduction based on the player's shield block value when they are attacked by an enemy.

## GetSkillPermBonusValue
Returns the permanent bonus value for a specific skill.

### Parameters
* skill: number - The ID of the skill to retrieve the bonus value for.
* bonusVal: number - The bonus value to be returned by reference.

### Example Usage
```typescript
// Retrieve the permanent bonus value for a player's mining skill
const SKILL_MINING = 186;
let player = new Player();
let miningBonus = 0;

player.GetSkillPermBonusValue(SKILL_MINING, miningBonus);

// Apply the mining bonus when calculating the chance to gather extra ores
const MINING_BONUS_CHANCE_PER_POINT = 0.5;
const BASE_EXTRA_ORE_CHANCE = 10;

let totalChance = BASE_EXTRA_ORE_CHANCE + (miningBonus * MINING_BONUS_CHANCE_PER_POINT);

const OnPlayerMine: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() == COPPER_ORE_ENTRY || item.GetEntry() == TIN_ORE_ENTRY) {
        let chance = Math.random() * 100;
        if (chance <= totalChance) {
            player.AddItem(item.GetEntry(), 1);
            player.SendBroadcastMessage("Your mining skill grants you an extra ore!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnPlayerMine(...args));
```

In this example, we first retrieve the player's permanent bonus value for the mining skill using `GetSkillPermBonusValue`. We then calculate the total chance of gathering an extra ore based on the mining bonus and a predefined base chance.

When the player loots an item, we check if it is a copper or tin ore. If it is, we generate a random number between 0 and 100 and compare it to the total chance. If the random number is less than or equal to the total chance, we grant the player an extra ore using `AddItem` and send them a message using `SendBroadcastMessage`.

This script demonstrates how the permanent skill bonus can be used to enhance gameplay mechanics and provide additional benefits to players who have invested in certain skills.

## GetSkillTempBonusValue
Returns the temporary bonus value for a specific skill.

### Parameters
* skill: number - The ID of the skill to retrieve the temporary bonus value for.
* bonusVal: number - The temporary bonus value for the specified skill.

### Example Usage
In this example, we'll create a script that grants players a temporary bonus to their mining skill when they consume a specific item.

```typescript
const MINING_SKILL_ID = 186;
const BUFF_ITEM_ENTRY = 12345;
const BUFF_DURATION = 1800; // 30 minutes in seconds
const BUFF_VALUE = 10;

const UseItem: player_event_on_use_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() === BUFF_ITEM_ENTRY) {
        const currentSkillValue = player.GetSkillValue(MINING_SKILL_ID);
        const currentTempBonus = player.GetSkillTempBonusValue(MINING_SKILL_ID);

        player.SendBroadcastMessage(`Your current Mining skill is ${currentSkillValue} with a temporary bonus of ${currentTempBonus}.`);

        player.SetSkillTempBonusValue(MINING_SKILL_ID, currentTempBonus + BUFF_VALUE);
        player.SendBroadcastMessage(`You have consumed the item and gained a temporary bonus of ${BUFF_VALUE} to your Mining skill!`);

        player.ScheduleEvent(BUFF_DURATION * 1000, (eventId: number, delay: number, repeats: number, player: Player) => {
            const newTempBonus = player.GetSkillTempBonusValue(MINING_SKILL_ID) - BUFF_VALUE;
            player.SetSkillTempBonusValue(MINING_SKILL_ID, newTempBonus);
            player.SendBroadcastMessage(`The temporary bonus to your Mining skill has expired. Your current temporary bonus is now ${newTempBonus}.`);
        });

        item.SetCount(item.GetCount() - 1);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => UseItem(...args));
```

In this script:
1. We define constants for the mining skill ID, the buff item entry, the buff duration, and the buff value.
2. When a player uses an item, we check if the item's entry matches the specified buff item entry.
3. If the item matches, we retrieve the player's current skill value and temporary bonus value for the mining skill.
4. We send a message to the player displaying their current mining skill value and temporary bonus.
5. We increase the player's temporary bonus value for the mining skill by the specified buff value.
6. We send a message to the player informing them about the temporary bonus they have gained.
7. We schedule an event to remove the temporary bonus after the specified duration.
8. When the scheduled event is triggered, we reduce the player's temporary bonus value for the mining skill by the buff value.
9. We send a message to the player informing them that the temporary bonus has expired and display their current temporary bonus value.
10. Finally, we reduce the count of the consumed item by 1.

This script demonstrates how to retrieve and modify the temporary bonus value for a specific skill, and how to create a temporary buff that expires after a certain duration.

## GetSkillValue
Returns the current value of a player's skill based on the skill ID provided.

### Parameters
* skill: number - The ID of the skill to retrieve the value for. Skill IDs can be found in the SkillLine.dbc file.

### Returns
* number - The current value of the player's skill.

### Example Usage
This example script will check a player's skill level in Herbalism (skill ID 182) and provide a bonus to the amount of herbs they can gather based on their skill level.

```typescript
const SKILL_HERBALISM = 182;
const ITEM_PEACEBLOOM = 2447;
const ITEM_SILVERLEAF = 765;
const ITEM_EARTHROOT = 2449;

const GatherHerb: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    const herbalismSkill = player.GetSkillValue(SKILL_HERBALISM);
    let bonusAmount = 0;

    if (herbalismSkill >= 300) {
        bonusAmount = 3;
    } else if (herbalismSkill >= 200) {
        bonusAmount = 2;
    } else if (herbalismSkill >= 100) {
        bonusAmount = 1;
    }

    if (bonusAmount > 0) {
        switch (item.GetEntry()) {
            case ITEM_PEACEBLOOM:
            case ITEM_SILVERLEAF:
            case ITEM_EARTHROOT:
                const amountToAdd = item.GetCount() + bonusAmount;
                player.AddItem(item.GetEntry(), amountToAdd);
                break;
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => GatherHerb(...args));
```

In this example:
1. We define constants for the Herbalism skill ID and the item IDs of some common herbs.
2. In the `GatherHerb` function, we first retrieve the player's current Herbalism skill level using `player.GetSkillValue(SKILL_HERBALISM)`.
3. We then determine the bonus amount of herbs to grant based on the player's skill level using a series of if statements.
4. If the bonus amount is greater than 0 and the looted item is one of the specified herbs, we add the bonus amount to the quantity of herbs the player receives using `player.AddItem()`.
5. Finally, we register the `GatherHerb` function to be called whenever the `PLAYER_EVENT_ON_LOOT_ITEM` event is triggered.

This script encourages players to level up their Herbalism skill by rewarding them with bonus herbs for higher skill levels, making the gathering process more efficient and rewarding.

## GetSpecsCount
Returns the number of talent specs the player has available to them.  This is based on the player's class and level. 

### Parameters
None

### Returns
number - The number of specs the player has available.

### Example Usage
In this example, we will grant the player a bonus to their primary stat (Strength, Agility, or Intellect) based on how many specs they have available.  The bonus will increase for each spec they have access to.

```typescript
const BONUS_STATS_SPELL_ID = 12345;
const BONUS_STATS_PER_SPEC = 10;

const ApplyBonusStats = (player: Player) => {
    const specs = player.GetSpecsCount();
    const bonus = specs * BONUS_STATS_PER_SPEC;

    // Remove the old aura if it exists
    player.RemoveAura(BONUS_STATS_SPELL_ID);

    // Apply the new aura with the updated bonus
    player.AddAura(BONUS_STATS_SPELL_ID, player);
    const aura = player.GetAura(BONUS_STATS_SPELL_ID);
    if (aura) {
        aura.SetStackAmount(bonus);
    }

    // Notify the player
    player.SendNotification(`You have been granted a bonus of ${bonus} to your primary stat for having ${specs} spec(s) available.`);
}

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    ApplyBonusStats(player);
}

const OnLevelChange: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    ApplyBonusStats(player);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, OnLevelChange);
```

In this script:

1. We define constants for the spell ID of the bonus stats aura and the amount of bonus stats to apply per available spec.

2. We create an `ApplyBonusStats` function that:
   - Gets the number of available specs using `GetSpecsCount()`.
   - Calculates the total bonus based on the number of specs.
   - Removes the old aura if it exists to ensure we don't stack multiple instances.
   - Applies the new aura to the player.
   - Sets the stack amount of the aura to the calculated bonus.
   - Sends a notification to the player informing them of their bonus.

3. We register event handlers for `PLAYER_EVENT_ON_LOGIN` and `PLAYER_EVENT_ON_LEVEL_CHANGE` to apply the bonus stats whenever the player logs in or gains a level, as these events may change the number of available specs.

This script showcases a practical usage of `GetSpecsCount()` to provide a scaling bonus based on the player's class progression and spec availability.

## GetSpellCooldownDelay
Returns the remaining cooldown in milliseconds for a specific spell based on the spell ID.

### Parameters
* spellId: number - The ID of the spell to check the cooldown for.

### Returns
* number - The remaining cooldown time in milliseconds. If the spell is not on cooldown, it will return 0.

### Example Usage
In this example, we'll create a script that checks if the player's Lay on Hands spell (spell ID: 633) is on cooldown. If it is, we'll print the remaining cooldown time. If not, we'll cast the spell on the player.

```typescript
const LAY_ON_HANDS_SPELL_ID = 633;

const CheckLayOnHandsCooldown: player_event_on_gossip_hello = (event: number, player: Player, object: WorldObject) => {
    const cooldownDelay = player.GetSpellCooldownDelay(LAY_ON_HANDS_SPELL_ID);

    if (cooldownDelay > 0) {
        const remainingCooldownSec = Math.ceil(cooldownDelay / 1000);
        player.SendBroadcastMessage(`Lay on Hands is on cooldown. Remaining time: ${remainingCooldownSec} seconds.`);
    } else {
        const layOnHandsSpell = player.GetSpellInfo(LAY_ON_HANDS_SPELL_ID);

        if (layOnHandsSpell) {
            player.CastSpell(player, layOnHandsSpell, true);
            player.SendBroadcastMessage("Lay on Hands has been cast on you.");
        } else {
            player.SendBroadcastMessage("Error: Lay on Hands spell not found.");
        }
    }

    object.GossipComplete();
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => CheckLayOnHandsCooldown(...args));
```

In this script, when the player interacts with an NPC (triggering the `PLAYER_EVENT_ON_GOSSIP_HELLO` event), we first check the cooldown of the Lay on Hands spell using `GetSpellCooldownDelay()`. If the cooldown is greater than 0, we calculate the remaining cooldown time in seconds and send a message to the player informing them of the remaining cooldown.

If the spell is not on cooldown, we retrieve the spell information using `GetSpellInfo()`. If the spell is found, we cast it on the player using `CastSpell()` and send a confirmation message. If the spell is not found, we send an error message to the player.

Finally, we complete the gossip interaction using `GossipComplete()` to close the gossip window.

## GetSubGroup
Returns the player's current subgroup number. Raid groups are split into subgroups (or parties). This method allows you to know which subgroup a player belongs to. Subgroups in a raid are numbered starting from 0.

### Parameters
This method does not take any parameters.

### Returns
subGroup: number - The subgroup number the player belongs to. Returns 0 for the first subgroup, 1 for the second, and so on.

### Example Usage
This example demonstrates how to reward bonus loot to a specific subgroup that downs a boss first.

```typescript
const BOSS_ENTRY = 12345;
const BONUS_ITEM_ENTRY = 6789;
const BONUS_ITEM_COUNT = 1;

let firstSubgroupToKillBoss: number | null = null;

const OnCreatureKill: creature_event_on_killed = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === BOSS_ENTRY && killer instanceof Player) {
        const player = killer as Player;
        const subGroup = player.GetSubGroup();

        if (firstSubgroupToKillBoss === null) {
            // This is the first subgroup to kill the boss
            firstSubgroupToKillBoss = subGroup;
            SendWorldMessage(`Subgroup ${subGroup + 1} has downed the boss first! They will receive bonus loot.`);
        }

        if (subGroup === firstSubgroupToKillBoss) {
            // Reward bonus loot to all players in the first subgroup to kill the boss
            const group = player.GetGroup();
            if (group) {
                group.ForEachMember((member) => {
                    if (member instanceof Player && member.GetSubGroup() === subGroup) {
                        member.AddItem(BONUS_ITEM_ENTRY, BONUS_ITEM_COUNT);
                    }
                });
            }
        }
    }
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_KILLED, OnCreatureKill);
```

In this example:
1. We define constants for the boss entry, bonus item entry, and bonus item count.
2. We initialize a variable `firstSubgroupToKillBoss` to keep track of the first subgroup that kills the boss.
3. In the `OnCreatureKill` event handler, we check if the killed creature is the boss and if the killer is a player.
4. If it's the first subgroup to kill the boss, we store the subgroup number in `firstSubgroupToKillBoss` and announce it to the world.
5. If the player belongs to the first subgroup that killed the boss, we reward bonus loot to all players in that subgroup.
   - We get the player's group using `GetGroup()`.
   - We iterate over each group member using `ForEachMember()`.
   - For each member, we check if they are a player and belong to the same subgroup as the killer.
   - If so, we add the bonus item to their inventory using `AddItem()`.
6. Finally, we register the `OnCreatureKill` event handler for the specific boss entry.

This example showcases how to use `GetSubGroup()` to identify the subgroup a player belongs to and reward them accordingly based on their subgroup's performance in a raid encounter.

## GetTeam
Returns the player's team as a [TeamId](./teamid.md) enum value.

### Parameters
None

### Returns
[TeamId](./teamid.md) - The player's team (ALLIANCE, HORDE, or NEUTRAL)

### Example Usage
Reward players with an item based on their team:
```typescript
const ALLIANCE_ITEM_ENTRY = 12345;
const HORDE_ITEM_ENTRY = 67890;

const RewardPlayerByTeam = (player: Player): void => {
    const teamId = player.GetTeam();

    switch (teamId) {
        case TeamId.ALLIANCE:
            player.AddItem(ALLIANCE_ITEM_ENTRY, 1);
            SendSystemMessage(player, "You have been rewarded with an Alliance-exclusive item!");
            break;
        case TeamId.HORDE:
            player.AddItem(HORDE_ITEM_ENTRY, 1);
            SendSystemMessage(player, "You have been rewarded with a Horde-exclusive item!");
            break;
        case TeamId.NEUTRAL:
            SendSystemMessage(player, "Neutral players do not receive a reward.");
            break;
        default:
            SendSystemMessage(player, "An error occurred while trying to reward you based on your team.");
            break;
    }
}

const OnPlayerLogin: player_event_on_login = (event: number, player: Player): void => {
    if (!player.HasAura(REWARD_AURA_ENTRY)) {
        RewardPlayerByTeam(player);
        player.AddAura(REWARD_AURA_ENTRY, player);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnPlayerLogin(...args));
```
In this example, when a player logs in, the script checks if the player already has a specific aura (identified by `REWARD_AURA_ENTRY`). If the player does not have the aura, the script calls the `RewardPlayerByTeam` function, which determines the player's team using `GetTeam()` and rewards them with a team-specific item. The aura is then applied to the player to prevent multiple rewards. The script also sends a message to the player informing them of their reward or lack thereof.

## GetTotalPlayedTime
Returns the total time the player has spent playing the character in seconds.

### Parameters
None

### Returns
* number - The total played time in seconds.

### Example Usage
This example script awards players with bonus gold and experience points based on their total played time when they log in.

```typescript
const BONUS_GOLD_PER_HOUR = 100;
const BONUS_EXP_PER_HOUR = 1000;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const totalPlayedTime = player.GetTotalPlayedTime();
    const totalPlayedHours = Math.floor(totalPlayedTime / 3600); // Convert seconds to hours

    // Calculate bonus gold and experience points based on played time
    const bonusGold = totalPlayedHours * BONUS_GOLD_PER_HOUR;
    const bonusExp = totalPlayedHours * BONUS_EXP_PER_HOUR;

    // Add bonus gold to the player's inventory
    const coinage = player.GetCoinage();
    player.SetCoinage(coinage + bonusGold * 10000); // Convert gold to copper

    // Add bonus experience points to the player
    player.GiveXP(bonusExp, null, false);

    // Send a message to the player informing them about the bonus rewards
    player.SendBroadcastMessage(`Welcome back! As a reward for your dedication, you have been granted ${bonusGold} bonus gold and ${bonusExp} bonus experience points based on your total played time of ${totalPlayedHours} hours.`);

    // You can also store the total played time in the player's cache for future reference
    player.SetCacheValue("totalPlayedTime", totalPlayedTime);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. When a player logs in, the script retrieves their total played time using `GetTotalPlayedTime()`.
2. The total played time is converted from seconds to hours.
3. Bonus gold and experience points are calculated based on the total played hours and predefined constants (`BONUS_GOLD_PER_HOUR` and `BONUS_EXP_PER_HOUR`).
4. The bonus gold is added to the player's inventory using `GetCoinage()` and `SetCoinage()`. Note that the gold amount is converted to copper before adding it to the player's coinage.
5. The bonus experience points are granted to the player using `GiveXP()`.
6. A broadcast message is sent to the player informing them about the bonus rewards and their total played time.
7. The total played time is stored in the player's cache using `SetCacheValue()` for future reference.

This script demonstrates how `GetTotalPlayedTime()` can be used to implement a reward system based on player engagement and loyalty. You can customize the bonus amounts and additional rewards based on your server's requirements.

## GetXPRestBonus
This method returns the amount of bonus experience the player will receive based on their current rested experience bonus. The amount of bonus experience is calculated as a percentage of the base experience passed into the method.

### Parameters
* xp: number - The base experience amount to calculate the bonus for

### Returns
* number - The amount of bonus experience the player will receive

### Example Usage
This example script awards players with bonus experience when they complete a daily quest, based on their current rested bonus.

```typescript
const DAILY_QUEST_COMPLETE_EVENT = 1; // Custom event ID
const DAILY_QUEST_XP_REWARD = 1000; // Base XP reward for daily quests

// Handler for the custom daily quest completion event
const OnDailyQuestComplete: player_event_handler = (event: number, player: Player): void => {
    // Calculate the bonus XP based on the player's rested bonus
    const bonusXP = player.GetXPRestBonus(DAILY_QUEST_XP_REWARD);

    // Award the base XP and the bonus XP to the player
    player.GiveXP(DAILY_QUEST_XP_REWARD, null);
    player.GiveXP(bonusXP, null);

    // Send a message to the player informing them of the bonus XP
    player.SendNotification(`You received ${bonusXP} bonus experience from your rested bonus!`);

    // If the player has reached the maximum level, reset their rested bonus
    if (player.GetLevel() == player.GetMaxLevel()) {
        player.SetRestBonus(0);
        player.SendNotification("You have reached the maximum level and your rested bonus has been reset.");
    }
};

// Register the event handler for the custom daily quest completion event
RegisterPlayerEvent(DAILY_QUEST_COMPLETE_EVENT, OnDailyQuestComplete);
```

In this example, when a player completes a daily quest (triggering the custom `DAILY_QUEST_COMPLETE_EVENT` event), the script calculates the bonus experience the player will receive based on their current rested bonus using `GetXPRestBonus()`. The base quest experience and the bonus experience are then awarded to the player using `GiveXP()`.

The script also sends a notification to the player informing them of the amount of bonus experience they received. If the player has reached the maximum level, their rested bonus is reset to 0 using `SetRestBonus()`, and they are notified of this as well.

This example demonstrates how `GetXPRestBonus()` can be used in combination with other methods and custom events to create more complex behaviors and reward systems in a mod.

## GiveXP
This method grants experience points to the player. Optionally, you can specify a victim unit to credit for the experience gain. If no victim is provided, the experience will be granted without any source attribution.

### Parameters
* xp: number - The amount of experience points to grant to the player.
* victim?: [Unit](./unit.md) - (Optional) The unit to credit for the experience gain.

### Example Usage
In this example, we'll create a script that grants bonus experience to the player when they kill a creature based on its level difference.

```typescript
const BONUS_XP_MULTIPLIER = 1.5;

const OnCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const playerLevel = player.GetLevel();
    const creatureLevel = creature.GetLevel();
    const levelDifference = creatureLevel - playerLevel;

    if (levelDifference >= 5) {
        const baseXP = creature.GetBaseXP();
        const bonusXP = Math.floor(baseXP * BONUS_XP_MULTIPLIER);

        player.SendBroadcastMessage(`You have slain a powerful creature and gained bonus experience!`);
        player.GiveXP(bonusXP, creature);

        // Apply an additional 10% experience bonus for each level difference above 5
        const additionalBonusMultiplier = 1 + (levelDifference - 5) * 0.1;
        const additionalBonusXP = Math.floor(bonusXP * additionalBonusMultiplier);
        player.GiveXP(additionalBonusXP, creature);

        player.SendBroadcastMessage(`Total bonus experience gained: ${bonusXP + additionalBonusXP}`);
    } else {
        // Grant normal experience if the level difference is less than 5
        player.GiveXP(creature.GetBaseXP(), creature);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => OnCreatureKill(...args));
```

In this script:
1. We define a constant `BONUS_XP_MULTIPLIER` to determine the bonus experience multiplier.
2. Inside the `OnCreatureKill` event handler, we calculate the level difference between the player and the slain creature.
3. If the level difference is 5 or greater, we grant bonus experience to the player:
   - We retrieve the base experience points of the creature using `creature.GetBaseXP()`.
   - We calculate the bonus experience by multiplying the base experience with the `BONUS_XP_MULTIPLIER`.
   - We send a broadcast message to the player indicating they have gained bonus experience.
   - We grant the bonus experience to the player using `player.GiveXP()`, specifying the bonus experience amount and the creature as the victim.
   - We calculate an additional bonus based on the level difference above 5, multiplying the bonus experience by an additional multiplier of 10% for each level above 5.
   - We grant the additional bonus experience to the player using `player.GiveXP()`.
   - We send a broadcast message to the player with the total bonus experience gained.
4. If the level difference is less than 5, we grant the normal base experience to the player using `player.GiveXP()`, specifying the creature's base experience and the creature as the victim.

This script enhances the gameplay experience by rewarding players with bonus experience when they defeat powerful creatures, providing an incentive to take on challenging encounters.

## GossipAddQuests
This method adds the available quests that the specified `WorldObject` can offer to the player's gossip menu. It allows the player to interact with the `WorldObject` and view the quests they can accept or turn in.

### Parameters
- `source`: [WorldObject](./worldobject.md) - The `WorldObject` that offers the quests to the player. This can be a creature, gameobject, or any other entity that extends the `WorldObject` class.

### Example Usage
Here's an example of how to use the `GossipAddQuests` method in a script that handles the gossip interaction between a player and a quest giver:

```typescript
const QUEST_GIVER_ENTRY = 1234; // The entry ID of the quest giver creature

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, source: WorldObject) => {
    if (source.GetEntry() === QUEST_GIVER_ENTRY) {
        // Add the available quests to the player's gossip menu
        player.GossipAddQuests(source);

        // Add custom gossip options
        player.GossipMenuAddItem(0, "Tell me more about the available quests", 1, 0);
        player.GossipMenuAddItem(0, "I have a question about a quest", 2, 0);
        player.GossipMenuAddItem(0, "Goodbye", 3, 0);

        // Send the gossip menu to the player
        player.GossipSendMenu(player.GetGossipTextId(source), source.GetGUID());
    }
};

const OnGossipSelect: player_event_on_gossip_select = (event: number, player: Player, source: WorldObject, sender: number, action: number) => {
    if (sender === QUEST_GIVER_ENTRY) {
        if (action === 1) {
            // Handle the "Tell me more about the available quests" option
            player.GossipMenuAddItem(0, "Quest 1 description", 4, 0);
            player.GossipMenuAddItem(0, "Quest 2 description", 5, 0);
            player.GossipMenuAddItem(0, "Back", 0, 0);
            player.GossipSendMenu(player.GetGossipTextId(source), source.GetGUID());
        } else if (action === 2) {
            // Handle the "I have a question about a quest" option
            player.GossipMenuAddItem(0, "What are the objectives of Quest 1?", 6, 0);
            player.GossipMenuAddItem(0, "Where can I find the items for Quest 2?", 7, 0);
            player.GossipMenuAddItem(0, "Back", 0, 0);
            player.GossipSendMenu(player.GetGossipTextId(source), source.GetGUID());
        } else if (action === 3) {
            // Handle the "Goodbye" option
            player.GossipComplete();
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, OnGossipHello);
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, OnGossipSelect);
```

In this example, when the player interacts with the quest giver creature (identified by `QUEST_GIVER_ENTRY`), the `GossipAddQuests` method is called to add the available quests to the player's gossip menu. Additional custom gossip options are added to provide more information about the quests.

The `OnGossipSelect` event handler is used to handle the player's selection from the gossip menu. Depending on the selected option, different actions are taken, such as providing more details about the quests or answering specific questions.

This script demonstrates how the `GossipAddQuests` method can be used in conjunction with other gossip-related methods to create an interactive quest giver experience for the player.

## GossipClearMenu
Clears the [Player]'s current gossip item list. This method is used to clear the gossip menu before adding new items to it. It's important to note that this method is needed when you show a gossip menu without using gossip hello or select hooks, which do this automatically. Usually, this is needed when the [Player] is the sender of a Gossip Menu.

### Parameters
This method does not take any parameters.

### Returns
This method does not return anything.

### Example Usage
Let's say you want to create a custom gossip menu for a player when they talk to an NPC. You can use the `GossipClearMenu` method to clear any existing gossip items before adding your custom ones.

```typescript
const GOSSIP_ICON_CHAT = 0;
const GOSSIP_ICON_VENDOR = 1;
const GOSSIP_ICON_TAXI = 2;
const GOSSIP_ICON_TRAINER = 3;
const GOSSIP_ICON_INTERACT_1 = 4;
const GOSSIP_ICON_INTERACT_2 = 5;
const GOSSIP_ICON_MONEY_BAG = 6;
const GOSSIP_ICON_TALK = 7;
const GOSSIP_ICON_TABARD = 8;
const GOSSIP_ICON_BATTLE = 9;

const MyCustomGossip: npc_event_on_gossip_hello = (event: number, player: Player, object: GameObject) => {
    player.GossipClearMenu();

    player.GossipMenuAddItem(GOSSIP_ICON_CHAT, "Tell me about this place.", 1);
    player.GossipMenuAddItem(GOSSIP_ICON_VENDOR, "I want to browse your goods.", 2);
    player.GossipMenuAddItem(GOSSIP_ICON_INTERACT_1, "I have a question.", 3);

    player.GossipSendMenu(1, object, 0);
};

RegisterGameObjectEvent(1234, GameObjectEvents.GAMEOBJECT_EVENT_ON_GOSSIP_HELLO, (...args) => MyCustomGossip(...args));
```

In this example, we define a custom gossip event for a specific GameObject with entry ID 1234. When the player interacts with this GameObject, the `MyCustomGossip` function will be called.

Inside the function, we first clear the player's gossip menu using `GossipClearMenu()`. Then, we add three gossip items using `GossipMenuAddItem()`. Each item has an icon, a text, and a unique identifier.

Finally, we send the gossip menu to the player using `GossipSendMenu()`, passing the GameObject as the sender and 0 as the text ID (since we're not using any predefined text).

With this script, when the player interacts with the GameObject, they will see a custom gossip menu with three options to choose from.

See also: [Player:GossipMenuAddItem], [Player:GossipSendMenu], [Player:GossipAddQuests], [Player:GossipComplete]

## GossipComplete

Closes the currently open Gossip Menu for the player. This method is typically used after the player has made a selection from the Gossip Menu, and the script has processed the player's choice.

### Parameters

This method does not take any parameters.

### Returns

This method does not return any value.

### Example Usage

Here's an example of how to use the `GossipComplete` method in a script that handles a Gossip Menu interaction:

```typescript
const GOSSIP_MENU_OPTION_1 = 0;
const GOSSIP_MENU_OPTION_2 = 1;

const MyGossipMenu: gossip_select = (event: number, player: Player, creature: Creature, sender: GossipSender, action: number, code: string): void => {
    switch (action) {
        case GOSSIP_MENU_OPTION_1:
            // Handle option 1
            player.AddItem(12345, 1); // Give the player an item
            player.SendBroadcastMessage("You have chosen option 1 and received an item!");
            player.GossipComplete(); // Close the Gossip Menu
            break;

        case GOSSIP_MENU_OPTION_2:
            // Handle option 2
            const questId = 1234;
            if (player.CanCompleteQuest(questId)) {
                player.CompleteQuest(questId); // Complete a quest
                player.SendBroadcastMessage("You have chosen option 2 and completed a quest!");
            } else {
                player.SendBroadcastMessage("You do not meet the requirements to complete the quest.");
            }
            player.GossipComplete(); // Close the Gossip Menu
            break;

        default:
            player.SendBroadcastMessage("Invalid option selected.");
            player.GossipComplete(); // Close the Gossip Menu
            break;
    }
};

RegisterCreatureGossipEvent(12345, MyGossipMenu);
```

In this example, the script registers a Gossip Menu event for a specific creature (with entry ID 12345). When the player interacts with the creature and selects an option from the Gossip Menu, the corresponding case block is executed.

If the player selects option 1, they receive an item and a broadcast message is sent to them. After processing the option, the `GossipComplete` method is called to close the Gossip Menu.

If the player selects option 2, the script checks if the player meets the requirements to complete a specific quest. If the requirements are met, the quest is completed, and a broadcast message is sent to the player. Otherwise, a message is sent indicating that the player does not meet the requirements. Regardless of the outcome, the `GossipComplete` method is called to close the Gossip Menu.

If an invalid option is selected, a default message is sent to the player, and the `GossipComplete` method is called to close the Gossip Menu.

By calling `GossipComplete`, the script ensures that the Gossip Menu is properly closed after processing the player's selection, preventing the menu from remaining open unintentionally.

See also: [Player:GossipMenuAddItem](./player-gossip-menu-add-item.md), [Player:GossipAddQuests](./player-gossip-add-quests.md), [Player:GossipSendMenu](./player-gossip-send-menu.md), [Player:GossipClearMenu](./player-gossip-clear-menu.md)

## GossipMenuAddItem

Adds a new item to the gossip menu shown to the [Player] on the next call to [Player:GossipSendMenu].

### Parameters

- `icon`: number - The icon ID to display next to the gossip item.
- `msg`: string - The text to display for the gossip item.
- `sender`: number - A number passed directly to the gossip selection handler. Internally used for database gossip handling.
- `intid`: number - A number passed directly to the gossip selection handler. Internally used for database gossip handling.
- `code`: boolean (optional) - Specifies whether to show a box to insert text. The player-inserted text is passed to the gossip selection handler.
- `popup`: string (optional) - The text to display in the popup box when `code` is set to true.
- `money`: number (optional) - The amount of money the player needs to have to click the option. An error message is shown if the player doesn't have enough money. Note that the money amount is only checked client-side and is not removed from the player. You will need to check again in your code before taking action.

### Example Usage

```typescript
const GOSSIP_ICON_CHAT = 0;
const GOSSIP_ICON_VENDOR = 1;
const GOSSIP_ICON_TAXI = 2;
const GOSSIP_ICON_TRAINER = 3;
const GOSSIP_ICON_INTERACT_1 = 4;
const GOSSIP_ICON_INTERACT_2 = 5;
const GOSSIP_ICON_MONEY_BAG = 6;
const GOSSIP_ICON_TALK = 7;
const GOSSIP_ICON_TABARD = 8;
const GOSSIP_ICON_BATTLE = 9;

const GOSSIP_SENDER_MAIN = 1;
const INTID_PLAYER_GOLD = 1;
const INTID_PLAYER_ITEMS = 2;
const REQ_MONEY = 1000;

function onGossipHello(event: PlayerGossipHello, player: Player, object: GameObject): boolean {
  player.GossipMenuAddItem(GOSSIP_ICON_CHAT, "Tell me about yourself", GOSSIP_SENDER_MAIN, INTID_PLAYER_GOLD);
  player.GossipMenuAddItem(GOSSIP_ICON_VENDOR, "Show me your wares", GOSSIP_SENDER_MAIN, INTID_PLAYER_ITEMS);
  player.GossipMenuAddItem(GOSSIP_ICON_MONEY_BAG, "I have items to sell", GOSSIP_SENDER_MAIN, INTID_PLAYER_ITEMS, true, "Enter the item IDs (comma-separated):");
  player.GossipMenuAddItem(GOSSIP_ICON_INTERACT_1, "Special service", GOSSIP_SENDER_MAIN, 0, false, "", REQ_MONEY);
  player.GossipSendMenu(1, object, 1);
  return true;
}

function onGossipSelect(event: PlayerGossipSelect, player: Player, object: GameObject, sender: number, action: number, code: string): boolean {
  if (sender === GOSSIP_SENDER_MAIN) {
    if (action === INTID_PLAYER_GOLD) {
      player.SendBroadcastMessage("I am a humble merchant.");
    } else if (action === INTID_PLAYER_ITEMS) {
      if (code) {
        const itemIds = code.split(",").map((id) => parseInt(id.trim(), 10));
        // Process the entered item IDs
        // ...
      } else {
        // Show the vendor's items
        // ...
      }
    } else if (action === 0) {
      if (player.GetCoinage() >= REQ_MONEY) {
        player.ModifyMoney(-REQ_MONEY);
        // Perform the special service
        // ...
      } else {
        player.SendBroadcastMessage("You don't have enough money for the special service.");
      }
    }
  }
  player.GossipComplete();
  return true;
}

RegisterPlayerGossipEvent(1234, 1, GOSSIP_EVENT_ON_HELLO, (event, player, object) => onGossipHello(event, player, object));
RegisterPlayerGossipEvent(1234, 1, GOSSIP_EVENT_ON_SELECT, (event, player, object, sender, action, code) => onGossipSelect(event, player, object, sender, action, code));
```

In this example, the `onGossipHello` function is called when the player interacts with the gossip NPC. It adds several gossip items to the menu using `GossipMenuAddItem`:

1. A chat option with no additional functionality.
2. A vendor option to show the NPC's items for sale.
3. An option to sell items to the NPC, which prompts the player to enter item IDs.
4. A special service option that requires a certain amount of money.

When the player selects a gossip option, the `onGossipSelect` function is called. It handles the different actions based on the `sender` and `action` values. If the player selects the option to sell items, it parses the entered item IDs from the `code` parameter and processes them accordingly.

Note that the money requirement for the special service is checked both in the gossip menu (client-side) and in the `onGossipSelect` function (server-side) to ensure the player has enough money before performing the action.

## GossipSendMenu
Sends the current gossip items of the player to him as a gossip menu with header text from the given textId.
If sender is a [Player](./Player.md) then menu_id is mandatory, otherwise it is not used for anything.
menu_id is the ID used to trigger the OnGossipSelect registered for players. See [Global:RegisterPlayerGossipEvent](./Global.md#registerplayergossipevent)
See also: [Player:GossipMenuAddItem](./Player.md#gossipmenadditem), [Player:GossipAddQuests](./Player.md#gossipaddquests), [Player:GossipComplete](./Player.md#gossipcomplete), [Player:GossipClearMenu](./Player.md#gossipmenuclearmenu)

### Parameters
- npc_text: number - The ID of the npc_text in the database to use as the header text for the gossip menu.
- sender: [Object](./Object.md) - The object sending the gossip menu. If it's a player, menu_id is required.
- menu_id: number - The ID used to trigger the OnGossipSelect event for players. Required if sender is a player.

### Example Usage
Here's an example of how to create a custom gossip menu for a creature that offers players a choice between two rewards:

```typescript
const GOSSIP_TEXTID_REWARD_CHOICE = 100;
const GOSSIP_OPTION_REWARD1 = 0;
const GOSSIP_OPTION_REWARD2 = 1;
const ITEM_REWARD1 = 12345;
const ITEM_REWARD2 = 67890;

const OnGossipHello: creature_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    player.GossipClearMenu();
    player.GossipMenuAddItem(0, "I choose reward 1", GOSSIP_OPTION_REWARD1, 0);
    player.GossipMenuAddItem(0, "I choose reward 2", GOSSIP_OPTION_REWARD2, 0);
    player.GossipSendMenu(GOSSIP_TEXTID_REWARD_CHOICE, creature, 1);
};

const OnGossipSelect: player_event_on_gossip_select = (event: number, player: Player, menu: number, sender: Object, intid: number, code: string) => {
    if (menu != 1) {
        return;
    }

    player.GossipClearMenu();
    
    switch(intid) {
        case GOSSIP_OPTION_REWARD1:
            player.AddItem(ITEM_REWARD1, 1);
            break;
        case GOSSIP_OPTION_REWARD2: 
            player.AddItem(ITEM_REWARD2, 1);
            break;
    }

    player.GossipComplete();
};

RegisterCreatureEvent(12345, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterPlayerGossipEvent(1, (...args) => OnGossipSelect(...args));
```

In this example:
1. When the player interacts with the creature, the OnGossipHello event is triggered. 
2. The existing gossip menu is cleared and two new options are added using GossipMenuAddItem.
3. The gossip menu is sent to the player using GossipSendMenu, specifying the header text ID and menu ID.
4. When the player selects an option, the OnGossipSelect event is triggered with the corresponding menu ID.
5. The menu ID is checked to ensure it matches the expected value.
6. Based on the option selected (intid), the appropriate reward item is given to the player.
7. Finally, GossipComplete is called to close the gossip menu.

## GossipSendPOI
Sends a POI (Point of Interest) to the location on the player's map. This can be used to guide players to a specific location or highlight important areas.

### Parameters
* x: number - The X coordinate of the POI on the map.
* y: number - The Y coordinate of the POI on the map.
* icon: number - The icon ID to use for the POI. You can find a list of icon IDs in the `POI_ICON_` constants.
* flags: number - The flags for the POI. Use the `GOSSIP_POI_` constants to set the desired flags.
* data: number - Additional data for the POI, such as the ID of a creature or gameobject at the POI's location.
* iconText: string - The text to display when the player hovers over the POI icon on the map.

### Example Usage
In this example, we create a script that sends a POI to the location of a rare creature when the player talks to a specific NPC. The POI will have a unique icon, be flagged as important, and display the name of the rare creature when hovered over.

```typescript
const RARE_CREATURE_ENTRY = 12345;
const RARE_CREATURE_NAME = "Elusive Rare Creature";
const NPC_ENTRY = 54321;
const POI_ICON_SKULL = 0; // Customize the icon as needed
const POI_FLAG_IMPORTANT = 1; // Customize the flags as needed

const OnGossipHello: npc_event_on_gossip_hello = (event: number, player: Player, object: GameObject) => {
    if (object.GetEntry() === NPC_ENTRY) {
        const creature = player.GetNearestCreature(RARE_CREATURE_ENTRY, 100); // Check if the rare creature is nearby
        if (creature) {
            const x = creature.GetX();
            const y = creature.GetY();
            player.GossipSendPOI(x, y, POI_ICON_SKULL, POI_FLAG_IMPORTANT, RARE_CREATURE_ENTRY, RARE_CREATURE_NAME);
            player.GossipSendMenu("I've marked the location of the rare creature on your map. Good luck!", object);
        } else {
            player.GossipSendMenu("Sorry, I couldn't find the rare creature nearby. Please try again later.", object);
        }
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_GOSSIP_HELLO, NPC_ENTRY, (...args) => OnGossipHello(...args));
```

In this script:
1. We define constants for the rare creature's entry ID, name, the NPC's entry ID, and the desired POI icon and flags.
2. When the player interacts with the specified NPC (`NPC_ENTRY`), the script checks if the rare creature (`RARE_CREATURE_ENTRY`) is nearby using `GetNearestCreature`.
3. If the rare creature is found, we get its coordinates using `GetX` and `GetY`.
4. We send a POI to the player's map using `GossipSendPOI`, passing the coordinates, icon, flags, creature entry, and name.
5. We send a gossip message to the player indicating that the rare creature's location has been marked on their map.
6. If the rare creature is not found, we send a different gossip message informing the player that the creature couldn't be located.

This script enhances the player's experience by guiding them to the location of a rare creature when they interact with a specific NPC, making it easier for them to find and engage with the creature.

## GroupCreate
Creates a new [Group](./group.md) with the [Player] as the group leader and the invited [Player] as the initial member.

### Parameters
* invited: [Player](./player.md) - The player to invite to the newly created group.

### Returns
[Group](./group.md) - The newly created group with the [Player] as the leader.

### Example Usage
This example demonstrates how to create a new group when a player whispers "creategroup" to another player. The invited player will automatically join the group if they are not already in one.

```typescript
const OnWhisper: player_event_on_whisper = (event: number, player: Player, msg: string, type: ChatMsg, lang: Language, playerGuid: number): void => {
    if (msg === "creategroup") {
        const invitedPlayer = GetPlayerByGUID(playerGuid);
        if (invitedPlayer) {
            if (!invitedPlayer.IsInGroup()) {
                const newGroup = player.GroupCreate(invitedPlayer);
                if (newGroup) {
                    player.SendBroadcastMessage(`You have created a new group with ${invitedPlayer.GetName()}.`);
                    invitedPlayer.SendBroadcastMessage(`You have been invited to a new group by ${player.GetName()}.`);
                } else {
                    player.SendBroadcastMessage("Failed to create a new group.");
                }
            } else {
                player.SendBroadcastMessage(`${invitedPlayer.GetName()} is already in a group.`);
            }
        } else {
            player.SendBroadcastMessage("Invalid player specified for group creation.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_WHISPER, (...args) => OnWhisper(...args));
```

In this example:
1. When a player whispers "creategroup" to another player, the `OnWhisper` event is triggered.
2. The script retrieves the invited player using `GetPlayerByGUID` based on the `playerGuid` provided in the event.
3. It checks if the invited player is not already in a group using `IsInGroup()`.
4. If the invited player is not in a group, the script calls `GroupCreate(invitedPlayer)` on the whispering player to create a new group with the invited player.
5. If the group is successfully created, both players receive a broadcast message confirming the group creation.
6. If the invited player is already in a group or if the group creation fails, appropriate messages are sent to the whispering player.

This script allows players to easily create a new group by whispering a specific command to another player, automating the group creation process.

## GroupEventHappens
This method allows a player to complete a quest if they are in a group and the specified game object or creature is the quest credit marker. 

### Parameters
* quest: number - The quest entry ID from the quest_template table. 
* obj: [WorldObject](./worldobject.md) - The WorldObject that gives the quest credit. This can be a `[Creature]` or `[GameObject]`

### Example Usage
This example will complete a group quest when a player interacts with a specific game object, but only if the player is in a group.
```typescript
const QUEST_ENTRY = 1234; 
const QUEST_CREDIT_GO_ENTRY = 5678;

const GOHello : gob_event_on_hello = (event: number, obj: GameObject, player: Player) => {
    const group = player.GetGroup();

    if (obj.GetEntry() === QUEST_CREDIT_GO_ENTRY && group) {
        const members = group.GetMembers();

        members.forEach((member) => {
            if (member.IsInWorld() && member.IsInRange(obj, 10) && member.HasQuest(QUEST_ENTRY)) {
                member.GroupEventHappens(QUEST_ENTRY, obj);
            }
        });
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_HELLO, (...args) => GOHello(...args));
```

In this example:
1. We define constants for the quest entry and the game object that gives quest credit.
2. In the `GAMEOBJECT_EVENT_ON_HELLO` event (triggered when a player interacts with a game object), we first check if the game object interacted with matches our defined entry and if the player is in a group.
3. If the player is in a group, we get all group members.
4. We iterate over each group member and check if they are:
   - In the world (online)
   - Within 10 yards of the game object
   - Currently on the quest
5. If a group member satisfies all these conditions, we call `GroupEventHappens` on them, passing the quest entry and the game object. This will give them credit for the quest.
6. Finally, we register this function to the `GAMEOBJECT_EVENT_ON_HELLO` event.

This script ensures that when a player in a group interacts with the specified game object, all eligible group members within range will receive quest credit, allowing the group to complete the quest together.

## GroupInvite
Invites another player to join the inviting player's group.

### Parameters
* invited: [Player](./player.md) - The player to invite to the group.

### Returns
* boolean - Returns `true` if the invitation was successful, `false` otherwise.

### Example Usage
This example demonstrates how to create a custom command that allows a player to invite another player to their group by targeting them and using the command `.invitetogroup`. If the invitation is successful, a message is sent to both players confirming the invitation.

```typescript
const TARGET_FLAG_UNIT = 0x002;

function isValidTarget(player: Player) {
    const target = player.GetSelection();
    return target && target.IsPlayer() && target.GetGUID() !== player.GetGUID();
}

function OnCommand(player: Player, command: string, args: string[]): boolean {
    if (command === 'invitetogroup') {
        if (!isValidTarget(player)) {
            player.SendBroadcastMessage('You must target another player to invite them to your group.');
            return false;
        }

        const invitedPlayer = player.GetSelection() as Player;

        if (player.IsInGroup()) {
            if (!player.IsGroupLeader()) {
                player.SendBroadcastMessage('You must be the group leader to invite players.');
                return false;
            }
        } else {
            player.GroupCreate();
        }

        if (player.GroupInvite(invitedPlayer)) {
            player.SendBroadcastMessage(`You have invited ${invitedPlayer.GetName()} to join your group.`);
            invitedPlayer.SendBroadcastMessage(`${player.GetName()} has invited you to join their group.`);
        } else {
            player.SendBroadcastMessage(`Failed to invite ${invitedPlayer.GetName()} to your group.`);
        }

        return true;
    }

    return false;
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (event, player, command, args) => OnCommand(player, command, args));
```

In this example:
1. We define a helper function `isValidTarget` to check if the player's target is a valid player to invite (not themselves and an actual player).
2. In the `OnCommand` function, we first check if the command is `invitetogroup`.
3. We then check if the player has a valid target using the `isValidTarget` function. If not, we send a message to the player and return.
4. We get the targeted player using `GetSelection` and cast it to a `Player`.
5. If the inviting player is not in a group, we create a new group for them using `GroupCreate`. If they are in a group but not the leader, we send a message and return.
6. We call `GroupInvite` with the targeted player and check the result.
7. If the invitation was successful, we send confirmation messages to both players. Otherwise, we send a failure message to the inviting player.
8. Finally, we register the `OnCommand` function to handle the `PLAYER_EVENT_ON_COMMAND` event.

This example showcases how to use the `GroupInvite` method, along with other related methods and events, to create a custom command for inviting players to a group.

## HasAchieved
Check if a player has completed a specific achievement by providing the achievement ID.

### Parameters
* achievementId: number - The ID of the achievement to check. You can find achievement IDs in the `achievement` table in the world database.

### Returns
* boolean - Returns `true` if the player has completed the specified achievement, `false` otherwise.

### Example Usage
Let's say we want to grant a special item to players who have completed the "Explore Eastern Kingdoms" achievement (ID: 42).

```typescript
const EASTERN_KINGDOMS_ACHIEVEMENT_ID = 42;
const SPECIAL_ITEM_ENTRY = 12345;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.HasAchieved(EASTERN_KINGDOMS_ACHIEVEMENT_ID)) {
        const itemCount = player.GetItemCount(SPECIAL_ITEM_ENTRY);

        if (itemCount === 0) {
            const item = player.AddItem(SPECIAL_ITEM_ENTRY, 1);

            if (item) {
                player.SendBroadcastMessage("Congratulations on exploring the Eastern Kingdoms! Here's a special item for you.");
            } else {
                player.SendBroadcastMessage("You have explored the Eastern Kingdoms, but your inventory is full. Please make space and relog to receive your special item.");
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:

1. We define the achievement ID for "Explore Eastern Kingdoms" and the entry for the special item we want to grant.

2. In the `OnLogin` event, we check if the player has completed the achievement using `player.HasAchieved(EASTERN_KINGDOMS_ACHIEVEMENT_ID)`.

3. If the player has completed the achievement, we check if they already have the special item in their inventory using `player.GetItemCount(SPECIAL_ITEM_ENTRY)`.

4. If the player doesn't have the item, we attempt to add it to their inventory using `player.AddItem(SPECIAL_ITEM_ENTRY, 1)`.

5. If the item is successfully added, we send a congratulatory message to the player. If the item cannot be added (e.g., due to a full inventory), we inform the player to make space and relog to receive the item.

This example demonstrates how to use the `HasAchieved` method to check if a player has completed a specific achievement and grant a reward based on that completion.

## HasAtLoginFlag
Checks if the player has a specific login flag set. Login flags are used to perform certain actions when a player logs in, such as showing a cinematic, resetting talents, or renaming the character.

### Parameters
- flag: number - The login flag to check. Possible values:
  - 0x01 (1): AT_LOGIN_RENAME
  - 0x02 (2): AT_LOGIN_RESET_SPELLS
  - 0x04 (4): AT_LOGIN_RESET_TALENTS
  - 0x08 (8): AT_LOGIN_CUSTOMIZE
  - 0x10 (16): AT_LOGIN_RESET_PET_TALENTS
  - 0x20 (32): AT_LOGIN_FIRST
  - 0x40 (64): AT_LOGIN_CHANGE_FACTION
  - 0x80 (128): AT_LOGIN_CHANGE_RACE
  - 0x100 (256): AT_LOGIN_RESURRECT
  - 0x200 (512): AT_LOGIN_RESTORE_DEL_ITEMS

### Returns
- boolean: Returns true if the player has the specified login flag set, false otherwise.

### Example Usage
This example checks if a player needs to rename their character upon login and performs the necessary actions.

```typescript
const AT_LOGIN_RENAME = 0x01;

function OnLogin(event: PlayerEvents, player: Player) {
    if (player.HasAtLoginFlag(AT_LOGIN_RENAME)) {
        player.SendAddonMessage("You need to rename your character.");
        player.SetAtLoginFlag(AT_LOGIN_RENAME, true);
        
        // Prevent the player from moving until they rename their character
        player.SetMovement(MOVE_ROOT);
        
        // Start a rename request
        player.SetRename(true);
        
        // Set a timer to check if the player has renamed their character after 1 minute
        player.RegisterEvent(CheckRename, 1000 * 60, 1, player);
    }
}

function CheckRename(player: Player) {
    if (player.HasAtLoginFlag(AT_LOGIN_RENAME)) {
        player.SendAddonMessage("You have been disconnected for not renaming your character.");
        player.KickPlayer();
    } else {
        // Player has renamed their character, remove the movement restriction
        player.SetMovement(MOVE_UNROOT);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example:
1. When a player logs in, the script checks if they have the `AT_LOGIN_RENAME` flag set.
2. If the flag is set, the player is informed that they need to rename their character.
3. The `AT_LOGIN_RENAME` flag is set again to ensure it persists after the rename.
4. The player is rooted in place to prevent them from moving until they rename their character.
5. A rename request is started for the player.
6. A timer is set to check if the player has renamed their character after 1 minute.
7. If the player hasn't renamed their character within 1 minute, they are disconnected.
8. If the player renames their character, the movement restriction is removed, allowing them to play normally.

## HasItem
Checks if the player has a specific item in their inventory or bank.

### Parameters
* itemId: number - The entry of the item to check for.
* count?: number - (Optional) The minimum amount of the item required. Defaults to 1.
* check_bank?: boolean - (Optional) If true, the bank will also be checked. Defaults to false.

### Returns
* boolean - Returns true if the player has the specified amount of the item, false otherwise.

### Example Usage
Check if the player has the required items to complete a quest:
```typescript
const QUEST_ITEM_1 = 12345;
const QUEST_ITEM_2 = 67890;
const QUEST_ITEM_1_COUNT = 5;
const QUEST_ITEM_2_COUNT = 1;

const CompleteQuestScript: player_event_on_quest_complete = (event: number, player: Player, quest: Quest) => {
    const hasRequiredItems = player.HasItem(QUEST_ITEM_1, QUEST_ITEM_1_COUNT) && player.HasItem(QUEST_ITEM_2, QUEST_ITEM_2_COUNT);

    if (!hasRequiredItems) {
        player.SendBroadcastMessage("You do not have the required items to complete this quest.");
        quest.FailQuest();
        return;
    }

    player.RemoveItem(QUEST_ITEM_1, QUEST_ITEM_1_COUNT);
    player.RemoveItem(QUEST_ITEM_2, QUEST_ITEM_2_COUNT);

    // Reward the player with experience and gold
    player.GiveXP(1000);
    player.ModifyMoney(100 * 10000); // 100 gold

    quest.CompleteQuest();
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => CompleteQuestScript(...args));
```

In this example, when a player completes a quest, the script checks if the player has the required quest items (QUEST_ITEM_1 and QUEST_ITEM_2) in the specified amounts. If the player does not have the required items, the quest is failed, and the player is informed via a broadcast message. If the player has the required items, the items are removed from the player's inventory, and the player is rewarded with experience and gold. Finally, the quest is marked as completed.

## HasQuest
Checks if the player has an active quest by the provided quest ID.

### Parameters
* questId: number - The ID of the quest to check.

### Returns
* boolean - Returns 'true' if the player has the specified quest active, 'false' otherwise.

### Example Usage
In this example, we'll create a script that checks if the player has a specific quest active. If the player has the quest, they will receive a special item and a notification. If they don't have the quest, they will receive a message encouraging them to accept the quest.

```typescript
const SPECIAL_QUEST_ID = 1234;
const SPECIAL_ITEM_ENTRY = 5678;
const SPECIAL_ITEM_COUNT = 1;

const SpecialQuestCheck: player_event_on_login = (event: number, player: Player) => {
    if (player.HasQuest(SPECIAL_QUEST_ID)) {
        const item = player.AddItem(SPECIAL_ITEM_ENTRY, SPECIAL_ITEM_COUNT);
        if (item) {
            player.SendBroadcastMessage(`You have received a special item for having the quest ${SPECIAL_QUEST_ID} active!`);
        } else {
            player.SendBroadcastMessage(`You have the quest ${SPECIAL_QUEST_ID} active, but your inventory is full. Make space and log in again to receive your special item!`);
        }
    } else {
        player.SendBroadcastMessage(`You don't have the special quest ${SPECIAL_QUEST_ID} active. Accept the quest to receive a special item!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => SpecialQuestCheck(...args));
```

In this script, we define the `SPECIAL_QUEST_ID`, `SPECIAL_ITEM_ENTRY`, and `SPECIAL_ITEM_COUNT` constants for the quest ID, item entry, and item count, respectively.

When a player logs in, the `SpecialQuestCheck` function is called. It checks if the player has the `SPECIAL_QUEST_ID` active using the `HasQuest` method. If the player has the quest active, it attempts to add the `SPECIAL_ITEM_ENTRY` to the player's inventory using the `AddItem` method. If the item is successfully added, the player receives a broadcast message confirming they received the special item. If the player's inventory is full, they receive a message asking them to make space and log in again.

If the player doesn't have the special quest active, they receive a message encouraging them to accept the quest to receive the special item.

This example demonstrates how the `HasQuest` method can be used in combination with other methods to create engaging and interactive scripts for players based on their quest progress.

## HasQuestForGO
This method checks if the player has a quest that involves a specific game object. It is useful when creating custom game object scripts that require the player to have a specific quest before interacting with the object.

### Parameters
* entry: number - The entry ID of the game object to check for associated quests.

### Returns
* boolean - Returns true if the player has a quest associated with the specified game object, false otherwise.

### Example Usage
In this example, we create a custom script for a game object that requires the player to have a specific quest before they can interact with it. If the player has the required quest, they will be able to use the game object and receive a reward. If they don't have the quest, they will receive a message indicating that they need to obtain the quest first.

```typescript
const GAME_OBJECT_ENTRY = 12345;
const REQUIRED_QUEST_ENTRY = 67890;
const REWARD_ITEM_ENTRY = 54321;
const REWARD_ITEM_COUNT = 1;

const GameObjectUse = (event: GameObjectEvents, player: Player, gameObject: GameObject) => {
    if (gameObject.GetEntry() === GAME_OBJECT_ENTRY) {
        if (player.HasQuestForGO(GAME_OBJECT_ENTRY)) {
            player.SendBroadcastMessage("You have the required quest. Here's your reward!");
            const rewardItem = player.AddItem(REWARD_ITEM_ENTRY, REWARD_ITEM_COUNT);
            if (rewardItem) {
                player.SendBroadcastMessage(`You received ${rewardItem.GetName()}`);
            } else {
                player.SendBroadcastMessage("Failed to add reward item to your inventory.");
            }
        } else {
            player.SendBroadcastMessage("You don't have the required quest to use this object. Please obtain the quest first!");
        }
    }
};

RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, GameObjectUse);
```

In this script:
1. We define constants for the game object entry, required quest entry, reward item entry, and reward item count.
2. We register a game object event handler for the `GAMEOBJECT_EVENT_ON_USE` event.
3. When a player uses the game object, we check if the game object's entry matches the specified entry.
4. If the entry matches, we use the `HasQuestForGO` method to check if the player has the required quest.
5. If the player has the quest, we send them a message indicating that they have the required quest and reward them with an item using the `AddItem` method.
6. If the item is successfully added to the player's inventory, we send a message with the item's name. Otherwise, we send a message indicating that the item couldn't be added.
7. If the player doesn't have the required quest, we send them a message indicating that they need to obtain the quest first.

This example demonstrates how the `HasQuestForGO` method can be used in conjunction with other player methods and game events to create custom game object interactions based on quest requirements.

## HasQuestForItem
This method checks if the player has a quest that requires the specified item.

### Parameters
* entry: number - The item entry to check for.

### Returns
* boolean - Returns 'true' if the player has a quest that requires the specified item, 'false' otherwise.

### Example Usage
This example script will check if the player has a quest that requires the item they are trying to sell to a vendor. If they do, it will prevent the sale and send a message to the player.

```typescript
const ItemEntry = 12345; // Replace with the desired item entry

const OnSellItem: player_event_on_sell_item = (event: number, player: Player, vendor: Creature, item: Item, count: number) => {
    if (player.HasQuestForItem(item.GetEntry())) {
        player.SendBroadcastMessage(`You cannot sell this item as it is required for a quest.`);
        player.SendAreaTriggerMessage(`You cannot sell this item as it is required for a quest.`);
        return 1; // Prevent the sale
    }
    return 0; // Allow the sale
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SELL_ITEM, (...args) => OnSellItem(...args));
```

In this example:
1. We define the item entry we want to check for in the `ItemEntry` constant. Replace it with the desired item entry.
2. We register the `OnSellItem` event handler using `RegisterPlayerEvent` and the `PlayerEvents.PLAYER_EVENT_ON_SELL_ITEM` event.
3. Inside the event handler, we use the `HasQuestForItem` method to check if the player has a quest that requires the item they are trying to sell.
4. If the player has a quest for the item:
   - We send a broadcast message and an area trigger message to the player, informing them that they cannot sell the item because it is required for a quest.
   - We return 1 to prevent the sale of the item.
5. If the player does not have a quest for the item, we return 0 to allow the sale.

This script ensures that players cannot accidentally sell items that are required for their active quests. It provides a helpful message to the player and prevents the sale of the quest item.

## HasSkill
Checks if the player has a specific skill by the skill ID.

### Parameters
* skill: number - The ID of the skill to check.

### Returns
* boolean - Returns 'true' if the player has the specified skill, 'false' otherwise.

### Example Usage
This example demonstrates how to check if a player has the required skill to perform a specific action, such as mining a node or skinning a creature.

```typescript
const MINING_SKILL_ID = 186;
const REQUIRED_MINING_SKILL = 250;

const onGameObjectUse: on_gameobject_use = (event: number, player: Player, gameObject: GameObject) => {
    const COPPER_VEIN_ENTRY = 1731;
    const TIN_VEIN_ENTRY = 1732;
    const IRON_VEIN_ENTRY = 1735;

    if (gameObject.GetEntry() === COPPER_VEIN_ENTRY || gameObject.GetEntry() === TIN_VEIN_ENTRY || gameObject.GetEntry() === IRON_VEIN_ENTRY) {
        if (player.HasSkill(MINING_SKILL_ID)) {
            const playerMiningSkill = player.GetSkillValue(MINING_SKILL_ID);

            if (playerMiningSkill >= REQUIRED_MINING_SKILL) {
                // Player has the required mining skill, allow them to mine the node
                player.SendBroadcastMessage("You successfully mined the node!");
                // Add your mining logic here, such as giving the player ore items or experience
            } else {
                player.SendBroadcastMessage("Your mining skill is too low to mine this node.");
            }
        } else {
            player.SendBroadcastMessage("You do not have the mining skill.");
        }
    }
};

RegisterGameObjectEvent(0, GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (...args) => onGameObjectUse(...args));
```

In this example, when a player interacts with a specific mining node (copper, tin, or iron vein), the script checks if the player has the mining skill using the `HasSkill()` method. If the player has the mining skill, it further checks if their skill level is high enough to mine the node. If the player meets the skill requirements, they are allowed to mine the node, and a success message is sent to the player. Otherwise, appropriate messages are sent to inform the player that their mining skill is too low or they do not have the mining skill at all.

This example showcases how the `HasSkill()` method can be used in combination with other methods and game events to create more complex and interactive gameplay mechanics based on a player's skills and proficiencies.

## HasSpell
Checks if the player has a specific spell by the spell ID.

### Parameters
* spellId: number - The ID of the spell to check for.

### Returns
* boolean - Returns 'true' if the player has the specified spell, 'false' otherwise.

### Example Usage
In this example, we'll create a script that checks if a player has a specific spell when they enter the world. If they don't have the spell, it will be taught to them.

```typescript
const SPELL_ID = 12345; // Replace with the desired spell ID

const OnPlayerEnterWorld: player_event_on_enter_world = (event: number, player: Player) => {
    if (!player.HasSpell(SPELL_ID)) {
        // Player doesn't have the spell, teach it to them
        player.LearnSpell(SPELL_ID);
        player.SendBroadcastMessage(`You have been taught the spell with ID ${SPELL_ID}.`);
    } else {
        // Player already has the spell
        player.SendBroadcastMessage(`You already know the spell with ID ${SPELL_ID}.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_WORLD, (...args) => OnPlayerEnterWorld(...args));
```

In this script:
1. We define the desired spell ID in the `SPELL_ID` constant.
2. We register the `OnPlayerEnterWorld` event handler using `RegisterPlayerEvent` and the `PLAYER_EVENT_ON_ENTER_WORLD` event.
3. Inside the event handler, we use the `HasSpell` method to check if the player has the specified spell.
4. If the player doesn't have the spell, we use the `LearnSpell` method to teach the spell to the player and send them a broadcast message informing them about it.
5. If the player already has the spell, we send them a broadcast message indicating that they already know the spell.

This script ensures that the player always has the specified spell when they enter the world. If they don't have it, the script will teach it to them automatically.

## HasSpellCooldown
Check if a spell is currently on cooldown for the player.

### Parameters
* spellId: number - The ID of the spell to check the cooldown for.

### Returns
* boolean - Returns 'true' if the spell is currently on cooldown, 'false' otherwise.

### Example Usage
Script to check if a player has a specific spell on cooldown and perform actions based on the result.
```typescript
const SPELL_ID = 12345; // Replace with the desired spell ID
const COOLDOWN_MESSAGE = "The spell is currently on cooldown. Please wait before using it again.";
const READY_MESSAGE = "The spell is ready to be used!";

const onSpellCast: player_event_on_cast_spell = (event: number, player: Player, spell: Spell) => {
    if (spell.GetEntry() === SPELL_ID) {
        if (player.HasSpellCooldown(SPELL_ID)) {
            player.SendBroadcastMessage(COOLDOWN_MESSAGE);
            player.InterruptSpell(); // Interrupt the spell cast if it's on cooldown
        } else {
            player.SendBroadcastMessage(READY_MESSAGE);
            // Perform additional actions when the spell is ready to be used
            // For example, apply a buff or grant a temporary power-up
            const BUFF_SPELL_ID = 54321; // Replace with the desired buff spell ID
            player.CastSpell(player, BUFF_SPELL_ID, true);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => onSpellCast(...args));
```

In this example:
1. We define the specific spell ID (`SPELL_ID`) that we want to check the cooldown for.
2. We define messages to send to the player based on whether the spell is on cooldown or ready to be used.
3. In the `onSpellCast` event callback, we check if the cast spell matches the desired spell ID.
4. If the spell is on cooldown (`player.HasSpellCooldown(SPELL_ID)` returns `true`), we send the `COOLDOWN_MESSAGE` to the player and interrupt the spell cast using `player.InterruptSpell()`.
5. If the spell is not on cooldown (`player.HasSpellCooldown(SPELL_ID)` returns `false`), we send the `READY_MESSAGE` to the player.
6. We can perform additional actions when the spell is ready to be used, such as applying a buff or granting a temporary power-up to the player. In this example, we cast a buff spell (`BUFF_SPELL_ID`) on the player using `player.CastSpell(player, BUFF_SPELL_ID, true)`.
7. Finally, we register the `onSpellCast` callback function to the `PLAYER_EVENT_ON_CAST_SPELL` event using `RegisterPlayerEvent()`.

This script demonstrates how to use the `HasSpellCooldown` method to check if a specific spell is on cooldown for the player and perform different actions based on the result. It provides a practical example of managing spell cooldowns and enhancing gameplay by applying buffs or power-ups when the spell is ready to be used.

## HasTalent
Checks if the player has a specific talent in a given talent specialization.

### Parameters
* spellId: number - The spell ID of the talent to check for.
* spec: number - The talent specialization to check in (0-2).

### Returns
* boolean - Returns 'true' if the player has the specified talent in the given spec, 'false' otherwise.

### Example Usage
Check if the player has a specific talent before granting bonus loot.
```typescript
const JUDGEMENT_OF_LIGHT_TALENT = 20185;
const EXTRA_LOOT_ITEM_ENTRY = 123456;
const EXTRA_LOOT_ITEM_COUNT = 1;

const BonusLootWithTalent: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    const PROTECTION_PALADIN_SPEC = 2;
    
    if (player.GetClass() == Classes.CLASS_PALADIN) {
        if (player.HasTalent(JUDGEMENT_OF_LIGHT_TALENT, PROTECTION_PALADIN_SPEC)) {
            const lootedItem = player.GetItemByEntry(item.GetEntry());
            if (lootedItem) {
                const lootedItemCount = lootedItem.GetCount();
                if (lootedItemCount >= 5) {
                    player.AddItem(EXTRA_LOOT_ITEM_ENTRY, EXTRA_LOOT_ITEM_COUNT);
                    player.SendBroadcastMessage("You received bonus loot for having the Judgement of Light talent!");
                }
            }
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => BonusLootWithTalent(...args));
```

In this example, whenever a player loots an item, the script checks if the player is a Paladin and has the Judgement of Light talent in the Protection specialization. If the player has the talent and has looted at least 5 of the same item, they are granted an extra item as a bonus reward.

This script demonstrates how to use the `HasTalent` method to check for a specific talent in a given specialization, and how to combine it with other methods like `GetClass`, `GetItemByEntry`, and `GetCount` to create more complex loot bonus conditions based on the player's talents and looted items.

## HasTitle
Checks if the player has a specific title by the title ID.

### Parameters
* titleId: number - The ID of the title to check.

### Returns
* boolean - Returns 'true' if the player has the title, 'false' otherwise.

### Example Usage
Check if the player has the "Jenkins" title and grant a special item if they do.

```typescript
const JENKINS_TITLE_ID = 143;
const SPECIAL_ITEM_ENTRY = 12345;

const OnPlayerLogin: player_event_on_login = (event: PlayerEvents, player: Player) => {
    if (player.HasTitle(JENKINS_TITLE_ID)) {
        const item = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
        if (item) {
            player.SendBroadcastMessage("You have been granted a special item for having the 'Jenkins' title!");
        } else {
            player.SendBroadcastMessage("You have the 'Jenkins' title, but your inventory is full. Please make space and log in again to receive your special item.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnPlayerLogin);
```

In this example:
1. We define constants for the "Jenkins" title ID and the special item entry.
2. We register a player event handler for the `PLAYER_EVENT_ON_LOGIN` event.
3. When a player logs in, we check if they have the "Jenkins" title using the `HasTitle()` method.
4. If the player has the title, we attempt to add the special item to their inventory using `AddItem()`.
5. If the item is successfully added, we send a broadcast message to the player informing them about the special item.
6. If the player's inventory is full and the item cannot be added, we send a different message asking them to make space and log in again to receive the item.

This example demonstrates how the `HasTitle()` method can be used in combination with other methods and events to create a custom script that rewards players for having a specific title.

## HasMeleeSpec
Determines if the player's current talent specialization is a melee specialization.

### Parameters
None

### Returns
boolean - Returns `true` if the player's current talent specialization is a melee spec (e.g., Warrior, Rogue, Paladin, Death Knight, Shaman Enhancement, Druid Feral), otherwise returns `false`.

### Example Usage
In this example, we create a script that adjusts the player's melee damage based on their specialization and the type of weapon they have equipped.

```typescript
const MELEE_DAMAGE_BONUS = 0.1; // 10% bonus damage
const MELEE_WEAPON_SUBCLASSES = [0, 1, 4, 5, 6, 7, 8, 10, 13, 15]; // Melee weapon subclasses

const onPlayerDamage: player_event_on_deal_melee_damage = (event: number, player: Player, enemy: Unit, damage: number, spellInfo: SpellInfo) => {
    if (player.HasMeleeSpec()) {
        const mainHandItem = player.GetItemByPos(InventorySlots.INVENTORY_SLOT_BAG_0, InventorySlots.EQUIPMENT_SLOT_MAINHAND);
        const offHandItem = player.GetItemByPos(InventorySlots.INVENTORY_SLOT_BAG_0, InventorySlots.EQUIPMENT_SLOT_OFFHAND);

        if (mainHandItem && MELEE_WEAPON_SUBCLASSES.includes(mainHandItem.GetSubClass())) {
            damage = damage * (1 + MELEE_DAMAGE_BONUS);
        }

        if (offHandItem && MELEE_WEAPON_SUBCLASSES.includes(offHandItem.GetSubClass())) {
            damage = damage * (1 + MELEE_DAMAGE_BONUS);
        }

        player.DealDamage(enemy, damage, true, 0, spellInfo);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEAL_MELEE_DAMAGE, (...args) => onPlayerDamage(...args));
```

In this script:
1. We define constants for the melee damage bonus percentage and an array of melee weapon subclasses.
2. We register the `PLAYER_EVENT_ON_DEAL_MELEE_DAMAGE` event and provide a callback function.
3. Inside the callback, we first check if the player has a melee specialization using the `HasMeleeSpec()` method.
4. If the player has a melee spec, we retrieve their main-hand and off-hand items using `GetItemByPos()`.
5. For each item (main-hand and off-hand), we check if it belongs to one of the melee weapon subclasses.
6. If an item is a melee weapon, we multiply the original damage by `(1 + MELEE_DAMAGE_BONUS)` to apply the bonus damage.
7. Finally, we use `DealDamage()` to apply the adjusted damage to the enemy unit.

This script enhances the player's melee damage output if they have a melee specialization and are using melee weapons, providing an incentive for players to choose melee specializations and use appropriate weapons.

## HasTankSpec
Determines if the player's talent specialization is a tanking spec.

### Parameters
None

### Returns
boolean - Returns true if the player has a tanking specialization, otherwise returns false.

### Example Usage
This example demonstrates how to use the `HasTankSpec()` method to identify if a player is a tank and grant them a bonus item.

```typescript
const TANK_BONUS_ITEM = 12345; // Replace with the actual item entry ID

function OnLootItem(event: PlayerEvents, player: Player, item: Item, count: number): void {
    if (player.HasTankSpec()) {
        // Check if the player already has the tank bonus item
        if (!player.HasItem(TANK_BONUS_ITEM)) {
            // Add the tank bonus item to the player's inventory
            const bonusItem = player.AddItem(TANK_BONUS_ITEM, 1);
            if (bonusItem) {
                player.SendBroadcastMessage("As a tank, you have been granted a bonus item!");
            } else {
                player.SendBroadcastMessage("Your inventory is full. Unable to receive the tank bonus item.");
            }
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, OnLootItem);
```

In this example:
1. We define a constant `TANK_BONUS_ITEM` to represent the entry ID of the bonus item we want to grant to tank players.
2. We create a function `OnLootItem` that is triggered when a player loots an item.
3. Inside the function, we use the `HasTankSpec()` method to check if the player has a tanking specialization.
4. If the player is a tank and doesn't already have the bonus item (checked using `HasItem()`), we proceed to add the bonus item to their inventory using `AddItem()`.
5. If the item is successfully added to the player's inventory (`bonusItem` is truthy), we send a broadcast message to the player informing them that they have received the bonus item.
6. If the player's inventory is full and the item cannot be added, we send a different broadcast message to notify the player.
7. Finally, we register the `OnLootItem` function to the `PLAYER_EVENT_ON_LOOT_ITEM` event using `RegisterPlayerEvent()`.

This example showcases how the `HasTankSpec()` method can be used in combination with other methods like `HasItem()` and `AddItem()` to create a script that rewards tank players with a bonus item when they loot any item, ensuring that they only receive the bonus item once.

## HasHealSpec
This method will return true if the player's current talent specialization is a healing specialization.

### Parameters
None

### Returns
boolean - Returns `true` if the player has a healing specialization, `false` otherwise.

### Example Usage
This example will check if the player has a healing specialization when they enter combat. If they do, it will cast Power Word: Shield on the player.

```typescript
const POWER_WORD_SHIELD_SPELL_ID = 17;

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    if (player.HasHealSpec()) {
        const shield = player.GetSpellInfo(POWER_WORD_SHIELD_SPELL_ID);
        if (shield) {
            if (player.Mana >= shield.ManaCost) {
                if (!player.HasAura(POWER_WORD_SHIELD_SPELL_ID)) {
                    player.CastSpell(player, POWER_WORD_SHIELD_SPELL_ID, true);
                    player.SendBroadcastMessage("You have been shielded by the Light!");
                }
            } else {
                player.SendBroadcastMessage("Not enough mana to cast Power Word: Shield!");
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this example:
1. We define the spell ID for Power Word: Shield.
2. When the player enters combat, we check if they have a healing specialization using `HasHealSpec()`.
3. If they do, we get the spell information for Power Word: Shield using `GetSpellInfo()`.
4. We check if the player has enough mana to cast the spell by comparing their current mana to the spell's mana cost.
5. If they have enough mana, we check if the player already has the aura for Power Word: Shield using `HasAura()`.
6. If they don't have the aura, we cast Power Word: Shield on the player using `CastSpell()` and send them a message using `SendBroadcastMessage()`.
7. If they don't have enough mana, we send them a message letting them know.

This script ensures that healers entering combat will always have Power Word: Shield active on them, as long as they have the mana to cast it. It's a simple way to give healers a little extra protection when they enter combat.

## HasCasterSpec
Determines if the player's current talent specialization is a caster spec (such as mage, warlock, priest, etc). This method is useful for adjusting gameplay mechanics, rewards, or challenges based on the player's chosen specialization.

### Parameters
None

### Returns
boolean - Returns `true` if the player has a caster spec, `false` otherwise.

### Example Usage
Adjust the rewards given to a player based on their specialization upon completing a quest.
```typescript
const questCompleteHandler: player_event_on_quest_complete = (event: number, player: Player, quest: Quest): void => {
    const QUEST_ENTRY = 1234;
    const CASTER_REWARD_ITEM = 5678;
    const MELEE_REWARD_ITEM = 9012;
    const HEALER_REWARD_ITEM = 3456;

    if (quest.GetEntry() === QUEST_ENTRY) {
        if (player.HasCasterSpec()) {
            player.AddItem(CASTER_REWARD_ITEM, 1);
            player.SendBroadcastMessage("You have been rewarded with a caster item for completing the quest!");
        } else if (player.GetClass() === Classes.CLASS_PRIEST || player.GetClass() === Classes.CLASS_DRUID) {
            player.AddItem(HEALER_REWARD_ITEM, 1);
            player.SendBroadcastMessage("You have been rewarded with a healer item for completing the quest!");
        } else {
            player.AddItem(MELEE_REWARD_ITEM, 1);
            player.SendBroadcastMessage("You have been rewarded with a melee item for completing the quest!");
        }

        player.SendAreaTriggerMessage("Congratulations on completing the quest! Your reward has been added to your inventory.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => questCompleteHandler(...args));
```

In this example, when a player completes a specific quest (identified by `QUEST_ENTRY`), the script checks if the player has a caster specialization using the `HasCasterSpec()` method. If true, the player is rewarded with a caster-specific item (`CASTER_REWARD_ITEM`). If the player is a priest or druid (assuming they are healing specs), they receive a healer-specific item (`HEALER_REWARD_ITEM`). Otherwise, the player is given a melee-specific item (`MELEE_REWARD_ITEM`).

The script also sends a broadcast message to the player, informing them of the specific reward they received, and an area trigger message congratulating them on completing the quest and notifying them that the reward has been added to their inventory.

This example demonstrates how the `HasCasterSpec()` method can be used in conjunction with other player-related methods and game events to create a more dynamic and tailored experience for players based on their chosen specialization.

## InArena
This method checks if the player is currently in an arena. It is useful to check if the player is in an arena before applying certain mechanics or rewards that should only work inside or outside of arenas.

### Parameters
None

### Returns
boolean - Returns `true` if the player is in an arena, `false` otherwise.

### Example Usage
This example script rewards players with bonus honor when they kill a player in a battleground, but not in an arena:

```typescript
const BONUS_HONOR = 100;

const OnPVPKill: player_event_on_pvp_kill = (event: number, killer: Player, killed: Player) => {
    if (killer.InBattleground()) {
        if (!killer.InArena()) {
            killer.ModifyHonorPoints(BONUS_HONOR);
            killer.SendBroadcastMessage(`You have been awarded ${BONUS_HONOR} bonus honor for your battleground kill!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_PVP_KILL, (...args) => OnPVPKill(...args));
```

In this example:
1. We define a constant `BONUS_HONOR` with the amount of bonus honor to award.
2. We register a `player_event_on_pvp_kill` event that triggers the `OnPVPKill` function whenever a player kills another player.
3. In the `OnPVPKill` function, we first check if the killer is in a battleground using `InBattleground()`.
4. If the killer is in a battleground, we then use `InArena()` to ensure they are not in an arena.
5. If the killer is in a battleground but not an arena, we award them the `BONUS_HONOR` using `ModifyHonorPoints()`.
6. Finally, we send a broadcast message to the killer informing them of their bonus honor reward.

This script ensures that players only receive the bonus honor for PVP kills in battlegrounds and not in arenas, using the `InArena()` method to differentiate between the two PVP environments.

## InBattleground
This method returns a boolean value indicating whether the player is currently in a battleground or not.

### Parameters
None

### Returns
* boolean - Returns `true` if the player is in a battleground, `false` otherwise.

### Example Usage
This example demonstrates how to reward players with additional honor points for killing a player while in a battleground.

```typescript
const EXTRA_HONOR_POINTS = 10;

const OnPVPKill: player_event_on_pvp_kill = (event: number, killer: Player, killed: Player) => {
    if (killer.InBattleground()) {
        killer.ModifyHonorPoints(EXTRA_HONOR_POINTS);
        killer.SendBroadcastMessage(`You have been awarded ${EXTRA_HONOR_POINTS} extra honor points for a battleground kill!`);

        // Notify the victim about the extra honor points
        killed.SendBroadcastMessage(`Your opponent was awarded ${EXTRA_HONOR_POINTS} extra honor points for killing you in a battleground.`);

        // Log the event to the server console
        console.log(`Player ${killer.GetName()} awarded ${EXTRA_HONOR_POINTS} extra honor points for a battleground kill against ${killed.GetName()}.`);

        // Optionally, you can also broadcast the message to all players in the battleground
        const bgPlayers = killer.GetBattleground().GetPlayers();
        for (const player of bgPlayers) {
            player.SendBroadcastMessage(`${killer.GetName()} was awarded ${EXTRA_HONOR_POINTS} extra honor points for a kill against ${killed.GetName()}!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_PVP_KILL, (...args) => OnPVPKill(...args));
```

In this example:
1. We define a constant `EXTRA_HONOR_POINTS` to specify the number of additional honor points to be awarded for a battleground kill.
2. We register a callback function `OnPVPKill` for the `PLAYER_EVENT_ON_PVP_KILL` event.
3. Inside the callback function, we first check if the killer is in a battleground using the `InBattleground()` method.
4. If the killer is in a battleground, we award them the extra honor points using `ModifyHonorPoints()` and send them a broadcast message informing them about the reward.
5. We also send a broadcast message to the killed player, notifying them that their opponent received extra honor points for killing them in a battleground.
6. We log the event to the server console for tracking and debugging purposes.
7. Optionally, we can also broadcast a message to all players in the battleground using `GetBattleground().GetPlayers()` to inform them about the extra honor points awarded to the killer.

This example showcases how the `InBattleground()` method can be used in combination with other methods and events to create custom battleground-specific mechanics and rewards.

## InBattlegroundQueue
This method checks if the player is currently in a Battleground queue. It's useful to prevent certain actions or provide specific functionality when a player is waiting to enter a Battleground.

### Parameters
None

### Returns
- `true` if the player is in a Battleground queue
- `false` if the player is not in a Battleground queue

### Example Usage
In this example, we'll create a script that prevents players from using a specific item while they are in a Battleground queue. The item will be replaced with a temporary "Queue Pass" item, which will be removed and the original item restored when the player leaves the queue or enters the Battleground. The script will use a custom Player variable to store the original item's entry ID.

```typescript
const RESTRICTED_ITEM_ENTRY = 1234; // Replace with the actual item entry ID
const QUEUE_PASS_ITEM_ENTRY = 5678; // Replace with the actual queue pass item entry ID

const HandleItemUse: player_event_on_item_use = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() === RESTRICTED_ITEM_ENTRY && player.InBattlegroundQueue()) {
        // Store the original item entry in a custom Player variable
        player.SetCustomData('OriginalItemEntry', item.GetEntry().toString());

        // Remove the restricted item from the player's inventory
        player.RemoveItem(item.GetEntry(), 1);

        // Add the temporary queue pass item to the player's inventory
        player.AddItem(QUEUE_PASS_ITEM_ENTRY, 1);

        // Inform the player about the item replacement
        player.SendBroadcastMessage('Your item has been temporarily replaced with a Queue Pass while you are in the Battleground queue.');
    }
};

const RestoreOriginalItem: player_event_on_bg_leave = (event: number, player: Player) => {
    const originalItemEntry = player.GetCustomData('OriginalItemEntry');

    if (originalItemEntry) {
        // Remove the temporary queue pass item from the player's inventory
        player.RemoveItem(QUEUE_PASS_ITEM_ENTRY, 1);

        // Restore the original item to the player's inventory
        player.AddItem(parseInt(originalItemEntry), 1);

        // Remove the custom Player variable
        player.SetCustomData('OriginalItemEntry', '');

        // Inform the player about the item restoration
        player.SendBroadcastMessage('Your original item has been restored.');
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ITEM_USE, (...args) => HandleItemUse(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BG_LEAVE, (...args) => RestoreOriginalItem(...args));
```

This script showcases the usage of the `InBattlegroundQueue()` method to check if a player is in a Battleground queue and perform specific actions accordingly. It also demonstrates how to store and retrieve custom Player variables to preserve information across different events.

## IncompleteQuest
This method sets a quest as incomplete for the player based on the quest entry ID. This can be useful in cases where you want to reset a player's progress on a specific quest, allowing them to start the quest over again.

### Parameters
* entry: number - The entry ID of the quest to set as incomplete.

### Example Usage
Here's an example of how you might use the `IncompleteQuest` method in a script that allows a player to reset a daily quest:

```typescript
const DAILY_QUEST_ENTRY = 12345;

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, object: WorldObject) => {
    if (player.GetQuestStatus(DAILY_QUEST_ENTRY) == QuestStatus.QUEST_STATUS_COMPLETE) {
        player.GossipMenuAddItem(0, "Reset Daily Quest", 1, 0);
    }
    player.GossipSendMenu(1, object, 0);
};

const OnGossipSelect: player_event_on_gossip_select = (event: number, player: Player, object: WorldObject, sender: number, action: number) => {
    if (sender == 1 && action == 0) {
        player.IncompleteQuest(DAILY_QUEST_ENTRY);
        player.SendNotification("Your daily quest has been reset!");
        player.GossipComplete();
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example, when a player interacts with an NPC (triggering the `PLAYER_EVENT_ON_GOSSIP_HELLO` event), the script checks if the player has already completed the daily quest (with entry ID `12345`). If the player has completed the quest, a gossip option is added to allow the player to reset the quest.

When the player selects the gossip option (triggering the `PLAYER_EVENT_ON_GOSSIP_SELECT` event), the script calls the `IncompleteQuest` method with the entry ID of the daily quest. This sets the quest status to incomplete for the player, effectively resetting their progress on the quest. The player is then sent a notification informing them that their daily quest has been reset.

This example demonstrates how the `IncompleteQuest` method can be used in combination with other mod-eluna methods and events to create a script that provides additional functionality to players, such as the ability to reset daily quests.

## IsAFK
Returns whether the player is marked as "Away From Keyboard" (AFK). Players are considered AFK if they have been inactive for a certain period of time or if they have manually set their status to AFK.

### Parameters
None

### Returns
- `boolean` - True if the player is AFK, false otherwise.

### Example Usage
This example demonstrates how to check if a player is AFK and perform actions accordingly.

```typescript
const OnPlayerChat: player_event_on_chat = (event: number, player: Player, msg: string, Type: number, lang: Language): void => {
    // Check if the player is AFK
    if (player.IsAFK()) {
        // Send a whisper to the player
        player.SendBroadcastMessage("You are currently AFK. Your message will not be sent.");
        
        // Notify other players in the same group
        const group = player.GetGroup();
        if (group) {
            group.BroadcastGroupMessage(`${player.GetName()} is AFK and cannot respond to messages.`);
        }
        
        // Log the AFK status
        console.log(`Player ${player.GetName()} is AFK and attempted to send a message.`);
        
        // Prevent the message from being sent
        return;
    }
    
    // If the player is not AFK, process the chat message as usual
    // ...
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => OnPlayerChat(...args));
```

In this example:
1. When a player sends a chat message, the `OnPlayerChat` event is triggered.
2. The script checks if the player is AFK using the `IsAFK()` method.
3. If the player is AFK:
   - A whisper is sent to the player informing them that their message will not be sent due to their AFK status.
   - If the player is in a group, a message is broadcasted to the group notifying them that the player is AFK and cannot respond.
   - The AFK status is logged for reference.
   - The chat message is prevented from being sent by returning from the event handler.
4. If the player is not AFK, the chat message is processed as usual.

This example demonstrates how the `IsAFK()` method can be used to handle AFK players in a chat event, providing appropriate feedback and notifications based on their AFK status.

## IsAcceptingWhispers
This method returns a boolean value indicating whether the player is currently accepting whispers from other players.

### Parameters
None

### Returns
boolean - Returns `true` if the player is accepting whispers, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is accepting whispers and send a message accordingly.

```typescript
const SendWhisperToPlayer: player_event_on_whisper = (event: number, player: Player, msg: string, type: ChatMsg, lang: Language, receiver: Player): void => {
    if (receiver.IsAcceptingWhispers()) {
        // Player is accepting whispers, send the message
        receiver.SendBroadcastMessage(`[Whisper] ${player.GetName()}: ${msg}`);
    } else {
        // Player is not accepting whispers, inform the sender
        player.SendBroadcastMessage(`${receiver.GetName()} is not accepting whispers at the moment.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_WHISPER, (...args) => SendWhisperToPlayer(...args));
```

In this example, when a player sends a whisper to another player, the `SendWhisperToPlayer` function is triggered. It checks if the receiving player is accepting whispers using the `IsAcceptingWhispers()` method.

If the receiving player is accepting whispers, the whisper message is sent to them using `SendBroadcastMessage()`, prefixed with "[Whisper]" and the sender's name.

If the receiving player is not accepting whispers, a message is sent back to the sender informing them that the player is not accepting whispers at the moment.

This script allows players to control whether they want to receive whispers and provides feedback to the sender if the whisper cannot be delivered due to the recipient's settings.

Note: Make sure to register the event handler using `RegisterPlayerEvent()` with the appropriate event type (`PlayerEvents.PLAYER_EVENT_ON_WHISPER`) to ensure that the function is called when a player sends a whisper.

## IsAlliance
Returns whether the player is a member of the Alliance faction or not.

### Parameters
None

### Returns
boolean - Returns `true` if the player is a member of the Alliance faction, `false` otherwise.

### Example Usage
In this example, we will create a script that will reward Alliance players with extra gold when they complete a quest, while Horde players will receive the standard gold reward.

```typescript
const QUEST_ENTRY = 1234;
const EXTRA_GOLD_REWARD = 10;

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number): void => {
    if (quest === QUEST_ENTRY) {
        const questReward = player.GetQuestRewardGold();

        if (player.IsAlliance()) {
            player.ModifyMoney(questReward + EXTRA_GOLD_REWARD * 10000);
            player.SendBroadcastMessage(`You have been rewarded with an extra ${EXTRA_GOLD_REWARD} gold for your service to the Alliance!`);
        } else {
            player.ModifyMoney(questReward);
            player.SendBroadcastMessage(`You have completed the quest and received ${questReward / 10000} gold.`);
        }

        player.CompleteQuest(QUEST_ENTRY);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this script, we first define the `QUEST_ENTRY` constant to specify the ID of the quest we want to modify the rewards for, and the `EXTRA_GOLD_REWARD` constant to determine the amount of extra gold Alliance players will receive.

When a player completes a quest, the `OnQuestComplete` event is triggered. We check if the completed quest ID matches the `QUEST_ENTRY` we defined earlier. If it does, we proceed with the reward logic.

We retrieve the standard quest gold reward using the `GetQuestRewardGold()` method. Then, we use the `IsAlliance()` method to determine if the player is a member of the Alliance faction.

If the player is an Alliance member, we modify their money using the `ModifyMoney()` method, adding the standard quest reward and the extra gold reward multiplied by 10,000 (since copper is the base unit in World of Warcraft). We also send a broadcast message to the player informing them of the extra reward they received for their service to the Alliance.

If the player is not an Alliance member (i.e., they are a member of the Horde), we simply modify their money with the standard quest reward and send a broadcast message informing them of the gold they received for completing the quest.

Finally, we mark the quest as completed for the player using the `CompleteQuest()` method.

This example demonstrates how the `IsAlliance()` method can be used to create faction-specific rewards or experiences for players, enhancing the immersion and providing a sense of belonging to their chosen faction.

## IsDND
Returns whether the player has the "Do Not Disturb" flag set. When a player has this flag set, they will not receive whispers or other non-essential communications.

### Parameters
None

### Returns
boolean - 'true' if the player has the "Do Not Disturb" flag set, 'false' otherwise.

### Example Usage
A script that checks if a player has the "Do Not Disturb" flag set before sending them a message about an ongoing world event.
```typescript
const EVENT_MESSAGE = "A special world event is happening now! Come join the festivities!";

const WorldEventNotification: WorldEvents = (event: number, player: Player) => {
    // Check if the player has the "Do Not Disturb" flag set
    if (!player.IsDND()) {
        // If the player does not have the flag set, send them the event message
        player.SendBroadcastMessage(EVENT_MESSAGE);
    } else {
        // If the player has the flag set, log a message indicating that they were not notified
        console.log(`Player ${player.GetName()} has the "Do Not Disturb" flag set and was not notified of the world event.`);
    }
}

// Register the WorldEventNotification function to be called every hour
RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_UPDATE, (event) => {
    // Check if the current time is at the top of the hour
    const currentTime = new Date();
    if (currentTime.getMinutes() === 0) {
        // If it is the top of the hour, iterate through all online players and call the WorldEventNotification function for each one
        for (const [accountId, player] of world.GetAllPlayers()) {
            WorldEventNotification(event, player);
        }
    }
});
```
In this example, the script registers a server event that is triggered every hour. When the event is triggered, the script iterates through all online players and calls the `WorldEventNotification` function for each one. The `WorldEventNotification` function checks if the player has the "Do Not Disturb" flag set using the `IsDND()` method. If the player does not have the flag set, the script sends them a message about an ongoing world event. If the player does have the flag set, the script logs a message indicating that the player was not notified due to their "Do Not Disturb" status.

## IsFalling
Returns a boolean value indicating whether the player is currently falling or not.

### Parameters
None

### Returns
boolean - Returns `true` if the player is currently falling, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is falling and apply fall damage based on the fall time.

```typescript
const FALL_DAMAGE_THRESHOLD = 5; // Minimum fall time in seconds to apply damage
const FALL_DAMAGE_MULTIPLIER = 10; // Damage multiplier per second of falling

let playerFallStartTime: number | null = null;

const onPlayerFallStart: player_event_on_start_fall = (event: number, player: Player): void => {
    playerFallStartTime = os.time(); // Record the start time of the fall
};

const onPlayerFallEnd: player_event_on_end_fall = (event: number, player: Player): void => {
    if (playerFallStartTime !== null) {
        const fallDuration = os.time() - playerFallStartTime; // Calculate the fall duration

        if (fallDuration >= FALL_DAMAGE_THRESHOLD) {
            const fallDamage = (fallDuration - FALL_DAMAGE_THRESHOLD) * FALL_DAMAGE_MULTIPLIER;
            player.DealDamage(player, fallDamage, DamageType.DAMAGE_TYPE_NORMAL); // Apply fall damage to the player
            player.SendBroadcastMessage(`You took ${fallDamage} fall damage!`);
        }

        playerFallStartTime = null; // Reset the fall start time
    }
};

const onPlayerFallCheck: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number): void => {
    if (player.IsFalling()) {
        if (playerFallStartTime === null) {
            // Player started falling
            onPlayerFallStart(event, player);
        }
    } else {
        if (playerFallStartTime !== null) {
            // Player stopped falling
            onPlayerFallEnd(event, player);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => onPlayerFallCheck(...args));
```

In this example:

1. We define constants for the fall damage threshold and multiplier.
2. We initialize a variable `playerFallStartTime` to keep track of when the player started falling.
3. In the `onPlayerFallStart` event handler, we record the start time of the fall when the player starts falling.
4. In the `onPlayerFallEnd` event handler, we calculate the fall duration and apply fall damage to the player if the fall duration exceeds the threshold. We also send a message to the player indicating the amount of fall damage taken.
5. In the `onPlayerFallCheck` event handler, which is triggered whenever the player's zone is updated, we check if the player is currently falling using the `IsFalling()` method.
   - If the player is falling and `playerFallStartTime` is null, it means the player started falling, so we call the `onPlayerFallStart` event handler.
   - If the player is not falling and `playerFallStartTime` is not null, it means the player stopped falling, so we call the `onPlayerFallEnd` event handler.
6. Finally, we register the `onPlayerFallCheck` event handler for the `PLAYER_EVENT_ON_UPDATE_ZONE` event using `RegisterPlayerEvent`.

This script allows you to detect when a player starts and stops falling, calculate the fall duration, and apply fall damage accordingly. You can customize the fall damage threshold and multiplier based on your desired gameplay mechanics.

## IsFlying
Determines if the player is currently flying. This can be useful to check if the player is mounted on a flying mount or in a flying form. 

### Parameters
None

### Returns
boolean - Returns `true` if the player is currently flying, `false` otherwise.

### Example Usage
This example will dismount a player if they are flying in a specific zone.

```typescript
const ORGRIMMAR_ZONE_ID = 1637;

const OnUpdateZone: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number) => {
    // Check if the player has entered Orgrimmar
    if (newZone === ORGRIMMAR_ZONE_ID) {
        // Check if the player is currently flying
        if (player.IsFlying()) {
            // Dismount the player
            player.Dismount();
            
            // Send a message to the player
            player.SendBroadcastMessage("Flying is not allowed in Orgrimmar. You have been dismounted.");
            
            // Play a sound to the player
            player.PlayDirectSound(8192, player);
            
            // Add a cooldown to the player's flying mount
            const SWIFT_PURPLE_WINDRIDER_ENTRY = 32345;
            player.AddSpellCooldown(SWIFT_PURPLE_WINDRIDER_ENTRY, 0, 60000);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, OnUpdateZone);
```

In this example, when a player enters the Orgrimmar zone (zone ID 1637), the script checks if the player is currently flying using the `IsFlying()` method. If the player is flying, the script does the following:

1. Dismounts the player using the `Dismount()` method.
2. Sends a message to the player using the `SendBroadcastMessage()` method to inform them that flying is not allowed in Orgrimmar.
3. Plays a sound to the player using the `PlayDirectSound()` method with the sound ID 8192.
4. Adds a cooldown to the player's flying mount (in this case, Swift Purple Windrider with entry ID 32345) using the `AddSpellCooldown()` method. The cooldown is set to 60000 milliseconds (1 minute).

This script ensures that players are not flying within Orgrimmar and provides feedback to the player when they are dismounted.

## IsGM
Returns 'true' if the [Player] is a Game Master, 'false' otherwise.

Note: This is only true when the GM tag is activated! For an alternative, see [Player:GetGMRank](./player.md#getgmrank).

### Returns
boolean - 'true' if the player is a GM, 'false' otherwise.

### Example Usage
This example demonstrates how to use the `IsGM()` method to grant additional rewards to non-GM players who participate in a special event.

```typescript
const EVENT_ITEM_ENTRY = 12345;
const NORMAL_REWARD_COUNT = 1;
const BONUS_REWARD_COUNT = 2;

const OnLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() === EVENT_ITEM_ENTRY) {
        if (!player.IsGM()) {
            // Non-GM players receive bonus rewards
            player.AddItem(EVENT_ITEM_ENTRY, BONUS_REWARD_COUNT);
            player.SendBroadcastMessage("Congratulations! You've received bonus rewards for participating in the event.");
        } else {
            // GM players receive the normal amount of rewards
            player.AddItem(EVENT_ITEM_ENTRY, NORMAL_REWARD_COUNT);
            player.SendBroadcastMessage("Thank you for testing the event! You've received the standard reward.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnLootItem(...args));
```

In this example:
1. When a player loots an item with the entry `EVENT_ITEM_ENTRY`, the script checks if the player is a GM using the `IsGM()` method.
2. If the player is not a GM, they receive bonus rewards (`BONUS_REWARD_COUNT`) for participating in the event, and a broadcast message is sent to inform them.
3. If the player is a GM, they receive the normal amount of rewards (`NORMAL_REWARD_COUNT`), and a different broadcast message is sent to thank them for testing the event.

This script encourages non-GM players to participate in the event by offering bonus rewards while ensuring that GM players who are testing the event receive the standard rewards.

## IsGMChat
Determines if the [Player] has GM chat enabled.

### Parameters
None

### Returns
boolean - 'true' if the [Player] has GM chat enabled, 'false' otherwise.

### Example Usage
This example demonstrates how to check if a player has GM chat enabled and perform different actions based on the result.

```typescript
const SPECIAL_ITEM_ENTRY = 12345;

const onPlayerChat: player_event_on_chat = (event: number, player: Player, msg: string, Type: ChatMsg, lang: Language): void => {
    if (player.IsGMChat()) {
        // Player has GM chat enabled
        if (msg.toLowerCase() === '!special') {
            // Give the player a special item
            const item = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
            if (item) {
                player.SendBroadcastMessage('You have received a special item!');
            } else {
                player.SendBroadcastMessage('Failed to add the special item to your inventory.');
            }
        } else {
            player.SendBroadcastMessage('Unknown GM command. Available commands: !special');
        }
    } else {
        // Player does not have GM chat enabled
        if (msg.toLowerCase() === '!gm') {
            player.SendBroadcastMessage('You do not have permission to use GM commands.');
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onPlayerChat(...args));
```

In this example, when a player sends a chat message, the script checks if the player has GM chat enabled using the `IsGMChat()` method. If GM chat is enabled and the player types '!special', the script attempts to give the player a special item using `AddItem()`. If the item is successfully added to the player's inventory, a success message is sent to the player. Otherwise, an error message is sent.

If the player does not have GM chat enabled and types '!gm', a message is sent to the player indicating that they do not have permission to use GM commands.

This example showcases how the `IsGMChat()` method can be used in conjunction with other methods and game events to create custom functionality based on the player's GM chat status.

## IsGMVisible
This method checks if the player has GM visibility enabled. When a player has GM visibility enabled, they will be visible to other players even if they have GM mode enabled.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns true if the player has GM visibility enabled, false otherwise.

### Example Usage
This example demonstrates how to check if a player has GM visibility enabled and perform actions based on the result.

```typescript
const onPlayerChat: player_event_on_chat = (event: number, player: Player, msg: string, type: number, lang: Language) => {
    if (player.IsGMVisible()) {
        // Player has GM visibility enabled
        if (msg === "!hidegm") {
            player.SetGMVisible(false);
            player.SendBroadcastMessage("You are now hidden from other players.");
        }
    } else {
        // Player has GM visibility disabled
        if (msg === "!showgm") {
            player.SetGMVisible(true);
            player.SendBroadcastMessage("You are now visible to other players.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onPlayerChat(...args));
```

In this example:
1. We register a player event handler for the `PLAYER_EVENT_ON_CHAT` event.
2. Inside the event handler, we check if the player has GM visibility enabled using `player.IsGMVisible()`.
3. If the player has GM visibility enabled and they type the command "!hidegm", we disable their GM visibility using `player.SetGMVisible(false)` and send them a message indicating that they are now hidden from other players.
4. If the player has GM visibility disabled and they type the command "!showgm", we enable their GM visibility using `player.SetGMVisible(true)` and send them a message indicating that they are now visible to other players.

This script allows players with GM mode to toggle their visibility to other players by using the "!hidegm" and "!showgm" commands. It provides a convenient way for GMs to control their visibility without having to manually adjust their GM mode settings.

## IsGroupVisibleFor
This method checks if the player is visible to their group members. It does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
In this example, we will create a script that will hide a player from their group when they enter a specific area, and make them visible again when they leave that area.

```typescript
const HIDE_AREA_ID = 1234; // Replace with the actual area ID

const onAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaTrigger: AreaTrigger): void => {
    if (areaTrigger.GetEntry() === HIDE_AREA_ID) {
        player.SetPhaseMask(2, true); // Set the player's phase to 2
        player.IsGroupVisibleFor(); // Check if the player is visible to their group
        
        // Inform the player that they are now hidden from their group
        player.SendBroadcastMessage("You have entered a hidden area and are now invisible to your group members.");
    }
};

const onUpdateZone: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number): void => {
    if (player.GetPhaseMask() === 2 && newArea !== HIDE_AREA_ID) {
        player.SetPhaseMask(1, true); // Set the player's phase back to 1
        player.IsGroupVisibleFor(); // Check if the player is visible to their group
        
        // Inform the player that they are now visible to their group
        player.SendBroadcastMessage("You have left the hidden area and are now visible to your group members.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => onAreaTrigger(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => onUpdateZone(...args));
```

In this script, we define a constant `HIDE_AREA_ID` which represents the ID of the area where players should be hidden from their group. You should replace this with the actual area ID you want to use.

When a player enters the area with the specified ID (triggered by the `PLAYER_EVENT_ON_AREA_TRIGGER` event), we set their phase to 2 using `SetPhaseMask(2, true)`. This effectively hides the player from their group members who are not in the same phase. We then call `IsGroupVisibleFor()` to check if the player is still visible to their group (which should return false after setting the phase to 2).

When the player leaves the hidden area (triggered by the `PLAYER_EVENT_ON_UPDATE_ZONE` event), we check if their current phase is 2 and if the new area they entered is not the hidden area. If these conditions are met, we set the player's phase back to 1 using `SetPhaseMask(1, true)`, making them visible to their group again. We then call `IsGroupVisibleFor()` to check if the player is now visible to their group (which should return true after setting the phase back to 1).

We also send broadcast messages to the player to inform them when they enter and leave the hidden area, letting them know their visibility status to their group members.

## IsHonorOrXPTarget
This method checks if the player is eligible to gain honor or experience from the specified unit.

### Parameters
* unit: [Unit](./unit.md) - The unit to check if the player can gain honor or experience from.

### Returns
* boolean - Returns 'true' if the player is eligible for honor or experience gain from the specified unit, 'false' otherwise.

### Example Usage
In this example, we will create a script that rewards players with extra honor and experience when they kill a creature with a specific entry ID.

```typescript
const CREATURE_ENTRY_ID = 123; // Replace with the desired creature entry ID
const EXTRA_HONOR = 100; // Amount of extra honor to award
const EXTRA_XP = 1000; // Amount of extra experience to award

const OnCreatureKill: creature_event_on_killed = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY_ID && killer.IsPlayer()) {
        const player = killer.ToPlayer();
        if (player.IsHonorOrXPTarget(creature)) {
            player.GiveHonor(EXTRA_HONOR);
            player.GiveXP(EXTRA_XP);
            player.SendBroadcastMessage(`You have been awarded an extra ${EXTRA_HONOR} honor and ${EXTRA_XP} experience for killing the special creature!`);
        } else {
            player.SendBroadcastMessage("You are not eligible for extra rewards from this creature.");
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY_ID, CreatureEvents.CREATURE_EVENT_ON_KILLED, (...args) => OnCreatureKill(...args));
```

In this script:
1. We define the specific creature entry ID (`CREATURE_ENTRY_ID`) for which we want to provide extra rewards.
2. We specify the amount of extra honor (`EXTRA_HONOR`) and experience (`EXTRA_XP`) to award.
3. We register a creature event handler for the `CREATURE_EVENT_ON_KILLED` event.
4. Inside the event handler, we check if the killed creature matches the desired entry ID and if the killer is a player.
5. If the conditions are met, we use the `IsHonorOrXPTarget` method to check if the player is eligible for honor or experience gain from the killed creature.
6. If the player is eligible, we award the extra honor using `GiveHonor` and extra experience using `GiveXP` methods. We also send a broadcast message to the player informing them about the extra rewards.
7. If the player is not eligible, we send a different broadcast message indicating that they cannot receive extra rewards from this creature.

This script ensures that players are rewarded with extra honor and experience only when they kill the specified creature and are eligible for those rewards based on the `IsHonorOrXPTarget` method.

## IsHorde
Returns 'true' if the [Player] is a part of the Horde faction, 'false' otherwise.

### Parameters
This method does not take any parameters.

### Returns
boolean - 'true' if the player is part of the Horde faction, 'false' otherwise.

### Example Usage
This example demonstrates how to use the `IsHorde` method to determine a player's faction and apply different actions based on the result.

```typescript
const HORDE_MOUNT_ENTRY = 12345;
const ALLIANCE_MOUNT_ENTRY = 67890;

const onPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    let mountEntry: number;

    if (player.IsHorde()) {
        mountEntry = HORDE_MOUNT_ENTRY;
        player.SendBroadcastMessage("For the Horde! Here's your faction-specific mount.");
    } else {
        mountEntry = ALLIANCE_MOUNT_ENTRY;
        player.SendBroadcastMessage("For the Alliance! Here's your faction-specific mount.");
    }

    const mount = player.AddItem(mountEntry, 1);

    if (mount) {
        player.SendBroadcastMessage(`You have received a ${mount.GetName()}!`);
    } else {
        player.SendBroadcastMessage("Error: Could not add the faction-specific mount to your inventory.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onPlayerLogin(...args));
```

In this example:
1. We define constants for the Horde and Alliance mount entry IDs.
2. In the `onPlayerLogin` event, we use the `IsHorde` method to determine the player's faction.
3. Based on the faction, we set the appropriate mount entry ID and send a faction-specific welcome message to the player.
4. We attempt to add the faction-specific mount to the player's inventory using the `AddItem` method.
5. If the mount is successfully added, we send a message to the player informing them of the received mount. If there's an error adding the mount, we send an error message instead.
6. Finally, we register the `onPlayerLogin` event to be triggered whenever a player logs in.

This example showcases how the `IsHorde` method can be used in combination with other methods and game events to create a more immersive and faction-specific experience for players.

## IsImmuneToDamage
Returns a boolean indicating whether the player is currently immune to all types of damage.

### Parameters
None

### Returns
boolean - Returns `true` if the player is immune to damage, `false` otherwise.

### Example Usage
In this example, we create a script that checks if the player is immune to damage when they enter combat. If they are immune, we grant them a temporary damage bonus and notify them. If they are not immune, we apply a small damage taken increase and notify them.

```typescript
const DAMAGE_BONUS_PERCENTAGE = 0.1;
const DAMAGE_TAKEN_INCREASE_PERCENTAGE = 0.05;
const BONUS_DURATION_SECONDS = 10;

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    if (player.IsImmuneToDamage()) {
        const damageBonus = player.GetFloatValue(PlayerFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS_PCT) + DAMAGE_BONUS_PERCENTAGE;
        player.SetFloatValue(PlayerFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS_PCT, damageBonus);
        player.SendBroadcastMessage(`You are immune to damage! Granting a ${DAMAGE_BONUS_PERCENTAGE * 100}% damage bonus for ${BONUS_DURATION_SECONDS} seconds.`);

        player.DelayFunction((p: Player) => {
            const resetDamageBonus = p.GetFloatValue(PlayerFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS_PCT) - DAMAGE_BONUS_PERCENTAGE;
            p.SetFloatValue(PlayerFields.PLAYER_FIELD_MOD_DAMAGE_DONE_POS_PCT, resetDamageBonus);
            p.SendBroadcastMessage("Your damage bonus has expired.");
        }, BONUS_DURATION_SECONDS * 1000, player);
    } else {
        const damageTakenIncrease = player.GetFloatValue(PlayerFields.PLAYER_FIELD_MOD_DAMAGE_TAKEN_PCT) + DAMAGE_TAKEN_INCREASE_PERCENTAGE;
        player.SetFloatValue(PlayerFields.PLAYER_FIELD_MOD_DAMAGE_TAKEN_PCT, damageTakenIncrease);
        player.SendBroadcastMessage(`You are not immune to damage. Applying a ${DAMAGE_TAKEN_INCREASE_PERCENTAGE * 100}% damage taken increase.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script, we first check if the player is immune to damage using the `IsImmuneToDamage()` method. If they are immune, we grant them a temporary damage bonus by increasing their `PLAYER_FIELD_MOD_DAMAGE_DONE_POS_PCT` value and notify them. We then use `DelayFunction()` to schedule a callback that will reset the damage bonus after the specified duration.

If the player is not immune to damage, we apply a small damage taken increase by modifying their `PLAYER_FIELD_MOD_DAMAGE_TAKEN_PCT` value and notify them.

This script demonstrates how `IsImmuneToDamage()` can be used to check the player's immunity status and make decisions based on that information.

## IsInArenaTeam
This method checks if the player is part of an arena team based on the type provided.

### Parameters
* type: number - The type of arena team to check for (2v2, 3v3, 5v5)
  * 2 - 2v2 Arena
  * 3 - 3v3 Arena
  * 5 - 5v5 Arena

### Returns
* boolean - Returns 'true' if the player is in the specified arena team, 'false' otherwise.

### Example Usage
This example demonstrates how to reward players with bonus honor points when they complete a battleground while being part of an arena team.

```typescript
const BONUS_HONOR_POINTS = 100;

const BattlegroundComplete: player_event_on_battleground_finish = (event: number, player: Player, bgId: number, winnerId: number, loserId: number) => {
    // Check if the player is in a 3v3 arena team
    if (player.IsInArenaTeam(3)) {
        const teamId = player.GetArenaTeamId(3);
        const arenaTeam = ArenaTeam.GetArenaTeamById(teamId);

        // Check if the player's team rating is above 1800
        if (arenaTeam && arenaTeam.GetRating() >= 1800) {
            player.ModifyHonorPoints(BONUS_HONOR_POINTS);
            player.SendBroadcastMessage(`You have been awarded ${BONUS_HONOR_POINTS} bonus honor points for being part of a high-rated 3v3 arena team!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BATTLEGROUND_FINISH, (...args) => BattlegroundComplete(...args));
```

In this example:
1. We define a constant `BONUS_HONOR_POINTS` to store the amount of bonus honor points to be awarded.
2. We register a callback function `BattlegroundComplete` for the `PLAYER_EVENT_ON_BATTLEGROUND_FINISH` event.
3. Inside the callback function, we check if the player is part of a 3v3 arena team using `player.IsInArenaTeam(3)`.
4. If the player is in a 3v3 arena team, we retrieve the team ID using `player.GetArenaTeamId(3)` and then get the arena team object using `ArenaTeam.GetArenaTeamById(teamId)`.
5. We check if the player's arena team has a rating of 1800 or higher.
6. If the player's arena team meets the rating requirement, we award the player with bonus honor points using `player.ModifyHonorPoints(BONUS_HONOR_POINTS)`.
7. Finally, we send a broadcast message to the player informing them about the bonus honor points they received for being part of a high-rated 3v3 arena team.

This example showcases how the `IsInArenaTeam` method can be used in combination with other methods and events to create a more complex and rewarding system for players participating in arena teams and battlegrounds.

## IsInGroup
Returns a boolean value indicating whether the player is currently in a group or not.

### Parameters
None

### Returns
boolean - 'true' if the player is in a group, 'false' otherwise.

### Example Usage
This example demonstrates how to check if a player is in a group and perform actions based on their group status.

```typescript
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.IsInGroup()) {
        // Player is in a group
        const group = player.GetGroup();
        const groupMembers = group.GetMembers();

        player.SendBroadcastMessage(`Welcome back! You are in a group with ${groupMembers.length} members.`);

        // Buff the player if they are in a group
        player.AddAura(1126, player); // Mark of the Wild
        player.AddAura(21562, player); // Prayer of Fortitude

        // Grant bonus experience and reputation gains for being in a group
        player.SetXPRate(player.GetXPRate() * 1.1); // 10% bonus experience
        player.SetRepRate(player.GetRepRate() * 1.05); // 5% bonus reputation

        // Teleport the player to their group leader if they are not the leader
        if (!group.IsLeader(player)) {
            const leader = group.GetLeader();
            player.Teleport(leader.GetMapId(), leader.GetX(), leader.GetY(), leader.GetZ(), leader.GetO());
        }
    } else {
        // Player is not in a group
        player.SendBroadcastMessage("You are not currently in a group. Join or create a group to enjoy additional benefits!");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. When a player logs in, the script checks if they are in a group using the `IsInGroup()` method.
2. If the player is in a group:
   - It retrieves the player's group and the number of group members.
   - It sends a welcome message to the player informing them about their group status.
   - It applies beneficial auras to the player, such as Mark of the Wild and Prayer of Fortitude.
   - It grants bonus experience and reputation gains to the player for being in a group.
   - If the player is not the group leader, it teleports them to the location of the group leader.
3. If the player is not in a group:
   - It sends a message encouraging the player to join or create a group to enjoy additional benefits.

This script showcases how the `IsInGroup()` method can be used in combination with other player and group-related methods to create a more dynamic and engaging experience for players based on their group status.

## IsInGuild
This method returns a boolean value indicating whether the player is currently a member of a guild or not.

### Parameters
None

### Returns
boolean - Returns `true` if the player is in a guild, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsInGuild()` method to check if a player is in a guild and perform different actions based on the result.

```typescript
const GUILD_REWARD_ITEM_ENTRY = 12345;
const GUILD_REWARD_ITEM_COUNT = 5;

const OnPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.IsInGuild()) {
        // Player is in a guild, grant them a special reward item
        const rewardItem = player.AddItem(GUILD_REWARD_ITEM_ENTRY, GUILD_REWARD_ITEM_COUNT);

        if (rewardItem) {
            player.SendBroadcastMessage(`Welcome back, guild member! You have been granted ${GUILD_REWARD_ITEM_COUNT}x ${rewardItem.GetName()}.`);
        } else {
            player.SendBroadcastMessage("Welcome back, guild member! Unfortunately, we couldn't grant you the special reward item due to insufficient inventory space.");
        }
    } else {
        // Player is not in a guild, encourage them to join one
        player.SendBroadcastMessage("Welcome back! You are currently not a member of any guild. Consider joining one to access exclusive benefits and rewards!");

        // Teleport the player to the guild recruitment area
        const GUILD_RECRUITMENT_AREA_MAP = 0;
        const GUILD_RECRUITMENT_AREA_X = -8800.0;
        const GUILD_RECRUITMENT_AREA_Y = 645.0;
        const GUILD_RECRUITMENT_AREA_Z = 94.0;
        player.Teleport(GUILD_RECRUITMENT_AREA_MAP, GUILD_RECRUITMENT_AREA_X, GUILD_RECRUITMENT_AREA_Y, GUILD_RECRUITMENT_AREA_Z, 0.0);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnPlayerLogin(...args));
```

In this example:
1. When a player logs in, the script checks if they are a member of a guild using the `IsInGuild()` method.
2. If the player is in a guild:
   - The script grants them a special reward item (`GUILD_REWARD_ITEM_ENTRY`) with a specified count (`GUILD_REWARD_ITEM_COUNT`) using the `AddItem()` method.
   - If the item is successfully added to the player's inventory, a welcome message is sent to the player informing them about the reward.
   - If the item cannot be added due to insufficient inventory space, an alternative message is sent to the player.
3. If the player is not in a guild:
   - A message is sent to the player encouraging them to join a guild to access exclusive benefits and rewards.
   - The player is then teleported to a designated guild recruitment area using the `Teleport()` method, specified by the map ID and coordinates.
4. The script is registered to the `PLAYER_EVENT_ON_LOGIN` event using `RegisterPlayerEvent()`, ensuring that it is triggered whenever a player logs in.

This example showcases how the `IsInGuild()` method can be used in combination with other player-related methods to create a more engaging and interactive experience for players based on their guild membership status.

## IsInSameGroupWith
This method checks if the player is currently in the same group as another player.

### Parameters
- `player`: [Player](./player.md) - The player to check if they are in the same group.

### Returns
- `boolean` - Returns `true` if the players are in the same group, `false` otherwise.

### Example Usage
This example demonstrates how to check if two players are in the same group and perform actions based on the result.

```typescript
function ProcessGroupReward(player1: Player, player2: Player): void {
    const REWARD_ITEM_ENTRY = 12345;
    const REWARD_ITEM_COUNT = 1;

    if (player1.IsInSameGroupWith(player2)) {
        // Give both players a reward item if they are in the same group
        player1.AddItem(REWARD_ITEM_ENTRY, REWARD_ITEM_COUNT);
        player2.AddItem(REWARD_ITEM_ENTRY, REWARD_ITEM_COUNT);

        // Send a message to both players
        player1.SendBroadcastMessage("You and your group mate have been rewarded!");
        player2.SendBroadcastMessage("You and your group mate have been rewarded!");
    } else {
        // If the players are not in the same group, send them a different message
        player1.SendBroadcastMessage("You must be in the same group as the other player to receive the reward.");
        player2.SendBroadcastMessage("You must be in the same group as the other player to receive the reward.");
    }
}

// Example usage: Check if two players are in the same group when one of them loots a specific item
const OnPlayerLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    const TRIGGER_ITEM_ENTRY = 23456;
    const OTHER_PLAYER_GUID = 12345;

    if (item.GetEntry() === TRIGGER_ITEM_ENTRY) {
        const otherPlayer = GetPlayerByGUID(OTHER_PLAYER_GUID);
        if (otherPlayer) {
            ProcessGroupReward(player, otherPlayer);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, OnPlayerLootItem);
```

In this example, the `ProcessGroupReward` function takes two players as arguments and checks if they are in the same group using the `IsInSameGroupWith` method. If the players are in the same group, they both receive a reward item and a broadcast message. If they are not in the same group, they receive a different message indicating that they must be in the same group to receive the reward.

The `OnPlayerLootItem` event handler is triggered when a player loots an item. It checks if the looted item has a specific entry (`TRIGGER_ITEM_ENTRY`) and if so, it retrieves another player by their GUID (`OTHER_PLAYER_GUID`). If the other player is found, it calls the `ProcessGroupReward` function to check if the players are in the same group and perform the appropriate actions.

This example showcases how the `IsInSameGroupWith` method can be used in a practical scenario to determine if two players are in the same group and make decisions based on that information.

## IsInSameRaidWith
Checks if the player is currently in the same raid group as another player.

### Parameters
- player: [Player](./player.md) - The player to check if in the same raid group.

### Returns
- boolean: Returns 'true' if the player is in the same raid group as the specified player, 'false' otherwise.

### Example Usage
This example demonstrates how to use the `IsInSameRaidWith` method to determine if the player is in the same raid group as another player and grant them a special buff if they are.

```typescript
const SPECIAL_BUFF_SPELL_ID = 12345;

function ApplyRaidBuff(player: Player, target: Player): void {
    if (player.IsInSameRaidWith(target)) {
        player.AddAura(SPECIAL_BUFF_SPELL_ID, player);
        player.SendBroadcastMessage(`You have been granted a special raid buff!`);
    }
}

const OnLogin: player_event_on_login = (event: PlayerEvents, player: Player) => {
    const targetGuid = player.GetSelection();
    if (targetGuid) {
        const target = GetPlayerByGUID(targetGuid);
        if (target) {
            ApplyRaidBuff(player, target);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example:
1. We define a constant `SPECIAL_BUFF_SPELL_ID` to represent the spell ID of the special buff we want to apply to raid members.
2. We create a function `ApplyRaidBuff` that takes two players as parameters: the player applying the buff and the target player.
3. Inside the function, we use the `IsInSameRaidWith` method to check if the player and target are in the same raid group.
4. If they are in the same raid group, we apply the special buff to the player using `AddAura` and send them a broadcast message informing them about the buff.
5. We register the `OnLogin` event handler using `RegisterPlayerEvent` for the `PLAYER_EVENT_ON_LOGIN` event.
6. When a player logs in, the `OnLogin` event handler is triggered.
7. We retrieve the selected target's GUID using `GetSelection`.
8. If a target is selected, we use `GetPlayerByGUID` to get the target player object.
9. If the target player is found, we call the `ApplyRaidBuff` function, passing the player and target as arguments.

This example showcases how the `IsInSameRaidWith` method can be used in combination with other player-related functions to create interactive gameplay mechanics based on raid group membership.

## IsInWater
Returns a boolean value indicating whether the player is currently in water or not.

### Parameters
None

### Returns
boolean - Returns `true` if the player is in water, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is in water and apply a buff if they are.

```typescript
const SWIM_SPEED_BUFF_ID = 42354;
const SWIM_SPEED_BUFF_DURATION = 60 * 5 * 1000; // 5 minutes

const OnPlayerEnterWater: player_event_on_enter_water = (event: number, player: Player) => {
    if (player.IsInWater()) {
        // Check if the player already has the swim speed buff
        if (!player.HasAura(SWIM_SPEED_BUFF_ID)) {
            // Apply the swim speed buff to the player
            player.AddAura(SWIM_SPEED_BUFF_ID, SWIM_SPEED_BUFF_DURATION);
            player.SendBroadcastMessage("You feel a surge of energy as you enter the water!");
        }
    }
};

const OnPlayerLeaveWater: player_event_on_leave_water = (event: number, player: Player) => {
    // Check if the player has the swim speed buff
    if (player.HasAura(SWIM_SPEED_BUFF_ID)) {
        // Remove the swim speed buff from the player
        player.RemoveAura(SWIM_SPEED_BUFF_ID);
        player.SendBroadcastMessage("The energy fades as you leave the water.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_WATER, (...args) => OnPlayerEnterWater(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEAVE_WATER, (...args) => OnPlayerLeaveWater(...args));
```

In this example:
1. We define constants for the swim speed buff ID and duration.
2. We register event handlers for when a player enters and leaves water using `RegisterPlayerEvent`.
3. In the `OnPlayerEnterWater` event handler:
   - We check if the player is in water using `player.IsInWater()`.
   - If the player is in water and doesn't already have the swim speed buff, we apply the buff using `player.AddAura()` and send a broadcast message to the player.
4. In the `OnPlayerLeaveWater` event handler:
   - We check if the player has the swim speed buff using `player.HasAura()`.
   - If the player has the buff, we remove it using `player.RemoveAura()` and send a broadcast message to the player.

This script enhances the player's experience by granting them a temporary swim speed buff whenever they enter water, making it easier to navigate and explore underwater areas. The buff is automatically removed when the player leaves the water.

## IsMoving
Returns a boolean value indicating whether the player is currently moving or not.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the player is currently moving, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsMoving()` method to check if a player is moving and perform actions based on their movement status.

```typescript
const SPEED_BOOST_AURA = 12345; // Replace with the actual aura ID for the speed boost

const onPlayerMove: player_event_on_move = (event: number, player: Player, oldX: number, oldY: number, oldZ: number, newX: number, newY: number, newZ: number) => {
    if (player.IsMoving()) {
        // Check if the player already has the speed boost aura
        if (!player.HasAura(SPEED_BOOST_AURA)) {
            // Apply the speed boost aura to the player
            player.AddAura(SPEED_BOOST_AURA, player);
            player.SendBroadcastMessage("You feel a surge of energy as you start moving!");
        }
    } else {
        // Check if the player has the speed boost aura
        if (player.HasAura(SPEED_BOOST_AURA)) {
            // Remove the speed boost aura from the player
            player.RemoveAura(SPEED_BOOST_AURA);
            player.SendBroadcastMessage("The surge of energy fades away as you stop moving.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (...args) => onPlayerMove(...args));
```

In this example:
1. We define a constant `SPEED_BOOST_AURA` to represent the aura ID for the speed boost effect. Replace it with the actual aura ID you want to use.

2. We register the `PLAYER_EVENT_ON_MOVE` event using `RegisterPlayerEvent()` to listen for player movement.

3. Inside the event handler function `onPlayerMove`, we check if the player is moving using the `IsMoving()` method.

4. If the player is moving and doesn't already have the speed boost aura, we apply the aura using `AddAura()` and send a broadcast message to the player indicating the speed boost.

5. If the player stops moving and has the speed boost aura, we remove the aura using `RemoveAura()` and send a broadcast message to the player indicating the fading of the speed boost.

This script enhances the player's movement by applying a speed boost aura whenever they start moving and removes the aura when they stop moving. It provides a dynamic experience based on the player's movement status.

## IsRested
Returns a boolean value indicating whether the player is currently rested or not. Being rested means the player has accumulated rest bonus experience points by logging out in an inn or a city.

### Parameters
None

### Returns
boolean - Returns `true` if the player is currently rested, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is rested and grant them a bonus buff if they are.

```typescript
const WELL_RESTED_SPELL_ID = 24705;
const WELL_RESTED_SPELL_DURATION = 3600000; // 1 hour in milliseconds

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.IsRested()) {
        // Check if the player already has the Well Rested buff
        if (!player.HasAura(WELL_RESTED_SPELL_ID)) {
            // Apply the Well Rested buff to the player
            player.AddAura(WELL_RESTED_SPELL_ID, WELL_RESTED_SPELL_DURATION);
            player.SendBroadcastMessage("You feel well rested and have been granted a bonus buff!");
        }
    } else {
        // Check if the player has the Well Rested buff but is no longer rested
        if (player.HasAura(WELL_RESTED_SPELL_ID)) {
            // Remove the Well Rested buff from the player
            player.RemoveAura(WELL_RESTED_SPELL_ID);
            player.SendBroadcastMessage("You no longer feel rested and the bonus buff has been removed.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. We define constants for the Well Rested spell ID and its duration.
2. We register the `PLAYER_EVENT_ON_LOGIN` event to trigger the `OnLogin` function when a player logs in.
3. Inside the `OnLogin` function, we check if the player is rested using `player.IsRested()`.
4. If the player is rested and doesn't already have the Well Rested buff, we apply the buff using `player.AddAura()` and send a broadcast message to the player.
5. If the player is not rested but has the Well Rested buff, we remove the buff using `player.RemoveAura()` and send a broadcast message to the player.

This script ensures that players who log in while rested receive the Well Rested buff, and players who lose their rested status have the buff removed. The script also prevents applying the buff multiple times if the player is already rested and has the buff.

## IsTaxiCheater
Returns whether or not the player has the taxi cheat activated.  This cheat allows players to teleport to any taxi node without the required riding skill, level or gold cost.  

### Parameters
None

### Returns
boolean - 'true' if the player has the taxi cheat activated, 'false' otherwise.

### Example Usage
In this example, we will create a command that allows players to toggle the taxi cheat on and off. The command will also inform the player of their current taxi cheat status.

```typescript
// Command name and security level
const COMMAND_NAME = 'taxicheat';
const COMMAND_SECURITY = SEC_PLAYER;

function ToggleTaxiCheat(player: Player): void {
    if (player.IsTaxiCheater()) {
        // Disable the taxi cheat
        player.SetTaxiCheater(false);
        player.SendBroadcastMessage('Taxi cheat disabled.');
    } else {
        // Enable the taxi cheat
        player.SetTaxiCheater(true);
        player.SendBroadcastMessage('Taxi cheat enabled.');
    }
}

function OnCommand(player: Player, command: string): boolean {
    if (command === COMMAND_NAME) {
        ToggleTaxiCheat(player);
        return true;
    }
    return false;
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, OnCommand);
RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_COMMAND, (command, security) => {
    return command === COMMAND_NAME && security >= COMMAND_SECURITY;
});
```

In this script:
1. We define the command name and the required security level.
2. The `ToggleTaxiCheat` function checks the player's current taxi cheat status using `IsTaxiCheater()`.
   - If the cheat is active, it disables the cheat using `SetTaxiCheater(false)` and informs the player.
   - If the cheat is inactive, it enables the cheat using `SetTaxiCheater(true)` and informs the player.
3. The `OnCommand` function is called when the player enters a command. It checks if the entered command matches the defined command name (`taxicheat`). If it does, it calls the `ToggleTaxiCheat` function to toggle the cheat status.
4. We register the `OnCommand` function to the `PLAYER_EVENT_ON_COMMAND` event to handle player commands.
5. We also register the command to the `SERVER_EVENT_ON_COMMAND` event to define the command and its required security level.

With this script, players can use the `.taxicheat` command to toggle the taxi cheat on and off. The command will also inform them of their current taxi cheat status.

## IsVisibleForPlayer
Returns true if the player can see another player based on the rules of the game. This can be useful for custom scripted events 
or features that require checking for visibility between players.

### Parameters
- player: [Player](./player.md) - The player object to check visibility of

### Returns
- boolean - True if this player can see the specified player, false otherwise.

### Example Usage
Create a custom 'Manhunt' event where the closest player is always visible to the runner. The runner gets a repeating alert of the hunter's current distance.

```typescript
let MANHUNT_RUNNER: Player | null;
let MANHUNT_HUNTER: Player | null;

function StartManhuntEvent(player: Player) {
    if (!MANHUNT_RUNNER) {
        MANHUNT_RUNNER = player;
        SendWorldMessage(`${player.GetName()} is now the hunted! The manhunt begins in 1 minute. Hunters get ready!`);
        player.AddAura(31797, player); // Aura: Permament Feign Death
        CreateLuaEvent(PrepareHunters, 1000 * 60, 1);
    }
}

function PrepareHunters() {
    const plrs = GetPlayersInWorld();
    if (plrs && MANHUNT_RUNNER) {
        MANHUNT_HUNTER = plrs.find(p => p.GetGUIDLow() !== MANHUNT_RUNNER!.GetGUIDLow());
        if (MANHUNT_HUNTER) {
            CreateLuaEvent(StartHuntingAlert, 5000, 0);
            SendWorldMessage(`${MANHUNT_HUNTER.GetName()} has been chosen as the hunter! The hunt is on. `/manhunt` to join the chase.`);
            MANHUNT_HUNTER.Teleport(0, MANHUNT_RUNNER.GetX(), MANHUNT_RUNNER.GetY(), MANHUNT_RUNNER.GetZ(), MANHUNT_RUNNER.GetO());
        }
    }
}

function StartHuntingAlert() {
    if (MANHUNT_RUNNER && MANHUNT_HUNTER) {
        const dist = MANHUNT_RUNNER.GetDistance(MANHUNT_HUNTER);
        if (MANHUNT_RUNNER.IsVisibleForPlayer(MANHUNT_HUNTER)) {
            SendMessageToPlayer(MANHUNT_RUNNER, `The hunter is ${dist} yards from you and closing in!`);
        } else {
            SendMessageToPlayer(MANHUNT_RUNNER, `You've escaped the hunter's sight. Last seen ${dist} yards away.`);
        }
    }
}

// Player chat command to join manhunt
function OnCommand_Manhunt(player: Player) {
    if (MANHUNT_RUNNER && player.GetGUIDLow() !== MANHUNT_RUNNER.GetGUIDLow()) {
        player.Teleport(0, MANHUNT_RUNNER.GetX(), MANHUNT_RUNNER.GetY(), MANHUNT_RUNNER.GetZ(), MANHUNT_RUNNER.GetO());
    }
    return false;
}

RegisterPlayerEvent(30, StartManhuntEvent);
RegisterPlayerGossipEvent(MANHUNT_RUNNER?.GetGUIDLow(), 0, OnCommand_Manhunt);
```

In this example, a 'manhunt' event is started by a random player becoming the runner. After a delay, another random player is chosen as the hunter and teleported to the runner's location. 

An event is started that will periodically alert the runner of the hunter's distance, using `IsVisibleForPlayer` to determine if they are still in sight.

Other players can join the hunt by using the `/manhunt` command which will teleport them to the runner's current location.

## KickPlayer
Kicks the player from the server.  This will close the player's connection and log them out.  You can also provide a reason for kicking the player.

### Parameters
None

### Returns
None

### Example Usage
Here's an example of kicking a player from the server after they use a forbidden item:

```typescript
const FORBIDDEN_ITEM_ENTRY = 1234;

const OnItemUse: player_event_on_item_use = (event: number, player: Player, item: Item, target: GameObject | Item | Unit | None, cast: Spell) => {
    if (item.GetEntry() === FORBIDDEN_ITEM_ENTRY) {
        player.SendBroadcastMessage("Using this item is not allowed. You have been kicked from the server.");
        
        // Log the incident
        const playerName = player.GetName();
        const playerGUID = player.GetGUID();
        const itemName = item.GetName();
        const logMessage = `Player ${playerName} (GUID: ${playerGUID}) used forbidden item: ${itemName} (Entry: ${FORBIDDEN_ITEM_ENTRY})`;
        WorldDBQuery("INSERT INTO forbidden_item_log (timestamp, log_message) VALUES (NOW(), ?)", logMessage);
        
        // Kick the player
        player.KickPlayer();
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ITEM_USE, (...args) => OnItemUse(...args));
```

In this example:

1. We define a constant `FORBIDDEN_ITEM_ENTRY` with the entry ID of the item that players are not allowed to use.

2. We register a `player_event_on_item_use` event handler to listen for when a player uses an item.

3. Inside the event handler, we check if the used item's entry matches the forbidden item entry.

4. If the player used the forbidden item:
   - We send a broadcast message to the player informing them that using the item is not allowed and that they have been kicked.
   - We log the incident by inserting a record into a custom database table `forbidden_item_log` with the current timestamp, player name, player GUID, item name, and item entry.
   - Finally, we call the `KickPlayer()` method to kick the player from the server.

This example demonstrates how you can use the `KickPlayer()` method to remove a player from the server when they violate certain rules or perform undesired actions. It also showcases logging the incident in the database for future reference or analysis.

## KillPlayer
This method will kill the player immediately. The player will be considered dead and will need to be resurrected or revived to continue playing. This can be useful for custom scripting events or handling certain conditions where the player needs to die.

### Parameters
None

### Returns
None

### Example Usage
Here's an example of using `KillPlayer()` in a script that handles a custom boss encounter:

```typescript
const BOSS_ENTRY = 1234;
const BOSS_KILL_PLAYER_CHANCE = 10; // 10% chance for the boss to instantly kill the player

const BossEncounter: creature_event_on_combat = (event: number, creature: Creature, target: Unit): void => {
    if (creature.GetEntry() !== BOSS_ENTRY || !target.IsPlayer()) {
        return;
    }

    const player = target.ToPlayer();

    // Boss random ability that has a chance to instantly kill the player
    if (math.random(1, 100) <= BOSS_KILL_PLAYER_CHANCE) {
        creature.CastSpell(player, 12345); // Cast a spell effect on the player
        player.KillPlayer();
        creature.SendUnitYell("Your life ends here!", 0);
    }

    // Other boss encounter logic...
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_COMBAT, (...args) => BossEncounter(...args));
```

In this example, during a boss encounter, there's a 10% chance for the boss to instantly kill the player using the `KillPlayer()` method. This is combined with a spell effect and a yell from the boss to create a more immersive experience.

Another example could be a script that handles a player reaching a certain condition, such as a curse or a disease that will kill the player after a certain time:

```typescript
const CURSE_SPELL_ENTRY = 5678;
const CURSE_DURATION = 1 * 60 * 1000; // 1 minute

const CurseHandler: player_event_on_spell_hit = (event: number, player: Player, caster: Unit, spellEntry: number): void => {
    if (spellEntry !== CURSE_SPELL_ENTRY) {
        return;
    }

    player.SendBroadcastMessage("You have been cursed! You will die in 1 minute unless you find a cure!");

    // Create a timed event to kill the player after the curse duration
    CreateTimedEvent(CURSE_DURATION, (owner: TimedEvent, eventData: number) => {
        if (!player || !player.IsInWorld()) {
            return;
        }

        if (player.HasAura(CURSE_SPELL_ENTRY)) {
            player.KillPlayer();
            player.SendBroadcastMessage("The curse has taken your life!");
        }
    }, 0);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SPELL_HIT, (...args) => CurseHandler(...args));
```

In this example, when a player is hit by a specific curse spell, a timed event is created to kill the player after 1 minute unless they manage to remove the curse. The `KillPlayer()` method is used to instantly kill the player when the curse duration expires.

These examples demonstrate how the `KillPlayer()` method can be used in different scenarios to create custom scripted events and add interesting gameplay mechanics to the game.

## KilledMonsterCredit
This method gives the player quest kill credit for a specified creature entry. When a player kills a creature that is required for a quest, this method can be used to update the player's quest progress.

### Parameters
* entry: number - The ID of the creature from the `creature_template` table for which the player should receive kill credit.

### Example Usage
In this example, we'll create a script that gives the player additional quest kill credit for a specific creature when they kill it. This can be useful for increasing the drop rate of quest items or accelerating quest progress.

```typescript
const QUEST_ENTRY = 1234; // Replace with the actual quest ID
const CREATURE_ENTRY = 5678; // Replace with the actual creature ID
const ADDITIONAL_CREDIT_COUNT = 2; // Number of additional kill credits to award

const onCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    // Check if the killed creature is the one we're interested in
    if (creature.GetEntry() === CREATURE_ENTRY) {
        // Check if the player has the quest and it's incomplete
        if (player.HasQuest(QUEST_ENTRY) && !player.HasAchieved(QUEST_ENTRY)) {
            // Give the player quest kill credit for the creature
            player.KilledMonsterCredit(CREATURE_ENTRY);

            // Award additional kill credits
            for (let i = 0; i < ADDITIONAL_CREDIT_COUNT; i++) {
                player.KilledMonsterCredit(CREATURE_ENTRY);
            }

            // Send a message to the player
            player.SendBroadcastMessage(`You have received ${ADDITIONAL_CREDIT_COUNT + 1} kill credits for the quest.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => onCreatureKill(...args));
```

In this script:
1. We define constants for the quest ID, creature ID, and the number of additional kill credits to award.
2. We register a player event listener for the `PLAYER_EVENT_ON_KILL_CREATURE` event.
3. When the event is triggered, we check if the killed creature matches the desired creature ID.
4. If the player has the quest and it's incomplete, we give the player the standard quest kill credit using `KilledMonsterCredit(CREATURE_ENTRY)`.
5. We then loop `ADDITIONAL_CREDIT_COUNT` times and call `KilledMonsterCredit(CREATURE_ENTRY)` to award additional kill credits.
6. Finally, we send a message to the player informing them about the awarded kill credits.

This script enhances the player's quest experience by providing additional kill credits for a specific creature, making it easier to complete the quest.

## LearnSpell
Teaches the player a new spell based on the Spell ID provided. These spells can be referenced in the World Database spell_template table. For more information about spells, you can find more details here: https://www.azerothcore.org/wiki/spell_template.

### Parameters
- spellId: number - The Spell ID from the spell_template table.

### Example Usage
Teach a player a new spell when they reach a certain level and class combination.

```typescript
const SPELL_SHADOWFORM = 15473;
const CLASS_PRIEST = 5;
const LEVEL_REQUIREMENT = 40;

const onLevelChange: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    const playerLevel = player.GetLevel();
    const playerClass = player.GetClass();

    if (playerLevel >= LEVEL_REQUIREMENT && playerClass === CLASS_PRIEST && !player.HasSpell(SPELL_SHADOWFORM)) {
        player.SendBroadcastMessage("You have reached level " + LEVEL_REQUIREMENT + " as a Priest. Learning Shadowform...");
        player.LearnSpell(SPELL_SHADOWFORM);
        
        const shadowformSpell = player.GetSpell(SPELL_SHADOWFORM);
        if (shadowformSpell) {
            const spellLink = shadowformSpell.GetSpellLink();
            player.SendBroadcastMessage("You have learned a new spell: " + spellLink);
        } else {
            player.SendBroadcastMessage("Failed to learn Shadowform. Please contact an administrator.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => onLevelChange(...args));
```

In this example, when a player reaches level 40 and is a Priest class, the script checks if they already know the Shadowform spell (Spell ID 15473). If they don't have the spell yet, it teaches them the spell using the `LearnSpell` method.

After learning the spell, the script retrieves the learned spell using `GetSpell` and checks if it was successfully learned. If the spell is found, it creates a spell link using `GetSpellLink` and sends a broadcast message to the player informing them about the newly learned spell. If the spell was not found after learning it, an error message is sent to the player, prompting them to contact an administrator.

This example demonstrates how to use the `LearnSpell` method in combination with other player methods and events to create a more complex script that enhances the gameplay experience based on the player's level and class.

## LearnTalent
Teaches the player a talent. Talents can be found in the `Talent.dbc` file. 

### Parameters
* talent_id: number - The ID of the talent to learn from `Talent.dbc`.
* talentRank: number - The rank of the talent.

### Example Usage
This example will teach a player a random talent when they level up to level 10, 20, 30, 40, 50, 60, 70, 80.

```typescript
// Constants for the example
const TALENT_MAGE_ARCANE_CONCENTRATION = 12577;
const TALENT_MAGE_ARCANE_MEDITATION = 12463;
const TALENT_MAGE_ARCANE_MIND = 12469;
const TALENT_MAGE_ARCANE_INSTABILITY = 15060;

const talentTable: number[] = [
    TALENT_MAGE_ARCANE_CONCENTRATION, 
    TALENT_MAGE_ARCANE_MEDITATION,
    TALENT_MAGE_ARCANE_MIND,
    TALENT_MAGE_ARCANE_INSTABILITY
];

const levelUpEvent: player_event_on_level_change = (event: number, player: Player, oldLevel: number) => {
    // Check if the player is a mage
    if (player.GetClass() === Classes.CLASS_MAGE) {
        if (oldLevel === 9 || oldLevel === 19 || oldLevel === 29 || oldLevel === 39 ||
            oldLevel === 49 || oldLevel === 59 || oldLevel === 69 || oldLevel === 79) {

            // Generate a random index
            const talentIndex = Math.floor(Math.random() * talentTable.length);
            // Teach a random talent
            player.LearnTalent(talentTable[talentIndex], 1);
            // Inform the player about the new talent
            player.SendBroadcastMessage(`You have learned a new talent!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => levelUpEvent(...args));
```

In this script:
1. We define constants for some mage talents from the Arcane tree.
2. We create an array `talentTable` that holds the talent IDs.
3. In the `levelUpEvent` function, we first check if the player is a mage using `player.GetClass()`.
4. If the player is a mage and their previous level (`oldLevel`) is 9, 19, 29, 39, 49, 59, 69, or 79, we proceed.
5. We generate a random index using `Math.floor(Math.random() * talentTable.length)` to select a random talent from the `talentTable`.
6. We teach the player the randomly selected talent at rank 1 using `player.LearnTalent(talentTable[talentIndex], 1)`.
7. We send a message to the player informing them about the new talent using `player.SendBroadcastMessage()`.

This script adds an element of randomness and surprise for mage players, granting them a random Arcane talent every 10 levels until level 80.

## LeaveBattleground
Forces the player to leave a battleground. If the player is not in a battleground, this method will have no effect.

### Parameters
* teleToEntry: boolean (optional) - If set to true, the player will be teleported to their entry point for the battleground.

### Example Usage
This example listens for the `PLAYER_EVENT_ON_COMMAND` event and checks if the player types the ".leavebg" command. If so, it checks if the player is in a battleground and then forces them to leave, teleporting them back to their entry point.

```typescript
const onCommand: player_event_on_command = (event: number, player: Player, command: string, args: string[]) => {
    if(command === "leavebg") {
        if(player.InBattleground()) {
            player.SendBroadcastMessage("You will now be removed from the battleground.");
            player.LeaveBattleground(true);
        } else {
            player.SendBroadcastMessage("You are not currently in a battleground.");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => onCommand(...args));
```

In this more complex example, we listen for the `PLAYER_EVENT_ON_LOGOUT_REQUEST` event, which is triggered when a player attempts to log out. We check if the player is in a battleground, and if so, we prevent them from logging out and instead force them to leave the battleground after a 5 second delay. We use the `RegisterTimedEvent` function to create the delay.

```typescript
const LOGOUT_DELAY = 5 * IN_MILLISECONDS;

const onLogoutRequest: player_event_on_logout_request = (event: number, player: Player) => {
    if(player.InBattleground()) {
        player.SendBroadcastMessage("You cannot log out while in a battleground. You will be removed from the battleground in 5 seconds.");
        PreventDefault();

        const timedEvent: timed_event = (cPlayer: Player) => {
            if(cPlayer.InBattleground()) {
                cPlayer.LeaveBattleground(true);
            }
        };

        RegisterTimedEvent(LOGOUT_DELAY, timedEvent, player);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGOUT_REQUEST, (...args) => onLogoutRequest(...args));
```

## LogoutPlayer
Forces the player to log out of the game. This can be used to handle players that may need to be removed from the game or to handle custom logout events.

### Parameters
* saveToDb: boolean (optional) - If set to true, the player's data will be saved to the database before logging out. If false or not provided, the player's data will not be saved.

### Example Usage:
This example listens for a player to type the ".logout" command and then starts a 20 second logout timer before forcing the logout and saving the character data.

```typescript
const LOGOUT_TIMER = 20000; // in ms (20 seconds)

const command_logout: player_event_On_Chat = (event: number, player: Player, msg: string) => {
    const msgParts = msg.split(/\s+/);
    
    if (msgParts[0].toLowerCase() === ".logout") {
        player.SendBroadcastMessage(`You will be logged out in ${LOGOUT_TIMER / 1000} seconds.`);
        
        setTimeout(() => {
            if (player.IsInCombat()) {
                player.SendBroadcastMessage("You cannot log out while in combat!");
                return;
            }
            
            player.SendBroadcastMessage("Logging out...");
            player.LogoutPlayer(true);
        }, LOGOUT_TIMER);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => command_logout(...args));
```

In this example:
1. We define a constant `LOGOUT_TIMER` to store the logout timer duration in milliseconds (20 seconds).
2. We listen for the player's chat event using `RegisterPlayerEvent` with the `PLAYER_EVENT_ON_CHAT` event.
3. In the event handler function `command_logout`, we split the chat message by whitespace to get the individual parts.
4. We check if the first part of the message (converted to lowercase) is equal to ".logout".
5. If the condition is met, we send a broadcast message to the player informing them about the logout timer.
6. We use `setTimeout` to delay the execution of the logout logic by the specified `LOGOUT_TIMER` duration.
7. Inside the `setTimeout` callback:
   - We check if the player is in combat using `player.IsInCombat()`.
   - If the player is in combat, we send a message informing them that they cannot log out during combat and return.
   - If the player is not in combat, we send a message indicating that the logout process is starting.
   - We call `player.LogoutPlayer(true)` to force the player to log out and save their character data to the database.

This example demonstrates how the `LogoutPlayer` method can be used in conjunction with a custom chat command to implement a logout timer and handle the logout process while considering the player's combat state.

## ModifyArenaPoints
This method allows you to add or remove Arena Points from a player's current total. Arena Points are a form of currency used to purchase various PvP rewards. If the amount is positive, points will be added to the player's total. If the amount is negative, points will be deducted from the player's total.

### Parameters
* amount: number - The amount of Arena Points to add or remove from the player's current total. Positive values will add points, while negative values will deduct points.

### Example Usage
Let's say we want to create a script that rewards players with bonus Arena Points for achieving a certain number of honorable kills in a single battleground match. Here's how we could implement this using the `ModifyArenaPoints` method:

```typescript
const HONORABLE_KILLS_THRESHOLD = 15;
const ARENA_POINTS_BONUS = 50;

const OnPlayerKilledUnit: player_event_on_killed_unit = (event: number, killer: Player, killed: Unit) => {
    if (killed && killed.IsPlayer() && killer.InBattleground()) {
        killer.SetData("BG_HONORABLE_KILLS", killer.GetData("BG_HONORABLE_KILLS") + 1);

        if (killer.GetData("BG_HONORABLE_KILLS") >= HONORABLE_KILLS_THRESHOLD) {
            killer.ModifyArenaPoints(ARENA_POINTS_BONUS);
            killer.SendBroadcastMessage(`You have been awarded ${ARENA_POINTS_BONUS} bonus Arena Points for achieving ${HONORABLE_KILLS_THRESHOLD} honorable kills in this battleground!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILLED_UNIT, (...args) => OnPlayerKilledUnit(...args));
```

In this example, we define a constant `HONORABLE_KILLS_THRESHOLD` that represents the number of honorable kills a player must achieve in a single battleground to receive the bonus Arena Points. We also define a constant `ARENA_POINTS_BONUS` that specifies the number of bonus points to award.

We then register a `PLAYER_EVENT_ON_KILLED_UNIT` event handler that triggers whenever a player kills another unit. Inside the event handler, we first check if the killed unit is a player and if the killer is currently in a battleground. If both conditions are met, we increment a custom data value `BG_HONORABLE_KILLS` for the killer using the `SetData` method.

Next, we check if the killer's `BG_HONORABLE_KILLS` value has reached or exceeded the `HONORABLE_KILLS_THRESHOLD`. If it has, we use the `ModifyArenaPoints` method to add the `ARENA_POINTS_BONUS` to the killer's Arena Points total. We also send a broadcast message to the killer informing them of the bonus points they have been awarded.

This script encourages players to perform well in battlegrounds by rewarding them with bonus Arena Points for achieving a high number of honorable kills in a single match.

## ModifyHonorPoints
This method allows you to add or remove honor points from a player's current total. Honor points are used in World of Warcraft to purchase various PvP related items and rewards.

### Parameters
* amount: number - The amount of honor points to add or remove. Positive numbers will add honor points, while negative numbers will deduct honor points.

### Example Usage
This example script awards bonus honor points to a player when they kill a player of the opposite faction who is within 5 levels of their own level.

```typescript
const BONUS_HONOR_POINTS = 100;
const MAX_LEVEL_DIFFERENCE = 5;

const OnPVPKill: player_event_on_kill_player = (event: number, killer: Player, killed: Player) => {
    const killerLevel = killer.GetLevel();
    const killedLevel = killed.GetLevel();

    if (Math.abs(killerLevel - killedLevel) <= MAX_LEVEL_DIFFERENCE) {
        const killerHonorPoints = killer.GetHonorPoints();
        const newHonorPoints = killerHonorPoints + BONUS_HONOR_POINTS;

        killer.ModifyHonorPoints(BONUS_HONOR_POINTS);
        killer.SendBroadcastMessage(`You have been awarded ${BONUS_HONOR_POINTS} bonus honor points for killing a player within ${MAX_LEVEL_DIFFERENCE} levels of you!`);
        killer.SendBroadcastMessage(`Your total honor points are now ${newHonorPoints}.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, (...args) => OnPVPKill(...args));
```

In this script:
1. We define constants for the bonus honor points and the maximum level difference allowed to receive the bonus.
2. In the `OnPVPKill` event handler, we get the levels of both the killer and the killed players.
3. We check if the absolute difference between their levels is less than or equal to the `MAX_LEVEL_DIFFERENCE`.
4. If the level difference condition is met, we get the killer's current honor points and calculate their new total after adding the bonus.
5. We use `ModifyHonorPoints()` to add the bonus honor points to the killer's total.
6. We send the killer two messages: one informing them of the bonus honor points received, and another with their new total honor points.

This script encourages players to engage in PvP combat with players of a similar level by rewarding them with bonus honor points, adding an extra challenge and incentive to PvP gameplay.

## ModifyMoney
Adds or subtracts money from the player's current money amount. Money amounts are always represented in copper.

### Parameters
* copperAmt: number - The amount of money in copper to add or subtract from the player's current money amount. Use a positive value to add money, or a negative value to subtract money.

### Example Usage
This example demonstrates how to modify a player's money based on their level when they kill a creature. If the player is level 10 or higher, they will receive bonus money for each level above 10. If the player has less than 1 gold (10000 copper), their money will be reduced by 10% of the amount they received for killing the creature.

```typescript
const onCreatureKill: player_event_on_creature_kill = (event: number, player: Player, creature: Creature) => {
    const BASE_MONEY_REWARD = 500; // 5 silver
    const LEVEL_BONUS_THRESHOLD = 10;
    const LEVEL_BONUS_AMOUNT = 100; // 1 silver per level
    const LOW_MONEY_THRESHOLD = 10000; // 1 gold
    const LOW_MONEY_PENALTY_PCT = 0.1; // 10% penalty

    let moneyReward = BASE_MONEY_REWARD;

    if (player.GetLevel() > LEVEL_BONUS_THRESHOLD) {
        const levelBonus = (player.GetLevel() - LEVEL_BONUS_THRESHOLD) * LEVEL_BONUS_AMOUNT;
        moneyReward += levelBonus;
    }

    player.ModifyMoney(moneyReward);

    if (player.GetCoinage() < LOW_MONEY_THRESHOLD) {
        const penaltyAmount = Math.floor(moneyReward * LOW_MONEY_PENALTY_PCT);
        player.ModifyMoney(-penaltyAmount);
        player.SendBroadcastMessage(`You have been penalized ${penaltyAmount} copper for having low funds.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CREATURE_KILL, (...args) => onCreatureKill(...args));
```

In this example:
1. The base money reward for killing a creature is set to 5 silver (500 copper).
2. If the player's level is higher than the `LEVEL_BONUS_THRESHOLD` (10), they receive an additional 1 silver (100 copper) for each level above 10.
3. The calculated `moneyReward` is added to the player's money using `player.ModifyMoney(moneyReward)`.
4. If the player's total money (`player.GetCoinage()`) is less than the `LOW_MONEY_THRESHOLD` (1 gold or 10000 copper), they are penalized by 10% of the `moneyReward` they just received.
   - The penalty amount is calculated using `Math.floor(moneyReward * LOW_MONEY_PENALTY_PCT)` to ensure an integer value.
   - The penalty is subtracted from the player's money using `player.ModifyMoney(-penaltyAmount)`.
   - The player is informed about the penalty via a broadcast message.

This example showcases how to use `ModifyMoney()` to add and subtract money from a player based on specific conditions, such as their level and current money amount.

## Mute
Mutes the player for a specified duration, preventing them from sending chat messages or mails during that time.

### Parameters
* muteTime: number - The duration in seconds for which the player will be muted.

### Example Usage
Here's an example of how to mute a player for a certain duration when they use a specific word in chat:

```typescript
const MUTE_DURATION = 300; // 5 minutes
const FORBIDDEN_WORD = "badword";

const onChat: player_event_on_chat = (event: number, player: Player, msg: string, Type: number, lang: Language): void => {
    if (msg.toLowerCase().includes(FORBIDDEN_WORD)) {
        player.Mute(MUTE_DURATION);
        
        // Send a message to the player informing them of the mute
        player.SendBroadcastMessage(`You have been muted for ${MUTE_DURATION} seconds for using a forbidden word.`);
        
        // Announce to other players that the offender has been muted
        player.GetMap().SendServerMessage(`Player ${player.GetName()} has been muted for using a forbidden word.`);
        
        // Log the mute event to the server console
        console.log(`Player ${player.GetName()} (GUID: ${player.GetGUID()}) has been muted for ${MUTE_DURATION} seconds.`);
        
        // Optionally, you can also store the mute information in the database for tracking purposes
        let query = `INSERT INTO player_mutes (guid, mute_duration, mute_reason, mute_timestamp) VALUES (${player.GetGUID()}, ${MUTE_DURATION}, 'Using forbidden word', ${GetUnixTime()});`;
        QueryWorld(query);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onChat(...args));
```

In this example:
1. We define the mute duration (in seconds) and the forbidden word that triggers the mute.
2. When a player sends a chat message, we check if the message contains the forbidden word (case-insensitive).
3. If the forbidden word is found, we mute the player using `player.Mute(MUTE_DURATION)`.
4. We send a message to the muted player informing them about the mute duration.
5. We announce to other players on the same map that the offender has been muted.
6. We log the mute event to the server console for administrators to review.
7. Optionally, we insert a record into a custom database table `player_mutes` to store information about the mute event for tracking purposes.

This script demonstrates how to effectively utilize the `Mute` method to handle chat violations and maintain a positive gaming environment. The mute duration can be adjusted based on the severity of the offense or your server's policies.

## RemoveFromBattlegroundRaid
This method forcefully removes the player from a battleground raid group. It can be useful in situations where you need to manually manage a player's participation in a battleground raid, such as when implementing custom battleground mechanics or handling player disconnections.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
Here's an example of how you can use the `RemoveFromBattlegroundRaid` method to handle player disconnections in a battleground:

```typescript
const BATTLEGROUND_ID = 1; // Replace with the desired battleground ID

const onPlayerLogout: player_event_on_logout = (event: number, player: Player) => {
    const bgId = player.GetBattlegroundId();

    if (bgId === BATTLEGROUND_ID) {
        const bg = player.GetBattleground();

        if (bg) {
            const bgPlayers = bg.GetPlayers();
            const disconnectedCount = bgPlayers.filter(p => !p.IsInWorld()).length;

            if (disconnectedCount >= bgPlayers.length * 0.5) {
                // If more than 50% of the players have disconnected, remove all players from the battleground raid
                bgPlayers.forEach(p => p.RemoveFromBattlegroundRaid());
                bg.SetStatus(BattlegroundStatus.STATUS_WAIT_LEAVE);
            } else {
                // If the disconnected player is in a battleground raid, remove them from it
                if (player.IsInBattlegroundRaid()) {
                    player.RemoveFromBattlegroundRaid();
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGOUT, (...args) => onPlayerLogout(...args));
```

In this example:
1. We define a constant `BATTLEGROUND_ID` to specify the ID of the battleground we want to handle disconnections for.
2. We register a player event handler for the `PLAYER_EVENT_ON_LOGOUT` event.
3. When a player logs out, we check if they are in the specified battleground using `player.GetBattlegroundId()`.
4. If the player is in the battleground, we retrieve the battleground instance using `player.GetBattleground()`.
5. We count the number of disconnected players in the battleground using `bgPlayers.filter(p => !p.IsInWorld()).length`.
6. If more than 50% of the players have disconnected, we remove all players from the battleground raid using `bgPlayers.forEach(p => p.RemoveFromBattlegroundRaid())` and set the battleground status to `STATUS_WAIT_LEAVE`.
7. If the disconnected player is in a battleground raid (but less than 50% of players have disconnected), we remove them from the raid using `player.RemoveFromBattlegroundRaid()`.

This script ensures that if a significant number of players disconnect from the battleground, all players are removed from the battleground raid, and the battleground is put into a waiting state. If only a few players disconnect, they are individually removed from the battleground raid.

## RemoveFromGroup
This method forces the player to leave their current group or raid.  This can be useful for custom scripting where you need to temporarily remove a player from a group and add them back, or if you want to disband an entire group.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any values.

### Example Usage
Temporarily remove a player from a group, then add them back after 30 seconds:
```typescript
const REJOIN_DELAY = 30 * 1000; // 30 seconds

const onKillCredit: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const group = player.GetGroup();
    
    if (group) {
        // Store the player's group information
        const groupGuid = group.GetGUID();
        const subGroupId = group.GetMemberGroup(player.GetGUID());
        
        // Remove the player from the group
        player.RemoveFromGroup();
        
        // Delay the player rejoining their group
        player.AddDelayedEvent(REJOIN_DELAY, () => {
            // Check if the group still exists
            const oldGroup = Group.GetGroupByGUID(groupGuid);
            if (oldGroup) {
                // Rejoin the group in the same subgroup
                oldGroup.AddMember(player.GetGUID(), subGroupId);
            }
        });
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => onKillCredit(...args));
```

In this example, when a player kills a creature, they are temporarily removed from their group. After a delay of 30 seconds, the script checks if the original group still exists, and if so, the player is added back to the group in the same subgroup they were in before.

This can be useful in certain scripting scenarios where you need to temporarily isolate a player from their group, perform some actions, and then add them back to the group.

Note: Be cautious when using this method, as removing players from groups unexpectedly can lead to confusion and frustration for players. Make sure to communicate clearly to the players what is happening and why, and ensure that the removal is only temporary if that is the intent.

## RemoveItem
Removes a specified amount of an item from the player's inventory. The item can be specified by either the item object itself or the item entry ID.

### Parameters
* item: [Item](./item.md) - (Optional) The item object to remove from the player's inventory.
* entry: number - The entry ID of the item to remove from the player's inventory.
* itemCount: number - (Optional) The amount of the item to remove. If not specified, it defaults to 1.

### Example Usage
This example script listens for the PLAYER_EVENT_ON_QUEST_ABANDON event and removes the quest items from the player's inventory when they abandon the quest.

```typescript
const QUEST_ITEM_ENTRY_1 = 12345;
const QUEST_ITEM_ENTRY_2 = 67890;

const onQuestAbandon: player_event_on_quest_abandon = (event: number, player: Player, quest: Quest) => {
    const questId = quest.GetId();

    if (questId === 1234) {
        // Remove the first quest item
        player.RemoveItem(null, QUEST_ITEM_ENTRY_1, 1);

        // Remove all instances of the second quest item
        const itemCount = player.GetItemCount(QUEST_ITEM_ENTRY_2);
        player.RemoveItem(null, QUEST_ITEM_ENTRY_2, itemCount);

        // Optionally, you can also remove the quest itself from the player's quest log
        player.RemoveQuest(questId);

        // Inform the player that the quest items have been removed
        player.SendBroadcastMessage("The quest items have been removed from your inventory.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_ABANDON, (...args) => onQuestAbandon(...args));
```

In this example:
1. We define the entry IDs of the quest items that need to be removed when the player abandons the quest.
2. We listen for the PLAYER_EVENT_ON_QUEST_ABANDON event using the RegisterPlayerEvent function.
3. When the event is triggered, we check if the abandoned quest's ID matches the specific quest we are interested in (in this case, quest ID 1234).
4. If it matches, we remove the first quest item using player.RemoveItem, specifying the item entry ID and the count of 1.
5. We then remove all instances of the second quest item by first getting the count of the item in the player's inventory using player.GetItemCount and then removing that count using player.RemoveItem.
6. Optionally, we can also remove the quest itself from the player's quest log using player.RemoveQuest.
7. Finally, we send a broadcast message to the player informing them that the quest items have been removed from their inventory.

This script ensures that when a player abandons a specific quest, the associated quest items are automatically removed from their inventory, providing a convenient way to manage quest-related items.

## RemoveLifetimeKills
Removes a specified number of lifetime kills from the player's lifetime kill count. This can be useful for implementing custom penalties, prestige systems, or adjusting the player's kill count based on certain conditions or events.

### Parameters
* val: number - The number of lifetime kills to remove from the player's count.

### Example Usage
In this example, we'll create a script that reduces a player's lifetime kill count by a percentage whenever they die in a specific map.

```typescript
const MAP_ID = 123; // Replace with the desired map ID
const KILL_COUNT_PENALTY_PCT = 0.1; // 10% penalty

const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: WorldObject) => {
    if (player.GetMapId() === MAP_ID) {
        const currentKills = player.GetLifetimeKills();
        const penaltyKills = Math.floor(currentKills * KILL_COUNT_PENALTY_PCT);

        if (penaltyKills > 0) {
            player.RemoveLifetimeKills(penaltyKills);
            player.SendBroadcastMessage(`You have lost ${penaltyKills} lifetime kills as a penalty for dying in this map.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this script:
1. We define the specific `MAP_ID` where the penalty will be applied and the `KILL_COUNT_PENALTY_PCT` as 10%.
2. When a player dies, the `OnPlayerDeath` event is triggered.
3. We check if the player's current map matches the specified `MAP_ID`.
4. If the player is in the correct map, we calculate the number of kills to remove based on the current lifetime kills and the penalty percentage.
5. If the calculated `penaltyKills` is greater than 0, we use the `RemoveLifetimeKills` method to subtract the penalty from the player's lifetime kill count.
6. Finally, we send a broadcast message to the player informing them about the number of lifetime kills they lost as a penalty.

This script demonstrates how the `RemoveLifetimeKills` method can be used in combination with other game events and conditions to create custom penalties or adjustments to a player's lifetime kill count based on specific circumstances.

## RemoveQuest
Removes the specified quest from the player's quest log. If the quest is complete, it will be removed from the player's completed quests. If the quest is incomplete, it will be removed from the player's active quests.

### Parameters
* entry: number - The entry ID of the quest to remove.

### Example Usage
In this example, we'll remove a specific quest from the player's quest log when they enter a certain area. This could be useful for removing outdated or deprecated quests that are no longer relevant to the game.

```typescript
const DEPRECATED_QUEST_ENTRY = 1234;
const DEPRECATED_QUEST_AREA = 5678;

const OnAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaId: number) => {
    if (areaId === DEPRECATED_QUEST_AREA) {
        if (player.HasQuest(DEPRECATED_QUEST_ENTRY)) {
            player.RemoveQuest(DEPRECATED_QUEST_ENTRY);
            player.SendBroadcastMessage("The deprecated quest has been removed from your quest log.");

            // Check if the player has any items related to the quest
            const questItems = [1234, 5678, 9012]; // Replace with actual item entry IDs
            for (const itemEntry of questItems) {
                const item = player.GetItemByEntry(itemEntry);
                if (item) {
                    player.RemoveItem(item.GetEntry(), item.GetCount());
                    player.SendBroadcastMessage(`Removed ${item.GetCount()}x ${item.GetName()} from your inventory.`);
                }
            }

            // Optionally, grant the player a small reward for having the quest
            const rewardItemEntry = 1234; // Replace with the desired reward item entry ID
            const rewardItemCount = 1;
            player.AddItem(rewardItemEntry, rewardItemCount);
            player.SendBroadcastMessage(`You have been granted ${rewardItemCount}x ${GetItemLink(rewardItemEntry)} as compensation.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => OnAreaTrigger(...args));
```

In this script:
1. We define the entry ID of the deprecated quest and the area ID that triggers the quest removal.
2. When the player enters the specified area, we check if they have the deprecated quest in their quest log using `player.HasQuest()`.
3. If the player has the quest, we remove it using `player.RemoveQuest()` and send a broadcast message to inform the player.
4. We then check if the player has any items related to the quest in their inventory. If found, we remove those items using `player.RemoveItem()` and send a message to notify the player.
5. Optionally, we can grant the player a small reward item as compensation for having the quest. We use `player.AddItem()` to add the reward item to their inventory and send a message to inform them.
6. Finally, we register the `OnAreaTrigger` event to trigger the script whenever the player enters the specified area.

This script demonstrates how to remove a quest from the player's quest log and handle related tasks such as removing quest items and granting a small reward.

## RemoveSpell
Removes a spell from the player's spell book based on the spell entry ID.

### Parameters
* entry: number - The ID of the spell to remove from the player's spell book

### Example Usage
This example listens for the `PLAYER_EVENT_ON_LEARN_SPELL` event and removes a spell if the player already knows a similar spell.

```typescript
const SPELL_SLOW_FALL = 130;
const SPELL_LEVITATE = 1706;

const onLearnSpell: player_event_on_learn_spell = (event: number, player: Player, spellId: number): void => {
    if (spellId === SPELL_SLOW_FALL) {
        if (player.HasSpell(SPELL_LEVITATE)) {
            player.RemoveSpell(SPELL_LEVITATE);
            player.SendBroadcastMessage("You have learned Slow Fall. Levitate has been removed from your spell book.");
        }
    }
    else if (spellId === SPELL_LEVITATE) {
        if (player.HasSpell(SPELL_SLOW_FALL)) {
            player.RemoveSpell(SPELL_SLOW_FALL);
            player.SendBroadcastMessage("You have learned Levitate. Slow Fall has been removed from your spell book.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEARN_SPELL, (...args) => onLearnSpell(...args));
```

In this example:
1. We define constants for the spell IDs of Slow Fall and Levitate.
2. We register a callback function `onLearnSpell` for the `PLAYER_EVENT_ON_LEARN_SPELL` event.
3. When the player learns a new spell, the `onLearnSpell` function is called with the player object and the learned spell ID.
4. If the learned spell is Slow Fall (ID 130):
   - We check if the player already has the Levitate spell using `player.HasSpell(SPELL_LEVITATE)`.
   - If the player has Levitate, we remove it from their spell book using `player.RemoveSpell(SPELL_LEVITATE)`.
   - We send a broadcast message to the player informing them that Levitate has been removed.
5. Similarly, if the learned spell is Levitate (ID 1706):
   - We check if the player already has the Slow Fall spell using `player.HasSpell(SPELL_SLOW_FALL)`.
   - If the player has Slow Fall, we remove it from their spell book using `player.RemoveSpell(SPELL_SLOW_FALL)`.
   - We send a broadcast message to the player informing them that Slow Fall has been removed.

This script ensures that the player only has one of the two similar spells (Slow Fall or Levitate) in their spell book at a time. When they learn one of these spells, the other spell is automatically removed to avoid redundancy.

## RemovedInsignia
This method is called when a player loots another player's corpse and removes their insignia. It is commonly used in PvP scenarios where players can loot insignias from fallen enemies to gain honor points or other rewards.

### Parameters
* looter: [Player](./player.md) - The player who is looting the insignia from the corpse.

### Example Usage
In this example, we'll create a script that rewards players with honor points and a custom currency called "Conquest Points" when they loot an insignia from an enemy player's corpse in a battleground.

```typescript
const CONQUEST_POINTS_ENTRY = 123456; // Custom currency entry ID
const CONQUEST_POINTS_AMOUNT = 10; // Amount of Conquest Points to reward
const HONOR_POINTS_AMOUNT = 100; // Amount of Honor Points to reward

const onPlayerLootInsignia: player_event_on_loot_insignia = (event: number, player: Player, looter: Player): void => {
    // Check if the player is in a battleground
    if (player.InBattleground()) {
        // Reward the looter with Conquest Points
        looter.AddItem(CONQUEST_POINTS_ENTRY, CONQUEST_POINTS_AMOUNT);
        
        // Reward the looter with Honor Points
        looter.ModifyHonorPoints(HONOR_POINTS_AMOUNT);
        
        // Send a message to the looter
        looter.SendBroadcastMessage(`You have looted ${player.GetName()}'s insignia and received ${CONQUEST_POINTS_AMOUNT} Conquest Points and ${HONOR_POINTS_AMOUNT} Honor Points!`);
        
        // Send a message to the player whose insignia was looted
        player.SendBroadcastMessage(`Your insignia has been looted by ${looter.GetName()}!`);
        
        // Log the event to the server console
        console.log(`[Insignia Looted] ${looter.GetName()} looted ${player.GetName()}'s insignia in a battleground.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_INSIGNIA, (...args) => onPlayerLootInsignia(...args));
```

In this script:
1. We define constants for the custom currency entry ID, the amount of Conquest Points to reward, and the amount of Honor Points to reward.
2. We create a function called `onPlayerLootInsignia` that handles the `PLAYER_EVENT_ON_LOOT_INSIGNIA` event.
3. Inside the function, we first check if the player whose insignia is being looted is in a battleground using the `InBattleground()` method.
4. If the player is in a battleground, we reward the looter with Conquest Points using the `AddItem()` method and the specified entry ID and amount.
5. We also reward the looter with Honor Points using the `ModifyHonorPoints()` method and the specified amount.
6. We send a broadcast message to the looter informing them of the rewards they received using the `SendBroadcastMessage()` method.
7. We send a broadcast message to the player whose insignia was looted, informing them of who looted their insignia.
8. Finally, we log the event to the server console for tracking purposes.

This script enhances the PvP experience by rewarding players for looting insignias from enemy players' corpses in battlegrounds, providing an incentive for players to actively participate in PvP combat.

## ResetAchievements
This method will reset all of the player's completed achievements, effectively removing any achievements they have earned on their account.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any values.

### Example Usage
In this example, we will reset a player's achievements if they have been inactive for a certain number of days. This script will run whenever a player logs into the world.

```typescript
const DAYS_INACTIVE_THRESHOLD = 90;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's last login timestamp
    const lastLogin = player.GetLastLogin();

    // Get the current timestamp
    const currentTime = os.time();

    // Calculate the number of days since the player's last login
    const daysSinceLastLogin = (currentTime - lastLogin) / 86400; // 86400 seconds in a day

    // If the player has been inactive for more than the threshold, reset their achievements
    if (daysSinceLastLogin > DAYS_INACTIVE_THRESHOLD) {
        player.SendBroadcastMessage(`Welcome back! Due to your extended absence, your achievements have been reset.`);
        player.ResetAchievements();

        // Optionally, you can also grant the player a special "Returning Player" achievement
        const RETURNING_PLAYER_ACHIEVEMENT_ID = 1234;
        player.AddAchievement(RETURNING_PLAYER_ACHIEVEMENT_ID);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this script:
1. We define a constant `DAYS_INACTIVE_THRESHOLD` to set the number of days a player must be inactive before their achievements are reset.
2. We register a `PLAYER_EVENT_ON_LOGIN` event handler to run our script whenever a player logs into the world.
3. We retrieve the player's last login timestamp using `player.GetLastLogin()`.
4. We calculate the number of days since the player's last login by subtracting the last login timestamp from the current timestamp and dividing by the number of seconds in a day (86400).
5. If the number of days since the player's last login exceeds our inactive threshold, we proceed to reset their achievements.
6. We send the player a broadcast message informing them that their achievements have been reset due to their extended absence.
7. We call the `player.ResetAchievements()` method to reset all of the player's completed achievements.
8. Optionally, we can also grant the player a special "Returning Player" achievement using `player.AddAchievement()` to acknowledge their return to the game after an extended absence.

This script provides a way to manage inactive players' achievements and encourage them to return to the game by offering a special "Returning Player" achievement. You can customize the inactive threshold and the messages sent to the player to suit your server's needs.

## ResetAllCooldowns
This method resets all of the player's cooldowns, including spell cooldowns, item cooldowns, and category cooldowns.

### Parameters
None

### Returns
None

### Example Usage
This example script demonstrates how to reset a player's cooldowns when they die in a specific area.

```typescript
const AREA_ID = 1234; // Replace with the desired area ID

const onPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    if (player.GetAreaId() === AREA_ID) {
        player.ResetAllCooldowns();
        player.SendBroadcastMessage("Your cooldowns have been reset!");

        // Optionally, you can also reset the player's item cooldowns
        const items = player.GetItems();
        for (const item of items) {
            item.ResetCooldown();
        }

        // You can also reset specific spell category cooldowns
        const categoryId = 123; // Replace with the desired spell category ID
        player.ResetTypeCooldowns(categoryId);

        // Optionally, you can send a message to the player's party or raid
        const group = player.GetGroup();
        if (group) {
            group.SendGroupMessage(`${player.GetName()}'s cooldowns have been reset!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => onPlayerDeath(...args));
```

In this example:
1. We define a constant `AREA_ID` to specify the area where the cooldown reset should occur.
2. Inside the `onPlayerDeath` event handler, we check if the player's current area matches the specified `AREA_ID`.
3. If the player is in the desired area, we call `player.ResetAllCooldowns()` to reset all of their cooldowns.
4. We send a broadcast message to the player informing them that their cooldowns have been reset.
5. Optionally, we can also reset the player's item cooldowns by iterating over their items using `player.GetItems()` and calling `item.ResetCooldown()` on each item.
6. We can also reset specific spell category cooldowns by calling `player.ResetTypeCooldowns(categoryId)` with the desired category ID.
7. Optionally, we can send a message to the player's party or raid using `group.SendGroupMessage()` if the player is in a group.
8. Finally, we register the `onPlayerDeath` event handler using `RegisterPlayerEvent()` to trigger the cooldown reset when the player dies.

This example showcases a more advanced usage of the `ResetAllCooldowns()` method, demonstrating how to reset cooldowns conditionally based on the player's location and how to reset specific item and spell category cooldowns as well. It also includes optional features like sending messages to the player and their group.

## ResetHonor
Resets the player's weekly honor points and kills to zero. This is useful for managing weekly rewards or ladder rankings based on honor points earned each week.

### Parameters
None

### Returns
None

### Example Usage
This example script will reset all online players' weekly honor every Wednesday at midnight server time. It also rewards players with bonus gold based on their weekly honor points earned before the reset occurs.

```typescript
// Set up a weekly honor reset schedule
const WEEKLY_HONOR_RESET_DAY = 3;  // 3 = Wednesday
const WEEKLY_HONOR_RESET_HOUR = 0; // 0 = Midnight

// Define honor point thresholds and their respective gold rewards
const HONOR_REWARD_TIERS = [
    { points: 5000,  gold: 100 },
    { points: 10000, gold: 250 },
    { points: 20000, gold: 500 },
];

function RewardWeeklyHonor(player: Player): void {
    const honorPoints = player.GetHonorPoints();
    
    for (const { points, gold } of HONOR_REWARD_TIERS) {
        if (honorPoints >= points) {
            player.ModifyMoney(gold * 10000);
            player.SendBroadcastMessage(`You have been rewarded ${gold} gold for earning over ${points} honor this week!`);
            break;
        }
    }
}

function PerformWeeklyHonorReset(): void {
    const players = GetPlayersInWorld();

    for (const player of players) {
        RewardWeeklyHonor(player);
        player.ResetHonor();
        player.SendBroadcastMessage("Your weekly honor has been reset. Keep up the good fight!");
    }
}

function OnWorldUpdate(events: Map<string, any>) {
    const today = os.date("*t");

    if (today.wday == WEEKLY_HONOR_RESET_DAY && today.hour == WEEKLY_HONOR_RESET_HOUR) {
        PerformWeeklyHonorReset();
    }
}

RegisterServerEvent(ServerEvents.ELUNA_EVENT_ON_LUA_STATE_CLOSE, OnWorldUpdate);
```
This script does the following:

1. Defines constants for the weekly reset day and hour, as well as honor point thresholds and their corresponding gold reward amounts.

2. Implements a `RewardWeeklyHonor` function that checks a player's weekly honor points against the defined thresholds and rewards them accordingly with bonus gold, sending them a message about their reward.

3. Implements a `PerformWeeklyHonorReset` function that iterates through all online players, rewards their weekly honor using the `RewardWeeklyHonor` function, resets their honor to zero using the `ResetHonor` method, and sends them a message confirming the reset.

4. Registers an `OnWorldUpdate` event handler that triggers the `PerformWeeklyHonorReset` function every Wednesday at midnight server time.

This script incentivizes players to actively participate in PvP throughout the week to earn honor points and receive gold rewards, while still ensuring a fair playing field by resetting everyone's honor points back to zero on a weekly basis.

## ResetPetTalents
This method will reset all talent points for the player's active pet, allowing for the pet's talents to be re-selected.

### Parameters
None

### Returns
None

### Example Usage
This example will reset the player's pet's talents when the player levels up and their level is divisible by 10.

```typescript
const LEVELS_TO_RESET_PET_TALENTS = [10, 20, 30, 40, 50, 60, 70, 80];

const OnPlayerLevelUp: player_event_on_level_change = (event: number, player: Player, oldLevel: number): void => {
    const newLevel = player.GetLevel();

    if (LEVELS_TO_RESET_PET_TALENTS.includes(newLevel)) {
        const pet = player.GetPet();

        if (pet) {
            player.ResetPetTalents();

            player.SendBroadcastMessage(`Your pet's talents have been reset due to reaching level ${newLevel}!`);

            const stableSlotCount = player.GetStableSlots();
            for (let i = 0; i < stableSlotCount; i++) {
                const stablePet = player.GetStablePet(i);
                if (stablePet) {
                    player.ResetPetTalents();
                    player.SendBroadcastMessage(`Your stable pet's (slot ${i + 1}) talents have also been reset.`);
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => OnPlayerLevelUp(...args));
```

In this example:
1. We define an array of levels at which we want to reset the player's pet's talents.
2. When the player levels up, we check if their new level is included in the `LEVELS_TO_RESET_PET_TALENTS` array.
3. If the player's level matches one of the defined levels, we proceed with resetting their active pet's talents using `player.ResetPetTalents()`.
4. We send a broadcast message to the player informing them that their pet's talents have been reset.
5. We also iterate through the player's stable slots and reset the talents of any pets in the stable.
6. For each stable pet that had its talents reset, we send an additional broadcast message to the player indicating which stable slot the pet is in.

This script ensures that the player's pet and stable pets have their talents reset at key levels, allowing the player to re-select their pet's talents and adapt to new challenges as they progress through the game.

## ResetSpellCooldown
Resets the cooldown of a specified spell for the player. This can be useful for creating custom abilities or effects that bypass the default spell cooldown restrictions.

### Parameters
* spellId: number - The ID of the spell to reset the cooldown for. You can find spell IDs in the `spell_template` table in the world database.
* update: boolean (optional) - If set to true, will send an update to the client to reflect the cooldown reset. Defaults to false if not specified.

### Example Usage
Creating a custom item that resets the cooldown of the Hearthstone spell when used:
```typescript
const HEARTHSTONE_SPELL_ID = 8690;
const CUSTOM_ITEM_ENTRY = 123456;

const useItem: player_event_on_use_item = (event, player, item, target) => {
    if (item.GetEntry() === CUSTOM_ITEM_ENTRY) {
        player.ResetSpellCooldown(HEARTHSTONE_SPELL_ID, true);
        player.SendBroadcastMessage("Your Hearthstone cooldown has been reset!");
        
        // Remove the item after use
        player.RemoveItem(item.GetEntry(), 1);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => useItem(...args));
```

In this example, we create a custom item with the entry ID `123456`. When a player uses this item, the script checks if the item's entry matches the custom item entry. If it does, the script will:
1. Reset the cooldown of the Hearthstone spell (ID `8690`) for the player using `ResetSpellCooldown()`, passing `true` to update the client.
2. Send a message to the player indicating that their Hearthstone cooldown has been reset using `SendBroadcastMessage()`.
3. Remove one instance of the custom item from the player's inventory using `RemoveItem()`.

This script allows players to instantly use their Hearthstone again by consuming the custom item, bypassing the default 30-minute cooldown. The script can be expanded to include additional functionality, such as checking if the player has the Hearthstone spell learned or adding a custom cooldown to the item itself to prevent abuse.

## ResetTalents
Resets the player's talents, refunding all spent talent points.

### Parameters
* noCost (optional): boolean - If set to true, the player will not be charged the cost of resetting their talents. Default value is false.

### Example Usage
This script allows players to reset their talents by talking to an NPC, but only if they are in a specific zone and meet a minimum level requirement. The script also checks if the player has enough gold to cover the cost of resetting their talents, unless they have a specific item in their inventory.

```typescript
const RESET_TALENT_ITEM = 1234; // Item ID for a special item that allows players to reset talents for free
const RESET_TALENT_COST = 10000; // Cost in copper to reset talents (10 gold)
const MIN_LEVEL_TO_RESET = 10; // Minimum level required to reset talents
const RESET_TALENT_ZONE = 12; // Zone ID where players are allowed to reset talents

function OnGossipHello(event: OnGossipEvent, player: Player, object: GameObject) {
    if (player.GetZoneId() !== RESET_TALENT_ZONE) {
        player.SendBroadcastMessage("You must be in the specified zone to reset your talents.");
        return;
    }

    if (player.GetLevel() < MIN_LEVEL_TO_RESET) {
        player.SendBroadcastMessage(`You must be at least level ${MIN_LEVEL_TO_RESET} to reset your talents.`);
        return;
    }

    let shouldCharge = true;
    if (player.HasItem(RESET_TALENT_ITEM)) {
        shouldCharge = false;
        player.RemoveItem(RESET_TALENT_ITEM, 1);
        player.SendBroadcastMessage("Your special item has been consumed to reset your talents for free.");
    } else if (player.GetCoinage() < RESET_TALENT_COST) {
        player.SendBroadcastMessage(`You need at least ${RESET_TALENT_COST / 10000} gold to reset your talents.`);
        return;
    }

    player.ResetTalents(shouldCharge);
    player.SendBroadcastMessage("Your talents have been reset.");
}

RegisterGameObjectEvent(1234, GameObjectEvents.GAMEOBJECT_EVENT_ON_GOSSIP_HELLO, OnGossipHello);
```

In this example:
1. The script checks if the player is in the specified zone (`RESET_TALENT_ZONE`) and meets the minimum level requirement (`MIN_LEVEL_TO_RESET`). If not, it sends an appropriate message to the player and exits.
2. If the player has a special item (`RESET_TALENT_ITEM`), the script sets `shouldCharge` to false, consumes the item, and informs the player that their talents have been reset for free.
3. If the player does not have the special item, the script checks if they have enough gold (`RESET_TALENT_COST`) to cover the cost of resetting their talents. If not, it sends a message to the player and exits.
4. Finally, the script calls `ResetTalents(shouldCharge)` to reset the player's talents, either charging them the specified amount or resetting for free based on the `shouldCharge` variable.

This script provides a more complex example of using the `ResetTalents()` method, incorporating zone checks, level requirements, item consumption, and gold costs.

## ResetTalentsCost
Returns the total cost in copper for the player to reset their talents.  This cost is based on an accumulation of all the times a player has reset their talents in the past.

### Parameters
None

### Returns
cost: number - The amount in copper to reset talents

### Example Usage:
This example listens for when a player talks to an NPC and if they have enough money, they can reset their talents for free.  Otherwise, a message is sent telling them they don't have enough money and how much more they need.

```typescript
const INNKEEPER_ENTRY = 1234; 
const onGossipHello: player_event_on_gossip_hello = (event: number, player: Player, object: GameObject) => {
    const talentResetCost = player.ResetTalentsCost();
    const playerMoney = player.GetCoinage();

    if (object.GetEntry() === INNKEEPER_ENTRY) {
        if (playerMoney >= talentResetCost) {
            player.ResetTalents(true);
            player.ModifyMoney(-talentResetCost);
            player.SendNotification(`Your talents have been reset for ${GetMoneyString(talentResetCost)}`);
        } else {
            const neededMoney = talentResetCost - playerMoney;
            player.SendNotification(`You don't have enough money to reset your talents. You need ${GetMoneyString(neededMoney)} more.`);
        }
        player.GossipComplete();
    }
};

function GetMoneyString(copper: number): string {
    const gold = Math.floor(copper / 10000);
    copper -= gold * 10000;
    const silver = Math.floor(copper / 100);
    copper -= silver * 100;

    return `${gold}g ${silver}s ${copper}c`;
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => onGossipHello(...args));
```

In this example, when a player interacts with an NPC with the entry `INNKEEPER_ENTRY`, it will check if the player has enough money to reset their talents. If they do, it will reset their talents, take the money from them, and send them a notification with the cost. If they don't have enough money, it will send a notification telling them how much more money they need.

The `GetMoneyString` function is a helper function that converts the copper amount to a formatted string with gold, silver, and copper.

## ResetTypeCooldowns
Resets the cooldown of all spells within the specified category for the player. This can be useful for creating custom buffs, items, or mechanics that allow players to bypass normal spell cooldowns.

### Parameters
* category: number - The spell category to reset cooldowns for. Spell categories are defined in the SpellCategory.dbc file.
* update: boolean (optional) - If set to true, will send cooldown update packets to the client. Defaults to true if not specified.

### Example Usage
Example script that resets all cooldowns for a player's Fire spells (category 11) when they kill a creature:
```typescript
const FIRE_SPELL_CATEGORY = 11;

const onCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    // Check if the creature killed is a specific entry ID
    if (creature.GetEntry() == 12345) {
        // Reset cooldowns for Fire spells
        player.ResetTypeCooldowns(FIRE_SPELL_CATEGORY);

        // Notify the player
        player.SendBroadcastMessage("Your Fire spell cooldowns have been reset!");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => onCreatureKill(...args));
```

Example script that adds a custom item which resets a player's hearthstone cooldown when used:
```typescript
const HEARTHSTONE_CATEGORY = 94;
const CUSTOM_ITEM_ENTRY = 12345;

const onItemUse: player_event_on_use_item = (event: number, player: Player, item: Item, gameObject: GameObject, target: Unit) => {
    // Check if the used item is our custom item
    if (item.GetEntry() == CUSTOM_ITEM_ENTRY) {
        // Reset hearthstone cooldown
        player.ResetTypeCooldowns(HEARTHSTONE_CATEGORY, false);

        // Remove the item from the player's inventory
        player.RemoveItem(item.GetEntry(), 1);

        // Notify the player
        player.SendBroadcastMessage("Your hearthstone cooldown has been reset!");

        // Prevent default item use behavior
        return false;
    }

    // Allow default item use behavior for other items
    return true;
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => onItemUse(...args));
```
These examples demonstrate how the ResetTypeCooldowns method can be used in different scenarios to create unique gameplay mechanics or to provide utility to players. By resetting cooldowns for specific spell categories, you can alter the pacing of combat or allow players to use certain abilities more frequently than normally allowed.

## ResurrectPlayer
Resurrects the player, setting their health to a percentage of their maximum health and optionally applying resurrection sickness.

### Parameters
* healthPercent?: number - (Optional) The percentage of the player's maximum health to set their current health to upon resurrection. If not provided, it defaults to 100% (full health).
* ressSickness?: boolean - (Optional) If set to true, the player will suffer from resurrection sickness upon being resurrected. If not provided, it defaults to false (no resurrection sickness).

### Example Usage
Here's an example of how to use the `ResurrectPlayer` method in a script that listens for the `PLAYER_EVENT_ON_DEATH` event and resurrects the player with 50% health and no resurrection sickness if they have a specific item in their inventory:

```typescript
const RESURRECTION_ITEM_ENTRY = 12345;

const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    // Check if the player has the required resurrection item
    const hasResurrectionItem = player.HasItem(RESURRECTION_ITEM_ENTRY);

    if (hasResurrectionItem) {
        // Remove the resurrection item from the player's inventory
        player.RemoveItem(RESURRECTION_ITEM_ENTRY, 1);

        // Resurrect the player with 50% health and no resurrection sickness
        player.ResurrectPlayer(50, false);

        // Send a message to the player
        player.SendBroadcastMessage("You have been resurrected by the power of the resurrection item!");
    } else {
        // Send a message to the player
        player.SendBroadcastMessage("You do not have the required resurrection item. Use a spirit healer to resurrect.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this example:
1. We define a constant `RESURRECTION_ITEM_ENTRY` with the entry ID of the item required for resurrection.
2. We register a callback function `OnPlayerDeath` to handle the `PLAYER_EVENT_ON_DEATH` event.
3. Inside the callback function, we check if the player has the resurrection item using the `HasItem` method.
4. If the player has the item:
   - We remove one instance of the resurrection item from their inventory using `RemoveItem`.
   - We resurrect the player using `ResurrectPlayer`, setting their health to 50% and disabling resurrection sickness.
   - We send a message to the player informing them about the resurrection.
5. If the player doesn't have the item:
   - We send a message to the player instructing them to use a spirit healer for resurrection.

This script allows players with a specific resurrection item to be resurrected with partial health and no resurrection sickness upon death, providing a unique gameplay mechanic.

## RewardQuest
Rewards the player with items, gold, and experience based on the provided quest entry upon completion of the quest. The player must have completed the quest and not have already been rewarded for this to succeed.  Quest rewards are defined in the quest_template table of the World Database.  For more information and examples see: https://www.azerothcore.org/wiki/quest_template

### Parameters
* entry: number - The quest entry ID from the quest_template table

### Example Usage
Reward the player with triple the gold reward for turning in a repeatable or daily quest, otherwise reward normally.
```typescript
// NPC Emissary of Gold
const EMISSARY_OF_GOLD_QUEST = 12345;  

const QuestReward: player_event_on_quest_reward = (event: number, player: Player, quest: Quest) => {
    const questEntry = quest.GetEntry();

    if (questEntry !== EMISSARY_OF_GOLD_QUEST) {
        // Reward normally for non-Emissary of Gold quests
        player.RewardQuest(questEntry);
        return;
    }

    // Get the quest template and verify it's valid
    const questTemplate = quest.GetQuestTemplate();
    if (!questTemplate) {
        player.SendBroadcastMessage("Invalid quest template for Emissary of Gold");
        return;
    }

    // Calculate triple gold reward & convert copper to gold for display
    const goldReward = (questTemplate.GetRewMoney() * 3) / 10000;

    // Grant triple gold and quest reward
    player.ModifyMoney(goldReward);
    player.SendBroadcastMessage(`You have earned a bonus of ${goldReward} gold for completing the Emissary of Gold quest!`);
    player.RewardQuest(questEntry);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_REWARD, (...args) => QuestReward(...args));
```

This script does the following:
1. Defines the quest entry for the special "Emissary of Gold" quest 
2. Registers a player event handler for the `PLAYER_EVENT_ON_QUEST_REWARD` event
3. When a player turns in a quest, it checks if it is the Emissary of Gold quest
4. If not, it rewards the quest normally using `RewardQuest`
5. If it is the Emissary quest:
   - It retrieves the quest template to access reward data
   - Calculates triple the normal gold reward 
   - Grants the bonus gold to the player
   - Sends the player a message about their gold bonus
   - Rewards the quest normally, granting remaining rewards like items and experience

So in summary, this script allows you to define special reward handling for specific quests, while still ensuring the default rewards are granted. It's a useful pattern for quest turn-in scripts that modify or enhance rewards.

## SaveToDB
This method saves the player's current state and all associated data to the database. It ensures that any changes made to the player's attributes, inventory, quest progress, or other relevant information persist across server restarts or disconnections.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
Let's consider a scenario where a player completes a custom quest and receives a unique item as a reward. We want to ensure that the player's progress and the newly acquired item are saved to the database immediately after the quest completion.

```typescript
const CUSTOM_QUEST_ENTRY = 9001;
const UNIQUE_REWARD_ITEM_ENTRY = 1234;

const onQuestComplete: player_event_on_quest_finished = (event: number, player: Player, quest: number): void => {
    if (quest === CUSTOM_QUEST_ENTRY) {
        // Reward the player with the unique item
        const rewardItem = player.AddItem(UNIQUE_REWARD_ITEM_ENTRY, 1);

        if (rewardItem) {
            // Send a message to the player
            player.SendBroadcastMessage(`Congratulations! You have completed the quest and received a unique reward.`);

            // Update the player's quest status in the database
            player.RewardQuest(CUSTOM_QUEST_ENTRY);

            // Save the player's progress and inventory to the database
            player.SaveToDB();

            // Optionally, you can also save the player's position and orientation
            const playerPosition = player.GetLocation();
            const playerOrientation = player.GetOrientation();
            CharDBQuery(`UPDATE characters SET position_x = ${playerPosition.x}, position_y = ${playerPosition.y}, position_z = ${playerPosition.z}, orientation = ${playerOrientation} WHERE guid = ${player.GetGUID()}`);
        } else {
            // Handle the case when adding the item fails (e.g., inventory is full)
            player.SendBroadcastMessage(`Your inventory is full. Please make space and complete the quest again.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_FINISHED, (...args) => onQuestComplete(...args));
```

In this example:
1. We define a custom quest entry (`CUSTOM_QUEST_ENTRY`) and a unique reward item entry (`UNIQUE_REWARD_ITEM_ENTRY`).
2. We register a player event handler for the `PLAYER_EVENT_ON_QUEST_FINISHED` event.
3. When the player completes the specified custom quest, we reward them with the unique item using `player.AddItem()`.
4. If the item is successfully added to the player's inventory, we send a congratulatory message to the player using `player.SendBroadcastMessage()`.
5. We update the player's quest status in the database using `player.RewardQuest()`.
6. We save the player's progress and inventory to the database using `player.SaveToDB()`.
7. Optionally, we also save the player's current position and orientation to the database using a direct database query with `CharDBQuery()`.
8. If adding the item fails (e.g., due to a full inventory), we send an appropriate message to the player.

By calling `player.SaveToDB()` after making important changes to the player's state, we ensure that the progress is persisted in the database and will be retained even if the server restarts or the player disconnects.

## Say
Sends a message as the player to nearby players in the game world.

### Parameters
* text: string - The message to send
* lang: [Language](../language.md) - The language the message should be sent as (common, dwarvish, etc.)

### Example Usage
Send a message based on a player's class when they enter the world:
```typescript
const CLASS_GREETINGS = {
    [Classes.CLASS_WARRIOR]: "I am ready to fight!",
    [Classes.CLASS_PALADIN]: "The Light will guide us.",
    [Classes.CLASS_HUNTER]: "Time to hunt!",
    [Classes.CLASS_ROGUE]: "Sneaking in the shadows...",
    [Classes.CLASS_PRIEST]: "Let me heal your wounds.",
    [Classes.CLASS_DEATH_KNIGHT]: "The Scourge will rise again!",
    [Classes.CLASS_SHAMAN]: "The elements are restless today.",
    [Classes.CLASS_MAGE]: "Knowledge is power!",
    [Classes.CLASS_WARLOCK]: "Darkness calls.",
    [Classes.CLASS_DRUID]: "Nature's balance must be preserved."
};

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const className = player.GetClass();
    const greeting = CLASS_GREETINGS[className];

    if (greeting) {
        player.Say(greeting, Language.LANG_UNIVERSAL);
    } else {
        player.Say("Greetings!", Language.LANG_UNIVERSAL);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```
In this example, when a player logs in, the script checks their class and sends a personalized greeting message to nearby players using the `Say` method. The message is sent in the universal language so that all players can understand it regardless of their client's language settings.

## SendAddonMessage
Sends an addon message to the specified player receiver. This method allows communication between the server and client addons, enabling data exchange and synchronization.

### Parameters
* prefix: string - The addon message prefix, which identifies the addon or the purpose of the message.
* message: string - The actual content of the addon message.
* channel: number - The communication channel on which the message will be sent. Valid channels are:
  - 0: ADDON_CHANNEL_GUILD
  - 1: ADDON_CHANNEL_PARTY
  - 2: ADDON_CHANNEL_RAID
* receiver: [Player](./player.md) - The player who will receive the addon message.

### Example Usage:
Sending a custom addon message to a player when they enter a specific area.
```typescript
const ADDON_PREFIX = "MyAddon";
const AREA_TRIGGER_ID = 1234;

const onAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaTrigger: AreaTrigger) => {
    if (areaTrigger.GetEntry() === AREA_TRIGGER_ID) {
        const message = JSON.stringify({
            type: "AreaEntered",
            data: {
                areaId: AREA_TRIGGER_ID,
                timestamp: GetGameTime(),
            },
        });

        player.SendAddonMessage(ADDON_PREFIX, message, 0, player);

        // Alternatively, send the message to all group members
        const group = player.GetGroup();
        if (group) {
            const groupMembers = group.GetMembers();
            for (const member of groupMembers) {
                player.SendAddonMessage(ADDON_PREFIX, message, 1, member);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => onAreaTrigger(...args));
```
In this example:
1. When a player enters a specific area trigger (identified by `AREA_TRIGGER_ID`), the script generates an addon message.
2. The addon message is a JSON-formatted string containing the type of event ("AreaEntered") and relevant data (area ID and timestamp).
3. The message is sent to the player who triggered the event using `SendAddonMessage()` with the `ADDON_CHANNEL_GUILD` channel.
4. Additionally, if the player is part of a group, the script retrieves the group members and sends the addon message to each member using the `ADDON_CHANNEL_PARTY` channel.

This example demonstrates how `SendAddonMessage()` can be used to communicate important events or data to the player's addon, enabling the addon to react or display information accordingly. The JSON formatting allows for structured data exchange between the server and client addons.

## SendAreaTriggerMessage
This method sends an area trigger message to the player's chat window. Area trigger messages are often used to display information or instructions to the player when they enter a specific area or trigger a certain event in the game world.

### Parameters
* message: string - The message to be displayed in the player's chat window.

### Example Usage
Here's an example of how to use `SendAreaTriggerMessage` to guide a player through a custom scripted event:

```typescript
const AREA_TRIGGER_ID = 1234;
const BOSS_CREATURE_ENTRY = 5678;

const AreaTrigger: player_event_on_area_trigger = (event: number, player: Player, triggerId: number) => {
    if (triggerId === AREA_TRIGGER_ID) {
        player.SendAreaTriggerMessage("You have entered the boss's lair. Prepare for battle!");

        // Spawn the boss creature
        const boss = player.GetMap().SpawnCreature(BOSS_CREATURE_ENTRY, player.GetX(), player.GetY(), player.GetZ(), player.GetO(), 0, player.GetPhaseMask());

        // Set the boss as hostile to the player
        boss.SetReactState(ReactStates.REACT_AGGRESSIVE);
        boss.AddThreat(player, 1);

        // Start a timer to check if the player has defeated the boss
        let timerCount = 0;
        const checkBossDefeated = () => {
            if (!boss.IsAlive()) {
                player.SendAreaTriggerMessage("Congratulations! You have defeated the boss and completed the challenge.");
                // Reward the player with items or experience points
                player.AddItem(REWARD_ITEM_ENTRY, 1);
                player.GiveXP(1000, null);
            } else if (timerCount >= 30) {
                player.SendAreaTriggerMessage("You have failed to defeat the boss in time. The challenge has ended.");
                boss.DespawnOrUnsummon(0);
            } else {
                timerCount++;
                timer.lastTimer(1000, checkBossDefeated);
            }
        };

        timer.lastTimer(1000, checkBossDefeated);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => AreaTrigger(...args));
```

In this example:
1. When the player enters a specific area trigger (identified by `AREA_TRIGGER_ID`), the script sends an area trigger message to inform the player that they have entered the boss's lair.
2. The script then spawns the boss creature (identified by `BOSS_CREATURE_ENTRY`) at the player's location and sets it as hostile to the player.
3. A timer is started to periodically check if the player has defeated the boss.
   - If the boss is defeated, the player receives a congratulatory message and is rewarded with an item and experience points.
   - If the timer reaches 30 seconds and the boss is still alive, the player receives a message indicating that they have failed the challenge, and the boss is despawned.

This example demonstrates how `SendAreaTriggerMessage` can be used in combination with other scripting methods to create engaging and interactive events for players.

## SendAuctionMenu
Sends an auction house window to the player from the specified unit. This allows the player to interact with the auction house, browse listings, and make purchases or sales.

### Parameters
* sender: [Unit](./unit.md) - The unit (usually an NPC) that represents the auction house.

### Example Usage
Here's an example of how to create an NPC that opens the auction house window for players when interacted with:

```typescript
const AUCTIONEER_ENTRY = 1234; // Replace with the actual NPC entry ID

const OnGossipHello: creature_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === AUCTIONEER_ENTRY) {
        player.SendAuctionMenu(creature);
        player.SendGossipComplete();
    }
};

const OnGossipSelect: creature_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number) => {
    if (creature.GetEntry() === AUCTIONEER_ENTRY) {
        player.SendAuctionMenu(creature);
        player.SendGossipComplete();
    }
};

RegisterCreatureEvent(AUCTIONEER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterCreatureEvent(AUCTIONEER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example:
1. We define the entry ID of the auctioneer NPC (`AUCTIONEER_ENTRY`).
2. We register two event handlers for the auctioneer NPC:
   - `OnGossipHello`: Triggered when the player interacts with the NPC.
   - `OnGossipSelect`: Triggered when the player selects an option from the NPC's gossip menu.
3. In both event handlers, we check if the interacted creature is the auctioneer NPC by comparing its entry ID.
4. If it is the auctioneer NPC, we send the auction house window to the player using `player.SendAuctionMenu(creature)`.
5. We also call `player.SendGossipComplete()` to close the gossip window after sending the auction house window.

With this script, whenever a player interacts with the specified auctioneer NPC, the auction house window will open, allowing them to browse and participate in auctions.

Note: Make sure to replace `AUCTIONEER_ENTRY` with the actual entry ID of the NPC you want to use as the auctioneer in your Azerothcore server.

## SendBroadcastMessage
This method sends a broadcast message to the player's screen. The message appears in the center of the screen and is visible to the player only.

### Parameters
* message: string - The message to be displayed on the player's screen.

### Example Usage
Here's an example of how to use the `SendBroadcastMessage` method to display a message to the player when they enter a specific area:

```typescript
const STORMWIND_AREA_ID = 1519;
const WELCOME_MESSAGE = "Welcome to Stormwind City, defender of the Alliance!";

const OnPlayerEnterArea: player_event_on_enter_area = (event: number, player: Player, newArea: Area, oldArea: Area) => {
    if (newArea.GetAreaId() === STORMWIND_AREA_ID) {
        player.SendBroadcastMessage(WELCOME_MESSAGE);

        // Additional actions or effects can be added here
        player.AddAura(48102, player); // Add "Stamina" aura to the player
        player.AddItem(HEARTHSTONE_ITEM_ID, 1); // Give the player a Hearthstone if they don't have one

        // Create a timed event to display a follow-up message after 5 seconds
        CreateLuaEvent((function() {
            player.SendBroadcastMessage("Don't forget to visit the Embassy Quarter for important quests!");
        }).bind(this), 5000, 1);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_AREA, (...args) => OnPlayerEnterArea(...args));
```

In this example:
1. We define constants for the Stormwind City area ID and the welcome message.
2. We register the `OnPlayerEnterArea` event handler using `RegisterPlayerEvent`.
3. When the player enters an area, the `OnPlayerEnterArea` function is called.
4. We check if the entered area is Stormwind City by comparing the `newArea`'s ID with the `STORMWIND_AREA_ID`.
5. If the player has entered Stormwind City, we send the welcome message using `player.SendBroadcastMessage(WELCOME_MESSAGE)`.
6. Additionally, we apply the "Stamina" aura to the player using `player.AddAura(48102, player)` to give them a temporary buff.
7. We also check if the player has a Hearthstone in their inventory, and if not, we give them one using `player.AddItem(HEARTHSTONE_ITEM_ID, 1)`.
8. Finally, we create a timed event using `CreateLuaEvent` to display a follow-up message after a 5-second delay. The message reminds the player to visit the Embassy Quarter for important quests.

This example demonstrates how to use the `SendBroadcastMessage` method in combination with other methods and game events to create an immersive experience for the player when they enter a specific area.

## SendCinematicStart
Starts a cinematic sequence for the player based on the provided cinematic sequence ID. These cinematics can be referenced in the World Database cinematic_sequences table. For more information about cinematics, you can find more details here: https://www.azerothcore.org/wiki/cinematic_sequences.

### Parameters
* CinematicSequenceId: number - The ID of the cinematic sequence to start, as defined in the cinematic_sequences table.

### Example Usage:
Create a custom scripted event that triggers a cinematic for players who complete a specific quest.
```typescript
const QUEST_ENTRY = 12345;
const CINEMATIC_SEQUENCE_ID = 678;

const QuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest) => {
    if (quest.GetEntry() === QUEST_ENTRY) {
        // Check if the player is in the correct map and zone for the cinematic
        if (player.GetMapId() === 1 && player.GetZoneId() === 1234) {
            // Start the cinematic sequence for the player
            player.SendCinematicStart(CINEMATIC_SEQUENCE_ID);

            // Delay the player's teleportation to the next area by 10 seconds
            player.AddDelayedEvent(10000, () => {
                player.Teleport(0, -8800.0, 645.0, 94.0, 0.6);
            });
        } else {
            // If the player is not in the correct location, send a message
            player.SendBroadcastMessage("You must be in the correct area to view the cinematic.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => QuestComplete(...args));
```
In this example, when a player completes a specific quest (with entry 12345), the script checks if the player is in the correct map and zone. If the player is in the correct location, the cinematic sequence (with ID 678) is started using the `SendCinematicStart` method.

After starting the cinematic, a delayed event is added to teleport the player to a specific location 10 seconds later, allowing time for the cinematic to play before moving the player to the next area.

If the player is not in the correct location when completing the quest, a broadcast message is sent to inform them that they must be in the correct area to view the cinematic.

This example demonstrates how to use the `SendCinematicStart` method in combination with other player methods and events to create an immersive quest experience with a cinematic sequence.

## SendGuildInvite
Sends a guild invitation from the [Player]'s [Guild](./guild.md) to the target [Player](./player.md).

### Parameters
* invitee: [Player](./player.md) - The player to send the guild invite to.

### Example Usage
This example demonstrates how to create a script that allows a player to invite another player to their guild by targeting them and using the `.guildinvite` command.

```typescript
// Variable to store the last player that was targeted
let targetedPlayer: Player | null = null;

// Handler for the .guildinvite command
const handleGuildInviteCommand: command_script_handler = (player: Player, command: string) => {
    // Check if the player has a guild
    if (!player.GetGuild()) {
        player.SendBroadcastMessage("You must be in a guild to invite players.");
        return;
    }

    // Check if the player has a valid invite target
    if (!targetedPlayer) {
        player.SendBroadcastMessage("You must target a player to invite them to your guild.");
        return;
    }

    // Check if the targeted player is already in a guild
    if (targetedPlayer.GetGuild()) {
        player.SendBroadcastMessage(`${targetedPlayer.GetName()} is already in a guild.`);
        return;
    }

    // Send the guild invite to the targeted player
    player.SendGuildInvite(targetedPlayer);
    player.SendBroadcastMessage(`You have invited ${targetedPlayer.GetName()} to join your guild.`);
};

// Handler for the PLAYER_EVENT_ON_TARGET_CHANGED event
const handlePlayerTargetChanged: player_event_on_target_changed = (event: number, player: Player, target: WorldObject) => {
    // Check if the target is a player
    if (target && target.IsPlayer()) {
        targetedPlayer = target.ToPlayer();
    } else {
        targetedPlayer = null;
    }
};

// Register the event handlers
RegisterCommandScriptHandler("guildinvite", handleGuildInviteCommand);
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_TARGET_CHANGED, handlePlayerTargetChanged);
```

In this example:

1. We create a variable `targetedPlayer` to store the last player that was targeted by the player using the `.guildinvite` command.

2. We define a command handler for the `.guildinvite` command that checks if the player is in a guild, has a valid invite target, and if the target is not already in a guild. If all conditions are met, it sends a guild invite to the targeted player using `player.SendGuildInvite(targetedPlayer)`.

3. We define an event handler for the `PLAYER_EVENT_ON_TARGET_CHANGED` event that updates the `targetedPlayer` variable whenever the player targets a new unit. If the target is a player, it is stored in `targetedPlayer`, otherwise `targetedPlayer` is set to `null`.

4. Finally, we register the command handler and event handler using `RegisterCommandScriptHandler` and `RegisterPlayerEvent` respectively.

With this script, players can target another player and use the `.guildinvite` command to send them a guild invitation, provided they meet the necessary conditions.

## SendListInventory
This method sends a vendor window to the player from a specified WorldObject. The WorldObject can be any object in the game world that has an inventory, such as a vendor NPC or a container object.

### Parameters
* sender: [WorldObject](./worldobject.md) - The WorldObject to send the vendor window from.

### Example Usage
Here's an example of how to use the `SendListInventory` method to create a custom vendor NPC that sells items based on the player's reputation with a specific faction:

```typescript
const FACTION_ENTRY = 1050; // Replace with the desired faction entry
const REPUTATION_LEVEL = 3; // Friendly

const VendorInteraction: gossip_event_on_hello = (event, player, object) => {
    if (player.GetReputationRank(FACTION_ENTRY) >= REPUTATION_LEVEL) {
        // Player has the required reputation, send the vendor window
        player.SendListInventory(object);
    } else {
        // Player doesn't have enough reputation
        player.SendBroadcastMessage("You need to be at least Friendly with our faction to access these goods.");
        player.GossipComplete();
    }
};

const VendorSelectOption: gossip_event_on_select = (event, player, object, sender, intid, code, menu_id) => {
    // Handle gossip select option
    if (intid == 1) {
        // Option 1: Send the vendor window
        player.SendListInventory(object);
    } else if (intid == 2) {
        // Option 2: Additional functionality
        player.SendBroadcastMessage("You selected option 2.");
        player.GossipComplete();
    }
};

const LoadVendor = () => {
    const vendorEntry = 123456; // Replace with the desired vendor NPC entry
    const vendorGossipId = 98765; // Replace with the desired gossip menu ID

    // Register gossip events for the vendor NPC
    RegisterGossipEvent(vendorEntry, GossipEvents.GOSSIP_EVENT_ON_HELLO, VendorInteraction);
    RegisterGossipEvent(vendorEntry, GossipEvents.GOSSIP_EVENT_ON_SELECT, VendorSelectOption);

    // Add gossip menu items to the vendor NPC
    GossipAddMenuItem(vendorGossipId, 0, GossipOptionIcon.GOSSIP_ICON_VENDOR, "Show me your goods.", 1);
    GossipAddMenuItem(vendorGossipId, 0, GossipOptionIcon.GOSSIP_ICON_CHAT, "Tell me more about your faction.", 2);

    // Bind the gossip menu to the vendor NPC
    BindGossipMenuToNPC(vendorGossipId, vendorEntry);
};

LoadVendor();
```

In this example:
1. We define the required faction entry and reputation level for accessing the vendor.
2. In the `VendorInteraction` event, we check if the player has the required reputation. If so, we send the vendor window using `SendListInventory`. Otherwise, we send a message indicating insufficient reputation and close the gossip window.
3. In the `VendorSelectOption` event, we handle the gossip select options. If the player selects option 1, we send the vendor window. If they select option 2, we perform additional functionality (in this case, sending a message).
4. In the `LoadVendor` function, we register the gossip events for the vendor NPC, add gossip menu items, and bind the gossip menu to the NPC.

This example demonstrates how to create a custom vendor NPC that conditionally sends the vendor window based on the player's reputation, while also providing additional gossip options for interaction.

## SendMovieStart
Starts a movie for the player based on the MovieId provided. Movies are pre-recorded in-game cinematics that can be used to enhance storytelling or provide visual information to the player.

### Parameters
* MovieId: number - The ID of the movie to start. You can find a list of available movie IDs in the `MovieIds` enum.

### Example Usage
This example demonstrates how to start a movie for a player when they reach a certain level and have completed a specific quest. The movie will only play once per character.

```typescript
const REQUIRED_LEVEL = 60;
const QUEST_ENTRY = 1234;
const MOVIE_ID = MovieIds.MOVIE_ID_ARTHAS_TURN;

const onLevelChanged: player_event_on_level_change = (event: number, player: Player, oldLevel: number): void => {
    if (oldLevel < REQUIRED_LEVEL && player.GetLevel() >= REQUIRED_LEVEL) {
        if (player.HasQuest(QUEST_ENTRY) && player.GetQuestStatus(QUEST_ENTRY) === QuestStatus.QUEST_STATUS_COMPLETE) {
            const hasSeenMovie = player.GetData<boolean>("HasSeenArthasMovie");
            if (!hasSeenMovie) {
                player.SendMovieStart(MOVIE_ID);
                player.SetData("HasSeenArthasMovie", true);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEVEL_CHANGE, (...args) => onLevelChanged(...args));
```

In this example:
1. We define constants for the required level, quest entry, and movie ID.
2. We register a player event listener for the `PLAYER_EVENT_ON_LEVEL_CHANGE` event.
3. When the player's level changes, we check if their new level is greater than or equal to the required level and if their old level was less than the required level.
4. We then check if the player has completed the specified quest using `HasQuest()` and `GetQuestStatus()`.
5. If the player meets the level and quest requirements, we check if they have already seen the movie by retrieving a custom data value using `GetData<boolean>("HasSeenArthasMovie")`.
6. If the player hasn't seen the movie yet, we start the movie using `SendMovieStart(MOVIE_ID)` and set the custom data value to `true` using `SetData("HasSeenArthasMovie", true)` to indicate that they have now seen the movie.

This ensures that the movie only plays once per character when they reach the required level and have completed the specified quest.

## SendNotification
Sends a notification message to the player's screen. This is useful for alerting the player of important information or events occurring. 

### Parameters
* message: string - The message to display to the player

### Example Usage:  
This example will send a notification to the player every time they kill a creature, with a special message if they have killed 50 creatures.
```typescript
let totalKills = 0;

const KillTracker: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    totalKills++;

    if (totalKills == 50) {
        player.SendNotification(`Congratulations! You have killed ${totalKills} creatures. You are quite the hunter!`);
    }
    else {
        player.SendNotification(`You have killed a ${creature.GetName()}. Total kills: ${totalKills}.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => KillTracker(...args));
```

In this example:
1. We initialize a variable `totalKills` to keep track of the number of creatures the player has killed.
2. We register a listener for the `PLAYER_EVENT_ON_KILL_CREATURE` event, which will trigger every time the player kills a creature.
3. In the event handler, we increment `totalKills`.
4. We then check if `totalKills` has reached 50. If so, we send a special congratulatory message to the player using `SendNotification`.
5. If `totalKills` is not 50, we send a notification to the player informing them of the creature they just killed and their total kill count so far.

This script provides the player with real-time feedback on their kills and offers a little extra recognition when they reach a milestone number of kills.

## SendPacket
Sends a [WorldPacket](./worldpacket.md) to the player's client. This method can be used to send various types of data and information to the player, such as system messages, spell visual effects, sound effects, and more.

### Parameters
* packet: [WorldPacket](./worldpacket.md) - The WorldPacket object to send to the player.
* selfOnly?: boolean - If set to 'true', the packet will only be sent to the player. If set to 'false' or omitted, the packet will be sent to the player and their surrounding players within visible range.

### Example Usage
Sending a custom message to the player with a visual effect and sound:
```typescript
const VISUAL_EFFECT_ENTRY = 123;
const SOUND_EFFECT_ENTRY = 456;

const SendCustomMessage = (player: Player, message: string) => {
    const packet = new WorldPacket(Opcodes.SMSG_MESSAGECHAT);
    packet.WriteUInt8(ChatMsg.CHAT_MSG_SYSTEM);
    packet.WriteUInt32(Language.LANG_UNIVERSAL);
    packet.WriteUInt64(0);
    packet.WriteUInt32(0);
    packet.WriteString(message);
    packet.WriteUInt8(0);
    player.SendPacket(packet);

    const visualPacket = new WorldPacket(Opcodes.SMSG_PLAY_SPELL_VISUAL);
    visualPacket.WriteUInt64(player.GetGUID());
    visualPacket.WriteUInt32(VISUAL_EFFECT_ENTRY);
    player.SendPacket(visualPacket, true);

    player.PlayDirectSound(SOUND_EFFECT_ENTRY);
};

const OnPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    SendCustomMessage(player, "Welcome to the server! Here's a special effect just for you.");
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnPlayerLogin(...args));
```

In this example, when a player logs in, the `SendCustomMessage` function is called. It creates a new `WorldPacket` with the `SMSG_MESSAGECHAT` opcode to send a system message to the player. The packet is populated with the necessary data, such as the message type, language, and the actual message content.

After sending the system message, another `WorldPacket` is created with the `SMSG_PLAY_SPELL_VISUAL` opcode to play a visual effect on the player. The player's GUID and the visual effect entry ID are written to the packet. The `selfOnly` parameter is set to 'true' to ensure that the visual effect is only visible to the player and not to surrounding players.

Finally, the `PlayDirectSound` method is called to play a sound effect for the player.

This example demonstrates how the `SendPacket` method can be used in combination with other methods and opcodes to create immersive experiences for players by sending custom messages, visual effects, and sound effects.

## SendQuestTemplate
This method sends a quest offer window to the player for the specified quest. The quest details are taken from the `quest_template` table in the world database.

### Parameters
* questId: number - The ID of the quest to offer, as found in the `quest_template` table.
* activateAccept?: boolean - Optional parameter. If set to true, the quest will be automatically accepted if the player is eligible. Defaults to false.

### Example Usage
This example shows how to offer a daily quest to a player when they login, and automatically accept it if they are eligible.

```typescript
const DAILY_QUEST_ID = 12345;

function OnLogin(event: PlayerEvents, player: Player) {
    // Check if the player is eligible for the daily quest
    if (player.CanCompleteQuest(DAILY_QUEST_ID)) {
        // Get the current server time
        const now = new Date();
        
        // Check if the quest has already been completed today
        const lastCompleted = player.GetQuestRewardStatus(DAILY_QUEST_ID);
        if (!lastCompleted || (now.getTime() - lastCompleted.getTime()) >= 86400000) {
            // Offer the quest and automatically accept it
            player.SendQuestTemplate(DAILY_QUEST_ID, true);
            
            // Inform the player that the quest has been accepted
            player.SendBroadcastMessage(`You have accepted the daily quest '${GetQuestTemplate(DAILY_QUEST_ID).LogTitle}'.`);
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example:
1. We define a constant `DAILY_QUEST_ID` to store the ID of the daily quest we want to offer.
2. We register a `PLAYER_EVENT_ON_LOGIN` event handler to run our logic when a player logs in.
3. We check if the player is eligible to complete the quest using `CanCompleteQuest()`.
4. If the player is eligible, we get the current server time using `new Date()`.
5. We check if the player has already completed the quest today by comparing the last completion time (if any) to the current time. If the quest hasn't been completed or it's been more than 24 hours (86400000 ms) since the last completion, we proceed.
6. We offer the quest to the player using `SendQuestTemplate()`, passing `true` as the second parameter to automatically accept the quest if the player is eligible.
7. Finally, we send a message to the player informing them that they have accepted the daily quest, using `SendBroadcastMessage()` and the quest's `LogTitle` from the `quest_template` table.

This example demonstrates how to use the `SendQuestTemplate()` method in a practical scenario, while also showcasing other related methods and techniques commonly used in quest scripting.

## SendShowBank
Sends a bank window to the player from a specified WorldObject. This is typically used to allow players to access their bank from NPCs, objects or other interactive game objects.

### Parameters
* sender: [WorldObject](./worldobject.md) - The WorldObject that is sending the bank window to the player.

### Example Usage
This example shows how to create an NPC that allows players to access their bank when interacting with it.

```typescript
const BANK_NPC_ENTRY = 1000;

// Create a gossip hello hook for the bank NPC
const BankNPCGossipHello: gossip_hello = (event: number, player: Player, object: WorldObject): boolean => {
    // Add a gossip item to open the bank
    player.GossipMenuAddItem(GossipIcon.Banker, "I would like to access my bank.", 0, 1);
    
    // Send the gossip menu to the player
    player.GossipSendMenu(0, object.GetGUID());
    
    return true;
};

// Create a gossip select hook for the bank NPC
const BankNPCGossipSelect: gossip_select = (event: number, player: Player, object: WorldObject, sender: number, action: number): boolean => {
    // Check if the player selected the bank gossip option
    if (action === 1) {
        // Close the gossip menu
        player.GossipComplete();
        
        // Send the bank window to the player
        player.SendShowBank(object);
    }
    
    return true;
};

// Register the gossip hooks for the bank NPC
RegisterCreatureGossipEvent(BANK_NPC_ENTRY, GOSSIP_EVENT_ON_HELLO, (...args) => BankNPCGossipHello(...args));
RegisterCreatureGossipEvent(BANK_NPC_ENTRY, GOSSIP_EVENT_ON_SELECT, (...args) => BankNPCGossipSelect(...args));
```

In this example, we create an NPC with the entry ID `BANK_NPC_ENTRY`. When a player interacts with this NPC, the `BankNPCGossipHello` function is called, which adds a gossip item to the menu allowing the player to access their bank.

When the player selects the bank gossip option, the `BankNPCGossipSelect` function is called. It checks if the selected action corresponds to the bank option (action === 1) and if so, it closes the gossip menu using `player.GossipComplete()` and sends the bank window to the player using `player.SendShowBank(object)`, passing the NPC object as the sender.

Finally, we register the gossip hooks for the bank NPC using `RegisterCreatureGossipEvent` for both the `GOSSIP_EVENT_ON_HELLO` and `GOSSIP_EVENT_ON_SELECT` events, associating them with their respective handler functions.

With this script, players can interact with the designated bank NPC to conveniently access their bank storage without having to visit a physical bank location in the game world.

## SendShowMailBox
Shows the mailbox window to the player. If a guid is provided, the mailbox window will be opened with that specific mailbox.

### Parameters
* guid (optional): number - The GUID of the mailbox to open. If not provided, the nearest mailbox will be used.

### Example Usage
This example demonstrates how to open the mailbox window for a player when they interact with a specific gameobject. In this case, a custom mailbox with a specific GUID.

```typescript
const CUSTOM_MAILBOX_GUID = 12345; // Replace with the GUID of your custom mailbox gameobject

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, object: GameObject) => {
    if (object.GetDBTableGUIDLow() === CUSTOM_MAILBOX_GUID) {
        // Show a custom gossip menu
        player.GossipMenuAddItem(0, "Open Mailbox", 0, 1);
        player.GossipSendMenu(0, object);
    }
};

const OnGossipSelect: player_event_on_gossip_select = (event: number, player: Player, object: GameObject, sender: number, action: number) => {
    if (object.GetDBTableGUIDLow() === CUSTOM_MAILBOX_GUID && action === 1) {
        // Open the mailbox window with the specific GUID
        player.SendShowMailBox(CUSTOM_MAILBOX_GUID);
        player.GossipComplete();
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example:
1. We define a constant `CUSTOM_MAILBOX_GUID` to store the GUID of our custom mailbox gameobject.
2. In the `OnGossipHello` event, we check if the interacted object has the same GUID as our custom mailbox.
   - If it matches, we add a gossip menu item "Open Mailbox" with an action ID of 1.
   - We send the gossip menu to the player.
3. In the `OnGossipSelect` event, we check if the selected object is our custom mailbox and if the action ID is 1.
   - If the conditions are met, we call `player.SendShowMailBox(CUSTOM_MAILBOX_GUID)` to open the mailbox window with the specific GUID.
   - We call `player.GossipComplete()` to close the gossip window.
4. Finally, we register the `OnGossipHello` and `OnGossipSelect` events to handle the player interactions.

This example showcases how to create a custom mailbox gameobject and open the mailbox window for the player when they interact with it using gossip menus.

## SendSpiritResurrect
This method will send a resurrect request to the player's spirit healer.  This is the same resurrect that a player can do from a spirit healer after dying.  This will not work if the player's body is still in the world.  The player must be at a graveyard as a ghost for this to function properly.

### Parameters
None

### Example Usage:
This script will allow a GM to cast a revive spell on a player's spirit to resurrect them as long as they are already at a graveyard in spirit form.

```typescript
const REVIVE_SPELL_ID = 99999;

const SpellCast = (event: any, caster: Unit, spellTarget: Unit, spellId: number): void => {
    if(spellId == REVIVE_SPELL_ID)
    {
        if(caster instanceof Player && spellTarget instanceof Player)
        {
            // Check if the player is casting the spell on theirself
            if(caster.GetGUID() !== spellTarget.GetGUID()) 
            {
                caster.SendBroadcastMessage("You can only cast this spell on yourself.")
                return;
            }
            
            // Check if player is alive
            if(spellTarget.IsAlive()) 
            {
                caster.SendBroadcastMessage("You can't resurrect yourself if you are still alive.");
                return;
            }
            
            // Check if player is in a graveyard
            if(!spellTarget.IsInGraveyard()) 
            {
                caster.SendBroadcastMessage("You must be at a graveyard in your spirit form to resurrect.");
                return;
            }

            spellTarget.SendSpiritResurrect();
            spellTarget.SendBroadcastMessage("You have been resurrected by the power of the Light!");
        }
    }
}

RegisterServerEvent(ServerEvents.CREATURE_EVENT_ON_SPELL_CAST, (...args) => SpellCast(...args));
```

In this example, we have created a custom spell that will allow a player to resurrect their spirit at a graveyard.  First, we check if the player is casting the spell on theirself as this spell should not work on other players.  Next, we make sure the player is not alive, as you cannot resurrect yourself while alive.  We then check to make sure the player is at a graveyard in spirit form.  If all the conditions are met, we call the SendSpiritResurrect() method to send the resurrect request to the player.  Finally, we send a message to the player to let them know they have been resurrected.

## SendTabardVendorActivate
This method sends a tabard vendor window to the player from the specified WorldObject. It allows players to interact with a tabard vendor and purchase tabards.

### Parameters
* sender: [WorldObject](./worldobject.md) - The WorldObject that represents the tabard vendor.

### Example Usage
In this example, we create a custom NPC that acts as a tabard vendor. When the player interacts with the NPC, it sends the tabard vendor window to the player.

```typescript
const TABARD_VENDOR_ENTRY = 1234; // Custom NPC entry ID

// Create a custom NPC
const CreateTabardVendor = (): void => {
    const vendorPosition = { x: 0, y: 0, z: 0, o: 0 }; // Set the desired position and orientation
    const vendorMap = 0; // Set the desired map ID

    const vendor = InstanceData.GetCreature(TABARD_VENDOR_ENTRY, vendorMap, vendorPosition);

    if (!vendor) {
        // Spawn the custom NPC if it doesn't exist
        vendor = InstanceData.AddCreature(TABARD_VENDOR_ENTRY, vendorMap, vendorPosition);

        if (vendor) {
            // Set the NPC flags to make it a gossip NPC
            vendor.SetFlag(UnitFlags.UNIT_NPC_FLAG_GOSSIP, 0);
        }
    }
};

// Called when the player talks to the tabard vendor NPC
const OnTabardVendorHello: vehicle_event_on_hello = (event: number, player: Player, vendor: Creature): void => {
    // Check if the NPC is the custom tabard vendor
    if (vendor.GetEntry() === TABARD_VENDOR_ENTRY) {
        // Send the tabard vendor window to the player
        player.SendTabardVendorActivate(vendor);
    }
};

// Register the events
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => CreateTabardVendor(...args));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => OnTabardVendorHello(...args));
```

In this script:
1. We define a custom NPC entry ID (`TABARD_VENDOR_ENTRY`) for the tabard vendor.
2. In the `CreateTabardVendor` function, we check if the custom NPC already exists. If it doesn't, we spawn the NPC at the desired position and map, and set the necessary NPC flags.
3. We register the `CreatureEvents.CREATURE_EVENT_ON_SPAWN` event to call the `CreateTabardVendor` function when the server starts up.
4. In the `OnTabardVendorHello` function, we check if the NPC that the player interacted with is the custom tabard vendor. If it is, we call the `SendTabardVendorActivate` method, passing the vendor object as the sender.
5. We register the `CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO` event to call the `OnTabardVendorHello` function when the player interacts with the tabard vendor NPC.

With this script, players can interact with the custom tabard vendor NPC, and the tabard vendor window will be sent to them, allowing them to purchase tabards.

## SendTaxiMenu
Sends a flightmaster window to the player from the specified creature. This allows the player to interact with the creature as if it were a flightmaster, opening up the taxi destination window.

### Parameters
* sender: [Creature](./creature.md) - The creature to send the taxi menu from, acting as a flightmaster

### Example Usage:
Create a custom flightmaster NPC that can send players to specific locations based on their level and reputation.
```typescript
const CUSTOM_FLIGHTMASTER_ENTRY = 1000000;
const STORMWIND_TAXI_NODE = 2;
const IRONFORGE_TAXI_NODE = 6;
const GNOMEREGAN_TAXI_NODE = 27;

const OnGossipHello: creature_event_on_gossip_hello = (event: number, creature: Creature, player: Player) => {
    if (creature.GetEntry() === CUSTOM_FLIGHTMASTER_ENTRY) {
        player.GossipMenuAddItem(0, "Fly to Stormwind", 1, 0);

        if (player.GetLevel() >= 20 && player.GetReputationRank(54) >= 4) { // Gnomeregan Exiles - Friendly
            player.GossipMenuAddItem(0, "Fly to Ironforge", 2, 0);
        }

        if (player.GetLevel() >= 30 && player.GetReputationRank(54) >= 6) { // Gnomeregan Exiles - Honored
            player.GossipMenuAddItem(0, "Fly to Gnomeregan", 3, 0);
        }

        player.GossipSendMenu(1, creature.GetGUID());
    }
};

const OnGossipSelect: creature_event_on_gossip_select = (event: number, creature: Creature, player: Player, sender: any, action: number) => {
    if (creature.GetEntry() === CUSTOM_FLIGHTMASTER_ENTRY) {
        player.GossipComplete();

        switch (action) {
            case 1:
                player.SendTaxiMenu(creature);
                player.ActivateTaxiPathTo(STORMWIND_TAXI_NODE);
                break;
            case 2:
                player.SendTaxiMenu(creature);
                player.ActivateTaxiPathTo(IRONFORGE_TAXI_NODE);
                break;
            case 3:
                player.SendTaxiMenu(creature);
                player.ActivateTaxiPathTo(GNOMEREGAN_TAXI_NODE);
                break;
        }
    }
};

RegisterCreatureEvent(CUSTOM_FLIGHTMASTER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, OnGossipHello);
RegisterCreatureEvent(CUSTOM_FLIGHTMASTER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, OnGossipSelect);
```
In this example, we create a custom flightmaster NPC that opens a gossip menu with different flight options based on the player's level and reputation with the Gnomeregan Exiles faction. When the player selects an option, the `SendTaxiMenu` method is called to open the flightmaster window, and then the player is sent to the corresponding taxi node using `ActivateTaxiPathTo`.

## SendTrainerList
This method sends a trainer window to the player from the specified creature. The trainer window allows the player to browse and learn new spells and abilities from the creature trainer.

### Parameters
* sender: [Creature](./creature.md) - The creature that will act as the trainer and send the trainer window to the player.

### Example Usage
In this example, when a player interacts with a creature (e.g., clicks on it), the script checks if the creature's entry matches a specific trainer entry. If it does, the creature sends the trainer window to the player, allowing them to browse and learn new spells and abilities.

```typescript
const TRAINER_ENTRY = 123; // Replace with the desired trainer entry ID

const onGossipHello: player_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === TRAINER_ENTRY) {
        creature.SendTrainerList(player);
        return;
    }

    // Other gossip handling logic for non-trainer creatures
    // ...

    player.GossipComplete();
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => onGossipHello(...args));
```

In this script:
1. We define a constant `TRAINER_ENTRY` to store the entry ID of the desired trainer creature.
2. We register a player event handler for the `PLAYER_EVENT_ON_GOSSIP_HELLO` event using `RegisterPlayerEvent`.
3. Inside the event handler, we check if the interacted creature's entry matches the `TRAINER_ENTRY`.
4. If it matches, we call `creature.SendTrainerList(player)` to send the trainer window to the player.
5. If the creature is not a trainer, we can handle other gossip-related logic or simply call `player.GossipComplete()` to close the gossip window.

By using this script, when a player interacts with a creature that matches the specified trainer entry, the creature will send the trainer window to the player, allowing them to learn new spells and abilities.

Note: Make sure to replace `TRAINER_ENTRY` with the actual entry ID of the trainer creature you want to use in your script.

## SetAcceptWhispers
This method allows you to set whether the player accepts whispers from other players or not. If set to false, the player will not receive whispers from other players.

### Parameters
* acceptWhispers: boolean (optional) - Set to true to allow the player to receive whispers, false to block whispers. If no value is provided, it will toggle the current setting.

### Example Usage
This example demonstrates how to toggle the acceptance of whispers for a player based on their level:

```typescript
const CONFIG_WHISPER_LEVEL_THRESHOLD = 10;

const onLogin: player_event_on_login = (event: number, player: Player) => {
    const playerLevel = player.GetLevel();

    if (playerLevel < CONFIG_WHISPER_LEVEL_THRESHOLD) {
        // Disable whispers for players below the level threshold
        player.SetAcceptWhispers(false);
        player.SendBroadcastMessage(`You are currently not accepting whispers until you reach level ${CONFIG_WHISPER_LEVEL_THRESHOLD}.`);
    } else {
        // Enable whispers for players at or above the level threshold
        player.SetAcceptWhispers(true);
        player.SendBroadcastMessage("You are now accepting whispers from other players.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onLogin(...args));
```

In this example:
1. We define a constant `CONFIG_WHISPER_LEVEL_THRESHOLD` to set the minimum level required for a player to accept whispers.
2. We register the `PLAYER_EVENT_ON_LOGIN` event to execute the `onLogin` function whenever a player logs in.
3. Inside the `onLogin` function, we retrieve the player's level using `player.GetLevel()`.
4. We check if the player's level is below the `CONFIG_WHISPER_LEVEL_THRESHOLD`.
   - If the level is below the threshold, we disable whispers for the player using `player.SetAcceptWhispers(false)` and send them a broadcast message informing them about the level requirement.
   - If the level is at or above the threshold, we enable whispers for the player using `player.SetAcceptWhispers(true)` and send them a broadcast message indicating that they are now accepting whispers.

This script ensures that players below a certain level threshold do not receive whispers, while players at or above the threshold can receive whispers from other players. The acceptance of whispers is automatically toggled based on the player's level when they log in.

## SetAchievement
This method allows you to grant an achievement to a player by using the achievement ID. Achievements can be found in the `achievement_reward` table in the world database. For more information about achievements, you can refer to the AzerothCore wiki: https://www.azerothcore.org/wiki/achievement_reward

### Parameters
* achievementId: number - The ID of the achievement to grant to the player.

### Example Usage
In this example, we will grant the player the "Jenkins" achievement (ID: 1038) when they kill a specific creature.

```typescript
const JENKINS_ACHIEVEMENT_ID = 1038;
const LEROY_JENKINS_CREATURE_ID = 123456;

const onCreatureKill: creature_event_on_killed = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === LEROY_JENKINS_CREATURE_ID && killer.IsPlayer()) {
        const player = killer.ToPlayer();
        if (!player.HasAchieved(JENKINS_ACHIEVEMENT_ID)) {
            player.SetAchievement(JENKINS_ACHIEVEMENT_ID);
            player.SendBroadcastMessage("You have earned the 'Jenkins' achievement!");
        }
    }
};

RegisterCreatureEvent(LEROY_JENKINS_CREATURE_ID, CreatureEvents.CREATURE_EVENT_ON_KILLED, (...args) => onCreatureKill(...args));
```

In this script:
1. We define constants for the "Jenkins" achievement ID and the creature ID for "Leroy Jenkins".
2. We register a creature event handler for the `CREATURE_EVENT_ON_KILLED` event.
3. When a creature is killed, we check if the killed creature is "Leroy Jenkins" and if the killer is a player.
4. If the conditions are met, we convert the `killer` object to a `Player` object using `ToPlayer()`.
5. We check if the player has already earned the "Jenkins" achievement using `HasAchieved()`.
6. If the player hasn't earned the achievement yet, we grant it to them using `SetAchievement()`.
7. Finally, we send a broadcast message to the player informing them that they have earned the achievement.

This script demonstrates how to grant an achievement to a player based on a specific condition, such as killing a particular creature. You can adapt this script to grant achievements based on various other conditions or criteria.

## SetArenaPoints
Sets the player's Arena Points to the specified amount. Arena Points are used as a currency to purchase items from Arena Vendors. This method allows you to directly set the player's Arena Points to a desired value.

### Parameters
* arenaPoints: number - The amount of Arena Points to set for the player.

### Example Usage
Here's an example of how to use the `SetArenaPoints` method to reward players with Arena Points based on their performance in a custom arena event:

```typescript
const ARENA_EVENT_ID = 1;
const ARENA_POINTS_REWARD = 100;

const onArenaFinish: player_event_on_arena_finish = (event: number, player: Player, arenaType: number, isWinner: boolean) => {
    if (arenaType === ARENA_EVENT_ID) {
        if (isWinner) {
            const currentArenaPoints = player.GetArenaPoints();
            const newArenaPoints = currentArenaPoints + ARENA_POINTS_REWARD;
            player.SetArenaPoints(newArenaPoints);
            player.SendBroadcastMessage(`Congratulations! You have been awarded ${ARENA_POINTS_REWARD} Arena Points for winning the event.`);
        } else {
            player.SendBroadcastMessage("Better luck next time! Keep practicing to earn Arena Points.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ARENA_FINISH, (...args) => onArenaFinish(...args));
```

In this example:
1. We define constants for the custom arena event ID (`ARENA_EVENT_ID`) and the amount of Arena Points to reward (`ARENA_POINTS_REWARD`).
2. We register a player event handler for the `PLAYER_EVENT_ON_ARENA_FINISH` event using `RegisterPlayerEvent`.
3. Inside the event handler, we check if the arena type matches our custom arena event ID.
4. If the player is the winner (`isWinner` is true), we retrieve their current Arena Points using `GetArenaPoints()`.
5. We calculate the new Arena Points by adding the reward amount to the current points.
6. We use the `SetArenaPoints` method to set the player's Arena Points to the new value.
7. We send a broadcast message to the player informing them about the Arena Points reward.
8. If the player is not the winner, we send a different message encouraging them to keep practicing.

This example demonstrates how you can use the `SetArenaPoints` method in combination with other player events and methods to create a custom arena event that rewards players with Arena Points based on their performance.

Note: Make sure to replace `ARENA_EVENT_ID` and `ARENA_POINTS_REWARD` with appropriate values based on your specific arena event and reward system.

## SetAtLoginFlag
Sets a flag on the player that triggers an action upon their next login. These flags can be used to grant items, run scripts, or perform other actions when the player logs in.

### Parameters
* flag: number - The login flag to set on the player. The available flags are:
  * 0 - None 
  * 1 - Change Race
  * 2 - Rename
  * 3 - Customize (Paid name change, appearance change, or race change)
  * 4 - Reset Spells
  * 5 - Reset Talents
  * 6 - Restore Delete
  * 16 - Refer-A-Friend

### Example Usage
This example listens for the `PLAYER_EVENT_ON_KILL` event and checks if the victim is a rare spawn. If so, it sets a login flag on the player to grant them a special item the next time they log in.

```typescript
const RARE_SPAWN_ENTRY = 123456;
const SPECIAL_ITEM_ENTRY = 654321;

const OnPlayerKill: player_event_on_kill = (event: number, player: Player, victim: Unit) => {
    if (victim.GetEntry() == RARE_SPAWN_ENTRY) {
        let hasItem = false;
        for (let i = 0; i < player.GetItemCount(); i++) {
            let item = player.GetItemByPos(255, i);
            if (item && item.GetEntry() == SPECIAL_ITEM_ENTRY) {
                hasItem = true;
                break;
            }
        }

        if (!hasItem) {
            player.SetAtLoginFlag(1);
            ChatHandler.SendMessageToPlayer(player, "You have been granted a special item for slaying the rare spawn. It will be in your mailbox the next time you log in.");
        }
    }
}

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.HasAtLoginFlag(1)) {
        player.RemoveAtLoginFlag(1);
        MailDraft("Rare Spawn Reward", "Congratulations on slaying the rare spawn! Please accept this special item as a reward.")
            .AddItem(SPECIAL_ITEM_ENTRY)
            .SendMailTo(player, MailStationery.MAIL_STATIONERY_GM);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL, (...args) => OnPlayerKill(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, when a player kills the specified rare spawn, it checks if they already have the special item. If not, it sets the login flag `1` on the player. 

Then, when the player logs in, it checks if they have the login flag `1` set. If so, it removes the flag and sends them the special item via in-game mail.

This showcases how login flags can be used to trigger actions across play sessions, such as granting rewards for accomplishments in the previous session.

## SetBindPoint
Sets the player's home location to the specified coordinates, map, and area. This is the location where the player will respawn after death.

### Parameters
* x: number - The X coordinate of the bind location
* y: number - The Y coordinate of the bind location
* z: number - The Z coordinate of the bind location
* mapId: number - The map ID of the bind location
* areaId: number - The area ID of the bind location

### Example Usage
Set the player's bind point to a custom location based on their class:
```typescript
const CLASS_BIND_LOCATIONS = {
    [Classes.CLASS_WARRIOR]: { x: -8799.14, y: 328.206, z: 102.673, mapId: 0, areaId: 1519 },
    [Classes.CLASS_PALADIN]: { x: -8519.64, y: 852.499, z: 109.61, mapId: 0, areaId: 1537 },
    [Classes.CLASS_HUNTER]: { x: -5062.26, y: -1261.89, z: 510.475, mapId: 1, areaId: 400 },
    [Classes.CLASS_ROGUE]: { x: -8753.11, y: 367.625, z: 101.056, mapId: 0, areaId: 1519 },
    [Classes.CLASS_PRIEST]: { x: -8517.21, y: 848.877, z: 109.61, mapId: 0, areaId: 1537 },
    [Classes.CLASS_DEATH_KNIGHT]: { x: 2280.12, y: -5275.32, z: 82.1443, mapId: 609, areaId: 4298 },
    [Classes.CLASS_SHAMAN]: { x: -2916.61, y: -257.138, z: 53.0241, mapId: 1, areaId: 406 },
    [Classes.CLASS_MAGE]: { x: -9018.52, y: 874.28, z: 129.682, mapId: 0, areaId: 1519 },
    [Classes.CLASS_WARLOCK]: { x: -8960.51, y: 1027.67, z: 101.302, mapId: 0, areaId: 1519 },
    [Classes.CLASS_DRUID]: { x: 7865.78, y: -2493.64, z: 487.838, mapId: 1, areaId: 493 }
};

const OnFirstLogin: player_event_on_first_login = (event: number, player: Player) => {
    const classBindLocation = CLASS_BIND_LOCATIONS[player.GetClass()];
    
    if (classBindLocation) {
        const { x, y, z, mapId, areaId } = classBindLocation;
        player.SetBindPoint(x, y, z, mapId, areaId);
        player.SendBroadcastMessage(`Your home location has been set to the ${player.GetClassAsString()} bind point.`);
    } else {
        player.SendBroadcastMessage("No class-specific bind point found. Using default bind location.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_FIRST_LOGIN, (...args) => OnFirstLogin(...args));
```

In this example, we define a `CLASS_BIND_LOCATIONS` object that maps each class to a specific bind location. When a player logs in for the first time, we retrieve their class using `player.GetClass()` and check if a corresponding bind location exists in the `CLASS_BIND_LOCATIONS` object.

If a class-specific bind location is found, we extract the coordinates, map ID, and area ID from the object and pass them to `player.SetBindPoint()` to set the player's home location. We also send a broadcast message to the player informing them that their home location has been set to the class-specific bind point.

If no class-specific bind location is found, we send a message to the player indicating that the default bind location will be used.

By using this script, players of different classes will have their bind points automatically set to predefined locations based on their class when they log in for the first time.

## SetCoinage
This method sets the player's total amount of money to the specified amount in copper. The amount can be a combination of gold, silver, and copper, but the method takes the total amount in copper as the argument.

### Parameters
* copperAmt: number - The total amount of money in copper to set for the player.

### Example Usage
In this example, we will create a script that rewards players with a specific amount of money based on their level when they complete a particular quest. The reward amount will be calculated based on the player's level and the base reward amount.

```typescript
const QUEST_ENTRY = 1234; // Replace with the actual quest entry ID
const BASE_REWARD_COPPER = 10000; // 1 gold

const QuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number) => {
    if (quest === QUEST_ENTRY) {
        const playerLevel = player.GetLevel();
        const rewardMultiplier = playerLevel * 0.5; // Adjust the multiplier as needed
        const totalReward = BASE_REWARD_COPPER * rewardMultiplier;

        const currentCoinage = player.GetCoinage();
        const newCoinage = currentCoinage + totalReward;

        player.SetCoinage(newCoinage);

        player.SendBroadcastMessage(`You have been rewarded with ${totalReward / 100} silver for completing the quest at level ${playerLevel}!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => QuestComplete(...args));
```

In this script:
1. We define the `QUEST_ENTRY` constant with the entry ID of the quest we want to track and the `BASE_REWARD_COPPER` constant with the base reward amount in copper (1 gold = 10000 copper).

2. We create a function called `QuestComplete` that will be triggered when a player completes a quest.

3. Inside the function, we check if the completed quest's entry ID matches the `QUEST_ENTRY` we are interested in.

4. If there is a match, we calculate the reward amount based on the player's level. In this example, we multiply the player's level by a reward multiplier (0.5) and then multiply the result by the base reward amount. Adjust the multiplier as needed to balance the rewards.

5. We retrieve the player's current coinage using `player.GetCoinage()` and add the calculated reward amount to it to determine the new coinage.

6. We use `player.SetCoinage(newCoinage)` to set the player's money to the new coinage amount.

7. Finally, we send a broadcast message to the player, informing them about the reward they received for completing the quest at their current level.

8. We register the `QuestComplete` function to be triggered whenever a player completes a quest using `RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => QuestComplete(...args))`.

This script demonstrates how to use the `SetCoinage` method to modify a player's money based on quest completion and their level, providing a more dynamic and level-based reward system.

## SetDrunkValue
Set the player's intoxication level to a specific value. The drunk value is used to determine the visual effects and behavior changes associated with being intoxicated in the game.

### Parameters
* drunkValue: number - The desired intoxication level for the player. Valid range is from 0 to 100.

### Example Usage
This example demonstrates how to create a custom item that, when used by the player, will set their intoxication level based on the item's quality.

```typescript
const ITEM_ENTRY = 123456;

const ItemUse: player_event_on_item_use = (event: number, player: Player, item: Item, target: GameObject | Item | Player | Unit) => {
    if (item.GetEntry() === ITEM_ENTRY) {
        let quality = item.GetQuality();
        let drunkValue = 0;

        switch (quality) {
            case 0: // Poor
                drunkValue = 10;
                break;
            case 1: // Common
                drunkValue = 30;
                break;
            case 2: // Uncommon
                drunkValue = 50;
                break;
            case 3: // Rare
                drunkValue = 70;
                break;
            case 4: // Epic
                drunkValue = 90;
                break;
            case 5: // Legendary
                drunkValue = 100;
                break;
        }

        player.SetDrunkValue(drunkValue);
        player.SendBroadcastMessage(`You consume the ${item.GetName()} and feel your intoxication level rise.`);

        if (drunkValue >= 50) {
            player.CastSpell(player, 32959, true); // Cast the "Intoxicated" visual effect on the player
        }

        player.DestroyItemCount(ITEM_ENTRY, 1, true); // Remove one item from the player's inventory
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ITEM_USE, (...args) => ItemUse(...args));
```

In this example:
1. We define a custom item entry (`ITEM_ENTRY`) that will trigger the script when used by the player.
2. In the `ItemUse` event handler, we check if the used item matches our custom item entry.
3. We determine the drunk value based on the item's quality, with higher quality items resulting in higher intoxication levels.
4. We set the player's intoxication level using `player.SetDrunkValue(drunkValue)`.
5. We send a broadcast message to the player, informing them about the effect of consuming the item.
6. If the drunk value is greater than or equal to 50, we cast the "Intoxicated" visual effect on the player using `player.CastSpell()`.
7. Finally, we remove one instance of the custom item from the player's inventory using `player.DestroyItemCount()`.

This script showcases how the `SetDrunkValue` method can be used in combination with other player methods and game events to create a custom item with intoxication effects.

## SetFFA
This method allows you to toggle the FFA (Free-for-All) flag for a player. When the FFA flag is enabled, the player can attack and be attacked by other players regardless of their faction or party status. This is commonly used in custom PvP scenarios or events.

### Parameters
* applyFFA (optional): boolean - Determines whether to apply or remove the FFA flag. If set to 'true', the FFA flag will be enabled. If set to 'false', the FFA flag will be disabled. If not provided, the default value is 'true'.

### Example Usage:
Create a custom PvP event where players can toggle their FFA status.
```typescript
const FFA_ZONE_ID = 1234; // Replace with the desired zone ID

const OnEnterWorld: player_event_on_enter_world = (event: number, player: Player) => {
    // Check if the player is in the designated FFA zone
    if (player.GetZoneId() === FFA_ZONE_ID) {
        // Enable FFA for the player
        player.SetFFA(true);
        player.SendBroadcastMessage("You have entered the FFA zone. Be prepared for combat!");
    }
};

const OnUpdateZone: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number) => {
    // Check if the player is leaving the FFA zone
    if (player.GetZoneId() !== FFA_ZONE_ID && player.HasFlag(PlayerFlags.FREE_FOR_ALL_PVP)) {
        // Disable FFA for the player
        player.SetFFA(false);
        player.SendBroadcastMessage("You have left the FFA zone. PvP restrictions are now in effect.");
    }
};

const OnChat: player_event_on_chat = (event: number, player: Player, msg: string, type: number, lang: number) => {
    // Check if the player types the command to toggle FFA
    if (msg === "!ffa") {
        // Toggle the player's FFA status
        const isFFA = player.HasFlag(PlayerFlags.FREE_FOR_ALL_PVP);
        player.SetFFA(!isFFA);

        if (!isFFA) {
            player.SendBroadcastMessage("FFA mode enabled. You can now attack and be attacked by other players!");
        } else {
            player.SendBroadcastMessage("FFA mode disabled. PvP restrictions are now in effect.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_WORLD, (...args) => OnEnterWorld(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => OnUpdateZone(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => OnChat(...args));
```
In this example:
1. When a player enters the designated FFA zone (identified by `FFA_ZONE_ID`), their FFA flag is automatically enabled using `player.SetFFA(true)`. They receive a message indicating that they have entered the FFA zone.
2. When a player leaves the FFA zone, their FFA flag is automatically disabled using `player.SetFFA(false)`. They receive a message indicating that they have left the FFA zone and PvP restrictions are back in effect.
3. Players can manually toggle their FFA status by typing the command "!ffa" in the chat. The script checks for this command in the `OnChat` event and toggles the player's FFA flag accordingly using `player.SetFFA(!isFFA)`. The player receives a message confirming the change in their FFA status.

This script provides a dynamic FFA system where players can engage in unrestricted PvP combat within designated zones or by manually toggling their FFA status.

## SetFactionForRace
Sets the player's faction standing to match that of the specified race. This can be useful for changing a player's faction standing to match a different race, such as changing a Blood Elf to have the same faction standing as an Orc.

### Parameters
* raceId: number - The ID of the race to set the faction standing to. You can find race IDs in the DBC files or in the [TC/AC Wiki - Races](https://www.azerothcore.org/wiki/race).

### Example Usage
Change a player's faction standing to match a different race when they equip a specific item.
```typescript
const RACE_BLOODELF = 10;
const RACE_ORC = 2;
const ITEM_ENTRY_FACTION_CHANGER = 123456;

const OnEquipItem: player_event_on_equip_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() === ITEM_ENTRY_FACTION_CHANGER) {
        if (player.GetRace() === RACE_BLOODELF) {
            player.SetFactionForRace(RACE_ORC);
            player.SendBroadcastMessage("Your faction standing has been changed to match that of an Orc!");
        } else {
            player.SendBroadcastMessage("This item can only be used by Blood Elves.");
            player.RemoveItem(item.GetEntry(), 1);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP_ITEM, (...args) => OnEquipItem(...args));
```

In this example, when a player equips an item with the entry `ITEM_ENTRY_FACTION_CHANGER`, the script checks if the player is a Blood Elf. If they are, it changes their faction standing to match that of an Orc using `SetFactionForRace(RACE_ORC)` and sends them a message indicating the change. If the player is not a Blood Elf, it sends them a message saying the item can only be used by Blood Elves and removes the item from their inventory.

This script showcases how `SetFactionForRace` can be used in combination with other player methods and events to create interesting gameplay mechanics and interactions based on a player's race and faction standing.

## SetFreeTalentPoints
This method sets the player's free talent points to the specified amount for their current talent specialization. This allows the player to reallocate their talent points and customize their character build.

### Parameters
* talentPointAmt: number - The number of free talent points to set for the player's current specialization.

### Example Usage
In this example, we create a script that rewards players with bonus talent points based on their level when they complete a specific quest. The script listens for the `PLAYER_EVENT_ON_QUEST_COMPLETE` event and checks if the completed quest ID matches the desired quest. If the player's level is above a certain threshold, they are granted additional talent points using the `SetFreeTalentPoints` method.

```typescript
const QUEST_ID = 12345; // Replace with the desired quest ID
const LEVEL_THRESHOLD = 60; // Minimum level required for bonus talent points
const BONUS_TALENT_POINTS = 5; // Number of bonus talent points to grant

const onQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: Quest) => {
    if (quest.GetId() === QUEST_ID) {
        const playerLevel = player.GetLevel();
        if (playerLevel >= LEVEL_THRESHOLD) {
            const currentTalentPoints = player.GetFreeTalentPoints();
            const newTalentPoints = currentTalentPoints + BONUS_TALENT_POINTS;
            player.SetFreeTalentPoints(newTalentPoints);
            player.SendBroadcastMessage(`You have been granted ${BONUS_TALENT_POINTS} bonus talent points for completing the quest at level ${playerLevel}!`);
        } else {
            player.SendBroadcastMessage(`Complete the quest at level ${LEVEL_THRESHOLD} or higher to receive bonus talent points.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => onQuestComplete(...args));
```

In this script:
1. We define constants for the quest ID (`QUEST_ID`), the minimum level required for bonus talent points (`LEVEL_THRESHOLD`), and the number of bonus talent points to grant (`BONUS_TALENT_POINTS`).
2. We register the `onQuestComplete` function to handle the `PLAYER_EVENT_ON_QUEST_COMPLETE` event.
3. When a player completes a quest, the `onQuestComplete` function is triggered.
4. We check if the completed quest ID matches the desired quest ID (`QUEST_ID`).
5. If the quest ID matches, we check if the player's level is greater than or equal to the `LEVEL_THRESHOLD`.
6. If the player meets the level requirement, we retrieve their current free talent points using `GetFreeTalentPoints()`.
7. We calculate the new number of talent points by adding the `BONUS_TALENT_POINTS` to the current talent points.
8. We set the player's free talent points to the new value using `SetFreeTalentPoints(newTalentPoints)`.
9. We send a broadcast message to the player informing them about the bonus talent points they received.
10. If the player does not meet the level requirement, we send a broadcast message informing them about the level requirement to receive bonus talent points.

This script demonstrates how the `SetFreeTalentPoints` method can be used to dynamically adjust a player's talent points based on certain conditions or achievements, such as completing a specific quest at a certain level.

## SetGMChat
Toggle the visibility of the GM tag for the player. When enabled, the player's chat messages will have the "Blizz" tag prepended to them, indicating they are a GM. This is useful for identifying GM characters from normal players.

### Parameters
* on?: boolean - Optional parameter to enable or disable GM chat tag. If not provided, the state will be toggled.

### Example Usage
This example demonstrates how to enable or disable the GM chat tag based on the player's GM rank. It assumes there is a custom GMRank command that allows changing the player's GM rank.

```typescript
const GMRankCommand: player_event_on_command = (event: number, player: Player, command: string, args: string[]) => {
    const rank = parseInt(args[0]);

    if (isNaN(rank) || rank < 0 || rank > 3) {
        player.SendBroadcastMessage("Invalid GM rank. Usage: .gmrank <0-3>");
        return;
    }

    player.SetGMRank(rank);

    if (rank > 0) {
        player.SetGMChat(true);
        player.SendBroadcastMessage(`GM chat tag enabled. Your rank is now ${rank}.`);
    } else {
        player.SetGMChat(false);
        player.SendBroadcastMessage("GM chat tag disabled. You are now a normal player.");
    }

    player.SaveToDB();
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => GMRankCommand(...args), "gmrank");
```

In this example:
1. The script listens for the "gmrank" command using the `PLAYER_EVENT_ON_COMMAND` event.
2. It extracts the rank argument from the command and validates it. If the rank is invalid, an error message is sent to the player.
3. If the rank is valid, it sets the player's GM rank using `player.SetGMRank(rank)`.
4. If the rank is greater than 0, it enables the GM chat tag using `player.SetGMChat(true)` and sends a confirmation message to the player.
5. If the rank is 0, it disables the GM chat tag using `player.SetGMChat(false)` and sends a message to the player indicating they are now a normal player.
6. Finally, it saves the player's changes to the database using `player.SaveToDB()`.

This script allows GMs to easily toggle their GM chat tag based on their assigned rank, providing clear identification in chat channels.

## SetGMVisible
Toggles the visibility of the player to other players and creatures in the world. When GM visibility is off, the player will be invisible to other players and creatures, unless they are in the same group or raid. 

### Parameters
gmVisible?: boolean - (Optional) Sets the player's visibility on or off. If not provided, it will toggle the current state.
- `true`: The player becomes visible to other players and creatures.
- `false`: The player becomes invisible to other players and creatures.

### Example Usage
Here's an example of how to use the `SetGMVisible` method to create a simple GM invisibility toggle command:

```typescript
// GM command to toggle invisibility
const GMInvisibilityCommand: player_event_on_command = (event: number, player: Player, command: string) => {
    if (command === "gminvis") {
        if (!player.IsGM()) {
            player.SendBroadcastMessage("You do not have permission to use this command.");
            return;
        }

        player.SetGMVisible(!player.IsGMVisible());

        if (player.IsGMVisible()) {
            player.SendBroadcastMessage("GM invisibility disabled. You are now visible to other players.");
        } else {
            player.SendBroadcastMessage("GM invisibility enabled. You are now invisible to other players.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => GMInvisibilityCommand(...args));
```

In this example, we create a custom GM command "gminvis" that toggles the player's GM visibility when executed. Here's how it works:

1. We check if the command entered by the player is "gminvis".
2. We verify if the player has GM permissions using the `IsGM()` method. If not, we send an error message and return.
3. We call the `SetGMVisible` method, passing the opposite of the player's current visibility state using `!player.IsGMVisible()`. This toggles the visibility.
4. Depending on the new visibility state, we send a corresponding message to the player using `SendBroadcastMessage` to confirm the action.

With this script, when a GM player types the command "gminvis", their visibility will be toggled on or off, and they will receive a message indicating the current state of their invisibility.

Note: Make sure to grant the appropriate GM permissions to the desired player accounts for this command to work as intended.

## SetGameMaster
This method allows you to toggle the player's GM mode on or off. When a player is in GM mode, they have access to special commands and abilities that are not available to regular players. This can be useful for testing and debugging purposes, or for administering the game.

### Parameters
* setGmMode: boolean (optional) - If set to true, the player will be put into GM mode. If set to false, the player will be taken out of GM mode. If not specified, the player's GM mode will be toggled (if currently in GM mode, it will be turned off, and vice versa).

### Example Usage
Here's an example of how you might use the SetGameMaster method in a script:

```typescript
const OnPlayerChat: player_event_on_chat = (event: number, player: Player, msg: string, Type: number, lang: Language): void => {
    if (msg === '!gm') {
        if (player.GetGMRank() >= 3) { // Check if the player has a GM rank of 3 or higher
            player.SetGameMaster(); // Toggle the player's GM mode
            if (player.IsGameMaster()) {
                player.SendBroadcastMessage('You are now a Game Master.');
                player.LearnSpell(27683); // Teach the player the "GM" spell
                player.LearnSpell(1908); // Teach the player the "Uber Heal Over Time" spell
                player.SetMaxHealth(player.GetMaxHealth() * 10); // Increase the player's max health by 10 times
                player.SetMaxPower(player.GetPowerType(), player.GetMaxPower(player.GetPowerType()) * 10); // Increase the player's max power by 10 times
            } else {
                player.SendBroadcastMessage('You are no longer a Game Master.');
                player.RemoveSpell(27683); // Remove the "GM" spell from the player
                player.RemoveSpell(1908); // Remove the "Uber Heal Over Time" spell from the player
                player.SetMaxHealth(player.GetMaxHealth() / 10); // Reduce the player's max health back to normal
                player.SetMaxPower(player.GetPowerType(), player.GetMaxPower(player.GetPowerType()) / 10); // Reduce the player's max power back to normal
            }
        } else {
            player.SendBroadcastMessage('You do not have permission to use this command.');
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => OnPlayerChat(...args));
```

In this example, when a player types '!gm' in the chat, the script checks if the player has a GM rank of 3 or higher. If they do, it toggles their GM mode using the SetGameMaster method. If the player is put into GM mode, the script teaches them the "GM" and "Uber Heal Over Time" spells, and increases their max health and power by 10 times. If the player is taken out of GM mode, the script removes the spells and reduces their max health and power back to normal. If the player does not have a GM rank of 3 or higher, they are sent a message telling them they do not have permission to use the command.

## SetGender
This method sets the gender of the player. The gender can be either male or female, represented by the following constants:
- GENDER_MALE = 0
- GENDER_FEMALE = 1

### Parameters
- gender: number - The gender to set for the player. It should be either GENDER_MALE or GENDER_FEMALE.

### Example Usage
This example demonstrates how to create a command that allows players to change their gender based on their input.

```typescript
// Constants for gender
const GENDER_MALE = 0;
const GENDER_FEMALE = 1;

// Function to handle the gender change command
function handleGenderChangeCommand(player: Player, args: string[]): boolean {
    if (args.length === 0) {
        player.SendBroadcastMessage("Usage: .changegender [male|female]");
        return false;
    }

    const genderInput = args[0].toLowerCase();
    let gender: number;

    if (genderInput === "male") {
        gender = GENDER_MALE;
    } else if (genderInput === "female") {
        gender = GENDER_FEMALE;
    } else {
        player.SendBroadcastMessage("Invalid gender. Please specify either 'male' or 'female'.");
        return false;
    }

    player.SetGender(gender);
    player.SendBroadcastMessage(`Your gender has been changed to ${genderInput}.`);
    return true;
}

// Register the gender change command
RegisterPlayerCommand("changegender", "Allows you to change your character's gender.", handleGenderChangeCommand);
```

In this example:
1. We define constants `GENDER_MALE` and `GENDER_FEMALE` to represent the gender values.
2. We create a function `handleGenderChangeCommand` that takes the player and command arguments as parameters.
3. We check if the player provided a gender argument. If not, we send a usage message and return `false` to indicate an invalid command.
4. We convert the gender input to lowercase for case-insensitive comparison.
5. Based on the gender input, we set the `gender` variable to either `GENDER_MALE` or `GENDER_FEMALE`. If an invalid gender is provided, we send an error message and return `false`.
6. We call `player.SetGender(gender)` to set the player's gender to the specified value.
7. We send a confirmation message to the player indicating that their gender has been changed.
8. Finally, we register the "changegender" command with the `RegisterPlayerCommand` function, providing a description and the `handleGenderChangeCommand` function as the command handler.

This example showcases how to create a custom command that allows players to change their gender using the `SetGender` method of the `Player` class. The command validates the player's input and sets the gender accordingly, providing appropriate feedback to the player.

## SetGuildRank
This method allows you to set the guild rank of a player. The rank is specified by a number that corresponds to the rank index in the guild_rank table of the characters database. For more information about guild ranks, you can refer to the AzerothCore wiki: https://www.azerothcore.org/wiki/guild_rank

### Parameters
- rank: number - The index of the guild rank to set for the player.

### Example Usage
This example demonstrates how to set a player's guild rank based on their total playtime.

```typescript
const RANK_INITIATE = 1;
const RANK_MEMBER = 2;
const RANK_VETERAN = 3;
const RANK_OFFICER = 4;
const RANK_LEADER = 5;

const UpdateGuildRank: player_event_on_login = (event: number, player: Player) => {
    const totalPlayTime = player.GetTotalPlayedTime();
    let newRank = RANK_INITIATE;

    if (totalPlayTime >= 604800) { // 7 days in seconds
        newRank = RANK_MEMBER;
    }

    if (totalPlayTime >= 2592000) { // 30 days in seconds
        newRank = RANK_VETERAN;
    }

    if (totalPlayTime >= 7776000) { // 90 days in seconds
        newRank = RANK_OFFICER;
    }

    if (player.GetGuildId() == 0) {
        // Player is not in a guild, do nothing
        return;
    }

    if (player.GetGuildRank() != newRank) {
        player.SetGuildRank(newRank);
        player.SendBroadcastMessage(`Your guild rank has been updated to ${player.GetGuildRank()} based on your total playtime.`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => UpdateGuildRank(...args));
```

In this example:
1. We define constants for each guild rank index to improve code readability.
2. We register a player event handler for the `PLAYER_EVENT_ON_LOGIN` event.
3. When a player logs in, we retrieve their total playtime using the `GetTotalPlayedTime()` method.
4. We determine the new guild rank based on the total playtime using a series of conditional statements.
5. We check if the player is in a guild using the `GetGuildId()` method. If the player is not in a guild, we exit the function.
6. If the player's current guild rank (retrieved using `GetGuildRank()`) is different from the new rank, we update their rank using the `SetGuildRank()` method.
7. Finally, we send a message to the player informing them that their guild rank has been updated based on their total playtime.

This script ensures that players' guild ranks are automatically updated based on their dedication and time spent playing the game, providing a sense of progression within the guild hierarchy.

## SetHonorLastWeekStandingPos
Sets the player's honor standing position from the previous week. This method is useful for restoring a player's previous week's honor standing position, or for manually adjusting it for custom features or rewards.

### Parameters
* standingPos: number - The standing position to set for the previous week.

### Example Usage
In this example, we will create a script that rewards players based on their previous week's honor standing position. Players who finished in the top 10 positions will receive a special reward.

```typescript
const REWARD_ITEM_ENTRY = 12345; // Replace with your desired item entry
const REWARD_ITEM_COUNT = 1;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's previous week's honor standing position
    const standingPos = player.GetHonorLastWeekStandingPos();

    // Check if the player finished in the top 10 positions
    if (standingPos > 0 && standingPos <= 10) {
        // Reward the player with a special item
        const rewardItem = player.AddItem(REWARD_ITEM_ENTRY, REWARD_ITEM_COUNT);

        if (rewardItem) {
            // Send a message to the player
            player.SendBroadcastMessage(`Congratulations on finishing in the top 10 last week! You have been rewarded with a special item.`);
        } else {
            // If the item couldn't be added (e.g., inventory full), send an error message
            player.SendBroadcastMessage(`Error: Unable to receive the reward item. Please make sure you have enough inventory space.`);
        }
    }

    // Set the player's previous week's honor standing position to their current position
    const currentStandingPos = player.GetHonorStandingPos();
    player.SetHonorLastWeekStandingPos(currentStandingPos);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this script:
1. We define the reward item entry and the number of items to be given as constants.
2. We register the `OnLogin` event to trigger when a player logs in.
3. Inside the event handler, we retrieve the player's previous week's honor standing position using `GetHonorLastWeekStandingPos()`.
4. We check if the player finished in the top 10 positions (standing position greater than 0 and less than or equal to 10).
5. If the player is eligible for the reward, we add the reward item to their inventory using `AddItem()`.
   - If the item is successfully added, we send a congratulatory message to the player.
   - If the item couldn't be added (e.g., inventory is full), we send an error message to the player.
6. Finally, we update the player's previous week's honor standing position to their current position using `SetHonorLastWeekStandingPos()`.

This script ensures that players who performed well in the previous week's honor standings receive a special reward upon logging in. It also updates their previous week's standing position to their current position, so the reward is only given once per week.

## SetHonorPoints
This method allows you to set the player's honor points to a specific value. Honor points are a currency earned through PvP activities and can be used to purchase various rewards from the Honor vendor.

### Parameters
* honorPoints: number - The amount of honor points to set for the player.

### Example Usage
In this example, we'll create a script that rewards players with bonus honor points based on their lifetime honorable kills when they log in.

```typescript
const HONOR_POINTS_PER_KILL = 10;
const HONOR_POINTS_BONUS_THRESHOLD = 100;
const HONOR_POINTS_BONUS = 1000;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's lifetime honorable kills
    const lifetimeHonorableKills = player.GetUInt32Value(PlayerFields.PLAYER_FIELD_LIFETIME_HONORABLE_KILLS);

    // Calculate the bonus honor points based on lifetime kills
    const bonusHonorPoints = lifetimeHonorableKills * HONOR_POINTS_PER_KILL;

    // Get the player's current honor points
    const currentHonorPoints = player.GetHonorPoints();

    // Set the player's new honor points
    player.SetHonorPoints(currentHonorPoints + bonusHonorPoints);

    // Send a message to the player about their bonus honor points
    player.SendBroadcastMessage(`You have been awarded ${bonusHonorPoints} bonus honor points for your lifetime honorable kills!`);

    // If the player's lifetime kills exceed the bonus threshold, give them an additional bonus
    if (lifetimeHonorableKills >= HONOR_POINTS_BONUS_THRESHOLD) {
        player.SetHonorPoints(currentHonorPoints + bonusHonorPoints + HONOR_POINTS_BONUS);
        player.SendBroadcastMessage(`You have also been awarded an additional ${HONOR_POINTS_BONUS} honor points for reaching ${HONOR_POINTS_BONUS_THRESHOLD} lifetime honorable kills!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this script:
1. We define constants for the number of honor points awarded per lifetime kill, the bonus threshold, and the bonus amount.
2. When a player logs in, we retrieve their lifetime honorable kills using `GetUInt32Value(PlayerFields.PLAYER_FIELD_LIFETIME_HONORABLE_KILLS)`.
3. We calculate the bonus honor points by multiplying the lifetime kills by the honor points per kill.
4. We get the player's current honor points using `GetHonorPoints()`.
5. We set the player's new honor points using `SetHonorPoints()`, adding the bonus honor points to their current honor points.
6. We send a message to the player informing them about their bonus honor points.
7. If the player's lifetime kills exceed the bonus threshold, we give them an additional bonus using `SetHonorPoints()` and send another message.

This script encourages players to engage in PvP activities by rewarding them with bonus honor points based on their lifetime honorable kills, with an additional bonus for reaching a certain threshold.

## SetHonorStoredKills
This method sets the player's stored honor kills, which can be used for various purposes such as rewards, achievements, or rankings. The kills can be set as honorable or dishonorable based on the second parameter.

### Parameters
* kills: number - The number of kills to set.
* honorable: boolean (optional) - Determines whether the kills are honorable or dishonorable. If not provided, the default value is 'true'.

### Example Usage
In this example, we'll create a script that rewards players with bonus honor kills based on their total playtime. The script will be triggered when a player logs in.

```typescript
const BONUS_HONOR_KILLS_PER_HOUR = 5;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's total playtime in seconds
    const totalPlaytime = player.GetTotalPlayedTime();

    // Convert playtime to hours
    const playtimeHours = Math.floor(totalPlaytime / 3600);

    // Calculate bonus honor kills based on playtime
    const bonusHonorKills = playtimeHours * BONUS_HONOR_KILLS_PER_HOUR;

    // Get the player's current honor kills
    const currentHonorKills = player.GetHonorStoredKills(true);

    // Set the new total honor kills
    const newTotalHonorKills = currentHonorKills + bonusHonorKills;
    player.SetHonorStoredKills(newTotalHonorKills, true);

    // Send a message to the player
    player.SendBroadcastMessage(`You have been awarded ${bonusHonorKills} bonus honor kills based on your total playtime!`);
    player.SendBroadcastMessage(`Your new total honorable kills: ${newTotalHonorKills}`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this script:
1. We define a constant `BONUS_HONOR_KILLS_PER_HOUR` to set the number of bonus honor kills awarded per hour of playtime.
2. We create an event handler function `OnLogin` that triggers when a player logs in.
3. We retrieve the player's total playtime in seconds using `GetTotalPlayedTime()` and convert it to hours.
4. We calculate the bonus honor kills by multiplying the playtime hours by the `BONUS_HONOR_KILLS_PER_HOUR`.
5. We get the player's current honorable kills using `GetHonorStoredKills(true)`.
6. We calculate the new total honor kills by adding the bonus honor kills to the current honor kills.
7. We set the new total honorable kills using `SetHonorStoredKills(newTotalHonorKills, true)`.
8. Finally, we send a broadcast message to the player informing them about the bonus honor kills and their new total honorable kills.

This script encourages players to spend more time playing the game by rewarding them with bonus honor kills based on their playtime.

## SetKnownTitle
This method adds a specified title to the player's list of known titles. These titles can be referenced in the CharTitles DBC file. For more information about titles, you can find more details here: https://www.azerothcore.org/wiki/dbc_chartitles

### Parameters
- titleId: number - The ID of the title from the CharTitles DBC file.

### Example Usage
In this example, we'll create a script that rewards players with a special title when they complete a specific quest. We'll assume the quest ID is 12345 and the title ID is 123.

```typescript
const QUEST_ID = 12345;
const TITLE_ID = 123;

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number) => {
    if (quest === QUEST_ID) {
        if (!player.HasTitle(TITLE_ID)) {
            player.SetKnownTitle(TITLE_ID);
            player.SendNotification("Congratulations! You have earned the title for completing this quest.");
        } else {
            player.SendNotification("You have already earned this title.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this script:
1. We define constants for the quest ID and title ID for better readability and maintainability.
2. We create a function called `OnQuestComplete` that will be triggered when a player completes a quest.
3. Inside the function, we check if the completed quest ID matches the one we're interested in (12345).
4. If it does, we then check if the player already has the title using the `HasTitle` method.
5. If the player doesn't have the title, we add it to their list of known titles using `SetKnownTitle` and send them a congratulatory notification.
6. If the player already has the title, we send them a different notification letting them know they've already earned it.
7. Finally, we register the `OnQuestComplete` function to be triggered whenever a player completes a quest using `RegisterPlayerEvent`.

This script demonstrates how to use the `SetKnownTitle` method in a practical scenario, rewarding players with a special title for completing a specific quest. It also showcases additional methods like `HasTitle` and `SendNotification` to enhance the functionality and user experience.

## SetLifetimeKills
Sets the player's total number of lifetime honorable kills to the specified value. This can be useful for custom PvP systems or achievements that track a player's PvP progress over time.

### Parameters
* honorableKills: number - The number of lifetime honorable kills to set for the player.

### Example Usage
In this example, we'll create a custom PvP system where players can earn special titles based on their lifetime honorable kills. When a player reaches certain milestones, they'll receive a title and a bonus item.

```typescript
const KILLS_NOVICE = 50;
const KILLS_ADEPT = 100;
const KILLS_EXPERT = 250;
const KILLS_MASTER = 500;
const KILLS_GRANDMASTER = 1000;

const TITLE_NOVICE = 1;
const TITLE_ADEPT = 2;
const TITLE_EXPERT = 3;
const TITLE_MASTER = 4;
const TITLE_GRANDMASTER = 5;

const BONUS_ITEM_ENTRY = 12345;

const CheckPvPProgress: player_event_on_kill_player = (event: number, killer: Player, killed: Player) => {
    const lifetimeKills = killer.GetLifetimeKills();

    if (lifetimeKills >= KILLS_GRANDMASTER && !killer.HasTitle(TITLE_GRANDMASTER)) {
        killer.SetLifetimeKills(KILLS_GRANDMASTER);
        killer.SetKnownTitle(TITLE_GRANDMASTER);
        killer.AddItem(BONUS_ITEM_ENTRY, 1);
        killer.SendBroadcastMessage("You have earned the title of PvP Grandmaster!");
    } else if (lifetimeKills >= KILLS_MASTER && !killer.HasTitle(TITLE_MASTER)) {
        killer.SetLifetimeKills(KILLS_MASTER);
        killer.SetKnownTitle(TITLE_MASTER);
        killer.AddItem(BONUS_ITEM_ENTRY, 1);
        killer.SendBroadcastMessage("You have earned the title of PvP Master!");
    } else if (lifetimeKills >= KILLS_EXPERT && !killer.HasTitle(TITLE_EXPERT)) {
        killer.SetLifetimeKills(KILLS_EXPERT);
        killer.SetKnownTitle(TITLE_EXPERT);
        killer.AddItem(BONUS_ITEM_ENTRY, 1);
        killer.SendBroadcastMessage("You have earned the title of PvP Expert!");
    } else if (lifetimeKills >= KILLS_ADEPT && !killer.HasTitle(TITLE_ADEPT)) {
        killer.SetLifetimeKills(KILLS_ADEPT);
        killer.SetKnownTitle(TITLE_ADEPT);
        killer.AddItem(BONUS_ITEM_ENTRY, 1);
        killer.SendBroadcastMessage("You have earned the title of PvP Adept!");
    } else if (lifetimeKills >= KILLS_NOVICE && !killer.HasTitle(TITLE_NOVICE)) {
        killer.SetLifetimeKills(KILLS_NOVICE);
        killer.SetKnownTitle(TITLE_NOVICE);
        killer.AddItem(BONUS_ITEM_ENTRY, 1);
        killer.SendBroadcastMessage("You have earned the title of PvP Novice!");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, (...args) => CheckPvPProgress(...args));
```

In this script, we define constants for the number of kills required for each title and the corresponding title IDs. When a player kills another player, we check their lifetime honorable kills and grant them the appropriate title and bonus item if they've reached a new milestone. We use `SetLifetimeKills()` to ensure that their kill count is set to the exact milestone value.

## SetPlayerLock
This method allows you to lock or unlock the player's controls, preventing or allowing movement and casting.

### Parameters
- `apply`: boolean (optional) - If set to `true`, the player will be locked. If set to `false`, the player will be unlocked. If not provided, the default value is `true`.

### Example Usage
Here's an example of how to use `SetPlayerLock` in a script that freezes the player in place for a certain duration when they enter a specific area:

```typescript
const AREA_ID = 1234; // Replace with the desired area ID
const LOCK_DURATION = 5000; // Lock duration in milliseconds (5 seconds)

const OnAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaId: number) => {
    if (areaId === AREA_ID) {
        // Lock the player controls
        player.SetPlayerLock(true);

        // Send a message to the player
        player.SendBroadcastMessage("You have been frozen in place!");

        // Set a timer to unlock the player after the specified duration
        let timerId = 0;
        timerId = CreateTimer(LOCK_DURATION, () => {
            // Unlock the player controls
            player.SetPlayerLock(false);

            // Send a message to the player
            player.SendBroadcastMessage("You are now free to move!");

            // Despawn the timer
            DestroyTimer(timerId);
        });
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => OnAreaTrigger(...args));
```

In this example:
1. When the player enters a specific area (identified by `AREA_ID`), the `OnAreaTrigger` event is triggered.
2. Inside the event handler, we check if the triggered area ID matches the desired area ID.
3. If it matches, we lock the player's controls using `SetPlayerLock(true)`.
4. We send a message to the player indicating that they have been frozen in place.
5. We create a timer using `CreateTimer` that will unlock the player after a specified duration (`LOCK_DURATION`).
6. Inside the timer callback, we unlock the player's controls using `SetPlayerLock(false)`.
7. We send a message to the player indicating that they are now free to move.
8. Finally, we destroy the timer using `DestroyTimer` to prevent memory leaks.

This script demonstrates how to use `SetPlayerLock` to temporarily restrict the player's movement and casting abilities when they enter a specific area, and then unlock them after a certain duration.

Remember to replace `AREA_ID` with the actual area ID you want to trigger the lock, and adjust the `LOCK_DURATION` to the desired duration in milliseconds.

## SetPvPDeath
This method allows you to toggle PvP death for a player. When PvP death is enabled, the player will lose durability and drop items on death during PvP combat. If PvP death is disabled, the player will not suffer these penalties.

### Parameters
* on: boolean (optional) - Determines whether to enable or disable PvP death. If not provided, the method will toggle the current state.

### Example Usage
In this example, we will create a custom PvP event where players can opt-in to participate. If they choose to participate, PvP death will be enabled for them, increasing the risk and reward of the event.

```typescript
// Event constants
const EVENT_AREA_ID = 1234; // The area ID where the event takes place
const EVENT_DURATION = 3600; // Event duration in seconds (1 hour)
const EVENT_MIN_LEVEL = 60; // Minimum level required to participate

// Event state
let eventActive = false;
let eventParticipants: Player[] = [];

// Event start function
function startPvPEvent() {
    eventActive = true;
    SendWorldMessage("The PvP event has begun! Players can now opt-in to participate.");
    CreateLuaEvent(() => {
        endPvPEvent();
    }, EVENT_DURATION * 1000, 1);
}

// Event end function
function endPvPEvent() {
    eventActive = false;
    SendWorldMessage("The PvP event has ended. Thank you for participating!");
    for (const participant of eventParticipants) {
        participant.SetPvPDeath(false);
    }
    eventParticipants = [];
}

// Player login event
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (eventActive && player.GetLevel() >= EVENT_MIN_LEVEL) {
        player.SendBroadcastMessage("A PvP event is currently active! Type '.joinevent' to participate.");
    }
};

// Player chat event
const OnChat: player_event_on_chat = (event: number, player: Player, msg: string, Type: number, lang: number) => {
    if (msg === ".joinevent" && eventActive) {
        if (player.GetLevel() < EVENT_MIN_LEVEL) {
            player.SendBroadcastMessage(`You must be at least level ${EVENT_MIN_LEVEL} to participate in the PvP event.`);
            return;
        }

        if (player.GetAreaId() !== EVENT_AREA_ID) {
            player.SendBroadcastMessage(`You must be in the event area to join the PvP event.`);
            return;
        }

        player.SetPvPDeath(true);
        eventParticipants.push(player);
        player.SendBroadcastMessage("You have joined the PvP event! PvP death is now enabled for you.");
    }
};

// Register events
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => OnChat(...args));

// Start the event
startPvPEvent();
```

In this example, players can join the PvP event by typing ".joinevent" in the chat while they are in the designated event area and meet the minimum level requirement. When they join, PvP death is enabled for them using the `SetPvPDeath` method. At the end of the event, PvP death is disabled for all participants.

## SetQuestStatus
Sets the state of a quest for the player. The quest state determines the player's progress and completion status for a specific quest.

### Parameters
* entry: number - The ID of the quest to set the status for. Quest IDs can be found in the `quest_template` table in the world database.
* status: number - The status to set for the quest. Valid status values are:
  - 0 - QUEST_STATUS_NONE
  - 1 - QUEST_STATUS_COMPLETE
  - 2 - QUEST_STATUS_UNAVAILABLE
  - 3 - QUEST_STATUS_INCOMPLETE
  - 4 - QUEST_STATUS_AVAILABLE
  - 5 - QUEST_STATUS_FAILED

### Example Usage
In this example, we'll create a script that allows players to reset a daily quest by talking to an NPC. The script will check if the player has already completed the quest for the day and reset it if necessary.

```typescript
const DAILY_QUEST_ENTRY = 12345;
const QUEST_RESET_NPC_ENTRY = 54321;

const OnGossipHello: on_gossip_event = (event: number, player: Player, object: WorldObject) => {
    if (object.GetEntry() === QUEST_RESET_NPC_ENTRY) {
        if (player.GetQuestStatus(DAILY_QUEST_ENTRY) === QuestStatus.QUEST_STATUS_COMPLETE) {
            player.SetQuestStatus(DAILY_QUEST_ENTRY, QuestStatus.QUEST_STATUS_NONE);
            player.SendBroadcastMessage("Your daily quest has been reset. You can now accept it again!");
        } else {
            player.SendBroadcastMessage("You have not completed the daily quest yet. Come back after you've finished it!");
        }
        
        player.GossipComplete();
    }
};

RegisterServerEvent(ServerEvents.EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
```

In this script:
1. We define constants for the daily quest entry and the NPC entry that will reset the quest.
2. We register a server event for `EVENT_ON_GOSSIP_HELLO`, which triggers when a player interacts with an NPC.
3. Inside the event handler, we check if the interacted object's entry matches the quest reset NPC entry.
4. If the player has already completed the daily quest (status is `QUEST_STATUS_COMPLETE`), we use `SetQuestStatus` to reset the quest status to `QUEST_STATUS_NONE`, effectively allowing the player to accept and complete the quest again.
5. We send a broadcast message to the player informing them that the quest has been reset or that they need to complete it first.
6. Finally, we call `GossipComplete` to close the gossip window.

This script provides a convenient way for players to reset a daily quest by interacting with a specific NPC, saving them time and effort in case they need to repeat the quest.

## SetRankPoints
This method sets the rank points for the player in the PvP ranking system. Rank points are used to determine the player's PvP rank and can be earned through various PvP activities such as battlegrounds and arenas.

### Parameters
- `rankPoints`: number - The amount of rank points to set for the player.

### Example Usage
Here's an example of how to use the `SetRankPoints` method to implement a custom PvP reward system:

```typescript
const PVP_KILL_RP_REWARD = 10; // Reward 10 rank points per PvP kill
const RP_THRESHOLD_RANK_1 = 100; // Threshold for reaching rank 1
const RP_THRESHOLD_RANK_2 = 500; // Threshold for reaching rank 2
const RP_THRESHOLD_RANK_3 = 1000; // Threshold for reaching rank 3

const OnPvPKill: player_event_On_Kill_Player = (event: number, killer: Player, killed: Player) => {
    const currentRP = killer.GetRankPoints();
    killer.SetRankPoints(currentRP + PVP_KILL_RP_REWARD);

    const newRP = killer.GetRankPoints();
    if (newRP >= RP_THRESHOLD_RANK_3 && currentRP < RP_THRESHOLD_RANK_3) {
        // Player reached rank 3
        killer.SendBroadcastMessage("Congratulations! You have reached PvP Rank 3!");
        killer.AddItem(RANK_3_REWARD_ITEM, 1); // Reward for reaching rank 3
    } else if (newRP >= RP_THRESHOLD_RANK_2 && currentRP < RP_THRESHOLD_RANK_2) {
        // Player reached rank 2
        killer.SendBroadcastMessage("Congratulations! You have reached PvP Rank 2!");
        killer.AddItem(RANK_2_REWARD_ITEM, 1); // Reward for reaching rank 2
    } else if (newRP >= RP_THRESHOLD_RANK_1 && currentRP < RP_THRESHOLD_RANK_1) {
        // Player reached rank 1
        killer.SendBroadcastMessage("Congratulations! You have reached PvP Rank 1!");
        killer.AddItem(RANK_1_REWARD_ITEM, 1); // Reward for reaching rank 1
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, (...args) => OnPvPKill(...args));
```

In this example:
1. We define constants for the rank point reward per PvP kill and the rank point thresholds for reaching different PvP ranks.
2. In the `OnPvPKill` event handler, we retrieve the current rank points of the killer player using `GetRankPoints()`.
3. We call `SetRankPoints()` to add the PvP kill reward to the player's current rank points.
4. We check if the player has reached a new PvP rank based on the updated rank points.
5. If the player reaches a new rank, we send a congratulatory message using `SendBroadcastMessage()` and reward them with a specific item using `AddItem()`.

This script demonstrates how the `SetRankPoints` method can be used in combination with other methods to create a custom PvP ranking and reward system on an Azerothcore server with the mod-eluna platform.

## SetReputation
Sets the player's reputation amount for the specified faction. The reputation value is an integer value that represents the player's standing with the faction. Reputation values can be negative or positive, with higher positive values indicating a better standing with the faction.

### Parameters
* factionId: number - The ID of the faction to set the reputation for. Faction IDs can be found in the `Faction` table in the world database.
* reputationValue: number - The reputation value to set for the specified faction. This value can be negative or positive.

### Example Usage
Example script to set a player's reputation with the Argent Dawn faction based on their level when they kill a specific creature.

```typescript
const CREATURE_ENTRY = 1234; // Replace with the actual creature entry ID
const ARGENT_DAWN_FACTION_ID = 529; // Argent Dawn faction ID

const onCreatureKill: creature_event_on_creature_kill = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY && killer instanceof Player) {
        const player = killer as Player;
        const playerLevel = player.GetLevel();

        let reputationValue = 0;
        if (playerLevel >= 60) {
            reputationValue = 2500; // Exalted
        } else if (playerLevel >= 50) {
            reputationValue = 1500; // Revered
        } else if (playerLevel >= 40) {
            reputationValue = 500; // Honored
        } else if (playerLevel >= 30) {
            reputationValue = 100; // Friendly
        } else {
            reputationValue = 0; // Neutral
        }

        const currentReputation = player.GetReputation(ARGENT_DAWN_FACTION_ID);
        const newReputation = currentReputation + reputationValue;

        player.SetReputation(ARGENT_DAWN_FACTION_ID, newReputation);
        player.SendBroadcastMessage(`Your reputation with the Argent Dawn has increased by ${reputationValue}!`);
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_CREATURE_KILL, onCreatureKill);
```

In this example:
1. We define the creature entry ID and the Argent Dawn faction ID as constants.
2. We register a creature event handler for the `CREATURE_EVENT_ON_CREATURE_KILL` event.
3. When the specified creature is killed by a player, we determine the reputation value to be added based on the player's level.
4. We retrieve the player's current reputation with the Argent Dawn faction using `player.GetReputation()`.
5. We calculate the new reputation value by adding the determined reputation value to the current reputation.
6. We set the player's reputation with the Argent Dawn faction to the new value using `player.SetReputation()`.
7. We send a broadcast message to the player informing them of the reputation increase.

This script demonstrates how to use the `SetReputation()` method to modify a player's reputation with a specific faction based on certain conditions, such as the player's level and the creature they have killed.

## SetRestBonus
This method sets the player's rest bonus to the specified amount. The rest bonus is a mechanic in World of Warcraft that allows players to accumulate extra experience points while logged out in an inn or a city. When the player logs back in, they receive a percentage of bonus experience based on their rest bonus amount. 

### Parameters
* restBonus: number - The amount of rest bonus to set for the player. This value is represented as a percentage, where 100 means 100% rest bonus.

### Example Usage
Here's an example of how to use the `SetRestBonus` method to grant players a rest bonus based on their level and the time they spent offline:

```typescript
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const GrantRestBonus: player_event_on_login = (event: number, player: Player) => {
    const timeOffline = player.GetTotalPlayedTime() - player.GetLevelPlayedTime();
    const level = player.GetLevel();
    let restBonus = 0;

    if (level < 60) {
        restBonus = (timeOffline / (8 * HOUR)) * 100;
    } else if (level < 70) {
        restBonus = (timeOffline / (12 * HOUR)) * 100;
    } else {
        restBonus = (timeOffline / DAY) * 100;
    }

    // Clamp the rest bonus between 0 and 150
    restBonus = Math.max(0, Math.min(restBonus, 150));

    player.SetRestBonus(restBonus);

    // Notify the player about their rest bonus
    player.SendBroadcastMessage(`Welcome back! You have accumulated ${restBonus.toFixed(2)}% rest bonus while offline.`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, GrantRestBonus);
```

In this example, we calculate the rest bonus based on the player's time spent offline and their level. Lower level players accumulate rest bonus faster than higher level players. We use different formulas to calculate the rest bonus for players below level 60, between level 60 and 70, and above level 70.

We then clamp the rest bonus value between 0 and 150 to ensure it stays within the valid range. Finally, we call the `SetRestBonus` method to set the player's rest bonus and send them a message informing them about their accumulated rest bonus.

This script showcases how you can use the `SetRestBonus` method in combination with other player-related methods and events to create a more immersive and rewarding experience for players who take breaks from the game.

## SetSheath
Sets the sheathe state of the player's equipped weapons. The sheathe state determines whether the weapons are visibly carried on the player's character model.

### Parameters
* sheatheState: number - The desired sheathe state. Valid values are:
  * 0 - No sheathe state (weapons are not visible)
  * 1 - Melee sheathe state (melee weapons are visible)
  * 2 - Ranged sheathe state (ranged weapons are visible)

### Example Usage
This example demonstrates how to set the player's sheathe state based on their class and the weapons they have equipped.

```typescript
const SHEATHE_STATE_NONE = 0;
const SHEATHE_STATE_MELEE = 1;
const SHEATHE_STATE_RANGED = 2;

const UpdateSheatheState: player_event_on_equip = (event: number, player: Player, item: Item, bag: number, slot: number) => {
    const classId = player.GetClass();
    const hasRangedWeapon = player.HasRangedWeapon();
    const hasMeleeWeapon = player.HasMeleeWeapon();

    let sheatheState = SHEATHE_STATE_NONE;

    if (classId === Classes.CLASS_HUNTER && hasRangedWeapon) {
        sheatheState = SHEATHE_STATE_RANGED;
    } else if (hasMeleeWeapon) {
        sheatheState = SHEATHE_STATE_MELEE;
    }

    player.SetSheath(sheatheState);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_EQUIP, (...args) => UpdateSheatheState(...args));
```

In this example, we define constants for the different sheathe states: `SHEATHE_STATE_NONE`, `SHEATHE_STATE_MELEE`, and `SHEATHE_STATE_RANGED`.

We register a player event handler for the `PLAYER_EVENT_ON_EQUIP` event, which is triggered whenever a player equips an item. Inside the event handler, we retrieve the player's class using `player.GetClass()` and check if the player has a ranged weapon or a melee weapon equipped using `player.HasRangedWeapon()` and `player.HasMeleeWeapon()`, respectively.

Based on the player's class and equipped weapons, we determine the appropriate sheathe state. If the player is a hunter and has a ranged weapon equipped, we set the sheathe state to `SHEATHE_STATE_RANGED`. Otherwise, if the player has a melee weapon equipped, we set the sheathe state to `SHEATHE_STATE_MELEE`. If neither condition is met, the sheathe state remains as `SHEATHE_STATE_NONE`.

Finally, we call `player.SetSheath(sheatheState)` to set the player's sheathe state to the determined value.

This script ensures that the player's sheathe state is automatically updated whenever they equip or unequip weapons, providing a visually accurate representation of their equipped weapons on their character model.

## SetSkill
This method allows you to set or increase a specific skill for the player. You can specify the skill ID, the amount to increase the skill by, the current value of the skill, and the maximum value of the skill.

### Parameters
* id: number - The ID of the skill to set or increase. Skill IDs can be found in the `SkillLine.dbc` file.
* step: number - The amount to increase the skill by.
* currVal: number - The current value of the skill.
* maxVal: number - The maximum value of the skill.

### Example Usage
Here's an example of how to use the `SetSkill` method to increase a player's mining skill when they successfully mine a ore node:

```typescript
const MINING_SKILL_ID = 186;
const COPPER_ORE_ENTRY = 2770;
const COPPER_ORE_SKILL_STEP = 1;

const OnOpenGo: player_event_on_go_use = (event: number, player: Player, gameobject: GameObject) => {
    const goEntry = gameobject.GetEntry();

    if (goEntry === COPPER_ORE_ENTRY) {
        const miningSkill = player.GetSkillValue(MINING_SKILL_ID);
        const maxSkillLevel = player.GetMaxSkillValue(MINING_SKILL_ID);

        if (miningSkill < maxSkillLevel) {
            player.SetSkill(MINING_SKILL_ID, COPPER_ORE_SKILL_STEP, miningSkill, maxSkillLevel);
            player.SendBroadcastMessage("Your mining skill has increased!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GO_USE, (...args) => OnOpenGo(...args));
```

In this example:
1. We define constants for the mining skill ID, copper ore entry ID, and the amount to increase the skill by when mining copper ore.
2. We register the `PLAYER_EVENT_ON_GO_USE` event to trigger the `OnOpenGo` function whenever a player uses a game object.
3. Inside the `OnOpenGo` function, we check if the game object entry matches the copper ore entry.
4. If it does, we get the player's current mining skill value and maximum skill value using the `GetSkillValue` and `GetMaxSkillValue` methods.
5. If the current skill value is less than the maximum skill value, we use the `SetSkill` method to increase the mining skill by the specified step amount.
6. Finally, we send a broadcast message to the player informing them that their mining skill has increased.

This script ensures that the player's mining skill increases gradually as they mine copper ore nodes, until they reach the maximum skill level for mining.

Note: Make sure to replace the skill ID, ore entry, and skill step values with the appropriate values for your server and the specific skill you want to increase.

## SetTaxiCheat
Toggles whether the player has taxi cheat enabled or not. When taxi cheat is enabled, the player can instantly teleport to any taxi node without the need to discover it first or pay for the travel cost.

### Parameters
* taxiCheat?: boolean - (Optional) Set to `true` to enable taxi cheat, `false` to disable it. If not provided, it will toggle the current state.

### Example Usage
In this example, we create a command `.taxicheat` that allows players to toggle their taxi cheat status. We also store the player's original taxi cheat state in a table to restore it when they log out.

```typescript
const playerTaxiCheatState: { [playerGuid: number]: boolean } = {};

const onCommand: player_event_on_command = (event: PlayerEvents.PLAYER_EVENT_ON_COMMAND, player: Player, command: string, args: string[]): void => {
    if (command === 'taxicheat') {
        const currentState = player.GetTaxiCheat();
        player.SetTaxiCheat(!currentState);

        if (currentState) {
            player.SendBroadcastMessage('Taxi cheat disabled.');
        } else {
            player.SendBroadcastMessage('Taxi cheat enabled.');
        }

        playerTaxiCheatState[player.GetGUIDLow()] = !currentState;
    }
};

const onLogin: player_event_on_login = (event: PlayerEvents.PLAYER_EVENT_ON_LOGIN, player: Player): void => {
    const playerGuid = player.GetGUIDLow();
    if (playerGuid in playerTaxiCheatState) {
        const taxiCheatState = playerTaxiCheatState[playerGuid];
        player.SetTaxiCheat(taxiCheatState);

        if (taxiCheatState) {
            player.SendBroadcastMessage('Taxi cheat is currently enabled for your character.');
        }
    }
};

const onLogout: player_event_on_logout = (event: PlayerEvents.PLAYER_EVENT_ON_LOGOUT, player: Player): void => {
    const playerGuid = player.GetGUIDLow();
    delete playerTaxiCheatState[playerGuid];
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => onCommand(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onLogin(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGOUT, (...args) => onLogout(...args));
```

In this script:
1. We define an object `playerTaxiCheatState` to store the taxi cheat state for each player using their GUID as the key.
2. In the `onCommand` event, we check if the player used the `.taxicheat` command. If so, we toggle their taxi cheat state using `SetTaxiCheat()`, send them a message indicating the current state, and store the updated state in `playerTaxiCheatState`.
3. In the `onLogin` event, we check if the player's GUID exists in `playerTaxiCheatState`. If it does, we set their taxi cheat state to the stored value and send them a message if taxi cheat is enabled.
4. In the `onLogout` event, we remove the player's entry from `playerTaxiCheatState` to avoid storing unnecessary data.

This script allows players to use the `.taxicheat` command to toggle their taxi cheat status, which persists across logouts. The script also informs players about their current taxi cheat state when they log in.

## SpawnBones
This method will convert the player's corpse into bones. This can be useful for quickly removing a player's corpse from the game world or for creating custom death mechanics.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any values.

### Example Usage
In this example, we will create a custom death system where players who die in a specific area will have their corpses automatically converted to bones after 5 minutes. This can be used to create a sense of urgency for players to recover their corpses in dangerous areas.

```typescript
const CUSTOM_AREA_ID = 1234;
const CORPSE_DESPAWN_DELAY = 5 * MINUTE * IN_MILLISECONDS;

const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    if (player.GetAreaId() === CUSTOM_AREA_ID) {
        player.CreateCorpse();
        
        // Schedule the corpse to be converted to bones after the specified delay
        player.RegisterTimedEvent(CORPSE_DESPAWN_DELAY, (eventId: number, delay: number, repeats: number, player: Player) => {
            const corpse = player.GetCorpse();
            if (corpse) {
                corpse.SetCorpseType(CorpseType.CORPSE_BONES);
                corpse.DeleteBonesFromWorld();
            }
        }, CORPSE_DESPAWN_DELAY);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this script:
1. We define a constant `CUSTOM_AREA_ID` to represent the area ID where we want to apply our custom death mechanics.
2. We define a constant `CORPSE_DESPAWN_DELAY` to specify the delay (in milliseconds) before the corpse is converted to bones.
3. In the `OnPlayerDeath` event handler, we check if the player died in the specified area using `player.GetAreaId()`.
4. If the player died in the custom area, we create a corpse for the player using `player.CreateCorpse()`.
5. We then schedule a timed event using `player.RegisterTimedEvent()` to be executed after the specified delay.
6. In the timed event callback, we retrieve the player's corpse using `player.GetCorpse()`.
7. If the corpse exists, we convert it to bones using `corpse.SetCorpseType(CorpseType.CORPSE_BONES)`.
8. Finally, we remove the bones from the world using `corpse.DeleteBonesFromWorld()`.

This script showcases how the `SpawnBones()` method can be used in combination with other methods and events to create a custom death system in specific areas of the game world.

Remember to register the event handler using `RegisterPlayerEvent()` with the appropriate event type (`PlayerEvents.PLAYER_EVENT_ON_DEATH` in this case) to ensure that the script is executed when a player dies.

## StartTaxi
This method attempts to start a taxi or flying mount travel for the player to the specified path. The pathId corresponds to the path entry in the DBC files. If the player does not meet the requirements for the taxi path, such as not having the necessary flight points discovered or not being at a flight master, the method will fail silently.

### Parameters
- pathId: number - The ID of the taxi path to start. You can find these IDs in the DBC files or by consulting the TaxiPath.dbc file.

### Example Usage
Here's an example of how to use the StartTaxi method to send a player on a taxi ride when they interact with a specific game object:

```typescript
const OBJECT_ENTRY = 12345; // Replace with the actual game object entry ID
const TAXI_PATH_ID = 678; // Replace with the actual taxi path ID

const OnGameObjectUse: gameobject_scripts = (go: GameObject, player: Player) => {
    if (go.GetEntry() === OBJECT_ENTRY) {
        // Check if the player is eligible for the taxi ride
        if (player.GetTeam() === TeamId.TEAM_HORDE && player.GetReputationRank(942) >= ReputationRank.REVERED) {
            // Horde players need to be Revered with the Cenarion Expedition (faction ID 942)
            player.StartTaxi(TAXI_PATH_ID);
        } else if (player.GetTeam() === TeamId.TEAM_ALLIANCE && player.GetQuestRewardStatus(12345)) {
            // Alliance players need to have completed a specific quest (replace 12345 with the actual quest ID)
            player.StartTaxi(TAXI_PATH_ID);
        } else {
            // Player does not meet the requirements
            player.SendBroadcastMessage("You do not meet the requirements to use this taxi service.");
        }
    }
};

RegisterGameObjectEvent(OBJECT_ENTRY, GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, OnGameObjectUse);
```

In this example:
1. We define the entry ID of the game object that will trigger the taxi ride (replace `OBJECT_ENTRY` with the actual entry ID).
2. We specify the taxi path ID that the player will be sent on (replace `TAXI_PATH_ID` with the actual path ID).
3. In the `OnGameObjectUse` event handler, we check if the interacted game object matches the desired entry ID.
4. We then check if the player meets the requirements for the taxi ride based on their team and other conditions.
   - For Horde players, we check if they have reached the Revered reputation rank with the Cenarion Expedition faction.
   - For Alliance players, we check if they have completed a specific quest (replace `12345` with the actual quest ID).
5. If the player meets the requirements, we call `player.StartTaxi(TAXI_PATH_ID)` to send them on the taxi ride.
6. If the player does not meet the requirements, we send them a broadcast message informing them that they cannot use the taxi service.
7. Finally, we register the `OnGameObjectUse` event handler for the specific game object entry using `RegisterGameObjectEvent`.

Make sure to replace `OBJECT_ENTRY`, `TAXI_PATH_ID`, and any other placeholder values with the actual entry IDs and path IDs relevant to your scenario.

## SummonPlayer
Sends a summon request to the player from the given summoner. This can be used to request the player to join a group, raid, or to teleport to the summoner's location. The player must accept the summon request to complete the summon.

### Parameters
- summoner: [Unit](./unit.md) - The unit that is summoning the player.

### Example Usage
Here's an example of how to use the `SummonPlayer` method to summon a player to a raid boss encounter when they enter the raid dungeon:

```typescript
const RAID_DUNGEON_MAP_ID = 532;
const RAID_BOSS_CREATURE_ENTRY = 24723;

const OnPlayerEnterWorld: player_event_on_login = (event: number, player: Player) => {
    const map = player.GetMap();

    if (map && map.GetMapId() === RAID_DUNGEON_MAP_ID) {
        const creatures = map.GetCreaturesInRange(player.GetX(), player.GetY(), player.GetZ(), 100);
        
        for (const creature of creatures) {
            if (creature.GetEntry() === RAID_BOSS_CREATURE_ENTRY) {
                const raidBoss = creature as Unit;
                
                // Check if the player is already in a raid group
                if (!player.IsInRaid()) {
                    // Create a new raid group and add the player to it
                    const raidGroup = player.GetMap().CreateRaid(player);
                    player.AddToRaid(raidGroup);
                }
                
                // Send a summon request to the player from the raid boss
                raidBoss.SummonPlayer(player);
                
                // Announce the summon request to the player
                player.SendBroadcastMessage(`You have been summoned by ${raidBoss.GetName()} to join the raid!`);
                
                break;
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnPlayerEnterWorld(...args));
```

In this example, when a player enters a specific raid dungeon (identified by the `RAID_DUNGEON_MAP_ID`), the script searches for a raid boss creature (identified by the `RAID_BOSS_CREATURE_ENTRY`) within a certain range of the player's location.

If the raid boss is found and the player is not already in a raid group, the script creates a new raid group and adds the player to it. Then, it sends a summon request to the player from the raid boss using the `SummonPlayer` method.

Finally, the script sends a broadcast message to the player informing them about the summon request from the raid boss.

This example demonstrates how the `SummonPlayer` method can be used in combination with other methods and game events to create a more complex and interactive gameplay experience for the player.

## TalkedToCreature
This method is used to give credit to the player for talking to a creature as part of a quest requirement. It marks the specified creature as "talked to" for the player in the context of the quest.

### Parameters
* entry: number - The entry ID of the quest that requires talking to the creature.
* creature: [Creature](./creature.md) - The creature object representing the NPC that the player talked to.

### Example Usage
In this example, we have a quest that requires the player to talk to a specific NPC to gather information. Once the player interacts with the NPC, the `TalkedToCreature` method is called to give the player credit for talking to the creature.

```typescript
const QUEST_ENTRY = 1234;
const NPC_ENTRY = 5678;

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === NPC_ENTRY) {
        if (player.HasQuest(QUEST_ENTRY)) {
            player.TalkedToCreature(QUEST_ENTRY, creature);
            creature.SendUnitWhisper("Thank you for taking the time to talk to me. I have marked your quest as complete.", 0, player);
            player.CompleteQuest(QUEST_ENTRY);
        } else {
            creature.SendUnitWhisper("Hello there! I have some important information, but it seems you don't have the right quest yet.", 0, player);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
```

In this script:
1. We define constants for the quest entry and the NPC entry for clarity and maintainability.
2. We register the `PLAYER_EVENT_ON_GOSSIP_HELLO` event to trigger the script when the player interacts with an NPC.
3. Inside the event handler, we check if the interacted creature matches the desired NPC entry.
4. If the player has the specific quest, we call `TalkedToCreature` to give credit for talking to the creature.
5. We send a whisper message to the player indicating that the quest has been marked as complete.
6. We call `CompleteQuest` to mark the quest as completed for the player.
7. If the player doesn't have the quest, we send a different whisper message indicating that they don't have the right quest yet.

This script ensures that the player receives credit for talking to the specific NPC only if they have the corresponding quest. It provides a more immersive experience by sending appropriate whisper messages based on the player's quest status.

Note: Make sure to replace `QUEST_ENTRY` and `NPC_ENTRY` with the actual entry IDs from your database for the specific quest and NPC involved in the script.

## Teleport
Instantly moves the player to the specified location on the given map.

### Parameters
* mapId: number - The ID of the map to teleport the player to. Map IDs can be found in the `Map.dbc` file.
* xCoord: number - The x-coordinate of the destination on the specified map.
* yCoord: number - The y-coordinate of the destination on the specified map.
* zCoord: number - The z-coordinate (height) of the destination on the specified map.
* orientation: number - The orientation (facing direction) of the player at the destination, in radians.

### Example Usage
Teleport the player to the top of Stormwind's Wizard's Sanctum when they use the `.tele` command:

```typescript
const WIZARD_SANCTUM_MAP = 0; // Eastern Kingdoms
const WIZARD_SANCTUM_X = -9015.8;
const WIZARD_SANCTUM_Y = 874.7;
const WIZARD_SANCTUM_Z = 148.6;
const WIZARD_SANCTUM_O = 3.5;

const onChatMessage: player_event_on_chat = (event: number, player: Player, msg: string, Type: ChatMsg, lang: Language): void => {
    if (msg === '.tele') {
        player.Teleport(WIZARD_SANCTUM_MAP, WIZARD_SANCTUM_X, WIZARD_SANCTUM_Y, WIZARD_SANCTUM_Z, WIZARD_SANCTUM_O);
        player.SendBroadcastMessage('You have been teleported to the Wizard\'s Sanctum.');
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onChatMessage(...args));
```

Create a teleportation matrix for GMs to quickly move between major cities:

```typescript
const CITY_TELEPORT_LOCATIONS = [
    { name: 'Stormwind', map: 0, x: -8842.1, y: 626.4, z: 94.1, o: 3.6 },
    { name: 'Ironforge', map: 0, x: -4918.9, y: -940.4, z: 501.6, o: 5.4 },
    { name: 'Darnassus', map: 1, x: 9947.5, y: 2482.7, z: 1316.2, o: 0 },
    { name: 'Exodar', map: 530, x: -3965.7, y: -11653.6, z: -138.8, o: 0.5 },
    { name: 'Orgrimmar', map: 1, x: 1424.1, y: -4419.3, z: 25.1, o: 0.1 },
    { name: 'Thunder Bluff', map: 1, x: -1282.3, y: 114.8, z: 131.3, o: 5.1 },
    { name: 'Undercity', map: 0, x: 1586.5, y: 239.6, z: -52.1, o: 0.6 },
    { name: 'Silvermoon', map: 530, x: 9487.7, y: -7279.3, z: 14.2, o: 0 },
    { name: 'Shattrath', map: 530, x: -1838.2, y: 5301.8, z: -12.4, o: 5.9 },
    { name: 'Dalaran', map: 571, x: 5804.1, y: 624.7, z: 647.8, o: 1.6 }
];

const onChatMessage: player_event_on_chat = (event: number, player: Player, msg: string, Type: ChatMsg, lang: Language): void => {
    if (msg.startsWith('.tele ')) {
        const cityName = msg.substring(6);
        const city = CITY_TELEPORT_LOCATIONS.find(c => c.name.toLowerCase() === cityName.toLowerCase());

        if (city) {
            player.Teleport(city.map, city.x, city.y, city.z, city.o);
            player.SendBroadcastMessage(`You have been teleported to ${city.name}.`);
        } else {
            player.SendBroadcastMessage(`Unknown city: ${cityName}. Valid cities are: ${CITY_TELEPORT_LOCATIONS.map(c => c.name).join(', ')}`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onChatMessage(...args));
```

## TextEmote
Send a text emote message from the player to nearby players in chat. This allows the player to express visible emotions or actions to other players.

### Parameters
* emoteText: string - The text to display as the emote message

### Example Usage:
Create a script to allow players to perform special emotes after killing a creature based on the creature's name.
```typescript
const MURLOC_EMOTE = "makes a gurgling sound.";
const WOLF_EMOTE = "lets out a loud howl!"; 
const DRAGON_EMOTE = "roars triumphantly!";

const onCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    switch(creature.GetName()) {
        case "Murloc":
            player.TextEmote(MURLOC_EMOTE);
            break;
        case "Wolf":
            player.TextEmote(WOLF_EMOTE);
            break;
        case "Dragon":
            player.TextEmote(DRAGON_EMOTE);
            creature.CastSpell(player, 10, true);
            break;
        default:
            player.TextEmote("celebrates their victory!");
            break; 
    }
    
    const nearbyPlayers = player.GetPlayersInRange(10, true);
    nearbyPlayers.forEach((nearbyPlayer: Player) => {
        nearbyPlayer.SendBroadcastMessage(`${player.GetName()} has slain ${creature.GetName()}!`);
    });
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => onCreatureKill(...args));
```
In this example, when a player kills specific types of creatures, they will perform a special emote related to that creature. Additionally, nearby players within 10 yards will receive a broadcast message informing them of the player's victory over the slain creature. If the defeated creature is a dragon, it will also cast a spell on the player with ID 10.

## ToggleAFK
This method allows you to toggle the 'Away From Keyboard' (AFK) flag for the player. When a player is marked as AFK, their character will not be logged out due to inactivity and will display the 'Away' status.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any values.

### Example Usage
Here's an example of how to use the `ToggleAFK` method to automatically set a player's AFK status based on their current zone:

```typescript
const MAJOR_CITY_ZONES = [
    1519, // Stormwind City
    1537, // Ironforge
    1637, // Orgrimmar
    1638, // Thunder Bluff
    1657, // Darnassus
    3487, // Silvermoon City
    3703, // Shattrath City
    4395, // Dalaran
];

const HandlePlayerUpdateZone: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number) => {
    const playerZoneId = player.GetZoneId();

    if (MAJOR_CITY_ZONES.includes(playerZoneId)) {
        // If the player is in a major city, mark them as AFK
        if (!player.IsAFK()) {
            player.ToggleAFK();
            player.SendBroadcastMessage("You have been marked as Away because you are in a major city.");
        }
    } else {
        // If the player is not in a major city, remove the AFK status
        if (player.IsAFK()) {
            player.ToggleAFK();
            player.SendBroadcastMessage("Your Away status has been removed because you left a major city.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => HandlePlayerUpdateZone(...args));
```

In this example, we define an array of zone IDs that correspond to major cities in the game. Whenever a player enters a new zone (`PLAYER_EVENT_ON_UPDATE_ZONE` event), we check if the new zone is a major city.

If the player is in a major city and not already marked as AFK, we toggle their AFK status using `player.ToggleAFK()` and send them a message indicating why they were marked as AFK.

If the player leaves a major city and their AFK status is currently set, we remove the AFK status using `player.ToggleAFK()` and send them a message notifying them of the change.

This script demonstrates how you can use the `ToggleAFK` method in combination with other player methods and events to create a practical feature for your server.

## ToggleDND
This method allows you to toggle the 'Do Not Disturb' (DND) flag for the player. When the DND flag is enabled, the player will not receive any messages from other players, including whispers, guild messages, and channel messages. This can be useful for players who want to focus on their gameplay without being interrupted by chat messages.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
Here's an example of how to use the `ToggleDND` method to create a command that allows players to toggle their DND status:

```typescript
const DND_COMMAND = "dnd";

const HandleCommand: player_event_on_chat = (event: number, player: Player, msg: string, type: number, lang: number) => {
    if (msg === DND_COMMAND) {
        player.ToggleDND();

        if (player.GetDNDStatus()) {
            player.SendBroadcastMessage("Do Not Disturb mode enabled. You will not receive any messages from other players.");
        } else {
            player.SendBroadcastMessage("Do Not Disturb mode disabled. You will now receive messages from other players.");
        }

        return 0;
    }

    return 1;
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => HandleCommand(...args));
```

In this example, we define a constant `DND_COMMAND` that represents the command players can use to toggle their DND status. When a player types this command in the chat, the `HandleCommand` function is called.

Inside the function, we first check if the entered message matches the `DND_COMMAND`. If it does, we call the `ToggleDND` method to toggle the player's DND status.

After toggling the DND status, we use the `GetDNDStatus` method (assuming it exists) to check the current DND status of the player. If the DND status is enabled, we send a broadcast message to the player indicating that they will not receive any messages from other players. If the DND status is disabled, we send a broadcast message indicating that they will now receive messages from other players.

Finally, we return 0 to indicate that the command has been handled and no further processing is needed. If the entered message does not match the `DND_COMMAND`, we return 1 to allow other command handlers to process the message.

By registering the `HandleCommand` function with the `PLAYER_EVENT_ON_CHAT` event, this command will be triggered whenever a player sends a chat message.

## UnbindAllInstances
This method unbinds the player from all instances they are saved to, except the instance they are currently in. This can be useful for managing player saved instances, such as removing them from older instances they no longer need to be saved to.

### Parameters
None

### Returns
None

### Example Usage
This example script listens for the player login event, and if the player is level 80, it will unbind them from all heroic instances that are not Icecrown Citadel, since that is the latest level 80 heroic raid instance.

```typescript
const ICECROWN_CITADEL_MAP_ID = 631;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.GetLevel() == 80) {
        const instanceIds = player.GetBoundInstances();
        
        instanceIds.forEach(id => {
            const instance = player.GetInstance(id);
            
            // If the instance is a heroic difficulty, and not ICC
            if (instance.Is25ManRaid() && instance.GetMapId() !== ICECROWN_CITADEL_MAP_ID) {
                player.UnbindInstance(instance);
            }
        });
        
        // Unbind any remaining non-ICC instances
        player.UnbindAllInstances();
        
        // Inform the player
        player.SendBroadcastMessage("You have been unbound from all old heroic instances.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. We listen for the `PLAYER_EVENT_ON_LOGIN` event.
2. If the player is level 80, we get a list of their bound instance IDs using `player.GetBoundInstances()`.
3. We loop through each instance ID, get the actual instance using `player.GetInstance(id)`, and check if it's a heroic 25-man raid (using `instance.Is25ManRaid()`) and not Icecrown Citadel (by checking the map ID).
4. If the instance meets these criteria, we unbind the player from it using `player.UnbindInstance(instance)`.
5. After the loop, we call `player.UnbindAllInstances()` to unbind the player from any remaining non-ICC instances (such as 10-man raids or non-heroic difficulties).
6. Finally, we inform the player that they have been unbound from old instances using `player.SendBroadcastMessage()`.

This script helps keep the player's saved instance list clean and relevant as they progress to newer content.

## UnbindInstance
Unbinds the player from all instances they are bound to except for the instance they are currently in. When a player enters an instance, they become bound to it, which means they cannot enter a new instance of the same map. This method allows unbinding the player from instances they are bound to, allowing them to enter new instances.

### Parameters
* map (optional): number - The ID of the map to unbind the player from. If not provided, the player will be unbound from all instances except the one they are currently in.
* difficulty (optional): number - The difficulty of the instance to unbind the player from. This parameter is not used in WoW Classic.

### Example Usage
Unbind the player from all instances of a specific map when they leave a group:
```typescript
const GROUP_DISBANDED_EVENT = 1;
const DEADMINES_MAP_ID = 36;

const onGroupDisbanded: group_event_on_disband = (event: number, group: Group, player: Player) => {
    const instanceSave = player.GetInstanceSave();

    if (instanceSave) {
        const mapId = instanceSave.GetMapId();

        if (mapId === DEADMINES_MAP_ID) {
            player.UnbindInstance(DEADMINES_MAP_ID);
            player.SendBroadcastMessage("You have been unbound from the Deadmines instance.");
        }
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_DISBAND, (...args) => onGroupDisbanded(...args));
```

In this example, when a player's group is disbanded (event GROUP_EVENT_ON_DISBAND), the script checks if the player is saved to an instance. If the player is saved to an instance of the Deadmines (map ID 36), the script unbinds the player from that instance using the `UnbindInstance` method, allowing them to enter a new Deadmines instance. The player is then sent a broadcast message informing them that they have been unbound from the instance.

This can be useful in situations where players want to reset an instance and start fresh, or if they need to join a different group to complete the instance. By unbinding the player from the instance, they can enter a new instance of the same map without any restrictions.

Note that this script assumes the player is saved to a Deadmines instance. You can modify the script to handle other instances by checking for different map IDs and adjusting the broadcast message accordingly.

## UnsetKnownTitle
Removes a title by ID from the player's list of known titles. This can be useful for removing titles that are no longer available or for implementing custom title systems.

### Parameters
* titleId: number - The ID of the title to remove from the player's known titles.

### Example Usage
Suppose you want to create an event where players can lose titles based on certain conditions. In this example, we'll remove a title from a player if they die in a specific area.

```typescript
const AREA_ID = 1234; // Replace with the actual area ID
const TITLE_ID = 5678; // Replace with the actual title ID

const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: WorldObject) => {
    const playerMap = player.GetMapId();
    const playerArea = player.GetAreaId();

    if (playerMap === 0 && playerArea === AREA_ID) {
        if (player.HasTitle(TITLE_ID)) {
            player.UnsetKnownTitle(TITLE_ID);
            player.SendBroadcastMessage("You have lost the title due to your defeat in this area.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this script:
1. We define the `AREA_ID` and `TITLE_ID` constants to represent the specific area and title we're interested in.
2. We register the `PLAYER_EVENT_ON_DEATH` event to trigger our custom function `OnPlayerDeath` whenever a player dies.
3. Inside the `OnPlayerDeath` function, we retrieve the player's current map and area IDs using `GetMapId()` and `GetAreaId()` methods.
4. We check if the player is in the desired map (in this case, map 0) and specific area using the `AREA_ID` constant.
5. If the player is in the correct map and area, we check if they have the specified title using the `HasTitle()` method.
6. If the player has the title, we remove it using the `UnsetKnownTitle()` method and send a broadcast message to inform them about the title loss.

This script ensures that players lose the specified title when they die in the designated area. You can customize the conditions and actions based on your specific requirements.

Remember to replace `AREA_ID` and `TITLE_ID` with the actual IDs relevant to your game world and title system.

Note: Make sure to have the necessary permissions and consider any potential balance implications when removing titles from players programmatically.

## UpdateHonor
Updates the player's weekly honor status, calculating their standing ranks and honor points for the current week.

### Parameters
None

### Returns
None

### Example Usage
This example script will update the player's weekly honor status when they kill an enemy player, and then reward them with additional honor points based on their standing rank.

```typescript
const KILL_HONOR_BONUS = 100;

const OnPVPKill: player_event_on_kill_player = (event: number, killer: Player, killed: Player) => {
    // Update the killer's weekly honor status
    killer.UpdateHonor();

    // Get the killer's current honor points and standing rank
    const honorPoints = killer.GetHonorPoints();
    const standingRank = killer.GetHonorStandingRank();

    // Calculate the bonus honor points based on the standing rank
    let bonusHonor = 0;
    if (standingRank === 1) {
        bonusHonor = KILL_HONOR_BONUS * 3;
    } else if (standingRank <= 5) {
        bonusHonor = KILL_HONOR_BONUS * 2;
    } else if (standingRank <= 10) {
        bonusHonor = KILL_HONOR_BONUS;
    }

    // Add the bonus honor points to the killer
    if (bonusHonor > 0) {
        killer.ModifyHonorPoints(bonusHonor);
        killer.SendBroadcastMessage(`You have been awarded ${bonusHonor} bonus honor points for your outstanding performance!`);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, (...args) => OnPVPKill(...args));
```

In this example:
1. When a player kills another player, the `OnPVPKill` event is triggered.
2. The script calls `UpdateHonor()` to update the killer's weekly honor status.
3. It retrieves the killer's current honor points and standing rank using `GetHonorPoints()` and `GetHonorStandingRank()`.
4. Based on the standing rank, it calculates the bonus honor points to be awarded.
   - Rank 1 players receive a 3x bonus
   - Ranks 2-5 players receive a 2x bonus
   - Ranks 6-10 players receive a 1x bonus
   - Players below rank 10 receive no bonus
5. If bonus honor points are to be awarded, the script calls `ModifyHonorPoints()` to add the bonus to the killer's honor points.
6. Finally, it sends a broadcast message to the killer informing them of the bonus honor points awarded.

This script encourages players to strive for higher standing ranks by rewarding them with bonus honor points for kills, proportional to their current rank. It adds an extra layer of motivation and competition to the PvP system.

## Whisper
Sends a whisper message from the player to another player.

### Parameters
* text: string - The content of the whisper message
* lang: number - The language of the message (can be found in Language.h)
* receiver: [Player](./player.md) - The player to receive the whisper message
* guid: number - The GUID of the receiver player

### Example Usage:
Script that allows a player to whisper another player with a specific keyword and receive an automated response.
```typescript
const KEYWORD = "help";
const RESPONSE = "Sure, I can help you! What do you need assistance with?";
const LANG_UNIVERSAL = 0;

const HandleWhisper: player_event_on_whisper = (event: number, player: Player, msg: string, lang: Language, receiver: Player): void => {
    if (msg.toLowerCase() === KEYWORD) {
        const receiverGuid = receiver.GetGUID();
        player.Whisper(RESPONSE, LANG_UNIVERSAL, receiver, receiverGuid);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_WHISPER, (...args) => HandleWhisper(...args));
```

In this example:
1. We define constants for the keyword that triggers the automated response, the response message itself, and the language of the message (in this case, Universal).
2. We create a function `HandleWhisper` that handles the `PLAYER_EVENT_ON_WHISPER` event.
3. Inside the function, we check if the received message (`msg`) matches the defined `KEYWORD`. The comparison is done in lowercase to make it case-insensitive.
4. If the keyword matches, we retrieve the GUID of the receiver player using `receiver.GetGUID()`.
5. We then use the `Whisper` method of the `player` object to send the `RESPONSE` message to the `receiver` player, specifying the language as `LANG_UNIVERSAL` and providing the receiver's GUID.
6. Finally, we register the `HandleWhisper` function to be called whenever the `PLAYER_EVENT_ON_WHISPER` event occurs using `RegisterPlayerEvent`.

With this script, whenever a player whispers the keyword "help" to another player, the script will automatically respond with the message "Sure, I can help you! What do you need assistance with?" in the Universal language.

This example demonstrates how the `Whisper` method can be used in combination with player events to create interactive functionality based on player communication.

## Yell
Send a yell message from the player to nearby players.  These messages will appear in the chat window for other players that are nearby.  You can also specify a language to yell the text. 

### Parameters
* text: string - The text to send as the yell message
* lang: [Language](../Enums/Language.md) - The language to send the text as 

### Example Usage:
Have the player yell when they die with the number of their lifetime kills

```typescript
const YELL_RANGE = 100;

const OnPlayerDeath: player_event_on_player_kill = (event: number, killer: Player, killed: Player) => {
    if(killer.GetGUID() == killed.GetGUID()) {
        // Player killed themselves, don't yell
        return;
    }

    // Get lifetime kills
    const lifetimeKills = killed.GetUInt32Value(UnitFields.PLAYER_FIELD_LIFETIME_HONORABLE_KILLS);

    // Create yell message with lifetime kills
    const yellMessage = `I have been slain with ${lifetimeKills} lifetime kills!`;

    // Yell in common language
    killed.Yell(yellMessage, Language.LANG_UNIVERSAL);

    // Get nearby players
    const nearbyPlayers = killed.GetPlayersInRange(YELL_RANGE);

    // Send a whisper to all nearby players with the same message
    nearbyPlayers.forEach((player: Player) => {
        if(player.GetGUID() != killed.GetGUID()) {
            killed.Whisper(yellMessage, Language.LANG_UNIVERSAL, player);
        }        
    })
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILLED_BY_PLAYER, (...args) => OnPlayerDeath(...args));
```

In this example:
1. When a player is killed by another player the `OnPlayerDeath` function will be called. 
2. It will check if the killer and killed players are the same (suicide) and if so it will return early
3. The players lifetime kills will be retrieved
4. A yell message will be constructed with the lifetime kills included
5. The `Yell` method will be called with the message and the `LANG_UNIVERSAL` language (common tongue)
6. All players within `YELL_RANGE` of the killed player will be found
7. A whisper will be sent from the killed player to each nearby player with the same message.

This will allow you to broadcast a message not only to the nearby players, but also whisper that same message to them as well.

