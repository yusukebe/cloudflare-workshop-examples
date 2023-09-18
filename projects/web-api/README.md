# Cloudflare Workshop - Web API

## Installing

```plain
npm install
```

## Developing

```plain
npm run dev
```

## D1

```plain
wrangler d1 create blog
```

```plain
wrangler d1 execute blog --local --file ./blog.sql
```

```plain
wrangler d1 execute blog --local --command "INSERT INTO posts(id,title,content) VALUES('1','Hello','Nice day!')"
```

```plain
wrangler d1 execute blog --local --command "SELECT * FROM posts"
```

## Deployment

```plain
npm run deploy
```

## Authors

- Yusuke Wada <https://github.com/yusukebe>

## License

MIT
