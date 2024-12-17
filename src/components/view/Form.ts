import { Component } from './Component';

interface IForm {
	valid: boolean;
}

/**
 * Класс отображает формы для заполнения полльзователем
 */
export class Form extends Component<IForm> {
	submitButton?: HTMLButtonElement;

	constructor(container: HTMLFormElement) {
		super(container);
		this.submitButton = container.querySelector('.order__button');

		// debug here
		// this.submitButton.addEventListener('click', () => {
		//     console.log('Далее....')
		// })
	}

	set valid(value: boolean) {}

	render(data?: IForm): HTMLElement {
		super.render(data);
		return this.container;
	}
}
