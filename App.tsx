import React, {useState, useEffect} from 'react';
import {View, Text, Button, Platform, PermissionsAndroid} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const bleManager = new BleManager();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startScanning = async () => {
    const locationPermissionGranted = await requestLocationPermission();

    if (!locationPermissionGranted) {
      console.log('Location permission not granted');
      return;
    }

    setIsScanning(true);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }
      if (!devices.some(d => d.id === device.id)) {
        setDevices(prevDevices => [...prevDevices, device]);
      }

      // Implement proximity detection logic
      if (device.rssi < -70) {
        triggerNotification();
      }
    });
  };

  const triggerNotification = () => {
    // Implement your notification logic here
    console.log('Proximity detected! Triggering notification...');
  };

  useEffect(() => {
    const discoverPeripheralSubscription = bleManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        // Start scanning when Bluetooth is powered on
        startScanning();
      }
    }, true);

    return () => {
      discoverPeripheralSubscription.remove();
      bleManager.stopDeviceScan();
    };
  }, []);

  return (
    <View>
      <Button
        title="Start Scanning"
        onPress={startScanning}
        disabled={isScanning}
      />
      <Text>Detected Devices:</Text>
      {devices.map(device => (
        <Text key={device.id}>{device.name || 'Unknown Device'}</Text>
      ))}
    </View>
  );
};

export default App;
