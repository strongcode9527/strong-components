import React, { Component } from 'react'
import { render } from 'react-dom'
import { Scroll } from '../src'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Scroll height={300}>
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
