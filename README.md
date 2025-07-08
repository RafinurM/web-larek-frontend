# Проектная работа "Веб-ларек"

Для запуска проекта вам понадобится создать в корне файл с именем .env и разместить в нем следующее содержимое:

__API_ORIGIN=https://larek-api.nomoreparties.co__

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

### Конкретный объект товара

Этот интерфейс реализует тип данных для конкретного товара. Категория, название, стоимость, адрес изображения, описание и уникальный идентификатор.

```
 interface IProduct {
  category: string;
  title: string;
  price: number;
  image: string;
  description: string;
  id: string;
}
```

### Категория товара

Каждая категория товара имеет за собой определённый цвет на макете в тегах.
Вынесем цветовые коды в перечесление и будем пользоватся названиями для удобства.

```
enum categoryColor {
  GREEN = '#83FA9D',
  YELLOW = '#FAD883',
  PURPLE = '#B783FA',
  CYAN = '#83DDFA',
  ORANGE = '#FAA083'
}

```
### Объект заказа

Следующие данные - это данные о заказе, которые вводит пользователь, а приложение собирает в объект и отправляет на сервер. По своей сути это и есть корзина.
Включает в себя: массив уникальных идентификаторов заказа (id), тип оплаты, адрес доставки, электронный адрес, моб. номер для связи, сумма заказа.

```
interface IOrder {
	items: string[];
	payment: string;
	address: string;
	email: string;
	phone: number;
	total: number;
}
```

### Данные с сервера

Интерфейс **ICatalog** описывает какой тип данных мы должны получить на входе для приложения. Это те данные, по которым мы отрисовываем главную страницу и каталог товаров. Каталог представляет собой единственный источник информации о товарах в приложении.
Интерфейс включает в себя: список товаров типа **IProduct**.
```
interface ICatalog {
  items: IProduct[]; 
}
```


## Кирпичики приложения

В приложении используется MVP-архитектура.
Отдельно описан слой данных, слой отображения. В силу того, что приложение обещает быть компактным, связующий код между слоем данных и слоем отображения описан в файле **"./src/index.ts"**.
В проекте предоставлены утилиты описаныые в файле **"./utils/utils.ts"**, константы описаны в файле **"./utils/constants.ts"**.

### Слой данных

Сущности для работы с данными описаны в папке **"./src/components/model"**.

### Класс Catalog

Данный класс реализует интерфейс **ICatalog** и является источников доступных товаров.

Имеет поле:
1. **items** - Массив товаров, получаем с сервера. Инициализируется пустым массивом.
2. **events** - Брокер событий.

Конструктор:
```
    constructor(data: ICatalog, events: EventEmitter) {
        this.items = data.items;
				this.events = events;
    } 
```
   
Имеет методы:
1. **setCatalog(items)** - Устанавливает значение поля **this.items**.  Сообщает *catalog:created* при успешном создании каталога.

### Класс Order

Класс отвечает за создание экземпляра заказа.
Объект такого вида мы хотим получить в итоге. Сразу задаём значения по умолчанию.
Содержит в себе конструктор следующего вида:

```
constructor(
		public items: string[] = [],
		public payment: string = '',
		public address: string = '',
		public email: string = '',
		public phone: number = 0,
		public total: number = 0,
	) {}
```

Эти поля отвечают:
1. **items** - Список id товаров.
2. **payment** - Тип оплаты. *пустая строка* | Онлайн | При получении.
3. **address** - Адресс доставки.
4. **email** - Электронный адресс получателя.
5. **phone** - Мобильный номер для связи.
6. **total** - Сумма заказа.

### Класс OrderBuilder

Этот класс собирает объект заказа имеющий тип **IOrder**, в котором хранятся все данные о заказе. Объект заказа формируется поэтапно, поэтому здесь применяется паттерн **Builder**, который будет формировать заказ. На выходе мы получаем объект с данными которые ввёл пользователь. По своей сути это и есть корзина.
*от англ. *builder - строитель*.

Имеет поле:
1. **get totalCount()** - Геттер, возвращает количество товаров.

Конструктор следующий:

```
	constructor(events: EventEmitter) {
		this.order = new Order();
		this.events = events;
	}
```

Имеет методы:
1. **addProducts(id)** - Добавляет товар в заказ. Где аргумент *value* - id товара.
2. **removeProduct(id)** - Убирает товар из заказа.
3. **setPaymentType()** - Устанавливает тип оплаты.
4. **setdeliveryAdress()** - Устанавливает адресс доставки.
5. **setEmail()** - Устанавливает email который введён в форме.
6. **setPhone()** - Устанавливает моб. номер из формы.
7. **getOrder()** - Возвращает текущий заказ.
8. **setTotal(appData.items)** - Считает сумму товаров. Устанавливает значение поля *total* в возвращаемом классе Order.
9. **validation()** - Валидирует данные, и генерирует событие которое уведомляет об валидности.
10. **reset()** - Обнуляет поля заказа.

### Слой отображения

### Класс **Component** 

Класс абстрактный, имеющий базовые методы для работы с DOM-элементами.
От него наследуем классы для отображения.

Имеет методы:
1. **toggleClass()** - Переключатель класса.
2. **setText()**- Устанавливает текстовое содержимое.
3. **setDisabled()** - Блокировать / разблокировать элемент.
4. **setHidden()** - Скрыть элемент.
5. **setVisible()** - Показать элемент.
6. **setImage()** - Установить изображение с альтернативным текстом.
7. **render()** - Возвращает корневой DOM-элемент.

### Класс Card extends Component

Класс отрисовывает карточку с товаром.

Имеет поля:
1. **protected _title** - Название товара.
2. **protected _price** - Цена товара.
3. **protected _description?** - Описание товара. Необязательное поле.
4. **protected _category?** - Категория товара. Необязательное поле.
5. **protected _image?** - Изображение товара. Необязательное поле.
6. **basketIndex?** - Индекс товара для отображения в корзине. Необязательное поле.
7. **addButton?** - Кнопка добавления в корзину. Необязательное поле.
8. **deleteButton?** - Кнопка удаления из корзины. Необязательное поле.
9. **title** - Сеттер, устанавливает значение поля **_title**.
10. **price** - Сеттер, устанавливает значение поля **_price**. Если значение 0 - то устанавливает цену "Бесценно".
11. **description** - Сеттер, устанавливает значение поля **_description**.
12. **image** - Сеттер, устанавливает значение поля **_image**.
13. **category** - Сеттер, устанавливает значение поля **_category** и цвет категории.


Имеет конструктор следующего вида:

```
	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = container.querySelector<HTMLElement>('.card__category');
		this._image = container.querySelector<HTMLImageElement>('.card__image');
		this._description = container.querySelector<HTMLElement>('.card__text');
    this.basketIndex = container.querySelector('.basket__item-index');
		this.addButton = container.querySelector<HTMLButtonElement>('.card__button');
		this.deleteButton = container.querySelector<HTMLButtonElement>('.basket__item-delete');

		if (this.addButton) {
			this.addButton.addEventListener('click', () => {
					events.emit('card:add', this);
					this.setDisabled(this.addButton, true);		
			});
		}

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', () => {
				events.emit('card:remove', this)
			})
		}
	}
```

Данный класс имеет метод:
1. **render(data)** - Отрисовывает карточку. Где **data** - данные для отрисовки.

### Класс Gallery extends Component

Класс отображает главную страницу приложения. 

Имеет поля:
1. **catalog** - Элемент разметки, где размещаем карточки с товарами.
2. **basketCount** - Элемент разметки, где отображаем количество товаров в корзине.

Конструктор:
```
constructor(container: HTMLElement) {
        super(container);
        this.catalog = ensureElement<HTMLElement>('.gallery', container)
        this.basketCount = ensureElement<HTMLSpanElement>('.header__basket-counter', container)
    }
```

Имеет методы:
1. **renderBasketCount(value)** - Отрисовывает количество товаров в корзине.
2. **renderGallery(data)** - Отрисовывает карточки на главной странице. В качестве аргумента принимает данные, полученные с сервера.

### Класс Modal extends Component

Этот класс занимается отображение модальных окон в приложении. Внутри него будут отрисовыватся различные события/состояния приложения.

Имеет поля:
1. **modalContent**  - Содержимое модального окна.
2. **closeButton** - Кнопка закрыть окно.
3. **content** - Сеттер, значение содержимого окна.

В конструктор принимает контейнер для отображения.
```
constructor(container: HTMLElement){
    super(container);
    this.modalContent = ensureElement('.modal__content', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.closeButton.addEventListener('click', () => this.closeModal());
  }
```

Имеет методы:
1. **openModal()** - Показывает модальное окно.
2. **closeModal()** - Закрывает модальное окно.
3. **render(data)** - Отрисовывает компонент. В качестве аргумента - данные для отрисовки.


### Класс Basket extends Component

Класс занимается отображением списка товаров в корзине.

Имеет поле:
1. **basketList** - Элемент, отображающий список **Card** которые находятся в заказе.
2. **basketPrice** - Элемент, отображающий сумарную цену товаров в корзине. 
3. **basketIcon** - Элемент, отображающий иконку корзины.
4. **orderCreateButton** - Кнопка "оформить". По умолчанию *disabled*.
5. **items** - Сеттер/Геттер, принимает массив объектов типа **Card** и добавляет в список или выводит что "Корзина пуста". Возвращает список **_items**.
6. **protected _items** - Внутренне свойство, хранит в себе массив карточек.
7. **totalPrice** - Сеттер, принимает значение типа **number** и выводит на экран общую сумму.


Конструктор:
```
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
		this.basketIcon = ensureElement<HTMLElement>(
			'.header__basket'
		);
		this.orderCreateButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.basketIcon.addEventListener('click', () => {
			events.emit('basket:open');
		});

		this.orderCreateButton.addEventListener('click', () => {
			events.emit('basket:toOrder');
		});

		this.setDisabled(this.orderCreateButton, true);
	}
```

### Класс Form extends Component

Данный класс отвечает за отрисовку, валидацию форм. Соответствует интерфейсу **IForm**

Имеет поля:
1. **setOnlinePaymentButton?** - Кнопка выбора оплаты "Онлайн". 
2. **setCashPaymentButton?** - Кнопка выбора оплаты "При получении". 
3. **deliveryAdressInput?** - Поле ввода адреса доставки. 
4. **emailInput?** - Поле ввода эл. адреса. 
5. **phoneInput?** - Поле ввода номера телефона.
6. **nextButton?** - Кнопка "Далее".
7. **payButton?** - Кнопка "Оплатить". Для данной кнопки в html-разметку был добавлен класс **pay__button**.

Конструктор:
```
constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container);
		this.setCashPaymentButton = container.cash;
		this.setOnlinePaymentButton = container.card;
		this.deliveryAdressInput = container.address;
		this.emailInput = container.email;
		this.phoneInput = container.phone;
		this.nextButton = container.querySelector('.order__button'); // Кнопка "Далее"
		this.payButton = container.querySelector('.pay__button'); // Кнопка "Оплатить"

		if (this.setCashPaymentButton) {
			this.setCashPaymentButton.addEventListener('click', () => {
				events.emit('order:setCash');
			});
		}

		if (this.setOnlinePaymentButton) {
			this.setOnlinePaymentButton.addEventListener('click', () => {
				events.emit('order:setCard');
			});
		}

		if (this.deliveryAdressInput) {
			this.deliveryAdressInput.addEventListener('input', () => {
				events.emit('order:setDeliveryAdress', {
					deliveryAdress: this?.deliveryAdressInput?.value,
				});
			});
		}

		if (this.emailInput) {
			this.emailInput.addEventListener('input', () => {
				events.emit('order:setEmail', {
					email: this?.emailInput?.value,
				});
			});
		}

		if (this.phoneInput) {
			this.phoneInput.addEventListener('input', () => {
				events.emit('order:setPhone', {
					phone: this?.phoneInput?.value,
				});
			});
		}

		if (this.nextButton) {
			this.nextButton.addEventListener('click', (event: Event) => {
				event.preventDefault();
				events.emit('order:toContacts');
			});
		}

		if (this.payButton) {
			this.payButton.addEventListener('click', (event: Event) => {
				event.preventDefault();
				events.emit('order:toSuccess');
			});
		}
}
```

Класс имеет методы:
1. **render(data)** - Отрисовывает компонент с переданными значениями.
2. **resetForm(order)** - Сбрасывает форму.
3. **setPaymentType(order)** - Метод, управляет отображением выбора кнопок оплаты.
4. **setErrorMessage(value)** - Устанвливает текст с ошибкой.


### Класс Poster extends Component

Класс отрисовывает финальную заставку при успешном оформлении и оплаты заказа. 
Представляет собой модальное окно с итоговой суммой.

Имеет поля:
1. **description** - Информация "Списано N синапсов" - где N - итоговая сумма.
2. **closeButton** - Кнопка "За новыми покупками". При клике закрывает модальное окно.
3. **total** - Сеттер, отображает надпись в элементе **description** со значением **value**.

Конструктор:
```
  constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.description = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
			  events.emit('modal:close');
		  }); 
    }
```

Имеет метод:
1. **render()** - Отрисовывает компонент.

### Слой представления

Данный слой реализуется в файле **"./src/index.ts"**. Здесь создаются экземпляры классов и здесь будут контролироваться события.

### Рабочий поток

Рабочий поток представляется тремя точками архитектуры, это **Model**, **View** и **Presenter**. Данные, полученные с сервера, либо описанные вручную (для тестов), будут храниться в экземпляре класса **Catalog**. Далее происходит отрисовка главной страницы с использованием экземпляра **Gallery**.
Отрисовкой модальных окон занимается экземпляр класса **Modal**. При инициализации создаётся экзепляр класса **OrderBuilder**, который в свою очередь создаёт на выходе объект экземпляра класса **Order**.

После инициализации основных объектов, взаимодействие между ними будет происходить через события. Все интерактивные элементы (кнопки, поля ввода)
будут прослушиватся слушателями событий браузера (**.addEventListener**) и генерировать пользовательские события с использованием класса **EventEmitter**. Данный класс позволяет слушать, снимать и генерировать события пользовательского типа. Эти события будут обрабатыватся в файле **index.ts**, который и является презентёром в архитетектуре.

### Пример

```
Пользователь кликает по кнопке "Купить" в модальном окне с товаром.
Кнопка.addEventListener('click', () => здесь генерирует событие emit('card:add'))

В файле index.ts эти события прослушиваются через EventEmitter.on('card:add', callback).
Далее это событие вызывает изменение в модели данных builder. В модель данных добавляется товар через метод изменения данных builder.addProduct(product).
После того, как товар был добавлен, в методе builder.addProduct(product), мы вызываем событие, которое говорит что произошло изменение в модели данных.
Это событие так же прослушивается нашим презентёром index.ts - events.on('card:added', callback), где он уже обновляет отрисовку, согласно новым данным.
```

