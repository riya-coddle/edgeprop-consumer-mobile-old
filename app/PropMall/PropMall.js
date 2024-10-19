import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    Modal,
    Linking,
    NetInfo,
    Dimensions,
    ImageBackground,
    AsyncStorage,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import AppStateChange from '../../components/AppStateChange/AppStateChange'
import TenureOptions from '../../assets/json/Search_Data/TenureOptions.json'
import styles from './PropMallStyle.js'

const API_GET_STATES = "https://www.edgeprop.my/jwdsonic/api/v1/propmall/getstates"
const API_PROPMALL = "https://www.edgeprop.my/jwdsonic/api/v1/propmall/get-featured"
const API_GET_PROJECTS = "https://www.edgeprop.my/jwdsonic/api/v1/propmall/get-projects"

const filter = [
  { label: 'All' , value: 'all' },
  { label: 'Price Low to High' , value: 'price_asc' },
  { label: 'Price High to Low' , value: 'price_desc' }
];

const getImages = [
// image: require('../../assets/images/discover-1.png')},
  //{ image: require('../../assets/images/discover-2.png')},
 // { image: require('../../assets/images/discover-3.png')},
];

const PAGE_SIZE = 10;

const {width, height} = Dimensions.get('window');
class PropMall extends Component {
  isScrolling = false
    constructor(props) {
        super(props);
        this.state = {
          featuredprojects: [],
          stateprojects: [],
          getProjects: [],
          sortBy: filter[0].value,
          selectedState: 'all',
          category: [],
          toggleLoader: false,
        }
        this.orderBy = this.state.sortBy;  
        this.onChangeText = this.onChangeText.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this._changeCategoryURL = this._changeCategoryURL.bind(this);
        this._handleNoData = this._handleNoData.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.pageCount = 0;
        this.totalPage = 1;
        this.totalListing = -1;
        this._formatNumber = this._formatNumber.bind(this);
        this.propDetails = this.propDetails.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     isFocused: nextProps.screenProps.tabKey == this.navigation.state.key
        // })
    }
    
    async componentDidMount() {
      this._callAPI(API_PROPMALL, "propmall");
      this._callAPI(API_GET_STATES, "getstates");
      this._callAPI(API_GET_PROJECTS, "getprojects");
      this.setState({ getProjects: [], toggleLoader: true })
    }

    componentWillUnmount() {
       // this.messageListener();
    }

    

    _navigateDetails() {
       //this.refs.navigationHelper._navigate('PropMallDetail')
       
       this.refs.navigationHelper._navigateInMenu("PropMallDetail", {})
    }
    

    _handleFirstConnectivityChange(isConnected, apiUrl, stateName) {
    	if (isConnected) {
    	   this._sendAPIRequest(apiUrl, stateName);
      }
      NetInfo.isConnected.removeEventListener('connectionChange', (isConnected)=>this._handleFirstConnectivityChange(isConnected, apiUrl, stateName));
    }

    _callAPI(apiUrl, stateName) {
      if (Platform.OS === 'ios') {
      	NetInfo.isConnected.addEventListener('connectionChange', (isConnected)=>this._handleFirstConnectivityChange(isConnected, apiUrl, stateName));
      }
      else {
      	NetInfo.isConnected.fetch().then(isConnected => {
        	if (isConnected) {
          	 this._sendAPIRequest(apiUrl, stateName);
       	  }
        });
      }
    }
    
    refresh() {
      this.componentDidMount();
    }

    _sendAPIRequest(apiUrl, stateName){
      //console.log('apiUrl',apiUrl, stateName);
      var obj = [];
      var myArr = {};
      if (stateName != '') {
          fetch(apiUrl,
          {
              method: 'GET',
          }).
          then((response) => response.json()).
          then((responseJson) => {
           // console.log("responseJson",responseJson);
              if (responseJson && responseJson.property && stateName == 'propmall') {
                if(responseJson.property.length > 0) {
                  this.setState({ featuredprojects : responseJson.property })
                }
              }

              if (responseJson && responseJson.states) {
                if(responseJson.states.length > 0) {
                  this.setState({ stateprojects : responseJson.states })
                }
              } 

              if (responseJson && responseJson.property && stateName == 'getprojects') {
                if(responseJson.property.length > 0) {
                  if (this.totalListing != responseJson.found) {
                      this.totalListing = responseJson.found
                  }
                 ///// console.log("czcvxcvxvx");
                  this.totalPage = Math.floor(this.totalListing / PAGE_SIZE);
                //  console.log("this.totalPage",this.totalPage);
                  let res = responseJson.property? responseJson.property : [];
                  this.setState({
                    getProjects: [...this.state.getProjects ,...this._validateData(this.state.getProjects, res , 2 * this.PAGE_SIZE)],
                  },() => this._handleNoData(stateName));

                  //this.setState({ getProjects : responseJson.property })
                }
              }

              if (responseJson && responseJson.states) {
                if(responseJson.states.length > 0) {

                  obj = responseJson.states.map(item => {
                    return {
                      'label': item.label.toLowerCase()
                                .split(' ')
                                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(' '),
                      'count': item.count,
                      'value': item.label
                    }
                  });
                  myArr= [...obj]
                  myArr.unshift({'label': 'All', 'value' : 'all'})
                  this.setState({ category : myArr })
                }
              }
          })
          .catch((error) => {
              console.log(error);
          });
      }
    }


     _handleNoData(stateName) {
        //console.log('_handleNoData', stateName);
      //  console.log('listingResult', Object.keys(this.state.listingResult).length)
        if(stateName == 'getprojects' && Object.keys(this.state.getProjects).length > 0) {
            this.setState({ noItem : false, toggleLoader: false })
        }
        if(stateName == 'getprojects' && Object.keys(this.state.getProjects).length == 0) {
            this.setState({ noItem : true, toggleLoader: false  })
        }
    }

    _validateData(currentData, incomingData, latestSize) {
       // console.log("currentData, incomingData, latestSize",currentData, incomingData, latestSize);
        latestSize = latestSize || currentData.length
        start = currentData.length - latestSize > 0 ? currentData.length - latestSize : 0
        currrentData = currentData.slice(start)
        validatedData = []
        i = 0
        flag = true
        if(incomingData){
            while (i < incomingData.length) {
                j = 0
                flag = true
                while (j < currentData.length && flag) {
                    if (incomingData[i].title_t === currentData[j].title_t) {

                        flag = false
                    }
                    j++
                }
                if (flag) {
                    validatedData.push(incomingData[i])
                }
                i++
            }
        }
       /// console.log(validatedData);
        //this.setState({ getProjects : validatedData })
        return validatedData
    }


    _formatResult(result,stateName){
        let response = [];
        for (var index = 0; index < result.length; index++) {
            let data = result[index];
            let item = {};
            let images = data.field_prop_images? (data.field_prop_images.und? data.field_prop_images.und: []) :[];
            item.images = [];
            images.map((img, index) => {
                if(img.list_uri){
                    item.images.push(img.list_uri);
                }
            });

            if(data.field_property_type.und && data.field_property_type.und[0].target_id == 36) {
                if(data.field_prop_land_area.und && data.field_prop_land_area.und[0].value != undefined ) {
                  item.total_sqft = data.field_prop_land_area.und[0].value; 
                  item.perSqft = data.field_prop_price_pu.und[0].value    
                }
                if(data.field_prop_built_up_sqft.und && data.field_prop_built_up.und[0].value != undefined) {
                  item.total_sqft = data.field_prop_built_up.und[0].value;    
                  item.perSqft = data.field_prop_built_up_price_pu.und[0].value
                }
            } 
            if(data.field_property_type.und && data.field_property_type.und[0].target_id != 36) {
                if(data.field_prop_built_up_sqft.und && data.field_prop_built_up.und[0].value != undefined) {
                  item.total_sqft = data.field_prop_built_up.und[0].value;    
                  item.perSqft = data.field_prop_built_up_price_pu.und[0].value
                }
                if(data.field_prop_land_area.und && data.field_prop_land_area.und[0].value != undefined ) {
                  item.total_sqft = data.field_prop_land_area.und[0].value; 
                  item.perSqft = data.field_prop_price_pu.und[0].value    
                }  
            }
           
            item.title = data.title;
            item.nid = data.nid;
            item.mid = data.mid;
            item.asking_price = data.field_prop_asking_price? (data.field_prop_asking_price.und? (data.field_prop_asking_price.und[0]? this._formatMoney(data.field_prop_asking_price.und[0].value): ''): '') : '';
            item.bedrooms = data.field_prop_bedrooms? (data.field_prop_bedrooms.und? (data.field_prop_bedrooms.und[0]? data.field_prop_bedrooms.und[0].value: 0): 0) : 0;
            item.bathrooms = data.field_prop_bathrooms? (data.field_prop_bathrooms.und? (data.field_prop_bathrooms.und[0]? data.field_prop_bathrooms.und[0].value: 0): 0) : 0;
            item.street = data.field_prop_street? (data.field_prop_street.und? (data.field_prop_street.und[0]? data.field_prop_street.und[0].value: '') : '') : '';
            item.tenure = this._tenureValue(data.field_prop_lease_term)
            item.postcode = data.field_prop_postcode? (data.field_prop_postcode.und? (data.field_prop_postcode.und[0]? data.field_prop_postcode.und[0].value: '') : '') : '';
            item.year_completed = data.field_completion_year? (data.field_completion_year.und? (data.field_completion_year.und[0]? (data.field_completion_year.und[0].value): ''): '') : '';
            item.land_area = data.field_prop_land_area? (data.field_prop_land_area.und? (data.field_prop_land_area.und[0]? data.field_prop_land_area.und[0].value: '') : '') : '';
            if(item.land_area)
                item.land_area = item.land_area.toString();
            item.property_id = (data.nid && data.nid >0)? data.nid: data.mid;
            item.listing_type = data.field_prop_listing_type.und[0].value;
            item.key = (data.nid && data.nid >0)? 'n': 'm';
            item.uid = data.uid;

            response.push(item);
        }

        this.setState({
            [stateName]: response
        });
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    _tenureValue(data){
        let value = data.und? (data.und[0]? data.und[0].value: ''): '';
        let tenure = TenureOptions.filter(tenure => tenure.id == value);
        return tenure[0]? tenure[0].value: '';
    }

    _directToBrowser(url) {
        if (url.length > 0) {
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        }
    }


    getImage() {
      var randomImage = [];
      var myImg = getImages;
      var rand = myImg[Math.floor(Math.random() * myImg.length)];
      randomImage = rand.image;
      return randomImage;
    }

    onChangeText(text) {
      this.pageCount = 0;
        this.setState({
          sortBy: text,
          getProjects: [],
          toggleLoader: true
      }, () => {
          this._changeURL();
      });
    }

    _changeURL(){
      let proj = API_GET_PROJECTS+'?order_by='+this.state.sortBy+'&state='+this.state.selectedState+'&start='+this.pageCount+'&size='+PAGE_SIZE
      //console.log("projjjj",proj);
      this._callAPI(proj, "getprojects");
    }


    onChangeCategory(stateName) {
      this.pageCount = 0;
        this.setState({
          selectedState: stateName,
          getProjects: [],
          toggleLoader: true
      }, () => {
          this._changeCategoryURL();
      });
    }

    _changeCategoryURL(){
      let projCategory = '';
        projCategory = API_GET_PROJECTS+'?order_by='+this.state.sortBy+'&state='+this.state.selectedState
      this._callAPI(projCategory, "getprojects");
    }

    _loadMore() {
      //console.log("zxczcloadmore", this.pageCount, this.totalPage);
      this.pageCount++;
        if (this.pageCount <= this.totalPage) {
          //console.log("go to changeURL");
            this._changeURL();
        }
    }

    _formatNumber(num) {
      //console.log("num",num);
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    propDetails(item) {
      //console.log("item",item);
      this.refs.navigationHelper._navigate('PropMallDetail', {
            data: {
                property_id: (item.nid_i && item.nid_i >0)? item.nid_i: item.mid_i,
                key: (item.nid_i && item.nid_i >0)? 'n': 'm',
                listing_type: (item.type_s ? item.type_s : 'sale'),
            },
            onGoBack: this.onPressBack
        }) 
    }


    render() {
      // console.log('dsfkdsfg gfj dflgj dflg dflg df', this.props.navigation.state);
      const { featuredprojects, stateprojects, getProjects, sortBy } = this.state;
      let { category } = this.state;
      var icon = require('../../assets/icons/menu_more.png');
      var {height, width} = Dimensions.get('window');
      const vpexUrl = 'https://credit.edgeprop.my/'

      //console.log("this.scrolling",this.isScrolling);
      var _renderRelatedItem = (item,i) => {            
      //  console.log("iii",i)
        if(i%2 == 0) {
        return (
            <TouchableOpacity style={styles.propertyItem} key={i} onPress={() => { this.propDetails(item); } }> 
              <ImageBackground
                source={{uri: item.field_cover_thumbnail_s_lower }}
                resizeMode= 'cover'
                style={styles.propertyItemImage}
              >
                <View style={styles.propOverlayTitle}>
                    <Text allowFontScaling={false} style={styles.discoverTitle} numberOfLines = { 2 }  ellipsizeMode = 'head'>{item.title_t}</Text>
                </View>
                <View style={styles.propOverlayMoney}>
                  <Text allowFontScaling={false} style={styles.discoverTitle}  numberOfLines = { 2 }   ellipsizeMode = 'head'>{'FROM '+this._formatMoney(item.field_prop_asking_price_d)}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
        ) 
        } else {
          return (
            <TouchableOpacity style={styles.propertyItemEven} key={i} onPress={() => { this.propDetails(item); } }> 
              <ImageBackground
                source={{uri: item.field_cover_thumbnail_s_lower }}
                resizeMode= 'cover'
                style={styles.propertyItemImage}
              >
                <View style={styles.propOverlayTitle}>
                    <Text allowFontScaling={false} style={styles.discoverTitle} numberOfLines = { 2 }  ellipsizeMode = 'head'>{item.title_t}</Text>
                </View>
                <View style={styles.propOverlayMoney}>
                  <Text allowFontScaling={false} style={styles.discoverTitle}  numberOfLines = { 2 }   ellipsizeMode = 'head'>{'FROM '+this._formatMoney(item.field_prop_asking_price_d)}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
        )
        }           
      }

      return (
          <View style={{ flex: 1 }}>
              <NavigationHelper
                    ref={"navigationHelper"}
                    navigation={this.props.navigation} />
              <AppStateChange/>
                
                <View>
                    <View>
                   

                      <FlatList style={{ zIndex: -1 }}
                        numColumns={2}
                        flexDirection={'column'}


                        ListHeaderComponent={() => (
                          <View >
                            
                            <View style={styles.propHeroSection}>
                              <ImageBackground
                                  source={require('../../assets/images/propmall-hero.png')}
                                  resizeMode= 'cover'
                                  style={styles.propHeroMain}
                                >
                                 <Text allowFontScaling={false} style={styles.propHeroTitle}>New property launches & developments in Malaysia</Text>
                              </ImageBackground>
          
                            </View>


                            <View style={styles.sectionFeaturedProp}>
                              <View style={styles.sectionHeader}>
                                <Text allowFontScaling={false} style={styles.propSectionTitle}>Our Featured Properties</Text>
                                <TouchableOpacity>
                                  <Text allowFontScaling={false} style={styles.commonLink}></Text>
                                </TouchableOpacity>
                              </View>
                              <ScrollView horizontal={true} bounces={false}>
                                <View style={styles.horizontalTrack}>
                                  {this.state.featuredprojects.length > 0 && this.state.featuredprojects.map((item,i) => {
                                    
                                    return (
                                      <TouchableOpacity style={styles.propItem} key={i} onPress={() => { this.propDetails(item); } }> 
                                          <ImageBackground
                                            source={{uri: item.field_cover_thumbnail_s_lower }}
                                            resizeMode= 'cover'
                                            style={styles.propItemImage}
                                          >
                                            <View style={styles.propOverlay}>
                                              <Text allowFontScaling={false} style={styles.discoverTitle}>{item.title_t}</Text>
                                            </View>
                                        </ImageBackground>
                                      </TouchableOpacity>
                                    );
                                  })}
                                  {this.state.featuredprojects.length == 0 && (
                                      <View>
                                        <Text allowFontScaling={false} style={{ fontSize: 15, textAlign: 'center', fontFamily:'Poppins-SemiBold' }}>No Records Found ! </Text>
                                      </View>
                                  )}
                                </View>
                              </ScrollView>
                              <View style={styles.blobBgYellow} />
                            </View>
                            <View style={styles.sectionProperties}>
                              <View style={styles.sectionHeader}>
                                <Text allowFontScaling={false} style={styles.propSectionTitle}>Properties</Text>
                                <TouchableOpacity>
                                  <Text allowFontScaling={false} style={styles.commonLink}></Text>
                                </TouchableOpacity>
                              </View>
                              <View style={styles.propFilter}>
                                <View style={styles.propFilterItem}>
                                  <Text allowFontScaling={false} style={styles.dropdownText} numberOfLines={1} ellipsizeMode='tail' >Category</Text>
                                  <Dropdown
                                    allowFontScaling={false}
                                    label=''
                                    value={this.state.selectedState}
                                    data={this.state.category}
                                    dropdownOffset={{top: 17, left: 5 }}
                                    baseColor={'#462B5A'}
                                    selectedItemColor={'#462B5A'}
                                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                    textColor={'#462B5A'}
                                    itemColor={'#414141'}
                                    fontSize={11}
                                    fontWeight={'600'}
                                    onChangeText={this.onChangeCategory}
                                    fontFamily={'Poppins-SemiBold'}
                                    containerStyle={{ minWidth: width * 0.3 }}
                                  />
                                </View>
                                <View style={styles.propFilterItem}>
                                  <Text allowFontScaling={false} style={styles.dropdownText1} numberOfLines={1} ellipsizeMode='tail'>Sort By</Text>
                                  <Dropdown
                                    allowFontScaling={false}
                                    label=''
                                    value={this.state.sortBy}
                                    data={filter}
                                    dropdownOffset={{top: 17, left: 5 }}
                                    baseColor={'#462B5A'}
                                    selectedItemColor={'#462B5A'}
                                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                                    textColor={'#462B5A'}
                                    itemColor={'#414141'}
                                    fontSize={11}
                                    fontWeight={'600'}
                                    onChangeText={this.onChangeText}
                                    fontFamily={'Poppins-SemiBold'}
                                    containerStyle={{ minWidth: width * 0.3}}
                                  />
                                  <View>
                                  {(this.state.getProjects.length==0)?
                                    <View style={{ marginTop: 100, marginLeft: -350 }}>
                                  <Loading/></View>:
                                  <View/>
                                }
                                </View>
                                </View>
                              </View>
                            </View>  
                          </View>
                        )}
                        data={getProjects}
                        onMomentumScrollBegin={() => { this.isScrolling = true; }}
                        initialNumToRender={10}
                        renderItem={({ item, index }) => _renderRelatedItem(item, index)}
                        keyExtractor={(item, index) => index}
                        onEndReached={()=>{
                          if(this.isScrolling){
                            this._loadMore();
                          }
                        }}
                        onEndReachedThreshold={0.5}
                        totalListing = {this._formatNumber(this.totalListing)}
                      />                    
                    </View>
                  </View>
                  {(this.state.featuredprojects.length==0)?
                  <Loading/>:
                  <View/>
                }
                
          </View>
          )
    }
}

export default PropMall
