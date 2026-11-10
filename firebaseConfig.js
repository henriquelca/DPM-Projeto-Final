import { initializeApp, getApps } from "firebase/app";
import { Platform } from "react-native";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Reaproveita o aplicativo principal, inclusive durante o Fast Refresh.
const app =
  getApps().find((item) => item.name === "[DEFAULT]") ||
  initializeApp(firebaseConfig);

function obterAuth(appFirebase) {
  if (Platform.OS === "web") {
    return getAuth(appFirebase);
  }

  try {
    return initializeAuth(appFirebase, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (erro) {
    // Durante o Fast Refresh, o Auth pode já ter sido inicializado.
    if (erro.code === "auth/already-initialized") {
      return getAuth(appFirebase);
    }
    throw erro;
  }
}

// Autenticação principal: utilizada pelo gestor e pelo login do aplicativo.
export const auth = obterAuth(app);
export const db = getFirestore(app);

// Segunda instância para cadastrar aprendizes sem desconectar o gestor.
const appCadastro =
  getApps().find((item) => item.name === "cadastroUsuarios") ||
  initializeApp(firebaseConfig, "cadastroUsuarios");

export const cadastroAuth = obterAuth(appCadastro);
