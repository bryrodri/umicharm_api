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

if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
      })
      .setTitle('BuildTCG API')
      .setVersion('0.1')
      .addTag('BuildTCG')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    
    // Lo movemos a la ruta '/docs' para no ensuciar la raíz
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        operationsSorter: function (a, b) {
          const methodsOrder = ["get", "post", "patch", "delete"];
          const left = methodsOrder.indexOf(a.get("method"));
          const right = methodsOrder.indexOf(b.get("method"));
          return left - right;
        },
      },
    });
    
    console.log('Swagger documentation is available at: /docs');
  }

  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
bootstrap();
