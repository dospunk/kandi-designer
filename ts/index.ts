import * as DOM from './dom.js';
import Kandi from './kandi.js';

// INIT
const ctx = DOM.canvas.getContext('2d');
if(!ctx) throw Error("Could not get canvas rendering context");
const kandi = new Kandi(ctx, DOM.canvas.width, DOM.canvas.height);
DOM.initListeners(kandi);
DOM.populatePalette(kandi);

const anim = () => {
	kandi.draw()
	window.requestAnimationFrame(anim);
};
window.requestAnimationFrame(anim);