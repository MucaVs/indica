# Indica

Projeto de estudo em `C:\indica`, com React, TypeScript estrito e Vite. A interface é inspirada no Vizinho Indica e tem apenas busca, categorias, detalhes e avaliações de serviços.

- Manter o escopo simples e os textos em português brasileiro.
- O aplicativo lê os registros do Supabase, projeto `bgsxpwnopgsyidabfzzt`. Não adicionar catálogo local de reserva. Dados de teste existem apenas em `src/test/services.fixture.ts`.
- `src/types/database.ts` contém tipos gerados do banco; `src/types/service.ts` contém o modelo da interface; `src/lib/serviceRepository.ts` faz as consultas e a conversão.
- A carga autorizada de dados genéricos está em `supabase/seed.sql`. Ela cria três perfis sem login (`user_id` nulo), serviços, avaliações e favoritos, sem apagar dados existentes. Manter sua reexecução sem duplicações.
- Usar apenas chave publicável no frontend. `.env.local` permanece ignorado pelo Git. O catálogo é somente leitura; o perfil real existente e os favoritos continuam privados.
- Consultar o esquema real antes de novas alterações no Supabase. Não inventar campos como idade ou bairro, que não existem nas tabelas atuais.
- A cada implementação, executar testes relevantes e `npm run check` antes de concluir. Conferir a interface em desktop e celular quando houver alteração visual.
- Revisar `git diff` e `git diff --cached --check` antes de commitar. Não pular o pre-commit.
- Fazer commits descritivos e push para `origin` após as verificações, como autorizado pelo usuário. Não fazer force-push nem versionar credenciais, `.env`, dependências ou builds.
