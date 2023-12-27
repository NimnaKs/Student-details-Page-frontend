import { student_db } from "../db/db.js";
import { StudentModel } from "../model/studentModel.js";

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


search.on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

addBtn.on('click', () => {
    openStudentModal('Add New Student', 'Save', 'btn-success');
    studentId.val(generateStudentId());
});

function generateStudentId() {
    let highestStuId = 0;

    for (let i = 0; i < student_db.length; i++) {

        const numericPart = parseInt(student_db[i].studentId.split('-')[1]);

        if (!isNaN(numericPart) && numericPart > highestStuId) {
            highestStuId = numericPart;
        }
    }

    return `stu-${String(highestStuId + 1).padStart(3, '0')}`;
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
        ){

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
            student_db.push(studentModel);
            Swal.fire(
                'Save Successfully !',
                'Successful',
                'success'
            )
        } else {
            student_db.map((student) => {
                if (studentModel.studentId === student.studentId) {
                    student.fName = studentModel.fName;
                    student.lName = studentModel.lName;
                    student.contact = studentModel.contact;
                    student.email = studentModel.email;
                    student.address = studentModel.address;
                    student.program = studentModel.program;
                    student.batchNo = studentModel.batchNo;
                }
            });

            Swal.fire(
                'Update Successfully !',
                'Successful',
                'success'
            )
        }

        clear.click();

        populateStudentTable();
    }

});

clear.on('click', () => {
    reset.click();
    studentId.val(generateStudentId());
});


function populateStudentTable() {
    $('tbody').eq(0).empty();
    student_db.map((student) => {
        $('tbody').eq(0).append(
            `<tr>
                <th row='span'>${student.studentId}</th>
                <td>${student.fName}</td>
                <td>${student.lName}</td>
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

    $('.updateBtn').on('click', function () {
        const studentId = $(this).data('student-id');
        openStudentModal('Update Student', 'Update', 'btn-warning', studentId);
    });

    $('.deleteBtn').on('click', function () {
        const studentId = $(this).data('student-id');
        deleteStudent(studentId);
    });
}

function deleteStudent(studentId) {

    const index = student_db.findIndex(student => student.studentId === studentId);

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
            if (index !== -1) {
                student_db.splice(index, 1);
                populateStudentTable();
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            } else {
                showError('Error', 'Student cannot found !');
            }
        }
    });

}

function openStudentModal(heading, buttonText, buttonClass, stuId) {

    if (stuId) {
        const student = student_db.find(student => student.studentId === stuId);
        studentId.val(student.studentId);
        firstName.val(student.fName);
        lastName.val(student.lName);
        contact.val(student.contact);
        email.val(student.email);
        address.val(student.address);
        program.val(student.program);
        batchNo.val(student.batchNo);
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
