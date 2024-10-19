import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity,
    Share
} from 'react-native'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'
import Common_Menu from '../../components/Common_Menu/Common_Menu'
import HeaderSearch from '../../components/Common_HeaderSearch/Common_HeaderSearch'
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu'
import Common_Card from '../../components/Common_Card/Common_Card'
import Common_CardMenuList from '../../components/Common_CardMenuList/Common_CardMenuList'
import dataCard from '../../assets/json/ToolsCard.json'
import Common_ImageList from '../../components/Common_ImageList/Common_ImageList'
import Common_MenuList from '../../components/Common_MenuList/Common_MenuList'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'

class ToolsLanding extends Component {
    dataMenu = {
        "MenuItem": [{
                "title": "The Clift",
                "accordion": "right",
                "icon": false,
                "MenuItem": [],
                //"screen": "HomeLanding"
            },
            {
                "title": "EU Habitat",
                "accordion": "right",
                "icon": false,
                "MenuItem": [],
                //"screen": "HomeLanding"
            },
            {
                "title": "Sky Habitat",
                "accordion": "right",
                "icon": false,
                "MenuItem": [],
                //"screen": "HomeLanding"
            },
        ]
    }
    constructor(props) {
      super(props)

      this.state = {result:'qwerty'}
      this._handleMenuButton = this._handleMenuButton.bind(this)
      this._onPress = this._onPress.bind(this)
      this._showResult = this.showResult.bind(this)
      this._onPressHomeValue = this._onPressHomeValue.bind(this)
    }

    componentDidMount(){
    }

    _handleMenuButton(){
        this.refs.menus._toggleMenu()
    }

    showResult(result){
        console.log("DEBUG")
    }

    _onPress(){
        console.log('press');
    }

    _onPressHomeValue(item, screen){
      if(screen != undefined || screen != ""){
        //check if next screen is same as current screen
        this.refs.navigationHelper._navigateInMenu(screen, {
          data: '',
          title:item
        })
      }
      else{
        Alert.alert("Coming Soon...", `this feature will be coming soon`)
      }
    }


    render() {
        var icon = require('../../assets/icons/menu_more.png');

        return (
            <View style={{flex:1, backgroundColor:'#f8f8f8'}}>
            <NavigationHelper
              ref={"navigationHelper"}
              navigation={this.props.navigation}
            />
            <Common_Menu ref={"menus"}  navigation={this.props.navigation}/>
              <StatusBarBackground lightContent={true} style={{backgroundColor:'#275075'}}/>
              <View style={
                        {
                          flexDirection:'row',
                          backgroundColor:'#275075',
                          paddingHorizontal: 10,
                          paddingVertical: 15,
                          alignItems: 'center'
                        }}>
                        <View style={
                            {
                              flex: 1,
                              paddingRight: 10
                            }}>
                          <HeaderSearch
                            hintText={'Research on development'}
                            editable={false}
                            fontSize={15}
                            onPress={this._handleOnPressHeaderSearch}
                            />
                        </View>
                        <View>
                          <IconMenu
                            imageWidth={22}
                            imageHeight={15}
                            type={"icon"}
                            imageSource={icon}
                            onPress={this._handleMenuButton}
                            />
                        </View>

                    </View>
                <ScrollView bounces={false}>
                    <Common_CardMenuList
                        data = {dataCard}
                        onPressItem={this._onPressHomeValue}
                    />
                    <View style={{ backgroundColor:'#fff'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize:13,
                            fontFamily:'Poppins-Light',
                            color:'#4a4a4a',
                            marginLeft:10,
                            marginTop:5,
                            lineHeight:15
                        }}>Popular researched developments</Text>
                        <Common_ImageList
                            data={[{images:"https://img.tepcdn.com/img-v2/l/m-h_450,g_cm/693541/5937251/7250db2f-740b-45de-886b-2763cab76c42.jpg"},{images:"https://img.tepcdn.com/img-v2/l/m-h_450,g_cm/693541/5937245/be862932-5e5a-4579-9a5a-eaa9d85ea866.jpg"},{images:"https://img.tepcdn.com/img-v2/l/m-h_450,g_cm/693541/5937251/7250db2f-740b-45de-886b-2763cab76c42.jpg"},{images:"https://img.tepcdn.com/img-v2/l/m-h_450,g_cm/693541/5937245/be862932-5e5a-4579-9a5a-eaa9d85ea866.jpg"}]}
                        />
                    </View>

                    <View style={{ backgroundColor:'#fff', paddingTop:10}}>
                        <Text allowFontScaling={false} style={{
                            fontSize:13,
                            fontFamily:'Poppins-Light',
                            color:'#4a4a4a',
                            marginLeft:10,
                            marginTop:5,
                            lineHeight:15
                        }}>Previously Researched Developments</Text>
                        <Common_MenuList data={this.dataMenu}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default ToolsLanding
