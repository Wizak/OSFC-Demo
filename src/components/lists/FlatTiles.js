import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';


const Tiles = ({ children, data, ...props }) => (
  <FlatGrid
    data={data}
    itemDimension={150}
    style={styles.gridView}
    spacing={10}
    fixed
    {...props}
    renderItem={({ item }) => (
        <View style={[styles.itemContainer, item?.style]}>
          {React.cloneElement(children, { ...children.props, ...item })}
        </View>
    )}
  />
);

const styles = StyleSheet.create({
  gridView: {
    width: '100%',
    flex: 1,
  },
  itemContainer: {
    width: 150,
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});


export default memo(Tiles);
