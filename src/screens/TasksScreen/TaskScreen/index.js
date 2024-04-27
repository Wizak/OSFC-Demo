import React, { memo, useState }  from 'react';
import Swiper from 'react-native-swiper';

import Background from '../../../components/Background';
import LoaderMask from '../../../components/LoaderMask';

import { httpClient } from '../../../core/httpClient';
import { generateRandomNumber, makeQueryString } from '../../../core/utils';
import { USER_SETTINGS_KEY } from '../../../core/consts';
import { tryAsyncStorageValueByKey } from '../../../core/utils';
import { useAuth } from '../../../contexts/auth';

import { 
  MainSection, ETAETDSection, 
  SplitPlumbSection, StorageOtherSection,
} from './TaskSections';


const setTaskIdStorage = async (userId, taskId) => {
  const userSettingsStorageKey = `${USER_SETTINGS_KEY}-user:${userId}`;
  const userSettingsStorage = await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey 
  }) || {};
  const newUserSettings = { ...userSettingsStorage, taskId };
  await tryAsyncStorageValueByKey({ 
    key: userSettingsStorageKey, 
    value: newUserSettings,
    action: 'set', 
  });
};

const TaskScreen = () => {
  const { getState } = useAuth();
  const [ data, setData ] = useState([]);

  const { permissions } = getState();

  const requestData = {
    filter: {
      "eta_date|etd_date": ["all"], 
      "terminal_id": ["all"],
    },
    sort: ["id", "DESC"],
    range: [0, 24],
  };

  const queryString = makeQueryString(requestData);

  React.useEffect(() => {
    const fetchTask = async () => {
      const uri = `/orders?${queryString}`;
      const tasks = await httpClient(uri).then(res => res.json);
      const randomNumber = generateRandomNumber({ 
        min: requestData.range[0], 
        max: requestData.range[1],
      });
      const randomTask = tasks[randomNumber];
      setData(randomTask);
      setTaskIdStorage(permissions.id, randomTask.id);
    };
    permissions && fetchTask();
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
    </Background>
  );
};


export default memo(TaskScreen);
