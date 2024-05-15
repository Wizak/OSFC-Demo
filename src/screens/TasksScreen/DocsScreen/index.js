import React, { memo, useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from "react-native-pdf";
import ImageView from "react-native-image-viewing";

import Background from '../../../components/Background';
import Divider from '../../../components/Divider';
import LoaderMask from '../../../components/LoaderMask';
import DialogAlertMsg from '../../../components/dialogs/DialogAlertMsg';
import DocItem from './DocListItem';
import CommonModal from '../../../components/dialogs/CommonModal';

import { httpClient } from '../../../core/httpClient';
import { useAuth } from '../../../contexts/auth';
import { useStore } from '../../../contexts/store';
import { useResponsibleViewStyle } from '../../../hooks/useResponsibleViewStyle';
import { ImagePreviewExts, DocPreviewExts } from '../../../core/consts';


const DocsScreen = () => {
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ selectedFilePreview, setSelectedFilePreview ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const { dynamicStyles, onViewLayout } = useResponsibleViewStyle({ 
    minHeight: 400, aroundSpaceHeight: 220 });
  const { getState } = useAuth();
  const { getState: getStoreState } = useStore();

  const { permissions } = getState();
  const { apiUrl, currentTaskId } = getStoreState();
  const isImageVisible = !!selectedFilePreview && 
    ImagePreviewExts.includes(selectedFilePreview.src.split('.').pop());
  const isPdfVisible = !!selectedFilePreview && 
    DocPreviewExts.includes(selectedFilePreview.src.split('.').pop());

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

  const onDocPreview = (docData) => {
    setSelectedFilePreview(docData);
    setIsLoading(true);
  };

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
                    <DocItem 
                      docData={docData} 
                      setError={setError} 
                      onPreview={onDocPreview}
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

          <DialogAlertMsg 
            title={error?.title} 
            message={error?.message} 
            isVisible={!!error}
            onClose={() => setError(null)}
          />
          <ImageView
            images={[selectedFilePreview]}
            imageIndex={0}
            visible={isImageVisible}
            onRequestClose={() => {
              setSelectedFilePreview(null); 
              setIsLoading(false);
            }}
          />
          <CommonModal 
            isVisible={isPdfVisible}
            onClose={() => setSelectedFilePreview(null)}
          >
            {!!selectedFilePreview ?
              <Pdf 
                style={{ flex: 1 }}
                source={{ uri: selectedFilePreview.uri, cache: true }} 
                onError={(error) => setError(JSON.stringify(error))}
                onLoadComplete={() => setIsLoading(false)}
              />
            : null}
          </CommonModal>
          {isLoading ? <LoaderMask /> : null}
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
