import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Component } from './Component';

interface IPoster {
	total: string;
}

/**
 * Класс отображает успешный успех
 */

export class Poster extends Component<IPoster> {
	description: HTMLElement;
	closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.closeButton.addEventListener('click', () => {
			events.emit('modal:close');
		});
	}

	set total(value: number) {
		this.setText(this.description, `Списано ${value} синапсов`);
	}

	render(data?: Partial<IPoster>): HTMLElement {
		super.render(data);
		return this.container;
	}
}
