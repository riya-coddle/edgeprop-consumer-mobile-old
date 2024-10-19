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
} from 'react-native';
import ListingResultList from '../../components/ListingResult_List/ListingResult_List'
import Loading from '../../components/Common_Loading/Common_Loading'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'

const GETSHORTLISTS  = 'https://alice.edgeprop.my/api/user/v1/shortlist-get' 

export default class ShortlistItems extends Component {
	
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
    	super(props);
    	this.state = {
          items : {},
          groupItems: [],
          clicked : this.props.navigation.state.params.data.selected,
          userInfo : {},
          itemLoaded: false,
      	};
      this.groupBy = this.groupBy.bind(this);
      this._handleEnquiry = this._handleEnquiry.bind(this);
      this.shortListData = this.shortListData.bind(this)  
      this._handleOnPressListing = this._handleOnPressListing.bind(this)
      this.onRefresh = this.onRefresh.bind(this);
  	}
    
    _handleEnquiry(data) {
      console.log(data)   
    }

    onRefresh() {
    // this.shortListData()
    }

   async componentDidMount() {
      this.shortListData()

       const auth = await AsyncStorage.getItem("authUser");
        let authItems = JSON.parse(auth);
        if(authItems.status == 1) {
          this.setState({ userInfo: authItems, itemLoaded: true })
        }

    }

    _handleRemove() {
      if(this.state.groupItems[this.state.clicked]) {
        this.setState({ items : this.state.groupItems[this.state.clicked] })  
      } else {
        this.refs.navigationHelper._navigate("MyShortLists", {
            data: this.state.userInfo,
            onGoBack: this.onRefresh
         })
      }
    }


    _handleOnPressListing(item, index) {

        let mapData = item.location_p?item.location_p.split(/\s*,\s*/):'';
        this.refs.navigationHelper._navigate('ListingDetailNav', {
            data: {
                property_id: (item.nid && item.nid >0)? item.nid: item.mid,
                listing_type: item.type == 'rent'?'rental' : item.type,
                key: (item.nid && item.nid >0)? 'n': 'm',
                uid: item.uid_i,
                nid: item.nid,
                mid: item.mid,
                lat: mapData[0]?mapData[0]:0,
                lan: mapData[1]?mapData[1]:0,
                state: item.state?item.state:'',
                area: item.district?item.district:'',
                project: item.title_t?item.title_t:'',
                shortlisted: item.s_id?true: false,
                itemId: item.id?item.id:0,
                clicked: item.s_id?item.s_id:0,
                newLaunch:0
            },
          onGoBack: this.onRefresh
        })
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
          // eslint-disable-next-line no-param-reassign
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

    shortListData() {
      this.setState({ onLoading : true, groupItems: [] })
      fetch(GETSHORTLISTS, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.props.navigation.state.params.data.userId+"&key="+this.props.navigation.state.params.data.accesskey // <-- Post parameters        })
      }).then((response) => response.json())
      .then((responseText) => {
        if(responseText.status == 0) {
          this.setState({ groupItems: [], onLoading: false , items : {}},()=>this._handleRemove())
        } else {
            if (responseText.hasOwnProperty('data')) {
              const groupedBySid = this.groupBy(responseText.data, 's_id');
              this.setState({ groupItems: groupedBySid, onLoading: false , items : {}},()=>this._handleRemove())
            }
          }
      })
      .catch((error) => {
          console.error(error);
      }); 
    }

  	render() {
    	return (
          <View style={{ flex: 1 }}>
            <NavigationHelper
              ref={"navigationHelper"}
              navigation={this.props.navigation}
            />
            {this.state.onLoading && (
                <Loading />
            )}
            <View style={{ padding: 23, paddingBottom: 23, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.goBack() && this.props.navigation.state.params.onGoBack() }>
                <Image
                    style={{ width: 23, height: 23 }}
                    source={require('../../assets/icons/arrow-left.png')}
                  />
                </TouchableOpacity>  
              </View>
              <View>
                <Text allowFontScaling={false} style={{ fontSize: 20 , fontFamily: 'Poppins-Medium', color:'#414141' }}>My Shortlists</Text>
              </View>
              <View>
                <View/>
              </View>
            </View>
            <View style={{ flex: 1 }}>
        	    <ListingResultList
                  navigation={this.props.navigation}
                  items={this.state.items}
                  isShortlist={true}
                  onPressEnquire={this._handleEnquiry}
                  userId={this.props.navigation.state.params.data.userId}
                  accesskey={this.props.navigation.state.params.data.accesskey}
                  onRemove={this.shortListData}
                  onPressItem={this._handleOnPressListing}
                  noTabs={true}
              />
            </View>
          </View>
      	);
      }
}