import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Circle } from 'react-native-maps';

const IP = 'http://172.20.10.7:3001/api';
const windowDimensions = Dimensions.get('window');
const ONE_KM_IN_DEGREE = 0.009;

const AdDetailsScreen = () => {
  const route = useRoute();
  const { adId } = route.params;
  const navigation = useNavigation();
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`${IP}/advertisements/${adId}`);
        const data = await response.json();
        setAdData(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l annonce :', error);
      }
    };

    fetchAdDetails();
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={{ color: 'blue' }}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{adData ? adData.title : ''}</Text>
        {loading && <ActivityIndicator size="small" color="#A3D288" />}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Description :</Text>
          <Text style={styles.text}>{adData ? adData.description : ''}</Text>
          <Text style={styles.label}>ID utilisateur :</Text>
          <Text style={styles.text}>{adData ? adData.user_id : ''}</Text>
          <Text style={styles.label}>Longitude :</Text>
          <Text style={styles.text}>{adData ? adData.longitude : ''}</Text>
          <Text style={styles.label}>Latitude :</Text>
          <Text style={styles.text}>{adData ? adData.latitude : ''}</Text>
          <Text style={styles.label}>ID catégorie :</Text>
          <Text style={styles.text}>{adData ? adData.category_id : ''}</Text>
          <Text style={styles.label}>ID sous-catégorie :</Text>
          <Text style={styles.text}>{adData ? adData.sub_category_id : ''}</Text>
        </View>
        <View style={styles.mapContainer}>
          {!loading && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: adData.latitude,
                longitude: adData.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Circle
                center={{ latitude: adData.latitude, longitude: adData.longitude }}
                radius={200} // 200 mètres
                fillColor="#A3D28880"
              />
            </MapView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    marginBottom: 10,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: windowDimensions.width - 20,
    height: windowDimensions.height * 0.4,
  },
});

export default AdDetailsScreen;