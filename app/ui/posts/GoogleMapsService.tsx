import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const GoogleMapsComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.initMap = () => {
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6,
      });

      const infoWindow = new google.maps.InfoWindow();
      const geocoder = new google.maps.Geocoder();
      const input = inputRef.current!;
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo("bounds", map);

      const locationButton = document.createElement("button");
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

      locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent("Location found.");
                infoWindow.open(map);
                map.setCenter(pos);
            },
            () => {
                const center = map.getCenter() || { lat: 0, lng: 0 };
                const centerLatLng = new google.maps.LatLng(center.lat(), center.lng());
                handleLocationError(true, infoWindow, centerLatLng);
            }
        );
        } else {
            const center = map.getCenter();
            if (center) {
                handleLocationError(false, infoWindow, center);
            }
        }
      });

      function handleLocationError(browserHasGeolocation: boolean, infoWindow: google.maps.InfoWindow, pos: google.maps.LatLng) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation.");
        infoWindow.open(map);
      }
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Enter a location" className="controls" />
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default GoogleMapsComponent;
