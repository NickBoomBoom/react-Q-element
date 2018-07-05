import React, { Component } from 'react'
import './ScrollView.css'
const TOP = 'top'
const BOTTOM = 'bottom'
const LOADING = 'loading'

const TOUCH_TOP = 'touch_top'
const TOUCH_BOTTOM = 'touch_bottom'

class ScrollView extends Component {
  constructor(props) {
    super(props)
    this.limit = props.limit || 4                            // touch移动的距离限制 每次移动 1 / limit
    this.state = {
      isFetch: props.isFetch || false,                       // 当页面没有数据的时候,开启 loading 效果,直接触发 topMethod 函数, 默认为 false 
      isLoadOver: props.isLoadOver,                          // 请求是否完成,可传字符串 || Boolean, Boolean 为 true 时默认展示字段'全部加载完毕', 传字符串就展示字符串
      requestState: props.requestState,                      // 请求是否完成
      isPullDown: props.isPullDown || false,                 // 是否开启下拉刷新, 默认为 false Boolean
      isPullUp: props.isPullUp || false,                      // 是否开启上拉加载, 默认为 false Boolean
      topDistance: props.topDistance || 50,                  // 下拉刷新 触发 阀值, 默认为 50px Number
      bottomDistance: props.bottomDistance || 50,            // 上拉加载 触发 阀值, 默认为 50px Number
      isPullDownStatus: null,                                // 下拉刷新状态, 默认为 null String
      isPullUpStatus: null,                                  // 上拉加载状态, 默认为 null String
      topMethod: props.topMethod,                            // 下拉刷新执行方法 
      bottomMethod: props.bottomMethod,                      // 上拉加载执行方法 
      wrapHeight: props.wrapHeight,                          // 用户传进来的高度, 如果没有则自动获取 scorllview 父级的高度
      pullThreshold: props.pullThreshold || 200,             // 上拉和下拉 最高可拉的阀值, 默认200  
      scrollX: props.scrollX || false,                       // 允许横向滚动, 默认为 false Boolean
      scrollY: props.scrollY || false,                       // 允许纵向滚动, 默认为 false Boolean
      upperThreshold: props.upperThreshold || 50,            // 距离顶部/左边多远时, 触发 onUpper 事件, 默认为 50px Number
      lowerThreshold: props.lowerThreshold || 50,            // 距离底部/右边多远时, 触发 onLower 事件, 默认为 50px  Number
      onUpper: props.onUpper,                                // 滚动到顶部/左边, 会触发 onUpper 事件 Function
      onLower: props.onLower,                                // 滚动到底部/右边, 会触发 onLower 事件 Function
      onScroll: props.onScroll,                              // 滚动实时触发  Function
      itemIndex: props.itemIndex || false,                   // 展示第几个内容, 默认 false, 即默认展示, Number, 与 itemKey 只能存在一个
      itemKey: props.itemKey || false,                       // 展示第几个内容, 默认 false, 即默认展示, String || Number, 与 itemIndex 只能存在一个
      animateTime: props.animateTime || 300,                 // 设置缓动动画完成时间, 默认300 Number
      // TODO: 功能点: 当出现类似于饿了么外卖界面的情况,左右各一个 ScrollView 左边点击某个标签, 右边自动滚动到对应位置
      // scrollTop: props.scrollTop,                            // 设置竖向滚动条位置
      // scrollLeft: props.scrollLeft,                          // 设置横向滚动条位置
    }
  }

  componentDidMount() {
    let { wrapHeight, scrollX } = this.state
    this.setState({
      wrapHeight: wrapHeight ? wrapHeight : parseFloat(window.getComputedStyle(this.wrap.parentNode).height)
    }, () => {
      if (scrollX) {
        this.setTarget()
      } else {
        this.wrap.addEventListener('touchstart', this.handleTouchStart)
        this.wrap.addEventListener('touchmove', this.handleTouchMove)
        this.wrap.addEventListener('touchend', this.handleTouchEnd)
        this.fetchData()
        this.fill(true)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    let { requestState, isLoadOver } = nextProps
    let { isPullUpStatus, isPullDownStatus, animateTime } = this.state
    // console.log('scrollveiw nextProps', nextProps, requestState)
    const OO = {
      // 上拉加载
      pullUp: () => {
        this.translate()
        setTimeout(() => {
          this.setState({
            isPullUpStatus: null
          }, () => {
            this.fill()
          })
        }, animateTime)
      },
      // 下拉刷新
      pullDown: () => {
        // TODO: 点1!!! 埋个坑 当用户下拉刷新结束后 再次滚动界面,我设置 loading 也会随之滚动上去, 当数据更新完后,视图也更新完,我设置不回滚到 scrolltop
        // 但当用户停留在 loading 不滚动的时候  就给他来个 动效
        this.wrap.scrollTop === 0 && this.translate()
        setTimeout(() => {
          this.setState({
            isPullDownStatus: null
          }, () => this.fill())
        }, animateTime);
      }
    }
    if (requestState) {
      isPullUpStatus && OO.pullUp()
      isPullDownStatus && OO.pullDown()
    }
    this.setState({ isLoadOver })
  }

  componentWillUnmount() {
    this.wrap.removeEventListener('touchstart', this.handleTouchStart)
    this.wrap.removeEventListener('touchmove', this.handleTouchMove)
    this.wrap.removeEventListener('touchend', this.handleTouchEnd)
    let dom = this.state.scrollX ? this.children : this.wrap
    dom.removeEventListener('scroll', this.scroll)
    clearInterval(this.timer)
  }

  handleTouchStart = (e) => {
    // console.log('触摸开始', this.wrap.scrollTop)
    this.startY = e.touches[0].clientY
  }

  handleTouchMove = e => {
    let { isPullDown, isPullUp, topDistance, bottomDistance, isPullDownStatus, isPullUpStatus, isLoadOver } = this.state
    let scrollTop = this.wrap.scrollTop
    let moveY = e.touches[0].clientY
    let distance
    this.direction = moveY - this.startY > 0 ? TOUCH_BOTTOM : TOUCH_TOP
    // console.log('滚动距离==>' + scrollTop, '上拉加载距离==>' + this.bottom)
    if (isPullDown && this.direction === TOUCH_BOTTOM && scrollTop === 0 && isPullDownStatus !== LOADING && !isPullUpStatus) {
      event.preventDefault();
      // event.stopPropagation();
      this.pullDownBarStartY = this.pullDownBarStartY ? this.pullDownBarStartY : e.touches[0].clientY
      distance = (moveY - this.pullDownBarStartY) / this.limit
      this.translate(distance, false)
      this.setState({
        isPullDownStatus: distance >= topDistance ? TOP : BOTTOM
      })
      // console.log('开启下拉刷新')
    } else if (isPullUp && !isLoadOver && this.direction === TOUCH_TOP && scrollTop >= this.bottom && isPullUpStatus !== LOADING && !isPullDownStatus) {
      event.preventDefault();
      // event.stopPropagation();
      this.pullUpBarStartY = this.pullUpBarStartY ? this.pullUpBarStartY : e.touches[0].clientY
      distance = (moveY - this.pullUpBarStartY) / this.limit
      this.translate(distance, false)
      this.setState({
        isPullUpStatus: Math.abs(distance) >= bottomDistance ? BOTTOM : TOP
      })
      // console.log('开启上拉加载')
    }
  }

  handleTouchEnd = e => {
    let { isPullDownStatus, isPullUpStatus, topMethod, bottomMethod, animateTime } = this.state
    // 重置上拉, 下拉 开始的 Y 轴点
    this.pullDownBarStartY = null
    this.pullUpBarStartY = null
    // console.log('触摸结束', isPullDownStatus, isPullUpStatus)
    // OO 包裹,const 定义的常量  不可动, 如果动的话, 下面两个对象中 top, bottom 也需要改变
    // 上拉 下拉 还是尽量独立出来  方便以后维护和更改
    const pullDownFn = {
      top: () => {
        this.setState({
          isPullDownStatus: LOADING
        }, () => {
          this.translate(this.pullDownBarHeight)
          topMethod && topMethod()
        })
      },
      bottom: () => {
        this.translate()
        setTimeout(() => {
          this.setState({
            isPullDownStatus: null
          })
        }, animateTime);
      }
    }
    const pullUpFn = {
      top: () => {
        this.translate()
        setTimeout(() => {
          this.setState({
            isPullUpStatus: null
          })
        }, animateTime);

      },
      bottom: () => {
        this.setState({
          isPullUpStatus: LOADING
        }, () => {
          this.translate(-this.pullUpBarHeight)
          bottomMethod && bottomMethod()
        })
      }
    }
    isPullDownStatus && isPullDownStatus !== LOADING && pullDownFn[isPullDownStatus]()
    isPullUpStatus && pullUpFn[isPullUpStatus]()
  }

  // 无数据直接触发顶部 loading, 并执行 topMethod函数
  fetchData = () => {
    let {isFetch, topMethod,animateTime} = this.state
    if(isFetch) {
      this.setState({
        isPullDownStatus: LOADING,
        isPullUpStatus: null
      },()=>{
        this.translate(this.pullDownBarHeight, true)
        topMethod && topMethod()
      })
    }
  }

  // 滚动触发函数
  scroll = () => {
    let { onLower, onUpper, onScroll, scrollX, upperThreshold, lowerThreshold } = this.state
    let attr = scrollX ? 'scrollLeft' : 'scrollTop'
    let dom = scrollX ? this.children : this.wrap
    let scrollValue = dom[attr]
    let viewAttr = scrollX ? parseFloat(window.getComputedStyle(dom, null).width) : parseFloat(window.getComputedStyle(dom, null).height)
    let scrollDistance = scrollX ? dom.scrollWidth - viewAttr : dom.scrollHeight - viewAttr
    // TODO: 实时滚动中 会不停触发的函数, 暂时只添加滚动距离, 查缺补漏
    onScroll && onScroll({ scroll: scrollValue })
    if (scrollValue <= upperThreshold) {
      onUpper && onUpper()
    } else if (scrollValue >= scrollDistance - lowerThreshold) {
      onLower && onLower()
    }
  }

  // 自动填充 scrollY 中缺失的部分
  // 在scrollY 打开的情况下, 如果实际的子元素的总高度 小于 使用者定义的高度, 所以这时候我们就需要填充下盒子
  fill = once => {
    let { wrapHeight } = this.state
    let itemHeight = parseFloat(window.getComputedStyle(this.children).height)
    this.wrap.style.height = `${wrapHeight}px`
    this.setState({
      fillAttr: itemHeight < wrapHeight ? wrapHeight - itemHeight : false
    }, () => {
      this.scrollBottom()
      // 如果实际子元素的高度小于 定义高度, 而使用者有需要定位到一个 item 的位置,这时候我们就需要在填充完盒子之后在设置滚动, 只对 scrollY有效
      once && this.setTarget()
    })

  }

  // 设置初始目标位置
  setTarget = () => {
    let { itemIndex, itemKey, scrollX } = this.state
    let children = this.children.children
    let index
    // 检测下标 || key 值
    if (itemIndex) {
      index = itemIndex
    } else if (itemKey) {
      for (let i = 0; i < this.children.length; i++) {
        // console.log('key 值', this.children[i].key)
        if (itemKey === this.children[i].key) {
          index = i
          break
        }
      }
    }
    let dom = scrollX ? this.children : this.wrap
    if (index >= 0) {
      if (scrollX) {
        dom.scrollLeft = children[index].offsetLeft
      } else {
        console.log(children[index])
        dom.scrollTop = children[index].offsetTop
      }
    }
    // 等同步任务 完成后再添加 监听事件, 否则写成同步任务会触发 this.scroll
    setTimeout(() => {
      dom.addEventListener('scroll', this.scroll)
    }, 0);
  }

  /**
   *        实时 touch 移动
   * 
   * @param {number} [distance=0]移动距离,默认为0
   * @param {boolean} [transition=true]是否开启动画效果,默认开启
   */
  translate = (distance = 0, transition = true) => {
    let { pullThreshold, animateTime } = this.state
    // console.log('移动距离', distance, transition, this.content.style.transform)
    if (Math.abs(distance) > pullThreshold) return
    transition ? this.content.style.transition = `all ${animateTime}ms ease` : this.content.style.transition = 'none'
    this.content.style.transform = `translate3d(0, ${distance}px,0)`
  }


  /**
   *TODO: 暂留 这是为 点1 留下的解决方案,一个缓动动画效果
   *
   * @param {*} targe 需要滚动到的位置
   * @param {*} dom dom, 需要滚动的目标 
   * @param {*} direction  scrollTop || scrollLeft, 默认 scollTop
   */
  // animate = (target, dom, direction = scrollTop) => {
  //   clearInterval(this.timer)
  //   console.log('执行 animate')
  //   this.timer = setInterval(() => {
  //     let step = (target - dom[direction]) / 5
  //     step = step > 0 ? Math.ceil(step) : Math.floor(step)
  //     dom[direction] += step
  //     if (Math.abs(target - dom[direction]) <= Math.abs(step)) {
  //       clearInterval(this.timer)
  //       dom[direction] = target
  //     }
  //   }, 20)
  // }

  //  滚动到底部什么位置触发下拉加载
  scrollBottom = () => {
    let { fillAttr } = this.state
    let scrollHeight = this.children.scrollHeight
    let h = parseFloat(window.getComputedStyle(this.wrap).height)
    // fillAttr > 0 的时候页面是无法滚动的
    this.bottom = fillAttr ? 0 : scrollHeight - h
  }

  render() {
    let { isPullDownStatus, isPullUpStatus, fillAttr, scrollX, translate, isLoadOver } = this.state
    let { style, children } = this.props
    const Spinner = () => {
      return <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    }

    return <div className="load-more-root" style={style} ref={node => this.wrap = node}>
      <div className="load-more-content" ref={node => this.content = node}>
        {
          !scrollX && isPullDownStatus && !isPullUpStatus && <div className="pull-down-bar" ref={node => {
            node && (this.pullDownBarHeight = parseFloat(window.getComputedStyle(node).height))
          }}>
            {
              isPullDownStatus === LOADING ?
                <Spinner />
                :
                <span className={`is-transition ${isPullDownStatus === TOP ? 'is-rotate' : ''}`}>
                  &darr;
                </span>
            }
          </div>
        }
        <div
          className={`scroll-view-root ${scrollX ? 'scroll-view-x' : 'scroll-view-y'} `}
          ref={node => this.children = node}
        >
          {children.map((item, index) => {
            return <div
              key={'children' + index}
              className={`${scrollX ? 'scroll-x-item' : 'scroll-y-item'}`}
            >
              {item}
            </div>
          })}
        </div>
        {
          isLoadOver && (typeof isLoadOver === 'string' ? <p className='pull-up-tip'>{isLoadOver}</p> : <p className='pull-up-tip'>加载完毕</p>)
        }
        {
          fillAttr && <div style={{ height: fillAttr + 'px' }}></div>
        }
        {
          !scrollX && !isLoadOver && isPullUpStatus && !isPullDownStatus && <div className="pull-up-bar" ref={node => node && (this.pullUpBarHeight = parseFloat(window.getComputedStyle(node).height))}
          >
            {
              isPullUpStatus === LOADING ?
                <Spinner />
                :
                <span className={`is-transition ${isPullUpStatus === BOTTOM ? 'is-rotate' : ''} `}>
                  &uarr;
                </span>
            }
          </div>
        }
      </div>
    </div>

  }
}

export default ScrollView