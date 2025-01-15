import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingTop: 130,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 25,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  size: {
    fontSize: 14,
    color: 'gray',
  },
  brand: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  images: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
  },
  removeButton: {
    width: '50%',
    marginTop: 20,
    backgroundColor: '#fc20a4',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  summary: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 20,
    width: width - 30,
    alignSelf: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#fc20a4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 0, 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  }  
});

export default styles;
