import { defineStore } from "pinia";
import { promptUnia } from "../lib/text";

const enpoint = "https://server.anevia.my.id"

export const diagnostico = defineStore("diagnostico", {
    state: () => ({
        isLoading: false,
        isLoadingUnia: false,
        step: 1,
        new_diagnostico: {
            image: null,
            image2: null,
        },
        videoRef: null,
        videoRef2: null,
        photo: null,
        photo2: null,
        message: null,
        response: null,
        recomendaciones: null,  
    }),
    actions: {
        async onSubmit() {
            this.isLoading = true
            this.step = 4
            this.photo = await this.resizeBase64(this.photo)
            try {
                // Convertir base64 a Blob
                const blob = this.processImage(this.photo)

                // Crear FormData
                const formData = new FormData()
                formData.append('image', blob, 'diagnostico.png')

                const response = await fetch(`${enpoint}/api/scans`, {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json()
                this.response = data
                this.isLoading = false

                this.onSubmitUnia(data)
                
                // agregar todos los resultados en arreglo y localStorage
                let results = JSON.parse(localStorage.getItem('diagnosticos')) || []
                results.push(data)
                localStorage.setItem('diagnosticos', JSON.stringify(results))
            } catch (e) {
                this.message = e || 'Error al enviar imagen'
                this.step = 2
            } finally {
                this.isLoading = false
            }
        },
        processImage(photo) {
            const base64Data = photo.split(',')[1]
            const contentType = photo.match(/data:(.*);base64/)?.[1] || 'image/png'
            const byteCharacters = atob(base64Data)
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i))
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: contentType })
            return blob
        },
        resizeBase64(base64Str, maxWidth = 640, maxHeight = 480) {
            return new Promise((resolve) => {
                const img = new Image()
                img.src = base64Str
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')

                    let width = img.width
                    let height = img.height

                    // Mantener proporción
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width
                            width = maxWidth
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height
                            height = maxHeight
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    ctx.drawImage(img, 0, 0, width, height)
                    resolve(canvas.toDataURL('image/jpeg', 0.7)) // calidad 70%
                }
            })
        },
        async onSubmitUnia(data) {
            this.isLoadingUnia = true
            try {
                const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: promptUnia
                            },
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: "Imagen de mano con uña humana para diagnóstico de anemia, y analisis del ojo: "+ JSON.stringify(data) +""
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: this.photo2
                                        }
                                    }
                                ]
                            }
                        ],
                    })
                })

                const resp = await response.json()

                const json = JSON.parse(resp.choices[0].message.content)
                this.recomendaciones = json
            } catch (e) {
                console.error(e)
            } finally {
                this.isLoadingUnia = false
            }
        }

    }
})