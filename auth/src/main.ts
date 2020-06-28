import Express from 'express';

interface Err extends Error {
  status: number;
}

const app = Express();

app.get('/', (req: Express.Request, res: Express.Response) => {
  res.send('Hello World!');
});

// catch 404 and forward to error handler
app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const err = new Error('Not Found') as Err;
  err.status = 404;
  next(err);
});

// error handle
app.use((
  err: Err,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) => {
  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

export default app;
