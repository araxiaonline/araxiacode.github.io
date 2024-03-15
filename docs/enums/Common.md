## Enums
This highlights the list of all available ids that are associated to an enum in Typescript.  These map to the underlying IDs in the core: 


| Enum Name            | Value                      | Description                                   |
|----------------------|----------------------------|-----------------------------------------------|
| CorpseType           |                            |                                               |
|                      | CORPSE_BONES             | 0: Bones                                      |
|                      | CORPSE_RESURRECTABLE_PVE | 1: Resurrectable in PvE                       |
|                      | CORPSE_RESURRECTABLE_PVP | 2: Resurrectable in PvP                       |
| SelectAggroTarget    |                            |                                               |
|                      | SELECT_TARGET_RANDOM      | 0: Selects a random target                    |
|                      | SELECT_TARGET_TOPAGGRO    | 1: Selects targets from top aggro to bottom     |
|                      | SELECT_TARGET_BOTTOMAGGRO | 2: Selects targets from bottom aggro to top     |
|                      | SELECT_TARGET_NEAREST     | 3: Selects the nearest target                   |
|                      | SELECT_TARGET_FARTHEST    | 4: Selects the farthest target                  |
| CreatureFamily       |                            |                                               |
|                      | CREATURE_FAMILY_NONE            | 0: None                                       |
|                      | CREATURE_FAMILY_WOLF            | 1: Wolf                                       |
|                      | CREATURE_FAMILY_CAT             | 2: Cat                                        |
|                      | CREATURE_FAMILY_SPIDER          | 3: Spider                                     |
|                      | CREATURE_FAMILY_BEAR            | 4: Bear                                       |
|                      | CREATURE_FAMILY_BOAR            | 5: Boar                                       |
|                      | CREATURE_FAMILY_CROCOLISK       | 6: Crocolisk                                  |
|                      | CREATURE_FAMILY_CARRION_BIRD    | 7: Carrion Bird                               |
|                      | CREATURE_FAMILY_CRAB            | 8: Crab                                       |
|                      | CREATURE_FAMILY_GORILLA         | 9: Gorilla                                    |
|                      | CREATURE_FAMILY_HORSE_CUSTOM    | 10: Horse (custom)                            |
|                      | CREATURE_FAMILY_RAPTOR          | 11: Raptor                                    |
|                      | CREATURE_FAMILY_TALLSTRIDER     | 12: Tallstrider                               |
|                      | CREATURE_FAMILY_FELHUNTER       | 15: Felhunter                                 |
|                      | CREATURE_FAMILY_VOIDWALKER      | 16: Voidwalker                                |
|                      | CREATURE_FAMILY_SUCCUBUS        | 17: Succubus                                  |
|                      | CREATURE_FAMILY_DOOMGUARD       | 19: Doomguard                                 |
|                      | CREATURE_FAMILY_SCORPID         | 20: Scorpid                                   |
|                      | CREATURE_FAMILY_TURTLE          | 21: Turtle                                    |
|                      | CREATURE_FAMILY_IMP             | 23: Imp                                       |
|                      | CREATURE_FAMILY_BAT             | 24: Bat                                       |
|                      | CREATURE_FAMILY_HYENA           | 25: Hyena                                     |
|                      | CREATURE_FAMILY_BIRD_OF_PREY    | 26: Bird of Prey (Owl in Mangos)             |
|                      | CREATURE_FAMILY_WIND_SERPENT    | 27: Wind Serpent                              |
|                      | CREATURE_FAMILY_REMOTE_CONTROL   | 28: Remote Control                            |
|                      | CREATURE_FAMILY_FELGUARD        | 29: Felguard                                  |
|                      | CREATURE_FAMILY_DRAGONHAWK      | 30: Dragonhawk                                |
|                      | CREATURE_FAMILY_RAVAGER         | 31: Ravager                                   |
|                      | CREATURE_FAMILY_WARP_STALKER    | 32: Warp Stalker                              |
|                      | CREATURE_FAMILY_SPOREBAT        | 33: Sporebat                                  |
|                      | CREATURE_FAMILY_NETHER_RAY      | 34: Nether Ray                                |
|                      | CREATURE_FAMILY_SERPENT         | 35: Serpent                                   |
|                      | CREATURE_FAMILY_SEA_LION        | 36: Sea Lion (TBC only)                      |
|                      | CREATURE_FAMILY_MOTH            | 37: Moth (WotLK+)                             |
|                      | CREATURE_FAMILY_CHIMAERA        | 38: Chimaera (WotLK+)                         |
|                      | CREATURE_FAMILY_DEVILSAUR       | 39: Devilsaur (WotLK+)                        |
|                      | CREATURE_FAMILY_GHOUL           | 40: Ghoul (WotLK+)                            |
|                      | CREATURE_FAMILY_SILITHID        | 41: Silithid (WotLK+)                         |
|                      | CREATURE_FAMILY_WORM            | 42: Worm (WotLK+)                             |
|                      | CREATURE_FAMILY_RHINO           | 43: Rhino (WotLK+)                            |
|                      | CREATURE_FAMILY_WASP            | 44: Wasp (WotLK+)                             |
|                      | CREATURE_FAMILY_CORE_HOUND      | 45: Core Hound (WotLK+)                       |
|                      | CREATURE_FAMILY_SPIRIT_BEAST    | 46: Spirit Beast (WotLK+)                     |
| GOState              |                          |                                              |
|                   | GO_STATE_ACTIVE        | 0: Show in world as used and not reset       |
|                   | GO_STATE_READY         | 1: Show in world as ready                    |
|                   | GO_STATE_ACTIVE_ALTERNATIVE | 2: Show in world as used in alternative way and not reset |
| LootState         |                          |                                              |
|                   | GO_NOT_READY           | 0: Not ready                                 |
|                   | GO_READY               | 1: Ready (can be despawned and then not possible to activate until spawn) |
|                   | GO_ACTIVATED           | Activated                                    |
|                   | GO_JUST_DEACTIVATED    | Just deactivated                            |
| BanMode           |                          |                                              |
|                   | BAN_ACCOUNT            | 0: Ban account                               |
|                   | BAN_CHARACTER          | 1: Ban character                             |
|                   | BAN_IP                 | 2: Ban IP                                    |
| LocaleConstant    |                          |                                              |
|                   | LOCALE_enUS            | 0: English (US)                              |
|                   | LOCALE_koKR            | 1: Korean (South Korea)                      |
|                   | LOCALE_frFR            | 2: French (France)                           |
|                   | LOCALE_deDE            | 3: German (Germany)                          |
|                   | LOCALE_zhCN            | 4: Chinese (Simplified, China)               |
|                   | LOCALE_zhTW            | 5: Chinese (Traditional, Taiwan)             |
|                   | LOCALE_esES            | 6: Spanish (Spain)                           |
|                   | LOCALE_esMX            | 7: Spanish (Mexico)                          |
|                   | LOCALE_ruRU            | 8: Russian (Russia)                          |
| TeamId            |                          |                                              |
|                   | TEAM_ALLIANCE          | 0: Alliance                                  |
|                   | TEAM_HORDE             | 1: Horde                                     |
|                   | TEAM_NEUTRAL           | 2: Neutral                                   |
| BGEvents          |                          |                                              |
|                   | BG_EVENT_ON_START      | 1: On start of battleground (Needs to be added to TC) |
|                   | BG_EVENT_ON_END        | 2: On end of battleground (Needs to be added to TC) |
|                   | BG_EVENT_ON_CREATE     | 3: On creation of battleground (Needs to be added to TC) |
|                   | BG_EVENT_ON_PRE_DESTROY| 4: Before destruction of battleground (Needs to be added to TC) |
| CreatureEvents    |                          |                                              |
|                   | CREATURE_EVENT_ON_ENTER_COMBAT | 1: On entering combat with creature        |
|                   | CREATURE_EVENT_ON_LEAVE_COMBAT | 2: On leaving combat with creature         |
|                   | CREATURE_EVENT_ON_TARGET_DIED  | 3: On target of creature's combat dying    |
|                   | CREATURE_EVENT_ON_DIED         | 4: On creature's death                      |
|                   | CREATURE_EVENT_ON_SPAWN        | 5: On creature's spawn                      |
|                   | CREATURE_EVENT_ON_REACH_WP     | 6: On creature reaching waypoint           |
|                   | CREATURE_EVENT_ON_AIUPDATE     | 7: On creature's AI update                  |
|                   | CREATURE_EVENT_ON_RECEIVE_EMOTE| 8: On creature receiving emote              |
|                   | CREATURE_EVENT_ON_DAMAGE_TAKEN | 9: On creature taking damage                |
|                   | CREATURE_EVENT_ON_PRE_COMBAT    | 10: Before entering combat with creature   |
|                   | CREATURE_EVENT_ON_OWNER_ATTACKED | 12: On creature's owner being attacked     |
|                   | CREATURE_EVENT_ON_OWNER_ATTACKED_AT | 13: On creature's owner being attacked at specific location |
|                   | CREATURE_EVENT_ON_HIT_BY_SPELL  | 14: On creature being hit by spell          |
|                   | CREATURE_EVENT_ON_SPELL_HIT_TARGET | 15: On creature's spell hitting target  |
|                   | CREATURE_EVENT_ON_JUST_SUMMONED_CREATURE | 19: On creature just being summoned |
|                   | CREATURE_EVENT_ON_SUMMONED_CREATURE_DESPAWN | 20: On summoned creature despawning |
|                   | CREATURE_EVENT_ON_SUMMONED_CREATURE_DIED | 21: On summoned creature's death   |
|                   | CREATURE_EVENT_ON_SUMMONED      | 22: On creature being summoned              |
|                   | CREATURE_EVENT_ON_RESET         | 23: On creature's reset                     |
|                   | CREATURE_EVENT_ON_REACH_HOME    | 24: On creature reaching home               |
|                   | CREATURE_EVENT_ON_CORPSE_REMOVED| 26: On creature's corpse being removed     |
|                   | CREATURE_EVENT_ON_MOVE_IN_LOS   | 27: On creature moving in line of sight     |
|                   | CREATURE_EVENT_ON_DUMMY_EFFECT  | 30: On creature's dummy effect              |
|                   | CREATURE_EVENT_ON_QUEST_ACCEPT  | 31: On player accepting quest from creature |
|                   | CREATURE_EVENT_ON_QUEST_REWARD  | 34: On player receiving quest reward        |
|                   | CREATURE_EVENT_ON_DIALOG_STATUS | 35: On creature's dialog status change      |
|                   | CREATURE_EVENT_ON_ADD           | 36: On creature being added to world        |
|                   | CREATURE_EVENT_ON_REMOVE        | 37: On creature being removed from world    |