"use strict";
class FromDeepSeekCheckboxSelect extends HTMLElement {
    isExpanded = false;
    selectedOptions = [];
    mainWrapper = document.createElement('div');
    valueElement = document.createElement('div');
    optionsContainer = document.createElement('div');
    observer;
    slotElement = document.createElement('slot');
    isWidthFixed = false;
    static openInstances = [];
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.observer = new MutationObserver(() => this.updateOptions());
    }
    connectedCallback() {
        this.initElement();
        this.observer.observe(this, { childList: true });
    }
    disconnectedCallback() {
        this.observer.disconnect();
    }
    initElement() {
        this.shadowRoot.innerHTML = '';
        this.mainWrapper = document.createElement('div');
        this.valueElement = document.createElement('div');
        this.optionsContainer = document.createElement('div');
        this.slotElement = document.createElement('slot');
        this.slotElement.style.display = 'none';
        // Основные стили
        const style = document.createElement('style');
        style.textContent = `
        .main-wrapper {
          display: inline-block;
          border: 1px solid #727272;
          border-radius: 2px;
          font-family: sans-serif;
          font-size: 14px;
          text-align: left;
          user-select: none;
          cursor: pointer;
          position: relative;
          padding: 5px;
          min-width: 100px;
        }
        .value-display {
          display: flex;
          justify-content: space-between;
        }
        .options-container {
          position: absolute;
          top: 100%;
          left: -1px;
          right: -1px;
          background: white;
          border: 1px solid #000;
          margin-top: 5px;
          display: none;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }
        .option-item {
          padding: 5px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .option-item:hover {
          background: #f0f0f0;
        }
        .option-item input {
          margin-right: 5px;
        }

        input[type=checkbox] {
          cursor: pointer;
        }
      `;
        this.mainWrapper.className = 'checkbox-select main-wrapper';
        this.valueElement.className = 'checkbox-select value-display';
        this.optionsContainer.className = 'checkbox-select options-container';
        // Установка ширины
        if (this.hasAttribute('width')) {
            this.isWidthFixed = true;
            this.mainWrapper.style.width = `${this.getAttribute('width')}px`;
        }
        // Собираем структуру
        this.mainWrapper.appendChild(this.valueElement);
        this.mainWrapper.appendChild(this.optionsContainer);
        this.shadowRoot.append(style, this.mainWrapper, this.slotElement);
        // Инициализация опций
        this.updateOptions();
        // Обработчики событий
        this.mainWrapper.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            // alert((e.target as HTMLElement).parentElement?.classList);
            // if ((e.target as HTMLElement).classList.contains('main-wrapper') || (e.target as HTMLElement).classList.contains('main-wrapper')) {
            if (!e.target?.className.includes('option')) {
                // if (e.target != e.relatedTarget) {
                this.toggleOptions();
            }
            else {
                const isClickInside = this.shadowRoot?.contains(e.target) || this.contains(e.target);
                if (!isClickInside) {
                    this.collapseOptions();
                }
                // this.collapseOptions();
            }
        });
        window.addEventListener('mousedown', (e) => {
            // const isClickInside = this.shadowRoot?.contains(e.target as HTMLElement) || this.contains(e.target as HTMLElement);
            // if (!isClickInside) {
            this.collapseOptions();
            // }
            // if ((e.target as FromDeepSeekCheckboxSelect) != this) {
            //   this.collapseOptions();
            // }
        });
    }
    toggleOptions() {
        if (this.isExpanded) {
            this.collapseOptions();
        }
        else {
            FromDeepSeekCheckboxSelect.openInstances.forEach(instance => {
                if (instance !== this)
                    instance.collapseOptions();
            });
            this.expandOptions();
        }
        // this.isExpanded ? this.collapseOptions() : this.expandOptions();
    }
    expandOptions() {
        this.isExpanded = true;
        this.optionsContainer.style.display = 'block';
        this.setAttribute('expanded', '');
        FromDeepSeekCheckboxSelect.openInstances.push(this);
    }
    collapseOptions() {
        this.isExpanded = false;
        this.optionsContainer.style.display = 'none';
        this.removeAttribute('expanded');
        FromDeepSeekCheckboxSelect.openInstances = FromDeepSeekCheckboxSelect.openInstances.filter(inst => inst !== this);
    }
    updateOptions() {
        // Получаем актуальные опции
        const options = Array.from(this.querySelectorAll('option'));
        options.sort((a, b) => (a.hasAttribute('bottom') ? 1 : 0) - (b.hasAttribute('bottom') ? 1 : 0));
        this.optionsContainer.innerHTML = '';
        // Рендерим новые опции
        // let resultWidth: number = 0;
        options.forEach(option => {
            const optionItem = document.createElement('label');
            optionItem.className = 'checkbox-select option-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox-select option-checkbox';
            checkbox.checked = option.selected;
            checkbox.value = option.value;
            // checkbox.addEventListener('change', () => {
            //   option.selected = checkbox.checked;
            //   alert()
            //   this.updateSelectedOptions();
            // });
            const textSpan = document.createElement('span');
            textSpan.className = 'checkbox-select option-span';
            textSpan.textContent = option.textContent || option.value;
            checkbox.addEventListener('change', () => {
                option.selected = checkbox.checked;
                // let tmpInnTxt: string = textSpan.innerText;
                // textSpan.innerText += ', ';
                // alert(textSpan.clientWidth);
                // textSpan.innerText = tmpInnTxt;
                this.updateSelectedOptions();
            });
            textSpan.addEventListener('click', () => {
                console.error(textSpan.clientWidth);
            });
            (Boolean(option.hasAttribute('button')) == true) ? optionItem.append(textSpan) : optionItem.append(checkbox, textSpan);
            this.optionsContainer.appendChild(optionItem);
            if (option.hasAttribute('button')) {
                optionItem.addEventListener('click', () => {
                    this.dispatchEvent(new CustomEvent('option-click', {
                        detail: {
                            optionType: (option.hasAttribute('button')) ? 'button' : 'checkbox',
                            value: option.value
                        }
                    }));
                });
            }
        });
        let resultWidth = 0;
        console.log(this.shadowRoot.querySelectorAll('.checkbox-select.option-item')[0].clientWidth);
        const optionContainerDisplay = this.optionsContainer.style.display;
        this.optionsContainer.style.display = 'block';
        this.optionsContainer.style.width = '100vw';
        const generatedOptions = Array.from(this.shadowRoot.querySelectorAll('.checkbox-select.option-item'));
        generatedOptions.forEach((element, index) => {
            // console.log(element.clientWidth);
            // console.log(element);
            const span = element.querySelector('.checkbox-select.option-span');
            if (!(span instanceof HTMLSpanElement))
                return;
            const tmpInnTxt = span.innerText;
            // console.error(span);
            span.innerText = `${tmpInnTxt}, `; // Для того, чтобы рассчитать ширину опции с запятой (как будет отображаться в теге <checkbox-select>)
            // console.error(span?.textContent);
            // console.error('SPAN CLIENTWIDTH: ' + span.clientWidth);
            console.error(span);
            resultWidth += span.clientWidth;
            console.log(`option #${index}.clientWidth:\n` + span.clientWidth);
            span.innerText = tmpInnTxt;
        });
        console.error('RESULT: ' + resultWidth);
        this.optionsContainer.style.display = optionContainerDisplay;
        this.optionsContainer.style.width = '100%';
        this.updateSelectedOptions();
        if ((this.isWidthFixed && typeof this.getAttribute('width') === 'string') /* Добавить проверку на то, чтобы длина самой большой опции не превышала фиксированной длины */) {
            // this.mainWrapper.style.width = String(this.getAttribute('width')) + 'px';
            this.valueElement.querySelector('.checkbox-select.value-display-span').style.width = String(this.getAttribute('width')) + 'px';
        }
        else {
            // this.mainWrapper.style.width = (resultWidth + 25) + 'px';
            this.valueElement.querySelector('.checkbox-select.value-display-span').style.width = (resultWidth + 25) + 'px';
        }
    }
    updateSelectedOptions() {
        const selectedOptions = Array.from(this.querySelectorAll('option:checked'));
        const selectedText = selectedOptions.map(opt => opt.textContent).join(', ') || 'Выберите...';
        const valueTextStyles = `
          ${(this.isWidthFixed) ? `
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          ` : ``}
    `;
        const valueDisplaySpan = this.valueElement.querySelector('.checkbox-select.value-display-span');
        if (valueDisplaySpan) {
            valueDisplaySpan.innerText = selectedText;
            // valueDisplaySpan.setAttribute('style', valueTextStyles); // Удаляет установленную ширину всех опций
        }
        else {
            this.valueElement.innerHTML = `
      <span style="${valueTextStyles}" class="checkbox-select value-display-span">${selectedText}</span>
      <span class="checkbox-select value-arrow-button">▼</span>
    `;
        }
    }
    // Публичный метод для добавления опций
    // public addOption(value: string, text: string, selected = false) {
    //   const option = document.createElement('option');
    //   option.value = value;
    //   option.textContent = text;
    //   option.selected = selected;
    //   this.appendChild(option);
    // }
    addNewOption(option) {
        if (Array.from(this.querySelectorAll('option')).some((opt) => {
            return opt.text == option.text || opt.value == option.value;
        })) {
            return;
        }
        ;
        // const option = document.createElement('option');
        // option.value = opt.value;
        // option.textContent = opt.text;
        // option.selected = opt.selected;
        this.appendChild(option);
    }
}
customElements.define('checkbox-select', FromDeepSeekCheckboxSelect);
