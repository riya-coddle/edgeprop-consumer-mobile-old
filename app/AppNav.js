import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Linking,
    AsyncStorage
} from 'react-native'
import {TabNavigator, StackNavigator, SwitchNavigator} from 'react-navigation'
import AppStructure from '../assets/json/AppStructure.json'
import RouteToScreen from './RouteToScreen.js'
import LandingTabNavigator from '../components/Common_TabNavigator/Common_TabNavigator.js'
import SignUpLanding from './SignUpLanding/SignUpLanding.js'
import Authentication from './Authentication/Authentication.js'
import { isSignedIn } from './auth'
import SocialLogin from './SocialLogin/SocialLogin.js'
import SignUp from './SignUp/SignUp_1.js'
import WelcomeLanding from './WelcomeLanding/WelcomeLanding.js'


var homeImg = require('../assets/icons/tabbar-icons/explore.png')
var activeHomeImg = require('../assets/icons/tabbar-icons/explore-active.png')
var toolsImg = require('../assets/icons/tabbar-icons/listing.png')
var activeToolsImg = require('../assets/icons/tabbar-icons/listing-active.png')
var newsImg = require('../assets/icons/tabbar-icons/news_icon.png')
var activeNewsImg = require('../assets/icons/tabbar-icons/news-active.png')
var meImg = require('../assets/icons/tabbar-icons/Me.png')
var activeMeImg = require('../assets/icons/tabbar-icons/Me-blue.png')
var propMallImg = require('../assets/icons/tabbar-icons/propmall-icon.png')
var activePropMallImg = require('../assets/icons/tabbar-icons/propmall-active.png')

const anonymousUser = {
  accesskey: "",
  name: "Anonymous User",
  status: 1,
  uid: 0,
}
const itemMenu = {
    list: [
        {
            contentId: 1,
            txt: 'Explore',
            path: 'HomeLanding',
            attachedImg: homeImg,
            activeImg: activeHomeImg,
        },
         {
             contentId: 2,
             txt: 'Listing',
             path: 'ExploreLanding',
             attachedImg: toolsImg,
             activeImg: activeToolsImg,
         },
        {
            contentId: 3,
            txt: 'News',
            path: 'NewsLanding',
            attachedImg: newsImg,
            activeImg: activeNewsImg,
        },
        {
            contentId: 4,
            txt: 'PropMall',
            path: 'PropMall',
            attachedImg: propMallImg,
            activeImg: activePropMallImg,
        },
        {
            contentId: 5,
            txt: 'Profile',
            path: 'ProfileLanding',
            attachedImg: meImg,
            activeImg: activeMeImg,
        },

    ]
}


var tabScreens = {}
var stackScreens = {}

for(var i=0; i<AppStructure.length; i++){
  //tab
  if(i==0){
    for(var j=0; j<AppStructure[0].children.length; j++){
      tabScreens[AppStructure[0].children[j].routeName] = {
        screen: RouteToScreen[AppStructure[0].children[j].routeName]
      }
    }
  }
  //other stack
  else{
    stackScreens[AppStructure[i].routeName] = {
      screen: RouteToScreen[AppStructure[i].routeName]
    }
  }
}


const TabNav = TabNavigator(
  tabScreens,
  {
    tabBarComponent: (({navigation}) =>
      <LandingTabNavigator
        //borderColor={'#878787'}
        //borderWidth={1}
        backgroundColor={'#f8f8f8'}
        textColor={'#4a4a4a'}
        activeTextColor={'#275075'}
        itemMenu={itemMenu}
        navigation={navigation}
      />),
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    initialRouteName: AppStructure[0].children[0].routeName, // set inital route
    lazy: true,
  }
)

class TabNavContainer extends Component {
  render() {
    return (
      <TabNav
        screenProps = {this.props.screenProps}
        navigation = {this.props.navigation}
      />
    )
  }
}
TabNavContainer.router = TabNav.router

stackScreens[AppStructure[0].routeName] = {
  screen: TabNavContainer,
  navigationOptions: {
    header: null
  }
}


const StackNav = StackNavigator(
  stackScreens,
  {
    initialRouteName: AppStructure[0].routeName,
    headerMode: "screen",
    navigationOptions:{
      headerStyle: {
        backgroundColor: "#275075",
    },
      headerBackTitle: null,
      headerTintColor: "white",
      headerTitleStyle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16
      },
    },
    cardStyle: {
      backgroundColor: "white"
    }
  }
)

const defaultGetStateForAction = StackNav.router.getStateForAction;

StackNav.router.getStateForAction = (action, state) => {
  // console.log(action, state);
  return defaultGetStateForAction(action, state);
};

class NavWrapper extends Component {
  
  _onNavigationStateChange = (prevState, newState) => {
    // console.log(prevState, newState);
    /*this.setState({
      stackKey: newState.routes[newState.index].key,
      tabKey: newState.index==0? newState.routes[0].routes[newState.routes[0].index].key: "",
    })*/
  }

  async componentDidMount() {
    isSignedIn()
      .then((res) => {
        console.log('res', res);
        if(res == false) {
          AsyncStorage.setItem( 'authUser', JSON.stringify( anonymousUser ) );
        }
      })
      .catch(err => alert("An error occurred"));


  }

  render(){
    return (
      <StackNav
        onNavigationStateChange = {this._onNavigationStateChange}
        screenProps = {this.state}
      />
    )
  }
  
}


export const SignedOut = StackNavigator({
  'SignUpLanding': {
    screen: SignUpLanding,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  },
  'Authentication': {
    screen: Authentication,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  },
  'SocialLogin': {
    screen: SocialLogin,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  },
  'SignUp': {
    screen: SignUp,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  },
  'Welcome': {
    screen: WelcomeLanding,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  },
});

class NavOutWrapper extends Component {
  /*
  _onNavigationStateChange = (prevState, newState) => {
    // console.log(prevState, newState);
    this.setState({
      stackKey: newState.routes[newState.index].key,
      tabKey: newState.index==0? newState.routes[0].routes[newState.routes[0].index].key: "",
    })
  }
  */

  render(){
    return (
      <SignedOut
        screenProps = {this.state}
      />
    )
  }
}


export const createRootNavigator = (signedIn = false) => {
  return SwitchNavigator({
      SignedIn: StackNav,
      SignedOut: SignedOut,
    },
    {
      initialRouteName: signedIn? 'SignedIn' : 'SignedOut',
    });
};

/*
{
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
*/


AppNav = NavWrapper;//StackNav
export default AppNav
