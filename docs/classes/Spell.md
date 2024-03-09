## Cancel
Cancels the spell being cast by the unit.

### Example Usage
Cancel a spell being cast by a creature if the target is immune to the spell school.
```typescript
const onSpellCast: creature_event_on_spell_cast = (event: number, creature: Creature, target: Unit, spell: Spell) => {
    const immuneToArcane = target.IsImmune(SpellSchools.SPELL_SCHOOL_MASK_ARCANE);
    const immuneToFire = target.IsImmune(SpellSchools.SPELL_SCHOOL_MASK_FIRE);
    const immuneToFrost = target.IsImmune(SpellSchools.SPELL_SCHOOL_MASK_FROST);
    const immuneToNature = target.IsImmune(SpellSchools.SPELL_SCHOOL_MASK_NATURE);
    const immuneToShadow = target.IsImmune(SpellSchools.SPELL_SCHOOL_MASK_SHADOW);

    if (immuneToArcane || immuneToFire || immuneToFrost || immuneToNature || immuneToShadow) {
        creature.SendUnitWhisper(`${target.GetName()} is immune to ${spell.GetName()}`, 0, creature);
        spell.Cancel();
        return;
    }

    creature.SendUnitWhisper(`${spell.GetName()} was cast on ${target.GetName()}`, 0, creature);
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPELL_CAST, (...args) => onSpellCast(...args));
```

In this example, when a creature casts a spell on a target, it checks if the target is immune to the spell school using the `IsImmune` method from the `Unit` class. If the target is immune to any of the spell schools (Arcane, Fire, Frost, Nature, or Shadow), the creature will whisper a message to itself indicating that the target is immune, and then cancel the spell using the `Cancel` method from the `Spell` class. If the target is not immune, the creature will whisper a message to itself indicating that the spell was successfully cast on the target.

This script demonstrates how the `Cancel` method can be used to interrupt a spell being cast based on certain conditions, such as the target's immunities. It also showcases the usage of other methods like `GetName` from the `Unit` class and `GetName` from the `Spell` class to provide informative messages.

## Cast
Casts the spell. If `skipCheck` is true, the spell will be cast without performing any checks (such as range, mana, etc.).

### Parameters
* skipCheck?: boolean - If true, the spell will be cast without performing any checks. Defaults to false.

### Example Usage
Here's an example of a script that casts a spell on a player when they enter the world, but only if they meet certain conditions:

```typescript
const SPELL_ID = 12345;
const REQUIRED_LEVEL = 60;
const REQUIRED_ITEM = 6789;

const onLogin: player_event_on_login = (event: PlayerEvents, player: Player) => {
    const spell = new Spell(SPELL_ID, player);

    if (!spell.IsLearned()) {
        console.log(`Player ${player.GetName()} does not know the spell ${SPELL_ID}`);
        return;
    }

    if (player.GetLevel() < REQUIRED_LEVEL) {
        console.log(`Player ${player.GetName()} is not high enough level to cast the spell`);
        return;
    }

    if (!player.HasItem(REQUIRED_ITEM)) {
        console.log(`Player ${player.GetName()} does not have the required item ${REQUIRED_ITEM} to cast the spell`);
        return;
    }

    if (player.IsInCombat()) {
        console.log(`Player ${player.GetName()} is in combat and cannot cast the spell`);
        return;
    }

    spell.Cast();
    console.log(`Player ${player.GetName()} has been buffed with spell ${SPELL_ID}`);
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, onLogin);
```

In this example, we first create a new `Spell` object with the desired spell ID and the player as the caster. We then perform several checks to ensure that the player meets the requirements to cast the spell:

1. We check if the player has learned the spell using `IsLearned()`.
2. We check if the player is at least level 60 using `GetLevel()`.
3. We check if the player has a specific item in their inventory using `HasItem()`.
4. We check if the player is currently in combat using `IsInCombat()`.

If all of these checks pass, we cast the spell using `Cast()`. This will cast the spell on the player, ignoring any additional checks such as range or mana cost, since we have already verified that the player meets the necessary requirements.

Note that this is just an example, and in a real script you would likely want to perform additional checks or take other actions based on the specific requirements of your spell and the needs of your server.

## Finish
Finishes the current spell being cast by the unit.

### Parameters
None

### Returns
None

### Example Usage
This example demonstrates how to finish a spell early based on certain conditions. In this case, if the caster's health drops below 50% while casting a specific spell, the spell will be finished early.

```typescript
const SPELL_ENTRY = 12345; // Replace with the desired spell entry ID

const OnSpellCast: unit_event_on_spell_cast = (event: number, caster: Unit, spell: Spell) => {
    if (spell.GetEntry() === SPELL_ENTRY) {
        const maxHealth = caster.GetMaxHealth();
        const currentHealth = caster.GetHealth();
        const healthPercent = (currentHealth / maxHealth) * 100;

        if (healthPercent < 50) {
            spell.Finish();
            caster.SendBroadcastMessage("Spell finished early due to low health!");

            // Apply a heal or other defensive measures to help the caster survive
            const healSpellEntry = 54321; // Replace with the desired heal spell entry ID
            caster.CastSpell(caster, healSpellEntry, true);

            // Notify the caster's group members about the early spell finish
            const group = caster.GetGroup();
            if (group) {
                group.SendPacketToAllMembers(
                    `${caster.GetName()} finished their spell early due to low health!`
                );
            }
        }
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPELL_CAST, (...args) => OnSpellCast(...args));
```

In this example:
1. We define the specific spell entry ID that we want to monitor using the `SPELL_ENTRY` constant.
2. In the `OnSpellCast` event handler, we check if the spell being cast matches the desired spell entry ID.
3. We calculate the caster's current health percentage by dividing their current health by their maximum health and multiplying by 100.
4. If the health percentage is below 50%, we finish the spell early using `spell.Finish()`.
5. We send a broadcast message to the caster informing them that the spell was finished early due to low health.
6. As a defensive measure, we cast a heal spell on the caster using `caster.CastSpell()` to help them survive.
7. If the caster is in a group, we send a packet to all group members notifying them about the early spell finish.

This example showcases how you can use the `Finish()` method to prematurely end a spell based on certain conditions, such as the caster's health dropping below a certain threshold. It also demonstrates how you can incorporate additional logic, such as applying defensive measures and notifying group members, to create a more comprehensive and interactive gameplay experience.

## GetCastTime

Returns the cast time of the spell in milliseconds. This is the base cast time of the spell, before any modifiers such as haste or cast time reduction effects are applied.

### Parameters

This method does not take any parameters.

### Returns

castTime: number - The base cast time of the spell in milliseconds.

### Example Usage

```typescript
const SPELL_FIREBALL = 133;
const SPELL_FROSTBOLT = 116;
const SPELL_PYROBLAST = 11366;

const CastTimeChecker: SpellScripts = {
    OnSpellStart: (event: number, spell: Spell, caster: Unit, target: Unit) => {
        let spellId = spell.GetEntry();
        let castTime = spell.GetCastTime();

        switch (spellId) {
            case SPELL_FIREBALL:
                if (castTime < 3500) {
                    caster.ToPlayer().SendBroadcastMessage("Fireball cast time is too short! Are you cheating?");
                    spell.Cancel();
                }
                break;
            case SPELL_FROSTBOLT:
                if (castTime < 3000) {
                    caster.ToPlayer().SendBroadcastMessage("Frostbolt cast time is too short! Are you cheating?");
                    spell.Cancel();
                }
                break;
            case SPELL_PYROBLAST:
                if (castTime < 6000) {
                    caster.ToPlayer().SendBroadcastMessage("Pyroblast cast time is too short! Are you cheating?");
                    spell.Cancel();
                }
                break;
        }
    }
}

RegisterSpell(SPELL_FIREBALL, CastTimeChecker);
RegisterSpell(SPELL_FROSTBOLT, CastTimeChecker);
RegisterSpell(SPELL_PYROBLAST, CastTimeChecker);
```

In this example, we register a SpellScript for the Fireball, Frostbolt, and Pyroblast spells. When a player starts casting one of these spells, the `OnSpellStart` hook is called.

Inside the hook, we first get the spell ID using `spell.GetEntry()` and the base cast time using `spell.GetCastTime()`. 

Then, we use a switch statement to check the spell ID. For each spell, we compare the actual cast time with the expected base cast time. If the actual cast time is shorter than expected, we send a warning message to the player using `caster.ToPlayer().SendBroadcastMessage()` and cancel the spell cast using `spell.Cancel()`.

This script helps detect and prevent players from using hacks or exploits to reduce their spell cast times below the intended base values.

## GetCaster
Returns the [Unit](./unit.md) that casted the [Spell](./spell.md). This can be used to get information about the caster, such as the caster's GUID, name, or other properties.

### Parameters
None

### Returns
caster: [Unit](./unit.md) - The Unit that casted the spell.

### Example Usage
In this example, we'll create a script that will announce the name of the player who casted the spell and the spell's name whenever a player casts a spell.

```typescript
const SpellCastHandler: on_spell_cast = (event: number, spell: Spell) => {
    const caster = spell.GetCaster();

    if (!caster.IsPlayer()) {
        return;
    }

    const player = caster.ToPlayer();
    const spellName = spell.GetSpellInfo().Name;

    const message = `${player.GetName()} has casted ${spellName}!`;
    SendWorldMessage(message);

    const guildId = player.GetGuildId();
    if (guildId !== 0) {
        const guild = Guild.GetGuildById(guildId);
        if (guild) {
            guild.SendPacket(message);
        }
    }
}

RegisterServerEvent(ServerEvents.SERVER_EVENT_ON_SPELL_CAST, (...args) => SpellCastHandler(...args));
```

In this script, we first get the caster of the spell using `GetCaster()`. We then check if the caster is a player using `IsPlayer()`. If it's not a player, we return early since we only want to handle player spell casts.

If the caster is a player, we convert the caster to a Player object using `ToPlayer()`. We also get the name of the spell using `GetSpellInfo().Name`.

We then construct a message that includes the player's name and the spell name, and send it to all players in the world using `SendWorldMessage()`.

Additionally, if the player is in a guild, we get the guild using `GetGuildById()` and send the message to all members of the guild using `SendPacket()`. This way, the player's guildmates will also be notified whenever the player casts a spell.

This script showcases how you can use `GetCaster()` to get information about the caster of a spell and perform actions based on that information, such as announcing the spell cast to other players or sending notifications to the caster's guildmates.

## GetDuration
Returns the total duration of the spell in milliseconds. This duration includes the cast time, channeled time, and any other duration associated with the spell.

### Parameters
This method does not take any parameters.

### Returns
duration: number - The total duration of the spell in milliseconds.

### Example Usage
In this example, we create a script that adjusts the duration of a specific spell based on the caster's level. If the caster is below level 20, the duration is reduced by 50%. If the caster is between level 20 and 40, the duration is reduced by 25%. Otherwise, the original duration is used.

```typescript
const SPELL_ENTRY = 12345; // Replace with the actual spell entry ID

const OnSpellCast: spell_event_on_cast = (event: number, spell: Spell, caster: Unit, target: Unit | WorldObject | Item): void => {
    if (spell.GetEntry() === SPELL_ENTRY) {
        const originalDuration = spell.GetDuration();
        let newDuration = originalDuration;

        if (caster instanceof Player) {
            const casterLevel = caster.GetLevel();

            if (casterLevel < 20) {
                newDuration = Math.floor(originalDuration * 0.5);
            } else if (casterLevel >= 20 && casterLevel < 40) {
                newDuration = Math.floor(originalDuration * 0.75);
            }
        }

        if (newDuration !== originalDuration) {
            spell.SetDuration(newDuration);
            caster.SendBroadcastMessage(`The duration of the spell has been adjusted to ${newDuration} milliseconds.`);
        }
    }
};

RegisterSpellEvent(SpellEvents.SPELL_EVENT_ON_CAST, (...args) => OnSpellCast(...args));
```

In this script:
1. We define the specific spell entry ID (`SPELL_ENTRY`) that we want to modify the duration for.
2. In the `OnSpellCast` event handler, we check if the cast spell matches the desired spell entry.
3. If it matches, we retrieve the original duration of the spell using `spell.GetDuration()`.
4. We check if the caster is a player using the `instanceof` operator.
5. If the caster is a player, we get their level using `caster.GetLevel()`.
6. Based on the caster's level, we adjust the duration accordingly:
   - If the level is below 20, we reduce the duration by 50%.
   - If the level is between 20 and 40 (inclusive), we reduce the duration by 25%.
   - Otherwise, we use the original duration.
7. If the new duration is different from the original duration, we update the spell's duration using `spell.SetDuration(newDuration)`.
8. Finally, we send a broadcast message to the caster informing them about the adjusted spell duration.

This script demonstrates how you can retrieve the duration of a spell using `GetDuration()` and modify it based on certain conditions, such as the caster's level. You can customize the script to fit your specific requirements and adjust the duration based on different criteria.

## GetEntry
The `GetEntry` method returns the numeric entry ID of the [Spell]. This entry ID corresponds to the ID in the `spell_template` table in the world database. You can find more information about the spell template table in the AzerothCore wiki: [Spell Template](https://www.azerothcore.org/wiki/spell_template).

### Parameters
This method does not take any parameters.

### Returns
* `number` - The numeric entry ID of the [Spell].

### Example Usage
In this example, we create a script that checks if the spell cast by the player matches a specific entry ID. If it does, we reward the player with a special item.

```typescript
const SPELL_ENTRY_ID = 12345;
const REWARD_ITEM_ENTRY = 54321;
const REWARD_ITEM_COUNT = 1;

const OnSpellCast: player_event_on_cast_spell = (event: number, player: Player, spell: Spell): void => {
    const spellEntryId = spell.GetEntry();

    if (spellEntryId === SPELL_ENTRY_ID) {
        const rewardItem = player.AddItem(REWARD_ITEM_ENTRY, REWARD_ITEM_COUNT);

        if (rewardItem) {
            player.SendBroadcastMessage(`You have been rewarded with ${rewardItem.GetName()} for casting the special spell!`);
        } else {
            player.SendBroadcastMessage("Your inventory is full. Unable to receive the reward item.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => OnSpellCast(...args));
```

In this script:
1. We define constants for the desired spell entry ID (`SPELL_ENTRY_ID`), the reward item entry ID (`REWARD_ITEM_ENTRY`), and the count of reward items to give (`REWARD_ITEM_COUNT`).

2. We create a callback function `OnSpellCast` that takes the event type, the casting [Player], and the [Spell] as parameters.

3. Inside the callback function, we retrieve the entry ID of the cast spell using `spell.GetEntry()` and store it in the `spellEntryId` variable.

4. We compare the `spellEntryId` with the desired `SPELL_ENTRY_ID`. If they match, it means the player has cast the special spell we are interested in.

5. If the entry IDs match, we attempt to add the reward item to the player's inventory using `player.AddItem()`, passing the `REWARD_ITEM_ENTRY` and `REWARD_ITEM_COUNT` as arguments. The `AddItem` method returns the added [Item] if successful, or `null` if the player's inventory is full.

6. We check if the `rewardItem` is not `null`, indicating that the item was successfully added to the player's inventory. If it is not `null`, we send a broadcast message to the player informing them of the reward they received. If the `rewardItem` is `null`, we send a message to the player indicating that their inventory is full and they cannot receive the reward item.

7. Finally, we register the `OnSpellCast` callback function to the `PLAYER_EVENT_ON_CAST_SPELL` event using `RegisterPlayerEvent()`, so that it is triggered whenever a player casts a spell.

This script demonstrates how you can use the `GetEntry` method of the [Spell] class to check if a specific spell was cast and perform actions based on that information, such as rewarding the player with a special item.

## GetPowerCost
Returns the power cost of the spell. The power cost is the amount of mana, energy, rage, or other resource required to cast the spell.

### Parameters
None

### Returns
number - The power cost of the spell.

### Example Usage
This example demonstrates how to modify the power cost of a spell based on certain conditions. In this case, if the caster is a Mage and has the "Arcane Power" aura, the power cost of the spell is reduced by 20%.

```typescript
const SPELL_ARCANE_MISSILES = 5143;
const AURA_ARCANE_POWER = 12042;

const OnSpellCast: unit_event_on_spell_cast = (event: Unit, caster: WorldObject, spell: Spell) => {
    if (spell.GetEntry() === SPELL_ARCANE_MISSILES && caster.IsPlayer()) {
        const player = caster.ToPlayer();
        if (player.GetClass() === Classes.CLASS_MAGE && player.HasAura(AURA_ARCANE_POWER)) {
            const originalPowerCost = spell.GetPowerCost();
            const reducedPowerCost = originalPowerCost * 0.8;
            spell.SetPowerCost(reducedPowerCost);
            player.SendBroadcastMessage(`Arcane Missiles power cost reduced to ${reducedPowerCost} (originally ${originalPowerCost}) due to Arcane Power.`);
        }
    }
};

RegisterUnitEvent(UnitEvents.UNIT_EVENT_ON_SPELL_CAST, OnSpellCast);
```

In this example:
1. We define constants for the spell "Arcane Missiles" and the aura "Arcane Power".
2. In the `OnSpellCast` event handler, we check if the spell being cast is "Arcane Missiles" and if the caster is a player.
3. If the caster is a Mage and has the "Arcane Power" aura, we retrieve the original power cost of the spell using `spell.GetPowerCost()`.
4. We calculate the reduced power cost by multiplying the original power cost by 0.8 (20% reduction).
5. We set the new power cost of the spell using `spell.SetPowerCost(reducedPowerCost)`.
6. Finally, we send a broadcast message to the player indicating the power cost reduction.

This example showcases how you can use the `GetPowerCost()` method to retrieve the current power cost of a spell and modify it based on specific conditions or effects.

## GetReagentCost
Returns an array of objects representing the reagents required to cast the spell. Each object in the array contains the ItemTemplateId and the Count of the reagent needed.

### Parameters
None

### Returns
An array of objects with the following structure:
```typescript
{
  ItemTemplateId: number,
  Count: number
}[]
```

### Example Usage
```typescript
const SPELL_ID = 12345; // Replace with the desired spell ID

const onPlayerCastSpell: player_event_on_cast_spell = (event: number, player: Player, spell: Spell, skipCheck: boolean) => {
  const reagents = spell.GetReagentCost();

  // Check if the player has the required reagents
  for (const reagent of reagents) {
    const itemTemplateId = reagent.ItemTemplateId;
    const requiredCount = reagent.Count;

    const item = player.GetItemByEntry(itemTemplateId);
    if (!item || item.GetCount() < requiredCount) {
      player.SendBroadcastMessage(`You do not have enough reagents to cast this spell.`);
      player.InterruptSpell();
      return;
    }
  }

  // Consume the reagents
  for (const reagent of reagents) {
    const itemTemplateId = reagent.ItemTemplateId;
    const requiredCount = reagent.Count;

    player.RemoveItem(itemTemplateId, requiredCount);
  }

  // Allow the spell to be cast
  return true;
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CAST_SPELL, (...args) => onPlayerCastSpell(...args));
```

In this example, when a player attempts to cast a spell, the `onPlayerCastSpell` event is triggered. The script retrieves the reagent cost of the spell using the `GetReagentCost()` method.

It then iterates over the reagents and checks if the player has the required items in their inventory. If the player doesn't have enough of any reagent, an error message is sent to the player, and the spell is interrupted using `player.InterruptSpell()`.

If the player has all the required reagents, the script proceeds to consume the reagents by removing the appropriate amount of each item from the player's inventory using `player.RemoveItem()`.

Finally, the script returns `true` to allow the spell to be cast successfully.

Note: Make sure to replace `SPELL_ID` with the actual ID of the spell you want to check the reagent cost for.

This example demonstrates how to use the `GetReagentCost()` method to retrieve the reagent cost of a spell, check if the player has the required reagents, consume the reagents if available, and allow or interrupt the spell casting based on the availability of the reagents.

## GetTarget
Returns the target of the spell. The target can be any of the following types:
- [Player](./player.md)
- [Creature](./creature.md)
- [GameObject](./gameobject.md)
- [Item](./item.md)
- [Corpse](./corpse.md)

### Parameters
None

### Returns
[Object](./object.md) - The target of the spell.

### Example Usage
This example demonstrates how to use `GetTarget()` to retrieve the target of a spell and perform different actions based on the target's type.

```typescript
const OnSpellCast: SpellCastFnType = (event: SpellCastEvents, spell: Spell, caster: WorldObject): SpellCastResult => {
    const target = spell.GetTarget();

    if (target instanceof Player) {
        // If the target is a player, send a message to the caster
        caster.SendBroadcastMessage(`You have cast a spell on player ${target.GetName()}!`);
    } else if (target instanceof Creature) {
        // If the target is a creature, check its entry ID
        const creatureEntry = target.GetEntry();
        if (creatureEntry === 12345) {
            // If the creature has a specific entry ID, apply a buff to the caster
            caster.CastSpell(caster, 56789, true);
        }
    } else if (target instanceof GameObject) {
        // If the target is a game object, activate it
        target.UseDoorOrButton(0, false, caster.ToPlayer());
    } else if (target instanceof Item) {
        // If the target is an item, check its entry ID and perform an action
        const itemEntry = target.GetEntry();
        if (itemEntry === 23456) {
            // If the item has a specific entry ID, cast a spell on the caster
            caster.CastSpell(caster, 34567, true);
        }
    } else if (target instanceof Corpse) {
        // If the target is a corpse, resurrect it
        target.Resurrect();
    }

    return SpellCastResult.SPELL_CAST_OK;
};

RegisterSpellEvent(SpellEvents.SPELL_EVENT_ON_CAST, (...args) => OnSpellCast(...args));
```

In this example:
1. The `GetTarget()` method is used to retrieve the target of the spell.
2. The target is checked using `instanceof` to determine its type.
3. Different actions are performed based on the target's type:
   - If the target is a player, a message is sent to the caster.
   - If the target is a creature with a specific entry ID, a buff is applied to the caster.
   - If the target is a game object, it is activated.
   - If the target is an item with a specific entry ID, a spell is cast on the caster.
   - If the target is a corpse, it is resurrected.
4. The spell cast result is returned as `SPELL_CAST_OK`.

This example showcases how `GetTarget()` can be used to retrieve the target of a spell and perform different actions based on the target's type, allowing for dynamic and interactive spell behavior.

## GetTargetDest
Returns the target destination coordinates of the spell as a tuple of three numbers representing the x, y, and z coordinates.

### Parameters
None

### Returns
[number, number, number] - A tuple of three numbers representing the x, y, and z coordinates of the spell's target destination.

### Example Usage
This example demonstrates how to use the `GetTargetDest` method to determine the landing position of a spell and spawn a creature at that location.

```typescript
const SPELL_ID = 12345; // Replace with the desired spell ID
const CREATURE_ENTRY = 54321; // Replace with the desired creature entry

const onSpellCast: on_spell_event = (event: OnSpellEventType, caster: WorldObject, spell: Spell, skipCheck: boolean): void => {
    if (spell.GetEntry() === SPELL_ID) {
        const [x, y, z] = spell.GetTargetDest();

        // Adjust the spawn position slightly above the ground
        const spawnZ = z + 0.5;

        // Spawn the creature at the spell's target destination
        caster.GetMap().SpawnCreature(CREATURE_ENTRY, x, y, spawnZ, 0, 3, 0);

        // You can also perform additional actions or checks based on the target destination
        if (x > 0 && y > 0) {
            // Example: If the spell lands in the positive X and Y quadrant, grant a buff to the caster
            if (caster instanceof Player) {
                const BUFF_SPELL_ID = 54321; // Replace with the desired buff spell ID
                caster.AddAura(BUFF_SPELL_ID, caster);
            }
        }
    }
};

RegisterServerEvent(ServerEvents.AI_EVENT_ON_SPELL_CAST, (...args) => onSpellCast(...args));
```

In this example:
1. We define the desired spell ID (`SPELL_ID`) and the creature entry (`CREATURE_ENTRY`) that we want to spawn at the spell's target destination.
2. In the `onSpellCast` event handler, we check if the cast spell matches the desired spell ID.
3. If the spell ID matches, we retrieve the target destination coordinates using `spell.GetTargetDest()` and store them in variables `x`, `y`, and `z`.
4. We adjust the spawn position slightly above the ground by adding a small value to the `z` coordinate and store it in `spawnZ`.
5. We use `caster.GetMap().SpawnCreature()` to spawn the creature at the spell's target destination using the adjusted spawn position.
6. Additionally, we perform a check to see if the spell lands in the positive X and Y quadrant (i.e., both `x` and `y` are greater than 0).
7. If the caster is a player and the spell lands in the positive quadrant, we grant a buff to the caster using `caster.AddAura()` with the specified buff spell ID.

This example showcases how to utilize the `GetTargetDest` method to retrieve the spell's target destination coordinates and perform actions based on that information, such as spawning a creature or granting a buff to the caster depending on the landing position.

## IsAutoRepeat
Returns a boolean value indicating whether the spell is automatically repeating or not.

### Parameters
None

### Returns
boolean - `true` if the spell is automatically repeating, `false` otherwise.

### Example Usage
This example demonstrates how to check if a spell is automatically repeating and adjust the spell's behavior accordingly.

```typescript
const SPELL_SHOOT = 3018;
const SPELL_AUTO_SHOT = 75;

const onSpellCast: player_event_on_spell_cast = (event: number, player: Player, spell: Spell, skipCheck: boolean) => {
    if (spell.GetEntry() === SPELL_SHOOT || spell.GetEntry() === SPELL_AUTO_SHOT) {
        if (spell.IsAutoRepeat()) {
            // Spell is automatically repeating
            const autoRepeatCount = player.GetData("autoRepeatCount") || 0;
            player.SetData("autoRepeatCount", autoRepeatCount + 1);

            if (autoRepeatCount >= 5) {
                // Cancel the auto-repeat after 5 repetitions
                player.CastSpell(player, SPELL_SHOOT, true);
                player.SetData("autoRepeatCount", 0);
            }
        } else {
            // Spell is not automatically repeating
            player.SendBroadcastMessage("You have manually cast the spell.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SPELL_CAST, (...args) => onSpellCast(...args));
```

In this example:
1. We define constants for the spell IDs of "Shoot" and "Auto Shot".
2. In the `PLAYER_EVENT_ON_SPELL_CAST` event handler, we check if the cast spell is either "Shoot" or "Auto Shot".
3. If the spell is automatically repeating (checked using `spell.IsAutoRepeat()`), we increment a counter stored in the player's data to keep track of the number of repetitions.
4. If the auto-repeat count reaches 5, we cancel the auto-repeat by manually casting the "Shoot" spell on the player and reset the auto-repeat count.
5. If the spell is not automatically repeating, we send a broadcast message to the player indicating that they have manually cast the spell.

This example showcases how the `IsAutoRepeat()` method can be used to determine if a spell is automatically repeating and make decisions based on that information, such as canceling the auto-repeat after a certain number of repetitions or performing specific actions for manually cast spells.

## SetAutoRepeat
Sets the [Spell] to automatically repeat.

### Parameters
* repeat: boolean - If 'true', the spell will automatically repeat, if 'false', the spell will not automatically repeat.

### Example Usage
This script demonstrates how to create a custom spell that will automatically repeat until the player cancels it or runs out of mana.

```typescript
// Create a custom spell ID
const CUSTOM_SPELL_ID = 123456;

// Create a spell script for the custom spell
const SpellScript = {
    canCast: function(caster: Unit, target: Unit, spell: Spell): SpellCastResult {
        // Only allow the spell to be cast by players
        if (!caster.IsPlayer()) {
            return SpellCastResult.SPELL_FAILED_DONT_REPORT;
        }
        return SpellCastResult.SPELL_CAST_OK;
    },

    onCast: function(caster: Unit, target: Unit, spell: Spell): void {
        // Enable auto-repeat for the spell
        spell.SetAutoRepeat(true);
    },

    onHit: function(caster: Unit, target: Unit, spell: Spell): void {
        // Deal damage to the target
        caster.DealDamage(target, 100, true);
    },

    onAfterCast: function(caster: Unit, target: Unit, spell: Spell): void {
        // Check if the caster has enough mana to cast the spell again
        const player = caster.ToPlayer();
        if (!player || player.GetPower(Powers.POWER_MANA) < spell.GetPowerCost()) {
            // Cancel the auto-repeat if the player doesn't have enough mana
            spell.SetAutoRepeat(false);
        }
    }
};

// Register the spell script
RegisterSpellScript(CUSTOM_SPELL_ID, SpellScript);
```

In this example, we create a custom spell with the ID `123456`. We then register a spell script for this custom spell.

In the `canCast` function, we check if the caster is a player. If not, we return `SPELL_FAILED_DONT_REPORT` to prevent the spell from being cast.

In the `onCast` function, we enable auto-repeat for the spell using `spell.SetAutoRepeat(true)`. This will cause the spell to automatically repeat until it is canceled or the player runs out of mana.

In the `onHit` function, we deal damage to the target using `caster.DealDamage(target, 100, true)`. This will deal 100 damage to the target each time the spell hits.

Finally, in the `onAfterCast` function, we check if the player has enough mana to cast the spell again. We do this by getting the player object using `caster.ToPlayer()` and then checking their current mana using `player.GetPower(Powers.POWER_MANA)`. If the player doesn't have enough mana to cast the spell again, we cancel the auto-repeat using `spell.SetAutoRepeat(false)`.

With this script, players will be able to cast the custom spell, which will automatically repeat until they cancel it or run out of mana. Each time the spell hits a target, it will deal 100 damage.

