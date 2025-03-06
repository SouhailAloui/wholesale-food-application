import { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, FlatList, Image, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function WholesalerScreen() {
  const { userId } = useLocalSearchParams(); // Get wholesaler ID
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);


  // Product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/categories'); // Replace with your API
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoryModalVisible(false);
    setProductModalVisible(true); // Open product form
  };

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Submit product data
  const handleAddProduct = async () => {
    if (!name || !price || !quantityAvailable || !selectedCategory || !image) {
      alert("Please provide all required fields.");
      return;
    }
  
    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantityAvailable", quantityAvailable);
    formData.append("image", {
      uri: image, 
      type: "image/jpeg", 
      name: "product.jpg",
    });
  
    try {
 
      const response = await fetch(`http://10.0.2.2:8000/api/addProduct/${userId}/${selectedCategory._id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Product added successfully!');
        setProductModalVisible(false);
        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setQuantityAvailable('');
        setImage(null);
      } else {
        alert(data.message || 'Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    } finally {
      setUploading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wholesaler Screen</Text>

      {/* Open Category Modal */}
      <TouchableOpacity style={styles.button} onPress={() => setCategoryModalVisible(true)}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal visible={categoryModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Category</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleSelectCategory(item)}
                  >
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product Form Modal */}
      <Modal visible={productModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Product</Text>

            <TextInput
              style={styles.input}
              placeholder="Product Name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#aaa"
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <TextInput
              style={styles.input}
              placeholder="Quantity Available"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={quantityAvailable}
              onChangeText={setQuantityAvailable}
            />

            {/* Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>Pick an Image</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleAddProduct} disabled={uploading}>
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add Product</Text>
              )}
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setProductModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, width: '100%' },
  imagePicker: { backgroundColor: '#ff9800', padding: 10, borderRadius: 8, marginBottom: 10 },
  imagePickerText: { color: '#fff', fontWeight: 'bold' },
  imagePreview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
});

