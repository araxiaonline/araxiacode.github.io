## AddLootMode
Adds a loot mode to the creature. Loot modes determine which loot table the creature will use when looted by players. Creatures can have multiple loot modes, which can be used to create different loot tables for different situations, such as normal or heroic dungeon difficulties.

### Parameters
* lootMode: number - The loot mode to add. Valid loot modes are defined in the LootModes enum.

### Example Usage
```typescript
const CREATURE_ENTRY_BOSS = 12345;
const LOOT_MODE_HEROIC = 1;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    if (creature.GetEntry() === CREATURE_ENTRY_BOSS) {
        const instanceDifficulty = creature.GetMap().GetDifficulty();

        if (instanceDifficulty === Maps.InstanceDifficulty.INSTANCE_DIFFICULTY_HEROIC) {
            creature.AddLootMode(LOOT_MODE_HEROIC);
        }

        const lootModes = creature.GetLootMode();
        const lootModesString = lootModes.map(mode => LootModes[mode]).join(', ');

        console.log(`Creature ${creature.GetName()} spawned with loot modes: ${lootModesString}`);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example:
1. We define constants for the creature entry and the desired loot mode (heroic).
2. In the `CREATURE_EVENT_ON_SPAWN` event, we check if the spawned creature has the specified entry.
3. If the creature is the boss we're interested in, we get the instance difficulty using `creature.GetMap().GetDifficulty()`.
4. If the instance difficulty is heroic, we add the `LOOT_MODE_HEROIC` loot mode to the creature using `creature.AddLootMode()`.
5. We then retrieve the current loot modes of the creature using `creature.GetLootMode()`, which returns an array of loot mode numbers.
6. We convert the loot mode numbers to their corresponding enum names using `LootModes[mode]` and join them into a string for logging purposes.
7. Finally, we log a message indicating the creature's name and its assigned loot modes.

This script ensures that when the specified boss creature spawns in a heroic difficulty instance, it will have the heroic loot mode added to its loot modes. This allows the creature to use a different loot table when killed on heroic difficulty, potentially offering better or additional loot compared to normal difficulty.

## AttackStart
Instructs the Creature to attack the specified target Unit. This will cause the Creature to enter combat with the target and begin auto-attacking.

### Parameters
- target: [Unit](./unit.md) - The Unit that the Creature should attack.

### Example Usage
This example demonstrates how to make a Creature attack a Player when the Player interacts with a GameObject.

```typescript
// Define the entry ID of the Creature and GameObject
const CREATURE_ENTRY = 12345;
const GAMEOBJECT_ENTRY = 54321;

// Event handler for when a Player uses a GameObject
const OnGameObjectUse: gameobject_event_on_use = (event: number, player: Player, gameObject: GameObject) => {
    // Check if the used GameObject matches the desired entry ID
    if (gameObject.GetEntry() === GAMEOBJECT_ENTRY) {
        // Find all Creatures with the specified entry ID within a 10-yard range of the GameObject
        const creatures = gameObject.GetCreaturesInRange(10, CREATURE_ENTRY);

        // Iterate over each found Creature
        for (const creature of creatures) {
            // Check if the Creature is alive and not already in combat
            if (creature.IsAlive() && !creature.IsInCombat()) {
                // Make the Creature attack the Player
                creature.AttackStart(player);

                // Optional: Make the Creature say something when attacking
                creature.SendUnitSay("You dare disturb me? Prepare to face my wrath!", 0);

                // Optional: Increase the Creature's movement speed and attack speed for a short duration
                creature.SetSpeed(CreatureSpeedType.CREATURE_SPEED_RUN, 2.5, true);
                creature.SetAttackTime(WeaponAttackType.BASE_ATTACK, 1500);

                // Optional: Adjust the Creature's threat towards the Player
                creature.AddThreat(player, 100);
            }
        }
    }
};

// Register the event handler for the GameObject use event
RegisterGameObjectEvent(GAMEOBJECT_ENTRY, GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, OnGameObjectUse);
```

In this example:
1. We define the entry IDs of the Creature and GameObject we want to interact with.
2. We register an event handler for the `GAMEOBJECT_EVENT_ON_USE` event, which triggers when a Player uses a GameObject.
3. Inside the event handler, we check if the used GameObject matches the desired entry ID.
4. If it does, we find all Creatures with the specified entry ID within a 10-yard range of the GameObject using `GetCreaturesInRange()`.
5. We iterate over each found Creature.
6. For each Creature, we check if it is alive and not already in combat using `IsAlive()` and `IsInCombat()`.
7. If the Creature meets the conditions, we make it attack the Player using `AttackStart()`.
8. Optionally, we can make the Creature say something when attacking using `SendUnitSay()`.
9. We can also adjust the Creature's movement speed and attack speed temporarily using `SetSpeed()` and `SetAttackTime()`.
10. Additionally, we can modify the Creature's threat towards the Player using `AddThreat()`.

This example showcases a more complex usage of the `AttackStart()` method, where a Creature is triggered to attack a Player based on an interaction with a GameObject, and various optional enhancements are applied to the Creature's behavior during the attack.

## BotEquipItem
Equip an item to a bot in a given equipment slot. This method accepts either an Item object or the entry ID of the item as a number. If the item is successfully equipped, the method will return true, otherwise it will return false.

### Parameters
- item: [Item](./item.md) | number - The item to equip. Can be an Item object or the entry ID of the item as a number.
- slot: [BotEquipmentSlot](./bot-equipment-slot.md) - The equipment slot to equip the item in.

### Returns
- boolean - Returns true if the item was successfully equipped, false otherwise.

### Example Usage
In this example, we will equip a bot with a specific weapon and a piece of armor when it is spawned.

```typescript
const WEAPON_ENTRY_ID = 12345;
const ARMOR_ENTRY_ID = 67890;

const onBotSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    // Check if the spawned creature is a bot
    if (creature.IsBot()) {
        // Equip a weapon to the main hand slot
        const weaponEquipped = creature.BotEquipItem(WEAPON_ENTRY_ID, BotEquipmentSlot.MAIN_HAND);
        
        if (weaponEquipped) {
            console.log("Bot equipped with weapon in main hand slot.");
        } else {
            console.log("Failed to equip weapon in main hand slot.");
        }

        // Create an armor item object
        const armorItem = creature.AddItem(ARMOR_ENTRY_ID, 1);

        if (armorItem) {
            // Equip the armor item to the chest slot
            const armorEquipped = creature.BotEquipItem(armorItem, BotEquipmentSlot.CHEST);

            if (armorEquipped) {
                console.log("Bot equipped with armor in chest slot.");
            } else {
                console.log("Failed to equip armor in chest slot.");
            }
        } else {
            console.log("Failed to create armor item.");
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onBotSpawn(...args));
```

In this script, when a bot is spawned, we first attempt to equip a weapon to the main hand slot using the weapon's entry ID. We check the return value of `BotEquipItem` to determine if the weapon was successfully equipped and log a message accordingly.

Next, we create an armor item object using the `AddItem` method and the armor's entry ID. If the item is successfully created, we attempt to equip it to the chest slot using `BotEquipItem` and the armor item object. Again, we check the return value to determine if the armor was successfully equipped and log a message.

By using `BotEquipItem`, we can easily equip specific items to a bot's equipment slots, either by using the item's entry ID or an Item object. This allows us to customize the bot's equipment based on our needs.

## BotCanEquipItem
This method checks if the creature (assuming it's a bot) can equip a specific item in a given equipment slot.

### Parameters
- item: number - The entry ID of the item to check.
- slot: [BotEquipmentSlot](./bot-equipment-slot.md) - The equipment slot to check.

### Returns
- boolean - Returns true if the bot can equip the item in the specified slot, false otherwise.

### Example Usage
In this example, we have a script that checks if a bot can equip a specific weapon and a specific armor piece. If the bot can equip both items, it will receive a bonus item as a reward.

```typescript
const WEAPON_ITEM_ENTRY = 30442;
const ARMOR_ITEM_ENTRY = 30443;
const BONUS_ITEM_ENTRY = 30444;

const CheckBotEquipment = (event: number, creature: Creature) => {
    // Check if the creature is a bot
    if (creature.IsBot()) {
        // Check if the bot can equip the weapon in the main hand slot
        const canEquipWeapon = creature.BotCanEquipItem(WEAPON_ITEM_ENTRY, BotEquipmentSlot.SLOT_MAIN_HAND);

        // Check if the bot can equip the armor in the chest slot
        const canEquipArmor = creature.BotCanEquipItem(ARMOR_ITEM_ENTRY, BotEquipmentSlot.SLOT_CHEST);

        // If the bot can equip both items
        if (canEquipWeapon && canEquipArmor) {
            // Add the bonus item to the bot's inventory
            const bonusItem = creature.BotAddItem(BONUS_ITEM_ENTRY);

            // Check if the bonus item was successfully added
            if (bonusItem) {
                // Equip the bonus item in the trinket slot
                creature.BotEquipItemInSlot(BotEquipmentSlot.SLOT_TRINKET1, bonusItem);
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, CheckBotEquipment);
```

In this script:
1. We define the entry IDs for the weapon, armor, and bonus items.
2. We register a creature event handler for the `CREATURE_EVENT_ON_SPAWN` event.
3. Inside the event handler, we first check if the creature is a bot using the `IsBot()` method.
4. If it is a bot, we use the `BotCanEquipItem()` method to check if the bot can equip the weapon in the main hand slot and the armor in the chest slot.
5. If the bot can equip both items, we add the bonus item to the bot's inventory using the `BotAddItem()` method.
6. If the bonus item was successfully added, we equip it in the trinket slot using the `BotEquipItemInSlot()` method.

This script demonstrates how to use the `BotCanEquipItem()` method to check if a bot can equip specific items in different slots and perform actions based on the results.

## BotUnequipBotItem
Unequips an item from a bot in a given equipment slot. If successful, the function will return true.

### Parameters
* slot: number - The equipment slot to unequip the item from. Use the BotEquipmentSlot enum for valid slot values.

### Returns
* boolean - Returns true if the item was successfully unequipped, false otherwise.

### Example Usage
This example demonstrates how to unequip a bot's main-hand weapon when the bot is dismissed by the player.

```typescript
const MAINHAND_SLOT = 0;

const OnBotDismiss: player_event_on_bot_dismiss = (event: number, player: Player, bot: Creature): void => {
    // Check if the bot has a main-hand weapon equipped
    const mainHandItem = bot.GetBotEquipmentItemId(MAINHAND_SLOT);
    if (mainHandItem !== 0) {
        // Unequip the main-hand weapon
        const success = bot.BotUnequipBotItem(MAINHAND_SLOT);
        if (success) {
            // Add the unequipped item to the player's inventory
            const itemEntry = bot.GetBotEquipmentItemId(MAINHAND_SLOT);
            player.AddItem(itemEntry, 1);
            player.SendBroadcastMessage(`Your bot's main-hand weapon has been unequipped and added to your inventory.`);
        } else {
            player.SendBroadcastMessage(`Failed to unequip your bot's main-hand weapon.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BOT_DISMISS, (...args) => OnBotDismiss(...args));
```

In this example:
1. We define the `MAINHAND_SLOT` constant with a value of 0, representing the main-hand equipment slot.
2. Inside the `OnBotDismiss` event handler, we first check if the bot has a main-hand weapon equipped using `GetBotEquipmentItemId()`.
3. If a main-hand weapon is equipped (i.e., `mainHandItem` is not 0), we attempt to unequip it using `BotUnequipBotItem()`.
4. If the unequip operation is successful (`success` is true), we retrieve the item entry of the unequipped weapon using `GetBotEquipmentItemId()`.
5. We then add the unequipped item to the player's inventory using `player.AddItem()`, passing the item entry and a quantity of 1.
6. Finally, we send a broadcast message to the player indicating that the bot's main-hand weapon has been unequipped and added to their inventory.
7. If the unequip operation fails, we send a broadcast message to the player indicating the failure.

This example showcases a practical use case for `BotUnequipBotItem()` in a bot dismissal event, where the bot's main-hand weapon is unequipped and given to the player upon dismissal.

## CallAssistance
Make the [Creature] call for assistance in combat from other nearby [Creature]s. This will cause any nearby friendly creatures to aggro and attack the same target that the creature is currently engaged with.

### Example Usage:
Create a script for a rare spawn creature that calls for assistance when engaged in combat.
```typescript
const RARE_SPAWN_ENTRY = 6666;
const CALL_ASSIST_PERCENT_HP = 40;

const CreatureOnCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit): void => {
    if (creature.GetEntry() === RARE_SPAWN_ENTRY) {
        const creatureHealthPct = creature.GetHealthPct();
        if (creatureHealthPct <= CALL_ASSIST_PERCENT_HP) {
            // Rare spawn creature calls for assistance when its health drops below 40%
            creature.CallAssistance();

            // Rare spawn creature also increases its attack speed and damage dealt
            creature.SetAttackTime(WeaponAttackType.BASE_ATTACK, creature.GetBaseAttackTime(WeaponAttackType.BASE_ATTACK) * 0.8);
            creature.SetBaseWeaponDamage(WeaponAttackType.BASE_ATTACK, MINDAMAGE, creature.GetBaseWeaponDamage(WeaponAttackType.BASE_ATTACK, MINDAMAGE) * 1.2);
            creature.SetBaseWeaponDamage(WeaponAttackType.BASE_ATTACK, MAXDAMAGE, creature.GetBaseWeaponDamage(WeaponAttackType.BASE_ATTACK, MAXDAMAGE) * 1.2);

            // Rare spawn creature also casts a self-buff to increase its defenses
            creature.CastSpell(creature, 12544, true);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => CreatureOnCombat(...args));
```
In this example:
1. We define constants for the rare spawn creature's entry ID and the health percentage threshold at which it will call for assistance.
2. In the `CreatureOnCombat` event handler, we check if the creature's entry ID matches the rare spawn entry.
3. If the creature's health percentage drops below the specified threshold (`CALL_ASSIST_PERCENT_HP`), it calls for assistance using `creature.CallAssistance()`.
4. Additionally, when calling for assistance, the rare spawn creature increases its attack speed by reducing the base attack time by 20% using `creature.SetAttackTime()`.
5. The rare spawn creature also increases its minimum and maximum base weapon damage by 20% using `creature.SetBaseWeaponDamage()`.
6. Finally, the rare spawn creature casts a self-buff spell (ID: 12544) to increase its defenses using `creature.CastSpell()`.

This script demonstrates how a rare spawn creature can call for assistance when its health drops below a certain threshold, while also enhancing its combat abilities and defenses to make the encounter more challenging for players.

## CallForHelp
This method will cause the Creature to call for help from nearby friendly Creatures within the specified radius when engaged in combat. The nearby friendly Creatures will then assist the calling Creature in combat against its attacker(s).

### Parameters
* radius: number - The radius in yards within which to search for nearby friendly Creatures to call for help.

### Example Usage
In this example, we create a custom AI script for a Creature that calls for help from nearby friendly Creatures within a radius of 20 yards whenever it enters combat. The nearby Creatures will then assist in combat until the original Creature is no longer in combat or until they die.

```typescript
const CreatureEntry = 1234; // Replace with the appropriate Creature entry ID

const CreatureAI: creature_scripts = {
    // Called when the Creature enters combat
    OnEnterCombat: (creature: Creature, target: Unit) => {
        // Call for help from friendly Creatures within a 20 yard radius
        creature.CallForHelp(20);
    },

    // Called when the Creature leaves combat
    OnLeaveCombat: (creature: Creature) => {
        // Reset the Creature's AI and clear its threat list
        creature.ClearThreatList();
        creature.SetDefaultMovementType();
    },

    // Called when the Creature dies
    OnDied: (creature: Creature, killer: Unit) => {
        // Handle any additional logic when the Creature dies
    },

    // Called when the Creature kills a player
    OnKilledPlayer: (creature: Creature, player: Player) => {
        // Handle any additional logic when the Creature kills a player
    }
};

// Register the custom AI script for the specified Creature entry
RegisterCreatureAI(CreatureEntry, CreatureAI);
```

In this script, we define a custom AI for the Creature using the `creature_scripts` object. The `OnEnterCombat` function is called whenever the Creature enters combat, and it invokes the `CallForHelp` method with a radius of 20 yards. This will cause nearby friendly Creatures within that radius to assist the original Creature in combat.

The script also includes additional functions such as `OnLeaveCombat`, `OnDied`, and `OnKilledPlayer` to handle other events related to the Creature's behavior in combat.

By registering this custom AI script using `RegisterCreatureAI`, it will be applied to the specified Creature entry, overriding its default AI behavior.

Note: Make sure to replace `CreatureEntry` with the appropriate Creature entry ID from the `creature_template` table in the AzerothCore database.

This example demonstrates how the `CallForHelp` method can be used in conjunction with other Creature events and behaviors to create a more dynamic and interactive combat experience in your custom scripts.

## CanAggro
This method determines whether the creature is capable of engaging in combat with nearby hostile units. It takes into account various factors such as the creature's AI, its current state, and any scripted behavior that may prevent or enable aggression.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the creature can start attacking nearby hostile units, and `false` otherwise.

### Example Usage
In this example, we have a custom AI script for a creature that behaves differently based on its health percentage. If the creature's health is above 50%, it will aggressively attack nearby hostile units. However, if its health drops below 50%, it will become passive and attempt to flee from combat.

```typescript
const CREATURE_ENTRY = 1234;

const CreatureAI: creature_event_on_ai_update = (event: number, creature: Creature, diff: number) => {
    if (!creature.IsInCombat()) {
        // Creature is not in combat, check for nearby hostile units
        const hostileUnits = creature.GetAITargets(Targets.UNIT_HOSTILE_IN_LOS);

        if (hostileUnits.length > 0 && creature.HealthAbovePct(50) && creature.CanAggro()) {
            // Creature has more than 50% health and can aggro
            // Select a random hostile unit to attack
            const target = hostileUnits[Math.floor(Math.random() * hostileUnits.length)];
            creature.AttackStart(target);
        }
    } else {
        // Creature is in combat
        if (creature.HealthBelowPct(50)) {
            // Creature's health is below 50%
            if (creature.IsFleeing()) {
                // Creature is already fleeing, continue fleeing
                creature.SetWalk(false);
                creature.MoveTo(creature.GetX() + 10, creature.GetY() + 10, creature.GetZ(), true);
            } else if (creature.CanAggro()) {
                // Creature can still aggro, start fleeing
                creature.SetFleeing(true);
                creature.SetWalk(false);
                creature.MoveTo(creature.GetX() + 10, creature.GetY() + 10, creature.GetZ(), true);
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_AI_UPDATE, (...args) => CreatureAI(...args));
```

In this script, we first check if the creature is not in combat. If it's not in combat and has more than 50% health, we retrieve nearby hostile units using `GetAITargets(Targets.UNIT_HOSTILE_IN_LOS)`. If there are hostile units and the creature can aggro (determined by `CanAggro()`), we randomly select a target and initiate an attack using `AttackStart(target)`.

If the creature is already in combat and its health drops below 50%, we check if it's already fleeing. If it's not fleeing and can still aggro, we set the creature to start fleeing by calling `SetFleeing(true)`, disable walking animation with `SetWalk(false)`, and move the creature away from its current position using `MoveTo()`.

This example demonstrates how the `CanAggro()` method can be used in combination with other methods and conditions to define custom AI behavior for creatures based on their current state and circumstances.

## CanAssistTo
The `CanAssistTo` method determines if the [Creature] is capable of assisting the specified `friend` [Unit](./unit.md) in combat against the specified `enemy` [Unit](./unit.md). This method takes into account various factors such as the creature's faction, current combat state, and the relationship between the `friend` and `enemy` units.

### Parameters
- `friend`: [Unit](./unit.md) - The unit that the creature is potentially assisting.
- `enemy`: [Unit](./unit.md) - The unit that the `friend` is in combat with.
- `checkFaction`: boolean (optional) - If set to `true`, the method will perform additional faction checks. Default value is `true`.

### Returns
- boolean: Returns `true` if the creature can assist the `friend` against the `enemy`, and `false` otherwise.

### Example Usage
In this example, we have a script that handles the `CREATURE_EVENT_ON_ATTACKED` event. When a creature is attacked, the script checks if there are any nearby friendly creatures that can assist the attacked creature in combat against the attacker.

```typescript
const FRIENDLY_CREATURE_ENTRY = 12345;
const ASSISTANCE_RANGE = 10;

const onCreatureAttacked: creature_event_on_attacked = (event: CreatureEvents, creature: Creature, attacker: Unit) => {
    const nearbyCreatures = creature.GetCreaturesInRange(ASSISTANCE_RANGE, FRIENDLY_CREATURE_ENTRY);

    nearbyCreatures.forEach((nearbyCreature) => {
        if (nearbyCreature.CanAssistTo(creature, attacker)) {
            nearbyCreature.AttackStart(attacker);
            nearbyCreature.SendChatMessage(ChatMsg.CHAT_MSG_MONSTER_SAY, 0, "I will assist you, friend!");
        }
    });
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_ATTACKED, (event, creature, attacker) => onCreatureAttacked(event, creature, attacker));
```

In this script:
1. We define constants for the friendly creature entry and the assistance range.
2. When a creature is attacked, the script retrieves all nearby creatures with the specified entry within the assistance range using the `GetCreaturesInRange` method.
3. For each nearby creature, we use the `CanAssistTo` method to check if it can assist the attacked creature against the attacker.
4. If the nearby creature can assist, it starts attacking the attacker using the `AttackStart` method and sends a chat message indicating its assistance.

By using the `CanAssistTo` method, we ensure that only eligible creatures will come to the aid of the attacked creature, based on factors like faction and combat state. This creates a more dynamic and immersive combat experience in the game.

## CanCompleteQuest
Returns true if the Creature can be used to complete the quest with the provided quest ID for the player.

### Parameters
questID: number - The ID of the quest to check completion status.

### Returns
boolean - Returns true if the Creature completes the quest, otherwise returns false.

### Example Usage
This example will check if the creature can complete the quest "Werewolf Whistle" from the quest_template table, and if so, it will reward the player with additional gold and a follow up quest.
```typescript
// questID for "Werewolf Whistle"
const WEREWOLF_WHISTLE_QUEST_ID = 1918; 
// questID for followup "Pristine Yeti Hide"
const PRISTINE_YETI_HIDE_QUEST_ID = 1919;
const GOLD_REWARD = 1000;
const onQuestAccept: player_event_on_quest_accept = (event: PlayerEvents, player: Player, questID: number) => {
    const creature = player.GetQuestGiver();
    if(creature && creature.CanCompleteQuest(WEREWOLF_WHISTLE_QUEST_ID)){
        player.SetMoney(player.GetMoney() + GOLD_REWARD);
        // complete quest for Werewolf Whistle
        player.CompleteQuest(WEREWOLF_WHISTLE_QUEST_ID);
        // check if player is high enough level for follow up quest
        if(player.GetLevel() >= 60) {
            player.AddQuest(PRISTINE_YETI_HIDE_QUEST_ID);
        }
    }
}
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_ACCEPT, (...args) => onQuestAccept(...args));
```

## CanFly
Returns a boolean value indicating whether the Creature is capable of flying or not.

### Parameters
None

### Returns
boolean - Returns `true` if the Creature can fly, `false` otherwise.

### Example Usage
This example demonstrates how to check if a Creature can fly and apply a flying mount aura if it can.

```typescript
const CREATURE_ENTRY = 1234;
const FLYING_MOUNT_AURA = 5678;

const ApplyFlyingAura = (creature: Creature) => {
    if (creature.CanFly()) {
        creature.AddAura(FLYING_MOUNT_AURA, creature);
        creature.SetHover(true);
        creature.SetDisableGravity(true);
        creature.SetSpeed(CreatureMovementType.MOVE_FLIGHT, 5.0);
    } else {
        console.log(`Creature with entry ${creature.GetEntry()} cannot fly.`);
    }
};

const OnCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        ApplyFlyingAura(creature);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (event, creature) => {
    OnCreatureSpawn(event, creature);
});
```

In this example:
1. We define the `CREATURE_ENTRY` constant to specify the entry of the Creature we want to check for flying capability.
2. We define the `FLYING_MOUNT_AURA` constant to specify the aura ID that represents a flying mount effect.
3. The `ApplyFlyingAura` function takes a Creature object as a parameter and checks if it can fly using the `CanFly()` method.
   - If the Creature can fly, it applies the flying mount aura using `AddAura()`, sets the hover state using `SetHover(true)`, disables gravity using `SetDisableGravity(true)`, and sets the flight speed using `SetSpeed()` with the `CreatureMovementType.MOVE_FLIGHT` parameter.
   - If the Creature cannot fly, it logs a message indicating that the Creature with the given entry cannot fly.
4. The `OnCreatureSpawn` function is an event handler for the `CREATURE_EVENT_ON_SPAWN` event. It checks if the spawned Creature has the specified `CREATURE_ENTRY` and calls the `ApplyFlyingAura` function if it matches.
5. Finally, we register the `OnCreatureSpawn` event handler using `RegisterCreatureEvent` to handle the `CREATURE_EVENT_ON_SPAWN` event.

This example showcases how to utilize the `CanFly()` method to determine if a Creature is capable of flying and apply appropriate effects or modifications based on that information.

## CanStartAttack
This method checks if the Creature can start attacking the specified target Unit. It takes into account various factors such as the Creature's current state, its AI, and the target's status. This method is useful for controlling the behavior of Creatures and determining if they should initiate combat with a specific target.

### Parameters
- `target`: [Unit](./unit.md) - The target Unit that the Creature wants to start attacking.
- `force`: boolean (optional) - If set to true, it will force the Creature to start attacking the target regardless of other conditions. Default is false.

### Returns
- boolean: Returns true if the Creature can start attacking the specified target, false otherwise.

### Example Usage
In this example, we have a custom AI script for a Creature that checks if it can start attacking nearby players who have a specific item in their inventory. If the player has the item and the Creature can start attacking, it will initiate combat.

```typescript
const CREATURE_ENTRY = 1234;
const TRIGGER_ITEM_ENTRY = 5678;

const CreatureAI: creature_event_on_aiupdate = (event: number, creature: Creature, diff: number) => {
    // Check if the Creature is already in combat
    if (creature.IsInCombat()) {
        return;
    }

    // Get nearby players within a certain range
    const nearbyPlayers = creature.GetPlayersInRange(10);

    // Iterate through the nearby players
    for (const player of nearbyPlayers) {
        // Check if the player has the trigger item in their inventory
        if (player.HasItem(TRIGGER_ITEM_ENTRY)) {
            // Check if the Creature can start attacking the player
            if (creature.CanStartAttack(player)) {
                // Start attacking the player
                creature.AttackStart(player);
                creature.Say(`You dare bring the ${creature.GetItemLink(TRIGGER_ITEM_ENTRY)} into my presence? Prepare to face my wrath!`);
                break;
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_AIUPDATE, (...args) => CreatureAI(...args));
```

In this script, the Creature checks if it is already in combat. If not, it retrieves nearby players within a range of 10 yards using the `GetPlayersInRange` method. It then iterates through the nearby players and checks if each player has the specified trigger item in their inventory using the `HasItem` method.

If a player is found with the trigger item, the script uses the `CanStartAttack` method to determine if the Creature can start attacking that player. If the Creature can start attacking, it initiates combat with the player using the `AttackStart` method and sends a threatening message using the `Say` method.

This script demonstrates how the `CanStartAttack` method can be used in combination with other methods and conditions to create dynamic AI behavior for Creatures based on specific triggers or criteria.

## CanSwim
Returns whether the Creature is able to move through deep water or not.

### Parameters
None

### Returns
boolean - Returns `true` if the Creature can move through deep water, `false` otherwise.

### Example Usage
This example demonstrates how to use the `CanSwim()` method to check if a Creature can swim and perform actions based on the result.

```typescript
const CREATURE_ENTRY_MURLOC = 123; // Replace with the actual entry ID of the murloc creature

const OnCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY_MURLOC) {
        if (creature.CanSwim()) {
            // Murloc can swim, so make it move towards the nearest water source
            const nearestWater = creature.FindNearestGameObject(/* Game Object Entry for Water Source */);
            if (nearestWater) {
                creature.MoveTo(nearestWater.GetX(), nearestWater.GetY(), nearestWater.GetZ(), true);
            }
        } else {
            // Murloc cannot swim, so make it stay on land
            const nearestLand = creature.FindNearestGameObject(/* Game Object Entry for Land */);
            if (nearestLand) {
                creature.MoveTo(nearestLand.GetX(), nearestLand.GetY(), nearestLand.GetZ(), true);
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, OnCreatureSpawn);
```

In this example:
1. We define the entry ID of the murloc creature as `CREATURE_ENTRY_MURLOC`.
2. We register a creature spawn event using `RegisterCreatureEvent` with the event type `CreatureEvents.CREATURE_EVENT_ON_SPAWN` and the event handler function `OnCreatureSpawn`.
3. Inside the event handler, we check if the spawned creature's entry matches the murloc entry ID using `creature.GetEntry()`.
4. If it is a murloc, we use `creature.CanSwim()` to determine if the murloc can swim.
   - If the murloc can swim, we find the nearest water source game object using `creature.FindNearestGameObject()` and make the murloc move towards it using `creature.MoveTo()`.
   - If the murloc cannot swim, we find the nearest land game object and make the murloc move towards it.
5. The `true` parameter in `creature.MoveTo()` indicates that the movement should be a forced movement, meaning the creature will move directly to the specified coordinates without considering pathfinding or obstacles.

Note: Make sure to replace `/* Game Object Entry for Water Source */` and `/* Game Object Entry for Land */` with the actual game object entry IDs representing water sources and land in your game.

This example showcases how you can use the `CanSwim()` method to determine if a creature can swim and take appropriate actions based on the result, such as making murlocs move towards water if they can swim or stay on land if they cannot.

## CanWalk
Returns a boolean value indicating whether the Creature can move on land or not.

### Parameters
None

### Returns
boolean - Returns `true` if the Creature can move on land, `false` otherwise.

### Example Usage
This example demonstrates how to use the `CanWalk()` method to determine if a Creature can move on land, and then sets its movement type accordingly.

```typescript
const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    const canWalk = creature.CanWalk();

    if (canWalk) {
        // If the Creature can walk on land, set its movement type to random movement
        creature.SetDefaultMovementType(0);
        creature.SetWanderRadius(10);
        creature.SetWalkRandomly(true);
    } else {
        // If the Creature cannot walk on land, set its movement type to idle
        creature.SetDefaultMovementType(1);
        creature.SetWanderRadius(0);
        creature.SetWalkRandomly(false);
    }

    // Set the Creature's spawn position and respawn time
    creature.SetRespawnDelay(30);
    creature.SetHomePosition(creature.GetX(), creature.GetY(), creature.GetZ(), creature.GetO());

    // Enable the Creature's movement and set it to active
    creature.SetMovementEnabled(true);
    creature.SetActive(true);
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example, when a Creature spawns, the script checks if it can walk on land using the `CanWalk()` method. If the Creature can walk, it sets the Creature's movement type to random movement within a wander radius of 10 units. If the Creature cannot walk, it sets the movement type to idle and disables random movement.

Regardless of whether the Creature can walk or not, the script sets the Creature's spawn position and respawn time using `SetHomePosition()` and `SetRespawnDelay()`. Finally, it enables the Creature's movement and sets it to active using `SetMovementEnabled()` and `SetActive()`.

This script ensures that spawned Creatures have appropriate movement behavior based on their ability to walk on land, and sets up their respawn behavior correctly.

## DespawnOrUnsummon
This method will despawn the current creature making it no longer visible or accessible to players after a given time delay if provided.

### Parameters
* delay?: number - (Optional) The time delay in milliseconds before despawning the creature. If no delay is provided, the creature will despawn immediately.

### Example Usage
Despawn a creature after a certain amount of time has passed since it has been engaged in combat.
```typescript
let DESPAWN_TIMER = 5 * 60 * 1000; // 5 minutes
let creature: Creature;

const OnEnterCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit) => {
    creature.RegisterEvent(DespawnCreature, DESPAWN_TIMER, 1, creature);
}

const DespawnCreature: timed_event = (event: number, delay: number, repeats: number, creature: Creature) => {
    if (!creature.IsInCombat()) {
        creature.DespawnOrUnsummon(0);
    }
}

RegisterCreatureEvent(NPC_ENTRY, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, OnEnterCombat);
```

In this example, when the creature enters combat, it registers a timed event that will check if the creature is still in combat after 5 minutes. If the creature is no longer in combat, it will despawn immediately using `DespawnOrUnsummon(0)`. 

This can be useful for situations where you want to clean up creatures that may have been engaged in combat but the encounter was abandoned, preventing them from remaining in the world indefinitely.

It's important to note that despawning a creature will remove it from the game world entirely, including any loot or other interactable elements associated with it. If you need to temporarily remove a creature from the game world but want to preserve its state, you can use the `SetPhaseMask` method instead to move it to a different phase.

## FleeToGetAssistance
Makes the creature flee combat to get assistance from a nearby friendly creature.

When a creature is in combat and needs help, it can use this method to flee and find a nearby friendly creature to assist in combat. The creature will run towards the friendly creature and once it reaches a certain distance, the friendly creature will join the combat and help fight the original creature's target.

### Parameters
None

### Returns
None

### Example Usage
In this example, we have a script for a creature that will flee to get assistance when its health drops below 50%. The creature will also yell for help to let nearby friendly creatures know it needs assistance.

```typescript
const CREATURE_ENTRY = 1234;
const FLEE_HEALTH_PERCENTAGE = 50;

const CreatureHealthCheck: creature_event_on_damage_taken = (event: number, creature: Creature, damage: number, attacker: Unit) => {
    const healthPercent = creature.GetHealthPct();

    if (healthPercent <= FLEE_HEALTH_PERCENTAGE && !creature.IsFleeing() && !creature.IsCasting()) {
        creature.YellToZone(`Help! I am under attack! Someone assist me!`, 0);
        creature.FleeToGetAssistance();

        // Set a timer to check if the creature has reached a friendly creature
        // If not, it will keep running until it finds one or dies
        let checkAssistanceTimer = 0;
        const maxChecks = 10;
        let checksPerformed = 0;

        const assistanceCheckTimerId = CreateTimer(checkAssistanceTimer, () => {
            if (creature && creature.IsAlive() && creature.IsFleeing() && checksPerformed < maxChecks) {
                if (creature.IsInCombat()) {
                    // Creature has reached a friendly creature and is getting assistance
                    creature.MonsterSay("Thank you for your assistance!", 0);
                    DestroyTimer(assistanceCheckTimerId);
                } else {
                    // Creature is still fleeing, check again in 1 second
                    checkAssistanceTimer = 1000;
                    checksPerformed++;
                }
            } else {
                // Creature has reached the maximum number of checks or is no longer fleeing
                DestroyTimer(assistanceCheckTimerId);
            }
        }, checkAssistanceTimer);
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_DAMAGE_TAKEN, (...args) => CreatureHealthCheck(...args));
```

In this script, when the creature's health drops below 50%, it will start fleeing to get assistance. It will also yell to the zone to let nearby friendly creatures know it needs help. A timer is then set up to check periodically if the creature has reached a friendly creature and is getting assistance. If the creature is still fleeing after a certain number of checks, it will keep running until it either finds assistance or dies. Once the creature gets assistance, it will thank the friendly creature for helping.

## GetAIName
Returns the name of the AI that is assigned to the Creature. This can be useful for determining if a creature is using a custom AI or one of the default AI's included in the core. 

### Parameters
None

### Returns
string: The name of the AI being used by the Creature

### Example Usage
```typescript
const DEATH_KNIGHT_INITIATE_ENTRY = 28406;

function FixDeathKnightInitiateAI(creature: Creature) {
    const ai = creature.GetAIName();

    if (ai === 'DeathKnightInitiateAI') {
        // Replace the default Death Knight Initiate AI with a custom one
        const script = `
            local DeathKnightInitiate = {};

            function DeathKnightInitiate.OnCombat(event, creature, target)
                creature:RegisterEvent(DeathKnightInitiate.CastIcyTouch, 5000, 0)
                creature:RegisterEvent(DeathKnightInitiate.CastPlagueStrike, 8000, 0)
            end

            function DeathKnightInitiate.CastIcyTouch(event, delay, pCall, creature)
                if (not creature:IsCasting()) then
                    creature:CastSpell(creature:GetVictim(), 52372, true)
                end
            end

            function DeathKnightInitiate.CastPlagueStrike(event, delay, pCall, creature)
                if (not creature:IsCasting()) then
                    creature:CastSpell(creature:GetVictim(), 52373, true)
                end
            end

            function DeathKnightInitiate.OnLeaveCombat(event, creature)
                creature:RemoveEvents()
            end

            function DeathKnightInitiate.OnDied(event, creature, killer)
                creature:RemoveEvents()
            end

            RegisterCreatureEvent(${DEATH_KNIGHT_INITIATE_ENTRY}, 1, DeathKnightInitiate.OnCombat)
            RegisterCreatureEvent(${DEATH_KNIGHT_INITIATE_ENTRY}, 2, DeathKnightInitiate.OnLeaveCombat)
            RegisterCreatureEvent(${DEATH_KNIGHT_INITIATE_ENTRY}, 4, DeathKnightInitiate.OnDied)
        `;

        creature.RegisterAIUpdate(script, 1000);
    }
}

function OnCreatureSpawn(event: number, creature: Creature) {
    if (creature.GetEntry() === DEATH_KNIGHT_INITIATE_ENTRY) {
        FixDeathKnightInitiateAI(creature);
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => OnCreatureSpawn(...args));
```

In this example, we register a script to the `CREATURE_EVENT_ON_SPAWN` event that checks if the spawned creature is a Death Knight Initiate. If it is, we call the `FixDeathKnightInitiateAI` function which checks the creature's current AI name using `GetAIName()`. 

If the AI name matches the default AI for Death Knight Initiates, we replace it with a custom AI script that casts Icy Touch every 5 seconds and Plague Strike every 8 seconds while in combat. The custom AI is registered using `RegisterAIUpdate` which will execute the script every second.

## GetAITarget

Selects a target from the creature's threat list based on the supplied arguments. This method provides flexibility in selecting targets based on various criteria such as aggro level, distance, and aura.

### Parameters
- `targetType`: [SelectAggroTarget](../enums/SelectAggroTarget.md) - Specifies the type of target selection. Valid options are:
  - `SELECT_TARGET_RANDOM`: Selects a random target from the threat list.
  - `SELECT_TARGET_TOPAGGRO`: Selects targets from top aggro to bottom.
  - `SELECT_TARGET_BOTTOMAGGRO`: Selects targets from bottom aggro to top.
  - `SELECT_TARGET_NEAREST`: Selects the nearest target.
  - `SELECT_TARGET_FARTHEST`: Selects the farthest target.
- `playerOnly`: boolean (optional) - If set to true, only player targets will be considered. Default is false.
- `position`: number (optional) - Specifies the position of the target in the threat list. Default is 0 (first target).
- `distance`: number (optional) - Specifies the maximum distance in yards to consider targets. Default is 0 (no distance limit).
- `aura`: number (optional) - Specifies the aura ID that the target must have. Default is 0 (no aura requirement).

### Returns
- [Unit](./Unit.md) - The selected target unit, or nil if no suitable target is found.

### Example Usage

```typescript
const SPELL_CORRUPTED_BLOOD = 24328;
const AGGRO_RANGE = 50;

// Custom AI script for a creature
const myCreatureAI: CreatureAI = {
    // ... other AI methods ...

    OnThreatlistUpdate: function (this: Creature, threatlist: HateList) {
        // Select the third-farthest player within 50 yards that has the "Corrupted Blood" aura
        const target = this.GetAITarget(SelectAggroTarget.SELECT_TARGET_FARTHEST, true, 3, AGGRO_RANGE, SPELL_CORRUPTED_BLOOD);

        if (target) {
            // Found a suitable target, initiate combat or perform specific actions
            this.MovementInform(MovementGeneratorType.CHASE, target);
            this.CastSpell(target, SPELL_ATTACK, false);
        } else {
            // No suitable target found, clear combat and return to initial position
            this.ClearThreatList();
            this.MovementInform(MovementGeneratorType.HOME, this);
        }
    },

    // ... other AI methods ...
};

// Register the custom AI for the creature with ID 12345
RegisterCreatureAI(12345, myCreatureAI);
```

In this example, we have a custom AI script for a creature. When the creature's threat list is updated (`OnThreatlistUpdate` method), it selects the third-farthest player target within 50 yards that has the "Corrupted Blood" aura (ID 24328) using the `GetAITarget` method.

If a suitable target is found, the creature initiates combat by chasing the target (`MovementInform` method) and casting an attack spell (`CastSpell` method).

If no suitable target is found, the creature clears its threat list (`ClearThreatList` method) and returns to its initial position (`MovementInform` method with `MovementGeneratorType.HOME`).

This example demonstrates how the `GetAITarget` method can be used to implement custom AI behavior based on specific target selection criteria.

## GetAITargets
Returns an array of all units that are currently on the Creature's threat list. This can be used to get all the current targets the Creature is engaged with or tracking for combat.

### Parameters
None

### Returns
units: [Unit](./unit.md)[] - An array of units on the creature's threat list.

### Example Usage
This example shows how to retrieve all the targets on a creature's threat list and send a message to each player character on the list.

```typescript
const BOSS_ENTRY = 12345;

const BossAggro: creature_event_on_combat = (event: number, creature: Creature, target: Unit): void => {
    const targets = creature.GetAITargets();

    for (const unit of targets) {
        if (unit.IsPlayer()) {
            const player = unit.ToPlayer();
            player.SendBroadcastMessage(`${creature.GetName()} has targeted you!`);

            // Apply a debuff to the player
            player.AddAura(123, player);
        }
    }

    // Emote to all players in the area
    creature.SendUnitYell("You dare challenge me? Prepare to face my wrath!", 0);
}

const BossSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    if (creature.GetEntry() == BOSS_ENTRY) {
        RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => BossAggro(...args));
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => BossSpawn(...args));
```

In this example:
1. When a creature with the specified `BOSS_ENTRY` spawns, the `BossSpawn` event handler is triggered.
2. Inside `BossSpawn`, we register the `BossAggro` event handler for the `CREATURE_EVENT_ON_ENTER_COMBAT` event specific to the boss creature.
3. When the boss creature enters combat, the `BossAggro` event handler is called.
4. We retrieve all the units on the boss creature's threat list using `creature.GetAITargets()`.
5. We iterate over each unit in the `targets` array.
6. For each unit, we check if it is a player using `unit.IsPlayer()`.
7. If it is a player, we convert the unit to a player object using `unit.ToPlayer()`.
8. We send a broadcast message to the player, informing them that the boss has targeted them.
9. We apply a debuff to the player using `player.AddAura()`.
10. Finally, we make the boss creature yell a message to all players in the area using `creature.SendUnitYell()`.

This example demonstrates how `GetAITargets()` can be used to retrieve all the units on a creature's threat list and perform actions based on those targets, such as sending messages or applying debuffs to specific players.

## GetAITargetsCount
Returns the number of units that are currently being threatened by this Creature's AI.

### Parameters
None

### Returns
* number - The current number of units on this Creature's threat table.

### Example Usage
This example will display the number of units on a Creature's threat table when it enters combat, and again when it leaves combat.

```typescript
const CREATURE_ENTRY = 1234;

let onEnterCombat: creature_event_on_enter_combat = (event: CreatureEvents, creature: Creature, target: Unit) => {
    let threatCount = creature.GetAITargetsCount();
    console.log(`${creature.GetName()} has entered combat with ${threatCount} targets on its threat table!`);
};

let onLeaveCombat: creature_event_on_leave_combat = (event: CreatureEvents, creature: Creature) => {
    let threatCount = creature.GetAITargetsCount();
    console.log(`${creature.GetName()} has left combat with ${threatCount} targets still on its threat table!`);

    if (threatCount > 0) {
        console.log(`Forcing ${creature.GetName()} to clear its threat table...`);
        creature.ClearThreatList();
        threatCount = creature.GetAITargetsCount();
        console.log(`${creature.GetName()}'s threat table now has ${threatCount} targets.`);
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, onEnterCombat);
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_LEAVE_COMBAT, onLeaveCombat);
```

This script will register event handlers for the `CREATURE_EVENT_ON_ENTER_COMBAT` and `CREATURE_EVENT_ON_LEAVE_COMBAT` events of a Creature with the specified entry ID.

When the Creature enters combat, the `onEnterCombat` function will be called, which retrieves the number of threatened units using `GetAITargetsCount()` and logs a message with the current count.

When the Creature leaves combat, the `onLeaveCombat` function is invoked, logging the current number of threatened units. If there are still units on the threat table after leaving combat, it will force-clear the threat table using `ClearThreatList()` and log the updated count of threatened units.

This example demonstrates how to use `GetAITargetsCount()` to monitor the number of units a Creature is actively threatening, and how to take action based on that information (in this case, clearing the threat table if the Creature leaves combat with a non-empty threat list).

## GetAggroRange
Returns the aggro range of the Creature for the specified target Unit.

### Parameters
- `target`: [Unit](./unit.md) - The target Unit to get the aggro range for.

### Returns
- `number` - The aggro range of the Creature for the target Unit.

### Example Usage
This example demonstrates how to use the `GetAggroRange` method to adjust the behavior of a Creature based on the proximity of a target player.

```typescript
const CREATURE_ENTRY = 1234;
const AGGRO_SAY = 'You dare approach me?';
const AGGRO_YELL = 'You will regret this!';

const CreatureNearTarget: creature_event_on_aiupdate = (event: number, creature: Creature, diff: number) => {
    const nearestPlayer = creature.GetNearestPlayer(50);

    if (nearestPlayer) {
        const aggroRange = creature.GetAggroRange(nearestPlayer);
        const distanceToPlayer = creature.GetDistance(nearestPlayer);

        if (distanceToPlayer <= aggroRange * 0.5) {
            // Player is within half the aggro range
            if (!creature.IsInCombat()) {
                creature.Say(AGGRO_SAY, 0);
                creature.EnterCombat(nearestPlayer);
            }
        } else if (distanceToPlayer <= aggroRange) {
            // Player is within the aggro range but not too close
            if (!creature.IsInCombat()) {
                creature.Yell(AGGRO_YELL, 0);
                creature.EnterCombat(nearestPlayer);
            }
        } else {
            // Player is outside the aggro range
            if (creature.IsInCombat()) {
                creature.LeaveCombat();
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_AIUPDATE, (...args) => CreatureNearTarget(...args));
```

In this example:
1. We define constants for the Creature entry, aggro say text, and aggro yell text.
2. We register a `CREATURE_EVENT_ON_AIUPDATE` event for the specific Creature entry.
3. Inside the event handler, we get the nearest player within a range of 50 yards using `GetNearestPlayer`.
4. If a nearest player is found, we get the aggro range of the Creature for that player using `GetAggroRange`.
5. We calculate the distance between the Creature and the player using `GetDistance`.
6. If the player is within half the aggro range and the Creature is not in combat, the Creature says the `AGGRO_SAY` text and enters combat with the player.
7. If the player is within the aggro range but not too close and the Creature is not in combat, the Creature yells the `AGGRO_YELL` text and enters combat with the player.
8. If the player is outside the aggro range and the Creature is in combat, the Creature leaves combat.

This script allows the Creature to dynamically respond to the proximity of players, engaging in combat when they are within the aggro range and using different aggro texts based on the distance. It also ensures that the Creature leaves combat when the player moves outside the aggro range.

## GetAttackDistance
Returns the effective aggro range of the Creature for the specified target Unit. If the calculated aggro range is smaller than the minimum aggro range set in the server configuration file, the minimum aggro range will be used instead.

### Parameters
- target: [Unit](./unit.md) - The target Unit to calculate the aggro range for.

### Returns
- number - The effective aggro range of the Creature for the specified target Unit.

### Example Usage
Adjust the aggro range of a boss creature based on the number of players in the raid.

```typescript
const BOSS_ENTRY = 12345;
const MIN_PLAYERS_FOR_BONUS_RANGE = 25;
const BONUS_RANGE = 5;

const UpdateBossAggroRange = (): void => {
    const boss = GetBossByEntry(BOSS_ENTRY);
    if (!boss) {
        return;
    }

    const players = GetPlayersInMap(boss.GetMapId());
    if (players.length >= MIN_PLAYERS_FOR_BONUS_RANGE) {
        boss.SetAggroRange(boss.GetAttackDistance(players[0]) + BONUS_RANGE);
    } else {
        boss.SetAggroRange(boss.GetAttackDistance(players[0]));
    }
};

const GetBossByEntry = (entry: number): Creature | null => {
    const creatures = GetCreaturesInWorld();
    for (const creature of creatures) {
        if (creature.GetEntry() === entry) {
            return creature;
        }
    }
    return null;
};

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_UPDATE, UpdateBossAggroRange);
```

In this example, the `UpdateBossAggroRange` function is called periodically using the `SERVER_EVENT_ON_UPDATE` event. It retrieves the boss creature by its entry ID using the `GetBossByEntry` helper function. If the boss is found, it checks the number of players in the same map as the boss.

If the number of players is greater than or equal to `MIN_PLAYERS_FOR_BONUS_RANGE`, it sets the aggro range of the boss to the sum of the base aggro range (obtained using `GetAttackDistance`) and the `BONUS_RANGE` value. This effectively increases the aggro range of the boss when there are many players in the raid.

If the number of players is less than `MIN_PLAYERS_FOR_BONUS_RANGE`, it sets the aggro range of the boss to the base aggro range obtained using `GetAttackDistance`.

Note that the `GetAttackDistance` method internally checks if the calculated aggro range is smaller than the minimum aggro range set in the server configuration file and uses the minimum value if necessary.

This example demonstrates how the `GetAttackDistance` method can be used in combination with other functions and events to dynamically adjust the aggro range of a creature based on specific conditions, such as the number of players in the raid.

## GetBotAverageItemLevel
This method returns the average item level of the creature's equipped gear, if the creature is a bot. The average item level is calculated by summing up the item levels of all equipped items and dividing by the number of equipped items. This can be useful for determining the relative strength of a bot creature.

### Parameters
This method does not take any parameters.

### Returns
* number - The average item level of the bot's equipped gear. If the creature is not a bot, or if the bot has no equipped items, the method will return 0.

### Example Usage
Here's an example of how you can use the `GetBotAverageItemLevel` method to adjust the difficulty of a boss encounter based on the average item level of the players' bots:

```typescript
const BOSS_ENTRY = 12345;
const MIN_ITEM_LEVEL = 200;
const MAX_ITEM_LEVEL = 300;

const AdjustBossDifficulty: creature_event_on_just_summoned = (event: number, creature: Creature, summoner: WorldObject) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        let totalItemLevel = 0;
        let botCount = 0;

        const players = creature.GetPlayersInRange(50);
        for (const player of players) {
            const bots = player.GetBots();
            for (const bot of bots) {
                totalItemLevel += bot.GetBotAverageItemLevel();
                botCount++;
            }
        }

        if (botCount > 0) {
            const averageItemLevel = totalItemLevel / botCount;
            const difficultyMultiplier = (averageItemLevel - MIN_ITEM_LEVEL) / (MAX_ITEM_LEVEL - MIN_ITEM_LEVEL);

            const defaultHealth = creature.GetMaxHealth();
            const defaultDamage = creature.GetDamage();

            const adjustedHealth = defaultHealth * (1 + difficultyMultiplier);
            const adjustedDamage = defaultDamage * (1 + difficultyMultiplier);

            creature.SetMaxHealth(adjustedHealth);
            creature.SetHealth(adjustedHealth);
            creature.SetDamage(adjustedDamage);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_SUMMONED, (...args) => AdjustBossDifficulty(...args));
```

In this example, when the boss creature is summoned, the script retrieves all players within a 50-yard range. For each player, it iterates over their bots and calculates the total item level of all bots. If there are bots present, it calculates the average item level and determines a difficulty multiplier based on the range between the minimum and maximum item levels.

The script then adjusts the boss's health and damage using the difficulty multiplier. This ensures that the boss encounter becomes more challenging as the players' bots have higher average item levels, providing a dynamic difficulty adjustment based on the bots' gear.

Note that this example assumes the existence of a `GetBots` method for the `Player` class, which returns an array of the player's bot creatures.

## GetBotClass
Returns the class ID of the creature if it is a bot. Bot class IDs are different from player class IDs and are specific to the bot system in AzerothCore.

### Returns
- `number` - The bot class ID of the creature. If the creature is not a bot, the returned value will be 0.

### Bot Class IDs
| Class         | ID |
|---------------|---:|
| WARRIOR       |  1 |
| PALADIN       |  2 |
| HUNTER        |  3 |
| ROGUE         |  4 |
| PRIEST        |  5 |
| DEATH_KNIGHT  |  6 |
| SHAMAN        |  7 |
| MAGE          |  8 |
| WARLOCK       |  9 |
| DRUID         | 10 |
| BLADE_MASTER  | 11 |
| SPHYNX        | 12 |
| ARCHMAGE      | 13 |
| DREADLORD     | 14 |
| SPELLBREAKER  | 15 |
| DARK_RANGER   | 16 |
| NECROMANCER   | 17 |
| SEA_WITCH     | 18 |
| CRYPT_LORD    | 19 |

### Example Usage
This example demonstrates how to use the `GetBotClass()` method to determine the class of a creature and perform specific actions based on the bot's class.

```typescript
const CREATURE_ENTRY_DARK_RANGER_BOT = 1234;
const ITEM_ENTRY_DARK_RANGER_BOW = 5678;

const OnCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY_DARK_RANGER_BOT) {
        const botClass = creature.GetBotClass();

        switch (botClass) {
            case 16: // DARK_RANGER
                // Equip the Dark Ranger bot with a specific bow
                const bow = creature.AddItem(ITEM_ENTRY_DARK_RANGER_BOW, 1);
                if (bow) {
                    creature.EquipItem(bow, true);
                }
                break;
            default:
                // Handle other bot classes or non-bot creatures
                break;
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => OnCreatureSpawn(...args));
```

In this example:
1. We define constants for the Dark Ranger bot's creature entry and the item entry for the Dark Ranger bow.
2. In the `OnCreatureSpawn` event handler, we check if the spawned creature is the Dark Ranger bot using its entry ID.
3. If it is the Dark Ranger bot, we call `GetBotClass()` to determine its class.
4. Using a switch statement, we handle the case where the bot is a Dark Ranger (class ID 16).
5. If the bot is a Dark Ranger, we add a specific bow item to its inventory using `AddItem()` and equip it using `EquipItem()`.
6. For other bot classes or non-bot creatures, we can add additional handling logic as needed.

This example showcases how `GetBotClass()` can be used to identify the class of a bot creature and perform class-specific actions, such as equipping specific items or applying buffs.

## GetBotEquipment
Retrieves the item currently equipped in the specified equipment slot for the given creature (bot). If the slot is empty, the method will return `undefined`.

### Parameters
- slot: [BotEquipmentSlotNum](./botequipmentslotnum.md) - The equipment slot to check for the item.

### Returns
- [Item](./item.md) | undefined - The item equipped in the specified slot, or `undefined` if the slot is empty.

### Example Usage
This example demonstrates how to retrieve the item equipped in the main hand slot of a bot and check if it matches a specific item entry. If the equipped item matches, the bot's attack power is increased by a certain amount.

```typescript
const BOT_ENTRY = 12345;
const ENCHANTED_SWORD_ENTRY = 67890;
const ATTACK_POWER_BONUS = 100;

const OnBotSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    // Check if the spawned creature is the desired bot
    if (creature.GetEntry() === BOT_ENTRY) {
        // Retrieve the item equipped in the main hand slot
        const mainHandItem = creature.GetBotEquipment(BotEquipmentSlotNum.BOT_SLOT_MAINHAND);

        // Check if the main hand slot is not empty and if the equipped item matches the desired entry
        if (mainHandItem && mainHandItem.GetEntry() === ENCHANTED_SWORD_ENTRY) {
            // Increase the bot's attack power
            creature.SetBotStat("ap", creature.GetBotStat("ap") + ATTACK_POWER_BONUS);

            // Announce the bonus
            creature.SendCreatureWhisper("My enchanted sword grants me extra attack power!", Language.LANG_UNIVERSAL, creature.GetNearestPlayer(10));
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, OnBotSpawn);
```

In this example:
1. We define constants for the desired bot entry, enchanted sword item entry, and the attack power bonus amount.
2. We register a creature event handler for the `CREATURE_EVENT_ON_SPAWN` event.
3. Inside the event handler, we check if the spawned creature is the desired bot by comparing its entry with the defined `BOT_ENTRY`.
4. If it is the desired bot, we retrieve the item equipped in the main hand slot using `GetBotEquipment(BotEquipmentSlotNum.BOT_SLOT_MAINHAND)`.
5. We check if the main hand slot is not empty and if the equipped item's entry matches the `ENCHANTED_SWORD_ENTRY`.
6. If the conditions are met, we increase the bot's attack power by the defined `ATTACK_POWER_BONUS` amount using `SetBotStat("ap", ...)`.
7. Finally, we make the bot send a whisper to the nearest player within 10 yards, announcing the bonus granted by the enchanted sword.

This example showcases how to retrieve the equipped item of a bot, check its properties, and modify the bot's stats based on the equipped item. It also demonstrates how to make the bot interact with nearby players by sending whispers.

## GetBotOwner
If the creature is an NPC bot, this method will return the owner of the bot. If the creature is not an NPC bot or does not have an owner, the method will return undefined. This method requires the NPCBots patch and the Eluna NPCBots branch to be installed on the server.

### Parameters
This method does not take any parameters.

### Returns
owner: [Player](./player.md) | undefined - The owner of the NPC bot, or undefined if the creature is not an NPC bot or does not have an owner.

### Example Usage
This example demonstrates how to use the GetBotOwner method to determine if a creature is an NPC bot and, if so, who its owner is. It then uses this information to display a message to the owner when their bot is killed.

```typescript
const OnBotDeath: creature_event_on_died = (event: CreatureEvents.CREATURE_EVENT_ON_DIED, creature: Creature, killer: Unit) => {
    const owner = creature.GetBotOwner();
    if (owner) {
        const botName = creature.GetName();
        const ownerName = owner.GetName();
        
        // Send a message to the bot's owner
        owner.SendBroadcastMessage(`Your bot, ${botName}, has been killed!`);
        
        // Log the event to the server console
        console.log(`[Bot Death] ${botName}, owned by ${ownerName}, has been killed by ${killer.GetName()}.`);
        
        // Respawn the bot after a 60-second delay
        creature.Respawn(60000);
        
        // Teleport the bot back to its owner
        creature.Teleport(owner.GetMapId(), owner.GetX(), owner.GetY(), owner.GetZ(), owner.GetO());
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DIED, OnBotDeath);
```

In this example:
1. When a creature dies, the `OnBotDeath` function is called.
2. The function attempts to get the owner of the creature using `GetBotOwner()`.
3. If an owner is found (i.e., the creature is an NPC bot), the function:
   - Retrieves the names of the bot and its owner.
   - Sends a message to the owner informing them that their bot has been killed.
   - Logs the event to the server console.
   - Schedules the bot to respawn after a 60-second delay using `Respawn(60000)`.
   - Teleports the bot back to its owner's location using `Teleport()` and the owner's coordinates.
4. If no owner is found (i.e., the creature is not an NPC bot or has no owner), the function does nothing.

This example showcases how the `GetBotOwner` method can be used in conjunction with other methods and events to create a more complex and interactive script for managing NPC bots.

## GetBotRoles
Returns the current roles assigned to the Creature (assuming it is a bot). The roles are represented by a bitmask of values.

### Parameters
None

### Returns
roles: number - The current roles assigned to the Creature (bot) as a bitmask.

### Example Usage
Determine if a Creature has the "TANK" role and if it also has any gathering profession roles.

```typescript
const creature = GetWorldCreature(/* ... */);

const roles = creature.GetBotRoles();

const isTank = (roles & 1) !== 0;
const isGatherer = (roles & (64 | 128 | 256 | 512)) !== 0;

if (isTank) {
    if (isGatherer) {
        SendSystemMessage("The Creature is a tank and a gatherer.");
    } else {
        SendSystemMessage("The Creature is a tank but not a gatherer.");
    }
} else {
    if (isGatherer) {
        SendSystemMessage("The Creature is not a tank but is a gatherer.");
    } else {
        SendSystemMessage("The Creature is neither a tank nor a gatherer.");
    }
}
```

In this example, we first retrieve the Creature object using `GetWorldCreature` (assuming it exists and is a bot). Then, we call the `GetBotRoles` method to obtain the current roles assigned to the Creature.

Next, we perform bitwise operations to check if specific role flags are set. We use the bitwise AND operator (`&`) to compare the roles bitmask with the desired role values.

- To check if the Creature has the "TANK" role, we perform a bitwise AND with the value 1 (binary: 0001) and check if the result is non-zero.
- To check if the Creature has any gathering profession roles, we perform a bitwise AND with the values 64 (binary: 1000000), 128 (binary: 10000000), 256 (binary: 100000000), and 512 (binary: 1000000000) using the bitwise OR operator (`|`) and check if the result is non-zero.

Based on the results of these checks, we send appropriate system messages indicating whether the Creature is a tank, a gatherer, both, or neither.

This example demonstrates how to use the `GetBotRoles` method to retrieve the assigned roles of a Creature and perform role-based checks using bitwise operations.

## GetBotStat
Retrieves a specific stat value from the Creature (NPC) based on the provided `BotStatType` enumeration value.

### Parameters
* `stat`: [BotStatTypeNum](./botstattypenum.md) - The enum value corresponding to the desired bot stat.

### Returns
* `number` - The value of the specified bot stat.

### Example Usage
In this example, we'll create a script that adjusts the behavior of a quest NPC based on its aggression level and mana points.

```typescript
const QUEST_NPC_ENTRY = 12345;
const AGGRO_THRESHOLD = 50;
const MANA_THRESHOLD = 1000;

const HandleGossipHello: GossipHello = (event, player, creature) => {
    const aggroLevel = creature.GetBotStat(BotStatTypeNum.BOTSTAT_AGGRO_LEVEL);
    const manaPoints = creature.GetBotStat(BotStatTypeNum.BOTSTAT_MANA);

    if (aggroLevel >= AGGRO_THRESHOLD && manaPoints >= MANA_THRESHOLD) {
        // If the NPC has high aggression and sufficient mana, offer a special quest
        player.AddQuest(SPECIAL_QUEST_ENTRY);
        creature.SendUnitWhisper("I have a challenging task for you, adventurer. Are you ready?", LANG_UNIVERSAL, player);
    } else if (aggroLevel >= AGGRO_THRESHOLD) {
        // If the NPC has high aggression but low mana, offer a regular quest
        player.AddQuest(REGULAR_QUEST_ENTRY);
        creature.SendUnitWhisper("I need your assistance with a task, adventurer.", LANG_UNIVERSAL, player);
    } else {
        // If the NPC has low aggression, offer a simple quest
        player.AddQuest(SIMPLE_QUEST_ENTRY);
        creature.SendUnitWhisper("Greetings, adventurer. I have a small favor to ask of you.", LANG_UNIVERSAL, player);
    }
};

RegisterCreatureGossipEvent(QUEST_NPC_ENTRY, GOSSIP_EVENT_ON_HELLO, HandleGossipHello);
```

In this script:

1. We define constants for the quest NPC entry and the threshold values for aggression level and mana points.

2. Inside the `HandleGossipHello` function, we retrieve the NPC's aggression level and mana points using `GetBotStat` with the appropriate `BotStatTypeNum` enum values.

3. We then use conditional statements to determine the NPC's behavior based on the retrieved stat values:
   - If the aggression level is high and mana points are sufficient, we offer a special quest to the player and send a challenging whisper message.
   - If the aggression level is high but mana points are low, we offer a regular quest and send a normal whisper message.
   - If the aggression level is low, we offer a simple quest and send a friendly whisper message.

4. Finally, we register the `HandleGossipHello` function to be triggered when the player interacts with the specified quest NPC using `RegisterCreatureGossipEvent`.

By utilizing the `GetBotStat` method, we can retrieve specific stats from the NPC and customize its behavior accordingly, creating a more dynamic and engaging quest experience for the player.

## GetBotDump
Returns a complete dump of bot info that is the same data from .npcbot info command in-game.

### Parameters
None

### Returns
string - A formatted string containing extensive information about the bot, including stats, level, equipment, and more.

### Example Usage
This example demonstrates how to retrieve and display the bot information dump for a creature that is a bot.

```typescript
const BOT_ENTRY = 70000;

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === BOT_ENTRY && creature.IsNPCBot()) {
        const botDump = creature.GetBotDump();
        
        // Split the dump into lines for better readability
        const lines = botDump.split('\n');

        // Send the bot dump to the player
        for (const line of lines) {
            player.SendBroadcastMessage(line);
        }

        // Example output formatting
        player.SendBroadcastMessage('==== Bot Information ====');
        player.SendBroadcastMessage(`Name: ${creature.GetName()}`);
        player.SendBroadcastMessage(`Entry: ${creature.GetEntry()}`);
        player.SendBroadcastMessage(`Level: ${creature.GetLevel()}`);
        player.SendBroadcastMessage(`Class: ${creature.GetClass()}`);
        player.SendBroadcastMessage(`Equipment:`);

        // Parse and display specific information from the dump
        for (const line of lines) {
            if (line.includes('Equipment:')) {
                const equipmentLines = line.split(',');
                for (const equipmentLine of equipmentLines) {
                    player.SendBroadcastMessage(`  ${equipmentLine.trim()}`);
                }
                break;
            }
        }

        player.SendBroadcastMessage('=========================');
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
```

In this example:
1. We define the entry ID of the bot creature we want to retrieve information for.
2. In the `OnGossipHello` event, we check if the creature interacted with is the desired bot and if it is an NPC bot using `IsNPCBot()`.
3. If the conditions are met, we call `GetBotDump()` to retrieve the complete bot information dump.
4. We split the dump into lines using `split('\n')` for better readability.
5. We send the entire bot dump to the player line by line using `SendBroadcastMessage()`.
6. We demonstrate how to format and display specific parts of the bot information, such as the name, entry, level, class, and equipment.
7. We parse the dump to extract and display the equipment information separately.
8. Finally, we register the `OnGossipHello` event to trigger the script when the player interacts with the bot creature.

This example provides a comprehensive way to retrieve and display the complete bot information dump, allowing players to inspect the details of a specific bot creature. The script can be easily extended to extract and display additional information from the dump as needed.

## GetTalentSpec

Returns the talent specialization of the creature. This method is useful for determining the role or specialization of a creature, such as whether it is a tank, healer, or damage dealer.

### Parameters

None

### Returns

number - The talent specialization of the creature, represented by a number from the list below:

```
WARRIOR_ARMS         : 1
WARRIOR_FURY         : 2
WARRIOR_PROTECTION   : 3
PALADIN_HOLY         : 4
PALADIN_PROTECTION   : 5
PALADIN_RETRIBUTION  : 6
HUNTER_BEASTMASTERY  : 7
HUNTER_MARKSMANSHIP  : 8
HUNTER_SURVIVAL      : 9
ROGUE_ASSASSINATION  : 10
ROGUE_COMBAT         : 11
ROGUE_SUBTLETY       : 12
PRIEST_DISCIPLINE    : 13
PRIEST_HOLY          : 14
PRIEST_SHADOW        : 15
DK_BLOOD             : 16
DK_FROST             : 17
DK_UNHOLY            : 18
SHAMAN_ELEMENTAL     : 19
SHAMAN_ENHANCEMENT   : 20
SHAMAN_RESTORATION   : 21
MAGE_ARCANE          : 22
MAGE_FIRE            : 23
MAGE_FROST           : 24
WARLOCK_AFFLICTION   : 25
WARLOCK_DEMONOLOGY   : 26
WARLOCK_DESTRUCTION  : 27
DRUID_BALANCE        : 28
DRUID_FERAL          : 29
DRUID_RESTORATION    : 30
DEFAULT              : 31
```

### Example Usage

Here's an example of how to use the `GetTalentSpec` method to determine the role of a creature and adjust its behavior accordingly:

```typescript
const CREATURE_ENTRY_WARRIOR = 1234;
const CREATURE_ENTRY_PRIEST = 5678;

const onCreatureCreate: creature_event_on_spawn = (event: CreatureEvents, creature: Creature) => {
    const creatureEntry = creature.GetEntry();
    const talentSpec = creature.GetTalentSpec();

    if (creatureEntry === CREATURE_ENTRY_WARRIOR) {
        if (talentSpec === 3) {
            // Warrior is Protection (tank)
            creature.SetMaxHealth(creature.GetMaxHealth() * 1.5); // Increase max health for tankiness
            creature.AddAura(1234, creature); // Add a defensive aura
        } else {
            // Warrior is Arms or Fury (damage dealer)
            creature.SetMeleeDamageSchool(SPELL_SCHOOL_NORMAL); // Set melee damage school to physical
            creature.SetBaseAttackTime(BASE_ATTACK, 2000); // Adjust base attack time for DPS
        }
    } else if (creatureEntry === CREATURE_ENTRY_PRIEST) {
        if (talentSpec === 13 || talentSpec === 14) {
            // Priest is Discipline or Holy (healer)
            creature.SetMaxMana(creature.GetMaxMana() * 1.2); // Increase max mana for healing
            creature.AddAura(5678, creature); // Add a healing aura
        } else {
            // Priest is Shadow (damage dealer)
            creature.SetDamageSchool(SPELL_SCHOOL_SHADOW); // Set damage school to shadow
            creature.SetBaseAttackTime(BASE_ATTACK, 2200); // Adjust base attack time for DPS
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureCreate(...args));
```

In this example, we register a creature event handler for the `CREATURE_EVENT_ON_SPAWN` event. When a creature spawns, we retrieve its entry and talent specialization using the `GetEntry` and `GetTalentSpec` methods, respectively.

Based on the creature's entry and talent specialization, we adjust its properties and behavior accordingly. For example, if the creature is a Protection Warrior (tank), we increase its maximum health and add a defensive aura. If the creature is a Shadow Priest (damage dealer), we set its damage school to shadow and adjust its base attack time for DPS.

This allows us to customize the creature's attributes and abilities based on its role, making it more suitable for its intended purpose in the game.

## GetCorpseDelay
Returns the delay in seconds between when the [Creature] dies and when its body despawns.

### Parameters
None

### Returns
* number - The delay in seconds before the creature's corpse despawns.

### Example Usage
This example demonstrates how to adjust the respawn time of a creature based on its level and the time it takes for its corpse to despawn.

```typescript
const CREATURE_ENTRY = 1234;
const BASE_RESPAWN_TIME = 300; // 5 minutes

const AdjustRespawnTime = (entry: number, creature: Creature) => {
    const level = creature.GetLevel();
    const corpseDelay = creature.GetCorpseDelay();

    let respawnTime = BASE_RESPAWN_TIME;

    // Increase respawn time based on creature level
    if (level >= 50) {
        respawnTime += 120; // Add 2 minutes for high-level creatures
    } else if (level >= 30) {
        respawnTime += 60; // Add 1 minute for mid-level creatures
    }

    // Ensure the respawn time is at least the length of the corpse delay
    if (respawnTime < corpseDelay) {
        respawnTime = corpseDelay;
    }

    creature.SetRespawnDelay(respawnTime);
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, AdjustRespawnTime);
```

In this example:
1. We define a constant `CREATURE_ENTRY` to specify the entry ID of the creature we want to modify the respawn time for.
2. We define a constant `BASE_RESPAWN_TIME` to set the base respawn time in seconds (5 minutes in this case).
3. We create a function `AdjustRespawnTime` that takes the creature's entry ID and the `Creature` object as parameters.
4. Inside the function, we retrieve the creature's level using `GetLevel()` and the corpse delay using `GetCorpseDelay()`.
5. We initialize a variable `respawnTime` with the base respawn time.
6. We check the creature's level and increase the respawn time accordingly:
   - If the level is 50 or higher, we add 2 minutes to the respawn time.
   - If the level is between 30 and 49, we add 1 minute to the respawn time.
7. We ensure that the `respawnTime` is at least the length of the corpse delay to prevent the creature from respawning before its corpse despawns.
8. Finally, we set the creature's respawn delay using `SetRespawnDelay()` with the adjusted `respawnTime`.
9. We register the `AdjustRespawnTime` function to be called whenever a creature with the specified `CREATURE_ENTRY` spawns using `RegisterCreatureEvent()`.

This example demonstrates how you can utilize the `GetCorpseDelay()` method to retrieve the corpse despawn delay and adjust the creature's respawn time based on its level and the corpse delay. This can be useful for creating more dynamic and balanced respawn mechanics in your mod.

## GetCreatureFamily

Returns the creature's family ID based on the CreatureFamily enumeration.

### Returns

[CreatureFamily](./creature-family-enum.md): The creature's family ID.

### Example Usage

This example checks if a creature belongs to a specific family and applies a buff if it does.

```typescript
const CREATURE_FAMILY_WOLF = 1;
const CREATURE_FAMILY_CAT = 2;
const SPELL_BONUS_DAMAGE = 12345;

const ApplyFamilyBuff: creature_event_on_spawn = (event: number, creature: Creature) => {
    const creatureFamily = creature.GetCreatureFamily();

    if (creatureFamily === CREATURE_FAMILY_WOLF || creatureFamily === CREATURE_FAMILY_CAT) {
        creature.CastSpell(creature, SPELL_BONUS_DAMAGE, true);
        creature.SendUnitWhisper("You have been granted bonus damage due to your family!", creature.GetGUID());
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => ApplyFamilyBuff(...args));
```

In this example:

1. We define constants for the wolf and cat creature families, as well as a constant for the bonus damage spell ID.
2. We create a function called `ApplyFamilyBuff` that takes the event number and the spawned creature as parameters.
3. Inside the function, we retrieve the creature's family ID using the `GetCreatureFamily()` method.
4. We check if the creature belongs to either the wolf or cat family using an if statement.
5. If the creature belongs to one of those families, we cast a bonus damage spell on the creature using `CastSpell()`.
6. We also send a whisper message to the creature using `SendUnitWhisper()` to inform them about the bonus damage.
7. Finally, we register the `ApplyFamilyBuff` function to the `CREATURE_EVENT_ON_SPAWN` event using `RegisterCreatureEvent()`.

This script demonstrates how to use the `GetCreatureFamily()` method to determine a creature's family and apply specific actions based on that information.

Note: Make sure to replace the placeholder spell ID (`SPELL_BONUS_DAMAGE`) with an actual spell ID from your database.

## GetCreatureSpellCooldownDelay
Returns the cooldown delay in milliseconds for a specified spell ID for the Creature.

### Parameters
* spellID: number - The ID of the spell to check the cooldown for.

### Returns
* number - The cooldown delay in milliseconds for the specified spell ID.

### Example Usage
In this example, we have a script that checks if a creature's spell is off cooldown before casting it. If the spell is on cooldown, the creature will wait until the cooldown is over before casting the spell.

```typescript
const SPELL_ID = 12345;
const SPELL_COOLDOWN = 5000; // 5 seconds

const UpdateAI: creature_event_on_update = (event: number, creature: Creature, diff: number): void => {
    if (!creature.IsCasting() && !creature.IsInCombat()) {
        const target = creature.GetNearestTarget(10);
        if (target) {
            creature.SetInCombatWith(target);
        }
    }

    if (creature.IsInCombat()) {
        const spellCooldown = creature.GetCreatureSpellCooldownDelay(SPELL_ID);
        if (spellCooldown === 0) {
            const target = creature.GetVictim();
            if (target) {
                creature.CastSpell(target, SPELL_ID, false);
                creature.SetCreatureSpellCooldownDelay(SPELL_ID, SPELL_COOLDOWN);
            }
        }
    }
}

RegisterCreatureEvent(CREATURE_EVENT_ON_UPDATE, (...args) => UpdateAI(...args));
```

In this script, we first check if the creature is not casting a spell and is not in combat. If these conditions are met, the creature will search for the nearest target within 10 yards and engage in combat with them.

Once the creature is in combat, we check the cooldown of the specified spell using `GetCreatureSpellCooldownDelay()`. If the cooldown is 0 (meaning the spell is off cooldown), we get the creature's current target using `GetVictim()`. If a target exists, the creature will cast the spell on the target using `CastSpell()` and then set the cooldown for the spell using `SetCreatureSpellCooldownDelay()`.

By using `GetCreatureSpellCooldownDelay()`, we can ensure that the creature is only casting the spell when it is off cooldown, preventing the creature from spamming the spell and making the encounter more balanced.

## GetCurrentWaypointId
Returns the current waypoint ID of the creature if it's moving along a predefined path. Waypoints are defined in the `waypoint_data` table in the world database. Each waypoint has a unique ID, and this method returns the ID of the waypoint the creature is currently moving towards.

### Parameters
This method does not take any parameters.

### Returns
* number - The ID of the current waypoint, or 0 if the creature is not moving along a waypoint path.

### Example Usage
In this example, we create a script that monitors a creature's movement along a waypoint path. When the creature reaches specific waypoints, it performs certain actions or emotes.

```typescript
const CREATURE_ENTRY = 12345;
const WAYPOINT_DANCE = 10;
const WAYPOINT_SALUTE = 20;
const WAYPOINT_ROAR = 30;

const OnCreatureUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    const currentWaypointId = creature.GetCurrentWaypointId();

    switch (currentWaypointId) {
        case WAYPOINT_DANCE:
            creature.PerformEmote(EmoteType.EMOTE_ONESHOT_DANCE);
            break;
        case WAYPOINT_SALUTE:
            creature.PerformEmote(EmoteType.EMOTE_ONESHOT_SALUTE);
            creature.SendUnitSay("Greetings, travelers!", ChatMsg.CHAT_MSG_MONSTER_SAY, 0);
            break;
        case WAYPOINT_ROAR:
            creature.PerformEmote(EmoteType.EMOTE_ONESHOT_ROAR);
            creature.CastSpell(creature, 12345, true);
            break;
        default:
            break;
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_UPDATE, OnCreatureUpdate);
```

In this script:
1. We define constants for the creature entry and specific waypoint IDs where we want the creature to perform actions.
2. We register a `CREATURE_EVENT_ON_UPDATE` event for the specified creature entry.
3. In the event handler, we retrieve the current waypoint ID using `creature.GetCurrentWaypointId()`.
4. We use a `switch` statement to check the current waypoint ID against the predefined waypoint constants.
5. Depending on the waypoint ID, the creature performs different actions:
   - At `WAYPOINT_DANCE`, the creature performs a dance emote.
   - At `WAYPOINT_SALUTE`, the creature performs a salute emote and sends a greeting message.
   - At `WAYPOINT_ROAR`, the creature performs a roar emote and casts a spell on itself.
6. If the current waypoint ID doesn't match any of the specified waypoints, no action is taken.

This script demonstrates how you can use `GetCurrentWaypointId()` to track a creature's movement along a waypoint path and trigger specific actions at designated waypoints. You can extend this script to include more waypoints and perform different actions based on your specific requirements.

## GetDBTableGUIDLow
Returns the database guid (low guid) for the creature.  This ID comes from the `creature` table and is the `guid` column that is used as the primary key.  This value can be used to manipulate or lookup the creature in the `creature` database table. 

### Parameters
None

### Returns
guid: number - The low guid of the creature from the `creature` table

### Example Usage
Lets say that we want to create an NPC that will remember if a player has interacted with them before.  We will use the low guid from the creature table to store a flag on the player to indicate that they have interacted with this NPC before.  

```typescript
// Create a new gossip for the creature
const GOSSIP_MENU_ID = 60000;
const GOSSIP_NPC_TEXT_ID = 100000;

const ACCreature: CreatureScript = new CreatureScript("ACCreature","gossip_npc_remember_me");

class GossipNPC_TS extends ACCreature.Creature {   

    hasInteractedWithPlayer(player: Player): boolean {
        return player.HasFlag(PlayerFlags.CUSTOM_FLAG_INTERACTED_WITH_NPC, this.GetDBTableGUIDLow());        
    }

    OnGossipHello(player: Player) {               
        if(!this.hasInteractedWithPlayer(player)) {            
            player.GossipMenuAddItem(GOSSIP_MENU_ID, 0, "Hello, I don't think we have met before.", 1, 1);
        } else {
            player.GossipMenuAddItem(GOSSIP_MENU_ID, 0, "Hello again, thanks for stopping by!", 1, 1);
        }
                
        player.GossipSendMenu(GOSSIP_NPC_TEXT_ID, this.obj, GOSSIP_MENU_ID);
    }

    OnGossipSelect(player: Player, menuId: number, option: number) {
        if(menuId == GOSSIP_MENU_ID && option == 1) {
            player.SetFlag(PlayerFlags.CUSTOM_FLAG_INTERACTED_WITH_NPC, this.GetDBTableGUIDLow());
            player.GossipComplete();
        }        
    }

}

const onLowGuidNPC = () => new GossipNPC_TS();
ACCreature.register(onLowGuidNPC, 190010, "npc_remember_me");
```

In this example, we create a new gossip NPC that will remember if a player has interacted with them before by using a custom flag on the player that stores the low guid of the creature.  When the player first interacts with the NPC, they will see a different message than if they have already interacted with the NPC before.  

We use the `GetDBTableGUIDLow()` method to get the low guid of the creature, which we then use to set a custom flag on the player using `player.SetFlag()`. This flag is checked in the `hasInteractedWithPlayer()` method to determine if the player has interacted with this NPC before.

## GetDefaultMovementType
Returns the default movement type for this [Creature]. This method can be useful when you want to determine how a creature should move by default, and then make decisions based on that information.

### Parameters
This method does not take any parameters.

### Returns
[MovementGeneratorType](./movementgeneratortype.md) - The default movement type of the creature.

### Example Usage
In this example, we'll create a script that changes a creature's movement type based on its default movement type and the time of day in the game world.

```typescript
const CREATURE_ENTRY = 1234;
const MORNING_START = 6; // 6 AM
const EVENING_START = 18; // 6 PM

const UpdateCreatureMovement: creature_event_on_update = (event: number, creature: Creature, diff: number): void => {
    const currentHour = creature.GetMap().GetGameTime() / 60; // Convert minutes to hours

    if (creature.GetEntry() === CREATURE_ENTRY) {
        const defaultMovementType = creature.GetDefaultMovementType();

        if (currentHour >= MORNING_START && currentHour < EVENING_START) {
            // During the day (6 AM to 6 PM)
            if (defaultMovementType === MovementGeneratorType.IDLE_MOTION_TYPE) {
                creature.SetWalk(false); // Set creature to run
                creature.GetMotionMaster().MoveRandom(10, 5); // Move randomly within a 10-yard radius, with a 5-second delay between movements
            } else if (defaultMovementType === MovementGeneratorType.RANDOM_MOTION_TYPE) {
                creature.GetMotionMaster().MoveTargetedHome(); // Move the creature back to its spawn point
            }
        } else {
            // During the night (6 PM to 6 AM)
            if (defaultMovementType === MovementGeneratorType.IDLE_MOTION_TYPE) {
                creature.SetWalk(true); // Set creature to walk
                creature.GetMotionMaster().MovePath(CREATURE_ENTRY * 100, true); // Move along a predefined path (path ID is calculated based on the creature entry)
            } else if (defaultMovementType === MovementGeneratorType.RANDOM_MOTION_TYPE) {
                creature.GetMotionMaster().MoveIdle(); // Stop the creature's movement
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => UpdateCreatureMovement(...args));
```

In this script, we first determine the current hour in the game world by converting the game time (in minutes) to hours. Then, we check if the creature's entry matches the one we're interested in (CREATURE_ENTRY).

If it's daytime (between 6 AM and 6 PM), we check the creature's default movement type. If it's IDLE_MOTION_TYPE, we set the creature to run and move randomly within a 10-yard radius, with a 5-second delay between movements. If the default movement type is RANDOM_MOTION_TYPE, we move the creature back to its spawn point.

During the night (between 6 PM and 6 AM), if the default movement type is IDLE_MOTION_TYPE, we set the creature to walk and move along a predefined path (the path ID is calculated based on the creature entry). If the default movement type is RANDOM_MOTION_TYPE, we stop the creature's movement by calling MoveIdle().

This example demonstrates how you can use the GetDefaultMovementType() method to make decisions based on a creature's default movement behavior and create dynamic scripts that change creature behavior based on various conditions, such as the time of day.

## GetExtraFlags
Returns the extra flags for the creature. Extra flags are used to control various attributes and behaviors of the creature, such as whether it is a civilian, uses pathfinding, is a guard, and more.

### Parameters
None

### Returns
* `number` - The extra flags of the creature.

### Example Usage
```typescript
// Define the creature entry to check
const CREATURE_ENTRY = 1234;

// Event handler for creature spawn
const OnCreatureSpawn: creature_event_on_spawn = (event: CreatureEvents, creature: Creature, killer: Unit) => {
    // Check if the spawned creature matches the desired entry
    if (creature.GetEntry() === CREATURE_ENTRY) {
        // Get the creature's extra flags
        const extraFlags = creature.GetExtraFlags();

        // Check if the creature is a civilian
        if ((extraFlags & CreatureExtraFlags.CREATURE_FLAG_EXTRA_CIVILIAN) !== 0) {
            console.log("The creature is a civilian.");
        }

        // Check if the creature uses pathfinding
        if ((extraFlags & CreatureExtraFlags.CREATURE_FLAG_EXTRA_NO_PARRY) !== 0) {
            console.log("The creature uses pathfinding.");
        }

        // Check if the creature is a guard
        if ((extraFlags & CreatureExtraFlags.CREATURE_FLAG_EXTRA_GUARD) !== 0) {
            console.log("The creature is a guard.");
        }

        // Add more checks for other extra flags as needed
    }
};

// Register the creature spawn event
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, OnCreatureSpawn);
```

In this example, we define a constant `CREATURE_ENTRY` to specify the entry of the creature we want to check. We then register a creature spawn event using `RegisterCreatureEvent` and provide the `OnCreatureSpawn` event handler.

Inside the event handler, we first check if the spawned creature's entry matches the desired entry using `creature.GetEntry()`. If there is a match, we retrieve the creature's extra flags using `creature.GetExtraFlags()`.

We then perform various checks on the extra flags using bitwise operations to determine specific attributes of the creature. In this example, we check if the creature is a civilian, uses pathfinding, or is a guard by comparing the extra flags with the corresponding flag values defined in the `CreatureExtraFlags` enum.

You can add more checks for other extra flags based on your specific requirements. The extra flags provide a way to control and identify various behaviors and attributes of creatures in the game.

Note: Make sure to replace `CreatureExtraFlags` with the actual enum or constant values defined in your mod-eluna or AzerothCore environment.

## GetHomePosition
Returns the home position of the creature as a set of coordinates (x, y, z, o). The home position is the position the creature returns to when evading from combat or respawning.

### Parameters
None

### Returns
An array of four numbers representing the coordinates:
- `x`: The X-coordinate of the creature's home position.
- `y`: The Y-coordinate of the creature's home position.
- `z`: The Z-coordinate (height) of the creature's home position.
- `o`: The orientation (facing angle) of the creature at its home position, in radians.

### Example Usage
Create a custom creature script that teleports the creature to a random position within a certain range of its home position when it is engaged in combat.
```typescript
const CUSTOM_CREATURE_ENTRY = 100001;
const TELEPORT_RANGE = 10; // 10 yards

const OnEnterCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit): void => {
    const [homeX, homeY, homeZ, homeO] = creature.GetHomePosition();

    // Calculate random offset within the specified range
    const randomOffsetX = Math.random() * TELEPORT_RANGE * 2 - TELEPORT_RANGE;
    const randomOffsetY = Math.random() * TELEPORT_RANGE * 2 - TELEPORT_RANGE;

    // Calculate the new position based on the home position and random offset
    const newX = homeX + randomOffsetX;
    const newY = homeY + randomOffsetY;
    const newZ = homeZ;

    // Teleport the creature to the new position
    creature.NearTeleport(newX, newY, newZ, homeO);

    // Send a message to nearby players
    creature.SendUnitYell("I will not be defeated easily!", 0);
};

RegisterCreatureEvent(CUSTOM_CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => OnEnterCombat(...args));
```
In this example, when the custom creature with the specified entry ID enters combat, it will be teleported to a random position within a range of 10 yards from its home position. The script calculates the random offset based on the `TELEPORT_RANGE` constant and adds it to the home position coordinates obtained using `GetHomePosition()`. The creature is then teleported to the new position using `NearTeleport()`, maintaining its original orientation. Finally, the creature sends a yell message to nearby players.

This script can be useful for creating more dynamic and challenging encounters where the creature actively tries to reposition itself during combat.

## GetLootMode
Returns the current loot mode for the creature. The loot mode determines how the creature's loot is distributed among players.

### Parameters
None

### Returns
string - The current loot mode of the creature. Possible values are:
- "LOOT_MODE_DEFAULT": The default loot mode, where loot is distributed based on the group's loot method.
- "LOOT_MODE_HARD_MODE_1": A special loot mode used for hard mode encounters, providing additional or enhanced loot.
- "LOOT_MODE_HARD_MODE_2": Another special loot mode for even more challenging hard mode encounters.
- "LOOT_MODE_HARD_MODE_3": The highest difficulty loot mode for the most demanding hard mode encounters.
- "LOOT_MODE_HARD_MODE_4": An extra hard mode loot mode for exceptionally difficult encounters.

### Example Usage
```typescript
const BOSS_ENTRY = 12345;
const HARD_MODE_LOOT = "LOOT_MODE_HARD_MODE_2";

const CheckBossLootMode: creature_event_on_just_summoned = (event: number, creature: Creature, summoner: WorldObject) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        const lootMode = creature.GetLootMode();
        if (lootMode === HARD_MODE_LOOT) {
            // Announce to the raid that the boss is in hard mode
            creature.SendChatMessage(CHAT_MSG_RAID_BOSS_EMOTE, 0, "The boss is now in hard mode! Prepare for a challenging fight!");

            // Increase the boss's health and damage for hard mode
            creature.SetMaxHealth(creature.GetMaxHealth() * 1.5);
            creature.SetHealth(creature.GetMaxHealth());
            creature.SetDamageModifier(1.25);

            // Apply a visual effect to indicate hard mode
            creature.CastSpell(creature, SPELL_HARD_MODE_AURA, true);
        } else {
            // Announce that the boss is in normal mode
            creature.SendChatMessage(CHAT_MSG_RAID_BOSS_EMOTE, 0, "The boss is in normal mode. Fight well!");
        }
    }
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_JUST_SUMMONED, CheckBossLootMode);
```
In this example, when the boss creature is summoned, the script checks its loot mode using `GetLootMode()`. If the loot mode is set to `HARD_MODE_LOOT`, it announces to the raid that the boss is in hard mode, increases the boss's health and damage, and applies a visual effect to indicate the hard mode. If the loot mode is not set to `HARD_MODE_LOOT`, it announces that the boss is in normal mode.

This allows the raid to prepare accordingly based on the difficulty of the encounter and the expected loot rewards.

## GetLootRecipient
Returns the player that is currently able to loot the creature.  This is typically the player that landed the killing blow, but in a group scenario, the loot may be round-robin or selected by the group leader, depending on loot settings.

### Parameters
None

### Returns
[Player](./player.md) - The player that can loot the creature

### Example Usage
This example will reward the player with extra gold when looting a creature based on the creature's level.

```typescript
const GOLD_MULTIPLIER = 0.5;

const OnCreatureLoot: creature_event_on_loot = (event: number, creature: Creature, player: Player): void => {
    const lootRecipient = creature.GetLootRecipient();

    if (lootRecipient && lootRecipient.GetGUID() === player.GetGUID()) {
        const creatureLevel = creature.GetLevel();
        const bonusGold = Math.floor(creatureLevel * GOLD_MULTIPLIER);

        if (bonusGold > 0) {
            lootRecipient.ModifyMoney(bonusGold);
            lootRecipient.SendBroadcastMessage(`You receive an extra ${bonusGold} gold for looting a level ${creatureLevel} creature!`);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_LOOT, (...args) => OnCreatureLoot(...args));
```

In this example:

1. We define a constant `GOLD_MULTIPLIER` to determine the amount of bonus gold per creature level.
2. In the `OnCreatureLoot` event handler, we get the loot recipient using `creature.GetLootRecipient()`.
3. We check if there is a loot recipient and if it matches the player who triggered the event.
4. If the player is the loot recipient, we calculate the bonus gold based on the creature's level and the `GOLD_MULTIPLIER`.
5. If the bonus gold is greater than 0, we modify the player's money using `lootRecipient.ModifyMoney(bonusGold)` and send a broadcast message to the player informing them of the extra gold they received.

This script encourages players to loot creatures by rewarding them with additional gold based on the creature's level. The higher the level of the creature, the more bonus gold the player will receive.

## GetLootRecipientGroup
Returns the [Group](./group.md) that is currently able to loot this creature. This is determined by the group that did the most damage to the creature or has the most members with loot rights.

### Parameters
None

### Returns
[Group](./group.md) - The group that can loot this creature.

### Example Usage
This example demonstrates how to reward a special item to the group that gets loot rights on a creature kill. It will check if the group can loot the creature, and if so, it will randomly choose a member of the group to receive the special item.

```typescript
const SPECIAL_ITEM_ENTRY = 12345;

const CreatureDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    const lootGroup = creature.GetLootRecipientGroup();

    if (lootGroup) {
        const groupMembers = lootGroup.GetMembers();
        const numMembers = groupMembers.length;

        if (numMembers > 0) {
            // Randomly choose a group member to receive the special item
            const randomIndex = Math.floor(Math.random() * numMembers);
            const luckyMember = groupMembers[randomIndex];

            // Add the special item to the chosen member's inventory
            luckyMember.AddItem(SPECIAL_ITEM_ENTRY, 1);

            // Announce the lucky winner to the group
            lootGroup.SendGroupMessage(`${luckyMember.GetName()} has received a special item for being part of the group that defeated ${creature.GetName()}!`);
        }
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => CreatureDeath(...args));
```

In this example:
1. We define a constant `SPECIAL_ITEM_ENTRY` to represent the entry ID of the special item we want to reward.
2. We register a creature event handler for the `CREATURE_EVENT_ON_JUST_DIED` event.
3. Inside the event handler, we retrieve the group that can loot the creature using `creature.GetLootRecipientGroup()`.
4. If a loot group exists, we get the array of group members using `lootGroup.GetMembers()`.
5. We check if there are any members in the group.
6. If there are members, we randomly select one member using `Math.random()` and array indexing.
7. We add the special item to the chosen member's inventory using `luckyMember.AddItem()`.
8. Finally, we send a message to the entire group announcing the lucky winner using `lootGroup.SendGroupMessage()`.

This script ensures that only the group with loot rights has a chance to receive the special item, and it randomly distributes the item to one of the group members.

## GetNPCFlags
Returns the NPC flags associated with the creature. NPC flags determine the behavior and capabilities of the NPC, such as being a vendor, quest giver, or able to repair items.

### Parameters
None

### Returns
flags: number - The NPC flags associated with the creature.

### Example Usage
```typescript
// Constants for NPC flags
const UNIT_NPC_FLAG_NONE                  = 0;
const UNIT_NPC_FLAG_GOSSIP                = 1;
const UNIT_NPC_FLAG_QUESTGIVER            = 2;
const UNIT_NPC_FLAG_VENDOR                = 128;
const UNIT_NPC_FLAG_REPAIR                = 4096;

// Function to handle gossip events
function onGossipHello(event: PlayerGossipEvent, player: Player, creature: Creature): void {
    const npcFlags = creature.GetNPCFlags();

    if (npcFlags & UNIT_NPC_FLAG_QUESTGIVER) {
        // If the NPC is a quest giver, show available quests
        player.PlayerTalkClass.GetQuestMenu().AddMenuItem(0, 0);
        player.PlayerTalkClass.SendGossipMenu(player.GetGossipTextId(creature), creature.GetGUID());
    }

    if (npcFlags & UNIT_NPC_FLAG_VENDOR) {
        // If the NPC is a vendor, show the vendor window
        player.GetSession().SendListInventory(creature.GetGUID());
    }

    if (npcFlags & UNIT_NPC_FLAG_REPAIR) {
        // If the NPC can repair items, show the repair functionality
        player.GetSession().SendRepairList(creature.GetGUID());
    }

    if (!(npcFlags & UNIT_NPC_FLAG_GOSSIP)) {
        // If the NPC doesn't have the gossip flag, close the gossip window
        player.PlayerTalkClass.SendCloseGossip();
    }
}

// Register the gossip event
RegisterCreatureGossipEvent(NPC_ENTRY, (...args) => onGossipHello(...args));
```

In this example, we define constants for different NPC flags such as `UNIT_NPC_FLAG_QUESTGIVER`, `UNIT_NPC_FLAG_VENDOR`, and `UNIT_NPC_FLAG_REPAIR`. These flags determine the capabilities of the NPC.

We create a function `onGossipHello` to handle the gossip event when a player interacts with the NPC. Inside the function, we retrieve the NPC flags using the `GetNPCFlags` method.

Based on the NPC flags, we perform different actions:
- If the NPC is a quest giver (`UNIT_NPC_FLAG_QUESTGIVER`), we add the quest menu items and send the gossip menu to the player.
- If the NPC is a vendor (`UNIT_NPC_FLAG_VENDOR`), we send the vendor window to the player.
- If the NPC can repair items (`UNIT_NPC_FLAG_REPAIR`), we send the repair functionality to the player.
- If the NPC doesn't have the gossip flag (`UNIT_NPC_FLAG_GOSSIP`), we close the gossip window.

Finally, we register the `onGossipHello` function to handle the gossip event for the specific NPC entry using `RegisterCreatureGossipEvent`.

By utilizing the `GetNPCFlags` method, we can determine the behavior and capabilities of the NPC and provide appropriate functionality to the player based on those flags.

## GetRespawnDelay
Returns the time it takes for the Creature to respawn once it has been killed. This value is usually set in the creature's database entry and does not change over the course of the Creature's lifespan. However, this value can be modified by using the [Creature:SetRespawnDelay](./creature.md#setrespawndelay) method.

### Parameters
None

### Returns
respawnDelay: number - The time in seconds it takes for the Creature to respawn.

### Example Usage
This example demonstrates how to create a script that increases the respawn time of a specific creature by a random amount between 1 and 10 minutes when it dies.

```typescript
const CREATURE_ENTRY = 1234;
const MIN_RESPAWN_DELAY = 60; // 1 minute
const MAX_RESPAWN_DELAY = 600; // 10 minutes

const onCreatureDeath: creature_event_on_creature_death = (event: number, creature: Creature, killer: Unit): void => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        const currentRespawnDelay = creature.GetRespawnDelay();
        const additionalDelay = Math.floor(Math.random() * (MAX_RESPAWN_DELAY - MIN_RESPAWN_DELAY + 1)) + MIN_RESPAWN_DELAY;
        const newRespawnDelay = currentRespawnDelay + additionalDelay;

        creature.SetRespawnDelay(newRespawnDelay);

        console.log(`Creature ${CREATURE_ENTRY} died. Respawn delay increased from ${currentRespawnDelay} to ${newRespawnDelay} seconds.`);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_DEATH, (...args) => onCreatureDeath(...args));
```

In this example:
1. We define constants for the specific creature entry we want to modify, and the minimum and maximum additional respawn delay in seconds.
2. We register a creature event handler for the `CREATURE_EVENT_ON_CREATURE_DEATH` event.
3. When the event is triggered, we check if the died creature's entry matches our desired entry.
4. If it matches, we retrieve the current respawn delay using `GetRespawnDelay()`.
5. We generate a random additional delay between the specified minimum and maximum values.
6. We calculate the new respawn delay by adding the current delay and the additional random delay.
7. We set the new respawn delay using `SetRespawnDelay()`.
8. Finally, we log a message indicating the creature's entry, the original respawn delay, and the new respawn delay.

This script enhances the gameplay experience by making the specified creature's respawn time more unpredictable, adding a sense of dynamism to the world.

## GetScriptId
Returns the unique script ID assigned to this creature's script name by the AzerothCore engine.

### Parameters
None

### Returns
scriptId: number - The unique script ID assigned to this creature's script name.

### Example Usage
This example demonstrates how to use the `GetScriptId()` method to determine if a creature has a specific script attached to it. In this case, we're checking if the creature has the "boss_onyxia" script.

```typescript
const BOSS_ONYXIA_SCRIPT_ID = 12345; // Replace with the actual script ID for "boss_onyxia"

const OnCreatureKill: creature_event_on_creature_kill = (event: number, killer: Unit, killed: Creature) => {
    if (killed.GetScriptId() === BOSS_ONYXIA_SCRIPT_ID) {
        // Onyxia has been killed
        // Perform actions specific to Onyxia's death, such as:
        // - Announcing the kill to the server
        SendWorldMessage("Onyxia has been slain by " + killer.GetName() + "!");

        // - Granting rewards to the raid group
        const group = killer.GetGroup();
        if (group) {
            for (const member of group.GetMembers()) {
                member.AddItem(ONYXIA_SCALE, 1); // Give each raid member an Onyxia Scale
                member.ModifyMoney(100 * 10000); // Give each raid member 100 gold
            }
        }

        // - Updating the world state or quest status
        SetWorldState(ONYXIA_KILLED_WORLD_STATE, 1); // Set a world state to indicate Onyxia has been killed
        killer.AreaExploredOrEventHappens(ONYXIA_QUEST_ENTRY); // Mark the Onyxia quest as completed for the killer
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_KILL, (...args) => OnCreatureKill(...args));
```

In this example, when a creature is killed, we check if its script ID matches the ID for the "boss_onyxia" script. If it does, we perform actions specific to Onyxia's death, such as announcing the kill to the server, granting rewards to the raid group, updating the world state, and marking the Onyxia quest as completed for the killer.

Using `GetScriptId()` allows you to identify creatures with specific scripts attached to them and perform custom actions based on those scripts.

## GetScriptName

Returns the script name assigned to the Creature. This script name is used by the core to apply C++ scripts to the Creature. However, it is important to note that Eluna will override any AI scripts assigned through this method.

### Parameters

This method does not take any parameters.

### Returns

* string - The script name assigned to the Creature.

### Example Usage

This example demonstrates how to retrieve the script name of a Creature and perform different actions based on the script name.

```typescript
const CREATURE_ENTRY = 1234;

const OnCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    const scriptName = creature.GetScriptName();

    switch (scriptName) {
        case "npc_example_script_1":
            // Perform actions specific to script "npc_example_script_1"
            creature.SetEquipmentSlots(0, 12345, 0, 0); // Set main hand weapon
            creature.SetHomePosition(creature.GetX(), creature.GetY(), creature.GetZ(), creature.GetO());
            break;
        case "npc_example_script_2":
            // Perform actions specific to script "npc_example_script_2"
            creature.SetUInt32Value(UnitFields.UNIT_NPC_FLAGS, NPCFlags.GOSSIP);
            creature.SetUInt32Value(UnitFields.UNIT_NPC_FLAGS, creature.GetUInt32Value(UnitFields.UNIT_NPC_FLAGS) | NPCFlags.QUESTGIVER);
            break;
        default:
            // Perform default actions for creatures without a specific script
            creature.SetUInt32Value(UnitFields.UNIT_NPC_FLAGS, NPCFlags.GOSSIP);
            break;
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, OnCreatureSpawn);
```

In this example:
1. We define a constant `CREATURE_ENTRY` to specify the entry ID of the Creature we want to handle.
2. We register the `OnCreatureSpawn` event handler for the specified Creature entry using `RegisterCreatureEvent()`.
3. Inside the event handler, we retrieve the script name of the spawned Creature using `creature.GetScriptName()`.
4. We use a `switch` statement to perform different actions based on the script name:
   - If the script name is "npc_example_script_1", we set the Creature's main hand weapon using `SetEquipmentSlots()` and set its home position using `SetHomePosition()`.
   - If the script name is "npc_example_script_2", we set the Creature's NPC flags to enable gossip and quest giver functionality using `SetUInt32Value()`.
   - If the script name doesn't match any specific case, we perform default actions, such as setting the NPC flags to enable gossip.
5. The event handler will be called whenever a Creature with the specified entry ID spawns in the game world.

This example showcases how you can utilize the `GetScriptName()` method to retrieve the script name assigned to a Creature and perform different actions based on the script name. It allows you to customize the behavior of Creatures with specific script names while providing a default behavior for Creatures without a specific script.

## GetShieldBlockValue
Returns the shield block value for the Creature. This value represents the amount of damage that the Creature can block with its shield.

### Parameters
None

### Returns
* number - The shield block value of the Creature.

### Example Usage
This example demonstrates how to retrieve the shield block value of a Creature and adjust its stats based on that value.

```typescript
const CREATURE_ENTRY = 1234;
const SHIELD_BLOCK_THRESHOLD = 100;
const BONUS_ARMOR = 500;

const CreatureScript: creature_event_on_spawn = (event: number, creature: Creature): void => {
    const shieldBlockValue = creature.GetShieldBlockValue();

    if (shieldBlockValue >= SHIELD_BLOCK_THRESHOLD) {
        const healthBonus = Math.floor(shieldBlockValue / SHIELD_BLOCK_THRESHOLD) * 1000;
        creature.SetMaxHealth(creature.GetMaxHealth() + healthBonus);
        creature.SetHealth(creature.GetHealth() + healthBonus);

        const armorBonus = Math.floor(shieldBlockValue / SHIELD_BLOCK_THRESHOLD) * BONUS_ARMOR;
        creature.SetArmor(creature.GetArmor() + armorBonus);

        creature.SendUnitWhisper("My shield is strong! I gain bonus health and armor.", 0, creature.GetGUID());
    } else {
        creature.SendUnitWhisper("My shield is weak. I must rely on my other defenses.", 0, creature.GetGUID());
    }
};

const entryBinding = RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => CreatureScript(...args));
```

In this example:
1. We define the `CREATURE_ENTRY` constant to specify the entry ID of the Creature we want to modify.
2. We define the `SHIELD_BLOCK_THRESHOLD` constant as a threshold value for the shield block value.
3. We define the `BONUS_ARMOR` constant as the amount of bonus armor to grant the Creature for each threshold exceeded.
4. Inside the `CreatureScript` function, we retrieve the shield block value of the Creature using `creature.GetShieldBlockValue()`.
5. We check if the shield block value is greater than or equal to the `SHIELD_BLOCK_THRESHOLD`.
6. If the threshold is met, we calculate the bonus health and armor based on the shield block value and the defined constants.
7. We update the Creature's max health, current health, and armor using the calculated bonus values.
8. We send a whisper to the Creature indicating that its shield is strong and it gains bonus health and armor.
9. If the threshold is not met, we send a whisper to the Creature indicating that its shield is weak.
10. Finally, we register the `CreatureScript` function to be triggered when a Creature with the specified `CREATURE_ENTRY` spawns using `RegisterCreatureEvent`.

This example showcases how the `GetShieldBlockValue` method can be used to retrieve the shield block value of a Creature and make decisions or adjustments based on that value, such as granting bonus stats or providing visual feedback to the Creature.

## GetWanderRadius
Returns the radius, in yards, that the Creature is allowed to wander or patrol from its spawn point.

### Parameters
None

### Returns
radius: number - The wander radius in yards.

### Example Usage
This example demonstrates how to use the `GetWanderRadius` method to create a script that doubles the wander radius of creatures when they spawn, and halves it when they die.

```typescript
// Event handler for creature spawn
const onCreatureSpawn: creature_event_on_spawn = (event: CreatureEvents, creature: Creature) => {
    const originalWanderRadius = creature.GetWanderRadius();
    const doubledWanderRadius = originalWanderRadius * 2;

    creature.SetWanderRadius(doubledWanderRadius);

    console.log(`[Creature Spawn] Creature ID: ${creature.GetEntry()} - Original Wander Radius: ${originalWanderRadius} - Doubled Wander Radius: ${doubledWanderRadius}`);
};

// Event handler for creature death
const onCreatureDeath: creature_event_on_died = (event: CreatureEvents, creature: Creature, killer: Unit) => {
    const originalWanderRadius = creature.GetWanderRadius();
    const halvedWanderRadius = originalWanderRadius / 2;

    creature.SetWanderRadius(halvedWanderRadius);

    console.log(`[Creature Death] Creature ID: ${creature.GetEntry()} - Original Wander Radius: ${originalWanderRadius} - Halved Wander Radius: ${halvedWanderRadius}`);
};

// Register the event handlers
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (event, creature) => onCreatureSpawn(event, creature));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DIED, (event, creature, killer) => onCreatureDeath(event, creature, killer));
```

In this example:
1. The `onCreatureSpawn` event handler is triggered when a creature spawns.
   - It retrieves the creature's original wander radius using `GetWanderRadius()`.
   - It calculates the doubled wander radius by multiplying the original radius by 2.
   - It sets the creature's new wander radius using `SetWanderRadius()`.
   - It logs the creature's ID, original wander radius, and doubled wander radius.

2. The `onCreatureDeath` event handler is triggered when a creature dies.
   - It retrieves the creature's current wander radius using `GetWanderRadius()`.
   - It calculates the halved wander radius by dividing the current radius by 2.
   - It sets the creature's new wander radius using `SetWanderRadius()`.
   - It logs the creature's ID, original wander radius, and halved wander radius.

3. The event handlers are registered using `RegisterCreatureEvent` for the respective events (`CREATURE_EVENT_ON_SPAWN` and `CREATURE_EVENT_ON_DIED`).

This script effectively doubles the wander radius of creatures when they spawn and halves it when they die, providing a dynamic adjustment to their movement behavior based on their lifecycle events.

## GetWaypointPath

Returns the current waypoint path ID of the Creature. Waypoint paths are defined in the `waypoint_data` table in the world database. Each waypoint path consists of a series of coordinates that the Creature follows in a specific order. The path ID is a unique identifier for each waypoint path.

### Parameters

None

### Returns

* pathId: number - The current waypoint path ID of the Creature. Returns 0 if the Creature is not following a waypoint path.

### Example Usage

Retrieve the waypoint path ID of a Creature and modify its movement behavior based on the path.

```typescript
const CREATURE_ENTRY = 12345;
const WAYPOINT_PATH_ID_1 = 1;
const WAYPOINT_PATH_ID_2 = 2;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    const pathId = creature.GetWaypointPath();

    if (creature.GetEntry() === CREATURE_ENTRY) {
        if (pathId === WAYPOINT_PATH_ID_1) {
            // Creature is following waypoint path 1
            creature.SetWalk(true); // Set the Creature to walk mode
            creature.SetHomePosition(creature.GetX(), creature.GetY(), creature.GetZ(), creature.GetO());
            creature.LoadPath(pathId); // Load the waypoint path
            creature.SetDefaultMovementType(0); // Set movement type to waypoint movement
            creature.GetMotionMaster().MovePath(pathId, true); // Start moving along the path
        } else if (pathId === WAYPOINT_PATH_ID_2) {
            // Creature is following waypoint path 2
            creature.SetRun(true); // Set the Creature to run mode
            creature.SetHomePosition(creature.GetX(), creature.GetY(), creature.GetZ(), creature.GetO());
            creature.LoadPath(pathId); // Load the waypoint path
            creature.SetDefaultMovementType(0); // Set movement type to waypoint movement
            creature.GetMotionMaster().MovePath(pathId, false); // Start moving along the path without repeating
        } else {
            // Creature is not following a waypoint path
            creature.SetWalk(true); // Set the Creature to walk mode
            creature.SetDefaultMovementType(1); // Set movement type to random movement
            creature.GetMotionMaster().MoveRandom(5.0); // Start moving randomly within a 5-yard radius
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example, when a Creature with the specified entry spawns, it retrieves the waypoint path ID using `GetWaypointPath()`. Based on the path ID, the Creature's movement behavior is modified accordingly.

If the Creature is following waypoint path 1, it is set to walk mode, and its home position is set. The waypoint path is loaded, the movement type is set to waypoint movement, and the Creature starts moving along the path, repeating it indefinitely.

If the Creature is following waypoint path 2, it is set to run mode, and its home position is set. The waypoint path is loaded, the movement type is set to waypoint movement, and the Creature starts moving along the path without repeating.

If the Creature is not following any waypoint path, it is set to walk mode, and its movement type is set to random movement. The Creature starts moving randomly within a 5-yard radius.

This example demonstrates how you can use `GetWaypointPath()` to determine the current waypoint path of a Creature and customize its movement behavior based on the path ID.

## HasCategoryCooldown
Checks if the Creature has a category cooldown which prevents them from casting the specified spell.

### Parameters
* spellId: number - The ID of the spell to check the category cooldown for.

### Returns
* boolean - Returns `true` if the Creature cannot cast the spell due to a category cooldown, and returns `false` otherwise.

### Example Usage
Create a script to prevent a boss from spamming a powerful ability by checking the category cooldown before casting.

```typescript
const BOSS_ENTRY = 12345;
const SPELL_ID = 67890;
const CATEGORY_COOLDOWN = 30000; // 30 seconds

const SpellCheck: creature_event_on_spawn = (event: number, creature: Creature) => {
    const isBoss = creature.GetEntry() === BOSS_ENTRY;

    if (isBoss) {
        const canCastSpell = !creature.HasCategoryCooldown(SPELL_ID);

        if (canCastSpell) {
            creature.CastSpell(creature, SPELL_ID, false);
            creature.AddCreatureSpellCooldown(SPELL_ID);

            setTimeout(() => {
                creature.RemoveCreatureSpellCooldown(SPELL_ID);
            }, CATEGORY_COOLDOWN);
        } else {
            console.log(`Boss ${BOSS_ENTRY} cannot cast spell ${SPELL_ID} due to category cooldown.`);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => SpellCheck(...args));
```

In this example:
1. We define constants for the boss entry ID, the spell ID, and the category cooldown duration.
2. In the `SpellCheck` function, we first check if the spawned creature is the boss we're interested in.
3. If it is the boss, we use `HasCategoryCooldown` to check if the boss can cast the specified spell.
4. If the boss can cast the spell (i.e., no category cooldown), we make the boss cast the spell using `CastSpell`, and then add a creature spell cooldown using `AddCreatureSpellCooldown`.
5. We set a timeout to remove the creature spell cooldown after the specified category cooldown duration using `RemoveCreatureSpellCooldown`.
6. If the boss cannot cast the spell due to a category cooldown, we log a message indicating that the boss cannot cast the spell.
7. Finally, we register the `SpellCheck` function to the `CREATURE_EVENT_ON_SPAWN` event using `RegisterCreatureEvent`.

This script ensures that the boss respects the category cooldown and doesn't spam the powerful ability too frequently.

## HasLootMode
This method checks if the creature has a specific loot mode enabled. Loot modes determine how the creature's loot is generated and can be used to create different loot tables for the same creature under different conditions.

### Parameters
* lootMode: number - The loot mode to check for. Valid loot modes are defined in the `LOOT_MODE_*` constants in the [LootModes](./lootmodes.md) enumeration.

### Returns
* boolean - Returns `true` if the creature has the specified loot mode enabled, `false` otherwise.

### Example Usage
In this example, we'll create a script that modifies the loot of a specific creature based on the number of players in the group. If the group size is 5 or more, we'll enable the `LOOT_MODE_HARD_MODE_2` loot mode for the creature, which could drop additional or different items.

```typescript
const CREATURE_ENTRY = 30000;
const LOOT_MODE_HARD_MODE_2 = 4;

const OnCreatureKill: map_event_on_creature_kill = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        const players = creature.GetMap().GetPlayers();
        const groupSize = players.length;

        if (groupSize >= 5) {
            if (!creature.HasLootMode(LOOT_MODE_HARD_MODE_2)) {
                creature.AddLootMode(LOOT_MODE_HARD_MODE_2);
                creature.SendChatMessage(CHAT_MSG_MONSTER_YELL, LANG_UNIVERSAL, "You have proven your strength, now face the true challenge!");
            }
        } else {
            if (creature.HasLootMode(LOOT_MODE_HARD_MODE_2)) {
                creature.RemoveLootMode(LOOT_MODE_HARD_MODE_2);
                creature.SendChatMessage(CHAT_MSG_MONSTER_SAY, LANG_UNIVERSAL, "You are not worthy of the ultimate reward.");
            }
        }
    }
};

RegisterMapEvent(MapEvents.MAP_EVENT_ON_CREATURE_KILL, (...args) => OnCreatureKill(...args));
```

In this script:
1. We define the creature entry and the desired loot mode constant.
2. When a creature is killed, we check if it matches the specific entry we're interested in.
3. We get the list of players in the map and count the group size.
4. If the group size is 5 or more and the creature doesn't already have the `LOOT_MODE_HARD_MODE_2` enabled, we add this loot mode and make the creature yell a challenging message.
5. If the group size is less than 5 and the creature has the `LOOT_MODE_HARD_MODE_2` enabled, we remove this loot mode and make the creature say a dismissive message.

This script showcases how to use the `HasLootMode` method to check for a specific loot mode and modify the creature's loot table based on certain conditions.

## HasLootRecipient
This method checks if the creature has a loot recipient assigned. It will return true if the creature's loot will be given to a player or group, and false if no loot recipient is assigned.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the creature has a loot recipient (player or group) assigned, `false` otherwise.

### Example Usage
This example script listens for the `CREATURE_EVENT_ON_DIED` event and checks if the creature has a loot recipient. If it does, it broadcasts a message to the creature's loot recipient (player or group) indicating that they will receive loot. If no loot recipient is assigned, it broadcasts a message to nearby players that the loot is free for anyone to take.

```typescript
const onCreatureDeath: creature_event_on_died = (event: number, creature: Creature, killer: Unit) => {
    const creatureName = creature.GetName();
    
    if (creature.HasLootRecipient()) {
        const lootRecipient = creature.GetLootRecipient();
        
        if (lootRecipient instanceof Player) {
            lootRecipient.SendBroadcastMessage(`You will receive loot from ${creatureName}'s corpse.`);
        } else if (lootRecipient instanceof Group) {
            lootRecipient.SendGroupMessage(`Your group will receive loot from ${creatureName}'s corpse.`);
        }
    } else {
        const nearbyPlayers = creature.GetPlayersInRadius(30);
        
        nearbyPlayers.forEach((player: Player) => {
            player.SendBroadcastMessage(`${creatureName}'s corpse has no loot recipient. The loot is free for anyone to take!`);
        });
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DIED, (...args) => onCreatureDeath(...args));
```

In this example:
1. When a creature dies, the script checks if it has a loot recipient using the `HasLootRecipient()` method.
2. If a loot recipient is assigned, it determines whether the recipient is a player or a group using the `GetLootRecipient()` method.
   - If the recipient is a player, it sends a broadcast message to that player indicating they will receive loot from the creature's corpse.
   - If the recipient is a group, it sends a group message to all members indicating the group will receive loot from the creature's corpse.
3. If no loot recipient is assigned, it retrieves nearby players within a 30-yard radius using the `GetPlayersInRadius()` method.
   - It then sends a broadcast message to each nearby player, informing them that the creature's corpse has no loot recipient and the loot is free for anyone to take.

This script helps inform players about the loot distribution when a creature dies, based on whether a loot recipient is assigned or not.

## HasQuest
Determines if the creature has the specified quest available for players to start.

### Parameters
* questId: number - The ID of the quest to check.

### Returns
* boolean - Returns `true` if the creature has the quest, `false` otherwise.

### Example Usage
Check if a creature has a specific quest available and display a message to the player.
```typescript
const CREATURE_ENTRY = 1234;
const QUEST_ID = 5678;

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        if (creature.HasQuest(QUEST_ID)) {
            creature.SendUnitWhisper("Greetings, adventurer! I have an important quest for you.", player);
            creature.SendUnitWhisper("Speak with me to learn more about the task at hand.", player);
        } else {
            creature.SendUnitWhisper("I'm sorry, but I don't have any quests available for you at the moment.", player);
            creature.SendUnitWhisper("Please check back with me later, as I may have new opportunities in the future.", player);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
```
In this example:
1. We define the entry ID of the creature and the ID of the quest we want to check.
2. In the `OnGossipHello` event handler, we check if the creature interacted with has the specified entry ID.
3. If the creature has the desired entry ID, we use the `HasQuest` method to determine if the creature has the specified quest available.
4. If the creature has the quest, we send whisper messages to the player indicating that the creature has an important quest for them and encourages them to speak with the creature to learn more.
5. If the creature does not have the quest, we send whisper messages to the player apologizing and informing them that the creature doesn't have any quests available at the moment, and suggests checking back later for new opportunities.
6. Finally, we register the `OnGossipHello` event handler using `RegisterPlayerEvent` to handle the player's interaction with the creature.

This example demonstrates how to use the `HasQuest` method to check if a specific creature has a particular quest available, and provides a more immersive experience for the player by sending appropriate whisper messages based on the quest availability.

## HasSearchedAssistance
Returns a boolean value indicating whether the creature has already searched for combat assistance.

### Parameters
None

### Returns
boolean - `true` if the creature has already searched for combat assistance, `false` otherwise.

### Example Usage
In this example, we'll create a script that checks if a creature has searched for assistance and if not, it will search for nearby friendly creatures to assist in combat.

```typescript
const FRIENDLY_CREATURE_ENTRY = 1234;
const SEARCH_RADIUS = 20;

const onCreatureEnterCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit): void => {
    if (!creature.HasSearchedAssistance()) {
        const nearbyCreatures = creature.GetCreaturesInRange(SEARCH_RADIUS, FRIENDLY_CREATURE_ENTRY);

        if (nearbyCreatures.length > 0) {
            creature.SendChatMessage(ChatMsg.CHAT_MSG_MONSTER_SAY, 0, "Calling for help!");

            nearbyCreatures.forEach((friendly: Creature) => {
                if (!friendly.IsInCombat()) {
                    friendly.SetTarget(target);
                    friendly.EnterCombat(target);
                }
            });
        } else {
            creature.SendChatMessage(ChatMsg.CHAT_MSG_MONSTER_SAY, 0, "No allies nearby. I must fight alone!");
        }
    } else {
        creature.SendChatMessage(ChatMsg.CHAT_MSG_MONSTER_SAY, 0, "I've already called for assistance. Time to focus on the battle!");
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => onCreatureEnterCombat(...args));
```

In this script:
1. We define constants for the friendly creature entry ID and the search radius.
2. When the creature enters combat, we check if it has already searched for assistance using the `HasSearchedAssistance()` method.
3. If the creature hasn't searched for assistance yet:
   - We use `GetCreaturesInRange()` to find nearby friendly creatures within the specified search radius.
   - If friendly creatures are found, the creature sends a chat message indicating it's calling for help.
   - We iterate over the nearby friendly creatures and set their target to the current target if they're not already in combat, effectively bringing them into the fight.
   - If no allies are found, the creature sends a chat message stating it must fight alone.
4. If the creature has already searched for assistance, it sends a chat message indicating it has already called for help and must focus on the battle.

This script demonstrates how to use the `HasSearchedAssistance()` method to prevent the creature from repeatedly searching for assistance during combat. It also showcases how to find nearby friendly creatures and bring them into the fight if the creature hasn't already searched for assistance.

## HasSpell

Determines if the creature has the specified spell in its spell list and can cast it while mind-controlled.

### Parameters
- `spellId`: number - The ID of the spell to check.

### Returns
- boolean - Returns `true` if the creature has the spell and can cast it while mind-controlled, `false` otherwise.

### Example Usage

In this example, we'll create a script that checks if a creature has a specific spell and can cast it while mind-controlled. If the creature has the spell, it will be mind-controlled and forced to cast the spell on a random player within range.

```typescript
const CREATURE_ENTRY = 1234; // Replace with the desired creature entry ID
const SPELL_ID = 5678; // Replace with the ID of the spell to check and cast

const MindControlCreature: player_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        if (creature.HasSpell(SPELL_ID)) {
            // Get all players within a certain range of the creature
            const nearbyPlayers = creature.GetPlayersInRange(30);

            if (nearbyPlayers.length > 0) {
                // Select a random player from the nearby players
                const randomPlayer = nearbyPlayers[Math.floor(Math.random() * nearbyPlayers.length)];

                // Mind control the creature
                creature.SetFaction(35); // Set the creature's faction to friendly
                creature.SetCharmerGUID(player.GetGUID());
                creature.SetOwnerGUID(player.GetGUID());

                // Force the creature to cast the spell on the random player
                creature.CastSpell(randomPlayer, SPELL_ID, true);

                // After a short delay, remove the mind control
                creature.RegisterEvent((): void => {
                    creature.RemoveCharmer();
                    creature.SetOwnerGUID(0);
                    creature.SetFaction(creature.GetDefaultFaction());
                }, 5000, 1);

                player.SendBroadcastMessage(`You have mind-controlled the creature and forced it to cast spell ${SPELL_ID} on ${randomPlayer.GetName()}!`);
            } else {
                player.SendBroadcastMessage("There are no nearby players to target with the spell.");
            }
        } else {
            player.SendBroadcastMessage("The creature does not have the specified spell.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => MindControlCreature(...args));
```

In this script:
1. We define the creature entry ID and the spell ID that we want to check and cast.
2. When a player interacts with the creature via gossip, the script checks if the creature has the specified spell using `HasSpell()`.
3. If the creature has the spell, it retrieves all players within a 30-yard range using `GetPlayersInRange()`.
4. If there are nearby players, it selects a random player from the list.
5. The creature is then mind-controlled by setting its faction, charmer GUID, and owner GUID.
6. The creature is forced to cast the spell on the randomly selected player using `CastSpell()`.
7. After a short delay of 5 seconds, the mind control is removed by resetting the creature's faction, charmer, and owner.
8. The player receives a message indicating the success of the mind control and the target player.
9. If there are no nearby players or the creature doesn't have the specified spell, appropriate messages are sent to the player.

This script showcases the usage of `HasSpell()` to check if a creature has a specific spell and can cast it while mind-controlled, along with additional functionality to mind control the creature and force it to cast the spell on a random nearby player.

## HasSpellCooldown
Returns a boolean value indicating whether the specified spell is currently on cooldown for the creature.

### Parameters
* spellId: number - The ID of the spell to check for cooldown.

### Returns
* boolean - Returns `true` if the spell is on cooldown, `false` otherwise.

### Example Usage
In this example, we create a script that checks if a creature has a specific spell on cooldown before casting it. If the spell is not on cooldown, the creature will cast the spell on its current target.

```typescript
const CREATURE_ENTRY = 1234;
const SPELL_ID = 5678;

const CreatureUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    if (!creature.IsCombat() || !creature.IsAlive()) {
        return;
    }

    const target = creature.GetVictim();
    if (!target) {
        return;
    }

    if (creature.HasSpellCooldown(SPELL_ID)) {
        // Spell is on cooldown, do not cast
        return;
    }

    // Spell is not on cooldown, cast it on the target
    creature.CastSpell(target, SPELL_ID, false);

    // Put the spell on cooldown
    const cooldownTime = 5000; // 5 seconds cooldown
    creature.AddCreatureSpellCooldown(SPELL_ID, cooldownTime);
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => CreatureUpdate(...args));
```

In this script, we first check if the creature is in combat and alive. If either condition is not met, we return early. 

Next, we get the creature's current target using `GetVictim()`. If there is no target, we return early.

We then use the `HasSpellCooldown()` method to check if the specified spell (`SPELL_ID`) is currently on cooldown for the creature. If the spell is on cooldown, we return early without casting the spell.

If the spell is not on cooldown, we proceed to cast the spell on the target using `CastSpell()`. We pass `false` as the third argument to indicate that this is not a triggered spell cast.

After casting the spell, we put it on cooldown using `AddCreatureSpellCooldown()`. We specify the spell ID and the cooldown time in milliseconds (5 seconds in this example).

Finally, we register the script to the creature's `CREATURE_EVENT_ON_UPDATE` event using `RegisterCreatureEvent()`.

This script ensures that the creature only casts the specified spell when it is off cooldown, preventing excessive or rapid spell casting.

## IsBotTank
Returns true if the creature is flagged as a tank role in the database.  This is commonly used to check if a creature should be tanking or not.

### Parameters
None

### Returns
boolean - True if the creature is flagged as a tank role in the database, false otherwise.

### Example Usage
This example demonstrates how to use the `IsBotTank()` method to determine if a creature should be tanking or not. In this example, we have a custom AI script for a creature that checks if it should be tanking based on its role in the database. If the creature is flagged as a tank, it will cast a taunt spell on its target to maintain aggro.

```typescript
const TAUNT_SPELL_ID = 355;

const onAiUpdate: creature_event_on_ai_update = (event: number, creature: Creature, diff: number): void => {
    if (!creature.IsInCombat()) {
        return;
    }

    const target = creature.GetVictim();
    if (!target) {
        return;
    }

    if (creature.IsBotTank()) {
        const tauntSpell = creature.GetSpellInfo(TAUNT_SPELL_ID);
        if (tauntSpell && creature.CanCast(tauntSpell)) {
            creature.CastSpell(target, TAUNT_SPELL_ID, true);
        }
    }

    // Continue with other AI logic...
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_AI_UPDATE, (...args) => onAiUpdate(...args));
```

In this example, we first check if the creature is in combat using the `IsInCombat()` method. If the creature is not in combat, we return early since there's no need to perform any tanking logic.

Next, we get the creature's current target using the `GetVictim()` method. If the creature doesn't have a target, we return early as well.

We then use the `IsBotTank()` method to check if the creature is flagged as a tank role in the database. If it is, we proceed with the tanking logic.

Inside the tanking logic, we first retrieve the taunt spell information using the `GetSpellInfo()` method and the spell ID for the taunt spell (in this case, 355). We then check if the creature can cast the taunt spell using the `CanCast()` method. If both conditions are met, we cast the taunt spell on the creature's target using the `CastSpell()` method with the `triggered` parameter set to `true` to bypass any casting time or cooldown.

After the tanking logic, you can continue with any other AI logic specific to your creature's behavior.

This example showcases how the `IsBotTank()` method can be used in conjunction with other methods and game logic to create a custom AI script for a creature that handles tanking responsibilities based on its designated role.

## IsBotOffTank
Returns true if the creature is an active bot and is assigned the off-tank role in a group or raid. Off-tanks are typically responsible for picking up additional enemies in an encounter and helping the main tank mitigate damage.

### Parameters
None

### Returns
boolean - true if the creature is an active bot and assigned as an off-tank, false otherwise.

### Example Usage
```typescript
const BotPartyBalancer: player_event_on_update = (event: number, player: Player, diff: number) => {
    const maxGroupSize = 5;
    const minTanks = 1; 
    const minHealers = 1;
    const minRangedDps = 1; 
    const minMeleeDps = 1;

    // Get all nearby creatures in a 20 yard radius
    const nearbyCreatures = player.GetCreaturesInRange(20);

    let tanks = 0;
    let healers = 0; 
    let rangedDps = 0;
    let meleeDps = 0;

    // Iterate through each creature and increment role variables
    nearbyCreatures.forEach((creature: Creature) => {
        if (creature.IsInRaidWith(player) || creature.IsInGroupWith(player)) {
            if (creature.IsBotOffTank()) 
                tanks++;
            else if (creature.IsBotHealer())
                healers++;
            else if (creature.IsBotRangedDps())
                rangedDps++;
            else if (creature.IsBotMeleeDps()) 
                meleeDps++;
        }
    });

    // Check if the group composition is valid
    if (tanks < minTanks || healers < minHealers || rangedDps < minRangedDps || meleeDps < minMeleeDps) {
        player.SendBroadcastMessage("Invalid bot party composition. Attempting to rebalance...");

        // Attempt to invite additional bots to fill missing roles
        // Implementation details omitted for brevity
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => BotPartyBalancer(...args));
```
In this example, we define a player event handler that triggers periodically to check the composition of the player's group or raid. It iterates through all nearby creatures, checks if they are in the player's group or raid, and increments role-specific variables based on the creature's assigned role using the `IsBotOffTank()`, `IsBotHealer()`, `IsBotRangedDps()`, and `IsBotMeleeDps()` methods.

If the group composition does not meet the minimum requirements for each role (defined by `minTanks`, `minHealers`, `minRangedDps`, and `minMeleeDps`), it sends a broadcast message to the player indicating an invalid composition and attempts to invite additional bots to fill the missing roles.

This example demonstrates how the `IsBotOffTank()` method can be used in conjunction with other role-checking methods to ensure a balanced party composition when using bot creatures in a group or raid setting.

## IsCivilian
The `IsCivilian` method checks if the creature is a civilian NPC or not. Civilian NPCs are usually non-combat NPCs that can be found in cities and towns, such as vendors, quest givers, and other interactive NPCs.

### Parameters
This method does not take any parameters.

### Returns
- `boolean` - Returns `true` if the creature is a civilian NPC, `false` otherwise.

### Example Usage
In this example, we'll create a script that checks if a creature is a civilian NPC and performs different actions based on the result.

```typescript
const CIVILIAN_NPC_ENTRY = 1234; // Replace with the actual civilian NPC entry ID

const OnCreatureKill: creature_event_on_creature_kill = (event: number, killer: Unit, killed: Creature) => {
    if (killed.GetEntry() === CIVILIAN_NPC_ENTRY) {
        if (killed.IsCivilian()) {
            // The killed creature is a civilian NPC
            if (killer instanceof Player) {
                // The killer is a player
                const player = killer as Player;
                player.SendBroadcastMessage("You have killed a civilian NPC! Your reputation with the city has decreased.");
                
                // Reduce the player's reputation with the city faction
                const CITY_FACTION_ID = 123; // Replace with the actual city faction ID
                const REPUTATION_LOSS = 500; // Amount of reputation to lose
                player.ModifyFactionReputation(CITY_FACTION_ID, -REPUTATION_LOSS);
                
                // Apply a debuff to the player for killing a civilian
                const DEBUFF_SPELL_ID = 4321; // Replace with the actual debuff spell ID
                player.AddAura(DEBUFF_SPELL_ID, player);
            }
        } else {
            // The killed creature is not a civilian NPC
            if (killer instanceof Player) {
                const player = killer as Player;
                player.SendBroadcastMessage("You have killed a hostile NPC. Well done!");
                
                // Reward the player with experience points and gold
                const EXPERIENCE_REWARD = 1000; // Amount of experience points to reward
                const GOLD_REWARD = 50; // Amount of gold to reward
                player.GiveXP(EXPERIENCE_REWARD);
                player.ModifyMoney(GOLD_REWARD);
            }
        }
    }
};

RegisterCreatureEvent(CIVILIAN_NPC_ENTRY, CreatureEvents.CREATURE_EVENT_ON_CREATURE_KILL, OnCreatureKill);
```

In this example:
1. We define the entry ID of the civilian NPC we want to check.
2. We register a creature event handler for the `CREATURE_EVENT_ON_CREATURE_KILL` event.
3. When a creature is killed, we check if its entry ID matches the civilian NPC entry.
4. If the killed creature is a civilian NPC (determined by `IsCivilian()`), we perform the following actions:
   - If the killer is a player, we send them a broadcast message indicating they killed a civilian NPC.
   - We reduce the player's reputation with the city faction using `ModifyFactionReputation()`.
   - We apply a debuff to the player using `AddAura()` as a penalty for killing a civilian.
5. If the killed creature is not a civilian NPC, we perform different actions:
   - If the killer is a player, we send them a broadcast message indicating they killed a hostile NPC.
   - We reward the player with experience points using `GiveXP()` and gold using `ModifyMoney()`.

This example demonstrates how the `IsCivilian()` method can be used to differentiate between civilian and non-civilian NPCs, allowing for different actions and consequences based on the NPC type.

## IsDamageEnoughForLootingAndReward

Checks if the creature has taken enough damage to be looted and grant rewards to players.

### Returns

boolean - Returns true if the creature is damaged enough for looting and rewards, false otherwise.

### Example Usage

This example demonstrates how to use the `IsDamageEnoughForLootingAndReward` method to determine if a creature should drop loot and grant rewards upon death.

```typescript
const CREATURE_ENTRY = 1234;
const SPECIAL_ITEM_ENTRY = 5678;
const SPECIAL_ITEM_DROP_CHANCE = 10;

const onCreatureDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        if (creature.IsDamageEnoughForLootingAndReward()) {
            // Create a loot table for the creature
            const lootTable = creature.GetLootRecipient().GetLoot();

            // Add a special item to the loot table with a specific drop chance
            lootTable.AddItem(SPECIAL_ITEM_ENTRY, 1, SPECIAL_ITEM_DROP_CHANCE);

            // Generate the loot for the creature
            creature.GenerateLoot();

            // Grant rewards to the players who participated in the kill
            const nearbyPlayers = creature.GetPlayersInRange(50);
            for (const player of nearbyPlayers) {
                if (player.IsInGroup()) {
                    const groupMembers = player.GetGroup().GetMembers();
                    for (const member of groupMembers) {
                        member.AddItem(SPECIAL_ITEM_ENTRY, 1);
                    }
                } else {
                    player.AddItem(SPECIAL_ITEM_ENTRY, 1);
                }
            }
        } else {
            // If the creature is not damaged enough, log a message
            console.log(`Creature ${creature.GetName()} (Entry: ${creature.GetEntry()}) was not damaged enough for looting and rewards.`);
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => onCreatureDeath(...args));
```

In this example:

1. We define constants for the creature entry, special item entry, and special item drop chance.

2. In the `creature_event_on_just_died` event handler, we check if the died creature matches the desired entry.

3. If the creature is damaged enough for looting and rewards (determined by `IsDamageEnoughForLootingAndReward`), we proceed to create a loot table for the creature using `GetLootRecipient().GetLoot()`.

4. We add a special item to the loot table with a specific drop chance using `AddItem`.

5. We generate the loot for the creature using `GenerateLoot()`.

6. We grant rewards to the players who participated in the kill. We get the nearby players within a range of 50 yards using `GetPlayersInRange`.

7. For each nearby player, we check if they are in a group. If they are, we add the special item to each group member's inventory using `AddItem`. If they are not in a group, we add the item directly to the player's inventory.

8. If the creature is not damaged enough for looting and rewards, we log a message indicating that no loot or rewards will be granted.

9. Finally, we register the creature event handler for the specified creature entry using `RegisterCreatureEvent`.

This example showcases how to use the `IsDamageEnoughForLootingAndReward` method to control loot and reward distribution based on the creature's damage state, and demonstrates adding custom loot and granting rewards to players.

## IsDungeonBoss
Returns `true` if the [Creature]'s `flags_extra` includes the Dungeon Boss flag (0x1000000), and returns `false` otherwise. This method is useful for determining if a creature is a boss in a dungeon encounter.

### Parameters
This method does not take any parameters.

### Returns
boolean - `true` if the creature is a dungeon boss, `false` otherwise.

### Example Usage
In this example, we'll create a script that adjusts the loot table of a creature based on whether it is a dungeon boss or not.

```typescript
const DUNGEON_BOSS_LOOT_TABLE = 1234;
const NORMAL_LOOT_TABLE = 5678;

const AdjustLootTable: creature_event_on_just_summoned_creature = (event: number, creature: Creature) => {
    if (creature.IsDungeonBoss()) {
        // If the creature is a dungeon boss, set its loot table to the boss-specific one
        creature.SetLootTable(DUNGEON_BOSS_LOOT_TABLE);

        // Increase the creature's health and damage output for a more challenging fight
        creature.SetMaxHealth(creature.GetMaxHealth() * 1.5);
        creature.SetHealth(creature.GetMaxHealth());
        creature.SetDamage(creature.GetDamage() * 1.25);

        // Announce the presence of the dungeon boss to nearby players
        creature.SendAreaTriggerMessage("A powerful dungeon boss has appeared!");
    } else {
        // If the creature is not a dungeon boss, set its loot table to the normal one
        creature.SetLootTable(NORMAL_LOOT_TABLE);
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE, (...args) => AdjustLootTable(...args));
```

In this script, we first define constants for the dungeon boss and normal loot table IDs. Then, we register a `CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE` event that triggers the `AdjustLootTable` function whenever a creature is summoned.

Inside the `AdjustLootTable` function, we use the `IsDungeonBoss()` method to determine if the summoned creature is a dungeon boss. If it is, we set its loot table to the boss-specific one, increase its health and damage output to make the fight more challenging, and announce the presence of the boss to nearby players using the `SendAreaTriggerMessage()` method.

If the creature is not a dungeon boss, we simply set its loot table to the normal one.

This script demonstrates how the `IsDungeonBoss()` method can be used in combination with other methods and events to create dynamic and engaging encounters in dungeons.

## IsElite
Returns a boolean value indicating whether the creature is an elite or rare elite rank.

### Parameters
None

### Returns
boolean - Returns `true` if the creature's rank is Elite or Rare Elite, and `false` otherwise.

### Example Usage
In this example, we'll create a script that checks if a creature is an elite or rare elite, and if so, it will increase its health and damage by 50% and add a special ability to the creature's loot table.

```typescript
const ABILITY_ENTRY = 12345;

const CreatureEliteScript: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.IsElite()) {
        // Increase the creature's health by 50%
        const currentHealth = creature.GetHealthPct();
        creature.SetHealth(currentHealth * 1.5);

        // Increase the creature's damage by 50%
        const damageMod = creature.GetDamageModifier();
        creature.SetDamageModifier(damageMod * 1.5);

        // Add a special ability to the creature's loot table
        const lootId = creature.GetLootId();
        const loot = sObjectMgr.GetLoot(lootId);
        if (loot) {
            loot.AddItem(ABILITY_ENTRY, 100, 0, 1, 1);
            sObjectMgr.AddLoot(lootId, loot);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => CreatureEliteScript(...args));
```

In this script:
1. We define the `ABILITY_ENTRY` constant to represent the special ability item entry ID.
2. We create a `CreatureEliteScript` function that will be triggered when a creature spawns.
3. Inside the function, we check if the creature is an elite or rare elite using the `IsElite()` method.
4. If the creature is an elite or rare elite:
   - We increase the creature's current health by 50% using `GetHealthPct()` and `SetHealth()` methods.
   - We increase the creature's damage by 50% using `GetDamageModifier()` and `SetDamageModifier()` methods.
   - We retrieve the creature's loot ID using `GetLootId()` and get the corresponding loot object using `sObjectMgr.GetLoot()`.
   - If the loot object exists, we add the special ability item to the loot table with a 100% drop chance using `AddItem()` method.
   - Finally, we update the loot object using `sObjectMgr.AddLoot()`.
5. We register the `CreatureEliteScript` function to be triggered when the `CREATURE_EVENT_ON_SPAWN` event occurs.

This script enhances elite and rare elite creatures by increasing their health and damage, and adding a special ability to their loot table when they spawn. It demonstrates how to use the `IsElite()` method to check the creature's rank and perform specific actions based on the result.

## IsFreeBot
Checks if the creature is a bot that is currently not hired by any player and is available to be hired.

### Parameters
None

### Returns
boolean - Returns `true` if the creature is a bot that is currently not hired by any player and is available to be hired, otherwise returns `false`.

### Example Usage
This example demonstrates how to check if a creature is a free bot and display a message to the player if the bot is available for hire.

```typescript
const CREATURE_ENTRY_BOT = 123456;

const OnGossipHello: creature_event_on_gossip_hello = (event: number, creature: Creature, player: Player): void => {
    if (creature.GetEntry() === CREATURE_ENTRY_BOT) {
        if (creature.IsFreeBot()) {
            player.SendBroadcastMessage(`The bot ${creature.GetName()} is available for hire!`);
            player.GossipMenuAddItem(0, "Hire this bot", 0, 1);
        } else {
            player.SendBroadcastMessage(`The bot ${creature.GetName()} is already hired by another player.`);
        }
        player.GossipSendMenu(DEFAULT_GOSSIP_MESSAGE, creature.GetObjectGuid());
    }
};

const OnGossipSelect: creature_event_on_gossip_select = (event: number, creature: Creature, player: Player, sender: number, action: number): void => {
    if (creature.GetEntry() === CREATURE_ENTRY_BOT && action === 1) {
        if (creature.IsFreeBot()) {
            // Hire the bot
            creature.SetOwnerGuid(player.GetObjectGuid());
            player.SendBroadcastMessage(`You have successfully hired ${creature.GetName()}!`);
            player.GossipComplete();
        } else {
            player.SendBroadcastMessage(`The bot ${creature.GetName()} is no longer available for hire.`);
            player.GossipComplete();
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY_BOT, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterCreatureEvent(CREATURE_ENTRY_BOT, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example:
1. When a player interacts with a creature (opens the gossip menu), the `OnGossipHello` event is triggered.
2. If the creature's entry matches the desired bot entry (`CREATURE_ENTRY_BOT`), it checks if the bot is available for hire using the `IsFreeBot()` method.
3. If the bot is available, it displays a message to the player and adds a gossip menu item to allow the player to hire the bot.
4. If the bot is already hired, it displays a message indicating that the bot is not available.
5. When the player selects the "Hire this bot" option from the gossip menu, the `OnGossipSelect` event is triggered.
6. If the selected action matches the expected action (`action === 1`), it checks again if the bot is still available using `IsFreeBot()`.
7. If the bot is available, it sets the owner of the bot to the player using `SetOwnerGuid()`, displays a success message, and closes the gossip menu.
8. If the bot is no longer available, it displays a message indicating that the bot is not available and closes the gossip menu.

This example showcases how to use the `IsFreeBot()` method to determine if a bot creature is available for hire and allows players to hire the bot through the gossip menu interaction.

## IsGuard
This method checks if the creature is a city guard. City guards are special creatures that protect the cities of Azeroth, such as Stormwind or Orgrimmar. They have unique abilities and behaviors that set them apart from regular creatures.

### Parameters
This method does not take any parameters.

### Returns
- `true` if the creature is a city guard.
- `false` if the creature is not a city guard.

### Example Usage
Let's say you want to create an event that triggers when a player enters a city. You can use the `IsGuard()` method to check if the creatures around the player are city guards, and if so, create a special interaction or dialogue.

```typescript
const STORMWIND_GUARD_ENTRY = 68; // Replace with the actual entry ID of Stormwind guards

const OnPlayerEnterCity: player_event_on_enter_area = (event: number, player: Player, newArea: number, oldArea: number) => {
    // Check if the player entered Stormwind City (area ID 1519)
    if (newArea === 1519) {
        // Get all creatures within a 30-yard radius of the player
        const creaturesNearby = player.GetCreaturesInRange(30);

        // Iterate through the nearby creatures
        for (const creature of creaturesNearby) {
            // Check if the creature is a Stormwind guard
            if (creature.GetEntry() === STORMWIND_GUARD_ENTRY && creature.IsGuard()) {
                // Make the guard say a welcome message to the player
                creature.SendUnitSay("Welcome to Stormwind, " + player.GetName() + "! Enjoy your stay and stay out of trouble.", 0);

                // You can add more interactions or events here, such as:
                // - Offering a special quest or item to the player
                // - Triggering a unique visual effect or sound
                // - Updating the player's reputation with the city faction
                // - Logging the player's visit to the city in the database
                // ...
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_AREA, (...args) => OnPlayerEnterCity(...args));
```

In this example, when a player enters Stormwind City (area ID 1519), the script retrieves all creatures within a 30-yard radius of the player. It then checks each creature to see if it is a Stormwind guard using the `IsGuard()` method. If a guard is found, it sends a welcome message to the player using the `SendUnitSay()` method.

You can expand upon this example by adding more interactions or events specific to city guards, such as offering special quests, items, or triggering unique visual effects or sounds. The `IsGuard()` method allows you to easily identify city guards and create immersive experiences for players when they enter cities.

## IsInEvadeMode
This method checks if the creature is currently in evade mode, which means it is returning to its spawn position after losing aggro or being unable to reach its target.

### Parameters
None

### Returns
boolean - Returns `true` if the creature is in evade mode, `false` otherwise.

### Example Usage
In this example, we create a script that checks if a creature is in evade mode every 5 seconds. If the creature is in evade mode, it will say "I'm returning to my spawn position!" and start running back to its spawn location. If the creature is not in evade mode, it will say "I'm ready to fight!" and start attacking its target if it has one.

```typescript
const CHECK_EVADE_INTERVAL = 5000; // 5 seconds

const CheckEvadeMode = (creature: Creature) => {
    if (creature.IsInEvadeMode()) {
        creature.Say("I'm returning to my spawn position!", 0);
        creature.MovePoint(0, creature.GetSpawnX(), creature.GetSpawnY(), creature.GetSpawnZ());
    } else {
        creature.Say("I'm ready to fight!", 0);
        
        const target = creature.GetVictim();
        if (target) {
            if (!creature.IsInCombat()) {
                creature.EnterCombat(target);
            }
            
            creature.MoveTo(target, true);
        } else {
            creature.MoveRandom(5, 5);
        }
    }
};

const OnCreatureUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    const checkEvadeEvent = creature.GetCreatureData().GetData("check_evade_event");
    
    if (!checkEvadeEvent) {
        // Schedule the evade mode check event
        const newEventId = creature.RegisterEvent(CheckEvadeMode, CHECK_EVADE_INTERVAL, 0, EVENT_FLAG_DO_NOT_EXECUTE_IN_WORLD_CONTEXT);
        creature.GetCreatureData().SetData("check_evade_event", newEventId);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => OnCreatureUpdate(...args));
```

In this script, we register a creature update event that schedules a repeating event to check the creature's evade mode every 5 seconds. The event ID is stored in the creature's data storage to prevent scheduling multiple instances of the same event.

When the `CheckEvadeMode` function is called, it checks if the creature is in evade mode using the `IsInEvadeMode()` method. If the creature is in evade mode, it announces its intention to return to its spawn position and starts moving towards it using `MovePoint()`.

If the creature is not in evade mode, it announces its readiness to fight. It then checks if it has a target using `GetVictim()`. If a target exists and the creature is not already in combat, it enters combat with the target using `EnterCombat()`. The creature then starts moving towards the target using `MoveTo()`. If no target exists, the creature moves randomly within a small area using `MoveRandom()`.

## IsNPCBot
This method checks if the current creature is an NPCBot. It will only work on servers that have NPCBots enabled and the Eluna Mod AraxiaOnline installed.

### Parameters
None

### Returns
boolean - Returns `true` if the creature is an NPCBot, `false` otherwise.

### Example Usage
Here's an example of how to use `IsNPCBot()` to create a script that rewards players for killing NPCBots:

```typescript
const NPCBOT_KILL_REWARD_ITEM = 12345; // Replace with the actual item entry
const NPCBOT_KILL_REWARD_AMOUNT = 1;

const OnCreatureKill: creature_event_on_kill = (event: number, creature: Creature, killer: Unit) => {
    if (creature.IsNPCBot()) {
        const player = killer.ToPlayer();
        if (player) {
            const item = player.AddItem(NPCBOT_KILL_REWARD_ITEM, NPCBOT_KILL_REWARD_AMOUNT);
            if (item) {
                player.SendBroadcastMessage(`You have been rewarded with ${NPCBOT_KILL_REWARD_AMOUNT}x ${item.GetName()} for killing an NPCBot!`);
            } else {
                player.SendBroadcastMessage("Your inventory is full. Please make space to receive the NPCBot kill reward.");
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_KILL, (...args) => OnCreatureKill(...args));
```

In this example:
1. We define constants for the reward item entry and the amount to be given.
2. We register a creature event handler for the `CREATURE_EVENT_ON_KILL` event.
3. Inside the event handler, we first check if the killed creature is an NPCBot using `IsNPCBot()`.
4. If it is an NPCBot, we check if the killer is a player using `killer.ToPlayer()`.
5. If the killer is a player, we attempt to add the reward item to their inventory using `player.AddItem()`.
6. If the item is successfully added (`item` is truthy), we send a broadcast message to the player informing them of the reward.
7. If the item cannot be added (inventory is full), we send a broadcast message to the player asking them to make space in their inventory.

This script encourages players to hunt down and kill NPCBots by rewarding them with a specific item. You can customize the reward item and amount based on your server's needs.

## IsRacialLeader

Determines if the creature is a racial leader of a player faction.

### Returns

boolean - Returns `true` if the creature is a racial leader, `false` otherwise.

### Example Usage

This example demonstrates how to check if a creature is a racial leader and grant players of the same faction a special item when they interact with the leader.

```typescript
const RACIAL_LEADERS = [
    1747,   // Thrall
    4949,   // Tyrande Whisperwind
    3057,   // Cairne Bloodhoof
    10181,  // Sylvanas Windrunner
    2784,   // King Magni Bronzebeard
    4618,   // Gelbin Mekkatorque
];

const SPECIAL_ITEM_ENTRY = 123456;

const OnGossipHello: creature_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (RACIAL_LEADERS.includes(creature.GetEntry()) && player.GetRace() === creature.GetCreatureInfo()?.Civilized) {
        if (creature.IsRacialLeader()) {
            const item = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
            if (item) {
                player.SendBroadcastMessage(`Greetings, ${player.GetName()}. As a member of the ${creature.GetName()}'s faction, please accept this special gift.`);
            } else {
                player.SendBroadcastMessage(`${player.GetName()}, your inventory is full. Please make room to receive a special gift from ${creature.GetName()}.`);
            }
        }
    }
    player.GossipComplete();
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
```

In this example:

1. We define an array `RACIAL_LEADERS` containing the entry IDs of the racial leader creatures.
2. We specify a constant `SPECIAL_ITEM_ENTRY` representing the entry ID of the special item to be granted.
3. Inside the `OnGossipHello` event handler, we check if the interacted creature is a racial leader by comparing its entry ID with the `RACIAL_LEADERS` array.
4. If the creature is a racial leader, we use the `IsRacialLeader()` method to confirm that the creature is indeed a racial leader.
5. If the player belongs to the same faction as the racial leader (determined by comparing the player's race with the creature's civilized race), we proceed to grant the special item.
6. We use the `AddItem()` method to add the special item to the player's inventory. If the item is successfully added, we send a broadcast message to the player confirming the gift. If the player's inventory is full, we send a message indicating that they need to make room to receive the gift.
7. Finally, we call `GossipComplete()` to close the gossip window.

By registering this event handler for the `CREATURE_EVENT_ON_GOSSIP_HELLO` event, players of the same faction as the racial leader will receive a special item when they interact with the leader, provided their inventory has space.

## IsReputationGainDisabled
This method checks if the creature is set to not give reputation when killed.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the creature is set to not give reputation when killed, and `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsReputationGainDisabled` method to create a custom reputation system for certain creatures.

```typescript
// Define the factions and reputation values
const FRIENDLY_FACTION = 1801;
const HOSTILE_FACTION = 1802;
const REPUTATION_GAIN = 100;

// Event handler for creature on death
const OnCreatureDeath: creature_event_on_died = (event: number, creature: Creature, killer: Unit) => {
    // Check if the killer is a player
    if (killer instanceof Player) {
        const player = killer as Player;

        // Check if the creature is set to not give reputation
        if (!creature.IsReputationGainDisabled()) {
            // Determine the faction based on the creature's entry
            const faction = creature.GetEntry() % 2 === 0 ? FRIENDLY_FACTION : HOSTILE_FACTION;

            // Adjust reputation based on the faction
            if (faction === FRIENDLY_FACTION) {
                player.SetReputation(faction, player.GetReputation(faction) + REPUTATION_GAIN);
                player.SendBroadcastMessage(`You have gained ${REPUTATION_GAIN} reputation with the Friendly Faction.`);
            } else {
                player.SetReputation(faction, player.GetReputation(faction) - REPUTATION_GAIN);
                player.SendBroadcastMessage(`You have lost ${REPUTATION_GAIN} reputation with the Hostile Faction.`);
            }
        } else {
            player.SendBroadcastMessage("This creature does not grant reputation.");
        }
    }
};

// Register the event
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DIED, (...args) => OnCreatureDeath(...args));
```

In this example:
1. We define constants for the faction IDs and the reputation gain value.
2. In the `OnCreatureDeath` event handler, we first check if the killer is a player using the `instanceof` operator.
3. We then use the `IsReputationGainDisabled` method to check if the creature is set to not give reputation.
4. If the creature gives reputation, we determine the faction based on the creature's entry ID (even entries are friendly, odd entries are hostile).
5. Depending on the faction, we adjust the player's reputation using the `SetReputation` method and send a broadcast message to inform the player.
6. If the creature is set to not give reputation, we send a different broadcast message to the player.
7. Finally, we register the event handler for the `CREATURE_EVENT_ON_DIED` event.

This example showcases how the `IsReputationGainDisabled` method can be used in conjunction with other methods and game events to create a custom reputation system for specific creatures, providing a more engaging gameplay experience.

## IsTappedBy
This method checks if the creature has been tapped by a specific player. A creature is considered tapped if it has been engaged in combat by a player or their group, and will only provide loot and experience to those players.

### Parameters
* player: [Player](./player.md) - The player to check if they have tapped the creature.

### Returns
* boolean - Returns `true` if the creature has been tapped by the specified player, and `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsTappedBy` method to prevent players from interfering with another player's combat encounter. When a player enters combat with a creature, the script checks if the creature has already been tapped by another player. If it has, the player is sent a message indicating that the creature is busy and cannot be engaged.

```typescript
const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    if (enemy instanceof Creature) {
        const creature = enemy as Creature;

        // Check if the creature is already tapped by another player
        const nearbyPlayers = creature.GetPlayersInRadius(50);
        for (const nearbyPlayer of nearbyPlayers) {
            if (nearbyPlayer !== player && creature.IsTappedBy(nearbyPlayer)) {
                player.SendBroadcastMessage(`The ${creature.GetName()} is already engaged in combat with another player.`);
                player.CombatStop(true);
                return;
            }
        }

        // If the creature is not tapped, proceed with combat
        player.SendBroadcastMessage(`You engage the ${creature.GetName()} in combat!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this example:
1. When a player enters combat with a unit, the script checks if the unit is a creature using the `instanceof` operator.
2. If the unit is a creature, the script retrieves all nearby players within a 50-yard radius using the `GetPlayersInRadius` method.
3. It then iterates over the nearby players and checks if any of them (excluding the current player) have already tapped the creature using the `IsTappedBy` method.
4. If the creature is already tapped by another player, the script sends a message to the current player indicating that the creature is busy and cannot be engaged. It also stops the combat for the current player using `CombatStop(true)`.
5. If the creature is not tapped by any other player, the script allows the combat to proceed and sends a message to the player confirming the engagement.

This example demonstrates how the `IsTappedBy` method can be used to manage creature tapping and prevent players from interfering with each other's combat encounters.

## IsTargetableForAttack
This method checks if the creature is targetable for attack. It considers various factors such as creature's state, flags, and specified conditions.

### Parameters
* `mustBeDead` (optional): boolean
  - If set to `true`, the method will return `true` only if the creature is dead and targetable.
  - If set to `false` or not provided, the creature must be alive and targetable for the method to return `true`.

### Returns
* boolean: Returns `true` if the creature is targetable for attack based on the specified conditions, `false` otherwise.

### Example Usage
In this example, we have a custom AI script for a creature that checks if it can be targeted for attack before executing its combat logic.

```typescript
const AI_INTERVAL = 1000;
const SPELL_FROSTBOLT = 15043;

const onUpdateAI: creature_event_on_aiupdate = (event: number, creature: Creature, diff: number) => {
    if (!creature.IsInCombat()) {
        return;
    }

    if (creature.GetHealthPct() < 30 && creature.IsTargetableForAttack(true)) {
        // If the creature is below 30% health and targetable while dead, cast a special ability
        creature.CastSpell(creature, SPELL_SPECIAL_ABILITY, true);
    }

    // Check if the creature is alive and targetable before continuing with combat logic
    if (!creature.IsTargetableForAttack()) {
        return;
    }

    if (creature.GetVictim() && creature.IsWithinMeleeRange(creature.GetVictim())) {
        // In melee range, perform melee attacks
        if (creature.IsAttackReady()) {
            creature.AttackerStateUpdate(creature.GetVictim());
            creature.ResetAttackTimer();
        }
    } else {
        // Not in melee range, cast spells
        if (creature.IsSpellReady(SPELL_FROSTBOLT)) {
            creature.CastSpell(creature.GetVictim(), SPELL_FROSTBOLT, false);
            creature.SetSpellCooldown(SPELL_FROSTBOLT, 3000);
        }
    }
};

RegisterCreatureEvent(EVENT_ON_AIUPDATE, (...args) => onUpdateAI(...args));
```

In this script:
1. We first check if the creature is in combat. If not, we return early.
2. If the creature's health is below 30% and it is targetable while dead (`mustBeDead` set to `true`), we cast a special ability.
3. We then check if the creature is alive and targetable using `IsTargetableForAttack()` with the default `mustBeDead` value (`false`). If not, we return early to prevent further combat logic execution.
4. If the creature has a victim and is within melee range, it performs melee attacks using `AttackerStateUpdate()` when ready.
5. If the creature is not in melee range, it casts the "Frostbolt" spell (`SPELL_FROSTBOLT`) when the spell is ready.

This script demonstrates how `IsTargetableForAttack()` can be used to conditionally execute combat logic based on the creature's targetability state.

## IsTrigger
Returns whether the creature is an invisible trigger or not.

### Parameters
None

### Returns
boolean - Returns `true` if the creature is an invisible trigger, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsTrigger` method to determine if a creature is an invisible trigger and perform different actions based on the result.

```typescript
const INVISIBLE_TRIGGER_ENTRY = 12345;

const HandleCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === INVISIBLE_TRIGGER_ENTRY) {
        if (creature.IsTrigger()) {
            // Creature is an invisible trigger
            const triggerLocation = creature.GetLocation();
            player.Teleport(triggerLocation.map, triggerLocation.x, triggerLocation.y, triggerLocation.z, triggerLocation.o);
            player.SendBroadcastMessage("You have activated the invisible trigger!");
            
            // Perform additional actions for the invisible trigger
            const questId = 678;
            if (!player.HasQuest(questId)) {
                player.AddQuest(questId);
                player.SendBroadcastMessage("You have received a new quest!");
            }
            
            // Spawn a special NPC near the trigger location
            const npcEntry = 9876;
            const spawnLocation = creature.GetRelativePoint(2.0, 0.0);
            const spawnedNpc = player.SummonCreature(npcEntry, spawnLocation.x, spawnLocation.y, spawnLocation.z, spawnLocation.o, 2, 60000);
            if (spawnedNpc) {
                spawnedNpc.Say("Greetings, adventurer! I have been awaiting your arrival.", 0);
            }
        } else {
            // Creature is not an invisible trigger
            player.SendBroadcastMessage("You have killed a regular creature.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => HandleCreatureKill(...args));
```

In this example:
1. We define the entry ID of the invisible trigger creature as `INVISIBLE_TRIGGER_ENTRY`.
2. In the `HandleCreatureKill` event handler, we check if the killed creature's entry matches the invisible trigger entry.
3. If it does, we use `creature.IsTrigger()` to determine if the creature is an invisible trigger.
4. If the creature is an invisible trigger:
   - We get the trigger's location using `creature.GetLocation()`.
   - We teleport the player to the trigger's location using `player.Teleport()`.
   - We send a broadcast message to the player indicating they have activated the invisible trigger.
   - We perform additional actions, such as adding a quest to the player's quest log if they don't already have it.
   - We spawn a special NPC near the trigger location using `player.SummonCreature()` and make the NPC say a greeting message.
5. If the creature is not an invisible trigger, we send a different broadcast message to the player indicating they have killed a regular creature.

This example showcases how the `IsTrigger` method can be used in conjunction with other methods and game events to create interactive triggers in the game world.

## IsWorldBoss

Determines if the creature is a world boss. World bosses are typically powerful raid encounters that require a group of players to defeat.

### Parameters

None

### Returns

boolean - Returns `true` if the creature is a world boss, `false` otherwise.

### Example Usage

This example demonstrates how to use the `IsWorldBoss()` method to determine if a creature is a world boss and adjust its loot accordingly.

```typescript
const WORLD_BOSS_LOOT_ITEM = 12345;
const WORLD_BOSS_LOOT_CHANCE = 25;

const onCreatureDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    if (creature.IsWorldBoss()) {
        // Increase the respawn time for world bosses
        creature.SetRespawnDelay(172800); // 48 hours in seconds

        // Notify the raid group that they have defeated a world boss
        killer.ToPlayer().GetGroup().SendGroupMessage(`Congratulations on defeating the world boss ${creature.GetName()}!`);

        // Increase the drop chance of a special loot item for world bosses
        const lootChance = creature.GetLootMode() == 1 ? WORLD_BOSS_LOOT_CHANCE * 2 : WORLD_BOSS_LOOT_CHANCE;
        if (Math.random() * 100 < lootChance) {
            creature.AddLootMode(LOOT_MODE_HARD_MODE_1);
            const loot = creature.AddLoot(WORLD_BOSS_LOOT_ITEM, LootType.LOOT_CORPSE);
            loot.SetItemCount(1);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => onCreatureDeath(...args));
```

In this example, when a creature dies, the script checks if it is a world boss using the `IsWorldBoss()` method. If it is a world boss, the script performs the following actions:

1. Sets the respawn delay to 48 hours (172800 seconds) using `SetRespawnDelay()`, ensuring that the world boss does not respawn too quickly.

2. Sends a congratulatory message to the raid group using `GetGroup()` and `SendGroupMessage()`, informing them of their victory over the world boss.

3. Increases the drop chance of a special loot item (`WORLD_BOSS_LOOT_ITEM`) based on the creature's loot mode. If the loot mode is set to 1 (hard mode), the drop chance is doubled.

4. If the random number generated is within the calculated loot chance, the script adds the `LOOT_MODE_HARD_MODE_1` loot mode to the creature using `AddLootMode()`, and adds the special loot item to the creature's loot using `AddLoot()` with a count of 1.

This example showcases how the `IsWorldBoss()` method can be used to differentiate between regular creatures and world bosses, allowing for customized behavior and loot handling based on the creature's boss status.

## MoveWaypoint
This method will command the Creature to start following its predefined waypoint path that is configured in the database table `creature_addon`.

### Parameters
None

### Returns
None

### Example Usage
Here's an example of how to use the `MoveWaypoint` method to make a Creature start following its waypoint path when a player interacts with it:

```typescript
const CREATURE_ENTRY = 1234;

const onGossipHello: creature_event_on_gossip_hello = (event: number, player: Player, creature: Creature): boolean => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        player.GossipMenuAddItem(0, "Start patrolling", 1, 1);
        player.GossipSendMenu(player.GetGUID(), creature.GetGUID());
        return true;
    }
    return false;
};

const onGossipSelect: creature_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number): boolean => {
    if (creature.GetEntry() === CREATURE_ENTRY && action === 1) {
        player.GossipComplete();
        creature.MoveWaypoint();
        creature.SendUnitSay("I will start patrolling now!", ChatMsg.CHAT_MSG_MONSTER_SAY, 0);
        return true;
    }
    return false;
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => onGossipHello(...args));
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, (...args) => onGossipSelect(...args));
```

In this example:
1. We define a constant `CREATURE_ENTRY` with the entry ID of the Creature we want to work with.
2. We register a `CREATURE_EVENT_ON_GOSSIP_HELLO` event for the specified Creature entry.
3. In the `onGossipHello` event handler, we check if the Creature's entry matches the desired entry.
4. If it does, we add a gossip menu item with the text "Start patrolling" and send the gossip menu to the player.
5. We register a `CREATURE_EVENT_ON_GOSSIP_SELECT` event for the specified Creature entry.
6. In the `onGossipSelect` event handler, we check if the Creature's entry matches the desired entry and if the selected action is 1 (corresponding to the "Start patrolling" option).
7. If the conditions are met, we close the gossip menu using `player.GossipComplete()`.
8. We call the `creature.MoveWaypoint()` method to make the Creature start following its waypoint path.
9. We make the Creature say "I will start patrolling now!" using `creature.SendUnitSay()`.

This script allows players to interact with the specified Creature and choose the "Start patrolling" option from the gossip menu. When selected, the Creature will start following its predefined waypoint path and announce it to nearby players.

Note: Make sure to replace `CREATURE_ENTRY` with the actual entry ID of the Creature you want to work with, and ensure that the Creature has a valid waypoint path defined in the `creature_addon` table.

## RemoveCorpse
This method removes the creature's corpse from the game world. It is useful in situations where you want to instantly remove a creature's corpse without waiting for the normal corpse despawn timer.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
In this example, we will create a custom script that removes the corpse of a specific creature when it dies. Let's assume we have a boss creature with the entry ID `BOSS_ENTRY_ID` and we want to remove its corpse immediately upon death to prevent players from looting it.

```typescript
const BOSS_ENTRY_ID = 12345;

const onCreatureDeath: creature_event_on_just_died = (event: CreatureEvents, creature: Creature, killer: Unit) => {
    // Check if the died creature is the boss
    if (creature.GetEntry() === BOSS_ENTRY_ID) {
        // Remove the boss's corpse immediately
        creature.RemoveCorpse();

        // Perform additional actions or spawn special loot
        // For example, let's spawn a chest containing special rewards
        const chestId = 54321;
        const x = creature.GetX();
        const y = creature.GetY();
        const z = creature.GetZ();
        const o = creature.GetO();
        const map = creature.GetMap();

        map.SpawnGameObject(chestId, x, y, z, o, 0, 0, 0, 0, 300);

        // Announce the boss's death to all players
        const bossName = creature.GetName();
        map.SendWorldText(`The mighty ${bossName} has been defeated! Special rewards await the victors!`);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, onCreatureDeath);
```

In this script:
1. We define the entry ID of the boss creature as `BOSS_ENTRY_ID`.
2. We register a creature event handler for the `CREATURE_EVENT_ON_JUST_DIED` event.
3. Inside the event handler, we check if the died creature's entry ID matches the boss entry ID.
4. If it matches, we call the `RemoveCorpse()` method to instantly remove the boss's corpse.
5. After removing the corpse, we perform additional actions, such as spawning a special chest containing rewards.
6. We retrieve the boss's position and map using the appropriate methods (`GetX()`, `GetY()`, `GetZ()`, `GetO()`, `GetMap()`).
7. We spawn a game object (chest) at the boss's position using `SpawnGameObject()` with a despawn timer of 300 seconds (5 minutes).
8. Finally, we send a world text message to all players on the map, announcing the boss's defeat and the availability of special rewards.

By using the `RemoveCorpse()` method, we ensure that the boss's corpse is instantly removed, preventing players from looting it directly. Instead, we spawn a special chest that contains the rewards for defeating the boss. This adds a unique twist to the encounter and rewards players for their victory.

## RemoveLootMode
Removes a specified loot mode from the creature. Loot modes determine which items can be looted from the creature based on how it was killed or interacted with.

### Parameters
* lootMode: number - The loot mode to remove from the creature. Loot modes are defined in the LootModes enum.

### Example Usage
In this example, we have a script that adjusts the loot mode of a specific creature based on the number of players in the group that killed it. If the group size is 5 or more, we remove the "Group Loot" mode, which would normally guarantee an extra roll for each player. This can help balance loot distribution in larger groups.

```typescript
const GROUP_LOOT_MODE = 2; // Corresponds to the Group Loot mode in the LootModes enum
const MIN_GROUP_SIZE_FOR_NERF = 5;
const TARGET_CREATURE_ENTRY = 12345; // Replace with the entry ID of your target creature

const OnCreatureDeath: creature_event_on_creature_death = (event: number, creature: Creature, killer: Unit) => {
    // Check if the killed creature is the one we're interested in
    if (creature.GetEntry() === TARGET_CREATURE_ENTRY) {
        const killerPlayer = killer.ToPlayer();

        // Check if the killer is a player and is in a group
        if (killerPlayer && killerPlayer.IsInGroup()) {
            const groupSize = killerPlayer.GetGroup().GetMembersCount();

            // If the group size is 5 or more, remove the Group Loot mode
            if (groupSize >= MIN_GROUP_SIZE_FOR_NERF) {
                creature.RemoveLootMode(GROUP_LOOT_MODE);
                killerPlayer.SendBroadcastMessage("The creature's loot mode has been adjusted for your group size.");
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_DEATH, (...args) => OnCreatureDeath(...args));
```

In this script, we first define some constants for the specific loot mode we want to remove, the minimum group size threshold for applying the change, and the entry ID of the creature we're targeting.

We then register a callback function for the `CREATURE_EVENT_ON_CREATURE_DEATH` event, which triggers whenever a creature is killed. Inside the callback, we first check if the killed creature matches our target entry ID.

Next, we check if the killer is a player and if they are in a group. If so, we get the size of their group using `GetMembersCount()`.

If the group size is equal to or greater than our defined threshold (`MIN_GROUP_SIZE_FOR_NERF`), we call `RemoveLootMode()` on the creature, passing in the `GROUP_LOOT_MODE` constant to remove that specific loot mode. Finally, we send a message to the player to let them know that the creature's loot mode has been adjusted.

This script showcases how `RemoveLootMode()` can be used in conjunction with other methods and game events to dynamically adjust a creature's loot behavior based on specific conditions.

## ResetLootMode
Resets the loot mode of the creature to the default value defined in the database.

### Parameters
None

### Returns
None

### Example Usage
This example demonstrates how to reset the loot mode of a creature after changing it temporarily for a specific encounter or event.

```typescript
const CREATURE_ENTRY = 1234;
const SPECIAL_LOOT_MODE = 2;

let specialLootCreature: Creature | null = null;

const OnCreatureCreate: creature_event_on_creature_create = (event: number, creature: Creature): void => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        specialLootCreature = creature;
        creature.SetLootMode(SPECIAL_LOOT_MODE);
    }
};

const OnEncounterEnd: map_event_on_encounter_end = (event: number, map: Map, difficulty: number, encounters: number, success: boolean): void => {
    if (success && specialLootCreature) {
        // Encounter completed successfully, reset the loot mode
        specialLootCreature.ResetLootMode();
        specialLootCreature = null;
    }
};

const OnCreatureDeath: creature_event_on_creature_death = (event: number, creature: Creature, killer: Unit): void => {
    if (creature === specialLootCreature) {
        // If the creature dies before the encounter ends, reset the loot mode
        creature.ResetLootMode();
        specialLootCreature = null;
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_CREATE, (...args) => OnCreatureCreate(...args));
RegisterMapEvent(MapEvents.MAP_EVENT_ON_ENCOUNTER_END, (...args) => OnEncounterEnd(...args));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_DEATH, (...args) => OnCreatureDeath(...args));
```

In this example:
1. When a creature with entry `CREATURE_ENTRY` is created, it is assigned to the `specialLootCreature` variable and its loot mode is set to `SPECIAL_LOOT_MODE`.
2. If the encounter ends successfully (`success` is `true`), and `specialLootCreature` is not `null`, the creature's loot mode is reset using `ResetLootMode()`, and `specialLootCreature` is set to `null`.
3. If the creature dies before the encounter ends, the `OnCreatureDeath` event is triggered, and if the dead creature is the `specialLootCreature`, its loot mode is reset, and `specialLootCreature` is set to `null`.

This ensures that the creature's loot mode is reset to the default value, either when the encounter ends successfully or when the creature dies before the encounter concludes, preventing any unintended consequences of the modified loot mode.

## Respawn
Respawns the creature in the world. If the creature is already alive, this method will do nothing.

### Parameters
This method does not take any parameters.

### Returns
This method does not return anything.

### Example Usage
Here's an example of how to use the `Respawn` method to respawn a creature after it has been killed by a player:

```typescript
const CREATURE_ENTRY = 1234;
let _creature: Creature | null = null;

const OnCreatureCreate: creature_event_on_creature_create = (event: number, creature: Creature): void => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        _creature = creature;
    }
};

const OnCreatureDeath: creature_event_on_creature_death = (event: number, creature: Creature, killer: Unit): void => {
    if (creature === _creature) {
        // Respawn the creature after 30 seconds
        setTimeout(() => {
            if (_creature && !_creature.IsAlive()) {
                _creature.Respawn();
                SendWorldMessage(`The creature with entry ${CREATURE_ENTRY} has been respawned!`);
            }
        }, 30000);
    }
};

const OnCreatureDelete: creature_event_on_creature_delete = (event: number, creature: Creature): void => {
    if (creature === _creature) {
        _creature = null;
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_CREATE, (...args) => OnCreatureCreate(...args));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_DEATH, (...args) => OnCreatureDeath(...args));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_DELETE, (...args) => OnCreatureDelete(...args));
```

In this example, we're tracking a specific creature with the entry ID `1234`. When the creature is created, we store a reference to it in the `_creature` variable. 

When the creature dies, we start a timer that will respawn the creature after 30 seconds using the `Respawn` method. We also send a message to all players on the server indicating that the creature has been respawned.

Finally, we clean up the `_creature` reference when the creature is deleted from the world to avoid any memory leaks.

Note that this is just one example of how the `Respawn` method can be used. You could also use it to respawn creatures on a regular interval, or in response to other events in the game world.

## SaveToDB
This method saves the current state of the Creature to the database.  This is useful for storing custom attributes, or 
data about the creature that needs to persist between server restarts or crashes.  

### Parameters
None

### Returns
None

### Example Usage
This example will have a Creature that keeps track of how many times it has killed players.  We will attach
that data to the creature and save it to the DB so that it persists between restarts. 

```typescript
let CREATURE_ENTRY = 1234; 
let CREATURE_KILL_COUNT = "KillCount";

const KillCounter = (event: number, creature: Creature, victim: Unit) => {
    if(victim instanceof Player) {
        const killCount = creature.GetData(CREATURE_KILL_COUNT);
        if(!killCount) {
            creature.SetData(CREATURE_KILL_COUNT, 1);
        }
        else {
            creature.SetData(CREATURE_KILL_COUNT, killCount + 1);
        }
        creature.SaveToDB();
    }
}

const LoadKillCount = (event: number, creature: Creature) => {
    const killCount = creature.GetData(CREATURE_KILL_COUNT);
    if(!killCount) {
        creature.SetData(CREATURE_KILL_COUNT, 0);
    }
}

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, KillCounter);
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, LoadKillCount);
```

In this example, we are using custom data through `GetData` and `SetData` to track how many kills a creature has.  
Whenever the creature kills a player, we increment the kill count and save the creature to the database using `SaveToDB()`. 

Additionally, when the creature spawns we check to see if it has an existing kill count, if it doesn't we initialize it to 0.

This script will cause the Creature to keep track of how many players it has killed, even between server restarts.

## SelectVictim
This method is used to make the Creature attempt to find a new target to attack. It should be called every update cycle for the Creature's AI to ensure that the Creature is always targeting the most appropriate enemy.

When called, the Creature will scan its surroundings for potential targets based on its current AI state and settings. This may include factors such as the target's proximity, threat level, and whether the target is already engaged in combat with another entity.

If a suitable target is found, the Creature will switch its current target to the new one and begin attacking it. If no valid target is found, the Creature will continue to target its current enemy (if any) or remain idle until a new target becomes available.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
In this example, we create a custom AI update script for a Creature that periodically scans for new targets and switches to the closest one if its current target is no longer valid or out of range.

```typescript
const CREATURE_ENTRY = 1234;
const UPDATE_INTERVAL = 2000; // Update every 2 seconds

const CustomAI = (creature: Creature): void => {
    creature.SetAIUpdateFrequency(UPDATE_INTERVAL);

    creature.RegisterAIUpdateEvent((creature: Creature) => {
        if (!creature.IsInCombat()) {
            // If the Creature is not in combat, scan for nearby enemies
            creature.SelectVictim();
        } else {
            const currentTarget = creature.GetVictim();
            if (!currentTarget || !currentTarget.IsAlive() || !creature.IsInRange(currentTarget, 0, 10)) {
                // If the current target is invalid or out of range, find a new target
                creature.SelectVictim();
            }
        }
    });
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_SPAWN, (creature: Creature) => {
    CustomAI(creature);
});
```

In this script:
1. We define the Creature entry ID and the desired AI update interval (in milliseconds).
2. We create a custom AI function that sets up the Creature's AI update event.
3. Inside the AI update event, we first check if the Creature is in combat.
   - If not in combat, we call `SelectVictim()` to make the Creature scan for nearby enemies and select a target.
   - If already in combat, we check if the current target is still valid (alive and within a certain range).
     - If the current target is invalid or out of range, we call `SelectVictim()` to find a new target.
4. Finally, we register the custom AI function to be called whenever a Creature with the specified entry ID spawns.

By calling `SelectVictim()` regularly within the Creature's AI update event, we ensure that the Creature always tries to find and attack the most appropriate target based on its current situation.

## SetAggroEnabled
Sets whether the creature can be aggroed by players or not. If set to false, the creature will not engage in combat even if attacked.

### Parameters
* allow: boolean (optional) - If set to true (default), the creature can be aggroed. If set to false, the creature cannot be aggroed.

### Example Usage
Disable aggro for a specific creature entry and re-enable it after a certain time period.
```typescript
const CREATURE_ENTRY = 1234;
const AGGRO_DISABLE_DURATION = 60000; // 1 minute in milliseconds

let creature = map.GetCreatureByEntry(CREATURE_ENTRY);
if (creature) {
    creature.SetAggroEnabled(false);
    console.log(`Aggro disabled for creature with entry ${CREATURE_ENTRY}`);

    setTimeout(() => {
        if (creature && creature.IsInWorld()) {
            creature.SetAggroEnabled(true);
            console.log(`Aggro re-enabled for creature with entry ${CREATURE_ENTRY}`);
        }
    }, AGGRO_DISABLE_DURATION);
}
```

In this example:
1. We define the specific creature entry we want to modify and the duration for which the aggro will be disabled.
2. We retrieve the creature object using `map.GetCreatureByEntry()`.
3. If the creature is found, we disable its aggro using `SetAggroEnabled(false)`.
4. We log a message indicating that aggro has been disabled for the creature.
5. We use `setTimeout()` to schedule a callback function to be executed after the specified duration.
6. In the callback function, we first check if the creature still exists and is in the world using `IsInWorld()`.
7. If the creature is valid, we re-enable its aggro using `SetAggroEnabled(true)`.
8. We log a message indicating that aggro has been re-enabled for the creature.

This script demonstrates how to temporarily disable aggro for a specific creature and re-enable it after a certain time period. It can be useful in scenarios where you want to create a non-aggressive creature that players can interact with without engaging in combat, and then revert it back to its normal aggressive behavior after a specific duration.

## SetDeathState
Sets the creature's death state to the specified value. This can be used to instantly kill or resurrect a creature, or to change its death state for scripting purposes.

### Parameters
* deathState: number - The death state to set. Valid values are:
  * 0 - ALIVE
  * 1 - JUST_DIED
  * 2 - CORPSE
  * 3 - DEAD

### Example Usage
This example demonstrates how to use the `SetDeathState` method to create a script that causes a creature to instantly respawn after being killed by a player.

```typescript
const CREATURE_ENTRY = 1234;
const RESPAWN_DELAY = 5000; // 5 seconds

const onCreatureDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY && killer instanceof Player) {
        // Schedule the creature to respawn after the specified delay
        creature.RegisterEvent((creature: Creature) => {
            creature.SetDeathState(0); // Set the creature's death state to ALIVE
            creature.SetHealth(creature.GetMaxHealth()); // Restore the creature's health to full
            creature.SetPosition(creature.GetX(), creature.GetY(), creature.GetZ(), creature.GetO()); // Move the creature back to its original position
            creature.Respawn(); // Respawn the creature
        }, RESPAWN_DELAY);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => onCreatureDeath(...args));
```

In this example:
1. We define constants for the creature entry and respawn delay.
2. We register a `CREATURE_EVENT_ON_JUST_DIED` event handler for the specified creature entry.
3. When the creature dies, we check if the killer is a player.
4. If the killer is a player, we schedule an event to respawn the creature after the specified delay using `creature.RegisterEvent()`.
5. Inside the scheduled event, we set the creature's death state to `ALIVE` using `SetDeathState(0)`.
6. We restore the creature's health to full using `SetHealth(creature.GetMaxHealth())`.
7. We move the creature back to its original position using `SetPosition()`.
8. Finally, we call `Respawn()` to respawn the creature.

This script ensures that when the specified creature is killed by a player, it will instantly respawn after the defined delay, effectively making it unkillable.

Note: Be cautious when using this script, as instantly respawning creatures can potentially disrupt game balance and player experience if not used appropriately.

## SetDefaultMovementType
Sets the default movement generator type for the creature. This controls how the creature will move by default if not engaged in combat or following any other overriding movement types.

### Parameters
type: [MovementGeneratorType](./movement-generator-type.md) - The type of movement generator to set as default.

### Example Usage
Setting a creature's movement type to random motion within a set radius of their spawn point.
```typescript
const CREATURE_ENTRY = 1234;
const MOVEMENT_RADIUS = 10;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        creature.SetDefaultMovementType(MovementGeneratorType.RANDOM_MOTION_TYPE);
        const spawnPos = creature.GetSpawnPosition();
        const randomX = spawnPos.x + (Math.random() * MOVEMENT_RADIUS * 2) - MOVEMENT_RADIUS;
        const randomY = spawnPos.y + (Math.random() * MOVEMENT_RADIUS * 2) - MOVEMENT_RADIUS;
        const randomZ = creature.GetMap().GetHeight(creature.GetPhaseMask(), randomX, randomY, spawnPos.z);
        creature.MovePoint(1, randomX, randomY, randomZ);
        creature.SetWanderDistance(MOVEMENT_RADIUS);
        creature.SetHomePosition(spawnPos.x, spawnPos.y, spawnPos.z, spawnPos.o);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example, creatures with the specified entry ID will be set to use the `RANDOM_MOTION_TYPE` movement generator upon spawning. The script calculates a random position within a specified radius (`MOVEMENT_RADIUS`) of the creature's spawn point and moves the creature to that location using `MovePoint`. The creature's wander distance is set to the same radius, ensuring it stays within that area. Finally, the creature's home position is set to its spawn position, so it will return to that point if needed.

This type of movement can be useful for ambient creatures that should wander around a specific area, adding life to the game world without requiring specific paths or waypoints.

## SetDisableGravity
This method allows you to enable or disable gravity for a Creature. When gravity is disabled, the Creature will be able to fly.

### Parameters
- `disable`: boolean
  - If set to `true`, gravity will be disabled, allowing the Creature to fly.
  - If set to `false`, gravity will be enabled, and the Creature will be subject to normal gravity.

### Example Usage
In this example, we have a script that makes a specific Creature fly when it enters combat and land when it leaves combat.

```typescript
const CREATURE_ENTRY = 1234; // Replace with the desired Creature entry ID

let flyingCreature: Creature | null = null;

const OnEnterCombat = (event: any, creature: Creature, target: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        creature.SetDisableGravity(true);
        creature.MoveTo(creature.GetX(), creature.GetY(), creature.GetZ() + 10, true);
        flyingCreature = creature;
    }
};

const OnLeaveCombat = (event: any, creature: Creature) => {
    if (creature === flyingCreature) {
        creature.SetDisableGravity(false);
        creature.MoveTo(creature.GetX(), creature.GetY(), creature.GetZ() - 10, true);
        flyingCreature = null;
    }
};

const OnCreatureKill = (event: any, creature: Creature, victim: Unit) => {
    if (creature === flyingCreature) {
        const x = creature.GetX();
        const y = creature.GetY();
        const z = creature.GetZ();

        // Make the Creature fly in a circle
        for (let i = 0; i < 360; i += 30) {
            const angle = i * Math.PI / 180;
            const newX = x + Math.cos(angle) * 5;
            const newY = y + Math.sin(angle) * 5;
            creature.MoveTo(newX, newY, z, true);
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, OnEnterCombat);
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_LEAVE_COMBAT, OnLeaveCombat);
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_KILLED_UNIT, OnCreatureKill);
```

In this script:
1. When the Creature with the specified entry ID enters combat, it will start flying by disabling gravity and moving 10 units higher.
2. When the Creature leaves combat, it will land by enabling gravity and moving 10 units lower.
3. When the Creature kills a unit while flying, it will perform a circular flying motion around its current position.

This example demonstrates how you can use the `SetDisableGravity` method in combination with other methods and events to create dynamic behaviors for Creatures in your game.

## SetDisableReputationGain
Set whether the Creature will give reputation upon kill or quest completion.

### Parameters
* disable: boolean (optional) - If set to true, reputation gain will be disabled. If set to false or omitted, reputation gain will be enabled.

### Example Usage
In this example, we will create a script that disables reputation gain for specific creatures based on their entry ID.

```typescript
const CREATURE_ENTRIES_TO_DISABLE_REP = [1234, 5678, 9012]; // Replace with actual entry IDs

const OnCreatureCreate: creature_event_on_spawn = (event: number, creature: Creature) => {
    const creatureEntry = creature.GetEntry();

    if (CREATURE_ENTRIES_TO_DISABLE_REP.includes(creatureEntry)) {
        creature.SetDisableReputationGain(true);
        console.log(`Reputation gain disabled for creature with entry ID: ${creatureEntry}`);
    }
};

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: uint32) => {
    const questCreature = player.GetQuestGiver();

    if (questCreature && CREATURE_ENTRIES_TO_DISABLE_REP.includes(questCreature.GetEntry())) {
        console.log(`Reputation gain disabled for quest giver with entry ID: ${questCreature.GetEntry()}`);
        player.SendBroadcastMessage("You did not gain any reputation from this quest.");
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => OnCreatureCreate(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this script:

1. We define an array called `CREATURE_ENTRIES_TO_DISABLE_REP` that contains the entry IDs of the creatures for which we want to disable reputation gain.

2. In the `OnCreatureCreate` event handler, we check if the spawned creature's entry ID is included in the `CREATURE_ENTRIES_TO_DISABLE_REP` array. If it is, we call the `SetDisableReputationGain` method with `true` to disable reputation gain for that creature. We also log a message to the console indicating that reputation gain has been disabled for that creature.

3. In the `OnQuestComplete` event handler, we get the quest giver creature using `GetQuestGiver()`. If the quest giver is a creature and its entry ID is included in the `CREATURE_ENTRIES_TO_DISABLE_REP` array, we log a message to the console indicating that reputation gain has been disabled for the quest giver. We also send a broadcast message to the player informing them that they did not gain any reputation from completing the quest.

4. Finally, we register the event handlers using `RegisterCreatureEvent` and `RegisterPlayerEvent` to ensure that the script is triggered at the appropriate times.

This script provides a way to selectively disable reputation gain for specific creatures, either when they are killed or when they are involved in quest completion. This can be useful for balancing purposes or to create unique gameplay experiences.

## SetEquipmentSlots
This method equips the specified items to the creature's main hand, off hand, and ranged slots. Passing 0 as the item entry will remove any currently equipped item in that slot.

### Parameters
* main_hand: number - The item entry of the item to be equipped in the main hand slot, or 0 to remove the currently equipped item.
* off_hand: number - The item entry of the item to be equipped in the off hand slot, or 0 to remove the currently equipped item.
* ranged: number - The item entry of the item to be equipped in the ranged slot, or 0 to remove the currently equipped item.

### Example Usage
This example script demonstrates how to equip a creature with specific items based on its entry ID and level.

```typescript
const CREATURE_ENTRY = 1234;
const MAIN_HAND_ITEM_ENTRY = 5678;
const OFF_HAND_ITEM_ENTRY = 9012;
const RANGED_ITEM_ENTRY = 3456;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        const creatureLevel = creature.GetLevel();

        let mainHandItem = MAIN_HAND_ITEM_ENTRY;
        let offHandItem = OFF_HAND_ITEM_ENTRY;
        let rangedItem = RANGED_ITEM_ENTRY;

        if (creatureLevel < 10) {
            mainHandItem = 0;
            offHandItem = 0;
            rangedItem = 0;
        } else if (creatureLevel < 20) {
            offHandItem = 0;
            rangedItem = 0;
        } else if (creatureLevel < 30) {
            rangedItem = 0;
        }

        creature.SetEquipmentSlots(mainHandItem, offHandItem, rangedItem);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example:
1. We define constants for the creature entry and the desired item entries for each equipment slot.
2. In the `onCreatureSpawn` event handler, we check if the spawned creature matches the desired entry.
3. We determine the creature's level using `GetLevel()`.
4. Based on the creature's level, we conditionally assign the item entries for each equipment slot. If the creature's level is below certain thresholds, we set the corresponding item entry to 0 to remove any equipped item.
5. Finally, we call `SetEquipmentSlots` on the creature, passing the determined item entries for the main hand, off hand, and ranged slots.

This script ensures that the creature is equipped with the appropriate items based on its level when it spawns. Lower-level creatures will have fewer or no items equipped, while higher-level creatures will have all three equipment slots filled.

## SetHomePosition
Sets the home position of the creature. This is the position the creature will return to when evading from combat or respawning.

### Parameters
* x: number - The X coordinate of the home position.
* y: number - The Y coordinate of the home position.
* z: number - The Z coordinate of the home position.
* o: number - The orientation (facing angle) of the creature at the home position.

### Example Usage
Set a new home position for a creature when it reaches a certain health threshold.
```typescript
const LOW_HEALTH_PERCENTAGE = 0.2;

const CreatureReachedLowHealth: creature_event_on_health_change = (event: number, creature: Creature, attacker: Unit) => {
    const healthPct = creature.GetHealthPct();

    if (healthPct <= LOW_HEALTH_PERCENTAGE) {
        // Get the creature's current position
        const currentX = creature.GetX();
        const currentY = creature.GetY();
        const currentZ = creature.GetZ();
        const currentO = creature.GetO();

        // Calculate a new home position at a fixed distance behind the current position
        const distance = 20;
        const angle = creature.GetO();
        const newX = currentX - Math.cos(angle) * distance;
        const newY = currentY - Math.sin(angle) * distance;
        const newZ = currentZ;
        const newO = currentO;

        // Set the new home position
        creature.SetHomePosition(newX, newY, newZ, newO);
        creature.MonsterYell("I shall retreat and regroup!", 0);

        // Evade from combat
        creature.Evade();
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_HEALTH_CHANGE, (...args) => CreatureReachedLowHealth(...args));
```
In this example, when the creature's health drops below a certain percentage (`LOW_HEALTH_PERCENTAGE`), it calculates a new home position at a fixed distance behind its current position. The new home position is set using `SetHomePosition`, and then the creature evades from combat.

By setting a new home position, the creature will return to that position when it respawns or evades from combat, instead of its original spawn location. This can be useful for creating dynamic behavior or adjusting the creature's positioning based on certain conditions during combat.

## SetHover
This method allows you to set whether a creature is hovering or levitating. By default, the creature will be set to hover. 

### Parameters
* enable: boolean (optional) - If set to true, the creature will hover. If set to false, the creature will not hover. If not provided, the creature will be set to hover.

### Example Usage
In this example, we have a script that will make all creatures within 100 yards of a player hover when the player enters the world. We will also set a timer to remove the hovering effect after 15 seconds.

```typescript
// Define a constant for the hover duration in milliseconds
const HOVER_DURATION = 15000; // 15 seconds

// Player enter world event handler
const OnEnterWorld: player_event_on_enter_world = (event: number, player: Player) => {
    // Get all creatures within 100 yards of the player
    const creatures = player.GetCreaturesInRange(100);

    // Loop through each creature and set them to hover
    creatures.forEach((creature: Creature) => {
        creature.SetHover(true);
    });

    // Set a timer to remove the hovering effect after the defined duration
    player.RegisterTimedEvent(HOVER_DURATION, (eventId: number, delay: number, repeats: number, player: Player) => {
        // Get all creatures within 100 yards of the player again
        const creatures = player.GetCreaturesInRange(100);

        // Loop through each creature and remove the hovering effect
        creatures.forEach((creature: Creature) => {
            creature.SetHover(false);
        });
    });
};

// Register the player enter world event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_WORLD, OnEnterWorld);
```

In this example, we first define a constant `HOVER_DURATION` to store the duration in milliseconds for how long the creatures should hover.

We then create a handler function for the `PLAYER_EVENT_ON_ENTER_WORLD` event, which will be triggered whenever a player enters the world.

Inside the handler function, we use the `GetCreaturesInRange` method of the `Player` object to get all creatures within 100 yards of the player. We then loop through each creature and call the `SetHover` method with `true` as the argument to make them hover.

Next, we use the `RegisterTimedEvent` method of the `Player` object to set a timer that will be triggered after the specified `HOVER_DURATION`. In the timer callback function, we again get all creatures within 100 yards of the player and loop through each one, calling the `SetHover` method with `false` as the argument to remove the hovering effect.

Finally, we register the `OnEnterWorld` handler function to the `PLAYER_EVENT_ON_ENTER_WORLD` event using the `RegisterPlayerEvent` function.

With this script, whenever a player enters the world, all creatures within 100 yards of them will start hovering, and after 15 seconds, the hovering effect will be removed.

## SetInCombatWithZone
Sets the creature in combat with all players in the same dungeon instance. This is commonly used by raid bosses to prevent players from using out-of-combat actions once the encounter has begun.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any values.

### Example Usage
This example demonstrates how to use `SetInCombatWithZone()` in a script for a raid boss encounter. When a player enters the boss's room, the boss will set itself in combat with all players in the instance, preventing them from using out-of-combat actions.

```typescript
const BOSS_ROOM_AREA_ID = 1234;
const BOSS_ENTRY = 5678;

let bossEngaged = false;

const OnAreaTrigger = (event: number, player: Player, areaTrigger: AreaTrigger): void => {
    if (areaTrigger.GetAreaId() === BOSS_ROOM_AREA_ID && !bossEngaged) {
        const boss = player.GetMap().GetCreatureByEntry(BOSS_ENTRY);
        if (boss) {
            boss.SetInCombatWithZone();
            bossEngaged = true;
            
            // Announce the encounter start to all players in the instance
            const instance = player.GetMap();
            instance.PlayDirectSoundToMap(1234); // Play a sound effect
            instance.SendWorldText("The battle against the mighty boss has begun!");
            
            // Spawn additional adds to assist the boss
            const spawnPos = boss.GetPosition();
            for (let i = 0; i < 4; i++) {
                instance.SpawnCreature(1122, spawnPos.x + i * 2, spawnPos.y, spawnPos.z, spawnPos.o);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, OnAreaTrigger);
```

In this example:
1. When a player enters the boss room (defined by `BOSS_ROOM_AREA_ID`), the script checks if the boss has already been engaged.
2. If the boss is not engaged, the script retrieves the boss creature using `GetCreatureByEntry()`.
3. If the boss is found, `SetInCombatWithZone()` is called, setting the boss in combat with all players in the instance.
4. The `bossEngaged` flag is set to `true` to prevent the boss from being engaged multiple times.
5. The script announces the start of the encounter to all players in the instance using `SendWorldText()` and plays a sound effect using `PlayDirectSoundToMap()`.
6. Additional creature adds are spawned to assist the boss using `SpawnCreature()`.

This example showcases how `SetInCombatWithZone()` can be used in conjunction with other methods to create an immersive and challenging raid boss encounter.

## SetLootMode
Set the loot mode for the creature. This controls how loot is generated and distributed when the creature dies.

### Parameters
None

### Returns
None

### Example Usage
This example demonstrates setting the loot mode for a specific creature to personal loot, which means each player will receive their own loot based on their own chances, rather than the group rolling for items.

```typescript
const CREATURE_ENTRY_ONYXIA = 10184;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY_ONYXIA) {
        creature.SetLootMode(3); // Set loot mode to personal loot (3)
        creature.SendUnitWhisper("Onyxia's loot mode has been set to personal loot. Each player will receive their own loot based on their chances.", 0, true);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example:
1. We define the entry ID for Onyxia as a constant `CREATURE_ENTRY_ONYXIA`.
2. We register a `CREATURE_EVENT_ON_SPAWN` event handler using `RegisterCreatureEvent`.
3. Inside the event handler, we check if the spawned creature's entry matches Onyxia's entry ID.
4. If it is Onyxia, we call `SetLootMode(3)` on the creature, which sets the loot mode to personal loot (mode 3).
5. We also send a whisper message to all players (by passing 0 as the player receiver) indicating that Onyxia's loot mode has been set to personal loot.

This ensures that whenever Onyxia spawns, her loot mode is automatically set to personal loot, providing a fair distribution of loot among the players participating in the encounter.

Note: The available loot modes and their corresponding values may vary depending on the specific game version and configuration of AzerothCore. Make sure to refer to the relevant documentation or source code to determine the appropriate loot mode values for your setup.

## SetNPCFlags
This method sets the NPC flags of the creature. NPC flags determine how the creature interacts with players, such as whether it can be targeted, attacked, or interacted with. You can find a list of NPC flag values in the `CreatureTemplate.npcflag` field of the `creature_template` table in the AzerothCore database.

### Parameters
- `flags`: number - The new NPC flag value to set for the creature.

### Example Usage
In this example, we create a custom NPC that can be targeted and attacked by players, but only during a specific event that occurs at certain times.

```typescript
const CUSTOM_NPC_ENTRY = 100000;
const EVENT_NPC_FLAG = 2; // Targetable, but not attackable
const NORMAL_NPC_FLAG = 0; // Not targetable or attackable

let isEventActive = false;

function onEventStart(eventId: number) {
    // Assuming eventId is the ID of our custom event
    if (eventId === 123) {
        isEventActive = true;

        // Find all custom NPCs in the world and set their flags to be targetable
        const npcs = GetCreaturesInWorld(CUSTOM_NPC_ENTRY);
        for (const npc of npcs) {
            npc.SetNPCFlags(EVENT_NPC_FLAG);
        }
    }
}

function onEventStop(eventId: number) {
    // Assuming eventId is the ID of our custom event
    if (eventId === 123) {
        isEventActive = false;

        // Find all custom NPCs in the world and set their flags to be non-targetable
        const npcs = GetCreaturesInWorld(CUSTOM_NPC_ENTRY);
        for (const npc of npcs) {
            npc.SetNPCFlags(NORMAL_NPC_FLAG);
        }
    }
}

function onCreatureClick(event: CreatureClickEvents, player: Player, creature: Creature) {
    if (creature.GetEntry() === CUSTOM_NPC_ENTRY && isEventActive) {
        // Handle interaction with the custom NPC during the event
        creature.MonsterSay("The event is active! You can target and attack me now.", 0);
    }
}

RegisterServerEvent(ServerEvents.EVENT_START, onEventStart);
RegisterServerEvent(ServerEvents.EVENT_STOP, onEventStop);
RegisterCreatureEvent(CreatureEvents.CREATURE_ON_CLICK, onCreatureClick);
```

In this script:
1. We define constants for our custom NPC entry and the flag values for the event and normal states.
2. We create a variable `isEventActive` to track whether the event is currently active.
3. In the `onEventStart` function, we check if the event ID matches our custom event. If so, we set `isEventActive` to `true` and find all instances of our custom NPC in the world using `GetCreaturesInWorld`. We then set their NPC flags to `EVENT_NPC_FLAG` using `SetNPCFlags`, making them targetable but not attackable.
4. In the `onEventStop` function, we perform similar steps but set the NPC flags back to `NORMAL_NPC_FLAG`, making them non-targetable and non-attackable.
5. In the `onCreatureClick` function, we handle the interaction with the custom NPC when it is clicked by a player during the active event. We make the NPC say a message indicating that it can now be targeted and attacked.

This example demonstrates how you can use `SetNPCFlags` to dynamically change the behavior of creatures based on certain conditions or events in your game world.

## SetNoCallAssistance
This method allows you to control whether a creature will call for help from nearby friendly creatures when it enters combat. By default, creatures will call for assistance when they aggro a player or are attacked. This method allows you to override that behavior.

### Parameters
enable: boolean (optional) - If set to true, the creature will not call for assistance. If set to false, the creature will call for assistance (default behavior).

### Example Usage
Disable call for assistance on a specific creature entry:
```typescript
const CREATURE_ENTRY = 1234;

const DisableCallForHelp = (): void => {
    const creatures = GetCreaturesInWorld(CREATURE_ENTRY);

    for (const creature of creatures) {
        creature.SetNoCallAssistance(true);
    }
};

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_CREATURE_SPAWN, (event, creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        creature.SetNoCallAssistance(true);
    }
});

DisableCallForHelp();
```

In this example, we define a constant `CREATURE_ENTRY` with the entry ID of the creature we want to modify. We then create a function `DisableCallForHelp` that retrieves all creatures in the world with the specified entry using `GetCreaturesInWorld`. We iterate over each creature and call `SetNoCallAssistance(true)` to disable the call for assistance behavior.

Additionally, we register a server event `SERVER_EVENT_ON_CREATURE_SPAWN` to set the call for assistance behavior whenever a creature with the specified entry spawns. This ensures that even if the creature respawns, it will still have the modified behavior.

Finally, we call the `DisableCallForHelp` function to apply the changes to all existing creatures with the specified entry.

By using this method, you can fine-tune the behavior of specific creatures, making them more challenging or altering their mechanics to fit your desired gameplay experience. Keep in mind that modifying the call for assistance behavior may impact the balance and difficulty of encounters, so use it judiciously.

## SetNoSearchAssistance
This method allows you to control whether the creature will search for assistance from nearby friendly creatures when its health falls below a certain threshold. By default, most creatures in the game will seek assistance when they are at low health. This can be disabled or re-enabled using this method.

### Parameters
- `enable`: boolean (optional) - If set to `true`, the creature will not search for assistance. If set to `false` or omitted, the creature will search for assistance (default behavior).

### Example Usage
In this example, we have a custom boss creature that summons adds at certain health thresholds. We want to prevent the boss from calling for assistance when it reaches low health, as it would make the encounter too difficult. We can use the `SetNoSearchAssistance` method to achieve this.

```typescript
const BOSS_ENTRY = 12345;
const ADD_ENTRY = 54321;

const SUMMON_ADDS_THRESHOLD_1 = 75;
const SUMMON_ADDS_THRESHOLD_2 = 50;
const SUMMON_ADDS_THRESHOLD_3 = 25;

const ADDS_COUNT = 2;

const BossAI: creature_ai = (creature: Creature): void => {
    creature.SetNoSearchAssistance(true); // Disable assistance searching for the boss

    creature.RegisterEvent(CreatureEvents.CREATURE_EVENT_ON_HEALTH_PCT, (creature, healthPct) => {
        switch (healthPct) {
            case SUMMON_ADDS_THRESHOLD_1:
            case SUMMON_ADDS_THRESHOLD_2:
            case SUMMON_ADDS_THRESHOLD_3:
                for (let i = 0; i < ADDS_COUNT; i++) {
                    creature.SummonCreature(ADD_ENTRY, creature.GetPositionX(), creature.GetPositionY(), creature.GetPositionZ(), creature.GetOrientation(), 3, 0);
                }
                break;
        }
    });
};

RegisterCreatureAI(BOSS_ENTRY, BossAI);
```

In this script, we first disable the assistance searching for the boss creature using `SetNoSearchAssistance(true)`. This ensures that the boss will not call for help from nearby friendly creatures when its health drops low.

Then, we register an event handler for the `CREATURE_EVENT_ON_HEALTH_PCT` event, which triggers whenever the creature's health reaches certain percentage thresholds. Inside the event handler, we check the health percentage and summon adds using the `SummonCreature` method when the boss reaches 75%, 50%, and 25% health.

By using `SetNoSearchAssistance`, we can fine-tune the behavior of the boss creature and create a more controlled and balanced encounter for players.

## SetRespawnDelay
This method sets the time it takes for the [Creature] to respawn when killed. The respawn delay is in seconds.

### Parameters
* delay: number - The delay in seconds for the creature to respawn.

### Example Usage
Set a custom respawn time for a specific creature based on its entry ID.
```typescript
const CREATURE_ENTRY_YSONDRE = 14887;
const RESPAWN_DELAY_YSONDRE = 3600; // 1 hour

const CreatureOnDeath: creature_event_on_died = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY_YSONDRE) {
        creature.SetRespawnDelay(RESPAWN_DELAY_YSONDRE);
        
        // Notify players about the custom respawn time
        const message = `Ysondre will respawn in ${RESPAWN_DELAY_YSONDRE / 60} minutes.`;
        for (const [_, player] of world.GetPlayers()) {
            if (player.GetMapId() === creature.GetMapId()) {
                player.SendBroadcastMessage(message);
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DIED, (...args) => CreatureOnDeath(...args));
```

In this example:
1. We define constants for the creature entry ID of Ysondre and the desired respawn delay in seconds.
2. In the `CreatureOnDeath` event handler, we check if the died creature's entry matches Ysondre's entry ID.
3. If it's Ysondre, we set the custom respawn delay using `SetRespawnDelay()`.
4. We calculate the respawn time in minutes by dividing the delay by 60.
5. We prepare a broadcast message informing players about the custom respawn time.
6. We iterate over all players in the world using `world.GetPlayers()`.
7. For each player, we check if they are on the same map as Ysondre using `GetMapId()`.
8. If the player is on the same map, we send them the broadcast message using `SendBroadcastMessage()`.
9. Finally, we register the `CreatureOnDeath` event handler for the `CREATURE_EVENT_ON_DIED` event using `RegisterCreatureEvent()`.

This script sets a custom respawn delay for Ysondre when she is killed and notifies players on the same map about the respawn time. It provides a more engaging experience for players by giving them information about when they can expect to encounter Ysondre again.

