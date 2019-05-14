/**
 * Created by strong on 2017/8/4.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';


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

export default class Scroll extends Component<MyProps, MyState> {
  startY: number;
  distance: number;
  body: HTMLElement;
  items: HTMLElement;
  isLoading: boolean;
  realBody: HTMLElement;
  animation: HTMLElement;
  startScrollTop: number;

  static defaultProps = {
    isRefresh: true,
    resistance: 2.5,
    defaultScrollTop: 0,
    onRefresh: () => {},
    isShowGotoTop: true,
    distanceToRefresh: 100,
    prefixCls: 'mi-refresh',
    scrollTargetSelector: '',
    operationCallback: () => {},
    handleScrollToZero: () => {},
  }

  constructor(props) {
    super(props)

    this.startY = 0
    this.body = null //组建内部的body
    this.distance = 0
    this.items = null
    this.realBody = null //经过处理后的body
    this.isLoading = false
    this.animation = null
    this.startScrollTop = 0
  }

  state: MyState = {
    showTop: false,
    isLoading: false,
    moveDistance: 20,
  }

  componentDidMount() {


  }

  // 处理在网页的轮动条滚动时，改变监控的滚动条对象。和react的渲染机制进行匹配。
  componentWillReceiveProps({ scrollTargetSelector, defaultScrollTop }) {
    if (scrollTargetSelector !== this.props.scrollTargetSelector) {
      // 在绑定之前先将之前realbody的绑定事件去掉
      this.realBody.removeEventListener('scroll', this.handleScroll)
      // 处理新的realbody
      this.realBody = this.getScrollTarget(scrollTargetSelector)
      this.realBody.addEventListener('scroll', this.handleScroll)
      this.realBody.scrollTop = defaultScrollTop
    }
  }

  componentWillUnmount() {
    this.realBody.removeEventListener('scroll', this.handleScroll)

    // !this.browserIsUc && document.removeEventListener('touchmove', this.handleCancelMove)

    window.REFRESH_DEFAULT_SCROLL_TOP = this.realBody.scrollTop
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  handleTouchStart = (e)  => {
    const { operationCallback } = this.props
    this.startY = e.touches[0].clientY
    this.startScrollTop = this.body.scrollTop

    // 当触碰到整个组件的时候，调用回调函数
    if(operationCallback && typeof operationCallback !== 'function') {
      throw new Error('handleScrollToZero must be a function')
    }
    operationCallback && operationCallback()
  }

  handleTouchMove = (e) => {
    const {resistance, isRefresh} = this.props
    if(!isRefresh) {
      return
    }

    this.distance = (e.touches[0].clientY - this.startY) / resistance

    this.setState({
      moveDistance: this.distance
    })
  }

  handleTouchEnd = (event) => {
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
    document.removeEventListener('touchmove', this.handleCancelMove)
  }

  handleCancelMove = (e) => {
    e.preventDefault()
  }

  loading = async () => {
    const { onRefresh } = this.props
    await new Promise((resolve, reject) => { onRefresh(resolve, reject) })
    this.distance = 0
    this.isLoading = false
    this.setState({
      moveDistance: 0,
      isLoading: false,
    })
  }

  render() {
    const {
      GotoTop,
      loading,
      children,
      prefixCls,
      isShowGotoTop
    } = this.props

    const {
      showTop,
      isLoading,
      moveDistance,
    } = this.state

    const bodyStyle = {
      position: 'relative',
    }

    const moveStyle = {
      transform: `translate3d(0,${moveDistance}px,0)`,
    }

    const childrenLength = React.Children.count(children)

    return (
      <div
        style={bodyStyle}
        ref={body => this.body = body}
        className={classNames(`${prefixCls}-body`, { [`${prefixCls}-refresh-loading`]: isLoading })}
      >
        {/* loading动画的 */}
        <div ref={animation => this.animation = animation} className={`${prefixCls}-ptr-element`} style={moveStyle}>
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
                style={moveStyle}
                ref={(items) => this.items = items}
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


