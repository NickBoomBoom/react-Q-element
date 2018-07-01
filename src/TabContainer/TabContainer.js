import React, { Component } from 'react'
import './TabContainer.css'
const LEFT = 'left'
const RIGHT = 'right'
const TOP = 'top'
const DOWN = 'down'

/*  接受参数: 
      interval : 触发滚动间距  Number 默认为屏幕的1/5
      index : 默认0 展示第几页 Number
      onSel: 回调函数  返回index  Function
      onTranslate: 回调函数 配合 Navbar 做 bar 联动, 返回一个对象 {
        distance:  Number // 移动距离
        transition: Boolean // 是否开启 transition 动画
      }
*/
/* 
  必须与 TabContainerItem 搭配使用
    ex:   <TabContainer>
            <TabContainerItem style={{ fontSize: '20px', backgroundColor: 'red' ,height: '500px'}}>
            {arr.map(i => {
                return <div key={i}>{i}</div>
            })}
            </TabContainerItem>
            <TabContainerItem style={{ backgroundColor: 'yellow' }}>
            {arr.map(i => {
                return <div key={i}>{i}</div>
            })}
            </TabContainerItem>
            <TabContainerItem style={{ backgroundColor: 'skyblue' }}>
            {arr.map(i => {
                return <div key={i}>{i}</div>
            })}
            </TabContainerItem>
          </TabContainer>
*/
class TabContainer extends Component {
  constructor(props) {
    super(props)
    this.itemWidth = window.screen.width
    this.interval = props.interval || parseInt(this.itemWidth / 5)
    this.index = props.index || 0
    this.oldIndex = props.index || 0
  }

  componentWillReceiveProps(nextProps) {
    console.log('tabcontainer nextProps', nextProps)
    let { index } = nextProps
    if (this.index !== index) {
      this.index = index
      this.container.style.transform=`translateX(${-index*this.itemWidth}px)`
      // this.translate(-index * this.itemWidth, true)
    }
  }
  componentDidMount() {
    this.translate(-this.index * this.itemWidth)
    this.root.addEventListener('touchstart', this.slideStart)
    this.root.addEventListener('touchmove', this.slideMove)
    this.root.addEventListener('touchend', this.slideEnd)
  }
  componentWillUnmount() {
    this.root.removeEventListener('touchstart', this.slideStart)
    this.root.removeEventListener('touchmove', this.slideMove)
    this.root.removeEventListener('touchend', this.slideEnd)
  }
  slideStart = e => {
    this.startX = e.changedTouches[0].pageX
    this.startY = e.changedTouches[0].pageY
  }
  // 移动中
  slideMove = e => {
    let moveEndX = e.changedTouches[0].pageX
    let moveEndY = e.changedTouches[0].pageY
    let X = moveEndX - this.startX
    let Y = moveEndY - this.startY
    let distance = X - this.itemWidth * this.index
    if (!this.slideDirection || this.slideDirection === RIGHT || this.slideDirection === LEFT) {
      if (Math.abs(X) > Math.abs(Y) && X > 0) {
        // right
        event.preventDefault();
        // event.stopPropagation();
        console.log('右移')
        if (this.index !== 0) {
          this.translate(distance)
        }
        this.slideDirection = RIGHT
      }
      else if (Math.abs(X) > Math.abs(Y) && X < 0) {
        // left
        event.preventDefault();
        // event.stopPropagation();
        console.log('左移')
        if (this.index !== this.props.children.length - 1) {
          this.translate(distance)
        }
        this.slideDirection = LEFT
      }
      else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
        // down
        if (this.slideDirection) return
        this.slideDirection = DOWN
        console.log('向下')
      }
      else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
        // up 
        if (this.slideDirection) return
        this.slideDirection = TOP
        console.log('向上')
      }
    }
  }
  // 触摸结束
  slideEnd = e => {
    this.endX = e.changedTouches[0].pageX
    this.isTranslate()
  }

  /**
   * 实时移动
   *
   * @param {*} distance 移动距离
   * @param {*} transition 是否开启动画
   */
  translate = (distance, transition) => {
    let cssText = `
        ${transition ? 'transition: all 200ms;' : ''}
        transform:translateX(${distance}px)
    `
    this.container.style = cssText
    let { onTranslate } = this.props
    onTranslate && onTranslate({ distance, transition })
  }
  // 判断用户是查看上一页还是下一页, 并设置回弹效果
  isTranslate = () => {
    if (this.slideDirection === RIGHT || this.slideDirection === LEFT) {
      let { onSel } = this.props
      let distance = this.endX - this.startX
      let obj = {
        // 上一页
        'right':
          () => {
            if (this.index !== 0) {
              this.index--
            }
          },
        // 下一页
        'left': () => {
          if (this.index !== this.props.children.length - 1) {
            this.index++
          }
        }
      }
      // 滑动距离大于阀值  判断左右,跳转下一页 or 上一页
      if (Math.abs(distance) >= this.interval) {
        // 判断左右 跳转下一页
        console.log('上下页切换', this.index)
        obj[this.slideDirection]()
        onSel && onSel(this.index)
      }
      this.translate(-this.index * this.itemWidth, true)
    }
    this.slideDirection = null
  }

  render() {
    return <div className="tab-container-root" ref={node => {
      this.root = node
    }}>
      <ul className="tab-container" ref={node => {
        this.container = node
      }}>
        {this.props.children}
      </ul>
    </div>
  }
}
export default TabContainer
