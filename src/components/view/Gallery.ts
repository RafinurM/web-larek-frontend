/**
 * Класс для отображения галереи
 */

import { IGallery } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../view/Component';
import { Card } from './Card';

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

	renderGallery(cards: HTMLElement[]) {
		this.catalog.replaceChildren(...cards)
	}
}
