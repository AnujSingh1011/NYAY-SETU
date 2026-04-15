class MapsService {
  constructor(apiKey = '') {
    this.apiKey = apiKey || (window.APP_CONFIG && window.APP_CONFIG.GOOGLE_MAPS_API_KEY) || '';
    this.map = null;
    this.marker = null;
  }

  initializeMap(containerId, location = { lat: 28.6139, lng: 77.2090 }) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    if (window.google && window.google.maps) {
      this.map = new google.maps.Map(container, { center: location, zoom: 13 });
      this.marker = new google.maps.Marker({ position: location, map: this.map, draggable: true });
      return this.map;
    }

    container.innerHTML = '<div class="map-fallback">Google Maps unavailable in demo mode. Coordinates loaded successfully.</div>';
    container.dataset.lat = String(location.lat);
    container.dataset.lng = String(location.lng);
    return container;
  }

  async getUserLocation() {
    if (!navigator.geolocation) return { lat: 28.6139, lng: 77.2090 };
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 28.6139, lng: 77.2090 }),
        { timeout: 8000 }
      );
    });
  }

  async geocodeAddress(address) {
    const safeAddress = FormValidator.sanitize(address);
    if (window.google && window.google.maps && google.maps.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve) => {
        geocoder.geocode({ address: safeAddress }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const loc = results[0].geometry.location;
            resolve({ lat: loc.lat(), lng: loc.lng(), formattedAddress: results[0].formatted_address });
          } else {
            resolve({ lat: 28.6139, lng: 77.2090, formattedAddress: safeAddress });
          }
        });
      });
    }
    return { lat: 28.6139, lng: 77.2090, formattedAddress: safeAddress };
  }

  setupPlacesAutocomplete(inputId, callback) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (window.google && window.google.maps && window.google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: { country: ['in'] } });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          callback({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            formattedAddress: place.formatted_address || input.value
          });
        }
      });
      return;
    }

    input.addEventListener('change', async () => callback(await this.geocodeAddress(input.value)));
  }

  detectNearestStation(lat, lng, stations = []) {
    if (!stations.length) return null;
    const ranked = stations.map((station) => ({ ...station, distance: this.calculateDistance(lat, lng, station.lat, station.lng) }));
    ranked.sort((a, b) => a.distance - b.distance);
    return ranked[0];
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (d) => d * (Math.PI / 180);
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }
}

window.MapsService = MapsService;
