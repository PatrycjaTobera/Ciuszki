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
  avatar: {
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    width: '50%',
    marginTop: 20,
    backgroundColor: '#fc20a4',
    alignSelf: 'center',
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
});

export default styles;
