import React, { useEffect, useState, useMemo, useRef } from "react";
import mostShareForKakek from './kakekMostShares'
import '../styles/Result.css'
import { use } from "react";

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
    
    // const [isMuqosamah, setIsMuqosamah] = useState(false)
    const [muqosamahShare, setMuqosamahShare] = useState(0)
    const [muqosamahPortion, setMuqosamahPortion] = useState(0)
    const [muqosamahWithSaudaraPerempuan, setMuqosamahWithSaudaraPerempuan] = useState(false)

    // const [rerender, setRerender] = useState(false)

    // const frozenHeirShare = Object.freeze([...heirShare])
    // const isMuqosamah = useReff(false)
    // const [isThreeShareKakekCase, setIsThreeShareKakekCase] = useState(false)
    // const previousHeirShareRef = useRef([])

    // const [changeHeirShare, setChangeHeirShare] = useState(false)
    // const [isMuqosamah, setIsMuqosamah] = useState(false)
    // const [kakekSpecialCase, setKakekSpecialCase] = useState(false)

    const [specialCasePortion, setSpecialCasePortion] = useState(0)
    const [specialCasePart, setSpecialCasePart] = useState(0)


    const transformedHeirShare = useMemo(() => {
        console.log("heir share", heirShare)
        const isMuqosamah = heirShare.some(([key, { number, part }]) => part === 'Muqosamah')
        if (isMuqosamah) {
            console.log('muqosamah case executed')
            // setIsMuqosamah(true)
            return heirShare.map(([key, item]) => {
                if (['saudaraLakiLakiSekandung', 'saudaraPerempuanSekandung', 'saudaraLakiLakiSebapak', 'saudaraPerempuanSebapak'].some(condition => key === condition)) {
                    return [key, { ...item, part: 'Muqosamah' }]
                } else {
                    return [key, item]
                }
            })
        }

        const isThreeShareKakek = heirShare.some(([key, { number, part }]) => part === 'Most shares')
        if (isThreeShareKakek) {
            // setChangeHeirShare(true)
            // setIsThreeShareKakekCase(true)
            // setRerender(true)
            // console.log(mostShareForKakek(heirShare, asalMasalah, shareList, asobahShare, asobahPortion))
            console.log(heirShare, asalMasalah, shareList, asobahShare, asobahPortion)
            console.log("~~~~~~~", mostShareForKakek(heirShare, asalMasalah, shareList, asobahShare, asobahPortion))
            return mostShareForKakek(heirShare, asalMasalah, shareList, asobahShare, asobahPortion)
        }
        return heirShare
    }, [heirShare, asalMasalah, shareList, asobahShare, asobahPortion])
    // console.log(transformedHeirShare)
    



    const sortedHeirShare = useMemo(() => [
        ...transformedHeirShare.filter(([key, item]) => !item.part.startsWith('Asobah') && !item.part.startsWith('albaqi')),
        ...transformedHeirShare.filter(([key, item]) => item.part.startsWith('albaqi')),
        ...transformedHeirShare.filter(([key, item]) => item.part.startsWith('Asobah'))
    ], [transformedHeirShare])
    // console.log("sorted heir share: ", sortedHeirShare)
    // console.log("heir share: ", heirShare)
    console.log("Before sorting:", transformedHeirShare);
    console.log("After sorting:", sortedHeirShare);





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

    // set shareList and asalMasalah
    useEffect(() => {
        // if (JSON.stringify(previousSortedHeirShareRef.current) !== JSON.stringify(sortedHeirShare)) {
            const denominator = sortedHeirShare.map(([key, value]) => value.part)
                .filter(item => /^[0-9]\/[0-9]$/.test(item)) // filter only decimal fraction elements ('num/num')
                .map(item => parseInt(item.split('/')[1])) // taking the denominator
            setAsalMasalah(denominator.length === 0 ? 1 : kpkMultiple(denominator))
            
            const deciamlFraction = sortedHeirShare.map(([key, value]) => {
                console.log("Processing:", key, value);
                if (/^[0-9]+\/[0-9]+$/.test(value.part)) { // convert decimal fraction string ('num/num') -> float
                    // console.log("decimal fraction: ", value.part)
                    return eval(value.part)
                } else { // not a fractional number
                    // console.log('decimal fraction: ', value.part)
                    return value.part
                }
            })
            console.log('print sortedHeirShare from []: ', sortedHeirShare)
            // console.log('decimal fraction: ' + deciamlFraction)
            setShareList(deciamlFraction)
            // previousSortedHeirShareRef.current = sortedHeirShare // Update ref

            console.log("sorted heir share: ", sortedHeirShare)
            console.log("asal masalah: ", denominator.length === 0 ? 1 : kpkMultiple(denominator))
        // }
    }, [sortedHeirShare]) /// 


    useEffect(() => {
        if (asalMasalah > 0) {
            setWealthPerShare((totalWealth - totalDept) / asalMasalah)
        }
    }, [asalMasalah, totalWealth, totalDept])

    useEffect(() => {
        console.log("share list:" + shareList)
        console.log("share result:" + shareResult)
    }, [shareList, shareResult])

    // determine share of each heir
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
                    // handle special case kakek 
                    } else if (sortedHeirShare[index][0] === "kakekDariJalurBapak") {
                        const isSpecialCase = ["suami", "ibu"].every(specialKey => heirShare.some(([key, value]) => key === specialKey)) && 
                            (heirShare.some(([key]) => key === 'saudaraPerempuanSekandung' || key === 'saudaraPerempuanSebapak'))
                        if (isSpecialCase) {
                            const noOtherHeirs = ["suami", "ibu"].some(specialKey => !heirShare.some(([key, value]) => key === specialKey)) || 
                                !heirShare.some(([key]) => key === 'saudaraPerempuanSekandung' || key === 'saudaraPerempuanSebapak');
                            if (noOtherHeirs) {
                                setSpecialCasePortion(3)
                                setSpecialCasePart(4)
                                return null
                            }
                        } 
                        remaining -= share
                        return share
                    // dzawil furudh
                    } else {
                        remaining -= share
                        return share
                    }
                // albaqi for 'ibu' or 'kakek (in most share calculation)'
                } else if (String(value).includes("albaqi")) {
                    const albaqi = remaining / 3
                    remaining -= albaqi.toFixed(3)
                    return albaqi.toFixed(3)
                // asobah and muqosamah
                } else {
                    if (remaining <= 0) {
                        remaining = 0
                    }
                    setMuqosamahShare(remaining)
                    setAsobahShare(remaining)
                    return null
                    
                }})
            .filter(value => value !== null)
        setShareResult(results) 

        // set asobah bilghair portion
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

        // set muqosamah portion
        const isMuqosamah = sortedHeirShare.some(([key, value]) => value.part.includes("Muqosamah"))
        if (isMuqosamah) {
            console.log('setting muqosamah portion')
            const withSaudaraPerempuan = sortedHeirShare.some(([key, value]) => key.includes("saudaraPerempuan"))
            const portion = sortedHeirShare.reduce((total, [key, { number, part }]) => {
                if (part === "Muqosamah") {
                  return total + ((key.includes("LakiLaki") || key.includes("kakek")) && withSaudaraPerempuan ? number * 2 : number * 1);
                }
                return total;
              }, 0);
            setMuqosamahWithSaudaraPerempuan(withSaudaraPerempuan)
            setMuqosamahPortion(portion)
        } 

        // const isThreeShareCase = heirShare.some(([key, { number, part }]) => part === 'Most shares')
        // if (isThreeShareCase) {
        //     console.log('ThreeShareCase')
        //     setIsThreeShareKakek(true)
        // }
    }, [asalMasalah, shareList, sortedHeirShare])  

    // set rod and aul
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

        // musytarikah case handle
        if (!musytarikah && saudaraSeibuCasePortion) {
            const portion = sortedHeirShare
                .filter(([key]) => key === "saudaraLakiLakiSekandung" || key === "saudaraPerempuanSekandung")
                .reduce((acc, [key, value]) =>  acc + value.number ,0)
            setMusytarikah(true)
            // setMusytarikahPortion(portion)
            setSaudaraSeibuCasePortion(prevValue => prevValue += portion)
        }

    }, [shareResult, asobahShare, asalMasalah, musytarikah, saudaraSeibuCasePortion, sortedHeirShare, totalWealth, totalDept])

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
                                                    : (key === "kakekDariJalurBapak" || key === "saudaraPerempuanSekandung" || key === "saudaraPerempuanSebapak") && specialCasePart
                                                        ? <p>Rp. {Math.floor(wealthPerShare * specialCasePart)} special case</p>
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
                                                ? muqosamahShare
                                                : (key === "kakekDariJalurBapak" || key === "saudaraPerempuanSekandung" || key === "saudaraPerempuanSebapak") && specialCasePart
                                                    ? specialCasePart
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
                                    <p>{muqosamahShare}/{muqosamahPortion}</p>
                                    <p>{(key.includes("LakiLaki") || key.includes("kakek")) && muqosamahWithSaudaraPerempuan ? number*2 : number*1} x {Math.floor(wealthPerShare)}</p>
                                    <p>{number}</p>
                                    <p>Rp. {Math.floor(muqosamahShare / muqosamahPortion * ((key.includes("LakiLaki") || key.includes("kakek")) && muqosamahWithSaudaraPerempuan ? number*2 : number*1) * wealthPerShare / number)}</p>
                                </div>
                            )
                        }
                        // special case kakek
                        else if ((String(key).includes("kakek") || String(key).includes("saudaraPerempuan")) && specialCasePart) {
                            return (
                                <div className="share-division">
                                    <p>{specialCasePart}/{specialCasePortion}</p>
                                    <p>{key.includes("kakek") ? number*2 : number*1} x {Math.floor(wealthPerShare)}</p>
                                    <p>{number}</p>
                                    <p>Rp. {Math.floor(specialCasePart / specialCasePortion * (key.includes("kakek") ? number*2 : number*1) * wealthPerShare / number)}</p>
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