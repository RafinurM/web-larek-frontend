import { IOrder, IProduct } from '../../types';

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
	constructor() {
		this.order = new Order();
	}

	get totalPrice(): number {
		return this.order.products.reduce(
			(sum: number, element: IProduct): number => {
				return sum + element.price;
			}, 0);
	}

	get totalCount() {
		return this.order.products.length;
	}

	public addProducts(value: IProduct) {
		if (this.order.products.includes(value)) {
			return
		} else {
			this.order.products.push(value);
		}
		return this
	}

	public removeProduct(id: string) {
		this.order.products = this.order.products.filter((item: IProduct) => {
			return item.id !== id;
		});
		return this;
	}

	public setPaymentType(value: string) {
		this.order.paymentType = value;
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

	// for debugging =======================

	public getOrder() {
		return this.order;
	}

	public reset() {
		return this.order = new Order;
	}
	//========================================

	public createOrder(): IOrder {
		return this.order;
	}
}
