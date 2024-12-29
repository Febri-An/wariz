import React, { useEffect, useState } from "react";
import '../styles/Result.css'

function Result({ heirShare, totalWealth, totalDept, fromCamelCase }) {

    const [asalMasalah, setAsalMasalah] = useState(0)
    const [shareList, setShareList] = useState([]) 
    const [shareResult, setShareResult] = useState([])
    const [asobahPortion, setAsobahPortion] = useState()

    const sortedHeirShare = [
        ...heirShare.filter(([key, item]) => !item.part.startsWith('A')),
        ...heirShare.filter(([key, item]) => item.part.startsWith('A'))
      ]
    
    const wealthPerShare = totalWealth / asalMasalah

    function fpb(a, b) {
        while (b !== 0) {
          const temp = b;
          b = a % b;
          a = temp;
        }
        return a;
      }

    function kpk(a, b) {
        return Math.abs(a * b) / fpb(a, b);
    }

    function kpkMultiple(numbers) {
        return numbers.reduce((acc, num) => kpk(acc, num));
    }

    // function formatNumber(num) {
    //     // Jika bilangan bulat, langsung return sebagai bilangan bulat
    //     if (Number.isInteger(num)) {
    //         return num.toString();
    //     } else if (!num) {
    //         return num
    //     }
    
    //     // Jika desimal tunggal, return dengan satu angka di belakang koma
    //     if (num % 1 === 0.5) {
    //         return num.toString();
    //     }
    
    //     // Tangani angka desimal seperti 3.333... atau 6.666...
    //     const rounded = Math.floor(num * 10) / 10; // Ambil 1 angka desimal
    //     const base = rounded.toFixed(1).toString(); // Ubah menjadi string dengan 1 angka desimal
    //     const repeatingPart = base.split('.')[1][0]; // Ambil angka pengulangan
    
    //     return `${base.split('.')[0]}.${repeatingPart}${repeatingPart}${repeatingPart}...`;
    // }

    useEffect(() => {
        const denominator = sortedHeirShare.map(([key, value]) => value.part)
            .filter(item => /^[0-9]\/[0-9]$/.test(item)) // Memfilter hanya elemen yang berbentuk 'num/num'
            .map(item => parseInt(item.split('/')[1])) // Mengambil penyebut (bagian setelah '/'))
        
        const deciamlFraction = sortedHeirShare.map(([key, value]) => {
            if (/^[0-9]+\/[0-9]+$/.test(value.part)) { // convert decimal fraction 'num/num' -> float
                return eval(value.part)
            } else {
                return value.part
            }
        })

        console.log("heir share:", heirShare)
        // console.log("denominator length:", deciamlFraction.length)
        setAsalMasalah(denominator.length === 0 ? 1 : kpkMultiple(denominator))
        setShareList(deciamlFraction)
    }, [])

    useEffect(() => {
        console.log("share list:" + shareList)
        console.log("share result:" + shareResult)
    }, [shareList, shareResult])

    useEffect(() => {
        let remaining = asalMasalah
        const results =  shareList.map(value => {
            const share = asalMasalah * value  
            if (share) {
                remaining -= share
                return share
            } else {
                return remaining
            }
        })

        const isAsobahBilghairExists = heirShare.some(([key, value]) => value.part.includes("bilghair"))
        if (isAsobahBilghairExists) {
            const portion = heirShare.reduce((total, [key, { number, part }]) => {
                if (part === "Asobah bilghair") {
                  return total + (key.includes("LakiLaki") ? number * 2 : number);
                }
                return total;
              }, 0);
              
            setAsobahPortion(portion)
        }
        
        setShareResult(results)
    }, [asalMasalah])

    return (
        
        <div className="result-container">
            <div className="asset-summary">
                <div className="wealth-dept">
                    <p>Jumlah harta:</p>
                    <p>Tanggungan:</p>
                </div>
                <div className="wealth-dept-nominal">
                    <p>Rp. {totalWealth}</p>
                    <p>Rp. {totalDept}</p>
                </div>
                <div className="heir-part">
                    <p>Perbagian:</p>
                    <p>Bagian:</p>
                </div>
                <div className="heir-part-nominal">
                    <p>Rp. {Math.floor((totalWealth - totalDept) / asalMasalah)}</p>
                    <p>{asalMasalah}</p>
                </div>
            </div>
            

            <div className="left-box">
                <div className="share-contain">
                    { sortedHeirShare.map(([key, value], index) => { 
                        return (
                            <div className="result-share">
                                <div className="part-nominal">
                                    <p>{fromCamelCase(key)}</p>
                                    { typeof shareList[index] === 'string' ? <p>Asobah</p> : <p>Rp. {Math.floor(wealthPerShare * shareResult[index])}</p>}
                                    
                                </div>
                                <p>{shareResult[index]} bagian</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="right-box">
                <div className="line-boundary"></div>
                
                <div className="share-box">
                    { sortedHeirShare.map(([key, value], index) => {
                        if (shareList[index] === "Asobah bilghair") {
                            return (
                                <div className="share-division">
                                    <p>{shareResult[index]}/{asobahPortion} x {key.includes("LakiLaki") ? value.number*2 : value.number} x {Math.floor(wealthPerShare)}</p>
                                    <p>Rp. {Math.floor(shareResult[index] / asobahPortion * (key.includes("LakiLaki") ? value.number*2 : value.number) * wealthPerShare)}</p>
                                </div>
                            )
                        }

                        return (
                            <div className="share-division">
                                <p>{value.number}</p>
                                <p>Rp. {Math.floor((wealthPerShare * shareResult[index]) / value.number)}</p>
                            </div>
                        )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Result;