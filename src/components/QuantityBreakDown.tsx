import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type QuantityBreakdownProps = {
  quantities: number[];
  selected_date: string;
};

const QuantityBreakdown: React.FC<QuantityBreakdownProps> = ({
  selected_date,
  quantities,
}) => {
  const total = quantities.reduce((sum, q) => sum + q, 0);

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={20} color="#6200EE" />
          <Text style={styles.totalText}>{selected_date}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="calculator-outline" size={20} color="#6200EE" />
          <Text style={styles.totalText}>Total: {total}</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.quantitiesRow}>
          {quantities.map((qty, index) => (
            <View key={index} style={styles.quantitiesRow}>
              <View key={index} style={styles.qtyChip}>
                <Text style={styles.qtyText}>{qty}</Text>
              </View>
              {index < quantities.length - 1 && (
                <Ionicons
                  name="add"
                  size={18}
                  color="#6200EE"
                  style={styles.plusIcon}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default QuantityBreakdown;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 1,
    gap: 15,
  },
  quantitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  qtyChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE7F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6200EE",
  },
  plusIcon: {
    margin: 2,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
    fontWeight: "bold",
  },
});
