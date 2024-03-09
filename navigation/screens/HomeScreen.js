import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IP_Server } from '../../components/const'; 

const IP = IP_Server;


const HomeScreen = () => {
  const [categoriesWithAds, setCategoriesWithAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {

    // Définir une fonction asynchrone pour récupérer les sous-catégories
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`${IP}/sub_category`);
        const data = await response.json();
        // Stocker les sous-catégories dans l'état
        setSubCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sous-catégories :", error);
      }
    };

    // Appeler la fonction pour récupérer les sous-catégories
    fetchSubCategories();

    const fetchCategoriesWithAds = async () => {
      try {
        const response = await fetch(`${IP}/category`);
        const data = await response.json();

        // Pour chaque catégorie, récupérer les annonces associées
        const categoriesWithAdsData = await Promise.all(
          data.map(async (category) => {
              const adsResponse = await fetch(
                  `${IP}/advertisements/category/${category.id}`
                  );
                  const adsData = await adsResponse.json();
                  
                  // Pour chaque annonce, récupérer les images associées
                  const adsWithData = await Promise.all(
                      adsData.map(async (ad) => {
                const imagesResponse = await fetch(`${IP}/images/all/${ad.id}`);
                const imagesData = await imagesResponse.json();
                // console.log(imagesData);
                return { ...ad, images: imagesData };
              })
            );
            // console.log(adsWithData)
            return { ...category, ads: adsWithData };
        })
        );

        setCategoriesWithAds(categoriesWithAdsData);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des catégories et annonces :",
          error
        );
      }
    };

    fetchCategoriesWithAds();
  }, []);

  const navigateToAdDetails = (adId) => {
    navigation.navigate("AdDetailsScreen", { adId });
  };

  const renderAdItem = ({ item }) => {
    // Rechercher le sous-catégorie correspondant à l'annonce
    const subCategory = subCategories.find(sub => sub.id === item.sub_category_id);
    // Récupérer le nom du sous-catégorie
    const subCategoryName = subCategory ? subCategory.name : '';
    // Limiter la longueur du titre à 50 caractères
    const truncatedTitle = item.title.length > 50 ? item.title.slice(0, 35) + "..." : item.title;
    return(
        <TouchableOpacity onPress={() => navigateToAdDetails(item.id)}>
          <View style={styles.adContainer}>
              <Image
                  source={{ uri: `data:image/jpeg;base64,${item.images[0].image}` }}
                  style={styles.adImage}
              />
              <View style={styles.MoreInfoContainer}>
                <View style={styles.adTitleContainer}>
                  <Text style={styles.adTitle}>{truncatedTitle}</Text>
                  <View style={styles.MoreInfoContainer}>
                    <View style={styles.locationContainer}>
                      <Text style={styles.adCity}>{item.city}</Text>
                      <Text style={styles.adPostaleCode}>{item.postal_code}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Text style={styles.adStartDate}>{item.start_date}</Text>
                      <Text> - </Text>
                      <Text style={styles.adEndDate}>{item.end_date}</Text>
                    </View>
                    <View style={styles.subCategoriesContainer}>
                      <Text style={styles.subCategories}>{subCategoryName}</Text>
                    </View>
                  </View>
                </View>
              </View>

          </View>
        </TouchableOpacity>
    );
};

  const renderCategoryItem = ({ item }) => (
    <View style={{ padding: 10 }}>
    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#767676",}}>{item.name}</Text>
    <Text style={{ fontWeight: "normal", fontSize: 14, color:"#989696", marginBottom: 20 }}>Types de plantes qui pourrait vous interesser ...</Text>
    <FlatList
      data={item.ads}
      renderItem={renderAdItem}
      keyExtractor={(ad) => ad.id.toString()}
      horizontal={true}
      contentContainerStyle={styles.scrollViewContent}
    />
  </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
    <FlatList
      data={categoriesWithAds}
      renderItem={renderCategoryItem}
      keyExtractor={(category) => category.id.toString()}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
    </View>
  );
};

const handleRefresh = async () => {
  setRefreshing(true);
  try {
    // Mettez à jour les données en fonction de vos besoins
    await fetchCategoriesWithAds();
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des données :", error);
  }
  setRefreshing(false);
};


export default HomeScreen;

const styles = StyleSheet.create({
  adContainer:{
    width: 220,
    height: 280,
  },
  InfoContainer:{
    flex: 1,
    justifyContent: "space-between",
  },
  MoreInfoContainer:{
    flex: 1,
    justifyContent:"space-between"
  },
  adImage:{
    width: 220,
    height: 170,
    borderRadius: 25,
  },
  adTitleContainer: {
    height: 100,
    justifyContent: "center",
  },
  adTitle:{
    fontSize: 18,
    fontWeight:"bold",
    color:"#767676",
    marginHorizontal: 5,
  },
  locationContainer:{
    flexDirection:"row", 
    alignItems: 'flex-end', 
    gap: 4,
    marginHorizontal: 5,
  },
  adCity:{
    fontSize: 16,
    fontWeight: 'medium',
    color:"#4A4A4A",
  },
  adPostaleCode:{
    color:"#4A4A4A"
  },
  dateContainer:{
    flexDirection: "row",
    marginHorizontal: 5,
  },
  adStartDate:{
    color:"#4A4A4A",
  },
  adEndDate:{
    color:"#4A4A4A",
  },
  subCategoriesContainer:{
    marginTop: 5,
    backgroundColor:"#D9D9D9",
    width: "auto",
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  subCategories:{
    color:"#767676",
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scrollViewContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});