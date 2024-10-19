import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	TouchableHighlight
} from 'react-native'
import ListingNearbyPlacesList from '../Listing_NearbyPlacesList/Listing_NearbyPlacesList'


export default class Listing_NearbyPlacesListItem extends Component {
	constructor(props) {
		super(props)
		this.amenityType = props.amenityType || ''
		this.amenityList = []
		this.range = []

		this._onPress = this._onPress.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (JSON.stringify(nextProps.amenityList) != JSON.stringify(this.props.amenityList))
	}

	_init() {
		if (this.props.amenityList != undefined) {
			this.amenityList = this.props.amenityList
			// calculate estimated time , then append to array object
			this.amenityList = this.amenityList.map(item => {
				return {
					...item,
					duration: this._estimatedTime(item.dist)
				}
			})
			// get range of estimatedtime, for example: 2-3 mins, 4-7 mins, etc
			// this function will return array of the min and maximum
			this.range = this._getRangeEstimatedTime(this.amenityList)
		}
	}

	_onPress() {
		if (this.props.onPress) {
			this.props.onPress(this.amenityList)
		}
	}

	_estimatedTime(dist) {
		let duration = parseInt(parseFloat(dist) / 83);
		duration = duration < 1 ? 1 : duration;

		return duration
	}

	_getTimeUnit(duration) {
		if (duration.length > 1) {
			return ' mins'
		}
		else {
			return ((duration[0] == 1) ? ' min' : ' mins');
		}
	}

	_getRangeEstimatedTime(amenityList) {
		if (amenityList.length > 0) {
			let min = amenityList[0].duration
			let max = amenityList[0].duration

			if (amenityList.length == 1) return [amenityList[0].duration]
			for (i = 1; i < amenityList.length; i++) {
				if (amenityList[i].duration < min) min = amenityList[i].duration
				if (amenityList[i].duration > max) max = amenityList[i].duration
			}
			if (min == max) return [min]
			return [min, max]
		}
		return []
	}

	_onIconSelect(key){
        var iconFile = '/';
		switch(key){
            case 'ATMs':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_atm.png')
                break;
            case 'Bank Branches':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_bank.png')
                break;
            case 'Bus Stops':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_bus.png')
                break;
            case 'Bus Terminals':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_bus.png')
                break;
            case 'Childcare Centres':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_daycare.png')
                break;
            case 'Clinics':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_firstaid.png')
                break;
            case 'Community Clubs':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_communitycentre.png')
                break;
            case 'Convenience Stores':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_grocery.png')
                break;
            case 'Dentists':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_dentist.png')
                break;
            case 'Groceries':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_supermarket.png')
                break;
            case 'Higher Education':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_university.png')
                break;
            case 'Hospitals':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_hospital.png')
                break;
            case 'Home':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_deptstore.png')
                break;
            case 'International Schools':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_university.png')
                break;
            case 'Kindergartens':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_daycare.png')
                break;
            case 'LRTs':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_train.png')
                break;
            case 'Libraries':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_bookstore.png')
                break;
            case 'MRTs':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_train.png')
                break;
            case 'National Parks':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_park.png')
                break;
            case 'Petrol Stations':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_gasstation.png')
                break;
            case 'Preschools':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_school.png')
                break;
            case 'Private School':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_university.png')
                break;
			case 'Prominent Hawker Centres':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_food.png')
                break;
			case 'Schools':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_university.png')
                break;
			case 'Shopping Malls':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_deptstore.png')
                break;
			case 'Sports Clubs':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_soccer.png')
                break;
			case 'Train Stations':
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_train.png')
                break;
			case 'Eateries':
				iconFile = require('../../assets/icons/aminities/icon-mobile/ico_food.png')
				break;
			case 'Police Station':
				iconFile = require('../../assets/icons/aminities/icon-mobile/ico_hospital.png')
				break;
            default:
                iconFile = require('../../assets/icons/aminities/icon-mobile/ico_deptstore.png')
        }
		return iconFile;
    }

	_getAmenityIcon(type, view = "marker") {
		let domain = 'http://sg.tepcdn.com/'
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
		console.log(type,domain + iconBase + view_type + iconMapping[type]);
		return domain + iconBase + view_type + iconMapping[type];
	}

	render() {
		this._init()
		const containerStyle = {
			backgroundColor: '#F2F4F8'
		}

		const textStyle = {
			fontFamily: 'Poppins-Medium',
			color: 'rgb(47,47,47)'
		}

		return (
			<TouchableHighlight
				style={containerStyle}
				onPress={this._onPress}
				underlayColor={'rgba(0,0,0,0)'}>
				<View style={{
					flexDirection: 'row',
					marginVertical: 5,
					paddingTop: 8,
					paddingBottom: 8,
					width: '100%'

				}}>
				
					<View style={{ display: 'flex' , flexDirection: 'row', justifyContent:'space-between', width: '100%'}}>
						<View style={{ 	borderBottomWidth: 1, borderColor: '#ACACAC',  width: '80%'}}>
						<Text
							allowFontScaling={false}
							style={[
								textStyle,
								{ fontSize: 15,  fontFamily: 'Poppins-Regular' }
							]}>
							{this.amenityType}
						</Text>
						</View>
						<View>
						<Image
							style={{ width: 22, height: 22 }}
					        source={require('../../assets/icons/Right-arrow.png')}
					        />
					    </View>    		
					</View>
				</View>
			</TouchableHighlight>
		)
	}
}
