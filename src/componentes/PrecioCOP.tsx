import { formatearMoneda } from '../lib/formato'

export function PrecioCOP({ valor }: { valor: number }) {
  return <span>{formatearMoneda(valor)}</span>
}
