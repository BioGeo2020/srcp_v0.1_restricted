var map, featureList, scenicrimSearch = [], conservationSearch = [], propertiesSearch = [], hubsSearch = [], centroidsSearch = [], speciesSearch = [], glidersSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(scenicrim.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(conservation.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(properties.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  hubs.eachLayer(function (layer) {
    if (map.hasLayer(hubsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/leaf.png"></td><td class="feature-Name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  
    centroids.eachLayer(function (layer) {
    if (map.hasLayer(centroidsLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/rural.png"></td><td class="feature-Name">' + layer.feature.properties.BoroName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });  
    
  /* Loop through museums/species layer and add only features which are in the map bounds */
  species.eachLayer(function (layer) {
    if (map.hasLayer(speciesLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/koala.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
    
    gliders.eachLayer(function (layer) {
    if (map.hasLayer(glidersLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/parrot.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  }); 

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */

var osmhot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});

var thunder = L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=24322d88b0594543912ce4c8ce1a5a5c', {
  maxZoom: 19,
});

var esriImagery = L.layerGroup([L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 15,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 19,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Leaflet.js with Esri World Imagery tiles"
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#0000FF",
  fillOpacity: 0,
  radius: 10
};

var scenicrim = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
    weight: 8,
      fill: false,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    scenicrimSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Scenic Rim",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/scenic_rim.geojson", function (data) {
  scenicrim.addData(data);
});

var conservation = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      border: "black",
      weight: 0.5,
      fill: true,
      opacity: 0.5,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
    conservationSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Conservation areas",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/rural_properties2.geojson", function (data) {
  conservation.addData(data);
});

var properties = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "white",
      border: "black",
      weight: 0.5,
      fill: true,
      opacity: 0.5,
      clickable: true
    };
  },
  onEachFeature: function (feature, layer) {
    propertiesSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Properties",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/rural_properties2.geojson", function (data) {
  properties.addData(data);
});

//Create a color dictionary based off of subway/corridors route_id
var corridorColors = {"1":"#fd9a00", "2":"#ff3135", "3":"#ff3135", "4":"#fd9a00",
    "5":"#ff3135", "6":"#ff3135", "7":"#fd9a00", "8":"#fd9a00", "9":"#fd9a00",
    "10":"#fd9a00"};

var corridorLines = L.geoJson(null, {
  style: function (feature) {
      return {
        color: corridorColors[feature.properties.number],
        weight: 10,
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Number</th><td>" + feature.properties.number + "</td></tr>" + "<tr><th>Corridor name</th><td>" + feature.properties.Corridors + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.number);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#0000FF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        corridorLines.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/corridors.geojson", function (data) {
  corridorLines.addData(data);
});




/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 14
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var hubsLayer = L.geoJson(null);
var hubs = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/leaf.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      + "<tr><th>Hub name</th><td>" + feature.properties.NAME + "</td></tr>" 
      + "<tr><th>Information</th><td>" + feature.properties.INFO + "</td></tr>" 
      + "<tr><th>Longitude</th><td>" + feature.properties.LONG + "</td></tr>" 
      + "<tr><th>Latitiude</th><td>" + feature.properties.LAT + "</td></tr>" 
      + "<tr><th>Web Link</th><td><a class='url-break' href='" 
      + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/leaf.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      hubsSearch.push({
        name: layer.feature.properties.NAME,
        information: layer.feature.properties.INFO,
        source: "Hubs",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/hubs.geojson", function (data) {
  hubs.addData(data);
  map.addLayer(hubsLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove centroids to markerClusters layer */

var centroidsLayer = L.geoJson(null);
var centroids = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/rural.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.BoroName,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      + "<tr><th>Name</th><td>" + feature.properties.BoroName + "</td></tr>" 
      + "<tr><th>Type</th><td>" + feature.properties.FEATURETYP + "</td></tr>" 
      + "<tr><th>Data source</th><td>" + feature.properties.ATTRIBUTES + "</td></tr>" 
      + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.BoroName);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/rural.png"></td><td class="feature-name">' + layer.feature.properties.BoroName + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      centroidsSearch.push({
        name: layer.feature.properties.BoroName,
        type: layer.feature.properties.FEATURETYP ,
        source: "Centroids",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/ruralprop2.geojson", function (data) {
  centroids.addData(data);
  map.addLayer(centroidsLayer);
});





/* Empty layer placeholder to add to layer control for listening when to add/remove museums/species to markerClusters layer */
var speciesLayer = L.geoJson(null);
var species = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/koala.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" 
      + "<tr><th>Date</th><td>" + feature.properties.Date + "</td></tr>" 
      + "<tr><th>Species name</th><td>" + feature.properties.SpeciesName + "</td></tr>" 
      + "<tr><th>Further information</th><td><a class='url-break' href='" 
      + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/koala.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      speciesSearch.push({
        name: layer.feature.properties.NAME,
        Date: layer.feature.properties.Date,
        source: "Mammals'",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/koala.geojson", function (data) {
  species.addData(data);
});

map = L.map("map", {
  zoom: 9,
  center: [-28.0605, 152.8618],
  layers: [esriImagery, scenicrim, corridorLines, properties, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});




/**
 * author Michal Zimmermann <zimmicz@gmail.com>
 * Displays coordinates of mouseclick.
 * @param object options:
 *        position: bottomleft, bottomright etc. (just as you are used to it with Leaflet)
 *        latitudeText: description of latitude value (defaults to lat.)
 *        longitudeText: description of latitude value (defaults to lon.)
 *        promptText: text displayed when user clicks the control
 *        precision: number of decimals to be displayed
 */
L.Control.Coordinates = L.Control.extend({
	options: {
		position: 'bottomleft',
		latitudeText: 'lat.',
		longitudeText: 'lon.',
		promptText: 'Press Ctrl+C to copy coordinates',
		precision: 4
	},

	initialize: function(options)
	{
		L.Control.prototype.initialize.call(this, options);
	},

	onAdd: function(map)
	{
		var className = 'leaflet-control-coordinates',
			that = this,
			container = this._container = L.DomUtil.create('div', className);
		this.visible = false;

			L.DomUtil.addClass(container, 'hidden');


		L.DomEvent.disableClickPropagation(container);

		this._addText(container, map);

		L.DomEvent.addListener(container, 'click', function() {
			var lat = L.DomUtil.get(that._lat),
				lng = L.DomUtil.get(that._lng),
				latTextLen = this.options.latitudeText.length + 1,
				lngTextLen = this.options.longitudeText.length + 1,
				latTextIndex = lat.textContent.indexOf(this.options.latitudeText) + latTextLen,
				lngTextIndex = lng.textContent.indexOf(this.options.longitudeText) + lngTextLen,
				latCoordinate = lat.textContent.substr(latTextIndex),
				lngCoordinate = lng.textContent.substr(lngTextIndex);

			window.prompt(this.options.promptText, latCoordinate + ' ' + lngCoordinate);
    	}, this);

		return container;
	},

	_addText: function(container, context)
	{
		this._lat = L.DomUtil.create('span', 'leaflet-control-coordinates-lat' , container),
		this._lng = L.DomUtil.create('span', 'leaflet-control-coordinates-lng' , container);

		return container;
	},

	/**
	 * This method should be called when user clicks the map.
	 * @param event object
	 */
	setCoordinates: function(obj)
	{
		if (!this.visible) {
			L.DomUtil.removeClass(this._container, 'hidden');
		}

		if (obj.latlng) {
			L.DomUtil.get(this._lat).innerHTML = '<strong>' + this.options.latitudeText + ':</strong> ' + obj.latlng.lat.toFixed(this.options.precision).toString();
			L.DomUtil.get(this._lng).innerHTML = '<strong>' + this.options.longitudeText + ':</strong> ' + obj.latlng.lng.toFixed(this.options.precision).toString();
		}
	}
});








var glidersLayer = L.geoJson(null);
var gliders = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/parrot.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" 
      + "<tr><th>Date</th><td>" + feature.properties.Date + "</td></tr>" 
      + "<tr><th>Species name</th><td>" + feature.properties.SpeciesName + "</td></tr>" 
      + "<tr><th>Further information</th><td><a class='url-break' href='" 
      + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/icons8-parrot-100"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      glidersSearch.push({
        name: layer.feature.properties.NAME,
        Date: layer.feature.properties.Date,
        source: "Birds",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/gclip.geojson", function (data) {
  gliders.addData(data);
});




/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === hubsLayer) {
    markerClusters.addLayer(hubs);
    syncSidebar();
  }
    

  if (e.layer === centroidsLayer) {
    markerClusters.addLayer(centroids);
    syncSidebar();
  }
  if (e.layer === speciesLayer) {
    markerClusters.addLayer(species);
    syncSidebar();
  }
     if (e.layer === glidersLayer) {
    markerClusters.addLayer(gliders);
    syncSidebar();
  } 
    
    
    
    
    
});

map.on("overlayremove", function(e) {
  if (e.layer === hubsLayer) {
    markerClusters.removeLayer(hubs);
    syncSidebar();
  }

  if (e.layer === centroidsLayer) {
    markerClusters.removeLayer(centroids);
    syncSidebar();
  }

  if (e.layer === speciesLayer) {
    markerClusters.removeLayer(species);
    syncSidebar();
   }
    
  if (e.layer === glidersLayer) {
    markerClusters.addLayer(gliders);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Andrew Mackey </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'></a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: true,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
      "Esri Imagery": esriImagery,
    "OSM Hot": osmhot,
   "Topo Map": topo,
   "Carto Light": cartoLight,
   "Thunder forest": thunder

};

var groupedOverlays = {
  "Points of Interest": {
    "<img src='assets/img/koala.png' width='24' height='28'>&nbsp;Mammals": speciesLayer,
    "<img src='assets/img/parrot.png' width='24' height='28'>&nbsp;Birds": glidersLayer,
    "<img src='assets/img/leaf.png' width='24' height='28'>&nbsp;Hubs": hubsLayer,
    "<img src='assets/img/rural.png' width='24' height='28'>&nbsp;Centroids": centroidsLayer

  },
  "Layers": {
    "Scenic Rim": scenicrim,
    "Properties (grey)": conservation,
    "Properties (white)": properties,
    "Corridors": corridorLines
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
    
}).addTo(map);






/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs/properties bounds */
  map.fitBounds(hubs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var propertiesBH = new Bloodhound({
    name: "Properties",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: propertiesSearch,
    limit: 10
  });

  var hubsBH = new Bloodhound({
    name: "Hubs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: hubsSearch,
    limit: 10
  });
    
    var centroidsBH = new Bloodhound({
    name: "Centroids",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: centroidsSearch,
    limit: 10
  });

  var speciesBH = new Bloodhound({
    name: "Mammals",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: speciesSearch,
    limit: 10
  });
    
  var glidersBH = new Bloodhound({
    name: "Birds",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: glidersSearch,
    limit: 10
  }); 
    
    
    

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  propertiesBH.initialize();
  hubsBH.initialize();
  centroidsBH.initialize();
  speciesBH.initialize();
  glidersBH.initialize(); 
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Properties",
    displayKey: "name",
    source: propertiesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Properties</h4>"
    }
  }, {
    name: "Hubs",
    displayKey: "name",
    source: hubsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/leaf.png' width='24' height='28'>&nbsp;Hubs</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{information}}</small>"].join(""))
    }
  }, {
    name: "Centroids",
    displayKey: "name",
    source: centroidsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/rural.png' width='24' height='28'>&nbsp;Centroids</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{type}}</small>"].join(""))
    }
  }, {
    name: "Mammals",
    displayKey: "name",
    source: speciesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/koala.png' width='24' height='28'>&nbsp;Species</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{Date}}</small>"].join(""))
    }
  }, {
    name: "Birds",
    displayKey: "name",
    source: glidersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/parrot.png' width='24' height='28'>&nbsp;Birds</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{Date}}</small>"].join(""))
    }        
  }, {      
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Properties") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Hubs") {
      if (!map.hasLayer(hubsLayer)) {
        map.addLayer(hubsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
      if (datum.source === "Centroids") {
      if (!map.hasLayer(centroidsLayer)) {
        map.addLayer(centroidsLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }       
    if (datum.source === "Species") {
      if (!map.hasLayer(speciesLayer)) {
        map.addLayer(speciesLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Birds") {
     if (!map.hasLayer(glidersLayer)) {
        map.addLayer(glidersLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }       
      
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});



// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}







