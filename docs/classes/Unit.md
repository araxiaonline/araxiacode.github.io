## AddAura
Adds an aura to the target unit based on the specified spell entry. The aura is applied as if it was cast by the current unit.

### Parameters
- spell: number - The spell entry ID of the aura to be added. You can find spell IDs in the `spell_template` table in the world database.
- target: [Unit](./unit.md) - The target unit to which the aura will be applied.

### Returns
- [Aura](./aura.md) - The aura object that was added to the target unit.

### Example Usage
In this example, we create a script that adds a random beneficial aura to a player when they kill a creature. The aura is chosen from a predefined list of spell IDs.

```typescript
const BENEFICIAL_AURAS = [1126, 21562, 13165, 13166, 13169, 28491, 28502, 40120, 40121, 40122];

const OnCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const randomIndex = Math.floor(Math.random() * BENEFICIAL_AURAS.length);
    const selectedAura = BENEFICIAL_AURAS[randomIndex];

    const aura = player.AddAura(selectedAura, player);

    if (aura) {
        player.SendBroadcastMessage(`You have been granted the beneficial aura ${aura.GetSpellName()}!`);
    } else {
        console.log(`Failed to add aura ${selectedAura} to player ${player.GetName()}.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => OnCreatureKill(...args));
```

In this script:
1. We define an array `BENEFICIAL_AURAS` containing the spell IDs of various beneficial auras.
2. We register the `OnCreatureKill` event, which triggers when a player kills a creature.
3. Inside the event handler, we generate a random index using `Math.random()` and select a random aura from the `BENEFICIAL_AURAS` array.
4. We call `player.AddAura()`, passing the selected aura spell ID and the player itself as the target.
5. If the aura is successfully added (i.e., `aura` is not `null` or `undefined`), we send a broadcast message to the player informing them about the granted aura using `player.SendBroadcastMessage()`.
6. If the aura fails to be added, we log an error message using `console.log()`.

This script adds an element of surprise and reward for players when they kill creatures, granting them a random beneficial aura from a predefined list. The auras can provide various benefits such as increased stats, damage output, or defensive capabilities, enhancing the player's gameplay experience.

## AddThreat
Adds threat to the [Unit] from the victim. This method allows you to manually adjust the threat level of a unit towards the specified victim.

### Parameters
- `victim`: [Unit](./unit.md) - The unit that will receive the threat.
- `threat`: number - The amount of threat to add.
- `schoolMask`: [SpellSchoolMask](./spellschoolmask.md) (optional) - The school mask of the threat.
- `spell`: number (optional) - The spell ID associated with the threat.

### Example Usage
In this example, we'll create a script that increases the threat of a boss towards the main tank when the boss reaches a certain health percentage.

```typescript
const BOSS_ENTRY = 12345;
const MAIN_TANK_NAME = 'TankPlayer';
const HEALTH_PERCENTAGE_THRESHOLD = 30;
const ADDITIONAL_THREAT = 5000;

const BossReachedThreshold: creature_event_on_health_pct = (event: number, creature: Creature, healthPct: number) => {
    if (creature.GetEntry() === BOSS_ENTRY && healthPct <= HEALTH_PERCENTAGE_THRESHOLD) {
        const mainTank = creature.GetMap().GetPlayers().find(player => player.GetName() === MAIN_TANK_NAME);

        if (mainTank) {
            creature.AddThreat(mainTank, ADDITIONAL_THREAT);
            creature.SendUnitWhisper(`I will crush you, ${MAIN_TANK_NAME}!`, mainTank.GetGUID());
            creature.PlayDirectSound(1234); // Play a sound effect
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_HEALTH_PCT, (...args) => BossReachedThreshold(...args));
```

In this script:
1. We define constants for the boss entry, main tank name, health percentage threshold, and the additional threat amount.
2. We register a creature event handler for the `CREATURE_EVENT_ON_HEALTH_PCT` event.
3. Inside the event handler, we check if the creature is the desired boss and if its health percentage is below or equal to the specified threshold.
4. If the conditions are met, we search for the main tank player in the creature's map using `GetMap().GetPlayers()` and the main tank's name.
5. If the main tank is found, we add the additional threat to the boss towards the main tank using `AddThreat()`.
6. We send a whisper message to the main tank using `SendUnitWhisper()` to indicate the boss's focus on them.
7. Finally, we play a sound effect using `PlayDirectSound()` to enhance the immersion of the encounter.

This script demonstrates how you can use the `AddThreat()` method to dynamically adjust the threat of a creature towards a specific player based on certain conditions, such as the boss's health percentage. It also showcases additional features like sending whisper messages and playing sound effects to create a more engaging experience.

## AddUnitState
This method adds a unit state to the unit. Unit states are used to control the behavior and appearance of units in the game. Some common unit states include:

- `UNIT_STATE_ROOT`: The unit is rooted in place and cannot move.
- `UNIT_STATE_STUNNED`: The unit is stunned and cannot perform any actions.
- `UNIT_STATE_CONFUSED`: The unit is confused and may attack random targets.
- `UNIT_STATE_FLEEING`: The unit is fleeing from combat.

For a complete list of unit states, you can refer to the `UnitState` enum in the Azerothcore source code.

### Parameters
- `state`: number - The unit state to add. You can use the numeric value directly or the corresponding enum value from `UnitState`.

### Example Usage
Here's an example of how to use `AddUnitState` to create a spell that roots the target in place for a short duration:

```typescript
const SPELL_ROOT = 12345;

const SpellScript = {
    canCast(player: Player, target: Unit, spell: Spell): boolean {
        // Check if the target is already rooted
        if (target.HasUnitState(UnitState.UNIT_STATE_ROOT)) {
            player.SendBroadcastMessage("Target is already rooted!");
            return false;
        }
        return true;
    },

    onCast(player: Player, target: Unit, spell: Spell): void {
        // Add the UNIT_STATE_ROOT to the target
        target.AddUnitState(UnitState.UNIT_STATE_ROOT);

        // Send a message to the player
        player.SendBroadcastMessage(`${target.GetName()} has been rooted for 5 seconds!`);

        // Remove the UNIT_STATE_ROOT after 5 seconds
        target.RegisterEvent((): void => {
            target.ClearUnitState(UnitState.UNIT_STATE_ROOT);
            player.SendBroadcastMessage(`${target.GetName()} is no longer rooted!`);
        }, 5000, 1);
    },
};

RegisterSpellScript(SPELL_ROOT, SpellScript);
```

In this example, we define a spell script for a custom spell with the ID `12345`. The `canCast` function checks if the target already has the `UNIT_STATE_ROOT` state, and prevents the spell from being cast if it does.

If the spell is successfully cast, the `onCast` function adds the `UNIT_STATE_ROOT` state to the target using `AddUnitState`. It also sends a message to the player indicating that the target has been rooted.

Finally, we use `RegisterEvent` to remove the `UNIT_STATE_ROOT` state from the target after 5 seconds (5000 milliseconds) and send another message to the player.

This is just one example of how `AddUnitState` can be used to create interesting gameplay mechanics. You can experiment with different unit states and combinations to create a wide variety of effects and abilities.

## Attack
The `Attack` method causes the `Unit` to attack a specified target. If `meleeAttack` is set to `true`, the `Unit` will perform a melee attack; otherwise, it will use its default attack type (e.g., ranged for hunters).

### Parameters
- `who`: [Unit](./unit.md) - The target `Unit` to attack.
- `meleeAttack` (optional): boolean - Determines whether the attack should be a melee attack. Default is `false`.

### Returns
- `void`

### Example Usage
In this example, we create a script that causes a creature to attack a random player within a certain range every 5 seconds.

```typescript
const CREATURE_ENTRY = 1234;
const ATTACK_RANGE = 10;
const ATTACK_INTERVAL = 5000;

const CreatureAttack: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    if (creature.GetEntry() !== CREATURE_ENTRY) {
        return;
    }

    if (creature.IsInCombat()) {
        return;
    }

    if (event % ATTACK_INTERVAL !== 0) {
        return;
    }

    const nearbyPlayers = creature.GetPlayersInRange(ATTACK_RANGE);
    if (nearbyPlayers.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * nearbyPlayers.length);
    const target = nearbyPlayers[randomIndex];

    creature.Attack(target);
    creature.SendUnitYell("You dare enter my domain? Feel my wrath!", 0);
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => CreatureAttack(...args));
```

In this script:

1. We define constants for the creature entry, attack range, and attack interval (in milliseconds).
2. In the `CreatureAttack` function, we first check if the creature matches the desired entry. If not, we return early.
3. We then check if the creature is already in combat. If so, we return early to avoid interrupting the ongoing combat.
4. We use the modulo operator (`%`) to check if the current event tick matches the attack interval. This ensures that the attack logic is executed every `ATTACK_INTERVAL` milliseconds.
5. We use the `GetPlayersInRange` method to retrieve an array of nearby players within the specified `ATTACK_RANGE`.
6. If there are no nearby players, we return early.
7. We generate a random index using `Math.random()` and select a random player from the `nearbyPlayers` array.
8. Finally, we use the `Attack` method to make the creature attack the selected target and send a taunting yell message.

This script showcases how the `Attack` method can be used in combination with other methods and game events to create dynamic combat behavior for creatures.

## AttackStop
The `AttackStop` method will cause the [Unit](./unit.md) to stop attacking its current target if it is attacking one.  This can be useful if you want to force a creature to stop attacking a player or another unit under certain conditions, such as if the target is too far away or if the creature's health is too low.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the unit successfully stopped attacking, or `false` if the unit was not attacking anything.

### Example Usage
In this example, we will create an AI script for a creature that will cause it to stop attacking its target if the target is too far away or if the creature's health is too low.

```typescript
const CREATURE_ENTRY = 1234;
const MAX_DISTANCE = 30;
const LOW_HEALTH_THRESHOLD = 20;

const AIUpdate: creature_event_on_ai_update = (event: number, creature: Creature, diff: number) => {
    const target = creature.GetVictim();

    if (target) {
        const distance = creature.GetDistance(target);
        const healthPct = creature.GetHealthPct();

        if (distance > MAX_DISTANCE || healthPct < LOW_HEALTH_THRESHOLD) {
            const success = creature.AttackStop();

            if (success) {
                creature.MonsterSay("I will not chase you any further!", 0);
            } else {
                console.log(`[Error] Failed to stop attacking for creature with entry ${CREATURE_ENTRY}`);
            }
        }
    }
}

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_AI_UPDATE, (...args) => AIUpdate(...args));
```

In this script, we define some constants for the creature entry, maximum distance, and low health threshold.  Then we register an AI update event for the creature.

When the event is triggered, we first check if the creature has a current target using `GetVictim()`.  If it does, we calculate the distance between the creature and its target using `GetDistance()`, and we get the creature's current health percentage using `GetHealthPct()`.

If the distance is greater than our defined maximum distance or if the creature's health is below our defined low health threshold, we call `AttackStop()` to make the creature stop attacking.  If `AttackStop()` returns `true`, we know it was successful, so we make the creature say a message using `MonsterSay()`.  If it returns `false`, we log an error message to the console.

This is just one example of how you could use `AttackStop()` in a script.  You could also use it in other situations, such as if you want a creature to stop attacking when a certain game event occurs, or if you want a creature to switch targets under certain conditions.

## CastCustomSpell

This method allows a unit to cast a custom spell on a target unit with optional parameters such as base points, triggered flag, cast item, and original caster.

### Parameters
- target: [Unit](./unit.md) - The target unit to cast the spell on.
- spell: number - The ID of the spell to be cast. Refer to the Spell.dbc file for spell IDs.
- triggered?: boolean - (Optional) Determines if the spell should be cast as triggered or not. Default is false.
- bp0?: number - (Optional) Base points for effect 0 of the spell.
- bp1?: number - (Optional) Base points for effect 1 of the spell.
- bp2?: number - (Optional) Base points for effect 2 of the spell.
- castItem?: [Item](./item.md) - (Optional) The item used to cast the spell, if any.
- originalCaster?: number - (Optional) The original caster's GUID, used for spell reflection.

### Example Usage

Here's an example of how to use `CastCustomSpell` to create a scripted spell that deals damage based on the caster's attack power:

```typescript
const CUSTOM_SPELL_ID = 12345;
const SPELL_COEFFICIENT = 1.5;

const ApplyCustomSpell: player_event_on_cast_spell = (event, player, spell, skipCheck) => {
    if (spell.GetEntry() === CUSTOM_SPELL_ID) {
        const target = spell.GetTarget();
        if (target && target.IsUnit()) {
            const attackPower = player.GetTotalAttackPowerValue(WeaponAttackType.BASE_ATTACK);
            const damage = Math.floor(attackPower * SPELL_COEFFICIENT);

            player.CastCustomSpell(target, CUSTOM_SPELL_ID, true, damage, 0, 0);

            const damageInfo = {
                attacker: player,
                victim: target,
                damage: damage,
                damageType: SPELL_DIRECT_DAMAGE,
                procAttacker: PROC_FLAG_NONE,
                procVictim: PROC_FLAG_NONE,
                procEx: PROC_EX_NORMAL_HIT,
                hitInfo: SPELL_HIT_TYPE_UNK1,
            };

            target.DealDamage(player, damage, damageInfo);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, ApplyCustomSpell);
```

In this example:
1. We define a custom spell ID and a spell coefficient for damage calculation.
2. In the `ApplyCustomSpell` event handler, we check if the cast spell matches our custom spell ID.
3. If the target is a valid unit, we calculate the damage based on the player's attack power and the spell coefficient.
4. We use `CastCustomSpell` to apply the custom spell effect on the target, passing the calculated damage as the first base point (bp0).
5. We create a `damageInfo` object to store information about the damage dealt.
6. Finally, we use `DealDamage` to apply the damage to the target unit.

This script demonstrates how to use `CastCustomSpell` along with other methods like `GetTotalAttackPowerValue` and `DealDamage` to create a custom spell that interacts with the game's mechanics.

## CastSpell
Makes the [Unit] cast a spell on the specified target.

### Parameters
- target: [Unit](./unit.md) - The target unit to cast the spell on.
- spell: number - The ID of the spell to be cast. Spell IDs can be found in the `spell_template` table in the world database.
- triggered: boolean (optional) - If set to true, the spell will be cast instantly without any cast time or mana cost. Default is false.

### Example Usage
Here's an example of how to use the `CastSpell` method in a script that makes a unit cast a spell on a player when the player enters combat with the unit:

```typescript
const SPELL_FIREBALL = 133;

const onPlayerEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    // Check if the enemy is a specific creature entry
    if (enemy.IsCreature() && enemy.ToCreature().GetEntry() === 1234) {
        // Cast the Fireball spell on the player
        enemy.CastSpell(player, SPELL_FIREBALL);

        // You can also specify the triggered parameter to make the spell instant
        // enemy.CastSpell(player, SPELL_FIREBALL, true);

        // Send a message to the player
        player.SendBroadcastMessage("The enemy casts Fireball on you!");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onPlayerEnterCombat(...args));
```

In this example:
1. We define a constant `SPELL_FIREBALL` with the ID of the Fireball spell (133).
2. We register a player event handler for the `PLAYER_EVENT_ON_ENTER_COMBAT` event using `RegisterPlayerEvent`.
3. Inside the event handler, we check if the enemy unit is a creature with a specific entry ID (1234).
4. If the condition is met, we use the `CastSpell` method to make the enemy unit cast the Fireball spell on the player.
5. We can optionally specify the `triggered` parameter as `true` to make the spell cast instantly without any cast time or mana cost.
6. Finally, we send a broadcast message to the player using `SendBroadcastMessage` to inform them that the enemy has cast Fireball on them.

This example demonstrates how you can use the `CastSpell` method to make a unit cast a spell on a player based on certain conditions, such as when the player enters combat with a specific creature. You can customize the spell ID, creature entry, and add additional logic to suit your specific needs.

## CastSpellAoF
Makes the [Unit] cast the spell to the given coordinates, used for area effect spells. This method is useful for casting spells on a specific location rather than on a target unit.

### Parameters
* x: number - The X coordinate of the target location
* y: number - The Y coordinate of the target location
* z: number - The Z coordinate of the target location
* spell: number - The ID of the spell to be cast
* triggered?: boolean - Optional parameter to specify if the spell should be triggered instantly or cast as a normal spell (default: false)

### Example Usage
In this example, we'll create a script that casts a random AOE spell on a random player's location every 30 seconds.

```typescript
const AOE_SPELLS = [48360, 48363, 48365, 48367, 48368, 48371, 48372, 48374, 48375, 48377];
const SPELL_INTERVAL = 30000; // 30 seconds

let timerID: number | null = null;

function CastRandomAOESpell() {
  const players = GetPlayersInWorld();
  if (players.length === 0) {
    return;
  }

  const randomPlayer = players[Math.floor(Math.random() * players.length)];
  const randomSpell = AOE_SPELLS[Math.floor(Math.random() * AOE_SPELLS.length)];

  const x = randomPlayer.GetX();
  const y = randomPlayer.GetY();
  const z = randomPlayer.GetZ();

  randomPlayer.CastSpellAoF(x, y, z, randomSpell);
}

function StartAOESpellTimer() {
  timerID = CreateTimer(SPELL_INTERVAL, () => {
    CastRandomAOESpell();
    StartAOESpellTimer();
  });
}

function StopAOESpellTimer() {
  if (timerID !== null) {
    DestroyTimer(timerID);
    timerID = null;
  }
}

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_STARTUP, StartAOESpellTimer);
RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_SHUTDOWN, StopAOESpellTimer);
```

In this script:
1. We define an array of AOE spell IDs (`AOE_SPELLS`) and the interval between each spell cast (`SPELL_INTERVAL`).
2. The `CastRandomAOESpell` function selects a random player from the world and a random AOE spell from the `AOE_SPELLS` array.
3. It then retrieves the player's coordinates (x, y, z) and uses the `CastSpellAoF` method to cast the random AOE spell at the player's location.
4. The `StartAOESpellTimer` function creates a timer that calls `CastRandomAOESpell` every `SPELL_INTERVAL` milliseconds.
5. The `StopAOESpellTimer` function destroys the timer when the server shuts down.
6. We register the `StartAOESpellTimer` function to be called on server startup and the `StopAOESpellTimer` function to be called on server shutdown.

This script demonstrates how to use the `CastSpellAoF` method to cast AOE spells at specific coordinates, creating a dynamic event that affects random players in the world.

## ClearInCombat
This method clears the unit's combat state, effectively removing the unit from combat.

### Parameters
None

### Returns
None

### Example Usage
In this example, we'll create a script that allows a player to use a special item to instantly clear their combat state and reset their health and mana to full.

```typescript
const ITEM_COMBAT_RESET = 12345; // Replace with the actual item entry ID

const OnUseItem: player_event_on_use_item = (event: number, player: Player, item: Item, target: WorldObject): void => {
    if (item.GetEntry() === ITEM_COMBAT_RESET) {
        if (player.IsInCombat()) {
            player.ClearInCombat();
            player.SetHealth(player.GetMaxHealth());
            player.SetPower(player.GetPowerType(), player.GetMaxPower(player.GetPowerType()));

            player.SendBroadcastMessage("You have used the Combat Reset item. Your combat state has been cleared, and your health and mana have been restored!");
        } else {
            player.SendBroadcastMessage("You are not in combat. The Combat Reset item has no effect.");
        }

        player.DestroyItemCount(ITEM_COMBAT_RESET, 1, true);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => OnUseItem(...args));
```

In this script:
1. We define a constant `ITEM_COMBAT_RESET` to store the entry ID of the special item that players can use to reset their combat state.
2. We register the `OnUseItem` event to listen for when a player uses an item.
3. When the event is triggered, we check if the used item's entry ID matches the `ITEM_COMBAT_RESET` entry ID.
4. If the player is in combat, we call the `ClearInCombat()` method to remove the player from combat.
5. We then set the player's health and mana/energy to their maximum values using `SetHealth()` and `SetPower()` methods.
6. We send a broadcast message to the player informing them that their combat state has been cleared and their health and mana have been restored.
7. If the player is not in combat, we send a message informing them that the item has no effect since they are not in combat.
8. Finally, we destroy one instance of the `ITEM_COMBAT_RESET` item from the player's inventory using the `DestroyItemCount()` method.

This script demonstrates how the `ClearInCombat()` method can be used in conjunction with other methods and events to create a unique gameplay mechanic, allowing players to instantly reset their combat state and restore their health and mana using a special item.

## ClearThreatList
This method clears the threat list of the unit, effectively resetting all threat levels of the unit's enemies to zero. This can be useful in certain situations where you want to manipulate the threat mechanics of the game.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
Here's an example of how you can use the `ClearThreatList` method in a script that reduces the threat level of a boss when it reaches a certain health threshold:

```typescript
const BOSS_ENTRY = 12345;
const THREAT_REDUCTION_THRESHOLD = 30;

const OnDamageTaken: creature_event_on_damage_taken = (event: number, creature: Creature, attacker: Unit, damage: number) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        const healthPercent = creature.GetHealthPct();
        
        if (healthPercent <= THREAT_REDUCTION_THRESHOLD) {
            creature.ClearThreatList();
            creature.SendUnitYell("My focus is weakened! You have a chance to strike now!", 0);
            
            // Apply a temporary damage buff to the raid
            const players = creature.GetPlayersInRange(50);
            for (const player of players) {
                player.AddAura(1234, player); // Assumes aura 1234 is a damage buff
            }
            
            // Start a timer to restore the boss's threat after a certain duration
            creature.RegisterEvent(
                () => {
                    creature.RemoveEvents();
                    creature.SendUnitYell("My strength returns! Cower before me!", 0);
                    
                    // Remove the temporary damage buff from the raid
                    const players = creature.GetPlayersInRange(50);
                    for (const player of players) {
                        player.RemoveAura(1234);
                    }
                },
                10000 // Restore threat after 10 seconds
            );
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DAMAGE_TAKEN, (...args) => OnDamageTaken(...args));
```

In this example:
1. We define constants for the boss's entry ID and the health threshold at which the threat reduction should occur.
2. Inside the `OnDamageTaken` event handler, we check if the damaged creature is the boss we're interested in.
3. If the boss's health drops below the specified threshold, we clear its threat list using `ClearThreatList()`.
4. We make the boss yell a message indicating that its focus is weakened, giving players a chance to strike.
5. We apply a temporary damage buff to all players within a 50-yard range of the boss.
6. We start a timer using `RegisterEvent` to restore the boss's threat after a certain duration (in this case, 10 seconds).
7. Inside the timer callback, we remove the registered event, make the boss yell another message, and remove the temporary damage buff from the players.

This script demonstrates how clearing the threat list can create an interesting gameplay mechanic where players have a window of opportunity to deal increased damage to the boss while its threat is temporarily reduced.

## ClearUnitState
Removes a specific unit state from the [Unit]. Unit states are used to control certain behaviors or conditions of a unit, such as whether they are stunned, rooted, or disarmed. By clearing a unit state, you can remove these effects from the unit.

### Parameters
* state: number - The unit state to remove. Refer to the UnitState enum for possible values.

### Example Usage
In this example, we'll create a script that removes the stunned and rooted states from a player's target when they use a specific item.

```typescript
const CLEANSING_TOTEM_ITEM_ENTRY = 12345;
const UNIT_STATE_STUNNED = 0x00000040;
const UNIT_STATE_ROOTED = 0x00000100;

const OnUseItem: player_event_on_use_item = (event: number, player: Player, item: Item, target: Unit) => {
    if (item.GetEntry() === CLEANSING_TOTEM_ITEM_ENTRY) {
        const targetUnit = player.GetSelection();
        if (targetUnit) {
            // Check if the target unit is stunned or rooted
            if (targetUnit.HasUnitState(UNIT_STATE_STUNNED) || targetUnit.HasUnitState(UNIT_STATE_ROOTED)) {
                // Remove the stunned and rooted states from the target
                targetUnit.ClearUnitState(UNIT_STATE_STUNNED);
                targetUnit.ClearUnitState(UNIT_STATE_ROOTED);

                // Send a message to the player indicating the states have been removed
                player.SendBroadcastMessage(`You have cleansed the stunned and rooted effects from ${targetUnit.GetName()}!`);
            } else {
                // Send a message to the player if the target is not stunned or rooted
                player.SendBroadcastMessage(`${targetUnit.GetName()} is not currently stunned or rooted.`);
            }
        } else {
            // Send a message to the player if they don't have a target selected
            player.SendBroadcastMessage("You must select a target to use this item.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => OnUseItem(...args));
```

In this script:
1. We define constants for the item entry and the unit states we want to remove (stunned and rooted).
2. When a player uses an item, we check if the item used matches the specified entry (CLEANSING_TOTEM_ITEM_ENTRY).
3. If the item matches, we get the player's current target using `player.GetSelection()`.
4. We check if the target unit exists and if it has the stunned or rooted unit states using `targetUnit.HasUnitState()`.
5. If the target is stunned or rooted, we remove those states using `targetUnit.ClearUnitState()` for each state.
6. We send a message to the player indicating that the states have been removed from the target.
7. If the target is not stunned or rooted, or if the player doesn't have a target selected, we send appropriate messages to the player.

This script demonstrates how to use the `ClearUnitState()` method to remove specific unit states from a target unit when a player uses a designated item. It also showcases error handling by checking if the player has a valid target and if the target has the desired unit states before attempting to remove them.

## CountPctFromCurHealth
Returns the percentage of the unit's current health in relation to their maximum health.

### Parameters
None

### Returns
pct: number - The percentage of the unit's current health.

### Example Usage:
Buff the player with a special ability when dropping below 20% health.

```typescript
const SPECIAL_ABILITY_AURA = 12345;
const HEALTH_THRESHOLD = 20;

const CheckPlayerHealth: player_event_on_update = (event: number, player: Player, diff: number) => {
    const healthPct = player.CountPctFromCurHealth();

    if (healthPct <= HEALTH_THRESHOLD) {
        if (!player.HasAura(SPECIAL_ABILITY_AURA)) {
            player.AddAura(SPECIAL_ABILITY_AURA, player);
            player.SendBroadcastMessage("You feel a surge of power as your health drops low!");
        }
    } else {
        if (player.HasAura(SPECIAL_ABILITY_AURA)) {
            player.RemoveAura(SPECIAL_ABILITY_AURA);
            player.SendBroadcastMessage("The special ability fades as your health recovers.");
        }
    }
}

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckPlayerHealth(...args), 1000);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, we register a player update event that checks the player's health percentage every second (1000 ms). When the player's health drops below the defined `HEALTH_THRESHOLD` (20% in this case), we apply a special ability aura to the player and send them a message. If the player's health recovers above the threshold, we remove the aura and send another message.

The `OnLogin` event is used to register the `CheckPlayerHealth` function to the `PLAYER_EVENT_ON_UPDATE` event when the player logs in, ensuring that the health monitoring starts as soon as the player enters the game.

This script demonstrates how the `CountPctFromCurHealth` method can be used in combination with other methods and events to create dynamic gameplay experiences based on the player's current health status.

## CountPctFromMaxHealth
This method returns the percentage of the [Unit]'s current health in relation to their maximum health.

### Parameters
This method does not take any parameters.

### Returns
number - The percentage of the [Unit]'s current health.

### Example Usage
In this example, we will create a script that will display a warning message to the [Player] when their health drops below 50% of their maximum health.

```typescript
const HEALTH_WARNING_THRESHOLD = 50;

const HealthCheck: player_event_on_update = (event: number, player: Player, diff: number) => {
    const healthPct = player.CountPctFromMaxHealth();

    if (healthPct <= HEALTH_WARNING_THRESHOLD) {
        const healthPctRounded = Math.round(healthPct);
        const maxHealth = player.GetMaxHealth();
        const currentHealth = player.GetHealth();

        player.SendBroadcastMessage(`WARNING: Your health is at ${healthPctRounded}%!`);
        player.SendBroadcastMessage(`You have ${currentHealth} / ${maxHealth} health remaining.`);

        if (healthPct <= 20) {
            player.SendBroadcastMessage("CRITICAL: Your health is critically low! Seek healing immediately!");
        } else if (healthPct <= 35) {
            player.SendBroadcastMessage("DANGER: Your health is dangerously low! Be cautious and consider healing.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => HealthCheck(...args));
```

In this script:
1. We define a constant `HEALTH_WARNING_THRESHOLD` to set the percentage threshold at which we want to start displaying warning messages to the player.
2. We create a function `HealthCheck` that will be triggered on the `PLAYER_EVENT_ON_UPDATE` event.
3. Inside the function, we call `player.CountPctFromMaxHealth()` to get the current health percentage of the player.
4. We check if the health percentage is less than or equal to the warning threshold.
5. If the condition is met, we perform the following actions:
   - Round the health percentage to the nearest integer using `Math.round()`.
   - Get the player's maximum health using `player.GetMaxHealth()`.
   - Get the player's current health using `player.GetHealth()`.
   - Send a broadcast message to the player indicating their current health percentage.
   - Send another broadcast message showing the player's current health and maximum health.
   - If the health percentage is critically low (20% or below), send an additional critical warning message.
   - If the health percentage is dangerously low (35% or below), send an additional danger warning message.
6. Finally, we register the `HealthCheck` function to be triggered on the `PLAYER_EVENT_ON_UPDATE` event using `RegisterPlayerEvent()`.

This script provides a more comprehensive example of using the `CountPctFromMaxHealth()` method to monitor the player's health and provide appropriate warnings based on different health percentage thresholds.

## DeMorph
The `DeMorph` method is used to revert a [Unit](./unit.md)'s display ID back to its original native display ID, effectively removing any active morphs on the unit.

When a unit is morphed, its display ID is changed to a different creature or object display ID. This method allows you to remove the morph effect and restore the unit's original appearance.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
In this example, we'll create a script that morphs a player into a random creature when they enter combat, and then reverts the morph when the combat ends.

```typescript
const morphEntries = [1234, 5678, 9012, 3456, 7890]; // Array of creature entry IDs for morphing

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const randomMorphEntry = morphEntries[Math.floor(Math.random() * morphEntries.length)];
    player.SetDisplayId(randomMorphEntry);
}

const onLeaveCombat: player_event_on_leave_combat = (event: number, player: Player): void => {
    player.DeMorph();
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEAVE_COMBAT, (...args) => onLeaveCombat(...args));
```

In this script:
1. We define an array called `morphEntries` that contains a list of creature entry IDs that we want to use for morphing the player.
2. We register a `PLAYER_EVENT_ON_ENTER_COMBAT` event handler using `RegisterPlayerEvent`. When the player enters combat, the `onEnterCombat` function is called.
3. Inside the `onEnterCombat` function, we select a random creature entry ID from the `morphEntries` array using `Math.random()` and store it in the `randomMorphEntry` variable.
4. We use the `SetDisplayId` method of the player object to morph the player into the randomly selected creature display ID.
5. We also register a `PLAYER_EVENT_ON_LEAVE_COMBAT` event handler using `RegisterPlayerEvent`. When the player leaves combat, the `onLeaveCombat` function is called.
6. Inside the `onLeaveCombat` function, we use the `DeMorph` method of the player object to revert the player's display ID back to their original appearance.

With this script, whenever the player enters combat, they will be morphed into a random creature from the `morphEntries` array. When the combat ends, the player will be demorphed and restored to their original appearance.

Note: Make sure to replace the placeholder entry IDs in the `morphEntries` array with valid creature entry IDs from your AzerothCore database.

## DealDamage
Makes the [Unit] damage the target [Unit] based on the provided parameters. This method can be used to simulate any type of damage done to a unit, whether it's environmental, spell based, or melee damage.

### Parameters
* target: [Unit](./unit.md) - The Unit that will be damaged
* damage: number - The amount of damage to deal
* durabilityloss?: boolean - If set to 'true', the damage will cause durability loss. Default is 'false'
* school?: SpellSchools - The school of the damage. Default is SPELL_SCHOOL_NORMAL
* spell?: number - The spell ID if the damage was caused by a spell

### Example Usage:
Example of an NPC dealing shadow damage to a player on each successful melee attack with a chance to proc an additional shadow damage spell.
```typescript
const SHADOW_DAMAGE_SPELL_ID = 31618;
const SHADOW_DAMAGE_CHANCE = 25;

const OnMeleeAttack: creature_event_on_hit_by_spell = (event: CreatureEvents, creature: Creature, attacker: Unit, spellId: number, schoolMask: number, typeMask: number, amount: number, isPeriodic: boolean) => {
    if (attacker && attacker.IsPlayer()) {
        const player = attacker.ToPlayer();
        if (player) {
            creature.DealDamage(player, amount, false, SpellSchools.SPELL_SCHOOL_NORMAL);

            if (RandomChance(SHADOW_DAMAGE_CHANCE)) {
                const shadowDamage = amount * 0.5;
                creature.DealDamage(player, shadowDamage, false, SpellSchools.SPELL_SCHOOL_SHADOW, SHADOW_DAMAGE_SPELL_ID);
                creature.SendUnitWhisper("Embrace the shadow!", 0, player);
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_EVENT_ON_HIT_BY_SPELL, (...args) => OnMeleeAttack(...args));
```

In this example, whenever a player deals melee damage to the creature, the creature will retaliate with the same amount of normal damage. Additionally, there is a 25% chance that the creature will deal bonus shadow damage equal to 50% of the melee damage dealt, simulating a shadow damage proc effect. The `SendUnitWhisper` method is used to send a taunting message to the player when the proc occurs.

## DealHeal
Makes the [Unit] heal the target [Unit] with the given spell.

### Parameters
* target: [Unit](./unit.md) - The target Unit to be healed
* spell: number - The spell ID used to heal the target
* amount: number - The amount of healing to be dealt
* critical: boolean (optional) - Whether the heal should be a critical heal or not

### Example Usage
This example script listens for the `UNIT_EVENT_ON_HEAL_TAKEN` event and modifies the healing amount based on certain conditions.

```typescript
const onHealTaken: unit_event_on_heal_taken = (event: number, healer: Unit, healTarget: Unit, spell: number, amount: number): void => {
    const SPELL_REJUVENATION = 774;
    const SPELL_REGROWTH = 8936;
    const DRUID_CLASS_MASK = 1024;

    // Check if the healer is a Druid
    if (healer.GetClass() & DRUID_CLASS_MASK) {
        // Increase healing done by Rejuvenation and Regrowth by 10%
        if (spell === SPELL_REJUVENATION || spell === SPELL_REGROWTH) {
            amount *= 1.1;
        }

        // Apply the modified healing amount
        healer.DealHeal(healTarget, spell, amount);
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_HEAL_TAKEN, (...args) => onHealTaken(...args));
```

In this example:
1. We define the `onHealTaken` function to handle the `UNIT_EVENT_ON_HEAL_TAKEN` event.
2. Inside the function, we define constants for the Rejuvenation and Regrowth spell IDs and the Druid class mask.
3. We check if the healer's class matches the Druid class mask using the `GetClass()` method.
4. If the healer is a Druid and the spell used is either Rejuvenation or Regrowth, we increase the healing amount by 10%.
5. Finally, we call the `DealHeal()` method on the healer, passing the modified healing amount to apply the heal to the target.
6. We register the `onHealTaken` function to be triggered whenever the `UNIT_EVENT_ON_HEAL_TAKEN` event occurs using `RegisterUnitEvent()`.

This script demonstrates how to intercept the healing event and modify the healing amount based on specific conditions, such as the healer's class and the spell used. It allows for customization of healing effects in the game.

## Dismount
This method will dismount the [Unit](./unit.md) if it is mounted.

### Parameters
This method does not take any parameters.

### Returns
This method does not return anything.

### Example Usage
Dismount the player when they enter a specific area.
```typescript
const AREA_ID_STORMWIND_KEEP = 1519;

const onAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaId: number): void => {
    if (areaId === AREA_ID_STORMWIND_KEEP) {
        // Check if the player is mounted
        if (player.IsMounted()) {
            // Dismount the player
            player.Dismount();

            // Send a message to the player
            player.SendBroadcastMessage("You have been dismounted upon entering Stormwind Keep.");

            // Play a sound to the player
            player.PlayDirectSound(1906); // Sound ID for "No"

            // Add a cooldown to prevent the player from mounting again for 10 seconds
            player.AddAura(SPELL_AURA_MOUNTED, player, 10);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => onAreaTrigger(...args));
```
In this example:
1. We define a constant `AREA_ID_STORMWIND_KEEP` with the area ID of Stormwind Keep.
2. We register a player event handler for the `PLAYER_EVENT_ON_AREA_TRIGGER` event.
3. Inside the event handler, we check if the triggered area ID matches `AREA_ID_STORMWIND_KEEP`.
4. If the player is in Stormwind Keep, we check if the player is currently mounted using the `IsMounted()` method.
5. If the player is mounted, we call the `Dismount()` method to dismount the player.
6. We send a broadcast message to the player informing them that they have been dismounted.
7. We play a sound effect to the player using the `PlayDirectSound()` method with the sound ID for "No".
8. Finally, we add an aura to the player using the `AddAura()` method with the `SPELL_AURA_MOUNTED` spell ID and a duration of 10 seconds. This prevents the player from mounting again for a short period after being dismounted.

This script ensures that players are dismounted when entering Stormwind Keep, providing a immersive experience and preventing any potential exploits or unintended behavior.

## EmoteState
Makes the [Unit] perform the given emote continuously. This emote will be performed by the unit until it is instructed to stop or perform another emote.

### Parameters
* emoteId: number - The ID of the emote to perform. You can find a list of emote IDs in the [Emotes.dbc](https://github.com/wowdev/WoWDBDefs/blob/master/definitions/Emotes.dbd).

### Example Usage
This example demonstrates how to make a creature perform a continuous emote when a player interacts with it, and stop the emote after a certain duration.

```typescript
const CREATURE_ENTRY = 1234;
const EMOTE_DANCE = 10;
const EMOTE_DURATION = 5000; // 5 seconds

const onGossipHello: creature_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    creature.EmoteState(EMOTE_DANCE);

    // Create a timed event to stop the emote after the specified duration
    RegisterTimedEvent("StopEmote", EMOTE_DURATION, 1, () => {
        creature.EmoteState(0); // Stop the emote by passing 0 as the emoteId
    });

    player.GossipMenuAddItem(0, "Hello, dancing creature!", 0, 1);
    player.GossipSendMenu(1, creature, MenuId);
};

const onGossipSelect: creature_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number) => {
    if (sender === 0 && action === 1) {
        player.GossipComplete();
        creature.Say("Thanks for watching my dance!", 0);
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, onGossipHello);
RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, onGossipSelect);
```

In this example:
1. When a player interacts with the creature (opens the gossip menu), the `onGossipHello` event is triggered.
2. The creature starts performing the dance emote continuously using `creature.EmoteState(EMOTE_DANCE)`.
3. A timed event is registered to stop the emote after the specified duration (`EMOTE_DURATION`) using `RegisterTimedEvent`. The event is given a unique name ("StopEmote") and will execute once after the specified delay.
4. The gossip menu is populated with a single option using `player.GossipMenuAddItem` and sent to the player using `player.GossipSendMenu`.
5. When the player selects the gossip option, the `onGossipSelect` event is triggered.
6. If the selected option matches the expected sender and action values, the gossip menu is closed using `player.GossipComplete`, and the creature says a message using `creature.Say`.

This example showcases how to make a creature perform a continuous emote, stop the emote after a certain duration using a timed event, and interact with the player through the gossip system.

## GetAura
Returns the [Aura](./aura.md) object of the specified spell ID on the [Unit](./unit.md). If the unit does not have the aura, the method will return `nil`.

### Parameters
* spellID: number - The ID of the spell to retrieve the aura for.

### Returns
* [Aura](./aura.md) or `nil` - The Aura object of the specified spell ID on the unit, or `nil` if the unit does not have the aura.

### Example Usage
In this example, we'll create a script that checks if a player has the "Blessing of Might" aura when they enter combat. If the player doesn't have the aura, we'll cast it on them.

```typescript
const BLESSING_OF_MIGHT_SPELL_ID = 19740;

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const blessingOfMight = player.GetAura(BLESSING_OF_MIGHT_SPELL_ID);

    if (!blessingOfMight) {
        // Find a nearby paladin to cast Blessing of Might on the player
        const nearbyPaladins = player.GetPlayersInRange(20, 2); // 2 is the faction mask for friendly players

        for (const paladin of nearbyPaladins) {
            if (paladin.GetClass() === Classes.CLASS_PALADIN) {
                paladin.CastSpell(player, BLESSING_OF_MIGHT_SPELL_ID, true);
                player.SendBroadcastMessage(`${paladin.GetName()} has blessed you with Blessing of Might!`);
                break;
            }
        }

        if (!player.GetAura(BLESSING_OF_MIGHT_SPELL_ID)) {
            player.SendBroadcastMessage("No nearby paladins found to bless you with Blessing of Might.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script:
1. We define the spell ID for "Blessing of Might" as a constant.
2. When a player enters combat, we use the `GetAura()` method to check if the player has the "Blessing of Might" aura.
3. If the player doesn't have the aura, we search for nearby friendly paladins within 20 yards using `GetPlayersInRange()`.
4. We iterate through the nearby paladins and check if any of them are of the paladin class using `GetClass()`.
5. If a paladin is found, we cast "Blessing of Might" on the player using `CastSpell()` and send a broadcast message to the player informing them of the blessing.
6. If no nearby paladins are found, we send a broadcast message to the player informing them that no paladins were found to bless them.

This example demonstrates how to use the `GetAura()` method to check for a specific aura on a unit and how to interact with other units (players) based on the presence or absence of that aura.

## GetBaseSpellPower
Returns the base spell power of the unit for a given spell school.

### Parameters
* spellSchool: number - The spell school to retrieve the base spell power for. The available spell schools are:
  * 0: Normal
  * 1: Holy
  * 2: Fire
  * 3: Nature
  * 4: Frost
  * 5: Shadow
  * 6: Arcane

### Returns
* number - The base spell power of the unit for the specified spell school.

### Example Usage
```typescript
const SCHOOL_FIRE = 2;
const SCHOOL_FROST = 4;

const onDamage: unit_event_on_damage = (event: number, unit: Unit, attacker: Unit, damage: number, spellId: number, schoolMask: number): void => {
    const fireSpellPower = unit.GetBaseSpellPower(SCHOOL_FIRE);
    const frostSpellPower = unit.GetBaseSpellPower(SCHOOL_FROST);

    let damageModifier = 1;

    if (schoolMask & SCHOOL_FIRE) {
        damageModifier += fireSpellPower / 1000;
    }

    if (schoolMask & SCHOOL_FROST) {
        damageModifier += frostSpellPower / 1000;
    }

    const modifiedDamage = damage * damageModifier;

    unit.DealDamage(attacker, modifiedDamage, false, spellId, schoolMask);

    if (unit.GetHealthPct() <= 20) {
        const healAmount = (fireSpellPower + frostSpellPower) * 0.1;
        unit.SetHealth(unit.GetHealth() + healAmount);
        unit.SendChatMessage(ChatMsg.CHAT_MSG_EMOTE, 0, `${unit.GetName()} is healed for ${healAmount} by the power of fire and frost!`);
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_DAMAGE, (...args) => onDamage(...args));
```
In this example, when a unit takes damage, the script retrieves the unit's base spell power for the Fire and Frost spell schools using `GetBaseSpellPower()`. It then modifies the incoming damage based on the spell power values. If the damage is of the Fire or Frost school (determined by checking the `schoolMask`), the damage is increased by a percentage proportional to the respective spell power.

After dealing the modified damage to the attacker using `DealDamage()`, the script checks if the unit's health percentage is below or equal to 20%. If so, it heals the unit based on a combination of the Fire and Frost spell power values and sends an emote message indicating the amount of healing done.

This example demonstrates how `GetBaseSpellPower()` can be used to retrieve the base spell power for different spell schools and utilize it to modify damage and perform additional actions based on the spell power values.

## GetCharmGUID
Returns the GUID (Globally Unique Identifier) of the unit that is currently charming this unit. If the unit is not being charmed, it will return 0.

### Parameters
None

### Returns
charmerGuid: number - The GUID of the charmer unit, or 0 if the unit is not being charmed.

### Example Usage
In this example, we'll create a script that checks if a player is being charmed by another unit. If the player is being charmed, the script will retrieve the GUID of the charmer and use it to get the charmer's name. The script will then send a message to the player with the name of the charmer.

```typescript
const CheckCharm: player_event_on_update = (event: number, player: Player, diff: number) => {
    const charmerGuid = player.GetCharmGUID();

    if (charmerGuid !== 0) {
        const charmer = player.GetMap().GetUnit(charmerGuid);

        if (charmer) {
            const charmerName = charmer.GetName();
            player.SendBroadcastMessage(`You are being charmed by ${charmerName}!`);

            // If the charmer is a player, we can get their account name and GM level
            if (charmer instanceof Player) {
                const accountName = charmer.GetAccountName();
                const gmLevel = charmer.GetGMRank();
                player.SendBroadcastMessage(`Charmer's account name: ${accountName}, GM Level: ${gmLevel}`);
            }
        } else {
            player.SendBroadcastMessage("You are being charmed, but the charmer is not in your map!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckCharm(...args));
```

In this script, we register a `PLAYER_EVENT_ON_UPDATE` event, which is triggered every server tick for each player. Inside the event handler, we first get the GUID of the player's charmer using `player.GetCharmGUID()`. If the returned GUID is not 0, it means the player is being charmed.

We then use the `player.GetMap().GetUnit(charmerGuid)` method to get the actual charmer unit object. If the charmer is found, we retrieve its name using `charmer.GetName()` and send a message to the player informing them about the charmer.

Additionally, if the charmer is also a player (checked using `charmer instanceof Player`), we retrieve the charmer's account name and GM level using `charmer.GetAccountName()` and `charmer.GetGMRank()` respectively, and send this information to the charmed player.

If the charmer unit is not found in the player's map, we send a message to the player indicating that they are being charmed, but the charmer is not in their map.

## GetCharmerGUID
Returns the GUID of the unit that is charming this unit. If the unit is not being charmed, it will return 0.

### Parameters
None

### Returns
charmerGuid: number - The GUID of the charmer unit, or 0 if the unit is not being charmed.

### Example Usage
This example demonstrates how to check if a unit is being charmed and retrieve the GUID of the charmer. It also shows how to use the GUID to find the charmer unit and interact with it.

```typescript
const OnUnitDeath: vehicle_event_on_passenger_removed = (event: number, vehicle: Vehicle, unit: Unit) => {
    // Check if the removed passenger was being charmed
    const charmerGuid = unit.GetCharmerGUID();
    if (charmerGuid !== 0) {
        // Find the charmer unit using the GUID
        const charmer = GetUnitByGUID(charmerGuid);
        if (charmer) {
            // Break the charm effect on the charmer
            charmer.RemoveAurasDueToSpell(SPELL_CHARM);

            // Send a message to the charmer
            if (charmer.IsPlayer()) {
                const charmerPlayer = charmer.ToPlayer();
                charmerPlayer.SendBroadcastMessage("Your charm effect has been broken!");
            }

            // Deal damage to the charmer
            const damage = unit.GetMaxHealth() * 0.25; // 25% of the charmed unit's max health
            charmer.DealDamage(charmer, damage);

            // Apply a debuff to the charmer
            charmer.AddAura(SPELL_CHARMER_DEBUFF, 30); // 30 seconds duration
        }
    }
};

RegisterVehicleEvent(VehicleEvents.VEHICLE_EVENT_ON_PASSENGER_REMOVED, OnUnitDeath);
```

In this example:
1. When a passenger is removed from a vehicle, the script checks if the removed unit was being charmed using `GetCharmerGUID()`.
2. If the unit was being charmed (charmerGuid !== 0), it retrieves the charmer unit using `GetUnitByGUID(charmerGuid)`.
3. If the charmer unit is found, the script performs the following actions:
   - Removes the charm effect from the charmer using `RemoveAurasDueToSpell(SPELL_CHARM)`.
   - Sends a broadcast message to the charmer if it's a player, informing them that the charm effect has been broken.
   - Deals damage to the charmer equal to 25% of the charmed unit's maximum health using `DealDamage()`.
   - Applies a debuff to the charmer using `AddAura(SPELL_CHARMER_DEBUFF, 30)` with a duration of 30 seconds.

This example showcases how to utilize the `GetCharmerGUID()` method to retrieve the charmer's GUID and perform various actions based on that information, such as breaking the charm effect, sending messages, dealing damage, and applying debuffs.

## GetClass
Returns the class ID of the [Unit]. The class ID is a unique identifier for each class in the game, such as Warrior, Paladin, Hunter, etc.

### Parameters
This method does not take any parameters.

### Returns
* number - The class ID of the [Unit].

### Example Usage
Here's an example of how to use the `GetClass` method to check if a unit is a Warrior and grant them a bonus to their strength stat:

```typescript
const CLASS_WARRIOR = 1;
const STRENGTH_BONUS = 50;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const playerClass = player.GetClass();

    if (playerClass === CLASS_WARRIOR) {
        const currentStrength = player.GetStrength();
        const newStrength = currentStrength + STRENGTH_BONUS;

        player.SetStrength(newStrength);

        player.SendBroadcastMessage(`As a mighty Warrior, you have been granted a bonus of ${STRENGTH_BONUS} strength!`);
        player.PlayDirectSound(8212); // Play a sound effect
        player.CastSpell(player, 43223, true); // Cast a visual effect spell
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:

1. We define constants for the Warrior class ID and the strength bonus value.
2. In the `OnLogin` event, we retrieve the player's class using `GetClass()`.
3. We check if the player's class is equal to the Warrior class ID.
4. If the player is a Warrior, we retrieve their current strength using `GetStrength()`.
5. We calculate the new strength value by adding the strength bonus.
6. We update the player's strength using `SetStrength()`.
7. We send a broadcast message to the player informing them of the bonus.
8. We play a sound effect using `PlayDirectSound()` and cast a visual effect spell using `CastSpell()`.

This script will grant a bonus of 50 strength to Warriors when they log in, providing them with a small advantage in combat. The broadcast message, sound effect, and visual effect enhance the player's experience and make the bonus feel more impactful.

## GetClassAsString
Returns the name of the [Unit]'s class in the given locale or default locale if not provided.

### Parameters
* locale: [LocaleConstant](../enums/LocaleConstant.md) (optional) - The locale to return the class name in. If not provided, the default locale will be used.

### Returns
* string - The name of the [Unit]'s class in the specified or default locale, or nil if the class is not found.

### Example Usage
```typescript
const BOSS_RAZOR_ID = 8564;

const RazorDialogueOnSpawn: creature_event_on_spawn = (event: CreatureEvents, creature: Creature) => {
    const bossRazor = creature.ToCreature();
    if (!bossRazor || bossRazor.GetEntry() !== BOSS_RAZOR_ID) {
        return;
    }

    const className = bossRazor.GetClassAsString(LocaleConstant.LOCALE_enUS);
    if (className) {
        bossRazor.SendUnitYell(`Tremble before me, mortals! I am Razor, the mighty ${className}!`, 0);
    } else {
        bossRazor.SendUnitYell("Tremble before me, mortals! I am Razor, the mighty warrior!", 0);
    }

    const chineseClassName = bossRazor.GetClassAsString(LocaleConstant.LOCALE_zhCN);
    if (chineseClassName) {
        bossRazor.SendUnitYell(`在我面前颤抖吧，凡人！我是剃刀，强大的${chineseClassName}！`, 0, Language.LANG_UNIVERSAL, nil, true);
    }
};

RegisterCreatureEvent(BOSS_RAZOR_ID, CreatureEvents.CREATURE_EVENT_ON_SPAWN, RazorDialogueOnSpawn);
```

In this example, when the boss creature Razor spawns, it retrieves its class name in both English (enUS) and Chinese (zhCN) locales using the `GetClassAsString` method. If the class name is found, Razor yells a message incorporating the class name in the respective language. If the class name is not found for English, a default message is used instead.

This script demonstrates how the `GetClassAsString` method can be used to retrieve localized class names for a unit, allowing for dynamic and localized dialogue or other interactions based on the unit's class.

## GetClassMask
Returns the class mask of the unit. The class mask is a bitfield that represents the classes that the unit belongs to. Each bit in the mask corresponds to a specific class. For example, if the first bit (least significant bit) is set, it means the unit belongs to the Warrior class. If the third bit is set, the unit belongs to the Paladin class, and so on.

### Parameters
This method does not take any parameters.

### Returns
- `number`: The class mask of the unit.

### Example Usage
In this example, we'll create a script that checks if a creature belongs to a specific class and awards bonus reputation to players who kill creatures of that class.

```typescript
const BONUS_REPUTATION_FACTION_ID = 946; // Example faction ID
const BONUS_REPUTATION_AMOUNT = 100; // Example bonus reputation amount
const TARGET_CLASS_MASK = 0x8; // Example class mask for Rogue (8th bit set)

const OnCreatureKill: player_event_On_Kill_Creature = (event: number, player: Player, creature: Creature) => {
    // Get the class mask of the killed creature
    const creatureClassMask = creature.GetClassMask();

    // Check if the creature belongs to the target class
    if ((creatureClassMask & TARGET_CLASS_MASK) !== 0) {
        // Award bonus reputation to the player
        const faction = player.GetFactionByID(BONUS_REPUTATION_FACTION_ID);
        if (faction) {
            player.SetFactionReputation(faction, player.GetReputationValue(faction) + BONUS_REPUTATION_AMOUNT);
            player.SendBroadcastMessage(`You have been awarded ${BONUS_REPUTATION_AMOUNT} bonus reputation for killing a Rogue!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => OnCreatureKill(...args));
```

In this script:

1. We define constants for the bonus reputation faction ID, bonus reputation amount, and the target class mask (in this case, the Rogue class).

2. We register the `OnCreatureKill` event handler using `RegisterPlayerEvent`.

3. Inside the event handler, we get the class mask of the killed creature using `creature.GetClassMask()`.

4. We check if the creature's class mask matches the target class mask using a bitwise AND operation. If the result is non-zero, it means the creature belongs to the target class.

5. If the creature belongs to the target class, we retrieve the faction object using `player.GetFactionByID()` with the bonus reputation faction ID.

6. If the faction object is found, we calculate the new reputation value by adding the bonus reputation amount to the player's current reputation value for that faction using `player.GetReputationValue()`.

7. We update the player's reputation using `player.SetFactionReputation()` with the new reputation value.

8. Finally, we send a broadcast message to the player informing them about the bonus reputation award.

This script demonstrates how the `GetClassMask()` method can be used to determine the class of a unit and perform specific actions based on that information.

## GetControllerGUID
Returns the GUID of the [Unit]'s charmer or owner. This method is useful for determining if a unit is being controlled by another entity, such as a player or a creature with mind control abilities.

### Parameters
This method does not take any parameters.

### Returns
- number: The GUID of the unit's charmer or owner. If the unit is not being controlled, the method will return 0.

### Example Usage
In this example, we'll create an event that checks if a player is being mind controlled by another unit. If the player is being controlled, we'll display a message to the player and their controller, and then break the mind control effect.

```typescript
const OnPlayerMindControlled: player_event_on_update = (event: number, player: Player, diff: number) => {
    const controllerGUID = player.GetControllerGUID();

    if (controllerGUID !== 0) {
        const controller = player.GetMap().GetUnit(controllerGUID);

        if (controller) {
            player.SendBroadcastMessage(`You are being mind controlled by ${controller.GetName()}!`);
            controller.SendBroadcastMessage(`You are mind controlling ${player.GetName()}!`);

            // Break the mind control effect
            player.RemoveAurasDueToSpell(605); // Mind Control spell ID
            player.SendBroadcastMessage("You have broken free from the mind control!");
            controller.SendBroadcastMessage(`${player.GetName()} has broken free from your mind control!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => OnPlayerMindControlled(...args));
```

In this script, we register a `PLAYER_EVENT_ON_UPDATE` event that triggers periodically for each player. Inside the event handler, we call the `GetControllerGUID()` method on the player object to check if they are being controlled by another unit.

If the returned GUID is not 0, it means the player is being mind controlled. We then use the `GetMap().GetUnit(controllerGUID)` method to obtain the actual controller unit object.

If the controller unit is found, we send messages to both the player and the controller using the `SendBroadcastMessage()` method, informing them about the mind control situation.

Finally, we break the mind control effect by removing the Mind Control aura from the player using the `RemoveAurasDueToSpell()` method, passing the spell ID of the Mind Control spell (in this case, 605). We then send additional messages to the player and controller, indicating that the mind control has been broken.

This example demonstrates how the `GetControllerGUID()` method can be used in conjunction with other methods and events to create interactive gameplay scenarios involving mind control mechanics.

## GetControllerGUIDS
Returns the GUID of the Unit's charmer or owner. If the Unit is not possessed or owned, it returns the Unit's own GUID.

### Parameters
None

### Returns
controllerGUID: number - The GUID of the Unit's charmer, owner, or its own GUID.

### Example Usage
This example demonstrates how to use GetControllerGUIDS to determine if a Unit is being controlled by another entity and perform different actions based on the controller's GUID.

```typescript
const HandleUnitSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    const controllerGUID = creature.GetControllerGUIDS();
    const creatureGUID = creature.GetGUID();

    if (controllerGUID !== creatureGUID) {
        // The creature is being controlled by another entity
        const controller = GetUnitByGUID(controllerGUID);

        if (controller && controller.IsPlayer()) {
            // The controller is a player
            const player = controller.ToPlayer();
            player.SendBroadcastMessage(`You are controlling ${creature.GetName()}!`);

            // Set the creature's faction to match the player's faction
            creature.SetFaction(player.GetFaction());
        } else if (controller && controller.IsCreature()) {
            // The controller is another creature
            const masterCreature = controller.ToCreature();
            masterCreature.SendUnitSay(`I am controlling ${creature.GetName()}!`, 0);

            // Make the controlled creature assist the master creature in combat
            creature.SetAssistMode(true);
            creature.SetTargetUnit(masterCreature.GetVictim());
        }
    } else {
        // The creature is not being controlled
        creature.SendUnitSay("I am not being controlled by anyone.", 0);

        // Perform actions for an uncontrolled creature
        // ...
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => HandleUnitSpawn(...args));
```

In this example:
1. When a creature spawns, we retrieve its controller's GUID using `GetControllerGUIDS()`.
2. We compare the controller's GUID with the creature's own GUID to determine if it's being controlled.
3. If the creature is controlled by a player:
   - We send a message to the player indicating they are controlling the creature.
   - We set the creature's faction to match the player's faction.
4. If the creature is controlled by another creature:
   - We make the controlled creature assist the master creature in combat.
   - We set the controlled creature's target to the master creature's current target.
5. If the creature is not being controlled:
   - We make the creature say a message indicating it's not being controlled.
   - We can perform additional actions for an uncontrolled creature.

This example showcases how `GetControllerGUIDS()` can be used to determine the controlling entity of a Unit and adapt the behavior of the Unit based on its controller.

## GetCreatorGUID
Returns the GUID of the [Unit](./unit.md) that created this [Unit](./unit.md). This is useful for determining the owner of a pet, summon, or any other unit that was created by another unit.

### Parameters
This method does not take any parameters.

### Returns
number: The GUID of the creator [Unit](./unit.md). If the [Unit](./unit.md) has no creator, it returns 0.

### Example Usage
In this example, we'll create a script that checks if a player's pet has been killed and notify the player about it.

```typescript
const PET_KILLED = (event: number, killer: Unit, killed: Unit): void => {
    // Check if the killed unit is a player's pet
    if (killed.IsPet()) {
        const creatorGUID = killed.GetCreatorGUID();
        // Find the player who owns the pet
        const player = GetPlayerByGUID(creatorGUID);
        if (player) {
            // Notify the player that their pet has been killed
            player.SendBroadcastMessage(`Your pet ${killed.GetName()} has been killed by ${killer.GetName()}!`);
            // Despawn the pet's corpse after 5 seconds
            killed.Despawn(5000);
            // Respawn the pet in 2 minutes
            player.SpawnPet(2 * MINUTE * IN_MILLISECONDS);
        }
    }
};

RegisterServerEvent(ServerEvents.CREATURE_ON_KILLED, (...args) => PET_KILLED(...args));
```

In this script:
1. We register a listener for the `CREATURE_ON_KILLED` event.
2. When a creature is killed, we check if it's a player's pet using `IsPet()`.
3. If it's a pet, we get the creator's GUID using `GetCreatorGUID()`.
4. We find the player who owns the pet using `GetPlayerByGUID(creatorGUID)`.
5. If the player is found, we send them a message using `SendBroadcastMessage()` to notify them about their pet's death.
6. We despawn the pet's corpse after 5 seconds using `Despawn(5000)`.
7. We respawn the pet for the player after 2 minutes using `SpawnPet(2 * MINUTE * IN_MILLISECONDS)`.

This script demonstrates how `GetCreatorGUID()` can be used to identify the owner of a pet and take actions based on that information.

## GetCreatureType

Returns the creature type of the unit based on the CreatureType enum.

### Parameters

None

### Returns

creatureType: [CreatureType](../enums/CreatureType.md) - The creature type of the unit.

### Example Usage

Here's an example of how to use the `GetCreatureType` method to determine if a unit is a specific creature type and perform different actions based on the result:

```typescript
const OnUnitDeath: unit_event_on_unit_death = (event: number, unit: Unit, attacker: Unit) => {
    const creatureType = unit.GetCreatureType();

    switch (creatureType) {
        case CreatureType.CREATURE_TYPE_BEAST:
            // Perform actions specific to beasts
            attacker.SendBroadcastMessage("You have slain a mighty beast!");
            attacker.CastSpell(attacker, 12345, true); // Cast a spell as a reward
            break;
        case CreatureType.CREATURE_TYPE_DEMON:
            // Perform actions specific to demons
            attacker.SendBroadcastMessage("You have vanquished a demonic foe!");
            attacker.AddItem(6789, 1); // Add a special item to the attacker's inventory
            break;
        case CreatureType.CREATURE_TYPE_HUMANOID:
            // Perform actions specific to humanoids
            attacker.SendBroadcastMessage("You have defeated a formidable humanoid opponent!");
            attacker.ModifyMoney(100); // Reward the attacker with gold
            break;
        default:
            // Perform actions for other creature types or default behavior
            attacker.SendBroadcastMessage("You have emerged victorious against your foe!");
            break;
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_UNIT_DEATH, (...args) => OnUnitDeath(...args));
```

In this example, the `GetCreatureType` method is used within the `UNIT_EVENT_ON_UNIT_DEATH` event to determine the creature type of the unit that was killed. Based on the creature type, different actions are performed using a switch statement.

- If the unit is a beast (`CREATURE_TYPE_BEAST`), the attacker receives a specific broadcast message and a spell is cast on them as a reward.
- If the unit is a demon (`CREATURE_TYPE_DEMON`), the attacker receives a different broadcast message and a special item is added to their inventory.
- If the unit is a humanoid (`CREATURE_TYPE_HUMANOID`), the attacker receives another broadcast message and is rewarded with gold using the `ModifyMoney` method.
- For any other creature type, a default broadcast message is sent to the attacker.

This example demonstrates how the `GetCreatureType` method can be used to create dynamic and specialized behavior based on the creature type of the unit.

## GetCritterGUID
Retrieves the GUID (Globally Unique Identifier) of the critter that the unit is currently controlling or has summoned.

### Parameters
This method does not take any parameters.

### Returns
* number - The GUID of the critter. If the unit does not have a critter, it returns 0.

### Example Usage
This script demonstrates how to retrieve the critter GUID and use it to perform actions on the critter, such as setting its position and orientation.

```typescript
const SUMMON_CRITTER_SPELL_ID = 123456;

const OnPlayerCastSpell: player_event_on_cast_spell = (event: number, player: Player, spell: number, skipCheck?: boolean) => {
    if (spell === SUMMON_CRITTER_SPELL_ID) {
        const critterGUID = player.GetCritterGUID();

        if (critterGUID !== 0) {
            const critter = player.GetMap().GetWorldObject(critterGUID);

            if (critter && critter.IsCreature()) {
                const critterCreature = critter.ToCreature();

                // Set the critter's position and orientation to match the player
                const playerPosition = player.GetPosition();
                const playerOrientation = player.GetOrientation();
                critterCreature.Relocate(playerPosition.x, playerPosition.y, playerPosition.z, playerOrientation);

                // Make the critter perform an emote
                critterCreature.PerformEmote(10); // Emote ID 10 represents a happy emote

                // Set the critter's follow target to the player
                critterCreature.SetFollowTarget(player.GetGUID());

                player.SendBroadcastMessage("Your critter is now following you!");
            } else {
                player.SendBroadcastMessage("Failed to retrieve the critter.");
            }
        } else {
            player.SendBroadcastMessage("You do not have a critter summoned.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => OnPlayerCastSpell(...args));
```

In this example, when a player casts a specific spell (identified by `SUMMON_CRITTER_SPELL_ID`), the script retrieves the critter GUID using `GetCritterGUID()`. If a critter is found, it performs the following actions:

1. Retrieves the critter as a WorldObject using `GetMap().GetWorldObject(critterGUID)`.
2. Checks if the WorldObject is a Creature using `IsCreature()` and converts it to a Creature using `ToCreature()`.
3. Sets the critter's position and orientation to match the player's using `Relocate()`.
4. Makes the critter perform a happy emote using `PerformEmote()`.
5. Sets the critter's follow target to the player using `SetFollowTarget()`.
6. Sends a broadcast message to the player indicating that the critter is now following them.

If the critter is not found or if the player does not have a critter summoned, appropriate messages are sent to the player.

This example showcases how to use `GetCritterGUID()` to interact with the critter and perform various actions based on the retrieved GUID.

## GetCurrentSpell
Returns the currently casted spell of the specified type. This can be useful for determining if the unit is currently casting a spell, and if so, which spell it is.

### Parameters
* spellType: [CurrentSpellTypes](../enums/CurrentSpellTypes.md) - The type of spell to retrieve.

### Returns
[Spell](./spell.md) - The currently casted spell of the specified type, or nil if no spell of that type is being casted.

### Example Usage
```typescript
const SPELL_FIREBALL = 133;
const SPELL_FROSTBOLT = 116;

const onUnitSpellCast: unit_event_on_spell_cast = (event: number, unit: Unit, spell: Spell): void => {
    const currentSpell = unit.GetCurrentSpell(CurrentSpellTypes.CURRENT_GENERIC_SPELL);

    if (currentSpell) {
        const spellId = currentSpell.GetEntry();

        switch (spellId) {
            case SPELL_FIREBALL:
                unit.SendChatMessage(ChatMsg.CHAT_MSG_SAY, Language.LANG_UNIVERSAL, "I am casting Fireball!");
                break;
            case SPELL_FROSTBOLT:
                unit.SendChatMessage(ChatMsg.CHAT_MSG_SAY, Language.LANG_UNIVERSAL, "I am casting Frostbolt!");
                break;
            default:
                unit.SendChatMessage(ChatMsg.CHAT_MSG_SAY, Language.LANG_UNIVERSAL, `I am casting a generic spell with ID ${spellId}`);
                break;
        }
    } else {
        unit.SendChatMessage(ChatMsg.CHAT_MSG_SAY, Language.LANG_UNIVERSAL, "I am not casting any generic spell at the moment.");
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPELL_CAST, (...args) => onUnitSpellCast(...args));
```

In this example, we register a script for the `UNIT_EVENT_ON_SPELL_CAST` event. When a unit starts casting a spell, we retrieve the currently casted generic spell using `unit.GetCurrentSpell(CurrentSpellTypes.CURRENT_GENERIC_SPELL)`.

If a spell is being casted, we get its entry ID using `currentSpell.GetEntry()`. We then use a switch statement to check if the spell ID matches any of the specific spells we're interested in (Fireball and Frostbolt in this case). If a match is found, we make the unit say a specific message using `unit.SendChatMessage()`. If no match is found, we make the unit say a generic message that includes the spell ID.

If no generic spell is being casted, we make the unit say a message indicating that they are not casting any generic spell at the moment.

This script demonstrates how you can use `GetCurrentSpell()` to detect and respond to specific spells being casted by a unit.

## GetDisplayId
Returns the current display ID of the unit. The display ID is an identifier that determines the visual appearance of the unit, such as its model, texture, and animations.

### Returns
displayId: number - The current display ID of the unit.

### Example Usage
Here's an example of how to use the `GetDisplayId` method to check if a unit is using a specific display ID and perform actions based on the result:

```typescript
const BEAR_DISPLAY_ID = 1234;
const CAT_DISPLAY_ID = 5678;

const onUnitSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    const displayId = creature.GetDisplayId();

    switch (displayId) {
        case BEAR_DISPLAY_ID:
            // Perform actions specific to units with the bear display ID
            creature.SetScale(1.5);
            creature.SetFaction(1); // Alliance faction
            creature.SendUnitSay("Roar! I'm a mighty bear!", 0);
            break;
        case CAT_DISPLAY_ID:
            // Perform actions specific to units with the cat display ID
            creature.SetScale(0.8);
            creature.SetFaction(2); // Horde faction
            creature.SendUnitSay("Meow! I'm a stealthy cat!", 0);
            break;
        default:
            // Perform actions for units with other display IDs
            creature.SendUnitSay("I have a unique appearance!", 0);
            break;
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onUnitSpawn(...args));
```

In this example:

1. We define constants `BEAR_DISPLAY_ID` and `CAT_DISPLAY_ID` to represent specific display IDs.

2. Inside the `onUnitSpawn` event handler, we retrieve the display ID of the spawned creature using `creature.GetDisplayId()`.

3. We use a `switch` statement to perform different actions based on the display ID:
   - If the display ID matches `BEAR_DISPLAY_ID`, we set the creature's scale to 1.5, set its faction to Alliance, and make it say "Roar! I'm a mighty bear!" using `creature.SendUnitSay()`.
   - If the display ID matches `CAT_DISPLAY_ID`, we set the creature's scale to 0.8, set its faction to Horde, and make it say "Meow! I'm a stealthy cat!" using `creature.SendUnitSay()`.
   - For any other display ID, we make the creature say "I have a unique appearance!" using `creature.SendUnitSay()`.

4. Finally, we register the `onUnitSpawn` event handler for the `CREATURE_EVENT_ON_SPAWN` event using `RegisterCreatureEvent()`.

This example demonstrates how to retrieve the display ID of a unit and perform different actions based on the specific display ID. It showcases a more complex usage scenario where the display ID is used to determine the visual appearance and behavior of the unit.

## GetFaction
Returns the faction ID of the unit. The faction ID is a unique identifier for each faction in the game, and it determines the unit's alignment and relationship with other factions.

### Parameters
This method does not take any parameters.

### Returns
faction: number - The faction ID of the unit.

### Example Usage
In this example, we will create a script that checks the faction of a unit when it is attacked by a player. If the unit belongs to a specific faction, the player will receive a bonus item.

```typescript
const BONUS_ITEM_ENTRY = 12345;
const BONUS_ITEM_COUNT = 1;
const TARGET_FACTION_ID = 123;

const OnPlayerAttackUnit: player_event_on_attack = (event: number, player: Player, unitVictim: Unit) => {
    // Check if the attacked unit belongs to the desired faction
    if (unitVictim.GetFaction() === TARGET_FACTION_ID) {
        // Generate a random number between 0 and 99
        const randomNumber = Math.floor(Math.random() * 100);

        // 20% chance to receive the bonus item
        if (randomNumber < 20) {
            // Add the bonus item to the player's inventory
            const bonusItem = player.AddItem(BONUS_ITEM_ENTRY, BONUS_ITEM_COUNT);

            if (bonusItem) {
                // Send a message to the player
                player.SendBroadcastMessage(`You received a bonus item for attacking a unit of the desired faction!`);
            } else {
                // Send an error message to the player if adding the item fails
                player.SendBroadcastMessage(`Failed to add the bonus item to your inventory.`);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ATTACK, (...args) => OnPlayerAttackUnit(...args));
```

In this script:
1. We define the constants for the bonus item entry, count, and the target faction ID.
2. We register the `PLAYER_EVENT_ON_ATTACK` event to trigger the `OnPlayerAttackUnit` callback function whenever a player attacks a unit.
3. Inside the callback function, we check if the attacked unit's faction matches the desired faction ID using the `GetFaction()` method.
4. If the faction matches, we generate a random number between 0 and 99.
5. If the random number is less than 20 (representing a 20% chance), we add the bonus item to the player's inventory using the `AddItem()` method.
6. If the item is successfully added, we send a broadcast message to the player informing them about receiving the bonus item.
7. If adding the item fails (e.g., due to a full inventory), we send an error message to the player.

This script demonstrates how the `GetFaction()` method can be used to determine the faction of a unit and perform specific actions based on that information. In this case, players have a chance to receive a bonus item when attacking units of a particular faction.

## GetFriendlyUnitsInRange
Returns a table containing friendly [Unit](./unit.md)'s within the given range of the [Unit](./unit.md).

### Parameters
* range?: number - (Optional) The range to search for friendly units. If not provided, the default range is used.

### Returns
* table: number - A table containing the GUIDs of the friendly units within the specified range.

### Example Usage
This example demonstrates how to use the `GetFriendlyUnitsInRange` method to find friendly units near a player and apply a buff to them.

```typescript
const BUFF_SPELL_ID = 12345;
const BUFF_RANGE = 20;

const BuffNearbyAllies: player_event_on_login = (event: number, player: Player) => {
    // Get the friendly units within the specified range
    const friendlyUnits = player.GetFriendlyUnitsInRange(BUFF_RANGE);

    // Iterate through the friendly units
    for (const guid of friendlyUnits) {
        // Create a Unit object from the GUID
        const unit = Unit.GetUnit(player, guid);

        // Check if the unit is valid and not the player itself
        if (unit && unit.GetGUID() !== player.GetGUID()) {
            // Check if the unit already has the buff
            if (!unit.HasAura(BUFF_SPELL_ID)) {
                // Cast the buff spell on the friendly unit
                player.CastSpell(unit, BUFF_SPELL_ID, false);
            }
        }
    }

    // Send a message to the player
    player.SendBroadcastMessage(`You have buffed ${friendlyUnits.length} nearby allies!`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => BuffNearbyAllies(...args));
```

In this example:
1. We define constants for the buff spell ID (`BUFF_SPELL_ID`) and the range to search for friendly units (`BUFF_RANGE`).
2. We register a player event handler for the `PLAYER_EVENT_ON_LOGIN` event.
3. Inside the event handler, we call `GetFriendlyUnitsInRange` on the player object, passing the `BUFF_RANGE` as an argument. This returns a table containing the GUIDs of friendly units within the specified range.
4. We iterate through the table of GUIDs using a `for...of` loop.
5. For each GUID, we create a `Unit` object using `Unit.GetUnit` and passing the player and the GUID as arguments.
6. We check if the unit is valid and not the player itself by comparing the GUIDs.
7. If the unit is valid and doesn't already have the buff (checked using `HasAura`), we cast the buff spell on the unit using `player.CastSpell`.
8. Finally, we send a broadcast message to the player informing them about the number of allies they have buffed.

This example showcases how `GetFriendlyUnitsInRange` can be used to find nearby friendly units and interact with them, such as applying buffs or performing other actions.

## GetGender
Returns the gender of the unit.

### Parameters
This method does not take any parameters.

### Returns
gender: number - The gender of the unit (0 = Male, 1 = Female, 2 = None).

### Example Usage
This example demonstrates how to use the `GetGender()` method to determine the gender of a unit and apply different effects based on the gender.

```typescript
const SPELL_MALE_BUFF = 12345;
const SPELL_FEMALE_BUFF = 54321;

const OnUnitSpawn: map_event_on_creature_create = (event: number, creature: Creature) => {
    const gender = creature.GetGender();

    switch (gender) {
        case 0: // Male
            creature.CastSpell(creature, SPELL_MALE_BUFF, true);
            creature.SetDisplayId(1234); // Set male display ID
            break;
        case 1: // Female
            creature.CastSpell(creature, SPELL_FEMALE_BUFF, true);
            creature.SetDisplayId(5678); // Set female display ID
            break;
        case 2: // None
            // Handle units with no gender
            break;
    }

    // Customize additional properties based on gender
    if (gender === 0) {
        creature.SetScale(1.2); // Increase scale for males
        creature.SetUInt32Value(UnitFields.UNIT_FIELD_ATTACK_POWER, 500); // Set higher attack power for males
    } else if (gender === 1) {
        creature.SetScale(0.9); // Decrease scale for females
        creature.SetUInt32Value(UnitFields.UNIT_FIELD_ATTACK_POWER, 400); // Set lower attack power for females
    }
};

RegisterMapEvent(MapEvents.MAP_EVENT_ON_CREATURE_CREATE, (...args) => OnUnitSpawn(...args));
```

In this example, when a creature is spawned on the map, the `GetGender()` method is used to determine its gender. Based on the gender, different spells are cast on the creature, and different display IDs are set to visually differentiate between male and female creatures.

Additionally, the example demonstrates how to customize other properties based on the gender, such as setting a larger scale and higher attack power for male creatures, and a smaller scale and lower attack power for female creatures.

This example showcases how the `GetGender()` method can be used in combination with other methods and properties to create gender-specific behavior and appearance for units in the game.

## GetHealth
Returns the current health of the [Unit].

### Parameters
None

### Returns
health: number - The current health of the [Unit].

### Example Usage
This example demonstrates how to retrieve the current health of a unit and perform different actions based on the health percentage.

```typescript
const healthCheckInterval = 1000; // Check health every 1 second

const healthChecker: world_event_on_update = (event: number, diff: number) => {
    const player = GetPlayersInWorld()[0]; // Get the first player in the world
    if (!player) return;

    const target = player.GetSelection();
    if (!target) return;

    const maxHealth = target.GetMaxHealth();
    const currentHealth = target.GetHealth();
    const healthPercentage = (currentHealth / maxHealth) * 100;

    if (healthPercentage <= 20) {
        // If health is 20% or below, send a warning message to the player
        player.SendBroadcastMessage(`Warning: ${target.GetName()}'s health is critically low!`);
    } else if (healthPercentage <= 50) {
        // If health is 50% or below, send a notification to the player
        player.SendBroadcastMessage(`Notice: ${target.GetName()}'s health is below 50%.`);
    } else if (healthPercentage >= 90) {
        // If health is 90% or above, send a positive message to the player
        player.SendBroadcastMessage(`${target.GetName()} is in excellent health!`);
    }
};

RegisterWorldEvent(WorldEvents.WORLD_EVENT_ON_UPDATE, (...args) => healthChecker(...args));
```

In this example:
1. We define a `healthCheckInterval` constant to determine how often we want to check the health of a unit (in this case, every 1 second).

2. We create a `healthChecker` function that will be triggered on each world update event.

3. Inside the `healthChecker` function:
   - We retrieve the first player in the world using `GetPlayersInWorld()[0]`. If no player is found, we return.
   - We get the selected target of the player using `player.GetSelection()`. If no target is selected, we return.
   - We retrieve the maximum health and current health of the target using `target.GetMaxHealth()` and `target.GetHealth()`, respectively.
   - We calculate the health percentage using the formula: `(currentHealth / maxHealth) * 100`.
   - We check the health percentage and perform different actions based on the conditions:
     - If the health is 20% or below, we send a warning message to the player indicating that the target's health is critically low.
     - If the health is 50% or below, we send a notification to the player indicating that the target's health is below 50%.
     - If the health is 90% or above, we send a positive message to the player indicating that the target is in excellent health.

4. Finally, we register the `healthChecker` function to be triggered on each world update event using `RegisterWorldEvent(WorldEvents.WORLD_EVENT_ON_UPDATE, ...)`.

This example showcases how you can utilize the `GetHealth()` method to monitor the health of a unit and perform different actions based on the health percentage. You can customize the conditions and actions according to your specific requirements.

## GetHealthPct

Returns the current health percentage of the unit.

### Parameters

This method does not take any parameters.

### Returns

* number - The current health percentage of the unit as a value between 0 and 100.

### Example Usage

In this example, we'll create a script that notifies the player when their target's health drops below 50% and grants them a temporary damage boost.

```typescript
const TARGET_HEALTH_THRESHOLD = 50;
const DAMAGE_BOOST_AURA = 123456;
const DAMAGE_BOOST_DURATION = 10; // In seconds

const onDamage: creature_event_on_damage_taken = (event: number, creature: Creature, attacker: Unit, damage: number) => {
    if (attacker.IsPlayer()) {
        const player = attacker.ToPlayer();
        const targetHealth = creature.GetHealthPct();

        if (targetHealth < TARGET_HEALTH_THRESHOLD && !player.HasAura(DAMAGE_BOOST_AURA)) {
            player.SendBroadcastMessage(`Your target is now below ${TARGET_HEALTH_THRESHOLD}% health!`);
            player.AddAura(DAMAGE_BOOST_AURA, DAMAGE_BOOST_DURATION);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DAMAGE_TAKEN, (event: number, creature: Creature, attacker: Unit, damage: number) => {
    onDamage(event, creature, attacker, damage);
});
```

In this script:

1. We define constants for the target health threshold (50%), the damage boost aura ID, and the duration of the damage boost (10 seconds).

2. We create a function called `onDamage` that will be triggered whenever a creature takes damage.

3. Inside the `onDamage` function, we check if the attacker is a player using the `IsPlayer()` method.

4. If the attacker is a player, we retrieve the player object using the `ToPlayer()` method.

5. We get the current health percentage of the target creature using the `GetHealthPct()` method.

6. If the target's health is below the defined threshold (50%) and the player doesn't already have the damage boost aura, we proceed with the following steps:
   - Send a broadcast message to the player informing them that their target is now below the threshold.
   - Apply the damage boost aura to the player using the `AddAura()` method, specifying the aura ID and duration.

7. Finally, we register the `onDamage` function to be triggered whenever a creature takes damage using the `RegisterCreatureEvent()` function with the `CREATURE_EVENT_ON_DAMAGE_TAKEN` event.

With this script, whenever a player attacks a creature and brings its health below 50%, they will receive a notification and a temporary damage boost aura to help them finish off the target more quickly.

## GetLevel
Retrieves the current level of the Unit.

### Parameters
None

### Returns
level: number - The current level of the Unit.

### Example Usage
Here's an example of how to use the `GetLevel()` method to scale the damage dealt by a creature based on the player's level:

```typescript
const SCALING_FACTOR = 0.1;

const DamageDealt: unit_event_on_dealt_damage = (event: number, unit: Unit, damage: number, victim: Unit) => {
    if (unit.IsCreature() && victim.IsPlayer()) {
        const creatureLevel = unit.GetLevel();
        const playerLevel = victim.GetLevel();

        if (playerLevel > creatureLevel) {
            const levelDifference = playerLevel - creatureLevel;
            const scaledDamage = damage * (1 + levelDifference * SCALING_FACTOR);
            
            unit.DealDamage(victim, scaledDamage, false, DIRECT_DAMAGE, SPELL_SCHOOL_MASK_NORMAL, null, false);
            return scaledDamage;
        }
    }

    return damage;
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_DEALT_DAMAGE, (...args) => DamageDealt(...args));
```

In this example, we register a script for the `UNIT_EVENT_ON_DEALT_DAMAGE` event. When a creature deals damage to a player, we retrieve the creature's level using `unit.GetLevel()` and the player's level using `victim.GetLevel()`.

If the player's level is higher than the creature's level, we calculate the level difference and scale the damage based on a scaling factor (`SCALING_FACTOR`). The scaled damage is then dealt to the player using `unit.DealDamage()` with the appropriate parameters.

By utilizing the `GetLevel()` method, we can dynamically adjust the damage dealt by creatures based on the player's level, creating a more challenging and engaging experience for higher-level players.

Note: Make sure to replace `DIRECT_DAMAGE` and `SPELL_SCHOOL_MASK_NORMAL` with the appropriate constants based on your specific use case.

## GetMaxHealth
Returns the maximum health of the unit. This can be used to calculate the percentage of health the unit has, or to check if the unit is at full health.

### Parameters
None

### Returns
number - The maximum health of the unit.

### Example Usage
This script will check if the player is below 50% health when they enter combat. If they are, it will heal them for 50% of their max health and send them a message.

```typescript
const HEAL_PERCENT = 50;

const OnEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const playerHealth = player.GetHealth();
    const playerMaxHealth = player.GetMaxHealth();
    const healthPercent = (playerHealth / playerMaxHealth) * 100;

    if (healthPercent < 50) {
        const healAmount = Math.floor(playerMaxHealth * (HEAL_PERCENT / 100));
        player.SetHealth(playerHealth + healAmount);

        player.SendBroadcastMessage(`You were healed for ${healAmount} health.`);
        player.SendBroadcastMessage(`Your current health is now ${player.GetHealth()}/${playerMaxHealth}.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => OnEnterCombat(...args));
```

In this example, we first calculate the player's current health percentage by dividing their current health by their max health and multiplying by 100. We then check if this percentage is below 50%.

If the player's health is below 50%, we calculate the amount to heal them by multiplying their max health by the `HEAL_PERCENT` constant (which is set to 50 in this example) divided by 100. We then add this heal amount to the player's current health using `player.SetHealth()`.

Finally, we send the player two messages using `player.SendBroadcastMessage()`. The first message tells them how much they were healed for, and the second message tells them their current health and max health.

This script showcases how `GetMaxHealth()` can be used in combination with other methods like `GetHealth()` and `SetHealth()` to create more complex behaviors based on the unit's current health state.

## GetMaxPower
Returns the maximum power amount for the given power type. This can be used to determine the maximum amount of a specific power type, such as mana, rage, or energy, that a unit can have.

### Parameters
* type: number - The power type to get the maximum value for. The power types are defined in the Powers enum:
  ```typescript
  enum Powers
  {
      POWER_MANA        = 0,
      POWER_RAGE        = 1,
      POWER_FOCUS       = 2,
      POWER_ENERGY      = 3,
      POWER_HAPPINESS   = 4,
      POWER_RUNE        = 5,
      POWER_RUNIC_POWER = 6,
      MAX_POWERS        = 7,
      POWER_ALL         = 127,         // default for class?
      POWER_HEALTH      = 0xFFFFFFFE   // (-2 as signed value)
  };
  ```

### Returns
number - The maximum power amount for the specified power type.

### Example Usage
```typescript
const POWER_MANA = 0;
const POWER_RAGE = 1;
const POWER_ENERGY = 3;

const CheckUnitPower: unit_event_on_spawn = (event: number, unit: Unit) => {
    const maxMana = unit.GetMaxPower(POWER_MANA);
    const maxRage = unit.GetMaxPower(POWER_RAGE);
    const maxEnergy = unit.GetMaxPower(POWER_ENERGY);

    console.log(`Unit ${unit.GetName()} spawned with the following max power values:`);
    console.log(`Max Mana: ${maxMana}`);
    console.log(`Max Rage: ${maxRage}`);
    console.log(`Max Energy: ${maxEnergy}`);

    // Adjust the unit's power based on certain conditions
    if (unit.GetEntry() === 12345) {
        unit.SetPower(POWER_MANA, maxMana * 0.5); // Set mana to 50% of max
    } else if (unit.GetEntry() === 67890) {
        unit.SetPower(POWER_RAGE, maxRage * 0.75); // Set rage to 75% of max
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPAWN, (...args) => CheckUnitPower(...args));
```

In this example, when a unit spawns, the script retrieves the maximum power values for mana, rage, and energy using the `GetMaxPower` method. It then logs these values to the console.

Additionally, based on certain unit entry conditions (in this case, specific unit IDs), the script adjusts the unit's power levels. For example, if the unit's entry is 12345, it sets the unit's mana to 50% of its maximum value. Similarly, if the unit's entry is 67890, it sets the unit's rage to 75% of its maximum value.

This demonstrates how `GetMaxPower` can be used in conjunction with other methods like `GetEntry`, `SetPower`, and `GetName` to retrieve and manipulate a unit's power values based on specific conditions or requirements.

## GetMountId
Returns the model ID of the mount currently used by the unit.

### Parameters
None

### Returns
modelId: number - The model ID of the mount. If the unit is not mounted, it returns 0.

### Example Usage
Here's an example of how to use `GetMountId()` to check if a player is mounted on a specific mount and grant them a bonus:

```typescript
const SWIFT_WHITE_HAWKSTRIDER_MODEL_ID = 19483;
const MOUNT_SPEED_BONUS = 10;

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const mountId = player.GetMountId();

    if (mountId === SWIFT_WHITE_HAWKSTRIDER_MODEL_ID) {
        // Player is mounted on a Swift White Hawkstrider
        player.SendBroadcastMessage("You are mounted on a Swift White Hawkstrider! Granting speed bonus.");

        // Increase the player's movement speed by the bonus amount
        const currentSpeed = player.GetSpeed(UnitMoveType.MOVE_RUN);
        const newSpeed = currentSpeed + (MOUNT_SPEED_BONUS / 100);
        player.SetSpeed(UnitMoveType.MOVE_RUN, newSpeed);

        // Increase the player's mounted movement speed by the bonus amount
        const currentMountedSpeed = player.GetSpeed(UnitMoveType.MOVE_FLIGHT);
        const newMountedSpeed = currentMountedSpeed + (MOUNT_SPEED_BONUS / 100);
        player.SetSpeed(UnitMoveType.MOVE_FLIGHT, newMountedSpeed);

        player.SendBroadcastMessage(`Your movement speed has been increased by ${MOUNT_SPEED_BONUS}% while mounted on the Swift White Hawkstrider!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example:
1. We define the model ID of the Swift White Hawkstrider mount and the speed bonus percentage we want to apply.
2. When a player logs in, we use `GetMountId()` to retrieve the model ID of their current mount.
3. We check if the mount ID matches the Swift White Hawkstrider's model ID.
4. If the player is mounted on a Swift White Hawkstrider, we send them a broadcast message informing them about the speed bonus.
5. We calculate the new movement speed by adding the speed bonus to the player's current running speed using `GetSpeed()` and `SetSpeed()`.
6. We also calculate the new mounted movement speed by adding the speed bonus to the player's current flight speed.
7. Finally, we send another broadcast message to the player, informing them about the specific speed bonus they received.

This script showcases how `GetMountId()` can be used to identify a player's mount and apply specific bonuses or effects based on the mount they are using.

## GetMovementType
Returns the current movement type for the Unit. This can be used to determine how the unit is moving or if it is stationary.

### Returns
[MovementGeneratorType](../MovementGeneratorType.md): The current movement type of the unit.

### Example Usage
This example demonstrates how to use the `GetMovementType` method to determine if a creature is idle or moving. If the creature is idle, it will be commanded to move to a random point within 10 yards of its current position.

```typescript
const IDLE_MOTION_TYPE = 0;
const RANDOM_MOTION_TYPE = 1;

const HandleCreatureMovement: creature_event_on_update = (event: CreatureEvents, creature: Creature, diff: number) => {
    // Check if the creature is idle
    if (creature.GetMovementType() === IDLE_MOTION_TYPE) {
        // Generate a random point within 10 yards of the creature's current position
        const randomPoint = creature.GetNearPoint(creature, 10, Math.Random() * 2 * Math.PI);
        
        // Command the creature to move to the random point
        creature.MoveTo(randomPoint.x, randomPoint.y, randomPoint.z, RANDOM_MOTION_TYPE);
        
        // Print a debug message
        console.log(`Creature ${creature.GetName()} is idle. Moving to random point (${randomPoint.x}, ${randomPoint.y}, ${randomPoint.z}).`);
    } else {
        // Print the current movement type of the creature
        const movementType = creature.GetMovementType();
        console.log(`Creature ${creature.GetName()} is moving with movement type ${movementType}.`);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => HandleCreatureMovement(...args));
```

In this example:
1. We define constants for the `IDLE_MOTION_TYPE` and `RANDOM_MOTION_TYPE` movement types.
2. Inside the `HandleCreatureMovement` function, we check if the creature's current movement type is `IDLE_MOTION_TYPE` using the `GetMovementType` method.
3. If the creature is idle, we generate a random point within 10 yards of the creature's current position using the `GetNearPoint` method.
4. We command the creature to move to the random point using the `MoveTo` method, specifying the `RANDOM_MOTION_TYPE` as the movement type.
5. We print a debug message indicating that the creature is idle and is being moved to a random point.
6. If the creature is not idle, we retrieve the current movement type using `GetMovementType` and print a debug message indicating the creature's current movement type.

This example demonstrates how `GetMovementType` can be used to determine a unit's movement state and take appropriate actions based on that state.

## GetNativeDisplayId
Returns the native display ID of the unit. This is the original display ID that the unit was spawned with, and it remains constant throughout the unit's lifetime.

### Parameters
None

### Returns
displayId: number - The native display ID of the unit.

### Example Usage
Create a script that checks if a player has a specific item in their inventory. If they do, transform the player's appearance to match the native display ID of a random creature in the game world.

```typescript
const ITEM_ENTRY = 12345; // Replace with the desired item entry ID

const onItemUse: player_event_on_use_item = (event: number, player: Player, item: Item, gameObject: GameObject, target: Unit): void => {
    if (item.GetEntry() === ITEM_ENTRY) {
        const creatures: Unit[] = player.GetCreaturesInRange(100, -1);
        if (creatures.length > 0) {
            const randomCreature: Unit = creatures[Math.floor(Math.random() * creatures.length)];
            const nativeDisplayId: number = randomCreature.GetNativeDisplayId();

            player.SetDisplayId(nativeDisplayId);
            player.SendBroadcastMessage(`You have been transformed into a creature with display ID ${nativeDisplayId}!`);
        } else {
            player.SendBroadcastMessage("No creatures found nearby to transform into.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => onItemUse(...args));
```

In this example:
1. We define the entry ID of the item that triggers the transformation (`ITEM_ENTRY`).
2. When a player uses an item, the `onItemUse` event is triggered.
3. We check if the used item's entry ID matches the desired item entry (`ITEM_ENTRY`).
4. If it does, we retrieve all creatures within a 100-yard range of the player using `GetCreaturesInRange()`.
5. If creatures are found, we randomly select one of them.
6. We retrieve the native display ID of the selected creature using `GetNativeDisplayId()`.
7. We set the player's display ID to the native display ID of the creature using `SetDisplayId()`, effectively transforming the player's appearance.
8. We send a broadcast message to the player informing them about the transformation and the display ID they have been transformed into.
9. If no creatures are found nearby, we send a message to the player indicating that no transformation could be performed.

This script provides an interactive way for players to transform their appearance based on the native display IDs of creatures in the game world, adding an element of surprise and variety to their gameplay experience.

## GetOwner
Returns the [Unit](./unit.md) that owns this [Unit](./unit.md). If the [Unit](./unit.md) has no owner, nil is returned.

### Parameters
None

### Returns
owner: [Unit](./unit.md) or nil - The [Unit](./unit.md) that owns this [Unit](./unit.md), or nil if no owner exists.

### Example Usage
This example demonstrates how to use the `GetOwner` method to check if a unit is owned by a player and grant bonus damage if so.

```typescript
const OWNER_DAMAGE_BONUS = 0.25;

const OnDamage: unit_event_on_damage = (event: number, unit: Unit, attacker: Unit, damage: number) => {
    const owner = attacker.GetOwner();

    if (owner && owner.IsPlayer()) {
        const player = owner.ToPlayer();
        const bonusDamage = damage * OWNER_DAMAGE_BONUS;

        unit.DealDamage(attacker, bonusDamage, true);
        unit.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_RAID_BOSS_EMOTE, 0, `${player.GetName()} dealt ${bonusDamage} bonus damage!`);

        const remainingHealth = unit.GetHealthPct();
        if (remainingHealth <= 25 && !unit.HasAura(ENRAGE_AURA)) {
            unit.AddAura(ENRAGE_AURA, -1);
            unit.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_RAID_BOSS_EMOTE, 0, `${unit.GetName()} becomes enraged!`);
        }
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_DAMAGE, OnDamage);
```

In this example:
1. We define a constant `OWNER_DAMAGE_BONUS` to represent the bonus damage percentage.
2. In the `OnDamage` event handler, we retrieve the attacker's owner using `GetOwner()`.
3. We check if the owner exists and is a player using `IsPlayer()`.
4. If the attacker is owned by a player, we calculate the bonus damage based on the original damage and the `OWNER_DAMAGE_BONUS`.
5. We deal the bonus damage to the unit using `DealDamage()` and send a chat message to the player informing them of the bonus damage dealt.
6. We check the unit's remaining health percentage using `GetHealthPct()`. If it's below 25% and the unit doesn't have the enrage aura, we add the aura using `AddAura()` and send a chat message indicating that the unit becomes enraged.

This example showcases how `GetOwner()` can be used to determine if a unit is owned by a player and apply specific logic based on that information, such as granting bonus damage and triggering special effects when certain conditions are met.

## GetOwnerGUID
Returns the GUID (Globally Unique Identifier) of the unit's owner. This method is useful for determining the owner of a pet, totem, or other controlled unit.

### Parameters
This method does not take any parameters.

### Returns
- `number` - The GUID of the unit's owner. If the unit has no owner, it returns 0.

### Example Usage
Here's an example of how to use `GetOwnerGUID()` to check if a unit is a player's pet and grant the player a buff if their pet dies:

```typescript
const BUFF_ENRAGE_ENTRY = 12880;
const BUFF_ENRAGE_DURATION = 30000;

const OnPetDeath: creature_event_on_died = (event: number, creature: Creature, killer: Unit) => {
    const ownerGUID = creature.GetOwnerGUID();

    if (ownerGUID !== 0) {
        const owner = creature.GetMap().GetPlayer(ownerGUID);

        if (owner) {
            // Check if the pet belonged to a player
            const isPlayerPet = owner.IsPlayer();

            if (isPlayerPet) {
                // Apply the enrage buff to the player
                owner.AddAura(BUFF_ENRAGE_ENTRY, BUFF_ENRAGE_DURATION);

                // Send a message to the player
                owner.SendBroadcastMessage(`Your pet has died! You have been granted Enrage for ${BUFF_ENRAGE_DURATION / 1000} seconds.`);
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DIED, (...args) => OnPetDeath(...args));
```

In this example:
1. When a creature dies, the `OnPetDeath` event handler is triggered.
2. It retrieves the owner's GUID using `GetOwnerGUID()`.
3. If the owner's GUID is not 0 (meaning the creature has an owner), it attempts to get the owner as a player using `GetMap().GetPlayer(ownerGUID)`.
4. If the owner is found and is a player (checked using `IsPlayer()`), it means the dead creature was a player's pet.
5. The script then applies the "Enrage" buff to the player using `AddAura()` with the specified entry and duration.
6. Finally, it sends a message to the player informing them about their pet's death and the granted buff.

This example demonstrates how `GetOwnerGUID()` can be used in conjunction with other methods to implement custom behavior based on the ownership of a unit.

## GetPetGUID
Returns the GUID of the pet belonging to the unit. This method is useful for identifying and interacting with a unit's pet, such as checking if the pet exists, retrieving pet stats, or performing actions on the pet.

### Parameters
This method does not take any parameters.

### Returns
- number: The GUID of the unit's pet. If the unit does not have a pet, the method will return 0.

### Example Usage
In this example, we'll create a script that checks if a player has a pet and if the pet's health is below 50%. If the condition is met, the script will heal the pet for a certain amount.

```typescript
const HEAL_AMOUNT = 1000;

const CheckPetHealth: player_event_on_update = (event: number, player: Player, diff: number) => {
    const petGUID = player.GetPetGUID();

    if (petGUID !== 0) {
        const pet = player.GetMap().GetPetOrVehicle(petGUID);

        if (pet) {
            const petHealthPct = pet.GetHealthPct();

            if (petHealthPct < 50) {
                pet.SetHealth(pet.GetHealth() + HEAL_AMOUNT);
                player.SendBroadcastMessage(`Your pet's health was below 50%. It has been healed for ${HEAL_AMOUNT} health.`);
            }
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckPetHealth(...args));
```

In this script:
1. We define a constant `HEAL_AMOUNT` to specify the amount of health to heal the pet.
2. Inside the `CheckPetHealth` function, we first retrieve the player's pet GUID using `player.GetPetGUID()`.
3. We check if the pet GUID is not 0, indicating that the player has a pet.
4. If the player has a pet, we use `player.GetMap().GetPetOrVehicle(petGUID)` to retrieve the actual pet object.
5. We calculate the pet's current health percentage using `pet.GetHealthPct()`.
6. If the pet's health percentage is below 50%, we heal the pet using `pet.SetHealth(pet.GetHealth() + HEAL_AMOUNT)`.
7. Finally, we send a broadcast message to the player informing them that their pet has been healed.

This script demonstrates how to use the `GetPetGUID()` method to identify a player's pet and perform actions based on the pet's state. You can customize the script further by modifying the health threshold, heal amount, or adding additional conditions or actions as needed.

## GetPower
Returns the current power amount for the specified power type of the unit.

### Parameters
* type: number - The power type to retrieve the value for. Refer to the Powers enum for possible values.

### Returns
number - The current power amount for the specified power type.

### Example Usage
Here's an example of how to use the `GetPower` method to retrieve the current mana and energy of a unit and perform actions based on the values:

```typescript
const POWER_MANA = 0;
const POWER_ENERGY = 3;

const OnUnitSpellCast: unit_event_on_spell_cast = (event: number, unit: Unit, spell: number): void => {
    const manaPower = unit.GetPower(POWER_MANA);
    const energyPower = unit.GetPower(POWER_ENERGY);

    // Check if the unit has enough mana to cast the spell
    if (manaPower < 100) {
        unit.SendUnitWhisper("Not enough mana to cast the spell!", 0);
        unit.InterruptSpell();
        return;
    }

    // Check if the unit is a druid and has enough energy for a special ability
    if (unit.GetClass() === Classes.CLASS_DRUID && energyPower < 50) {
        unit.SendUnitWhisper("Not enough energy for the druid ability!", 0);
        unit.InterruptSpell();
        return;
    }

    // Consume 10% of the unit's mana on spell cast
    const manaConsumption = manaPower * 0.1;
    unit.SetPower(POWER_MANA, manaPower - manaConsumption);

    unit.SendUnitWhisper(`Spell cast successfully! Mana consumed: ${manaConsumption}`, 0);
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPELL_CAST, (...args) => OnUnitSpellCast(...args));
```

In this example:
1. We define constants for the `POWER_MANA` and `POWER_ENERGY` power types based on the Powers enum.
2. Inside the `OnUnitSpellCast` event handler, we retrieve the current mana and energy power values of the unit using `GetPower`.
3. We check if the unit has enough mana to cast the spell. If not, we interrupt the spell and send a whisper message to the unit.
4. If the unit is a druid (checked using `GetClass`), we additionally check if it has enough energy for a special ability. If not, we interrupt the spell and send a whisper message.
5. If the checks pass, we consume 10% of the unit's mana by calculating the mana consumption and updating the mana power using `SetPower`.
6. Finally, we send a whisper message to the unit indicating that the spell was cast successfully and the amount of mana consumed.

This example demonstrates how to use `GetPower` to retrieve different power values of a unit and make decisions based on those values, such as interrupting spells or performing class-specific actions.

## GetPowerPct

Returns the current power percentage for the specified power type of the unit.

### Parameters
* type: number - The power type to query the percentage for. Refer to the Powers enum for valid power types.

### Returns
* number - The power percentage as a value between 0 and 100.

### Example Usage
Monitor a player's mana percentage and trigger an event when it drops below a certain threshold:

```typescript
const POWER_TYPE_MANA = 0;
const LOW_MANA_THRESHOLD = 20;

const OnPlayerManaTick: player_event_on_update = (event: number, player: Player, diff: number) => {
    const manaPct = player.GetPowerPct(POWER_TYPE_MANA);

    if (manaPct <= LOW_MANA_THRESHOLD) {
        // Trigger a low mana warning for the player
        player.SendBroadcastMessage(`Warning: Your mana is low (${manaPct}%)!`);

        // Regenerate a small amount of mana
        const maxMana = player.GetMaxPower(POWER_TYPE_MANA);
        const regenAmount = maxMana * 0.05; // Regenerate 5% of max mana
        player.SetPower(POWER_TYPE_MANA, player.GetPower(POWER_TYPE_MANA) + regenAmount);

        // Apply a mana regeneration buff to the player
        const MANA_REGEN_BUFF_ID = 12345;
        player.AddAura(MANA_REGEN_BUFF_ID, player);

        // Notify the player about the applied buff
        player.SendBroadcastMessage("A mana regeneration buff has been applied to help you recover.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => OnPlayerManaTick(...args));
```

In this example, we register a handler for the `PLAYER_EVENT_ON_UPDATE` event to monitor the player's mana percentage. Inside the event handler, we perform the following steps:

1. Get the player's current mana percentage using `GetPowerPct(POWER_TYPE_MANA)`.
2. Check if the mana percentage is below the defined threshold (`LOW_MANA_THRESHOLD`).
3. If the mana is low, send a warning message to the player using `SendBroadcastMessage()`.
4. Calculate a small amount of mana to regenerate based on a percentage of the player's maximum mana.
5. Set the player's mana to the current value plus the regeneration amount using `SetPower()`.
6. Apply a mana regeneration buff to the player using `AddAura()` with a predefined buff ID.
7. Notify the player about the applied buff using `SendBroadcastMessage()`.

This script demonstrates how to utilize the `GetPowerPct()` method to monitor a player's mana level and take actions based on the percentage value. It showcases sending messages to the player, regenerating mana, applying buffs, and interacting with the player's powers.

## GetPowerType
Returns the current power type of the unit as an enum value.

### Parameters
None

### Returns
[Powers](../Globals/Powers.md) - The current power type of the unit.

### Example Usage
Get the power type of the unit and modify the behavior based on the power type.
```typescript
function ApplyCustomPowerRegen(unit: Unit): void {
    const powerType = unit.GetPowerType();

    switch (powerType) {
        case Powers.POWER_MANA:
            // Apply custom mana regeneration
            const manaRegen = unit.GetStat(UnitFields.STAT_SPIRIT) * 0.05;
            unit.SetFloatValue(UnitFields.UNIT_FIELD_POWER_REGEN_FLAT_MODIFIER, manaRegen);
            break;
        case Powers.POWER_RAGE:
            // Apply custom rage decay
            const rageDecay = 1.5;
            unit.SetFloatValue(UnitFields.UNIT_FIELD_POWER_REGEN_INTERRUPTED_FLAT_MODIFIER, -rageDecay);
            break;
        case Powers.POWER_ENERGY:
            // Apply custom energy regeneration
            const energyRegen = 10;
            unit.SetFloatValue(UnitFields.UNIT_FIELD_POWER_REGEN_FLAT_MODIFIER, energyRegen);
            break;
        // Add more cases for other power types as needed
        default:
            break;
    }
}

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPAWN, (unit: Unit) => {
    ApplyCustomPowerRegen(unit);
});
```
In this example, we define a function called `ApplyCustomPowerRegen` that takes a `Unit` as a parameter. Inside the function, we call `GetPowerType()` to get the current power type of the unit.

Based on the power type, we apply different modifications to the unit's power regeneration or decay. For example, if the unit's power type is `POWER_MANA`, we calculate a custom mana regeneration value based on the unit's spirit stat and set it using `SetFloatValue()`. Similarly, for `POWER_RAGE`, we apply a custom rage decay value, and for `POWER_ENERGY`, we set a custom energy regeneration value.

We then register the `ApplyCustomPowerRegen` function to be called whenever a unit spawns using the `UNIT_EVENT_ON_SPAWN` event. This ensures that the custom power regeneration or decay is applied to units as soon as they spawn in the world.

This example demonstrates how you can use `GetPowerType()` to retrieve the power type of a unit and perform different actions based on the power type. You can extend this example to handle more power types and apply custom modifications as needed for your specific gameplay mechanics.

## GetRace

Returns the race ID of the [Unit](./unit.md). Race IDs are defined in the `ChrRaces.dbc` file and can be used to determine the race of a player, creature, or other unit.

### Parameters

This method does not take any parameters.

### Returns

* number - The race ID of the unit.

### Example Usage

Here's an example of how to use the `GetRace` method to adjust the reward of a quest based on the player's race:

```typescript
const QUEST_ENTRY = 1234;
const HUMAN_RACE_ID = 1;
const ORC_RACE_ID = 2;

const OnQuestComplete: player_event_on_quest_complete = (event: number, player: Player, quest: number) => {
    if (quest === QUEST_ENTRY) {
        const raceId = player.GetRace();

        if (raceId === HUMAN_RACE_ID) {
            // Reward for human players
            player.AddItem(1234, 1); // Give an extra item to human players
            player.ModifyMoney(100); // Give additional gold to human players
        } else if (raceId === ORC_RACE_ID) {
            // Reward for orc players
            player.AddItem(5678, 1); // Give a different item to orc players
            player.ModifyMoney(50); // Give less gold to orc players
        } else {
            // Default reward for other races
            player.ModifyMoney(75); // Give the default amount of gold
        }

        player.SendBroadcastMessage("You have completed the quest and received your reward!");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example, when a player completes a specific quest (with ID `1234`), the script checks the player's race using the `GetRace` method. Based on the race ID, it determines the appropriate reward for the player. Human players receive an extra item and additional gold, while orc players receive a different item and less gold. Players of other races receive the default reward of a certain amount of gold. Finally, a broadcast message is sent to the player to notify them of the quest completion and the reward received.

This example demonstrates how the `GetRace` method can be used to customize quest rewards based on the player's race, providing a more tailored experience for different races in the game.

## GetRaceAsString
Returns the name of the unit's race in the specified locale or the default locale if not provided.

### Parameters
* locale?: [LocaleConstant](./constants.md#localeconstant) - (Optional) The locale in which to return the race name. If not provided, the default locale will be used.

### Returns
* string - The name of the unit's race in the specified or default locale, or nil if the race is not found.

### Example Usage
```typescript
// Get the race name of a unit in different locales
const unit = player.GetSelection();
if (unit) {
    const defaultRaceName = unit.GetRaceAsString();
    const chineseRaceName = unit.GetRaceAsString(LocaleConstant.LOCALE_zhCN);
    const frenchRaceName = unit.GetRaceAsString(LocaleConstant.LOCALE_frFR);

    player.SendBroadcastMessage(`Default race name: ${defaultRaceName}`);
    player.SendBroadcastMessage(`Chinese race name: ${chineseRaceName}`);
    player.SendBroadcastMessage(`French race name: ${frenchRaceName}`);

    // Check if the race name exists in a specific locale
    const locale = LocaleConstant.LOCALE_esES;
    const raceNameInLocale = unit.GetRaceAsString(locale);
    if (raceNameInLocale) {
        player.SendBroadcastMessage(`Race name in ${LocaleConstant[locale]}: ${raceNameInLocale}`);
    } else {
        player.SendBroadcastMessage(`Race name not found in ${LocaleConstant[locale]}`);
    }
} else {
    player.SendBroadcastMessage("No unit selected.");
}
```

In this example, we retrieve the selected unit using `player.GetSelection()`. If a unit is selected, we demonstrate retrieving the race name in different locales:

1. We get the race name in the default locale using `unit.GetRaceAsString()` without specifying a locale.
2. We get the race name in Chinese locale using `unit.GetRaceAsString(LocaleConstant.LOCALE_zhCN)`.
3. We get the race name in French locale using `unit.GetRaceAsString(LocaleConstant.LOCALE_frFR)`.

We then send the retrieved race names to the player using `player.SendBroadcastMessage()`.

Additionally, we check if the race name exists in a specific locale (Spanish in this example) using `unit.GetRaceAsString(LocaleConstant.LOCALE_esES)`. If the race name is found, we send it to the player. Otherwise, we send a message indicating that the race name was not found in that locale.

This example demonstrates how to retrieve the race name of a unit in different locales and how to handle cases where the race name may not be available in a specific locale.

## GetRaceMask
Returns the race mask of the unit. The race mask is a bitmask that represents the races that the unit belongs to. Each bit in the mask corresponds to a specific race. This can be useful for checking if a unit belongs to a certain race or races.

### Parameters
This method does not take any parameters.

### Returns
- number: The race mask of the unit.

### Example Usage
Here's an example of how to use the `GetRaceMask` method to check if a unit belongs to a specific race:

```typescript
const RACE_MASK_ORC = 0x2;
const RACE_MASK_TROLL = 0x8;

const OnUnitDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    const raceMask = killer.GetRaceMask();

    if ((raceMask & RACE_MASK_ORC) !== 0) {
        // The killer belongs to the Orc race
        creature.SendUnitSay("You filthy Orc! You will pay for this!", 0);
    } else if ((raceMask & RACE_MASK_TROLL) !== 0) {
        // The killer belongs to the Troll race
        creature.SendUnitSay("Troll scum! My death will be avenged!", 0);
    } else {
        // The killer belongs to a different race
        creature.SendUnitSay("You may have defeated me, but my spirit will live on!", 0);
    }

    // Additional logic for handling the creature's death
    // ...
};

RegisterCreatureEvent(12345, CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => OnUnitDeath(...args));
```

In this example, the `OnUnitDeath` event handler is registered for a specific creature with entry ID 12345. When the creature dies, the event handler is triggered, and it checks the race of the killer unit using the `GetRaceMask` method.

The race mask is compared with predefined constants (`RACE_MASK_ORC` and `RACE_MASK_TROLL`) using bitwise operations to determine if the killer belongs to the Orc or Troll race. Based on the race, the creature sends a different message using the `SendUnitSay` method.

This example demonstrates how the `GetRaceMask` method can be used in combination with other methods and game events to create dynamic behavior based on the race of the units involved.

Note: The actual values of the race mask constants (`RACE_MASK_ORC` and `RACE_MASK_TROLL`) may vary depending on the specific game version and configuration. Make sure to use the correct values for your server setup.

## GetSpeed
Returns the [Unit]'s speed of the given [UnitMoveType].

### Parameters
* type: [UnitMoveType](./unitmovetype.md) - The type of movement speed to retrieve.

### Returns
* number - The speed of the [Unit] for the specified [UnitMoveType].

### Example Usage
This example adjusts a player's speed based on their level and the type of movement they are performing.

```typescript
const PLAYER_LEVEL_THRESHOLD = 50;
const SPEED_MULTIPLIER_BELOW_THRESHOLD = 1.2;
const SPEED_MULTIPLIER_ABOVE_THRESHOLD = 1.5;

const AdjustPlayerSpeed: player_event_on_update_interval = (event: number, player: Player, diff: number) => {
    const playerLevel = player.GetLevel();
    const speedMultiplier = playerLevel < PLAYER_LEVEL_THRESHOLD ? SPEED_MULTIPLIER_BELOW_THRESHOLD : SPEED_MULTIPLIER_ABOVE_THRESHOLD;

    const currentWalkSpeed = player.GetSpeed(UnitMoveType.MOVE_WALK);
    const currentRunSpeed = player.GetSpeed(UnitMoveType.MOVE_RUN);
    const currentSwimSpeed = player.GetSpeed(UnitMoveType.MOVE_SWIM);
    const currentFlightSpeed = player.GetSpeed(UnitMoveType.MOVE_FLIGHT);

    player.SetSpeed(UnitMoveType.MOVE_WALK, currentWalkSpeed * speedMultiplier);
    player.SetSpeed(UnitMoveType.MOVE_RUN, currentRunSpeed * speedMultiplier);
    player.SetSpeed(UnitMoveType.MOVE_SWIM, currentSwimSpeed * speedMultiplier);
    player.SetSpeed(UnitMoveType.MOVE_FLIGHT, currentFlightSpeed * speedMultiplier);

    player.SendNotification(`Your speed has been adjusted based on your level. Current multiplier: ${speedMultiplier}`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_INTERVAL, (...args) => AdjustPlayerSpeed(...args));
```

In this example:
1. We define constants for the player level threshold and the speed multipliers for players below and above the threshold.
2. We register a player event that triggers at a specified interval using `PLAYER_EVENT_ON_UPDATE_INTERVAL`.
3. Inside the event handler, we retrieve the player's current level using `player.GetLevel()`.
4. We determine the speed multiplier based on the player's level by comparing it with the defined threshold.
5. We retrieve the player's current speeds for different movement types using `player.GetSpeed()` with the respective [UnitMoveType](./unitmovetype.md) values.
6. We adjust the player's speeds by multiplying the current speeds with the determined speed multiplier using `player.SetSpeed()`.
7. Finally, we send a notification to the player informing them about the speed adjustment and the current multiplier.

This example demonstrates how to retrieve and modify a player's movement speeds based on their level, providing a more dynamic gameplay experience.

## GetStandState
Returns the current stand state of the unit. The stand state represents the unit's posture or stance, such as standing, sitting, or lying down.

### Parameters
This method does not take any parameters.

### Returns
state: number - The current stand state of the unit, represented as a numeric value.

The possible stand state values are:
- 0: UNIT_STAND_STATE_STAND (Standing)
- 1: UNIT_STAND_STATE_SIT (Sitting)
- 2: UNIT_STAND_STATE_SIT_CHAIR (Sitting in a chair)
- 3: UNIT_STAND_STATE_SLEEP (Sleeping)
- 4: UNIT_STAND_STATE_SIT_LOW_CHAIR (Sitting in a low chair)
- 5: UNIT_STAND_STATE_SIT_MEDIUM_CHAIR (Sitting in a medium chair)
- 6: UNIT_STAND_STATE_SIT_HIGH_CHAIR (Sitting in a high chair)
- 7: UNIT_STAND_STATE_DEAD (Dead)
- 8: UNIT_STAND_STATE_KNEEL (Kneeling)

### Example Usage
Create a script that checks the stand state of the player's target and performs different actions based on the state.

```typescript
const onPlayerTargetUnit: player_event_on_target = (event: number, player: Player, target: Unit) => {
    const standState = target.GetStandState();

    switch (standState) {
        case 0: // Standing
            player.SendBroadcastMessage(`Your target, ${target.GetName()}, is standing.`);
            break;
        case 1: // Sitting
            player.SendBroadcastMessage(`Your target, ${target.GetName()}, is sitting.`);
            player.CastSpell(target, 12345, true); // Cast a spell on the sitting target
            break;
        case 3: // Sleeping
            player.SendBroadcastMessage(`Your target, ${target.GetName()}, is sleeping. Shhh!`);
            player.AddAura(23456, target); // Add a sleep debuff to the sleeping target
            break;
        case 7: // Dead
            player.SendBroadcastMessage(`Your target, ${target.GetName()}, is dead.`);
            player.CastSpell(target, 34567, true); // Cast a resurrection spell on the dead target
            break;
        default:
            player.SendBroadcastMessage(`Your target, ${target.GetName()}, is in an unusual state.`);
            break;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_TARGET, (...args) => onPlayerTargetUnit(...args));
```

In this example, when a player targets a unit, the script checks the stand state of the target using `GetStandState()`. Depending on the stand state, different actions are taken:
- If the target is standing, a message is sent to the player indicating the target's state.
- If the target is sitting, a message is sent, and a spell with ID 12345 is cast on the target.
- If the target is sleeping, a message is sent, and a sleep debuff with ID 23456 is added to the target.
- If the target is dead, a message is sent, and a resurrection spell with ID 34567 is cast on the target.
- For any other stand state, a default message is sent to the player.

This script demonstrates how `GetStandState()` can be used to determine the current posture of a unit and perform specific actions based on that state.

## GetStat
Retrieves the value of a specific stat for the unit.

### Parameters
* statType: number - The ID of the stat to retrieve. Possible values:
  * 0 - UNIT_MOD_STAT_STRENGTH
  * 1 - UNIT_MOD_STAT_AGILITY
  * 2 - UNIT_MOD_STAT_STAMINA
  * 3 - UNIT_MOD_STAT_INTELLECT
  * 4 - UNIT_MOD_STAT_SPIRIT

### Returns
* number - The current value of the specified stat for the unit.

### Example Usage
```typescript
const UNIT_MOD_STAT_STRENGTH = 0;
const UNIT_MOD_STAT_AGILITY = 1;
const UNIT_MOD_STAT_STAMINA = 2;
const UNIT_MOD_STAT_INTELLECT = 3;
const UNIT_MOD_STAT_SPIRIT = 4;

const ApplyCustomStatModifier = (unit: Unit) => {
    const className = unit.GetClass();
    let statModifier = 1;

    switch (className) {
        case 1: // Warrior
            statModifier = unit.GetStat(UNIT_MOD_STAT_STRENGTH) * 0.05;
            break;
        case 2: // Paladin
            statModifier = (unit.GetStat(UNIT_MOD_STAT_STRENGTH) + unit.GetStat(UNIT_MOD_STAT_INTELLECT)) * 0.025;
            break;
        case 3: // Hunter
            statModifier = unit.GetStat(UNIT_MOD_STAT_AGILITY) * 0.05;
            break;
        case 4: // Rogue
            statModifier = unit.GetStat(UNIT_MOD_STAT_AGILITY) * 0.05;
            break;
        case 5: // Priest
            statModifier = unit.GetStat(UNIT_MOD_STAT_INTELLECT) * 0.05;
            break;
        // Add other class cases as needed
    }

    unit.SetModifierValue(UnitMods.UNIT_MOD_DAMAGE_MAINHAND, BASE_VALUE, unit.GetModifierValue(UnitMods.UNIT_MOD_DAMAGE_MAINHAND, BASE_VALUE) * statModifier);
    unit.SetModifierValue(UnitMods.UNIT_MOD_DAMAGE_OFFHAND, BASE_VALUE, unit.GetModifierValue(UnitMods.UNIT_MOD_DAMAGE_OFFHAND, BASE_VALUE) * statModifier);
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPAWN, ApplyCustomStatModifier);
```

In this example, we define a function `ApplyCustomStatModifier` that takes a `Unit` object as a parameter. The function retrieves the class of the unit using `GetClass()` and then applies a custom stat modifier based on the class.

The stat modifier is calculated by multiplying a specific stat value (strength for warriors and paladins, agility for hunters and rogues, intellect for priests) by a percentage factor. The `GetStat()` method is used to retrieve the value of the desired stat based on the provided stat type constants.

Finally, the calculated stat modifier is applied to the unit's main hand and off-hand damage values using `SetModifierValue()`.

The `RegisterUnitEvent` function is used to register the `ApplyCustomStatModifier` function to be called whenever a unit spawns (using the `UNIT_EVENT_ON_SPAWN` event).

This example demonstrates how to use `GetStat()` to retrieve specific stat values for a unit and apply custom modifications based on those values.

## GetUnfriendlyUnitsInRange
Returns a table containing unfriendly [Unit](./unit.md)'s within the given range of the [Unit](./unit.md).

### Parameters
* range: number - (Optional) The range to search for unfriendly units. If not provided, the default range is the [Unit](./unit.md)'s current combat reach.

### Returns
* table: table - A table containing the unfriendly [Unit](./unit.md)'s found within the specified range.

### Example Usage
This example demonstrates how to use the `GetUnfriendlyUnitsInRange` method to find nearby enemy units and cast a spell on them.

```typescript
const SPELL_ARCANE_EXPLOSION = 1449;
const ARCANE_EXPLOSION_RANGE = 10;

const CastArcaneExplosion: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const unfriendlyUnits = player.GetUnfriendlyUnitsInRange(ARCANE_EXPLOSION_RANGE);

    if (unfriendlyUnits.length >= 3) {
        player.CastSpell(player, SPELL_ARCANE_EXPLOSION, true);
        player.SendBroadcastMessage("Casting Arcane Explosion on nearby enemies!");

        for (const unit of unfriendlyUnits) {
            const unitName = unit.GetName();
            const distance = player.GetDistance(unit);
            player.SendBroadcastMessage(`Found enemy: ${unitName} at distance: ${distance} yards`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => CastArcaneExplosion(...args));
```

In this example:
1. We define constants for the Arcane Explosion spell ID and its range.
2. Inside the `CastArcaneExplosion` function, we use `GetUnfriendlyUnitsInRange` to find all unfriendly units within the specified range.
3. If there are 3 or more unfriendly units nearby, we cast Arcane Explosion on the player, which will damage all nearby enemies.
4. We send a broadcast message to the player indicating that Arcane Explosion is being cast.
5. We iterate over the unfriendly units and send a broadcast message to the player with the name and distance of each enemy unit.
6. Finally, we register the `CastArcaneExplosion` function to be called whenever the player enters combat using the `PLAYER_EVENT_ON_ENTER_COMBAT` event.

This example showcases how `GetUnfriendlyUnitsInRange` can be used to dynamically respond to the presence of multiple enemy units and take appropriate actions, such as casting area-of-effect spells or notifying the player about nearby threats.

## GetVehicle
Returns the vehicle that the unit is currently controlling.

### Parameters
None

### Returns
[Vehicle](./vehicle.md) or `undefined` - The vehicle the unit is currently controlling or `undefined` if the unit is not controlling a vehicle.

### Example Usage
This example demonstrates how to check if a player is currently controlling a vehicle and if so, get the vehicle's entry ID.

```typescript
const OnPlayerEnterVehicle: player_event_on_enter_vehicle = (event: number, player: Player, vehicle: Vehicle) => {
    const controlledVehicle = player.GetVehicle();

    if (controlledVehicle) {
        const vehicleEntry = controlledVehicle.GetEntry();
        switch (vehicleEntry) {
            case 30234: // Wintergrasp Siege Engine
                SendSystemMessage(player, "You are now controlling a Wintergrasp Siege Engine!");
                break;
            case 33060: // Salvaged Demolisher
                SendSystemMessage(player, "You are now controlling a Salvaged Demolisher!");
                break;
            case 33109: // Salvaged Siege Engine
                SendSystemMessage(player, "You are now controlling a Salvaged Siege Engine!");
                break;
            default:
                SendSystemMessage(player, `You are now controlling a vehicle with entry ID: ${vehicleEntry}`);
                break;
        }
    } else {
        SendSystemMessage(player, "You are not controlling any vehicle.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_VEHICLE, (...args) => OnPlayerEnterVehicle(...args));
```

In this example, when a player enters a vehicle, the script checks if the player is controlling a vehicle using the `GetVehicle()` method. If the player is controlling a vehicle, the script retrieves the vehicle's entry ID using the `GetEntry()` method of the returned [Vehicle](./vehicle.md) object.

Based on the vehicle's entry ID, the script sends a specific message to the player informing them about the type of vehicle they are controlling. If the vehicle's entry ID doesn't match any of the specified cases, a generic message is sent with the vehicle's entry ID.

If the player is not controlling any vehicle, the script sends a message indicating that the player is not controlling any vehicle.

This example showcases how to utilize the `GetVehicle()` method to determine if a unit is controlling a vehicle and retrieve information about the controlled vehicle for further processing or interaction within the script.

## GetVehicleKit
Returns the [Vehicle](./vehicle.md) methods associated with the [Unit]. This allows you to access and manipulate the vehicle's properties and behavior.

### Parameters
None

### Returns
[Vehicle](./vehicle.md) - The vehicle methods associated with the unit.

### Example Usage
In this example, we'll create a script that automatically repairs a player's vehicle when they enter it, and sets its health to full.

```typescript
const onEnterVehicle: vehicle_event_on_enter = (event: number, vehicle: Vehicle, passenger: Unit, seatId: number) => {
    if (passenger instanceof Player) {
        const vehicleKit = passenger.GetVehicleKit();
        if (vehicleKit) {
            const maxHealth = vehicleKit.GetBase().GetMaxHealth();
            const currentHealth = vehicleKit.GetBase().GetHealth();

            if (currentHealth < maxHealth) {
                vehicleKit.GetBase().SetHealth(maxHealth);
                passenger.SendBroadcastMessage("Your vehicle has been fully repaired!");
            }

            const seats = vehicleKit.GetAvailableSeatCount();
            for (let i = 0; i < seats; i++) {
                const passenger = vehicleKit.GetPassenger(i);
                if (passenger) {
                    passenger.SendBroadcastMessage("Welcome aboard!");
                }
            }
        }
    }
};

RegisterVehicleEvent(VehicleEvents.VEHICLE_EVENT_ON_ENTER, (...args) => onEnterVehicle(...args));
```

In this script:
1. We register a callback function `onEnterVehicle` to the `VEHICLE_EVENT_ON_ENTER` event.
2. When a passenger enters a vehicle, we check if the passenger is a player using `instanceof Player`.
3. If the passenger is a player, we get the vehicle methods using `passenger.GetVehicleKit()`.
4. We check if the vehicle exists by checking if `vehicleKit` is truthy.
5. If the vehicle exists, we get its maximum health using `vehicleKit.GetBase().GetMaxHealth()` and current health using `vehicleKit.GetBase().GetHealth()`.
6. If the current health is less than the maximum health, we set the vehicle's health to full using `vehicleKit.GetBase().SetHealth(maxHealth)` and send a message to the player informing them that their vehicle has been repaired.
7. We get the number of available seats in the vehicle using `vehicleKit.GetAvailableSeatCount()`.
8. We iterate over each seat and check if there's a passenger in it using `vehicleKit.GetPassenger(i)`.
9. If there's a passenger in the seat, we send them a welcome message using `passenger.SendBroadcastMessage()`.

This script demonstrates how to use the `GetVehicleKit()` method to access and manipulate a unit's vehicle properties, such as repairing the vehicle and interacting with passengers.

## GetVictim
Returns the current victim target of the [Unit]. If the unit is not in combat or does not have a target, this method will return `nil`.

### Parameters
None

### Returns
[Unit](./unit.md) | nil - Returns the [Unit] that is being attacked by this unit, or `nil` if no valid target exists.

### Example Usage
This example demonstrates how to use `GetVictim()` in a script that checks if a creature's health percentage is below a certain threshold, and if so, it will cast a self-heal spell on itself.

```typescript
const CREATURE_ENTRY_ID = 1234;
const HEALTH_THRESHOLD = 30;
const SELF_HEAL_SPELL_ID = 5678;

const CreatureHealthCheck: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    const victim = creature.GetVictim();

    if (victim) {
        const healthPct = creature.GetHealthPct();

        if (healthPct <= HEALTH_THRESHOLD) {
            const spellInfo = GetSpellInfo(SELF_HEAL_SPELL_ID);

            if (spellInfo && creature.HasSpell(SELF_HEAL_SPELL_ID)) {
                creature.CastSpell(creature, SELF_HEAL_SPELL_ID, false);
                creature.MonsterSay(`I'm healing myself! My health is at ${healthPct}%`, 0);
            } else {
                console.log(`Creature ${CREATURE_ENTRY_ID} does not have the self-heal spell ${SELF_HEAL_SPELL_ID}`);
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY_ID, CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => CreatureHealthCheck(...args));
```

In this example:

1. We define constants for the creature entry ID, health threshold percentage, and the self-heal spell ID.
2. We create a function `CreatureHealthCheck` that will be triggered on the `CREATURE_EVENT_ON_UPDATE` event for the specified creature entry ID.
3. Inside the function, we use `creature.GetVictim()` to get the current victim target of the creature.
4. If a valid victim exists, we check the creature's current health percentage using `creature.GetHealthPct()`.
5. If the health percentage is below or equal to the defined `HEALTH_THRESHOLD`, we proceed to check if the creature has the self-heal spell using `creature.HasSpell(SELF_HEAL_SPELL_ID)`.
6. If the creature has the spell, we cast it on the creature itself using `creature.CastSpell(creature, SELF_HEAL_SPELL_ID, false)` and make the creature say a message indicating its current health percentage.
7. If the creature does not have the self-heal spell, we log a message to the console.

This example showcases how `GetVictim()` can be used in combination with other methods like `GetHealthPct()`, `HasSpell()`, and `CastSpell()` to create a script that makes a creature cast a self-heal spell when its health drops below a certain threshold while in combat with a victim target.

## HandleStatModifier

Modifies a specific stat of the [Unit] by applying or removing a modifier of a specified type and value.

### Parameters
- `stat`: [StatModType](../enums/StatModType.md) - The stat to modify (e.g., STAT_MOD_STRENGTH, STAT_MOD_AGILITY, etc.).
- `type`: [StatModifierType](../enums/StatModifierType.md) - The type of modifier to apply (e.g., FLAT_MOD, PCT_MOD, etc.).
- `value`: number - The value to apply to the stat. Positive values will increase the stat, while negative values will decrease it.
- `apply`: boolean (optional, default: false) - Whether the modifier should be applied (true) or removed (false).

### Returns
- boolean: Whether the stat modification was successful.

### Example Usage
```typescript
const BLESSING_OF_KINGS_SPELL_ID = 25898;
const BLESSING_OF_KINGS_STAT_PCT_MOD = 10;

const ApplyBlessingOfKings: player_event_on_login = (event: number, player: Player) => {
    const blessingOfKings = player.GetAura(BLESSING_OF_KINGS_SPELL_ID);

    if (!blessingOfKings) {
        // Apply Blessing of Kings if the player doesn't have it
        if (player.CastSpell(player, BLESSING_OF_KINGS_SPELL_ID, true)) {
            // Modify the player's stats by 10% when Blessing of Kings is applied
            const stats = [StatModType.STAT_MOD_STRENGTH, StatModType.STAT_MOD_AGILITY, StatModType.STAT_MOD_STAMINA, StatModType.STAT_MOD_INTELLECT, StatModType.STAT_MOD_SPIRIT];
            for (const stat of stats) {
                player.HandleStatModifier(stat, StatModifierType.PCT_MOD, BLESSING_OF_KINGS_STAT_PCT_MOD, true);
            }
        }
    } else {
        // Remove the stat modifiers if Blessing of Kings is removed
        if (blessingOfKings.GetStackAmount() === 1 && player.RemoveAura(BLESSING_OF_KINGS_SPELL_ID)) {
            const stats = [StatModType.STAT_MOD_STRENGTH, StatModType.STAT_MOD_AGILITY, StatModType.STAT_MOD_STAMINA, StatModType.STAT_MOD_INTELLECT, StatModType.STAT_MOD_SPIRIT];
            for (const stat of stats) {
                player.HandleStatModifier(stat, StatModifierType.PCT_MOD, BLESSING_OF_KINGS_STAT_PCT_MOD, false);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => ApplyBlessingOfKings(...args));
```

In this example, when a player logs in, the script checks if the player has the Blessing of Kings aura. If not, it casts Blessing of Kings on the player and applies a 10% modifier to the player's strength, agility, stamina, intellect, and spirit stats using the `HandleStatModifier` method. If the player already has Blessing of Kings and it is removed, the script removes the stat modifiers accordingly.

## HasAura
Determines whether the unit has a specific aura active by checking for the aura's spell ID.

### Parameters
- spell: number - The spell ID of the aura to check for.

### Returns
- boolean - Returns true if the unit has the specified aura active, false otherwise.

### Example Usage
In this example, we'll create a script that checks if a player has the "Blessing of Kings" aura when they enter combat. If they don't have the aura, we'll apply it to them and send them a message.

```typescript
const BLESSING_OF_KINGS_SPELL_ID = 25898;

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    if (!player.HasAura(BLESSING_OF_KINGS_SPELL_ID)) {
        const blessingOfKings = player.AddAura(BLESSING_OF_KINGS_SPELL_ID, player);
        if (blessingOfKings) {
            player.SendBroadcastMessage("You have been blessed with the Blessing of Kings!");
        } else {
            player.SendBroadcastMessage("Failed to apply Blessing of Kings. Please report this issue.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script:
1. We define the spell ID for "Blessing of Kings" as a constant.
2. When the player enters combat, we use the `HasAura()` method to check if the player already has the "Blessing of Kings" aura active.
3. If the player doesn't have the aura, we use the `AddAura()` method to apply the aura to the player.
4. If the aura is successfully applied, we send a message to the player informing them that they have received the Blessing of Kings.
5. If the aura fails to apply, we send an error message to the player, asking them to report the issue.
6. Finally, we register the `onEnterCombat` function to be called whenever the `PLAYER_EVENT_ON_ENTER_COMBAT` event is triggered.

By using the `HasAura()` method, we can easily check if a unit has a specific aura active and take appropriate actions based on the result.

## HasUnitState
Returns a boolean value indicating whether the unit has a specific unit state flag set.

### Parameters
- state: number - The unit state flag to check. Refer to the UnitState enum for possible values.

### Returns
- boolean - Returns true if the unit has the specified unit state flag set, false otherwise.

### Example Usage
Suppose you want to create a script that checks if a unit is confused and then removes the confused state from the unit.

```typescript
const UnitState = {
    UNIT_STATE_CONFUSED: 0x00000001,
    // ... other unit states
};

function RemoveConfusion(unit: Unit): void {
    if (unit.HasUnitState(UnitState.UNIT_STATE_CONFUSED)) {
        // Remove the confused state from the unit
        unit.ClearUnitState(UnitState.UNIT_STATE_CONFUSED);

        // You can also perform additional actions here, such as:
        // - Sending a message to the unit
        unit.SendUnitWhisper("You are no longer confused!", 0);

        // - Applying a beneficial spell or effect to the unit
        const spellId = 12345; // Replace with the actual spell ID
        unit.CastSpell(unit, spellId, true);

        // - Modifying the unit's movement speed or other attributes
        const movementSpeed = 1.5; // Increase movement speed by 50%
        unit.SetSpeed(UnitMoveType.MOVE_RUN, movementSpeed);

        // - Triggering a visual effect or animation on the unit
        const effectId = 567; // Replace with the actual effect ID
        unit.PlayDirectSound(effectId);

        // - Logging the event or performing further checks
        console.log(`Removed confusion from unit ${unit.GetName()}`);
    }
}

// Usage: Call the RemoveConfusion function with a unit object
const targetUnit = GetUnit(123); // Replace with the actual unit retrieval logic
RemoveConfusion(targetUnit);
```

In this example, the `HasUnitState` method is used to check if the unit has the `UNIT_STATE_CONFUSED` flag set. If the unit is indeed confused, the script proceeds to remove the confused state using the `ClearUnitState` method.

Additionally, the script demonstrates various other actions that can be performed on the unit after removing the confused state, such as sending a whisper message, casting a beneficial spell, modifying movement speed, playing a visual effect, and logging the event.

Remember to replace the placeholder values (e.g., spell ID, effect ID) with the actual values relevant to your specific use case.

By utilizing the `HasUnitState` method, you can create more complex scripts that check for specific unit states and perform appropriate actions based on the unit's current state.

## HealthAbovePct
Returns a boolean value indicating whether the [Unit]'s current health is above the specified percentage of their maximum health.

### Parameters
* healthpct: number - The health percentage to check against (0-100)

### Returns
* boolean - True if the [Unit]'s current health is above the specified percentage, false otherwise

### Example Usage
In this example, we'll create a script that will check if a player's target is below 20% health. If the target is a creature and below 20% health, the creature will flee for assistance.

```typescript
const FLEE_FOR_ASSISTANCE_SPELL_ID = 8599;

const OnHitUnit: player_event_on_hit_unit = (event: number, player: Player, target: Unit) => {
    if (target.IsCreature()) {
        const creature = target.ToCreature();
        
        if (!creature.HealthAbovePct(20)) {
            // Check if the creature is already fleeing
            if (!creature.HasAura(FLEE_FOR_ASSISTANCE_SPELL_ID)) {
                // Creature's health is below 20%, cast Flee For Assistance
                creature.CastSpell(creature, FLEE_FOR_ASSISTANCE_SPELL_ID, true);
                
                // Say a random flee message
                const fleeMessages = [
                    "I need backup!",
                    "Help me, brothers!",
                    "I can't take this alone!",
                    "I'm outta here!"
                ];
                const randomMessage = fleeMessages[Math.floor(Math.random() * fleeMessages.length)];
                creature.SendUnitSay(randomMessage, 0);
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_HIT_UNIT, (...args) => OnHitUnit(...args));
```

In this script:
1. We define the spell ID for the "Flee For Assistance" ability, which causes creatures to run away and seek help from nearby allies.
2. In the `OnHitUnit` event, we check if the player's target is a creature using `target.IsCreature()`.
3. If the target is a creature, we use `HealthAbovePct(20)` to check if the creature's health is below 20%.
4. If the creature's health is below 20% and it doesn't already have the "Flee For Assistance" aura (checked using `HasAura()`), we proceed to cast the spell on the creature using `CastSpell()`.
5. We then select a random flee message from an array of predefined messages and make the creature say it using `SendUnitSay()`.

This script adds a dynamic element to creature behavior, making them flee and call for help when they are near death, enhancing the overall gameplay experience.

## HealthBelowPct
Returns true if the [Unit]'s current health is below the specified percentage of their maximum health.

### Parameters
* healthpct: number - The health percentage to check against. Value between 0 and 100.

### Returns
* boolean - True if the [Unit]'s health is below the specified percentage, false otherwise.

### Example Usage
In this example, we'll create a script that checks if the player's health drops below 20% during combat. If it does, the script will heal the player for a percentage of their maximum health and send them a message.

```typescript
const HEAL_PERCENT = 0.3;

const checkHealth: player_event_on_damage = (event: number, player: Player, attacker: Unit, damage: number, spell: Spell) => {
    const healthPct = 20;

    if (player.HealthBelowPct(healthPct)) {
        const maxHealth = player.GetMaxHealth();
        const healAmount = Math.floor(maxHealth * HEAL_PERCENT);

        player.SetHealth(player.GetHealth() + healAmount);
        player.SendBroadcastMessage(`You have been healed for ${healAmount} health!`);

        const logMessage = `Player ${player.GetName()} was healed for ${healAmount} health when below ${healthPct}% health.`;
        console.log(logMessage);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DAMAGE, (...args) => checkHealth(...args));
```

In this script:
1. We define a constant `HEAL_PERCENT` to determine the percentage of the player's maximum health to heal.
2. In the `checkHealth` function, we check if the player's health is below 20% using the `HealthBelowPct` method.
3. If the condition is true, we calculate the player's maximum health and the heal amount based on the `HEAL_PERCENT`.
4. We set the player's health to their current health plus the heal amount using the `SetHealth` method.
5. We send a message to the player informing them of the heal using the `SendBroadcastMessage` method.
6. We log a message to the console for debugging purposes.
7. Finally, we register the `checkHealth` function to the `PLAYER_EVENT_ON_DAMAGE` event to execute the script whenever the player takes damage.

This script demonstrates how to use the `HealthBelowPct` method to check if a unit's health falls below a certain percentage and perform actions based on that condition.

## InterruptSpell
Interrupts the unit's spell state, casting, etc. If the spell is not interruptible, the method will return without interrupting the spell.

### Parameters
* spellType: number - The type of spell to interrupt. Possible values:
  * 0 - Current autorepeat spell
  * 1 - Current channeled spell
  * 2 - Current generic spell
  * 3 - Current autorepeat spell, current channeled spell, and current generic spell
* delayed: boolean (optional) - If 'true', the method will wait for the next spell update to interrupt the spell. Default value is 'false'.

### Example Usage
Interrupt a boss's channeled spell when a certain condition is met:
```typescript
const BOSS_ENTRY = 12345;
const CHANNELED_SPELL_ID = 54321;

const onSpellCast: creature_event_on_spell_cast = (event: number, creature: Creature, target: Unit, spellId: number): void => {
    if (creature.GetEntry() === BOSS_ENTRY && spellId === CHANNELED_SPELL_ID) {
        const healthPercent = creature.GetHealthPct();
        if (healthPercent <= 30) {
            creature.InterruptSpell(1);
            creature.SendUnitYell("My channeling has been interrupted!", 0);
            creature.CastSpell(creature, 98765, true); // Cast a special ability after the interruption
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPELL_CAST, (...args) => onSpellCast(...args));
```

In this example, when the boss creature starts casting a specific channeled spell (identified by `CHANNELED_SPELL_ID`), the script checks the boss's health percentage. If the health is at or below 30%, the script interrupts the channeled spell using `creature.InterruptSpell(1)`. The boss then yells and casts a special ability as a response to the interruption.

This script showcases how to use the `InterruptSpell` method in a more complex scenario, where the interruption is triggered by a specific condition (boss's health) and is followed by additional actions (yelling and casting another spell).

## IsAlive
Returns a boolean value indicating whether the unit is currently alive or not.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is alive, `false` otherwise.

### Example Usage
In this example, we create a script that checks if the player is alive before attempting to cast a spell. If the player is not alive, it will send a message to the player indicating that they cannot cast spells while dead.

```typescript
const SPELL_ID = 12345; // Replace with the desired spell ID

const OnPlayerCastSpell: player_event_on_cast_spell = (event: number, player: Player, spell: Spell): void => {
    if (!player.IsAlive()) {
        player.SendBroadcastMessage("You cannot cast spells while dead!");
        player.InterruptSpell(CurrentSpellTypes.CURRENT_AUTOREPEAT_SPELL);
        player.InterruptSpell(CurrentSpellTypes.CURRENT_CHANNELED_SPELL);
        player.InterruptSpell(CurrentSpellTypes.CURRENT_GENERIC_SPELL);
        player.InterruptSpell(CurrentSpellTypes.CURRENT_MELEE_SPELL);
        player.InterruptSpell(CurrentSpellTypes.CURRENT_SPELL);
        return;
    }

    // Additional logic for when the player is alive and casting a spell
    // ...
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => OnPlayerCastSpell(...args));
```

In this script:
1. We define the `OnPlayerCastSpell` function that takes the event type, player, and spell as parameters.
2. Inside the function, we first check if the player is alive using the `IsAlive()` method.
3. If the player is not alive, we send a broadcast message to the player indicating that they cannot cast spells while dead.
4. We then interrupt all the spells that the player might be casting using the `InterruptSpell()` method for various spell types.
5. If the player is alive, the script continues with any additional logic you want to implement when the player is casting a spell.
6. Finally, we register the `OnPlayerCastSpell` function to be triggered whenever the `PLAYER_EVENT_ON_CAST_SPELL` event occurs using the `RegisterPlayerEvent()` function.

This script ensures that players cannot cast spells while they are dead and provides appropriate feedback to the player when they attempt to do so.

## IsArmorer
This method checks if the Unit is an armorer NPC that can repair equipment.

### Parameters
None

### Returns
boolean - Returns `true` if the Unit is an armorer, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsArmorer()` method to check if a creature is an armorer and provide a repair service to players.

```typescript
const ARMORER_ENTRY = 12345; // Replace with the actual entry of the armorer NPC

const onGossipHello: creature_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === ARMORER_ENTRY && creature.IsArmorer()) {
        player.GossipMenuAddItem(0, "I would like to repair my equipment.", 0, 1);
        player.GossipSendMenu(1, creature.GetGUID());
    } else {
        player.GossipSendMenu(2, creature.GetGUID());
    }
};

const onGossipSelect: creature_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number) => {
    if (creature.GetEntry() === ARMORER_ENTRY && action === 1) {
        player.GossipClearMenu();

        const repairCost = player.DurabilityRepairAll(true, 0, false);
        if (repairCost <= 0) {
            player.GossipMenuAddItem(0, "You have no damaged equipment to repair.", 0, 2);
        } else if (player.GetMoney() < repairCost) {
            player.GossipMenuAddItem(0, "You don't have enough money to repair your equipment.", 0, 2);
        } else {
            player.ModifyMoney(-repairCost);
            player.DurabilityRepairAll(false, 0, false);
            player.GossipMenuAddItem(0, "Your equipment has been repaired.", 0, 2);
        }

        player.GossipSendMenu(1, creature.GetGUID());
    } else {
        player.GossipComplete();
    }
};

RegisterCreatureEvent(ARMORER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => onGossipHello(...args));
RegisterCreatureEvent(ARMORER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, (...args) => onGossipSelect(...args));
```

In this example, when a player interacts with an armorer NPC (identified by its entry), the script checks if the creature is indeed an armorer using the `IsArmorer()` method. If it is, the player is presented with a gossip option to repair their equipment.

When the player selects the repair option, the script calculates the repair cost using `DurabilityRepairAll()` with the `cost` parameter set to `true`. If the player has no damaged equipment or insufficient funds, appropriate messages are displayed. Otherwise, the player's money is deducted, and their equipment is repaired using `DurabilityRepairAll()` with the `cost` parameter set to `false`.

This example demonstrates how the `IsArmorer()` method can be used in conjunction with other methods to create a functional repair service provided by an armorer NPC.

## IsAttackingPlayer
Returns true if the [Unit] is currently attacking a player, false otherwise.

### Parameters
This method does not take any parameters.

### Returns
boolean - true if the [Unit] is attacking a player, false otherwise.

### Example Usage
This example demonstrates how to use the `IsAttackingPlayer` method to check if a creature is attacking a player and if so, cast a spell on the player.

```typescript
const CREATURE_ENTRY = 1234;
const SPELL_ID = 5678;

const CreatureAttackStart: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY && target.IsPlayer()) {
        const player = target.ToPlayer();
        if (creature.IsAttackingPlayer()) {
            creature.CastSpell(player, SPELL_ID, true);
            creature.SendUnitWhisper("You dare attack me, mortal? Feel my wrath!", player);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => CreatureAttackStart(...args));
```

In this example:
1. We define constants for the creature entry and the spell ID that we want to use.
2. We register a creature event handler for the `CREATURE_EVENT_ON_ENTER_COMBAT` event.
3. In the event handler, we first check if the creature that entered combat has the entry we're interested in and if the target is a player.
4. If the creature is attacking a player (checked using `IsAttackingPlayer`), we cast a spell on the player using `CastSpell` and send a whisper to the player using `SendUnitWhisper`.

This script can be useful for creating custom creature behaviors when they enter combat with players, such as casting specific spells or sending taunting messages.

## IsAuctioneer
Returns true if the [Unit] is an auctioneer NPC.

### Parameters
None

### Returns
boolean - Returns `true` if the [Unit] is an auctioneer, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsAuctioneer()` method to create an auctioneer NPC that provides additional functionality to players.

```typescript
const AUCTIONEER_ENTRY = 12345; // Replace with the actual auctioneer NPC entry ID

const OnGossipHello: npc_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === AUCTIONEER_ENTRY && creature.IsAuctioneer()) {
        player.GossipMenuAddItem(0, "Show my auction sales", 0, 1);
        player.GossipMenuAddItem(0, "Collect unsold items", 0, 2);
        player.GossipMenuAddItem(0, "Collect auction proceeds", 0, 3);
        player.GossipSendMenu(1, creature.GetGUID());
    }
};

const OnGossipSelect: npc_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number) => {
    if (creature.GetEntry() === AUCTIONEER_ENTRY && creature.IsAuctioneer()) {
        if (action === 1) {
            // Show the player's auction sales
            // Implementation details omitted for brevity
            player.GossipComplete();
        } else if (action === 2) {
            // Collect unsold items for the player
            // Implementation details omitted for brevity
            player.GossipComplete();
        } else if (action === 3) {
            // Collect auction proceeds for the player
            // Implementation details omitted for brevity
            player.GossipComplete();
        }
    }
};

RegisterCreatureEvent(AUCTIONEER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, OnGossipHello);
RegisterCreatureEvent(AUCTIONEER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, OnGossipSelect);
```

In this example:

1. We define the auctioneer NPC entry ID in the `AUCTIONEER_ENTRY` constant.

2. In the `OnGossipHello` event handler, we check if the creature interacted with is an auctioneer using the `IsAuctioneer()` method.

3. If the creature is an auctioneer, we add gossip menu items for showing auction sales, collecting unsold items, and collecting auction proceeds.

4. We register the `OnGossipHello` event handler for the auctioneer NPC.

5. In the `OnGossipSelect` event handler, we handle the selected gossip menu item based on the `action` parameter.

6. Depending on the selected action, we perform the corresponding functionality (showing auction sales, collecting unsold items, or collecting auction proceeds).

7. Finally, we register the `OnGossipSelect` event handler for the auctioneer NPC.

This example showcases how the `IsAuctioneer()` method can be used to create custom functionality for auctioneer NPCs, providing additional features to players interacting with them.

## IsBanker
Returns true if the [Unit] is a banker NPC.

### Parameters
None

### Returns
boolean - True if the unit is a banker, false otherwise.

### Example Usage
This example demonstrates how to use the `IsBanker` method to check if a unit is a banker and provide a custom interaction based on the result.

```typescript
const GOLD_AMOUNT = 100;

const OnGossipHello: unit_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.IsBanker()) {
        player.GossipMenuAddItem(0, "Deposit " + GOLD_AMOUNT + " gold", 1, 0);
        player.GossipMenuAddItem(0, "Check balance", 2, 0);
        player.GossipSendMenu(1, creature);
    } else {
        player.GossipMenuAddItem(0, "I need to find a banker", 3, 0);
        player.GossipSendMenu(2, creature);
    }
};

const OnGossipSelect: unit_event_on_gossip_select = (event: number, player: Player, creature: Creature, sender: number, action: number) => {
    if (creature.IsBanker()) {
        if (action === 0) {
            player.GossipClearMenu();
            player.GossipSendMenu(1, creature);
        } else if (action === 1) {
            if (player.GetCoinage() >= GOLD_AMOUNT * 10000) {
                player.ModifyMoney(-GOLD_AMOUNT * 10000);
                player.SendBroadcastMessage("You have deposited " + GOLD_AMOUNT + " gold.");
            } else {
                player.SendBroadcastMessage("You don't have enough gold to deposit.");
            }
            player.GossipComplete();
        } else if (action === 2) {
            player.SendBroadcastMessage("Your current balance is: " + player.GetCoinage() / 10000 + " gold.");
            player.GossipComplete();
        }
    } else {
        if (action === 3) {
            player.SendBroadcastMessage("You can find a banker in any major city.");
            player.GossipComplete();
        }
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example:
1. When a player interacts with an NPC using the `UNIT_EVENT_ON_GOSSIP_HELLO` event, the script checks if the NPC is a banker using the `IsBanker` method.
2. If the NPC is a banker, the player is presented with options to deposit a fixed amount of gold or check their balance.
3. If the NPC is not a banker, the player is given an option to ask for directions to find a banker.
4. When the player selects an option using the `UNIT_EVENT_ON_GOSSIP_SELECT` event, the script handles the corresponding action based on the selected option and whether the NPC is a banker.
5. If the player chooses to deposit gold and has sufficient funds, the specified amount is deducted from their character using `ModifyMoney`, and a success message is displayed.
6. If the player chooses to check their balance, their current gold balance is retrieved using `GetCoinage` and displayed as a message.
7. If the player interacts with a non-banker NPC and selects the option to find a banker, a message is displayed directing them to major cities.

This example showcases how the `IsBanker` method can be used in combination with other methods and events to create a custom banking interaction within the game.

## IsBattleMaster
This method checks if the unit is a battle master NPC. Battle masters are special NPCs that allow players to join battlegrounds or arenas.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the unit is a battle master, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsBattleMaster()` method to identify battle master NPCs and provide a custom interaction for players.

```typescript
const WARSONG_GULCH_BATTLEMASTER_ENTRY = 2302;
const ARATHI_BASIN_BATTLEMASTER_ENTRY = 857;

const OnGossipHello: creature_event_on_gossip_hello = (event: number, creature: Creature, player: Player): boolean => {
    if (creature.IsBattleMaster()) {
        const creatureEntry = creature.GetEntry();
        
        switch (creatureEntry) {
            case WARSONG_GULCH_BATTLEMASTER_ENTRY:
                player.GossipMenuAddItem(0, "Tell me more about Warsong Gulch.", 0, 1);
                break;
            case ARATHI_BASIN_BATTLEMASTER_ENTRY:
                player.GossipMenuAddItem(0, "I'd like to know more about Arathi Basin.", 0, 2);
                break;
            default:
                player.GossipMenuAddItem(0, "What battlegrounds are available?", 0, 3);
                break;
        }
        
        player.GossipSendMenu(1, creature, 0);
        return true;
    }
    
    // Default gossip for non-battle master NPCs
    player.GossipMenuAddItem(0, "Hello there!", 0, 4);
    player.GossipSendMenu(1, creature, 0);
    return true;
};

const OnGossipSelect: creature_event_on_gossip_select = (event: number, creature: Creature, player: Player, sender: number, intid: number, code: string, menu_id: number): boolean => {
    if (intid === 1) {
        player.SendBroadcastMessage("Warsong Gulch is a 10 vs 10 capture the flag battleground located in Ashenvale and the Barrens.");
    } else if (intid === 2) {
        player.SendBroadcastMessage("Arathi Basin is a 15 vs 15 resource-gathering battleground located in Arathi Highlands.");
    } else if (intid === 3) {
        player.SendBroadcastMessage("Available battlegrounds: Warsong Gulch, Arathi Basin, Alterac Valley, and Eye of the Storm.");
    } else {
        player.SendBroadcastMessage("Hello, adventurer! How can I assist you today?");
    }
    
    player.GossipComplete();
    return true;
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example, when a player interacts with an NPC, the `OnGossipHello` function is called. It checks if the NPC is a battle master using the `IsBattleMaster()` method. If true, it adds specific gossip options based on the NPC's entry ID. For known battle masters, it provides options to learn more about the specific battleground. For unknown battle masters, it provides a generic option to inquire about available battlegrounds.

When the player selects a gossip option, the `OnGossipSelect` function is called. Based on the selected option (`intid`), it sends a broadcast message to the player with information about the chosen battleground or a default message for non-battleground-related options.

This example showcases how the `IsBattleMaster()` method can be used to create custom interactions and provide relevant information to players when interacting with battle master NPCs.

## IsCasting
This method returns a boolean value indicating whether the unit is currently casting a spell.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is casting a spell, `false` otherwise.

### Example Usage
In this example, we'll create a script that checks if a creature is casting a spell when it enters combat with a player. If the creature is casting, we'll interrupt the spell and make the creature say "My spell was interrupted!".

```typescript
const CREATURE_ENTRY = 1234; // Replace with the desired creature entry ID

const onEnterCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        if (creature.IsCasting()) {
            creature.InterruptSpell();
            creature.SendUnitSay("My spell was interrupted!", 0);

            // You can also perform additional actions here, such as:
            // - Apply a debuff to the creature
            // - Increase the creature's movement speed
            // - Make the creature cast a different spell
            // - Summon additional creatures to assist the interrupted creature

            const debuffSpellId = 12345; // Replace with the desired debuff spell ID
            creature.CastSpell(creature, debuffSpellId, true);

            const movementSpeedIncrease = 50; // 50% movement speed increase
            creature.SetSpeed(UnitMoveType.MOVE_RUN, creature.GetSpeed(UnitMoveType.MOVE_RUN) * (1 + movementSpeedIncrease / 100), true);

            const newSpellId = 54321; // Replace with the desired spell ID for the creature to cast
            creature.CastSpell(target, newSpellId, false);

            const summonedCreatureEntry = 5678; // Replace with the desired summoned creature entry ID
            const summonedCreatureCount = 2;
            for (let i = 0; i < summonedCreatureCount; i++) {
                creature.SummonCreature(summonedCreatureEntry, creature.GetX(), creature.GetY(), creature.GetZ(), creature.GetO(), TempSummonType.TEMPSUMMON_TIMED_DESPAWN_OUT_OF_COMBAT, 30000);
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this example:
1. We define the `CREATURE_ENTRY` constant with the desired creature entry ID.
2. We create an event handler function `onEnterCombat` for the `CREATURE_EVENT_ON_ENTER_COMBAT` event.
3. Inside the event handler, we check if the creature's entry matches the desired entry ID.
4. If the creature is casting a spell (checked using `creature.IsCasting()`), we interrupt the spell using `creature.InterruptSpell()`.
5. We make the creature say "My spell was interrupted!" using `creature.SendUnitSay()`.
6. Additionally, we perform some optional actions:
   - Apply a debuff to the creature using `creature.CastSpell()` with `true` as the third argument to cast the spell instantly.
   - Increase the creature's movement speed by 50% using `creature.SetSpeed()`.
   - Make the creature cast a different spell on the target using `creature.CastSpell()` with `false` as the third argument to cast the spell with a cast time.
   - Summon two additional creatures to assist the interrupted creature using `creature.SummonCreature()`.
7. Finally, we register the event handler using `RegisterCreatureEvent()`.

This example showcases how the `IsCasting()` method can be used in combination with other methods and game events to create dynamic and interactive creature behaviors in response to spell casting situations.

## IsCharmed
Returns true if the unit is currently under the influence of a mind control effect, false otherwise.

### Parameters
None

### Returns
boolean - true if the unit is charmed, false otherwise

### Example Usage
Periodically check if the player has been mind controlled by an enemy and if so, break the charm effect and send them back to their previous location.

```typescript
let previousLocation: {map: number, x: number, y: number, z: number, o: number};

const checkCharm: player_event_on_update = (event: number, player: Player, diff: number) => {
    if (player.IsCharmed()) {
        if (!previousLocation) {
            // Store the player's current location before breaking the charm
            previousLocation = {
                map: player.GetMapId(),
                x: player.GetX(),
                y: player.GetY(),
                z: player.GetZ(),
                o: player.GetO()
            };
        }

        // Break the charm effect
        player.RemoveAurasDueToSpell(605); // Mind Control spell ID

        // Teleport the player back to their previous location
        player.Teleport(
            previousLocation.map, 
            previousLocation.x, 
            previousLocation.y, 
            previousLocation.z, 
            previousLocation.o
        );

        // Notify the player
        player.SendBroadcastMessage("You have been freed from mind control!");
    } else {
        // Reset the stored location when the player is not charmed
        previousLocation = null;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, checkCharm);
```

In this example, we register a `PLAYER_EVENT_ON_UPDATE` event handler to periodically check if the player is charmed using the `IsCharmed()` method. 

If the player is indeed charmed, we first store their current location (if we haven't already) before breaking the charm effect. We then use the stored location to teleport the player back to where they were before being mind controlled. Finally, we send a message to the player notifying them that they have been freed.

When the player is no longer charmed, we reset the stored location to `null` so that it can be stored again the next time they are mind controlled.

This script helps to prevent players from being griefed or stuck in an undesirable location after being mind controlled by an enemy player or NPC.

## IsDead
Returns a boolean value indicating whether the unit is currently dead or alive.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is dead, `false` otherwise.

### Example Usage
Here's an example of how to use the `IsDead()` method to check if a unit is dead and perform actions based on the result:

```typescript
const OnUnitDeath: creature_event_on_just_died = (event: number, creature: Creature, killer: Unit) => {
    const creatureId = creature.GetEntry();
    
    // Check if the creature is a specific boss
    if (creatureId === BOSS_ID) {
        // Get all players in the map
        const players = creature.GetMap().GetPlayers();
        
        // Iterate over each player
        for (const player of players) {
            // Check if the player is alive
            if (!player.IsDead()) {
                // Reward the player with a special item
                const rewardItem = player.AddItem(REWARD_ITEM_ID, 1);
                
                // Check if the item was successfully added to the player's inventory
                if (rewardItem) {
                    player.SendBroadcastMessage(`Congratulations! You have been rewarded with a special item for defeating the boss.`);
                } else {
                    player.SendBroadcastMessage(`Your inventory is full. Please make space and talk to an NPC to claim your reward.`);
                }
            }
        }
        
        // Spawn a special NPC at the boss's location
        const bossLocation = creature.GetLocation();
        creature.GetMap().SpawnCreature(SPECIAL_NPC_ID, bossLocation.x, bossLocation.y, bossLocation.z, bossLocation.o);
    }
};

RegisterCreatureEvent(BOSS_ID, CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, OnUnitDeath);
```

In this example:
1. We register a creature event handler for the `CREATURE_EVENT_ON_JUST_DIED` event of a specific boss creature.
2. When the boss dies, we retrieve all players in the map using `creature.GetMap().GetPlayers()`.
3. We iterate over each player and check if they are alive using `player.IsDead()`.
4. If the player is alive, we reward them with a special item using `player.AddItem(REWARD_ITEM_ID, 1)`.
5. We check if the item was successfully added to the player's inventory. If so, we send them a congratulatory message using `player.SendBroadcastMessage()`. If the inventory is full, we send a message instructing them to make space and claim the reward from an NPC.
6. After rewarding the players, we spawn a special NPC at the boss's location using `creature.GetMap().SpawnCreature()`.

This example demonstrates how the `IsDead()` method can be used in combination with other methods and events to create dynamic gameplay experiences based on the life state of units.

## IsDying
Returns a boolean value indicating whether the unit is currently dying.

### Returns
boolean - True if the unit is dying, false otherwise.

### Example Usage
In this example, we'll create a script that checks if a creature is dying and, if so, spawns a new creature and increases the player's experience.

```typescript
const CREATURE_ENTRY = 1234;
const SPAWN_CREATURE_ENTRY = 5678;
const BONUS_EXPERIENCE = 1000;

const OnCreatureDeath: creature_event_on_died = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        if (creature.IsDying()) {
            const position = creature.GetPosition();
            const orientation = creature.GetOrientation();
            const spawned = creature.SummonCreature(SPAWN_CREATURE_ENTRY, position.x, position.y, position.z, orientation, 2, 60000);
            
            if (spawned) {
                spawned.SendUnitYell("I have been summoned from the depths!", 0);
            }

            if (killer instanceof Player) {
                killer.GiveXP(BONUS_EXPERIENCE, creature);
                killer.SendBroadcastMessage(`You have been awarded ${BONUS_EXPERIENCE} bonus experience for slaying the creature!`);
            }
        }
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_DIED, (...args) => OnCreatureDeath(...args));
```

In this script:
1. We define constants for the creature entry, the entry of the creature to spawn, and the amount of bonus experience to award.
2. We register a `CREATURE_EVENT_ON_DIED` event for the specified creature entry.
3. When the creature dies, we check if its entry matches the one we're interested in.
4. If it does, we use `IsDying()` to check if the creature is currently in the process of dying.
5. If the creature is dying, we get its position and orientation.
6. We use `SummonCreature()` to spawn a new creature at the same position and orientation, with a despawn time of 60000ms (1 minute).
7. If the spawned creature is successfully created, we make it yell a message using `SendUnitYell()`.
8. We check if the killer is a player using the `instanceof` operator.
9. If the killer is a player, we award them bonus experience using `GiveXP()` and send them a broadcast message informing them of the bonus.

This script demonstrates how `IsDying()` can be used in combination with other methods and events to create interesting gameplay mechanics and interactions.

## IsFullHealth
Returns true if the unit, whether an NPC or player, is at full health.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is at full health, `false` otherwise.

### Example Usage
In this example, we'll create a script that will check if the player is at full health when they kill a creature. If they are not at full health, they will receive a 10% healing effect.

```typescript
const HEAL_PERCENT = 10;

const OnCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    if (!player.IsFullHealth()) {
        const maxHealth = player.GetMaxHealth();
        const healAmount = maxHealth * (HEAL_PERCENT / 100);

        player.SetHealth(player.GetHealth() + healAmount);

        player.SendBroadcastMessage(`You have been healed for ${healAmount} health for killing the ${creature.GetName()} while not at full health.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => OnCreatureKill(...args));
```

In this script:
1. We define a constant `HEAL_PERCENT` that represents the percentage of the player's maximum health they will be healed for if they kill a creature while not at full health.
2. In the `OnCreatureKill` event handler, we first check if the player is at full health using the `IsFullHealth()` method.
3. If the player is not at full health, we calculate the amount of healing they should receive based on their maximum health and the `HEAL_PERCENT` constant.
4. We then update the player's current health using `SetHealth()` by adding the calculated heal amount to their current health.
5. Finally, we send a message to the player using `SendBroadcastMessage()` to inform them of the healing effect they received for killing the creature while not at full health.

This script demonstrates how the `IsFullHealth()` method can be used in combination with other methods and game events to create dynamic gameplay experiences for players.

## IsGossip
Returns a boolean value indicating whether the unit is able to show a gossip window.

### Returns
boolean - Returns `true` if the unit can show a gossip window; otherwise, returns `false`.

### Example Usage
This example demonstrates how to use the `IsGossip()` method to determine if a creature can show a gossip window and perform different actions based on the result.

```typescript
const GOSSIP_MENU_ID = 1234;
const GOSSIP_ITEM_ID = 5678;

const onGossipHello: GossipHello = (event, player, creature) => {
    if (creature.IsGossip()) {
        // The creature can show a gossip window
        player.PrepareGossipMenu(creature, GOSSIP_MENU_ID);
        player.SendPreparedGossip(creature);
    } else {
        // The creature cannot show a gossip window
        creature.Say("I have nothing to say to you.", Language.LANG_UNIVERSAL);
    }
};

const onGossipSelect: GossipSelect = (event, player, creature, sender, action) => {
    if (action === GOSSIP_ITEM_ID) {
        // Handle the selected gossip option
        if (creature.IsGossip()) {
            // The creature can still show a gossip window
            player.GossipMenuAddItem(GossipOptionIcon.GOSSIP_ICON_CHAT, "Tell me more.", GOSSIP_MENU_ID, GOSSIP_ITEM_ID);
            player.SendPreparedGossip(creature);
        } else {
            // The creature can no longer show a gossip window
            player.CloseGossip();
            creature.Say("I'm afraid I can't help you anymore.", Language.LANG_UNIVERSAL);
        }
    }
};

RegisterCreatureGossipEvent(CREATURE_ENTRY, GossipEvents.GOSSIP_EVENT_ON_HELLO, (...args) => onGossipHello(...args));
RegisterCreatureGossipEvent(CREATURE_ENTRY, GossipEvents.GOSSIP_EVENT_ON_SELECT, (...args) => onGossipSelect(...args));
```

In this example:
1. When a player interacts with a creature, the `onGossipHello` event is triggered.
2. The script checks if the creature can show a gossip window using `creature.IsGossip()`.
   - If the creature can show a gossip window, it prepares the gossip menu using `player.PrepareGossipMenu()` and sends it to the player using `player.SendPreparedGossip()`.
   - If the creature cannot show a gossip window, it says a message to the player using `creature.Say()`.
3. When the player selects a gossip option, the `onGossipSelect` event is triggered.
4. The script checks if the selected action matches the desired gossip item ID (`GOSSIP_ITEM_ID`).
   - If the action matches and the creature can still show a gossip window, it adds a new gossip item using `player.GossipMenuAddItem()` and sends the updated gossip menu to the player.
   - If the action matches but the creature can no longer show a gossip window, it closes the gossip window using `player.CloseGossip()` and says a message to the player.

This example showcases how `IsGossip()` can be used to conditionally display gossip options and handle different scenarios based on the creature's ability to show a gossip window.

## IsGuildMaster
This method returns true if the [Unit](./unit.md) is a guild master of a guild.

### Parameters
None

### Returns
boolean - Returns true if the [Unit](./unit.md) is a guild master, false otherwise.

### Example Usage
This example shows how to check if a player is a guild master and grant them a special item if they are.

```typescript
// Item entry for the special guild master item
const GUILD_MASTER_ITEM_ENTRY = 12345;

// Function to handle the player login event
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Check if the player is a guild master
    if (player.IsGuildMaster()) {
        // Check if the player already has the special guild master item
        if (!player.HasItem(GUILD_MASTER_ITEM_ENTRY)) {
            // Add the special guild master item to the player's inventory
            player.AddItem(GUILD_MASTER_ITEM_ENTRY, 1);
            
            // Send a message to the player
            player.SendBroadcastMessage("As a guild master, you have been granted a special item!");
        }
    }
}

// Register the player login event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, when a player logs in, the script checks if the player is a guild master using the `IsGuildMaster()` method. If the player is a guild master and doesn't already have the special guild master item, the script adds the item to the player's inventory using the `AddItem()` method and sends a message to the player using the `SendBroadcastMessage()` method.

By using the `IsGuildMaster()` method, you can easily identify players who are guild masters and provide them with special benefits or functionality in your mod.

## IsInAccessiblePlaceFor
This method checks if the [Unit] is in an accessible place for the given [WorldObject] within a specified radius. It is commonly used to determine if a [Creature] can reach a specific [Unit] before executing certain actions or initiating combat.

### Parameters
- `obj`: [WorldObject](./world-object.md) - The [WorldObject] to check accessibility for, typically a [Creature].
- `radius`: number - The maximum distance in yards to consider for accessibility.

### Returns
- `boolean` - Returns `true` if the [Unit] is accessible to the [WorldObject] within the specified radius, `false` otherwise.

### Example Usage
In this example, we have a script that controls the behavior of a guardian creature. When a player enters the creature's visibility range, the creature checks if the player is within an accessible range before engaging in combat or performing other actions.

```typescript
const GUARDIAN_ENTRY = 12345;
const ENGAGE_RADIUS = 10;

const GuardianAI: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    if (!creature.IsInCombat()) {
        const nearestPlayer = creature.GetNearestPlayer(50);

        if (nearestPlayer) {
            if (creature.IsInAccessiblePlaceFor(nearestPlayer, ENGAGE_RADIUS)) {
                // Player is within accessible range, engage in combat
                creature.AttackStart(nearestPlayer);

                // Perform other actions or apply buffs
                creature.CastSpell(creature, 12345, true);
                creature.Say("Intruder detected! Engaging in combat!", 0);
            } else {
                // Player is not within accessible range, move towards them
                creature.MoveTo(nearestPlayer.GetX(), nearestPlayer.GetY(), nearestPlayer.GetZ(), ENGAGE_RADIUS);
            }
        }
    }
}

RegisterCreatureEvent(GUARDIAN_ENTRY, CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => GuardianAI(...args));
```

In this script, the guardian creature periodically checks for the nearest player within a visibility range of 50 yards. If a player is found, the creature uses the `IsInAccessiblePlaceFor` method to determine if the player is within an accessible range defined by `ENGAGE_RADIUS`.

If the player is accessible, the creature engages in combat using `AttackStart`, casts a spell on itself, and sends a message to the player. If the player is not within accessible range, the creature moves towards the player's location using `MoveTo` to close the distance.

By utilizing the `IsInAccessiblePlaceFor` method, the creature can make intelligent decisions based on the accessibility of its target, ensuring realistic behavior and preventing situations where the creature gets stuck or cannot reach the player due to obstacles or terrain limitations.

## IsInCombat
Returns a boolean value indicating whether the unit is currently in combat or not.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the unit is in combat, `false` otherwise.

### Example Usage
Here's an example of how to use the `IsInCombat` method in a script that rewards players with bonus gold and experience if they defeat an elite creature while in combat with other elite creatures nearby.

```typescript
const ELITE_CREATURE_ENTRY = 1234;
const BONUS_GOLD = 100;
const BONUS_XP = 500;

const OnCreatureKill: creature_event_on_kill = (event: number, creature: Creature, killer: Unit) => {
    if (creature.GetEntry() === ELITE_CREATURE_ENTRY && killer instanceof Player) {
        const player = killer as Player;

        // Check if the player is in combat with other elite creatures
        const nearbyCreatures = creature.GetCreaturesInRange(50, ELITE_CREATURE_ENTRY);
        let isInCombatWithElites = false;

        for (const nearbyCreature of nearbyCreatures) {
            if (nearbyCreature.IsInCombat() && nearbyCreature.IsElite()) {
                isInCombatWithElites = true;
                break;
            }
        }

        if (isInCombatWithElites) {
            // Reward the player with bonus gold and experience
            player.ModifyMoney(BONUS_GOLD);
            player.GiveXP(BONUS_XP, true);
            player.SendBroadcastMessage(`You have been rewarded with ${BONUS_GOLD} gold and ${BONUS_XP} experience for defeating an elite creature while in combat with other elite creatures!`);
        }
    }
};

RegisterCreatureEvent(ELITE_CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_KILL, (...args) => OnCreatureKill(...args));
```

In this example:
1. We define constants for the elite creature entry, bonus gold amount, and bonus experience amount.
2. We register a creature event handler for the `CREATURE_EVENT_ON_KILL` event of the specified elite creature entry.
3. Inside the event handler, we first check if the killer is a player using the `instanceof` operator.
4. We retrieve nearby creatures within a range of 50 yards that have the same elite creature entry.
5. We iterate over the nearby creatures and check if any of them are in combat and are elite using the `IsInCombat()` and `IsElite()` methods.
6. If the player is in combat with other elite creatures, we reward them with bonus gold using `ModifyMoney()` and bonus experience using `GiveXP()`.
7. Finally, we send a broadcast message to the player informing them about the bonus rewards they received.

This script demonstrates how the `IsInCombat` method can be used in combination with other methods and conditions to create engaging gameplay mechanics and reward players for their achievements.

## IsInWater
Returns true if the unit is currently in water.

### Parameters
None

### Returns
boolean - True if the unit is in water, false otherwise.

### Example Usage
This example demonstrates how to use the `IsInWater()` method to check if a player is in water and apply a buff if they are.

```typescript
const SWIM_SPEED_BUFF_ID = 97;
const SWIM_SPEED_BUFF_DURATION = 60 * 1000; // 1 minute in milliseconds

const HandlePlayerMovement: player_event_on_update = (event: number, player: Player, diff: number) => {
    // Check if the player is in water
    if (player.IsInWater()) {
        // Check if the player already has the swim speed buff
        if (!player.HasAura(SWIM_SPEED_BUFF_ID)) {
            // Apply the swim speed buff to the player
            player.AddAura(SWIM_SPEED_BUFF_ID, SWIM_SPEED_BUFF_DURATION);
            player.SendBroadcastMessage("You feel a surge of energy as you enter the water!");
        }
    } else {
        // Check if the player has the swim speed buff
        if (player.HasAura(SWIM_SPEED_BUFF_ID)) {
            // Remove the swim speed buff from the player
            player.RemoveAura(SWIM_SPEED_BUFF_ID);
            player.SendBroadcastMessage("The surge of energy fades as you leave the water.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => HandlePlayerMovement(...args));
```

In this example:
1. We define constants for the swim speed buff ID and duration.
2. We register a `player_event_on_update` event to handle player movement.
3. Inside the event handler, we check if the player is in water using `player.IsInWater()`.
4. If the player is in water and doesn't already have the swim speed buff, we apply the buff using `player.AddAura()` and send a broadcast message to the player.
5. If the player is not in water and has the swim speed buff, we remove the buff using `player.RemoveAura()` and send a broadcast message to the player.

This script will apply a swim speed buff to the player whenever they enter water, and remove the buff when they leave the water. The buff duration is set to 1 minute, but you can adjust it as needed.

## IsInnkeeper
This method checks if the given [Unit](./unit.md) is an innkeeper NPC. Innkeeper NPCs can provide various services to players, such as allowing them to bind their hearthstone to the innkeeper's location or providing rested experience.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns true if the [Unit](./unit.md) is an innkeeper, false otherwise.

### Example Usage
This example demonstrates how to use the `IsInnkeeper` method to create a script that allows players to bind their hearthstone to an innkeeper's location and receive a special item as a reward.

```typescript
const INNKEEPER_ENTRY = 1234; // Replace with the actual innkeeper's entry ID
const SPECIAL_ITEM_ENTRY = 5678; // Replace with the actual special item's entry ID

const onGossipHello: player_event_on_gossip_hello = (event: number, player: Player, unit: Unit) => {
    if (unit.IsInnkeeper()) {
        player.GossipMenuAddItem(0, "Bind my hearthstone here", 0, 1);
        player.GossipMenuAddItem(0, "I'm just browsing", 0, 2);
        player.GossipSendMenu(1, unit.GetGUID());
    }
};

const onGossipSelect: player_event_on_gossip_select = (event: number, player: Player, unit: Unit, sender: number, action: number) => {
    if (unit.GetEntry() === INNKEEPER_ENTRY) {
        if (action === 1) {
            player.SetBindPoint(unit.GetMapId(), unit.GetX(), unit.GetY(), unit.GetZ());
            player.SendBindPointUpdate();
            
            const item = player.AddItem(SPECIAL_ITEM_ENTRY, 1);
            if (item) {
                player.SendAreaTriggerMessage("You have bound your hearthstone to this location and received a special item!");
            } else {
                player.SendAreaTriggerMessage("You have bound your hearthstone to this location, but your inventory is full. Please make room and talk to the innkeeper again to receive your special item.");
            }
            
            player.GossipComplete();
        } else if (action === 2) {
            player.SendAreaTriggerMessage("Safe travels!");
            player.GossipComplete();
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => onGossipHello(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => onGossipSelect(...args));
```

In this example:
1. When a player interacts with an innkeeper NPC (identified by `INNKEEPER_ENTRY`), the script checks if the unit is indeed an innkeeper using the `IsInnkeeper` method.
2. If the unit is an innkeeper, the script adds two gossip options: one to bind the player's hearthstone and receive a special item, and another to simply browse.
3. When the player selects the "Bind my hearthstone here" option, the script sets the player's bind point to the innkeeper's location using `SetBindPoint` and `SendBindPointUpdate`.
4. The script then attempts to add the special item (identified by `SPECIAL_ITEM_ENTRY`) to the player's inventory using `AddItem`. If successful, the player receives a message confirming the binding and the item. If the player's inventory is full, they receive a message asking them to make room and talk to the innkeeper again.
5. If the player selects the "I'm just browsing" option, they receive a simple farewell message.

This script showcases how the `IsInnkeeper` method can be used in conjunction with other methods and events to create a more immersive and interactive experience for players when dealing with innkeeper NPCs.

## IsMounted
Returns a boolean value indicating whether the unit is currently mounted on a mount or vehicle.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is mounted, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is mounted and apply a speed bonus if they are.

```typescript
const SPEED_BONUS = 1.5;

const onPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    if (player.IsMounted()) {
        // Get the player's current speed
        const currentSpeed = player.GetSpeed(UnitMoveType.MOVE_RUN);

        // Calculate the speed bonus
        const speedBonus = currentSpeed * SPEED_BONUS;

        // Apply the speed bonus to the player
        player.SetSpeed(UnitMoveType.MOVE_RUN, speedBonus);

        // Inform the player about the speed bonus
        player.SendBroadcastMessage(`You receive a ${SPEED_BONUS}x speed bonus while mounted!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onPlayerLogin(...args));
```

In this example:
1. We define a constant `SPEED_BONUS` to represent the speed bonus multiplier.
2. Inside the `onPlayerLogin` event handler, we check if the player is mounted using `player.IsMounted()`.
3. If the player is mounted:
   - We get the player's current running speed using `player.GetSpeed(UnitMoveType.MOVE_RUN)`.
   - We calculate the speed bonus by multiplying the current speed with the `SPEED_BONUS`.
   - We apply the speed bonus to the player using `player.SetSpeed(UnitMoveType.MOVE_RUN, speedBonus)`.
   - We send a broadcast message to the player informing them about the speed bonus they received.
4. Finally, we register the `onPlayerLogin` event handler using `RegisterPlayerEvent`.

This script enhances the gameplay experience by providing a temporary speed boost to mounted players, encouraging them to utilize mounts for faster travel.

Note: The speed bonus multiplier and the specific implementation can be adjusted based on the desired balance and gameplay mechanics of your server.

## IsOnVehicle
Returns true if the [Unit] is currently on a [Vehicle].

### Parameters
None

### Returns
boolean - True if the [Unit] is on a [Vehicle], false otherwise.

### Example Usage
This example demonstrates how to check if a player is on a vehicle and apply a buff to the vehicle if they are.

```typescript
const VEHICLE_BUFF_ENTRY = 12345;

const onVehicleEnter: vehicle_event_on_enter = (event: number, vehicle: Vehicle, passenger: Unit, seat: number) => {
    if (passenger instanceof Player) {
        if (passenger.IsOnVehicle()) {
            const vehicleCreature = vehicle.GetBase();
            if (vehicleCreature instanceof Creature) {
                vehicleCreature.AddAura(VEHICLE_BUFF_ENTRY, vehicleCreature);
                vehicleCreature.SendChatMessage(ChatMsg.CHAT_MSG_MONSTER_SAY, 0, "The passenger has empowered the vehicle!");
            }
        }
    }
};

RegisterVehicleEvent(VehicleEvents.VEHICLE_EVENT_ON_ENTER, (...args) => onVehicleEnter(...args));
```

In this example:
1. We define a constant `VEHICLE_BUFF_ENTRY` with the entry ID of the buff we want to apply to the vehicle.
2. We register a `VEHICLE_EVENT_ON_ENTER` event handler using `RegisterVehicleEvent`.
3. In the event handler function `onVehicleEnter`, we first check if the passenger is a player using `passenger instanceof Player`.
4. If the passenger is a player, we use `passenger.IsOnVehicle()` to check if the player is currently on a vehicle.
5. If the player is on a vehicle, we retrieve the vehicle's base creature using `vehicle.GetBase()`.
6. We check if the vehicle's base is a creature using `vehicleCreature instanceof Creature`.
7. If the vehicle's base is a creature, we add the specified buff to the vehicle using `vehicleCreature.AddAura(VEHICLE_BUFF_ENTRY, vehicleCreature)`.
8. Finally, we make the vehicle's creature say a message using `vehicleCreature.SendChatMessage(ChatMsg.CHAT_MSG_MONSTER_SAY, 0, "The passenger has empowered the vehicle!")`.

This example showcases how to use the `IsOnVehicle()` method to determine if a unit (in this case, a player) is currently on a vehicle and perform actions based on that condition. It also demonstrates interacting with the vehicle and its base creature to apply buffs and send chat messages.

## IsPvPFlagged
This method checks if the [Unit] is flagged for PvP combat. Players can be flagged for PvP by either toggling their PvP flag, entering a PvP zone, or attacking another player flagged for PvP. When a unit is PvP flagged, they are open to attacks from players of the opposite faction.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is flagged for PvP, `false` otherwise.

### Example Usage
In this example, we will create a script that rewards players with bonus honor points when they kill a player that is PvP flagged in the world.

```typescript
const BONUS_HONOR_POINTS = 10;

const OnPVPKill: player_event_on_kill_player = (event: number, killer: Player, killed: Player) => {
    // Check if the killed player was PvP flagged
    if (killed.IsPvPFlagged()) {
        // Reward the killer with bonus honor points
        killer.ModifyHonorPoints(BONUS_HONOR_POINTS);

        // Send a message to the killer
        killer.SendBroadcastMessage(`You have been awarded ${BONUS_HONOR_POINTS} bonus honor points for killing a PvP flagged player!`);

        // Get the killer's current honor points
        const currentHonorPoints = killer.GetHonorPoints();

        // Check if the killer has reached a certain threshold of honor points
        if (currentHonorPoints >= 1000) {
            // Reward the killer with an additional item
            const BONUS_ITEM_ENTRY = 12345;
            killer.AddItem(BONUS_ITEM_ENTRY, 1);

            // Send another message to the killer
            killer.SendBroadcastMessage(`You have been awarded a bonus item for reaching ${currentHonorPoints} honor points!`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, (...args) => OnPVPKill(...args));
```

In this script, we first check if the killed player was PvP flagged using the `IsPvPFlagged()` method. If they were, we reward the killer with a set amount of bonus honor points using the `ModifyHonorPoints()` method and send them a message using `SendBroadcastMessage()`.

We then check the killer's current honor points using `GetHonorPoints()` and see if they have reached a certain threshold (in this case, 1000 points). If they have, we reward them with an additional bonus item using `AddItem()` and send them another message.

This script encourages world PvP by rewarding players for killing PvP flagged enemies, while also providing additional rewards for reaching certain milestones.

## IsQuestGiver
This method checks if the unit is a quest giver. It is useful to determine if the player can interact with the unit to receive or turn in quests.

### Parameters
This method does not take any parameters.

### Returns
* boolean - Returns `true` if the unit is a quest giver, `false` otherwise.

### Example Usage
In this example, we create a script that listens for the `GOSSIP_EVENT_ON_HELLO` event. When a player interacts with a unit, it checks if the unit is a quest giver. If the unit is a quest giver, it displays a message to the player indicating that they can receive or turn in quests. If the unit is not a quest giver, it displays a different message.

```typescript
const OnGossipHello: gossip_event_on_hello = (event: number, player: Player, unit: Unit) => {
    if (unit.IsQuestGiver()) {
        player.SendBroadcastMessage(`Welcome, ${player.GetName()}! I have quests available for you.`);
        
        // Check if the player has any completed quests to turn in
        const completedQuests = player.GetQuestStatus().filter(quest => quest.status === QuestStatus.COMPLETE);
        
        if (completedQuests.length > 0) {
            player.SendBroadcastMessage(`You have ${completedQuests.length} completed quest(s) ready to turn in!`);
        }
        
        // Check if the player is eligible for any new quests
        const availableQuests = unit.GetQuestList().filter(quest => player.CanTakeQuest(quest.entry));
        
        if (availableQuests.length > 0) {
            player.SendBroadcastMessage(`There are ${availableQuests.length} new quest(s) available for you!`);
        }
        
        // Add gossip menu options for quest interaction
        player.GossipMenuAddItem(0, "I would like to turn in a quest.", 0, 0);
        player.GossipMenuAddItem(0, "I am looking for a new quest.", 0, 0);
        player.GossipSendMenu(player.GetGUID(), unit.GetEntry());
    } else {
        player.SendBroadcastMessage(`Greetings, ${player.GetName()}! I'm afraid I don't have any quests for you.`);
        player.GossipComplete();
    }
};

RegisterUnitEvent(UnitEvents.GOSSIP_EVENT_ON_HELLO, (...args) => OnGossipHello(...args));
```

In this script, we utilize additional methods and properties to enhance the functionality:
- `player.GetQuestStatus()` retrieves the player's current quest statuses.
- `player.CanTakeQuest(entry)` checks if the player is eligible to accept a specific quest.
- `unit.GetQuestList()` retrieves the list of quests offered by the unit.
- `player.GossipMenuAddItem()` adds options to the gossip menu for quest interaction.
- `player.GossipSendMenu()` sends the gossip menu to the player.
- `player.GossipComplete()` closes the gossip interaction if the unit is not a quest giver.

This example demonstrates how to use the `IsQuestGiver()` method in conjunction with other quest-related methods and gossip functionality to create a more interactive and informative quest giver interaction.

## IsRooted
Returns a boolean value indicating whether the unit is currently rooted or not. A rooted unit is unable to move and may have other restrictions applied.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the unit is currently rooted, `false` otherwise.

### Example Usage
In this example, we create a script that checks if the player is rooted when they enter combat. If the player is rooted, we remove the root effect and apply a speed boost to help them escape.

```typescript
const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    if (player.IsRooted()) {
        // Remove the root effect
        player.RemoveAurasByType(AuraType.SPELL_AURA_MOD_ROOT);

        // Apply a speed boost to help the player escape
        const SPEED_BOOST_SPELL_ID = 12345;
        const SPEED_BOOST_DURATION = 5000; // 5 seconds
        player.AddAura(SPEED_BOOST_SPELL_ID, SPEED_BOOST_DURATION);

        // Send a message to the player
        player.SendBroadcastMessage("You have been unrooted and granted a temporary speed boost!");

        // Log the event
        console.log(`Player ${player.GetName()} was rooted when entering combat with ${enemy.GetName()}. Root removed and speed boost applied.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script:
1. We register a callback function for the `PLAYER_EVENT_ON_ENTER_COMBAT` event.
2. When the player enters combat, we check if they are rooted using the `IsRooted()` method.
3. If the player is rooted:
   - We remove the root effect by removing all auras of type `SPELL_AURA_MOD_ROOT` using `RemoveAurasByType()`.
   - We apply a speed boost aura to the player using `AddAura()`, specifying the spell ID and duration.
   - We send a message to the player informing them about the root removal and speed boost using `SendBroadcastMessage()`.
   - We log the event details using `console.log()`.

This script demonstrates how you can use the `IsRooted()` method to check if a unit is rooted and take appropriate actions based on the result. In this case, we remove the root effect and apply a temporary speed boost to help the player escape combat when they are rooted.

## IsServiceProvider
This method checks if the unit is a service provider, such as a vendor, trainer, or auctioneer. It is useful for determining if the player can interact with the unit to access certain services.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is a service provider, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsServiceProvider` method to create a custom interaction system for service providers. When a player interacts with a unit, the script checks if the unit is a service provider and displays a custom dialogue based on the type of service provider.

```typescript
const GOSSIP_ICON_VENDOR = 1;
const GOSSIP_ICON_TRAINER = 2;
const GOSSIP_ICON_AUCTIONEER = 3;

const OnGossipHello: player_event_on_gossip_hello = (event: number, player: Player, unit: Unit): void => {
    if (unit.IsServiceProvider()) {
        if (unit.IsVendor()) {
            player.GossipMenuAddItem(GOSSIP_ICON_VENDOR, "Show me your wares.", 0, 1);
        }
        if (unit.IsTrainer()) {
            player.GossipMenuAddItem(GOSSIP_ICON_TRAINER, "I seek training.", 0, 2);
        }
        if (unit.IsAuctioneer()) {
            player.GossipMenuAddItem(GOSSIP_ICON_AUCTIONEER, "I want to browse the auction house.", 0, 3);
        }
        player.GossipSendMenu(1, unit.GetObjectGuid());
    } else {
        player.GossipSendMenu(0, unit.GetObjectGuid());
    }
};

const OnGossipSelect: player_event_on_gossip_select = (event: number, player: Player, unit: Unit, sender: number, action: number): void => {
    if (action == 1) {
        player.SendListInventory(unit.GetObjectGuid());
    } else if (action == 2) {
        player.SendTrainerList(unit.GetObjectGuid());
    } else if (action == 3) {
        player.SendAuctionMenu(unit.GetObjectGuid());
    }
    player.GossipComplete();
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => OnGossipHello(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_SELECT, (...args) => OnGossipSelect(...args));
```

In this example:
1. When the player interacts with a unit (triggering the `PLAYER_EVENT_ON_GOSSIP_HELLO` event), the script checks if the unit is a service provider using the `IsServiceProvider` method.
2. If the unit is a service provider, the script further checks the specific type of service provider (vendor, trainer, or auctioneer) and adds corresponding gossip menu items using `player.GossipMenuAddItem`.
3. The gossip menu is sent to the player using `player.GossipSendMenu`.
4. When the player selects a gossip option (triggering the `PLAYER_EVENT_ON_GOSSIP_SELECT` event), the script handles the selected action based on the `action` parameter.
5. Depending on the selected action, the player is sent the appropriate inventory list, trainer list, or auction menu using `player.SendListInventory`, `player.SendTrainerList`, or `player.SendAuctionMenu`, respectively.
6. Finally, the gossip interaction is completed using `player.GossipComplete`.

This example showcases how the `IsServiceProvider` method can be used in combination with other methods and events to create a custom interaction system for service providers in your mod.

## IsSpiritGuide
This method checks if the unit is a spirit guide. Spirit guides are typically found in graveyards and are responsible for resurrecting players.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the unit is a spirit guide, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsSpiritGuide()` method to identify spirit guide units and perform specific actions based on that information.

```typescript
const GRAVEYARD_ZONE_ID = 12; // Example graveyard zone ID

const OnPlayerGhostUpdate: player_event_on_update = (event: number, player: Player, diff: number) => {
    if (player.IsDead()) {
        const nearbyUnits = player.GetUnitsInRange(10); // Get nearby units within 10 yards

        for (const unit of nearbyUnits) {
            if (unit.IsSpiritGuide()) {
                const spiritGuide = unit as Creature;
                const graveyard = spiritGuide.GetNearestGraveyard();

                if (graveyard && graveyard.GetZoneId() === GRAVEYARD_ZONE_ID) {
                    // Perform specific actions for the spirit guide in the desired graveyard
                    player.SendBroadcastMessage("You have found the spirit guide in the target graveyard!");
                    player.ResurrectPlayer(1.0); // Resurrect the player with full health
                    player.TeleportTo(graveyard.GetMapId(), graveyard.GetPositionX(), graveyard.GetPositionY(), graveyard.GetPositionZ(), 0); // Teleport the player to the graveyard
                    break;
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => OnPlayerGhostUpdate(...args));
```

In this example:
1. We define a constant `GRAVEYARD_ZONE_ID` to represent the desired graveyard zone ID.
2. Inside the `OnPlayerGhostUpdate` event handler, we check if the player is dead using the `IsDead()` method.
3. If the player is dead, we retrieve nearby units within a 10-yard range using the `GetUnitsInRange()` method.
4. We iterate over the nearby units and check if each unit is a spirit guide using the `IsSpiritGuide()` method.
5. If a unit is a spirit guide, we cast it to a `Creature` type to access specific methods.
6. We retrieve the nearest graveyard to the spirit guide using the `GetNearestGraveyard()` method.
7. If the nearest graveyard exists and its zone ID matches the desired `GRAVEYARD_ZONE_ID`, we perform specific actions:
   - Send a broadcast message to the player indicating they have found the spirit guide in the target graveyard.
   - Resurrect the player with full health using the `ResurrectPlayer()` method.
   - Teleport the player to the graveyard location using the `TeleportTo()` method.
8. Finally, we register the `OnPlayerGhostUpdate` event handler for the `PLAYER_EVENT_ON_UPDATE` event using the `RegisterPlayerEvent()` function.

This example showcases how the `IsSpiritGuide()` method can be used in combination with other methods and game events to create a script that identifies spirit guides and performs specific actions when a player is near a spirit guide in a desired graveyard.

## IsSpiritHealer
Returns true if the [Unit] is a spirit healer, false otherwise.

### Parameters
None

### Returns
boolean - True if the unit is a spirit healer, false otherwise.

### Example Usage
This example demonstrates how to use the `IsSpiritHealer` method to check if a unit is a spirit healer and perform specific actions based on the result.

```typescript
const SpiritHealerAura: ManagedAuraScript = {
    OnApply: (aura: Aura): void => {
        const caster = aura.GetCaster();
        if (!caster) {
            return;
        }

        if (caster.IsSpiritHealer()) {
            const target = aura.GetTarget();
            if (target && target.ToPlayer()) {
                const player = target.ToPlayer();
                player.ResurrectPlayer(0.5);
                player.TeleportTo(player.GetMapId(), player.GetX(), player.GetY(), player.GetZ(), player.GetO());
                player.SpawnCorpseBones();
            }
        }
    },

    OnRemove: (aura: Aura): void => {
        // Additional actions when the aura is removed
    },

    OnPeriodicTick: (aura: Aura): void => {
        // Additional actions on each periodic tick of the aura
    }
};

RegisterAura(12345, SpiritHealerAura);
```

In this example, a custom aura script is registered for the aura with ID 12345. When the aura is applied to a unit, the script checks if the caster of the aura is a spirit healer using the `IsSpiritHealer` method.

If the caster is a spirit healer and the target of the aura is a player, the script performs the following actions:
1. Resurrects the player with 50% health using the `ResurrectPlayer` method.
2. Teleports the player to their current location using the `TeleportTo` method.
3. Spawns the player's corpse bones using the `SpawnCorpseBones` method.

This example showcases how the `IsSpiritHealer` method can be used in conjunction with other methods and game events to create custom functionality related to spirit healers and player resurrection.

## IsSpiritService
Returns true if the [Unit] is a spirit guide or spirit healer. Spirit guides and spirit healers are special NPCs that can resurrect dead players and help them return to their corpse.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is a spirit guide or spirit healer, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsSpiritService()` method to identify spirit guides or spirit healers and provide a custom interaction when a player interacts with them.

```typescript
const SPIRIT_HEALER_ENTRY = 6491;

const OnGossipHello: on_gossip_hello = (event: any, player: Player, creature: Creature) => {
    if (creature.GetEntry() === SPIRIT_HEALER_ENTRY && creature.IsSpiritService()) {
        player.GossipMenuAddItem(0, "Resurrect me, please!", 0, 1);
        player.GossipMenuAddItem(0, "Can you guide me to my corpse?", 0, 2);
        player.GossipSendMenu(player.GetGUID(), creature.GetGUID());
    } else {
        player.GossipSendMenu(player.GetGUID(), creature.GetGUID());
    }
};

const OnGossipSelect: on_gossip_select = (event: any, player: Player, creature: Creature, sender: number, action: number) => {
    if (creature.GetEntry() === SPIRIT_HEALER_ENTRY && creature.IsSpiritService()) {
        if (action === 1) {
            player.ResurrectPlayer(0.5);
            player.SpellCastDirected(player.GetGUID(), 48171, true);
            player.GossipComplete();
        } else if (action === 2) {
            const corpseX = player.GetCorpseX();
            const corpseY = player.GetCorpseY();
            const corpseZ = player.GetCorpseZ();
            const corpseMapId = player.GetCorpseMapId();

            player.TeleportTo(corpseMapId, corpseX, corpseY, corpseZ, 0);
            player.GossipComplete();
        }
    }
};

RegisterCreatureEvent(SPIRIT_HEALER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, OnGossipHello);
RegisterCreatureEvent(SPIRIT_HEALER_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_SELECT, OnGossipSelect);
```

In this example:
1. We define the entry ID of the spirit healer NPC as `SPIRIT_HEALER_ENTRY`.
2. In the `OnGossipHello` event, we check if the creature interacted with is a spirit healer using `creature.IsSpiritService()`.
3. If it is a spirit healer, we add custom gossip options for resurrecting the player and guiding them to their corpse using `player.GossipMenuAddItem()`.
4. In the `OnGossipSelect` event, we handle the selected gossip option.
   - If the player chooses to resurrect, we use `player.ResurrectPlayer()` to resurrect them with 50% health and cast a resurrection visual spell using `player.SpellCastDirected()`.
   - If the player chooses to be guided to their corpse, we retrieve the coordinates and map ID of their corpse using `player.GetCorpseX()`, `player.GetCorpseY()`, `player.GetCorpseZ()`, and `player.GetCorpseMapId()`, and then teleport the player to those coordinates using `player.TeleportTo()`.
5. Finally, we register the gossip events for the spirit healer NPC using `RegisterCreatureEvent()`.

This example showcases how `IsSpiritService()` can be used to identify spirit healers and implement custom functionality for interacting with them, providing players with options to resurrect or find their corpse.

## IsStandState
Returns a boolean value indicating whether the unit is currently in a standing state.

### Parameters
None

### Returns
boolean - `true` if the unit is standing, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is standing and perform different actions based on their stance.

```typescript
const OnPlayerCastSpell: player_event_on_spell_cast = (event: number, player: Player, spell: Spell) => {
    const SPELL_ID_FIREBALL = 133;
    const SPELL_ID_FROSTBOLT = 116;

    if (spell.GetEntry() === SPELL_ID_FIREBALL || spell.GetEntry() === SPELL_ID_FROSTBOLT) {
        if (player.IsStandState()) {
            player.SendBroadcastMessage("You cast a powerful spell while standing tall!");
            player.CastSpell(player, 23768, true); // Cast "Reflexes" spell on the player
            player.AddAura(48161, player); // Add "Power Infusion" aura to the player
            player.CastSpell(spell.GetTarget(), spell, true); // Cast the original spell on the target
        } else {
            player.SendBroadcastMessage("You cast a spell while in a non-standing state.");
            player.CastSpell(spell.GetTarget(), spell, true); // Cast the original spell on the target
            player.AddAura(12544, player); // Add "Frost Armor" aura to the player
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SPELL_CAST, (...args) => OnPlayerCastSpell(...args));
```

In this example:
1. We define a callback function `OnPlayerCastSpell` that is triggered whenever a player casts a spell.
2. We check if the spell being cast is either "Fireball" (ID: 133) or "Frostbolt" (ID: 116).
3. If the spell matches, we use `player.IsStandState()` to determine if the player is currently standing.
4. If the player is standing:
   - We send a broadcast message to the player indicating they cast a powerful spell while standing.
   - We cast the "Reflexes" spell (ID: 23768) on the player using `player.CastSpell()`.
   - We add the "Power Infusion" aura (ID: 48161) to the player using `player.AddAura()`.
   - We cast the original spell on the target using `player.CastSpell()`.
5. If the player is not standing:
   - We send a broadcast message to the player indicating they cast a spell in a non-standing state.
   - We cast the original spell on the target using `player.CastSpell()`.
   - We add the "Frost Armor" aura (ID: 12544) to the player using `player.AddAura()`.
6. Finally, we register the `OnPlayerCastSpell` callback function to the `PLAYER_EVENT_ON_SPELL_CAST` event using `RegisterPlayerEvent()`.

This script allows you to differentiate between spells cast while standing and spells cast in other stances, providing different effects and messages based on the player's stance.

## IsStopped
Returns true if the [Unit] is not moving. This can be useful for checking if a unit is currently stationary or in motion.

### Parameters
None

### Returns
boolean - True if the unit is not moving, false otherwise.

### Example Usage
Here's an example of how you can use the `IsStopped()` method to create a script that tracks a player's movement and grants them a buff if they remain stationary for a certain duration:

```typescript
const STATIONARY_BUFF_ID = 12345; // Replace with the actual buff ID
const STATIONARY_DURATION = 5 * 1000; // 5 seconds in milliseconds

let stationaryTimer: number | null = null;

const OnPlayerMoved: player_event_on_move = (event: number, player: Player, moveType: PlayerMoveType, movementInfo: MovementInfo) => {
    if (player.IsStopped()) {
        if (!stationaryTimer) {
            // Player has stopped moving, start the timer
            stationaryTimer = setTimeout(() => {
                if (player.IsStopped()) {
                    // Player is still stationary after the specified duration
                    player.AddAura(STATIONARY_BUFF_ID, player);
                    player.SendBroadcastMessage("You have been granted a buff for remaining stationary!");
                }
                stationaryTimer = null;
            }, STATIONARY_DURATION);
        }
    } else {
        if (stationaryTimer) {
            // Player has started moving, cancel the timer
            clearTimeout(stationaryTimer);
            stationaryTimer = null;
        }
        player.RemoveAura(STATIONARY_BUFF_ID);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_MOVE, (...args) => OnPlayerMoved(...args));
```

In this example:
1. We define constants for the buff ID (`STATIONARY_BUFF_ID`) and the duration (`STATIONARY_DURATION`) that the player needs to remain stationary to receive the buff.

2. We create a variable `stationaryTimer` to keep track of the timer.

3. We register the `OnPlayerMoved` event handler using `RegisterPlayerEvent` with the `PLAYER_EVENT_ON_MOVE` event.

4. Inside the event handler, we check if the player is stopped using `player.IsStopped()`.

5. If the player is stopped and there is no active timer, we start a new timer using `setTimeout`. The timer will execute the callback function after the specified `STATIONARY_DURATION`.

6. If the player is still stationary after the duration, we add the stationary buff to the player using `player.AddAura` and send a broadcast message to notify them.

7. If the player starts moving while the timer is active, we cancel the timer using `clearTimeout` and remove the stationary buff using `player.RemoveAura`.

This script encourages players to remain stationary for a certain duration to receive a beneficial buff. You can customize the buff ID and duration to suit your mod's gameplay mechanics.

## IsTabardDesigner
This method checks if the [Unit] is a tabard designer NPC. Tabard designers are special NPCs that allow players to create and customize their guild tabards.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the [Unit] is a tabard designer, `false` otherwise.

### Example Usage
This example demonstrates how to use the `IsTabardDesigner()` method to create a custom interaction with a tabard designer NPC. When a player interacts with the NPC, it will check if the player is in a guild. If the player is in a guild and is the guild leader, it will allow them to customize their guild tabard. If the player is not in a guild or is not the guild leader, it will display an appropriate message.

```typescript
const TABARD_DESIGNER_ENTRY = 28776;

const OnGossipHello: GossipHello = (event, player, object) => {
    if (object.IsTabardDesigner()) {
        if (player.IsInGuild()) {
            const guildId = player.GetGuildId();
            const guild = new Guild(guildId);

            if (player.GetGUID() === guild.GetLeaderGUID()) {
                // Player is the guild leader, allow them to customize the tabard
                player.GossipMenuAddItem(0, "Customize Guild Tabard", 0, 1);
                player.GossipSendMenu(DEFAULT_GOSSIP_MESSAGE, object.GetGUID());
            } else {
                // Player is not the guild leader
                player.GossipSetText("Only the guild leader can customize the guild tabard.");
                player.GossipSendMenu(DEFAULT_GOSSIP_MESSAGE, object.GetGUID());
            }
        } else {
            // Player is not in a guild
            player.GossipSetText("You must be in a guild to customize a tabard.");
            player.GossipSendMenu(DEFAULT_GOSSIP_MESSAGE, object.GetGUID());
        }
    } else {
        // Handle regular gossip for non-tabard designer NPCs
        player.GossipSetText("Hello, how can I assist you today?");
        player.GossipSendMenu(DEFAULT_GOSSIP_MESSAGE, object.GetGUID());
    }
};

RegisterGameObjectGossipEvent(TABARD_DESIGNER_ENTRY, GossipEvents.GOSSIP_EVENT_ON_HELLO, OnGossipHello);
```

In this example, when a player interacts with a tabard designer NPC, the script checks if the player is in a guild using `player.IsInGuild()`. If the player is in a guild, it retrieves the guild ID using `player.GetGuildId()` and creates a new `Guild` object. It then checks if the player is the guild leader by comparing the player's GUID with the guild leader's GUID using `player.GetGUID()` and `guild.GetLeaderGUID()`.

If the player is the guild leader, it adds a gossip menu item allowing them to customize the guild tabard. If the player is not the guild leader or is not in a guild, it displays an appropriate message using `player.GossipSetText()`.

Finally, it registers the `OnGossipHello` event for the tabard designer NPC entry using `RegisterGameObjectGossipEvent()`.

## IsTaxi
This method returns a boolean value indicating whether the [Unit](./unit.md) is a taxi master NPC or not.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is a taxi master, `false` otherwise.

### Example Usage
This example demonstrates how to create a custom taxi system that allows players to use a specific item to unlock special taxi routes.

```typescript
// Item entry for the special taxi unlock item
const TAXI_UNLOCK_ITEM_ENTRY = 12345;

// Function to handle gossip select for taxi master
function onGossipSelect(event: number, player: Player, creature: Creature, sender: GossipSender, action: number, code: string): void {
    if (creature.IsTaxi()) {
        if (action === 0) {
            // Check if the player has the special taxi unlock item
            if (player.HasItem(TAXI_UNLOCK_ITEM_ENTRY)) {
                // Enable special taxi routes for the player
                player.EnableTaxiNode(1234);
                player.EnableTaxiNode(5678);
                player.SendBroadcastMessage("Special taxi routes unlocked!");
            } else {
                player.SendBroadcastMessage("You need the special taxi unlock item to access these routes.");
            }
            player.GossipComplete();
        } else {
            // Handle regular taxi functionality
            player.SendTaxiMenu(creature.GetGUID());
        }
    } else {
        // Handle other gossip options for non-taxi master creatures
        // ...
    }
}

// Register the gossip select event
RegisterCreatureGossipEvent(NPC_ENTRY, 1, onGossipSelect);
```

In this example:
1. We define a constant `TAXI_UNLOCK_ITEM_ENTRY` to represent the item entry for the special taxi unlock item.

2. Inside the `onGossipSelect` function, we check if the creature is a taxi master using the `IsTaxi()` method.

3. If the creature is a taxi master and the selected gossip action is 0 (assuming it corresponds to the special taxi option), we check if the player has the special taxi unlock item using `player.HasItem(TAXI_UNLOCK_ITEM_ENTRY)`.

4. If the player has the item, we enable specific taxi nodes using `player.EnableTaxiNode()` and send a broadcast message to the player indicating that the special routes are unlocked.

5. If the player doesn't have the item, we send a message informing them that they need the special item to access the routes.

6. If the selected gossip action is not 0, we assume it corresponds to regular taxi functionality and send the taxi menu to the player using `player.SendTaxiMenu(creature.GetGUID())`.

7. If the creature is not a taxi master, we handle other gossip options accordingly.

8. Finally, we register the gossip select event for the specific NPC entry using `RegisterCreatureGossipEvent()`.

This example showcases how the `IsTaxi()` method can be used in conjunction with other Eluna methods and game logic to create a custom taxi system with special unlock requirements.

## IsTrainer
This method returns true if the [Unit](./unit.md) is a trainer, false otherwise.  This can be helpful to create custom trainer interactions, or check if a unit should have trainer capabilities. 

### Parameters
None

### Returns
boolean: Returns true if the unit is a trainer.

### Example Usage
Create an interaction with an NPC that will train the player if the unit is a trainer.  If not a trainer, give a custom message. 
```typescript
const TALK_TRAINER: action_on_gossip_hello = (player: Player, unit: Unit) => {
  if(unit.IsTrainer()) {
    player.SendTrainerList(unit);
    return;
  }
  else {
    const message = `I am ${unit.GetName()}, not a trainer.  Did you need something else?`;

    switch(unit.GetEntry()) {
      case 1234: // Innkeeper 
        player.GossipMenuAddItem(GossipIcon.Accept, "I'd like to browse your goods", 0, 0);
        player.GossipMenuAddItem(GossipIcon.Accept, "I require a bed for the night", 0, 1);
        break;
      case 4321: // Stable Master
        player.GossipMenuAddItem(GossipIcon.Taxi, "I'd like to stable my pet", 0, 5);
        player.GossipMenuAddItem(GossipIcon.Interact_1, "Do you have any pets for sale?", 0, 6);
        break;
    }
    player.GossipSendTextMenu(unit, message);
  }
}

const HANDLE_TRAINER_GOODBYE: action_on_gossip_select = (player: Player, unit: Unit, menuId: number, gossipListId: number) => {
  if(menuId == 0 && gossipListId == 0) {
    player.SendListInventory(unit);
    player.GossipComplete();
    return;
  }

  player.GossipComplete();
}

RegisterUnitGossipEvent(0, 1234, TALK_TRAINER);
RegisterUnitGossipEvent(0, 4321, TALK_TRAINER);
RegisterUnitGossipSelectEvent(0, HANDLE_TRAINER_GOODBYE);
```

## IsUnderWater
This method checks if the unit is currently underwater. It can be useful for applying special effects, modifying abilities, or triggering events when a unit enters or leaves water.

### Parameters
This method does not take any parameters.

### Returns
boolean - Returns `true` if the unit is underwater, `false` otherwise.

### Example Usage
In this example, we'll create a script that applies a periodic damage effect to players while they are underwater, simulating drowning damage.

```typescript
const DROWNING_DAMAGE_SPELL_ID = 37284; // Spell ID for periodic drowning damage
const DROWNING_DAMAGE_INTERVAL = 2000; // Interval in milliseconds between each damage tick

let drowningPlayers: Map<number, number> = new Map(); // Map to store player GUIDs and their periodic damage timer IDs

const OnPlayerUpdate: player_event_on_update = (event: number, player: Player): void => {
    if (player.IsUnderWater()) {
        if (!drowningPlayers.has(player.GetGUID())) {
            // Player is underwater and not already taking drowning damage
            const timerId = player.RegisterTimedEvent(DROWNING_DAMAGE_INTERVAL, 0, () => {
                player.CastSpell(player, DROWNING_DAMAGE_SPELL_ID, true);
            });
            drowningPlayers.set(player.GetGUID(), timerId);
        }
    } else {
        if (drowningPlayers.has(player.GetGUID())) {
            // Player is no longer underwater, remove the periodic damage
            const timerId = drowningPlayers.get(player.GetGUID());
            player.RemoveTimedEvent(timerId);
            drowningPlayers.delete(player.GetGUID());
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => OnPlayerUpdate(...args));
```

In this script:
1. We define constants for the drowning damage spell ID and the interval between each damage tick.
2. We create a `Map` called `drowningPlayers` to store player GUIDs and their associated periodic damage timer IDs.
3. In the `OnPlayerUpdate` event, we check if the player is underwater using `player.IsUnderWater()`.
4. If the player is underwater and not already taking drowning damage (not present in the `drowningPlayers` map), we register a timed event using `player.RegisterTimedEvent()` to periodically apply the drowning damage spell to the player. We store the timer ID in the `drowningPlayers` map.
5. If the player is no longer underwater and has an active drowning damage timer (present in the `drowningPlayers` map), we remove the timed event using `player.RemoveTimedEvent()` and remove the player from the `drowningPlayers` map.
6. Finally, we register the `OnPlayerUpdate` event using `RegisterPlayerEvent()` to continuously monitor the player's underwater status and apply or remove the drowning damage accordingly.

This script demonstrates how the `IsUnderWater()` method can be used to create dynamic gameplay elements based on the unit's position relative to water.

## IsVendor
Returns true if the unit is a vendor NPC.

### Parameters
None

### Returns
boolean - Returns `true` if the unit is a vendor, `false` otherwise.

### Example Usage
Create a script that allows players to access a vendor's inventory by targeting them and using a custom command.

```typescript
// Custom chat command `.vendor` to open targeted vendor's inventory
const vendorCommand: player_event_on_command = (event: number, player: Player, command: string): void => {
    if (command !== 'vendor') {
        return;
    }

    const target = player.GetSelection();
    if (!target || !target.IsVendor()) {
        player.SendBroadcastMessage('You must target a vendor NPC to use this command.');
        return;
    }

    // Open the vendor's inventory for the player
    player.SendVendorWindow(target);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => vendorCommand(...args));
```

In this example, we create a custom chat command `.vendor` that players can use to access a vendor's inventory. When the command is executed, the script performs the following steps:

1. Check if the command is `.vendor`. If not, return early.
2. Get the player's currently selected target using `player.GetSelection()`.
3. Check if the target exists and is a vendor using `target.IsVendor()`. If either condition is false, send an error message to the player and return early.
4. If the target is a valid vendor, open the vendor's inventory window for the player using `player.SendVendorWindow(target)`.

This script allows players to quickly access a vendor's inventory by targeting the vendor NPC and using the `.vendor` command. It demonstrates the usage of the `IsVendor()` method to check if the targeted unit is a vendor before attempting to open the vendor window.

## Kill
Makes the [Unit] kill the target [Unit]. This will cause the target to die and the [Unit] to perform a killing blow animation if possible.

### Parameters
* target: [Unit](./unit.md) - The [Unit] to kill
* durLoss?: boolean - Optional parameter to determine if the target's items suffer durability loss. Defaults to 'true' if not provided.

### Example Usage
In this example, we register an event that checks if a player kills a specific creature. If the creature is killed, it will respawn after 30 seconds and broadcast a message to the entire server.

```typescript
const CREATURE_ENTRY = 1234;
const RESPAWN_DELAY = 30000; // 30 seconds

const onCreatureKill: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        creature.Respawn(RESPAWN_DELAY);
        SendServerMessage(`${creature.GetName()} has been slain by ${player.GetName()}! It will respawn in 30 seconds.`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => onCreatureKill(...args));
```

In this more advanced example, we create a script that allows players to challenge each other to a duel. When a player wins the duel, the losing player is killed without durability loss, and the winner is restored to full health and mana.

```typescript
let activeDuel: [Player, Player] | null = null;

const startDuel = (player1: Player, player2: Player) => {
    activeDuel = [player1, player2];
    player1.SetFaction(1); // Set players to hostile factions
    player2.SetFaction(2);
    SendBroadcastMessage(`A duel has started between ${player1.GetName()} and ${player2.GetName()}!`);
};

const endDuel = (winner: Player, loser: Player) => {
    winner.Kill(loser, false); // Kill the losing player without durability loss
    winner.SetHealth(winner.GetMaxHealth()); // Restore the winner's health
    winner.SetPower(PowerType.POWER_MANA, winner.GetMaxPower(PowerType.POWER_MANA)); // Restore the winner's mana
    winner.SetFaction(35); // Reset player factions to friendly
    loser.SetFaction(35);
    activeDuel = null;
    SendBroadcastMessage(`${winner.GetName()} has won the duel against ${loser.GetName()}!`);
};

const onChatCommand: player_event_on_command = (event: number, player: Player, command: string, args: string) => {
    if (command === "duel" && args) {
        const target = GetPlayerByName(args);
        if (target && target.IsInWorld() && target.GetDistance(player) <= 10) {
            if (!activeDuel) {
                startDuel(player, target);
            } else {
                player.SendBroadcastMessage("A duel is already in progress. Please wait for it to finish.");
            }
        } else {
            player.SendBroadcastMessage("Player not found or too far away.");
        }
    }
};

const onPlayerDeath: player_event_on_death = (event: number, player: Player) => {
    if (activeDuel && (activeDuel[0] === player || activeDuel[1] === player)) {
        const [player1, player2] = activeDuel;
        endDuel(player1 === player ? player2 : player1, player);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => onChatCommand(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => onPlayerDeath(...args));
```

## ModifyPower
Modifies the [Unit]'s power amount for the given power type. The power types are defined in an enum called `Powers`.

### Parameters
* amount: number - The amount to modify the power by. Positive values will increase the power, while negative values will decrease it.
* type: number - The type of power to modify. This should be one of the values from the `Powers` enum.

### Example Usage
In this example, we'll create a script that modifies a player's power based on the type of creature they kill.

```typescript
const CreatureKillPower: player_event_on_kill_creature = (event: number, player: Player, creature: Creature) => {
    const creatureEntry = creature.GetEntry();

    switch (creatureEntry) {
        case 1234: // Mana-infused Creature
            player.ModifyPower(100, Powers.POWER_MANA);
            player.SendBroadcastMessage("You feel a surge of mana as you defeat the mana-infused creature!");
            break;
        case 5678: // Rage-inducing Creature
            player.ModifyPower(50, Powers.POWER_RAGE);
            player.SendBroadcastMessage("Your rage builds as you slay the enraging creature!");
            break;
        case 9012: // Focus-enhancing Creature
            player.ModifyPower(75, Powers.POWER_FOCUS);
            player.SendBroadcastMessage("Your focus sharpens after defeating the elusive creature!");
            break;
        default:
            // No power modification for other creatures
            break;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_CREATURE, (...args) => CreatureKillPower(...args));
```

In this script, we register a `PLAYER_EVENT_ON_KILL_CREATURE` event handler. When a player kills a creature, the `CreatureKillPower` function is called.

Inside the function, we check the entry of the killed creature using `creature.GetEntry()`. Based on the creature's entry, we modify the player's power using `player.ModifyPower()`.

- If the creature entry is `1234`, we assume it's a mana-infused creature. We increase the player's mana by 100 points using `player.ModifyPower(100, Powers.POWER_MANA)`.
- If the creature entry is `5678`, we consider it a rage-inducing creature. We increase the player's rage by 50 points using `player.ModifyPower(50, Powers.POWER_RAGE)`.
- If the creature entry is `9012`, we treat it as a focus-enhancing creature. We increase the player's focus by 75 points using `player.ModifyPower(75, Powers.POWER_FOCUS)`.

After modifying the power, we send a broadcast message to the player using `player.SendBroadcastMessage()` to inform them about the power modification.

This script demonstrates how you can use the `ModifyPower` method to dynamically adjust a player's power based on the type of creature they defeat, providing a more engaging and interactive gameplay experience.

## Mount
This method allows you to mount the Unit on a specified displayID or modelID. When a Unit is mounted, it will display the model associated with the given displayID/modelID.

### Parameters
* displayId: number - The displayID or modelID of the mount to be used.

### Example Usage
Here's an example of how to use the `Mount` method to create a script that allows players to mount a specific creature when they interact with it:

```typescript
const MOUNT_DISPLAY_ID = 6471; // Display ID of the mount (e.g., Black Qiraji Battle Tank)
const MOUNT_SPELL_ID = 25953; // Spell ID of the mount ability (e.g., Charm of Swift Flight)

const onGossipHello: gossip_event_on_hello = (event: number, player: Player, creature: Creature) => {
    player.GossipMenuAddItem(0, "Mount the creature", 0, 1);
    player.GossipSendMenu(1, creature, 0);
};

const onGossipSelect: gossip_event_on_select = (event: number, player: Player, creature: Creature, sender: number, intid: number) => {
    if (intid === 1) {
        if (!player.HasSpell(MOUNT_SPELL_ID)) {
            player.LearnSpell(MOUNT_SPELL_ID);
        }

        if (!creature.IsMounted()) {
            creature.Mount(MOUNT_DISPLAY_ID);
            creature.SetSpeed(UnitMoveType.MOVE_RUN, 2.0);
            creature.SetFlag(UnitFields.UNIT_FIELD_FLAGS, UnitFlags.UNIT_FLAG_PLAYER_CONTROLLED);
            creature.SetControlled(true, UnitControlTypes.UNIT_CONTROL_PLAYER);
            creature.SetOwnerGUID(player.GetGUID());

            player.EnterVehicle(creature, 0);
        }

        player.GossipComplete();
    }
};

RegisterCreatureGossipEvent(CREATURE_ENTRY, GossipEvents.GOSSIP_EVENT_ON_HELLO, (...args) => onGossipHello(...args));
RegisterCreatureGossipEvent(CREATURE_ENTRY, GossipEvents.GOSSIP_EVENT_ON_SELECT, (...args) => onGossipSelect(...args));
```

In this example:
1. When a player interacts with the specified creature, a gossip menu is displayed with the option to mount the creature.
2. If the player selects the mount option, the script checks if the player has the required mount ability spell. If not, it learns the spell.
3. If the creature is not already mounted, the script mounts the creature using the specified display ID.
4. The creature's speed is increased, and it is set to be player-controlled.
5. The player enters the vehicle (mount) on the creature.

Note: Make sure to replace `CREATURE_ENTRY` with the actual entry ID of the creature you want to use for mounting.

This example demonstrates how the `Mount` method can be used in combination with other methods and events to create an interactive mounting system in your mod.

## MoveChase
The `MoveChase` method allows the [Unit] to chase a target [Unit] while maintaining a specified distance and angle relative to the target.

### Parameters
* target: [Unit](./unit.md) - The target [Unit] to chase.
* dist: number (optional) - The distance to maintain between the [Unit] and the target. Default value is 0.
* angle: number (optional) - The angle in radians to maintain relative to the target. Default value is 0.

### Example Usage
In this example, we create an AI script for a creature that chases a random player within a certain range until the player is caught or the creature loses sight of the player.

```typescript
const CHASE_RANGE = 30; // The maximum range to start chasing a player
const CATCH_DISTANCE = 2; // The distance at which the creature catches the player

const onUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    if (!creature.IsInCombat() && !creature.HasAura(STUN_AURA)) {
        const nearestPlayer = creature.GetNearestPlayer(CHASE_RANGE);

        if (nearestPlayer) {
            creature.MoveChase(nearestPlayer, CATCH_DISTANCE);

            const distance = creature.GetDistance(nearestPlayer);
            if (distance <= CATCH_DISTANCE) {
                creature.CastSpell(nearestPlayer, STUN_SPELL, true);
                creature.DealDamage(nearestPlayer, nearestPlayer.GetHealth() * 0.2, true);
                creature.MonsterSay("Caught you!", LANG_UNIVERSAL, nearestPlayer);
            }
        } else {
            creature.MoveRandomPosition(CHASE_RANGE);
        }
    }
}

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => onUpdate(...args));
```

In this script:
1. We define constants for the maximum chase range and catch distance.
2. In the `onUpdate` event, we check if the creature is not in combat and not stunned.
3. We use `GetNearestPlayer` to find the nearest player within the `CHASE_RANGE`.
4. If a player is found, we use `MoveChase` to make the creature chase the player, maintaining the specified `CATCH_DISTANCE`.
5. We calculate the distance between the creature and the player using `GetDistance`.
6. If the distance is less than or equal to the `CATCH_DISTANCE`, the creature catches the player:
   - The creature casts a stun spell on the player using `CastSpell`.
   - The creature deals 20% of the player's health as damage using `DealDamage`.
   - The creature says "Caught you!" to the player using `MonsterSay`.
7. If no player is found within the chase range, the creature moves to a random position within the `CHASE_RANGE` using `MoveRandomPosition`.

This script demonstrates how the `MoveChase` method can be used in combination with other methods and events to create engaging AI behavior for creatures in the game.

## MoveClear
Clears the unit's movement and stops them from moving. Optionally resets the unit's movement to their original position.

### Parameters
* reset: boolean (optional) - If 'true', the unit's movement will be reset to their original position. Default: 'false'

### Example Usage
Freeze a creature in place and prevent them from moving until attacked.
```typescript
let AGGRESSIVE_CREATURE_ENTRY = 1234;
let AGGRESSIVE_AURA = 5678;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === AGGRESSIVE_CREATURE_ENTRY) {
        // Stop the creature from moving
        creature.MoveClear();

        // Set the creature as unattackable
        creature.SetUInt32Value(UnitFields.UNIT_FIELD_FLAGS, 0x02);

        // Add an aura that forces the creature to stand still
        creature.AddAura(AGGRESSIVE_AURA, creature);

        // Register an event to allow the creature to move and attack when attacked
        RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_DAMAGE_TAKEN, (event: number, creature: Creature, attacker: Unit) => {
            if (creature.GetEntry() === AGGRESSIVE_CREATURE_ENTRY) {
                // Allow the creature to move again
                creature.MoveClear(true);

                // Remove the unattackable flag
                creature.SetUInt32Value(UnitFields.UNIT_FIELD_FLAGS, 0x00);

                // Remove the aura that forces the creature to stand still
                creature.RemoveAura(AGGRESSIVE_AURA);

                // Force the creature to attack the player
                creature.AttackStart(attacker);
            }
        });
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example, when a specific aggressive creature spawns, it is immediately frozen in place and made unattackable. An aura is applied to the creature to visually indicate that it is not moving. When the creature takes damage from an attacker, the `MoveClear` method is called with `reset` set to `true`, which allows the creature to move again. The unattackable flag and aura are removed, and the creature is forced to attack the player who attacked it.

This script could be used to create a more challenging encounter where the player must strategically attack the creature to unfreeze it and engage in combat, rather than the creature immediately attacking on spawn.

## MoveConfused
This method will cause the [Unit] to move in a confused state for a short period of time. The unit will move erratically in random directions for a few seconds.

### Parameters
None

### Returns
None

### Example Usage
Here's an example of how to use `MoveConfused` in a script that causes all nearby enemy units to become confused when a player dies:

```typescript
const CONFUSION_RADIUS = 10; // Radius in yards around the player to confuse units

const OnPlayerDeath: player_event_on_death = (event: number, player: Player, killer: Unit) => {
    // Get all enemy units within the specified radius of the player
    const nearbyUnits = player.GetUnitsInRange(CONFUSION_RADIUS, 0, true);

    // Loop through each nearby unit
    for (const unit of nearbyUnits) {
        // Skip dead or confused units
        if (unit.IsDead() || unit.HasAura(14821)) {
            continue;
        }

        // Randomly decide whether to confuse the unit (50% chance)
        if (Math.random() < 0.5) {
            unit.MoveConfused();
            
            // Also apply a confusion spell visual for added effect
            unit.CastSpell(unit, 14821, true);

            // Optionally, make the unit say a confused emote
            unit.SendUnitEmote("looks confused!", 0);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_DEATH, (...args) => OnPlayerDeath(...args));
```

In this example, when a player dies, the script will find all nearby enemy units within a radius of 10 yards. For each unit, there is a 50% chance that it will be forced to move in a confused state using `MoveConfused()`. 

To enhance the effect, the script also applies a confusion spell visual to the unit using `CastSpell()` and makes the unit display a confused emote using `SendUnitEmote()`.

This script can add some interesting and chaotic behavior to combat encounters, especially if there are many enemies near the player when they die. The confusion effect can temporarily disrupt enemy formations and create openings for other players to exploit.

## MoveExpire
This method expires the [Unit]'s current movement and clears the movement generator. Optionally, you can reset the movement generator to its default state.

### Parameters
* reset (optional): boolean - If 'true', the movement generator will be reset to its default state. Default is 'false'.

### Example Usage
In this example, we create a script that expires a creature's movement and resets its movement generator when it reaches a certain health threshold. This can be useful for creating more dynamic and challenging encounters.

```typescript
const CREATURE_ENTRY = 1234;
const HEALTH_THRESHOLD = 30;

const OnCreatureHealthChanged: creature_event_on_health_change = (event: number, creature: Creature, attacker: Unit) => {
    const healthPercent = creature.GetHealthPct();

    if (healthPercent <= HEALTH_THRESHOLD) {
        // Expire the creature's current movement
        creature.MoveExpire(true);

        // Set the creature to evade mode
        creature.SetEvadeMode();

        // Move the creature to a specific position
        const x = 100.0;
        const y = 200.0;
        const z = 50.0;
        const o = 0.0;
        creature.MoveTo(x, y, z, o);

        // Make the creature say something
        creature.Say("I will not be defeated so easily!", 0);

        // Reset the creature's health
        creature.SetHealth(creature.GetMaxHealth());

        // Remove the creature from combat
        creature.ClearInCombat();

        // Despawn the creature after 5 seconds
        creature.DespawnOrUnsummon(5000);
    }
};

RegisterCreatureEvent(CREATURE_ENTRY, CreatureEvents.CREATURE_EVENT_ON_HEALTH_CHANGE, OnCreatureHealthChanged);
```

In this script:
1. We define the creature entry and the health threshold at which the script will trigger.
2. When the creature's health changes, we check if its current health percentage is below or equal to the threshold.
3. If the condition is met, we expire the creature's current movement and reset its movement generator using `creature.MoveExpire(true)`.
4. We set the creature to evade mode using `creature.SetEvadeMode()`.
5. We move the creature to a specific position using `creature.MoveTo(x, y, z, o)`.
6. We make the creature say something using `creature.Say()`.
7. We reset the creature's health to its maximum value using `creature.SetHealth(creature.GetMaxHealth())`.
8. We remove the creature from combat using `creature.ClearInCombat()`.
9. Finally, we despawn the creature after 5 seconds using `creature.DespawnOrUnsummon(5000)`.

This script showcases how the `MoveExpire()` method can be used in combination with other methods to create more engaging and dynamic creature encounters.

## MoveFleeing
The `MoveFleeing` method causes the [Unit](./unit.md) to flee from the specified target for a given duration. If no duration is provided, the default fleeing time will be used.

### Parameters
* target: [Unit](./unit.md) - The target [Unit](./unit.md) to flee from.
* time: number (optional) - The duration in milliseconds for which the [Unit](./unit.md) will flee. If not specified, the default fleeing time will be used.

### Example Usage
In this example, we create a script that causes a creature to flee from a player when the player gets too close. If the player remains within a certain range of the creature for more than 5 seconds, the creature will start fleeing for 10 seconds.

```typescript
const FLEE_DISTANCE = 10; // Distance in yards at which the creature starts fleeing
const FLEE_DURATION = 10000; // Fleeing duration in milliseconds (10 seconds)
const CHECK_INTERVAL = 5000; // Check interval in milliseconds (5 seconds)

let lastCheckTime = 0;

const onCreatureUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    const now = GetTime();

    if (now - lastCheckTime >= CHECK_INTERVAL) {
        lastCheckTime = now;

        const nearestPlayer = creature.GetNearestPlayer(FLEE_DISTANCE);

        if (nearestPlayer) {
            creature.MoveFleeing(nearestPlayer, FLEE_DURATION);
            creature.SendUnitSay("I must flee from this dangerous player!", 0);
        }
    }
};

RegisterCreatureEvent(CreatureEntry, CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => onCreatureUpdate(...args));
```

In this script:
1. We define constants for the flee distance, flee duration, and check interval.
2. We initialize a variable `lastCheckTime` to keep track of the last time we checked for nearby players.
3. In the `onCreatureUpdate` event, we check if the specified check interval has passed since the last check.
4. If the check interval has passed, we update `lastCheckTime` and use the `GetNearestPlayer` method to find the nearest player within the flee distance.
5. If a nearby player is found, we call the `MoveFleeing` method on the creature, passing the nearest player as the target and the specified flee duration.
6. We also make the creature say a message using `SendUnitSay` to indicate that it is fleeing from the player.
7. Finally, we register the `onCreatureUpdate` event for the specific creature entry using `RegisterCreatureEvent`.

This script ensures that the creature starts fleeing when a player gets too close and continues fleeing for the specified duration. The creature will only start fleeing again if the player remains within the flee distance for more than the check interval.

## MoveFollow
Makes the [Unit] follow the specified target unit, maintaining a specified distance and angle relative to the target.

### Parameters
* target: [Unit](./unit.md) - The target unit to follow
* dist: number (optional) - The distance to maintain from the target unit (default: 0)
* angle: number (optional) - The angle in radians to maintain relative to the target unit (default: 0)

### Example Usage
Create an NPC that follows the player, assisting in combat and providing buffs.
```typescript
const FOLLOW_DISTANCE = 3;
const FOLLOW_ANGLE = 0;

const onGossipHello: gossip_event_on_hello = (event: number, player: Player, object: GameObject) => {
    const followerNPC = object.ToCreature();
    if (!followerNPC) {
        return;
    }

    followerNPC.SetFaction(player.GetFaction());
    followerNPC.SetLevel(player.GetLevel());
    followerNPC.SetMaxHealth(player.GetMaxHealth() * 0.8);
    followerNPC.SetHealth(followerNPC.GetMaxHealth());
    followerNPC.SetMana(followerNPC.GetMaxMana());

    const onCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit) => {
        creature.MoveFollow(player, FOLLOW_DISTANCE, FOLLOW_ANGLE);
    };

    const onLeaveCombat: creature_event_on_leave_combat = (event: number, creature: Creature) => {
        creature.MoveFollow(player, FOLLOW_DISTANCE, FOLLOW_ANGLE);
    };

    RegisterCreatureEvent(followerNPC.GetEntry(), CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, onCombat);
    RegisterCreatureEvent(followerNPC.GetEntry(), CreatureEvents.CREATURE_EVENT_ON_LEAVE_COMBAT, onLeaveCombat);

    followerNPC.MoveFollow(player, FOLLOW_DISTANCE, FOLLOW_ANGLE);
};

const onGossipSelect: gossip_event_on_select = (event: number, player: Player, object: GameObject, sender: number, code: number, menu: string) => {
    // Handle gossip menu actions
};

RegisterGameObjectGossipEvent(GO_ENTRY, GossipEvents.GOSSIP_EVENT_ON_HELLO, onGossipHello);
RegisterGameObjectGossipEvent(GO_ENTRY, GossipEvents.GOSSIP_EVENT_ON_SELECT, onGossipSelect);
```
In this example, when a player interacts with a specific game object (GO_ENTRY), the `onGossipHello` event is triggered. The script retrieves the creature associated with the game object and sets up the follower NPC.

The follower NPC's faction, level, health, and mana are adjusted based on the player's stats. Event handlers are registered for the follower NPC's enter combat and leave combat events. In both cases, the follower NPC is instructed to follow the player using `MoveFollow` with the specified distance and angle.

The follower NPC will assist the player in combat and maintain the specified distance and angle relative to the player. Additional functionality, such as providing buffs or handling gossip menu actions, can be added as needed.

## MoveHome
This method will cause the [Unit] to move back to its original home location. The home location is set based on the spawn location from the database for the creature. 

### Parameters
None

### Returns
None

### Example Usage
In this example, we have a world boss that will target a random player in the raid and chase them down for 30 seconds. After the 30 seconds, the boss will retreat to its home location to begin a new phase of the fight.

```typescript
const BOSS_ENTRY = 500000;
const CHASE_PHASE_DURATION = 30000;

const StartChasePhase = (boss: Unit) => {
    const players = boss.GetPlayersInRange(100);
    if (players.length > 0) {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        boss.MoveTo(randomPlayer.GetX(), randomPlayer.GetY(), randomPlayer.GetZ());

        boss.RegisterEvent(() => {
            boss.MoveHome();
            StartNewPhase(boss);
        }, CHASE_PHASE_DURATION);
    }
}

const StartNewPhase = (boss: Unit) => {
    // Begin a new phase of the fight
    // ...
}

const OnBossSpawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        StartChasePhase(creature);
    }
}

RegisterServerEvent(ServerEvents.CREATURE_ON_SPAWN, (...args) => OnBossSpawn(...args));
```

In this script, when the boss creature spawns, it will start the chase phase by selecting a random player within 100 yards and moving towards their location. After 30 seconds (defined by `CHASE_PHASE_DURATION`), the boss will use `MoveHome()` to return to its original spawn location and then start a new phase of the fight using the `StartNewPhase` function.

This example demonstrates how `MoveHome()` can be used in conjunction with other methods and events to create dynamic and interesting encounter mechanics in your mod.

## MoveIdle
This method will cause the [Unit] to enter an idle state and stop moving. The unit will remain idle until it receives new movement orders or is engaged in combat.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any values.

### Example Usage
In this example, we'll create a script that forces all creatures in a certain radius around the player to become idle when the player enters the world. This could be useful for setting up a safe zone or a non-combat area.

```typescript
const IDLE_RADIUS = 30; // The radius in yards around the player in which creatures will be made idle

const OnPlayerEnterWorld: player_event_on_enter_world = (event: number, player: Player) => {
    // Get all creatures in the specified radius around the player
    const creatures = player.GetCreaturesInRange(IDLE_RADIUS);

    // Loop through each creature and make it idle
    for (const creature of creatures) {
        creature.MoveIdle();
        
        // Optionally, we can also clear the creature's threat list to ensure it doesn't engage in combat
        creature.ClearThreatList();
        
        // We can also set the creature's movement type to idle to prevent it from resuming its default movement
        creature.SetMovementType(0); // 0 corresponds to IDLE_MOTION_TYPE
    }
    
    // Inform the player about what happened
    player.SendBroadcastMessage(`All creatures within ${IDLE_RADIUS} yards have been made idle.`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_WORLD, (...args) => OnPlayerEnterWorld(...args));
```

In this script:
1. We define a constant `IDLE_RADIUS` to specify the radius around the player in which creatures will be made idle.
2. In the `OnPlayerEnterWorld` event, we get all creatures within the specified radius using `player.GetCreaturesInRange(IDLE_RADIUS)`.
3. We loop through each creature and call `creature.MoveIdle()` to make it idle.
4. Optionally, we also clear the creature's threat list using `creature.ClearThreatList()` to ensure it doesn't engage in combat even if it was previously threatened.
5. We set the creature's movement type to idle (`IDLE_MOTION_TYPE`) using `creature.SetMovementType(0)` to prevent it from resuming its default movement.
6. Finally, we inform the player about what happened by sending a broadcast message using `player.SendBroadcastMessage()`.

This script showcases a practical use case for the `MoveIdle()` method, demonstrating how it can be used in combination with other methods to create a specific game mechanic or behavior.

## MoveJump
Makes the Unit jump to the specified coordinates with the given speed and maximum height. This method can be used to create dynamic movement or jumping effects for units, such as making a boss leap to a specific location during an encounter or having a creature jump across gaps or obstacles.

### Parameters
- x: number - The destination X coordinate.
- y: number - The destination Y coordinate.
- z: number - The destination Z coordinate.
- zSpeed: number - The speed of the vertical (Z) movement during the jump.
- maxHeight: number - The maximum height the Unit will reach during the jump.
- id: number (optional) - The spline ID for the jump movement. If not provided, a default value will be used.

### Example Usage
In this example, we create a world event script that makes a boss creature jump to a random player's position every 30 seconds.

```typescript
const BOSS_ENTRY = 12345;
const JUMP_INTERVAL = 30000; // 30 seconds

const BossJumpEvent: world_event_on_update = (event: number, diff: number) => {
    const boss = GetWorldObject(BOSS_ENTRY);
    if (!boss || boss.GetTypeId() !== ObjectType.UNIT) {
        return;
    }

    const players = boss.GetPlayersInRange(100);
    if (players.length === 0) {
        return;
    }

    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    const playerPosition = randomPlayer.GetLocation();

    boss.MoveJump(playerPosition.x, playerPosition.y, playerPosition.z, 10, 5);
};

RegisterWorldEvent(WorldEvents.WORLD_EVENT_ON_UPDATE, (...args) => BossJumpEvent(...args));

let jumpTimerId: number | null = null;

const StartJumpTimer = () => {
    if (jumpTimerId) {
        return;
    }

    jumpTimerId = CreateTimer(JUMP_INTERVAL, () => {
        BossJumpEvent(0, 0);
    }, 0, JUMP_INTERVAL);
};

const StopJumpTimer = () => {
    if (!jumpTimerId) {
        return;
    }

    DestroyTimer(jumpTimerId);
    jumpTimerId = null;
};

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_CREATURE_SPAWN, (entry: number) => {
    if (entry === BOSS_ENTRY) {
        StartJumpTimer();
    }
});

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_CREATURE_DESPAWN, (entry: number) => {
    if (entry === BOSS_ENTRY) {
        StopJumpTimer();
    }
});
```

In this script, we define a world event that runs every game tick (WORLD_EVENT_ON_UPDATE). When the event is triggered, we check if the boss creature exists and if there are any players within a 100-yard range. If both conditions are met, we randomly select a player and make the boss jump to their position using the `MoveJump` method.

We also set up a timer that triggers the jump event every 30 seconds using the `CreateTimer` function. The timer is started when the boss creature spawns (SERVER_EVENT_ON_CREATURE_SPAWN) and stopped when the boss despawns (SERVER_EVENT_ON_CREATURE_DESPAWN).

This example demonstrates how the `MoveJump` method can be used to create dynamic and engaging encounters by making creatures jump to specific locations or player positions during combat.

## MoveRandom
The `MoveRandom` method causes the [Unit](./unit.md) to move in a random direction within a specified radius. This can be useful for simulating wandering behavior or adding unpredictability to NPC movement patterns.

### Parameters
* radius: number - The maximum distance the unit can move from its current position.

### Example Usage
Here's an example of how to use the `MoveRandom` method to create a wandering NPC that moves randomly every 5 seconds within a 20-yard radius:

```typescript
const WANDER_RADIUS = 20;
const WANDER_INTERVAL = 5000; // 5 seconds

const onCreatureUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number) => {
    creature.RegisterEvent(() => {
        creature.MoveRandom(WANDER_RADIUS);
    }, WANDER_INTERVAL);
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => onCreatureUpdate(...args));
```

In this example, we define constants for the wander radius and interval. Inside the `CREATURE_EVENT_ON_UPDATE` event, we register a new event using `creature.RegisterEvent`. This event will be triggered every `WANDER_INTERVAL` milliseconds (5 seconds in this case). When the event is triggered, the creature will move randomly within the specified `WANDER_RADIUS` using the `MoveRandom` method.

You can adjust the `WANDER_RADIUS` and `WANDER_INTERVAL` values to control the size of the wandering area and the frequency of random movements, respectively.

Note that the `MoveRandom` method only initiates the movement; it does not wait for the movement to complete before returning. If you need to perform actions after the movement is finished, you can use the `CREATURE_EVENT_ON_REACH_WP` event to detect when the creature has reached its destination.

### Tips
- Be cautious when using large radius values, as they may cause the unit to wander too far from its original position or into unintended areas.
- Consider combining `MoveRandom` with other movement methods, such as `MoveTo` or `MoveFollow`, to create more complex and realistic movement patterns.
- You can use the `creature.GetCurrentWaypointId()` method to determine the current waypoint of the creature after calling `MoveRandom`, which can be useful for implementing specific behaviors at certain locations.

By utilizing the `MoveRandom` method judiciously, you can add a sense of liveliness and unpredictability to the movement of units in your mod, enhancing the overall gameplay experience.

## MoveStop
Stops the unit's movement immediately. This method can be useful in various scenarios where you want to halt a unit's movement, such as when they enter a specific area, encounter a certain condition, or need to be stopped for any other reason.

### Parameters
This method does not take any parameters.

### Returns
This method does not return anything.

### Example Usage
Let's consider an example where you want to create a "freeze trap" that stops a unit's movement when they step on it. Here's how you can achieve this using the `MoveStop` method:

```typescript
const FREEZE_TRAP_ENTRY = 100001;
const FREEZE_TRAP_RADIUS = 5;
const FREEZE_DURATION = 5000; // 5 seconds

const OnAreaTrigger: map_event_on_area_trigger = (event: number, unit: Unit, areaTrigger: AreaTrigger) => {
    if (areaTrigger.GetEntry() === FREEZE_TRAP_ENTRY) {
        const trapX = areaTrigger.GetPositionX();
        const trapY = areaTrigger.GetPositionY();
        const trapZ = areaTrigger.GetPositionZ();

        if (unit.IsWithinDist3d(trapX, trapY, trapZ, FREEZE_TRAP_RADIUS)) {
            unit.MoveStop();
            unit.CastSpell(unit, 12544, true); // Cast "Frost Armor" visual effect
            unit.AddAura(45524, FREEZE_DURATION); // Apply "Chains of Ice" aura for the duration

            const timerId = CreateTimer(FREEZE_DURATION, () => {
                unit.RemoveAura(45524); // Remove the "Chains of Ice" aura after the duration
                DestroyTimer(timerId); // Clean up the timer
            });
        }
    }
};

RegisterMapEvent(MapEvents.MAP_EVENT_ON_AREA_TRIGGER, (...args) => OnAreaTrigger(...args));
```

In this example:
1. We define constants for the freeze trap entry, radius, and duration.
2. In the `OnAreaTrigger` event handler, we check if the triggered area trigger matches the freeze trap entry.
3. If a unit steps within the specified radius of the freeze trap, we stop their movement using `unit.MoveStop()`.
4. We then apply a visual effect (e.g., "Frost Armor") and an aura (e.g., "Chains of Ice") to the unit for the duration of the freeze effect.
5. We create a timer that removes the aura after the specified duration and cleans up the timer itself.

This script effectively creates a freeze trap that stops a unit's movement and applies a visual effect and aura when they step on it, immobilizing them for a certain duration.

Note: Make sure to replace the spell IDs and adjust the constants according to your specific requirements and the spells available in your Azeroth Core database.

## MoveTo
The `MoveTo` method allows you to move a unit to a specific location in the game world by providing the map ID and coordinates (x, y, z). You can also specify whether to generate a path for the unit to follow.

### Parameters
- `id`: number - The ID of the map where the unit should move to.
- `x`: number - The X-coordinate of the destination on the specified map.
- `y`: number - The Y-coordinate of the destination on the specified map.
- `z`: number - The Z-coordinate (height) of the destination on the specified map.
- `genPath` (optional): boolean - Determines whether to generate a path for the unit to follow. If set to `true`, the unit will find a path to the destination. If set to `false` or omitted, the unit will move directly to the destination without pathfinding.

### Example Usage
Moving a creature to a specific location with pathfinding:
```typescript
const STORMWIND_MAP_ID = 0;
const STORMWIND_X = -8913.23;
const STORMWIND_Y = 554.633;
const STORMWIND_Z = 93.7944;

const MoveCreatureToStormwind: creature_event_on_spawn = (event: number, creature: Creature) => {
    // Move the creature to Stormwind with pathfinding
    creature.MoveTo(STORMWIND_MAP_ID, STORMWIND_X, STORMWIND_Y, STORMWIND_Z, true);
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => MoveCreatureToStormwind(...args));
```

Teleporting a player to a random location within a certain range:
```typescript
const TELEPORT_RANGE = 10;

const RandomTeleportPlayer: player_event_on_login = (event: number, player: Player) => {
    const mapId = player.GetMapId();
    const x = player.GetX();
    const y = player.GetY();
    const z = player.GetZ();

    // Generate random coordinates within the specified range
    const randomX = x + Math.random() * TELEPORT_RANGE * (Math.random() < 0.5 ? -1 : 1);
    const randomY = y + Math.random() * TELEPORT_RANGE * (Math.random() < 0.5 ? -1 : 1);

    // Teleport the player to the random location without pathfinding
    player.MoveTo(mapId, randomX, randomY, z);

    // Send a message to the player
    player.SendBroadcastMessage(`You have been teleported to a random location within ${TELEPORT_RANGE} yards!`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => RandomTeleportPlayer(...args));
```

In the first example, we register a creature event that triggers when a creature spawns. When the event is triggered, we use the `MoveTo` method to move the creature to a specific location in Stormwind, specifying the map ID and coordinates. We set `genPath` to `true` to ensure the creature follows a path to the destination.

In the second example, we register a player event that triggers when a player logs in. We generate random coordinates within a specified range (`TELEPORT_RANGE`) based on the player's current location. We then use the `MoveTo` method to teleport the player to the random location without pathfinding. Finally, we send a message to the player informing them about the teleportation.

These examples demonstrate how the `MoveTo` method can be used to move units to specific locations or teleport them to random positions within a certain range.

## NearTeleport
This method will teleport the unit to the specified coordinates within the same map. This can be useful for moving units around the world quickly without the need for pathing or movement. 

### Parameters
* x: number - The x coordinate to teleport the unit to
* y: number - The y coordinate to teleport the unit to 
* z: number - The z coordinate to teleport the unit to
* o: number - The orientation to face the unit after teleport

### Example Usage:
Here's an example of how you might use `NearTeleport` in a script that teleports a player to a random location within a certain radius of their current position:

```typescript
const TELEPORT_RADIUS = 10; // 10 yard radius

const onGossipSelect: gossip_select_hook = (event, player, creature, sender, intid, code, menu_id) => {
    if (intid === 1) {
        // Get the player's current position
        const playerX = player.GetX();
        const playerY = player.GetY();
        const playerZ = player.GetZ();
        const playerO = player.GetO();

        // Calculate a random offset within the specified radius
        const randomAngle = Math.random() * 2 * Math.PI;
        const randomDistance = Math.random() * TELEPORT_RADIUS;
        const offsetX = Math.cos(randomAngle) * randomDistance;
        const offsetY = Math.sin(randomAngle) * randomDistance;

        // Calculate the new coordinates
        const newX = playerX + offsetX;
        const newY = playerY + offsetY;
        const newZ = playerZ;

        // Teleport the player to the new location
        player.NearTeleport(newX, newY, newZ, playerO);

        player.SendBroadcastMessage("You have been teleported to a random location nearby!");
    }
};

RegisterCreatureGossipEvent(NPC_ID, GOSSIP_EVENT_ON_SELECT, (...args) => onGossipSelect(...args));
```

In this example, when the player selects a specific gossip option (with `intid` 1), the script calculates a random location within a certain radius of the player's current position. It then uses `NearTeleport` to instantly move the player to that location, maintaining their current orientation.

This can be a fun way to add some unpredictability to player movement, or to create a "random teleport" feature for players to explore the world around them. Just be careful not to teleport players into any dangerous or inaccessible areas!

## PerformEmote
Makes the unit perform a specified emote animation.

### Parameters
* emoteId: number - The ID of the emote to perform. Emote IDs can be found in the `emotes` table in the world database.

### Example Usage
This example script makes a creature perform a random emote every 5 seconds:

```typescript
const EMOTE_ONESHOT_WOUNDED = 18;
const EMOTE_ONESHOT_ROAR = 15;
const EMOTE_ONESHOT_ATTACKUNARMED = 26;
const EMOTE_ONESHOT_ATTACK1H = 36;
const EMOTE_ONESHOT_POINT = 25;

const emotes = [
    EMOTE_ONESHOT_WOUNDED, 
    EMOTE_ONESHOT_ROAR,
    EMOTE_ONESHOT_ATTACKUNARMED,
    EMOTE_ONESHOT_ATTACK1H,
    EMOTE_ONESHOT_POINT
];

const CreatureRandomEmote = (entry: number) => {
    const creature = GetCreatureByEntry(entry);

    if (!creature || !creature.IsInWorld()) {
        return;
    }

    const randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
    creature.PerformEmote(randomEmote);

    SetTimeout(() => CreatureRandomEmote(entry), 5000);
};

const OnModuleInit: mod_on_module_init = (): void => {
    const CREATURE_ENTRY = 1234; // Replace with the desired creature entry ID
    CreatureRandomEmote(CREATURE_ENTRY);
};

RegisterModEvent('OnModuleInit', OnModuleInit);
```

In this script:
1. We define constants for different emote IDs that we want the creature to perform.
2. We create an array called `emotes` that contains the emote IDs.
3. We define a function `CreatureRandomEmote` that takes the creature entry ID as a parameter.
4. Inside the function, we retrieve the creature object using `GetCreatureByEntry` and check if it exists and is in the world.
5. We generate a random index using `Math.floor(Math.random() * emotes.length)` to select a random emote from the `emotes` array.
6. We call the `PerformEmote` method on the creature object, passing the randomly selected emote ID.
7. We use `SetTimeout` to schedule the next emote performance after a 5-second delay (5000 milliseconds) by recursively calling `CreatureRandomEmote` with the same creature entry ID.
8. In the `OnModuleInit` event, we specify the desired creature entry ID and call `CreatureRandomEmote` to start the emote performance loop.

By registering the `OnModuleInit` event, the script will start executing when the module is initialized, and the creature will perform random emotes every 5 seconds indefinitely.

Note: Make sure to replace `CREATURE_ENTRY` with the actual entry ID of the creature you want to perform the emotes.

## RemoveAllAuras
Removes all auras from the Unit, including buffs, debuffs, talents, and racials. This method should be used with caution as it can significantly impact the Unit's performance and abilities.

### Parameters
None

### Returns
None

### Example Usage
In this example, we create a script that removes all auras from a player when they enter a specific area, such as a PvP zone or a boss encounter. This can be useful for creating a level playing field or for preventing players from using certain abilities during the encounter.

```typescript
const AREA_ID = 1234; // Replace with the ID of the area where auras should be removed

const OnPlayerEnterArea: player_event_on_area_trigger = (event: number, player: Player, areaId: number) => {
    if (areaId === AREA_ID) {
        player.RemoveAllAuras();
        player.SendBroadcastMessage("All auras have been removed as you enter the area.");

        // Apply a debuff to prevent players from re-applying auras
        const DEBUFF_ENTRY = 5678; // Replace with the ID of the debuff spell
        const DEBUFF_DURATION = 60 * IN_MILLISECONDS; // 1 minute duration
        player.AddAura(DEBUFF_ENTRY, DEBUFF_DURATION);

        // Notify the player's party members
        const group = player.GetGroup();
        if (group) {
            group.BroadcastGroupPacket(
                CliGmMessage(`${player.GetName()} has entered the area and had all auras removed.`)
            );
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => OnPlayerEnterArea(...args));
```

In this script:
1. We define the `AREA_ID` constant with the ID of the area where auras should be removed.
2. When a player enters the specified area, the `OnPlayerEnterArea` event handler is triggered.
3. We check if the entered area matches the `AREA_ID`.
4. If it matches, we call `player.RemoveAllAuras()` to remove all auras from the player.
5. We send a broadcast message to the player informing them that their auras have been removed.
6. To prevent players from immediately re-applying auras, we apply a debuff using `player.AddAura()` with a specific duration (`DEBUFF_DURATION`).
7. If the player is in a group, we notify their party members that the player has entered the area and had their auras removed using `group.BroadcastGroupPacket()`.

This example demonstrates how to use the `RemoveAllAuras()` method in combination with other methods and events to create a specific gameplay mechanic or encounter.

## RemoveAura
Removes an aura from the unit based on the spell entry. This can be useful for removing buffs or debuffs from the unit.

### Parameters
* spell: number - The spell entry ID of the aura to remove.

### Example Usage
Remove a specific aura from the unit when they enter combat.
```typescript
const AURA_TO_REMOVE = 12345;

const onEnterCombat: unit_event_on_enter_combat = (event: UnitEvents, unit: Unit, target: Unit) => {
    // Check if the unit has the aura
    if (unit.HasAura(AURA_TO_REMOVE)) {
        // Remove the aura from the unit
        unit.RemoveAura(AURA_TO_REMOVE);
        
        // Notify the unit that the aura was removed
        unit.SendBroadcastMessage(`The aura ${AURA_TO_REMOVE} has been removed from you.`);
    }
}

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

Another example could be removing a specific aura from the unit when they respawn after dying.
```typescript
const AURA_TO_REMOVE = 67890;

const onRespawn: unit_event_on_respawn = (event: UnitEvents, unit: Unit) => {
    // Check if the unit has the aura
    if (unit.HasAura(AURA_TO_REMOVE)) {
        // Remove the aura from the unit
        unit.RemoveAura(AURA_TO_REMOVE);
        
        // Notify the unit that the aura was removed
        unit.SendBroadcastMessage(`The aura ${AURA_TO_REMOVE} has been removed from you upon respawning.`);
    }
    
    // Check if the unit is a player
    if (unit.IsPlayer()) {
        const player = unit.ToPlayer();
        
        // Send a welcome back message to the player
        player.SendBroadcastMessage("Welcome back to the world of the living!");
    }
}

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_RESPAWN, (...args) => onRespawn(...args));
```

In this example, we remove a specific aura from the unit when they respawn after dying. We also check if the unit is a player, and if so, we send them a welcome back message. This can be useful for removing any lingering effects from the unit's previous life, and giving them a fresh start upon respawning.

## SendChatMessageToPlayer
Sends a chat message to a specific player from this unit.

### Parameters
* type: [ChatMsg](../enums/ChatMsg.md) - The type of chat message to send.
* lang: [Language](../enums/Language.md) - The language of the message.
* msg: string - The content of the message to send.
* target: [Player](./Player.md) - The player to receive the message.

### Example Usage
Here's an example of how to use the `SendChatMessageToPlayer` method to send a message to a player when they enter the world:

```typescript
const WELCOME_MESSAGE = "Welcome to the server, {name}! Remember to read the rules and have fun!";

function OnLogin(event: PlayerEvents, player: Player): void {
    // Check if the player is logging in for the first time
    if (player.GetTotalPlayedTime() == 0) {
        // Get the player's name
        const playerName = player.GetName();

        // Format the welcome message with the player's name
        const formattedMessage = WELCOME_MESSAGE.replace("{name}", playerName);

        // Send the welcome message to the player
        player.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_SYSTEM, Language.LANG_UNIVERSAL, formattedMessage, player);

        // Give the player a small bonus for their first login
        const bonusAmount = 10;
        const bonusMoney = player.ModifyMoney(bonusAmount * 10000); // 1 gold = 10000 copper
        
        // Inform the player about their bonus
        const bonusMessage = `As a welcome gift, you have received ${bonusAmount} gold!`;
        player.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_SYSTEM, Language.LANG_UNIVERSAL, bonusMessage, player);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example:
1. We define a constant `WELCOME_MESSAGE` that contains the message to send to new players, with a placeholder for their name.
2. We register a callback function `OnLogin` to the `PLAYER_EVENT_ON_LOGIN` event.
3. Inside the callback function, we check if the player is logging in for the first time by comparing their total played time to 0.
4. If it's their first login, we retrieve the player's name using `player.GetName()`.
5. We format the welcome message by replacing the placeholder `{name}` with the player's actual name.
6. We send the formatted welcome message to the player using `player.SendChatMessageToPlayer()`, specifying the chat message type as `CHAT_MSG_SYSTEM`, the language as `LANG_UNIVERSAL`, and the target player as the player itself.
7. As a bonus, we grant the player a small amount of money (10 gold) using `player.ModifyMoney()`.
8. We send another message to the player informing them about the bonus they received.

This script ensures that new players receive a personalized welcome message and a small bonus upon their first login to the server.

## SendUnitEmote
The `SendUnitEmote` method allows the [Unit](./unit.md) to display an emote message to the specified receiver or to nearby players if no receiver is specified. This can be useful for creating custom boss encounters or adding flavor to NPC interactions.

### Parameters
* `msg`: string - The emote message to be displayed.
* `receiver`: [Unit](./unit.md) (optional) - The target [Unit](./unit.md) that will receive the emote message. If not specified, the emote will be sent to nearby players.
* `bossEmote`: boolean (optional) - Determines whether the emote is a boss emote or a regular emote. Boss emotes are displayed in the chat frame with a different color and font. Default is `false`.

### Example Usage
Creating a custom boss encounter with emotes:
```typescript
const BOSS_ENTRY = 12345;
const EMOTE_PHASE_1 = 'The boss lets out a menacing roar!';
const EMOTE_PHASE_2 = 'The boss becomes enraged and starts to glow with a fiery aura!';
const EMOTE_PLAYER_KILLED = 'The boss laughs as it claims another victim!';

const OnBossEnterCombat: creature_event_on_enter_combat = (event: number, creature: Creature, target: Unit): void => {
    creature.SendUnitEmote(EMOTE_PHASE_1, undefined, true);
    creature.RegisterEvent(() => {
        creature.SendUnitEmote(EMOTE_PHASE_2, undefined, true);
        // Add phase 2 abilities and mechanics here
    }, 30000, 1);
};

const OnBossKillPlayer: creature_event_on_kill_player = (event: number, creature: Creature, victim: Player): void => {
    creature.SendUnitEmote(EMOTE_PLAYER_KILLED, victim, true);
};

const OnBossDeath: creature_event_on_death = (event: number, creature: Creature, killer: Unit): void => {
    creature.SendUnitEmote(`${creature.GetName()} has been defeated!`, undefined, true);
    // Add any loot or post-encounter events here
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_ENTER_COMBAT, (...args) => OnBossEnterCombat(...args));
RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_KILLED_PLAYER, (...args) => OnBossKillPlayer(...args));
RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_DEATH, (...args) => OnBossDeath(...args));
```
In this example, we create a custom boss encounter where the boss emotes at different phases of the fight and when it kills a player. The `SendUnitEmote` method is used to display these emotes to nearby players, with the `bossEmote` parameter set to `true` to ensure they are displayed as boss emotes.

The `OnBossEnterCombat` event sets up the initial emote and registers a delayed event to trigger the phase 2 emote after 30 seconds. The `OnBossKillPlayer` event emotes when the boss kills a player, and the `OnBossDeath` event emotes when the boss is defeated.

This is just a simple example, but it demonstrates how the `SendUnitEmote` method can be used to enhance a boss encounter and provide additional feedback to players.

## SendUnitSay
The `SendUnitSay` method allows the [Unit](./unit.md) to speak a message in a specified language. This can be used to create custom dialogue or announcements from various units in the game.

### Parameters
* msg: string - The message that the unit will say.
* language: [Language](./language.md) - The language in which the message will be spoken. Refer to the [Language](./language.md) documentation for available language options.

### Example Usage
In this example, we create a script that makes a friendly NPC say a random greeting to players who interact with them, using their race's language.

```typescript
const FRIENDLY_NPC_ENTRY = 1234;
const GREETINGS = [
    "Hello, traveler! Welcome to our village.",
    "Greetings, adventurer. How may I assist you today?",
    "Ah, another brave soul. What brings you to these parts?",
    "Well met, friend. I hope your journey has been safe thus far."
];

const NpcGreet: creature_event_on_gossip_hello = (event: number, creature: Creature, player: Player): void => {
    if (creature.GetEntry() === FRIENDLY_NPC_ENTRY) {
        const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        const playerRace = player.GetRace();
        let npcLanguage: Language;

        switch (playerRace) {
            case Races.RACE_HUMAN:
                npcLanguage = Languages.LANG_COMMON;
                break;
            case Races.RACE_ORC:
                npcLanguage = Languages.LANG_ORCISH;
                break;
            case Races.RACE_DWARF:
                npcLanguage = Languages.LANG_DWARVISH;
                break;
            case Races.RACE_NIGHTELF:
                npcLanguage = Languages.LANG_DARNASSIAN;
                break;
            // Add more cases for other races and their respective languages
            default:
                npcLanguage = Languages.LANG_UNIVERSAL;
        }

        creature.SendUnitSay(randomGreeting, npcLanguage);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (...args) => NpcGreet(...args));
```

In this script, we define an array of friendly greetings and a constant for the friendly NPC's entry ID. When a player interacts with the NPC (triggering the `CREATURE_EVENT_ON_GOSSIP_HELLO` event), the script checks if the creature's entry matches the friendly NPC.

If it does, the script selects a random greeting from the `GREETINGS` array and determines the player's race using the `GetRace()` method. Based on the player's race, it sets the appropriate language for the NPC to speak using a `switch` statement.

Finally, the script calls the `SendUnitSay` method on the creature object, passing the selected random greeting and the determined language. This makes the NPC say the greeting to the player in their race's language, adding a touch of immersion to the interaction.

## SendUnitWhisper
The `SendUnitWhisper` method allows a unit to send a whisper message to a specific player. This can be useful for creating custom boss encounters or interactive NPCs that communicate directly with players.

### Parameters
* `msg`: string - The message to be sent as a whisper.
* `lang`: number - The language of the message. Refer to the [Languages](https://www.azerothcore.org/wiki/Languages) table for valid language IDs.
* `receiver`: [Player](./player.md) - The player who will receive the whisper message.
* `bossWhisper`: boolean (optional) - If set to true, the message will be treated as a boss whisper, which may trigger additional visual effects or sounds for the receiving player.

### Example Usage
Here's an example of how to use `SendUnitWhisper` to create a custom boss encounter that interacts with players based on their actions:

```typescript
const BOSS_ENTRY = 12345;
const PLAYER_EMOTE_DANCE = 10;

const OnEmote: creature_event_on_receive_emote = (event: number, creature: Creature, player: Player, emote: number) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        if (emote === PLAYER_EMOTE_DANCE) {
            creature.SendUnitWhisper("You dare to dance in my presence? Prepare to face my wrath!", 0, player);
            creature.CastSpell(player, 12345, true); // Cast a spell on the player
        } else {
            creature.SendUnitWhisper("Your actions are meaningless. Prove your worth or perish!", 0, player);
        }
    }
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_RECEIVE_EMOTE, (...args) => OnEmote(...args));
```

In this example:
1. We define a constant `BOSS_ENTRY` to represent the entry ID of the custom boss creature.
2. We define a constant `PLAYER_EMOTE_DANCE` to represent the emote ID for the player's dance action.
3. We create a function `OnEmote` that handles the `CREATURE_EVENT_ON_RECEIVE_EMOTE` event.
4. Inside the `OnEmote` function, we check if the creature's entry matches the `BOSS_ENTRY`.
5. If the player performs the dance emote (`PLAYER_EMOTE_DANCE`), the boss sends a threatening whisper message to the player using `SendUnitWhisper` and casts a spell on them using `CastSpell`.
6. If the player performs any other emote, the boss sends a different whisper message, urging the player to prove their worth.
7. Finally, we register the `OnEmote` function to handle the `CREATURE_EVENT_ON_RECEIVE_EMOTE` event for the specific boss creature using `RegisterCreatureEvent`.

This example demonstrates how `SendUnitWhisper` can be used to create interactive boss encounters that respond to player actions, providing a more immersive and engaging experience.

## SendUnitYell
The `SendUnitYell` method causes the [Unit](./unit.md) to yell the specified message in the specified language. The message will be displayed in the chat window for nearby players based on the range of the yell.

### Parameters
* msg: string - The message to be yelled by the unit.
* language: [Language](./language.md) - The language in which the message will be yelled. You can find the list of available languages in the [Language](./language.md) enum.

### Example Usage
In this example, we create a script that makes a friendly NPC yell a random greeting to players who interact with it, in a random language.

```typescript
const FRIENDLY_NPC_ENTRY = 1234;
const GREETINGS = [
    "Welcome, traveler!",
    "Greetings, adventurer!",
    "Salutations, hero!",
    "Well met, champion!",
];

const RandomGreeting = (player: Player, creature: Creature): void => {
    if (creature.GetEntry() === FRIENDLY_NPC_ENTRY) {
        const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        const randomLanguage = Math.floor(Math.random() * (MAX_LANGUAGES - 1)) + 1;

        creature.SendUnitYell(randomGreeting, randomLanguage);

        const playerResponse = `${player.GetName()}, I hope you enjoy your stay in our town!`;
        creature.SendUnitSay(playerResponse, 0);

        creature.HandleEmoteCommand(EMOTE_ONESHOT_WAVE);
    }
};

RegisterCreatureEvent(FRIENDLY_NPC_ENTRY, CreatureEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (event, player, creature) => RandomGreeting(player, creature));
```

In this script:
1. We define the entry of the friendly NPC and an array of random greetings.
2. In the `RandomGreeting` function, we check if the interacted creature has the desired entry.
3. We select a random greeting from the `GREETINGS` array.
4. We generate a random language ID between 1 and `MAX_LANGUAGES - 1` (excluding the universal language).
5. We make the creature yell the random greeting in the random language using `SendUnitYell`.
6. We make the creature say a personalized response to the player using `SendUnitSay`.
7. We make the creature perform a wave emote using `HandleEmoteCommand`.
8. Finally, we register the `RandomGreeting` function to be called when a player interacts with the friendly NPC using `RegisterCreatureEvent` and the `CREATURE_EVENT_ON_GOSSIP_HELLO` event.

This script adds a touch of immersion and interactivity to the game world by making the friendly NPC greet players in different languages and respond to their interactions.

## SetConfused
This method sets the confused state of the [Unit]. If the `apply` parameter is set to `true` or not provided, the unit will be confused. If `apply` is set to `false`, the unit will no longer be confused.

When a unit is confused, its movement and actions become erratic and unpredictable. This can be useful for crowd control or to temporarily disable a powerful enemy.

### Parameters
- `apply`: boolean (optional) - Determines whether to confuse the unit (`true`) or remove the confusion effect (`false`). If not provided, the default value is `true`.

### Example Usage
In this example, we have a script that confuses a random nearby enemy unit when a player enters combat. The confusion effect lasts for 5 seconds, after which the unit is no longer confused.

```typescript
const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    // Get all enemy units within 10 yards of the player
    const nearbyEnemies = player.GetUnitsInRange(10, 0, true);

    if (nearbyEnemies.length > 0) {
        // Select a random enemy unit from the nearby units
        const randomIndex = Math.floor(Math.random() * nearbyEnemies.length);
        const targetEnemy = nearbyEnemies[randomIndex];

        // Confuse the target enemy unit
        targetEnemy.SetConfused(true);

        // Create a delayed action to remove the confusion effect after 5 seconds
        player.RegisterTimedEvent(5000, (eventId: number, delay: number, repeats: number, player: Player) => {
            // Check if the target enemy unit is still alive and confused
            if (targetEnemy.IsAlive() && targetEnemy.IsConfused()) {
                // Remove the confusion effect from the target enemy unit
                targetEnemy.SetConfused(false);
            }
        });
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script:
1. When a player enters combat, we retrieve all enemy units within 10 yards of the player using the `GetUnitsInRange` method.
2. If there are nearby enemy units, we select a random unit from the list.
3. We confuse the selected target enemy unit by calling `SetConfused(true)`.
4. We register a timed event using `RegisterTimedEvent` to remove the confusion effect after a delay of 5 seconds (5000 milliseconds).
5. In the timed event callback, we check if the target enemy unit is still alive and confused using `IsAlive()` and `IsConfused()` methods.
6. If the target enemy unit is still confused, we remove the confusion effect by calling `SetConfused(false)`.

This example demonstrates how to use the `SetConfused` method to apply and remove the confusion effect on a unit, as well as how to create delayed actions using `RegisterTimedEvent` to control the duration of the effect.

## SetCreatorGUID
Sets the creator GUID for the [Unit]. The creator GUID is used to identify the entity that created or summoned the [Unit].

### Parameters
* guid: number - The GUID to set as the creator GUID.

### Example Usage
Set the creator GUID of a summoned creature to the summoning player's GUID.
```typescript
const SUMMON_ENTRY = 12345;

const OnSummon: player_event_on_summon_creature = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === SUMMON_ENTRY) {
        const creatorGUID = player.GetGUID();
        creature.SetCreatorGUID(creatorGUID);
        
        // Add a special aura if the creature was summoned by a specific player
        const SPECIAL_PLAYER_GUID = 1234567890;
        if (creatorGUID === SPECIAL_PLAYER_GUID) {
            const SPECIAL_AURA_ENTRY = 54321;
            creature.AddAura(SPECIAL_AURA_ENTRY, creature);
        }
        
        // Set the creature's faction to match the summoner's faction
        const summonerFaction = player.GetFaction();
        creature.SetFaction(summonerFaction);
        
        // Make the creature despawn after 5 minutes (300000 milliseconds)
        creature.DespawnOrUnsummon(300000);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SUMMON_CREATURE, (...args) => OnSummon(...args));
```
In this example:
1. When a player summons a creature with the entry `SUMMON_ENTRY`, the `OnSummon` event is triggered.
2. The summoned creature's creator GUID is set to the summoning player's GUID using `SetCreatorGUID()`.
3. If the summoning player's GUID matches a specific value (`SPECIAL_PLAYER_GUID`), a special aura with the entry `SPECIAL_AURA_ENTRY` is added to the summoned creature using `AddAura()`.
4. The summoned creature's faction is set to match the summoner's faction using `SetFaction()`.
5. The summoned creature is set to despawn after 5 minutes (300000 milliseconds) using `DespawnOrUnsummon()`.

This script demonstrates how `SetCreatorGUID()` can be used in combination with other methods to customize the behavior of summoned creatures based on their creator.

## SetCritterGUID
This method sets the GUID of the critter that the [Unit](./unit.md) is currently interacting with. Critters are small, non-combat creatures that can be found throughout the game world, such as squirrels, rabbits, and other small animals.

### Parameters
This method does not take any parameters.

### Returns
This method does not return any value.

### Example Usage
In this example, we'll create a script that allows a player to interact with a critter and receive a small reward.

```typescript
const CRITTER_ENTRY = 721; // Rabbit
const ITEM_ENTRY = 44228; // Rabbit's Foot

const InteractWithCritter: player_event_on_gossip_hello = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === CRITTER_ENTRY) {
        player.SetCritterGUID();
        
        // Check if the player has already interacted with this critter
        const critterGUID = player.GetCritterGUID();
        const hasInteracted = player.HasStoredValue(critterGUID);

        if (!hasInteracted) {
            // Reward the player with a small item
            const item = player.AddItem(ITEM_ENTRY, 1);
            if (item) {
                player.SendBroadcastMessage(`You received a ${item.GetName()}!`);
            }

            // Store the critter's GUID to prevent multiple interactions
            player.StoreValue(critterGUID, 1);
        } else {
            player.SendBroadcastMessage("You have already interacted with this critter.");
        }

        player.GossipComplete();
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GOSSIP_HELLO, (...args) => InteractWithCritter(...args));
```

In this script:

1. We define the entry ID of the critter (rabbit) and the item (rabbit's foot) that the player will receive as a reward.
2. When the player interacts with a creature (via gossip), we check if the creature is the desired critter.
3. If it is the correct critter, we set the critter's GUID using `SetCritterGUID()`.
4. We then check if the player has already interacted with this specific critter by using the stored value associated with the critter's GUID.
5. If the player hasn't interacted with the critter before, we reward them with the specified item using `AddItem()` and send them a broadcast message informing them of the reward.
6. We store the critter's GUID using `StoreValue()` to prevent the player from receiving multiple rewards from the same critter.
7. If the player has already interacted with the critter, we send them a message indicating that they have already interacted with it.
8. Finally, we close the gossip interaction using `GossipComplete()`.

This example demonstrates how `SetCritterGUID()` can be used in conjunction with other methods to create a simple interaction system with critters, allowing players to receive rewards for interacting with them while preventing multiple interactions with the same critter.

## SetDisplayId
Sets the display ID of the unit. The display ID determines the visual appearance of the unit, such as its model, size, and equipment. Changing the display ID can be used to transform the unit into a different creature or character.

### Parameters
- `displayId`: number - The new display ID to set for the unit. You can find display IDs in the `creature_template` table in the world database.

### Example Usage
Transform a player into a random creature when they enter a specific area:

```typescript
const AREA_ID = 1234; // Replace with the desired area ID
const DISPLAY_IDS = [1111, 2222, 3333, 4444, 5555]; // Replace with the desired display IDs

const transformPlayer: player_event_on_update_zone = (event: number, player: Player, newZone: number, newArea: number) => {
    if (newArea === AREA_ID) {
        const randomDisplayId = DISPLAY_IDS[Math.floor(Math.random() * DISPLAY_IDS.length)];
        player.SetDisplayId(randomDisplayId);

        // Store the player's original display ID
        const originalDisplayId = player.GetNativeDisplayId();
        player.SetData("originalDisplayId", originalDisplayId);

        // Send a message to the player
        player.SendBroadcastMessage("You have been transformed!");
    } else {
        // Check if the player has a stored original display ID
        const originalDisplayId = player.GetData("originalDisplayId");
        if (originalDisplayId !== undefined) {
            player.SetDisplayId(Number(originalDisplayId));
            player.DeleteData("originalDisplayId");

            // Send a message to the player
            player.SendBroadcastMessage("You have been transformed back!");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE_ZONE, (...args) => transformPlayer(...args));
```

In this example:
1. We define a specific area ID (`AREA_ID`) and an array of display IDs (`DISPLAY_IDS`) that we want to use for the transformation.
2. When a player enters the specified area, we randomly select a display ID from the `DISPLAY_IDS` array using `Math.random()` and `Math.floor()`.
3. We set the player's display ID to the randomly selected display ID using `player.SetDisplayId(randomDisplayId)`.
4. We store the player's original display ID using `player.SetData("originalDisplayId", originalDisplayId)` so that we can restore it later.
5. We send a message to the player indicating that they have been transformed.
6. When the player leaves the specified area, we check if they have a stored original display ID using `player.GetData("originalDisplayId")`.
7. If an original display ID exists, we restore the player's appearance using `player.SetDisplayId(Number(originalDisplayId))` and remove the stored data using `player.DeleteData("originalDisplayId")`.
8. We send a message to the player indicating that they have been transformed back to their original appearance.

This example demonstrates how you can use the `SetDisplayId` method to temporarily transform a player's appearance based on their location and restore their original appearance when they leave the area.

## SetFFA
This method sets the Free-for-All (FFA) flag on the [Unit](./unit.md). When the FFA flag is set, the unit can be attacked by any other unit, regardless of faction or group membership.

### Parameters
- `apply`: boolean (optional) - If set to `true`, the FFA flag will be set. If set to `false`, the FFA flag will be removed. If not provided, the FFA flag will be toggled (if it was on, it will be turned off, and vice versa).

### Example Usage
In this example, we create a custom battleground where players can attack each other regardless of their faction:

```typescript
const BATTLEGROUND_MAP_ID = 123;

const OnPlayerEnterBattleground: player_event_on_enter_map = (event, player, newMapId, oldMapId): void => {
    if (newMapId === BATTLEGROUND_MAP_ID) {
        player.SetFFA(true);
        player.SendBroadcastMessage("You have entered the FFA Battleground. Attack anyone you want!");
    }
};

const OnPlayerLeaveBattleground: player_event_on_leave_map = (event, player, newMapId, oldMapId): void => {
    if (oldMapId === BATTLEGROUND_MAP_ID) {
        player.SetFFA(false);
        player.SendBroadcastMessage("You have left the FFA Battleground. Normal faction rules apply.");
    }
};

const OnPlayerDeath: player_event_on_kill_player = (event, killer, killed): void => {
    if (killer.GetMapId() === BATTLEGROUND_MAP_ID) {
        killer.SendBroadcastMessage(`You have slain ${killed.GetName()}!`);
        killer.AddItem(REWARD_ITEM_ID, 1);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_MAP, OnPlayerEnterBattleground);
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LEAVE_MAP, OnPlayerLeaveBattleground);
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_KILL_PLAYER, OnPlayerDeath);
```

In this script:

1. When a player enters the custom battleground map, their FFA flag is set to `true` using `player.SetFFA(true)`. They are also sent a message informing them that they can attack anyone.

2. When a player leaves the custom battleground map, their FFA flag is set back to `false` using `player.SetFFA(false)`. They are sent a message informing them that normal faction rules apply again.

3. When a player kills another player in the custom battleground map, the killer is sent a message congratulating them and is awarded a custom item using `killer.AddItem(REWARD_ITEM_ID, 1)`.

This script showcases how the `SetFFA()` method can be used in conjunction with other Eluna methods and events to create a unique gameplay experience.

## SetFacing
Sets the facing/orientation of the unit in the world.  Orientation is expressed as a radian value between 0 and 2π (pi).
This method can be used to script actions that require a unit to face a specific direction before executing.

### Parameters
* orientation: number - The direction in radians which the unit will face.

### Example Usage:
Example script that will cause a creature to face a random player in range and cast a spell.
```typescript
const RANGE = 10;
const SPELL_ID = 6713;

function CastAtRandomPlayer(creature: Creature) {
    const nearbyPlayers = creature.GetPlayersInRange(RANGE, false);
    if(nearbyPlayers && nearbyPlayers.length > 0){
        //select random player in range
        const randomIndex = Math.floor(Math.random() * nearbyPlayers.length);
        const target = nearbyPlayers[randomIndex];

        //Get player position
        const targetPosition = target.GetLocation();
        
        //calculate facing based on creature -> player position
        const dx = targetPosition.x - creature.GetX();
        const dy = targetPosition.y - creature.GetY();
        let orientation = Math.atan2(dy, dx);

        //Creature AI has some inconsistencies with SetFacing
        //Clip orientation to 0 to 2π (pi) and rotate 
        if(orientation < 0) {
            orientation += Math.PI * 2;
        }

        //set facing
        creature.SetFacing(orientation);

        //cast spell at target
        creature.CastSpell(target, SPELL_ID, true);
    }
}

const OnCreatureUpdate: creature_event_on_update = (event: number, creature: Creature, diff: number): void => {
    CastAtRandomPlayer(creature);
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_UPDATE, (...args) => OnCreatureUpdate(...args));
```
In this example, when the creature updates it will search for any players in a given range (10 yards).  If there are any players in range
it will select one at random and calculate the direction that player is in relation to the creature.  The creature will then face that direction and cast a spell (Shadow Word: Pain in this case) at the player before continuing on.

## SetFacingToObject
Sets the [Unit] to face the given [WorldObject]'s direction.

### Parameters
- `target`: [WorldObject](./world-object.md) - The target object to face towards.

### Example Usage
In this example, we create an event handler for the `CREATURE_EVENT_ON_SPAWN` event. When a creature spawns, we find the nearest player within a radius of 10 yards and set the creature to face the player.

```typescript
const SEARCH_RADIUS = 10; // 10 yards

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    // Find the nearest player within the search radius
    const nearestPlayer = creature.GetNearestPlayer(SEARCH_RADIUS);

    if (nearestPlayer) {
        // Set the creature to face the nearest player
        creature.SetFacingToObject(nearestPlayer);

        // Print a message indicating the creature is facing the player
        const creatureName = creature.GetName();
        const playerName = nearestPlayer.GetName();
        console.log(`${creatureName} is now facing ${playerName}.`);
    } else {
        // No player found within the search radius
        console.log(`No player found within ${SEARCH_RADIUS} yards of the spawned creature.`);
    }
};

// Register the event handler for the creature spawn event
RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onCreatureSpawn(...args));
```

In this example:
1. We define a constant `SEARCH_RADIUS` to specify the radius within which to search for the nearest player.
2. We create an event handler function `onCreatureSpawn` that takes the event number and the spawned creature as parameters.
3. Inside the event handler, we use the `GetNearestPlayer` method of the creature to find the nearest player within the specified search radius.
4. If a player is found (`nearestPlayer` is truthy), we use the `SetFacingToObject` method of the creature to set its facing direction towards the nearest player.
5. We print a message indicating which creature is now facing which player.
6. If no player is found within the search radius, we print a message indicating that no player was found.
7. Finally, we register the event handler for the `CREATURE_EVENT_ON_SPAWN` event using the `RegisterCreatureEvent` function.

This example demonstrates how the `SetFacingToObject` method can be used in a practical scenario where a spawned creature automatically faces the nearest player within a certain radius. The example includes error handling and provides informative console messages for better understanding of the script's behavior.

## SetFaction
Sets the faction for the [Unit]. Faction determines if a unit is hostile, friendly or neutral when interacting with other units. More information about faction IDs can be found in the [AzerothCore faction.dbc file](https://github.com/azerothcore/azerothcore-wotlk/blob/master/data/dbc/faction.dbc).

### Parameters
- faction: number - The faction ID to set for the unit.

### Example Usage
This example demonstrates how to change a unit's faction based on its current health percentage. If the unit's health drops below 50%, it will change its faction to a neutral one, making it non-hostile to all players.

```typescript
const HOSTILE_FACTION_ID = 14;
const NEUTRAL_FACTION_ID = 35;
const HEALTH_THRESHOLD = 50;

const UnitDamageTaken: unit_event_on_damage_taken = (event: number, unit: Unit, attacker: Unit, damage: number) => {
    const healthPct = unit.GetHealthPct();

    if (healthPct < HEALTH_THRESHOLD && unit.GetFaction() === HOSTILE_FACTION_ID) {
        unit.SetFaction(NEUTRAL_FACTION_ID);
        unit.SetSheath(SheathState.SHEATH_STATE_UNARMED);
        unit.SetFlag(UnitFields.UNIT_FIELD_FLAGS, UnitFlags.UNIT_FLAG_IMMUNE_TO_PC);
        unit.SetFlag(UnitFields.UNIT_FIELD_FLAGS, UnitFlags.UNIT_FLAG_IMMUNE_TO_NPC);
        unit.ClearThreatList();
        unit.Say("I surrender! Please spare my life!", 0);
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_DAMAGE_TAKEN, (...args) => UnitDamageTaken(...args));
```

In this example:

1. We define constants for the hostile and neutral faction IDs, as well as a health threshold percentage.
2. We register a `UNIT_EVENT_ON_DAMAGE_TAKEN` event handler for all units.
3. When a unit takes damage, we calculate its current health percentage using `unit.GetHealthPct()`.
4. If the unit's health is below the threshold and its current faction is hostile, we change its faction to neutral using `unit.SetFaction(NEUTRAL_FACTION_ID)`.
5. We also update the unit's visual state by sheathing its weapons (`unit.SetSheath(SheathState.SHEATH_STATE_UNARMED)`), making it immune to both players and NPCs (`unit.SetFlag()`), clearing its threat list (`unit.ClearThreatList()`), and making it say a surrender message (`unit.Say()`).

This script showcases how changing a unit's faction can influence its behavior and interactions with other units in the game world.

## SetFeared
This method can be used to apply or remove the fear effect on a unit.

### Parameters
* apply: boolean (optional) - If set to true, the fear effect will be applied to the unit. If set to false, the fear effect will be removed from the unit. If not specified, the default value is true.

### Example Usage
Here's an example of how you can use the SetFeared method in a script:

```typescript
const SPELL_FEAR_ID = 5782;

const onSpellCast: creature_event_on_spell_cast = (event: number, creature: Creature, caster: Unit, spellInfo: SpellEntry): void => {
    if (spellInfo.Id === SPELL_FEAR_ID) {
        const targets = creature.GetAITargets(5 /* Radius in yards */);

        for (const target of targets) {
            if (target instanceof Player) {
                // Apply fear to players within range
                target.SetFeared(true);

                // Remove fear after 5 seconds
                setTimeout(() => {
                    target.SetFeared(false);
                }, 5000);
            }
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPELL_CAST, (...args) => onSpellCast(...args));
```

In this example:
1. We define a constant `SPELL_FEAR_ID` to store the ID of the fear spell.
2. We register a creature event handler for the `CREATURE_EVENT_ON_SPELL_CAST` event.
3. Inside the event handler, we check if the spell being cast matches the `SPELL_FEAR_ID`.
4. If it matches, we retrieve all the AI targets within a radius of 5 yards using `creature.GetAITargets()`.
5. We iterate over the targets and check if each target is a player using the `instanceof` operator.
6. If the target is a player, we apply the fear effect to them using `target.SetFeared(true)`.
7. We also set up a timer using `setTimeout()` to remove the fear effect after 5 seconds by calling `target.SetFeared(false)`.

This script demonstrates how you can use the `SetFeared` method to apply and remove the fear effect on units, specifically targeting players within a certain range when a creature casts a fear spell.

Note: Make sure to replace `SPELL_FEAR_ID` with the actual ID of the fear spell you want to use in your script.

## SetHealth
Sets the current health of the Unit to the specified value.

### Parameters
* health: number - The new health value to set for the Unit.

### Example Usage
Setting a Unit's health based on a percentage of their maximum health:
```typescript
const HEALTH_PERCENTAGE = 0.75;

function setUnitHealthPercentage(unit: Unit): void {
    const maxHealth = unit.GetMaxHealth();
    const newHealth = Math.floor(maxHealth * HEALTH_PERCENTAGE);

    unit.SetHealth(newHealth);
    console.log(`Set ${unit.GetName()}'s health to ${newHealth}/${maxHealth}`);
}

const onUnitSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    const percentageHealth = creature.GetHealthPct();

    if (percentageHealth < HEALTH_PERCENTAGE * 100) {
        console.log(`${creature.GetName()} spawned with ${percentageHealth}% health`);
        setUnitHealthPercentage(creature);
    } else {
        console.log(`${creature.GetName()} spawned with ${percentageHealth}% health, no adjustment needed`);
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => onUnitSpawn(...args));
```

In this example, we define a function `setUnitHealthPercentage` that takes a Unit as a parameter. It calculates the new health value based on a percentage (`HEALTH_PERCENTAGE`) of the Unit's maximum health using `unit.GetMaxHealth()`. The calculated `newHealth` value is then set using `unit.SetHealth(newHealth)`.

We then register a creature event handler for the `CREATURE_EVENT_ON_SPAWN` event. When a creature spawns, we check its current health percentage using `creature.GetHealthPct()`. If the health percentage is below the desired `HEALTH_PERCENTAGE`, we call the `setUnitHealthPercentage` function to adjust the creature's health to the specified percentage. We also log a message indicating the creature's name and the adjusted health value.

This script ensures that whenever a creature spawns with a health percentage lower than the desired value, its health is automatically adjusted to the specified percentage. This can be useful for balancing encounters or ensuring consistent health levels for certain creatures.

## SetImmuneTo
This method allows you to set a unit's immunity to a specific type of damage or mechanic. You can use this to make a unit immune to certain types of damage, such as physical damage, magic damage, or even specific mechanics like stuns or fears.

### Parameters
* immunity: number - The type of damage or mechanic to set immunity for. You can use the values from the [MechanicType](./mechanictype.md) enumeration.
* apply: boolean (optional) - If set to true (default), the immunity will be applied. If set to false, the immunity will be removed.

### Example Usage
In this example, we will create a script that makes a boss immune to physical damage and stuns when it reaches 50% health, and removes the immunities when the boss dies.

```typescript
const BOSS_ENTRY = 12345;
const PHYSICAL_DAMAGE_IMMUNITY = 1;
const STUN_MECHANIC_IMMUNITY = 12;

let bossHealthPercent = 100;
let isImmune = false;

const UpdateBossHealth: player_event_on_creature_health_changed = (event: number, player: Player, creature: Creature, healthPercent: number) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        bossHealthPercent = healthPercent;

        if (healthPercent <= 50 && !isImmune) {
            creature.SetImmuneTo(PHYSICAL_DAMAGE_IMMUNITY);
            creature.SetImmuneTo(STUN_MECHANIC_IMMUNITY);
            isImmune = true;
            creature.SendUnitYell("I am now immune to physical damage and stuns!", 0);
        }
    }
};

const RemoveBossImmunities: player_event_on_creature_death = (event: number, player: Player, creature: Creature) => {
    if (creature.GetEntry() === BOSS_ENTRY && isImmune) {
        creature.SetImmuneTo(PHYSICAL_DAMAGE_IMMUNITY, false);
        creature.SetImmuneTo(STUN_MECHANIC_IMMUNITY, false);
        isImmune = false;
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CREATURE_HEALTH_CHANGED, (...args) => UpdateBossHealth(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CREATURE_DEATH, (...args) => RemoveBossImmunities(...args));
```

In this script, we first define some constants for the boss entry and the immunity types we want to use. We also create variables to keep track of the boss's health percentage and immunity status.

In the `UpdateBossHealth` function, we check if the creature is the boss we're interested in, and update the `bossHealthPercent` variable. If the boss's health drops below 50% and it's not already immune, we set its immunities using `SetImmuneTo` and update the `isImmune` variable. We also make the boss yell to let players know it's now immune.

In the `RemoveBossImmunities` function, we check if the creature that died is the boss and if it was immune. If so, we remove its immunities using `SetImmuneTo` with `false` as the second parameter, and update the `isImmune` variable.

Finally, we register the event handlers using `RegisterPlayerEvent`.

## SetLevel
This method allows you to set the level of a unit. The level must be within the valid range for the unit's race and class combination. If an invalid level is provided, the method will fail silently.

### Parameters
* level: number - The new level to set for the unit. Must be a positive integer between 1 and the maximum level allowed for the unit's race and class.

### Example Usage
Here's an example of how you might use the SetLevel method in a script that adjusts the level of a player based on their performance in a custom event:

```typescript
// Constants for the custom event
const EVENT_REQUIRED_SCORE = 1000;
const EVENT_LEVEL_REWARD = 5;

// Event handler for the custom event completion
const OnEventComplete: player_event_on_custom_event = (event: number, player: Player, score: number) => {
    // Check if the player achieved the required score
    if (score >= EVENT_REQUIRED_SCORE) {
        // Get the player's current level
        const currentLevel = player.GetLevel();

        // Calculate the new level after the reward
        const newLevel = currentLevel + EVENT_LEVEL_REWARD;

        // Check if the new level exceeds the maximum allowed level
        const maxLevel = player.GetMaxLevel();
        if (newLevel > maxLevel) {
            // Set the player's level to the maximum allowed level
            player.SetLevel(maxLevel);
            player.SendNotification(`Congratulations! You have reached the maximum level of ${maxLevel} for completing the event.`);
        } else {
            // Set the player's level to the new level
            player.SetLevel(newLevel);
            player.SendNotification(`Congratulations! You have been rewarded with ${EVENT_LEVEL_REWARD} levels for completing the event. Your new level is ${newLevel}.`);
        }
    }
};

// Register the event handler for the custom event completion
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CUSTOM_EVENT, OnEventComplete);
```

In this example, we define a custom event that rewards players with a certain number of levels (EVENT_LEVEL_REWARD) if they achieve a certain score (EVENT_REQUIRED_SCORE). 

When a player completes the event, the OnEventComplete function is called. It checks if the player's score meets the required threshold, and if so, it calculates the player's new level by adding the EVENT_LEVEL_REWARD to their current level.

Before setting the player's level, the script checks if the new level exceeds the maximum allowed level for the player's race and class. If it does, the player's level is set to the maximum level instead, and they receive a notification informing them that they have reached the maximum level.

If the new level is valid, the player's level is set to the new level using the SetLevel method, and they receive a notification informing them of their new level and the reward they received.

This example demonstrates how the SetLevel method can be used in conjunction with other methods and game events to create custom functionality in your mod.

## SetMaxHealth
Sets the maximum health of the unit. If the unit's current health is higher than the new maximum health, the unit's health will be set to the new maximum health value.

### Parameters
* maxHealth: number - The new maximum health value for the unit.

### Example Usage
This example demonstrates how to set a player's maximum health based on their level and a custom multiplier.

```typescript
const HEALTH_MULTIPLIER = 10;

function updatePlayerHealth(player: Player): void {
    const playerLevel = player.GetLevel();
    const baseHealth = 100; // Base health at level 1
    const healthPerLevel = 50; // Additional health per level

    // Calculate the player's maximum health based on their level
    const maxHealth = baseHealth + (playerLevel - 1) * healthPerLevel;

    // Apply the custom health multiplier
    const customMaxHealth = maxHealth * HEALTH_MULTIPLIER;

    // Set the player's maximum health
    player.SetMaxHealth(customMaxHealth);

    // Set the player's current health to the new maximum health
    player.SetHealth(customMaxHealth);

    // Send a message to the player informing them about their updated health
    player.SendBroadcastMessage(`Your maximum health has been updated to ${customMaxHealth}.`);
}

// Register the player event to call the updatePlayerHealth function on login
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (event, player) => {
    updatePlayerHealth(player);
});
```

In this example:
1. We define a constant `HEALTH_MULTIPLIER` to customize the maximum health calculation.
2. The `updatePlayerHealth` function takes a `Player` object as a parameter.
3. We retrieve the player's level using `player.GetLevel()`.
4. We calculate the player's base maximum health using a formula based on their level.
5. We apply the custom health multiplier to the calculated maximum health.
6. We set the player's maximum health using `player.SetMaxHealth(customMaxHealth)`.
7. We also set the player's current health to the new maximum health using `player.SetHealth(customMaxHealth)`.
8. Finally, we send a message to the player informing them about their updated maximum health.
9. We register the `PLAYER_EVENT_ON_LOGIN` event to call the `updatePlayerHealth` function whenever a player logs in.

This example showcases how you can customize a player's maximum health based on their level and a custom multiplier. You can adjust the `HEALTH_MULTIPLIER` constant to change the scaling of the maximum health. Additionally, you can modify the base health and health per level values to suit your desired balance.

## SetMaxPower
Sets the maximum power amount for the specified power type for the Unit.

### Parameters
- type: number - The power type to set the maximum power for. Refer to the Powers enum for valid power types.
- maxPower: number - The maximum power amount to set for the specified power type.

### Returns
void

### Example Usage
Set the maximum mana for a unit based on their level and a multiplier.
```typescript
const SetUnitMaxMana = (unit: Unit, multiplier: number): void => {
    const manaPerLevel = 50;
    const unitLevel = unit.GetLevel();
    const calculatedMaxMana = unitLevel * manaPerLevel * multiplier;

    unit.SetMaxPower(Powers.POWER_MANA, calculatedMaxMana);
};

const OnSpawn: creature_event_on_spawn = (event: number, creature: Creature): void => {
    const creatureEntry = creature.GetEntry();

    switch (creatureEntry) {
        case 1234: // Mage NPC
            SetUnitMaxMana(creature, 1.5);
            break;
        case 5678: // Priest NPC
            SetUnitMaxMana(creature, 1.2);
            break;
        default:
            SetUnitMaxMana(creature, 1.0);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => OnSpawn(...args));
```

In this example, the `SetUnitMaxMana` function calculates the maximum mana for a unit based on their level and a multiplier. The multiplier is used to adjust the maximum mana for different types of units, such as mages having a higher multiplier than priests.

The `OnSpawn` event handler is registered to be called when a creature spawns. It retrieves the creature's entry ID and uses a switch statement to determine the appropriate multiplier for the creature's maximum mana based on its entry ID. It then calls the `SetUnitMaxMana` function with the creature and the corresponding multiplier.

By using this approach, you can set different maximum mana values for various types of creatures based on their entry IDs, allowing for customization and balance in your mod.

## SetName
Sets the name of the unit. This is the name that will show up when you mouse over the unit.

### Parameters
* name: string - The name to set for the unit

### Example Usage
Set a custom name for a creature based on the player that killed it
```typescript
const CUSTOM_TAG_KILLED_BY_PLAYER = "killed_by_player";

const KilledByPlayer: creature_event_on_just_died = (event, creature, killer) => {

    if(killer?.IsPlayer()) {
        let playerName = killer.GetName();
        let creatureName = creature.GetName();
        let customCreatureName = `${creatureName} <Killed by ${playerName}>`;
        
        creature.SetInt32Value(CUSTOM_TAG_KILLED_BY_PLAYER, killer.GetGUID());
        creature.SetName(customCreatureName);
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_JUST_DIED, (...args) => KilledByPlayer(...args));

const RespawnCreature: creature_event_on_spawn = (event, creature) => {
    
    let killedByPlayer = creature.GetInt32Value(CUSTOM_TAG_KILLED_BY_PLAYER);
    if(killedByPlayer > 0) {
        let playerGUID = killedByPlayer;
        let player = WorldObject.GetPlayer(playerGUID);

        if(player) {
            let playerName = player.GetName();
            let creatureName = creature.GetName();
            let customCreatureName = `${creatureName} <Killed by ${playerName}>`;

            creature.SetName(customCreatureName);
        }
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => RespawnCreature(...args));
```
This script does the following:
1. When a creature dies, it checks if the killer was a player
2. If the killer was a player, it sets a custom tag on the creature with the player's GUID
3. It then sets the creature's name to include the player's name
4. When the creature respawns, it checks if it has the custom tag set
5. If the tag is set, it gets the player's GUID from the tag
6. It then gets the player object from the GUID
7. If the player is found, it sets the creature's name to include the player's name again

This allows the creature to persist the custom name even after it respawns. The custom name will include the name of the player that killed it last.

Note: This script assumes that the creature respawn time is longer than the time it takes for the player to log out and back in. If the player logs out before the creature respawns, the player object will not be found and the custom name will not be set.

## SetNativeDisplayId
Sets the [Unit]'s native/default model ID. This model ID will be used when the unit is restored to its original state, such as after shapeshifting or when a temporary model ID is removed.

### Parameters
* displayId: number - The model ID to set as the unit's native/default model.

### Example Usage
In this example, we'll create a script that changes a player's native model ID based on their class when they log in. If the player is a warrior, their model ID will be set to a specific warrior model. If the player is a mage, their model ID will be set to a specific mage model. For all other classes, a default model ID will be used.

```typescript
const WARRIOR_MODEL_ID = 123; // Replace with the actual model ID for warriors
const MAGE_MODEL_ID = 456; // Replace with the actual model ID for mages
const DEFAULT_MODEL_ID = 789; // Replace with the default model ID for other classes

const OnLogin: player_event_on_login = (event: number, player: Player) => {
    let modelId = DEFAULT_MODEL_ID;

    switch (player.GetClass()) {
        case Classes.CLASS_WARRIOR:
            modelId = WARRIOR_MODEL_ID;
            break;
        case Classes.CLASS_MAGE:
            modelId = MAGE_MODEL_ID;
            break;
    }

    player.SetNativeDisplayId(modelId);

    // Notify the player about their native model change
    player.SendBroadcastMessage(`Your native model has been set to ID: ${modelId}`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this script:
1. We define constants for the model IDs of warriors, mages, and a default model ID for other classes.
2. When a player logs in, the `OnLogin` event is triggered.
3. We initialize the `modelId` variable with the default model ID.
4. Using a switch statement, we check the player's class using `player.GetClass()`.
   - If the player is a warrior (`Classes.CLASS_WARRIOR`), we set `modelId` to the warrior model ID.
   - If the player is a mage (`Classes.CLASS_MAGE`), we set `modelId` to the mage model ID.
   - For all other classes, `modelId` remains as the default model ID.
5. We call `player.SetNativeDisplayId(modelId)` to set the player's native model ID based on their class.
6. Finally, we send a broadcast message to the player using `player.SendBroadcastMessage()` to notify them about their native model change, including the model ID that was set.

This script demonstrates how to use `SetNativeDisplayId()` to change a unit's native model ID based on certain conditions, such as the player's class. It provides a more comprehensive example that goes beyond a simple model ID change and includes additional logic and player interaction.

## SetOwnerGUID
This method sets the owner GUID of the unit to the specified GUID. The owner GUID is used to determine the owner of the unit, such as a player's pet or a creature's summoner.

### Parameters
* guid: number - The GUID to set as the owner of the unit.

### Example Usage
Here's an example of how to use the `SetOwnerGUID` method to transfer ownership of a player's pet to another player:

```typescript
// Event handler for player login
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    // Get the player's pet
    const pet = player.GetPet();

    // Check if the player has a pet
    if (pet) {
        // Get the GUID of another player (e.g., by name)
        const otherPlayerGUID = CharDBQuery("SELECT guid FROM characters WHERE name = 'OtherPlayer'")[0].GetUInt32(0);

        // Set the owner GUID of the pet to the other player's GUID
        pet.SetOwnerGUID(otherPlayerGUID);

        // Save the pet to the database to persist the ownership change
        pet.SaveToDB();

        // Send a message to the player indicating the ownership transfer
        player.SendBroadcastMessage("Your pet's ownership has been transferred to OtherPlayer.");
    }
};

// Register the event handler for player login
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, when a player logs in, the script checks if the player has a pet. If the player has a pet, it retrieves the GUID of another player (in this case, by querying the characters table in the database using the player's name).

The script then uses the `SetOwnerGUID` method to set the owner GUID of the pet to the GUID of the other player. This effectively transfers the ownership of the pet from the original player to the other player.

After setting the owner GUID, the script saves the pet to the database using the `SaveToDB` method to persist the ownership change.

Finally, the script sends a broadcast message to the original player indicating that their pet's ownership has been transferred to the other player.

Note: This example assumes the existence of a player with the name "OtherPlayer" in the characters table of the database. Make sure to replace it with a valid player name or use a different method to obtain the GUID of the desired owner.

## SetPetGUID
Sets the GUID of the pet owned by the Unit.

### Parameters
- guid: number - The GUID of the pet to set.

### Example Usage
This example demonstrates how to set the pet GUID of a player's pet when it is summoned.

```typescript
const SUMMON_PET_SPELL_ID = 883;

const OnSpellCast: player_event_on_spell_cast = (event: number, player: Player, spell: Spell): void => {
    if (spell.GetEntry() === SUMMON_PET_SPELL_ID) {
        const pet = player.GetPet();
        if (pet) {
            const petGUID = pet.GetGUID();
            player.SetPetGUID(petGUID);

            // Store the pet's GUID in the database for future reference
            const query = `INSERT INTO player_pets (player_guid, pet_guid) VALUES (${player.GetGUID()}, ${petGUID}) ON DUPLICATE KEY UPDATE pet_guid = ${petGUID}`;
            WorldDBQuery(query);

            player.SendBroadcastMessage(`Your pet's GUID has been set to: ${petGUID}`);
        } else {
            player.SendBroadcastMessage("You do not have a pet summoned.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SPELL_CAST, (...args) => OnSpellCast(...args));
```

In this example:
1. We define a constant `SUMMON_PET_SPELL_ID` with the spell ID of the pet summoning spell.
2. We register a player event handler for the `PLAYER_EVENT_ON_SPELL_CAST` event.
3. Inside the event handler, we check if the cast spell is the pet summoning spell.
4. If the player has a pet summoned, we retrieve the pet using `player.GetPet()`.
5. We get the GUID of the pet using `pet.GetGUID()`.
6. We set the pet's GUID for the player using `player.SetPetGUID(petGUID)`.
7. We store the pet's GUID in the database using a WorldDBQuery to insert or update the record in the `player_pets` table.
8. We send a broadcast message to the player informing them of the pet's GUID.
9. If the player does not have a pet summoned, we send a broadcast message indicating that they don't have a pet.

This example showcases how to set the pet GUID for a player when their pet is summoned, store the GUID in the database for future reference, and provide feedback to the player about the operation.

## SetPower
Sets the power amount for the specified power type for the [Unit].

### Parameters
* amount: number - The amount of power to set.
* type: number - The type of power to set. This can be one of the following values from the Powers enum:
  * POWER_MANA        = 0
  * POWER_RAGE        = 1
  * POWER_FOCUS       = 2
  * POWER_ENERGY      = 3
  * POWER_HAPPINESS   = 4
  * POWER_RUNE        = 5
  * POWER_RUNIC_POWER = 6
  * MAX_POWERS        = 7
  * POWER_ALL         = 127
  * POWER_HEALTH      = 0xFFFFFFFE

### Example Usage
This script demonstrates how to set the power of a unit based on the type of power they use. It sets the power to a percentage of their maximum power for that power type.

```typescript
const POWER_PERCENTAGE = 0.5;

function SetUnitPower(unit: Unit): void {
    let powerType: number;
    switch (unit.GetClass()) {
        case Classes.CLASS_WARRIOR:
            powerType = Powers.POWER_RAGE;
            break;
        case Classes.CLASS_PALADIN:
        case Classes.CLASS_MAGE:
        case Classes.CLASS_WARLOCK:
        case Classes.CLASS_PRIEST:
            powerType = Powers.POWER_MANA;
            break;
        case Classes.CLASS_HUNTER:
            powerType = Powers.POWER_FOCUS;
            break;
        case Classes.CLASS_ROGUE:
            powerType = Powers.POWER_ENERGY;
            break;
        case Classes.CLASS_DEATH_KNIGHT:
            powerType = Powers.POWER_RUNIC_POWER;
            break;
        case Classes.CLASS_DRUID:
            powerType = unit.GetShapeshiftForm() == ShapeshiftForm.FORM_CAT ? Powers.POWER_ENERGY : Powers.POWER_MANA;
            break;
        default:
            powerType = Powers.POWER_MANA;
            break;
    }

    const maxPower = unit.GetMaxPower(powerType);
    const newPower = Math.floor(maxPower * POWER_PERCENTAGE);
    unit.SetPower(newPower, powerType);
}
```

In this example, the `SetUnitPower` function takes a [Unit](./unit.md) as a parameter. It then determines the appropriate power type for the unit based on its class using a switch statement. For some classes, like Druids, it further checks the shapeshift form to determine the correct power type.

Once the power type is determined, it calculates the maximum power for that power type using `GetMaxPower`, and then calculates a new power value based on a percentage of the maximum power.

Finally, it calls the `SetPower` method on the unit, passing in the new power value and the power type.

This script could be used in various situations, such as when a unit spawns, when they change shapeshift forms, or when they should be restored to a certain percentage of their power after an event.

## SetPowerType
Sets the power type for the unit. The power type determines which type of power the unit uses, such as mana, rage, energy, or runic power.

### Parameters
* type: [Powers](../Constants/Powers.md) - The power type to set for the unit. This can be one of the following values:
  * POWER_MANA (0)
  * POWER_RAGE (1)
  * POWER_FOCUS (2)
  * POWER_ENERGY (3)
  * POWER_HAPPINESS (4)
  * POWER_RUNE (5)
  * POWER_RUNIC_POWER (6)
  * MAX_POWERS (7)
  * POWER_ALL (127)
  * POWER_HEALTH (-2)

### Example Usage
In this example, we create a script that changes the power type of a unit based on its class when it enters combat.

```typescript
const onEnterCombat: unit_event_on_enter_combat = (event: number, unit: Unit, target: Unit) => {
    const unitClass = unit.GetClass();

    switch (unitClass) {
        case Classes.CLASS_WARRIOR:
            unit.SetPowerType(Powers.POWER_RAGE);
            break;
        case Classes.CLASS_ROGUE:
        case Classes.CLASS_DRUID:
            unit.SetPowerType(Powers.POWER_ENERGY);
            break;
        case Classes.CLASS_HUNTER:
            unit.SetPowerType(Powers.POWER_FOCUS);
            break;
        case Classes.CLASS_DEATH_KNIGHT:
            unit.SetPowerType(Powers.POWER_RUNIC_POWER);
            break;
        default:
            unit.SetPowerType(Powers.POWER_MANA);
            break;
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script, we register a callback function for the `UNIT_EVENT_ON_ENTER_COMBAT` event. When a unit enters combat, the script retrieves the unit's class using the `GetClass` method. Based on the unit's class, it sets the appropriate power type using the `SetPowerType` method.

* For warriors, it sets the power type to `POWER_RAGE`.
* For rogues and druids, it sets the power type to `POWER_ENERGY`.
* For hunters, it sets the power type to `POWER_FOCUS`.
* For death knights, it sets the power type to `POWER_RUNIC_POWER`.
* For all other classes, it defaults to `POWER_MANA`.

This script allows units to use the appropriate power type based on their class when they enter combat. It showcases how the `SetPowerType` method can be used to dynamically change the power type of units during gameplay.

## SetPvP
This method allows you to set a unit's PvP state on or off. If the unit is a player, it will enable or disable their PvP flag, which determines whether they can engage in PvP combat with other players. If the unit is a creature, it will enable or disable its ability to attack players and be attacked by players.

### Parameters
- `apply`: boolean (optional) - Determines whether to enable or disable PvP for the unit. If set to `true`, PvP will be enabled. If set to `false`, PvP will be disabled. If not provided, the default value is `true`.

### Example Usage
Here's an example of how to use the `SetPvP` method to create a script that allows players to toggle their PvP state by interacting with a special NPC:

```typescript
const NPC_ENTRY = 1234; // Replace with the actual NPC entry ID

const OnGossipHello: npc_event_on_gossip_hello = (event, player, creature) => {
    player.GossipMenuAddItem(0, "Toggle PvP", 0, 1);
    player.GossipSendMenu(creature.GetEntry(), creature.GetGUID());
};

const OnGossipSelect: npc_event_on_gossip_select = (event, player, creature, sender, action) => {
    if (action === 1) {
        if (player.IsPvP()) {
            player.SetPvP(false);
            player.SendBroadcastMessage("PvP mode disabled.");
        } else {
            player.SetPvP(true);
            player.SendBroadcastMessage("PvP mode enabled. Prepare for battle!");
        }
        player.GossipComplete();
    }
};

RegisterCreatureGossipEvent(NPC_ENTRY, (...args) => OnGossipHello(...args));
RegisterCreatureGossipEvent(NPC_ENTRY, (...args) => OnGossipSelect(...args));
```

In this example:
1. We define the entry ID of the special NPC that players will interact with to toggle their PvP state.
2. In the `OnGossipHello` event, we add a gossip menu item that allows players to toggle their PvP state.
3. In the `OnGossipSelect` event, we check if the player selected the "Toggle PvP" option (action 1).
4. If the player clicks the gossip option, we check their current PvP state using `player.IsPvP()`.
   - If PvP is currently enabled, we disable it using `player.SetPvP(false)` and send a message to the player.
   - If PvP is currently disabled, we enable it using `player.SetPvP(true)` and send a message to the player.
5. Finally, we close the gossip menu using `player.GossipComplete()`.

With this script, players can interact with the designated NPC to toggle their PvP state on or off, allowing them to engage in PvP combat when desired or avoid it when needed.

## SetRooted
This method allows you to root or unroot a unit. When a unit is rooted, it cannot move from its current position. This can be useful for various scenarios such as when a spell or ability requires the target to stay in place.

### Parameters
- `apply`: boolean (optional) - If set to `true`, the unit will be rooted. If set to `false`, the unit will be unrooted. If not provided, the default value is `true`.

### Example Usage
Here's an example of how to use `SetRooted` in a script that roots a player in place when they enter a specific area and unroots them when they leave:

```typescript
const AREA_ID = 123; // Replace with the desired area ID

const onAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, areaTrigger: AreaTrigger) => {
    if (areaTrigger.GetAreaId() === AREA_ID) {
        player.SetRooted(true);
        player.SendBroadcastMessage("You have been rooted in place!");

        // Create a timed event to unroot the player after 5 seconds
        player.RegisterEvent(CreateLuaEvent((events: LuaEvent) => {
            player.SetRooted(false);
            player.SendBroadcastMessage("You are no longer rooted.");
        }, 5000, false));
    }
};

const onAreaTriggerLeave: player_event_on_area_trigger_leave = (event: number, player: Player, areaTrigger: AreaTrigger) => {
    if (areaTrigger.GetAreaId() === AREA_ID) {
        player.SetRooted(false);
        player.SendBroadcastMessage("You have left the rooted area.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => onAreaTrigger(...args));
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER_LEAVE, (...args) => onAreaTriggerLeave(...args));
```

In this example:
1. We define a specific area ID (`AREA_ID`) that triggers the rooting effect.
2. In the `onAreaTrigger` event, when a player enters the specified area, we call `player.SetRooted(true)` to root the player in place.
3. We send a broadcast message to the player indicating that they have been rooted.
4. We create a timed event using `player.RegisterEvent` and `CreateLuaEvent` to unroot the player after 5 seconds (5000 milliseconds).
5. In the `onAreaTriggerLeave` event, when a player leaves the specified area, we call `player.SetRooted(false)` to unroot the player.
6. We send a broadcast message to the player indicating that they have left the rooted area.

This script demonstrates how you can use `SetRooted` to control a player's movement based on their presence in a specific area. You can adapt this example to suit your specific requirements, such as applying rooting effects during certain abilities or encounters.

## SetSanctuary
This method sets the [Unit]'s sanctuary flag on or off. When a unit has the sanctuary flag set, it is immune to damage and cannot be attacked by players or NPCs.

### Parameters
- `apply`: boolean (optional) - If set to `true`, the sanctuary flag will be applied. If set to `false`, the sanctuary flag will be removed. If not provided, the flag will be toggled (applied if not currently applied, removed if currently applied).

### Example Usage
This script demonstrates how to create a special NPC that grants players temporary sanctuary when interacted with.

```typescript
const SANCTUARY_NPC_ENTRY = 1234;
const SANCTUARY_DURATION = 30000; // 30 seconds

const OnGossipHello: GossipHello = (event, player, object) => {
    if (object.GetEntry() === SANCTUARY_NPC_ENTRY) {
        player.SetSanctuary(true);
        player.SendBroadcastMessage("You have been granted temporary sanctuary!");

        player.RegisterEvent(CreateLuaEvent((time, event, delay, repeats, player) => {
            player.SetSanctuary(false);
            player.SendBroadcastMessage("Your temporary sanctuary has ended.");
        }, SANCTUARY_DURATION, 1, player));

        player.GossipComplete();
    }
};

const OnGossipSelect: GossipSelect = (event, player, object, sender, intid, code, menu_id) => {
    if (object.GetEntry() === SANCTUARY_NPC_ENTRY) {
        player.GossipComplete();
    }
};

RegisterCreatureGossipEvent(SANCTUARY_NPC_ENTRY, GossipEvents.GOSSIP_EVENT_ON_HELLO, OnGossipHello);
RegisterCreatureGossipEvent(SANCTUARY_NPC_ENTRY, GossipEvents.GOSSIP_EVENT_ON_SELECT, OnGossipSelect);
```

In this example:
1. We define a special NPC with entry `SANCTUARY_NPC_ENTRY` and a sanctuary duration of 30 seconds (`SANCTUARY_DURATION`).
2. When a player interacts with the NPC (`OnGossipHello`), we set the player's sanctuary flag using `SetSanctuary(true)`.
3. We send a broadcast message to the player indicating that they have been granted temporary sanctuary.
4. We register a timed event using `RegisterEvent` and `CreateLuaEvent` that will remove the sanctuary flag after the specified duration.
5. After the duration expires, the event callback function is called, which sets the player's sanctuary flag to `false` using `SetSanctuary(false)` and sends a message to the player indicating that their temporary sanctuary has ended.
6. We also register a `OnGossipSelect` event to handle the case when the player selects an option from the NPC's gossip menu (in this case, we simply close the gossip window using `GossipComplete()`).

This script showcases how the `SetSanctuary` method can be used to grant temporary immunity to a player when interacting with a specific NPC. It also demonstrates how to use timed events to remove the sanctuary flag after a certain duration.

## SetSheath
Sets the sheath state of the unit. The sheath state determines the unit's prepared weapon and animation.

### Parameters
- `sheathState`: [SheathState](../enums/SheathState.md) - The desired sheath state for the unit.

### Example Usage
In this example, we'll create an event handler for the `CREATURE_EVENT_ON_SPAWN` event that sets the sheath state of the creature based on its entry ID.

```typescript
const ENTRY_WARRIOR_NPC = 1234;
const ENTRY_ARCHER_NPC = 5678;

const onCreatureSpawn: creature_event_on_spawn = (event: number, creature: Creature) => {
    const creatureEntry = creature.GetEntry();

    switch (creatureEntry) {
        case ENTRY_WARRIOR_NPC:
            creature.SetSheath(SheathState.SHEATH_STATE_MELEE);
            break;
        case ENTRY_ARCHER_NPC:
            creature.SetSheath(SheathState.SHEATH_STATE_RANGED);
            break;
        default:
            creature.SetSheath(SheathState.SHEATH_STATE_UNARMED);
            break;
    }

    // Additional creature setup logic...
    creature.SetEquipmentSlots(true);
    creature.SetCanFly(false);
    creature.SetDisableGravity(false);

    // Customize creature's stats based on its sheath state
    if (creature.GetSheath() === SheathState.SHEATH_STATE_MELEE) {
        creature.SetBaseWeaponDamage(BASE_ATTACK, MINDAMAGE, 50);
        creature.SetBaseWeaponDamage(BASE_ATTACK, MAXDAMAGE, 100);
    } else if (creature.GetSheath() === SheathState.SHEATH_STATE_RANGED) {
        creature.SetBaseWeaponDamage(RANGED_ATTACK, MINDAMAGE, 30);
        creature.SetBaseWeaponDamage(RANGED_ATTACK, MAXDAMAGE, 60);
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, onCreatureSpawn);
```

In this example:
1. We define constants `ENTRY_WARRIOR_NPC` and `ENTRY_ARCHER_NPC` to represent the entry IDs of warrior and archer NPCs, respectively.
2. We create an event handler function `onCreatureSpawn` for the `CREATURE_EVENT_ON_SPAWN` event.
3. Inside the event handler, we retrieve the creature's entry ID using `creature.GetEntry()`.
4. Based on the entry ID, we set the appropriate sheath state using `creature.SetSheath()`.
   - If the entry ID matches `ENTRY_WARRIOR_NPC`, we set the sheath state to `SHEATH_STATE_MELEE`.
   - If the entry ID matches `ENTRY_ARCHER_NPC`, we set the sheath state to `SHEATH_STATE_RANGED`.
   - For any other entry ID, we set the sheath state to `SHEATH_STATE_UNARMED`.
5. We perform additional creature setup, such as setting equipment slots, disabling flying and gravity.
6. Depending on the sheath state, we customize the creature's base weapon damage using `creature.SetBaseWeaponDamage()`.
   - If the sheath state is `SHEATH_STATE_MELEE`, we set the base weapon damage for melee attacks.
   - If the sheath state is `SHEATH_STATE_RANGED`, we set the base weapon damage for ranged attacks.
7. Finally, we register the event handler for the `CREATURE_EVENT_ON_SPAWN` event using `RegisterCreatureEvent()`.

This example demonstrates how to set the sheath state of a creature based on its entry ID and customize its properties accordingly.

## SetSpeed
Sets the [Unit]'s speed of a given [UnitMoveType] to the specified rate. If forced is set to true, packets will be sent to clients forcing the visual change.

### Parameters
* type: [UnitMoveType](./unitmovetype.md) - The type of movement to set the speed for.
* rate: number - The new speed rate.
* forced: boolean (optional) - If set to true, packets will be sent to clients forcing the visual change. Default: false.

### Example Usage
Script that changes a [Unit]'s speed based on its health percentage:
```typescript
const UpdateUnitSpeed: unit_event_on_health_pct_change = (event: number, unit: Unit, percentHealth: number) => {
    if (unit.IsCreature()) {
        const creature = unit.ToCreature();
        if (creature.GetEntry() === 1234) { // Replace 1234 with the desired creature entry
            let newSpeed = 1.0; // Default speed

            if (percentHealth <= 20) {
                newSpeed = 2.5; // Increase speed when health is low
            } else if (percentHealth <= 50) {
                newSpeed = 1.8; // Moderately increase speed when health is medium
            }

            creature.SetSpeed(UnitMoveType.MOVE_RUN, newSpeed);
            creature.SetSpeed(UnitMoveType.MOVE_WALK, newSpeed);
            creature.SetSpeed(UnitMoveType.MOVE_FLIGHT, newSpeed);
        }
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_HEALTH_PCT_CHANGE, (...args) => UpdateUnitSpeed(...args));
```
In this example, the script listens for the `UNIT_EVENT_ON_HEALTH_PCT_CHANGE` event. When the event is triggered, it checks if the unit is a creature with a specific entry (replace `1234` with the desired entry). If the condition is met, the script adjusts the creature's speed based on its current health percentage.

* If the creature's health is at or below 20%, the speed is set to 2.5 for running, walking, and flying.
* If the creature's health is between 21% and 50%, the speed is set to 1.8.
* If the creature's health is above 50%, the default speed of 1.0 is used.

The script uses the `SetSpeed` method to change the speed of the creature for different movement types (running, walking, and flying).

This example demonstrates how the `SetSpeed` method can be used to dynamically adjust a unit's movement speed based on certain conditions, such as its health percentage. It provides a more complex usage scenario compared to a simple one-line example.

## SetStandState
Sets the [Unit]'s stand state, which determines the visual appearance and behavior of the unit in the game world.

### Parameters
* state: number - The stand state to set for the unit. Valid values are:
  * 0 - UNIT_STAND_STATE_STAND
  * 1 - UNIT_STAND_STATE_SIT
  * 2 - UNIT_STAND_STATE_SIT_CHAIR
  * 3 - UNIT_STAND_STATE_SLEEP
  * 4 - UNIT_STAND_STATE_SIT_LOW_CHAIR
  * 5 - UNIT_STAND_STATE_SIT_MEDIUM_CHAIR
  * 6 - UNIT_STAND_STATE_SIT_HIGH_CHAIR
  * 7 - UNIT_STAND_STATE_DEAD
  * 8 - UNIT_STAND_STATE_KNEEL

### Example Usage:
Script to make a creature sit or stand based on its health percentage.
```typescript
const CREATURE_ENTRY = 1234;
const SIT_HEALTH_PERCENT = 50;

const UpdateAI: creature_event_on_aiupdate = (event: number, creature: Creature, diff: number) => {
    if (creature.GetEntry() === CREATURE_ENTRY) {
        const healthPercent = creature.GetHealthPct();

        if (healthPercent <= SIT_HEALTH_PERCENT) {
            // If the creature's health is below or equal to the sit threshold, make it sit
            creature.SetStandState(1);
        } else {
            // If the creature's health is above the sit threshold, make it stand
            creature.SetStandState(0);
        }
    }
}

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_AIUPDATE, (...args) => UpdateAI(...args));
```

In this example, the script checks the health percentage of a specific creature (identified by its entry ID) during the creature's AI update event. If the creature's health is below or equal to the `SIT_HEALTH_PERCENT` threshold, it sets the creature's stand state to 1 (UNIT_STAND_STATE_SIT), making it appear sitting. If the creature's health is above the threshold, it sets the stand state to 0 (UNIT_STAND_STATE_STAND), making the creature stand up.

This script demonstrates how the `SetStandState` method can be used to dynamically change a unit's visual appearance and behavior based on certain conditions, such as health percentage. It adds an interesting visual detail to the creature's behavior and can be used to create more immersive and interactive encounters in the game world.

## SetWaterWalk
This method allows you to toggle the water walking ability for a [Unit](./unit.md). When water walking is enabled, the unit can move across water surfaces without sinking or swimming.

### Parameters
* enable: boolean (optional) - Determines whether to enable or disable water walking for the unit. If not provided, the current state will be toggled.

### Example Usage
In this example, we create a script that allows players to toggle their water walking ability by using a specific item.

```typescript
const WATER_WALKING_ITEM_ENTRY = 12345; // Replace with the actual item entry ID

const UseWaterWalkingItem: player_event_on_use_item = (event: number, player: Player, item: Item, target: GameObject, x: number, y: number, z: number) => {
    if (item.GetEntry() === WATER_WALKING_ITEM_ENTRY) {
        // Check if the player is already water walking
        if (player.HasAura(546)) { // 546 is the spell ID for water walking
            player.SetWaterWalk(false);
            player.SendBroadcastMessage("Water walking disabled.");
        } else {
            player.SetWaterWalk(true);
            player.SendBroadcastMessage("Water walking enabled.");
        }
        
        // Prevent the item from being consumed
        player.AddItem(WATER_WALKING_ITEM_ENTRY, 1);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_USE_ITEM, (...args) => UseWaterWalkingItem(...args));
```

In this script:
1. We define a constant `WATER_WALKING_ITEM_ENTRY` to store the entry ID of the item that will toggle water walking.
2. We create a function `UseWaterWalkingItem` that will be triggered when a player uses an item.
3. Inside the function, we check if the used item's entry ID matches the `WATER_WALKING_ITEM_ENTRY`.
4. If the item matches, we check if the player already has the water walking aura (spell ID 546) using `player.HasAura(546)`.
5. If the player has the water walking aura, we disable water walking using `player.SetWaterWalk(false)` and send a message to the player indicating that water walking has been disabled.
6. If the player does not have the water walking aura, we enable water walking using `player.SetWaterWalk(true)` and send a message to the player indicating that water walking has been enabled.
7. To prevent the item from being consumed, we add the item back to the player's inventory using `player.AddItem(WATER_WALKING_ITEM_ENTRY, 1)`.
8. Finally, we register the `UseWaterWalkingItem` function to the `PLAYER_EVENT_ON_USE_ITEM` event using `RegisterPlayerEvent`.

With this script, players can use a specific item to toggle their water walking ability on and off. The item will not be consumed when used, allowing players to reuse it whenever they need to toggle water walking.

## StopSpellCast
Stops the unit's current spell cast. If a spell ID is provided, it will only stop that specific spell.

### Parameters
* spell: number (optional) - The ID of the specific spell to stop casting. If not provided, the unit's current spell cast will be stopped.

### Returns
None

### Example Usage
Interrupt a raid boss's dangerous spell cast when it reaches 50% health:
```typescript
const BOSS_ENTRY = 12345;
const DANGEROUS_SPELL_ID = 54321;

const BossAI: creature_event_on_aiupdate = (event: number, boss: Creature) => {
    if (boss.GetEntry() === BOSS_ENTRY && boss.GetHealthPct() <= 50) {
        if (boss.IsCasting()) {
            const currentSpell = boss.GetCurrentSpell();
            if (currentSpell && currentSpell.GetEntry() === DANGEROUS_SPELL_ID) {
                boss.StopSpellCast(DANGEROUS_SPELL_ID);
                boss.Yell("My spell has been interrupted! You shall pay for this!", 0);
                boss.CastSpell(boss.GetVictim(), 12345, false); // Cast a punishing spell on the tank
                boss.AddThreat(boss.GetVictim(), 5000); // Increase threat on the tank
                boss.SetInCombatWithZone(); // Ensure the boss remains in combat
            }
        }
    }
};

RegisterCreatureEvent(BOSS_ENTRY, CreatureEvents.CREATURE_EVENT_ON_AIUPDATE, (...args) => BossAI(...args));
```
In this example, we register a creature event for a raid boss using its entry ID. Inside the event handler, we check if the boss's health is at or below 50%. If the boss is casting a spell, we check if it's the dangerous spell we want to interrupt using its spell ID.

If the dangerous spell is being cast, we use `StopSpellCast` to interrupt it, passing the specific spell ID. After interrupting the spell, the boss yells a message, casts a punishing spell on the tank, increases the threat on the tank, and ensures it remains in combat with the entire zone.

This example demonstrates how `StopSpellCast` can be used strategically in a boss encounter to interrupt a critical spell cast and alter the boss's behavior in response to the interruption.

