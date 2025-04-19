import React, {use, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Recorder from './Recorder';
import {ActivityIndicator} from 'react-native';
import {parseQuantityString} from '../utils/helper';
import {createPerson} from '../services/api';
import {useAuth} from '../contexts/AuthProvider';
import {NavigationProps} from '../types/navigation';
import Toast from 'react-native-toast-message';
import DatePickerModal from './DatePickerModel';
import CalendarModal from './DatePickerModel';
import {useTheme} from '../contexts/theme/ThemeContext';
import {t} from 'i18next';
import {addEntryCall} from '../services/firebaseApi';

type Person = {
  id: string;
  created_at: Date;
  modified_at: Date;
  name: string;
  quantity: string;
  unit: 'kg';
  item: string;
};

type Props = NavigationProps<'AddEntry'>;

export default function AddEntryScreen({navigation}: Props) {
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
  const theme = useTheme();
  const styles = getStyles(theme); // Pass theme to generate styles

  const handleChange = (text: string) => {
    const formatted = text.replace(/\s+/g, '+');
    const numbers = parseQuantityString(formatted);
    const total = numbers.reduce((sum, val) => sum + val, 0);
    setErrors({...errors, quantity: ''});
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
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      name: personObj.name.trim(),
      selected_date: personObj.created_at.toISOString(),
      modified_date: personObj.created_at.toISOString(),
      quantity_entries: parseQuantityString(personObj.quantity),
      item: personObj.item.trim(),
      unit: personObj.unit,
    };

    setLoading(true);
    try {
      const response: any = await addEntryCall(payload);
      // const response = await createPerson(token, payload);
      if (response.success) {
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
        navigation.replace('Home');
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
      {/* {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={theme.colors.background} />
        </View>
      )} */}
      {/* <Text style={styles.header}>Add New Entry</Text> */}

      {/* Date Picker */}
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar" size={20} color={theme.colors.primary} />
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
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || personObj.created_at;
            setShowDatePicker(false);
            setPersonObj({...personObj, created_at: currentDate});
          }}
        />
      )}

      {/* Name Field */}
      <View style={styles.inputRow}>
        <Ionicons name="person" size={20} color={theme.colors.primary} />
        <TextInput
          style={[styles.inputText]}
          placeholder="Enter name"
          value={personObj.name}
          onChangeText={text => {
            setErrors({...errors, name: ''});
            setPersonObj({...personObj, name: text});
          }}
        />
      </View>
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      {/* Quantity Input */}
      <View style={styles.inputRow}>
        <Ionicons name="cube" size={20} color={theme.colors.primary} />
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

      <Recorder setPersonObj={setPersonObj} />

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color={theme.colors.background} />
        ) : (
          <Text style={styles.submitText}>Submit Entry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
const getStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    loaderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.backgroundGradient,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },

    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 10,
      height: 50,
      borderRadius: 10,
      marginBottom: 15,
      elevation: 1,
    },
    inputText: {
      marginLeft: 10,
      fontSize: 16,
      flex: 1,
      color: theme.colors.primary,
      paddingVertical: 0,
      textAlignVertical: 'center',
      fontFamily: theme.fonts.medium,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginBottom: 10,
      marginLeft: 5,
      fontFamily: theme.fonts.medium,
    },
    totalText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'right',
      color: theme.colors.primary,
      marginBottom: 20,
      fontFamily: theme.fonts.bold,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      borderRadius: 12,
    },
    submitText: {
      color: theme.colors.background,
      textAlign: 'center',
      // fontWeight: '600',
      fontSize: 16,
      fontFamily: theme.fonts.bold,
    },
  });
