import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
   login: {
      fontSize: 27,
      color: '#333333',
      fontWeight: '500',
      paddingBottom: 13,
      paddingTop: 40,
      fontFamily: 'Poppins-Medium',
    },
    welcomeTest: {
     color: '#444444',
     fontSize: 14,
     marginTop: 15,
     fontFamily: 'Poppins-Medium',
     },
    testContainer: {
      marginLeft: 30,
      marginRight: 30,
      marginBottom: 10
    },
    containerCustom: {
      marginLeft: 30,
      marginRight: 30,
      alignItems: 'center',
    },
    inputCustom: {
      fontSize: 14,
      fontFamily: 'Poppins-Light', 
      marginBottom: 10,
      padding:13, 
      borderColor:'#8E8E93',
      borderRadius: 4, 
      width:'100%',
      borderWidth: 1
    },
    dropdownCustom: {
       height: 55, 
       borderWidth: 1, 
       borderColor: '#8E8E93', 
       marginBottom: 10, 
       borderRadius: 3, 
       paddingRight: 15,
       paddingLeft: 20,
       marginLeft: 30,
       marginRight: 30,
       paddingTop: 15,
     },
     buttonContain: {
      width: '100%',
      marginTop: -10
    },
    fbButtonLast: {
      backgroundColor:'#488BF8',
      borderColor: '#fff',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 4,
     // color: '#ffff',
      marginBottom: 5
    },
    btnText: {
      fontFamily: 'Poppins-Regular',
      color: '#fff',
      letterSpacing: 0.5,
      fontSize: 15,
      padding: 10
   },
});
