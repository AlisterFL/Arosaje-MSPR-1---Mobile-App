import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default function HomeScreen({ navigation }) {
    const[mapRegion, setMapRegion] = useState({
        latitude : 50.642204, 
        longitude: 3.061291,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    return (
        <View style={styles.container}>
            <MapView style={styles.map}
                region= {mapRegion}>
                <Marker coordinate={mapRegion} title='Marker'/>
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });