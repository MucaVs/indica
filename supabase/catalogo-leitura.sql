-- Catálogo público somente para leitura. Execute antes de conectar o frontend.
-- Não concede INSERT, UPDATE ou DELETE ao navegador.
alter table public.usuarios enable row level security;
alter table public.categorias enable row level security;
alter table public.servicos enable row level security;
alter table public.avaliacoes enable row level security;
alter table public.favoritos enable row level security;

revoke truncate, references, trigger
on public.usuarios, public.categorias, public.servicos, public.avaliacoes, public.favoritos
from anon, authenticated;

grant select on public.categorias, public.servicos, public.avaliacoes to anon, authenticated;
grant select (id, nome_completo, bio, avatar_url) on public.usuarios to anon, authenticated;

do $policies$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'categorias' and policyname = 'indica_categorias_leitura') then
    create policy indica_categorias_leitura on public.categorias for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'servicos' and policyname = 'indica_servicos_leitura') then
    create policy indica_servicos_leitura on public.servicos for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'avaliacoes' and policyname = 'indica_avaliacoes_leitura') then
    create policy indica_avaliacoes_leitura on public.avaliacoes for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'usuarios' and policyname = 'indica_perfis_estudo_leitura') then
    create policy indica_perfis_estudo_leitura on public.usuarios for select to anon, authenticated
      using (user_id is null and bio like '[Indica estudo v1]%');
  end if;
end;
$policies$;

-- Só os campos públicos dos perfis de estudo são acessíveis; o perfil real já existente
-- permanece protegido. Favoritos continuam sem acesso pelo navegador.

-- Funções de gatilho são internas: não precisam ser executáveis pela API.
do $triggers$
begin
  if to_regprocedure('public.criar_usuario_publico()') is not null then
    revoke execute on function public.criar_usuario_publico() from public, anon, authenticated;
  end if;
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$triggers$;
