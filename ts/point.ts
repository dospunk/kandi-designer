export function add(a: point, b: point): point {
	return {x: a.x+b.x, y: a.y+b.y};
}

export function sub(a: point, b: point): point {
	return {x: a.x-b.x, y: a.y-b.y};
}

export function mult(a: point, b: point): point {
	return {x: a.x*b.x, y: a.y*b.y};
}

export function div(a: point, b: point): point {
	return {x: a.x/b.x, y: a.y/b.y};
}