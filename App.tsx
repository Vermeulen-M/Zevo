// ============================================
// ZEVO — App.tsx v6
// Design Premium — Neumorphisme + Son
// ============================================
import QRCode from 'react-native-qrcode-svg';
import CountryPicker from 'react-native-country-picker-modal';
import messaging from '@react-native-firebase/messaging';
import { Vibration } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { inscription as apiInscription, connexion as apiConnexion, creerPin, verifierPin, getWallets, ajouterWallet, getTransactions, getSoldeTotal, verifierWalletMpesa, payerMobileMoney, transfererFlutterwave, chercherUtilisateur, getTypesWallets } from './services/api';
import {
 View, Text, StyleSheet, StatusBar, TouchableOpacity,
  ScrollView, useColorScheme, SafeAreaView, Animated,
  TextInput, Dimensions, Platform, Image,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
import Sound from 'react-native-sound';

// ============================================
// DESIGN SYSTEM
// ============================================
const C = {
  // Primaire
  p1: '#1A6FD4',
  p2: '#5E5CE6',

  // Mode clair
  lBg:     '#F0F2F5',   // gris perle — pas blanc pur
  lCard:   '#FFFFFF',
  lText:   '#0D0D0D',
  lSub:    '#6B7280',
  lBorder: '#E8EAF0',
  lShadowD:'rgba(0,0,0,0.12)',
  lShadowL:'rgba(255,255,255,0.9)',

  // Mode sombre premium
  dBg:     '#0A0A0F',   // noir profond légèrement bleuté
  dCard:   '#141420',   // carte légèrement plus claire
  dText:   '#F0F0F0',
  dSub:    '#8A8AA0',
  dBorder: '#1E1E2E',
  dShadowD:'rgba(0,0,0,0.6)',
  dShadowL:'rgba(255,255,255,0.03)',

  // Sémantique
 pos: '#00FF9F',
  neg: '#FF4757',
};

const F = { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26, xxxl: 38 };

// ============================================
// HOOK THÈME
// ============================================
function useTheme() {
  const isDark = useColorScheme() === 'dark';
  return {
    isDark,
    bg:      isDark ? C.dBg     : C.lBg,
    card:    isDark ? C.dCard   : C.lCard,
    text:    isDark ? C.dText   : C.lText,
    sub:     isDark ? C.dSub    : C.lSub,
    border:  isDark ? C.dBorder : C.lBorder,
    shadowD: isDark ? C.dShadowD: C.lShadowD,
    shadowL: isDark ? C.dShadowL: C.lShadowL,
  };
}

// ============================================
// DÉCO FOND — cercles sur tous les écrans
// ============================================
function DecoBg() {
  const t = useTheme();
  return (
    <>
      <View style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: t.isDark ? 'rgba(26,111,212,0.06)' : 'rgba(26,111,212,0.05)' }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: t.isDark ? 'rgba(94,92,230,0.06)' : 'rgba(94,92,230,0.04)' }} />
      <View style={{ position: 'absolute', top: '40%', left: -60, width: 150, height: 150, borderRadius: 75, backgroundColor: t.isDark ? 'rgba(26,111,212,0.04)' : 'rgba(26,111,212,0.03)' }} />
    </>
  );
}

// ============================================
// LOGO ZEVO — Z dans carré arrondi gradient
// ============================================
function LogoZevo({ size = 28 }: { size?: number }) {
  const boxSize = size * 1.5;
  return (
    <View style={{
      width: boxSize, height: boxSize, borderRadius: boxSize * 0.28,
      backgroundColor: C.p1,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: C.p1,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    }}>
      <Text style={{
        fontSize: size * 0.85,
        fontWeight: '900',
        color: '#FFFFFF',
        transform: [{ skewX: '-12deg' }],
        letterSpacing: -1,
      }}>Z</Text>
    </View>
  );
}

// ============================================
// COMPOSANT CARTE — effet neumorphisme
// ============================================
function Card({ children, style, theme }: { children: any, style?: any, theme: any }) {
  return (
    <View style={[{
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 20,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    }, style]}>
      {children}
    </View>
  );
}
// ============================================
// BOUTON PREMIUM
// ============================================
function BtnPrimary({ label, onPress, loading }: { label: string, onPress: () => void, loading?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: C.p1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 10,
        shadowColor: C.p1,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        borderWidth: 0,
      }}
    >
      <Text style={{ color: '#fff', fontSize: F.md, fontWeight: '700', letterSpacing: 0.5 }}>
        {loading ? 'Connexion...' : label}
      </Text>
    </TouchableOpacity>
  );
}
function BtnOutline({ label, onPress }: { label: string, onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: C.p1,
        backgroundColor: 'transparent',
      }}
    >
      <Text style={{ color: C.p1, fontSize: F.md, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
}
function Tabs({ items, active, onChange, theme }: { items: {id:string,label:string}[], active: string, onChange: (s:string)=>void, theme: any }) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: theme.card,
      margin: 16,
      borderRadius: 16,
      padding: 4,
      gap: 4,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    }}>
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onChange(item.id)}
          activeOpacity={0.8}
          style={[{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 13,
            alignItems: 'center',
          }, active === item.id && {
            backgroundColor: C.p1,
            elevation: 8,
            shadowColor: C.p1,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
          }]}
        >
          <Text style={{
            fontSize: F.sm,
            fontWeight: '700',
            color: active === item.id ? '#fff' : theme.sub,
            letterSpacing: 0.3,
          }}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================
// ANIMATION VALIDATION — ligne simple + son
// ============================================
function AnimationSucces({ visible, onFin }: { visible: boolean, onFin: () => void }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      opacity.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]),
        Animated.delay(1500),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => onFin());
    }
  }, [visible]);

  if (!visible) return null;

  // Jouer le son de validation
Sound.setCategory('Playback');
const sound = new Sound('notification_compat.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (!error) sound.play();
});

  return (
    <Animated.View style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      alignItems: 'center', justifyContent: 'center',
      opacity,
    }}>
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }} />
<Animated.View style={{
  width: 140, height: 140, borderRadius: 70,
  backgroundColor: 'rgba(0,196,140,0.15)',
  alignItems: 'center', justifyContent: 'center',
  transform: [{ scale }],
}}>
  <View style={{
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: C.pos,
    alignItems: 'center', justifyContent: 'center',
  }}>
    <Text style={{
      color: C.pos,
      fontSize: 50,
      fontWeight: '200',
      marginTop: -4,
    }}>v</Text>
  </View>
</Animated.View>
</Animated.View>
);
}

// ============================================
// CHAMP DE SAISIE
// ============================================
function InputField({ label, placeholder, value, onChange, secure, keyType, theme }: any) {
  return (
    <View style={{
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.bg,
      padding: 14,
      shadowColor: theme.shadowD,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 1,
    }}>
      <Text style={{ fontSize: F.xs, color: theme.sub, fontWeight: '600', marginBottom: 5 }}>{label}</Text>
      <TextInput
        style={{ fontSize: F.md, color: theme.text, paddingVertical: 0 }}
        placeholder={placeholder}
        placeholderTextColor={theme.sub}
        secureTextEntry={secure}
        autoCapitalize="none"
        keyboardType={keyType || 'default'}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

// ============================================
// ÉCRAN CONNEXION
// ============================================
function EcranConnexion({ onConnexion, onInscription }: { onConnexion: () => void, onInscription: () => void }) {
  const t = useTheme();
  const [id, setId] = useState('');
  const [mdp, setMdp] = useState('');
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />

      {/* Décoration fond */}
      <View style={{
        position: 'absolute', top: -80, right: -80,
        width: 240, height: 240, borderRadius: 120,
        backgroundColor: t.isDark ? 'rgba(10,132,255,0.06)' : 'rgba(10,132,255,0.05)',
      }} />
      <View style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 180, height: 180, borderRadius: 90,
        backgroundColor: t.isDark ? 'rgba(94,92,230,0.06)' : 'rgba(94,92,230,0.04)',
      }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <LogoZevo size={32} />
          <Text style={{ fontSize: F.xxl, color: t.sub, marginTop: 12, letterSpacing: 0.5 }}>
            check et paies
          </Text>
        </View>

        <Card theme={t} style={{ gap: 14 }}>
          <Text style={{ fontSize: F.xxl, fontWeight: '800', color: t.text, letterSpacing: -0.5, marginBottom: 4 }}>
            Connexion
          </Text>
          <InputField label="Email ou téléphone" placeholder="email@exemple.com ou +243..." value={id} onChange={setId} theme={t} />
          <InputField label="Mot de passe" placeholder="••••••••" value={mdp} onChange={setMdp} secure theme={t} />

          {err ? <Text style={{ color: C.neg, fontSize: F.xs, textAlign: 'center' }}>{err}</Text> : null}

          <BtnPrimary label="Se connecter" loading={load} onPress={async () => {
            setLoad(true); setErr('');
            const fcmToken = await AsyncStorage.getItem('fcmToken') || '';
const r = await apiConnexion(id, mdp, fcmToken);
            setLoad(false);
            if (r.succes) {
              await AsyncStorage.setItem('token', r.data.token);
              await AsyncStorage.setItem('user', JSON.stringify(r.data.user));
              onConnexion();
            } else setErr(r.erreur);
          }} />
        </Card>

        <TouchableOpacity onPress={onInscription} style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: t.sub, fontSize: F.sm }}>
            Pas encore de compte ?{' '}
            <Text style={{ color: C.p1, fontWeight: '700' }}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================
// ÉCRAN INSCRIPTION
// ============================================
function EcranInscription({ onInscription, onConnexion }: { onInscription: () => void, onConnexion: () => void }) {
  const t = useTheme();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [countryCode, setCountryCode] = useState<any>('CI');
  const [callingCode, setCallingCode] = useState('225');
  const [afficherPays, setAfficherPays] = useState(false);
  const [mdp, setMdp] = useState('');
  const [mdpConfirm, setMdpConfirm] = useState('');
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
      <View style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: 120, backgroundColor: t.isDark ? 'rgba(10,132,255,0.06)' : 'rgba(10,132,255,0.05)' }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <LogoZevo size={32} />
          <Text style={{ fontSize: F.xs, color: t.sub, marginTop: 12, letterSpacing: 0.5 }}>CRÉER VOTRE COMPTE</Text>
        </View>

        <Card theme={t} style={{ gap: 12 }}>
          <Text style={{ fontSize: F.xxl, fontWeight: '800', color: t.text, letterSpacing: -0.5, marginBottom: 4 }}>Inscription</Text>
          <InputField label="Nom complet" placeholder="Jean Kabila" value={nom} onChange={setNom} theme={t} />
          <InputField label="Email" placeholder="email@exemple.com" value={email} onChange={setEmail} keyType="email-address" theme={t} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
  <TouchableOpacity
    onPress={() => setAfficherPays(true)}
    style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: t.card, borderWidth: 1, borderColor: t.border,
      borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
      marginRight: 8,
    }}
  >
    <CountryPicker
      countryCode={countryCode}
      withFlag
      withCallingCode
      withEmoji
      onSelect={(country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
      }}
      visible={afficherPays}
      onClose={() => setAfficherPays(false)}
    />
    <Text style={{ color: t.text, fontWeight: '600', marginLeft: 4 }}>+{callingCode}</Text>
  </TouchableOpacity>
</View>
<InputField label="Téléphone" placeholder="Ex: 0102030405" value={tel} onChange={setTel} keyType="phone-pad" theme={t} />
          <InputField label="Mot de passe" placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre" value={mdp} onChange={setMdp} secure theme={t} />
<InputField label="Confirmer le mot de passe" placeholder="••••••••" value={mdpConfirm} onChange={setMdpConfirm} secure theme={t} />

          {err ? <Text style={{ color: C.neg, fontSize: F.xs, textAlign: 'center' }}>{err}</Text> : null}

          <BtnPrimary label="Créer mon compte" loading={load} onPress={async () => {
       setLoad(true); setErr('');

// Validation
if (!nom || nom.trim().length < 2) {
  setErr('Le nom doit contenir au moins 2 caractères');
  setLoad(false); return;
}
if (!email || !email.includes('@')) {
  setErr('Email invalide');
  setLoad(false); return;
}
if (!tel || tel.length < 6) {
  setErr('Numéro de téléphone invalide');
  setLoad(false); return;
}
if (mdp.length < 8) {
  setErr('Le mot de passe doit contenir au moins 8 caractères');
  setLoad(false); return;
}
if (!/[A-Z]/.test(mdp)) {
  setErr('Le mot de passe doit contenir au moins 1 majuscule');
  setLoad(false); return;
}
if (!/[0-9]/.test(mdp)) {
  setErr('Le mot de passe doit contenir au moins 1 chiffre');
  setLoad(false); return;
}
if (mdp !== mdpConfirm) {
  setErr('Les mots de passe ne correspondent pas');
  setLoad(false); return;
}

const telephoneComplet = `+${callingCode}${tel}`;
const r = await apiInscription(nom, email, telephoneComplet, mdp, callingCode);

setLoad(false);
            if (r.succes) {
              await AsyncStorage.setItem('token', r.data.token);
              await AsyncStorage.setItem('user', JSON.stringify(r.data.user));
              onInscription();
            } else setErr(r.erreur);
          }} />
        </Card>

        <TouchableOpacity onPress={onConnexion} style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: t.sub, fontSize: F.sm }}>
            Déjà un compte ?{' '}
            <Text style={{ color: C.p1, fontWeight: '700' }}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
// ============================================
// ÉCRAN CRÉATION PIN — après inscription
// ============================================
function EcranCreerPin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [etape, setEtape] = useState<'creer' | 'confirmer'>('creer');
  const [erreur, setErreur] = useState('');
  const shake = useRef(new Animated.Value(0)).current;
  const t = useTheme();

  function secouer() {
    Animated.sequence([
      Animated.timing(shake, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -12, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  async function appuyer(c: string) {
    setErreur('');
    if (etape === 'creer') {
      if (pin.length >= 6) return;
      const p = pin + c;
      setPin(p);
      if (p.length === 6) {
        setTimeout(() => setEtape('confirmer'), 300);
      }
    } else {
      if (confirmation.length >= 6) return;
      const conf = confirmation + c;
      setConfirmation(conf);
      if (conf.length === 6) {
        setTimeout(async () => {
          if (conf !== pin) {
            setErreur('Les PIN ne correspondent pas');
            secouer();
            setConfirmation('');
            return;
          }
          try {
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user) {
              await creerPin(user.id, pin);
            }
            onSuccess();
          } catch (e) {
            onSuccess();
          }
        }, 300);
      }
    }
  }

  function effacer() {
    if (etape === 'creer') setPin(pin.slice(0, -1));
    else setConfirmation(confirmation.slice(0, -1));
  }

  const pinActuel = etape === 'creer' ? pin : confirmation;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
      <DecoBg />

      <View style={{ alignItems: 'center', marginBottom: 48 }}>
        <LogoZevo size={32} />
        <Text style={{ fontSize: F.xl, fontWeight: '700', color: t.text, marginTop: 20 }}>
          {etape === 'creer' ? 'Créer votre PIN' : 'Confirmer votre PIN'}
        </Text>
        <Text style={{ fontSize: F.sm, color: t.sub, marginTop: 6 }}>
          {etape === 'creer' ? 'Choisissez un PIN à 6 chiffres' : 'Entrez à nouveau votre PIN'}
        </Text>
        {erreur ? <Text style={{ color: C.neg, fontSize: F.xs, marginTop: 8 }}>{erreur}</Text> : null}
      </View>

      <Animated.View style={{ flexDirection: 'row', gap: 16, marginBottom: 52, transform: [{ translateX: shake }] }}>
        {[0,1,2,3,4,5].map(i => (
          <View key={i} style={{
            width: 14, height: 14, borderRadius: 7,
            backgroundColor: i < pinActuel.length ? C.p1 : 'transparent',
            borderWidth: 1.5,
            borderColor: i < pinActuel.length ? C.p1 : t.sub,
            elevation: i < pinActuel.length ? 3 : 0,
          }} />
        ))}
      </Animated.View>

      <View style={{ width: '100%', gap: 12 }}>
        {[['1','2','3'],['4','5','6'],['7','8','9']].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
            {row.map(k => (
              <TouchableOpacity key={k} onPress={() => appuyer(k)} activeOpacity={0.75} style={{
                width: 78, height: 78, borderRadius: 39,
                backgroundColor: t.card,
                alignItems: 'center', justifyContent: 'center',
                elevation: 4, borderWidth: 1, borderColor: t.border,
              }}>
                <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>{k}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          <View style={{ width: 78, height: 78 }} />
          <TouchableOpacity onPress={() => appuyer('0')} activeOpacity={0.75} style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={effacer} activeOpacity={0.75} style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// ============================================
// ÉCRAN PIN
// ============================================
function EcranPin({ onSuccess, onRetourConnexion }: { onSuccess: () => void, onRetourConnexion: () => void }) {
  const [pin, setPin] = useState('');
  const shake = useRef(new Animated.Value(0)).current;
  const t = useTheme();

  function secouer() {
    Animated.sequence([
      Animated.timing(shake, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -12, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

async function appuyer(c: string) {
    if (pin.length >= 6) return;
    const p = pin + c;
    setPin(p);
    if (p.length === 6) {
      setTimeout(async () => {
        try {
          const userStr = await AsyncStorage.getItem('user');
          const user = userStr ? JSON.parse(userStr) : null;
          
        if (!user) { onSuccess(); return; }
          const result = await verifierPin(user.id, p);
          if (result.succes || result.erreur === 'Aucun PIN défini') {
            onSuccess();
          } else {
            secouer();
            setPin('');
          }
        } catch (e) {
          onSuccess();
        }
      }, 300);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <DecoBg />
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />

      {/* Déco fond */}
      <View style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: t.isDark ? 'rgba(10,132,255,0.05)' : 'rgba(10,132,255,0.04)' }} />
      <View style={{ position: 'absolute', bottom: -80, left: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: t.isDark ? 'rgba(94,92,230,0.05)' : 'rgba(94,92,230,0.03)' }} />

      <View style={{ alignItems: 'center', marginBottom: 48 }}>
        <LogoZevo size={32} />
        <Text style={{ fontSize: F.xl, fontWeight: '700', color: t.text, marginTop: 20, letterSpacing: -0.3 }}>
          Entrez votre PIN
        </Text>
        <Text style={{ fontSize: F.sm, color: t.sub, marginTop: 6 }}>6 chiffres</Text>
      </View>

      <Animated.View style={{ flexDirection: 'row', gap: 16, marginBottom: 52, transform: [{ translateX: shake }] }}>
        {[0,1,2,3,4,5].map(i => (
          <View key={i} style={{
            width: 14, height: 14, borderRadius: 7,
            backgroundColor: i < pin.length ? C.p1 : 'transparent',
            borderWidth: 1.5,
            borderColor: i < pin.length ? C.p1 : t.sub,
            shadowColor: i < pin.length ? C.p1 : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: i < pin.length ? 3 : 0,
          }} />
        ))}
      </Animated.View>

      <View style={{ width: '100%', gap: 12 }}>
        {[['1','2','3'],['4','5','6'],['7','8','9']].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
            {row.map(k => (
              <TouchableOpacity
                key={k}
                onPress={() => appuyer(k)}
                activeOpacity={0.75}
                style={{
                  width: 78, height: 78, borderRadius: 39,
                  backgroundColor: t.card,
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: t.shadowD,
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 0.8,
                  shadowRadius: 6,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: t.border,
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>{k}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          <View style={{ width: 78, height: 78 }} />
          <TouchableOpacity onPress={() => appuyer('0')} activeOpacity={0.75} style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', shadowColor: t.shadowD, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPin(pin.slice(0,-1))} activeOpacity={0.75} style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', shadowColor: t.shadowD, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>⌫</Text>
          </TouchableOpacity>
</View>
      </View>

    <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          onRetourConnexion();
        }}
        style={{ marginTop: 32 }}
      >
        <Text style={{ color: C.p1, fontSize: F.sm, fontWeight: '600' }}>
          Retour à la connexion
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// ============================================
// ÉCRAN ACCUEIL
// ============================================
function EcranAccueil({ isDark, onTransaction, onNaviguer }: { isDark: boolean, onTransaction: () => void, onNaviguer: (s: string) => void }) {
  const t = useTheme();
  const [solde, setSolde] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function chargerDonnees() {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const userData = userStr ? JSON.parse(userStr) : null;
        setUser(userData);

        if (userData) {
          const [soldeResult, txResult] = await Promise.all([
            getSoldeTotal(userData.id),
            getTransactions(userData.id, 3),
          ]);

          if (soldeResult.succes) setSolde(soldeResult.data.solde_total);
          if (txResult.succes) setTransactions(txResult.data.transactions);
        }
      } catch (e) {
        console.log('Erreur chargement accueil:', e);
      } finally {
        setChargement(false);
      }
    }
    chargerDonnees();
  }, []);

  const prenomNom = user ? user.nom.split(' ')[0] : 'Utilisateur';

  const actions = [
    { label: 'Envoyer',  icon: '↑', bg: '#E8F4FF', action: onTransaction },
    { label: 'Recevoir', icon: '↓', bg: '#E8FFF5', action: () => onNaviguer('payer') },
    { label: 'Payer',    icon: '⊡', bg: '#FFF8E8', action: () => onNaviguer('payer') },
    { label: 'Wallets',  icon: '▤', bg: '#F5E8FF', action: () => onNaviguer('wallets') },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} showsVerticalScrollIndicator={false}>

      <View style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: t.isDark ? 'rgba(10,132,255,0.05)' : 'rgba(10,132,255,0.04)' }} />

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 28 }}>
        <View>
          <Text style={{ fontSize: F.xxl, fontWeight: '800', color: t.text, letterSpacing: -0.5 }}>{prenomNom}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <LogoZevo size={18} />
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.p1, alignItems: 'center', justifyContent: 'center', shadowColor: C.p1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: F.sm }}>
              {user ? user.nom.charAt(0).toUpperCase() : 'Z'}
            </Text>
          </View>
        </View>
      </View>

      {/* Carte solde */}
      <View style={{
        marginHorizontal: 16, borderRadius: 28, padding: 26,
        backgroundColor: C.p1, marginBottom: 8, overflow: 'hidden',
        shadowColor: C.p1, shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
      }}>
        <View style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <View style={{ position: 'absolute', right: 20, bottom: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <View style={{ position: 'absolute', left: -20, bottom: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)' }} />

        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: F.sm, marginBottom: 8, letterSpacing: 0.5 }}>SOLDE TOTAL</Text>
        <Text style={{ color: '#fff', fontSize: F.xxxl, fontWeight: '900', letterSpacing: -1.5 }}>
          {chargement ? '...' : Number(solde).toLocaleString()}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: F.xl, fontWeight: '300', marginTop: -4 }}>CDF</Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: F.sm, marginTop: 8 }}>
          ≈ {chargement ? '...' : (Number(solde) / 2890).toFixed(2)} USD
        </Text>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 20 }}>
        {actions.map(a => (
          <TouchableOpacity key={a.label} style={{ alignItems: 'center', gap: 8 }} onPress={a.action} activeOpacity={0.75}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: a.bg,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOffset: { width: 2, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 6,
              elevation: 3,
            }}>
              <Text style={{ fontSize: 18 }}>{a.icon}</Text>
            </View>
            <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '600' }}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginBottom: 12 }}>RÉCENTES</Text>
        {chargement ? (
          <Text style={{ color: t.sub, textAlign: 'center' }}>Chargement...</Text>
        ) : transactions.length === 0 ? (
          <Card theme={t} style={{ padding: 16 }}>
            <Text style={{ color: t.sub, textAlign: 'center' }}>Aucune transaction pour le moment</Text>
          </Card>
        ) : (
          <Card theme={t} style={{ padding: 0, gap: 0 }}>
            {transactions.map((tx, i) => {
              const userStr = user;
              const estEnvoi = tx.expediteur_id === userStr?.id;
              const nom = estEnvoi ? tx.nom_destinataire : tx.nom_expediteur;
              return (
                <View key={tx.id} style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingVertical: 14, paddingHorizontal: 16,
                  borderBottomWidth: i < transactions.length - 1 ? 0.5 : 0,
                  borderBottomColor: t.border,
                }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: estEnvoi ? '#FFE8E8' : '#E8FFE8', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 14 }}>{estEnvoi ? '↑' : '↓'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: F.md, fontWeight: '600', color: t.text }}>{nom || 'Inconnu'}</Text>
                    <Text style={{ fontSize: F.xs, color: t.sub, marginTop: 2 }}>
                      {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: F.md, fontWeight: '700', color: estEnvoi ? C.neg : C.pos }}>
                    {estEnvoi ? '-' : '+'}{Number(tx.montant).toLocaleString()} CDF
                  </Text>
                </View>
              );
            })}
          </Card>
        )}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
// ============================================
// ÉCRAN ENVOYER
// ============================================
function EcranEnvoyer({ onRetour }: { onRetour: () => void }) {
 const [countryCode, setCountryCode] = useState<any>('CI'); const [afficherPays, setAfficherPays] = useState(false); 
 const [callingCode, setCallingCode] = useState('225');  const [destinataireInfo, setDestinataireInfo] = useState<any>(null);
  const [recherche, setRecherche] = useState(false);
  const t = useTheme();
  const [montant, setMontant] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [walletSource, setWalletSource] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [etape, setEtape] = useState<'formulaire' | 'confirmation' | 'succes'>('formulaire');
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    async function chargerWallets() {
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user) {
        const result = await getWallets(user.id);
        if (result.succes) setWallets(result.data.wallets);
      }
    }
    chargerWallets();
  }, []);

  useEffect(() => {
    if (etape === 'confirmation') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setEtape('formulaire');
            setErreur('Délai dépassé — réessayez');
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [etape]);

  if (etape === 'confirmation') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <DecoBg />
        <LogoZevo size={32} />
        <Text style={{ fontSize: F.xl, fontWeight: '700', color: t.text, marginTop: 24, textAlign: 'center' }}>
          Confirmez le paiement
        </Text>
        <Text style={{ fontSize: F.sm, color: t.sub, marginTop: 8, textAlign: 'center' }}>
          Une notification M-Pesa a été envoyée sur votre téléphone
        </Text>
        <Text style={{ fontSize: F.sm, color: t.sub, marginTop: 4, textAlign: 'center' }}>
          Entrez votre PIN M-Pesa pour confirmer
        </Text>
        <Card theme={t} style={{ width: '100%', marginTop: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: F.xs, color: t.sub }}>MONTANT</Text>
          <Text style={{ fontSize: F.xxxl, fontWeight: '900', color: t.text }}>{montant}</Text>
          <Text style={{ fontSize: F.sm, color: t.sub }}>CDF → {destinataire}</Text>
        </Card>
        <View style={{
          width: 120, height: 120, borderRadius: 60,
          borderWidth: 2, borderColor: countdown > 30 ? C.p1 : C.neg,
          alignItems: 'center', justifyContent: 'center', marginTop: 32,
        }}>
          <Text style={{ fontSize: 36, fontWeight: '800', color: countdown > 30 ? C.p1 : C.neg }}>{countdown}</Text>
          <Text style={{ fontSize: F.xs, color: t.sub }}>secondes</Text>
        </View>
        <TouchableOpacity onPress={() => { setEtape('formulaire'); setCountdown(120); }} style={{ marginTop: 24 }}>
          <Text style={{ color: C.neg, fontSize: F.sm }}>Annuler</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
      <DecoBg />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border }}>
        <TouchableOpacity onPress={onRetour} style={{ marginRight: 16 }}>
          <Text style={{ color: C.p1, fontSize: F.lg }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: F.xl, fontWeight: '800', color: t.text }}>Envoyer de l'argent</Text>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* Montant */}
        <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginBottom: 12 }}>MONTANT</Text>
        <InputField
          label="Montant en CDF"
          placeholder="Ex: 5000"
          value={montant}
          onChange={setMontant}
          keyType="numeric"
          theme={t}
        />

   {/* Destinataire */}
        <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginTop: 20, marginBottom: 12 }}>DESTINATAIRE</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
  <TouchableOpacity
    onPress={() => setAfficherPays(true)}
    style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: t.card, borderWidth: 1, borderColor: t.border,
      borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
      marginRight: 8,
    }}
  >
    <CountryPicker
      countryCode={countryCode}
      withFlag
      withCallingCode
      withEmoji
      onSelect={(country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);
      }}
      visible={afficherPays}
      onClose={() => setAfficherPays(false)}
    />
    <Text style={{ color: t.text, fontWeight: '600', marginLeft: 4 }}>+{callingCode}</Text>
  </TouchableOpacity>
</View>
        <InputField
          label="Numéro de téléphone"
       placeholder="Numéro sans le code pays"
          value={destinataire}
          onChange={async (val: string) => {
            setDestinataire(val);
            setDestinataireInfo(null);
            if (val.length >= 9) {
              setRecherche(true);
             const result = await chercherUtilisateur(`+${callingCode}${val}`);
              setRecherche(false);
              if (result.succes && result.data.trouve) {
                setDestinataireInfo(result.data.user);
              }
            }
          }}
          keyType="phone-pad"
          theme={t}
        />
        {recherche && (
          <Text style={{ color: t.sub, fontSize: F.xs, marginTop: 8 }}>Recherche...</Text>
        )}
        {destinataireInfo && (
          <Card theme={t} style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', padding: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.p1, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>{destinataireInfo.nom.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={{ color: t.text, fontWeight: '600' }}>{destinataireInfo.nom}</Text>
              <Text style={{ color: t.sub, fontSize: F.xs }}>Utilisateur Zevo vérifié ✓</Text>
            </View>
          </Card>
        )}

        {/* Wallet source */}
        {wallets.length > 0 && (
          <>
            <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginTop: 20, marginBottom: 12 }}>PAYER DEPUIS</Text>
            <View style={{ gap: 10 }}>
              {wallets.map(w => (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => setWalletSource(w)}
                  activeOpacity={0.85}
                  style={{
                    borderRadius: 16, padding: 16,
                    backgroundColor: walletSource?.id === w.id ? '#0A5C3C' : t.card,
                    borderWidth: 1.5,
                    borderColor: walletSource?.id === w.id ? '#0A5C3C' : t.border,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    elevation: walletSource?.id === w.id ? 6 : 2,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: F.md, fontWeight: '600', color: walletSource?.id === w.id ? '#fff' : t.text }}>{w.nom}</Text>
                    <Text style={{ fontSize: F.xs, color: walletSource?.id === w.id ? 'rgba(255,255,255,0.7)' : t.sub }}>Solde: {w.solde} CDF</Text>
                  </View>
                  {walletSource?.id === w.id && <Text style={{ color: '#fff', fontSize: 18 }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {wallets.length === 0 && (
          <Card theme={t} style={{ marginTop: 16 }}>
            <Text style={{ color: t.sub, textAlign: 'center' }}>Aucun wallet — ajoutez-en un d'abord !</Text>
          </Card>
        )}

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          {erreur ? <Text style={{ color: C.neg, fontSize: F.xs, marginBottom: 12, textAlign: 'center' }}>{erreur}</Text> : null}
          <BtnPrimary
            label="Envoyer"
            loading={chargement}
            onPress={async () => {
              if (!montant || !destinataire || !walletSource) {
                setErreur('Veuillez remplir tous les champs');
                return;
              }
              setChargement(true);
              setErreur('');
              try {
               const reseau = walletSource.type_wallet === 'orange' ? 'ORANGE' : 'MTN';
    const destinataireComplet = `+${callingCode}${destinataire}`;
                const result = await payerMobileMoney(
                  destinataireComplet,
                  Number(montant),
                  reseau,
                  `ZEVO-${Date.now()}`
                );
                if (result.succes) {
                setEtape('confirmation');
                  setCountdown(120);  
                } else {
                  setErreur(result.erreur || 'Erreur de paiement');
                }
              } catch (e) {
                setErreur('Erreur de connexion au serveur');
              } finally {
                setChargement(false);
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// ============================================
// ÉCRAN TRANSFERTS
// ============================================
function EcranTransferts({ isDark, onTransaction }: { isDark: boolean, onTransaction: () => void }) {
  const [tab, setTab] = useState('tous');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const t = useTheme();

  const tabItems = [
    { id: 'tous', label: 'Tous' },
    { id: 'envoye', label: 'Envoyé' },
    { id: 'recu', label: 'Reçu' },
  ];

  useEffect(() => {
    async function chargerTransactions() {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) {
          const result = await getTransactions(user.id, 50);
          if (result.succes) setTransactions(result.data.transactions);
        }
      } catch (e) {
        console.log('Erreur chargement transactions:', e);
      } finally {
        setChargement(false);
      }
    }
    chargerTransactions();
  }, []);

  const transactionsFiltrees = transactions.filter(tx => {
    if (tab === 'tous') return true;
    if (tab === 'envoye') return tx.type === 'envoi' || tx.expediteur_id;
    if (tab === 'recu') return tx.type === 'reception' || tx.destinataire_id;
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <DecoBg/>
      <View style={{ padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border, gap: 6 }}>
        <LogoZevo size={18} />
        <Text style={{ fontSize: 26, fontWeight: '800', color: t.text, letterSpacing: -0.5 }}>Transferts</Text>
      </View>

      <Tabs items={tabItems} active={tab} onChange={setTab} theme={t} />

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <BtnPrimary label="+ Nouveau transfert" onPress={onTransaction} />
      </View>

      <ScrollView>
        {chargement ? (
          <Text style={{ color: t.sub, textAlign: 'center', marginTop: 24 }}>Chargement...</Text>
        ) : transactionsFiltrees.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: t.sub, fontSize: F.sm, textAlign: 'center' }}>
              Aucune transaction pour l'instant
            </Text>
          </View>
        ) : (
          <Card theme={t} style={{ marginHorizontal: 16, padding: 0 }}>
            {transactionsFiltrees.map((tx, i) => (
              <View key={tx.id} style={{ 
                flexDirection: 'row', alignItems: 'center', padding: 16, 
                borderBottomWidth: i < transactionsFiltrees.length - 1 ? 0.5 : 0, 
                borderBottomColor: t.border 
              }}>
                <View style={{ 
                  width: 40, height: 40, borderRadius: 20, 
                  backgroundColor: tx.expediteur_id ? '#FFE8E8' : '#E8FFE8', 
                  alignItems: 'center', justifyContent: 'center', marginRight: 12 
                }}>
                  <Text>{tx.expediteur_id ? '↑' : '↓'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: F.md, fontWeight: '600', color: t.text }}>
                    {tx.nom_destinataire || tx.nom_expediteur || tx.description || 'Transaction'}
                  </Text>
                  <Text style={{ fontSize: F.xs, color: t.sub }}>
                    {new Date(tx.created_at).toLocaleDateString('fr-FR')} · {tx.type}
                  </Text>
                </View>
                <Text style={{ 
                  fontSize: F.md, fontWeight: '700', 
                  color: tx.expediteur_id ? C.neg : C.pos 
                }}>
                  {tx.expediteur_id ? '-' : '+'}{tx.montant} {tx.devise}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================
// ÉCRAN PAYER
// ============================================
function EcranPayer({ isDark, onTransaction }: { isDark: boolean, onTransaction: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);

useEffect(() => {
  async function chargerUser() {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      const result = await getWallets(userData.id);
      if (result.succes) setWallets(result.data.wallets);
    }
  }
  chargerUser();
}, []);
  const [tab, setTab] = useState('payer');
  const [walletQR, setWalletQR] = useState('mpesa');
  const t = useTheme();

  const tabItems = [
    { id: 'payer', label: 'Payer' },
    { id: 'monqr', label: 'Mon QR' },
  ];
const walletItems = wallets.length > 0 
    ? wallets.map(w => ({ id: w.type_wallet, label: w.nom }))
    : [{ id: 'default', label: 'Mon wallet' }];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <DecoBg/>
      <View style={{ padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border, gap: 6 }}>
        <LogoZevo size={18} />
        <Text style={{ fontSize: 26, fontWeight: '800', color: t.text, letterSpacing: -0.5 }}>Payer</Text>
      </View>

      <Tabs items={tabItems} active={tab} onChange={setTab} theme={t} />

      {tab === 'payer' && (
        <ScrollView>
          <View style={{ padding: 16, gap: 12 }}>
            <BtnPrimary label="Scanner un QR Code" onPress={onTransaction} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
              <Text style={{ color: t.sub, fontSize: F.sm }}>ou</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
            </View>
            <BtnOutline label="Entrer un numéro" onPress={onTransaction} />

            <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginTop: 8 }}>MARCHANDS POPULAIRES</Text>
            <Card theme={t} style={{ padding: 0 }}>
              {[
                { nom: 'Shoprite Kinshasa', cat: 'Grande distribution' },
                { nom: 'Total Energies', cat: 'Station-service' },
                { nom: 'Pharmacie Centrale', cat: 'Santé' },
                { nom: 'UNIKIN', cat: 'Éducation' },
              ].map((m, i, arr) => (
                <TouchableOpacity key={m.nom} onPress={onTransaction} activeOpacity={0.75}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 0.5 : 0, borderBottomColor: t.border }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: F.md, fontWeight: '600', color: t.text }}>{m.nom}</Text>
                    <Text style={{ fontSize: F.xs, color: t.sub, marginTop: 2 }}>{m.cat}</Text>
                  </View>
                  <Text style={{ color: t.sub, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        </ScrollView>
      )}

     {tab === 'monqr' && (
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 24 }}>
          <Card theme={t} style={{ width: 190, height: 190, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
           <QRCode
  value={user ? JSON.stringify({ id: user.id, nom: user.nom, telephone: user.telephone }) : 'zevo'}
  size={160}
  color={C.p1}
  backgroundColor="transparent"
/>
          </Card>

          <Text style={{ fontSize: F.lg, fontWeight: '600', color: t.text, marginBottom: 4 }}>{user ? user.nom : ''}</Text>
          <Text style={{ fontSize: F.sm, color: t.sub, marginBottom: 20 }}>{user ? user.telephone : ''}</Text>

          {wallets.length === 0 ? (
            <Card theme={t} style={{ width: '100%', padding: 16, marginBottom: 16, backgroundColor: t.isDark ? 'rgba(255,159,10,0.1)' : '#FFF8E8' }}>
              <Text style={{ color: t.text, fontSize: F.sm, textAlign: 'center' }}>
                ⚠️ Ajoutez un wallet pour recevoir de l'argent
              </Text>
            </Card>
          ) : (
            <>
              <Tabs items={walletItems} active={walletQR} onChange={setWalletQR} theme={t} />
              <Text style={{ fontSize: F.xs, color: t.sub, textAlign: 'center', marginTop: 12, marginBottom: 16, lineHeight: 18 }}>
                Votre wallet par défaut reçoit l'argent. Vous pouvez le changer à tout moment dans Wallets.
              </Text>
            </>
          )}

          <Text style={{ fontSize: F.xs, color: t.sub, textAlign: 'center', marginVertical: 16, lineHeight: 18 }}>
            Partage ce QR pour recevoir depuis n'importe quel réseau
          </Text>

          <View style={{ width: '100%', gap: 10 }}>
            <BtnPrimary label="Partager mon QR" onPress={() => {}} />
            <BtnOutline label="Télécharger pour impression" onPress={() => {}} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

// ============================================
// ÉCRAN AJOUTER WALLET
// ============================================
function EcranAjouterWallet({ onRetour }: { onRetour: () => void }) {
  const t = useTheme();
  const [typeWallet, setTypeWallet] = useState('');
  const [nom, setNom] = useState('');
  const [numero, setNumero] = useState('');
  const [countryCode, setCountryCode] = useState<any>('CI');
const [callingCode, setCallingCode] = useState('225');
const [afficherPays, setAfficherPays] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [etape, setEtape] = useState<'formulaire' | 'verification'>('formulaire');
  const [countdown, setCountdown] = useState(120);
  const [typesWallets, setTypesWallets] = useState<any[]>([]);

  useEffect(() => {
    if (etape === 'verification') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setEtape('formulaire');
            setErreur('Délai dépassé — réessayez');
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [etape]);
const types = typesWallets.length > 0 
    ? typesWallets.map(tw => ({
        id: tw.code,
        label: tw.label,
        bg: tw.couleur,
      }))
    : [
        { id: 'orange', label: 'Orange Money CI', bg: '#FF6600' },
        { id: 'mtn',    label: 'MTN MoMo CI',     bg: '#FFCC00' },
        { id: 'moov',   label: 'Moov Money CI',   bg: '#0066B3' },
        { id: 'mpesa',  label: 'M-Pesa (bientôt disponible)', bg: '#0A5C3C' },
        { id: 'banque', label: 'Compte bancaire',  bg: '#0A2A6E' },
      ];

  if (etape === 'verification') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <DecoBg />
        <LogoZevo size={32} />
        <Text style={{ fontSize: F.xl, fontWeight: '700', color: t.text, marginTop: 24, textAlign: 'center' }}>
          Confirmez sur votre téléphone
        </Text>
        <Text style={{ fontSize: F.sm, color: t.sub, marginTop: 8, textAlign: 'center' }}>
          Une notification M-Pesa a été envoyée sur {numero}
        </Text>
        <View style={{
          width: 120, height: 120, borderRadius: 60,
          borderWidth: 2, borderColor: countdown > 30 ? C.p1 : C.neg,
          alignItems: 'center', justifyContent: 'center',
          marginTop: 40,
        }}>
          <Text style={{ fontSize: 36, fontWeight: '800', color: countdown > 30 ? C.p1 : C.neg }}>
            {countdown}
          </Text>
          <Text style={{ fontSize: F.xs, color: t.sub }}>secondes</Text>
        </View>
        <Text style={{ color: t.sub, fontSize: F.xs, marginTop: 32, textAlign: 'center' }}>
          1 CDF sera débité pour vérification
        </Text>
        <TouchableOpacity onPress={() => { setEtape('formulaire'); setCountdown(120); }} style={{ marginTop: 24 }}>
          <Text style={{ color: C.neg, fontSize: F.sm }}>Annuler</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
      <DecoBg />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border }}>
        <TouchableOpacity onPress={onRetour} style={{ marginRight: 16 }}>
          <Text style={{ color: C.p1, fontSize: F.lg }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: F.xl, fontWeight: '800', color: t.text }}>Ajouter un wallet</Text>
      </View>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginBottom: 12 }}>TYPE DE WALLET</Text>
        <View style={{ gap: 10, marginBottom: 24 }}>
       {types.map(type => (
            <TouchableOpacity
              key={type.id}
              disabled={type.id === 'mpesa'}
              onPress={() => { 
                if (type.id === 'mpesa') return;
                setTypeWallet(type.id); 
                setNom(type.label); 
              }}
              activeOpacity={0.85}
              style={{
                borderRadius: 16, padding: 16,
                backgroundColor: typeWallet === type.id ? type.bg : t.card,
                borderWidth: 1.5,
                borderColor: typeWallet === type.id ? type.bg : t.border,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                elevation: typeWallet === type.id ? 6 : 2,
                opacity: type.id === 'mpesa' ? 0.4 : 1,
              }}
            >
              <Text style={{ fontSize: F.md, fontWeight: '600', color: typeWallet === type.id ? '#fff' : t.text }}>
                {type.label}
              </Text>
              {typeWallet === type.id && <Text style={{ color: '#fff', fontSize: 18 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
        {typeWallet !== '' && (
          <>
            <Text style={{ fontSize: F.xs, color: t.sub, fontWeight: '700', letterSpacing: 1, marginBottom: 12 }}>NUMÉRO</Text>
        {typeWallet !== 'banque' && (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
    <TouchableOpacity
      onPress={() => setAfficherPays(true)}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: t.card, borderWidth: 1, borderColor: t.border,
        borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
        marginRight: 8,
      }}
    >
      <CountryPicker
        countryCode={countryCode}
        withFlag
        withCallingCode
        withEmoji
        onSelect={(country) => {
          setCountryCode(country.cca2);
          setCallingCode(country.callingCode[0]);
        }}
        visible={afficherPays}
        onClose={() => setAfficherPays(false)}
      />
<Text style={{ color: t.text, fontWeight: '600', marginLeft: 4 }}>
  {callingCode ? `+${callingCode}` : 'Choisir code du pays'}
</Text>
    </TouchableOpacity>
  </View>
)}
<InputField
  label={typeWallet === 'banque' ? 'Numéro de compte' : 'Numéro de téléphone'}
  placeholder={typeWallet === 'banque' ? `${countryCode}00 0000 0000 0000` : 'Ex: 812345678'}
  value={numero}
  onChange={setNumero}
  keyType={typeWallet === 'banque' ? 'default' : 'phone-pad'}
  theme={t}
/>
            <View style={{ marginTop: 16 }}>
              {erreur ? <Text style={{ color: C.neg, fontSize: F.xs, marginBottom: 12, textAlign: 'center' }}>{erreur}</Text> : null}
              <BtnPrimary
                label="Vérifier et ajouter"
                loading={chargement}
                onPress={async () => {
                  if (!typeWallet || !numero) {
                    setErreur('Veuillez choisir un type et entrer un numéro');
                    return;
                  }
                  setChargement(true);
                  setErreur('');
                  try {
                    const userStr = await AsyncStorage.getItem('user');
                    const user = userStr ? JSON.parse(userStr) : null;
              if (user) {
                      if (typeWallet !== 'banque') {
                     const numeroComplet = `+${callingCode}${numero}`;
const result = await verifierWalletMpesa(user.id, numeroComplet, nom, typeWallet, numeroComplet);
                        if (result.succes) {
                          setEtape('verification');
                          setCountdown(120);
                          Vibration.vibrate(200);
                        } else {
                          setErreur(result.erreur);
                        }
                      } else {
                        const result = await ajouterWallet(user.id, nom, typeWallet, numero);
                        if (result.succes) onRetour();
                        else setErreur(result.erreur);
                      }
                    }
                  } catch (e) {
                    setErreur('Erreur lors de la vérification');
                  } finally {
                    setChargement(false);
                  }
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================
// ÉCRAN WALLETS
// ============================================
function EcranWallets({ isDark }: { isDark: boolean }) {
  const [afficherAjouter, setAfficherAjouter] = useState(false);
  const t = useTheme();
  const [wallets, setWallets] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);

 const couleurs: any = {
    'orange':  { bg: '#FF6600', accent: 'rgba(255,255,255,0.15)' },
    'mtn':     { bg: '#FFCC00', accent: 'rgba(0,0,0,0.10)' },
    'moov':    { bg: '#0066B3', accent: 'rgba(255,255,255,0.12)' },
    'mpesa':   { bg: '#0A5C3C', accent: 'rgba(255,255,255,0.15)' },
    'banque':  { bg: '#0A2A6E', accent: 'rgba(255,255,255,0.12)' },
    'default': { bg: '#1A1A2E', accent: 'rgba(255,255,255,0.10)' },
  };

  useEffect(() => {
    async function chargerWallets() {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) {
          const result = await getWallets(user.id);
          if (result.succes) {
            setWallets(result.data.wallets);
          }
        }
      } catch (e) {
        console.log('Erreur chargement wallets:', e);
      } finally {
        setChargement(false);
      }
    }
    chargerWallets();
  }, []);

  const getCouleur = (type: string) => couleurs[type] || couleurs['default'];

  if (afficherAjouter) {
    return <EcranAjouterWallet onRetour={() => setAfficherAjouter(false)} />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} showsVerticalScrollIndicator={false}>
      <DecoBg />
      <View style={{ padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border, gap: 6 }}>
        <LogoZevo size={18} />
        <Text style={{ fontSize: 26, fontWeight: '800', color: t.text, letterSpacing: -0.5 }}>Mes Wallets</Text>
      </View>

      <View style={{ padding: 16, gap: 14 }}>
        {chargement ? (
          <Text style={{ color: t.sub, textAlign: 'center', marginTop: 20 }}>Chargement...</Text>
        ) : wallets.length === 0 ? (
          <Text style={{ color: t.sub, textAlign: 'center', marginTop: 20 }}>
            Aucun wallet — ajoutez-en un !
          </Text>
        ) : (
          wallets.map(w => {
            const c = getCouleur(w.type_wallet);
            return (
              <TouchableOpacity key={w.id} activeOpacity={0.85} style={{
                borderRadius: 22, padding: 22, backgroundColor: c.bg, overflow: 'hidden',
                shadowColor: c.bg, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
              }}>
                <View style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: c.accent }} />
                <View style={{ position: 'absolute', right: 20, bottom: -20, width: 70, height: 70, borderRadius: 35, backgroundColor: c.accent }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: F.xs, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 }}>
                      {w.nom.toUpperCase()}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 }}>
                      {w.solde.toLocaleString()}
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: F.sm, fontWeight: '300' }}>CDF</Text>
                    {w.est_defaut && (
                      <View style={{ marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' }}>
                        <Text style={{ color: '#fff', fontSize: F.xs }}>Défaut</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22 }}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <BtnOutline label="+ Ajouter un wallet" onPress={() => setAfficherAjouter(true)} />
      </View>
    </ScrollView>
  );
}
// ============================================
// ÉCRAN CHANGER PIN
// ============================================
function EcranChangerPin({ onRetour, userId }: { onRetour: () => void, userId: number }) {
  const t = useTheme();
  const [ancienPin, setAncienPin] = useState('');
  const [nouveauPin, setNouveauPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [etape, setEtape] = useState<'ancien' | 'nouveau' | 'confirmer'>('ancien');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  function secouer() {
    Animated.sequence([
      Animated.timing(shake, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -12, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  async function appuyer(c: string) {
    setErreur('');
    if (etape === 'ancien') {
      if (ancienPin.length >= 6) return;
      const p = ancienPin + c;
      setAncienPin(p);
      if (p.length === 6) {
        setTimeout(async () => {
          setChargement(true);
          const result = await verifierPin(userId, p);
          setChargement(false);
          if (result.succes) {
            setEtape('nouveau');
          } else {
            setErreur('PIN incorrect');
            secouer();
            setAncienPin('');
          }
        }, 200);
      }
    } else if (etape === 'nouveau') {
      if (nouveauPin.length >= 6) return;
      const p = nouveauPin + c;
      setNouveauPin(p);
      if (p.length === 6) {
        setTimeout(() => setEtape('confirmer'), 300);
      }
    } else {
      if (confirmPin.length >= 6) return;
      const p = confirmPin + c;
      setConfirmPin(p);
      if (p.length === 6) {
        setTimeout(async () => {
          if (p !== nouveauPin) {
            setErreur('Les PIN ne correspondent pas');
            secouer();
            setConfirmPin('');
            return;
          }
          setChargement(true);
          await creerPin(userId, nouveauPin);
          setChargement(false);
          onRetour();
        }, 300);
      }
    }
  }

  function effacer() {
    if (etape === 'ancien') setAncienPin(ancienPin.slice(0, -1));
    else if (etape === 'nouveau') setNouveauPin(nouveauPin.slice(0, -1));
    else setConfirmPin(confirmPin.slice(0, -1));
  }

  const pinActuel = etape === 'ancien' ? ancienPin : etape === 'nouveau' ? nouveauPin : confirmPin;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <DecoBg />
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />

      <TouchableOpacity onPress={onRetour} style={{ position: 'absolute', top: 40, left: 24 }}>
        <Text style={{ color: C.p1, fontSize: F.lg }}>←</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginBottom: 48 }}>
        <LogoZevo size={32} />
        <Text style={{ fontSize: F.xl, fontWeight: '700', color: t.text, marginTop: 20 }}>
          {etape === 'ancien' ? 'Entrez votre ancien PIN' : etape === 'nouveau' ? 'Nouveau PIN' : 'Confirmez le nouveau PIN'}
        </Text>
        {erreur ? <Text style={{ color: C.neg, fontSize: F.xs, marginTop: 8 }}>{erreur}</Text> : null}
      </View>

      <Animated.View style={{ flexDirection: 'row', gap: 16, marginBottom: 52, transform: [{ translateX: shake }] }}>
        {[0,1,2,3,4,5].map(i => (
          <View key={i} style={{
            width: 14, height: 14, borderRadius: 7,
            backgroundColor: i < pinActuel.length ? C.p1 : 'transparent',
            borderWidth: 1.5,
            borderColor: i < pinActuel.length ? C.p1 : t.sub,
            elevation: i < pinActuel.length ? 3 : 0,
          }} />
        ))}
      </Animated.View>

      <View style={{ width: '100%', gap: 12 }}>
        {[['1','2','3'],['4','5','6'],['7','8','9']].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
            {row.map(k => (
              <TouchableOpacity key={k} onPress={() => appuyer(k)} activeOpacity={0.75} style={{
                width: 78, height: 78, borderRadius: 39,
                backgroundColor: t.card, alignItems: 'center', justifyContent: 'center',
                elevation: 4, borderWidth: 1, borderColor: t.border,
              }}>
                <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>{k}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
          <View style={{ width: 78, height: 78 }} />
          <TouchableOpacity onPress={() => appuyer('0')} activeOpacity={0.75} style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={effacer} activeOpacity={0.75} style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: t.border }}>
            <Text style={{ fontSize: 22, fontWeight: '300', color: t.text }}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ============================================
// ÉCRAN PROFIL
// ============================================
function EcranProfil({ isDark, onDeconnexion }: { isDark: boolean, onDeconnexion: () => void }) {
const [user, setUser] = useState<any>(null);
const [wallets, setWallets] = useState<any[]>([]);
const [photoUri, setPhotoUri] = useState<string | null>(null);
const [afficherChangerPin, setAfficherChangerPin] = useState(false);
const [afficherModifierProfil, setAfficherModifierProfil] = useState(false);
const [nouveauNom, setNouveauNom] = useState('');
const t = useTheme();

useEffect(() => {
  async function chargerUser() {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
    const photo = await AsyncStorage.getItem('photoUri');
    if (photo) setPhotoUri(photo);
  }
  chargerUser();
}, []);

const choisirPhoto = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });
  if (result.assets && result.assets[0]?.uri) {
    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    await AsyncStorage.setItem('photoUri', uri);
  }
};
const prenomNom = user ? user.nom.split(' ')[0] : 'Utilisateur';

if (afficherChangerPin) {
    return <EcranChangerPin 
      onRetour={() => setAfficherChangerPin(false)} 
      userId={user?.id} 
    />;
  }

  if (afficherModifierProfil) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />
        <DecoBg />
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border }}>
          <TouchableOpacity onPress={() => setAfficherModifierProfil(false)} style={{ marginRight: 16 }}>
            <Text style={{ color: C.p1, fontSize: F.lg }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: F.xl, fontWeight: '800', color: t.text }}>Modifier le profil</Text>
        </View>
        <ScrollView style={{ padding: 16 }}>
          <InputField 
            label="Nom complet" 
            placeholder={user?.nom || 'Votre nom'} 
            value={nouveauNom} 
            onChange={setNouveauNom} 
            theme={t} 
          />
          <View style={{ marginTop: 24 }}>
            <BtnPrimary
              label="Enregistrer"
              onPress={async () => {
                if (!nouveauNom.trim()) return;
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                  const userData = JSON.parse(userStr);
                  userData.nom = nouveauNom;
                 await AsyncStorage.setItem('user', JSON.stringify(userData));
                  setUser(userData);
                  // Mettre à jour dans Supabase via le backend
                  try {
                    await fetch(`http://10.225.21.218:3000/auth/modifier-profil`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ user_id: userData.id, nom: nouveauNom }),
                    });
                 } catch (e) {}
                  setUser({...user, nom: nouveauNom});
                  setAfficherModifierProfil(false);
                }
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

if (afficherChangerPin) {
    return <EcranChangerPin 
      onRetour={() => setAfficherChangerPin(false)} 
      userId={user?.id} 
    />;
  }

const options = [
   { label: 'Modifier le profil', action: () => setAfficherModifierProfil(true) },
   { label: 'Sécurité & PIN', action: () => setAfficherChangerPin(true) },
    { label: 'Limites de transaction', action: () => {} },
    { label: 'Notifications', action: () => {} },
    { label: 'Langue', action: () => {} },
    { label: 'Accessibilité', action: () => {} },
    { label: 'Aide & Support', action: () => {} },
    { label: 'Se déconnecter', action: onDeconnexion },
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} showsVerticalScrollIndicator={false}>
      <DecoBg/>
      <View style={{ padding: 20, paddingTop: 28, borderBottomWidth: 0.5, borderBottomColor: t.border, gap: 6 }}>
        <LogoZevo size={18} />
        <Text style={{ fontSize: 26, fontWeight: '800', color: t.text, letterSpacing: -0.5 }}>Profil</Text>
      </View>

      {/* Hero profil */}
     <View style={{ alignItems: 'center', padding: 28, borderBottomWidth: 0.5, borderBottomColor: t.border }}>
        <TouchableOpacity onPress={choisirPhoto} style={{
          width: 76, height: 76, borderRadius: 38,
          backgroundColor: C.p1, alignItems: 'center', justifyContent: 'center',
          marginBottom: 14, shadowColor: C.p1,
          shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
          overflow: 'hidden',
        }}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: 76, height: 76, borderRadius: 38 }} />
          ) : (
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>{user ? user.nom.charAt(0).toUpperCase() : 'Z'}</Text>
          )}
        </TouchableOpacity>
        <Text style={{ fontSize: F.xs, color: t.sub, marginBottom: 8 }}>Appuyer pour changer la photo</Text>
        <Text style={{ fontSize: F.xl, fontWeight: '800', color: t.text, letterSpacing: -0.3 }}>{prenomNom}</Text>
        <Text style={{ fontSize: F.sm, color: t.sub, marginTop: 4, marginBottom: 14 }}>{user ? user.telephone : ''}</Text>
        <View style={{ backgroundColor: '#E8FFF5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 }}>
          <Text style={{ color: '#085041', fontSize: F.xs, fontWeight: '700' }}>KYC Vérifié ✓</Text>
        </View>
      </View>
      <View style={{ padding: 16, gap: 8 }}>
  {options.map(opt => (
          <TouchableOpacity
            key={opt.label}
            onPress={opt.action}
            activeOpacity={0.75}
          >
            <Card theme={t} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
              <Text style={{ fontSize: F.md, color: opt.label === 'Se déconnecter' ? C.neg : t.text, fontWeight: '500' }}>{opt.label}</Text>
              <Text style={{ color: t.sub, fontSize: 18 }}>›</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ============================================
// NAVBAR
// ============================================
function Navbar({ active, onChange, isDark }: { active: string, onChange: (s: string) => void, isDark: boolean }) {
  const t = useTheme();

  const items = [
    { id: 'accueil',    label: 'Accueil',    icon: '⌂' },
    { id: 'transferts', label: 'Transferts', icon: '⇄' },
    { id: 'payer',      label: 'Payer',      icon: '⊡' },
    { id: 'wallets',    label: 'Wallets',    icon: '▤' },
    { id: 'profil',     label: 'Profil',     icon: '◯' },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: t.card,
      borderTopWidth: 0.5,
      borderTopColor: t.border,
      paddingBottom: 8, paddingTop: 8,
      shadowColor: t.shadowD,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    }}>
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 }}
          onPress={() => onChange(item.id)}
          activeOpacity={0.75}
        >
          {active === item.id && (
            <View style={{ position: 'absolute', top: 0, width: 4, height: 4, borderRadius: 2, backgroundColor: C.p1 }} />
          )}
          <Text style={{ fontSize: 20, color: active === item.id ? C.p1 : t.sub }}>{item.icon}</Text>
          <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 0.3, color: active === item.id ? C.p1 : t.sub }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================
// APP
// ============================================
export default function App() {
  const [pinOk, setPinOk] = useState(false);
  const [afficherEnvoyer, setAfficherEnvoyer] = useState(false);
  const [screen, setScreen] = useState('accueil');
  const [succesVisible, setSuccesVisible] = useState(false); 
  const [ecranAuth, setEcranAuth] = useState<'connexion' | 'inscription' | 'creerPin' | null>('connexion');
  const [loading, setLoading] = useState(true);
  const t = useTheme();

  useEffect(() => {
    async function check() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) setEcranAuth(null);
      } catch (e) {
        console.log('AsyncStorage error:', e);
      } finally {
        setLoading(false);
      }
    }
    check();
    // Demander permission notifications
async function setupNotifications() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  if (enabled) {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    await AsyncStorage.setItem('fcmToken', token);
  }
}
setupNotifications();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
        <LogoZevo size={40} />
      </SafeAreaView>
    );
  }

  if (ecranAuth === 'connexion') return <EcranConnexion onConnexion={() => setEcranAuth(null)} onInscription={() => setEcranAuth('inscription')} />;
  if (ecranAuth === 'inscription') return <EcranInscription onInscription={() => setEcranAuth('creerPin')} onConnexion={() => setEcranAuth('connexion')} />;
  if (ecranAuth === 'creerPin') return <EcranCreerPin onSuccess={() => setEcranAuth(null)} />;
  if (!pinOk) return <EcranPin 
  onSuccess={() => setPinOk(true)} 
  onRetourConnexion={() => setEcranAuth('connexion')} 
/>;
  if (afficherEnvoyer) return <EcranEnvoyer onRetour={() => setAfficherEnvoyer(false)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.bg} />

      {screen === 'accueil'    && <EcranAccueil    isDark={t.isDark} onTransaction={() => setAfficherEnvoyer(true)} onNaviguer={setScreen} />}
      {screen === 'transferts' && <EcranTransferts isDark={t.isDark} onTransaction={() => setAfficherEnvoyer(true)} />}
      {screen === 'payer'      && <EcranPayer      isDark={t.isDark} onTransaction={() => setSuccesVisible(true)} />}
      {screen === 'wallets'    && <EcranWallets    isDark={t.isDark} />}
      {screen === 'profil'     && <EcranProfil     isDark={t.isDark} onDeconnexion={async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setPinOk(false);
        setEcranAuth('connexion');
      }} />}

      <Navbar active={screen} onChange={setScreen} isDark={t.isDark} />
      <AnimationSucces visible={succesVisible} onFin={() => setSuccesVisible(false)} />
    </SafeAreaView>
  );
}