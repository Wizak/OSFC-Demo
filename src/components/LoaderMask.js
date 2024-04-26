import * as React from 'react';
import { View, StyleSheet} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


const LoaderMask = (props) => (
  <View style={styles.container}>
    <ActivityIndicator {...props} />
  </View>
);


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default LoaderMask;
