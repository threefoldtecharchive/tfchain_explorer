# Grid Explorer UI

![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square)

Explorer UI for grid 3 using the new [graphql api](https://tfchain.dev.threefold.io/graphql/graphql).

## Content

- [Download](#download)
- [Serve UI](#serve-ui)
- [Run Docker](#run-docker)
- [Deploy Helm Chart](#deploy-helm-chart)
- [Screenshots](#screenshots)

---

### Download

1. Clone the project

```
$ git@github.com:threefoldtech/grid_explorer_ui.git
```

2. Install dependencies

```
// You must have yarn installed globaly
$ yarn
```

3. Change Directory

```
$ cd grid_explorer_ui
```

---

### serve-ui

```
$ yarn serve
```

---

### Run Docker

| Name    | Required | Default |
| ------- | -------- | ------- |
| GQL_URL | True     |         |

1. Build local image

```
$ docker build -t explorer-ui .
```

2. Run container

```
$ docker run -p 8080:80 -e GQL_URL=https://tfchain.dev.threefold.io/graphql/graphql explorer-ui
```

---

### Deploy Helm Chart

| Name         | Required | Default                                  |
| ------------ | -------- | ---------------------------------------- |
| GQL_URL      | False    | https://tfchain.dev.threefold.io/graphql/graphql |
| ingress.host | False    | dashboard.com                            |

1. Add repo

```
$ helm repo add tf-explorer https://threefoldtech.github.io/grid_explorer_ui/
```

2. Run chart

```
$ helm install --set ingress.host=dashboard.com --set GQL_URL=https://tfchain.dev.threefold.io/graphql/graphql --generate-name tf-explorer/tf-explorer
```

---

### Screenshots

![image](https://user-images.githubusercontent.com/64129/130027646-16317aee-624a-4e85-ae90-3935199c93f3.png)

![image](https://user-images.githubusercontent.com/64129/130027811-4cf6dc1b-a65f-40fc-a101-801e137248fb.png)

![image](https://user-images.githubusercontent.com/64129/130027767-3bd54133-5a8b-4fa6-a0a9-818c305c2ecd.png)


## Available explorers
- [Devnet explorer](https://explorer.tfchain.dev.threefold.io)
- [Testnet explorer](https://explorer.tfchain.test.threefold.io)
- [Mainnet explorer -not live yet-](https://explorer.tfchain.threefold.io)

> TODO: keep it in todo until all are alive

## GraphQL
Info on TFChain is indexed over GraphQL and is available for queries. 
- [Devnet GraphQL](https://tfchain.dev.threefold.io/graphql/graphql)
- [Testnet GraphQL](https://tfchain.test.threefold.io/graphql/graphql)
- Mainnet GraphQL - not yet live


Manual link: https://library.threefold.me/info/threefold#/manual_tfgrid3/threefold__grid3_explorer
