const EMPTY_VALUE_TEXT: string = 'Выберите...';

class CustomSelect extends HTMLElement {
  public isExpanded: boolean = false;
  private selectedOptions: HTMLOptionElement[] = [];
  private mainWrapper: HTMLDivElement = document.createElement('div');
  private valueElement: HTMLDivElement = document.createElement('div');
  private optionsContainer: HTMLDivElement = document.createElement('div');
  private observer: MutationObserver;
  private slotElement: HTMLSlotElement = document.createElement('slot');
  private isWidthFixed: boolean = false;
  private type: string = 'normal';
  private value: string = '';
  private static openInstances: CustomSelect[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.observer = new MutationObserver(() => this.updateOptions());
    this.dispatchEvent(new CustomEvent('myevent', {
      detail: {

      }
    }));
  }

  connectedCallback() {
    this.initElement();
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  private initElement() {
    this.type = this.getAttribute('type') || 'normal';

    this.shadowRoot!.innerHTML = '';
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

        .option-item.selected {
          background:rgb(146, 146, 146);
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
    this.shadowRoot!.append(style, this.mainWrapper, this.slotElement);

    // Инициализация опций
    this.updateOptions();

    // Обработчики событий
    this.mainWrapper.addEventListener('mousedown', (e: MouseEvent) => {
      e.stopPropagation();
      // alert((e.target as HTMLElement).parentElement?.classList);
      // if ((e.target as HTMLElement).classList.contains('main-wrapper') || (e.target as HTMLElement).classList.contains('main-wrapper')) {

      if (!(e.target as HTMLElement)?.className.includes('option')) {
        // if (e.target != e.relatedTarget) {
        this.toggleOptions();
      } else {
        const isClickInside = this.shadowRoot?.contains(e.target as HTMLElement) || this.contains(e.target as HTMLElement);

        if (!isClickInside) {
          this.collapseOptions();
        }
        // this.collapseOptions();
      }
    });

    window.addEventListener('mousedown', (e: MouseEvent) => {
      // const isClickInside = this.shadowRoot?.contains(e.target as HTMLElement) || this.contains(e.target as HTMLElement);

      // if (!isClickInside) {
      this.collapseOptions();
      // }
      // if ((e.target as CustomSelect) != this) {
      //   this.collapseOptions();
      // }
    });
  }

  private toggleOptions() {
    if (this.isExpanded) {
      this.collapseOptions();
    } else {
      CustomSelect.openInstances.forEach(instance => {
        if (instance !== this) instance.collapseOptions();
      });
      this.expandOptions();
    }
    // this.isExpanded ? this.collapseOptions() : this.expandOptions();
  }

  private expandOptions() {
    this.isExpanded = true;
    this.optionsContainer.style.display = 'block';
    this.setAttribute('expanded', '');
    CustomSelect.openInstances.push(this);
  }

  private collapseOptions() {
    this.isExpanded = false;
    this.optionsContainer.style.display = 'none';
    this.removeAttribute('expanded');
    CustomSelect.openInstances = CustomSelect.openInstances.filter(inst => inst !== this);
  }

  private updateOptions() {
    // Получаем актуальные опции
    const options = Array.from(this.querySelectorAll('option'));
    options.sort((a, b) => (a.hasAttribute('bottom') ? 1 : 0) - (b.hasAttribute('bottom') ? 1 : 0));
    this.optionsContainer.innerHTML = '';

    if (this.type == 'normal' && !options.some((opt) => opt.selected == true)) options[0].selected = true; // Активировать первую опцию, если все остальные неактивны

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

      optionItem.classList.toggle('selected', option.selected);

      if (this.type == 'normal') {
        optionItem.append(textSpan);
        optionItem.addEventListener('click', () => {
          option.selected = true;
          options.forEach((opt) => { (opt != option) ? opt.selected = false : '' });
          this.updateOptions();
        });

      } else if (this.type == 'checkbox') {
        checkbox.addEventListener('change', () => {
          option.selected = checkbox.checked;
          // let tmpInnTxt: string = textSpan.innerText;
          // textSpan.innerText += ', ';
          // alert(textSpan.clientWidth);
          // textSpan.innerText = tmpInnTxt;
          this.updateValue(this.type);
        });

        (Boolean(option.hasAttribute('button')) == true) ? optionItem.append(textSpan) : optionItem.append(checkbox, textSpan);
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
      }
      this.optionsContainer.appendChild(optionItem);
    });

    let resultWidth: number = 0;

    // console.log(this.shadowRoot!.querySelectorAll('.checkbox-select.option-item')[0].clientWidth);
    const optionContainerDisplay: string = this.optionsContainer.style.display;
    this.optionsContainer.style.display = 'block';
    this.optionsContainer.style.width = '100vw';
    const generatedOptions: HTMLElement[] = Array.from(this.shadowRoot!.querySelectorAll('.checkbox-select.option-item'));
    generatedOptions.forEach((element: HTMLElement, index: number) => {
      const span: HTMLSpanElement | null = element.querySelector('.checkbox-select.option-span');
      if (!(span instanceof HTMLSpanElement)) return;
      if (this.type == 'normal') {
        resultWidth = (span.clientWidth > resultWidth) ? span.clientWidth : resultWidth;
      } else if (this.type == 'checkbox') {
        const tmpInnTxt: string | null = span.innerText;
        span.innerText = `${tmpInnTxt}, `; // Для того, чтобы рассчитать ширину опции с запятой (как будет отображаться в теге <checkbox-select>)
        resultWidth += span.clientWidth;
        span.innerText = tmpInnTxt;
      }
    });

    // console.error('RESULT: ' + resultWidth);
    this.optionsContainer.style.display = optionContainerDisplay;
    this.optionsContainer.style.width = '100%';

    this.updateValue(this.type);

    if ((this.isWidthFixed && typeof this.getAttribute('width') === 'string') /* Добавить проверку на то, чтобы длина самой большой опции не превышала фиксированной длины */) {
      // this.mainWrapper.style.width = String(this.getAttribute('width')) + 'px';
      (this.valueElement.querySelector('.checkbox-select.value-display-span') as HTMLSpanElement)!.style.width = String(this.getAttribute('width')) + 'px';
    } else {
      // this.mainWrapper.style.width = (resultWidth + 25) + 'px';
      (this.valueElement.querySelector('.checkbox-select.value-display-span') as HTMLSpanElement)!.style.width = (resultWidth + 25) + 'px';
    }
  }

  public updateValue(type?: string) {

    let selectedText: string = EMPTY_VALUE_TEXT;
    if (type == 'checkbox') {
      const selectedOptions = Array.from(this.querySelectorAll('option:checked'));
      selectedText = selectedOptions.map(opt => opt.textContent).join(', ') || EMPTY_VALUE_TEXT;
    } else if (type == 'normal') {
      const selectedOptions = Array.from(this.querySelectorAll('option:checked'));
      selectedText = selectedOptions[0].textContent || EMPTY_VALUE_TEXT;
      this.collapseOptions();
    } else {

    }

    // this.value = this.innerText;
    // console.log(selectedText);

    const valueTextStyles: string = `
          ${(this.isWidthFixed) ? `
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          ` : ``}
    `;

    // this.setAttribute('value', selectedText);
    // alert('123');
    
    // if (this.id == 'element-type') {
    //   let thisElement: HTMLElement | null = document.querySelector(`${this.tagName.toLowerCase()}${this.id ? `#${this.id}` : ``}`);
    //   console.log('This Element:');
    //   console.log(thisElement);
    //   console.log('this:');
    //   console.log(this);
    //   console.log('this == thisElement :: ' + (this == thisElement));
    //   const newElement: ChildNode = Array.from(this.parentElement!.childNodes).filter((node) => (node == this))[0];
    //   console.log('newElement == thisElement :: ' + (newElement == thisElement));
    //   console.log('NEW ELEMENT:')
    //   console.log(newElement);
    //   // this.dispatchEvent(new CustomEvent('value-change', {
    //   //   detail: {
    //   //     temp: '123'
    //   //   },
    //   //   bubbles: true,
    //   // }));
    // }
    // alert(`${this.tagName} :: Event Created: ${event}`);
    // this.value = String(this.getAttribute('value'));
    this.value = selectedText;
    this.dispatchEvent(new CustomEvent('value-change', {
      detail: {
        value: selectedText,
      },
      bubbles: true,
      composed: true,
    }));
    
    // console.log(this.value);

    const valueDisplaySpan: HTMLSpanElement | null = this.valueElement.querySelector('.checkbox-select.value-display-span');
    if (valueDisplaySpan) {
      valueDisplaySpan.innerText = selectedText;
      // valueDisplaySpan.setAttribute('style', valueTextStyles); // Удаляет установленную ширину всех опций
    } else {
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

  public addNewOption(option: HTMLOptionElement) {
    if (Array.from(this.querySelectorAll('option')).some((opt: HTMLOptionElement) => {
      return opt.text == option.text || opt.value == option.value
    })) {
      return
    };
    // const option = document.createElement('option');
    // option.value = opt.value;
    // option.textContent = opt.text;
    // option.selected = opt.selected;
    this.appendChild(option);
  }
}

customElements.define('custom-select', CustomSelect);