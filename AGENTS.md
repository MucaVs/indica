# Indica

Projeto de estudo em `C:\indica`, com React, TypeScript estrito e Vite. A interface é inspirada no Vizinho Indica e tem apenas busca, categorias, detalhes e avaliações de serviços.

- Manter o escopo simples e os textos em português brasileiro.
- O aplicativo não carrega exemplos locais. Dados fictícios existem apenas em `src/test/services.fixture.ts`, para testes. Os modelos da interface estão em `src/types/service.ts`.
- A integração com Supabase está autorizada pelo usuário, incluindo a carga de dados genéricos no projeto informado. Confirmar os campos e relacionamentos reais antes de gerar ou executar a carga; não inventar o esquema do banco.
- A cada implementação, executar testes relevantes e `npm run check` antes de concluir. Conferir a interface em desktop e celular quando houver alteração visual.
- Revisar `git diff` e `git diff --cached --check` antes de commitar. Não pular o pre-commit.
- Fazer commits descritivos e push para `origin` após as verificações, como autorizado pelo usuário. Não fazer force-push nem versionar credenciais, `.env`, dependências ou builds.
