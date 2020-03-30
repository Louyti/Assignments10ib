var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

var todayDate = dd + '/' + mm + '/' + yyyy;

function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

function Assignment(name, dueDate, dueTime, ACT, donations, data){
    this.name = name;
    this.dueDate = dueDate;
    this.dueTime = dueTime;
    this.ACT = ACT;
    this.donations = donations;
    this.data = data;
}

let assignments = [];

init();
daySet();
startTime();

function startTime() {
    today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if(hour < 10) hour = '0' + hour;
    if(minute < 10) minute = '0' + minute;
    if(second < 10) second = '0' + second;
    var x3 = hour+':'+minute+':'+second;
    document.getElementById("thetime").innerHTML = x3;
    setTimeout(startTime, 500);
}

function daySet(){
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var Atomorrow = new Date();
    Atomorrow.setDate(Atomorrow.getDate() + 2);
    document.getElementById("day1").innerHTML = getDayName(tomorrow, "en-US");
    document.getElementById("day2").innerHTML = getDayName(Atomorrow, "en-US");
}

function insertToday(assignment){
    let str = `<div class = "assignmentContainer">
    <div class = "toprow">
        <div class = "titleA">${assignment.name}</div>
        <div class = "dueA">${assignment.dueTime}</div>
    </div>
    <div class = "secondrow">
        <div class = "complTime">Average Completion Time: ${assignment.ACT}</div>
    </div>
    <div class = "data">${assignment.data}
    </div>
    <div class = "bottomRow">
        <div class = "dons">Donations:</div>
        <a href="${assignment.donations[0][1]}" download class = "file">${assignment.donations[0][0]}</a>
    </div>
</div>`
    document.getElementById("assignments").insertAdjacentHTML('beforeend',str);
}

function insertT(assignment, day){
    let str = `
    <div class = "assignmentContainer" id = "more">
        <div class = "toprow">
            <div class = "titleA2">${assignment.name}</div>
        </div>
        <div class = "secondrow">
            <div class = "complTime">ACT: ${assignment.ACT}</div>
        </div>
        <div class = "hiddendata">${assignment.data}
        </div>
        <button class = "opener">...</button>
    </div>`
    document.getElementById("assignments" + day).insertAdjacentHTML('beforeend',str);

}

function init() {
    loadJSON(function(response) {
       var actual_JSON = JSON.parse(response).assignments;
       for(i = 0; i < actual_JSON.length; i++){
           assignments.push(actual_JSON[i]);
       }
       refreshAss();
    });
   }

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'ass.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

function refreshAss(){
    for(i = 0; i < assignments.length; i++){
        var dateParts = assignments[i].dueDate.split("/");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); 
        if(assignments[i].dueDate == todayDate){
            insertToday(assignments[i]);
        }
        else if(dateObject.getDate() <= today.getDate() + 2){
            insertT(assignments[i], dateObject.getDate() - today.getDate());
        }
    }
}
