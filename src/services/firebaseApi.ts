import {addEntry, deleteEntryById, getAllUserEntries, getEntryDetailsList} from './firebaseCalls';

export const addEntryCall = async (payload: any) => {
  try {
    const response = await addEntry(payload);
    return response;
  } catch (error) {
    console.error('Error creating person:', error);
    return error;
  }
};

export const getAllUserEntriesCall = async () => {
  try {
    const response = await getAllUserEntries();
    return response;
  } catch (error) {
    console.error('Error fetching persons:', error);
    return error;
  }
};

export const getEntryDetailsListCall = async (entry_id: string) => {
    try {
      const response = await getEntryDetailsList(entry_id);
      return response;
    } catch (error) {
      console.error('Error fetching persons:', error);
      return error;
    }
  };

  export const deleteEntryByIdCall = async (entry_id: string) => {
    try {
      const response = await deleteEntryById(entry_id);
      return response;
    } catch (error) {
      console.error('Error fetching persons:', error);
      return error;
    }
  };