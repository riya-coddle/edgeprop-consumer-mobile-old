import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

export default class RotatableText extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      translateX: 0,
      translateY: 0
    }
  }
  _handleGetDimension(layout){
    var {x,y,width,height} = layout
    this.width = width
    this.height = height
    this.setState({
      translateX: -height/2,
      translateY: -width/2
    })
  }
  render(){
    return(
      <Text
        allowFontScaling={false}
        onLayout={(event) => {this._handleGetDimension(event.nativeEvent.layout)}}
        style={[this.props.style,{
          transform: [
            {rotate: this.props.rotate},
            {translateX: this.state.translateX},
            {translateY: this.state.translateY}
          ]
        }]}>{this.props.title}
      </Text>
    )
  }
}
