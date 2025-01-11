function kakekMostShares(heirShare, asalMasalah, shareList, asobahShare, asobahPortion) {

    let resultHeirShare
    
    let areThereSudaraPerempuan = false // for muqosamah
    function updateHeirShare(part) {
        return heirShare.map(([key, item]) => {
            if (key.includes('kakek')) {
                return [key, { ...item, part}]
            } 
            if (part === 'Muqosamah' &&  ['saudaraPerempuan', 'saudaraLakiLaki'].some(condition => key.includes(condition))) {
                if (key.includes('saudaraPerempuan')) {
                    areThereSudaraPerempuan = true
                }
                return [key, { ...item, part}]
                // return [key, item]
            }
            return [key, item]
        })
    }
    
    let remaining = asalMasalah
    shareList
        .filter(item => typeof item === 'number')
        .forEach(value => {
            const share = asalMasalah * value
            remaining -= share
        })

    const muqosamah = updateHeirShare('Muqosamah')
    const albaqi = updateHeirShare('albaqi')
    const oneSixth = updateHeirShare('1/6')

    const muqosamahResult = asobahShare / (areThereSudaraPerempuan ? asobahPortion+2 : asobahPortion+1) * (areThereSudaraPerempuan ? 2 : 1)
    const albaqiResult = remaining / 3
    const oneSixthResult = asalMasalah / 6

    const MostShare = Math.max(muqosamahResult, albaqiResult, oneSixthResult)
    if (MostShare === muqosamahResult) {
        resultHeirShare = muqosamah;
    } else if (MostShare === albaqiResult) {
        resultHeirShare = albaqi;
    } else if (MostShare === oneSixthResult) {
        resultHeirShare = oneSixth;
    }

    console.log("kakek shares: ", resultHeirShare)
    return resultHeirShare
}

export default kakekMostShares
