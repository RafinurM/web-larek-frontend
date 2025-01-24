import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

/**
 * Класс для отображения модальных окон
 */
export class Modal extends Component<IModal> {
	protected modalContent: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);
		this.modalContent = ensureElement('.modal__content', container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.closeButton.addEventListener('click', () => this.closeModal());
	}

	set content(value: HTMLElement) {
		this.modalContent.replaceChildren(value);
	}

	openModal() {
		this.container.classList.add('modal_active');
		this.container.style.position = 'fixed'; 
	}

	closeModal() {
		this.container.classList.remove('modal_active');
		this.content = null;
	}

	render(data?: Partial<IModal>): HTMLElement {
		super.render(data);
		this.openModal();
		return this.container;
	}
}
