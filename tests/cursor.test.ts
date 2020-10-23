import Cursor from '../src/ts/cursor';

test('test update position', () => {
	const cursor = new Cursor();
	cursor.updatePosition({x: 66, y:77});
	expect(cursor.pos.x).toBe(66);
	expect(cursor.pos.y).toBe(77);
});

test('test cursor onUp and onDown', () => {
	const curs = new Cursor();
	expect(curs.down).toBe(false);
	curs.onDown();
	expect(curs.down).toBe(true);
	curs.onUp();
	expect(curs.down).toBe(false);
});