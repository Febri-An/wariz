import React, { useEffect, useState } from "react";
import '../styles/Result.css'

function Result({ heirShare, totalWealth, totalDept, fromCamelCase }) {

    const [asalMasalah, setAsalMasalah] = useState(0)
    const [shareList, setShareList] = useState([]) 
    const [shareResult, setShareResult] = useState([])
    const [asobahPortion, setAsobahPortion] = useState(1)
    const [asobahShare, setAsobahShare] = useState(0)
    const [saudaraSeibuCasePart, setSaudaraSeibuCasePart] = useState()
    const [saudaraSeibuCasePortion, setSaudaraSeibuCasePortion] = useState()
    const [aulHappend, setAulHappend] = useState(0)
    const [rodHappend, setRodHappend] = useState(0)

    const [wealthPerShare, setWealthPerShare] = useState(0)
    
    const sortedHeirShare = [
        ...heirShare.filter(([key, item]) => !item.part.startsWith('A') && !item.part.startsWith('albaqi')),
        ...heirShare.filter(([key, item]) => item.part.startsWith('albaqi')),
        ...heirShare.filter(([key, item]) => item.part.startsWith('A'))
      ]

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
        setAsalMasalah(denominator.length === 0 ? 1 : kpkMultiple(denominator))
        setShareList(deciamlFraction)
    }, [])


    useEffect(() => {
        if (asalMasalah > 0) {
            setWealthPerShare((totalWealth - totalDept) / asalMasalah)
        }
    }, [asalMasalah, totalWealth, totalDept])

    useEffect(() => {
        console.log("share list:" + shareList)
        console.log("share result:" + shareResult)
    }, [shareList, shareResult])

    useEffect(() => {
        let remaining = asalMasalah
        const results =  shareList
            .map((value, index) => {
                const share = asalMasalah * value  
                // non asobah or 'dzawil furudh'
                if (share) {
                     // handle 'saudara laki laki seibu' and 'saudara perempuan seibu' case on join part
                    if (heirShare[index][0] === "saudaraLakiLakiSeibu" && heirShare[index][1].part === "1/3") { 
                        const totalNumber = heirShare
                            .filter(item => item[0] === 'saudaraLakiLakiSeibu' || item[0] === 'saudaraPerempuanSeibu')
                            .reduce((acc, curr) => acc + curr[1].number, 0)
                        setSaudaraSeibuCasePortion(totalNumber)
                        setSaudaraSeibuCasePart(share)
                        return null
                    } else {
                        remaining -= share
                        return share
                    }
                // albaqi for 'ibu'
                } else if (String(value).includes("albaqi")) {
                    const albaqi = remaining / 3
                    remaining -= albaqi.toFixed(3)
                    return albaqi.toFixed(3)
                // asobah
                } else {
                    if (remaining <= 0) {
                        remaining = 0
                    }
                    setAsobahShare(remaining)
                    return null
                }})
            .filter(value => value !== null)

        // console.log(wealthPerShare + "=" + totalWealth + " " + totalDept + " " + asalMasalah)

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

    useEffect(() => {
        const shareResultSum = shareResult.reduce((acc, curr) => acc + curr, asobahShare)
        if (shareResultSum > asalMasalah) {
            setAulHappend(shareResultSum)
            setWealthPerShare((totalWealth - totalDept) / shareResultSum)
        } else if (asalMasalah > shareResultSum) {
            setRodHappend(asalMasalah-shareResultSum)
            console.log("shareResultSum:" + shareResultSum)
            console.log("executed" + asalMasalah + " " + shareResultSum)
        } else {
            setRodHappend(0)
            console.log("rod not happend, because asalmasalah: " + asalMasalah + "and shareresultsum :" + shareResultSum + " asobahshare:" + asobahShare)
        }
    }, [shareResult])

    return (
        
        <div className="result-container">
            <div className="asset-summary">
                <div>
                    <p>Jumlah harta:</p>
                    <p>Tanggungan:</p>
                </div>
                <div className="wealth-dept-nominal">
                    <p>Rp. {totalWealth}</p>
                    <p>Rp. {totalDept}</p>
                </div>
                <div>
                    <p>Perbagian:</p>
                    <p>Bagian:</p>
                </div>
                <div className="heir-part-nominal">
                    <p>Rp. {Math.floor(wealthPerShare)}</p>
                    <div className="aul-asalmasalah">
                        { aulHappend ? <p>{aulHappend}</p> : null }
                        { aulHappend ? <p>Aul</p> : null }
                        <p>{asalMasalah}</p>
                    </div>
                </div>
            </div>
            
            <div className="left-box">
                <div className="share-contain">
                    { sortedHeirShare.map(([key, { number, part }], index) => { 
                        return (
                            <div className="result-share">
                                <div className="part-nominal">
                                    <p>{fromCamelCase(key)}</p>
                                    {/* share in Rp. */}
                                    { String(part).includes("Asobah") 
                                        ? <p>Asobah</p> 
                                        : (key === "saudaraLakiLakiSeibu" || key === "saudaraPerempuanSeibu") && saudaraSeibuCasePart
                                            ? <p>Rp. {Math.floor(wealthPerShare * saudaraSeibuCasePart)} together</p>
                                            : <p>Rp. {Math.floor(wealthPerShare * shareResult[index])}</p>}
                                    
                                </div>
                                <p>{ String(part).includes("Asobah") 
                                    ? asobahShare 
                                    : (key === "saudaraLakiLakiSeibu" || key === "saudaraPerempuanSeibu") && saudaraSeibuCasePart
                                        ? saudaraSeibuCasePart
                                        : shareResult[index] } bagian</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="right-box">
                <div className="line-boundary"></div>
                <div className="share-box">
                    { sortedHeirShare.map(([key, { number, part }], index) => {
                        if (String(part).includes("Asobah")) {
                            return (
                                <div className="share-division">
                                    <p>{asobahShare}/{asobahPortion} x {key.includes("LakiLaki") && part.includes("bilghair") ? number*2 : number} x {Math.floor(wealthPerShare)}</p>
                                    <p>{number}</p>
                                    <p>Rp. {Math.floor(asobahShare / asobahPortion * (key.includes("LakiLaki") && part.includes("bilghair") ? number*2 : number) * wealthPerShare / number)}</p>
                                </div>
                            )
                        }

                        return (
                            <div className="share-division">
                                {
                                    (key === "saudaraLakiLakiSeibu" || key === "saudaraPerempuanSeibu") && saudaraSeibuCasePart
                                        ? ( <>
                                                <p>{saudaraSeibuCasePart}/{saudaraSeibuCasePortion} x {number} x {Math.floor(wealthPerShare)}</p>
                                                <p>{number}</p>
                                                <p>Rp. {Math.floor(saudaraSeibuCasePart / saudaraSeibuCasePortion * number * wealthPerShare / number)}</p>
                                            </>

                                            )
                                        : ( <>
                                                <p>{number}</p>
                                                <p>Rp. {Math.floor((wealthPerShare * shareResult[index]) / number)}</p> 
                                            </> )
                                }
                            </div>
                        )
                        })
                    }
                </div>
            </div>

            { rodHappend ?
                (
                    <div className="rod">
                        <p>Rod: {rodHappend} bagian</p>
                    </div>
                ) : null
            } 
        </div>
    )
}

export default Result;