import React, { useEffect, useState } from "react";
import '../styles/Result.css'

function Result({ heirShare, totalWealth, totalDept, fromCamelCase }) {

    const [asalMasalah, setAsalMasalah] = useState(0)
    const [shareList, setShareList] = useState([]) 
    const [shareResult, setShareResult] = useState([])
    const [asobahPortion, setAsobahPortion] = useState(1)
    const [asobahShare, setAsobahShare] = useState(0)
    const [saudaraSeibuCasePart, setSaudaraSeibuCasePart] = useState(0)
    const [saudaraSeibuCasePortion, setSaudaraSeibuCasePortion] = useState(0)
    const [musytarikah, setMusytarikah] = useState(false)
    const [aulHappend, setAulHappend] = useState(0)
    const [rodHappend, setRodHappend] = useState(0)

    const [wealthPerShare, setWealthPerShare] = useState(0)
    
    const [isMuqosamah, setIsMuqosamah] = useState(false)
    const [muqosamahPortion, setMuqosamahPortion] = useState(0)
    const [muqosamahWithSaudaraPerempuan, setMuqosamahWithSaudaraPerempuan] = useState(false)

    const transformedHeirShare = heirShare.map(([key, item]) => {
        if (isMuqosamah) {
            if (['saudaraLakiLakiSekandung', 'saudaraPerempuanSekandung'].some(condition => key === condition)) {
                return [key, { ...item, part: 'Muqosamah' }]
            } else if (['saudaraPerempuanSekandung', 'saudaraPerempuanSebapak'].some(condition => key === condition)) {
                return [key, { ...item, part: 'Muqosamah' }]
            } else {
                return [key, item]
            }
        }
        return [key, item]
    })
        
    const sortedHeirShare = [
        ...transformedHeirShare.filter(([key, item]) => !item.part.startsWith('Asobah') && !item.part.startsWith('albaqi')),
        ...transformedHeirShare.filter(([key, item]) => item.part.startsWith('albaqi')),
        ...transformedHeirShare.filter(([key, item]) => item.part.startsWith('Asobah'))
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

        const isMuqosamahCase = heirShare.some(([key, item]) => key === 'kakekDariJalurBapak' && item.part === 'Muqosamah')
        if (isMuqosamahCase) {
            const withSaudaraPerempuan = heirShare.some(([key, value]) => key.includes("saudaraPerempuan"))
            setMuqosamahWithSaudaraPerempuan(withSaudaraPerempuan)
            setIsMuqosamah(true)
            setAsalMasalah(1)
        } else {
            console.log("heir share:", heirShare)
            console.log(denominator.length === 0 ? 1 : kpkMultiple(denominator))
            setAsalMasalah(denominator.length === 0 ? 1 : kpkMultiple(denominator))
            setShareList(deciamlFraction)
        }

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
                    if (sortedHeirShare[index][0] === "saudaraLakiLakiSeibu" && sortedHeirShare[index][1].part === "1/3") { 
                        const totalNumber = sortedHeirShare
                            .filter(item => item[0] === 'saudaraLakiLakiSeibu' || item[0] === 'saudaraPerempuanSeibu')
                            .reduce((acc, curr) => acc + curr[1].number, 0)
                        setSaudaraSeibuCasePortion(totalNumber)
                        setSaudaraSeibuCasePart(share)
                        return null
                    // dzawil furudh
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
                    if (isMuqosamah) {
                        return null
                    }
                    setAsobahShare(remaining)
                    return null
                }})
                .filter(value => value !== null)
        setShareResult(results)

        // console.log(wealthPerShare + "=" + totalWealth + " " + totalDept + " " + asalMasalah)

        const isAsobahBilghairExists = sortedHeirShare.some(([key, value]) => value.part.includes("bilghair"))
        if (isAsobahBilghairExists) {
            const portion = sortedHeirShare.reduce((total, [key, { number, part }]) => {
                if (part === "Asobah bilghair") {
                  return total + (key.includes("LakiLaki") ? number * 2 : number);
                }
                return total;
              }, 0);
            setAsobahPortion(portion)
        }

        if (isMuqosamah) {
            const portion = sortedHeirShare.reduce((total, [key, { number, part }]) => {
                if (part === "Muqosamah") {
                  return total + ((key.includes("LakiLaki") || key.includes("kakek")) && muqosamahWithSaudaraPerempuan ? number * 2 : number * 1);
                }
                return total;
              }, 0);
            setMuqosamahPortion(portion)
        }        
    }, [asalMasalah])

    useEffect(() => {
        const shareResultSum = shareResult.reduce((acc, curr) => acc + curr, asobahShare)
        if (shareResultSum && asalMasalah) {
            if (shareResultSum > asalMasalah) {
                setAulHappend(shareResultSum)
                setWealthPerShare((totalWealth - totalDept) / shareResultSum)
            } else if (asalMasalah > shareResultSum) {
                setRodHappend(asalMasalah-shareResultSum)
                // console.log("shareResultSum:" + shareResultSum)
                console.log("rod executed " + asalMasalah + " " + shareResultSum)
            } else {
                setRodHappend(0)
                setAulHappend(0)
                console.log("rod not happend, because asalmasalah: " + asalMasalah + " and shareresultsum: " + shareResultSum + " asobahshare: " + asobahShare)
            }
        }

        if (!musytarikah && saudaraSeibuCasePortion) {
            const portion = sortedHeirShare
                .filter(([key]) => key === "saudaraLakiLakiSekandung" || key === "saudaraPerempuanSekandung")
                .reduce((acc, [key, value]) =>  acc + value.number ,0)
            setMusytarikah(true)
            // setMusytarikahPortion(portion)
            setSaudaraSeibuCasePortion(prevValue => prevValue += portion)
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
                <div className="information-box">
                    <p>Ahli waris</p>
                    <p>Bagian (Rp.)</p>
                </div>

                <div className="share-contain">
                    { sortedHeirShare.map(([key, { number, part }], index) => { 
                        return (
                            <div className="result-share">
                                <div className="part-nominal">
                                    <p>{fromCamelCase(key)}</p>
                                    {/* share in Rp. */}
                                    { 
                                        String(part).includes("Asobah") 
                                            ? <p>Asobah</p> 
                                            : (key === "saudaraLakiLakiSeibu" || key === "saudaraPerempuanSeibu") && saudaraSeibuCasePart 
                                                ? <p>Rp. {Math.floor(wealthPerShare * saudaraSeibuCasePart)} together</p>
                                                : String(part).includes("Muqosamah")
                                                    ? <p>Muqosamah</p>
                                                    : <p>Rp. {Math.floor(wealthPerShare * shareResult[index])}</p>
                                    } 
                                    
                                </div>
                                {/* share in part */}
                                <p>
                                    { String(part).includes("Asobah") 
                                        ? asobahShare 
                                        : (key === "saudaraLakiLakiSeibu" || key === "saudaraPerempuanSeibu") && saudaraSeibuCasePart
                                            ? saudaraSeibuCasePart
                                            : String(part).includes("Muqosamah") 
                                                ? 1
                                                : shareResult[index] } bagian
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="right-box">
                <div className="line-boundary"></div>
                <div className="information-box">
                    <p>Bagian</p>
                    <p>Porsi</p>
                    <p>Anggota</p>
                    <p>Ahli waris</p>
                </div>
                    
                <div className="share-box">
                    { sortedHeirShare.map(([key, { number, part }], index) => {
                        // asobah
                        if (String(part).includes("Asobah") && !musytarikah) {
                            return (
                                <div className="share-division">
                                    <p>{asobahShare}/{asobahPortion}</p>
                                    <p>{key.includes("LakiLaki") && part.includes("bilghair") ? number*2 : key.includes("Perempuan") && part.includes("bilghair") ? number*1 : 1} x {Math.floor(wealthPerShare)}</p>
                                    <p>{number}</p>
                                    <p>Rp. {Math.floor(asobahShare / asobahPortion * (key.includes("LakiLaki") && part.includes("bilghair") ? number*2 : key.includes("Perempuan") && part.includes("bilghair") ? number*1 : 1) * wealthPerShare / number)}</p>
                                </div>
                            )
                        }
                        // musytarikah
                        else if (String(part).includes("Asobah") && musytarikah) {
                            return (
                                <div className="share-division">
                                    <p>musytarikah</p>
                                    <p>{saudaraSeibuCasePart}/{saudaraSeibuCasePortion} x {number} x {Math.floor(wealthPerShare)}</p>
                                    <p>{number}</p>
                                    <p>Rp. {Math.floor(saudaraSeibuCasePart / saudaraSeibuCasePortion * number * wealthPerShare / number)}</p>
                                            
                                </div>
                            )
                        }
                        // muqosamah
                        else if (String(part).includes("Muqosamah")) {
                            return (
                                <div className="share-division">
                                    <p>1/{muqosamahPortion}</p>
                                    <p>{(key.includes("LakiLaki") || key.includes("kakek")) && muqosamahWithSaudaraPerempuan ?  number*2 : number*1} x {Math.floor(wealthPerShare)}</p>
                                    <p>{number}</p>
                                    <p>Rp. {Math.floor(1 / muqosamahPortion * ((key.includes("LakiLaki") || key.includes("kakek")) && muqosamahWithSaudaraPerempuan ? number*2 : number*1) * wealthPerShare / number)}</p>
                                </div>
                            )
                        }
                        // dzawil furudh
                        return (
                            <div className="share-division">
                                {
                                    (key === "saudaraLakiLakiSeibu" || key === "saudaraPerempuanSeibu") && saudaraSeibuCasePart // is '1/3 together' shares for 'saudara seibu'
                                        ? ( <>
                                                <p>{saudaraSeibuCasePart}/{saudaraSeibuCasePortion}</p>
                                                <p>{number} x {Math.floor(wealthPerShare)}</p>
                                                <p>{number}</p>
                                                <p>Rp. {Math.floor(saudaraSeibuCasePart / saudaraSeibuCasePortion * number * wealthPerShare / number)}</p>
                                            </>

                                            )
                                        : ( <>
                                                <p>-</p>
                                                <p>-</p>
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