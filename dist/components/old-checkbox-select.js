"use strict";
class OldCheckboxSelect extends HTMLElement {
    isExpanded;
    selectedOptions;
    mainWrapper = document.createElement('div');
    valueElement = document.createElement('div');
    optionContainer = document.createElement('div');
    isWidthFixed = false;
    originalOptions;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // this.isWidthFixed = this.hasAttribute('width');
        // this.addEventListener('click', () => {\
        // console.log('Checkbox Select Created!');
        // console.log(this.querySelectorAll('option'));
        // console.log(this.innerHTML);
        this.isExpanded = false;
        this.selectedOptions = [];
        this.originalOptions = Array.from(this.querySelectorAll('option'));
        if (!this.shadowRoot)
            return;
        this.initElement();
        this.valueElement.addEventListener('mousedown', () => {
            if (this.isExpanded == false) {
                this.optionContainer.style.display = '';
                this.optionContainer.style.zIndex = '4';
                this.isExpanded = true;
                this.dispatchEvent(new CustomEvent('expanded'));
            }
            else {
                this.optionContainer.style.display = 'none';
                this.optionContainer.style.zIndex = '';
                this.isExpanded = false;
                this.dispatchEvent(new CustomEvent('collapsed'));
            }
        });
        window.addEventListener('mousedown', (e) => {
            // if (!(e.target instanceof OldCheckboxSelect)) {
            if (e.target != this) {
                this.optionContainer.style.display = 'none';
                this.optionContainer.style.zIndex = '';
                this.isExpanded = false;
                this.dispatchEvent(new CustomEvent('collapsed'));
            }
        });
    }
    initElement(expanded) {
        this.isWidthFixed = this.hasAttribute('width');
        if (!this.shadowRoot)
            return;
        this.selectedOptions = [];
        if (expanded == true) {
            this.isExpanded = true;
            this.setAttribute('expanded', 'true');
        }
        else {
            this.isExpanded = false;
            this.removeAttribute('expanded');
        }
        ;
        // alert(this.isExpanded);
        this.mainWrapper.innerHTML = '';
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
        const width = this.initOptions(this.mainWrapper, this.originalOptions, true);
        // Длинное название новой созданной категории
        if ((this.isWidthFixed && typeof this.getAttribute('width') === 'string') /* Добавить проверку на то, чтобы длина самой большой опции не превышала фиксированной длины */) {
            this.mainWrapper.style.width = String(this.getAttribute('width')) + 'px';
        }
        else {
            this.mainWrapper.style.width = (width + 10) + 'px';
        }
        // this.mainWrapper.style.width = (this.isWidthFixed && typeof this.getAttribute('width') === 'string') ? String(this.getAttribute('width')) + 'px' : ((width + 10) + 'px');
        this.mainWrapper.style.padding = '0 5px';
        // this.valueElement.addEventListener('mousedown', () => {
        //     if (this.isExpanded == false) {
        //         this.optionContainer.style.display = '';
        //         this.optionContainer.style.zIndex = '4';
        //         this.isExpanded = true;
        //         this.dispatchEvent(new CustomEvent('expanded'));
        //     } else {
        //         this.optionContainer.style.display = 'none';
        //         this.optionContainer.style.zIndex = '';
        //         this.isExpanded = false;
        //     }
        // });
        // window.addEventListener('mousedown', (e: MouseEvent) => {
        //     // if (!(e.target instanceof OldCheckboxSelect)) {
        //     if ((e.target as OldCheckboxSelect) != this) {
        //         this.optionContainer.style.display = 'none';
        //         this.optionContainer.style.zIndex = '';
        //         this.isExpanded = false;
        //     }
        // });
        if (!this.hasAttribute('expanded')) {
            this.optionContainer.style.display = 'none';
            this.optionContainer.style.zIndex = '';
            this.isExpanded = false;
        }
        // this.shadowRoot.innerHTML = `
        // <div>CheckBox Select</div>
        // `;
        // });
    }
    initOptions(shadowRoot, options, refresh) {
        let resultWidth = 5; // Отступы для красоты
        if (refresh)
            this.optionContainer.innerHTML = '';
        // const options: NodeListOf<HTMLOptionElement> = this.querySelectorAll('option');
        this.optionContainer.style.position = 'absolute';
        this.optionContainer.style.display = 'inline-block';
        this.optionContainer.style.backgroundColor = '#ffffff';
        this.optionContainer.style.border = '1px solid #000';
        // this.mainWrapper.style.width = options[0].clientWidth + 'px';
        options.forEach((option, index) => {
            const container = document.createElement('label');
            container.style.padding = '3px 0';
            container.style.display = 'block';
            container.style.cursor = 'pointer';
            container.addEventListener('mouseenter', () => {
                container.style.backgroundColor = '#9e9e9e';
            });
            container.addEventListener('mouseleave', () => {
                container.style.backgroundColor = '';
            });
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.display = 'inline-block';
            checkbox.style.cursor = 'pointer';
            checkbox.checked = option.selected;
            checkbox.disabled = option.disabled;
            checkbox.id = `checkbox-select-option${index}`;
            (checkbox.checked) ? this.selectedOptions.push(option) : (this.selectedOptions.includes(option)) ? this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1) : null;
            container.htmlFor = checkbox.id;
            option.style.display = 'inline-block';
            option.id = String(index);
            checkbox.addEventListener('change', (e) => {
                (checkbox.checked) ? this.selectedOptions.push(option) : this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
                option.selected = checkbox.checked;
                this.updateSelectedOptions();
                this.dispatchEvent(new CustomEvent('option-click', {
                    detail: {
                        optionType: (option.hasAttribute('button')) ? 'button' : 'checkbox',
                        value: option.value
                    }
                }));
            });
            if (option.hasAttribute('button')) {
                container.addEventListener('click', () => {
                    this.dispatchEvent(new CustomEvent('option-click', {
                        detail: {
                            optionType: (option.hasAttribute('button')) ? 'button' : 'checkbox',
                            value: option.value
                        }
                    }));
                });
                // container.style.padding = '0 5px';
            }
            else {
                container.appendChild(checkbox);
            }
            container.appendChild(option);
            this.optionContainer.appendChild(container);
            // option.addEventListener('click', () => {
            // result += option.offsetWidth;
            // });
        });
        shadowRoot.appendChild(this.optionContainer);
        this.updateSelectedOptions();
        options.forEach((option, index) => {
            const tmpInnTxt = option.text;
            option.text = `${tmpInnTxt}, `; // Для того, чтобы рассчитать ширину опции с запятой (как будет отображаться в теге <checkbox-select>)
            resultWidth += option.clientWidth;
            console.log(`option #${index}.clientWidth:\n` + option.clientWidth);
            option.text = tmpInnTxt;
        });
        this.mainWrapper.style.position = 'relative';
        // console.log(this.optionContainer.offsetLeft - this.mainWrapper.offsetWidth);
        // this.optionContainer.style.width = (resultWidth + 10 /* padding (padding-left: 5px, padding-right: 5px) от mainWrapper */) + 'px';
        this.optionContainer.style.width = '100%';
        this.optionContainer.style.left = '-1px';
        this.optionContainer.style.marginTop = '5px';
        return resultWidth;
    }
    updateSelectedOptions() {
        const selectedOptionText = [];
        this.selectedOptions.sort((a, b) => Number(a.id) - Number(b.id));
        this.selectedOptions.map((option) => {
            selectedOptionText.push(option.text);
        });
        // this.valueElement.innerText = selectedOptionText.join(', ') || 'Выберите...'; /* ▼ */
        this.valueElement.style.display = 'flex';
        const valueTextStyles = `
            width: 100%;
            ${(this.isWidthFixed) ? `
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            ` : ``}            
            text-align: left;
        `;
        this.valueElement.innerHTML = `
            <div style="${valueTextStyles}">${selectedOptionText.join(', ') || 'Выберите...'}</div>
            <div style="width: 20px; /* background-color: blue */; text-align: right;">▼</div>
        `;
        this.valueElement.title = (this.isWidthFixed) ? selectedOptionText.join(', ') : '';
    }
    addNewOption(opt) {
        // alert('OPTION ADDED!');
        // console.log('originalOptions:');
        // console.log(...this.originalOptions);
        if ((!opt || !this.shadowRoot))
            return;
        if (this.originalOptions.some((option) => {
            return option.text == opt.text || option.value == opt.value;
        })) {
            alert('Категория уже существует!');
            return;
        }
        this.originalOptions.push(opt);
        this.originalOptions.sort((a, b) => (a.hasAttribute('bottom') ? 1 : 0) - (b.hasAttribute('bottom') ? 1 : 0));
        this.initElement(this.isExpanded);
    }
}
customElements.define('checkbox-select', OldCheckboxSelect);
