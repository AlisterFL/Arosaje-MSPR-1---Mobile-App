import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DropDownPicker from "react-native-dropdown-picker";

import ImageViewer from "../../componnets/imageViewer";
import Button from "../../componnets/button";
import ImagePickerModal from "../../componnets/imagePickerModal";

export default function AddScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "Arbustre",
      value: "arbustre",
      icon: () => (
        <Image
          source={require("../../assets/icon.png")}
          style={styles.iconStyle}
        />
      ),
    },
    {
      label: "Abustre1",
      value: "abustre1",
      parent: "arbustre",
      icon: () => (
        <Image
          source={require("../../assets/icon.png")}
          style={styles.iconStyle}
        />
      ),
    },
    {
      label: "Abustre2",
      value: "Abustre2",
      parent: "arbustre",
      icon: () => (
        <Image
          source={require("../../assets/icon.png")}
          style={styles.iconStyle}
        />
      ),
    },
    { label: "Fleur", value: "fleur" },
    { label: "Rose", value: "rose", parent: "fleur" },
    { label: "Tulipe", value: "tulipe", parent: "fleur" },
    { label: "Arbre", value: "arbre" },
    { label: "Plante grimpante", value: "plante_grimpante" },
  ]);

  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const dateString = new Date().toISOString().split("T")[0];
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: `image${images.length + 1}-${dateString}.jpg`,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const dateString = new Date().toISOString().split("T")[0];
      const newImage = {
        uri: result.uri,
        name: `image${images.length + 1}-${dateString}.jpg`,
      };
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={{ flex: 1 }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {images.length == 0 && (
            <View style={[styles.buttonContainer, { marginBottom: 15 }]}>
              <Button
                style={styles.buttonAddImage1}
                theme="primary-icon"
                icon="plus"
                label="Ajouter photos"
                onPress={() => setModalVisible(true)}
              />
            </View>
          )}
          {images.length > 0 && (
            <View style={[styles.ImageContainer, { marginBottom: 15 }]}>
              <ScrollView horizontal={true}>
                <View style={styles.imageAndButton}>
                  {images.map((image, index) => (
                    <ImageViewer
                      key={index}
                      theme="deletable"
                      selectedImage={image.uri}
                      onDelete={() => handleDeleteImage(index)}
                      style={styles.imageItem}
                    />
                  ))}
                  <Button
                    style={styles.buttonInImage}
                    theme="just-icon"
                    icon="plus"
                    onPress={() => setModalVisible(true)}
                  />
                </View>
              </ScrollView>
            </View>
          )}

          <Text style={[styles.label, { paddingTop: 10 }]}>
            Nom de l'annonce
          </Text>
          <TextInput
            ref={titleInputRef}
            style={styles.input}
            value={title}
            placeholder="Ex: Recherche jardinier ..."
            onChangeText={setTitle}
            onSubmitEditing={() => descriptionInputRef.current.focus()}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            ref={descriptionInputRef}
            style={[styles.input, styles.multilineInput, { marginBottom: 15 }]}
            value={description}
            placeholder="Ex: Besoin d'une personne pour s'occuper de mes plantes ..."
            onChangeText={setDescription}
            multiline
            onSubmitEditing={() => imageInputRef.current.focus()}
          />

          {/* Adresse/ Google maps */}
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label, { paddingTop: 10 }]}>Adresse</Text>
            <ScrollView
              horizontal={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <GooglePlacesAutocomplete
                placeholder="2 rue Alphonse Colas, Pl. du Concert, Lille"
                onPress={(data, details = null) => {
                  console.log(data, details);
                  setAddress(data.description);
                  if (details) {
                    setCoordinates(details.geometry.location);
                  }
                }}
                query={{
                  key: "AIzaSyBk7T5n-mYooDyw9eHCK1OkOs4AQp4Ttq4",
                  language: "fr",
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
              />
            </ScrollView>
          </View>

          {coordinates && (
            <View style={styles.mapContainer}>
              <Text>
                Coordonnées : {coordinates.lat}, {coordinates.lng}
              </Text>
            </View>
          )}

          <View style={styles.dropDownPicker}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              disableBorderRadius={true}
              listMode="MODAL"
              modalAnimationType="slide"
              modalTitle="Sélectionner une catégorie"
              placeholder="Catégorie"
              placeholderStyle={{
                color: "grey",
              }}
              showArrowIcon={true}
              mode="BADGE"
              searchable={true}
              searchTextInputProps={{
                maxLength: 25,
              }}
              searchPlaceholder="Ex: Arbre..."
              searchContainerStyle={{
                borderColor: "white",
                borderBottomColor: "#dfdfdf",
              }}
              customItemLabelStyle={{
                backgroundColor: "red",
              }}
              listParentLabelStyle={{
                fontWeight: "bold",
              }}
              listChildContainerStyle={{
                paddingLeft: 40,
              }}
              closeAfterSelecting={true}
              style={{
                borderColor: "white",
                borderRadius: 0,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={styles.sendButtonContainer}>
            <Button
              style={styles.sendButton}
              theme="primary-full"
              icon="plus"
              label="Ajouter l'annonce"
            />
          </View>

          <ImagePickerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelectFromGallery={pickImage}
            onTakePhoto={takePhoto}
          />


          <Text style={styles.footerText}>
            Soyez rassuré ...
          </Text>
          <Text style={styles.footerText}>
            L'adresse de votre logement est affiché sous la forme d'une zone geograpgique et non d'un point.
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: "#9b9b9b",
    textAlign: "left",
    paddingLeft: 10,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    width: "100%",
    textAlign: "left",
    backgroundColor: "white",
  },
  multilineInput: {
    height: 100,
  },
  buttonContainer: {
    alignItems: "center",
    flex: 1,
    height: 150,
    justifyContent: "center",
  },
  ImageContainer: {
    margin: "auto",
    flex: 1,
    height: 200,
    justifyContent: "center",
    paddingLeft: 15,
  },
  imageAndButton: {
    flex: 1,
    gap: 15,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 200,
    justifyContent: "center",
  },
  buttonInImage: {
    alignSelf: "center",
    backgroundColor: "green",
  },
  imageItem: {
    width: 150,
    height: 150,
  },
  mapContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: 300,
  },
  dropDownPicker: {
    flex: 1,
    maxHeight: 800,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  sendButtonContainer: {
    alignItems: "center",
    height: 150,
    justifyContent: "center",
  },
  footerText:{
    marginLeft:  20,
    marginRight:  20,
    marginBottom: 10,
    textAlign: "center",
    color: "grey",
  },
});
