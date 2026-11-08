# Indica

Uma interface simples para estudar Supabase acompanhando um curso. Inspirada no [Vizinho Indica](https://vizinhoindica.app.br/), com identidade própria e foco em recomendações de serviços.

## Rodar no Windows

Requer Node.js 24 e Git.

```powershell
cd C:\indica
npm ci
npm run dev
```

Abra o endereço local mostrado pelo Vite, normalmente `http://127.0.0.1:5173`.

## O que já funciona

- Pesquisa instantânea por nome, categoria, profissional, bairro e palavras relacionadas, ignorando maiúsculas e acentos.
- Filtros gerados a partir das categorias dos serviços recebidos; estado vazio e limpeza dos filtros.
- Cards com preço inicial, unidade de cobrança e média calculada das avaliações.
- Detalhes com descrição, comentários, autores, datas e estrelas individuais.
- Layout responsivo e diálogo acessível, com navegação por teclado, fechamento por Escape e retorno do foco ao card.

O aplicativo não carrega mais o catálogo de demonstração. Sem dados recebidos, a lista fica vazia e nenhum profissional, preço, avaliação ou localização é inventado. Exemplos existem somente nos testes e não entram no código de produção.

## Organização para acompanhar o curso

- `src/types/service.ts`: tipos `Service` e `Review` usados pela interface.
- `src/test/services.fixture.ts`: registros exclusivos dos testes.
- `src/lib/services.ts`: busca, média de estrelas e formatos brasileiros.
- `src/components/ServiceDetails.tsx`: detalhes e avaliações.
- `src/components/Rating.tsx`: estrelas e nota, incluindo frações.
- `src/App.tsx`: busca, categorias e listagem.

O Supabase ainda **não está conectado**. O projeto informado é `bgsxpwnopgsyidabfzzt`; a integração e a carga de dados aguardam o acesso ao schema `public` para confirmar as quatro tabelas e seus relacionamentos. A URL da API, sozinha, não autoriza consultas ou inserções. Em frontend, usar apenas chave publicável e configurar RLS no banco; nunca colocar `service_role` ou chave secreta no cliente.

## Testes e Git

```powershell
npm test             # testes com Vitest e Testing Library
npm run test:watch   # testes durante o desenvolvimento
npm run check       # formatação, lint, testes e build com TypeScript
npm run format      # formatar os arquivos
git diff            # revisar alterações
git add .
git diff --cached
git commit -m "feat: descreva a alteração"
git push origin main
```

O `npm ci` instala o hook do Husky: cada commit executa `npm run check` e verifica erros de whitespace no diff. O GitHub Actions executa as mesmas verificações em pushes e pull requests. Se o Git pedir autenticação, conclua o login pelo Git Credential Manager ou `gh auth login`.

Tipografia DM Sans e Manrope via Google Fonts, com fallback local sem serifa. Ícones Lucide.
