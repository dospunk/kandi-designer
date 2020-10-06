import Kandi from './kandi.js';

const getButtonById = (id: string) => document.getElementById(id) as HTMLButtonElement;
const getDivById = (id: string) => document.getElementById(id) as HTMLDivElement;

export const canvas = document.getElementById("kandi-canvas") as HTMLCanvasElement;
const xInput = document.getElementById("xInput") as HTMLInputElement;
const yInput = document.getElementById("yInput") as HTMLInputElement;
const loadDesignInput = document.getElementById("importDesign") as HTMLInputElement;
const beadCountsList = document.getElementById("bead-counts") as HTMLUListElement;

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


export function initListeners(kandi: Kandi, setKandi: (newKandi: Kandi) => void){
	//canvas
	canvas.addEventListener('mousemove', evt =>{
		const rect = canvas.getBoundingClientRect();
		kandi.curs.updatePosition({x: evt.clientX-rect.left, y: evt.clientY-rect.top});
	});
	canvas.addEventListener('mousedown', () => kandi.curs.onDown());
	document.addEventListener('mouseup', () => {
		kandi.curs.onUp();
		updateBeadCounts(kandi);
	});
	//increase/decrease size buttons
	xDecrease.onclick = () => {
		kandi.setWidth(kandi.getWidth()-1);
		xInput.value = kandi.getWidth().toString();
	};
	xIncrease.onclick = () => {
		kandi.setWidth(kandi.getWidth()+1);
		xInput.value = kandi.getWidth().toString();
	};
	yDecrease.onclick = () => {
		kandi.setHeight(kandi.getHeight()-1);
		yInput.value = kandi.getHeight().toString();
	};
	yIncrease.onclick = () => {
		kandi.setHeight(kandi.getHeight()+1);
		yInput.value = kandi.getHeight().toString();
	};
	//palette buttons
	editPaletteBtn.onclick = () => {
		//console.log("edit pressed");//DEV
		paletteContainer.style.display = "none";
		editPaletteContainer.style.display = "block";
	}
	doneEditingBtn.onclick = () => {
		//console.log("done pressed");//DEV
		paletteContainer.style.display = "block";
		editPaletteContainer.style.display = "none";
	}
	addColorBtn.onclick = () => {
		kandi.palette.push("#ffffff");
		palette.appendChild(createPaletteButton(
			kandi.palette[kandi.palette.length-1],
			kandi.palette.length-1,
			kandi
		));
		editPalette.appendChild(createEditPaletteButton(
			kandi.palette[kandi.palette.length-1],
			kandi.palette.length-1,
			kandi
		));
	}

	//shift left/right buttons
	shiftLeftBtn.onclick = () => kandi.shiftLeft();
	shiftRightBtn.onclick = () => kandi.shiftRight();

	//export/import
	exportBtn.onclick = () => {
		const dlElem = document.createElement("a");
		const paletteStr = kandi.palette.join(",") + "\n";
		const designStr = kandi.design.map((row) => row.join(",")).join("\n");
		dlElem.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(paletteStr+designStr)}`);
		dlElem.setAttribute("download", "kandi_design.csv");
		dlElem.style.width = "0";
		dlElem.style.height = "0";
		document.body.appendChild(dlElem);
		dlElem.click();
		document.body.removeChild(dlElem);
	}
	loadDesignInput.onchange = async () => {
		const fileList = loadDesignInput.files;
		const firstFile = fileList?.item(0);
		if(firstFile && (kandi.isEmpty() || confirm("Any unsaved progress will be lost. Continue?"))){
			const unparsedCSV = await firstFile.text();
			//console.log(unparsedCSV);//DEV
			const arrayOfAll = unparsedCSV.split("\n").map(rowAsStr => rowAsStr.split(","));
			//console.log(arrayOfAll);//DEV
			const newPalette = arrayOfAll.shift();
			const newDesign = arrayOfAll.map(row => row.map(bead => parseInt(bead)));
			//find a way to pass this to index
			kandi.palette = newPalette!;
			kandi.design = newDesign!;
			clearPalette();
			populatePalette(kandi);
			initDimensionInputs(kandi);
		}
	}

	//change size inputs
	xInput.onchange = () => kandi.setWidth(parseInt(xInput.value))
	yInput.onchange = () => kandi.setHeight(parseInt(yInput.value))
}

function createPaletteButton(color: string, idx: number, kandi: Kandi): HTMLButtonElement {
	const btn = document.createElement("button");
	btn.style.backgroundColor = color;
	//btn.className = "palette-btn";
	btn.onclick = () => kandi.currColor = idx;
	return btn;
}

function createEditPaletteButton(color: string, idx: number, kandi: Kandi): HTMLInputElement{
	const input = document.createElement("input");
	input.type = "color";
	input.value = color;
	input.onchange = () => {
		(palette.children[idx] as HTMLButtonElement).style.backgroundColor = input.value;
		kandi.palette[idx] = input.value;
	};
	return input;
}

function clearChildren(elem: HTMLElement){
	while(elem.lastChild) elem.removeChild(elem.lastChild);
}

function clearPalette(){
	clearChildren(palette);
	clearChildren(editPalette);
}

export function populatePalette(kandi: Kandi){
	for (let i = 0; i < kandi.palette.length; i++) {
		const color = kandi.palette[i];
		palette.appendChild(createPaletteButton(color, i, kandi));
		editPalette.appendChild(createEditPaletteButton(color, i, kandi));
	}
}

export function initDimensionInputs(kandi: Kandi){
	xInput.value = kandi.getWidth().toString();
	yInput.value = kandi.getHeight().toString();
}

export function updateBeadCounts(kandi: Kandi){
	clearChildren(beadCountsList);
	const amounts: {[color: number]: number} = {};
	for (let i = 0; i < kandi.design.length; i++) {
		const row = kandi.design[i];
		for (let j = 0; j < row.length; j++) {
			const bead = row[j];
			if(!amounts[bead]) amounts[bead] = 1;
			else amounts[bead]++;
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