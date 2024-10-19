import React, { Component } from 'react'
import {View, Alert, ActivityIndicator} from 'react-native'

export default class Loading extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
          <View style={{
            position: 'absolute',
            top:0,
            bottom:0,
            left:0,
            right:0,
            opacity: this.props.opacity != 'undefined'?this.props.opacity:1,
            zIndex:999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "#fff"
          }}>
            <ActivityIndicator
              animating size='large'
              style={{
                height: 80
              }}
            />
          </View>
        )
    }
}
