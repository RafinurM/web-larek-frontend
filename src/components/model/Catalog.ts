import { ICatalog, IProduct } from '../../types';

/**
 * Класс предоставляет данные для отображения.
 */
export class Catalog {
	items: IProduct[] = [];
	constructor(data: ICatalog) {
		this.items = data.items;
	}
	public setCatalog(items: IProduct[]) {
		this.items = items;
	}

	
}
