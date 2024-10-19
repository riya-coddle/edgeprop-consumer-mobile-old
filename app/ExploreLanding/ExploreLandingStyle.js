import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  headerText:{
     flexDirection: 'row',
     paddingBottom:16,
     paddingLeft: 2,
     paddingTop: 3
  },
  headerTextChildActive:{
    color:'#488BF8',
    fontSize: 16,
    paddingRight: 24,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: '#488BF8'
  },
  headerTextChild:{
    color:'#414141',
    paddingRight: 24,
    fontSize: 16
  },
  sortSection: {
  	flexDirection: 'row',
    marginBottom: 18,
    width:'100%'
  },
  sortText: {
  	fontSize: width * 0.04,
    color:'#414141'
  },
  sortDate: {
   fontSize: 14,
   color:'#488BF8',
   paddingLeft: 16,
  },
  screen: {
    flex: 1,  
  },
  lisitngContainer: {
    flex: 1, 
    paddingLeft: width * 0.055, 
    paddingRight: width * 0.055
  },

});
