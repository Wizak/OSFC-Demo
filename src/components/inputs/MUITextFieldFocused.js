import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const MUITextFieldFocused = ({ label, value }) => (
  <View style={styles.customTextField}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  customTextField: {
    width: '100%',
    marginVertical: 12, 
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F5FBFF',
  },
  label: {
    position: 'absolute',
    top: -13,
    left: 15,
    fontSize: 15,
    color: '#888',
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});


export default MUITextFieldFocused;
