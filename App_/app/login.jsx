import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert,Button, Pressable } from 'react-native';
import { Link,useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode"

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
   
      const data = { email, password };


      // Make the API request
      const response = await fetch('http://10.0.2.2:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const { token } = result;

        // Securely store the token
        await SecureStore.setItemAsync('userToken', token);
  
        Alert.alert('Success', 'Logged in successfully');
        console.log("JWT Token stored securely");
  
        // Extract userId from token and navigate
        const decodedToken = jwtDecode(token);
        const { userType, userId } = decodedToken;
        console.log("Decoded Token:", decodedToken);

        // Store the role for further use
        await SecureStore.setItemAsync('userRole', userType);

        // Navigate based on the user's role
        switch (userType) {
          case 'supermarket':
            router.replace(`/(clientSide)/${userId}`);
            break;
          case 'wholesaler':
            router.replace(`/(wholesalerSide)/${userId}`);
            break;
          case 'admin':
            router.replace(`/(tabs)/admin/dashboard`);
            break;
          default:
            Alert.alert('Error', 'Invalid user role. Contact support.');
        }
      } else {
        Alert.alert('Error', result.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Unable to login. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
            <Link href="/signUp" asChild>
        <Button title="Sign Up" />
            </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});