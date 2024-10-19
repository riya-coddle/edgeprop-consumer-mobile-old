import React, { Component } from 'React'
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
    FlatList,
} from 'react-native'

export default class Listing_KeyDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.style = {
            // default value
            margin: 16,
            fontSize: 14,
            color: '#4A4A4A',
            fontFamily: 'Poppins-Medium',
            flexDirection: 'column',
            alignItems: 'flex-start',
        }
        this.item = {
            type: '-',
            size: '-',
            sizeUnit: '',
            psf: '-',
            top: '-',
            listingId: '-',
            tenure: '-',
            remainingTenure: '-',
            developer: '-',
            furnishing: '-',
            floorLevel: '-',
            reListed: '-',
            asset_tenure: ''
        }

    }
    _initStyle() {
        // init margin
        if (this.props.margin && this.props.margin != this.style.margin) {
            this.style.margin = this.props.margin
        }
        // init fontSize
        if (this.props.fontSize && this.props.fontSize != this.style.fontSize) {
            this.style.fontSize = this.props.fontSize
        }
        // init color
        if (this.props.color && this.props.color != this.style.color) {
            this.style.color = this.props.color
        }
        // init fontFamily
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        // init alignItems
        if (this.props.alignItems && this.props.alignItems != this.style.alignItems) {
            this.style.alignItems = this.props.alignItems
        }
    }
    _initItem() {
        // init type
        if (this.props.keydetails.type && this.props.keydetails.type != this.item.type) {
            this.item.type = this.props.keydetails.type
        }
        // init size
        if (this.props.keydetails.size && this.props.keydetails.size != this.item.size) {
            this.item.size = this.props.keydetails.size
        }
        // init size
        if (this.props.keydetails.sizeUnit && this.props.keydetails.sizeUnit != this.item.sizeUnit) {
            this.item.sizeUnit = this.props.keydetails.sizeUnit
        }
        // init psf
        if (this.props.keydetails.psf && this.props.keydetails.psf != this.item.psf) {
            this.item.psf = this.props.keydetails.psf
        }
        // init top
        if (this.props.keydetails.top && this.props.keydetails.top != this.item.top) {
            this.item.top = this.props.keydetails.top
        }
        // init listingId
        if (this.props.keydetails.listingId && this.props.keydetails.listingId != this.item.listingId) {
            this.item.listingId = this.props.keydetails.listingId
        }
        // init tenure
        if (this.props.keydetails.tenure && this.props.keydetails.tenure != this.item.tenure) {
            this.item.tenure = this.props.keydetails.tenure
        }
        // init asset_tenure
        if (this.props.keydetails.asset_tenure && this.props.keydetails.asset_tenure != this.item.asset_tenure) {
            this.item.asset_tenure = this.props.keydetails.asset_tenure
        }
        // init remainingTenure
        if (this.props.keydetails.remainingTenure && this.props.keydetails.remainingTenure != this.item.remainingTenure) {
            this.item.remainingTenure = this.props.keydetails.remainingTenure
        }
        // init developer
        if (this.props.keydetails.developer && this.props.keydetails.developer != this.item.developer) {
            this.item.developer = this.props.keydetails.developer
        }
        // init furnishing
        if (this.props.keydetails.furnishing && this.props.keydetails.furnishing != this.item.furnishing) {
            this.item.furnishing = this.props.keydetails.furnishing
        }
        // init floorLevel
        if (this.props.keydetails.floorLevel && this.props.keydetails.floorLevel != this.item.floorLevel) {
            this.item.floorLevel = this.props.keydetails.floorLevel
        }
        // init reListed
        if (this.props.keydetails.reListed && this.props.keydetails.reListed != this.item.reListed) {
            this.item.reListed = this.props.keydetails.reListed
        }
        if (this.props.keydetails.landSize && this.props.keydetails.reListed != this.item.reListed) {
            this.item.landSize = this.props.keydetails.landSize
        }
        if (this.props.keydetails.landAreaPsf && this.props.keydetails.landAreaPsf != this.item.landAreaPsf) {
            this.item.landAreaPsf = this.props.keydetails.landAreaPsf
        }
    }
    _capitalizeFirstLetter(str) {
        if ((typeof str) == 'string') {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            })
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return (JSON.stringify(nextProps.item) != JSON.stringify(this.item))
    }
    render() {
        //console.log('fff ', this.props);
        this._initStyle()
        this._initItem()

    // tenure
    var tenure_date_string = "";
    var tenure_date_year = "";
    var tenure_years = "";

    if (this.item.asset_tenure) {
      switch(this.item.asset_tenure) {
        case "Freehold":
          tenure_date_string = this.item.asset_tenure;
          break;

        default:
          var temp_tenure = this.item.asset_tenure.toString();
          var date_end = temp_tenure.substring(temp_tenure.length - 10, temp_tenure.length);
          if(date_end.length == 10) {
            var temp_dates = date_end.split("/");
            tenure_years = parseInt(temp_tenure.substring(0, temp_tenure.length - 10));
            if(temp_dates.length > 1) {
              tenure_date_year = temp_dates[2];
              tenure_date_string = temp_tenure.substring(0, temp_tenure.length - 10) + tenure_date_year;
            } else {
              temp_dates = date_end.split(" ");
              tenure_date_year = temp_dates[2];
              tenure_date_string = temp_tenure;
            }
            tenure_date_string = tenure_date_string.toLowerCase();
          }
          if (tenure_date_string.length === 0) {
            var asset_tenure_value = this.item.asset_tenure.toString().replace("years", "Years");
            if (asset_tenure_value.indexOf("Years") === -1) {
              asset_tenure_value += " Years";
            }
            tenure_date_string = asset_tenure_value;
          }
      }
      if(tenure_date_string != "" && tenure_date_year != "") {
        tenure_date_string = isNaN(parseInt(tenure_date_year) + tenure_years - (new Date().getFullYear())) ? tenure_date_string : tenure_date_string + " (" + (parseInt(tenure_date_year) + tenure_years - (new Date().getFullYear())) +" yrs left)";
      }
  }else if (this.item.tenure) {
      tenure_date_string = this.item.tenure;
    }
    // adding remaining years to the tenure
    if(tenure_date_string != "" && parseInt(tenure_date_string) > 0 && tenure_date_year == "" && this.item.top != "" && parseInt(this.item.top) > 0) {
      var years_remaining = parseInt(tenure_date_string) - (new Date().getFullYear() - parseInt(this.item.top));
      tenure_date_string = tenure_date_string + " (" + years_remaining + " yrs left)";
    }

        keydetails = {
            'Property Type': 'For '+this._capitalizeFirstLetter(this.item.type),
            'Land Area PSF': (this.props.keydetails.landAreaPsf && this.props.keydetails.landAreaPsf != "RM0")?this.props.keydetails.landAreaPsf:"-",
            'Built-up PSF': this.item.psf != "RM0"?this.item.psf:"-",
            
            // 'Remaining Tenure': this.item.remainingTenure,
            // 'Developer': this.item.developer,
            //'Floor Level': this._capitalizeFirstLetter(this.item.floorLevel),
            //'TOP': this.item.top,
            'Updated': this._capitalizeFirstLetter(this.item.reListed),
            'Tenure': tenure_date_string?tenure_date_string:'',
            //'Furnishing': this._capitalizeFirstLetter(this.item.furnishing),
            'Land Area': (this.props.keydetails.landSize && this.props.keydetails.landSize != '-')?this.props.keydetails.landSize+' '+this.item.sizeUnit:'-',
            'Built-up': this.item.size+' '+this.item.sizeUnit,
            'Listing ID': this.item.listingId,
        }
        var Detail = Object.keys(keydetails).map(function(item, index){
           //  console.log(item, keydetails[item], index)
            return(
                <View style={{flexDirection:'column', marginLeft:3}} key={index}>
                    <View style={{width:'100%'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize: 14,
                            fontFamily: 'Poppins-Regular',
                            color: '#A0ACC1',
                            alignItems: 'flex-start',
                            lineHeight:25,
                            paddingTop: 6
                        }}>{item}</Text>
                    </View>
                    <View style={{width:'100%'}}>
                        <Text allowFontScaling={false} style={{
                            fontSize: 17,
                            paddingBottom: 8,
                            fontFamily: 'Poppins-Regular',
                            color: '#414141',
                            alignItems: 'flex-start',
                            fontWeight: '100',
                            borderBottomColor:'#D3D3D3',
                            borderBottomWidth: 0.5
                         }}>{keydetails[item]}</Text>
                    </View>
                </View>
            )
        });
        return (
            <View style={{
                margin: this.style.margin
            }}>
                <View>
                    <Text allowFontScaling={false} style={{
                        fontSize: 22,
                        fontFamily: this.style.fontFamily,
                        color: '#414141',
                        alignItems: this.style.alignItems,
                        fontWeight: 'bold',
                        paddingBottom: 19
                    }}>Details</Text>
                </View>
                {Detail}
            </View>
        );
    }
}
