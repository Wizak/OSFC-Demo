import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../buttons/Button';
import TextInput from '../inputs/TextInput';
import FormInput from '../../controllers/FormInput';


const SimpleDialogForm = ({ 
  formSchema, onSubmit, onCancel, onDismiss,
  inputProps = {}, title = null, isVisible = false,
  submitText = 'Submit', cancelText = 'Cancel', 
}) => {
  const { control, handleSubmit } = useForm(
    formSchema ? 
      {resolver: zodResolver(formSchema)} 
    : 
      {}
  );

  return (
    <View>
      <Portal>
        <Dialog visible={isVisible} onDismiss={onDismiss}>
          <View>
            {!!title ? (
              <Dialog.Title>
                {title}
              </Dialog.Title>
            ) : null}
            <Dialog.Content>
              <FormInput
                {...inputProps}
                control={control}
                component={TextInput}
              />
            </Dialog.Content>
          </View>
          <Dialog.Actions>
            <Button 
              withStyles={false}
              mode="contained" 
              labelStyle={styles.submitButtonLabel}
              onPress={handleSubmit(onSubmit)}
            >
              {submitText}
            </Button>
            <Button onPress={onCancel}>
              {cancelText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};


const styles = StyleSheet.create({
  submitButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 20,
  },
});


export default memo(SimpleDialogForm);
