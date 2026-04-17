import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nama lengkap minimal 2 karakter';
    }
    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    return newErrors;
  };

  const handleLogin = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      shake();
      return;
    }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home', { name: name.trim() });
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060B18" />
      
      {/* Background grid decoration */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: i * 90 }]} />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoOuter}>
                <View style={styles.logoInner}>
                  <Text style={styles.logoIcon}>🛰️</Text>
                </View>
              </View>
            </View>
            <Text style={styles.appTitle}>SECURE GUARD</Text>
            <Text style={styles.appSubtitle}>
              Gerbang masuk yang aman & terpercaya
            </Text>
          </View>

          {/* Card */}
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <Text style={styles.cardTitle}>Masuk Akun</Text>
            <Text style={styles.cardSubtitle}>Selamat datang kembali, Penjaga 👋</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>👤  NAMA LENGKAP</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name && styles.inputError,
                  !errors.name && name && styles.inputSuccess,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor="#3A4060"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((e) => ({ ...e, name: null }));
                  }}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>⚠ {errors.name}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📧  EMAIL</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.inputError,
                  !errors.email && email && styles.inputSuccess,
                ]}
              >
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="nama@email.com"
                  placeholderTextColor="#3A4060"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((e) => ({ ...e, email: null }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>⚠ {errors.email}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🔒  PASSWORD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError,
                  !errors.password && password && styles.inputSuccess,
                ]}
              >
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#3A4060"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) setErrors((e) => ({ ...e, password: null }));
                  }}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>⚠ {errors.password}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnLoading]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? '⏳  Memverifikasi...' : '🔓  MASUK SEKARANG'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.registerBtnText}>✨  Daftar Disini</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footer}>
            Protected by SecureGuard™ · v1.0.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,200,255,0.04)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(0,200,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,200,255,0.05)',
  },
  logoInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: '#00C8FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,200,255,0.1)',
  },
  logoIcon: {
    fontSize: 30,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textAlign: 'center',
  },
  appSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#4A5580',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#0D1326',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,200,255,0.12)',
    shadowColor: '#00C8FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4A5580',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C8FF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E2A40',
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#FF4D6D',
    backgroundColor: 'rgba(255,77,109,0.05)',
  },
  inputSuccess: {
    borderColor: 'rgba(0,200,255,0.4)',
  },
  input: {
    flex: 1,
    height: 52,
    color: '#E8EAF0',
    fontSize: 15,
  },
  inputFlex: {
    flex: 1,
  },
  eyeBtn: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    color: '#FF4D6D',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  loginBtn: {
    backgroundColor: '#00C8FF',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#00C8FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnLoading: {
    backgroundColor: '#0090BB',
  },
  loginBtnText: {
    color: '#060B18',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E2A40',
  },
  dividerText: {
    color: '#3A4060',
    fontSize: 13,
    marginHorizontal: 12,
  },
  registerBtn: {
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,200,255,0.3)',
    backgroundColor: 'rgba(0,200,255,0.06)',
  },
  registerBtnText: {
    color: '#00C8FF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  footer: {
    textAlign: 'center',
    color: '#2A3050',
    fontSize: 11,
    marginTop: 24,
    letterSpacing: 1,
  },
});