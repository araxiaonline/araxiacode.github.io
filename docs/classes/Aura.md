## GetAuraId
Returns the ID of the [Spell](./spell.md) that caused this [Aura](./aura.md) to be applied.

### Parameters
None

### Returns
spellId: number - The ID of the spell that caused this aura to be applied.

### Example Usage
Suppose you want to create a script that checks if a player has a specific aura applied, and if so, grant them additional benefits. In this example, we'll check if the player has the "Blessing of Might" aura (spell ID 19740) and if they do, we'll grant them an additional 10% attack power bonus.

```typescript
const BLESSING_OF_MIGHT_SPELL_ID = 19740;
const ATTACK_POWER_BONUS_PERCENT = 10;

const OnPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    const auras = player.GetAuras();

    for (const aura of auras) {
        if (aura.GetAuraId() === BLESSING_OF_MIGHT_SPELL_ID) {
            const currentAP = player.GetAttackPower();
            const bonusAP = Math.floor(currentAP * (ATTACK_POWER_BONUS_PERCENT / 100));

            player.SetAttackPower(currentAP + bonusAP);

            player.SendBroadcastMessage(`You have been granted an additional ${ATTACK_POWER_BONUS_PERCENT}% Attack Power due to your Blessing of Might!`);
            break;
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnPlayerLogin(...args));
```

In this script:
1. We define constants for the Blessing of Might spell ID and the attack power bonus percentage.
2. We register a player event handler for the "On Login" event.
3. When a player logs in, we retrieve all their currently applied auras using `player.GetAuras()`.
4. We iterate through each aura and check if its ID matches the Blessing of Might spell ID using `aura.GetAuraId()`.
5. If a match is found, we calculate the player's current attack power and determine the bonus attack power based on the percentage.
6. We update the player's attack power using `player.SetAttackPower()`, adding the bonus attack power to their current value.
7. Finally, we send a broadcast message to the player informing them of the additional attack power granted due to their Blessing of Might aura.

This example demonstrates how you can use the `GetAuraId()` method to check for specific auras on a player and perform actions based on their presence.

## GetCaster
Returns the Unit that casted the Spell which caused this Aura to be applied on the target.

### Parameters
None

### Returns
[Unit](./unit.md) - The Unit that casted the Spell which caused this Aura to be applied.

### Example Usage
This example demonstrates how to use the `GetCaster` method to identify the caster of an Aura and take different actions based on the caster's entry ID.

```typescript
const OnEffectApply: aura_effect_script_on_effect_apply = (auraEffectId: number, aurEff: AuraEffect, eventInfo: SpellEventInfo): void => {
    const aura = aurEff.GetBase();
    const caster = aura.GetCaster();

    if (!caster) {
        return;
    }

    const casterEntry = caster.GetEntry();

    switch (casterEntry) {
        case 12345: // Entry ID of a specific NPC
            // Perform actions specific to this NPC's aura
            aurEff.GetTarget().SendBroadcastMessage('You have been affected by a special aura from NPC 12345!');
            break;
        case 67890: // Entry ID of another NPC
            // Perform actions specific to this NPC's aura
            aurEff.GetTarget().CastSpell(aurEff.GetTarget(), 54321, true); // Cast a spell on the target
            break;
        default:
            // Perform default actions for other casters
            aurEff.GetTarget().AddAura(99999, aurEff.GetTarget()); // Apply another aura to the target
            break;
    }
};

RegisterAuraEffectEvent(12345, AuraEffectEvents.AURA_EFFECT_ON_APPLY, OnEffectApply);
```

In this example:

1. We register an event handler for the `AURA_EFFECT_ON_APPLY` event using `RegisterAuraEffectEvent`.
2. When the event is triggered, the `OnEffectApply` function is called.
3. We retrieve the `Aura` object using `aurEff.GetBase()`.
4. We get the caster of the Aura using `aura.GetCaster()` and store it in the `caster` variable.
5. We check if the `caster` is valid (not `null`). If it's `null`, we return early since there's no caster to handle.
6. We retrieve the entry ID of the caster using `caster.GetEntry()`.
7. We use a `switch` statement to perform different actions based on the caster's entry ID.
   - If the caster's entry ID matches a specific NPC (e.g., 12345), we send a broadcast message to the target.
   - If the caster's entry ID matches another NPC (e.g., 67890), we cast a spell on the target using `aurEff.GetTarget().CastSpell()`.
   - For any other caster, we apply a default aura to the target using `aurEff.GetTarget().AddAura()`.

This example demonstrates how `GetCaster` can be used to identify the caster of an Aura and perform different actions based on the caster's identity. It allows for customized behavior depending on the NPC or entity that applied the Aura.

## GetCasterGUID
Returns the GUID of the [Unit](./unit.md) that casted the [Spell](./spell.md) which caused this [Aura](./aura.md) to be applied on the target. This can be useful for determining the source of an aura, whether it was from a player, creature, or other entity.

### Parameters
None

### Returns
string - The GUID of the caster unit as a string.

### Example Usage
In this example, we'll create a script that listens for the `AURA_EVENT_ON_APPLY` event and checks if the aura was applied by a player. If so, it will send a message to the player indicating who cast the aura on them.

```typescript
const OnAuraApply: aura_event_on_apply = (event: AuraEvents, aura: Aura, isApply: boolean) => {
    // Get the caster GUID of the aura
    const casterGuid = aura.GetCasterGUID();

    // Check if the caster is a player
    if (IsPlayer(casterGuid)) {
        const caster = GetPlayerByGUID(casterGuid);
        const target = aura.GetOwner();

        // Send a message to the target player
        target.SendBroadcastMessage(`The aura ${aura.GetSpellId()} was applied to you by ${caster.GetName()}.`);

        // Send a message to the caster player
        caster.SendBroadcastMessage(`You applied the aura ${aura.GetSpellId()} to ${target.GetName()}.`);
    }
};

RegisterAuraEvent(AuraEvents.AURA_EVENT_ON_APPLY, (args: AuraEvents) => OnAuraApply(args[0], args[1], args[2]));
```

In this script:
1. We register a listener for the `AURA_EVENT_ON_APPLY` event using `RegisterAuraEvent`.
2. When an aura is applied, the `OnAuraApply` function is called with the event type, the aura object, and a boolean indicating if the aura is being applied (true) or removed (false).
3. We retrieve the caster GUID of the aura using `aura.GetCasterGUID()`.
4. We check if the caster is a player using the `IsPlayer` function.
5. If the caster is a player, we retrieve the caster player object using `GetPlayerByGUID`.
6. We also retrieve the target unit (the unit the aura was applied to) using `aura.GetOwner()`.
7. We send a message to the target player using `target.SendBroadcastMessage`, informing them who cast the aura on them.
8. We send a message to the caster player using `caster.SendBroadcastMessage`, confirming that they applied the aura to the target.

This script demonstrates how to use the `GetCasterGUID` method to retrieve the caster of an aura and perform actions based on that information, such as sending messages to the involved players.

## GetCasterLevel

Returns the level of the [Unit](./unit.md) that casted the [Spell](./spell.md) which caused this [Aura](./aura.md) to be applied.

### Parameters

This method does not take any parameters.

### Returns

* number - The level of the caster [Unit](./unit.md) at the time the [Aura](./aura.md) was applied.

### Example Usage

In this example, we will create a script that adjusts the duration of an [Aura](./aura.md) based on the level of the caster. If the caster's level is below 50, the duration will be reduced by half. If the caster's level is 50 or above, the duration will be increased by 50%.

```typescript
const AURA_ENTRY = 12345; // Replace with the desired aura entry ID

const AuraApply: aura_event_on_apply = (event: number, aura: Aura, target: Unit): void => {
    const casterLevel = aura.GetCasterLevel();
    const currentDuration = aura.GetDuration();

    if (casterLevel < 50) {
        // If the caster's level is below 50, reduce the duration by half
        const newDuration = currentDuration / 2;
        aura.SetDuration(newDuration);
        console.log(`Aura ${AURA_ENTRY} duration reduced to ${newDuration} milliseconds due to low caster level.`);
    } else {
        // If the caster's level is 50 or above, increase the duration by 50%
        const newDuration = currentDuration * 1.5;
        aura.SetDuration(newDuration);
        console.log(`Aura ${AURA_ENTRY} duration increased to ${newDuration} milliseconds due to high caster level.`);
    }
};

const AuraRemove: aura_event_on_remove = (event: number, aura: Aura, target: Unit): void => {
    const casterLevel = aura.GetCasterLevel();
    console.log(`Aura ${AURA_ENTRY} removed. Caster level was ${casterLevel}.`);
};

RegisterAuraEvent(AURA_ENTRY, AuraEvents.AURA_EVENT_ON_APPLY, (...args) => AuraApply(...args));
RegisterAuraEvent(AURA_ENTRY, AuraEvents.AURA_EVENT_ON_REMOVE, (...args) => AuraRemove(...args));
```

In this script:
1. We define the desired aura entry ID (`AURA_ENTRY`) that we want to modify.
2. In the `AuraApply` event handler, we retrieve the caster's level using `aura.GetCasterLevel()` and the current duration of the aura using `aura.GetDuration()`.
3. If the caster's level is below 50, we calculate a new duration by dividing the current duration by 2 and update the aura's duration using `aura.SetDuration()`. We also log a message indicating the reduced duration.
4. If the caster's level is 50 or above, we calculate a new duration by multiplying the current duration by 1.5 and update the aura's duration using `aura.SetDuration()`. We log a message indicating the increased duration.
5. In the `AuraRemove` event handler, we retrieve the caster's level using `aura.GetCasterLevel()` and log a message indicating the caster's level when the aura is removed.
6. Finally, we register the event handlers for the `AURA_EVENT_ON_APPLY` and `AURA_EVENT_ON_REMOVE` events using `RegisterAuraEvent()`.

This script demonstrates how to use the `GetCasterLevel()` method to retrieve the caster's level and adjust the behavior of an aura based on that level.

## GetDuration
Returns the remaining duration of the aura in milliseconds. If the aura is permanent, it will return -1.

### Parameters
None

### Returns
duration: number - The remaining duration of the aura in milliseconds, or -1 if the aura is permanent.

### Example Usage
In this example, we create a script that checks the remaining duration of a specific aura on the player whenever they enter combat. If the duration is below a certain threshold, the script will cast a spell to refresh the aura.

```typescript
const AURA_ENTRY = 12345; // Replace with the actual aura entry ID
const REFRESH_SPELL_ID = 67890; // Replace with the actual spell ID to refresh the aura
const DURATION_THRESHOLD = 30000; // Refresh the aura when it has less than 30 seconds remaining

const OnEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const auras = player.GetAuras();

    for (const aura of auras) {
        if (aura.GetSpellId() === AURA_ENTRY) {
            const remainingDuration = aura.GetDuration();

            if (remainingDuration !== -1 && remainingDuration < DURATION_THRESHOLD) {
                player.CastSpell(player, REFRESH_SPELL_ID, true);
                player.SendBroadcastMessage(`Refreshing aura ${AURA_ENTRY} with spell ${REFRESH_SPELL_ID}`);
            }

            break;
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => OnEnterCombat(...args));
```

In this script:
1. We define constants for the specific aura entry ID, the spell ID to refresh the aura, and the duration threshold at which we want to refresh the aura.
2. We register the `OnEnterCombat` event handler for the `PLAYER_EVENT_ON_ENTER_COMBAT` event.
3. Inside the event handler, we retrieve the player's current auras using `player.GetAuras()`.
4. We iterate through the auras and check if any of them match the desired aura entry ID.
5. If a matching aura is found, we use `aura.GetDuration()` to retrieve its remaining duration.
6. If the remaining duration is not -1 (indicating a non-permanent aura) and is below the specified threshold, we cast the refresh spell on the player using `player.CastSpell()`.
7. We also send a broadcast message to the player indicating that the aura has been refreshed.
8. Finally, we break out of the loop since we have found and processed the desired aura.

This script ensures that the specified aura is always active on the player during combat by refreshing it whenever its remaining duration falls below the defined threshold.

## GetMaxDuration
Returns the maximum duration of the aura in milliseconds. This is the amount of time the aura lasts when it is first applied to the unit. To determine how much time has passed since the aura was applied, subtract the result of [Aura:GetDuration](./aura.md#getduration) from the result of this method.

### Parameters
None

### Returns
duration: number - The maximum duration of the aura in milliseconds.

### Example Usage
Create a script that checks if a player's aura has exceeded half of its maximum duration. If it has, the script will remove the aura and apply a new aura with a different spell ID.

```typescript
const AURA_SPELL_ID = 12345;
const NEW_AURA_SPELL_ID = 67890;

const CheckAuraDuration: player_event_on_update = (event: number, player: Player, diff: number) => {
    const aura = player.GetAura(AURA_SPELL_ID);

    if (aura) {
        const maxDuration = aura.GetMaxDuration();
        const remainingDuration = aura.GetDuration();

        if (remainingDuration < (maxDuration / 2)) {
            player.RemoveAura(AURA_SPELL_ID);
            player.AddAura(NEW_AURA_SPELL_ID, player);

            player.SendBroadcastMessage("Your aura has been replaced with a new one!");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_UPDATE, (...args) => CheckAuraDuration(...args));
```

In this example:
1. We define the spell IDs for the original aura and the new aura that will replace it.
2. In the `CheckAuraDuration` function, we first check if the player has the aura with the specified `AURA_SPELL_ID`.
3. If the player has the aura, we get the maximum duration of the aura using `GetMaxDuration()` and the remaining duration using `GetDuration()`.
4. We then check if the remaining duration is less than half of the maximum duration.
5. If the remaining duration is less than half, we remove the original aura using `RemoveAura()` and add the new aura using `AddAura()`.
6. Finally, we send a broadcast message to the player informing them that their aura has been replaced.

This script demonstrates how to use the `GetMaxDuration()` method to compare the remaining duration of an aura with its maximum duration and take action based on the result.

## GetOwner
Returns the [Unit](./unit.md) that the [Aura](./aura.md) has been applied to. This can be useful for determining who the aura belongs to and performing actions based on the owner.

### Parameters
None

### Returns
[Unit](./unit.md) - The unit that the aura belongs to.

### Example Usage
In this example, we'll create a script that checks if a player has a specific aura when they enter combat. If they do, we'll cast a spell on the aura's owner.

```typescript
const AURA_ENTRY = 12345;
const SPELL_ID = 67890;

const onEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const auras = player.GetAuras();

    for (const aura of auras) {
        if (aura.GetSpellId() === AURA_ENTRY) {
            const owner = aura.GetOwner();

            if (owner && owner.IsPlayer()) {
                const ownerPlayer = owner.ToPlayer();

                if (ownerPlayer) {
                    ownerPlayer.CastSpell(ownerPlayer, SPELL_ID, true);
                    ownerPlayer.SendBroadcastMessage("You have been blessed with a special spell!");
                }
            }

            break;
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onEnterCombat(...args));
```

In this script:

1. We define the `AURA_ENTRY` constant with the entry ID of the aura we want to check for.
2. We define the `SPELL_ID` constant with the ID of the spell we want to cast on the aura's owner.
3. In the `onEnterCombat` event handler, we retrieve the player's auras using `player.GetAuras()`.
4. We loop through each aura and check if its spell ID matches the `AURA_ENTRY` we're looking for.
5. If a matching aura is found, we use `aura.GetOwner()` to retrieve the owner of the aura.
6. We check if the owner exists and is a player using `owner.IsPlayer()`.
7. If the owner is a player, we use `owner.ToPlayer()` to convert the owner to a `Player` object.
8. We cast a spell on the owner player using `ownerPlayer.CastSpell()` with the `SPELL_ID` and set the triggered flag to `true`.
9. We send a broadcast message to the owner player using `ownerPlayer.SendBroadcastMessage()` to inform them about the special spell.
10. We break out of the loop since we found the desired aura.

This script demonstrates how `GetOwner()` can be used to retrieve the unit that an aura belongs to and perform actions based on the owner's information.

## GetStackAmount
Returns the current stack amount of the aura. This is the same value that is displayed on the aura's icon in-game.

### Parameters
None

### Returns
number - The current stack amount of the aura.

### Example Usage
In this example, we'll create a script that checks if a player has the "Blessing of Might" aura and, if so, grant them additional attack power based on the aura's stack amount.

```typescript
const BLESSING_OF_MIGHT_SPELL_ID = 19740;
const ATTACK_POWER_PER_STACK = 10;

const OnPlayerEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {
    const blessingOfMight = player.GetAura(BLESSING_OF_MIGHT_SPELL_ID);

    if (blessingOfMight) {
        const stackAmount = blessingOfMight.GetStackAmount();
        const bonusAttackPower = stackAmount * ATTACK_POWER_PER_STACK;

        player.SetInt32Value(UnitFields.UNIT_FIELD_ATTACK_POWER_MOD_POS, player.GetInt32Value(UnitFields.UNIT_FIELD_ATTACK_POWER_MOD_POS) + bonusAttackPower);
        player.SetInt32Value(UnitFields.UNIT_FIELD_ATTACK_POWER, player.GetInt32Value(UnitFields.UNIT_FIELD_ATTACK_POWER) + bonusAttackPower);

        player.SendAreaTriggerMessage(`Your Blessing of Might grants you ${bonusAttackPower} additional attack power!`);
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => OnPlayerEnterCombat(...args));
```

In this script:

1. We define constants for the Blessing of Might spell ID and the amount of attack power to grant per stack.

2. When a player enters combat, we check if they have the Blessing of Might aura using `player.GetAura(BLESSING_OF_MIGHT_SPELL_ID)`.

3. If the player has the aura, we retrieve the current stack amount using `blessingOfMight.GetStackAmount()`.

4. We calculate the bonus attack power based on the stack amount and the defined attack power per stack.

5. We update the player's attack power by modifying the `UNIT_FIELD_ATTACK_POWER_MOD_POS` and `UNIT_FIELD_ATTACK_POWER` fields using `player.SetInt32Value()`.

6. Finally, we send a message to the player indicating the amount of additional attack power they have gained from their Blessing of Might stacks.

This script demonstrates how to use the `GetStackAmount()` method to retrieve the current stack amount of an aura and utilize that information to provide gameplay benefits to the player based on the aura's stacks.

## Remove
Removes the aura from the unit it is applied to. This will stop any effects the aura was applying to the unit.

### Example Usage:
```typescript
// Spell ID for "Blessing of Kings"
const BLESSING_OF_KINGS = 25898;

// Function to remove Blessing of Kings from the player if they have it
const RemoveBlessingOfKings = (player: Player) => {
    // Get the player's auras
    const auras = player.GetAuras();

    // Loop through each aura
    for (const aura of auras) {
        // Check if the aura's spell ID matches Blessing of Kings
        if (aura.GetSpellId() === BLESSING_OF_KINGS) {
            // Remove the aura
            aura.Remove();

            // Inform the player
            player.SendBroadcastMessage("Blessing of Kings has been removed.");

            // Exit the loop since we found and removed the aura
            break;
        }
    }
};

// Register an event to call RemoveBlessingOfKings when a player talks to an NPC
RegisterServerEvent(ServerEvents.CREATURE_EVENT_ON_GOSSIP_HELLO, (event: number, player: Player, creature: Creature) => {
    // Check if the player has the aura before removing it
    if (player.HasAura(BLESSING_OF_KINGS)) {
        RemoveBlessingOfKings(player);
    } else {
        player.SendBroadcastMessage("You don't have Blessing of Kings.");
    }
});
```
In this example, we define a function `RemoveBlessingOfKings` that takes a `Player` object as a parameter. Inside the function, we retrieve the player's auras using `GetAuras()`, then loop through each aura to check if its spell ID matches the ID for Blessing of Kings (25898).

If a match is found, we call the `Remove()` method on the aura to remove it from the player. We also send a message to the player informing them that the aura has been removed. After removing the aura, we break out of the loop since there's no need to continue searching.

Finally, we register a server event using `RegisterServerEvent` to call `RemoveBlessingOfKings` when a player interacts with an NPC (CREATURE_EVENT_ON_GOSSIP_HELLO). Before attempting to remove the aura, we first check if the player actually has the aura using `HasAura()`. If they do, we call `RemoveBlessingOfKings` to remove it. If they don't, we send a message informing them that they don't have the aura.

This example demonstrates how to use the `Remove()` method to remove a specific aura from a player based on its spell ID, while also handling cases where the player may not have the aura.

## SetDuration
Change the duration of the aura. This can be used to extend or shorten the duration of an existing aura on a unit.

### Parameters
* duration: number - The new duration of the aura in milliseconds.

### Example Usage
In this example, we will create a script that extends the duration of the "Blessing of Might" aura on the player whenever they enter combat. This will ensure that the player always has the blessing active while in combat.

```typescript
// Blessing of Might spell ID
const BLESSING_OF_MIGHT_SPELL_ID = 19740;

// Amount of time to extend the aura duration (in milliseconds)
const DURATION_EXTENSION = 30000; // 30 seconds

const OnEnterCombat: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit) => {
    // Get the Blessing of Might aura on the player
    const blessingOfMight = player.GetAura(BLESSING_OF_MIGHT_SPELL_ID);

    // Check if the player has the aura
    if (blessingOfMight) {
        // Get the current aura duration
        const currentDuration = blessingOfMight.GetDuration();

        // Calculate the new duration by adding the extension time
        const newDuration = currentDuration + DURATION_EXTENSION;

        // Set the new duration on the aura
        blessingOfMight.SetDuration(newDuration);

        // Inform the player about the extended duration
        player.SendBroadcastMessage(`Blessing of Might duration extended by ${DURATION_EXTENSION / 1000} seconds!`);
    } else {
        // If the player doesn't have the aura, inform them
        player.SendBroadcastMessage("You don't have Blessing of Might active.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => OnEnterCombat(...args));
```

In this script:
1. We define the spell ID for Blessing of Might and the amount of time to extend the duration.
2. In the `OnEnterCombat` event handler, we first check if the player has the Blessing of Might aura using `player.GetAura()`.
3. If the player has the aura, we retrieve its current duration using `blessingOfMight.GetDuration()`.
4. We calculate the new duration by adding the extension time to the current duration.
5. We set the new duration on the aura using `blessingOfMight.SetDuration()`.
6. We inform the player about the extended duration using `player.SendBroadcastMessage()`.
7. If the player doesn't have the Blessing of Might aura, we inform them about it.
8. Finally, we register the `OnEnterCombat` event handler using `RegisterPlayerEvent()`.

With this script, whenever the player enters combat, the duration of their Blessing of Might aura will be extended by 30 seconds, ensuring that they have the blessing active throughout the combat encounter.

## SetMaxDuration
Change the maximum duration of the aura. This does not affect the current duration of the aura, but if the aura is reset to the maximum duration, it will instead change to the new duration specified.

### Parameters
* duration: number - The new maximum duration of the aura in milliseconds.

### Example Usage
This example shows how to create a script that will double the duration of the "Blessing of Might" aura when it is applied to a player.

```typescript
const BLESSING_OF_MIGHT_SPELL_ID = 19740;
const BLESSING_OF_MIGHT_NORMAL_DURATION = 600000; // 10 minutes in milliseconds
const BLESSING_OF_MIGHT_EXTENDED_DURATION = 1200000; // 20 minutes in milliseconds

const OnAuraApply: player_event_on_aura_apply = (event: number, player: Player, target: Unit, aura: Aura): void => {
    if (aura.GetId() === BLESSING_OF_MIGHT_SPELL_ID) {
        // Check if the aura was applied by the player to themselves
        if (player === target) {
            // Double the maximum duration of the aura
            aura.SetMaxDuration(BLESSING_OF_MIGHT_EXTENDED_DURATION);

            // Refresh the aura to apply the new maximum duration
            aura.Refresh();

            // Send a message to the player
            player.SendBroadcastMessage("Your Blessing of Might has been extended to 20 minutes!");
        } else {
            // If the aura was applied to someone else, set it to the normal duration
            aura.SetMaxDuration(BLESSING_OF_MIGHT_NORMAL_DURATION);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AURA_APPLY, (...args) => OnAuraApply(...args));
```

In this example, we first define some constants for the spell ID of "Blessing of Might" and its normal and extended durations in milliseconds.

Then, we register a script for the `PLAYER_EVENT_ON_AURA_APPLY` event, which is triggered whenever an aura is applied to a player or a player's target.

In the script, we check if the aura being applied is "Blessing of Might" using its spell ID. If it is, we then check if the aura was applied by the player to themselves.

If the player applied the aura to themselves, we use the `SetMaxDuration` method to double the maximum duration of the aura to 20 minutes. We then use the `Refresh` method to reset the current duration of the aura to the new maximum duration.

Finally, we send a message to the player using `SendBroadcastMessage` to let them know that their "Blessing of Might" has been extended to 20 minutes.

If the aura was applied to someone else, we set the maximum duration of the aura to its normal value of 10 minutes.

## SetStackAmount
Change the stack amount of the aura on the unit. If the `amount` is greater than or equal to the current number of stacks, the aura's duration will be reset to the maximum duration.

### Parameters
- amount: number - The new stack amount for the aura.

### Example Usage
In this example, we'll create a script that increases the stack amount of a specific aura when a player kills a creature. If the stack amount reaches 10 or more, the aura's duration will be reset, and the player will receive a bonus reward.

```typescript
const AURA_ENTRY = 12345;
const BONUS_ITEM_ENTRY = 67890;
const BONUS_ITEM_COUNT = 5;

const OnCreatureKill: creature_event_on_creature_death = (event: number, creature: Creature, killer: Unit): void => {
    if (killer instanceof Player) {
        const player = killer as Player;
        const aura = player.GetAura(AURA_ENTRY);

        if (aura) {
            const currentStacks = aura.GetStackAmount();
            const newStacks = currentStacks + 1;

            aura.SetStackAmount(newStacks);

            if (newStacks >= 10) {
                player.AddItem(BONUS_ITEM_ENTRY, BONUS_ITEM_COUNT);
                player.SendBroadcastMessage("Congratulations! You have reached 10 stacks and received a bonus reward!");
            }
        } else {
            player.AddAura(AURA_ENTRY, player);
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_CREATURE_DEATH, (...args) => OnCreatureKill(...args));
```

In this script:
1. We define constants for the aura entry, bonus item entry, and bonus item count.
2. When a creature is killed by a player, we check if the killer is a Player instance.
3. We retrieve the specific aura from the player using `GetAura()`.
4. If the aura exists on the player:
   - We get the current stack amount using `GetStackAmount()`.
   - We calculate the new stack amount by adding 1 to the current stack amount.
   - We update the aura's stack amount using `SetStackAmount()`.
   - If the new stack amount is greater than or equal to 10:
     - We add the bonus item to the player's inventory using `AddItem()`.
     - We send a broadcast message to the player informing them of the bonus reward.
5. If the aura doesn't exist on the player, we add the aura to the player using `AddAura()`.

This script encourages players to hunt creatures and rewards them with a bonus item when they reach a certain number of stacks on the specific aura.

