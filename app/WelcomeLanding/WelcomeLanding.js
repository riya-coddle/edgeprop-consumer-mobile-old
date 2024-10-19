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
  TouchableOpacity
} from 'react-native';
//import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'
//import AppNav from '../../app/AppNav.js'
import styles from './WelcomeStyle.js'
//import SignupLanding from '../../app/SignUpLanding/SignUpLanding.js'

var welcome = require('../../assets/icons/welcome_new.png');

export default class WelcomeLanding extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
        	timePassed: false,
        	getStarted: false,
      	};
     this._onPressButton = this._onPressButton.bind(this)
  	}
    _onPressButton() {
    	this.setState({ getStarted: true })
      /*this.refs.navigationHelper._navigate('AppNav', {
        data: ''
      })*/
      this.props.navigation.navigate('HomeLanding');
    }
  	render() {

      /*if(this.state.getStarted) {
        return (<SignupLanding />)
      }*/
    	return (
          <ScrollView>
        	 <View style={styles.container} > 	
              <View style={{ display: 'flex', alignItems: 'center' }}>
          	 	 <Text allowFontScaling={false} style={styles.headerText}>Welcome Home!</Text>
          	 	   <Image 
          	 		  style={{ width: 250, height: 137, paddingHorizontal: 10, paddingVertical: 30 }}
          	 		  source={welcome}
          	 	   />
          	 	 <Text allowFontScaling={false} style={styles.infoText}>Get access to daily breaking news, hundreds of thousands of properties and everything you need to find your perfect home.</Text>
 				      </View>
              <View style={{ display: 'flex', alignItems: 'center' }}>
               <View style={styles.buttonContain}>
  	                <TouchableOpacity style={styles.fbButtonLast} onPress={this._onPressButton}>
  	                   <Text allowFontScaling={false} style={styles.btnText}>Get Started</Text>
  	                </TouchableOpacity>
  	            </View>
              </View>
 			      </View>         
          </ScrollView>
      	);
      }
}