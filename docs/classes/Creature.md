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

