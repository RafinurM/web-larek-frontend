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
}

/**
 * Интерфейс объекта заказа.
 * Данные такого типа мы хотим сформировать и отправить на сервер.
 */
export interface IOrder {
	items: string[];
	payment: string;
	address: string;
	email: string;
	phone: number;
	total: number;
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
