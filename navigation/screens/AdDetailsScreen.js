import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator, SafeAreaView, Dimensions, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Circle } from 'react-native-maps';
import { IP_Server } from '../../components/const'; 

const IP = IP_Server;
const windowDimensions = Dimensions.get('window');
const ONE_KM_IN_DEGREE = 0.009;

const AdDetailsScreen = () => {
  const route = useRoute();
  const { adId } = route.params;
  const navigation = useNavigation();
  const [adData, setAdData] = useState(null);
  const [imagesData, setImagesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`${IP}/advertisements/${adId}`);
        const data = await response.json();

        // Importation des images
        const imagesResponse = await fetch(`${IP}/images/all/${adId}`);
        const imagesData = await imagesResponse.json();

        setAdData(data);
        setImagesData(imagesData);
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


  console.log(imagesData)

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
      {!loading && ( // Conditionnez le rendu du contenu sur l'état de chargement
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri:`data:image/jpeg;base64,${imagesData[0].image}`}}
            style={styles.image}
          />
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
      )}
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
  image: {
    width: 400,
    height: 400,
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