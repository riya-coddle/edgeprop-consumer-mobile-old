import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  NetInfo,
  TouchableHighlight,
  Platform
} from 'react-native'
import MapView from '../../components/Common_GoogleMaps/Common_GoogleMaps'
import Image from '../../components/Common_Image/Common_Image'
import ListingDirectionList from '../../components/Listing_DireactionList/Listing_DirectionList'
var walking = require('../../assets/icons/direction-icons/Walking-inactive.png')
var walkingActive = require('../../assets/icons/direction-icons/Walking-active.png')
var publicTransport = require('../../assets/icons/direction-icons/PublicTransport-inactive.png')
var publicTransportActive = require('../../assets/icons/direction-icons/PublicTransport-active.png')
var car = require('../../assets/icons/direction-icons/Car-inactive.png')
var carActive = require('../../assets/icons/direction-icons/Car-active.png')
const TIMEOUT = 1000
const CENTER_LAT_DEFAULT = 3.0832901
const CENTER_LNG_DEFAULT = 101.7080002
const CENTER_LATDELTA_DEFAULT = 0.5
const CENTER_LNGDELTA_DEFAULT = 0.3
const GOOGLE_API_KEY = 'AIzaSyD0Gf8jcdq-X9ElDG-p7aojhnM7E1-fzDI'

export default class ListingDetailSearchDirection extends Component {
  constructor(props) {
    super(props)
    this.listingDetail = props.screenProps.listingDetail || {}
    this.destinations = props.screenProps.destinations || []
    this.state = {
      destination: {},
      travelMode: 'walking',
      directionOptions: [],
      reload: 0
    }
    this.locationInfo = props.navigation.state.params.data || {}
    this.svy21 = SVY21
    this._onSelect = this._onSelect.bind(this)
    this._handleOnBack = this._handleOnBack.bind(this)
    this._handleOnChangeDirection = this._handleOnChangeDirection.bind(this)
  }

  async componentDidMount() {
    this.svy21.init()
    let lat = parseFloat(this.locationInfo.lat)
    let lon = parseFloat(this.locationInfo.lon)
    if (lat && lon) {
      let locObj = { lat: lat , lon: lon }; //this.svy21.computeLatLon(y, x)
      let origin = `${this.listingDetail.lat},${this.listingDetail.lon}`
      let dest = `${locObj.lat},${locObj.lon}`
      let urlWalking = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${dest}&mode=walking&key=${GOOGLE_API_KEY}`
      let urlTransit = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&mode=transit&key=${GOOGLE_API_KEY}`
      let urlDriving = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${dest}&mode=driving&key=${GOOGLE_API_KEY}`
      let calcWalking = (await this.callAPI(urlWalking)).rows[0].elements[0]
      let calcTransit = (await this.callAPI(urlTransit)).routes[0].legs[0]
      let calcDriving = (await this.callAPI(urlDriving)).rows[0].elements[0]
      let directionOptions = [
        {
          type: 'Walking',
          icon: walking,
          activeIcon: walkingActive,
          duration: calcWalking.duration.text,
          distance: calcWalking.distance.text
        },
        {
          type: 'Public Transport',
          icon: publicTransport,
          activeIcon: publicTransportActive,
          duration: calcTransit.duration.text,
          distance: calcTransit.distance.text
        },
        {
          type: 'Car',
          icon: car,
          activeIcon: carActive,
          duration: calcDriving.duration.text,
          distance: calcDriving.distance.text
        }
      ]
      this.setState({
        destination: locObj,
        directionOptions: directionOptions
      })
    }
  }

  async callAPI(url) {
    //console.log('url',url);
    try {
      let resp = await fetch(url, {
        method: 'GET',
        timeout: TIMEOUT
      })
      let respJson = await resp.json();

      return respJson
    } catch (error) {
      console.log(error)
      return error
    }
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
    //console.log('_getAmenityIcon',domain + iconBase + view_type + iconMapping[type]);
    return domain + iconBase + view_type + iconMapping[type];
  }

  _onSelect(item) {
    let travelMode = this.state.travelMode
    if (item.type === 'Walking') {
      travelMode = 'walking'
    }
    else if (item.type === 'Car') {
      travelMode = 'driving'
    }
    else if (item.type === 'Public Transport') {
      travelMode = 'transit'
    }
    this.setState({
      travelMode: travelMode
    })
  }

  _handleOnBack() {
    this.props.navigation.goBack()
  }

  _handleOnChangeDirection(start, dest, mid, coords) {
    // calculation for refocus the direction
    // let constantFactor = 0.0400
    // let constLatDelta = mid.latitudeDelta + constantFactor
    // let constLonDelta = mid.longitudeDelta + constantFactor

    // need check this condition, need to improve
    // if(Math.abs(start.latitude-dest.latitude)<constLatDelta){
    //   constLatDelta+=constantFactor
    // }
    // if(Math.abs(start.longitude-dest.longitude)<constLonDelta){
    //   constLonDelta+=constantFactor
    // }

    // this.refs.mapview.animateToRegion({
    //   latitude: mid.latitude,
    //   longitude: mid.longitude,
    //   latitudeDelta: constLatDelta,
    //   longitudeDelta: constLonDelta
    // })

    this.refs.mapview.fitToCoordinates([start, dest, mid, ...coords], {
      edgePadding: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
      },
      animated: true
    })
  }


  _forceUpdate() {
    this.setState({
      reload: this.state.reload + 1
    })
  }

  render() {

    _renderPlacesMarker = () => {
      let isAndroid = Platform.OS == 'android'
      let destinations = this.destinations
      return destinations.map((item, i) => {
        let dest = item
        let coord = { latitude:  Number(dest.lat), longitude:  Number(dest.lon) }
        let isShowCallout = (
          (dest.lat === this.state.destination.lat) &&
          (dest.lon === this.state.destination.lon)
        )
        return (
          <MapView.Marker
            image={isAndroid ? this._onIconSelect(dest.type)  : null}
            key={i.toString()}
            style={{ zIndex: i }}
            isShowCallout={isShowCallout}
            coordinate={coord}>
            {
              isAndroid ? null :
                <Image
                  style={{ width: 32, height: 37 }}
                  source={this._onIconSelect(dest.type) }
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
      })
    }

    _renderHomeMarker = () => {
      let isAndroid = Platform.OS == 'android'
      return (
        <MapView.Marker
          image={isAndroid ? this._onIconSelect('Home')  : null}
          style={{
            display: this.listingDetail ? 'flex' : 'none'
          }}
          coordinate={{
            latitude: this.listingDetail.lat || 0,
            longitude: this.listingDetail.lon || 0,
          }}>
          {
            isAndroid ? null :
              <Image
                style={{ width: 32, height: 37, }}
                source={ this._onIconSelect('Home') }
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
                {this.listingDetail.title}
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      )
    }

    return (
      <View style={{ backgroundColor: 'rgb(248,248,248)', flex: 1 }}>
        <View style={{ height: Dimensions.get('window').height * 0.4 }}>
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
              latitude: this.listingDetail.lat,
              longitude: this.listingDetail.lon,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0121
            }}>
            {/* render home marker */}
            {_renderHomeMarker()}
            {/* render all nearby amenity marker */}
            {_renderPlacesMarker()}
            <MapView.Direction
              startMarker={this._onIconSelect('PointA') }
              destMarker={this._onIconSelect('PointB') }
              onError={() => this._forceUpdate()}
              onChangeDirection={this._handleOnChangeDirection}
              travelMode={this.state.travelMode}
              origin={{
                latitude: this.listingDetail.lat,
                longitude: this.listingDetail.lon
              }}
              dest={{
                latitude: this.state.destination.lat,
                longitude: this.state.destination.lon
              }}
            />
          </MapView>
        </View>
        <ListingDirectionList
          onBack={this._handleOnBack}
          onSelect={this._onSelect}
          directionOptions={this.state.directionOptions} />
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4
  },
})

export var SVY21 = {
  // WGS84 Datum
  a: 6378137,
  f: 1 / 298.257223563,

  // SVY21 Projection
  // Fundamental point: Base 7 at Pierce Resevoir.
  // Latitude: 1 22 02.9154 N, longitude: 103 49 31.9752 E (of Greenwich).

  // Known Issue: Setting (oLat, oLon) to the exact coordinates specified above
  // results in computation being slightly off. The values below give the most
  // accurate represenation of test data.
  oLat: 1.366666, // origin's lat in degrees
  oLon: 103.833333, // origin's lon in degrees
  oN: 38744.572, // false Northing
  oE: 28001.642, // false Easting
  k: 1, // scale factor

  init: function () {
    this.b = this.a * (1 - this.f);
    this.e2 = (2 * this.f) - (this.f * this.f);
    this.e4 = this.e2 * this.e2;
    this.e6 = this.e4 * this.e2;
    this.A0 = 1 - (this.e2 / 4) - (3 * this.e4 / 64) - (5 * this.e6 / 256);
    this.A2 = (3. / 8.) * (this.e2 + (this.e4 / 4) + (15 * this.e6 / 128));
    this.A4 = (15. / 256.) * (this.e4 + (3 * this.e6 / 4));
    this.A6 = 35 * this.e6 / 3072;
  },

  computeSVY21: function (lat, lon) {
    //Returns a pair (N, E) representing Northings and Eastings in SVY21.
    ////////console.log("computeSVY21");
    var latR = lat * Math.PI / 180;
    var sinLat = Math.sin(latR);
    var sin2Lat = sinLat * sinLat;
    var cosLat = Math.cos(latR);
    var cos2Lat = cosLat * cosLat;
    var cos3Lat = cos2Lat * cosLat;
    var cos4Lat = cos3Lat * cosLat;
    var cos5Lat = cos4Lat * cosLat;
    var cos6Lat = cos5Lat * cosLat;
    var cos7Lat = cos6Lat * cosLat;

    var rho = this.calcRho(sin2Lat);
    var v = this.calcV(sin2Lat);
    var psi = v / rho;
    var t = Math.tan(latR);
    var w = (lon - this.oLon) * Math.PI / 180;

    var M = this.calcM(lat);
    var Mo = this.calcM(this.oLat);

    var w2 = w * w;
    var w4 = w2 * w2;
    var w6 = w4 * w2;
    var w8 = w6 * w2;

    var psi2 = psi * psi;
    var psi3 = psi2 * psi;
    var psi4 = psi3 * psi;

    var t2 = t * t;
    var t4 = t2 * t2;
    var t6 = t4 * t2;

    // Compute Northing
    var nTerm1 = w2 / 2 * v * sinLat * cosLat;
    var nTerm2 = w4 / 24 * v * sinLat * cos3Lat * (4 * psi2 + psi - t2);
    var nTerm3 = w6 / 720 * v * sinLat * cos5Lat * ((8 * psi4) * (11 - 24 * t2) - (28 * psi3) * (1 - 6 * t2) + psi2 * (1 - 32 * t2) - psi * 2 * t2 + t4);
    var nTerm4 = w8 / 40320 * v * sinLat * cos7Lat * (1385 - 3111 * t2 + 543 * t4 - t6);
    var N = this.oN + this.k * (M - Mo + nTerm1 + nTerm2 + nTerm3 + nTerm4);

    // Compute Easting
    var eTerm1 = w2 / 6 * cos2Lat * (psi - t2);
    var eTerm2 = w4 / 120 * cos4Lat * ((4 * psi3) * (1 - 6 * t2) + psi2 * (1 + 8 * t2) - psi * 2 * t2 + t4);
    var eTerm3 = w6 / 5040 * cos6Lat * (61 - 479 * t2 + 179 * t4 - t6);
    var E = this.oE + this.k * v * w * cosLat * (1 + eTerm1 + eTerm2 + eTerm3);

    return { N: N, E: E };
  },

  calcM: function (lat, lon) {
    var latR = lat * Math.PI / 180;
    return this.a * ((this.A0 * latR) - (this.A2 * Math.sin(2 * latR)) + (this.A4 * Math.sin(4 * latR)) - (this.A6 * Math.sin(6 * latR)));
  },

  calcRho: function (sin2Lat) {
    var num = this.a * (1 - this.e2);
    var denom = Math.pow(1 - this.e2 * sin2Lat, 3. / 2.);
    return num / denom;
  },

  calcV: function (sin2Lat) {
    var poly = 1 - this.e2 * sin2Lat;
    return this.a / Math.sqrt(poly);
  },

  computeLatLon: function (N, E) {
    // Returns a pair (lat, lon) representing Latitude and Longitude.
    ////////console.log("computeLatLon");
    var Nprime = N - this.oN;
    var Mo = this.calcM(this.oLat);
    var Mprime = Mo + (Nprime / this.k);
    var n = (this.a - this.b) / (this.a + this.b);
    var n2 = n * n;
    var n3 = n2 * n;
    var n4 = n2 * n2;
    var G = this.a * (1 - n) * (1 - n2) * (1 + (9 * n2 / 4) + (225 * n4 / 64)) * (Math.PI / 180);
    var sigma = (Mprime * Math.PI) / (180. * G);

    var latPrimeT1 = ((3 * n / 2) - (27 * n3 / 32)) * Math.sin(2 * sigma);
    var latPrimeT2 = ((21 * n2 / 16) - (55 * n4 / 32)) * Math.sin(4 * sigma);
    var latPrimeT3 = (151 * n3 / 96) * Math.sin(6 * sigma);
    var latPrimeT4 = (1097 * n4 / 512) * Math.sin(8 * sigma);
    var latPrime = sigma + latPrimeT1 + latPrimeT2 + latPrimeT3 + latPrimeT4;

    var sinLatPrime = Math.sin(latPrime);
    var sin2LatPrime = sinLatPrime * sinLatPrime;

    var rhoPrime = this.calcRho(sin2LatPrime);
    var vPrime = this.calcV(sin2LatPrime);
    var psiPrime = vPrime / rhoPrime;
    var psiPrime2 = psiPrime * psiPrime;
    var psiPrime3 = psiPrime2 * psiPrime;
    var psiPrime4 = psiPrime3 * psiPrime;
    var tPrime = Math.tan(latPrime);
    var tPrime2 = tPrime * tPrime;
    var tPrime4 = tPrime2 * tPrime2;
    var tPrime6 = tPrime4 * tPrime2;
    var Eprime = E - this.oE;
    var x = Eprime / (this.k * vPrime);
    var x2 = x * x;
    var x3 = x2 * x;
    var x5 = x3 * x2;
    var x7 = x5 * x2;

    // Compute Latitude
    var latFactor = tPrime / (this.k * rhoPrime);
    var latTerm1 = latFactor * ((Eprime * x) / 2);
    var latTerm2 = latFactor * ((Eprime * x3) / 24) * ((-4 * psiPrime2) + (9 * psiPrime) * (1 - tPrime2) + (12 * tPrime2));
    var latTerm3 = latFactor * ((Eprime * x5) / 720) * ((8 * psiPrime4) * (11 - 24 * tPrime2) - (12 * psiPrime3) * (21 - 71 * tPrime2) + (15 * psiPrime2) * (15 - 98 * tPrime2 + 15 * tPrime4) + (180 * psiPrime) * (5 * tPrime2 - 3 * tPrime4) + 360 * tPrime4);
    var latTerm4 = latFactor * ((Eprime * x7) / 40320) * (1385 - 3633 * tPrime2 + 4095 * tPrime4 + 1575 * tPrime6);
    var lat = latPrime - latTerm1 + latTerm2 - latTerm3 + latTerm4;

    // Compute Longitude
    var secLatPrime = 1. / Math.cos(lat);
    var lonTerm1 = x * secLatPrime;
    var lonTerm2 = ((x3 * secLatPrime) / 6) * (psiPrime + 2 * tPrime2);
    var lonTerm3 = ((x5 * secLatPrime) / 120) * ((-4 * psiPrime3) * (1 - 6 * tPrime2) + psiPrime2 * (9 - 68 * tPrime2) + 72 * psiPrime * tPrime2 + 24 * tPrime4);
    var lonTerm4 = ((x7 * secLatPrime) / 5040) * (61 + 662 * tPrime2 + 1320 * tPrime4 + 720 * tPrime6);
    var lon = (this.oLon * Math.PI / 180) + lonTerm1 - lonTerm2 + lonTerm3 - lonTerm4;

    return { lat: lat / (Math.PI / 180), lon: lon / (Math.PI / 180) };
  }

}
