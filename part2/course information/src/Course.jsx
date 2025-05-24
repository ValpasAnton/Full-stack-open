const Content = (props) => {
  const allParts = props.parts.map(part => <Part key={part.id} part={part}></Part>)
  return (
  <div>
    <p><strong>Contents</strong></p>
    {allParts}
  </div>
)
}
const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)
const Total = (props) => {
  const totalExercises = props.parts.reduce((sum, part) => sum + part.exercises, 0);
  console.log(totalExercises);

  return (
    <p><strong>Total number of exercises {totalExercises}</strong></p>
  )
}

const Course = (props) => (
  <div>
    <h2> {props.course.name} </h2>
    <Content parts={props.course.parts} />
    <Total
        parts={props.course.parts
        }
      />
    
  </div>
)

export default Course;