(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.InkVN = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = exports.AudioFactory = void 0;
const Pizzicato = (typeof window !== "undefined" ? window['Pizzicato'] : typeof global !== "undefined" ? global['Pizzicato'] : null);
class AudioFactory {
    static Create() {
        if (Pizzicato != null) {
            return new PizzicatoAudio();
        }
        else {
            return new DummyAudio();
        }
    }
}
exports.AudioFactory = AudioFactory;
class Audio {
}
exports.Audio = Audio;
class PizzicatoAudio extends Audio {
    PlayBGM(bgmURL) {
        if (bgmURL !== this.bgmURL) {
            this.bgmURL = bgmURL;
            const bgm = new Pizzicato.Sound({
                options: {
                    loop: true,
                    path: bgmURL
                },
                source: "file"
            }, () => {
                if (this.bgm != null) {
                    this.bgm.stop();
                    this.bgm.disconnect();
                }
                bgm.play();
                this.bgm = bgm;
            });
        }
    }
    PlaySFX(sfxURL) {
        const sfx = new Pizzicato.Sound({
            options: { path: sfxURL },
            source: "file"
        }, () => sfx.play());
    }
    StopBGM() {
        if (this.bgm != null) {
            this.bgm.stop();
            this.bgm.disconnect();
            this.bgmURL = null;
            this.bgm = null;
        }
    }
}
class DummyAudio extends Audio {
    PlayBGM(bgmURL) { }
    PlaySFX(sfxURL) { }
    StopBGM() { }
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenCanvas = exports.Canvas = void 0;
const events_1 = require("./events");
const point_1 = require("./point");
class Canvas {
    constructor(containerID, size) {
        this._onClick = new events_1.LiteEvent();
        this._onMove = new events_1.LiteEvent();
        const container = document.getElementById(containerID);
        if (container.tagName === "canvas") {
            this.element = container;
        }
        else {
            this.element = document.createElement("canvas");
            container.appendChild(this.element);
        }
        this.element.width = size.X;
        this.element.height = size.Y;
        this.ctx = this.element.getContext("2d");
        if (!this.ctx) {
        }
        this.element.addEventListener("click", this._click.bind(this));
        this.element.addEventListener("mousemove", this._move.bind(this));
        this.Clear();
    }
    get Size() {
        return new point_1.Point(this.element.width, this.element.height);
    }
    set Size(size) {
        this.element.width = size.X;
        this.element.height = size.Y;
    }
    Clear() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }
    DrawBackgroundImage(image) {
        this.ctx.drawImage(image, 0, 0, this.element.width, this.element.height);
    }
    DrawImage(image, position) {
        this.ctx.drawImage(image, position.X, position.Y, image.width, image.height);
    }
    DrawImageTo(image, source, destination) {
        this.ctx.drawImage(image, source.Position.X, source.Position.Y, source.Size.X, source.Size.Y, destination.Position.X, destination.Position.Y, destination.Size.X, destination.Size.Y);
    }
    DrawRect(position, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(position.X, position.Y, size.X, size.Y);
    }
    DrawRect0(size, color) {
        this.DrawRect(new point_1.Point(), size, color);
    }
    DrawText(text, position, color, fontSize, maxWidth) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.textBaseline = "top";
        this.ctx.fillText(text.replace(/^"(.*)"$/, "$1"), position.X, position.Y, maxWidth);
    }
    DrawText0(text, color, fontSize, maxWidth) {
        this.DrawText(text, new point_1.Point(), color, fontSize, maxWidth);
    }
    GetImageData() {
        return this.ctx.getImageData(0, 0, this.Size.X, this.Size.Y);
    }
    MeasureTextWidth(text) {
        // We measure with the last font used in the context
        return this.ctx.measureText(text).width;
    }
    Restore() {
        this.ctx.restore();
    }
    SetCursor(cursor) {
        this.element.style.cursor = cursor;
    }
    Translate(position) {
        this.Restore();
        this.ctx.save();
        this.ctx.translate(position.X, position.Y);
    }
    get OnClick() {
        return this._onClick.Expose();
    }
    get OnMove() {
        return this._onMove.Expose();
    }
    _click(ev) {
        ev.preventDefault();
        this._onClick.Trigger(this, new point_1.Point(ev.pageX - this.element.offsetLeft, ev.pageY - this.element.offsetTop));
    }
    _move(ev) {
        this._onMove.Trigger(this, new point_1.Point(ev.pageX - this.element.offsetLeft, ev.pageY - this.element.offsetTop));
    }
}
exports.Canvas = Canvas;
class HiddenCanvas extends Canvas {
    constructor(size) {
        const id = `c_${Math.random().toString().slice(2, 7)}`;
        const hiddenElement = document.createElement("div");
        hiddenElement.id = id;
        document.body.appendChild(hiddenElement);
        super(id, size);
        this.hiddenElement = hiddenElement;
    }
    Destroy() {
        this.hiddenElement.remove();
    }
}
exports.HiddenCanvas = HiddenCanvas;

},{"./events":4,"./point":14}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const point_1 = require("./point");
class ClassConfig {
    constructor() {
        this.DefaultTextSpeed = 30;
        this.RootPath = "";
        this.RootPathIsRemote = false;
        this.ScreenSize = new point_1.Point(800, 600);
        this.TextSpeed = this.DefaultTextSpeed; // This is in char per second
    }
    Load(tags) {
        function error(tag) {
            console.error(`Error reading tag: "${tag}"`);
        }
        for (let i = 0; i < tags.length; ++i) {
            let key, value;
            try {
                key = tags[i].split(":")[0].trim();
                value = tags[i].split(":")[1].trim();
            }
            catch (e) {
                if (e instanceof TypeError) {
                    error(tags[i]);
                    continue;
                }
            }
            try {
                switch (key) {
                    case "screen_size":
                    case "screensize": {
                        const size = value.split(/\D+/).map(x => parseInt(x, 10));
                        if (size.length === 2 && !isNaN(size[0]) && !isNaN(size[1])) {
                            this.ScreenSize = new point_1.Point(size[0], size[1]);
                        }
                        else {
                            throw new TypeError();
                        }
                        break;
                    }
                    case "text_speed":
                    case "textspeed": {
                        const speed = parseInt(value, 10);
                        if (!isNaN(speed)) {
                            this.DefaultTextSpeed = this.TextSpeed = speed;
                        }
                        else {
                            throw new TypeError();
                        }
                        break;
                    }
                    case "root_path":
                    case "rootpath": {
                        this.RootPath = value;
                        break;
                    }
                    case "root_path_is_remote":
                    case "rootpathisremote": {
                        this.RootPathIsRemote = value === "true";
                        break;
                    }
                }
            }
            catch (e) {
                if (e instanceof TypeError) {
                    error(tags[i]);
                }
            }
        }
    }
    get TextSpeed() {
        return this.textSpeed;
    }
    set TextSpeed(value) {
        this.textSpeed = value;
        this.textSpeedRatio = 1000.0 / this.textSpeed;
    }
    get TextSpeedRatio() {
        return this.textSpeedRatio;
    }
}
exports.Config = new ClassConfig();

},{"./point":14}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteEvent = void 0;
class LiteEvent {
    constructor() {
        this.handlers = [];
    }
    Expose() {
        return this;
    }
    Off(handler) {
        this.handlers = this.handlers.filter(_handler => _handler !== handler);
    }
    On(handler) {
        this.handlers.push(handler);
    }
    Trigger(sender, args) {
        this.handlers.forEach(handler => handler(sender, args));
    }
}
exports.LiteEvent = LiteEvent;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Background = void 0;
const loader_1 = require("../loader");
const layers_1 = require("./layers");
class Background extends layers_1.Layer {
    constructor(imageURL) {
        super();
        if (imageURL != null) {
            this.BackgroundImage = imageURL;
        }
    }
    set BackgroundImage(imageURL) {
        if (typeof imageURL === "string") {
            if (imageURL !== this.backgroundImageURL) {
                this.backgroundImageURL = imageURL;
                loader_1.Loader.LoadImage(imageURL).then(image => {
                    this.backgroundImage = image;
                });
            }
        }
        else {
            this.backgroundImage = imageURL;
        }
    }
    Draw(canvas) {
        if (this.backgroundImage != null) {
            canvas.DrawBackgroundImage(this.backgroundImage);
        }
    }
}
exports.Background = Background;

},{"../loader":12,"./layers":9}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxBackground = exports.BoxBackgroundFactory = exports.BoxBackgroundTypes = void 0;
const canvas_1 = require("../canvas");
const loader_1 = require("../loader");
const point_1 = require("../point");
const layers_1 = require("./layers");
var BoxBackgroundTypes;
(function (BoxBackgroundTypes) {
    BoxBackgroundTypes[BoxBackgroundTypes["COLOR"] = 0] = "COLOR";
    BoxBackgroundTypes[BoxBackgroundTypes["NINEPATCH"] = 1] = "NINEPATCH";
    BoxBackgroundTypes[BoxBackgroundTypes["STRETCH"] = 2] = "STRETCH";
})(BoxBackgroundTypes = exports.BoxBackgroundTypes || (exports.BoxBackgroundTypes = {}));
class ClassBoxBackgroundFactory {
    Create(type, background, size, position) {
        switch (type) {
            case BoxBackgroundTypes.COLOR: {
                return new ColoredBoxBackground(background, size, position);
            }
            case BoxBackgroundTypes.NINEPATCH: {
                return new NinePatchBoxBackground(background, size, position);
            }
            case BoxBackgroundTypes.STRETCH: {
                return new StretchBoxBackground(background, size, position);
            }
        }
    }
}
exports.BoxBackgroundFactory = new ClassBoxBackgroundFactory();
class BoxBackground extends layers_1.Layer {
    constructor(size, position) {
        super();
        this.box = {
            Position: position == null ? new point_1.Point() : position,
            Size: size
        };
    }
    set Position(position) {
        this.box.Position = position;
    }
    set Size(size) {
        this.box.Size = size;
    }
}
exports.BoxBackground = BoxBackground;
class ColoredBoxBackground extends BoxBackground {
    constructor(color, size, position) {
        super(size, position);
        this.Color = color;
    }
    Draw(canvas) {
        canvas.DrawRect(this.box.Position, this.box.Size, this.Color);
    }
}
class NinePatchBoxBackground extends BoxBackground {
    constructor(ninePatchURL, size, position) {
        super(size, position);
        this.NinePatch = ninePatchURL;
    }
    set NinePatch(ninePatchURL) {
        if (ninePatchURL !== this.ninePatchURL) {
            this.ninePatchURL = ninePatchURL;
            loader_1.Loader.LoadImage(ninePatchURL)
                .then(image => {
                const hiddenCanvas = new canvas_1.HiddenCanvas(this.box.Size.Clone());
                const patchSize = new point_1.Point(image.width / 3, image.height / 3);
                function drawPatchTo(patchPosition, destPos, destSize) {
                    hiddenCanvas.DrawImageTo(image, { Position: patchPosition, Size: patchSize }, { Position: destPos, Size: destSize != null ? destSize : patchSize });
                }
                const patchDestinations = [
                    new point_1.Point(), new point_1.Point(this.box.Size.X - patchSize.X, 0),
                    new point_1.Point(0, this.box.Size.Y - patchSize.Y),
                    new point_1.Point(this.box.Size.X - patchSize.X, this.box.Size.Y - patchSize.Y)
                ];
                drawPatchTo(new point_1.Point(), patchDestinations[0]); // Upper Left
                drawPatchTo(patchSize.Mult(new point_1.Point(2, 0)), patchDestinations[1]); // Upper Right
                drawPatchTo(patchSize.Mult(new point_1.Point(0, 2)), patchDestinations[2]); // Lower Left
                drawPatchTo(patchSize.Mult(new point_1.Point(2, 2)), patchDestinations[3]); // Lower Right
                drawPatchTo(patchSize.Mult(new point_1.Point(1, 0)), patchSize.Mult(new point_1.Point(1, 0)), new point_1.Point(this.box.Size.X - (patchSize.X * 2), patchSize.Y)); // Top
                drawPatchTo(patchSize.Mult(new point_1.Point(2, 1)), patchDestinations[1].Add(new point_1.Point(0, patchSize.Y)), new point_1.Point(patchSize.X, this.box.Size.Y - (patchSize.Y * 2))); // Right
                drawPatchTo(patchSize.Mult(new point_1.Point(1, 2)), patchDestinations[2].Add(new point_1.Point(patchSize.X, 0)), new point_1.Point(this.box.Size.X - (patchSize.X * 2), patchSize.Y)); // Bottom
                drawPatchTo(patchSize.Mult(new point_1.Point(0, 1)), patchSize.Mult(new point_1.Point(0, 1)), new point_1.Point(patchSize.X, this.box.Size.Y - (patchSize.Y * 2))); // Left
                drawPatchTo(patchSize.Mult(new point_1.Point(1, 1)), patchSize.Mult(new point_1.Point(1, 1)), this.box.Size.Sub(patchSize.Mult(new point_1.Point(2, 2)))); // Center
                createImageBitmap(hiddenCanvas.GetImageData()).then(ninePatchImage => {
                    this.ninePatch = ninePatchImage;
                    // hiddenCanvas.Destroy();
                });
            });
        }
    }
    Draw(canvas) {
        if (this.ninePatch != null) {
            canvas.DrawImage(this.ninePatch, this.box.Position);
        }
    }
}
class StretchBoxBackground extends BoxBackground {
    constructor(imageURL, size, position) {
        super(size, position);
        this.Image = imageURL;
    }
    set Image(imageURL) {
        if (imageURL !== this.imageURL) {
            this.imageURL = imageURL;
            loader_1.Loader.LoadImage(imageURL)
                .then(image => {
                this.image = image;
                this.imageSize = new point_1.Point(this.image.width, this.image.height);
            });
        }
    }
    Draw(canvas) {
        if (this.image != null) {
            canvas.DrawImageTo(this.image, { Position: new point_1.Point(), Size: this.imageSize }, { Position: this.box.Position, Size: this.box.Size });
        }
    }
}

},{"../canvas":2,"../loader":12,"../point":14,"./layers":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Characters = void 0;
const loader_1 = require("../loader");
const point_1 = require("../point");
const layers_1 = require("./layers");
class Character extends layers_1.Layer {
    constructor() {
        super();
        this.currentState = "default";
        this.sprites = {};
        this.show = false;
    }
    Image(spriteURL, spriteKey) {
        loader_1.Loader.LoadImage(spriteURL).then(image => this.sprites[spriteKey] = image);
    }
    Show(spriteKey, anchor) {
        this.show = true;
        this.currentState = spriteKey;
        if (anchor) {
            this.anchor = anchor;
        }
    }
    Hide() {
        this.show = false;
    }
    Draw(canvas) {
        if (!this.show) {
            return;
        }
        const sprite = this.sprites[this.currentState];
        if (sprite != null) {
            let x;
            let y = canvas.Size.Y - sprite.height;
            if (typeof this.anchor === "string") { // left/right/etc
                x = (canvas.Size.X / 2) - (sprite.width / 2); // default to centre
                if (this.anchor === "left" || this.anchor === "right") {
                    x = this.anchor === "left" ? 0 : canvas.Size.X - sprite.width;
                }
            }
            else {
                x = this.anchor.X;
                y = this.anchor.Y;
            }
            this.position = new point_1.Point(x, y);
            canvas.DrawImage(sprite, this.position);
        }
    }
    GetImage(spriteState) {
        console.log(this.sprites, spriteState, "---");
        if (spriteState in this.sprites) {
            const sprite = this.sprites[spriteState];
            console.log("SPRITE ===> ", sprite);
            return sprite;
        }
        return undefined;
    }
}
class Characters extends layers_1.Layer {
    constructor() {
        super();
        this.characters = {};
    }
    Add(spriteWithParams) {
        const characterData = spriteWithParams.split(" ");
        if (!(characterData[0] in this.characters)) {
            this.characters[characterData[0]] = new Character();
        }
        this.characters[characterData[0]].Image(characterData[2], characterData[1]);
    }
    Show(spriteWithParams, position) {
        const characterData = spriteWithParams.split(" ");
        // # show: anya happy [left]
        if (characterData[0] in this.characters) {
            this.characters[characterData[0]].Show(characterData[1], position || characterData[2]);
        }
    }
    GetImage(spriteName, spriteState) {
        if (spriteName in this.characters) {
            console.log("ITS IN", spriteName);
            return this.characters[spriteName].GetImage(spriteState);
        }
        return undefined;
    }
    Hide(spriteWithParams) {
        const characterData = spriteWithParams.split(" ");
        this.characters[characterData[0]].Hide();
    }
    HideAll() {
        for (const character in this.characters) {
            this.characters[character].Hide();
        }
    }
    Draw(canvas) {
        for (const character in this.characters) {
            this.characters[character].Draw(canvas);
        }
    }
    Remove() {
        this.characters = {};
    }
}
exports.Characters = Characters;

},{"../loader":12,"../point":14,"./layers":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceLayer = void 0;
const point_1 = require("../point");
const boxbackgrounds_1 = require("./boxbackgrounds");
const layers_1 = require("./layers");
class ChoiceBox {
    constructor(id, text, width, position, image, hoverImage) {
        this.fontSize = 24;
        this.hasAlreadyBeenDrawnOnce = false;
        this.innerMargin = new point_1.Point(0, 20);
        this.id = id;
        this.text = text;
        this.size = new point_1.Point(width, (this.fontSize * 1.42857) + (2 * this.innerMargin.Y));
        if (image) {
            this.image = image;
            this.size = new point_1.Point(image.width, image.height);
        }
        this.hoverImage = hoverImage;
        this.position = position;
        this.isHovered = false;
        this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(boxbackgrounds_1.BoxBackgroundTypes.COLOR, "rgba(0, 0, 0, .7)", this.size, this.position);
    }
    get Id() {
        return this.id;
    }
    get BoundingRect() {
        return {
            Position: this.position,
            Size: this.size
        };
    }
    Draw(canvas) {
        if (!this.hasAlreadyBeenDrawnOnce) {
            this.beforeFirstDraw(canvas);
        }
        if (!this.image) {
            this.boxBackground.Draw(canvas);
            canvas.DrawText(this.text, this.position.Add(this.innerMargin), this.isHovered ? "yellow" : "white", this.fontSize, this.size.X);
        }
        else {
            canvas.DrawImage(this.hoverImage && this.isHovered ? this.hoverImage : this.image, this.position);
        }
    }
    beforeFirstDraw(canvas) {
        canvas.DrawText0("", "transparent", this.fontSize);
        this.innerMargin.X = (this.size.X - canvas.MeasureTextWidth(this.text)) / 2;
    }
}
class ChoiceLayer extends layers_1.GameplayLayer {
    // if name is overview, hide during choices or dialogue with characters
    constructor(screenSize) {
        super();
        this.choices = [];
        this.choiceBoxes = [];
        this.isMouseOnChoice = null;
        this.choiceBoxes = [];
        this.translation = new point_1.Point(0, 0);
        this.screenSize = screenSize;
        this.visible = true;
    }
    set Choices(choices) {
        this.choices = choices;
        this.choiceBoxes = [];
        const width = 200;
        const position = new point_1.Point(0, 0);
        for (const _choice of this.choices) {
            const newChoice = new ChoiceBox(_choice.index, _choice.text, width, position.Clone());
            this.choiceBoxes.push(newChoice);
            position.Y += newChoice.BoundingRect.Size.Y + 40;
        }
        this.boundingRect = new point_1.Point(width, position.Y - 40);
        this.translation = this.screenSize.Div(new point_1.Point(2)).Sub(this.boundingRect.Div(new point_1.Point(2)));
    }
    AddButton(characters, button) {
        // add image to each box
        const rectImage = characters.GetImage(button.text, "default");
        const rectImageHover = characters.GetImage(button.text, "hover");
        this.choices.push(button);
        // Todo add support for percent if % in values?
        const newButton = new ChoiceBox(button.knot, button.text, 200, button.position, rectImage, rectImageHover);
        this.choiceBoxes.push(newButton);
    }
    ClearButtons() {
        this.choices = [];
        this.choiceBoxes = [];
    }
    Draw(canvas) {
        if (!this.visible)
            return;
        canvas.Translate(this.translation);
        for (const choiceBox of this.choiceBoxes) {
            choiceBox.Draw(canvas);
        }
        canvas.Restore();
    }
    MouseClick(clickPosition, action) {
        if (!this.visible)
            return;
        for (const choiceBox of this.choiceBoxes) {
            const boundingRect = choiceBox.BoundingRect;
            boundingRect.Position = boundingRect.Position.Add(this.translation);
            if (clickPosition.IsInRect(boundingRect)) {
                action(choiceBox.Id);
                break;
            }
        }
    }
    MouseMove(mousePosition) {
        if (!this.visible)
            return;
        mousePosition = mousePosition.Sub(this.translation);
        if (this.isMouseOnChoice != null) {
            return mousePosition.IsInRect(this.isMouseOnChoice.BoundingRect) ? null : (canvas) => {
                canvas.SetCursor("default");
                this.isMouseOnChoice = null;
            };
        }
        else {
            for (const choice of this.choiceBoxes) {
                choice.isHovered = false;
                if (choice.id !== null && mousePosition.IsInRect(choice.BoundingRect)) {
                    return (canvas) => {
                        this.isMouseOnChoice = choice;
                        canvas.SetCursor("pointer");
                        choice.isHovered = true;
                    };
                }
            }
        }
        return null;
    }
    Step(delta) { }
}
exports.ChoiceLayer = ChoiceLayer;

},{"../point":14,"./boxbackgrounds":6,"./layers":9}],9:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameplayLayer = exports.StepLayer = exports.Layer = void 0;
class Layer {
}
exports.Layer = Layer;
class StepLayer extends Layer {
}
exports.StepLayer = StepLayer;
class GameplayLayer extends StepLayer {
}
exports.GameplayLayer = GameplayLayer;
__exportStar(require("./background"), exports);
__exportStar(require("./characters"), exports);
__exportStar(require("./choicelayer"), exports);
__exportStar(require("./speechlayer"), exports);
__exportStar(require("./transition"), exports);

},{"./background":5,"./characters":7,"./choicelayer":8,"./speechlayer":10,"./transition":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechLayer = void 0;
const point_1 = require("../point");
const boxbackgrounds_1 = require("./boxbackgrounds");
const layers_1 = require("./layers");
const config_1 = require("../config");
const REWRAP_THIS_LINE = "<[{REWRAP_THIS_LINE}]>";
class SpeechBox {
    constructor(position, size, configuration) {
        this.textLines = [""];
        this.position = position.Clone();
        this.size = size.Clone();
        this.innerMargin = configuration.InnerMargin;
        this.innerSize = this.size.Sub(this.innerMargin.Mult(new point_1.Point(2)));
        if (this.textLines.length > 0) {
            this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(configuration.BackgroundType, configuration.Background, this.size.Clone());
        }
        this.fontSize = configuration.FontSize;
        this.fontColor = configuration.FontColor;
    }
    get Text() {
        return this.textLines.join(" ");
    }
    set Text(text) {
        const _text = this.Text;
        if (text.indexOf(_text) === 0) {
            const slice = text.slice(_text.length);
            this.textLines[this.textLines.length - 1] += slice;
            if (slice.length > 1) {
                this.nextWord = REWRAP_THIS_LINE;
            }
        }
        else {
            this.textLines = [text];
        }
    }
    set NextWord(nextWord) {
        this.nextWord = nextWord;
    }
    Draw(canvas) {
        var _a;
        canvas.Translate(this.position);
        (_a = this.boxBackground) === null || _a === void 0 ? void 0 : _a.Draw(canvas);
        canvas.Translate(this.position.Add(this.innerMargin));
        if (this.nextWord != null) {
            this.doTheWrap(canvas);
            this.nextWord = null;
        }
        for (let i = 0; i < this.textLines.length; ++i) {
            canvas.DrawText(this.textLines[i], new point_1.Point(0, i * (this.fontSize * 1.42857)), // This is the golden ratio, on line-height and font-size
            this.fontColor, this.fontSize, this.innerSize.X);
        }
        canvas.Restore();
    }
    doTheWrap(canvas) {
        canvas.DrawText0("", "transparent", this.fontSize);
        const comp = (line) => canvas.MeasureTextWidth(line) > this.innerSize.X;
        let lastLine = this.textLines[this.textLines.length - 1];
        if (this.nextWord === REWRAP_THIS_LINE) {
            // Need to wrap the fuck out of this line
            while (comp(lastLine)) {
                // Get to the char where we're outside the boudaries
                let n = 0;
                while (!comp(lastLine.slice(0, n))) {
                    ++n;
                }
                // Get the previous space
                while (lastLine[n] !== " " && n >= 0) {
                    --n;
                }
                if (n === 0) {
                    break;
                } // We can't wrap more
                // Append, update last line, and back in the loop
                this.textLines.push(lastLine.slice(n + 1)); // +1 because we don't want the space
                this.textLines[this.textLines.length - 2] = lastLine.slice(0, n);
                lastLine = this.textLines[this.textLines.length - 1];
            }
        }
        else {
            if (comp(lastLine + this.nextWord)) {
                this.textLines[this.textLines.length - 1] = lastLine.slice(0, lastLine.length - 1);
                this.textLines.push("");
            }
        }
    }
}
class NameBox {
    constructor(position, configuration, name) {
        this.backgroundURL = "images/9patch-small.png";
        this.size = new point_1.Point(configuration.Width, configuration.Height);
        this.position = position.Clone();
        this.position.Y -= this.size.Y;
        this.innerMargin = this.size.Div(new point_1.Point(10, 10));
        this.fontSize = configuration.FontSize;
        this.fontColor = configuration.FontColor;
        this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(configuration.BackgroundType, configuration.Background, this.size.Clone());
    }
    set Name(name) {
        if (name !== this.name) {
            this.name = name;
        }
    }
    Draw(canvas) {
        if (this.name.length > 0) {
            canvas.Translate(this.position);
            this.boxBackground.Draw(canvas);
            canvas.DrawText(this.name, this.innerMargin, this.fontColor, this.fontSize, this.size.X);
            canvas.Restore();
        }
    }
}
class SpeechLayer extends layers_1.GameplayLayer {
    constructor(screenSize, speechBoxConfiguration) {
        super();
        this.textAppeared = false;
        this.textTime = 0;
        const textBoxSize = new point_1.Point(screenSize.X - (speechBoxConfiguration.OuterMargin.X * 2), speechBoxConfiguration.Height);
        const textBoxPosition = new point_1.Point(speechBoxConfiguration.OuterMargin.X, screenSize.Y - speechBoxConfiguration.OuterMargin.Y - speechBoxConfiguration.Height);
        this.textBox = new SpeechBox(textBoxPosition, textBoxSize, speechBoxConfiguration);
        this.nameBox = new NameBox(textBoxPosition.Add(new point_1.Point(70, 0)), {
            Background: speechBoxConfiguration.Background,
            BackgroundType: speechBoxConfiguration.BackgroundType,
            FontColor: "white",
            FontSize: 24,
            Height: 40,
            Width: 100
        });
    }
    Draw(canvas) {
        this.textBox.Draw(canvas);
        this.nameBox.Draw(canvas);
    }
    MouseClick(clickPosition, action) {
        if (this.textAppeared) {
            action();
        }
        else {
            this.textBox.Text = this.fullText;
            this.textAppeared = true;
        }
    }
    MouseMove(mousePosition) {
        return null;
    }
    Say(text, name) {
        this.textBox.Text = "";
        this.fullText = text;
        this.textAppeared = false;
        this.nameBox.Name = name;
    }
    Step(delta) {
        this.textTime += delta;
        while (this.textTime >= config_1.Config.TextSpeedRatio) {
            if (this.textBox.Text.length < this.fullText.length) {
                const c = this.fullText.slice(this.textBox.Text.length, this.textBox.Text.length + 1);
                this.textBox.Text += c;
                if (c === " " && this.textBox.Text.length + 2 < this.fullText.length) {
                    let n = this.textBox.Text.length;
                    while (this.fullText[n] === " " && n < this.fullText.length) {
                        ++n;
                    }
                    if (n < this.fullText.length) {
                        while (this.fullText[n] !== " " && n < this.fullText.length) {
                            ++n;
                        }
                    }
                    this.textBox.NextWord = this.fullText.slice(this.textBox.Text.length + 1, n);
                }
            }
            else {
                this.textAppeared = true;
            }
            this.textTime = this.textTime - config_1.Config.TextSpeedRatio;
        }
    }
}
exports.SpeechLayer = SpeechLayer;

},{"../config":3,"../point":14,"./boxbackgrounds":6,"./layers":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
const events_1 = require("../events");
const point_1 = require("../point");
const layers_1 = require("./layers");
class Transition extends layers_1.StepLayer {
    constructor(imageData) {
        super();
        this._onEnd = new events_1.LiteEvent();
        this.time = 0;
        this.totalTime = 2000.0;
        // sin equation: y = a*sin(b*x + c) + d
        // a sin period is 2PI / b
        // we want a half period of totalTime so we're looking for b: b = 2PI / period
        this.b = (Math.PI * 2) / (this.totalTime * 2);
        createImageBitmap(imageData).then(image => this.image = image);
    }
    get OnEnd() {
        return this._onEnd.Expose();
    }
    Draw(canvas) {
        if (this.image != null) {
            canvas.DrawBackgroundImage(this.image);
        }
        canvas.DrawRect(new point_1.Point(), canvas.Size, `rgba(0.0, 0.0, 0.0, ${Math.sin(this.b * this.time)})`);
    }
    Step(delta) {
        this.time += delta;
        if (this.image != null && this.time >= this.totalTime / 2) {
            this.image = null;
        }
        if (this.time >= this.totalTime) {
            this._onEnd.Trigger(this, null);
        }
    }
}
exports.Transition = Transition;

},{"../events":4,"../point":14,"./layers":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const config_1 = require("./config");
class ClassLoader {
    LoadImage(URL) {
        return new Promise((resolve, reject) => {
            const worker = this.createWorker();
            worker.addEventListener("message", (evt) => {
                if (evt.data.err) {
                    reject();
                }
                else {
                    resolve(evt.data);
                }
                worker.terminate();
            });
            worker.postMessage(config_1.Config.RootPathIsRemote ?
                `https://${config_1.Config.RootPath ? config_1.Config.RootPath + "/" : ""}${URL}`
                : `${config_1.Config.RootPath ? config_1.Config.RootPath + "/" : ""}${window.location.href.replace(/[^\\\/]*$/, "")}${URL}`);
        });
    }
    createWorker() {
        return new Worker(URL.createObjectURL(new Blob([`(function ${this.worker})()`])));
    }
    worker() {
        const ctx = self;
        ctx.addEventListener("message", (evt) => {
            fetch(evt.data).then(response => response.blob()).then(blobData => {
                createImageBitmap(blobData).then(image => ctx.postMessage(image));
            });
        });
    }
}
exports.Loader = new ClassLoader();

},{"./config":3}],13:[function(require,module,exports){
(function (global){(function (){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VN = void 0;
const InkJs = (typeof window !== "undefined" ? window['inkjs'] : typeof global !== "undefined" ? global['inkjs'] : null);
const audio_1 = require("./audio");
const canvas_1 = require("./canvas");
const config_1 = require("./config");
const boxbackgrounds_1 = require("./layers/boxbackgrounds");
const Layers = require("./layers/layers");
const point_1 = require("./point");
const preloader_1 = require("./preloader");
class VN {
    constructor(storyFilenameOrObject, containerID) {
        this.speakingCharacterName = "";
        this.Audio = audio_1.AudioFactory.Create();
        this.Canvas = new canvas_1.Canvas(containerID, config_1.Config.ScreenSize);
        const initStory = (rawStory) => {
            this.Story = new InkJs.Story(rawStory);
            config_1.Config.Load(this.Story.globalTags || []);
            this.Canvas.Size = config_1.Config.ScreenSize;
            this.background = new Layers.Background();
            this.characters = new Layers.Characters();
            this.speechScreen = new Layers.SpeechLayer(this.Canvas.Size, {
                Background: "rgba(0.0, 0.0, 0.0, 0.75)",
                BackgroundType: boxbackgrounds_1.BoxBackgroundTypes.COLOR,
                FontColor: "white",
                FontSize: 24,
                Height: 200,
                InnerMargin: new point_1.Point(35),
                OuterMargin: new point_1.Point(50)
            });
            this.choiceScreen = new Layers.ChoiceLayer(this.Canvas.Size);
            this.hudScreens = {};
            this.Canvas.OnClick.On(this.mouseClick.bind(this));
            this.Canvas.OnMove.On(this.mouseMove.bind(this));
            this.continue();
            this.previousTimestamp = 0;
            this.requestStep();
        };
        if (typeof storyFilenameOrObject === "string") {
            fetch(storyFilenameOrObject).then(response => response.text()).then(initStory);
        }
        else {
            initStory(JSON.stringify(storyFilenameOrObject));
        }
    }
    makeHud(hudName) {
        if (!(hudName in this.hudScreens)) {
            this.hudScreens[hudName] = new Layers.ChoiceLayer(this.Canvas.Size);
            console.log("Created new HUD", this.hudScreens);
        }
    }
    computeTags() {
        const getFinalValue = (value) => {
            const valueMatch = value.match(/^\{(\w+)\}$/);
            if (valueMatch != null) {
                return this.Story.variablesState.$(valueMatch[1]);
            }
            return value;
        };
        const tags = this.Story.currentTags;
        if (tags.length > 0) {
            for (let i = 0; i < tags.length; ++i) {
                const match = tags[i].match(/^(\w+)\s*:\s*(.*)$/);
                if (match != null) {
                    // We need to know what tag it is
                    const key = match[1];
                    const value = getFinalValue(match[2]);
                    // allow getting variable values inside tags
                    const params = value.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g).map(v => {
                        const key = v.match(/{(.*?)}/);
                        return (key && key.length > 1) ? this.Story.variablesState.$(key[1]) : v;
                    });
                    console.log(key, "PARAMS", params);
                    switch (key) {
                        case "preload": {
                            value.split(",").forEach(_value => preloader_1.Preloader.Preload(config_1.Config.RootPathIsRemote ? `https://${config_1.Config.RootPath ? config_1.Config.RootPath + "/" : ""}${_value.trim()}` : `${config_1.Config.RootPath ? config_1.Config.RootPath + "/" : ""}${_value.trim()}`));
                            break;
                        }
                        case "background": {
                            const bgImage = params.length > 1 ? this.characters.GetImage(params[0], params[1]) : undefined;
                            this.background.BackgroundImage = bgImage || value;
                            break;
                        }
                        case "image": {
                            if (value.length > 0) {
                                this.characters.Add(value);
                            }
                            break;
                        }
                        case "button": {
                            if (value.length > 0) {
                                //do_thing yay%s.png 30 20
                                if (params.length === 4) { // no hud was passed, add to scene
                                    this.choiceScreen.AddButton(this.characters, { knot: params[0], text: params[1], position: new point_1.Point(parseInt(params[2]), parseInt(params[3])) });
                                }
                                else if (params.length === 5) { // hud was passed, add to huds
                                    //do_thing yay%s.png 30 20 hudName - make a hud if it doesnt exist, add this button to it
                                    const hudName = params[4];
                                    this.makeHud(hudName);
                                    this.hudScreens[hudName].AddButton(this.characters, { knot: params[0], text: params[1], position: new point_1.Point(parseInt(params[2]), parseInt(params[3])) });
                                }
                            }
                            break;
                        }
                        case "label": {
                            if (value.length > 0) {
                                //"my boring label" 30 20
                                if (params.length === 3) { // no hud was passed, add to scene
                                    this.choiceScreen.AddButton(this.characters, { knot: null, text: params[0], position: new point_1.Point(parseInt(params[1]), parseInt(params[2])) });
                                }
                                else if (params.length === 4) { // hud was passed, add to huds
                                    //"my boring label" 30 20 hudName - make a hud if it doesnt exist, add this button to it
                                    const hudName = params[3];
                                    this.makeHud(hudName);
                                    this.hudScreens[hudName].AddButton(this.characters, { knot: null, text: params[0], position: new point_1.Point(parseInt(params[1]), parseInt(params[2])) });
                                }
                            }
                            break;
                        }
                        case "hud": {
                            if (value.length > 0) {
                                const hudName = params[0];
                                if (hudName in this.hudScreens) {
                                    this.hudScreen = hudName;
                                }
                            }
                            break;
                        }
                        case "show": {
                            if (value.length > 0) {
                                this.characters.Show(value);
                            }
                            break;
                        }
                        case "hide": {
                            if (value.length > 0) {
                                this.characters.Hide(value);
                            }
                            else {
                                this.characters.HideAll();
                            }
                            break;
                        }
                        case "name": {
                            this.speakingCharacterName = value;
                            break;
                        }
                        case "bgm": {
                            if (value.length > 0) {
                                this.Audio.PlayBGM(value);
                            }
                            else {
                                this.Audio.StopBGM();
                            }
                            break;
                        }
                        case "sfx": {
                            this.Audio.PlaySFX(value);
                            break;
                        }
                        case "transition": {
                            this.transition = new Layers.Transition(this.Canvas.GetImageData());
                            this.transition.OnEnd.On((sender, args) => {
                                this.transition = null;
                            });
                            break;
                        }
                    }
                }
                else {
                    // Unknown tags are treated as names
                    this.speakingCharacterName = getFinalValue(tags[i]);
                }
            }
        }
    }
    continue() {
        if (this.transition != null) {
            return;
        }
        if (this.Story.canContinue) {
            this.Story.Continue();
            if (this.Story.currentText.replace(/\s/g, "").length <= 0) {
                this.continue();
                this.computeTags();
                if (this.choiceScreen.choices.length > 0) {
                    console.log("SHOW CHOICE", this.Story.currentText);
                    this.currentScreen = this.choiceScreen;
                }
                else {
                    // still required for initiation when there is no text
                    console.log("SHOW EMPTY TEXT", this.Story.currentText);
                    // this.speechScreen.Say(this.Story.currentText, this.speakingCharacterName);
                    this.currentScreen = null;
                    // this.continue();
                }
            }
            else {
                console.log("SHOW TEXT", this.Story.currentText);
                this.computeTags();
                this.speechScreen.Say(this.Story.currentText, this.speakingCharacterName);
                this.currentScreen = this.speechScreen;
            }
        }
        else if (this.Story.currentChoices.length > 0) {
            this.computeTags();
            this.choiceScreen.Choices = this.Story.currentChoices;
            this.currentScreen = this.choiceScreen;
        }
        else {
            // TODO It's the end
        }
        console.log("CURRENT SCREEN", this.currentScreen, this.Story.currentText);
        // Hide or lock hud - maybe change it to hide when a character is shown?
        if (this.hudScreen === "overview" && "overview" in this.hudScreens) {
            this.hudScreens["overview"].visible = !(this.currentScreen instanceof Layers.SpeechLayer || this.currentScreen instanceof Layers.ChoiceLayer);
        }
    }
    mouseClick(sender, clickPosition) {
        var _a;
        if (this.transition != null) {
            return;
        }
        if (this.currentScreen instanceof Layers.ChoiceLayer) {
            this.currentScreen.MouseClick(clickPosition, this.validateChoice.bind(this));
        }
        else {
            (_a = this.currentScreen) === null || _a === void 0 ? void 0 : _a.MouseClick(clickPosition, () => this.continue());
        }
        if (this.hudScreen in this.hudScreens) {
            this.hudScreens[this.hudScreen].MouseClick(clickPosition, this.validateChoice.bind(this));
        }
    }
    mouseMove(sender, mousePosition) {
        var _a;
        const callback = (_a = this.currentScreen) === null || _a === void 0 ? void 0 : _a.MouseMove(mousePosition);
        if (callback != null) {
            callback(sender);
        }
        if (this.hudScreen in this.hudScreens) {
            const callbackHud = this.hudScreens[this.hudScreen].MouseMove(mousePosition);
            if (callbackHud != null) {
                callbackHud(sender);
            }
        }
    }
    requestStep() {
        window.requestAnimationFrame(this.step.bind(this));
    }
    step(timestamp) {
        var _a, _b;
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.Canvas.Clear();
        if (this.transition != null) {
            this.transition.Step(delta);
        }
        else {
            (_a = this.currentScreen) === null || _a === void 0 ? void 0 : _a.Step(delta);
        }
        this.background.Draw(this.Canvas);
        this.characters.Draw(this.Canvas);
        if (this.hudScreen && this.hudScreen in this.hudScreens) {
            this.hudScreens[this.hudScreen].Draw(this.Canvas); //draw one of a number of huds, created when adding buttons
        }
        if (this.transition != null) {
            this.transition.Draw(this.Canvas);
        }
        else {
            (_b = this.currentScreen) === null || _b === void 0 ? void 0 : _b.Draw(this.Canvas);
        }
        this.requestStep();
    }
    // when number,its a choiceIndex, when string - its a knot
    validateChoice(choice) {
        if (choice === null)
            return;
        if (typeof choice === "string") {
            this.Story.ChoosePathString(choice);
        }
        else {
            this.Story.ChooseChoiceIndex(choice);
        }
        // this.characters.HideAll();
        this.continue();
    }
}
exports.VN = VN;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./audio":1,"./canvas":2,"./config":3,"./layers/boxbackgrounds":6,"./layers/layers":9,"./point":14,"./preloader":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : x != null ? x : 0;
    }
    get X() {
        return this.x;
    }
    set X(x) {
        this.x = x;
    }
    get Y() {
        return this.y;
    }
    set Y(y) {
        this.y = y;
    }
    Add(point) {
        return new Point(this.X + point.X, this.Y + point.Y);
    }
    Clone() {
        return new Point(this.X, this.Y);
    }
    Div(point) {
        return new Point(this.X / point.X, this.Y / point.Y);
    }
    Percent(point) {
        return new Point((point.X / 100) * this.X, (point.Y / 100) * this.Y);
    }
    IsInRect(rect) {
        return this.X >= rect.Position.X && this.X <= rect.Position.Add(rect.Size).X
            && this.Y >= rect.Position.Y && this.Y <= rect.Position.Add(rect.Size).Y;
    }
    Mult(point) {
        return new Point(this.X * point.X, this.Y * point.Y);
    }
    Sub(point) {
        return this.Add(new Point(-point.X, -point.Y));
    }
}
exports.Point = Point;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preloader = void 0;
class ClassPreloader {
    Preload(url) {
        fetch(url);
    }
}
exports.Preloader = new ClassPreloader();

},{}]},{},[13])(13)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsdUNBQXVDO0FBRXZDLE1BQWEsWUFBWTtJQUNyQixNQUFNLENBQUMsTUFBTTtRQUNULElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksY0FBYyxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSjtBQVJELG9DQVFDO0FBRUQsTUFBc0IsS0FBSztDQUkxQjtBQUpELHNCQUlDO0FBRUQsTUFBTSxjQUFlLFNBQVEsS0FBSztJQUk5QixPQUFPLENBQUMsTUFBZTtRQUNuQixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsT0FBTyxFQUFHO29CQUNOLElBQUksRUFBRyxJQUFJO29CQUNYLElBQUksRUFBRyxNQUFNO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUcsTUFBTTthQUNsQixFQUFFLEdB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QkF3REM7Ozs7OztBQzdERCxNQUFNLGNBQWM7SUFDaEIsT0FBTyxDQUFDLEdBQVk7UUFDaEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztDQUNKO0FBRVksUUFBQSxTQUFTLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCAqIGFzIFBpenppY2F0byBmcm9tIFwicGl6emljYXRvXCI7XG5cbmV4cG9ydCBjbGFzcyBBdWRpb0ZhY3Rvcnkge1xuICAgIHN0YXRpYyBDcmVhdGUoKSA6IEF1ZGlvIHtcbiAgICAgICAgaWYgKFBpenppY2F0byAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBpenppY2F0b0F1ZGlvKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IER1bW15QXVkaW8oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEF1ZGlvIHtcbiAgICBhYnN0cmFjdCBQbGF5QkdNKGJnbVVSTCA6IHN0cmluZykgOiB2b2lkO1xuICAgIGFic3RyYWN0IFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQ7XG4gICAgYWJzdHJhY3QgU3RvcEJHTSgpIDogdm9pZDtcbn1cblxuY2xhc3MgUGl6emljYXRvQXVkaW8gZXh0ZW5kcyBBdWRpbyB7XG4gICAgcHJpdmF0ZSBiZ20gOiBQaXp6aWNhdG8uU291bmQ7XG4gICAgcHJpdmF0ZSBiZ21VUkwgOiBzdHJpbmc7XG5cbiAgICBQbGF5QkdNKGJnbVVSTCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgaWYgKGJnbVVSTCAhPT0gdGhpcy5iZ21VUkwpIHtcbiAgICAgICAgICAgIHRoaXMuYmdtVVJMID0gYmdtVVJMO1xuXG4gICAgICAgICAgICBjb25zdCBiZ20gPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcbiAgICAgICAgICAgICAgICBvcHRpb25zIDoge1xuICAgICAgICAgICAgICAgICAgICBsb29wIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA6IGJnbVVSTFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc291cmNlIDogXCJmaWxlXCJcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iZ20gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnbS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdtLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmdtLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJnbSA9IGJnbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGxheVNGWChzZnhVUkwgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNmeCA9IG5ldyBQaXp6aWNhdG8uU291bmQoe1xuICAgICAgICAgICAgb3B0aW9ucyA6IHsgcGF0aCA6IHNmeFVSTCB9LFxuICAgICAgICAgICAgc291cmNlIDogXCJmaWxlXCJcbiAgICAgICAgfSwgKCkgPT4gc2Z4LnBsYXkoKSk7XG4gICAgfVxuXG4gICAgU3RvcEJHTSgpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmJnbSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmJnbS5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmJnbS5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB0aGlzLmJnbVVSTCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmJnbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIER1bW15QXVkaW8gZXh0ZW5kcyBBdWRpbyB7XG4gICAgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZCB7IH1cbiAgICBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkIHsgfVxuICAgIFN0b3BCR00oKSA6IHZvaWQgeyB9XG59XG4iLCJpbXBvcnQgeyBMaXRlRXZlbnQgfSBmcm9tIFwiLi9ldmVudHNcIjtcbmltcG9ydCB7IElSZWN0LCBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICAgIHByaXZhdGUgX29uQ2xpY2sgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4gPSBuZXcgTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+KCk7XG4gICAgcHJpdmF0ZSBfb25Nb3ZlIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+ID0gbmV3IExpdGVFdmVudDxDYW52YXMsIFBvaW50PigpO1xuICAgIHByaXZhdGUgY3R4IDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgZWxlbWVudCA6IEhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVySUQgOiBzdHJpbmcsIHNpemUgOiBQb2ludCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJRCk7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lci50YWdOYW1lID09PSBcImNhbnZhc1wiKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBjb250YWluZXIgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBzaXplLlg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBzaXplLlk7XG5cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoIXRoaXMuY3R4KSB7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuX2NsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLl9tb3ZlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuQ2xlYXIoKTtcbiAgICB9XG5cbiAgICBnZXQgU2l6ZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuZWxlbWVudC53aWR0aCwgdGhpcy5lbGVtZW50LmhlaWdodCk7XG4gICAgfVxuXG4gICAgc2V0IFNpemUoc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IHNpemUuWDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IHNpemUuWTtcbiAgICB9XG5cbiAgICBDbGVhcigpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIERyYXdCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2UgOiBJbWFnZUJpdG1hcCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwLCB0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIERyYXdJbWFnZShpbWFnZSA6IEltYWdlQml0bWFwLCBwb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1hZ2UsIHBvc2l0aW9uLlgsIHBvc2l0aW9uLlksIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpO1xuICAgIH1cblxuICAgIERyYXdJbWFnZVRvKGltYWdlIDogSW1hZ2VCaXRtYXAsIHNvdXJjZSA6IElSZWN0LCBkZXN0aW5hdGlvbiA6IElSZWN0KSB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgc291cmNlLlBvc2l0aW9uLlgsIHNvdXJjZS5Qb3NpdGlvbi5ZLFxuICAgICAgICAgICAgc291cmNlLlNpemUuWCwgc291cmNlLlNpemUuWSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uLlBvc2l0aW9uLlgsIGRlc3RpbmF0aW9uLlBvc2l0aW9uLlksXG4gICAgICAgICAgICBkZXN0aW5hdGlvbi5TaXplLlgsIGRlc3RpbmF0aW9uLlNpemUuWVxuICAgICAgICApO1xuICAgIH1cblxuICAgIERyYXdSZWN0KHBvc2l0aW9uIDogUG9pbnQsIHNpemUgOiBQb2ludCwgY29sb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBzaXplLlgsIHNpemUuWSk7XG4gICAgfVxuXG4gICAgRHJhd1JlY3QwKHNpemUgOiBQb2ludCwgY29sb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuRHJhd1JlY3QobmV3IFBvaW50KCksIHNpemUsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBEcmF3VGV4dCh0ZXh0IDogc3RyaW5nLCBwb3NpdGlvbiA6IFBvaW50LCBjb2xvciA6IHN0cmluZywgZm9udFNpemUgOiBudW1iZXIsIG1heFdpZHRoPyA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcbiAgICAgICAgdGhpcy5jdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFRleHQodGV4dC5yZXBsYWNlKC9eXCIoLiopXCIkLywgXCIkMVwiKSwgcG9zaXRpb24uWCwgcG9zaXRpb24uWSwgbWF4V2lkdGgpO1xuICAgIH1cblxuICAgIERyYXdUZXh0MCh0ZXh0IDogc3RyaW5nLCBjb2xvciA6IHN0cmluZywgZm9udFNpemUgOiBudW1iZXIsIG1heFdpZHRoPyA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5EcmF3VGV4dCh0ZXh0LCBuZXcgUG9pbnQoKSwgY29sb3IsIGZvbnRTaXplLCBtYXhXaWR0aCk7XG4gICAgfVxuXG4gICAgR2V0SW1hZ2VEYXRhKCkgOiBJbWFnZURhdGEge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMuU2l6ZS5YLCB0aGlzLlNpemUuWSk7XG4gICAgfVxuXG4gICAgTWVhc3VyZVRleHRXaWR0aCh0ZXh0IDogc3RyaW5nKSA6IG51bWJlciB7XG4gICAgICAgIC8vIFdlIG1lYXN1cmUgd2l0aCB0aGUgbGFzdCBmb250IHVzZWQgaW4gdGhlIGNvbnRleHRcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuICAgIH1cblxuICAgIFJlc3RvcmUoKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgU2V0Q3Vyc29yKGN1cnNvciA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmN1cnNvciA9IGN1cnNvcjtcbiAgICB9XG5cbiAgICBUcmFuc2xhdGUocG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5SZXN0b3JlKCk7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHBvc2l0aW9uLlgsIHBvc2l0aW9uLlkpO1xuICAgIH1cblxuICAgIGdldCBPbkNsaWNrKCkgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25DbGljay5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBnZXQgT25Nb3ZlKCkgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3ZlLkV4cG9zZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NsaWNrKGV2IDogTW91c2VFdmVudCkgOiB2b2lkIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fb25DbGljay5UcmlnZ2VyKHRoaXMsIG5ldyBQb2ludChcbiAgICAgICAgICAgIGV2LnBhZ2VYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICBldi5wYWdlWSAtIHRoaXMuZWxlbWVudC5vZmZzZXRUb3BcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbW92ZShldiA6IE1vdXNlRXZlbnQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuX29uTW92ZS5UcmlnZ2VyKHRoaXMsIG5ldyBQb2ludChcbiAgICAgICAgICAgIGV2LnBhZ2VYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICBldi5wYWdlWSAtIHRoaXMuZWxlbWVudC5vZmZzZXRUb3BcbiAgICAgICAgKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSGlkZGVuQ2FudmFzIGV4dGVuZHMgQ2FudmFzIHtcbiAgICBwcml2YXRlIGhpZGRlbkVsZW1lbnQgOiBIVE1MRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKHNpemUgOiBQb2ludCkge1xuICAgICAgICBjb25zdCBpZCA9IGBjXyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygpLnNsaWNlKDIsIDcpfWA7XG4gICAgICAgIGNvbnN0IGhpZGRlbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBoaWRkZW5FbGVtZW50LmlkID0gaWQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaGlkZGVuRWxlbWVudCk7XG5cbiAgICAgICAgc3VwZXIoaWQsIHNpemUpO1xuXG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudCA9IGhpZGRlbkVsZW1lbnQ7XG4gICAgfVxuXG4gICAgRGVzdHJveSgpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5cbmNsYXNzIENsYXNzQ29uZmlnIHtcbiAgICBEZWZhdWx0VGV4dFNwZWVkIDogbnVtYmVyID0gMzA7XG4gICAgUm9vdFBhdGggOiBzdHJpbmcgPSBcIlwiO1xuICAgIFJvb3RQYXRoSXNSZW1vdGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBTY3JlZW5TaXplIDogUG9pbnQgPSBuZXcgUG9pbnQoODAwLCA2MDApO1xuXG4gICAgcHJpdmF0ZSB0ZXh0U3BlZWQgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0ZXh0U3BlZWRSYXRpbyA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLlRleHRTcGVlZCA9IHRoaXMuRGVmYXVsdFRleHRTcGVlZDsgLy8gVGhpcyBpcyBpbiBjaGFyIHBlciBzZWNvbmRcbiAgICB9XG5cbiAgICBMb2FkKHRhZ3MgOiBzdHJpbmdbXSkgOiB2b2lkIHtcbiAgICAgICAgZnVuY3Rpb24gZXJyb3IodGFnIDogc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciByZWFkaW5nIHRhZzogXCIke3RhZ31cImApO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQga2V5LCB2YWx1ZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAga2V5ID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMV0udHJpbSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNjcmVlbl9zaXplXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5zaXplXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSB2YWx1ZS5zcGxpdCgvXFxEKy8pLm1hcCh4ID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2l6ZS5sZW5ndGggPT09IDIgJiYgIWlzTmFOKHNpemVbMF0pICYmICFpc05hTihzaXplWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyZWVuU2l6ZSA9IG5ldyBQb2ludChzaXplWzBdLCBzaXplWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRfc3BlZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRzcGVlZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVlZCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHNwZWVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRGVmYXVsdFRleHRTcGVlZCA9IHRoaXMuVGV4dFNwZWVkID0gc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290X3BhdGhcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvb3RwYXRoXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm9vdFBhdGggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290X3BhdGhfaXNfcmVtb3RlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290cGF0aGlzcmVtb3RlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm9vdFBhdGhJc1JlbW90ZSA9IHZhbHVlID09PSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBUZXh0U3BlZWQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRTcGVlZDtcbiAgICB9XG5cbiAgICBzZXQgVGV4dFNwZWVkKHZhbHVlIDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudGV4dFNwZWVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMudGV4dFNwZWVkUmF0aW8gPSAxMDAwLjAgLyB0aGlzLnRleHRTcGVlZDtcbiAgICB9XG5cbiAgICBnZXQgVGV4dFNwZWVkUmF0aW8oKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRTcGVlZFJhdGlvO1xuICAgIH1cbn1cblxuZXhwb3J0IGxldCBDb25maWcgPSBuZXcgQ2xhc3NDb25maWcoKTtcbiIsImV4cG9ydCBjbGFzcyBMaXRlRXZlbnQ8VDEsIFQyPiB7XG4gICAgcHJpdmF0ZSBoYW5kbGVycyA6IEFycmF5PChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgRXhwb3NlKCkgOiBMaXRlRXZlbnQ8VDEsIFQyPiB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIE9mZihoYW5kbGVyIDogKHNlbmRlciA6IFQxLCBhcmc/IDogVDIpID0+IHZvaWQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmZpbHRlcihfaGFuZGxlciA9PiBfaGFuZGxlciAhPT0gaGFuZGxlcik7XG4gICAgfVxuXG4gICAgT24oaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgVHJpZ2dlcihzZW5kZXIgOiBUMSwgYXJncz8gOiBUMikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGhhbmRsZXIgPT4gaGFuZGxlcihzZW5kZXIsIGFyZ3MpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIExheWVyIHtcbiAgICBwcml2YXRlIGJhY2tncm91bmRJbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgYmFja2dyb3VuZEltYWdlVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZVVSTD8gOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoaW1hZ2VVUkwgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2VVUkwgOiBzdHJpbmcgfCBJbWFnZUJpdG1hcCkge1xuICAgICAgICBpZiAodHlwZW9mIGltYWdlVVJMID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuYmFja2dyb3VuZEltYWdlVVJMKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VVUkwgPSBpbWFnZVVSTDtcbiAgICAgICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKGltYWdlVVJMKS50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kSW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdCYWNrZ3JvdW5kSW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzLCBIaWRkZW5DYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmV4cG9ydCBlbnVtIEJveEJhY2tncm91bmRUeXBlcyB7XG4gICAgQ09MT1IsIE5JTkVQQVRDSCwgU1RSRVRDSFxufVxuXG5jbGFzcyBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5IHtcbiAgICBDcmVhdGUodHlwZSA6IEJveEJhY2tncm91bmRUeXBlcywgYmFja2dyb3VuZCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkgOiBCb3hCYWNrZ3JvdW5kIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5DT0xPUjoge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3JlZEJveEJhY2tncm91bmQoYmFja2dyb3VuZCwgc2l6ZSwgcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuTklORVBBVENIOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLlNUUkVUQ0g6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0cmV0Y2hCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJveEJhY2tncm91bmRGYWN0b3J5IDogQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSA9IG5ldyBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5KCk7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByb3RlY3RlZCBib3ggOiBJUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmJveCA9IHtcbiAgICAgICAgICAgIFBvc2l0aW9uIDogcG9zaXRpb24gPT0gbnVsbCA/IG5ldyBQb2ludCgpIDogcG9zaXRpb24sXG4gICAgICAgICAgICBTaXplIDogc2l6ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNldCBQb3NpdGlvbihwb3NpdGlvbiA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm94LlBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgfVxuXG4gICAgc2V0IFNpemUoc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm94LlNpemUgPSBzaXplO1xuICAgIH1cbn1cblxuY2xhc3MgQ29sb3JlZEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBDb2xvciA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGNvbG9yIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKHNpemUsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLkNvbG9yID0gY29sb3I7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3UmVjdCh0aGlzLmJveC5Qb3NpdGlvbiwgdGhpcy5ib3guU2l6ZSwgdGhpcy5Db2xvcik7XG4gICAgfVxufVxuXG5jbGFzcyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgcHJpdmF0ZSBuaW5lUGF0Y2ggOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIG5pbmVQYXRjaFVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5pbmVQYXRjaFVSTCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5OaW5lUGF0Y2ggPSBuaW5lUGF0Y2hVUkw7XG4gICAgfVxuXG4gICAgc2V0IE5pbmVQYXRjaChuaW5lUGF0Y2hVUkwgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG5pbmVQYXRjaFVSTCAhPT0gdGhpcy5uaW5lUGF0Y2hVUkwpIHtcbiAgICAgICAgICAgIHRoaXMubmluZVBhdGNoVVJMID0gbmluZVBhdGNoVVJMO1xuXG4gICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKG5pbmVQYXRjaFVSTClcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoaWRkZW5DYW52YXMgPSBuZXcgSGlkZGVuQ2FudmFzKHRoaXMuYm94LlNpemUuQ2xvbmUoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hTaXplID0gbmV3IFBvaW50KGltYWdlLndpZHRoIC8gMywgaW1hZ2UuaGVpZ2h0IC8gMyk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkcmF3UGF0Y2hUbyhwYXRjaFBvc2l0aW9uIDogUG9pbnQsIGRlc3RQb3MgOiBQb2ludCwgZGVzdFNpemU/IDogUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuQ2FudmFzLkRyYXdJbWFnZVRvKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UsIHsgUG9zaXRpb24gOiBwYXRjaFBvc2l0aW9uLCBTaXplIDogcGF0Y2hTaXplIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogZGVzdFBvcywgU2l6ZSA6IGRlc3RTaXplICE9IG51bGwgPyBkZXN0U2l6ZSA6IHBhdGNoU2l6ZSB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hEZXN0aW5hdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCgpLCBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoMCwgdGhpcy5ib3guU2l6ZS5ZIC0gcGF0Y2hTaXplLlkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIHBhdGNoU2l6ZS5ZKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8obmV3IFBvaW50KCksIHBhdGNoRGVzdGluYXRpb25zWzBdKTsgLy8gVXBwZXIgTGVmdFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAwKSksIHBhdGNoRGVzdGluYXRpb25zWzFdKTsgLy8gVXBwZXIgUmlnaHRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1syXSk7IC8vIExvd2VyIExlZnRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1szXSk7IC8vIExvd2VyIFJpZ2h0XG5cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gKHBhdGNoU2l6ZS5YICogMiksIHBhdGNoU2l6ZS5ZKSk7IC8vIFRvcFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAxKSksIHBhdGNoRGVzdGluYXRpb25zWzFdLkFkZChuZXcgUG9pbnQoMCwgcGF0Y2hTaXplLlkpKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSAocGF0Y2hTaXplLlkgKiAyKSkpOyAvLyBSaWdodFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAyKSksIHBhdGNoRGVzdGluYXRpb25zWzJdLkFkZChuZXcgUG9pbnQocGF0Y2hTaXplLlgsIDApKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIChwYXRjaFNpemUuWCAqIDIpLCBwYXRjaFNpemUuWSkpOyAvLyBCb3R0b21cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQocGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIChwYXRjaFNpemUuWSAqIDIpKSk7IC8vIExlZnRcblxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksIHRoaXMuYm94LlNpemUuU3ViKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAyKSkpKTsgLy8gQ2VudGVyXG5cbiAgICAgICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChoaWRkZW5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpLnRoZW4obmluZVBhdGNoSW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5pbmVQYXRjaCA9IG5pbmVQYXRjaEltYWdlO1xuICAgICAgICAgICAgICAgICAgICAvLyBoaWRkZW5DYW52YXMuRGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmluZVBhdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2UodGhpcy5uaW5lUGF0Y2gsIHRoaXMuYm94LlBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgU3RyZXRjaEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBwcml2YXRlIGltYWdlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBpbWFnZVNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIGltYWdlVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoaW1hZ2VVUkwgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5JbWFnZSA9IGltYWdlVVJMO1xuICAgIH1cblxuICAgIHNldCBJbWFnZShpbWFnZVVSTCA6IHN0cmluZykge1xuICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuaW1hZ2VVUkwpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VVUkwgPSBpbWFnZVVSTDtcblxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTClcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNpemUgPSBuZXcgUG9pbnQodGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZVRvKFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IG5ldyBQb2ludCgpLCBTaXplIDogdGhpcy5pbWFnZVNpemUgfSxcbiAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogdGhpcy5ib3guUG9zaXRpb24sIFNpemUgOiB0aGlzLmJveC5TaXplIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgc3ByaXRlcyA6IHtbY3VycmVudFN0YXRlIDogc3RyaW5nXSA6IEltYWdlQml0bWFwfTsgLy8gbG9hZGVkIHN0YXRlIHNwcml0ZXNcbiAgICBwcml2YXRlIGFuY2hvciA6IHN0cmluZyB8IFBvaW50OyAvLyBjdXJyZW50IGFuY2hvclxuICAgIHByaXZhdGUgY3VycmVudFN0YXRlIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDsgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIHByaXZhdGUgc2hvdyA6IGJvb2xlYW47IC8vIGN1cnJlbnRseSB2aXNpYmxlXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgdGhpcy5zcHJpdGVzID0ge307XG4gICAgICAgIHRoaXMuc2hvdyA9IGZhbHNlO1xuICAgIH1cblxuICAgIEltYWdlKHNwcml0ZVVSTCA6IHN0cmluZywgc3ByaXRlS2V5IDogc3RyaW5nKSB7XG4gICAgICAgIExvYWRlci5Mb2FkSW1hZ2Uoc3ByaXRlVVJMKS50aGVuKGltYWdlID0+IHRoaXMuc3ByaXRlc1tzcHJpdGVLZXldID0gaW1hZ2UpO1xuICAgIH1cblxuICAgIFNob3coc3ByaXRlS2V5IDogc3RyaW5nLCBhbmNob3IgOiBzdHJpbmcgfCBQb2ludCkge1xuICAgICAgICB0aGlzLnNob3cgPSB0cnVlO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHNwcml0ZUtleTtcbiAgICAgICAgaWYgKGFuY2hvcikge1xuICAgICAgICAgICAgdGhpcy5hbmNob3IgPSBhbmNob3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBIaWRlKCkge1xuICAgICAgICB0aGlzLnNob3cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnNob3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcHJpdGUgPSB0aGlzLnNwcml0ZXNbdGhpcy5jdXJyZW50U3RhdGVdO1xuICAgICAgICBpZiAoc3ByaXRlICE9IG51bGwpIHtcbiAgICAgICAgbGV0IHggOiBudW1iZXI7XG4gICAgICAgIGxldCB5ID0gY2FudmFzLlNpemUuWSAtIHNwcml0ZS5oZWlnaHQ7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hbmNob3IgPT09IFwic3RyaW5nXCIpIHsgLy8gbGVmdC9yaWdodC9ldGNcbiAgICAgICAgICAgIHggPSAoY2FudmFzLlNpemUuWCAvIDIgKSAtIChzcHJpdGUud2lkdGggLyAyKTsvLyBkZWZhdWx0IHRvIGNlbnRyZVxuICAgICAgICAgICAgaWYgKHRoaXMuYW5jaG9yID09PSBcImxlZnRcIiB8fCB0aGlzLmFuY2hvciA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgeCA9IHRoaXMuYW5jaG9yID09PSBcImxlZnRcIiA/IDAgOiBjYW52YXMuU2l6ZS5YIC0gc3ByaXRlLndpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IHRoaXMuYW5jaG9yLlg7XG4gICAgICAgICAgICB5ID0gdGhpcy5hbmNob3IuWTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHlcbiAgICAgICAgKTtcblxuICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHNwcml0ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBHZXRJbWFnZShzcHJpdGVTdGF0ZSA6IHN0cmluZykgOiBJbWFnZUJpdG1hcCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3ByaXRlcywgc3ByaXRlU3RhdGUsXCItLS1cIilcbiAgICAgICAgaWYgKHNwcml0ZVN0YXRlIGluIHRoaXMuc3ByaXRlcykge1xuICAgICAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5zcHJpdGVzW3Nwcml0ZVN0YXRlXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1BSSVRFID09PT4gXCIsIHNwcml0ZSlcbiAgICAgICAgICAgIHJldHVybiBzcHJpdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJzIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgY2hhcmFjdGVycyA6IHsgW2EgOiBzdHJpbmddIDogQ2hhcmFjdGVyIH0gPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIEFkZChzcHJpdGVXaXRoUGFyYW1zIDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlckRhdGEgPSAgc3ByaXRlV2l0aFBhcmFtcy5zcGxpdChcIiBcIik7XG4gICAgICAgIGlmICghKGNoYXJhY3RlckRhdGFbMF0gaW4gdGhpcy5jaGFyYWN0ZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3RlckRhdGFbMF1dID0gbmV3IENoYXJhY3RlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJEYXRhWzBdXS5JbWFnZShjaGFyYWN0ZXJEYXRhWzJdLCBjaGFyYWN0ZXJEYXRhWzFdKTtcbiAgICB9XG5cbiAgICBTaG93KHNwcml0ZVdpdGhQYXJhbXMgOiBzdHJpbmcsIHBvc2l0aW9uPyA6IFBvaW50IHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlckRhdGEgPSAgc3ByaXRlV2l0aFBhcmFtcy5zcGxpdChcIiBcIik7XG4gICAgICAgIC8vICMgc2hvdzogYW55YSBoYXBweSBbbGVmdF1cbiAgICAgICAgaWYgKGNoYXJhY3RlckRhdGFbMF0gaW4gIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3RlckRhdGFbMF1dLlNob3coY2hhcmFjdGVyRGF0YVsxXSwgcG9zaXRpb24gfHwgY2hhcmFjdGVyRGF0YVsyXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBHZXRJbWFnZShzcHJpdGVOYW1lIDogc3RyaW5nLCBzcHJpdGVTdGF0ZSA6IHN0cmluZykgOiBJbWFnZUJpdG1hcCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmIChzcHJpdGVOYW1lIGluICB0aGlzLmNoYXJhY3RlcnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSVRTIElOXCIsIHNwcml0ZU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJzW3Nwcml0ZU5hbWVdLkdldEltYWdlKHNwcml0ZVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIEhpZGUoc3ByaXRlV2l0aFBhcmFtcyA6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJEYXRhID0gIHNwcml0ZVdpdGhQYXJhbXMuc3BsaXQoXCIgXCIpO1xuICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyRGF0YVswXV0uSGlkZSgpO1xuICAgIH1cblxuICAgIEhpZGVBbGwoKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIGluIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3Rlcl0uSGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIGluIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3Rlcl0uRHJhdyhjYW52YXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUmVtb3ZlKCkge1xuICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSB7fTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDaG9pY2UgfSBmcm9tIFwiaW5ranNcIjtcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IElSZWN0LCBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQge0NoYXJhY3RlcnMsIEdhbWVwbGF5TGF5ZXJ9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5jbGFzcyBDaG9pY2VCb3gge1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlciA9IDI0O1xuICAgIHByaXZhdGUgaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UgOiBib29sZWFuID0gZmFsc2U7XG4gICAgLy8gd2hlbiBudW1iZXIgPSBjaG9pY2UgaW5kZXgoMCwgMSwgMi4uLiksIHN0cmluZyA9IGtub3QgbmFtZSwgbnVsbCA9IG5hZGFcbiAgICBwdWJsaWMgaWQgOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludCA9IG5ldyBQb2ludCgwLCAyMCk7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdGV4dCA6IHN0cmluZztcbiAgICBwcml2YXRlIGltYWdlPyA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgaG92ZXJJbWFnZT8gOiBJbWFnZUJpdG1hcDtcbiAgICBwdWJsaWMgaXNIb3ZlcmVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoaWQgOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsLCB0ZXh0IDogc3RyaW5nLCB3aWR0aCA6IG51bWJlciwgcG9zaXRpb24gOiBQb2ludCwgaW1hZ2U/IDogSW1hZ2VCaXRtYXAsIGhvdmVySW1hZ2U/IDogSW1hZ2VCaXRtYXApIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuXG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBQb2ludCh3aWR0aCwgKHRoaXMuZm9udFNpemUgKiAxLjQyODU3KSArICgyICogdGhpcy5pbm5lck1hcmdpbi5ZKSk7XG4gICAgICAgIGlmIChpbWFnZSkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICAgICAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaG92ZXJJbWFnZSA9IGhvdmVySW1hZ2U7XG5cbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLmlzSG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoQm94QmFja2dyb3VuZFR5cGVzLkNPTE9SLCBcInJnYmEoMCwgMCwgMCwgLjcpXCIsIHRoaXMuc2l6ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0IElkKCkgOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgZ2V0IEJvdW5kaW5nUmVjdCgpIDogSVJlY3Qge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgUG9zaXRpb24gOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgICAgICAgU2l6ZSA6IHRoaXMuc2l6ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UpIHtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlRmlyc3REcmF3KGNhbnZhcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuYm94QmFja2dyb3VuZC5EcmF3KGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQodGhpcy50ZXh0LCB0aGlzLnBvc2l0aW9uLkFkZCh0aGlzLmlubmVyTWFyZ2luKSwgdGhpcy5pc0hvdmVyZWQgPyBcInllbGxvd1wiIDogXCJ3aGl0ZVwiLCB0aGlzLmZvbnRTaXplLCB0aGlzLnNpemUuWCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHRoaXMuaG92ZXJJbWFnZSAmJiB0aGlzLmlzSG92ZXJlZCA/IHRoaXMuaG92ZXJJbWFnZSA6IHRoaXMuaW1hZ2UsIHRoaXMucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBiZWZvcmVGaXJzdERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuRHJhd1RleHQwKFwiXCIsIFwidHJhbnNwYXJlbnRcIiwgdGhpcy5mb250U2l6ZSk7XG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4uWCA9ICh0aGlzLnNpemUuWCAtIGNhbnZhcy5NZWFzdXJlVGV4dFdpZHRoKHRoaXMudGV4dCkpIC8gMjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaG9pY2VMYXllciBleHRlbmRzIEdhbWVwbGF5TGF5ZXIge1xuICAgIGNob2ljZXMgOiBDaG9pY2VbXSA9IFtdO1xuICAgIHZpc2libGUgOiBib29sZWFuO1xuICAgIHByaXZhdGUgYm91bmRpbmdSZWN0IDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBjaG9pY2VCb3hlcyA6IENob2ljZUJveFtdID0gW107XG4gICAgcHJpdmF0ZSBpc01vdXNlT25DaG9pY2UgOiBDaG9pY2VCb3ggPSBudWxsO1xuICAgIHByaXZhdGUgc2NyZWVuU2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdHJhbnNsYXRpb24gOiBQb2ludDtcblxuICAgIC8vIGlmIG5hbWUgaXMgb3ZlcnZpZXcsIGhpZGUgZHVyaW5nIGNob2ljZXMgb3IgZGlhbG9ndWUgd2l0aCBjaGFyYWN0ZXJzXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuU2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMgPSBbXTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IG5ldyBQb2ludCgwLCAwICk7XG4gICAgICAgIHRoaXMuc2NyZWVuU2l6ZSA9IHNjcmVlblNpemU7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgc2V0IENob2ljZXMoY2hvaWNlcyA6IENob2ljZVtdKSB7XG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IGNob2ljZXM7XG5cbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcyA9IFtdO1xuICAgICAgICBjb25zdCB3aWR0aCA9IDIwMDtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIGZvciAoY29uc3QgX2Nob2ljZSBvZiB0aGlzLmNob2ljZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nob2ljZSA9IG5ldyBDaG9pY2VCb3goX2Nob2ljZS5pbmRleCwgX2Nob2ljZS50ZXh0LCB3aWR0aCwgcG9zaXRpb24uQ2xvbmUoKSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZUJveGVzLnB1c2gobmV3Q2hvaWNlKTtcbiAgICAgICAgICAgIHBvc2l0aW9uLlkgKz0gbmV3Q2hvaWNlLkJvdW5kaW5nUmVjdC5TaXplLlkgKyA0MDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kaW5nUmVjdCA9IG5ldyBQb2ludCh3aWR0aCwgcG9zaXRpb24uWSAtIDQwKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IHRoaXMuc2NyZWVuU2l6ZS5EaXYobmV3IFBvaW50KDIpKS5TdWIodGhpcy5ib3VuZGluZ1JlY3QuRGl2KG5ldyBQb2ludCgyKSkpO1xuICAgIH1cblxuICAgIEFkZEJ1dHRvbihjaGFyYWN0ZXJzIDogQ2hhcmFjdGVycywgYnV0dG9uIDogQ2hvaWNlKSB7XG4gICAgICAgIC8vIGFkZCBpbWFnZSB0byBlYWNoIGJveFxuICAgICAgICBjb25zdCByZWN0SW1hZ2UgPSBjaGFyYWN0ZXJzLkdldEltYWdlKGJ1dHRvbi50ZXh0LCBcImRlZmF1bHRcIik7XG4gICAgICAgIGNvbnN0IHJlY3RJbWFnZUhvdmVyID0gY2hhcmFjdGVycy5HZXRJbWFnZShidXR0b24udGV4dCwgXCJob3ZlclwiKTtcbiAgICAgICAgdGhpcy5jaG9pY2VzLnB1c2goYnV0dG9uKTtcbiAgICAgICAgLy8gVG9kbyBhZGQgc3VwcG9ydCBmb3IgcGVyY2VudCBpZiAlIGluIHZhbHVlcz9cbiAgICAgICAgY29uc3QgbmV3QnV0dG9uID0gbmV3IENob2ljZUJveChidXR0b24ua25vdCwgYnV0dG9uLnRleHQsIDIwMCwgYnV0dG9uLnBvc2l0aW9uLCByZWN0SW1hZ2UsIHJlY3RJbWFnZUhvdmVyKTtcbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcy5wdXNoKG5ld0J1dHRvbik7XG4gICAgfVxuXG4gICAgQ2xlYXJCdXR0b25zKCl7XG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IFtdO1xuICAgICAgICB0aGlzLmNob2ljZUJveGVzID0gW107XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgIGZvciAoY29uc3QgY2hvaWNlQm94IG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcbiAgICAgICAgICAgIGNob2ljZUJveC5EcmF3KGNhbnZhcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG4gICAgICAgIGZvciAoY29uc3QgY2hvaWNlQm94IG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IGNob2ljZUJveC5Cb3VuZGluZ1JlY3Q7XG4gICAgICAgICAgICBib3VuZGluZ1JlY3QuUG9zaXRpb24gPSBib3VuZGluZ1JlY3QuUG9zaXRpb24uQWRkKHRoaXMudHJhbnNsYXRpb24pO1xuICAgICAgICAgICAgaWYgKGNsaWNrUG9zaXRpb24uSXNJblJlY3QoYm91bmRpbmdSZWN0KSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbihjaG9pY2VCb3guSWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBtb3VzZVBvc2l0aW9uID0gbW91c2VQb3NpdGlvbi5TdWIodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgIGlmICh0aGlzLmlzTW91c2VPbkNob2ljZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbW91c2VQb3NpdGlvbi5Jc0luUmVjdCh0aGlzLmlzTW91c2VPbkNob2ljZS5Cb3VuZGluZ1JlY3QpID8gbnVsbCA6IChjYW52YXMgOiBDYW52YXMpID0+IHtcbiAgICAgICAgICAgICAgICBjYW52YXMuU2V0Q3Vyc29yKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW91c2VPbkNob2ljZSA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaG9pY2Ugb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgICAgIGNob2ljZS5pc0hvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoY2hvaWNlLmlkICE9PSBudWxsICYmIG1vdXNlUG9zaXRpb24uSXNJblJlY3QoY2hvaWNlLkJvdW5kaW5nUmVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjYW52YXMgOiBDYW52YXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNb3VzZU9uQ2hvaWNlID0gY2hvaWNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzLlNldEN1cnNvcihcInBvaW50ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2UuaXNIb3ZlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHsgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExheWVyIHtcbiAgICBhYnN0cmFjdCBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RlcExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAgIGFic3RyYWN0IFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZDtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdhbWVwbGF5TGF5ZXIgZXh0ZW5kcyBTdGVwTGF5ZXIge1xuICAgIGFic3RyYWN0IE1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiA6IFBvaW50LCBhY3Rpb24gOiBGdW5jdGlvbikgOiB2b2lkO1xuICAgIGFic3RyYWN0IE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCAqIGZyb20gXCIuL2JhY2tncm91bmRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2NoYXJhY3RlcnNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2Nob2ljZWxheWVyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9zcGVlY2hsYXllclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHJhbnNpdGlvblwiO1xuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IEJveEJhY2tncm91bmQsIEJveEJhY2tncm91bmRGYWN0b3J5LCBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9ib3hiYWNrZ3JvdW5kc1wiO1xuaW1wb3J0IHsgR2FtZXBsYXlMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbmludGVyZmFjZSBJQm94Q29uZmlndXJhdGlvbiB7XG4gICAgQmFja2dyb3VuZCA6IHN0cmluZztcbiAgICBCYWNrZ3JvdW5kVHlwZSA6IEJveEJhY2tncm91bmRUeXBlcztcbiAgICBGb250Q29sb3IgOiBzdHJpbmc7XG4gICAgRm9udFNpemUgOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNwZWVjaEJveENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBJQm94Q29uZmlndXJhdGlvbiB7XG4gICAgSGVpZ2h0IDogbnVtYmVyO1xuICAgIElubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgT3V0ZXJNYXJnaW4gOiBQb2ludDtcbn1cblxuaW50ZXJmYWNlIElOYW1lQm94Q29uZmlndXJhdGlvbiBleHRlbmRzIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBIZWlnaHQgOiBudW1iZXI7XG4gICAgV2lkdGggOiBudW1iZXI7XG59XG5cbmNvbnN0IFJFV1JBUF9USElTX0xJTkUgPSBcIjxbe1JFV1JBUF9USElTX0xJTkV9XT5cIjtcblxuY2xhc3MgU3BlZWNoQm94IHtcbiAgICBwcml2YXRlIGJveEJhY2tncm91bmQgOiBCb3hCYWNrZ3JvdW5kO1xuICAgIHByaXZhdGUgZm9udENvbG9yIDogc3RyaW5nO1xuICAgIHByaXZhdGUgZm9udFNpemUgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50O1xuICAgIHByaXZhdGUgaW5uZXJTaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBuZXh0V29yZCA6IHN0cmluZztcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBzaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSB0ZXh0TGluZXMgOiBbc3RyaW5nP10gPSBbXCJcIl07XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiA6IFBvaW50LCBzaXplIDogUG9pbnQsIGNvbmZpZ3VyYXRpb24gOiBJU3BlZWNoQm94Q29uZmlndXJhdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24uQ2xvbmUoKTtcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZS5DbG9uZSgpO1xuICAgICAgICB0aGlzLmlubmVyTWFyZ2luID0gY29uZmlndXJhdGlvbi5Jbm5lck1hcmdpbjtcbiAgICAgICAgdGhpcy5pbm5lclNpemUgPSB0aGlzLnNpemUuU3ViKHRoaXMuaW5uZXJNYXJnaW4uTXVsdChuZXcgUG9pbnQoMikpKTtcblxuICAgICAgICBpZiAodGhpcy50ZXh0TGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUuQ2xvbmUoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSBjb25maWd1cmF0aW9uLkZvbnRTaXplO1xuICAgICAgICB0aGlzLmZvbnRDb2xvciA9IGNvbmZpZ3VyYXRpb24uRm9udENvbG9yO1xuICAgIH1cblxuICAgIGdldCBUZXh0KCkgOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0TGluZXMuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgc2V0IFRleHQodGV4dCA6IHN0cmluZykge1xuICAgICAgICBjb25zdCBfdGV4dCA9IHRoaXMuVGV4dDtcbiAgICAgICAgaWYgKHRleHQuaW5kZXhPZihfdGV4dCkgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNsaWNlID0gdGV4dC5zbGljZShfdGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV0gKz0gc2xpY2U7XG4gICAgICAgICAgICBpZiAoc2xpY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dFdvcmQgPSBSRVdSQVBfVEhJU19MSU5FO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ZXh0TGluZXMgPSBbdGV4dF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgTmV4dFdvcmQobmV4dFdvcmQgOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5uZXh0V29yZCA9IG5leHRXb3JkO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZD8uRHJhdyhjYW52YXMpO1xuXG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbi5BZGQodGhpcy5pbm5lck1hcmdpbikpO1xuXG4gICAgICAgIGlmICh0aGlzLm5leHRXb3JkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZG9UaGVXcmFwKGNhbnZhcyk7XG4gICAgICAgICAgICB0aGlzLm5leHRXb3JkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0TGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3VGV4dChcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lc1tpXSxcbiAgICAgICAgICAgICAgICBuZXcgUG9pbnQoMCwgaSAqICh0aGlzLmZvbnRTaXplICogMS40Mjg1NykpLCAvLyBUaGlzIGlzIHRoZSBnb2xkZW4gcmF0aW8sIG9uIGxpbmUtaGVpZ2h0IGFuZCBmb250LXNpemVcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRDb2xvcixcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJTaXplLlhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9UaGVXcmFwKGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLkRyYXdUZXh0MChcIlwiLCBcInRyYW5zcGFyZW50XCIsIHRoaXMuZm9udFNpemUpO1xuICAgICAgICBjb25zdCBjb21wID0gKGxpbmUgOiBzdHJpbmcpID0+IGNhbnZhcy5NZWFzdXJlVGV4dFdpZHRoKGxpbmUpID4gdGhpcy5pbm5lclNpemUuWDtcblxuICAgICAgICBsZXQgbGFzdExpbmUgPSB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXTtcblxuICAgICAgICBpZiAodGhpcy5uZXh0V29yZCA9PT0gUkVXUkFQX1RISVNfTElORSkge1xuICAgICAgICAgICAgLy8gTmVlZCB0byB3cmFwIHRoZSBmdWNrIG91dCBvZiB0aGlzIGxpbmVcbiAgICAgICAgICAgIHdoaWxlIChjb21wKGxhc3RMaW5lKSkge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0byB0aGUgY2hhciB3aGVyZSB3ZSdyZSBvdXRzaWRlIHRoZSBib3VkYXJpZXNcbiAgICAgICAgICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCFjb21wKGxhc3RMaW5lLnNsaWNlKDAsIG4pKSkgeyArK247IH1cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHByZXZpb3VzIHNwYWNlXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxhc3RMaW5lW25dICE9PSBcIiBcIiAmJiBuID49IDApIHsgLS1uOyB9XG4gICAgICAgICAgICAgICAgaWYgKG4gPT09IDApIHsgYnJlYWs7IH0gLy8gV2UgY2FuJ3Qgd3JhcCBtb3JlXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kLCB1cGRhdGUgbGFzdCBsaW5lLCBhbmQgYmFjayBpbiB0aGUgbG9vcFxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzLnB1c2gobGFzdExpbmUuc2xpY2UobiArIDEpKTsgLy8gKzEgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoZSBzcGFjZVxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDJdID0gbGFzdExpbmUuc2xpY2UoMCwgbik7XG4gICAgICAgICAgICAgICAgbGFzdExpbmUgPSB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21wKGxhc3RMaW5lICsgdGhpcy5uZXh0V29yZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXSA9IGxhc3RMaW5lLnNsaWNlKDAsIGxhc3RMaW5lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzLnB1c2goXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIE5hbWVCb3gge1xuICAgIHByaXZhdGUgYmFja2dyb3VuZFVSTCA6IHN0cmluZyA9IFwiaW1hZ2VzLzlwYXRjaC1zbWFsbC5wbmdcIjtcbiAgICBwcml2YXRlIGJveEJhY2tncm91bmQgOiBCb3hCYWNrZ3JvdW5kO1xuICAgIHByaXZhdGUgZm9udENvbG9yIDogc3RyaW5nO1xuICAgIHByaXZhdGUgZm9udFNpemUgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50O1xuICAgIHByaXZhdGUgbmFtZSA6IHN0cmluZztcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBzaXplIDogUG9pbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSU5hbWVCb3hDb25maWd1cmF0aW9uKTtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSU5hbWVCb3hDb25maWd1cmF0aW9uLCBuYW1lPyA6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQoY29uZmlndXJhdGlvbi5XaWR0aCwgY29uZmlndXJhdGlvbi5IZWlnaHQpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24uQ2xvbmUoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5ZIC09IHRoaXMuc2l6ZS5ZO1xuXG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4gPSB0aGlzLnNpemUuRGl2KG5ldyBQb2ludCgxMCwgMTApKTtcblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gY29uZmlndXJhdGlvbi5Gb250U2l6ZTtcbiAgICAgICAgdGhpcy5mb250Q29sb3IgPSBjb25maWd1cmF0aW9uLkZvbnRDb2xvcjtcblxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uLkJhY2tncm91bmRUeXBlLCBjb25maWd1cmF0aW9uLkJhY2tncm91bmQsXG4gICAgICAgICAgICB0aGlzLnNpemUuQ2xvbmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNldCBOYW1lKG5hbWUgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG5hbWUgIT09IHRoaXMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLmJveEJhY2tncm91bmQuRHJhdyhjYW52YXMpO1xuICAgICAgICAgICAgY2FudmFzLkRyYXdUZXh0KHRoaXMubmFtZSwgdGhpcy5pbm5lck1hcmdpbiwgdGhpcy5mb250Q29sb3IsIHRoaXMuZm9udFNpemUsIHRoaXMuc2l6ZS5YKTtcbiAgICAgICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcGVlY2hMYXllciBleHRlbmRzIEdhbWVwbGF5TGF5ZXIge1xuICAgIHByaXZhdGUgZnVsbFRleHQgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBuYW1lQm94IDogTmFtZUJveDtcbiAgICBwcml2YXRlIHRleHRBcHBlYXJlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHRleHRCb3ggOiBTcGVlY2hCb3g7XG4gICAgcHJpdmF0ZSB0ZXh0VGltZSA6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihzY3JlZW5TaXplIDogUG9pbnQsIHNwZWVjaEJveENvbmZpZ3VyYXRpb24gOiBJU3BlZWNoQm94Q29uZmlndXJhdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnN0IHRleHRCb3hTaXplID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5YIC0gKHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWCAqIDIpLFxuICAgICAgICAgICAgc3BlZWNoQm94Q29uZmlndXJhdGlvbi5IZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgdGV4dEJveFBvc2l0aW9uID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgc3BlZWNoQm94Q29uZmlndXJhdGlvbi5PdXRlck1hcmdpbi5YLFxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5ZIC0gc3BlZWNoQm94Q29uZmlndXJhdGlvbi5PdXRlck1hcmdpbi5ZIC0gc3BlZWNoQm94Q29uZmlndXJhdGlvbi5IZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy50ZXh0Qm94ID0gbmV3IFNwZWVjaEJveCh0ZXh0Qm94UG9zaXRpb24sIHRleHRCb3hTaXplLCBzcGVlY2hCb3hDb25maWd1cmF0aW9uKTtcblxuICAgICAgICB0aGlzLm5hbWVCb3ggPSBuZXcgTmFtZUJveChcbiAgICAgICAgICAgIHRleHRCb3hQb3NpdGlvbi5BZGQobmV3IFBvaW50KDcwLCAwKSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZCA6IHNwZWVjaEJveENvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kVHlwZSA6IHNwZWVjaEJveENvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsXG4gICAgICAgICAgICAgICAgRm9udENvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgIEZvbnRTaXplIDogMjQsXG4gICAgICAgICAgICAgICAgSGVpZ2h0IDogNDAsXG4gICAgICAgICAgICAgICAgV2lkdGggOiAxMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0Qm94LkRyYXcoY2FudmFzKTtcbiAgICAgICAgdGhpcy5uYW1lQm94LkRyYXcoY2FudmFzKTtcbiAgICB9XG5cbiAgICBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRleHRBcHBlYXJlZCkge1xuICAgICAgICAgICAgYWN0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRleHRCb3guVGV4dCA9IHRoaXMuZnVsbFRleHQ7XG4gICAgICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNb3VzZU1vdmUobW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IChfIDogQ2FudmFzKSA9PiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgU2F5KHRleHQgOiBzdHJpbmcsIG5hbWUgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEJveC5UZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMudGV4dEFwcGVhcmVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5uYW1lQm94Lk5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dFRpbWUgKz0gZGVsdGE7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMudGV4dFRpbWUgPj0gQ29uZmlnLlRleHRTcGVlZFJhdGlvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gdGhpcy5mdWxsVGV4dC5zbGljZSh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGgsIHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEJveC5UZXh0ICs9IGM7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IFwiIFwiICYmIHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCArIDIgPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZnVsbFRleHRbbl0gPT09IFwiIFwiICYmIG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkgeyArK247IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZnVsbFRleHRbbl0gIT09IFwiIFwiICYmIG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkgeyArK247IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRCb3guTmV4dFdvcmQgPSB0aGlzLmZ1bGxUZXh0LnNsaWNlKHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCArIDEsIG4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRleHRUaW1lID0gdGhpcy50ZXh0VGltZSAtIENvbmZpZy5UZXh0U3BlZWRSYXRpbztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IExpdGVFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBTdGVwTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zaXRpb24gZXh0ZW5kcyBTdGVwTGF5ZXIge1xuICAgIHByaXZhdGUgX29uRW5kIDogTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+ID0gbmV3IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPigpO1xuXG4gICAgcHJpdmF0ZSBiIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW1hZ2UgOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIHRpbWUgOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgdG90YWxUaW1lIDogbnVtYmVyID0gMjAwMC4wO1xuXG4gICAgY29uc3RydWN0b3IoaW1hZ2VEYXRhIDogSW1hZ2VEYXRhKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLy8gc2luIGVxdWF0aW9uOiB5ID0gYSpzaW4oYip4ICsgYykgKyBkXG4gICAgICAgIC8vIGEgc2luIHBlcmlvZCBpcyAyUEkgLyBiXG4gICAgICAgIC8vIHdlIHdhbnQgYSBoYWxmIHBlcmlvZCBvZiB0b3RhbFRpbWUgc28gd2UncmUgbG9va2luZyBmb3IgYjogYiA9IDJQSSAvIHBlcmlvZFxuICAgICAgICB0aGlzLmIgPSAoTWF0aC5QSSAqIDIpIC8gKHRoaXMudG90YWxUaW1lICogMik7XG5cbiAgICAgICAgY3JlYXRlSW1hZ2VCaXRtYXAoaW1hZ2VEYXRhKS50aGVuKGltYWdlID0+IHRoaXMuaW1hZ2UgPSBpbWFnZSk7XG4gICAgfVxuXG4gICAgZ2V0IE9uRW5kKCkgOiBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25FbmQuRXhwb3NlKCk7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3QmFja2dyb3VuZEltYWdlKHRoaXMuaW1hZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLkRyYXdSZWN0KG5ldyBQb2ludCgpLCBjYW52YXMuU2l6ZSwgYHJnYmEoMC4wLCAwLjAsIDAuMCwgJHtNYXRoLnNpbih0aGlzLmIgKiB0aGlzLnRpbWUpfSlgKTtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRpbWUgKz0gZGVsdGE7XG5cbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCAmJiB0aGlzLnRpbWUgPj0gdGhpcy50b3RhbFRpbWUgLyAyKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbWUgPj0gdGhpcy50b3RhbFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX29uRW5kLlRyaWdnZXIodGhpcywgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9jb25maWdcIjtcblxuY2xhc3MgQ2xhc3NMb2FkZXIge1xuICAgIExvYWRJbWFnZShVUkwgOiBzdHJpbmcpIDogUHJvbWlzZTxJbWFnZUJpdG1hcD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUgOiBGdW5jdGlvbiwgcmVqZWN0IDogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdvcmtlciA6IFdvcmtlciA9IHRoaXMuY3JlYXRlV29ya2VyKCk7XG5cbiAgICAgICAgICAgIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZ0IDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2dC5kYXRhLmVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGV2dC5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZShDb25maWcuUm9vdFBhdGhJc1JlbW90ZSA/XG4gICAgICAgICAgICAgICAgYGh0dHBzOi8vJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHtVUkx9YFxuICAgICAgICAgICAgICAgIDogYCR7Q29uZmlnLlJvb3RQYXRoID8gQ29uZmlnLlJvb3RQYXRoICsgXCIvXCIgOiBcIlwifSR7d2luZG93LmxvY2F0aW9uLmhyZWYucmVwbGFjZSgvW15cXFxcXFwvXSokLywgXCJcIil9JHtVUkx9YCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlV29ya2VyKCkgOiBXb3JrZXIge1xuICAgICAgICByZXR1cm4gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtgKGZ1bmN0aW9uICR7dGhpcy53b3JrZXJ9KSgpYF0pKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3b3JrZXIoKSB7XG4gICAgICAgIGNvbnN0IGN0eCA6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xuICAgICAgICBjdHguYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2dCA6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgZmV0Y2goZXZ0LmRhdGEpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYmxvYigpKS50aGVuKGJsb2JEYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChibG9iRGF0YSkudGhlbihpbWFnZSA9PiBjdHgucG9zdE1lc3NhZ2UoaW1hZ2UpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBMb2FkZXIgPSBuZXcgQ2xhc3NMb2FkZXIoKTtcbiIsImltcG9ydCAqIGFzIElua0pzIGZyb20gXCJpbmtqc1wiO1xuaW1wb3J0IHsgQXVkaW8sIEF1ZGlvRmFjdG9yeSB9IGZyb20gXCIuL2F1ZGlvXCI7XG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi9jYW52YXNcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZFR5cGVzIH0gZnJvbSBcIi4vbGF5ZXJzL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQgKiBhcyBMYXllcnMgZnJvbSBcIi4vbGF5ZXJzL2xheWVyc1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuaW1wb3J0IHsgUHJlbG9hZGVyIH0gZnJvbSBcIi4vcHJlbG9hZGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBWTiB7XG4gICAgQXVkaW8gOiBBdWRpbztcbiAgICBDYW52YXMgOiBDYW52YXM7XG4gICAgU3RvcnkgOiBJbmtKcy5TdG9yeTtcblxuICAgIHByaXZhdGUgYmFja2dyb3VuZCA6IExheWVycy5CYWNrZ3JvdW5kO1xuICAgIHByaXZhdGUgY2hhcmFjdGVycyA6IExheWVycy5DaGFyYWN0ZXJzO1xuICAgIHByaXZhdGUgY2hvaWNlU2NyZWVuIDogTGF5ZXJzLkNob2ljZUxheWVyO1xuICAgIHByaXZhdGUgY3VycmVudFNjcmVlbiA6IExheWVycy5HYW1lcGxheUxheWVyIHwgbnVsbDtcbiAgICBwcml2YXRlIGh1ZFNjcmVlbiA6IHN0cmluZztcbiAgICBwcml2YXRlIGh1ZFNjcmVlbnMgOiB7IFtrZXkgOiBzdHJpbmddIDogTGF5ZXJzLkNob2ljZUxheWVyIH07XG4gICAgcHJpdmF0ZSBwcmV2aW91c1RpbWVzdGFtcCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHNwZWFraW5nQ2hhcmFjdGVyTmFtZSA6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBzcGVlY2hTY3JlZW4gOiBMYXllcnMuU3BlZWNoTGF5ZXI7XG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uIDogTGF5ZXJzLlRyYW5zaXRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihzdG9yeUZpbGVuYW1lT3JPYmplY3QgOiBzdHJpbmcgfCBvYmplY3QsIGNvbnRhaW5lcklEIDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQXVkaW8gPSBBdWRpb0ZhY3RvcnkuQ3JlYXRlKCk7XG4gICAgICAgIHRoaXMuQ2FudmFzID0gbmV3IENhbnZhcyhjb250YWluZXJJRCwgQ29uZmlnLlNjcmVlblNpemUpO1xuXG4gICAgICAgIGNvbnN0IGluaXRTdG9yeSA9IChyYXdTdG9yeSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5TdG9yeSA9IG5ldyBJbmtKcy5TdG9yeShyYXdTdG9yeSk7XG4gICAgICAgICAgICBDb25maWcuTG9hZCh0aGlzLlN0b3J5Lmdsb2JhbFRhZ3MgfHwgW10pO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuU2l6ZSA9IENvbmZpZy5TY3JlZW5TaXplO1xuXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgTGF5ZXJzLkJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IG5ldyBMYXllcnMuQ2hhcmFjdGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbiA9IG5ldyBMYXllcnMuU3BlZWNoTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSwge1xuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBcInJnYmEoMC4wLCAwLjAsIDAuMCwgMC43NSlcIixcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kVHlwZSA6IEJveEJhY2tncm91bmRUeXBlcy5DT0xPUixcbiAgICAgICAgICAgICAgICBGb250Q29sb3IgOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiAyMDAsXG4gICAgICAgICAgICAgICAgSW5uZXJNYXJnaW4gOiBuZXcgUG9pbnQoMzUpLFxuICAgICAgICAgICAgICAgIE91dGVyTWFyZ2luIDogbmV3IFBvaW50KDUwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbiA9IG5ldyBMYXllcnMuQ2hvaWNlTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLk9uQ2xpY2suT24odGhpcy5tb3VzZUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuT25Nb3ZlLk9uKHRoaXMubW91c2VNb3ZlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzVGltZXN0YW1wID0gMDtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yeUZpbGVuYW1lT3JPYmplY3QgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGZldGNoKHN0b3J5RmlsZW5hbWVPck9iamVjdCkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4oaW5pdFN0b3J5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluaXRTdG9yeShKU09OLnN0cmluZ2lmeShzdG9yeUZpbGVuYW1lT3JPYmplY3QpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG1ha2VIdWQoaHVkTmFtZTogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBpZiAoIShodWROYW1lIGluIHRoaXMuaHVkU2NyZWVucykpIHtcbiAgICAgICAgICAgIHRoaXMuaHVkU2NyZWVuc1todWROYW1lXSA9IG5ldyBMYXllcnMuQ2hvaWNlTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0ZWQgbmV3IEhVRFwiLCB0aGlzLmh1ZFNjcmVlbnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29tcHV0ZVRhZ3MoKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBnZXRGaW5hbFZhbHVlID0gKHZhbHVlIDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZU1hdGNoID0gdmFsdWUubWF0Y2goL15cXHsoXFx3KylcXH0kLyk7XG4gICAgICAgICAgICBpZiAodmFsdWVNYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuU3RvcnkudmFyaWFibGVzU3RhdGUuJCh2YWx1ZU1hdGNoWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB0YWdzID0gdGhpcy5TdG9yeS5jdXJyZW50VGFncztcbiAgICAgICAgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSB0YWdzW2ldLm1hdGNoKC9eKFxcdyspXFxzKjpcXHMqKC4qKSQvKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGtub3cgd2hhdCB0YWcgaXQgaXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5IDogc3RyaW5nID0gbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlIDogc3RyaW5nID0gZ2V0RmluYWxWYWx1ZShtYXRjaFsyXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbG93IGdldHRpbmcgdmFyaWFibGUgdmFsdWVzIGluc2lkZSB0YWdzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9ICB2YWx1ZS5tYXRjaCgvKFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKS9nKS5tYXAodiA9PiAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdi5tYXRjaCgveyguKj8pfS8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChrZXkgJiYga2V5Lmxlbmd0aCA+IDEpID8gdGhpcy5TdG9yeS52YXJpYWJsZXNTdGF0ZS4kKGtleVsxXSkgOiB2O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coa2V5LCBcIlBBUkFNU1wiLHBhcmFtcylcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmVsb2FkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zcGxpdChcIixcIikuZm9yRWFjaChfdmFsdWUgPT4gUHJlbG9hZGVyLlByZWxvYWQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZy5Sb290UGF0aElzUmVtb3RlID8gYGh0dHBzOi8vJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHtfdmFsdWUudHJpbSgpfWAgOiBgJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHtfdmFsdWUudHJpbSgpfWApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiZ0ltYWdlID0gcGFyYW1zLmxlbmd0aCA+IDEgPyB0aGlzLmNoYXJhY3RlcnMuR2V0SW1hZ2UocGFyYW1zWzBdLCAgcGFyYW1zWzFdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmQuQmFja2dyb3VuZEltYWdlID0gYmdJbWFnZSB8fCB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkFkZCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJ1dHRvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kb190aGluZyB5YXklcy5wbmcgMzAgMjBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDQgKSB7IC8vIG5vIGh1ZCB3YXMgcGFzc2VkLCBhZGQgdG8gc2NlbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvaWNlU2NyZWVuLkFkZEJ1dHRvbih0aGlzLmNoYXJhY3RlcnMsIHtrbm90OiBwYXJhbXNbMF0sIHRleHQ6IHBhcmFtc1sxXSwgcG9zaXRpb246IG5ldyBQb2ludChwYXJzZUludChwYXJhbXNbMl0pLCBwYXJzZUludChwYXJhbXNbM10pKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDUgKSB7IC8vIGh1ZCB3YXMgcGFzc2VkLCBhZGQgdG8gaHVkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kb190aGluZyB5YXklcy5wbmcgMzAgMjAgaHVkTmFtZSAtIG1ha2UgYSBodWQgaWYgaXQgZG9lc250IGV4aXN0LCBhZGQgdGhpcyBidXR0b24gdG8gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh1ZE5hbWUgPSBwYXJhbXNbNF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ha2VIdWQoaHVkTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnNbaHVkTmFtZV0uQWRkQnV0dG9uKHRoaXMuY2hhcmFjdGVycywge2tub3Q6IHBhcmFtc1swXSwgdGV4dDogcGFyYW1zWzFdLCBwb3NpdGlvbjogbmV3IFBvaW50KHBhcnNlSW50KHBhcmFtc1syXSksIHBhcnNlSW50KHBhcmFtc1szXSkpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGFiZWxcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXCJteSBib3JpbmcgbGFiZWxcIiAzMCAyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMyApIHsgLy8gbm8gaHVkIHdhcyBwYXNzZWQsIGFkZCB0byBzY2VuZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4uQWRkQnV0dG9uKHRoaXMuY2hhcmFjdGVycywge2tub3Q6IG51bGwsIHRleHQ6IHBhcmFtc1swXSwgcG9zaXRpb246IG5ldyBQb2ludChwYXJzZUludChwYXJhbXNbMV0pLCBwYXJzZUludChwYXJhbXNbMl0pKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDQgKSB7IC8vIGh1ZCB3YXMgcGFzc2VkLCBhZGQgdG8gaHVkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cIm15IGJvcmluZyBsYWJlbFwiIDMwIDIwIGh1ZE5hbWUgLSBtYWtlIGEgaHVkIGlmIGl0IGRvZXNudCBleGlzdCwgYWRkIHRoaXMgYnV0dG9uIHRvIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBodWROYW1lID0gcGFyYW1zWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWtlSHVkKGh1ZE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odWRTY3JlZW5zW2h1ZE5hbWVdLkFkZEJ1dHRvbih0aGlzLmNoYXJhY3RlcnMsIHtrbm90OiBudWxsLCB0ZXh0OiBwYXJhbXNbMF0sIHBvc2l0aW9uOiBuZXcgUG9pbnQocGFyc2VJbnQocGFyYW1zWzFdKSwgcGFyc2VJbnQocGFyYW1zWzJdKSl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJodWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh1ZE5hbWUgPSBwYXJhbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodWROYW1lIGluIHRoaXMuaHVkU2NyZWVucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odWRTY3JlZW4gPSBodWROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNob3dcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5TaG93KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkhpZGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5IaWRlQWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmdtXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkF1ZGlvLlBsYXlCR00odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uU3RvcEJHTSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZnhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheVNGWCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNpdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uID0gbmV3IExheWVycy5UcmFuc2l0aW9uKHRoaXMuQ2FudmFzLkdldEltYWdlRGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uT25FbmQuT24oKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBVbmtub3duIHRhZ3MgYXJlIHRyZWF0ZWQgYXMgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUgPSBnZXRGaW5hbFZhbHVlKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29udGludWUoKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKHRoaXMuU3RvcnkuY2FuQ29udGludWUpIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ29udGludWUoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU3RvcnkuY3VycmVudFRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250aW51ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VTY3JlZW4uY2hvaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU0hPVyBDSE9JQ0VcIiwgdGhpcy5TdG9yeS5jdXJyZW50VGV4dClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5jaG9pY2VTY3JlZW4gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0aWxsIHJlcXVpcmVkIGZvciBpbml0aWF0aW9uIHdoZW4gdGhlcmUgaXMgbm8gdGV4dFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgRU1QVFkgVEVYVFwiLCB0aGlzLlN0b3J5LmN1cnJlbnRUZXh0KVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgVEVYVFwiLCB0aGlzLlN0b3J5LmN1cnJlbnRUZXh0KVxuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuc3BlZWNoU2NyZWVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU3RvcnkuY3VycmVudENob2ljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4uQ2hvaWNlcyA9IHRoaXMuU3RvcnkuY3VycmVudENob2ljZXM7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLmNob2ljZVNjcmVlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRPRE8gSXQncyB0aGUgZW5kXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJDVVJSRU5UIFNDUkVFTlwiLCB0aGlzLmN1cnJlbnRTY3JlZW4sIHRoaXMuU3RvcnkuY3VycmVudFRleHQpXG5cbiAgICAgICAgLy8gSGlkZSBvciBsb2NrIGh1ZFxuICAgICAgICBpZiAodGhpcy5odWRTY3JlZW4gPT09IFwib3ZlcnZpZXdcIiAgJiYgXCJvdmVydmlld1wiIGluIHRoaXMuaHVkU2NyZWVucykge1xuICAgICAgICAgICAgdGhpcy5odWRTY3JlZW5zW1wib3ZlcnZpZXdcIl0udmlzaWJsZSA9ICEodGhpcy5jdXJyZW50U2NyZWVuIGluc3RhbmNlb2YgTGF5ZXJzLlNwZWVjaExheWVyIHx8IHRoaXMuY3VycmVudFNjcmVlbiBpbnN0YW5jZW9mIExheWVycy5DaG9pY2VMYXllcik7XG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZUNsaWNrKHNlbmRlciA6IENhbnZhcywgY2xpY2tQb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY3JlZW4gaW5zdGFuY2VvZiBMYXllcnMuQ2hvaWNlTGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sIHRoaXMudmFsaWRhdGVDaG9pY2UuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4/Lk1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiwgKCkgPT4gdGhpcy5jb250aW51ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5odWRTY3JlZW4gaW4gdGhpcy5odWRTY3JlZW5zKSB7XG4gICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnNbdGhpcy5odWRTY3JlZW5dLk1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiwgdGhpcy52YWxpZGF0ZUNob2ljZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbW91c2VNb3ZlKHNlbmRlciA6IENhbnZhcywgbW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY3VycmVudFNjcmVlbj8uTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24pO1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soc2VuZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmh1ZFNjcmVlbiBpbiB0aGlzLmh1ZFNjcmVlbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrSHVkID0gdGhpcy5odWRTY3JlZW5zW3RoaXMuaHVkU2NyZWVuXS5Nb3VzZU1vdmUobW91c2VQb3NpdGlvbik7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tIdWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrSHVkKHNlbmRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdFN0ZXAoKSA6IHZvaWQge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RlcC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0ZXAodGltZXN0YW1wIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNUaW1lc3RhbXA7XG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG5cbiAgICAgICAgdGhpcy5DYW52YXMuQ2xlYXIoKTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbj8uU3RlcChkZWx0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhY2tncm91bmQuRHJhdyh0aGlzLkNhbnZhcyk7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVycy5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgaWYgKHRoaXMuaHVkU2NyZWVuICYmIHRoaXMuaHVkU2NyZWVuIGluIHRoaXMuaHVkU2NyZWVucykge1xuICAgICAgICAgICAgdGhpcy5odWRTY3JlZW5zW3RoaXMuaHVkU2NyZWVuXS5EcmF3KHRoaXMuQ2FudmFzKTsgLy9kcmF3IG9uZSBvZiBhIG51bWJlciBvZiBodWRzLCBjcmVhdGVkIHdoZW4gYWRkaW5nIGJ1dHRvbnNcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbj8uRHJhdyh0aGlzLkNhbnZhcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXF1ZXN0U3RlcCgpO1xuICAgIH1cblxuICAgIC8vIHdoZW4gbnVtYmVyLGl0cyBhIGNob2ljZUluZGV4LCB3aGVuIHN0cmluZyAtIGl0cyBhIGtub3RcbiAgICBwcml2YXRlIHZhbGlkYXRlQ2hvaWNlKGNob2ljZSA6IG51bWJlciB8IHN0cmluZyB8IG51bGwpIDogdm9pZCB7XG4gICAgICAgIGlmIChjaG9pY2UgPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYgKHR5cGVvZiBjaG9pY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ2hvb3NlUGF0aFN0cmluZyhjaG9pY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5TdG9yeS5DaG9vc2VDaG9pY2VJbmRleChjaG9pY2UpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuY2hhcmFjdGVycy5IaWRlQWxsKCk7XG4gICAgICAgIHRoaXMuY29udGludWUoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIElSZWN0IHtcbiAgICBQb3NpdGlvbiA6IFBvaW50O1xuICAgIFNpemUgOiBQb2ludDtcbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50IHtcbiAgICBwcml2YXRlIHggOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB5IDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBjb25zdHJ1Y3Rvcih4IDogbnVtYmVyKTtcbiAgICBjb25zdHJ1Y3Rvcih4IDogbnVtYmVyLCB5IDogbnVtYmVyKTtcbiAgICBjb25zdHJ1Y3Rvcih4PyA6IG51bWJlciwgeT8gOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XG4gICAgICAgIHRoaXMueSA9IHkgIT0gbnVsbCA/IHkgOiB4ICE9IG51bGwgPyB4IDogMDtcbiAgICB9XG5cbiAgICBnZXQgWCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9XG5cbiAgICBzZXQgWCh4IDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgfVxuXG4gICAgZ2V0IFkoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgfVxuXG4gICAgc2V0IFkoeSA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIEFkZChwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlggKyBwb2ludC5YLCB0aGlzLlkgKyBwb2ludC5ZKTtcbiAgICB9XG5cbiAgICBDbG9uZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCwgdGhpcy5ZKTtcbiAgICB9XG5cbiAgICBEaXYocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YIC8gcG9pbnQuWCwgdGhpcy5ZIC8gcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgUGVyY2VudChwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCgocG9pbnQuWCAvIDEwMCkgKiB0aGlzLlggLCAocG9pbnQuWSAvIDEwMCkgKiB0aGlzLlkpO1xuICAgIH1cblxuICAgIElzSW5SZWN0KHJlY3QgOiBJUmVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5YID49IHJlY3QuUG9zaXRpb24uWCAmJiB0aGlzLlggPD0gcmVjdC5Qb3NpdGlvbi5BZGQocmVjdC5TaXplKS5YXG4gICAgICAgICAgICAmJiB0aGlzLlkgPj0gcmVjdC5Qb3NpdGlvbi5ZICYmIHRoaXMuWSA8PSByZWN0LlBvc2l0aW9uLkFkZChyZWN0LlNpemUpLlk7XG4gICAgfVxuXG4gICAgTXVsdChwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlggKiBwb2ludC5YLCB0aGlzLlkgKiBwb2ludC5ZKTtcbiAgICB9XG5cbiAgICBTdWIocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiB0aGlzLkFkZChuZXcgUG9pbnQoLXBvaW50LlgsIC1wb2ludC5ZKSk7XG4gICAgfVxufVxuIiwiY2xhc3MgQ2xhc3NQcmVsb2FkZXIge1xuICAgIFByZWxvYWQodXJsIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBmZXRjaCh1cmwpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFByZWxvYWRlciA9IG5ldyBDbGFzc1ByZWxvYWRlcigpO1xuIl19
