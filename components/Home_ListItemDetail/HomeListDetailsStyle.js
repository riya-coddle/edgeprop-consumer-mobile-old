import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
	container: {
        paddingTop: 2,
        paddingRight: 6,
        paddingBottom: 2,
        paddingLeft: 6,
    },
    header: {
      	marginTop: 2,
      	fontFamily: 'Poppins-SemiBold',
      	lineHeight: 24,
      	fontSize: 16,
      	color: "#275075",
    },
    subject:{
      	fontFamily: 'Poppins-Medium',
      	lineHeight: 20,
      	marginBottom: 5,
      	fontSize: 15,
      	color: "#275075",
    },
    priceLabelStyle : {
	  	fontSize: width * 0.040,
	  	color: "#488BF8",
	  	fontWeight: 'bold',
	  	fontFamily:'Poppins',
	  	marginTop: 5
    },
    itemsList: {
    	display: 'flex',
    	flexDirection: 'row',
    	marginTop: 3,
    },
    sqftList: {
    	display: 'flex',
    	flexDirection: 'row',
    	marginTop: 3,
    },
    titleLabelStyle: {
      fontSize: width * 0.038,
      flexWrap: 'wrap',
      flexShrink: 0,
      color: "#414141",
      fontWeight: 'bold',
      fontFamily:'Poppins-Medium',
      marginTop: 5,
    }
});
