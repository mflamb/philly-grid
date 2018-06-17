        // Pull in neighborhoods API and create layer


        var neighborhoods_source = new ol.source.Vector({
            url: 'https://raw.githubusercontent.com/azavea/geo-data/master/Neighborhoods_Philadelphia/Neighborhoods_Philadelphia.geojson',
            format: new ol.format.GeoJSON(),
        });


        var neighborhoods_layer = new ol.layer.Vector({
            source: neighborhoods_source,
            style: outline
        });

        console.log(neighborhoods_layer);

        // Styling for the neighborhoods layer (called on click)

        function outline(feature) {
           var style = new ol.style.Style({
               stroke: new ol.style.Stroke({
                 color: '#a9a9a9',
                 width: 2
               })
           });
           return [style];
         }

        // Pull in affordable housing API and create layer

        var affordable_source = new ol.source.Vector({
            url: 'https://phl.carto.com/api/v2/sql?q=SELECT+*+FROM+affordablehousingproduction&filename=affordablehousingproduction&format=geojson&skipfields=cartodb_id',
            format: new ol.format.GeoJSON(),
        });

        var affordable_layer = new ol.layer.Vector({
            source: affordable_source,
            style: affordstyle
        });

        console.log(affordable_layer);


        // Styling for affordable housing layer (dots)

        function affordstyle(feature) {
          var style = new ol.style.Style({
           image: new ol.style.Circle({
             radius: 6,
             stroke: new ol.style.Stroke({
               color: 'white',
               width: 2
             }),
             fill: new ol.style.Fill({
               color: '#f3a4a4'
             })
           })
         });
         return [style];
       }

        // Pull in housing counseling API and create layer

        var commercial_corridors_source = new ol.source.Vector({ /// COMMERCIAL CORRIDORS
            url: 'https://phl.carto.com/api/v2/sql?q=SELECT+*+FROM+phl.commercial_corridors&filename=phl.commercial_corridors&format=geojson&skipfields=cartodb_id',
            format: new ol.format.GeoJSON(),
        });


        var commercial_corridors_layer = new ol.layer.Vector({  /// COMMERCIAL CORRIDORS
            source: commercial_corridors_source,
            style: commercialStyle
        });

        console.log(commercial_corridors_layer);   /// COMMERCIAL CORRIDORS

        // Styling for commercial corridors layer

        function commercialStyle(feature) {
          var myStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
            color: '#319FD3',
            width: 1    
            }),
            fill: new ol.style.Fill({
            color: 'rgba(253, 215, 215, 0.6)'
            })
          });
         return [myStyle];
        }

        // Pull in parks API and create layer

        var residential_parking_source = new ol.source.Vector({   /// RESIDENTIAL PARKING PERMIT BLOCKS
            url: 'https://phl.carto.com/api/v2/sql?q=select+*+from+phl.residential_parking_permit_blocks&filename=phl.residential_parking_permit_blocks&format=geojson&skipfields=cartodb_id',
            format: new ol.format.GeoJSON()
        });

        var residential_parking_layer = new ol.layer.Vector({  /// RESIDENTIAL PARKING PERMIT BLOCKS
            source: residential_parking_source,
            style: parkingStyle
        });

        console.log(residential_parking_layer);

        function parkingStyle(feature) {   /// RESIDENTIAL PARKING PERMIT BLOCKS
         var style = new ol.style.Style({
           image: new ol.style.Circle({
             radius: 6,
             stroke: new ol.style.Stroke({
               color: 'white',
               width: 2
             }),
             fill: new ol.style.Fill({
               color: '40404c'
             })
           })
         });
         return [style];
       }

        // Pull in API for base map styling

        var baseMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'http://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            })
        });

        // Initialize the map display

        var map = new ol.Map({
            target: 'map',
            layers: [baseMap, neighborhoods_layer, commercial_corridors_layer, affordable_layer, residential_parking_layer],
            view: new ol.View({
                center: ol.proj.fromLonLat([-75.166923, 39.955948]),
                zoom: 13
            })

        });

        // Save layers as a variable for later use

        var layersinmap = [neighborhoods_layer, commercial_corridors_layer, affordable_layer, residential_parking_layer];


        // Intersecting function
        // Wrapped lines 140 - 217 in a "DOMContentLoaded" event listener because this code was firing too early and unable to grab DOM elements
        
        document.addEventListener("DOMContentLoaded", ()=> {
            var select = null;
            var selectClick = new ol.interaction.Select({
            condition: ol.events.condition.click
        });
        var selectAltClick = new ol.interaction.Select({
            condition: function(mapBrowserEvent) {
                return ol.events.condition.click(mapBrowserEvent) && ol.events.condition.altKeyOnly(mapBrowserEvent);
            }
        });
        var selectElement = document.getElementById('type');

        // When specific map layer elements are clicked, grab info and display it for the user
    
        var changeInteraction = function() {
            if (select !== null) {
                map.removeInteraction(select);
            }
            var value = selectElement.value;
            if (value == 'click') {
                select = selectClick;
            } else {
                select = null;
            }
            if (select !== null) {
                map.addInteraction(select);
                map.on('click', function(event) {

                    layersinmap.forEach(function(layer) {

                        layer.once('precompose', function(event) {
                            var selectedFeatures = selectClick.getFeatures();
                            
                            if (selectedFeatures.a[0] !== undefined) {
                            var commName = selectedFeatures.a[0].N.name;
                            var commVacancyCount = selectedFeatures.a[0].N.vac_count;
                            var commVacancyRate = selectedFeatures.a[0].N.vac_rate;
                            ////////// THIS IS NOW COMMERCIAL CORRIDORS LAYER
                            
                            var neighborhoodselected = selectedFeatures.a[0].N.mapname;

                            
                            var residentialBlock = selectedFeatures.a[0].N.block;
                            var residentialDistrictNo = selectedFeatures.a[0].N.district_number;
                            var residentialStreet = selectedFeatures.a[0].N.street;
                            ///////// THIS IS NOW RESIDENTIAL PERMIT PARKING BLOCKS

                            var affordname = selectedFeatures.a[0].N.name;
                            var affordaddress = selectedFeatures.a[0].N.address;
                            var affordunits = selectedFeatures.a[0].N.total_unit;
                            

                            if (neighborhoodselected !== undefined) {
                                document.getElementById('Neighborhood_Info').setAttribute("style", "display:visible");
                                document.getElementById('description').innerHTML = '<b>Selected Neighborhood</b>'
                                document.getElementById('description').setAttribute("style", "display:visible");
                                document.getElementById('Neighborhood_Info').innerHTML = neighborhoodselected;
                                document.getElementById('counsel_info').innerHTML = '';
                                document.getElementById('afford_info').innerHTML = '';
                                document.getElementById('res_parking_info').innerHTML = '';                           

                            } else if (commName !== undefined && commVacancyCount !== undefined) {
                                document.getElementById('description').innerHTML = '<b>Selected Commercial District Description</b>';
                                document.getElementById('description').setAttribute("style", "display:visible");
                                if (commVacancyCount !== null && commVacancyRate !== null) {
                                document.getElementById('counsel_info').innerHTML = `${commName} <br><br> <b>Commercial Vacancy Count: </b> ${commVacancyCount} <br><br> <b>Commercial Vacancy Rate: </b> ${commVacancyRate}`;
                                document.getElementById('Neighborhood_Info').innerHTML = '';
                                document.getElementById('afford_info').innerHTML = '';
                                document.getElementById('res_parking_info').innerHTML = '';
                                } else {
                                document.getElementById('counsel_info').innerHTML = `<b>Name: </b><br>${commName} <br><br> No vacancy data available for this district`; 
                                document.getElementById('Neighborhood_Info').innerHTML = '';
                                document.getElementById('afford_info').innerHTML = '';
                                document.getElementById('res_parking_info').innerHTML = '';                                
                                }

                            } else if (affordname !== undefined) {
                                document.getElementById('description').innerHTML = '<b>Selected Affordable Housing Description</b>';
                                document.getElementById('description').setAttribute("style", "display:visible");
                                document.getElementById('afford_info').innerHTML = `<b>Organization: </b><br> ${affordname} ${affordaddress} ${affordunits};`
                                document.getElementById('Neighborhood_Info').innerHTML = '';
                                document.getElementById('counsel_info').innerHTML = '';
                                document.getElementById('res_parking_info').innerHTML = '';                                
                            }
                            else if (residentialBlock !== undefined){
                                document.getElementById('description').innerHTML = '<b>Selected Residential Parking Permit Details</b>';
                                document.getElementById('description').setAttribute("style", "display:visible");
                                document.getElementById('res_parking_info').innerHTML = `<b>Street: </b> ${residentialStreet} <br>Block: </b>${residentialBlock} <br><b>District Number: <b>${residentialDistrictNo}`;
                                document.getElementById('counsel_info').innerHTML = '';
                                document.getElementById('afford_info').innerHTML = '';
                                document.getElementById('Neighborhood_Info').innerHTML = '';
                            } 
                        }

                    });
                })
            });

        }
    };


        selectElement.onchange = changeInteraction;
        changeInteraction();
})

        // Create styling for hover effect

        var highlightStyleCache = {};
        var featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector(),
            map: map,
            style: function(feature, resolution) {
                var text = resolution * 100000 < 10 ? feature.get('text') : '';
                if (!highlightStyleCache[text]) {
                    highlightStyleCache[text] = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#000066',
                            width: 2
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(192,192,192,0.7)'
                        }),
                        text: new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            text: text,
                            fill: new ol.style.Fill({
                                color: '#000'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#f00',
                                width: 3
                            })
                        })
                    });
                }
                return highlightStyleCache[text];
            }
        });

        // Grab features to get neighborhood information on hover and display for the user

        var highlight;
        var displayFeatureInfo = function(pixel) {

            var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
                return feature;
            });

            var info = document.getElementById('info');
            if (feature && feature.get('mapname')) {
                info.innerHTML = '<b>Mouseover Neighborhood: </b><br>' + feature.get('mapname')
            } else {
                info.innerHTML = '&nbsp;';
            }

            if (feature !== highlight) {
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                }
                if (feature) {
                    featureOverlay.getSource().addFeature(feature);
                }
                highlight = feature;
            }
        };

        // On-hover effect

        map.on('pointermove', function(evt) {
            if (evt.dragging) {
                return;
            }
            var pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

        // Checkboxes and event listeners to toggle each layer on/off

        var checkbox_f = document.getElementById("checkbox_Nej");

        checkbox_f.addEventListener('click', function() {
            var checked = this.checked;
            if (checked !== neighborhoods_layer.getVisible()) {
                neighborhoods_layer.setVisible(checked);
            }
        });

        neighborhoods_layer.on('click:visible', function() {
            var visible = this.getVisible();
            if (visible !== checkbox.checked) {
                checkbox.checked = visible;
            }
        });

        var checkbox_f = document.getElementById("checkbox_Nej");

        checkbox_f.addEventListener('click', function() {
            var checked = this.checked;
            if (checked !== neighborhoods_layer.getVisible()) {
                neighborhoods_layer.setVisible(checked);
            }
        });

        neighborhoods_layer.on('click:visible', function() {
            var visible = this.getVisible();
            if (visible !== checkbox.checked) {
                checkbox.checked = visible;
            }
        });

        var checkbox = document.getElementById("checkbox");
    

        checkbox.addEventListener('click', function() {
            var checked = this.checked;
            if (checked !== affordable_layer.getVisible()) {
                affordable_layer.setVisible(checked);
            }
        });

        affordable_layer.on('click:visible', function() {
            var visible = this.getVisible();
            if (visible !== checkbox.checked) {
                checkbox.checked = visible;
            }
        });

        var checkbox_c = document.getElementById("checkbox_counsel");

        checkbox_c.addEventListener('click', function() {
            var checked = this.checked;
            if (checked !== commercial_corridors_layer.getVisible()) {
                commercial_corridors_layer.setVisible(checked);
            }
        });

        commercial_corridors_layer.on('click:visible', function() {
            var visible = this.getVisible();
            if (visible !== checkbox.checked) {
                checkbox.checked = visible;
            }
        });

        var checkbox_d = document.getElementById("checkbox_parks");

        checkbox_d.addEventListener('click', function() {
            var checked = this.checked;
            if (checked !== residential_parking_layer.getVisible()) {
                residential_parking_layer.setVisible(checked);
            }
        });

        residential_parking_layer.on('click:visible', function() {
            var visible = this.getVisible();
            if (visible !== checkbox.checked) {
                checkbox.checked = visible;
            }
        });

