import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
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
      backgroundColor:'#EA4335',
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
      fontSize: 16
   },
   
});

