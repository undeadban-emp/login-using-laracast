$("#orderStatusTable").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/order-statuses/lists",
    columns: [
        { data: "order_status_id", name: "order_status_id" },
        { data: "order_status_name", name: "order_status_name" },
        { data: "action", name: "action" },
    ],
});

$(document).ready(function () {
    $("#newOrderStatus").click(function () {
        $("#showOrderStatusList").attr("class", "container-fluid p-0 d-none");
        $("#showNewOrderStatus").attr("class", "container-fluid p-0");
    });
    $("#cancelButton").click(function () {
        $("#showOrderStatusList").attr("class", "container-fluid p-0 ");
        $("#showNewOrderStatus").attr("class", "container-fluid p-0 d-none");
    });
    $("#editCancelButton").click(function () {
        $("#showOrderStatusList").attr("class", "container-fluid p-0 ");
        $("#showNewOrderStatus").attr("class", "container-fluid p-0 d-none");
        $("#showEditOrderStatus").attr("class", "container-fluid p-0 d-none");
    });
});

$(document).ready(function () {
    $("#newOrderStatusForm").submit(function (e) {
        e.preventDefault();
        let data = {
            orderStatusName: $("#orderStatusName").val(),
        };

        Object.keys(data).forEach((field) => {
            $(`#${field}`).removeClass("is-invalid");
            $(`#${field}Error`).text("");
        });

        $("#submitButton").attr("disabled", true);
        $("#spinner").removeClass("d-none");
        $("#save").addClass("d-none");
        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/order-status",
            data: new FormData(this),
            dataType: "JSON",
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                if (response.success) {
                    let message = "Successfully Added";
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
                    $("#submitButton").attr("disabled", false);
                    $("#spinner").addClass("d-none");
                    $("#save").removeClass("d-none");
                    $("#newOrderStatusForm")[0].reset();
                    $("#orderStatusTable").DataTable().ajax.reload();
                    // let value = parseInt($("#productBarcode").val()) + 1;
                    // $("#productBarcode").val(value);
                }
            },
            error: function (response) {
                if (response.status === 422) {
                    $("#submitButton").attr("disabled", false);
                    $("#spinner").addClass("d-none");
                    $("#save").removeClass("d-none");

                    Object.keys(response.responseJSON.errors).forEach(
                        (inputFieldID) => {
                            $(`#${inputFieldID}`).addClass("is-invalid");
                            $(`#${inputFieldID}Error`).text(
                                response.responseJSON.errors[inputFieldID][0]
                            );
                        }
                    );

                    let message = "Error Adding";
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
            },
        });
    });
});

$(document).on("click", "#edit", function (row) {
    $("#showOrderStatusList").attr("class", "container-fluid p-0 d-none");
    $("#showNewOrderStatus").attr("class", "container-fluid p-0 d-none");
    $("#showEditOrderStatus").attr("class", "container-fluid p-0");
    let orderStatusData = JSON.parse($(this).attr("data-row"));
    orderStatusDataId = orderStatusData.order_status_id;

    $("#eOrderStatusID").val(orderStatusData.order_status_id);
    $("#eOrderStatusName").val(orderStatusData.order_status_name);
});

$("#editOrderStatusForm").submit(function (e) {
    $("#editSubmitButton").attr("disabled", true);
    $("#editSpinner").removeClass("d-none");
    $("#editSave").addClass("d-none");
    e.preventDefault();
    let data = {
        eOrderStatusName: $("#eOrderStatusName").val(),
    };
    Object.keys(data).forEach((field) => {
        $(`#${field}`).removeClass("is-invalid");
        $(`#${field}Error`).text("");
    });
    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: `/order-statuses/update/${orderStatusDataId}`,
        data: data,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                $("#editSubmitButton").attr("disabled", false);
                $("#editSpinner").addClass("d-none");
                $("#editSave").removeClass("d-none");
                $("#editSubmitButton").attr("disabled", true);
                $("#orderStatusTable").DataTable().ajax.reload();
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
$(function () {
    $("#editSubmitButton").attr("disabled", true);
    $("#editOrderStatusForm :input").on("change", function () {
        $("#editSubmitButton").removeAttr("disabled");
    });
});
//delete
$(document).on("click", "#delete", function () {
    let id = $(this).attr("value");
    let url = `/order-statuses/destroy/`;
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
                        $("#orderStatusTable").DataTable().ajax.reload();
                    }
                },
            });
        } else {
            let message = "Delete Cancelled";
            let type = "danger";
            let duration = "10000";
            let positionX = "right";
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
