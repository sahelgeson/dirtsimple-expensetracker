import React from "react";
import OptionsAddCategory from "./OptionsAddCategory.jsx";
import OptionsDeleteCategory from "./OptionsDeleteCategory.jsx";
import OptionsRenameCategory from "./OptionsRenameCategory.jsx";
import OptionsViewAllCategories from "./OptionsViewAllCategories.jsx";

function Options(props){
  return(
    <div className="container margin-0-auto phl">

      {/* TODO: make this toggle the edit categories options below */}
      <h2 className="mtl">
          Edit Categories:
      </h2>
      <OptionsAddCategory />
      <OptionsDeleteCategory />
      <OptionsRenameCategory />
      <OptionsViewAllCategories />

    </div>
  );
}

export default Options;
