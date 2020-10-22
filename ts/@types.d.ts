declare type point = {x: number, y: number};

declare interface Tool {
	useAt: (pos: point, k: Kandi) => void
}