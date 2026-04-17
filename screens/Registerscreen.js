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
const PHONE_REGEX = /^[0-9]{10,}$/;

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }

    const cleanPhone = form.phone.replace(/\s/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9]+$/.test(cleanPhone)) {
      newErrors.phone = 'Hanya boleh angka (0-9)';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Minimal 10 digit angka';
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok!';
    }

    return newErrors;
  };

  const handleRegister = () => {
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
      navigation.navigate('Home', { name: form.name.trim().split(' ')[0] });
    }, 1400);
  };

  const getStrength = (pass) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { label: 'Lemah', color: '#FF4D6D', width: '25%' };
    if (score === 2) return { label: 'Sedang', color: '#FFB347', width: '50%' };
    if (score === 3) return { label: 'Kuat', color: '#4ADE80', width: '75%' };
    return { label: 'Sangat Kuat', color: '#00C8FF', width: '100%' };
  };

  const strength = getStrength(form.password);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060B18" />

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
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>← Kembali</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeIcon}>🛡️</Text>
            </View>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Bergabung sebagai penjaga keamanan digital</Text>
          </View>

          {/* Form Card */}
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>👤  NAMA LENGKAP</Text>
              <View style={[
                styles.inputWrapper,
                errors.name && styles.inputError,
                !errors.name && form.name && styles.inputSuccess,
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor="#3A4060"
                  value={form.name}
                  onChangeText={(v) => updateField('name', v)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>⚠ {errors.name}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📧  EMAIL</Text>
              <View style={[
                styles.inputWrapper,
                errors.email && styles.inputError,
                !errors.email && form.email && styles.inputSuccess,
              ]}>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="nama@email.com"
                  placeholderTextColor="#3A4060"
                  value={form.email}
                  onChangeText={(v) => updateField('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>⚠ {errors.email}</Text> : null}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📱  NOMOR TELEPON</Text>
              <View style={[
                styles.inputWrapper,
                errors.phone && styles.inputError,
                !errors.phone && form.phone && styles.inputSuccess,
              ]}>
                <TextInput
                  ref={phoneRef}
                  style={styles.input}
                  placeholder="08xxxxxxxxxx (min. 10 digit)"
                  placeholderTextColor="#3A4060"
                  value={form.phone}
                  onChangeText={(v) => updateField('phone', v.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  maxLength={15}
                />
              </View>
              {errors.phone ? (
                <Text style={styles.errorText}>⚠ {errors.phone}</Text>
              ) : form.phone ? (
                <Text style={styles.hintText}>
                  {form.phone.length} digit{form.phone.length < 10 ? ` · butuh ${10 - form.phone.length} lagi` : ' ✓'}
                </Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🔒  PASSWORD</Text>
              <View style={[
                styles.inputWrapper,
                errors.password && styles.inputError,
                !errors.password && form.password && styles.inputSuccess,
              ]}>
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#3A4060"
                  value={form.password}
                  onChangeText={(v) => updateField('password', v)}
                  secureTextEntry={!showPass}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {/* Password Strength Bar */}
              {form.password.length > 0 && strength && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View style={[styles.strengthFill, { width: strength.width, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>
                    {strength.label}
                  </Text>
                </View>
              )}
              {errors.password ? <Text style={styles.errorText}>⚠ {errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🔑  KONFIRMASI PASSWORD</Text>
              <View style={[
                styles.inputWrapper,
                errors.confirmPassword && styles.inputError,
                !errors.confirmPassword && form.confirmPassword && form.confirmPassword === form.password && styles.inputSuccess,
              ]}>
                <TextInput
                  ref={confirmRef}
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Ulangi password"
                  placeholderTextColor="#3A4060"
                  value={form.confirmPassword}
                  onChangeText={(v) => updateField('confirmPassword', v)}
                  secureTextEntry={!showConfirm}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>⚠ {errors.confirmPassword}</Text>
              ) : form.confirmPassword && form.confirmPassword === form.password ? (
                <Text style={styles.matchText}>✓ Password cocok!</Text>
              ) : null}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.registerBtnLoading]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Text style={styles.registerBtnText}>
                {isLoading ? '⏳  Membuat akun...' : '🚀  DAFTAR SEKARANG'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkText}>
                Sudah punya akun?{' '}
                <Text style={styles.loginLinkHighlight}>Masuk di sini</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footer}>
            🔐 Data kamu dienkripsi & aman
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
    paddingTop: 16,
  },
  backBtn: {
    paddingVertical: 12,
    paddingRight: 20,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#00C8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  badgeContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,200,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0,200,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badgeIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#4A5580',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#0D1326',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,200,255,0.12)',
    shadowColor: '#00C8FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 18,
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
    height: 50,
    color: '#E8EAF0',
    fontSize: 15,
  },
  inputFlex: { flex: 1 },
  eyeBtn: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  eyeIcon: { fontSize: 17 },
  errorText: {
    color: '#FF4D6D',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  hintText: {
    color: '#4A5580',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  matchText: {
    color: '#4ADE80',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
    fontWeight: '600',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1E2A40',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    minWidth: 80,
    textAlign: 'right',
  },
  registerBtn: {
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
  registerBtnLoading: {
    backgroundColor: '#0090BB',
  },
  registerBtnText: {
    color: '#060B18',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  loginLinkText: {
    color: '#4A5580',
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: '#00C8FF',
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#2A3050',
    fontSize: 11,
    marginTop: 24,
    letterSpacing: 0.5,
  },
});