import React, { useEffect, useState } from "react";
import Line from '../assets/beauti-line.png'
import '../styles/Dept.css'

const labelName = ["Hutang:", "Wasiat:", "Biaya lain-lain:"]
const deptArrayName = ['dept', 'will', 'other']

function Dept({ ahliWaris, setAhliWaris, setTotalDept }) {
    const [filteredAhliWaris, setFilteredAhliWaris] = useState([])
    const [deadDept, setDeadDept] = useState({dept: '', will: '', other: ''})

    function fromCamelCase(str) {
        return str
          .replace(/([A-Z])/g, ' $1') // Menambahkan spasi sebelum huruf besar
          .replace(/^./, (char) => char.toUpperCase()) // Mengubah huruf pertama menjadi huruf besar
          .trim() // Menghapus spasi di awal dan akhir
    }

    function handleChange(event) {
        const {id, name, value} = event.target
        if (id === 'dept') {
            setDeadDept(prevValue => {
                return {
                    ...prevValue,
                    [name]: value
                }
            })
        } else {
            setAhliWaris(prevValue => {
                return {
                    ...prevValue,
                    [name]: Number(value) 
                }
            })
        }
    }

    useEffect(() => {
        const result = Object.entries(ahliWaris)
                .filter(([key, value]) => value >= 1)
                .map(([key]) => key);
        setFilteredAhliWaris(result)
    }, [])

    useEffect(() => {
        const total = Object.entries(deadDept)
            .map(([key, value]) => Number(value))
            .reduce((acc, value) => acc + value, 0)
        setTotalDept(total)
    }, [deadDept])
      
    return (
        <div className="dept-container">

            <div className="heir-list-number">
                <p>Jumlah ahli waris:</p>
                { filteredAhliWaris.map(heir => (
                    <label htmlFor={heir}>
                        {fromCamelCase(heir)}
                        <input onChange={heir === 'bapak' ? null : handleChange} value={ahliWaris[heir]} id={heir} name={heir} type="text" />
                    </label>
                ))}
            </div>

            <img src={Line} alt="line" className="line"/>
            <div className="dept-will">
                {labelName.map((name, index) => (
                    <div key={index} className="dept-item">
                        <label htmlFor={name}>{name}</label>
                        <div className="dept-input input-legacy">
                            <label htmlFor='dept'>Jumlah:</label>
                            <p>Rp.</p>
                            <input onChange={handleChange} value={deadDept[deptArrayName[index]]} name={deptArrayName[index]} placeholder="0" id='dept' type="text" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dept;
