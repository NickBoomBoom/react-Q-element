import React, { Component } from "react";
import { render } from "react-dom";
import TabContainer from "../../src/TabContainer/TabContainer";
import TabContainerItem from "../../src/TabContainerItem/TabContainerItem";
import NavBar from "../../src/NavBar/NavBar";
import ScrollView from "../../src/ScrollView/ScrollView";
import AutoScrollTab from "../../src/AutoScrollTab/AutoScrollTab";
import "./base.css";

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      list: [1, 2, 3, 4, 5, 6, 7, 8, 88],
      TabContainerIndex: 0,
      navIndex: 0,
      currentData: [
        { list: [], pageNo: 1, pageTotal: null, requestState: false }, // allLiST
        { list: [], pageNo: 1, pageTotal: null, requestState: false }, // payList
        { list: [], pageNo: 1, pageTotal: null, requestState: false }, // sendList
        { list: [], pageNo: 1, pageTotal: null, requestState: false } // receiptList
      ]
    };
  }

  render() {
    let {
      arr,
      list,
      TabContainerIndex,
      NavBarTranslate,
      requestState,
      isLoadOver,
      isLoadOver3,
      navIndex,
      currentData
    } = this.state;
    let data = [
      { name: "标题1", type: 1 },
      { name: "标题2", type: 2 },
      { name: "标题3", type: 3 }
    ];
    const test = [{ name: "分类", type: 1 }, { name: "品牌馆", type: 2 }];
    return (
      <div>
        {/* Scroll-View */}
        {true && (
          <ScrollView
            isFetch={true}
            scrollY={true}
            isPullDown={true}
            isPullUp={true}
            topMethod={() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState(
                    {
                      list: list.reverse(),
                      requestState: true
                    },
                    () => {
                      resolve();
                    }
                  );
                }, 2000);
              });
            }}
            requestState={requestState}
            bottomMethod={() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState(
                    {
                      list: [
                        ...list,
                        "我是节点1",
                        "我是节点2",
                        ...list,
                        "节点3",
                        "节点4"
                      ],
                      requestState: true,
                      isLoadOver: "全部加载完毕"
                    },
                    () => {
                      resolve();
                    }
                  );
                }, 1000);
              });
            }}
            onUpper={() => {
              console.warn("到顶了");
            }}
            onLower={() => {
              console.warn("到底了");
            }}
            onScroll={obj => {
              console.warn("无时无刻不在触发", obj);
            }}
            isLoadOver={isLoadOver}
          >
            {list.map((item, index) => {
              return (
                <div
                  style={{
                    height: "50px",
                    lineHeight: "50px",
                    backgroundColor: "red",
                    textAlign: "center"
                  }}
                  key={"item" + index}
                >
                  {item}
                </div>
              );
            })}
          </ScrollView>
        )}
        {/* NavBar */}
        {false && (
          <div>
            <h6>NavBar</h6>
            <hr />
            <NavBar
              translate={NavBarTranslate}
              onSel={(item, index) => {
                console.log("选中 Tab", index);
                this.setState({
                  TabContainerIndex: index
                });
              }}
              index={TabContainerIndex}
              isAnimate={true}
            >
              <span>首页</span>
              <span>购物车</span>
              <span>我的</span>
              <span>分类</span>
            </NavBar>
          </div>
        )}
        <br />
        {/* AutoScrollTab */}
        {false && (
          <div>
            <h6>AutoScrollTab</h6>
            <hr />
            <AutoScrollTab>
              {list.map(item => {
                return <p> 标题{item}</p>;
              })}
            </AutoScrollTab>
          </div>
        )}
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
