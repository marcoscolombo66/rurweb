// google maps
let map;
var MARKERS = [];
var CURRENT_STATE,CURRENT_CITY;
var prev_infowindow;

async function initMap() {

  console.log('Google Maps API loaded');

  // argentina
  const position = { lat: -38.416096, lng: -63.616673 };

  // request needed libraries
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { PinElement } = await google.maps.importLibrary("marker");

  var geocoder = new google.maps.Geocoder();

  // execute only if map placeholder exist
  if($('#map').length) {

    // styles
    var stylesArray = [
      {
        featureType: "poi.attraction",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi.business",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi.government",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi.medical",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi.place_of_worship",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi.school",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi.sports_complex",
        stylers: [{visibility: "off"}]
      }
    ];

    // setup map
    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: position,
      mapId: 'map',
      styles: stylesArray
    });

    // set clusters
    const renderer = {
      render({ count, position }, stats, map) {
        const color = '#FF8300';
        // create svg url with fill color
        const svg = window.btoa(`
          <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
            <circle cx="120" cy="120" opacity="1" r="70" />
            <circle cx="120" cy="120" opacity=".3" r="90" />
            <circle cx="120" cy="120" opacity=".2" r="110" />
            <circle cx="120" cy="120" opacity=".1" r="130" />
          </svg>`);
        // create marker using svg icon
        return new google.maps.Marker({
            position,
            icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
            },
            label: {
                text: String(count),
                color: "#ffffff",
                fontSize: "14px",
            },
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        });
      }
    };

    var markerCluster = new markerClusterer.MarkerClusterer({ map, MARKERS, renderer });

    // add markers
    $('[data-id]').each(function(){

      var $this = $(this);
      var lat = parseFloat($this.attr('data-lat'));
      var lng = parseFloat($this.attr('data-lng'));

      var name = $this.find('[data-info="name"]').text();
      var address = $this.find('[data-info="address"]').text();
      var phone = $this.find('[data-info="phone"]').text();
      var products = $this.find('[data-info="products"]').text();
      var hours = $this.find('[data-info="hours"]').text();
      var web = $this.find('[data-info="web"]').text();

      var type = $this.attr('data-type');

      var content = $this.html();

      // only if has coordinates
      if(lat && lng) {

        // black-series marker
        const blackMarker = new PinElement({
          background: '#1B1B2F',
          borderColor: '#1B1B2F',
          glyphColor: '#FF8300',
          scale: 1.25,
        });

        // normal marker
        const normalMarker = new PinElement({
          background: '#FF8300',
          borderColor: '#FF8300',
          glyphColor: '#FFFFFF',
          scale: 1.25,
        });

        // create marker
        var marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: lat, lng: lng },
          title: name,
          content: ( type && type === 'Black Series' ? blackMarker.element : normalMarker.element ),
        });

        // prepare infowindow
        var infowindow = new google.maps.InfoWindow({
          content: '<div class="infowindow">' + content + '</div>',
          ariaLabel: name,
        });

        marker.addListener("click", () => {

          if( prev_infowindow ) {
           prev_infowindow.close();
         }

         prev_infowindow = infowindow;

          infowindow.open({
            anchor: marker,
            map,
          });

        });

        // add markers to array
        MARKERS.push(marker);
        markerCluster.addMarker(marker);

      }

    });

  }

  // form-state
  $('#form-state').on('change', function() {

    var target = this.value;
    var cities = [];

    if(target === 'Todos') {

      // show all
      $('[data-state]').show();

      // reset map
      map.setCenter({ lat: -38.416096, lng: -63.616673 });
      map.setZoom(4);

      return false;
    }

    CURRENT_STATE = target;
    console.log(CURRENT_STATE);

    // filter results by state
    $('[data-state]').each(function(){

      var state = $(this).attr('data-state');
      var city = $(this).attr('data-city');

      if(state === target) {
        $(this).show();

        if(!cities.includes(city)) {
          cities.push(city);
        }

      } else {
        $(this).hide();
      }

    });

    // center map on selected state
    geocoder.geocode({'address': CURRENT_STATE + ', Argentina'}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        if(CURRENT_STATE == 'CABA') {
          map.setZoom(11);
        } else {
          map.setZoom(7);
        }
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });

    // prepare cities select
    $('#form-city').html('');
    $('#form-city').append($('<option>', {
        value: 'Todos',
        text : 'Todos'
    }));

    // appends state cities
    cities.sort();
    $.each(cities, function (i, item) {
      $('#form-city').append($('<option>', {
          value: item,
          text : item
      }));
    });

    console.log(cities);

  });

  // form-city
  $('#form-city').on('change', function() {

    var target = this.value;

    if(target === 'Todos') {

      // show all from selected state
      $('[data-state]').each(function(){

        var state = $(this).attr('data-state');

        if(state === CURRENT_STATE) {
          $(this).show();
        } else {
          $(this).hide();
        }

      });


    } else {

      CURRENT_CITY = target;

      // filter results by state & city
      $('[data-state]').each(function(){

        var state = $(this).attr('data-state');
        var city = $(this).attr('data-city');

        if(state === CURRENT_STATE && city === target) {
          $(this).show();
        } else {
          $(this).hide();
        }

      });

      // center map on selected city & state
      geocoder.geocode({'address': CURRENT_CITY + ', ' + CURRENT_STATE + ', Argentina'}, function(results, status) {
        if (status === 'OK') {
          map.setCenter(results[0].geometry.location);
          map.setZoom(11);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });

    }

  });

  // center service
  $('[data-zoom]').click(function(e){
    e.preventDefault();

    var $this = $(this);
    var lat = parseFloat($this.parent().parent().attr('data-lat'));
    var lng = parseFloat($this.parent().parent().attr('data-lng'));

    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(15);

  });

  // typeahead
  $('[data-typeahead]').each(function(){

    var $this = $(this);

    // prepare keywords
    var KEYWORDS = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: JSON.parse($this.attr('data-typeahead'))
    });

    // setup typeahead
    $this.typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'keywords',
      source: KEYWORDS,
      limit: 10
    });

    console.log(KEYWORDS);

    // search on typeahead select
    $this.bind('typeahead:select', function(ev, suggestion) {

      // center map on selected city & state
      geocoder.geocode({'address': suggestion + ', Argentina'}, function(results, status) {
        if (status === 'OK') {
          map.setCenter(results[0].geometry.location);
          map.setZoom(11);

          // calc distance from center
          $('[data-id]').each(function(){

            var $this = $(this);
            var lat = parseFloat($this.attr('data-lat'));
            var lng = parseFloat($this.attr('data-lng'));

            if(lat && lng) {

              // get distance
              var distance = getDistanceFromLatLonInKm(results[0].geometry.location.lat(), results[0].geometry.location.lng(), lat, lng);

              // save distance
              $this.attr('data-distance',distance);
              $this.find('[data-info="distance"]').text(distance.toFixed(1)+' KM');
            }

          });

          // sort items
          var $wrapper = $('.swiper-wrapper');

          $wrapper.find('.map-item').sort(function(a, b) {
              return +a.getAttribute('data-distance') - +b.getAttribute('data-distance');
          })
          .appendTo($wrapper);

          // reset swiper
          $('[data-swiper="map"]')[0].swiper.slideTo(0);

        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });

    });

  });

}

function geoLocation() {
  if (!!navigator.geolocation) {
    console.log('getting current location...');

    navigator.geolocation.getCurrentPosition(function (position) {

      var geocoder = new google.maps.Geocoder();
      var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      console.log('current geoposition: ', position.coords.latitude, position.coords.longitude);

      currentLatlng = [position.coords.latitude, position.coords.longitude];
      console.log('current latlng:', currentLatlng);

      map.setCenter(currentLatlng[0], currentLatlng[1]);
      map.setZoom(11);

    });
  }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
