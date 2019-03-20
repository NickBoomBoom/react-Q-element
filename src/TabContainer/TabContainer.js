import React, { Component } from "react";
import { getAttr, getTouchDirection } from "../utils/index";
import "./TabContainer.css";
import { TOUCH_RIGHT, TOUCH_LEFT } from "../const/index";

/*  接受参数: 
      interval : 触发切页动画 阀值 默认50
      currentIndex : 默认0 展示第几页 Number
      onSwitch: 页面切换回调函数  返回index  Function
      onTranslate: 回调函数 配合 Navbar 做 bar 联动, 返回一个对象 {
        distance:  Number // 移动距离
        transition: Boolean // 是否开启 transition 动画
      }
*/
class TabContainer extends Component {
  // this.container 根盒子
  // this.wrapper 子盒子
  constructor(props) {
    super(props);
    this.interval = props.interval || 50; // 触发阀值
    this.currentIndex = props.currentIndex || 0; // 当前下标
    this.animationTime = props.animationTime || 200; // 动画效果时间
  }

  componentWillReceiveProps(nextProps) {
    const { currentIndex } = nextProps;
    const { onTranslate } = this.props;
    if (this.currentIndex !== currentIndex) {
      this.currentIndex = currentIndex;
      const distance =-this.currentIndex * this.containerWidth
      onTranslate &&
        onTranslate({ distance  });
      this.translate(distance);
    }
  }

  componentDidMount() {
    this.translate(-this.currentIndex * this.containerWidth);
    this.container.addEventListener("touchstart", this.slideStart);
    this.container.addEventListener("touchmove", this.slideMove);
    this.container.addEventListener("touchend", this.slideEnd);
  }
  componentWillUnmount() {
    this.container.removeEventListener("touchstart", this.slideStart);
    this.container.removeEventListener("touchmove", this.slideMove);
    this.container.removeEventListener("touchend", this.slideEnd);
  }

  slideStart = e => {
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;
  };
  // 移动中
  slideMove = e => {
    e.preventDefault();
    const moveEndX = e.changedTouches[0].pageX;
    const moveEndY = e.changedTouches[0].pageY;
    const X = moveEndX - this.startX;
    const Y = moveEndY - this.startY;
    const distance = X - this.containerWidth * this.currentIndex;

    // 判断方向
    this.slideDirection = getTouchDirection(X, Y);

    // 右滑
    if (this.slideDirection === TOUCH_RIGHT) {
      this.currentIndex !== 0 && this.translate(distance);
    }

    // 左滑
    if (this.slideDirection === TOUCH_LEFT) {
      const { children } = this.props;
      this.currentIndex !== children.length - 1 && this.translate(distance);
    }
  };
  // 触摸结束
  slideEnd = e => {
    this.endX = e.changedTouches[0].pageX;
    this.isTranslate();
  };

  /**
   * 实时移动
   *
   * @param {*} distance 移动距离
   * @param {*} transition 是否开启动画
   */
  translate = (distance, transition) => {
    const { onTranslate } = this.props;
    const cssText = `
    ${transition ? `transition: all ${this.animationTime}ms;` : ""}
    transform:translateX(${distance}px)
    `;
    this.wrapper.style = cssText;
    onTranslate && onTranslate({ distance, transition });
  };

  // 判断用户是查看上一页还是下一页, 并设置回弹效果
  isTranslate = () => {
    if (
      this.slideDirection === TOUCH_RIGHT ||
      this.slideDirection === TOUCH_LEFT
    ) {
      const { onSwitch, children } = this.props;
      const distance = this.endX - this.startX;
      const OO = {
        TOUCH_RIGHT: () => {
          this.currentIndex !== 0 && this.currentIndex--;
        },
        TOUCH_LEFT: () => {
          this.currentIndex !== children.length - 1 && this.currentIndex++;
        }
      };
      // 滑动距离大于阀值  判断左右,跳转下一页 or 上一页
      if (Math.abs(distance) >= this.interval) {
        // 判断左右 跳转下一页
        OO[this.slideDirection]();
        onSwitch && onSwitch(this.currentIndex);
      }
      this.translate(-this.currentIndex * this.containerWidth, true);
    }
  };

  getNode = e => {
    if (!e) return;
    this.container = e;
    this.containerWidth = parseInt(getAttr(e).width);
  };

  render() {
    const { children } = this.props;
    return (
      <div className="tab-container-root" ref={this.getNode}>
        <ul
          ref={node => node && (this.wrapper = node)}
          className="tab-container-ul"
        >
          {children}
        </ul>
      </div>
    );
  }
}
export default TabContainer;
