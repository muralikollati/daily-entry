// DeleteConfirmationModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../contexts/theme/ThemeContext';

type DeleteConfirmationModalProps = {
  visible: boolean;
  onClose: (val: any) => void;
  onConfirm: () => void;
};

const RecoderConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  const [loading, setLoading] = React.useState(false);

  const theme = useTheme();
  const styles = getStyles(theme);
  //   const onConfirm = async () => {
  //     onClose(true);
  //   };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <MaterialIcons name="mic" size={50} color={theme.colors.error} />
          <Text style={styles.message}>
            Are you sure you want to start the recording?
          </Text>
          <Text style={styles.infoMessage}>
            Please say the name followed by the quantity. For example: "Ramesh 20 kilograms"
          </Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#e63946"
              style={{marginTop: 20}}
            />
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => onClose(false)}>
                <Text style={styles.cancelText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
                <Text style={styles.deleteText}>Yes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RecoderConfirmationModal;

const getStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.backgroundGradient,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '80%',
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      elevation: 10,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.text.medium,
      margin: 10,
      fontFamily: theme.fonts.regular,
    },
    infoMessage: {
      fontSize: 12,
      textAlign: 'center',
      color: theme.colors.text.medium,
      marginBottom: 20,
      fontFamily: theme.fonts.lightItalic,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: theme.colors.gray,
      padding: 10,
      borderRadius: 8,
      marginRight: 8,
    },
    cancelText: {
      textAlign: 'center',
      color: theme.colors.background,
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
    deleteBtn: {
      flex: 1,
      backgroundColor: theme.colors.error,
      padding: 10,
      borderRadius: 8,
      marginLeft: 8,
    },
    deleteText: {
      textAlign: 'center',
      color: theme.colors.background,
      // fontWeight: '600',
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
  });
