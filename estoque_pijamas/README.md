# estoque_pijamas

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## MySQL configuration

The backend reads the MySQL username and password from the `DB_USERNAME` and `DB_PASSWORD` environment variables. Set both before starting Quarkus; the backend does not load `.env` files automatically.

In PowerShell:

```powershell
$env:DB_USERNAME = "your_local_mysql_user"
$env:DB_PASSWORD = "your_local_mysql_password"
.\mvnw.cmd quarkus:dev
```

In a POSIX shell:

```sh
export DB_USERNAME=your_local_mysql_user
export DB_PASSWORD=your_local_mysql_password
./mvnw quarkus:dev
```

Use your local MySQL credentials. Do not commit credentials or put them in frontend `VITE_` variables.

The backend also requires `GOOGLE_OAUTH_CLIENT_ID`, which must match the public client ID used by the frontend. The backend does not load `.env` files; `estoque_pijamas/.env.example` is a local reference template, not an automatically loaded configuration file. Keep `SESSION_COOKIE_SECURE=false` only for local HTTP development; set it to `true` for production over HTTPS (it defaults to `true` when not overridden).

For the frontend, copy `frontEnd/.env.example` to `frontEnd/.env.local` and set `VITE_GOOGLE_CLIENT_ID` to your public Google OAuth client ID. Vite loads `.env.local` automatically, and it is ignored by Git. Never put OAuth client secrets, database credentials, private keys, or privileged tokens in frontend variables; `VITE_` values are included in the browser build.

## Google login and API sessions

`POST /auth/google` accepts a Google ID token in `{"credential":"..."}`. After signature, expiry, audience, and verified-email checks succeed, Quarkus matches the verified email against the existing `usuarios_acesso` table, rejects missing/inactive/unsupported accounts, and safely binds a previously-null `google_sub`. The eight-hour server-side session stores only the access-table user ID and uses the opaque `JOLU_SESSION` `HttpOnly`, `SameSite=Strict` cookie. The account's active flag and profile are reloaded from MySQL for each authenticated request, so disabling an account or changing its profile takes effect without waiting for session expiry. `GET /auth/session` returns the current account, and `POST /auth/logout` invalidates the session.

The Quarkus HTTP authorization policy protects every `/produtos` route. `ADMIN` can read and modify stock; `CONSULTA` can only use the read endpoints. Cookie `SameSite=Strict`, JSON-only mutation endpoints, and the configured exact-origin CORS policy are the browser CSRF protections. Keep frontend/API origins explicitly configured and serve production over HTTPS.

The existing `google.oauth.client-id` must match the public `VITE_GOOGLE_CLIENT_ID` used by the React app. In production, configure that same-site frontend origin in `quarkus.http.cors.origins` and set `SESSION_COOKIE_SECURE=true` so the cookie is sent only over HTTPS. The session store is in process memory: it is appropriate for a single backend instance, but restarting the backend or using multiple unshared instances invalidates sessions; use a shared session store before scaling horizontally.

## Packaging and running the application

The application can be packaged using:

```shell script
./mvnw package
```

It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/estoque_pijamas-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult <https://quarkus.io/guides/maven-tooling>.

## Related Guides

- REST ([guide](https://quarkus.io/guides/rest)): Build RESTful web services and APIs using Jakarta REST (formerly JAX-RS)
- REST Jackson ([guide](https://quarkus.io/guides/rest#json-serialisation)): Jackson serialization support for Quarkus REST. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it
- Hibernate ORM with Panache ([guide](https://quarkus.io/guides/hibernate-orm-panache)): Simplified JPA/Hibernate data access layer with active record and repository patterns
- JDBC Driver - MySQL ([guide](https://quarkus.io/guides/datasource)): Connect to the MySQL database via JDBC

## Provided Code

### Hibernate ORM

Create your first JPA entity

[Related guide section...](https://quarkus.io/guides/hibernate-orm)


[Related Hibernate with Panache section...](https://quarkus.io/guides/hibernate-orm-panache)


### REST

Easily start your REST Web Services

[Related guide section...](https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources)
