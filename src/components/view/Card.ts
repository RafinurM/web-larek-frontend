import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

/**
 * Класс карточки товара
 */
export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	// addButton: HTMLButtonElement; debug here

	constructor(container: HTMLElement) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector<HTMLElement>('.card__category');
		this._image = container.querySelector<HTMLImageElement>('.card__image');
		this._description = container.querySelector<HTMLElement>('.card__text');
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: string) {
		if (!value) {
			this.setText(this._price, `Бесценно`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(this._image, `${CDN_URL}${value}`);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	render(data?: Partial<IProduct>): HTMLElement {
		super.render(data);
		return this.container;
	}
}
