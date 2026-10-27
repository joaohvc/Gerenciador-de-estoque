# JoluPijamas frontend

## Configuração do login Google

Crie `frontEnd/.env.local` com o Client ID OAuth 2.0 do tipo Aplicativo da Web:

```dotenv
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

O Client ID é público e não é um segredo. Configure as origens JavaScript autorizadas no Google Cloud Console para os endereços do frontend. O token de identidade retornado pelo Google é enviado ao backend em `POST /api/auth/google`; o frontend não o salva em armazenamento local.

Inicie o backend Quarkus e, em seguida, execute:

```sh
npm install
npm run dev
```

O Vite encaminha `/api` para `http://localhost:8080`. A sessão é mantida pelo backend em cookie `HttpOnly`; em produção, sirva o frontend e a API sob o mesmo site, configure CORS para as origens reais e defina `SESSION_COOKIE_SECURE=true` no backend.
