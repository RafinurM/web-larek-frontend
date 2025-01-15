import { EventEmitter } from '../base/events';
import { Component } from './Component';

interface IForm {
	valid: boolean;
}

/**
 * Класс отображает формы для заполнения полльзователем
 */
export class Form extends Component<IForm> {
	setOnlinePaymentButton?: HTMLButtonElement;
	setCashPaymentButton?: HTMLButtonElement;
	deliveryAdressInput?: HTMLInputElement;
	emailInput?: HTMLInputElement;
	phoneInput?: HTMLInputElement;
	submitButton?: HTMLButtonElement;
	payButton?: HTMLButtonElement;
	_formValid: boolean;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container);
		this.setCashPaymentButton = container.cash;
		this.setOnlinePaymentButton = container.card;
		this.deliveryAdressInput = container.address;
		this.emailInput = container.email;
		this.phoneInput = container.phone;
		this.submitButton = container.querySelector('.order__button');
		this.payButton = container.querySelector('.pay__button');

		if (this.setCashPaymentButton) {
			this.setCashPaymentButton.addEventListener('click', () => {
				events.emit('order:setCash');
				this.toggleClass(this.setCashPaymentButton, 'button_alt-active');				
			});
		};

		if (this.setOnlinePaymentButton) {
			this.setOnlinePaymentButton.addEventListener('click', () => {
				events.emit('order:setCard');
				this.toggleClass(this.setOnlinePaymentButton, 'button_alt-active');				
			});
		};
		

		if (this.deliveryAdressInput) {
			this.deliveryAdressInput.addEventListener('input', () => {
				this.setDisabled(this.submitButton, false);
			})
		}

		if (this.emailInput) {
			this.emailInput.addEventListener('input', () => {
				this.setDisabled(this.submitButton, false)
				// console.log('input text') // test
			})
		}

		if (this.phoneInput) {
			this.phoneInput.addEventListener('input', () => {
				// console.log('input text') // test
			})
		}

		if(this.submitButton) {
			this.submitButton.addEventListener('click', (event: Event) => {
				event.preventDefault();
				events.emit('order:update', {
					deliveryAdress: this?.deliveryAdressInput?.value,
					email: this?.emailInput?.value,
					phone: this?.phoneInput?.value
				});
			})
		}

		if (this.payButton) {
			this.setDisabled(this.payButton, false);
			this.payButton.addEventListener('click', (event: Event) => {
				event.preventDefault();
				events.emit('order:toSuccess')
			})
		}
		

	}

	set valid(value: boolean) {
		this._formValid = value;
		if (value) {
			this.submitButton
		}
	}

	render(data?: IForm): HTMLElement {
		super.render(data);
		return this.container;
	}
}
