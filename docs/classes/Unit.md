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

