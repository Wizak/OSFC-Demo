import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text } from 'react-native-paper';


const SwitchButton = ({ value, onValueChange, label, ...rest }) => {
  console.log("SWITCH value", value);
  const labelText = (
    (label && label(value)) || 
    (value ? 'ON' : 'OFF')
  ); 

  return (
    <View style={styles.switchContainer}>
      <Switch
        style={styles.switch}
        onValueChange={onValueChange}
        value={value}
      />
      <Text>{labelText}</Text>
    </View>
  );
};
  
const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 10,
  },
});


export default memo(SwitchButton);
