import { Api } from './components/base/api';
import { Catalog } from './components/model/Catalog';
import { OrderBuilder } from './components/model/OrderBuilder';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { Form } from './components/view/Form';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Poster } from './components/view/Poster';
import './scss/styles.scss';
import { ICatalog, IProduct } from './types';
import { API_URL, TESTDATA } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// =============================================================================

// templates ===================================================================
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basket = ensureElement<HTMLTemplateElement>('#basket');
const order = ensureElement<HTMLTemplateElement>('#order');
const contacts = ensureElement<HTMLTemplateElement>('#contacts');
const success = ensureElement<HTMLTemplateElement>('#success');
// =============================================================================

// Экземпляры

const api = new Api(API_URL);
const builder = new OrderBuilder(); // Корзина
builder
	.addProducts(TESTDATA.items[0])
	.addProducts(TESTDATA.items[2])
	.addProducts(TESTDATA.items[1]);
const pageWrapper: HTMLElement = ensureElement('.page__wrapper');
const gallery = new Gallery(pageWrapper);
const appData = new Catalog({ items: [], total: 0 }); // init appData
const modal = new Modal(modalContainer); // modal
// =============================================================================

// view test code
const cardBas = new Card(cloneTemplate(cardBasket)); // debug here
const cardFull = new Card(cloneTemplate(cardPreview));

// Элемент разметки Basket
const basketIcon = document.querySelector('.header__basket');
const basketElement = new Basket(cloneTemplate(basket));

basketIcon.addEventListener('click', () => {
	// debug here
	modal.render({
		content: basketElement.render(),
	});
});

// Элемент разметки заказа

const orderWindow = new Form(cloneTemplate(order));
// modal.render({
// 	content: orderWindow.render(),
// });

// Элемент разметки контакты
const contactsWindow = new Form(cloneTemplate(contacts));
// modal.render({
// 	content: contactsWindow.render(),
// });

// Элемент разметки Удачно
const successWindow = new Poster(cloneTemplate(success));
modal.render({
	content: successWindow.render(),
});

// api
api
	.get('/product/')
	.then((data) => data as ICatalog)
	.then((resp) => {
		appData.setCatalog(resp.items);
		appData.items.forEach((item) => {
			const card = new Card(cloneTemplate(cardTemplate));
			card.render().addEventListener('click', () => {
				// debug here
				modal.render({
					content: cardFull.render({
						title: item.title,
						price: item.price,
						image: item.image,
						category: item.category,
						description: item.description,
					}),
				});
			});
			gallery.renderGallery(card.render(item));
		});
	});
