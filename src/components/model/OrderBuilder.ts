import { IOrder, IProduct } from '../../types';
import { EventEmitter } from '../base/events';

/**
 * Класс заказа.
 */
class Order implements IOrder {
	constructor(
		public products: IProduct[] = [],
		public paymentType: string = '',
		public deliveryAdress: string = '',
		public email: string = '',
		public phone: number = 0,
		public totalPrice: number = 0
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

	get totalPrice(): number {
		return this.order.products.reduce(
			(sum: number, element: IProduct): number => {
				return sum + element.price;
			},
			0
		);
	}

	get totalCount() {
		return this.order.products.length;
	}

	public addProducts(value: IProduct) {
		if (this.order.products.includes(value)) {
			return;
		} else {
			this.order.products.push(value);
			this.events.emit('card:added');
		}
		return this;
	}

	public removeProduct(id: string) {
		this.order.products = this.order.products.filter((item: IProduct) => {
			return item.id !== id;
		});
		this.events.emit('card:removed');
		return this;
	}

	public setPaymentType(value: string) {
		this.order.paymentType = value;
		this.events.emit('paymentType:changed');
		return this;
	}

	public setDeliveryAdress(value: string) {
		this.order.deliveryAdress = value;
		return this;
	}

	public setEmail(value: string) {
		this.order.email = value;
		return this;
	}

	public setPhone(value: number) {
		this.order.phone = value;
		return this;
	}

	public getOrder() {
		return this.order;
	}

	public reset() {
		this.order = new Order();
		this.events.emit('data:reset');
		return this.order;
	}
}
