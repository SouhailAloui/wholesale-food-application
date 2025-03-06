import { StyleSheet, Image, View,Text } from 'react-native';



export default function HomeScreen() {
  return (
      <View style={styles.overlay}>
         <Text style={styles.text}>home screen page!</Text>
         
       </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  }

});

