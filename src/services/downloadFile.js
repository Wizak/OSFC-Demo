import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import mime from 'mime-lite';

import { API_URL } from '../core/consts';


const viewFileByUri = ({ uri, filename, localPath }) => {
  if (Platform.OS == 'android') {
    FileSystem.getContentUriAsync(uri).then(cUri => {
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: mime.getType(filename),
      });
    });
  } else if (Platform.OS == 'ios') { 
    Sharing.shareAsync(localPath);
  };
};

const saveFileByUri = async ({ uri, filename, mimetype, handleError }) => {
  if (Platform.OS === "android") {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
        })
        .catch(e => handleError && handleError(e));
    } else {
      Sharing.shareAsync(uri);
    }
  } else {
    Sharing.shareAsync(uri);
  }
};

const downloadAndGetUriOfRemoteFile = async ({ 
  filename, handleError,
  apiEndpoint = API_URL, 
}) => {
  if (!filename) return;
  const remotePath = `${apiEndpoint}/${filename}`;
  const localPath = `${FileSystem.documentDirectory}${filename}`;
  const downloadResumable = FileSystem.createDownloadResumable(
    remotePath, localPath);

  try {
    const result = await downloadResumable.downloadAsync();
    return { ...result, localPath, remotePath, filename };
  } catch (e) {
    handleError && handleError(e);
  };
};


export { 
  viewFileByUri, saveFileByUri,
  downloadAndGetUriOfRemoteFile,
};
