import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';


const DialogAlertMsg = ({ 
  message, onClose,
  title = null, icon = null,
  closeText = 'Close',
  isVisible = false,
}) => (
  <View>
    <Portal>
      <Dialog visible={isVisible} onDismiss={onClose}>
        <View style={styles.content}>
          {!!title ? (
            <Dialog.Title>
              {title}
            </Dialog.Title>
          ) : !!icon ? (
            <Dialog.Icon icon="alert" />
          ) : null}
          <Dialog.Content>
            <Text variant="bodyMedium">
              {message}
            </Text>
          </Dialog.Content>
        </View>
        <Dialog.Actions>
          <Button onPress={onClose}>
            {closeText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </View>
);


const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(DialogAlertMsg);
