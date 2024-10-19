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
  AsyncStorage,
  BackHandler
} from 'react-native';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
import Authentication from '../../app/Authentication/Authentication.js'
import SocialLogin from '../../app/SocialLogin/SocialLogin.js'
//import AppNav from '../../app/AppNav.js'
import styles from './SignUpLandingStyle.js'

export default class SignUpLanding extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      };
  };

	constructor(props) {
    	super(props);
      this.navigation = props.navigation
    	this.state = {
        onLoginClick: 0,
        timePassed: false,
        hasLoggedIn: this.props.logout?false:false,
        asycCheck: 0
      };

      this._onPressButton = this._onPressButton.bind(this);
      this.onBackPress = this.onBackPress.bind(this)
      this.setTimePassed = this.setTimePassed.bind(this)
      this._setLoader = this._setLoader.bind(this);
      this._onPressButtonSkip = this._onPressButtonSkip.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  	}

    async componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      const auth = await AsyncStorage.getItem("authUser");
      if(auth && auth != '') {
        let authItems = JSON.parse(auth);
        if(authItems.status == 1) {
          this.setState({ hasLoggedIn: true, asycCheck: 1 })
        }  
      } else {
        this.setState({ asycCheck: 2 })
      }
      
      setTimeout( () => {
         this.setTimePassed();
      },4000);
    }

    handleBackButtonClick() {

      if (!this.props.navigation.isFocused()) {
        // The screen is not focused, so don't do anything
        return false;
      }

      if(this.props.navigation.isFocused() && this.props.navigation.state.params.data && this.props.navigation.state.params.data.isProfile) {
        //this.props.navigation.navigate('HomeLanding');
        this.refs.navigationHelper._navigate('HomeLanding', {
          data: {'isProfile': false},
        })
      }else {
        this.props.navigation.goBack();
      }
        return true;
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    setTimePassed() {
       this.setState({timePassed: true});
    }

    _onPressButton(item) {
      this.setState({ onLoginClick: item })
      this.props.navigation.navigate('Authentication', {
        data: {
          itemSelected: item
        }
      });

    }

    _onPressButtonSkip() {
      if(this.props.navigation.state.params.data && this.props.navigation.state.params.data.isProfile) {
        this.refs.navigationHelper._navigate('HomeLanding', {
          data: {'isProfile': false},
        })
      }else {
        this.props.navigation.goBack();
      }
    }

    _setLoader(flag) {
      this.setState({ asycCheck: flag });
    }

    onBackPress(){
      this.setState({ onLoginClick: 0 })
    }
  	render() {
        return (
          <View>
          <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               />  
          {this.state.asycCheck == 0 && (
            <Loading opacity={0.8} />
          )}
            <ImageBackground source={require('../../assets/images/room.jpg')} style={{width: '100%', height: '100%'}}>  
             <View style={styles.containerCustom}>
                  <View style={styles.logoTextContain}>
                      <Image
                        style={{ width: 160, height: 40, marginBottom: 11 }}
                        source={require('../../assets/images/edge_prop_logo.png')}
                      />
                    <Text allowFontScaling={false} style={styles.tagline}>Find your perfect home</Text>
                  </View>
                  
                  <SocialLogin navigation={this.props.navigation} setLoader={this._setLoader}/>
                <View style={styles.twoButtonsContainer}>
                   <TouchableOpacity style={styles.loginBtn} onPress={() => this._onPressButton(1)}>
                       <Text allowFontScaling={false} style={styles.btnText}>Login with Email</Text>
                   </TouchableOpacity>
                     <TouchableOpacity style={styles.signupBtn} onPress={() => this._onPressButton(2)}>
                       <Text allowFontScaling={false} style={styles.btnText}>Sign Up</Text>
                   </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity style={{ padding:10, marginTop:10}} onPress={() => this._onPressButtonSkip()}>
                       <Text allowFontScaling={false} style={[styles.btnText, {textDecorationLine: "underline", textDecorationStyle: "solid", textDecorationColor: "#fff"}]}>Skip Login</Text>
                   </TouchableOpacity>
                </View>
                <Text>Version 3.0.3</Text>
            </View>
            
            
         </ImageBackground>  
          </View>
      );

    		
  	}

}