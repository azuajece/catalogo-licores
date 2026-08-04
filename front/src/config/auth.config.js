// Credenciales del panel admin
// La contraseña se almacena como hash SHA-256, nunca en texto plano.
// Para cambiar la contraseña, calculá el hash con:
//   python -c "import hashlib; print(hashlib.sha256('nueva_clave'.encode()).hexdigest())"
// y reemplazá el valor de PASSWORD_HASH abajo.

export const AUTH = {
  USERNAME: 'cristian',
  PASSWORD_HASH: 'b41de7fab576a3badaee4a5beb5ac406394572870aeae851353cea07f3929d45',
  SESSION_KEY: 'licores_admin_auth',
}
