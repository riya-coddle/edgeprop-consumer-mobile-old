import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ImageBackground, 
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  FlatList
} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './MySavedSearchStyle.js'
import WishList from '../WishlistModal/WishlistModal.js'

const HOSTNAME  = 'https://alice.edgeprop.my/api/user/v1/get-shortlist-label' 
const GETSAVEDSEARCH  = 'https://alice.edgeprop.my/api/user/v1/get-saved-search' 
const DELETE_SAVED = 'https://alice.edgeprop.my/api/user/v1/del-saved-search';
const {width, height} = Dimensions.get('window');

export default class MySavedSearch extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };
  constructor(props) {

      super(props);
      this.state = {
        newFolder : false,
        shortLists: {},
        groupItems: [],
        onClickitem: 0,
        onLoading: false,
        savedSearch: [],
        success: false,
        hasUpdateError: false,
        timePassed: false,
        empty: ''
      };
     
      this.savedSearchData = this.savedSearchData.bind(this)
      this._formatDate = this._formatDate.bind(this)
      this._deleteSaved = this._deleteSaved.bind(this)
      this._searchResult = this._searchResult.bind(this)
    }

    _deleteSaved(id) {
      if(id) {
          fetch(DELETE_SAVED, {
          method: 'POST',
          headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
          body: "uid="+this.props.navigation.state.params.data.uid+"&id="+id // <-- Post parameters        })
          }).then((response) => response.json())
        .then((responseText) => {
         // console.log('deleted', responseText);
            if(responseText.status == 1) {
              if(this.state.savedSearch.length > 1) {
              this.setState({ success : true, hasUpdateError : false, onLoading: false }, this.savedSearchData())  
              } else {
                this.setState({ success : true, hasUpdateError : false, onLoading: false, empty: 'No Records Found' }, this.savedSearchData())  
              }
              
            } else {
              this.setState({ success : false, hasUpdateError : true })
            }
        })
        .catch((error) => {
            console.error(error);
        });
      }
    }

    _handleRemove() {
      this.setState({
        groupItems: [],
      },()=>this.shortListData())
    }

    listShortlits(sId) {
      this.setState({ onClickitem : sId });
      if(this.state.groupItems[sId]) {
        this.refs.navigationHelper._navigateInMenu("ShortlistItems", {
           data: {
            items: this.state.groupItems[this.state.onClickitem],
            userId: this.props.navigation.state.params.data.uid,
            accesskey: this.props.navigation.state.params.data.accesskey,
            selected: this.state.onClickitem
           },
           onRemove: this._handleRemove,
         })
      } else {
        Alert.alert('There are no items with this category!')
      } 
    }

    _getType(id) {
      let propertyType = [
        {
            "label": "All Types",
            "value": ""
        },
        {
            "label": "Residential",
            "value": "rl"
        },
        {
            "label": "Residential (landed only)",
            "value": "l-36"
        },
        {
            "label": "Residential (non landed only)",
            "value": "r-33"
        },
        {
            "label": "Commercial",
            "value": "c-60"
        },
        {
            "label": "Industrial",
            "value": "i-70"
        },
      ];

      var result = propertyType.map((item, i) => {
        if (item.value == id) {
          //console.log(item.label)
          return item.label;
        } 
      });
      //console.log('res123', result)
      result = result.filter(function( element ) {
         return element !== undefined  ;
      });
      //console.log('res', result)
      if (result != undefined) {
        return result;
      } else {
        return "";
      }
    }

    onRefresh() {
      this.savedSearchData()
    }

    newWishList() {
      this.setState({ newFolder : true })
    }

    closeWishlistModal() {
      this.setState({ newFolder : false }) 
    }

    async componentDidMount() {
    setTimeout(() => {
      this.setState({timePassed: true, empty: 'No Records Found', onLoading: false})
    }, 2000) 
        this.savedSearchData();
    }

    _formatDate(transactionDate) {
      let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let str = transactionDate;
      let res = str.split(" ",3);
      let date = new Date(res[0]);
      let _date = date.getDate();
      let year = date.getFullYear();
      const monthName = monthNames[date.getMonth()];
      let returnDate = _date + " " + monthName + " " + year;

      return returnDate;
    }

    savedSearchData() {
      this.setState({ onLoading : true, savedSearch: [] });
      fetch(GETSAVEDSEARCH, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.props.navigation.state.params.data.uid // <-- Post parameters        })
        }).then((response) => response.json())
      .then((responseText) => {
        if(responseText.status == 1) {
         // console.log(responseText.data);
          this.setState({ savedSearch: responseText.data, onLoading: false })
        }
      })
      .catch((error) => {
          console.error(error);
      });
    }


    _searchResult(searchParam, searchName, propertyType){
    var items = {};
    var parts = propertyType.apiparams.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          items[key] = value;
      });
   // console.log('parts',items)
        this.refs.navigationHelper._navigate('ExploreLanding', {
            data: {
              state: searchParam.state != undefined ? searchParam.state: '',
              // district: searchParam.district != undefined ? searchParam.district: '',
              // keyword: searchParam.keyword != undefined ? searchParam.keyword: searchName,
              // property_type: searchParam.propertyType != undefined ? searchParam.propertyType: '',
              listing_type: items.listing_type?(items.new_launch?(items.new_launch==1?'new_launch':items.listing_type):items.listing_type):'sale',
              //state: items.state?items.state:'Kuala Lumpur',
              bedroom_min: items.beds?items.beds:'',
              asking_price_min: items.asking_price_min?Number(items.asking_price_min):{},
              asking_price_max: items.asking_price_max?Number(items.asking_price_max):{},
              build_up_min: items.build_up_min?Number(items.build_up_min):{},
              build_up_max: items.build_up_max?Number(items.build_up_max):{},
              land_area_min: items.land_area_min?Number(items.land_area_min):{},
              land_area_max: items.land_area_max?Number(items.land_area_max):{},
              furnishing: items.furnished?items.furnished:'',
              rental_type: items.property_type?items.property_type:'rl',
              keyword: items.keyword?items.keyword:'',
              asset_id: items.asset_id?items.asset_id:'',
              new_launch: items.new_launch?1:0, 
              poi_lat: items.poi_lat? items.poi_lat : '',
              poi_lon: items.poi_lon? items.poi_lon : ''
            }
        })
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    _typeFormat(type, params) {
    //console.log("type,params",type, params)
      let itemList = '';
      type = params.listing_type?params.listing_type:''
      if(params.state != undefined && params.state != '') {
        itemList += params.state?'State: '+params.state+',':'Kuala Lumpur '+' '
      }
      if(!params.state) {
        itemList +=  'State:  Kuala Lumpur '
      }
      if(type) {
        if(type == 'sale' ) {
          itemList += ' Buy, '  
        }else if(type == 'rent' || type == 'rental') {
          itemList += ' Rent, '
        } else if (type == 'new_launch') {
           itemList += ' New Launch,' 
        }else {
          itemList += type.charAt(0).toUpperCase() + type.slice(1) + ', ';
        }
      }
      
      if(params.property_type != undefined && params.property_type != '') {
        itemList += params.property_type? this._getType(params.property_type) + ', ' : ''
      }

      if(params.asking_price_min != undefined && params.asking_price_min != '') {
        itemList += params.asking_price_min ? ' Min Price: '+this._formatMoney(params.asking_price_min)+' sqft, ' : ''
      }

      if(params.beds != undefined && params.beds != '') {
        itemList += params.beds  != "0"?'Beds: '+params.beds + ', ':' Studio '
      }
      if(params.build_up_max != undefined && params.build_up_max != '') {
        itemList += 'Buildup Max: '+params.build_up_max+' sqft, '
      }
      if(params.build_up_min != undefined && params.build_up_min != '') {
        itemList += 'Buildup Min: '+params.build_up_min+' sqft, '
      }
      if(params.keyword != undefined && params.keyword != '') {
        itemList += params.keyword+','
      }
      return itemList.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    }

    render() {
      var _renderShortLists = (item,i) => { 
        return (
          <TouchableOpacity style={{ display: 'flex', marginBottom: 15}} onPress={() => this._searchResult(item.params, item.name, item)}>
          {this.state.onLoading && (
            <Loading />
          )}
           <View style={styles.savedSearchContainer}>
               <View style={{marginTop:25}}>
               <Text allowFontScaling={false} style={styles.shortlistTextOne}>{item.name}</Text>
               <Text allowFontScaling={false} style={styles.shortlistTextTwo}>{this._typeFormat(item.type,item.params)}</Text>
               <Text allowFontScaling={false} style={styles.shortlistTextThree}>{this._formatDate(item.created_at)}</Text>
               </View>
               <View  style={styles.close}>
                <TouchableOpacity onPress={() => this._deleteSaved(item.id)} style={ {padding: 8} }>
                  <Image style={{width: 13, height: 13}}
                    source={require('../../assets/icons/close-msg.png')}
                  />
                </TouchableOpacity >
               </View>
           </View>
            </TouchableOpacity>
        )
      }

      return (
          <KeyboardAwareScrollView>

              <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               /> 
               
               <View style={{ padding: 23, marginTop: 10,display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>                  
                  <View>
                    <TouchableOpacity onPress={() => (this.props.navigation.goBack() && this.props.navigation.state.params.onGoBack())}>
                      <Image
                          style={{ width: 23, height: 23 }}
                          source={require('../../assets/icons/arrow-left.png')}
                        />
                    </TouchableOpacity>  
                  </View>
                  <View>
                    <Text allowFontScaling={false} style={{ fontSize: 20 , fontFamily: 'Poppins-Medium', color:'#414141' }}>My Saved Search</Text>
                  </View>
                  <View>
                    <Text allowFontScaling={false} style={{ fontSize: 20 , fontFamily: 'Poppins-Medium', color:'#414141' }}></Text>
                  </View>
                </View>
                <View style={{ paddingLeft: 23, paddingRight: 23 }}>
                {this.state.hasUpdateError && (
                  <View style={{ backgroundColor: '#ffb2b2', borderWidth: 1, borderColor: '#ACACAC', borderRadius: 3, width: '100%', paddingBottom: 10, paddingTop: 10, marginBottom: 20, paddingLeft: 23, paddingRight: 23 }}>
                      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Poppins-Regular', marginLeft: 5 }}>Could not delete! Try Again.</Text>
                      </View>
                  </View>  
                )}
                {this.state.success && (
                  <View style={{ backgroundColor: '#7fff7f', borderWidth: 1, borderColor: '#ACACAC', borderRadius: 3, width: '100%', paddingBottom: 10, paddingTop: 10, marginBottom: 20, paddingLeft: 23, paddingRight: 23 }}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 13, fontFamily: 'Poppins-Regular', marginLeft: 5 }}>Deleted successfully!</Text>
                        <TouchableOpacity onPress={() => this.setState({ success: false, hasUpdateError: false })} style={ {padding: 8} }>
                          <Image
                            style={{ width: 10, height: 10, alignSelf: 'center', marginRight: 10, marginTop: 5 }}
                            source={require('../../assets/icons/close-msg.png')}
                          />
                        </TouchableOpacity>
                      </View>
                  </View>  
                )}
                </View>
                {this.state.onLoading && ( 
                  <View style={{ marginBottom: height * 0.2, marginTop: height * 0.4 ,alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Loading />
                  </View>
                )}

                {this.state.savedSearch == 0 && (
                  <View style={{ marginTop: height * 0.4 ,alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Text allowFontScaling={false}>{this.state.empty}</Text>
                  </View>
                  )}


                <View style={styles.shortlist}>
                  <FlatList style={{ zIndex: -1 }}
                      numColumns={1}
                      flexDirection={'row'}
                      data={this.state.savedSearch}
                      renderItem={({ item, index }) => _renderShortLists(item, index)}
                      keyExtractor={(item, index) => item.id}
                      key={1}
                      scrollEnabled = {false}
                    />   
                  </View>
                  
          </KeyboardAwareScrollView>
        );
      }
}