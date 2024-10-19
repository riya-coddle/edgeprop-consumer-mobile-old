import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    height: 'auto'
  },
  propImgSliderWrapper: {
    paddingVertical: 25
  },
  propContentSliderWrapper: {
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#FFCD00',
    height: '100%'
  },
  propSliderContent: {
    paddingVertical: 20,
    paddingHorizontal: 30
  },
  propSliderTitle: {
    color: '#462B5A',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 7
  },
  propSliderSubTitle: {
    fontSize: 15,
    color: '#462B5A',
    marginBottom: 10
  },
  propTwoWay: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  propListIcon: {
    width: 35,
    marginVertical: 7
  },
  propProviderContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingLeft: 15,
    marginVertical: 7
  },
  propTwoWayList: {
    fontSize: 13,
    color: '#462B5A',
    lineHeight: 17,
  },
  interestButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  interestButton: {
    paddingHorizontal: 60,
    paddingVertical: 12,
    backgroundColor: '#FA477B',
    borderRadius: 4
  },
  interestButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center'
  },
  sliderDot: {
    width: 45,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#462B5A',
    margin: 2.5,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 60
  },
  sliderActiveDot: {
    width: 45,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA477B',
    margin: 2.5,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 60
  },
  sliderDotText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  sectionHeader: {
    display: 'flex',
    paddingHorizontal: 30,
    marginTop: 30
  },
  propSectionTitle: {
    color: '#462B5A',
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'left'
  },
});