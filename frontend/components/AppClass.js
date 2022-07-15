import React from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const coordinates = [
  {x:1, y:1}, {x:2, y:1}, {x:3, y:1},
  {x:1, y:2}, {x:2, y:2}, {x:3, y:2},
  {x:1, y:3}, {x:2, y:3}, {x:3, y:3}
]

export default class AppClass extends React.Component {
  
  state = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  }

  getXY = () => {
    const currentCoor = []
    for(let i = 0; i<coordinates.length; i++){
      if(this.state.index === i){
        currentCoor.push(coordinates[i])
      }
    }
    return currentCoor[0]
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    return `Coordinates (${this.getXY().x}, ${this.getXY().y})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    })
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    if(direction === "left" && this.getXY().x !== 1){
      this.setState({
        index: this.state.index - 1, 
        message: "",
        steps: this.state.steps + 1
      })
    }
    else if(direction === "left" && this.getXY().x === 1){
      this.setState({
        message: "You can't go left"
      })
      // return this.state.index
    }
    else if(direction === "right" && this.getXY().x !== 3){
      this.setState({
        index: this.state.index + 1,
        message: "",
        steps: this.state.steps + 1
      })
    }
    else if(direction === "right" && this.getXY().x === 3){
      this.setState({
        message: "You can't go right"
      })
    }
    else if(direction === "up" && this.getXY().y !== 1){
      this.setState({
        index: this.state.index - 3,
        message: "",
        steps: this.state.steps + 1
      })
    }
    else if(direction === "up" && this.getXY().y === 1){
      this.setState({
        message: "You can't go up"
      })
    }
    else if(direction === "down" && this.getXY().y !== 3){
      this.setState({
        index: this.state.index + 3,
        message: "",
        steps: this.state.steps + 1
      })
    }
    else if(direction === "down" && this.getXY().y === 3){
      this.setState({
        message: "You can't go down"
      })
    }
    
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    this.getNextIndex(evt.target.id)
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const { value } = evt.target
    this.setState({
      email: value
  })
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    axios.post("http://localhost:9000/api/result", { x: this.getXY().x, y: this.getXY().y, steps: this.state.steps, email: this.state.email })
    .then(res => {
      console.log(res)
      this.setState({
        message: res.data.message
      })
    })
    .catch(err => {
        console.log(err.response.data.message)
      this.setState({
        message: err.response.data.message
      })
    })
    .finally(
      this.setState({
        email: ""
      }),
    )
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{this.state.steps === 1 ? `You moved ${this.state.steps} time` : `You moved ${this.state.steps} times`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} value={this.state.email} id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
