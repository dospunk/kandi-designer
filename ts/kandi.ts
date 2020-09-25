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
		public palette: Array<string> = ["#ffffff", "#ff0000", "#00ff00", "#0000ff"],
		public currColor: number = 1,
		public outlineColor: string = "#000000"
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

	onClick = (clickedAt: point) => {
		//convert click coord to array coord
		console.log(`clicked at ${clickedAt.x}, ${clickedAt.y}`);//DEV
		let x = clickedAt.x-leftOffset;
		let y = clickedAt.y-topOffset;
		x = Math.floor(x / beadW);
		y = Math.floor((y - beadYOffsetAt(x)) / beadH);
		//if click is within the bounds of the design, set the color of the bead clicked
		if(x < this.getWidth() && x >= 0 && y < this.getHeight() && y >= 0) {
			console.log(`clicked on bead at ${x}, ${y}`);
			this.design[y][x] = this.currColor;
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
}