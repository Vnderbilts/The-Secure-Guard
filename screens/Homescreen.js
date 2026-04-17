import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';

const STATS = [
  { icon: '🔐', label: 'Sesi Aktif', value: '1' },
  { icon: '📊', label: 'Login Hari Ini', value: '1x' },
  { icon: '🛡️', label: 'Status', value: 'Aman' },
];

const FEATURES = [
  { icon: '🔒', title: 'Enkripsi End-to-End', desc: 'Semua data kamu dienkripsi dengan AES-256' },
  { icon: '🌐', title: 'Multi-Device Guard', desc: 'Monitor akses dari semua perangkat' },
  { icon: '📡', title: 'Real-Time Monitor', desc: 'Notifikasi aktivitas mencurigakan instan' },
  { icon: '🧩', title: 'Zero-Knowledge Auth', desc: 'Autentikasi tanpa menyimpan password' },
];

export default function HomeScreen({ navigation, route }) {
  const name = route?.params?.name || 'User';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // Pulse on badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060B18" />

      {/* Background decoration */}
      <View style={styles.bgGlow} pointerEvents="none" />
      <View style={styles.gridOverlay} pointerEvents="none">
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: i * 90 }]} />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <Animated.View
          style={[styles.topBar, { opacity: fadeAnim }]}
        >
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online & Aman</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Keluar 🚪</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Welcome Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitial}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          </Animated.View>

          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{name}! 👋</Text>
          <Text style={styles.welcomeMsg}>
            Akun kamu aktif dan terlindungi oleh sistem keamanan SecureGuard.
          </Text>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Text style={styles.securityBadgeIcon}>🛰️</Text>
            <Text style={styles.securityBadgeText}>SECURED BY SECUREGUARD™</Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          {STATS.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Features Section */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>🔧 Fitur Keamanan</Text>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
              <View style={styles.featureStatus}>
                <Text style={styles.featureStatusDot}>●</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Logout full button */}
        <Animated.View style={{ opacity: fadeAnim, marginTop: 24 }}>
          <TouchableOpacity
            style={styles.fullLogoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.fullLogoutText}>🚪  Keluar dari Akun</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footer}>SecureGuard™ · Jaga data, jaga privasi · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  bgGlow: {
    position: 'absolute',
    top: -100,
    left: '10%',
    right: '10%',
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0,200,255,0.04)',
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 56,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  onlineText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.3)',
    backgroundColor: 'rgba(255,77,109,0.08)',
  },
  logoutText: {
    color: '#FF4D6D',
    fontSize: 13,
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
    backgroundColor: '#0D1326',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,200,255,0.15)',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2.5,
    borderColor: '#00C8FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,200,255,0.1)',
  },
  avatarInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(0,200,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 38,
    fontWeight: '900',
    color: '#00C8FF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ADE80',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0D1326',
  },
  verifiedIcon: {
    color: '#060B18',
    fontSize: 13,
    fontWeight: '900',
  },
  greeting: {
    fontSize: 16,
    color: '#4A5580',
    fontWeight: '500',
  },
  userName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
  },
  welcomeMsg: {
    fontSize: 14,
    color: '#4A5580',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,200,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,200,255,0.2)',
  },
  securityBadgeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityBadgeText: {
    color: '#00C8FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0D1326',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,200,255,0.1)',
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#4A5580',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1326',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,200,255,0.08)',
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,200,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8EAF0',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12,
    color: '#4A5580',
    lineHeight: 17,
  },
  featureStatus: {
    paddingLeft: 8,
  },
  featureStatusDot: {
    color: '#4ADE80',
    fontSize: 10,
  },
  fullLogoutBtn: {
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,77,109,0.35)',
    backgroundColor: 'rgba(255,77,109,0.08)',
  },
  fullLogoutText: {
    color: '#FF4D6D',
    fontWeight: '700',
    fontSize: 15,
  },
  footer: {
    textAlign: 'center',
    color: '#2A3050',
    fontSize: 11,
    marginTop: 24,
    letterSpacing: 0.5,
  },
});