import * as DOM from './dom.js';
import Kandi from './kandi.js';
// INIT
const ctx = DOM.canvas.getContext('2d');
if (!ctx)
    throw Error("Could not get canvas rendering context");
let kandi = new Kandi(ctx, DOM.canvas.width, DOM.canvas.height);
DOM.initListeners(kandi, k => kandi = k);
DOM.populatePalette(kandi);
DOM.initDimensionInputs(kandi);
const anim = () => {
    kandi.paint();
    kandi.draw();
    window.requestAnimationFrame(anim);
};
window.requestAnimationFrame(anim);
