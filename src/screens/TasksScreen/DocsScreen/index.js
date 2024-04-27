import React, { memo, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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
import { useResponsibleViewStyle } from '../../../hooks/useResponsibleViewStyle';


// const HARDCODE_TASK_ID = 56229;

const getTaskIdStorage = async (userId) => {
  const userSettingsStorageKey = `${USER_SETTINGS_KEY}-user:${userId}`;
  const userSettingsStorage = await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey 
  }) || {};

  return userSettingsStorage.current_task_id;
};

const DocsScreen = () => {
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState(null);

  const { dynamicStyles, onViewLayout } = useResponsibleViewStyle({ 
    minHeight: 400, aroundSpaceHeight: 220 });
  const { getState } = useAuth();

  const { permissions } = getState();

  useEffect(() => {
    const fetchTaskDocs = async () => {
      const taskIdStorage = await getTaskIdStorage(permissions.id);
      const uri = `/orders/${taskIdStorage}/documents`;

      await httpClient(uri).then(res => {
        setData(res.json);
      }).catch(e => {
        setError({ 
          title: 'Documents fetch Error', 
          message: e.message,
        });
      });
    };
    permissions && fetchTaskDocs();
  }, []);

  if (!permissions || data == null || dynamicStyles == null) {
    return <LoaderMask />;
  }

  return (
    <Background>
      <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
        <ScrollView>
          <List.Section 
            title='Documents' 
            titleStyle={styles.docsTitle}
            style={[ styles.listViewContainer, dynamicStyles ]}
            onLayout={onViewLayout}
          >
            <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
              <ScrollView nestedScrollEnabled={true}>
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
              </ScrollView>
            </SafeAreaView>
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
  listViewContainer: {
    backgroundColor: 'white',
    margin: '10%',
    marginBottom: 20,
    marginTop: 20,
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
