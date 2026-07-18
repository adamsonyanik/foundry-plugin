import { closeImagePopout, doubleFlipImagePopout, rotateImagePopout, toggleCompass } from "./image-popout";
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
                if (e.code == "KeyC") cmd = "toggleCompass";

                if (cmd) {
                    getGame().socket!.emit(moduleId, cmd);
                }
            });
        }

        const commands = {
            close: closeImagePopout,
            rotate: rotateImagePopout,
            doubleFlip: doubleFlipImagePopout,
            toggleCompass: toggleCompass
        };
        getGame().socket!.on(moduleId, (cmd: keyof typeof commands) => commands[cmd]());
    });
};
