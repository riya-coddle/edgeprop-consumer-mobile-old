import React, { Component } from 'react'
import {
  AsyncStorage,
  View
} from 'react-native'
export default class AsyncHelper extends Component{
    constructor(props){
        super(props);
        this._setData = this._setData.bind(this)
        this._getData = this._getData.bind(this)
    }

    _setData(key, data, funct){
      AsyncStorage.setItem(key, data).then(() => {
        if(funct != undefined){
          funct()
        }
      });
    }

    _getData(key, funct){
       AsyncStorage.getItem(key).then((value) => {
         if(funct != undefined){
           funct(value)
         }
       });
    }

    _removeData(key, funct){
       AsyncStorage.removeItem(key).then(() => {
         if(funct != undefined){
           funct()
         }
       });
    }

    render(){
        return(<View/>)
    }
}
