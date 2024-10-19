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
import HTMLText from '../../components/Common_HTMLText/Common_HTMLText'

const URL_TC = 'https://sg.tepcdn.com/web4/public/mobile-data/TermsAndConditions.json'
const TIMEOUT = 1000

import tcContent from '../../assets/json/staticScreen/tc.json'

class TC extends Component {
  static navigationOptions = ({ navigation }) => {
    var { state, setParams } = navigation;
    var { params } = state
    return {
      title: params.title.toUpperCase(),
    }
  };

  constructor(props) {
    super(props)
    this.state = {
      tcData: []
    }
    this.titleStyle = {
      fontSize: 13,
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'center',
      marginTop: 3,
      marginBottom: 3
    }
  }

  async componentDidMount() {
    //let data = await this._callData(URL_TC)
    this.setState({
      tcData: tcContent
    })
  }

  async _callData(url) {
    let resp = await fetch(url, {
      method: 'GET',
      timeout: TIMEOUT
    })
    let respJSON = await resp.json()

    return respJSON
  }

  render() {
    const TCData = this.state.tcData

    var _renderContent = (Content) => {
      return Object.keys(Content).map(index => {
        return (
          <View key={index} style={{ marginBottom: 5 }}>
            <HTMLText content={Content[index].content} />
          </View>
        )
      })
    }

    var _renderTitle = () => {
      return <HTMLText content={TCData[0].content} />
    }

    var _renderContentTitle = () => {
      return (
        <View style={{ marginTop: 5, marginBottom: 5 }}>
          <Text allowFontScaling={false} style={this.titleStyle}>{TCData[1].content}</Text>
          <Text allowFontScaling={false} style={this.titleStyle}>{TCData[2].content}</Text>
          {/* <HTMLText content={'<h2><strong>THE EDGE PROPERTY WEBSITE (the “Website”)</strong></h2>'} />
          <HTMLText content={'<h2><strong>TERMS AND CONDITIONS (the “Terms and Conditions”)</strong></h2>'} /> */}
        </View>
      )
    }

    if (TCData.length == 0) return <View />

    return (
      <View style={{ flex: 1 }}>
        <ScrollView bounces={false} contentContainerStyle={{
          paddingTop: 17,
          paddingBottom: 60,
          paddingHorizontal: 10
        }}>
          {_renderTitle()}
          {_renderContentTitle()}
          {_renderContent(TCData.slice(3, TCData.length))}
        </ScrollView>
      </View>

    )

  }

}


export default TC
