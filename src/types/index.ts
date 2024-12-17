/**
 * Интерфейс товара
 * Данные такого типа мы ожидаем от каждого товара.
 */
export interface IProduct {
	category: string;
	title: string;
	price: number;
	image: string;
	description: string;
	id: string;
}

/**
 * Цвета для категорий товаров
 */
export enum categoryColor {
	GREEN = '#83FA9D',
	YELLOW = '#FAD883',
	PURPLE = '#B783FA',
	CYAN = '#83DDFA',
	ORANGE = '#FAA083',
}

/**
 * Данные такого типа мы ожидаем на входе.
 */
export interface ICatalog {
	items: IProduct[];
	total: number;
}

/**
 * Интерфейс объекта заказа.
 * Данные такого типа мы хотим сформировать и отправить на сервер.
 */
export interface IOrder {
	products: IProduct[];
	paymentType: string;
	deliveryAdress: string;
	email: string;
	phone: number;
	totalPrice: number;
}

/**
 * Интерфейс галереи
 */
export interface IGallery {
	gallery: HTMLElement;
}

/**
 * Интерфейс модального окна
 */
export interface IModal {
	content: HTMLElement;
}
