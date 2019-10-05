import * as maptalks from 'maptalks'

var map = new maptalks.Map$1('map', {
    center: [-0.113049,51.498568],
    zoom: 14,
    pitch : 56,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    })
  });
  
  var center = map.getCenter();
  
  var rectangle = new maptalks.Rectangle(center.add(-0.018,0.012), 800, 700, {
    symbol: {
      lineColor: '#34495e',
      lineWidth: 2,
      polygonFill: '#34495e',
      polygonOpacity: 0.4
    },
    properties : {
      altitude : 100
    }
  });

  new maptalks.VectorLayer('vector', { enableAltitude : true })
    .addGeometry(rectangle)
    .addTo(map);
