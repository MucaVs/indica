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

A conexão desta máquina já está configurada em `.env.local`, que não é enviado ao GitHub. Em outro checkout, copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_PUBLISHABLE_KEY` com a chave publicável do projeto. Reinicie o Vite após mudar essas variáveis. Nunca use uma chave secreta ou `service_role` em variáveis `VITE_`.

## O que já funciona

- Pesquisa instantânea por nome, categoria, profissional, bairro e palavras relacionadas, ignorando maiúsculas e acentos.
- Filtros gerados a partir das categorias dos serviços recebidos; estado vazio e limpeza dos filtros.
- Cards com preço inicial, unidade de cobrança e média calculada das avaliações.
- Detalhes com descrição, comentários, autores, datas e estrelas individuais.
- Layout responsivo e diálogo acessível, com navegação por teclado, fechamento por Escape e retorno do foco ao card.

O aplicativo consulta o Supabase e não carrega mais um catálogo local de demonstração. Há estados de carregamento, lista vazia, falha de conexão e nova tentativa. Exemplos locais existem somente nos testes e não entram no código de produção. Registros sem foto recebem uma ilustração neutra; preços ausentes aparecem como “A combinar”.

## Organização para acompanhar o curso

- `src/types/service.ts`: tipos `Service` e `Review` usados pela interface.
- `src/types/database.ts`: tipos TypeScript gerados do esquema real do Supabase.
- `src/lib/supabase.ts`: cliente com chave publicável, sem autenticação de usuário nesta etapa.
- `src/lib/serviceRepository.ts`: leitura de serviços, categorias, nomes e avaliações; união dos registros pelos IDs.
- `src/components/Catalog.tsx`: carregamento, cancelamento de consultas e tratamento de falhas.
- `src/test/services.fixture.ts`: registros exclusivos dos testes.
- `src/lib/services.ts`: busca, média de estrelas e formatos brasileiros.
- `src/components/ServiceDetails.tsx`: detalhes e avaliações.
- `src/components/Rating.tsx`: estrelas e nota, incluindo frações.
- `src/App.tsx`: busca, categorias e listagem.

O projeto conectado é `bgsxpwnopgsyidabfzzt`. A carga de estudo já foi aplicada: **3 novos perfis, 6 categorias no total, 12 serviços, 24 avaliações e 9 favoritos**. O perfil que já existia foi preservado. Os três novos perfis são fictícios e não possuem contas de login no Auth. Não foi adicionada coluna de idade ou bairro.

O catálogo permite apenas leitura pelo navegador. Os nomes e IDs dos perfis de estudo são públicos; o perfil real existente e os favoritos permanecem privados. As avaliações exibem média calculada dos registros recebidos. Os filtros são locais e não alteram o banco.

Para acompanhar as inserções na aula, veja [supabase/README.md](supabase/README.md) e [supabase/seed.sql](supabase/seed.sql). O script pode ser repetido sem duplicar os registros. Fotos são ilustrativas e suas URLs fazem parte dos registros do banco.

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
