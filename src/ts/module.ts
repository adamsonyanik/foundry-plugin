import manifest from "../module.json";
import {
    registerTextFieldClearOnRightClick,
    registerTextFieldSelectOnOpenSidebar,
    registerTextFieldSelectOnRender
} from "./text-field-select-all-on-right-click";
import { registerSkipShowToPlayersDialog } from "./skip-show-to-players-dialog";
import { registerShowToPlayersOnRightClick } from "./show-to-players-on-right-click";
import { registerImagePopoutControls } from "./gm-image-control";
import { registerFullscreenImagePopout } from "./image-popout";
import { getSettings, registerSettings } from "./settings";

export const moduleId = `module.` + manifest.id;
export const input = {
    ctrl: false
};

export const getGame = () => {
    return game as Game;
};

function main() {
    Hooks.once("init", () => {
        //CONFIG.debug.hooks = true;

        registerSettings();

        if (getSettings("enableFullscreenImagePopout")) registerFullscreenImagePopout();
        if (getSettings("enableImagePopoutControls")) registerImagePopoutControls();

        if (getSettings("showImageToPlayersOnRightClick")) registerShowToPlayersOnRightClick();
        if (getSettings("skipShowToPlayersDialog")) registerSkipShowToPlayersDialog();

        if (getSettings("clearTextfieldOnRightClick")) registerTextFieldClearOnRightClick();
        if (getSettings("selectTextfieldOnRender")) registerTextFieldSelectOnRender();
        if (getSettings("selectTextfieldOnOpenSidebar")) registerTextFieldSelectOnOpenSidebar();
    });

    Hooks.once("ready", () => {
        if (getGame().user!.isGM) {
            window.addEventListener("keydown", (e) => {
                if (e.key === "Control") input.ctrl = true;
            });
            window.addEventListener("keyup", (e) => {
                if (e.key === "Control") input.ctrl = false;
            });
        }
    });
}

if (!(window as any)["__" + moduleId + "__myModuleInitialized"]) {
    (window as any)["__" + moduleId + "__myModuleInitialized"] = true;
    main();
}
