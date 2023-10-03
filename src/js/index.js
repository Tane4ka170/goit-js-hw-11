import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './pixabay-api';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let currentQuery = '';
let currentPage = 1;
let simpleLightboxInstance;
const perPage = 40;

loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

function handleFetchError(error) {
  console.error(error);

  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
      timeout: 5000,
      width: '400px',
      fontSize: '24px',
    }
  );
}

async function handleSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (currentQuery === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  try {
    const response = await fetchImages(currentQuery, currentPage, perPage);

    if (response.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
      simpleLightboxInstance = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      }).refresh();
      Notiflix.Notify.success(
        `Hooray! We found ${response.totalHits} images.`
      );

      if (response.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    handleFetchError(error);
  } finally {
    searchForm.reset();
  }
}

function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        id,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
            <div class="gallery-item" id="${id}">
              <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item"><b>Likes</b>${likes}</p>
                <p class="info-item"><b>Views</b>${views}</p>
                <p class="info-item"><b>Comments</b>${comments}</p>
                <p class="info-item"><b>Downloads</b>${downloads}</p>
              </div>
            </div>
          </a>`;
      }
    )
    .join('');
}

async function handleLoadMore() {
  currentPage += 1;
  simpleLightboxInstance.destroy();
  // loadMoreBtn.disabled = true;

  try {
    const response = await fetchImages(currentQuery, currentPage, perPage);
    gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));
    simpleLightboxInstance = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    }).refresh();

    const totalDisplayedImages = gallery.querySelectorAll('.gallery__link').length;
    const totalPages = Math.ceil(response.totalHits / perPage);

    if (totalDisplayedImages < response.totalHits) {
      loadMoreBtn.disabled = false;
      scrollToNextGalleryPage();
    } else {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    handleFetchError(error);
  }
}

const scrollToNextGalleryPage = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
};