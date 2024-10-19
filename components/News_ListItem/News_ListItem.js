import React, { Component } from 'React'
import {
    TouchableHighlight,
    View,
    Image,
    StyleSheet,
    Text,
} from 'react-native'
import News_ListItemDetail from '../News_ListItemDetail/News_ListItemDetail'
import {CachedImage} from 'react-native-cached-image';
import IconMenu from '../Common_IconMenu/Common_IconMenu'
import styles from './NewsListItemStyle';


var bookmarkUnselect = require('../../assets/icons/bookmark-notSelected.png');
var moreOption = require('../../assets/icons/more.png');

class News_ListItem extends Component {
    resizeMode = "cover"
    constructor(props) {
        super(props)
        this.state = {}
        this.containerStyle = {
            backgroundColor: 'rgba(0,0,0,0)',
            paddingHorizontal: 10,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#fff',
            width: '100%',
            flexDirection: 'row',
        }

        this.attachedImgStyle = {
            height: 82,
            width: 145,
        }
        // data for listItemDetail
        this.item = {
            headerTxt: '',
            contentTxt: '',
            attachedImg: null,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.item) !== JSON.stringify(this.item) || nextProps.darkMode != this.props.darkMode)
    }

    componentWillReceiveProps(nextProps) {
    }

    _initStyle() {
        // init containerStyle
        if (this.props.containerStyle != undefined) {
            this.containerStyle = {...this.containerStyle,...this.props.containerStyle}
        }

        // init attachedImgStyle
        if (this.props.attachedImgStyle != undefined) {
            this.attachedImgStyle = {...this.attachedImgStyle,...this.props.attachedImgStyle}
        }
    }

    _initItem() {
        // init item.headerTxt
        if (this.props.headerTxt != undefined && this.props.headerTxt != this.item.headerTxt) {
            this.item.headerTxt = this.props.headerTxt
        }
        // init item.contentTxt
        if (this.props.contentTxt != undefined && this.props.contentTxt != this.item.contentTxt) {
            this.item.contentTxt = this.props.contentTxt
        }
        // init attachedImg
        if (this.props.attachedImg != undefined && this.props.attachedImg != this.item.attachedImg) {
            this.item.attachedImg = this.props.attachedImg
        }
    }

    _onAreaPress() {
        this.props.onAreaPress()
    }

    render() {
        this._initStyle()
        this._initItem()
        return (
            <View>
                <Text allowFontScaling={false} style={[styles.labelStyle, {color: this.props.darkMode ? '#909090' : '#909090'}]}>{this.item.headerTxt}</Text>
                <View style={styles.containerStyle}>
                    <View style={styles.listItemDetailStyle}>
                        <News_ListItemDetail
                        headerTxtValue={this.item.headerTxt}
                        datePublished={this.props.publishedDate}
                        headerFontWeight={'500'}
                        description={this.props.description}
                        darkMode={this.props.darkMode}
                        contentTxtValue={this.item.contentTxt}/>
                    </View>
                    <View style={styles.imageConatiner}>
                        <CachedImage
                            style={styles.attachedImgStyle}
                            onError={(error)=>{console.log("error", error)}}
                            source={{ uri: this.item.attachedImg }}
                            resizeMode={this.resizeMode} />
                    </View> 
                </View>
                <View style={styles.iconStyles}>
                    <View style={styles.labelDateStyle}>
                        <Text allowFontScaling={false} style={styles.dateStyle}>{this.props.publishedDate}</Text>
                    </View>
                        <View style={styles.optionList}>
                            
                        </View>    
                </View>
            </View>
        )
    }
}

export default News_ListItem
