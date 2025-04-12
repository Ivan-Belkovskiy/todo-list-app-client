"use strict";
const OPTION_STYLE_DISPLAY = 'inline-block';
class BlockSwitch extends HTMLElement {
    // private forElement: string;
    slotElement = document.createElement('slot');
    observer; // Включить, когда он понадобится
    styleElement = document.createElement('style');
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.observer = new MutationObserver(() => alert('123'));
    }
    updateElement(initial) {
        if (!this.shadowRoot)
            return;
        this.slotElement = document.createElement('slot');
        this.slotElement.style.display = 'none';
        const forElement = (typeof this.getAttribute('for') === 'string') ? document.querySelector(String(this.getAttribute('for'))) : null;
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
                select, input, button {
                    padding: 5px;
                    cursor: pointer;
                }
        `;
        this.shadowRoot.append(this.styleElement);
        // this.shadowRoot.innerHTML = this.innerHTML;
        // this.shadowRoot.innerHTML = `
        //     <div>
        //         <slot></slot>
        //     </div>
        // `;
        this.shadowRoot.innerHTML = `<slot></slot>`;
        if (forElement) {
            const selectElements = [CheckboxSelect, HTMLSelectElement, CustomSelect];
            selectElements.forEach((Element) => {
                if (forElement instanceof Element) {
                    // const thisChildNodes: HTMLElement[] = Array.from(this.shadowRoot!.querySelectorAll('block-switch-option'));
                    const thisChildNodes = Array.from(this.querySelectorAll('block-switch-option'));
                    console.info('THIS CHILD NODES!');
                    console.log(thisChildNodes);
                    const forChildNodes = Array.from(forElement.childNodes);
                    console.log(forChildNodes);
                    forChildNodes.forEach((node) => {
                        // if (node instanceof HTMLElement) {
                        //     // console.log(node.tagName);
                        // }
                        if (node instanceof HTMLOptionElement) {
                            // // console.log('NODE TAG NAME:: ' + node.value);
                            // if (thisChildNodes.includes(node.value)) {
                            //     // console.log(this.shadowRoot!.querySelector(node.value));
                            // }
                            const element = this.querySelector(`block-switch-option[value="${node.value}"]:not(other-value)`);
                            const otherValue = this.querySelector(`block-switch-option[other-value]`);
                            if (element instanceof HTMLElement) {
                                // if (thisChildNodes.includes(node.value)) {
                                if (thisChildNodes.includes(element)) {
                                    element.style.display = (node.selected) ? OPTION_STYLE_DISPLAY : 'none';
                                    if (otherValue instanceof HTMLElement && node.selected)
                                        otherValue.style.display = 'none';
                                }
                                else {
                                    element.style.display = 'none';
                                    if (otherValue instanceof HTMLElement)
                                        otherValue.style.display = OPTION_STYLE_DISPLAY;
                                }
                            }
                        }
                    });
                }
            });
        }
        // (this.shadowRoot.querySelector('number-field') as HTMLElement).style.display = 'none';
    }
    connectedCallback() {
        this.updateElement(true);
        const forElement = (typeof this.getAttribute('for') === 'string') ? document.querySelector(String(this.getAttribute('for'))) : null;
        if (!forElement)
            return;
        // console.log(forElement);
        forElement.addEventListener('value-change', (event) => {
            this.updateElement();
            // console.log(forElement);
            // if (event instanceof CustomEvent) {
            //     alert(`VALUE CHANGE: ` + event.detail.value);
            // }
        });
        // this.observer.observe(forElement, { attributes: true });
    }
    disconnectedCallback() {
        this.observer.disconnect();
    }
}
customElements.define('block-switch', BlockSwitch);
