import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ListActionItem } from '../../../components/lists/ListText';
import { downloadAndGetUriOfRemoteFile, viewFileByUri } from '../../../services/downloadFile';
import { saveFileByUri } from '../../../services/downloadFile';
import { PreviewOnlyExts } from '../../../core/consts';
import { useStore } from '../../../contexts/store';


const DocItem = ({ docData, setError }) => {
  const { getState } = useStore();
  const { apiUrl } = getState();

  const filename = docData.src;
  const fileExt = filename.split('.').pop();
  const isPreviewMode = PreviewOnlyExts.includes(fileExt);

  const handleError = (e) => {
    setError({ 
      title: 'Error during file preview', 
      message: e.message, 
    });
  };

  const onSave = async () => {
    const { uri, headers } = await downloadAndGetUriOfRemoteFile({ 
      apiEndpoint: apiUrl, filename, handleError });
    saveFileByUri({ 
      uri, filename, handleError,
      mimetype: headers["Content-Type"],
    });
  };

  const onPreview = async () => {
    const { uri, localPath } = await downloadAndGetUriOfRemoteFile({ 
      apiEndpoint: apiUrl, filename, handleError });
    viewFileByUri({ uri, localPath, filename });
  };

  return (
    <ListActionItem 
      title={docData.type} 
      description={docData.title}
      style={styles.listItem}
      onIconPress={isPreviewMode ? onPreview : onSave}
      icon={isPreviewMode ? 'eye' : 'download-box'}
    />
  );
};


const styles = StyleSheet.create({
  listItem: {
    borderRadius: 20,
    backgroundColor: '#F5FBFF',
    margin: 10,
  },
});


export default DocItem;
