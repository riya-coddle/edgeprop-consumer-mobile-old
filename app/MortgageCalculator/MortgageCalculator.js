import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  Image,
  Modal,
  Keyboard
} from 'react-native';
import Tools_List from '../../components/Tools_List/Tools_List.js'
import Tools_TextBox from '../../components/Tools_TextBox/Tools_TextBox.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class MortgageCalculator extends Component<{}> {
  resultFields = {
    loan_amount: {
      id: "loan_amount",
      title: "Loan Amount",
      content: "$568,000"
    },
    month_repay: {
      id: "month_repay",
      title: "Monthly Repayment",
      content: "$2,043"
    }
  }
  defaultInputValues = {
    downpaymt_percent: 20,
    interest: 1.8,
    length: 30
  }
  inputFields={
    downpaymt_percent:{
      id: "downpaymt_percent",
      title: "Percentage of Downpayment (%)",
      hint: "20%",
      value: "20"
    },
    interest:{
      id: "interest",
      title: "Interest Rate of Mortgage (%)",
      hint: "1.8%",
      value: "1.8"
    },
    length:{
      id: "length",
      title: "Length of Mortgage (Years)",
      hint: "30 Years",
      value: "30"
    }
  }
  constructor(props){
    super(props);
    this.state = {
      update: false
    }
    var {height, width} = Dimensions.get('window')
    this.screenWidth = width
    this.screenHeight = height
    this._handleCalculateMortgage = this._handleCalculateMortgage.bind(this)
    this._handleInputChange = this._handleInputChange.bind(this)
    this._handleOnSubmit = this._handleOnSubmit.bind(this)
    this.loanAmountValue = 0
    this.monthRepayValue = 0
    this.askingPriceValue = 0
    if(this.props.navigation.state.params.data != undefined && this.props.navigation.state.params.data.asking_price_value!=undefined){
      this.askingPriceValue = this.props.navigation.state.params.data.asking_price_value
    }
    this._handleCalculateMortgage();
  }

  static navigationOptions = ({ navigation }) => {
    var { state, setParams } = navigation;
    var {params} = state
    return {
      title: "Mortgage Calculator".toUpperCase(),
    }
  };

  formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  formatMoney(value){
    if ((typeof value !== 'undefined') && (value))
      return "RM " + this.formatNumber(value);
    else
      return "RM "
  }

  amortizationTable(principal, years, mortgage_interest_percent) {
    var payments = years * 12;
    var monthlyInterest = (mortgage_interest_percent / 100) / 12;
    var monthlyPayment = this.mortgage(principal, years, mortgage_interest_percent);
    var netIncome = this.mortgage(principal, years, "3.5");
    var data = {};
    var startPrincipal = principal;
    data.principal = [];
    data.total = [];
    data.monthlyPayment = monthlyPayment;
    data.netIncome = netIncome;

    var total_spent_over_term = 0;

    for (var i = 1; i <= payments; i++)
    {
        var interestPayment = principal * monthlyInterest;
        interestPayment = this.roundToPennies(interestPayment);

        var principalPayment = monthlyPayment - interestPayment;
        principalPayment = this.roundToPennies(principalPayment);

        total_spent_over_term = parseInt(total_spent_over_term) + (parseInt(interestPayment) + parseInt(principalPayment));

        principal -= principalPayment;

        //principal = 0;

        principal = principal;
        data.principal.push(parseInt(principal));
    }

    var total_amount = total_spent_over_term;
    data.totalInterest = total_amount - startPrincipal;
    for (i = 1; i <= payments; i++) {
        total_amount = total_amount - monthlyPayment;
        data.total.push(parseInt(total_amount));
    }
    return data;
  }

  roundToPennies(n) {
    var pennies = n * 100;
    pennies = Math.round(pennies);
    var strPennies = "" + pennies;
    var len = strPennies.length;
    var val = strPennies.substring(0, len - 2) + "." + strPennies.substring(len - 2, len);
    return val;
  }

  mortgage(principal, year_term, mortgage_interest_percent) {
    var rate = (mortgage_interest_percent / 100) / 12;
    return this.roundToPennies(principal * rate / (1 - (1 / Math.pow(1 + rate, year_term * 12))));
  }

  _handleCalculateMortgage() {
    var listing_price = this.askingPriceValue;
    var downpayment_percentage = parseFloat(this.inputFields.downpaymt_percent.value) //|| this.defaultInputValues.downpaymt_percent;
    var interest_rate = parseFloat(this.inputFields.interest.value) //|| this.defaultInputValues.interest
    var mortgage_length = parseFloat(this.inputFields.length.value) //|| this.defaultInputValues.length
    var total_amount = 0;

    if(listing_price > 0) {
      if(downpayment_percentage > 0) {
        var minus_downpayment = parseFloat((100 - downpayment_percentage)/100);
        total_amount = parseInt(minus_downpayment * listing_price);
      }

      if(total_amount > 0 && interest_rate > 0 && mortgage_length > 0) {
        var res = this.amortizationTable(total_amount, mortgage_length, interest_rate);
        var monthly_payment = parseInt(res.monthlyPayment);
        // var interest_first_month = parseInt((total_amount * (interest_rate/100))/12)
        // var principal_amount = monthly_payment - interest_first_month;
      }
    }

    this.loanAmountValue = total_amount
    this.monthRepayValue = monthly_payment
    if(this.didMount){
      this.setState({
        update: !this.state.update
      })
    }
  }

  _handleInputChange(id, value){
    this.inputFields[id].value = value
    this._handleCalculateMortgage()
  }

  _handleOnSubmit(id){
    var next = false
    var indexArray = Object.keys(this.inputFields)
    if(id==indexArray[indexArray.length-1]){
      Keyboard.dismiss();
    }
    else{
      var index = indexArray.indexOf(id)
      if(index>-1){
        if(this.refs[indexArray[index+1]]!=undefined){
          this.refs[indexArray[index+1]]._getFocus();
        }
      }
    }
  }

  componentDidMount(){
    this.didMount = true
  }

  render() {
    this.resultFields.loan_amount.content = this.formatMoney(parseFloat(this.loanAmountValue))
    this.resultFields.month_repay.content = this.formatMoney(parseFloat(this.monthRepayValue))
    var renderInputFields = () => {
      if(Object.keys(this.inputFields).length>0){
        return Object.keys(this.inputFields).map(index => {
          var containerStyle = {
            marginBottom : 13
          }
          if(Object.keys(this.inputFields).indexOf(index) == Object.keys(this.inputFields).length-1){
            containerStyle.marginBottom = 41
          }
          return(
            <Tools_TextBox
              ref={this.inputFields[index].id}
              id={this.inputFields[index].id}
              key={this.inputFields[index].id}
              title={this.inputFields[index].title}
              hint={this.inputFields[index].hint}
              containerStyle={containerStyle}
              onChange={this._handleInputChange}
              onSubmit={this._handleOnSubmit}
              defaultValue={this.defaultInputValues[index].toString()}
            />
          )
        })
      }
    }
    return(
      <KeyboardAwareScrollView>
        <ScrollView style={{backgroundColor: "#f8f8f8"}}>
          <Tools_List
            list={{
              price: {
                id: "price",
                title: "Sale Price of home",
                content: this.formatMoney(parseFloat(this.askingPriceValue))
              }
            }}
            containerStyle={{
              height: 59,
              paddingLeft: 13
            }}
            titleTextStyle={{
              fontFamily: "Poppins-Regular",
              fontSize: 16,
              color: "#275075"
            }}
            contentTextStyle={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 16,
              color: "#275075"
            }}
          />
          {renderInputFields()}
          <Tools_List
            isBorder={true}
            list={this.resultFields}
          />
        </ScrollView>
      </KeyboardAwareScrollView>
    )
  }
}
