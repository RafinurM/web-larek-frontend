/**
 * Класс для отображения галереи
 */

import { IGallery } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";

export class Gallery extends Component<IGallery> {
    gallery: HTMLElement;
    constructor(container: HTMLElement) {
        super(container);
        this.gallery = ensureElement<HTMLElement>('.gallery', container)
    }
}