# Dados do curso

Projeto: `bgsxpwnopgsyidabfzzt`.

## Carga já aplicada

| Tabela     | Registros da carga                       |
| ---------- | ---------------------------------------- |
| usuarios   | 3 novos perfis fictícios                 |
| categorias | 6 no total, reutilizando as 2 existentes |
| servicos   | 12                                       |
| avaliacoes | 24, duas por serviço                     |
| favoritos  | 9                                        |

O perfil real que já existia continua no banco. Nenhum registro anterior foi removido ou substituído. Cada avaliação tem um autor diferente do criador do serviço e nota entre 1 e 5.

## Acompanhar pelo SQL Editor

O arquivo `seed.sql` contém a carga completa. Você pode abrir o arquivo, copiar seu conteúdo para o SQL Editor do projeto e executar. Os IDs são gerados pelo banco e recuperados pelo script para criar os relacionamentos. A execução usa transação e não duplica a carga quando repetida. Essa reexecução já foi testada no projeto.

Os perfis de Ana Ribeiro, Bruno Almeida e Carla Nunes usam `user_id = NULL`, permitido pelo esquema. Eles servem para exercitar as tabelas e **não são novas contas de login do Supabase Auth**. Para criar contas com login em uma próxima etapa, use o cadastro da aplicação ou a API administrativa de Auth. Não é necessário preencher manualmente as tabelas internas do schema `auth`.

`created_at` e os IDs são preenchidos pelo banco. O script preenche os demais campos disponíveis, incluindo biografia, avatar, categoria, descrição, preço e detalhe de cobrança. WhatsApp fica nulo para evitar atribuir números reais a perfis fictícios. Dois serviços não têm foto, para também exercitar esse caso na interface.

## Leitura na aplicação

`catalogo-leitura.sql` documenta as permissões e políticas aplicadas. RLS está ativado nas cinco tabelas. O navegador pode consultar serviços, categorias, avaliações e apenas ID, nome, bio e avatar dos perfis de estudo. Não tem autorização para inserir, alterar ou excluir registros, ler o UUID de Auth do perfil real ou consultar favoritos.

As permissões de execução das funções internas de gatilho foram retiradas dos papéis da API; os gatilhos continuam instalados. As alterações de acesso foram registradas no histórico de migrations remoto como `indica_catalogo_leitura` e `indica_gatilhos_internos`.

Verifique os dados com:

```sql
select s.id, s.titulo, c.categoria, s.preco_estimado,
       count(a.id) as total_avaliacoes,
       round(avg(a.nota)::numeric, 1) as media
from public.servicos s
left join public.categorias c on c.id = s.categoria
left join public.avaliacoes a on a.servico_id = s.id
group by s.id, c.categoria
order by s.id;
```

Os testes de API confirmaram que a chave publicável lê os 12 serviços e as 24 avaliações, mas não lê os campos privados de usuários nem os favoritos.

O advisor informa que favoritos não têm política de leitura, o que é intencional nesta etapa: [RLS sem políticas](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). O aviso existente de [proteção contra senhas vazadas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) pertence à configuração de login do Auth e não foi alterado por esta carga.

## View de serviços em destaque

`v_servicos_destaque.sql` cria a view `public.v_servicos_destaque`, registrada no banco pela migration `criar_v_servicos_destaque`. Ela retorna uma linha por serviço, com os dados do serviço, `categoria_nome`, `autor_id`, `autor_nome`, `autor_bio`, `autor_avatar_url`, `media_notas` e `total_avaliacoes`.

As médias são arredondadas para duas casas. `AVG` ignora notas nulas; `total_avaliacoes` conta todas as avaliações, mesmo que o comentário não tenha nota. Sem avaliações, os dois campos retornam zero. `LEFT JOIN` mantém serviços sem categoria ou autor disponível. `security_invoker = true` preserva as políticas RLS das tabelas de origem; os detalhes de um autor protegido ficam nulos para o visitante.

```sql
select titulo, categoria_nome, autor_nome, media_notas, total_avaliacoes
from public.v_servicos_destaque
order by id;
```

O arquivo `testar-v-servicos-destaque.sql` valida a agregação, o caso sem avaliações, notas nulas e a privacidade dos perfis usando o papel `anon`. Os dados temporários são desfeitos com `ROLLBACK`. Esses testes e a leitura da view pela API com chave publicável passaram no projeto.
