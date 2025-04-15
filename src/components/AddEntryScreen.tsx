import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Recorder from "./Recorder";
import {ActivityIndicator} from 'react-native';
import {parseQuantityString} from '../utils/helper';
import {createPerson} from '../services/api';
import {useAuth} from '../contexts/AuthProvider';

type Person = {
  id: string;
  created_at: Date;
  modified_at: Date;
  name: string;
  quantity: string;
  unit: 'kg';
  item: string;
};
import { NavigationProps } from '../types/navigation';
import Toast from 'react-native-toast-message';
import DatePickerModal from './DatePickerModel';
import CalendarModal from './DatePickerModel';

type Props = NavigationProps<"AddEntry">

export default function AddEntryScreen({ navigation }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [personObj, setPersonObj] = useState<Person>({
    id: '',
    created_at: new Date(),
    modified_at: new Date(),
    name: '',
    quantity: '',
    unit: 'kg',
    item: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    quantity: '',
  });

  const {token} = useAuth();

  const handleChange = (text: string) => {
    const formatted = text.replace(/\s+/g, '+');
    const numbers = parseQuantityString(formatted);
    const total = numbers.reduce((sum, val) => sum + val, 0);

    setPersonObj({...personObj, quantity: formatted});
    setQuantity(total);
  };

  const validate = () => {
    const newErrors = {name: '', quantity: '', item: ''};
    let isValid = true;

    if (!personObj.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }
    if (!personObj.quantity.trim()) {
      newErrors.quantity = 'Quantity is required.';
      isValid = false;
    } else if (parseQuantityString(personObj.quantity).length === 0) {
      newErrors.quantity = 'Enter valid quantities like 10+20.';
      isValid = false;
    }
    console.log('Errors:', newErrors, personObj);
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      name: personObj.name.trim(),
      selected_date: personObj.created_at,
      modified_date: personObj.created_at,
      quantity_entries: parseQuantityString(personObj.quantity),
      item: personObj.item.trim(),
      unit: personObj.unit,
    };

    setLoading(true);
    try {
      const response = await createPerson(token, payload);
      if (response.person_id !== null) {
        setPersonObj({
          id: '',
          created_at: new Date(),
          modified_at: new Date(),
          name: '',
          quantity: '',
          unit: 'kg',
          item: '',
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Entry added successfully!',
        });
        navigation.replace("Home");
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add entry. Please try again.',
      });
      console.log('Submit failed:', error);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {/* <Text style={styles.header}>Add New Entry</Text> */}

      {/* Date Picker */}
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={20} color="#6200EE" />
        <Text style={styles.inputText}>
          {personObj.created_at.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
    //    <CalendarModal
    //    visible={showDatePicker}
    //    onClose={() => setShowDatePicker(false)}
    //    selectedDate={"2012-03-01"}
    //    onSelectDate={(dateStr) => {
    //      const selected = new Date(dateStr);
    //      setPersonObj({ ...personObj, created_at: selected });
    //    }}
    //  />
      
        <DateTimePicker
          value={personObj.created_at}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || personObj.created_at;
            setShowDatePicker(false);
            setPersonObj({ ...personObj, created_at: currentDate });
          }}
        />
      )}

      {/* Name Field */}
      <View style={styles.inputRow}>
        <Ionicons name="person" size={20} color="#6200EE" />
        <TextInput
          style={[styles.inputText]}
          placeholder="Enter name"
          value={personObj.name}
          onChangeText={text => setPersonObj({...personObj, name: text})}
        />
      </View>
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      {/* Quantity Input */}
      <View style={styles.inputRow}>
        <Ionicons name="cube" size={20} color="#6200EE" />
        <TextInput
          style={[styles.inputText, {paddingVertical: 10}]}
          placeholder="Enter quantities (e.g. 10+20+30)"
          keyboardType="numeric"
          value={personObj.quantity}
          onChangeText={handleChange}
        />
      </View>
      {errors.quantity ? (
        <Text style={styles.errorText}>{errors.quantity}</Text>
      ) : null}

      <Text style={styles.totalText}>Total Quantity: {quantity}</Text>

      <Recorder setPersonObj={setPersonObj} setLoading={setLoading} />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F1F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  inputText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: '#333',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    color: '#6200EE',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
