

# Building Custom UIs

For developers looking to dive deeper into the capabilities of ETS-Cli, this section explores advanced features and integrations, including using Rochet2's AIO with WoW API for creating complex server-served addons.

## Using Rochet2's AIO with WoW API

Rochet2's AIO system is a powerful tool for creating intricate addons that can be served directly from the server to the client, enhancing gameplay with new features and interactions.

### Installation and Setup

Before incorporating AIO into your modules, you must first install and configure it on your server. Visit the [AIO GitHub page](https://github.com/Rochet2/AIO) for detailed installation instructions.

### Building AIO Modules 
Designing Addons that will be served through AIO works the same as developing addons for World of Warcraft retail.  You leverate the [WoWAPI](https://wowpedia.fandom.com/wiki/World_of_Warcraft_API) to build your UI.  This site will have all methods that are currently available up to 10+. This means you will need to review commands to make sure they were available for the client you are supporting.  For instance if you are building for AzerothCore you will need to make sure the API call is available for 3.3.5. 

There are some key differences when building AIO modules vs AddOns
- Everything **MUST** be scripted you can not use XML
- There is not a TOC file to declare dependencies 
- The Addons are shipped to the same global namespace so you need to be mindful of how you set global variables. 
- If you do not use Eluna Typescript, then you are also limited to not being able to use require as it is not an available command. 

### Using WoW API in Modules
ETS comes bundle with declarations for many of the WoWAPI calls that are available in 3.3.5a. (If a method is not present please submit an issue and it will get added).  This enables easier IDE support for creating custom UI's faster.  If you are a GitHub Co-pilot user you will find code completion very helpful as you build.  

You can see a full example below of WoWAPI calls, here is a really basic example: 
```Typescript
if(!aio.AddAddon()) {
    const myHandlers = aio.AddHandlers('AIOTest', {}); 
    const MainFrame = CreateFrame("Frame", "MainFrame", UIParent, "UIPanelDialogTemplate"); 
    let frame = MainFrame; 

    frame.SetSize(800,600); 
    frame.SetMovable(true);
    frame.RegisterForDrag("LeftButton"); 
    frame.SetPoint("CENTER", 0, 20); 
    frame.EnableMouse(true); 
    frame.Hide();     

        
    frame.SetScript("OnDragStart", frame.StartMoving); 
    frame.SetScript("OnHide", frame.StopMovingOrSizing);     
    frame.SetScript("OnDragStop", frame.StopMovingOrSizing); 

    frame.show(); 
}
```
### Project Structure
Naming convention, due to the nature of how the TypeScriptToLua plugin transpiles code with the plugin you **MUST** identify your client file. module.```client```.ts  The client portion is required or your transpile will not work correctly. 

**Basic structure**
```file
module/
├── module.client.ts
├── module.server.ts
``` 

**Advanced Structure with shared common and local libraries**
```file
common/
├── account.ts
└── ui.utils.ts
module/
├── module.client.ts
├── module.server.ts
└── libs/
    └── module.functions.ts
```

In order to use this functionality you use typical imports.  **This is only referencing client files, server files imports can be used however, as eluna supports "require" method call where the WoW Client does not. 
```typescript
// ---- File: module.client.ts
// common import
import { Colorize } from '../common/ui.utils.ts';
// local import
import {MyFunction} from './libs/module.functions.ts';
```

!> **Time** There is a known issue with multi-layered dependency resolution and the issue is posted.  This means only 1 level of dependencies in client file is allowed. 

Review the full example provided to see how the server and client code communicate using ```AIO.AddHandlers``` and the ```AIO.Handle``` methods. 

[Slot Machine Full Example](../examples/aio.slotmachine.md)