import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    Modal,
    Dimensions
} from 'react-native'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js'
import Common_Button from '../../components/Common_Button/Common_Button.js'
import Common_BlockListItem from '../../components/Common_BlockListItem/Common_BlockListItem.js'
import Common_BlockList from '../../components/Common_BlockList/Common_BlockList.js'
import EducationOptions from '../../assets/json/EducationOptions.json'
import SchoolTypeOptions from '../../assets/json/SchoolTypeOptions.json'
import CutOffPointOptions from '../../assets/json/CutOffPointOptions.json'
import DistanceOption from '../../assets/json/DistanceOption.json'
EducationOptionsResult = 'Primary';
// SchoolTypeOptionsResult = ["Govt", "Girls", "Boys", "Govt-aided", "Co-ed"];
CutOffPointOptionsResult = 'All';
DistanceOptionResult = '500';
export default class SchoolOption extends Component{
    constructor(props) {
      super(props);
      this.state = {
          EducationOptionsResult: 'Primary',
          SchoolTypeOptionsResult: [{id: "Govt", value: "Govt", index: 2},{id: "Govt-aided", value: "Govt-aided", index: 3},{id: "Boys", value: "Boys", index: 4},{id: "Girls", value: "Girls", index: 5},{id: "Co-ed", value: "Co-ed", index: 6}]
      }
      this.navigation = props.navigation
      this._handleOnPressContinue = this._handleOnPressContinue.bind(this);
      this._handleOnPressEducationOptions = this._handleOnPressEducationOptions.bind(this);
      this._handleOnSetSchoolTypeOptionsResult = this._handleOnSetSchoolTypeOptionsResult.bind(this)
      this._handleData = this._handleData.bind(this);
    }
    static navigationOptions = ({ navigation }) => {

        return {
            title:'CHOOSE SCHOOL'
        };
    };
    _handleOnSetSchoolTypeOptionsResult(isSelected, value, index, id) {
        let SchoolTypeOptionsResult = []
        SchoolTypeOptionsResult = this.state.SchoolTypeOptionsResult
            if (isSelected) {
                SchoolTypeOptionsResult.push({ id: id, value: value, index: index })
                SchoolTypeOptionsResult = SchoolTypeOptionsResult.filter((obj) => obj.id !== '')
            } else {
                SchoolTypeOptionsResult = SchoolTypeOptionsResult.filter((obj) => obj.value !== value)
            }
        this.setState({ SchoolTypeOptionsResult: SchoolTypeOptionsResult })
    }
    _handleData() {
        this.handleDataSchool = this.props.navigation.state.params.handlerData(result);
      }
    _handleOnPressContinue() {
        var SchoolTypeOptionsResult = this.state.SchoolTypeOptionsResult.map((obj) => obj.id)

        var data={EducationOptionsResult,SchoolTypeOptionsResult, CutOffPointOptionsResult, DistanceOptionResult}
        this.refs.navigationHelper._navigateInMenu("SchoolSelection",
        {
         data: data,
         goBackKey: this.props.navigation.state.key,
         handlerData: this._handleData,
         title: this.props.navigation.state.params.title
       })
    }
    _handleOnPressEducationOptions(isSelected, name){
        if(this.state.EducationOptionsResult != name){
            this.setState({
                EducationOptionsResult: name
            })
            EducationOptionsResult = name
        }
        if(this.state.EducationOptionsResult == 'Primary'){
            // SchoolTypeOptionsResult = [];
        }
    }

    render(){
        console.log(this.state.SchoolTypeOptionsResult);
      return(
        <ScrollView>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}>
                <NavigationHelper
                  ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />
                <Common_BlockList
                    criteria={'Education Level'}
                    data={EducationOptions}
                    initFocusIndex={0}
                    toggle={true}
                    numOfColumn={2}
                    onPress={this._handleOnPressEducationOptions}
                />

                <Common_BlockList
                    criteria={'Type of schools'}
                    data={SchoolTypeOptions}
                    numOfColumn={3}
                    disable={this.state.EducationOptionsResult=='Primary' ? 'partial' : false}
                    selectedIndex={this.state.SchoolTypeOptionsResult.map((obj) => obj.index)}
                //     onPress={(isSelected, name) => {
                //         if (isSelected != false) {
                //             SchoolTypeOptionsResult.push(name);
                //         } else {
                //             SchoolTypeOptionsResult.splice(SchoolTypeOptionsResult.indexOf(name), 1);
                //         }
                //    console.log('SchoolTypeOptionsResult', SchoolTypeOptionsResult);
                //     }}
                onPress={this._handleOnSetSchoolTypeOptionsResult}
                />

                <Common_BlockList
                    criteria={'Cut-off points'}
                    data={CutOffPointOptions}
                    initFocusIndex={0}
                    toggle={true}
                    numOfColumn={3}
                    disable={this.state.EducationOptionsResult=='Primary' ? true : false}
                    onPress={(isSelected, name) => {
                        CutOffPointOptionsResult = name
                    console.log('CutOffPointOptionsResult', CutOffPointOptionsResult);
                }}/>
                <Common_BlockList
                    criteria={'Distance'}
                    data={DistanceOption}
                    initFocusIndex={0}
                    toggle={true}
                    numOfColumn={4}
                    onPress={(isSelected, name, index, id) => {
                        DistanceOptionResult = id
                    console.log('DistanceOptionResult', id);
                }}/>
                <Common_Button
                    textValue={'CONTINUE'}
                    backgroundColor={'#275075'}
                    borderRadius={1}
                    marginTop={21}
                    onPress={this._handleOnPressContinue}
                />

            </View>
        </ScrollView>
      )
    }
}
