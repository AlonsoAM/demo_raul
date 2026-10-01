import { Navigate, useNavigate } from 'react-router'
import { useSesionStore } from '@/stores/useSesionStore'
import { TarjetaBienvenida } from '../components/TarjetaBienvenida'

/** Página de bienvenida: muestra la sesión activa y permite cerrarla (H3). */
export function BienvenidaPage() {
  const usuario = useSesionStore((s) => s.usuario)
  const cerrarSesion = useSesionStore((s) => s.cerrarSesion)
  const navigate = useNavigate()

  // Defensivo: la ruta protegida ya lo evita, pero un acceso directo no debe renderizar la tarjeta.
  if (!usuario) return <Navigate to="/ingreso" replace />

  const alCerrarSesion = () => {
    cerrarSesion()
    navigate('/ingreso', { replace: true })
  }

  return <TarjetaBienvenida usuario={usuario} onCerrarSesion={alCerrarSesion} />
}
