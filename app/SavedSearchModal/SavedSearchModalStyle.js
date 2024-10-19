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
  },
  modelContent: {
    width: '90%',
  },
  modelHeader: {
    backgroundColor:'#488BF8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
     borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    padding: 15
  },
  headerText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18
  },
    headerTextSecond: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 16
  },
  modelBody: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10
  },
   modelBodyLink: {
    color: '#488BF8',
    fontWeight: '500',
    fontFamily: 'poppins-medium',
    paddingTop: 20,
    fontSize: 16,
    borderBottomWidth: 1,
    paddingBottom:  14,
    borderColor: '#eaeaea'
  },
  textInputCustom: {
    height: 40,
    width: '100%', 
    borderColor: '#dcdcdc', 
    borderRadius: 4, 
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    fontSize: 16,
    paddingHorizontal: 15
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
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
    backgroundColor: '#488BF8',
    width: '100%',
    marginTop: 10
  },
  btnText: {
    fontSize: 16,
    paddingRight: 5,
    paddingLeft: 5,
    color: '#fff',
    fontWeight: '400',
    width: '100%',
    textAlign: 'center'
  },
  modelBodyText: {
    fontFamily: 'poppins-medium',
    fontSize: 14,
    color: '#777a7f'
  },
  list: {
    borderBottomWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingRight: 10
   },
  listText: {
    fontSize: 15,
    color: '#0F0F0F'
  },
  listItems: {
    fontSize: 17,
  }
});
