export default class Cursor {
    constructor(pos = { x: 0, y: 0 }, down = false) {
        this.pos = pos;
        this.down = down;
        /**
         * moves the Cursor to a new position
         * @param pos the new position for the cursor
         */
        this.updatePosition = (pos) => {
            this.pos = pos;
        };
        /**
         * Marks the cursor as down
         */
        this.onDown = () => { this.down = true; };
        /**
         * Marks the cursor as not down
         */
        this.onUp = () => { this.down = false; };
    }
}
