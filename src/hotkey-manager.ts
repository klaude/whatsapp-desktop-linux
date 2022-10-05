import { BrowserWindow, Event, Input } from "electron";
import WhatsApp from "./whatsapp";

interface ClickAction {
    control?: boolean,
    keys: Array<string>,
    action: () => void
}

export default class HotkeyManager {

    private readonly actions = new Array<ClickAction>();

    constructor(
        private readonly whatsApp: WhatsApp,
        private readonly window: BrowserWindow
    ) { }

    public init() {
        this.registerHotkeys();
        this.registerListeners();
    }

    public add(...clickActions: Array<ClickAction>) {
        clickActions.forEach(action => this.actions.push(action));
    }

    private onInput(event: Event, input: Input) {
        this.actions.forEach(clickAction => {
            if (input.control === clickAction.control && clickAction.keys.includes(input.key.toUpperCase())) {
                clickAction.action();
                event.preventDefault();
            }
        });
    }

    private registerHotkeys() {
        this.add(
            {
                control: true,
                keys: ["+"],
                action: () => {
                    if (this.window.webContents.getZoomFactor() < 3)
                        this.window.webContents.zoomLevel += 1
                }
            },
            {
                control: true,
                keys: ["0"],
                action: () => this.window.webContents.setZoomLevel(0)
            },
            {
                control: true,
                keys: ["-"],
                action: () => {
                    if (this.window.webContents.getZoomFactor() > 0.5)
                        this.window.webContents.zoomLevel -= 1
                }
            },
            {
                keys: ["F5"],
                action: () => this.whatsApp.reload()
            },
            {
                control: true,
                keys: ["R"],
                action: () => this.whatsApp.reload()
            },
            {
                control: true,
                keys: ["W"],
                action: () => this.window.hide()
            },
            {
                control: true,
                keys: ["Q"],
                action: () => this.whatsApp.quit()
            }
        );
    }

    private registerListeners() {
        this.window.webContents.on('before-input-event', (event, input) => this.onInput(event, input));
    }
};
