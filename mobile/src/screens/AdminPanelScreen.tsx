import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { lugaresService } from '../services/api';
import { Lugar } from '../types';
import WebScrollView from '../components/WebScrollView';

const AdminPanelScreen: React.FC = ({ navigation }: any) => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLugares: 0,
    lugaresActivos: 0,
    promedioRating: 0,
  });

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const cargarDatosAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await lugaresService.buscarLugares();
      setLugares(response.lugares);
      
      // Calcular estadísticas
      const totalLugares = response.lugares.length;
      const lugaresActivos = response.lugares.filter(l => l.activo).length;
      const promedioRating = response.lugares.reduce((acc, l) => acc + (l.rating_promedio || 0), 0) / totalLugares;
      
      setStats({
        totalLugares,
        lugaresActivos,
        promedioRating: promedioRating || 0,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos administrativos');
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarLugar = () => {
    navigation.navigate('AgregarLugar');
  };

  const handleEditarLugar = (lugar: Lugar) => {
    navigation.navigate('EditarLugar', { lugar });
  };

  const handleVerificarLugar = async (lugarId: number) => {
    try {
      Alert.alert(
        'Verificar Lugar',
        '¿Estás seguro de que quieres marcar este lugar como verificado?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Verificar',
            onPress: async () => {
              // Aquí iría la llamada a la API para verificar el lugar
              Alert.alert('Éxito', 'Lugar verificado correctamente');
              await cargarDatosAdmin(); // Recargar datos
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar el lugar');
    }
  };

  const handleEliminarLugar = async (lugarId: number, nombre: string) => {
    Alert.alert(
      'Eliminar Lugar',
      `¿Estás seguro de que quieres eliminar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Aquí iría la llamada a la API para eliminar el lugar
              Alert.alert('Éxito', 'Lugar eliminado correctamente');
              await cargarDatosAdmin(); // Recargar datos
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el lugar');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando panel administrativo...</Text>
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
          <Text style={styles.headerTitle}>PANEL ADMINISTRATIVO</Text>
          <Text style={styles.headerSubtitle}>Gestión de lugares y datos</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalLugares}</Text>
            <Text style={styles.statLabel}>Total Lugares</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.lugaresActivos}</Text>
            <Text style={styles.statLabel}>Lugares Activos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.promedioRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating Promedio</Text>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>ACCIONES RÁPIDAS</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleAgregarLugar}>
            <Text style={styles.actionButtonText}>AGREGAR NUEVO LUGAR</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de lugares */}
        <View style={styles.lugaresContainer}>
          <Text style={styles.sectionTitle}>GESTIONAR LUGARES</Text>
          {lugares.map((lugar) => (
            <View key={lugar.id} style={styles.lugarCard}>
              <View style={styles.lugarHeader}>
                <Text style={styles.lugarNombre}>{lugar.nombre.toUpperCase()}</Text>
                <View style={styles.lugarStatus}>
                  <Text style={[styles.statusText, { color: lugar.activo ? '#4CAF50' : '#FF6B35' }]}>
                    {lugar.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.lugarTipo}>{lugar.tipo.toUpperCase()}</Text>
              <Text style={styles.lugarDireccion}>{lugar.direccion}</Text>
              
              <View style={styles.lugarActions}>
                <TouchableOpacity
                  style={styles.actionSmall}
                  onPress={() => handleEditarLugar(lugar)}
                >
                  <Text style={styles.actionSmallText}>EDITAR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionSmall, styles.verifyButton]}
                  onPress={() => handleVerificarLugar(parseInt(lugar.id))}
                >
                  <Text style={styles.actionSmallText}>VERIFICAR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionSmall, styles.deleteButton]}
                  onPress={() => handleEliminarLugar(parseInt(lugar.id), lugar.nombre)}
                >
                  <Text style={styles.actionSmallText}>ELIMINAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </WebScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: 1,
  },
  actionButton: {
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
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  lugaresContainer: {
    padding: 24,
  },
  lugarCard: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    letterSpacing: 1,
  },
  lugarStatus: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lugarTipo: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  lugarDireccion: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 16,
    lineHeight: 20,
  },
  lugarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionSmall: {
    flex: 1,
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  actionSmallText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default AdminPanelScreen; 