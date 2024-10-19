import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
    ActivityIndicator,
    AsyncStorage,
    Dimensions
} from 'react-native'
import ListingResult_ListItem from '../ListingResult_ListItem/ListingResult_ListItem'
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json'
import ShareHelper from '../../components/Common_ShareHelper/Common_ShareHelper.js'
import RelatedProperty_List from '../../app/RelatedProperty_List/RelatedProperty_List.js'
import WishList from '../../app/WishlistModal/WishlistModal.js'
import EnquireModal from '../../app/EnquireModal/EnquireModal.js'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import styles from './ListingResult_ListStyle.js'
import { CheckBox } from 'react-native-elements'
import { Icon } from 'react-native-elements'
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'


const DELETE_API = 'https://alice.edgeprop.my/api/user/v1/shortlist-del';
const BOOKMARK_API = 'https://alice.edgeprop.my/api/user/v1/shortlist';
let imageUri = '../../assets/icons/No_Img.jpg';

class ListingResult_List extends Component {
    isScrolling = false

    constructor(props) {
        super(props)
        this.state = {
            bookmarkNid: 0,
            bookmarkMid: 0,
            onBookmarkClick: false,
            userInfo: {},
            checked: [],
            testState: false,
            shareLinks: [],
            allCheckBoxs: [],
            allUrls: [],
            onEnquire: false,
            sid: 0,
            refreshFlag: 0
        }
        this._handleOnPressItem = this._handleOnPressItem.bind(this)
        this._loadMore = this._loadMore.bind(this);
        this._formatNumber = this._formatNumber.bind(this);
        this._formatMoney = this._formatMoney.bind(this);
        this._addingToBookmark = this._addingToBookmark.bind(this);
        this.closeWishlistModal = this.closeWishlistModal.bind(this)
        this._deleteBookMark = this._deleteBookMark.bind(this)
        this.handleCheckbox = this.handleCheckbox.bind(this)
        this.isChecked = this.isChecked.bind(this);
        this.onEnquire = this.onEnquire.bind(this);
        this.onShare = this.onShare.bind(this);
        this.closeModal = this.closeModal.bind(this)
        this.onSelectAll = this.onSelectAll.bind(this)
        this.onClearAll = this.onClearAll.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this._addShortList = this._addShortList.bind(this)
        this._setSid = this._setSid.bind(this)
        this.doNothing = this.doNothing.bind(this)
        this.resetUsrInfo = this.resetUsrInfo.bind(this)

        this.style = {
            // default value
            backgroundColor: 'rgba(0,0,0,0)',
            paddingHorizontal: 0,
            paddingVertical: 5,
        }
        this.headerTitle = null
        this.headerStyle = {
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
            marginLeft: 11,
            marginBottom: 5,
            color: "rgb(51,51,51)",
        }
        this.items = {}
        this.separatorStyle = {

            borderColor: '#fff',
            borderWidth: 2.5,
        }
    }

    async componentDidMount() {
      await this.resetUsrInfo();      
    }

    async resetUsrInfo() {
        const user = await AsyncStorage.getItem("authUser");  
        if(user && user != '') {
            let authItems = JSON.parse(user);
            if(authItems.status == 1) {

                this.setState({ userInfo: authItems })
            }
        }   
    }

    
    onClearAll() {
        this.setState({ checked: [], shareLinks: [] })
    }

    onShare() {
        let shareMessage = '';
        for (var i = 0; i < this.state.shareLinks.length ; i++) {
          //  console.log();
            shareMessage += this.state.shareLinks[i]+'\n'; 
         } 
        if(shareMessage != '') {
            this.refs.share._share(shareMessage);
        }
        
    }

    doNothing() {
        console.log('dfddf');
    }

    onSelectAll() {
        let nids = [];
        let urls = [];
        this.setState({ checked: [], shareLinks: [] })
        for (var values in this.props.items) {
           nids.push(Number(this.props.items[values].nid))
           urls.push('https://www.edgeprop.my/listing'+this.props.items[values].url.replace(/^"(.*)"$/, '$1'))
         //  console.log();
          // console.log(this.props.items[values].url);
           
        }
        if(nids && urls) {
            this.setState({ checked: nids, shareLinks: urls },()=>console.log(''))
        }

    }

    handleCheckbox(index, url) {
        //console.log(url);
       // console.log(index)
        var item = this.state.checked.indexOf(Number(index));
        if (item > -1) {
            this.state.checked.splice(item, 1);
            this.setState({ testState: !this.state.testState })
        } else {
           this.setState({ checked: [...this.state.checked, Number(index)] })
        }

        

        
        var share = this.state.shareLinks.indexOf("https://www.edgeprop.my/listing/"+url);
        if (share > -1) {
            this.state.shareLinks.splice(share, 1);
            this.setState({ testState: !this.state.testState })
        } else {
            validUrl = "https://www.edgeprop.my/listing/" + url.replace(/^"(.*)"$/, '$1');
           this.setState({ shareLinks: [...this.state.shareLinks, validUrl] })
        }
               // console.log(url);

    }
    
    onEnquire() {
        this.setState({ onEnquire : true })
    }

    closeModal() {
        this.setState({ onEnquire: false })
    }   
    
    isChecked(index) {
       var item = this.state.checked.indexOf(Number(index));
        if (item > -1) {
            return true;
        } else {
           return false;
        } 
    }

    _deleteBookMark(id) {
        fetch(DELETE_API, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.props.userId+"&key="+this.props.accesskey+"&id="+id // <-- Post parameters        })
      }).then((response) => response.json())
      .then((responseText) => {
        //console.log('shirt',responseText)
        this.props.onRemove();
      })
      .catch((error) => {
          console.error(error);
      }); 
    }

    closeWishlistModal() {
        this.setState({ bookmarkNid: 0 , bookmarkMid: 0, onBookmarkClick: false })
    }

    async _addingToBookmark(nid,mid, shortlist,sID) {
        await this.resetUsrInfo();
        if(this.state.userInfo.uid == 0) {
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
                    this.refs.navigationHelper._navigate('SignUpLanding', {
                      data: {},
                      _handleBack: this._handleBack,
                      _handleClose: this._handleClose
                    })
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
        } else {
        if(shortlist || this.state.sid == 0)
            this.setState({ bookmarkNid: nid , bookmarkMid: mid, onBookmarkClick: true })
        else {
            console.log("qweeqeq");
            this._addShortList(nid,mid);
        }
        }
    }

    _addShortList(nid,mid) {
        //console.log(this.state);
        let sID = this.state.sid;
        let apiUrl = "uid="+this.state.userInfo.uid+"&key="+this.state.userInfo.accesskey+"&s_id="+sID;
        if(nid && nid != "undefined")
          apiUrl = apiUrl+"&nid="+nid;
        if(mid && mid != "undefined")
          apiUrl = apiUrl+"&mid="+mid;
//console.log('url',apiUrl);
        fetch(BOOKMARK_API, {
            method: 'POST',
            headers: new Headers({
                     'Accept' : 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: apiUrl // <-- Post parameters        })
        }).then((response) => response.json())
        .then((responseText) => {console.log('responseText',responseText);
            if(responseText.status == 1){
                this.handleChange(nid, 1);
            }
        })
        .catch((error) => {
              console.error(error);
        });
              
    }

    _setSid(sID) {
        this.setState({ sid: sID })
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.bookmarkList) != JSON.stringify(this.props.bookmarkList)){
          return true
        }
        return (JSON.stringify(nextProps.items) != JSON.stringify(this.items))
    }*/

    _init() {

        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.paddingHorizontal && this.props.paddingHorizontal != this.style.paddingHorizontal) {
            this.style.paddingHorizontal = this.props.paddingHorizontal
        }
        if (this.props.paddingVertical && this.props.paddingVertical != this.style.paddingVertical) {
            this.style.paddingVertical = this.props.paddingVertical
        }
        if (this.props.headerTitle && this.props.headerTitle != this.headerTitle) {
            this.headerTitle = this.props.headerTitle
        }
        if (this.props.headerStyle && JSON.stringify(this.props.headerStyle) != JSON.stringify(this.headerStyle)) {
            this.headerStyle = this.props.headerStyle
        }
        if (this.props.items) {
            this.items = this.props.items
        }
    }

    _handleOnPressItem(item, index) {
        if (this.props.onPressItem) {
            this.props.onPressItem(item, index)
        }
        else {
            Alert.alert("Coming Soon", `${item.title}, this feature will be coming soon`);
        }
    }
    _loadMore() {
        //do something here, like pass function props back to parent component/screen to load  more data and append to list
        if (this.props.onLoadMore) {
            this.props.onLoadMore();
        }
    }
    _isArrayContain(array, item){
      if(array!= undefined && Array.isArray(array)){
        if(item!=undefined && array.indexOf(item.toString()) > -1){
          return true
        }
        else{
          return false
        }
      }
    }

    _tenureValue(data){
        let value = data? (data? data: ''): '';
        let tenure = TenureOptions.filter(tenure => tenure.id == value);
        return tenure[0]? tenure[0].value: '';
    }

    handleChange(nid, wishListItems) {
        this.items = this.items.map((item) => {
            if(item.nid_i == nid && wishListItems > 0) {
                item.shortlist = 1
            } else if(item.nid_i == nid && wishListItems == 0) {
                item.shortlist = 0
            }
            return item;
        });
        this.setState({refreshFlag:1});
    }

    render() {
    const {width, height} = Dimensions.get('window');
        this._init()
        var _renderSeperator = (visible) => {
            if (visible)
                return (
                    <View style={this.separatorStyle} />
                )
        }
        var _renderItem = (item, index) => {

            if(this.props.isShortlist) {
                let key     = (item.nid && item.nid >0)? 'n': 'm';
                let itemId  = (item.nid && item.nid >0)? item.nid: item.mid;
                let label = ''

                if(item.featured_id_i) {
                    label = 'MUST SEE'
                } else if(item.field_exclusive_i) {
                    label = 'EdgeProp Only'
                }  
                return (
                    <View style={{ paddingBottom: 10 }}>
                        <ListingResult_ListItem
                            item={{
                                listingId: item.nid,
                                mid: item.mid,
                                s_id: item.s_id,    
                                //isBookmark: this._isArrayContain(this.props.bookmarkList, item.nid),
                                agentID: item.uid_i,
                                agentName: item.agent_name_s_lower,
                                agentNumber: item.agent_contact_s_lower,
                                agentImage: item.agent_profile_pic_s?item.agent_profile_pic_s:'https://sg.tepcdn.com/images/avatar.png',
                                proAgent: item.agentplan_s,
                                exclusive: item.exclusive?item.exclusive:'',
                                images: item.images,
                                askingPrice :item.price? item.price : '',                           
                                askingPriceType: '', 
                                title: item.title_t?item.title_t:'',
                                bedrooms: item.bed?item.bed:0 ,
                                bathrooms: item.bath?item.bath:0,
                                district: item.district?item.district:'',
                                streetName: '',
                                propertySubType: item.field_property_type_i ? item.field_property_type_i : '',
                                //askingPriceUnitPsf: item.field_prop_built_up_price_pu_d ? (item.field_prop_built_up_price_pu_d? (item.field_prop_built_up_price_pu_d? item.field_prop_built_up_price_pu_d: ''): ''): '',
                                //floorAreaSqm: item.field_prop_land_area_sqft ? (item.field_prop_land_area_sqft.und[0]? (item.field_prop_land_area_sqft.und[0].value? item.field_prop_land_area_sqft.und[0].value: ''): ''): '',
                                //floorAreaSqft: item.field_prop_built_up_d ? (item.field_prop_built_up_d? (item.field_prop_built_up_d? item.field_prop_built_up_d: ''): ''): '',
                                postalCode: '',
                                yearCompleted: '',
                                shortlisted: item.shortlist?true:false,
                                tenure: this._tenureValue(item.field_prop_lease_term),
                                belowEfvPercentage: '',
                                state: item.state?item.state:'',
                                isFeatured: item.featured_id_i?(item.featured_id_i > 0? true:false): false,
                                location: item.location_p?item.location_p:0,
                                shareKey: (item.nid_i && item.nid_i >0)? 'n': 'm',
                                sharePropertyId: (item.nid_i && item.nid_i >0)? item.nid_i: item.mid_i,
                                shareListingType: item.type_s == 'rent'?'rental':item.type_s,
                                changed: item.changed_i?item.changed_i:'',

                            }}
                            navigation={this.props.navigation}
                            isRelated={this.props.isRelated}
                            onPress={() => this._handleOnPressItem(item, index)}
                            //newLaunch = {this.props.newLaunch}
                        />
                        <View style={{zIndex: 999999, position: 'absolute', top: 20, left:10 }}>
                       <CheckBox
                            title=''
                            size={20}

                            uncheckedColor='#fff'
                            checkedColor='#488BF8'
                            checked={this.isChecked(Number(itemId),item.url)}
                            containerStyle={{paddingRight: 0, justifyContent: 'center', width:22, paddingTop:0, paddingBottom: 0, paddingLeft: 2, backgroundColor: '#fff', margin: 0, borderRadius: 0, borderWidth:0, borderColor: '#fff' }}
                            onPress={(e) => this.handleCheckbox(itemId, item.url)}
                        
                         />
                        </View>
                    <TouchableOpacity activeOpacity={1} style={{ position:'absolute', right: 30, top: 20 }} onPress={()=>this._deleteBookMark(item.id)}>
                    <Image 
                        style={{width: 26, height: 26}}
                        source={require('../../assets/icons/heart-booked.png')}
                    />
                    </TouchableOpacity>
                    {label != '' && (
                        <View style={{ position: 'absolute', left: 20, top: item.featured_id_i?(item.featured_id_i > 0? 150:110): 110, backgroundColor: 'rgba(0,0,0,0.5)', borderColor: '#FFF', paddingVertical: 0, paddingHorizontal: 5, borderWidth: 1.5, borderRadius: 5 }}>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Medium', color: '#FFF', fontSize: 11, marginHorizontal: 5, marginTop: 5, marginBottom: 1.5, lineHeight: 12 }}>{label}</Text>
                        </View>
                    )}
                    </View>
                )
            } else {
            //console.log('data f', item);
                let key     = (item.nid_i && item.nid_i >0)? 'n': 'm';
                let itemId  = (item.nid_i && item.nid_i >0)? item.nid_i: item.mid_i;
                let label = ''
                if(item.featured_id_i) {
                    label = 'MUST SEE'
                } else if(item.field_exclusive_i) {
                    label = 'EdgeProp Only'
                }

                return (
                <View style={{ paddingBottom: 25}}>
                  
                    <ListingResult_ListItem
                        item={{
                            listingId: item.nid_i,
                            isBookmark: this._isArrayContain(this.props.bookmarkList, item.nid_i),
                            agentID: item.uid_i,
                            agentName: item.agent_name_s_lower,
                            agentNumber: item.agent_contact_s_lower,
                            agentImage: item.agent_profile_pic_s?item.agent_profile_pic_s:'https://sg.tepcdn.com/images/avatar.png',
                            proAgent: item.agentplan_s,
                            exclusive: item.exclusive,
                            images: item.field_prop_images_txt,
                            askingPrice: item.field_prop_asking_price_d ? (item.field_prop_asking_price_d? (item.field_prop_asking_price_d? item.field_prop_asking_price_d: ''): ''): '',
                            askingPriceType: item.field_prop_asking_price_type_s_lower ? (item.field_prop_asking_price_type_s_lower? (item.field_prop_asking_price_type_s_lower? item.field_prop_asking_price_type_s_lower: ''): ''): '',
                            title: item.title_t,
                            bedrooms: item.field_prop_bedrooms_i ? (item.field_prop_bedrooms_i? (item.field_prop_bedrooms_i? item.field_prop_bedrooms_i: 0): 0): 0,
                            bathrooms: item.field_prop_bathrooms_i ? (item.field_prop_bathrooms_i? (item.field_prop_bathrooms_i? item.field_prop_bathrooms_i: 0): 0): 0,
                            district: item.district_s_lower?item.district_s_lower:'',
                            streetName: '',
                            propertySubType: item.field_property_type_i ? item.field_property_type_i : '',
                            askingPriceUnitPsf: item.field_prop_built_up_price_pu_d ? (item.field_prop_built_up_price_pu_d? (item.field_prop_built_up_price_pu_d? item.field_prop_built_up_price_pu_d: ''): ''): '',
                            floorAreaSqm: item.field_prop_land_area_sqft_d ? (item.field_prop_land_area_sqft_d? (item.field_prop_land_area_sqft_d? item.field_prop_land_area_sqft_d: ''): ''): '',
                            floorAreaSqft: item.field_prop_built_up_d ? (item.field_prop_built_up_d? (item.field_prop_built_up_d? item.field_prop_built_up_d: ''): ''): '',
                            postalCode: '',
                            yearCompleted: '',
                            shortisted: item.shortlist ? true : false,
                            tenure: this._tenureValue(item.field_prop_lease_term_s),
//                            tenure: 0,
                            belowEfvPercentage: '',
                            state: item.state_s_lower?item.state_s_lower:'',
                            isFeatured: item.featured_id_i?(item.featured_id_i > 0? true:false): false,
                            shareKey: (item.nid_i && item.nid_i >0)? 'n': 'm',
                            sharePropertyId: (item.nid_i && item.nid_i >0)? item.nid_i: item.mid_i,
                            shareListingType: item.type_s == 'rent'?'rental':item.type_s,
                            changed: item.changed_i

                        }}
                        navigation={this.props.navigation}
                        onUpdateBookmark={this.props.onUpdateBookmark}
                        onPress={() => this._handleOnPressItem(item, index)}
                        newLaunch = {this.props.newLaunch}
                       
                    />
                    <View style={{zIndex: 999999, position: 'absolute', top: 20, left: 10}}>
                       <CheckBox
                        title=''
                        size={20}

                        uncheckedColor='#fff'
                        checkedColor='#488BF8'
                        checked={this.isChecked(Number(itemId),item.url_s)}
                        containerStyle={{paddingRight: 0, justifyContent: 'center', width:22, margin: 0, paddingTop:0, paddingBottom: 0, paddingLeft: 2, backgroundColor: '#fff', borderRadius: 0, borderWidth:0, borderColor: '#fff' }}
                        onPress={(e) => this.handleCheckbox(itemId, item.url_s)}
                    
                     />
                    </View>
                    <TouchableOpacity activeOpacity={1} style={{ position:'absolute', right: 20, top: 18 }} onPress={()=>this._addingToBookmark(item.nid_i, item.mid_i, item.shortlist, item.s_id)}>
                    {item.shortlist ? 
                        (
                            <Image 
                                style={{width: 26, height: 26}}
                                source={require('../../assets/icons/heart-booked.png')}
                            />
                        ) : 
                        (   
                            <Image 
                                style={{width: 26, height: 26}}
                                source={require('../../assets/icons/bookmark_white_outline.png')}
                            />
                        )

                    }
                    
                    </TouchableOpacity>
                    {label != '' && (
                        <View style={{ position: 'absolute', left: 20, top: item.featured_id_i?(item.featured_id_i > 0? 150:110): 110, backgroundColor: 'rgba(0,0,0,0.5)', borderColor: '#FFF', borderWidth: 1.5, borderRadius: 5 }}>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Medium', color: '#FFF', fontSize: 11, alignItems: 'center', marginHorizontal: 5, marginTop: 5, marginBottom: 1.5, lineHeight: 12 }}>{label}</Text>
                        </View>
                    )}
                    {item.field_prop_images_txt && item.field_prop_images_txt.length >0 && (
                        <View style={{ position: 'absolute', right: 20, top: item.featured_id_i?(item.featured_id_i > 0? 150:110): 110, backgroundColor: '#fff', borderColor: '#FFF', paddingVertical: 0, paddingHorizontal: 5, borderWidth: 1.5, borderRadius: 5 }}>
                            <Text allowFontScaling={false} style={{ fontFamily: 'Poppins-Medium', color: '#4A4A4A', fontSize: 11, marginHorizontal: 3, marginTop: 4, marginBottom: 1.5, lineHeight: 13 }}>{item.field_prop_images_txt.length} PHOTOS</Text>
                        </View>
                    )}
                </View>
                )    
            }
            
        }

        var _renderRelatedItem = (item,i) => {            
            return (
                <TouchableOpacity onPress={() => this._handleOnPressItem(item, i)} key={i+item.id} style={{ flex:1, maxWidth: '50%' }}>
                <View style={styles.itemList} >
                    <View style={styles.imageContainer}>
                        <Image
                          style={{width: '100%', height: 100}}
                          source={{uri: item.field_prop_images_txt && item.field_prop_images_txt != ''?item.field_prop_images_txt[0]: imageUri}}
                        />
                    </View>
                    <View style={{flex: 2}}>
                        <Text allowFontScaling={false} style={styles.itemTitle}>{item.title_t?item.title_t:''}</Text>
                        <Text allowFontScaling={false}>{item.district_s_lower?item.district_s_lower:''} , {item.state_s_lower?item.state_s_lower:''}</Text>
                        <Text allowFontScaling={false}>{this._formatMoney(Math.trunc(item.field_prop_asking_price_d))}</Text>
                    </View>
                </View>
                </TouchableOpacity>
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

        
        return (
        <View style={[this.props.noTabs?(this.props.isShortlist?styles.shortListTabs:styles.listingItems):(this.props.isRelated?styles.bottomStyles:styles.relatedListing)]}>
            <View style={this.props.isShortlist?styles.shortlist: (this.props.isRelated? styles.bottomContainer: styles.parentContainer)} >
                <ShareHelper
                    ref={"share"}
                    message={"This property might interest you"}
                  />
                  <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation}
                  />
                  <BookmarkHelper
                  ref={"bookmarkHelper"}
                  navigation = {this.props.navigation}
                />
                {this.state.onEnquire && (
                    <EnquireModal
                        closeModal={this.closeModal}
                        checkedValues={this.state.checked}
                        userInfo={this.state.userInfo}
                    />
                )}
                {this.state.onBookmarkClick && (
                    <View>
                      <WishList
                        isPropertyList={true}
                        accesskey={this.state.userInfo.accesskey} 
                        userId={this.state.userInfo.uid}
                        nid={this.state.bookmarkNid}
                        mid={this.state.bookmarkMid}
                        modalVisible={this.state.onBookmarkClick} 
                        closeModal={this.closeWishlistModal}
                        handleChange={this.handleChange}
                        listType={this.props.listingType}
                        setSid = {this._setSid}
			            onRefresh={this.doNothing}
                      />
                    </View>
                )}

                {(this.items.length > 0 && !this.props.isRelated) &&
                   ( <FlatList style={[this.state.checked.length<=0?styles.listContainer:styles.shortlistOptions]}
                        data={this.items}
                        ref={"flatlist"}
                        removeClippedSubviews={true}
                        onMomentumScrollBegin = {()=>{
                            this.isScrolling = true
                        }}
                        initialNumToRender={10}
                        bounces={false}
                        ListFooterComponent={() => _renderFooter()}
                        renderItem={({ item, index }) => _renderItem(item, index)}
                        keyExtractor={(item, index) => item.nid_i?item.nid_i:item.nid}
                        bounces={false}
                        onEndReached={()=>{
                            if(this.isScrolling){
                                this._loadMore();
                            }
                        }}
                        onEndReachedThreshold={0.5}
                /> )}

                
                {this.props.isRelated && (
                        <View style={styles.itemContainer}> 
                            <FlatList style={{ zIndex: -1 }}
                              numColumns={2}
                              flexDirection={'column'}
                              data={this.props.relatedData}
                              renderItem={({ item, index }) => _renderRelatedItem(item, index)}
                              keyExtractor={(item, index) => item.id}
                              key={2}
                              scrollEnabled = {false}
                          />
                        </View>
                )}
            </View>
            {this.state.checked.length >0 && (
                <View  style={[this.props.noTabs?(this.props.isShortlist?styles.shortlistBottom:styles.searchTabs):styles.bottomIcons]}>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity style={{ flex: 1 }} onPress={this.onEnquire}>
                        <Text allowFontScaling={false} style={styles.optionsStyle}>Enquire</Text>
                      </TouchableOpacity>
                      <TouchableOpacity  style={{ flex: 1 }} onPress={this.onShare}>
                        <Text allowFontScaling={false} style={styles.optionsStyle}>Share</Text>
                      </TouchableOpacity>
                      <TouchableOpacity  style={{ flex: 1 }} onPress={this.onClearAll}>
                        <Text allowFontScaling={false} style={styles.optionsStyle}>Clear All</Text>
                      </TouchableOpacity>
                    </View>  
                </View>
                )}
            </View>    
        )
    }
}

export default ListingResult_List
