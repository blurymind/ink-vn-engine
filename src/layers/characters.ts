import { Canvas } from "../canvas";
import { Loader } from "../loader";
import { Point } from "../point";
import { Layer } from "./layers";

class Character extends Layer {
    private anchor : string | undefined; // current anchor
    private currentState : string;
    private position : Point; // current position
    private show : boolean; // currently visible
    private sprites : {[currentState : string] : ImageBitmap}; // loaded state sprites

    constructor() {
        super();
        this.currentState = "default";
        this.sprites = {};
        this.show = false;
    }

    Image(spriteURL : string, spriteKey : string) {
        Loader.LoadImage(spriteURL).then(image => this.sprites[spriteKey] = image);
    }

    Show(spriteKey : string, anchor : string) {
        this.show = true;
        this.currentState = spriteKey;
        this.anchor = anchor;
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
        let x = (canvas.Size.X / 2 ) - (sprite.width / 2);
        if (this.anchor) {
            x = this.anchor === "left" ? 0 : canvas.Size.X - sprite.width;
        }
        this.position = new Point(
            x,
            canvas.Size.Y - sprite.height
        );

        canvas.DrawImage(sprite, this.position);
        }
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

    Show(spriteWithParams : string) {
        const characterData =  spriteWithParams.split(" ");
        // # show: anya happy [left]
        this.characters[characterData[0]].Show(characterData[1], characterData[2])
    }

    Hide(spriteWithParams : string) {
        const characterData =  spriteWithParams.split(" ");
        this.characters[characterData[0]].Hide()
    }

    HideAll() {
        for (const character in this.characters) {
            this.characters[character].Hide()
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
