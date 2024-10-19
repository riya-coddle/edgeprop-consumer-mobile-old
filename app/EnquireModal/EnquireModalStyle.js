import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
     modalContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
      },
     modal:{
        backgroundColor: '#fff',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column'
       },
      modelHeader: {
        backgroundColor:'#488BF8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10
       },
      headerText: {
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Poppins-Medium',
        fontSize: 22
      },
      modelBody: {
        paddingHorizontal: 12,
        paddingTop: 10, 
        marginLeft: 10,
        marginRight: 3
      },
      modelBodyLink: {
        color: '#488BF8',
        fontWeight: '400',
        fontFamily: 'poppins-medium',
        paddingTop: 20,
        fontSize: 17,
         borderBottomWidth: 1,
        paddingBottom:  14,
        borderColor: '#eaeaea'

      },
      textInputCustom: {
        height: 40,
        borderColor: '#E1E1E1', 
        borderRadius: 4, 
        borderTopWidth: 2,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        fontSize: 15,
        paddingLeft: 10
      },
      inputButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 10
      },
      button: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#9EBAE2',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -3
      },
      btnText: {
        fontSize: 12,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#488BF8',
        fontWeight: '500'
      },
      modelBodyText: {
        fontFamily: 'poppins-medium',
        fontSize: 17
      },
      list: {
         borderBottomWidth: 1,
        borderColor: '#E1E1E1',
         borderRadius: 4,
         flexDirection: 'row',
        justifyContent: 'space-between',
         alignItems: 'center',
        width: '100%',
        paddingHorizontal: 22
      },
      listText: {
        color: '#0F0F0F'
      },
      listItems: {
        fontSize: 17,
      },
      input: {
        marginBottom: 11,
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 17,
        height: 44,
        paddingHorizontal: 16
     },
    inputLarge: {
      marginBottom: 11,
      borderColor: '#D3D3D3',
      borderWidth: 1,
      borderRadius: 4,
      paddingTop: 15,
      fontSize: 17,
      textAlign: 'left',
      textAlignVertical: 'top',
      paddingHorizontal: 16,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      height: 100
   },
   checkboxSection: {
      flexDirection: 'row',
      marginBottom: 20
    },
   checkboxText: {
      color: '#A0ACC1',
      fontSize: 15,
      flex: 1,
      flexWrap: 'wrap',
      maxWidth: '90%'
     },
   buttonOne: {
    backgroundColor: '#488BF8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    padding: 10
  },  
   buttonTwo: {
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 57,
    borderRadius: 4,
    borderColor: '#A0ACC1',
    borderWidth: 1
  },  
   buttonText: {
       color: '#fff',
       fontWeight: '500',
       fontSize: 18,
       letterSpacing: 2,
       width: '100%',
       textAlign: 'center'
   },
    buttonTextTwo: {
       color: '#414141',
       fontWeight: '400',
       fontSize: 18,
       letterSpacing: 2,
   },
   belowButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 15
   },
   belowButtonText: {
      color: '#414141',
      fontSize: 18
   },
   buttonThree: {
     backgroundColor: '#F1F1F1',
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     height: 57,
     borderRadius: 4,
     borderColor: '#20B93A',
     borderWidth: 1,
     marginVertical: 14,
     marginBottom: 25 

   },
    buttonTextThree: {
       color: '#20B93A',
       fontWeight: '400',
       fontSize: 18,
     },
   imgStyle: {
    paddingRight: 16,
   },
   imgCustom: {
    width: 34,
    height: 34

   } 


});




 

