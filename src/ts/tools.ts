import type Kandi from './kandi.js'

export class Pencil implements Tool {
	/**
	 * Colors a single bead
	 * @param pos The position of the bead to color
	 * @param k The {@link Kandi} singleton
	 */
	useAt = (pos: point, k: Kandi) => {
		k.setBeadAt(pos, k.currColor);
	}
}

export class Fill implements Tool {
	/**
	 * Colors all beads touching the bead at `pos` that are the same color as that bead
	 * @param pos The position of the first bead to color
	 * @param k the {@link Kandi} singleton
	 */
	useAt = (pos: point, k: Kandi) => {
		this.helper(pos, k, k.getBeadAt(pos));
		k.setBeadAt(pos, k.currColor);
	}

	/**
	 * Helper function for {@link Fill.useAt}
	 * @param pos The position of the current bead to color and whose neighbors should be checked
	 * @param k The {@link Kandi} singleton
	 * @param initColor The color of teh first bead selected
	 */
	helper = (pos: point, k: Kandi, initColor: number) => {
		//get the vertical offset for neighbors to the sides
		const sideVertOffset = pos.x % 2 === 0 ? -1 : 1;
		const neighbors = [
			{x: pos.x, y: pos.y-1}, //up
			{x: pos.x, y: pos.y+1}, //down
			{x: pos.x+1, y: pos.y}, //right
			{x: pos.x-1, y: pos.y}, //left
			{x: pos.x+1, y: pos.y+sideVertOffset}, //right and up/down
			{x: pos.x-1, y: pos.y+sideVertOffset}, //left and up/down
		];
		for(let i = 0; i < neighbors.length; i++){
			const n = neighbors[i];
			if(n.x >= 0
			   && n.x < k.getWidth()
			   && n.y >= 0
			   && n.y < k.getHeight()
			   && k.getBeadAt(n) === initColor){
				k.setBeadAt(n, k.currColor);
				this.helper(n, k, initColor);
			}
		}
	}
}