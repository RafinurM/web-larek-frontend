import { IOrder } from '../../types';
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
	addressInput?: HTMLInputElement;
	emailInput?: HTMLInputElement;
	phoneInput?: HTMLInputElement;
	nextButton?: HTMLButtonElement;
	payButton?: HTMLButtonElement;
	formErrors: HTMLSpanElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container);
		this.setCashPaymentButton = container.cash;
		this.setOnlinePaymentButton = container.card;
		this.addressInput = container.address;
		this.emailInput = container.email;
		this.phoneInput = container.phone;
		this.nextButton = container.querySelector('.order__button'); // Кнопка "Далее"
		this.payButton = container.querySelector('.pay__button'); // Кнопка "Оплатить"
		this.formErrors = container.querySelector('.form__errors'); // ошибки

		if (this.setCashPaymentButton) {
			this.setCashPaymentButton.addEventListener('click', () => {
				events.emit('order:setCash');
			});
		}

		if (this.setOnlinePaymentButton) {
			this.setOnlinePaymentButton.addEventListener('click', () => {
				events.emit('order:setCard');
			});
		}

		if (this.addressInput) {
			this.addressInput.addEventListener('input', () => {
				events.emit('order:setDeliveryAdress', {
					address: this?.addressInput?.value,
				});
			});
		}

		if (this.emailInput) {
			this.emailInput.addEventListener('input', () => {
				events.emit('order:setEmail', {
					email: this?.emailInput?.value,
				});
			});
		}

		if (this.phoneInput) {
			this.phoneInput.addEventListener('input', () => {
				events.emit('order:setPhone', {
					phone: this?.phoneInput?.value,
				});
			});
		}

		if (this.nextButton) {
			this.nextButton.addEventListener('click', (event: Event) => {
				event.preventDefault();
				events.emit('order:toContacts');
			});
		}

		if (this.payButton) {
			this.payButton.addEventListener('click', (event: Event) => {
				event.preventDefault();
				events.emit('order:sent');
			});
		}
	}

	resetForm(order: IOrder) {
		if (this.setCashPaymentButton) {
			this.setCashPaymentButton.classList.remove('button_alt-active');
		}
		if (this.setOnlinePaymentButton) {
			this.setOnlinePaymentButton.classList.remove('button_alt-active');
		}
		if (this.emailInput) {
			this.emailInput.value = order.email;
		}
		if (this.addressInput) {
			this.addressInput.value = order.address;
		}
		if (this.phoneInput) {
			this.phoneInput.value = order.phone.toString();
		}

		this.setDisabled(this.nextButton, true);
		this.setDisabled(this.payButton, true);
	}

	setPaymentType(order: IOrder) {
		switch (order.payment) {
			case 'При получении':
				this.setCashPaymentButton.classList.add('button_alt-active');
				this.setOnlinePaymentButton.classList.remove('button_alt-active');
				break;
			case 'Онлайн':
				this.setCashPaymentButton.classList.remove('button_alt-active');
				this.setOnlinePaymentButton.classList.add('button_alt-active');
				break;
			default:
				this.setCashPaymentButton.classList.remove('button_alt-active');
				this.setOnlinePaymentButton.classList.remove('button_alt-active');
		}
	}

	setErrorMessage(message: string) {
		this.setText(this.formErrors, message);
	}

	render(data?: IForm): HTMLElement {
		super.render(data);
		return this.container;
	}
}
