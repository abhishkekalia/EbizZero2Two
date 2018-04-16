import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import {
    StatusBar,
    Text,
    View,
    StyleSheet,
    PixelRatio,
    Image
} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'
import Icon from 'react-native-vector-icons/FontAwesome';
const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
};
class TabIcon extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const color = this.props.selected ? '#fbcdc5' : '#a9d5d1',
        { lang, iconName, iconNameSel } = this.props;
        return (
            <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center', position:'absolute'}}>
                {
                    this.props.is_vector
                    ?
                    <Image
                        style={{color: this.props.focused ? '#fbcdc5' : '#a9d5d1'}}
                        style={{ width: 20,
                            height: 20
                        }}
                        resizeMode = {"contain"}
                        resizeMethod = 'resize'
                        source={ this.props.focused ? iconNameSel : iconName}
                        size={18}/>
                    :
                    <Icon style={{color: this.props.focused ? '#fbcdc5' : '#a9d5d1'}} name={this.props.iconName || "circle"} size={this.props.focused ? 20 : 18}/>
                }
                <Text style={{color: '#000' ,fontSize: this.props.focused ? 10 : 10}}>{I18n.t(this.props.title, { locale: lang })}</Text>
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(TabIcon);
