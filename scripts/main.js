require(["esri/config",
         "esri/Map",
         "esri/Basemap",
         "esri/views/MapView",
         "esri/views/SceneView",
         "esri/layers/FeatureLayer",
         "esri/layers/WebTileLayer",
         
         "esri/PopupTemplate",


         //Widgets
         "esri/widgets/Home",
         "esri/widgets/BasemapToggle",
         "esri/widgets/ScaleBar",
         "esri/widgets/Legend",
         "esri/widgets/Daylight", 
         "esri/widgets/LineOfSight",
         "esri/widgets/Expand",],


function (esriConfig,Map,Basemap, MapView, SceneView, FeatureLayer, WebTileLayer, PopupTemplate, Home,  BasemapToggle, ScaleBar, Legend, Daylight, LineOfSight,  Expand){ 
    esriConfig.apiKey = "AAPKd3aa46c1c3d54a0190c6ffe38946fa80TDGANcViZs67KXGbFFe5AMZ5nfNdJeow7GOOiqtn3xSJ7uTiorMEVaPWDN1SkN7w";

//Custom Basemap////////////////////////////////////////////////////////////////////////////////////////////////////
////// I can use this if i uncomment out the basemap see line 67.
// Create a WebTileLayer with a third-party cached service
const mapBaseLayer = new WebTileLayer({
    urlTemplate: "https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png",
    subDomains: ["a", "b", "c", "d"],
    copyright:
      'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
      'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' +
      'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ' +
      'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
  });

/*   // define 3D Symbol
          // Create objectSymbol and add to renderer
          const objectSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
              {
                type: "object", // autocasts as new ObjectSymbol3DLayer()
                width: 500,
                height: 2500,
                resource: {
                  primitive: "cylinder"
                },
                material: {
                  color: "orange"
                }
              }
            ]
          };
  
          const objectSymbolRenderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: objectSymbol
          };

  let hantsPlaces = new FeatureLayer({
    url: "https://services3.arcgis.com/11oopqesxRvpDhY3/arcgis/rest/services/hantsplaces/FeatureServer/0",
    title: "Hants Places", 
    renderer: objectSymbolRenderer,// changes in legend
    //popupTemplate:{title: " Status of Heritage Designation is: {STATUS}"
   
  }); */

// Creating the pop-up template for the polygon layer.
  const templatePoly = {
    // autocasts as new PopupTemplate()
    title: "Active and Proposed Heritage Conservation Districts: {HCDNAME}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "STATUS",
            label: "Status"
          },
            {fieldName: "SOURCE",
            label: "Source" },
            {fieldName: "SDATE",
            label: "Source Date" },
            {fieldName: "ADDDATE",
            label: "Date Added" },
            {fieldName: "MODDATE",
            label: "Date Modified" }
        ]}]};
          
  ////////////////////////

  /// Creating the pop-up template for the POINT layer
  const templatePoint = {
      title: "Historic Building: {NAME}",
      content: [{


        type: "fields",
        fieldInfos: [
            { fieldName: "TYPE_",
              label: "Type"},
            {fieldName: "HRTGDIST",
            label: "Heritage District"},
            {fieldName: "YEAR_",
            label: "Year"},
            {fieldName: "DESCRIPTION",
            label: "Description"},


        
            ]}]

  
    };

    // symbolizing the polygon layer based on whether the heritage district exists or is proposed
    let renderer = {
        type: "unique-value",  // autocasts as new UniqueValueRenderer()
        field: "STATUS",
          // autocasts as new SimpleFillSymbol()
        uniqueValueInfos: [{
          // All features with value of "In Effect" will be green
          value: "EFF",
          label: "In Effect",
          symbol: {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: "rgba(34,139,34,0.4)", // the "a" here is to set the transparency :)
         
          }
          
        },
        
        {
          // All features with value of "East" will be green
          value: "PRP",
          label: "Proposed",
          symbol: {
            type: "simple-fill",  // autocasts as new SimpleFillSymbol()
            color: "rgba(255,165,0,0.4)",
          },
    }]};

    
    


  let heritageDistricts = new FeatureLayer({
      url: "https://services2.arcgis.com/11XBiaBYA9Ep0yNJ/ArcGIS/rest/services/Active_and_Proposed_Heritage_Conservation_Districts/FeatureServer",
      renderer: renderer,
      title: "Proposed and Existing Heritage Districts in HRM",
      popupTemplate:templatePoly,
      copyright: "The Heritage Districts polygon layer comes from Halifax Open Data's ArcGIS REST Services and shows both proposed and existing heritage districts in HRM."
      
  });

  let heritageBuildings = new FeatureLayer({
      url: "https://services2.arcgis.com/11XBiaBYA9Ep0yNJ/ArcGIS/rest/services/HistoricSites___Dev/FeatureServer/1",
      title: "Historic Buildings",
      popupTemplate: templatePoint,
      copyright: "The Building layer comes from Halifax Open Data's ArcGIS REST Services Directory, and contains information about historic buildings in HRM.",
  });


  // Creating the map. The basemap is being set. Inaccessible without the API Key.
const myMap = new Map({ // setting the map layer
    basemap: "arcgis-streets-relief" ,
    ground: "world-elevation"
});
myMap.layers.add(heritageDistricts);
myMap.layers.add(heritageBuildings);



  // Create a basic SceneView instance with a basemap and world elevation
const view = new SceneView({
    // An instance of Map or WebScene
    map: myMap,
    //center: [-63.582687,44.651070],
    //zoom: 1,
  
    // The id of a DOM element (may also be an actual DOM element)
    container: "viewDiv",
    camera: {
        position: [
            -63.568860,
            44.615000,
        
            1250 // elevation in meters
        ],

        tilt: 60
        

    }

    
  });
  
 
  // adds the home widget to the top left corner of the MapView
  
// home widget
let homeWidget = new Home({
    view: view
  });
  
  view.ui.add(homeWidget, "top-left");

// add basemap toggle widget

let basemapToggle = new BasemapToggle({ //this one here is the CONSTRUCTOR.
    view: view,
    nextBasemap: "satellite"
  });

view.ui.add(basemapToggle, "bottom-right");  // this adds the widget

// add Daylight

const daylight = new Daylight({
    view: view,
    dateOrSeason: "season"
  });
//view.ui.add(daylight, "bottom-right");

//add line of sight widget
// typical usage
const lineOfSight = new LineOfSight({
    view: view
  });


  // legend 
  let legend = new Legend({
    view: view
  });
  
  view.ui.add(legend, "top-right");

  // Line of Sight Expand Widget

  const loSExpand = new Expand({
    view: view,
    content: lineOfSight,
    container: document.createElement("widgetsDiv"),
    expandIconClass: "esri-icon-layer-list",
    group: "bottom-right"
  });

  view.ui.add([loSExpand,], "bottom-left");

  const daylightExpand = new Expand({
    view: view,
    content: daylight,
    container: document.createElement("widgetsDiv"),
    expandIconClass: "esri-icon-layer-list",
    group: "bottom-right"
  });

  view.ui.add([daylightExpand,], "bottom-left");









}); 