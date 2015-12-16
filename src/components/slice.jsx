import _ from "lodash";
import React, { PropTypes } from "react";
import Radium from "radium";
import {VictoryAnimation} from "victory-animation";

@Radium
export default class Slice extends React.Component {
  static propTypes = {
    animate: PropTypes.object,
    slice: PropTypes.object,
    pathFunction: PropTypes.func,
    style: PropTypes.object
  };

  evaluateStyle(style) {
    return _.transform(style, (result, value, key) => {
      result[key] = _.isFunction(value) ? value.call(this, this.props.slice.data) : value;
    });
  }

  getStyles() {
    const dataStyles = _.omit(this.props.slice.data, ["x", "y", "label"]);
    return this.evaluateStyle(_.merge({}, this.props.style, dataStyles));
  }

  renderSlice(props) {
    return (
      <path
        d={props.pathFunction.call(this, props.slice)}
        style={this.getStyles()}
      />
    );
  }

  render() {
    if (this.props.animate) {
      // Do less work by having `VictoryAnimation` tween only values that
      // make sense to tween. In the future, allow customization of animated
      // prop whitelist/blacklist?
      const animateData = _.pick(this.props, ["style", "slice"]);
      return (
        <VictoryAnimation {...this.props.animate} data={animateData}>
          {(props) => <Slice {...this.props} {...props} animate={null}/>}
        </VictoryAnimation>
      );
    }
    return this.renderSlice(this.props);
  }
}