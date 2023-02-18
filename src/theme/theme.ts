import { extendTheme } from "@chakra-ui/react";
// import { ButtonStyles as Button } from "./styles/components/ButtonStyles";
import { buttonTheme, selectTheme, numberInputTheme, inputTheme } from "./controlsTheme";

export const theme = extendTheme({
  fontSizes: {
    xlg: '1.5rem',
  },
  // colors: {
  //   brand: {
  //     100: "#f7fafc",
  //     900: "#f77070"
  //   },
  //   grey: {
  //     100: "#eff3fa"
  //   },
  //   blue: {
  //     100: "#0098ae"
  //   },
  //   red: {
  //     100: "#ff3d3d",
  //     200: "#f77070"
  //   }
  // },
  // fonts: {
  //   body: "Graphik Font",
  //   heading: "Graphik Font"
  // },
  // fontWeights: {
  //   hairline: 100,
  //   thin: 200,
  //   light: 300,
  //   normal: 400,
  //   medium: 500,
  //   semibold: 600,
  //   bold: 700,
  //   extrabold: 800,
  //   black: 900
  // },
  components: {
    Button: buttonTheme,
    Select: selectTheme,
    Input: inputTheme,
    NumberInput: numberInputTheme,
  }
});

export default theme;
