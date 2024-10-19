import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import Common_CardMenuListItem from '../Common_CardMenuListItem/Common_CardMenuListItem'
class Common_CardMenuList extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.style = {}
        this.data = []
        this._onPressItem = this._onPressItem.bind(this)
    }

    _initItem(){
        //init data
        if (this.props.data && this.props.data != this.data){
            this.data = this.props.data
        }
    }

    shouldComponentUpdate(nextProps){
        // return(nextProps.data.MenuItem!=this.props.data.MenuItem)
        return true
    }
    _onPressItem(title, screen){
      if(this.props.onPressItem!=undefined){
        this.props.onPressItem(title, screen)
      }
    }

    render() {
        this._initItem()
        console.log(this.data);
        var CardArr = this.data.map((data, index) => {
            //Alert.alert(data.icon)
              return(
                    <Common_CardMenuListItem
                      title={data.title}
                      subTitle={data.subTitle}
                      key={index}
                      icon={data.icon}
                      screen={data.screen || ""}
                      onPressItem={this._onPressItem}
                    />
                )
          });
        return(
            <View>
                {CardArr}
            </View>
        )
    }
}
export default Common_CardMenuList
