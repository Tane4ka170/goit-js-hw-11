import axios from 'axios';

const API_KEY = '39757407-13e7f5de39700ed4a356d5fcb';
const BASE_URL = 'https://pixabay.com/api/';

export async function searchImages(query, page, perPage) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });

    const { data } = response;
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}