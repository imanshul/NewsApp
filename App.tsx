/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList, Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text, TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'
import Colors from "./src/constants/Colors";
import NewsItemView from "./src/components/NewsItemView";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import StorageHelper, {StoreKeys} from "./src/utils/StorageHelper";
import Utils from "./src/utils/Utils";
import Images from "./src/images/Images";
import APIConstant from "./src/constants/APIConstant";

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const [isRefreshing, setIsRefreshing] = useState(true)
    const [timer, setTimer] = useState(0)
    //to only contain item to display
    const [newsData, setNewsData] = useState([])
    //To contain all news
    const [allNews, setAllNews] = useState([])
    //mark all cached headline as read
    const [isAllHeadlinedConsumed, setIsAllHeadlinedConsumed] = useState(false)
    let itemRefs = [];
    let prevOpenedItem;
    let currentPage = 1

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.primary,
        flex: 1
    };

    useEffect(() => {
        SplashScreen.hide();
        console.log('init->')
        refreshData()

        const randomHeadlineIntervalToDisplay = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1)
        }, 1000);

        return () => {
            console.log(`clearing interval`);
            clearInterval(randomHeadlineIntervalToDisplay);
        };
    }, []);

    useEffect(() => {
        if (timer > 0 && timer % 10 === 0) {
            // Reset the timer every 10 seconds
            insertRandomHealdlines(2)
            setTimer(0);
        }
    }, [timer]);

    function insertRandomHealdlines(count) {
        let displayedPinnedNews = newsData.filter((value) => value && value.pinned)
        let nonPinnedDisplayedNews = newsData.filter((value) => value && !value.pinned)
        let unreadElements = Utils.getRandomElementsWithUnread(allNews, count)

        if (unreadElements && unreadElements.length > 0) {
            console.log('--randomly inserted elements ---', count)
        } else {
            console.log('--randomly inserted elements ---', 0)
            getNewsDataFromServer(currentPage +1)
        }

        setNewsData([...displayedPinnedNews, ...unreadElements,...nonPinnedDisplayedNews])
        //As allnews contains marked read elements, so update in cache
        updateLocalNewsData(allNews)
    }


    function loadUnReadItem(allNews, itemToLoad = 10) {
        //All news data found
        //read top 10 unread news
        let pinnedNews = allNews.filter((value) => value && value.pinned)
        let nonPinnedAlreadyReadNews = allNews.filter((value) => !value.pinned && value.read)
        let nonPinnedNews = allNews.filter((value) => !value.pinned && !value.read)
        console.log('pinned->', pinnedNews.length, 'non Pinned & non-read ->', nonPinnedNews.length, 'Non pinned already read->', nonPinnedAlreadyReadNews.length)
        let readNews = nonPinnedNews.splice(0, Math.min(itemToLoad, nonPinnedNews.length))
        //Non Pinned Neews becomes leftOver news after slice
        console.log('read now->', readNews.length, ' leftover->', nonPinnedNews.length)
        //Mark news as read and populate-view
        let newsMarkedAsRead = readNews.map(obj => ({...obj, read: true}))
        let newsToDisplay = [...pinnedNews, ...newsMarkedAsRead]

        setNewsData(newsToDisplay)
        //console.log('save length =>', newsToDisplay.length, nonPinnedNews.length, nonPinnedAlreadyReadNews.length)
        //Save all news without displaying
        updateLocalNewsData([...newsToDisplay, ...nonPinnedNews, ...nonPinnedAlreadyReadNews])

        if (readNews.length === 0 && nonPinnedNews.length === 0) {
            console.log('--fetch new page from Network--')
            getNewsDataFromServer(currentPage + 1)
        }

    }

    const refreshData = () => {
        StorageHelper.getObject(StoreKeys.NEWS_KEY).then((value) => {
            if (value && value.length > 0) {
                console.log('Cached Data Found', value.length)
                loadUnReadItem(value)
                setIsRefreshing(false)
            } else {
                console.log('No Cached Data Found')
                getNewsDataFromServer(currentPage)
            }
        })
    }

    const getNewsDataFromServer = (page) => {
        console.log('--Fetching from network-- page->', page)
        fetch(APIConstant.topHeadline(page), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(r => {
                setIsRefreshing(false)
                if (r.status === 'ok') {
                    console.log('API returned results-->', r.articles.length)
                    if (allNews && allNews.length > 0) {
                        console.log('---reset cache---')
                        let pinnedNews = allNews.filter((value) => value && value.pinned)
                        loadUnReadItem([...pinnedNews, ...r.articles])
                       console.log('--do--')
                    } else {
                        //updateLocalNewsData(r.articles)
                        loadUnReadItem(r.articles)
                    }
                } else {
                    console.log('API error-->', r.message)
                }
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
        mergeAndUpdate(tempNewsData)
        closeRow(index + 1)
    }

    const mergeAndUpdate = (newsToUpdate) => {
        Utils.mergeByProperty(allNews, newsToUpdate, 'title')
        setNewsData(newsToUpdate)
        updateLocalNewsData(allNews)
    }

    const onRemoveView = (index) => {
        //Remove Item from all News
        let itemToRemove = newsData[index]
        let item = allNews.find((item) => item.title === itemToRemove.title)
        let indexToRemove = allNews.indexOf(item)
        //Remove item from displayedNews
        const tempNewsData = [...newsData]
        tempNewsData.splice(index, 1)
        allNews.splice(indexToRemove, 1)
        //Update states/storage
        setNewsData(tempNewsData)
        updateLocalNewsData(allNews)
        closeRow(index + 1)
    }

    const updateLocalNewsData = (newsData) => {
        setAllNews(newsData)
        StorageHelper.saveObject(StoreKeys.NEWS_KEY, newsData)
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={[{
                backgroundColor: Colors.primary,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }]}>
                <Text style={{color: Colors.white, fontWeight: 'bold'}}>Taza Khabar</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>{timer}</Text>
                    <TouchableOpacity style={{marginStart: 8}} onPress={() => setTimer(0)}>
                        <Image source={Images.RefreshIcon} style={{height: 20, width: 20}} resizeMode={'contain'}/>
                    </TouchableOpacity>
                </View>

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
                          keyExtractor={(item, index) => (item.title + '_' + index).toString()}
                          refreshing={isRefreshing}
                          onRefresh={() => {
                              if (!isRefreshing) {
                                  refreshData()
                              }
                          }}
                          extraData={newsData}
                />
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

export default App;
