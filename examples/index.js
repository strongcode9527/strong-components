import React, { Component } from 'react'
import { render } from 'react-dom'
import Refresh from '../src/refresh'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Refresh height={300}>
        <div>
          asdfasdfasddfasdfasdfasdfasdfasdf
        </div>
      </Refresh>
    )
  }
}

render(<App />, document.getElementById('root'))