import React, { useState, useMemo, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import '../styles/Heir.css'

const secHeir = ["Saudara laki-laki sekandung", "Saudara laki-laki seibu", "Saudara laki-laki sebapak", "Kakek dari jalur bapak", "Nenek dari jalur ibu", "Cucu laki-laki" ]
const secHeir2 = ["Saudara perempuan sekandung", "Saudara perempuan seibu", "Saudara perempuan sebapak", "Nenek dari jalur bapak", "", "Cucu perempuan"]

// if starting, will not there disabled checkbox ~ homework
function Heir({ ahliWaris, heirClicked, toDisabled, toCamelCase, fromCamel }) {

    const location = useLocation()
    const [genderInject] = useState(location.state?.selectedGender) 

    const mainHeir = useMemo(() => {
        const heirs = ["Bapak", "Ibu", "Anak perempuan", "Anak laki-laki"]
        if (genderInject === 'male') {
            return [...heirs, "Istri"]
        } else {
            return [...heirs, "Suami"]
        }
      }, [genderInject])

    function getLabelStyle(name) {
        return ({
            backgroundColor: ahliWaris[name] >= 1 ? '#ecdfcc' : 'transparent',
            borderColor: ahliWaris[name] >= 1 ? '#ecdfcc' : 'initial'
        })
    }

    function isDisbaled(element) {
        return toDisabled.includes(element)
    }

    // useEffect(() => {
    //     console.log(toDisabled)
    // }, [toDisabled])

    return (
        <>
            <div className="main-heir">
        
                <p>Ahli waris utama:</p>

                <div className="main-heir-input gender-input">
                    { mainHeir.map(element => (
                        <div key={element}>
                            <input onClick={isDisbaled(element) ? null : heirClicked} type="checkbox" id={element} name="heir" value={element} />
                            <label style={getLabelStyle(toCamelCase(element))} htmlFor={element} className='custom-label'></label> 
                            {element}
                        </div>))
                    }
                </div>
            </div>
            
            <div className="secondary-heirs">

                <p>Ahli waris:</p>
                <div className="sec-heir-input gender-input">
                    { secHeir.map(element => (
                        <div key={element}>
                            <input onClick={isDisbaled(element) ? null : heirClicked} type="checkbox" id={element} name="heir" value={element} />
                            <label style={getLabelStyle(toCamelCase(element))} htmlFor={element} className={`custom-label ${isDisbaled(element) ? "disabled" : ""}`}></label> 
                            {element}
                        </div>))
                    }
                </div>

                <div className="sec-heir-input2 gender-input">
                    { secHeir2.map(element => (
                        <div key={element}>
                            <input onClick={isDisbaled(element) ? null : heirClicked} className={element === "" ? "hidden" : ""} type="checkbox" id={element} name="heir" value={element} />
                            <label style={getLabelStyle(toCamelCase(element))} htmlFor={element} className={`custom-label ${element === "" ? "hidden" : ""} ${isDisbaled(element) ? "disabled" : ""}`}></label> 
                            {element}
                        </div>))
                    }
                </div>
            </div>
        </>
    )
}

export default Heir;