// pinpoint.ts
/// <reference types="@types/google.maps" />
import { AdvancedMarkerElement, PinElement } from "@googlemaps/marker"

let map: google.maps.Map;

/**
 * Initializes the map and adds a marker.
 */
async function initMap(): Promise<void> {
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };

  // Request libraries
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const markerLibrary = await google.maps.importLibrary("marker") as typeof google.maps.marker;


  // Initialize the map
  map = new Map(document.getElementById("map") as HTMLElement, {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID", // Replace with your own Map ID
  });

  // Create the PinElement and AdvancedMarkerElement
  const pinGlyph = new markerLibrary.PinElement({
    glyph: "🚗",
    scale: 1.5,
  });

  const advancedMarker = new markerLibrary.AdvancedMarkerElement({
    map: map,
    position: position,
    content: pinGlyph.element,
    title: "Crunchtime",
  });
}

// Expose the initMap function to the window object
declare global {
  interface Window {
    initMap: () => Promise<void>;
  }
}
window.initMap = initMap;
