import React, { memo, useState, useEffect, useCallback }  from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import Background from '../../../components/Background';
import LoaderMask from '../../../components/LoaderMask';
import DialogAlertMsg from '../../../components/dialogs/DialogAlertMsg';

import { httpClient } from '../../../core/httpClient';
import { generateRandomNumber, makeQueryString } from '../../../core/utils';
import { USER_SETTINGS_KEY } from '../../../core/consts';
import { tryAsyncStorageValueByKey } from '../../../core/utils';
import { useAuth } from '../../../contexts/auth';

import { 
  MainSection, ETAETDSection, 
  SplitPlumbSection, StorageOtherSection,
} from './TaskSections';
import { useStore } from '../../../contexts/store';


const getUserSettingsStorageKey = (userId) => (
  `${USER_SETTINGS_KEY}-user:${userId}`
);

const getHardcodedTaskIdStorage = async (userId) => {
  const userSettingsStorageKey = getUserSettingsStorageKey(userId);
  const userSettingsStorage = await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey 
  }) || {};
  return userSettingsStorage?.hardcoded_task_id;
};

const TaskScreen = () => {
  const [ data, setData ] = useState(undefined);
  const [ error, setError ] = useState(null);
  const [ refreshing, setRefreshing ] = useState(false);

  const { getState } = useAuth();
  const { 
    getState: getStoreState, 
    changeStore, removeFromStore
  } = useStore();

  const { permissions } = getState();
  const { apiUrl, currentTaskId } = getStoreState();

  const requestData = {
    filter: {
      "eta_date|etd_date": ["all"], 
      "terminal_id": ["all"],
    },
    sort: ["id", "DESC"],
    range: [0, 24],
  };

  useEffect(() => {
    permissions && fetchConditionally();
  }, [ permissions, fetchConditionally ]);

  const fetchTask = useCallback(async (queryString) => {
    await httpClient(`${apiUrl}/orders?${queryString}`)
      .then(async (res) => {
        if (res.json[0]) {
          const randomNumber = generateRandomNumber({ 
            min: requestData.range[0], max: requestData.range[1]});
          const randomTask = res.json[randomNumber];
          setData(randomTask);
          changeStore({ currentTaskId: randomTask.id });
        } else {
          setData(null);
        };
      }).catch(e => {
        setError({
          title: 'Task fetching Error',
          message: e.message,
        });
      });
  }, [ 
    apiUrl, permissions?.id, requestData, changeStore,
    generateRandomNumber, httpClient,
  ]);

  const fetchHardcodedTask = useCallback(async (queryString) => {
    await httpClient(`${apiUrl}/orders?${queryString}`)
      .then(async (res) => {
        const hardcodedTask = res.json[0];
        if (hardcodedTask) {
          setData(hardcodedTask);
          changeStore({ currentTaskId: hardcodedTask.id });
        } else {
          setData(null);
        };
      }).catch(e => {
        setError({
          title: 'Hardcoded Task fetching Error',
          message: e.message,
        });
      });
  }, [ apiUrl, permissions?.id, changeStore, httpClient ]);

  const fetchConditionally = useCallback(async () => {
    const hardcodedTaskId = await getHardcodedTaskIdStorage(permissions.id);
    if (hardcodedTaskId !== undefined) {
      const queryString = makeQueryString({
        filter: {
          ...requestData.filter,
          id: hardcodedTaskId,
        }
      });
      await fetchHardcodedTask(queryString);
    } else {
      const queryString = makeQueryString(requestData);
      await fetchTask(queryString);
    };
  }, [ 
    requestData, 
    fetchHardcodedTask, fetchTask, 
    makeQueryString, getHardcodedTaskIdStorage, 
  ]);

  const onRefresh = useCallback(async () => {
    if (permissions) {
      setRefreshing(true);
      permissions && await fetchConditionally();
      setRefreshing(false);
    }
  }, [ permissions, fetchConditionally ]);

  if (error) {
    if (currentTaskId !== undefined && permissions) {
      removeFromStore([ 'currentTaskId' ]);
    }
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

  if (!permissions || data === undefined || refreshing) {
    return <LoaderMask />;
  }

  if (data === null) {
    if (currentTaskId !== undefined && permissions) {
      removeFromStore([ 'currentTaskId' ]);
    }
    return (
      <Background>
        <View style={styles.notFoundView}>
          <Text style={styles.notFoundText}>NOT FOUND</Text>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView style={styles.safeView} edges={[ 'bottom', 'right', 'left' ]}>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <Swiper loop={false}>
            <MainSection testID='MainSection' data={data} />
            <ETAETDSection testID='ETASection' prefix='eta' data={data} />
            <ETAETDSection testID='ETDSection' prefix='etd' data={data} />
            <SplitPlumbSection testID='SplitPlumbSection' data={data} />
            <StorageOtherSection testID='StorageOtherSection' data={data} />
          </Swiper>
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
  notFoundView: { 
    position: 'relative', 
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  safeView: {
    flex: 1,
  },
});


export default memo(TaskScreen);
