import AsyncStorage from '@react-native-async-storage/async-storage';


const tryAsyncStorageValueByKey = async ({ key, value, action = 'get' }) => {
    switch (action) {
        case 'get':
            return JSON.parse(await AsyncStorage.getItem(key));
        case 'set':
            return await AsyncStorage.setItem(key, JSON.stringify(value));
        case 'remove':
            return await AsyncStorage.removeItem(key);
    }
    return null;
};


export { tryAsyncStorageValueByKey };
