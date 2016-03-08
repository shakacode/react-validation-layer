const url = '/';

const middleware = (req, res) => {
  res.sendFile(`${process.cwd()}/dev/markup/index.html`);
};

export default [url, middleware];
