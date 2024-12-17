import { ICatalog, IProduct } from '../../types';

/**
 * Класс предоставляет данные для отображения.
 */
export class Catalog {
	items: IProduct[] = [];
	itemsCount: number = 0;
	constructor(data: ICatalog) {
		this.items = data.items;
		this.itemsCount = data.total;
	}
	public setCatalog(items: IProduct[]) {
		this.items = items;
	}
}
