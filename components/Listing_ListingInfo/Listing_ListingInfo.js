import React, { Component } from 'React'
import { TouchableHighlight, View, Image, StyleSheet, Text, Dimensions } from 'react-native'
import IconMenu from '../Common_IconMenu/Common_IconMenu'
import Moment from 'moment';

var listingBed = require('../../assets/icons/listing_bed.png')
var listingBath = require('../../assets/icons/listing_bath.png')
var listingPsd = require('../../assets/icons/listing_psd.png')
var listingRuler = require('../../assets/icons/listing_ruler.png')
var listingInterior = require('../../assets/icons/listing_interior.png')
const {height, width} = Dimensions.get('window');
class Listing_PriceInfo extends Component {
    constructor(props) {
        super(props)
        this.style = {
            //backgroundColor: '#fff',
            fontFamily: 'Poppins-Regular',
            boldingFontFamily: 'Poppins-SemiBold',
        }
        this.items =[];
        this.listingInfo = {
            title: '',
            assetDistrict: '',
            assetStreetName: '',
            assetPostalCode: '',
            assetCity: 'Singapore',
            propertySubType: '',
            floorLocation: '',
            assetYearCompleted: '',
            assetTenure: '',
            bedrooms: '',
            bathrooms: '',
            pricepu: '',
            landArea: '',
            furnished: '',
        }
    }

    _init() {
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        if (this.props.boldingFontFamily && this.props.boldingFontFamily != this.style.boldingFontFamily) {
            this.style.boldingFontFamily = this.props.boldingFontFamily
        }
        if (this.props.listingInfo && JSON.stringify(this.props.listingInfo) != JSON.stringify(this.listingInfo)) {
            this.listingInfo = this.props.listingInfo
            this.infoSheet();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(this.listingInfo) != JSON.stringify(nextProps.listingInfo))
    }


    infoSheet(){
        this.items =[];
        if(this.listingInfo){
            if(this.listingInfo.propertySubType && this.listingInfo.propertySubType != ''){
               this.items.push({'key': 'property'}) 
            }
            if(this.listingInfo.bedrooms != '' || this.listingInfo.bedrooms === 0){
               this.items.push({'key': 'bed'}) 
            }
            if(this.listingInfo.bathrooms && this.listingInfo.bathrooms != ''){
               this.items.push({'key': 'bathroom'}) 
            }
            if(this.listingInfo.landArea && this.listingInfo.landArea != ''){
               this.items.push({'key': 'area'}) 
            }
            if(this.listingInfo.pricepu && this.listingInfo.pricepu != ''){
               this.items.push({'key': 'price'}) 
            }
        }
    }

    _capitalizeFirstLetter(str) {
        if ((typeof str) == 'string') {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            })
        }
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _getFirstWord(str) {
        return str.split(' ')[0]
    }

    _getTenureYear(assetTenure) {
        // 103 Yrs From 01/10/2010 -> 103 Yrs
        // 99 -> 99 Yrs
        // *others -> full
        if ((/([0-9])\w+\sYrs/g).test(assetTenure)) return assetTenure.match(/([0-9])\w+\sYrs/g)[0]
        else if ((/^[0-9]*$/).test(assetTenure)) return assetTenure.match(/^[0-9]*$/)[0] + ' Yrs'
        return assetTenure
    }

    _handleValue(value) {
        // handle empty value
        if (value == null || value == '' || value == 'Uncompleted') {
            return ''
        }
        // handle if value is integer
        if (value === parseInt(value, 10)) return value
        // handle string, and set the capitalization
        return this._capitalizeFirstLetter(value)
    }

    _isEmptyValue(value) {
        return (value == null || value == '' || value == 'Uncompleted' || value == undefined)
    }

    _wrapAssetInfo() {
        let listingInfo = this.listingInfo
        assetInfo = ((listingInfo.assetStreetName != undefined && !this._isEmptyValue(listingInfo.assetStreetName)) ? (this._handleValue(listingInfo.assetStreetName + (' \xB7 '))) : '')
            + ((listingInfo.assetDistrict != undefined && !this._isEmptyValue(listingInfo.assetDistrict)) ? (this._handleValue(listingInfo.assetDistrict + ', ')) : '')
            + ((listingInfo.assetPostalCode != undefined && !this._isEmptyValue(listingInfo.assetPostalCode)) ? (this._handleValue(listingInfo.assetPostalCode) + ' ') : '')
            + ((listingInfo.assetCity != undefined && !this._isEmptyValue(listingInfo.assetCity)) ? (this._handleValue(listingInfo.assetCity) + (' \xB7 ')) : '')
            //+ ((listingInfo.propertySubType != undefined && !this._isEmptyValue(listingInfo.propertySubType)) ? (this._handleValue(listingInfo.propertySubType) + (' \xB7 ')) : '')
            + ((listingInfo.floorLocation != undefined && !this._isEmptyValue(listingInfo.floorLocation)) ? (this._handleValue(listingInfo.floorLocation) + ' Floor' + (' \xB7 ')) : '')
            + ((listingInfo.assetYearCompleted != undefined && !this._isEmptyValue(listingInfo.assetYearCompleted)) ? (this._handleValue(listingInfo.assetYearCompleted) + (' \xB7 ')) : '')
            + ((listingInfo.assetTenure != undefined && !this._isEmptyValue(listingInfo.assetTenure)) ? (this._handleValue(this._getTenureYear(listingInfo.assetTenure))) : '') 
        return assetInfo
    }

    render() {
        this._init()

        const iconSize = {
            imageWidth: 25,
            imageHeight: 25,
        }

        const iconTxtStyle = {
            marginLeft: 9,
            color: 'rgb(74,74,74)',
            fontSize: width * 0.03,
            fontFamily: this.style.fontFamily,
            flex: 1,
            width: '100%'
        }

        var _renderSeperator = () => {
            return (
                <View style={[styles.separator]} />
            )
        }

        let containerStyle = [
            {
                //backgroundColor: this.style.backgroundColor,
                //paddingHorizontal: this.style.paddingHorizontal,
                //paddingVertical: this.style.paddingVertical,
                paddingBottom: 20
            },
            styles.container
        ]

        var _renderSuffixText = (text) => {
            //console.log('text',text);
            //console.log(typeof text);
            if(text){
                text =  text.toString();
            }
            containedWords = text.split(' ')
            _this = this
            return containedWords.map(function (word, i) {
                if ((/^[0-9,.]*$/).test(word)) {
                    // if word is a number
                    return (
                        <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular' }}>
                            {`${_this._formatNumber(word)} `}
                        </Text>
                    )
                }
                return (
                    <Text allowFontScaling={false} key={i}>
                        {`${word} `}
                    </Text>
                )
            })
        }

        var _renderBedIcon = () => {
            if (this.listingInfo.bedrooms != '' || this.listingInfo.bedrooms === 0) {
                let suffix = parseInt(this.listingInfo.bedrooms) > 0 ? 'BR' : ''
                let bedrooms = this.listingInfo.bedrooms == 0? 'Studio' : this.listingInfo.bedrooms
                return (
                    <View style={[{ flexDirection: 'row', width: '100%'}, styles.icon]}>
                        <Image
                          style={{width: 22, height: 20}}
                          source={listingBed}
                        />    
                        <Text allowFontScaling={false} style={iconTxtStyle}>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular' }}>
                                {`${bedrooms} `}
                            </Text>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular'}}>{suffix}</Text>
                        </Text>
                    </View>
                )
            }
        }

        var _renderPropertyType = () => {
            if (this.listingInfo.propertySubType && this.listingInfo.propertySubType != '') {
                let iconType = '';
                let iconText = '';
                if(this.listingInfo.propertyType) {
                    if(this.listingInfo.propertyType == 36) {
                        iconType = require('../../assets/icons/landed.png');
                        iconText = 'Landed';
                    } else if(this.listingInfo.propertyType == 33) { 
                        iconType = require('../../assets/icons/non-land.png');
                        iconText = 'Non-Landed';
                    } else if(this.listingInfo.propertyType == 60) { 
                        iconType = require('../../assets/icons/store.png');
                        iconText = 'Commercial';
                    } else {
                        iconType = require('../../assets/icons/factory.png');
                        iconText = 'Industrial';
                    }

                    if(this.listingInfo.propertySubType){
                        iconText = this.listingInfo.propertySubType;
                    }

                }    
                return (
                    <View style={[{ flexDirection: 'row', width: '100%',  alignItems: 'center'}, styles.icon]}>
                        <Image
                          style={{width: 20, height: 20}}
                          source={iconType}
                        />     
                        <Text allowFontScaling={false} style={iconTxtStyle}>
                            <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular' }}>
                                {iconText}
                            </Text>
                        </Text>
                    </View>
                )
            }
        }


        var _renderBathIcon = () => {
            if (this.listingInfo.bathrooms && this.listingInfo.bathrooms != '') {
                let suffix = parseInt(this.listingInfo.bathrooms) > 1 ? 'B' : 'B'
                return (
                    <View style={[{flexDirection: 'row', width: '100%'}, styles.icon]}>
                        <Image
                          style={{width: 20, height: 22}}
                          source={listingBath}
                        /> 
                        <Text allowFontScaling={false} style={iconTxtStyle}>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular' }}>
                                {`${this.listingInfo.bathrooms} `}
                            </Text>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular'}}>{suffix}</Text>
                        </Text>
                    </View>
                )
            }
        }

        var _renderPricepuIcon = () => {
            if (this.listingInfo.pricepu && this.listingInfo.pricepu != '') {
                let pricePu = !isNaN(this.listingInfo.pricepu)? Math.round(Number(this.listingInfo.pricepu)) : this.listingInfo.pricepu;
                let suffix =  ' psf';
                return (
                    <View style={[{ flexDirection: 'row', width: '100%'}, styles.icon]}>
                        <Image
                          style={{width: 20, height: 20}}
                          source={listingPsd}
                        />     
                        <Text allowFontScaling={false} style={iconTxtStyle}>
                            <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular' }}>
                                {'RM '}
                            </Text>
                            {_renderSuffixText(`${pricePu}${suffix}`)}
                        </Text>
                    </View>
                )
            }
        }

        var _renderLandAreaIcon = () => {
            if (this.listingInfo.landArea && this.listingInfo.landArea != '') {
                return (
                    <View style={[{flexDirection: 'row', width: '100%'}, styles.icon]}>
                        <Image
                          style={{width: 20, height: 20}}
                          source={listingRuler}
                        />     
                        <Text allowFontScaling={false} style={iconTxtStyle}>
                            {_renderSuffixText(this.listingInfo.landArea+' '+this.listingInfo.landAreaUnit)}
                        </Text>
                    </View>
                )
            }
        }

        var _renderFurnishedIcon = () => {
            if (this.listingInfo.furnished && this.listingInfo.furnished != '') {
                return (
                    <View style={[{ flexDirection: 'row', width: '100%'}, styles.icon]}>
                        <Image
                          style={{width: 20, height: 20}}
                          source={listingInterior}
                        />     
                        <Text allowFontScaling={false} style={[iconTxtStyle, { fontFamily: 'Poppins-Regular' }]}>
                            {this._capitalizeFirstLetter(this.listingInfo.furnished)}
                        </Text>
                    </View>
                )
            }
        }

        var _renderTopSide = () => {
            return (
                <View style={styles.topSide}>
                      {/*<Text allowFontScaling={false} style={{
                        color: '#414141',
                        fontSize: 17,
                        fontFamily: this.style.boldingFontFamily,
                    }}>
                         {this._capitalizeFirstLetter(this.listingInfo.title)}
                    </Text>*/}
                    <Text allowFontScaling={false} style={{
                        color: 'rgb(74,74,74)',
                        fontSize: width * 0.03,
                        fontFamily: this.style.fontFamily,
                        paddingBottom: 1
                     }}>
                        {this._wrapAssetInfo()}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      {this.listingInfo.changed && (<Text allowFontScaling={false} style={[styles.hours]}>
                        {Moment.unix(this.listingInfo.changed).fromNow()}
                      </Text>)}
                      <Text allowFontScaling={false} style={[styles.viewMap]}>
                        
                      </Text>   
                    </View>    
                   
                </View>
            )
        }

        var _renderItems =  (index, flag) => {
            let key = this.items[index].key
            if(key == 'property'){
                return (
                    <View style={{ flexDirection: 'row', width: '40%'}}>
                        {/* property type */}
                        {_renderPropertyType()}
                    </View>
                )
            }else if(key == 'bed'){
                return (
                    <View style={{ flexDirection: 'row', width: '30%'}}>
                        {/* beds */}
                        {_renderBedIcon()}
                    </View>
                )
            }else if(key == 'bathroom'){
                return (
                    <View style={{ flexDirection: 'row', width: '30%'}}>
                        {/* baths */}
                        {_renderBathIcon()}
                    </View>
                )
            }else if(key == 'area'){
                return (
                    <View style={{ flexDirection: 'row', width: flag? '40%' : '30%'}}>
                        {/* landarea */}
                        {_renderLandAreaIcon()}
                    </View>
                )
            }else if(key == 'price'){
                return (
                    <View style={{ flexDirection: 'row', width: flag? '60%' : '30%'}}>
                        {/* pricepu */}
                        {_renderPricepuIcon()}
                    </View>
                )
            }
        }


        var _renderBottomSide = () => {
            return (
                <View style={styles.bottomSide}>
                    <View style={{ flexDirection: 'row'}}>
                        {this.items[0]? _renderItems(0,false) : null}
                        {this.items[1]? _renderItems(1,false) : null}
                        {this.items[2]? _renderItems(2,false) : null}
                    </View>
                    {this.items.length > 3 && (<View style={{ flexDirection: 'row'}}>
                        {this.items[3]? _renderItems(3,true) : null}
                        {this.items[4]? _renderItems(4,true) : null}
                    </View>)}
                </View>
            )
        }

        return (
            <View style={containerStyle}>
                {_renderTopSide()}
                {/* {_renderSeperator()} */}
                {_renderBottomSide()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    topSide: {
        paddingLeft: 13,
        paddingRight: 13,
        paddingHorizontal: 16
    },
    bottomSide: {
        paddingVertical: 5,
        flexDirection: 'column',
    },
    separator: {
        flex: 1,
        flexDirection: 'row',
        height: 1,
        borderWidth: 1,
    },
    icon: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    viewMap: {
        color:'#488BF8', 
        paddingLeft:8,
        paddingRight: 9,
        fontSize: 12
    },
    hours: {
         flexDirection: 'row',
         color: '#A0ACC1',
         fontSize: width * 0.03,
         paddingLeft: 1
    }

})

export default Listing_PriceInfo
