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
            console.log("TAG:", tags[i]);
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
                    console.log("Failed", evt);
                    reject();
                }
                else {
                    console.log("Fetched", evt);
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
    constructor(storyFilename, containerID) {
        this.speakingCharacterName = "";
        this.Audio = audio_1.AudioFactory.Create();
        this.Canvas = new canvas_1.Canvas(containerID, config_1.Config.ScreenSize);
        fetch(storyFilename).then(response => response.text()).then(rawStory => {
            console.log("Loaded json", rawStory);
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
        });
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
                console.log("match tag", tags[i], match);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXVkaW8udHMiLCJzcmMvY2FudmFzLnRzIiwic3JjL2NvbmZpZy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvbGF5ZXJzL2JhY2tncm91bmQudHMiLCJzcmMvbGF5ZXJzL2JveGJhY2tncm91bmRzLnRzIiwic3JjL2xheWVycy9jaGFyYWN0ZXJzLnRzIiwic3JjL2xheWVycy9jaG9pY2VsYXllci50cyIsInNyYy9sYXllcnMvbGF5ZXJzLnRzIiwic3JjL2xheWVycy9zcGVlY2hsYXllci50cyIsInNyYy9sYXllcnMvdHJhbnNpdGlvbi50cyIsInNyYy9sb2FkZXIudHMiLCJzcmMvbWFpbi50cyIsInNyYy9wb2ludC50cyIsInNyYy9wcmVsb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsdUNBQXVDO0FBRXZDLE1BQWEsWUFBWTtJQUNyQixNQUFNLENBQUMsTUFBTTtRQUNULElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLElBQUksY0FBYyxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNILE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Q0FDSjtBQVJELG9DQVFDO0FBRUQsTUFBc0IsS0FBSztDQUkxQjtBQUpELHNCQUlDO0FBRUQsTUFBTSxjQUFlLFNBQVEsS0FBSztJQUk5QixPQUFPLENBQUMsTUFBZTtRQUNuQixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDNUIsT0FBTyxFQUFHO29CQUNOLElBQUksRUFBRyxJQUFJO29CQUNYLElBQUksRUFBRyxNQUFNO2lCQUNoQjtnQkFDRCxNQUFNLEVBQUcsTUFBTTthQUNsQixFQUFFLEdB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ekQsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2VBQ3JFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBYTtRQUNkLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFwREQsc0JBb0RDOzs7Ozs7QUN6REQsTUFBTSxjQUFjO0lBQ2hCLE9BQU8sQ0FBQyxHQUFZO1FBQ2hCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7Q0FDSjtBQUVZLFFBQUEsU0FBUyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgKiBhcyBQaXp6aWNhdG8gZnJvbSBcInBpenppY2F0b1wiO1xuXG5leHBvcnQgY2xhc3MgQXVkaW9GYWN0b3J5IHtcbiAgICBzdGF0aWMgQ3JlYXRlKCkgOiBBdWRpbyB7XG4gICAgICAgIGlmIChQaXp6aWNhdG8gIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQaXp6aWNhdG9BdWRpbygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEdW1teUF1ZGlvKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBdWRpbyB7XG4gICAgYWJzdHJhY3QgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZDtcbiAgICBhYnN0cmFjdCBQbGF5U0ZYKHNmeFVSTCA6IHN0cmluZykgOiB2b2lkO1xuICAgIGFic3RyYWN0IFN0b3BCR00oKSA6IHZvaWQ7XG59XG5cbmNsYXNzIFBpenppY2F0b0F1ZGlvIGV4dGVuZHMgQXVkaW8ge1xuICAgIHByaXZhdGUgYmdtIDogUGl6emljYXRvLlNvdW5kO1xuICAgIHByaXZhdGUgYmdtVVJMIDogc3RyaW5nO1xuXG4gICAgUGxheUJHTShiZ21VUkwgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGlmIChiZ21VUkwgIT09IHRoaXMuYmdtVVJMKSB7XG4gICAgICAgICAgICB0aGlzLmJnbVVSTCA9IGJnbVVSTDtcblxuICAgICAgICAgICAgY29uc3QgYmdtID0gbmV3IFBpenppY2F0by5Tb3VuZCh7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9vcCA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHBhdGggOiBiZ21VUkxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmdtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJnbS5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJnbS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iZ20gPSBiZ207XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFBsYXlTRlgoc2Z4VVJMIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBzZnggPSBuZXcgUGl6emljYXRvLlNvdW5kKHtcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7IHBhdGggOiBzZnhVUkwgfSxcbiAgICAgICAgICAgIHNvdXJjZSA6IFwiZmlsZVwiXG4gICAgICAgIH0sICgpID0+IHNmeC5wbGF5KCkpO1xuICAgIH1cblxuICAgIFN0b3BCR00oKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iZ20gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5iZ20uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5iZ20uZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgdGhpcy5iZ21VUkwgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5iZ20gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBEdW1teUF1ZGlvIGV4dGVuZHMgQXVkaW8ge1xuICAgIFBsYXlCR00oYmdtVVJMIDogc3RyaW5nKSA6IHZvaWQgeyB9XG4gICAgUGxheVNGWChzZnhVUkwgOiBzdHJpbmcpIDogdm9pZCB7IH1cbiAgICBTdG9wQkdNKCkgOiB2b2lkIHsgfVxufVxuIiwiaW1wb3J0IHsgTGl0ZUV2ZW50IH0gZnJvbSBcIi4vZXZlbnRzXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcbiAgICBwcml2YXRlIF9vbkNsaWNrIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+ID0gbmV3IExpdGVFdmVudDxDYW52YXMsIFBvaW50PigpO1xuICAgIHByaXZhdGUgX29uTW92ZSA6IExpdGVFdmVudDxDYW52YXMsIFBvaW50PiA9IG5ldyBMaXRlRXZlbnQ8Q2FudmFzLCBQb2ludD4oKTtcbiAgICBwcml2YXRlIGN0eCA6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBwcml2YXRlIGVsZW1lbnQgOiBIVE1MQ2FudmFzRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklEIDogc3RyaW5nLCBzaXplIDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySUQpO1xuXG4gICAgICAgIGlmIChjb250YWluZXIudGFnTmFtZSA9PT0gXCJjYW52YXNcIikge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gY29udGFpbmVyIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LndpZHRoID0gc2l6ZS5YO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaGVpZ2h0ID0gc2l6ZS5ZO1xuXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLl9jbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5fbW92ZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLkNsZWFyKCk7XG4gICAgfVxuXG4gICAgZ2V0IFNpemUoKSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLmVsZW1lbnQud2lkdGgsIHRoaXMuZWxlbWVudC5oZWlnaHQpO1xuICAgIH1cblxuICAgIHNldCBTaXplKHNpemUgOiBQb2ludCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQud2lkdGggPSBzaXplLlg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5oZWlnaHQgPSBzaXplLlk7XG4gICAgfVxuXG4gICAgQ2xlYXIoKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3QmFja2dyb3VuZEltYWdlKGltYWdlIDogSW1hZ2VCaXRtYXApIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgdGhpcy5lbGVtZW50LndpZHRoLCB0aGlzLmVsZW1lbnQuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3SW1hZ2UoaW1hZ2UgOiBJbWFnZUJpdG1hcCwgcG9zaXRpb24gOiBQb2ludCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltYWdlLCBwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZLCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBEcmF3SW1hZ2VUbyhpbWFnZSA6IEltYWdlQml0bWFwLCBzb3VyY2UgOiBJUmVjdCwgZGVzdGluYXRpb24gOiBJUmVjdCkge1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgICBpbWFnZSxcbiAgICAgICAgICAgIHNvdXJjZS5Qb3NpdGlvbi5YLCBzb3VyY2UuUG9zaXRpb24uWSxcbiAgICAgICAgICAgIHNvdXJjZS5TaXplLlgsIHNvdXJjZS5TaXplLlksXG4gICAgICAgICAgICBkZXN0aW5hdGlvbi5Qb3NpdGlvbi5YLCBkZXN0aW5hdGlvbi5Qb3NpdGlvbi5ZLFxuICAgICAgICAgICAgZGVzdGluYXRpb24uU2l6ZS5YLCBkZXN0aW5hdGlvbi5TaXplLllcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBEcmF3UmVjdChwb3NpdGlvbiA6IFBvaW50LCBzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QocG9zaXRpb24uWCwgcG9zaXRpb24uWSwgc2l6ZS5YLCBzaXplLlkpO1xuICAgIH1cblxuICAgIERyYXdSZWN0MChzaXplIDogUG9pbnQsIGNvbG9yIDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgICB0aGlzLkRyYXdSZWN0KG5ldyBQb2ludCgpLCBzaXplLCBjb2xvcik7XG4gICAgfVxuXG4gICAgRHJhd1RleHQodGV4dCA6IHN0cmluZywgcG9zaXRpb24gOiBQb2ludCwgY29sb3IgOiBzdHJpbmcsIGZvbnRTaXplIDogbnVtYmVyLCBtYXhXaWR0aD8gOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICB0aGlzLmN0eC5mb250ID0gYCR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XG4gICAgICAgIHRoaXMuY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KHRleHQsIHBvc2l0aW9uLlgsIHBvc2l0aW9uLlksIG1heFdpZHRoKTtcbiAgICB9XG5cbiAgICBEcmF3VGV4dDAodGV4dCA6IHN0cmluZywgY29sb3IgOiBzdHJpbmcsIGZvbnRTaXplIDogbnVtYmVyLCBtYXhXaWR0aD8gOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuRHJhd1RleHQodGV4dCwgbmV3IFBvaW50KCksIGNvbG9yLCBmb250U2l6ZSwgbWF4V2lkdGgpO1xuICAgIH1cblxuICAgIEdldEltYWdlRGF0YSgpIDogSW1hZ2VEYXRhIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLlNpemUuWCwgdGhpcy5TaXplLlkpO1xuICAgIH1cblxuICAgIE1lYXN1cmVUZXh0V2lkdGgodGV4dCA6IHN0cmluZykgOiBudW1iZXIge1xuICAgICAgICAvLyBXZSBtZWFzdXJlIHdpdGggdGhlIGxhc3QgZm9udCB1c2VkIGluIHRoZSBjb250ZXh0XG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgICB9XG5cbiAgICBSZXN0b3JlKCkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIFNldEN1cnNvcihjdXJzb3IgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgfVxuXG4gICAgVHJhbnNsYXRlKHBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuUmVzdG9yZSgpO1xuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShwb3NpdGlvbi5YLCBwb3NpdGlvbi5ZKTtcbiAgICB9XG5cbiAgICBnZXQgT25DbGljaygpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uQ2xpY2suRXhwb3NlKCk7XG4gICAgfVxuXG4gICAgZ2V0IE9uTW92ZSgpIDogTGl0ZUV2ZW50PENhbnZhcywgUG9pbnQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uTW92ZS5FeHBvc2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jbGljayhldiA6IE1vdXNlRXZlbnQpIDogdm9pZCB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuX29uQ2xpY2suVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXG4gICAgICAgICAgICBldi5wYWdlWCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX21vdmUoZXYgOiBNb3VzZUV2ZW50KSA6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbk1vdmUuVHJpZ2dlcih0aGlzLCBuZXcgUG9pbnQoXG4gICAgICAgICAgICBldi5wYWdlWCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgZXYucGFnZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEhpZGRlbkNhbnZhcyBleHRlbmRzIENhbnZhcyB7XG4gICAgcHJpdmF0ZSBoaWRkZW5FbGVtZW50IDogSFRNTEVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzaXplIDogUG9pbnQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBgY18ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoKS5zbGljZSgyLCA3KX1gO1xuICAgICAgICBjb25zdCBoaWRkZW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgaGlkZGVuRWxlbWVudC5pZCA9IGlkO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGhpZGRlbkVsZW1lbnQpO1xuXG4gICAgICAgIHN1cGVyKGlkLCBzaXplKTtcblxuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnQgPSBoaWRkZW5FbGVtZW50O1xuICAgIH1cblxuICAgIERlc3Ryb3koKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhpZGRlbkVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi9wb2ludFwiO1xuXG5jbGFzcyBDbGFzc0NvbmZpZyB7XG4gICAgRGVmYXVsdFRleHRTcGVlZCA6IG51bWJlciA9IDMwO1xuICAgIFJvb3RQYXRoIDogc3RyaW5nID0gXCJcIjtcbiAgICBSb290UGF0aElzUmVtb3RlOiBib29sZWFuID0gZmFsc2U7XG4gICAgU2NyZWVuU2l6ZSA6IFBvaW50ID0gbmV3IFBvaW50KDgwMCwgNjAwKTtcblxuICAgIHByaXZhdGUgdGV4dFNwZWVkIDogbnVtYmVyO1xuICAgIHByaXZhdGUgdGV4dFNwZWVkUmF0aW8gOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5UZXh0U3BlZWQgPSB0aGlzLkRlZmF1bHRUZXh0U3BlZWQ7IC8vIFRoaXMgaXMgaW4gY2hhciBwZXIgc2Vjb25kXG4gICAgfVxuXG4gICAgTG9hZCh0YWdzIDogc3RyaW5nW10pIDogdm9pZCB7XG4gICAgICAgIGZ1bmN0aW9uIGVycm9yKHRhZyA6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcmVhZGluZyB0YWc6IFwiJHt0YWd9XCJgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUQUc6XCIsIHRhZ3NbaV0pXG4gICAgICAgICAgICBsZXQga2V5LCB2YWx1ZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAga2V5ID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGFnc1tpXS5zcGxpdChcIjpcIilbMV0udHJpbSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNjcmVlbl9zaXplXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JlZW5zaXplXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSB2YWx1ZS5zcGxpdCgvXFxEKy8pLm1hcCh4ID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2l6ZS5sZW5ndGggPT09IDIgJiYgIWlzTmFOKHNpemVbMF0pICYmICFpc05hTihzaXplWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuU2NyZWVuU2l6ZSA9IG5ldyBQb2ludChzaXplWzBdLCBzaXplWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRfc3BlZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRleHRzcGVlZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVlZCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHNwZWVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuRGVmYXVsdFRleHRTcGVlZCA9IHRoaXMuVGV4dFNwZWVkID0gc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290X3BhdGhcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvb3RwYXRoXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm9vdFBhdGggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290X3BhdGhfaXNfcmVtb3RlXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb290cGF0aGlzcmVtb3RlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuUm9vdFBhdGhJc1JlbW90ZSA9IHZhbHVlID09PSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBUZXh0U3BlZWQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRTcGVlZDtcbiAgICB9XG5cbiAgICBzZXQgVGV4dFNwZWVkKHZhbHVlIDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudGV4dFNwZWVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMudGV4dFNwZWVkUmF0aW8gPSAxMDAwLjAgLyB0aGlzLnRleHRTcGVlZDtcbiAgICB9XG5cbiAgICBnZXQgVGV4dFNwZWVkUmF0aW8oKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRTcGVlZFJhdGlvO1xuICAgIH1cbn1cblxuZXhwb3J0IGxldCBDb25maWcgPSBuZXcgQ2xhc3NDb25maWcoKTtcbiIsImV4cG9ydCBjbGFzcyBMaXRlRXZlbnQ8VDEsIFQyPiB7XG4gICAgcHJpdmF0ZSBoYW5kbGVycyA6IEFycmF5PChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkPiA9IFtdO1xuXG4gICAgRXhwb3NlKCkgOiBMaXRlRXZlbnQ8VDEsIFQyPiB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIE9mZihoYW5kbGVyIDogKHNlbmRlciA6IFQxLCBhcmc/IDogVDIpID0+IHZvaWQpIDogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmZpbHRlcihfaGFuZGxlciA9PiBfaGFuZGxlciAhPT0gaGFuZGxlcik7XG4gICAgfVxuXG4gICAgT24oaGFuZGxlciA6IChzZW5kZXIgOiBUMSwgYXJnPyA6IFQyKSA9PiB2b2lkKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgVHJpZ2dlcihzZW5kZXIgOiBUMSwgYXJncz8gOiBUMikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGhhbmRsZXIgPT4gaGFuZGxlcihzZW5kZXIsIGFyZ3MpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBMYXllciB9IGZyb20gXCIuL2xheWVyc1wiO1xuXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIExheWVyIHtcbiAgICBwcml2YXRlIGJhY2tncm91bmRJbWFnZSA6IEltYWdlQml0bWFwO1xuICAgIHByaXZhdGUgYmFja2dyb3VuZEltYWdlVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBjb25zdHJ1Y3RvcihpbWFnZVVSTD8gOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpZiAoaW1hZ2VVUkwgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5CYWNrZ3JvdW5kSW1hZ2UgPSBpbWFnZVVSTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2VVUkwgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGltYWdlVVJMICE9PSB0aGlzLmJhY2tncm91bmRJbWFnZVVSTCkge1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VVUkwgPSBpbWFnZVVSTDtcbiAgICAgICAgICAgIExvYWRlci5Mb2FkSW1hZ2UoaW1hZ2VVUkwpLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kSW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdCYWNrZ3JvdW5kSW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2FudmFzLCBIaWRkZW5DYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBJUmVjdCwgUG9pbnQgfSBmcm9tIFwiLi4vcG9pbnRcIjtcbmltcG9ydCB7IExheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmV4cG9ydCBlbnVtIEJveEJhY2tncm91bmRUeXBlcyB7XG4gICAgQ09MT1IsIE5JTkVQQVRDSCwgU1RSRVRDSFxufVxuXG5jbGFzcyBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5IHtcbiAgICBDcmVhdGUodHlwZSA6IEJveEJhY2tncm91bmRUeXBlcywgYmFja2dyb3VuZCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkgOiBCb3hCYWNrZ3JvdW5kIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEJveEJhY2tncm91bmRUeXBlcy5DT0xPUjoge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3JlZEJveEJhY2tncm91bmQoYmFja2dyb3VuZCwgc2l6ZSwgcG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBCb3hCYWNrZ3JvdW5kVHlwZXMuTklORVBBVENIOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgQm94QmFja2dyb3VuZFR5cGVzLlNUUkVUQ0g6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0cmV0Y2hCb3hCYWNrZ3JvdW5kKGJhY2tncm91bmQsIHNpemUsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJveEJhY2tncm91bmRGYWN0b3J5IDogQ2xhc3NCb3hCYWNrZ3JvdW5kRmFjdG9yeSA9IG5ldyBDbGFzc0JveEJhY2tncm91bmRGYWN0b3J5KCk7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByb3RlY3RlZCBib3ggOiBJUmVjdDtcblxuICAgIGNvbnN0cnVjdG9yKHNpemUgOiBQb2ludCwgcG9zaXRpb24/IDogUG9pbnQpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmJveCA9IHtcbiAgICAgICAgICAgIFBvc2l0aW9uIDogcG9zaXRpb24gPT0gbnVsbCA/IG5ldyBQb2ludCgpIDogcG9zaXRpb24sXG4gICAgICAgICAgICBTaXplIDogc2l6ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNldCBQb3NpdGlvbihwb3NpdGlvbiA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm94LlBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgfVxuXG4gICAgc2V0IFNpemUoc2l6ZSA6IFBvaW50KSB7XG4gICAgICAgIHRoaXMuYm94LlNpemUgPSBzaXplO1xuICAgIH1cbn1cblxuY2xhc3MgQ29sb3JlZEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBDb2xvciA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGNvbG9yIDogc3RyaW5nLCBzaXplIDogUG9pbnQsIHBvc2l0aW9uPyA6IFBvaW50KSB7XG4gICAgICAgIHN1cGVyKHNpemUsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLkNvbG9yID0gY29sb3I7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGNhbnZhcy5EcmF3UmVjdCh0aGlzLmJveC5Qb3NpdGlvbiwgdGhpcy5ib3guU2l6ZSwgdGhpcy5Db2xvcik7XG4gICAgfVxufVxuXG5jbGFzcyBOaW5lUGF0Y2hCb3hCYWNrZ3JvdW5kIGV4dGVuZHMgQm94QmFja2dyb3VuZCB7XG4gICAgcHJpdmF0ZSBuaW5lUGF0Y2ggOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIG5pbmVQYXRjaFVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5pbmVQYXRjaFVSTCA6IHN0cmluZywgc2l6ZSA6IFBvaW50LCBwb3NpdGlvbj8gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5OaW5lUGF0Y2ggPSBuaW5lUGF0Y2hVUkw7XG4gICAgfVxuXG4gICAgc2V0IE5pbmVQYXRjaChuaW5lUGF0Y2hVUkwgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG5pbmVQYXRjaFVSTCAhPT0gdGhpcy5uaW5lUGF0Y2hVUkwpIHtcbiAgICAgICAgICAgIHRoaXMubmluZVBhdGNoVVJMID0gbmluZVBhdGNoVVJMO1xuXG4gICAgICAgICAgICBMb2FkZXIuTG9hZEltYWdlKG5pbmVQYXRjaFVSTClcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoaWRkZW5DYW52YXMgPSBuZXcgSGlkZGVuQ2FudmFzKHRoaXMuYm94LlNpemUuQ2xvbmUoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hTaXplID0gbmV3IFBvaW50KGltYWdlLndpZHRoIC8gMywgaW1hZ2UuaGVpZ2h0IC8gMyk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkcmF3UGF0Y2hUbyhwYXRjaFBvc2l0aW9uIDogUG9pbnQsIGRlc3RQb3MgOiBQb2ludCwgZGVzdFNpemU/IDogUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuQ2FudmFzLkRyYXdJbWFnZVRvKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UsIHsgUG9zaXRpb24gOiBwYXRjaFBvc2l0aW9uLCBTaXplIDogcGF0Y2hTaXplIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogZGVzdFBvcywgU2l6ZSA6IGRlc3RTaXplICE9IG51bGwgPyBkZXN0U2l6ZSA6IHBhdGNoU2l6ZSB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcGF0Y2hEZXN0aW5hdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBQb2ludCgpLCBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIDApLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQoMCwgdGhpcy5ib3guU2l6ZS5ZIC0gcGF0Y2hTaXplLlkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gcGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIHBhdGNoU2l6ZS5ZKVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgZHJhd1BhdGNoVG8obmV3IFBvaW50KCksIHBhdGNoRGVzdGluYXRpb25zWzBdKTsgLy8gVXBwZXIgTGVmdFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAwKSksIHBhdGNoRGVzdGluYXRpb25zWzFdKTsgLy8gVXBwZXIgUmlnaHRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1syXSk7IC8vIExvd2VyIExlZnRcbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMiwgMikpLCBwYXRjaERlc3RpbmF0aW9uc1szXSk7IC8vIExvd2VyIFJpZ2h0XG5cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMSwgMCkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQodGhpcy5ib3guU2l6ZS5YIC0gKHBhdGNoU2l6ZS5YICogMiksIHBhdGNoU2l6ZS5ZKSk7IC8vIFRvcFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAxKSksIHBhdGNoRGVzdGluYXRpb25zWzFdLkFkZChuZXcgUG9pbnQoMCwgcGF0Y2hTaXplLlkpKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHBhdGNoU2l6ZS5YLCB0aGlzLmJveC5TaXplLlkgLSAocGF0Y2hTaXplLlkgKiAyKSkpOyAvLyBSaWdodFxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAyKSksIHBhdGNoRGVzdGluYXRpb25zWzJdLkFkZChuZXcgUG9pbnQocGF0Y2hTaXplLlgsIDApKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFBvaW50KHRoaXMuYm94LlNpemUuWCAtIChwYXRjaFNpemUuWCAqIDIpLCBwYXRjaFNpemUuWSkpOyAvLyBCb3R0b21cbiAgICAgICAgICAgICAgICBkcmF3UGF0Y2hUbyhwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLCBwYXRjaFNpemUuTXVsdChuZXcgUG9pbnQoMCwgMSkpLFxuICAgICAgICAgICAgICAgICAgICBuZXcgUG9pbnQocGF0Y2hTaXplLlgsIHRoaXMuYm94LlNpemUuWSAtIChwYXRjaFNpemUuWSAqIDIpKSk7IC8vIExlZnRcblxuICAgICAgICAgICAgICAgIGRyYXdQYXRjaFRvKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksXG4gICAgICAgICAgICAgICAgICAgIHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgxLCAxKSksIHRoaXMuYm94LlNpemUuU3ViKHBhdGNoU2l6ZS5NdWx0KG5ldyBQb2ludCgyLCAyKSkpKTsgLy8gQ2VudGVyXG5cbiAgICAgICAgICAgICAgICBjcmVhdGVJbWFnZUJpdG1hcChoaWRkZW5DYW52YXMuR2V0SW1hZ2VEYXRhKCkpLnRoZW4obmluZVBhdGNoSW1hZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5pbmVQYXRjaCA9IG5pbmVQYXRjaEltYWdlO1xuICAgICAgICAgICAgICAgICAgICAvLyBoaWRkZW5DYW52YXMuRGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmluZVBhdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3SW1hZ2UodGhpcy5uaW5lUGF0Y2gsIHRoaXMuYm94LlBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgU3RyZXRjaEJveEJhY2tncm91bmQgZXh0ZW5kcyBCb3hCYWNrZ3JvdW5kIHtcbiAgICBwcml2YXRlIGltYWdlIDogSW1hZ2VCaXRtYXA7XG4gICAgcHJpdmF0ZSBpbWFnZVNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIGltYWdlVVJMIDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoaW1hZ2VVUkwgOiBzdHJpbmcsIHNpemUgOiBQb2ludCwgcG9zaXRpb24gOiBQb2ludCkge1xuICAgICAgICBzdXBlcihzaXplLCBwb3NpdGlvbik7XG5cbiAgICAgICAgdGhpcy5JbWFnZSA9IGltYWdlVVJMO1xuICAgIH1cblxuICAgIHNldCBJbWFnZShpbWFnZVVSTCA6IHN0cmluZykge1xuICAgICAgICBpZiAoaW1hZ2VVUkwgIT09IHRoaXMuaW1hZ2VVUkwpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VVUkwgPSBpbWFnZVVSTDtcblxuICAgICAgICAgICAgTG9hZGVyLkxvYWRJbWFnZShpbWFnZVVSTClcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVNpemUgPSBuZXcgUG9pbnQodGhpcy5pbWFnZS53aWR0aCwgdGhpcy5pbWFnZS5oZWlnaHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2FudmFzLkRyYXdJbWFnZVRvKFxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UsXG4gICAgICAgICAgICAgICAgeyBQb3NpdGlvbiA6IG5ldyBQb2ludCgpLCBTaXplIDogdGhpcy5pbWFnZVNpemUgfSxcbiAgICAgICAgICAgICAgICB7IFBvc2l0aW9uIDogdGhpcy5ib3guUG9zaXRpb24sIFNpemUgOiB0aGlzLmJveC5TaXplIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTGF5ZXIge1xuICAgIHByaXZhdGUgY2VudGVyUG9zWCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBzcHJpdGUgOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIHNwcml0ZVVSTCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHNwcml0ZVVSTCA6IHN0cmluZywgcG9zWCA6IG51bWJlcikge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuY2VudGVyUG9zWCA9IHBvc1g7XG4gICAgICAgIHRoaXMuU3ByaXRlID0gc3ByaXRlVVJMO1xuICAgIH1cblxuICAgIHNldCBTcHJpdGUoc3ByaXRlVVJMIDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChzcHJpdGVVUkwgIT09IHRoaXMuc3ByaXRlVVJMKSB7XG4gICAgICAgICAgICB0aGlzLnNwcml0ZVVSTCA9IHNwcml0ZVVSTDtcbiAgICAgICAgICAgIExvYWRlci5Mb2FkSW1hZ2Uoc3ByaXRlVVJMKS50aGVuKGltYWdlID0+IHRoaXMuc3ByaXRlID0gaW1hZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNwcml0ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wb3NpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXJQb3NYIC0gKHRoaXMuc3ByaXRlLndpZHRoIC8gMiksXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5TaXplLlkgLSB0aGlzLnNwcml0ZS5oZWlnaHRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYW52YXMuRHJhd0ltYWdlKHRoaXMuc3ByaXRlLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENoYXJhY3RlcnMgZXh0ZW5kcyBMYXllciB7XG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXJzIDogQ2hhcmFjdGVyW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIEFkZChzcHJpdGVVUkwgOiBzdHJpbmcsIGNhbnZhcyA6IENhbnZhcykge1xuICAgICAgICAvLyBGb3Igbm93IGp1c3QgaGFuZGxlIG9uZSBjaGFyYWN0ZXIgYXQgYSB0aW1lXG4gICAgICAgIGlmICh0aGlzLmNoYXJhY3RlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYXJhY3RlcnMucHVzaChuZXcgQ2hhcmFjdGVyKHNwcml0ZVVSTCwgY2FudmFzLlNpemUuWCAvIDIpKTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGFyYWN0ZXIgb2YgdGhpcy5jaGFyYWN0ZXJzKSB7XG4gICAgICAgICAgICBjaGFyYWN0ZXIuRHJhdyhjYW52YXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUmVtb3ZlKCkge1xuICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSBbXTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDaG9pY2UgfSBmcm9tIFwiaW5ranNcIjtcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IElSZWN0LCBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQgeyBHYW1lcGxheUxheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmNsYXNzIENob2ljZUJveCB7XG4gICAgcHJpdmF0ZSBib3hCYWNrZ3JvdW5kIDogQm94QmFja2dyb3VuZDtcbiAgICBwcml2YXRlIGZvbnRTaXplIDogbnVtYmVyID0gMjQ7XG4gICAgcHJpdmF0ZSBoYXNBbHJlYWR5QmVlbkRyYXduT25jZSA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGlkIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW5uZXJNYXJnaW4gOiBQb2ludCA9IG5ldyBQb2ludCgwLCAyMCk7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbiA6IFBvaW50O1xuICAgIHByaXZhdGUgc2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdGV4dCA6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGlkIDogbnVtYmVyLCB0ZXh0IDogc3RyaW5nLCB3aWR0aCA6IG51bWJlciwgcG9zaXRpb24gOiBQb2ludCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG5cbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFBvaW50KHdpZHRoLCAodGhpcy5mb250U2l6ZSAqIDEuNDI4NTcpICsgKDIgKiB0aGlzLmlubmVyTWFyZ2luLlkpKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICAgIHRoaXMuYm94QmFja2dyb3VuZCA9IEJveEJhY2tncm91bmRGYWN0b3J5LkNyZWF0ZShCb3hCYWNrZ3JvdW5kVHlwZXMuQ09MT1IsIFwicmdiYSgwLCAwLCAwLCAuNylcIiwgdGhpcy5zaXplLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBnZXQgSWQoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkO1xuICAgIH1cblxuICAgIGdldCBCb3VuZGluZ1JlY3QoKSA6IElSZWN0IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFBvc2l0aW9uIDogdGhpcy5wb3NpdGlvbixcbiAgICAgICAgICAgIFNpemUgOiB0aGlzLnNpemVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0FscmVhZHlCZWVuRHJhd25PbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZUZpcnN0RHJhdyhjYW52YXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kLkRyYXcoY2FudmFzKTtcbiAgICAgICAgY2FudmFzLkRyYXdUZXh0KHRoaXMudGV4dCwgdGhpcy5wb3NpdGlvbi5BZGQodGhpcy5pbm5lck1hcmdpbiksIFwid2hpdGVcIiwgdGhpcy5mb250U2l6ZSwgdGhpcy5zaXplLlgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYmVmb3JlRmlyc3REcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLkRyYXdUZXh0MChcIlwiLCBcInRyYW5zcGFyZW50XCIsIHRoaXMuZm9udFNpemUpO1xuICAgICAgICB0aGlzLmlubmVyTWFyZ2luLlggPSAodGhpcy5zaXplLlggLSBjYW52YXMuTWVhc3VyZVRleHRXaWR0aCh0aGlzLnRleHQpKSAvIDI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hvaWNlTGF5ZXIgZXh0ZW5kcyBHYW1lcGxheUxheWVyIHtcbiAgICBwcml2YXRlIGJvdW5kaW5nUmVjdCA6IFBvaW50O1xuICAgIHByaXZhdGUgY2hvaWNlQm94ZXMgOiBDaG9pY2VCb3hbXSA9IFtdO1xuICAgIHByaXZhdGUgY2hvaWNlcyA6IENob2ljZVtdID0gW107XG4gICAgcHJpdmF0ZSBpc01vdXNlT25DaG9pY2UgOiBDaG9pY2VCb3ggPSBudWxsO1xuICAgIHByaXZhdGUgc2NyZWVuU2l6ZSA6IFBvaW50O1xuICAgIHByaXZhdGUgdHJhbnNsYXRpb24gOiBQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKHNjcmVlblNpemUgOiBQb2ludCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuc2NyZWVuU2l6ZSA9IHNjcmVlblNpemU7XG4gICAgfVxuXG4gICAgc2V0IENob2ljZXMoY2hvaWNlcyA6IENob2ljZVtdKSB7XG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IGNob2ljZXM7XG5cbiAgICAgICAgdGhpcy5jaG9pY2VCb3hlcyA9IFtdO1xuICAgICAgICBjb25zdCB3aWR0aCA9IDIwMDtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIGZvciAoY29uc3QgX2Nob2ljZSBvZiB0aGlzLmNob2ljZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0Nob2ljZSA9IG5ldyBDaG9pY2VCb3goX2Nob2ljZS5pbmRleCwgX2Nob2ljZS50ZXh0LCB3aWR0aCwgcG9zaXRpb24uQ2xvbmUoKSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZUJveGVzLnB1c2gobmV3Q2hvaWNlKTtcbiAgICAgICAgICAgIHBvc2l0aW9uLlkgKz0gbmV3Q2hvaWNlLkJvdW5kaW5nUmVjdC5TaXplLlkgKyA0MDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvdW5kaW5nUmVjdCA9IG5ldyBQb2ludCh3aWR0aCwgcG9zaXRpb24uWSAtIDQwKTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IHRoaXMuc2NyZWVuU2l6ZS5EaXYobmV3IFBvaW50KDIpKS5TdWIodGhpcy5ib3VuZGluZ1JlY3QuRGl2KG5ldyBQb2ludCgyKSkpO1xuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBjYW52YXMuVHJhbnNsYXRlKHRoaXMudHJhbnNsYXRpb24pO1xuICAgICAgICBmb3IgKGNvbnN0IGNob2ljZUJveCBvZiB0aGlzLmNob2ljZUJveGVzKSB7XG4gICAgICAgICAgICBjaG9pY2VCb3guRHJhdyhjYW52YXMpO1xuICAgICAgICB9XG4gICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGNob2ljZUJveCBvZiB0aGlzLmNob2ljZUJveGVzKSB7XG4gICAgICAgICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSBjaG9pY2VCb3guQm91bmRpbmdSZWN0O1xuICAgICAgICAgICAgYm91bmRpbmdSZWN0LlBvc2l0aW9uID0gYm91bmRpbmdSZWN0LlBvc2l0aW9uLkFkZCh0aGlzLnRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgIGlmIChjbGlja1Bvc2l0aW9uLklzSW5SZWN0KGJvdW5kaW5nUmVjdCkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24oY2hvaWNlQm94LklkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIE1vdXNlTW92ZShtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogKF8gOiBDYW52YXMpID0+IHZvaWQge1xuICAgICAgICBtb3VzZVBvc2l0aW9uID0gbW91c2VQb3NpdGlvbi5TdWIodGhpcy50cmFuc2xhdGlvbik7XG4gICAgICAgIGlmICh0aGlzLmlzTW91c2VPbkNob2ljZSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbW91c2VQb3NpdGlvbi5Jc0luUmVjdCh0aGlzLmlzTW91c2VPbkNob2ljZS5Cb3VuZGluZ1JlY3QpID8gbnVsbCA6IChjYW52YXMgOiBDYW52YXMpID0+IHtcbiAgICAgICAgICAgICAgICBjYW52YXMuU2V0Q3Vyc29yKFwiZGVmYXVsdFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW91c2VPbkNob2ljZSA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaG9pY2Ugb2YgdGhpcy5jaG9pY2VCb3hlcykge1xuICAgICAgICAgICAgICAgIGlmIChtb3VzZVBvc2l0aW9uLklzSW5SZWN0KGNob2ljZS5Cb3VuZGluZ1JlY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoY2FudmFzIDogQ2FudmFzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTW91c2VPbkNob2ljZSA9IGNob2ljZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhcy5TZXRDdXJzb3IoXCJwb2ludGVyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQgeyB9XG59XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGF5ZXIge1xuICAgIGFic3RyYWN0IERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQ7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGVwTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gICAgYWJzdHJhY3QgU3RlcChkZWx0YSA6IG51bWJlcikgOiB2b2lkO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2FtZXBsYXlMYXllciBleHRlbmRzIFN0ZXBMYXllciB7XG4gICAgYWJzdHJhY3QgTW91c2VDbGljayhjbGlja1Bvc2l0aW9uIDogUG9pbnQsIGFjdGlvbiA6IEZ1bmN0aW9uKSA6IHZvaWQ7XG4gICAgYWJzdHJhY3QgTW91c2VNb3ZlKG1vdXNlUG9zaXRpb24gOiBQb2ludCkgOiAoXyA6IENhbnZhcykgPT4gdm9pZDtcbn1cblxuZXhwb3J0ICogZnJvbSBcIi4vYmFja2dyb3VuZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vY2hhcmFjdGVyc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vY2hvaWNlbGF5ZXJcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3NwZWVjaGxheWVyXCI7XG5leHBvcnQgKiBmcm9tIFwiLi90cmFuc2l0aW9uXCI7XG4iLCJpbXBvcnQgeyBDYW52YXMgfSBmcm9tIFwiLi4vY2FudmFzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuLi9wb2ludFwiO1xuaW1wb3J0IHsgQm94QmFja2dyb3VuZCwgQm94QmFja2dyb3VuZEZhY3RvcnksIEJveEJhY2tncm91bmRUeXBlcyB9IGZyb20gXCIuL2JveGJhY2tncm91bmRzXCI7XG5pbXBvcnQgeyBHYW1lcGxheUxheWVyIH0gZnJvbSBcIi4vbGF5ZXJzXCI7XG5cbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWdcIjtcblxuaW50ZXJmYWNlIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBCYWNrZ3JvdW5kIDogc3RyaW5nO1xuICAgIEJhY2tncm91bmRUeXBlIDogQm94QmFja2dyb3VuZFR5cGVzO1xuICAgIEZvbnRDb2xvciA6IHN0cmluZztcbiAgICBGb250U2l6ZSA6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJU3BlZWNoQm94Q29uZmlndXJhdGlvbiBleHRlbmRzIElCb3hDb25maWd1cmF0aW9uIHtcbiAgICBIZWlnaHQgOiBudW1iZXI7XG4gICAgSW5uZXJNYXJnaW4gOiBQb2ludDtcbiAgICBPdXRlck1hcmdpbiA6IFBvaW50O1xufVxuXG5pbnRlcmZhY2UgSU5hbWVCb3hDb25maWd1cmF0aW9uIGV4dGVuZHMgSUJveENvbmZpZ3VyYXRpb24ge1xuICAgIEhlaWdodCA6IG51bWJlcjtcbiAgICBXaWR0aCA6IG51bWJlcjtcbn1cblxuY29uc3QgUkVXUkFQX1RISVNfTElORSA9IFwiPFt7UkVXUkFQX1RISVNfTElORX1dPlwiO1xuXG5jbGFzcyBTcGVlY2hCb3gge1xuICAgIHByaXZhdGUgYm94QmFja2dyb3VuZCA6IEJveEJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBmb250Q29sb3IgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBmb250U2l6ZSA6IG51bWJlcjtcbiAgICBwcml2YXRlIGlubmVyTWFyZ2luIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBpbm5lclNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIG5leHRXb3JkIDogc3RyaW5nO1xuICAgIHByaXZhdGUgcG9zaXRpb24gOiBQb2ludDtcbiAgICBwcml2YXRlIHNpemUgOiBQb2ludDtcbiAgICBwcml2YXRlIHRleHRMaW5lcyA6IFtzdHJpbmddID0gW1wiXCJdO1xuXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24gOiBQb2ludCwgc2l6ZSA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSVNwZWVjaEJveENvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uLkNsb25lKCk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemUuQ2xvbmUoKTtcbiAgICAgICAgdGhpcy5pbm5lck1hcmdpbiA9IGNvbmZpZ3VyYXRpb24uSW5uZXJNYXJnaW47XG4gICAgICAgIHRoaXMuaW5uZXJTaXplID0gdGhpcy5zaXplLlN1Yih0aGlzLmlubmVyTWFyZ2luLk11bHQobmV3IFBvaW50KDIpKSk7XG5cbiAgICAgICAgdGhpcy5ib3hCYWNrZ3JvdW5kID0gQm94QmFja2dyb3VuZEZhY3RvcnkuQ3JlYXRlKFxuICAgICAgICAgICAgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kVHlwZSwgY29uZmlndXJhdGlvbi5CYWNrZ3JvdW5kLFxuICAgICAgICAgICAgdGhpcy5zaXplLkNsb25lKClcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gY29uZmlndXJhdGlvbi5Gb250U2l6ZTtcbiAgICAgICAgdGhpcy5mb250Q29sb3IgPSBjb25maWd1cmF0aW9uLkZvbnRDb2xvcjtcbiAgICB9XG5cbiAgICBnZXQgVGV4dCgpIDogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dExpbmVzLmpvaW4oXCIgXCIpO1xuICAgIH1cblxuICAgIHNldCBUZXh0KHRleHQgOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgX3RleHQgPSB0aGlzLlRleHQ7XG4gICAgICAgIGlmICh0ZXh0LmluZGV4T2YoX3RleHQpID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzbGljZSA9IHRleHQuc2xpY2UoX3RleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDFdICs9IHNsaWNlO1xuICAgICAgICAgICAgaWYgKHNsaWNlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRXb3JkID0gUkVXUkFQX1RISVNfTElORTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGV4dExpbmVzID0gW3RleHRdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IE5leHRXb3JkKG5leHRXb3JkIDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubmV4dFdvcmQgPSBuZXh0V29yZDtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLlRyYW5zbGF0ZSh0aGlzLnBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQuRHJhdyhjYW52YXMpO1xuXG4gICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbi5BZGQodGhpcy5pbm5lck1hcmdpbikpO1xuXG4gICAgICAgIGlmICh0aGlzLm5leHRXb3JkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZG9UaGVXcmFwKGNhbnZhcyk7XG4gICAgICAgICAgICB0aGlzLm5leHRXb3JkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50ZXh0TGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3VGV4dChcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lc1tpXSxcbiAgICAgICAgICAgICAgICBuZXcgUG9pbnQoMCwgaSAqICh0aGlzLmZvbnRTaXplICogMS40Mjg1NykpLCAvLyBUaGlzIGlzIHRoZSBnb2xkZW4gcmF0aW8sIG9uIGxpbmUtaGVpZ2h0IGFuZCBmb250LXNpemVcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRDb2xvcixcbiAgICAgICAgICAgICAgICB0aGlzLmZvbnRTaXplLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJTaXplLlhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMuUmVzdG9yZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9UaGVXcmFwKGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLkRyYXdUZXh0MChcIlwiLCBcInRyYW5zcGFyZW50XCIsIHRoaXMuZm9udFNpemUpO1xuICAgICAgICBjb25zdCBjb21wID0gKGxpbmUgOiBzdHJpbmcpID0+IGNhbnZhcy5NZWFzdXJlVGV4dFdpZHRoKGxpbmUpID4gdGhpcy5pbm5lclNpemUuWDtcblxuICAgICAgICBsZXQgbGFzdExpbmUgPSB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXTtcblxuICAgICAgICBpZiAodGhpcy5uZXh0V29yZCA9PT0gUkVXUkFQX1RISVNfTElORSkge1xuICAgICAgICAgICAgLy8gTmVlZCB0byB3cmFwIHRoZSBmdWNrIG91dCBvZiB0aGlzIGxpbmVcbiAgICAgICAgICAgIHdoaWxlIChjb21wKGxhc3RMaW5lKSkge1xuICAgICAgICAgICAgICAgIC8vIEdldCB0byB0aGUgY2hhciB3aGVyZSB3ZSdyZSBvdXRzaWRlIHRoZSBib3VkYXJpZXNcbiAgICAgICAgICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCFjb21wKGxhc3RMaW5lLnNsaWNlKDAsIG4pKSkgeyArK247IH1cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHByZXZpb3VzIHNwYWNlXG4gICAgICAgICAgICAgICAgd2hpbGUgKGxhc3RMaW5lW25dICE9PSBcIiBcIiAmJiBuID49IDApIHsgLS1uOyB9XG4gICAgICAgICAgICAgICAgaWYgKG4gPT09IDApIHsgYnJlYWs7IH0gLy8gV2UgY2FuJ3Qgd3JhcCBtb3JlXG4gICAgICAgICAgICAgICAgLy8gQXBwZW5kLCB1cGRhdGUgbGFzdCBsaW5lLCBhbmQgYmFjayBpbiB0aGUgbG9vcFxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzLnB1c2gobGFzdExpbmUuc2xpY2UobiArIDEpKTsgLy8gKzEgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRoZSBzcGFjZVxuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzW3RoaXMudGV4dExpbmVzLmxlbmd0aCAtIDJdID0gbGFzdExpbmUuc2xpY2UoMCwgbik7XG4gICAgICAgICAgICAgICAgbGFzdExpbmUgPSB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjb21wKGxhc3RMaW5lICsgdGhpcy5uZXh0V29yZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRMaW5lc1t0aGlzLnRleHRMaW5lcy5sZW5ndGggLSAxXSA9IGxhc3RMaW5lLnNsaWNlKDAsIGxhc3RMaW5lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dExpbmVzLnB1c2goXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIE5hbWVCb3gge1xuICAgIHByaXZhdGUgYmFja2dyb3VuZFVSTCA6IHN0cmluZyA9IFwiaW1hZ2VzLzlwYXRjaC1zbWFsbC5wbmdcIjtcbiAgICBwcml2YXRlIGJveEJhY2tncm91bmQgOiBCb3hCYWNrZ3JvdW5kO1xuICAgIHByaXZhdGUgZm9udENvbG9yIDogc3RyaW5nO1xuICAgIHByaXZhdGUgZm9udFNpemUgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbm5lck1hcmdpbiA6IFBvaW50O1xuICAgIHByaXZhdGUgbmFtZSA6IHN0cmluZztcbiAgICBwcml2YXRlIHBvc2l0aW9uIDogUG9pbnQ7XG4gICAgcHJpdmF0ZSBzaXplIDogUG9pbnQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSU5hbWVCb3hDb25maWd1cmF0aW9uKTtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiA6IFBvaW50LCBjb25maWd1cmF0aW9uIDogSU5hbWVCb3hDb25maWd1cmF0aW9uLCBuYW1lPyA6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXcgUG9pbnQoY29uZmlndXJhdGlvbi5XaWR0aCwgY29uZmlndXJhdGlvbi5IZWlnaHQpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb24uQ2xvbmUoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5ZIC09IHRoaXMuc2l6ZS5ZO1xuXG4gICAgICAgIHRoaXMuaW5uZXJNYXJnaW4gPSB0aGlzLnNpemUuRGl2KG5ldyBQb2ludCgxMCwgMTApKTtcblxuICAgICAgICB0aGlzLmZvbnRTaXplID0gY29uZmlndXJhdGlvbi5Gb250U2l6ZTtcbiAgICAgICAgdGhpcy5mb250Q29sb3IgPSBjb25maWd1cmF0aW9uLkZvbnRDb2xvcjtcblxuICAgICAgICB0aGlzLmJveEJhY2tncm91bmQgPSBCb3hCYWNrZ3JvdW5kRmFjdG9yeS5DcmVhdGUoXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uLkJhY2tncm91bmRUeXBlLCBjb25maWd1cmF0aW9uLkJhY2tncm91bmQsXG4gICAgICAgICAgICB0aGlzLnNpemUuQ2xvbmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNldCBOYW1lKG5hbWUgOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKG5hbWUgIT09IHRoaXMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIERyYXcoY2FudmFzIDogQ2FudmFzKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNhbnZhcy5UcmFuc2xhdGUodGhpcy5wb3NpdGlvbik7XG4gICAgICAgICAgICB0aGlzLmJveEJhY2tncm91bmQuRHJhdyhjYW52YXMpO1xuICAgICAgICAgICAgY2FudmFzLkRyYXdUZXh0KHRoaXMubmFtZSwgdGhpcy5pbm5lck1hcmdpbiwgdGhpcy5mb250Q29sb3IsIHRoaXMuZm9udFNpemUsIHRoaXMuc2l6ZS5YKTtcbiAgICAgICAgICAgIGNhbnZhcy5SZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcGVlY2hMYXllciBleHRlbmRzIEdhbWVwbGF5TGF5ZXIge1xuICAgIHByaXZhdGUgZnVsbFRleHQgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBuYW1lQm94IDogTmFtZUJveDtcbiAgICBwcml2YXRlIHRleHRBcHBlYXJlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHRleHRCb3ggOiBTcGVlY2hCb3g7XG4gICAgcHJpdmF0ZSB0ZXh0VGltZSA6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihzY3JlZW5TaXplIDogUG9pbnQsIHNwZWVjaEJveENvbmZpZ3VyYXRpb24gOiBJU3BlZWNoQm94Q29uZmlndXJhdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGNvbnN0IHRleHRCb3hTaXplID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5YIC0gKHNwZWVjaEJveENvbmZpZ3VyYXRpb24uT3V0ZXJNYXJnaW4uWCAqIDIpLFxuICAgICAgICAgICAgc3BlZWNoQm94Q29uZmlndXJhdGlvbi5IZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgdGV4dEJveFBvc2l0aW9uID0gbmV3IFBvaW50KFxuICAgICAgICAgICAgc3BlZWNoQm94Q29uZmlndXJhdGlvbi5PdXRlck1hcmdpbi5YLFxuICAgICAgICAgICAgc2NyZWVuU2l6ZS5ZIC0gc3BlZWNoQm94Q29uZmlndXJhdGlvbi5PdXRlck1hcmdpbi5ZIC0gc3BlZWNoQm94Q29uZmlndXJhdGlvbi5IZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy50ZXh0Qm94ID0gbmV3IFNwZWVjaEJveCh0ZXh0Qm94UG9zaXRpb24sIHRleHRCb3hTaXplLCBzcGVlY2hCb3hDb25maWd1cmF0aW9uKTtcblxuICAgICAgICB0aGlzLm5hbWVCb3ggPSBuZXcgTmFtZUJveChcbiAgICAgICAgICAgIHRleHRCb3hQb3NpdGlvbi5BZGQobmV3IFBvaW50KDcwLCAwKSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQmFja2dyb3VuZCA6IHNwZWVjaEJveENvbmZpZ3VyYXRpb24uQmFja2dyb3VuZCxcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kVHlwZSA6IHNwZWVjaEJveENvbmZpZ3VyYXRpb24uQmFja2dyb3VuZFR5cGUsXG4gICAgICAgICAgICAgICAgRm9udENvbG9yIDogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgIEZvbnRTaXplIDogMjQsXG4gICAgICAgICAgICAgICAgSGVpZ2h0IDogNDAsXG4gICAgICAgICAgICAgICAgV2lkdGggOiAxMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBEcmF3KGNhbnZhcyA6IENhbnZhcykgOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0Qm94LkRyYXcoY2FudmFzKTtcbiAgICAgICAgdGhpcy5uYW1lQm94LkRyYXcoY2FudmFzKTtcbiAgICB9XG5cbiAgICBNb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24gOiBQb2ludCwgYWN0aW9uIDogRnVuY3Rpb24pIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRleHRBcHBlYXJlZCkge1xuICAgICAgICAgICAgYWN0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRleHRCb3guVGV4dCA9IHRoaXMuZnVsbFRleHQ7XG4gICAgICAgICAgICB0aGlzLnRleHRBcHBlYXJlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBNb3VzZU1vdmUobW91c2VQb3NpdGlvbiA6IFBvaW50KSA6IChfIDogQ2FudmFzKSA9PiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgU2F5KHRleHQgOiBzdHJpbmcsIG5hbWUgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEJveC5UZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy5mdWxsVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMudGV4dEFwcGVhcmVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5uYW1lQm94Lk5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIFN0ZXAoZGVsdGEgOiBudW1iZXIpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dFRpbWUgKz0gZGVsdGE7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMudGV4dFRpbWUgPj0gQ29uZmlnLlRleHRTcGVlZFJhdGlvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0Qm94LlRleHQubGVuZ3RoIDwgdGhpcy5mdWxsVGV4dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gdGhpcy5mdWxsVGV4dC5zbGljZSh0aGlzLnRleHRCb3guVGV4dC5sZW5ndGgsIHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dEJveC5UZXh0ICs9IGM7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IFwiIFwiICYmIHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCArIDIgPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbiA9IHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZnVsbFRleHRbbl0gPT09IFwiIFwiICYmIG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkgeyArK247IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuZnVsbFRleHRbbl0gIT09IFwiIFwiICYmIG4gPCB0aGlzLmZ1bGxUZXh0Lmxlbmd0aCkgeyArK247IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRCb3guTmV4dFdvcmQgPSB0aGlzLmZ1bGxUZXh0LnNsaWNlKHRoaXMudGV4dEJveC5UZXh0Lmxlbmd0aCArIDEsIG4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0QXBwZWFyZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRleHRUaW1lID0gdGhpcy50ZXh0VGltZSAtIENvbmZpZy5UZXh0U3BlZWRSYXRpbztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuLi9jYW52YXNcIjtcbmltcG9ydCB7IExpdGVFdmVudCB9IGZyb20gXCIuLi9ldmVudHNcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4uL3BvaW50XCI7XG5pbXBvcnQgeyBTdGVwTGF5ZXIgfSBmcm9tIFwiLi9sYXllcnNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zaXRpb24gZXh0ZW5kcyBTdGVwTGF5ZXIge1xuICAgIHByaXZhdGUgX29uRW5kIDogTGl0ZUV2ZW50PFRyYW5zaXRpb24sIHZvaWQ+ID0gbmV3IExpdGVFdmVudDxUcmFuc2l0aW9uLCB2b2lkPigpO1xuXG4gICAgcHJpdmF0ZSBiIDogbnVtYmVyO1xuICAgIHByaXZhdGUgaW1hZ2UgOiBJbWFnZUJpdG1hcDtcbiAgICBwcml2YXRlIHRpbWUgOiBudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgdG90YWxUaW1lIDogbnVtYmVyID0gMjAwMC4wO1xuXG4gICAgY29uc3RydWN0b3IoaW1hZ2VEYXRhIDogSW1hZ2VEYXRhKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLy8gc2luIGVxdWF0aW9uOiB5ID0gYSpzaW4oYip4ICsgYykgKyBkXG4gICAgICAgIC8vIGEgc2luIHBlcmlvZCBpcyAyUEkgLyBiXG4gICAgICAgIC8vIHdlIHdhbnQgYSBoYWxmIHBlcmlvZCBvZiB0b3RhbFRpbWUgc28gd2UncmUgbG9va2luZyBmb3IgYjogYiA9IDJQSSAvIHBlcmlvZFxuICAgICAgICB0aGlzLmIgPSAoTWF0aC5QSSAqIDIpIC8gKHRoaXMudG90YWxUaW1lICogMik7XG5cbiAgICAgICAgY3JlYXRlSW1hZ2VCaXRtYXAoaW1hZ2VEYXRhKS50aGVuKGltYWdlID0+IHRoaXMuaW1hZ2UgPSBpbWFnZSk7XG4gICAgfVxuXG4gICAgZ2V0IE9uRW5kKCkgOiBMaXRlRXZlbnQ8VHJhbnNpdGlvbiwgdm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25FbmQuRXhwb3NlKCk7XG4gICAgfVxuXG4gICAgRHJhdyhjYW52YXMgOiBDYW52YXMpIDogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbnZhcy5EcmF3QmFja2dyb3VuZEltYWdlKHRoaXMuaW1hZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FudmFzLkRyYXdSZWN0KG5ldyBQb2ludCgpLCBjYW52YXMuU2l6ZSwgYHJnYmEoMC4wLCAwLjAsIDAuMCwgJHtNYXRoLnNpbih0aGlzLmIgKiB0aGlzLnRpbWUpfSlgKTtcbiAgICB9XG5cbiAgICBTdGVwKGRlbHRhIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICB0aGlzLnRpbWUgKz0gZGVsdGE7XG5cbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgIT0gbnVsbCAmJiB0aGlzLnRpbWUgPj0gdGhpcy50b3RhbFRpbWUgLyAyKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbWUgPj0gdGhpcy50b3RhbFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX29uRW5kLlRyaWdnZXIodGhpcywgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9jb25maWdcIjtcblxuY2xhc3MgQ2xhc3NMb2FkZXIge1xuICAgIExvYWRJbWFnZShVUkwgOiBzdHJpbmcpIDogUHJvbWlzZTxJbWFnZUJpdG1hcD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUgOiBGdW5jdGlvbiwgcmVqZWN0IDogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdvcmtlciA6IFdvcmtlciA9IHRoaXMuY3JlYXRlV29ya2VyKCk7XG5cbiAgICAgICAgICAgIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZ0IDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2dC5kYXRhLmVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZFwiLCBldnQpXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZFwiLCBldnQpXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZXZ0LmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3b3JrZXIudGVybWluYXRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKENvbmZpZy5Sb290UGF0aElzUmVtb3RlID9cbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly8ke0NvbmZpZy5Sb290UGF0aCA/IENvbmZpZy5Sb290UGF0aCArIFwiL1wiIDogXCJcIn0ke1VSTH1gXG4gICAgICAgICAgICAgICAgOiBgJHtDb25maWcuUm9vdFBhdGggPyBDb25maWcuUm9vdFBhdGggKyBcIi9cIiA6IFwiXCJ9JHt3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bXlxcXFxcXC9dKiQvLCBcIlwiKX0ke1VSTH1gKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVXb3JrZXIoKSA6IFdvcmtlciB7XG4gICAgICAgIHJldHVybiBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW2AoZnVuY3Rpb24gJHt0aGlzLndvcmtlcn0pKClgXSkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHdvcmtlcigpIHtcbiAgICAgICAgY29uc3QgY3R4IDogV29ya2VyID0gc2VsZiBhcyBhbnk7XG4gICAgICAgIGN0eC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoZXZ0IDogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBmZXRjaChldnQuZGF0YSkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5ibG9iKCkpLnRoZW4oYmxvYkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUltYWdlQml0bWFwKGJsb2JEYXRhKS50aGVuKGltYWdlID0+IGN0eC5wb3N0TWVzc2FnZShpbWFnZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IExvYWRlciA9IG5ldyBDbGFzc0xvYWRlcigpO1xuIiwiaW1wb3J0ICogYXMgSW5rSnMgZnJvbSBcImlua2pzXCI7XG5pbXBvcnQgeyBBdWRpbywgQXVkaW9GYWN0b3J5IH0gZnJvbSBcIi4vYXVkaW9cIjtcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gXCIuL2NhbnZhc1wiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBCb3hCYWNrZ3JvdW5kVHlwZXMgfSBmcm9tIFwiLi9sYXllcnMvYm94YmFja2dyb3VuZHNcIjtcbmltcG9ydCAqIGFzIExheWVycyBmcm9tIFwiLi9sYXllcnMvbGF5ZXJzXCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3BvaW50XCI7XG5pbXBvcnQgeyBQcmVsb2FkZXIgfSBmcm9tIFwiLi9wcmVsb2FkZXJcIjtcblxuZXhwb3J0IGNsYXNzIFZOIHtcbiAgICBBdWRpbyA6IEF1ZGlvO1xuICAgIENhbnZhcyA6IENhbnZhcztcbiAgICBTdG9yeSA6IElua0pzLlN0b3J5O1xuXG4gICAgcHJpdmF0ZSBiYWNrZ3JvdW5kIDogTGF5ZXJzLkJhY2tncm91bmQ7XG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXJzIDogTGF5ZXJzLkNoYXJhY3RlcnM7XG4gICAgcHJpdmF0ZSBjaG9pY2VTY3JlZW4gOiBMYXllcnMuQ2hvaWNlTGF5ZXI7XG4gICAgcHJpdmF0ZSBjdXJyZW50U2NyZWVuIDogTGF5ZXJzLkdhbWVwbGF5TGF5ZXI7XG4gICAgcHJpdmF0ZSBwcmV2aW91c1RpbWVzdGFtcCA6IG51bWJlcjtcbiAgICBwcml2YXRlIHNwZWFraW5nQ2hhcmFjdGVyTmFtZSA6IHN0cmluZyA9IFwiXCI7XG4gICAgcHJpdmF0ZSBzcGVlY2hTY3JlZW4gOiBMYXllcnMuU3BlZWNoTGF5ZXI7XG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uIDogTGF5ZXJzLlRyYW5zaXRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihzdG9yeUZpbGVuYW1lIDogc3RyaW5nLCBjb250YWluZXJJRCA6IHN0cmluZykge1xuICAgICAgICB0aGlzLkF1ZGlvID0gQXVkaW9GYWN0b3J5LkNyZWF0ZSgpO1xuXG4gICAgICAgIHRoaXMuQ2FudmFzID0gbmV3IENhbnZhcyhjb250YWluZXJJRCwgQ29uZmlnLlNjcmVlblNpemUpO1xuXG4gICAgICAgIGZldGNoKHN0b3J5RmlsZW5hbWUpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKS50aGVuKHJhd1N0b3J5ID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGVkIGpzb25cIiwgcmF3U3RvcnkpO1xuICAgICAgICAgICAgdGhpcy5TdG9yeSA9IG5ldyBJbmtKcy5TdG9yeShyYXdTdG9yeSk7XG4gICAgICAgICAgICBDb25maWcuTG9hZCh0aGlzLlN0b3J5Lmdsb2JhbFRhZ3MgfHwgW10pO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuU2l6ZSA9IENvbmZpZy5TY3JlZW5TaXplO1xuXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgTGF5ZXJzLkJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IG5ldyBMYXllcnMuQ2hhcmFjdGVycygpO1xuXG4gICAgICAgICAgICB0aGlzLnNwZWVjaFNjcmVlbiA9IG5ldyBMYXllcnMuU3BlZWNoTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSwge1xuICAgICAgICAgICAgICAgIEJhY2tncm91bmQgOiBcInJnYmEoMC4wLCAwLjAsIDAuMCwgMC43NSlcIixcbiAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kVHlwZSA6IEJveEJhY2tncm91bmRUeXBlcy5DT0xPUixcbiAgICAgICAgICAgICAgICBGb250Q29sb3IgOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgRm9udFNpemUgOiAyNCxcbiAgICAgICAgICAgICAgICBIZWlnaHQgOiAyMDAsXG4gICAgICAgICAgICAgICAgSW5uZXJNYXJnaW4gOiBuZXcgUG9pbnQoMzUpLFxuICAgICAgICAgICAgICAgIE91dGVyTWFyZ2luIDogbmV3IFBvaW50KDUwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNob2ljZVNjcmVlbiA9IG5ldyBMYXllcnMuQ2hvaWNlTGF5ZXIodGhpcy5DYW52YXMuU2l6ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuQ2FudmFzLk9uQ2xpY2suT24odGhpcy5tb3VzZUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5DYW52YXMuT25Nb3ZlLk9uKHRoaXMubW91c2VNb3ZlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzVGltZXN0YW1wID0gMDtcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdFN0ZXAoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb21wdXRlVGFncygpIDogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdldEZpbmFsVmFsdWUgPSAodmFsdWUgOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTWF0Y2ggPSB2YWx1ZS5tYXRjaCgvXlxceyhcXHcrKVxcfSQvKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZU1hdGNoICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5TdG9yeS52YXJpYWJsZXNTdGF0ZS4kKHZhbHVlTWF0Y2hbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHRhZ3MgPSB0aGlzLlN0b3J5LmN1cnJlbnRUYWdzO1xuICAgICAgICBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3MubGVuZ3RoOyArK2kpIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gdGFnc1tpXS5tYXRjaCgvXihcXHcrKVxccyo6XFxzKiguKikkLyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYXRjaCB0YWdcIiwgdGFnc1tpXSwgbWF0Y2gpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyB3aGF0IHRhZyBpdCBpc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgOiBzdHJpbmcgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgOiBzdHJpbmcgPSBnZXRGaW5hbFZhbHVlKG1hdGNoWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwcmVsb2FkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zcGxpdChcIixcIikuZm9yRWFjaChfdmFsdWUgPT4gUHJlbG9hZGVyLlByZWxvYWQoX3ZhbHVlLnRyaW0oKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJhY2tncm91bmRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZC5CYWNrZ3JvdW5kSW1hZ2UgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzcHJpdGVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVycy5BZGQodmFsdWUsIHRoaXMuQ2FudmFzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcnMuUmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmdtXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkF1ZGlvLlBsYXlCR00odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uU3RvcEJHTSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZnhcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuQXVkaW8uUGxheVNGWCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNpdGlvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uID0gbmV3IExheWVycy5UcmFuc2l0aW9uKHRoaXMuQ2FudmFzLkdldEltYWdlRGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uT25FbmQuT24oKHNlbmRlciwgYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBVbmtub3duIHRhZ3MgYXJlIHRyZWF0ZWQgYXMgbmFtZXNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVha2luZ0NoYXJhY3Rlck5hbWUgPSBnZXRGaW5hbFZhbHVlKHRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY29udGludWUoKSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKHRoaXMuU3RvcnkuY2FuQ29udGludWUpIHtcbiAgICAgICAgICAgIHRoaXMuU3RvcnkuQ29udGludWUoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuU3RvcnkuY3VycmVudFRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250aW51ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVUYWdzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlY2hTY3JlZW4uU2F5KHRoaXMuU3RvcnkuY3VycmVudFRleHQsIHRoaXMuc3BlYWtpbmdDaGFyYWN0ZXJOYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSB0aGlzLnNwZWVjaFNjcmVlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLlN0b3J5LmN1cnJlbnRDaG9pY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZVRhZ3MoKTtcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlU2NyZWVuLkNob2ljZXMgPSB0aGlzLlN0b3J5LmN1cnJlbnRDaG9pY2VzO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NyZWVuID0gdGhpcy5jaG9pY2VTY3JlZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUT0RPIEl0J3MgdGhlIGVuZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZUNsaWNrKHNlbmRlciA6IENhbnZhcywgY2xpY2tQb3NpdGlvbiA6IFBvaW50KSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50cmFuc2l0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTY3JlZW4gaW5zdGFuY2VvZiBMYXllcnMuQ2hvaWNlTGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNjcmVlbi5Nb3VzZUNsaWNrKGNsaWNrUG9zaXRpb24sIHRoaXMudmFsaWRhdGVDaG9pY2UuYmluZCh0aGlzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4uTW91c2VDbGljayhjbGlja1Bvc2l0aW9uLCAoKSA9PiB0aGlzLmNvbnRpbnVlKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb3VzZU1vdmUoc2VuZGVyIDogQ2FudmFzLCBtb3VzZVBvc2l0aW9uIDogUG9pbnQpIDogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5jdXJyZW50U2NyZWVuLk1vdXNlTW92ZShtb3VzZVBvc2l0aW9uKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHNlbmRlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcXVlc3RTdGVwKCkgOiB2b2lkIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnN0ZXAuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGVwKHRpbWVzdGFtcCA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzVGltZXN0YW1wO1xuICAgICAgICB0aGlzLnByZXZpb3VzVGltZXN0YW1wID0gdGltZXN0YW1wO1xuXG4gICAgICAgIHRoaXMuQ2FudmFzLkNsZWFyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uU3RlcChkZWx0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4uU3RlcChkZWx0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJhY2tncm91bmQuRHJhdyh0aGlzLkNhbnZhcyk7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVycy5EcmF3KHRoaXMuQ2FudmFzKTtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb24uRHJhdyh0aGlzLkNhbnZhcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY3JlZW4uRHJhdyh0aGlzLkNhbnZhcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlcXVlc3RTdGVwKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUNob2ljZShjaG9pY2VJbmRleCA6IG51bWJlcikgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5TdG9yeS5DaG9vc2VDaG9pY2VJbmRleChjaG9pY2VJbmRleCk7XG4gICAgICAgIHRoaXMuY29udGludWUoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIElSZWN0IHtcbiAgICBQb3NpdGlvbiA6IFBvaW50O1xuICAgIFNpemUgOiBQb2ludDtcbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50IHtcbiAgICBwcml2YXRlIHggOiBudW1iZXI7XG4gICAgcHJpdmF0ZSB5IDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKTtcbiAgICBjb25zdHJ1Y3Rvcih4IDogbnVtYmVyKTtcbiAgICBjb25zdHJ1Y3Rvcih4IDogbnVtYmVyLCB5IDogbnVtYmVyKTtcbiAgICBjb25zdHJ1Y3Rvcih4PyA6IG51bWJlciwgeT8gOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XG4gICAgICAgIHRoaXMueSA9IHkgIT0gbnVsbCA/IHkgOiB4ICE9IG51bGwgPyB4IDogMDtcbiAgICB9XG5cbiAgICBnZXQgWCgpIDogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcbiAgICB9XG5cbiAgICBzZXQgWCh4IDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgfVxuXG4gICAgZ2V0IFkoKSA6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgfVxuXG4gICAgc2V0IFkoeSA6IG51bWJlcikge1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIEFkZChwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLlggKyBwb2ludC5YLCB0aGlzLlkgKyBwb2ludC5ZKTtcbiAgICB9XG5cbiAgICBDbG9uZSgpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCwgdGhpcy5ZKTtcbiAgICB9XG5cbiAgICBEaXYocG9pbnQgOiBQb2ludCkgOiBQb2ludCB7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5YIC8gcG9pbnQuWCwgdGhpcy5ZIC8gcG9pbnQuWSk7XG4gICAgfVxuXG4gICAgSXNJblJlY3QocmVjdCA6IElSZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLlggPj0gcmVjdC5Qb3NpdGlvbi5YICYmIHRoaXMuWCA8PSByZWN0LlBvc2l0aW9uLkFkZChyZWN0LlNpemUpLlhcbiAgICAgICAgICAgICYmIHRoaXMuWSA+PSByZWN0LlBvc2l0aW9uLlkgJiYgdGhpcy5ZIDw9IHJlY3QuUG9zaXRpb24uQWRkKHJlY3QuU2l6ZSkuWTtcbiAgICB9XG5cbiAgICBNdWx0KHBvaW50IDogUG9pbnQpIDogUG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMuWCAqIHBvaW50LlgsIHRoaXMuWSAqIHBvaW50LlkpO1xuICAgIH1cblxuICAgIFN1Yihwb2ludCA6IFBvaW50KSA6IFBvaW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQWRkKG5ldyBQb2ludCgtcG9pbnQuWCwgLXBvaW50LlkpKTtcbiAgICB9XG59XG4iLCJjbGFzcyBDbGFzc1ByZWxvYWRlciB7XG4gICAgUHJlbG9hZCh1cmwgOiBzdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGZldGNoKHVybCk7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgUHJlbG9hZGVyID0gbmV3IENsYXNzUHJlbG9hZGVyKCk7XG4iXX0=
