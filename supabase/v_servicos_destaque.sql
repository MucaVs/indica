-- Serviços com categoria, perfil público do autor e resumo das avaliações.
-- security_invoker faz a view respeitar os acessos e as políticas RLS de quem consulta.
create or replace view public.v_servicos_destaque
with (security_invoker = true)
as
select
  s.id,
  s.created_at,
  s.titulo,
  s.descricao,
  s.categoria as categoria_id,
  c.categoria as categoria_nome,
  s.preco_estimado,
  s.preco_detalhe,
  s.foto_url,
  s.criado_por,
  s.terceiro,
  s.eu_mesmo,
  s.whatsapp,
  u.id as autor_id,
  u.nome_completo as autor_nome,
  u.bio as autor_bio,
  u.avatar_url as autor_avatar_url,
  coalesce(round(a.media_notas, 2), 0::numeric) as media_notas,
  coalesce(a.total_avaliacoes, 0::bigint) as total_avaliacoes
from public.servicos s
left join public.categorias c on c.id = s.categoria
left join public.usuarios u on u.id = s.criado_por
left join (
  select servico_id, avg(nota) as media_notas, count(*) as total_avaliacoes
  from public.avaliacoes
  group by servico_id
) a on a.servico_id = s.id;

-- Somente os campos públicos de perfil. user_id (Auth) continua privado.
grant select (id, nome_completo, bio, avatar_url) on public.usuarios to anon, authenticated;
grant select on public.v_servicos_destaque to anon, authenticated;
