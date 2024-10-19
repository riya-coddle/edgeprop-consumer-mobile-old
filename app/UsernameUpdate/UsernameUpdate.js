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
  AsyncStorage
} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'

const HOSTNAME = 'https://alice.edgeprop.my/api/user/v1/update';

export default class UsernameUpdate extends Component {
	
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

  constructor(props) {
    	super(props);
    	this.state = {
        	timePassed: false,
        	getStarted: false,
          currentName: this.props.navigation.state?this.props.navigation.state.params.data.name.split(" ")[0]:'',
          newName: '',
          hasNameError: false,
          hasUpdateError: false,
          success: false,
      	};
      this._onSubmit = this._onSubmit.bind(this)  
      this._updateUsername = this._updateUsername.bind(this)
  	}

    _updateUsername() {
      if(this.state.newName != '') {
        this.setState({ hasNameError: false });
        this._onSubmit()
      } else {
        this.setState({ hasNameError: true });
      }
    }

    _onSubmit() {
      if(this.state.currentName != '' &&  this.state.newName !='') {
        let name  = this.state.newName;
        let key   = this.props.navigation.state.params.data.accesskey;
        let email = this.props.navigation.state.params.data.email;
        let phone = this.props.navigation.state.params.data.phone;
        let uid   = this.props.navigation.state.params.data.uid;
       
        fetch(HOSTNAME, {
          method: 'POST',
          headers: new Headers({
                   'Accept' : 'application/json',
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
          body: "name="+name+"&email="+email+"&phone="+phone+"&key="+key+"&uid="+uid// <-- Post parameters        })
        }).then((response) => response.json())
        .then((responseText) => {
            if(responseText.status == 1) {
              this.setState({ success : true, hasUpdateError : false })
              console.log(responseText);
              this._updateUserInfo();
            }
            if(responseText.status == 0) {
              this.setState({ hasUpdateError : true, success : false })
            } 
        })
        .catch((error) => {
            console.error(error);
        });
      }
    }

    async _updateUserInfo() {
      AsyncStorage.getItem( 'authUser' )
        .then( data => {
          data = JSON.parse( data );
          data.name = this.state.newName
          this.setState({ currentName: this.state.newName })
          this.setState({ newName : '' })
          AsyncStorage.setItem( 'authUser', JSON.stringify( data ) );
        }).done();
    }

  	render() {
    	return (
          <KeyboardAwareScrollView>
        	    <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               />  
               <View style={{ padding: 23, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <TouchableOpacity onPress={() => (this.props.navigation.goBack() && this.props.navigation.state.params.onGoBack())}>
                    <Image
                        style={{ width: 23, height: 23 }}
                        source={require('../../assets/icons/arrow-left.png')}
                      />
                    </TouchableOpacity>  
                  </View>
                  <View>
                    <Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color:'#414141' }}>Username</Text>
                  </View>
                  <View>
                    <TouchableOpacity onPress={this._updateUsername}>
                      <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color:'#606060' }}>Done</Text>
                    </TouchableOpacity>
                  </View>
              </View>
              <View style={{ paddingTop: 30, paddingLeft: 23, paddingRight: 23 }}>
                  
                {this.state.hasUpdateError && (
                  <View style={{ backgroundColor: '#F44336', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                      <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Something went wrong! Try Again.</Text>
                      </View>
                  </View>  
                )}
                {this.state.success && (
                  <View style={{ backgroundColor: '#4CAF50', borderRadius: 3, width: '100%', paddingBottom: 15, paddingTop: 15, marginBottom: 20, paddingLeft: 10 }}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text allowFontScaling={false} style={{ fontSize: 15, fontFamily: 'Poppins-Regular', marginLeft: 5, color: '#fff' }}>Updated successfully!</Text>
                        <TouchableOpacity onPress={() => this.setState({ success: false, hasUpdateError: false })} >
                          <Image
                            style={{ width: 10, height: 10, alignSelf: 'center', marginRight: 10, marginTop: 5 }}
                            source={require('../../assets/icons/close-white-2.png')}
                          />
                        </TouchableOpacity>
                      </View>
                  </View>  
                )}  

                <View>
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color:'#414141', paddingLeft: 4 }}>Current</Text>
                  <TextInput
                        allowFontScaling={false}
                        value={this.state.currentName}
                        autoCapitalize = 'none'
                        type={'text'}
                        style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color:'#606060' }}
                        placeholder='Email'
                        keyboardType={'email-address'}
                        underlineColorAndroid="transparent"
                        editable={false}
                     /> 
                </View>
                <View style={{ paddingTop: 20 }}>
                  <Text allowFontScaling={false} style={{ fontSize: 16, fontFamily: 'Poppins-Regular', color:'#414141', paddingLeft: 4 }}>New</Text>
                  <TextInput
                        allowFontScaling={false}
                        value={this.state.newName}
                        autoCapitalize = 'none'
                        type={'text'}
                        placeholder='Username'
                        keyboardType={'email-address'}
                        underlineColorAndroid="#F4F4F6"
                        style={{ fontSize: 17, fontFamily: 'Poppins-Regular', color:'#606060' }}
                        onChangeText={(name) => this.setState({newName: name.trim()})}
                     />
                  {this.state.hasNameError &&  (
                    <Text allowFontScaling={false} style={{ fontFamily:'Poppins-Regular', color:'red', fontSize: 13, alignSelf: 'flex-start' }}>Invalid Username</Text>
                  )}   
                </View>
              </View>
          </KeyboardAwareScrollView>
      	);
      }
}