### Advanced AIO Module
This module is for managing NPC bot equipment and allows for all bot character pages
to work mostly similar to the players. 

This is only one portion of the client code for to learn more advanced concepts from example. 

__botmgr.client.ts__
```typescirpt

/** @noSelfInFile **/
/** @ts-expect-error */
let aio: AIO = {}; 

/**
 * v2: 
 * @todo Add slot management for bot equipment 
 */


import { UIInvSlot, BotEquipSlot, BotSlotName, BotStat, BotStatLabel } from "../../constants/idmaps";
import { BotData, Equipment } from "./botmgr.server";
import { BotStorage } from "./bot";
import { colors } from "../../classes/ui-utils";

// Helper functions to create unique ids for frames and components
const id = (name: string, entry: number = null) => `BotMgr${name}` + (entry ? entry : '');
const compId = (botId: number, name: string) => `${botId}:BotMgr${name}`;

// includes of global polyfills in main file for submodules 
let incObjectEntries = { 1: 'inlude'}; Object.entries(incObjectEntries);    
let incParseInt = parseInt('1');

function ucase(input: string): string {
    if (input.length === 0) {
        return input; // Return unchanged if the input is an empty string
    }
    const firstLetter = input.charAt(0).toUpperCase();
    let restOfTheString = input.slice(1).toLowerCase();

    if(input.slice(-1) == "1" || input.slice(-1) == "2") {
        restOfTheString = restOfTheString.slice(0, -1);        
    }

    return firstLetter + restOfTheString;
}

function humanizeName(input: string): string {
    if (input.length === 0) {
        return input; // Return unchanged if the input is an empty string
    }

    const parts = input.split("_");
    parts[0] = parts[0].toLowerCase(); 
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    parts[1] = parts[1].toLowerCase(); 
    parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

    return `${parts[1]} ${parts[0]}`;
}  

// If we are a client file. aio.AddAddon() will return false and this file will be serialized and sent to client. 
if(!aio.AddAddon()) {
    
    const botMgrHandlers = aio.AddHandlers('BotMgr', {}); 
    const InfoFramePool: Map<number, WoWAPI.Frame> = new Map();  
    const ComponentsPool: Map<string, unknown> = new Map();   // key botId + ":" + componentid
    const ItemClickFuncs: Map<string, any> = new Map();  // containerid (1-13):itemslotId (1-36) => click function
    const botStorage: BotStorage = new BotStorage();

    let BotItemTooltip: WoWAPI.GameTooltip;  

    function AddResistFrame(parent: WoWAPI.Frame, botData: BotData) {
        const resistFrame = CreateFrame("Frame", id("ResistsFrame"), parent);
        resistFrame.SetSize(32, 160); 
        resistFrame.SetPoint("TOPRIGHT", parent, "TOPLEFT", 297, -77); 

        const magicRes1 = CreateFrame("Frame", id("MagicResFrame1"), resistFrame, "MagicResistanceFrameTemplate", 1);
        magicRes1.SetPoint("TOP", 0, 0);
        magicRes1.SetSize(32, 32);

        const magResBack1 = magicRes1.CreateTexture(id("MagicResTexture1"), "BACKGROUND");
        magResBack1.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-ResistanceIcons");
        magResBack1.SetTexCoord(0, 1, 0.2265, 0.3398);
        magResBack1.SetAllPoints(magicRes1);
        
        const magResFont1 = magicRes1.CreateFontString(id("Resist2"), "BACKGROUND", "GameFontHighlightSmall");
        magResFont1.SetPoint("BOTTOM", magResBack1, null, 0, 3);
        magResFont1.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats["Resistance: arcane"]}`);
        ComponentsPool.set(compId(botData.entry, "Resist1"), magResFont1);

        // End Arcance Resistance

        const magicRes2 = CreateFrame("Frame", id("MagicResFrame2"), resistFrame, "MagicResistanceFrameTemplate", 2);
        magicRes2.SetPoint("TOP", magicRes1, "BOTTOM", 0, 0);
        magicRes2.SetSize(32, 32);

        const magResBack2 = magicRes2.CreateTexture(id("MagicResTexture2"), "BACKGROUND");
        magResBack2.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-ResistanceIcons");
        magResBack2.SetTexCoord(0, 1, 0, 0.11328125);
        magResBack2.SetAllPoints(magicRes2);
        
        const magResFont2 = magicRes1.CreateFontString(id("Resist2"), "BACKGROUND", "GameFontHighlightSmall");
        magResFont2.SetPoint("BOTTOM", magicRes2, null, 0, 3);
        magResFont2.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats["Resistance: fire"]}`);
        ComponentsPool.set(compId(botData.entry, "Resist2"), magResFont2);

        // end fire resistance

        const magicRes3 = CreateFrame("Frame", id("MagicResFrame3"), resistFrame, "MagicResistanceFrameTemplate", 3);
        magicRes3.SetPoint("TOP", magicRes2, "BOTTOM", 0, 0);
        magicRes3.SetSize(32, 32);

        const magResBack3 = magicRes3.CreateTexture(id("MagicResTexture3"), "BACKGROUND");
        magResBack3.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-ResistanceIcons");
        magResBack3.SetTexCoord(0, 1, 0.11328125, 0.2265625);
        magResBack3.SetAllPoints(magicRes3);
    
        const magResFont3 = magicRes3.CreateFontString(id("Resist3"), "BACKGROUND", "GameFontHighlightSmall");
        magResFont3.SetPoint("BOTTOM", magicRes3, null, 0, 3);
        magResFont3.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats["Resistance: nature"]}`);
        ComponentsPool.set(compId(botData.entry, "Resist3"), magResFont3);        

        // end nature resistance

        const magicRes4 = CreateFrame("Frame", id("MagicResFrame4"), resistFrame, "MagicResistanceFrameTemplate", 4);
        magicRes4.SetPoint("TOP", magicRes3, "BOTTOM", 0, 0);
        magicRes4.SetSize(32, 32);

        const magResBack4 = magicRes4.CreateTexture(id("MagicResTexture4"), "BACKGROUND");
        magResBack4.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-ResistanceIcons");
        magResBack4.SetTexCoord(0, 1, 0.33984375, 0.453125);
        magResBack4.SetAllPoints(magicRes4);
    
        const magResFont4 = magicRes4.CreateFontString(id("Resist4"), "BACKGROUND", "GameFontHighlightSmall");
        magResFont4.SetPoint("BOTTOM", magicRes4, null, 0, 3);
        magResFont4.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats["Resistance: frost"]}`);
        ComponentsPool.set(compId(botData.entry, "Resist4"), magResFont4); 
        
        // end frost resistance

        const magicRes5 = CreateFrame("Frame", id("MagicResFrame5"), resistFrame, "MagicResistanceFrameTemplate", 5);
        magicRes5.SetPoint("TOP", magicRes4, "BOTTOM", 0, 0);
        magicRes5.SetSize(32, 32);

        const magResBack5 = magicRes5.CreateTexture(id("MagicResTexture5"), "BACKGROUND");
        magResBack5.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-ResistanceIcons");
        magResBack5.SetTexCoord(0, 1, 0.453125, 0.56640625);
        magResBack5.SetAllPoints(magicRes5);
    
        const magResFont5 = magicRes5.CreateFontString(id("Resist5"), "BACKGROUND", "GameFontHighlightSmall");
        magResFont5.SetPoint("BOTTOM", magicRes5, null, 0, 3);
        magResFont5.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats["Resistance: shadow"]}`);
        ComponentsPool.set(compId(botData.entry, "Resist5"), magResFont5); 

        // end shadow resistance
    }

    function AddPortrait(parent: WoWAPI.Frame, botData: BotData) {
        const portrait = parent.CreateTexture(id("Portrait", botData.entry), "ARTWORK");
        portrait.SetPoint("TOPLEFT", 10, -7);
        portrait.SetSize(58, 58);
        
        SetPortraitTexture(portrait, "target");

        const characterName = CreateFrame("Frame", id("CharacterName", botData.entry), parent);
        characterName.SetSize(109,12); 
        characterName.SetPoint("CENTER",6,232);
        characterName.SetScript("OnLoad", (frame) => {
            RaiseFrameLevel(frame); 
        });

        const charFont = characterName.CreateFontString(id("CharacterNameFont", botData.entry), "BACKGROUND", "GameFontNormal");
        charFont.SetText(GetUnitName("target", false));
        charFont.SetSize(300,12); 
        charFont.SetPoint("CENTER",0,0);
        charFont.SetTextColor(1,1,1,1);

        const infoTextFrame = CreateFrame("Frame", id("InfoTextFrame", botData.entry), parent);
        infoTextFrame.SetSize(200,12);
        infoTextFrame.SetPoint("CENTER", characterName, "BOTTOM", 0, -15);
        infoTextFrame.SetScript("OnLoad", (frame) => {
            RaiseFrameLevel(frame); 
        });

        const infoTextFont = infoTextFrame.CreateFontString(id("InfoTextFont", botData.entry), "BACKGROUND", "GameFontHighlightSmall");
        if(botData.classId > 10) {
            infoTextFont.SetText(`${YELLOW_FONT_COLOR_CODE} Level ${UnitLevel("target")} ${botData.class}`);
        } else {
            infoTextFont.SetText(`${YELLOW_FONT_COLOR_CODE} Level ${UnitLevel("target")} ${botData.race} ${botData.class}`);
        }

        const spec = infoTextFrame.CreateFontString(id("SpecFont", botData.entry), "BACKGROUND", "GameFontHighlightSmall");
        spec.SetText(`${botData.talentSpecName}`);
        spec.SetPoint("TOP", infoTextFont, "BOTTOM", 0, -2);
        ComponentsPool.set(compId(botData.entry, "SpecFont"), spec);

        infoTextFont.SetSize(300,12);
        infoTextFont.SetPoint("CENTER",0,0);    
        
    }
    
    function AddCharacterModel(parent: WoWAPI.Frame, botData: BotData) {        
        const frameChar = CreateFrame("PlayerModel", id("ModelFrame", botData.entry), parent, null, botData.entry);
        frameChar.SetPoint("TOP", -5, -82);
        frameChar.SetSize(240, 175);
        frameChar.SetUnit("target"); 
        frameChar.SetFacing(0.3);        
        frameChar.SetAlpha(0.65);
        frameChar.SetGlow(0.9);
        frameChar.SetFrameStrata("MEDIUM");        
    }

    function UpdateEquipFrame(group: 'left' | 'right' | 'weapons', parent: WoWAPI.Frame, botData: BotData) {
        let slotOrder = []; 

        switch(group) {
            case 'left':
                slotOrder = [BotEquipSlot.HEAD,BotEquipSlot.NECK,BotEquipSlot.SHOULDERS,BotEquipSlot.BACK,BotEquipSlot.CHEST,-1,-2,BotEquipSlot.WRIST];
                break;
            case 'right':
                slotOrder = [BotEquipSlot.HANDS,BotEquipSlot.WAIST,BotEquipSlot.LEGS,BotEquipSlot.FEET,BotEquipSlot.FINGER1,BotEquipSlot.FINGER2,BotEquipSlot.TRINKET1,BotEquipSlot.TRINKET2];
                break;
            case 'weapons':
                slotOrder = [BotEquipSlot.MAINHAND,BotEquipSlot.OFFHAND,BotEquipSlot.RANGED];
                break;
        }                         
        
        // loop through the left equipment and create the buttons and texture. 
        for(let i = 0; i < slotOrder.length; i++) {            
            const itemSlotId = slotOrder[i] >= 0 ? slotOrder[i] : 92+slotOrder[i];
            const equipSlot = CreateFrame("Button", id(`${group}-EquipmentSlot-${slotOrder[i]}`), parent, "ItemButtonTemplate", itemSlotId);

            if(group === 'weapons') 
                equipSlot.SetPoint("TOPLEFT", i*40+1, 0);
            else 
                equipSlot.SetPoint("TOPLEFT", 0, -i*40-1);

            equipSlot.SetSize(40, 40);    
            equipSlot.SetScript("OnEnter", ItemSlotOnEnter);
            equipSlot.SetScript("OnLeave", ItemSlotOnLeave);
            equipSlot.SetScript("OnClick", ItemSlotOnClick); 

            const equippedItem: Equipment = botData.equipment[slotOrder[i]];
            let itemIcon: WoWAPI.TexturePath; 
            let itemId: number;
            let idsuffix: string | number;

            // If it is a shirt or tabard which are not supported just show the background texture.
            if(slotOrder[i] < 0) {
                const shirtOrTabard = (slotOrder[i] === -1) ? "SHIRT" : "TABARD";
                [itemId, itemIcon] = GetInventorySlotInfo(UIInvSlot[`${shirtOrTabard}SLOT`]);
                idsuffix = shirtOrTabard
            }
            
            // If we have a piece of equipment add the icon template
            if(equippedItem && equippedItem.entry > 0) {
                itemIcon = GetItemIcon(equippedItem.entry);                    
                idsuffix = slotOrder[i];             
            }

            // If there is not a piece of equipment add the background texture
            if(!equippedItem && slotOrder[i] > 0) {
                let slotName = BotSlotName[slotOrder[i]];

                if(slotOrder[i] === BotEquipSlot.FINGER1) slotName = "FINGER0";
                if(slotOrder[i] === BotEquipSlot.FINGER2) slotName = "FINGER1";
                if(slotOrder[i] === BotEquipSlot.TRINKET1) slotName = "TRINKET0";
                if(slotOrder[i] === BotEquipSlot.TRINKET2) slotName = "TRINKET1";
                if(slotOrder[i] === BotEquipSlot.OFFHAND) slotName = "SECONDARYHAND";
                
               [itemId, itemIcon] = GetInventorySlotInfo(UIInvSlot[`${slotName}SLOT`]);
                idsuffix = slotOrder[i];                
            }

            const itemTexture = equipSlot.CreateTexture(id(`ItemTexture-${idsuffix}`), "OVERLAY");
            itemTexture.SetTexture(itemIcon);
            itemTexture.SetPoint("CENTER", 0, 0);
            itemTexture.SetSize(36,36);
            ComponentsPool.set(compId(botData.entry, `ItemSlotTexture-${itemSlotId}`), itemTexture);
        }
    }

    function AddEquipmentFrames(parent: WoWAPI.Frame, botData: BotData) {
        
        // Get all our frames 
        const frames = {
            left: ComponentsPool.get(compId(botData.entry, "LeftEquipment")), 
            right: ComponentsPool.get(compId(botData.entry, "RightEquipment")),
            weapons: ComponentsPool.get(compId(botData.entry, "WeaponsEquipment"))
        }; 
        
        let equipFrame: WoWAPI.Frame; 
        if(!frames.left) {
            equipFrame = CreateFrame("Frame", id("LeftEquipment"), parent, null, 1);
            equipFrame.SetPoint("TOPLEFT", 20, -73);
            equipFrame.SetSize(40, 330);
           UpdateEquipFrame('left', equipFrame, botData);
            ComponentsPool.set(compId(botData.entry, "LeftEquipment"), equipFrame);    

        }

        if(!frames.right) {
            equipFrame = CreateFrame("Frame", id("RightEquipment"), parent, null, 2);
            equipFrame.SetPoint("TOPRIGHT", -40, -73);
            equipFrame.SetSize(40, 330);
           UpdateEquipFrame('right', equipFrame, botData);
            ComponentsPool.set(compId(botData.entry, "RightEquipment"), equipFrame);                
        }

        if(!frames.weapons) {
            equipFrame = CreateFrame("Frame", id("WeaponEquipment"), parent, null, 3);
            equipFrame.SetPoint("CENTER", -10, -147);
            equipFrame.SetSize(129, 40);
            UpdateEquipFrame('weapons', equipFrame, botData);
            ComponentsPool.set(compId(botData.entry, "WeaponsEquipment"), equipFrame);            
        }
                
    }

    function AddStats(parent: WoWAPI.Frame | undefined, botData: BotData) {
        const leftStats = botData.leftStats;
        const rightStats = botData.rightStats;
        for(let i =0; i < leftStats.length; i++) {
            const statName = Object.keys(leftStats[i])[0];

            let statLabel = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, `StatName-${statName}`));            
            if(!statLabel) {
                statLabel = parent.CreateFontString(id(`StatName-${statName}`), "ARTWORK", "GameFontNormalSmall");
                statLabel.SetPoint("TOPLEFT", parent, "TOPLEFT", 5, -7 - (i * 14));                        
                statLabel.SetJustifyH("LEFT");
                statLabel.SetText(`${statName}:`);            
                ComponentsPool.set(compId(botData.entry, `StatName-${statName}`), statLabel); 
            }
            
            let statValue = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, `StatValue-${statName}`));
            // if there is not an existing component create a new one
            if(!statValue) {
                statValue = parent.CreateFontString(id(`StatValue-${statName}`), "ARTWORK", "GameFontNormalSmall");
                statValue.SetPoint("TOPRIGHT", parent, "TOP", -4, -5 - (i * 14));
                if(statName === "Damage") {
                    statValue.SetSize(90, 14); 
                } else {
                    statValue.SetSize(50, 14);
                }           
                statValue.SetJustifyH("RIGHT");        
                ComponentsPool.set(compId(botData.entry, `StatValue-${statName}`), statValue); 
            }
            statValue.SetText(`${colors('white')}${leftStats[i][statName]}`);            
        }

        for(let i =0; i < rightStats.length; i++) {
            const statName = Object.keys(rightStats[i])[0];
            let statLabel = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, `StatName-${statName}`));
            if(!statLabel) {
                statLabel = parent.CreateFontString(id(`StatName-${statName}`), "ARTWORK", "GameFontNormalSmall");
                statLabel.SetPoint("TOPLEFT", parent, "TOPLEFT", 118, -7 - (i * 14));            
                statLabel.SetText(`${statName}:`);
                statLabel.SetJustifyH("LEFT");
                ComponentsPool.set(compId(botData.entry, `StatName-${statName}`), statLabel); 
            }            

            let statValue = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, `StatValue-${statName}`));
            if(!statValue) {
                statValue = parent.CreateFontString(id(`StatValue-${statName}`), "ARTWORK", "GameFontNormalSmall");
                statValue.SetPoint("TOPRIGHT", parent, "TOPRIGHT", -4, -5 - (i * 14));
                statValue.SetSize(50, 14); 
                statValue.SetJustifyH("RIGHT");            
                ComponentsPool.set(compId(botData.entry, `StatValue-${statName}`), statValue); 
            }
            statValue.SetText(`${colors('white')}${rightStats[i][statName]}`);
                        
        }
    }

    function CreateStats(parent: WoWAPI.Frame, botData: BotData) {

        const statsFrame = CreateFrame("Frame", id("CharacterAttr"), parent, null, 1);
        statsFrame.SetSize(230,78); 
        statsFrame.SetPoint("TOPLEFT", 67, -251);
        statsFrame.SetFrameLevel(parent.GetFrameLevel() + 1);
        // statsFrame.SetFrameStrata("LOW");
        statsFrame.SetAlpha(1.0);    
        statsFrame.SetBackdropColor(0,0,0,1.0);    

        const leftTop = statsFrame.CreateTexture(id("StatLeftTop"), "BACKGROUND");
        leftTop.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-StatBackground");
        leftTop.SetSize(115,16);
        leftTop.SetPoint("TOPLEFT", 0, 0);
        leftTop.SetTexCoord(0, 0.8984375, 0, 0.125); 

        const leftmiddle = statsFrame.CreateTexture(id("StatLeftMiddle"), "BACKGROUND");
        leftmiddle.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-StatBackground");
        leftmiddle.SetSize(115,95);
        leftmiddle.SetPoint("TOPLEFT", leftTop, "BOTTOMLEFT", 0, 0);
        leftmiddle.SetTexCoord(0, 0.8984375, 0.125, 0.1953125);

        const leftBottom = statsFrame.CreateTexture(id("StatLeftBottom"), "BACKGROUND");
        leftBottom.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-StatBackground");
        leftBottom.SetSize(115,16);
        leftBottom.SetPoint("TOPLEFT", leftmiddle, "BOTTOMLEFT", 0, 0);
        leftBottom.SetTexCoord(0, 0.8984375, 0.484375, 0.609375);

        const rightTop = statsFrame.CreateTexture(id("StatRightTop"), "BACKGROUND");
        rightTop.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-StatBackground");
        rightTop.SetSize(115,16);
        rightTop.SetPoint("TOPLEFT", leftTop, "TOPRIGHT",0, 0);
        rightTop.SetTexCoord(0, 0.8984375, 0, 0.125);

        const rightMiddle = statsFrame.CreateTexture(id("StatRightMiddle"), "BACKGROUND");
        rightMiddle.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-StatBackground");
        rightMiddle.SetSize(115,95);
        rightMiddle.SetPoint("TOPLEFT", leftmiddle, "TOPRIGHT", 0, 0);
        rightMiddle.SetTexCoord(0, 0.8984375, 0.125, 0.1953125);

        const rightBottom = statsFrame.CreateTexture(id("StatRightBottom"), "BACKGROUND");
        rightBottom.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-StatBackground");
        rightBottom.SetSize(115,16);
        rightBottom.SetPoint("TOPLEFT", leftBottom, "TOPRIGHT", 0, 0);
        rightBottom.SetTexCoord(0, 0.8984375, 0.484375, 0.609375);

        AddStats(statsFrame, botData);
    }

    function SetBackground(parent: WoWAPI.Frame) {        
        // Left corner
        const leftUpper = parent.CreateTexture(id("BgUpperLeft"), "BACKGROUND");
        leftUpper.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-CharacterTab-L1");
        leftUpper.SetSize(256,256);
        leftUpper.SetPoint("TOPLEFT");             

        // Right corner
        const rightUpper = parent.CreateTexture(id("BgUpperRight"), "BACKGROUND");
        rightUpper.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-CharacterTab-R1");
        rightUpper.SetSize(128,256);
        rightUpper.SetPoint("TOPRIGHT");

        // left bottom
        const leftBottom = parent.CreateTexture(id("BgBottomLeft"), "BACKGROUND");
        leftBottom.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-CharacterTab-L2");
        leftBottom.SetSize(256,256);
        leftBottom.SetPoint("BOTTOMLEFT");

        // right bottom
        const rightBottom = parent.CreateTexture(id("BgBottomRight"), "BACKGROUND");
        rightBottom.SetTexture("Interface\\PaperDollInfoFrame\\UI-Character-CharacterTab-R2");
        rightBottom.SetSize(128,256);
        rightBottom.SetPoint("BOTTOMRIGHT");

        // Close Button 
        const closeButton = CreateFrame("Button", id("CloseButton"), parent, "UIPanelCloseButton");
        closeButton.SetPoint("CENTER", parent, "TOPRIGHT", -44, -25);
        closeButton.SetScript("OnClick", () => {
            parent.Hide();
        });                 
    }

    function AddSoundEffects(frame: WoWAPI.Frame) {
        frame.SetScript("OnShow", (frame) => {            
            PlaySound("igCharacterInfoOpen");
        }); 

        frame.SetScript("OnHide", (frame) => {                       
            PlaySound("igCharacterInfoClose");            
        });  
    }

    /**
     * START OF EVENT HANDLERS 
     */

    function ItemSlotOnEnter(frame: WoWAPI.Button) {
        const botId = botStorage.GetActive();        
        const theItem = botStorage.GetBotItem(botId, <BotEquipmentSlotNum>frame.GetID());        
        GameTooltip.SetOwner(frame, "ANCHOR_RIGHT");                 
        if(theItem) {
            GameTooltip.SetHyperlink(theItem.link);
        } else {            
            if(frame.GetID() == 90) {
                GameTooltip.SetText("Tabard");
            } else if(frame.GetID() == 91) {
                GameTooltip.SetText("Shirt");
            } else {
                GameTooltip.SetText(
                    ucase(BotSlotName[frame.GetID()])
                );
             
            }
        }                

        if(CursorHasItem()) {
            const [compItem, compItemId, compItemLink] = GetCursorInfo();                    
            const BotTooltip = <WoWAPI.GameTooltip>ComponentsPool.get(compId(botId, "tooltip"));        
            BotTooltip.SetOwner(frame, "ANCHOR_LEFT");            
            BotTooltip.SetHyperlink(compItemLink);                    
            BotTooltip.Show();            
        }
        GameTooltip.Show(); 

    }

    function ItemSlotOnLeave(frame: WoWAPI.Button) {        
        const botId = botStorage.GetActive();                        
        const BotTooltip = <WoWAPI.GameTooltip>ComponentsPool.get(compId(botId, "tooltip"));          
        BotTooltip.Hide();
        GameTooltip.Hide();     
    }

    function ItemSlotOnClick(frame: WoWAPI.Button, button: string) {
        const botId = botStorage.GetActive();        
                
        const theItem = botStorage.GetBotItem(botId, <BotEquipmentSlotNum>frame.GetID());    
        const [compItem, compItemId, compItemLink] = GetCursorInfo();        

        // IF we have a bank item since it is not our inventory it will crash the server so store it then send equip
        const bankItem = botStorage.GetFromBank();
        if(bankItem) {
            for(let i=0; i <= 4; i++) {
                if(GetContainerNumFreeSlots(<WoWAPI.CONTAINER_ID>i)) {
                    if(i === 0) {
                        PutItemInBackpack();                         
                    } else {
                        PutItemInBag(i);
                    }
                }
            }
        }

        // Special case to handle unquipping items via modified click
        if(IsModifiedClick("AUTOLOOTTOGGLE")) {
            if(theItem && !compItem) {
                aio.Handle("BotMgr", "UnequipTheItem", GetUnitName("player", false), frame.GetID(), botId);
                return; 
            }
        }
        
        if(theItem && !compItem) {
            if(button == "LeftButton") {
                PickupItem(theItem.link);
                // print('Set Bot Pickup Item', botId, theItem.entry, theItem.link); 
                botStorage.BotItemPickedUp(botId, theItem.entry, theItem.link);
                return; 
            }             
        } 

        if(compItem) {
            const slot = frame.GetID(); 

            // if we have a bot virtual item in hand
            if(botStorage.IsPickedUp()) {
                const botItemInHand = botStorage.GetItemInHand();                
                // first unequip item on target bot
                aio.Handle("BotMgr", "UnequipTheItem", GetUnitName("player", false),  slot, botItemInHand.bot);
                aio.Handle("BotMgr", "EquipTheItem", GetUnitName("player", false), botId, slot, compItemId, compItemLink); 
            } else {
                aio.Handle("BotMgr", "EquipTheItem", GetUnitName("player", false), botId, slot, compItemId, compItemLink); 
            }

            // Attempt to equip the item. 
            PlaySound("INTERFACESOUND_CURSORDROPOBJECT");
            ClearCursor(); 
        }
    }

    botMgrHandlers.OnEquipSuccess = (botId: number, slot: BotEquipmentSlotNum, item: Equipment) => {        
        const itemTexture = <WoWAPI.Texture>ComponentsPool.get(compId(botId, `ItemSlotTexture-${slot}`));
        itemTexture.SetTexture(GetItemIcon(item.entry));
        
        // Hide Tooltips otherwise it will show old item. 
        const BotTooltip = <WoWAPI.GameTooltip>ComponentsPool.get(compId(botId, "tooltip"));    
        botStorage.SetBotItem(botId, slot, item); 
            
        BotTooltip.Hide();
        GameTooltip.Hide();             
    }

    botMgrHandlers.OnUnEquipSuccess = (botId: number, slot: BotEquipmentSlotNum) => {                
        const itemTexture = <WoWAPI.Texture>ComponentsPool.get(compId(botId, `ItemSlotTexture-${slot}`));
        /** TO DO move to generic function for getting textures right now is copy/paste */
        let slotName: string = BotSlotName[slot];

        if(slot === BotEquipSlot.FINGER1) slotName = "FINGER0";
        if(slot === BotEquipSlot.FINGER2) slotName = "FINGER1";
        if(slot === BotEquipSlot.TRINKET1) slotName = "TRINKET0";
        if(slot === BotEquipSlot.TRINKET2) slotName = "TRINKET1";
        if(slot === BotEquipSlot.OFFHAND) slotName = "SECONDARYHAND";
        
        const [, itemIcon] = GetInventorySlotInfo(UIInvSlot[`${slotName}SLOT`]);              
        itemTexture.SetTexture(itemIcon);
        
        // Hide Tooltips otherwise it will show old item. 
        const BotTooltip = <WoWAPI.GameTooltip>ComponentsPool.get(compId(botId, "tooltip"));          
        BotTooltip.Hide();
        GameTooltip.Hide();                             
    }

    botMgrHandlers.OnEquipFail = (botId: number, slot: BotEquipmentSlotNum, itemId: number, itemLink: string) => {
        PlaySound("ITEMGENERICSOUND");
        botStorage.BotItemCursorClear(); 
        ClearCursor();
    }


    botMgrHandlers.OnUnEquipFail = (botId: number, slot: BotEquipmentSlotNum) => {
        PlaySound("ITEMGENERICSOUND");
        botStorage.BotItemCursorClear(); 
        ClearCursor();
    }

    botMgrHandlers.UpdateBotData = (data: BotData) => {             
        botStorage.SetBotData(data.entry, data);
        UpdateBotFrame(data);
    }

    function HandleUnequipItem(itemButton: WoWAPI.Button, isBankSlot: boolean = false): void {

        const slotNum = itemButton.GetID();
        const bagId = itemButton.GetParent().GetID();    
        if(!GetContainerItemLink((isBankSlot) ? -1 : bagId, slotNum)) {
            if(botStorage.IsPickedUp()) {
                const item = botStorage.GetItemInHand();                
                aio.Handle("BotMgr", "UnequipTheItem", GetUnitName("player", false), item.slot, item.bot); 
            }
        }        
    }

    /**
     * This handles listening on Bot Items being dragged to the bag. Attaches
     * to the default handler before run and handles bot items specifically. 
     */
    function StoreItemSlotHandlers(): void {

        // Intercept Bank Item Slots Click Event
        for(let bankSlot = 1; bankSlot <= _G[`NUM_BANKGENERIC_SLOTS`]; bankSlot++) {
            ItemClickFuncs.set(`bank:${bankSlot}`, _G[`BankFrameItem${bankSlot}`].GetScript("OnClick"));
            
            _G[`BankFrameItem${bankSlot}`].SetScript("OnClick", (frame: WoWAPI.Button, ...args) => {                                                          

                HandleUnequipItem(frame, true);
                const callback = ItemClickFuncs.get(`bank:${frame.GetID()}`);
                (callback) ? callback(frame, ...args)  : null;
                 //print(`No callback for bank:${bankSlot}`)

                if(CursorHasItem()) {
                    const [compItem, compItemId, compItemLink] = GetCursorInfo();                        
                    botStorage.SetFromBank({
                        slot: frame.GetID(),
                        link: compItemLink,
                        entry: compItemId
                    });
                }
            }); 
        }
                            
    }
    
    function UpdateBotFrame(botData: BotData) {
        
        // Set the new Talent Spec 
        const talentSpec = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, "SpecFont"));
        talentSpec.SetText(botData.talentSpecName);

        // Update Resist Frames
        let resist = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, "Resist1")); 
        resist.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats['Resistance: arcane']}`);
        resist = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, "Resist2")); 
        resist.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats['Resistance: fire']}`);
        resist = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, "Resist3")); 
        resist.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats['Resistance: nature']}`);
        resist = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, "Resist4")); 
        resist.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats['Resistance: frost']}`);
        resist = <WoWAPI.FontString>ComponentsPool.get(compId(botData.entry, "Resist5")); 
        resist.SetText(`${GREEN_FONT_COLOR_CODE}${botData.allStats['Resistance: shadow']}`);

        // Update the stats frame
        AddStats(undefined, botData); 
    }


    /**
     * Shows or Creates a new Bot Equipment Management Frame
     * Every NPC Bot that is requested to be managed will get their own unique frame. This
     * reduces what textures and subframes need to be reloaded. For instance 3d models, portraits. 
     * 
     * Each Frame will be keyed on a Frame Manager by EntryID.  This should not cause performance issues as 
     * each player is limited to the number of NPC bots they can manage.  
     * 
     * @param player 
     * @param botdetails 
     * @returns 
     * @noSelf
     */
    function ShowBotFrame(botData: BotData) {

        let mainFrame: WoWAPI.Frame = null;         
        mainFrame = InfoFramePool.get(botData.entry);         

        // Build the complete frame if we do not already have one in the pool. 
        if(!mainFrame) {
            mainFrame = CreateFrame("Frame", id("MainFrame"+botData.entry), UIParent, null, botData.entry);
            mainFrame.SetPoint("TOPLEFT", 300, -204);
            mainFrame.SetSize(384, 512);            
            mainFrame.SetFrameLevel(5);             
            mainFrame.SetMovable(true);
            mainFrame.EnableMouse(true);
            mainFrame.RegisterForDrag("LeftButton");
            mainFrame.SetScript("OnDragStart", mainFrame.StartMoving); 
            mainFrame.SetScript("OnHide", mainFrame.StopMovingOrSizing);     
            mainFrame.SetScript("OnDragStop", mainFrame.StopMovingOrSizing);            
            mainFrame.SetScript("OnEnter", (frame) => {                 
                botStorage.SetActive(frame.GetID());
                frame.SetFrameLevel(20); 
            });            
            mainFrame.SetScript("OnLeave", (frame) => {
                frame.SetFrameLevel(5);
            });
            
            BotItemTooltip = CreateFrame("GameTooltip", id("ItemToolTip"+botData.entry), mainFrame, "GameTooltipTemplate", botData.entry);  
            BotItemTooltip.SetOwner(mainFrame, "ANCHOR_NONE");
            BotItemTooltip.Hide(); 

            // Build all elements of the frame on creation. 
            SetBackground(mainFrame);
            AddPortrait(mainFrame, botData);
            AddCharacterModel(mainFrame, botData);
            AddResistFrame(mainFrame, botData);                    
            AddEquipmentFrames(mainFrame, botData);
            CreateStats(mainFrame, botData);
            AddSoundEffects(mainFrame);

            InfoFramePool.set(botData.entry, mainFrame); 
            ComponentsPool.set(compId(botData.entry, "tooltip"), <WoWAPI.GameTooltip>BotItemTooltip); 
            mainFrame.Show();                              

            // mainFrame.RegisterEvent("CURSOR_UPDATE");
            // mainFrame.RegisterEvent("ITEM_LOCK_CHANGED");
            mainFrame.RegisterEvent("ITEM_UNLOCKED");            
            mainFrame.SetScript("OnEvent", (frame: WoWAPI.Frame, eventName: WoWAPI.Event, ...args) => {                              
                if(eventName === "ITEM_UNLOCKED") {                    
                    botStorage.ClearFromBank();                     
                }
            }); 

        } else {
            mainFrame.Show();                    
            UpdateBotFrame(botData);
        }

     
    }
    
    botMgrHandlers.ShowFrame = (botData: BotData) => {
        botStorage.UpdateBotData(botData.entry, botData);
        ShowBotFrame(botData);
    }    

    // Global calls to set things up
    StoreItemSlotHandlers(); 
    
}

```

This is used as an object representation of the player. Review the [BuildingCustomUIs](../ets/BuildingCustomUIs.md) material to learn more about modular client code. 
__botUnit.ts__
```typescript
import * as Common from '../../constants/idmaps'; 
import { BotData, Equipment, EquipmentList } from './botmgr.server';

type CharInfo = {
    name: string,
    level: number,
    className: Common.CharacterClass,
    classId: keyof typeof Common.ClassesMapping,
    raceName: Common.CharacterRace,
    raceId: keyof typeof Common.RacesMapping
}

type CharStats = Partial<Record<keyof typeof Common.BotStat, number>>;

function humanizeTalentName(input: string): string {
    if (input.length === 0) {
        return input; // Return unchanged if the input is an empty string
    }

    try {
        const parts = input.split("_");
        parts[0] = parts[0].toLowerCase(); 
        parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        parts[1] = parts[1].toLowerCase(); 
        parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    
        return `${parts[1]} ${parts[0]}`;
    } catch (e) {
        print(`failed to humanize talent name: ${input}` + e);
    }

}    
export class BotUnit {
    
    protected myself: Creature; 
    protected myOwner: Player;
    protected charinfo: CharInfo;
    protected equipment: EquipmentList;
    protected statsLeft: Record<string, string>[]; 
    protected statsRight: Record<string, string>[];
    protected talentSpecId: number;
    protected roles: number;
    protected allStats: Record<string, string> = {};

    constructor(creature: Creature) {
        if(!creature.IsNPCBot()) {
            return;
        }

        this.myself = creature;
        this.myOwner = creature.GetBotOwner();
        this.charinfo = {
            name: creature.GetName(),
            level: creature.GetLevel(),
            className: Common.ClassesMapping[creature.GetClass()],
            classId: creature.GetClass(),
            raceName: Common.RacesMapping[creature.GetRace()],
            raceId: creature.GetRace()
        };
        this.equipment = this._lookupEquipment();
        this.talentSpecId = creature.GetTalentSpec();     
        this.parseStats(creature.GetBotDump());
        try {
            this.statsLeft = this._lookupStats('left');
            this.statsRight = this._lookupStats('right');
        } catch (e) {
            print("failed to get stats for bot:" + e);
        }
        
        this.roles = creature.GetBotRoles();
        
           
    }

    public toBotData(): BotData {
        return {
            name: this.charinfo.name,
            entry: this.myself.GetEntry(),
            owner: this.myOwner.GetName(),
            level: this.charinfo.level,
            class: this.charinfo.className,
            classId: this.charinfo.classId,
            race: this.charinfo.raceName,
            raceId: this.charinfo.raceId,
            talentSpec: this.talentSpecId,
            talentSpecName: humanizeTalentName(this.talentSpecName()),
            roles: this.roles,
            equipment: this.equipment,
            leftStats: this.statsLeft,
            rightStats: this.statsRight,
            allStats: this.allStats
        }
    }

    public isHealer(): boolean {
        if(this.talentSpecId == Common.TalentSpecs.SHAMAN_RESTORATION || 
            this.talentSpecId == Common.TalentSpecs.PRIEST_DISCIPLINE ||
            this.talentSpecId == Common.TalentSpecs.PRIEST_HOLY ||
            this.talentSpecId == Common.TalentSpecs.PALADIN_HOLY ||
            this.talentSpecId == Common.TalentSpecs.DRUID_RESTORATION) {
                return true;
            }
        return false;
    }

    public isDualWield(): boolean {
        if(this.talentSpecId == Common.TalentSpecs.ROGUE_COMBAT ||
            this.talentSpecId == Common.TalentSpecs.ROGUE_SUBTLETY ||
            this.talentSpecId == Common.TalentSpecs.ROGUE_ASSASSINATION ||
            this.talentSpecId == Common.TalentSpecs.SHAMAN_ENHANCEMENT ||
            this.talentSpecId == Common.TalentSpecs.WARRIOR_FURY) {
                if(this.equipment[Common.BotEquipSlot.MAINHAND] && 
                    this.equipment[Common.BotEquipSlot.OFFHAND]) {
                    return true;
                }

            }
    }


    public GetMeleeStats (): Record<string, Common.BotStatName[]>{        
        const botStatValues = Object.values(Common.BotStatLabel);
        type BotStatValues = typeof botStatValues[number];

        return { 
            left: [
                "Strength",
                "Agility",
                "Damage",
                "Power",
                "Hit Rating",
                "Crit %",
                "Expertise",
                "Armor Pen"                                
            ], 
            right: [            
                "Haste Rating",
                "Armor",
                "Stamina",
                "Defense",
                "Dodge",
                "Parry",
                "Block",
                "Physical Res."                
            ]
        }
    }

    public GetRangedStats (): Record<string, Common.BotStatName[]>{
        return {
            left: [              
                "Strength",
                "Agility",
                "Damage Rng",
                "Speed",
                "Power",
                "Hit Rating",
                "Crit %",                
                "Armor Pen" 
            ],
            right: [
                "Expertise",
                "Haste Rating",
                "Armor",
                "Stamina",
                "Defense",
                "Dodge",
                "Parry",
                "Block",                                
            ]
        }
    }

    public GetCasterStats (): Record<string, Common.BotStatName[]> {
        return {
            left: [
                "Intellect",
                "Spirit",
                "Stamina",
                "Bonus Dmg",
                "Crit %",
                "Hit Rating",                
                "Spell Pen"                
            ],
            right: [
                "Haste Rating",                
                "MP5",
                "Spell Res.", 
                "Dodge",
                "Armor",
                "Parry",                                
            ]
        }
    }

    public GetStatMappings() {        

        switch(this.talentSpecId) {
            case Common.TalentSpecs.WARRIOR_ARMS:
            case Common.TalentSpecs.WARRIOR_FURY:
            case Common.TalentSpecs.WARRIOR_PROTECTION:
            case Common.TalentSpecs.PALADIN_PROTECTION:
            case Common.TalentSpecs.PALADIN_RETRIBUTION:
            case Common.TalentSpecs.DK_BLOOD:
            case Common.TalentSpecs.DK_FROST:
            case Common.TalentSpecs.DK_UNHOLY:
            case Common.TalentSpecs.ROGUE_ASSASSINATION:
            case Common.TalentSpecs.ROGUE_COMBAT:
            case Common.TalentSpecs.ROGUE_SUBTLETY:
            case Common.TalentSpecs.SHAMAN_ENHANCEMENT:
            case Common.TalentSpecs.DRUID_FERAL:
                return this.GetMeleeStats();                
            
            case Common.TalentSpecs.HUNTER_SURVIVAL:
            case Common.TalentSpecs.HUNTER_MARKSMANSHIP:
            case Common.TalentSpecs.HUNTER_BEASTMASTERY:
                return this.GetRangedStats();                

            case Common.TalentSpecs.MAGE_ARCANE:
            case Common.TalentSpecs.MAGE_FIRE:
            case Common.TalentSpecs.MAGE_FROST:
            case Common.TalentSpecs.WARLOCK_AFFLICTION:
            case Common.TalentSpecs.WARLOCK_DEMONOLOGY:
            case Common.TalentSpecs.WARLOCK_DESTRUCTION:
            case Common.TalentSpecs.PRIEST_DISCIPLINE:
            case Common.TalentSpecs.PRIEST_HOLY:
            case Common.TalentSpecs.PRIEST_SHADOW:
            case Common.TalentSpecs.SHAMAN_ELEMENTAL:
            case Common.TalentSpecs.SHAMAN_RESTORATION:
            case Common.TalentSpecs.DRUID_BALANCE:
            case Common.TalentSpecs.DRUID_RESTORATION:
                return this.GetCasterStats();                

            default:
                print(`Unknown Talent Spec: ${this.talentSpecId}`);                            
        }
    }

    public talentSpecName() {
        // print(`Talent Spec: ${this.talentSpecId}`);
        const keys = Object.keys(Common.TalentSpecs);
        for(let i=0; i < keys.length; i++) {
            if(Common.TalentSpecs[keys[i]] === this.talentSpecId) {
                return keys[i];
            }
        }
    }   

    private _lookupEquipment(): EquipmentList {
        const myEquipment = {} as EquipmentList;
        for(let slot=0; slot <= Common.BotEquipLast; slot++) {
            const equipment = this.myself.GetBotEquipment(<BotEquipmentSlotNum>slot);
            
            if(equipment) {            
                myEquipment[slot] =  {
                    entry: equipment.GetEntry(),
                    link: equipment.GetItemLink(),
                    quality: <Common.QualityType>equipment.GetQuality(),
                    itemLevel: equipment.GetItemLevel(),
                    enchantmentId: equipment.GetEnchantmentId(0),  // Only the permenant enchantments
                }                     
            } else {
               myEquipment[slot] = undefined;
            }                
        }

        return myEquipment;
    }

    private _lookupStats(panel: 'left' | 'right'): Record<string, string>[] {        
        const statMappings = this.GetStatMappings();
        const classStats: Record<string, string>[] = []

        for(let stat = 0; stat < statMappings[panel].length; stat++) {
            const statName = statMappings[panel][stat];
            let statValue = this.allStats[statName];
            const statRecord= {};  

            // skip offhand stats will be handled with main hand
            if(statName === 'Dmg Off') {
                continue;
            }

            // handle some special cases for stats 
            if(statName === 'Damage') {                                
                statRecord[statName] = statValue;
                classStats.push(statRecord); 

                // Go ahead and add dual wield damage also
                if(this.isDualWield()) {                    
                    //statRecord['Dmg Off'] = statValue; 
                    //classStats.push(statRecord);                    
                }
                continue; 
            }
            
            if(this.isHealer() && statName === 'Bonus Dmg') {
                statRecord['Bonus Heals'] = statValue;
                classStats.push(statRecord);
                // print(`Stat: Bonus Heals = ${statValue}`);
                continue; 
            }

            if(statName && statValue) {
                statRecord[statName] = statValue;
                classStats.push(statRecord);
                // print(`Stat: ${statName} = ${statValue}`);
            } else {
                // print("failed to get stat: " + statName); 
            }
                        
        }

        return classStats; 
    }

    private parseStats(botdump: string) {
        const stats = botdump.split('\n');     
        for(let i=0; i<stats.length; i++) {
            const parts = stats[i].split(':');

            if(parts[0] == "Resistance") {                    
                parts[0] = parts[0] + ":" + parts[1];                 
                this.allStats[parts[0]] = parts[2];                                
                continue; 
            }            

            if(!Common.BotStatLabel[parts[0]]) {                
                continue;
            }

            parts[1] = parts[1].replace("(-0.00 pct)", ""); 
            parts[1] = parts[1].replace("pct", "%").trim();
            parts[1] = parts[1].replace("+", "");

            const statName = Common.BotStatLabel[parts[0]];
            if(statName == "Damage" || statName == "Dmg Off" || statName == "Damage Rng") {
                parts[1] = parts[2].split(",")[0].trim() + "-" + parts[3].trim();  
                
            }

            if(statName == "Physical Res." || statName == "Spell Res.") { 
                const value = parseFloat(parts[1]);
                if(value === 1) {
                    parts[1] = "0.00%";
                }
                parts[1] = ((1 - value) * 100) + ".00%"; 
                
            }

            if(statName == "Expertise") {
                parts[1] = parts[1].trim().split(" ")[0]; 
            }

            if(statName == "Dodge" || statName == "Parry" || statName == "Block" || 
            statName == "Crit %" ) {
                parts[1] = parts[1].trim() + "%";
            }

            if(statName == "Strength" || statName == "Agility" || statName == "Intellect" || 
            statName == "Spirit" || statName == "Stamina") {
                parts[1] = "" + Math.round(parseInt(parts[1]));
            }

            this.allStats[statName] = parts[1].trim().replace(" %", "%");   
            // print("Parsed Stat: " + statName + " = " + parts[1]);                 
        }        
    }
}
```