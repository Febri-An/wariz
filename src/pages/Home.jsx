import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Button from '../components/Button'
import Alert from '@mui/material/Alert';
import image from '../assets/logo.png'
import image2 from '../assets/logo2.png'
import '../styles/Home.css';

function Home() {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();
  const isStarting = useRef(true)
  
  function goLink(event) {
    isStarting.current = false
    if (selectedGender && selectedGender !== 'error') {
      const { name } = event.target
      navigate(`/${name}`, { state: { selectedGender } }); // move to page
    } else {
      setSelectedGender("error")
    }
  };
  
  function getLabelStyle(gender) {
    return ({
      backgroundColor: selectedGender === gender ? '#ecdfcc' : 'transparent',
      borderColor: selectedGender === gender ? '#ecdfcc' : 'initial'
    })
  }

  useEffect(() => {
    console.log(selectedGender)
  }, [selectedGender])

  return (
    <div className='image'>
      
      { selectedGender === 'error' && !isStarting.current && (<Alert className="alert" severity="error">Harap pilih gender untuk almarhum.</Alert>)}

      <div className="flex-container">
        <div className='background-logo'>
          <img src={image} alt="Wariz logo"></img>
        </div>

        <img src={image2} alt='Person logo' className='person'></img> 
        
        <label htmlFor="gender-input">Pilih jenis kelamin almarhum:</label>
        <form className='gender-input'>
          <div>
            <input onChange={() => setSelectedGender('male')} type="checkbox" id="male" name="gender" value="male" />
            <label style={getLabelStyle("male")} htmlFor="male" className='custom-label'></label> Pria
          </div>
            
          <div>
            <input onChange={() => setSelectedGender('female')} type="checkbox" id="female" name="gender" value="female" />
            <label style={getLabelStyle("female")} htmlFor="female" className='custom-label'></label> Wanita
          </div>
        </form>

        <button type='submit' name='form' onClick={goLink}>Next</button>
      </div>
    </div>
  );
}

export default Home;
