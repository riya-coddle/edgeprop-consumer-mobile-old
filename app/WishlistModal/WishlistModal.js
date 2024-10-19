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
  FlatList  
} from 'react-native';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import styles from './WishlistModalStyle.js';

const HOSTNAME  = 'https://alice.edgeprop.my/api/user/v1/get-shortlist-label' 
const BOOKMARK_API = 'https://alice.edgeprop.my/api/user/v1/shortlist';

export default class WishlistModal extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
      super(props);
      this.state = {
        newItem: '' ,
        hasError: false,
        shortLists: {},
        addNew: false,
        onLoading: false             
      };
      this._onTouch = this._onTouch.bind(this)
      this._addShortList = this._addShortList.bind(this)
      this._fetchShortlist = this._fetchShortlist.bind(this)
    }

    async componentDidMount() {
         this._fetchShortlist();
    }

    _fetchShortlist() {
      fetch(HOSTNAME, {
        method: 'POST',
        headers: new Headers({
                 'Accept' : 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "uid="+this.props.userId+"&key="+this.props.accesskey+"&nid="+this.props.nid // <-- Post parameters        })
      }).then((response) => response.json())
      .then((responseText) => {
       // console.log('z ', responseText);
         this.setState({ shortLists: responseText.data })
      })
      .catch((error) => {
          console.error(error);
      });
    }

    _addShortList(sID,shortlistFlag) {
       if (shortlistFlag) {console.log('remove');
        this._removeShortList(sID);
       } else {
        let apiUrl = "uid="+this.props.userId+"&key="+this.props.accesskey+"&s_id="+sID;
        if(this.props.nid && this.props.nid != "undefined")
          apiUrl = apiUrl+"&nid="+this.props.nid;
        if(this.props.mid && this.props.mid != "undefined")
          apiUrl = apiUrl+"&mid="+this.props.mid;

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
          //  console.log("b4 add",this.state);
              let shortListTemp = this.state.shortLists;
             // console.log('shortListTemp testing', shortListTemp)
            //  console.log('sID', sID)
              let indexKey = shortListTemp.findIndex(x => x.s_id == sID);
              if(indexKey >= 0) {
                shortListTemp[indexKey].shortlist = !shortListTemp[indexKey].shortlist;
                this.setState({ shortLists: shortListTemp })
              }
              let wishlistEmpty = shortListTemp.filter((item) => {
                return item.shortlist == true
              })
              //console.log("after add",this.state.shortLists);
              //this._fetchShortlist();
              if(this.props.setSid && this.props.setSid != "undefined") 
                this.props.setSid(sID);
                this.props.handleChange(this.props.nid, wishlistEmpty.length);
               
                
            }
          })
          .catch((error) => {
              console.error(error);
          });
        }      
    }

    _removeShortList(sID) {
        let apiUrl = "uid="+this.props.userId+"&key="+this.props.accesskey+"&s_id="+sID+"&delete="+1;
        if(this.props.nid && this.props.nid != "undefined")
          apiUrl = apiUrl+"&nid="+this.props.nid;
        if(this.props.mid && this.props.mid != "undefined")
          apiUrl = apiUrl+"&mid="+this.props.mid;

         fetch(BOOKMARK_API, {
            method: 'POST',
            headers: new Headers({
                     'Accept' : 'application/json',
                     'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: apiUrl // <-- Post parameters        })
          }).then((response) => response.json())
          .then((responseText) => {
            if(responseText.status == 1){
              let shortListTemp = this.state.shortLists;
             // console.log(shortListTemp)
              let indexKey = shortListTemp.findIndex(x => x.s_id == sID);
              if(indexKey >= 0) {
                shortListTemp[indexKey].shortlist = !shortListTemp[indexKey].shortlist;
                this.setState({ shortLists: shortListTemp })
              }
              let wishlistEmpty = shortListTemp.filter((item) => {
                return item.shortlist == true
              })
              this.props.handleChange(this.props.nid, wishlistEmpty.length);
            }
          })
          .catch((error) => {
              console.error(error);
          });  
      
    }

    _onTouch() {
      if(this.state.newItem != '') {
        this.setState({ hasError: false, onLoading: true })
         fetch(HOSTNAME, {
          method: 'POST',
          headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
          body: "uid="+this.props.userId+"&key="+this.props.accesskey+"&name="+this.state.newItem // <-- Post parameters        })
        }).then((response) => response.json())
        .then((responseText) => {
            //console.log('ad',responseText);
            if(responseText.status == 1) {
              this.setState({ addNew : false , newItem: '', onLoading: false })
              this._fetchShortlist(); 
              this.props.onRefresh() 
            }
            //this.setState({newItem:''})
        })
        .catch((error) => {
            console.error(error);
        }); 
      } else {
        this.setState({ hasError: true })
      }
        
    }

    render() {
      //console.log('props ;liost', this.props);
      var _renderShortLists = (item,i) => { 
       // console.log('setSid', item)
        return (
          <TouchableOpacity  style={styles.modalNew} key={i} onPress={() => this._addShortList(item.s_id,item.shortlist)} disabled={this.props.isPropertyList?false:true}> 
            <View>
              <Text allowFontScaling={false} style={styles.listItems}>{item.name}</Text>
            </View>
            <View>
               <Image style={{width: 22, height: 22}}
                    source= {item.shortlist ? require('../../assets/icons/heart-booked.png') : require('../../assets/icons/heart-unbooked.png')}
                />  
            </View>
          </TouchableOpacity>
        )
      }


      return (
          <Modal
              isVisible={true}
              onSwipeComplete={() => this.props.closeModal()}
              onRequestClose={() => this.props.closeModal()}
              transparent={true} >
              <View style={styles.modalContainer}>
                
                 <View style={styles.modal}>
                     <View style={styles.modelHeader}>
                       <Text allowFontScaling={false} style={styles.headerText}>Save to shortlist</Text>
                        <TouchableOpacity onPress={()=> this.props.closeModal()}>
                          <Image style={{width: 18, height: 18}}
                            source={require('../../assets/icons/close-white-2.png')}
                          />
                        </TouchableOpacity>  
                     </View>
                      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
                      <View style={styles.modelBody}>
                       <Text allowFontScaling={false} style={styles.modelBodyText}>Add this listing to one or more of your shortlists. Dont't see a fit? You can create a new shortlist! View all your shortlists here </Text>
                       <TouchableOpacity onPress={()=> this.setState({ addNew : true })}>
                          <Text allowFontScaling={false} style={styles.modelBodyLink}>Create New List</Text>
                       </TouchableOpacity>
                       
                       {this.state.addNew && (
                          <View style={styles.inputButton}>
                            <TextInput
                              allowFontScaling={false}
                              style={styles.textInputCustom}
                              placeholder="Shortlist Name"
                              placeholderTextColor="#888B8E"
                              onChangeText={(val) => this.setState({newItem:val})}
                              value={this.state.newItem}
                           />
                         <TouchableOpacity style={styles.button} onPress={this._onTouch}>
                           <Text allowFontScaling={false} style={styles.btnText}>Create</Text>
                         </TouchableOpacity>
                        </View>
                       )}
                       
                       {this.state.hasError &&  (
                          <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', marginTop:5, color:'red', fontSize: 13, alignSelf: 'flex-start' }}>Invalid name!</Text>
                        )} 
                      </View>
                      <View style={styles.list}>
                        <FlatList style={{ zIndex: -1 }}
                            numColumns={1}
                            flexDirection={'row'}
                            data={this.state.shortLists}
                            renderItem={({ item, index }) => _renderShortLists(item, index)}
                            keyExtractor={(item, index) => item.s_id}
                            key={1}
                            scrollEnabled = {false}
                          />
                          {this.state.onLoading && (
                            <Loading />
                          )}
                      </View>
                    </KeyboardAwareScrollView>   
                 </View>
              </View>
          </Modal>    
        );
      }
}