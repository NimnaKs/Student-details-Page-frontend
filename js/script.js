$(document).ready(function () {

    // Search functionality
    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Event handlers
    $('#addBtn').on('click', function () {
        openStudentModal('Add New Student', 'Save', 'btn-success');
    });

    $('#updateBtn').on('click', function () {
        openStudentModal('Update Student', 'Update', 'btn-warning');
    });

});

function openStudentModal(heading, buttonText, buttonClass) {
    $('#studentFormHeading').text(heading);
    $('#saveUpdateButton').text(buttonText);
    $('#studentModal').modal('show');
    $('#saveUpdateButton').removeClass('btn-success btn-warning').addClass(buttonClass);
}
