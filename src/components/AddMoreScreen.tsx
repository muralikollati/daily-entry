import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {parseQuantityString} from '../utils/helper';
import {addMoreEntry} from '../services/api';
import {useAuth} from '../contexts/AuthProvider';
import Toast from 'react-native-toast-message';
import {Calendar} from 'react-native-calendars';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme/ThemeContext';
import { addEntry } from '../services/firebaseCalls';
import { addEntryCall } from '../services/firebaseApi';
// https://coolors.co/palettes/trending

interface AddMoreScreenProps {
  visible: boolean;
  onClose: (a: boolean, b: number) => void;
  selectedItem: any;
}

export default function AddMoreScreen({
  visible,
  onClose,
  selectedItem,
}: AddMoreScreenProps) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [temValue, setTempValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    quantity: '',
  });

  const {t} = useTranslation();
  const {token} = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);

  const returnStateToDefault = () => {
    setDate(new Date());
    setShowDatePicker(false);
    setQuantity('');
    setTempValue(0);
    setLoading(false);
    setErrors({
      quantity: '',
    });
  };

  const handleChange = (text: string) => {
    // Replace all spaces with plus signs
    const formatted = text.replace(/\s+/g, '+');
    const parts = text.split('+').map(val => parseInt(val, 10));
    const total = parts.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);
    setTempValue(total);
    setQuantity(formatted);
    setErrors(prev => ({...prev, quantity: ''}));
  };

  const validate = () => {
    const newErrors = {quantity: ''};
    let isValid = true;
    if (!quantity.trim()) {
      newErrors.quantity = 'Quantity is required.';
      isValid = false;
    } else if (parseQuantityString(quantity).length === 0) {
      newErrors.quantity = 'Enter valid quantities like 10+20.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    const payload = {
      name: selectedItem.name.trim(),
      selected_date: date?.toISOString(),
      modified_date: date?.toISOString(),
      quantity_entries: parseQuantityString(quantity),
      item: selectedItem.item.trim(),
      unit: selectedItem.unit,
      entry_id: selectedItem.id,
    };

    setLoading(true);
    try {
      const response: any = await addEntryCall(payload)//addMoreEntry(selectedItem?.id, token, payload);
      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response?.message,
        });
      }
      setQuantity('');
      setLoading(false);
      console.log('Response:', response);
      onClose(true, temValue);
      returnStateToDefault();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add more quantity.',
      });
      console.log('Submit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    returnStateToDefault();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => onClose(false, 0)}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('add_more_quantity')} to "{selectedItem?.name}"</Text>

          {/* Date Picker */}
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.inputText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            //   <Calendar
            //   onDayPress={(day) => console.log(day)}
            //   theme={{
            //     backgroundColor: '#ffffff',
            //     calendarBackground: '#fff8e1',
            //     textSectionTitleColor: '#b6c1cd',
            //     selectedDayBackgroundColor: '#6200EE',
            //     selectedDayTextColor: '#ffffff',
            //     todayTextColor: '#ff5722',
            //     dayTextColor: '#2d4150',
            //     textDisabledColor: '#d9e1e8',
            //     arrowColor: '#6200EE',
            //     monthTextColor: '#6200EE',
            //     indicatorColor: '#6200EE',
            //   }}
            // />
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setShowDatePicker(Platform.OS === 'ios');
                setDate(currentDate);
              }}
            />
          )}

          {/* Quantity Input */}
          <View style={styles.inputRow}>
            <Ionicons name="cube" size={20} color={theme.colors.primary} />
            <TextInput
              style={styles.inputText}
              placeholderTextColor={theme.colors.gray}
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={quantity}
              onChangeText={handleChange}
            />
          </View>
          {errors.quantity ? (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          ) : null}
          <Text style={styles.totalText}>Total: {temValue}</Text>
          {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => onClose(false, 0)}
                style={[styles.button, {backgroundColor: theme.colors.gray}]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAdd}
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
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
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 10,
      marginLeft: 5,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: theme.colors.backgroundGradient,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      backgroundColor: theme.colors.background,
      padding: 20,
      borderRadius: 20,
      elevation: 10,
      shadowColor: '#000',
    },
    modalTitle: {
      fontSize: 20,
      color: theme.colors.primary,
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: theme.fonts.bold,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 10,
      height: 50, // <-- Fixed height
      borderRadius: 10,
      marginBottom: 15,
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
    totalText: {
      fontSize: 15,
      color: theme.colors.primary,
      marginBottom: 20,
      textAlign: 'right',
      fontFamily: theme.fonts.bold,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 12,
      borderRadius: 10,
    },
    buttonText: {
      textAlign: 'center',
      color: theme.colors.background,
      fontFamily: theme.fonts.bold,
    },
  });
