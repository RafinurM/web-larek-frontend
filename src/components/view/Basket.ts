import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Component } from './Component';
/**
 * Класс отображения корзины в модальном окне
 */
interface IBasket {
	items: HTMLElement[];
	totalPrice: number;
}

export class Basket extends Component<IBasket> {
	basketList: HTMLElement;
	basketPrice: HTMLElement;
	orderCreateButton?: HTMLButtonElement;

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
		this.orderCreateButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.orderCreateButton.addEventListener('click', () => {
			events.emit('basket:toOrder');
		});
	}

	set items(item: HTMLElement[]) {
		if (item.length) {
			this.basketList.replaceChildren(...item);
		} else {
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set totalPrice(value: number) {
		this.basketPrice.textContent = `${value} синапсов`;
	}
}
