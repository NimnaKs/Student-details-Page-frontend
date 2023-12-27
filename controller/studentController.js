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

addBtn.on('click', () => {
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

    let student = new StudentModel(
        student_id,
        f_name,
        l_name,
        contact_no,
        email_add,
        add,
        prog,
        b_no
    );

    student_db.push(student);

    clear.click();

    populateStudentTable();

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

    $('.updateBtn').on('click', () => {
        openStudentModal('Update Student', 'Update', 'btn-warning');
    });

    $('.deleteBtn').on('click', function() {
        const studentId = $(this).data('student-id');
        deleteStudent(studentId);
    });
}

function deleteStudent(studentId) {

    const index = student_db.findIndex(student => student.studentId === studentId);
    
    if (index !== -1) {
        student_db.splice(index, 1);
        populateStudentTable(); 
    }

}
