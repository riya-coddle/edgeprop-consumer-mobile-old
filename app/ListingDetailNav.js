import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    Linking
} from 'react-native'
import {TabNavigator, StackNavigator, HeaderBackButton} from 'react-navigation'
import ListingDetailTabNavigator from '../components/Common_TabNavigator/Common_TabNavigator.js'
import ListingDetailInfo from './ListingDetailInfo/ListingDetailInfo';
import Button from '../components/Common_Button/Common_Button';
import ListingDetailData from './ListingDetailData/ListingDetailData';
import ListingDetailLocation from './ListingDetailLocation/ListingDetailLocationNav';
import IconMenu from '../components/Common_IconMenu/Common_IconMenu.js'
import NavigationHelper from '../components/Common_NavigationHelper/Common_NavigationHelper.js'
import ShareHelper from '../components/Common_ShareHelper/Common_ShareHelper.js'
import BookmarkHelper from '../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import CommonTransparentModal from '../components/CommonTransparentModal/CommonTransparentModal'
import WishList from './WishlistModal/WishlistModal.js'
import PropertyTypeOptions from '../assets/json/Search_Data/PropertyTypeOptions.json'


const DELETE_API = 'https://alice.edgeprop.my/api/user/v1/shortlist-del';

var infoImg = require('../assets/icons/tabbar-icons/Info.png')
var activeInfoImg = require('../assets/icons/tabbar-icons/Info-blue.png')
var locationImg = require('../assets/icons/tabbar-icons/Location.png')
var activeLocationImg = require('../assets/icons/tabbar-icons/Location-blue.png')
var dataImg = require('../assets/icons/tabbar-icons/Data.png')
var activeDataImg = require('../assets/icons/tabbar-icons/Data-blue.png')
const {width, height} = Dimensions.get('window');

const itemMenu = {
    list: [
        {
            contentId: 1,
            txt: 'INFO',
            path: 'ListingDetailInfo',
            attachedImg: infoImg,
            activeImg: activeInfoImg,
        },
        {
            contentId: 2,
            txt: 'LOCATION',
            path: 'ListingDetailLocation',
            attachedImg: locationImg,
            activeImg: activeLocationImg,
        }/*,
        {
            contentId: 3,
            txt: 'DATA',
            path: 'ListingDetailData',
            attachedImg: dataImg,
            activeImg: activeDataImg,
        },*/
    ]
}

tabScreens = {
    ListingDetailInfo: {screen: ListingDetailInfo},
    ListingDetailLocation: {screen: ListingDetailLocation},
    //ListingDetailData: {screen: ListingDetailData},
}

const TabNav = TabNavigator(
  tabScreens,
  {
    tabBarComponent: (({navigation}) =>
        <ListingDetailTabNavigator
          backgroundColor={'rgb(248,248,248)'}
          textColor={'#4a4a4a'}
          activeTextColor={'#275075'}
          itemMenu={itemMenu}
          navigation={navigation}
        />),
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    initialRouteName: 'ListingDetailInfo', // set inital route
    lazy: true,
  }
)

const REFERER = Platform.OS;
const HOSTNAME = "https://prolex.edgeprop.my";
const PROXY_URL = "/proxy?url=";
const API_DOMAIN = "https://www.edgeprop.sg";
const API_DOMAIN_2 = "/api/v1/fetchOne";
// const API_GET_LISTING_DETAILS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/getListingDetail.php?");
const API_GET_LISTING_DETAILS_FULL = HOSTNAME + API_DOMAIN_2;
const API_WEBANALYTICS = "https://www.edgeprop.my/jwdalicia/api/webanalytics/v1/add/search";
const TIMEOUT = 1000;

class TabNavContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    var share_icon = require('../assets/icons/share.png');
    var bookmark_unselect_icon = require('../assets/icons/bookmark_white_outline.png');
    var bookmark_select_icon = require('../assets/icons/bookmark_pink.png');
    var { state, setParams } = navigation;
    var { params } = state
    var isBookmark = (params.data != undefined && params.data.isBookmark != undefined)? params.data.isBookmark: false
    var nid = params.data.nid
    return {
      header: null,
      headerLeft: <HeaderBackButton
        tintColor={"white"}
        onPress={() => {
          if(navigation.state.params.data.onBack != undefined){
            navigation.state.params.data.onBack();
          }
          navigation.goBack()
        }}
      />,
      headerRight: (
        <View style={
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingVertical: 5,
            paddingRight: 5
          }
        }>
          <IconMenu
            imageWidth={28}
            imageHeight={28}
            paddingVertical={10}
            paddingHorizontal={1}
            type={"icon"}
            imageSource={share_icon}
            onPress={() => params.shareNews()}
          />
          <View display={'none'} >
              <IconMenu
                imageWidth={28}
                imageHeight={28}
                paddingVertical={8}
                paddingHorizontal={1}
                type={"icon"}
                imageSource={isBookmark? bookmark_select_icon: bookmark_unselect_icon}
                onPress={() => {
                  if(params.updateBookmark!=undefined){
                    params.checkLogin(isBookmark)
                    // params.modalTransparant()
                    params.setModal(false)
                    // params.setBookmark(isBookmark)

                    // params.updateBookmark(nid, !isBookmark, params.checkBookmark)
                  }
              }} />
          </View>
        </View>
      ),
    };
  };
  agentInfo = {
    agentName : "",
    agentContact : "",
    agentImage : "",
    agencyName: "",
    regNumber: ""
  }
  siteURL = ""
  fullAPIReturn = false
  callBackHandleEnquiry = false

  didMount

  constructor(props) {
      super(props)
      //console.log('pro',props.navigation)
      this.state = {
        listingDetail : {},
        bookmarkList: [],
        bookmarkNid: 0,
        bookmarkMid: 0,
        onBookmarkClick: false,
        userInfo: {},
        webanalyticData: {
        },
        shortListed: false,
        showBottomNav: false,
        readCountStatus: false,
        onShortlist: this.props.navigation.state.params.data.shortlisted?this.props.navigation.state.params.data.shortlisted:false
      }
      this.navigation = props.navigation
      this.params = this.navigation.state.params
      this.nid = this.params.data.nid
      this.mid = this.params.data.mid,
      this.key = this.params.data.key
      this.property_id = this.params.data.property_id
      this.listing_type = this.params.data.listing_type
      this.modal = false
      var isBookmark = this.params.data.isBookmark || false
      this._shareNews = this._shareNews.bind(this);
      this._handleFullAPIReturn = this._handleFullAPIReturn.bind(this)
      this._handleEnquiry = this._handleEnquiry.bind(this)
      this._checkBookmark = this._checkBookmark.bind(this)
      this._setModal = this._setModal.bind(this)
      this._setBookmark = this._setBookmark.bind(this)
      this._checkLogin = this._checkLogin.bind(this)
      this._addingToBookmark = this._addingToBookmark.bind(this) 
      this.closeWishlistModal = this.closeWishlistModal.bind(this)
      this._refreshData = this._refreshData.bind(this)
      this._handleChange = this._handleChange.bind(this)
      this.checkShortList = this.checkShortList.bind(this)
      this.removeBookmark = this.removeBookmark.bind(this)
      this.onShortlistChange  = this.onShortlistChange.bind(this);
      this.doNothing = this.doNothing.bind(this)
      this._whatsapp = this._whatsapp.bind(this)
      this._formatMoney = this._formatMoney.bind(this)
      this.onBottomNavChange = this.onBottomNavChange.bind(this)
      this.callWebanalyticRead = this.callWebanalyticRead.bind(this)
      this._handleCollection = this._handleCollection.bind(this)
      this._prefixType = this._prefixType.bind(this)
      this._getLabel = this._getLabel.bind(this)
      this._callWebAPI = this._callWebAPI.bind(this)
  }

   async componentDidMount() {
      const auth = await AsyncStorage.getItem("authUser");  
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems })
        }
      }
      this.didMount = true
      this.modal = true
      let param = "type="+this.key+"&property_id="+this.property_id+"&field_prop_listing_type="+this.listing_type
      this._callAPI(API_GET_LISTING_DETAILS_FULL, "listingDetail", param)
      this._checkBookmark();
      this.navigation.setParams({
        shareNews: this._shareNews,
        checkBookmark: this._checkBookmark,
        updateBookmark: this.refs.bookmarkHelper._updateBookmark,
        modalTransparant : this.refs.menu._toggleMenu,
        setModal : this._setModal,
        setBookmark : this._setBookmark,
        checkLogin : this._checkLogin
      })
      this._refreshData()
    }

    callWebanalyticRead(res) {

      if(this.state.readCountStatus == false) {
        let result = res.result;
        let listing_type = result.field_prop_listing_type? (result.field_prop_listing_type.und? (result.field_prop_listing_type.und[0] ? result.field_prop_listing_type.und[0].value : ''): '') : '';
        let subType = result.field_property_type? (result.field_property_type.und? (result.field_property_type.und[1] ? result.field_property_type.und[1].target_id : ''): '') : '';
        let subTypeLabel =this._getLabel(this._prefixType(subType),this._handleCollection('sub',PropertyTypeOptions));
        subType = subTypeLabel? subTypeLabel: '';

        this.setState({
          webanalyticData: {
                        agentname: res.agent.agent_name,
                        district: result.district,
                        edge2k19: true,
                        listing_type: listing_type,
                        property_type: subType,
                        pid: result.nid,
                        referer: REFERER,
                        state: result.state,
                        origin: "mobile"
                     }
        });

        this.setState({
          readCountStatus: true
        });   
        this._callWebAPI('none');
        
      }
    }


    _callWebAPI(type) {

      let data = this.state.webanalyticData;
      data = {...data, ...{agentaction:type}};

      fetch(API_WEBANALYTICS,
        {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).
        then((response) => {
          console.log('count res ', response)
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
   
    _whatsapp() {
      let price = typeof(this.props.navigation.state.params.data.askingPrice) == 'string' ? this.props.navigation.state.params.data.askingPrice : this._formatMoney(Math.round(this.props.navigation.state.params.data.askingPrice));
      var message = "I am interested in "+this.state.listingDetail.title+", " +this.props.navigation.state.params.data.area+ " @ " +price+ " in EdgeProp.my. Kindly acknowledge. Thank you! \n"+this.siteURL+""
      //console.log("message", message);
      var contact = '+6'+ this.agentInfo.agentContact;
      this._callWebAPI('mobWhatsapp');
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

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }
    
    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _handleChange(val,length) {
        if(length > 0) {
            this.onShortlistChange(true)
        } else {
            this.onShortlistChange(false)
        }
    }
  
  removeBookmark(nid,mid) {
    
    /*fetch(DELETE_API, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.state.userInfo.uid+"&key="+this.state.userInfo.accesskey+"&id="+id // <-- Post parameters        })
      }).then((response) => response.json())
      .then((responseText) => {
        //console.log(responseText);
        this.setState({ onShortlist: false, listingDetail: {} },()=>this._refreshData())
      })
      .catch((error) => {
          console.error(error);
      });*/
      this.setState({ bookmarkMid : mid , bookmarkNid: nid , onBookmarkClick: true })
  } 

  doNothing() {
    console.log('ref'); 
   }


  _refreshData() {//console.log('abcd')
    let param = "type="+this.key+"&property_id="+this.property_id+"&field_prop_listing_type="+this.listing_type+"&cache=0"
      this._callAPI(API_GET_LISTING_DETAILS_FULL, "listingDetail", param)
  }

  _addingToBookmark(nid,mid) {
    const { userInfo } = this.state;
      if(userInfo.uid != 0) {
        this.setState({ bookmarkNid: nid , bookmarkMid: mid, onBookmarkClick: true },
          ()=>console.log(this.state))
      } else {
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
      }
    }

  _checkBookmark(){
    this.refs.bookmarkHelper._getBookmarks((nids)=>{
      if(nids!=undefined && Array.isArray(nids)){
        flag=nids.indexOf(this.nid)>-1
        this.navigation.setParams({
          data: {...this.params.data,...{
            isBookmark: flag
          }}
        })
        if(this.didMount && JSON.stringify(nids)!=JSON.stringify(this.state.bookmarkList.toString)){
          this.setState({
            bookmarkList: nids
          })
        }
      }
    });
    // this.refs.menu._toggleMenu()
    if(this.modal != true){
        this.refs.menu._toggleMenu()
    }
  }

  closeWishlistModal() {
        this.setState({ bookmarkNid: 0 , bookmarkMid: 0, onBookmarkClick: false })
        this._refreshData();
        //console.log('pfd',this.props.navigation.state.params)
    }

  _checkLogin(isBookmark){
      this.refs.bookmarkHelper._checkLogin(
          ()=>{
              this.refs.menu._toggleMenu()
              this.navigation.setParams({
                data: {...this.params.data,...{
                  isBookmark: isBookmark ? false : true
                }}
              })
              this.refs.bookmarkHelper._updateBookmark(this.nid, !isBookmark, this._checkBookmark)

          },
          ()=>{
              // console.log('ian 12345');
              // this.refs.bookmarkHelper._updateBookmark(this.props.nid, !this.state.isBookmark, this._checkBookmark)
              Alert.alert(
                "Login Required",
                "This feature requires login, do you want to login?",
                [
                  {text: 'Yes', onPress: () => {
                   
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
  }

  _setModal(modal){
      this.modal = modal
  }
  _setBookmark(isBookmark){
      this.navigation.setParams({
        data: {...this.params.data,...{
          isBookmark: isBookmark ? false : true
        }}
      })
  }

  componentWillUnmount(){
    this.didMount = false
      if(this.props.navigation.state.params.data._handleBack){
           this.props.navigation.state.params.data._handleBack();
      }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(JSON.stringify(nextProps.navigation.state.index) != JSON.stringify(this.props.navigation.state.index)){
  //     return true
  //   }
  //   else if(JSON.stringify(nextProps.navigation.state.params) != JSON.stringify(this.props.navigation.state.params)){
  //     return true
  //   }
  //   else if(JSON.stringify(nextState.bookmarkList) != JSON.stringify(this.state.bookmarkList)){
  //     return true
  //   }
  //   return(JSON.stringify(nextState.listingDetail)!=JSON.stringify(this.state.listingDetail))
  // }

  _shareNews() {
    var aliasURL = this.siteURL
    this.refs.share._share(aliasURL);
  }

  _handleEnquiry(){
    this.refs.navigationHelper._navigate('Enquiry', {
      data: {
        agentInfo: this.agentInfo,
        aliasURL: this.siteURL,
        nid: this.state.listingDetail.property_id,
        listingType: this.state.listingDetail.listing_type,
        key: this.state.listingDetail.key,
        title: this.state.listingDetail? (this.state.listingDetail.title? this.state.listingDetail.title : '') : '',
        propertyDetails: this.props.navigation.state.params.data,
        callWebAPI: this._callWebAPI,
      }
    })
  }



  _handleFullAPIReturn(data){
   // console.log('_handleFullAPIReturn',data)
    this.fullAPIReturn = true
    this.agentInfo = {
      agentName: data.name,
      agentContact: data.phoneNumber,
      agentImage: data.image,
      agencyName: data.agencyName,
      regNumber: data.regNumber
    }
    this.siteURL = data.url
    if(this.callBackHandleEnquiry){
      this._handleEnquiry();
      this.callBackHandleEnquiry = false
    }
  }

  _callAPI(apiUrl, stateName, params) {

    //console.log('para',params, 'a',this.state.userInfo.accesskey)
    if (!this.state[stateName].results) {
      fetch(apiUrl,
      {
          //method: 'GET', timeout: TIMEOUT
          method: 'POST',
          headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded', 'Authentication': this.state.userInfo.accesskey}),
          body: params
      }).
      then((response) => {
        console.log('fff ', response)
        return response.json()
      }).
      then((responseJson) => {
          if (responseJson) {

            if(this.didMount){
              let result = responseJson.result
              //console.log('fd', responseJson)
              let locationDetails = {
                  title: result.title?result.title:'',
                  agentID: result ?(result.uid ? result.uid : 0) : 0,
                  lat: result.field_geo_lat_lng? (result.field_geo_lat_lng.und? (result.field_geo_lat_lng.und[0] ? Number(result.field_geo_lat_lng.und[0].lat) : 0): 0) : 0,
                  lon: result.field_geo_lat_lng? (result.field_geo_lat_lng.und? (result.field_geo_lat_lng.und[0] ? Number(result.field_geo_lat_lng.und[0].lng) : 0): 0) : 0,
                  listing_type: result.field_prop_listing_type? (result.field_prop_listing_type.und? (result.field_prop_listing_type.und[0] ? result.field_prop_listing_type.und[0].value : ''): '') : '',
                  property_id: this.property_id,
                  key: this.key
              }
              if(stateName == 'listingDetail' && responseJson.result.nid != null) {
                this.callWebanalyticRead(responseJson);
              }
              //console.log('locationDetails',locationDetails);
                this.setState({
                    [stateName]: locationDetails,
                });
                //console.log(responseJson.shortlist)
                if(typeof responseJson.shortlist != undefined) {
                  this.setState({ shortListed:responseJson.shortlist })
                  this.setState({ onShortlist:responseJson.shortlist })
                }
            }
          }
      })
      .catch((error) => {
          console.log('dfgdfgfd', error);
      });
    }
  }
  
  checkShortList(val) {
    if(this.props.navigation.state.params && this.props.navigation.state.params.onGoBack() != undefined) {
      this.props.navigation.state.params.onGoBack()
    //console.log('test')
    }
  }

  onBottomNavChange(val) {
    this.setState({ showBottomNav : val})
  }

  onShortlistChange(val) {
    //console.log('d',val)
    this.setState({ onShortlist : val , shortListed : val })
  }

  render() { //re.log('props',this.props.navigation.state.params.data);
    let hideAgent = ["65632", "73634"];
    let displayAgent = true;
    if(hideAgent.indexOf(this.state.listingDetail.agentID) != -1) {
      displayAgent = false;
    }

    return (
      <View style={{flex: 1}}>
        <CommonTransparentModal ref={"menu"} navigation={this.props.navigation} />
        <NavigationHelper
          ref={"navigationHelper"}
          navigation={this.props.navigation}
        />
        <ShareHelper
          ref={"share"}
        />
        <BookmarkHelper
          ref={"bookmarkHelper"}
          navigation = {this.props.navigation}
        />
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
                handleChange={this._handleChange}
                listType={this.listing_type}
                onRefresh={this.doNothing}
              />
            </View>
        )}
        <ListingDetailInfo
          screenProps = {{...this.props.screenProps,...{
            data: {
              fastAPI: this.state.listingDetail,
              handleFullAPIReturn: this._handleFullAPIReturn,
              bookmarkList: this.state.bookmarkList,
              checkBookmark: this._checkBookmark,
              shortlist: this.state.shortListed,
            }
          }}}
          navigation = {this.props.navigation}  
          handleRemove={this.checkShortList}
          onShortlistChange={this.onShortlistChange}
          addBookMark={this._addingToBookmark}
          removeBookMark={this.removeBookmark}
          itemId={this.props.navigation.state.params.data.itemId}
          onBottomNavChange={this.onBottomNavChange}
        />
        <View style={{ 
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent"
        }}>
          <Button
            textValue={"ENQUIRE NOW"}
            textSize={15}
            fontFamily={"Poppins-SemiBold"}
            // fontWeight = {"600"}
            onPress={()=>{
              if(this.fullAPIReturn){
                this._handleEnquiry()
              }
              else{
                this.callBackHandleEnquiry = true
              }
            }}
          />
          {this.state.showBottomNav && (
            <View style={buttonContainer.container}>
                 {this.state.onShortlist ?
                  (
                  <TouchableOpacity
                   onPress={() => { 
                    this.removeBookmark(this.nid, this.mid)
                  }}> 
                    <View style={twoButtons.buttonOne}>
                        <Image 
                          style={{width: 21, height: 21, marginLeft: 2}}
                          source={require('../assets/icons/heart_selected.png')}
                      />
                      
                    </View>
                  </TouchableOpacity> 
                  ) : (
                  <TouchableOpacity
                   onPress={() => { 
                       this._addingToBookmark(this.nid, this.mid)
                  }}> 
                      <View style={twoButtons.buttonOne}>
                          <Image 
                            style={{width: 21, height: 21, marginLeft: 2}}
                            source={require('../assets/icons/bookmark_white_outline.png')}
                        />
                        
                      </View>
                   </TouchableOpacity> 
                  )}

                 <TouchableOpacity style={{flex: 1 }} onPress={()=>{
                      if(this.fullAPIReturn){
                        this._handleEnquiry()
                      }
                      else{
                        this.callBackHandleEnquiry = true
                      }
                    }}> 
                     <View style={twoButtons.buttonTwo}>
                        <Text allowFontScaling={false} style={twoButtons.buttonText}>
                            CONTACT AGENT
                       </Text>
                      </View>
                 </TouchableOpacity>
                 { displayAgent && (
                 <TouchableOpacity onPress={()=>{
                        this._whatsapp()
                    }}> 
                     <View style={twoButtons.buttonThree}>
                        <Image 
                          style={{width: 21, height: 21}}
                          source={require('../assets/icons/whatsapp.png')}
                      />
                      </View>
                 </TouchableOpacity>
                )}
             </View>
             )}
        </View>
      </View>
    )
  }
}

const buttonContainer = StyleSheet.create({
    buttonText: {
       color: '#fff',
       fontWeight: '500',
       fontSize: width * 0.045,
    },
    buttonOne: {
      borderRadius: 4,
      backgroundColor: '#FF6670',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      color: '#fff',
      marginRight: 12,
      height: 60,width: width * 0.15,
     },
     buttonTwo: {
      borderRadius: 4,
      backgroundColor: '#3993D7',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      color: '#fff',
      height: 60
     },
     buttonThree: {
      borderRadius: 4,
       backgroundColor: '#59B77E',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      color: '#fff',
      height: 60,
      width: width * 0.15,
     },
     container: {
     flexDirection: 'row',
     paddingTop: 7,
     paddingBottom: 7,
     paddingLeft:10,
     paddingRight:10,
     backgroundColor: 'transparent',
      }

});

const twoButtons = StyleSheet.create({
      buttonText: {
       color: '#fff',
       fontFamily: 'Poppins-SemiBold',
       fontWeight: '400',
       fontSize: width * 0.038,
       ...Platform.select({
          ios: {
            fontWeight: '600',
          }
        })
      },
      buttonTextOne: {
       paddingLeft: 5,
       color: '#fff',
       fontFamily: 'Poppins-SemiBold',
       fontWeight: '400',
       fontSize: width * 0.038,
       ...Platform.select({
          ios: {
            fontWeight: '600',
          }
        })
     },
    buttonOne: {
      borderRadius: 4,
      height: 50, 
      backgroundColor: '#ff5a5f',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      color: '#fff',
      marginRight: 11,
      width: width * 0.2
     },
     buttonTwo: {
      borderRadius: 4,
      height: 50, 
      backgroundColor: '#488bf8',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
     },
     buttonThree: {
      borderRadius: 4,
      height: 50, 
      backgroundColor: '#27ae60',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      marginLeft: 11,
      width: width * 0.2,
     }
});

TabNavContainer.router = TabNav.router

export default TabNavContainer