import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

interface Country {
  name: string;
  flag: string;
  code?: string;
  phoneCode?: string;
}

interface CountrySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedCountry?: Country;
}

const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCountry,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (country.phoneCode &&
            country.phoneCode.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchQuery, countries]);

  const loadCountries = async () => {
    try {
      setLoading(true);

      // Check if we have cached countries
      const cached = await AsyncStorage.getItem("countries");
      if (cached) {
        const countryList = JSON.parse(cached);
        setCountries(countryList);
        setFilteredCountries(countryList);
      } else {
        // Fetch from API with phone codes
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd"
        );
        const data = await res.json();
        const countryList: Country[] = data
          .map((item: any) => ({
            name: item.name.common,
            flag: item.flags?.png || "https://flagcdn.com/w320/un.png", // fallback image
            phoneCode: item.idd?.root
              ? `${item.idd.root}${item.idd.suffixes?.[0] || ""}`
              : undefined,
          }))
          .filter(Boolean); // remove undefined/null

        const sorted = countryList.sort((a, b) => a.name.localeCompare(b.name));

        // Cache the results
        await AsyncStorage.setItem("countries", JSON.stringify(sorted));
        setCountries(sorted);
        setFilteredCountries(sorted);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
      // Fallback to a few common countries if API fails
      const fallbackCountries: Country[] = [
        { name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
        { name: "United States", flag: "🇺🇸", phoneCode: "+1" },
        { name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
        { name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
        { name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
        { name: "France", flag: "🇫🇷", phoneCode: "+33" },
        { name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
        { name: "India", flag: "🇮🇳", phoneCode: "+91" },
        { name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
        { name: "Mexico", flag: "🇲🇽", phoneCode: "+52" },
        { name: "Ghana", flag: "🇬🇭", phoneCode: "+233" },
        { name: "Nigeria", flag: "🇳🇬", phoneCode: "+234" },
        { name: "South Africa", flag: "🇿🇦", phoneCode: "+27" },
        { name: "Kenya", flag: "🇰🇪", phoneCode: "+254" },
      ];
      setCountries(fallbackCountries);
      setFilteredCountries(fallbackCountries);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCountry = (country: Country) => {
    onSelect(country);
    onClose();
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 border-b border-neutral-20 ${
        selectedCountry?.name === item.name ? "bg-primary/10" : ""
      }`}
      onPress={() => handleSelectCountry(item)}
    >
      <Image
        source={{ uri: item.flag }}
        style={{ width: 30, height: 20, marginRight: 12 }}
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-BodyRegular font-Manrope font-medium text-neutral-90">
          {item.name}
        </Text>
        {item.phoneCode && (
          <Text className="text-BodySmallRegular font-Manrope text-neutral-60">
            {item.phoneCode}
          </Text>
        )}
      </View>
      {selectedCountry?.name === item.name && (
        <Ionicons name="checkmark" size={20} color="#F96C00" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-30">
          <View style={{ width: 24 }} />
          <Text className="text-Heading4 font-Manrope font-bold text-secondary">
            Select Country
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.6} hitSlop={10}>
            <Ionicons name="close" size={24} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Search */}
          <View className="flex-row items-center bg-neutral-10 rounded-lg px-3 py-5">
            <TextInput
              className="flex-1 text-BodySmallRegular border border-neutral-30 rounded-lg px-3 py-3 font-Manrope placeholder:text-neutral-60 "
              placeholder="Search countries or phone codes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
        </View>
        {/* Countries List */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#F96C00" />
            <Text className="text-neutral-60 font-Manrope mt-2">
              Loading countries...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            className="flex-1"
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default CountrySelectionModal;
