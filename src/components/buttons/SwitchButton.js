import React, { memo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text } from 'react-native-paper';


const SwitchButton = ({ initValue, onValueChange, label, ...props }) => {
  const [ value, setValue ] = useState(initValue);

  const labelText = (
    (label && label(value)) || 
    (value ? 'ON' : 'OFF')
  ); 

  const onChange = (newValue) => {
    onValueChange(newValue);
    setValue(newValue);
  };

  return (
    <View style={styles.switchContainer}>
      <Switch
        style={styles.switch}
        onValueChange={onChange}
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
