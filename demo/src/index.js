import React, { Component } from 'react'
import { render } from 'react-dom'
import TabContainer from '../../src/TabContainer/TabContainer'
import TabContainerItem from '../../src/TabContainerItem/TabContainerItem'
import NavBar from '../../src/NavBar/NavBar'
import ScrollView from '../../src/ScrollView/ScrollView'
import AutoScrollTab from '../../src/AutoScrollTab/AutoScrollTab'
import './base.css'


class Demo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      list: [1, 2, 3, 4, 5, 6, 7, 8, 88],
      TabContainerIndex: 0,
      navIndex: 0,
      currentData: [
        { list: [], pageNo: 1, pageTotal: null, requestState: false },  // allLiST
        { list: [], pageNo: 1, pageTotal: null, requestState: false },  // payList
        { list: [], pageNo: 1, pageTotal: null, requestState: false },  // sendList
        { list: [], pageNo: 1, pageTotal: null, requestState: false }   // receiptList
      ]
    }
  }

  render() {
    let { arr, list, TabContainerIndex, NavBarTranslate, requestState, isLoadOver, isLoadOver3, navIndex, currentData } = this.state
    let data = [{ name: '标题1', type: 1 }, { name: '标题2', type: 2 }, { name: '标题3', type: 3 }]
    const test = [
      { name: '分类', type: 1 },
      { name: '品牌馆', type: 2 }
    ]


    // console.log(list)
    return <div>
      {
        true && <div>
          <NavBar
            translate={NavBarTranslate}
            onSel={(item, index) => {
              console.log('navitem', index)
              this.setState({
                TabContainerIndex: index
              })
            }}
            index={TabContainerIndex}
            isAnimate={true}
          >
            <span>首页</span>
            <span>购物车</span>
            <span>我的</span>
            <span>分类</span>
          </NavBar>
          <ScrollView
                
                  style={{ backgroundColor: `blue`}}
                  reLoad={currentData[0].list.length === 0}
                  isPullDown={true}
                  isPullUp={true}
                  topMethod={() => {
                    console.log('刷新操作')
                    currentData[0].list = [1, 2, 4]
                    currentData[0].requestState = true
                    setTimeout(() => {
                      this.setState({
                        currentData
                      })
                    }, 2000);


                  }}
                  wrapHeight={500}
                  requestState={currentData[0].requestState}
                  bottomMethod={() => {
                    console.log('上拉加载')
                  }}
                isLoadOver={true}
                >
                  {
                    currentData[0].list.map((item, index) => {
                      return <div key={index} style={{ width: '100%', height: '50px' }}>{item}</div>
                    })
                  }

                </ScrollView>

          {/* <ScrollView
            scrollX={true}
            itemIndex={TabContainerIndex}
          >
            {
              currentData.map((c, ci) => {
                // let reLoad = TabContainerIndex === ci && c.list.length === 0

                return <ScrollView
                  key={ci}
                  style={{ backgroundColor: `${ci % 2 === 0 ? 'red' : 'blue'}`}}
                  reLoad={true}
                  isPullDown={true}
                  isPullUp={true}
                  topMethod={() => {
                    console.log('刷新操作')
                    c.list = [1, 2, 4]
                    c.requestState = true
                    setTimeout(() => {
                      this.setState({
                        currentData
                      })
                    }, 2000);


                  }}
                  wrapHeight={500}
                  requestState={c.requestState}
                  bottomMethod={() => {
                    console.log('上拉加载')
                  }}
                isLoadOver={true}
                >
                  {
                    c.list.map((item, index) => {
                      return <div key={index} style={{ width: '100%', height: '50px' }}>{item}</div>
                    })
                  }

                </ScrollView>

              })
            }



          </ScrollView> */}





        </div>
      }


      {/* <ScrollView
        scrollX={true}
        itemIndex={navIndex}
      >
        <div style={{ width: '375px', height: '100px', backgroundColor: 'skyblue' }} key={'test1'}>
          测试1
        </div>
        <div style={{ width: '375px', height: '100px', backgroundColor: 'green' }} key={'test2'}>
          测试2
        </div>
        <div style={{ width: '375px', height: '100px', backgroundColor: 'yellow' }}>
          测试3
        </div>
      </ScrollView> */}



    </div>
  }
}

render(<Demo />, document.querySelector('#demo'))
