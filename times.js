var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

let scrVal = 0;

var todayDate = dd + '/' + mm + '/' + yyyy;

function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

let assignments = [];

document.getElementById("tlText").innerHTML = todayDate;

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
    for(i = 0; i < 6; i++){
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + i + 1);
        document.getElementById("day" + (i+1)).innerHTML = getDayName(tomorrow, "en-US");
    }
}

function moveP(way){
    scrVal += way;
    if(scrVal < 0) scrVal = 0;
    if(scrVal > 2) scrVal = 2;
    switch(scrVal){
        case 0:
            document.getElementById("bLeft").style.opacity = "0";
            document.getElementById("bRight").style.opacity = "1";
        break;
        case 1:
            document.getElementById("bRight").style.opacity = "1";
            document.getElementById("bLeft").style.opacity = "1";
        break;
        case 2:
            document.getElementById("bRight").style.opacity = "0";
            document.getElementById("bLeft").style.opacity = "1";
        break;

    }
    document.getElementById("right").scrollBy(window.innerWidth * way / 2, 0);
}

function insertToday(assignment){
    let str = `<div class = "assignmentContainer">
    <div class = "toprow">
        <div class = "titleA">${assignment.name}</div>
        <div class = "dueA">${assignment.dueTime}</div>
    </div>
    <div class = "secondrow">
        <div class = "complTime">Average Completion Time: ${assignment.ACT}</div>`
    for(f = 0; f < assignment.files.length; f++){
        str +=`<a href="${assignment.files[f][1]}" download class = "file">${assignment.files[f][0]}</a>`
    }
    str += `</div>
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
            <div class = "complTime">ACT: ${assignment.ACT}</div>`
    for(f = 0; f < assignment.files.length; f++){
        str +=`<a href="${assignment.files[f][1]}" download class = "file">${assignment.files[f][0]}</a>`
    }
    str += ` </div>
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
        const diffTime = Math.abs(dateObject - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if(assignments[i].dueDate == todayDate){
            insertToday(assignments[i]);
        }
        else if(diffDays <= 6){
            //alert(today.getDate());
            insertT(assignments[i], diffDays);
        }
    }
}
