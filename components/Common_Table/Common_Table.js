import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import Transaction from '../../assets/json/Transaction.json';
export default class Common_Table extends Component {

  alignItems = 'flex-start'
  width = 150
  constructor(props) {
    super(props);
    this.state = {};
    this.data = [];
    this.title = [];
    this.dataItem = [];

    (this.containerStyle = {
      flexDirection: 'row',
      paddingVertical: 1,
      paddingHorizontal: 0,
      marginVertical: 0,
      marginHorizontal: 0,
    }),
      (this.headerTableStyle = {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
        color: '#4a4a4a',
        margin: 12,
        lineHeight: 19
      }),
      (this.bodyTableStyle = {
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        color: '#4a4a4a',
        margin: 12,
        lineHeight: 19
      });
  }
  _initStyle() {
    if (this.props.containerStyle != undefined) {
      this.containerStyle = {
        ...this.containerStyle,
        ...this.props.containerStyle
      };
    }
    if(this.props.width != undefined && this.props.width != this.width){
      this.width = this.props.width
    }
  }
  _initItem() {
    //init data
    if (this.props.data && this.props.data != this.data) {
      this.data = this.props.data;
    }
    if (this.props.title != undefined && this.props.title != this.title) {
      this.title = this.props.title;
    }
    if (this.props.dataItem != undefined && this.props.dataItem != this.dataItem) {
      this.dataItem = this.props.dataItem;
    }
    if (this.props.width != undefined && this.props.width != this.width) {
      this.width = this.props.width
    }
    if (this.props.alignItems != undefined && this.props.alignItems != this.alignItems){
      this.alignItems = this.props.alignItems
    }
  }
  shouldComponentUpdate(nextProps){
    return (JSON.stringify(nextProps.data) != JSON.stringify(this.props.data))
  }

  _getTouchedUpAddress(dataItem, isProtools){
    if(isProtools){
      if (dataItem.property_type_code=='h'){
        return 'Storey '+dataItem.unit
      }
      else {
        return dataItem.address+dataItem.unit
      }
    }
    else{
      if (dataItem.property_type_code=='h'){
        return 'Storey XX-XX'
      }
      else {
        return dataItem.full_address
      }
    }
  }

  render() {
    this._initStyle();
    this._initItem();

    var tableStyle = {
      alignItems: this.alignItems
    }
    var renderHeader = () => {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: 10
          }}
        >
          {this.title.map((item, index) => {
            return (
              <View key={index} style={[tableStyle, {width: this.width[index]}]}>
                <Text allowFontScaling={false} style={this.headerTableStyle}>{item}</Text>
              </View>
            );
          }
          )}
        </View>
      );
    };
    var _renderItem = (item, index) => {
      return (
        <View>
          {index >= 0 ? (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: index % 2 == 0 ? '#f8f8f8' : '#ffff'
              }}
            >
              {this.dataItem.map((data, dataIndex) => {
                  if(data=='full_address'){
                      return (
                        <View key={dataIndex} style={[tableStyle, {width: this.width[dataIndex]}]}>
                          <Text allowFontScaling={false} style={this.bodyTableStyle}>{this._getTouchedUpAddress(item, this.props.isProtools)}</Text>
                        </View>
                      );
                  }
                  return (
                    <View key={dataIndex} style={[tableStyle, {width: this.width[dataIndex]}]}>
                      <Text allowFontScaling={false} style={this.bodyTableStyle}>{item[data]}</Text>
                    </View>
                  );
              })}
            </View>
          ) : (
            <View />
          )}
        </View>
      );
    };
    return (
      <View flex={1} style={this.containerStyle}>
        <ScrollView horizontal>
          <FlatList
            data={this.data}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => _renderItem(item, index)}
            ListHeaderComponent={renderHeader}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    );
  }
}
