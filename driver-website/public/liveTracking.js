import React, { useEffect, useRef, useState } from 'react';
import { LocationClient, GetDevicePositionCommand } from "@aws-sdk/client-location";

function LiveTracking({ userLat, userLng, onLocationChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const awsClientRef = useRef(null);

  // Replace with your AWS Location Service details
  const AWS_REGION = 'your-aws-region'; // e.g., 'us-east-1'
  const DEVICE_ID = 'your-device-id'; // Your device ID registered in AWS Location
  const LOCATION_TRACKER_NAME = 'your-location-tracker-name'; // Your tracker name

  // Initialize AWS SDK client
  useEffect(() => {
    awsClientRef.current = new LocationClient({ region: AWS_REGION });
  }, []);

  // Initialize map and fetch driver position from AWS Location
 useEffect(() => {
    if (!mapRef.current && window.google && mapContainerRef.current && awsClientRef.current) {
      // Initialize Google Map
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: -33.9129, lng: 18.4179 },
        zoom: 14,
      });

      // Add driver marker
      driverMarkerRef.current = new window.google.maps.Marker({
        position: { lat: -33.9129, lng: 18.4179 },
        map: mapRef.current,
        title: 'Driver Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      // Function to fetch device position from AWS Location
      const fetchDevicePosition = async () => {
        try {
          const command = new GetDevicePositionCommand({
            DeviceId: DEVICE_ID,
            TrackerName: LOCATION_TRACKER_NAME,
            // Optional: include PositionFilter to limit data
          });
          const response = await awsClientRef.current.send(command);
          if (response.DevicePositions && response.DevicePositions.length > 0) {
            const position = response.DevicePositions[0].Position;
            const [lng, lat] = position; // AWS returns [lng, lat]
            const latLng = new google.maps.LatLng(lat, lng);
            // Move driver marker
            driverMarkerRef.current.setPosition(latLng);
            mapRef.current.panTo(latLng);
          }
        } catch (error) {
          console.error('Error fetching device position:', error);
        }
      };

      // Fetch driver position immediately and then periodically
      fetchDevicePosition();
      intervalRef.current = setInterval(fetchDevicePosition, 5000); // every 5 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [awsClientRef.current]);

  // Update user marker if userLat and userLng change
  useEffect(() => {
    if (
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      mapRef.current
    ) {
      if (!userMarkerRef.current) {
        // Add user marker
        userMarkerRef.current = new window.google.maps.Marker({
          position: { lat: userLat, lng: userLng },
          map: mapRef.current,
          icon: {
            url: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            scaledSize: new window.google.maps.Size(25, 25),
          },
          title: 'Your Location',
        });
      } else {
        // Update user marker position
        userMarkerRef.current.setPosition({ lat: userLat, lng: userLng });
      }

      // Optional: center map on user
      // mapRef.current.panTo({ lat: userLat, lng: userLng });

      // Trigger callback if provided
      if (onLocationChange) {
        onLocationChange(userLat, userLng);
      }
    }
  }, [userLat, userLng, onLocationChange]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
}

export default LiveTracking;