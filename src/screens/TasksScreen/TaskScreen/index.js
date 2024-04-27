import React, { memo, useState }  from 'react';
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

const setTaskIdStorage = async (userId, taskId) => {
  const userSettingsStorageKey = getUserSettingsStorageKey(userId);
  const userSettingsStorage = await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey 
  }) || {};
  const newUserSettings = { ...userSettingsStorage, current_task_id: taskId };
  await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey, 
    value: newUserSettings,
    action: 'set', 
  });
};

const TaskScreen = () => {
  const [ data, setData ] = useState([]);
  const [ error, setError ] = useState(null);
  const { getState } = useAuth();

  const { permissions } = getState();
  const requestData = {
    filter: {
      "eta_date|etd_date": ["all"], 
      "terminal_id": ["all"],
    },
    sort: ["id", "DESC"],
    range: [0, 24],
  };

  React.useEffect(() => {
    const fetchTask = async (queryString) => {
      await httpClient(`/orders?${queryString}`)
        .then((res) => {
          const randomNumber = generateRandomNumber({ 
            min: requestData.range[0], max: requestData.range[1]});
          const randomTask = res.json[randomNumber];
          setData(randomTask);
          setTaskIdStorage(permissions.id, randomTask.id);
        }).catch(e => {
          setError({
            title: 'Task fetching Error',
            message: e.message,
          });
        });
    };

    const fetchHardcodedTask = async (queryString) => {
      await httpClient(`/orders?${queryString}`)
        .then((res) => {
          const hardcodedTask = res.json[0];
          setData(res.json[0]);
          setTaskIdStorage(permissions.id, hardcodedTask.id);
        }).catch(e => {
          setError({
            title: 'Hardcoded Task fetching Error',
            message: e.message,
          });
        });
    };

    const fetchConditionally = async () => {
      const hardcodedTaskId = await getHardcodedTaskIdStorage(permissions.id);
      if (hardcodedTaskId !== undefined) {
        const queryString = makeQueryString({
          filter: {
            ...requestData.filter,
            id: hardcodedTaskId,
          }
        });
        fetchHardcodedTask(queryString);
      } else {
        const queryString = makeQueryString(requestData);
        fetchTask(queryString);
      };
    };
    permissions && fetchConditionally();
  }, []);

  if (!permissions || data.length === 0) {
    return <LoaderMask />;
  }

  return (
    <Background>
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
    </Background>
  );
};


export default memo(TaskScreen);
