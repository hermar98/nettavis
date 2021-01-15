// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Categories, Articles, Ratings, Comments, sequelize } from './models.js';

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

let getArticlesWithRating = 'SELECT * FROM Articles a LEFT JOIN (SELECT AVG(value) AS rating, articleId FROM Ratings GROUP BY articleId) b ON a.id = b.articleId';
let orderByTimePublished = ' ORDER BY timePublished DESC';
let selectCategory = ' WHERE categoryId = :categoryId';
let selectPriority = ' WHERE priority = :priority';
let selectArticle = ' WHERE id = :id';
let setLimit = ' LIMIT :limit';

//GET - retrieves a list of all categories
app.get('/categories', (req: Request, res: Response) => {
  return Categories.findAll().then(categories => res.send(categories));
});

//POST - creates a new category
app.post('/categories', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Categories.create({
    name: req.body.name
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//GET - retrieves a specific category
app.get('/categories/:id', (req: Request, res: Response) => {
  return Categories.findOne({ where: { id: Number(req.params.id) } }).then(
    category => (category ? res.send(category) : res.sendStatus(404))
  );
});

//PUT - updates a specific category
app.put('/categories/:id', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Categories.update(
    { name: req.body.name },
    { where: { id: req.params.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//DELETE - deletes a specific category
app.delete('/categories/:id', (req: Request, res: Response) => {
  return Categories.destroy(
    { where: { id: req.params.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//GET - retrieves a list of all articles in a specific category
app.get('/categories/:id/articles', (req: Request, res: Response) => {
  return Articles.findAll({ where: { categoryId: Number(req.params.id) } }).then(
    articles => res.send(articles)
  );
});

//GET - retrieves a list of all articles
app.get('/articles', (req: Request, res: Response) => {
  if (req.query.priority && req.query.limit) {
    return sequelize.query(getArticlesWithRating + selectPriority + orderByTimePublished + setLimit, {
      replacements: { priority: Number(req.query.priority), limit: Number(req.query.limit) },
      type: sequelize.QueryTypes.SELECT
    }).then(articles => res.send(articles));
  }
  if (req.query.categoryId && req.query.limit) {
    return sequelize.query(getArticlesWithRating + selectCategory + orderByTimePublished + setLimit, {
      replacements: { categoryId: Number(req.query.categoryId), limit: Number(req.query.limit) },
      type: sequelize.QueryTypes.SELECT
    }).then(articles => res.send(articles));
  }
  if (req.query.priority) {
    return sequelize.query(getArticlesWithRating + selectPriority + orderByTimePublished, {
      replacements: { priority: Number(req.query.priority) },
      type: sequelize.QueryTypes.SELECT
    }).then(articles => res.send(articles));
  }
  if (req.query.categoryId) {
    return sequelize.query(getArticlesWithRating + selectCategory + orderByTimePublished, {
      replacements: { categoryId: Number(req.query.categoryId) },
      type: sequelize.QueryTypes.SELECT
    }).then(articles => res.send(articles));
  }
  return sequelize.query(getArticlesWithRating + orderByTimePublished, { type: sequelize.QueryTypes.SELECT })
    .then(articles => res.send(articles));
});

//POST - creates a new article
app.post('/articles', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Articles.create({
    timePublished: req.body.timePublished,
    writtenBy: req.body.writtenBy,
    heading: req.body.heading,
    text: req.body.text,
    image: req.body.image,
    priority: req.body.priority,
    categoryId: req.body.categoryId
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//GET - retrieves a specific article
app.get('/articles/:id', (req: Request, res: Response) => {
  return sequelize.query(getArticlesWithRating + selectArticle, {
    replacements: { id: Number(req.params.id) },
    type: sequelize.QueryTypes.SELECT
  }).then(article => res.send(article[0]));
});

//PUT - updates a specific article
app.put('/articles/:id', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Articles.update({
      timePublished: req.body.timePublished,
      writtenBy: req.body.writtenBy,
      heading: req.body.heading,
      text: req.body.text,
      image: req.body.image,
      priority: req.body.priority,
      categoryId: req.body.categoryId
    },
    { where: { id: req.params.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//DELETE - deletes a specific article
app.delete('/articles/:id', (req: Request, res: Response) => {
  return Articles.destroy(
    { where: { id: req.params.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//GET - retrieves a list of all ratings for a specific article
app.get('/articles/:articleId/ratings', (req: Request, res: Response) => {
  return Ratings.findAll({ where: { articleId: Number(req.params.articleId) } }).then(
    ratings => res.send(ratings)
  );
});

//POST - creates a new rating for a specific article
app.post('/articles/:articleId/ratings', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Ratings.create({
    value: req.body.value,
    articleId: Number(req.body.articleId)
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//GET - retrieves a specific rating for a specific article
app.get('/articles/:articleId/ratings/:id', (req: Request, res: Response) => {
  return Ratings.findAll({
      where: {
        id: Number(req.params.id),
        articleId: Number(req.params.articleId)
      }
    }
  ).then(ratings => res.send(ratings));
});

//PUT - updates a specific rating for a specific article
app.put('/articles/:articleId/ratings/:id', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Ratings.update({
      value: req.body.value
    },
    { where: { id: Number(req.params.id), articleId: Number(req.params.articleId) } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//DELETE - deletes a specific rating for a specific article
app.delete('/articles/:articleId/ratings/:id', (req: Request, res: Response) => {
  return Ratings.destroy(
    { where: { id: Number(req.params.id), articleId: Number(req.params.articleId) } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//GET - retrieves a list of all comments for a specific article
app.get('/articles/:articleId/comments', (req: Request, res: Response) => {
  return Comments.findAll({
    where: { articleId: Number(req.params.articleId) },
    order: [['timePublished', 'DESC']]
  }).then(comments => res.send(comments));
});

//POST - creates a new comment for a specific article
app.post('/articles/:articleId/comments', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Comments.create({
    timePublished: req.body.timePublished,
    nickname: req.body.nickname,
    text: req.body.text,
    articleId: Number(req.body.articleId)
  }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

//PUT
app.put('/articles/:articleId/comments/:id', (req: Request, res: Response) => {
  if (!(req.body instanceof Object)) return res.sendStatus(400);
  return Comments.update({
      timePublished: req.body.timePublished,
      nickname: req.body.nickname,
      text: req.body.text
    },
    { where: { id: Number(req.params.id), articleId: Number(req.params.articleId) } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.delete('/articles/:articleId/comments/:id', (req: Request, res: Response) => {
  return Comments.destroy(
    { where: { id: Number(req.params.id), articleId: Number(req.params.articleId) } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started');
    resolve();
  });
});
