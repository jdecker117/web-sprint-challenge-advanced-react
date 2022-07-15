import React, {useState} from 'react'
import axios from 'axios'

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

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    const coolArr = []
    for(let i = 0; i<coordinates.length; i++){
      if(index === i){
        coolArr.push(coordinates[i])
      }
    }
    return coolArr[0];
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }
  function getXYMessage() {
    return `Coordinates (${getXY().x}, ${getXY().y})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setEmail(initialEmail);
    setIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(initialSteps);
  }

  function getNextIndex(direction) {
    if(direction === "left" && getXY().x !== 1){
      setIndex(index - 1)
      setMessage("") 
      setSteps(steps + 1)
    }
    else if(direction === "left" && getXY().x === 1){
      setMessage("You can't go left")
    }
    else if(direction === "right" && getXY().x !== 3){
      setIndex(index + 1)
      setMessage("") 
      setSteps(steps + 1)
    }
    else if(direction === "right" && getXY().x === 3){
      setMessage("You can't go right")
    }
    else if(direction === "up" && getXY().y !== 1){
      setIndex(index - 3)
      setMessage("") 
      setSteps(steps + 1)
    }
    else if(direction === "up" && getXY().y === 1){
      setMessage("You can't go up")
    }
    else if(direction === "down" && getXY().y !== 3){
      setIndex(index + 3)
      setMessage("") 
      setSteps(steps + 1)
    }
    else if(direction === "down" && getXY().y === 3){
      setMessage("You can't go down")
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    getNextIndex(evt.target.id)
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    const { value } = evt.target
    setEmail(value);
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault()
    axios.post("http://localhost:9000/api/result", { x: getXY().x, y: getXY().y, steps: steps, email: email })
    .then(res => {
      console.log(res)
      setMessage(res.data.message)
    })
    .catch(err => {
        console.log(err.response.data.message)
        setMessage(err.response.data.message)
    })
    .finally(
      setEmail("")
    )
    // Use a POST request to send a payload to the server.
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{steps === 1 ? `You moved ${steps} time` : `You moved ${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset}id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} id="email" type="email" value={email} placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
