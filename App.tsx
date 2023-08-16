/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'
import Colors from "./src/constants/Colors";
import NewsItemView from "./src/components/NewsItemView";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import StorageHelper, {StoreKeys} from "./src/utils/StorageHelper";

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const [isRefreshing, setIsRefreshing] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [isEndReached, setIsEndReached] = useState(false)
    const [timer, setTimer] = useState(0)
    const [newsData, setNewsData] = useState(null)
    let itemToLoad = 10;
    let itemRefs = [];
    let prevOpenedItem;


    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.primary,
        flex: 1
    };

    useEffect(() => {
        SplashScreen.hide();

        refreshData()
        //setTimeout()
        // const randomHeadlineInterval = setInterval(() => {
        //     //setTimer(timer)
        //     console.log('---Fetch Random 5---', new Date())
        // }, 10000);

        return () => {
            console.log(`clearing interval`);
            // clearInterval(randomHeadlineInterval);
        };
    }, []);


    const refreshData = () => {
        StorageHelper.getObject(StoreKeys.NEWS_KEY).then((value) => {
            if (value) {
                console.log('Data Found', value.length)
                setNewsData(value)
                setIsRefreshing(false)
            } else {
                console.log('No Data Found')
                getNewsDataFromServer()
            }
        })
    }

    const getNewsDataFromServer = () => {
        fetch('https://newsapi.org/v2/top-headlines?country=in&apiKey=<API_KEY>&pageSize=100', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(r => {
                setIsRefreshing(false)
                setIsLoadingMore(false)
                if (r.status === 'ok') {
                    updateLocalNewsData(r.articles)
                } else {
                    console.log('API error-->', r.message)
                }
                console.log('response-->', r)
            }).catch(error => console.log('API failed-->', error));
    }

    const closeRow = (index) => {
        if (prevOpenedItem && prevOpenedItem !== itemRefs[index]) {
            prevOpenedItem.close();
        }
        prevOpenedItem = itemRefs[index];
    };

    const onPinView = (index) => {
        const tempNewsData = [...newsData]
        let isPinned = tempNewsData[index].pinned
        tempNewsData[index].pinned = !isPinned;
        updateLocalNewsData(tempNewsData)
        closeRow(index + 1)
    }

    const onRemoveView = (index) => {
        const tempNewsData = [...newsData]
        tempNewsData.splice(index, 1)
        updateLocalNewsData(tempNewsData)
        closeRow(index + 1)
    }

    const updateLocalNewsData = (newsData) => {
        setNewsData(newsData)
        StorageHelper.saveObject(StoreKeys.NEWS_KEY, newsData)
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={[{backgroundColor: Colors.primary, padding: 12}]}>
                <Text style={{color: Colors.white, fontWeight: 'bold'}}>Taza Khabar</Text>
            </View>
            <GestureHandlerRootView style={{flex: 1, backgroundColor: isDarkMode ? Colors.dark : Colors.light}}>
                <FlatList data={newsData}
                          nestedScrollEnabled={true}
                          renderItem={({item, index}) => (
                              <NewsItemView
                                  setRef={(ref) => (itemRefs[index] = ref)}
                                  item={item} index={index}
                                  onPinView={onPinView}
                                  onRemoveView={onRemoveView}
                                  closeRow={closeRow}
                              />)}
                          keyExtractor={(item, index) => item.title.toString()}
                          refreshing={isRefreshing}
                          onRefresh={() => {
                              if (!isRefreshing) {
                                  refreshData()
                              }
                          }}
                          onEndReachedThreshold={0.8}
                          onEndReached={() => {
                              if (!isEndReached && !isLoadingMore) {
                                  console.log("--End Reached--");
                                  setIsLoadingMore(true)
                              }
                          }}
                          ListFooterComponent={() => (isLoadingMore ?
                              <ActivityIndicator
                                  color={Colors.primary}
                                  style={{margin: 16}}/>
                              : null)
                          }
                          extraData={newsData}
                />
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
