import { searchImages } from './js/pixabay-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const perPage = 40;
let page = 1;
let currentQuery = '';

const lightbox = new SimpleLightbox('.gallery a');