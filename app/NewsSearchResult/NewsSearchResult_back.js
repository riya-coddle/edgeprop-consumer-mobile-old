import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    Button,
    Dimensions,
    PixelRatio,
    ActivityIndicator
} from 'react-native'
import firebase from 'react-native-firebase';
import appsFlyer from 'react-native-appsflyer';
import { HeaderBackButton } from 'react-navigation'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import Home_List from '../../components/Home_List/Home_List'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import NewsList from '../../components/News_List/News_List'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Common_Menu from '../../components/Common_Menu/Common_Menu.js'

var icon = require('../../assets/icons/menu_more.png');
var menu_icon = require('../../assets/icons/menu.png');

const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";
const API_GET_NEW_LIST = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/articles/getArticles.php?");
const TIMEOUT = 1000;
const screenWidth = Dimensions.get('window').width;
class NewsSearchResult extends Component {

    pageCount = 1
    totalPage = 1
    pageSize = 20
    totalResult = -1
    doUpdateResult = true
    indexToScroll

    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        var { params } = state
        var keyword = params.data.keyword || ""
        var _onSubmitEditing = (text) => {
            if (params.updateResult != undefined) {
                params.updateResult(text)
            }
        }
        return {
            header: (
                <View>
                    <StatusBarBackground lightContent={true} style={{ backgroundColor: '#275075' }} />
                    <View style={
                        {
                            flexDirection: 'row',
                            backgroundColor: "#275075",
                            // marginBottom: 6,
                            paddingRight: 10,
                            height: 75,
                            alignItems: 'center'
                        }}>
                        {navigation.goBack != undefined ?
                            <HeaderBackButton
                                tintColor={"white"}
                                onPress={() => { navigation.goBack() }}
                            /> : <View />
                        }
                        <View style={
                            {
                                flex: 1,
                                paddingRight: 10,
                            }}>
                            <HeaderSearch
                                defaultText={keyword}
                                hintText={'Search News'}
                                editable={true}
                                fontSize={15}
                                height={45}
                                textInputColor={'rgb(249,249,249)'}
                                showIconSearch={false}
                                onSubmitEditing={_onSubmitEditing}
                            />
                        </View>
                        <IconMenu
                            imageWidth={22}
                            imageHeight={15}
                            type={"icon"}
                            imageSource={icon}
                            onPress={() => {
                                if (params.toggleMenu != undefined) {
                                    params.toggleMenu()
                                }
                            }}
                        />
                    </View>
                </View>
            )
        };
    };

    keyword = ''
    constructor(props) {
        super(props);
        this.navigation = props.navigation
        this.params = this.navigation.state.params
        this.keyword = this.params.data.keyword
        this.newsSearchResultURL = ''

        this.state = {
            resultList: {},
            // isFocused: true
        }
        this._handleOnNewsItemPress = this._handleOnNewsItemPress.bind(this)
        this._callAPI = this._callAPI.bind(this);
        this._handleUpdateResult = this._handleUpdateResult.bind(this)
        this._handleLoadMore = this._handleLoadMore.bind(this)
        this._toggleMenu = this._toggleMenu.bind(this);

        // pass handleUpdateResult by setParams
        this.navigation.setParams({
            updateResult: this._handleUpdateResult,
            toggleMenu: this._toggleMenu,
        })
    }

    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     isFocused: nextProps.screenProps.stackKey == this.navigation.state.key
        // })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextState) != JSON.stringify(this.state))
    }

    componentDidMount() {
        this._changeURL()
        this._callAPI(this.newsSearchResultURL, "resultList");
    }

    componentWillUnmount() {
        pageCount = 1
    }

    componentDidUpdate(prevProps, prevState) {
        // if (!prevState.isFocused && this.state.isFocused) {
        //     if (this.refs.newslist && this.indexToScroll) {
        //         this.refs.newslist._scrollToIndex(this.indexToScroll)
        //     }
        // }
    }

    _validateData(currentData, incomingData, latestSize) {
        latestSize = latestSize || currentData.length
        start = currentData.length - latestSize > 0 ? currentData.length - latestSize : 0
        currrentData = currentData.slice(start)
        validatedData = []
        i = 0
        flag = true
        while (i < incomingData.length) {
            j = 0
            flag = true
            while (j < currentData.length && flag) {
                if (incomingData[i].nid === currentData[j].nid) {
                    flag = false
                }
                j++
            }
            if (flag) {
                validatedData.push(incomingData[i])
            }
            i++
        }

        return validatedData
    }

    _toggleMenu() {
        this.refs.menu._toggleMenu();
    }

    _callAPI(apiUrl, stateName) {
        if (!this.state[stateName].results) {
            fetch(apiUrl,
                {
                    method: 'GET', timeout: TIMEOUT
                }).
                then((response) => response.json()).
                then((responseJson) => {
                    if (responseJson) {
                        let totalResult = responseJson.response.total
                        let totalPage = Math.ceil(totalResult / this.pageSize)
                        if (this.doUpdateResult) {
                            this.totalResult = totalResult
                            this.totalPage = totalPage
                            this.doUpdateResult = false
                            this.setState({
                                [stateName]: responseJson.response.results,
                            });
                        } else {
                            if (this.totalPage < totalPage) {
                                this.totalResult = totalResult
                                this.totalPage = totalPage
                            }

                            if (this.state[stateName]) {
                                this.setState({
                                    [stateName]: [...this.state[stateName], ...this._validateData(this.state[stateName], responseJson.response.results, 2 * this.pageSize)],
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    _changeURL() {
        let page = '&page=' + this.pageCount.toString()
        let keyword = '&keyword=' + this.keyword
        let size = '&size=' + this.pageSize.toString()
        this.newsSearchResultURL = API_GET_NEW_LIST + encodeURIComponent(page + keyword + size + '&orderby=posted_desc&withtotal=true&keywordsearchfor=title,body,author')
    }

    _handleOnNewsItemPress(item, index) {
        if (index) {
            this.indexToScroll = index
        }
        var length = 99;
        var trimmedTitle = item.title.length > length ?
                    item.title.substring(0, length - 3) + "..." :
                    item.title;
        // var ParamURL = HOSTNAME + "/" + item.path
        firebase.analytics().logEvent('View_Article', { Title: trimmedTitle, Category:item.category });
        appsFlyer.trackEvent("View_Article", {},
            (result) => {
                console.log(result);
            },
            (error) => {
                console.error(error);
            }
        )
        this.refs.navigationHelper._navigate('NewsDetail', {
            data: {
                nid: item.nid
            }
        })
    }

    _handleUpdateResult(text) {
        if (this.keyword != text) {
            this.keyword = text
            this.doUpdateResult = true
            this.pageCount = 1
            this._changeURL()
            this._callAPI(this.newsSearchResultURL, "resultList")
        }
    }

    _handleLoadMore() {
        this.pageCount++
        if (this.pageCount <= this.totalPage) {
            this._changeURL()
            this._callAPI(this.newsSearchResultURL, "resultList")
        }
    }

    render() {
        // set total result to header txt of news list
        headerTxt = `${this.totalResult} news found`
        // if (!this.state.isFocused) {
        //     return <View />
        // }
        return (
            <View style={{ flex: 1 }}>
                {/* <StatusBarBackground lightContent={true} style={{backgroundColor:'#275075'}}/> */}
                <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation}
                />
                <Common_Menu
                    ref={"menu"}
                    navigation={this.props.navigation}
                />
                <View style={{ margin: 10 }} display={this.totalResult < 0 ? 'flex' : 'none'}>
                    <ActivityIndicator animating size='large' />
                </View>
                <View style={{ display: this.totalResult < 0 ? 'none' : 'flex', flex: 1 }}>
                    <NewsList
                        ref={"newslist"}
                        headerTxtValue={headerTxt}
                        items={this.state.resultList}
                        onItemPress={this._handleOnNewsItemPress}
                        isEndOfData={this.totalPage <= this.pageCount}
                        onLoadMore={this._handleLoadMore} />
                </View>
            </View>
        )
    }
}

export default NewsSearchResult
