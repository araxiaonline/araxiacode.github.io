Here is an example of how to convert TypeScript Class definitions into 
readme documentation in a consistent format based on how it will be used 
to build mods for mod-eluna on Azerothcore.  

Given the following TypeScript class definition for the Player class:

declare class Player extends Unit {
    /**
       * Adds combo points to the [Player]
       */
    AddComboPoints(target: Unit, count: number): void;
  
    /**
       * Adds the given amount of the specified item entry to the player.
       */
    AddItem(entry: number, itemCount?: number): Item;
  
    /**
  
       */
    AddLifetimeKills(): void;
  
    /**
       * Tries to add the given quest entry for the [Player].
       */
    AddQuest(entry: number): void;
  
    /**
       * Advances all of the [Player]s skills to the amount specified
       */
    AdvanceAllSkills(skillStep: number): void;
  
    /**
       * Advances a [Player]s specific skill to the amount specified
       */
    AdvanceSkill(skillId: number, skillStep: number): void;
  
    /**
       * Advances all of the [Player]s weapon skills to the maximum amount available
       */
    AdvanceSkillsToMax(): void;
  
    /**
       * Completes the [Quest] if a [Quest] area is explored, or completes the [Quest]
       */
    AreaExploredOrEventHappens(quest: number): void;
  
    /**
       * Returns 'true' if the [Player] can block incomming attacks, 'false' otherwise.
       */
    CanBlock(): boolean;
  
    /**
       * Returns 'true' if the [Player] satisfies all requirements to complete the quest entry.
       */
    CanCompleteQuest(entry: number): boolean;
}
## AddComboPoints
If the player is a rogue or druid, this method will add combo points to the player 
based on the target and the count of combo points to add.

### Parameters
* enemy: [Unit](./unit.md) - Unit to apply combo points to
* count: number - The number of combo points to apply 

### Example Usage:  
Simple script to start a rogue/druid with an advantage. 
```typescript
const onPlayerEnter: player_event_on_enter_combat = (event: number, player: Player, enemy: Unit): void => {

    player.AddComboPoints(enemy, 5); 

}
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ENTER_COMBAT, (...args) => onPlayerEnter(...args));
```
## AddItem
Give the player an item based on the item entry.  These items can be referenced in World Database item_template.  
for more information about items you can find more information here: https://www.azerothcore.org/wiki/item_template. 
Items will be added to the current bag inventory if there is space. 

### Parameters <hr />
entry: number - Item Entry Id from item_template table
count: number - number of items to grant (Items that exceed unique counts or limits to amount will fail)
### Returns 
item: [Item](./item.md) - The item(s) that was given to the player. 
### Example Usage: 
Grant bonus Badges of Justice  
const BADGE_OF_JUSTICE_ENTRY = 29434;
const BADGE_OF_JUSTICE_BONUS = 2;

const LootToken: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    
    if(item.GetEntry() == BADGE_OF_JUSTICE_ENTRY) {
        player.AddItem(BADGE_OF_JUSTICE_ENTRY, BADGE_OF_JUSTICE_BONUS);           
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => LootToken(...args));

