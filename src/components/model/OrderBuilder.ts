import { IOrder, IProduct } from '../../types';
import { EventEmitter } from '../base/events';

/**
 * Класс заказа.
 */
class Order implements IOrder {
	constructor(
		public items: string[] = [],
		public payment: string = '',
		public address: string = '',
		public email: string = '',
		public phone: number = 0,
		public total: number = 0
	) {}
}

/**
 * Билдер собирает экземпляр класса Order по частям.
 * @param order - объект типа Order, который мы собираем
 */

export class OrderBuilder {
	private order: Order;
	protected events: EventEmitter;
	constructor(events: EventEmitter) {
		this.order = new Order();
		this.events = events;
	}

	get totalCount() {
		return this.order.items.length;
	}

	public addProducts(id: string) {
		if (this.order.items.includes(id)) {
			return;
		} else {
			this.order.items.push(id);
			this.events.emit('card:added');
		}
		return this;
	}

	public removeProduct(id: string) {
		this.order.items = this.order.items.filter((item: string) => {
			return item !== id;
		});
		this.events.emit('card:removed');
		return this;
	}

	public setPaymentType(value: string) {
		this.order.payment = value;
		this.validation();
		this.events.emit('paymentType:changed');
		return this;
	}

	public setDeliveryAdress(value: string) {
		this.order.address = value;
		this.validation();
		return this;
	}

	public setEmail(value: string) {
		this.order.email = value;
		this.validation();
		return this;
	}

	public setPhone(value: number) {
		this.order.phone = value;
		this.validation();
		return this;
	}

	public getOrder() {
		return this.order;
	}

	public setTotal(products: IProduct[]) {
		const productsArr = products.filter((item) => {
			return this.order.items.includes(item.id);
		});
		return (this.order.total = productsArr.reduce(
			(sum: number, element: IProduct): number => {
				return sum + element.price;
			},
			0
		));
	}

	public validation() {
		const errorMessages = {
			payment: 'Пожалуйста, выберите способ оплаты',
			address: 'Пожалуйста, укажите адрес доставки',
			email: 'Пожалуйста, укажите электронную почту',
			phone: 'Пожалуйста, укажите контактный телефон',
		};

		if (!this.order.payment) {
			this.events.emit('formPayment:invalid', errorMessages);
		}
		if (!this.order.address) {
			this.events.emit('formAddress:invalid', errorMessages);
		}
		if (!this.order.phone) {
			this.events.emit('formPhone:invalid', errorMessages);
		}
		if (!this.order.email) {
			this.events.emit('formEmail:invalid', errorMessages);
		}
		if (this.order.payment && this.order.address) {
			this.events.emit('orderForm:valid');
		}
		if (this.order.email && this.order.phone) {
			this.events.emit('contactsForm:valid');
		}
	}

	public resetOrder() {
		this.order = new Order();
		this.events.emit('model:reseted');
		this.events.emit('basket:update');
		return this.order;
	}
}
