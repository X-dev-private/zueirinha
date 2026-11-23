import { useEffect, type RefObject } from 'react'

// Chama `fechar` quando o usuário clica fora de `ref` ou aperta Esc
export function useFecharAoClicarFora(
  ref: RefObject<HTMLElement | null>,
  aberto: boolean,
  fechar: () => void,
) {
  useEffect(() => {
    if (!aberto) return
    function aoClicar(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) fechar()
    }
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') fechar()
    }
    document.addEventListener('pointerdown', aoClicar)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('pointerdown', aoClicar)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [ref, aberto, fechar])
}
