import React from "react";
import { OptionsAddCategory } from './OptionsAddCategory';
import { OptionsDeleteCategory } from './OptionsDeleteCategory';
import { OptionsRenameCategory } from './OptionsRenameCategory.jsx';
import { OptionsViewAllCategories } from './OptionsViewAllCategories';

export const Options = () => {
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
