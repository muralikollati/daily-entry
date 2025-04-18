import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../contexts/AuthProvider';
import Toast from 'react-native-toast-message';
import { useTheme } from '../contexts/theme/ThemeContext';

const ProfileScreen = () => {
  const {logout} = useAuth();
  const user = auth().currentUser;
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again later.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={90} color={theme.colors.tertiary} />
        <Text style={styles.name}>{user?.displayName || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.options}>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="settings-outline" size={22} color="#333" />
          <Text style={styles.optionText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#333" />
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, styles.logoutButton]}
          onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.colors.background} />
          <Text style={[styles.optionText, {color: theme.colors.background}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const getStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f4f7',
      padding: 20,
    },
    profileCard: {
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 16,
      paddingVertical: 30,
      paddingHorizontal: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: {width: 0, height: 2},
      marginBottom: 30,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: 15,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: '#333',
    },
    email: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    options: {
      marginTop: 20,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 15,
      elevation: 2,
    },
    optionText: {
      fontSize: 16,
      marginLeft: 10,
      color: '#333',
      fontFamily: theme.fonts.bold,
    },
    logoutButton: {
      backgroundColor: theme.colors.primary,
    },
  });
