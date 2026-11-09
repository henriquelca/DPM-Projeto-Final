import React, { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const AuthContext = createContext(null);

async function buscarPerfil(uid) {
  const documento = await getDoc(doc(db, "usuarios", uid));
  if (!documento.exists()) {
    return null;
  }
  return documento.data();
}

export function mensagemDeErro(erro) {
  if (erro.code === "auth/invalid-email") {
    return "E-mail inválido.";
  }
  if (erro.code === "auth/missing-password") {
    return "Digite a senha.";
  }
  if (erro.code === "auth/invalid-credential") {
    return "E-mail ou senha incorretos.";
  }
  if (erro.code === "auth/too-many-requests") {
    return "Muitas tentativas. Tente novamente mais tarde.";
  }
  if (erro.code === "auth/network-request-failed") {
    return "Sem conexão com a internet.";
  }
  return erro.message;
}

export function AuthProvider({ children }) {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function verificarLoginSalvo() {
      await auth.authStateReady();
      if (auth.currentUser) {
        const dados = await buscarPerfil(auth.currentUser.uid);
        if (dados !== null && dados.status !== "Inativo") {
          setPerfil(dados);
        } else {
          await signOut(auth);
        }
      }
      setCarregando(false);
    }
    verificarLoginSalvo();
  }, []);

  async function entrar(email, senha, tipoEscolhido) {
    const resultado = await signInWithEmailAndPassword(auth, email.trim(), senha);
    const dados = await buscarPerfil(resultado.user.uid);

    if (dados === null) {
      await signOut(auth);
      throw new Error("Perfil não encontrado. Fale com a gestão.");
    }
    if (dados.status === "Inativo") {
      await signOut(auth);
      throw new Error("Esta conta está inativa.");
    }
    if (dados.tipo !== tipoEscolhido.toLowerCase()) {
      await signOut(auth);
      throw new Error("Esta conta não é de " + tipoEscolhido + ".");
    }

    setPerfil(dados);
  }

  async function sair() {
    await signOut(auth);
    setPerfil(null);
  }

  async function recuperarSenha(email) {
    await sendPasswordResetEmail(auth, email.trim());
  }

  return (
    <AuthContext.Provider value={{ perfil, carregando, entrar, sair, recuperarSenha }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
