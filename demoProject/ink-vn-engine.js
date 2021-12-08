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
                if (choice.id && mousePosition.IsInRect(choice.BoundingRect)) {
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
        console.log("TAGS =====", tags);
        if (tags.length > 0) {
            for (let i = 0; i < tags.length; ++i) {
                const match = tags[i].match(/^(\w+)\s*:\s*(.*)$/);
                // const match = tags[i].match(/^(\w+)\s*:(".*?"|[^"\s]+)+(?=\s*|\s*$)$/);
                console.log("MATCH", match);
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
        if (this.transition != null) {
            this.transition.Draw(this.Canvas);
        }
        else {
            this.currentScreen.Draw(this.Canvas);
        }
        if (this.hudScreen && this.hudScreen in this.hudScreens) {
            this.hudScreens[this.hudScreen].Draw(this.Canvas); //draw one of a number of huds, created when adding buttons
        }
        this.requestStep();
    }
    // when number,its a choiceIndex, when string - its a knot
    validateChoice(choice) {
        if (!choice)
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsdUNBQXVDO0FBRXZDLE1BQWEsWUFBWTtJQUNyQixNQUFNLENBQUMsTUFBTTtRQUNULElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksY0FBYyxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSjtBQVJELG9DQVFDO0FBRUQsTUFBc0IsS0FBSztDQUkxQjtBQUpELHNCQUlDO0FBRUQsTUFBTSxjQUFlLFNBQVEsS0FBSztJQUk5QixPQUFPLENBQUMsTUFBZTtRQUNuQixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsT0FBTyxFQUFHO29CQUNOLElBQUksRUFBRyxJQUFJO29CQUNYLElBQUksRUFBRyxNQUFNO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUcsTUFBTTthQUNsQixFQUFFLEdB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RyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELElBQUksQ0FBQyxLQUFhO1FBQ2QsT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjtBQXhERCxzQkF3REM7Ozs7OztBQzdERCxNQUFNLGNBQWM7SUFDaEIsT0FBTyxDQUFDLEdBQVk7UUFDaEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztDQUNKO0FBRVksUUFBQSxTQUFTLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCAqIGFzIFBpenppY2F0byBmcm9tIFwicGl6emljYXRvXCI7XG5cbmV4cG9ydCBjbGFzcyBBdWRpb0ZhY3Rvcnkge1xuICAgIHN0YXRpYyBDcmVhdGUoKSA6IEF1ZGlvIHtcbiAgICAgICAgaWYgKFBpenppY2F0byAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBpenppY2F0b0F1ZGlvKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IER1bW15QXVkaW8oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEF1ZGlvIHtcbiAgICBhYnN0cmFjdCBQbGF5QkdNKGJnbVVSTCA6IHN0cmluZykgOiB2b2lkO1xuICAgIGFic3RyYWN0IFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQ7XG4gICAgYWJzdHJhY3QgU3RvcEJHTSgpIDogdm9pZDtcbn1cblxuY2xhc3MgUGl6emljYXRvQXVkaW8gZXh0ZW5kcyBBdWRpbyB7XG4gICAgcHJpdmF0ZSBiZ20gOiBQaXp6aWNhdG8uU291bmQ7XG4gICAgcHJpdmF0ZSBiZ21VUkwgOiBzdHJpbmc7XG5cbiAgICBQbGF5QkdNKGJnbVVSTCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgaWYgKGJnbVVSTCAhPT0gdGhpcy5iZ21VUkwpIHtcbiAgICAgICAgICAgIHRoaXMuYmdtVVJMID0gYmdtVVJMO1xuXG4gICAgICAgICAgICBjb25zdCBiZ20gPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcbiAgICAgICAgICAgICAgICBvcHRpb25zIDoge1xuICAgICAgICAgICAgICAgICAgICBsb29wIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA6IGJnbVVSTFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc291cmNlIDogXCJmaWxlXCJcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iZ20gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnbS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdtLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYmdtLnBsYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJnbSA9IGJnbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUGxheVNGWChzZnhVUkwgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNmeCA9IG5ldyBQaXp6aWNhdG8uU291bmQoe1xuICAgICAgICAgICAgb3B0aW9ucyA6IHsgcGF0aCA6IHNmeFVSTCB9LFxuICAgICAgICAgICAgc291cmNlIDogXCJmaWxlXCJcbiAgICAgICAgfSwgKCkgPT4gc2Z4LnBsYXkoKSk7XG4gICAgfVxuXG4gICAgU3RvcEJHTSgpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmJnbSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmJnbS5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmJnbS5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB0aGlzLmJnbVVSTCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmJnbSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIER1bW15QXVkaW8gZXh0ZW5kcyBBdWRpbyB7XG4gICAgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZCB7IH1cbiAgICBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkIHsgfVxuICAgIFN0b3BCR00oKSA6IHZvaWQgeyB9XG59XG4iLCJpbXBvcnQgeyBMaXRlRXZlbnQgfSBmcm9tIFwiLi9ldmVudHNcIjtcbmltcG9ydCB7IElSZWN0LCBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICAgIHByaXZhdGUgX29uQ2xpY2sgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4gPSBuZXcgTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+KCk7XG4gICAgcHJpdmF0ZSBfb25Nb3ZlIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+ID0gbmV3IExpdGVFdmVudDxDYW52YXMsIFBvaW50PigpO1xuICAgIHByaXZhdGUgY3R4IDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgZWxlbWVudCA6IEhUTUxDYW52YXNFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVySUQgOiBzdHJpbmcsIHNpemUgOiBQb2ludCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJRCk7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lci50YWdOYW1lID09PSBcImNhbnZhc1wiKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBjb250YWluZXIgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBzaXplLlg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBzaXplLlk7XG5cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICBpZiAoIXRoaXMuY3R4KSB7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuX2NsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLl9tb3ZlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuQ2xlYXIoKTtcbiAgICB9XG5cbiAgICBnZXQgU2l6ZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuZWxlbWVudC53aWR0aCwgdGhpcy5lbGVtZW50LmhlaWdodCk7XG4gICAgfVxuXG4gICAgc2V0IFNpemUoc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IHNpemUuWDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IHNpemUuWTtcbiAgICB9XG5cbiAgICBDbGVhcigpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIERyYXdCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2UgOiBJbWFnZUJpdG1hcCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwLCB0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIERyYXdJbWFnZShpbWFnZSA6IEltYWdlQml0bWFwLCBwb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1hZ2UsIHBvc2l0aW9uLlgsIHBvc2l0aW9uLlksIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpO1xuICAgIH1cblxuICAgIERyYXdJbWFnZVRvKGltYWdlIDogSW1hZ2VCaXRtYXAsIHNvdXJjZSA6IElSZWN0LCBkZXN0aW5hdGlvbiA6IElSZWN0KSB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgc291cmNlLlBvc2l0aW9uLlgsIHNvdXJjZS5Qb3NpdGlvbi5ZLFxuICAgICAgICAgICAgc291cmNlLlNpemUuWCwgc291cmNlLlNpemUuWSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uLlBvc2l0aW9uLlgsIGRlc3RpbmF0aW9uLlBvc2l0aW9uLlksXG4gICAgICAgICAgICBkZXN0aW5hdGlvbi5TaXplLlgsIGRlc3RpbmF0aW9uLlNpemUuWVxuICAgICAgICApO1xuICAgIH1cblxuICAgIERyYXdSZWN0KHBvc2l0aW9uIDogUG9pbnQsIHNpemUgOiBQb2ludCwgY29sb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBzaXplLlgsIHNpemUuWSk7XG4gICAgfVxuXG4gICAgRHJhd1JlY3QwKHNpemUgOiBQb2ludCwgY29sb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuRHJhd1JlY3QobmV3IFBvaW50KCksIHNpemUsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBEcmF3VGV4dCh0ZXh0IDogc3RyaW5nLCBwb3NpdGlvbiA6IFBvaW50LCBjb2xvciA6IHN0cmluZywgZm9udFNpemUgOiBudW1iZXIsIG1heFdpZHRoPyA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSBgJHtmb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcbiAgICAgICAgdGhpcy5jdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFRleHQodGV4dC5yZXBsYWNlKC9eXCIoLiopXCIkLywgXCIkMVwiKSwgcG9zaXRpb24uWCwgcG9zaXRpb24uWSwgbWF4V2lkdGgpO1xuICAgIH1cblxuICAgIERyYXdUZXh0MCh0ZXh0IDogc3RyaW5nLCBjb2xvciA6IHN0cmluZywgZm9udFNpemUgOiBudW1iZXIsIG1heFdpZHRoPyA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5EcmF3VGV4dCh0ZXh0LCBuZXcgUG9pbnQoKSwgY29sb3IsIGZvbnRTaXplLCBtYXhXaWR0aCk7XG4gICAgfVxuXG4gICAgR2V0SW1hZ2VEYXRhKCkgOiBJbWFnZURhdGEge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMuU2l6ZS5YLCB0aGlzLlNpemUuWSk7XG4gICAgfVxuXG4gICAgTWVhc3VyZVRleHRXaWR0aCh0ZXh0IDogc3RyaW5nKSA6IG51bWJlciB7XG4gICAgICAgIC8vIFdlIG1lYXN1cmUgd2l0aCB0aGUgbGFzdCBmb250IHVzZWQgaW4gdGhlIGNvbnRleHRcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoO1xuICAgIH1cblxuICAgIFJlc3RvcmUoKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgU2V0Q3Vyc29yKGN1cnNvciA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmN1cnNvciA9IGN1cnNvcjtcbiAgICB9XG5cbiAgICBUcmFuc2xhdGUocG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5SZXN0b3JlKCk7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHBvc2l0aW9uLlgsIHBvc2l0aW9uLlkpO1xuICAgIH1cblxuICAgIGdldCBPbkNsaWNrKCkgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25DbGljay5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBnZXQgT25Nb3ZlKCkgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25Nb3ZlLkV4cG9zZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NsaWNrKGV2IDogTW91c2VFdmVudCkgOiB2b2lkIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fb25DbGljay5UcmlnZ2VyKHRoaXMsIG5ldyBQb2ludChcbiAgICAgICAgICAgIGV2LnBhZ2VYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICBldi5wYWdlWSAtIHRoaXMuZWxlbWVudC5vZmZzZXRUb3BcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbW92ZShldiA6IE1vdXNlRXZlbnQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuX29uTW92ZS5UcmlnZ2VyKHRoaXMsIG5ldyBQb2ludChcbiAgICAgICAgICAgIGV2LnBhZ2VYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICBldi5wYWdlWSAtIHRoaXMuZWxlbWVudC5vZmZzZXRUb3BcbiAgICAgICAgKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSGlkZGVuQ2FudmFzIGV4dGVuZHMgQ2FudmFzIHtcbiAgICBwcml2YXRlIGhpZGRlbkVsZW1lbnQgOiBIVE1MRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKHNpemUgOiBQb2ludCkge1xuICAgICAgICBjb25zdCBpZCA9IGBjXyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygpLnNsaWNlKDIsIDcpfWA7XG4gICAgICAgIGNvbnN0IGhpZGRlbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBoaWRkZW5FbGVtZW50LmlkID0gaWQ7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaGlkZGVuRWxlbWVudCk7XG5cbiAgICAgICAgc3VwZXIoaWQsIHNpemUpO1xuXG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudCA9IGhpZGRlbkVsZW1lbnQ7XG4gICAgfVxuXG4gICAgRGVzdHJveSgpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGlkZGVuRWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5cbmNsYXNzIENsYXNzQ29uZmlnIHtcbiAgICBEZWZhdWx0VGV4dFNwZWVkIDogbnVtYmVyID0gMzA7XG4gICAgUm9vdFBhdGggOiBzdHJpbmcgPSBcIlwiO1xuICAgIFJvb3RQYXRoSXNSZW1vdGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBTY3JlZW5TaXplIDogUG9pbnQgPSBuZXcgUG9pbnQoODAwLCA2MDApO1xuXG4gICAgcHJpdmF0ZSB0ZXh0U3BlZWQgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB0ZXh0U3BlZWRSYXRpbyA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLlRleHRTcGVlZCA9IHRoaXMuRGVmYXVsdFRleHRTcGVlZDsgLy8gVGhpcyBpcyBpbiBjaGFyIHBlciBzZWNvbmRcbiAgICB9XG5cbiAgICBMb2FkKHRhZ3MgOiBzdHJpbmdbXSkgOiB2b2lkIHtcbiAgICAgICAgZnVuY3Rpb24gZXJyb3IodGFnIDogc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciByZWFkaW5nIHRhZzogXCIke3RhZ31cImApO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQga2V5LCB2YWx1ZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAga2V5ID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMV0udHJpbSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNjcmVlbl9zaXplXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5zaXplXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSB2YWx1ZS5zcGxpdCgvXFxEKy8pLm1hcCh4ID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2l6ZS5sZW5ndGggPT09IDIgJiYgIWlzTmFOKHNpemVbMF0pICYmICFpc05hTihzaXplWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyZWVuU2l6ZSA9IG5ldyBQb2ludChzaXplWzBdLCBzaXplWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRfc3BlZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRzcGVlZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVlZCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHNwZWVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRGVmYXVsdFRleHRTcGVlZCA9IHRoaXMuVGV4dFNwZWVkID0gc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290X3BhdGhcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvb3RwYXRoXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm9vdFBhdGggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290X3BhdGhfaXNfcmVtb3RlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290cGF0aGlzcmVtb3RlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm9vdFBhdGhJc1JlbW90ZSA9IHZhbHVlID09PSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBUZXh0U3BlZWQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRTcGVlZDtcbiAgICB9XG5cbiAgICBzZXQgVGV4dFNwZWVkKHZhbHVlIDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudGV4dFNwZWVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMudGV4dFNwZWVkUmF0aW8gPSAxMDAwLjAgLyB0aGlzLnRleHRTcGVlZDtcbiAgICB9XG5cbiAgICBnZXQgVGV4dFNwZWVkUmF0aW8oKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRTcGVlZFJhdGlvO1xuICAgIH1cbn1cblxuZXhwb3J0IGxldCBDb25maWcgPSBuZXcgQ2xhc3NDb25maWcoKTtcbiIsImV4cG9ydCBjbGFzcyBMaXRlRXZlbnQ8VDEsIFQyPiB7XG4gICAgcHJpdmF0ZSBoYW5kbGVycyA6IEFycmF5PChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgRXhwb3NlKCkgOiBMaXRlRXZlbnQ8VDEsIFQyPiB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIE9mZihoYW5kbGVyIDogKHNlbmRlciA6IFQxLCBhcmc/IDogVDIpID0+IHZvaWQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmZpbHRlcihfaGFuZGxlciA9PiBfaGFuZGxlciAhPT0gaGFuZGxlcik7XG4gICAgfVxuXG4gICAgT24oaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgVHJpZ2dlcihzZW5kZXIgOiBUMSwgYXJncz8gOiBUMikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGhhbmRsZXIgPT4gaGFuZGxlcihzZW5kZXIsIGFyZ3MpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIExheWVyIHtcbiAgICBwcml2YXRlIGJhY2tncm91bmRJbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgYmFja2dyb3VuZEltYWdlVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZVVSTD8gOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoaW1hZ2VVUkwgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2VVUkwgOiBzdHJpbmcgfCBJbWFnZUJpdG1hcCkge1xuICAgICAgICBpZiAodHlwZW9mIGltYWdlVVJMID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuYmFja2dyb3VuZEltYWdlVVJMKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VVUkwgPSBpbWFnZVVSTDtcbiAgICAgICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKGltYWdlVVJMKS50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kSW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdCYWNrZ3JvdW5kSW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzLCBIaWRkZW5DYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmV4cG9ydCBlbnVtIEJveEJhY2tncm91bmRUeXBlcyB7XG4gICAgQ09MT1IsIE5JTkVQQVRDSCwgU1RSRVRDSFxufVxuXG5jbGFzcyBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5IHtcbiAgICBDcmVhdGUodHlwZSA6IEJveEJhY2tncm91bmRUeXBlcywgYmFja2dyb3VuZCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkgOiBCb3hCYWNrZ3JvdW5kIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5DT0xPUjoge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3JlZEJveEJhY2tncm91bmQoYmFja2dyb3VuZCwgc2l6ZSwgcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuTklORVBBVENIOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLlNUUkVUQ0g6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0cmV0Y2hCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJveEJhY2tncm91bmRGYWN0b3J5IDogQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSA9IG5ldyBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5KCk7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByb3RlY3RlZCBib3ggOiBJUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmJveCA9IHtcbiAgICAgICAgICAgIFBvc2l0aW9uIDogcG9zaXRpb24gPT0gbnVsbCA/IG5ldyBQb2ludCgpIDogcG9zaXRpb24sXG4gICAgICAgICAgICBTaXplIDogc2l6ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNldCBQb3NpdGlvbihwb3NpdGlvbiA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm94LlBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgfVxuXG4gICAgc2V0IFNpemUoc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm94LlNpemUgPSBzaXplO1xuICAgIH1cbn1cblxuY2xhc3MgQ29sb3JlZEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBDb2xvciA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGNvbG9yIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKHNpemUsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLkNvbG9yID0gY29sb3I7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3UmVjdCh0aGlzLmJveC5Qb3NpdGlvbiwgdGhpcy5ib3guU2l6ZSwgdGhpcy5Db2xvcik7XG4gICAgfVxufVxuXG5jbGFzcyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgcHJpdmF0ZSBuaW5lUGF0Y2ggOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIG5pbmVQYXRjaFVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5pbmVQYXRjaFVSTCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5OaW5lUGF0Y2ggPSBuaW5lUGF0Y2hVUkw7XG4gICAgfVxuXG4gICAgc2V0IE5pbmVQYXRjaChuaW5lUGF0Y2hVUkwgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG5pbmVQYXRjaFVSTCAhPT0gdGhpcy5uaW5lUGF0Y2hVUkwpIHtcbiAgICAgICAgICAgIHRoaXMubmluZVBhdGNoVVJMID0gbmluZVBhdGNoVVJMO1xuXG4gICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKG5pbmVQYXRjaFVSTClcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoaWRkZW5DYW52YXMgPSBuZXcgSGlkZGVuQ2FudmFzKHRoaXMuYm94LlNpemUuQ2xvbmUoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hTaXplID0gbmV3IFBvaW50KGltYWdlLndpZHRoIC8gMywgaW1hZ2UuaGVpZ2h0IC8gMyk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkcmF3UGF0Y2hUbyhwYXRjaFBvc2l0aW9uIDogUG9pbnQsIGRlc3RQb3MgOiBQb2ludCwgZGVzdFNpemU/IDogUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuQ2FudmFzLkRyYXdJbWFnZVRvKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UsIHsgUG9zaXRpb24gOiBwYXRjaFBvc2l0aW9uLCBTaXplIDogcGF0Y2hTaXplIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogZGVzdFBvcywgU2l6ZSA6IGRlc3RTaXplICE9IG51bGwgPyBkZXN0U2l6ZSA6IHBhdGNoU2l6ZSB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hEZXN0aW5hdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCgpLCBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoMCwgdGhpcy5ib3guU2l6ZS5ZIC0gcGF0Y2hTaXplLlkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIHBhdGNoU2l6ZS5ZKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8obmV3IFBvaW50KCksIHBhdGNoRGVzdGluYXRpb25zWzBdKTsgLy8gVXBwZXIgTGVmdFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAwKSksIHBhdGNoRGVzdGluYXRpb25zWzFdKTsgLy8gVXBwZXIgUmlnaHRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1syXSk7IC8vIExvd2VyIExlZnRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1szXSk7IC8vIExvd2VyIFJpZ2h0XG5cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gKHBhdGNoU2l6ZS5YICogMiksIHBhdGNoU2l6ZS5ZKSk7IC8vIFRvcFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAxKSksIHBhdGNoRGVzdGluYXRpb25zWzFdLkFkZChuZXcgUG9pbnQoMCwgcGF0Y2hTaXplLlkpKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSAocGF0Y2hTaXplLlkgKiAyKSkpOyAvLyBSaWdodFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAyKSksIHBhdGNoRGVzdGluYXRpb25zWzJdLkFkZChuZXcgUG9pbnQocGF0Y2hTaXplLlgsIDApKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIChwYXRjaFNpemUuWCAqIDIpLCBwYXRjaFNpemUuWSkpOyAvLyBCb3R0b21cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQocGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIChwYXRjaFNpemUuWSAqIDIpKSk7IC8vIExlZnRcblxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksIHRoaXMuYm94LlNpemUuU3ViKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAyKSkpKTsgLy8gQ2VudGVyXG5cbiAgICAgICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChoaWRkZW5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpLnRoZW4obmluZVBhdGNoSW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5pbmVQYXRjaCA9IG5pbmVQYXRjaEltYWdlO1xuICAgICAgICAgICAgICAgICAgICAvLyBoaWRkZW5DYW52YXMuRGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmluZVBhdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2UodGhpcy5uaW5lUGF0Y2gsIHRoaXMuYm94LlBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgU3RyZXRjaEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBwcml2YXRlIGltYWdlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBpbWFnZVNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIGltYWdlVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoaW1hZ2VVUkwgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5JbWFnZSA9IGltYWdlVVJMO1xuICAgIH1cblxuICAgIHNldCBJbWFnZShpbWFnZVVSTCA6IHN0cmluZykge1xuICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuaW1hZ2VVUkwpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VVUkwgPSBpbWFnZVVSTDtcblxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTClcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNpemUgPSBuZXcgUG9pbnQodGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZVRvKFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IG5ldyBQb2ludCgpLCBTaXplIDogdGhpcy5pbWFnZVNpemUgfSxcbiAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogdGhpcy5ib3guUG9zaXRpb24sIFNpemUgOiB0aGlzLmJveC5TaXplIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgc3ByaXRlcyA6IHtbY3VycmVudFN0YXRlIDogc3RyaW5nXSA6IEltYWdlQml0bWFwfTsgLy8gbG9hZGVkIHN0YXRlIHNwcml0ZXNcbiAgICBwcml2YXRlIGFuY2hvciA6IHN0cmluZyB8IFBvaW50OyAvLyBjdXJyZW50IGFuY2hvclxuICAgIHByaXZhdGUgY3VycmVudFN0YXRlIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDsgLy8gY3VycmVudCBwb3NpdGlvblxuICAgIHByaXZhdGUgc2hvdyA6IGJvb2xlYW47IC8vIGN1cnJlbnRseSB2aXNpYmxlXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBcImRlZmF1bHRcIjtcbiAgICAgICAgdGhpcy5zcHJpdGVzID0ge307XG4gICAgICAgIHRoaXMuc2hvdyA9IGZhbHNlO1xuICAgIH1cblxuICAgIEltYWdlKHNwcml0ZVVSTCA6IHN0cmluZywgc3ByaXRlS2V5IDogc3RyaW5nKSB7XG4gICAgICAgIExvYWRlci5Mb2FkSW1hZ2Uoc3ByaXRlVVJMKS50aGVuKGltYWdlID0+IHRoaXMuc3ByaXRlc1tzcHJpdGVLZXldID0gaW1hZ2UpO1xuICAgIH1cblxuICAgIFNob3coc3ByaXRlS2V5IDogc3RyaW5nLCBhbmNob3IgOiBzdHJpbmcgfCBQb2ludCkge1xuICAgICAgICB0aGlzLnNob3cgPSB0cnVlO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHNwcml0ZUtleTtcbiAgICAgICAgaWYgKGFuY2hvcikge1xuICAgICAgICAgICAgdGhpcy5hbmNob3IgPSBhbmNob3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBIaWRlKCkge1xuICAgICAgICB0aGlzLnNob3cgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnNob3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcHJpdGUgPSB0aGlzLnNwcml0ZXNbdGhpcy5jdXJyZW50U3RhdGVdO1xuICAgICAgICBpZiAoc3ByaXRlICE9IG51bGwpIHtcbiAgICAgICAgbGV0IHggOiBudW1iZXI7XG4gICAgICAgIGxldCB5ID0gY2FudmFzLlNpemUuWSAtIHNwcml0ZS5oZWlnaHQ7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hbmNob3IgPT09IFwic3RyaW5nXCIpIHsgLy8gbGVmdC9yaWdodC9ldGNcbiAgICAgICAgICAgIHggPSAoY2FudmFzLlNpemUuWCAvIDIgKSAtIChzcHJpdGUud2lkdGggLyAyKTsvLyBkZWZhdWx0IHRvIGNlbnRyZVxuICAgICAgICAgICAgaWYgKHRoaXMuYW5jaG9yID09PSBcImxlZnRcIiB8fCB0aGlzLmFuY2hvciA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgeCA9IHRoaXMuYW5jaG9yID09PSBcImxlZnRcIiA/IDAgOiBjYW52YXMuU2l6ZS5YIC0gc3ByaXRlLndpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IHRoaXMuYW5jaG9yLlg7XG4gICAgICAgICAgICB5ID0gdGhpcy5hbmNob3IuWTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHlcbiAgICAgICAgKTtcblxuICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHNwcml0ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBHZXRJbWFnZShzcHJpdGVTdGF0ZSA6IHN0cmluZykgOiBJbWFnZUJpdG1hcCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3ByaXRlcywgc3ByaXRlU3RhdGUsXCItLS1cIilcbiAgICAgICAgaWYgKHNwcml0ZVN0YXRlIGluIHRoaXMuc3ByaXRlcykge1xuICAgICAgICAgICAgY29uc3Qgc3ByaXRlID0gdGhpcy5zcHJpdGVzW3Nwcml0ZVN0YXRlXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1BSSVRFID09PT4gXCIsIHNwcml0ZSlcbiAgICAgICAgICAgIHJldHVybiBzcHJpdGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJzIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgY2hhcmFjdGVycyA6IHsgW2EgOiBzdHJpbmddIDogQ2hhcmFjdGVyIH0gPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIEFkZChzcHJpdGVXaXRoUGFyYW1zIDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlckRhdGEgPSAgc3ByaXRlV2l0aFBhcmFtcy5zcGxpdChcIiBcIik7XG4gICAgICAgIGlmICghKGNoYXJhY3RlckRhdGFbMF0gaW4gdGhpcy5jaGFyYWN0ZXJzKSkge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3RlckRhdGFbMF1dID0gbmV3IENoYXJhY3RlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJEYXRhWzBdXS5JbWFnZShjaGFyYWN0ZXJEYXRhWzJdLCBjaGFyYWN0ZXJEYXRhWzFdKTtcbiAgICB9XG5cbiAgICBTaG93KHNwcml0ZVdpdGhQYXJhbXMgOiBzdHJpbmcsIHBvc2l0aW9uPyA6IFBvaW50IHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlckRhdGEgPSAgc3ByaXRlV2l0aFBhcmFtcy5zcGxpdChcIiBcIik7XG4gICAgICAgIC8vICMgc2hvdzogYW55YSBoYXBweSBbbGVmdF1cbiAgICAgICAgaWYgKGNoYXJhY3RlckRhdGFbMF0gaW4gIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3RlckRhdGFbMF1dLlNob3coY2hhcmFjdGVyRGF0YVsxXSwgcG9zaXRpb24gfHwgY2hhcmFjdGVyRGF0YVsyXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBHZXRJbWFnZShzcHJpdGVOYW1lIDogc3RyaW5nLCBzcHJpdGVTdGF0ZSA6IHN0cmluZykgOiBJbWFnZUJpdG1hcCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmIChzcHJpdGVOYW1lIGluICB0aGlzLmNoYXJhY3RlcnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSVRTIElOXCIsIHNwcml0ZU5hbWUpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJzW3Nwcml0ZU5hbWVdLkdldEltYWdlKHNwcml0ZVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIEhpZGUoc3ByaXRlV2l0aFBhcmFtcyA6IHN0cmluZykge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJEYXRhID0gIHNwcml0ZVdpdGhQYXJhbXMuc3BsaXQoXCIgXCIpO1xuICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyRGF0YVswXV0uSGlkZSgpO1xuICAgIH1cblxuICAgIEhpZGVBbGwoKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIGluIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3Rlcl0uSGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIGluIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3Rlcl0uRHJhdyhjYW52YXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUmVtb3ZlKCkge1xuICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSB7fTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDaG9pY2UgfSBmcm9tIFwiaW5ranNcIjtcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IElSZWN0LCBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQge0NoYXJhY3RlcnMsIEdhbWVwbGF5TGF5ZXJ9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5jbGFzcyBDaG9pY2VCb3gge1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlciA9IDI0O1xuICAgIHByaXZhdGUgaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UgOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlkIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludCA9IG5ldyBQb2ludCgwLCAyMCk7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdGV4dCA6IHN0cmluZztcbiAgICBwcml2YXRlIGltYWdlPyA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgaG92ZXJJbWFnZT8gOiBJbWFnZUJpdG1hcDtcbiAgICBwdWJsaWMgaXNIb3ZlcmVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoaWQgOiBudW1iZXIsIHRleHQgOiBzdHJpbmcsIHdpZHRoIDogbnVtYmVyLCBwb3NpdGlvbiA6IFBvaW50LCBpbWFnZT8gOiBJbWFnZUJpdG1hcCwgaG92ZXJJbWFnZT8gOiBJbWFnZUJpdG1hcCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG5cbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KHdpZHRoLCAodGhpcy5mb250U2l6ZSAqIDEuNDI4NTcpICsgKDIgKiB0aGlzLmlubmVyTWFyZ2luLlkpKTtcbiAgICAgICAgaWYgKGltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQoaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ob3ZlckltYWdlID0gaG92ZXJJbWFnZTtcblxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuaXNIb3ZlcmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShCb3hCYWNrZ3JvdW5kVHlwZXMuQ09MT1IsIFwicmdiYSgwLCAwLCAwLCAuNylcIiwgdGhpcy5zaXplLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgSWQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cblxuICAgIGdldCBCb3VuZGluZ1JlY3QoKSA6IElSZWN0IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFBvc2l0aW9uIDogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgICAgIFNpemUgOiB0aGlzLnNpemVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0FscmVhZHlCZWVuRHJhd25PbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZUZpcnN0RHJhdyhjYW52YXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmJveEJhY2tncm91bmQuRHJhdyhjYW52YXMpO1xuICAgICAgICAgICAgY2FudmFzLkRyYXdUZXh0KHRoaXMudGV4dCwgdGhpcy5wb3NpdGlvbi5BZGQodGhpcy5pbm5lck1hcmdpbiksIHRoaXMuaXNIb3ZlcmVkID8gXCJ5ZWxsb3dcIiA6IFwid2hpdGVcIiwgdGhpcy5mb250U2l6ZSwgdGhpcy5zaXplLlgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZSh0aGlzLmhvdmVySW1hZ2UgJiYgdGhpcy5pc0hvdmVyZWQgPyB0aGlzLmhvdmVySW1hZ2UgOiB0aGlzLmltYWdlLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYmVmb3JlRmlyc3REcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLkRyYXdUZXh0MChcIlwiLCBcInRyYW5zcGFyZW50XCIsIHRoaXMuZm9udFNpemUpO1xuICAgICAgICB0aGlzLmlubmVyTWFyZ2luLlggPSAodGhpcy5zaXplLlggLSBjYW52YXMuTWVhc3VyZVRleHRXaWR0aCh0aGlzLnRleHQpKSAvIDI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hvaWNlTGF5ZXIgZXh0ZW5kcyBHYW1lcGxheUxheWVyIHtcbiAgICBjaG9pY2VzIDogQ2hvaWNlW10gPSBbXTtcbiAgICBwcml2YXRlIGJvdW5kaW5nUmVjdCA6IFBvaW50O1xuICAgIHByaXZhdGUgY2hvaWNlQm94ZXMgOiBDaG9pY2VCb3hbXSA9IFtdO1xuICAgIHByaXZhdGUgaXNNb3VzZU9uQ2hvaWNlIDogQ2hvaWNlQm94ID0gbnVsbDtcbiAgICBwcml2YXRlIHNjcmVlblNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIHRyYW5zbGF0aW9uIDogUG9pbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzY3JlZW5TaXplIDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcyA9IFtdO1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uID0gbmV3IFBvaW50KDAsIDAgKTtcbiAgICAgICAgdGhpcy5zY3JlZW5TaXplID0gc2NyZWVuU2l6ZTtcbiAgICB9XG5cbiAgICBzZXQgQ2hvaWNlcyhjaG9pY2VzIDogQ2hvaWNlW10pIHtcbiAgICAgICAgdGhpcy5jaG9pY2VzID0gY2hvaWNlcztcblxuICAgICAgICB0aGlzLmNob2ljZUJveGVzID0gW107XG4gICAgICAgIGNvbnN0IHdpZHRoID0gMjAwO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAwKTtcbiAgICAgICAgZm9yIChjb25zdCBfY2hvaWNlIG9mIHRoaXMuY2hvaWNlcykge1xuICAgICAgICAgICAgY29uc3QgbmV3Q2hvaWNlID0gbmV3IENob2ljZUJveChfY2hvaWNlLmluZGV4LCBfY2hvaWNlLnRleHQsIHdpZHRoLCBwb3NpdGlvbi5DbG9uZSgpKTtcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlQm94ZXMucHVzaChuZXdDaG9pY2UpO1xuICAgICAgICAgICAgcG9zaXRpb24uWSArPSBuZXdDaG9pY2UuQm91bmRpbmdSZWN0LlNpemUuWSArIDQwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm91bmRpbmdSZWN0ID0gbmV3IFBvaW50KHdpZHRoLCBwb3NpdGlvbi5ZIC0gNDApO1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9uID0gdGhpcy5zY3JlZW5TaXplLkRpdihuZXcgUG9pbnQoMikpLlN1Yih0aGlzLmJvdW5kaW5nUmVjdC5EaXYobmV3IFBvaW50KDIpKSk7XG4gICAgfVxuXG4gICAgQWRkQnV0dG9uKGNoYXJhY3RlcnMgOiBDaGFyYWN0ZXJzLCBidXR0b24gOiBDaG9pY2UpIHtcbiAgICAgICAgLy8gYWRkIGltYWdlIHRvIGVhY2ggYm94XG4gICAgICAgIGNvbnN0IHJlY3RJbWFnZSA9IGNoYXJhY3RlcnMuR2V0SW1hZ2UoYnV0dG9uLnRleHQsIFwiZGVmYXVsdFwiKTtcbiAgICAgICAgY29uc3QgcmVjdEltYWdlSG92ZXIgPSBjaGFyYWN0ZXJzLkdldEltYWdlKGJ1dHRvbi50ZXh0LCBcImhvdmVyXCIpO1xuICAgICAgICB0aGlzLmNob2ljZXMucHVzaChidXR0b24pO1xuICAgICAgICAvLyBUb2RvIGFkZCBzdXBwb3J0IGZvciBwZXJjZW50IGlmICUgaW4gdmFsdWVzP1xuICAgICAgICBjb25zdCBuZXdCdXR0b24gPSBuZXcgQ2hvaWNlQm94KGJ1dHRvbi5rbm90LCBidXR0b24udGV4dCwgMjAwLCBidXR0b24ucG9zaXRpb24sIHJlY3RJbWFnZSwgcmVjdEltYWdlSG92ZXIpO1xuICAgICAgICB0aGlzLmNob2ljZUJveGVzLnB1c2gobmV3QnV0dG9uKTtcbiAgICB9XG5cbiAgICBDbGVhckJ1dHRvbnMoKXtcbiAgICAgICAgdGhpcy5jaG9pY2VzID0gW107XG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMgPSBbXTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnRyYW5zbGF0aW9uKTtcbiAgICAgICAgZm9yIChjb25zdCBjaG9pY2VCb3ggb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgY2hvaWNlQm94LkRyYXcoY2FudmFzKTtcbiAgICAgICAgfVxuICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xuICAgIH1cblxuICAgIE1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiA6IFBvaW50LCBhY3Rpb24gOiBGdW5jdGlvbikgOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBjaG9pY2VCb3ggb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gY2hvaWNlQm94LkJvdW5kaW5nUmVjdDtcbiAgICAgICAgICAgIGJvdW5kaW5nUmVjdC5Qb3NpdGlvbiA9IGJvdW5kaW5nUmVjdC5Qb3NpdGlvbi5BZGQodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgICAgICBpZiAoY2xpY2tQb3NpdGlvbi5Jc0luUmVjdChib3VuZGluZ1JlY3QpKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uKGNob2ljZUJveC5JZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNb3VzZU1vdmUobW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IChfIDogQ2FudmFzKSA9PiB2b2lkIHtcbiAgICAgICAgbW91c2VQb3NpdGlvbiA9IG1vdXNlUG9zaXRpb24uU3ViKHRoaXMudHJhbnNsYXRpb24pO1xuICAgICAgICBpZiAodGhpcy5pc01vdXNlT25DaG9pY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vdXNlUG9zaXRpb24uSXNJblJlY3QodGhpcy5pc01vdXNlT25DaG9pY2UuQm91bmRpbmdSZWN0KSA/IG51bGwgOiAoY2FudmFzIDogQ2FudmFzKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FudmFzLlNldEN1cnNvcihcImRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hvaWNlIG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcbiAgICAgICAgICAgICAgICBjaG9pY2UuaXNIb3ZlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGNob2ljZS5pZCAmJiBtb3VzZVBvc2l0aW9uLklzSW5SZWN0KGNob2ljZS5Cb3VuZGluZ1JlY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2FudmFzIDogQ2FudmFzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTW91c2VPbkNob2ljZSA9IGNob2ljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5TZXRDdXJzb3IoXCJwb2ludGVyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hvaWNlLmlzSG92ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZCB7IH1cbn1cbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMYXllciB7XG4gICAgYWJzdHJhY3QgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZDtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0ZXBMYXllciBleHRlbmRzIExheWVyIHtcbiAgICBhYnN0cmFjdCBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQ7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHYW1lcGxheUxheWVyIGV4dGVuZHMgU3RlcExheWVyIHtcbiAgICBhYnN0cmFjdCBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZDtcbiAgICBhYnN0cmFjdCBNb3VzZU1vdmUobW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IChfIDogQ2FudmFzKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgKiBmcm9tIFwiLi9iYWNrZ3JvdW5kXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9jaGFyYWN0ZXJzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9jaG9pY2VsYXllclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vc3BlZWNobGF5ZXJcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3RyYW5zaXRpb25cIjtcbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBCb3hCYWNrZ3JvdW5kLCBCb3hCYWNrZ3JvdW5kRmFjdG9yeSwgQm94QmFja2dyb3VuZFR5cGVzIH0gZnJvbSBcIi4vYm94YmFja2dyb3VuZHNcIjtcbmltcG9ydCB7IEdhbWVwbGF5TGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZ1wiO1xuXG5pbnRlcmZhY2UgSUJveENvbmZpZ3VyYXRpb24ge1xuICAgIEJhY2tncm91bmQgOiBzdHJpbmc7XG4gICAgQmFja2dyb3VuZFR5cGUgOiBCb3hCYWNrZ3JvdW5kVHlwZXM7XG4gICAgRm9udENvbG9yIDogc3RyaW5nO1xuICAgIEZvbnRTaXplIDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTcGVlY2hCb3hDb25maWd1cmF0aW9uIGV4dGVuZHMgSUJveENvbmZpZ3VyYXRpb24ge1xuICAgIEhlaWdodCA6IG51bWJlcjtcbiAgICBJbm5lck1hcmdpbiA6IFBvaW50O1xuICAgIE91dGVyTWFyZ2luIDogUG9pbnQ7XG59XG5cbmludGVyZmFjZSBJTmFtZUJveENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBJQm94Q29uZmlndXJhdGlvbiB7XG4gICAgSGVpZ2h0IDogbnVtYmVyO1xuICAgIFdpZHRoIDogbnVtYmVyO1xufVxuXG5jb25zdCBSRVdSQVBfVEhJU19MSU5FID0gXCI8W3tSRVdSQVBfVEhJU19MSU5FfV0+XCI7XG5cbmNsYXNzIFNwZWVjaEJveCB7XG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGZvbnRDb2xvciA6IHN0cmluZztcbiAgICBwcml2YXRlIGZvbnRTaXplIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludDtcbiAgICBwcml2YXRlIGlubmVyU2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgbmV4dFdvcmQgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdGV4dExpbmVzIDogW3N0cmluZz9dID0gW1wiXCJdO1xuXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgc2l6ZSA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSVNwZWVjaEJveENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uLkNsb25lKCk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemUuQ2xvbmUoKTtcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbiA9IGNvbmZpZ3VyYXRpb24uSW5uZXJNYXJnaW47XG4gICAgICAgIHRoaXMuaW5uZXJTaXplID0gdGhpcy5zaXplLlN1Yih0aGlzLmlubmVyTWFyZ2luLk11bHQobmV3IFBvaW50KDIpKSk7XG5cbiAgICAgICAgaWYgKHRoaXMudGV4dExpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uLkJhY2tncm91bmRUeXBlLCBjb25maWd1cmF0aW9uLkJhY2tncm91bmQsXG4gICAgICAgICAgICAgICAgdGhpcy5zaXplLkNsb25lKClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gY29uZmlndXJhdGlvbi5Gb250U2l6ZTtcbiAgICAgICAgdGhpcy5mb250Q29sb3IgPSBjb25maWd1cmF0aW9uLkZvbnRDb2xvcjtcbiAgICB9XG5cbiAgICBnZXQgVGV4dCgpIDogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dExpbmVzLmpvaW4oXCIgXCIpO1xuICAgIH1cblxuICAgIHNldCBUZXh0KHRleHQgOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgX3RleHQgPSB0aGlzLlRleHQ7XG4gICAgICAgIGlmICh0ZXh0LmluZGV4T2YoX3RleHQpID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzbGljZSA9IHRleHQuc2xpY2UoX3RleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdICs9IHNsaWNlO1xuICAgICAgICAgICAgaWYgKHNsaWNlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRXb3JkID0gUkVXUkFQX1RISVNfTElORTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGV4dExpbmVzID0gW3RleHRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IE5leHRXb3JkKG5leHRXb3JkIDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubmV4dFdvcmQgPSBuZXh0V29yZDtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQ/LkRyYXcoY2FudmFzKTtcblxuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24uQWRkKHRoaXMuaW5uZXJNYXJnaW4pKTtcblxuICAgICAgICBpZiAodGhpcy5uZXh0V29yZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmRvVGhlV3JhcChjYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5uZXh0V29yZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGV4dExpbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQoXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbaV0sXG4gICAgICAgICAgICAgICAgbmV3IFBvaW50KDAsIGkgKiAodGhpcy5mb250U2l6ZSAqIDEuNDI4NTcpKSwgLy8gVGhpcyBpcyB0aGUgZ29sZGVuIHJhdGlvLCBvbiBsaW5lLWhlaWdodCBhbmQgZm9udC1zaXplXG4gICAgICAgICAgICAgICAgdGhpcy5mb250Q29sb3IsXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyU2l6ZS5YXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRvVGhlV3JhcChjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3VGV4dDAoXCJcIiwgXCJ0cmFuc3BhcmVudFwiLCB0aGlzLmZvbnRTaXplKTtcbiAgICAgICAgY29uc3QgY29tcCA9IChsaW5lIDogc3RyaW5nKSA9PiBjYW52YXMuTWVhc3VyZVRleHRXaWR0aChsaW5lKSA+IHRoaXMuaW5uZXJTaXplLlg7XG5cbiAgICAgICAgbGV0IGxhc3RMaW5lID0gdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgaWYgKHRoaXMubmV4dFdvcmQgPT09IFJFV1JBUF9USElTX0xJTkUpIHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gd3JhcCB0aGUgZnVjayBvdXQgb2YgdGhpcyBsaW5lXG4gICAgICAgICAgICB3aGlsZSAoY29tcChsYXN0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdG8gdGhlIGNoYXIgd2hlcmUgd2UncmUgb3V0c2lkZSB0aGUgYm91ZGFyaWVzXG4gICAgICAgICAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlICghY29tcChsYXN0TGluZS5zbGljZSgwLCBuKSkpIHsgKytuOyB9XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBwcmV2aW91cyBzcGFjZVxuICAgICAgICAgICAgICAgIHdoaWxlIChsYXN0TGluZVtuXSAhPT0gXCIgXCIgJiYgbiA+PSAwKSB7IC0tbjsgfVxuICAgICAgICAgICAgICAgIGlmIChuID09PSAwKSB7IGJyZWFrOyB9IC8vIFdlIGNhbid0IHdyYXAgbW9yZVxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCwgdXBkYXRlIGxhc3QgbGluZSwgYW5kIGJhY2sgaW4gdGhlIGxvb3BcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lcy5wdXNoKGxhc3RMaW5lLnNsaWNlKG4gKyAxKSk7IC8vICsxIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0aGUgc3BhY2VcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAyXSA9IGxhc3RMaW5lLnNsaWNlKDAsIG4pO1xuICAgICAgICAgICAgICAgIGxhc3RMaW5lID0gdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tcChsYXN0TGluZSArIHRoaXMubmV4dFdvcmQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV0gPSBsYXN0TGluZS5zbGljZSgwLCBsYXN0TGluZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lcy5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBOYW1lQm94IHtcbiAgICBwcml2YXRlIGJhY2tncm91bmRVUkwgOiBzdHJpbmcgPSBcImltYWdlcy85cGF0Y2gtc21hbGwucG5nXCI7XG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGZvbnRDb2xvciA6IHN0cmluZztcbiAgICBwcml2YXRlIGZvbnRTaXplIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludDtcbiAgICBwcml2YXRlIG5hbWUgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElOYW1lQm94Q29uZmlndXJhdGlvbik7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElOYW1lQm94Q29uZmlndXJhdGlvbiwgbmFtZT8gOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KGNvbmZpZ3VyYXRpb24uV2lkdGgsIGNvbmZpZ3VyYXRpb24uSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uLkNsb25lKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24uWSAtPSB0aGlzLnNpemUuWTtcblxuICAgICAgICB0aGlzLmlubmVyTWFyZ2luID0gdGhpcy5zaXplLkRpdihuZXcgUG9pbnQoMTAsIDEwKSk7XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGNvbmZpZ3VyYXRpb24uRm9udFNpemU7XG4gICAgICAgIHRoaXMuZm9udENvbG9yID0gY29uZmlndXJhdGlvbi5Gb250Q29sb3I7XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKFxuICAgICAgICAgICAgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSwgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgdGhpcy5zaXplLkNsb25lKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzZXQgTmFtZShuYW1lIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChuYW1lICE9PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kLkRyYXcoY2FudmFzKTtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3VGV4dCh0aGlzLm5hbWUsIHRoaXMuaW5uZXJNYXJnaW4sIHRoaXMuZm9udENvbG9yLCB0aGlzLmZvbnRTaXplLCB0aGlzLnNpemUuWCk7XG4gICAgICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3BlZWNoTGF5ZXIgZXh0ZW5kcyBHYW1lcGxheUxheWVyIHtcbiAgICBwcml2YXRlIGZ1bGxUZXh0IDogc3RyaW5nO1xuICAgIHByaXZhdGUgbmFtZUJveCA6IE5hbWVCb3g7XG4gICAgcHJpdmF0ZSB0ZXh0QXBwZWFyZWQgOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB0ZXh0Qm94IDogU3BlZWNoQm94O1xuICAgIHByaXZhdGUgdGV4dFRpbWUgOiBudW1iZXIgPSAwO1xuXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuU2l6ZSA6IFBvaW50LCBzcGVlY2hCb3hDb25maWd1cmF0aW9uIDogSVNwZWVjaEJveENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCB0ZXh0Qm94U2l6ZSA9IG5ldyBQb2ludChcbiAgICAgICAgICAgIHNjcmVlblNpemUuWCAtIChzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlggKiAyKSxcbiAgICAgICAgICAgIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uSGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHRleHRCb3hQb3NpdGlvbiA9IG5ldyBQb2ludChcbiAgICAgICAgICAgIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWCxcbiAgICAgICAgICAgIHNjcmVlblNpemUuWSAtIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWSAtIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uSGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudGV4dEJveCA9IG5ldyBTcGVlY2hCb3godGV4dEJveFBvc2l0aW9uLCB0ZXh0Qm94U2l6ZSwgc3BlZWNoQm94Q29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5uYW1lQm94ID0gbmV3IE5hbWVCb3goXG4gICAgICAgICAgICB0ZXh0Qm94UG9zaXRpb24uQWRkKG5ldyBQb2ludCg3MCwgMCkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkJhY2tncm91bmQsXG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZFR5cGUgOiBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkJhY2tncm91bmRUeXBlLFxuICAgICAgICAgICAgICAgIEZvbnRDb2xvciA6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICBGb250U2l6ZSA6IDI0LFxuICAgICAgICAgICAgICAgIEhlaWdodCA6IDQwLFxuICAgICAgICAgICAgICAgIFdpZHRoIDogMTAwXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEJveC5EcmF3KGNhbnZhcyk7XG4gICAgICAgIHRoaXMubmFtZUJveC5EcmF3KGNhbnZhcyk7XG4gICAgfVxuXG4gICAgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50ZXh0QXBwZWFyZWQpIHtcbiAgICAgICAgICAgIGFjdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ZXh0Qm94LlRleHQgPSB0aGlzLmZ1bGxUZXh0O1xuICAgICAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIFNheSh0ZXh0IDogc3RyaW5nLCBuYW1lIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRCb3guVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbFRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubmFtZUJveC5OYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRUaW1lICs9IGRlbHRhO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLnRleHRUaW1lID49IENvbmZpZy5UZXh0U3BlZWRSYXRpbykge1xuICAgICAgICAgICAgaWYgKHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMuZnVsbFRleHQuc2xpY2UodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoLCB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRCb3guVGV4dCArPSBjO1xuICAgICAgICAgICAgICAgIGlmIChjID09PSBcIiBcIiAmJiB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAyIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG4gPSB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmZ1bGxUZXh0W25dID09PSBcIiBcIiAmJiBuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHsgKytuOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmZ1bGxUZXh0W25dICE9PSBcIiBcIiAmJiBuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHsgKytuOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0Qm94Lk5leHRXb3JkID0gdGhpcy5mdWxsVGV4dC5zbGljZSh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAxLCBuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFwcGVhcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50ZXh0VGltZSA9IHRoaXMudGV4dFRpbWUgLSBDb25maWcuVGV4dFNwZWVkUmF0aW87XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMaXRlRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgU3RlcExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uIGV4dGVuZHMgU3RlcExheWVyIHtcbiAgICBwcml2YXRlIF9vbkVuZCA6IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPiA9IG5ldyBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4oKTtcblxuICAgIHByaXZhdGUgYiA6IG51bWJlcjtcbiAgICBwcml2YXRlIGltYWdlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSB0aW1lIDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHRvdGFsVGltZSA6IG51bWJlciA9IDIwMDAuMDtcblxuICAgIGNvbnN0cnVjdG9yKGltYWdlRGF0YSA6IEltYWdlRGF0YSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8vIHNpbiBlcXVhdGlvbjogeSA9IGEqc2luKGIqeCArIGMpICsgZFxuICAgICAgICAvLyBhIHNpbiBwZXJpb2QgaXMgMlBJIC8gYlxuICAgICAgICAvLyB3ZSB3YW50IGEgaGFsZiBwZXJpb2Qgb2YgdG90YWxUaW1lIHNvIHdlJ3JlIGxvb2tpbmcgZm9yIGI6IGIgPSAyUEkgLyBwZXJpb2RcbiAgICAgICAgdGhpcy5iID0gKE1hdGguUEkgKiAyKSAvICh0aGlzLnRvdGFsVGltZSAqIDIpO1xuXG4gICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGltYWdlRGF0YSkudGhlbihpbWFnZSA9PiB0aGlzLmltYWdlID0gaW1hZ2UpO1xuICAgIH1cblxuICAgIGdldCBPbkVuZCgpIDogTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uRW5kLkV4cG9zZSgpO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbWFnZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0JhY2tncm91bmRJbWFnZSh0aGlzLmltYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5EcmF3UmVjdChuZXcgUG9pbnQoKSwgY2FudmFzLlNpemUsIGByZ2JhKDAuMCwgMC4wLCAwLjAsICR7TWF0aC5zaW4odGhpcy5iICogdGhpcy50aW1lKX0pYCk7XG4gICAgfVxuXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50aW1lICs9IGRlbHRhO1xuXG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwgJiYgdGhpcy50aW1lID49IHRoaXMudG90YWxUaW1lIC8gMikge1xuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aW1lID49IHRoaXMudG90YWxUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkVuZC5UcmlnZ2VyKHRoaXMsIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5cbmNsYXNzIENsYXNzTG9hZGVyIHtcbiAgICBMb2FkSW1hZ2UoVVJMIDogc3RyaW5nKSA6IFByb21pc2U8SW1hZ2VCaXRtYXA+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlIDogRnVuY3Rpb24sIHJlamVjdCA6IEZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3b3JrZXIgOiBXb3JrZXIgPSB0aGlzLmNyZWF0ZVdvcmtlcigpO1xuXG4gICAgICAgICAgICB3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2dCA6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldnQuZGF0YS5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShldnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3b3JrZXIucG9zdE1lc3NhZ2UoQ29uZmlnLlJvb3RQYXRoSXNSZW1vdGUgP1xuICAgICAgICAgICAgICAgIGBodHRwczovLyR7Q29uZmlnLlJvb3RQYXRoID8gQ29uZmlnLlJvb3RQYXRoICsgXCIvXCIgOiBcIlwifSR7VVJMfWBcbiAgICAgICAgICAgICAgICA6IGAke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke3dpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1teXFxcXFxcL10qJC8sIFwiXCIpfSR7VVJMfWApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVdvcmtlcigpIDogV29ya2VyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYChmdW5jdGlvbiAke3RoaXMud29ya2VyfSkoKWBdKSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgd29ya2VyKCkge1xuICAgICAgICBjb25zdCBjdHggOiBXb3JrZXIgPSBzZWxmIGFzIGFueTtcbiAgICAgICAgY3R4LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldnQgOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGZldGNoKGV2dC5kYXRhKS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmJsb2IoKSkudGhlbihibG9iRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYkRhdGEpLnRoZW4oaW1hZ2UgPT4gY3R4LnBvc3RNZXNzYWdlKGltYWdlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgTG9hZGVyID0gbmV3IENsYXNzTG9hZGVyKCk7XG4iLCJpbXBvcnQgKiBhcyBJbmtKcyBmcm9tIFwiaW5ranNcIjtcbmltcG9ydCB7IEF1ZGlvLCBBdWRpb0ZhY3RvcnkgfSBmcm9tIFwiLi9hdWRpb1wiO1xuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4vY2FudmFzXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2xheWVycy9ib3hiYWNrZ3JvdW5kc1wiO1xuaW1wb3J0ICogYXMgTGF5ZXJzIGZyb20gXCIuL2xheWVycy9sYXllcnNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcbmltcG9ydCB7IFByZWxvYWRlciB9IGZyb20gXCIuL3ByZWxvYWRlclwiO1xuXG5leHBvcnQgY2xhc3MgVk4ge1xuICAgIEF1ZGlvIDogQXVkaW87XG4gICAgQ2FudmFzIDogQ2FudmFzO1xuICAgIFN0b3J5IDogSW5rSnMuU3Rvcnk7XG5cbiAgICBwcml2YXRlIGJhY2tncm91bmQgOiBMYXllcnMuQmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGNoYXJhY3RlcnMgOiBMYXllcnMuQ2hhcmFjdGVycztcbiAgICBwcml2YXRlIGNob2ljZVNjcmVlbiA6IExheWVycy5DaG9pY2VMYXllcjtcbiAgICBwcml2YXRlIGN1cnJlbnRTY3JlZW4gOiBMYXllcnMuR2FtZXBsYXlMYXllcjtcbiAgICBwcml2YXRlIGh1ZFNjcmVlbiA6IHN0cmluZztcbiAgICBwcml2YXRlIGh1ZFNjcmVlbnMgOiB7IFtrZXkgOiBzdHJpbmddIDogTGF5ZXJzLkNob2ljZUxheWVyIH07XG4gICAgcHJpdmF0ZSBwcmV2aW91c1RpbWVzdGFtcCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHNwZWFraW5nQ2hhcmFjdGVyTmFtZSA6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBzcGVlY2hTY3JlZW4gOiBMYXllcnMuU3BlZWNoTGF5ZXI7XG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uIDogTGF5ZXJzLlRyYW5zaXRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihzdG9yeUZpbGVuYW1lT3JPYmplY3QgOiBzdHJpbmcgfCBvYmplY3QsIGNvbnRhaW5lcklEIDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQXVkaW8gPSBBdWRpb0ZhY3RvcnkuQ3JlYXRlKCk7XG4gICAgICAgIHRoaXMuQ2FudmFzID0gbmV3IENhbnZhcyhjb250YWluZXJJRCwgQ29uZmlnLlNjcmVlblNpemUpO1xuXG4gICAgICAgIGNvbnN0IGluaXRTdG9yeSA9IChyYXdTdG9yeSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5TdG9yeSA9IG5ldyBJbmtKcy5TdG9yeShyYXdTdG9yeSk7XG4gICAgICAgICAgICBDb25maWcuTG9hZCh0aGlzLlN0b3J5Lmdsb2JhbFRhZ3MgfHwgW10pO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuU2l6ZSA9IENvbmZpZy5TY3JlZW5TaXplO1xuXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgTGF5ZXJzLkJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IG5ldyBMYXllcnMuQ2hhcmFjdGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbiA9IG5ldyBMYXllcnMuU3BlZWNoTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSwge1xuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBcInJnYmEoMC4wLCAwLjAsIDAuMCwgMC43NSlcIixcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kVHlwZSA6IEJveEJhY2tncm91bmRUeXBlcy5DT0xPUixcbiAgICAgICAgICAgICAgICBGb250Q29sb3IgOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiAyMDAsXG4gICAgICAgICAgICAgICAgSW5uZXJNYXJnaW4gOiBuZXcgUG9pbnQoMzUpLFxuICAgICAgICAgICAgICAgIE91dGVyTWFyZ2luIDogbmV3IFBvaW50KDUwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbiA9IG5ldyBMYXllcnMuQ2hvaWNlTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLk9uQ2xpY2suT24odGhpcy5tb3VzZUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuT25Nb3ZlLk9uKHRoaXMubW91c2VNb3ZlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzVGltZXN0YW1wID0gMDtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdG9yeUZpbGVuYW1lT3JPYmplY3QgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGZldGNoKHN0b3J5RmlsZW5hbWVPck9iamVjdCkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpLnRoZW4oaW5pdFN0b3J5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluaXRTdG9yeShKU09OLnN0cmluZ2lmeShzdG9yeUZpbGVuYW1lT3JPYmplY3QpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG1ha2VIdWQoaHVkTmFtZTogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBpZiAoIShodWROYW1lIGluIHRoaXMuaHVkU2NyZWVucykpIHtcbiAgICAgICAgICAgIHRoaXMuaHVkU2NyZWVuc1todWROYW1lXSA9IG5ldyBMYXllcnMuQ2hvaWNlTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0ZWQgbmV3IEhVRFwiLCB0aGlzLmh1ZFNjcmVlbnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY29tcHV0ZVRhZ3MoKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBnZXRGaW5hbFZhbHVlID0gKHZhbHVlIDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZU1hdGNoID0gdmFsdWUubWF0Y2goL15cXHsoXFx3KylcXH0kLyk7XG4gICAgICAgICAgICBpZiAodmFsdWVNYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuU3RvcnkudmFyaWFibGVzU3RhdGUuJCh2YWx1ZU1hdGNoWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB0YWdzID0gdGhpcy5TdG9yeS5jdXJyZW50VGFncztcbiAgICAgICAgY29uc29sZS5sb2coXCJUQUdTID09PT09XCIsIHRhZ3MpO1xuICAgICAgICBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHRhZ3NbaV0ubWF0Y2goL14oXFx3KylcXHMqOlxccyooLiopJC8pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IG1hdGNoID0gdGFnc1tpXS5tYXRjaCgvXihcXHcrKVxccyo6KFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKSQvKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1BVENIXCIsIG1hdGNoKVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyB3aGF0IHRhZyBpdCBpc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgOiBzdHJpbmcgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgOiBzdHJpbmcgPSBnZXRGaW5hbFZhbHVlKG1hdGNoWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxsb3cgZ2V0dGluZyB2YXJpYWJsZSB2YWx1ZXMgaW5zaWRlIHRhZ3NcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gIHZhbHVlLm1hdGNoKC8oXCIuKj9cInxbXlwiXFxzXSspKyg/PVxccyp8XFxzKiQpL2cpLm1hcCh2ID0+ICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB2Lm1hdGNoKC97KC4qPyl9Lyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGtleSAmJiBrZXkubGVuZ3RoID4gMSkgPyB0aGlzLlN0b3J5LnZhcmlhYmxlc1N0YXRlLiQoa2V5WzFdKSA6IHY7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBBUkFNU1wiLHBhcmFtcylcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmVsb2FkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zcGxpdChcIixcIikuZm9yRWFjaChfdmFsdWUgPT4gUHJlbG9hZGVyLlByZWxvYWQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZy5Sb290UGF0aElzUmVtb3RlID8gYGh0dHBzOi8vJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHtfdmFsdWUudHJpbSgpfWAgOiBgJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHtfdmFsdWUudHJpbSgpfWApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiYWNrZ3JvdW5kXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiZ0ltYWdlID0gcGFyYW1zLmxlbmd0aCA+IDEgPyB0aGlzLmNoYXJhY3RlcnMuR2V0SW1hZ2UocGFyYW1zWzBdLCAgcGFyYW1zWzFdKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmQuQmFja2dyb3VuZEltYWdlID0gYmdJbWFnZSB8fCB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkFkZCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJ1dHRvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kb190aGluZyB5YXklcy5wbmcgMzAgMjBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDQgKSB7IC8vIG5vIGh1ZCB3YXMgcGFzc2VkLCBhZGQgdG8gc2NlbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvaWNlU2NyZWVuLkFkZEJ1dHRvbih0aGlzLmNoYXJhY3RlcnMsIHtrbm90OiBwYXJhbXNbMF0sIHRleHQ6IHBhcmFtc1sxXSwgcG9zaXRpb246IG5ldyBQb2ludChwYXJzZUludChwYXJhbXNbMl0pLCBwYXJzZUludChwYXJhbXNbM10pKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDUgKSB7IC8vIGh1ZCB3YXMgcGFzc2VkLCBhZGQgdG8gaHVkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kb190aGluZyB5YXklcy5wbmcgMzAgMjAgaHVkTmFtZSAtIG1ha2UgYSBodWQgaWYgaXQgZG9lc250IGV4aXN0LCBhZGQgdGhpcyBidXR0b24gdG8gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh1ZE5hbWUgPSBwYXJhbXNbNF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ha2VIdWQoaHVkTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmh1ZFNjcmVlbnNbaHVkTmFtZV0uQWRkQnV0dG9uKHRoaXMuY2hhcmFjdGVycywge2tub3Q6IHBhcmFtc1swXSwgdGV4dDogcGFyYW1zWzFdLCBwb3NpdGlvbjogbmV3IFBvaW50KHBhcnNlSW50KHBhcmFtc1syXSksIHBhcnNlSW50KHBhcmFtc1szXSkpfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGFiZWxcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXCJteSBib3JpbmcgbGFiZWxcIiAzMCAyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMyApIHsgLy8gbm8gaHVkIHdhcyBwYXNzZWQsIGFkZCB0byBzY2VuZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4uQWRkQnV0dG9uKHRoaXMuY2hhcmFjdGVycywge2tub3Q6IG51bGwsIHRleHQ6IHBhcmFtc1swXSwgcG9zaXRpb246IG5ldyBQb2ludChwYXJzZUludChwYXJhbXNbMV0pLCBwYXJzZUludChwYXJhbXNbMl0pKX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmFtcy5sZW5ndGggPT09IDQgKSB7IC8vIGh1ZCB3YXMgcGFzc2VkLCBhZGQgdG8gaHVkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cIm15IGJvcmluZyBsYWJlbFwiIDMwIDIwIGh1ZE5hbWUgLSBtYWtlIGEgaHVkIGlmIGl0IGRvZXNudCBleGlzdCwgYWRkIHRoaXMgYnV0dG9uIHRvIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBodWROYW1lID0gcGFyYW1zWzNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWtlSHVkKGh1ZE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odWRTY3JlZW5zW2h1ZE5hbWVdLkFkZEJ1dHRvbih0aGlzLmNoYXJhY3RlcnMsIHtrbm90OiBudWxsLCB0ZXh0OiBwYXJhbXNbMF0sIHBvc2l0aW9uOiBuZXcgUG9pbnQocGFyc2VJbnQocGFyYW1zWzFdKSwgcGFyc2VJbnQocGFyYW1zWzJdKSl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJodWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh1ZE5hbWUgPSBwYXJhbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChodWROYW1lIGluIHRoaXMuaHVkU2NyZWVucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5odWRTY3JlZW4gPSBodWROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNob3dcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5TaG93KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkhpZGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5IaWRlQWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmdtXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkF1ZGlvLlBsYXlCR00odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uU3RvcEJHTSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZnhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheVNGWCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNpdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uID0gbmV3IExheWVycy5UcmFuc2l0aW9uKHRoaXMuQ2FudmFzLkdldEltYWdlRGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uT25FbmQuT24oKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBVbmtub3duIHRhZ3MgYXJlIHRyZWF0ZWQgYXMgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUgPSBnZXRGaW5hbFZhbHVlKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29udGludWUoKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKHRoaXMuU3RvcnkuY2FuQ29udGludWUpIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ29udGludWUoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU3RvcnkuY3VycmVudFRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250aW51ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VTY3JlZW4uY2hvaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuY2hvaWNlU2NyZWVuIDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBzdGlsbCByZXF1aXJlZCBmb3IgaW5pdGlhdGlvbiB3aGVuIHRoZXJlIGlzIG5vIHRleHRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVlY2hTY3JlZW4uU2F5KHRoaXMuU3RvcnkuY3VycmVudFRleHQsIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5zcGVlY2hTY3JlZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVUYWdzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlY2hTY3JlZW4uU2F5KHRoaXMuU3RvcnkuY3VycmVudFRleHQsIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLnNwZWVjaFNjcmVlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlN0b3J5LmN1cnJlbnRDaG9pY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlU2NyZWVuLkNob2ljZXMgPSB0aGlzLlN0b3J5LmN1cnJlbnRDaG9pY2VzO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5jaG9pY2VTY3JlZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUT0RPIEl0J3MgdGhlIGVuZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZUNsaWNrKHNlbmRlciA6IENhbnZhcywgY2xpY2tQb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY3JlZW4gaW5zdGFuY2VvZiBMYXllcnMuQ2hvaWNlTGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sIHRoaXMudmFsaWRhdGVDaG9pY2UuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4uTW91c2VDbGljayhjbGlja1Bvc2l0aW9uLCAoKSA9PiB0aGlzLmNvbnRpbnVlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmh1ZFNjcmVlbiBpbiB0aGlzLmh1ZFNjcmVlbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaHVkU2NyZWVuc1t0aGlzLmh1ZFNjcmVlbl0uTW91c2VDbGljayhjbGlja1Bvc2l0aW9uLCB0aGlzLnZhbGlkYXRlQ2hvaWNlLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZU1vdmUoc2VuZGVyIDogQ2FudmFzLCBtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5jdXJyZW50U2NyZWVuLk1vdXNlTW92ZShtb3VzZVBvc2l0aW9uKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHNlbmRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5odWRTY3JlZW4gaW4gdGhpcy5odWRTY3JlZW5zKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja0h1ZCA9IHRoaXMuaHVkU2NyZWVuc1t0aGlzLmh1ZFNjcmVlbl0uTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24pO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrSHVkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja0h1ZChzZW5kZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcXVlc3RTdGVwKCkgOiB2b2lkIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0ZXAuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGVwKHRpbWVzdGFtcCA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzVGltZXN0YW1wO1xuICAgICAgICB0aGlzLnByZXZpb3VzVGltZXN0YW1wID0gdGltZXN0YW1wO1xuXG4gICAgICAgIHRoaXMuQ2FudmFzLkNsZWFyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uU3RlcChkZWx0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4uU3RlcChkZWx0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhY2tncm91bmQuRHJhdyh0aGlzLkNhbnZhcyk7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVycy5EcmF3KHRoaXMuQ2FudmFzKTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmh1ZFNjcmVlbiAmJiB0aGlzLmh1ZFNjcmVlbiBpbiB0aGlzLmh1ZFNjcmVlbnMpIHtcbiAgICAgICAgICAgIHRoaXMuaHVkU2NyZWVuc1t0aGlzLmh1ZFNjcmVlbl0uRHJhdyh0aGlzLkNhbnZhcyk7IC8vZHJhdyBvbmUgb2YgYSBudW1iZXIgb2YgaHVkcywgY3JlYXRlZCB3aGVuIGFkZGluZyBidXR0b25zXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXF1ZXN0U3RlcCgpO1xuICAgIH1cblxuICAgIC8vIHdoZW4gbnVtYmVyLGl0cyBhIGNob2ljZUluZGV4LCB3aGVuIHN0cmluZyAtIGl0cyBhIGtub3RcbiAgICBwcml2YXRlIHZhbGlkYXRlQ2hvaWNlKGNob2ljZSA6IG51bWJlciB8IHN0cmluZyB8IG51bGwpIDogdm9pZCB7XG4gICAgICAgIGlmICghY2hvaWNlKSByZXR1cm47XG4gICAgICAgIGlmICh0eXBlb2YgY2hvaWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLlN0b3J5LkNob29zZVBhdGhTdHJpbmcoY2hvaWNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ2hvb3NlQ2hvaWNlSW5kZXgoY2hvaWNlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLmNoYXJhY3RlcnMuSGlkZUFsbCgpO1xuICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJUmVjdCB7XG4gICAgUG9zaXRpb24gOiBQb2ludDtcbiAgICBTaXplIDogUG9pbnQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQb2ludCB7XG4gICAgcHJpdmF0ZSB4IDogbnVtYmVyO1xuICAgIHByaXZhdGUgeSA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCk7XG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlcik7XG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlciwgeSA6IG51bWJlcik7XG4gICAgY29uc3RydWN0b3IoeD8gOiBudW1iZXIsIHk/IDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHggIT0gbnVsbCA/IHggOiAwO1xuICAgICAgICB0aGlzLnkgPSB5ICE9IG51bGwgPyB5IDogeCAhPSBudWxsID8geCA6IDA7XG4gICAgfVxuXG4gICAgZ2V0IFgoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfVxuXG4gICAgc2V0IFgoeCA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgIH1cblxuICAgIGdldCBZKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH1cblxuICAgIHNldCBZKHkgOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICBBZGQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICsgcG9pbnQuWCwgdGhpcy5ZICsgcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgQ2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlgsIHRoaXMuWSk7XG4gICAgfVxuXG4gICAgRGl2KHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCAvIHBvaW50LlgsIHRoaXMuWSAvIHBvaW50LlkpO1xuICAgIH1cblxuICAgIFBlcmNlbnQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoKHBvaW50LlggLyAxMDApICogdGhpcy5YICwgKHBvaW50LlkgLyAxMDApICogdGhpcy5ZKTtcbiAgICB9XG5cbiAgICBJc0luUmVjdChyZWN0IDogSVJlY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWCA+PSByZWN0LlBvc2l0aW9uLlggJiYgdGhpcy5YIDw9IHJlY3QuUG9zaXRpb24uQWRkKHJlY3QuU2l6ZSkuWFxuICAgICAgICAgICAgJiYgdGhpcy5ZID49IHJlY3QuUG9zaXRpb24uWSAmJiB0aGlzLlkgPD0gcmVjdC5Qb3NpdGlvbi5BZGQocmVjdC5TaXplKS5ZO1xuICAgIH1cblxuICAgIE11bHQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICogcG9pbnQuWCwgdGhpcy5ZICogcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgU3ViKHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5BZGQobmV3IFBvaW50KC1wb2ludC5YLCAtcG9pbnQuWSkpO1xuICAgIH1cbn1cbiIsImNsYXNzIENsYXNzUHJlbG9hZGVyIHtcbiAgICBQcmVsb2FkKHVybCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgZmV0Y2godXJsKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXIgPSBuZXcgQ2xhc3NQcmVsb2FkZXIoKTtcbiJdfQ==
