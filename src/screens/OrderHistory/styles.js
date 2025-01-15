import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    top: 10,
    left: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 15,
    marginBottom: 35
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  size: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

export default styles;
