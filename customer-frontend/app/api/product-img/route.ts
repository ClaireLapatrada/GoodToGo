import React, { useEffect, useState } from 'react';

export const fetchData = async () => {
  const API_URL = 'http://192.168.68.70:5000/api/data'; // Replace with your actual URL

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data.message; // Assuming the backend returns an object with a 'message' property
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Optionally, return a default value or handle error gracefully
  }
};

export const sendReturnData = async (photos: string[], reason: string) => {
  const API_URL = 'http://192.168.68.70:5000/api/data'; // Replace with your actual URL

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photos,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send data');
    }

    const data = await response.json();
    return data.message; // Assuming the backend returns a message
  } catch (error) {
    console.error('Error sending data:', error);
    throw error;
  }
};
  