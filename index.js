let data = {};
const addNewTaskBtn = document.getElementById("addNewTask");
const clearAllTasksBtn = document.getElementById("clearAllTasks");

addNewTaskBtn.addEventListener("click", async () => {
  addNewTask();
});
clearAllTasksBtn.addEventListener("click", async () => {
  clearAllTasks();
});

function runApp() {
  initApp();
}

function initApp() {
  const timesheet = window.localStorage.getItem("timesheet");
  data = timesheet ? JSON.parse(timesheet) : {};
  renderTable();
}

function getWeekDates() {
  const dates = [];
  const currentDate = new Date();

  for (let index = 1; index <= 5; index++) {
    let d = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + index)
    );

    dates.push(
      d.toLocaleDateString().split("/")[1] +
        "/" +
        d.toLocaleDateString().split("/")[0]
    );
  }

  return dates;
}

function renderTable() {
  let rows = ``;
  let weeklyHrs = 0;
  let dates = getWeekDates();

  rows += `<tr><td></td>`;
  for (const date of dates) {
    rows += `<td>${date}</td>`;
  }
  rows += `<td></td></tr>`;

  for (const key in data) {
    const rec = data[key];

    rows += `<tr>
              <td>${key}</td>
              <td><input type="text" value="${
                rec.mo
              }" task="${key}" name="mo" /></td>

              <td><input type="text" value="${
                rec.tu
              }" task="${key}" name="tu" /></td>

              <td><input type="text" value="${
                rec.we
              }" task="${key}" name="we" /></td>

              <td><input type="text" value="${
                rec.th
              }" task="${key}" name="th" /></td>

              <td><input type="text" value="${
                rec.fr
              }" task="${key}" name="fr" /></td>

              <td style="display: flex; justify-content: space-between;">
                <span>${getTotalTaskTime(rec)} Hrs</span>
                <button class="remove-btn" title="Remove" task="${key}">X</button>
              </td>
            </tr>`;

    for (const day in rec) {
      weeklyHrs += rec[day] || 0;
    }
  }

  rows += `<tr>
              <td><b>Total Day Time</b></td>
              <td>${getTimeByDay("mo")}</td>
              <td>${getTimeByDay("tu")}</td>
              <td>${getTimeByDay("we")}</td>
              <td>${getTimeByDay("th")}</td>
              <td>${getTimeByDay("fr")}</td>
              <td><b class='total-week-time'>${weeklyHrs} Hrs</b></td>
          </tr>`;

  window.document.getElementById("data-elem").innerHTML = rows;

  // attaching events
  const inputEls = document.getElementsByTagName("input");
  const removeBtns = document.getElementsByClassName("remove-btn");

  for (let index = 0; index < inputEls.length; index++) {
    const element = inputEls[index];
    element.addEventListener("blur", () => updateHrs(element));
  }
  for (let index = 0; index < removeBtns.length; index++) {
    const element = removeBtns[index];
    element.addEventListener("click", () => removeTask(element));
  }
}

function getTotalTaskTime(task) {
  let total = 0;
  for (const day in task) total += task[day] || 0;

  return total;
}

function updateHrs(e) {
  let Obj = { ...data };
  const name = e.name;
  const task = e.getAttribute("task");

  let value = parseInt(e.value);
  value = isNaN(value) ? "" : value;

  Obj[task][name] = value;
  data = Obj;

  window.localStorage.setItem("timesheet", JSON.stringify(data));
  renderTable();
}

function getTimeByDay(day) {
  let total = 0;
  console.log(data);

  for (const task in data) total += data[task][day] || 0;

  return total + " Hrs";
}

function addNewTask() {
  const name = prompt("Enter Task Name: ");

  if (name) {
    data[name] = { mo: "", tu: "", we: "", th: "", fr: "" };

    window.localStorage.setItem("timesheet", JSON.stringify(data));
  }

  renderTable();
}

function clearAllTasks() {
  const choice = window.confirm(
    "Are you sure, Do you want to clear week data?"
  );

  if (!choice) {
    return;
  }

  window.localStorage.clear();
  initApp();
}

function removeTask(e) {
  const task = e.getAttribute("task");
  const object = {};

  const choice = window.confirm(
    `Are you sure, Do you want to remove "${task}"?`
  );

  if (!choice) {
    return;
  }

  for (const t in data) {
    if (task != t) {
      object[t] = data[t];
    }
  }

  data = object;
  window.localStorage.setItem("timesheet", JSON.stringify(data));
  renderTable();
}

// start application
runApp();
