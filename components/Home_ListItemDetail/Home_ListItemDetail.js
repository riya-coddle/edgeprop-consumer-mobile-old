import React, { Component } from 'react';
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
    Dimensions
} from 'react-native'
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu'
import styles from './HomeListDetailsStyle';
 const {height, width} = Dimensions.get('window');
// const itemWidth = (width - 15) / 2;

class Home_ListItemDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        //this._onPress = this._onPress.bind(this)


        this.style = {
            // default value
            backgroundColor: '#f1f5f8',
            margin:0,
            marginTop: 2,
            marginRight: 2,
            marginBottom: 2,
            marginLeft: 2,
            width:178,
            //height:105,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: '#fff',
            fontFamily: 'Poppins-Regular',
            lineHeight: 18,
            alignItems:'center',
            totalSqft: 0,
            perSqft: 0,
            bedrooms: -1,
            bathrooms: 0,
            // header text
            headerTextValue: '',
            headerTextSize: 16,
            headerTextColor: '#275075',
            headerFontWeight: 'bold',
            // subject text
            subjectTextValue: '',
            subjectTextSize: 15,
            subjectTextColor: '#275075',
            subjectFontWeight: 'normal',
            // content text
            contentTextValue: '',
            contentTextSize: 10,
            contentTextColor: '#4A4A4A',
            contentFontWeight: 'normal',
        }
    }



    _initStyle(){
        // init backgroundColor
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        // init height
        if (this.props.height && this.props.height != this.style.height) {
            this.style.height = this.props.height
        }
        // init width
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init marginTop
        if (this.props.marginTop && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        // init marginRight
        if (this.props.marginRight && this.props.marginRight != this.style.marginRight) {
            this.style.marginRight = this.props.marginRight
        }
        // init marginBottom
        if (this.props.marginBottom && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        // init marginLeft
        if (this.props.marginLeft && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
        // init borderRadius
        if (this.props.borderRadius && this.props.borderRadius != this.style.borderRadius) {
            this.style.borderRadius = this.props.borderRadius
        }
        // init borderWidth
        if (this.props.borderWidth && this.props.borderWidth != this.style.borderWidth) {
            this.style.borderWidth = this.props.borderWidth
        }
        // init borderColor
        if (this.props.borderColor && this.props.borderColor != this.style.borderColor) {
            this.style.borderColor = this.props.borderColor
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init lineHeight
        if (this.props.lineHeight && this.props.lineHeight != this.style.lineHeight) {
            this.style.lineHeight = this.props.lineHeight
        }
        // init bedrooms
        if (this.props.bedrooms == 0 || (this.props.bedrooms && this.props.bedrooms != this.style.bedrooms)) {
            this.style.bedrooms = this.props.bedrooms
        }
        // init bathrooms
        if (this.props.bathrooms && this.props.bathrooms != this.style.bathrooms) {
            this.style.bathrooms = this.props.bathrooms
        }
        if (this.props.totalSqft && this.props.totalSqft != this.style.bathrooms) {
            this.style.totalSqft = this.props.totalSqft
        }
        if (this.props.perSqft && this.props.perSqft != this.style.perSqft) {
            this.style.perSqft = this.props.perSqft
        }
        // init headerTextValue
        if (this.props.headerTextValue && this.props.headerTextValue != this.style.headerTextValue) {
            this.style.headerTextValue = this.props.headerTextValue
        }
        // init headerTextSize
        if (this.props.headerTextSize && this.props.headerTextSize != this.style.headerTextSize) {
            this.style.headerTextSize = this.props.headerTextSize
        }
        // init headerTextColor
        if (this.props.headerTextColor && this.props.headerTextColor != this.style.headerTextColor) {
            this.style.headerTextColor = this.props.headerTextColor
        }
        // init headerFontWeight
        if (this.props.headerFontWeight && this.props.headerFontWeight != this.style.headerFontWeight) {
            this.style.headerFontWeight = this.props.headerFontWeight
        }
        // init subjectTextValue
        if (this.props.subjectTextValue && this.props.subjectTextValue != this.style.subjectTextValue) {
            this.style.subjectTextValue = this.props.subjectTextValue
        }
        // init subjectTextSize
        if (this.props.subjectTextSize && this.props.subjectTextSize != this.style.subjectTextSize) {
            this.style.subjectTextSize = this.props.subjectTextSize
        }
        // init subjectTextColor
        if (this.props.subjectTextColor && this.props.subjectTextColor != this.style.subjectTextColor) {
            this.style.subjectTextColor = this.props.subjectTextColor
        }
        // init subjectFontWeight
        if (this.props.subjectFontWeight && this.props.subjectFontWeight != this.style.subjectFontWeight) {
            this.style.subjectFontWeight = this.props.subjectFontWeight
        }
        // init contentTextValue
        if (this.props.contentTextValue && this.props.contentTextValue != this.style.contentTextValue) {
            this.style.contentTextValue = this.props.contentTextValue
        }
        // init contentTextSize
        if (this.props.contentTextSize && this.props.contentTextSize != this.style.contentTextSize) {
            this.style.contentTextSize = this.props.contentTextSize
        }
        // init contentTextColor
        if (this.props.contentTextColor && this.props.contentTextColor != this.style.contentTextColor) {
            this.style.contentTextColor = this.props.contentTextColor
        }
        // init contentFontWeight
        if (this.props.contentFontWeight && this.props.contentFontWeight != this.style.contentFontWeight) {
            this.style.contentFontWeight = this.props.contentFontWeight
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
    }

    shouldComponentUpdate(nextProps, nextState){
      return ((nextProps.headerTextValue) !== (this.props.headerTextValue))
    }

    _capitalizeText(text){
      return text.toString().toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }
    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }
    _formatArea(val) {
        return val ? this._formatNumber(val) : 0
    }
    render() {
        this._initStyle()
        //console.log('data12',this.props);
        //const {backgroundColor, margin, marginTop, marginBottom, marginRight, marginLeft, width, borderRadius, borderWidth, borderColor, fontFamily, lineHeight, headerTextValue, headerTextSize, headerTextColor, headerFontWeight, subjectTextValue, subjectTextSize, subjectTextColor, subjectFontWeight, contentTextValue, contentTextSize, contentTextColor, contentFontWeight} = this.props;
        var icon_bath = require('../../assets/images/ico_bath_room.png');
        var icon_bed = require('../../assets/images/list_bed.png');
        return(
           <View style={{paddingBottom: 10}}>
                <Text allowFontScaling={false}style={styles.titleLabelStyle} numberOfLines={1}>{this.style.subjectTextValue}</Text>
                <Text allowFontScaling={false} style={styles.priceLabelStyle}>{this.style.headerTextValue}</Text> 
                <View style={styles.sqftList}>
                    <View style={{ marginRight: 8 }}>
                       <Text allowFontScaling={false}>{this._formatArea(Math.trunc(this.style.totalSqft))+' sqft'}</Text> 
                    </View>
                    <View>
                        <Text allowFontScaling={false}>{this._formatMoney(Math.trunc(this.style.perSqft))+' psf'}</Text> 
                    </View>
                </View>
                <View style={styles.itemsList}>
                    {this.style.bedrooms != -1 && (<View style={{ marginRight: 8 }}>
                       <Text allowFontScaling={false} style={{ fontSize: width * 0.036 }}>{this.style.bedrooms ==0 ? 'Studio' : this.style.bedrooms? this.style.bedrooms+ ' Beds': ''}</Text> 
                    </View>)} 
                    <View>
                        <Text allowFontScaling={false} style={{ fontSize: width * 0.036 }}>{this.style.bathrooms?this.style.bathrooms+ ' Baths':''}</Text> 
                    </View>
                </View>
           </View> 
        )
    }
}

export default Home_ListItemDetail
