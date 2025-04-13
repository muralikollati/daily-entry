import React from "react";
import { ErrorToast, SuccessToast } from "react-native-toast-message";
import { StyleSheet } from "react-native";

export const toastConfig = {
  success: (props: any) => (
    <SuccessToast
      {...props}
      style={styles.success}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={styles.error}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  success: {
    borderLeftColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
  },
  error: {
    borderLeftColor: "#F44336",
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 14,
    color: "#555",
  },
});
