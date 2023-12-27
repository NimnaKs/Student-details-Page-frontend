import {student_db} from "../db/db.js";
import {StudentModel} from "../model/studentModel.js";

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

function generateStudentId(){
    let highestStuId = 0;

    for (let i = 0; i < student_db.length; i++) {
        // Extract the numeric part of the student Id
        const numericPart = parseInt(student_db[i].studentId.split('-')[1]);

        // Check if the numeric part is greater than the current highest
        if (!isNaN(numericPart) && numericPart > highestStuId) {
            highestStuId = numericPart;
        }
    }

    // Increment the highest numeric part and format as "stu-XXX"
    return `stu-${String(highestStuId + 1).padStart(3, '0')}`;
}

saveUpdateBtn.on('click',(event) => {

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

    console.log(student_db);

    clear.click();

});

clear.on('click',() => {
    reset.click();
    studentId.val(generateStudentId());
});