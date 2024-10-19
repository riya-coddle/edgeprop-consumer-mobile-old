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

import contactUsContent from '../../assets/json/staticScreen/contactUs.json'

const URL_CONTACTUS = 'https://sg.tepcdn.com/web4/public/mobile-data/ContactUs.json'
const TIMEOUT = 1000

class ContactUs extends Component {
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
      contactUsData: []
    }
  }

  async componentDidMount() {
    //let data = await this._callData(URL_CONTACTUS)
    this.setState({
      contactUsData: contactUsContent
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
    const ContactUsData = this.state.contactUsData

    var _renderContent = (Content) => {
      return Object.keys(Content).map(index => {
        return (
          <View key={index} style={{ marginBottom: 5 }}>
            <HTMLText content={Content[index].content} />
          </View>
        )
      })
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView bounces={false} contentContainerStyle={{
          paddingTop: 17,
          paddingBottom: 60,
          paddingHorizontal: 10
        }}>
          {_renderContent(ContactUsData)}
        </ScrollView>
      </View>

    )

  }

}


export default ContactUs
