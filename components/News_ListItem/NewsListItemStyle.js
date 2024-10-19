import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  containerStyle :{
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 23,
    paddingRight: 23,
    width: '100%',
    justifyContent: 'space-between'
  },
  attachedImgStyle : {
    marginTop: 8,
    height: 80,
    width: width * 0.23,
  },
  listItemDetailStyle : {    
    flex: 1,
    marginRight: 10
  },
  imageContainer: {
    padding: 10,
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  labelStyle : {
    color: '#909090',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 23,
    width: '100%'
  },
  dateStyle: {
    color: '#909090',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 23,
  },
  iconStyles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 23,
    width: width * 0.29,
    marginTop: 10
  },
  labelDateStyle:{
    flexShrink: 0
  }
});
