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
        this.ctx.fillText(text, position.X, position.Y, maxWidth);
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
        if (imageURL !== this.backgroundImageURL) {
            this.backgroundImageURL = imageURL;
            loader_1.Loader.LoadImage(imageURL).then(image => {
                this.backgroundImage = image;
            });
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
            canvas.DrawText(this.text, this.position.Add(this.innerMargin), "white", this.fontSize, this.size.X);
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
                if (mousePosition.IsInRect(choice.BoundingRect)) {
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
    computeTags() {
        const getFinalValue = (value) => {
            const valueMatch = value.match(/^\{(\w+)\}$/);
            if (valueMatch != null) {
                return this.Story.variablesState.$(valueMatch[1]);
            }
            return value;
        };
        const tags = this.Story.currentTags;
        console.log("TAgs:", tags, "screen", this.currentScreen);
        if (tags.length > 0) {
            for (let i = 0; i < tags.length; ++i) {
                const match = tags[i].match(/^(\w+)\s*:\s*(.*)$/);
                if (match != null) {
                    // We need to know what tag it is
                    const key = match[1];
                    const value = getFinalValue(match[2]);
                    switch (key) {
                        case "preload": {
                            value.split(",").forEach(_value => preloader_1.Preloader.Preload(config_1.Config.RootPathIsRemote ? `https://${config_1.Config.RootPath ? config_1.Config.RootPath + "/" : ""}${_value.trim()}` : `${config_1.Config.RootPath ? config_1.Config.RootPath + "/" : ""}${_value.trim()}`));
                            break;
                        }
                        case "background": {
                            this.background.BackgroundImage = value;
                            break;
                        }
                        case "image": {
                            if (value.length > 0) {
                                this.characters.Add(value);
                            }
                            break;
                        }
                        case "imagebutton": {
                            if (value.length > 0) {
                                //do_thing yay%s.png 30 20
                                console.log(value);
                                const buttonParam = value.split(" ");
                                this.choiceScreen.AddButton(this.characters, { knot: buttonParam[0], text: buttonParam[1], position: new point_1.Point(parseInt(buttonParam[2]), parseInt(buttonParam[3])) });
                                // this.characters[characterData[0]].Show(characterData[1], characterData[2])
                                // this.buttonScreen.AddButton({text: "err", index: 0, position:new Point(10, 10)})
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
                    // this.characters.HideAll();
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
                // this.choiceScreen.ClearButtons();
            }
        }
        else if (this.Story.currentChoices.length > 0) {
            console.log("Continue 3");
            this.computeTags();
            this.choiceScreen.Choices = this.Story.currentChoices;
            this.currentScreen = this.choiceScreen;
        }
        else {
            // TODO It's the end
            console.log("Continue 4"); //
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
    }
    mouseMove(sender, mousePosition) {
        const callback = this.currentScreen.MouseMove(mousePosition);
        if (callback != null) {
            callback(sender);
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
        this.requestStep();
    }
    // when number,its a choiceIndex, when string - its a knot
    validateChoice(choice) {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsdUNBQXVDO0FBRXZDLE1BQWEsWUFBWTtJQUNyQixNQUFNLENBQUMsTUFBTTtRQUNULElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksY0FBYyxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSjtBQVJELG9DQVFDO0FBRUQsTUFBc0IsS0FBSztDQUkxQjtBQUpELHNCQUlDO0FBRUQsTUFBTSxjQUFlLFNBQVEsS0FBSztJQUk5QixPQUFPLENBQUMsTUFBZTtRQUNuQixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsT0FBTyxFQUFHO29CQUNOLElBQUksRUFBRyxJQUFJO29CQUNYLElBQUksRUFBRyxNQUFNO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUcsTUFBTTthQUNsQixFQUFFLEdB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Q0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWE7UUFDYixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQWE7UUFDakIsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBWTtRQUNqQixPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztlQUNyRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQWE7UUFDZCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWE7UUFDYixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNKO0FBeERELHNCQXdEQzs7Ozs7O0FDN0RELE1BQU0sY0FBYztJQUNoQixPQUFPLENBQUMsR0FBWTtRQUNoQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0NBQ0o7QUFFWSxRQUFBLFNBQVMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0ICogYXMgUGl6emljYXRvIGZyb20gXCJwaXp6aWNhdG9cIjtcblxuZXhwb3J0IGNsYXNzIEF1ZGlvRmFjdG9yeSB7XG4gICAgc3RhdGljIENyZWF0ZSgpIDogQXVkaW8ge1xuICAgICAgICBpZiAoUGl6emljYXRvICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGl6emljYXRvQXVkaW8oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRHVtbXlBdWRpbygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXVkaW8ge1xuICAgIGFic3RyYWN0IFBsYXlCR00oYmdtVVJMIDogc3RyaW5nKSA6IHZvaWQ7XG4gICAgYWJzdHJhY3QgUGxheVNGWChzZnhVUkwgOiBzdHJpbmcpIDogdm9pZDtcbiAgICBhYnN0cmFjdCBTdG9wQkdNKCkgOiB2b2lkO1xufVxuXG5jbGFzcyBQaXp6aWNhdG9BdWRpbyBleHRlbmRzIEF1ZGlvIHtcbiAgICBwcml2YXRlIGJnbSA6IFBpenppY2F0by5Tb3VuZDtcbiAgICBwcml2YXRlIGJnbVVSTCA6IHN0cmluZztcblxuICAgIFBsYXlCR00oYmdtVVJMIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBpZiAoYmdtVVJMICE9PSB0aGlzLmJnbVVSTCkge1xuICAgICAgICAgICAgdGhpcy5iZ21VUkwgPSBiZ21VUkw7XG5cbiAgICAgICAgICAgIGNvbnN0IGJnbSA9IG5ldyBQaXp6aWNhdG8uU291bmQoe1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvb3AgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoIDogYmdtVVJMXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzb3VyY2UgOiBcImZpbGVcIlxuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJnbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmdtLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ20uZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiZ20ucGxheSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmdtID0gYmdtO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2Z4ID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG4gICAgICAgICAgICBvcHRpb25zIDogeyBwYXRoIDogc2Z4VVJMIH0sXG4gICAgICAgICAgICBzb3VyY2UgOiBcImZpbGVcIlxuICAgICAgICB9LCAoKSA9PiBzZngucGxheSgpKTtcbiAgICB9XG5cbiAgICBTdG9wQkdNKCkgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYmdtICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYmdtLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuYmdtLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHRoaXMuYmdtVVJMID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYmdtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgRHVtbXlBdWRpbyBleHRlbmRzIEF1ZGlvIHtcbiAgICBQbGF5QkdNKGJnbVVSTCA6IHN0cmluZykgOiB2b2lkIHsgfVxuICAgIFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQgeyB9XG4gICAgU3RvcEJHTSgpIDogdm9pZCB7IH1cbn1cbiIsImltcG9ydCB7IExpdGVFdmVudCB9IGZyb20gXCIuL2V2ZW50c1wiO1xuaW1wb3J0IHsgSVJlY3QsIFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcblxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG4gICAgcHJpdmF0ZSBfb25DbGljayA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiA9IG5ldyBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4oKTtcbiAgICBwcml2YXRlIF9vbk1vdmUgOiBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4gPSBuZXcgTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+KCk7XG4gICAgcHJpdmF0ZSBjdHggOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgcHJpdmF0ZSBlbGVtZW50IDogSFRNTENhbnZhc0VsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJRCA6IHN0cmluZywgc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklEKTtcblxuICAgICAgICBpZiAoY29udGFpbmVyLnRhZ05hbWUgPT09IFwiY2FudmFzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGNvbnRhaW5lciBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC53aWR0aCA9IHNpemUuWDtcbiAgICAgICAgdGhpcy5lbGVtZW50LmhlaWdodCA9IHNpemUuWTtcblxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuZWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5fY2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuX21vdmUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5DbGVhcigpO1xuICAgIH1cblxuICAgIGdldCBTaXplKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBzZXQgU2l6ZShzaXplIDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LndpZHRoID0gc2l6ZS5YO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gc2l6ZS5ZO1xuICAgIH1cblxuICAgIENsZWFyKCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuZWxlbWVudC53aWR0aCwgdGhpcy5lbGVtZW50LmhlaWdodCk7XG4gICAgfVxuXG4gICAgRHJhd0JhY2tncm91bmRJbWFnZShpbWFnZSA6IEltYWdlQml0bWFwKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIHRoaXMuZWxlbWVudC53aWR0aCwgdGhpcy5lbGVtZW50LmhlaWdodCk7XG4gICAgfVxuXG4gICAgRHJhd0ltYWdlKGltYWdlIDogSW1hZ2VCaXRtYXAsIHBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWFnZSwgcG9zaXRpb24uWCwgcG9zaXRpb24uWSwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCk7XG4gICAgfVxuXG4gICAgRHJhd0ltYWdlVG8oaW1hZ2UgOiBJbWFnZUJpdG1hcCwgc291cmNlIDogSVJlY3QsIGRlc3RpbmF0aW9uIDogSVJlY3QpIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBzb3VyY2UuUG9zaXRpb24uWCwgc291cmNlLlBvc2l0aW9uLlksXG4gICAgICAgICAgICBzb3VyY2UuU2l6ZS5YLCBzb3VyY2UuU2l6ZS5ZLFxuICAgICAgICAgICAgZGVzdGluYXRpb24uUG9zaXRpb24uWCwgZGVzdGluYXRpb24uUG9zaXRpb24uWSxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uLlNpemUuWCwgZGVzdGluYXRpb24uU2l6ZS5ZXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgRHJhd1JlY3QocG9zaXRpb24gOiBQb2ludCwgc2l6ZSA6IFBvaW50LCBjb2xvciA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHBvc2l0aW9uLlgsIHBvc2l0aW9uLlksIHNpemUuWCwgc2l6ZS5ZKTtcbiAgICB9XG5cbiAgICBEcmF3UmVjdDAoc2l6ZSA6IFBvaW50LCBjb2xvciA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5EcmF3UmVjdChuZXcgUG9pbnQoKSwgc2l6ZSwgY29sb3IpO1xuICAgIH1cblxuICAgIERyYXdUZXh0KHRleHQgOiBzdHJpbmcsIHBvc2l0aW9uIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nLCBmb250U2l6ZSA6IG51bWJlciwgbWF4V2lkdGg/IDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZm9udCA9IGAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xuICAgICAgICB0aGlzLmN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dCh0ZXh0LCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBtYXhXaWR0aCk7XG4gICAgfVxuXG4gICAgRHJhd1RleHQwKHRleHQgOiBzdHJpbmcsIGNvbG9yIDogc3RyaW5nLCBmb250U2l6ZSA6IG51bWJlciwgbWF4V2lkdGg/IDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLkRyYXdUZXh0KHRleHQsIG5ldyBQb2ludCgpLCBjb2xvciwgZm9udFNpemUsIG1heFdpZHRoKTtcbiAgICB9XG5cbiAgICBHZXRJbWFnZURhdGEoKSA6IEltYWdlRGF0YSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgdGhpcy5TaXplLlgsIHRoaXMuU2l6ZS5ZKTtcbiAgICB9XG5cbiAgICBNZWFzdXJlVGV4dFdpZHRoKHRleHQgOiBzdHJpbmcpIDogbnVtYmVyIHtcbiAgICAgICAgLy8gV2UgbWVhc3VyZSB3aXRoIHRoZSBsYXN0IGZvbnQgdXNlZCBpbiB0aGUgY29udGV4dFxuICAgICAgICByZXR1cm4gdGhpcy5jdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG4gICAgfVxuXG4gICAgUmVzdG9yZSgpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBTZXRDdXJzb3IoY3Vyc29yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgIH1cblxuICAgIFRyYW5zbGF0ZShwb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICB0aGlzLlJlc3RvcmUoKTtcbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUocG9zaXRpb24uWCwgcG9zaXRpb24uWSk7XG4gICAgfVxuXG4gICAgZ2V0IE9uQ2xpY2soKSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbkNsaWNrLkV4cG9zZSgpO1xuICAgIH1cblxuICAgIGdldCBPbk1vdmUoKSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbk1vdmUuRXhwb3NlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2xpY2soZXYgOiBNb3VzZUV2ZW50KSA6IHZvaWQge1xuICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLl9vbkNsaWNrLlRyaWdnZXIodGhpcywgbmV3IFBvaW50KFxuICAgICAgICAgICAgZXYucGFnZVggLSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIGV2LnBhZ2VZIC0gdGhpcy5lbGVtZW50Lm9mZnNldFRvcFxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9tb3ZlKGV2IDogTW91c2VFdmVudCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25Nb3ZlLlRyaWdnZXIodGhpcywgbmV3IFBvaW50KFxuICAgICAgICAgICAgZXYucGFnZVggLSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIGV2LnBhZ2VZIC0gdGhpcy5lbGVtZW50Lm9mZnNldFRvcFxuICAgICAgICApKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBIaWRkZW5DYW52YXMgZXh0ZW5kcyBDYW52YXMge1xuICAgIHByaXZhdGUgaGlkZGVuRWxlbWVudCA6IEhUTUxFbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3Ioc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIGNvbnN0IGlkID0gYGNfJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkuc2xpY2UoMiwgNyl9YDtcbiAgICAgICAgY29uc3QgaGlkZGVuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGhpZGRlbkVsZW1lbnQuaWQgPSBpZDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChoaWRkZW5FbGVtZW50KTtcblxuICAgICAgICBzdXBlcihpZCwgc2l6ZSk7XG5cbiAgICAgICAgdGhpcy5oaWRkZW5FbGVtZW50ID0gaGlkZGVuRWxlbWVudDtcbiAgICB9XG5cbiAgICBEZXN0cm95KCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oaWRkZW5FbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcblxuY2xhc3MgQ2xhc3NDb25maWcge1xuICAgIERlZmF1bHRUZXh0U3BlZWQgOiBudW1iZXIgPSAzMDtcbiAgICBSb290UGF0aCA6IHN0cmluZyA9IFwiXCI7XG4gICAgUm9vdFBhdGhJc1JlbW90ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFNjcmVlblNpemUgOiBQb2ludCA9IG5ldyBQb2ludCg4MDAsIDYwMCk7XG5cbiAgICBwcml2YXRlIHRleHRTcGVlZCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHRleHRTcGVlZFJhdGlvIDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuVGV4dFNwZWVkID0gdGhpcy5EZWZhdWx0VGV4dFNwZWVkOyAvLyBUaGlzIGlzIGluIGNoYXIgcGVyIHNlY29uZFxuICAgIH1cblxuICAgIExvYWQodGFncyA6IHN0cmluZ1tdKSA6IHZvaWQge1xuICAgICAgICBmdW5jdGlvbiBlcnJvcih0YWcgOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHJlYWRpbmcgdGFnOiBcIiR7dGFnfVwiYCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBrZXksIHZhbHVlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBrZXkgPSB0YWdzW2ldLnNwbGl0KFwiOlwiKVswXS50cmltKCk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0YWdzW2ldLnNwbGl0KFwiOlwiKVsxXS50cmltKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IodGFnc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NyZWVuX3NpemVcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNjcmVlbnNpemVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHZhbHVlLnNwbGl0KC9cXEQrLykubWFwKHggPT4gcGFyc2VJbnQoeCwgMTApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaXplLmxlbmd0aCA9PT0gMiAmJiAhaXNOYU4oc2l6ZVswXSkgJiYgIWlzTmFOKHNpemVbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TY3JlZW5TaXplID0gbmV3IFBvaW50KHNpemVbMF0sIHNpemVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidGV4dF9zcGVlZFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidGV4dHNwZWVkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwZWVkID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oc3BlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5EZWZhdWx0VGV4dFNwZWVkID0gdGhpcy5UZXh0U3BlZWQgPSBzcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvb3RfcGF0aFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdHBhdGhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb290UGF0aCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvb3RfcGF0aF9pc19yZW1vdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvb3RwYXRoaXNyZW1vdGVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Sb290UGF0aElzUmVtb3RlID0gdmFsdWUgPT09IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IodGFnc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IFRleHRTcGVlZCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dFNwZWVkO1xuICAgIH1cblxuICAgIHNldCBUZXh0U3BlZWQodmFsdWUgOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50ZXh0U3BlZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50ZXh0U3BlZWRSYXRpbyA9IDEwMDAuMCAvIHRoaXMudGV4dFNwZWVkO1xuICAgIH1cblxuICAgIGdldCBUZXh0U3BlZWRSYXRpbygpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dFNwZWVkUmF0aW87XG4gICAgfVxufVxuXG5leHBvcnQgbGV0IENvbmZpZyA9IG5ldyBDbGFzc0NvbmZpZygpO1xuIiwiZXhwb3J0IGNsYXNzIExpdGVFdmVudDxUMSwgVDI+IHtcbiAgICBwcml2YXRlIGhhbmRsZXJzIDogQXJyYXk8KHNlbmRlciA6IFQxLCBhcmc/IDogVDIpID0+IHZvaWQ+ID0gW107XG5cbiAgICBFeHBvc2UoKSA6IExpdGVFdmVudDxUMSwgVDI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgT2ZmKGhhbmRsZXIgOiAoc2VuZGVyIDogVDEsIGFyZz8gOiBUMikgPT4gdm9pZCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHRoaXMuaGFuZGxlcnMuZmlsdGVyKF9oYW5kbGVyID0+IF9oYW5kbGVyICE9PSBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBPbihoYW5kbGVyIDogKHNlbmRlciA6IFQxLCBhcmc/IDogVDIpID0+IHZvaWQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICBUcmlnZ2VyKHNlbmRlciA6IFQxLCBhcmdzPyA6IFQyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLmZvckVhY2goaGFuZGxlciA9PiBoYW5kbGVyKHNlbmRlciwgYXJncykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuLi9sb2FkZXJcIjtcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgYmFja2dyb3VuZEltYWdlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kSW1hZ2VVUkwgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpO1xuICAgIGNvbnN0cnVjdG9yKGltYWdlVVJMPyA6IHN0cmluZykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGlmIChpbWFnZVVSTCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLkJhY2tncm91bmRJbWFnZSA9IGltYWdlVVJMO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IEJhY2tncm91bmRJbWFnZShpbWFnZVVSTCA6IHN0cmluZykge1xuICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuYmFja2dyb3VuZEltYWdlVVJMKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZVVSTCA9IGltYWdlVVJMO1xuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTCkudGhlbihpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmJhY2tncm91bmRJbWFnZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0JhY2tncm91bmRJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMsIEhpZGRlbkNhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuLi9sb2FkZXJcIjtcbmltcG9ydCB7IElSZWN0LCBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuZXhwb3J0IGVudW0gQm94QmFja2dyb3VuZFR5cGVzIHtcbiAgICBDT0xPUiwgTklORVBBVENILCBTVFJFVENIXG59XG5cbmNsYXNzIENsYXNzQm94QmFja2dyb3VuZEZhY3Rvcnkge1xuICAgIENyZWF0ZSh0eXBlIDogQm94QmFja2dyb3VuZFR5cGVzLCBiYWNrZ3JvdW5kIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSA6IEJveEJhY2tncm91bmQge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLkNPTE9SOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcmVkQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5OSU5FUEFUQ0g6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE5pbmVQYXRjaEJveEJhY2tncm91bmQoYmFja2dyb3VuZCwgc2l6ZSwgcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuU1RSRVRDSDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RyZXRjaEJveEJhY2tncm91bmQoYmFja2dyb3VuZCwgc2l6ZSwgcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgQm94QmFja2dyb3VuZEZhY3RvcnkgOiBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5ID0gbmV3IENsYXNzQm94QmFja2dyb3VuZEZhY3RvcnkoKTtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJveEJhY2tncm91bmQgZXh0ZW5kcyBMYXllciB7XG4gICAgcHJvdGVjdGVkIGJveCA6IElSZWN0O1xuXG4gICAgY29uc3RydWN0b3Ioc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYm94ID0ge1xuICAgICAgICAgICAgUG9zaXRpb24gOiBwb3NpdGlvbiA9PSBudWxsID8gbmV3IFBvaW50KCkgOiBwb3NpdGlvbixcbiAgICAgICAgICAgIFNpemUgOiBzaXplXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IFBvc2l0aW9uKHBvc2l0aW9uIDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5ib3guUG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB9XG5cbiAgICBzZXQgU2l6ZShzaXplIDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5ib3guU2l6ZSA9IHNpemU7XG4gICAgfVxufVxuXG5jbGFzcyBDb2xvcmVkQm94QmFja2dyb3VuZCBleHRlbmRzIEJveEJhY2tncm91bmQge1xuICAgIENvbG9yIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoY29sb3IgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoc2l6ZSwgcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuQ29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLkRyYXdSZWN0KHRoaXMuYm94LlBvc2l0aW9uLCB0aGlzLmJveC5TaXplLCB0aGlzLkNvbG9yKTtcbiAgICB9XG59XG5cbmNsYXNzIE5pbmVQYXRjaEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBwcml2YXRlIG5pbmVQYXRjaCA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgbmluZVBhdGNoVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmluZVBhdGNoVVJMIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKHNpemUsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLk5pbmVQYXRjaCA9IG5pbmVQYXRjaFVSTDtcbiAgICB9XG5cbiAgICBzZXQgTmluZVBhdGNoKG5pbmVQYXRjaFVSTCA6IHN0cmluZykge1xuICAgICAgICBpZiAobmluZVBhdGNoVVJMICE9PSB0aGlzLm5pbmVQYXRjaFVSTCkge1xuICAgICAgICAgICAgdGhpcy5uaW5lUGF0Y2hVUkwgPSBuaW5lUGF0Y2hVUkw7XG5cbiAgICAgICAgICAgIExvYWRlci5Mb2FkSW1hZ2UobmluZVBhdGNoVVJMKVxuICAgICAgICAgICAgLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhpZGRlbkNhbnZhcyA9IG5ldyBIaWRkZW5DYW52YXModGhpcy5ib3guU2l6ZS5DbG9uZSgpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRjaFNpemUgPSBuZXcgUG9pbnQoaW1hZ2Uud2lkdGggLyAzLCBpbWFnZS5oZWlnaHQgLyAzKTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRyYXdQYXRjaFRvKHBhdGNoUG9zaXRpb24gOiBQb2ludCwgZGVzdFBvcyA6IFBvaW50LCBkZXN0U2l6ZT8gOiBQb2ludCkge1xuICAgICAgICAgICAgICAgICAgICBoaWRkZW5DYW52YXMuRHJhd0ltYWdlVG8oXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZSwgeyBQb3NpdGlvbiA6IHBhdGNoUG9zaXRpb24sIFNpemUgOiBwYXRjaFNpemUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgUG9zaXRpb24gOiBkZXN0UG9zLCBTaXplIDogZGVzdFNpemUgIT0gbnVsbCA/IGRlc3RTaXplIDogcGF0Y2hTaXplIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwYXRjaERlc3RpbmF0aW9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KCksIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSBwYXRjaFNpemUuWCwgMCksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCgwLCB0aGlzLmJveC5TaXplLlkgLSBwYXRjaFNpemUuWSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSBwYXRjaFNpemUuWCwgdGhpcy5ib3guU2l6ZS5ZIC0gcGF0Y2hTaXplLlkpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhuZXcgUG9pbnQoKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMF0pOyAvLyBVcHBlciBMZWZ0XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDIsIDApKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMV0pOyAvLyBVcHBlciBSaWdodFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgwLCAyKSksIHBhdGNoRGVzdGluYXRpb25zWzJdKTsgLy8gTG93ZXIgTGVmdFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAyKSksIHBhdGNoRGVzdGluYXRpb25zWzNdKTsgLy8gTG93ZXIgUmlnaHRcblxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAwKSksIHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAwKSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSAocGF0Y2hTaXplLlggKiAyKSwgcGF0Y2hTaXplLlkpKTsgLy8gVG9wXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDIsIDEpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMV0uQWRkKG5ldyBQb2ludCgwLCBwYXRjaFNpemUuWSkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQocGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIChwYXRjaFNpemUuWSAqIDIpKSk7IC8vIFJpZ2h0XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDIpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMl0uQWRkKG5ldyBQb2ludChwYXRjaFNpemUuWCwgMCkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gKHBhdGNoU2l6ZS5YICogMiksIHBhdGNoU2l6ZS5ZKSk7IC8vIEJvdHRvbVxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgwLCAxKSksIHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgwLCAxKSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChwYXRjaFNpemUuWCwgdGhpcy5ib3guU2l6ZS5ZIC0gKHBhdGNoU2l6ZS5ZICogMikpKTsgLy8gTGVmdFxuXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDEpKSxcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDEpKSwgdGhpcy5ib3guU2l6ZS5TdWIocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDIsIDIpKSkpOyAvLyBDZW50ZXJcblxuICAgICAgICAgICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGhpZGRlbkNhbnZhcy5HZXRJbWFnZURhdGEoKSkudGhlbihuaW5lUGF0Y2hJbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmluZVBhdGNoID0gbmluZVBhdGNoSW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZGRlbkNhbnZhcy5EZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5uaW5lUGF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZSh0aGlzLm5pbmVQYXRjaCwgdGhpcy5ib3guUG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBTdHJldGNoQm94QmFja2dyb3VuZCBleHRlbmRzIEJveEJhY2tncm91bmQge1xuICAgIHByaXZhdGUgaW1hZ2UgOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIGltYWdlU2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgaW1hZ2VVUkwgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihpbWFnZVVSTCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbiA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKHNpemUsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLkltYWdlID0gaW1hZ2VVUkw7XG4gICAgfVxuXG4gICAgc2V0IEltYWdlKGltYWdlVVJMIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChpbWFnZVVSTCAhPT0gdGhpcy5pbWFnZVVSTCkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZVVSTCA9IGltYWdlVVJMO1xuXG4gICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKGltYWdlVVJMKVxuICAgICAgICAgICAgLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlU2l6ZSA9IG5ldyBQb2ludCh0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbWFnZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlVG8oXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZSxcbiAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogbmV3IFBvaW50KCksIFNpemUgOiB0aGlzLmltYWdlU2l6ZSB9LFxuICAgICAgICAgICAgICAgIHsgUG9zaXRpb24gOiB0aGlzLmJveC5Qb3NpdGlvbiwgU2l6ZSA6IHRoaXMuYm94LlNpemUgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IExvYWRlciB9IGZyb20gXCIuLi9sb2FkZXJcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5jbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBMYXllciB7XG4gICAgcHJpdmF0ZSBzcHJpdGVzIDoge1tjdXJyZW50U3RhdGUgOiBzdHJpbmddIDogSW1hZ2VCaXRtYXB9OyAvLyBsb2FkZWQgc3RhdGUgc3ByaXRlc1xuICAgIHByaXZhdGUgYW5jaG9yIDogc3RyaW5nIHwgUG9pbnQ7IC8vIGN1cnJlbnQgYW5jaG9yXG4gICAgcHJpdmF0ZSBjdXJyZW50U3RhdGUgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50OyAvLyBjdXJyZW50IHBvc2l0aW9uXG4gICAgcHJpdmF0ZSBzaG93IDogYm9vbGVhbjsgLy8gY3VycmVudGx5IHZpc2libGVcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IFwiZGVmYXVsdFwiO1xuICAgICAgICB0aGlzLnNwcml0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5zaG93ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgSW1hZ2Uoc3ByaXRlVVJMIDogc3RyaW5nLCBzcHJpdGVLZXkgOiBzdHJpbmcpIHtcbiAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShzcHJpdGVVUkwpLnRoZW4oaW1hZ2UgPT4gdGhpcy5zcHJpdGVzW3Nwcml0ZUtleV0gPSBpbWFnZSk7XG4gICAgfVxuXG4gICAgU2hvdyhzcHJpdGVLZXkgOiBzdHJpbmcsIGFuY2hvciA6IHN0cmluZyB8IFBvaW50KSB7XG4gICAgICAgIHRoaXMuc2hvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gc3ByaXRlS2V5O1xuICAgICAgICBpZiAoYW5jaG9yKSB7XG4gICAgICAgICAgICB0aGlzLmFuY2hvciA9IGFuY2hvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEhpZGUoKSB7XG4gICAgICAgIHRoaXMuc2hvdyA9IGZhbHNlO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc2hvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IHRoaXMuc3ByaXRlc1t0aGlzLmN1cnJlbnRTdGF0ZV07XG4gICAgICAgIGlmIChzcHJpdGUgIT0gbnVsbCkge1xuICAgICAgICBsZXQgeCA6IG51bWJlcjtcbiAgICAgICAgbGV0IHkgPSBjYW52YXMuU2l6ZS5ZIC0gc3ByaXRlLmhlaWdodDtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmFuY2hvciA9PT0gXCJzdHJpbmdcIikgeyAvLyBsZWZ0L3JpZ2h0L2V0Y1xuICAgICAgICAgICAgeCA9IChjYW52YXMuU2l6ZS5YIC8gMiApIC0gKHNwcml0ZS53aWR0aCAvIDIpOy8vIGRlZmF1bHQgdG8gY2VudHJlXG4gICAgICAgICAgICBpZiAodGhpcy5hbmNob3IgPT09IFwibGVmdFwiIHx8IHRoaXMuYW5jaG9yID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICB4ID0gdGhpcy5hbmNob3IgPT09IFwibGVmdFwiID8gMCA6IGNhbnZhcy5TaXplLlggLSBzcHJpdGUud2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ID0gdGhpcy5hbmNob3IuWDtcbiAgICAgICAgICAgIHkgPSB0aGlzLmFuY2hvci5ZO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeVxuICAgICAgICApO1xuXG4gICAgICAgIGNhbnZhcy5EcmF3SW1hZ2Uoc3ByaXRlLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEdldEltYWdlKHNwcml0ZVN0YXRlIDogc3RyaW5nKSA6IEltYWdlQml0bWFwIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zcHJpdGVzLCBzcHJpdGVTdGF0ZSxcIi0tLVwiKVxuICAgICAgICBpZiAoc3ByaXRlU3RhdGUgaW4gdGhpcy5zcHJpdGVzKSB7XG4gICAgICAgICAgICBjb25zdCBzcHJpdGUgPSB0aGlzLnNwcml0ZXNbc3ByaXRlU3RhdGVdO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTUFJJVEUgPT09PiBcIiwgc3ByaXRlKVxuICAgICAgICAgICAgcmV0dXJuIHNwcml0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENoYXJhY3RlcnMgZXh0ZW5kcyBMYXllciB7XG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXJzIDogeyBbYSA6IHN0cmluZ10gOiBDaGFyYWN0ZXIgfSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgQWRkKHNwcml0ZVdpdGhQYXJhbXMgOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyRGF0YSA9ICBzcHJpdGVXaXRoUGFyYW1zLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaWYgKCEoY2hhcmFjdGVyRGF0YVswXSBpbiB0aGlzLmNoYXJhY3RlcnMpKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyRGF0YVswXV0gPSBuZXcgQ2hhcmFjdGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzW2NoYXJhY3RlckRhdGFbMF1dLkltYWdlKGNoYXJhY3RlckRhdGFbMl0sIGNoYXJhY3RlckRhdGFbMV0pO1xuICAgIH1cblxuICAgIFNob3coc3ByaXRlV2l0aFBhcmFtcyA6IHN0cmluZywgcG9zaXRpb24/IDogUG9pbnQgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyRGF0YSA9ICBzcHJpdGVXaXRoUGFyYW1zLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgLy8gIyBzaG93OiBhbnlhIGhhcHB5IFtsZWZ0XVxuICAgICAgICBpZiAoY2hhcmFjdGVyRGF0YVswXSBpbiAgdGhpcy5jaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyRGF0YVswXV0uU2hvdyhjaGFyYWN0ZXJEYXRhWzFdLCBwb3NpdGlvbiB8fCBjaGFyYWN0ZXJEYXRhWzJdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEdldEltYWdlKHNwcml0ZU5hbWUgOiBzdHJpbmcsIHNwcml0ZVN0YXRlIDogc3RyaW5nKSA6IEltYWdlQml0bWFwIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHNwcml0ZU5hbWUgaW4gIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJVFMgSU5cIiwgc3ByaXRlTmFtZSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJhY3RlcnNbc3ByaXRlTmFtZV0uR2V0SW1hZ2Uoc3ByaXRlU3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgSGlkZShzcHJpdGVXaXRoUGFyYW1zIDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlckRhdGEgPSAgc3ByaXRlV2l0aFBhcmFtcy5zcGxpdChcIiBcIik7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJEYXRhWzBdXS5IaWRlKCk7XG4gICAgfVxuXG4gICAgSGlkZUFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyYWN0ZXIgaW4gdGhpcy5jaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyXS5IaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyYWN0ZXIgaW4gdGhpcy5jaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnNbY2hhcmFjdGVyXS5EcmF3KGNhbnZhcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBSZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IHt9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENob2ljZSB9IGZyb20gXCJpbmtqc1wiO1xuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgSVJlY3QsIFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBCb3hCYWNrZ3JvdW5kLCBCb3hCYWNrZ3JvdW5kRmFjdG9yeSwgQm94QmFja2dyb3VuZFR5cGVzIH0gZnJvbSBcIi4vYm94YmFja2dyb3VuZHNcIjtcbmltcG9ydCB7Q2hhcmFjdGVycywgR2FtZXBsYXlMYXllcn0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmNsYXNzIENob2ljZUJveCB7XG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGZvbnRTaXplIDogbnVtYmVyID0gMjQ7XG4gICAgcHJpdmF0ZSBoYXNBbHJlYWR5QmVlbkRyYXduT25jZSA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGlkIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludCA9IG5ldyBQb2ludCgwLCAyMCk7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdGV4dCA6IHN0cmluZztcbiAgICBwcml2YXRlIGltYWdlPyA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgaG92ZXJJbWFnZT8gOiBJbWFnZUJpdG1hcDtcbiAgICBwdWJsaWMgaXNIb3ZlcmVkOiBib29sZWFuXG5cbiAgICBjb25zdHJ1Y3RvcihpZCA6IG51bWJlciwgdGV4dCA6IHN0cmluZywgd2lkdGggOiBudW1iZXIsIHBvc2l0aW9uIDogUG9pbnQsIGltYWdlPyA6IEltYWdlQml0bWFwLCBob3ZlckltYWdlPyA6IEltYWdlQml0bWFwKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcblxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQod2lkdGgsICh0aGlzLmZvbnRTaXplICogMS40Mjg1NykgKyAoMiAqIHRoaXMuaW5uZXJNYXJnaW4uWSkpO1xuICAgICAgICBpZiAoaW1hZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBQb2ludChpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhvdmVySW1hZ2UgPSBob3ZlckltYWdlO1xuXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKEJveEJhY2tncm91bmRUeXBlcy5DT0xPUiwgXCJyZ2JhKDAsIDAsIDAsIC43KVwiLCB0aGlzLnNpemUsIHRoaXMucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGdldCBJZCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQ7XG4gICAgfVxuXG4gICAgZ2V0IEJvdW5kaW5nUmVjdCgpIDogSVJlY3Qge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgUG9zaXRpb24gOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgICAgICAgU2l6ZSA6IHRoaXMuc2l6ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UpIHtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlRmlyc3REcmF3KGNhbnZhcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaW1hZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuYm94QmFja2dyb3VuZC5EcmF3KGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQodGhpcy50ZXh0LCB0aGlzLnBvc2l0aW9uLkFkZCh0aGlzLmlubmVyTWFyZ2luKSwgXCJ3aGl0ZVwiLCB0aGlzLmZvbnRTaXplLCB0aGlzLnNpemUuWCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHRoaXMuaG92ZXJJbWFnZSAmJiB0aGlzLmlzSG92ZXJlZCA/IHRoaXMuaG92ZXJJbWFnZSA6IHRoaXMuaW1hZ2UsIHRoaXMucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBiZWZvcmVGaXJzdERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuRHJhd1RleHQwKFwiXCIsIFwidHJhbnNwYXJlbnRcIiwgdGhpcy5mb250U2l6ZSk7XG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4uWCA9ICh0aGlzLnNpemUuWCAtIGNhbnZhcy5NZWFzdXJlVGV4dFdpZHRoKHRoaXMudGV4dCkpIC8gMjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaG9pY2VMYXllciBleHRlbmRzIEdhbWVwbGF5TGF5ZXIge1xuICAgIGNob2ljZXMgOiBDaG9pY2VbXSA9IFtdO1xuICAgIHByaXZhdGUgYm91bmRpbmdSZWN0IDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBjaG9pY2VCb3hlcyA6IENob2ljZUJveFtdID0gW107XG4gICAgcHJpdmF0ZSBpc01vdXNlT25DaG9pY2UgOiBDaG9pY2VCb3ggPSBudWxsO1xuICAgIHByaXZhdGUgc2NyZWVuU2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdHJhbnNsYXRpb24gOiBQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHNjcmVlblNpemUgOiBQb2ludCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNob2ljZUJveGVzID0gW107XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSBuZXcgUG9pbnQoMCwgMCApO1xuICAgICAgICB0aGlzLnNjcmVlblNpemUgPSBzY3JlZW5TaXplO1xuICAgIH1cblxuICAgIHNldCBDaG9pY2VzKGNob2ljZXMgOiBDaG9pY2VbXSkge1xuICAgICAgICB0aGlzLmNob2ljZXMgPSBjaG9pY2VzO1xuXG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMgPSBbXTtcbiAgICAgICAgY29uc3Qgd2lkdGggPSAyMDA7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDApO1xuICAgICAgICBmb3IgKGNvbnN0IF9jaG9pY2Ugb2YgdGhpcy5jaG9pY2VzKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdDaG9pY2UgPSBuZXcgQ2hvaWNlQm94KF9jaG9pY2UuaW5kZXgsIF9jaG9pY2UudGV4dCwgd2lkdGgsIHBvc2l0aW9uLkNsb25lKCkpO1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VCb3hlcy5wdXNoKG5ld0Nob2ljZSk7XG4gICAgICAgICAgICBwb3NpdGlvbi5ZICs9IG5ld0Nob2ljZS5Cb3VuZGluZ1JlY3QuU2l6ZS5ZICsgNDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib3VuZGluZ1JlY3QgPSBuZXcgUG9pbnQod2lkdGgsIHBvc2l0aW9uLlkgLSA0MCk7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSB0aGlzLnNjcmVlblNpemUuRGl2KG5ldyBQb2ludCgyKSkuU3ViKHRoaXMuYm91bmRpbmdSZWN0LkRpdihuZXcgUG9pbnQoMikpKTtcbiAgICB9XG5cbiAgICBBZGRCdXR0b24oY2hhcmFjdGVycyA6IENoYXJhY3RlcnMsIGJ1dHRvbiA6IENob2ljZSkge1xuICAgICAgICAvLyBhZGQgaW1hZ2UgdG8gZWFjaCBib3hcbiAgICAgICAgY29uc3QgcmVjdEltYWdlID0gY2hhcmFjdGVycy5HZXRJbWFnZShidXR0b24udGV4dCwgXCJkZWZhdWx0XCIpO1xuICAgICAgICBjb25zdCByZWN0SW1hZ2VIb3ZlciA9IGNoYXJhY3RlcnMuR2V0SW1hZ2UoYnV0dG9uLnRleHQsIFwiaG92ZXJcIik7XG4gICAgICAgIHRoaXMuY2hvaWNlcy5wdXNoKGJ1dHRvbik7XG4gICAgICAgIC8vIFRvZG8gYWRkIHN1cHBvcnQgZm9yIHBlcmNlbnQgaWYgJSBpbiB2YWx1ZXM/XG4gICAgICAgIGNvbnN0IG5ld0J1dHRvbiA9IG5ldyBDaG9pY2VCb3goYnV0dG9uLmtub3QsIGJ1dHRvbi50ZXh0LCAyMDAsIGJ1dHRvbi5wb3NpdGlvbiwgcmVjdEltYWdlLCByZWN0SW1hZ2VIb3Zlcik7XG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMucHVzaChuZXdCdXR0b24pO1xuICAgIH1cblxuICAgIENsZWFyQnV0dG9ucygpe1xuICAgICAgICB0aGlzLmNob2ljZXMgPSBbXTtcbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcyA9IFtdO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMudHJhbnNsYXRpb24pO1xuICAgICAgICBmb3IgKGNvbnN0IGNob2ljZUJveCBvZiB0aGlzLmNob2ljZUJveGVzKSB7XG4gICAgICAgICAgICBjaG9pY2VCb3guRHJhdyhjYW52YXMpO1xuICAgICAgICB9XG4gICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGNob2ljZUJveCBvZiB0aGlzLmNob2ljZUJveGVzKSB7XG4gICAgICAgICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSBjaG9pY2VCb3guQm91bmRpbmdSZWN0O1xuICAgICAgICAgICAgYm91bmRpbmdSZWN0LlBvc2l0aW9uID0gYm91bmRpbmdSZWN0LlBvc2l0aW9uLkFkZCh0aGlzLnRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIGlmIChjbGlja1Bvc2l0aW9uLklzSW5SZWN0KGJvdW5kaW5nUmVjdCkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24oY2hvaWNlQm94LklkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQge1xuICAgICAgICBtb3VzZVBvc2l0aW9uID0gbW91c2VQb3NpdGlvbi5TdWIodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgIGlmICh0aGlzLmlzTW91c2VPbkNob2ljZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbW91c2VQb3NpdGlvbi5Jc0luUmVjdCh0aGlzLmlzTW91c2VPbkNob2ljZS5Cb3VuZGluZ1JlY3QpID8gbnVsbCA6IChjYW52YXMgOiBDYW52YXMpID0+IHtcbiAgICAgICAgICAgICAgICBjYW52YXMuU2V0Q3Vyc29yKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW91c2VPbkNob2ljZSA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaG9pY2Ugb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgICAgIGNob2ljZS5pc0hvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAobW91c2VQb3NpdGlvbi5Jc0luUmVjdChjaG9pY2UuQm91bmRpbmdSZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNhbnZhcyA6IENhbnZhcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMuU2V0Q3Vyc29yKFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZS5pc0hvdmVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQgeyB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGF5ZXIge1xuICAgIGFic3RyYWN0IERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQ7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGVwTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gICAgYWJzdHJhY3QgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZXBsYXlMYXllciBleHRlbmRzIFN0ZXBMYXllciB7XG4gICAgYWJzdHJhY3QgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQ7XG4gICAgYWJzdHJhY3QgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZDtcbn1cblxuZXhwb3J0ICogZnJvbSBcIi4vYmFja2dyb3VuZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vY2hhcmFjdGVyc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vY2hvaWNlbGF5ZXJcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3NwZWVjaGxheWVyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90cmFuc2l0aW9uXCI7XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQgeyBHYW1lcGxheUxheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcblxuaW50ZXJmYWNlIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBCYWNrZ3JvdW5kIDogc3RyaW5nO1xuICAgIEJhY2tncm91bmRUeXBlIDogQm94QmFja2dyb3VuZFR5cGVzO1xuICAgIEZvbnRDb2xvciA6IHN0cmluZztcbiAgICBGb250U2l6ZSA6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU3BlZWNoQm94Q29uZmlndXJhdGlvbiBleHRlbmRzIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBIZWlnaHQgOiBudW1iZXI7XG4gICAgSW5uZXJNYXJnaW4gOiBQb2ludDtcbiAgICBPdXRlck1hcmdpbiA6IFBvaW50O1xufVxuXG5pbnRlcmZhY2UgSU5hbWVCb3hDb25maWd1cmF0aW9uIGV4dGVuZHMgSUJveENvbmZpZ3VyYXRpb24ge1xuICAgIEhlaWdodCA6IG51bWJlcjtcbiAgICBXaWR0aCA6IG51bWJlcjtcbn1cblxuY29uc3QgUkVXUkFQX1RISVNfTElORSA9IFwiPFt7UkVXUkFQX1RISVNfTElORX1dPlwiO1xuXG5jbGFzcyBTcGVlY2hCb3gge1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250Q29sb3IgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGlubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBpbm5lclNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIG5leHRXb3JkIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIHRleHRMaW5lcyA6IFtzdHJpbmc/XSA9IFtcIlwiXTtcblxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIHNpemUgOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElTcGVlY2hCb3hDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbi5DbG9uZSgpO1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplLkNsb25lKCk7XG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4gPSBjb25maWd1cmF0aW9uLklubmVyTWFyZ2luO1xuICAgICAgICB0aGlzLmlubmVyU2l6ZSA9IHRoaXMuc2l6ZS5TdWIodGhpcy5pbm5lck1hcmdpbi5NdWx0KG5ldyBQb2ludCgyKSkpO1xuXG4gICAgICAgIGlmICh0aGlzLnRleHRMaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSwgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZS5DbG9uZSgpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGNvbmZpZ3VyYXRpb24uRm9udFNpemU7XG4gICAgICAgIHRoaXMuZm9udENvbG9yID0gY29uZmlndXJhdGlvbi5Gb250Q29sb3I7XG4gICAgfVxuXG4gICAgZ2V0IFRleHQoKSA6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRMaW5lcy5qb2luKFwiIFwiKTtcbiAgICB9XG5cbiAgICBzZXQgVGV4dCh0ZXh0IDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IF90ZXh0ID0gdGhpcy5UZXh0O1xuICAgICAgICBpZiAodGV4dC5pbmRleE9mKF90ZXh0KSA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2xpY2UgPSB0ZXh0LnNsaWNlKF90ZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXSArPSBzbGljZTtcbiAgICAgICAgICAgIGlmIChzbGljZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0V29yZCA9IFJFV1JBUF9USElTX0xJTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lcyA9IFt0ZXh0XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBOZXh0V29yZChuZXh0V29yZCA6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5leHRXb3JkID0gbmV4dFdvcmQ7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kPy5EcmF3KGNhbnZhcyk7XG5cbiAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uLkFkZCh0aGlzLmlubmVyTWFyZ2luKSk7XG5cbiAgICAgICAgaWYgKHRoaXMubmV4dFdvcmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5kb1RoZVdyYXAoY2FudmFzKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFdvcmQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRleHRMaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdUZXh0KFxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW2ldLFxuICAgICAgICAgICAgICAgIG5ldyBQb2ludCgwLCBpICogKHRoaXMuZm9udFNpemUgKiAxLjQyODU3KSksIC8vIFRoaXMgaXMgdGhlIGdvbGRlbiByYXRpbywgb24gbGluZS1oZWlnaHQgYW5kIGZvbnQtc2l6ZVxuICAgICAgICAgICAgICAgIHRoaXMuZm9udENvbG9yLFxuICAgICAgICAgICAgICAgIHRoaXMuZm9udFNpemUsXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lclNpemUuWFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb1RoZVdyYXAoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuRHJhd1RleHQwKFwiXCIsIFwidHJhbnNwYXJlbnRcIiwgdGhpcy5mb250U2l6ZSk7XG4gICAgICAgIGNvbnN0IGNvbXAgPSAobGluZSA6IHN0cmluZykgPT4gY2FudmFzLk1lYXN1cmVUZXh0V2lkdGgobGluZSkgPiB0aGlzLmlubmVyU2l6ZS5YO1xuXG4gICAgICAgIGxldCBsYXN0TGluZSA9IHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGlmICh0aGlzLm5leHRXb3JkID09PSBSRVdSQVBfVEhJU19MSU5FKSB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHdyYXAgdGhlIGZ1Y2sgb3V0IG9mIHRoaXMgbGluZVxuICAgICAgICAgICAgd2hpbGUgKGNvbXAobGFzdExpbmUpKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRvIHRoZSBjaGFyIHdoZXJlIHdlJ3JlIG91dHNpZGUgdGhlIGJvdWRhcmllc1xuICAgICAgICAgICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoIWNvbXAobGFzdExpbmUuc2xpY2UoMCwgbikpKSB7ICsrbjsgfVxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgcHJldmlvdXMgc3BhY2VcbiAgICAgICAgICAgICAgICB3aGlsZSAobGFzdExpbmVbbl0gIT09IFwiIFwiICYmIG4gPj0gMCkgeyAtLW47IH1cbiAgICAgICAgICAgICAgICBpZiAobiA9PT0gMCkgeyBicmVhazsgfSAvLyBXZSBjYW4ndCB3cmFwIG1vcmVcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQsIHVwZGF0ZSBsYXN0IGxpbmUsIGFuZCBiYWNrIGluIHRoZSBsb29wXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXMucHVzaChsYXN0TGluZS5zbGljZShuICsgMSkpOyAvLyArMSBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdGhlIHNwYWNlXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMl0gPSBsYXN0TGluZS5zbGljZSgwLCBuKTtcbiAgICAgICAgICAgICAgICBsYXN0TGluZSA9IHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNvbXAobGFzdExpbmUgKyB0aGlzLm5leHRXb3JkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdID0gbGFzdExpbmUuc2xpY2UoMCwgbGFzdExpbmUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgTmFtZUJveCB7XG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kVVJMIDogc3RyaW5nID0gXCJpbWFnZXMvOXBhdGNoLXNtYWxsLnBuZ1wiO1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250Q29sb3IgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGlubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBuYW1lIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIGNvbmZpZ3VyYXRpb24gOiBJTmFtZUJveENvbmZpZ3VyYXRpb24pO1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIGNvbmZpZ3VyYXRpb24gOiBJTmFtZUJveENvbmZpZ3VyYXRpb24sIG5hbWU/IDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBQb2ludChjb25maWd1cmF0aW9uLldpZHRoLCBjb25maWd1cmF0aW9uLkhlaWdodCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbi5DbG9uZSgpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLlkgLT0gdGhpcy5zaXplLlk7XG5cbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbiA9IHRoaXMuc2l6ZS5EaXYobmV3IFBvaW50KDEwLCAxMCkpO1xuXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSBjb25maWd1cmF0aW9uLkZvbnRTaXplO1xuICAgICAgICB0aGlzLmZvbnRDb2xvciA9IGNvbmZpZ3VyYXRpb24uRm9udENvbG9yO1xuXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcbiAgICAgICAgICAgIHRoaXMuc2l6ZS5DbG9uZSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2V0IE5hbWUobmFtZSA6IHN0cmluZykge1xuICAgICAgICBpZiAobmFtZSAhPT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5hbWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuYm94QmFja2dyb3VuZC5EcmF3KGNhbnZhcyk7XG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQodGhpcy5uYW1lLCB0aGlzLmlubmVyTWFyZ2luLCB0aGlzLmZvbnRDb2xvciwgdGhpcy5mb250U2l6ZSwgdGhpcy5zaXplLlgpO1xuICAgICAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwZWVjaExheWVyIGV4dGVuZHMgR2FtZXBsYXlMYXllciB7XG4gICAgcHJpdmF0ZSBmdWxsVGV4dCA6IHN0cmluZztcbiAgICBwcml2YXRlIG5hbWVCb3ggOiBOYW1lQm94O1xuICAgIHByaXZhdGUgdGV4dEFwcGVhcmVkIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgdGV4dEJveCA6IFNwZWVjaEJveDtcbiAgICBwcml2YXRlIHRleHRUaW1lIDogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHNjcmVlblNpemUgOiBQb2ludCwgc3BlZWNoQm94Q29uZmlndXJhdGlvbiA6IElTcGVlY2hCb3hDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgY29uc3QgdGV4dEJveFNpemUgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICBzY3JlZW5TaXplLlggLSAoc3BlZWNoQm94Q29uZmlndXJhdGlvbi5PdXRlck1hcmdpbi5YICogMiksXG4gICAgICAgICAgICBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkhlaWdodFxuICAgICAgICApO1xuICAgICAgICBjb25zdCB0ZXh0Qm94UG9zaXRpb24gPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICBzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlgsXG4gICAgICAgICAgICBzY3JlZW5TaXplLlkgLSBzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlkgLSBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnRleHRCb3ggPSBuZXcgU3BlZWNoQm94KHRleHRCb3hQb3NpdGlvbiwgdGV4dEJveFNpemUsIHNwZWVjaEJveENvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgIHRoaXMubmFtZUJveCA9IG5ldyBOYW1lQm94KFxuICAgICAgICAgICAgdGV4dEJveFBvc2l0aW9uLkFkZChuZXcgUG9pbnQoNzAsIDApKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kIDogc3BlZWNoQm94Q29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgICAgIEJhY2tncm91bmRUeXBlIDogc3BlZWNoQm94Q29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSxcbiAgICAgICAgICAgICAgICBGb250Q29sb3IgOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiA0MCxcbiAgICAgICAgICAgICAgICBXaWR0aCA6IDEwMFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRCb3guRHJhdyhjYW52YXMpO1xuICAgICAgICB0aGlzLm5hbWVCb3guRHJhdyhjYW52YXMpO1xuICAgIH1cblxuICAgIE1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiA6IFBvaW50LCBhY3Rpb24gOiBGdW5jdGlvbikgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dEFwcGVhcmVkKSB7XG4gICAgICAgICAgICBhY3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGV4dEJveC5UZXh0ID0gdGhpcy5mdWxsVGV4dDtcbiAgICAgICAgICAgIHRoaXMudGV4dEFwcGVhcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBTYXkodGV4dCA6IHN0cmluZywgbmFtZSA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0Qm94LlRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmZ1bGxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLm5hbWVCb3guTmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0VGltZSArPSBkZWx0YTtcblxuICAgICAgICB3aGlsZSAodGhpcy50ZXh0VGltZSA+PSBDb25maWcuVGV4dFNwZWVkUmF0aW8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLmZ1bGxUZXh0LnNsaWNlKHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCwgdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0Qm94LlRleHQgKz0gYztcbiAgICAgICAgICAgICAgICBpZiAoYyA9PT0gXCIgXCIgJiYgdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuID0gdGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5mdWxsVGV4dFtuXSA9PT0gXCIgXCIgJiYgbiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7ICsrbjsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5mdWxsVGV4dFtuXSAhPT0gXCIgXCIgJiYgbiA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7ICsrbjsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dEJveC5OZXh0V29yZCA9IHRoaXMuZnVsbFRleHQuc2xpY2UodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoICsgMSwgbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGV4dFRpbWUgPSB0aGlzLnRleHRUaW1lIC0gQ29uZmlnLlRleHRTcGVlZFJhdGlvO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IFN0ZXBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNpdGlvbiBleHRlbmRzIFN0ZXBMYXllciB7XG4gICAgcHJpdmF0ZSBfb25FbmQgOiBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4gPSBuZXcgTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+KCk7XG5cbiAgICBwcml2YXRlIGIgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgdGltZSA6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSB0b3RhbFRpbWUgOiBudW1iZXIgPSAyMDAwLjA7XG5cbiAgICBjb25zdHJ1Y3RvcihpbWFnZURhdGEgOiBJbWFnZURhdGEpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvLyBzaW4gZXF1YXRpb246IHkgPSBhKnNpbihiKnggKyBjKSArIGRcbiAgICAgICAgLy8gYSBzaW4gcGVyaW9kIGlzIDJQSSAvIGJcbiAgICAgICAgLy8gd2Ugd2FudCBhIGhhbGYgcGVyaW9kIG9mIHRvdGFsVGltZSBzbyB3ZSdyZSBsb29raW5nIGZvciBiOiBiID0gMlBJIC8gcGVyaW9kXG4gICAgICAgIHRoaXMuYiA9IChNYXRoLlBJICogMikgLyAodGhpcy50b3RhbFRpbWUgKiAyKTtcblxuICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChpbWFnZURhdGEpLnRoZW4oaW1hZ2UgPT4gdGhpcy5pbWFnZSA9IGltYWdlKTtcbiAgICB9XG5cbiAgICBnZXQgT25FbmQoKSA6IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbkVuZC5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdCYWNrZ3JvdW5kSW1hZ2UodGhpcy5pbWFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMuRHJhd1JlY3QobmV3IFBvaW50KCksIGNhbnZhcy5TaXplLCBgcmdiYSgwLjAsIDAuMCwgMC4wLCAke01hdGguc2luKHRoaXMuYiAqIHRoaXMudGltZSl9KWApO1xuICAgIH1cblxuICAgIFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGltZSArPSBkZWx0YTtcblxuICAgICAgICBpZiAodGhpcy5pbWFnZSAhPSBudWxsICYmIHRoaXMudGltZSA+PSB0aGlzLnRvdGFsVGltZSAvIDIpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGltZSA+PSB0aGlzLnRvdGFsVGltZSkge1xuICAgICAgICAgICAgdGhpcy5fb25FbmQuVHJpZ2dlcih0aGlzLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuXG5jbGFzcyBDbGFzc0xvYWRlciB7XG4gICAgTG9hZEltYWdlKFVSTCA6IHN0cmluZykgOiBQcm9taXNlPEltYWdlQml0bWFwPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSA6IEZ1bmN0aW9uLCByZWplY3QgOiBGdW5jdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd29ya2VyIDogV29ya2VyID0gdGhpcy5jcmVhdGVXb3JrZXIoKTtcblxuICAgICAgICAgICAgd29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldnQgOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZ0LmRhdGEuZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZXZ0LmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3b3JrZXIudGVybWluYXRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKENvbmZpZy5Sb290UGF0aElzUmVtb3RlID9cbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly8ke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke1VSTH1gXG4gICAgICAgICAgICAgICAgOiBgJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHt3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bXlxcXFxcXC9dKiQvLCBcIlwiKX0ke1VSTH1gKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVXb3JrZXIoKSA6IFdvcmtlciB7XG4gICAgICAgIHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2AoZnVuY3Rpb24gJHt0aGlzLndvcmtlcn0pKClgXSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHdvcmtlcigpIHtcbiAgICAgICAgY29uc3QgY3R4IDogV29ya2VyID0gc2VsZiBhcyBhbnk7XG4gICAgICAgIGN0eC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZ0IDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBmZXRjaChldnQuZGF0YSkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5ibG9iKCkpLnRoZW4oYmxvYkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGJsb2JEYXRhKS50aGVuKGltYWdlID0+IGN0eC5wb3N0TWVzc2FnZShpbWFnZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IExvYWRlciA9IG5ldyBDbGFzc0xvYWRlcigpO1xuIiwiaW1wb3J0ICogYXMgSW5rSnMgZnJvbSBcImlua2pzXCI7XG5pbXBvcnQgeyBBdWRpbywgQXVkaW9GYWN0b3J5IH0gZnJvbSBcIi4vYXVkaW9cIjtcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuL2NhbnZhc1wiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9sYXllcnMvYm94YmFja2dyb3VuZHNcIjtcbmltcG9ydCAqIGFzIExheWVycyBmcm9tIFwiLi9sYXllcnMvbGF5ZXJzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5pbXBvcnQgeyBQcmVsb2FkZXIgfSBmcm9tIFwiLi9wcmVsb2FkZXJcIjtcblxuZXhwb3J0IGNsYXNzIFZOIHtcbiAgICBBdWRpbyA6IEF1ZGlvO1xuICAgIENhbnZhcyA6IENhbnZhcztcbiAgICBTdG9yeSA6IElua0pzLlN0b3J5O1xuXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kIDogTGF5ZXJzLkJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXJzIDogTGF5ZXJzLkNoYXJhY3RlcnM7XG4gICAgcHJpdmF0ZSBjaG9pY2VTY3JlZW4gOiBMYXllcnMuQ2hvaWNlTGF5ZXI7XG4gICAgcHJpdmF0ZSBjdXJyZW50U2NyZWVuIDogTGF5ZXJzLkdhbWVwbGF5TGF5ZXI7XG4gICAgcHJpdmF0ZSBwcmV2aW91c1RpbWVzdGFtcCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHNwZWFraW5nQ2hhcmFjdGVyTmFtZSA6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBzcGVlY2hTY3JlZW4gOiBMYXllcnMuU3BlZWNoTGF5ZXI7XG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uIDogTGF5ZXJzLlRyYW5zaXRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihzdG9yeUZpbGVuYW1lT3JPYmplY3QgOiBzdHJpbmcgfCBvYmplY3QsIGNvbnRhaW5lcklEIDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuQXVkaW8gPSBBdWRpb0ZhY3RvcnkuQ3JlYXRlKCk7XG4gICAgICAgIHRoaXMuQ2FudmFzID0gbmV3IENhbnZhcyhjb250YWluZXJJRCwgQ29uZmlnLlNjcmVlblNpemUpO1xuXG4gICAgICAgIGNvbnN0IGluaXRTdG9yeSA9IChyYXdTdG9yeSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5TdG9yeSA9IG5ldyBJbmtKcy5TdG9yeShyYXdTdG9yeSk7XG4gICAgICAgICAgICBDb25maWcuTG9hZCh0aGlzLlN0b3J5Lmdsb2JhbFRhZ3MgfHwgW10pO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuU2l6ZSA9IENvbmZpZy5TY3JlZW5TaXplO1xuXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgTGF5ZXJzLkJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IG5ldyBMYXllcnMuQ2hhcmFjdGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbiA9IG5ldyBMYXllcnMuU3BlZWNoTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSwge1xuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBcInJnYmEoMC4wLCAwLjAsIDAuMCwgMC43NSlcIixcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kVHlwZSA6IEJveEJhY2tncm91bmRUeXBlcy5DT0xPUixcbiAgICAgICAgICAgICAgICBGb250Q29sb3IgOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiAyMDAsXG4gICAgICAgICAgICAgICAgSW5uZXJNYXJnaW4gOiBuZXcgUG9pbnQoMzUpLFxuICAgICAgICAgICAgICAgIE91dGVyTWFyZ2luIDogbmV3IFBvaW50KDUwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbiA9IG5ldyBMYXllcnMuQ2hvaWNlTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSk7XG4gICAgICAgICAgICB0aGlzLkNhbnZhcy5PbkNsaWNrLk9uKHRoaXMubW91c2VDbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLk9uTW92ZS5Pbih0aGlzLm1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5jb250aW51ZSgpO1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c1RpbWVzdGFtcCA9IDA7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RTdGVwKCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcnlGaWxlbmFtZU9yT2JqZWN0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBmZXRjaChzdG9yeUZpbGVuYW1lT3JPYmplY3QpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKS50aGVuKGluaXRTdG9yeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbml0U3RvcnkoSlNPTi5zdHJpbmdpZnkoc3RvcnlGaWxlbmFtZU9yT2JqZWN0KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbXB1dGVUYWdzKCkgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ2V0RmluYWxWYWx1ZSA9ICh2YWx1ZSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVNYXRjaCA9IHZhbHVlLm1hdGNoKC9eXFx7KFxcdyspXFx9JC8pO1xuICAgICAgICAgICAgaWYgKHZhbHVlTWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlN0b3J5LnZhcmlhYmxlc1N0YXRlLiQodmFsdWVNYXRjaFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMuU3RvcnkuY3VycmVudFRhZ3M7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVEFnczpcIiwgdGFncywgXCJzY3JlZW5cIiwgdGhpcy5jdXJyZW50U2NyZWVuKVxuICAgICAgICBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHRhZ3NbaV0ubWF0Y2goL14oXFx3KylcXHMqOlxccyooLiopJC8pO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyB3aGF0IHRhZyBpdCBpc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgOiBzdHJpbmcgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgOiBzdHJpbmcgPSBnZXRGaW5hbFZhbHVlKG1hdGNoWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmVsb2FkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zcGxpdChcIixcIikuZm9yRWFjaChfdmFsdWUgPT4gUHJlbG9hZGVyLlByZWxvYWQoQ29uZmlnLlJvb3RQYXRoSXNSZW1vdGUgPyBgaHR0cHM6Ly8ke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke192YWx1ZS50cmltKCl9YCA6IGAke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke192YWx1ZS50cmltKCl9YCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5CYWNrZ3JvdW5kSW1hZ2UgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkFkZCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlYnV0dG9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2RvX3RoaW5nIHlheSVzLnBuZyAzMCAyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uUGFyYW0gPSAgdmFsdWUuc3BsaXQoXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbi5BZGRCdXR0b24odGhpcy5jaGFyYWN0ZXJzLCB7a25vdDogYnV0dG9uUGFyYW1bMF0sIHRleHQ6IGJ1dHRvblBhcmFtWzFdLCBwb3NpdGlvbjogbmV3IFBvaW50KHBhcnNlSW50KGJ1dHRvblBhcmFtWzJdKSwgcGFyc2VJbnQoYnV0dG9uUGFyYW1bM10pKX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuY2hhcmFjdGVyc1tjaGFyYWN0ZXJEYXRhWzBdXS5TaG93KGNoYXJhY3RlckRhdGFbMV0sIGNoYXJhY3RlckRhdGFbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYnV0dG9uU2NyZWVuLkFkZEJ1dHRvbih7dGV4dDogXCJlcnJcIiwgaW5kZXg6IDAsIHBvc2l0aW9uOm5ldyBQb2ludCgxMCwgMTApfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2hvd1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLlNob3codmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMuSGlkZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkhpZGVBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiZ21cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheUJHTSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5TdG9wQkdNKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNmeFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5QbGF5U0ZYKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2l0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBuZXcgTGF5ZXJzLlRyYW5zaXRpb24odGhpcy5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5PbkVuZC5Pbigoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVua25vd24gdGFncyBhcmUgdHJlYXRlZCBhcyBuYW1lc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWFraW5nQ2hhcmFjdGVyTmFtZSA9IGdldEZpbmFsVmFsdWUodGFnc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb250aW51ZSgpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICBpZiAodGhpcy5TdG9yeS5jYW5Db250aW51ZSkge1xuICAgICAgICAgICAgdGhpcy5TdG9yeS5Db250aW51ZSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5TdG9yeS5jdXJyZW50VGV4dC5yZXBsYWNlKC9cXHMvZywgXCJcIikubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZVNjcmVlbi5jaG9pY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5jaG9pY2VTY3JlZW4gO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNoYXJhY3RlcnMuSGlkZUFsbCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0aWxsIHJlcXVpcmVkIGZvciBpbml0aWF0aW9uIHdoZW4gdGhlcmUgaXMgbm8gdGV4dFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLnNwZWVjaFNjcmVlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuc3BlZWNoU2NyZWVuO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuY2hvaWNlU2NyZWVuLkNsZWFyQnV0dG9ucygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU3RvcnkuY3VycmVudENob2ljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb250aW51ZSAzXCIpXG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVUYWdzKCk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbi5DaG9pY2VzID0gdGhpcy5TdG9yeS5jdXJyZW50Q2hvaWNlcztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuY2hvaWNlU2NyZWVuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVE9ETyBJdCdzIHRoZSBlbmRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29udGludWUgNFwiKS8vXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlQ2xpY2soc2VuZGVyIDogQ2FudmFzLCBjbGlja1Bvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbiBpbnN0YW5jZW9mIExheWVycy5DaG9pY2VMYXllcikge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuLk1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiwgdGhpcy52YWxpZGF0ZUNob2ljZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sICgpID0+IHRoaXMuY29udGludWUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlTW92ZShzZW5kZXIgOiBDYW52YXMsIG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmN1cnJlbnRTY3JlZW4uTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24pO1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soc2VuZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdFN0ZXAoKSA6IHZvaWQge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RlcC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0ZXAodGltZXN0YW1wIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNUaW1lc3RhbXA7XG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG5cbiAgICAgICAgdGhpcy5DYW52YXMuQ2xlYXIoKTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkRyYXcodGhpcy5DYW52YXMpO1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcbiAgICB9XG5cbiAgICAvLyB3aGVuIG51bWJlcixpdHMgYSBjaG9pY2VJbmRleCwgd2hlbiBzdHJpbmcgLSBpdHMgYSBrbm90XG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUNob2ljZShjaG9pY2UgOiBudW1iZXIgfCBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2YgY2hvaWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLlN0b3J5LkNob29zZVBhdGhTdHJpbmcoY2hvaWNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ2hvb3NlQ2hvaWNlSW5kZXgoY2hvaWNlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLmNoYXJhY3RlcnMuSGlkZUFsbCgpO1xuICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJUmVjdCB7XG4gICAgUG9zaXRpb24gOiBQb2ludDtcbiAgICBTaXplIDogUG9pbnQ7XG59XG5cbmV4cG9ydCBjbGFzcyBQb2ludCB7XG4gICAgcHJpdmF0ZSB4IDogbnVtYmVyO1xuICAgIHByaXZhdGUgeSA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCk7XG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlcik7XG4gICAgY29uc3RydWN0b3IoeCA6IG51bWJlciwgeSA6IG51bWJlcik7XG4gICAgY29uc3RydWN0b3IoeD8gOiBudW1iZXIsIHk/IDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHggIT0gbnVsbCA/IHggOiAwO1xuICAgICAgICB0aGlzLnkgPSB5ICE9IG51bGwgPyB5IDogeCAhPSBudWxsID8geCA6IDA7XG4gICAgfVxuXG4gICAgZ2V0IFgoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgfVxuXG4gICAgc2V0IFgoeCA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgIH1cblxuICAgIGdldCBZKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgIH1cblxuICAgIHNldCBZKHkgOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICBBZGQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICsgcG9pbnQuWCwgdGhpcy5ZICsgcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgQ2xvbmUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlgsIHRoaXMuWSk7XG4gICAgfVxuXG4gICAgRGl2KHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCAvIHBvaW50LlgsIHRoaXMuWSAvIHBvaW50LlkpO1xuICAgIH1cblxuICAgIFBlcmNlbnQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQoKHBvaW50LlggLyAxMDApICogdGhpcy5YICwgKHBvaW50LlkgLyAxMDApICogdGhpcy5ZKTtcbiAgICB9XG5cbiAgICBJc0luUmVjdChyZWN0IDogSVJlY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWCA+PSByZWN0LlBvc2l0aW9uLlggJiYgdGhpcy5YIDw9IHJlY3QuUG9zaXRpb24uQWRkKHJlY3QuU2l6ZSkuWFxuICAgICAgICAgICAgJiYgdGhpcy5ZID49IHJlY3QuUG9zaXRpb24uWSAmJiB0aGlzLlkgPD0gcmVjdC5Qb3NpdGlvbi5BZGQocmVjdC5TaXplKS5ZO1xuICAgIH1cblxuICAgIE11bHQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICogcG9pbnQuWCwgdGhpcy5ZICogcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgU3ViKHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5BZGQobmV3IFBvaW50KC1wb2ludC5YLCAtcG9pbnQuWSkpO1xuICAgIH1cbn1cbiIsImNsYXNzIENsYXNzUHJlbG9hZGVyIHtcbiAgICBQcmVsb2FkKHVybCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgZmV0Y2godXJsKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXIgPSBuZXcgQ2xhc3NQcmVsb2FkZXIoKTtcbiJdfQ==
