import * as React from 'react';
import { View, StyleSheet} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';


const LoaderMask = ({ children, ...props }) => (
  <View style={styles.container}>
    {children ? (
      children
    ) : (
      <ActivityIndicator animating size={50} {...props} />
    )}
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
