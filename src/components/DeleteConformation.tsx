// DeleteConfirmationModal.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { deletePerson } from "../services/api";
import { useAuth } from "../contexts/AuthProvider";
import Toast from "react-native-toast-message";

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
  
  const onConfirm = async () => {
    setLoading(true);
    const response = await deletePerson(selectedItem?.id, token);
    Toast.show({
      type: "success", // or "error" | "info"
      text1: "Product Added",
      text2: "Your product was added successfully 👌",
    });
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
          <MaterialIcons name="delete-forever" size={50} color="#D32F2F" />
          <Text style={styles.title}>
          {loading ? `Deleting "${selectedItem?.name}"...` : `Delete "${selectedItem?.name}"?`}
        </Text>

        <Text style={styles.message}>
          {loading
            ? "Please wait while we remove this person and their records."
            : "This will permanently delete all their records. This action cannot be undone."}
        </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 20 }} />
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1d3557",
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelText: {
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});
