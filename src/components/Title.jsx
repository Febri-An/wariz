import React from "react";
import image from '../assets/title.png'
import '../styles/Title.css'

function Title({ name, currentPage, handleClick, withInput=false, handleChange, totalWealth}) {
    const pages = [1, 2, 3, 4]

    return (
        <div className="title">
            <ul className="pagination">
                {pages.map((page) => (
                    <li
                        key={page}
                        value={page}
                        className={currentPage === page ? 'active' : ''}
                        onClick={handleClick}
                    >
                        {page}
                    </li>
                ))}
            </ul>
            <div className="title-template">
                <img src={image} alt="Title template"></img>
                <label>{name}</label>
            </div>
            
            { withInput && (
                <div className="input-legacy">
                    <label htmlFor="nominal">Jumlah :</label>
                    <p>Rp.</p>
                    <input onChange={handleChange} value={totalWealth} placeholder="0" type="text" id="nominal"/>
                </div>) 
            }
        </div>
    )
}

export default Title;