const leftOffset = 20;
const topOffset = 20;
const beadW = 14;
const beadH = 20;
const outlineWidth = 1;
const beadYOffsetAt = (x) => (beadH / 2) * (x % 2);
export default class Kandi {
    constructor(ctx, canvWidth, canvHeight, design = [[0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]], palette = ["#ffffff", "#ff0000", "#00ff00", "#0000ff"], currColor = 1, outlineColor = "#000000") {
        this.ctx = ctx;
        this.canvWidth = canvWidth;
        this.canvHeight = canvHeight;
        this.design = design;
        this.palette = palette;
        this.currColor = currColor;
        this.outlineColor = outlineColor;
        this.draw = () => {
            this.ctx.clearRect(0, 0, this.canvWidth, this.canvHeight);
            //draw beads
            for (let i = 0; i < this.design.length; i++) {
                for (let j = 0; j < this.design[0].length; j++) {
                    const x = leftOffset + (beadW * j);
                    const y = topOffset + (beadH * i) + beadYOffsetAt(j);
                    const color = this.design[i][j];
                    this.ctx.fillStyle = this.palette[color];
                    this.ctx.fillRect(x, y, beadW, beadH);
                    this.ctx.strokeStyle = this.outlineColor;
                    this.ctx.lineWidth = outlineWidth;
                    this.ctx.strokeRect(x, y, beadW, beadH);
                }
            }
        };
        this.onClick = (clickedAt) => {
            //convert click coord to array coord
            console.log(`clicked at ${clickedAt.x}, ${clickedAt.y}`); //DEV
            let x = clickedAt.x - leftOffset;
            let y = clickedAt.y - topOffset;
            x = Math.floor(x / beadW);
            y = Math.floor((y - beadYOffsetAt(x)) / beadH);
            //if click is within the bounds of the design, set the color of the bead clicked
            if (x < this.design[0].length && x >= 0 && y < this.design.length && y >= 0) {
                console.log(`clicked on bead at ${x}, ${y}`);
                this.design[y][x] = this.currColor;
            }
        };
        this.startPoint = { x: leftOffset, y: topOffset };
        this.endPoint = {
            x: leftOffset + (this.design[0].length * beadW),
            y: topOffset + (this.design.length * beadH)
        };
    }
}
