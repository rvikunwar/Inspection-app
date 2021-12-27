/**
 * 
 * @description for processing timestamp
 * @returns a formatted time
 */
export const renderTimestamp = (timestamp) => {
    let date= new Date(timestamp)

    const timeDiff = Math.round(
        (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );

    var hours = date.getHours();

    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    let time = `${date.getDate()} ${date.toLocaleString('default', {
        month: 'short',
    })}, ${date.getFullYear()} ${strTime}`;

    if(Math.round(timeDiff / (60 * 24))>=1){
        return time
    }

    return strTime;
}