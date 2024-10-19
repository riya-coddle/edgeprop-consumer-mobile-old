import React, { Component } from 'React'

import { TouchableHighlight, View, Image, StyleSheet, Text, Dimensions } from 'react-native'
import IconMenu from '../Common_IconMenu/Common_IconMenu'

var mortgageIcon = require('../../assets/icons/mortgage_1.png')
var premiumIcon = require('../../assets/icons/premium-property_active.png');
var checked = require('../../assets/icons/checked.png');
const {height, width} = Dimensions.get('window');
class Listing_PriceInfo extends Component {
    isDidMount = false
    constructor(props) {
        super(props)
        this.style = {
            //backgroundColor: '#fff',
            fontFamily: 'Poppins-Regular',
            boldingFontFamily: 'Poppins-SemiBold',
             paddingHorizontal: 14,
            paddingLeft: 14,
            paddingRight: 0,
         }
        this.priceInfo = {
            listingType: null,
            askingPriceType: null,
            askingPrice: null,
            fairValue: null,
        }

        this.form = {
            downpayment: { id: "downpayment", title: "Percentage of Downpayment", value: 10, unit: "%" },
            interest: { id: "interest", title: "Interest Rate of Mortgage", value: 4.6, unit: "%" },
            length: { id: "length", title: "Length of Mortgage", value: 30, unit: "years" },
            amount: { id: "amount", title: "Total Loan Amount", value: 1600, unit: "SGD" }
        }

        this.calculated = {
            loanAmt: null,
            monthlyPayment: null,
            principalInterest: null,
            interest: null
        }
    }

    componentDidMount(){
        this.isDidMount = true
    }

    componentWillUnmount(){
        this.isDidMount = false
    }

    _init() {
        if (this.props.backgroundColor && this.props.backgroundColor != this.style.backgroundColor) {
            this.style.backgroundColor = this.props.backgroundColor
        }
        if (this.props.fontFamily && this.props.fontFamily != this.style.fontFamily) {
            this.style.fontFamily = this.props.fontFamily
        }
        if (this.props.boldingFontFamily && this.props.boldingFontFamily != this.style.boldingFontFamily) {
            this.style.boldingFontFamily = this.props.boldingFontFamily
        }
        if (this.props.paddingRight && this.props.paddingRight != this.style.paddingRight) {
            this.style.paddingRight = this.props.paddingRight
        }
        if (this.props.paddingLeft && this.props.paddingLeft != this.style.paddingLeft) {
            this.style.paddingLeft = this.props.paddingLeft
        }
        if (this.props.paddingVertical && this.props.paddingVertical != this.style.paddingVertical) {
            this.style.paddingVertical = this.props.paddingVertical
        }
        if (this.props.priceInfo && JSON.stringify(this.props.priceInfo) != JSON.stringify(this.priceInfo)) {
            this.priceInfo.listingType = this.props.priceInfo.listingType || this.priceInfo.listingType
            this.priceInfo.askingPriceType = this.props.priceInfo.askingPriceType || this.priceInfo.askingPriceType
            this.priceInfo.askingPrice = this.props.priceInfo.askingPrice || this.priceInfo.askingPrice
            this.priceInfo.fairValue = this.props.priceInfo.fairValue || this.priceInfo.fairValue
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(this.priceInfo) != JSON.stringify(nextProps.priceInfo))
    }

    _formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    _formatMoney(val) {
        return val ? 'RM ' + this._formatNumber(val) : '-'
    }

    _roundToPennies(n) {
        var pennies = n * 100;
        pennies = Math.round(pennies);
        var strPennies = "" + pennies;
        var len = strPennies.length;
        var val = strPennies.substring(0, len - 2) + "." + strPennies.substring(len - 2, len);
        return val;
    }

    _mortgage(principal, year_term, mortgage_interest_percent) {
        var rate = (mortgage_interest_percent / 100) / 12;
        return this._roundToPennies(principal * rate / (1 - (1 / Math.pow(1 + rate, year_term * 12))));
    }

    _amortizationTable(principal, years, mortgage_interest_percent) {
        var payments = years * 12;
        var monthlyInterest = (mortgage_interest_percent / 100) / 12;
        var monthlyPayment = this._mortgage(principal, years, mortgage_interest_percent);
        var netIncome = this._mortgage(principal, years, "3.5");
        var data = {};
        var startPrincipal = principal;
        data.principal = [];
        data.total = [];
        data.monthlyPayment = monthlyPayment;
        data.netIncome = netIncome;

        var total_spent_over_term = 0;

        for (var i = 1; i <= payments; i++) {
            var interestPayment = principal * monthlyInterest;
            interestPayment = this._roundToPennies(interestPayment);

            var principalPayment = monthlyPayment - interestPayment;
            principalPayment = this._roundToPennies(principalPayment);

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

    _handleCalculateMortgage() {
        var listing_price = this.priceInfo.askingPrice
        var downpayment_percentage = parseFloat(this.form.downpayment.value) || 0;//parseFloat($(".downpayment_percentage").val()) || 0;
        var interest_rate = parseFloat(this.form.interest.value) || 0;//parseFloat($(".interest_rate").val()) || 0;
        var mortgage_length = parseFloat(this.form.length.value) || 0;//parseInt($(".mortgage_length").val()) || 0;
        var total_amount = 0;

        if (listing_price > 0) {
            if (downpayment_percentage > 0) {
                var minus_downpayment = parseFloat((100 - downpayment_percentage) / 100);
                total_amount = parseInt(minus_downpayment * listing_price);
            }

            if (total_amount > 0 && interest_rate > 0 && mortgage_length > 0) {
                var res = this._amortizationTable(total_amount, mortgage_length, interest_rate);
                var monthly_payment = parseInt(res.monthlyPayment);
                var interest_first_month = parseInt((total_amount * (interest_rate / 100)) / 12)
                var principal_amount = monthly_payment - interest_first_month;
            }
        }

        this.calculated = {
            monthlyPayment: monthly_payment,
        }
    }

    _isEmptyValue(val) {
        return (val == undefined || val == '' || val == 'Uncompleted')
    }

    _handleEmptyValue(val) {
        // handle if val is empty
        if (this._isEmptyValue(val)) return '-'
        return val
    }

    _handlePrice(val, defaultValue) {
        if (!this.isDidMount) return '-'
        if (this._isEmptyValue(val)) return (defaultValue || '-')
        return (this._formatMoney(val) || defaultValue)
    }

    render() {
        this._init()
        this._handleCalculateMortgage()
        let containerStyle = [
            {
                //backgroundColor: this.style.backgroundColor,
                // paddingHorizontal: this.style.paddingHorizontal,
                paddingLeft: this.style.paddingLeft,
                paddingRight: this.style.paddingRight,
            },
            styles.container
        ]
        let isMortgageDisplay = (this.calculated.monthlyPayment != undefined && this.priceInfo.askingPriceType !== 'View to Offer'
                         && this.priceInfo.listingType.toLowerCase() == "sale")

        var _renderLeftSide = () => {
            var textStyle = {}
            if(isMortgageDisplay){
              textStyle={
                
              }
            }
            return (
                <View style={styles.leftSide}>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems:'flex-start', justifyContent: 'space-between',marginBottom: -6,  paddingTop: 15 }} > 
                      <View style={{ flexShrink: 1, maxWidth: '100%', paddingRight: 23 }}> 
                      <Text allowFontScaling={false} style={{
                        color: '#414141',
                        fontSize: width * 0.038,
                        fontFamily: this.style.boldingFontFamily,
                        marginTop: -6
                    }}>
                        {this.props.title}
                    </Text>
                    </View>
                    </View>
                    <View style={{ width: '100%', paddingTop: 5 }}>
                    <Text allowFontScaling={false} style={[{
                        color: '#488BF8',
                        fontSize: width * 0.045,
                        fontFamily: this.style.boldingFontFamily,
                        fontWeight: 'bold',
                        paddingBottom: 8,
                     },textStyle]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {this._formatMoney(Math.trunc(this.priceInfo.askingPrice))}
                     {/*   {(this.priceInfo.askingPriceType == 'View to Offer')?"View to Offer":this._handlePrice(parseFloat(this.priceInfo.askingPrice), 'View to Offer')} */}
                    </Text>
                    </View>
                    {/* fair value checking */}
                    {
                        ((this.priceInfo.fairValue != undefined || this.priceInfo.fairValue != '')
                            &&
                            (parseFloat(this.priceInfo.fairValue) > parseFloat(this.priceInfo.askingPrice))) ?
                            (
                                <Text allowFontScaling={false} style={{
                                    color: 'rgb(45,45,45)',
                                    fontSize: 15,
                                    fontFamily: this.style.fontFamily,
                                }}>
                                    {'Fair Value ' + this._formatMoney(parseFloat(this.priceInfo.fairValue))}
                                </Text>
                            )
                            :
                            null
                    }
                </View>
            )
        }

        var _renderRightSide = () => {
            return (
                <View style={{
                    display: (isMortgageDisplay ? 'flex' : 'none')
                }}>
                    <View style={styles.rightSide}>
                        <View  style={{flexDirection: 'row'}}>
                            <Text allowFontScaling={false} style={{
                                color: '#414141',
                                fontSize: width * 0.03,
                                fontFamily: this.style.fontFamily,
                                paddingRight: 3,
                                paddingBottom: 1
                            }}>
                                {'Mortgage'} 
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text allowFontScaling={false} style={{
                                    color: '#414141',
                                    fontSize: width * 0.03,
                                    fontFamily: this.style.fontFamily,
                                    paddingRight: 3
                                }}>
                                    {this._formatMoney(this.calculated.monthlyPayment)}
                                </Text>
                                <Text allowFontScaling={false} style={{
                                    color: '#414141',
                                    fontSize: width * 0.03,
                                    fontFamily: this.style.fontFamily,
                                }}>
                                    {'/ mth'}
                                </Text>
                            </View>
                        </View>
                        
                    </View>
                </View>)
        }

        return (
            <View style={containerStyle}>
                {_renderLeftSide()}
                {_renderRightSide()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    rightSide: {
        flexDirection: 'row',
        // flex: 1,
    },
    leftSide: {
         //flex: 1,
         //paddingLeft: 5
         paddingTop: 10
    },
})

export default Listing_PriceInfo
