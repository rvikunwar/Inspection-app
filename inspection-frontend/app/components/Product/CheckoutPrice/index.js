import Text from "@components/Text";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";

const CheckoutPrice = ({ salePrice, style }) => {
  return (
    <View
      style={[
        {
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 12,
        },
        style,
      ]}
    >
      <Text body1>SUB TOTAL</Text>
      <Text title3 semibold>
        {salePrice}
      </Text>
    </View>
  );
};

CheckoutPrice.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CheckoutPrice.defaultProps = {
  style: {},
  salePrice: "",
};

export default CheckoutPrice;
