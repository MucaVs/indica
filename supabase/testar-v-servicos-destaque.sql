-- Execute no SQL Editor. Os registros inseridos para o teste são desfeitos.
begin;

do $tests$
declare
  servico_teste bigint;
  linha record;
begin
  if (select count(*) from public.v_servicos_destaque) <> (select count(*) from public.servicos) then
    raise exception 'A view precisa retornar uma linha por serviço';
  end if;

  if exists (
    select 1 from public.v_servicos_destaque v
    where v.total_avaliacoes <> (select count(*) from public.avaliacoes a where a.servico_id = v.id)
       or v.media_notas <> (select coalesce(round(avg(a.nota), 2), 0) from public.avaliacoes a where a.servico_id = v.id)
  ) then
    raise exception 'Média ou contagem diferente dos registros originais';
  end if;

  insert into public.servicos (titulo, preco_detalhe)
  values ('[TESTE VIEW] Serviço temporário', 'teste')
  returning id into servico_teste;

  select * into linha from public.v_servicos_destaque where id = servico_teste;
  if not found then
    raise exception 'Um serviço sem autor, categoria e avaliações não pode desaparecer da view';
  end if;
  if linha.media_notas <> 0 or linha.total_avaliacoes <> 0 then
    raise exception 'Sem avaliações, média e total precisam ser zero';
  end if;

  insert into public.avaliacoes (servico_id, nota, comentario)
  values (servico_teste, 5, 'Teste 1'), (servico_teste, 3, 'Teste 2'), (servico_teste, null, 'Comentário sem nota');

  select * into linha from public.v_servicos_destaque where id = servico_teste;
  if linha.media_notas <> 4 or linha.total_avaliacoes <> 3 then
    raise exception 'AVG deve ignorar notas nulas; o total deve contar todas as avaliações';
  end if;

  -- Ao associar um autor protegido, a RLS deve ocultar os dados dele para anon.
  update public.servicos set criado_por = (
    select id from public.usuarios where user_id is not null order by id limit 1
  ) where id = servico_teste;
  perform set_config('indica.view_test_service_id', servico_teste::text, true);
end;
$tests$;

set local role anon;
do $privacy$
declare
  linha record;
begin
  select * into linha from public.v_servicos_destaque
  where id = current_setting('indica.view_test_service_id')::bigint;
  if not found then
    raise exception 'O serviço público precisa continuar visível para anon';
  end if;
  if linha.autor_id is not null or linha.autor_nome is not null
     or linha.autor_bio is not null or linha.autor_avatar_url is not null then
    raise exception 'A view não pode expor um perfil protegido por RLS';
  end if;
end;
$privacy$;
reset role;

rollback;
select 'View validada: média, contagem, ausência de avaliações e RLS' as resultado;
