import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ClientScreen() {
  const { userId } = useLocalSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://10.0.2.2:8000/api/categories'); // Replace with your actual API URL
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.categoryItem} 
              onPress={() => router.push(`/(category)/${item._id}`)} // Navigate to category details
            >
              <Text style={styles.categoryText}>{item.name}</Text>
              <Text style={styles.categoryDescription}>{item.description || 'No description'}</Text>
              </TouchableOpacity>
          )}
        />
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  categoryText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#bbb',
  },
});
