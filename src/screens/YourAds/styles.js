import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#ddd',
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
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4d4c4c',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#8f8e8e',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fc20a4',
    marginBottom: 5,
  },
  size: {
    fontSize: 14,
    color: '#4d4c4c',
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#8f8e8e',
    marginBottom: 10,
  },
  images: {
    flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#fc20a4',
  },
  deleteButton: {
    flex: 0.48,
    backgroundColor: '#d9534f',
  } , 
  soldText: {
    fontSize: 24,      
    color: '#fc20a4',            
    fontWeight: 'bold',
    textAlign: 'center',     
    marginVertical: 20,     
  }
});

export default styles;
