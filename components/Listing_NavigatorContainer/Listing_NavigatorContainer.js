import React, { Component } from 'react'
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	NetInfo,
	TouchableHighlight,
	ScrollView
} from 'react-native'
import ListingNearbyPlacesList from '../Listing_NearbyPlacesList/Listing_NearbyPlacesList'
import ListingAmenityList from '../Listing_AmenityList/Listing_AmenityList'

export default class Listing_NavigatorContainer extends Component {
	constructor(props) {
		super(props)
		this.listingTitle = props.listingTitle || ''
		this.state = {
			level: 0,
			dataLevel1: []
		}
		this.items = []

		this._handleOnItemPress = this._handleOnItemPress.bind(this)
		this._onPressAmenityItem = this._onPressAmenityItem.bind(this)
		this._handleOnBack = this._handleOnBack.bind(this)
		this._handleOnTextBoxFocus = this._handleOnTextBoxFocus.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (JSON.stringify(nextState) != JSON.stringify(this.state)) return true

		return ((JSON.stringify(nextProps.items) != JSON.stringify(this.items)) ||
			(nextProps.listingTitle != this.props.listingTitle))
	}

	_init() {
		if (this.props.listingTitle != undefined && this.props.listingTitle != this.listingTitle) {
			this.listingTitle = this.props.listingTitle
		}
		if (this.props.items != undefined && JSON.stringify(this.props.items) != JSON.stringify(this.items)) {
			this.items = this.props.items
		}
	}

	_handleOnItemPress(item, type) {
		this.setState({
			level: 1,
			dataLevel1: item
		})
		if(this.props.onChooseType){
			this.props.onChooseType(type)
		}
	}

	_onPressAmenityItem(item) {
		if (this.props.onPressAmenityItem) {
			this.props.onPressAmenityItem(item)
		}
	}

	_handleOnBack() {
		this.setState({
			level: 0
		})
		if(this.props.calcFun){
			this.props.calcFun(this.items);
		}
	}

	_handleOnTextBoxFocus() {
		this.props.navigation.navigate('ListingDetailSearchLocation', {
			origin: this.listingTitle,
			onBack: this._handleOnBack
		})
	}

	render() {
		this._init()

		const containerStyle = {
			backgroundColor: 'rgb(248,248,248)',
			flex: 1
		}
		return (
			<View style={containerStyle}>
					<View>
						<ListingNearbyPlacesList
							items={this.items}
							onItemPress={this._handleOnItemPress}
							onTextBoxFocus={this._handleOnTextBoxFocus} 
							 />
					</View>
					<View>
						<ListingAmenityList
							amenityList={this.state.dataLevel1}
							onBack={this._handleOnBack}
							onPressAmenityItem={this._onPressAmenityItem} 
							 />
					</View>
				</View>
		)
	}
}