class BlockSwitch extends HTMLElement {
    // private forElement: string;
    private slotElement: HTMLSlotElement = document.createElement('slot');
    private observer: MutationObserver; // Включить, когда он понадобится
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.observer = new MutationObserver(() => alert('123'));
    }

    private updateElement(initial?: boolean) {
        if (!this.shadowRoot) return;
        const forElement: HTMLElement | null = (typeof this.getAttribute('for') === 'string') ? document.querySelector(String(this.getAttribute('for'))) : null;
        this.shadowRoot.innerHTML = this.innerHTML;
        // this.shadowRoot.innerHTML = `<slot></slot>`; // Не работает
        if (forElement) {
            const selectElements = [CheckboxSelect, HTMLSelectElement, CustomSelect];
            selectElements.forEach((Element) => {
                if (forElement instanceof Element) {
                    const thisChildNodes: HTMLElement[] = Array.from(this.shadowRoot!.querySelectorAll('block-switch-option'));
                    const forChildNodes: ChildNode[] = Array.from(forElement.childNodes);
                    // console.log(thisChildNodes);
                    forChildNodes.forEach((node: ChildNode) => {
                        // if (node instanceof HTMLElement) {
                        //     // console.log(node.tagName);
                        // }
                        if (node instanceof HTMLOptionElement) {
                            // // console.log('NODE TAG NAME:: ' + node.value);
                            // if (thisChildNodes.includes(node.value)) {
                            //     // console.log(this.shadowRoot!.querySelector(node.value));
                            // }
                            const element: HTMLElement | null = this.shadowRoot!.querySelector(`block-switch-option[value="${node.value}"]:not(other-value)`);
                            const otherValue: HTMLElement | null = this.shadowRoot!.querySelector(`block-switch-option[other-value]`);
                            if (element instanceof HTMLElement) {
                                // if (thisChildNodes.includes(node.value)) {
                                if (thisChildNodes.includes(element)) {
                                    element.style.display = (node.selected) ? 'block' : 'none';
                                    if (otherValue instanceof HTMLElement && node.selected) otherValue.style.display = 'none';
                                } else {
                                    element.style.display = 'none';
                                    if (otherValue instanceof HTMLElement) otherValue.style.display = 'block';
                                }
                            }
                        }
                    });
                }
            });
        }
        // (this.shadowRoot.querySelector('number-field') as HTMLElement).style.display = 'none';
        this.slotElement = document.createElement('slot');
        this.slotElement.style.display = 'none';
    }

    connectedCallback(): void {
        this.updateElement(true);
        const forElement: HTMLElement | null = (typeof this.getAttribute('for') === 'string') ? document.querySelector(String(this.getAttribute('for'))) : null;
        if (!forElement) return;
        // console.log(forElement);
        forElement.addEventListener('value-change', (event: Event) => {
            this.updateElement();
            // if (event instanceof CustomEvent) {
            //     alert(`VALUE CHANGE: ` + event.detail.value);
            // }
        });
        // this.observer.observe(forElement, { attributes: true });
    }

    disconnectedCallback(): void {
        this.observer.disconnect();
    }
}

customElements.define('block-switch', BlockSwitch);