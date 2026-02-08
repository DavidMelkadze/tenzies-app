import { useState, useRef, useEffect, use } from 'react'
import Die from './components/Die'
import './index.css'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {

  const [dice, setDice] = useState(() => generateAllNewDice())
  const [rollCount, setRollCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const buttonRef = useRef(null)

  const gameWon = dice.every(die => die.isHeld && die.value === dice[0].value)

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  useEffect(() => {
    if (gameStarted && !gameWon) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [gameStarted, gameWon])

  function generateAllNewDice() {
    return new Array(10).fill(0).map(() =>  ({ value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid()
    }))
  }

  function rollDice() {
    if(!gameWon) {
    setDice(prevDice => prevDice.map(die => (
     !die.isHeld ?
      {...die, value:Math.ceil(Math.random() * 6)} :
      die
    )))
    setRollCount(prevCount => prevCount + 1)
  }   else {
    setDice(generateAllNewDice())
    setRollCount(0)
    setTimer(0)
    setGameStarted(false)
  }
  }

  function hold(id) {
    setDice(prevDice => prevDice.map(die => (
      id === die.id ? 
      {...die, isHeld: !die.isHeld} :
      die
    )))

    setGameStarted(true)
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
        {gameWon && <Confetti />}
        <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
        <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="stats">
          <p>🎲 Rolls: {rollCount}</p>
          <p>⏱️ Time: {timer} seconds</p>
        </div>
        <div className="dice-container">
          {diceElements}
        </div>

        <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
          {gameWon ? "New Game" : "Roll Dice"}
        </button>

      </main>
    </>
  )
}


