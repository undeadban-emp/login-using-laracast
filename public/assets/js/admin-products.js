// new Choices(document.querySelector(".choices-single"));
// new Choices(document.querySelector(".choices-singles"));
// display data in tables
$("#productTable").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/products-list",
    columns: [
        {
            data: "image",
            name: "image",
        },
        { data: "product_name", name: "product_name" },
        { data: "product_category_id", name: "product_category_id" },
        {
            data: "product_original_price",
            name: "product_original_price",
            render: $.fn.dataTable.render.number(",", ".", 2),
        },
        {
            data: "product_markup_price",
            name: "product_markup_price",
            render: $.fn.dataTable.render.number(",", ".", 2),
        },
        {
            data: "product_status_id",
            name: "product_status_id",
            searchable: false,
            render: function (data, type, row) {
                if (row.product_status_id == "1") {
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
    $("#newProduct").click(function () {
        $("#showProductList").attr("class", "container-fluid p-0 d-none");
        $("#showNewProduct").attr("class", "container-fluid p-0");
    });
    $("#cancelButton").click(function () {
        $("#showProductList").attr("class", "container-fluid p-0");
        $("#showNewProduct").attr("class", "container-fluid p-0 d-none");
        let data = {
            productImage: $("#productImage").val(),
            productName: $("#productName").val(),
            productCategory: $("#productCategory").val(),
            productBarcode: $("#productBarcode").val(),
            productStatus: $("#productStatus").val(),
            productTotalQuantity: $("#productTotalQuantity").val(),
            productOriginalPrice: $("#productOriginalPrice").val(),
            productMarkupPrice: $("#productMarkupPrice").val(),
            productContent: $("#productContent").val(),
        };

        Object.keys(data).forEach((field) => {
            $(`#${field}`).removeClass("is-invalid");
            $(`#${field}Error`).text("");
        });
    });
    $("#editCancelButton").click(function () {
        $("#showProductList").attr("class", "container-fluid p-0");
        $("#showEditProduct").attr("class", "container-fluid p-0 d-none");
        $("#editProductForm span").hide();
    });
});
$(document).ready(function () {
    $("#categoryForm").submit(function (e) {
        e.preventDefault();

        let data = {
            productImage: $("#productImage").val(),
            productName: $("#productName").val(),
            productCategory: $("#productCategory").val(),
            productBarcode: $("#productBarcode").val(),
            productStatus: $("#productStatus").val(),
            productTotalQuantity: $("#productTotalQuantity").val(),
            productOriginalPrice: $("#productOriginalPrice").val(),
            productMarkupPrice: $("#productMarkupPrice").val(),
            productContent: $("#productContent").val(),
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
            url: "/product",
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
                    $("#categoryForm")[0].reset();
                    $("#productTable").DataTable().ajax.reload();
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
    $("#showProductList").attr("class", "container-fluid p-0 d-none");
    $("#showNewProduct").attr("class", "container-fluid p-0 d-none");
    $("#showEditProduct").attr("class", "container-fluid p-0");

    let productData = JSON.parse($(this).attr("data-row"));
    productDataId = productData.product_id;

    $("#eProductName").val(productData.product_name);
    $("#eProductImageSrc").attr(
        "src",
        "uploads/" + productData.product_picture
    );
    $("#eProductImage").val(productData.product_picture);
    $("#eProductCategory").val(productData.product_category_id);
    $("#eProductBarcode").val(productData.product_barcode);
    $("#eProductStatus").val(productData.product_status_id);
    $("#eProductTotalQuantity").val(productData.product_total_quantity);
    $("#eProductOriginalPrice").val(productData.product_original_price);
    $("#eProductMarkupPrice").val(productData.product_markup_price);
    $("#eProductContent").val(productData.product_content);
});

$(function () {
    $("#editSubmitButton").attr("disabled", true);
    $("#editProductForm :input").on("change", function () {
        $("#editSubmitButton").removeAttr("disabled");
    });
});

$("#editProductForm").submit(function (e) {
    $("#editSubmitButton").attr("disabled", true);
    $("#editSpinner").removeClass("d-none");
    $("#editSave").addClass("d-none");

    e.preventDefault();

    let data = {
        eProductName: $("#eProductName").val(),
        eProductCategory: $("#eProductCategory").val(),
        eProductBarcode: $("#eProductBarcode").val(),
        eProductStatus: $("#eProductStatus").val(),
        eProductTotalQuantity: $("#eProductTotalQuantity").val(),
        eProductOriginalPrice: $("#eProductOriginalPrice").val(),
        eProductMarkupPrice: $("#eProductMarkupPrice").val(),
        eProductContent: $("#eProductContent").val(),
    };

    Object.keys(data).forEach((field) => {
        $(`#${field}`).removeClass("is-invalid");
        $(`#${field}Error`).text("");
    });

    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: `/product/update/${productDataId}`,
        data: data,
        cache: false,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                $("#editSubmitButton").attr("disabled", false);
                $("#editSpinner").addClass("d-none");
                $("#editSave").removeClass("d-none");
                $("#editSubmitButton").attr("disabled", true);
                $("#productTable").DataTable().ajax.reload();
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
