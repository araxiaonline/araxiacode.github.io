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

