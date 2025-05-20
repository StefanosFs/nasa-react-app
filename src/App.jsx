import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  function handleToggleModal() {
    setShowModal(!showModal)
    // Prevent body scroll when modal is open
    document.body.style.overflow = !showModal ? 'hidden' : 'auto'
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_KEY}`

      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`

      try {
        setLoading(true)
        setError(null)

        if (localStorage.getItem(localKey)) {
          const apiData = JSON.parse(localStorage.getItem(localKey))
          setData(apiData)
          console.log('Fetched from cache today')
          return
        }

        localStorage.clear()
        const res = await fetch(url)
        
        if (!res.ok) {
          throw new Error('Failed to fetch data from NASA API')
        }

        const apiData = await res.json()
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData)
        console.log('Fetched from API today')
      } catch (err) {
        console.error(err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAPIData()

    // Cleanup function to reset body overflow
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      {loading ? (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      ) : error ? (
        <div className="loadingState">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : data ? (
        <>
          <Main data={data} />
          {showModal && (
            <SideBar data={data} handleToggleModal={handleToggleModal} />
          )}
          <Footer data={data} handleToggleModal={handleToggleModal} />
        </>
      ) : null}
    </>
  )
}

export default App

