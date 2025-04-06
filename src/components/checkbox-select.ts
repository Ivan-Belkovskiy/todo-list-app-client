class CheckboxSelect extends HTMLElement {
    public isExpanded: boolean;
    public selectedOptions: HTMLOptionElement[];
    private mainWrapper: HTMLDivElement = document.createElement('div');
    private valueElement: HTMLDivElement = document.createElement('div');
    private optionContainer: HTMLDivElement = document.createElement('div');
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // this.addEventListener('click', () => {\
        // console.log('Checkbox Select Created!');
        // console.log(this.querySelectorAll('option'));
        // console.log(this.innerHTML);
        this.isExpanded = false;
        this.selectedOptions = [];
        if (!this.shadowRoot) return;
        this.mainWrapper.style.display = 'inline-block';
        this.mainWrapper.style.border = '1px solid #727272';
        this.mainWrapper.style.borderRadius = '2px';
        this.mainWrapper.style.fontFamily = 'sans-serif';
        this.mainWrapper.style.fontSize = '14px';
        this.mainWrapper.style.textAlign = 'left';
        this.mainWrapper.style.userSelect = 'none';
        // this.mainWrapper.style.paddingLeft = '5px';
        // this.mainWrapper.style.minWidth = 
        // this.mainWrapper.style.minWidth = (16 * 3) + 'px';
        // this.mainWrapper.style.height = '15px';
        // this.valueElement.innerText = this.selectedOptions.join(',');
        this.shadowRoot.appendChild(this.mainWrapper);
        this.mainWrapper.appendChild(this.valueElement);
        this.mainWrapper.style.cursor = 'pointer';
        const width: number = this.initOptions(this.mainWrapper);
        this.mainWrapper.style.width = (width) + 'px';
        this.mainWrapper.style.padding = '0 5px';

        this.valueElement.addEventListener('mousedown', () => {
            if (this.isExpanded == false) {
                this.optionContainer.style.display = '';
                this.isExpanded = true;
            } else {
                this.optionContainer.style.display = 'none';
                this.isExpanded = false;
            }
        });
        window.addEventListener('mousedown', (e: MouseEvent) => {
            if (!(e.target instanceof CheckboxSelect)) {
                this.optionContainer.style.display = 'none';
                this.isExpanded = false;
            }
        });
        if (!this.hasAttribute('expanded')) {
            this.optionContainer.style.display = 'none';
            this.isExpanded = false;
        }
        // this.shadowRoot.innerHTML = `
        // <div>CheckBox Select</div>
        // `;
        // });
    }

    private initOptions(shadowRoot: ShadowRoot | HTMLElement): number {
        let resultWidth: number = 5; // Отступы для красоты
        const options: NodeListOf<HTMLOptionElement> = this.querySelectorAll('option');
        this.optionContainer.style.position = 'absolute';
        this.optionContainer.style.display = 'inline-block';
        this.optionContainer.style.backgroundColor = '#ffffff';
        this.optionContainer.style.border = '1px solid #000';
        // this.mainWrapper.style.width = options[0].clientWidth + 'px';
        options.forEach((option: HTMLOptionElement, index: number) => {
            const container: HTMLLabelElement = document.createElement('label');
            container.style.padding = '3px 0';
            container.style.display = 'block';
            container.style.cursor = 'pointer';
            container.addEventListener('mouseenter', () => {
                container.style.backgroundColor = '#9e9e9e';
            });
            container.addEventListener('mouseleave', () => {
                container.style.backgroundColor = '';
            });
            const checkbox: HTMLInputElement = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.display = 'inline-block';
            checkbox.style.cursor = 'pointer';
            checkbox.checked = option.selected;
            checkbox.id = `checkbox-select-option${index}`;
            (checkbox.checked) ? this.selectedOptions.push(option) : (this.selectedOptions.includes(option)) ? this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1) : null;
            container.htmlFor = checkbox.id;            
            option.style.display = 'inline-block';
            option.id = String(index);
            checkbox.addEventListener('change', () => {
                (checkbox.checked) ? this.selectedOptions.push(option) : this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
                this.updateSelectedOptions();
            });
            container.appendChild(checkbox);
            container.appendChild(option);
            this.optionContainer.appendChild(container);
            // option.addEventListener('click', () => {
            // result += option.offsetWidth;
            // });
        });
        shadowRoot.appendChild(this.optionContainer);
        this.updateSelectedOptions();
        options.forEach((option: HTMLOptionElement, index: number) => {
            const tmpInnTxt: string = option.text;
            option.text = `${tmpInnTxt}, `; // Для того, чтобы рассчитать ширину опции с запятой (как будет отображаться в теге <checkbox-select>)
            resultWidth += option.clientWidth;
            console.log(`option #${index}.clientWidth:\n` + option.clientWidth);
            option.text = tmpInnTxt;
        });
        this.mainWrapper.style.position = 'relative';
        // console.log(this.optionContainer.offsetLeft - this.mainWrapper.offsetWidth);
        this.optionContainer.style.width = (resultWidth + 10 /* padding (padding-left: 5px, padding-right: 5px) от mainWrapper */) + 'px';
        this.optionContainer.style.left = '-1px';
        this.optionContainer.style.marginTop = '5px';
        return resultWidth;
    }

    private updateSelectedOptions(): void {
        const selectedOptionText: string[] = [];
        this.selectedOptions.sort((a, b) => Number(a.id) - Number(b.id))
        this.selectedOptions.map((option: HTMLOptionElement) => {
            selectedOptionText.push(option.text);
        });
        // this.valueElement.innerText = selectedOptionText.join(', ') || 'Выберите...'; /* ▼ */
        this.valueElement.style.display = 'flex';
        this.valueElement.innerHTML = `
            <div style="width: 92%; /* background-color: red; */ text-align: left;">${selectedOptionText.join(', ') || 'Выберите...'}</div>
            <div style="width: 8%; /* background-color: blue */; text-align: right;">▼</div>
        `;
    }
}

customElements.define('checkbox-select', CheckboxSelect);