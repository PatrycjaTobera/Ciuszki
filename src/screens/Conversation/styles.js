import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop:25,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  messageItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fc20a4',
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  conversationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  conversationText: {
    fontSize: 18,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginRight: 10,
  },
});

export default styles;
