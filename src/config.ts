import { Point } from "./point";

class ClassConfig {
    DefaultTextSpeed : number = 30;
    RootPath : string = "";
    RootPathIsRemote: boolean = false;
    ScreenSize : Point = new Point(800, 600);

    private textSpeed : number;
    private textSpeedRatio : number;

    constructor() {
        this.TextSpeed = this.DefaultTextSpeed; // This is in char per second
    }

    Load(tags : string[]) : void {
        function error(tag : string) {
            console.error(`Error reading tag: "${tag}"`);
        }

        for (let i = 0; i < tags.length; ++i) {
            let key, value;
            try {
                key = tags[i].split(":")[0].trim();
                value = tags[i].split(":")[1].trim();
            } catch (e) {
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
                            this.ScreenSize = new Point(size[0], size[1]);
                        } else {
                            throw new TypeError();
                        }
                        break;
                    }
                    case "text_speed":
                    case "textspeed": {
                        const speed = parseInt(value, 10);
                        if (!isNaN(speed)) {
                            this.DefaultTextSpeed = this.TextSpeed = speed;
                        } else {
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
            } catch (e) {
                if (e instanceof TypeError) {
                    error(tags[i]);
                }
            }
        }
    }

    get TextSpeed() : number {
        return this.textSpeed;
    }

    set TextSpeed(value : number) {
        this.textSpeed = value;
        this.textSpeedRatio = 1000.0 / this.textSpeed;
    }

    get TextSpeedRatio() : number {
        return this.textSpeedRatio;
    }
}

export let Config = new ClassConfig();
