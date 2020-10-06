import Cursor from "./cursor.js";

const leftOffset = 20;
const topOffset = 20;
const beadW = 21;
const beadH = 30;
const outlineWidth = 1;

const beadYOffsetAt = (x:number) => (beadH/2)*(x%2)

export default class Kandi {
	startPoint: point;
	endPoint: point;

	constructor(
		private ctx: CanvasRenderingContext2D,
		private canvWidth: number,
		private canvHeight: number,
		public design: Array<Array<number>> = [[0,0,0,0,0],
											   [0,0,0,0,0],
											   [0,0,0,0,0],
											   [0,0,0,0,0]],
		public palette: Array<string> = ["#ffffff",
		                                 "#000000",
										 "#A800FF",
										 "#0079FF",
										 "#00F11D",
										 "#FFEF00",
										 "#FF7F00",
										 "#FF0900"],
		public currColor: number = 1,
		public outlineColor: string = "#000000",
		public curs: Cursor = new Cursor()
	){
		this.startPoint = {x: leftOffset, y: topOffset};
		this.endPoint = {
			x: leftOffset+(this.getWidth()*beadW),
			y: topOffset+(this.getHeight()*beadH)
		};
	}

	draw = () => {
		this.ctx.clearRect(0,0,this.canvWidth, this.canvHeight);
		//draw beads
		for (let i = 0; i < this.getHeight(); i++) {
			for (let j = 0; j < this.getWidth(); j++) {
				const x = leftOffset+(beadW*j);
				const y = topOffset+(beadH*i)+beadYOffsetAt(j);
				const color = this.design[i][j];
				this.ctx.fillStyle = this.palette[color];
				this.ctx.fillRect(x,y,beadW,beadH);
				this.ctx.strokeStyle = this.outlineColor;
				this.ctx.lineWidth = outlineWidth;
				this.ctx.strokeRect(x,y,beadW,beadH);
			}
		}
	}

	/**
	 * colors the bead underneath the cursor if the left mouse button is pressed
	 */
	paint = () => {
		if(this.curs.down){
			//convert click coord to array coord
			let x = this.curs.pos.x-leftOffset;
			let y = this.curs.pos.y-topOffset;
			x = Math.floor(x / beadW);
			y = Math.floor((y - beadYOffsetAt(x)) / beadH);
			//if click is within the bounds of the design & the beads color !== the current selected color,
			//set the color of the bead clicked
			const inBounds = x < this.getWidth() && x >= 0 && y < this.getHeight() && y >= 0;
			if(inBounds && this.design[y][x] !== this.currColor) {
				console.log(`changing color of bead at ${x}, ${y}`);//DEV
				this.design[y][x] = this.currColor;
			}
		}
	}

	getHeight = () => this.design.length;
	getWidth = () => this.design[0].length;

	setHeight = (newH: number) => {
		if(newH < 1) return;
		if(newH > this.getHeight()) {
			while(this.getHeight() !== newH){
				this.design.push(new Array<number>(this.getWidth()).fill(0));
			}
		} else if(newH < this.getHeight()){
			while(this.getHeight() !== newH){
				this.design.pop();
			}
		}
	}

	setWidth = (newW: number) => {
		if(newW < 1) return;
		if(newW > this.getWidth()) {
			while(this.getWidth() !== newW){
				for (let i = 0; i < this.design.length; i++) {
					const row = this.design[i];
					row.push(0);
				}
			}
		} else if(newW < this.getWidth()){
			while(this.getWidth() !== newW){
				for (let i = 0; i < this.design.length; i++) {
					const row = this.design[i];
					row.pop();
				}
			}
		}
	}

	isEmpty = () => {
		return this.design.every(row => row.every(bead => bead === 0));
	}

	shiftLeft = () => {
		const firstColumn = this.design.map(row => row[0]);
		for (let i = 0; i < this.getHeight(); i++) {
			for (let j = 1; j < this.getWidth(); j++) {
				this.design[i][j-1] = this.design[i][j];
			}
		}
		for (let i = 0; i < this.getHeight(); i++) {
			this.design[i][this.getWidth()-1] = firstColumn[i];
		}
	}

	shiftRight = () => {
		const lastColumn = this.design.map(row => row[this.getWidth()-1]);
		for (let i = 0; i < this.getHeight(); i++) {
			const row = this.design[i];
			for (let j = this.getWidth()-2; j >= 0; j--) {
				row[j+1] = row[j];
			}
		}
		for (let i = 0; i < this.getHeight(); i++) {
			this.design[i][0] = lastColumn[i];
		}
	}
}