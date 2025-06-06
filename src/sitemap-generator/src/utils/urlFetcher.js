import axios from 'axios';

export async function fetchUrls(source) {
  try {
    const response = await axios.get(source);
    return response.data.urls; // Assuming the response contains a 'urls' array
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return [];
  }
}