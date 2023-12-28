import { StudentModel } from "../model/studentModel.js";
import { DBProgress } from "../db/db.js";

document.addEventListener('DOMContentLoaded', function () {
    populateStudentTable();
});

let addBtn = $('#addBtn');
let saveUpdateBtn = $('#saveUpdateButton');
let clear = $('#clear');
let reset = $('#reset');

let studentId = $('#studentId');
let firstName = $('#firstName');
let lastName = $('#lastName');
let contact = $('#contact');
let email = $('#email');
let address = $('#address');
let program = $('#program');
let batchNo = $('#batchNo');

let search = $('#searchInput');

const emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");
const mobilePattern = new RegExp("^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$");

let dbprogress = new DBProgress();

search.on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

addBtn.on('click', () => {
    openStudentModal('Add New Student', 'Save', 'btn-success');
    generateStudentId();
});

function generateStudentId() {
    dbprogress.generateStudentId()
        .then((stuId) => {
            studentId.val(JSON.parse(stuId));
        })
        .catch((error) => {
            showError('Fetching Error', 'Error generating student ID');
            console.error('Error generating student ID:', error);
        });
}

saveUpdateBtn.on('click', (event) => {

    event.preventDefault();

    let student_id = studentId.val();
    let f_name = firstName.val();
    let l_name = lastName.val();
    let contact_no = contact.val();
    let email_add = email.val();
    let add = address.val();
    let prog = program.val();
    let b_no = batchNo.val();

    if (
        validation(f_name, "student first name", null) &&
        validation(l_name, "student last name", null) &&
        validation(contact_no, "student contact", mobilePattern.test(contact_no)) &&
        validation(email_add, "student email", emailPattern.test(email_add)) &&
        validation(add, "student addresss", null) &&
        validation(prog, "student program", null) &&
        validation(b_no, "student batch no", null)
    ) {

        let studentModel = new StudentModel(
            student_id,
            f_name,
            l_name,
            contact_no,
            email_add,
            add,
            prog,
            b_no
        );

        if (saveUpdateBtn.text() === 'Save') {
            dbprogress.saveStudent(studentModel)
                .then((responseText) => {
                    Swal.fire(
                        responseText,
                        'Successful',
                        'success'
                    )
                    populateStudentTable();
                })
                .catch((error) => {
                    showError('Save Unsucessfull', error);
                });
        } else {
            dbprogress.updateStudent(studentModel)
                .then((responseText) => {
                    Swal.fire(
                        responseText,
                        'Successful',
                        'success'
                    )
                    populateStudentTable();
                })
                .catch((error) => {
                    showError('Update Unsucessfull', error);
                });
        }

        clear.click();

        populateStudentTable();

        console.log(student_db);
    }

});

clear.on('click', () => {
    reset.click();
    generateStudentId();
});


function populateStudentTable() {
    dbprogress.getAllStudent()
        .then((responseText) => {
            let student_db = JSON.parse(responseText);
            $('tbody').eq(0).empty();
            student_db.forEach((student) => {
                $('tbody').eq(0).append(
                    `<tr>
                        <th row='span'>${student.studentId}</th>
                        <td>${student.firstName}</td>
                        <td>${student.lastName}</td>
                        <td>${student.contact}</td>
                        <td>${student.email}</td>
                        <td>${student.address}</td>
                        <td>${student.program}</td>
                        <td>${student.batchNo}</td>
                        <td>
                            <button class="updateBtn btn btn-warning btn-sm" data-toggle="modal" data-target="#studentModal"
                                data-student-id="${student.studentId}">
                                Edit
                            </button>
                        </td>
                        <td>
                            <button class="deleteBtn btn btn-danger btn-sm" data-student-id="${student.studentId}">
                                Delete
                            </button>
                        </td>
                    </tr>`
                );
            });
        })
        .catch((error) => {
            console.log(error);
            showError('fetch Unsuccessful', error);
        });
}

$('tbody').on('click', '.updateBtn', function () {
    const studentId = $(this).data('student-id');
    openStudentModal('Update Student', 'Update', 'btn-warning', studentId);
});

$('tbody').on('click', '.deleteBtn', function () {
    const studentId = $(this).data('student-id');
    deleteStudent(studentId);
});


function deleteStudent(studentId) {

    console.log('delete method call');

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            dbprogress.deleteStudent(studentId)
                .then((responseText) => {
                    Swal.fire(
                        responseText,
                        'Successful',
                        'success'
                    )
                    populateStudentTable();
                })
                .catch((error) => {
                    console.log(error);
                    showError('Student delete Unsucessfull', error);
                });
        }
    });

}

function openStudentModal(heading, buttonText, buttonClass, stuId) {

    if (stuId) {
        dbprogress.getStudent(stuId)
                .then((responseText) => {
                    let student = JSON.parse(responseText);
                    studentId.val(student.studentId);
                    firstName.val(student.firstName);
                    lastName.val(student.lastName);
                    contact.val(student.contact);
                    email.val(student.email);
                    address.val(student.address);
                    program.val(student.program);
                    batchNo.val(student.batchNo);
                })
                .catch((error) => {
                    console.log(error);
                    showError('Save Unsucessfull', error);
                });
    }

    $('#studentFormHeading').text(heading);
    saveUpdateBtn.text(buttonText);
    $('#studentModal').modal('show');
    saveUpdateBtn.removeClass('btn-success btn-warning').addClass(buttonClass);

}

function showError(title, text) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        footer: '<a href="">Why do I have this issue?</a>'
    });
}

function validation(value, message, test) {
    if (!value) {
        showError('Null Input', 'Input ' + message);
        return false;
    }
    if (test === null) {
        return true;
    }
    if (!test) {
        showError('Invalid Input', 'Invalid Input ' + message);
        return false;
    }
    return true;
}

