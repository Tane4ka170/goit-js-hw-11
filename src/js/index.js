import { searchImages } from './pixabay-api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const perPage = 40;
let page = 1;
let currentQuery = '';

const lightbox = new SimpleLightbox('.gallery a');

function showNoResultsMessage() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function showEndOfResultsMessage() {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}
  
async function performSearch(query, isNewSearch = true) {
    if (isNewSearch) {
      page = 1;
      clearGallery();
    }
  
    try {
      const data = await searchImages(query, page, perPage);
  
      if (data.hits.length === 0) {
        if (isNewSearch) {
          showNoResultsMessage();
        } else {
          showEndOfResultsMessage();
        }
      } else {
        if (isNewSearch) {
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
  
        renderImages(data.hits);
  
        page += 1;
      }
    } catch (error) {
      console.error('Error:', error);
    }
}
  
function clearGallery() {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
}
  

function renderImages(images) {
    const gallery = document.querySelector('.gallery');
  
    images.forEach((image) => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('photo-card');
      galleryItem.innerHTML = `
        <a href="${image.largeImageURL}" class="gallery-item" data-lightbox="image">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      `;
      gallery.appendChild(galleryItem);
    });
}
  
const searchForm = document.querySelector('.search-form');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = e.target.searchQuery.value.trim();
  
    if (searchQuery !== '') {
      currentQuery = searchQuery;
      performSearch(currentQuery);
    }
});
  
const loadMoreBtn = document.querySelector('.load-more');
  loadMoreBtn.addEventListener('click', () => {
    performSearch(currentQuery, false);
});