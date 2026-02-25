"use strict";
const socketName = `module.adamsonyanik`;
const closeImagePopout = () => {
    const imagePopout = document.querySelector('.image-popout button[data-action="close"');
    if (imagePopout) {
        imagePopout.click();
        return;
    }
    const legacyImagePopout = document.querySelector(".image-popout a.close");
    if (legacyImagePopout) {
        legacyImagePopout.click();
        return;
    }
    const journalPopout = document.querySelector(".journal-sheet a.close");
    if (journalPopout) {
        journalPopout.click();
        return;
    }
};
const ready = () => {
    if ("user" in game && game.user.isGM) {
        document.addEventListener("keypress", (e) => {
            if (e.key == game.settings.get(constants.modName, "hotkey") &&
                e.target.tagName.toUpperCase() != "INPUT" &&
                e.target.tagName.toUpperCase() != "TEXTAREA") {
                closeImagePopout();
                game.socket.emit(socketName);
            }
        });
    }
    game.socket.on(socketName, closeImagePopout);
};
Hooks.on("ready", ready);
