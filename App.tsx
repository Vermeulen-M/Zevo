// ============================================
// ZEVO — App.tsx v4
// Payer avec 2 onglets + structure finale
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Animated,
  TextInput,
} from 'react-native';

const COLORS = {
  primary: '#0A84FF',
  lightBg: '#FFFFFF',
  lightBgSecondary: '#F2F2F7',
  lightText: '#111111',
  lightTextSecondary: '#666666',
  lightBorder: '#E5E5EA',
  darkBg: '#000000',
  darkBgSecondary: '#1C1C1E',
  darkText: '#FFFFFF',
  darkTextSecondary: '#ABABAB',
  darkBorder: '#2C2C2E',
  positive: '#34C759',
  negative: '#FF3B30',
};
// ============================================
// ÉCRAN CONNEXION
// ============================================
function EcranConnexion({ onConnexion, onInscription }: { onConnexion: () => void, onInscription: () => void }) {
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const bgSecondary = isDark ? COLORS.darkBgSecondary : COLORS.lightBgSecondary;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  return (
    <SafeAreaView style={[styles.pinContainer, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <LogoZevo taille={48} />
        <Text style={[styles.pinSousTitre, { color: textSecondary, marginTop: 8 }]}>
          Paiements simples pour tous
        </Text>
      </View>
      <View style={[styles.champCont, { backgroundColor: bgSecondary, borderColor: border }]}>
        <Text style={[styles.champLabel, { color: textSecondary }]}>Email ou numéro de téléphone</Text>
        <TextInput
         style={[styles.champInput, { color: text }]}
  placeholder="email@exemple.com ou +243 8X..."
  placeholderTextColor={textSecondary}
  autoCapitalize="none"
  value={telephone}
  onChangeText={setTelephone}
/>
      </View>
      <View style={[styles.champCont, { backgroundColor: bgSecondary, borderColor: border, marginTop: 12 }]}>
    
<Text style={[styles.champLabel, { color: textSecondary }]}>Mot de passe</Text>
<TextInput
  style={[styles.champInput, { color: text }]}
  placeholder="••••••••"
  placeholderTextColor={textSecondary}
  secureTextEntry
  value={motDePasse}
  onChangeText={setMotDePasse}
/>
      </View>
      <TouchableOpacity style={[styles.payerBouton, { backgroundColor: COLORS.primary, marginTop: 24, width: '100%' }]} onPress={onConnexion} activeOpacity={0.8}>
        <Text style={styles.payerBoutonTexte}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onInscription} style={{ marginTop: 20 }}>
        <Text style={{ color: COLORS.primary, fontSize: 14 }}>
          Pas encore de compte ? <Text style={{ fontWeight: '600' }}>S'inscrire</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ============================================
// ÉCRAN INSCRIPTION
// ============================================
function EcranInscription({ onInscription, onConnexion }: { onInscription: () => void, onConnexion: () => void }) {
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const bgSecondary = isDark ? COLORS.darkBgSecondary : COLORS.lightBgSecondary;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  return (
    <SafeAreaView style={[styles.pinContainer, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <LogoZevo taille={40} />
        <Text style={[{ color: text, fontSize: 20, fontWeight: '600', marginTop: 8 }]}>
          Créer un compte
        </Text>
      </View>
      <View style={[styles.champCont, { backgroundColor: bgSecondary, borderColor: border }]}>
        <Text style={[styles.champLabel, { color: textSecondary }]}>Nom complet</Text>
        <TextInput
          style={[styles.champInput, { color: text }]}
          placeholder="Jean Kabila"
          placeholderTextColor={textSecondary}
          value={nom}
          onChangeText={setNom}
        />
      </View>
      <View style={[styles.champCont, { backgroundColor: bgSecondary, borderColor: border, marginTop: 12 }]}>
        <Text style={[styles.champLabel, { color: textSecondary }]}>Numéro de téléphone</Text>
        <TextInput
          style={[styles.champInput, { color: text }]}
          placeholder="+243 8X XXX XXXX"
          placeholderTextColor={textSecondary}
          keyboardType="phone-pad"
          value={telephone}
          onChangeText={setTelephone}
        />
      </View>
      <View style={[styles.champCont, { backgroundColor: bgSecondary, borderColor: border, marginTop: 12 }]}>
        <Text style={[styles.champLabel, { color: textSecondary }]}>Mot de passe</Text>
        <TextInput
          style={[styles.champInput, { color: text }]}
          placeholder="••••••••"
          placeholderTextColor={textSecondary}
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
        />
      </View>
      <TouchableOpacity style={[styles.payerBouton, { backgroundColor: COLORS.primary, marginTop: 24, width: '100%' }]} onPress={onInscription} activeOpacity={0.8}>
        <Text style={styles.payerBoutonTexte}>Créer mon compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onConnexion} style={{ marginTop: 20 }}>
        <Text style={{ color: COLORS.primary, fontSize: 14 }}>
          Déjà un compte ? <Text style={{ fontWeight: '600' }}>Se connecter</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
// ============================================
// LOGO ZEVO
// ============================================
function LogoZevo({ taille = 32, couleur = COLORS.primary }: { taille?: number, couleur?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.logoZ, { fontSize: taille, color: couleur, transform: [{ skewX: '-12deg' }] }]}>Z</Text>
      <Text style={[styles.logoTexte, { fontSize: taille * 0.85, color: couleur }]}>evo</Text>
    </View>
  );
}

// ============================================
// ANIMATION SUCCÈS
// ============================================
function AnimationSucces({ visible, onFin }: { visible: boolean, onFin: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(1500),
        Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onFin());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.succesOverlay, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.succesCercle, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.succesCheck}>✓</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ============================================
// ÉCRAN PIN
// ============================================


function EcranPin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const bgSecondary = isDark ? COLORS.darkBgSecondary : COLORS.lightBgSecondary;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;

  function secouer() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function appuyerChiffre(chiffre: string) {
    if (pin.length >= 6) return;
    const nouveauPin = pin + chiffre;
    setPin(nouveauPin);
    if (nouveauPin.length === 6) {
      setTimeout(() => {
        if (nouveauPin === '000000') {
          onSuccess();
        } else {
          secouer();
          setPin('');
        }
      }, 300);
    }
  }

  function effacer() { setPin(pin.slice(0, -1)); }

  return (
    <SafeAreaView style={[styles.pinContainer, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <View style={styles.pinHeader}>
        <LogoZevo taille={40} />
        <Text style={[styles.pinTitre, { color: text }]}>Entrez votre PIN</Text>
        <Text style={[styles.pinSousTitre, { color: textSecondary }]}>6 chiffres pour accéder à votre compte</Text>
      </View>
      <Animated.View style={[styles.pinPoints, { transform: [{ translateX: shakeAnim }] }]}>
        {[0,1,2,3,4,5].map((index) => (
          <View key={index} style={[styles.pinPoint, {
            backgroundColor: index < pin.length ? COLORS.primary : 'transparent',
            borderColor: index < pin.length ? COLORS.primary : textSecondary,
          }]} />
        ))}
      </Animated.View>
      <View style={styles.clavier}>
        {[['1','2','3'],['4','5','6'],['7','8','9']].map((rangee, i) => (
          <View key={i} style={styles.clavierRangee}>
            {rangee.map((chiffre) => (
              <TouchableOpacity key={chiffre} style={[styles.clavierTouche, { backgroundColor: bgSecondary }]} onPress={() => appuyerChiffre(chiffre)} activeOpacity={0.7}>
                <Text style={[styles.clavierChiffre, { color: text }]}>{chiffre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.clavierRangee}>
          <View style={styles.clavierToucheVide} />
          <TouchableOpacity style={[styles.clavierTouche, { backgroundColor: bgSecondary }]} onPress={() => appuyerChiffre('0')} activeOpacity={0.7}>
            <Text style={[styles.clavierChiffre, { color: text }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.clavierTouche, { backgroundColor: bgSecondary }]} onPress={effacer} activeOpacity={0.7}>
            <Text style={[styles.clavierChiffre, { color: text }]}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ color: textSecondary, fontSize: 12, marginTop: 24 }}>PIN de test : 000000</Text>
    </SafeAreaView>
  );
}

// ============================================
// ÉCRAN ACCUEIL
// ============================================
function EcranAccueil({
  isDark,
  onTransaction,
  onRecevoir,
  onNaviguer,
}: {
  isDark: boolean,
  onTransaction: () => void,
  onRecevoir: () => void,
  onNaviguer: (ecran: string) => void,
}) {
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;

  const actions = [
    { label: 'Envoyer',  icone: '↑', bg: '#E5F1FF', action: onTransaction },
    { label: 'Recevoir', icone: '↓', bg: '#E5FFF1', action: onRecevoir },
    { label: 'Payer',    icone: '⊡', bg: '#FFF5E5', action: () => onNaviguer('payer') },
    { label: 'Wallets',  icone: '▤', bg: '#F5E5FF', action: () => onNaviguer('wallets') },
  ];

  return (
    <ScrollView style={[styles.ecran, { backgroundColor: bg }]}>
      <View style={[styles.accueilHeader, { backgroundColor: bg }]}>
        <View>
          <Text style={[styles.accueilBonjour, { color: textSecondary }]}>Bonjour 👋</Text>
          <Text style={[styles.accueilNom, { color: text }]}>Mwamba K.</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <LogoZevo taille={18} />
          <View style={[styles.accueilAvatar, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.accueilAvatarText}>MK</Text>
          </View>
        </View>
      </View>

      <View style={[styles.soldeCard, {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }]}>
        <Text style={[styles.soldeLabel, { color: 'rgba(255,255,255,0.8)' }]}>Solde total</Text>
        <Text style={[styles.soldeMontant, { color: '#FFFFFF' }]}>85 400 CDF</Text>
        <Text style={[styles.soldeUsd, { color: 'rgba(255,255,255,0.7)' }]}>≈ 29,50 USD</Text>
      </View>

      <View style={[styles.actionsRow, { borderBottomColor: border, borderTopColor: border, backgroundColor: bg }]}>
        {actions.map((action) => (
          <TouchableOpacity key={action.label} style={styles.actionItem} onPress={action.action} activeOpacity={0.7}>
            <View style={[styles.actionIcone, { backgroundColor: action.bg }]}>
              <Text style={styles.actionIconeText}>{action.icone}</Text>
            </View>
            <Text style={[styles.actionLabel, { color: textSecondary }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: bg }]}>
        <Text style={[styles.sectionTitre, { color: textSecondary }]}>RÉCENTES</Text>
        {[
          { nom: 'Jean Kabila',  date: "Aujourd'hui · M-Pesa", montant: '-5 000 CDF', bg: '#FFE5E5', icone: '↑', positif: false },
          { nom: 'Diaspora BE',  date: 'Hier · Virement',      montant: '+20 000 CDF', bg: '#E5FFE5', icone: '↓', positif: true },
          { nom: 'Shoprite KIN', date: '12 mai · Airtel',      montant: '-3 200 CDF', bg: '#FFF5E5', icone: '⊡', positif: false },
        ].map((tx) => (
          <View key={tx.nom} style={[styles.transaction, { borderBottomColor: border }]}>
            <View style={[styles.txIcone, { backgroundColor: tx.bg }]}>
              <Text>{tx.icone}</Text>
            </View>
            <View style={styles.txInfo}>
              <Text style={[styles.txNom, { color: text }]}>{tx.nom}</Text>
              <Text style={[styles.txDate, { color: textSecondary }]}>{tx.date}</Text>
            </View>
            <Text style={[styles.txMontant, { color: tx.positif ? COLORS.positive : COLORS.negative }]}>
              {tx.montant}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ============================================
// ÉCRAN TRANSFERTS
// ============================================
function EcranTransferts({ isDark, onTransaction }: { isDark: boolean, onTransaction: () => void }) {
  const [ongletActif, setOngletActif] = useState('tous');
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const bgSecondary = isDark ? COLORS.darkBgSecondary : COLORS.lightBgSecondary;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;

  return (
    <View style={[styles.ecran, { backgroundColor: bg }]}>
      <View style={[styles.pageHeader, { borderBottomColor: border, gap: 8 }]}>
        <LogoZevo taille={20} />
        <Text style={[styles.pageTitre, { color: text }]}>Transferts</Text>
      </View>
      <View style={[styles.onglets, { backgroundColor: bgSecondary }]}>
        {['tous', 'envoye', 'recu'].map((onglet) => (
          <TouchableOpacity
            key={onglet}
            style={[styles.onglet, ongletActif === onglet && { backgroundColor: COLORS.primary }]}
            onPress={() => setOngletActif(onglet)}
          >
            <Text style={[styles.ongletTexte, { color: ongletActif === onglet ? '#FFFFFF' : textSecondary }]}>
              {onglet === 'tous' ? 'Tous' : onglet === 'envoye' ? 'Envoyé' : 'Reçu'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[styles.nouveauTransfert, { backgroundColor: COLORS.primary }]} onPress={onTransaction} activeOpacity={0.8}>
        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>+ Nouveau transfert</Text>
      </TouchableOpacity>
      <ScrollView>
        {(ongletActif === 'tous' || ongletActif === 'envoye') && (
          <View style={[styles.transaction, { borderBottomColor: border }]}>
            <View style={[styles.txIcone, { backgroundColor: '#FFE5E5' }]}><Text>↑</Text></View>
            <View style={styles.txInfo}>
              <Text style={[styles.txNom, { color: text }]}>Jean Kabila</Text>
              <Text style={[styles.txDate, { color: textSecondary }]}>Aujourd'hui · M-Pesa</Text>
            </View>
            <Text style={[styles.txMontant, { color: COLORS.negative }]}>-5 000 CDF</Text>
          </View>
        )}
        {(ongletActif === 'tous' || ongletActif === 'recu') && (
          <View style={[styles.transaction, { borderBottomColor: border }]}>
            <View style={[styles.txIcone, { backgroundColor: '#E5FFE5' }]}><Text>↓</Text></View>
            <View style={styles.txInfo}>
              <Text style={[styles.txNom, { color: text }]}>Diaspora BE</Text>
              <Text style={[styles.txDate, { color: textSecondary }]}>Hier · Virement</Text>
            </View>
            <Text style={[styles.txMontant, { color: COLORS.positive }]}>+20 000 CDF</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ============================================
// ÉCRAN PAYER — 2 onglets
// ============================================
function EcranPayer({ isDark, onTransaction }: { isDark: boolean, onTransaction: () => void }) {
  const [ongletActif, setOngletActif] = useState('payer');
  const [walletQR, setWalletQR] = useState('mpesa');
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const bgSecondary = isDark ? COLORS.darkBgSecondary : COLORS.lightBgSecondary;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;

  return (
    <View style={[styles.ecran, { backgroundColor: bg }]}>
      <View style={[styles.pageHeader, { borderBottomColor: border, gap: 8 }]}>
        <LogoZevo taille={20} />
        <Text style={[styles.pageTitre, { color: text }]}>Payer</Text>
      </View>

      {/* 2 onglets */}
      <View style={[styles.onglets, { backgroundColor: bgSecondary }]}>
        <TouchableOpacity
          style={[styles.onglet, ongletActif === 'payer' && { backgroundColor: COLORS.primary }]}
          onPress={() => setOngletActif('payer')}
        >
          <Text style={[styles.ongletTexte, { color: ongletActif === 'payer' ? '#FFFFFF' : textSecondary }]}>
            Payer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.onglet, ongletActif === 'monqr' && { backgroundColor: COLORS.primary }]}
          onPress={() => setOngletActif('monqr')}
        >
          <Text style={[styles.ongletTexte, { color: ongletActif === 'monqr' ? '#FFFFFF' : textSecondary }]}>
            Mon QR
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu onglet Payer */}
      {ongletActif === 'payer' && (
        <ScrollView>
          <View style={styles.payerContenu}>

            {/* Champ numéro de téléphone */}
            <TouchableOpacity style={[styles.payerBouton, { backgroundColor: COLORS.primary }]} onPress={onTransaction} activeOpacity={0.8}>
  <Text style={styles.payerBoutonTexte}>Scanner un QR Code</Text>
</TouchableOpacity>

<Text style={[styles.payerOu, { color: textSecondary }]}>— ou —</Text>

<TouchableOpacity style={[styles.payerBoutonOutline, { borderColor: COLORS.primary }]} onPress={onTransaction} activeOpacity={0.8}>
  <Text style={[styles.payerBoutonOutlineTexte, { color: COLORS.primary }]}>Entrer un numéro</Text>
</TouchableOpacity>

            {/* Marchands populaires */}
            <Text style={[styles.sectionTitre, { color: textSecondary, marginTop: 32 }]}>MARCHANDS POPULAIRES</Text>
            {[
              { nom: 'Shoprite Kinshasa', cat: 'Grande distribution' },
              { nom: 'Total Energies',    cat: 'Station-service' },
              { nom: 'Pharmacie Centrale', cat: 'Santé' },
              { nom: 'UNIKIN',            cat: 'Éducation' },
            ].map((marchand) => (
              <TouchableOpacity key={marchand.nom} style={[styles.marchandItem, { backgroundColor: bgSecondary }]} onPress={onTransaction} activeOpacity={0.7}>
                <View style={styles.txInfo}>
                  <Text style={[styles.txNom, { color: text }]}>{marchand.nom}</Text>
                  <Text style={[styles.txDate, { color: textSecondary }]}>{marchand.cat}</Text>
                </View>
                <Text style={{ color: textSecondary }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Contenu onglet Mon QR */}
      {ongletActif === 'monqr' && (
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 24 }}>

          {/* QR Code */}
          <View style={[styles.qrContainer, { backgroundColor: bgSecondary }]}>
            <Text style={{ fontSize: 120 }}>▦</Text>
          </View>

          <Text style={[styles.recevoirNom, { color: text }]}>Mwamba Kalombo</Text>
          <Text style={[styles.recevoirTel, { color: textSecondary }]}>+243 81 234 5678</Text>

          {/* Choix wallet */}
          <View style={[styles.onglets, { backgroundColor: bgSecondary, width: '100%' }]}>
            {[
              { id: 'mpesa',  label: 'M-Pesa' },
              { id: 'airtel', label: 'Airtel' },
              { id: 'orange', label: 'Orange' },
            ].map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={[styles.onglet, walletQR === wallet.id && { backgroundColor: COLORS.primary }]}
                onPress={() => setWalletQR(wallet.id)}
              >
                <Text style={[styles.ongletTexte, { color: walletQR === wallet.id ? '#FFFFFF' : textSecondary }]}>
                  {wallet.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.recevoirInfo, { color: textSecondary }]}>
            Partage ce QR code pour recevoir de l'argent depuis n'importe quel réseau
          </Text>

    <TouchableOpacity style={[styles.payerBouton, { backgroundColor: COLORS.primary, width: '100%' }]}>
  <Text style={styles.payerBoutonTexte}>Partager mon QR code</Text>
</TouchableOpacity>

<TouchableOpacity style={[styles.payerBoutonOutline, { borderColor: COLORS.primary, width: '100%', marginTop: 8 }]}>
  <Text style={[styles.payerBoutonOutlineTexte, { color: COLORS.primary }]}>
    Télécharger pour impression
  </Text>
</TouchableOpacity>

        </ScrollView>
      )}

    </View>
  );
}

// ============================================
// ÉCRAN WALLETS
// ============================================
function EcranWallets({ isDark }: { isDark: boolean }) {
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;

  const wallets = [
    { nom: 'Vodacom M-Pesa',  solde: '32 500', usd: '11,24', couleur: '#E5F5EE', textCouleur: '#085041' },
    { nom: 'Airtel Money',    solde: '18 200', usd: '6,30',  couleur: '#FFE5E5', textCouleur: '#791F1F' },
    { nom: 'Orange Money',    solde: '8 700',  usd: '3,01',  couleur: '#FFF5E5', textCouleur: '#633806' },
    { nom: 'Rawbank · *4521', solde: '26 000', usd: '8,99',  couleur: '#E5F1FF', textCouleur: '#0C447C' },
  ];

  return (
    <ScrollView style={[styles.ecran, { backgroundColor: bg }]}>
      <View style={[styles.pageHeader, { borderBottomColor: border, gap: 8 }]}>
        <LogoZevo taille={20} />
        <Text style={[styles.pageTitre, { color: text }]}>Mes Wallets</Text>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        {wallets.map((wallet) => (
          <TouchableOpacity key={wallet.nom} activeOpacity={0.8} style={[styles.walletCard, {
            backgroundColor: wallet.couleur,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={[styles.walletNom, { color: wallet.textCouleur }]}>{wallet.nom}</Text>
                <Text style={[styles.walletSolde, { color: wallet.textCouleur }]}>{wallet.solde} CDF</Text>
                <Text style={[styles.walletUsd, { color: wallet.textCouleur, opacity: 0.7 }]}>≈ {wallet.usd} USD</Text>
              </View>
              <Text style={{ color: wallet.textCouleur, fontSize: 20 }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.ajouterWallet, { borderColor: COLORS.primary }]}>
          <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 15 }}>+ Ajouter un wallet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================================
// ÉCRAN PROFIL
// ============================================
function EcranProfil({ isDark }: { isDark: boolean }) {
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
  const text = isDark ? COLORS.darkText : COLORS.lightText;
  const textSecondary = isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;
  const bgSecondary = isDark ? COLORS.darkBgSecondary : COLORS.lightBgSecondary;

  return (
    <ScrollView style={[styles.ecran, { backgroundColor: bg }]}>
      <View style={[styles.pageHeader, { borderBottomColor: border, gap: 8 }]}>
        <LogoZevo taille={20} />
        <Text style={[styles.pageTitre, { color: text }]}>Profil</Text>
      </View>
      <View style={[styles.profilInfo, { borderBottomColor: border }]}>
        <View style={[styles.profilAvatar, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.profilAvatarText}>MK</Text>
        </View>
        <Text style={[styles.profilNom, { color: text }]}>Mwamba Kalombo</Text>
        <Text style={[styles.profilTel, { color: textSecondary }]}>+243 81 234 5678</Text>
        <View style={styles.profilBadge}>
          <Text style={styles.profilBadgeTexte}>KYC Vérifié ✓</Text>
        </View>
      </View>
      <View style={{ padding: 16 }}>
        {[
          'Sécurité & PIN',
          'Limites de transaction',
          'Notifications',
          'Langue',
          'Accessibilité',
          'Aide & Support',
          'Se déconnecter',
        ].map((option) => (
          <TouchableOpacity key={option} style={[styles.profilOption, { borderBottomColor: border, backgroundColor: bgSecondary }]} activeOpacity={0.7}>
            <Text style={[styles.profilOptionTexte, { color: option === 'Se déconnecter' ? COLORS.negative : text }]}>
              {option}
            </Text>
            <Text style={{ color: textSecondary }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// ============================================
// BARRE NAVIGATION
// ============================================
function BarreNavigation({ ecranActif, onChanger, isDark }: { ecranActif: string, onChanger: (ecran: string) => void, isDark: boolean }) {
  const bg = isDark ? COLORS.darkBgSecondary : COLORS.lightBg;
  const border = isDark ? COLORS.darkBorder : COLORS.lightBorder;
  const onglets = [
    { id: 'accueil',    label: 'Accueil',    icone: '⌂' },
    { id: 'transferts', label: 'Transferts', icone: '⇄' },
    { id: 'payer',      label: 'Payer',      icone: '⊡' },
    { id: 'wallets',    label: 'Wallets',    icone: '▤' },
    { id: 'profil',     label: 'Profil',     icone: '◯' },
  ];

  return (
    <View style={[styles.navbar, { backgroundColor: bg, borderTopColor: border }]}>
      {onglets.map((onglet) => (
        <TouchableOpacity key={onglet.id} style={styles.navItem} onPress={() => onChanger(onglet.id)} activeOpacity={0.7}>
          {ecranActif === onglet.id && <View style={styles.navPointActif} />}
          <Text style={[styles.navIcone, { color: ecranActif === onglet.id ? COLORS.primary : (isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary) }]}>
            {onglet.icone}
          </Text>
          <Text style={[styles.navLabel, { color: ecranActif === onglet.id ? COLORS.primary : (isDark ? COLORS.darkTextSecondary : COLORS.lightTextSecondary) }]}>
            {onglet.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================
// APP PRINCIPALE
// ============================================
export default function App() {
  const [pinValide, setPinValide] = useState(false);
  const [ecranActif, setEcranActif] = useState('accueil');
  const [succesVisible, setSuccesVisible] = useState(false);
  const [ecranAuth, setEcranAuth] = useState<'connexion' | 'inscription' | null>('connexion');
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? COLORS.darkBg : COLORS.lightBg;

  function afficherSucces() { setSuccesVisible(true); }

if (ecranAuth === 'connexion') {
  return (
    <EcranConnexion
      onConnexion={() => setEcranAuth(null)}
      onInscription={() => setEcranAuth('inscription')}
    />
  );
}

if (ecranAuth === 'inscription') {
  return (
    <EcranInscription
      onInscription={() => setEcranAuth(null)}
      onConnexion={() => setEcranAuth('connexion')}
    />
  );
}

if (!pinValide) {
  return <EcranPin onSuccess={() => setPinValide(true)} />;
}

  return (
    <SafeAreaView style={[styles.appContainer, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {ecranActif === 'accueil'    && <EcranAccueil    isDark={isDark} onTransaction={afficherSucces} onRecevoir={() => setEcranActif('payer')} onNaviguer={setEcranActif} />}
      {ecranActif === 'transferts' && <EcranTransferts isDark={isDark} onTransaction={afficherSucces} />}
      {ecranActif === 'payer'      && <EcranPayer      isDark={isDark} onTransaction={afficherSucces} />}
      {ecranActif === 'wallets'    && <EcranWallets    isDark={isDark} />}
      {ecranActif === 'profil'     && <EcranProfil     isDark={isDark} />}

      <BarreNavigation ecranActif={ecranActif} onChanger={setEcranActif} isDark={isDark} />

      <AnimationSucces visible={succesVisible} onFin={() => setSuccesVisible(false)} />

    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({

  appContainer: { flex: 1 },
  ecran: { flex: 1 },

  logoZ: { fontWeight: '800' },
  logoTexte: { fontWeight: '700' },

  succesOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  succesCercle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: COLORS.positive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  succesCheck: {
    fontSize: 48,
    color: COLORS.positive,
    fontWeight: '100',
  },

  pinContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  pinHeader: { alignItems: 'center', marginBottom: 48, gap: 12 },
  pinTitre: { fontSize: 20, fontWeight: '600' },
  pinSousTitre: { fontSize: 14, textAlign: 'center' },
  pinPoints: { flexDirection: 'row', gap: 16, marginBottom: 48 },
  pinPoint: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  clavier: { width: '100%', gap: 12 },
  clavierRangee: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  clavierTouche: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  clavierToucheVide: { width: 80, height: 80 },
  clavierChiffre: { fontSize: 24, fontWeight: '400' },

  accueilHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 32 },
  accueilBonjour: { fontSize: 14, marginBottom: 4 },
  accueilNom: { fontSize: 22, fontWeight: '600' },
  accueilAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  accueilAvatarText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  soldeCard: { marginHorizontal: 16, borderRadius: 20, padding: 24, marginBottom: 8 },
  soldeLabel: { fontSize: 13, marginBottom: 6 },
  soldeMontant: { fontSize: 34, fontWeight: '700' },
  soldeUsd: { fontSize: 13, marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, borderTopWidth: 0.5, borderBottomWidth: 0.5, marginVertical: 8 },
  actionItem: { alignItems: 'center', gap: 8 },
  actionIcone: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  actionIconeText: { fontSize: 20 },
  actionLabel: { fontSize: 12, fontWeight: '500' },
  section: { padding: 20 },
  sectionTitre: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  transaction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, paddingHorizontal: 16 },
  txIcone: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  txInfo: { flex: 1 },
  txNom: { fontSize: 14, fontWeight: '500' },
  txDate: { fontSize: 12, marginTop: 2 },
  txMontant: { fontSize: 14, fontWeight: '600' },

  pageHeader: { padding: 20, paddingTop: 32, borderBottomWidth: 0.5 },
  pageTitre: { fontSize: 24, fontWeight: '700' },

  onglets: { flexDirection: 'row', margin: 16, borderRadius: 12, padding: 4, gap: 4 },
  onglet: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  ongletTexte: { fontSize: 13, fontWeight: '600' },

  nouveauTransfert: { marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14, alignItems: 'center' },

  champNumeroCont: { width: '100%', borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  champNumeroLabel: { fontSize: 12, marginBottom: 4 },
  champNumero: { fontSize: 16, fontWeight: '500' },

  payerContenu: { padding: 24, alignItems: 'center' },
  payerBouton: { width: '100%', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  payerBoutonTexte: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  payerOu: { fontSize: 14, marginBottom: 16 },
  payerBoutonOutline: { width: '100%', padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1.5, marginBottom: 8 },
  payerBoutonOutlineTexte: { fontSize: 16, fontWeight: '600' },
  marchandItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 8, width: '100%' },

  walletCard: { borderRadius: 16, padding: 20 },
  walletNom: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  walletSolde: { fontSize: 24, fontWeight: '700' },
  walletUsd: { fontSize: 13, marginTop: 4 },
  ajouterWallet: { padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 1.5, marginTop: 8 },

  profilInfo: { alignItems: 'center', padding: 24, borderBottomWidth: 0.5 },
  profilAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profilAvatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '600' },
  profilNom: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  profilTel: { fontSize: 14, marginBottom: 12 },
  profilBadge: { backgroundColor: '#E5FFE5', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  profilBadgeTexte: { color: '#085041', fontSize: 12, fontWeight: '500' },
  profilOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8 },
  profilOptionTexte: { fontSize: 15 },


  champCont: { width: '100%', borderRadius: 14, borderWidth: 1, padding: 16 },
champLabel: { fontSize: 12, marginBottom: 4 },
champInput: { fontSize: 16, fontWeight: '500' },


  navbar: { flexDirection: 'row', borderTopWidth: 0.5, paddingBottom: 8, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 },
  navPointActif: { position: 'absolute', top: 0, width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.primary },
  navIcone: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: '500' },

  qrContainer: { width: 200, height: 200, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  recevoirNom: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  recevoirTel: { fontSize: 14, marginBottom: 20 },
  recevoirInfo: { fontSize: 13, textAlign: 'center', marginVertical: 20, lineHeight: 20 },

});