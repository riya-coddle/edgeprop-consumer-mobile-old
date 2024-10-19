import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	TouchableHighlight,
	ScrollView
} from 'react-native'
import IconMenu from '../Common_IconMenu/Common_IconMenu'
var ArrowIcon = require('../../assets/icons/Right-arrow.png')

const {width, height} = Dimensions.get('window');
export default class Listing_AmenityList extends Component {
	constructor(props) {
		super(props)
		this.amenityType = ''
		this.amenityList = []
		this.travelMode = 'Walking'

		this._onPressAmenityItem = this._onPressAmenityItem.bind(this)
		this._onBack = this._onBack.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (JSON.stringify(nextProps.amenityList) != JSON.stringify(this.props.amenityList))
	}

	_init() {
		if (this.props.amenityList[0] != undefined && this.props.amenityList[0].type != this.amenityType) {
			this.amenityType = this.props.amenityList[0].type
		}
		if (this.props.amenityList != undefined && JSON.stringify(this.props.amenityList) != JSON.stringify(this.amenityList)) {
			this.amenityList = this.props.amenityList
		}
		if (this.props.travelMode != undefined && this.props.travelMode != this.travelMode) {
			this.travelMode = this.props.travelMode
		}
	}

	_onPressAmenityItem(item) {
		if (this.props.onPressAmenityItem) {
			this.props.onPressAmenityItem(item)
		}
	}

	_onBack() {
		if (this.props.onBack) {
			this.props.onBack()
		}
	}

	_getTimeUnit(duration) {
		return ((duration == 1) ? ' min' : ' mins');
	}

	render() {
		this._init()

		const headerStyle = {
			backgroundColor: '#F8F8F8',
			flexDirection: 'row',
			paddingHorizontal: 12,
			height: 45,
			alignItems: 'center'
		}

		const rowStyle = {
			flexDirection: 'row',
			//minHeight: 45,
			paddingHorizontal: 12,
			//paddingVertical: 10,
			backgroundColor: 'rgb(255,255,255)',
			alignItems: 'center'
		}

		const textStyle = {
			color: 'rgb(39,80,117)'
		}

		const rowItems = {
			color: '#414141',
			fontFamily: 'Poppins-Regular',
			fontSize: width*0.03
		}

		const columnStyle = {
			1: { width: '50%' },
			2: { width: '25%', paddingHorizontal: 10 },
			3: { width: '15%', paddingHorizontal: 2 },
			4: { width: '14%' },
		}

		const separatorStyle = {
			borderColor: 'rgb(207,207,207)',
			flex: 1,
			flexDirection: 'row',
			borderWidth: 1
		}

		var _renderHeaderList = () => {
			return (
				<View>
					<View style={headerStyle}>
						<View style={{ width: '50%' }}>
							<Text allowFontScaling={false} style={[textStyle, { fontFamily: 'Poppins-Regular', fontSize: 14 }]}>
								{this.amenityType}
							</Text>
						</View>
						<View style={{ width: '25%' }}>
							<Text allowFontScaling={false} style={[textStyle, { fontFamily: 'Poppins-Light', fontSize: 12 }]}>
								{'Distance'}
							</Text>
						</View>
						<View style={{ width: '15%' }}>
							<Text allowFontScaling={false} style={[textStyle, { fontFamily: 'Poppins-Light', fontSize: 12 }]}>
								{this.travelMode}
							</Text>
						</View>
						<View style={columnStyle['4']} />
					</View>
					{_renderSeparator()}
				</View>
			)
		}

		var _renderAmenityList = () => {
			return (
				<View>
					{
					this.amenityList.map((item, index) => {
						return (
							<View key={index.toString()} style={{ backgroundColor: '#fff' }}>
								<TouchableHighlight
									underlayColor={'#488BF8'}
									disabled={true}
									onPress={() => { this._onPressAmenityItem(item) }} >
									<View style={{ display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
									<View style={{ width: '50%' }}>
									<Text allowFontScaling={false} style={rowItems}>
										{item.title}
									</Text>
									</View>
									<View style={{ width: '25%' }}>
										<Text allowFontScaling={false} style={rowItems}>
											{parseFloat(item.dist).toFixed(2) + 'm'}
										</Text>
									</View>
									<View style={{ width: '15%' }}>
									<Text allowFontScaling={false} style={rowItems}>
										{item.duration? item.duration + this._getTimeUnit(item.duration) : ''}
									</Text>
									</View>
									<View style={columnStyle['4']}>
										<Text allowFontScaling={false}></Text>	
									</View>
									</View>
								</TouchableHighlight>
								{_renderSeparator()}
							</View>
							)
						})
					}
				</View>
			)
		}

		var _renderSeparator = () => {
			return (
				<View style={separatorStyle} />
			)
		}

		return (
			<View>
				{/*<View
					style={{
						paddingLeft: 12,
						paddingVertical: 6,
						backgroundColor: 'rgb(255,255,255)',
						height: 32,
						borderBottomWidth: 0.5,
						borderBottomColor: 'rgba(0,0,0,0.11)',
						shadowColor: '#F8F8F8',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.8,
						shadowRadius: 2,
						elevation: 1
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
							{'< Nearby Places'}
						</Text>
					</TouchableHighlight>
				</View>*/}
				<View>
					<ScrollView>
						{_renderHeaderList()}
						{_renderAmenityList()}
						{/* freespace */}
						<View style={{ height: 170, backgroundColor: 'rgba(0,0,0,0)' }} />
					</ScrollView>
				</View>
			</View>
		)
	}
}