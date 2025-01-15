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

const cardBasketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const modalContainerTemplate =
	ensureElement<HTMLTemplateElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// =============================================================================

// Экземпляры
const api = new Api(API_URL); // API_URL - base url for requests
const builder = new OrderBuilder(); // Корзина data
const events = new EventEmitter();
const pageWrapper: HTMLElement = ensureElement('.page__wrapper');
const gallery = new Gallery(pageWrapper);
const appData = new Catalog({ items: [], total: 0 }); // init appData
const modal = new Modal(modalContainerTemplate, events); // modal
const basketIcon = document.querySelector('.header__basket');
const basketWindow = new Basket(cloneTemplate(basketTemplate), events);
const basketIconCounter = basketIcon.querySelector('.header__basket-counter');
basketIcon.addEventListener('click', () => {
	events.emit('basket:update');
});

// Элемент разметки форма заказа
const orderWindow = new Form(cloneTemplate(orderTemplate), events);

// Элемент разметки форма контакты
const contactsWindow = new Form(cloneTemplate(contactsTemplate), events);

// Элемент разметки Удачно
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


// events!!======================================================


// CARD
events.on('card:open', (cardData: IProduct) => {
	const cardFull = new Card(cloneTemplate(cardPreviewTemplate), events);
	let product = builder.getOrder().products.find(item => item.id === cardData.id);
	if (product) {
		cardFull.setDisabled(cardFull.addButton, true);
	};
	modal.render({
		content: cardFull.render(cardData),
	});
});

events.on('card:add', (cardData: IProduct) => {
	const product = appData.items.find(item => item.id === cardData.id);
	builder.addProducts(product);
	basketIconCounter.textContent = builder.totalCount.toString();
});

events.on('card:remove', (cardData: IProduct) => {
	builder.removeProduct(cardData.id);
	basketIconCounter.textContent = builder.totalCount.toString();
	events.emit('basket:update');
});


// BASKET
events.on('basket:update', () => {
	if (builder.totalCount) { // 
		basketWindow.setDisabled(basketWindow.orderCreateButton, false);
	} else {
		basketWindow.setDisabled(basketWindow.orderCreateButton, true);
	};

	basketWindow.items = builder.getOrder().products.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketItemTemplate), events);
		card.basketIndex.textContent = `${index + 1}`;
		return card.render(item)
	});
	basketWindow.totalPrice = builder.totalPrice;

	modal.render({
		content: basketWindow.render()
	})
});

events.on('basket:toOrder', () => {
	modal.render({
		content: orderWindow.render()
	})
});

// ORDER

events.on('order:setCash', () => {
	builder.setPaymentType('При получении');
})

events.on('order:setCard', () => {
	builder.setPaymentType('Онлайн');
})

events.on('order:update', (data: Partial<IOrder>) => {
	builder.setDeliveryAdress(data.deliveryAdress);
	builder.setEmail(data.email);
	builder.setPhone(data.phone);
	console.log(builder.getOrder());
	events.emit('order:toContacts');
})

events.on('order:toContacts', () => {
	contactsWindow.valid = false;
	modal.render({
		content: contactsWindow.render()
	})
});

// CONTACTS

events.on('toModalRestart', () => {
	builder.reset();
	modal.closeModal();
	basketIconCounter.textContent = builder.totalCount.toString();
})

events.on('order:toSuccess', () => {
	successWindow.total = builder.totalPrice;
	modal.render({
		content: successWindow.render()
	})
});


