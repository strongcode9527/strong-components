import React, { Component } from 'react'
import { render } from 'react-dom'
import { Scroll } from '../src'

const Sticky = Scroll.Sticky

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Scroll height={300}>
        <Sticky>
          <div>stick1</div>
        </Sticky>
        {
          new Array(50).fill(1).map((item, index) => (
            <div style={{textAlign: 'center'}}>
              strong{index}
            </div>
          ))
        }
        <Sticky>
          <div>stick2</div>
        </Sticky>
        {
          new Array(50).fill(1).map((item, index) => (
            <div style={{textAlign: 'center'}}>
              strong{index}
            </div>
          ))
        }
      </Scroll>
    )
  }
}

render(<App />, document.getElementById('root'))
