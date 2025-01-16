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
	nextButton?: HTMLButtonElement;
	payButton?: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container);
		this.setCashPaymentButton = container.cash;
		this.setOnlinePaymentButton = container.card;
		this.deliveryAdressInput = container.address;
		this.emailInput = container.email;
		this.phoneInput = container.phone;
		this.nextButton = container.querySelector('.order__button'); // Кнопка "Далее"
		this.payButton = container.querySelector('.pay__button'); // Кнопка "Оплатить"

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

		if (this.deliveryAdressInput) {
			this.deliveryAdressInput.addEventListener('input', () => {
				events.emit('order:setDeliveryAdress', {
					deliveryAdress: this?.deliveryAdressInput?.value,
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
				events.emit('order:toSuccess');
			});
		}
	}

	render(data?: IForm): HTMLElement {
		super.render(data);
		return this.container;
	}
}
