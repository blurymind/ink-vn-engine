import { Choice } from "inkjs";
import { Canvas } from "../canvas";
import { IRect, Point } from "../point";
import { BoxBackground, BoxBackgroundFactory, BoxBackgroundTypes } from "./boxbackgrounds";
import {Characters, GameplayLayer} from "./layers";

class ChoiceBox {
    private boxBackground : BoxBackground;
    private fontSize : number = 24;
    private hasAlreadyBeenDrawnOnce : boolean = false;
    public id : number;
    private innerMargin : Point = new Point(0, 20);
    private position : Point;
    private size : Point;
    private text : string;
    private image? : ImageBitmap;
    private hoverImage? : ImageBitmap;
    public isHovered: boolean;

    constructor(id : number, text : string, width : number, position : Point, image? : ImageBitmap, hoverImage? : ImageBitmap) {
        this.id = id;
        this.text = text;

        this.size = new Point(width, (this.fontSize * 1.42857) + (2 * this.innerMargin.Y));
        if (image) {
            this.image = image;
            this.size = new Point(image.width, image.height);
        }
        this.hoverImage = hoverImage;

        this.position = position;
        this.isHovered = false;
        this.boxBackground = BoxBackgroundFactory.Create(BoxBackgroundTypes.COLOR, "rgba(0, 0, 0, .7)", this.size, this.position);
    }

    get Id() : number {
        return this.id;
    }

    get BoundingRect() : IRect {
        return {
            Position : this.position,
            Size : this.size
        };
    }

    Draw(canvas : Canvas) : void {
        if (!this.hasAlreadyBeenDrawnOnce) {
            this.beforeFirstDraw(canvas);
        }

        if (!this.image) {
            this.boxBackground.Draw(canvas);
            canvas.DrawText(this.text, this.position.Add(this.innerMargin), this.isHovered ? "yellow" : "white", this.fontSize, this.size.X);
        } else {
            canvas.DrawImage(this.hoverImage && this.isHovered ? this.hoverImage : this.image, this.position);
        }
    }

    private beforeFirstDraw(canvas : Canvas) : void {
        canvas.DrawText0("", "transparent", this.fontSize);
        this.innerMargin.X = (this.size.X - canvas.MeasureTextWidth(this.text)) / 2;
    }
}

export class ChoiceLayer extends GameplayLayer {
    choices : Choice[] = [];
    private boundingRect : Point;
    private choiceBoxes : ChoiceBox[] = [];
    private isMouseOnChoice : ChoiceBox = null;
    private screenSize : Point;
    private translation : Point;

    constructor(screenSize : Point) {
        super();
        this.choiceBoxes = [];
        this.translation = new Point(0, 0 );
        this.screenSize = screenSize;
    }

    set Choices(choices : Choice[]) {
        this.choices = choices;

        this.choiceBoxes = [];
        const width = 200;
        const position = new Point(0, 0);
        for (const _choice of this.choices) {
            const newChoice = new ChoiceBox(_choice.index, _choice.text, width, position.Clone());
            this.choiceBoxes.push(newChoice);
            position.Y += newChoice.BoundingRect.Size.Y + 40;
        }
        this.boundingRect = new Point(width, position.Y - 40);
        this.translation = this.screenSize.Div(new Point(2)).Sub(this.boundingRect.Div(new Point(2)));
    }

    AddButton(characters : Characters, button : Choice) {
        // add image to each box
        const rectImage = characters.GetImage(button.text, "default");
        const rectImageHover = characters.GetImage(button.text, "hover");
        this.choices.push(button);
        // Todo add support for percent if % in values?
        const newButton = new ChoiceBox(button.knot, button.text, 200, button.position, rectImage, rectImageHover);
        this.choiceBoxes.push(newButton);
    }

    ClearButtons(){
        this.choices = [];
        this.choiceBoxes = [];
    }

    Draw(canvas : Canvas) : void {
        canvas.Translate(this.translation);
        for (const choiceBox of this.choiceBoxes) {
            choiceBox.Draw(canvas);
        }
        canvas.Restore();
    }

    MouseClick(clickPosition : Point, action : Function) : void {
        for (const choiceBox of this.choiceBoxes) {
            const boundingRect = choiceBox.BoundingRect;
            boundingRect.Position = boundingRect.Position.Add(this.translation);
            if (clickPosition.IsInRect(boundingRect)) {
                action(choiceBox.Id);
                break;
            }
        }
    }

    MouseMove(mousePosition : Point) : (_ : Canvas) => void {
        mousePosition = mousePosition.Sub(this.translation);
        if (this.isMouseOnChoice != null) {
            return mousePosition.IsInRect(this.isMouseOnChoice.BoundingRect) ? null : (canvas : Canvas) => {
                canvas.SetCursor("default");
                this.isMouseOnChoice = null;
            };
        } else {
            for (const choice of this.choiceBoxes) {
                choice.isHovered = false;
                if (choice.id && mousePosition.IsInRect(choice.BoundingRect)) {
                    return (canvas : Canvas) => {
                        this.isMouseOnChoice = choice;
                        canvas.SetCursor("pointer");
                        choice.isHovered = true;
                    };
                }
            }
        }
        return null;
    }

    Step(delta : number) : void { }
}
