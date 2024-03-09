## AddPassenger
This method mounts a [Unit](./unit.md) as a passenger on a specific seat in a [Vehicle](./vehicle.md), enhancing gameplay by allowing dynamic passenger management in scripted events or custom transportation solutions.

### Parameters
- passenger: [Unit](./unit.md) - The unit to be added as a passenger.
- seat: number - The seat index on which the unit will be seated. Seat indices start from 0.

### Example Usage:
Scenario where a script adds a guardian pet as a passenger to a player's mount to simulate a pet riding along.

```typescript
const PET_SEAT_INDEX = 1; // Assuming the seat index for a pet is 1.

const onPlayerSummonPet: player_event_on_summon_pet = (event: number, player: Player, pet: Unit): void => {
    const playerMount = player.GetVehicle();
    if (playerMount) {
        playerMount.AddPassenger(pet, PET_SEAT_INDEX);
    }
}

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_SUMMON_PET, (...args) => onPlayerSummonPet(...args));
```

This script leverages the `AddPassenger` method to place a newly summoned pet into a defined seat (in this case, `PET_SEAT_INDEX`) on the player's current vehicle (mount), providing immersion and visual coherence in scenarios where players are mounted and have pets.

By utilizing the `AddPassenger` method within player or creature scripts, mod developers can craft unique and engaging experiences that promote a more interactive and visually rich game environment. Whether it is to simulate a caravan of warriors or to script a complex boss fight mechanic where adds join the combat dynamically as "passengers" of a vehicle, the possibilities are vast and allow for creative implementations of vehicle and passenger mechanics in Azerothcore's mod-eluna.

## GetEntry
Retrieves the entry ID of the vehicle. This entry ID can be used to reference specific vehicles within the World Database. Understanding vehicle entries is crucial for scripting events or interactions specific to certain vehicles in the game world.

### Returns
entry: number - The Vehicle Entry Id that corresponds to the vehicle_template table in the World Database. 

### Example Usage:  
This script is designed to trigger a custom interaction when a player interacts with a specific vehicle by checking its entry ID.

```typescript
const VEHICLE_ENTRY_OF_INTEREST = 12345; // Example vehicle entry ID
const CUSTOM_INTERACTION: vehicle_event_on_interact = (event: number, vehicle: Vehicle, player: Player): void => {

    if(vehicle.GetEntry() === VEHICLE_ENTRY_OF_INTEREST) {
        // Trigger custom interaction or event related to the vehicle
        // This can be anything from starting a quest, triggering an NPC dialogue, or any custom server mechanic
        player.SendBroadcastMessage("You have triggered a custom interaction with this vehicle!");
    }

}

RegisterVehicleEvent(VehicleEvents.VEHICLE_EVENT_ON_INTERACT, (...args) => CUSTOM_INTERACTION(...args));
```

The script utilizes the `GetEntry` method to verify if the vehicle being interacted with matches the specified entry ID. If the condition is met, a custom interaction is triggered, showcasing the flexibility of using vehicle entry IDs to create unique gameplay experiences on your server.

## GetOwner

This method retrieves the owner of the [Vehicle]. Ownership is determined by who controls or summoned the vehicle. This is particularly useful in scripting scenarios where interactions depend on the vehicle-user relationships.

### Returns
* owner: [Unit](./unit.md) - The unit that owns or controls the vehicle.

### Example Usage:

Below is an example script that showcases how you might use `GetOwner` to implement a custom interaction when a player mounts a specific vehicle. The script triggers an event that checks if the mounted vehicle's owner has a certain buff. If not, it applies the buff to the owner.

```typescript
const VEHICLE_ENTRY_ID = 12345; // Example Vehicle Entry ID for demonstration
const CUSTOM_BUFF_ENTRY = 67890; // Buff Entry ID to apply
const PlayerEvents = {
    PLAYER_EVENT_ON_MOUNT_VEHICLE: 27 // Example event ID for when a player mounts a vehicle
};

// Event Handler for Mounting Vehicles
const onPlayerMountVehicle: vehicle_event_on_mount = (event: number, player: Player, vehicle: Vehicle): void => {
    // Verify the vehicle being mounted matches our criteria
    if (vehicle.GetEntry() === VEHICLE_ENTRY_ID) {
        let vehicleOwner: Unit = vehicle.GetOwner();

        // Execute further logic if the owner is a valid unit and doesn't already have the custom buff
        if (vehicleOwner && !vehicleOwner.HasAura(CUSTOM_BUFF_ENTRY)) {
            vehicleOwner.CastSpell(vehicleOwner, CUSTOM_BUFF_ENTRY, true); // Apply the buff to the vehicle's owner
            player.SendBroadcastMessage("A magical enhancement has been granted as you mount the vehicle."); // Optional feedback to player
        }
    }
};

// Registration of the event handler
RegisterVehicleEvent(VEHICLE_ENTRY_ID, PlayerEvents.PLAYER_EVENT_ON_MOUNT_VEHICLE, (...args) => onPlayerMountVehicle(...args));
```

This script leverages the `GetOwner` method to retrieve the vehicle's owner upon mounting and checks if specific conditions are met to apply a unique buff. Such interactions could enrich gameplay, offering customized buffs or effects based on vehicle usage in the game world.

## GetPassenger
Retrieve the passenger sitting in a specific seat within the vehicle. This is useful for obtaining a reference to units that are passengers in a vehicle, enabling further actions or checks to be performed on them.

### Parameters
- **seat**: number - The seat index to check for a passenger. Seat indexes start from 0. 

### Returns
- **Unit**: [Unit](./unit.md) - The unit occupying the specified seat. If there is no passenger in the given seat, returns `null`.

### Example Usage:
In this example, we have a script that checks if a specific seat in the player's vehicle is occupied. If so, it applies a buff to the passenger. This could be part of a larger mod where certain vehicle seats grant buffs or have other unique effects.

```typescript
const VEHICLE_SEAT_INDEX = 1; // Assuming we're interested in the second seat of the vehicle
const BUFF_SPELL_ID = 12345; // Placeholder spell ID for the buff

const onEnterVehicle: vehicle_event_on_enter_vehicle = (event: number, vehicle: Vehicle, passenger: Unit, seat: number) => {
    // Check if the passenger took the seat we're interested in
    if (seat === VEHICLE_SEAT_INDEX) {
        let passengerInSeat = vehicle.GetPassenger(VEHICLE_SEAT_INDEX); // Retrieve the passenger in desired seat
        if (passengerInSeat) { // If there's a passenger in the seat we're interested in
            passengerInSeat.CastSpell(passengerInSeat, BUFF_SPELL_ID, true); // Apply a buff to them
        }
    }
}

// Register the event handler to respond whenever a unit enters a vehicle seat
RegisterVehicleEvent(VehicleEvents.VEHICLE_EVENT_ON_ENTER_VEHICLE, (...args) => onEnterVehicle(...args));
```

This example demonstrates how to check the occupancy of a specific seat in a vehicle and take action based on that information. The script could be part of a larger system within a custom module or addon for AzerothCore, using the mod-eluna framework. This flexibility makes it ideal for creating unique gameplay mechanics involving vehicles and their passengers.

## IsOnBoard
Determines if the specified [Unit] passenger is currently on board the vehicle.

### Parameters
* passenger: [Unit](./unit.md) - The [Unit] to check for presence on the vehicle.

### Returns
Boolean - 'true' if the [Unit] passenger is on board the vehicle, 'false' otherwise.

### Example Usage:
This script ensures that specific actions only occur when a particular [Unit] is on board the vehicle. This can be useful in custom quests or events where the presence of specific NPCs or players on a vehicle triggers the next step of the event.

```typescript
const OnVehicleMove: vehicle_event_on_move = (event: number, vehicle: Vehicle, passenger: Unit): void => {

    // Check if the specific NPC or player is on board
    if (vehicle.IsOnBoard(passenger)) {
        // Perform actions since the passenger is on board
        // For example, start a dialogue, trigger an event, etc.
        console.log(`${passenger.GetName()} is on board, initiating next phase.`);
    } else {
        // The passenger is not on board, take alternate actions or wait
        console.log(`${passenger.GetName()} is not on board, waiting for boarding.`);
    }

}

// Registering the vehicle movement event to trigger the check
RegisterVehicleEvent(VehicleEvents.VEHICLE_EVENT_ON_MOVE, (...args) => OnVehicleMove(...args));
```
This example uses the `IsOnBoard` method to verify the presence of a specific [Unit] on the vehicle during movement. Using console logs here to denote actions or logic that could occur depending on the [Unit]'s presence. In a practical scenario, these logs would be replaced by the actual logic needed for your mod or custom content.

# RemovePassenger

This method removes a specified unit from being a passenger in the vehicle. It is useful for scripting events or interactions involving vehicles and their passengers within the game world.

### Parameters
* passenger: [Unit](./unit.md) - The unit to be removed from the vehicle.

### Example Usage:

In this example, we handle an event where a vehicle must drop off its passengers in a specific area or after an event. This script ensures the passenger is removed from the vehicle, simulating a drop-off. 

```typescript
const onVehicleApproachDropoff: vehicle_event_on_reach_destination = (event: number, vehicle: Vehicle, passenger: Unit): void => {

    // Check if the passenger is a player or a specific NPC, you can add your conditions
    if (passenger.GetType() === 'Player' || passenger.GetEntry() === YOUR_NPC_ENTRY_HERE) {
        vehicle.RemovePassenger(passenger);

        // Optionally, you could add your logic here such as:
        // - Sending a message to the player
        // - Trigger another event or quest progression
        // - Applying a buff/debuff to the unit
    }

}

// Assuming YOUR_EVENT_ID is the event ID for when the vehicle reaches its intended drop-off destination
RegisterVehicleEvent(YOUR_EVENT_ID, (...args) => onVehicleApproachDropoff(...args));
```

The script checks if the unit is either a player or a specific NPC before removal, making it versatile for different scenarios. After the passenger is removed, you can extend the logic to include additional actions such as notifying the player, advancing a quest, or modifying the unit's state. 

This method helps in creating immersive and interactive in-game events involving vehicles, enhancing the gameplay experience.

