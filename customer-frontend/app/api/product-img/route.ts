// src/services/api.ts

export const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/data');
      const data = await response.json();
      return data.message; // Assuming the backend returns an object with a 'message' property
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  