import React from "react";
import SliderInput from "src/layouts/VibesMap/vibes-map-upload-preview-page/slider/SliderInput";

const VibesScoreSlider = ({ handleSetState, vibeProps }) => {
  /**
     * handleSetState updates the slider component
     * 
     * VIBES PROPS - An Object containning the respective fields
     * example - vibeProps: {
            friendliness: 0,
            energy: 0,
            density: 0,
            diversity: 0,
        },
     */

  return (
    <div className="iputWrapper">
      <label>Friendliness</label>
      <SliderInput
        MAX={10}
        value={vibeProps.friendliness}
        handleChange={(e) => {
          const friendliness = e.target.value;
          const newProps = vibeProps;
          newProps.friendliness = Number(friendliness);
          handleSetState({
            vibeProps: newProps,
          });
        }}
      />
      <label>Energy</label>
      <SliderInput
        MAX={10}
        value={vibeProps.energy}
        handleChange={(e) => {
          const energy = e.target.value;
          const newProps = vibeProps;
          newProps.energy = Number(energy);
          handleSetState({
            vibeProps: newProps,
          });
        }}
      />
      <label>Density</label>
      <SliderInput
        MAX={10}
        value={vibeProps.density}
        handleChange={(e) => {
          const density = e.target.value;
          const newProps = vibeProps;
          newProps.density = Number(density);
          handleSetState({
            vibeProps: newProps,
          });
        }}
      />
      <label>Diversity</label>
      <SliderInput
        MAX={10}
        value={vibeProps.diversity}
        handleChange={(e) => {
          const diversity = e.target.value;
          const newProps = vibeProps;
          newProps.diversity = Number(diversity);
          handleSetState({
            vibeProps: newProps,
          });
        }}
      />
    </div>
  );
};

export default VibesScoreSlider;
