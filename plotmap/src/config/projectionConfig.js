export default {
  projections: [
    {
      name: 'EPSG:21781',
      source: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs'
    },
    {
      name: 'EPSG:5588',
      source: '+proj=sterea +lat_0=46.5 +lon_0=-66.5 +k=0.999912 +x_0=304800 +y_0=304800 +datum=NAD27 +units=ft +no_defs'
    },
    {
      name: 'EPSG:4326',
      source: '+proj=longlat +datum=WGS84 +no_defs'
    },
    {
      name: 'EPSG:3857',
      source: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
    }

  ]
}
