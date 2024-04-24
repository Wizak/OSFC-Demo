import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';


const ListAccordionText = ({ icon, children, ...rest }) => (
  <List.Accordion 
    {...rest}
    {...(icon ? {left: (props) => <List.Icon {...props} icon={icon} />} : {})}
    id={rest.title.toLowerCase()}
  >
    <View style={styles.accordionContent}>
      {children}
    </View>
  </List.Accordion>
);
  
const ListItemText = ({ description, icon, ...rest }) => (
  <List.Item 
    {...rest} 
    {...(icon ? {left: (props) => <List.Icon {...props} icon={icon} />} : {})}
    description={description === undefined ? description : description || '-'} 
  />
);

const ListActionItem = ({ description, icon, onIconPress, ...rest }) => (
  <List.Item 
    {...rest} 
    description={description === undefined ? description : description || '-'} 
    left={(props) => (
      <TouchableOpacity onPress={onIconPress}>
        <List.Icon {...props} icon={icon} />
      </TouchableOpacity>
    )}
  />
);

const styles = StyleSheet.create({
  accordionContent: {
    backgroundColor: '#F5FBFF',
  },
});


export { ListAccordionText, ListItemText, ListActionItem };
