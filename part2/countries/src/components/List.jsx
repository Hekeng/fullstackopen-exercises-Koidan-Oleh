import { ShowCountry } from './ShowCountry'

export const List = ({ countries, selectedCoutry, setSelectedCoutry }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length <= 10 && countries.length > 1) {
    if (selectedCoutry === undefined) {
      return (
        <ul>
          {countries.map((item) => (
            <li key={item.name.common}>
              {item.name.common}{' '}
              <button
                onClick={() => {
                  setSelectedCoutry(item)
                }}
              >
                Show
              </button>
            </li>
          ))}
        </ul>
      )
    } else {
      return <ShowCountry country={selectedCoutry} />
    }
  } else if (countries.length === 1) {
    return <ShowCountry country={countries[0]} />
  } else {
    return <div>No matches found, please try again</div>
  }
}
