const small_radius = 7;
const large_radius = 10;
const medium_radius = 8;

const legend_values = [
    {name: "Drive", color: "#34495e"},
    {name: "Hike", color: "#27ae60"},
    {name: "Raft", color: "#2980b9"},
];

let currentZoomState = null;
const zoomStates = {
    HIKE: "hike",
    FOOD_DRIVE: "food_drive",
    LAKE_DRIVE: "lake_drive",
    RAFT: "raft",
};

function zoomReset() {
    if (currentZoomState === zoomStates.HIKE) {
        plotHike();
    }

    if (currentZoomState === zoomStates.FOOD_DRIVE) {
        plotFoodDrive();
    }

    if (currentZoomState === zoomStates.LAKE_DRIVE) {
        plotLakeDrive();
    }

    if (currentZoomState === zoomStates.RAFT) {
        plotRaft();
    }
}

let ira_spring = new AnimatedMap("map", [47.499415, -121.926485], 11, zoomReset);
ira_spring.initCircle([-122.33744, 47.61685], "drive-circle", small_radius);
ira_spring.addAnimatedPath("./data/ira_spring_drive1.geojson", "drive", 6000, function() {
    ira_spring.clear();
    currentZoomState = zoomStates.HIKE;
    ira_spring.map.flyTo([47.418414, -121.565887], 15);
});

ira_spring.initLegend(legend_values, "topright");

function plotHike() {
    ira_spring.addPath("./data/ira_spring_drive1.geojson", "drive");
    ira_spring.initCircle([-121.58303, 47.4245], "hike-circle", large_radius);
    ira_spring.addAnimatedPath("./data/ira_spring_hike.geojson", "hike", 18000, function() {
        ira_spring.clear();
        currentZoomState = zoomStates.FOOD_DRIVE;
        ira_spring.map.flyTo([47.499415, -121.926485], 11);
    });
}

function plotFoodDrive() {
    ira_spring.addPath("./data/ira_spring_hike_one_way.geojson", "hike");
    ira_spring.initCircle([-121.58303, 47.4245], "drive-circle", small_radius);
    ira_spring.addAnimatedPath("./data/ira_spring_drive2.geojson", "drive", 6000, function() {
        ira_spring.clear();
        currentZoomState = zoomStates.LAKE_DRIVE;
        ira_spring.map.flyTo([47.603787, -122.315821], 13);
    });
}

function plotLakeDrive() {
    ira_spring.addPath("./data/ira_spring_drive2.geojson", "drive");
    ira_spring.initCircle([-122.31156, 47.57946], "drive-circle", medium_radius);
    ira_spring.addAnimatedPath("./data/ira_spring_drive3.geojson", "lake-drive", 3000, function() {
        ira_spring.clear();
        currentZoomState = zoomStates.RAFT; 
        ira_spring.map.flyTo([47.637794, -122.334948], 14);
    });
}

function plotRaft() {
    ira_spring.addPath("./data/ira_spring_drive3.geojson", "drive");
    ira_spring.initCircle([-122.33490943908691, 47.6275123537003], "raft-circle", large_radius);
    ira_spring.addAnimatedPath("./data/ira_spring_raft.geojson", "raft", 5000, plotReturnDrive);
}

function plotReturnDrive() {
    ira_spring.circle.attr("class", "drive-circle");
    ira_spring.addAnimatedPath("./data/ira_spring_drive4.geojson", "return-drive", 2800, null);
}