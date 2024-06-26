# NestJS Bootstrap

## Installing

```bash
npm i @choewy/nestjs-bootstrap
```

## Uses

### createBootstrapOptions

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bootstrapOptions = createBootstrapOptions(app);

  app.useGlobalInterceptors(...bootstrapOptions.interceptors);
  app.useGlobalPipes(...bootstrapOptions.pipes);

  await app.listen(3000);
}

bootstrap();
```

### HttpLogMiddleware

#### Applying middleware

```ts
@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLogMiddleware).forRoutes('*');
  }
}
```

#### Functional middleware

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(HttpLogMiddleware.use);

  await app.listen(3000);
}
```

### HttpLogInterceptor

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(HttpLogMiddleware.use);
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  await app.listen(3000);
}
```
