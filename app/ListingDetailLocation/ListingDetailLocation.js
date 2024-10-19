import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	NetInfo,
	TouchableHighlight,
	Platform,
} from 'react-native'
import MapView from '../../components/Common_GoogleMaps/Common_GoogleMaps'
import ListingNavigatorContainer from '../../components/Listing_NavigatorContainer/Listing_NavigatorContainer'
import Image from '../../components/Common_Image/Common_Image'

const CENTER_LAT_DEFAULT = 3.0832901
const CENTER_LNG_DEFAULT = 101.7080002
const CENTER_LATDELTA_DEFAULT = 0.5
const CENTER_LNGDELTA_DEFAULT = 0.3

export default class ListingDetailLocation extends Component {
	constructor(props) {
		super(props)
		this.listingDetail = props.screenProps.listingDetail || {}
		this.destinations = props.screenProps.destinations || []
		this.state = {
			destination: {},
			reload: 0,
			isMapReady: false,
			showNearBy: props.screenProps.showNearBy,
			aminityType: ''
		}

		this._handleOnPressAmenitiesItem = this._handleOnPressAmenitiesItem.bind(this)
		this._handleOnChangeDirection = this._handleOnChangeDirection.bind(this)
		//console.log('this.destinations', this.destinations);
		this.onMapLayout = this.onMapLayout.bind(this)
		this._chooseType = this._chooseType.bind(this);
	}

	_handleOnPressAmenitiesItem(item) {
//console.log('item',item);
		this.setState({
			destination: item
		})
	}

	_chooseType(type){
		this.setState({
			aminityType: type
		})
	}

	_handleOnChangeDirection(start, dest, mid, coords) {
		// calculation for refocus the direction
		// let constantFactor = 0.0015

		// this.refs.mapview.animateToRegion({
		// 	latitude: mid.latitude,
		// 	longitude: mid.longitude,
		// 	latitudeDelta: mid.latitudeDelta + constantFactor,
		// 	longitudeDelta: mid.longitudeDelta + constantFactor
		// })
		//console.log('_handleOnChangeDirection')
		this.refs.mapview.fitToCoordinates([start, dest, mid, ...coords], {
			edgePadding: {
				top: (dest.latitude>start.latitude ? 100 : 40),
				right: 40,
				bottom: 40,
				left: 40
			},
			animated: true
		})
	}

	_groupingType(objs, groupingBy) {
		return objs.reduce((accumulator, currentValue) => {
			(accumulator[currentValue[groupingBy]] = accumulator[currentValue[groupingBy]] || []).push(currentValue)
			return accumulator
		}, {})
	}

	_onIconSelect(key){
        var iconFile = '/';
		switch(key){
            case 'ATMs':
                iconFile = require('../../assets/icons/aminities/mobile/atm.png')
                break;
            case 'Bank Branches':
                iconFile = require('../../assets/icons/aminities/mobile/bank.png')
                break;
            case 'Bus Stops':
                iconFile = require('../../assets/icons/aminities/mobile/bus.png')
                break;
            case 'Bus Terminals':
                iconFile = require('../../assets/icons/aminities/mobile/bus.png')
                break;
            case 'Childcare Centres':
                iconFile = require('../../assets/icons/aminities/mobile/daycare.png')
                break;
            case 'Clinics':
                iconFile = require('../../assets/icons/aminities/mobile/firstaid.png')
                break;
            case 'Community Clubs':
                iconFile = require('../../assets/icons/aminities/mobile/communitycentre.png')
                break;
            case 'Convenience Stores':
                iconFile = require('../../assets/icons/aminities/mobile/grocery.png')
                break;
            case 'Dentists':
                iconFile = require('../../assets/icons/aminities/mobile/dentist.png')
                break;
            case 'Groceries':
                iconFile = require('../../assets/icons/aminities/mobile/supermarket.png')
                break;
            case 'Higher Education':
                iconFile = require('../../assets/icons/aminities/mobile/university.png')
                break;
            case 'Hospitals':
                iconFile = require('../../assets/icons/aminities/mobile/hospital.png')
                break;
            case 'Home':
                iconFile = require('../../assets/icons/aminities/mobile/home.png')
                break;
            case 'International Schools':
                iconFile = require('../../assets/icons/aminities/mobile/university.png')
                break;
            case 'Kindergartens':
                iconFile = require('../../assets/icons/aminities/mobile/daycare.png')
                break;
            case 'LRTs':
                iconFile = require('../../assets/icons/aminities/mobile/train.png')
                break;
            case 'Libraries':
                iconFile = require('../../assets/icons/aminities/mobile/bookstore.png')
                break;
            case 'MRTs':
                iconFile = require('../../assets/icons/aminities/mobile/train.png')
                break;
            case 'National Parks':
                iconFile = require('../../assets/icons/aminities/mobile/park.png')
                break;
            case 'Petrol Stations':
                iconFile = require('../../assets/icons/aminities/mobile/gasstation.png')
                break;
            case 'Preschools':
                iconFile = require('../../assets/icons/aminities/mobile/school.png')
                break;
            case 'Private School':
                iconFile = require('../../assets/icons/aminities/mobile/university.png')
                break;
			case 'Prominent Hawker Centres':
                iconFile = require('../../assets/icons/aminities/mobile/food.png')
                break;
			case 'Schools':
                iconFile = require('../../assets/icons/aminities/mobile/university.png')
                break;
			case 'Shopping Malls':
                iconFile = require('../../assets/icons/aminities/mobile/deptstore.png')
                break;
			case 'Sports Clubs':
                iconFile = require('../../assets/icons/aminities/mobile/soccer.png')
                break;
			case 'Train Stations':
                iconFile = require('../../assets/icons/aminities/mobile/train.png')
                break;
			case 'PointA':
                iconFile = require('../../assets/icons/aminities/mobile/Point-A.png')
                break;
			case 'PointB':
                iconFile = require('../../assets/icons/aminities/mobile/Point-B.png')
                break;
			case 'Eateries':
				iconFile = require('../../assets/icons/aminities/mobile/food.png')
				break;
			case 'Police Station':
				iconFile = require('../../assets/icons/aminities/mobile/policeMapIcon.png')
				break;
            default:
                iconFile = require('../../assets/icons/aminities/mobile/iconProperty.png')
        }
		return iconFile;
    }

	_getAmenityIcon(type, view = "marker") {
		let domain = 'http://sg.tepcdn.com/';
		let iconBase = 'web4/public/img/' + ((view != "marker") ? 'icons_marker/' : 'icons_marker_mobile/');
		let view_type = (view != "marker") ? "ico_" : "";
		let iconMapping = {
			'ATMs': 'atm.png',
			'Bank Branches': 'bank.png',
			'Bus Stops': 'bus.png',
			'Bus Terminals': 'bus.png',
			'Childcare Centres': 'daycare.png',
			'Clinics': 'firstaid.png',
			'Community Clubs': 'communitycentre.png',
			'Convenience Stores': 'grocery.png',
			'Dentists': 'dentist.png',
			'Groceries': 'supermarket.png',
			'Higher Education': 'university.png',
			'Hospitals': 'hospital.png',
			'Home': 'home.png',
			'International Schools': 'university.png',
			'Kindergartens': 'daycare.png',
			'LRTs': 'train.png',
			'Libraries': 'bookstore.png',
			'MRTs': 'train.png',
			'National Parks': 'park.png',
			'Petrol Stations': 'gasstation.png',
			'Preschools': 'school.png',
			'Private School': 'university.png',
			'Prominent Hawker Centres': 'food.png',
			'Schools': 'university.png',
			'Shopping Malls': 'deptstore.png',
			'Sports Clubs': 'soccer.png',
			'Train Stations': 'train.png',
			'PointA': 'Point-A.png',
			'PointB': 'Point-B.png',
		};
		//console.log(type,domain + iconBase + view_type + iconMapping[type]);
		return domain + iconBase + view_type + iconMapping[type];
	}

	_forceUpdate() {
		//console.log('_forceUpdate')
		this.setState({
			reload: this.state.reload + 1
		})
	}
	onMapLayout = () => {
    	this.setState({ isMapReady: true });
    }
	render() {
		//console.log('this,.this', this.props)
		_renderPlacesMarker = () => {
			let isAndroid = Platform.OS == 'android'
			//let destinations = this.destinations.filter(destination => destination.type == this.state.aminityType);	
			let destinations = this.destinations.filter(destination => { if (destination.type == this.state.aminityType) return destination} );
			return destinations.map((item, i) => {
				let dest = item
				if(dest.lat > 0 && dest.lon >0) {
					let coord = { latitude: Number(dest.lat), longitude: Number(dest.lon) }
					if(!Number(dest.lat) || !Number(dest.lon)){
						console.log('something wrong',dest);
					}
					
					let isShowCallout = (
						(dest.lat === this.state.destination.lat) &&
						(dest.lon === this.state.destination.lon)
					)
					return (
						<MapView.Marker
							image={isAndroid ?  this._onIconSelect(dest.type)  : null}
							key={i.toString()}
							style={{ zIndex: i }}
							isShowCallout={isShowCallout}
							coordinate={coord}>
							{
								isAndroid ? null :
									<Image
										onLoad={() => this._forceUpdate()}
										style={{ width: 32, height: 37, }}
										source={ this._onIconSelect(dest.type) }
										resizeMode={'contain'} />
							}

							<MapView.Callout
								style={styles.callout}
								tooltip={false}>
								<View style={{ maxWidth: 150 }}>
									<Text allowFontScaling={false}
										style={{
											width: '100%',
											fontFamily: 'Poppins-Regular'
										}}>
										{item.title}
									</Text>
								</View>
							</MapView.Callout>
						</MapView.Marker>
					)	
				}
				
			})
		}

		_renderHomeMarker = () => {
			let isAndroid = Platform.OS == 'android'
			return (
				<MapView.Marker
					coordinate={{
						latitude: this.listingDetail.lat || 0,
						longitude: this.listingDetail.lon || 0,
					}}>
					{/*<Image
								onLoad={() => this._forceUpdate()}
								style={{ width: 32, height: 37, }}
								source={ this._onIconSelect('Home') }
								resizeMode={'contain'} />*/}

					<MapView.Callout
						style={styles.callout}
						tooltip={false}>
						<View style={{ maxWidth: 150 }}>
							<Text allowFontScaling={false}
								style={{
									width: '100%',
									fontFamily: 'Poppins-Regular'
								}}>
								{this.listingDetail.title}
							</Text>
						</View>
					</MapView.Callout>
				</MapView.Marker>
			)
		}

		return (
			<View style={{ backgroundColor: '#FFF', flex: 1 }}>
				{/*{this.state.showNearBy && (<ListingNavigatorContainer
					navigation={this.props.navigation}
					listingTitle={this.listingDetail.title}
					onPressAmenityItem={this._handleOnPressAmenitiesItem}
					onChooseType={this._chooseType}
					items={this._groupingType(this.destinations, 'type')}
					calcFun={this.props.screenProps.calcFun} />)}*/}
				<View style={{ height: Dimensions.get('window').height * 0.4 , backgroundColor: '#FFF'}}>
					<MapView
						ref={'mapview'}
						mapStyle={styles.map}
						initialRegion={{
							latitude: CENTER_LAT_DEFAULT,
							longitude: CENTER_LNG_DEFAULT,
							latitudeDelta: CENTER_LATDELTA_DEFAULT,
							longitudeDelta: CENTER_LNGDELTA_DEFAULT
						}}
						region={{
							latitude: this.listingDetail.lat?this.listingDetail.lat:0,
							longitude: this.listingDetail.lon?this.listingDetail.lon:0,
							latitudeDelta: 0.0122,
							longitudeDelta: 0.0121
						}}
						onLayout={this.onMapLayout}
						>
						
						{/* render home marker */}
						{this.state.isMapReady && _renderHomeMarker()}
						{/* render all nearby amenity marker */}
						{/*this.state.showNearBy && this.state.isMapReady && _renderPlacesMarker()*/}
						
						{this.state.isMapReady && 
						<MapView.Direction
							startMarker={ this._onIconSelect('PointA') }
							destMarker={ this._onIconSelect('PointB') }
							onError={() => this._forceUpdate()}
							onChangeDirection={this._handleOnChangeDirection}
							travelMode={'walking'}
							origin={{
								latitude: this.listingDetail.lat?this.listingDetail.lat:0,
								longitude: this.listingDetail.lon?this.listingDetail.lon:0
							}}
							dest={{
								latitude: this.state.destination.lat?this.state.destination.lat:0,
								longitude: this.state.destination.lon?this.state.destination.lon:0
							}}
						/>
						}
					</MapView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		flex: 1,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.4,
	},
	callout: {
		flex: 1,
		...Platform.select({
			ios: { position: 'relative' },
			android: {}
		})
	}
})
