import {Style, Stroke, Fill, Circle, Text} from "ol/style"; // TODO: use vuelayers functions?
import {MultiPoint} from "ol/geom";
import {asArray as hexToRgb} from "ol/color";

// ------

export function createDefaultStroke(opacity=0.5) {
    return new Stroke({color: [0, 0, 0, opacity], width: 2});
}

// -----

export function isCluster(feature) {
    let annot = feature.get("annot");
    if(annot == null) {
        return;
    }
    return annot.count != null;
}

// -----

export function createColorStyle(color, defaultStroke, opacity=0.5) {
    let colorArray = hexToRgb(color);

    let colorWithOpacity = colorArray.slice();
    colorWithOpacity[3] = opacity;
    let fill = new Fill({color: colorWithOpacity});

    let circleStyle = new Circle({
        radius: 5,
        fill: new Fill({color: colorArray}),
        stroke: createDefaultStroke(1),
        opacity
    });
    circleStyle.setOpacity(opacity);

    return new Style({
        fill,
        stroke: defaultStroke,
        image: circleStyle
    });
}

// -----

let textFill = new Fill({color: "#fff"});
let textStroke = new Stroke({color: "#000", width: 3});

export function createTextStyle(text, fontSize="22px", fill=textFill, stroke=textStroke) {
    return new Style({
        text: new Text({
            text,
            font: `${fontSize} Arial, sans-serif`,
            overflow: true,
            fill,
            stroke
        })
    });
}

// -----

let width = 2;

let blue = [0, 153, 255, 1];
let white = [255, 255, 255, 1];

let blueStroke = new Stroke({color: blue, width: width});
let whiteStroke = new Stroke({color: white, width: width + 2});

export let selectStyles = [
    new Style({ stroke: whiteStroke }),
    new Style({ stroke: blueStroke }),
    new Style({ image: new Circle({radius: 6, stroke: blueStroke}) })
];

export let verticesStyle = new Style({
    image: new Circle({radius: width + 1, fill: new Fill({color: blue})}),
    geometry: function(feature) {
        // return the coordinates of the first ring of the polygon
        var coordinates = feature.getGeometry().getCoordinates()[0];
        return new MultiPoint(coordinates);
    }
});

// -----

export function changeOpacity(style, opacity) {
    let color = style.getFill().getColor();
    color[3] = opacity;
    style.getImage().setOpacity(opacity);
}

// -----

export const defaultColors = Object.freeze([
    {name: "black", fill: new Fill({color: "#000"})},
    {name: "white", fill: textFill},
    {name: "red", fill: new Fill({color: "#ff0000"})},
    {name: "orange", fill: new Fill({color: "#ff6600"})},
    {name: "yellow", fill: new Fill({color: "#ffff00"})},
    {name: "green", fill: new Fill({color: "#008000"})},
    {name: "blue", fill: new Fill({color: "#0000ff"})},
    {name: "purple", fill: new Fill({color: "#800080"})},
]);
