import manifest from "../module.json";
import { getGame } from "./module";

export const enable_settings = [
    "enableFullscreenImagePopout",
    "enableImagePopoutControls",
    "showImageToPlayersOnRightClick",
    "skipShowToPlayersDialog",
    "clearTextfieldOnRightClick",
    "selectTextfieldOnRender",
    "selectTextfieldOnOpenSidebar"
] as const;

function toReadableString(s: string) {
    let r = s.slice(0, 1).toUpperCase();
    for (let i = 1; i < s.length; i++) {
        if (s[i - 1].toLowerCase() == s[i - 1] && s[i].toUpperCase() == s[i]) r += " ";
        r += s[i];
    }
    return r;
}

export const getSettings = (s: (typeof enable_settings)[number]) => {
    return getGame().settings.get(manifest.id, s);
};

export const registerSettings = () => {
    for (const s of enable_settings)
        game.settings.register(manifest.id, s, {
            name: toReadableString(s),
            hint: "",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            requiresReload: true
        });

    game.settings.register(manifest.id, "compassInsetHeight", {
        name: toReadableString("compassInsetHeight"),
        hint: "",
        scope: "world",
        config: true,
        type: Number,
        default: 5,
        requiresReload: true
    });

    game.settings.register(manifest.id, "compassInsetWidth", {
        name: toReadableString("compassInsetWidth"),
        hint: "",
        scope: "world",
        config: true,
        type: Number,
        default: 2.5,
        requiresReload: true
    });

    game.settings.register(manifest.id, "compassSize", {
        name: toReadableString("compassSize"),
        hint: "",
        scope: "world",
        config: true,
        type: Number,
        default: 10,
        requiresReload: true
    });
};
