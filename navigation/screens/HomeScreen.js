import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

const HomePage = () => {
  const [categoriesWithAds, setCategoriesWithAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithAds = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/category');
        const data = await response.json();


        const categoriesWithAdsData = await Promise.all(
          data.map(async (category) => {
            const adsResponse = await fetch(`http://127.0.0.1:3001/api/advertisements/category/${category.id}`);
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

  const renderAdItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
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

export default HomePage;