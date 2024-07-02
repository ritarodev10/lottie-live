import { Layer, LottieAnimationData, Shape } from "../types/lottie.type";

export const extractColorsFromAnimation = (
  animationData: LottieAnimationData
): string[] => {
  const colorsSet = new Set<string>();

  const extractColors = (shape: Shape) => {
    if (shape.ty === "gr" && shape.it) {
      shape.it.forEach(extractColors);
    } else if ((shape.ty === "fl" || shape.ty === "st") && shape.c?.k) {
      const color = shape.c.k
        .slice(0, 3)
        .map((val: number) => Math.round(val * 255));
      const hexColor = `#${color
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("")}`;
      colorsSet.add(hexColor);
    }
  };

  animationData.layers.forEach((layer: Layer) => {
    if (layer.ty === 4 && layer.shapes) {
      layer.shapes.forEach(extractColors);
    }
  });

  return Array.from(colorsSet);
};

export const extractColorsFromLayer = (layer: Layer): string[] => {
  const colorsSet = new Set<string>();

  const extractColors = (shape: Shape) => {
    if (shape.ty === "gr" && shape.it) {
      shape.it.forEach(extractColors);
    } else if ((shape.ty === "fl" || shape.ty === "st") && shape.c?.k) {
      const color = shape.c.k
        .slice(0, 3)
        .map((val: number) => Math.round(val * 255));
      const hexColor = `#${color
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("")}`;
      colorsSet.add(hexColor);
    }
  };

  if (layer.ty === 4 && layer.shapes) {
    layer.shapes.forEach(extractColors);
  }

  return Array.from(colorsSet);
};

export const updateShapeColor = (
  shape: Shape,
  oldColor: string,
  newColor: string
) => {
  if (shape.ty === "gr" && shape.it) {
    shape.it.forEach((childShape) =>
      updateShapeColor(childShape, oldColor, newColor)
    );
  } else if ((shape.ty === "fl" || shape.ty === "st") && shape.c?.k) {
    const color = shape.c.k
      .slice(0, 3)
      .map((val: number) => Math.round(val * 255));
    const hexColor = `#${color
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`;
    if (hexColor === oldColor) {
      const rgbColor = newColor
        .slice(1)
        .match(/.{2}/g)
        ?.map((hex) => parseInt(hex, 16) / 255);
      if (rgbColor) {
        shape.c.k = [...rgbColor, 1];
      }
    }
  }
};
