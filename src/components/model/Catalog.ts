import { ICatalog, IProduct } from '../../types';
import { EventEmitter } from '../base/events';

/**
 * Класс предоставляет данные для отображения.
 */

export class Catalog {
	items: IProduct[] = [];
	events: EventEmitter;
	constructor(data: ICatalog, events: EventEmitter) {
		this.items = data.items;
		this.events = events;
	}
	public setCatalog(items: IProduct[]) {
		this.items = items;
		this.events.emit('catalog:created');
	}
}
