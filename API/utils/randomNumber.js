function randomNumber() {

    let num1 = Math.floor(Math.random() * (9 - 1) + 1);
    let num2 = Math.floor(Math.random() * (9 - 1) + 1);
    let num3 = Math.floor(Math.random() * (9 - 1) + 1);
    let num4 = Math.floor(Math.random() * (9 - 1) + 1);
    return `${num1}${num2}${num3}${num4}`;

} module.exports.randomNumber = randomNumber;