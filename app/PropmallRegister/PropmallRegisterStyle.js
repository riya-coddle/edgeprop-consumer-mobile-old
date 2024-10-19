import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  interestSection: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#FA477B',
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden'
  },
  modalContainer: {
    borderRadius: 6,
    overflow: 'hidden'
  },
  closeModalBtn: {
    marginLeft: 'auto',
    padding: 10
  },
  modalHeader: {
    backgroundColor: '#FA477B',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    borderRadius: 6
  },
  interestSectionHeader: {
    padding: 20
  },
  interestTitle: {
    fontSize: 26,
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '500',
    lineHeight: 30,
    paddingHorizontal: 30,
    paddingBottom: 20
  },
  interestBody: {
    paddingVertical: 30
  },
  interestDesc: {
    fontSize: 15,
    lineHeight: 20,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 20
  },
  inputContainer: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  input: {
    padding: 15,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#D4D9E1',
    fontSize: 15
  },
  propcheckText: {
    color: '#fff',
  },
  propcheckLink: {
    color: '#462B5A',
    paddingHorizontal: 5,
  },
  propcheckDesc: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
  checkBoxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  formButtonContainer: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  formButton: {
    minWidth: width * 0.6,
    backgroundColor: '#462B5A',
    padding: 15,
    borderRadius: 4
  },
  formButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17
  }
});
