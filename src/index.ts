import { Api } from './components/base/api';
import { Basket } from './components/model/Basket';
import { Catalog } from './components/model/Catalog';
import { Component } from './components/view/Component';
import { Gallery } from './components/view/Gallery';
import './scss/styles.scss';
import { ICatalog } from './types';
import { API_URL, TESTDATA } from './utils/constants';
import { cloneTemplate, createElement, setElementData } from './utils/utils';



// this is a test code
const api = new Api(API_URL);
const pageWrapper: HTMLElement = document.querySelector('.page__wrapper');
const category = document.querySelector('card__category');
const title = document.querySelector('.card__title');
const image = document.querySelector('.card__image');
const price = document.querySelector('.card__price');

const galleryFromClass = new Gallery(pageWrapper);
console.log(galleryFromClass.gallery)
let dom = galleryFromClass.setDisabled


api.get('/product/').then(data => data as ICatalog)
  .then(resp => {
    const model = new Catalog(resp);
    return model
  })
  .then(model => {
    model.items.forEach(itemData => {
      const card = cloneTemplate('#card-catalog');
      const category = card.querySelector('.card__category');
      const title = card.querySelector('.card__title');
      const image = card.querySelector('.card__image');
      const price = card.querySelector('.card__price');
      category.textContent = itemData.category;
   
      galleryFromClass.gallery.append(card)
    })
  });





