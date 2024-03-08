## AddMember
Adds a player to the group. If the group is full (5 players), the player will not be added.

### Parameters
* player: [Player](./player.md) - The player to add to the group

### Returns
boolean - True if the player was added to the group, false otherwise

### Example Usage
This example demonstrates how to add a player to a group when they enter the world, and send a message to the group if the player was successfully added.

```typescript
const OnLogin: player_event_on_login = (event: number, player: Player) => {
    const groupId = player.GetGroup();

    if (groupId) {
        const group = new Group(groupId);
        const playerName = player.GetName();

        if (group.AddMember(player)) {
            group.SendGroupMessage(`${playerName} has joined the group!`);

            // Get the leader of the group
            const leader = group.GetLeader();

            // Announce to the leader that a new player has joined
            leader.SendBroadcastMessage(`${playerName} has joined your group!`);

            // Set the player's group roles
            const isHealer = player.GetClass() === Classes.CLASS_PRIEST || player.GetClass() === Classes.CLASS_DRUID;
            const isTank = player.GetClass() === Classes.CLASS_WARRIOR || player.GetClass() === Classes.CLASS_PALADIN;

            if (isHealer) {
                group.SetGroupRole(player, GroupRole.Healer);
            } else if (isBank) {
                group.SetGroupRole(player, GroupRole.Tank);
            } else {
                group.SetGroupRole(player, GroupRole.DPS);
            }
        } else {
            player.SendBroadcastMessage("The group is full. You were not added to the group.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => OnLogin(...args));
```

In this example, when a player logs in, the script checks if the player is in a group. If the player is in a group, the script attempts to add the player to the group using the `AddMember` method. If the player is successfully added, a message is sent to the group announcing that the player has joined. Additionally, a message is sent to the group leader to inform them that a new player has joined their group.

The script also sets the player's group role based on their class. If the player is a priest or druid, they are assigned the healer role. If the player is a warrior or paladin, they are assigned the tank role. Otherwise, they are assigned the DPS role.

If the group is full and the player cannot be added, a message is sent to the player informing them that the group is full and they were not added.

## ConvertToRaid
Converts the current group to a raid group. This allows the group to have up to 40 members instead of the normal 5.

### Parameters
None

### Returns
None

### Example Usage
This example demonstrates how to convert a group to a raid when a player joins, and then invite additional members.

```typescript
const MAX_RAID_MEMBERS = 40;

const OnAddMember: group_event_on_add_member = (event: GroupEvents, group: Group, guid: number) => {
    // Convert to raid when the 5th player joins
    if (group.GetMembersCount() === 5) {
        group.ConvertToRaid();
        group.SendPacket(`The group has been converted to a raid group.`);
    }

    // If the group is a raid, and there's still room, invite some additional players
    if (group.isRaidGroup() && group.GetMembersCount() < MAX_RAID_MEMBERS) {
        // Get some additional player GUIDs to invite (for example from a list of signups)
        const additionalPlayers = GetAdditionalRaidSignups();

        for (const playerGuid of additionalPlayers) {
            // Check if the player is online and not already in the raid
            const player = GetPlayerByGUID(playerGuid);
            if (player && !group.IsMember(playerGuid)) {
                // Invite the player to the raid
                group.AddMember(playerGuid);

                // If the raid is now full, stop inviting
                if (group.GetMembersCount() >= MAX_RAID_MEMBERS) {
                    break;
                }
            }
        }
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_MEMBER_JOINED, OnAddMember);
```

In this example:

1. When the 5th player joins the group, `ConvertToRaid()` is called to upgrade the group to a raid.
2. The group is checked to see if it's a raid group using `isRaidGroup()`.
3. If the group is a raid and there's still room (less than `MAX_RAID_MEMBERS`), the script tries to invite additional players.
4. It gets an array of additional player GUIDs from a hypothetical function `GetAdditionalRaidSignups()`. This function could return GUIDs from a list of players who have signed up for the raid, for example.
5. For each additional player GUID, it checks if the player is online and not already in the raid.
6. If the player is eligible, they are invited to the raid using `group.AddMember(playerGuid)`.
7. If the raid reaches the maximum number of members, it stops inviting players.

This showcases a potential use case for `ConvertToRaid()` in a mod-eluna script for Azerothcore, demonstrating how to automatically convert a group to a raid and then fill it with additional members.

## Disband
Disbands the current group, removing all members and destroying the group object.

### Example Usage
Here's an example of how to use the `Disband()` method to disband a group after a certain condition is met, such as the group leader leaving the group or the group wiping on a boss encounter.

```typescript
const MAX_WIPES_ALLOWED = 5;
let wipeCounter = 0;

const GroupWipe: group_event_on_wipe = (event: number, group: Group, isRaid: boolean): void => {
    wipeCounter++;

    if (wipeCounter >= MAX_WIPES_ALLOWED) {
        group.SendGroupMessage(`The group has wiped ${MAX_WIPES_ALLOWED} times. Disbanding the group.`);
        group.Disband();
    } else {
        group.SendGroupMessage(`The group has wiped. Wipe counter: ${wipeCounter}/${MAX_WIPES_ALLOWED}`);
    }
};

const LeaderChanged: group_event_on_leader_change = (event: number, group: Group, newLeaderGuid: number, oldLeaderGuid: number): void => {
    const oldLeader = group.GetMember(oldLeaderGuid);
    if (oldLeader) {
        group.SendGroupMessage(`${oldLeader.GetName()} is no longer the group leader. Disbanding the group.`);
        group.Disband();
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_WIPE, (...args) => GroupWipe(...args));
RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_LEADER_CHANGE, (...args) => LeaderChanged(...args));
```

In this example:

1. We define a constant `MAX_WIPES_ALLOWED` to set the maximum number of wipes allowed before disbanding the group.
2. We initialize a variable `wipeCounter` to keep track of the number of wipes.
3. We register a callback function `GroupWipe` for the `GROUP_EVENT_ON_WIPE` event.
   - Inside the callback, we increment the `wipeCounter`.
   - If the `wipeCounter` reaches or exceeds `MAX_WIPES_ALLOWED`, we send a message to the group and disband it using `group.Disband()`.
   - If the wipe counter is below the threshold, we send a message to the group indicating the current wipe count.
4. We register another callback function `LeaderChanged` for the `GROUP_EVENT_ON_LEADER_CHANGE` event.
   - Inside the callback, we retrieve the old leader using `group.GetMember(oldLeaderGuid)`.
   - If the old leader exists (meaning they left the group), we send a message to the group and disband it using `group.Disband()`.

This script ensures that the group is automatically disbanded if:
- The group wipes a certain number of times (defined by `MAX_WIPES_ALLOWED`).
- The group leader leaves the group.

By using the `Disband()` method in combination with group events, you can create more complex scripts to handle group disbandment based on specific conditions or triggers.

## GetGUID
Returns the unique identifier for the group. This identifier is unique across all groups and remains constant throughout the lifetime of the group.

### Parameters
None

### Returns
* number - The unique identifier of the group.

### Example Usage
This example demonstrates how to use the `GetGUID()` method to track the progress of a group through a dungeon. The script listens for the `GROUP_EVENT_ON_DUNGEON_FINISH` event and records the completion time and the group's GUID in a database.

```typescript
const GROUP_EVENT_ON_DUNGEON_FINISH = 1;

// Function to handle the GROUP_EVENT_ON_DUNGEON_FINISH event
const onDungeonFinish: group_event_on_dungeon_finish = (event: number, group: Group, player: Player, dungeonId: number, dungeonName: string) => {
    // Get the current timestamp
    const completionTime = os.time();

    // Get the group's GUID
    const groupGUID = group.GetGUID();

    // Insert the completion record into the database
    const query = `
        INSERT INTO dungeon_completions (group_guid, dungeon_id, completion_time)
        VALUES (${groupGUID}, ${dungeonId}, ${completionTime})
    `;

    // Execute the database query
    database.query(query);

    // Announce the dungeon completion to the group
    const message = `Congratulations! You have completed the dungeon "${dungeonName}" at ${os.date('%Y-%m-%d %H:%M:%S', completionTime)}.`;
    group.SendPacket(message);
};

// Register the event handler for the GROUP_EVENT_ON_DUNGEON_FINISH event
RegisterGroupEvent(GROUP_EVENT_ON_DUNGEON_FINISH, onDungeonFinish);
```

In this example:
1. We define a function `onDungeonFinish` to handle the `GROUP_EVENT_ON_DUNGEON_FINISH` event.
2. Inside the event handler, we retrieve the current timestamp using `os.time()` to record the completion time.
3. We call the `GetGUID()` method on the `group` object to get the group's unique identifier.
4. We construct a database query to insert the completion record into a table named `dungeon_completions`, including the group's GUID, the dungeon ID, and the completion time.
5. We execute the database query using `database.query()` to store the completion record.
6. We generate a congratulatory message that includes the dungeon name and the completion time.
7. We send the message to all members of the group using the `SendPacket()` method.
8. Finally, we register the `onDungeonFinish` function as the event handler for the `GROUP_EVENT_ON_DUNGEON_FINISH` event using `RegisterGroupEvent()`.

This script allows you to track the progress of groups through dungeons by recording the completion time and the group's GUID in a database. You can later retrieve this information to analyze group performance, generate leaderboards, or reward players based on their dungeon completions.

## GetLeaderGUID
Returns the GUID (Globally Unique Identifier) of the [Group] leader. The GUID is a unique numerical identifier assigned to each player or creature in the game world.

### Parameters
None

### Returns
* number - The GUID of the [Group] leader.

### Example Usage
Here's an example of how to use the `GetLeaderGUID` method to retrieve the GUID of the group leader and perform actions based on the leader's class:

```typescript
const OnGroupMemberJoin: group_event_on_member_join = (event: number, group: Group, guid: number): void => {
    const leaderGuid = group.GetLeaderGUID();
    const leader = GetPlayerByGUID(leaderGuid);

    if (leader) {
        const leaderClass = leader.GetClass();

        switch (leaderClass) {
            case Classes.CLASS_WARRIOR:
                leader.SendBroadcastMessage("The mighty warrior leads the group!");
                break;
            case Classes.CLASS_PALADIN:
                leader.SendBroadcastMessage("The holy paladin guides the group!");
                break;
            case Classes.CLASS_HUNTER:
                leader.SendBroadcastMessage("The skilled hunter leads the pack!");
                break;
            case Classes.CLASS_ROGUE:
                leader.SendBroadcastMessage("The cunning rogue takes charge!");
                break;
            case Classes.CLASS_PRIEST:
                leader.SendBroadcastMessage("The wise priest leads the faithful!");
                break;
            case Classes.CLASS_SHAMAN:
                leader.SendBroadcastMessage("The spiritual shaman guides the group!");
                break;
            case Classes.CLASS_MAGE:
                leader.SendBroadcastMessage("The arcane mage leads the way!");
                break;
            case Classes.CLASS_WARLOCK:
                leader.SendBroadcastMessage("The dark warlock assumes control!");
                break;
            case Classes.CLASS_DRUID:
                leader.SendBroadcastMessage("The nurturing druid leads the group!");
                break;
            default:
                leader.SendBroadcastMessage("A mysterious leader guides the group!");
                break;
        }
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_MEMBER_JOIN, (...args) => OnGroupMemberJoin(...args));
```

In this example, when a new member joins the group, the script retrieves the GUID of the group leader using `GetLeaderGUID()`. It then uses the `GetPlayerByGUID` function to obtain the leader's [Player] object.

If the leader is found, the script checks the leader's class using `GetClass()` and sends a broadcast message to the leader based on their class. Each class has a unique message tailored to their role and identity.

This script demonstrates how to utilize the `GetLeaderGUID` method to retrieve the group leader's GUID and perform class-specific actions or notifications based on the leader's class.

## GetMemberGUID
Returns the GUID of a group member by their name. This can be used to interact with or reference a specific group member.

### Parameters
* name: string - The name of the group member to retrieve the GUID for.

### Returns
* GUID: number - The GUID of the specified group member. Returns 0 if the member is not found.

### Example Usage
This example demonstrates how to retrieve a specific group member's GUID and use it to send them a message and summon them to the group leader's location.

```typescript
const sendGroupMemberMessage: CommandFn = (player: Player, command: string, args: string[]) => {
    const groupMemberName = args[0];
    
    if (player.IsInGroup()) {
        const group = player.GetGroup();
        const memberGUID = group.GetMemberGUID(groupMemberName);
        
        if (memberGUID !== 0) {
            const member = GetPlayerByGUID(memberGUID);
            
            if (member) {
                // Send a message to the group member
                member.SendBroadcastMessage(`Hello, ${member.GetName()}! Your group leader has a message for you.`);
                
                // Summon the group member to the leader's location
                const leaderMapId = player.GetMapId();
                const leaderX = player.GetX();
                const leaderY = player.GetY();
                const leaderZ = player.GetZ();
                const leaderO = player.GetO();
                
                member.SummonPlayer(leaderMapId, leaderX, leaderY, leaderZ, leaderO);
                
                player.SendBroadcastMessage(`Successfully summoned ${member.GetName()} to your location.`);
            } else {
                player.SendBroadcastMessage(`Error: Group member ${groupMemberName} is offline or not found.`);
            }
        } else {
            player.SendBroadcastMessage(`Error: No group member found with the name ${groupMemberName}.`);
        }
    } else {
        player.SendBroadcastMessage("You are not in a group.");
    }
};

ChatCommands.on("summonmember", sendGroupMemberMessage);
```

In this example:
1. The `sendGroupMemberMessage` function is defined as a `CommandFn`, which is triggered by the "summonmember" chat command.
2. It checks if the player is in a group using `player.IsInGroup()`.
3. If the player is in a group, it retrieves the group object using `player.GetGroup()`.
4. It then calls the `GetMemberGUID` method on the group object, passing the desired group member's name as an argument.
5. If a valid GUID is returned (not 0), it uses `GetPlayerByGUID` to retrieve the player object for that group member.
6. If the member is found, it sends them a broadcast message using `member.SendBroadcastMessage`.
7. It then retrieves the group leader's current location using `GetMapId`, `GetX`, `GetY`, `GetZ`, and `GetO`.
8. The `SummonPlayer` method is called on the member object to summon them to the leader's location.
9. A success message is sent to the group leader using `player.SendBroadcastMessage`.
10. If the member is not found or the player is not in a group, appropriate error messages are sent using `player.SendBroadcastMessage`.

This example showcases how to retrieve a group member's GUID, send them a message, and summon them to the group leader's location using the `GetMemberGUID` method and other related methods from the `Player` and `Group` classes.

## GetMemberGroup
Returns the subgroup ID of a player in the group based on their GUID.

### Parameters
* guid: number - The GUID of the player to check the subgroup ID for.

### Returns
* number - The subgroup ID of the player (0-7). Returns -1 if the player is not found in the group.

### Example Usage
```typescript
// Function to handle group invite event
const OnGroupInvite: group_event_on_invite = (event: number, group: Group, leader: Player, invitedPlayer: Player): void => {
    // Get the leader's subgroup ID
    const leaderSubgroup = group.GetMemberGroup(leader.GetGUID());

    // Assign the invited player to the same subgroup as the leader
    if (leaderSubgroup !== -1) {
        group.ChangeMembersGroup(invitedPlayer, leaderSubgroup);
    }

    // Announce the player's subgroup assignment
    if (leaderSubgroup === 0) {
        SendWorldMessage(`${invitedPlayer.GetName()} has joined ${leader.GetName()}'s group as a main tank.`);
    } else if (leaderSubgroup === 1) {
        SendWorldMessage(`${invitedPlayer.GetName()} has joined ${leader.GetName()}'s group as an off-tank.`);
    } else if (leaderSubgroup >= 2 && leaderSubgroup <= 4) {
        SendWorldMessage(`${invitedPlayer.GetName()} has joined ${leader.GetName()}'s group as a DPS.`);
    } else if (leaderSubgroup >= 5 && leaderSubgroup <= 7) {
        SendWorldMessage(`${invitedPlayer.GetName()} has joined ${leader.GetName()}'s group as a healer.`);
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_INVITE, OnGroupInvite);
```

In this example, when a player is invited to a group, the script retrieves the subgroup ID of the group leader using `GetMemberGroup()`. If the leader is found in a valid subgroup, the invited player is assigned to the same subgroup using `ChangeMembersGroup()`.

The script then announces the player's subgroup assignment based on the subgroup ID. Subgroup 0 is considered the main tank, subgroup 1 is considered the off-tank, subgroups 2-4 are considered DPS, and subgroups 5-7 are considered healers.

This example demonstrates how `GetMemberGroup()` can be used to retrieve the subgroup ID of a player in the group and make decisions based on that information, such as assigning roles or making announcements.

## GetMembers
Returns a table containing all the players currently in the group.

### Parameters
None

### Returns
players: [Player](./player.md)[] - A table of players in the group.

### Example Usage
Reward all players in a group with a special item when the group leader loots a specific boss.

```typescript
const BOSS_ENTRY = 12345;
const SPECIAL_ITEM_ENTRY = 54321;
const SPECIAL_ITEM_COUNT = 1;

const BossLoot: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    if (item.GetEntry() == BOSS_ENTRY && player.IsInGroup()) {
        const group = player.GetGroup();
        
        if (group && player.IsGroupLeader()) {
            const groupMembers = group.GetMembers();

            for (const member of groupMembers) {
                if (member.IsInWorld() && member.GetDistance(player) <= 50) {
                    member.AddItem(SPECIAL_ITEM_ENTRY, SPECIAL_ITEM_COUNT);
                    member.SendBroadcastMessage("You have been rewarded with a special item for your group's efforts!");
                }
            }

            player.SendBroadcastMessage("Your group has been rewarded for defeating the boss!");
        }
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => BossLoot(...args));
```

In this example:
1. When a player loots an item, the script checks if the looted item is from a specific boss (identified by its entry ID) and if the player is in a group.
2. If the player is the group leader, the script retrieves all members of the group using `group.GetMembers()`.
3. The script then iterates through each group member and checks if they are in the game world and within a certain distance (50 yards) of the group leader.
4. If a group member meets these conditions, they are rewarded with a special item using `member.AddItem()` and sent a broadcast message informing them of the reward.
5. Finally, the group leader is sent a broadcast message confirming that the group has been rewarded for defeating the boss.

This script showcases how `GetMembers()` can be used to retrieve all players in a group and perform actions on them, such as rewarding them with items or sending them messages. It also demonstrates how to check if a player is the group leader and if group members are within a certain distance of each other.

## GetMembersCount
Returns the number of players currently in the group.

### Parameters
None

### Returns
number - The count of players currently in the group.

### Example Usage
This example demonstrates how to use the `GetMembersCount` method to determine the size of a group and adjust the difficulty of an encounter accordingly.

```typescript
const BOSS_ENTRY = 12345;
const BOSS_MIN_PLAYERS = 5;
const BOSS_MAX_PLAYERS = 10;
const BOSS_HEALTH_PER_PLAYER = 100000;

const AdjustBossDifficulty: creature_event_on_spawn = (event: number, creature: Creature) => {
    if (creature.GetEntry() === BOSS_ENTRY) {
        const map = creature.GetMap();
        const players = map.GetPlayers();

        if (players.length > 0) {
            const group = players[0].GetGroup();

            if (group) {
                const memberCount = group.GetMembersCount();

                if (memberCount >= BOSS_MIN_PLAYERS && memberCount <= BOSS_MAX_PLAYERS) {
                    const adjustedHealth = creature.GetMaxHealth() + (memberCount * BOSS_HEALTH_PER_PLAYER);
                    creature.SetMaxHealth(adjustedHealth);
                    creature.SetHealth(adjustedHealth);
                    console.log(`Adjusted boss health to ${adjustedHealth} for ${memberCount} players.`);
                } else {
                    console.log(`Group size of ${memberCount} is not within the expected range for this encounter.`);
                }
            } else {
                console.log("Players are not in a group. Skipping difficulty adjustment.");
            }
        } else {
            console.log("No players found on the map. Skipping difficulty adjustment.");
        }
    }
};

RegisterCreatureEvent(CreatureEvents.CREATURE_EVENT_ON_SPAWN, (...args) => AdjustBossDifficulty(...args));
```

In this example, when a specific boss creature spawns, the script checks if there are players on the same map. If players are found, it retrieves the group of the first player. Using the `GetMembersCount` method, the script determines the number of players in the group.

If the group size falls within the predefined range (`BOSS_MIN_PLAYERS` to `BOSS_MAX_PLAYERS`), the script adjusts the boss's health based on the number of players. It increases the boss's maximum health by a fixed amount (`BOSS_HEALTH_PER_PLAYER`) for each player in the group. The adjusted health is then set as the boss's current health.

If the group size is outside the expected range or if players are not in a group, the script logs a message and skips the difficulty adjustment.

This example showcases how the `GetMembersCount` method can be used to dynamically scale the difficulty of an encounter based on the number of players in the group, providing a more balanced and engaging experience for different group sizes.

## HasFreeSlotSubGroup
Checks if the specified subgroup in the [Group] has free slots available for new members to join.

### Parameters
* subGroup: number - The subgroup index (0-7) to check for free slots.

### Returns
* boolean - Returns 'true' if the specified subgroup has free slots, 'false' otherwise.

### Example Usage
This example demonstrates how to check if a specific subgroup in a raid has free slots available and invite a player to join that subgroup if there is space.

```typescript
const MAX_RAID_MEMBERS = 40;
const HEALER_SUBGROUP = 3;

const InviteHealerToRaid: player_event_on_login = (event: number, player: Player) => {
    // Get the player's raid group
    const raid = player.GetGroup();

    if (raid && raid.IsRaid()) {
        // Check if the raid has reached the maximum member limit
        if (raid.GetMembersCount() < MAX_RAID_MEMBERS) {
            // Check if the healer subgroup has free slots
            if (raid.HasFreeSlotSubGroup(HEALER_SUBGROUP)) {
                // Invite the player to join the healer subgroup
                raid.AddMember(player, HEALER_SUBGROUP);
                player.SendBroadcastMessage("Welcome to the raid! You have been assigned to the healer subgroup.");
            } else {
                player.SendBroadcastMessage("Sorry, the healer subgroup is currently full. Please try again later.");
            }
        } else {
            player.SendBroadcastMessage("The raid is already at maximum capacity. Please try joining another raid group.");
        }
    } else {
        player.SendBroadcastMessage("You are not currently in a raid group. Please join or create a raid before using this feature.");
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => InviteHealerToRaid(...args));
```

In this example:
1. We define constants for the maximum number of raid members (40) and the index of the healer subgroup (3).
2. When a player logs in, we retrieve their raid group using `player.GetGroup()`.
3. We check if the player is in a raid group using `raid.IsRaid()`.
4. If the raid has not reached the maximum member limit, we proceed to check if the healer subgroup has free slots using `raid.HasFreeSlotSubGroup(HEALER_SUBGROUP)`.
5. If there are free slots in the healer subgroup, we invite the player to join that subgroup using `raid.AddMember(player, HEALER_SUBGROUP)` and send them a welcome message.
6. If the healer subgroup is full, we send the player a message informing them that the subgroup is currently full and to try again later.
7. If the raid is already at maximum capacity, we send the player a message suggesting they join another raid group.
8. If the player is not in a raid group, we send them a message prompting them to join or create a raid before using this feature.

This example showcases how the `HasFreeSlotSubGroup` method can be used in combination with other group-related methods to manage subgroup assignments and capacity in a raid setting.

## IsAssistant
Checks if the specified player is an assistant in the group.

### Parameters
* guid: number - The GUID of the player to check.

### Returns
* boolean - Returns `true` if the player is an assistant in the group, `false` otherwise.

### Example Usage
This example demonstrates how to check if a player is an assistant in the group and grant them additional rewards for completing a quest.

```typescript
const QUEST_ENTRY = 1234;
const ITEM_REWARD_ENTRY = 5678;
const ITEM_REWARD_COUNT = 1;
const GOLD_REWARD = 100;

const OnQuestComplete: player_event_on_quest_accept = (event: number, player: Player, quest: Quest) => {
    if (quest.GetEntry() === QUEST_ENTRY) {
        const group = player.GetGroup();
        if (group) {
            const members = group.GetMembers();
            for (const member of members) {
                if (group.IsAssistant(member.GetGUIDLow())) {
                    member.AddItem(ITEM_REWARD_ENTRY, ITEM_REWARD_COUNT);
                    member.ModifyMoney(GOLD_REWARD);
                    member.SendBroadcastMessage("You received an additional reward for being a group assistant!");
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_QUEST_COMPLETE, (...args) => OnQuestComplete(...args));
```

In this example:
1. We define constants for the quest entry, item reward entry, item reward count, and gold reward amount.
2. We register a player event for when a quest is completed using `RegisterPlayerEvent` and the `PLAYER_EVENT_ON_QUEST_COMPLETE` event.
3. Inside the event handler, we check if the completed quest matches the desired quest entry.
4. If the player is in a group, we retrieve the group using `player.GetGroup()`.
5. We iterate over the group members using `group.GetMembers()`.
6. For each member, we check if they are an assistant in the group using `group.IsAssistant(member.GetGUIDLow())`.
7. If a member is an assistant, we grant them additional rewards:
   - We add the specified item to their inventory using `member.AddItem(ITEM_REWARD_ENTRY, ITEM_REWARD_COUNT)`.
   - We modify their money by the specified gold reward amount using `member.ModifyMoney(GOLD_REWARD)`.
   - We send them a broadcast message informing them of the additional reward using `member.SendBroadcastMessage(...)`.

This example showcases how the `IsAssistant` method can be used in a practical scenario to differentiate rewards based on a player's role within the group. It provides a more complex usage of the method, involving group member iteration and conditional reward distribution.

## IsBGGroup
This method returns a boolean value indicating whether the group is a battleground group or not.

### Parameters
None

### Returns
boolean - Returns `true` if the group is a battleground group, `false` otherwise.

### Example Usage
This example demonstrates how to check if a group is a battleground group and perform different actions based on the result.

```typescript
const OnGroupCreated: group_event_on_create = (event: number, group: Group, leader: Player): void => {
    if (group.IsBGGroup()) {
        // Perform actions specific to battleground groups
        leader.SendBroadcastMessage("You have created a battleground group!");

        // Set the battleground group's objective
        const objective = "Capture the enemy flag";
        group.SendGroupMessage(`Your objective is to ${objective}`);

        // Assign roles to group members
        const members = group.GetMembers();
        members.forEach((member: Player, index: number) => {
            if (index === 0) {
                member.SendBroadcastMessage("You have been assigned the role of flag carrier.");
            } else if (index === 1) {
                member.SendBroadcastMessage("You have been assigned the role of defender.");
            } else {
                member.SendBroadcastMessage("You have been assigned the role of attacker.");
            }
        });
    } else {
        // Perform actions for regular groups
        leader.SendBroadcastMessage("You have created a regular group!");

        // Set the group's goal
        const goal = "Complete the dungeon";
        group.SendGroupMessage(`Your goal is to ${goal}`);

        // Assign roles to group members
        const members = group.GetMembers();
        members.forEach((member: Player, index: number) => {
            if (index === 0) {
                member.SendBroadcastMessage("You have been assigned the role of tank.");
            } else if (index === 1) {
                member.SendBroadcastMessage("You have been assigned the role of healer.");
            } else {
                member.SendBroadcastMessage("You have been assigned the role of damage dealer.");
            }
        });
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_CREATE, (...args) => OnGroupCreated(...args));
```

In this example, when a group is created, the script checks if it is a battleground group using the `IsBGGroup()` method. If it is a battleground group, it performs specific actions such as sending a broadcast message to the leader, setting the group's objective, and assigning roles to group members.

If the group is not a battleground group, it performs different actions suitable for regular groups, such as sending a different broadcast message to the leader, setting the group's goal, and assigning roles to group members.

This example showcases how the `IsBGGroup()` method can be used to differentiate between battleground groups and regular groups, allowing you to implement different behaviors and functionalities based on the group type.

## IsFull
The `IsFull()` method checks if the group is currently full, meaning it has reached the maximum number of members allowed in the group.

### Parameters
This method does not take any parameters.

### Returns
- `boolean` - Returns `true` if the group is full, `false` otherwise.

### Example Usage
Here's an example of how to use the `IsFull()` method to check if a group is full before inviting a player to join:

```typescript
const MAX_GROUP_SIZE = 5;

const onInviteToGroup: player_event_on_invite_to_group = (event: number, player: Player, group: Group): void => {
    if (!group) {
        // Create a new group if the player is not in one
        group = new Group();
        player.SetGroup(group);
    }

    if (group.IsFull()) {
        player.SendBroadcastMessage("Sorry, the group is already full.");
        return;
    }

    // Invite the player to the group
    group.AddMember(player);

    // Notify the group members
    group.SendPacket(`${player.GetName()} has joined the group.`);

    // If the group becomes full after adding the player, announce it
    if (group.IsFull()) {
        group.SendPacket("The group is now full!");

        // Optionally, you can start a group activity or quest
        const questId = 1234; // Replace with the desired quest ID
        if (group.GetMembersCount() === MAX_GROUP_SIZE && !group.HasQuest(questId)) {
            group.AddQuest(questId);
            group.SendPacket(`Quest ${questId} has been added to the group.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_INVITE_TO_GROUP, (...args) => onInviteToGroup(...args));
```

In this example:
1. When a player is invited to a group, the script first checks if the player is already in a group. If not, it creates a new group and sets the player's group.

2. The script then uses the `IsFull()` method to check if the group is already full. If it is, it sends a message to the player indicating that the group is full and returns.

3. If the group is not full, the player is added to the group using the `AddMember()` method.

4. The script notifies all group members that the player has joined the group.

5. After adding the player, the script checks again if the group has become full using `IsFull()`. If it has, it announces to the group that it is now full.

6. Optionally, if the group size reaches the maximum size (`MAX_GROUP_SIZE`) and the group doesn't have a specific quest, the script adds the quest to the group using `AddQuest()` and notifies the group members.

This example demonstrates how to use the `IsFull()` method in combination with other group-related methods to manage group membership and perform actions based on the group's state.

## IsLeader
Returns whether the specified player is the leader of the group.

### Parameters
* guid: number - The GUID of the player to check.

### Returns
* boolean - True if the specified player is the group leader, false otherwise.

### Example Usage
This example demonstrates how to check if a player is the leader of their group when they enter a specific area, and if so, grant them a special item.

```typescript
const AREA_ID = 1234; // Replace with the desired area ID
const ITEM_ENTRY = 5678; // Replace with the desired item entry

const onAreaTrigger: player_event_on_area_trigger = (event: number, player: Player, triggerId: number): void => {
    if (triggerId === AREA_ID) {
        const group = player.GetGroup();
        if (group) {
            const isLeader = group.IsLeader(player.GetGUID());
            if (isLeader) {
                const item = player.AddItem(ITEM_ENTRY, 1);
                if (item) {
                    player.SendBroadcastMessage("As the leader of your group, you have been granted a special item!");
                } else {
                    player.SendBroadcastMessage("Your inventory is full. Unable to grant the special item.");
                }
            }
        } else {
            player.SendBroadcastMessage("You must be in a group to receive the special item.");
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_AREA_TRIGGER, (...args) => onAreaTrigger(...args));
```

In this example:
1. We define the desired area ID (`AREA_ID`) and the item entry (`ITEM_ENTRY`) that we want to grant to the group leader.
2. We register the `PLAYER_EVENT_ON_AREA_TRIGGER` event to listen for when a player enters a specific area.
3. When the event is triggered, we check if the triggered area ID matches the desired area ID.
4. If the player is in the specified area, we retrieve their group using `player.GetGroup()`.
5. If the player is in a group, we use `group.IsLeader(player.GetGUID())` to check if the player is the leader of the group.
6. If the player is the group leader, we attempt to add the special item to their inventory using `player.AddItem(ITEM_ENTRY, 1)`.
   - If the item is successfully added, we send a broadcast message to the player indicating that they have received the special item.
   - If the player's inventory is full, we send a broadcast message informing them that the item could not be granted.
7. If the player is not in a group, we send a broadcast message indicating that they must be in a group to receive the special item.

This example showcases how to use the `IsLeader` method to determine if a player is the leader of their group and perform specific actions based on that information, such as granting a special item or sending customized messages.

## IsMember
The `IsMember` method checks if a player is a member of the group by their GUID (Globally Unique Identifier).

### Parameters
* guid: number - The GUID of the player to check for membership.

### Returns
* boolean - Returns `true` if the player with the specified GUID is a member of the group, `false` otherwise.

### Example Usage
In this example, we have a script that listens for the `PLAYER_EVENT_ON_CHAT` event. When a player sends a message starting with "!checkMember", the script will check if the specified player is a member of the sender's group.

```typescript
const onChat: player_event_on_chat = (event: number, player: Player, msg: string, type: number, lang: Language): void => {
    if (msg.startsWith("!checkMember")) {
        const targetName = msg.substring(13); // Extract the target player's name
        const targetPlayer = GetPlayerByName(targetName);

        if (targetPlayer) {
            const group = player.GetGroup();

            if (group) {
                if (group.IsMember(targetPlayer.GetGUID())) {
                    player.SendBroadcastMessage(`${targetName} is a member of your group.`);
                } else {
                    player.SendBroadcastMessage(`${targetName} is not a member of your group.`);
                }
            } else {
                player.SendBroadcastMessage("You are not in a group.");
            }
        } else {
            player.SendBroadcastMessage(`Player '${targetName}' not found.`);
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onChat(...args));
```

In this script:
1. We check if the player's message starts with "!checkMember".
2. If it does, we extract the target player's name from the message.
3. We attempt to find the target player using `GetPlayerByName`.
4. If the target player is found, we get the sender's group using `player.GetGroup()`.
5. If the sender is in a group, we use `group.IsMember(targetPlayer.GetGUID())` to check if the target player is a member of that group.
6. We send a broadcast message to the sender indicating whether the target player is a member of their group or not.
7. If the sender is not in a group or the target player is not found, we send appropriate messages to the sender.

This script allows players to quickly check if another player is a member of their group by sending a message in the chat with the format "!checkMember PlayerName".

## IsRaidGroup
Returns 'true' if the [Group] is a raid group.

### Parameters
This method does not take any parameters.

### Returns
boolean: 'true' if the [Group] is a raid group, 'false' otherwise.

### Example Usage
This example demonstrates how to check if a group is a raid group and perform different actions based on the result.

```typescript
const OnGroupFormed: group_event_on_create = (eventId: number, group: Group) => {
    // Get the leader of the group
    const leader = group.GetLeader();

    // Check if the group is a raid group
    if (group.IsRaidGroup()) {
        // If it's a raid group, send a message to the leader
        leader.SendBroadcastMessage("You have formed a raid group!");

        // Reward the leader with a special item for forming a raid group
        const rewardItemEntry = 12345; // Replace with the desired item entry ID
        const rewardItemCount = 1;
        leader.AddItem(rewardItemEntry, rewardItemCount);

        // Announce to the raid group that they have been rewarded
        group.SendPacketToAll("The raid leader has been rewarded for forming the group!");
    } else {
        // If it's a regular group, send a different message to the leader
        leader.SendBroadcastMessage("You have formed a regular group.");

        // Reward all group members with a smaller item
        const rewardItemEntry = 67890; // Replace with the desired item entry ID
        const rewardItemCount = 1;
        group.GetMembers().forEach((member) => {
            member.AddItem(rewardItemEntry, rewardItemCount);
        });

        // Announce to the group that they have been rewarded
        group.SendPacketToAll("All group members have been rewarded!");
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_CREATE, OnGroupFormed);
```

In this example:

1. When a group is formed, the script checks if it is a raid group using the `IsRaidGroup()` method.
2. If it is a raid group:
   - The leader receives a special broadcast message.
   - The leader is rewarded with a specific item (you need to replace `rewardItemEntry` with the desired item entry ID).
   - The entire raid group is notified that the leader has been rewarded.
3. If it is a regular group:
   - The leader receives a different broadcast message.
   - All group members are rewarded with a smaller item (you need to replace `rewardItemEntry` with the desired item entry ID).
   - The entire group is notified that all members have been rewarded.

This script showcases how you can differentiate between raid groups and regular groups using the `IsRaidGroup()` method and perform different actions accordingly. You can customize the rewards, messages, and other actions based on your specific requirements.

## RemoveMember
Removes a player from the group using the specified remove method. If the player is successfully removed, the method returns 'true'.

### Parameters
* guid: number - The GUID of the player to remove from the group.
* method: [RemoveMethod](./group.md#removemethod) - The method to use when removing the player from the group.

### Returns
* boolean - 'true' if the player was successfully removed from the group, 'false' otherwise.

### Example Usage
```typescript
const OnLootItem: player_event_on_loot_item = (event: number, player: Player, item: Item) => {
    const itemId = item.GetEntry();
    const itemCount = item.GetCount();

    // Check if the looted item is a quest item
    if (IsQuestItem(itemId)) {
        const group = player.GetGroup();

        if (group) {
            const groupMembers = group.GetMembers();

            // Iterate through group members and remove those who don't need the quest item
            for (const memberGuid of groupMembers) {
                const member = group.GetMember(memberGuid);

                if (member && !member.HasQuest(GetQuestIdForItem(itemId))) {
                    // Remove the member from the group using the leave method
                    const removed = group.RemoveMember(memberGuid, RemoveMethod.GROUP_REMOVEMETHOD_LEAVE);

                    if (removed) {
                        // Notify the removed player
                        member.SendBroadcastMessage("You have been removed from the group because you don't need the quest item.");
                    }
                }
            }

            // Equally distribute the quest items among the remaining group members
            const remainingMembers = group.GetMembers();
            const itemsPerMember = Math.floor(itemCount / remainingMembers.length);

            for (const memberGuid of remainingMembers) {
                const member = group.GetMember(memberGuid);

                if (member) {
                    member.AddItem(itemId, itemsPerMember);
                }
            }
        }
    }
};

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOOT_ITEM, (...args) => OnLootItem(...args));
```

### RemoveMethod
The `RemoveMethod` enum represents the different methods that can be used to remove a player from a group.

```typescript
enum RemoveMethod
{
    GROUP_REMOVEMETHOD_DEFAULT  = 0,
    GROUP_REMOVEMETHOD_KICK     = 1,
    GROUP_REMOVEMETHOD_LEAVE    = 2,
    GROUP_REMOVEMETHOD_KICK_LFG = 3
};
```

* `GROUP_REMOVEMETHOD_DEFAULT`: The default method for removing a player from the group.
* `GROUP_REMOVEMETHOD_KICK`: The player is kicked from the group.
* `GROUP_REMOVEMETHOD_LEAVE`: The player leaves the group voluntarily.
* `GROUP_REMOVEMETHOD_KICK_LFG`: The player is kicked from the group through the LFG system.

## SameSubGroup
Determines if two players are in the same subgroup within the group.

### Parameters
- player1: [Player](./player.md) - The first player to check
- player2: [Player](./player.md) - The second player to check

### Returns
- boolean - Returns 'true' if the players are in the same subgroup, 'false' otherwise.

### Example Usage
This example demonstrates how to use the `SameSubGroup` method to determine if two players are in the same subgroup within a group. It checks if the group leader and a random member are in the same subgroup, and sends a message to the group based on the result.

```typescript
const CheckSubgroupMembers: GroupEventOnLeaderChange = (event: number, group: Group, newLeader: Player, oldLeader: Player) => {
    // Get a random member from the group
    const members = group.GetMembers();
    const randomMember = members[Math.floor(Math.random() * members.length)];

    // Check if the new leader and the random member are in the same subgroup
    const sameSubgroup = group.SameSubGroup(newLeader, randomMember);

    // Prepare the message based on the result
    let message = "";
    if (sameSubgroup) {
        message = `The new group leader ${newLeader.GetName()} and member ${randomMember.GetName()} are in the same subgroup.`;
    } else {
        message = `The new group leader ${newLeader.GetName()} and member ${randomMember.GetName()} are in different subgroups.`;
    }

    // Send the message to the group
    group.SendPacket(message);
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_LEADER_CHANGE, (...args) => CheckSubgroupMembers(...args));
```

In this example:
1. We register a group event handler for the `GROUP_EVENT_ON_LEADER_CHANGE` event using `RegisterGroupEvent`.
2. Inside the event handler `CheckSubgroupMembers`, we retrieve a random member from the group using `group.GetMembers()` and random selection.
3. We call the `SameSubGroup` method, passing the new leader (`newLeader`) and the randomly selected member (`randomMember`) as arguments to determine if they are in the same subgroup.
4. Based on the result of `SameSubGroup`, we prepare an appropriate message indicating whether the new leader and the random member are in the same subgroup or different subgroups.
5. Finally, we send the message to the entire group using `group.SendPacket(message)`.

This script showcases how the `SameSubGroup` method can be used to check the subgroup relationship between two players within a group, allowing for customized actions or messages based on the result.

## SendPacket
Sends a specified [WorldPacket](./worldpacket.md) to all players in the [Group](./group.md), with the option to ignore certain players based on their status or GUID.

### Parameters
* packet: [WorldPacket](./worldpacket.md) - The WorldPacket to send to the group members.
* ignorePlayersInBg: boolean - If set to true, players in a battleground will not receive the packet.
* ignore: number - The GUID of a player to ignore when sending the packet.

### Example Usage
This example demonstrates how to use the `SendPacket` method to send a custom message to all group members, excluding players in a battleground and a specific player identified by their GUID.

```typescript
const IGNORED_PLAYER_GUID = 12345;

function SendCustomGroupMessage(group: Group, message: string) {
    // Create a new WorldPacket
    const packet = new WorldPacket(0, message.length);
    packet.WriteString(message);

    // Send the packet to the group, ignoring players in BGs and the specified player
    group.SendPacket(packet, true, IGNORED_PLAYER_GUID);
}

// Example usage in an event
const OnGroupMemberJoin: group_event_on_member_join = (event: number, group: Group, guid: number): void => {
    const welcomeMessage = `Welcome to the group, player with GUID ${guid}!`;
    SendCustomGroupMessage(group, welcomeMessage);

    // Notify the group leader about the new member
    const leader = group.GetLeader();
    if (leader && leader.GetGUID() !== guid) {
        const leaderNotification = `Player with GUID ${guid} has joined your group.`;
        const leaderPacket = new WorldPacket(0, leaderNotification.length);
        leaderPacket.WriteString(leaderNotification);
        leader.SendPacket(leaderPacket);
    }
};

RegisterGroupEvent(GroupEvents.GROUP_EVENT_ON_MEMBER_JOIN, (...args) => OnGroupMemberJoin(...args));
```

In this example, when a new player joins the group, a custom welcome message is sent to all group members using the `SendCustomGroupMessage` function. The function creates a new `WorldPacket` with the message and sends it to the group using `SendPacket`, ignoring players in battlegrounds and a specific player identified by their GUID.

Additionally, the group leader receives a separate notification about the new member, using the `GetLeader` method to retrieve the leader's [Player](./player.md) object and sending them a personalized message using `SendPacket`.

This showcases how the `SendPacket` method can be used in combination with other group-related methods and events to create custom group messaging and notifications.

## SetLeader
Sets the leader of the [Group] to the player with the specified GUID.

### Parameters
* guid: number - The GUID of the player to set as the leader of the [Group].

### Example Usage
```typescript
// Event handler for when a player logs in
const OnLogin: player_event_on_login = (event: PlayerEvents, player: Player) => {
    // Get the player's GUID
    const playerGuid = player.GetGUID();

    // Get the player's group
    const group = player.GetGroup();

    if (group) {
        // Check if the player is the group leader
        if (group.GetLeaderGUID() !== playerGuid) {
            // If the player is not the leader, check if they have a specific item
            const requiredItem = 1234; // Replace with the desired item entry
            const hasItem = player.HasItem(requiredItem);

            if (hasItem) {
                // If the player has the required item, set them as the group leader
                group.SetLeader(playerGuid);

                // Send a message to the group announcing the new leader
                const leaderName = player.GetName();
                group.SendGroupMessage(`${leaderName} is now the group leader.`);
            } else {
                // If the player doesn't have the required item, send them a message
                player.SendBroadcastMessage("You need a specific item to become the group leader.");
            }
        }
    } else {
        // If the player is not in a group, send them a message
        player.SendBroadcastMessage("You are not currently in a group.");
    }
};

// Register the event handler
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, OnLogin);
```

In this example, when a player logs in, the script checks if they are in a group. If they are in a group but not the current leader, it checks if the player has a specific item (you can replace the `requiredItem` variable with the desired item entry). If the player has the required item, they are set as the new group leader using the `SetLeader` method, and a message is sent to the group announcing the new leader. If the player doesn't have the required item, they receive a message indicating that they need a specific item to become the group leader. If the player is not in a group, they receive a message stating that they are not currently in a group.

This example demonstrates how the `SetLeader` method can be used in a practical scenario where a player needs to meet certain conditions (e.g., having a specific item) to become the group leader. It also showcases additional group-related functionality, such as checking the current leader, sending group messages, and handling cases where the player is not in a group.

## SetMembersGroup
Sets the subgroup for a member of the group based on their GUID. This is useful for organizing members within a group, such as setting up roles or class assignments.

### Parameters
* guid: number - The GUID of the group member to change subgroups
* groupID: number - The subgroup ID to assign the member to (0-7)

### Example Usage
```typescript
// Get the group of the player
const group = player.GetGroup();

// Only run if player is in a group
if (group) {
    // Set up an array of roles
    const roles = ["Tank", "Healer", "DPS", "DPS", "DPS"];

    // Loop through each member of the group
    group.GetMembers().forEach((member, index) => {
        // Get the player object of the member
        const memberPlayer = member.GetPlayer();

        // Assign the member to a subgroup based on their role
        if (memberPlayer) {
            if (memberPlayer.GetClass() === Classes.CLASS_WARRIOR || memberPlayer.GetClass() === Classes.CLASS_DRUID) {
                // Assign tanks to subgroup 0
                group.SetMembersGroup(member.GetGUID(), 0);
            } else if (memberPlayer.GetClass() === Classes.CLASS_PRIEST || memberPlayer.GetClass() === Classes.CLASS_PALADIN || memberPlayer.GetClass() === Classes.CLASS_SHAMAN) {
                // Assign healers to subgroup 1
                group.SetMembersGroup(member.GetGUID(), 1);
            } else {
                // Assign DPS to subgroups 2-4 based on the index
                group.SetMembersGroup(member.GetGUID(), index % 3 + 2);
            }
        }
    });

    // Send a message to the group leader about the subgroup assignments
    const leader = group.GetLeader();
    if (leader) {
        leader.SendBroadcastMessage("Group members have been assigned to subgroups based on their roles.");
    }
}
```

In this example, we first check if the player is in a group. If they are, we set up an array of roles (Tank, Healer, DPS) and loop through each member of the group. For each member, we get their player object and assign them to a subgroup based on their class. 

Tanks (Warriors and Druids) are assigned to subgroup 0, healers (Priests, Paladins, and Shamans) are assigned to subgroup 1, and DPS are assigned to subgroups 2-4 based on their index in the group.

Finally, we send a message to the group leader informing them that the subgroups have been assigned based on roles.

