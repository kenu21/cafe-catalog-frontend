# Local Frontend Setup

Before running the frontend locally, make sure to clone both the data repository and the backend repository:

```bash
git clone git@github.com:kenu21/cafe-catalog-data.git
```
```bash
git clone git@github.com:kenu21/cafe-catalog-backend.git
```

To run the project locally, create a `.env` file in the root of the frontend project. It should look like this:

```env
MYSQL_DATABASE=coffee_shop
MYSQL_ROOT_PASSWORD=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE_URL="jdbc:mysql://db:${MYSQL_CONTAINER_PORT}/${MYSQL_DATABASE}?allowPublicKeyRetrieval=true&useSSL=false&allowLocalInfile=true"

MYSQL_LOCAL_PORT=3307
MYSQL_CONTAINER_PORT=3306

CONTEXT_PATH=/api/v1

BACKEND_CONTAINER_PORT=80
BACKEND_LOCAL_PORT=8081

FRONTEND_CONTAINER_PORT=80
FRONTEND_LOCAL_PORT=81

COMPOSE_EXTENDS_PATH=
BACKEND_EXTENDS_PATH=
```

Fill in the required values.

Next, in the root folder of the project, run:

```bash
docker compose up -d
```

After the containers start, open your browser and go to:

```bash
http://localhost:81
```
