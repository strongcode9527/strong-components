/**
 * Created by strong on 2017/8/4.
 */
import React, { Component, TouchEvent, ReactNode, CSSProperties } from 'react'
import classNames from 'classnames';
import './index.less'

declare global {
  interface Window { REFRESH_DEFAULT_SCROLL_TOP: number }
}

window.REFRESH_DEFAULT_SCROLL_TOP = window.REFRESH_DEFAULT_SCROLL_TOP || 0;

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
  isLoading: boolean;
  moveDistance: number;
}

interface Style {
  bodyStyle: CSSProperties;
  moveStyle: CSSProperties;
}

export default class Scroll extends Component<MyProps, MyState> {
  startY: number;
  distance: number;
  body: HTMLElement;
  items: HTMLElement;
  isLoading: boolean;
  animation: HTMLElement;
  startScrollTop: number;
  containerHeight: number;
  
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

  constructor(props: MyProps) {
    super(props)
    this.startY = 0
    this.body = null //组建内部的body
    this.distance = 0
    this.items = null
    this.animation = null
    this.isLoading = false
    this.startScrollTop = 0
    this.containerHeight = 0
  }

  state: MyState = {
    showTop: false,
    isLoading: false,
    moveDistance: 0,
  }

  componentDidMount(): void {
    this.containerHeight = this.body.clientHeight
    document.body.addEventListener('touchmove', (e): void => {
      // e.stopPropagation()
      e.preventDefault()
    })
  }


  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  handleTouchStart = (e: TouchEvent): void  => {
    const { operationCallback } = this.props
    this.startY = e.touches[0].clientY
    this.startScrollTop = this.body.scrollTop

    // 当触碰到整个组件的时候，调用回调函数
    if(operationCallback && typeof operationCallback !== 'function') {
      throw new Error('handleScrollToZero must be a function')
    }
    e.stopPropagation()
    e.preventDefault()
    operationCallback && operationCallback()
  }

  handleTouchMove = (e: TouchEvent): void => {
    const {resistance, isRefresh} = this.props
    if(!isRefresh) {
      return
    }
    e.stopPropagation()
    e.preventDefault()
    this.distance = (e.touches[0].clientY - this.startY) / resistance

    this.setState({
      moveDistance: this.distance
    })
  }

  handleTouchEnd = (): void => {
    const { distanceToRefresh } = this.props
    if (this.distance > distanceToRefresh && !this.startScrollTop && !this.isLoading) {
      this.setState({
        isLoading: true,
        moveDistance: 0,
      })
      this.isLoading = true
      this.loading()
    } else {
      this.setState({
        moveDistance: 0,
      })
    }
    // document.removeEventListener('touchmove', this.handleCancelMove)
  }


  loading = async (): Promise<void> => {
    const { onRefresh } = this.props
    
    this.distance = 0
    this.isLoading = false
    this.setState({
      moveDistance: 0,
      isLoading: false,
    })
    return await new Promise((resolve, reject): void => { onRefresh(resolve, reject) })
  }

  render(): ReactNode {
    const {
      loading,
      children,
      prefixCls,
    } = this.props

    const {
      isLoading,
      moveDistance,
    } = this.state


    const style: Style = {
      bodyStyle: {
        position: 'relative',
      },
      moveStyle: {
        transform: `translate(0,${moveDistance}px) translateZ(0px)`,
      }
    }
 

    const childrenLength = React.Children.count(children)

    return (
      <div
        style={style.bodyStyle}
        onTouchEnd={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
        onTouchStart={this.handleTouchStart}
        ref={(body): void => {this.body = body}}
        className={classNames(`${prefixCls}-body`, { [`${prefixCls}-refresh-loading`]: isLoading })}
      >
        {/* loading动画的 */}
        <div ref={(animation): void => {this.animation = animation}} className={`${prefixCls}-ptr-element`} style={style.moveStyle}>
          <span className={`${prefixCls}-genericon ${prefixCls}-genericon-next`} />
          {
            loading && (
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
                ref={(items): void => {this.items = items}}
                className={`${prefixCls}-refresh-view`}
              >
                {children}
              </div>
            )
        }

        <div>
        </div>
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


