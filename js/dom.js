import { Pencil, Fill } from './tools.js';
const getButtonById = (id) => document.getElementById(id);
const getDivById = (id) => document.getElementById(id);
export const canvas = document.getElementById("kandi-canvas");
const xInput = document.getElementById("xInput");
const yInput = document.getElementById("yInput");
const loadDesignInput = document.getElementById("importDesign");
const beadCountsList = document.getElementById("bead-counts");
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
const pencilBtn = getButtonById("pencil-btn");
const fillBtn = getButtonById("fill-btn");
/**
 * Initializes event listeners for all static elements on the page
 * @param kandi The {@link Kandi} singleton for the page
 * @param curs The {@link Cursor} singleton for the page
 * @param setTool A function to set the {@link Tool} singleton to a new {@link Tool}
 */
export function initListeners(kandi, curs, setTool) {
    //canvas
    canvas.addEventListener('mousemove', evt => {
        const rect = canvas.getBoundingClientRect();
        curs.updatePosition({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
    });
    canvas.addEventListener('mousedown', () => curs.onDown());
    document.addEventListener('mouseup', () => {
        curs.onUp();
        updateBeadCounts(kandi);
    });
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
        palette.appendChild(createPaletteItem(kandi.palette[kandi.palette.length - 1], kandi.palette.length - 1, kandi));
        editPalette.appendChild(createEditPaletteItem(kandi.palette[kandi.palette.length - 1], kandi.palette.length - 1, kandi));
    };
    //tool buttons
    pencilBtn.onclick = () => {
        setTool(new Pencil());
        showSelection(pencilBtn);
    };
    fillBtn.onclick = () => {
        setTool(new Fill());
        showSelection(fillBtn);
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
/**
 * @param list The element to get children from
 * @returns A list of HTMLCollections containing the children of `list`'s children
 */
function childrenOfChildren(list) {
    const out = [];
    for (const li of list.children) {
        out.push(li.children);
    }
    return out;
}
/**
 * Applies the "selected" class to `selectedElem` and removes the "selected" class
 * from any other elements in `selectedElem`'s parent. If `selectedElem`'s parent
 * is an <li>, the function will effectively ignore the <li>s and work instead on
 * the parent element of the <li> and the firt child of each <li> in the parent.
 *
 * @param selectedElem The element to be selected
 */
function showSelection(selectedElem) {
    let parentElem = selectedElem.parentElement;
    //if elements are wrapped in LI's, the work on the first element in each LI
    if (parentElem.tagName === "LI") {
        parentElem = parentElem.parentElement;
        for (const children of childrenOfChildren(parentElem)) {
            const btn = children[0];
            btn.classList.remove("selected");
        }
    }
    else {
        for (const child of parentElem.children) {
            child.classList.remove("selected");
        }
    }
    selectedElem.classList.add("selected");
}
/**
 * Sets `k`'s current color to `colorIdx` and shows that `btn` has been selected
 * @param k the {@link Kandi} singleton
 * @param colorIdx the index of the selected color
 * @param btn the pressed <button>
 */
function selectColor(k, colorIdx, btn) {
    k.currColor = colorIdx;
    showSelection(btn);
}
/**
 * @param color the color for the <button>
 * @param idx the index of the color in `kandi.palette`
 * @param kandi the {@link Kanid} singleton
 * @return An <li> containing a color palette <button>
 */
function createPaletteItem(color, idx, kandi) {
    const btn = document.createElement("button");
    btn.style.backgroundColor = color;
    //btn.className = "palette-btn";
    btn.onclick = () => selectColor(kandi, idx, btn);
    const li = document.createElement("li");
    li.appendChild(btn);
    return li;
}
/**
 * @param color the color for the <input>
 * @param idx the index of the color in `kandi.palette`
 * @param kandi the {@link Kanid} singleton
 * @return An <li> containing a color <input> for editing the color palette
 */
function createEditPaletteItem(color, idx, kandi) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = color;
    input.onchange = () => {
        const paletteBtn = childrenOfChildren(palette)[idx][0];
        paletteBtn.style.backgroundColor = input.value;
        kandi.palette[idx] = input.value;
    };
    const li = document.createElement("li");
    li.appendChild(input);
    return li;
}
/**
 * Clears all children of `elem`
 * @param elem The element to be cleared
 */
function clearChildren(elem) {
    while (elem.lastChild)
        elem.removeChild(elem.lastChild);
}
/**
 * Clears the the color palette and edit palette
 */
function clearPalette() {
    clearChildren(palette);
    clearChildren(editPalette);
}
/**
 * Populates the color palette and edit palette based on `kandi.palette`
 * @param kandi the {@link Kandi} singleton
 */
export function populatePalette(kandi) {
    for (let i = 0; i < kandi.palette.length; i++) {
        const color = kandi.palette[i];
        const li = createPaletteItem(color, i, kandi);
        const btn = li.firstElementChild;
        if (i === kandi.currColor) {
            btn.classList.add("selected");
        }
        palette.appendChild(li);
        editPalette.appendChild(createEditPaletteItem(color, i, kandi));
    }
}
/**
 * sets the values of the dimension <input>s to the width and height of `kandi`
 * @param kandi the {@link Kandi} singleton
 */
export function initDimensionInputs(kandi) {
    xInput.value = kandi.getWidth().toString();
    yInput.value = kandi.getHeight().toString();
}
/**
 * Updates the bead counts
 * @param kandi the {@link Kandi} singleton
 */
export function updateBeadCounts(kandi) {
    clearChildren(beadCountsList);
    const amounts = {};
    for (let i = 0; i < kandi.design.length; i++) {
        const row = kandi.design[i];
        for (let j = 0; j < row.length; j++) {
            const bead = row[j];
            if (!amounts[bead])
                amounts[bead] = 1;
            else
                amounts[bead]++;
        }
    }
    for (const paletteColor in amounts) {
        if (Object.prototype.hasOwnProperty.call(amounts, paletteColor)) {
            const amnt = amounts[paletteColor];
            const colorLabel = document.createElement('span');
            colorLabel.className = "bead-count-color-label";
            colorLabel.style.backgroundColor = kandi.palette[paletteColor];
            const amntLabel = document.createTextNode(amnt.toString());
            const listItem = document.createElement("li");
            listItem.appendChild(colorLabel);
            listItem.appendChild(amntLabel);
            beadCountsList.appendChild(listItem);
        }
    }
}
