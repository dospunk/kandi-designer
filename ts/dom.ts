import type Kandi from './kandi';

const getButtonById = (id: string) => document.getElementById(id) as HTMLButtonElement;
const getDivById = (id: string) => document.getElementById(id) as HTMLDivElement;

export const canvas = document.getElementById("kandi-canvas") as HTMLCanvasElement;
const xInput = document.getElementById("xInput") as HTMLInputElement;
const yInput = document.getElementById("yInput") as HTMLInputElement;

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


export function initListeners(kandi: Kandi){
	//TODO: set up event listeners
	//inputs: onfocusout
	canvas.addEventListener('click', (evt)=>{
		const rect = canvas.getBoundingClientRect();
		kandi.onClick({x: evt.clientX-rect.left, y: evt.clientY-rect.top});
	});
	xDecrease.onclick = () => kandi.setWidth(kandi.getWidth()-1);
	xIncrease.onclick = () => kandi.setWidth(kandi.getWidth()+1);
	yDecrease.onclick = () => kandi.setHeight(kandi.getHeight()-1);
	yIncrease.onclick = () => kandi.setHeight(kandi.getHeight()+1);
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
	shiftLeftBtn.onclick = () => {
		const firstColumn = kandi.design.map(row => row[0]);
		for (let i = 0; i < kandi.getHeight(); i++) {
			for (let j = 1; j < kandi.getWidth(); j++) {
				const bead = kandi.design[i][j];
				kandi.design[i][j-1] = kandi.design[i][j];
			}
		}
		for (let i = 0; i < kandi.getHeight(); i++) {
			kandi.design[i][kandi.getWidth()-1] = firstColumn[i];
		}
	}
	shiftRightBtn.onclick = () => {
		const lastColumn = kandi.design.map(row => row[kandi.getWidth()-1]);
		for (let i = 0; i < kandi.getHeight(); i++) {
			const row = kandi.design[i];
			for (let j = kandi.getWidth()-2; j >= 0; j--) {
				kandi.design[i][j+1] = kandi.design[i][j];
			}
		}
		for (let i = 0; i < kandi.getHeight(); i++) {
			kandi.design[i][0] = lastColumn[i];
		}
	}
}

function createPaletteButton(color: string, idx: number, kandi: Kandi): HTMLButtonElement {
	const btn = document.createElement("button");
	btn.style.backgroundColor = color;
	//btn.style.color = color;
	//btn.innerText = color;
	btn.style.width = "2rem";
	btn.style.height = "2rem"
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