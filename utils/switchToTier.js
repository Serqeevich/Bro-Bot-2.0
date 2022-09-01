const switchToTier = (val) => {
    let thumbnail = " ";
    switch (val) {
        case 'Bronze1': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764480061046784/Bronze-1.png"
            break;
        case 'Bronze2': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764480304328734/Bronze-2.png"
            break;
        case 'Bronze3': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764480681836544/Bronze-3.png"
            break;
        case 'Bronze4': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764480954454026/Bronze-4.png"
            break;
        case 'Bronze5': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764481264828436/Bronze-5.png"
            break;

        case 'Silver1': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764518036295690/Silver-1.png"
            break;
        case 'Silver2': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764518321487884/Silver-2.png"
            break;
        case 'Silver3': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764518640267275/Silver-3.png"
            break;
        case 'Silver4': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764518984212520/Silver-4.png"
            break;
        case 'Silver5': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764519281991710/Silver-5.png"
            break;

        case 'Gold1': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764552995831858/Gold-1.png"
            break;
        case 'Gold2': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764553696251904/Gold-2.png"
            break;
        case 'Gold3': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764554015043594/Gold-3.png"
            break;
        case 'Gold4': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764554367361054/Gold-4.png"
            break;
        case 'Gold5': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764554652553236/Gold-5.png"
            break;

        case 'Platinum1': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764679487647744/Platinum-1.png"
            break;
        case 'Platinum2': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764686706016276/Platinum-2.png"
            break;
        case 'Platinum3': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764694817808444/Platinum-3.png"
            break;
        case 'Platinum4': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764702975750204/Platinum-4.png"
            break;
        case 'Platinum5': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764711049789450/Platinum-5.png"
            break;

        case 'Diamond1': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764834567815188/Diamond-1.png"
            break;
        case 'Diamond2': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764842537013248/Diamond-2.png"
            break;
        case 'Diamond3': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764849361125476/Diamond-3.png"
            break;
        case 'Diamond4': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764855770046494/Diamond-4.png"
            break;
        case 'Diamond5': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764863772786728/Diamond-5.png"
            break;

        case 'Master1': thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764877798535188/Master.png"
            break;

        default: thumbnail = "https://cdn.discordapp.com/attachments/976764414487306290/976764886568808458/Unranked.png"
            break;
    }
    return thumbnail;
}
module.exports.switchToTier = switchToTier;