import axios from 'axios';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';

export const fetchJobs = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};