import React, { Component, ReactNode, CSSProperties } from 'react';
import classNames from 'classnames';
import './index.less';
import Sticky from './sticky';
import ThemeContext from './context';



declare global {
  interface Window { REFRESH_DEFAULT_SCROLL_TOP: number }
}

window.REFRESH_DEFAULT_SCROLL_TOP = window.REFRESH_DEFAULT_SCROLL_TOP || 0;

interface MyProps {
  hasLoading: boolean;
  prefixCls: string;
  GotoTop: Function;
  resistance: number;
  isRefresh: boolean;
  onRefresh: Function;
  isShowGotoTop: boolean;
  defaultScrollTop: number;
  distanceToRefresh: number;
  operationCallback: Function;
  handleScrollToZero: Function;
  scrollTargetSelector: string;
}

interface MyState {
  showTop: boolean;
  currentY: number;
  preventY: number;
  isLoading: boolean;
  moveDistance: number;
  isTransition: boolean;
}

interface Style {
  bodyStyle: CSSProperties;
  moveStyle: CSSProperties;
}

interface StickiesInterface {
  stickies: [any];
}

export default class Scroll extends Component<MyProps, MyState> {
  static defaultProps = {
    isRefresh: true,
    resistance: 2.5,
    defaultScrollTop: 0,
    onRefresh: (): void => {},
    isShowGotoTop: true,
    distanceToRefresh: 100,
    prefixCls: 'mi-refresh',
    scrollTargetSelector: '',
    operationCallback: (): void => {},
    handleScrollToZero: (): void => {},
  };

  static Sticky = Sticky;

  state: MyState = {
    currentY: 0,
    preventY: 0,
    showTop: false,
    moveDistance: 0,
    isLoading: false,
    isTransition: false,
  };

  startY: number;
  distance: number;
  body: HTMLElement;
  startTime: number;
  items: HTMLElement;
  isLoading: boolean;
  animation: HTMLElement;
  startScrollTop: number;
  containerHeight: number;
  limitRollingHeight: number;
  stickies: {stickies: [any] | []};
  stickiesTop: number[];

  constructor(props: MyProps) {
    super(props);

    this.startY = 0;
    this.body = null; // 组建内部的body
    this.distance = 0;
    this.items = null;
    this.animation = null;
    this.isLoading = false;
    this.startScrollTop = 0;
    this.containerHeight = 0;
    this.limitRollingHeight = 0;
    this.stickies = {
      stickies: []
    };
    this.stickiesTop = [];
  }


  componentDidMount(): void {

    this.setHeight();
    this.body.addEventListener('touchmove', this.handleTouchMove, false);
    this.body.addEventListener('touchstart', this.handleTouchStart, false);
    this.body.addEventListener('touchend', this.handleTouchEnd, false);
    this.stickies.stickies.forEach((sticky): void => {
      const { top }: {top: number} = sticky.ref.getBoundingClientRect();
      this.stickiesTop.push(top);
    });
    window.addEventListener('resize', (): void => {
      this.setHeight();
    });
  }

  componentDidUpdate(PreProps: MyProps, preState: MyState): void{
    const { isLoading } = this.state;
    if (preState.isLoading === true && isLoading === false) {
      this.setHeight();
    }
  }

  handleGotoTop = () => {
    this.setState({
      currentY: 0,
      isTransition: true
    });
  };

  setHeight = (): void => {
    this.containerHeight = this.body.clientHeight;
    // 因为滚动高度是负值，所以颠倒相减的顺序
    this.limitRollingHeight = this.containerHeight - this.items.clientHeight;
  };

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  handleTouchStart = (e: TouchEvent): void => {
    const { operationCallback } = this.props;
    this.startY = e.touches[0].clientY;
    this.startScrollTop = this.body.scrollTop;

    // 当触碰到整个组件的时候，调用回调函数
    if (operationCallback && typeof operationCallback !== 'function') {
      throw new Error('handleScrollToZero must be a function');
    }

    this.setState({
      isTransition: false,
    });

    // e.stopPropagation();
    // e.preventDefault();

    this.startTime = new Date().valueOf();

    operationCallback && operationCallback();
  };

  handleTouchMove = (e: TouchEvent): void | boolean => {
    const { isRefresh } = this.props;
    const { preventY, isLoading } = this.state;

    if (isLoading) {
      return;
    }

    if (!isRefresh) {
      return false;
    }

    e.stopPropagation();
    e.preventDefault();

    this.distance = e.touches[0].clientY - this.startY;
    const currentY = preventY + this.distance;

    this.setState({
      isTransition: false,
      currentY,
    });
  };

  handleTouchEnd = (): void => {
    const { currentY, isLoading } = this.state;
    const isMovingUp = this.distance < 0;
    const isMoving = this.distance !== 0;
    const touchOfDuration = new Date().valueOf() - this.startTime;
    if (isLoading) {
      return;
    }
    if (currentY > 100) {
      this.setState({
        isLoading: true,
        currentY: 10,
        isTransition: true,
        preventY: 0
      });
      this.loading();
      return;
    }
    const inertiaDistance =  touchOfDuration < 200 && isMoving ? (isMovingUp ? -300 : 300) : 0;

    let positionY = currentY + inertiaDistance;


    if (positionY > 0) {
      positionY = 0;
    }

    if (positionY < this.limitRollingHeight) {
      positionY = this.limitRollingHeight;
    }

    this.setState({
      preventY: positionY,
      currentY: positionY,
      isTransition: true,
    });
  };


  loading = async () => {
    const { onRefresh } = this.props;

    this.distance = 0;
    this.isLoading = false;
    const promise = new Promise((resolve, reject): void => { onRefresh(resolve, reject, promise) }).then(() => {
      this.setState({
        isLoading: false,
        currentY: 0
      });
    });
  };

  getFixedStickies = (currentY: number): ReactNode => {
    const stickiesInstance = this.stickies.stickies;
    const stickiesElement = [];
    this.stickiesTop.forEach((top, index): void => {
      if (-currentY > top) {
        stickiesElement.push(stickiesInstance[index].props.children);
      }
    });

    return React.Children.map(stickiesElement, (child): ReactNode => (
      <div style={{ position: 'absolute', top: '0', left: '0' }}>
        {
          child
        }
      </div>
    ));
  };

  render(): ReactNode {
    const {
      hasLoading,
      children,
      prefixCls,
      GotoTop
    } = this.props;

    const {
      isLoading,
      currentY,
      isTransition,
    } = this.state;


    const style: Style = {
      bodyStyle: {
        position: 'relative',
      },
      moveStyle: {
        transition: `all ${isTransition ? 600 : 0}ms`,
        transform: `translate3d(0, ${currentY}px, 0)`,
        transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)'
      }
    };

    const childrenLength = React.Children.count(children);

    return (
      <ThemeContext.Provider value={this.stickies}>
        <div
          style={style.bodyStyle}
          ref={(body): void => { this.body = body }}
          className={classNames(`${prefixCls}-body`, { [`${prefixCls}-refresh-loading`]: isLoading })}
        >
          {/* loading动画的 */}
          <div ref={(animation): void => { this.animation = animation }} className={`${prefixCls}-ptr-element`} style={style.moveStyle}>
            <span className={`${prefixCls}-genericon ${prefixCls}-genericon-next`} />
            {
              hasLoading && (
                <div className={`${prefixCls}-loading`}>
                  <span className={`${prefixCls}-loading-ptr-1`} />
                  <span className={`${prefixCls}-loading-ptr-2`} />
                  <span className={`${prefixCls}-loading-ptr-3`} />
                </div>
              )
            }
          </div>
          {/* scroller内容的真正的 */}

          {
            childrenLength === 1
              ? React.Children.only(children)
              : (
                <div
                  style={style.moveStyle}
                  ref={(items: HTMLElement): void => { this.items = items }}
                  className={`${prefixCls}-refresh-view`}
                >
                  {children}
                </div>
              )
          }

          <div>
            {this.getFixedStickies(currentY)}
          </div>
          <div onClick={this.handleGotoTop} className="gotoTop">
            {
              <GotoTop />
            }
          </div>
        </div>
      </ThemeContext.Provider>
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
