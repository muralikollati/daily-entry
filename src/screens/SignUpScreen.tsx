
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NavigationProps } from '../types/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = NavigationProps<'Login'>;

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;

    // Reset errors
    setEmailError('');
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Name is required');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Call your backend/Firebase logic
      navigation.replace('Home');
    } catch (error: any) {
      // You could show server error here too
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={username}
        onChangeText={text => {
          setUsername(text);
          if (usernameError) setUsernameError('');
        }}
        autoCapitalize="none"
      />
      {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={[styles.input, { marginTop: 16 }]}
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (emailError) setEmailError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={[styles.input, { flex: 1, borderWidth: 0 }]}
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#999" />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity
        style={styles.signupBtn}
        onPress={handleSignup}
        disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupText}>Sign Up</Text>}
      </TouchableOpacity>

      <View style={styles.loginLinkWrapper}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafe',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 4,
    fontSize: 13,
  },
  signupBtn: {
    backgroundColor: '#6200EE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingRight: 12,
    marginTop: 16,
  },
  loginLinkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
});

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {NavigationProps} from '../types/navigation';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// type Props = NavigationProps<'Login'>;

// export default function SignupScreen({navigation}: Props) {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSignup = async () => {
//     if (!email || !username || !password) {
//       return Alert.alert('Missing Fields', 'Please fill in all fields');
//     }

//     setLoading(true);
//     try {
//       // TODO: Call your backend or Firebase signup method here
//       Alert.alert('Success', 'Account created successfully');
//       navigation.replace('Home');
//     } catch (error: any) {
//       Alert.alert('Signup failed', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>

//       <TextInput
//         placeholder="Name"
//         placeholderTextColor="#999"
//         style={styles.input}
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//       />

//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="#999"
//         style={[styles.input, {marginTop: 16}]}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <View style={styles.passwordWrapper}>
//         <TextInput
//           placeholder="Password"
//           placeholderTextColor="#999"
//           style={[styles.input, {flex: 1, borderWidth: 0}]}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Ionicons
//             name={showPassword ? 'eye' : 'eye-off'}
//             size={24}
//             color="#999"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={styles.signupBtn}
//         onPress={handleSignup}
//         disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.signupText}>Sign Up</Text>
//         )}
//       </TouchableOpacity>

//       <View style={styles.loginLinkWrapper}>
//         <Text style={styles.loginText}>Already have an account? </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <Text style={styles.loginLink}>Login</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafe',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     marginBottom: 30,
//     color: '#222',
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     fontSize: 16,
//   },
//   signupBtn: {
//     backgroundColor: '#4a90e2',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   signupText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     paddingRight: 12,
//     marginTop: 16,
//     marginBottom: 16,
//   },
//   loginLinkWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   loginText: {
//     color: '#666',
//   },
//   loginLink: {
//     color: '#4a90e2',
//     fontWeight: 'bold',
//   },
// });
