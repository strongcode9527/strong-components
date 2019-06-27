import React, { Component } from 'react';
import { render } from 'react-dom';
import { Scroll } from '../src';

const Sticky = Scroll.Sticky;


function Fixed() {
  return (
    <div>strong</div>
  );
}

class App extends Component {
  handleRefreshCallback = (resolve, reject, promise) => {
    console.log('in refresh')
    setTimeout(() => {
      resolve('a');
      console.log('after reslove')
    }, 1000);
  };
  render() {
    return (
      <Scroll height={300} onRefresh={this.handleRefreshCallback} hasLoading={true} GotoTop={() => (<div>
        strong
      </div>)}>
        <Sticky>
          <Fixed />
        </Sticky>
        {
          new Array(50).fill(1).map((item, index) => (
            <div style={{ textAlign: 'center' }} key={index}>
              strong{index}
            </div>
          ))
        }
        <Sticky>
          <div>stick2</div>
        </Sticky>
        {
          new Array(50).fill(1).map((item, index) => (
            <div style={{ textAlign: 'center' }} key={index}>
              strong{index}
            </div>
          ))
        }
      </Scroll>
    );
  }
}

render(<App />, document.getElementById('root'));
