import React, { Component } from 'react'
import {View, Share} from 'react-native'

export default class ShareHelper extends Component{
    constructor(props){
        super(props);
        this.title = props.title
        this.dialogTitle = props.dialogTitle
        this.message = props.message || ""
        this._share = this._share.bind(this)
    }
    shouldComponentUpdate(nextProps){
        return(nextProps.title!=this.props.title || nextProps.dialogTitle != this.props.dialogTitle)
    }
    _share(data){
        Share.share({
            title: this.title || "Hey there you better check this out",
            message: this.message.length>0? this.message+"\n"+data : data,
            //url: data
        },
        {
            dialogTitle: this.dialogTitle || "Share News", //Android only
            // excludedActivityTypes: [
            //   'com.apple.UIKit.activity.PostToTwitter',
            //   'com.apple.UIKit.activity.PostToFacebook'
            //    //it will showup specifics app that we can share to --IOS only
            // ]
        })
    }
    render(){
        return(<View/>)
    }
}
