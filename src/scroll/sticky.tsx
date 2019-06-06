/**
 * Created by strong on 2017/8/4.
 */
import React, { Component, ReactNode, CSSProperties } from 'react';
import ThemeContext from './context';

console.log('stick', ThemeContext);

interface MyProps {

}

interface MyState {

}

interface Style {
  bodyStyle: CSSProperties;
  moveStyle: CSSProperties;
}

export default class Sticky extends Component<MyProps, MyState> {

  static defaultProps = {

  }

  static contextType = ThemeContext

  constructor(props: MyProps, context) {
    super(props);
  }

  componentDidMount() {
    this.context.stickies.push(this.ref)
  }


  
  render(): ReactNode {
    const {
      children,
    } = this.props;

    return (
      <div ref={(ref): void => { this.ref = ref; }}>
        {children}
      </div>
    );
  }
}


// Scroll.propTypes = {
//   onRefresh: PropTypes.func,
//   isRefresh: PropTypes.bool,
//   loading: PropTypes.object,
//   prefixCls: PropTypes.string,
//   resistance: PropTypes.number,
//   isShowGotoTop: PropTypes.bool,
//   operationCallback: PropTypes.func,
//   handleScrollToZero: PropTypes.func,
//   defaultScrollTop: PropTypes.number,
//   distanceToRefresh: PropTypes.number,
//   scrollTargetSelector: PropTypes.string,
// }


