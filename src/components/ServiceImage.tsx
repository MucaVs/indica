import { useState } from 'react'
import { Wrench } from 'lucide-react'

export function ServiceImage({ src }: { src: string | null }) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  if (!src || failedSource === src || !/^https:\/\//i.test(src)) {
    return (
      <div className="service-image-placeholder" aria-hidden="true">
        <Wrench size={38} strokeWidth={1.3} />
        <span>Serviço do seu bairro</span>
      </div>
    )
  }
  return (
    <img src={src} alt="" loading="lazy" onError={() => setFailedSource(src)} />
  )
}
