import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Catalog } from './components/model/Catalog';
import { OrderBuilder } from './components/model/OrderBuilder';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { Form } from './components/view/Form';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Poster } from './components/view/Poster';
import './scss/styles.scss';
import { ICatalog, IOrder, IProduct } from './types';
import { API_URL, TESTDATA } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// =============================================================================

// templates ===================================================================
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketItemTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainerTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// =============================================================================

// Экземпляры
const api = new Api(API_URL); // API_URL - base url for requests
const events = new EventEmitter();
const builder = new OrderBuilder(events); // Корзина data
const pageWrapper: HTMLElement = ensureElement('.page__wrapper');
const gallery = new Gallery(pageWrapper);
const appData = new Catalog({ items: [] }); // init appData
const modal = new Modal(modalContainerTemplate); // modal
const basketWindow = new Basket(cloneTemplate(basketTemplate), events);
const basketIcon = document.querySelector('.header__basket'); // icon basket
basketIcon.addEventListener('click', () => {
	events.emit('basket:open');
});

// Элемент разметки форма заказа
const orderWindow = new Form(cloneTemplate(orderTemplate), events);

// Элемент разметки форма контакты
const contactsWindow = new Form(cloneTemplate(contactsTemplate), events);

// Элемент разметки постер Удачно
const successWindow = new Poster(cloneTemplate(successTemplate), events);

// api
api
	.get('/product/')
	.then((data) => data as ICatalog)
	.then((responce) => {
		appData.setCatalog(responce.items);
		appData.items.forEach((item) => {
			const card = new Card(cloneTemplate(cardTemplate), events);
			card.render().addEventListener('click', () => {
				events.emit('card:open', item);
			});
			gallery.renderGallery(card.render(item));
		});
	});

// CARD

// card open
events.on('card:open', (cardData: IProduct) => {
	const cardFull = new Card(cloneTemplate(cardPreviewTemplate), events);
	let product = builder
		.getOrder()
		.products.find((item) => item.id === cardData.id);
	if (product) {
		cardFull.setDisabled(cardFull.addButton, true);
	}
	modal.render({
		content: cardFull.render(cardData),
	});
});

//card add start
events.on('card:add', (cardData: IProduct) => {
	const product = appData.items.find((item) => item.id === cardData.id);
	builder.addProducts(product);
	events.emit('basket:update');
});

//card added to builder
events.on('card:added', () => {
	gallery.renderBasketCount(builder.totalCount); // меняем отображение только после изменения данных
});

//card remove start
events.on('card:remove', (cardData: IProduct) => {
	builder.removeProduct(cardData.id);
});

//card removed from builder
events.on('card:removed', () => {
	gallery.renderBasketCount(builder.totalCount);
	events.emit('basket:update');
});

// BASKET

//basket open
events.on('basket:open', () => {
	events.emit('basket:update');
	modal.render({
		content: basketWindow.render(),
	});
});

// вызываем при каждом изменении данных
events.on('basket:update', () => {
	if (builder.totalCount) {
		basketWindow.setDisabled(basketWindow.orderCreateButton, false);
	} else {
		basketWindow.setDisabled(basketWindow.orderCreateButton, true);
	}

	basketWindow.items = builder.getOrder().products.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketItemTemplate), events);
		card.basketIndex.textContent = `${index + 1}`;
		return card.render(item);
	});
	basketWindow.totalPrice = builder.totalPrice;
});

// кликаем оформить
events.on('basket:toOrder', () => {
	modal.render({
		content: orderWindow.render(),
	});
});

// forms validity
events.on('form:changed', () => {
	if (builder.getOrder().paymentType && builder.getOrder().deliveryAdress) {
		orderWindow.setDisabled(orderWindow.nextButton, false);
	} else {
		orderWindow.setDisabled(orderWindow.nextButton, true);
	}

	if (builder.getOrder().email && builder.getOrder().phone) {
		contactsWindow.setDisabled(contactsWindow.payButton, false);
	} else {
		contactsWindow.setDisabled(contactsWindow.payButton, true);
	}
});

// ORDER

//выбрали оплату при получении
events.on('order:setCash', () => {
	builder.setPaymentType('При получении');
	events.emit('form:changed');
});

//выбрали оплату онлайн
events.on('order:setCard', () => {
	builder.setPaymentType('Онлайн');
	events.emit('form:changed');
});

// переключение класса при перевыборе типа оплаты
events.on('paymentType:changed', () => {
	if (builder.getOrder().paymentType === 'При получении') {
		orderWindow.setCashPaymentButton.classList.add('button_alt-active');
		orderWindow.setOnlinePaymentButton.classList.remove('button_alt-active');
	} else {
		orderWindow.setCashPaymentButton.classList.remove('button_alt-active');
		orderWindow.setOnlinePaymentButton.classList.add('button_alt-active');
	}
});

//напечатали хотя б одну букву адреса
events.on('order:setDeliveryAdress', (data: Partial<IOrder>) => {
	builder.setDeliveryAdress(data.deliveryAdress);
	events.emit('form:changed');
});

//напечатали емейл
events.on('order:setEmail', (data: Partial<IOrder>) => {
	builder.setEmail(data.email);
	events.emit('form:changed');
});

//напечатали номер
events.on('order:setPhone', (data: Partial<IOrder>) => {
	builder.setPhone(data.phone);
	events.emit('form:changed');
});

// перерисовываем количество товаров в корзине, сбрасываем формы и кнопки
events.on('data:reset', () => {
	gallery.renderBasketCount(builder.totalCount);
	orderWindow.setOnlinePaymentButton.classList.remove('button_alt-active');
	orderWindow.setCashPaymentButton.classList.remove('button_alt-active');
	orderWindow.deliveryAdressInput.value = builder.getOrder().deliveryAdress;
	orderWindow.setDisabled(orderWindow.nextButton, true);
	contactsWindow.emailInput.value = builder.getOrder().email;
	contactsWindow.phoneInput.value = builder.getOrder().phone.toString();
	contactsWindow.setDisabled(contactsWindow.payButton, true);
});

// отрисовываем форму контактов
events.on('order:toContacts', () => {
	modal.render({
		content: contactsWindow.render(),
	});
});

// CONTACTS

// закрытие модального окна
events.on('modal:close', () => {
	modal.closeModal();
});


// отрисовываем постер успешный успех, сбрасываем заказ
events.on('order:toSuccess', () => {
	successWindow.total = builder.totalPrice;
	builder.reset();
	modal.render({
		content: successWindow.render(),
	});
});
