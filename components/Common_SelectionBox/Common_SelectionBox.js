import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';

export default class Common_SelectionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      name: {},
    };
    this.data = [];
    this.triggerSelection = false
    this.style = {
      marginVertical: 0,
      marginHorizontal: 20,
      outerWidth: 18,
      outerHeight: 18,
      outerBorderRadius: 9,
      outerBorderWidth: 1,
      outerBorderColor: '#bfbebe',
      innerWidth: 12,
      innerHeight: 12,
      innerBorderRadius: 6,
      innerBackgroundColor: '#488BF8',
      innerMargin: 2
    };

    this._onPress = this._onPress.bind(this);
  }
  _initItem() {
    if (this.props.data && this.props.data != this.data) {
      this.data = this.props.data;
    }
    if(this.props.triggerSelection!=undefined && this.props.triggerSelection != this.triggerSelection){
      this.triggerSelection = this.props.triggerSelection
    }
  }
  _initStyle() {
    if (
      this.props.outerWidth &&
      this.props.outerWidth != this.style.outerWidth
    ) {
      this.style.outerWidth = this.props.outerWidth;
    }
    if (
      this.props.outerHeight &&
      this.props.outerHeight != this.style.outerHeight
    ) {
      this.style.outerHeight = this.props.outerHeight;
    }
    if (
      this.props.outerBorderRadius &&
      this.props.outerBorderRadius != this.style.outerBorderRadius
    ) {
      this.style.outerBorderRadius = this.props.outerBorderRadius;
    }
    if (
      this.props.outerBorderWidth &&
      this.props.outerBorderWidth != this.style.outerBorderWidth
    ) {
      this.style.outerBorderWidth = this.props.outerBorderWidth;
    }
    if (
      this.props.outerBorderColor &&
      this.props.outerBorderColor != this.style.outerBorderColor
    ) {
      this.style.outerBorderColor = this.props.outerBorderColor;
    }
    if (
      this.props.innerWidth &&
      this.props.innerWidth != this.style.innerWidth
    ) {
      this.style.innerWidth = this.props.innerWidth;
    }
    if (
      this.props.innerHeight &&
      this.props.innerHeight != this.style.innerHeight
    ) {
      this.style.innerHeight = this.props.innerHeight;
    }
    if (
      this.props.innerBorderRadius &&
      this.props.innerBorderRadius != this.style.innerBorderRadius
    ) {
      this.style.innerBorderRadius = this.props.innerBorderRadius;
    }
    if (
      this.props.innerBackgroundColor &&
      this.props.innerBackgroundColor != this.style.innerBackgroundColor
    ) {
      this.style.innerBackgroundColor = this.props.innerBackgroundColor;
    }
    if (
      this.props.innerMargin &&
      this.props.innerMargin != this.style.innerMargin
    ) {
      this.style.innerMargin = this.props.innerMargin;
    }
    if (
      this.props.marginHorizontal &&
      this.props.marginHorizontal != this.style.marginHorizontal
    ) {
      this.style.marginHorizontal = this.props.marginHorizontal;
    }
    if (
      this.props.marginVertical &&
      this.props.marginVertical != this.style.marginVertical
    ) {
      this.style.marginVertical = this.props.marginVertical;
    }
  }

  _onPress() {
    if (this.props.onPress) {
      !this.state.isSelected
        ? this.setState({ isSelected: true, name: this.data }, () =>
            this.props.onPress(this.state.isSelected, this.state.name)
          )
        : this.setState({ isSelected: false, name: this.data }, () =>
            this.props.onPress(this.state.isSelected, this.state.name)
          );
    }
  }
  componentWillReceiveProps(nextProps){
      //console.log('nextProp',nextProps.triggerSelection);
      this.setState({
        isSelected: nextProps.triggerSelection
      })
  }
  // shouldComponentUpdate(nextProps,nextState){
  //   return(nextState!=this.state)

  // }
  render() {
    this._initStyle();
    this._initItem();
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View
          style={{
            width: this.style.outerWidth,
            height: this.style.outerHeight,
            borderRadius: this.style.outerBorderRadius,
            borderWidth: this.style.outerBorderWidth,
            borderColor: this.style.outerBorderColor,
            marginHorizontal: this.style.marginHorizontal,
            marginVertical: this.style.marginVertical,
          }}
        >
          <View
            style={
              (this.state.isSelected==true) ? {
                width: this.style.innerWidth,
                height: this.style.innerHeight,
                borderRadius: this.style.innerBorderRadius,
                backgroundColor: this.style.innerBackgroundColor,
                margin: this.style.innerMargin
              }
              : null
            }
          />
        </View>
      </TouchableOpacity>
    );
  }
}
