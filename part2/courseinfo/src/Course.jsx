export const Course = ({ course }) => {
  return (
    <>
      <Header headerName={course.name} />
      <Content courseData={course.parts} />
      <Total courseData={course.parts} />
    </>
  )
}

export const Header = ({ headerName }) => {
  return <h2>{headerName}</h2>
}

export const Content = ({ courseData }) => {
  return (
    <>
      {courseData.map((part) => {
        return <Part key={part.id} courseData={part} />
      })}
    </>
  )
}

export const Part = ({ courseData }) => {
  return (
    <p>
      {courseData.name} {courseData.exercises}
    </p>
  )
}

export const Total = ({ courseData }) => {
  const total = courseData.reduce((acc, part) => acc + part.exercises, 0)

  return <strong>total of {total} exercises</strong>
}

export const Courses = ({ courses }) => {
  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map((course) => {
        return <Course key={course.name} course={course} />
      })}
    </>
  )
}
