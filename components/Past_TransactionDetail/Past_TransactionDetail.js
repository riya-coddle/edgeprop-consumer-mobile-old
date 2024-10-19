import React, { Component } from 'react'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import IconMenu from '../Common_IconMenu/Common_IconMenu'
import moment from 'moment'; 
var ArrowIcon = require('../../assets/icons/Right-arrow.png')

const {width, height} = Dimensions.get('window');
export default class Past_TransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taggedTableHead: ['Date', 'Unit', 'Area', 'Price(PSF)'],
      unTaggedTableHead: ['Project/Township', 'Median Price Psf (RM)', 'Median Price (RM)', 'Filed Transactions'],
      widthArr: [100, 110, 80, 110]
    }

    this._formatDate = this._formatDate.bind(this);
  }


  _init() {}

  _onBack() {
    if (this.props.onBack) {
      this.props.onBack()
    }
  }

  formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  }

  formatMoney(value){
    if ((typeof value !== 'undefined') && (value))
     return this.formatNumber(value);
  }
  
  _formatDate(transactionDate) {
      /*let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let str = transactionDate;
      let res = str.split(" ",3);
      let date = new Date(res[0]);
      let _date = date.getDate();
      let year = date.getFullYear();
      const monthName = monthNames[date.getMonth()];
      let returnDate = _date + " " + monthName + " " + year;*/
      let returnDate = moment.unix(transactionDate).format("DD-MM-YYYY");
      return returnDate;
  }
  
  render() {
    const state = this.state;
    const tableData = [];
     if (this.props.transactionDetail !== undefined) {
      if (this.props.transactionDetail.property !== undefined && this.props.transactionDetail.property[0]) {
        let rowCount = this.props.transactionDetail?(this.props.transactionDetail.property?this.props.transactionDetail.property.length:0):0;
        let transaction = this.props.transactionDetail?(this.props.transactionDetail.property?this.props.transactionDetail.property:''):'';
        if (transaction != '' && rowCount > 0 ) {
          for (let i = 0; i < rowCount; i += 1) {
            const rowData = [];
            //for (let j = 0; j < 2; j += 1) {
              if(this.props.tagged == true) {
                let getDate = this._formatDate(transaction[i].date);
                rowData.push(getDate);
                rowData.push('XXX, '+transaction[i].street_name);
                rowData.push(transaction[i].area_sqft+ ' sqft');
                rowData.push(this.formatMoney('RM '+transaction[i].transacted_price + '\n' + '(RM '+ transaction[i].unit_price_psf)  + ' psf)' );
              }else {
                rowData.push(transaction[i].project_name);
                rowData.push(transaction[i].psf);
                rowData.push(transaction[i].price);
                rowData.push(transaction[i].fieldtransactions);
              }
              
              //rowData.push(transaction[i].property_type);
              //rowData.push(transaction[i].unit_price_psf);
              
            //}
            tableData.push(rowData);
          }
        }
      }
    }

    let totalProjects = 0;
    let totalTransaction = 0;

    if (this.props.transactionDetail !== undefined) {
      if (this.props.transactionDetail.property !== undefined) {
        //totalProjects = this.props.transactionDetail.property.total;
        //totalTransaction = this.props.transactionDetail.property.total;
      }
    }

    let proName = '';
    let planning_region = '';
    let headerText = 'Past Transactions in '
     if (this.props.transactionDetail !== undefined) {
      if (this.props.transactionDetail.property !== undefined && this.props.transactionDetail.property !== undefined && this.props.transactionDetail.property[0]) {
        if(this.props.tagged == true) {
          headerText += this.props.transactionDetail.property[0].project_name + ', '+this.props.transactionDetail.property[0].planning_region;
        }else {
          headerText +=this.props.transactionDetail.property[0].area;
        }
        
      }
    }
    
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View>
          <Text allowFontScaling={false} style={{ color: '#414141',fontSize: width * 0.038, fontFamily: 'Poppins-SemiBold'  }}>{headerText}</Text>
          {/*<Text allowFontScaling={false} style={{ fontSize: width * 0.03 }}>{totalProjects} Projects/Townships ({totalTransaction} Transactions) </Text>*/}
        </View>
        <ScrollView horizontal={true}>
          <View style={styles.tableContainer}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={(this.props.tagged) ? state.taggedTableHead : state.unTaggedTableHead} style={styles.head}  widthArr={state.widthArr} textStyle={styles.headtext} />
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  
                      allowFontScaling={false} 
                      key={cellIndex} 
                      data={cellData}
                      style={[ (cellIndex == 0 )? styles.widerCell : ((cellIndex == 1 )? styles.widerCell2 : ((cellIndex == 2 )? styles.widerCell3 : styles.widthrow)), index%2 && {backgroundColor: '#F2F4F8', borderColor: 'transparent'}]}
                      textStyle={styles.text}/>
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>
      </View>
        </ScrollView>
      </View>

    )
  }
} 

 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 15, paddingBottom: 0, backgroundColor: '#fff' },
  tableContainer: { },
  head: { fontSize: width * 0.038 },
  headtext: { marginVertical: 10,marginHorizontal: 6, color: '#A0ACC1', fontSize: width * 0.035 },
  text: { margin: 6, fontSize: width * 0.03 },
  row: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: '#D3D3D3' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  widthrow: { width: 110, height: 70 },
  widerCell: { width: 100, height: 70 },
  widerCell2: { width: 110, height: 70 },
  widerCell3: { width: 80, height: 70 }
});