const switchToColor = (val) => {
    let color1 = ' ';
    switch (val) {
        case 'Bronze': color1 = '#8B4513'
            break;
        case 'Silver': color1 = '#C0C0C0'
            break;
        case 'Gold': color1 = '#FFD700'
            break;
        case 'Platinum': color1 = '#4682B4'
            break;
        case 'Diamond': color1 = '#0000FF'
            break;
        case 'Master': color1 = '#00FF00'
            break;
        default: color1 = '#E6E6FA'
    }
    return color1;
};
module.exports.switchToColor = switchToColor;