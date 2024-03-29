import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoreKeys = {
    NEWS_KEY: "myNewsKey"
}

class StorageHelper {

    static saveData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error('StorageHelper Saving - ', e)
        }
    };

    static getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value
            }
        } catch (e) {
            console.error('StorageHelper Retrieving - ', e)
            return null
        }
    };

    static saveObject = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('StorageHelper Saving - ', e)
        }
    };

    static getObject = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('StorageHelper Retrieving - ', e)
            return null
        }
    };
}

export default StorageHelper