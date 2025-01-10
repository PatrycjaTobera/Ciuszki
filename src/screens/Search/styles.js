import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4d4c4c',
  },
  searchInput: {
    height: 40,
    borderColor: '#8f8e8e',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4d4c4c',
  },
  cardDescription: {
    fontSize: 14,
    color: '#8f8e8e',
    marginVertical: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fc20a4',
  },
});

export default styles;
