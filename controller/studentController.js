import {student_db} from "../db/db.js";

let addBtn = $('#addBtn');

let studentId = $('#studentId');
let firstName = $('#firstName');
let lastName = $('#lastName');
let contact = $('#contact');
let email = $('#email');
let address = $('#address');
let program = $('#program');
let batchNo = $('#batchNo');

let saveUpdateBtn = $('#saveUpdateButton');

addBtn.on('click', function() {
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