<template>
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-8">
        <div class="flex flex-col items-center mb-8">
            <h1 class="text-3xl font-bold">Globi Scan</h1>
        </div>

        <p class="text-xl text-center md:w-1/2 text-zinc-700 mb-6">
            Analizando imágenes...
        </p>
        <div class="animate animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-miterlimit="10" stroke-width="1.5"
                    d="M12 2v4.167m0 11.666V22m10-10h-4.166M6.167 12H2m17.209-7.208l-2.917 2.917m-8.584 8.583l-2.917 2.916m14.418 0l-2.917-2.916M7.708 7.709L4.791 4.792" />
            </svg>
        </div>
        <p class="text-sm text-zinc-600 mt-4 text-center">
            Esto puede tardar unos segundos, por favor espera.
        </p>
    </div>
    <div v-else class="text-center p-4">
        <button @click="step = 1" class="text-rose-500 font-bold text-lg mb-2">
            Volver al inicio
        </button>
        <h1 class="text-3xl font-bold">Nivel estimado de hemoglobina</h1>
        <div class="mt-6 space-y-2">
            <h1 
                :class="isAnemic(response?.data?.detectionDetails?.confidence?.Anemic) ? 'text-rose-500' : 'text-green-500'"
                class="text-5xl">
                ~ {{ estimateHemoglobin(response?.data?.detectionDetails?.confidence) }} g/dL
            </h1>
            <h1>{{ new Decimal(response?.data?.detectionDetails?.confidence?.Anemic * 100).toNumber().toFixed(2) }} %</h1>
            <p v-if="isAnemic(response?.data?.detectionDetails?.confidence?.Anemic)"
                class="text-rose-500 text-lg mt-2">
                Posible anemia detectada, se recomienda consultar a un médico
            </p>
            <p v-else class="text-zinc-700 text-lg mt-2">
                No se detectó anemia, pero se recomienda mantener una dieta balanceada.
            </p>
        </div>
        <div class="mt-4 text-left">
            <div v-if="!isLoadingUnia" class="bg-green-500/20 p-4 mt-2 space-y-2 rounded-xl">
                <h1><strong>Estado:</strong> {{ recomendaciones?.estado || 'No disponible' }}</h1>
                <h1><strong>Comentario:</strong> {{ recomendaciones?.comentario || 'No disponible' }}</h1>
                <h1><strong>Recomendación:</strong></h1>
                <p v-html="marked(recomendaciones?.recomendaciones || 'No se encontraron recomendaciones específicas.')"></p>
            </div>
            <div v-else class="flex space-x-2 items-center justify-center mt-4">
                <svg 
                    class="animate animate-spin h-8 w-8 text-rose-600"
                    xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-miterlimit="10" stroke-width="1.5"
                        d="M12 2v4.167m0 11.666V22m10-10h-4.166M6.167 12H2m17.209-7.208l-2.917 2.917m-8.584 8.583l-2.917 2.916m14.418 0l-2.917-2.916M7.708 7.709L4.791 4.792" />
                </svg>
                <p class="text-sm text-zinc-600 mt-4">
                    Cargando recomendaciones...
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import useDiagnostico from '../hooks/useDiagnostico'
import Decimal from 'decimal.js-light'
import { marked } from "marked";

const isAnemic = (confidence) => {
    return confidence > 0.5
}

const estimateHemoglobin = (confidence) => {
  const base = 14.5; // Límite de anemia a gran altitud
  const range = 3; // Aproximadamente 14.5 a 17.5
  return (base + confidence["Non-Anemic"] * range).toFixed(2);
};

const {
    isLoadingUnia,
    isLoading,
    response,
    step,
    recomendaciones
} = useDiagnostico()

</script>