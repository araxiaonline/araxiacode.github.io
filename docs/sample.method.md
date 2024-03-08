# Player 
All methods that are available to be used can be used on a player object.

## AddComboPoints
If the player is a rogue or druid, this method will add combo points to the player 
based on the target and the count of combo points to add.

**Parameters:**
* **enemy:** [Unit](./unit.md) - Unit to apply combo points to
* **count:** number - The number of combo points to apply 

**Example:**  
_Simple script to start a rogue/druid with an advantage._
```typescript
const onPlayerEnter: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {

    player.AddComboPoints(enemy, 5); 

}
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onPlayerEnter(...args));
```