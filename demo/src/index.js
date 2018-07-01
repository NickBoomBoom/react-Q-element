import React, { Component } from 'react'
import { render } from 'react-dom'
import TabContainer from '../../src/TabContainer/TabContainer'
import TabContainerItem from '../../src/TabContainerItem/TabContainerItem'
import NavBar from '../../src/NavBar/NavBar'
import ScrollView from '../../src/ScrollView/ScrollView'
import './base.css'


class Demo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      list: [1, 2, 3, 4, 5, 6, 7, 8, 88],
      TabContainerIndex: 0
    }
  }

  render() {
    let { arr, list, TabContainerIndex, NavBarTranslate, requestState, isLoadOver, isLoadOver3 } = this.state
    let data = [{ name: '标题1', type: 1 }, { name: '标题2', type: 2 }, { name: '标题3', type: 3 }]
    // console.log(list)
    return <div>
      <NavBar
       translate={NavBarTranslate}
        onSel={(item, index) => {
          console.log('navitem', index)
        }}
        navData={data}
        index={TabContainerIndex}
      >
       
      </NavBar>
      <NavBar
        translate={NavBarTranslate}
        onSel={(item, index) => {
          console.log('navitem', index)
          this.setState({
            TabContainerIndex: index
          })
        }}
        index={TabContainerIndex}
      >
        <span>首页</span>
        <span>购物车</span>
        <span>我的</span>
      </NavBar>
      <TabContainer
        index={TabContainerIndex}
        onSel={index => {
          this.setState({
            TabContainerIndex: index
          })
        }}
        onTranslate={obj => {
          this.setState({
            NavBarTranslate: obj
          })
        }}

      >
        <TabContainerItem style={{ fontSize: '20px', backgroundColor: 'red', lineHeight: '100px', height: '500px' }}>
          <ScrollView
            isFetch={true}
            // scrollX={true}
            isPullDown={true}
            isPullUp={true}
            topMethod={() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {

                  this.setState({ list: list.reverse(), requestState: true }, () => {
                    resolve()
                  })
                }, 2000);
              })
            }}
            requestState={requestState}
            bottomMethod={() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState({
                    list: [...list, '我是节点1', '我是节点2', ...list, '节点3', '节点4'],
                    requestState: true,
                    isLoadOver: '全部加载完毕'
                  }, () => {
                    resolve()
                  })
                }, 1000);
              })
            }}
            onUpper={() => {
              console.warn('到顶了')
            }}
            onLower={() => {
              console.warn('到底了')
            }}
            onScroll={obj => {
              console.warn('无时无刻不在触发', obj)
            }}
            isLoadOver={isLoadOver}
          >
            {list.map((item, index) => {
              return <div style={{ height: '50px', lineHeight: '50px', backgroundColor: 'red', textAlign: 'center' }} key={'item' + index}>
                {item}
              </div>
            })}
          </ScrollView>
        </TabContainerItem>
        <TabContainerItem style={{ backgroundColor: 'yellow', lineHeight: '50px', height: '500px' }}>
          {arr.map(i => {
            return <div key={i}>{i}</div>
          })}
        </TabContainerItem>
        <TabContainerItem style={{ backgroundColor: 'skyblue', lineHeight: '30px', height: '500px' }}>
          <ScrollView
            // scrollX={true}
            isPullDown={true}
            isPullUp={true}
            topMethod={() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState({ arr: arr.reverse(), requestState: true }, () => {
                    resolve()
                  })
                }, 2000);
              })
            }}
            requestState={requestState}
            bottomMethod={() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState({
                    arr: [...arr, '我是节点1', '我是节点2', ...arr, '节点3', '节点4'],
                    requestState: true,
                    isLoadOver3: '第三个加载完成'
                  }, () => {
                    resolve()
                  })
                }, 1000);
              })
            }}
            onUpper={() => {
              console.warn('到顶了')
            }}
            onLower={() => {
              console.warn('到底了')
            }}
            onScroll={obj => {
              console.warn('无时无刻不在触发', obj)
            }}
            isLoadOver={isLoadOver3}
          >
            {arr.map((item, index) => {
              return <div style={{ height: '50px', lineHeight: '50px', textAlign: 'center' }} key={'item' + index}>
                {item}
              </div>
            })}
          </ScrollView>
        </TabContainerItem>

      </TabContainer>




    </div>
  }
}

render(<Demo />, document.querySelector('#demo'))
