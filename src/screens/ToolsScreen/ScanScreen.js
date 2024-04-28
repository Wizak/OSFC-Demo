import React, { memo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import Background from '../../components/Background';
import Button from '../../components/buttons/Button';
import TextInput from '../../components/inputs/TextInput';
import FormInput from '../../controllers/FormInput';
import Divider from '../../components/Divider';

import DialogAlertMsg from '../../components/dialogs/DialogAlertMsg';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import LoaderMask from '../../components/LoaderMask';

import { ListActionItem } from '../../components/lists/ListText';
import { BARCODES_STORAGE_KEY } from '../../core/consts';
import { tryAsyncStorageValueByKey } from '../../core/utils';
import { useAuth } from '../../contexts/auth';
import { useResponsibleViewStyle } from '../../hooks/useResponsibleViewStyle';


const makePersonalUserStorageKey = (permissions) => (
  `${BARCODES_STORAGE_KEY}-user:${permissions?.id}`
);

const formSchema = z.object({
  barcode: z.string()
    .min(1, "Required")
    .max(70, "Value must be no longer than 70 characters")
    .transform((val) => val.trim())
    .refine((val) => !!val.match(/^\d+$/)?.[0], {message: "Value must be a valid number"}),
});

const ScanScreen = () => {
  const [ barcodes, setBarcodes ] = useState(null);
  const [ selectedBarcode, setSelectedBarcode ] = useState(null);
  const [ error, setError ] = useState(null);

  const { getState } = useAuth();
  const { control, reset, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { 
    dynamicStyles, setDynamicStyles, 
    onViewLayout, setViewDemensions, 
  } = useResponsibleViewStyle({ minHeight: 400, aroundSpaceHeight: 400 });

  const { permissions } = getState();
  const barcodesStorageKey = makePersonalUserStorageKey(permissions);

  const restoreBarcodes = async () => (
    await tryAsyncStorageValueByKey({ key: barcodesStorageKey })
  );

  useEffect(() => {
    const _restoreBarcodes = async () => {
      const barcodesStorage = await tryAsyncStorageValueByKey({ 
        key: barcodesStorageKey 
      }) || [];
      setBarcodes(barcodesStorage);
    };
    permissions && _restoreBarcodes();
  }, [ barcodesStorageKey, tryAsyncStorageValueByKey ]);

  const handleBarcodePush = React.useCallback(async (barcode) => {
    const barcodesStorage = await restoreBarcodes() || [];
    const newBarcodes = [ barcode, ...barcodesStorage ];

    await tryAsyncStorageValueByKey({ 
      key: barcodesStorageKey, 
      value: newBarcodes,
      action: 'set', 
    });
    setBarcodes(newBarcodes);
    setViewDemensions(null);
    setDynamicStyles({ height: 1 });
  }, [ barcodesStorageKey, restoreBarcodes, tryAsyncStorageValueByKey ]);

  const onBarcodeDelete = useCallback(async () => {
    if (!!selectedBarcode) {
      const newBarcodesStorage = await restoreBarcodes() || [];

      if (selectedBarcode.index != null) {
        newBarcodesStorage.splice(selectedBarcode.index, 1);
        await tryAsyncStorageValueByKey({ 
          key: barcodesStorageKey, 
          value: newBarcodesStorage,
          action: 'set'
        });
        setBarcodes(newBarcodesStorage);
        setSelectedBarcode(null);
        setViewDemensions(null);
        setDynamicStyles({ height: 1 });
      }
    }
  }, [ barcodesStorageKey, selectedBarcode, restoreBarcodes, tryAsyncStorageValueByKey ]);

  const onPushBarcode = async ({ barcode }) => {
    try {
      await handleBarcodePush(barcode);
      reset({ barcode: '' })
    } catch (e) {
      setError({ 
        title: 'Error during barcode pushing', 
        message: e.message,
      });
    };
  };

  if (!permissions || barcodes == null || dynamicStyles == null) {
    return <LoaderMask />;
  }

  return (
    <Background>
      <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <FormInput
                control={control}
                component={TextInput}
                name="barcode"
                label="Barcode"
                returnKeyType="next"
                autoCapitalize="none"
                extraContainerStyle={styles.input}
              />
              <View style={styles.pushButton}>
                <Button 
                  mode="contained" 
                  onPress={handleSubmit(onPushBarcode)}
                >
                  <Text>PUSH</Text>
                </Button>
              </View>
            </View>

            <List.Section 
              title='Codes' 
              titleStyle={styles.codesTitle}
              style={[ styles.listViewContainer, dynamicStyles ]}
              onLayout={onViewLayout}
            >
              <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.listSection} nestedScrollEnabled={true}>
                  {barcodes.length !== 0 ? barcodes.map((value, index) => (
                    <React.Fragment key={`${value}-${index}`}>
                      <Divider />
                      <ListActionItem 
                        title={value} 
                        titleStyle={styles.itemTitle}
                        icon='delete' 
                        onIconPress={() => setSelectedBarcode({ value, index })} 
                        style={styles.listItem}
                      />
                    </React.Fragment>
                  )): (
                    <React.Fragment>
                      <Divider />
                      <Text style={styles.emptyText}>EMPTY</Text>
                    </React.Fragment>
                  )}
                </ScrollView>
              </SafeAreaView>
            </List.Section>
          </View>

          <DialogAlertMsg 
            title={error?.title} 
            message={error?.message} 
            isVisible={!!error}
            onClose={() => setError(null)}
          />
          <ConfirmDialog 
            title='Barcode actions'
            message={`Current barcode: ${selectedBarcode?.value}`}
            isVisible={!!selectedBarcode}
            confirmMessage='Delete'
            declineMessage='Cancel'
            onConfirm={onBarcodeDelete}
            onDecline={() => setSelectedBarcode(null)}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F7F3F9',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    width: '100%',
    elevation: 3,
  },
  container: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#F5FBFF',
    margin: 10,
  },
  listViewContainer: {
    backgroundColor: 'white',
    width: '100%',
    elevation: 1,
    flex: 1,
    paddingBottom: 20,
  },
  input: {
    width: '60%',
  },
  pushButton: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingTop: 10,
    width: '30%',
  },
  codesTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 17,
    color: '#828085',
  },
  emptyText: {
    textAlign: 'center',
    margin: 20,
    marginTop: 30,
    fontSize: 15,
  },
});


export default memo(ScanScreen);
