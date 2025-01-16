import { categoryColor, IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
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
	basketIndex?: HTMLElement;
	addButton?: HTMLButtonElement;
	deleteButton?: HTMLButtonElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector<HTMLElement>('.card__category');
		this._image = container.querySelector<HTMLImageElement>('.card__image');
		this._description = container.querySelector<HTMLElement>('.card__text');
		this.basketIndex = container.querySelector('.basket__item-index');
		this.addButton =
			container.querySelector<HTMLButtonElement>('.card__button');
		this.deleteButton = container.querySelector<HTMLButtonElement>(
			'.basket__item-delete'
		);

		if (this.addButton) {
			this.addButton.addEventListener('click', () => {
				events.emit('card:add', this);
				this.setDisabled(this.addButton, true); // добавили в корзину -> кнопку выключили
			});
		}

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', () => {
				events.emit('card:remove', this);
			});
		}
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
		this.setText(this._category, value); // текст категории
		// category color v1 - case with types
		this._category?.classList.remove('card__category_soft'); // remove default class if present
		if (this._category) {
			switch (value) {
				case 'софт-скил':
					this._category.style.backgroundColor = categoryColor.GREEN;
					break;
				case 'другое':
					this._category.style.backgroundColor = categoryColor.YELLOW;
					break;
				case 'дополнительное':
					this._category.style.backgroundColor = categoryColor.PURPLE;
					break;
				case 'кнопка':
					this._category.style.backgroundColor = categoryColor.CYAN;
					break;
				case 'хард-скил':
					this._category.style.backgroundColor = categoryColor.ORANGE;
					break;
				default:
					this._category.style.backgroundColor = categoryColor.GREEN;
					break;
			}
		}
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
