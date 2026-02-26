import { closeImagePopout, doubleFlipImagePopout, rotateImagePopout } from "./image-popout";
import { getGame, moduleId } from "./module";

export const registerImagePopoutControls = () => {
    Hooks.once("ready", () => {
        if (getGame().user!.isGM) {
            window.addEventListener("keydown", (e) => {
                if ((e.target as HTMLElement).tagName.toUpperCase() == "INPUT") return;
                if ((e.target as HTMLElement).tagName.toUpperCase() == "TEXTAREA") return;

                let cmd;

                if (e.key == "Escape" || e.key == "Backspace") cmd = "close";
                if (e.key == "ArrowRight") cmd = "rotate";
                if (e.key == "ArrowUp") cmd = "doubleFlip";

                if (cmd) {
                    getGame().socket!.emit(moduleId, cmd);
                }
            });
        }

        const commands = {
            close: closeImagePopout,
            rotate: rotateImagePopout,
            doubleFlip: doubleFlipImagePopout
        };
        getGame().socket!.on(moduleId, (cmd) => commands[cmd]());
    });
};
