import { ICatalog, IProduct } from "../../types";

/**
 * Класс предоставляет данные для отображения.
 */
export class Catalog {
    items: IProduct[];
    itemsCount: number;  
    constructor(data: ICatalog) {
        this.items = data.items;
        this.itemsCount = data.total;
    }  
}