import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    padding: 30,
    margin: 0,
    height: height * 0.96,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  headerText: {
    paddingTop: 40,
    fontFamily: 'Poppins-Medium',
    fontSize: 28,
    color: '#333333',
  },
  subHeading: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    paddingBottom: 50
  },
  infoText: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
    paddingTop: 50,
    color: '#444444',
    textAlign: 'center'
  },
  buttonContain: {
      width: '100%',
      paddingTop: 100,
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
      padding: 10,
      width: '100%',
      textAlign: 'center'
   },
});
