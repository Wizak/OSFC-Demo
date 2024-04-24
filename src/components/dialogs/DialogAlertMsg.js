import React, { memo } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';


const DialogAlertMsg = ({ 
  message, onClose,
  title = null, icon = null,
  closeText = 'Close',
  visible = false,
}) => (
  <View>
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
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
      <Dialog.Actions>
        <Button onPress={onClose}>
          {closeText}
        </Button>
      </Dialog.Actions>
      </Dialog>
    </Portal>
  </View>
);


export default memo(DialogAlertMsg);
