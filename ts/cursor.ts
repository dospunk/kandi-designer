export default class Cursor{
	constructor(
		public pos: point = {x: 0, y: 0},
		public down: boolean = false
	){}

	updatePosition = (pos: point) => {
		this.pos = pos;
	}

	onDown = () => this.down = true;
	onUp   = () => this.down = false;
}