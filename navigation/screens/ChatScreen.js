import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function ChatScreen({ navigation }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://172.20.10.3:3001/api/users');
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => navigation.navigate('Home')} style={{ fontSize: 26, fontWeight: 'bold' }}>Message Screen</Text>
            {userData && (
                <View>
                    <Text>User Data:</Text>
                    <Text>{JSON.stringify(userData)}</Text>
                </View>
            )}
        </View>
    );
}