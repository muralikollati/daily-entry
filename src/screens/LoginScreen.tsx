import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationProps} from '../types/navigation';
import {useAuth} from '../contexts/AuthProvider';
import Toast from 'react-native-toast-message';

type Props = NavigationProps<'Login'>;

export default function AuthScreen({navigation}: Props) {
  const [email, setEmail] = useState('test@example.com');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});

  const {login} = useAuth();

  const validateLogin = () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      // valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
      // valid = false;
    }
    // if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      navigation.replace('Home');
    } catch (error: any) {
      setLoading(false);
      console.log('Login error:', error?.code);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2:
          error?.code === 'auth/invalid-credential'
            ? 'Email or Password is incorrect'
            : error?.message,
      });
    }
  };

  const validateSignup = () => {
    const newErrors: typeof errors = {};
    if (!username) newErrors.username = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;

    setLoading(true);
    try {
      navigation.replace('Home');
    } catch (error: any) {
      setErrors({email: error.message || 'Signup failed'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {navigation.getState().routes[0].name === 'Login'
          ? 'Welcome Back'
          : 'Create Account'}
      </Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (errors.email) setErrors(prev => ({...prev, email: ''}));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {navigation.getState().routes[0].name !== 'Login' && (
        <>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#999"
            style={styles.input}
            value={username}
            onChangeText={text => {
              setUsername(text);
              if (errors.username) setErrors(prev => ({...prev, username: ''}));
            }}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </>
      )}

      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={[styles.input, {flex: 1, borderWidth: 0}]}
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) setErrors(prev => ({...prev, password: ''}));
          }}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={
          navigation.getState().routes[0].name === 'Login'
            ? handleLogin
            : handleSignup
        }
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>
            {navigation.getState().routes[0].name === 'Login'
              ? 'Login'
              : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Signup/Sign-In Switch */}
      <View style={styles.signupWrapper}>
        {navigation.getState().routes[0].name === 'Login' ? (
          <>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.signupText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Google Login (optional) */}
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity style={styles.googleBtn}>
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 40,
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingRight: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: '#03045e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signupWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#03045e',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  googleBtn: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  googleText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 13,
  },
});

// when you run into issues with react native, try the following commands:
// when u reinstall the node_modules, make sure to delete the following folders:

// rm -rf android/.gradle
// rm -rf android/app/.cxx
// rm -rf android/app/build
// rm -rf node_modules
// rm -rf android/build
// rm -rf android/app/build/generated
// rm -rf package-lock.json yarn.lock

// npm install

// npx react-native start --reset-cache

// cd android
// ./gradlew clean
// cd ..
// npx react-native run-android


// import React, {useState} from 'react';
// import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
// import {useAuth} from '../contexts/AuthProvider';
// import {NavigationProps} from '../types/navigation';

// // import React, { useEffect, useState } from 'react';
// import {
//   // View,
//   Text,
//   // TextInput,
//   TouchableOpacity,
//   // StyleSheet,
//   ActivityIndicator,
//   // Alert,
// } from 'react-native';
// // import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
// // import { AntDesign, Ionicons } from '@expo/vector-icons';
// // import AntDesign from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// type Props = NavigationProps<'Login'>;

// export default function LoginScreen({navigation}: Props) {
//   const [email, setEmail] = useState('test@example.com');
//   const [password, setPassword] = useState('password123');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   GoogleSignin.configure({
//   //     webClientId: 'YOUR_WEB_CLIENT_ID_FROM_FIREBASE',
//   //   });
//   // }, []);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       return Alert.alert('Missing Fields', 'Please enter email and password');
//     }

//     setLoading(true);
//     try {
//       // TODO: Call your backend login method
//       navigation.replace('Home');
//     } catch (error: any) {
//       Alert.alert('Login failed', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     // try {
//     //   await GoogleSignin.hasPlayServices();
//     //   const userInfo: User = await GoogleSignin.signIn();
//     //   // TODO: Send userInfo.idToken to your backend for Firebase auth
//     //   navigation.replace('Home');
//     // } catch (error: any) {
//     //   Alert.alert('Google Sign-In Error', error.message);
//     // }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome Back</Text>

//       <TextInput
//         placeholder="Email"
//         placeholderTextColor="#999"
//         style={styles.input}
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
//         style={styles.loginBtn}
//         onPress={handleLogin}
//         disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.loginText}>Login</Text>
//         )}
//       </TouchableOpacity>
//       <View style={styles.signupWrapper}>
//         <Text style={styles.signupText}>Don't have an account? </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//           <Text style={styles.signupLink}>Sign up</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.orText}>OR</Text>

//       <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
//         {/* <AntDesign name="google" size={20} color="#000" /> */}
//         <Text style={styles.googleText}>Sign in with Google</Text>
//       </TouchableOpacity>
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
//     fontSize: 30,
//     fontWeight: '700',
//     marginBottom: 40,
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
//   loginBtn: {
//     backgroundColor: '#4a90e2',
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   loginText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   signupWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   signupText: {
//     color: '#666',
//   },
//   signupLink: {
//     color: '#4a90e2',
//     fontWeight: 'bold',
//   },

//   orText: {
//     textAlign: 'center',
//     marginVertical: 16,
//     color: '#666',
//   },
//   googleBtn: {
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//     borderWidth: 1,
//     flexDirection: 'row',
//     padding: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 12,
//   },
//   googleText: {
//     marginLeft: 8,
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default function LoginScreen({ navigation }: Props) {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('test@example.com');
//   const [password, setPassword] = useState('password123');

//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//       navigation.replace('Home'); // 👈 navigate after login
//     } catch (error: any) {
//       Alert.alert('Login Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
//       <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   input: { height: 50, borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 8 },
// });
