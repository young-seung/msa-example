import App from './main';

const port: number = Number(process.env.PORT) || 3000;

App.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
