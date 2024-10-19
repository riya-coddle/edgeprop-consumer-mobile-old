import React, { Component } from 'React';
import { Platform, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import ToggleButton from '../Common_ToggleButton/Common_ToggleButton.js';
import Common_Table from '../Common_Table/Common_Table';
//import Transaction from '../../assets/json/Transaction.json'

// const API_DOMAIN = "https://www.edgeprop.sg";
// const API_GET_LISTING_TRANSACTIONS_SALE = API_DOMAIN + "/index.php?option=com_mobile&task=tx&op=data&listing_type=";
// const TIMEOUT = 1000;
import CombinedChart from '../Common_CombinedLineBarChart/Common_CombinedLineBarChart.js';
import MultipleLineChart from '../Common_MultipleLineChart/Common_MultipleLineChart.js';
import Transaction from '../../assets/json/Transaction.json';
import DisplayRentalData from '../../assets/json/DisplayRentalData.json';
import TypeOptions from '../../assets/json/TransactionTypeOptions.json';
import PeriodOptions from '../../assets/json/TransactionPeriodOptions.json';

export default class TransactionData extends Component {
  type = '';
  category = 'sale';
  period = 10;
  screenWidth = 375;
  chartData = {};
  categoryData = {};
  projectName = "";
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    type = props.type;
    this._handleChangeCategory = this._handleChangeCategory.bind(this);
    this._handleChangePeriod = this._handleChangePeriod.bind(this);
  }

  _capitalizeText(text){
    return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  _init() {
    if (this.props.type != undefined && this.props.type != this.type) {
      this.type = this.props.type;
    }
    if (this.props.projectName != undefined && this.props.projectName != this.projectName) {
      this.projectName = this.props.projectName;
    }
    if (
      this.props.screenWidth != undefined &&
      this.props.screenWidth != this.screenWidth
    ) {
      this.screenWidth = this.props.screenWidth;
    }
    if (
      this.props.screenHeight != undefined &&
      this.props.screenHeight != this.screenHeight
    ) {
      this.screenHeight = this.props.screenHeight;
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.projectName!=this.props.projectName || nextProps.count!=this.props.count || nextProps.isAPIReturn != this.props.isAPIReturn){
      return true
    }
    // if(nextProps.count!=this.props.count){
    //   return true
    // }
      return JSON.stringify(nextState.data) != JSON.stringify(this.state.data);
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.transactionData) !=
      JSON.stringify(this.props.transactionData)
    ) {
      if (this.type == 'chart') {
        Object.keys(nextProps.transactionData).map(index => {
          var item = nextProps.transactionData[index];
          if (
            JSON.stringify(item) !=
            JSON.stringify(this.props.transactionData[index])
          ) {
            if (Array.isArray(item) && item.length > 0) {
              if(index == "sale"){
                var prices = [];
                var months = [];
                var units = [];
                for (i = item.length - 1; i >= 0; i--) {
                  var data = item[i];
                  var price = data.unit_price_psf;
                  var d = new Date(data.contract_date * 1000);
                  var month = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
                  if (months[months.length - 1] == month) {
                    prices[prices.length - 1] += parseInt(price);
                    units[units.length - 1] += 1;
                  } else {
                    months.push(month);
                    prices.push(parseInt(price));
                    units.push(1);
                  }
                }
                prices = prices.map((item, index) => {
                  return item / units[index];
                });
                this.categoryData[index] = {
                  months,
                  prices,
                  units
                };
              }
              else if(index == "rent"){
                var data = {}
                var months = []
                var bedrooms = {
                  "1": {},
                  "2": {},
                  "3": {},
                  "4": {},
                  "5": {},
                  "NA": {}
                }
                Object.keys(bedrooms).map((i) => {
                  bedrooms[i].prices = []
                  bedrooms[i].months = []
                  bedrooms[i].units = []
                })
                for(i=item.length-1;i>=0;i--){
                    if(item[i].bedrooms == undefined || item[i].bedrooms.toString()=="-1" ){
                      j = "NA"
                    }
                    else if(bedrooms[item[i].bedrooms.toString()] != undefined){
                      j = item[i].bedrooms.toString()
                    }
                    var price = item[i].monthly_rent
                    var d = new Date(item[i].contract_date*1000)
                    var month = this.monthNames[d.getMonth()] + " " + d.getFullYear()
                    var bedroom = bedrooms[j]
                    if(bedroom.months[bedroom.months.length-1] == month){
                        bedroom.prices[bedroom.prices.length-1] += parseInt(price)
                        bedroom.units[bedroom.units.length-1] += 1
                    }
                    else{
                        bedroom.months.push(month)
                        bedroom.prices.push(parseInt(price))
                        bedroom.units.push(1)
                    }
                    if(month!=months[months.length-1]){
                        months.push(month)
                    }
                }
                Object.keys(bedrooms).map((i) => {
                  var bedroom = bedrooms[i]
                  bedroom.prices = bedroom.prices.map((item,i)=>{
                      return(item/bedroom.units[i])
                  })
                })
                this.categoryData[index] = {
                  bedrooms,
                  months
                };
              }
              if (this.category == index && this.categoryData[index]!=undefined) {
                this.setState({
                  data: this._getDataFilterByPeriod(
                    this.categoryData[index],
                    this.period
                  )
                });
              }
            }
          }
        });
      }
      if (this.type == 'table') {
        Object.keys(nextProps.transactionData).map(index => {
          var item = nextProps.transactionData[index];
          if (JSON.stringify(item) != JSON.stringify(this.props.transactionData[index])){
            if (Array.isArray(item) && item.length > 0) {
              this.categoryData[index] = [];
              for(var i=0; i<Math.min(10,item.length); i++){
                var data = item[i]
                var newData = Object.assign({},data)
                var d = new Date(data.contract_date * 1000);
                newData.contract_date = d.getDate().toString() + " " + this.monthNames[d.getMonth()] + " " + d.getFullYear().toString()
                newData.monthly_rent = this._formatNumber(parseFloat(data.monthly_rent))//new Intl.NumberFormat().format(data.monthly_rent)
                newData.unit_price_psf = this._formatNumber(parseFloat(data.unit_price_psf))//new Intl.NumberFormat().format(data.unit_price_psf)
                newData.transacted_price = this._formatNumber(parseFloat(data.transacted_price))//new Intl.NumberFormat().format(data.transacted_price)
                if(data.monthly_rent && data.lower_bound && data.upper_bound){
                  newData.monthly_rent_psf = parseFloat(data.monthly_rent/((data.lower_bound + data.upper_bound) / 2)).toFixed(1);
                }
                if(data.bedrooms == -1){
                  newData.bedrooms= ""
                }
                this.categoryData[index].push(newData)
              }
              if (this.category == index) {
                this.setState({
                  data: this.categoryData[index]
                });
              }
            }
          }
        });
      }
    }
  }

  _formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  _handleChangeCategory(index, id, title) {
    this.category = id;
    if (this.type == 'chart') {
      if(this.categoryData[id]!=undefined){
        this.setState({
          data: this._getDataFilterByPeriod(this.categoryData[id], this.period)
        });
      }
      else{
        this.setState({
          data: {}
        })
      }
    }
    else if (this.type == 'table') {
      this.setState({
        data: this.categoryData[id]
      });
    }
  }

  _getFilterByMonth(data, period){
    var { months, prices, units } = data;
    var year = new Date().getFullYear();
    var newMonths = [];
    var newPrices = [];
    var newUnits = [];
    for (var i = 0; i < months.length; i++) {
      if (year - parseInt(months[i].split(' ')[1]) < period) {
        newMonths.push(months[i]);
        newPrices.push(prices[i]);
        newUnits.push(units[i]);
      }
    }
    return {
      months: newMonths,
      prices: newPrices,
      units: newUnits
    };
  }

  _getDataFilterByPeriod(data, period) {
    if(this.category=="sale"){
      return this._getFilterByMonth(data, period)
    }
    else if(this.category=="rent"){
      var newBedrooms = {}
      Object.keys(data.bedrooms).map((index)=>{
        newBedrooms[index]=this._getFilterByMonth(data.bedrooms[index], period)
      })
      var year = new Date().getFullYear();
      var newMonths = data.months.filter((month)=>{
        var found = false
        for(var index in newBedrooms){
          if(newBedrooms[index].months.indexOf(month)>-1){
            found = true;
            break;
          }
        }
        return found
      })
      return {
        bedrooms: newBedrooms,
        months: newMonths
      }
    }
  }

  _handleChangePeriod(index, id, title) {
    this.period = id;
    if(this.categoryData[this.category]!=undefined){
      this.setState({
        data: this._getDataFilterByPeriod(
          this.categoryData[this.category],
          this.period
        )
      });
    }
  }

  render() {
    // console.log("render transaction", this.type, this.category, this.state);
    this._init();
    _renderNoData = () => {
      if(this.state.data == undefined ||
        (this.type == 'chart' && (this.state.data.months == undefined || this.state.data.months.length<=0)) ||
        (this.type == 'table' && (this.state.data == undefined || this.state.data.length <= 0))){
          return (
            <View>
              {this.props.isAPIReturn?
                (
                  <View
                    style={{
                    width: this.screenWidth,
                    height: 80,
                    backgroundColor: "#f7e4e1",
                    borderWidth: 1,
                    borderColor: "hsla(0,0%,4%,.25)",
                    marginBottom: 20,
                    marginTop: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text allowFontScaling={false} style={{
                      color:"#0a0a0a",
                      fontSize: 16,
                      fontFamily: "Poppins-Regular"
                    }}>
                      No {this._capitalizeText(this.category)} Transactions Available
                    </Text>
                  </View>
                )
                :(<ActivityIndicator
                  animating size='large'
                  style={{
                    height: 80
                  }}
                />)
              }
            </View>
          )
        }

    }
    if (this.type == 'chart') {
      return (
        <View
          style={{
            width: this.screenWidth,
            // height: 378,
            backgroundColor: '#f3f6f9',
            paddingTop: 19,
            // paddingBottom: 50,
            marginTop: 5,
            //alignItems: 'center'
            // justifyContent: 'center'
          }}>
          <View style={{alignItems:'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                color: '#4a4a4a',
                lineHeight: 23
              }}>
              Historical {this._capitalizeText(this.category)} Price Range & Volume
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 12,
                color: '#4a4a4a',
                marginBottom: 12,
                lineHeight: 19
              }}>
              {"Average Transaction Price of " + this.projectName}
            </Text>
            <ToggleButton
              data={TypeOptions}
              initFocusIndex={0}
              containerStyle={{
                marginBottom: 10
              }}
              itemContainerStyle={{
                width: 80,
                height: 30
              }}
              borderRadius={20}
              onItemPress={this._handleChangeCategory}
            />
            <ToggleButton
              data={PeriodOptions}
              initFocusIndex={3}
              containerStyle={{
                marginBottom: 10
              }}
              itemContainerStyle={{
                width: 60,
                height: 30
              }}
              borderRadius={5}
              onItemPress={this._handleChangePeriod}
            />
            {_renderNoData()}
            {(this.category=="sale" && this.state.data != undefined && this.state.data.months != undefined && this.state.data.months.length>0)?(
                <View style={{alignItems:'center'}}>
                  <CombinedChart
                    barChartData={this.state.data.units}
                    lineChartData={this.state.data.prices}
                    xData={this.state.data.months}
                    lineChartTitle={'Average Price (S$ psf)'}
                    barChartTitle={'Volume'}
                    containerStyle={{ marginLeft: 20, marginTop: 20, marginBottom: 50}}
                    chartWidth={this.screenWidth * 0.75}
                    chartHeight={this.screenWidth * 0.421875}
                  />
                </View>
              ):<View/>}
            {(this.category=="rent" && this.state.data != undefined && this.state.data.months != undefined && this.state.data.months.length>0)?(
              <MultipleLineChart
                containerStyle={{marginLeft: 70, marginTop: 20}}
                labelContainerStyle={{marginBottom: 20}}
                chartWidth={this.screenWidth * 0.8}
                chartHeight={this.screenWidth * 0.421875}
                data={this.state.data.bedrooms}
                xData={this.state.data.months}
                displayData={DisplayRentalData}
                lineChartTitle={"Average Rental Price (S$)"}
              />
            ):<View/>}
          </View>
        </View>
      )
    }
    else if (this.type == 'table') {
      var title = {
        sale: [
          'Date',
          'Address',
          'Type of Sale',
          'Area(sqm)',
          'Type of Area',
          'Price(S$psm)',
          'Price(S$)'
        ],
        rent: [
          'Date',
          'Street',
          'Type',
          'Unit Size(sqm)',
          'Bedrooms',
          'Monthly Rent\n(S$)',
          'Monthly Rent\n(Est S$psm)'
        ]
      };
      var dataItem = {
        sale: [
          'contract_date',
          'full_address',
          'type_of_sale',
          'area_sqft',
          'type_of_area',
          'unit_price_psf',
          'transacted_price'
        ],
        rent: [
          'contract_date',
          'street_name',
          'type',
          'area_sqft',
          'bedrooms',
          'monthly_rent',
          'monthly_rent_psf'
        ]
      };
      var columnWidth = {
        sale: [
          100,
          180,
          110,
          100,
          100,
          110,
          100
        ],
        rent: [
          100,
          110,
          180,
          130,
          90,
          110,
          110
        ]
      };
      return (
        <View
          style={{
            width: this.screenWidth,
            // height: 600,
            backgroundColor: '#f3f6f9',
            paddingTop: 19,
            paddingBottom: 30,
            marginTop: 9
            //alignItems: 'center',
            // justifyContent: 'center'
          }}>
          <View style={{ alignItems: 'center' }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                color: '#4a4a4a',
                lineHeight: 23,
                marginBottom: 12
              }}
            >
              {"Transactions of "+this.projectName}
            </Text>
            <ToggleButton
              data={TypeOptions}
              initFocusIndex={0}
              containerStyle={{
                marginBottom: 10
              }}
              itemContainerStyle={{
                width: 80,
                height: 30
              }}
              borderRadius={20}
              onItemPress={this._handleChangeCategory}
            />
          </View>
          {_renderNoData()}
          {(this.state.data != undefined && this.state.data.length > 0 && (this.category=="sale"||this.category=="rent"))?
          (<Common_Table
            data={this.state.data}
            title={title[this.category]}
            dataItem = {dataItem[this.category]}
            width = {columnWidth[this.category]}
            isProtools = {this.props.isProtools}
          />):<View/>}
        </View>
      );
    }
    return <View/>;
  }
}
