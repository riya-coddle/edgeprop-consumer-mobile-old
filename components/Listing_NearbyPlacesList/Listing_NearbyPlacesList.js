import React, { Component } from 'react'
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	NetInfo,
	Image,
	TouchableHighlight,
	ScrollView
} from 'react-native'
import TextBox from '../Common_TextBox/Common_TextBox'
import NearbyPlacesListItem from '../Listing_NearbyPlacesListItem/Listing_NearbyPlacesListItem'
import { Dropdown } from 'react-native-material-dropdown';

var arrow = require('../../assets/icons/premium-property_active.png');
const {height, width} = Dimensions.get('window');
export default class Listing_NearbyPlacesList extends Component {
	constructor(props) {
		super(props)
		this.style = {}
		this.items = []
		this.groupsItem = []
		this.dropdownOptions = []
		this.type = ''

		this._onItemPress = this._onItemPress.bind(this)
		this._onTextBoxFocus = this._onTextBoxFocus.bind(this)
		this.onChangeType = this.onChangeType.bind(this);
	}

	shouldComponentUpdate(nextProps, nextStete) {
		return (JSON.stringify(nextProps.items) != JSON.stringify(this.props.items))
	}

	_init() {
		if (JSON.stringify(this.props.items) != JSON.stringify(this.items)) {
			this.items = this.props.items
			this.groupsItem = this._createGroupedArray(Object.keys(this.props.items), 1)
			this.dropdownOptions = this._createDropDownOption(Object.keys(this.props.items));
			if(this.type === '' && this.dropdownOptions[0]){
				this.type = this.dropdownOptions[0].value;
				this.onChangeType(this.type);
			}
		}
	}

	_onItemPress(item, option) {
		if (this.props.onItemPress) {
			this.props.onItemPress(item, option)
		}
	}

	_onTextBoxFocus() {
		if (this.props.onTextBoxFocus) {
			this.props.onTextBoxFocus()
		}
	}

	_createGroupedArray(arr, chunkSize) {
		var groups = [], i
		for (i = 0; i < arr.length; i += chunkSize) {
			groups.push(arr.slice(i, i + chunkSize))
		}
		return groups
	}

	_createDropDownOption(arr){
		var options = [], i
		for (i = 0; i < arr.length; i ++) {
			options.push({'value' :arr[i]})
		}
		return options
	}

	onChangeType(option){
		this._onItemPress(this.items[option], option)
	}

	render() {
		this._init()
		const borderStyle = {
			borderColor: 'rgb(231,231,231)',
			borderWidth: 1,
			width: '100%'
		}

		var _renderRow = (listKey) => {
			return (
				<View style={{
					flexDirection: 'row',
					width: '95%',
				}}>
					{
						listKey.map((key, index) => {
							return (
								<View key={index.toString()}>
									<NearbyPlacesListItem
										onPress={this._onItemPress}
										amenityType={key}
										amenityList={this.items[key]} />
								</View>
							)
						})
					}
				</View>
			)
		}

		var _renderListItem = () => {
			return (
				<ScrollView bounces={false}>
					<View>
						{
							this.groupsItem.map((listKey, i) => {
								return (
									<View key={i}>
										{_renderRow(listKey)}
									</View>
								)
							})
						}
					</View>
					{/* freespace */}
					<View style={{ height: 230, backgroundColor: 'rgba(0,0,0,0)' }} />
				</ScrollView>
			)
		}


		var _renderDropDown = () => {
			return (
				<View style={styles.dropdownCustom}>
                   <Dropdown
                   		allowFontScaling={false} 
                        data={this.dropdownOptions}
                        value={this.type}
                        baseColor={'#414141'}
                        selectedItemColor={'#414141'}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        textColor={'#414141'}
                        itemColor={'#414141'}
                        onChangeText={this.onChangeType}
                        fontFamily={'Poppins-Regular'}
                        dropdownPosition={1}
                        labelHeight={0}
                        itemCount={this.dropdownOptions.length}
                        fontSize={width * 0.03}
                      />
                    
                </View> 
			)
		}

		return (
			<View style={{ paddingLeft: 30, paddingRight: 30, backgroundColor: '#F2F4F8' }}>
				<Text allowFontScaling={false} style={{ color: '#A0ACC1',
						      fontSize: 16,
						      paddingTop: 25,
						      letterSpacing: 1.5,
						      fontWeight: '100',
						      fontFamily: 'Poppins-Regular',
						      textAlign: 'center',
						      paddingBottom: 10 
						  }}>
						  WHAT'S NEARBY
				</Text>						
				{/*<TextBox
					editable={true}
					pointerEvents={'none'}
					onPress={this._onTextBoxFocus}
					placeholder={'Search here'}
					inputContainerStyle={{
						backgroundColor: 'rgb(255,255,255)',
						paddingHorizontal: 14,
						flexDirection: "row",
						flexShrink: 0,
						borderWidth: 1,
						borderColor: "rgb(238,238,238)",
						borderRadius: 5,
						justifyContent: "center",
						paddingBottom: 0,
						height: 45,
					}}
					isLocation={true}
					inputTextStyle={{
						fontFamily: "Poppins-Light",
						fontSize: 15,
						color: "rgb(155,155,155)",
						textAlign: "left",
						padding: 0,
						height: null,
					}}
					titleTextStyle={{ display: 'none' }}
					errorTextStyle={{ display: 'none' }} />*/}
				
				<View style={{ backgroundColor: '#F2F4F8', paddingTop: 5 }}>
					{/*_renderListItem()*/}
					{_renderDropDown()}
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
    
    dropdownCustom: {
       height: 55, 
       borderWidth: 1, 
       borderColor: '#D3D3D3', 
       marginBottom: 15, 
       borderRadius: 3, 
       paddingRight: 12,
       paddingLeft: 17,
       width: '100%',
       paddingTop: 15,
     }
  


})