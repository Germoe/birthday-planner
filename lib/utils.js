export function getMonth(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}  

export function getDate(date) {
    var day = date.getDate();
    return day < 10 ? '0' + day : '' + day; // ('' + day) for string result
}  


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getMonthName(date) {
    const month = date.getMonth()
    return monthNames[month]
}