import React, { useState } from 'react';
import { View, Text ,Button, TextInput, StyleSheet, Alert,Pressable } from 'react-native';
import { Link,useRouter } from 'expo-router';

 



export default function signUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();



  const handleSignUp = async () => {

    try {
      // Prepare the data
      const data = { name:name, email:email, password:password};

      // Make the API request
      const response = await fetch('http://10.0.2.2:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        
      });


      const result = await response.json();

      if (response.ok) {
        const userId = result.user.id; 
        Alert.alert('Success', result.message);
        router.push(`/(clientSide)/${userId}`);
        
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Unable to register. Please try again later.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        
      />
      
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
               <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Link href="/login" asChild>
  <Button title="Login" />
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

