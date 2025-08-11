import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { lugaresService } from '../services/api';
import WebScrollView from '../components/WebScrollView';

const AgregarLugarScreen: React.FC = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    direccion: '',
    descripcion: '',
    precio_promedio: '',
    capacidad: '',
    coordenadas: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!formData.nombre || !formData.tipo || !formData.direccion) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setIsLoading(true);
      
      const lugarData = {
        ...formData,
        precio_promedio: formData.precio_promedio ? parseFloat(formData.precio_promedio) : 0,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : 0,
        activo: true,
      };

      // Aquí iría la llamada a la API para crear el lugar
      // await lugaresService.crearLugar(lugarData);
      
      Alert.alert(
        'Éxito',
        'Lugar agregado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el lugar');
      console.error('Error creating place:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AGREGAR NUEVO LUGAR</Text>
          <Text style={styles.headerSubtitle}>Completa la información del lugar</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre del lugar *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Restaurante El Buen Sabor"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange('nombre', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tipo de lugar *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: restaurante, bar, café"
              value={formData.tipo}
              onChangeText={(value) => handleInputChange('tipo', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dirección *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Calle 123 #45-67, Ciudad"
              value={formData.direccion}
              onChangeText={(value) => handleInputChange('direccion', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el lugar, su ambiente, especialidades..."
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Precio promedio</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.precio_promedio}
                onChangeText={(value) => handleInputChange('precio_promedio', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Capacidad</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.capacidad}
                onChangeText={(value) => handleInputChange('capacidad', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Coordenadas (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 4.7110,-74.0721"
              value={formData.coordenadas}
              onChangeText={(value) => handleInputChange('coordenadas', value)}
            />
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>AGREGAR LUGAR</Text>
            )}
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333333',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  submitButton: {
    flex: 1,
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
  submitButtonDisabled: {
    backgroundColor: '#666666',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default AgregarLugarScreen; 