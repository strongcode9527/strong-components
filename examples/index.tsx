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
        <div>
          asdfasdfasddfasdfasdfasdfasdfasdf
        </div>
        <div>
          strong
        </div>
      </Scroll>
    )
  }
}

render(<App />, document.getElementById('root'))