import { useEffect, useRef, useState } from 'react'
import arrow from '/images/icon-arrow.svg'
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import axios from 'axios'
import cross from '/images/close.png'

function App() {
  const [userInput, setUserInput] = useState('')
  const [location, setLocation] = useState([22.3852, -81.5639])
  const [data, setData] = useState()
  const [submitInput, setSubmitInput] = useState()

  const ip6 = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|(:[0-9A-Fa-f]{1,4}){1,2}|:))|(([0-9A-Fa-f]{1,4}:){5}((:[0-9A-Fa-f]{1,4}){1,3}|(:[0-9A-Fa-f]{1,4}){1,3}|:))|(([0-9A-Fa-f]{1,4}:){4}((:[0-9A-Fa-f]{1,4}){1,4}|(:[0-9A-Fa-f]{1,4}){1,4}|:))|(([0-9A-Fa-f]{1,4}:){3}((:[0-9A-Fa-f]{1,4}){1,5}|(:[0-9A-Fa-f]{1,4}){1,5}|:))|(([0-9A-Fa-f]{1,4}:){2}((:[0-9A-Fa-f]{1,4}){1,6}|(:[0-9A-Fa-f]{1,4}){1,6}|:))|(([0-9A-Fa-f]{1,4}:){1}((:[0-9A-Fa-f]{1,4}){1,7}|(:[0-9A-Fa-f]{1,4}){1,7}|:))|(:((:[0-9A-Fa-f]{1,4}){1,8}|:)))(%.+)?$/
  const ip4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const domain = /^(?!-)([A-Za-z0-9-]{1,63}\.)*(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,63}$/

  const handleSubmit = (e) =>{
    e.preventDefault()
    setSubmitInput(userInput);
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
        const response = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_YzeV0kZi36zFEJ8TxUSKqa7cAO9yw&${domain.test(submitInput) ? 'domain=':'ipAddress='}${submitInput}`)
        setData(response.data)
        console.log(response.data)
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
              <button type='submit' className='btn'>{
                domain.test(userInput) || 
                ip4.test(userInput) ||
                ip6.test(userInput) ?
               ( <img src={arrow} alt="" />) :
                (<img src={cross} />)}</button>
            </form>
    
          <ul className="resultBar">
              <li className="resultDetails">
                <h3>ip address</h3>
                <p>192.212.174.101</p>
              </li>
              <li className="resultDetails">
                <h3>location</h3>
                <p>Brooklyn, NY 10001</p>
              </li>
              <li className="resultDetails">
                <h3>timezone</h3>
                <p>UTC -05:00</p>
              </li>
              <li className="resultDetails">
                <h3>isp</h3>
                <p>SpaceX Starlink</p>
              </li>
          </ul>
        </section>
        <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
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
