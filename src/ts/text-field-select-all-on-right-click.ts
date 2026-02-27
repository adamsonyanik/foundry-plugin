import { getGame } from "./module";

export const registerTextFieldClearOnRightClick = () => {
    Hooks.once("ready", () => {
        if (!getGame().user!.isGM) return;

        document.addEventListener("contextmenu", (e) => {
            const field = (e.target as HTMLElement).closest("input");
            if (!field || field.tagName !== "INPUT") return;
            if (["checkbox", "radio", "file", "range", "submit", "button", "image", "hidden"].includes(field.type))
                return;
            //field.select();
            field.value = "";
        });
    });
};

export const registerTextFieldSelectOnRender = () => {
    Hooks.on("activateApplicationV2", selectTextField);
    Hooks.on("renderApplicationV2", selectTextField);
};

export const registerTextFieldSelectOnOpenSidebar = () => {
    Hooks.on("collapseSidebar", (a, b: boolean) => {
        if (!b) selectTextField(a);
    });
    Hooks.on("changeSidebarTab", selectTextField);
};

const selectTextField = (app: Application) => {
    const active = document.activeElement;
    if (
        active &&
        (active instanceof HTMLInputElement ||
            active instanceof HTMLTextAreaElement ||
            (active as HTMLElement).isContentEditable)
    ) {
        return;
    }

    const selector =
        'input:not([type=hidden]):not(:disabled):not([type=checkbox]):not([type=radio]), textarea:not(:disabled), [contenteditable="true"]';
    const candidate = [...(app.element as HTMLElement).querySelectorAll(selector)].find(
        (el) => (el as HTMLElement).offsetParent !== null
    );

    if (candidate) {
        requestAnimationFrame(() => {
            try {
                (candidate as HTMLElement).focus();
                if (candidate instanceof HTMLInputElement || candidate instanceof HTMLTextAreaElement)
                    (candidate as HTMLInputElement).select?.();
            } catch (e) {}
        });
    }
};
