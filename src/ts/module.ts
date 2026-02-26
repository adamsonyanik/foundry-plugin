import manifest from "../module.json";

const socketName = `module.` + manifest.id;

function getNextPopout() {
    const imagePopout = [...document.querySelectorAll(".image-popout")].at(-1) as HTMLElement;
    if (imagePopout) return imagePopout;

    const legacyImagePopout = [...document.querySelectorAll(".image-popout")].at(-1) as HTMLElement;
    if (legacyImagePopout) return legacyImagePopout;

    const journalPopout = [...document.querySelectorAll(".journal-sheet")].at(-1) as HTMLElement;
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
    let windowContent = popOut.querySelector("section.window-content img") as HTMLElement;
    if (!windowContent) {
        windowContent = popOut.querySelector("section.window-content") as HTMLElement;
        isImg = false;
    }

    if (isImg) {
        const divs = popOut.querySelectorAll("section.window-content div");
        for (const d of divs) {
            let rotation = -90;
            if (d.style.rotate.endsWith("deg"))
                rotation += Number(d.style.rotate.substring(0, d.style.rotate.length - 3));
            rotation += 360;
            rotation %= 360;
            setImg(d.parentElement.clientWidth, d.parentElement.clientHeight, rotation, d);
        }
    } else {
        let rotation = -90;
        if (windowContent.style.rotate.endsWith("deg"))
            rotation += Number(windowContent.style.rotate.substring(0, windowContent.style.rotate.length - 3));
        rotation += 360;
        rotation %= 360;
        windowContent.style.rotate = rotation + "deg";
    }
};
const doubleFlipImagePopout = () => {
    const popOut = getNextPopout();
    if (!popOut) return;

    let windowContent = [...popOut.querySelectorAll("section.window-content")];

    if (windowContent.length > 1) {
        for (const o of windowContent.slice(1)) o.remove();
        setImg(windowContent[0].clientWidth, windowContent[0].clientHeight, 0, windowContent[0].children[0]);
        return;
    }

    const section = windowContent[0];

    section.parentElement.style.flexDirection = "row";
    section.parentElement.style.justifyContent = "center";
    section.parentElement.style.gap = "2em";

    section.flexBasis = "content";
    section.flexGrow = "0";
    section.flexShrink = "1";

    const clone = section.cloneNode(true);
    section.parentElement.appendChild(clone);

    setImg(section.clientWidth, section.clientHeight, 0, section.children[0]);
    setImg(section.clientWidth, section.clientHeight, 180, clone.children[0], section.children[0].children[0]);
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

            if (e.key == "Escape" || e.key == "Backspace") cmd = "close";
            if (e.key == "ArrowRight") cmd = "rotate";
            if (e.key == "ArrowUp") cmd = "doubleFlip";

            if (cmd) {
                getGame().socket!.emit(socketName, cmd);
            }
        });

        document.addEventListener("contextmenu", (event) => {
            const tgt = event.target as HTMLImageElement;
            if (tgt && tgt.tagName === "IMG") {
                // Ignore Token HUD (status effects), Sidebar, and Buttons
                if (tgt.closest("#token-hud") || tgt.closest("#sidebar") || tgt.closest("button")) return;

                // @ts-ignore
                new foundry.applications.apps.ImagePopout({ src: tgt.src, shareable: true }).shareImage();
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

function setImg(cW: number, cH: number, rotation: number, div: HTMLElement, img?: HTMLImageElement) {
    if (!img) img = div.children[0] as HTMLImageElement;
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    const cAR = cW / cH;

    div.style.rotate = rotation + "deg";

    console.log(aspectRatio, 1 / aspectRatio, cAR);
    let dW = 0;
    let dH = 0;

    if (rotation == 90 || rotation == 270) {
        if (1 / aspectRatio > cAR) {
            dW = aspectRatio * cW;
            dH = cW;
        } else {
            dW = cH;
            dH = (1 / aspectRatio) * cH;
        }
    } else {
        if (aspectRatio > cAR) {
            dW = cW;
            dH = (1 / aspectRatio) * cW;
        } else {
            dW = aspectRatio * cH;
            dH = cH;
        }
    }

    div.style.width = (dW / cW) * 100 + "%";
    div.style.height = (dH / cH) * 100 + "%";
}

Hooks.on("renderImagePopout", (app, html: HTMLElement, context, o) => {
    if (getGame().user!.isGM) return;

    const section = app.window.content;
    const figure = section.children[0];
    const img = figure.children[0];

    img.onload = () => {
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

        img.style.margin = "0";
        img.style.width = "100%";
        img.style.height = "100%";

        const cW = section.clientWidth;
        const cH = section.clientHeight;

        const clone = section.cloneNode();
        section.parentElement.appendChild(clone);
        section.remove();

        clone.style.padding = "0";
        clone.style.justifyContent = "center";
        clone.style.alignItems = "center";

        const div = document.createElement("div");
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.display = "flex";
        div.style.justifyContent = "center";
        clone.appendChild(div);

        div.appendChild(img);

        setImg(cW, cH, 0, div);
    };
});
