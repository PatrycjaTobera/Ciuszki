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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'flex-start', 
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#8f8e8e',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    width: '50%',
    marginTop: 20,
    backgroundColor: '#fc20a4', 
  }, 
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
});

export default styles;
