/**
 * Created by strong on 2017/8/4.
 */
import React, { Component, ReactNode, CSSProperties } from 'react';
import ThemeContext from './context';

interface Style {
  bodyStyle: CSSProperties;
  moveStyle: CSSProperties;
}

export default class Sticky extends Component {
  static contextType = ThemeContext;

  ref: HTMLElement;

  componentDidMount(): void {
    this.context.stickies.push(this);
  }

  render(): ReactNode {
    const {
      children,
    } = this.props;

    return (
      <div ref={(ref): void => { this.ref = ref }}>
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
