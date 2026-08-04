// File System Access API — permite escribir directamente en el sistema de archivos.
// El usuario elige la carpeta una sola vez por sesión; luego todo es automático.
// Fallback a descarga si el navegador no soporta la API (Firefox, Safari).

let dirHandle = null

export const fsSupported = 'showDirectoryPicker' in window

export async function selectFolder() {
  try {
    dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' })
    return dirHandle
  } catch {
    return null
  }
}

export function getSelectedFolder() {
  return dirHandle
}

export async function saveImageToFolder(file, productId) {
  const ext = file.name.split('.').pop().toLowerCase()
  const filename = `${productId}.${ext}`

  if (!fsSupported) {
    _fallbackDownload(file, filename)
    return { ok: false, filename, fallback: true }
  }

  if (!dirHandle) {
    dirHandle = await selectFolder()
    if (!dirHandle) return { ok: false, filename, cancelled: true }
  }

  try {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(file)
    await writable.close()
    return { ok: true, filename }
  } catch (e) {
    // El handle puede haber expirado; pedir carpeta de nuevo
    dirHandle = null
    _fallbackDownload(file, filename)
    return { ok: false, filename, fallback: true }
  }
}

function _fallbackDownload(file, filename) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
