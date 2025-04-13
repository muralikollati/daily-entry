// import { auth } from "@/firebase/firebase";
import axios from 'axios';
import {tokenType} from '../types/navigation';

const BASE_URL = 'https://entry-services-re.vercel.app';

let cachedToken: string | null = null;

// const getToken = async () => {
//   if (cachedToken) return cachedToken;

//   const user = auth.currentUser;
//   if (user) {
//     cachedToken = await user.getIdToken();
//     return cachedToken;
//   }
//   return null;
// };

export const getAuthHeaders = async (token: tokenType) => {
  //   const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getPersons = async (token: tokenType) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await axios.get(`${BASE_URL}/persons`, {headers});
    return response.data;
  } catch (error) {
    console.error('Error fetching persons:', error);
  }
};

export const getPersonDetails = async (id: string, token: tokenType) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await axios.get(`${BASE_URL}/person/${id}/details`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
  }
};

export const createPerson = async (token: tokenType, payload: any) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await axios.post(`${BASE_URL}/create-person`, payload, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating person:', error);
  }
};

export const addMoreEntry = async (
  id: string,
  token: tokenType,
  payload: any,
) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await axios.post(
      `${BASE_URL}/person/${id}/add-entry`,
      payload,
      {
        headers,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error adding more entry:', error);
  }
};

export const deletePerson = async (id: string, token: tokenType) => {
  try {
    const headers = await getAuthHeaders(token);
    const response = await axios.delete(`${BASE_URL}/person-delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting person:', error);
  }
};

export const transcribeAudio = async (uri: string | null, token: tokenType) => {
  if (!uri) return;
  const formData = new FormData();
  formData.append('audio', {
    uri: `file://${uri}`,
    type: 'audio/wav',
    name: 'recorded_audio.wav',
  } as any);
  try {
    const response = await axios.post(`${BASE_URL}/transcribe`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  } catch (error: any) {
    console.log('Error transcribing audio:', error?.message);
    if (error?.response) {
      console.log('Response:', error?.response?.data);
    }
  }
  // try {
  //   const headers = await getAuthHeaders(token);
  //   const response = await axios.post(
  //     `${BASE_URL}/transcribe`,
  //     formData,
  //     {
  //       headers,
  //     }
  //   );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error transcribing audio:", error);
  // }
};
