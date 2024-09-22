import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "./userSlice";
import topicsReducer from "./topicsSlice"; // Importa el topicsSlice
import tutorsReducer from "./tutorsSlice"; // Importa el tutorsSlice

const persistUserConfig = {
  key: "user",
  storage,
};

const persistTopicsConfig = {
  key: "topics",
  storage,
};

const persistTutorsConfig = {
  key: "tutors",
  storage,
};

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);

const persistedTopicsReducer = persistReducer(persistTopicsConfig, topicsReducer);

const persistedTutorsReducer = persistReducer(persistTutorsConfig, tutorsReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    topics: persistedTopicsReducer,       // Agrega el reducer de tópicos aquí
    tutors: persistedTutorsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
