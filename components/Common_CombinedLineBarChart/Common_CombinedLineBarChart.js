/*import { BarChart, LineChart, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Circle, G, Line, Rect } from 'react-native-svg' */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
//import RotatableText from '../../components/Chart_RotatableText/Chart_RotatableText.js'
//import XAxis from '../../components/Chart_CustomisedXAxis/Chart_CustomisedXAxis.js'

/* export default class CombinedChart extends Component<{}>{
  //bar
  color = "#1a418c"
  barChartTitle = ""
  //line
  tintColor = "#d637d4"
  lineWidth = 5
  lineChartTitle = ""
  //x axis
  xAxisOffset = 25
  //y left axis
  yLeftAxisOffset = 30
  //y right axis
  yRightAxisOffset = 30
  //title right
  rightChartTitleOffset = 25
  //title left
  leftChartTitleOffset = 40
  //common offset top and bottom
  contentInsetValue = 10
  //
  // horizontalTickNumber = 3
  verticalTickNumber = 5
  chartWidth
  chartHeight
  constructor(props){
    super(props)
    this.screenWidth = props.screenWidth
    this.screenHeight = props.screenHeight
    this.horizontalLabelStyle = {
      fontSize: 10,
      fontFamily: "Poppins-SemiBold",
      color: '#4a4a4a',
      lineHeight: 16,
    }
    this.verticalLabelStyle = {
      fontSize: 9,
      fontFamily: "Poppins-SemiBold",
      color: '#4a4a4a',
      lineHeight: 15,
    }
  }
  shouldComponentUpdate(nextProps, nextState){
      if(JSON.stringify(nextProps.barChartData)!=JSON.stringify(this.props.barChartData)){
          return true
      }
      if(JSON.stringify(nextProps.lineChartData)!=JSON.stringify(this.props.lineChartData)){
          return true
      }
      if(JSON.stringify(nextProps.xData)!=JSON.stringify(this.props.xData)){
          return true
      }
      return false
  }
  _init(){
    if(this.props.barChartTitle!= undefined && this.props.barChartTitle != this.barChartTitle){
        this.barChartTitle = this.props.barChartTitle
    }
    if(this.props.lineChartTitle!= undefined && this.props.lineChartTitle != this.lineChartTitle){
        this.lineChartTitle = this.props.lineChartTitle
    }
    if(this.props.chartWidth!= undefined && this.props.chartWidth != this.chartWidth){
        this.chartWidth = this.props.chartWidth
    }
    if(this.props.chartHeight!= undefined && this.props.chartHeight != this.chartHeight){
        this.chartHeight = this.props.chartHeight
    }
  }

  _calculateGridMax(yData){
    var divider = 2//this.verticalTickNumber-1
    var actualMax = Math.round(Math.max(...yData))
    var noToExt = 1
    if(parseInt(actualMax.toString().substring(0,1))<3){
      noToExt = 2
    }
    var gridMax = Math.ceil(actualMax/(divider*(Math.pow(10,(actualMax.toString().length-noToExt)))))*(divider*(Math.pow(10,(actualMax.toString().length-noToExt))))
    return gridMax
  }

  render(){
    this._init();
    const barChartData = this.props.barChartData || []
    const lineChartData = this.props.lineChartData || []
    var xData = this.props.xData || []
    var lineChartGridMax = this._calculateGridMax(lineChartData)
    var barChartGridMax = Math.ceil(Math.max(...barChartData)/(this.verticalTickNumber-1))*(this.verticalTickNumber-1)
    var yLineChartData = []
    var yBarChartData = []
    var yAxisData = []
    for(var i=0; i<this.verticalTickNumber; i++){
      yAxisData.push(i);
      yLineChartData.push(lineChartGridMax/(this.verticalTickNumber-1)*(i));
      yBarChartData.push(barChartGridMax/(this.verticalTickNumber-1)*(i))
    }

    var contentInset = {
      top: this.contentInsetValue,
      bottom: this.contentInsetValue
    }
    var paddingHorizontal = this.chartWidth/lineChartData.length/2
    const CustomGrid = ({ x, y, dataPoints, ticks }) => {
        ticks=yAxisData;
        var t = this.verticalTickNumber-1
        var r = this.contentInsetValue
        var h = this.chartHeight
        return(
          <G>
            {// Horizontal grid
              ticks.map((tick,index) => {
                return(
                  <Line
                      key={ tick }
                      x1={ '0%' }
                      x2={ '100%' }
                      y1={(h-2*r)*index/t+r}//{ y(tick) } //calculate offset value for grid
                      y2={(h-2*r)*index/t+r}//{ y(tick) }
                      stroke={index==this.verticalTickNumber-1? 'rgba(0,0,0,0.2)': 'grey'}
                      strokeDasharray={index==this.verticalTickNumber-1? [0,0]: [4, 8]}
                      strokeWidth={index==this.verticalTickNumber-1? 2: 0.2}
                  />
                )
              })
            }
            {// Vertical grid
              dataPoints.map((_, index) => {
                if(index==0){
                  return(
                    <Line
                        x={-paddingHorizontal}
                        y={-this.contentInsetValue}
                        key={ index }
                        y1={ '0%' }
                        y2={ '100%' }
                        x1={ x(index) }
                        x2={ x(index) }
                        stroke={index==0? 'rgba(0,0,0,0.2)': 'grey'}
                        strokeDasharray={index==0? [0,0]: [4, 8]}
                        strokeWidth={index==0? 4: 0.2}
                    />
                  )
                }
              })
            }
          </G>
        )
    }
    const LeftYAxisLine = (({ x }) => (
        <Line
            key={ 'left-y-axis' }
            y={-this.contentInsetValue}
            y1={ '0%' }
            y2={ '100%' }
            x1={ '0%' }
            x2={ '0%' }
            stroke={ 'grey' }
            strokeWidth={ 2 }
        />
    ))
    const RightYAxisLine = (({ x }) => (
        <Line
            x={this.chartWidth}
            key={ 'right-y-axis' }
            y={-this.contentInsetValue}
            y1={ '0%' }
            y2={ '100%' }
            x1={ '0%' }
            x2={ '0%' }
            stroke={ 'rgba(0,0,0,0.2)' }
            strokeWidth={ 3 }
        />
    ))
    const XAxisLine = (({ y }) => (
        <Line
            contentInset = {{bottom: this.contentInsetValue}}
            key={ 'x-axis' }
            y={-this.contentInsetValue}
            x1={ '0%' }
            x2={ '100%' }
            y1={ '100%' }
            y2={ '100%' }
            stroke={ 'grey' }
            strokeWidth={ 2 }
        />
    ))
    var renderLineChart = () => {
      var _renderDecorator = ({ x, y, index, value }) => {
        return (
            <Circle
                key={index}
                cx={x(index)}
                cy={y(value)}
                r={3}
                stroke={this.tintColor}
                strokeWidth={4}
                fill={'white'}
            />
        )
      }
      return(
        <LineChart
            style={StyleSheet.absoluteFill}
            dataPoints={ lineChartData }
            svg={{
                stroke: this.tintColor,
                strokeWidth: this.lineWidth,
            }}
            renderDecorator={lineChartData.length==1?_renderDecorator:()=>(null)}
            renderGrid={CustomGrid}
            contentInset={{...contentInset,...{
              left: paddingHorizontal,
              right: paddingHorizontal
            }}}
            numberOfTicks={this.verticalTickNumber}
            gridMax = {lineChartGridMax}
            curve={shape.curveLinear}
            extras={[RightYAxisLine]}
            // extras={[LeftYAxisLine,RightYAxisLine,XAxisLine]}
            renderExtra={ ({ item, ...args }) => item(args) }
        />
      )
    }
    var renderBarChart = () => {
      var barData = [{
          values: barChartData,
          positive: {
              fill: this.color,
              fillOpacity: 1
          },
      }]
      var barChartStyle = {...{
        position: 'absolute',
        left: 0,
        right: 0,
      },...contentInset}
      return (
        <BarChart
            // contentInset = {contentInset}
            style={barChartStyle}
            data={barData}
            spacing={0.1}
            showGrid = {false}
            gridMax = {barChartGridMax}
        />
      )
    }
    var renderLineChartYAxis = () => {
      var axisStyle = {
        position: 'absolute',
        left: -this.yLeftAxisOffset,
        width: this.yLeftAxisOffset,
        top: 0,
        bottom: 0,
        paddingRight: 2
      }
      return(
        <YAxis
            style={axisStyle}
            dataPoints={yAxisData}
            formatLabel={ value => yLineChartData[value] }
            contentInset = {contentInset}
            numberOfTicks={this.verticalTickNumber}
            gridMax = {lineChartGridMax}
            showGrid = {true}
            labelStyle={[this.verticalLabelStyle,{textAlign: "right"}]}
        />
      )
    }
    var renderBarChartYAxis = () => {
      var axisStyle = {
        position: 'absolute',
        right: -this.yRightAxisOffset,
        width: this.yRightAxisOffset,
        top: 0,
        bottom: 0,
        paddingLeft: 2
      }
      return (
        <YAxis
            style={axisStyle}
            dataPoints={yAxisData}
            contentInset = {contentInset}
            formatLabel={ value => yBarChartData[value]}
            numberOfTicks={this.verticalTickNumber}
            labelStyle={[this.verticalLabelStyle,{textAlign: "left"}]}
        />
      )
    }
    var renderXAxis = () => {
      if(lineChartData.length>10){
        var divider = Math.ceil(lineChartData.length/10)
        var offsetNo = Math.floor(divider/2)
        xData = xData.filter((index,item)=>((item-offsetNo)%divider==0))
      }
      return(
        <XAxis
            style={{
              position: 'absolute',
              left: 0,
              bottom: -this.xAxisOffset,
              width: this.chartWidth
            }}
            values={xData}
            formatLabel={(value, index) => value}
            chartType={XAxis.Type.BAR}
            labelStyle={[this.horizontalLabelStyle,
                {
                    height: 32,
                }
            ]}
        />
      )
    }
    var renderLineChartLeftTitle = () => {
      var containerStyle = {
        position: 'absolute',
        left: -this.leftChartTitleOffset,
        bottom: this.chartHeight/2,
      }
      return(
        <View style={containerStyle}>
          <RotatableText
            style={this.horizontalLabelStyle}
            rotate={'270deg'}
            title = {this.lineChartTitle}
          />
        </View>
      )
    }
    var renderLineChartRightTitle = () => {
      var containerStyle = {
        position: 'absolute',
        right: -this.rightChartTitleOffset,
        bottom: this.chartHeight/2,
      }
      return(
        <View style={containerStyle}>
          <RotatableText
            style={this.horizontalLabelStyle}
            rotate={'90deg'}
            title={this.barChartTitle}
          />
        </View>
      )
    }
    if(barChartData.length>0&&lineChartData.length>0&&xData.length>0){
        return(
          <View style={[this.props.containerStyle,{width: this.chartWidth, height: this.chartHeight}]}>
            {renderLineChartYAxis()}
            {renderBarChartYAxis()}
            {renderXAxis()}
            {renderLineChartLeftTitle()}
            {renderLineChartRightTitle()}
            {renderBarChart()}
            {renderLineChart()}
          </View>
        )
    }
    else{
        return <View/>
    }
  }
}*/
export default class CombinedChart extends Component<{}>{
  render() {
    return (
      <View />
    )
  }
}