//Code will run when browser is finished rendering all the elements in the html.
$(document).ready(function () {

//Today's date
const todaysDate = $("header #currentDay");

//Storing schedule daily task in tasks object.
let tasks = {};

//Track when calendar was last displayed.
let timeDisplayed = dayjs(); 

//Display schedule
function displaySchedule(today, tasks) {

  //creating rows from 9am.
  let hourBlock = dayjs(today).hour(9); 

  const schedule = $("div.container");

  //empty schedule of previous hourBlocks.
  schedule.empty();

  //Create rows 9am-5pm with loop.
  for (let i = 1; i <= 9; i++) {
      
    //Creating rows for each hour.
    const row = $("<div>").addClass("row")

    let timeBlock = ""
    hourBlock.hour(i)

    if (today.isBefore(hourBlock, "hour")) {
       timeBlock = "future"
    } else if (today.isAfter(hourBlock, "hour")) {
      timeBlock = "past"
    } else {
      timeBlock = "present"
    };

    schedule.append(row);

    //adding row block to row
    row.append(
    $("<div>").addClass("col-2 hour").text(hourBlock.format("h A"))
    ) //Hours, 12-hour clock, AM PM.

    let block = hourBlock.format("hA")

    //Creating save button for columns  
    row.append(
    $("<textarea>").addClass(`col-8 ${timeBlock}`).text(tasks[block])
    )

    //column for button to save scheduled event for each row
    row.append(
    $("<button>")
    .addClass("col-2 saveBtn")
    .attr("id", `row-${i}`)
    .html("<i class='fas fa-save'></i>")
    );

    //increase hour before creating next row.
    hourBlock = dayjs(today).hour(9 + i);

    //setting schedule display time.
    timeDisplayed = dayjs();
    }
  }

  //init schedule
  function initSchedule() {
    //setting current date.
    const today = dayjs();
    todaysDate.text(today.format("dddd, MMMM D, YYYY"));
    displaySchedule(today, tasks);
  };

  //retrieve events from local storage.
  function retrieveSchedule() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || {}
  };

  //when page is retrieved. Retrieve schedule events from local storage.
  retrieveSchedule();
  //setting the current date and displaying the schedule.
  initSchedule();
  //checking the hour
  hourChecker();

  //keeping track of time to determine hour block needed.
  function hourChecker() {
    const checkHourlyInterval = setInterval(() => {
      if (dayjs().isAfter(timeDisplayed, "minute")) {
        initSchedule();
      }
    }, 60000);
  };

  //storing schedule events in local storeage   
  const saveSchedule = () => localStorage.setItem("tasks", JSON.stringify(tasks));

  //Delete schedule of all tasks.
  function deleteSchedule() {
    tasks = {};
    saveSchedule();
    initSchedule();
  };

  $("button#delete-schedule").click(deleteSchedule);

  //save button to save schedule
  $(document).on("click", "button.saveBtn", handleSaveClick)
  function handleSaveClick(event) {
    let schDescription = event.currentTarget.parentElement.children[1].value;
    let block = event.currentTarget.parentElement.children[0].innerText.replace(" ", "");
    tasks[block] = schDescription;
  saveSchedule();
}
});
    
