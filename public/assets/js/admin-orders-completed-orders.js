$("#customerOrderCompletedOrders").DataTable({
    responsive: true,
    stateSave: true,
    processing: true,
    serverSide: true,
    retrieve: true,
    language: {
        processing:
            '<i class="spinner-border"></i><span class="sr-only">Loading...</span> ',
    },
    ajax: "/complete-order/lists",
    columns: [
        { data: "customer_order_id", name: "customer_order_id" },
        {
            data: "customer_order_customer_name",
            name: "customer_order_customer_name",
        },
        { data: "customer_order_date_time", name: "customer_order_date_time" },
        {
            data: "customer_order_completed",
            name: "customer_order_completed",
        },
        { data: "action", name: "action" },
    ],
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
