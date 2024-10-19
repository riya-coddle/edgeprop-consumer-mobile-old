import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	TouchableHighlight,
	FlatList
} from 'react-native'
import ListingDirectionListItem from '../Listing_DirectionListItem/Listing_DirectionListItem'


export default class Listing_AmenityList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeItem: 'Walking'
		}
		this.travelMode = 'walking'
		this.directionOptions = []

		this._onItemPress = this._onItemPress.bind(this)
		this._onBack = this._onBack.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (JSON.stringify(nextState) != JSON.stringify(this.state)) return true
		return (nextProps.travelMode != this.props.travelMode ||
			JSON.stringify(nextProps.directionOptions) != JSON.stringify(this.props.directionOptions)
		)
	}

	_init() {
		if (this.props.travelMode != undefined && this.props.travelMode != this.travelMode) {
			this.travelMode = this.props.travelMode
		}
		if (this.props.directionOptions != undefined && JSON.stringify(this.props.directionOptions) != JSON.stringify(this.directionOptions)) {
			this.directionOptions = this.props.directionOptions
		}
	}

	_onItemPress(item) {
		if (this.props.onSelect) {
			this.props.onSelect(item)
		}
		this.setState({
			activeItem: item.type
		})
	}

	_onBack() {
		this.props.onBack()
	}

	render() {
		this._init()

		const textStyle = {
			color: 'rgb(39,80,117)'
		}

		var _renderDirectionListItem = ({ item, index }) => {
			let isActive = item.type === this.state.activeItem
			return (
				<ListingDirectionListItem
					item={item}
					isActive={isActive}
					onPress={this._onItemPress} />
			)
		}

		var _renderFooter = () => {
			return (
				/* freespace */
				<View style={{ height: 430, backgroundColor: 'rgba(0,0,0,0)' }} />
			)
		}

		return (
			<View>
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
								}]}>
							{'< directions'}
						</Text>
					</TouchableHighlight>
				</View>
				<View style={{ paddingHorizontal: 12 }}>
					<FlatList
						bounces={false}
						scrollEnabled={true}
						data={this.directionOptions}
						renderItem={_renderDirectionListItem}
						ListFooterComponent={_renderFooter}
						keyExtractor={(item, index) => index.toString()} />
				</View>
			</View>
		)
	}
}