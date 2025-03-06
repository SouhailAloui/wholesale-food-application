import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ProductsScreen() {
  const { userId } = useLocalSearchParams(); // Get wholesaler ID from route params
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategories(); // Fetch categories first
    fetchProductsByCategory();
    fetchAllProducts(); // Fetch all products by default
  }, [userId]);

  // Fetch all products by default
  const fetchAllProducts = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await fetch(`http://10.0.2.2:8000/api/getProduct/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch products based on category and userId
  const fetchProductsByCategory = async (categoryId) => {
    try {
      setLoading(true); // Set loading to true before fetching
      setProducts([]); // Clear previous products when fetching new ones
      const response = await fetch(`http://10.0.2.2:8000/api/getProductByCategoryAndUser/${userId}/${categoryId}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/api/categories`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wholesaler Products</Text>

      {/* Categories Section */}
      <Text style={styles.sectionTitle}>Categories</Text>
      {loadingCategories ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={fetchAllProducts} // Fetch all products when "All" is clicked
          >
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryCard}
              onPress={() => fetchProductsByCategory(category._id)} // Fetch products by category
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Products Section */}
      <Text style={styles.sectionTitle}>Products</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : products.length === 0 ? (
        <Text style={styles.noProducts}>No products available.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImage} />
              ) : (
                <Text>No Image Available</Text>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category?.name || "No category"}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  noProducts: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 14,
    color: '#bbb',
  },
  productPrice: {
    fontSize: 16,
    color: '#00ff99',
    fontWeight: 'bold',
  },
});
