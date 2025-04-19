// DeleteConfirmationModal.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { deletePerson } from "../services/api";
import { useAuth } from "../contexts/AuthProvider";
import Toast from "react-native-toast-message";
import { useTheme } from "../contexts/theme/ThemeContext";
import { t } from "i18next";
import { deleteEntryByIdCall } from "../services/firebaseApi";

type DeleteConfirmationModalProps = {
  visible: boolean;
  onClose: (val: any) => void;
  selectedItem: any;
};

const DeleteConfirmationModal = ({
  visible,
  onClose,
  selectedItem,
}: DeleteConfirmationModalProps) => {
  const [loading, setLoading] = React.useState(false);

  const { token } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  
  const onConfirm = async () => {
    setLoading(true);
    const response: any = await deleteEntryByIdCall(selectedItem?.id)//deletePerson(selectedItem?.id, token);
    if (response?.success) {
      Toast.show({
        type: "success", // or "error" | "info"
        text1: "Sucess",
        text2: response?.message,
      });
    }else{
      Toast.show({
        type: "error",
        text1: "Error",
        text2: response?.message,
      });
    }
    setLoading(false);
    onClose(true);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <MaterialIcons name="delete-forever" size={50} color={theme.colors.error} />
          <Text style={styles.title}>
          {loading ? `Deleting "${selectedItem?.name}"...` : `Delete "${selectedItem?.name}" ?`}
        </Text>

        <Text style={styles.message}>
          {loading
            ? "Please wait while we remove this person and their records."
            : "This will permanently delete all their records. This action cannot be undone."}
        </Text>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.error} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() =>onClose(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;

const getStyles = (theme: ReturnType<typeof useTheme>) =>  StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.backgroundGradient,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  title: {
    fontSize: 22,
    // fontWeight: "bold",
    color: theme.colors.primary,
    marginVertical: 10,
    fontFamily: theme.fonts.bold,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: theme.colors.gray,
    marginBottom: 20,
    fontFamily: theme.fonts.regular,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelText: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "600",
    fontFamily: theme.fonts.semiBold,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: theme.colors.error,
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteText: {
    textAlign: "center",
    color: theme.colors.background,
    fontWeight: "600",
    fontFamily: theme.fonts.semiBold,
  },
});
