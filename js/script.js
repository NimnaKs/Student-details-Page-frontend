$(document).ready(function () {
    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function openAddStudentModal() {
    $('#studentFormHeading').text('Add New Student');
    $('#saveUpdateButton').text('Save');
    $('#studentModal').modal('show');
    $('#saveUpdateButton').removeClass('btn-warning');
    $('#saveUpdateButton').addClass('btn-success');
}

// Function to open the modal for Update Student
function openUpdateStudentModal() {
    $('#studentFormHeading').text('Update Student');
    $('#saveUpdateButton').text('Update');
    $('#saveUpdateButton').removeClass('btn-success');
    $('#saveUpdateButton').addClass('btn-warning');
    $('#studentModal').modal('show');
}

$('#addBtn').on('click', openAddStudentModal);
$('#updateBtn').on('click', openUpdateStudentModal);