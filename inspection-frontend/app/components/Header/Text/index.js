import Header from "@components/Header/Header";
import Text from "@components/Text";
import React from "react";

function HeaderText({ title = "", props = {} }) {
    return (
        <Header
            renderLeft={() => (
                <Text header bold>
                    {title}
                </Text>
            )}
            title={""}
            styleLeft={{
                flex: 1,
            }}
            styleContentLeft={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 0,
                width: "100%",
                paddingHorizontal: 20,
            }}
            styleContentCenter={{
                flex: 0,
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}
            styleRight={{ flex: 0 }}
            {...props}
        />
    );
}

export default HeaderText;
