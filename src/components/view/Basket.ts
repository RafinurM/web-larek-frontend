import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Component } from './Component';
/**
 * Класс отображения корзины в модальном окне
 */
interface IBasket {
	items: HTMLElement[];
	totalPrice: string;
}

export class Basket extends Component<IBasket> {
	basketList: HTMLElement;
	basketPrice: HTMLElement;
	basketIcon: HTMLElement;
	orderCreateButton?: HTMLButtonElement;
	protected _items: HTMLElement[] = [];

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);
		this.basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.basketPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.basketIcon = ensureElement<HTMLElement>('.header__basket');
		this.orderCreateButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.basketIcon.addEventListener('click', () => {
			events.emit('basket:open');
		});

		this.orderCreateButton.addEventListener('click', () => {
			events.emit('basket:toOrder');
		});

		this.setDisabled(this.orderCreateButton, true); // default off
	}

	set items(item: HTMLElement[]) {
		if (item.length) {
			this.basketList.replaceChildren(...item);
			this._items = item;
		} else {
			this._items = [];
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	get items() {
		return this._items;
	}

	set totalPrice(value: number) {
		this.basketPrice.textContent = `${value} синапсов`;
	}
}
