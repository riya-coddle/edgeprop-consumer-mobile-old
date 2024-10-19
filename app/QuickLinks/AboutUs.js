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

import abouUsContent from '../../assets/json/staticScreen/aboutus.json'

const URL_ABOUTUS = 'https://sg.tepcdn.com/web4/public/mobile-data/AboutUs.json'
const TIMEOUT = 1000

class AboutUs extends Component {

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
      aboutUsData: []
    }
  }

  async componentDidMount() {
    //let data = await this._callData(URL_ABOUTUS)
    this.setState({
      aboutUsData: abouUsContent
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
    const AboutUsData = this.state.aboutUsData

    var _renderContent = (Content) => {
      return Object.keys(Content).map(index => {
        return <HTMLText key={index} content={Content[index].content} />
      })
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView bounces={false} contentContainerStyle={{
          paddingTop: 17,
          paddingBottom: 60,
          paddingHorizontal: 10
        }}>
          {_renderContent(AboutUsData)}
        </ScrollView>
      </View>

    )

  }

}


export default AboutUs
