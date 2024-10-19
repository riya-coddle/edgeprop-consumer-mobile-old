/*import { BarChart, LineChart, YAxis, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Circle, G, Line, Rect, Svg, Path, Polyline} from 'react-native-svg'*/
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
//import RotatableText from '../../components/Chart_RotatableText/Chart_RotatableText.js'
//import XAxis from '../../components/Chart_CustomisedXAxis/Chart_CustomisedXAxis.js'

/*export default class MultipleLineChart extends Component<{}>{
  xData
  maxXDataLength = 9
  //x axis
  xAxisOffset = 30
  //y left axis
  yLeftAxisOffset = 30
  leftChartTitleOffset = 30
  //
  contentInsetVertical = 10
  contentInsetHorizontal = 25
  //
  verticalTickNumber = 5
  constructor(props){
    super(props)
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
    this.labelStyle = {
      fontFamily: "Poppins-Medium",
      color: '#4a4a4a',
      fontSize: 10
    }
    this.labelContainerStyle = {
      width: 375,
      height: 40,
      marginTop: 40,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginLeft: 30
    }
    this.labelLineContainerStyle = {
      flex:1,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start"
    }
    this.labelItemContainerStyle = {
      width: 82,
      height: 16,
      alignItems: "center",
      flexDirection: "row",
      marginRight: 10
    }
  }
  _calculateGridMax(){
    var yData = [];
    var yLineChartData = []
    var yAxisData = []
    for(var i=0; i<this.verticalTickNumber; i++){
      yAxisData.push(i);
    }
    Object.keys(this.data).map((index)=>{
      if(this.data[index] != undefined
        && this.data[index].prices != undefined
        && Array.isArray(this.data[index].prices)){
        yData = [...yData,...this.data[index].prices]
      }
    })
    var divider = 2//this.verticalTickNumber-1
    var actualMax = Math.round(Math.max(...yData))
    var noToExt = 1
    if(parseInt(actualMax.toString().substring(0,1))<3){
      noToExt = 2
    }
    var gridMax = Math.ceil(actualMax/(divider*(Math.pow(10,(actualMax.toString().length-noToExt)))))*(divider*(Math.pow(10,(actualMax.toString().length-noToExt))))
    return {gridMax, yAxisData}
  }
  _init(){
    if(this.props.chartWidth!= undefined && this.props.chartWidth != this.chartWidth){
        this.chartWidth = this.props.chartWidth
    }
    if(this.props.chartHeight!= undefined && this.props.chartHeight != this.chartHeight){
        this.chartHeight = this.props.chartHeight
    }
    if(this.props.data!= undefined && this.props.data != this.data){
        this.data = this.props.data
    }
    if(this.props.xData!= undefined && this.props.xData != this.xData){
        this.xData = this.props.xData
    }
    if(this.props.lineChartTitle!= undefined && this.props.lineChartTitle != this.lineChartTitle){
        this.lineChartTitle = this.props.lineChartTitle
    }
  }
  render(){
    // console.log("render multiline chart");
    this._init();
    var actualChartWidth = this.chartWidth-this.contentInsetHorizontal*2
    var {gridMax, yAxisData} = this._calculateGridMax()
    var contentInsetY = {
      top: this.contentInsetVertical,
      bottom: this.contentInsetVertical
    }
    var contentInsetX = {
      left:this.contentInsetHorizontal,
      right:this.contentInsetHorizontal
    }
    var _renderMultipleLineCharts = () => {
      return Object.keys(this.data).map((key)=>{
        var color = this.props.displayData[key].color
        var valueData = this.data[key].prices
        var indexData = this.data[key].months
        var lineData = []
        for(var i=0; i<this.xData.length; i++){
          var lastLine = lineData[lineData.length-1]
          var index = indexData.indexOf(this.xData[i])
          if(index>-1){
            if(lastLine != undefined && lastLine.isLine){
              lastLine.length++;
              lastLine.data.push(valueData[index])
            }
            else{
              var newLine = {
                isLine: true,
                length: 1,
                data: [valueData[index]],
                startIndex: i
              }
              lineData.push(newLine)
            }
          }
          else{
            if(lastLine != undefined && !lastLine.isLine){
              lastLine.length++;
            }
            else{
              var newLine = {
                isLine: false,
                length: 1,
                startIndex: i
              }
              lineData.push(newLine)
            }
          }
        }
        var _renderDecorator = ({ x, y, index, value }) => {
          return (
              <Circle
                  key={index}
                  cx={x(index)}
                  cy={y(value)}
                  r={2}
                  stroke={color}
                  strokeWidth={3}
                  fill={'white'}
              />
          )
        }
        return Object.keys(lineData).map((index)=>{
          if(lineData[index].isLine){
            return(
              <LineChart
                  key={index}
                  style={{
                    position: "absolute",
                    height:this.chartHeight,
                    left: this.xData.length>1?(lineData[index].startIndex*actualChartWidth/(this.xData.length-1)):actualChartWidth/2,
                    width: this.xData.length>1?(actualChartWidth/(this.xData.length-1)*(lineData[index].length-1)+this.contentInsetHorizontal*2):actualChartWidth+this.contentInsetHorizontal*2
                  }}
                  dataPoints={lineData[index].data}
                  svg={{
                      stroke:color,
                      strokeWidth:3
                  }}
                  contentInset={{...contentInsetX,...contentInsetY}}
                  renderDecorator={_renderDecorator}
                  gridMin={0}
                  gridMax={gridMax}
                  showGrid={false}
                  numberOfTicks={this.verticalTickNumber}
              />
            )
          }
        })
      })
    }
    var _renderGridAndLines = () => {
      const CustomGrid = ({ x, y, dataPoints, ticks }) => {
        ticks=yAxisData;
        var t = this.verticalTickNumber-1
        var r = this.contentInsetVertical
        var h = this.chartHeight
          return(
            <G>
              {// Horizontal grid
                ticks.map((tick,index) => {
                  return(
                    <Line
                        key={ tick }
                        x={this.contentInsetHorizontal}
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
                          y={-this.contentInsetVertical}
                          key={ index }
                          y1={ '0%' }
                          y2={ '100%' }
                          x1={ x(index) }
                          x2={ x(index) }
                          stroke={index==0? 'rgba(0,0,0,0.2)': 'grey'}
                          strokeDasharray={index==0? [0,0]: [4, 8]}
                          strokeWidth={index==0? 2: 0.2}
                      />
                    )
                  }
                })
              }
            </G>
          )
      }
      return(
        <LineChart
            style={StyleSheet.absoluteFill}
            dataPoints={this.xData.map((item,index)=>0)}
            contentInset={contentInsetX}
            gridMin={0}
            gridMax={gridMax}
            renderGrid={ CustomGrid }
            numberOfTicks={this.verticalTickNumber}
        />
      )
    }
    var _renderXAxis = () => {
      var xData = this.xData
      var offset = 0
      var remainder = 0
      if(this.xData.length>this.maxXDataLength){
        var divider = Math.ceil(this.xData.length/this.maxXDataLength)
        offset = Math.floor((this.xData.length%divider)/2)
        xData = this.xData.filter((item, index)=>((index-offset+1)%divider==0))
      }
      return(
        <XAxis
            style={{
              position: 'absolute',
              left: this.xData.length>1?(offset/this.xData.length*this.chartWidth):actualChartWidth/2,
              right: offset/this.xData.length*this.chartWidth,
              bottom: -this.xAxisOffset,
            }}
            values={xData}
            contentInset={contentInsetX}
            formatLabel={(value, index) => value}
            chartType={XAxis.Type.LINE}
            labelStyle={[this.horizontalLabelStyle,
                {
                    height: 32,
                }
            ]}
        />
      )
    }
    var _renderLineChartYAxis = () => {
      var axisStyle = {
        position: 'absolute',
        // left: -this.yLeftAxisOffset,
        left: -this.yLeftAxisOffset+this.contentInsetHorizontal-5,
        width: this.yLeftAxisOffset,
        top: 0,
        bottom: 0,
        // paddingRight: 2
      }
      return(
        <YAxis
            style={axisStyle}
            dataPoints={yAxisData}
            formatLabel={value => gridMax/(this.verticalTickNumber-1)*(value) }
            numberOfTicks={this.verticalTickNumber}
            contentInset={contentInsetY}
            gridMax = {gridMax}
            gridMin = {0}
            showGrid = {false}
            labelStyle={[this.verticalLabelStyle,{textAlign: "right"}]}
        />
      )
    }
    var _renderLineChartLeftTitle = () => {
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
    var _renderLabels = () => {
      var validLines = []
      Object.keys(this.data).map(index=>{
        if(this.data[index].prices.length>0){
          validLines.push(index)
        }
      })
      return(
        <View style={[this.labelContainerStyle, this.props.labelContainerStyle]}>
          {[...Array(Math.ceil(validLines.length/3))].map((x, i)=>{
            return(
              <View key={i} style={this.labelLineContainerStyle}>
                {[...Array(3)].map((y, j)=>{
                  if(this.props.displayData[validLines[i*3+j]]!=undefined){
                    return(
                      <View key={i*3+j} style={this.labelItemContainerStyle}>
                        <View style={{width:14, height: 14, marginRight: 4}}>
                          <Svg
                              width={14}
                              height={14}>
                                  <Path
                                      d={"M 0 7 H 14 7"}
                                      fill={"none"}
                                      stroke={this.props.displayData[validLines[i*3+j]].color}
                                      strokeWidth={2}
                                  />
                                  <Circle
                                      cx={7}
                                      cy={7}
                                      r={2.5}
                                      stroke={this.props.displayData[validLines[i*3+j]].color}
                                      strokeWidth={2}
                                      fill={'white'}
                                  />
                          </Svg>
                        </View>
                        <Text allowFontScaling={false} style={this.labelStyle}>
                          {this.props.displayData[validLines[i*3+j]].title}
                        </Text>
                      </View>
                    )
                  }
                })}
              </View>)
          })}
        </View>
      )
    }
    if(Object.keys(this.data).length > 1){
      return(
        <View>
          <View
            style={[{
              height: this.chartHeight,
              width: this.chartWidth,
            }, this.props.containerStyle]}>
              {_renderGridAndLines()}
              {_renderMultipleLineCharts()}
              {_renderXAxis()}
              {_renderLineChartYAxis()}
              {_renderLineChartLeftTitle()}
          </View>
          {_renderLabels()}
        </View>
      )
    }
    return <View/>
  }
}*/

export default class MultipleLineChart extends Component<{}>{ 
  render() {
    return (
      <View />
    )
  }
}