export const canvas = document.getElementById("kandi-canvas");
export const xDecrease = document.getElementById("xDecrease");
export const xInput = document.getElementById("xInput");
export const xIncrease = document.getElementById("xIncrease");
export const yDecrease = document.getElementById("yDecrease");
export const yInput = document.getElementById("yInput");
export const yIncrease = document.getElementById("yIncrease");
export const paletteContainer = document.getElementById("color-palette");
export const editPaletteContainer = document.getElementById("edit-current-colors");
export function initListeners(kandi) {
    //set up event listeners
    //buttons: onclick
    //inputs: onfocusout
    //canvas: onclick
    canvas.addEventListener('click', (evt) => {
        const rect = canvas.getBoundingClientRect();
        kandi.onClick({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
    });
}
function createPaletteButton(color, idx, kandi) {
    const btn = document.createElement("button");
    btn.style.backgroundColor = color;
    //btn.style.color = color;
    //btn.innerText = color;
    btn.style.width = "2rem";
    btn.style.height = "2rem";
    btn.addEventListener("click", () => kandi.currColor = idx);
    return btn;
}
function createEditPaletteButton(color, idx) {
}
export function populatePalette(kandi) {
    kandi.palette.forEach((color, idx) => paletteContainer.appendChild(createPaletteButton(color, idx, kandi)));
}
