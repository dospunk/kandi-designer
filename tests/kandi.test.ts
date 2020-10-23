import Kandi from '../src/ts/kandi'

const canv = document.createElement('canvas');
canv.width = 900;
canv.height = 400;
const ctx = canv.getContext('2d') as CanvasRenderingContext2D;

test('create a Kandi object', ()=>{
	expect(() => new Kandi(ctx, canv.width, canv.height)).not.toThrowError();
});

test("kandi is empty when design is all 0's", ()=>{
	const k = new Kandi(ctx, canv.width, canv.height);
	expect(k.isEmpty()).toBe(true);
	k.design[0][0] = 1;
	expect(k.isEmpty()).toBe(false);
	k.design[0][0] = 0;
	expect(k.isEmpty()).toBe(true);
});

//todo: test Kandi.draw
//todo: test Kandi.paint
//todo: test Kandi.getHeight
//todo: test Kandi.getWidth
//todo: test Kandi.setHeight
//todo: test Kandi.setWidth
//todo: test Kandi.shiftLeft
//todo: test Kandi.shiftRight
