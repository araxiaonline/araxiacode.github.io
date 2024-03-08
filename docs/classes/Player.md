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

