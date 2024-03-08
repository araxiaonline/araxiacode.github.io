## GetAlivePlayersCountByTeam
Returns the amount of alive players in the BattleGround by the team ID.

### Parameters
* team: [Team](./team.md) - The team ID for which to count the alive players.

### Returns
* number - The number of alive players in the specified team.

### Example Usage
Track alive players in a battleground and display a message when a team reaches a certain threshold.

```typescript
const CHECK_ALIVE_PLAYERS_THRESHOLD = 5;
const TEAM_ALLIANCE = Team.ALLIANCE;

const onBattleGroundTick: battleground_event_on_tick = (event: number, battleground: BattleGround) => {
    const allianceAlivePlayers = battleground.GetAlivePlayersCountByTeam(TEAM_ALLIANCE);

    if (allianceAlivePlayers >= CHECK_ALIVE_PLAYERS_THRESHOLD) {
        battleground.SendMessageToAllPlayers("Alliance team reached the threshold of alive players.");
    }
}

RegisterBattleGroundEvent(BattleGroundEvents.BATTLEGROUND_EVENT_ON_TICK, (...args) => onBattleGroundTick(...args));
```

In this example, the `GetAlivePlayersCountByTeam` method is utilized to monitor the number of alive players in the Alliance team within a battleground. If the threshold defined by `CHECK_ALIVE_PLAYERS_THRESHOLD` is met, a message is sent to all players indicating that the Alliance team has reached the required number of alive players.

## GetBonusHonorFromKillCount
This method calculates the bonus honor that a player will receive based on the number of kills they have in the specific battleground.

### Parameters
* kills: number - The number of kills the player has in the battleground.

### Returns
* number - The bonus honor amount calculated based on the number of kills.

### Example Usage
Calculate and award bonus honor to a player based on kills in a battleground.
```typescript
const battleground: BattleGround = new BattleGround();
const playerKills: number = 10;
const bonusHonor: number = battleground.GetBonusHonorFromKillCount(playerKills);

player.AddHonor(bonusHonor);
```

## GetBracketId

Returns the bracket ID of the specific battleground.

### Returns
* number - The bracket ID of the battleground.

### Example Usage:
Check if the battleground is in a specific bracket and return the bracket ID.
```typescript
const BRACKET_ID_10V10 = 3;
const BRACKET_ID_15V15 = 4;

const CheckBracket: player_event_on_battleground_join = (event: number, player: Player, battleground: BattleGround) => {

    const bracketId = battleground.GetBracketId();

    if (bracketId === BRACKET_ID_10V10) {
        player.SendMessage("You are in the 10v10 bracket.");
    } else if (bracketId === BRACKET_ID_15V15) {
        player.SendMessage("You are in the 15v15 bracket.");
    } else {
        player.SendMessage("You are in a different battleground bracket.");
    }

}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BATTLEGROUND_JOIN, (...args) => CheckBracket(...args));
```

## GetEndTime
This method returns the end time of the BattleGround.

### Returns
* endTime: number - The timestamp indicating the end time of the BattleGround.

### Example Usage: 
Script to display remaining time until the end of the BattleGround.
```typescript
const displayEndTime: player_event_on_login = (event: number, player: Player) => {
    const endTime = BattleGround.GetEndTime();
    const currentTime = Date.now() / 1000;
    const remainingTime = (endTime - currentTime) / 60; // Convert seconds to minutes
    
    player.SendNotification(`The BattleGround will end in ${remainingTime.toFixed(2)} minutes.`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => displayEndTime(...args));
``` 

This example usage demonstrates how to use the `GetEndTime` method to display the remaining time until the BattleGround ends for a player upon login.

## GetFreeSlotsForTeam
Returns the amount of free slots available for the selected team in the specified battleground.

### Parameters
* team: [Team](./team.md) - The team for which to check the free slots.

### Returns
* number - The number of free slots available for the specified team.

### Example Usage
Query and display the number of available slots for a specific team in the battleground.

```typescript
const CheckTeamSlots: player_event_on_join_bg = (event: number, player: Player, bg: BattleGround, team: Team): void => {
    const freeSlots = bg.GetFreeSlotsForTeam(team);
    console.log(`Team ${team} in battleground has ${freeSlots} free slots.`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_JOIN_BG, (...args) => CheckTeamSlots(...args));
```

In this example, the `GetFreeSlotsForTeam` method is used to retrieve and log the number of available slots for a specific team in the battleground when a player joins the battleground event.

## GetInstanceId
Returns the instance ID of the BattleGround.

### Returns
number - The instance ID of the BattleGround.

### Example Usage
Retrieve the instance ID of a specific BattleGround:
```typescript
const bg: BattleGround = new BattleGround();
const instanceId: number = bg.GetInstanceId();
console.log(`Instance ID of the BattleGround: ${instanceId}`);
```

## GetMap

Gets the map of the current Battleground.

### Returns
map: [EMap](./emap.md) - The map of the Battleground.

### Example Usage: 
Accessing the map of the current Battleground.

```typescript
const onBattlegroundJoin: player_event_on_battleground_join = (event: number, player: Player, bg: BattleGround): void => {

    const map = bg.GetMap(); 
    console.log(`Player ${player.GetName()} is in ${map}`);
}
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BATTLEGROUND_JOIN, (...args) => onBattlegroundJoin(...args));
``` 

By using this method, you can easily retrieve the map of the Battleground the player is currently in.

## GetMapId
Returns the map ID of the BattleGround.

### Returns
mapId: number - The map ID of the BattleGround.

### Example Usage:
In a scenario where you need to retrieve the map ID of a battleground:
```typescript
const getBattlegroundMapId = (battleground: BattleGround): void => {
    const mapId = battleground.GetMapId();
    console.log(`The map ID of the battleground is: ${mapId}`);
}

// Assuming 'battlegroundInstance' is an instance of BattleGround
getBattlegroundMapId(battlegroundInstance);
``` 

This method allows you to fetch the map ID of a specific battleground, providing crucial information needed for further operations related to the battleground instance.

## GetMaxLevel

This method returns the maximum allowed player level for the specific battleground.

### Returns
* level: number - The maximum player level allowed in the battleground.

### Example Usage:
Checking if a player meets the level requirements before allowing them to join the battleground.

```typescript
const onPlayerJoinBG: player_event_on_join_bg = (event: number, player: Player, battleground: BattleGround): boolean => {

    const maxLevel: number = battleground.GetMaxLevel();

    if(player.GetLevel() > maxLevel) {
        console.log(`Player level ${player.GetLevel()} exceeds max level ${maxLevel} for battleground.`);
        return false;
    }

    return true;
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_JOIN_BG, (...args) => onPlayerJoinBG(...args));
```

## GetMaxPlayers

Returns the maximum allowed count of players for the specific battleground.

### Method Signature
```typescript
GetMaxPlayers(): number;
```

### Example Usage
Retrieve the maximum number of players allowed for a battleground and display it in the console.

```typescript
const displayMaxPlayers = (): void => {
    const bg: BattleGround = new BattleGround();
    const maxPlayers: number = bg.GetMaxPlayers();
    
    console.log(`The maximum number of players allowed for this battleground is: ${maxPlayers}`);
}

displayMaxPlayers();
```

This example demonstrates how to create a new instance of `BattleGround`, call the `GetMaxPlayers` method, and log the result to the console.

## GetMaxPlayersPerTeam

Returns the maximum allowed player count per team of the specific BattleGround.

### Returns
number - The maximum number of players per team allowed for this BattleGround.

### Example Usage

Retrieve the maximum players per team for a specific BattleGround and display the result:

```typescript
const battleground: BattleGround = new BattleGround(); 

const maxPlayersPerTeam: number = battleground.GetMaxPlayersPerTeam(); 

console.log(`The maximum number of players per team for this BattleGround is: ${maxPlayersPerTeam}`);
```

### Notes

- This method is useful for determining the player limit per team in a BattleGround scenario.
- Make sure to check for any custom rules or configurations that may affect the maximum player count per team.

## GetMinLevel
Returns the minimum allowed player level required to participate in the specific BattleGround.

### Returns
* number - The minimum player level allowed in the BattleGround.

### Example Usage
Check if a player meets the level requirement before letting them enter the BattleGround.

```typescript
const onPlayerEnterBattleGround: battleground_event_on_enter = (event: number, player: Player, battleground: BattleGround): void => {
    const minLevel = battleground.GetMinLevel();
    
    if(player.GetLevel() < minLevel) {
        player.SendBroadcastMessage(`You must be at least level ${minLevel} to enter this BattleGround.`);
    } else {
        // Player can enter the BattleGround
    }
}

RegisterBattleGroundEvent(BattleGroundEvents.BATTLEGROUND_EVENT_ON_ENTER, (...args) => onPlayerEnterBattleGround(...args));
``` 

In this example, the GetMinLevel method is used to determine if a player meets the level requirement to enter a specific BattleGround. If the player's level is below the minimum required level, a message is sent notifying the player. Otherwise, the player is allowed to enter the BattleGround.

## GetMinPlayers
Returns the minimum allowed player count for the specific battleground.

### Returns
number - The minimum player count allowed for the battleground.

### Example Usage:
Script to ensure minimum player count before starting a battleground match.
```typescript
const onPlayerEnterBattleground: bg_event_on_player_enter_battleground = (event: number, bg: BattleGround, player: Player): void => {
    const minPlayers = bg.GetMinPlayers();
    const playerCount = bg.GetPlayerCount();

    if (playerCount < minPlayers) {
        player.SendMessage("Not enough players to start the battleground.");
        bg.EndMatch();
    }
}
RegisterBattlegroundEvent(BattlegroundEvents.BG_EVENT_ON_PLAYER_ENTER, (...args) => onPlayerEnterBattleground(...args));
``` 

By using this method, you can ensure that the battleground matches in your mod meet the required minimum player count before starting.

## GetMinPlayersPerTeam

This method returns the minimum allowed player count per team of the specific battleground.

### Returns
* number - The minimum player count per team for the battleground.

### Example Usage:
Checking if a battleground has enough players per team before starting the game.

```typescript
const CheckPlayersPerTeam: player_event_on_battleground_start = (event: number, battleground: BattleGround, teamPlayers: number[][]): void => {

    const minPlayersPerTeam = battleground.GetMinPlayersPerTeam();

    const team1Players = teamPlayers[0].length;
    const team2Players = teamPlayers[1].length;

    if (team1Players < minPlayersPerTeam || team2Players < minPlayersPerTeam) {
        // Not enough players per team, do not start the battleground
        return;
    }

    // Start the battleground with enough players per team
    battleground.Start();
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BATTLEGROUND_START, (...args) => CheckPlayersPerTeam(...args));
```

## GetName

This method returns the name of the specific BattleGround instance.

### Returns
* name: string - The name of the BattleGround.

### Example Usage:
```typescript
const getBGName = (battleGround: BattleGround): void => {

    const name = battleGround.GetName();
    console.log(`The name of the BattleGround is: ${name}`);

}

const myBattleGround = new BattleGround();
getBGName(myBattleGround);
```

In this example, we define a function `getBGName` that takes a `BattleGround` instance as a parameter and retrieves the name of the BattleGround using the `GetName` method. The retrieved name is then logged to the console for display.

## GetStatus
This method returns the current status of the specified BattleGround.

### Returns  
status: number - The current status of the BattleGround.  

### Example Usage  
Check the status of a specific BattleGround and take action accordingly.  

```typescript
const checkBattleGroundStatus = (bg: BattleGround): void => {
    
    const status = bg.GetStatus(); 

    switch (status) {
        case 0:
            console.log("The BattleGround is currently inactive.");
            break;
        case 1:
            console.log("The BattleGround is currently in progress.");
            break;
        case 2:
            console.log("The BattleGround is currently completed.");
            break;
        default:
            console.log("Unknown BattleGround status.");
            break;
    }
}

const myBattleGround: BattleGround = new BattleGround();
checkBattleGroundStatus(myBattleGround);
``` 

By utilizing this GetStatus method, you can easily retrieve and monitor the status of a BattleGround in your mod-eluna project on Azerothcore.

## GetTypeId
Get the type ID of the battleground.

### Returns
* typeId: [BattleGroundTypeId](./battlegroundtypeid.md) - The type ID of the battleground.

### Example Usage:
```typescript
const getBattlegroundTypeId: () => void => {
    
    const typeId: BattleGroundTypeId = BattleGround.GetTypeId();
    
    console.log(`BattleGround Type ID: ${typeId}`);
}
getBattlegroundTypeId();
```

## GetWinner
Return the winning team of the specific battleground.

### Returns <hr />
team: [Team](./team.md) - The winning team of the battleground.

### Example Usage:  
Check the winning team of the battleground and reward players accordingly.
```typescript
const CheckBattleGroundResults: player_event_on_battleground_end = (event: number, player: Player, battleground: BattleGround) => {

    const winningTeam = battleground.GetWinner();
    
    if(winningTeam === Team.ALLIANCE) {
        player.AddItem(ITEM_ID_ALLIANCE_REWARD, REWARD_AMOUNT);
    } else if (winningTeam === Team.HORDE) {
        player.AddItem(ITEM_ID_HORDE_REWARD, REWARD_AMOUNT);
    } else {
        player.AddItem(ITEM_ID_DRAW_REWARD, REWARD_AMOUNT);
    }

}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_BATTLEGROUND_END,  (...args) => CheckBattleGroundResults(...args));
```

