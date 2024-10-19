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
  Switch
} from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Loading from '../../components/Common_Loading/Common_Loading'

export default class NotificationUpdate extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
          push: false,
          sms: false,
          mail: false
      	};
  	}
    
  	render() {
    	return (
          <ScrollView>
        	    <NavigationHelper
                 ref={'navigationHelper'}
                 navigation={this.props.navigation}
               />  
               	<View style={{ padding: 23, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
	                  <View>
	                    <TouchableOpacity>
	                    <Image
	                        style={{ width: 23, height: 23 }}
	                        source={require('../../assets/icons/arrow-left.png')}
	                      />
	                    </TouchableOpacity>  
	                  </View>
	                  <View>
	                    <Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color:'#414141' }}>Notification</Text>
	                  </View>
	                  <View>
	                    <TouchableOpacity>
	                      <Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color:'#606060' }}>Done</Text>
	                    </TouchableOpacity>
	                  </View>
                </View>
                <View style={{ paddingTop: 30, paddingLeft: 23, paddingRight: 23 }}>
	            	<View style={{ marginTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
	              		<View>
	              			<Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Regular', color:'#414141' }}>Push notification</Text>
	              		</View>  
	              		<View>
	              			<Switch
	                          	onValueChange={(value) => this.setState({pass: value})}
	                          	value = {this.state.push}/>
	              		</View>
              		</View> 
              		<View style={{ marginTop: 8, borderBottomColor: '#F4F4F6', borderBottomWidth: 1  }} />
              		<View style={{ marginTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
	              		<View>
	              			<Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Regular', color:'#414141' }}>SMS notification</Text>
	              		</View>  
	              		<View>
	              			<Switch
	                          	onValueChange={(value) => this.setState({sms: value})}
	                          	value = {this.state.sms}/>
	              		</View>
              		</View> 
              		<View style={{ marginTop: 8, borderBottomColor: '#F4F4F6', borderBottomWidth: 1  }} /> 
              		<View style={{ marginTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
	              		<View>
	              			<Text allowFontScaling={false} style={{ fontSize: 18, fontFamily: 'Poppins-Regular', color:'#414141' }}>Email notification</Text>
	              		</View>  
	              		<View>
	              			<Switch
	                          	onValueChange={(value) => this.setState({mail: value})}
	                          	value = {this.state.mail}/>
	              		</View>
              		</View> 
              		<View style={{ marginTop: 8, borderBottomColor: '#F4F4F6', borderBottomWidth: 1  }} />  
              	</View>
          </ScrollView>
      	);
      }
}