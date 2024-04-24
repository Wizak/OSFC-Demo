import React, { memo } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Icon } from 'react-native-paper';


const ImagePickerModal = ({
  isVisible,
  onClose,
  onImageLibraryPress,
  onCameraPress,
}) => (
  <Portal>
    <Modal visible={isVisible} onDismiss={onClose} style={styles.modal}>
      <SafeAreaView style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={onImageLibraryPress}>
          <Icon source="image" size={30} />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCameraPress}>
          <Icon source="camera-enhance" size={30} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  </Portal>
);

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  buttonIcon: {
    margin: 10,
  },
  buttons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: 100,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});


export default memo(ImagePickerModal);
