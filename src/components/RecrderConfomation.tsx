// DeleteConfirmationModal.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
          <MaterialIcons name="mic" size={50} color="#e63946" />
          <Text style={styles.message}>
            Are you sure you want to start the recording?
          </Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#e63946"
              style={{ marginTop: 20 }}
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
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    margin: 20,
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
    backgroundColor: "#e63946",
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
