var selectedRow = null;


var employeeData = [];


function refreshTable() {
    const tableBody = document.querySelector("#employeeList tbody");
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }
    tableBody.innerHTML = ""; 
    employeeData.forEach(data => {
        if (data && data.fullName && data.empCode && data.salary && data.city) {
            insertNewRecord(data);
        } else {
            console.warn("Invalid data entry:", data);
        }
    });
}

window.onload = function() {
    const savedData = localStorage.getItem('employeeData');
    if (savedData) {
        employeeData = JSON.parse(savedData);
        refreshTable();
    } else {
        employeeData = [];
    }
    getData();
};


window.onpageshow = function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        const savedData = localStorage.getItem('employeeData');
        if (savedData) {
            employeeData = JSON.parse(savedData);
            refreshTable();
        } else {
            console.log("No saved data found in localStorage.");
        }
    }
};

function onFormSubmit() {
    if (validate()) {
        var formData = readFormData();
        if (selectedRow == null) {
            insertNewRecord(formData);
        } else {
            updateRecord(formData);
        }
        employeeData.push(formData);
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
        console.log("Data saved to localStorage:", employeeData);
        resetForm();
    }
}

function readFormData() {
    var formData = {};
    formData["fullName"] = document.getElementById("fullName").value;
    formData["empCode"] = document.getElementById("empCode").value;
    formData["salary"] = document.getElementById("salary").value;
    formData["city"] = document.getElementById("city").value;
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    if (!table) {
        console.error("Table not found!");
        return;
    }
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.fullName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.empCode;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.salary;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.city;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("empCode").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("city").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    var rowIndex = selectedRow.rowIndex - 1; 
    var fullName = selectedRow.cells[0].innerHTML;
    var empCode = selectedRow.cells[1].innerHTML;
    var salary = selectedRow.cells[2].innerHTML;
    var city = selectedRow.cells[3].innerHTML;
    localStorage.setItem('editRowIndex', rowIndex);
    window.location.href = `edit-form.html?fullName=${encodeURIComponent(fullName)}&empCode=${encodeURIComponent(empCode)}&salary=${encodeURIComponent(salary)}&city=${encodeURIComponent(city)}`;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.fullName;
    selectedRow.cells[1].innerHTML = formData.empCode;
    selectedRow.cells[2].innerHTML = formData.salary;
    selectedRow.cells[3].innerHTML = formData.city;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        var rowIndex = row.rowIndex - 1; 
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        employeeData.splice(rowIndex, 1);
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
        refreshTable();
    }
}

function validate() {
    const fullNameValue = document.getElementById("fullName").value;
    const empCodeValue = document.getElementById("empCode").value;
    const salaryValue = document.getElementById("salary").value;
    const cityValue = document.getElementById("city").value;
    const submitButton = document.querySelector('input[type="submit"]');
    let errorPara = document.getElementById("errorPara");
    
    if (!errorPara) {
        errorPara = document.createElement("p");
        errorPara.id = "errorPara";
        errorPara.style.color = "red";
        document.querySelector("form").appendChild(errorPara);
    }

    if (fullNameValue === "" || fullNameValue.length > 10 || !isNaN(fullNameValue)) {
        errorPara.textContent = "enter name!";
        errorPara.style.display = "block";
        submitButton.style.backgroundColor = "red";
        return false;
    }

    if (isNaN(empCodeValue)) {
        errorPara.textContent = "error in emp code!";
        errorPara.style.display = "block";
        submitButton.style.backgroundColor = "red";
        return false;
    }

    if (isNaN(salaryValue)) {
        errorPara.textContent = "error in Salary cell!";
        errorPara.style.display = "block";
        submitButton.style.backgroundColor = "red";
        return false;
    }

    if (cityValue === "" || cityValue.length > 20 || !isNaN(cityValue)) {
        errorPara.textContent = "error in city cell!";
        errorPara.style.display = "block";
        submitButton.style.backgroundColor = "red";
        return false;
    }

    errorPara.style.display = "none";
    submitButton.style.backgroundColor = "green";
    return true;
}

async function getData() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    
    const tableBody = document.querySelector("#employeeList tbody");
    if (!tableBody) {
        console.error("Table body not found in getData!");
        return;
    }
  
    for (let i = 0; i < data.length; i++) {
        const user = data[i];
        const row = document.createElement("tr");
    
        const fullNameCell = document.createElement("td");
        fullNameCell.textContent = user.name;
    
        const empCodeCell = document.createElement("td");
        empCodeCell.textContent = user.id;
    
        const salaryCell = document.createElement("td");
        salaryCell.textContent = Math.floor(Math.random() * 5000 + 1000);
    
        const cityCell = document.createElement("td");
        cityCell.textContent = user.address.city;
    
        const actionCell = document.createElement("td");
        actionCell.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                               <a onClick="onDelete(this)">Delete</a>`;
        row.appendChild(fullNameCell);
        row.appendChild(empCodeCell);
        row.appendChild(salaryCell);
        row.appendChild(cityCell); 
        row.appendChild(actionCell);
        tableBody.appendChild(row);
    }
}

getData();

function saveData() {
    if (validate()) {
        var formData = readFormData();
        employeeData.push(formData);
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
        document.querySelector('input[type="submit"]').disabled = true; 
    }
}

function saveEdit() {
    if (validate()) {
        var formData = readFormData();
        var rowIndex = localStorage.getItem('editRowIndex');
        employeeData[rowIndex] = formData;
        localStorage.setItem('employeeData', JSON.stringify(employeeData));
        document.querySelector('input[type="submit"]').disabled = true;
    }
}

if (window.location.pathname.includes('edit-form.html')) {
    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById("fullName").value = decodeURIComponent(urlParams.get('fullName'));
        document.getElementById("empCode").value = decodeURIComponent(urlParams.get('empCode'));
        document.getElementById("salary").value = decodeURIComponent(urlParams.get('salary'));
        document.getElementById("city").value = decodeURIComponent(urlParams.get('city'));
    };
}