import SetYear from "./SetYear"

const Authors = (props) => {
  if (!props.show) {
    return null
  }
  const authors = props.authors ? props.authors : []

  return (
    <div>
      <h2>All authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetYear authors={authors} />
    </div>
  )
}

export default Authors
