import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { lugaresService } from '../services/api';
import { Lugar } from '../types';
import { useAuth } from '../contexts/AuthContext';
import WebFlatList from '../components/WebFlatList';

const HomeScreen: React.FC = ({ navigation }: any) => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    cargarLugares();
  }, []);

  const cargarLugares = async () => {
    try {
      setIsLoading(true);
      const response = await lugaresService.buscarLugares();
      setLugares(response.lugares);
    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarLugares();
    setRefreshing(false);
  };

  const handleLugarPress = (lugar: Lugar) => {
    navigation.navigate('LugarDetail', { lugarId: lugar.id });
  };

  const renderLugar = ({ item }: { item: Lugar }) => (
    <TouchableOpacity
      style={styles.lugarCard}
      onPress={() => handleLugarPress(item)}
    >
      <View style={styles.lugarHeader}>
        <Text style={styles.lugarNombre}>{item.nombre.toUpperCase()}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {item.rating_promedio?.toFixed(1) || 'N/A'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.lugarTipo}>{item.tipo.toUpperCase()}</Text>
      <Text style={styles.lugarDireccion}>{item.direccion}</Text>
      
      <View style={styles.lugarFooter}>
        <Text style={styles.precio}>
          ${item.precio_promedio?.toLocaleString() || 'N/A'}
        </Text>
        <Text style={styles.capacidad}>
          {item.capacidad} personas
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando lugares...</Text>
      </SafeAreaView>
    );
  }

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>SPOTLY</Text>
          {isAdmin() && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <Text style={styles.adminButtonText}>ADMIN</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerSubtitle}>Descubre experiencias gastronómicas únicas</Text>
      </View>

      <WebFlatList
        data={lugares}
        renderItem={renderLugar}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        style={styles.flatList}
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        testID="flatlist"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#cccccc',
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  adminButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
    minHeight: 1000,
  },
  flatList: {
    flex: 1,
  },
  lugarCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  lugarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lugarNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    letterSpacing: 1,
  },
  ratingContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  lugarTipo: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  lugarDireccion: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 16,
    lineHeight: 22,
  },
  lugarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  capacidad: {
    fontSize: 14,
    color: '#999999',
  },
});

export default HomeScreen; 