## GetId
Returns the unique identifier for this achievement. This id can be used to query the achievement_criteria_data table in the world database for more information. 

### Parameters
None

### Returns
id: number

### Example Usage:
Create a scripted map event trigger that awards bonus honor when the Achievement: "Alterac Valley All-Star" is earned.

```typescript
// Alterac Valley (Map: 30) Scripted Event to Award Double Honor
const AV_MAP_ID = 30;
const AV_ALL_STAR_ACH_ID = 907;

function AV_OnPlayerEnterMap(event: Map_Events, map: Map, player: Player) {

    // Query achievement progress from world database
    let achievementCompleted = WorldDBQuery(`
        SELECT 1 FROM character_achievement 
        WHERE achievement = ${AV_ALL_STAR_ACH_ID}
        AND guid = ${player.GetGUID()}
    `).GetRowCount();

    // Check to see if player already earned "Alterac Valley All Star". 
    if(achievementCompleted) {
        let [honorPoints] = WorldDBQuery(`
            SELECT totalHonorPoints 
            FROM characters
            WHERE guid = ${player.GetGUID()}
        `).GetRow(); 

        // Apply a 2x multiplier on total honor points earned
        player.SetHonorPoints(honorPoints * 2);

        // Notify player of bonus honor for completing Achievement
        player.SendBroadcastMessage("You have been awarded DOUBLE HONOR for completing the Achievement: Alterac Valley All-Star!");

        // log the bonus honor 
        SendWorldMessage(`${player.GetName()} earned 2x Honor Points for completing the Achievement: Alterac Valley All-Star`);
    }
}

// Register Map event handler for Alterac Valley 
RegisterMapEvent(AV_MAP_ID, MapEvents.MAP_EVENT_ON_PLAYER_ENTER, (event: Map_Events , map: Map, player: Player) => {
    AV_OnPlayerEnterMap(event, map, player);
});
```

In this example, we use the GetId() method to compare against a known achievement entry "Alterac Valley All-Star". When a player enters the Alterac Valley battleground, a WorldDBQuery is executed to check if the player has already completed the achievement. If so, we query the characters total honor points, double it, and then call SetHonorPoints() to award the bonus honor. 

Finally, we notify the player via SendBroadcastMessage() as well as log the bonus honor to the world via SendWorldMessage().

## GetName
Returns the name of the [Achievement] as it appears in-game to players.  This is useful when you want to send messages to the player about an achievement they have completed or display information about an achievement. 

### Parameters
None
### Returns
string - The name of the achievement
### Example Usage:  
Send a message to a player when they complete an achievement with some custom flair based on the achievement name.
```typescript
const ACHIEVEMENT_LEVEL_10 = 6;
const ACHIEVEMENT_50_QUESTS = 32;
const ACHIEVEMENT_100_QUESTS = 33;

function SendCompletionMessage(player: Player, achievement: Achievement) {
  player.SendBroadcastMessage(`|cff00ff00Congratulations on completing the achievement |cffff8000'${achievement.GetName()}'|cff00ff00.|r`)

  switch(achievement.GetId()) {
    case ACHIEVEMENT_LEVEL_10:
      player.SendBroadcastMessage(`|cff00ff00You have reached an important milestone in your character's development. Well done!|r`)
      break;
    case ACHIEVEMENT_50_QUESTS:
      player.SendBroadcastMessage(`|cff00ff00Your dedication to helping the people of Azeroth is truly impressive. Keep up the great work!|r`)
      break;
    case ACHIEVEMENT_100_QUESTS:
      player.SendBroadcastMessage(`|cff00ff00One hundred quests? Wow, you sure have been busy. Azeroth is lucky to have heroes like you. Congratulations!|r`)
      break;
  }
}

const OnAchievementComplete = (event: number, player: Player, achievement: Achievement) => {
  SendCompletionMessage(player, achievement);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ACHIEVEMENT_COMPLETE, OnAchievementComplete);
```

