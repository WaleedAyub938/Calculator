import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Modal,
  Animated 
} from 'react-native';
import {
  Switch,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { evaluate } from 'mathjs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import './android/language/i8n';

const ScientificCalculator = () => {
  const { t, i18n } = useTranslation();
  const systemColorScheme = useColorScheme();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isUserDarkMode, setIsUserDarkMode] = useState(null);
  const [isScientificMode, setIsScientificMode] = useState(false); 
  const [precision, setPrecision] = useState(2);
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const buttonScale = new Animated.Value(1);

  const isDarkMode =
    isUserDarkMode === null ? systemColorScheme === 'dark' : isUserDarkMode;

  const handlePress = buttonValue => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setInput(prevInput => prevInput + buttonValue);
  };

  const toggleSwitch = (value) => {
    setIsUserDarkMode(value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleEqual = () => {
    try {
      const calculatedResult = evaluate(input);
      const formattedResult = calculatedResult.toFixed(precision);
      setResult(formattedResult);
      addToHistory(input, formattedResult);
    } catch (e) {
      setResult('Error');
    }
  };

  const addToHistory = (inputExpression, result) => {
    setHistory(prevHistory => [
      { input: inputExpression, result: result },
      ...prevHistory,
    ]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleLanguageChange = language => {
    i18n.changeLanguage(language);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={isDarkMode ? ['#232526', '#414345'] : ['#f5f7fa', '#c3cfe2']}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => setIsHistoryVisible(!isHistoryVisible)}>
          <FontAwesome
            name="history"
            size={30}
            color={isDarkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('title')}
        </Text>

        <TextInput
          style={styles.display}
          value={result !== '' ? result.toString() : input}
          editable={false}
        />

        <ScrollView
          contentContainerStyle={styles.buttonGrid}
          showsVerticalScrollIndicator={false}>
          {[
            '7',
            '8',
            '9',
            'C',
            '4',
            '5',
            '6',
            '/',
            '1',
            '2',
            '3',
            '*',
            '0',
            '.',
            '=',
            '-',
            '+',
            '%',
            'AC',
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => {
                if (item === '=') {
                  handleEqual();
                } else if (item === 'C' || item === 'AC') {
                  handleClear();
                } else {
                  handlePress(item);
                }
              }}>
              <Text style={styles.buttonText}>{t(item)}</Text>
            </TouchableOpacity>
          ))}

          {isScientificMode && (
            <>
              {['sin', 'cos', 'tan', 'log', 'sqrt', '(', ')'].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => handlePress(item)}>
                    <Text style={styles.buttonText}>{t(item)}</Text>
                  </TouchableOpacity>
                )
              )}
            </>
          )}
        </ScrollView>

        <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
          <FontAwesome
            name="cog"
            size={30}
            color={isDarkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>

        <Modal visible={isSettingsVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: isDarkMode ? '#333' : '#fff' },
              ]}>
              <Text
                style={[
                  styles.modeText,
                  { color: isDarkMode ? '#fff' : '#000' },
                ]}>
                {t('settings')}
              </Text>

              <View style={styles.languageButtons}>
                {['en', 'ur', 'ko', 'jp'].map(lang => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => handleLanguageChange(lang)}>
                    <Text style={styles.languageButton}>
                      {lang.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.switchContainer}>
                <Text style={[styles.modeText, { color: isDarkMode ? '#fff' : '#000' }]}>
                  {isDarkMode ? (
                    <FontAwesome name="moon-o" size={24} color={isDarkMode ? '#fff' : '#000'} />
                  ) : (
                    <FontAwesome name="sun-o" size={24} color={isDarkMode ? '#fff' : '#000'} />
                  )}
                </Text>

                <Switch
                  value={isDarkMode}
                  onValueChange={toggleSwitch}
                  thumbColor={isDarkMode ? '#fff' : '#000'}
                  trackColor={{ false: '#f4f3f4', true: '#81b0ff' }}
                />
              </View>


              <View style={styles.switchContainer}>
                <Text
                  style={[
                    styles.modeText,
                    { color: isDarkMode ? '#fff' : '#000' },
                  ]}>
                  {t('precision')}
                </Text>
                <TouchableOpacity
                  onPress={() => setPrecision(precision === 2 ? 4 : 2)}>
                  <Text style={styles.languageButton}>
                    {precision} decimal places
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.switchContainer}>
                <Text
                  style={[
                    styles.modeText,
                    { color: isDarkMode ? '#fff' : '#000' },
                  ]}>
                  {t('scientific_mode')}
                </Text>
                <Switch
                  value={isScientificMode}
                  onValueChange={() => setIsScientificMode(!isScientificMode)}
                />
              </View>

              <TouchableOpacity
                onPress={() => setIsSettingsVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={isHistoryVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: isDarkMode ? '#333' : '#fff' },
              ]}>
              <Text
                style={[
                  styles.modeText,
                  { color: isDarkMode ? '#fff' : '#000' },
                ]}>
                {t('history')}
              </Text>
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <Text
                    key={index}
                    style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    {entry.input} = {entry.result}
                  </Text>
                ))
              ) : (
                <Text
                  style={[
                    styles.historyText,
                    { color: isDarkMode ? '#fff' : '#000' },
                  ]}>
                  {t('no_history')}
                </Text>
              )}

              <TouchableOpacity
                onPress={clearHistory}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{t('clear_history')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsHistoryVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </PaperProvider>
  );
};

const darkTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#333', text: '#fff' },
};

const lightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#f5f5f5', text: 'black' },
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  display: {
    width: '100%',
    height: 50,
    backgroundColor: '#A6B79E',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    colour: '#101010',
    fontWeight: 'bold',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 20,
    margin: 5,
    borderRadius: 5,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '70%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: { color: '#fff' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modeText: {
    fontSize: 18,
    marginBottom:5
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  languageButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  historyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ScientificCalculator;
