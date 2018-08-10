const small_radius = 7;
const medium_radius = 8;
const large_radius = 10;

const legend_values = [
    {name: "Drive", color: "#34495e"},
    {name: "Hike", color: "#27ae60"},
    {name: "Raft", color: "#2980b9"},
];

const zoomStates = {
    HIKE: "hike",
    FOOD_DRIVE: "food_drive",
    RETURN_DRIVE: "return_drive"
};

let currentZoomState = null;

// this gets called whenever the map zoom level is reset
function zoomReset() {
    if (currentZoomState === zoomStates.HIKE) {
        onp.addPath("./data/onp_drive1.geojson", "drive");
        onp.initCircle([-123.32757, 47.51479], "hike-circle", large_radius);
        plotHike();
    }

    if(currentZoomState === zoomStates.FOOD_DRIVE) {
        plotFoodDrive();
    }

    if(currentZoomState == zoomStates.RETURN_DRIVE) {
        plotReturnDrive();
    }
}

let onp = new AnimatedMap("map", [47.2995, -122.6207], 9, zoomReset);
onp.initCircle([-122.33744, 47.61685], "drive-circle", small_radius);
onp.addAnimatedPath("./data/onp_drive1.geojson", "drive", 10000, function() {
    d3.selectAll(".drive").remove();
    d3.selectAll("circle").remove();
    currentZoomState = zoomStates.HIKE;
    onp.map.flyTo([47.512171, -123.323818], 14);
});
onp.initLegend(legend_values, "topright")

function plotHike() {
    onp.addAnimatedPath("./data/onp_hike.geojson", "hike", 7000, plotLakeDrive);
}

function plotLakeDrive() {
    onp.circle.attr("class", "drive-circle");
    onp.addAnimatedPath("./data/onp_drive2.geojson", "lake-drive", 5000, plotRaft);
}

function plotRaft() {
    onp.circle.attr("class", "raft-circle");
    onp.addAnimatedPath("./data/onp_raft.geojson", "raft", 7000, function() {
        d3.selectAll("path").remove();
        d3.selectAll("circle").remove();
        currentZoomState = zoomStates.FOOD_DRIVE;
        onp.map.flyTo([47.466555, -123.219021], 12);
    });
}

function plotFoodDrive() {
    // onp.addPath("./data/onp_drive1.geojson", "drive");
    onp.addPath("./data/onp_hike.geojson", "hike");
    onp.addPath("./data/onp_drive2.geojson", "lake-drive");
    onp.addPath("./data/onp_raft.geojson", "raft");

    onp.initCircle([-123.31544, 47.50567], "drive-circle", medium_radius);
    onp.addAnimatedPath("./data/onp_drive3.geojson", "drive", 5000, plotCampDrive);
}

function plotCampDrive() {
    onp.addAnimatedPath("./data/onp_drive4.geojson", "camp-drive", 5000, function() {
        d3.selectAll("path").remove();
        d3.selectAll("circle").remove();
        currentZoomState = zoomStates.RETURN_DRIVE;
        onp.map.flyTo([47.2995, -122.6207], 9);
    });
}

function plotReturnDrive() {
    // onp.addPath("./data/onp_drive1.geojson", "drive");
    onp.addPath("./data/onp_hike.geojson", "hike");
    onp.addPath("./data/onp_drive2.geojson", "lake-drive");
    onp.addPath("./data/onp_raft.geojson", "raft");

    onp.initCircle([-123.32757, 47.51479], "drive-circle", small_radius);
    onp.addAnimatedPath("./data/onp_drive5.geojson", "drive", 10000, null);
}