import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { FC } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Platform } from "react-native";
import { Colors } from "../constants/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Timers from "../screens/Timers";
import HistoryScreen from "../screens/HistoryScreen";

const Tab = createBottomTabNavigator();

const BottomTab: FC = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingTop: Platform.OS === "ios" ? RFValue(5) : 0,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          backgroundColor: colors.background,
          height: Platform.OS === "android" ? 70 : 80,
        },
        tabBarActiveTintColor: Colors.active_tab,
        tabBarInactiveTintColor: "#447777",
        headerShadowVisible: true,
        tabBarLabelStyle: {
          fontFamily: 'Roboto-Black',
          fontSize: Platform.OS === "ios" ? 9 : 14,
          textAlign: "center",
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "Timers") {
            return <Ionicons name="timer-outline" size={30} color="#447777" />;
          }
          if (route.name === "History") {
            return <Ionicons name="timer" size={30} color="#447777" />;
          }
        },
      })}
    >
      <Tab.Screen name="Timers" component={Timers} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default BottomTab;
