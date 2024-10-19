import React, { Component } from 'react';
import { View } from 'react-native';
import MRTData from '../../assets/json/MRTData.json';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper';
import Common_SelectionList from '../../components/Common_SelectionList/Common_SelectionList';
import { TabNavigator } from 'react-navigation';


export default class MRTSelection extends Component {
  constructor(props) {
    super(props);
    result = [];
    //console.log('MRTSelection');
  }

  render() {
    console.log("MRTData", MRTData)
    var MRTList = data => {
      console.log(data)
      if (data == 'Sungai Buloh - Kajang Line(SBK)') return 0;
      if (data == 'Kelana Jaya Line(KJ)') return 1;
      if (data == 'Sri Petaling Line(SP)') return 2;
      if (data == 'Ampang Line(AG)') return 4;
      if (data == 'KL Monorail Line(MR)') return 3;
      if (data == 'Port Klang Line(KD)') return 5;
      if (data == 'Seremban Line(KB)') return 6;
      if (data == 'Port Klang Line(KA)') return 7;
      if (data == 'Seremban Line(KC)') return 8;
      if (data == 'KLIA Transit Line(KT)') return 9;
      if (data == 'Sunway Line(SB)') return 10;
    };
    console.log(result)
    return (
      <View style={{ flex: 1 }}>
        <Common_SelectionList
          data={MRTData[MRTList(this.props.navigation.state.key)].stations}
          selectedData = {result}
          checkBox={true}
          borderColor={MRTData[MRTList(this.props.navigation.state.key)].color}
          borderLeftWidth={11}
          onPress={(isSelected, name) => {
            if (isSelected != false) {
              result.push(name);
            } else {
              result.splice(result.indexOf(name), 1);
            }
          }}
        />
      </View>
    );
  }
}
