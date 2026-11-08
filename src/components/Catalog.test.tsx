import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Catalog } from './Catalog'
import { loadServices } from '../lib/serviceRepository'
import { CatalogConfigurationError } from '../lib/supabase'
import { services } from '../test/services.fixture'

vi.mock('../lib/serviceRepository', () => ({ loadServices: vi.fn() }))
const load = vi.mocked(loadServices)

beforeEach(() => {
  load.mockReset()
})

describe('carregamento do catálogo', () => {
  it('mostra carregamento e só exibe os registros retornados pelo banco', async () => {
    load.mockResolvedValue([services[0]])
    render(<Catalog />)
    expect(screen.getByText('Buscando os serviços do bairro')).toBeVisible()
    expect(
      await screen.findByRole('button', {
        name: 'Ver detalhes de Eletricista residencial',
      }),
    ).toBeVisible()
    expect(
      screen.getAllByRole('button', { name: /Ver detalhes de/ }),
    ).toHaveLength(1)
    expect(
      screen.queryByText('Aulas de inglês para você'),
    ).not.toBeInTheDocument()
  })

  it('mostra falha de rede e permite tentar novamente sem catálogo fictício de reserva', async () => {
    load
      .mockRejectedValueOnce(new Error('Falha na rede'))
      .mockResolvedValueOnce([services[1]])
    const user = userEvent.setup()
    render(<Catalog />)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os serviços',
    )
    expect(
      screen.queryByRole('button', { name: /Ver detalhes de/ }),
    ).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(
      await screen.findByRole('button', {
        name: 'Ver detalhes de Aulas de inglês para você',
      }),
    ).toBeVisible()
  })

  it('trata configuração ausente sem travar a página nem expor chaves', async () => {
    load.mockRejectedValue(new CatalogConfigurationError())
    render(<Catalog />)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Catálogo em preparação',
    )
    expect(screen.queryByText(/VITE_SUPABASE/)).not.toBeInTheDocument()
  })

  it('cancela as consultas ao sair da página', async () => {
    load.mockImplementation(() => new Promise(() => {}))
    const view = render(<Catalog />)
    await waitFor(() => expect(load).toHaveBeenCalledOnce())
    const signal = load.mock.calls[0][0]
    expect(signal.aborted).toBe(false)
    view.unmount()
    expect(signal.aborted).toBe(true)
  })
})
