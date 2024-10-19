import React, { Component } from 'React'
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions,
    FlatList,
    CheckBox,
    Button 
} from 'react-native'
 
import CollapsibleText from '../Common_CollapsibleText/Common_CollapsibleText'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList';
import ListingDetailLocation from '../../app/ListingDetailLocation/ListingDetailLocationNav';

const {width, height} = Dimensions.get('window');
const nearby = {
    "MenuItem": [{
            "title": "Public Transport Nearby",
            "accordion": "search",
            "icon": "",
            "MenuItem": [],
            "screen": ""
        },
        {
            "title": "Supermarket Nearby",
            "accordion": "search",
            "icon": "",
            "MenuItem": [],
            "screen": ""
        },
        {
            "title": "Shopping Mall Nearby",
            "accordion": "search",
            "icon": "",
            "MenuItem": [],
            "screen": ""
        },
    ]
} 

export default class Listing_Description extends Component {
    constructor(props) {
        super(props)
        this.state = {
          needContact: false
        }
        this.style = {
            // default value
            marginVertical: 20,
            paddingLeft: 16,
            paddingRight: 11,
            alignItems: 'flex-start',
        }
        this.item = {
            info: ''
        }
        this.onContactAgent = this.onContactAgent.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState){
        return (JSON.stringify(nextProps.item) != JSON.stringify(this.item))
    }

    _initStyle() {
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
    }
    _initItem() {
        if (this.props.item && JSON.stringify(this.props.item) != JSON.stringify(this.item)) {
            this.item.info = this.props.item.info || this.item.info
        }
    }
    onContactAgent() {
      this.setState({  needContact: true });

    }

    render() {
        this._initStyle()
        this._initItem()
        
        return (
          <View>  
            <View style={{
                marginTop: 10,
                alignItems: this.style.alignItems,
            }}>
                {this.item.info != '' && (
                <View style={[styles.hpFirstSec, {paddingLeft: this.style.paddingLeft,paddingRight: this.style.paddingRight, width: '100%'}]}>
                  <Text allowFontScaling={false} style={{
                      fontSize: width * 0.038,
                      fontFamily: 'Poppins-SemiBold',
                      color: '#414141',
                      alignItems: 'flex-start',
                      marginBottom: 10,
                      marginTop: 15,
                   }}>Description</Text>
                   {/* description info */}
                    <CollapsibleText onLayoutChange={this.props.onLayoutChange} text={this.item.info} numberOfLines={10} isDesc={true}/>
                </View>)}
                

               {((this.props.features && this.props.features.data && this.props.features.data.length != 0 ) || 
                (this.props.facilities && this.props.facilities.data && this.props.facilities.data.length != 0  ) || 
                (this.state.inOutSpaceData && this.state.inOutSpaceData.data && this.props.inOutSpaceData.data.length != 0 )) && (
                  <View style={[styles.hpFirstSec, {paddingLeft: this.style.paddingLeft,paddingRight: this.style.paddingRight, width: '100%'}]}>
                    <Text allowFontScaling={false} style={facilities.styles}>Facilities & Amenities</Text>
                    <View style={facilities.checkboxStyles}>
                      {this.props.features.data && this.props.features.data.map((item, i) => {
                        return (
                          <View style={facilities.dataContainer} key={i}>
                              <View style={{ width: '10%' }}>
                                <Image
                                  style={{width: 18, height: 18, borderColor: '#DCDCDC', borderWidth: 1.3 }}
                                  source={require('../../assets/icons/checked.png')}
                                />
                              </View>
                              <View style={{ width: '60%', alignSelf: 'flex-start' }}>
                                <Text allowFontScaling={false} style={facilities.checkboxText}>{item.value}</Text>
                              </View>
                          </View> 
                        )
                     })}
                     {this.props.facilities.data && this.props.facilities.data.map((item, i) => {
                        return (
                          <View style={facilities.dataContainer} key={i}>
                              <View style={{ width: '10%' }}>
                                <Image
                                  style={{width: 18, height: 18, borderColor: '#DCDCDC', borderWidth: 1.3}}
                                  source={require('../../assets/icons/checked.png')}
                                />
                              </View>
                              <View style={{ width: '80%', alignSelf: 'flex-start' }}>
                                <Text allowFontScaling={false} style={facilities.checkboxText}>{item.value}</Text>
                              </View>
                          </View> 
                        )
                     })}
                     {this.props.inOutSpaceData.data && this.props.inOutSpaceData.data.map((item, i) => {
                        return (
                          <View style={facilities.dataContainer} key={i}>
                              <View style={{ width: '10%' }}>
                                <Image
                                  style={{width: 18, height: 18, borderColor: '#DCDCDC', borderWidth: 1.3}}
                                  source={require('../../assets/icons/checked.png')}
                                />
                              </View>
                              <View style={{ width: '80%', alignSelf: 'flex-start' }}>
                                <Text allowFontScaling={false} style={facilities.checkboxText}>{item.value}</Text>
                              </View>
                          </View> 
                        )
                     })}   
                    </View>
                  </View>
               )}
               

            </View>
            <View>
            </View>
          </View>  
        );
       
    }
}

  
const styles = StyleSheet.create({
  container: {
      backgroundColor: '#ecf0f1'
  },
  hpFirstSec: {
      backgroundColor: '#fff',
      paddingBottom: 20,
      marginBottom: 10
  }
});
const facilities = StyleSheet.create({
    container: {
    paddingTop: 33
   },
    styles:{
       fontSize: width * 0.038,
       fontFamily: 'Poppins-SemiBold',
       color: '#414141',
       paddingBottom: 8,
       marginTop: 15
    },
    checkboxStyles:{
      marginLeft: -7,
   },
   checkBoxSingle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
   checkboxText: {
      color: '#414141',
      fontSize: width * 0.03,
      paddingLeft: 16

   },
   dataContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
   }
});
const location = StyleSheet.create({
     bg: {
      backgroundColor: '#F2F4F8',
      width: '100%',
      height: 300,
      alignItems: 'center'
       },
     nearby: {
      color: '#A0ACC1',
      fontSize: 16,
      paddingTop: 25,
      letterSpacing: 1.5,
      fontWeight: '100',
      fontFamily: 'Poppins-Regular'

      }
});
const twoButtons = StyleSheet.create({
      buttonText: {
       color: '#fff',
       fontWeight: '500',
       fontSize: 18,
       letterSpacing: 1.3,
      },
      buttonTextOne: {
       paddingLeft: 5,
        color: '#fff',
       fontWeight: '500',
       fontSize: 18,
       letterSpacing: 1.3,
     },
    buttonOne: {
      borderRadius: 4,
      height: 50, 
      backgroundColor: '#FFA700',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      color: '#fff',
      marginRight: 11
     },
     buttonTwo: {
      borderRadius: 4,
      height: 30, 
      backgroundColor: '#488BF8',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      color: '#fff',
     }
});
const buttonContainer = StyleSheet.create({
      buttonText: {
       color: '#fff',
       fontWeight: '500',
       fontSize: 18,
       letterSpacing: 1.3
      },
    buttonOne: {
      borderRadius: 4,
       backgroundColor: '#FFA700',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      color: '#fff',
      marginRight: 12,
      height: 60
     },
     buttonTwo: {
      borderRadius: 4,
       backgroundColor: '#488BF8',
      color: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      color: '#fff',
      height: 60
     },
     container: {
     flexDirection: 'row',
     borderColor: '#707070',
     borderWidth: 0.25,
     paddingTop: 7,
     paddingBottom: 7,
      }

});



