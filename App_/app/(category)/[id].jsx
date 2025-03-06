import { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function CategoryScreen() {
    const { id } = useLocalSearchParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation(); // Used to update the header title

    useEffect(() => {
        fetchCategory();
        fetchProducts();
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/api/categories/${id}`);
            const data = await response.json();
            setCategory(data);
            navigation.setOptions({ title: data.name }); // Set header title dynamically
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/api/allProducts/${id}`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        if (category) {
            navigation.setOptions({ title: category.name });
        }
    }, [category, navigation]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
            ) : (
                <>
                    <Text style={styles.title}>{category?.name}</Text>
                    <Text style={styles.description}>{category?.description || 'No description available'}</Text>

                    <FlatList
                        data={products}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.productItem}>
                                <Image source={{ uri: item.images[0] }} style={styles.productImage} />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>${item.price}</Text>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.noProducts}>No products available</Text>}
                    />
                </>
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
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#bbb',
        marginBottom: 20,
    },
    productItem: {
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#bbb',
    },
    noProducts: {
        color: '#bbb',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
