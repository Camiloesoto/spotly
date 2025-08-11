import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { lugaresService } from '../services/api';
import { Lugar, MenuItem, Resena } from '../types';
import WebScrollView from '../components/WebScrollView';

const LugarDetailScreen: React.FC = ({ route, navigation }: any) => {
  const { lugarId } = route.params;
  const [lugar, setLugar] = useState<Lugar | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'resenas'>('info');

  useEffect(() => {
    cargarLugar();
  }, [lugarId]);

  const cargarLugar = async () => {
    try {
      setIsLoading(true);
      const lugarData = await lugaresService.obtenerLugar(lugarId);
      setLugar(lugarData);

      // Cargar menú y reseñas en paralelo
      const [menuData, resenasData] = await Promise.all([
        lugaresService.obtenerMenu(lugarId),
        lugaresService.obtenerResenas(lugarId, 5, 0)
      ]);

      setMenu(menuData);
      setResenas(resenasData.resenas);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del lugar');
      console.error('Error loading place:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservar = () => {
    navigation.navigate('CrearReserva', { lugarId, lugar });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando lugar...</Text>
      </SafeAreaView>
    );
  }

  if (!lugar) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Lugar no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
        testID="scrollview"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.lugarNombre}>{lugar.nombre}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {lugar.rating_promedio?.toFixed(1) || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
              Información
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              Menú
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'resenas' && styles.activeTab]}
            onPress={() => setActiveTab('resenas')}
          >
            <Text style={[styles.tabText, activeTab === 'resenas' && styles.activeTabText]}>
              Reseñas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'info' && (
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Tipo</Text>
                <Text style={styles.infoValue}>{lugar.tipo}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue}>{lugar.direccion}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Precio promedio</Text>
                <Text style={styles.infoValue}>${lugar.precio_promedio?.toLocaleString() || 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Capacidad</Text>
                <Text style={styles.infoValue}>{lugar.capacidad} personas</Text>
              </View>
              {lugar.descripcion && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Descripción</Text>
                  <Text style={styles.infoValue}>{lugar.descripcion}</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'menu' && (
            <View style={styles.menuContainer}>
              {menu.length > 0 ? (
                menu.map((item) => (
                  <View key={item.id} style={styles.menuItem}>
                    <View style={styles.menuItemHeader}>
                      <Text style={styles.menuItemNombre}>{item.nombre}</Text>
                      <Text style={styles.menuItemPrecio}>${item.precio}</Text>
                    </View>
                    {item.descripcion && (
                      <Text style={styles.menuItemDescripcion}>{item.descripcion}</Text>
                    )}
                    <Text style={styles.menuItemCategoria}>{item.categoria}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay menú disponible</Text>
              )}
            </View>
          )}

          {activeTab === 'resenas' && (
            <View style={styles.resenasContainer}>
              {resenas.length > 0 ? (
                resenas.map((resena) => (
                  <View key={resena.id} style={styles.resenaItem}>
                    <View style={styles.resenaHeader}>
                      <Text style={styles.resenaUsuario}>{resena.usuario_nombre || 'Usuario'}</Text>
                      <Text style={styles.resenaRating}>⭐ {resena.rating}</Text>
                    </View>
                    {resena.comentario && (
                      <Text style={styles.resenaComentario}>{resena.comentario}</Text>
                    )}
                    <Text style={styles.resenaFecha}>
                      {new Date(resena.fecha_creacion).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay reseñas disponibles</Text>
              )}
            </View>
          )}
        </View>
      </WebScrollView>

      {/* Botón de reserva */}
      <View style={styles.reservaButtonContainer}>
        <TouchableOpacity style={styles.reservaButton} onPress={handleReservar}>
          <Text style={styles.reservaButtonText}>Reservar Mesa</Text>
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    fontSize: 18,
    color: '#cccccc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
    minHeight: 1000,
  },
  header: {
    padding: 24,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  lugarNombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  ratingContainer: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  infoContainer: {
    gap: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  menuContainer: {
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  menuItemPrecio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  menuItemDescripcion: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  menuItemCategoria: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  resenasContainer: {
    gap: 16,
  },
  resenaItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  resenaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resenaUsuario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resenaRating: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  resenaComentario: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 8,
  },
  resenaFecha: {
    fontSize: 12,
    color: '#999999',
  },
  emptyText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reservaButtonContainer: {
    padding: 24,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  reservaButton: {
    backgroundColor: '#FF6B35',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reservaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default LugarDetailScreen; 