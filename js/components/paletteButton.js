var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property, css } from "https://cdn.skypack.dev/lit-element";
export default class PaletteButton extends LitElement {
    constructor() {
        super();
        this.color = "white";
        this.selected = false;
    }
    static get styles() {
        return css `
			:host, button {
				width: 2rem;
				height: 2rem;
				background-color: var(--bkg-color);
			}
		`;
    }
    render() {
        this.style.setProperty("--bkg-color", this.color);
        return html `<button class="${this.selected ? "selected" : ""}"></button>`;
    }
}
__decorate([
    property({ type: String, reflect: true })
], PaletteButton.prototype, "color", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], PaletteButton.prototype, "selected", void 0);
customElements.define("palette-button", PaletteButton);
