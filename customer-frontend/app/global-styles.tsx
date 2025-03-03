// globalStyles.js
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f1e9',
    position: 'relative',
    fontFamily: 'Shippori-Antique', // Apply the global font here
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Shippori-Antique',
    zIndex: 2,
  },
});

export default globalStyles;
