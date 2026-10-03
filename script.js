// ===============================
// STUDENT RESULT MANAGEMENT SYSTEM
// ===============================


// Get saved students
let students = JSON.parse(localStorage.getItem("students")) || [];


// ===============================
// LOGIN
// ===============================

document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");

        updateDashboard();
        displayStudents();

    } else {

        alert("❌ Invalid Username or Password");

    }

});


// ===============================
// LOGOUT
// ===============================

function logout() {

    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

}


// ===============================
// NAVIGATION
// ===============================

function showSection(sectionId, button) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (sectionId === "dashboard") {
        updateDashboard();
    }

    if (sectionId === "students") {
        displayStudents();
    }

}


// ===============================
// ADD STUDENT
// ===============================

document.getElementById("studentForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("studentName").value;
    const roll = document.getElementById("rollNo").value;
    const studentClass = document.getElementById("studentClass").value;
    const semester = document.getElementById("semester").value;

    const marksInputs = document.querySelectorAll(".marks");

    let marks = [];

    marksInputs.forEach(input => {
        marks.push(Number(input.value));
    });


    // Check duplicate roll number
    if (students.some(student => student.roll === roll)) {

        alert("⚠️ Roll Number already exists!");

        return;
    }


    // Calculate total
    const total = marks.reduce((sum, mark) => sum + mark, 0);

    // Calculate percentage
    const percentage = total / marks.length;

    // Calculate grade
    const grade = calculateGrade(percentage);

    // Pass condition
    const status = marks.every(mark => mark >= 35)
        ? "Pass"
        : "Fail";


    const student = {

        name: name,
        roll: roll,
        studentClass: studentClass,
        semester: semester,

        subjects: {
            mathematics: marks[0],
            programming: marks[1],
            database: marks[2],
            networks: marks[3],
            webTechnology: marks[4]
        },

        total: total,
        percentage: percentage.toFixed(2),
        grade: grade,
        status: status

    };


    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));


    alert("✅ Student Result Saved Successfully!");

    this.reset();

    displayStudents();
    updateDashboard();

});


// ===============================
// GRADE CALCULATION
// ===============================

function calculateGrade(percentage) {

    if (percentage >= 90) {
        return "A+";
    }

    if (percentage >= 80) {
        return "A";
    }

    if (percentage >= 70) {
        return "B+";
    }

    if (percentage >= 60) {
        return "B";
    }

    if (percentage >= 50) {
        return "C";
    }

    if (percentage >= 40) {
        return "D";
    }

    return "F";
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents() {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No student records found.
                </td>
            </tr>
        `;

        return;
    }


    students.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>${student.studentClass}</td>

            <td>${student.total}/500</td>

            <td>${student.percentage}%</td>

            <td>
                <span class="badge">
                    ${student.grade}
                </span>
            </td>

            <td class="${student.status === "Pass" ? "pass" : "fail"}">
                ${student.status}
            </td>

            <td>

                <button
                    class="action-btn print-btn"
                    onclick="printResult(${index})">
                    🖨️
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${index})">
                    🗑️
                </button>

            </td>

        `;

        table.appendChild(row);

    });

}


// ===============================
// DELETE STUDENT
// ===============================

function deleteStudent(index) {

    if (confirm("Are you sure you want to delete this result?")) {

        students.splice(index, 1);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        displayStudents();
        updateDashboard();

    }

}


// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

    const total = students.length;

    const passed = students.filter(
        student => student.status === "Pass"
    ).length;

    const failed = students.filter(
        student => student.status === "Fail"
    ).length;


    let average = 0;

    if (total > 0) {

        const totalPercentage = students.reduce(
            (sum, student) =>
                sum + Number(student.percentage),
            0
        );

        average = totalPercentage / total;

    }


    document.getElementById("totalStudents").textContent = total;

    document.getElementById("passedStudents").textContent = passed;

    document.getElementById("failedStudents").textContent = failed;

    document.getElementById("averagePercentage").textContent =
        average.toFixed(2) + "%";


    // Recent results

    const recent = document.getElementById("recentResults");

    recent.innerHTML = "";


    students.slice(-5).reverse().forEach(student => {

        recent.innerHTML += `

            <tr>

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td>${student.percentage}%</td>

                <td>${student.grade}</td>

                <td class="${student.status === "Pass" ? "pass" : "fail"}">
                    ${student.status}
                </td>

            </tr>

        `;

    });

}


// ===============================
// SEARCH STUDENT
// ===============================

function searchResult() {

    const roll = document
        .getElementById("searchRoll")
        .value
        .trim();


    const student = students.find(
        student => student.roll === roll
    );


    const resultCard =
        document.getElementById("resultCard");


    if (!student) {

        resultCard.innerHTML = `

            <div class="result-card">

                <h3>❌ Result Not Found</h3>

                <p>
                    No student found with Roll Number:
                    <strong>${roll}</strong>
                </p>

            </div>

        `;

        return;
    }


    resultCard.innerHTML = `

        <div class="result-card">

            <div class="result-header">

                <h2>🎓 Student Result</h2>

                <p>Student Result Management System</p>

            </div>


            <div class="result-info">

                <p>
                    <strong>Name:</strong>
                    ${student.name}
                </p>

                <p>
                    <strong>Roll No:</strong>
                    ${student.roll}
                </p>

                <p>
                    <strong>Class:</strong>
                    ${student.studentClass}
                </p>

                <p>
                    <strong>Semester:</strong>
                    ${student.semester}
                </p>

            </div>


            <table>

                <thead>

                    <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                    </tr>

                </thead>

                <tbody>

                    <tr>
                        <td>Mathematics</td>
                        <td>${student.subjects.mathematics}</td>
                    </tr>

                    <tr>
                        <td>Programming</td>
                        <td>${student.subjects.programming}</td>
                    </tr>

                    <tr>
                        <td>Database</td>
                        <td>${student.subjects.database}</td>
                    </tr>

                    <tr>
                        <td>Computer Networks</td>
                        <td>${student.subjects.networks}</td>
                    </tr>

                    <tr>
                        <td>Web Technology</td>
                        <td>${student.subjects.webTechnology}</td>
                    </tr>

                </tbody>

            </table>


            <div class="result-summary">

                <div>
                    <h3>${student.total}</h3>
                    <p>Total / 500</p>
                </div>

                <div>
                    <h3>${student.percentage}%</h3>
                    <p>Percentage</p>
                </div>

                <div>
                    <h3>${student.grade}</h3>
                    <p>Grade</p>
                </div>

                <div>
                    <h3 class="${student.status === "Pass" ? "pass" : "fail"}">
                        ${student.status}
                    </h3>
                    <p>Status</p>
                </div>

            </div>


            <button
                class="submit-btn"
                onclick="printStudentResult('${student.roll}')">

                🖨️ Print Result

            </button>

        </div>

    `;

}


// ===============================
// PRINT RESULT
// ===============================

function printStudentResult(roll) {

    const student = students.find(
        student => student.roll === roll
    );


    if (!student) return;


    const printWindow = window.open("", "_blank");


    printWindow.document.write(`

        <html>

        <head>

            <title>Student Result - ${student.name}</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 40px;
                }

                h1, h2 {
                    text-align: center;
                }

                .info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin: 30px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    border: 1px solid #333;
                    padding: 12px;
                }

                th {
                    background: #eee;
                }

                .summary {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 30px;
                    padding: 20px;
                    border: 1px solid #333;
                }

                .footer {
                    margin-top: 50px;
                    text-align: right;
                }

            </style>

        </head>


        <body>

            <h1>🎓 STUDENT RESULT</h1>

            <h2>Student Result Management System</h2>


            <div class="info">

                <p>
                    <strong>Name:</strong>
                    ${student.name}
                </p>

                <p>
                    <strong>Roll No:</strong>
                    ${student.roll}
                </p>

                <p>
                    <strong>Class:</strong>
                    ${student.studentClass}
                </p>

                <p>
                    <strong>Semester:</strong>
                    ${student.semester}
                </p>

            </div>


            <table>

                <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                </tr>

                <tr>
                    <td>Mathematics</td>
                    <td>${student.subjects.mathematics}</td>
                </tr>

                <tr>
                    <td>Programming</td>
                    <td>${student.subjects.programming}</td>
                </tr>

                <tr>
                    <td>Database</td>
                    <td>${student.subjects.database}</td>
                </tr>

                <tr>
                    <td>Computer Networks</td>
                    <td>${student.subjects.networks}</td>
                </tr>

                <tr>
                    <td>Web Technology</td>
                    <td>${student.subjects.webTechnology}</td>
                </tr>

            </table>


            <div class="summary">

                <strong>Total: ${student.total}/500</strong>

                <strong>
                    Percentage: ${student.percentage}%
                </strong>

                <strong>
                    Grade: ${student.grade}
                </strong>

                <strong>
                    Status: ${student.status}
                </strong>

            </div>


            <div class="footer">
                <p>Authorized Signature</p>
            </div>


            <script>

                window.onload = function() {
                    window.print();
                }

            <\/script>

        </body>

        </html>

    `);

    printWindow.document.close();

}


// ===============================
// PRINT FROM TABLE
// ===============================

function printResult(index) {

    const student = students[index];

    printStudentResult(student.roll);

}


// ===============================
// SEARCH TABLE
// ===============================

function filterStudents() {

    const search =
        document.getElementById("tableSearch")
        .value
        .toLowerCase();


    const rows =
        document.querySelectorAll("#studentTable tr");


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        row.style.display =
            text.includes(search)
                ? ""
                : "none";

    });

}


// Initial dashboard
updateDashboard();