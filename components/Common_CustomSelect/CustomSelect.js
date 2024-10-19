import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Image, Animated, Easing, Dimensions } from 'react-native';
import Modal from 'react-native-modal'
const { width, height } = Dimensions.get('window')

const Field = ({ disabled, label = '', showValue = '', expandRotate, onPress, small = false }) => {
  return (
    <TouchableOpacity
      style={styles.expandBtn}
      onPress={onPress}
    >
      {!showValue ? (
        <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={styles.labelStyle}>{label || ''}</Text>
      ) : (
          <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode="tail" style={styles.labelStyle}>{showValue}</Text>
        )}
      {!disabled && (
        <Animated.View style={{ marginLeft: 10, transform: [{ rotateX: expandRotate }] }}>
          <Image source={require('../../assets/icons/view-all.png')} style={styles.expandIcon} resizeMode='contain' />
        </Animated.View>
      )}
    </TouchableOpacity>
  )
}

class CustomSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxHeight: 100,
      isOpen: false,
      dropdownPosition: {
        width: 0,
        left: 0,
        top: 0
      }
    };
    this.animatedValue = new Animated.Value(0)
  }
  animate = () => {
    const { isOpen } = this.state;

    this.rootContainer.measureInWindow(async (x, y, w, h) => {
      await this.setState({ dropdownPosition: { left: x, top: y, width: w }, isOpen: !isOpen });
      this.animatedValue.setValue(!isOpen ? 1 : 0);

      Animated.timing(
        this.animatedValue,
        {
          toValue: isOpen ? 0 : 1,
          duration: 200,
          easing: Easing.linear
        }
      ).start()
    })

  }
  setMaxHeight(event) {
    this.setState({
      maxHeight: event.nativeEvent.layout.height
    });
  }

  getShowedValue = () => {

    let showValue = '';

    const { multiple } = this.props;
    const data = this.props.data ? [].concat(this.props.data) : [];

    if (multiple) {
      let value = this.props.value || [];
      let index = 0;
      data.forEach((item, i) => {
        if (value.indexOf(this.valueExtractor(item)) !== -1) {
          showValue += (index !== 0 ? ', ' : '') + this.labelExtractor(item);
          index++;
        }
      });
    } else {
      const { value } = this.props;
      let selectedItem = data.find(item => {
        return this.valueExtractor(item) === value
      });

      if (selectedItem) {
        showValue = this.labelExtractor(selectedItem);
      }
    }

    return showValue;
  }

  _keyExtractor = (item, index) => String(index);

  valueExtractor = (item) => {
    return this.props.valueExtractor ? this.props.valueExtractor({ ...item }) : item.value;
  }

  labelExtractor = (item) => {
    return this.props.labelExtractor ? this.props.labelExtractor({ ...item }) : item.label;
  }

  onMultipleSelect = (item) => {
    const { onChangeText } = this.props;
    let value = this.props.value ? [].concat(this.props.value) : [];

    const indexInValue = value.indexOf(this.valueExtractor(item));
    const isChecked = indexInValue !== -1;

    if (isChecked) {
      value.splice(indexInValue, 1);
    } else {
      value = [].concat(value, this.valueExtractor(item));
    }

    if (onChangeText) {
      onChangeText(value);
    }
  }

  onSingleSelect = (item) => {
    const { onChangeText } = this.props;
    const newValue = this.valueExtractor(item);

    if (onChangeText) {
      onChangeText(newValue);
    }

    if (this.state.isOpen) {
      this.animate();
    }
  }

  renderOption = ({ item }) => {
    const { multiple, small } = this.props;
    let isChecked = false;

    if (multiple) {
      const value = this.props.value ? [].concat(this.props.value) : [];
      const indexInValue = value.indexOf(this.valueExtractor(item));
      isChecked = indexInValue !== -1;
    } else {
      const value = this.props.value;
      isChecked = this.valueExtractor(item) === value;
    }

    const updateFn = multiple ? this.onMultipleSelect : this.onSingleSelect;

    return (
      <TouchableOpacity
        style={[styles.itemWrap, small ? styles.itemWrapSmall : null]}
        activeOpacity={0.6}
        onPress={() => updateFn(item)}
      >
        <Text allowFontScaling={false} style={{ fontSize: small ? 11 : 13, color: isChecked ? '#488BF8' : '#3C4755', }}>{this.labelExtractor(item) || ''}</Text>
      </TouchableOpacity>
    )
  }


  render() {
    const { isOpen, maxHeight, dropdownPosition } = this.state;
    const props = this.props;
    const err = props.error;
    const animatedHeight = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, maxHeight]
    });

    const expandRotate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    });

    const dropdownOpacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    const disabled = Boolean(props.disabled);

    const dropdownWrapStyle = { position: 'absolute', width: "100%", top: 0, opacity: dropdownOpacity, zIndex: 100, ...dropdownPosition };
    let showValue = this.getShowedValue();
    return (
      <View
        style={[styles.container, props.style]}
        ref={ref => this.rootContainer = ref}
        onLayout={this.handleDropdownPosition}
      >
        <View style={[styles.fieldWrap, props.baseStyle]}>
          <Field
            small={!!props.small}
            label={props.label}
            onPress={this.animate}
            showValue={showValue || this.props.label}
            expandRotate={expandRotate}
            disabled={disabled}
          />
        </View>


        {Boolean(err) && <View style={styles.errorRow}>
          <Text allowFontScaling={false} style={styles.errorText}>{err}</Text>
        </View>}
        {!!isOpen && (
          <Modal
            isVisible={isOpen}
            style={{ margin: 0 }}
            backdropColor="transparent"
            backdropOpacity={0}
            onBackdropPress={!!isOpen ? this.animate : undefined}
            animationIn={{ from: { opacity: 1 }, to: { opacity: 1 } }}
            animationOut={{ from: { opacity: 0 }, to: { opacity: 0 } }}
            animationInTiming={0}
            animationOutTiming={0}
          >
            <Animated.View
              style={dropdownWrapStyle}
            >
              <View style={[styles.fieldWrap, props.baseStyle, { zIndex: 101 }]}>
                <Field
                  small={!!props.small}
                  label={props.label}
                  onPress={this.animate}
                  expandRotate={expandRotate}
                  disabled={disabled}
                />
                <Animated.View style={{ height: animatedHeight, overflow: 'hidden', position: 'relative' }}>
                  <View style={{ position: 'absolute', flexShrink: 0, opacity: isOpen ? 1 : 0, paddingBottom: 10, width: '100%' }} onLayout={this.setMaxHeight.bind(this)}>
                    <FlatList
                      data={props.data}
                      keyExtractor={this._keyExtractor}
                      renderItem={this.renderOption}
                      extraData={this.props.value}
                    />
                    {(!props.data || props.data.length === 0) && <Text allowFontScaling={false} style={[styles.noData, { opacity: isOpen ? 1 : 0 }]}>No Options</Text>}
                  </View>
                </Animated.View>
              </View>
            </Animated.View>
          </Modal>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 100,
    overflow: 'visible',
    paddingHorizontal: width * 0.004,
  },
  fieldWrap: {    
    paddingHorizontal: width * 0.004,
    width: '100%',
    minHeight: 30,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#cccccc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10    
  },
  expandBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  textField: {
    width: '100%',
    flexShrink: 0,
    marginTop: -30,
  },
  labelStyle: {
    color: '#414141',
    fontFamily: 'Poppins-Regular',
    fontSize: 13
  },
  expandIcon: {
    width: 20,
    height: 12,
    resizeMode: 'contain',
  },
  itemWrap: {
    padding: 5,
    flex: 1
  },
  itemWrapSmall: {
    padding: 5
  },
  errorRow: {
    paddingTop: 5,
    minHeight: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
  },
});

export default CustomSelect;