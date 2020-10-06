import Kandi from '../ts/kandi'

const canv = document.createElement('canvas');
canv.width = 900;
canv.height = 400;
const ctx = canv.getContext('2d');

test('create a Kandi object', ()=>{
	expect(() => new Kandi(ctx, canv.width, canv.height)).not.toThrowError();
});

//todo: test Kandi.draw
//todo: test Kandi.paint
//todo: test Kandi.getHeight
//todo: test Kandi.getWidth
//todo: test Kandi.setHeight
//todo: test Kandi.setWidth
//todo: test Kandi.isEmpty
//todo: test Kandi.shiftLeft
//todo: test Kandi.shiftRight
