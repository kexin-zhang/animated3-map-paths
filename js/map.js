class AnimatedMap {
    constructor(div_id, start_coord, zoom, reset) {
        this.div_id = div_id;
        this.circle = null;

        this.map = L.map(div_id, {zoomControl: false });
        this.map.setView(start_coord, zoom);

        // disable panning + zooming
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();

        // add tiles
        let tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 18
        });
        tiles.addTo(this.map);

        // hit that reset function on zoom
        this.map.on("viewreset moveend", reset);

        // add d3 overlay
        this.svg = d3.select(this.map.getPanes().overlayPane).append("svg")
                     .attr("id", "overlay")
                     .attr("class", "leaflet-zoom-hide")
                     .style("width", this.map.getSize().x + "px")
                     .style("height", this.map.getSize().y + "px");

        this.g = this.svg.append("g");
    }

    addPath(filename, classname) {
        let map = this.map;
        let g = this.g;

        let transform = d3.geoTransform({point: function(x, y) {
                let point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        });
        let path = d3.geoPath().projection(transform);

        d3.json(filename, function(error, data) {
            if (error) throw error;

            let coordinates = data.features; 

            g.selectAll(`.${classname}`)
             .data(coordinates)
             .enter()
             .append("path")
             .attr("class", classname)
             .attr("d", path);     
        });
    }

    addAnimatedPath(filename, classname, duration, callback) {
        let map = this.map;
        let g = this.g;
        let circle = this.circle;

        let transform = d3.geoTransform({point: function(x, y) {
                let point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        });
        let path = d3.geoPath().projection(transform);

        d3.json(filename, function(error, data) {
            if (error) throw error;

            let coordinates = data.features; 

            let line = g.selectAll(`.${classname}`)
                             .data(coordinates)
                             .enter()
                             .append("path")
                             .attr("class", classname)
                             .attr("d", path);

            line.transition()
                .duration(duration)
                .attrTween("stroke-dasharray", function() {
                    return function(t) {
                        // for stroke dash array interpolation 
                        // https://bl.ocks.org/mbostock/5649592
    
                        let l = line.node().getTotalLength(),
                            i = d3.interpolateString("0," + l, l + "," + l);
                        
                        if (circle) {
                            let p = line.node().getPointAtLength(t * l);
                            circle.attr("transform", "translate(" + p.x + "," + p.y + ")")
                        }
                        
                        return i(t);
                    }
                })
                .on("end", callback);
        });
    }

    initCircle(coords, classname, radius) {
        let point = this.map.latLngToLayerPoint(new L.LatLng(coords[1], coords[0]));

        this.circle = this.g.append("circle")
                            .attr("cx", 0)
                            .attr("cy", 0)
                            .attr("transform", "translate(" + point.x + "," + point.y + ")")
                            .attr("r", radius)
                            .attr("class", classname);
    }

    initLegend(values, position) {
        L.Control.Legend = L.Control.extend({
            onAdd: function(map) {
                let div = L.DomUtil.create('div', 'legend');
                div.innerHTML = "";
                values.forEach(element => {
                    div.innerHTML += `<i style="background: ${element.color}"></i> ${element.name} <br>`
                });

                return div;
            } 
        });

        L.control.legend = function(opts) {
            return new L.Control.Legend(opts);
        }

        L.control.legend({ position: position }).addTo(this.map);
    }

}; 