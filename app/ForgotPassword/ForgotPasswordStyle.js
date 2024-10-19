import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
   ForgotPasswordContainer: {
   	 paddingHorizontal: 40,
   	  flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80
      },
   fpText: {
   	 fontSize: 23,
   	 color: '#565C60',
   	 fontWeight: '600',
     paddingBottom: 6,
     width: '100%',
     textAlign: 'center'
    },
   fpSubText: {
   	 color: '#565C60',
     fontSize: 15,
     paddingBottom: 30,
     textAlign: 'center'
    },
    inputCustom: {
      marginBottom: 11,
      borderColor: '#D3D3D3',
      borderWidth: 1,
      fontSize: 27,
      width: 270,
       fontSize: 15,
      paddingLeft: 15,
      borderRadius: 2,
      height: 50,
      marginBottom: 20
      },
     buttonOne: {
      backgroundColor: '#488BF8',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 2,
      width: 270,
      marginBottom: 15,
   },
   buttonText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 1,
      letterSpacing: 2,
      fontSize: 18,
      width: '100%',
      textAlign: 'center'
   },
   buttonContainer: {
   	paddingBottom: 6,
   	borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1.5,
   },
   logInText: {
   	color: '#488BF8',
   	fontSize: 15,
   	fontWeight: 'bold',
   	paddingVertical: 23

   }
});
