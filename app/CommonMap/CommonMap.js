import React, { PureComponent } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Platform,
  Button,
  PixelRatio,
} from 'react-native';
import MapView from '../../components/Common_GoogleMaps/Common_GoogleMaps';
import CalloutImage from '../../components/Common_GoogleMaps/Common_CalloutImage';
import Polyline from '@mapbox/polyline';
import PinMarker from '../../components/Common_GoogleMaps/Common_PinMarker';
import IconMenu from '../../components/Common_IconMenu/Common_IconMenu.js';
import Common_Image from '../../components/Common_Image/Common_Image.js';
import NavigationHelper from '../../components/Common_NavigationHelper/Common_NavigationHelper.js';
import Boundary from '../../assets/json/Search_Data/Boundary.json'

const HOSTNAME = 'https://alice.edgeprop.my/property/v1/get_map';
const PROXY_URL = '?';
const API_DOMAIN = '';
const API_GET_LISTING_RESULT = HOSTNAME + PROXY_URL; //+ encodeURIComponent(API_DOMAIN + "/index.php?option=com_analytica&task=mapsearch&mode=list&page=1");
const PAGE_SIZE = 10;
const TIMEOUT = 5000;
const CENTER_LAT_DEFAULT = 3.0832901;
const CENTER_LNG_DEFAULT = 101.7080002;
const ZOOM_LEVEL_DEFAULT_DISTRICT = 3;
const ZOOM_LEVEL_MIN = 10; // same as ZOOM_LEVEL_MIN_REGION and ZOOM_LEVEL_MIN_DISTRICT
const ZOOM_LEVEL_MAX = 22;
const ZOOM_LEVEL_MIN_REGION = 10;
const ZOOM_LEVEL_MAX_REGION = 11;
const ZOOM_LEVEL_MIN_PLANING_AREA = 12;
const ZOOM_LEVEL_MAX_PLANING_AREA = 15; //13
const ZOOM_LEVEL_MIN_DISTRICT = 10;
const ZOOM_LEVEL_MAX_DISTRICT = 15;
const ZOOM_LEVEL_MIN_ASSET = 15; //13
const ZOOM_LEVEL_MAX_ASSET = 22;
const DISTANCE_ZOOM_LEVEL_MIN = 6; //highest ZOOM OUT
const DISTANCE_ZOOM_LEVEL_MEDIUM = 4; //medium zoom
const DISTANCE_ZOOM_LEVEL_MAX = 2; //highest ZOOM IN
const PIXELRATIO = PixelRatio.get()
const DEVICEWIDTH = Dimensions.get('window').width;
const DEVICEHEIGHT = Dimensions.get('window').height;

var circle_icon = require('../../assets/icons/Map_Search_Icons/Area-solid-48px.png');
var circle_icon_android = require('../../assets/icons/Map_Search_Icons/Area-solid-43px.png');
var asset_icon = require('../../assets/icons/Map_Search_Icons/Project-solid-18px.png');
var asset_icon_android = require('../../assets/icons/Map_Search_Icons/Project-solid-43px.png');
var target_arrow = require('../../assets/icons/Map_Search_Icons/Target.png');
var imageMapDefault =
  'https://sg.tepcdn.com/s3fs-public/styles/project_image_medium/public/default_images/no_img.png';

class CommonMap extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    var filter_icon = require('../../assets/icons/Filter.png');
    var { state, setParams } = navigation;
    var { params } = state;
    return {
      title: 'Map'.toUpperCase(),
      headerRight: (
        <View display={'none'}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingVertical: 5
          }}
        >
          <IconMenu
            imageWidth={30}
            imageHeight={30}
            paddingVertical={10}
            paddingHorizontal={5}
            type={'icon'}
            imageSource={filter_icon}
            onPress={() => params.handleFilter()}
          />
        </View>
      )
    };
  };
  constructor(props) {
    super(props);
    this.tempRegion = [];
    this.tempPlanningArea = [];
    this.state = {
      results: [],
      callDataRegionChange: true,
      outerLine: [],
      markerRegion: [],
      latitudeDelta: 0.5,
      longitudeDelta: 0.3,
      latitude: CENTER_LAT_DEFAULT,
      longitude: CENTER_LNG_DEFAULT,
      x: 0,
      y: 0,
      isClick: false,
      suggestionBy: '',
      isMeasured: false,
      isLoading: false,
      isShowIcon: false,
      mapUrl: this.props.navigation.state.params.mapURL || '',
      layer: '',
      willShowCallout: false
    };
    this.mapURL = this.state.mapUrl;
    this.flag = true;
    this.farDistance = [], //low:0 , medium:1 , high:2
    this.center={lat:[],lng:[]}
    this.animate= true
    this.centerLatCurrent = '';
    this.centerLngCurrent = '';
    this._sendAPIRequest = this._sendAPIRequest.bind(this);
    this._getMapData = this._getMapData.bind(this);
    this._getTempData = this._getTempData.bind(this);
    this._handleFilter = this._handleFilter.bind(this);
    this._mapSearchResultFeedback = this._mapSearchResultFeedback.bind(this);
    this._handleParamSearchOption = this._handleParamSearchOption.bind(this);
    this._setParameterValue1 = this._setParameterValue1.bind(this);
    this._setParameterValue2 = this._setParameterValue2.bind(this);
    this._getLatLng = this._getLatLng.bind(this);
    this.paramsData = this.props.navigation.state.params.data
    this.props.navigation.setParams({
      handleFilter: this._handleFilter
    });
  }

  componentDidMount(){
    this.setState({
      isLoading:true
    })
    this._sendAPIRequest(this.state.mapUrl, 'results');
    _this = this
    setTimeout(function(){
      if(!_this.state.willShowCallout){
      _this.setState({
        //isLoading:true,
        willShowCallout:true
      })
    }
    }, 1000)
  }
  componentDidUpdate(prevProps, prevState) {
    this._handleDistrictFeedBack()
    if (prevState.mapUrl != this.state.mapUrl) {
      if (this.state.mapUrl.includes('m_type=2')) {
        district = this._getDistrict(this.state.mapUrl);
        Object.values(this.state.results).map(value => {
          if (value.id == district) {
            this.setState({
              latitude: parseFloat(value.loc[1]),
              longitude: parseFloat(value.loc[0])
            });
          }
        });
      }
    }

    if (prevState.layer != this.state.layer) {
      this.setState({
        isShowIcon: false,
        isLoading: true
      });
    }
    let mapCoord = {};
    let outer = {};
    if (this.state.isClick) {
      SVY21.init();
      getCoordinate = SVY21.computeSVY21(
        this.state.latitude,
        this.state.longitude
      );
      mapCoord = {
        x: getCoordinate.E,
        y: getCoordinate.N,
        mapUrl: this._requestMapUrlbyZoom(),
        isClick: false,
        isMeasured: true
      };
    }
    if (this.state.isMeasured) {
      this._sendAPIRequest(this.state.mapUrl, 'results');
    }
    /// SEARCH BY KEYWORD DIRECT TO ASSET
    if (
      this.state.mapUrl.includes('m_type=1') &&
      this.flag &&
      this.tempPlanningArea.length == 0 &&
      this.tempRegion.length == 0
    ) {
      SVY21.init();
      //console.log('title',this.props.navigation.state.params.title)
      if(this.props.navigation.state.params.title=='asset'){
        /*getLatLon = SVY21.computeLatLon(
          this._getXYParam(this.state.mapUrl)[1],
          this._getXYParam(this.state.mapUrl)[0]
      );*/

        getLatLon = this._getLatLng(this.state.mapUrl);
        this.center.lat.push(parseFloat(getLatLon.lat[0]));
        this.center.lng.push(parseFloat(getLatLon.lon[0]));

        this.setState({
          latitude: this.center.lat[0],
          longitude: this.center.lng[0],
          latitudeDelta: this.state.latitudeDelta / 12,
          longitudeDelta: this.state.longitudeDelta / 12
        })
      }
      else if (this.props.navigation.state.params.title=='special asset'){
        /*this._getSearchByLocation(this.state.mapUrl).map((location)=>{
          location = location.split(',')
          //console.log('location',location)
          if(location[3] && location[3].length > 0 && location[3] != "undefined" && location[4] && location[4].length && location[4] != "undefined") {
            this.center.lat.push(parseFloat(location[3]))
            this.center.lng.push(parseFloat(location[4]))
          }
          else if(location[1] && location[1].length > 0 && location[2] && location[2].length > 0){
            getLatLon = SVY21.computeLatLon(location[2],location[1]);
            this.center.lat.push(parseFloat(getLatLon.lat));
            this.center.lng.push(parseFloat(getLatLon.lon));
          }
          if(this._getDistanceFromLatLonInKm(this.center.lat[0],this.center.lng[0],this.center.lat[this.center.lat.length-1],this.center.lng[this.center.lng.length-1])>DISTANCE_ZOOM_LEVEL_MIN){
            this.farDistance.push(2)
          }
          else if(this._getDistanceFromLatLonInKm(this.center.lat[0],this.center.lng[0],this.center.lat[this.center.lat.length-1],this.center.lng[this.center.lng.length-1])<=DISTANCE_ZOOM_LEVEL_MAX){
            this.farDistance.push(0)
          }
          else if(DISTANCE_ZOOM_LEVEL_MAX < this._getDistanceFromLatLonInKm(this.center.lat[0],this.center.lng[0],this.center.lat[this.center.lat.length-1],this.center.lng[this.center.lng.length-1])<=DISTANCE_ZOOM_LEVEL_MIN){
            this.farDistance.push(1)
          }

          this.farDistance.sort()
      })*/


          getLatLon = this._getLatLng(this.state.mapUrl);
          getLatLon.lat.map((value,index)=>{
            this.center.lat.push(parseFloat(value))
            let lngVal = getLatLon.lon[index] ? getLatLon.lon[index] : 0;
            this.center.lng.push(parseFloat(lngVal));
            if(this._getDistanceFromLatLonInKm(this.center.lat[0],this.center.lng[0],this.center.lat[this.center.lat.length-1],this.center.lng[this.center.lng.length-1])>DISTANCE_ZOOM_LEVEL_MIN){
              this.farDistance.push(2)
            }
            else if(this._getDistanceFromLatLonInKm(this.center.lat[0],this.center.lng[0],this.center.lat[this.center.lat.length-1],this.center.lng[this.center.lng.length-1])<=DISTANCE_ZOOM_LEVEL_MAX){
              this.farDistance.push(0)
            }
            else if(DISTANCE_ZOOM_LEVEL_MAX < this._getDistanceFromLatLonInKm(this.center.lat[0],this.center.lng[0],this.center.lat[this.center.lat.length-1],this.center.lng[this.center.lng.length-1])<=DISTANCE_ZOOM_LEVEL_MIN){
              this.farDistance.push(1)
            }

            this.farDistance.sort()
          })

          this.farDistance = this.farDistance[this.farDistance.length-1]
          this.setState({
            latitude: this._getCentroid(this.center)[0],
            longitude:this._getCentroid(this.center)[1],
            latitudeDelta: this.center.lat.length==1?this.state.latitudeDelta/12:this.farDistance==0?this.state.latitudeDelta/12:this.farDistance==1?this.state.latitudeDelta/4:this.state.latitudeDelta,
            longitudeDelta: this.center.lng.length==1?this.state.longitudeDelta/12:this.farDistance==0?this.state.longitudeDelta/12:this.farDistance==1?this.state.longitudeDelta/4:this.state.longitudeDelta
          })
      }
      this.setState({
        layer: 'asset',
        suggestionBy: 'asset',
        // latitude: this.center.lat[0],
        // longitude: this.center.lng[0],
        // latitudeDelta: this.state.latitudeDelta / 12,
        // longitudeDelta: this.state.longitudeDelta / 12
      });
    //   var xy = SVY21.computeSVY21(this._getCentroid(this.center)[0],this._getCentroid(this.center)[1]);
    //   var getX = this.state.mapUrl.replace(encodeURIComponent('&x='),encodeURIComponent('&x='+xy.E))
    //   var getY = this.state.mapUrl.replace(encodeURIComponent('&y='),encodeURIComponent('&y='+xy.N))
      this.flag = false;
      //this.centerLatCurrent = getLatLon.lat;
      //this.centerLngCurrent = getLatLon.lon;
    }

    //SEARCH BY KEYWORD DIRECT TO PLANNING
    else if (
      this.state.mapUrl.includes('m_type=2') &&
      this.flag &&
      this.tempPlanningArea.length == 0 &&
      this.tempRegion.length == 0 &&
      Object.keys(this.state.results).length > 0
    ) {
      var district = this._getDistrict(this.state.mapUrl);
      Object.values(this.state.results).map(value => {
        if (value.id == district) {
          this.setState({
            layer: 'planning_area',
            suggestionBy: 'planning_area',
            latitude: parseFloat(value.loc[1]),
            longitude: parseFloat(value.loc[0]),
            latitudeDelta: this.state.latitudeDelta / 3,
            longitudeDelta: this.state.longitudeDelta / 3
          });
        }
      });
      this.flag = false;
        setTimeout(() => {
          this._animateRegion(this.state.layer)
          // this.refs.mapView.animateToRegion({
          //   latitude: this.state.latitude,
          //   longitude: this.state.longitude,
          //   latitudeDelta: this.state.latitudeDelta/2,
          //   longitudeDelta: this.state.longitudeDelta/2,
          // })
        }, 2000);

    }
    if (
      JSON.stringify(prevState.results) !== JSON.stringify(this.state.results)
    ) {
      if (this.state.mapUrl.includes('m_type=1')) {
        outer = {
          markerRegion: this._getMapData('markerRegion')
        };
      } else if (
        this.state.mapUrl.includes(
          encodeURIComponent('geo_type=planning_area')
        ) ||
        this.state.mapUrl.includes(encodeURIComponent('geo_type=district'))
      ) {
        outer = {
          outerLine: this._getMapData('outer'),
          markerRegion: this._getMapData('markerRegion')
        };
      } else if (
        this.state.mapUrl.includes(encodeURIComponent('geo_type=region'))
      ) {
        outer = {
          outerLine: this._getMapData('outer'),
          markerRegion: this._getMapData('markerRegion')
        };
      }
    }
    this.setState({
      ...mapCoord,
      ...outer
    });
  }
  _getCentroid(coords) {
    var constructArray = coords.lat.reduce(function(arr, v, i) {
      return arr.concat(v, coords.lng[i]);
    }, []);
    var mergeArray = constructArray.reduce(function(result, value, index, array) {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);
    var center = mergeArray.reduce(
      function(x, y) {
        return [x[0] + y[0] / mergeArray.length, x[1] + y[1] / mergeArray.length];
      },
      [0, 0]
    );
    return center;
  }
    _getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this._deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this._deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }
  _deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  _getSearchByLocation(url){
    var trim_end = url.indexOf(encodeURIComponent('&page='))
    var trim_first = url.indexOf(encodeURIComponent('&search_by_location='))+24
    var trim_result = decodeURIComponent(url.slice(trim_first,trim_end));
    //console.log('_getSearchByLocation',trim_result.split('|'));
    return trim_result.split('|')
  }
  _getLatLng(url){
      /*var trim_end = url.indexOf(encodeURIComponent('&radius='));
      var trim_first = url.indexOf(encodeURIComponent('&x='));
      var trim_result = decodeURIComponent(url.slice(trim_first, trim_end));
      var trim_x_first = trim_result.indexOf('&x=') + 3;
      var trim_x_last = trim_result.indexOf('&y=');
      var x = trim_result.slice(trim_x_first, trim_x_last);
      var trim_y = trim_result.indexOf('&y=') + 3;
      var y = trim_result.slice(trim_y);*/
      var param = {lat:'',lon:''};
      var items = url.split("&");
      items.forEach(function(element) {
        //console.log(element);
        if(element.startsWith('lat=')){
          param.lat = element.substring(4);
      }else if(element.startsWith('lng=')){
          param.lon = element.substring(4);
      }
      });
      param.lat = param.lat.split(',')
      param.lon = param.lon.split(',')
      //console.log('_getLatLng',param);
    return param;
  }
  _getXYParam(url) {
    var trim_end = url.indexOf(encodeURIComponent('&radius='));
    var trim_first = url.indexOf(encodeURIComponent('&x='));
    var trim_result = decodeURIComponent(url.slice(trim_first, trim_end));
    var trim_x_first = trim_result.indexOf('&x=') + 3;
    var trim_x_last = trim_result.indexOf('&y=');
    var x = trim_result.slice(trim_x_first, trim_x_last);
    var trim_y = trim_result.indexOf('&y=') + 3;
    var y = trim_result.slice(trim_y);
    var param = [x, y];
    return param;
  }
  _getDistrict(url) {
    //var trim_end = url.indexOf(encodeURIComponent('&bedroom_min='));
    //var trim_first = url.indexOf(encodeURIComponent('&district=')) + 10;
    //var trim_result = decodeURIComponent(url.slice(trim_first, trim_end));
    var trim_result = '';
    var items = url.split("&");
    items.forEach(function(element) {
      //console.log(element);
      if(element.startsWith('district=')){
        trim_result = element.substring(9);
      }
    });
    //console.log('trim_result',trim_result);
    return trim_result;
  }
  _getDistance(url){
    var trim_end = url.indexOf(encodeURIComponent('&search_by_location='));
    var trim_first = url.indexOf(encodeURIComponent('&search_by_distance=')) + 24;
    var trim_result = parseInt(decodeURIComponent(url.slice(trim_first, trim_end)));
    //console.log('trim',trim_result)
    return trim_result;
  }
  _mapSearchResultFeedback(title, data) {
    this.animate=true
    this._animateRegion(this.state.layer)
    mapURL = this.mapURL;
    if (data.t != 'Districts' && data.t.length > 0) {
      this.setState({
        layer: 'asset',
         suggestionBy: 'asset'
      });
      mapURL = this._constructMapURL(data)+'&m_type=1'
      /*.replace(
        encodeURIComponent('mode=list'),
        encodeURIComponent('mode=map&geo_type=asset')
    );*/
    } else if (data.t == 'Districts') {
      this.setState({
        layer: 'planning',
        suggestionBy: ''
      });
      let boundary = Boundary.filter(value => value.title == data.state)
      let map_params = '';
      if(boundary.length >0){
          map_params = 'lat='+boundary[0].lat+'&lng='+boundary[0].lng+'&m_type=2'
      }
      mapURL = this._constructMapURL(data)+map_params
      /*.replace(
        encodeURIComponent('mode=list'),
        encodeURIComponent('mode=map&geo_type=district')
    );*/
    } else {
      this.setState({
        layer: 'region',
        suggestionBy: ''
      });
      mapURL = this._constructMapURL(data)
      /*.replace(
        encodeURIComponent('mode=list'),
        encodeURIComponent('mode=map&geo_type=region')
    );*/
    }
    this.tempRegion = [];
    this.tempPlanningArea = [];
    this.setState({
      outerLine: [],
      markerRegion: [],
      isLoading: true,
      isClick: true,
      mapUrl: mapURL,
      //longitude: this.state.longitude,
      //latitude: this.state.latitude,
      latitudeDelta: mapURL.includes('m_type=1')
        ? 0.5 / 12
        : !mapURL.includes('m_type')
          ? 0.5
          : 0.5 / 3,
      longitudeDelta: mapURL.includes('m_type=1')
        ? this.state.longitudeDelta
        : !mapURL.includes('m_type')
          ? 0.3
          : 0.3 / 3
    });
    if (mapURL.includes('m_type=1')) {
      SVY21.init();
      /*getLatLonFilter = SVY21.computeLatLon(
        this._getXYParam(mapURL)[1],
        this._getXYParam(mapURL)[0]
    );*/
      getLatLonFilter = this._getLatLng(mapURL);
      this.setState({
        suggestionBy: 'asset',
        latitude: getLatLonFilter.lat[0]? getLatLonFilter.lat[0] : CENTER_LAT_DEFAULT,
        longitude: getLatLonFilter.lon[0]? getLatLonFilter.lon[0] : CENTER_LNG_DEFAULT,
        latitudeDelta: 0.5 / 7,
        longitudeDelta: 0.3 / 7
      });
      //this.flag = false;
      this.center = {lat:[],lng:[]}
      this.center.lat.push(parseFloat(getLatLonFilter.lat[0]));
      this.center.lng.push(parseFloat(getLatLonFilter.lon[0]));
    }
    else if(!mapURL.includes('m_type')){
      this.setState({
        latitude: CENTER_LAT_DEFAULT,
        longitude: CENTER_LNG_DEFAULT
      })
    }
    this.paramsData = data
    this.mapURL = mapURL
  }
  _handleDistrictFeedBack(){
    if(this.mapURL.includes('m_type=2')){
    district = this._getDistrict(this.mapURL);
    Object.values(this.state.results).map(value => {
      if (value.id == district) {
          this.setState({
            suggestionBy: 'planning_area',
            latitude: parseFloat(value.lat),
            longitude: parseFloat(value.lng),
            latitudeDelta: 0.5 / 6,
            longitudeDelta: 0.3 / 6
          });
        }
      });
    }
  }
  _handleFilter() {
    this.refs.navigationHelper._navigate('SearchOption', {
      data: this.paramsData,
      title: this.props.navigation.state.params.title,
      searchResultFeedback: this._mapSearchResultFeedback
    });
  }
  _requestMapUrlbyZoom() {
    SVY21.init();
    getCoordinate = SVY21.computeSVY21(
      this.state.latitude,
      this.state.longitude
    );
    var layer = this.state.layer;
    if (layer == 'region') {
      if (
        this.state.mapUrl.includes(encodeURIComponent('geo_type=planning_area'))
      ) {
        layerRegion = this.state.mapUrl.replace(
          encodeURIComponent('geo_type=planning_area'),
          encodeURIComponent('geo_type=region')
        );
        return layerRegion;
      } else {
        return this.state.mapUrl; //DEFAULT mapURL == REGION TYPE
      }
    } else if (layer == 'planning_area') {
      if (!this.state.mapUrl.includes('m_type')) {
        layerPlanningArea = this.state.mapUrl.replace(
          encodeURIComponent('geo_type=region'),
          encodeURIComponent('geo_type=planning_area')
        );
        return layerPlanningArea;
      } else if (
        this.state.mapUrl.includes(encodeURIComponent('geo_type=asset'))
      ) {
        var trim_end = this.state.mapUrl.indexOf(
          encodeURIComponent('&radius=')
        );
        var trim_first = this.state.mapUrl.indexOf(encodeURIComponent('&x='));
        var trim_result = this.state.mapUrl.slice(trim_first, trim_end);
        layerPlanningArea = this.state.mapUrl.replace(
          trim_result,
          'ASSET_COORDINATES'
        );
        layerPlanningArea = layerPlanningArea
          .replace(
            encodeURIComponent('geo_type=asset'),
            encodeURIComponent('geo_type=planning_area')
          )
          .replace('ASSET_COORDINATES', encodeURIComponent('&x=&y='));
        return layerPlanningArea;
      }
    } else if (layer == 'asset') {
      if (
        this.state.mapUrl.includes(
          encodeURIComponent('geo_type=planning_area')
        ) ||
        this.state.mapUrl.includes(encodeURIComponent('geo_type=district'))
      ) {
        var trim_end = this.state.mapUrl.indexOf(
          encodeURIComponent('&radius=')
        );
        var trim_first = this.state.mapUrl.indexOf(encodeURIComponent('&x='));
        var trim_result = this.state.mapUrl.slice(trim_first, trim_end);
        layerAsset = this.state.mapUrl.replace(
          trim_result,
          'ASSET_COORDINATES'
        );
        layerAsset = layerAsset
          .replace(
            this.state.mapUrl.includes(
              encodeURIComponent('geo_type=planning_area')
            )
              ? encodeURIComponent('geo_type=planning_area')
              : encodeURIComponent('geo_type=district'),
            encodeURIComponent('geo_type=asset')
          )
          .replace('ASSET_COORDINATES', encodeURIComponent('&x=&y='))
          .replace(
            encodeURIComponent('&x='),
            encodeURIComponent(`&x=${getCoordinate.E}`)
          )
          .replace(
            encodeURIComponent('&y='),
            encodeURIComponent(`&y=${getCoordinate.N}`)
          );
        return layerAsset;
      } else if (
        this.state.mapUrl.includes(encodeURIComponent('geo_type=asset'))
      ) {
        var trim_end = this.state.mapUrl.indexOf(
          encodeURIComponent('&radius=')
        );
        var trim_first = this.state.mapUrl.indexOf(encodeURIComponent('&x='));
        var trim_result = this.state.mapUrl.slice(trim_first, trim_end);
        layerAsset = this.state.mapUrl.replace(
          trim_result,
          'ASSET_COORDINATES'
        );
        layerAsset = layerAsset
          .replace('ASSET_COORDINATES', encodeURIComponent('&x=&y='))
          .replace(
            encodeURIComponent('&x='),
            encodeURIComponent(`&x=${getCoordinate.E}`)
          )
          .replace(
            encodeURIComponent('&y='),
            encodeURIComponent(`&y=${getCoordinate.N}`)
          );
        return layerAsset;
      }
    }
    return this.state.mapUrl;
  }
  mappingArea(area) {
    if (area && area.count != 0 && !area.real_name) {
      return area.poly.outer;
    }
    return [];
  }
  mappingIconRegion(area) {
    if (area && area.count != 0) {
      //console.log('mappingIconRegion',area)
      return area;
    }
    return [];
  }
  _getTempData(data, itemIndex) {
    return data[itemIndex];
  }
  _getMapData(type) {
    dataWrapper = [];
    dataWrapper1 = [];
    dataWrapper2 = [];
    tempData = [];
    ////////////////////////// LAYER 1 //////////////////////////////////
    if (!this.state.mapUrl.includes('m_type')) {
      if (type == 'outer') {
        if (this.tempRegion.length != 0) {
          dataWrapper = [
            ...this.mappingArea(this.tempRegion.c),
            ...this.mappingArea(this.tempRegion.e),
            ...this.mappingArea(this.tempRegion.n),
            ...this.mappingArea(this.tempRegion.ne),
            ...this.mappingArea(this.tempRegion.w)
          ];
        } else {
          dataWrapper = [
            ...this.mappingArea(this.state.results.c),
            ...this.mappingArea(this.state.results.e),
            ...this.mappingArea(this.state.results.n),
            ...this.mappingArea(this.state.results.ne),
            ...this.mappingArea(this.state.results.w)
          ];
        }
        if (dataWrapper.length > 0) {
          return Object.keys(dataWrapper).map(item => {
            let poly = Polyline.decode(dataWrapper[item]);
            return poly.map(value => {
              return {
                latitude: value[0],
                longitude: value[1]
              };
            });
          });
        }
        return [];
      }
      if (type == 'markerRegion') {
        if (this.tempRegion.length != 0) {
          dataWrapper = [
            this.mappingIconRegion(this.tempRegion.c),
            this.mappingIconRegion(this.tempRegion.e),
            this.mappingIconRegion(this.tempRegion.n),
            this.mappingIconRegion(this.tempRegion.ne),
            this.mappingIconRegion(this.tempRegion.w)
          ];
        } else {
          dataWrapper = [
            this.mappingIconRegion(this.state.results.c),
            this.mappingIconRegion(this.state.results.e),
            this.mappingIconRegion(this.state.results.n),
            this.mappingIconRegion(this.state.results.ne),
            this.mappingIconRegion(this.state.results.w)
          ];
        }

        if (dataWrapper.length > 0) {
          return dataWrapper
            .filter(value => value.lat && value.lng)
            .map(value => {
              return {
                latitude: parseFloat(value.lat),
                longitude: parseFloat(value.lng),
                count: value.count? value.count : 1,
                name: value.name,
                district: value.district,
                tenure: value.tenure,
                street: value.street,
                min_price: value.min_price,
                max_price: value.max_price,
                top: value.top,
                image: value.image,
                avg_psf: value.avg_psf
              };
            });
        }
        return [];
      }
    }
    ////////////////////////// LAYER 2 //////////////////////////////////
    else if (
      this.state.mapUrl.includes(
        encodeURIComponent('geo_type=planning_area')
      ) ||
      this.state.mapUrl.includes(encodeURIComponent('geo_type=district'))
    ) {
      if (type == 'outer') {
        // let tempData = [];
        if (this.tempPlanningArea.length != 0) {
          dataWrapper1 = Object.keys(this.tempPlanningArea).map(value => {
            tempData.push(...this.mappingArea(this.tempPlanningArea[value]));
          });
        } else {
          dataWrapper1 = Object.keys(this.state.results).map(value => {
            tempData.push(...this.mappingArea(this.state.results[value]));
          });
        }

        if (tempData.length > 0) {
          return Object.keys(tempData).map(item => {
            let poly = Polyline.decode(tempData[item]);
            return poly.map(value => {
              return {
                latitude: value[0],
                longitude: value[1],
                count: value.count ?  value.count : 1,
                name: value.name,
                district: value.district,
                tenure: value.tenure,
                street: value.street,
                min_price: value.min_price,
                max_price: value.max_price,
                top: value.top,
                image: value.image,
                avg_psf: value.avg_psf
              };
            });
          });
        }
        return [];
      }
      if (type == 'markerRegion') {
        if (this.tempPlanningArea.length != 0) {
          dataWrapper1 = Object.keys(this.tempPlanningArea).map(value => {
            if((this._getDistrict(this.state.mapUrl).includes(value)) && this.state.mapUrl.includes(encodeURIComponent('geo_type=district'))){
              return this.mappingIconRegion(this.tempPlanningArea[value])}
            else if (this.state.mapUrl.includes(encodeURIComponent('geo_type=planning_area'))){
              return this.mappingIconRegion(this.tempPlanningArea[value])
            }
            else{
              return []
            }
          });
        } else {
          dataWrapper1 = Object.keys(this.state.results).map(value => {
            if((this._getDistrict(this.state.mapUrl).includes(value)) && this.state.mapUrl.includes(encodeURIComponent('geo_type=district'))){
              return this.mappingIconRegion(this.state.results[value])}
            else if (this.state.mapUrl.includes(encodeURIComponent('geo_type=planning_area'))){
              return this.mappingIconRegion(this.state.results[value])
            }
            else{
              return []
            }
          });
        }
        if (dataWrapper1.length > 0) {
          return dataWrapper1
            .filter(value => value.lat && value.lng)
            .map(value => {
              return {
                latitude: parseFloat(value.lat),
                longitude: parseFloat(value.lng),
                count:  value.count ?  value.count : 1,
                name: value.name,
                district: value.district,
                tenure: value.tenure,
                street: value.street,
                min_price: value.min_price,
                max_price: value.max_price,
                top: value.top,
                image: value.image,
                avg_psf: value.avg_psf
              };
            });
        }
        return [];
      }
    }
    ////////////////////////// LAYER 3 //////////////////////////////////
    else if (this.state.mapUrl.includes('m_type=1')) {
      if (type == 'markerRegion') {
        dataWrapper2 = Object.keys(this.state.results).map(value => {
          return this.mappingIconRegion(this.state.results[value]);
        });
        //console.log('dataWrapper2',dataWrapper2)
        if (dataWrapper2.length > 0) {
          return dataWrapper2
            .filter(value => value.loc && value.loc[0] && value.loc[1] && value.count)
            .map(value => {
              return {
                latitude: parseFloat(value.loc[1]),
                longitude: parseFloat(value.loc[0]),
                count: value.count?  value.count : 1,
                name: value.name,
                district: value.district,
                tenure: value.tenure,
                street: value.street,
                min_price: value.min_price,
                max_price: value.max_price,
                top: value.top,
                image: value.image,
                avg_psf: value.avg_price,
                asset_id: value.pro_id
              };
            });
        }
        return [];
      }
    }
  }
  _sendAPIRequest(apiUrl, stateName) {
    //console.log('apiUrl',apiUrl);
    //apiUrl ="https://alice.edgeprop.my/property/v1/get_map?&state=Kuala%20Lumpur&listing_type=sale&lat=3.148261,3.108581,3.108581,3.148261&lng=101.671963,101.671963,101.637352,101.637352&m_type=2&searchtype=basic";
    //console.log('apiUrl',apiUrl);
    fetch(apiUrl, {
      method: 'GET',
      timeout: TIMEOUT
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          this.setState({
            [stateName]: responseJson.projects,
            isMeasured: false,
            isShowIcon: true,
            isLoading: false
          });
          //console.log('layer',this.state.layer);
          //console.log('tempRegion',this.tempRegion);
          if (this.state.layer == 'region' && this.tempRegion.length == 0) {
            this.tempRegion = responseJson.projects;
          } else if (
            this.state.layer == 'planning_area' &&
            this.tempPlanningArea.length == 0
          ) {
            this.tempPlanningArea = responseJson.projects;
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  _formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  _handleSamePositionMarker(data, latitude = 0.00001, longitude = 0.000005) {
    for (var index = 0; index < data.length; index++) {
      for (var result = 0; result < index; result++) {
        if (
          Math.abs(data[index].latitude - data[result].latitude) <= latitude ||
          Math.abs(data[index].longitude - data[result].longitude) <= longitude
        ) {
          data[index].latitude += latitude;
          data[index].longitude += longitude;
        }
      }
    }
    //console.log('_handleSamePositionMarker',data);
    return data;
  }

  _initRegion() {
    return {
      latitude: CENTER_LAT_DEFAULT,
      longitude: CENTER_LNG_DEFAULT,
      latitudeDelta: 0.5,
      longitudeDelta: 0.3
    };
  }
  _getIcon(icon) {
    const markerStyle = { paddingHorizontal: 0 };
    //console.log('icon',icon);
    if (icon.count.length <= 2 && this.state.layer != 'asset') {
      markerStyle['paddingHorizontal'] = 12;
    } else if (icon.count.length == 3 && this.state.layer != 'asset') {
      markerStyle['paddingHorizontal'] = 10;
    } else if (this.state.layer != 'asset') {
      markerStyle['paddingHorizontal'] = 6;
    } else if (this.state.layer == 'asset' && icon.count.length < 2) {
      markerStyle['paddingHorizontal'] = 10;
    } else if (this.state.layer == 'asset' && icon.count.length == 2) {
      markerStyle['paddingHorizontal'] = 8;
    } else {
      markerStyle['paddingHorizontal'] = 4;
    }
    return markerStyle;
  }
  _constructMapURL(data) {
    let mapURL =
      API_GET_LISTING_RESULT +
      API_DOMAIN +
      this._handleParamSearchOption(data);
    return mapURL;
  }
  _handleParamSearchOption(data) {
    var temp = '';
    let paramSearch = {
      listing_type: this._setParameterValue1(data.listing_type),
      property_type: this._setParameterValue2(data.property_type.idList),
      district: this._setParameterValue2(data.district),
      bedroom_min: this._setParameterValue1(data.bedroom_min),
      asking_price_min: this._setParameterValue1(data.asking_price_min),
      asking_price_max: this._setParameterValue1(data.asking_price_max),
      build_up_min: this._setParameterValue1(data.build_up_min),
      build_up_max: this._setParameterValue1(data.build_up_max),
      land_area_min: this._setParameterValue1(data.land_area_min),
      land_area_max: this._setParameterValue1(data.land_area_max),
      tenure: this._setParameterValue2(data.tenure),
      bathroom: this._setParameterValue2(data.bathroom),
      furnishing: this._setParameterValue2(data.furnishing),
      completed: this._setParameterValue2(data.completed),
      level: this._setParameterValue2(data.level),
      completion_year_min: this._setParameterValue1(data.completion_year_min),
      completion_year_max: this._setParameterValue1(data.completion_year_max),
      rental_yield: this._setParameterValue1(data.rental_yield),
      high_rental_volume: this._setParameterValue1(data.high_rental_volume),
      high_sales_volume: this._setParameterValue1(data.high_sales_volume),
      deals: this._setParameterValue1(data.deals),
      nearby_amenities: this._setParameterValue2(data.nearby_amenities),
      amenities_distance: this._setParameterValue1(data.amenities_distance),
      rental_type: this._setParameterValue2(data.rental_type),
      keyword_features: data.keyword_features,
      keyword: data.keyword,
      asset_id: data.a,
      resource_type: data.t,
      x: data.x,
      y: data.y
    };
    if (data.is_search) paramSearch['is_search'] = data.is_search;

    Object.keys(paramSearch).map((item, index) => {
      temp += item + '=' + paramSearch[item] + '&';
    });
    return temp;
  }
  _setParameterValue1(val) {
    // if the data is object
    let tempVal = '';
    if (Object.keys(val).length !== 0) {
      tempVal += val.id;
    }
    return tempVal;
  }

  _setParameterValue2(val) {
    // if the data is array of string, array of object
    let tempVal = '';
    if (val.length > 0) {
      val.map((item, i) => {
        tempVal +=
          (item.id != undefined ? item.id : item) +
          (i < val.length - 1 ? ',' : '');
      });
    }
    return tempVal;
  }
  _callDataAfterCallOut(){
    if (this.state.layer == 'asset') {
      this.setState({
        callDataRegionChange: true,
        willShowCallout:false
      });
    }
  }

  _normalize(size, pixelRatio, deviceWidth, deviceHeight){
    if (pixelRatio >= 2 && pixelRatio < 3) {
      // iphone 5s and older Androids
      if (deviceWidth < 360) {
          return size * 0.95;
      }
      // iphone 5
      if (deviceHeight < 667) {
          return size;
          // iphone 6-6s
      } else if (deviceHeight >= 667 && deviceHeight <= 735) {
          return size * 1.15;
      }
      // older phablets
      return size * 1.25;
    }
    else if (pixelRatio >= 3 && pixelRatio < 3.5) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (deviceWidth <= 360) {
            return size;
        }
        // Catch other weird android width sizings
        if (deviceHeight < 667) {
            return size * 1.15;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (deviceHeight >= 667 && deviceHeight <= 735) {
            return size * 1.2;
        }
        // catch larger devices
        // ie iphone 6s plus / 7 plus / mi note 等等
        return size * 1.27;
    }
    else if (pixelRatio >= 3.5) {
        // catch Android font scaling on small machines
        // where pixel ratio / font scale ratio => 3:3
        if (deviceWidth <= 360) {
            return size;
            // Catch other smaller android height sizings
        }
        if (deviceHeight < 667) {
            return size * 1.2;
            // catch in-between size Androids and scale font up
            // a tad but not too much
        }
        if (deviceHeight >= 667 && deviceHeight <= 735) {
            return size * 1.25;
        }
        // catch larger phablet devices
        return size * 1.4;
    }
    // if older device ie pixelRatio !== 2 || 3 || 3.5
    else return size;
  }

  _isShowCallout(item){
    if (this.state.willShowCallout){
      return (['a','g','p','j'].includes(this.paramsData['t']) && (this.paramsData['keyword']==item.name))
    }
    return false
  }
  _getCircle(param){
    let circles =[]
    for(i=0;i<param.lat.length;i++){
      circles.push(
        <MapView.Circle
          center={{
            latitude: parseFloat(param.lat[i]),
            longitude: parseFloat(param.lng[i])
          }}
          key={i}
          radius={this.props.navigation.state.params.selectionFrom=='SchoolOption'?this._getDistance(this.state.mapUrl):1000}
          strokeColor={'#1779ba'}
          strokeWidth={2}
        />
      )
    }
    //console.log('_getCircle',circles);
    return circles
  }
  _animateRegion(layer){
      this.refs.mapView.animateToRegion({
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: layer == 'planning_area'?this.state.latitudeDelta/2 : this.state.latitudeDelta,
      longitudeDelta: layer == 'planning_area'? this.state.longitudeDelta/2 : this.state.longitudeDelta
    })
  }
  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <NavigationHelper
          ref={'navigationHelper'}
          navigation={this.props.navigation}
        />
        <MapView
          isLoading={this.state.isLoading}
          moveOnMarkerPress={false}
          ref={'mapView'}
          mapStyle={styles.map}
          onPress={() =>this._callDataAfterCallOut() }
          loadingEnabled={true}
          rotateEnabled={false}
          initialRegion={this._initRegion()}
          // region={{
          //   latitude:this.state.latitude,
          //   longitude: this.state.longitude,
          //   latitudeDelta: this.state.latitudeDelta,
          //   longitudeDelta: this.state.longitudeDelta
          // }}
          onRegionChangeComplete={region => {
            //console.log('region',region);
            if(this.animate){
              this._animateRegion(this.state.layer)
              this.animate=false
            }
            if (
              this.state.isClick == false
              //&& this.state.activeClick == false
            ) {
              if (
                region.zoomLevel >= ZOOM_LEVEL_MIN_REGION &&
                region.zoomLevel <= ZOOM_LEVEL_MAX_REGION &&
                this.state.suggestionBy != 'asset'
              ) {
                //console.log('region 1', region.zoomLevel);
                this.setState({
                  isClick: true,
                  isLoading: false,
                  //callDatabyZoom: true,
                  layer: 'region',
                  latitude: region.latitude,
                  longitude: region.longitude,
                  latitudeDelta: region.latitudeDelta,
                  longitudeDelta: region.longitudeDelta
                });
              } else if (
                region.zoomLevel >= ZOOM_LEVEL_MIN_PLANING_AREA &&
                region.zoomLevel < ZOOM_LEVEL_MAX_PLANING_AREA &&
                this.state.suggestionBy != 'asset'
              ) {
                //console.log('region 2', region.zoomLevel);

                this.setState({
                  isClick: true,
                  isLoading: false,
                  //callDatabyZoom: true,
                  layer: 'planning_area',
                  latitude: region.latitude,
                  longitude: region.longitude,
                  latitudeDelta: region.latitudeDelta,
                  longitudeDelta: region.longitudeDelta
                });
              } else if (
                region.zoomLevel >=
                  (this.state.suggestionBy == 'asset'
                    ? ZOOM_LEVEL_MIN_REGION
                    : ZOOM_LEVEL_MIN_ASSET) &&
                region.zoomLevel <= ZOOM_LEVEL_MAX_ASSET
              ) {
                //console.log('region 3', region.zoomLevel);
                this.setState({
                  isClick:
                    (this.state.suggestionBy == 'asset' ? false : true) &&
                    this.state.callDataRegionChange,
                  //isLoading: this.state.suggestionBy == 'asset' ? false : true,
                  //callDatabyZoom: true,
                  isLoading: this.state.callDataRegionChange ? true : false,
                  layer: 'asset',
                  latitudeDelta: region.latitudeDelta,
                  longitudeDelta: region.longitudeDelta,
                  latitude: region.latitude,
                  longitude: region.longitude
                });
                if (
                  (this.state.suggestionBy == 'asset' &&
                    this.state.isShowIcon) ||
                  this.state.callDataRegionChange == false
                ) {
                  this.setState({
                    isLoading: false
                  });
                }
              } else {
                console.log('REGION CONDITION FALSE');
              }
            }
          }}
          minZoomLevel={ZOOM_LEVEL_MIN}
          maxZoomLevel={ZOOM_LEVEL_MAX}
        >
          {this.state.suggestionBy == 'asset' ? (
           this._getCircle(this.center)
          ) : null}

          {Object.keys(this.state.outerLine).map((data, index) => {
            if (data != undefined) {
              return (
                <MapView.Polygon
                  key={index}
                  onPress={()=>this._callDataAfterCallOut()}
                  coordinates={
                    this.state.outerLine.length > 0
                      ? this.state.outerLine[data]
                      : []
                  }
                  fillColor={'rgba(0,0,0,0)'}
                  strokeWidth={2}
                  strokeColor="#1779ba"
                />
              );
            }
          })}
          {Object.keys(
            this._handleSamePositionMarker(this.state.markerRegion)
          ).map((data, index) => {
            if (data != undefined && this.state.isShowIcon) {
              return (
                <MapView.Marker
                  ref={'marker'}
                  stopPropagation={true}
                  isShowCallout={this._isShowCallout(this.state.markerRegion[data])}
                  //isShowCallout={['i','l','r','c','h'].includes(this.paramsData['t']) && this.paramsData['keyword']==this.state.markerRegion[data].name}
                  image={
                    this.state.layer != 'asset' && Platform.OS == 'android'
                      ? circle_icon_android
                      : Platform.OS == 'android'
                        ? asset_icon_android
                        : null
                  }
                  onPress={() => {
                     console.log('MARKED pressed');
                    if (
                      !this.state.mapUrl.includes('m_type=1')
                    ) {
                      this.refs.mapView.animateToRegion({
                        latitude: Object.values(
                          this.state.markerRegion[data]
                        )[0],
                        longitude: Object.values(
                          this.state.markerRegion[data]
                        )[1],
                        latitudeDelta: !this.state.mapUrl.includes('m_type')
                          ? this.state.latitudeDelta / 5
                          : this.state.latitudeDelta / 13,
                        //ZOOM_LEVEL_DEFAULT_DISTRICT,
                        longitudeDelta: !this.state.mapUrl.includes('m_type')
                          ? this.state.latitudeDelta / 5
                          : this.state.latitudeDelta / 13
                        //ZOOM_LEVEL_DEFAULT_DISTRICT
                      });
                    } else {
                      this.setState({
                        callDataRegionChange: false,
                        willShowCallout:false
                      });
                    }
                  }}
                  key={index}
                  coordinate={{
                    latitude: this.state.markerRegion[data].latitude,
                    longitude: this.state.markerRegion[data].longitude
                  }}
                >
                  {Platform.OS == 'android' ? (
                    <View
                      style={{
                        width: this.state.layer == 'asset' ? 30 : 43,
                        height: 43,
                        backgroundColor: 'rgba(0,0,0,0)',
                        // position: 'absolute',
                        opacity: 1,
                        justifyContent: 'center'
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          textAlign: 'center',
                          color: '#ffff',
                          fontSize: this._normalize(7, PIXELRATIO, DEVICEWIDTH, DEVICEHEIGHT),//PixelRatio.get()>=3? 8:11,
                          fontFamily: 'Poppins-SemiBold'
                        }}
                      >
                        {this.state.markerRegion[data].count}
                      </Text>
                    </View>
                  ) : null}

                  {this.state.mapUrl.includes('m_type=1') ? (
                    <MapView.Callout
                      style={{
                        minWidth: 300,
                        minHeight: 130
                      }}
                      onPress={() => {
                        console.log('ListingResult',this.state.markerRegion[index]);
                        this.refs.navigationHelper._navigate('ListingResult', {
                          data: {
                            keyword: this.state.markerRegion[index].name,
                            asset_id: this.state.markerRegion[index].asset_id,
                          },
                          title: 'CommonMap'
                        });
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center'
                        }}
                      >
                        <View style={{ justifyContent: 'center' }}>
                          {this.state.markerRegion[data].image ==
                          imageMapDefault ? (
                            Platform.OS == 'ios' ? (
                              <Image
                                style={{
                                  width: 100,
                                  height: 100
                                }}
                                source={{
                                  uri: this.state.markerRegion[data].image
                                }}
                              />
                            ) : (
                              <CalloutImage
                                source={this.state.markerRegion[data].image}
                                width={100}
                                height={90}
                              />
                            )
                          ) : Platform.OS == 'ios' ? (
                            <Image
                              style={{
                                //transform: [{ rotate: '90deg' }],
                                width: 100,
                                height: 100
                              }}
                              source={{
                                uri: this.state.markerRegion[data].image
                              }}
                            />
                          ) : (
                            <CalloutImage
                              source={this.state.markerRegion[data].image}
                              width={100}
                              height={100}
                            />
                          )}
                          {/* <View style={{ alignItems: 'center' }}>
                            <Text
                              allowFontScaling={false}
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 12
                              }}
                            >
                              {this.state.markerRegion[data].listing_count > 1
                                ? this.state.markerRegion[data].listing_count +
                                  ' Listings'
                                : this.state.markerRegion[data].listing_count +
                                  ' Listing'}
                            </Text>
                          </View> */}
                        </View>

                        <View
                          style={{
                            padding: 10,
                            flexDirection: 'column',
                            flex: 1,
                            justifyContent:'center'
                          }}
                        >
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontFamily: 'Poppins',
                              fontSize: 14,
                              fontWeight: 'bold'
                            }}
                          >
                            {this.state.markerRegion[data].name}
                          </Text>
                          <Text
                            allowFontScaling={false}
                            style={{
                              flexWrap: 'wrap',
                              fontFamily: 'Poppins-Regular',
                              fontSize: 12
                            }}
                          >
                            {this.state.markerRegion[data].district != '' && this.state.markerRegion[data].district ? (
                              <Text allowFontScaling={false} >
                                {isNaN(this.state.markerRegion[data].district)
                                  ? this.state.markerRegion[data].district
                                  : this.state.markerRegion[data]
                                      .district}.{' '}
                              </Text>
                            ) : null}
                            {this.state.markerRegion[data].street != '' && this.state.markerRegion[data].street? (
                              <Text allowFontScaling={false} >
                                {this.state.markerRegion[data].street}.{' '}
                              </Text>
                            ) : null}
                            {this.state.markerRegion[data].top != '' && this.state.markerRegion[data].top? (
                              <Text allowFontScaling={false} >
                              {this.state.markerRegion[data].top}. </Text>
                            ) : this.state.markerRegion[data].tenure != '' ? (
                              `\n`
                            ) : null}
                            {this.state.markerRegion[data].tenure != '' &&
                            this.state.markerRegion[data].tenure !=
                              undefined ? (
                              <Text allowFontScaling={false} >
                                {this.state.markerRegion[data].tenure !=
                                'Freehold'
                                  ? this.state.markerRegion[
                                      data
                                    ].tenure.replace(
                                      this.state.markerRegion[
                                        data
                                      ].tenure.slice(
                                        this.state.markerRegion[
                                          data
                                        ].tenure.indexOf('Yrs')
                                      ),
                                      ''
                                    ) + 'Years'
                                  : this.state.markerRegion[data].tenure}.{' '}
                              </Text>
                            ) : (
                              `\n`
                            )}
                          </Text>
                          {this.state.markerRegion[data].avg_psf != '' &&
                          this.state.markerRegion[data].avg_psf != undefined ? (
                            <Text 
                              allowFontScaling={false} >
                              style={{
                                fontFamily: 'Poppins',
                                fontSize: 12,
                                fontWeight: 'bold'
                              }}
                            >
                              Avg Price: RM{this._formatNumber(
                                this.state.markerRegion[data].avg_psf
                              )}{' '}
                              psf
                            </Text>
                          ) : null}
                          {this.state.markerRegion[data].min_price != '' &&
                          this.state.markerRegion[data].min_price != undefined &&
                          this.state.markerRegion[data].max_price != '' &&
                          this.state.markerRegion[data].max_price != undefined? (
                              <Text 
                                allowFontScaling={false} >
                                style={{
                                  fontFamily: 'Poppins',
                                  fontSize: 12,
                                  fontWeight: 'bold'
                                }}
                              >
                                ${this._formatNumber(
                                  parseFloat(
                                    this.state.markerRegion[data].min_price
                                  )
                                )}{' '}
                                - ${this._formatNumber(
                                  parseFloat(
                                    this.state.markerRegion[data].max_price
                                  )
                                )}
                              </Text>
                          ) : null}
                          {/* <View style={{ alignItems: 'center' }}> */}
                            <Text 
                              allowFontScaling={false} >
                              style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 12
                              }}
                            >
                              {this.state.markerRegion[data].count > 1
                                ? this.state.markerRegion[data].count +
                                  ' Listings'
                                : this.state.markerRegion[data].count +
                                  ' Listing'}
                            </Text>
                          {/* </View> */}
                        </View>
                      </View>
                    </MapView.Callout>
                  ) : null}
                  {Platform.OS == 'ios' ? (
                    <PinMarker
                      imageSource={
                        this.state.layer != 'asset' ? circle_icon : asset_icon
                      }
                      imageWidth={this.state.layer != 'asset' ? 40 : 30}
                      imageHeight={40}
                      overlayText={this.state.markerRegion[data].count}
                    />
                  ) : null}
                </MapView.Marker>
              );
            }
          })}
        </MapView>
        {this.state.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator style={{ height: 80 }} size="large" />
          </View>
        ) : null}
      </View>
    );
  }
}
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

  init: function() {
    this.b = this.a * (1 - this.f);
    this.e2 = 2 * this.f - this.f * this.f;
    this.e4 = this.e2 * this.e2;
    this.e6 = this.e4 * this.e2;
    this.A0 = 1 - this.e2 / 4 - 3 * this.e4 / 64 - 5 * this.e6 / 256;
    this.A2 = 3 / 8 * (this.e2 + this.e4 / 4 + 15 * this.e6 / 128);
    this.A4 = 15 / 256 * (this.e4 + 3 * this.e6 / 4);
    this.A6 = 35 * this.e6 / 3072;
  },

  computeSVY21: function(lat, lon) {
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
    var nTerm3 =
      w6 /
      720 *
      v *
      sinLat *
      cos5Lat *
      (8 * psi4 * (11 - 24 * t2) -
        28 * psi3 * (1 - 6 * t2) +
        psi2 * (1 - 32 * t2) -
        psi * 2 * t2 +
        t4);
    var nTerm4 =
      w8 / 40320 * v * sinLat * cos7Lat * (1385 - 3111 * t2 + 543 * t4 - t6);
    var N = this.oN + this.k * (M - Mo + nTerm1 + nTerm2 + nTerm3 + nTerm4);

    // Compute Easting
    var eTerm1 = w2 / 6 * cos2Lat * (psi - t2);
    var eTerm2 =
      w4 /
      120 *
      cos4Lat *
      (4 * psi3 * (1 - 6 * t2) + psi2 * (1 + 8 * t2) - psi * 2 * t2 + t4);
    var eTerm3 = w6 / 5040 * cos6Lat * (61 - 479 * t2 + 179 * t4 - t6);
    var E = this.oE + this.k * v * w * cosLat * (1 + eTerm1 + eTerm2 + eTerm3);

    return { N: N, E: E };
  },

  calcM: function(lat, lon) {
    var latR = lat * Math.PI / 180;
    return (
      this.a *
      (this.A0 * latR -
        this.A2 * Math.sin(2 * latR) +
        this.A4 * Math.sin(4 * latR) -
        this.A6 * Math.sin(6 * latR))
    );
  },

  calcRho: function(sin2Lat) {
    var num = this.a * (1 - this.e2);
    var denom = Math.pow(1 - this.e2 * sin2Lat, 3 / 2);
    return num / denom;
  },

  calcV: function(sin2Lat) {
    var poly = 1 - this.e2 * sin2Lat;
    return this.a / Math.sqrt(poly);
  },

  computeLatLon: function(N, E) {
    // Returns a pair (lat, lon) representing Latitude and Longitude.
    ////////console.log("computeLatLon");
    var Nprime = N - this.oN;
    var Mo = this.calcM(this.oLat);
    var Mprime = Mo + Nprime / this.k;
    var n = (this.a - this.b) / (this.a + this.b);
    var n2 = n * n;
    var n3 = n2 * n;
    var n4 = n2 * n2;
    var G =
      this.a *
      (1 - n) *
      (1 - n2) *
      (1 + 9 * n2 / 4 + 225 * n4 / 64) *
      (Math.PI / 180);
    var sigma = Mprime * Math.PI / (180 * G);

    var latPrimeT1 = (3 * n / 2 - 27 * n3 / 32) * Math.sin(2 * sigma);
    var latPrimeT2 = (21 * n2 / 16 - 55 * n4 / 32) * Math.sin(4 * sigma);
    var latPrimeT3 = 151 * n3 / 96 * Math.sin(6 * sigma);
    var latPrimeT4 = 1097 * n4 / 512 * Math.sin(8 * sigma);
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
    var latTerm1 = latFactor * (Eprime * x / 2);
    var latTerm2 =
      latFactor *
      (Eprime * x3 / 24) *
      (-4 * psiPrime2 + 9 * psiPrime * (1 - tPrime2) + 12 * tPrime2);
    var latTerm3 =
      latFactor *
      (Eprime * x5 / 720) *
      (8 * psiPrime4 * (11 - 24 * tPrime2) -
        12 * psiPrime3 * (21 - 71 * tPrime2) +
        15 * psiPrime2 * (15 - 98 * tPrime2 + 15 * tPrime4) +
        180 * psiPrime * (5 * tPrime2 - 3 * tPrime4) +
        360 * tPrime4);
    var latTerm4 =
      latFactor *
      (Eprime * x7 / 40320) *
      (1385 - 3633 * tPrime2 + 4095 * tPrime4 + 1575 * tPrime6);
    var lat = latPrime - latTerm1 + latTerm2 - latTerm3 + latTerm4;

    // Compute Longitude
    var secLatPrime = 1 / Math.cos(lat);
    var lonTerm1 = x * secLatPrime;
    var lonTerm2 = x3 * secLatPrime / 6 * (psiPrime + 2 * tPrime2);
    var lonTerm3 =
      x5 *
      secLatPrime /
      120 *
      (-4 * psiPrime3 * (1 - 6 * tPrime2) +
        psiPrime2 * (9 - 68 * tPrime2) +
        72 * psiPrime * tPrime2 +
        24 * tPrime4);
    var lonTerm4 =
      x7 *
      secLatPrime /
      5040 *
      (61 + 662 * tPrime2 + 1320 * tPrime4 + 720 * tPrime6);
    var lon =
      this.oLon * Math.PI / 180 + lonTerm1 - lonTerm2 + lonTerm3 - lonTerm4;

    return { lat: lat / (Math.PI / 180), lon: lon / (Math.PI / 180) };
  }
};

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF50'
  }
});
export default CommonMap;
