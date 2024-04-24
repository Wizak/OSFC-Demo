import React, { memo } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';


const ConfirmDialog = ({ 
  message, 
  onConfirm, onDecline,
  confirmMessage = 'Confirm', 
  declineMessage = 'Decline', 
  title = null, icon = null,
  isVisible = false,
}) => (
  <View>
    <Portal>
      <Dialog visible={isVisible} onDismiss={onDecline}>
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
        <Button onPress={onConfirm}>
          {confirmMessage}
        </Button>
        <Button onPress={onDecline}>
          {declineMessage}
        </Button>
      </Dialog.Actions>
      </Dialog>
    </Portal>
  </View>
);


export default memo(ConfirmDialog);
