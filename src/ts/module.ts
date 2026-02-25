import manifest from "../module.json";

const socketName = `module.` + manifest.id;

function getNextPopout() {
    const imagePopout = document.querySelector(".image-popout") as HTMLButtonElement;
    if (imagePopout) return imagePopout;

    const legacyImagePopout = document.querySelector(".image-popout") as HTMLButtonElement;
    if (legacyImagePopout) return legacyImagePopout;

    const journalPopout = document.querySelector(".journal-sheet") as HTMLButtonElement;
    if (journalPopout) return journalPopout;
}

const closeImagePopout = () => {
    const popOut = getNextPopout();
    if (!popOut) return;

    const imagePopout = popOut.querySelector('button[data-action="close"]') as HTMLButtonElement;
    if (imagePopout) {
        imagePopout.click();
        return;
    }

    const legacyImagePopout = popOut.querySelector("a.close") as HTMLButtonElement;
    if (legacyImagePopout) {
        legacyImagePopout.click();
        return;
    }
};

const rotateImagePopout = () => {
    const popOut = getNextPopout();
    if (!popOut) return;

    let isImg = true;
    let windowContent = popOut.querySelector('figure[data-application-part="popout"] img') as HTMLElement;
    if (!windowContent) {
        windowContent = popOut.querySelector("section.window-content") as HTMLElement;
        isImg = false;
    }

    let rotation = -90;
    if (windowContent.style.rotate.endsWith("deg")) {
        rotation += Number(windowContent.style.rotate.substring(0, windowContent.style.rotate.length - 3));
    }
    rotation += 360;
    rotation %= 360;
    windowContent.style.rotate = rotation + "deg";

    if (isImg) {
        const img = windowContent as HTMLImageElement;
        if (Math.round(rotation) == 90 || Math.round(rotation) == 270) {
            img.parentElement.style.aspectRatio = "" + img.naturalHeight / img.naturalWidth;

            const pW = (img.naturalWidth / img.naturalHeight) * 100;
            const pH = (img.naturalHeight / img.naturalWidth) * 100;

            img.style.left = (100 - pW) / 2 + "%";
            img.style.top = (100 - pH) / 2 + "%";
            img.style.height = pH + "%";
        } else {
            img.parentElement.style.aspectRatio = "" + img.naturalWidth / img.naturalHeight;

            img.style.top = "";
            img.style.left = "";
            img.style.width = "auto";
            img.style.height = "100%";
        }
    }
};

const doubleFlipImagePopout = () => {
    const popOut = getNextPopout();
    if (!popOut) return;

    let windowContent = popOut.querySelector("section.window-content") as HTMLElement;
    windowContent.style.flexBasis = "content";
    windowContent.style.flexGrow = "0";

    const clone = windowContent.cloneNode(true);
    windowContent.style.rotate = "180deg";

    windowContent.parentElement.style.flexDirection = "row";
    windowContent.parentElement.style.justifyContent = "center";
    windowContent.parentElement.style.gap = "2em";
    windowContent.parentElement.appendChild(clone);
    console.log(windowContent.parentElement);
};

function getGame() {
    return game as Game;
}

const commands = {
    close: closeImagePopout,
    rotate: rotateImagePopout,
    doubleFlip: doubleFlipImagePopout
};

let ctrlPressed = false;
Hooks.once("ready", () => {
    if (getGame().user!.isGM) {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Control") ctrlPressed = true;
        });
        window.addEventListener("keyup", (e) => {
            if (e.key === "Control") ctrlPressed = false;
        });

        window.addEventListener("keydown", (e) => {
            if ((e.target as HTMLElement).tagName.toUpperCase() == "INPUT") return;
            if ((e.target as HTMLElement).tagName.toUpperCase() == "TEXTAREA") return;

            let cmd;

            if (e.key == "Escape") cmd = "close";
            if (e.key == "ArrowRight") cmd = "rotate";
            if (e.key == "ArrowUp") cmd = "doubleFlip";

            if (cmd) {
                if (["close"].includes(cmd)) commands[cmd]();
                getGame().socket!.emit(socketName, cmd);
            }
        });
    }

    getGame().socket!.on(socketName, (cmd) => commands[cmd]());
});

Hooks.on("renderShowToPlayersDialog", (app, html: HTMLElement, context, o) => {
    if (ctrlPressed) return;

    const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (btn) {
        btn.click();
        html.style.opacity = "0";
    }
});

Hooks.on("renderImagePopout", (app, html: HTMLElement, context, o) => {
    if (getGame().user!.isGM) return;
    setTimeout(() => {
        html.style = "";
        html.style.width = "100%";
        html.style.maxWidth = "100%";
        html.style.height = "100%";
        html.style.maxHeight = "100%";
        html.style.left = "0";
        html.style.right = "0";
        html.style.bottom = "0";
        html.style.top = "0";
        html.style.border = "none";

        app.window.content.style.padding = "0";
        app.window.content.style.justifyContent = "center";
        app.window.content.style.alignItems = "center";

        app.window.content.children[0].style.padding = "0";
        app.window.content.children[0].style.maxWidth = "100%";
        app.window.content.children[0].style.maxHeight = "100%";
        app.window.content.children[0].style.objectFit = "contain";
        app.window.content.children[0].style.width = "auto";
        app.window.content.children[0].style.height = "auto";
        app.window.content.children[0].style.flexGrow = "0";
        app.window.content.children[0].style.display = "block";
    }, 1);

    const img = app.window.content.children[0].children[0];

    img.onload = () => {
        setTimeout(() => {
            img.style.margin = "0";
            img.style.position = "relative";
            img.style.transformOrigin = "center center";
            img.style.maxWidth = "none";
            img.style.maxHeight = "none";

            img.style.top = "0";
            img.style.width = "auto";
            img.style.height = "100%";

            app.window.content.children[0].style.aspectRatio = "" + img.naturalWidth / img.naturalHeight;
        }, 1);
    };
});
