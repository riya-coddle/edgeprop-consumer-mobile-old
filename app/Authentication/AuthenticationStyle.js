import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  login: {
      fontSize: 25,
      color: '#333333',
      fontWeight: '500',
      paddingBottom: 13,
      paddingTop: 40,
      fontFamily: 'Poppins-Medium',
    },
    welcomeTest: {
   	 color: '#444444',
     fontSize: 14,
     fontFamily: 'Poppins-Light',
     },
    testContainer: {
      marginLeft: 30,
      marginRight: 30,
      marginBottom: 36
    },
    containerCustom: {
      marginLeft: 30,
      marginRight: 30,
      marginTop: 5,
      alignItems: 'center',
      },
    logoImage: {
      marginBottom: 11
    },
    tagline: {
    //  color: '#FFFFFF',
      fontWeight: '500',
      fontSize: 15
     },
     buttonContain: {
      width: '100%',
      paddingBottom: 5
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
      marginBottom: 3
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
     // color: '#ffff',
      marginBottom: 12
     },
    btnText: {
      fontFamily: 'Poppins-Regular',
      color: '#fff',
      letterSpacing: 0.5,
      fontSize: 15,
      padding: 10
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
      fontSize: 20,
      flex: 1
    },
   signupBtn: {
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 450,
      fontSize: 20,
      flex: 1,
      marginLeft: 16
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
    orSection: {
      marginTop: 13,
      marginBottom: 27,
      marginLeft: 30,
      marginRight: 30,
      height: 10,
      flexDirection: 'row',
      alignItems: 'center'
     },
    orBorder: {
      borderBottomWidth: 1,
      borderColor: '#BDCDD1',
      height: 1,
      width: 30,
      flex: 3,
    //  color: '#BDCDD1',
      backgroundColor: '#BDCDD1'
    },
    orContainer: {
       paddingLeft: 16,
       paddingRight: 16,
       paddingBottom: 3
    },
    orText: {
      fontSize: 12,
    //  color: '#8E8E93'
    },
    inputCustom: {
   // color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Poppins-Light', 
    marginBottom: 10,
    padding:10, 
    borderColor:'#8E8E93',
    borderRadius: 4, 
    width:'100%',
    //borderColor: 'gray',
    borderWidth: 1 
    }
});
