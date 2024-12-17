import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';
/**
 * Класс отображения корзины в модальном окне
 */
export class Basket extends Component<IProduct> {
	protected _list: HTMLUListElement;
	orderCreateButton?: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);
		this._list = ensureElement<HTMLUListElement>('.basket__list', container);
		this.orderCreateButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		// debug here
		this.orderCreateButton.addEventListener('click', () => {
			console.log('open modal of form');
		});
	}

	set content(value: HTMLElement) {
		this._list.replaceChildren(value);
	}

	render(data?: Partial<IProduct>): HTMLElement {
		super.render(data);
		return this.container;
	}
}
