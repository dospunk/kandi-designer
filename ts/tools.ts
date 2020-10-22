import type Kandi from './kandi.js'

export class Pencil implements Tool {
	useAt = (pos: point, k: Kandi) => {
		k.setBeadAt(pos, k.currColor);
	}
}

export class Fill implements Tool {
	useAt = (pos: point, k: Kandi) => {
		this.helper(pos, k, k.getBeadAt(pos));
		k.setBeadAt(pos, k.currColor);
	}

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