/**
 * Класс для отображения галереи
 */

import { IGallery } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../view/Component';

export class Gallery extends Component<IGallery> {
	catalog: HTMLElement;
	basketCount: HTMLElement;
	constructor(container: HTMLElement) {
		super(container);
		this.catalog = ensureElement<HTMLElement>('.gallery', container);
		this.basketCount = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			container
		);
	}

	renderBasketCount(value: number) {
		this.setText(this.basketCount, value);
	}

	renderGallery(data: HTMLElement) {
		this.catalog.append(data);
	}
}
