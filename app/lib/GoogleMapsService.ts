// GoogleMapsService.ts
declare global {
    interface Window {
      initMap: () => void;
    }
  }
  
  class GoogleMapsService {
    private map: google.maps.Map = {} as google.maps.Map;
    private infoWindow!: google.maps.InfoWindow;
    private geocoder: google.maps.Geocoder = {} as google.maps.Geocoder;
    private marker: google.maps.marker.AdvancedMarkerElement;
    private autocomplete: google.maps.places.Autocomplete = {} as google.maps.places.Autocomplete;
  
    constructor() {
      window.initMap = this.initMap.bind(this);
      this.geocoder = new google.maps.Geocoder();
      this.marker = new google.maps.marker.AdvancedMarkerElement();
    }
  
    public loadGoogleMapsApi(): void {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAb70TgrwsexM10ysDErAYeiZ89hsKHeW4&libraries=places&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
    }
  
    private initMap(): void {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6,
      });
      this.infoWindow = new google.maps.InfoWindow();
      this.geocoder = new google.maps.Geocoder();
  
      this.setupLocationButton();
      this.setupGeocoding();
      this.setupAutocomplete();
    }
  
    private setupLocationButton(): void {
      const locationButton = document.createElement('button');
      locationButton.textContent = 'Pan to Current Location';
      locationButton.classList.add('custom-map-control-button');
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
      locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
  
              this.infoWindow.setPosition(pos);
              this.infoWindow.setContent('Location found.');
              this.infoWindow.open(this.map);
              this.map.setCenter(pos);
            },
            () => {
              this.handleLocationError(true, this.map.getCenter());
            }
          );
        } else {
          this.handleLocationError(false, this.map.getCenter());
        }
      });
    }
  
    private handleLocationError(browserHasGeolocation: boolean, pos: google.maps.LatLng): void {
      this.infoWindow.setPosition(pos);
      this.infoWindow.setContent(
        browserHasGeolocation ? 'Error: The Geolocation service failed.' : "Error: Your browser doesn't support geolocation."
      );
      this.infoWindow.open(this.map);
    }
  
    private setupGeocoding(): void {
      // Add your geocoding logic here
    }
  
    private setupAutocomplete(): void {
      // Assuming you have an input element with id 'pac-input'
      const input = document.getElementById('pac-input') as HTMLInputElement;
      this.autocomplete = new google.maps.places.Autocomplete(input);
      this.autocomplete.bindTo('bounds', this.map);
  
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
  
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      });
    }
  }
  
  export default GoogleMapsService;
  

