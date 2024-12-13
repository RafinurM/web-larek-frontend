# Проектная работа "Веб-ларек"

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

Этот интерфейс реализует тип данных для конкретного товара. Категория, название, стоимость, адресс изображения, описание, уникальный идентификатор, находится ли товар в корзине и последнее - продаётся ли товар.

```
 interface IProduct {
  category: string;
  title: string;
  price: number | string;
  image: string;
  description: string;
  id: string;
  isCheked?: boolean;
  isSale?: boolean;
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

Следующие данные - это данные о заказе, которые вводит пользователь, а приложение собирает в объект и отправляет на сервер.
Включает в себя: уникальный идентификатор заказа, тип оплаты, адрес доставки, электронный адрес, моб. номер для связи, дату создания заказа, сумма заказа и статус заказа (активен/неактивен).

```
interface IOrder {
  id: number | string;
  paymentType: string;
  deliveryAdress: string;
  email: string;
  phone: number;
  createdDate: Date;
  totalPrice: number;
  isActive: boolean;
}
```

### Корзина

Данный интерфейс описывает тип данных, которые создаёт класс **Basket**.
В корзине мы храним массив объектов (товаров), которые добавил пользователь, итоговую сумму всех товаров, количество товаров.

```
interface IBasket {
  items: IProduct[];
  totalPrice: number;
  itemsCount: number;
}
```

### Данные с сервера

Интерфейс **ICatalog** описывает какой тип данных мы должны получить на входе для приложения. Это те данные, по которым мы отрисовываем главную страницу и каталог товаров. Каталог представляет собой единственный источник информации о товарах в приложении.
Интерфейс включает в себя: список товаров типа **IProduct** и количество товаров.
```
interface ICatalog {
  items: IProduct[];
  itemsCount: number; 
}
```


## Кирпичики приложения
В приложении используется MVP-архитектура.
Отдельно описан слой данных, слой отображения. В силу того, что приложение обещает быть компактным, связующий код между млоем данных и слоем отображения описан в файле **"./src/index.ts"**.
В проекте предоставлены утилиты описанныев файле **"./utils/utils.ts"**, константы описаны в файле **"./utils/constants.ts"**.

### Слой данных


### Класс **Basket**

Данный класс отвечает за работу данных с корзиной.
Имеет поля:

1. **items** - Массив товаров(объектов) которые пользователь добавил в корзину.
2. **itemsCount** - Количество товаров в корзине.
3. **totalPrice** - Итотовая сумма товаров в корзине.
   
Класс **Basket** имеет следующие методы:
1. **addItem(item)** - Метод для добавления товара в корзину. Принимает объект товара в качестве аргумента.
2. **removeItem(id)** - Метод для удаления товара из корзины. Принимает **id** товара в качестве аргумента.
3. **calculateTotalPrice()** - Метод подсчитывает итоговую сумму товаров в корзине.
4. **createOrder(totalPrice)** - Вызывает **OrderBuilder**, который начинает формировать заказ. В аргументы передаём **totalPrice**.


### Класс Order
Этот класс создаёт объект заказа, в котором хранятся все данные о заказе. Объект заказа формируется поэтапно, поэтому здесь применяется паттерн **Builder***, который будет формировать заказ постепенно.

Имеет поля:

1. **id** - Уникальный идентификатор заказа.
2. **paymentType** - Тип оплаты. Не выбран | Онлайн | При получении.
3. **deliveryAdress** - Адресс доставки.
4. **email** - Электронный адресс получателя.
5. **phone** - Мобильный номер для связи.
6. **createdDate** - Дата создания заказа. 
7. **totalPrice** - Сумма заказа.
8. **isCollected** - Флаг, который проверяет все ли данные заполнены и готовы ли данные для отправки на сервер.
9. **isActive** - Статус заказа. Активен | Не активен.

*класс описан ниже.

### Класс OrderBuilder

Этот класс билдер* формирует заказ поэтапно. На выходе мы получаем объект с данными **Order**, которые ввёл пользователь.
*от англ. *builder - строитель*.

Имеет поле:
1. **order** - Заказ, типа Order.
2. **totalPrice** - Сумма заказа. Получаем в аргументах.
   
Конструктор следующий:

```
constructor(totalPrice) {
  this.order = new Order();
  this.order.totalPrice = totalPrice;
}
```

Имеет методы:
  
1. **setPayment()** - Устанавливает тип оплаты.
2. **setdeliveryAdress()** - Устанавливает адресс доставки.
3. **setEmail()** - Устанавливает email который введён в форме.
4. **setPhone()** - Устанавливает моб. номер из формы.
5. **createDate()** - Записывает время создания заказа.
6. **setStatus()** - Устанавливает статус заказа.
7. **setCollectStatus()** - Проверяет, что поля объекта заполнены и объект готов к отправке. Возвращает **true** если готов, **false** если данных не хватает.
8. **getOrder()** - Возвращает объект заказа типа **IOrder**, если **order.isCollected = true**.




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

### Класс Gallery extends Component

Класс отображает главную страницу приложения. 

Имеет поля:

1. **gallery** - Элемент разметки, где размещаем карточки с товарами.
2. **itemsCount** - Элемент разметки, где отображаем количество товаров в корзине.

Имеет метод:

1. **renderGallery(data)** - Отрисовывает карточки на главной странице. В качестве аргумента принимает данные, полученные с сервера.
2. **renderBasket()** - Перерисовывает значок количества товаров на корзине.


### Класс Modal extends Component

Этот класс занимается отображение модальных окон в приложении.

Имеет поле:
1. **modal**  - Содержимое модального окна.


В конструктор принимает модальное окно для отображения.
```
constructor(modalElement) {
  this.modal = modalElement;
}
```

Имеет методы:

1. **showModal(modal)** - Показывает модальное окно. В аргументы принимает модальное окно.
2. **closeModal()** - Закрывает модальное окно.



### Слой представления

Данный слой реализуется в файле **"./src/index.ts"**. Здесь создаются экземпляры классов и здесь будут контролироваться события.

### Рабочий поток

Рабочий поток представляется тремя точками архитектуры, это **Model**, **View** и **Presenter**. Данные, полученные с сервера, либо описанные вручную (для тестов), будут храниться в экземпляре **Catalog**. Далее происходит отрисовка главной страницы с использованием экземпляра **Gallery**.
Отрисовкой модальных окон занимается экземпляр класса **Modal**. В процессе жизни приложения, создаётся экзепляр класса **Basket**, наполнение которого формируется через экземпляр **OrderBuilder**, который в свою очередь создаёт на выходе объект экземпляра класса **Order**. И в финале данной цепочки созданный объект, если имеет флаг **isCollected** - **true**, отправляется на сервер.



