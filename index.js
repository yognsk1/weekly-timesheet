let data = {};

const runApp = () => {
  initApp();
};

const initApp = () => {
  const timesheet = localStorage.getItem("timesheet");
  data = timesheet ? JSON.parse(timesheet) : {};
  renderTable();
};

const renderTable = () => {
  let rows = ``;
  let weeklyHrs = 0;

  for (const key in data) {
    const rec = data[key];

    rows += `<tr>
              <td>${key}</td>
              <td><input type="text" value="${
                rec.mo || ""
              }" onkeyup="updateHrs(this);" task="${key}"" name="mo" /></td>

              <td><input type="text" value="${
                rec.tu || ""
              }" onkeyup="updateHrs(this);" task="${key}"" name="tu" /></td>

              <td><input type="text" value="${
                rec.we || ""
              }" onkeyup="updateHrs(this);" task="${key}"" name="we" /></td>

              <td><input type="text" value="${
                rec.th || ""
              }" onkeyup="updateHrs(this);" task="${key}"" name="th" /></td>

              <td><input type="text" value="${
                rec.fr || ""
              }" onkeyup="updateHrs(this);" task="${key}"" name="fr" /></td>

              <td>${getTotalTaskTime(rec)} Hrs</td>
            </tr>`;

    for (const day in rec) {
      weeklyHrs += rec[day];
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

  document.getElementById("data-elem").innerHTML = rows;
};

const getTotalTaskTime = (task) => {
  let total = 0;
  for (const day in task) total += task[day];
  return total;
};

const updateHrs = (e) => {
  let Obj = { ...data };
  const name = e.name;
  const task = e.getAttribute("task");

  Obj[task][name] = e.value ? parseInt(e.value) : 0;
  data = Obj;

  localStorage.setItem("timesheet", JSON.stringify(data));
  renderTable();
};

const getTimeByDay = (day) => {
  let total = 0;

  for (const task in data) total += data[task][day];

  return total + " Hrs";
};

const addNewTask = () => {
  const name = prompt("Enter Task Name: ");

  if (name) {
    data[name] = { mo: 0, tu: 0, we: 0, th: 0, fr: 0 };

    localStorage.setItem("timesheet", JSON.stringify(data));
  }

  renderTable();
};

const clearAllTasks = () => {
  localStorage.clear();
  initApp();
};
