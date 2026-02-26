import { input } from "./module";

export const registerSkipShowToPlayersDialog = () => {
    Hooks.on("renderShowToPlayersDialog", (app, html: HTMLElement, context, o) => {
        if (input.ctrl) return;

        const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (btn) {
            btn.click();
            html.style.opacity = "0";
        }
    });
};
