import React, { Component } from 'react'
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    NetInfo,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import styles from './RelatedPropertyListStyle.js';

class RelatedProperty_List extends Component { 
	constructor(props) {
      super(props)
      this.state = {
      }
      this._formatNumber = this._formatNumber.bind(this);
      this._formatMoney = this._formatMoney.bind(this);
      this._handleOnPressItem = this._handleOnPressItem.bind(this)
  	}

  	_formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    _handleOnPressItem(item, index) {
        if (this.props.onPressItem) {
            this.props.onPressItem(item, index)
        }
        else {
            Alert.alert("Coming Soon", `${item.title}, this feature will be coming soon`);
        }
    }

	render() {
		let allData = this.props.items;
		let rowOne = this.props.items.slice(0,2)
		let rowtow = allData.slice(2,4)
    let imageUri = '../../assets/icons/No_Img.jpg';
		return (
			<View style={styles.container}>
				<Text allowFontScaling={false} style={styles.containerTitle}>Similar Listing</Text>
				<View style={styles.itemContainer}>	
				{rowtow && rowtow.map((item, i) => {
                  return (
                  <View style={styles.itemList}key={i}>
      							<View style={styles.imageContainer}>
      								<Image
      						          style={{width: '100%', height: 100}}
      						          source={{uri: item.field_prop_images_txt && item.field_prop_images_txt != ''?item.field_prop_images_txt[0]: imageUri}}
      						        />
      							</View>
      							<View>
      								<Text allowFontScaling={false} style={styles.itemTitle}>{item.title_t?item.title_t:''}</Text>
      								<Text allowFontScaling={false}>{item.district_s_lower?item.district_s_lower:''} , {item.state_s_lower?item.state_s_lower:''}</Text>
      								<Text allowFontScaling={false}>{this._formatMoney(Math.trunc(item.field_prop_asking_price_d))}</Text>
      							</View>
      						</View>		
                  )
               })}
               </View>
               <View style={styles.itemContainer}>
               {rowOne && rowOne.map((item, i) => {
                  return (
      						<View style={styles.itemList} key={i}>
      							<View style={styles.imageContainer}>
      								<Image
      						          style={{width: '100%', height: 100}}
      						          source={{uri: item.field_prop_images_txt && item.field_prop_images_txt != ''?item.field_prop_images_txt[0]: imageUri}}
      						        />
      							</View>
      							<View>
      								<Text allowFontScaling={false} style={styles.itemTitle}>{item.title_t?item.title_t:''}</Text>
      								<Text allowFontScaling={false}>{item.district_s_lower?item.district_s_lower:''} , {item.state_s_lower?item.state_s_lower:''}</Text>
      								<Text allowFontScaling={false}>{this._formatMoney(Math.trunc(item.field_prop_asking_price_d))}</Text>
      							</View>
      						</View>
                  )
               })}
               </View>	  
			</View>
		);
	}


}

export default  RelatedProperty_List ;