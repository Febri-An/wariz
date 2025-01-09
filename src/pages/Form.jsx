import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import Title from "../components/Title";
import Heir from '../components/Heir'
import Dept from '../components/Dept'
import Result from '../components/Result'
import Help from '../components/Help'
import backwardImage from '../assets/backward.png'
import forwardImage from '../assets/forward.png'
import logic from './logic'
import Alert from '@mui/material/Alert';
import '../styles/Form.css'


function Form() {

    const [currentPage, setCurrentPage] = useState(1)
    const [totalWealth, setTotalWealth] = useState()
    const [totalDept, setTotalDept] = useState(0)
    const [ahliWaris, setAhliWaris] = useState({
        bapak: 0, ibu: 0, anakPerempuan: 0, anakLakiLaki: 0,  suami: 0, istri: 0, cucuLakiLaki: 0, cucuPerempuan: 0, saudaraLakiLakiSekandung: 0, saudaraLakiLakiSeibu: 0, saudaraLakiLakiSebapak: 0, saudaraPerempuanSekandung: 0, saudaraPerempuanSeibu: 0,  saudaraPerempuanSebapak: 0, kakekDariJalurBapak: 0, nenekDariJalurBapak: 0, nenekDariJalurIbu: 0
    })
    const [heirShare, setHeirShare] = useState([]) // will contain: [name {number: , part: }]

    const navigate = useNavigate();
    const [wealthInclude, setWealthInclude] = useState(true)
    // const isInitialRender = useRef(true)

    // page init
    const pages = [
        { id: 1, title: 'Harta yang diwaris', component: <Heir ahliWaris={ahliWaris} heirClicked={heirClicked} toCamelCase={toCamelCase}  fromCamelCase={fromCamelCase}/>, withInput: true },
        { id: 2, title: 'Hutang dan wasiat', component: <Dept ahliWaris={ahliWaris} setAhliWaris={setAhliWaris} setTotalDept={setTotalDept}/> },
        { id: 3, title: 'Hasil pembagian', component: <Result ahliWaris={ahliWaris} heirShare={heirShare} totalWealth={totalWealth} totalDept={totalDept} fromCamelCase={fromCamelCase}/> },
        { id: 4, title: 'Pusat bantuan', component: <Help /> },
    ]
    const currentConfig = pages.find(page => page.id === currentPage)
    
    function handleClick(event) {
        const {value, name} = event.target
        if (value) {
            if (!totalWealth) { 
                setWealthInclude(false)
            } else {
                setWealthInclude(true)
                setCurrentPage(value)
            }
        } else if (name === 'forward' && currentPage !== 4) {
            if (!totalWealth) { 
                setWealthInclude(false)
            } else {
                setWealthInclude(true)
                setCurrentPage(prevValue => prevValue+=1)
            }
        } else if (name === 'backward' && currentPage !== 1) {
            setCurrentPage(prevValue => prevValue-=1)
        } else {
            navigate('/')
        }
    }

    function handleChange(event) {
        const {value} = event.target
        setTotalWealth(value)
    }

    function toCamelCase(str) {
        return str
          .toLowerCase()            
          .replace(/[-\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '') // delete space and convert char after space or hyphen to upper case
    }

    function fromCamelCase(str) {
        return str
          .replace(/([a-z])([A-Z])/g, '$1 $2') // seperate with space
          .replace(/\b\w/g, (char) => char.toLowerCase()) // convert upper case first letter word to lower case 
          .replace(/laki laki/, 'laki-laki')   // add '-' to 'laki laki'
          .replace(/^\w/, (char) => char.toUpperCase()) // convert first letter str to upper case
    }

    function heirClicked(event) {
        const {value} = event.target // contain general str
        const heirName = toCamelCase(value)
        setAhliWaris(prevValue => { 
            if (prevValue[heirName] >= 1) {
                return ({
                    ...prevValue,
                    [heirName]: 0
                })
            } else {
                return ({
                    ...prevValue,
                    [heirName]: 1
                })
            }
        })
    }

    useEffect(() => {
            const result = logic(ahliWaris)
            // console.log('logic re rendering')
            // console.log('ahli waris: ', ahliWaris)
            // const heirToDisabled = Object.entries(result) // return [] -> general str
            //     .filter(([key, value]) => (!value.number && !value.part))
            //     .map(([key]) => fromCamelCase(key))
            
            const heirWhoGetShare = Object.entries(result)
            .filter(([key, value]) => (value.number && value.part)) 
            
            // console.log('~~~~~~~~~~~~~~~~~~~', heirWhoGetShare)
            setHeirShare(heirWhoGetShare)
            // console.log('setting heir share to: ', heirWhoGetShare)

        // console.log(ahliWaris)
    }, [ahliWaris])

    // useEffect(() => {
    //     console.log("total wealth:", totalWealth)
    //     console.log("total dept:", totalDept)
    // }, [totalWealth, totalDept])
    
    // useEffect(() => {
    //     // console.log("result", toDisabled)
    //     if (toDisabled.length === 0) return

    //     const formatToCamelCase = toDisabled.map(key => toCamelCase(key))
    //     setAhliWaris(prevValue => {
    //         const updates = formatToCamelCase.reduce((acc, key) => {
    //           acc[key] = 0
    //           return acc
    //         }, {})
          
    //         return {
    //           ...prevValue,
    //           ...updates
    //         }
    //       })
    // }, [toDisabled])

    // useEffect(() => {
    //     console.log(ahliWaris)
    // }, [ahliWaris])

    return (
        <div className="img">
            <Header />

            {  !wealthInclude && (<Alert className="alert" severity="error">Masukan jumlah harta almarhum.</Alert>) }

            <div className="form-container">
                {currentConfig && (
                    <>
                        <Title
                        name={currentConfig.title}
                        withInput={currentConfig.withInput}
                        currentPage={currentPage}
                        handleClick={handleClick}
                        handleChange={handleChange}
                        totalWealth={totalWealth}
                        />
                        <div className="main-box">
                            {currentConfig.component}
                        </div>
                    </>
                )}
                <div className="backward-forward">
                    <img onClick={handleClick} name="backward" className="backward" src={backwardImage} alt="backward button"></img>
                    <img onClick={handleClick} hidden={currentPage === 4 ? true : false} name="forward" className="forward" src={forwardImage} alt="forward button"></img>
                </div>
            </div>
        </div>
    )
}

export default Form;