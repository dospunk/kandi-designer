export default class Cursor {
    constructor(pos = { x: 0, y: 0 }, down = false) {
        this.pos = pos;
        this.down = down;
        this.updatePosition = (pos) => {
            this.pos = pos;
        };
        this.onDown = () => this.down = true;
        this.onUp = () => this.down = false;
    }
}
