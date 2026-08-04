// Comprime y convierte una imagen a base64 usando Canvas API.
// Max 400x400px, JPEG 70% — aprox 15-30KB por imagen.
export function compressImage(file, maxSize = 400, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      let { width, height } = img
      if (width > height) {
        if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize }
      } else {
        if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('No se pudo leer la imagen')) }
    img.src = objectUrl
  })
}
