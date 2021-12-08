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
    constructor(screenSize) {
        super();
        this.choices = [];
        this.choiceBoxes = [];
        this.isMouseOnChoice = null;
        this.choiceBoxes = [];
        this.translation = new point_1.Point(0, 0);
        this.screenSize = screenSize;
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
        canvas.Translate(this.translation);
        for (const choiceBox of this.choiceBoxes) {
            choiceBox.Draw(canvas);
        }
        canvas.Restore();
    }
    MouseClick(clickPosition, action) {
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
                    console.log("PARAMS", params);
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
                    this.currentScreen = this.choiceScreen;
                }
                else {
                    // still required for initiation when there is no text
                    this.speechScreen.Say(this.Story.currentText, this.speakingCharacterName);
                    this.currentScreen = this.speechScreen;
                }
            }
            else {
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
    }
    mouseClick(sender, clickPosition) {
        if (this.transition != null) {
            return;
        }
        if (this.currentScreen instanceof Layers.ChoiceLayer) {
            this.currentScreen.MouseClick(clickPosition, this.validateChoice.bind(this));
        }
        else {
            this.currentScreen.MouseClick(clickPosition, () => this.continue());
        }
        if (this.hudScreen in this.hudScreens) {
            this.hudScreens[this.hudScreen].MouseClick(clickPosition, this.validateChoice.bind(this));
        }
    }
    mouseMove(sender, mousePosition) {
        const callback = this.currentScreen.MouseMove(mousePosition);
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
        const delta = timestamp - this.previousTimestamp;
        this.previousTimestamp = timestamp;
        this.Canvas.Clear();
        if (this.transition != null) {
            this.transition.Step(delta);
        }
        else {
            this.currentScreen.Step(delta);
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
            this.currentScreen.Draw(this.Canvas);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsdUNBQXVDO0FBRXZDLE1BQWEsWUFBWTtJQUNyQixNQUFNLENBQUMsTUFBTTtRQUNULElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksY0FBYyxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSjtBQVJELG9DQVFDO0FBRUQsTUFBc0IsS0FBSztDQUkxQjtBQUpELHNCQUlDO0FBRUQsTUFBTSxjQUFlLFNBQVEsS0FBSztJQUk5QixPQUFPLENBQUMsTUFBZTtRQUNuQixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsT0FBTyxFQUFHO29CQUNOLElBQUksRUFBRyxJQUFJO29CQUNYLElBQUksRUFBRyxNQUFNO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUcsTUFBTTthQUNsQixFQUFFLEdB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SSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUF4REQsc0JBd0RDOzs7Ozs7QUM3REQsTUFBTSxjQUFjO0lBQ2hCLE9BQU8sQ0FBQyxHQUFZO1FBQ2hCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQUVZLFFBQUEsU0FBUyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyBQaXp6aWNhdG8gZnJvbSBcInBpenppY2F0b1wiO1xuXG5leHBvcnQgY2xhc3MgQXVkaW9GYWN0b3J5IHtcbiAgICBzdGF0aWMgQ3JlYXRlKCkgOiBBdWRpbyB7XG4gICAgICAgIGlmIChQaXp6aWNhdG8gIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQaXp6aWNhdG9BdWRpbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEdW1teUF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBdWRpbyB7XG4gICAgYWJzdHJhY3QgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZDtcbiAgICBhYnN0cmFjdCBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkO1xuICAgIGFic3RyYWN0IFN0b3BCR00oKSA6IHZvaWQ7XG59XG5cbmNsYXNzIFBpenppY2F0b0F1ZGlvIGV4dGVuZHMgQXVkaW8ge1xuICAgIHByaXZhdGUgYmdtIDogUGl6emljYXRvLlNvdW5kO1xuICAgIHByaXZhdGUgYmdtVVJMIDogc3RyaW5nO1xuXG4gICAgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGlmIChiZ21VUkwgIT09IHRoaXMuYmdtVVJMKSB7XG4gICAgICAgICAgICB0aGlzLmJnbVVSTCA9IGJnbVVSTDtcblxuICAgICAgICAgICAgY29uc3QgYmdtID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9vcCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHBhdGggOiBiZ21VUkxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmdtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnbS5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJnbS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iZ20gPSBiZ207XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBzZnggPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7IHBhdGggOiBzZnhVUkwgfSxcbiAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXG4gICAgICAgIH0sICgpID0+IHNmeC5wbGF5KCkpO1xuICAgIH1cblxuICAgIFN0b3BCR00oKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iZ20gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5iZ20uZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgdGhpcy5iZ21VUkwgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5iZ20gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBEdW1teUF1ZGlvIGV4dGVuZHMgQXVkaW8ge1xuICAgIFBsYXlCR00oYmdtVVJMIDogc3RyaW5nKSA6IHZvaWQgeyB9XG4gICAgUGxheVNGWChzZnhVUkwgOiBzdHJpbmcpIDogdm9pZCB7IH1cbiAgICBTdG9wQkdNKCkgOiB2b2lkIHsgfVxufVxuIiwiaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcbiAgICBwcml2YXRlIF9vbkNsaWNrIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+ID0gbmV3IExpdGVFdmVudDxDYW52YXMsIFBvaW50PigpO1xuICAgIHByaXZhdGUgX29uTW92ZSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiA9IG5ldyBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4oKTtcbiAgICBwcml2YXRlIGN0eCA6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIGVsZW1lbnQgOiBIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklEIDogc3RyaW5nLCBzaXplIDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySUQpO1xuXG4gICAgICAgIGlmIChjb250YWluZXIudGFnTmFtZSA9PT0gXCJjYW52YXNcIikge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gY29udGFpbmVyIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LndpZHRoID0gc2l6ZS5YO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gc2l6ZS5ZO1xuXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLl9jbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5fbW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLkNsZWFyKCk7XG4gICAgfVxuXG4gICAgZ2V0IFNpemUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIHNldCBTaXplKHNpemUgOiBQb2ludCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBzaXplLlg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBzaXplLlk7XG4gICAgfVxuXG4gICAgQ2xlYXIoKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3QmFja2dyb3VuZEltYWdlKGltYWdlIDogSW1hZ2VCaXRtYXApIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3SW1hZ2UoaW1hZ2UgOiBJbWFnZUJpdG1hcCwgcG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltYWdlLCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3SW1hZ2VUbyhpbWFnZSA6IEltYWdlQml0bWFwLCBzb3VyY2UgOiBJUmVjdCwgZGVzdGluYXRpb24gOiBJUmVjdCkge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgIHNvdXJjZS5Qb3NpdGlvbi5YLCBzb3VyY2UuUG9zaXRpb24uWSxcbiAgICAgICAgICAgIHNvdXJjZS5TaXplLlgsIHNvdXJjZS5TaXplLlksXG4gICAgICAgICAgICBkZXN0aW5hdGlvbi5Qb3NpdGlvbi5YLCBkZXN0aW5hdGlvbi5Qb3NpdGlvbi5ZLFxuICAgICAgICAgICAgZGVzdGluYXRpb24uU2l6ZS5YLCBkZXN0aW5hdGlvbi5TaXplLllcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBEcmF3UmVjdChwb3NpdGlvbiA6IFBvaW50LCBzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QocG9zaXRpb24uWCwgcG9zaXRpb24uWSwgc2l6ZS5YLCBzaXplLlkpO1xuICAgIH1cblxuICAgIERyYXdSZWN0MChzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLkRyYXdSZWN0KG5ldyBQb2ludCgpLCBzaXplLCBjb2xvcik7XG4gICAgfVxuXG4gICAgRHJhd1RleHQodGV4dCA6IHN0cmluZywgcG9zaXRpb24gOiBQb2ludCwgY29sb3IgOiBzdHJpbmcsIGZvbnRTaXplIDogbnVtYmVyLCBtYXhXaWR0aD8gOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XG4gICAgICAgIHRoaXMuY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KHRleHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIFwiJDFcIiksIHBvc2l0aW9uLlgsIHBvc2l0aW9uLlksIG1heFdpZHRoKTtcbiAgICB9XG5cbiAgICBEcmF3VGV4dDAodGV4dCA6IHN0cmluZywgY29sb3IgOiBzdHJpbmcsIGZvbnRTaXplIDogbnVtYmVyLCBtYXhXaWR0aD8gOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuRHJhd1RleHQodGV4dCwgbmV3IFBvaW50KCksIGNvbG9yLCBmb250U2l6ZSwgbWF4V2lkdGgpO1xuICAgIH1cblxuICAgIEdldEltYWdlRGF0YSgpIDogSW1hZ2VEYXRhIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLlNpemUuWCwgdGhpcy5TaXplLlkpO1xuICAgIH1cblxuICAgIE1lYXN1cmVUZXh0V2lkdGgodGV4dCA6IHN0cmluZykgOiBudW1iZXIge1xuICAgICAgICAvLyBXZSBtZWFzdXJlIHdpdGggdGhlIGxhc3QgZm9udCB1c2VkIGluIHRoZSBjb250ZXh0XG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgICB9XG5cbiAgICBSZXN0b3JlKCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIFNldEN1cnNvcihjdXJzb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgfVxuXG4gICAgVHJhbnNsYXRlKHBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuUmVzdG9yZSgpO1xuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZKTtcbiAgICB9XG5cbiAgICBnZXQgT25DbGljaygpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uQ2xpY2suRXhwb3NlKCk7XG4gICAgfVxuXG4gICAgZ2V0IE9uTW92ZSgpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uTW92ZS5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbGljayhldiA6IE1vdXNlRXZlbnQpIDogdm9pZCB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuX29uQ2xpY2suVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXG4gICAgICAgICAgICBldi5wYWdlWCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX21vdmUoZXYgOiBNb3VzZUV2ZW50KSA6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbk1vdmUuVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXG4gICAgICAgICAgICBldi5wYWdlWCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEhpZGRlbkNhbnZhcyBleHRlbmRzIENhbnZhcyB7XG4gICAgcHJpdmF0ZSBoaWRkZW5FbGVtZW50IDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzaXplIDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBgY18ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyLCA3KX1gO1xuICAgICAgICBjb25zdCBoaWRkZW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgaGlkZGVuRWxlbWVudC5pZCA9IGlkO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGhpZGRlbkVsZW1lbnQpO1xuXG4gICAgICAgIHN1cGVyKGlkLCBzaXplKTtcblxuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnQgPSBoaWRkZW5FbGVtZW50O1xuICAgIH1cblxuICAgIERlc3Ryb3koKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuXG5jbGFzcyBDbGFzc0NvbmZpZyB7XG4gICAgRGVmYXVsdFRleHRTcGVlZCA6IG51bWJlciA9IDMwO1xuICAgIFJvb3RQYXRoIDogc3RyaW5nID0gXCJcIjtcbiAgICBSb290UGF0aElzUmVtb3RlOiBib29sZWFuID0gZmFsc2U7XG4gICAgU2NyZWVuU2l6ZSA6IFBvaW50ID0gbmV3IFBvaW50KDgwMCwgNjAwKTtcblxuICAgIHByaXZhdGUgdGV4dFNwZWVkIDogbnVtYmVyO1xuICAgIHByaXZhdGUgdGV4dFNwZWVkUmF0aW8gOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5UZXh0U3BlZWQgPSB0aGlzLkRlZmF1bHRUZXh0U3BlZWQ7IC8vIFRoaXMgaXMgaW4gY2hhciBwZXIgc2Vjb25kXG4gICAgfVxuXG4gICAgTG9hZCh0YWdzIDogc3RyaW5nW10pIDogdm9pZCB7XG4gICAgICAgIGZ1bmN0aW9uIGVycm9yKHRhZyA6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyB0YWc6IFwiJHt0YWd9XCJgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGtleSwgdmFsdWU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGtleSA9IHRhZ3NbaV0uc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRhZ3NbaV0uc3BsaXQoXCI6XCIpWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih0YWdzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5fc2l6ZVwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NyZWVuc2l6ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gdmFsdWUuc3BsaXQoL1xcRCsvKS5tYXAoeCA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUubGVuZ3RoID09PSAyICYmICFpc05hTihzaXplWzBdKSAmJiAhaXNOYU4oc2l6ZVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmVlblNpemUgPSBuZXcgUG9pbnQoc2l6ZVswXSwgc2l6ZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZXh0X3NwZWVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZXh0c3BlZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BlZWQgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihzcGVlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRlZmF1bHRUZXh0U3BlZWQgPSB0aGlzLlRleHRTcGVlZCA9IHNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdF9wYXRoXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290cGF0aFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvb3RQYXRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdF9wYXRoX2lzX3JlbW90ZVwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdHBhdGhpc3JlbW90ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvb3RQYXRoSXNSZW1vdGUgPSB2YWx1ZSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih0YWdzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgVGV4dFNwZWVkKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0U3BlZWQ7XG4gICAgfVxuXG4gICAgc2V0IFRleHRTcGVlZCh2YWx1ZSA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnRleHRTcGVlZCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRleHRTcGVlZFJhdGlvID0gMTAwMC4wIC8gdGhpcy50ZXh0U3BlZWQ7XG4gICAgfVxuXG4gICAgZ2V0IFRleHRTcGVlZFJhdGlvKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0U3BlZWRSYXRpbztcbiAgICB9XG59XG5cbmV4cG9ydCBsZXQgQ29uZmlnID0gbmV3IENsYXNzQ29uZmlnKCk7XG4iLCJleHBvcnQgY2xhc3MgTGl0ZUV2ZW50PFQxLCBUMj4ge1xuICAgIHByaXZhdGUgaGFuZGxlcnMgOiBBcnJheTwoc2VuZGVyIDogVDEsIGFyZz8gOiBUMikgPT4gdm9pZD4gPSBbXTtcblxuICAgIEV4cG9zZSgpIDogTGl0ZUV2ZW50PFQxLCBUMj4ge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBPZmYoaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5maWx0ZXIoX2hhbmRsZXIgPT4gX2hhbmRsZXIgIT09IGhhbmRsZXIpO1xuICAgIH1cblxuICAgIE9uKGhhbmRsZXIgOiAoc2VuZGVyIDogVDEsIGFyZz8gOiBUMikgPT4gdm9pZCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIFRyaWdnZXIoc2VuZGVyIDogVDEsIGFyZ3M/IDogVDIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IGhhbmRsZXIoc2VuZGVyLCBhcmdzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBMYXllciB7XG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kSW1hZ2UgOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIGJhY2tncm91bmRJbWFnZVVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCk7XG4gICAgY29uc3RydWN0b3IoaW1hZ2VVUkw/IDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKGltYWdlVVJMICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZEltYWdlID0gaW1hZ2VVUkw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgQmFja2dyb3VuZEltYWdlKGltYWdlVVJMIDogc3RyaW5nIHwgSW1hZ2VCaXRtYXApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbWFnZVVSTCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaWYgKGltYWdlVVJMICE9PSB0aGlzLmJhY2tncm91bmRJbWFnZVVSTCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlVVJMID0gaW1hZ2VVUkw7XG4gICAgICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTCkudGhlbihpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0gaW1hZ2VVUkw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZEltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3QmFja2dyb3VuZEltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENhbnZhcywgSGlkZGVuQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xuaW1wb3J0IHsgSVJlY3QsIFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgZW51bSBCb3hCYWNrZ3JvdW5kVHlwZXMge1xuICAgIENPTE9SLCBOSU5FUEFUQ0gsIFNUUkVUQ0hcbn1cblxuY2xhc3MgQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSB7XG4gICAgQ3JlYXRlKHR5cGUgOiBCb3hCYWNrZ3JvdW5kVHlwZXMsIGJhY2tncm91bmQgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIDogQm94QmFja2dyb3VuZCB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuQ09MT1I6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yZWRCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLk5JTkVQQVRDSDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTmluZVBhdGNoQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5TVFJFVENIOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJldGNoQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBCb3hCYWNrZ3JvdW5kRmFjdG9yeSA6IENsYXNzQm94QmFja2dyb3VuZEZhY3RvcnkgPSBuZXcgQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSgpO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQm94QmFja2dyb3VuZCBleHRlbmRzIExheWVyIHtcbiAgICBwcm90ZWN0ZWQgYm94IDogSVJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5ib3ggPSB7XG4gICAgICAgICAgICBQb3NpdGlvbiA6IHBvc2l0aW9uID09IG51bGwgPyBuZXcgUG9pbnQoKSA6IHBvc2l0aW9uLFxuICAgICAgICAgICAgU2l6ZSA6IHNpemVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXQgUG9zaXRpb24ocG9zaXRpb24gOiBQb2ludCkge1xuICAgICAgICB0aGlzLmJveC5Qb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH1cblxuICAgIHNldCBTaXplKHNpemUgOiBQb2ludCkge1xuICAgICAgICB0aGlzLmJveC5TaXplID0gc2l6ZTtcbiAgICB9XG59XG5cbmNsYXNzIENvbG9yZWRCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgQ29sb3IgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb2xvciA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5Db2xvciA9IGNvbG9yO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuRHJhd1JlY3QodGhpcy5ib3guUG9zaXRpb24sIHRoaXMuYm94LlNpemUsIHRoaXMuQ29sb3IpO1xuICAgIH1cbn1cblxuY2xhc3MgTmluZVBhdGNoQm94QmFja2dyb3VuZCBleHRlbmRzIEJveEJhY2tncm91bmQge1xuICAgIHByaXZhdGUgbmluZVBhdGNoIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBuaW5lUGF0Y2hVUkwgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuaW5lUGF0Y2hVUkwgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoc2l6ZSwgcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuTmluZVBhdGNoID0gbmluZVBhdGNoVVJMO1xuICAgIH1cblxuICAgIHNldCBOaW5lUGF0Y2gobmluZVBhdGNoVVJMIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChuaW5lUGF0Y2hVUkwgIT09IHRoaXMubmluZVBhdGNoVVJMKSB7XG4gICAgICAgICAgICB0aGlzLm5pbmVQYXRjaFVSTCA9IG5pbmVQYXRjaFVSTDtcblxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShuaW5lUGF0Y2hVUkwpXG4gICAgICAgICAgICAudGhlbihpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGlkZGVuQ2FudmFzID0gbmV3IEhpZGRlbkNhbnZhcyh0aGlzLmJveC5TaXplLkNsb25lKCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoU2l6ZSA9IG5ldyBQb2ludChpbWFnZS53aWR0aCAvIDMsIGltYWdlLmhlaWdodCAvIDMpO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZHJhd1BhdGNoVG8ocGF0Y2hQb3NpdGlvbiA6IFBvaW50LCBkZXN0UG9zIDogUG9pbnQsIGRlc3RTaXplPyA6IFBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbkNhbnZhcy5EcmF3SW1hZ2VUbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLCB7IFBvc2l0aW9uIDogcGF0Y2hQb3NpdGlvbiwgU2l6ZSA6IHBhdGNoU2l6ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IGRlc3RQb3MsIFNpemUgOiBkZXN0U2l6ZSAhPSBudWxsID8gZGVzdFNpemUgOiBwYXRjaFNpemUgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoRGVzdGluYXRpb25zID0gW1xuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoKSwgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIHBhdGNoU2l6ZS5YLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KDAsIHRoaXMuYm94LlNpemUuWSAtIHBhdGNoU2l6ZS5ZKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSBwYXRjaFNpemUuWSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKG5ldyBQb2ludCgpLCBwYXRjaERlc3RpbmF0aW9uc1swXSk7IC8vIFVwcGVyIExlZnRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMCkpLCBwYXRjaERlc3RpbmF0aW9uc1sxXSk7IC8vIFVwcGVyIFJpZ2h0XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDAsIDIpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMl0pOyAvLyBMb3dlciBMZWZ0XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDIsIDIpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbM10pOyAvLyBMb3dlciBSaWdodFxuXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDApKSwgcGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDApKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIChwYXRjaFNpemUuWCAqIDIpLCBwYXRjaFNpemUuWSkpOyAvLyBUb3BcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMSkpLCBwYXRjaERlc3RpbmF0aW9uc1sxXS5BZGQobmV3IFBvaW50KDAsIHBhdGNoU2l6ZS5ZKSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChwYXRjaFNpemUuWCwgdGhpcy5ib3guU2l6ZS5ZIC0gKHBhdGNoU2l6ZS5ZICogMikpKTsgLy8gUmlnaHRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1syXS5BZGQobmV3IFBvaW50KHBhdGNoU2l6ZS5YLCAwKSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSAocGF0Y2hTaXplLlggKiAyKSwgcGF0Y2hTaXplLlkpKTsgLy8gQm90dG9tXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDAsIDEpKSwgcGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDAsIDEpKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSAocGF0Y2hTaXplLlkgKiAyKSkpOyAvLyBMZWZ0XG5cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMSkpLFxuICAgICAgICAgICAgICAgICAgICBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMSkpLCB0aGlzLmJveC5TaXplLlN1YihwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMikpKSk7IC8vIENlbnRlclxuXG4gICAgICAgICAgICAgICAgY3JlYXRlSW1hZ2VCaXRtYXAoaGlkZGVuQ2FudmFzLkdldEltYWdlRGF0YSgpKS50aGVuKG5pbmVQYXRjaEltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uaW5lUGF0Y2ggPSBuaW5lUGF0Y2hJbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlkZGVuQ2FudmFzLkRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5pbmVQYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHRoaXMubmluZVBhdGNoLCB0aGlzLmJveC5Qb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIFN0cmV0Y2hCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgcHJpdmF0ZSBpbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgaW1hZ2VTaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBpbWFnZVVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGltYWdlVVJMIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uIDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoc2l6ZSwgcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICB9XG5cbiAgICBzZXQgSW1hZ2UoaW1hZ2VVUkwgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGltYWdlVVJMICE9PSB0aGlzLmltYWdlVVJMKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlVVJMID0gaW1hZ2VVUkw7XG5cbiAgICAgICAgICAgIExvYWRlci5Mb2FkSW1hZ2UoaW1hZ2VVUkwpXG4gICAgICAgICAgICAudGhlbihpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTaXplID0gbmV3IFBvaW50KHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2VUbyhcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLFxuICAgICAgICAgICAgICAgIHsgUG9zaXRpb24gOiBuZXcgUG9pbnQoKSwgU2l6ZSA6IHRoaXMuaW1hZ2VTaXplIH0sXG4gICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IHRoaXMuYm94LlBvc2l0aW9uLCBTaXplIDogdGhpcy5ib3guU2l6ZSB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIExheWVyIHtcbiAgICBwcml2YXRlIHNwcml0ZXMgOiB7W2N1cnJlbnRTdGF0ZSA6IHN0cmluZ10gOiBJbWFnZUJpdG1hcH07IC8vIGxvYWRlZCBzdGF0ZSBzcHJpdGVzXG4gICAgcHJpdmF0ZSBhbmNob3IgOiBzdHJpbmcgfCBQb2ludDsgLy8gY3VycmVudCBhbmNob3JcbiAgICBwcml2YXRlIGN1cnJlbnRTdGF0ZSA6IHN0cmluZztcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7IC8vIGN1cnJlbnQgcG9zaXRpb25cbiAgICBwcml2YXRlIHNob3cgOiBib29sZWFuOyAvLyBjdXJyZW50bHkgdmlzaWJsZVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gXCJkZWZhdWx0XCI7XG4gICAgICAgIHRoaXMuc3ByaXRlcyA9IHt9O1xuICAgICAgICB0aGlzLnNob3cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBJbWFnZShzcHJpdGVVUkwgOiBzdHJpbmcsIHNwcml0ZUtleSA6IHN0cmluZykge1xuICAgICAgICBMb2FkZXIuTG9hZEltYWdlKHNwcml0ZVVSTCkudGhlbihpbWFnZSA9PiB0aGlzLnNwcml0ZXNbc3ByaXRlS2V5XSA9IGltYWdlKTtcbiAgICB9XG5cbiAgICBTaG93KHNwcml0ZUtleSA6IHN0cmluZywgYW5jaG9yIDogc3RyaW5nIHwgUG9pbnQpIHtcbiAgICAgICAgdGhpcy5zaG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBzcHJpdGVLZXk7XG4gICAgICAgIGlmIChhbmNob3IpIHtcbiAgICAgICAgICAgIHRoaXMuYW5jaG9yID0gYW5jaG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgSGlkZSgpIHtcbiAgICAgICAgdGhpcy5zaG93ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zaG93KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5zcHJpdGVzW3RoaXMuY3VycmVudFN0YXRlXTtcbiAgICAgICAgaWYgKHNwcml0ZSAhPSBudWxsKSB7XG4gICAgICAgIGxldCB4IDogbnVtYmVyO1xuICAgICAgICBsZXQgeSA9IGNhbnZhcy5TaXplLlkgLSBzcHJpdGUuaGVpZ2h0O1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYW5jaG9yID09PSBcInN0cmluZ1wiKSB7IC8vIGxlZnQvcmlnaHQvZXRjXG4gICAgICAgICAgICB4ID0gKGNhbnZhcy5TaXplLlggLyAyICkgLSAoc3ByaXRlLndpZHRoIC8gMik7Ly8gZGVmYXVsdCB0byBjZW50cmVcbiAgICAgICAgICAgIGlmICh0aGlzLmFuY2hvciA9PT0gXCJsZWZ0XCIgfHwgdGhpcy5hbmNob3IgPT09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgIHggPSB0aGlzLmFuY2hvciA9PT0gXCJsZWZ0XCIgPyAwIDogY2FudmFzLlNpemUuWCAtIHNwcml0ZS53aWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHggPSB0aGlzLmFuY2hvci5YO1xuICAgICAgICAgICAgeSA9IHRoaXMuYW5jaG9yLlk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludChcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5XG4gICAgICAgICk7XG5cbiAgICAgICAgY2FudmFzLkRyYXdJbWFnZShzcHJpdGUsIHRoaXMucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgR2V0SW1hZ2Uoc3ByaXRlU3RhdGUgOiBzdHJpbmcpIDogSW1hZ2VCaXRtYXAgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNwcml0ZXMsIHNwcml0ZVN0YXRlLFwiLS0tXCIpXG4gICAgICAgIGlmIChzcHJpdGVTdGF0ZSBpbiB0aGlzLnNwcml0ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwcml0ZSA9IHRoaXMuc3ByaXRlc1tzcHJpdGVTdGF0ZV07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNQUklURSA9PT0+IFwiLCBzcHJpdGUpXG4gICAgICAgICAgICByZXR1cm4gc3ByaXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hhcmFjdGVycyBleHRlbmRzIExheWVyIHtcbiAgICBwcml2YXRlIGNoYXJhY3RlcnMgOiB7IFthIDogc3RyaW5nXSA6IENoYXJhY3RlciB9ID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBBZGQoc3ByaXRlV2l0aFBhcmFtcyA6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJEYXRhID0gIHNwcml0ZVdpdGhQYXJhbXMuc3BsaXQoXCIgXCIpO1xuICAgICAgICBpZiAoIShjaGFyYWN0ZXJEYXRhWzBdIGluIHRoaXMuY2hhcmFjdGVycykpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJEYXRhWzBdXSA9IG5ldyBDaGFyYWN0ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyRGF0YVswXV0uSW1hZ2UoY2hhcmFjdGVyRGF0YVsyXSwgY2hhcmFjdGVyRGF0YVsxXSk7XG4gICAgfVxuXG4gICAgU2hvdyhzcHJpdGVXaXRoUGFyYW1zIDogc3RyaW5nLCBwb3NpdGlvbj8gOiBQb2ludCB8IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJEYXRhID0gIHNwcml0ZVdpdGhQYXJhbXMuc3BsaXQoXCIgXCIpO1xuICAgICAgICAvLyAjIHNob3c6IGFueWEgaGFwcHkgW2xlZnRdXG4gICAgICAgIGlmIChjaGFyYWN0ZXJEYXRhWzBdIGluICB0aGlzLmNoYXJhY3RlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJEYXRhWzBdXS5TaG93KGNoYXJhY3RlckRhdGFbMV0sIHBvc2l0aW9uIHx8IGNoYXJhY3RlckRhdGFbMl0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgR2V0SW1hZ2Uoc3ByaXRlTmFtZSA6IHN0cmluZywgc3ByaXRlU3RhdGUgOiBzdHJpbmcpIDogSW1hZ2VCaXRtYXAgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAoc3ByaXRlTmFtZSBpbiAgdGhpcy5jaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklUUyBJTlwiLCBzcHJpdGVOYW1lKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyc1tzcHJpdGVOYW1lXS5HZXRJbWFnZShzcHJpdGVTdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBIaWRlKHNwcml0ZVdpdGhQYXJhbXMgOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyRGF0YSA9ICBzcHJpdGVXaXRoUGFyYW1zLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3RlckRhdGFbMF1dLkhpZGUoKTtcbiAgICB9XG5cbiAgICBIaWRlQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXJhY3RlciBpbiB0aGlzLmNoYXJhY3RlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJdLkhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGNoYXJhY3RlciBpbiB0aGlzLmNoYXJhY3RlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJdLkRyYXcoY2FudmFzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFJlbW92ZSgpIHtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0ge307XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2hvaWNlIH0gZnJvbSBcImlua2pzXCI7XG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IEJveEJhY2tncm91bmQsIEJveEJhY2tncm91bmRGYWN0b3J5LCBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9ib3hiYWNrZ3JvdW5kc1wiO1xuaW1wb3J0IHtDaGFyYWN0ZXJzLCBHYW1lcGxheUxheWVyfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuY2xhc3MgQ2hvaWNlQm94IHtcbiAgICBwcml2YXRlIGJveEJhY2tncm91bmQgOiBCb3hCYWNrZ3JvdW5kO1xuICAgIHByaXZhdGUgZm9udFNpemUgOiBudW1iZXIgPSAyNDtcbiAgICBwcml2YXRlIGhhc0FscmVhZHlCZWVuRHJhd25PbmNlIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBpZCA6IG51bWJlciB8IHN0cmluZyB8IG51bGw7XG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50ID0gbmV3IFBvaW50KDAsIDIwKTtcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBzaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSB0ZXh0IDogc3RyaW5nO1xuICAgIHByaXZhdGUgaW1hZ2U/IDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBob3ZlckltYWdlPyA6IEltYWdlQml0bWFwO1xuICAgIHB1YmxpYyBpc0hvdmVyZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihpZCA6IG51bWJlciB8IHN0cmluZyB8IG51bGwsIHRleHQgOiBzdHJpbmcsIHdpZHRoIDogbnVtYmVyLCBwb3NpdGlvbiA6IFBvaW50LCBpbWFnZT8gOiBJbWFnZUJpdG1hcCwgaG92ZXJJbWFnZT8gOiBJbWFnZUJpdG1hcCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG5cbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KHdpZHRoLCAodGhpcy5mb250U2l6ZSAqIDEuNDI4NTcpICsgKDIgKiB0aGlzLmlubmVyTWFyZ2luLlkpKTtcbiAgICAgICAgaWYgKGltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQoaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ob3ZlckltYWdlID0gaG92ZXJJbWFnZTtcblxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuaXNIb3ZlcmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShCb3hCYWNrZ3JvdW5kVHlwZXMuQ09MT1IsIFwicmdiYSgwLCAwLCAwLCAuNylcIiwgdGhpcy5zaXplLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgSWQoKSA6IG51bWJlciB8IHN0cmluZyB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG5cbiAgICBnZXQgQm91bmRpbmdSZWN0KCkgOiBJUmVjdCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBQb3NpdGlvbiA6IHRoaXMucG9zaXRpb24sXG4gICAgICAgICAgICBTaXplIDogdGhpcy5zaXplXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBbHJlYWR5QmVlbkRyYXduT25jZSkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVGaXJzdERyYXcoY2FudmFzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pbWFnZSkge1xuICAgICAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kLkRyYXcoY2FudmFzKTtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3VGV4dCh0aGlzLnRleHQsIHRoaXMucG9zaXRpb24uQWRkKHRoaXMuaW5uZXJNYXJnaW4pLCB0aGlzLmlzSG92ZXJlZCA/IFwieWVsbG93XCIgOiBcIndoaXRlXCIsIHRoaXMuZm9udFNpemUsIHRoaXMuc2l6ZS5YKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2UodGhpcy5ob3ZlckltYWdlICYmIHRoaXMuaXNIb3ZlcmVkID8gdGhpcy5ob3ZlckltYWdlIDogdGhpcy5pbWFnZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGJlZm9yZUZpcnN0RHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3VGV4dDAoXCJcIiwgXCJ0cmFuc3BhcmVudFwiLCB0aGlzLmZvbnRTaXplKTtcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbi5YID0gKHRoaXMuc2l6ZS5YIC0gY2FudmFzLk1lYXN1cmVUZXh0V2lkdGgodGhpcy50ZXh0KSkgLyAyO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENob2ljZUxheWVyIGV4dGVuZHMgR2FtZXBsYXlMYXllciB7XG4gICAgY2hvaWNlcyA6IENob2ljZVtdID0gW107XG4gICAgcHJpdmF0ZSBib3VuZGluZ1JlY3QgOiBQb2ludDtcbiAgICBwcml2YXRlIGNob2ljZUJveGVzIDogQ2hvaWNlQm94W10gPSBbXTtcbiAgICBwcml2YXRlIGlzTW91c2VPbkNob2ljZSA6IENob2ljZUJveCA9IG51bGw7XG4gICAgcHJpdmF0ZSBzY3JlZW5TaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvbiA6IFBvaW50O1xuXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuU2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMgPSBbXTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IG5ldyBQb2ludCgwLCAwICk7XG4gICAgICAgIHRoaXMuc2NyZWVuU2l6ZSA9IHNjcmVlblNpemU7XG4gICAgfVxuXG4gICAgc2V0IENob2ljZXMoY2hvaWNlcyA6IENob2ljZVtdKSB7XG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IGNob2ljZXM7XG5cbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcyA9IFtdO1xuICAgICAgICBjb25zdCB3aWR0aCA9IDIwMDtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIGZvciAoY29uc3QgX2Nob2ljZSBvZiB0aGlzLmNob2ljZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nob2ljZSA9IG5ldyBDaG9pY2VCb3goX2Nob2ljZS5pbmRleCwgX2Nob2ljZS50ZXh0LCB3aWR0aCwgcG9zaXRpb24uQ2xvbmUoKSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZUJveGVzLnB1c2gobmV3Q2hvaWNlKTtcbiAgICAgICAgICAgIHBvc2l0aW9uLlkgKz0gbmV3Q2hvaWNlLkJvdW5kaW5nUmVjdC5TaXplLlkgKyA0MDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kaW5nUmVjdCA9IG5ldyBQb2ludCh3aWR0aCwgcG9zaXRpb24uWSAtIDQwKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IHRoaXMuc2NyZWVuU2l6ZS5EaXYobmV3IFBvaW50KDIpKS5TdWIodGhpcy5ib3VuZGluZ1JlY3QuRGl2KG5ldyBQb2ludCgyKSkpO1xuICAgIH1cblxuICAgIEFkZEJ1dHRvbihjaGFyYWN0ZXJzIDogQ2hhcmFjdGVycywgYnV0dG9uIDogQ2hvaWNlKSB7XG4gICAgICAgIC8vIGFkZCBpbWFnZSB0byBlYWNoIGJveFxuICAgICAgICBjb25zdCByZWN0SW1hZ2UgPSBjaGFyYWN0ZXJzLkdldEltYWdlKGJ1dHRvbi50ZXh0LCBcImRlZmF1bHRcIik7XG4gICAgICAgIGNvbnN0IHJlY3RJbWFnZUhvdmVyID0gY2hhcmFjdGVycy5HZXRJbWFnZShidXR0b24udGV4dCwgXCJob3ZlclwiKTtcbiAgICAgICAgdGhpcy5jaG9pY2VzLnB1c2goYnV0dG9uKTtcbiAgICAgICAgLy8gVG9kbyBhZGQgc3VwcG9ydCBmb3IgcGVyY2VudCBpZiAlIGluIHZhbHVlcz9cbiAgICAgICAgY29uc3QgbmV3QnV0dG9uID0gbmV3IENob2ljZUJveChidXR0b24ua25vdCwgYnV0dG9uLnRleHQsIDIwMCwgYnV0dG9uLnBvc2l0aW9uLCByZWN0SW1hZ2UsIHJlY3RJbWFnZUhvdmVyKTtcbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcy5wdXNoKG5ld0J1dHRvbik7XG4gICAgfVxuXG4gICAgQ2xlYXJCdXR0b25zKCl7XG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IFtdO1xuICAgICAgICB0aGlzLmNob2ljZUJveGVzID0gW107XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgIGZvciAoY29uc3QgY2hvaWNlQm94IG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcbiAgICAgICAgICAgIGNob2ljZUJveC5EcmF3KGNhbnZhcyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY2hvaWNlQm94IG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IGNob2ljZUJveC5Cb3VuZGluZ1JlY3Q7XG4gICAgICAgICAgICBib3VuZGluZ1JlY3QuUG9zaXRpb24gPSBib3VuZGluZ1JlY3QuUG9zaXRpb24uQWRkKHRoaXMudHJhbnNsYXRpb24pO1xuICAgICAgICAgICAgaWYgKGNsaWNrUG9zaXRpb24uSXNJblJlY3QoYm91bmRpbmdSZWN0KSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbihjaG9pY2VCb3guSWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZCB7XG4gICAgICAgIG1vdXNlUG9zaXRpb24gPSBtb3VzZVBvc2l0aW9uLlN1Yih0aGlzLnRyYW5zbGF0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMuaXNNb3VzZU9uQ2hvaWNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBtb3VzZVBvc2l0aW9uLklzSW5SZWN0KHRoaXMuaXNNb3VzZU9uQ2hvaWNlLkJvdW5kaW5nUmVjdCkgPyBudWxsIDogKGNhbnZhcyA6IENhbnZhcykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbnZhcy5TZXRDdXJzb3IoXCJkZWZhdWx0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNNb3VzZU9uQ2hvaWNlID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNob2ljZSBvZiB0aGlzLmNob2ljZUJveGVzKSB7XG4gICAgICAgICAgICAgICAgY2hvaWNlLmlzSG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChjaG9pY2UuaWQgIT09IG51bGwgJiYgbW91c2VQb3NpdGlvbi5Jc0luUmVjdChjaG9pY2UuQm91bmRpbmdSZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNhbnZhcyA6IENhbnZhcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMuU2V0Q3Vyc29yKFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZS5pc0hvdmVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQgeyB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGF5ZXIge1xuICAgIGFic3RyYWN0IERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQ7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGVwTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gICAgYWJzdHJhY3QgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZXBsYXlMYXllciBleHRlbmRzIFN0ZXBMYXllciB7XG4gICAgYWJzdHJhY3QgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQ7XG4gICAgYWJzdHJhY3QgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZDtcbn1cblxuZXhwb3J0ICogZnJvbSBcIi4vYmFja2dyb3VuZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vY2hhcmFjdGVyc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vY2hvaWNlbGF5ZXJcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3NwZWVjaGxheWVyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90cmFuc2l0aW9uXCI7XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQgeyBHYW1lcGxheUxheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcblxuaW50ZXJmYWNlIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBCYWNrZ3JvdW5kIDogc3RyaW5nO1xuICAgIEJhY2tncm91bmRUeXBlIDogQm94QmFja2dyb3VuZFR5cGVzO1xuICAgIEZvbnRDb2xvciA6IHN0cmluZztcbiAgICBGb250U2l6ZSA6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU3BlZWNoQm94Q29uZmlndXJhdGlvbiBleHRlbmRzIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBIZWlnaHQgOiBudW1iZXI7XG4gICAgSW5uZXJNYXJnaW4gOiBQb2ludDtcbiAgICBPdXRlck1hcmdpbiA6IFBvaW50O1xufVxuXG5pbnRlcmZhY2UgSU5hbWVCb3hDb25maWd1cmF0aW9uIGV4dGVuZHMgSUJveENvbmZpZ3VyYXRpb24ge1xuICAgIEhlaWdodCA6IG51bWJlcjtcbiAgICBXaWR0aCA6IG51bWJlcjtcbn1cblxuY29uc3QgUkVXUkFQX1RISVNfTElORSA9IFwiPFt7UkVXUkFQX1RISVNfTElORX1dPlwiO1xuXG5jbGFzcyBTcGVlY2hCb3gge1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250Q29sb3IgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGlubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBpbm5lclNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIG5leHRXb3JkIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIHRleHRMaW5lcyA6IFtzdHJpbmc/XSA9IFtcIlwiXTtcblxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIHNpemUgOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElTcGVlY2hCb3hDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbi5DbG9uZSgpO1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplLkNsb25lKCk7XG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4gPSBjb25maWd1cmF0aW9uLklubmVyTWFyZ2luO1xuICAgICAgICB0aGlzLmlubmVyU2l6ZSA9IHRoaXMuc2l6ZS5TdWIodGhpcy5pbm5lck1hcmdpbi5NdWx0KG5ldyBQb2ludCgyKSkpO1xuXG4gICAgICAgIGlmICh0aGlzLnRleHRMaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSwgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZS5DbG9uZSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGNvbmZpZ3VyYXRpb24uRm9udFNpemU7XG4gICAgICAgIHRoaXMuZm9udENvbG9yID0gY29uZmlndXJhdGlvbi5Gb250Q29sb3I7XG4gICAgfVxuXG4gICAgZ2V0IFRleHQoKSA6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRMaW5lcy5qb2luKFwiIFwiKTtcbiAgICB9XG5cbiAgICBzZXQgVGV4dCh0ZXh0IDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IF90ZXh0ID0gdGhpcy5UZXh0O1xuICAgICAgICBpZiAodGV4dC5pbmRleE9mKF90ZXh0KSA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2xpY2UgPSB0ZXh0LnNsaWNlKF90ZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXSArPSBzbGljZTtcbiAgICAgICAgICAgIGlmIChzbGljZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0V29yZCA9IFJFV1JBUF9USElTX0xJTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lcyA9IFt0ZXh0XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBOZXh0V29yZChuZXh0V29yZCA6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5leHRXb3JkID0gbmV4dFdvcmQ7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kPy5EcmF3KGNhbnZhcyk7XG5cbiAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uLkFkZCh0aGlzLmlubmVyTWFyZ2luKSk7XG5cbiAgICAgICAgaWYgKHRoaXMubmV4dFdvcmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5kb1RoZVdyYXAoY2FudmFzKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFdvcmQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRleHRMaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdUZXh0KFxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW2ldLFxuICAgICAgICAgICAgICAgIG5ldyBQb2ludCgwLCBpICogKHRoaXMuZm9udFNpemUgKiAxLjQyODU3KSksIC8vIFRoaXMgaXMgdGhlIGdvbGRlbiByYXRpbywgb24gbGluZS1oZWlnaHQgYW5kIGZvbnQtc2l6ZVxuICAgICAgICAgICAgICAgIHRoaXMuZm9udENvbG9yLFxuICAgICAgICAgICAgICAgIHRoaXMuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lclNpemUuWFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1RoZVdyYXAoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuRHJhd1RleHQwKFwiXCIsIFwidHJhbnNwYXJlbnRcIiwgdGhpcy5mb250U2l6ZSk7XG4gICAgICAgIGNvbnN0IGNvbXAgPSAobGluZSA6IHN0cmluZykgPT4gY2FudmFzLk1lYXN1cmVUZXh0V2lkdGgobGluZSkgPiB0aGlzLmlubmVyU2l6ZS5YO1xuXG4gICAgICAgIGxldCBsYXN0TGluZSA9IHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGlmICh0aGlzLm5leHRXb3JkID09PSBSRVdSQVBfVEhJU19MSU5FKSB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHdyYXAgdGhlIGZ1Y2sgb3V0IG9mIHRoaXMgbGluZVxuICAgICAgICAgICAgd2hpbGUgKGNvbXAobGFzdExpbmUpKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRvIHRoZSBjaGFyIHdoZXJlIHdlJ3JlIG91dHNpZGUgdGhlIGJvdWRhcmllc1xuICAgICAgICAgICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoIWNvbXAobGFzdExpbmUuc2xpY2UoMCwgbikpKSB7ICsrbjsgfVxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgcHJldmlvdXMgc3BhY2VcbiAgICAgICAgICAgICAgICB3aGlsZSAobGFzdExpbmVbbl0gIT09IFwiIFwiICYmIG4gPj0gMCkgeyAtLW47IH1cbiAgICAgICAgICAgICAgICBpZiAobiA9PT0gMCkgeyBicmVhazsgfSAvLyBXZSBjYW4ndCB3cmFwIG1vcmVcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQsIHVwZGF0ZSBsYXN0IGxpbmUsIGFuZCBiYWNrIGluIHRoZSBsb29wXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXMucHVzaChsYXN0TGluZS5zbGljZShuICsgMSkpOyAvLyArMSBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdGhlIHNwYWNlXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMl0gPSBsYXN0TGluZS5zbGljZSgwLCBuKTtcbiAgICAgICAgICAgICAgICBsYXN0TGluZSA9IHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbXAobGFzdExpbmUgKyB0aGlzLm5leHRXb3JkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdID0gbGFzdExpbmUuc2xpY2UoMCwgbGFzdExpbmUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgTmFtZUJveCB7XG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kVVJMIDogc3RyaW5nID0gXCJpbWFnZXMvOXBhdGNoLXNtYWxsLnBuZ1wiO1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250Q29sb3IgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGlubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBuYW1lIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIGNvbmZpZ3VyYXRpb24gOiBJTmFtZUJveENvbmZpZ3VyYXRpb24pO1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIGNvbmZpZ3VyYXRpb24gOiBJTmFtZUJveENvbmZpZ3VyYXRpb24sIG5hbWU/IDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBQb2ludChjb25maWd1cmF0aW9uLldpZHRoLCBjb25maWd1cmF0aW9uLkhlaWdodCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbi5DbG9uZSgpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLlkgLT0gdGhpcy5zaXplLlk7XG5cbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbiA9IHRoaXMuc2l6ZS5EaXYobmV3IFBvaW50KDEwLCAxMCkpO1xuXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSBjb25maWd1cmF0aW9uLkZvbnRTaXplO1xuICAgICAgICB0aGlzLmZvbnRDb2xvciA9IGNvbmZpZ3VyYXRpb24uRm9udENvbG9yO1xuXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcbiAgICAgICAgICAgIHRoaXMuc2l6ZS5DbG9uZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2V0IE5hbWUobmFtZSA6IHN0cmluZykge1xuICAgICAgICBpZiAobmFtZSAhPT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuYm94QmFja2dyb3VuZC5EcmF3KGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQodGhpcy5uYW1lLCB0aGlzLmlubmVyTWFyZ2luLCB0aGlzLmZvbnRDb2xvciwgdGhpcy5mb250U2l6ZSwgdGhpcy5zaXplLlgpO1xuICAgICAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwZWVjaExheWVyIGV4dGVuZHMgR2FtZXBsYXlMYXllciB7XG4gICAgcHJpdmF0ZSBmdWxsVGV4dCA6IHN0cmluZztcbiAgICBwcml2YXRlIG5hbWVCb3ggOiBOYW1lQm94O1xuICAgIHByaXZhdGUgdGV4dEFwcGVhcmVkIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgdGV4dEJveCA6IFNwZWVjaEJveDtcbiAgICBwcml2YXRlIHRleHRUaW1lIDogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHNjcmVlblNpemUgOiBQb2ludCwgc3BlZWNoQm94Q29uZmlndXJhdGlvbiA6IElTcGVlY2hCb3hDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgdGV4dEJveFNpemUgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICBzY3JlZW5TaXplLlggLSAoc3BlZWNoQm94Q29uZmlndXJhdGlvbi5PdXRlck1hcmdpbi5YICogMiksXG4gICAgICAgICAgICBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkhlaWdodFxuICAgICAgICApO1xuICAgICAgICBjb25zdCB0ZXh0Qm94UG9zaXRpb24gPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICBzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlgsXG4gICAgICAgICAgICBzY3JlZW5TaXplLlkgLSBzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlkgLSBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnRleHRCb3ggPSBuZXcgU3BlZWNoQm94KHRleHRCb3hQb3NpdGlvbiwgdGV4dEJveFNpemUsIHNwZWVjaEJveENvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHRoaXMubmFtZUJveCA9IG5ldyBOYW1lQm94KFxuICAgICAgICAgICAgdGV4dEJveFBvc2l0aW9uLkFkZChuZXcgUG9pbnQoNzAsIDApKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kIDogc3BlZWNoQm94Q29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgIEJhY2tncm91bmRUeXBlIDogc3BlZWNoQm94Q29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSxcbiAgICAgICAgICAgICAgICBGb250Q29sb3IgOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiA0MCxcbiAgICAgICAgICAgICAgICBXaWR0aCA6IDEwMFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRCb3guRHJhdyhjYW52YXMpO1xuICAgICAgICB0aGlzLm5hbWVCb3guRHJhdyhjYW52YXMpO1xuICAgIH1cblxuICAgIE1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiA6IFBvaW50LCBhY3Rpb24gOiBGdW5jdGlvbikgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dEFwcGVhcmVkKSB7XG4gICAgICAgICAgICBhY3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGV4dEJveC5UZXh0ID0gdGhpcy5mdWxsVGV4dDtcbiAgICAgICAgICAgIHRoaXMudGV4dEFwcGVhcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBTYXkodGV4dCA6IHN0cmluZywgbmFtZSA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0Qm94LlRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLm5hbWVCb3guTmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0VGltZSArPSBkZWx0YTtcblxuICAgICAgICB3aGlsZSAodGhpcy50ZXh0VGltZSA+PSBDb25maWcuVGV4dFNwZWVkUmF0aW8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLmZ1bGxUZXh0LnNsaWNlKHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCwgdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0Qm94LlRleHQgKz0gYztcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCIgXCIgJiYgdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5mdWxsVGV4dFtuXSA9PT0gXCIgXCIgJiYgbiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7ICsrbjsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5mdWxsVGV4dFtuXSAhPT0gXCIgXCIgJiYgbiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7ICsrbjsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dEJveC5OZXh0V29yZCA9IHRoaXMuZnVsbFRleHQuc2xpY2UodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMSwgbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGV4dFRpbWUgPSB0aGlzLnRleHRUaW1lIC0gQ29uZmlnLlRleHRTcGVlZFJhdGlvO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IFN0ZXBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNpdGlvbiBleHRlbmRzIFN0ZXBMYXllciB7XG4gICAgcHJpdmF0ZSBfb25FbmQgOiBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4gPSBuZXcgTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+KCk7XG5cbiAgICBwcml2YXRlIGIgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgdGltZSA6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSB0b3RhbFRpbWUgOiBudW1iZXIgPSAyMDAwLjA7XG5cbiAgICBjb25zdHJ1Y3RvcihpbWFnZURhdGEgOiBJbWFnZURhdGEpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvLyBzaW4gZXF1YXRpb246IHkgPSBhKnNpbihiKnggKyBjKSArIGRcbiAgICAgICAgLy8gYSBzaW4gcGVyaW9kIGlzIDJQSSAvIGJcbiAgICAgICAgLy8gd2Ugd2FudCBhIGhhbGYgcGVyaW9kIG9mIHRvdGFsVGltZSBzbyB3ZSdyZSBsb29raW5nIGZvciBiOiBiID0gMlBJIC8gcGVyaW9kXG4gICAgICAgIHRoaXMuYiA9IChNYXRoLlBJICogMikgLyAodGhpcy50b3RhbFRpbWUgKiAyKTtcblxuICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChpbWFnZURhdGEpLnRoZW4oaW1hZ2UgPT4gdGhpcy5pbWFnZSA9IGltYWdlKTtcbiAgICB9XG5cbiAgICBnZXQgT25FbmQoKSA6IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbkVuZC5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdCYWNrZ3JvdW5kSW1hZ2UodGhpcy5pbWFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMuRHJhd1JlY3QobmV3IFBvaW50KCksIGNhbnZhcy5TaXplLCBgcmdiYSgwLjAsIDAuMCwgMC4wLCAke01hdGguc2luKHRoaXMuYiAqIHRoaXMudGltZSl9KWApO1xuICAgIH1cblxuICAgIFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGltZSArPSBkZWx0YTtcblxuICAgICAgICBpZiAodGhpcy5pbWFnZSAhPSBudWxsICYmIHRoaXMudGltZSA+PSB0aGlzLnRvdGFsVGltZSAvIDIpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGltZSA+PSB0aGlzLnRvdGFsVGltZSkge1xuICAgICAgICAgICAgdGhpcy5fb25FbmQuVHJpZ2dlcih0aGlzLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuXG5jbGFzcyBDbGFzc0xvYWRlciB7XG4gICAgTG9hZEltYWdlKFVSTCA6IHN0cmluZykgOiBQcm9taXNlPEltYWdlQml0bWFwPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSA6IEZ1bmN0aW9uLCByZWplY3QgOiBGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd29ya2VyIDogV29ya2VyID0gdGhpcy5jcmVhdGVXb3JrZXIoKTtcblxuICAgICAgICAgICAgd29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldnQgOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZ0LmRhdGEuZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZXZ0LmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3b3JrZXIudGVybWluYXRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKENvbmZpZy5Sb290UGF0aElzUmVtb3RlID9cbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly8ke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke1VSTH1gXG4gICAgICAgICAgICAgICAgOiBgJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHt3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bXlxcXFxcXC9dKiQvLCBcIlwiKX0ke1VSTH1gKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVXb3JrZXIoKSA6IFdvcmtlciB7XG4gICAgICAgIHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2AoZnVuY3Rpb24gJHt0aGlzLndvcmtlcn0pKClgXSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHdvcmtlcigpIHtcbiAgICAgICAgY29uc3QgY3R4IDogV29ya2VyID0gc2VsZiBhcyBhbnk7XG4gICAgICAgIGN0eC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZ0IDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBmZXRjaChldnQuZGF0YSkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5ibG9iKCkpLnRoZW4oYmxvYkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGJsb2JEYXRhKS50aGVuKGltYWdlID0+IGN0eC5wb3N0TWVzc2FnZShpbWFnZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IExvYWRlciA9IG5ldyBDbGFzc0xvYWRlcigpO1xuIiwiaW1wb3J0ICogYXMgSW5rSnMgZnJvbSBcImlua2pzXCI7XG5pbXBvcnQgeyBBdWRpbywgQXVkaW9GYWN0b3J5IH0gZnJvbSBcIi4vYXVkaW9cIjtcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuL2NhbnZhc1wiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9sYXllcnMvYm94YmFja2dyb3VuZHNcIjtcbmltcG9ydCAqIGFzIExheWVycyBmcm9tIFwiLi9sYXllcnMvbGF5ZXJzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5pbXBvcnQgeyBQcmVsb2FkZXIgfSBmcm9tIFwiLi9wcmVsb2FkZXJcIjtcblxuZXhwb3J0IGNsYXNzIFZOIHtcbiAgICBBdWRpbyA6IEF1ZGlvO1xuICAgIENhbnZhcyA6IENhbnZhcztcbiAgICBTdG9yeSA6IElua0pzLlN0b3J5O1xuXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kIDogTGF5ZXJzLkJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXJzIDogTGF5ZXJzLkNoYXJhY3RlcnM7XG4gICAgcHJpdmF0ZSBjaG9pY2VTY3JlZW4gOiBMYXllcnMuQ2hvaWNlTGF5ZXI7XG4gICAgcHJpdmF0ZSBjdXJyZW50U2NyZWVuIDogTGF5ZXJzLkdhbWVwbGF5TGF5ZXI7XG4gICAgcHJpdmF0ZSBodWRTY3JlZW4gOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBodWRTY3JlZW5zIDogeyBba2V5IDogc3RyaW5nXSA6IExheWVycy5DaG9pY2VMYXllciB9O1xuICAgIHByaXZhdGUgcHJldmlvdXNUaW1lc3RhbXAgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBzcGVha2luZ0NoYXJhY3Rlck5hbWUgOiBzdHJpbmcgPSBcIlwiO1xuICAgIHByaXZhdGUgc3BlZWNoU2NyZWVuIDogTGF5ZXJzLlNwZWVjaExheWVyO1xuICAgIHByaXZhdGUgdHJhbnNpdGlvbiA6IExheWVycy5UcmFuc2l0aW9uO1xuXG4gICAgY29uc3RydWN0b3Ioc3RvcnlGaWxlbmFtZU9yT2JqZWN0IDogc3RyaW5nIHwgb2JqZWN0LCBjb250YWluZXJJRCA6IHN0cmluZykge1xuICAgICAgICB0aGlzLkF1ZGlvID0gQXVkaW9GYWN0b3J5LkNyZWF0ZSgpO1xuICAgICAgICB0aGlzLkNhbnZhcyA9IG5ldyBDYW52YXMoY29udGFpbmVySUQsIENvbmZpZy5TY3JlZW5TaXplKTtcblxuICAgICAgICBjb25zdCBpbml0U3RvcnkgPSAocmF3U3RvcnkgOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkgPSBuZXcgSW5rSnMuU3RvcnkocmF3U3RvcnkpO1xuICAgICAgICAgICAgQ29uZmlnLkxvYWQodGhpcy5TdG9yeS5nbG9iYWxUYWdzIHx8IFtdKTtcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLlNpemUgPSBDb25maWcuU2NyZWVuU2l6ZTtcblxuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gbmV3IExheWVycy5CYWNrZ3JvdW5kKCk7XG4gICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSBuZXcgTGF5ZXJzLkNoYXJhY3RlcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5zcGVlY2hTY3JlZW4gPSBuZXcgTGF5ZXJzLlNwZWVjaExheWVyKHRoaXMuQ2FudmFzLlNpemUsIHtcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kIDogXCJyZ2JhKDAuMCwgMC4wLCAwLjAsIDAuNzUpXCIsXG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZFR5cGUgOiBCb3hCYWNrZ3JvdW5kVHlwZXMuQ09MT1IsXG4gICAgICAgICAgICAgICAgRm9udENvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgIEZvbnRTaXplIDogMjQsXG4gICAgICAgICAgICAgICAgSGVpZ2h0IDogMjAwLFxuICAgICAgICAgICAgICAgIElubmVyTWFyZ2luIDogbmV3IFBvaW50KDM1KSxcbiAgICAgICAgICAgICAgICBPdXRlck1hcmdpbiA6IG5ldyBQb2ludCg1MClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4gPSBuZXcgTGF5ZXJzLkNob2ljZUxheWVyKHRoaXMuQ2FudmFzLlNpemUpO1xuICAgICAgICAgICAgdGhpcy5odWRTY3JlZW5zID0ge307XG4gICAgICAgICAgICB0aGlzLkNhbnZhcy5PbkNsaWNrLk9uKHRoaXMubW91c2VDbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLk9uTW92ZS5Pbih0aGlzLm1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5jb250aW51ZSgpO1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c1RpbWVzdGFtcCA9IDA7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RTdGVwKCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcnlGaWxlbmFtZU9yT2JqZWN0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBmZXRjaChzdG9yeUZpbGVuYW1lT3JPYmplY3QpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKS50aGVuKGluaXRTdG9yeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbml0U3RvcnkoSlNPTi5zdHJpbmdpZnkoc3RvcnlGaWxlbmFtZU9yT2JqZWN0KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBtYWtlSHVkKGh1ZE5hbWU6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgaWYgKCEoaHVkTmFtZSBpbiB0aGlzLmh1ZFNjcmVlbnMpKSB7XG4gICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnNbaHVkTmFtZV0gPSBuZXcgTGF5ZXJzLkNob2ljZUxheWVyKHRoaXMuQ2FudmFzLlNpemUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGVkIG5ldyBIVURcIiwgdGhpcy5odWRTY3JlZW5zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNvbXB1dGVUYWdzKCkgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ2V0RmluYWxWYWx1ZSA9ICh2YWx1ZSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVNYXRjaCA9IHZhbHVlLm1hdGNoKC9eXFx7KFxcdyspXFx9JC8pO1xuICAgICAgICAgICAgaWYgKHZhbHVlTWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlN0b3J5LnZhcmlhYmxlc1N0YXRlLiQodmFsdWVNYXRjaFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMuU3RvcnkuY3VycmVudFRhZ3M7XG4gICAgICAgIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gdGFnc1tpXS5tYXRjaCgvXihcXHcrKVxccyo6XFxzKiguKikkLyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBrbm93IHdoYXQgdGFnIGl0IGlzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA6IHN0cmluZyA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA6IHN0cmluZyA9IGdldEZpbmFsVmFsdWUobWF0Y2hbMl0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBhbGxvdyBnZXR0aW5nIHZhcmlhYmxlIHZhbHVlcyBpbnNpZGUgdGFnc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSAgdmFsdWUubWF0Y2goLyhcIi4qP1wifFteXCJcXHNdKykrKD89XFxzKnxcXHMqJCkvZykubWFwKHYgPT4gIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHYubWF0Y2goL3soLio/KX0vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoa2V5ICYmIGtleS5sZW5ndGggPiAxKSA/IHRoaXMuU3RvcnkudmFyaWFibGVzU3RhdGUuJChrZXlbMV0pIDogdjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUEFSQU1TXCIscGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByZWxvYWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNwbGl0KFwiLFwiKS5mb3JFYWNoKF92YWx1ZSA9PiBQcmVsb2FkZXIuUHJlbG9hZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29uZmlnLlJvb3RQYXRoSXNSZW1vdGUgPyBgaHR0cHM6Ly8ke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke192YWx1ZS50cmltKCl9YCA6IGAke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke192YWx1ZS50cmltKCl9YCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJnSW1hZ2UgPSBwYXJhbXMubGVuZ3RoID4gMSA/IHRoaXMuY2hhcmFjdGVycy5HZXRJbWFnZShwYXJhbXNbMF0sICBwYXJhbXNbMV0pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5CYWNrZ3JvdW5kSW1hZ2UgPSBiZ0ltYWdlIHx8IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMuQWRkKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYnV0dG9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RvX3RoaW5nIHlheSVzLnBuZyAzMCAyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gNCApIHsgLy8gbm8gaHVkIHdhcyBwYXNzZWQsIGFkZCB0byBzY2VuZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4uQWRkQnV0dG9uKHRoaXMuY2hhcmFjdGVycywge2tub3Q6IHBhcmFtc1swXSwgdGV4dDogcGFyYW1zWzFdLCBwb3NpdGlvbjogbmV3IFBvaW50KHBhcnNlSW50KHBhcmFtc1syXSksIHBhcnNlSW50KHBhcmFtc1szXSkpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmxlbmd0aCA9PT0gNSApIHsgLy8gaHVkIHdhcyBwYXNzZWQsIGFkZCB0byBodWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RvX3RoaW5nIHlheSVzLnBuZyAzMCAyMCBodWROYW1lIC0gbWFrZSBhIGh1ZCBpZiBpdCBkb2VzbnQgZXhpc3QsIGFkZCB0aGlzIGJ1dHRvbiB0byBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaHVkTmFtZSA9IHBhcmFtc1s0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFrZUh1ZChodWROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaHVkU2NyZWVuc1todWROYW1lXS5BZGRCdXR0b24odGhpcy5jaGFyYWN0ZXJzLCB7a25vdDogcGFyYW1zWzBdLCB0ZXh0OiBwYXJhbXNbMV0sIHBvc2l0aW9uOiBuZXcgUG9pbnQocGFyc2VJbnQocGFyYW1zWzJdKSwgcGFyc2VJbnQocGFyYW1zWzNdKSl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsYWJlbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cIm15IGJvcmluZyBsYWJlbFwiIDMwIDIwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAzICkgeyAvLyBubyBodWQgd2FzIHBhc3NlZCwgYWRkIHRvIHNjZW5lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbi5BZGRCdXR0b24odGhpcy5jaGFyYWN0ZXJzLCB7a25vdDogbnVsbCwgdGV4dDogcGFyYW1zWzBdLCBwb3NpdGlvbjogbmV3IFBvaW50KHBhcnNlSW50KHBhcmFtc1sxXSksIHBhcnNlSW50KHBhcmFtc1syXSkpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLmxlbmd0aCA9PT0gNCApIHsgLy8gaHVkIHdhcyBwYXNzZWQsIGFkZCB0byBodWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1wibXkgYm9yaW5nIGxhYmVsXCIgMzAgMjAgaHVkTmFtZSAtIG1ha2UgYSBodWQgaWYgaXQgZG9lc250IGV4aXN0LCBhZGQgdGhpcyBidXR0b24gdG8gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh1ZE5hbWUgPSBwYXJhbXNbM107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ha2VIdWQoaHVkTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnNbaHVkTmFtZV0uQWRkQnV0dG9uKHRoaXMuY2hhcmFjdGVycywge2tub3Q6IG51bGwsIHRleHQ6IHBhcmFtc1swXSwgcG9zaXRpb246IG5ldyBQb2ludChwYXJzZUludChwYXJhbXNbMV0pLCBwYXJzZUludChwYXJhbXNbMl0pKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImh1ZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaHVkTmFtZSA9IHBhcmFtc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh1ZE5hbWUgaW4gdGhpcy5odWRTY3JlZW5zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbiA9IGh1ZE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2hvd1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLlNob3codmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMuSGlkZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkhpZGVBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiZ21cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheUJHTSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5TdG9wQkdNKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNmeFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5QbGF5U0ZYKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2l0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBuZXcgTGF5ZXJzLlRyYW5zaXRpb24odGhpcy5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5PbkVuZC5Pbigoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVua25vd24gdGFncyBhcmUgdHJlYXRlZCBhcyBuYW1lc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWFraW5nQ2hhcmFjdGVyTmFtZSA9IGdldEZpbmFsVmFsdWUodGFnc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb250aW51ZSgpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICBpZiAodGhpcy5TdG9yeS5jYW5Db250aW51ZSkge1xuICAgICAgICAgICAgdGhpcy5TdG9yeS5Db250aW51ZSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5TdG9yeS5jdXJyZW50VGV4dC5yZXBsYWNlKC9cXHMvZywgXCJcIikubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZVNjcmVlbi5jaG9pY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5jaG9pY2VTY3JlZW4gO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0aWxsIHJlcXVpcmVkIGZvciBpbml0aWF0aW9uIHdoZW4gdGhlcmUgaXMgbm8gdGV4dFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLnNwZWVjaFNjcmVlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuc3BlZWNoU2NyZWVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU3RvcnkuY3VycmVudENob2ljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4uQ2hvaWNlcyA9IHRoaXMuU3RvcnkuY3VycmVudENob2ljZXM7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLmNob2ljZVNjcmVlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRPRE8gSXQncyB0aGUgZW5kXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlQ2xpY2soc2VuZGVyIDogQ2FudmFzLCBjbGlja1Bvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbiBpbnN0YW5jZW9mIExheWVycy5DaG9pY2VMYXllcikge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuLk1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiwgdGhpcy52YWxpZGF0ZUNob2ljZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sICgpID0+IHRoaXMuY29udGludWUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaHVkU2NyZWVuIGluIHRoaXMuaHVkU2NyZWVucykge1xuICAgICAgICAgICAgdGhpcy5odWRTY3JlZW5zW3RoaXMuaHVkU2NyZWVuXS5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sIHRoaXMudmFsaWRhdGVDaG9pY2UuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlTW92ZShzZW5kZXIgOiBDYW52YXMsIG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmN1cnJlbnRTY3JlZW4uTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24pO1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soc2VuZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmh1ZFNjcmVlbiBpbiB0aGlzLmh1ZFNjcmVlbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrSHVkID0gdGhpcy5odWRTY3JlZW5zW3RoaXMuaHVkU2NyZWVuXS5Nb3VzZU1vdmUobW91c2VQb3NpdGlvbik7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tIdWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrSHVkKHNlbmRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdFN0ZXAoKSA6IHZvaWQge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RlcC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0ZXAodGltZXN0YW1wIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNUaW1lc3RhbXA7XG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG5cbiAgICAgICAgdGhpcy5DYW52YXMuQ2xlYXIoKTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkRyYXcodGhpcy5DYW52YXMpO1xuICAgICAgICBpZiAodGhpcy5odWRTY3JlZW4gJiYgdGhpcy5odWRTY3JlZW4gaW4gdGhpcy5odWRTY3JlZW5zKSB7XG4gICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnNbdGhpcy5odWRTY3JlZW5dLkRyYXcodGhpcy5DYW52YXMpOyAvL2RyYXcgb25lIG9mIGEgbnVtYmVyIG9mIGh1ZHMsIGNyZWF0ZWQgd2hlbiBhZGRpbmcgYnV0dG9uc1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uLkRyYXcodGhpcy5DYW52YXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuLkRyYXcodGhpcy5DYW52YXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcbiAgICB9XG5cbiAgICAvLyB3aGVuIG51bWJlcixpdHMgYSBjaG9pY2VJbmRleCwgd2hlbiBzdHJpbmcgLSBpdHMgYSBrbm90XG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUNob2ljZShjaG9pY2UgOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsKSA6IHZvaWQge1xuICAgICAgICBpZiAoY2hvaWNlID09PSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmICh0eXBlb2YgY2hvaWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLlN0b3J5LkNob29zZVBhdGhTdHJpbmcoY2hvaWNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ2hvb3NlQ2hvaWNlSW5kZXgoY2hvaWNlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLmNoYXJhY3RlcnMuSGlkZUFsbCgpO1xuICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJUmVjdCB7XG4gICAgUG9zaXRpb24gOiBQb2ludDtcbiAgICBTaXplIDogUG9pbnQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQb2ludCB7XG4gICAgcHJpdmF0ZSB4IDogbnVtYmVyO1xuICAgIHByaXZhdGUgeSA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCk7XG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlcik7XG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlciwgeSA6IG51bWJlcik7XG4gICAgY29uc3RydWN0b3IoeD8gOiBudW1iZXIsIHk/IDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHggIT0gbnVsbCA/IHggOiAwO1xuICAgICAgICB0aGlzLnkgPSB5ICE9IG51bGwgPyB5IDogeCAhPSBudWxsID8geCA6IDA7XG4gICAgfVxuXG4gICAgZ2V0IFgoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfVxuXG4gICAgc2V0IFgoeCA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgIH1cblxuICAgIGdldCBZKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH1cblxuICAgIHNldCBZKHkgOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICBBZGQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICsgcG9pbnQuWCwgdGhpcy5ZICsgcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgQ2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlgsIHRoaXMuWSk7XG4gICAgfVxuXG4gICAgRGl2KHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCAvIHBvaW50LlgsIHRoaXMuWSAvIHBvaW50LlkpO1xuICAgIH1cblxuICAgIFBlcmNlbnQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoKHBvaW50LlggLyAxMDApICogdGhpcy5YICwgKHBvaW50LlkgLyAxMDApICogdGhpcy5ZKTtcbiAgICB9XG5cbiAgICBJc0luUmVjdChyZWN0IDogSVJlY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWCA+PSByZWN0LlBvc2l0aW9uLlggJiYgdGhpcy5YIDw9IHJlY3QuUG9zaXRpb24uQWRkKHJlY3QuU2l6ZSkuWFxuICAgICAgICAgICAgJiYgdGhpcy5ZID49IHJlY3QuUG9zaXRpb24uWSAmJiB0aGlzLlkgPD0gcmVjdC5Qb3NpdGlvbi5BZGQocmVjdC5TaXplKS5ZO1xuICAgIH1cblxuICAgIE11bHQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICogcG9pbnQuWCwgdGhpcy5ZICogcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgU3ViKHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5BZGQobmV3IFBvaW50KC1wb2ludC5YLCAtcG9pbnQuWSkpO1xuICAgIH1cbn1cbiIsImNsYXNzIENsYXNzUHJlbG9hZGVyIHtcbiAgICBQcmVsb2FkKHVybCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgZmV0Y2godXJsKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXIgPSBuZXcgQ2xhc3NQcmVsb2FkZXIoKTtcbiJdfQ==
