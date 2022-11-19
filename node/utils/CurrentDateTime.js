
function twoDigit(nb)
{
    if (nb < 10)
        return "0" + nb.toString()
    else
        return nb.toString()
}

//Get the curretn dateTime well formated
const CurrentDateTime = () => {
    let date = new Date(Date.now());
    return twoDigit(date.getDate()) + "-" + twoDigit(date.getMonth() + 1) + "-" + date.getFullYear().toString() + "T" + twoDigit(date.getHours()) + ":" + twoDigit(date.getMinutes()) + ":" + twoDigit(date.getSeconds());
}

module.exports = CurrentDateTime;