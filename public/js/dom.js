const getButtonById = (id) => document.getElementById(id);
const getDivById = (id) => document.getElementById(id);
export const canvas = document.getElementById("kandi-canvas");
const xInput = document.getElementById("xInput");
const yInput = document.getElementById("yInput");
const loadDesignInput = document.getElementById("importDesign");
const palette = getDivById("color-palette");
const editPalette = getDivById("edit-color-palette");
const paletteContainer = getDivById("color-palette-container");
const editPaletteContainer = getDivById("edit-color-palette-container");
const xDecrease = getButtonById("xDecrease");
const xIncrease = getButtonById("xIncrease");
const yDecrease = getButtonById("yDecrease");
const yIncrease = getButtonById("yIncrease");
const editPaletteBtn = getButtonById("edit-palette");
const doneEditingBtn = getButtonById("done-editing");
const addColorBtn = getButtonById("add-to-palette");
const shiftLeftBtn = getButtonById("shiftLeft");
const shiftRightBtn = getButtonById("shiftRight");
const exportBtn = getButtonById("exportDesign");
export function initListeners(kandi, setKandi) {
    //canvas
    /*canvas.addEventListener('click', evt =>{
        const rect = canvas.getBoundingClientRect();
        kandi.onClick({x: evt.clientX-rect.left, y: evt.clientY-rect.top});
    });*/
    canvas.addEventListener('mousemove', evt => {
        const rect = canvas.getBoundingClientRect();
        kandi.curs.updatePosition({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
    });
    canvas.addEventListener('mousedown', () => kandi.curs.onDown());
    document.addEventListener('mouseup', () => kandi.curs.onUp());
    //increase/decrease size buttons
    xDecrease.onclick = () => {
        kandi.setWidth(kandi.getWidth() - 1);
        xInput.value = kandi.getWidth().toString();
    };
    xIncrease.onclick = () => {
        kandi.setWidth(kandi.getWidth() + 1);
        xInput.value = kandi.getWidth().toString();
    };
    yDecrease.onclick = () => {
        kandi.setHeight(kandi.getHeight() - 1);
        yInput.value = kandi.getHeight().toString();
    };
    yIncrease.onclick = () => {
        kandi.setHeight(kandi.getHeight() + 1);
        yInput.value = kandi.getHeight().toString();
    };
    //palette buttons
    editPaletteBtn.onclick = () => {
        //console.log("edit pressed");//DEV
        paletteContainer.style.display = "none";
        editPaletteContainer.style.display = "block";
    };
    doneEditingBtn.onclick = () => {
        //console.log("done pressed");//DEV
        paletteContainer.style.display = "block";
        editPaletteContainer.style.display = "none";
    };
    addColorBtn.onclick = () => {
        kandi.palette.push("#ffffff");
        palette.appendChild(createPaletteButton(kandi.palette[kandi.palette.length - 1], kandi.palette.length - 1, kandi));
        editPalette.appendChild(createEditPaletteButton(kandi.palette[kandi.palette.length - 1], kandi.palette.length - 1, kandi));
    };
    //shift left/right buttons
    shiftLeftBtn.onclick = () => kandi.shiftLeft();
    shiftRightBtn.onclick = () => kandi.shiftRight();
    //export/import
    exportBtn.onclick = () => {
        const dlElem = document.createElement("a");
        const paletteStr = kandi.palette.join(",") + "\n";
        const designStr = kandi.design.map((row) => row.join(",")).join("\n");
        dlElem.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(paletteStr + designStr)}`);
        dlElem.setAttribute("download", "kandi_design.csv");
        dlElem.style.width = "0";
        dlElem.style.height = "0";
        document.body.appendChild(dlElem);
        dlElem.click();
        document.body.removeChild(dlElem);
    };
    loadDesignInput.onchange = async () => {
        const fileList = loadDesignInput.files;
        const firstFile = fileList === null || fileList === void 0 ? void 0 : fileList.item(0);
        if (firstFile && (kandi.isEmpty() || confirm("Any unsaved progress will be lost. Continue?"))) {
            const unparsedCSV = await firstFile.text();
            //console.log(unparsedCSV);//DEV
            const arrayOfAll = unparsedCSV.split("\n").map(rowAsStr => rowAsStr.split(","));
            //console.log(arrayOfAll);//DEV
            const newPalette = arrayOfAll.shift();
            const newDesign = arrayOfAll.map(row => row.map(bead => parseInt(bead)));
            //find a way to pass this to index
            kandi.palette = newPalette;
            kandi.design = newDesign;
            clearPalette();
            populatePalette(kandi);
            initDimensionInputs(kandi);
        }
    };
    //change size inputs
    xInput.onchange = () => kandi.setWidth(parseInt(xInput.value));
    yInput.onchange = () => kandi.setHeight(parseInt(yInput.value));
}
function createPaletteButton(color, idx, kandi) {
    const btn = document.createElement("button");
    btn.style.backgroundColor = color;
    //btn.style.color = color;
    //btn.innerText = color;
    btn.style.width = "2rem";
    btn.style.height = "2rem";
    btn.onclick = () => kandi.currColor = idx;
    return btn;
}
function createEditPaletteButton(color, idx, kandi) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = color;
    input.onchange = () => {
        palette.children[idx].style.backgroundColor = input.value;
        kandi.palette[idx] = input.value;
    };
    return input;
}
function clearPalette() {
    while (palette.lastChild)
        palette.removeChild(palette.lastChild);
    while (editPalette.lastChild)
        editPalette.removeChild(editPalette.lastChild);
}
export function populatePalette(kandi) {
    for (let i = 0; i < kandi.palette.length; i++) {
        const color = kandi.palette[i];
        palette.appendChild(createPaletteButton(color, i, kandi));
        editPalette.appendChild(createEditPaletteButton(color, i, kandi));
    }
}
export function initDimensionInputs(kandi) {
    xInput.value = kandi.getWidth().toString();
    yInput.value = kandi.getHeight().toString();
}
