/**
 * Created by strong on 2017/8/4.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

type MyState = {
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

    this.state = {
      showTop: false,
      moveDistance: 0,
      isLoading: false
    }

    this.startY = 0
    this.body = null //组建内部的body
    this.distance = 0
    this.items = null
    this.realBody = null //经过处理后的body
    this.isLoading = false
    this.animation = null
    this.startScrollTop = 0
  }


  componentDidMount() {
    const { scrollTargetSelector, defaultScrollTop } = this.props
    const self = this

    // 处理body元素，并且绑定滚动事件
    this.realBody = this.getScrollTarget(scrollTargetSelector)
    this.realBody.scrollTop = defaultScrollTop
    this.realBody.addEventListener('scroll', this.handleScroll)
    /*
     * 使用原生事件绑定方式，主要是因为react独特的事件绑定方式。
     * react 会把事件绑定到document上面，这样就无法在第一时间禁止掉document的touchmove事件，导致页面下滑刷新整个页面。
     * 如果没有在第一时间将document的touchmove禁止掉，就会发生如下warning：
     * Ignored attempt to cancel a touchmove event with cancelable=false, for example because scrolling is in progress and cannot be interrupted.
    */

    this.items.addEventListener('touchmove', this.handleTouchMove, false)
    this.items.addEventListener('touchstart', this.handleTouchStart, false)
    this.items.addEventListener('touchend', this.handleTouchEnd, false)

    // 判断 addEventListener('test', null, {passive: false}) 绑定方式是否支持。
    // 主要是兼容uc浏览器
    //   try {
    //     const options = Object.defineProperty({}, "passive", {
    //       get: function() {
    //         self.passiveSupported = true;
    //       }
    //     });
    //     window.addEventListener("test", null, options);
    //   } catch(err) {
    //     alert(err)
    //   }
    // }
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

  goToTop = () => {
    this.realBody.scrollTop = 0
  }

  handleScroll = () => {
    const { handleScrollToZero } = this.props

    if (handleScrollToZero && typeof handleScrollToZero !== 'function') {
      throw new Error('handleScrollToZero must be a function')
    }

    if (handleScrollToZero) {
      handleScrollToZero()
    }

    if (this.realBody.scrollTop > 100) {
      this.setState({ showTop: true })
    } else {
      this.setState({ showTop: false })
    }
  }

  /**
   * 类似于jquery的元素选择器，
   *  target 为空返回document
   * @param {String} target
   */

  getScrollTarget = (target) => {
    return !target
        ? this.body
        : target === 'document'
            ? document
            : target === 'body'
                ? document.body
                : document.querySelector(target) || document
  }

  /**
   * 返回指定dom的滚动条高度
   */

  // getRealBodyScrollTop = () => {
  //   // chrome一众浏览器获取滚动条高度通过document.documentElement而uc浏览器是通过document.body获取
  //   return this.realBody === document ? (document.documentElement.scrollTop || document.body.scrollTop) : this.realBody.scrollTop
  // }

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
            {
              isShowGotoTop && showTop && (
                  <div onTouchStart={this.goToTop}>
                    { GotoTop || <div className={`${prefixCls}-goto_top`} /> }
                  </div>
              )
            }
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


