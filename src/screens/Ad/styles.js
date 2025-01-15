import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
  image: {
    resizeMode: 'cover',
    width: screenWidth, 
    height: screenHeight * 0.65,
  },
  imageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  imageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  brand: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fc20a4',
    marginBottom: 5,
  },
  size: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  
  userContainer: {
    flexDirection: 'column',
    marginTop: 20,
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  seller: {
    fontSize: 16,
    marginBottom: 5
  },
  login: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  adsCount: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  button: {
    width: '42%',
    marginTop: 10,
    backgroundColor: '#fc20a4',
    alignSelf: 'center',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  
});

export default styles;