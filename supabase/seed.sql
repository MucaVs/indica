-- Dados genéricos para acompanhar o curso, usando o esquema existente.
-- Não recria tabelas, não apaga dados e pode ser reexecutado sem duplicar a carga.
-- São perfis públicos de estudo: user_id = NULL, sem novas contas de login no Auth.
-- WhatsApp fica NULL para não atribuir telefones reais a pessoas fictícias.
begin;
select pg_advisory_xact_lock(hashtext('indica-estudo-seed-v1'));

do $seed$
declare
  perfil record;
  servico record;
  favorito record;
  perfis bigint[] := array[]::bigint[];
  servicos_criados bigint[] := array[]::bigint[];
  perfil_id bigint;
  categoria_id bigint;
  v_servico_id bigint;
  indice integer := 0;
  autor integer;
  comentarios text[] := array[
    'Atendimento pontual e cuidadoso. Combinamos os detalhes antes e o serviço ficou ótimo.',
    'Gostei muito do atendimento. Explicou tudo com clareza e cumpriu o que foi combinado.',
    'Serviço bem feito e boa comunicação. Recomendo para quem está procurando no bairro.',
    'Experiência positiva. Houve um pequeno ajuste de horário, mas o resultado foi muito bom.',
    'Pessoa atenciosa e organizada. Fiquei satisfeito com o resultado.',
    'Bom trabalho e preço combinado com antecedência. Chamaria novamente.'
  ];
begin
  for perfil in
    select * from (values
      ('Ana Ribeiro', '[Indica estudo v1] Professora particular. Perfil fictício para praticar consultas e relacionamentos.', 'https://api.dicebear.com/9.x/initials/svg?seed=Ana%20Ribeiro'),
      ('Bruno Almeida', '[Indica estudo v1] Profissional de manutenção residencial. Perfil fictício para estudo.', 'https://api.dicebear.com/9.x/initials/svg?seed=Bruno%20Almeida'),
      ('Carla Nunes', '[Indica estudo v1] Cuidados com casas, jardins e animais. Perfil fictício para estudo.', 'https://api.dicebear.com/9.x/initials/svg?seed=Carla%20Nunes')
    ) as dados(nome, bio, avatar)
  loop
    select u.id into perfil_id from public.usuarios u
    where u.user_id is null and u.nome_completo = perfil.nome and u.bio = perfil.bio
    order by u.id limit 1;
    if not found then
      insert into public.usuarios (user_id, nome_completo, bio, avatar_url)
      values (null, perfil.nome, perfil.bio, perfil.avatar) returning id into perfil_id;
    end if;
    perfis := array_append(perfis, perfil_id);
  end loop;

  for servico in
    select * from (values
      ('Aulas de inglês para iniciantes', 'Aulas individuais de inglês com foco em situações do dia a dia, vocabulário e conversação. Encontros de uma hora, online ou presenciais.', 'Aulas', 85.00, 'por aula de 1 hora', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', 1),
      ('Eletricista para pequenos reparos', 'Instalação de tomadas, troca de chuveiros e reparos de eletricidade residencial. Materiais são combinados à parte.', 'Reparos', 130.00, 'por visita', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80', 2),
      ('Faxina residencial com capricho', 'Limpeza de cozinha, banheiros, quartos e sala. Diária de até oito horas. Produtos fornecidos pelo contratante.', 'Limpeza', 190.00, 'por diária', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 3),
      ('Reforço escolar de matemática', 'Acompanhamento de matemática para ensino fundamental, revisão de conteúdos e ajuda com exercícios. Aulas adaptadas ao ritmo do aluno.', 'Aulas', 70.00, 'por aula de 1 hora', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', 1),
      ('Conserto de torneiras e vazamentos', 'Troca de sifões, manutenção de torneiras e pequenos reparos hidráulicos. Peças e serviços adicionais são orçados antes da execução.', 'Reparos', 110.00, 'por visita', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80', 2),
      ('Passeios individuais com cachorro', 'Passeios de 45 minutos, respeitando o ritmo de cada animal. Atenção, carinho e notícias sobre o passeio.', 'Pets', 45.00, 'por passeio', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80', 3),
      ('Conversação em inglês', 'Prática de conversação para viagens, trabalho e situações cotidianas. Atividades para desenvolver a confiança ao falar.', 'Aulas', 95.00, 'por aula de 1 hora', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', 1),
      ('Pintura de paredes e retoques', 'Pintura residencial com proteção de móveis e piso. Valor da mão de obra; tintas e outros materiais são combinados separadamente.', 'Reparos', 280.00, 'por diária de mão de obra', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80', 2),
      ('Organização de armários', 'Organização de roupas, objetos e armários para deixar a rotina da casa mais prática. Atendimento com cuidado e discrição.', 'Cuidados com a casa', 100.00, 'por período de 3 horas', null, 3),
      ('Leitura e produção de texto', 'Aulas de português com foco em interpretação de textos, escrita e revisão. Exercícios de acordo com a necessidade de cada aluno.', 'Aulas', 75.00, 'por aula de 1 hora', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', 1),
      ('Montagem de móveis pequenos', 'Montagem de mesas, cadeiras, estantes e outros móveis pequenos. O valor inicial varia conforme o tamanho e a complexidade do móvel.', 'Reparos', 160.00, 'por montagem simples', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80', 2),
      ('Cuidados com plantas e jardim', 'Rega, limpeza de vasos, poda leve e manutenção de pequenos jardins. Materiais específicos são combinados antes da visita.', 'Jardinagem', 90.00, 'por visita de até 2 horas', null, 3)
    ) as dados(titulo, descricao, categoria, preco, detalhe, foto, dono)
  loop
    indice := indice + 1;
    select c.id into categoria_id from public.categorias c
    where c.categoria = servico.categoria order by c.id limit 1;
    if not found then
      insert into public.categorias (categoria) values (servico.categoria)
      returning id into categoria_id;
    end if;

    select s.id into v_servico_id from public.servicos s
    where s.titulo = servico.titulo and s.criado_por = perfis[servico.dono]
    order by s.id limit 1;
    if not found then
      insert into public.servicos (titulo, descricao, categoria, preco_estimado, foto_url, criado_por, terceiro, eu_mesmo, whatsapp, preco_detalhe)
      values (servico.titulo, servico.descricao, categoria_id, servico.preco, servico.foto, perfis[servico.dono], false, true, null, servico.detalhe)
      returning id into v_servico_id;
    end if;
    servicos_criados := array_append(servicos_criados, v_servico_id);

    for autor in 1..array_length(perfis, 1) loop
      if autor <> servico.dono and not exists (
        select 1 from public.avaliacoes a where a.servico_id = v_servico_id and a.autor_id = perfis[autor]
      ) then
        insert into public.avaliacoes (servico_id, autor_id, nota, comentario, created_at)
        values (v_servico_id, perfis[autor], 3 + ((indice + autor) % 3), comentarios[1 + ((indice + autor) % 6)], now() - make_interval(days => indice + autor));
      end if;
    end loop;
  end loop;

  for autor in 1..array_length(perfis, 1) loop
    for favorito in
      select s.id from public.servicos s where s.id = any(servicos_criados) and s.criado_por <> perfis[autor]
      order by s.id limit 3
    loop
      if not exists (select 1 from public.favoritos f where f.usuario_id = perfis[autor] and f.servico_id = favorito.id) then
        insert into public.favoritos (usuario_id, servico_id) values (perfis[autor], favorito.id);
      end if;
    end loop;
  end loop;
end;
$seed$;
commit;

select 'usuarios_de_estudo' as tabela, count(*) as registros from public.usuarios where user_id is null and bio like '[Indica estudo v1]%'
union all select 'categorias', count(*) from public.categorias
union all select 'servicos', count(*) from public.servicos
union all select 'avaliacoes', count(*) from public.avaliacoes
union all select 'favoritos', count(*) from public.favoritos;
