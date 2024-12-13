/**
 * @param id - Уникальный идентификатор
 * @param paymentType - Тип оплаты
 * @param deliveryAdress - Адрес доставки
 * @param email - Электронная почта
 * @param phone - Моб номер
 * @param createdDate - Дата создания заказа
 * @param totalPrice - Итоговая цена
 * @param isCollected - Сформирован ли заказ
 * @param isActive - Статус заказа
 */

import { IOrder } from "../../types";

export class Order implements IOrder {
  id: string | number;
  paymentType: string;
  deliveryAdress: string;
  email: string;
  phone: number;
  createdDate: Date;
  totalPrice: number;
  isCollected: boolean;
  isActive: boolean;
  constructor(){}
  
}