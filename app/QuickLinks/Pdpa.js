import React, {
  Component
} from 'React'

import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Keyboard,
  WebView,
  ScrollView,
  Linking
} from 'react-native'
import StatusBarBackground from '../../components/Common_iOSStatusBar/Common_iOSStatusBar'

const URL_PRIVACYPOLICY = 'https://sg.tepcdn.com/web4/public/mobile-data/PrivacyPolicy.json'
const TIMEOUT = 1000
import privacyContent from '../../assets/json/staticScreen/privacy.json'

class Pdpa extends Component {

  static navigationOptions = ({ navigation }) => {
    var { state, setParams } = navigation;
    var { params } = state
    return {
      title: params.title.toUpperCase()
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      privacyPolicyData: []
    }
    this.paraStyle = {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      textAlign: 'left',
      marginTop: 10
    }
    this.titleStyle = {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'left',
      marginTop: 10,
      marginBottom: 10
    }
    this.subtitleStyle = {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'left',
      marginTop: 30
    }
    this._handleHyperLink = this._handleHyperLink.bind(this)
  }

  async componentDidMount() {
    //let data = await this._callData(URL_PRIVACYPOLICY)
    this.setState({
      privacyPolicyData: privacyContent
    })
  }

  async _callData(url) {
    let resp = await fetch(url, {
      method: 'GET',
      timeout: TIMEOUT
    })
    console.log('resp', resp)
    let respJSON = await resp.json()

    return respJSON
  }

  _handleHyperLink(url) {
    if (url.length > 0) {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));
    }
  }

  render() {
    const PrivacyPolicy = this.state.privacyPolicyData

    var _renderPrivacyPolicy = () => {
      return Object.keys(PrivacyPolicy).map(index => {
        if (PrivacyPolicy[index].type == 'para') {
          return (
            <Text allowFontScaling={false} key={index} style={this.paraStyle}>
              {PrivacyPolicy[index].content.replace(/&nbsp;/g, ' ')}
            </Text>
          )
        }
        else if (PrivacyPolicy[index].type == 'title') {
          return (
            <Text allowFontScaling={false} key={index} style={this.titleStyle}>
              {PrivacyPolicy[index].content.replace(/&nbsp;/g, ' ')}
            </Text>
          )
        }
        else if (PrivacyPolicy[index].type == 'subtitle') {
          return (
            <Text allowFontScaling={false} key={index} style={this.subtitleStyle}>
              {PrivacyPolicy[index].content.replace(/&nbsp;/g, ' ')}
            </Text>
          )
        }
        else if (PrivacyPolicy[index].type == 'link') {
          var matches = PrivacyPolicy[index].content.match(/<a([^>]+)>(.+?)<\/a>/)
          //get the normal text
          var normalText = PrivacyPolicy[index].content.replace(matches[0], "")
          var texts = [normalText, matches[0]]
          var _renderSpecialTexts = (texts) => {
            return Object.keys(texts).map(index => {
              if (texts[index].length > 0) {
                var isLink = /href=\"(.*?)\"/.test(texts[index])
                var hyperLinks = texts[index].match(/href=\"(.*?)\"/)
                var hyperLink = ""
                if (hyperLinks != null && hyperLinks.length > 0) {
                  hyperLink = hyperLinks[0].replace(/href=/g, "").replace(/\"/g, "")
                }
                return (
                  <Text
                    allowFontScaling={false}
                    key={index}
                    style={[this.paraStyle, {
                      color: isLink ? '#005c98' : '#444444',
                    }]}
                    onPress={() => {
                      if (isLink && hyperLink.length > 0) {
                        this._handleHyperLink(hyperLink)
                      }
                    }}>
                    {texts[index].replace(/<(?:.|\n)*?>/gm, '')}
                  </Text>
                )
              }
            })
          }

          return (
            <Text allowFontScaling={false} key={index} style={this.paraStyle}>
              {_renderSpecialTexts(texts)}
            </Text>
          )


        }
      })
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView bounces={false} contentContainerStyle={{
          paddingTop: 17,
          paddingBottom: 60,
          paddingHorizontal: 10
        }}>
          {_renderPrivacyPolicy()}
        </ScrollView>
      </View>

    )

  }

}


export default Pdpa
