# Modules

Modules or scripts are individual scripts that are transpiled to Lua scripts and bundle to be used at runtime inside of a private server core.  These enable developers to create small gameplay additions, without needing to recompile the private server core.  This has an advantage in speed of delivery and rapid iteration. 

## Building Your Module

Build your module with `npx ets build`. This compiles your TypeScript code into Lua, which can then be deployed to your server. This transpiles your code into the .dist folder, utilize the script `npm run depoy:dev` for local testing. 

### Module Example
You can generate a sample module that is the traditional Hello World example by initializing your module with `npx ets init -x`.

?> You can find more examples of modules in the class sections of these docs and on the public [module registry](https://github.com/araxiaonline/wow.ets.modules)


## Deploying Your Module
Use `npx ets deploy -e [dev|prod]` to deploy your module to your server. Ensure your `ets.env` is configured correctly for deployment.

## Module template 
Here is a recommended approach when designing modules that highlights sections of a module anatomy for consitent patterns.  

```typescript
/**
* Module Purpose
* @author
* @date
*/ 

/**
* Configuration
*/
const CONFIG_OPTION: string = "DefaultConfig"
 
/**
* Event Handlers
*/
const OnCommand: player_event_on_command = ( event: number, player: Player, command: string ) {
  // your code on that action
}

/**
* Event Registers
* EventHooks: https://www.azerothcore.org/pages/eluna/?search=Register
*/ 
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_COMMAND, (...args) => onCommand(...args)); 
```