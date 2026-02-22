import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      /^(.*)/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      '*',
  });

    const config = new DocumentBuilder()
  .addSecurity('bearer',{
    type: 'http',
    scheme: 'bearer',
  })
  .setTitle('BuildTCG API')
  .setVersion('0.1')
  .addTag('BuildTCG')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    swaggerOptions: {
      operationsSorter: function (a, b) {
        var methodsOrder = ["get", "post", "patch", "delete"];
        var left = methodsOrder.indexOf(a.get("method"));
        var right = methodsOrder.indexOf(b.get("method"));
        return left - right;
      }
    },
  });

  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap();
