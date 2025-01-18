export const createOpenSCAD = async () => {
  return {
    compile: async (code) => ({
      // Mock implementation
      getGeometry: () => ({ vertices: [], faces: [] }),
      getDependencies: () => [],
      getWarnings: () => [],
      getErrors: () => [],
    }),
  };
};
