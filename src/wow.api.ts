import { isReturnStatement } from "typescript"

Here is an example of how to convert TypeScript Class definitions into 
readme documentation in a consistent format based on how it will be used 
to build AIO plugins which is similar to World of Warcraft AddOns, which reference 
the World of Warcraft API that can be found here: https://wowpedia.fandom.com/wiki/World_of_Warcraft_API


    /**
     * This is another abstract object type that groups together a number of font related methods that are used by multiple other widget types.
     * This doesn't have a direct correlation to a UI object. See FontInstance object information for details.
     */
    interface FontInstance extends UIObject {

      /**
       * Returns detailed information on a font object.
       * @returns MultipleReturnValues:
       *  - **fontName**: Path to font file
       *  - **fontHeight**: Font height in pixels. Due to internal graphics engine workings, this will be ridiculously close to an integer number,
       *  but not quite ever fully.
       *  - **fontFlags**: See FontInstance:SetFont().
       * @tupleReturn
       */
      GetFont(): [string, number, string];

      /**
       * Gets the text color of of a Font Instance.
       * @return MultipleReturnValues:
       *  r: The red color
       *  g: The green color
       *  b: The blue color
       *  a?: the alpha (opacity)
       * @tupleReturn
       */
      GetTextColor(): [number, number, number, number?];

      /**
       * The function is used to set the font to use for displaying text.
       *
       * @param font path to the font file, relative to the WoW base directory.
       * @param size size in points.
       * @param flags any comma-delimited combination of "OUTLINE", "THICKOUTLINE" and "MONOCHROME".
       */
      SetFont(font: string, size: number, flags?: FontInstanceFlags): void;

      /**
       * Sets horizontal text justification
       *
       * @param align the new align
       */
      SetJustifyH(align: HorizontalAlign): void;

      /**
       * Sets vertical text justification
       *
       * @param align the new align
       */
      SetJustifyV(align: VerticalAlign): void;

      /**
       * Sets the default text color.
       *
       * @param r red color
       * @param g green color
       * @param b blue color
       * @param a alpha (opacity)
       */
      SetTextColor(r: number, g: number, b: number, a?: number): void;
  }
## GetFont
This will return detailed information about the current font instanceof. 

### Parameters
None

### Returns
**fontName** string - Path to font file
**fontHeight** number - Font height in pixels. Due to internal graphics engine workings, this will be ridiculously close to an integer number, but not quite ever fully
**fontFlags** atring - string - Any comma-delimited combination of OUTLINE, THICK and MONOCHROME; otherwise must be at least an empty string (except for FontString objects).

### Example Usage:  
Get the font information for the current font instance.
```typescript
const myfont = CreateFont("Fonts\\FRIZQT__.TTF", 12, "OUTLINE");

const [fontName, height, flags] = myfont.GetFont();
const text = myFrame.CreateFontString(myId, "OVERLAY", myfont);
text.SetText("Hello, World!");

```
## SetFont
This will change the font details on an existing font instance.

### Parameters <hr />
**fontName** string - Path to font file
**fontHeight** number - Font height in pixels. Due to internal graphics engine workings, this will be ridiculously close to an integer number, but not quite ever fully
**fontFlags** atring - string - Any comma-delimited combination of OUTLINE, THICK and MONOCHROME; otherwise must be at least an empty string (except for FontString objects).

### Example Usage:
```typescript 
const myfont = CreateFont("Fonts\\FRIZQT__.TTF", 12, "OUTLINE");
myFont.SetFont("Fonts\\Arial.TTF", 10, "OUTLINE");

const [fontName, height, flags] = myfont.GetFont();
const text = myFrame.CreateFontString(myId, "OVERLAY", myfont);
text.SetText("I am Arial now!");
```
