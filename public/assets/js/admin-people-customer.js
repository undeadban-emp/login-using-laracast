$(document).ready(function () {
    let table = $("#customerTable").DataTable({
        responsive: true,
        stateSave: true,
        processing: true,
        serverSide: true,
        retrieve: true,
        language: {
            processing:
                '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
        },
        ajax: "/customers/lists/",
        columns: [
            {
                data: "customer_name",
                class: "text-center",
                name: "customer_name",
            },
            {
                data: "customer_gender",
                class: "text-center",
                name: "customer_gender",
                searchable: false,
                render: function (data, type, row) {
                    if (row.customer_gender == "1") {
                        return "Male";
                    } else {
                        return "Female";
                    }
                },
            },
            {
                data: "customer_status",
                class: "text-center",
                name: "customer_status",
                searchable: false,
                render: function (data, type, row) {
                    if (row.customer_status == "1") {
                        return `<span class="badge badge-success-light">Active</span>`;
                    } else {
                        return `<span class="badge badge-danger-light">Inactive</span>`;
                    }
                },
            },
            { data: "action", class: "text-center", name: "action" },
        ],
    });

    $("#customerFilter").change(function (e) {
        if (e.target.value == "") {
            table.destroy();
            table = $("#customerTable").DataTable({
                responsive: true,
                stateSave: true,
                processing: true,
                serverSide: true,
                retrieve: true,
                language: {
                    processing:
                        '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
                },
                ajax: "/customers/lists",
                columns: [
                    {
                        data: "customer_name",
                        class: "text-center",
                        name: "customer_name",
                    },
                    {
                        data: "customer_gender",
                        class: "text-center",
                        name: "customer_gender",
                        searchable: false,
                        render: function (data, type, row) {
                            if (row.customer_gender == "1") {
                                return "Male";
                            } else {
                                return "Female";
                            }
                        },
                    },
                    {
                        data: "customer_status",
                        class: "text-center",
                        name: "customer_status",
                        searchable: false,
                        render: function (data, type, row) {
                            if (row.customer_status == "1") {
                                return `<span class="badge badge-success-light">Active</span>`;
                            } else {
                                return `<span class="badge badge-danger-light">Inactive</span>`;
                            }
                        },
                    },
                    { data: "action", class: "text-center", name: "action" },
                ],
            });
        } else {
            table.destroy();
            table = $("#customerTable").DataTable({
                responsive: true,
                stateSave: true,
                processing: true,
                serverSide: true,
                retrieve: true,
                language: {
                    processing:
                        '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
                },
                ajax: `/api/customers/lists/${e.target.value}`,
                columns: [
                    {
                        data: "customer_name",
                        class: "text-center",
                        name: "customer_name",
                    },
                    {
                        data: "customer_gender",
                        class: "text-center",
                        name: "customer_gender",
                        searchable: false,
                        render: function (data, type, row) {
                            if (row.customer_gender == "1") {
                                return "Male";
                            } else {
                                return "Female";
                            }
                        },
                    },
                    {
                        data: "customer_status",
                        class: "text-center",
                        name: "customer_status",
                        searchable: false,
                        render: function (data, type, row) {
                            if (row.customer_status == "1") {
                                return `<span class="badge badge-success-light">Active</span>`;
                            } else {
                                return `<span class="badge badge-danger-light">Inactive</span>`;
                            }
                        },
                    },
                    { data: "action", class: "text-center", name: "action" },
                ],
            });
        }
    });

    $("#editCancelButton").click(function () {
        $("#showCustomerList").attr("class", "container-fluid p-0");
        $("#showEditCustomer").attr("class", "container-fluid p-0 d-none");
    });
});
$(function () {
    $("#editSubmitButton").attr("disabled", true);
    $("#editCustomerForm :input").on("change", function () {
        $("#editSubmitButton").removeAttr("disabled");
    });
});

$(document).on("click", "#edit", function (row) {
    $("#showCustomerList").attr("class", "container-fluid p-0 d-none");
    $("#showEditCustomer").attr("class", "container-fluid p-0");

    let customerData = JSON.parse($(this).attr("data-row"));
    customerDataID = customerData.customer_id;

    $("#eCustomerName").val(customerData.customer_name);
    $("#eCustomerEmail").val(customerData.customer_email);
    $("#eCustomerGender").val(customerData.customer_gender);
    $("#eCustomerBirthdate").val(customerData.customer_birthdate);
    $("#eCustomerContactNo").val(customerData.customer_contact_no);
    $("#eCustomerProvince").val(customerData.customer_province);
    $("#eCustomerMunicipal").val(customerData.customer_municipal);
    $("#eCustomerBarangay").val(customerData.customer_barangay);
    $("#eCustomerPurokStreet").val(customerData.customer_purok_street);
    $("#eCustomerNoOfOrders").val(customerData.customer_no_of_orders);
    $("#eCustomerUsername").val(customerData.customer_username);
    $("#eCustomerPassword").val(customerData.customer_password);
    $("#eCustomerStatus").val(customerData.customer_status);
});

$("#editCustomerForm").submit(function (e) {
    $("#editSubmitButton").attr("disabled", true);
    $("#editSpinner").removeClass("d-none");
    $("#editSave").addClass("d-none");

    e.preventDefault();

    let data = {
        eCustomerPassword: $("#eCustomerPassword").val(),
        eCustomerStatus: $("#eCustomerStatus").val(),
    };

    Object.keys(data).forEach((field) => {
        $(`#${field}`).removeClass("is-invalid");
        $(`#${field}Error`).text("");
    });

    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: `/customers/update/${customerDataID}`,
        data: data,
        cache: false,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                $("#editSubmitButton").attr("disabled", false);
                $("#editSpinner").addClass("d-none");
                $("#editSave").removeClass("d-none");
                $("#editSubmitButton").attr("disabled", true);
                $("#customerTable").DataTable().ajax.reload();
                let message = "Successfully Updated";
                let type = "success";
                let duration = "10000";
                let positionX = "right";
                let ripple = "checked";
                let dismissible = "checked";
                let positionY = "top";
                window.notyf.open({
                    type,
                    message,
                    duration,
                    ripple,
                    dismissible,
                    position: {
                        x: positionX,
                        y: positionY,
                    },
                });
            }
        },
        error: function (response) {
            if (response.status === 422) {
                Object.keys(response.responseJSON.errors).forEach(
                    (inputFieldID) => {
                        $(`#${inputFieldID}`).addClass("is-invalid");
                        $(`#${inputFieldID}Error`).text(
                            response.responseJSON.errors[inputFieldID][0]
                        );
                    }
                );
                $("#editSubmitButton").attr("disabled", false);
                $("#editSpinner").addClass("d-none");
                $("#editSave").removeClass("d-none");
            }
        },
    });
});

$(document).on("click", "#delete", function () {
    let id = $(this).attr("value");
    let url = `/customers/destroy/`;
    let dltUrl = url + id;
    swal({
        title: "Are you sure you want to delete?",
        text: "Once deleted, you will not be able to recover this record!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                url: dltUrl,
                type: "DELETE",
                cache: false,
                success: function (dataResult) {
                    var dataResult = JSON.parse(dataResult);
                    if (dataResult.statusCode == 200) {
                        let message = "Successfully Deleted";
                        let type = "success";
                        let duration = "10000";
                        let positionX = "right";
                        let ripple = "checked";
                        let dismissible = "checked";
                        let positionY = "top";
                        window.notyf.open({
                            type,
                            message,
                            duration,
                            ripple,
                            dismissible,
                            position: {
                                x: positionX,
                                y: positionY,
                            },
                        });
                        $("#customerTable").DataTable().ajax.reload();
                    }
                },
            });
        } else {
            let message = "Delete Cancelled";
            let type = "danger";
            let duration = "10000";
            let positionX = "right";
            let ripple = "checked";
            let dismissible = "checked";
            let positionY = "top";
            window.notyf.open({
                type,
                message,
                duration,
                ripple,
                dismissible,
                position: {
                    x: positionX,
                    y: positionY,
                },
            });
        }
    });
});
