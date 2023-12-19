import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const App = () => {
  const [hasApiError, setHasApiError] = useState(false)
  const [projectsData, setProjectsData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState(categoriesList[0].id)

  const getProjects = async url => {
    setIsLoading(true)

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (!response.ok) throw new Error('Something went wrong')

      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      setProjectsData(updatedData)
      if (hasApiError) setHasApiError(false)
    } catch (error) {
      setHasApiError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const LoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  const FailureView = () => {
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`

    return (
      <div className="failure-container">
        <div className="inner-failure-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button type="button" onClick={getProjects(apiUrl)}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const baseUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    getProjects(baseUrl)
  }, [category])

  return (
    <div className="app-container">
      <div className="header">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png "
          alt="website logo"
        />
      </div>
      <div className="main-container">
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>

        {isLoading && <LoadingView />}
        {hasApiError && <FailureView />}
        {!isLoading && projectsData?.length !== 0 && (
          <ul className="project-list">
            {projectsData?.map(each => (
              <li key={each.id} className="project-item">
                <img src={each.imageUrl} alt={each.name} />
                <div className="project-name">
                  <p>{each.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
