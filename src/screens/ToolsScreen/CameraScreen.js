import React, { useState, useEffect, useCallback, memo } from 'react'
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from "expo-image-picker";

import Fab from '../../components/Fab';
import FlatTiles from '../../components/lists/FlatTiles';
import Background from '../../components/Background';
import ImagePickerModal from '../../components/dialogs/ImagePickerModal';
import DialogAlertMsg from '../../components/dialogs/DialogAlertMsg';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';

import { tryAsyncStorageValueByKey } from '../../core/utils';
import { GALLERY_STORAGE_KEY } from '../../core/consts';
import { useAuth } from '../../contexts/auth';

const makePersonalUserStorageKey = (permissions) => (
  `${GALLERY_STORAGE_KEY}-user:${permissions?.id}`
);

const ImageTile = ({ onPress, ...props }) => (
  <TouchableOpacity onPress={() => onPress(props)}>
    <Image source={props.source} style={styles.imageTile} />
  </TouchableOpacity>
);

const CameraScreen = () => {
  const { getState } = useAuth();
  const [ fileUris, setFileUris ] = useState([]);
  const [ isVisiblePickerModal, setIsVisiblePickerModal ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ selectedFileUri, setSelectedFileUri ] = useState(null);

  const { permissions } = getState();
  const galleryStorageKey = makePersonalUserStorageKey(permissions);

  const restoreFileUris = async () => (
    await tryAsyncStorageValueByKey({ key: galleryStorageKey })
  );

  useEffect(() => {
    const _restoreFileUris = async () => {
      const fileStorageUris = await tryAsyncStorageValueByKey({ 
        key: galleryStorageKey 
      }) || [];
      setFileUris(fileStorageUris);
    };
    permissions && _restoreFileUris();
  }, [ galleryStorageKey, tryAsyncStorageValueByKey ]);

  if (!permissions) return null;

  const handleImageUploading = useCallback(async (hardwareApiResp) => {
    if (!hardwareApiResp.canceled) {
      const { uri } = hardwareApiResp.assets[0];
      const fileStorageUris = await restoreFileUris() || [];
      const newFileUris = [ uri, ...fileStorageUris ];

      await tryAsyncStorageValueByKey({ 
        key: galleryStorageKey, 
        value: newFileUris,
        action: 'set', 
      });
      setFileUris(newFileUris);
    }
  }, [ galleryStorageKey, restoreFileUris, tryAsyncStorageValueByKey ]);

  const onFileDelete = useCallback(async () => {
    if (!!selectedFileUri) {
      const newFileStorageUris = await restoreFileUris() || [];
      const selecteFileUriIndex = newFileStorageUris.indexOf(selectedFileUri);

      if (selecteFileUriIndex != null) {
        newFileStorageUris.splice(selecteFileUriIndex, 1);
        await tryAsyncStorageValueByKey({ 
          key: galleryStorageKey, 
          value: newFileStorageUris,
          action: 'set'
        });
        setFileUris(newFileStorageUris);
        setSelectedFileUri(null);
      }
    }
  }, [ galleryStorageKey, selectedFileUri, restoreFileUris, tryAsyncStorageValueByKey ]);

  const onGalleryPress = useCallback(async () => {
    setIsVisiblePickerModal(false);
    try {
      const galleryResp = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      await handleImageUploading(galleryResp);
    } catch (e) {
      setError({ 
        title: 'Error during image uploading', 
        message: e.message,
      });
    };
  }, [ handleImageUploading ]);

  const onCameraPress = useCallback(async () => {
    setIsVisiblePickerModal(false);
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      await handleImageUploading(cameraResp);
    } catch (e) {
      setError({ 
        title: 'Error during image uploading', 
        message: e.message,
      });
    };
  }, [ handleImageUploading ]);

  const imagesTilesData = React.useMemo(() => (
    fileUris.map(fileUri => ({ source: { uri: fileUri } }))
  ));

  return (
    <Background>
      <FlatTiles data={imagesTilesData}>
        <ImageTile 
          onPress={({ source }) => {
            setSelectedFileUri(source.uri);
          }} 
        />
      </FlatTiles>

      <Fab icon='plus' onPress={() => setIsVisiblePickerModal(true)} />

      <ImagePickerModal 
        isVisible={isVisiblePickerModal}
        onClose={() => setIsVisiblePickerModal(false)}
        onCameraPress={onCameraPress}
        onImageLibraryPress={onGalleryPress}
      />

      <DialogAlertMsg 
        title={error?.title} 
        message={error?.message} 
        isVisible={!!error}
        onClose={() => setError(null)}
      />
      <ConfirmDialog 
        title='Image actions'
        message={`Current image filename: ${selectedFileUri?.split('/')?.pop()}`}
        isVisible={!!selectedFileUri}
        confirmMessage='Delete'
        declineMessage='Cancel'
        onConfirm={onFileDelete}
        onDecline={() => setSelectedFileUri(null)}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  imageTile: {
    width: 150,
    height: 150,
    backgroundColor: '#d3d3d3',
    borderRadius: 10, 
  },
});


export default memo(CameraScreen);
