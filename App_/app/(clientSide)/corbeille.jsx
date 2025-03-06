import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Corbeille() {
  const { userId } = useLocalSearchParams(); // Get client ID (supermarket ID)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOrders();
  }, [userId]);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/api/allOrders/${userId}`); // Replace with actual API URL
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No pending orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>Order ID: {item._id}</Text>
              <Text style={styles.orderText}>Total Price: ${item.totalPrice}</Text>
              <Text style={styles.orderText}>Status: {item.status}</Text>

              <Text style={styles.productsTitle}>Products:</Text>
              {item.products.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <Text style={styles.productText}>- {product.product.name} (x{product.quantity})</Text>
                </View>
              ))}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noOrdersText: {
    fontSize: 18,
    color: '#bbb',
    marginTop: 20,
  },
  orderItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  orderText: {
    fontSize: 16,
    color: '#fff',
  },
  productsTitle: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 5,
  },
  productItem: {
    marginLeft: 10,
  },
  productText: {
    fontSize: 14,
    color: '#ccc',
  },
});
