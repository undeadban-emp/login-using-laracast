document.addEventListener("DOMContentLoaded", function () {
    var ctx = document
        .getElementById("chartjs-dashboard-line")
        .getContext("2d");
    var gradientLight = ctx.createLinearGradient(0, 0, 0, 225);
    gradientLight.addColorStop(0, "rgba(215, 227, 244, 1)");
    gradientLight.addColorStop(1, "rgba(215, 227, 244, 0)");
    var gradientDark = ctx.createLinearGradient(0, 0, 0, 225);
    gradientDark.addColorStop(0, "rgba(51, 66, 84, 1)");
    gradientDark.addColorStop(1, "rgba(51, 66, 84, 0)");
    // Line chart
    new Chart(document.getElementById("chartjs-dashboard-line"), {
        type: "line",
        data: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: "Sales ($)",
                    fill: true,
                    backgroundColor:
                        window.theme.id === "light"
                            ? gradientLight
                            : gradientDark,
                    borderColor: window.theme.primary,
                    data: [
                        2115, 1562, 1584, 1892, 1587, 1923, 2566, 2448, 2805,
                        3438, 2917, 3327,
                    ],
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                intersect: false,
            },
            hover: {
                intersect: true,
            },
            plugins: {
                filler: {
                    propagate: false,
                },
            },
            scales: {
                xAxes: [
                    {
                        reverse: true,
                        gridLines: {
                            color: "rgba(0,0,0,0.0)",
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            stepSize: 1000,
                        },
                        display: true,
                        borderDash: [3, 3],
                        gridLines: {
                            color: "rgba(0,0,0,0.0)",
                            fontColor: "#fff",
                        },
                    },
                ],
            },
        },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Bar chart
    new Chart(document.getElementById("chartjs-dashboard-bar"), {
        type: "bar",
        data: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: "This year",
                    backgroundColor: window.theme.primary,
                    borderColor: window.theme.primary,
                    hoverBackgroundColor: window.theme.primary,
                    hoverBorderColor: window.theme.primary,
                    data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
                    barPercentage: 0.75,
                    categoryPercentage: 0.5,
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            display: false,
                        },
                        stacked: false,
                        ticks: {
                            stepSize: 20,
                        },
                    },
                ],
                xAxes: [
                    {
                        stacked: false,
                        gridLines: {
                            color: "transparent",
                        },
                    },
                ],
            },
        },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    var markers = [
        {
            coords: [37.77, -122.41],
            name: "San Francisco: 375",
        },
        {
            coords: [40.71, -74.0],
            name: "New York: 350",
        },
        {
            coords: [39.09, -94.57],
            name: "Kansas City: 250",
        },
        {
            coords: [36.16, -115.13],
            name: "Las Vegas: 275",
        },
        {
            coords: [32.77, -96.79],
            name: "Dallas: 225",
        },
    ];
    var map = new jsVectorMap({
        map: "us_aea_en",
        selector: "#usa_map",
        zoomButtons: true,
        markers: markers,
        markerStyle: {
            initial: {
                r: 9,
                stroke: window.theme.white,
                strokeWidth: 7,
                stokeOpacity: 0.4,
                fill: window.theme.primary,
            },
            hover: {
                fill: window.theme.primary,
                stroke: window.theme.primary,
            },
        },
        regionStyle: {
            initial: {
                fill: window.theme["gray-200"],
            },
        },
        zoomOnScroll: false,
    });
    window.addEventListener("resize", () => {
        map.updateSize();
    });
    setTimeout(function () {
        map.updateSize();
    }, 250);
});

document.addEventListener("DOMContentLoaded", function (event) {
    setTimeout(function () {
        if (localStorage.getItem("popState") !== "shown") {
            window.notyf.open({
                type: "success",
                message:
                    'Get access to all 500+ components and 45+ pages with AdminKit PRO. <u><a class="text-white" href="https://adminkit.io/pricing" target="_blank">More info</a></u> 🚀',
                duration: 10000,
                ripple: true,
                dismissible: false,
                position: {
                    x: "left",
                    y: "bottom",
                },
            });

            localStorage.setItem("popState", "shown");
        }
    }, 15000);
});
