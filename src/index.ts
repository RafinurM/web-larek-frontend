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
import { API_URL } from './utils/constants';
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
const events = new EventEmitter(); // брокер событий
const order = new OrderBuilder(events); // Корзина data
const pageWrapper: HTMLElement = ensureElement('.page__wrapper');
const gallery = new Gallery(pageWrapper);
const appData = new Catalog({ items: [] }); // init appData
const modal = new Modal(modalContainerTemplate); // modal
const basketWindow = new Basket(cloneTemplate(basketTemplate), events);

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
		const cards = appData.items.map((item) => {
			const card = new Card(cloneTemplate(cardTemplate), events);
			if (!item.price) {
				item.price = 0;
			}
			card.render().addEventListener('click', () => {
				events.emit('card:open', item);
			});
			return card.render(item);
		});
		gallery.renderGallery(cards);
	})
	.catch((error) => {
		console.error(error);
	});

// CARD

// card open
events.on('card:open', (cardData: IProduct) => {
	const cardFull = new Card(cloneTemplate(cardPreviewTemplate), events);
	const product = order.getOrder().items.find((item) => item === cardData.id);
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
	order.addProducts(product.id);
});

//card added to builder
events.on('card:added', () => {
	gallery.renderBasketCount(order.totalCount); // меняем отображение только после изменения данных
	events.emit('basket:update');
});

//card remove start
events.on('card:remove', (cardData: IProduct) => {
	order.removeProduct(cardData.id);
});

//card removed from builder
events.on('card:removed', () => {
	gallery.renderBasketCount(order.totalCount);
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
	order.setTotal(appData.items);
	basketWindow.totalPrice = order.getOrder().total;
	if (order.getOrder().total) {
		basketWindow.setDisabled(basketWindow.orderCreateButton, false);
	} else {
		basketWindow.setDisabled(basketWindow.orderCreateButton, true);
	}
	basketWindow.items = order.getOrder().items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketItemTemplate), events);
		card.basketIndex.textContent = `${index + 1}`;
		const cardBasket = appData.items.find((product) => product.id === item);
		return card.render(cardBasket);
	});
});

// кликаем оформить
events.on('basket:toOrder', () => {
	modal.render({
		content: orderWindow.render(),
	});
});

// forms validity
events.on('form:changed', () => {
	if (order.getOrder().payment && order.getOrder().address) {
		orderWindow.setDisabled(orderWindow.nextButton, false);
	} else {
		orderWindow.setDisabled(orderWindow.nextButton, true);
	}

	if (order.getOrder().email && order.getOrder().phone) {
		contactsWindow.setDisabled(contactsWindow.payButton, false);
	} else {
		contactsWindow.setDisabled(contactsWindow.payButton, true);
	}
});

// ORDER

//выбрали оплату при получении
events.on('order:setCash', () => {
	order.setPaymentType('При получении');
	events.emit('form:changed');
});

//выбрали оплату онлайн
events.on('order:setCard', () => {
	order.setPaymentType('Онлайн');
	events.emit('form:changed');
});

// переключение класса при перевыборе типа оплаты
events.on('paymentType:changed', () => {
	orderWindow.buttonChange(order.getOrder());
});

//напечатали хотя б одну букву адреса
events.on('order:setDeliveryAdress', (data: Partial<IOrder>) => {
	order.setDeliveryAdress(data.address);
	events.emit('form:changed');
});

//напечатали емейл
events.on('order:setEmail', (data: Partial<IOrder>) => {
	order.setEmail(data.email);
	events.emit('form:changed');
});

//напечатали номер
events.on('order:setPhone', (data: Partial<IOrder>) => {
	order.setPhone(data.phone);
	events.emit('form:changed');
});

// перерисовываем количество товаров в корзине, сбрасываем формы и кнопки
events.on('data:reset', () => {
	gallery.renderBasketCount(order.totalCount);
	orderWindow.resetForm(order.getOrder());
	contactsWindow.resetForm(order.getOrder());
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

// отправляем заказ, отрисовываем постер успешный успех  или выдаём ошибку, сбрасываем заказ
events.on('order:sent', () => {
	appData.items.find((product) => {
		// проверяем есть ли бесценный товар и убираем
		if (!product.price) {
			order.removeProduct(product.id);
		}
	});
	api
		.post('/order', order.getOrder())
		.then(() => {
			successWindow.total = order.getOrder().total;
			order.reset();
			modal.render({
				content: successWindow.render(),
			});
		})
		.catch((error) => {
			console.error(error);
		});
});
