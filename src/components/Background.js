import React, { memo } from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from 'react-native';

const Background = ({ children, extraStyle = {} }) => (
  <ImageBackground
    source={require('../assets/background_dot.png')}
    resizeMode="repeat"
    style={styles.container}
  >
    <KeyboardAvoidingView style={[ styles.container, extraStyle ]} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default memo(Background);
