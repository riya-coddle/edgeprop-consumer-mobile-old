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
    FlatList
} from 'react-native'
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu'
export default class Common_ListIconMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.style = {
            // default value
            margin: 17,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 10,
            alignItems: 'flex-start',
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: '#4A4A4A',
            fontWeight: 'bold',
        }
        this.item = {
            data:{},
            title: 'FACILITIES',
        }
        this._onIconSelect = this._onIconSelect.bind(this)
    }
    _initStyle() {
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init marginTop
        if (this.props.marginTop && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        // init marginLeft
        if (this.props.marginLeft && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
        // init marginRight
        if (this.props.marginRight && this.props.marginRight != this.style.marginRight) {
            this.style.marginRight = this.props.marginRight
        }
        // init marginBottom
        if (this.props.marginBottom && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
        // init fontSize
        if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init color
        if (this.props.color && this.props.color != this.style.color) {
            this.style.color = this.props.color
        }
        // init fontWeight
        if (this.props.fontWeight && this.props.fontWeight != this.style.fontWeight) {
            this.style.fontWeight = this.props.fontWeight
        }

    }
    _initItem(){
        // init data
        if (this.props.data.data && this.props.data.data != this.item.data) {
            this.item.data = this.props.data.data
        }
        // init title
        if (this.props.title && this.props.title != this.item.title) {
            this.item.title = this.props.title
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return (JSON.stringify(nextProps.item) != JSON.stringify(this.item))
    }

    _onIconSelect(key){
        var iconFile = '/';
        switch(key){
            case 'city_view':
                iconFile = require('../../assets/images/icons/ico_city_view.png')
                break;
            case 'corner':
                iconFile = require('../../assets/images/icons/ico_corner.png')
                break;
            case 'park_green_view':
                iconFile = require('../../assets/images/icons/ico_park_green_view.png')
                break;
            case 'penthouse':
                iconFile = require('../../assets/images/icons/ico_penthouse.png')
                break;
            case 'pool_view':
                iconFile = require('../../assets/images/icons/ico_pool_view.png')
                break;
            case 'sea_view':
                iconFile = require('../../assets/images/icons/ico_sea_view.png')
                break;
            case 'air_con':
                iconFile = require('../../assets/images/icons/ico_air_con.png')
                break;
            case 'bathtub':
                iconFile = require('../../assets/images/icons/ico_bathtub.png')
                break;
            case 'cooker_hob':
                iconFile = require('../../assets/images/icons/ico_cooker_hob.png')
                break;
            case 'hairdryer':
                iconFile = require('../../assets/images/icons/ico_hairdryer.png')
                break;
            case 'intercom':
                iconFile = require('../../assets/images/icons/ico_intercom.png')
                break;
            case 'jacuzzi':
                iconFile = require('../../assets/images/icons/ico_jacuzzi.png')
                break;
            case 'private_pool':
                iconFile = require('../../assets/images/icons/ico_private_pool.png')
                break;
            case 'water_heater':
                iconFile = require('../../assets/images/icons/ico_water_heater.png')
                break;
            case 'balcony':
                iconFile = require('../../assets/images/icons/ico_balcony.png')
                break;
            case 'garage':
                iconFile = require('../../assets/images/icons/ico_garage.png')
                break;
            case 'maidsroom':
                iconFile = require('../../assets/images/icons/ico_maidsroom.png')
                break;
            case 'outdoor_patio':
                iconFile = require('../../assets/images/icons/ico_outdoor_patio.png')
                break;
            case 'private_garden':
                iconFile = require('../../assets/images/icons/ico_private_garden.png')
                break;
            case 'roof_terrace':
                iconFile = require('../../assets/images/icons/ico_roof_terrace.png')
                break;
            case 'terrace':
                iconFile = require('../../assets/images/icons/ico_terrace.png')
                break;
            case 'walk_in_wardrobe':
                iconFile = require('../../assets/images/icons/ico_walk_in_wardrobe.png')
                break;
            default:
                iconFile = require('../../assets/images/icons/ico_walk_in_wardrobe.png')
        }
        return iconFile;
    }


    _renderItem(item, index) {
        var path = this._onIconSelect(item["key"]);
        return (
            <View style={{
                width:'50%',
                alignItems:'flex-start',
                borderWidth:0
            }}>
                <Common_IconMenu
                    type={'icon-text'}
                    textPosition={'right'}
                    imageSource={path}
                    imageHeight={30}
                    imageWidth={30}
                    textValue={item.value}
                    textSize={13}
                    textWidth={140}
                    fontFamily={'Poppins-SemiBold'}
                    fontWeight={'600'}
                    fontStyle={'normal'}
                    textColor={'#4A4A4A'}
                />
            </View>
        )
    }
    render() {
        this._initStyle()
        this._initItem()
        return (
            this.item.data.length > 0
            ?
            <View style={{marginLeft: 17, marginBottom: 17, marginTop: 17, marginRight: 5}}>
                <View style={{marginBottom:this.style.marginBottom}}>
                    <Text allowFontScaling={false} style={{
                        fontSize: this.style.fontSize,
                        fontFamily: this.style.fontFamily,
                        color: this.style.color,
                        alignItems: this.style.alignItems,
                        fontWeight:this.style.fontWeight
                    }}>{this.item.title}</Text>
                </View>

            <FlatList
                numColumns={2}
                flexDirection={'column'}
                data={this.item.data}
                renderItem={({ item, index }) => this._renderItem(item, index)}
                keyExtractor={(item, index) => item.key}
            />
            </View>
            :
            null
        );
    }
}
