/** 
* Цвета для категорий 
*/
export enum categoryColor {
  GREEN = '#83FA9D',
  YELLOW = '#FAD883',
  PURPLE = '#B783FA',
  CYAN = '#83DDFA',
  ORANGE = '#FAA083'
}


/** 
* Интерфейс товара
*/
export interface IProduct {
  category: string;
  title: string;
  price: number | string;
  image: string;
  description: string;
  id: string;
  isCheked?: boolean;
  isSale?: boolean;
}

/** 
 *Интерфейс корзины
 */
export interface IBasket {
  items: IProduct[];
  totalPrice: number;
  itemsCount: number;
}

/** 
 * Интерфейс объекта заказа
*/
export interface IOrder {
  id: number | string;
  paymentType: string;
  deliveryAdress: string;
  email: string;
  phone: number;
  createdDate: Date;
  totalPrice: number;
  isCollected: boolean;
  isActive: boolean;
}

/** 
 * Интерефейс модели данных
*/
export interface ICatalog {
  items: IProduct[];
  total: number; 
}

/**
 * Интерфейс галереи
 */
export interface IGallery {
  gallery: HTMLElement;
}