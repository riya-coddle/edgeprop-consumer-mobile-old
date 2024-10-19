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
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './MyShortListStyle.js'
import WishList from '../WishlistModal/WishlistModal.js'

const HOSTNAME  = 'https://alice.edgeprop.my/api/user/v1/get-shortlist-label' 
const GETSHORTLISTS  = 'https://alice.edgeprop.my/api/user/v1/shortlist-get' 
const {width, height} = Dimensions.get('window');

export default class MyShortLists extends Component {
  
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
        onLoading: false
      };
      this.newWishList = this.newWishList.bind(this);
      this.closeWishlistModal = this.closeWishlistModal.bind(this);
      this.groupBy = this.groupBy.bind(this);
      this.listShortlits = this.listShortlits.bind(this)
      this.shortListData = this.shortListData.bind(this)
      this._handleRemove = this._handleRemove.bind(this)
      this.onRefresh = this.onRefresh.bind(this)
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
            items: this.state.groupItems[sId],
            userId: this.props.navigation.state.params.data.uid,
            accesskey: this.props.navigation.state.params.data.accesskey,
            selected: sId
           },
           onRemove: this.shortlistLabels,
           onGoBack: this.onRefresh
         })
      } else {
        Alert.alert('There are no items with this category!')
      } 
  	}

    onRefresh() {
      console.log('ffff f ')
      this.shortlistLabels()
    }

    newWishList() {
      this.setState({ newFolder : true })
    }

    closeWishlistModal() {
      this.setState({ newFolder : false }) 
    }

    async componentDidMount() {
        this.shortlistLabels(); 
    }

    shortlistLabels() {
      //console.log('dd  ddd');
      this.setState({ shortLists : {}, onLoading: true })
      fetch(HOSTNAME, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.props.navigation.state.params.data.uid+"&key="+this.props.navigation.state.params.data.accesskey // <-- Post parameters        })
        }).then((response) => response.json())
      .then((responseText) => {
        this.setState({ shortLists: responseText.data, onLoading: false })
        this.shortListData();
      })
      .catch((error) => {
          console.error(error);
      });
    }
    
    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
          // eslint-disable-next-line no-param-reassign
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
    

    shortListData() {
      fetch(GETSHORTLISTS, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.props.navigation.state.params.data.uid+"&key="+this.props.navigation.state.params.data.accesskey // <-- Post parameters        })
      }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.hasOwnProperty('data')) {
          const groupedBySid = this.groupBy(responseText.data, 's_id');
          this.setState({ groupItems: groupedBySid })
          /*if(this.state.onClickitem != 0) {
            this.listShortlits(this.state.onClickitem)
          } */
        }
      })
      .catch((error) => {
          console.error(error);
      }); 
    }

    profileBack() {
      this.refs.navigationHelper._navigate("ProfileLanding", {
            data: this.state.userInfo,
            onGoBack: this.onRefresh
         })
    }

    render() {
      var _renderShortLists = (item,i) => {   
      //console.log(this.state.groupItems[item.s_id]) 
      let imageThumbsOne = imageThumbsTwo = imageThumbsThree = ''; 
        if(this.state.groupItems[item.s_id] != undefined) {//console.log(this.state.groupItems[item.s_id]);
          if (this.state.groupItems[item.s_id].length > 0) {//console.log('property',property);
            if(this.state.groupItems[item.s_id][0].images != undefined) {
              if(this.state.groupItems[item.s_id][0].images[0]) {
                imageThumbsOne = this.state.groupItems[item.s_id][0].images[0]
              }
            }
            if(this.state.groupItems[item.s_id][1] != undefined && this.state.groupItems[item.s_id][1].images != undefined) {
              if(this.state.groupItems[item.s_id][1].images[0]) {
                imageThumbsTwo = this.state.groupItems[item.s_id][1].images[0]
              }
            }
            if(this.state.groupItems[item.s_id][2] != undefined  && this.state.groupItems[item.s_id][2].images != undefined) {
              if(this.state.groupItems[item.s_id][2].images[0]) {
                imageThumbsThree = this.state.groupItems[item.s_id][2].images[0]
              }
            }
          }
        }  //console.log('imageThumbsOne',imageThumbsOne);  

        return (
          <TouchableOpacity onPress={() => this.listShortlits(item.s_id)} style={{ display: 'flex', flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
          {this.state.onLoading && (
            <Loading />
          )}
          <View style={styles.shortlistGrid}>
             <View style={styles.imgShortlist}>
             {imageThumbsOne != "" && (
              <Image 
                style={{width: 45, height: 65}}
                source={{ uri: imageThumbsOne }}
               />
              )}
             </View>
              <View style={styles.imgShortlistTwo}>
                 <View style={styles.ShortlistImageOne}>
                 {imageThumbsTwo != "" && (
                   <Image 
                    style={{width: 44, height: 30}}
                    source={{ uri: imageThumbsTwo }}
                   />
                  )}
                 </View>
                  <View style={styles.ShortlistImageTwo}>
                  {imageThumbsThree != "" && (
                    <Image 
                      style={{width: 44, height: 30}}
                      source={{ uri: imageThumbsThree }}
                     />
                  )}
                 </View>
               </View>
             <View>
             </View>
           <View style={styles.shortlistTextArrow}>
               <Text allowFontScaling={false} style={styles.shortlistText}>{item.name}</Text>
                <Image 
                style={{width: 16, height: 16}}
                source={require('../../assets/icons/new_right_arrow.png')}
               />
           </View>
           </View>
           </TouchableOpacity>
        )
      }

    	return (
          <ScrollView>
        	    <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               /> 
               {this.state.newFolder && (
                  <View>
                      <WishList
                        isPropertyList={false}
                        accesskey={this.props.navigation.state.params.data.accesskey} 
                        userId={this.props.navigation.state.params.data.uid}
                        modalVisible={this.state.newFolder} 
                        closeModal={this.closeWishlistModal}
                        onRefresh={this.onRefresh}
                      />
                  </View>    
                )} 
               <View style={{ padding: 23, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <TouchableOpacity onPress={() => this.profileBack()}>
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
                      <View />
                    </View> 
                  </View>
                  <View style={styles.mainContainer}>
                      <TouchableOpacity onPress={this.newWishList}>
                      <View style={styles.addBoxContainer}>
                         <View style={styles.addBox}>
                          <Image 
                         style={{width: 17, height: 17}}
                           source={require('../../assets/icons/plus.png')}
                          />
                         </View>
                         <View style={{ flex: 1 }}>
                           <Text allowFontScaling={false} style={styles.addBoxText}>Create New Folder</Text>
                         </View>
                      </View>
                    </TouchableOpacity>  
                  </View>
                  <View style={styles.shortlist}>
                      <FlatList style={{ zIndex: -1 }}
                          numColumns={1}
                          flexDirection={'row'}
                          data={this.state.shortLists}
                          renderItem={({ item, index }) => _renderShortLists(item, index)}
                          keyExtractor={(item, index) => item.s_id}
                          key={1}
                          scrollEnabled = {false}
                        />   
                  </View>
                  {this.state.onLoading && ( 
                  <View style={{ marginBottom: height * 0.2, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Loading />
                  </View>
                )}
          </ScrollView>
        );
      }
}