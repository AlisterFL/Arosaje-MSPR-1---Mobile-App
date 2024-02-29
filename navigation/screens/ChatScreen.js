import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

export default function ChatScreen({ navigation }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://172.20.10.7:3001/api/images/1'); // Appel de l'API avec advertisement_id = 36
            if (response.ok) {
                const data = await response.json();
                // Préfixer chaque base64 avec 'data:image/jpeg;base64,'
                const imagesWithPrefix = data.map(image => ({ ...image, image: `data:image/jpeg;base64,${image.image}` }));
                setImages(imagesWithPrefix); // Mettre à jour l'état avec les données des images préfixées
                console.log(images);
            } else {
                console.error('Failed to fetch images');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => navigation.navigate('Home')} style={{ fontSize: 26, fontWeight: 'bold' }}>Message Screen</Text>
            <View>
                <Text>Images:</Text>
                {images.map((image, index) => (
                    <Image key={index} source={{ uri: image.image }} style={{ width: 200, height: 200 }} />
                ))}
            </View>
        </View>
    );
}
