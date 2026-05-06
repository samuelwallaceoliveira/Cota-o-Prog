import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './fireBaseConfig';

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const loadUser = async (email, senha) => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.navigate('Moeda');
    } catch (error) {
      alert('Email ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contLogin}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/50/FFFFFF/user-male-circle.png' }}
          style={styles.Image}
        />

        <View style={styles.AlignInput}>
          <Text style={styles.Text}>Email</Text>
          <TextInput onChangeText={setEmail} style={styles.input} placeholder="Escreva aqui" placeholderTextColor="#666" />
        </View>

        <View style={styles.AlignInput}>
          <Text style={styles.Text}>Senha</Text>
          <TextInput onChangeText={setSenha} style={styles.input} placeholder="Escreva aqui" placeholderTextColor="#666" secureTextEntry />
        </View>

        <TouchableOpacity onPress={() => loadUser(email, senha)} style={styles.Button}>
          <Text style={styles.TextButton}>Logar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CadastroUser')} style={styles.Button}>
          <Text style={styles.TextButton}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── CADASTRO ─────────────────────────────────────────────────────────────────

function CadastroUserScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const saveData = async (email, senha) => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigation.navigate('Login');
    } catch (error) {
      alert('Ponha no mínimo 6 caracteres');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contLogin}>
        <View style={styles.AlignInput}>
          <Text style={styles.Text}>Email</Text>
          <TextInput onChangeText={setEmail} style={styles.input} placeholder="Escreva aqui" placeholderTextColor="#666" />
        </View>

        <View style={styles.AlignInput}>
          <Text style={styles.Text}>Senha</Text>
          <TextInput onChangeText={setSenha} style={styles.input} placeholder="Escreva aqui" placeholderTextColor="#666" secureTextEntry />
        </View>

        <TouchableOpacity onPress={() => saveData(email, senha)} style={styles.Button}>
          <Text style={styles.TextButton}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── MOEDA ────────────────────────────────────────────────────────────────────

function MoedaScreen({ navigation }) {
  const [moedas, setMoedas] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get('http://192.168.56.1:3000/cotacao');
      const dados = response.data[0];
      const lista = Object.values(dados);
      setMoedas(lista);
    } catch (error) {
      alert('Erro ao carregar cotações');
    }
  };

  const getFlag = (code) => {
    const map = {
      USD: 'us', BRL: 'br', EUR: 'eu', GBP: 'gb',
      JPY: 'jp', CAD: 'ca', AUD: 'au', CHF: 'ch',
      CNY: 'cn', ARS: 'ar', MXN: 'mx',
    };
    const crypto = ['BTC', 'ETH', 'DOGE', 'XRP'];
    if (crypto.includes(code)) return null;
    return map[code] || null;
  };

  const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    // #container
    <View style={moedaStyles.container}>
      <StatusBar style="light" />

      {/* .header */}
      <View style={moedaStyles.header}>
        <Text style={moedaStyles.headerTitle}>
          Conversor de{'\n'}Moedas <Text style={moedaStyles.headerPro}>Pro</Text>
        </Text>
      </View>

      {/* .sectionBox */}
      <View style={moedaStyles.sectionBox}>

        {/* .sectionLabel */}
        <View style={moedaStyles.sectionLabel}>
          <Text style={moedaStyles.sectionLabelText}>Cotação Atual</Text>
          <Text style={moedaStyles.sectionSub}>Última atualização: {agora}</Text>
        </View>

        {/* #cardsList — ScrollView com moedas.map() */}
        <ScrollView style={moedaStyles.cardsList} contentContainerStyle={{ gap: 10, padding: 10 }}>
          {moedas.map((m, i) => {
            const flagCode = getFlag(m.code);
            const variacao = parseFloat(m.pctChange || 0);
            const isUp = variacao >= 0;

            return (
              // .card  id="card-{m.code}"
              <View key={i} style={moedaStyles.card}>

                {/* .flagWrap */}
                <View style={moedaStyles.flagWrap}>
                  {flagCode ? (
                    // .flag1 — moeda de origem
                    <Image
                      source={{ uri: `https://flagcdn.com/w40/${flagCode}.png` }}
                      style={moedaStyles.flag1}
                    />
                  ) : (
                    <View style={[moedaStyles.flag1, moedaStyles.flagPlaceholder]}>
                      <Text style={moedaStyles.flagPlaceholderText}>{m.code?.[0]}</Text>
                    </View>
                  )}
                  {/* .flag2 — BRL destino */}
                  <Image
                    source={{ uri: 'https://flagcdn.com/w40/br.png' }}
                    style={moedaStyles.flag2}
                  />
                </View>

                {/* .cardInfo */}
                <View style={moedaStyles.cardInfo}>
                  {/* .cardPair */}
                  <Text style={moedaStyles.cardPair}>{m.code} / BRL</Text>
                  {/* .cardDesc */}
                  <Text style={moedaStyles.cardDesc}>{m.name}</Text>
                </View>

                {/* .cardRight */}
                <View style={moedaStyles.cardRight}>
                  {/* .cardValue */}
                  <Text style={moedaStyles.cardValue}>R$ {Number(m.bid).toFixed(2)}</Text>
                  {/* .changeUp / .changeDown */}
                  <Text style={isUp ? moedaStyles.changeUp : moedaStyles.changeDown}>
                    {isUp ? '▲' : '▼'} {Math.abs(variacao).toFixed(2)}%
                  </Text>
                </View>

              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* #updateBtn — TouchableOpacity que chama loadData() */}
      <TouchableOpacity id="updateBtn" style={moedaStyles.updateBtn} onPress={loadData}>
        <Text style={moedaStyles.updateBtnText}>Atualizar Cotações</Text>
      </TouchableOpacity>

    </View>
  );
}

// ─── NAVIGATOR ────────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CadastroUser" component={CadastroUserScreen} options={{ headerTitleAlign: 'center' }} />
        <Stack.Screen name="Moeda" component={MoedaScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── ESTILOS LOGIN/CADASTRO ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(26, 42, 74)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contLogin: {
    width: 450,
    height: 500,
    backgroundColor: "rgb(26, 42, 74)",
    borderColor: '#a2a2a285',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  Image: { width: 60, height: 60, marginBottom: 20 },
  input: {
    width: '100%',
    backgroundColor: '#000',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    padding: 8,
    color: 'white',
    borderColor: '#a2a2a285',
    borderWidth: 2,
  },
  Text: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  AlignInput: { width: '100%' },
  Button: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#a2a2a285',
  },
  TextButton: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// ─── ESTILOS MOEDA (identicos ao CSS do widget) ───────────────────────────────

const moedaStyles = StyleSheet.create({
  // #container
  container: {
    flex: 1,
    backgroundColor: '#1a2a4a',
  },

  // .header
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  // .headerTitle
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
  },

  // .headerPro
  headerPro: {
    color: '#4ecdc4',
    fontStyle: 'italic',
  },

  // .sectionBox
  sectionBox: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginHorizontal: 16,
    overflow: 'hidden',
    flex: 1,
  },

  // .sectionLabel
  sectionLabel: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4fa',
  },

  // .sectionLabelText
  sectionLabelText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1a2a4a',
  },

  // .sectionSub
  sectionSub: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },

  // #cardsList
  cardsList: {
    backgroundColor: '#f0f4fa',
  },

  // .card
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // .flagWrap
  flagWrap: {
    width: 44,
    height: 44,
    flexShrink: 0,
  },

  // .flag1
  flag1: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 2,
  },

  // .flag2
  flag2: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },

  flagPlaceholder: {
    backgroundColor: '#1a2a4a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flagPlaceholderText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },

  // .cardInfo
  cardInfo: {
    flex: 1,
  },

  // .cardPair
  cardPair: {
    fontWeight: '800',
    fontSize: 15,
    color: '#1a2a4a',
  },

  // .cardDesc
  cardDesc: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  // .cardRight
  cardRight: {
    alignItems: 'flex-end',
  },

  // .cardValue
  cardValue: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1a2a4a',
  },

  // .changeUp
  changeUp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2ecc71',
    marginTop: 2,
  },

  // .changeDown
  changeDown: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e74c3c',
    marginTop: 2,
  },

  // #updateBtn
  updateBtn: {
    backgroundColor: '#4ecdc4',
    margin: 16,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },

  // .updateBtnText
  updateBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
});
