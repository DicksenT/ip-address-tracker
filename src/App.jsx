import { useEffect, useRef, useState } from 'react'
import arrow from '/images/icon-arrow.svg'
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import axios from 'axios'
import cross from '/images/close.png'

function App() {
  const [userInput, setUserInput] = useState('')
  const [location, setLocation] = useState([34.04779, -118.24118])
  const [data, setData] = useState()
  const [submitInput, setSubmitInput] = useState()

  const ip6 = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|(:[0-9A-Fa-f]{1,4}){1,2}|:))|(([0-9A-Fa-f]{1,4}:){5}((:[0-9A-Fa-f]{1,4}){1,3}|(:[0-9A-Fa-f]{1,4}){1,3}|:))|(([0-9A-Fa-f]{1,4}:){4}((:[0-9A-Fa-f]{1,4}){1,4}|(:[0-9A-Fa-f]{1,4}){1,4}|:))|(([0-9A-Fa-f]{1,4}:){3}((:[0-9A-Fa-f]{1,4}){1,5}|(:[0-9A-Fa-f]{1,4}){1,5}|:))|(([0-9A-Fa-f]{1,4}:){2}((:[0-9A-Fa-f]{1,4}){1,6}|(:[0-9A-Fa-f]{1,4}){1,6}|:))|(([0-9A-Fa-f]{1,4}:){1}((:[0-9A-Fa-f]{1,4}){1,7}|(:[0-9A-Fa-f]{1,4}){1,7}|:))|(:((:[0-9A-Fa-f]{1,4}){1,8}|:)))(%.+)?$/
  const ip4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const domain = /^(?!-)([A-Za-z0-9-]{1,63}\.)*(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,63}$/

  const handleSubmit = (e) =>{
    e.preventDefault()
    const isValid = domain.test(userInput) || ip4.test(userInput) ||ip6.test(userInput)
    if(isValid){
      setSubmitInput(userInput)
    }
  }

  const ChangeView = ({center}) =>{
    const map = useMap()
    useEffect(() =>{
      if(center){
      map.flyTo(center, 13)
      }
    },[map, center])
    return null
  }

  useEffect(() =>{
    const data = async() =>{
    try{
        const response = await axios.get('https://api.ipify.org?format=json')
        setSubmitInput(response.data.ip)
      }
    catch(error){
      console.error(error);
    }
  }
    data()
  },[])

  useEffect(() =>{
    const data = async() =>{
      try{
        const response = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_gZk61zSRXBeMR3DntHsWhFcS95ix7&${domain.test(submitInput) ? 'domain=':'ipAddress='}${submitInput}`)
        setData(response.data)
        setLocation([response.data.location.lat, response.data.location.lng])
      }
      catch(error){
        console.error(error);
      }

    }
    data()
  },[submitInput])

  

  useEffect(() =>{
    setData(data)
    console.log(data)
  },[data])

  return (
    <div className='mainApp'>
      <main>
        <section className="userInput" >
          <h1 className="title">IP Address Tracker</h1>
            <form action="" onSubmit={handleSubmit} className='inputForm'>
              <input className='input' type="text" 
              placeholder='Search for any IP address or domain' 
              onChange={(e) => setUserInput(e.currentTarget.value)}
              value={userInput}/>
              {
                domain.test(userInput) || 
                ip4.test(userInput) ||
                ip6.test(userInput) ?
               (<button type='submit' className='btn acceptBtn'> <img src={arrow} alt="" /> </button>) :
                (<button type='submit' className='btn declineBtn'><img src={cross} /></button>)}
            </form>
    
          {data && (<ul className="resultBar">
              <li className="resultDetails">
                <h3>ip address</h3>
                <p>{data.ip}</p>
              </li>
              <li className="resultDetails">
                <h3>location</h3>
                <p>{data.location.region}, {data.location.country} {data.location.postalCode}</p>
              </li>
              <li className="resultDetails">
                <h3>timezone</h3>
                <p>UTC {data.location.timezone}</p>
              </li>
              <li className="resultDetails" style={{padding: 0, border: 'none'}}>
                <h3>isp</h3>
                <p className='isp'>{data.isp}</p>
              </li>
          </ul>)}
        </section>
        <MapContainer center={location} zoom={0} scrollWheelZoom={true}>
          <ChangeView center={location} zoom={12}/>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
          </Marker>
        </MapContainer>
      </main>
    </div>
  )
}

export default App
