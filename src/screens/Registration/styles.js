import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 70,         
    fontWeight: 'bold',     
    textAlign: 'center',   
    marginBottom: 30,       
    color: '#4d4c4c',       
  },
  header: {
    fontSize: 30,           
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#8f8e8e',
  },
  input: {
    height: 40,
    borderColor: '#8f8e8e',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    height: 50,
    backgroundColor: '#fc20a4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#fc20a4',
  },
});

export default styles;
