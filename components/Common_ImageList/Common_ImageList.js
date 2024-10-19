import React, { Component } from 'React'
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ScrollView
} from 'react-native'
import Common_Image from '../Common_Image/Common_Image'

export default class Common_ImageList extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.style = {}
        this.item={
            data:{},
        }
        this._onPress=this._onPress.bind(this);
    }

    _initStyle() {
        // init marginTop
        if (this.props.marginTop!=undefined && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        // init marginBottom
        if (this.props.marginBottom!=undefined && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        // init marginLeft
        if (this.props.marginLeft!=undefined && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
        // init width
        if (this.props.width!=undefined && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        // init justifyContent
        if (this.props.justifyContent!=undefined && this.props.justifyContent != this.style.justifyContent) {
            this.style.justifyContent = this.props.justifyContent
        }
        // init lineHeight
        if (this.props.lineHeight!=undefined && this.props.lineHeight != this.style.lineHeight) {
            this.style.lineHeight = this.props.lineHeight
        }
        // init color
        if (this.props.color!=undefined && this.props.color != this.style.color) {
            this.style.color = this.props.color
        }
        // init fontSize
        if (this.props.fontSize!=undefined && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        // init fontFamily
        if (this.props.fontFamily!=undefined && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }


    }
    _initItem(){
        // init criteria
        if (this.props.criteria && this.props.criteria != this.item.criteria) {
            this.item.criteria = this.props.criteria
        }
        // init data
        if (this.props.data && this.props.data != this.item.data) {
            this.item.data = this.props.data
        }
    }

    _onPress(){

    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }


    _renderItem(item, index) {
        const Style = {
            width:'100%',
            height:130
        }

        console.log(this.item.data[index].images);
        return (
            <View style={{flexDirection:'row', width:'50%', backgroundColor:'#fff', borderWidth:1, borderColor:'#fff'}}>
                <Common_Image
                    source={{uri:this.item.data[index].images}}
                    defaultSource={'https://dkc9trqgco1sw.cloudfront.net/s3fs-public/default_images/no_img.png'}
                    style={Style}
                    overlayText={'OUE TwinPeaks'}
                />
            </View>
        )

    }

    render() {
        this._initStyle()
        this._initItem()
        console.log(this.item.data);
        return (
            <View>
                <FlatList
                    numColumns={2}
                    flexDirection={'column'}
                    data={this.item.data}
                    renderItem={({ item, index }) => this._renderItem(item, index)}
                    keyExtractor={(item, index) => index}
                    scrollEnabled = {false}
                    // extraData = {this.state}
                />
            </View>
        );
    }
}
