import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableHighlight,
  Keyboard
} from 'react-native'
import TextBox from '../../components/Common_TextBox/Common_TextBox'
import AutoSuggestion from '../../components/Common_AutoSuggestion/Common_AutoSuggestionGoogle'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ListingDetailSearchLocation extends Component {
  constructor(props) {
    super(props)
    //console.log('screenProps',props.screenProps)
    this.listingDetail = props.screenProps.listingDetail || {}
    this.origin = props.navigation.state.params.origin || ''
    this.state = {
      keyword: '',
      result: []
    }
    this._onBack = this._onBack.bind(this)
    this._onChangeText = this._onChangeText.bind(this)
    this._onGetResult = this._onGetResult.bind(this)
    this._onSelectedData = this._onSelectedData.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextState) != JSON.stringify(this.state))
  }

  _onBack() {
    this.props.navigation.goBack()
  }

  _onChangeText(value) {
    if (this.refs.suggestion) {
      this.refs.suggestion.getAllSuggestions(
        value,
        this.refs.suggestion.generateKeyword(value),
        {
            latitude: this.listingDetail.lat || 0,
            longitude: this.listingDetail.lon || 0,
        }

      );

      this.setState({
        keyword: value
      })
    }
  }

  _onGetResult(result) {
    this.setState({
      result: result
    })
  }

  _onSelectedData(value, index) {
    Keyboard.dismiss()
    //console.log('_onSelectedData in ListingDetailSearchLocation',value);
    this.props.navigation.navigate('ListingDetailSearchDirection', { data: value })
  }

  render() {
    const textStyle = {
      color: 'rgb(39,80,117)'
    }

    var _renderSearchBox = () => {
      return (
        <View style={{ marginVertical: 8 }}>
          {/* origin */}
          <TextBox
            prefix={`From: ${this.origin}`}
            editable={false}
            inputContainerStyle={{
              backgroundColor: 'rgb(255,255,255)',
              paddingHorizontal: 14,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: 'rgb(200,199,204)',
              borderBottomColor: 'rgb(200,199,204)',
              borderRadius: 5,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              justifyContent: "center",
              paddingBottom: 0,
              height: 45,
            }}
            containerStyle={{
              paddingHorizontal: 6,
              paddingVertical: 0,
              marginVertical: 0,
            }}
            inputTextStyle={{
              fontFamily: "Poppins-Light",
              fontSize: 15,
              color: "rgb(155,155,155)",
              textAlign: "left",
              padding: 0,
              height: null,
            }}
            titleTextStyle={{ display: 'none' }}
            errorTextStyle={{ display: 'none' }} />
          {/* dest */}
          <TextBox
            prefix={'To: '}
            autoFocus={true}
            onChangeText={this._onChangeText}
            inputContainerStyle={{
              backgroundColor: 'rgb(255,255,255)',
              paddingHorizontal: 14,
              flexDirection: "row",
              borderWidth: 1,
              borderColor: 'rgb(200,199,204)',
              borderRadius: 5,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              justifyContent: "center",
              paddingBottom: 0,
              height: 45,
            }}
            containerStyle={{
              paddingHorizontal: 6,
              paddingVertical: 0,
              marginVertical: 0
            }}
            inputTextStyle={{
              fontFamily: "Poppins-Light",
              fontSize: 15,
              color: "rgb(47,47,47)",
              textAlign: "left",
              padding: 0,
              height: null,
            }}
            titleTextStyle={{ display: 'none' }}
            errorTextStyle={{ display: 'none' }} />
        </View>
      )
    }

    var _renderSuggestion = () => {
      return (
        <View style={{ backgroundColor: 'rgb(255,255,255)' }}>
          <AutoSuggestion
            district={false}
            hdbtowns={false}
            newlaunches={false}
            ref={'suggestion'}
            onGetResult={this._onGetResult}
            data={this.state.keyword != '' ? this.state.result : []}
            keyword={this.state.keyword}
            selectedData={this._onSelectedData}
            textCategoryStyle={{ textAlign: 'right' }}
          />
        </View>
      )
    }

    return (
      <View style={{ backgroundColor: 'rgb(248,248,248)', flex: 1 }}>
        <View
          style={{
            paddingLeft: 12,
            paddingVertical: 6,
            backgroundColor: 'rgb(255,255,255)',
            height: 32
          }}>
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0)'}
            style={{ width: 115 }}
            onPress={this._onBack}>
            <Text
              allowFontScaling={false}
              style={[
                textStyle,
                {
                  fontSize: 13,
                  fontFamily: 'Poppins-Medium'
                }
              ]}>
              {'< nearby places'}
            </Text>
          </TouchableHighlight>
        </View>
        {_renderSearchBox()}
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}>
          {_renderSuggestion()}
          {/* freespace */}
          <View style={{ height: 70, backgroundColor: 'rgba(0,0,0,0)' }} />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}
