$("#customerOrderListTablePending").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/orders/lists",
    columns: [
        { data: "customer_order_id", name: "customer_order_id" },
        {
            data: "customer_order_customer_name",
            name: "customer_order_customer_name",
        },
        {
            data: "customer_order_status",
            name: "customer_order_status",
            searchable: false,
            render: function (data, type, row) {
                if (row.customer_order_status == "1") {
                    return `<select id="orderStatusesPending" class='form-select'>
                        <option value="1" selected>Pending</option>
                        <option value="2">On Process</option>
                    </select>`;
                } else {
                    return `<select id="orderStatusesPending" class='form-select'>
                        <option value="1">Pending</option>
                        <option value="2">On Process</option>
                    </select>`;
                }
            },
        },
        { data: "customer_order_date_time", name: "customer_order_date_time" },
        { data: "action", name: "action" },
    ],
});

$("#customerOrderListTableOnProcess").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/orders/listss",
    columns: [
        { data: "customer_order_id", name: "customer_order_id" },
        {
            data: "customer_order_customer_name",
            name: "customer_order_customer_name",
        },
        {
            data: "customer_order_status",
            name: "customer_order_status",
            searchable: false,
            render: function (data, type, row) {
                if (row.customer_order_status == "2") {
                    return `<select id="orderStatusesOnProcess" class='form-select'>
                        <option value="2" selected>On Process</option>
                        <option value="3">For Delivery</option>
                    </select>`;
                } else {
                    return `<select id="orderStatusesOnProcess" class='form-select'>
                    <option value="2">On Process</option>
                    <option value="3" selected>For Delivery</option>
                    </select>`;
                }
            },
        },
        { data: "customer_order_date_time", name: "customer_order_date_time" },
        { data: "action", name: "action" },
    ],
});

$("#customerOrderListTableForDelivery").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/orders/listsss",
    columns: [
        { data: "customer_order_id", name: "customer_order_id" },
        {
            data: "customer_order_customer_name",
            name: "customer_order_customer_name",
        },
        {
            data: "customer_order_status",
            name: "customer_order_status",
            searchable: false,
            render: function (data, type, row) {
                if (row.customer_order_status == "3") {
                    return `<select id="orderStatusesForDelivery" class='form-select'>
                        <option value="3" selected>For Delivery</option>
                        <option value="4">Completed</option>
                    </select>`;
                } else {
                    return `<select id="orderStatusesForDelivery" class='form-select'>
                    <option value="3">For Delivery</option>
                    <option value="4" selected>Completed</option>
                    </select>`;
                }
            },
        },
        { data: "customer_order_date_time", name: "customer_order_date_time" },
        { data: "action", name: "action" },
    ],
});

$(document).ready(function () {
    $("#showCancelButton").click(function () {
        $("#showCustomerOrderList").attr("class", "container-fluid p-0 ");
        $("#showCustomerOrderDetails").attr(
            "class",
            "container-fluid p-0 d-none"
        );

        var tableHeaderRowCount = 1;
        var table = document.getElementById("order-table-show");
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }
    });
});

$(document).on("click", "#show", function (row) {
    $("#showCustomerOrderList").attr("class", "container-fluid p-0 d-none");
    $("#showCustomerOrderDetails").attr("class", "container-fluid p-0");
    let orderListData = JSON.parse($(this).attr("data-row"));
    $("#customerName").text(orderListData.customer_order_customer_name);
    $("#address").text(orderListData.customer_order_address);
    $("#instruction").text(orderListData.customer_order_delivery_instruction);
    $("#paymentMethod").text(orderListData.customer_order_payment_method);
    $("#cashOnHand").text(orderListData.customer_order_cash_on_hand);
    $("#totalAmount").text(orderListData.customer_order_total);

    let table = document.getElementById("order-table-show");
    let orderListDetails = JSON.parse($(this).attr("data-details"));
    console.log(orderListDetails);
    for (var i = 0; i < orderListDetails.length; i++) {
        row = $("<tr />");
        $(table)
            .find("tbody")
            .append(
                "<tr>" +
                    "<td>" +
                    orderListDetails[i].order_details_product_name +
                    "</td>" +
                    "<td>" +
                    orderListDetails[i].order_details_quantity +
                    "</td>" +
                    "<td>" +
                    orderListDetails[i].order_details_product_unit_price +
                    "</td>" +
                    "<td class='text-end'>" +
                    orderListDetails[i].order_details_total +
                    "</td>" +
                    "</tr>"
            );
    }
});

$(document).on("click", "#savePending", function (row) {
    let productData = JSON.parse($(this).attr("data-rowPending"));
    let orderStatusesPending = $("#orderStatusesPending").val();

    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: `/orders/product/update/${productData}`,
        data: { data: orderStatusesPending },
        cache: false,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                let message = "Order On Process!";
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
                setInterval((window.location = window.location.href), 2000);
            }
        },
        error: function (response) {
            if (response.status === 422) {
                let message = "Error Saving!";
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

$(document).on("click", "#saveOnProcess", function (row) {
    let productData = JSON.parse($(this).attr("data-rowOnProcess"));
    let orderStatusesOnProcess = $("#orderStatusesOnProcess").val();

    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: `/orders/product/update/${productData}`,
        data: { data: orderStatusesOnProcess },
        cache: false,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                let message = "Order For Delivery!";
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
                setInterval((window.location = window.location.href), 2000);
            }
        },
        error: function (response) {
            if (response.status === 422) {
                let message = "Error Saving!";
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

$(document).on("click", "#saveForDelivery", function (row) {
    let productData = JSON.parse($(this).attr("data-rowForDelivery"));
    let orderStatusesForDelivery = $("#orderStatusesForDelivery").val();

    $.ajax({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        url: `/orders/product/update/completed/${productData}`,
        data: { data: orderStatusesForDelivery },
        cache: false,
        method: "PUT",
        success: function (response) {
            if (response.success) {
                let message = "Order For Delivery!";
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
                setInterval((window.location = window.location.href), 2000);
            }
        },
        error: function (response) {
            if (response.status === 422) {
                let message = "Error Saving!";
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
