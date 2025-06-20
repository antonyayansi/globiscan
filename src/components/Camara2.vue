<template>
    <div 
        class="flex flex-col items-center mb-8">
        <!-- <img src="/assets/images/logos.png" class="h-28 mb-4" alt="Globi Scan Logo" /> -->
        <button @click="step = 1" class="text-rose-500 font-bold text-lg">
            Volver al inicio    
        </button>
        <h1 class="text-3xl font-bold">Globi Scan</h1>
        <ul class="mt-4 text-center">
            <li class="text-sm text-gray-700">Enfoca la cámara en tus uñas.</li>
            <li class="text-sm text-gray-700">Evita usar esmalte o uñas postizas.</li>
            <li class="text-sm text-gray-700">Asegúrate de que tus manos estén limpias.</li>
        </ul>
    </div>
    
    <div v-if="photo2" class="rounded-xl border-4 border-lime-500 overflow-hidden w-72 h-72 mt-8 relative shadow-xl">
        <img :src="photo2" alt="Foto capturada" class="object-cover w-full h-full" />
    </div>
    <div v-else class="rounded-xl border-4 border-rose-500 overflow-hidden w-72 h-72 mt-8 relative shadow-xl">
        <div v-if="camareLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <svg class="animate-spin h-8 w-8 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.93A8.003 8.003 0 014 12H0c0 5.523 4.477 10 10 10v-4a6.002 6.002 0 01-3.07-1.07z"></path>
            </svg>
        </div>
        <video ref="videoRef2" autoplay playsinline muted class="object-cover w-full h-full"></video>
    </div>
    <div class="mt-6 w-full flex justify-center">
        <button  
            v-if="!photo2"
            @click="capturarFoto"
            class="w-full md:w-1/3 bg-rose-600 text-white font-bold py-3 px-4 rounded-full hover:bg-rose-700 transition duration-300">
            Tomar foto de uñas
        </button>
        <button
            v-else
            @click="onSubmit()"
            class="w-full md:w-1/3 bg-lime-600 text-white font-bold py-3 px-4 rounded-full hover:bg-lime-700 transition duration-300">
            Analizar fotos
        </button>
    </div>
    {{ message }}
    <div class="mt-4 w-full flex justify-center">
        <button 
            v-if="photo2"
            @click="photo2 = null; initalizeCamera()"
            class="w-full md:w-1/3 text-rose-500 font-bold py-3 px-4 rounded-full transition duration-300">
            Tomar otra foto
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import useDiagnostico from '../hooks/useDiagnostico'

const modeCamera = ref('environment') // 'user' para cámara frontal, 'environment' para cámara trasera
const camareLoading = ref(false)

const {
    step,
    photo2,
    videoRef2,
    onSubmit,
    message
} = useDiagnostico()

// Capturar imagen desde el <video>
const capturarFoto = () => {
  if (!videoRef2.value) return

  const canvas = document.createElement('canvas')
  canvas.width = videoRef2.value.videoWidth
  canvas.height = videoRef2.value.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoRef2.value, 0, 0)

  // Guardar la imagen
  photo2.value = canvas.toDataURL('image/png')
}

let stream = null

const initalizeCamera = async () => {
    stopCamera()
    camareLoading.value = true
    try {
        stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: modeCamera.value },
        })
        if (videoRef2.value) {
        videoRef2.value.srcObject = stream
        }
    } catch (err) {
        console.error('Error al acceder a la cámara', err)
    } finally {
        camareLoading.value = false
    }
}

const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop())
        stream = null
    }
}

// Activar cámara al montar
onMounted(async () => {
    await initalizeCamera()
    if (videoRef2.value) {
        videoRef2.value.play()
    }
})

onUnmounted(() => {
    stopCamera()
    videoRef2.value = null
})
</script>