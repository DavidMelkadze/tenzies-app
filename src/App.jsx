import { useState } from 'react'
import Die from './components/Die'
import './index.css'
import { nanoid } from 'nanoid'

export default function App() {

  const [dice, setDice] = useState(generateAllNewDice())

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() =>  ({ value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid()
    }))
  }

  function rollDice() {
    setDice(prevDice => prevDice.map(die => (
     !die.isHeld ?
      {...die, value:Math.ceil(Math.random() * 6)} :
      die
    )))
  }

  function hold(id) {
    setDice(prevDice => prevDice.map(die => (
      id === die.id ? 
      {...die, isHeld: !die.isHeld} :
      die
    )))
  }

  const diceElements = dice.map(dieObj => 
            <Die 
                key={dieObj.id} 
                value={dieObj.value} 
                isHeld={dieObj.isHeld} 
                hold={() => hold(dieObj.id)}
            />)

  return (
    <>
      <main>
        <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElements}
        </div>

        <button className="roll-dice" onClick={rollDice}>
          Roll Dice
        </button>

      </main>
    </>
  )
}


