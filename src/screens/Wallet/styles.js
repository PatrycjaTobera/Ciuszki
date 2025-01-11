import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileTitle: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 25,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    width: '50%',
    backgroundColor: '#fc20a4',
    alignSelf: 'center', 
  }, 
  input: {
    width: '52%',
    borderWidth: 1,
    borderColor: '#8f8e8e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },

});

export default styles;
