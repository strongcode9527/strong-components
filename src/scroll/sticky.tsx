/**
 * Created by strong on 2017/8/4.
 */
import React, { Component, ReactNode, CSSProperties } from 'react'
import classNames from 'classnames';


interface MyProps {
  loading: object;
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

export default class Scroll extends Component<MyProps, MyState> {
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
  }

  constructor(props: MyProps, context) {
    super(props)
    this.startY = 0
    this.body = null //组建内部的body
    this.distance = 0
    this.items = null
    this.animation = null
    this.isLoading = false
    this.startScrollTop = 0
    this.containerHeight = 0
    this.limitRollingHeight = 0
  }

  state: MyState = {
    currentY: 0,
    preventY: 0,
    showTop: false,
    moveDistance: 0,
    isLoading: false,
    isTransition: false,
  }

  
  render(): ReactNode {
    const {
      children,
    } = this.props

    return (
      <div>
        {children}
      </div>
    )
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


