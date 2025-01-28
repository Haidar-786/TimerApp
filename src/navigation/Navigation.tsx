import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../utils/NavigationUtil";
import MainNavigator from "./MainNavigator";

const Navigation: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef} >
      <MainNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
