import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/theme/ThemeContext';

const NoDataScreen = ({ onCreatePress }: { onCreatePress: () => void }) => {
  const theme = useTheme()
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={styles.title}>No Records Found</Text>
      <Text style={styles.subtitle}>Looks like you haven't added anything yet.</Text>
      <TouchableOpacity style={styles.button} onPress={onCreatePress}>
        <Text style={styles.buttonText}>Create New Record</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: theme.fonts.semiBold,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: theme.fonts.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: theme.fonts.semiBold,
  },
});

export default NoDataScreen;
