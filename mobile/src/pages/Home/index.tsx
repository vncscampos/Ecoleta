import React, { useState, useEffect, ChangeEvent } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface Selected {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const ufPlaceholder = {
    label: "Selecione a UF...",
    value: null,
  };
  const cityPlaceholder = {
    label: "Selecione a cidade...",
    value: null,
  };

  const [ufs, setUfs] = useState<Selected[]>([]);
  const [cities, setCities] = useState<Selected[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufInitials = res.data.map((uf) => {
          const select: Selected = {
            label: uf.sigla,
            value: uf.sigla,
          };
          return select;
        });

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cities = res.data.map((city) => {
          const select: Selected = {
            label: city.nome,
            value: city.nome,
          };
          return select;
        });

        setCities(cities);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      selectedUf,
      selectedCity,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        style={styles.container}
        source={require("../../assets/home-background.png")}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Text>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={ufPlaceholder}
            style={pickerSelectStyles}
            onValueChange={(value) => {
              setSelectedUf(value);
            }}
            useNativeAndroidPickerStyle={false}
            items={ufs}
            value={selectedUf}
          />
          <RNPickerSelect
            placeholder={cityPlaceholder}
            style={pickerSelectStyles}
            onValueChange={(value) => {setSelectedCity(value)}}
            useNativeAndroidPickerStyle={false}
            items={cities}
            value={selectedCity}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 24,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 10,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    height: 60,
    backgroundColor: "#FFF",
    marginBottom: 8,
  },
});

export default Home;
