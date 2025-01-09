// const filteredAhliWaris = {bapak: 1} 
// note: if value = 0, could't insert into this object. this's only an example  

function law(filteredAhliWaris) {
    function areSiblingMoreThanOne(data) {
        // Daftar kunci yang terkait dengan saudara
        const siblingKeys = [
            "saudaraLakiLakiSekandung",
            "saudaraLakiLakiSeibu",
            "saudaraLakiLakiSebapak",
            "saudaraPerempuanSekandung",
            "saudaraPerempuanSeibu",
            "saudaraPerempuanSebapak"
        ];

        // Periksa apakah ada saudara dengan jumlah lebih dari 1
        const count = siblingKeys.reduce((acc, key) => acc + data[key], 0);
        return count > 1;
    }

    function areThereMainHeir(data) {
        // Daftar kunci yang terkait dengan ahli waris inti
        const mainHeir = [
            "anakLakiLaki",
            "anakPerempuan",
            "cucuLakiLaki",
            "cucuPerempuan",
            "bapak",
            "kakekDariJalurBapak"
        ]

        // Periksa apakah ada ahli waris inti  
        return mainHeir.some(key => data[key]);
    }

    function areThereSaudaraSekandungOrSebapak(data) {
        const sekandungSebapak = [
            "saudaraLakiLakiSekandung",
            "saudaraLakiLakiSebapak",
            "saudaraPerempuanSekandung",
            "saudaraPerempuanSebapak"
        ]

        // Periksa apakah ada saudara sekandung atau sebapak
        return sekandungSebapak.some(key => data[key]);
    }

    function arePortionSaudaraSekandungAndSebapakMoreThanThree(data) {
        const saudaraLakiLaki = [
            "saudaraLakiLakiSekandung",
            "saudaraLakiLakiSebapak",
        ]
        
        const saudaraPerempuan = [
            "saudaraPerempuanSekandung",
            "saudaraPerempuanSebapak"
        ]

        // Periksa apakah ada saudara dengan jumlah lebih dari 1
        const portionLakiLaki = saudaraLakiLaki.reduce((acc, key) => acc + data[key], 0);
        const portionPerempuan = saudaraPerempuan.reduce((acc, key) => acc + data[key], 0);
        const result = (portionLakiLaki*2) + portionPerempuan
        return result >= 3;
    }

    function areThereHeirExceptSaudaraSekandungOrSebapak(data) {
        const heirArray = [
            "ibu",
            "anakPerempuan",
            "anakLakiLaki",
            "suami",
            "istri",
            "cucuLakiLaki",
            "cucuPerempuan"
        ]

        return heirArray.some(key => data[key])
    }

    const result = {
        bapak: {
            number: filteredAhliWaris.bapak || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki 
                    ? "1/6" 
                    : "Asobah binafsi"
            ) 
        },
        ibu: {
            number: filteredAhliWaris.ibu || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.anakPerempuan || areSiblingMoreThanOne(filteredAhliWaris)
                    ? "1/6" 
                    : (filteredAhliWaris.suami || filteredAhliWaris.istri) && filteredAhliWaris.bapak 
                        ? "albaqi"
                        : "1/3"
            ),
            // hajib: [
            //     "nenekDariJalurBapak",
            //     "nenekDariJalurIbu"
            // ]
        },
        anakPerempuan: {
            number: filteredAhliWaris.anakPerempuan || null,
            part: (
                filteredAhliWaris.anakLakiLaki
                    ? "Asobah bilghair"
                    : filteredAhliWaris.anakPerempuan > 1 
                        ? "2/3"
                        : "1/2"
            ),
            // hajib: [
            //     filteredAhliWaris.anakPerempuan > 1
            //         ? "cucuPermpuan"
            //         : filteredAhliWaris.anakPerempuan && filteredAhliWaris.anakLakiLaki
            //             ? ["cucuLakiLaki", "cucuPerempuan"]
            //             : undefined
            // ]
        },
        anakLakiLaki: {
            number: filteredAhliWaris.anakLakiLaki || null,
            part: (
                filteredAhliWaris.anakPerempuan 
                    ? "Asobah bilghair" 
                    : "Asobah binafsi"
            ),
            // hajib: [
            //     "cucuLakiLaki",
            //     "cucuPerempuan"
            // ]
        },
        suami: {
            number: filteredAhliWaris.suami || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.cucuPerempuan
                    ? "1/4" ////
                    : "1/2"
            )
        },
        istri: {
            number: filteredAhliWaris.istri || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.cucuPerempuan
                    ? "1/8" ////
                    : "1/4"
            )
        },
        saudaraLakiLakiSekandung: { ///
            number: filteredAhliWaris.saudaraLakiLakiSekandung || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.bapak
                ? null
                : filteredAhliWaris.saudaraPerempuanSekandung
                    ? "Asobah bilghair"
                    : "Asobah binafsi"
            )
        },
        saudaraLakiLakiSebapak: {
            number: filteredAhliWaris.saudaraLakiLakiSebapak || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.bapak || filteredAhliWaris.saudaraLakiLakiSekandung
                ? null
                : filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan 
                    ? filteredAhliWaris.saudaraPerempuanSekandung 
                        ? null 
                        : filteredAhliWaris.saudaraPerempuanSebapak
                            ? "Asobah bilgahir"
                            : "Asobah binafsi"
                    : filteredAhliWaris.saudaraPerempuanSebapak
                            ? "Asobah bilghair" 
                            : "Asobah binafsi"
                )
        }, 
        saudaraLakiLakiSeibu: {
            number: filteredAhliWaris.saudaraLakiLakiSeibu || null,
            part: (
                areThereMainHeir(filteredAhliWaris)
                    ? null
                    : filteredAhliWaris.saudaraPerempuanSeibu
                        ? "1/3"
                        : "1/6"
            )
        }, 
        saudaraPerempuanSekandung: { ///
            number: filteredAhliWaris.saudaraPerempuanSekandung || null,
            part: filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.bapak
                ? null
                : (filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan) && filteredAhliWaris.saudaraLakiLakiSekandung
                    ? "Asobah bilghair"
                    : filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan
                        ? "Asobah maalghair"
                        : filteredAhliWaris.saudaraLakiLakiSekandung 
                            ? "Asobah bilghair"
                            : filteredAhliWaris.saudaraPerempuanSekandung > 1
                                ? "2/3"
                                : "1/2"
        }, 
        saudaraPerempuanSebapak: {
            number: filteredAhliWaris.saudaraPerempuanSebapak || null,
            part: (
                filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.bapak || filteredAhliWaris.saudaraLakiLakiSekandung
                ? null
                : filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan
                    ? filteredAhliWaris.saudaraPerempuanSekandung
                        ? null
                        : filteredAhliWaris.saudaraLakiLakiSebapak
                            ? "Asobah bilghair"
                            : "Asobah maalghair"
                    : filteredAhliWaris.saudaraLakiLakiSebapak
                        ? "Asobah bilghair"
                        : filteredAhliWaris.saudaraPerempuanSekandung > 1
                            ? null
                            : filteredAhliWaris.saudaraPerempuanSebapak
                                ? "1/6"
                                : !filteredAhliWaris.saudaraPerempuanSekandung && filteredAhliWaris.saudaraPerempuanSebapak > 1
                                    ? "2/3"
                                    : "1/2"
            )                
        }, 
        saudaraPerempuanSeibu: {
            number: filteredAhliWaris.saudaraPerempuanSeibu || null,
            part: (
                areThereMainHeir(filteredAhliWaris)
                    ? null
                    : filteredAhliWaris.saudaraLakiLakiSeibu
                        ? "1/3"
                        : "1/6"
            )
        },  
        cucuLakiLaki: {
            number: filteredAhliWaris.cucuLakiLaki || null,
            part: (
                    filteredAhliWaris.anakLakiLaki
                        ? null
                        : filteredAhliWaris.cucuPerempuan
                            ? "Asobah bilghair"
                            : "Asobah binafsi"
            )
        },
        cucuPerempuan: {
            number: filteredAhliWaris.cucuPerempuan || null,
            part: (
                    filteredAhliWaris.anakLakiLaki
                        ? null
                        : filteredAhliWaris.cucuLakiLaki
                            ? "Asobah bilghair"
                            : filteredAhliWaris.anakPerempuan > 1
                                ? null
                                : filteredAhliWaris.anakPerempuan
                                    ? "1/6"
                                    : filteredAhliWaris.cucuPerempuan > 1
                                        ? "2/3"
                                        : "1/2"
            )
        },
        kakekDariJalurBapak: {
            number: filteredAhliWaris.kakekDariJalurBapak || null,
            part: (
                filteredAhliWaris.bapak
                    ? null
                    : areThereSaudaraSekandungOrSebapak(filteredAhliWaris)
                        ? areThereHeirExceptSaudaraSekandungOrSebapak(filteredAhliWaris)
                            ? 'Most shares'
                            : arePortionSaudaraSekandungAndSebapakMoreThanThree(filteredAhliWaris)
                                ? "1/3"
                                : "Muqosamah"
                        : filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki 
                            ? "1/6"
                            : "Asobah binafsi"
            )
        }, 
        nenekDariJalurBapak: {
            number: filteredAhliWaris.nenekDariJalurBapak || null,
            part: (
                filteredAhliWaris.ibu
                    ? null
                    : filteredAhliWaris.bapak && filteredAhliWaris.nenekDariJalurIbu
                        ? "1/6"
                        : filteredAhliWaris.bapak
                            ? null
                            : "1/6"     
            )
        }, 
        nenekDariJalurIbu: {
            number: filteredAhliWaris.nenekDariJalurIbu || null,
            part: (
                filteredAhliWaris.ibu
                    ? null
                    : "1/6"
            )
        }, 
    }

    return result
}

export default law
