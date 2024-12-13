import { IBasket, IProduct } from "../../types";

/**
 * Класс отвечает за корзину.
 * @param items - Массив товаров
 * @param itemsCount - Количество товаров
 * @param totalPrice - Итоговая цена
 */

export class Basket implements IBasket {
  items: IProduct[];
  totalPrice: number;
  itemsCount: number;

  constructor(){}
  
  additem(){}

  removeItem(){}

  calculateTotalPrice(){}

  createOrder() {}
}
