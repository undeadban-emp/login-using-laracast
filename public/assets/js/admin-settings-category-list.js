$("#categoryTable").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/category/lists",
    columns: [
        {
            data: "product_category_name",
            name: "product_category_name",
        },
        { data: "product_category_code", name: "product_category_code" },
        {
            data: "product_category_status",
            name: "product_category_status",
            searchable: false,
            render: function (data, type, row) {
                if (row.product_category_status == "1") {
                    return `<span class="badge badge-success-light">Active</span>`;
                } else {
                    return `<span class="badge badge-danger-light">Inactive</span>`;
                }
            },
        },
        { data: "action", name: "action" },
    ],
});

$(document).ready(function () {
    $("#newCategory").click(function () {
        $("#showCategoryList").attr("class", "container-fluid p-0 d-none");
        $("#showNewCategory").attr("class", "container-fluid p-0");
    });
    $("#cancelButton").click(function () {
        $("#showCategoryList").attr("class", "container-fluid p-0");
        $("#showNewCategory").attr("class", "container-fluid p-0 d-none");
        // let data = {
        //     productImage: $("#productImage").val(),
        //     productName: $("#productName").val(),
        //     productCategory: $("#productCategory").val(),
        //     productBarcode: $("#productBarcode").val(),
        //     productStatus: $("#productStatus").val(),
        //     productTotalQuantity: $("#productTotalQuantity").val(),
        //     productOriginalPrice: $("#productOriginalPrice").val(),
        //     productMarkupPrice: $("#productMarkupPrice").val(),
        //     productContent: $("#productContent").val(),
        // };

        // Object.keys(data).forEach((field) => {
        //     $(`#${field}`).removeClass("is-invalid");
        //     $(`#${field}Error`).text("");
        // });
    });
    $("#editCancelButton").click(function () {
        $("#showCategoryList").attr("class", "container-fluid p-0 ");
        $("#showNewCategory").attr("class", "container-fluid p-0 d-none");
        $("#showEditCategory").attr("class", "container-fluid p-0 d-none");
    });
});

$(document).on("click", "#edit", function (row) {
    $("#showCategoryList").attr("class", "container-fluid p-0 d-none");
    $("#showNewCategory").attr("class", "container-fluid p-0 d-none");
    $("#showEditCategory").attr("class", "container-fluid p-0");
    let categoryData = JSON.parse($(this).attr("data-row"));
    categoryDataId = categoryData.product_category_id;

    $("#eCategoryID").val(categoryData.product_category_id);
    $("#eCategoryName").val(categoryData.product_category_name);
    $("#eProductBarcode").val(categoryData.product_category_code);
    $("#eProductCategory").val(categoryData.product_category_status);
});

$(document).ready(function () {
    $("#newCategoryForm").submit(function (e) {
        e.preventDefault();

        let data = {
            productImage: $("#categoryName").val(),
            productName: $("#categoryCode").val(),
            productCategory: $("#categoryStatus").val(),
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
            url: "/category-list",
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
                    $("#newCategoryForm")[0].reset();
                    $("#categoryTable").DataTable().ajax.reload();
                    let value = parseInt($("#productBarcode").val()) + 1;
                    $("#productBarcode").val(value);
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

$("#editProductForm").submit(function (e) {
    $("#editSubmitButton").attr("disabled", true);
    $("#editSpinner").removeClass("d-none");
    $("#editSave").addClass("d-none");

    e.preventDefault();

    let data = {
        eCategoryName: $("#eCategoryName").val(),
        eProductBarcode: $("#eProductBarcode").val(),
        eProductCategory: $("#eProductCategory").val(),
    };

    Object.keys(data).forEach((field) => {
        $(`#${field}`).removeClass("is-invalid");
        $(`#${field}Error`).text("");
    });
    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },

        url: `/category/update/${categoryDataId}`,
        data: data,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                $("#editSubmitButton").attr("disabled", false);
                $("#editSpinner").addClass("d-none");
                $("#editSave").removeClass("d-none");
                $("#editSubmitButton").attr("disabled", true);
                $("#categoryTable").DataTable().ajax.reload();
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
    $("#editProductForm :input").on("change", function () {
        $("#editSubmitButton").removeAttr("disabled");
    });
});

//delete
$(document).on("click", "#delete", function () {
    let id = $(this).attr("value");
    let url = `/category/destroy/`;
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
                        $("#categoryTable").DataTable().ajax.reload();
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
