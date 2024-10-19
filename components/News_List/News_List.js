import React, { Component } from 'React'
import {
    TouchableHighlight,
    View,
    Image,
    StyleSheet,
    Text,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native'
import News_ListItem from '../News_ListItem/News_ListItem'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
let {height, width} = Dimensions.get('window')
class News_List extends Component {
    // isLoading = false
    typeData = {}
    showTopSeparatorLine = false
    underlayColor = 'rgba(0,0,0,0)'
    headerTxtValue = ''
    isScrolling = false
    constructor(props) {
        super(props)
        var {height, width} = Dimensions.get('window')
        this.screenWidth = width,
        this.screenHeight = height
        this.state = {
            isLoading: false,
            isRefreshing: false,
        }
        this.count = 0

        this._onItemPress = this._onItemPress.bind(this);
        this._onHighlightPress = this._onHighlightPress.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._onRefresh = this._onRefresh.bind(this);

        this.containerStyle = {
            width: this.screenWidth,
            flexDirection: 'column',
            // justifyContent: 'flex-start',
            backgroundColor: 'rgba(0,0,0,0)',
            marginVertical: 0,
            marginHorizontal: 0,
            paddingVertical: 0,
            paddingHorizontal: 0,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#fff',
        }

        this.headerTextStyle = {
            fontFamily: 'Poppins-Regular',
            color: '#4a4a4a',
            fontSize: 14,
            paddingHorizontal: 9,
            paddingTop: 10,
            paddingBottom: 2,
        }

        this.separatorStyle = {
            flexDirection: 'row',
            borderColor: 'rgb(233,233,235)',
            borderWidth: 0.5,
            paddingLeft: 23,
            PaddingRight: 23
        }

        this.items = []
        this._scrollToIndex = this._scrollToIndex.bind(this);
        this._getItemLayout = this._getItemLayout.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
      if(JSON.stringify(nextProps.typeData) !== JSON.stringify(this.props.typeData)){
        return true;
      }
      else if(JSON.stringify(nextProps.items) !== JSON.stringify(this.props.items)){
        return true;
      }
      else if(nextProps.darkMode != this.props.darkMode){
        return true
      }
      return (JSON.stringify(nextState) !== JSON.stringify(this.state))
    }

    componentWillReceiveProps(nextProps) {
        // this._hideSpinner()
    }

     componentDidMount(){
        //  this.setState({
        //      isRefreshing: false
        //  })
     }

     componentDidUpdate(){
     }

    _init() {
        // init showTopSeparatorLine
        if (this.props.showTopSeparatorLine != undefined && this.props.showTopSeparatorLine != this.headerTxtValue) {
            this.showTopSeparatorLine = this.props.showTopSeparatorLine
        }
        // init headerTxtValue
        if (this.props.headerTxtValue != undefined && this.props.headerTxtValue != this.headerTxtValue) {
            this.headerTxtValue = this.props.headerTxtValue
        }
        // init type data
        if (this.props.typeData != undefined && this.props.typeData != this.typeData) {
            this.typeData = this.props.typeData
        }
        // init items
        if (this.props.items != undefined && this.props.items != this.items) {
            this.items = this.props.items
        }
    }

    _onItemPress(item, index) {
        if (this.props.onItemPress) {
            this.props.onItemPress(item, index)
        }
    }

    _onHighlightPress(item){
        if (this.props.onHighlightPress) {
            this.props.onHighlightPress(item)
        }
    }

    _onRefresh(){
        console.log('[DEBUG] refresh')
    }

    _loadMore() {
        // console.log("load more");
        //do something here, like pass function props back to parent component/screen to load  more data and append to list
        if (this.props.onLoadMore) {
            this.props.onLoadMore();
        }
    }

    _showSpinner(){
        console.log('[DEBUG] showspinner')
        this.setState({
            isLoading: true
        })
    }

    _hideSpinner(){
        console.log('[DEBUG] hidespinner')
        this.setState({
            isLoading: false
        })
    }

    _getItemLayout = (data, index) => {
        return {
            length: this.itemHeight,
            offset: this.itemHeight * index,
            index: index
        }
    }

    _scrollToIndex = (indexToScroll) => {
        var viewOffset = this.viewOffset? -this.viewOffset: 0
        viewOffset += 100
        // if(this.refs.flatlist && indexToScroll > 0){
        //     this.refs.flatlist.scrollToIndex({
        //         animated: false,
        //         index: indexToScroll,
        //         viewOffset: viewOffset
        //     });
        // }

        // console.log(indexToScroll * this.itemHeight - viewOffset);
        if(this.refs.flatlist && indexToScroll > 0){
            this.refs.flatlist.scrollToOffset({
                animated: false,
                offset: indexToScroll * this.itemHeight - viewOffset,
            });
        }
    }

    render() {
        this._init()
        var itemContainerStyle = {
            marginVertical: 10,
        }
        var itemAttachedImgStyle = {
            height: 82,
        }
        this.itemHeight = itemContainerStyle.marginVertical*2 + itemAttachedImgStyle.height + this.separatorStyle.borderWidth

        var _renderSeperator = (visible) => {
            if (visible)
                return (
                    <View style={this.separatorStyle} />
                )
        }

        var _renderListTitle = () => {
            let isDisplay = (this.headerTxtValue.length > 0)
            let isNotEmptyResult = (this.items.length > 0)
            let darkMode = this.props.darkMode? this.props.darkMode : false
            return (
                <View style={{display: isDisplay ? 'flex' : 'none'}}>
                    {isNotEmptyResult ?
                    (
                    <Text allowFontScaling={false} style={[this.headerTextStyle, {color: darkMode === true ? '#dddddd' : '#414141'}]}>
                        {this.headerTxtValue}
                    </Text>
                    ): 
                    (
                    <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Medium', fontSize: width * 0.045, color: darkMode ? '#dddddd' : '#414141', textAlign: 'center' }}>
                        {'No news found'}
                    </Text>
                    )}
                </View>
            )
        }

        var _renderLandingHighlight = () => {
            //console.log('_renderLandingHighlight',this.typeData);
            return (
                <LandingHighlight
                    data={this.typeData}
                    type={"newsLanding"}
                    landingTitle={'Featured Property News'}
                    isOverlayTitleAutoResize={true}
                    moreOption={false}
                    imageOverlayText={true}
                    title={true}
                    handleImageSliderNavigation={(id, index, link) => this._onHighlightPress(this.typeData[index])}>
                </LandingHighlight>
            )
        }

        var _renderCategoryHighlight = () => {
            this.viewOffset = 87 + this.screenWidth * 9/16
            //console.log('_renderCategoryHighlight',this.typeData);
            var typeData = this.typeData.map(function(item) {
                return {
                    nid: item.nid,
                    image: item.news_thumbnail,
                    title: item.node_title,
                    url: 'https://www.edgeprop.my/'+item.path,
                    thumbnail: item.news_thumbnail,
                    path: 'https://www.edgeprop.my/'+item.path,
                    category: item.field_category
                };
            });
            //console.log('typeData',typeData);
            return (
                <View>
                    <LandingHighlight
                        data={typeData}
                        type={"newsCategory"}
                        imageOverlayText={false}
                        title={false}
                        titleBelow={true}
                        handleImageSliderNavigation={() => this._onItemPress(this.typeData[0])}>
                    </LandingHighlight>
                </View>
            )
        }

        var _renderHeader = () => {
            return (
                <View>
                    {/*render landing highlight*/}
                    {this.props.type == 'landing' ?
                        <View>
                            {_renderLandingHighlight()}
                        </View>
                        : <View />
                    }

                    {/*render landing highlight*/}
                    {this.props.type == 'category' ?
                        <View>
                            {_renderCategoryHighlight()}
                        </View>
                        : <View />
                    }

                    {_renderListTitle()}
                </View>
            )
        }

        var _renderFooter = () => {
            status = (this.props.isEndOfData != undefined) ? this.props.isEndOfData : true
            if (status) return null
            // if (!this.state.isLoading) return null

            return (
                <View
                    style={{
                        paddingVertical: 20,
                        borderTopWidth: 1,
                        borderColor: '#CED0CE'
                    }}>
                    <ActivityIndicator animating size='large' />
                </View>
            )
        }

        var _renderItem = (item, index) => {
            if(typeof item.news_thumbnail !=='string'){
                return;
            }else if(item.news_thumbnail.startsWith('http://')){
                item.news_thumbnail = item.news_thumbnail?item.news_thumbnail.replace('http://','https://'):'';
            }

            const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
              ];
              let publishedDate = '';
            if(item.node_created) {
                var date  = new Date( item.node_created * 1000 ).getDate();
                var month = monthNames[new Date( item.node_created * 1000 ).getMonth()];
                var year  = new Date( item.node_created * 1000 ).getFullYear();

                publishedDate = month+' '+date+', '+year;
            }
            
            return (
                <TouchableHighlight
                    // The color of the underlay that will show through when the touch is active
                    underlayColor={this.underlayColor}
                    onPress={() => this._onItemPress(item, index)} >
                    <View>
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderColor: 'rgb(233,233,235)',
                            borderWidth: 0.5,
                            marginLeft: 23,
                            marginRight: 23,
                            marginTop: 8
                          }}
                        />
                        <News_ListItem
                            headerTxt={item.field_category}
                            publishedDate={publishedDate}
                            containerStyle = {itemContainerStyle}
                            attachedImgStyle = {itemAttachedImgStyle}
                            description={item.body?(item.body.replace(/(<([^>]+)>)/ig,"")):''}
                            contentTxt={item.node_title}
                            attachedImg={item.news_thumbnail}
                            darkMode={this.props.darkMode? this.props.darkMode : false}
                            imgResizeMode={'cover'}/>
                    </View>
                </TouchableHighlight>
            )
        }

        return (
            <View style={this.containerStyle}>
                {this.items.length > 0 ?
                    <FlatList
                        ref={"flatlist"}
                        removeClippedSubviews={true}
                        data={this.items}
                        onMomentumScrollBegin = {()=>{
                            this.isScrolling = true
                        }}
                        ListFooterComponent={() => _renderFooter()}
                        renderItem={({ item, index }) => _renderItem(item, index)}
                        keyExtractor={(item, index) => item.nid}
                        initialNumToRender={this.items.length}
                        bounces={false}
                        onEndReached={()=>{
                            if(this.isScrolling){
                                this._loadMore();
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        />
                    : _renderListTitle()}

            </View>
        )
    }
}

export default News_List
