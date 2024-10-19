import { StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  propHeroSection: {
    position: 'relative',
    overflow: 'visible',
  },
  propHeroMain:  {
    width: width,
    paddingHorizontal: 25,
    paddingVertical: 40,
    minHeight: height * 0.10
  },
  propHeroTitle: {
    fontSize: width * 0.055,
    lineHeight: 30,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 20
  },
  propHeroDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#fff',
    textAlign: 'left',
    maxWidth: width * 0.5,
    fontWeight: '300'
  },
  propHeroTag: {
    width: 140,
    height: 140,
    position: 'absolute',
    right: 25,
    bottom: -50,
    zIndex: 99,
    backgroundColor: '#462B5A',
    borderRadius: 140,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#462B5A",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  tagTextYellow: {
    fontSize: 10,
    color: '#FFCD00'
  },
  tagTextMain: {
    fontSize: 32,
    color: '#FFF',
    lineHeight: 40,
    fontWeight: '400',
    letterSpacing: -1.5,
    width: '100%',
    textAlign: 'center'
  },
  tagTextLinkWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tagTextLink: {
    fontSize: 12,
    color: '#FFF',
    marginRight: 5,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 25,
    flex: 1,
    width: '100%'
  },
  sectionDiscover: {
    paddingVertical: 50
  },
  propSectionTitle: {
    color: '#462B5A',
    fontSize: width * 0.052,
    fontWeight: '500',
    flex: 1,
    width: '100%'
  },
  commonLink: {
    color: '#FA477B',
    fontSize: 14,
    paddingLeft: 10,
    paddingVertical: 10
  },
  horizontalTrack: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 25
  },
  discoverItem: {
    marginRight: 20,
    marginVertical: 10
  },
  discoverImage: {
    width: width * 0.325,
    height: width * 0.325,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  discoverTitle: {
    fontSize: width * 0.037,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
    width: '100%'
  },
  propItem: {
    marginRight: 25
  },
  propItemImage: {
    width: width * 0.88,
    height: width * 1.1,
    position: 'relative',
    overflow: 'hidden',
  },
  propOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 1
  },
  propOverlayTitle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  propOverlayMoney : {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 20,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 25,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1
  },
  sectionFeaturedProp: {
    position: 'relative',
    marginBottom: 50,
    marginTop: 30
  },
  blobBgYellow: {
    width: width,
    height: '100%',
    position: 'absolute',
    top: -30,
    left: width * 0.2,
    backgroundColor: '#FFCD00',
    zIndex: -1,
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width * 0.3,
    borderTopLeftRadius:  width * 0.8,
    borderTopRightRadius:  width * 0.5,
    overflow: 'hidden'
  },
  propertyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  propertyItem: {
    paddingLeft: 25,
    paddingRight: 8,
    paddingBottom: 16,
    width: width * 0.5
  },
  propertyItemImage: {
    width: '100%',
    height: width * 0.55,
    position: 'relative',
    overflow: 'hidden',
  },
  sectionProperties: {
    marginBottom: 40,
    marginTop: -20
  },
  propFilter: {
    paddingHorizontal: 25,
    marginTop: -5,
    marginBottom: -20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  propFilterItem: {
    width: width * 0.43,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dropdownText: {
    fontSize: 11,
    color: '#462B5A',
    paddingRight: 5
  },
  dropdownText1: {
    fontSize: 11,
    color: '#462B5A',
    paddingLeft: 5,
    paddingRight: 5
  },
  propDropdown: {
    flex: 1,
    minWidth: 100
  },
  propertyItemEven: {
    paddingLeft: 8,
    paddingRight: 25,
    paddingBottom: 16,
    width: width * 0.5
  }

});
