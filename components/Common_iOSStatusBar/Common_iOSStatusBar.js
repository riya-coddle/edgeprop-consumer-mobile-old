'use strict'
import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform,StatusBar} from 'react-native';

class StatusBarBackground extends Component{
  shouldComponentUpdate(nextProps, nextState) {
        return false
  }

  render(){
    return(
      <View style={[styles.statusBarBackground, this.props.style || {}]}>
        {this.props.lightContent ?
          <StatusBar
           barStyle="light-content"
          />
          : <StatusBar />}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 20 : 0, //this is just to test if the platform is iOS to give it a height of 20, else, no height (Android apps have their own status bar)
    backgroundColor: "white",
  }

})

module.exports= StatusBarBackground
