import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Image,
    Dimensions,
    NetInfo,
} from 'react-native'

export default class Tools_List extends Component {
    constructor(props) {
        super(props)
    }

    render() {
      return(
        <View style={this.props.containerStyle}>
          <Text allowFontScaling={false} style={this.props.titleTextStyle}>{this.props.title}</Text>
          <Text allowFontScaling={false} style={this.props.contentTextStyle}>{this.props.content}</Text>
        </View>
      )
    }
}
