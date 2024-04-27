import React, { memo, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Background from '../../../components/Background';
import Divider from '../../../components/Divider';
import LoaderMask from '../../../components/LoaderMask';
import DialogAlertMsg from '../../../components/dialogs/DialogAlertMsg';
import DocItem from './DocListItem';

import { httpClient } from '../../../core/httpClient';
import { USER_SETTINGS_KEY } from '../../../core/consts';
import { tryAsyncStorageValueByKey } from '../../../core/utils';
import { useAuth } from '../../../contexts/auth';


const getTaskIdStorage = async (userId) => {
  const userSettingsStorageKey = `${USER_SETTINGS_KEY}-user:${userId}`;
  const userSettingsStorage = await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey 
  }) || {};
  return userSettingsStorage?.taskId;
};

const DocsScreen = () => {
  const { getState } = useAuth();
  const [ data, setData ] = useState(null);
  const { permissions } = getState();
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchTaskDocs = async () => {
      const taskIdStorage = await getTaskIdStorage(permissions.id);
      const uri = `/orders/56229/documents`;
      const docs = await httpClient(uri).then(res => res.json);
      setData(docs);
    };
    permissions && fetchTaskDocs();
  }, []);

  if (!permissions || data == null) return <LoaderMask />;

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <List.Section 
            title='Documents List' 
            titleStyle={styles.docsTitle}
            style={styles.listViewContainer}
          >
            {data.length !== 0 ? data.map((docData, index) => (
              <React.Fragment key={`${docData.id}-${index}`}>
                <Divider />
                <DocItem docData={docData} setError={setError} />
              </React.Fragment>
            )): (
              <React.Fragment>
                <Divider />
                <Text style={styles.emptyText}>EMPTY</Text>
              </React.Fragment>
            )}
          </List.Section>

          <DialogAlertMsg 
            title={error?.title} 
            message={error?.message} 
            isVisible={!!error}
            onClose={() => setError(null)}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listViewContainer: {
    backgroundColor: 'white',
    width: '100%',
    elevation: 1,
    flex: 1,
  },
  docsTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    margin: 20,
    marginTop: 30,
    fontSize: 15,
  },
});


export default memo(DocsScreen);
