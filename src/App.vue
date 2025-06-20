<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-8">
    <!-- Logo y título -->
    <div v-if="step == 1">
      <div class="flex flex-col items-center mb-8">
        <img src="/assets/images/logo-red.png" class="h-28 mb-4" alt="HemoScan Logo" />
        <h1 class="text-3xl font-bold">Globi Scan</h1>
      </div>
      <div class="text-center flex justify-center">
        <p class="text-xl w-2/3 text-gray-700">
          Escanea tu hemoglobina en segundos.
        </p>
      </div>
      <!-- Botón de captura -->
      <div class="mt-6 w-full flex justify-center">
        <button @click="step = 2, photo = null, photo2 = null"
          class="w-full bg-rose-600 text-white font-bold py-3 px-4 rounded-full hover:bg-rose-700 transition duration-300">
          Iniciar diagnóstico
        </button>
      </div>
      <!-- Ver cómo funciona -->
      <div class="mt-4 w-full flex justify-center">
        <button class="w-full text-rose-500 font-bold py-3 px-4 rounded-full transition duration-300">
          Ver cómo funciona
        </button>
      </div>
    </div>
    <div v-else-if="step == 2">
      <!-- Preview redondo de la cámara -->
      <Camara />
    </div>
    <div v-else-if="step == 3">
      <!-- Resultado del análisis -->
      <Camara2 />
    </div>
    <div v-else-if="step == 4">
      <!-- Resultado del análisis -->
      <Result />
    </div>
  </div>
</template>

<script setup>
import useDiagnostico from './hooks/useDiagnostico'
import Camara from './components/Camara.vue'
import Result from './components/Result.vue'
import Camara2 from './components/Camara2.vue'

const {
  step,
  photo,
  photo2,
} = useDiagnostico()

</script>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>
