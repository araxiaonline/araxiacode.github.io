## GetInventoryItemCooldown
Get cooldown information for an inventory item.

/**
 * Get cooldown information for an inventory item.
 *
 * @see https://wow.gamepedia.com/API_GetInventoryItemCooldown
 * @returns start, duration, isEnabled
 * @tupleReturn
 */
declare function GetInventoryItemCooldown(unit: WoWAPI.UnitId, slotId: number): LuaMultiReturn<[number, number, WoWAPI.Flag]>;


### Parameters
* unitId [WoWAPI.UnitId](../global/types/UnitId.md) - The unit whose inventory is to be queried.
* slotId [WoWAPI.InvSlotId](../global/types/InvSlotId) - Inventory slot to target

### Returns 
* start number - The start time of the cooldown period, or 0 if there is no cooldown (or no item in the slot)
* duration number - The duration of the cooldown period (NOT the remaining time). 0 if the item has no use/cooldown or the slot is empty.
* enable number - Returns 1 or 0. 1 if the inventory item is capable of having a cooldown, 0 if not.

### Example Usage
Here's an example of how to use the `AdvanceTime` method to create an animated NPC that moves and changes its appearance:

```typescript
function checkItemCooldown(unit: WoWAPI.UnitId, slotId: WoWAPI.InvSlotId): void {
  const [start, duration, isEnabled] = GetInventoryItemCooldown(unit, slotId);
}

checkItemCooldown('player', 1);
```

