import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IP = 'http://172.20.10.7:3001/api';

const HomeScreen = () => {
  const [categoriesWithAds, setCategoriesWithAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategoriesWithAds = async () => {
      try {
        const response = await fetch(`${IP}/category`);
        const data = await response.json();

        // Pour chaque catégorie, récupérer les annonces associées
        const categoriesWithAdsData = await Promise.all(
          data.map(async (category) => {
            const adsResponse = await fetch(`${IP}/advertisements/category/${category.id}`);
            const adsData = await adsResponse.json();
            return { ...category, ads: adsData };
          })
        );

        setCategoriesWithAds(categoriesWithAdsData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories et annonces :', error);
      }
    };

    fetchCategoriesWithAds();
  }, []);

  const navigateToAdDetails = (adId) => {
    navigation.navigate('AdDetailsScreen', { adId });
  };

  const renderAdItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToAdDetails(item.id)}>
      <View style={{ padding: 10 }}>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.name}</Text>
      <FlatList
        data={item.ads}
        renderItem={renderAdItem}
        keyExtractor={(ad) => ad.id.toString()}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      />
    </View>
  );
};

export default HomeScreen;