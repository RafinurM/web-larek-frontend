/**
 * Класс для отображения галереи
 */

import { IGallery, IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../view/Component';

export class Gallery extends Component<IGallery> {
	catalog: HTMLElement;
	basket: HTMLElement;
	constructor(container: HTMLElement) {
		super(container);
		this.catalog = ensureElement<HTMLElement>('.gallery', container);
		this.basket = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			container
		);
	}

	renderGallery(data: HTMLElement) {
		this.catalog.append(data);
	} // debug here
	renderBasket() {} // debug here
}
