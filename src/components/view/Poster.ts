import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

interface IPoster {
	total: string;
}
/**
 * Класс отображает успешный успех
 */
export class Poster extends Component<IPoster> {
	title: HTMLElement;
	description: HTMLElement;
	closeButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);
		this.title = ensureElement<HTMLElement>('.order-success__title', container);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
	}

	render(data?: Partial<IPoster>): HTMLElement {
		super.render(data);
		return this.container;
	}
}
