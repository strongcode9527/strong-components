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
          <div>asdfasdf</div>
        </Sticky>
        {
          new Array(100).fill(1).map((item, index) => (
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
