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

const generateRandomNumber = ({ min = 1, max = 10 }) => (
  Math.floor(
    Math.random() * 
    (max - min + 1)
  ) + min
);

const makeQueryString = (varMap) => {
  const entries = Object.entries(varMap);
  let queryStringPre = [];
  entries.forEach(([key, value]) => {
    const encodedValue = encodeURIComponent(JSON.stringify(value));
    queryStringPre.push(`${key}=${encodedValue}`);
  });
  return queryStringPre.join('&');
};


export { 
  tryAsyncStorageValueByKey, generateRandomNumber,
  makeQueryString,
};
