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
        return siblingKeys.some(key => data[key] > 1);
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

    function areTherezawilFurudh(data) {
        const dzawilFurudh = [
            "anakPerempuan",
            "cucuPerempuan",
            "ibu",
            "saudaraLakiLakiSeibu",
            "saudaraPerempuanSekandung",
            "saudaraPerempuanSebapak",
            "saudaraPerempuanSeibu",
            "nenekDariJalurIbu",
            "nenekDariJalurBapak"
        ]

        // Periksa apakah ada dzawil furudh
        return dzawilFurudh.some(key => data[key]);
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
                        ? "1/3 albaqi"
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
                    : filteredAhliWaris.anakLakiLaki > 1
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
                    ? "1/6" ////
                    : "1/3"
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
                : (filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan) && filteredAhliWaris.saudaraPerempuanSekandung
                    ? "Asobah bilghair"
                    : filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan
                        ? "Asobah binafsi"
                        : (!filteredAhliWaris.anakPerempuan || !filteredAhliWaris.cucuPerempuan) && filteredAhliWaris.saudaraPerempuanSekandung
                            ? "Asobah bilghair"
                            : !filteredAhliWaris.anakPerempuan || !filteredAhliWaris.cucuPerempuan
                                ? "Asobah binafsi"
                                : filteredAhliWaris.suami || filteredAhliWaris.ibu || filteredAhliWaris.saudaraPerempuanSeibu
                                    ? "Musytarikah"
                                    : null 
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
                    : "1/3"
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
                        : (!filteredAhliWaris.anakPerempuan || !filteredAhliWaris.cucuPerempuan) && filteredAhliWaris.saudaraLakiLakiSekandung
                            ? "Asobah bilghair"
                            : (!filteredAhliWaris.anakPerempuan || !filteredAhliWaris.cucuPerempuan) && filteredAhliWaris.saudaraPerempuanSekandung > 1
                                ? "2/3"
                                : !filteredAhliWaris.anakPerempuan || !filteredAhliWaris.cucuPerempuan
                                    ? "1/2"
                                    : (filteredAhliWaris.suami || filteredAhliWaris.ibu || filteredAhliWaris.saudaraPerempuanSeibu) && filteredAhliWaris.saudaraLakiLakiSekandung
                                        ? "Musytarikah"
                                        : (filteredAhliWaris.suami || filteredAhliWaris.ibu || filteredAhliWaris.saudaraPerempuanSeibu) && filteredAhliWaris.saudaraPerempuanSekandung > 1
                                            ? "2/3" 
                                            : filteredAhliWaris.suami || filteredAhliWaris.ibu || filteredAhliWaris.saudaraPerempuanSeibu
                                                ? "1/2" 
                                                : null
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
                    // : !filteredAhliWaris.saudaraPerempuanSekandung > 1 && filteredAhliWaris.saudaraLakiLakiSebapak
                    //     ? "Asobah bilghair"
                    //     : !filteredAhliWaris.saudaraPerempuanSekandung > 1 && filteredAhliWaris.saudaraPerempuanSebapak > 1
                    //         ? "2/3"
                    //         : !filteredAhliWaris.saudaraPerempuanSekandung > 1
                    //             ? "1/2"
                    //             : filteredAhliWaris.saudaraPerempuanSekandung > 1 && filteredAhliWaris.saudaraLakiLakiSebapak
                    //                 ? "Asobah bilghair"
                    //                 : filteredAhliWaris.saudaraPerempuanSekandung
                    //                     ? null
                    //                     : filteredAhliWaris.saudaraPerempuanSekandung && filteredAhliWaris.saudaraLakiLakiSebapak
                    //                         ? "Asobah bilghair"
                    //                         : filteredAhliWaris.saudaraPerempuanSekandung
                    //                             ? "1/6"
                    //                             : undefined
            )

            // part: (() => {
            //     if (filteredAhliWaris.anakLakiLaki || filteredAhliWaris.cucuLakiLaki || filteredAhliWaris.bapak || filteredAhliWaris.saudaraLakiLakiSekandung) {
            //         return null
            //     } else if (filteredAhliWaris.anakPerempuan || filteredAhliWaris.cucuPerempuan) {
            //         if (filteredAhliWaris.saudaraPerempuanSekandung) {
            //             return null
            //         } else if (filteredAhliWaris.saudaraLakiLakiSebapak) {
            //             return "Asobah bilghair"
            //         } else {
            //             return "Asobah maalghair"
            //         }
            //     } else if (!filteredAhliWaris.saudaraPerempuanSekandung > 1 && filteredAhliWaris.saudaraLakiLakiSebapak) {
            //         return "Asobah bilghair"
            //     } else if (!filteredAhliWaris.saudaraPerempuanSekandung > 1 && filteredAhliWaris.saudaraPerempuanSebapak > 1) {
            //         return "2/3"   
            //     } else if (!filteredAhliWaris.saudaraPerempuanSekandung > 1) {
            //         return "1/2"
            //     } else if (filteredAhliWaris.saudaraPerempuanSekandung > 1 && filteredAhliWaris.saudaraLakiLakiSebapak) {
            //         return "Asobah bilghair"
            //     } else if (filteredAhliWaris.saudaraPerempuanSekandung > 1) {
            //         return null
            //     } else if (filteredAhliWaris.saudaraPerempuanSekandung && filteredAhliWaris.saudaraLakiLakiSebapak) {
            //         return "Asobah bilghair"
            //     } else if (filteredAhliWaris.saudaraPerempuanSekandung) {
            //         return "1/6"
            //     }
            // }),

                
        }, 
        saudaraPerempuanSeibu: {
            number: filteredAhliWaris.saudaraPerempuanSeibu || null,
            part: (
                areThereMainHeir(filteredAhliWaris)
                    ? null
                    : "1/3"
            )
        },  
        cucuLakiLaki: {
            number: filteredAhliWaris.cucuLakiLaki || null,
            part: (
                    filteredAhliWaris.anakLakiLaki
                        ? null
                        : filteredAhliWaris.anakPerempuan && filteredAhliWaris.cucuPerempuan
                            ? "Asobah bilghair"
                            : "Asobah binafsi"
            )
        },
        cucuPerempuan: {
            number: filteredAhliWaris.cucuPerempuan || null,
            part: (
                    filteredAhliWaris.anakLakiLaki
                        ? null
                        : filteredAhliWaris.anakPerempuan > 1 && filteredAhliWaris.cucuLakiLaki
                            ? "Asobah bilghair"
                            : filteredAhliWaris.anakPerempuan > 1
                                ? null
                                : filteredAhliWaris.anakPerempuan && filteredAhliWaris.cucuLakiLaki
                                    ? "Asobah bilghair"
                                    : filteredAhliWaris.cucuLakiLaki
                                        ? "Asobah bilghair"
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
                    : areTherezawilFurudh(filteredAhliWaris)
                        ? "1/6"
                        : undefined ///
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
