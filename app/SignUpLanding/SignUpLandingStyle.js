import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  	containerCustom: {
      marginLeft: 30,
      marginRight: 30,
      alignItems: 'center',
      paddingTop: 110
    },
    logoTextContain: {
     paddingBottom: 110,
     alignItems: 'center'
    },
    logoImage: {
      marginBottom: 11,
      width: 30,
      height: 30,
    },
    tagline: {
      color: '#FFFFFF',
      fontWeight: '500',
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
     },
     buttonContain: {
      width: '100%',
    },
    fbButton: {
      backgroundColor:'#3D589E',
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
    secondButton: {
      backgroundColor:'#2FC600',
      borderColor: '#fff',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 4,
    //  color: '#ffff',
      marginBottom: 12
     },
    btnText: {
      fontFamily: 'Poppins-Regular',
      color: '#fff',
      letterSpacing: 0.5,
      fontSize: width * 0.032
   },
   twoButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
   },
   loginBtn: {
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
     // fontSize: 20,
      flex: 1
      
    },
   signupBtn: {
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
     // fontSize: 20,
      flex: 1,
      marginLeft: 16
     }
});
