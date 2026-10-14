const API_URL = "http://localhost:4000/students";

let students = [];

// DOM elements
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("search-input");
const courseFilter = document.getElementById("courseFilter");

const totalStudents = document.getElementById("totalStudents");
const totalCourses = document.getElementById("totalCourses");
const averageAge = document.getElementById("averageAge");

const addStudentBtn = document.getElementById("addStudentBtn");
const studentModal = document.getElementById("studentModal");
const studentForm = document.getElementById("studentForm");

const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const studentCourseInput = document.getElementById("studentCourse");
const studentAgeInput = document.getElementById("studentAge");

const modalTitle = document.getElementById("modalTitle");
const saveStudentBtn = document.getElementById("saveStudentBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const toast = document.getElementById("toast");

// Escape API values before inserting them into HTML.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Make API requests and handle unsuccessful responses.
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    const responseText = await response.text();

    let data = {};

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed (${response.status})`
        );
    }

    return data;
}

// Show a short notification.
let toastTimer;

function showToast(message, type = "success") {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// Load records from the Express API.
async function fetchStudents() {
    studentList.innerHTML = `
        <div class="empty-state">
            <div><i class="ri-loader-4-line"></i></div>
            <h3>Loading students...</h3>
            <p>Please wait.</p>
        </div>
    `;

    try {
        const data = await apiRequest(API_URL);

        students = Array.isArray(data.students)
            ? data.students
            : [];

        updateCourseFilter();
        updateStats(students);
        renderStudents(getFilteredStudents());

        return true;

    } catch (error) {
        console.error("Could not load students:", error);

        studentList.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="ri-error-warning-line"></i>
                </div>
                <h3>Unable to load students</h3>
                <p>${escapeHTML(error.message)}</p>
                <button type="button"
                        class="retry-btn"
                        data-action="retry">
                    Try again
                </button>
            </div>
        `;

        return false;
    }
}

// Dashboard stats always reflect ALL students,
// not just the currently filtered search results.
function updateStats(list) {
    totalStudents.textContent = list.length;

    const uniqueCourses = new Set(
        list.map(student =>
            String(student.course).trim().toLowerCase()
        )
    );

    totalCourses.textContent = uniqueCourses.size;

    if (list.length === 0) {
        averageAge.textContent = "0";
        return;
    }

    const totalAge = list.reduce(
        (sum, student) => sum + Number(student.age || 0),
        0
    );

    averageAge.textContent =
        (totalAge / list.length).toFixed(1);
}

// Populate the course filter from actual records.
function updateCourseFilter() {
    const previousValue = courseFilter.value;

    const uniqueCourses = [
        ...new Map(
            students
                .filter(student => student.course)
                .map(student => [
                    String(student.course).trim().toLowerCase(),
                    String(student.course).trim()
                ])
        ).values()
    ].sort((a, b) => a.localeCompare(b));

    courseFilter.innerHTML = `
        <option value="">All courses</option>
        ${uniqueCourses.map(course => `
            <option value="${escapeHTML(course)}">
                ${escapeHTML(course)}
            </option>
        `).join("")}
    `;

    if (uniqueCourses.includes(previousValue)) {
        courseFilter.value = previousValue;
    }
}

// Get records matching both search and course filter.
function getFilteredStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value.toLowerCase();

    return students.filter(student => {
        const name = String(student.name ?? "").toLowerCase();
        const course = String(student.course ?? "").toLowerCase();
        const id = String(student.id ?? "").toLowerCase();

        const matchesSearch =
            name.includes(searchTerm) ||
            course.includes(searchTerm) ||
            id.includes(searchTerm);

        const matchesCourse =
            !selectedCourse || course === selectedCourse;

        return matchesSearch && matchesCourse;
    });
}

// Display the current list.
function renderStudents(list) {
    if (list.length === 0) {
        const hasFilters =
            searchInput.value.trim() !== "" ||
            courseFilter.value !== "";

        studentList.innerHTML = `
            <div class="empty-state">
                <div>
                    <i class="${
                        hasFilters
                            ? "ri-search-2-line"
                            : "ri-user-6-line"
                    }"></i>
                </div>

                <h3>${
                    hasFilters
                        ? "No matching students"
                        : "No students yet"
                }</h3>

                <p>${
                    hasFilters
                        ? "Try changing your search or course filter."
                        : "Add a student to get started."
                }</p>
            </div>
        `;

        return;
    }

    studentList.innerHTML = list.map(student => `
        <article class="student-card">

            <span class="student-id">
                #${escapeHTML(student.id)}
            </span>

            <div class="student-info">
                <h3>${escapeHTML(student.name)}</h3>
            </div>

            <div class="student-course">
                ${escapeHTML(student.course)}
            </div>

            <span class="student-age">
                ${escapeHTML(student.age)}
            </span>

            <div class="student-actions">

                <button
                    type="button"
                    class="action-btn edit-btn"
                    data-action="edit"
                    data-id="${escapeHTML(student.id)}"
                    aria-label="Edit ${escapeHTML(student.name)}"
                    title="Edit student"
                >
                    <i class="ri-edit-line"></i>
                    <span class="action-label">Edit</span>
                </button>

                <button
                    type="button"
                    class="action-btn delete-btn"
                    data-action="delete"
                    data-id="${escapeHTML(student.id)}"
                    aria-label="Delete ${escapeHTML(student.name)}"
                    title="Delete student"
                >
                    <i class="ri-delete-bin-line"></i>
                    <span class="action-label">Delete</span>
                </button>

            </div>

        </article>
    `).join("");
}

// Update only the displayed results when searching.
function applyFilters() {
    renderStudents(getFilteredStudents());
}

searchInput.addEventListener("input", applyFilters);
courseFilter.addEventListener("change", applyFilters);

// Open a blank form or populate it for editing.
function openStudentModal(student = null) {
    studentForm.reset();

    studentIdInput.value = student ? student.id : "";

    if (student) {
        modalTitle.textContent = "Edit Student";
        saveStudentBtn.textContent = "Save Changes";

        studentNameInput.value = student.name;
        studentCourseInput.value = student.course;
        studentAgeInput.value = student.age;
    } else {
        modalTitle.textContent = "Add Student";
        saveStudentBtn.textContent = "Add Student";
    }

    studentModal.showModal();

    studentNameInput.focus();
}

function closeStudentModal() {
    studentModal.close();
}

addStudentBtn.addEventListener("click", () => {
    openStudentModal();
});

closeModalBtn.addEventListener("click", closeStudentModal);
cancelModalBtn.addEventListener("click", closeStudentModal);

// Clicking the backdrop closes the dialog.
studentModal.addEventListener("click", event => {
    if (event.target === studentModal) {
        closeStudentModal();
    }
});

// Create or edit a student.
studentForm.addEventListener("submit", async event => {
    event.preventDefault();

    const id = studentIdInput.value;

    const payload = {
        name: studentNameInput.value.trim(),
        course: studentCourseInput.value.trim(),
        age: Number(studentAgeInput.value)
    };

    if (
        !payload.name ||
        !payload.course ||
        !Number.isInteger(payload.age) ||
        payload.age < 1 ||
        payload.age > 150
    ) {
        showToast("Please enter valid student details.", "error");
        return;
    }

    const isEditing = id !== "";

    const url = isEditing
        ? `${API_URL}/${encodeURIComponent(id)}`
        : API_URL;

    saveStudentBtn.disabled = true;
    saveStudentBtn.textContent = "Saving...";

    try {
        const result = await apiRequest(url, {
            method: isEditing ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        closeStudentModal();

        // Clear filters so the updated/new record is visible.
        searchInput.value = "";
        courseFilter.value = "";

        const refreshed = await fetchStudents();

        showToast(
            refreshed
                ? (result.message || (
                    isEditing
                        ? "Student updated successfully."
                        : "Student added successfully."
                ))
                : "Saved successfully, but the list could not refresh.",
            refreshed ? "success" : "error"
        );

    } catch (error) {
        showToast(error.message, "error");

    } finally {
        saveStudentBtn.disabled = false;

        saveStudentBtn.textContent =
            studentIdInput.value
                ? "Save Changes"
                : "Add Student";
    }
});

// Handle edit, delete, and retry using event delegation.
studentList.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const action = button.dataset.action;

    if (action === "retry") {
        await fetchStudents();
        return;
    }

    const student = students.find(
        item => String(item.id) === button.dataset.id
    );

    if (!student) {
        showToast("Student record could not be found.", "error");
        return;
    }

    if (action === "edit") {
        openStudentModal(student);
        return;
    }

    if (action === "delete") {
        const confirmed = window.confirm(
            `Delete ${student.name}'s record? This cannot be undone.`
        );

        if (!confirmed) return;

        button.disabled = true;

        try {
            const result = await apiRequest(
                `${API_URL}/${encodeURIComponent(student.id)}`,
                { method: "DELETE" }
            );

            const refreshed = await fetchStudents();

            showToast(
                refreshed
                    ? (result.message || "Student deleted successfully.")
                    : "Deleted, but the list could not refresh.",
                refreshed ? "success" : "error"
            );

        } catch (error) {
            showToast(error.message, "error");
            button.disabled = false;
        }
    }
});

// Optional: make the desktop sidebar's Add Student link open the form.
// Add id="sidebarAddStudent" to that link in your HTML.
const sidebarAddStudent =
    document.getElementById("sidebarAddStudent");

if (sidebarAddStudent) {
    sidebarAddStudent.addEventListener("click", event => {
        event.preventDefault();
        openStudentModal();
    });
}

// Start the dashboard.
fetchStudents();