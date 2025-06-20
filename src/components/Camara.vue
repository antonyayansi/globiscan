<template>
    <div 
        class="flex flex-col items-center mb-8">
        <!-- <img src="/assets/images/logos.png" class="h-28 mb-4" alt="Globi Scan Logo" /> -->
        <button @click="step = 1" class="text-rose-500 font-bold text-lg">
            Volver al inicio    
        </button>
        <h1 class="text-3xl font-bold">Globi Scan</h1>
        <ul class="mt-4 text-center">
            <li class="text-sm text-gray-700">Mira directamente a la cámara.</li>
            <li class="text-sm text-gray-700">Usa luz natural, cerca de una ventana.</li>
            <li class="text-sm text-gray-700">Evita usar lentes de contacto o gafas.</li>
        </ul>
    </div>
    
    <div v-if="photo" class="rounded-full border-4 border-lime-500 overflow-hidden w-72 h-72 mt-8 relative shadow-xl">
        <img :src="photo" alt="Foto capturada" class="object-cover w-full h-full" />
    </div>
    <div v-else class="rounded-full border-4 border-rose-500 overflow-hidden w-72 h-72 mt-8 relative shadow-xl">
        <div v-if="camareLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <svg class="animate-spin h-8 w-8 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.93A8.003 8.003 0 014 12H0c0 5.523 4.477 10 10 10v-4a6.002 6.002 0 01-3.07-1.07z"></path>
            </svg>
        </div>
        <video ref="videoRef" autoplay playsinline muted class="object-cover w-full h-full"></video>
    </div>
    <div
        v-if="!photo" 
        class="mt-4 w-full flex justify-center">
        <button 
            v-if="!photo"
            @click="changeMode"
            class="w-full md:w-1/3 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-full flex items-center space-x-2 justify-center hover:bg-gray-300 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M14.222 21H9.778c-3.121 0-4.682 0-5.803-.735A4.4 4.4 0 0 1 2.75 19.06C2 17.96 2 16.428 2 13.364s0-4.597.749-5.697a4.4 4.4 0 0 1 1.226-1.204c.72-.473 1.622-.642 3.003-.702c.659 0 1.226-.49 1.355-1.125A2.064 2.064 0 0 1 10.366 3h3.268c.988 0 1.839.685 2.033 1.636c.129.635.696 1.125 1.355 1.125c1.38.06 2.282.23 3.003.702c.485.318.902.727 1.226 1.204c.749 1.1.749 2.632.749 5.697s0 4.596-.749 5.697a4.4 4.4 0 0 1-1.226 1.204C18.904 21 17.343 21 14.222 21M15.27 9.6a.75.75 0 0 0-1.5 0v.143a3.92 3.92 0 0 0-4.54 6.267a3.918 3.918 0 0 0 6.662-2.326a.75.75 0 0 0-1.49-.17a2.418 2.418 0 1 1-1.72-2.595a.75.75 0 0 0 .473 1.415l1.52-.32a.75.75 0 0 0 .595-.734z" clip-rule="evenodd"/></svg>
            <span>
                Voltear cámara
            </span>
        </button>       
    </div>
    <div class="mt-6 w-full flex justify-center">
        <button  
            v-if="!photo"
            @click="capturarFoto"
            class="w-full md:w-1/3 bg-rose-600 text-white font-bold py-3 px-4 rounded-full hover:bg-rose-700 transition duration-300">
            Tomar foto de ojos
        </button>
        <button
            v-else
            @click="step = 3"
            class="w-full md:w-1/3 bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-lime-700 transition duration-300">
            Siguiente paso
        </button>
    </div>
    {{ message }}
    <div class="mt-4 w-full flex justify-center">
        <button 
            v-if="photo"
            @click="photo = null; initalizeCamera()"
            class="w-full md:w-1/3 text-rose-500 font-bold py-3 px-4 rounded-full transition duration-300">
            Tomar otra foto
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import useDiagnostico from '../hooks/useDiagnostico'

const modeCamera = ref('user') // 'user' para cámara frontal, 'environment' para cámara trasera
const camareLoading = ref(false)

const {
    step,
    photo,
    videoRef,
    onSubmit,
    message
} = useDiagnostico()

// Capturar imagen desde el <video>
const capturarFoto = () => {
  if (!videoRef.value) return

  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoRef.value, 0, 0)

  // Guardar la imagen
  photo.value = canvas.toDataURL('image/png')
}

let stream = null

const initalizeCamera = async () => {
    stopCamera()
    camareLoading.value = true
    try {
        stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: modeCamera.value },
        })
        if (videoRef.value) {
        videoRef.value.srcObject = stream
        }
    } catch (err) {
        console.error('Error al acceder a la cámara', err)
    } finally {
        camareLoading.value = false
    }
}

const changeMode = async () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop())
    }
    modeCamera.value = modeCamera.value === 'user' ? 'environment' : 'user'
    await initalizeCamera()
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
    if (videoRef.value) {
        videoRef.value.play()
    }
})

onUnmounted(() => {
    stopCamera()
    videoRef.value = null
})
</script>