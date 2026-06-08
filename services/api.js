// ============================================
// ZEVO — services/api.js
// Service de communication avec le backend
// ============================================

import axios from 'axios';

// URL de base du serveur backend
// En développement = ton PC local
// En production = ton serveur cloud
const BASE_URL = 'http://172.16.54.218:3000';
// Note : 10.0.2.2 = adresse spéciale qui pointe vers
// ton PC depuis l'émulateur Android (localhost ne fonctionne pas)

// Créer une instance axios avec la config de base
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 secondes maximum (connexions lentes en RDC)
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// INTERCEPTEUR — ajoute le token automatiquement
// ============================================
// Avant chaque requête → ajoute le token JWT si disponible
api.interceptors.request.use(
    (config) => {
        // On ajoutera le token ici quand on aura AsyncStorage
        return config;
    },
    (error) => Promise.reject(error)
);

// ============================================
// FONCTIONS D'AUTHENTIFICATION
// ============================================

// Inscription — créer un nouveau compte
export const inscription = async (nom, email, telephone, motDePasse) => {
    try {
        const reponse = await api.post('/auth/inscription', {
            nom,
            email,
            telephone,
            mot_de_passe: motDePasse,
        });
        return { succes: true, data: reponse.data };
    } catch (erreur) {
        return {
            succes: false,
            erreur: erreur.response?.data?.erreur || 'Erreur de connexion au serveur',
        };
    }
};

// Connexion — se connecter avec email/téléphone + mot de passe
export const connexion = async (identifiant, motDePasse) => {
    try {
        const reponse = await api.post('/auth/connexion', {
            identifiant,
            mot_de_passe: motDePasse,
        });
        return { succes: true, data: reponse.data };
    } catch (erreur) {
        return {
            succes: false,
            erreur: erreur.response?.data?.erreur || 'Erreur de connexion au serveur',
        };
    }
};
// Créer un PIN
export const creerPin = async (userId, pin) => {
    try {
        const reponse = await api.post('/auth/pin/creer', {
            user_id: userId,
            pin,
        });
        return { succes: true, data: reponse.data };
    } catch (erreur) {
        return {
            succes: false,
            erreur: erreur.response?.data?.erreur || 'Erreur serveur',
        };
    }
};

// Vérifier un PIN
export const verifierPin = async (userId, pin) => {
    try {
        const reponse = await api.post('/auth/pin/verifier', {
            user_id: userId,
            pin,
        });
        return { succes: true, data: reponse.data };
    } catch (erreur) {
        return {
            succes: false,
            erreur: erreur.response?.data?.erreur || 'Erreur serveur',
        };
    }
};
// Récupérer les wallets
export const getWallets = async (userId) => {
    try {
        const reponse = await api.get(`/wallets/${userId}`);
        return { succes: true, data: reponse.data };
    } catch (erreur) {
        return {
            succes: false,
            erreur: erreur.response?.data?.erreur || 'Erreur serveur',
        };
    }
};

// Ajouter un wallet
export const ajouterWallet = async (userId, nom, typeWallet, numero) => {
    try {
        const reponse = await api.post('/wallets/ajouter', {
            user_id: userId,
            nom,
            type_wallet: typeWallet,
            numero,
        });
        return { succes: true, data: reponse.data };
    } catch (erreur) {
        return {
            succes: false,
            erreur: erreur.response?.data?.erreur || 'Erreur serveur',
        };
    }
};
export default api;