import Cursor from './cursor.js';
import * as DOM from './dom.js';
import Kandi from './kandi.js';
import { Pencil } from './tools.js';

// INIT
const ctx = DOM.canvas.getContext('2d');
if(!ctx) throw Error("Could not get canvas rendering context");

const kandi = new Kandi(ctx, DOM.canvas.width, DOM.canvas.height);
const curs = new Cursor();
let tool = new Pencil();

function setTool(newTool: Tool){
	tool = newTool;
}

DOM.initListeners(kandi, curs, setTool);
DOM.populatePalette(kandi);
DOM.initDimensionInputs(kandi);
DOM.updateBeadCounts(kandi);

const anim = () => {
	if(curs.down) kandi.paint(curs.pos, tool);
	kandi.draw();
	window.requestAnimationFrame(anim);
};
window.requestAnimationFrame(anim);