import React, { memo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';


const CommonModal = ({
  isVisible,
  onClose,
  children
}) => (
  <Portal>
    <Modal visible={isVisible} onDismiss={onClose} style={styles.modal}>
      <SafeAreaView style={styles.content}>
        {children}
      </SafeAreaView>
    </Modal>
  </Portal>
);

const styles = StyleSheet.create({
  modal: {
    padding: 10,
    margin: 20,
  },
  // buttonIcon: {
  //   margin: 10,
  // },
  content: {
    backgroundColor: 'white',
    height: '90%',
  },
  // button: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // buttonText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  // },
});


export default memo(CommonModal);
