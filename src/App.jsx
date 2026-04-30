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
      // Use environment variable or fallback to DEMO_KEY for development
      const NASA_API = import.meta.env.VITE_NASA_API || 'DEMO_KEY'
      console.log('Environment check:', {
        hasApiKey: !!NASA_API,
        envKeys: Object.keys(import.meta.env),
        isProd: import.meta.env.PROD,
        apiKeyType: NASA_API === 'DEMO_KEY' ? 'Using DEMO_KEY' : 'Using custom key'
      })

      const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_API}&thumbs=true`
      console.log('Attempting to fetch from:', url.replace(NASA_API, '***'))

      const today = (new Date()).toDateString()
      const localKey = `NASA-v2-${today}`

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
        console.log('Fetch response status:', res.status)
        
        if (!res.ok) {
          const errorText = await res.text()
          console.error('API Error Response:', errorText)
          if (res.status === 403) {
            throw new Error('Invalid or missing API key. Please check your environment variables.')
          }
          throw new Error(`Failed to fetch data from NASA API: ${res.status} ${res.statusText}`)
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

