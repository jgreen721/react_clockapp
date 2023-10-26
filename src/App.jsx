import { useState,useEffect, useRef } from 'react'
import { quotesAPIUrl, sunIcon,arrowUpIcon,refreshIcon, bgImageNighttime,bgImageDaytime,bgMobileImageNighttime,bgMobileImageDaytime,bgTabletImageDaytime,bgTabletImageNighttime, moonIcon } from './const'
import './App.css'

function App() {
  const [showInfo,setShowInfo] = useState(false)
  const [isDay,setIsDay] = useState(false)

    const [quote,setQuote] = useState({quote:"Whatever you do in life, surround yourself with smart people who'll argue with you",author:"John Wooden"})
    const [dayOfYear,setDayOfYear] = useState(0)
    const [dayOfWeek,setDayOfWeek] = useState(0)
    const [curWeek,setCurWeek] = useState(0)
    const [curHour,setCurHour] = useState(new Date().toLocaleTimeString().split(":")[0])
    const [curMinute,setCurMinute] = useState(new Date().toLocaleTimeString().split(":")[1])
    const [greeting,setGreeting] = useState({greeting:"Good morning",icon:sunIcon});
    const [timeZone,setTimeZone] = useState("California, US")
    const [location,setLocation] = useState("Los Angeles,US")
    const APIKEY="ipb_live_ePBubTZSZcigrSKezY91ix2NpskHnm7lAAE1uOZR"
    const locationURL = `https://api.ipbase.com/v2/info`;
    const appRef = useRef();

    

  useEffect(()=>{
    //Fetch state data

    console.log("fetching data...");
    fetchQuote();
    fetchLocation();

    setDayOfYear(findDayOfTheYear(new Date()))
    setDayOfWeek(getDay());
    setCurWeek(getWeek());
  },[])

  useEffect(()=>{
      console.log(new Date().getHours());
      let hourOfDay = new Date().getHours()
      if(hourOfDay > 7 && hourOfDay < 17){
        setIsDay(true)
        appRef.current.style.backgroundImage = `url(${bgImageDaytime})`
        if(hourOfDay > 12){
        setGreeting({greeting:"Good Afternoon",icon:sunIcon})
        }
        else{
          setGreeting({greeting:"Good Morning",icon:sunIcon})

        }

      }
      else{
        setIsDay(false)
        appRef.current.style.backgroundImage = `url(${bgImageNighttime})`
        setGreeting({greeting:"Good Evenining",icon:moonIcon})


      }

  },[])

  onresize=(e)=>{

    if(innerWidth > 1050){
      if(isDay){
        appRef.current.style.backgroundImage = `url(${bgImageDaytime})`

      }
      else{
        appRef.current.style.backgroundImage = `url(${bgImageNighttime})`

      }
    }
   else  if(innerWidth > 550){
      if(isDay){
        appRef.current.style.backgroundImage = `url(${bgTabletImageDaytime})`

      }
      else{
        appRef.current.style.backgroundImage = `url(${bgTabletImageNighttime})`

      }
    }
    else{
      if(isDay){
        appRef.current.style.backgroundImage = `url(${bgMobileImageDaytime})`

      }
      else{
        appRef.current.style.backgroundImage = `url(${bgMobileImageNighttime})`

      }
    }
  }


  useEffect(()=>{

    let seconds = new Date().toLocaleTimeString().split(":")[2].split(" ")[0];
    let timerInt = setInterval(()=>{
          seconds++;
          console.log("Seconds",seconds)
          if(seconds > 59){
            seconds = 0;
            setCurMinute(curMinute=>parseInt(curMinute)+1);
            if(curMinute > 59){
              setCurMinute(0)
              setCurHour(curHour=>parseInt(curHour)+1);
              if(curHour > 12){
                setCurHour(1)
              }
            }
          }

    },1000)


    return ()=> {
      console.log("cleanUp!")
      clearInterval(timerInt)
    }
  })



  const fetchLocation = async()=>{
    let response = await fetch(`${locationURL}?apikey=${APIKEY}`);
    response = await response.json();
    console.log(response,response.data.timezone.id)
    setTimeZone(response.data.timezone.id);
    setLocation(response.data.location.city.name + "," + response.data.location.country.alpha2)
}


  const fetchQuote = async()=>{
      let response = await fetch(quotesAPIUrl);
      response = await response.json();
      console.log(response)
      setQuote({author:response.author,quote:response.content})
  }


  const findDayOfTheYear=date=>{
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  }

  const getDay = ()=>{
    return new Date().getDay();
  }

  const getWeek = ()=>{
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
    (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7);
        return weekNumber;
  }

  const toggleFont = ()=>{
    appRef.current.classList.toggle("secondary")
  }

  return (
    <div onClick={toggleFont} ref={appRef} className="app">
      <div className="app-content">
        <section className={showInfo ? "top-section active-info" : "top-section"}>
          <div className={showInfo ? "top-section-row top-section-top-row hide-top-section-top-row" : "top-section-row top-section-top-row"}>
            <div className="top-section-content">
              {quote?.quote && 
                <div className="quote-row">
                  <div>
                  <p className="quote-blurb thin">{quote.quote}  </p>
                  <p className="bold my-2">{quote.author}</p>
                  </div>
                  <div>
                  <img onClick={fetchQuote} src={refreshIcon} className="refresh-icon"/>
                  </div>
                </div>
                }
            </div>
          
          </div>

          <div className={showInfo ? "top-section-row top-section-bottom-row top-section-bottom-row-full" : "top-section-row  top-section-bottom-row"}>
            <div className="top-section-bottom-row-column column-content">
              <div className="content-card">
                <div className="greeting-div thin">
                  <div>
                  <img className="sun-icon" src={greeting.icon} alt="" />
                  </div>
                  <h5 className="thin">{greeting.greeting}, it's currently</h5>
                </div>
              <div className="time-container">
                <h1>{curHour.toString()}:{curMinute.toString().padStart(2, '0')}</h1>
                <div className="timeofday-div">
                  <h2 className="thin">BST</h2>
                </div>
              </div>
              <div className="location-div">
                <h4>In {location}</h4>
              </div>
            </div>
          </div>
          <div className="section-row-column column-content showinfo-button-column">
            <button onClick={()=>setShowInfo(!showInfo)} className="btn">
         
                      <div className="btn-content">
                        <p>{showInfo ? 'Less' : 'More'}</p>
                        <div className={showInfo ? "arrow-icon-div" : "arrow-icon-div rotate-arrow-div"}>
                          <img src={arrowUpIcon} alt="" />
                        </div>
                      </div> 
   
              </button>
          </div>
        </div>
      </section>

      <section className={showInfo ? "bottom-section show-bottom-section" : "bottom-section"}>
        <div className={showInfo ? "bottom-row-column show-bottom-row-column" : "bottom-row-column"}>
          <div className="data-content-card">
            <div className="data-content-div">
              <div>
              <p className="uppercase">Current Timezone</p>
              <h2>{timeZone}</h2>
              </div>
            </div>
            <div className="data-content-div">
              <div>
              <p className="uppercase">Day of the year</p>
              <h2>{dayOfYear}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={showInfo ? "bottom-row-column show-bottom-row-column" : "bottom-row-column"}>
          <div className="data-content-card">
            <div className="data-content-div">
              <div>
                <p className="uppercase">Day of the week</p>
                <h2>{dayOfWeek}</h2>
              </div>
            </div>
            <div className="data-content-div">
              <div>
                <p className="uppercase">Week number</p>
                <h2>{curWeek}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
    </div>
  )
}

export default App
