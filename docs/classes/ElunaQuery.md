Based on your guideline for converting TypeScript class definitions into readme documentation, here's the documentation for the `GetBool` method of the `ElunaQuery` class.

## GetBool

Retrieves the data in the specified column of the current row and returns it casted to a boolean. This function is handy when working with database query results, particularly when dealing with boolean values stored in the database.

### Parameters

- **column**: `number` - The column index in the query result from which to retrieve the boolean value.

### Returns

- `boolean` - The value from the specified column, casted to a boolean.

### Example Usage

Let's say you have a query that checks if a certain player has obtained a particular item, indicated by a boolean value in the database (1 for true, 0 for false). You can use `GetBool` to simplify the verification process in your script.

```typescript
// Example script that checks if a player has obtained a specific item
const CHECK_ITEM_OBTAINED_QUERY = "SELECT has_obtained FROM player_items WHERE player_id = ? AND item_id = ?";

const onPlayerLogin: player_event_on_login = (event: number, player: Player) => {
    // Let's assume 42 is the player's ID and 101 is the item's ID
    const playerId = 42;
    const itemId = 101;

    const query = WorldDBQuery(CHECK_ITEM_OBTAINED_QUERY, playerId, itemId);
    if (query && query.GetRow()) {
        // Using GetBool to check the 'has_obtained' column
        const hasObtained = query.GetBool(0);
        if (hasObtained) {
            player.SendBroadcastMessage("Congratulations! You've obtained the special item.");
        } else {
            player.SendBroadcastMessage("You have not obtained the special item yet. Keep trying!");
        }
    } else {
        player.SendBroadcastMessage("Unable to check item status.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onPlayerLogin(...args));
```

In this example, `GetBool` is used to directly fetch and evaluate the boolean value from the database query result. This avoids the need for manual conversion and makes the code cleaner and more readable.

## GetColumnCount
Returns the number of columns in the result set of a query. This method can be particularly useful when you need to know the structure of the data returned by a custom SQL query executed through Eluna on AzerothCore.

### Returns
columnCount: number - The number of columns in the result set.

### Example Usage
In the example below, we demonstrate how to use `GetColumnCount` in a scripted event. When a player logs in, a custom query is executed to fetch some data, and then `GetColumnCount` is used to print out the number of columns retrieved by this query. This kind of script can be useful for developers during the testing phase to ensure their queries are returning the expected structure.

```typescript
const MY_CUSTOM_QUERY = "SELECT id, name, level FROM characters WHERE online = 1;";

const onPlayerLogin: player_event_on_login = (event: number, player: Player): void => {

    // Let's assume we have a function named ExecuteQuery that executes the SQL and returns an ElunaQuery object
    let queryResult = ExecuteQuery(MY_CUSTOM_QUERY);
    
    if(queryResult) {
        let columnCount = queryResult.GetColumnCount();
        player.SendBroadcastMessage(`The query result has ${columnCount} columns.`);
        
        // Optional: Iterate over rows and columns if needed
        // This is just conceptual as further methods would be required for row iteration and data extraction
        for(let i = 0; i < columnCount; i++) {
            // Process each column
        }
    } else {
        player.SendBroadcastMessage("Failed to execute the query or no results found.");
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onPlayerLogin(...args));
```

In this script, `ExecuteQuery` is a hypothetical function that executes a SQL query through Eluna's database interface and returns an object of type `ElunaQuery`, which represents the result set. Through the `GetColumnCount` method, we are able to retrieve the number of columns in this result set and inform the player, aiding in database management or debugging procedures.

## GetDouble
Retrieve the data within the specified column of the current row, represented as a 64-bit floating point value. This method is crucial for situations where you need to process numeric data retrieved from a database query.

### Parameters
* `column`: number - The index of the column from which you want to retrieve the data. Note that the column index starts from 0.

### Returns
* `number` - The value present in the specified column, cast to a 64-bit floating point number.

### Example Usage:
Below is a script example demonstrating how to use the `GetDouble` method within a gameplay scenario. In this case, we'll assume there's a custom table in the database that tracks the amount of gold each player has in a bank vault not directly accessible through the standard game interface. The method retrieves the gold value for a specific player by their character ID.

```typescript
// Define a custom function to fetch and print the total gold a player has in the vault.
// This could be attached to a custom chat command or a game event.
const ShowPlayerVaultGold: CustomScript = (player: Player): void => {
    // Example query string, assuming a table named `player_vault` and a column `gold_amount`.
    const query = "SELECT gold_amount FROM player_vault WHERE char_id = ?";

    const playerId = player.GetGUIDLow(); // Get the low part of the player's GUID, which is often used as the character ID in custom tables.

    // Execute the query, replace '?' with playerId.
    const result = WorldDBQuery(query.replace("?", playerId.toString()));

    if (result && result.GetRowCount() > 0) {
        result.NextRow(); // Move to the first (and in this case, only) row of the result.
        const goldAmount: number = result.GetDouble(0); // Retrieve the gold amount from the first column.

        // Inform the player about the amount of gold in their vault.
        player.SendBroadcastMessage(`You have ${goldAmount} gold in your vault.`);
    } else {
        // Handle case where no data is returned, implying the player has no vault or no gold in it.
        player.SendBroadcastMessage("No vault data found or you have no gold in the vault.");
    }
}

// Registration of the custom event, function, or command goes here.
// This is just a placeholder as the registration method depends on the context in which it's used.
// e.g., RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => ShowPlayerVaultGold(...args));
```
This example provides a comprehensive way of using the `GetDouble` method to enhance gameplay by incorporating additional gameplay elements through server-side scripting.

## GetFloat
This method is used to retrieve data from the specified column of the current row in a database query result. The data is returned as a 32-bit floating point number (`float`). This is particularly useful when interacting with database fields that store numerical values with decimal points, such as character position coordinates, item weights, or other properties that require precision beyond integer values.

### Parameters
- `column`: `number` - The index of the column in the current row from which to retrieve the value. Column indexing starts at 0.

### Returns
- `number`: The value in the specified column casted to a `float`.

### Example Usage
This script demonstrates how to use the `GetFloat` method to obtain a player's X, Y, and Z coordinates from the database, which are stored as floating-point numbers. This could be part of a larger system for tracking player positions or teleporting players to specific locations.

```typescript
// Fetches player coordinates from the database
const fetchPlayerCoordinates = (playerGUID: number): { x: number, y: number, z: number } | undefined => {
    // Assuming 'characters' database and 'character_position' is a table storing player positions
    const query = `SELECT posX, posY, posZ FROM character_position WHERE guid = ?`;
    const result = WorldDBQuery(query, playerGUID);

    if (result && result.GetRowCount() > 0) {
        // Move to the first (and expected only) row of the result
        if (result.NextRow()) {
            const x = result.GetFloat(0); // posX is in the first column
            const y = result.GetFloat(1); // posY is in the second column
            const z = result.GetFloat(2); // posZ is in the third column

            return { x, y, z };
        }
    }

    return undefined; // Return undefined if there was no result or any error occurred
};

// Example usage of fetchPlayerCoordinates within an event handler
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (player: Player) => {
    const playerGUID = player.GetGUIDLow(); // Assuming GetGUIDLow returns the GUID used in DB

    const coords = fetchPlayerCoordinates(playerGUID);

    if (coords) {
        console.log(`Player ${player.GetName()} logged in at X: ${coords.x}, Y: ${coords.y}, Z: ${coords.z}`);
    } else {
        console.error(`Failed to fetch coordinates for player ${player.GetName()}`);
    }
});
```

In this example, a query is performed against a fictional `character_position` table to retrieve the X, Y, and Z coordinates of the player. The `GetFloat` method is utilized to ensure the coordinates are accurately read as floating-point numbers from the result set. This precise data is crucial for spatial computations or actions that require exact positioning in the game world.

## GetInt16

Extracts the data from the specified column in the current row and returns it as a signed 16-bit integer. This is particularly useful when dealing with data that fits within the bounds of a 16-bit integer, ensuring that the retrieved value is accurately represented within the constraints of this data type.

### Parameters
- **column**: number - The column index (starting from 0) from which to retrieve the data.

### Returns
- **number**: The value of the specified column in the current row, cast to a signed 16-bit integer.

### Example Usage:
Imagine you are working with a query result where you need to retrieve the level of a player, which is stored as an integer. For illustrative purposes, let's say the player's level is in the second column of the result set. Here's how you might use `GetInt16` to accurately get this data:

```typescript
const QUERY_GET_PLAYER_LEVEL = "SELECT player_id, player_level FROM players WHERE player_name = ?";

let playerName = "JohnDoe";
let queryResult = WorldDBQuery(QUERY_GET_PLAYER_LEVEL, playerName);

if (queryResult && queryResult.GetRowCount() > 0) {
    while (queryResult.NextRow()) {
        let playerLevel = queryResult.GetInt16(1);  // Assuming 'player_level' is in the second column
        print(`Player Level: ${playerLevel}`);
    }
} else {
    print("No results found or query execution error.");
}
```

In this script, `WorldDBQuery` executes a SQL command to select the player ID and level of a player with the name "JohnDoe". The `GetInt16` method is then called with the column index `1` (because indexes start at 0, 1 corresponds to the second column which is `player_level` in this case) to extract the player's level as a 16-bit signed integer. This allows for accurate and type-safe retrieval of integer data that is known to be within the range of a 16-bit number.

## GetInt32

Retrieves the data in the specified column of the current row and casts it to a signed 32-bit integer. This method is essential when working with database query results that return numerical values and ensures that the value can be easily manipulated or checked in your script.

### Parameters
- `column`: number - The column index in the query result set from which to retrieve the data. The column index is 0-based.

### Returns
- `value`: number - The data casted to a signed 32-bit integer.

### Example Usage:  
Calculating Player's Total Quests Completed  
In this example, we retrieve the total number of quests completed by a player from the database and log it. This can be useful for achievements, statistics, or checks within game logic.

```typescript
// Assuming playerGUID is the GUID of the player for whom we want to fetch the total quests completed.
const playerGUID = 1; // Example player GUID
const questCompletedQuery = `SELECT COUNT(*) as totalCompleted FROM character_queststatus_rewarded WHERE guid = ${playerGUID}`;

// Perform the SQL query using Eluna
WorldDBQuery(questCompletedQuery).Execute((result: ElunaQuery) => {
    if (result) {
        // We're only interested in the first row, column zero as our query only returns a single value.
        const totalQuestsCompleted = result.GetInt32(0);
        print(`Player GUID ${playerGUID} has completed ${totalQuestsCompleted} quests.`);
    } else {
        print(`No quests completion data found for player GUID ${playerGUID}.`);
    }
});
```

This script starts by defining a SQL query that counts the number of quests a player with a specific GUID has completed. It then executes this query and, if results are found, uses the `GetInt32` method to retrieve the total counts from the first (and only) column of the result. This integer value is then printed to the console alongside the player's GUID. This example illustrates how to handle integer data from a database query within a script, enabling complex data manipulation and checks based on the game's database state.

## GetInt64

This method allows retrieval of data from a specified column of the current row in a query result set, casting the data to a signed 64-bit integer (a common type for database IDs and large count values).

### Parameters
- `column`: number - The index of the column from which to retrieve the data. Columns are indexed starting at 0.

### Returns
- `number`: The data from the specified column, casted to a signed 64-bit integer.

### Example Usage:

Imagine a scenario where you need to retrieve a player's total earned honor points, stored in a database under a column that contains large numbers, thus requiring the use of a 64-bit integer. Below is a simple script to fetch and log a player's total honor points based on their character ID.

#### Preparing the Database Query:

Firstly, ensure you have an appropriate SQL query to fetch the desired data. For example, if your database contains a table named `character_stats` with a column for honor points `honor_points` and a unique identifier `char_id`, your query might look something like:

```sql
SELECT honor_points FROM character_stats WHERE char_id=?
```

#### TypeScript Script:

```typescript
// Function to log player's total honor points
const logPlayerHonorPoints: (playerId: number) => void = (playerId: number): void => {

    // Prepare your query - assume this query returns rows with a single column 'honor_points'
    const queryString: string = "SELECT honor_points FROM character_stats WHERE char_id=?";
    
    // Execute the query with playerId as the parameter
    const result: ElunaQuery = WorldDBQuery(queryString, playerId);

    // Assuming the query is successful and returns at least one row
    if (result && result.GetRowCount() > 0) {
        // Move to the first row of the result set (index 0)
        result.NextRow();
        
        // Get the 'honor_points' column value from the result set
        const honorPoints: number = result.GetInt64(0); // Column index for 'honor_points' is 0
        
        print(`Player with ID ${playerId} has a total of ${honorPoints} honor points.`);
    } else {
        print(`No data found for player with ID ${playerId}.`);
    }
}

// Example player ID to fetch data for
const examplePlayerId: number = 12345;

// Call the function with an example player ID
logPlayerHonorPoints(examplePlayerId);
```

In this example, a `WorldDBQuery` function is assumed to execute a database query and return an `ElunaQuery` object representing the result set. The `GetInt64` method of the `ElunaQuery` class is used to retrieve the `honor_points` value for a specific player by their character ID (`char_id`). This method is beneficial when dealing with large numbers that may exceed the limitations of a 32-bit integer.

## GetInt8
This method extracts the data from the specified column of the current row, casting it to a signed 8-bit integer for efficient data handling. 

### Parameters
* column: number - The index of the column in the query result set, from which the data is to be retrieved and converted to an 8-bit integer.

### Returns
* number - The data value in the specified column, casted to a signed 8-bit integer.

### Example Usage:
Let's create a script that queries the database for specific player data and utilizes the `GetInt8` method to handle a character's level, assuming that level values are stored within the scope of an 8-bit integer's range.

First, we execute a query to fetch player information, including the player's level, from the database. Then, we access this level value with `GetInt8` and use it to make in-game decisions or adjustments to the player's status.

```typescript
// The player's unique ID for querying their data
const PLAYER_GUID: number = 1;
// The SQL query to get player info. Here, 'char_level' is a hypothetical column containing the player's level.
const QUERY_STRING: string = `SELECT char_level FROM player_data WHERE guid = ${PLAYER_GUID}`;

// Execute the query
const playerQuery: ElunaQuery = WorldDBQuery(QUERY_STRING);

if (playerQuery) {
    // Assuming the first column in our result contains the character's level. Column indexes start from 0.
    const columnIdx: number = 0;
    const playerLevel: number = playerQuery.GetInt8(columnIdx);
    
    // Now, you can use playerLevel to make game logic decisions
    if (playerLevel < 10) {
        console.log(`Player with GUID ${PLAYER_GUID} is a beginner.`);
    } else {
        console.log(`Player with GUID ${PLAYER_GUID} has progressed beyond beginner status.`);
    }

} else {
    console.log("Query returned no results. Check if the player GUID is correct.");
}
```

This example illustrates how to retrieve and utilize a player's level from the database, providing a simple yet practical use case for the `GetInt8` method. It showcases how to interact with the game's database within a modding context for AzerothCore, specifically leveraging the capabilities of the Eluna scripting engine to query and manipulate player data effectively.

## GetRow
This method fetches the current row from an executed query result. It organizes the data into a table where each column's name is a key, and its corresponding row value is the pair. This allows easy access to SQL query results through key-value pairs. Numerical columns will have their values returned as numbers, while all other types of data will be returned as strings.

### Returns
- **Record<string, unknown>**: A table containing the fields of the current row, where keys are column names and values are the row's corresponding values.

### Example Usage:
The following example demonstrates how to use `GetRow` to retrieve NPC information from the `creature_template` table. It prints out the entry ID and name of the first NPC found with the specified conditions. 

```typescript
// This function is triggered when a player chats ".getnpcinfo" followed by the NPC's entry ID.
const onChat: player_event_on_chat = (event: number, player: Player, message: string, msgType: number, lang: number): void => {
    // Split the player's message by spaces
    const args = message.split(' ');

    // Check if the chat command is ".getnpcinfo"
    if (args[0] === ".getnpcinfo" && args.length === 2) {
        // Parse the NPC's entry ID from the second word in the chat message
        const npcEntryId = parseInt(args[1]);

        // Form the SQL query to retrieve the NPC's info from the creature_template table
        const queryStr = `SELECT entry, name FROM creature_template WHERE entry = ${npcEntryId};`;

        // Execute the query
        const result = WorldDBQuery(queryStr);

        // Check if the query returned any row
        if (result && result.GetRow()) {
            // Fetch the row data
            let npcInfo = result.GetRow();
            
            // Bind the NPC info (entry and name) to variables for easy access
            let npcEntry = npcInfo.entry;
            let npcName = npcInfo.name;
            
            // Inform the player about the NPC info
            player.SendBroadcastMessage(`NPC Info - Entry: ${npcEntry}, Name: ${npcName}`);
            
            // Logic to move to the next row if needed can be implemented here
            // For instance: while(result.NextRow()) { /* Process next row */ }
        } else {
            // Inform the player in case no NPC was found with the given entry ID
            player.SendBroadcastMessage("No NPC found with the specified entry ID.");
        }
    }
}

// Register the chat event listener
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onChat(...args));
```

This script makes use of the `ElunaQuery:GetRow` method to access NPC information by entry ID through a chat command. The resulting NPC data is displayed to the player who issued the command.

## GetRowCount
Returns the number of rows in the result set of a database query. This method can be used to verify the size of data retrieved, ensuring your operations can proceed with the expected amount of data.

### Returns
number - The number of rows in the result set.

### Example Usage:
Suppose you want to check the number of active players in a specific area before performing an operation, such as granting a temporary buff. You can use `GetRowCount` to ascertain the number of affected rows before proceeding.

```typescript
const REGION_ID = 123; // Example region ID
const TEMP_BUFF_ENTRY = 45678; // Example temporary buff entry

// Function to grant a temporary buff to all players in a specific region
function GrantTempBuffToRegionPlayers(regionId: number, buffEntry: number): void {
    // Here we're simulating a query to select all players in a specific region
    // In a real scenario, you would replace this with an actual database query
    const query = `SELECT player_id FROM player_table WHERE region_id = ${regionId}`;
    
    // Execute the query here. For demonstration, we'll pretend `dbQuery` is a function that executes the SQL and returns an ElunaQuery object
    const result = dbQuery(query);
    
    // Check the number of players in the region
    const playerCount = result.GetRowCount();

    if(playerCount > 0) {
        console.log(`Granting buff to ${playerCount} players in region ${regionId}.`);

        // Process each player and grant them the temporary buff
        // For demonstration, 'processPlayersAndGrantBuff' is a placeholder for the logic to iterate over query results and grant buffs.
        processPlayersAndGrantBuff(result, buffEntry);
    } else {
        console.log(`No players found in region ${regionId}. No buffs granted.`);
    }
}

// Assume RegisterGameEvent is a method to hook into game events for execution
RegisterGameEvent(GameEvents.SOME_EVENT, () => GrantTempBuffToRegionPlayers(REGION_ID, TEMP_BUFF_ENTRY));
```

In this example, before attempting to grant temporary buffs to all players in a given region, the script checks how many players are currently present in that region using the `GetRowCount` method. This check is crucial to avoid unnecessary operations or to handle scenarios differently based on the player count.

## GetString

This method retrieves the data from the specified column of the current row of a query result, casting it to a string type. It is useful for accessing database columns that contain text-based data.

### Parameters 
* column: number - The zero-based index of the column from which to retrieve the data.

### Returns
* string: The data content of the specified column casted to a string.

### Example Usage:

The following script demonstrates how to use the `GetString` method to get a player's name from the database, based on the player's GUID. This can be used, for example, in custom scripts that need to log or display the player's name without requiring the player to be online.

```typescript
const GET_PLAYER_NAME_BY_GUID: string = `
SELECT name 
FROM characters 
WHERE guid = ?`;

function LogPlayerNameByGuid(playerGuid: number): void {
    const query = WorldDBQuery(GET_PLAYER_NAME_BY_GUID, playerGuid);
    if (query) {
        // Since we're selecting only one column, it's column index 0
        const playerName: string = query.GetString(0);
        print(`Player Name: ${playerName}`);
    } else {
        print(`Player with GUID ${playerGuid} not found.`);
    }
}

// Register a command to test grabbing player names
RegisterPlayerCommand("logPlayerName", (player, args): void => {
    if (args.length < 1) {
        player.SendBroadcastMessage("Usage: .logPlayerName <playerGUID>");
        return;
    }

    const playerGuid: number = Number(args[0]);
    if (isNaN(playerGuid)) {
        player.SendBroadcastMessage("Please provide a valid player GUID.");
        return;
    }

    LogPlayerNameByGuid(playerGuid);
});

```

In this example, we define a custom command `.logPlayerName` which takes a player GUID as an argument. The script then retrieves the player's name from the `characters` table in the database using the `GetString` method to extract the name column from the result set.

The purpose of this script is to provide a simple demonstration of how to retrieve player information from the database without the need for the player to be in-game. It shows the versatility of directly interfacing with the server's database for custom scripts and functionalities within mod-eluna on Azerothcore.

## GetUInt16
Retrieve the data from the specified column of the current row, casting it to an unsigned 16-bit integer. This method is useful for fetching numerical values from a database query result where the data type is expected to be within the range of a 16-bit unsigned integer.

### Parameters
- **column**: number - The column index (starting from 0) from which to retrieve the data in the current row.

### Returns
- **value**: number - The value retrieved from the specified column, casted to an unsigned 16-bit integer.

### Example Usage:
In the example below, we perform a database query to fetch a specific NPC "entry" from the "creature_template" table. We then use `GetUInt16` to extract the NPC's model ID from the query result, assuming that the model ID is stored in the first column (index 0) of the result and can be appropriately cast to a 16-bit unsigned integer.

```typescript
import { ElunaQuery, WorldDBQuery } from 'mod-eluna';

// Function to fetch an NPC model ID by its entry ID
function fetchNPCModelID(npcEntry: number): number {
    // Prepare the SQL query to retrieve the NPC model ID
    const sql = `SELECT modelid1 FROM creature_template WHERE entry = ? LIMIT 1;`;

    // Execute the query with the npcEntry parameter
    const queryResult: ElunaQuery = WorldDBQuery(sql, npcEntry);

    // Check if the query successfully returned a row
    if (queryResult && queryResult.GetRowCount() > 0) {
        // Retrieve the model ID from the first column of the result
        const modelID: number = queryResult.GetUInt16(0);

        console.log(`Model ID for NPC entry ${npcEntry} is: ${modelID}`);
        return modelID;
    } else {
        console.log(`No data found for NPC entry ${npcEntry}.`);
        return 0;
    }
}

// Example usage of fetchNPCModelID function
const npcEntry = 12345; // Example NPC entry ID
const modelID = fetchNPCModelID(npcEntry);
```
This example demonstrates fetching a specific piece of numerical data from a database query result. The `GetUInt16` method efficiently casts the data to match the expected data type, allowing for straightforward handling of database query results.

## GetUInt32
Retrieves the data in the specified column of the current row from a database query's result set and casts it to an unsigned 32-bit integer. This method is integral for handling database results where the data type expected is a numeric value. It's commonly used in scenarios where integral values like item IDs, character IDs, or other numeric table identifiers are being queried from the database.

### Parameters
- **column**: number - The zero-based index of the column from which to retrieve the data.

### Returns
- **number** - The value in the specified column of the current row, casted to an unsigned 32-bit integer.

### Example Usage:
Suppose you have a database table `character_achievements` which tracks achievements that players have earned. Each row in the table contains, among other information, an achievement ID as an unsigned integer. The following script demonstrates how to query this table for a particular character's achievements and retrieve the achievement IDs using `GetUInt32`.

```typescript
const CHARACTER_ID: number = 1; // Example character ID
const QUERY = `SELECT achievement_id FROM character_achievements WHERE character_id = ${CHARACTER_ID}`;

const ProcessCharacterAchievements = (characterId: number): void => {
    // Execute the query to get achievements for the given character ID
    let results = WorldDBQuery(QUERY);

    if (results) {
        while (results.GetRow()) {
            // Retrieve the achievement ID from the current row
            let achievementId = results.GetUInt32(0); // Assuming 'achievement_id' is the first column

            // Log or process the achievement ID as needed
            console.log(`Achievement ID: ${achievementId}`);
            
            // Example processing function - assuming it exists
            ProcessAchievement(characterId, achievementId);
        }
    } else {
        console.error(`No achievements found for character ID: ${characterId}`);
    }
};

// Example usage – would be triggered via some event or specific game logic condition
ProcessCharacterAchievements(CHARACTER_ID);
```

In this example, `WorldDBQuery` is a hypothetical function that executes a SQL query and returns a result set object with a method `GetRow` to iterate through rows. `GetUInt32` is used to fetch the `achievement_id` from each row. This way, each achievement ID associated with the specified character is processed.

## GetUInt64
Obtains data from the specified column of the current row and casts it to an unsigned 64-bit integer. This method can be particularly useful when dealing with values that might exceed the range of a 32-bit integer, ensuring precise data handling from database queries.

### Parameters
- **column**: number - The zero-based index of the column in the query result set from which to retrieve the data.

### Returns
- **value**: number - The data from the specified column, casted to an unsigned 64-bit integer.

### Example Usage:

In this example, we're creating a script to fetch and display a player's account creation date (stored as a UNIX timestamp in the database) in a human-readable format. We assume this timestamp is stored in the second column (index 1) of our query result.

```typescript
import * as moment from 'moment'; // Assuming moment.js is available for formatting dates

// Function to fetch and display account creation date for a player
function showAccountCreationDate(player: Player) {
    // Replace '123' with the actual player ID variable or method to retrieve it
    const accountId = 123;
    const query = `SELECT id, creation_date FROM account WHERE id = ${accountId}`;

    // Execute the query
    const result = WorldDBQuery(query);

    if (result) {
        // Move to the first row of the result set
        result.NextRow();

        // Retrieve the account creation timestamp from the second column
        const creationTimestamp = result.GetUInt64(1);

        // Convert the UNIX timestamp to a readable date string using moment.js
        const creationDate = moment.unix(creationTimestamp).format('YYYY-MM-DD HH:mm:ss');

        // Notify the player of their account creation date
        player.SendBroadcastMessage(`Your account was created on: ${creationDate}`);
    } else {
        player.SendBroadcastMessage("Unable to retrieve your account creation date.");
    }
}

// Example event registration to demonstrate usage
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (_, player) => showAccountCreationDate(player));
```

In this example, `WorldDBQuery` is a fictional function used to represent the execution of a database query, and `PlayerEvents.PLAYER_EVENT_ON_LOGIN` denotes a hypothetical event triggered when a player logs in. We use `moment.js` to format the timestamp into a human-readable date.

## GetUInt8
This method is used to retrieve data from a specified column in the current row of a query result, and casts it to an unsigned 8-bit integer. This can be particularly useful when you are fetching numerical data that fits within the range of an 8-bit unsigned integer (0 to 255).

### Parameters
* **column**: number - The index of the column from which you want to fetch the data. Note that the indexing starts from `0`.

### Returns
* **number**: The data fetched from the specified column, casted to an unsigned 8-bit integer.

### Example Usage
Imagine you have a custom database table named `custom_npc_data` with the following structure:
- `id` INT (Primary Key)
- `name` VARCHAR
- `strength` TINYINT

You want to fetch the `strength` attribute (which is a TINYINT and perfectly fits into an 8-bit unsigned integer) of a specific NPC by its ID, and then use this value in your script.

```typescript
const NPC_DATA_QUERY = `SELECT strength FROM custom_npc_data WHERE id = ?`;

// Retrieved NPC ID for demonstration. In a real scenario, this might be dynamic.
const npcId = 1001;

// Prepare and execute the query by passing the NPC ID.
const queryResult = WorldDBQuery(NPC_DATA_QUERY, npcId);

// Assuming the query was successful and has at least one result row.
if (queryResult && queryResult.GetRowCount() > 0) {
    // Move to the first row in the result set.
    queryResult.NextRow();
    
    // Fetch the 'strength' column value as an unsigned 8-bit integer.
    const npcStrength = queryResult.GetUInt8(0); // 0 is the index for the first (and only) column in our SELECT.
    
    // Here, `npcStrength` would hold the strength value of our NPC, ready to be used further.
    print(`NPC with ID ${npcId} has a strength value of ${npcStrength}.`);
}
```

This example demonstrates how to execute a database query to the World database (assumed with `WorldDBQuery`), navigate through the result set, and utilize the `GetUInt8` method to fetch and use an 8-bit unsigned integer value from the database. This can be particularly useful in scenarios where values retrieved are known to be within the 8-bit unsigned integer range, optimizing memory and processing efficiency.

## IsNull
This method checks if the specified column in the current row of the executed query result is `NULL`. This is particularly useful when performing database operations that might return rows with optional values, ensuring that your script correctly handles NULL values to prevent errors or unintended behavior.

### Parameters
* column: number - The column index (starting from 0) to check for NULL value.

### Returns 
* boolean: Returns `true` if the specified column is `NULL`, otherwise returns `false`.

### Example Usage: 

Below is a script snippet that demonstrates how to use the `IsNull` method with an ElunaQuery result to check if a specific column in the retrieved data is null. This is particularly handy when dealing with optional fields in your database records.

```typescript
// Imagine you have a database table `character_optional_info` 
// with a column `last_login_ip` that might be NULL for some rows.

const PLAYER_INFO_QUERY = "SELECT last_login_ip FROM character_optional_info WHERE guid = ?";

const handlePlayerLogin: player_event_on_login = (event: number, player: Player): void => {

    const queryResult = WorldDBQuery(PLAYER_INFO_QUERY, player.GetGUID());
    
    if (queryResult && !queryResult.IsNull(0)) { // Checks if the 'last_login_ip' column is not NULL
        const lastLoginIp = queryResult.GetString(0); // Retrieving the IP as string
        player.SendBroadcastMessage(`Welcome back! Your last login was from IP: ${lastLoginIp}`);
    } else {
        player.SendBroadcastMessage("Welcome! It seems like this is your first time logging in, or your IP wasn't recorded last time.");
    }
    
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => handlePlayerLogin(...args));
```

In this example, when a player logs in, the script executes a query to retrieve their last login IP address from a hypothetical database table. Using `IsNull`, the script checks if the `last_login_ip` column is `NULL`. If it is not null, the player is greeted with a message including their last known IP address. If the column is null, implying the player has no recorded last login IP or this is their first login, a different message is displayed. This ensures a personalized interaction while handling potential null values effectively.

## NextRow
Advances the `ElunaQuery` object to the next row in the result set. It is important to note that this method should *not* be called immediately after executing a query because doing so will lead you to skip the first row of your results. This function is typically used within a loop to iterate through all rows returned by a query. 

### Returns
boolean - `true` if the method successfully advanced to the next row; `false` if there were no more rows to advance to.

### Example Usage:

Consider a scenario where you need to iterate through all players with a specific item in their inventory and perform actions based on the players' data. You might execute a database query to get this data and then use `NextRow()` to loop through the results.

```typescript
// Example function to find players with a particular item and perform an action
const findPlayersWithItem = (itemId: number): void => {
    let query = "SELECT guid, data FROM character_inventory WHERE item = " + itemId;
    
    let result = WorldDBQuery(query); // Execute the query on the World Database
    
    if (result) {
        // Iterate through each row of the result set
        while (result.NextRow()) { // Keep advancing to the next row until there are no more rows
            let playerGuid = result.GetInt32(0); // Assuming the first column is the GUID
            let playerData = result.GetString(1); // Assuming the second column contains some player data

            // Perform actions with the player's guid and data
            console.log(`Found player GUID: ${playerGuid} with data: ${playerData}`);
            // Additional logic could be applied here, such as modifying the player's data, sending a message, etc.
        }
    } else {
        console.log("No results found or query failed.");
    }
}

// Call the function with an example item ID
findPlayersWithItem(12345);
```

In this example, the `NextRow()` method is crucial for iterating over all the rows returned by the query. Remember not to call `NextRow()` before starting this loop, as the initial call to `WorldDBQuery(query)` already positions the internal cursor before the first row. Subsequent calls to `NextRow()` are necessary to advance through the result set.

