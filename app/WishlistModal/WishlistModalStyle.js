import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
     modalContainer: {
        width: '100%',
        height: height * 0.7,
        flexDirection: 'row',
        justifyContent: 'center'
      },
     modal:{
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 4,
       },
      modelHeader: {
        backgroundColor:'#488BF8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        paddingLeft: 20,
        paddingRight: 20
       },
      headerText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 20,
        flex: 1
      },
      modelBody: {
        paddingHorizontal: 20,
        paddingTop: 10
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
        flex: 1,
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
        marginBottom: 10,
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
        marginLeft: -3,
        flexShrink:0,
        minWidth: 100,
      },
      btnText: {
        fontSize: 12,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#488BF8',
        fontWeight: '500',
        width: '100%',
        textAlign: 'center'
      },
      modelBodyText: {
        fontFamily: 'poppins-medium',
        fontSize: 16,
        fontWeight: '400'
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
        modalNew: {
          width: width * 0.75,
          paddingVertical: 20, 
          borderBottomWidth: 1,
           borderColor: '#eaeaea',  
           display: 'flex', flexDirection:'row', 
           justifyContent: 'space-between',
           alignItems: 'center'
        }
});

