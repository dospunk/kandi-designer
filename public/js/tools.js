export class Pencil {
    constructor() {
        this.useAt = (pos, k) => {
            k.setBeadAt(pos, k.currColor);
        };
    }
}
export class Fill {
    constructor() {
        this.useAt = (pos, k) => {
            this.helper(pos, k, k.getBeadAt(pos));
            k.setBeadAt(pos, k.currColor);
        };
        this.helper = (pos, k, initColor) => {
            //get the vertical offset for neighbors to the sides
            const sideVertOffset = pos.x % 2 === 0 ? -1 : 1;
            const neighbors = [
                { x: pos.x, y: pos.y - 1 },
                { x: pos.x, y: pos.y + 1 },
                { x: pos.x + 1, y: pos.y },
                { x: pos.x - 1, y: pos.y },
                { x: pos.x + 1, y: pos.y + sideVertOffset },
                { x: pos.x - 1, y: pos.y + sideVertOffset },
            ];
            for (let i = 0; i < neighbors.length; i++) {
                const n = neighbors[i];
                if (n.x >= 0
                    && n.x < k.getWidth()
                    && n.y >= 0
                    && n.y < k.getHeight()
                    && k.getBeadAt(n) === initColor) {
                    k.setBeadAt(n, k.currColor);
                    this.helper(n, k, initColor);
                }
            }
        };
    }
}
