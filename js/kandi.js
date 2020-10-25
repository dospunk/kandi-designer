const leftOffset = 20;
const topOffset = 20;
const beadW = 21;
const beadH = 30;
const outlineWidth = 1;
const beadYOffsetAt = (x) => (beadH / 2) * (x % 2);
export default class Kandi {
    constructor(ctx, canvWidth, canvHeight, design = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    ], palette = ["#ffffff",
        "#000000",
        "#A800FF",
        "#0079FF",
        "#00F11D",
        "#FFEF00",
        "#FF7F00",
        "#FF0900"], currColor = 1, outlineColor = "#000000") {
        this.ctx = ctx;
        this.canvWidth = canvWidth;
        this.canvHeight = canvHeight;
        this.design = design;
        this.palette = palette;
        this.currColor = currColor;
        this.outlineColor = outlineColor;
        /**
         * Draws the Kandi on the canvas
         */
        this.draw = () => {
            this.ctx.clearRect(0, 0, this.canvWidth, this.canvHeight);
            //draw beads
            for (let i = 0; i < this.getHeight(); i++) {
                for (let j = 0; j < this.getWidth(); j++) {
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
        /**
         * Applies `tool.useAt` if the color at `pos` is not the same as `this.currColor`
         * @param pos the point on the canvas clicked
         * @param tool The main {@link Tool}
         */
        this.paint = (pos, tool) => {
            //convert click coord to array coord
            let x = pos.x - leftOffset;
            let y = pos.y - topOffset;
            x = Math.floor(x / beadW);
            y = Math.floor((y - beadYOffsetAt(x)) / beadH);
            //if click is within the bounds of the design & the beads color !== the current selected color,
            //set the color of the bead clicked using the current tool
            const inBounds = x < this.getWidth() && x >= 0 && y < this.getHeight() && y >= 0;
            if (inBounds && this.design[y][x] !== this.currColor) {
                console.log(`changing color of bead at ${x}, ${y}`); //DEV
                tool.useAt({ x, y }, this);
            }
        };
        /**
         * @return The height of the design
         */
        this.getHeight = () => this.design.length;
        /**
         * @return The width of the design
         */
        this.getWidth = () => this.design[0].length;
        /**
         * Sets the design's height to `newH`. This method is destructive if `newH`
         * is less than the current height
         * @param newH The new height of the design
         */
        this.setHeight = (newH) => {
            if (newH < 1)
                return;
            if (newH > this.getHeight()) {
                while (this.getHeight() !== newH) {
                    this.design.push(new Array(this.getWidth()).fill(0));
                }
            }
            else if (newH < this.getHeight()) {
                while (this.getHeight() !== newH) {
                    this.design.pop();
                }
            }
        };
        /**
         * Sets the design's width to `newW`. This method is destructive if `newW`
         * is less than the current width
         * @param newW The new width of the design
         */
        this.setWidth = (newW) => {
            if (newW < 1)
                return;
            if (newW > this.getWidth()) {
                while (this.getWidth() !== newW) {
                    for (let i = 0; i < this.design.length; i++) {
                        const row = this.design[i];
                        row.push(0);
                    }
                }
            }
            else if (newW < this.getWidth()) {
                while (this.getWidth() !== newW) {
                    for (let i = 0; i < this.design.length; i++) {
                        const row = this.design[i];
                        row.pop();
                    }
                }
            }
        };
        /**
         * @returns `true` if the design only contains the first color in the palette
         */
        this.isEmpty = () => {
            return this.design.every(row => row.every(bead => bead === 0));
        };
        /**
         * Shifts the design left by one column
         */
        this.shiftLeft = () => {
            const firstColumn = this.design.map(row => row[0]);
            for (let i = 0; i < this.getHeight(); i++) {
                for (let j = 1; j < this.getWidth(); j++) {
                    this.design[i][j - 1] = this.design[i][j];
                }
            }
            for (let i = 0; i < this.getHeight(); i++) {
                this.design[i][this.getWidth() - 1] = firstColumn[i];
            }
        };
        /**
         * Shifts the design right by one column
         */
        this.shiftRight = () => {
            const lastColumn = this.design.map(row => row[this.getWidth() - 1]);
            for (let i = 0; i < this.getHeight(); i++) {
                const row = this.design[i];
                for (let j = this.getWidth() - 2; j >= 0; j--) {
                    row[j + 1] = row[j];
                }
            }
            for (let i = 0; i < this.getHeight(); i++) {
                this.design[i][0] = lastColumn[i];
            }
        };
        /**
         * @param p The location of the desired bead in the design
         * @returns The index of the bead's color in `this.palette`
         */
        this.getBeadAt = (p) => {
            return this.design[p.y][p.x];
        };
        /**
         * Sets the color of a bead
         * @param p the location in the design of the bead to be set
         * @param c The index of the bead's new color in `this.palette`
         */
        this.setBeadAt = (p, c) => {
            this.design[p.y][p.x] = c;
        };
        this.startPoint = { x: leftOffset, y: topOffset };
        this.endPoint = {
            x: leftOffset + (this.getWidth() * beadW),
            y: topOffset + (this.getHeight() * beadH)
        };
    }
}
