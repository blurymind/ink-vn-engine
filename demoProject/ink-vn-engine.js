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
    constructor(spriteURL, posX) {
        super();
        this.centerPosX = posX;
        this.Sprite = spriteURL;
    }
    set Sprite(spriteURL) {
        if (spriteURL !== this.spriteURL) {
            this.spriteURL = spriteURL;
            loader_1.Loader.LoadImage(spriteURL).then(image => this.sprite = image);
        }
    }
    Draw(canvas) {
        if (this.sprite != null) {
            if (this.position == null) {
                this.position = new point_1.Point(this.centerPosX - (this.sprite.width / 2), canvas.Size.Y - this.sprite.height);
            }
            canvas.DrawImage(this.sprite, this.position);
        }
    }
}
class Characters extends layers_1.Layer {
    constructor() {
        super();
        this.characters = [];
    }
    Add(spriteURL, canvas) {
        // For now just handle one character at a time
        if (this.characters.length > 0) {
            this.characters = [];
        }
        this.characters.push(new Character(spriteURL, canvas.Size.X / 2));
    }
    Draw(canvas) {
        for (const character of this.characters) {
            character.Draw(canvas);
        }
    }
    Remove() {
        this.characters = [];
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
    constructor(id, text, width, position) {
        this.fontSize = 24;
        this.hasAlreadyBeenDrawnOnce = false;
        this.innerMargin = new point_1.Point(0, 20);
        this.id = id;
        this.text = text;
        this.size = new point_1.Point(width, (this.fontSize * 1.42857) + (2 * this.innerMargin.Y));
        this.position = position;
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
        this.boxBackground.Draw(canvas);
        canvas.DrawText(this.text, this.position.Add(this.innerMargin), "white", this.fontSize, this.size.X);
    }
    beforeFirstDraw(canvas) {
        canvas.DrawText0("", "transparent", this.fontSize);
        this.innerMargin.X = (this.size.X - canvas.MeasureTextWidth(this.text)) / 2;
    }
}
class ChoiceLayer extends layers_1.GameplayLayer {
    constructor(screenSize) {
        super();
        this.choiceBoxes = [];
        this.choices = [];
        this.isMouseOnChoice = null;
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
                if (mousePosition.IsInRect(choice.BoundingRect)) {
                    return (canvas) => {
                        this.isMouseOnChoice = choice;
                        canvas.SetCursor("pointer");
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
        this.boxBackground = boxbackgrounds_1.BoxBackgroundFactory.Create(configuration.BackgroundType, configuration.Background, this.size.Clone());
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
        canvas.Translate(this.position);
        this.boxBackground.Draw(canvas);
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
        if (tags.length > 0) {
            for (let i = 0; i < tags.length; ++i) {
                const match = tags[i].match(/^(\w+)\s*:\s*(.*)$/);
                if (match != null) {
                    // We need to know what tag it is
                    const key = match[1];
                    const value = getFinalValue(match[2]);
                    switch (key) {
                        case "preload": {
                            value.split(",").forEach(_value => preloader_1.Preloader.Preload(_value.trim()));
                            break;
                        }
                        case "background": {
                            this.background.BackgroundImage = value;
                            break;
                        }
                        case "sprite": {
                            if (value.length > 0) {
                                this.characters.Add(value, this.Canvas);
                            }
                            else {
                                this.characters.Remove();
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
    validateChoice(choiceIndex) {
        this.Story.ChooseChoiceIndex(choiceIndex);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsdUNBQXVDO0FBRXZDLE1BQWEsWUFBWTtJQUNyQixNQUFNLENBQUMsTUFBTTtRQUNULElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksY0FBYyxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSjtBQVJELG9DQVFDO0FBRUQsTUFBc0IsS0FBSztDQUkxQjtBQUpELHNCQUlDO0FBRUQsTUFBTSxjQUFlLFNBQVEsS0FBSztJQUk5QixPQUFPLENBQUMsTUFBZTtRQUNuQixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsT0FBTyxFQUFHO29CQUNOLElBQUksRUFBRyxJQUFJO29CQUNYLElBQUksRUFBRyxNQUFNO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUcsTUFBTTthQUNsQixFQUFFLEdB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QyxJQUFJLENBQUMsQ0FBQyxDQUFDO2VBQ3JFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBYTtRQUNkLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFwREQsc0JBb0RDOzs7Ozs7QUN6REQsTUFBTSxjQUFjO0lBQ2hCLE9BQU8sQ0FBQyxHQUFZO1FBQ2hCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQUVZLFFBQUEsU0FBUyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyBQaXp6aWNhdG8gZnJvbSBcInBpenppY2F0b1wiO1xuXG5leHBvcnQgY2xhc3MgQXVkaW9GYWN0b3J5IHtcbiAgICBzdGF0aWMgQ3JlYXRlKCkgOiBBdWRpbyB7XG4gICAgICAgIGlmIChQaXp6aWNhdG8gIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQaXp6aWNhdG9BdWRpbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEdW1teUF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBdWRpbyB7XG4gICAgYWJzdHJhY3QgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZDtcbiAgICBhYnN0cmFjdCBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkO1xuICAgIGFic3RyYWN0IFN0b3BCR00oKSA6IHZvaWQ7XG59XG5cbmNsYXNzIFBpenppY2F0b0F1ZGlvIGV4dGVuZHMgQXVkaW8ge1xuICAgIHByaXZhdGUgYmdtIDogUGl6emljYXRvLlNvdW5kO1xuICAgIHByaXZhdGUgYmdtVVJMIDogc3RyaW5nO1xuXG4gICAgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGlmIChiZ21VUkwgIT09IHRoaXMuYmdtVVJMKSB7XG4gICAgICAgICAgICB0aGlzLmJnbVVSTCA9IGJnbVVSTDtcblxuICAgICAgICAgICAgY29uc3QgYmdtID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9vcCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHBhdGggOiBiZ21VUkxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmdtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnbS5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJnbS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iZ20gPSBiZ207XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBzZnggPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7IHBhdGggOiBzZnhVUkwgfSxcbiAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXG4gICAgICAgIH0sICgpID0+IHNmeC5wbGF5KCkpO1xuICAgIH1cblxuICAgIFN0b3BCR00oKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iZ20gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5iZ20uZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgdGhpcy5iZ21VUkwgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5iZ20gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBEdW1teUF1ZGlvIGV4dGVuZHMgQXVkaW8ge1xuICAgIFBsYXlCR00oYmdtVVJMIDogc3RyaW5nKSA6IHZvaWQgeyB9XG4gICAgUGxheVNGWChzZnhVUkwgOiBzdHJpbmcpIDogdm9pZCB7IH1cbiAgICBTdG9wQkdNKCkgOiB2b2lkIHsgfVxufVxuIiwiaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcbiAgICBwcml2YXRlIF9vbkNsaWNrIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+ID0gbmV3IExpdGVFdmVudDxDYW52YXMsIFBvaW50PigpO1xuICAgIHByaXZhdGUgX29uTW92ZSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiA9IG5ldyBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4oKTtcbiAgICBwcml2YXRlIGN0eCA6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIGVsZW1lbnQgOiBIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklEIDogc3RyaW5nLCBzaXplIDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySUQpO1xuXG4gICAgICAgIGlmIChjb250YWluZXIudGFnTmFtZSA9PT0gXCJjYW52YXNcIikge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gY29udGFpbmVyIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LndpZHRoID0gc2l6ZS5YO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gc2l6ZS5ZO1xuXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLl9jbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5fbW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLkNsZWFyKCk7XG4gICAgfVxuXG4gICAgZ2V0IFNpemUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIHNldCBTaXplKHNpemUgOiBQb2ludCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBzaXplLlg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBzaXplLlk7XG4gICAgfVxuXG4gICAgQ2xlYXIoKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3QmFja2dyb3VuZEltYWdlKGltYWdlIDogSW1hZ2VCaXRtYXApIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3SW1hZ2UoaW1hZ2UgOiBJbWFnZUJpdG1hcCwgcG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltYWdlLCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3SW1hZ2VUbyhpbWFnZSA6IEltYWdlQml0bWFwLCBzb3VyY2UgOiBJUmVjdCwgZGVzdGluYXRpb24gOiBJUmVjdCkge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgIHNvdXJjZS5Qb3NpdGlvbi5YLCBzb3VyY2UuUG9zaXRpb24uWSxcbiAgICAgICAgICAgIHNvdXJjZS5TaXplLlgsIHNvdXJjZS5TaXplLlksXG4gICAgICAgICAgICBkZXN0aW5hdGlvbi5Qb3NpdGlvbi5YLCBkZXN0aW5hdGlvbi5Qb3NpdGlvbi5ZLFxuICAgICAgICAgICAgZGVzdGluYXRpb24uU2l6ZS5YLCBkZXN0aW5hdGlvbi5TaXplLllcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBEcmF3UmVjdChwb3NpdGlvbiA6IFBvaW50LCBzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QocG9zaXRpb24uWCwgcG9zaXRpb24uWSwgc2l6ZS5YLCBzaXplLlkpO1xuICAgIH1cblxuICAgIERyYXdSZWN0MChzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLkRyYXdSZWN0KG5ldyBQb2ludCgpLCBzaXplLCBjb2xvcik7XG4gICAgfVxuXG4gICAgRHJhd1RleHQodGV4dCA6IHN0cmluZywgcG9zaXRpb24gOiBQb2ludCwgY29sb3IgOiBzdHJpbmcsIGZvbnRTaXplIDogbnVtYmVyLCBtYXhXaWR0aD8gOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XG4gICAgICAgIHRoaXMuY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KHRleHQsIHBvc2l0aW9uLlgsIHBvc2l0aW9uLlksIG1heFdpZHRoKTtcbiAgICB9XG5cbiAgICBEcmF3VGV4dDAodGV4dCA6IHN0cmluZywgY29sb3IgOiBzdHJpbmcsIGZvbnRTaXplIDogbnVtYmVyLCBtYXhXaWR0aD8gOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuRHJhd1RleHQodGV4dCwgbmV3IFBvaW50KCksIGNvbG9yLCBmb250U2l6ZSwgbWF4V2lkdGgpO1xuICAgIH1cblxuICAgIEdldEltYWdlRGF0YSgpIDogSW1hZ2VEYXRhIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLlNpemUuWCwgdGhpcy5TaXplLlkpO1xuICAgIH1cblxuICAgIE1lYXN1cmVUZXh0V2lkdGgodGV4dCA6IHN0cmluZykgOiBudW1iZXIge1xuICAgICAgICAvLyBXZSBtZWFzdXJlIHdpdGggdGhlIGxhc3QgZm9udCB1c2VkIGluIHRoZSBjb250ZXh0XG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgICB9XG5cbiAgICBSZXN0b3JlKCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIFNldEN1cnNvcihjdXJzb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgfVxuXG4gICAgVHJhbnNsYXRlKHBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuUmVzdG9yZSgpO1xuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZKTtcbiAgICB9XG5cbiAgICBnZXQgT25DbGljaygpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uQ2xpY2suRXhwb3NlKCk7XG4gICAgfVxuXG4gICAgZ2V0IE9uTW92ZSgpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uTW92ZS5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbGljayhldiA6IE1vdXNlRXZlbnQpIDogdm9pZCB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuX29uQ2xpY2suVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXG4gICAgICAgICAgICBldi5wYWdlWCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX21vdmUoZXYgOiBNb3VzZUV2ZW50KSA6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbk1vdmUuVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXG4gICAgICAgICAgICBldi5wYWdlWCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEhpZGRlbkNhbnZhcyBleHRlbmRzIENhbnZhcyB7XG4gICAgcHJpdmF0ZSBoaWRkZW5FbGVtZW50IDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzaXplIDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBgY18ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyLCA3KX1gO1xuICAgICAgICBjb25zdCBoaWRkZW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgaGlkZGVuRWxlbWVudC5pZCA9IGlkO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGhpZGRlbkVsZW1lbnQpO1xuXG4gICAgICAgIHN1cGVyKGlkLCBzaXplKTtcblxuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnQgPSBoaWRkZW5FbGVtZW50O1xuICAgIH1cblxuICAgIERlc3Ryb3koKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuXG5jbGFzcyBDbGFzc0NvbmZpZyB7XG4gICAgRGVmYXVsdFRleHRTcGVlZCA6IG51bWJlciA9IDMwO1xuICAgIFJvb3RQYXRoIDogc3RyaW5nID0gXCJcIjtcbiAgICBSb290UGF0aElzUmVtb3RlOiBib29sZWFuID0gZmFsc2U7XG4gICAgU2NyZWVuU2l6ZSA6IFBvaW50ID0gbmV3IFBvaW50KDgwMCwgNjAwKTtcblxuICAgIHByaXZhdGUgdGV4dFNwZWVkIDogbnVtYmVyO1xuICAgIHByaXZhdGUgdGV4dFNwZWVkUmF0aW8gOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5UZXh0U3BlZWQgPSB0aGlzLkRlZmF1bHRUZXh0U3BlZWQ7IC8vIFRoaXMgaXMgaW4gY2hhciBwZXIgc2Vjb25kXG4gICAgfVxuXG4gICAgTG9hZCh0YWdzIDogc3RyaW5nW10pIDogdm9pZCB7XG4gICAgICAgIGZ1bmN0aW9uIGVycm9yKHRhZyA6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyB0YWc6IFwiJHt0YWd9XCJgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGtleSwgdmFsdWU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGtleSA9IHRhZ3NbaV0uc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRhZ3NbaV0uc3BsaXQoXCI6XCIpWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih0YWdzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5fc2l6ZVwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NyZWVuc2l6ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gdmFsdWUuc3BsaXQoL1xcRCsvKS5tYXAoeCA9PiBwYXJzZUludCh4LCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUubGVuZ3RoID09PSAyICYmICFpc05hTihzaXplWzBdKSAmJiAhaXNOYU4oc2l6ZVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNjcmVlblNpemUgPSBuZXcgUG9pbnQoc2l6ZVswXSwgc2l6ZVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZXh0X3NwZWVkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0ZXh0c3BlZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BlZWQgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihzcGVlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkRlZmF1bHRUZXh0U3BlZWQgPSB0aGlzLlRleHRTcGVlZCA9IHNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdF9wYXRoXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290cGF0aFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvb3RQYXRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdF9wYXRoX2lzX3JlbW90ZVwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm9vdHBhdGhpc3JlbW90ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlJvb3RQYXRoSXNSZW1vdGUgPSB2YWx1ZSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcih0YWdzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgVGV4dFNwZWVkKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0U3BlZWQ7XG4gICAgfVxuXG4gICAgc2V0IFRleHRTcGVlZCh2YWx1ZSA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnRleHRTcGVlZCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRleHRTcGVlZFJhdGlvID0gMTAwMC4wIC8gdGhpcy50ZXh0U3BlZWQ7XG4gICAgfVxuXG4gICAgZ2V0IFRleHRTcGVlZFJhdGlvKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0U3BlZWRSYXRpbztcbiAgICB9XG59XG5cbmV4cG9ydCBsZXQgQ29uZmlnID0gbmV3IENsYXNzQ29uZmlnKCk7XG4iLCJleHBvcnQgY2xhc3MgTGl0ZUV2ZW50PFQxLCBUMj4ge1xuICAgIHByaXZhdGUgaGFuZGxlcnMgOiBBcnJheTwoc2VuZGVyIDogVDEsIGFyZz8gOiBUMikgPT4gdm9pZD4gPSBbXTtcblxuICAgIEV4cG9zZSgpIDogTGl0ZUV2ZW50PFQxLCBUMj4ge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBPZmYoaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5maWx0ZXIoX2hhbmRsZXIgPT4gX2hhbmRsZXIgIT09IGhhbmRsZXIpO1xuICAgIH1cblxuICAgIE9uKGhhbmRsZXIgOiAoc2VuZGVyIDogVDEsIGFyZz8gOiBUMikgPT4gdm9pZCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIFRyaWdnZXIoc2VuZGVyIDogVDEsIGFyZ3M/IDogVDIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IGhhbmRsZXIoc2VuZGVyLCBhcmdzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBMYXllciB7XG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kSW1hZ2UgOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIGJhY2tncm91bmRJbWFnZVVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCk7XG4gICAgY29uc3RydWN0b3IoaW1hZ2VVUkw/IDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKGltYWdlVVJMICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuQmFja2dyb3VuZEltYWdlID0gaW1hZ2VVUkw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgQmFja2dyb3VuZEltYWdlKGltYWdlVVJMIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChpbWFnZVVSTCAhPT0gdGhpcy5iYWNrZ3JvdW5kSW1hZ2VVUkwpIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlVVJMID0gaW1hZ2VVUkw7XG4gICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKGltYWdlVVJMKS50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IGltYWdlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZEltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3QmFja2dyb3VuZEltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENhbnZhcywgSGlkZGVuQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xuaW1wb3J0IHsgSVJlY3QsIFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgZW51bSBCb3hCYWNrZ3JvdW5kVHlwZXMge1xuICAgIENPTE9SLCBOSU5FUEFUQ0gsIFNUUkVUQ0hcbn1cblxuY2xhc3MgQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSB7XG4gICAgQ3JlYXRlKHR5cGUgOiBCb3hCYWNrZ3JvdW5kVHlwZXMsIGJhY2tncm91bmQgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIDogQm94QmFja2dyb3VuZCB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuQ09MT1I6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvbG9yZWRCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLk5JTkVQQVRDSDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTmluZVBhdGNoQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5TVFJFVENIOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJldGNoQm94QmFja2dyb3VuZChiYWNrZ3JvdW5kLCBzaXplLCBwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBCb3hCYWNrZ3JvdW5kRmFjdG9yeSA6IENsYXNzQm94QmFja2dyb3VuZEZhY3RvcnkgPSBuZXcgQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSgpO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQm94QmFja2dyb3VuZCBleHRlbmRzIExheWVyIHtcbiAgICBwcm90ZWN0ZWQgYm94IDogSVJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5ib3ggPSB7XG4gICAgICAgICAgICBQb3NpdGlvbiA6IHBvc2l0aW9uID09IG51bGwgPyBuZXcgUG9pbnQoKSA6IHBvc2l0aW9uLFxuICAgICAgICAgICAgU2l6ZSA6IHNpemVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXQgUG9zaXRpb24ocG9zaXRpb24gOiBQb2ludCkge1xuICAgICAgICB0aGlzLmJveC5Qb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH1cblxuICAgIHNldCBTaXplKHNpemUgOiBQb2ludCkge1xuICAgICAgICB0aGlzLmJveC5TaXplID0gc2l6ZTtcbiAgICB9XG59XG5cbmNsYXNzIENvbG9yZWRCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgQ29sb3IgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb2xvciA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5Db2xvciA9IGNvbG9yO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuRHJhd1JlY3QodGhpcy5ib3guUG9zaXRpb24sIHRoaXMuYm94LlNpemUsIHRoaXMuQ29sb3IpO1xuICAgIH1cbn1cblxuY2xhc3MgTmluZVBhdGNoQm94QmFja2dyb3VuZCBleHRlbmRzIEJveEJhY2tncm91bmQge1xuICAgIHByaXZhdGUgbmluZVBhdGNoIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBuaW5lUGF0Y2hVUkwgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuaW5lUGF0Y2hVUkwgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoc2l6ZSwgcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuTmluZVBhdGNoID0gbmluZVBhdGNoVVJMO1xuICAgIH1cblxuICAgIHNldCBOaW5lUGF0Y2gobmluZVBhdGNoVVJMIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChuaW5lUGF0Y2hVUkwgIT09IHRoaXMubmluZVBhdGNoVVJMKSB7XG4gICAgICAgICAgICB0aGlzLm5pbmVQYXRjaFVSTCA9IG5pbmVQYXRjaFVSTDtcblxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShuaW5lUGF0Y2hVUkwpXG4gICAgICAgICAgICAudGhlbihpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGlkZGVuQ2FudmFzID0gbmV3IEhpZGRlbkNhbnZhcyh0aGlzLmJveC5TaXplLkNsb25lKCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoU2l6ZSA9IG5ldyBQb2ludChpbWFnZS53aWR0aCAvIDMsIGltYWdlLmhlaWdodCAvIDMpO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZHJhd1BhdGNoVG8ocGF0Y2hQb3NpdGlvbiA6IFBvaW50LCBkZXN0UG9zIDogUG9pbnQsIGRlc3RTaXplPyA6IFBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbkNhbnZhcy5EcmF3SW1hZ2VUbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLCB7IFBvc2l0aW9uIDogcGF0Y2hQb3NpdGlvbiwgU2l6ZSA6IHBhdGNoU2l6ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IGRlc3RQb3MsIFNpemUgOiBkZXN0U2l6ZSAhPSBudWxsID8gZGVzdFNpemUgOiBwYXRjaFNpemUgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGNoRGVzdGluYXRpb25zID0gW1xuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoKSwgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIHBhdGNoU2l6ZS5YLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KDAsIHRoaXMuYm94LlNpemUuWSAtIHBhdGNoU2l6ZS5ZKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSBwYXRjaFNpemUuWSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKG5ldyBQb2ludCgpLCBwYXRjaERlc3RpbmF0aW9uc1swXSk7IC8vIFVwcGVyIExlZnRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMCkpLCBwYXRjaERlc3RpbmF0aW9uc1sxXSk7IC8vIFVwcGVyIFJpZ2h0XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDAsIDIpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbMl0pOyAvLyBMb3dlciBMZWZ0XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDIsIDIpKSwgcGF0Y2hEZXN0aW5hdGlvbnNbM10pOyAvLyBMb3dlciBSaWdodFxuXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDApKSwgcGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDEsIDApKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIChwYXRjaFNpemUuWCAqIDIpLCBwYXRjaFNpemUuWSkpOyAvLyBUb3BcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMSkpLCBwYXRjaERlc3RpbmF0aW9uc1sxXS5BZGQobmV3IFBvaW50KDAsIHBhdGNoU2l6ZS5ZKSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludChwYXRjaFNpemUuWCwgdGhpcy5ib3guU2l6ZS5ZIC0gKHBhdGNoU2l6ZS5ZICogMikpKTsgLy8gUmlnaHRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1syXS5BZGQobmV3IFBvaW50KHBhdGNoU2l6ZS5YLCAwKSksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCh0aGlzLmJveC5TaXplLlggLSAocGF0Y2hTaXplLlggKiAyKSwgcGF0Y2hTaXplLlkpKTsgLy8gQm90dG9tXG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8ocGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDAsIDEpKSwgcGF0Y2hTaXplLk11bHQobmV3IFBvaW50KDAsIDEpKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSAocGF0Y2hTaXplLlkgKiAyKSkpOyAvLyBMZWZ0XG5cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMSkpLFxuICAgICAgICAgICAgICAgICAgICBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMSkpLCB0aGlzLmJveC5TaXplLlN1YihwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMikpKSk7IC8vIENlbnRlclxuXG4gICAgICAgICAgICAgICAgY3JlYXRlSW1hZ2VCaXRtYXAoaGlkZGVuQ2FudmFzLkdldEltYWdlRGF0YSgpKS50aGVuKG5pbmVQYXRjaEltYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uaW5lUGF0Y2ggPSBuaW5lUGF0Y2hJbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlkZGVuQ2FudmFzLkRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5pbmVQYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHRoaXMubmluZVBhdGNoLCB0aGlzLmJveC5Qb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIFN0cmV0Y2hCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgcHJpdmF0ZSBpbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgaW1hZ2VTaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBpbWFnZVVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGltYWdlVVJMIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uIDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoc2l6ZSwgcG9zaXRpb24pO1xuXG4gICAgICAgIHRoaXMuSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICB9XG5cbiAgICBzZXQgSW1hZ2UoaW1hZ2VVUkwgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGltYWdlVVJMICE9PSB0aGlzLmltYWdlVVJMKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlVVJMID0gaW1hZ2VVUkw7XG5cbiAgICAgICAgICAgIExvYWRlci5Mb2FkSW1hZ2UoaW1hZ2VVUkwpXG4gICAgICAgICAgICAudGhlbihpbWFnZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VTaXplID0gbmV3IFBvaW50KHRoaXMuaW1hZ2Uud2lkdGgsIHRoaXMuaW1hZ2UuaGVpZ2h0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2VUbyhcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLFxuICAgICAgICAgICAgICAgIHsgUG9zaXRpb24gOiBuZXcgUG9pbnQoKSwgU2l6ZSA6IHRoaXMuaW1hZ2VTaXplIH0sXG4gICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IHRoaXMuYm94LlBvc2l0aW9uLCBTaXplIDogdGhpcy5ib3guU2l6ZSB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgTG9hZGVyIH0gZnJvbSBcIi4uL2xvYWRlclwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIExheWVyIHtcbiAgICBwcml2YXRlIGNlbnRlclBvc1ggOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc3ByaXRlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBzcHJpdGVVUkwgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihzcHJpdGVVUkwgOiBzdHJpbmcsIHBvc1ggOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmNlbnRlclBvc1ggPSBwb3NYO1xuICAgICAgICB0aGlzLlNwcml0ZSA9IHNwcml0ZVVSTDtcbiAgICB9XG5cbiAgICBzZXQgU3ByaXRlKHNwcml0ZVVSTCA6IHN0cmluZykge1xuICAgICAgICBpZiAoc3ByaXRlVVJMICE9PSB0aGlzLnNwcml0ZVVSTCkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGVVUkwgPSBzcHJpdGVVUkw7XG4gICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKHNwcml0ZVVSTCkudGhlbihpbWFnZSA9PiB0aGlzLnNwcml0ZSA9IGltYWdlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zcHJpdGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucG9zaXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyUG9zWCAtICh0aGlzLnNwcml0ZS53aWR0aCAvIDIpLFxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuU2l6ZS5ZIC0gdGhpcy5zcHJpdGUuaGVpZ2h0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZSh0aGlzLnNwcml0ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaGFyYWN0ZXJzIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgY2hhcmFjdGVycyA6IENoYXJhY3RlcltdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBBZGQoc3ByaXRlVVJMIDogc3RyaW5nLCBjYW52YXMgOiBDYW52YXMpIHtcbiAgICAgICAgLy8gRm9yIG5vdyBqdXN0IGhhbmRsZSBvbmUgY2hhcmFjdGVyIGF0IGEgdGltZVxuICAgICAgICBpZiAodGhpcy5jaGFyYWN0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLnB1c2gobmV3IENoYXJhY3RlcihzcHJpdGVVUkwsIGNhbnZhcy5TaXplLlggLyAyKSk7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY2hhcmFjdGVyIG9mIHRoaXMuY2hhcmFjdGVycykge1xuICAgICAgICAgICAgY2hhcmFjdGVyLkRyYXcoY2FudmFzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFJlbW92ZSgpIHtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2hvaWNlIH0gZnJvbSBcImlua2pzXCI7XG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IEJveEJhY2tncm91bmQsIEJveEJhY2tncm91bmRGYWN0b3J5LCBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9ib3hiYWNrZ3JvdW5kc1wiO1xuaW1wb3J0IHsgR2FtZXBsYXlMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5jbGFzcyBDaG9pY2VCb3gge1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlciA9IDI0O1xuICAgIHByaXZhdGUgaGFzQWxyZWFkeUJlZW5EcmF3bk9uY2UgOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBpZCA6IG51bWJlcjtcbiAgICBwcml2YXRlIGlubmVyTWFyZ2luIDogUG9pbnQgPSBuZXcgUG9pbnQoMCwgMjApO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIHRleHQgOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihpZCA6IG51bWJlciwgdGV4dCA6IHN0cmluZywgd2lkdGggOiBudW1iZXIsIHBvc2l0aW9uIDogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuXG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBQb2ludCh3aWR0aCwgKHRoaXMuZm9udFNpemUgKiAxLjQyODU3KSArICgyICogdGhpcy5pbm5lck1hcmdpbi5ZKSk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoQm94QmFja2dyb3VuZFR5cGVzLkNPTE9SLCBcInJnYmEoMCwgMCwgMCwgLjcpXCIsIHRoaXMuc2l6ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0IElkKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pZDtcbiAgICB9XG5cbiAgICBnZXQgQm91bmRpbmdSZWN0KCkgOiBJUmVjdCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBQb3NpdGlvbiA6IHRoaXMucG9zaXRpb24sXG4gICAgICAgICAgICBTaXplIDogdGhpcy5zaXplXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBbHJlYWR5QmVlbkRyYXduT25jZSkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVGaXJzdERyYXcoY2FudmFzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZC5EcmF3KGNhbnZhcyk7XG4gICAgICAgIGNhbnZhcy5EcmF3VGV4dCh0aGlzLnRleHQsIHRoaXMucG9zaXRpb24uQWRkKHRoaXMuaW5uZXJNYXJnaW4pLCBcIndoaXRlXCIsIHRoaXMuZm9udFNpemUsIHRoaXMuc2l6ZS5YKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGJlZm9yZUZpcnN0RHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3VGV4dDAoXCJcIiwgXCJ0cmFuc3BhcmVudFwiLCB0aGlzLmZvbnRTaXplKTtcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbi5YID0gKHRoaXMuc2l6ZS5YIC0gY2FudmFzLk1lYXN1cmVUZXh0V2lkdGgodGhpcy50ZXh0KSkgLyAyO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENob2ljZUxheWVyIGV4dGVuZHMgR2FtZXBsYXlMYXllciB7XG4gICAgcHJpdmF0ZSBib3VuZGluZ1JlY3QgOiBQb2ludDtcbiAgICBwcml2YXRlIGNob2ljZUJveGVzIDogQ2hvaWNlQm94W10gPSBbXTtcbiAgICBwcml2YXRlIGNob2ljZXMgOiBDaG9pY2VbXSA9IFtdO1xuICAgIHByaXZhdGUgaXNNb3VzZU9uQ2hvaWNlIDogQ2hvaWNlQm94ID0gbnVsbDtcbiAgICBwcml2YXRlIHNjcmVlblNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIHRyYW5zbGF0aW9uIDogUG9pbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzY3JlZW5TaXplIDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnNjcmVlblNpemUgPSBzY3JlZW5TaXplO1xuICAgIH1cblxuICAgIHNldCBDaG9pY2VzKGNob2ljZXMgOiBDaG9pY2VbXSkge1xuICAgICAgICB0aGlzLmNob2ljZXMgPSBjaG9pY2VzO1xuXG4gICAgICAgIHRoaXMuY2hvaWNlQm94ZXMgPSBbXTtcbiAgICAgICAgY29uc3Qgd2lkdGggPSAyMDA7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IFBvaW50KDAsIDApO1xuICAgICAgICBmb3IgKGNvbnN0IF9jaG9pY2Ugb2YgdGhpcy5jaG9pY2VzKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdDaG9pY2UgPSBuZXcgQ2hvaWNlQm94KF9jaG9pY2UuaW5kZXgsIF9jaG9pY2UudGV4dCwgd2lkdGgsIHBvc2l0aW9uLkNsb25lKCkpO1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VCb3hlcy5wdXNoKG5ld0Nob2ljZSk7XG4gICAgICAgICAgICBwb3NpdGlvbi5ZICs9IG5ld0Nob2ljZS5Cb3VuZGluZ1JlY3QuU2l6ZS5ZICsgNDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib3VuZGluZ1JlY3QgPSBuZXcgUG9pbnQod2lkdGgsIHBvc2l0aW9uLlkgLSA0MCk7XG4gICAgICAgIHRoaXMudHJhbnNsYXRpb24gPSB0aGlzLnNjcmVlblNpemUuRGl2KG5ldyBQb2ludCgyKSkuU3ViKHRoaXMuYm91bmRpbmdSZWN0LkRpdihuZXcgUG9pbnQoMikpKTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnRyYW5zbGF0aW9uKTtcbiAgICAgICAgZm9yIChjb25zdCBjaG9pY2VCb3ggb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgY2hvaWNlQm94LkRyYXcoY2FudmFzKTtcbiAgICAgICAgfVxuICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xuICAgIH1cblxuICAgIE1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiA6IFBvaW50LCBhY3Rpb24gOiBGdW5jdGlvbikgOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBjaG9pY2VCb3ggb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gY2hvaWNlQm94LkJvdW5kaW5nUmVjdDtcbiAgICAgICAgICAgIGJvdW5kaW5nUmVjdC5Qb3NpdGlvbiA9IGJvdW5kaW5nUmVjdC5Qb3NpdGlvbi5BZGQodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgICAgICBpZiAoY2xpY2tQb3NpdGlvbi5Jc0luUmVjdChib3VuZGluZ1JlY3QpKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uKGNob2ljZUJveC5JZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNb3VzZU1vdmUobW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IChfIDogQ2FudmFzKSA9PiB2b2lkIHtcbiAgICAgICAgbW91c2VQb3NpdGlvbiA9IG1vdXNlUG9zaXRpb24uU3ViKHRoaXMudHJhbnNsYXRpb24pO1xuICAgICAgICBpZiAodGhpcy5pc01vdXNlT25DaG9pY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vdXNlUG9zaXRpb24uSXNJblJlY3QodGhpcy5pc01vdXNlT25DaG9pY2UuQm91bmRpbmdSZWN0KSA/IG51bGwgOiAoY2FudmFzIDogQ2FudmFzKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FudmFzLlNldEN1cnNvcihcImRlZmF1bHRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hvaWNlIG9mIHRoaXMuY2hvaWNlQm94ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAobW91c2VQb3NpdGlvbi5Jc0luUmVjdChjaG9pY2UuQm91bmRpbmdSZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNhbnZhcyA6IENhbnZhcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc01vdXNlT25DaG9pY2UgPSBjaG9pY2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW52YXMuU2V0Q3Vyc29yKFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHsgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExheWVyIHtcbiAgICBhYnN0cmFjdCBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RlcExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICAgIGFic3RyYWN0IFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZDtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdhbWVwbGF5TGF5ZXIgZXh0ZW5kcyBTdGVwTGF5ZXIge1xuICAgIGFic3RyYWN0IE1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiA6IFBvaW50LCBhY3Rpb24gOiBGdW5jdGlvbikgOiB2b2lkO1xuICAgIGFic3RyYWN0IE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCAqIGZyb20gXCIuL2JhY2tncm91bmRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2NoYXJhY3RlcnNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2Nob2ljZWxheWVyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9zcGVlY2hsYXllclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdHJhbnNpdGlvblwiO1xuIiwiaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4uL2NhbnZhc1wiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IEJveEJhY2tncm91bmQsIEJveEJhY2tncm91bmRGYWN0b3J5LCBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9ib3hiYWNrZ3JvdW5kc1wiO1xuaW1wb3J0IHsgR2FtZXBsYXlMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5cbmludGVyZmFjZSBJQm94Q29uZmlndXJhdGlvbiB7XG4gICAgQmFja2dyb3VuZCA6IHN0cmluZztcbiAgICBCYWNrZ3JvdW5kVHlwZSA6IEJveEJhY2tncm91bmRUeXBlcztcbiAgICBGb250Q29sb3IgOiBzdHJpbmc7XG4gICAgRm9udFNpemUgOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNwZWVjaEJveENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBJQm94Q29uZmlndXJhdGlvbiB7XG4gICAgSGVpZ2h0IDogbnVtYmVyO1xuICAgIElubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgT3V0ZXJNYXJnaW4gOiBQb2ludDtcbn1cblxuaW50ZXJmYWNlIElOYW1lQm94Q29uZmlndXJhdGlvbiBleHRlbmRzIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBIZWlnaHQgOiBudW1iZXI7XG4gICAgV2lkdGggOiBudW1iZXI7XG59XG5cbmNvbnN0IFJFV1JBUF9USElTX0xJTkUgPSBcIjxbe1JFV1JBUF9USElTX0xJTkV9XT5cIjtcblxuY2xhc3MgU3BlZWNoQm94IHtcbiAgICBwcml2YXRlIGJveEJhY2tncm91bmQgOiBCb3hCYWNrZ3JvdW5kO1xuICAgIHByaXZhdGUgZm9udENvbG9yIDogc3RyaW5nO1xuICAgIHByaXZhdGUgZm9udFNpemUgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50O1xuICAgIHByaXZhdGUgaW5uZXJTaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBuZXh0V29yZCA6IHN0cmluZztcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBzaXplIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSB0ZXh0TGluZXMgOiBbc3RyaW5nXSA9IFtcIlwiXTtcblxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uIDogUG9pbnQsIHNpemUgOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElTcGVlY2hCb3hDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbi5DbG9uZSgpO1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplLkNsb25lKCk7XG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4gPSBjb25maWd1cmF0aW9uLklubmVyTWFyZ2luO1xuICAgICAgICB0aGlzLmlubmVyU2l6ZSA9IHRoaXMuc2l6ZS5TdWIodGhpcy5pbm5lck1hcmdpbi5NdWx0KG5ldyBQb2ludCgyKSkpO1xuXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsIGNvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcbiAgICAgICAgICAgIHRoaXMuc2l6ZS5DbG9uZSgpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGNvbmZpZ3VyYXRpb24uRm9udFNpemU7XG4gICAgICAgIHRoaXMuZm9udENvbG9yID0gY29uZmlndXJhdGlvbi5Gb250Q29sb3I7XG4gICAgfVxuXG4gICAgZ2V0IFRleHQoKSA6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRMaW5lcy5qb2luKFwiIFwiKTtcbiAgICB9XG5cbiAgICBzZXQgVGV4dCh0ZXh0IDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IF90ZXh0ID0gdGhpcy5UZXh0O1xuICAgICAgICBpZiAodGV4dC5pbmRleE9mKF90ZXh0KSA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2xpY2UgPSB0ZXh0LnNsaWNlKF90ZXh0Lmxlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXSArPSBzbGljZTtcbiAgICAgICAgICAgIGlmIChzbGljZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0V29yZCA9IFJFV1JBUF9USElTX0xJTkU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRleHRMaW5lcyA9IFt0ZXh0XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBOZXh0V29yZChuZXh0V29yZCA6IHN0cmluZykge1xuICAgICAgICB0aGlzLm5leHRXb3JkID0gbmV4dFdvcmQ7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kLkRyYXcoY2FudmFzKTtcblxuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24uQWRkKHRoaXMuaW5uZXJNYXJnaW4pKTtcblxuICAgICAgICBpZiAodGhpcy5uZXh0V29yZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmRvVGhlV3JhcChjYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5uZXh0V29yZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGV4dExpbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd1RleHQoXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbaV0sXG4gICAgICAgICAgICAgICAgbmV3IFBvaW50KDAsIGkgKiAodGhpcy5mb250U2l6ZSAqIDEuNDI4NTcpKSwgLy8gVGhpcyBpcyB0aGUgZ29sZGVuIHJhdGlvLCBvbiBsaW5lLWhlaWdodCBhbmQgZm9udC1zaXplXG4gICAgICAgICAgICAgICAgdGhpcy5mb250Q29sb3IsXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZSxcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyU2l6ZS5YXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLlJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRvVGhlV3JhcChjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3VGV4dDAoXCJcIiwgXCJ0cmFuc3BhcmVudFwiLCB0aGlzLmZvbnRTaXplKTtcbiAgICAgICAgY29uc3QgY29tcCA9IChsaW5lIDogc3RyaW5nKSA9PiBjYW52YXMuTWVhc3VyZVRleHRXaWR0aChsaW5lKSA+IHRoaXMuaW5uZXJTaXplLlg7XG5cbiAgICAgICAgbGV0IGxhc3RMaW5lID0gdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgaWYgKHRoaXMubmV4dFdvcmQgPT09IFJFV1JBUF9USElTX0xJTkUpIHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gd3JhcCB0aGUgZnVjayBvdXQgb2YgdGhpcyBsaW5lXG4gICAgICAgICAgICB3aGlsZSAoY29tcChsYXN0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgdG8gdGhlIGNoYXIgd2hlcmUgd2UncmUgb3V0c2lkZSB0aGUgYm91ZGFyaWVzXG4gICAgICAgICAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlICghY29tcChsYXN0TGluZS5zbGljZSgwLCBuKSkpIHsgKytuOyB9XG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBwcmV2aW91cyBzcGFjZVxuICAgICAgICAgICAgICAgIHdoaWxlIChsYXN0TGluZVtuXSAhPT0gXCIgXCIgJiYgbiA+PSAwKSB7IC0tbjsgfVxuICAgICAgICAgICAgICAgIGlmIChuID09PSAwKSB7IGJyZWFrOyB9IC8vIFdlIGNhbid0IHdyYXAgbW9yZVxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCwgdXBkYXRlIGxhc3QgbGluZSwgYW5kIGJhY2sgaW4gdGhlIGxvb3BcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lcy5wdXNoKGxhc3RMaW5lLnNsaWNlKG4gKyAxKSk7IC8vICsxIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0aGUgc3BhY2VcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAyXSA9IGxhc3RMaW5lLnNsaWNlKDAsIG4pO1xuICAgICAgICAgICAgICAgIGxhc3RMaW5lID0gdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY29tcChsYXN0TGluZSArIHRoaXMubmV4dFdvcmQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGluZXNbdGhpcy50ZXh0TGluZXMubGVuZ3RoIC0gMV0gPSBsYXN0TGluZS5zbGljZSgwLCBsYXN0TGluZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lcy5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBOYW1lQm94IHtcbiAgICBwcml2YXRlIGJhY2tncm91bmRVUkwgOiBzdHJpbmcgPSBcImltYWdlcy85cGF0Y2gtc21hbGwucG5nXCI7XG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGZvbnRDb2xvciA6IHN0cmluZztcbiAgICBwcml2YXRlIGZvbnRTaXplIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludDtcbiAgICBwcml2YXRlIG5hbWUgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElOYW1lQm94Q29uZmlndXJhdGlvbik7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgY29uZmlndXJhdGlvbiA6IElOYW1lQm94Q29uZmlndXJhdGlvbiwgbmFtZT8gOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KGNvbmZpZ3VyYXRpb24uV2lkdGgsIGNvbmZpZ3VyYXRpb24uSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uLkNsb25lKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24uWSAtPSB0aGlzLnNpemUuWTtcblxuICAgICAgICB0aGlzLmlubmVyTWFyZ2luID0gdGhpcy5zaXplLkRpdihuZXcgUG9pbnQoMTAsIDEwKSk7XG5cbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IGNvbmZpZ3VyYXRpb24uRm9udFNpemU7XG4gICAgICAgIHRoaXMuZm9udENvbG9yID0gY29uZmlndXJhdGlvbi5Gb250Q29sb3I7XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKFxuICAgICAgICAgICAgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSwgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgdGhpcy5zaXplLkNsb25lKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzZXQgTmFtZShuYW1lIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChuYW1lICE9PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMucG9zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kLkRyYXcoY2FudmFzKTtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3VGV4dCh0aGlzLm5hbWUsIHRoaXMuaW5uZXJNYXJnaW4sIHRoaXMuZm9udENvbG9yLCB0aGlzLmZvbnRTaXplLCB0aGlzLnNpemUuWCk7XG4gICAgICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3BlZWNoTGF5ZXIgZXh0ZW5kcyBHYW1lcGxheUxheWVyIHtcbiAgICBwcml2YXRlIGZ1bGxUZXh0IDogc3RyaW5nO1xuICAgIHByaXZhdGUgbmFtZUJveCA6IE5hbWVCb3g7XG4gICAgcHJpdmF0ZSB0ZXh0QXBwZWFyZWQgOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB0ZXh0Qm94IDogU3BlZWNoQm94O1xuICAgIHByaXZhdGUgdGV4dFRpbWUgOiBudW1iZXIgPSAwO1xuXG4gICAgY29uc3RydWN0b3Ioc2NyZWVuU2l6ZSA6IFBvaW50LCBzcGVlY2hCb3hDb25maWd1cmF0aW9uIDogSVNwZWVjaEJveENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCB0ZXh0Qm94U2l6ZSA9IG5ldyBQb2ludChcbiAgICAgICAgICAgIHNjcmVlblNpemUuWCAtIChzcGVlY2hCb3hDb25maWd1cmF0aW9uLk91dGVyTWFyZ2luLlggKiAyKSxcbiAgICAgICAgICAgIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uSGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHRleHRCb3hQb3NpdGlvbiA9IG5ldyBQb2ludChcbiAgICAgICAgICAgIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWCxcbiAgICAgICAgICAgIHNjcmVlblNpemUuWSAtIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWSAtIHNwZWVjaEJveENvbmZpZ3VyYXRpb24uSGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudGV4dEJveCA9IG5ldyBTcGVlY2hCb3godGV4dEJveFBvc2l0aW9uLCB0ZXh0Qm94U2l6ZSwgc3BlZWNoQm94Q29uZmlndXJhdGlvbik7XG5cbiAgICAgICAgdGhpcy5uYW1lQm94ID0gbmV3IE5hbWVCb3goXG4gICAgICAgICAgICB0ZXh0Qm94UG9zaXRpb24uQWRkKG5ldyBQb2ludCg3MCwgMCkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkJhY2tncm91bmQsXG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZFR5cGUgOiBzcGVlY2hCb3hDb25maWd1cmF0aW9uLkJhY2tncm91bmRUeXBlLFxuICAgICAgICAgICAgICAgIEZvbnRDb2xvciA6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICBGb250U2l6ZSA6IDI0LFxuICAgICAgICAgICAgICAgIEhlaWdodCA6IDQwLFxuICAgICAgICAgICAgICAgIFdpZHRoIDogMTAwXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEJveC5EcmF3KGNhbnZhcyk7XG4gICAgICAgIHRoaXMubmFtZUJveC5EcmF3KGNhbnZhcyk7XG4gICAgfVxuXG4gICAgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50ZXh0QXBwZWFyZWQpIHtcbiAgICAgICAgICAgIGFjdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ZXh0Qm94LlRleHQgPSB0aGlzLmZ1bGxUZXh0O1xuICAgICAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIFNheSh0ZXh0IDogc3RyaW5nLCBuYW1lIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRCb3guVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMuZnVsbFRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubmFtZUJveC5OYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRleHRUaW1lICs9IGRlbHRhO1xuXG4gICAgICAgIHdoaWxlICh0aGlzLnRleHRUaW1lID49IENvbmZpZy5UZXh0U3BlZWRSYXRpbykge1xuICAgICAgICAgICAgaWYgKHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCA8IHRoaXMuZnVsbFRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMuZnVsbFRleHQuc2xpY2UodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoLCB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRCb3guVGV4dCArPSBjO1xuICAgICAgICAgICAgICAgIGlmIChjID09PSBcIiBcIiAmJiB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAyIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG4gPSB0aGlzLnRleHRCb3guVGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmZ1bGxUZXh0W25dID09PSBcIiBcIiAmJiBuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHsgKytuOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmZ1bGxUZXh0W25dICE9PSBcIiBcIiAmJiBuIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHsgKytuOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0Qm94Lk5leHRXb3JkID0gdGhpcy5mdWxsVGV4dC5zbGljZSh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGggKyAxLCBuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEFwcGVhcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50ZXh0VGltZSA9IHRoaXMudGV4dFRpbWUgLSBDb25maWcuVGV4dFNwZWVkUmF0aW87XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMaXRlRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgU3RlcExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uIGV4dGVuZHMgU3RlcExheWVyIHtcbiAgICBwcml2YXRlIF9vbkVuZCA6IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPiA9IG5ldyBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4oKTtcblxuICAgIHByaXZhdGUgYiA6IG51bWJlcjtcbiAgICBwcml2YXRlIGltYWdlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSB0aW1lIDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIHRvdGFsVGltZSA6IG51bWJlciA9IDIwMDAuMDtcblxuICAgIGNvbnN0cnVjdG9yKGltYWdlRGF0YSA6IEltYWdlRGF0YSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8vIHNpbiBlcXVhdGlvbjogeSA9IGEqc2luKGIqeCArIGMpICsgZFxuICAgICAgICAvLyBhIHNpbiBwZXJpb2QgaXMgMlBJIC8gYlxuICAgICAgICAvLyB3ZSB3YW50IGEgaGFsZiBwZXJpb2Qgb2YgdG90YWxUaW1lIHNvIHdlJ3JlIGxvb2tpbmcgZm9yIGI6IGIgPSAyUEkgLyBwZXJpb2RcbiAgICAgICAgdGhpcy5iID0gKE1hdGguUEkgKiAyKSAvICh0aGlzLnRvdGFsVGltZSAqIDIpO1xuXG4gICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGltYWdlRGF0YSkudGhlbihpbWFnZSA9PiB0aGlzLmltYWdlID0gaW1hZ2UpO1xuICAgIH1cblxuICAgIGdldCBPbkVuZCgpIDogTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uRW5kLkV4cG9zZSgpO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbWFnZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjYW52YXMuRHJhd0JhY2tncm91bmRJbWFnZSh0aGlzLmltYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbnZhcy5EcmF3UmVjdChuZXcgUG9pbnQoKSwgY2FudmFzLlNpemUsIGByZ2JhKDAuMCwgMC4wLCAwLjAsICR7TWF0aC5zaW4odGhpcy5iICogdGhpcy50aW1lKX0pYCk7XG4gICAgfVxuXG4gICAgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50aW1lICs9IGRlbHRhO1xuXG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwgJiYgdGhpcy50aW1lID49IHRoaXMudG90YWxUaW1lIC8gMikge1xuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aW1lID49IHRoaXMudG90YWxUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9vbkVuZC5UcmlnZ2VyKHRoaXMsIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5cbmNsYXNzIENsYXNzTG9hZGVyIHtcbiAgICBMb2FkSW1hZ2UoVVJMIDogc3RyaW5nKSA6IFByb21pc2U8SW1hZ2VCaXRtYXA+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlIDogRnVuY3Rpb24sIHJlamVjdCA6IEZ1bmN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3b3JrZXIgOiBXb3JrZXIgPSB0aGlzLmNyZWF0ZVdvcmtlcigpO1xuXG4gICAgICAgICAgICB3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2dCA6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldnQuZGF0YS5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShldnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdvcmtlci50ZXJtaW5hdGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3b3JrZXIucG9zdE1lc3NhZ2UoQ29uZmlnLlJvb3RQYXRoSXNSZW1vdGUgP1xuICAgICAgICAgICAgICAgIGBodHRwczovLyR7Q29uZmlnLlJvb3RQYXRoID8gQ29uZmlnLlJvb3RQYXRoICsgXCIvXCIgOiBcIlwifSR7VVJMfWBcbiAgICAgICAgICAgICAgICA6IGAke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke3dpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoL1teXFxcXFxcL10qJC8sIFwiXCIpfSR7VVJMfWApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVdvcmtlcigpIDogV29ya2VyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXb3JrZXIoVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbYChmdW5jdGlvbiAke3RoaXMud29ya2VyfSkoKWBdKSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgd29ya2VyKCkge1xuICAgICAgICBjb25zdCBjdHggOiBXb3JrZXIgPSBzZWxmIGFzIGFueTtcbiAgICAgICAgY3R4LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldnQgOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGZldGNoKGV2dC5kYXRhKS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmJsb2IoKSkudGhlbihibG9iRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYkRhdGEpLnRoZW4oaW1hZ2UgPT4gY3R4LnBvc3RNZXNzYWdlKGltYWdlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgTG9hZGVyID0gbmV3IENsYXNzTG9hZGVyKCk7XG4iLCJpbXBvcnQgKiBhcyBJbmtKcyBmcm9tIFwiaW5ranNcIjtcbmltcG9ydCB7IEF1ZGlvLCBBdWRpb0ZhY3RvcnkgfSBmcm9tIFwiLi9hdWRpb1wiO1xuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSBcIi4vY2FudmFzXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2xheWVycy9ib3hiYWNrZ3JvdW5kc1wiO1xuaW1wb3J0ICogYXMgTGF5ZXJzIGZyb20gXCIuL2xheWVycy9sYXllcnNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vcG9pbnRcIjtcbmltcG9ydCB7IFByZWxvYWRlciB9IGZyb20gXCIuL3ByZWxvYWRlclwiO1xuXG5leHBvcnQgY2xhc3MgVk4ge1xuICAgIEF1ZGlvIDogQXVkaW87XG4gICAgQ2FudmFzIDogQ2FudmFzO1xuICAgIFN0b3J5IDogSW5rSnMuU3Rvcnk7XG5cbiAgICBwcml2YXRlIGJhY2tncm91bmQgOiBMYXllcnMuQmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGNoYXJhY3RlcnMgOiBMYXllcnMuQ2hhcmFjdGVycztcbiAgICBwcml2YXRlIGNob2ljZVNjcmVlbiA6IExheWVycy5DaG9pY2VMYXllcjtcbiAgICBwcml2YXRlIGN1cnJlbnRTY3JlZW4gOiBMYXllcnMuR2FtZXBsYXlMYXllcjtcbiAgICBwcml2YXRlIHByZXZpb3VzVGltZXN0YW1wIDogbnVtYmVyO1xuICAgIHByaXZhdGUgc3BlYWtpbmdDaGFyYWN0ZXJOYW1lIDogc3RyaW5nID0gXCJcIjtcbiAgICBwcml2YXRlIHNwZWVjaFNjcmVlbiA6IExheWVycy5TcGVlY2hMYXllcjtcbiAgICBwcml2YXRlIHRyYW5zaXRpb24gOiBMYXllcnMuVHJhbnNpdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHN0b3J5RmlsZW5hbWVPck9iamVjdCA6IHN0cmluZyB8IG9iamVjdCwgY29udGFpbmVySUQgOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5BdWRpbyA9IEF1ZGlvRmFjdG9yeS5DcmVhdGUoKTtcbiAgICAgICAgdGhpcy5DYW52YXMgPSBuZXcgQ2FudmFzKGNvbnRhaW5lcklELCBDb25maWcuU2NyZWVuU2l6ZSk7XG5cbiAgICAgICAgY29uc3QgaW5pdFN0b3J5ID0gKHJhd1N0b3J5IDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLlN0b3J5ID0gbmV3IElua0pzLlN0b3J5KHJhd1N0b3J5KTtcbiAgICAgICAgICAgIENvbmZpZy5Mb2FkKHRoaXMuU3RvcnkuZ2xvYmFsVGFncyB8fCBbXSk7XG4gICAgICAgICAgICB0aGlzLkNhbnZhcy5TaXplID0gQ29uZmlnLlNjcmVlblNpemU7XG5cbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IG5ldyBMYXllcnMuQmFja2dyb3VuZCgpO1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gbmV3IExheWVycy5DaGFyYWN0ZXJzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3BlZWNoU2NyZWVuID0gbmV3IExheWVycy5TcGVlY2hMYXllcih0aGlzLkNhbnZhcy5TaXplLCB7XG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZCA6IFwicmdiYSgwLjAsIDAuMCwgMC4wLCAwLjc1KVwiLFxuICAgICAgICAgICAgICAgIEJhY2tncm91bmRUeXBlIDogQm94QmFja2dyb3VuZFR5cGVzLkNPTE9SLFxuICAgICAgICAgICAgICAgIEZvbnRDb2xvciA6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICBGb250U2l6ZSA6IDI0LFxuICAgICAgICAgICAgICAgIEhlaWdodCA6IDIwMCxcbiAgICAgICAgICAgICAgICBJbm5lck1hcmdpbiA6IG5ldyBQb2ludCgzNSksXG4gICAgICAgICAgICAgICAgT3V0ZXJNYXJnaW4gOiBuZXcgUG9pbnQoNTApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlU2NyZWVuID0gbmV3IExheWVycy5DaG9pY2VMYXllcih0aGlzLkNhbnZhcy5TaXplKTtcblxuICAgICAgICAgICAgdGhpcy5DYW52YXMuT25DbGljay5Pbih0aGlzLm1vdXNlQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLkNhbnZhcy5Pbk1vdmUuT24odGhpcy5tb3VzZU1vdmUuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGludWUoKTtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNUaW1lc3RhbXAgPSAwO1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0U3RlcCgpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHN0b3J5RmlsZW5hbWVPck9iamVjdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZmV0Y2goc3RvcnlGaWxlbmFtZU9yT2JqZWN0KS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLnRleHQoKSkudGhlbihpbml0U3RvcnkpO1xuICAgICAgICB9IGVsc2UgeyBpbml0U3RvcnkoSlNPTi5zdHJpbmdpZnkoc3RvcnlGaWxlbmFtZU9yT2JqZWN0KSk7IH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbXB1dGVUYWdzKCkgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ2V0RmluYWxWYWx1ZSA9ICh2YWx1ZSA6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVNYXRjaCA9IHZhbHVlLm1hdGNoKC9eXFx7KFxcdyspXFx9JC8pO1xuICAgICAgICAgICAgaWYgKHZhbHVlTWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLlN0b3J5LnZhcmlhYmxlc1N0YXRlLiQodmFsdWVNYXRjaFsxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMuU3RvcnkuY3VycmVudFRhZ3M7XG4gICAgICAgIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gdGFnc1tpXS5tYXRjaCgvXihcXHcrKVxccyo6XFxzKiguKikkLyk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBrbm93IHdoYXQgdGFnIGl0IGlzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA6IHN0cmluZyA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA6IHN0cmluZyA9IGdldEZpbmFsVmFsdWUobWF0Y2hbMl0pO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInByZWxvYWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNwbGl0KFwiLFwiKS5mb3JFYWNoKF92YWx1ZSA9PiBQcmVsb2FkZXIuUHJlbG9hZChfdmFsdWUudHJpbSgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLkJhY2tncm91bmRJbWFnZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNwcml0ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkFkZCh2YWx1ZSwgdGhpcy5DYW52YXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5SZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiZ21cIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheUJHTSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5TdG9wQkdNKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNmeFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5BdWRpby5QbGF5U0ZYKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2l0aW9uXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBuZXcgTGF5ZXJzLlRyYW5zaXRpb24odGhpcy5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5PbkVuZC5Pbigoc2VuZGVyLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVua25vd24gdGFncyBhcmUgdHJlYXRlZCBhcyBuYW1lc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWFraW5nQ2hhcmFjdGVyTmFtZSA9IGdldEZpbmFsVmFsdWUodGFnc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb250aW51ZSgpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICBpZiAodGhpcy5TdG9yeS5jYW5Db250aW51ZSkge1xuICAgICAgICAgICAgdGhpcy5TdG9yeS5Db250aW51ZSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5TdG9yeS5jdXJyZW50VGV4dC5yZXBsYWNlKC9cXHMvZywgXCJcIikubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbi5TYXkodGhpcy5TdG9yeS5jdXJyZW50VGV4dCwgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IHRoaXMuc3BlZWNoU2NyZWVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuU3RvcnkuY3VycmVudENob2ljZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlVGFncygpO1xuICAgICAgICAgICAgdGhpcy5jaG9pY2VTY3JlZW4uQ2hvaWNlcyA9IHRoaXMuU3RvcnkuY3VycmVudENob2ljZXM7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLmNob2ljZVNjcmVlbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRPRE8gSXQncyB0aGUgZW5kXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlQ2xpY2soc2VuZGVyIDogQ2FudmFzLCBjbGlja1Bvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbiBpbnN0YW5jZW9mIExheWVycy5DaG9pY2VMYXllcikge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuLk1vdXNlQ2xpY2soY2xpY2tQb3NpdGlvbiwgdGhpcy52YWxpZGF0ZUNob2ljZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sICgpID0+IHRoaXMuY29udGludWUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG1vdXNlTW92ZShzZW5kZXIgOiBDYW52YXMsIG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmN1cnJlbnRTY3JlZW4uTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24pO1xuICAgICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FsbGJhY2soc2VuZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdFN0ZXAoKSA6IHZvaWQge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuc3RlcC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0ZXAodGltZXN0YW1wIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNUaW1lc3RhbXA7XG4gICAgICAgIHRoaXMucHJldmlvdXNUaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG5cbiAgICAgICAgdGhpcy5DYW52YXMuQ2xlYXIoKTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5TdGVwKGRlbHRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzLkRyYXcodGhpcy5DYW52YXMpO1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbGlkYXRlQ2hvaWNlKGNob2ljZUluZGV4IDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLlN0b3J5LkNob29zZUNob2ljZUluZGV4KGNob2ljZUluZGV4KTtcbiAgICAgICAgdGhpcy5jb250aW51ZSgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgSVJlY3Qge1xuICAgIFBvc2l0aW9uIDogUG9pbnQ7XG4gICAgU2l6ZSA6IFBvaW50O1xufVxuXG5leHBvcnQgY2xhc3MgUG9pbnQge1xuICAgIHByaXZhdGUgeCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHkgOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpO1xuICAgIGNvbnN0cnVjdG9yKHggOiBudW1iZXIpO1xuICAgIGNvbnN0cnVjdG9yKHggOiBudW1iZXIsIHkgOiBudW1iZXIpO1xuICAgIGNvbnN0cnVjdG9yKHg/IDogbnVtYmVyLCB5PyA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4ICE9IG51bGwgPyB4IDogMDtcbiAgICAgICAgdGhpcy55ID0geSAhPSBudWxsID8geSA6IHggIT0gbnVsbCA/IHggOiAwO1xuICAgIH1cblxuICAgIGdldCBYKCkgOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54O1xuICAgIH1cblxuICAgIHNldCBYKHggOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICB9XG5cbiAgICBnZXQgWSgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcbiAgICB9XG5cbiAgICBzZXQgWSh5IDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgQWRkKHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCArIHBvaW50LlgsIHRoaXMuWSArIHBvaW50LlkpO1xuICAgIH1cblxuICAgIENsb25lKCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YLCB0aGlzLlkpO1xuICAgIH1cblxuICAgIERpdihwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlggLyBwb2ludC5YLCB0aGlzLlkgLyBwb2ludC5ZKTtcbiAgICB9XG5cbiAgICBJc0luUmVjdChyZWN0IDogSVJlY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuWCA+PSByZWN0LlBvc2l0aW9uLlggJiYgdGhpcy5YIDw9IHJlY3QuUG9zaXRpb24uQWRkKHJlY3QuU2l6ZSkuWFxuICAgICAgICAgICAgJiYgdGhpcy5ZID49IHJlY3QuUG9zaXRpb24uWSAmJiB0aGlzLlkgPD0gcmVjdC5Qb3NpdGlvbi5BZGQocmVjdC5TaXplKS5ZO1xuICAgIH1cblxuICAgIE11bHQocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YICogcG9pbnQuWCwgdGhpcy5ZICogcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgU3ViKHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5BZGQobmV3IFBvaW50KC1wb2ludC5YLCAtcG9pbnQuWSkpO1xuICAgIH1cbn1cbiIsImNsYXNzIENsYXNzUHJlbG9hZGVyIHtcbiAgICBQcmVsb2FkKHVybCA6IHN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgZmV0Y2godXJsKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBQcmVsb2FkZXIgPSBuZXcgQ2xhc3NQcmVsb2FkZXIoKTtcbiJdfQ==
