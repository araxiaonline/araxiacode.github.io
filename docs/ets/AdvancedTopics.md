

# Advanced Topics

For developers looking to dive deeper into the capabilities of ETS-Cli, this section explores advanced features and integrations, including using Rochet2's AIO with WoW API for creating complex server-served addons.

## Using Rochet2's AIO with WoW API

Rochet2's AIO system is a powerful tool for creating intricate addons that can be served directly from the server to the client, enhancing gameplay with new features and interactions.

### Installation and Setup

Before incorporating AIO into your modules, you must first install and configure it on your server. Visit the [AIO GitHub page](https://github.com/Rochet2/AIO) for detailed installation instructions.

### Example: Creating a Gambling Game

This example demonstrates how to use AIO alongside the WoW API to build AIO UI elements into the client without requiring user patching or installing plugins. 

**Server-side Script (aio.server.ts):**
```typescript
/** @ts-expect-error */
let aio: AIO = {};

const SLOT_GAME_OBJECT = 750001;

const ShowGambler: player_event_on_command = (event: number, player: Player, command: string): boolean => {
  if (command === 'gamble') {
    aio.Handle(player, 'GamblerMain', 'ShowFrame');
    return false;
  }
  return true;
};
``` 
**Client-side Script (aio.client.ts)**
```typescript
/** @ts-expect-error */
let aio: AIO = {};

if (!aio.AddAddon()) {
  const gamblerHandlers = aio.AddHandlers('GamblerMain', {});

  function ShowSlots(player: Player) {
    const GamblerMainFrame = CreateFrame("Frame", "GamblerMainFrame", UIParent, "UIPanelDialogTemplate");
    GamblerMainFrame.SetSize(512, 324);
    GamblerMainFrame.SetMovable(false);
    GamblerMainFrame.SetPoint("CENTER");
    GamblerMainFrame.EnableMouse(true);
    GamblerMainFrame.EnableKeyboard(true);
    GamblerMainFrame.Hide();
  }
```