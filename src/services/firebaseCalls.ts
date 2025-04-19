import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type QuantityEntry = number;

interface EntryInput {
  name: string;
  selected_date: string;
  quantity_entries: QuantityEntry[];
  item: string;
  unit: string;
  entry_id?: string;
}

const normalizeDate = (date: string) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // sets time to 00:00:00.000
  return d;
};
// export const addEntry = async ({
//   name,
//   selected_date,
//   quantity_entries,
//   item,
//   unit,
// }: EntryInput) => {
//   try {
//     const user = auth().currentUser;
//     if (!user) {
//       throw new Error('User not authenticated');
//     }

//     if (!name.trim()) {
//       throw new Error('Name is required');
//     }
//     if (!selected_date.trim()) {
//       throw new Error('Date is required');
//     }

//     if (!unit.trim()) {
//       throw new Error('Unit is required');
//     }
//     if (!Array.isArray(quantity_entries) || quantity_entries.length === 0) {
//       throw new Error('At least one quantity entry is required');
//     }

//     const totalQuantity = quantity_entries.reduce((sum, q) => sum + q, 0);

//     const entryRef = firestore().collection('entry').doc(user.uid).collection('entries').doc();

//     await entryRef.set({
//       user_id: user.uid,
//       name,
//       item,
//       unit,
//       quantity_entries,
//       selected_date,
//       total_quantity: totalQuantity,
//       created_at: firestore.FieldValue.serverTimestamp(),
//       modified_at: firestore.FieldValue.serverTimestamp(),
//     });
//     return {success: true, message: 'Entry added successfully!'};
//   } catch (error: any) {
//     console.error('Add Entry Error:', error.message);
//     return {
//       success: false,
//       message: error.message || 'Failed to add entry',
//     };
//   }
// };

// export const addEntry = async ({
//   name,
//   selected_date,
//   quantity_entries,
//   item,
//   unit,
// }: EntryInput) => {
//   try {
//     const user = auth().currentUser;
//     if (!user) {
//       throw new Error('User not authenticated');
//     }

//     // Validate required fields
//     if (!name.trim()) {
//       throw new Error('Name is required');
//     }

//     if (!selected_date.trim()) {
//       throw new Error('Date is required');
//     }

//     if (!unit.trim()) {
//       throw new Error('Unit is required');
//     }

//     if (!Array.isArray(quantity_entries) || quantity_entries.length === 0) {
//       throw new Error('At least one quantity entry is required');
//     }

//     const totalQuantity = quantity_entries.reduce((sum, q) => sum + q, 0);

//     const userEntryRef = firestore()
//       .collection('entry')
//       .doc(user.uid)
//       .collection('entries');

//     const entryDoc = await userEntryRef.add({
//       name,
//       item,
//       unit,
//       total_quantity: totalQuantity,
//       created_at: firestore.FieldValue.serverTimestamp(),
//       modified_at: firestore.FieldValue.serverTimestamp(),
//     });

//     await entryDoc.collection('details').add({
//       entry_id: entryDoc.id,
//       selected_date,
//       quantity_entries,
//       item,
//       unit,
//       total_quantity: totalQuantity,
//       created_date: selected_date,
//       modified_date: selected_date,
//     });

//     return {success: true, message: 'Entry added successfully!'};
//   } catch (error: any) {
//     console.error('Add Entry Error:', error.message);
//     return {
//       success: false,
//       message: error.message || 'Failed to add entry',
//     };
//   }
// };

export const addEntry = async ({
  name,
  selected_date,
  quantity_entries,
  item,
  unit,
  entry_id = '',
}: EntryInput) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!name.trim()) throw new Error('Name is required');
    if (!selected_date.trim()) throw new Error('Date is required');
    if (!unit.trim()) throw new Error('Unit is required');
    if (!Array.isArray(quantity_entries) || quantity_entries.length === 0)
      throw new Error('At least one quantity entry is required');

    const totalNew = quantity_entries.reduce((sum, q) => sum + q, 0);

    // Reference to user entry collection
    const personRef = firestore()
      .collection('entry')
      .doc(user.uid)
      .collection('entries')
      .doc(entry_id); // Assuming `name` is unique identifier for this person/entry

    const personDoc = await personRef.get();

    // Create the parent entry if it doesn't exist
    if (!personDoc.exists) {
      await personRef.set({
        name,
        item,
        unit,
        total_quantity: totalNew,
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString(),
      });
    } else {
      const oldTotal = personDoc.data()?.total_quantity || 0;
      await personRef.update({
        total_quantity: oldTotal + totalNew,
        modified_at: new Date().toISOString(),
      });
    }

    // Work with the 'details' subcollection
    const detailRef = personRef.collection('details');
    const normalizedDate = normalizeDate(selected_date);

    const dateSnap = await detailRef
      .where('compare_date', '==', normalizedDate)
      .limit(1)
      .get();

    if (!dateSnap.empty) {
      const existingDoc = dateSnap.docs[0];
      const oldEntries = existingDoc.data().quantity_entries || [];
      const updatedEntries = [...oldEntries, ...quantity_entries];

      await detailRef.doc(existingDoc.id).update({
        quantity_entries: updatedEntries,
        modified_date: new Date().toISOString(),
      });
    } else {
      await detailRef.add({
        compare_date: normalizedDate,
        created_date: new Date().toISOString(),
        modified_date: new Date().toISOString(),
        selected_date: selected_date,
        item,
        unit,
        quantity_entries,
      });
    }

    return {success: true, message: 'Entry updated successfully', total_quantity: personDoc.data()?.total_quantity || 0 + totalNew};
  } catch (error: any) {
    console.error('Add Entry Error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to update entry',
    };
  }
};

export const getAllUserEntries = async () => {
  try {
    const userId = auth().currentUser?.uid;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const snapshot = await firestore()
      .collection('entry')
      .doc(userId)
      .collection('entries')
      .orderBy('created_at', 'desc')
      .get();

    if (snapshot.empty) {
      return []; // No entries
    }

    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return entries;
  } catch (error: any) {
    console.error('Error fetching user entries:', error.message);
    return error; // So you can handle it in UI with a toast or alert
  }
};

export const getEntryDetailsList = async (entry_id: string) => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!entry_id.trim()) {
      throw new Error('entry_id is required to fetch details');
    }

    const detailsRef = firestore()
      .collection('entry')
      .doc(user.uid)
      .collection('entries')
      .doc(entry_id)
      .collection('details');

    const snapshot = await detailsRef.orderBy('selected_date', 'desc').get();

    const detailsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {data: detailsList};
  } catch (error: any) {
    console.error('Fetch Details Error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to fetch details',
    };
  }
};

export const deleteEntryById = async (entryId: string) => {
  try {
    const user = auth().currentUser;
    if (!user) throw new Error('User not authenticated');

    const entryRef = firestore()
      .collection('entry')
      .doc(user.uid)
      .collection('entries')
      .doc(entryId);

    // First, delete all documents in "details" subcollection
    const detailsRef = entryRef.collection('details');
    const detailsSnap = await detailsRef.get();

    const deletePromises = detailsSnap.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    // Then delete the entry document itself
    await entryRef.delete();

    return { success: true, message: 'Entry and its details deleted successfully' };
  } catch (error: any) {
    console.error('Delete Entry Error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to delete entry',
    };
  }
};

