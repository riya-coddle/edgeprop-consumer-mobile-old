import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper'
import Common_BlockList from '../../components/Common_BlockList/Common_BlockList'
import TypeOptions from '../../assets/json/Search_Data/TypeOptions.json'
import ValuationTypeOptions from '../../assets/json/Search_Data/ValuationTypeOptions.json'

class HomeValue extends Component {
    static navigationOptions = ({ navigation }) => {
        var { state, setParams } = navigation;
        var { params } = state

      return {
        title:  state.params.title.toUpperCase(),
      }
    }

    constructor(props) {
      super(props)

      this.state = {}

    }

    render() {
        return (
            <View>
                <NavigationHelper
                  ref={"navigationHelper"}
                  navigation={this.props.navigation}
                />

                <Common_BlockList
                    criteria={'Type of transaction'}
                    data={TypeOptions}
                    initFocusIndex={0}
                    toggle={true}
                    width={'100%'}
                    numOfColumn={2}
                    disable={false}
                    onPress={(isSelected, name, index, id) => {

                    console.log('wew', id);
                }}
                />
                <Common_BlockList
                    criteria={'Property Type'}
                    data={ValuationTypeOptions}
                    initFocusIndex={0}
                    toggle={false}
                    width={'100%'}
                    numOfColumn={3}
                    disable={false}
                />
            </View>
        )
    }
}

export default HomeValue
