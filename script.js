//Code will run when browser is finished rendering all the elements in the html.
$(document).ready(function () {
  //Today's date
  const todaysDate = $("header #currentDay");

  let tasks = {};

  //When was calender last displayed
  let timeDisplayed = dayjs(); //leave...added  .hour(); nothing changed.

  //Display calender
  function displaySchedule(today, tasks) {
    //creating rows @ 9am.
    let hourBlock = dayjs(today).hour(9); //leave
    const schedule = $("div.container"); //select the schedule div.
    //empty schedule of previous hourBlocks.
    schedule.empty();

    //Create rows 9am-5pm with loop.
    for (let i = 1; i <= 10; i++) {
      //Creating rows for each hour.
      const row = $("<div>").addClass("row");
      //Colors for past, present, and future time blocks.
      let timeBlock = ""; 
      hourBlock.hour(i);

      if (today.isBefore(hourBlock, "hour")) {
        timeBlock = "future"
      } else if (today.isAfter(hourBlock, "hour")) {
        timeBlock = "past"
      } else {
        timeBlock = "present"
      };
      
      schedule.append(row);
      //adding row block to row
      row.append
        ($("<div>").addClass("col-2 hour").text(hourBlock.format("h A")
      )); //Hours, 12-hour clock, AM PM. (it's only showing 9am in each row, fix)

      let block = hourBlock.format("hA");
      //added extra parenthesis to end of block));
      row.append(
        $("<textarea>").addClass(`col-8 ${timeBlock}`).text(tasks[block])
      )

      //column for button to save scheduled event for each row.
      row.append(
        $("<button>").
        addClass("col-2 saveBtn")
        .html("<i class='fas fa-save'></i>")
      )
      //row.append(
       // $("<button>")
          //.addClass("col-2 saveBtn")
          //.attr("id", block).html("<i class='fas fa-save'></i"))

      //increase hour before creating next row.
      hourBlock = dayjs(today).hour(9 + i);
      //setting schedule display time.
      timeDisplayed = dayjs(); 
    };
  };

  //init schedule
  function initSchedule() {
    //setting current date.
    const today = dayjs(); 
//console.log(today.format('LL')); 
    todaysDate.text(today.format('dddd, MMMM D, YYYY'));       
    displaySchedule(today, tasks);
  };
  
   // console.log(timeDisplayed)
//change below:
//function updateTime() {
  //const currentTime = dayjs().format("h:mm:ss A");
  //$("header #currentTime").text(currentTime);
//}

//setInterval(updateTime, 15000);



  //retrieve events from local storage.
  function retrieveSchedule() {
    const savedSchedule = JSON.parse(localStorage.getItem("tasks"));
    if (savedSchedule) {
      tasks = savedSchedule;
    };
  };

  //when page is retrieved. Retrieve schedule events from local storage.
  retrieveSchedule();
  //setting the current date and displaying the schedule.
  initSchedule();
  //checking the hour
  hourChecker();

  //keeping track of time to determine hour block needed.
  function hourChecker() {
    const checkHourlyInterval = setInterval(function () {
      if (dayjs().isAfter(timeDisplayed, "minute")) {
        
        initSchedule();
      }
    }, 60000);
  };

  //storing schedule events in local storeage
  function saveSchedule() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  //Delete schedule of all tasks.
  function deleteSchedule() {
    tasks = {};
    saveSchedule();
    initSchedule();
  };

  $("button#delete-schedule").on("click", deleteSchedule);
  //save button to save schedule
  $(document).on("click", "button.saveBtn", function (event) {
    let schDescription = event.currentTarget.parentElement.children[1].value;
    tasks[event.currentTarget.id] = schDescription;
    saveSchedule(); //storing tasts in local storage.
  });
});
