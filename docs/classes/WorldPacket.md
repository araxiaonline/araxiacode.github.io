## GetOpcode

Retrieve the opcode of a `WorldPacket`. The opcode is an identifier for the type of message or action the packet is meant to represent in the communication between the server and client.

### Returns
opcode: number - The numerical identifier (opcode) of the `WorldPacket`

### Example Usage:

This script demonstrates how to log the opcode of a received packet to check its type. Useful for debugging or understanding the flow of data between the server and a player's client.

```typescript
// Handler function for when a packet is received from a player
const onPacketReceive: packet_receive_event_handler = (player: Player, packet: WorldPacket): void => {

    // Retrieve the opcode of the received packet
    const packetOpcode = packet.GetOpcode();
    
    // Log the opcode to the server console
    console.log(`Received packet with opcode: ${packetOpcode}`);
    
    // Example conditional to act on specific packet types
    // Replace 123 with an actual opcode for demonstrative purposes
    if(packetOpcode == 123) {
        console.log("This is a specific packet type of interest!");
        // Additional handling logic here
    }
}

// Register the packet receive handler for all players
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_PACKET_RECEIVE, (...args) => onPacketReceive(...args));
```

In this example, a packet receive event handling function `onPacketReceive` is defined, which logs the opcode of any packet received from players. A conditional check illustrates how you could filter for specific packet types using their opcodes. This is a foundational technique for developing more complex functionalities based on the data exchanged between the client and server.

## GetSize
This method returns the size of the [WorldPacket]. The size refers to the total amount of data contained within the packet, measured in bytes. In network communication, understanding the size of a packet is crucial for efficient data transmission and handling.

### Returns
size: number - The total size of the WorldPacket, in bytes.

### Example Usage:

In this example, let's see how one might use `GetSize` to validate if a received packet has the expected amount of data before processing it. This can be particularly helpful in ensuring data integrity and avoiding errors during packet parsing.

```typescript
// Packet handling event for demonstration
const HandleIncomingPacket: world_packet_on_receive = (event: number, player: Player, packet: WorldPacket): void => {
    const expectedPacketSize = 64; // hypothetical expected size for a specific packet (in bytes)

    // Obtain the actual size of the received packet
    const actualPacketSize = packet.GetSize();

    // Validate packet size
    if (actualPacketSize === expectedPacketSize) {
        console.log("Received packet has the expected size, proceeding with processing...");
        // Proceed with packet processing here
    } else {
        console.error(`Mismatched packet size. Expected: ${expectedPacketSize}, Received: ${actualPacketSize}. Discarding packet.`);
        // Handle the error appropriately (e.g., discard the packet, log error, etc.)
    }
}

// Register the packet event (hypothetical event registration method)
RegisterWorldPacketEvent(WorldPacketEvents.WORLD_PACKET_EVENT_ON_RECEIVE, (...args) => HandleIncomingPacket(...args));
```

In this example, whenever a WorldPacket is received, the `HandleIncomingPacket` function checks if the packet's actual size matches an expected size. This kind of check is vital for verifying the integrity of incoming data, ensuring that the packet has not been corrupted or tampered with during transmission. If the sizes match, the script proceeds with processing the packet. Otherwise, it logs an error and discards the packet, thus avoiding potential errors or vulnerabilities that might arise from processing an invalid or malicious packet.

## ReadByte
This method retrieves a signed 8-bit (1-byte) integer value from the current position within the [WorldPacket]. This can be particularly useful for reading data sent from the client to the server, such as action identifiers, options chosen in dialogs, or any other scenarios where small amounts of data are transmitted.

### Returns
- **value**: `number` - The signed 8-bit integer read from the packet.

### Example Usage:
The following script demonstrates how to use the `ReadByte` method within a packet handler for a hypothetical custom client-to-server communication. In this scenario, the packet is assumed to carry an action identifier indicating a specific request from the player, such as requesting to start a custom quest or triggering a special in-game event.

```typescript
// An example handler function for custom client-to-server packet
const HandleCustomActionPacket: packet_event_handler = (player: Player, packet: WorldPacket): void => {
    // Reading the action identifier from the packet
    const actionId = packet.ReadByte();
    
    switch (actionId) {
        case 1:
            // Initiating custom quest
            StartCustomQuestForPlayer(player);
            break;
        case 2:
            // Triggering a special event
            TriggerSpecialEventForPlayer(player);
            break;
        default:
            console.log(`Received unknown actionId: ${actionId} from player: ${player.GetName()}`);
            break;
    }
}

// Registering the packet handler for a hypothetical custom packet opcode
RegisterPacketHandler(PacketOpcodes.CUSTOM_ACTION_REQUEST, (...args) => HandleCustomActionPacket(...args));

// Function to start a custom quest for the player
function StartCustomQuestForPlayer(player: Player): void {
    // Custom logic to start a quest
    console.log(`Starting custom quest for player: ${player.GetName()}`);
}

// Function to trigger a special event for the player
function TriggerSpecialEventForPlayer(player: Player): void {
    // Custom logic for a special event
    console.log(`Triggering special event for player: ${player.GetName()}`);
}
```

In this example, the `ReadByte()` method permits the differentiation of various actions based on the `actionId` extracted from the packet. Different functionalities, like initiating a custom quest or triggering an event, can be selectively executed based on the value of `actionId` read from the `WorldPacket`.

## ReadDouble
This method extracts a double-precision floating-point value from the `[WorldPacket]`. It is crucial for operations that require precise numerical data, such as coordinate calculations or other mathematically intensive tasks.

### Returns
- **`number`**: The double-precision floating-point value read from the `[WorldPacket]`.

### Example Usage:
Below is a hypothetical scenario where the `ReadDouble` method is used within a script to teleport a player to a specific location upon a certain event. The coordinates (latitude and longitude) are stored as double-precision floating-point values within a world packet, which are then read and used to execute the teleport action.

```typescript
const TELEPORT_EVENT = 1; // This value would usually be a defined constant that triggers the teleport.

// The PlayerEvent enum represents hypothetical events that could trigger custom scripts.
enum PlayerEvents {
    PLAYER_EVENT_CUSTOM = TELEPORT_EVENT // Hypothetical custom event for demonstration.
}

// This player event listener is triggered by a custom event, such as picking up a specific item or entering a specific zone.
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_CUSTOM, (event: number, player: Player, packet: WorldPacket): void => {

    // Assume the packet format is structured with the latitude and longitude as consecutive double values.
    const latitude = packet.ReadDouble();
    const longitude = packet.ReadDouble();

    // Hypothetical TeleportTo method that takes the player and new coordinates to teleport the player.
    // It's assumed this method exists and is part of the Player class or a utility class.
    TeleportPlayerToCoordinates(player, latitude, longitude);

    // Output for demonstration purposes, showcasing the retrieved coordinates.
    console.log(`Teleporting player to Latitude: ${latitude}, Longitude: ${longitude}`);
});

// Hypothetical teleport function to handle the actual teleporting logic. Not part of AzerothCore or mod-eluna.
function TeleportPlayerToCoordinates(player: Player, lat: number, long: number) {
    // Implementation of the teleport.
    console.log(`Player ${player.GetName()} has been teleported to [Lat: ${lat}, Long: ${long}].`);
}
```
In this example, `ReadDouble` is used to extract precise coordinate data from a world packet that the player triggers through an event. The player is then teleported to the extracted coordinates. This method showcases a potential application of `ReadDouble` in handling accurate numerical data, crucial for gameplay mechanics requiring precision, such as player positioning and movement.

## ReadFloat

Extracts a single-precision floating-point value from the `WorldPacket`. This utility is primarily used when handling custom packet data where floating-point values are expected. Ensuring correct data interpretation is crucial for game logic that relies on numerical precision, such as positioning, speed calculations, and various game mechanic computations.

### Returns
`number` - The single-precision floating-point value read from the `WorldPacket`.

### Example Usage:

This example demonstrates a scenario where `ReadFloat` might be used in the context of handling a custom packet that updates a player's speed. The server expects this packet to contain a single floating-point value representing the new speed multiplier. On receiving this packet, the `ReadFloat` method is utilized to accurately parse the speed value from the packet's payload, which is then applied to the player.

```typescript
const SPEED_UPDATE_PACKET = 1234; // Assuming 1234 is the opcode for our custom speed update packet

function handleSpeedUpdatePacket(player: Player, packet: WorldPacket): void {
    // Extract the new speed multiplier from the packet
    const newSpeedMultiplier = packet.ReadFloat();
    
    // Validate and apply the new speed if it's within a reasonable range
    if(newSpeedMultiplier > 0 && newSpeedMultiplier <= 5) {
        player.SetSpeed(newSpeedMultiplier);
        console.log(`Updated player speed to ${newSpeedMultiplier}.`);
    } else {
        console.warn(`Received an out-of-range speed multiplier: ${newSpeedMultiplier}.`);
    }
}

RegisterPacketEvent(SPEED_UPDATE_PACKET, PacketEvent.ON_PACKET_RECEIVE, (player, packet) => handleSpeedUpdatePacket(player, packet));
```

In the scenario above, when the server receives our custom speed update packet (identified by its opcode `1234`), the `handleSpeedUpdatePacket` function is invoked with the player object and the packet as arguments. The speed multiplier is then read from the packet using `ReadFloat()`, checked to ensure it's within a valid range (to prevent abnormal game behaviour), and applied to the player if valid. This demonstrates the practical use of `ReadFloat` in interpreting custom packet payloads.

## ReadGUID
Retrieves an unsigned 64-bit integer value representing a Globally Unique Identifier (GUID) from the WorldPacket. This function is essential when working with entities in AzerothCore, as GUIDs uniquely identify entities such as players, NPCs, items, etc. Understanding and properly using GUIDs is crucial for modifying or interacting with the game world and its inhabitants.

### Returns
`number` - The 64-bit integer value read from the WorldPacket, representing a GUID.

### Example Usage:
Suppose you are creating a custom event where you need to track the player interacting with an NPC based on the GUID of the NPC. You could use the `ReadGUID` method from a packet received by the server to determine which NPC the player interacted with. Here's a simplified example demonstrating this usage:

```typescript
const NPC_INTERACTION_GUID = 123456789; // Example GUID of the NPC of interest

const OnNPCInteract: player_event_on_receive_packet = (event: number, player: Player, packet: WorldPacket) => {
    // Assuming the packet has already been identified as an NPC interaction packet
    const npcGUID = packet.ReadGUID();

    if (npcGUID === NPC_INTERACTION_GUID) {
        // Logic to handle the specific interaction with the NPC
        console.log(`Player ${player.GetName()} interacted with the special NPC.`);
        // Further actions like rewarding the player or starting a quest could be placed here
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_RECEIVE_PACKET, (...args) => OnNPCInteract(...args));
```

In the example, an event listener is set up to respond to packets received by the player, checking if the packet contains an interaction with a predefined NPC by comparing the GUID retrieved from the packet to a known NPC GUID. Adjustments to the packet identification and event hook might be necessary based on the specifics of the implemented feature and how packets are structured in AzerothCore.

## ReadLong
Extracts a signed 32-bit integer value from the `WorldPacket`. This is useful for reading data from client packets sent to the server, ensuring that developers can parse and manipulate data as needed for their module's functionality.

### Returns
number: The signed 32-bit integer that was read from the `[WorldPacket]`.

### Example Usage:
In this example, the `ReadLong` method is used within a hypothetical player movement event. When a player moves, the server receives a packet containing, among other things, the player's new zone ID, which is a 32-bit integer. The script extracts this zone ID from the packet using `ReadLong` and logs it or conducts further processing such as custom zone-based actions or checks.

```typescript
const PLAYER_EVENT_ON_MOVE: number = 1; // Example event constant, replace with actual.

const HandlePlayerMove: (packet: WorldPacket, player: Player) => void = (packet, player) => {
    // Assuming the packet structure has the zone ID at the current read position
    const newZoneID: number = packet.ReadLong(); 
    
    // Logging or processing the new zone ID
    console.log(`Player ${player.GetName()} moved to zone ID: ${newZoneID}`);
    // Further processing can be done here, e.g., checking for special conditions in the new zone.
}

RegisterPlayerEvent(PLAYER_EVENT_ON_MOVE, (event: number, player: Player, packet: WorldPacket): void => {
    HandlePlayerMove(packet, player);
});
```
In this script, `HandlePlayerMove` is a callback function triggered by a hypothetical player movement event. It uses the `ReadLong` method to extract a 32-bit signed integer from the `WorldPacket` -- in this case, representing a zone ID. After reading the value, the script logs the player's name and their new zone ID, showcasing a foundational use of packet reading for more complex logic and game modifications.

## ReadShort
Reads a signed 16-bit integer value from the `WorldPacket`. This method is typically used for reading data sent from the server or a client in a structured format. This can be useful in various scenarios where packet manipulation is necessary, such as debugging, creating custom behaviors, or handling specific game events.

### Returns
number - The 16-bit integer value read from the `WorldPacket`.

### Example Usage:
Below is an example where `ReadShort` is used in an event handler to read a value from a packet sent by the game server when a player interacts with a game object. It then prints the value to the server console, allowing for debug or further processing based on the value read.
```typescript
// Defines a game event for when a player interacts with a game object.
const onGameObjectUse: gameobject_event_on_use = (event: number, player: Player, gameObject: GameObject, packet: WorldPacket): void => {
    // Read a 16-bit value from the packet.
    const actionId = packet.ReadShort();
    
    // Log the action ID to the server console for debugging.
    console.log(`Player ${player.GetName()} interacted with ${gameObject.GetGUID()} using action ID: ${actionId}`);
    
    // Example conditional action based on the read value
    if (actionId === someSpecificActionId) {
        // Perform some custom behavior based on the action ID
        console.log('Performing a custom behavior for action ID:', someSpecificActionId);
        // You can further interact with the player or game object here based on the action ID
    }
}

// Register the event with the game event handler for when a game object is used by a player.
RegisterGameObjectEvent(GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (...args) => onGameObjectUse(...args));
```
In this example, when a player interacts with a game object, the function `onGameObjectUse` is invoked. It uses `ReadShort` to extract a 16-bit integer from the packet associated with the event, representing an action ID in this hypothetical scenario. The action ID is then logged for debugging purposes. Additionally, a simple conditional check is shown, illustrating how one might trigger specific behaviors based on the value read from the packet.

## ReadString

Reads and extracts a string value from the `[WorldPacket]`. This is used to retrieve string data transmitted within a packet.

### Returns
- `string` - The string value extracted from the `[WorldPacket]`.

### Example Usage:
The following script demonstrates how to read a string from a WorldPacket within a chat message event. It listens for a specific command from the player and processes the command accordingly.

```typescript
const COMMAND_PREFIX = "!exampleCommand ";

// Register an event handler for player chat
const onPlayerChat: player_event_on_chat = (event: number, player: Player, msg: string, lang: number, newMsg: WorldPacket): void => {
    // Check if the message starts with the command prefix
    if (msg.startsWith(COMMAND_PREFIX)) {
        // Extract the command arguments from the message
        const argsString = msg.substr(COMMAND_PREFIX.length);
        // Create a new WorldPacket for demonstration purposes (normally, the packet would come from the chat event or other sources)
        let packet = new WorldPacket(); // Note: This is just an example. In actual usage, packets are received, not created.
        packet.WriteString(argsString); // Write the extracted arguments string into the packet
        let readBackArgs = packet.ReadString(); // Read the string back from the packet
        
        // Process the command with the read-back arguments
        processCommand(player, readBackArgs);
    }
}

// A function to process the command - details depend on the command's purpose
function processCommand(player: Player, commandArgs: string) {
    player.SendBroadcastMessage(`Processing command with arguments: ${commandArgs}`);
}

// Register the chat event handler
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, (...args) => onPlayerChat(...args));
```

In this example, when a player types a chat message starting with `"!exampleCommand "`, the script reads the rest of the message as command arguments. It simulates adding these arguments to a `WorldPacket` and then reading them back to demonstrate the use of `ReadString()`. This is a simplified example to illustrate the packet read operation and does not detail how `WorldPacket` instances are typically obtained in actual event handlers.


## ReadUByte
This method reads the next unsigned 8-bit integer from the data stream of a [WorldPacket] and returns it. This is particularly useful when scripting custom packets for data transmission between the server and the client in AzerothCore. Understanding packet structure is crucial when utilizing this method.

### Returns
**number** - The unsigned 8-bit integer read from the [WorldPacket].

### Example Usage
This example illustrates a custom server command that sends a packet to the client, which then reads an unsigned 8-bit integer value (for example, a player's action or state code) from the packet and performs an action based on the value received.

**Server Side Script**: (Sends a custom packet with an action code to the client)

```typescript
import { WorldSession, WorldPacket } from 'azerothcore-eluna';

// Custom Opcode Identifier for our packet (make sure this doesn't clash with existing opcodes)
const CUSTOM_OPCODE: number = 12345;

// Function to send a custom packet to a player
function SendCustomPacketToClient(session: WorldSession, actionCode: number): void {
    let packet = new WorldPacket(CUSTOM_OPCODE, 1); // Opcode and size of the payload
    packet.WriteUByte(actionCode); // Write our action code as an unsigned 8-bit integer
    session.SendPacket(packet); // Send the packet to the client
}

RegisterPlayerCommand('sendcustom', (player, args): void => {
    const actionCode = parseInt(args[0]) || 0; // Parse the action code from the command argument
    SendCustomPacketToClient(player.GetSession(), actionCode);
    player.SendBroadcastMessage(`Sending custom packet with action code: ${actionCode}`);
});
```

**Client Side Script**: (Reads the custom packet and the action code sent by the server)

```typescript
import { WorldPacket } from 'azerothcore-eluna';

// Function to handle our custom packet
function HandleCustomPacket(packet: WorldPacket): void {
    const actionCode = packet.ReadUByte(); // Read the action code as an unsigned 8-bit integer
    console.log(`Received custom packet with action code: ${actionCode}`);
    // Perform an action based on the action code...
}

// Register a packet event handler for our custom opcode
RegisterPacketEvent(CUSTOM_OPCODE, (...args) => HandleCustomPacket(...args));
```

In this example, the `SendCustomPacketToClient` function creates a new `WorldPacket` with a custom opcode and an action code. The action code is written as an unsigned 8-bit integer to the packet. The packet is then sent to the client's session. On the client side, when a packet with the corresponding custom opcode is received, the `HandleCustomPacket` function reads the action code using the `ReadUByte` method and takes actions based on the value retrieved.

## ReadULong
Reads an unsigned 32-bit integer value from the `[WorldPacket]`. This method is primarily used when handling packet data received from the client or server where an unsigned long value is expected.

### Returns
`number` - The unsigned 32-bit integer read from the packet.

### Example Usage:  
In this script, we are handling a hypothetical custom packet from a client that sends an item entry identifier as an unsigned long. Upon receiving the packet, the server reads the item entry from it and grants the item to the player if it exists in the item database.

```typescript
// Assuming a custom packet with an opcode of CUSTOM_OP_CODE is sent by the client
// The packet contains an unsigned long representing an item entry ID

const CUSTOM_OP_CODE = 999; // Hypothetical opcode for custom client packet

// Event handler function for the packet
const HandleCustomItemPacket: worldpacket_event_handler = (packet: WorldPacket, player: Player): void => {
    
    // Read the item entry ID from the packet
    const itemEntryId = packet.ReadULong();
    
    // Log for debug purposes
    console.log(`Received custom packet from player ${player.GetName()}. Item Entry ID: ${itemEntryId}`);
    
    // Try to add the item to the player's inventory
    // Assuming AddItem does not add the item if it doesn't exist or other constraints are not met
    const itemAdded = player.AddItem(itemEntryId, 1);
    
    if(itemAdded) {
        console.log(`Item with entry ID ${itemEntryId} was added successfully to ${player.GetName()}'s inventory.`);
    } else {
        console.log(`Failed to add item with entry ID ${itemEntryId} to ${player.GetName()}'s inventory.`);
    }
};

// Register the event handler for the custom opcode
RegisterWorldPacketEvent(CUSTOM_OP_CODE, (...args) => HandleCustomItemPacket(...args));
```

In this example, the `ReadULong` method is critical for interpreting the packet data sent by the client. By extracting the item entry ID correctly, the server can process the player's request to add a specific item to their inventory. The script demonstrates how to work with packet data, validate it, and take actions accordingly within the AzerothCore framework using the mod-eluna API.

## ReadUShort
Reads and returns an unsigned 16-bit integer value from the [WorldPacket]. This method is crucial for packet handling, allowing developers to parse specific data from the game client or server packets accurately. 

### Returns
- **number** - The 16-bit unsigned integer read from the WorldPacket.

### Example Usage:
The following example demonstrates how to use `ReadUShort` within an event handler for custom packet processing. This example assumes a hypothetical scenario where the server reads a packet that contains an action identifier followed by an entity ID. Both values are 16-bit unsigned integers. The event handler extracts these two values from the packet and logs them for further processing.

```typescript
// Example Packet Structure:
// [ActionID: 16-bit] [EntityID: 16-bit]

const ACTION_ENTITY_EVENT = 255; // Custom event ID for illustration.

const HandleCustomPacket: world_packet_event_handler = (event: number, player: Player, packet: WorldPacket): void => {
    // Assuming the packet structure is known and it begins with an action identifier followed by an entity ID.

    const actionId = packet.ReadUShort(); // Read the action identifier.
    const entityId = packet.ReadUShort(); // Read the entity ID next.

    // Log or handle the action and entity ID as needed.
    console.log(`Received custom packet - Action ID: ${actionId}, Entity ID: ${entityId}`);

    // Further processing can be done based on actionId and entityId.
};

RegisterWorldPacketEvent(ACTION_ENTITY_EVENT, Packets.SERVER_PACKET, (...args) => HandleCustomPacket(...args));
```

In this example, `ReadUShort` is used twice consecutively to read two 16-bit integer values from the `WorldPacket`. The first call reads the action identifier, and the second call reads the entity ID. These values can then be processed according to the game logic, such as triggering certain in-game actions or validating entity states.

The use of `ReadUShort` is essential in custom packet handling, enabling mod developers to interact with complex data sent between the client and server. This method provides a way to accurately parse and utilize packet data within the AzerothCore framework for creating engaging and dynamic game experiences.

## SetOpcode

This method assigns a specific opcode to the `WorldPacket`. Opcodes are essentially identifiers that specify the type of action or message being communicated between the client and the server in World of Warcraft. Accurate assignment of opcodes is crucial for the correct handling of packets.

### Parameters
* `opcode`: number - The opcode identifier to be set for the `WorldPacket`.

### Example Usage:

In this example, we're creating a simple callback that is triggered when a player logs in. We send a custom welcome message packet to the player. To do so, we create a new `WorldPacket` and set its opcode to a hypothetical `SMSG_WELCOME_MESSAGE` (a made-up opcode for demonstration purposes), then proceed to write the message into the packet and finally send it to the player.

Assuming `SMSG_WELCOME_MESSAGE` has an opcode value of `12345`, and a fictional `SendPacket` function that sends the packet to the player.

```typescript
const WELCOME_OPCODE = 12345; // Hypothetical opcode for a welcome message
const WELCOME_MESSAGE = "Welcome to our custom World of Warcraft server!";

const onPlayerLogin: player_event_on_login = (event: number, player: Player): void => {
    // Create a new WorldPacket object
    let packet = new WorldPacket();

    // Set the packet's opcode to our custom welcome message opcode
    packet.SetOpcode(WELCOME_OPCODE);
    
    // (Hypothetical) Writing the welcome message into the packet
    // This part largely depends on how the server expects the data to be formatted
    // packet.WriteString(WELCOME_MESSAGE);

    // (Hypothetical) Function to send the packet to the player
    // This is also server-specific and might require the player's GUID or similar identifier
    // SendPacket(player, packet);

    // Log to server console
    console.log("Sent welcome message to player: " + player.GetName());
}

// Register the login event callback
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => onPlayerLogin(...args));
```
Note: The usage of `WriteString` and `SendPacket` functions in this example are hypothetical and serve to illustrate the concept. Actual implementations may vary based on the server's packet handling and API provided by AzerothCore and mod-eluna.

# WriteByte

This method appends a signed 8-bit integer value to the `WorldPacket`. This is essential when constructing custom packets to communicate various types of information within the AzerothCore server framework, especially when dealing with mod-eluna scripts that modify or extend default game functionality. The `WriteByte` method is critical in ensuring data is correctly packaged in the protocol's expected format.

### Parameters
- `value`: number - The signed 8-bit integer value to append to the WorldPacket.

### Example Usage:
In this example, we're sending a custom packet to the player to trigger a unique UI element or game behavior not covered by the default Eluna API. Assume in this fictional scenario, the custom packet with an opcode of `123` is handled client-side to show a special UI component that is not part of the typical game interface.

```typescript
// Opcode for our custom UI display packet
const CUSTOM_UI_DISPLAY_OPCODE = 123;
// The specific value that triggers our unique UI behavior
const UNIQUE_UI_TRIGGER = -57;

// Function to create the packet and send it to the player
function sendUniqueUIDisplay(player: Player): void {
    let packet: WorldPacket = new WorldPacket(CUSTOM_UI_DISPLAY_OPCODE, 1); // 1 byte for our signed integer
    packet.WriteByte(UNIQUE_UI_TRIGGER); // Appends our trigger value to the packet

    player.SendPacket(packet); // Send the packet to the player
}

// Example on how to use sendUniqueUIDisplay
// This could be called from some event, like when a player enters a specific area or triggers a custom event
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_ZONE_CHANGE, (player: Player) => {
    // Assuming some condition is met that requires showing the unique UI
    sendUniqueUIDisplay(player);
});
```
This script utilizes the `WriteByte` method to append a signed 8-bit integer to a custom packet. It demonstrates creating a packet, appending data, and sending it to a player. Custom packets like this can be used to extend gameplay in ways not initially provided by the AzerothCore platform, showing the flexibility of mod-eluna scripts when used creatively.

## WriteDouble

Writes a 64-bit floating-point value to the [WorldPacket]. This method is useful when you need to transmit numerical data that requires high precision, such as coordinates or mathematical calculations, over the network.

### Parameters
* `value`: number - A 64-bit floating-point number to write to the packet.

### Example Usage:
Consider an example where you need to send a precise location of an event happening in the game world, such as the exact position where a special item should appear. 

```typescript
const EVENT_ITEM_SPAWN_ID = 40000; // Example item ID for a special event item
const EVENT_SPAWN_LOCATION_X = 1234.5678; // Precise X coordinate for the spawn location
const EVENT_SPAWN_LOCATION_Y = 9101.1121; // Precise Y coordinate for the spawn location
const EVENT_SPAWN_LOCATION_Z = 3141.5926; // Precise Z coordinate for the spawn location

/**
 * A simple script to create a world event packet that defines where the special item should spawn.
 * @param eventID Unique identifier for the custom event
 */
function createSpecialEventSpawnPacket(eventID: number): WorldPacket {
    let packet = new WorldPacket(); // Assume WorldPacket is a constructible entity for example purposes

    packet.WriteUInt32(eventID); // Write the event ID as an unsigned int
    packet.WriteDouble(EVENT_SPAWN_LOCATION_X); // Write the X coordinate as a double
    packet.WriteDouble(EVENT_SPAWN_LOCATION_Y); // Write the Y coordinate as a double
    packet.WriteDouble(EVENT_SPAWN_LOCATION_Z); // Write the Z coordinate as a double

    return packet;
}

/**
 * A demonstration of how you might register and handle a custom event that makes use of the packet.
 */
function onSpecialEvent(): void {
    let spawnPacket = createSpecialEventSpawnPacket(EVENT_ITEM_SPAWN_ID);
    // SendPacket() is a hypothetical function demonstrating packet sending
    SendPacket(spawnPacket); 
}

// Hypothetical event registration, assuming an event system that can handle custom-defined events
RegisterCustomEvent("SpecialItemSpawnEvent", () => onSpecialEvent());
```

In this example, `createSpecialEventSpawnPacket` is a function that prepares a `WorldPacket` for broadcasting the spawn location of a special item during a world event. The location's precision is crucial for gameplay, hence the use of `WriteDouble` to ensure the coordinates are transmitted accurately. 

This demonstrations an efficient use of the `WriteDouble` method, as part of an event that enhances the game world's dynamism and player engagement by precisely controlling the environment.

## WriteFloat

This method is utilized to write a 32-bit floating-point value to a [WorldPacket](./worldpacket.md), facilitating the communication of numeric data particularly useful for transmitting movement data, attributes, or any scenario where precision decimal values are required in packet transmission within the AzerothCore environment.

### Parameters 
* value: number - The 32-bit floating-point value to be written into the [WorldPacket].

### Example Usage:
In this example, we demonstrate how to create a custom movement packet for a player. This could be part of a larger module designed to manipulate player movements or to apply custom effects that require precise location adjustments. 

```typescript
import { PlayerEvents, WorldPacket, Opcode } from 'azerothcore';

const onPlayerJump: player_event_on_jump = (player: Player): void => {
    // Creating a new WorldPacket with an opcode for movement (This is a made-up opcode for demonstration)
    const movementPacket = new WorldPacket(Opcode.SMSG_PLAYER_CUSTOM_MOVEMENT);

    // Example coordinates
    const jumpHeight = 1.5; // Arbitrary jump height increase

    // WriteFloat can be used to encode precise movement details
    // Here, we're assuming a fictional method to encode the player's current x, y, z coordinates
    // and append a jump height to influence in-game behavior
    movementPacket.WriteFloat(player.GetPositionX());
    movementPacket.WriteFloat(player.GetPositionY());
    movementPacket.WriteFloat(player.GetPositionZ() + jumpHeight);

    // Sending the customized packet back to the player, applying the effect
    player.SendDirectMessage(movementPacket);
}

// Register the event listener for player jump actions
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_JUMP, (...args) => onPlayerJump(...args));
```
This script intercepts the player's jump action, creating a custom `WorldPacket` that alters the player's movement by artificially increasing the jump height. It demonstrates the use of `WriteFloat` to encode this change within the packet before it's dispatched back to the player, showcasing the versatility and precision of floating-point data in packet manipulation.

## WriteGUID
This method allows for writing an unsigned 64-bit integer value to a `WorldPacket`. This is particularly useful for network communication where you might need to send GUIDs (Globally Unique Identifiers) of entities or objects across the network. 

### Parameters <hr />
* value: number - The unsigned 64-bit integer value to write into the WorldPacket.

### Example Usage:  
In this example, we send a packet to update a player's pet GUID. This might be part of a larger function where a player gets a new pet, and the server needs to notify the client about the change.  

```typescript
// Assuming there's a function to update player's pet, which requires sending the new pet's GUID to the player's client.
function updatePlayerPet(player: Player, petGUID: number): void {
    // Create a new WorldPacket. Assuming OPCODE_UPDATE_PET_GUID exists and is correct for this hypothetical scenario.
    let packet = new WorldPacket(OPCODE_UPDATE_PET_GUID); 

    // Write the pet's GUID into the packet.
    packet.WriteGUID(petGUID); 

    // Send the packet to the player.
    player.SendPacket(packet);
}

// Example usage within an event when a player acquires a new pet.
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_NEW_PET, (player: Player, petGUID: number) => {
    updatePlayerPet(player, petGUID);
});
```
In this scenario, it's assumed that `OPCODE_UPDATE_PET_GUID` is an existing operation code in the system that handles updating a player's pet GUID. The `WorldPacket` class is used to package the data (in this case, the new pet's GUID), which is then sent to the client using the player's `SendPacket` method. This is a crucial part of handling server-client communication in an MMO framework like AzerothCore with mod-Eluna.

Remember to always consider the underlying data structure and requirements of the packets you are working with. The GUID should fit within an unsigned 64-bit integer range, and appropriate checks should be made to ensure data integrity and security.

## WriteLong
Writes a signed 32-bit integer (`int32`) value to the `WorldPacket`. This method is primarily used in packet creation, where you need to append various data types to your packet before sending it over the network. The `WorldPacket` class is a fundamental part of message handling and network communication within the AzerothCore framework.

### Parameters <hr />
`value`: number - The 32-bit signed integer to append to the packet.

### Example Usage:  
This example demonstrates how to create a custom packet that sends a simple message containing a numeric value to the player. This hypothetical packet could inform the client about a specific state change that involves an integer value, such as a countdown timer, a score, or currency adjustment.
  
```typescript
// Example: Sending a custom packet with a countdown timer value
const MY_CUSTOM_OPCODE: number = 123; // Hypothetical custom opcode
const COUNTDOWN_VALUE: number = 10; // Example countdown value

const SendCountdownPacket: player_event_on_login = (event: number, player: Player): void => {
    // Create a new WorldPacket object with our custom opcode
    let packet = new WorldPacket(MY_CUSTOM_OPCODE);
  
    // Write our countdown value to the packet
    packet.WriteLong(COUNTDOWN_VALUE);
  
    // Send the packet to the player
    player.SendPacket(packet);
}

// Register our login event to send the packet when a player logs in
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => SendCountdownPacket(...args));
```

In this script, we create a new `WorldPacket` with a hypothetical opcode `123` and use the `WriteLong` method to append a numeric value (`COUNTDOWN_VALUE`) to it. Finally, we send this packet to the player upon login by registering the script to the `PLAYER_EVENT_ON_LOGIN` event. This is a simple example to demonstrate packet creation and handling; in a real-world scenario, opcodes and implementations may vary.

# WriteShort

This method is used to write a signed 16-bit integer (short) into a `WorldPacket`. In World of Warcraft's client-server communication, packets are used to send and receive data. Using `WriteShort`, developers can ensure that the data being sent conforms to the expected 16-bit signed integer format, crucial for various gameplay features.

### Parameters
- **value**: number - The 16-bit signed integer you want to write into the packet.

### Example Usage

Below is an example demonstrating how to use the `WriteShort` method to modify a `WorldPacket` by writing a player's health difference after taking damage. This could be part of a larger system where custom spell effects or damage calculations are implemented.

```typescript
const SPELL_DAMAGE_EVENT: player_event_on_spell_hit = (event: number, caster: Player, target: Unit, spell: Spell) => {
    const spellDamage = 120; // Example spell damage value
    const targetHealthBefore = target.GetHealth();
    target.DealDamage(spellDamage);
    const targetHealthAfter = target.GetHealth();
    const healthDifference = targetHealthBefore - targetHealthAfter;

    // Create a new WorldPacket
    let damagePacket = new WorldPacket();
    
    // Assuming -32768 <= healthDifference <= 32767 since WriteShort handles signed 16-bit
    damagePacket.WriteShort(healthDifference);

    // Further packet preparation and sending logic goes here
    // For demonstration purposes only
    console.log(`Damage packet prepared with health difference: ${healthDifference}`);
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SPELL_HIT, (...args) => SPELL_DAMAGE_EVENT(...args));
```

In this example, when a player hits a target with a spell, the system calculates the damage, modifies the target's health accordingly, and captures the health change. This health difference is then written into a `WorldPacket` using `WriteShort`. This packet could then be sent to the client or used in further server-side logic to, for example, display custom damage numbers, trigger specific effects based on the damage done, or log the event for analytics purposes. This demonstrates the creation and initial manipulation of packets, which is foundational for advanced gameplay mechanics and custom interactions in mods for Azerothcore utilizing Eluna.

## WriteString
This method is used to write a string to a [WorldPacket], which is a core component for handling data packets in AzerothCore's network communication. [WorldPacket](https://www.azerothcore.org/) is essentially a buffer that contains data to be sent between the server and the client. The `WriteString` function allows for dynamically adding text data to the packet, adhering to the protocol's formatting requirements.

### Parameters
- `value`: string - The string to be written into the [WorldPacket].

### Example Usage:
The following script exemplifies how to create a custom server message that can be sent to a player. This message contains dynamic content, in this case, a player's name, that is fetched at runtime and inserted into the WorldPacket before being sent.

```typescript
// Import necessary modules from Eluna/AzerothCore scripting environment
import { WorldPacket, Player } from "azerothcore-eluna";

// Custom function to send a welcome message to a player
function sendWelcomeMessage(player: Player): void {
    // Define Server opcode for downstream messages (example opcode, actual opcodes differ)
    const SERVER_MESSAGE_OPCODE = 123;

    // Create a new WorldPacket with the defined opcode
    let packet = new WorldPacket(SERVER_MESSAGE_OPCODE);
  
    // Constructing the welcome message with dynamic player's name
    const welcomeMessage = `Welcome to Azeroth, ${player.GetName()}! We're glad you're here.`;
  
    // Writing constructed message string to packet
    packet.WriteString(welcomeMessage);

    // Sending packet directly to the player
    player.SendPacket(packet);

    console.log(`Sent welcome message to ${player.GetName()}`);
}

// Example of registering the function to be called upon player login
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (player) => {
    sendWelcomeMessage(player);
});
```
This script dynamically constructs a welcome message including the player's name by fetching it at runtime with `player.GetName()`, writes the message into the `WorldPacket` using the `WriteString` method, and finally sends this packet to the player, effectively displaying the message to them in-game. This method of packet handling is crucial for custom server-client interactions within mods built for AzerothCore using mod-eluna.

## WriteUByte
Writes an unsigned 8-bit integer value to the [WorldPacket]. This is essential for constructing packets for custom commands or responses in a mod.

### Parameters  
- `value`: number - The value to write as an unsigned 8-bit integer. Must be between 0 and 255.

### Example Usage
In this example, we create a simple custom packet to change the player's speed. This example showcases how to use the `WriteUByte` method to add an identifier byte and then how to use other hypothetical methods like `WriteFloat` to add a floating-point value for the speed.

```typescript
const SPEED_CHANGE_IDENTIFIER = 0xA1; // Custom identifier for our speed change packet
const NEW_SPEED = 1.5; // The new speed value

const onChangePlayerSpeed: player_event = (player: Player): void => {
    let packet = new WorldPacket(); // Assuming WorldPacket is a creatable instance here

    packet.WriteUByte(SPEED_CHANGE_IDENTIFIER); // Writes our custom packet identifier
    packet.WriteFloat(NEW_SPEED); // Hypothetical method to write a float value for the new speed

    player.SendPacket(packet); // Hypothetical method to send the packet to the player, affecting the player's speed

    console.log("Speed change packet sent to player."); // Logging for debug purposes
}

// Register our custom event (hypothetical) that calls our function to change player speed
// Assuming there's a mechanism in place to trigger this event
RegisterPlayerEvent(PlayerEvents.CUSTOM_EVENT_SPEED_CHANGE, (...args) => onChangePlayerSpeed(...args));
```

In this script, we use a fabricated scenario where a custom packet identified by `SPEED_CHANGE_IDENTIFIER` is sent to the player, requesting their client to change speed to a specified value. The `WriteUByte` method is crucial for specifying the packet type, allowing the client to correctly interpret and process the following data, which in this case is the new speed value written by a hypothetical `WriteFloat` method. 

This example aims to illustrate the use of `WriteUByte` in a packet construction context, showing how such low-level operations are foundational in custom mod development for AzerothCore using the Eluna engine.


## WriteULong
Writes an unsigned 32-bit integer value to the WorldPacket, which is used to send data between the server and the client. This allows developers to customize data packets for various features and functionality within the Azerothcore mod.

### Parameters
- **value**: `number` - The unsigned 32-bit integer value to write into the WorldPacket.

### Example Usage
In this example, we will create a simple feature that allows sending a custom server message to a player indicating their current health percentage rounded to the nearest whole number. This showcases the use of `WriteULong` to send packet data.

First, we define the packet structure and the message opcode, assuming `CUSTOM_OPCODE` is predefined in your mod environment:

```typescript
const CUSTOM_OPCODE = 123; // Example opcode, replace with actual opcode
```

Next, we create a function that constructs and sends the custom packet to the player:

```typescript
function SendHealthStatus(player: Player): void {
    const playerHealth = player.GetHealthPct(); // Gets the player's current health percentage
    const healthMessage = `Your current health is around ${Math.round(playerHealth)}%. Stay safe!`;

    const packet = new WorldPacket(); // Create a new WorldPacket instance
    packet.WriteULong(CUSTOM_OPCODE); // Write the custom message opcode

    /*
        Assuming that the custom opcode requires the message length followed by the message itself,
        and considering an additional hypothetical WriteString method for simplicity.
    */
    packet.WriteULong(healthMessage.length); // Write the length of the message
    packet.WriteString(healthMessage); // Hypothetically write the message string

    player.SendPacket(packet); // Send the custom packet to the player
}

// Registering an event for demonstration, such as player login
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (event: number, player: Player) => {
    SendHealthStatus(player); // Send the health status message upon player login
});
```
In the above code, `WorldPacket` is used to create a custom data packet that includes a message opcode and the message contents tailored for the player. The `WriteULong` method is specifically used to write both the message opcode and its length as unsigned 32-bit integers, following a simplified and hypothetical structure of how packets might be constructed in a mod for Azerothcore.

This example illustrates a potential use case for `WriteULong`, enabling mod developers to craft custom interactions and communications within the game. Remember, the actual implementation and requirements may vary based on the specifics of your mod and Azerothcore's current capabilities.

# WriteUShort

This method allows for writing an unsigned 16-bit integer (also known as ushort) value to a `[WorldPacket]`. Coding for network communication or data packet manipulation often requires handling data in specific, compact formats. This method is particularly used when dealing with packet creation or editing in the context of server-client data exchanges in Azerothcore's mod-eluna scripting.

### Parameters

- `value`: number - The unsigned 16-bit integer to write to the packet.

### Example Usage:

Below is a scripted example demonstrating how to use `WriteUShort` to create a custom packet that sends a specific two-byte data structure—perhaps an action code or a smaller data set like an item's quantity. This custom packet could be part of a larger system, such as updating the UI or triggering specific client-side effects not typically exposed through the standard Eluna API.

```typescript
function SendCustomPacket(player: Player, actionCode: number): void {
    const OPCODE: number = 123; // Example opcode for the custom packet
    let packet = new WorldPacket(); // Assuming WorldPacket constructor is accessible and not simplified for illustration
    
    packet.SetOpcode(OPCODE); // Method to set the packet's operation code - not defined but assumed for demonstration
    packet.WriteUShort(actionCode); // Writing our hypothetical action code as an unsigned short to the packet
    
    // Additional packet construction here...
    // For instance, adding a string or another integer based on the packet's intended structure and use case
    
    player.SendPacket(packet); // Sending the custom packet to the player
    console.log(`Sent custom packet with action code ${actionCode} to ${player.GetName()}.`);
}

// Registering a hypothetical player event to trigger our custom packet as a demonstration
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (player: Player) => {
    const WELCOME_ACTION_CODE: number = 256; // Example action code for welcoming the player
    
    SendCustomPacket(player, WELCOME_ACTION_CODE);
});
```

In this hypothetical example, assume that sending this custom packet triggers a specific behavior on the client-side, represented by the `actionCode`. The `SendCustomPacket` function encapsulates the creation and dispatch of the packet, leveraging the `WriteUShort` method to insert the action code into the packet's payload. The script showcases a potential use case within the mod-eluna framework for enhancing interactive gameplay elements or extending the client-server communication beyond the available API functions in Azerothcore.

