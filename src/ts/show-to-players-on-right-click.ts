import { getGame } from "./module";

export const registerShowToPlayersOnRightClick = () => {
    Hooks.once("ready", () => {
        if (!getGame().user!.isGM) return;

        document.addEventListener("contextmenu", (event) => {
            const tgt = event.target as HTMLImageElement;
            if (tgt && tgt.tagName === "IMG") {
                // Ignore Token HUD (status effects), Sidebar, and Buttons
                if (tgt.closest("#token-hud") || tgt.closest("#sidebar") || tgt.closest("button")) return;

                // @ts-ignore
                new foundry.applications.apps.ImagePopout({ src: tgt.src, shareable: true }).shareImage();
            }
        });
    });
};
