// Lottie Animation Data Type Definition
export type LottieAnimationData = {
  v: string; // Version of the Lottie format
  fr: number; // Frame rate of the animation
  ip: number; // In point of the animation (starting frame)
  op: number; // Out point of the animation (ending frame)
  w: number; // Width of the animation
  h: number; // Height of the animation
  nm: string; // Name of the animation
  ddd: number; // 3D layer flag (1 if the animation uses 3D layers, 0 otherwise)
  assets: Asset[]; // Array of assets used in the animation
  layers: Layer[]; // Array of layers used in the animation
  markers: Marker[]; // Array of markers used in the animation
};

// Asset Type Definition
export type Asset = {
  id: string; // ID of the asset
  w?: number; // Width of the asset (if it's an image)
  h?: number; // Height of the asset (if it's an image)
  u?: string; // URL of the asset (if it's an image)
  p?: string; // Path of the asset (if it's an image)
  e?: number; // Expression flag (if the asset is an expression)
};

// Layer Type Definition
export type Layer = {
  ty: number; // Type of layer (0: precomposition, 1: solid, 2: image, 3: null, 4: shape, 5: text)
  ddd: number; // 3D layer flag (1 if the layer uses 3D layers, 0 otherwise)
  ind: number; // Index of the layer
  nm: string; // Name of the layer
  refId?: string; // Reference ID (if the layer references an asset)
  sr: number; // Stretch (default 1)
  ks: Transform; // Transform properties
  ao?: number; // Auto-orient (1 if the layer auto-orients, 0 otherwise)
  ip: number; // In point of the layer (starting frame)
  op: number; // Out point of the layer (ending frame)
  st: number; // Start time of the layer
  bm: number; // Blend mode (0: normal, 1: multiply, etc.)
  shapes?: Shape[]; // Array of shapes (if the layer is a shape layer)
  text?: Text; // Text properties (if the layer is a text layer)
};

// Transform Type Definition
export type Transform = {
  a: Property; // Anchor point
  p: Property; // Position
  s: Property; // Scale
  r: Property; // Rotation
  o: Property; // Opacity
};

// Property Type Definition
export type Property = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  k: any[]; // Keyframes or static value
};

// Shape Type Definition
export type Shape = {
  ty: string; // Type of shape (e.g., 'rect', 'circle', 'path')
  ks: Property; // Shape properties
  nm: string; // Name of the shape
};

// Text Type Definition
export type Text = {
  d: {
    k: TextData[]; // Array of text data keyframes
  };
  a: Property; // Animation properties
};

// Text Data Type Definition
export type TextData = {
  t: {
    d: {
      k: TextDocument[]; // Array of text documents
    };
  };
};

// Text Document Type Definition
export type TextDocument = {
  s: number; // Size of the text
  f: string; // Font family
  t: string; // Actual text
  j: number; // Justification (0: left, 1: right, 2: center)
  tr: number; // Tracking
  lh: number; // Line height
  ls: number; // Line spacing
  fc: number[]; // Fill color (array of RGB values)
};

// Marker Type Definition
export type Marker = {
  tm: number; // Time in the animation where the marker is placed
  cm: string; // Comment or name of the marker
  dr: number; // Duration of the marker
};
