import { Canvas } from "../canvas";
import { Loader } from "../loader";
import { Point } from "../point";
import { Layer } from "./layers";

class Character extends Layer {
    private sprites : {[currentState : string] : ImageBitmap}; // loaded state sprites
    private anchor : string | Point; // current anchor
    private currentState : string;
    private position : Point; // current position
    private show : boolean; // currently visible

    constructor() {
        super();
        this.currentState = "default";
        this.sprites = {};
        this.show = false;
    }

    Image(spriteURL : string, spriteKey : string) {
        Loader.LoadImage(spriteURL).then(image => this.sprites[spriteKey] = image);
    }

    Show(spriteKey : string, anchor : string | Point) {
        this.show = true;
        this.currentState = spriteKey;
        if (anchor) {
            this.anchor = anchor;
        }
    }

    Hide() {
        this.show = false;
    }

    Draw(canvas : Canvas) : void {
        if (!this.show) {
            return;
        }
        const sprite = this.sprites[this.currentState];
        if (sprite != null) {
        let x : number;
        let y = canvas.Size.Y - sprite.height;
        if (typeof this.anchor === "string") { // left/right/etc
            x = (canvas.Size.X / 2 ) - (sprite.width / 2);// default to centre
            if (this.anchor === "left" || this.anchor === "right") {
                x = this.anchor === "left" ? 0 : canvas.Size.X - sprite.width;
            }
        } else {
            x = this.anchor.X;
            y = this.anchor.Y;
        }
        this.position = new Point(
            x,
            y
        );

        canvas.DrawImage(sprite, this.position);
        }
    }

    GetImage(spriteState : string) : ImageBitmap | undefined {
        console.log(this.sprites, spriteState,"---")
        if (spriteState in this.sprites) {
            const sprite = this.sprites[spriteState];
            console.log("SPRITE ===> ", sprite)
            return sprite;
        }
        return undefined;
    }
}

export class Characters extends Layer {
    private characters : { [a : string] : Character } = {};

    constructor() {
        super();
    }

    Add(spriteWithParams : string) {
        const characterData =  spriteWithParams.split(" ");
        if (!(characterData[0] in this.characters)) {
            this.characters[characterData[0]] = new Character();
        }
        this.characters[characterData[0]].Image(characterData[2], characterData[1]);
    }

    Show(spriteWithParams : string, position? : Point | undefined) {
        const characterData =  spriteWithParams.split(" ");
        // # show: anya happy [left]
        if (characterData[0] in  this.characters) {
            this.characters[characterData[0]].Show(characterData[1], position || characterData[2]);
        }
    }

    GetImage(spriteName : string, spriteState : string) : ImageBitmap | undefined {
        if (spriteName in  this.characters) {
            console.log("ITS IN", spriteName)
            return this.characters[spriteName].GetImage(spriteState);
        }
        return undefined;
    }

    Hide(spriteWithParams : string) {
        const characterData =  spriteWithParams.split(" ");
        this.characters[characterData[0]].Hide();
    }

    HideAll() {
        for (const character in this.characters) {
            this.characters[character].Hide();
        }
    }

    Draw(canvas : Canvas) : void {
        for (const character in this.characters) {
            this.characters[character].Draw(canvas);
        }
    }

    Remove() {
        this.characters = {};
    }
}
