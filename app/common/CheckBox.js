import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ViewPropTypes,
    Image,
    Text,
    TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.isChecked,
        }
    }
    static propTypes = {
        ...(ViewPropTypes || View.PropTypes),
        leftText: PropTypes.string,
        leftTextView: PropTypes.element,
        rightText: PropTypes.string,
        leftTextStyle: PropTypes.object,
        rightTextView: PropTypes.element,
        rightTextStyle: PropTypes.object,
        checkedImage: PropTypes.element,
        unCheckedImage: PropTypes.element,
        onClick: PropTypes.func.isRequired,
        isChecked: PropTypes.bool.isRequired,
        isIndeterminate: PropTypes.bool.isRequired,
        checkBoxColor: PropTypes.string,
        disabled: PropTypes.bool,
    }
    static defaultProps = {
        isChecked: false,
        isIndeterminate: false,
        leftTextStyle: {},
        rightTextStyle: {}
    }
    onClick() {
        this.setState({
            isChecked: !this.state.isChecked
        })
        this.props.onClick();
    }
        _renderLeft() {
            if (this.props.leftTextView)return this.props.leftTextView;
        if (!this.props.leftText)return null;
      let counting = this.props.countingItem ? <Text style={{ fontSize: 10}}> {"("} {this.props.countingItem} {")"} </Text> : null
        return (
                <Text style={[styles.leftText, this.props.leftTextStyle]}>{this.props.leftText} {counting}</Text>
                    );
    }
    _renderRight() {
        if (this.props.rightTextView)return this.props.rightTextView;
        if (!this.props.rightText)return null;
        return (
            <Text style={[styles.rightText, this.props.rightTextStyle]}>{this.props.rightText}</Text>
        );
    }

    _renderImage() {
        if (this.props.isIndeterminate){
            return this.props.indeterminateImage ? this.props.indeterminateImage : this.genCheckedImage();
        }
        if (this.state.isChecked) {
            return this.props.checkedImage ? this.props.checkedImage : this.genCheckedImage();
        } else {
            return this.props.unCheckedImage ? this.props.unCheckedImage : this.genCheckedImage();
        }
    }

    genCheckedImage() {
        const { lang } = this.props;
        var source;
        if (this.props.isIndeterminate) {
            source = 'check-box'
        }
        else {
            source = this.state.isChecked ? 'check-box' : 'check-box-outline-blank';
        }

        return (
            <Icon style={lang === 'ar'? { marginLeft : 10}: { marginRight : 10}} name={source} size={25}   />
        );
    }

    render() {
        const { lang } = this.props;
        return (
            <TouchableHighlight
                style={this.props.style}
                onPress={()=>this.onClick()}
                underlayColor='transparent'
                disabled={this.props.disabled}
            >
                <View style={[styles.container, { flexDirection: (lang === 'ar') ? 'row' : 'row-reverse'}]}>
                    {this._renderLeft()}
                    {this._renderImage()}
                    {this._renderRight()}
                </View>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent : 'space-around',
        alignItems: 'center'
    },
    leftText: {
        flex: 1,
    },
    rightText: {
        flex: 1,
        marginLeft: 10
    }
});
