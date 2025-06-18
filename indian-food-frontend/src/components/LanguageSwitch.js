import { Box, Button } from "grommet";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const [active, setActive] = useState("en");
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setActive(languageCode);
  };

  return (
    <Box direction="row" gap="small" pad="small">
      <Button
        primary
        onClick={() => changeLanguage("en")}
        active={active === "en"}
        style={{ paddingLeft: "8px", paddingRight: "8px" }}
      >
        English
      </Button>
      <Button
        primary
        onClick={() => changeLanguage("de")}
        active={active === "de"}
        style={{ paddingLeft: "8px", paddingRight: "8px" }}
      >
        German
      </Button>
    </Box>
  );
}

export default LanguageSelector;
