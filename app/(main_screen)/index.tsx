import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Stack } from "expo-router";
import fetchData from "../services/fetcher";
import Toast from "react-native-toast-message";
import caraouselComponent from "@/components/textnimageCaraousel";
import { Ionicons } from "@expo/vector-icons";
import authRefresh from "../services/authRefreshService";

const width = Dimensions.get("window").width;
const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const progress = useSharedValue(0);
  const [fullName, setFullName] = useState("Loading...");

  useEffect(() => {
    const validateLogin = async () => {
      try {
        const key = await AsyncStorage.getItem("apiKey");
        if (key) {
          const stat = await authRefresh();
          if (stat == 2012) {
            console.log("Logged in");
            setIsLoggedIn(true);
            const storedName = await AsyncStorage.getItem("full_name");
            setFullName(storedName || "User"); // Set full name state
            // console.log("Name:", storedName);

            const result = await fetchData("news", key);
            setNewsData(result);
          } else {
            Toast.show({
              type: "error",
              position: "bottom",
              text1: "Session Expired !",
            });
          }
        } else {
          router.replace("/(auth)/sign-in");
        }
      } catch (error) {
        console.log("Error checking login status:", error);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "System Experienced an Error !",
        });
      }
    };

    validateLogin();
  }, []);

  if (!isLoggedIn) {
    return null; // Avoid rendering anything if not logged in
  }

  const images = [
    "https://cssl.nsbm.ac.lk/wp-content/uploads/2023/07/NSBM-LOGO.png",
    "https://www.eduwire.lk/wp-content/uploads/2025/01/1000-human_resource_circle_of_nsbm_green_university_cover.jpg",
    "https://d3c539pel8wzjz.cloudfront.net/wp-content/uploads/2021/08/r1-1.jpg",
    "https://idonura.wordpress.com/wp-content/uploads/2017/09/img_5287.jpg?w=1200&h=899",
    "https://media.licdn.com/dms/image/v2/C561BAQHiubTkMPrifw/company-background_10000/company-background_10000/0/1638507962416/nsbmgreenuniversity_cover?e=2147483647&v=beta&t=FD8-SbAHk-24clJVlVICcshOxvqYi2QPS5r4w7Fgpzo",
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.ServicesMenu}>
            <Ionicons
              name="grid"
              size={24}
              color="#1B5E20"
              onPress={() => router.push("/service-menu")}
            />
          </View>
          <Text style={styles.greeting}>
            Welcome back, {fullName.split(" ")[0] || "User"} !
          </Text>
          <View style={styles.profileIcon}>
            <Ionicons
              name="person"
              size={24}
              color="#1B5E20"
              onPress={() => router.push("/(auth)/sign-in")}
            />
          </View>
        </View>

        <Carousel
          mode="parallax"
          width={width * 1}
          height={width / 1.5}
          data={images}
          loop={true}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 90,
          }}
          onProgressChange={(_, absoluteProgress) =>
            (progress.value = absoluteProgress)
          }
          renderItem={({ item, index }) => (
            <View style={styles.carouselItem}>
              <Image source={{ uri: item }} style={styles.carouselImage} />
              <Text
                style={[
                  styles.Headings,
                  index === 0 && { fontStyle: "italic", fontWeight: "bold" },
                ]}
              >
                {index === 0
                  ? '"Connecting Campus Life, One App at a Time."'
                  : "Clicks by Community"}
              </Text>
            </View>
          )}
        />
        <Pagination.Basic
          progress={progress}
          data={images}
          dotStyle={{ backgroundColor: "#AFD9AF", borderRadius: 100 }}
          containerStyle={{ gap: 5, marginTop: 10 }}
        />

        <Text style={styles.sectionTitle}>Events & Stalls</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Oops... !, you caught us working on this
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Latest News</Text>
        <View>
          {Array.isArray(newsData) && newsData.length > 0 ? (
            <Carousel
              mode="normal"
              width={width * 1}
              height={width / 1.2}
              data={newsData}
              loop={true}
              modeConfig={{
                parallaxScrollingScale: 1,
                parallaxScrollingOffset: 100,
              }}
              renderItem={({ item }) => {
                const base64Image = "data:image/jpeg;base64," + item.image;
                return (
                  <View style={styles.newsContainer}>
                    <View style={styles.tintOverlay} />
                    <Text style={styles.newsTitle}>{item.news_title}</Text>
                    <Image
                      source={{ uri: base64Image }}
                      style={styles.newsCarouselImage}
                    />
                  </View>
                );
              }}
            />
          ) : (
            <Text>No news available</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#FFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 16,
    backgroundColor: "#AFD9AF",
  },
  Headings: {
    paddingTop: "2%",
    fontSize: 15,
    fontWeight: "300",
    color: "#1B5E20",
    alignSelf: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1B5E20",
    justifyContent: "flex-end",
  },
  profileIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C8E6C9",
  },
  ServicesMenu: {
    alignItems: "center",
    justifyContent: "center", // This will vertically center the content
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#C8E6C9",
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject, // fills the image's dimensions
    backgroundColor: "rgba(144, 238, 144, 0.3)", // light green with 30% opacity
    borderRadius: 10,
  },

  carouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "90%",
    height: "95%",
    borderRadius: 12,
  },
  newsCarouselImage: {
    width: "95%",
    height: "95%",
    borderRadius: 12,
  },
  imageWrapper: {
    position: "relative",
    width: "90%",
    height: "95%",
    borderRadius: 12,
    overflow: "hidden", // ensures the tint respects the border radius
  },
  tintOverlay: {
    padding: 16,
    ...StyleSheet.absoluteFillObject, // covers the entire image
    backgroundColor: "rgba(144, 238, 144, 0.3)", // light green with 30% opacity
  },
  subtitle: {
    paddingTop: "2%",
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "300",
    color: "#388E3C",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#d6e1ed",
    height: "10%",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "200",
    color: "#0D47A1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  newsContainer: {
    width: "100%",
    borderColor: "#DCEDC8",
    alignItems: "center",
  },
  newsCard: {
    backgroundColor: "#DCEDC8",
    width: "48%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  newsTitle: {
    fontSize: 14,
    padding: "2%",
    alignSelf: "center",
    fontWeight: "200",
    color: "#1B5E20",
  },
  newsDate: {
    fontSize: 14,
    color: "#558B2F",
  },
});
