import React, { memo, useEffect, useState, useCallback } from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Background from '../../../components/Background';
import Divider from '../../../components/Divider';
import LoaderMask from '../../../components/LoaderMask';
import DialogAlertMsg from '../../../components/dialogs/DialogAlertMsg';
import DocItem from './DocListItem';

import { httpClient } from '../../../core/httpClient';
import { useAuth } from '../../../contexts/auth';
import { useStore } from '../../../contexts/store';
import { useResponsibleViewStyle } from '../../../hooks/useResponsibleViewStyle';


const DocsScreen = () => {
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ refreshing, setRefreshing ] = React.useState(false);

  const { dynamicStyles, onViewLayout } = useResponsibleViewStyle({ 
    minHeight: 400, aroundSpaceHeight: 220 });
  const { getState } = useAuth();
  const { getState: getStoreState } = useStore();

  const { permissions } = getState();
  const { apiUrl, currentTaskId } = getStoreState();
  console.log("currentTaskId", currentTaskId);

  useEffect(() => {
    fetchTaskDocs();
  }, [ currentTaskId, fetchTaskDocs ]);

  const fetchTaskDocs = useCallback(async () => {
    const uri = `${apiUrl}/orders/${currentTaskId}/documents`;
    await httpClient(uri).then(res => {
      setData(res.json);
    }).catch(e => {
      setError({ 
        title: 'Documents fetch Error', 
        message: e.message,
      });
    });
  }, [ apiUrl, currentTaskId, httpClient ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTaskDocs();
    setRefreshing(false);
  }, [ currentTaskId, fetchTaskDocs ]);

  if (error) {
    return (
      <Background>
        <DialogAlertMsg 
          title={error?.title} 
          message={error?.message} 
          isVisible={!!error}
          onClose={() => setError(null)}
        />
      </Background>
    );
  }

  if (!permissions || refreshing || data === null || dynamicStyles == null) {
    return <LoaderMask />;
  }

  return (
    <Background>
      <SafeAreaView edges={[ 'bottom', 'left', 'right' ]} style={{ flex: 1 }}>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
