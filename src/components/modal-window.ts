type HexDigit = string;

type HexColor3 = `#${HexDigit}${HexDigit}${HexDigit}`;
type HexColor4 = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;
type HexColor6 = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;
type HexColor8 = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

type HexColor = HexColor3 | HexColor4;

interface IColorTypes {
    [color: string]: HexColor;
}

class ModalWindow extends HTMLElement {
    public isOpened: boolean = false;
    private modalElement: HTMLDivElement | null = null;
    private closeButton: HTMLButtonElement | null = null;

    constructor() {
        super();
        // alert('ModalWindow Created!');
        const waitInterval: number = setInterval(() => {
            // console.log((this.attributes as { [key: string]: any}));
            if (this.attributes.length > 0) {
                this.attachShadow({ mode: 'open' });
                this.isOpened = Boolean(this.getAttribute('opened')) || false;
                this.initElement();
                clearInterval(waitInterval);
                // console.log(this.getAttribute('open-button'));
            }
        }, 10);        
    }

    private initElement(): void {
        if (!this.shadowRoot) return;
        const colorType: string = this.getAttribute('color') || 'default';
        const colorTypes: IColorTypes = {
            'default': '#e6e6e6',
            'secondary': '#000000',
        }
        this.shadowRoot.innerHTML = `

            <style type="text/css">
                @keyframes show-anim__default {
                
                    0% {
                        opacity: 0;
                        display: none;
                    }

                    1% {
                        display: block;
                    }

                    100% {
                        opacity: 1;
                        display: block;
                    }

                }

                

                @keyframes show-anim__scale {
                
                    0% {
                        scale: 0;
                        display: none;
                    }

                    1% {
                        display: flex;
                    }

                    100% {
                        scale: 1;
                        display: flex;
                    }

                }

                @keyframes show-anim__expand {
                
                    0% {
                        transform: rotate3d(1, 0, 0, 90deg);
                        transform-origin: 50% 0%;
                        display: none;
                    }

                    1% {
                        display: flex;
                    }

                    100% {
                        transform: rotate3d(1, 0, 0, 0deg);
                        transform-origin: 50% 0%;
                        display: flex;
                    }

                }

                @keyframes show-anim__scale-rotate {
                
                    0% {
                        scale: 0;
                        rotate: 360deg;
                        display: none;
                    }

                    1% {
                        display: flex;
                    }

                    100% {
                        scale: 1;
                        rotate: 0deg;
                        display: flex;
                    }

                }


                .modal .modal-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100vw;
                    height: 100vh;
                    background-color:rgba(0, 0, 0, 0.39);
                    z-index: 9;
                    margin: 0;
                }

                .modal .modal-content {
                    min-width: 55%;
                    /* height: 45%; */
                    background-color: ${(colorType.match(/#[0-9]*/g)) ? colorType : colorTypes[colorType]};
                    color: #000000;
                    font-family: sans-serif;
                    border: 1px solid #000000;
                    display: flex;
                    flex-direction: column;
                    padding: 0 10px;
                }

                .popup .modal-content {
                    position: absolute;
                    top: 10px;
                    left: 30%;
                    right: 30%;
                    /* height: 20%; */
                    background-color: ${(colorType.match(/#[0-9]*/g)) ? colorType : colorTypes[colorType]};
                    border: 1px solid #000000;
                }

                .modal-content__top {
                    width: 100%;
                    height: 80%;
                    /* background-color: green; */
                    display: flex;
                    align-items: center;
                    justify-content: start;
                    flex-direction: column;
                }

                .modal-content__bottom {
                    width: 100%;
                    height: 20%;
                    /* background-color: red; */
                    display: flex;
                    justify-content: center;
                    align-items: end;
                }

                button {
                    margin: 20px 0;
                    cursor: pointer;
                }

                :disabled {
                    cursor: not-allowed;
                }

                select, input, button {
                    padding: 5px;
                    cursor: pointer;
                }
            </style>
            <div id="modal-window" class="${this.getAttribute('type') || 'modal'}">
                ${(this.getAttribute('type') == 'modal') ? `<div class="modal-bg">` : ``}
                    <div class="modal-content">
                        <div class="modal-content__top">
                            <h2>${this.getAttribute('modal-title')}</h2>
                            <div class="modal-inner-content">
                                <slot></slot>
                            </div>
                        </div>
                        <div class="modal-content__bottom">
                            <button id="modal-close-button">Закрыть окно</button>
                        </div>
                    </div>
                ${(this.getAttribute('type') == 'modal') ? `</div>` : ``}
            </div>
        `;
        // alert(this.innerHTML);
        this.modalElement = this.shadowRoot.querySelector('#modal-window');
        this.closeButton = this.shadowRoot.querySelector('#modal-close-button');
        if (this.modalElement && !this.hasAttribute('opened')) this.modalElement.style.display = 'none';
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }
        const openBtn: HTMLElement | null = (this.getAttribute('open-button') != null) ? document.querySelector(this.getAttribute('open-button') || '') : null;
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                this.open();
            });
        }
    }

    public open(): void {
        if (!this.modalElement) return;
        const content = this.modalElement.querySelector('.modal-content') as HTMLDivElement;
        // this.modalElement.style.animation = (this.getAttribute('show-animation') != null && this.getAttribute('show-animation') != 'none') ? `show-anim__${this.getAttribute('show-animation')} 1s ease 0s 1 normal forwards` : `none`;
        // console.log((this.getAttribute('show-animation') != null && this.getAttribute('show-animation') != 'none') ? `show-anim__${this.getAttribute('show-animation')} 0.75s ease 0s 1 normal both` : `none`);
        content.style.animation = '';
        content.style.animation = (this.getAttribute('show-animation') != null && this.getAttribute('show-animation') != 'none') ? `show-anim__${this.getAttribute('show-animation')} 0.75s ease 0s 1 alternate both` : `none`;
        // alert((this.getAttribute('show-animation') != null && this.getAttribute('show-animation') != 'none') ? `show-anim__${this.getAttribute('show-animation')} 1s ease 0s 1 normal forwards` : `none`);
        // if (!this.modalElement.style.animation) this.modalElement.style.display = '';
        this.modalElement.style.display = '';
        this.isOpened = true;
    }

    public close(): void {
        if (!this.modalElement) return;
        const content: HTMLDivElement = this.modalElement.querySelector('.modal-content') as HTMLDivElement;
        content.style.animation = '';

        setTimeout(() => {
            content.style.animation = (this.getAttribute('hide-animation') != null && this.getAttribute('hide-animation') != 'none') ? `show-anim__${this.getAttribute('hide-animation')} 0.75s ease 0s 1 alternate-reverse backwards` : `none`;
        }, 10);
        // content.style.animation = '';
        if (this.closeButton) {
            this.closeButton.disabled = true;
        };
        const animationEndListener: (e: AnimationEvent) => void = (e: AnimationEvent) => {
            if (!content.style.animationDirection.includes('reverse')) return;
            // if (e.animationName == `show-anim__${this.getAttribute('hide-animation')}`) {
            console.log(`AnimationEnd! ${e.animationName}`);
            // alert(e.elapsedTime);
            // alert(content.style.animationDirection);
            if (e.elapsedTime >= 0.75) {
                if (!this.modalElement) return;
                this.modalElement.style.display = 'none';
                if (this.closeButton) {
                    this.closeButton.disabled = false
                };
                content.removeEventListener('animationend', (event: AnimationEvent) => animationEndListener(event));
            }
        }
        if (typeof this.getAttribute('hide-animation') === 'string' && this.getAttribute('hide-animation') != 'none') {
            content.addEventListener('animationend', (event: AnimationEvent) => animationEndListener(event));
        } else {
            if (!this.modalElement.style.animation) this.modalElement.style.display = 'none';
            if (this.closeButton) this.closeButton.disabled = false;
        }
        // if (!this.modalElement.style.animation) this.modalElement.style.display = 'none';
        // setTimeout(() => {
        //     if (!this.modalElement) return;
        //     this.modalElement.style.display = 'none';
        //     if (this.closeButton) {
        //         this.closeButton.disabled = false
        //     };
        // }, 500);
        this.isOpened = false;
    }
}

customElements.define('modal-window', ModalWindow);