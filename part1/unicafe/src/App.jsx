import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = () => good+bad+neutral
  const average = () => (good+bad*(-1))/(total()); 
  const positive = () => (good/(total())*100) ;
  if (total()===0) { return (
    <p>No feedback</p>
  )} 
  return (
  <div>
    <header>Statistics:</header>
    <table>
      <tbody>
        <StatisticLine text = 'good' value = {good}></StatisticLine>
        <StatisticLine text = 'neutral' value = {neutral}></StatisticLine>
        <StatisticLine text = 'bad' value = {bad}></StatisticLine>
        <StatisticLine text = 'average' value = {average()}></StatisticLine>
        <StatisticLine text = 'positive' value = {`${positive().toFixed(1)} %`}></StatisticLine>
      </tbody>
    </table>   
  </div>
    );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <header>Give feedback</header>
      <button onClick={() => {
        setGood(good+1);
        console.log('good clicked');}}> good </button>
      <button onClick={() => {
        setNeutral(neutral+1);
        console.log('neutral clicked');}}> neutral </button>
      <button onClick={() => {
        setBad(bad+1);
        console.log('bad clicked');}}> bad </button>
      <p></p>
      <Statistics good={good} neutral={neutral} bad={bad} ></Statistics>
    </div>
  )
}

export default App
