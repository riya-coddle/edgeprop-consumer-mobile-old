import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    Platform,
    Dimensions,
    TouchableOpacity,
    Linking
} from 'react-native'
import IconMenu from '../Common_IconMenu/Common_IconMenu'
var icon_bath = require('../../assets/images/ico_bath_room.png')
var icon_bed = require('../../assets/images/list_bed.png')
var bookmark_unselect_icon = require('../../assets/icons/bookmark_unselect.png')
var bookmark_select_icon = require('../../assets/icons/bookmark_select.png')
var sell_property = require('../../assets/icons/sell_property.png')
import BookmarkHelper from '../Common_BookmarkHelper/Common_BookmarkHelper.js'
import CommonTransparentModal from '../CommonTransparentModal/CommonTransparentModal'
import NavigationHelper from '../Common_NavigationHelper/Common_NavigationHelper.js'
import AvatarIcon from '../../components/Common_AvatarIcon/Common_AvatarIcon'
import PropertyTypeOptions from '../../assets/json/Search_Data/PropertyTypeOptions.json'
import styleing from './ListItemDetailsStyle'
import Moment from 'moment';

var listingBed = require('../../assets/icons/listing_bed.png')
var listingBath = require('../../assets/icons/listing_bath.png')
var listingPsd = require('../../assets/icons/rm_psf.png')
var listingRuler = require('../../assets/icons/listing_ruler.png')
var listingInterior = require('../../assets/icons/listing_interior.png')
var premiumIcon = require('../../assets/icons/premium-property.png');
var agentImage  = "https://sg.tepcdn.com/images/avatar.png"
const API_WEBANALYTICS = "https://www.edgeprop.my/jwdalicia/api/webanalytics/v1/add/search";
const REFERER = Platform.OS;

class ListingResult_ListItemDetail extends Component {
    didMount
    constructor(props) {
        super(props)
        this.state = {
          isBookmark: props.isBookmark || false,
          isLogin: false
        }

        this.style = {
            // default value
            backgroundColor: '#f1f5f8',
            marginTop: 0,
            marginRight: 0,
             marginLeft: 0,

            width: '100%',
        }
        this.itemDetail = {
            askingPrice: null,
            askingPriceType: null,
            title: null,
            bedrooms: null,
            bathrooms: null,
            district: null,
            streetName: null,
            propertySubType: null,
            askingPriceUnitPsf: null,
            floorAreaSqft: null,
            floorAreaSqm: null,
            postalCode: null,
            yearCompleted: null,
            tenure: null,
            belowEfvPercentage: null,
        }
        this.hideAgent = [65632, 73634]
        this._onBookmarkPress = this._onBookmarkPress.bind(this)
        this._checkBookmark = this._checkBookmark.bind(this)
        this._onPress = this._onPress.bind(this)
        this._callWebAPI = this._callWebAPI.bind(this)
        this._handleCollection = this._handleCollection.bind(this)
        this._prefixType = this._prefixType.bind(this)
        this._getLabel = this._getLabel.bind(this)

    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.itemDetail) !== JSON.stringify(this.itemDetail)
        || nextState.isBookmark != this.state.isBookmark)
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.isBookmark!=undefined && nextProps.isBookmark != this.props.isBookmark){
        this.setState({
          isBookmark: nextProps.isBookmark
        })
      }
    }

    _init() {
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.width && this.props.width != this.style.width) {
            this.style.width = this.props.width
        }
        if (this.props.marginTop && this.props.marginTop != this.style.marginTop) {
            this.style.marginTop = this.props.marginTop
        }
        if (this.props.marginRight && this.props.marginRight != this.style.marginRight) {
            this.style.marginRight = this.props.marginRight
        }
        if (this.props.marginBottom && this.props.marginBottom != this.style.marginBottom) {
            this.style.marginBottom = this.props.marginBottom
        }
        if (this.props.marginLeft && this.props.marginLeft != this.style.marginLeft) {
            this.style.marginLeft = this.props.marginLeft
        }
        if (this.props.itemDetail && JSON.stringify(this.props.itemDetail) != JSON.stringify(this.itemDetail)) {
            this.itemDetail.askingPrice = this.props.itemDetail.askingPrice || this.itemDetail.askingPrice
            this.itemDetail.askingPriceType = this.props.itemDetail.askingPriceType || this.itemDetail.askingPriceType
            this.itemDetail.title = this.props.itemDetail.title || this.itemDetail.title
            this.itemDetail.bedrooms = this.props.itemDetail.bedrooms || this.itemDetail.bedrooms
            this.itemDetail.bathrooms = this.props.itemDetail.bathrooms || this.itemDetail.bathrooms
            this.itemDetail.district = this.props.itemDetail.district || this.itemDetail.district
            this.itemDetail.streetName = this.props.itemDetail.streetName || this.itemDetail.streetName
            this.itemDetail.propertySubType = this.props.itemDetail.propertySubType || this.itemDetail.propertySubType
            this.itemDetail.askingPriceUnitPsf = this.props.itemDetail.askingPriceUnitPsf || this.itemDetail.askingPriceUnitPsf
            this.itemDetail.floorAreaSqft = this.props.itemDetail.floorAreaSqft || this.itemDetail.floorAreaSqft
            this.itemDetail.floorAreaSqm = this.props.itemDetail.floorAreaSqm || this.itemDetail.floorAreaSqm
            // this.itemDetail.postalCode = this.props.itemDetail.postalCode || this.itemDetail.postalCode
            this.itemDetail.yearCompleted = this.props.itemDetail.yearCompleted || this.itemDetail.yearCompleted
            // this.itemDetail.tenure = this.props.itemDetail.tenure || this.itemDetail.tenure
            this.itemDetail.belowEfvPercentage = this.props.itemDetail.belowEfvPercentage || this.itemDetail.belowEfvPercentage
        }
    }

    _onPress() {

        let property_id = this.props.item.sharePropertyId;
            let key = this.props.item.shareKey;
            let listing_type = this.props.item.shareListingType;
            let url = "https://www.edgeprop.my/listing/";
            if(key == 'm'){
                url += listing_type+'/'+property_id;
            }else{
                url += property_id;
            }
            
        var message = "I am interested in "+this.props.item.title+", " +this.props.item.district+ " @ " +this._formatMoney(Math.round(this.props.item.askingPrice))+ " in EdgeProp.my. Kindly acknowledge. Thank you! \n"+url+""
        //console.log("message",message);
        this._callWebAPI(this.props.item);
        var contact = '+6'+ this.props.item.agentNumber;
          Linking.canOpenURL(
            `whatsapp://send?text=hello&phone=${contact}`
          ).then(supported => {
            if (!supported) {
              Alert.alert('App not installed');
            } else {
              return Linking.openURL(
                `whatsapp://send?text=${message}&phone=${contact}`
              );
            }
          });
    }

    _handleCollection(key,collection) {
        let temp = []
        for (i = 0; i < collection.length; i++) {
            temp = [...temp, ...collection[i][key].map(data => data)];
        }
        return temp
    }

    _prefixType(id){
        var prefix = '';
        if(33<id && id<36){
            prefix = 'r-';
        }else if(36<id || id<45){
            prefix = 'l-';
        }else if(60<id || id<70){
            prefix = 'c-';
        }else if(70<id || id<74){
            prefix = 'i-';
        }
        //console.log('prefix',prefix);
        return prefix+id;
    }

    _getLabel(key,collection){
        let res ='';
        //console.log('key',key);
        //console.log('collection',collection);
        if(key && collection.length > 0){
            res = collection.filter(value => value.id == key)
        }
        //console.log('res',res);

        res = res[0]? res[0].value : '';
        return res;
    }

    _callWebAPI(item) {

        let subType = item.propertySubType;
        let subTypeLabel =this._getLabel(this._prefixType(subType),this._handleCollection('sub',PropertyTypeOptions));
        subType = subTypeLabel? subTypeLabel: '';

        let data = {
            agentaction: 'mobWhatsapp',
            agentname: item.agentName,
            district: item.district,
            edge2k19: true,
            listing_type: item.shareListingType,
            property_type: subType,
            pid: item.listingId,
            referer: REFERER,
            state: item.state,
            origin: "mobile"
        }

      fetch(API_WEBANALYTICS,
        {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).
        then((response) => {
          console.log('count list res ', response)
        });
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

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
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
        let itemDetail = this.itemDetail
        //console.log('itemDetail',itemDetail);
        assetInfo =  ((itemDetail.floorAreaSqft != undefined && !this._isEmptyValue(itemDetail.floorAreaSqft)) ? (this._formatNumber(itemDetail.floorAreaSqft) + ' sqft '+ (' \xB7 ')) : '')
                    + ((itemDetail.askingPriceUnitPsf != undefined && !this._isEmptyValue(itemDetail.askingPriceUnitPsf)) ? (' '+this._formatMoney(Math.round(itemDetail.askingPriceUnitPsf*100)/100) + ' psf ') : '')    
        
        return assetInfo
    }

    _onBookmarkPress() {
        if(this.refs.bookmarkHelper != undefined){
            this.refs.bookmarkHelper._checkLogin(
                ()=>{
                    this.state.isLogin = true;
                    if(this.state.isLogin){
                        this.refs.menu._toggleMenu()
                        this.setState({
                          isBookmark: this.state.isBookmark ? false : true
                        })
                    this.refs.bookmarkHelper._updateBookmark(this.props.nid, this.state.isBookmark, this._checkBookmark)
                    }
                },
                ()=>{
                    // console.log('ian 12345');
                    // this.refs.bookmarkHelper._updateBookmark(this.props.nid, !this.state.isBookmark, this._checkBookmark)
                    Alert.alert(
                      "Login Required",
                      "This feature requires login, do you want to login?",
                      [
                        {text: 'Yes', onPress: () => {
                          this.refs.navigationHelper._navigate('RegWall', {
                            data: {},
                            // _handleBack: this._handleBack,
                            // _handleClose: this._handleClose
                          })
                        }, style: 'default'},
                        {text: 'No', onPress: () => {
                            // this.refs.navigationHelper._navigate('HomeLanding', {
                            //   data: {
                            //   }
                            // })
                        }, style: 'destructive'}, //default //cancel //destructive
                      ],
                      { cancelable: false }
                    )
                }
            )
            // if(this.state.isLogin){
            //     this.refs.menu._toggleMenu()
            //     this.setState({
            //       isBookmark: this.state.isBookmark ? false : true
            //     })
            //     if(this.refs.bookmarkHelper != undefined){
            //         this.refs.bookmarkHelper._updateBookmark(this.props.nid, !this.state.isBookmark, this._checkBookmark)
            //     }
            // }
        }
    }

    componentDidMount(){
      this.didMount = true
    }

    componentWillUnmount(){
      this.didMount = false
    }

    _checkBookmark(){
      this.refs.bookmarkHelper._getBookmarks((nids)=>{
         // console.log(nids,'wew');
        if(nids!=undefined && Array.isArray(nids)){
          flag=nids.indexOf(this.props.nid)>-1
          if(flag!=this.state.isBookmark){
            this.setState({
              isBookmark: flag
            })
            if(this.props.onUpdateBookmark){
              this.props.onUpdateBookmark();
            }
          }
        }
      });
      this.refs.menu._toggleMenu()
    }

    render() {
        let iconType = '';
        let iconText = '';
        const {width, height} = Dimensions.get('window');
        let displayAgent = true;
       
        if(this.hideAgent.indexOf(this.props.item.agentID) != -1) {
            displayAgent = false;
        }

        this._init()
        var _renderAskingPriceInfo = () => {
             
            return (
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopWidth: 0.3,
                    borderColor: '#D3D3D3'

                }}>
                      {
                        (this.itemDetail.askingPrice!=undefined && this.itemDetail.askingPrice!="0" && this.itemDetail.askingPriceType!="View to Offer")?
                        <Text allowFontScaling={false} style={{
                            marginTop: 0,
                            fontFamily: 'Poppins-Bold',
                            fontSize: width * 0.045,
                            //lineHeight: 30.5,
                            color: "#414141",
                            //flex: 1,
                            marginTop: 10,
                            paddingBottom: 5,
                            flex: 1
                         }}
                        ellipsizeMode={"tail"}
                        numberOfLines={1}>
                        {this._formatMoney(Math.trunc(this.itemDetail.askingPrice))}</Text>:
                         <Text
                         allowFontScaling={false} 
                         style={{
                            marginVertical: 4,
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: width * 0.042,
                            marginLeft: 20,
                            lineHeight: 28.5,
                            color: "#414141",
                        }}>
                        View to Offer
                        </Text>
                      }
                      {(this.props.item.agentName != 'EdgeProp' && displayAgent == true) &&
                        <TouchableOpacity
                          style={[{
                              padding: 5
                          },
                          styles.inline]}
                          onPress={this._onPress}>
                              <View>
                                 <Image style={{width: 29, height: 29 }} source={require('../../assets/icons/whatsapp_icon.png')}  />
                              </View>
                        </TouchableOpacity>
                      }
                      <View display={'none'} >
                          <IconMenu
                              gapAround= {{
                                  marginTop: 7,
                                  marginRight: 10,
                                  marginBottom: 7,
                                  marginLeft: 10,
                              }}
                              imageWidth={22}
                              imageHeight={20}
                              type={"icon"}
                              imageSource={this.state.isBookmark ? bookmark_select_icon : bookmark_unselect_icon}
                              onPress={this._onBookmarkPress} />
                      </View>
                </View>
            )
        }

     
        var _renderTitle = () => {
            //console.table(this.props.item)
            return (
                <View style={{paddingRight: 7}}>
                    <Text allowFontScaling={false} style={{
                        fontFamily: 'Poppins-Bold',
                        fontSize: width * 0.038,
                        color: "#414141",
                        paddingBottom: 5,
                        letterSpacing: 0,
                        paddingLeft: 20,
                        lineHeight: 20,
                        marginTop: 10,
                    }}>
                        {this._capitalizeFirstLetter(this.itemDetail.title)}
                    </Text>
                    <View style={styleing.infoContain}>
                        <Text allowFontScaling={false} style={styleing.info}>{this.props.item.district}, {this.props.item.state}</Text>
                        {(this.props.item.agentName !== undefined && this.props.item.agentName !== "EdgeProp.my" && this.props.item.agentName !== "" && displayAgent == true) && (
                            <View style={styleing.textRow}>
                            {/*
                            <Text allowFontScaling={false} style={styleing.info}>by </Text allowFontScaling={false}><Text allowFontScaling={false}>{this.props.item.agentName}</Text>
                            */}
                            {this.props.item.agentName != 'EdgeProp' &&
                            <View style={{marginBottom: 4, marginTop:-5, marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                            
                            <AvatarIcon
                              width={35}
                              height={35}
                              image={{uri: this.props.item.agentImage}}
                            />
                            <Text allowFontScaling={false} style={{ marginTop: 12, fontFamily: 'Poppins-Regular', color: '#414141', fontSize: width * 0.03, marginLeft: 5 }}>{this.props.item.agentName}</Text>

                            {(this.props.item.proAgent != undefined && this.props.item.proAgent == 'premium') && (<Image
                              style={{marginLeft: 7, marginTop: 8, width: 32, height: 18}}
                              source={require('../../assets/images/pro-agent.png')}
                            />)}
                            </View>
                            }
                            <View>
                                <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Regular', color: '#909090', fontSize: width * 0.03, marginRight: 18 }}>{Moment.unix(this.props.item.changed).fromNow()}</Text>
                              </View>
                            </View>
                        )}
                    </View>
                </View>    
            )
        }


        var _renderAssetInfo = () => {
            return (
                <Text allowFontScaling={false} style={styleing.textInfo}>
                    {this._wrapAssetInfo()}
                </Text>
            )
        }

        var _renderPropertyType = () => {
            if (this.props.item.propertySubType && this.props.item.propertySubType != '') {
                let iconType = '';
                let iconText = '';
                if(this.props.item.propertySubType) {
                    if(this.props.item.propertySubType == 36) {
                        iconType = require('../../assets/icons/landed.png');
                        iconText = 'Landed';
                    } else if(this.props.item.propertySubType == 33) { 
                        iconType = require('../../assets/icons/non-land.png');
                        iconText = 'Non-Landed';
                    } else if(this.props.item.propertySubType == 60) { 
                        iconType = require('../../assets/icons/store.png');
                        iconText = 'Commercial';
                    } else {
                        iconType = require('../../assets/icons/factory.png');
                        iconText = 'Industrial';
                    }    

                }    
                return (
                    <View style={{ flexDirection: 'row', width: '33.33%',alignItems: 'center', marginLeft: 20, }}>
                        <Image
                          style={{width: 18, height: 18}}
                          source={iconType}
                        />     
                        
                        <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular', marginTop: 4,alignItems: 'center',fontSize: width * 0.03, marginLeft: 8, color: '#525252' }}>
                            {iconText}
                        </Text>
                    </View>
                )
            }
        }

        var _renderBedIcon = () => {
            
             if(this.props.item.bedrooms !=undefined  ) {
                let bedrooms = this.props.item.bedrooms > 0?this.props.item.bedrooms:'Studio';

                return (
                    <View style={{ flexDirection: 'row',alignItems: 'center', width: '33.33%',marginLeft: 8 }}>
                        <Image
                          style={{width: 19, height: 18}}
                          source={listingBed}
                        />    
                        <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular',marginTop: 4, alignItems: 'center',fontSize: width * 0.03, marginLeft: 8, color: '#525252' }}>
                            {bedrooms}{bedrooms == 'Studio'?'':''}
                        </Text>
                    </View>
                )
            }
        }

        var _renderLandAreaIcon = () => {

            let assetInfo =  ((this.props.item.floorAreaSqft != undefined && !this._isEmptyValue(this.props.item.floorAreaSqft)) ? (this._formatNumber(this.props.item.floorAreaSqft)) : '')

            if(assetInfo) {
                return (
                    <View style={{ flexDirection: 'row', width: '33.33%',alignItems: 'center', marginLeft: 20, }}>
                        <Image
                          style={{width: 20, height: 18 }}
                          source={listingPsd}
                        />    
                        <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular',marginTop: 4, alignItems: 'center',fontSize: width * 0.03, marginLeft: 8, color: '#525252' }}>
                            {assetInfo} sqft
                        </Text>
                    </View>
                )
            }
        }

        var _renderPricepuIcon = () => {
            if (this.props.item.askingPriceUnitPsf && this.props.item.askingPriceUnitPsf != '') {
                return (
                    <View style={{ flexDirection: 'row', width: '33.33%',alignItems: 'center', marginLeft: 5, }}>
                        <Image
                          style={{width: 18, height: 18 }}
                          source={listingRuler}
                        />    
                        <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular',marginTop: 4, alignItems: 'center',fontSize: width * 0.03, marginLeft: 8, color: '#525252' }}>
                            RM {Math.round(this.props.item.askingPriceUnitPsf)} psf
                        </Text>
                    </View>
                )
            }
        }

        var _renderBathIcon = () => {
            if(this.itemDetail.bathrooms !=undefined) {
                let bathrooms = this.itemDetail.bathrooms > 0?this.itemDetail.bathrooms:'NA';

                return (
                    <View style={{ flexDirection: 'row',alignItems: 'center', width: '33.33%',marginLeft: 8 }}>
                        <Image
                          style={{width: 18, height: 20}}
                          source={listingBath}
                        />    
                        <Text allowFontScaling={false} key={i} style={{ fontFamily: 'Poppins-Regular',marginTop: 4, alignItems: 'center',fontSize: width * 0.03, marginLeft: 8, color: '#525252' }}>
                            {bathrooms}{bathrooms == 'NA'?'':''}
                        </Text>
                    </View>
                )
            } else {
                return (
                    <View style={{ flexDirection: 'row',alignItems: 'center', width: '33.33%',marginLeft: 8 }}>
                        
                    </View>
                )
            }
        }

        var _renderBelowValuationInfo = () => {
            return (
                <View
                    display={parseFloat(this.itemDetail.belowEfvPercentage) > 0 ? 'flex' : 'none'}
                    style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
                    <IconMenu
                        imageSource={sell_property}
                        type={'icon'}
                        gapWidth={2}
                        imageHeight={18}
                        imageWidth={18}
                        paddingHorizontal={2.5} />
                    <View style={{ marginTop: 4 }}>
                        <IconMenu
                            type={'text'}
                            textPosition={'right'}
                            fontFamily={"Poppins-Regular"}
                            textSize={12}
                            gapWidth={2}
                            textColor={'rgb(255,82,34)'}
                            textValue={`${this.itemDetail.belowEfvPercentage}% Below Valuation`}
                            paddingHorizontal={2.5} />
                    </View>
                </View>
            )
        }
        var _renderDummy = () => {
            return (
              <View style={{ flexDirection: 'row',alignItems: 'center', width: '33.33%',marginLeft: 8 }}>
                        
               </View>
            )
        }
        return (
            <View style={[styles.container,
            {   
                backgroundColor: '#fff',
                marginTop: this.style.marginTop,
                marginBottom: this.style.marginBottom,
                marginLeft: this.style.marginLeft,
                width: this.style.width,
               }]} >
                <NavigationHelper
                  ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />
                <CommonTransparentModal ref={"menu"} navigation={this.props.navigation} />
                <BookmarkHelper
                  ref={"bookmarkHelper"}
                  navigation = {this.props.navigation}
                />
                {/* this.props.item.isFeatured && (
                    <View style={[styles.featured]}>
                         <Image
                              style={{width: 17, height: 17}}
                              source={premiumIcon}
                            />

                        <Text allowFontScaling={false} style={[styles.featuredText]}>Featured Property</Text>
                    </View>
                ) */}
                {_renderTitle()}
                {_renderBelowValuationInfo()}
                <View style={{ flexDirection: 'row' , justifyContent: 'space-between', marginBottom: 10 }}>
                    {_renderPropertyType()}
                    {_renderBedIcon()}
                    {_renderBathIcon()}
                </View>
                <View style={{ flexDirection: 'row' , justifyContent: 'space-between', marginBottom: 10 }}>
                    {_renderLandAreaIcon()}
                    {_renderPricepuIcon()}
                    {_renderDummy()}
                <View/>
                </View>
                <View style={{ paddingLeft: 18, paddingRight: 18 }}>
                {_renderAskingPriceInfo()}
                </View>
                
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        paddingRight: 0,
        marginBottom: 44,
        marginTop: 44,
        paddingBottom: 0,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        marginLeft: -20

    },
    featured: {
        backgroundColor: '#FFA700',
        padding: 5,
        flexDirection:'row',
        margin: 0,
        marginTop: -1,
        alignItems: 'center',
        position: 'relative',
        paddingLeft: 15,
      },
    featuredText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        paddingLeft: 15
        
     },
    

   
})
export default ListingResult_ListItemDetail
