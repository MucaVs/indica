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
- Filtros de reparos, aulas, limpeza e pets; estado vazio e limpeza dos filtros.
- Cards com preço inicial, unidade de cobrança e média calculada das avaliações.
- Detalhes com descrição, comentários, autores, datas e estrelas individuais.
- Layout responsivo e diálogo acessível, com navegação por teclado, fechamento por Escape e retorno do foco ao card.

São seis serviços fictícios em São Paulo. Fotos são ilustrativas e não representam as pessoas citadas. Os filtros e dados não são persistidos.

## Organização para acompanhar o curso

- `src/data/services.ts`: tipos `Service` e `Review` e os registros de demonstração.
- `src/lib/services.ts`: busca, média de estrelas e formatos brasileiros.
- `src/components/ServiceDetails.tsx`: detalhes e avaliações.
- `src/components/Rating.tsx`: estrelas e nota, incluindo frações.
- `src/App.tsx`: busca, categorias e listagem.

O Supabase ainda **não está conectado** e nenhuma tabela remota foi criada. A ideia é fazer essa parte junto com a aula. Quando chegar essa etapa, substituiremos a origem dos dados e ajustaremos os tipos ao esquema ensinado. Em frontend, usar apenas chave publicável e configurar RLS no banco; nunca colocar `service_role` ou chave secreta no cliente.

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

## Imagens

Fotos ilustrativas do Unsplash, armazenadas em `public/images` para o app não depender de downloads em tempo de execução:

- [Eletricista](https://images.unsplash.com/photo-1621905251189-08b45d6a269e) · ID `photo-1621905251189-08b45d6a269e`
- [Aulas](https://images.unsplash.com/photo-1509062522246-3755977927d7) · ID `photo-1509062522246-3755977927d7`
- [Limpeza](https://images.unsplash.com/photo-1581578731548-c64695cc6952) · ID `photo-1581578731548-c64695cc6952`
- [Pintura](https://images.unsplash.com/photo-1562259949-e8e7689d7828) · ID `photo-1562259949-e8e7689d7828`
- [Pets](https://images.unsplash.com/photo-1601758228041-f3b2795255f1) · ID `photo-1601758228041-f3b2795255f1`
- [Reparos](https://images.unsplash.com/photo-1504148455328-c376907d081c) · ID `photo-1504148455328-c376907d081c`

Tipografia DM Sans e Manrope via Google Fonts, com fallback local sem serifa. Ícones Lucide.
