import Kandi from './kandi';

export const canvas = document.getElementById("kandi-canvas") as HTMLCanvasElement;
export const xDecrease = document.getElementById("xDecrease") as HTMLButtonElement;
export const xInput = document.getElementById("xInput") as HTMLInputElement;
export const xIncrease = document.getElementById("xIncrease") as HTMLButtonElement;
export const yDecrease = document.getElementById("yDecrease") as HTMLButtonElement;
export const yInput = document.getElementById("yInput") as HTMLInputElement;
export const yIncrease = document.getElementById("yIncrease") as HTMLButtonElement;
export const paletteContainer = document.getElementById("color-palette") as HTMLDivElement;
export const editPaletteContainer = document.getElementById("edit-current-colors") as HTMLDivElement;

export function initListeners(kandi: Kandi){
	//set up event listeners
	//buttons: onclick
	//inputs: onfocusout
	//canvas: onclick
	canvas.addEventListener('click', (evt)=>{
		const rect = canvas.getBoundingClientRect();
		kandi.onClick({x: evt.clientX-rect.left, y: evt.clientY-rect.top});
	});
}

function createPaletteButton(color: string, idx: number, kandi: Kandi): HTMLButtonElement {
	const btn = document.createElement("button");
	btn.style.backgroundColor = color;
	//btn.style.color = color;
	//btn.innerText = color;
	btn.style.width = "2rem";
	btn.style.height = "2rem"
	btn.addEventListener("click", () => kandi.currColor=idx);
	return btn;
}

function createEditPaletteButton(color: string, idx: number){

}

export function populatePalette(kandi: Kandi){
	kandi.palette.forEach((color, idx) =>
		paletteContainer.appendChild(createPaletteButton(color, idx, kandi))
	);
}