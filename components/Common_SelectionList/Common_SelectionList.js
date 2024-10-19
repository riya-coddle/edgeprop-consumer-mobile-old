import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Common_SelectionItem from '../Common_SelectionItem/Common_SelectionItem';
import Common_IconMenu from '../Common_IconMenu/Common_IconMenu';

var rightArrow = require('../../assets/icons/Right-arrow.png');

export default class Common_SelectionList extends Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.state = {};
    this.style = {
      borderLeftWidth: 0,
      borderColor: '#000'
    };
    //this.triggerSelection = false
    this._onPress = this._onPress.bind(this);
    this._onPressCustomSelection = this._onPressCustomSelection.bind(this);
  }
  _initItem() {
    //init data
    if (this.props.data && this.props.data != this.data) {
      this.data = this.props.data;
    }
    // if (this.props.triggerSelection!=undefined && this.props.triggerSelection != this.triggerSelection) {
    //   this.triggerSelection = this.props.triggerSelection;
    // }
  }
  _initStyle() {
    //init borderLeftWidth
    if (
      this.props.borderLeftWidth &&
      this.props.borderLeftWidth != this.style.borderLeftWidth
    ) {
      this.style.borderLeftWidth = this.props.borderLeftWidth;
    }
    if (
      this.props.borderColor &&
      this.props.borderColor != this.style.borderColor
    ) {
      this.style.borderColor = this.props.borderColor;
    }
  }
  _onPress(isSelected, name, index) {
    if (this.props.onPress) {
      this.props.onPress(isSelected, name, index);
    }
  }
  _onPressCustomSelection() {
    if (this.props.onPressCustomSelection) {
      this.props.onPressCustomSelection();
    }
  }
  _handleTriggerSelection(data){
    if(this.props.existingData){
      if(this.props.existingData.length>0){
        triggerData = this.props.existingData.map((dataItem)=>(dataItem.id))
        return triggerData.includes(data)
      }
      else{
        return this.props.triggerSelection
      }
    }
    else{
      return this.props.triggerSelection
    }
  }
  // shouldComponentUpdate(nextProps){
  //   return(this.props.data!==nextProps.data)
  // }
  render() {
    this._initItem();
    this._initStyle();
    var renderList = () => {
      return this.data.map((data, index) => {
        if (this.data.length > 0) {
          return (
            <View key={index} style={{ paddingLeft: 15, paddingRight: 15 }}>
              <Common_SelectionItem
                borderColor={this.style.borderColor}
                borderLeftWidth={this.style.borderLeftWidth}
                item={data}
                onPress={(isSelected, name) => this._onPress(isSelected, name, index)}
                checkBox={this.props.checkBox}
                marginVerticalCheckBox={this.props.marginVerticalCheckBox}
                triggerSelection = {this._handleTriggerSelection(data.id)}
              />
              <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                <View style={{ borderBottomColor: '#F4F4F6', borderBottomWidth: 1 }} />
              </View>
            </View>
          );
        }
      });
    };
    return (
      <ScrollView>
        {this.props.customSelection ? (
          <TouchableOpacity onPress={this._onPressCustomSelection}>
            <View style={styles.list}>
              <Text allowFontScaling={false} style={styles.textList}>{this.props.customSelection}</Text>
              {/* <Common_IconMenu
                imageSource={rightArrow}
                type={'icon'}
                imageHeight={30}
                imageWidth={20}
                height={20}
                width={56.5}
              /> */}
            </View>
          </TouchableOpacity>
        ) : null}
        {renderList()}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  list: {
    paddingLeft: 31.4,
    paddingVertical: 13.4,
    justifyContent: 'space-between',
    borderBottomColor: '#F4F4F6', 
    borderBottomWidth: 0.5,
    flexDirection: 'row'
  },
  textList: {
    fontSize: 15,
    color: '#4a4a4a',
    fontFamily: 'Poppins-Medium',
    width: 270
  }
});
