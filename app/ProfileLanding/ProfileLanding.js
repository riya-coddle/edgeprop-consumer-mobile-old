import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    NetInfo,
    ActivityIndicator,
    TouchableOpacity,
    AsyncStorage,
    BackHandler,
    Linking
} from 'react-native'
import firebase from 'react-native-firebase';
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import Home_List from '../../components/Home_List/Home_List'
import LandingHighlight from '../../components/Common_LandingHighlight/Common_LandingHighlight.js'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js'
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList'
import Common_Menu from '../../components/Common_Menu/Common_Menu'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import BookmarkHelper from '../../components/Common_BookmarkHelper/Common_BookmarkHelper.js'
import Common_Loading from '../../components/Common_Loading/Common_Loading'
import CommonTransparentModal from '../../components/CommonTransparentModal/CommonTransparentModal'
import Loading from '../../components/Common_Loading/Common_Loading'
import SignUpLanding from '../../app/SignUpLanding/SignUpLanding.js'
import AppNav from '../../app/AppNav'
import styles from './ProfileStyle.js'
import { NavigationActions} from 'react-navigation'

const anonymousUser = {
  accesskey: "",
  name: "Anonymous User",
  status: 1,
  uid: 0,
}
const HOSTNAME = "https://www.edgeprop.sg";
const PROXY_URL = "/proxy?url=";
const API_LOGOUT = 'https://alice.edgeprop.my/api/user/v1/logout'
const API_DOMAIN = "https://www.edgeprop.sg";
const API_DOMAIN_2 = "https://api.theedgeproperty.com.sg";
const API_GET_LISTING_DETAILS = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN + "/tep-solr/api/getListingDetail.php?");
const API_GET_LISTING_DETAILS_FULL = HOSTNAME + PROXY_URL + encodeURIComponent(API_DOMAIN_2 + "/listings/getlistingdetailsfull?type=web");
const TIMEOUT = 1000;

class ProfileLanding extends Component {
     dataMenu = {
        "MenuItem": [{
                "title": "Bookmarks",
                "accordion": "search",
                "icon": "Bookmarks",
                "MenuItem": [],
                "screen": "ListingBookmarks"
            }]
    }
    constructor(props) {
      super(props);
      this.state = {
          listingResult: {},
          total : 0,
          isLogin : false,
          userInfo: {},
          itemLoaded: false,
          logout: false,
          timePassed: false,
          asycCheck: 0
          
      }
      this._onLogout = this._onLogout.bind(this)
      this.editEmail = this.editEmail.bind(this)
      this.refresh = this.refresh.bind(this)
      this.editUserName = this.editUserName.bind(this)
      this.myShortList = this.myShortList.bind(this)
      this.editPassword = this.editPassword.bind(this)
      this.mySavedSearch = this.mySavedSearch.bind(this)
      this.onChatPress = this.onChatPress.bind(this)
      this.setTimePassed = this.setTimePassed.bind(this)
      this._onLogout1 = this._onLogout1.bind(this)
      this._setLoader = this._setLoader.bind(this);
     /* this._onPressItem = this._onPressItem.bind(this);
      this._callAPI = this._callAPI.bind(this);
      this._handleBack = this._handleBack.bind(this)
      this._handleClose = this._handleClose.bind(this);
      this.listingDetailURL = ''
      this.listingData = []
      this.bookmarkList = []*/
      
    }

    onChatPress() { //console.log(this.state)
      const contact = '60173686061';
      const message = '';
      const urlWhatsApp = `whatsapp://send?text=${message}&phone=${contact}`;
      //console.log(urlWhatsApp);
      Linking.canOpenURL(urlWhatsApp).then(supported => {
        if (!supported) {
          Alert.alert('Please check whether WhatsApp is installed');
        } else {
          Linking.openURL(urlWhatsApp);
        }
      });
    }

    myShortList() {
      this.refs.navigationHelper._navigateInMenu("MyShortLists", {
        data: this.state.userInfo,
         onGoBack: this.refresh
       })
    }

    mySavedSearch() {
      this.refs.navigationHelper._navigateInMenu("MySavedSearch", {
        data: this.state.userInfo,
         onGoBack: this.refresh
       })
    }

    editPassword() {
      this.refs.navigationHelper._navigateInMenu("PasswordUpdate", {
         data: this.state.userInfo,
         onGoBack: this.refresh
       })
    }

    editUserName() {
      this.refs.navigationHelper._navigateInMenu("UsernameUpdate", {
         data: this.state.userInfo,
         onGoBack: this.refresh
       })
    }
    
    editEmail() {
      this.refs.navigationHelper._navigateInMenu("EmailUpdate", {
         data: this.state.userInfo,
         onGoBack: this.refresh
       })
    }

    async _onLogout1() {
      this._setLoader(0);
      setTimeout( () => {
        console.log("Logout 1sec");
         this.setTimePassed();
         this._onLogout();
      },1000);
    }

    async _onLogout() {
      
        if(AsyncStorage.clear()){

          //console.log('logout ing');
          fetch(API_LOGOUT, {
            method: 'POST',
            headers: new Headers({
                     'Accept' : 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: "key="+this.state.userInfo.accesskey+"&uid="+this.state.userInfo.uid // <-- Post parameters        })
          }).then((response) => response.json())
          .then((responseText) => {
              this.setState({ logout: true, userInfo: {} }) 
              AsyncStorage.setItem( 'authUser', JSON.stringify( anonymousUser ) );
             this.refs.navigationHelper._navigate('HomeLanding', {
                 data: {},
                _handleBack: this._handleBack,
                _handleClose: this._handleClose
              })
          })
          .catch((error) => {
              console.error(error);
          });
        }
        
        //  this.setState({ logout: true, userInfo: {} })  
        
    }

    setTimePassed() {
       this.setState({timePassed: true});
    }

    _setLoader(flag) {console.log('flag',flag);
      this.setState({ asycCheck: 1 });
    }
    
   /* _onPressItem(item, screen) {
        if (screen != undefined){
            this.refs.navigationHelper._navigateInMenu(screen, {
              title: screen,
              data: this.listingData,
              _handleBack: this._handleBack,
              bookmarkList : this.bookmarkList
            });
        }

    }
    _handleClose(param){
        if(param!=undefined){
            this.refs.navigationHelper._navigate('HomeLanding', {
              data: {}
            })
        }
    }
    _handleBack(){
        this.listingData = []
        this.refs.bookmarkHelper._getBookmarks((nids)=>{
            this.setState({
                total: nids.length,
                isLogin: true
            })
            for(i=0; i<nids.length; i++){
                this._changeURL(nids[i])
                this._callAPI(this.listingDetailURL);
            }
        });
    }*/

    refresh() {
      this.componentDidMount()
    }

    
     async componentDidMount() {

      const auth = await AsyncStorage.getItem("authUser");
      let authItems = JSON.parse(auth);
      if(authItems.uid != 0 && this.state.userInfo.uid != 0) {
        console.log("authItems",authItems)
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems, itemLoaded: true })
        }  
      } else {
        if(this.refs.bookmarkHelper != undefined){
            // _callGetBookmarks(uid, this.refs.bookmarkHelper._getBookmarks())
            // this.refs.bookmarkHelper._updateBookmark(this.props.nid, !this.state.isBookmark, this._checkBookmark)
            this.refs.bookmarkHelper._checkLogin(
                ()=>{
                    this.setState({
                        isLogin: true, itemLoaded: true
                    })
                    // this.state.isLogin = true
                    this.refs.bookmarkHelper._getBookmarks((nids)=>{
                        if(this.state.total != nids.length){
                            this.setState({
                                total: nids.length,
                            })
                        }
                        console.log(this.state.total,'tot');
                        for(i=0; i<nids.length; i++){
                            this.bookmarkList.push(nids[i])
                            this._changeURL(nids[i])
                            this._callAPI(this.listingDetailURL);
                        }
                    });
                },
                ()=>{
                   //this.setState({ itemLoaded: true })
                   this.refs.navigationHelper._navigate('SignUpLanding', {
                       data: {'isProfile': true},
                      _handleBack: this._handleBack,
                      _handleClose: this._handleClose

                    })
               }
           );

       }
    }
  }

  componentWillReceiveProps(nextProps){
      console.log("componentWillReceiveProps");
      if(this.state.userInfo.uid == 0) {
        console.log("this.state",this.state);
        if(this.nextProps != this.props){
            this.listingData = []
            this.bookmarkList = []

            this.refs.bookmarkHelper._checkLogin(
                (uid)=>{
                    this.setState({
                        isLogin: true, itemLoaded: true
                    })
                    this.refs.modal._toggleMenu()
                    this.refs.bookmarkHelper._callGetBookmarks(uid, ()=>{
                      console.log('successfully')
                      this.refs.bookmarkHelper._getBookmarks((nids)=>{
                          if(this.state.total != nids.length){
                              this.setState({
                                  total: nids.length,
                              })
                          }
                          for(i=0; i<nids.length; i++){
                              this.bookmarkList.push(nids[i])
                              this._changeURL(nids[i])
                              this._callAPI(this.listingDetailURL);
                          }
                          this.refs.modal._toggleMenu()
                      }),
                      ()=>{
                      console.log('fail');
                      }
                    })


                },
                ()=>{
                    this.setState({
                        isLogin: false,
                    })
                    this.refs.navigationHelper._navigate('SignUpLanding', {
                       data: {'isProfile': true},
                      _handleBack: this._handleBack,
                      _handleClose: this._handleClose
                    })
                }
            );
        }
      } else {
        console.log("cccc");
        this.componentDidMount();
      }

    }

    // _changeURL(id) {
    //     this.listingDetailURL = API_GET_LISTING_DETAILS_FULL + encodeURIComponent('&nid='+id)
    // }

    // _constructData(result) {
    //     let listingResult = {
    //         listing_id: result.nid,
    //         // isBookmark: this._isArrayContain(this.props.bookmarkList, item.listing_id),
    //         agent_name: result.agent_name,
    //         agent_photo: result.agent_image,
    //         agent_mobile: result.agent_contact,
    //         // exclusive: result.exclusive,
    //         images: result.images,
    //         asking_price: result.asking_price,
    //         askingPriceType: result.asking_price_type,
    //         title: result.title,
    //         bedrooms: result.bedrooms,
    //         bathrooms: result.bathrooms,
    //         district_name: result.asset_district,
    //         street_name: result.asset_street_name,
    //         propertySubType: result.property_sub_type_id,
    //         asking_unit_price_psf: result.price_pu_raw,
    //         floor_area_sqft: result.land_area_raw,
    //         // floorAreaSqm: result.floor_area_sqm,
    //         // postalCode: result.postal_code,
    //         // yearCompleted: result.year_completed,
    //         // tenure: result.tenure,
    //         // belowEfvPercentage: result.below_efv_percentage,
    //     }
    //     // this.setState({
    //     //     listingResult: listingResult,
    //     // })
    //     this.listingData.push(listingResult)
    // }

    // _callAPI(apiUrl, stateName) {
    //     fetch(apiUrl,
    //         {
    //             method: 'GET', timeout: TIMEOUT
    //         }).
    //         then((response) => response.json()).
    //         then((responseJson) => {
    //             if (responseJson) {
    //                 // console.log(responseJson,'log');
    //                 this._constructData(responseJson.response)
    //                 }
    //             })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }


    render() {

        return (
            <View style={{ flex: 1 }}>
            {this.state.asycCheck == 1 && (
              <Loading opacity={0.5} />
            )}
              <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation}
                  />
                <BookmarkHelper
                  ref={"bookmarkHelper"}
                  navigation = {this.props.navigation}
                />
                <CommonTransparentModal ref={"modal"} navigation={this.props.navigation} />
                    
              {!this.state.itemLoaded && (
                <Loading/>
              )}
            {this.state.itemLoaded && (
              <ScrollView style={styles.container}>
                <Text allowFontScaling={false} style={styles.userTitle}>{this.state.userInfo.name?this.state.userInfo.name:''}</Text>
                <TouchableOpacity onPress={this.editEmail}>
                  <View style={styles.itemContainer}>
                      <View>
                        <Text allowFontScaling={false} style={styles.itemText}>Email</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <View style={{ marginRight: 10, width: '75%', textAlign: 'center' }}>
                          <Text allowFontScaling={false} style={styles.itemValue} numberOfLines = { 1 } ellipsizeMode = 'middle'>{this.state.userInfo.email?this.state.userInfo.email:''}</Text>
                        </View>
                        <View style={{flexShrink: 0}}>
                          <Image
                            style={{ width: 16, height: 16,}}
                             source={require('../../assets/icons/info-arrow.png')}
                          />
                        </View>
                      </View>  
                  </View>
                </TouchableOpacity>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={this.editUserName}>
                  <View style={styles.itemContainer}>
                      <View>
                        <Text allowFontScaling={false} style={styles.itemText}>Username</Text>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <View style={{ marginRight: 10, width: '60%', textAlign: 'center' }}>
                          <Text allowFontScaling={false} style={styles.itemValue} numberOfLines = { 1 } >{this.state.userInfo.name?this.state.userInfo.name.split(" ")[0]:''}</Text>
                        </View>
                        <View>
                          <Image
                            style={{ width: 16, height: 16 }}
                             source={require('../../assets/icons/info-arrow.png')}
                          />
                        </View>
                      </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={this.editPassword}>
                  <View style={styles.itemContainer}>
                      <View>
                        <Text allowFontScaling={false} style={styles.itemText}>Password</Text>
                      </View>
                      <View>
                        <Image
                            style={{ width: 16, height: 16 }}
                             source={require('../../assets/icons/info-arrow.png')}
                          />
                      </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.separator}/>

                <TouchableOpacity onPress={this.myShortList}>
                  <View style={styles.itemContainer}>
                      <View>
                        <Text allowFontScaling={false} style={styles.itemText}>My Shortlists</Text>
                      </View>
                      <View>
                        <Image
                            style={{ width: 16, height: 16 }}
                             source={require('../../assets/icons/info-arrow.png')}
                          />
                      </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.separator}/>
                 <TouchableOpacity onPress={this.mySavedSearch}>
                  <View style={styles.itemContainer}>
                      <View>
                        <Text allowFontScaling={false} style={styles.itemText}>My Saved Search</Text>
                      </View>
                      <View>
                        <Image
                            style={{ width: 16, height: 16 }}
                             source={require('../../assets/icons/info-arrow.png')}
                          />
                      </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={this.onChatPress}>
                  <View style={styles.itemContainer}>
                      <View>
                        <Text allowFontScaling={false} style={styles.itemText}>Live Chat</Text>
                      </View>
                      <View>
                        <Image
                            style={{ width: 16, height: 16 }}
                             source={require('../../assets/icons/info-arrow.png')}
                          />
                      </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.separator}/>
                <View style={{ paddingTop: 125, paddingBottom: 50 }}>
                  <TouchableOpacity style={{ marginTop:-60 }} onPress={()=> this._onLogout1()}>
                    <Text allowFontScaling={false} style={styles.logout}>Logout</Text>
                  </TouchableOpacity>
                </View>
                <Text>Version 3.0.3</Text>
              </ScrollView>
              )}
            </View>
        );
      
    }
}

export default ProfileLanding
