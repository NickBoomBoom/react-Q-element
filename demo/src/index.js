import React, { Component } from "react";
import { render } from "react-dom";
import TabContainer from "../../src/TabContainer/TabContainer";
import TabContainerItem from "../../src/TabContainerItem/TabContainerItem";

import ScrollView from "../../src/ScrollView/ScrollView";
import "./base.css";
import "./index.css";

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentList: [
        {
          title: "TabContainer && TabContainerItem",
          key: 1
        },
        {
          title: "ScrollView",
          key: 2
        }
      ],
      showKey: 1,
      currentIndex: 0,
      tabItemList: [1, 2, 3, 4, 5],
      navData: [
        {
          title: "nav1",
          key: 1
        },
        {
          title: "nav2",
          key: 2
        },
        {
          title: "nav3",
          key: 3
        },
        {
          title: "nav4",
          key: 4
        }
      ]
    };
  }

  render() {
    const {
      componentList,
      showKey,
      tabItemList,
      navData,
      currentIndex
    } = this.state;
    return (
      <div style={{ height: "100%" }}>
        <ul className="component-list">
          {componentList.map((item, index) => (
            <li
              className={`component-item ${showKey === item.key ? "sel" : ""}`}
              onClick={() =>
                this.setState({
                  showKey: item.key
                })
              }
              key={item.key}
            >
              {index + 1}: {item.title}
            </li>
          ))}
        </ul>

        {showKey === 1 && (
          <button
            onClick={()=>this.setState({
              currentIndex: currentIndex + 2
            })}
          >
            currentIndex+2
          </button>
        )}
        {showKey === 1 && (
          <TabContainer
            currentIndex={currentIndex}
            onSwitch={i => console.log("切换==>", i)}
            onTranslate={d => console.log("移动距离===>", d)}
          >
            {tabItemList.map((item, index) => {
              return (
                <TabContainerItem key={index} className="tab-item">
                  {index}
                </TabContainerItem>
              );
            })}
          </TabContainer>
        )}

        {showKey === 2 && <ScrollView />}
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
