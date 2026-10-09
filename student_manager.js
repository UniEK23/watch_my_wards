let students = [];

const API_URL = "http://localhost:4000/students";


const studentList = document.getElementById("studentList");

const searchInput = document.getElementById("searchInput");

const totalStudents = document.getElementById("totalStudents");

const totalCourses = document.getElementById("totalCourses");

const averageAge = document.getElementById("averageAge");


async function fetchStudents() {

    try {

        studentList.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="ri-loader-4-line"></i>
                </div>

                <h3>Loading students...</h3>

                <p>Please wait.</p>
            </div>
        `;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        students = data.students;

        renderStudents(students);

        updateStats(students);

    } catch (error) {

        console.error("Failed to fetch students:", error);

        studentList.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="ri-error-warning-line"></i>
                </div>

                <h3>Unable to load students</h3>

                <p>
                    Please check that the API is running.
                </p>
            </div>
        `;
    }
}


function renderStudents(list) {

    if (list.length === 0) {

        studentList.innerHTML = `
            <div class="empty-state">
                <div>🔍</div>

                <h3>No students found</h3>

                <p>
                    Try adjusting your search.
                </p>
            </div>
        `;

        return;
    }


    studentList.innerHTML = list.map(student => {

        return `
            <article class="student-card">

                <div class="student-info">

                    <h3>${student.name}</h3>

                    <p>${student.course}</p>

                </div>

                <span class="student-age">
                    ${student.age}
                </span>

            </article>
        `;

    }).join("");
}


function updateStats(list) {

    totalStudents.textContent = list.length;


    const courses = new Set(
        list.map(student => student.course)
    );

    totalCourses.textContent = courses.size;


    if (list.length === 0) {

        averageAge.textContent = "0";

        return;
    }


    const totalAge = list.reduce(
        (sum, student) => sum + student.age,
        0
    );


    averageAge.textContent =
        (totalAge / list.length).toFixed(1);
}


function filterStudents() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    const filteredStudents =
        students.filter(student => {

            return (
                student.name
                    .toLowerCase()
                    .includes(searchTerm)
                ||
                student.course
                    .toLowerCase()
                    .includes(searchTerm)
            );

        });


    renderStudents(filteredStudents);

    updateStats(filteredStudents);
}


searchInput.addEventListener(
    "input",
    filterStudents
);


fetchStudents();