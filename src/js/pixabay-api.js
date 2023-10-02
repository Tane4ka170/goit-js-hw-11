import axios from 'axios';

const API_KEY = '39757407-13e7f5de39700ed4a356d5fcb';
const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages(query, page, perPage) {
  const params = new URLSearchParams({
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
    query: query,
  });

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${params}`);
  return response.data;
}

export { fetchImages };