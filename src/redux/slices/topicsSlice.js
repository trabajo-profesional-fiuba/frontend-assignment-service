import { createSlice } from "@reduxjs/toolkit";

// Estado inicial con una lista vacía de tópicos
const initialState = [];

// Crear el slice para manejar los tópicos
export const topicsSlice = createSlice({
  name: "topicsReducer",
  initialState,
  reducers: {
    // Acción para establecer la lista de tópicos
    setTopics: (state, action) => {
      return action.payload; // Devolver el nuevo estado
    },
    // Acción para limpiar la lista de tópicos
    clearTopics: () => {
      return []; // Devolver una lista vacía
    },
    // Acción para agregar un nuevo tópico
    addNewTopic: (state, action) => {
      state.push(action.payload); // Agregar el nuevo tópico a la lista
    },
  },
});

// Exportar las acciones
export const { setTopics, clearTopics, addNewTopic } = topicsSlice.actions;

// Exportar el reducer
export default topicsSlice.reducer;
