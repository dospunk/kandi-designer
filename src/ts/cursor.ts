export default class Cursor{
	constructor(
		public pos: point = {x: 0, y: 0},
		public down: boolean = false
	){}

	/**
	 * moves the Cursor to a new position
	 * @param pos the new position for the cursor
	 */
	updatePosition = (pos: point) => {
		this.pos = pos;
	}

	/**
	 * Marks the cursor as down
	 */
	onDown = () => {this.down = true};
	/**
	 * Marks the cursor as not down
	 */
	onUp   = () => {this.down = false};
}