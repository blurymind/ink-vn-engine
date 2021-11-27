import { Canvas } from "../canvas";
import { Loader } from "../loader";
import { Point } from "../point";
import { Layer } from "./layers";

class Character extends Layer {
    private anchor : string | undefined;
    private position : Point;
    private sprite : ImageBitmap;
    private spriteURL : string;

    constructor(spriteURL : string, anchor : string | undefined) {
        super();

        this.anchor = anchor;
        this.Sprite = spriteURL;
    }

    set Sprite(spriteURL : string) {
        if (spriteURL !== this.spriteURL) {
            this.spriteURL = spriteURL;
            Loader.LoadImage(spriteURL).then(image => this.sprite = image);
        }
    }

    Draw(canvas : Canvas) : void {
        if (this.sprite != null) {
            if (this.position == null) {
                let x = (canvas.Size.X / 2 ) - (this.sprite.width / 2);
                if (this.anchor) {
                    x = this.anchor === "left" ? 0 : canvas.Size.X - this.sprite.width;
                }
                this.position = new Point(
                    x,
                    canvas.Size.Y - this.sprite.height
                );
            }

            canvas.DrawImage(this.sprite, this.position);
        }
    }
}

export class Characters extends Layer {
    private characters : Character[] = [];

    constructor() {
        super();
    }

    Add(spriteURL : string, canvas : Canvas) {
        // For now just handle one character at a time
        if (this.characters.length > 0) {
            this.characters = [];
        }
        const characterData =  spriteURL.split(" at ");
        this.characters.push(new Character(spriteURL, characterData.length > 1 ? characterData[1] : undefined));
    }

    Draw(canvas : Canvas) : void {
        for (const character of this.characters) {
            character.Draw(canvas);
        }
    }

    Remove() {
        this.characters = [];
    }
}
