// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { Alert, NavBar, Card, Grid, MutedText, Button, FormGroup, ListGroup } from './widgets';
import { Article, Rating, Comment, categoryService, articleService, ratingService, commentService } from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
const cookies = new Cookies();

class Menu extends Component {
  articles = [];
  interval = null;

  render() {
    return (
      <div>
        <NavBar>
          <NavBar.Brand>Trondheim IT-paper</NavBar.Brand>
          <NavBar.Link to="/laptop">Laptop</NavBar.Link>
          <NavBar.Link to="/mobile">Mobile</NavBar.Link>
          <NavBar.Link to="/gaming">Gaming</NavBar.Link>
          <NavBar.Link to="/apps">Apps</NavBar.Link>
          <Button.Light onClick={() => history.push('/editarticles')}>
            Register/edit articles
          </Button.Light>
        </NavBar>
        <div className="marquee-container">
          <div className="marquee">
            {this.articles.map(article => (
              <NavLink className="marquee-link" to={'/articles/' + article.id}>
                {moment(article.timePublished).format('DD.MM.YYYY HH:mm') + ' - ' + article.heading}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  mounted() {
    articleService.getArticles()
      .then(articles => this.articles = articles)
      .catch((error: Error) => Alert.danger(error.message));

    this.interval = setInterval(() => {
      articleService.getArticles()
        .then(articles => this.articles = articles)
        .catch((error: Error) => Alert.danger(error.message));
    }, 10000);
  }

  beforeUnmount() {
    if (this.interval) clearInterval(this.interval);
  }
}

class Home extends Component {
  articlesTop = [];
  articlesMain = [];
  limit = 20;
  textLength = 250;

  render() {
    return (
      <Grid>
        <Grid.Top>
          {this.articlesTop.map(article => (
            <Card imgSrc={article.image}>
              <Card.Text>
                <MutedText>
                  Published: {moment(article.timePublished).format('DD.MM.YYYY')}
                </MutedText>
                <MutedText floatRight>
                  {article.rating ? ('Rating: ' + Math.round(article.rating * 10) / 10) : ('No ratings')}
                </MutedText>
              </Card.Text>
              <Card.Title>{article.heading}</Card.Title>
              <Card.Text>
                {(article.text.length <= this.textLength) ? (article.text) :
                  (article.text.substring(0, this.textLength) + '...')}
              </Card.Text>
              <Button.Dark onClick={() => this.goToArticle(article.id)}>Read article</Button.Dark>
            </Card>
          ))}
        </Grid.Top>
        <Grid.Main>
          {this.articlesMain.map(article => (
            <Card imgSrc={article.image}>
              <Card.Text>
                <MutedText>
                  Published: {moment(article.timePublished).format('DD.MM.YYYY')}
                </MutedText>
                <MutedText floatRight>
                  {article.rating ? ('Rating: ' + Math.round(article.rating * 10) / 10) : ('No ratings')}
                </MutedText>
              </Card.Text>
              <Card.Title>{article.heading}</Card.Title>
              <Card.Text>
                {(article.text.length <= this.textLength) ? (article.text) :
                  (article.text.substring(0, this.textLength) + '...')}
              </Card.Text>
              <Button.Dark onClick={() => this.goToArticle(article.id)}>Read article</Button.Dark>
            </Card>
          ))}
        </Grid.Main>
      </Grid>
    );
  }

  mounted() {
    articleService
      .getArticlesByPriority(1, this.limit)
      .then(articles => (this.articlesTop = articles.splice(0, 2)))
      .catch((error: Error) => Alert.danger(error.message));

    articleService
      .getArticlesByPriority(1, this.limit)
      .then(articles => (this.articlesMain = articles.splice(2)))
      .catch((error: Error) => Alert.danger(error.message));
  }

  goToArticle(id: number) {
    history.push('/articles/' + id);
  }
}

class Category extends Component {
  articlesTop = [];
  articlesMain = [];
  limit = 20;
  textLength = 250;
  categoryId = 1;

  render() {
    return (
      <Grid>
        <Grid.Top>
          {this.articlesTop.map(article => (
            <Card imgSrc={article.image}>
              <Card.Text>
                <MutedText>
                  Published: {moment(article.timePublished).format('DD.MM.YYYY')}
                </MutedText>
                <MutedText floatRight>
                  {article.rating ? ('Rating: ' + Math.round(article.rating * 10) / 10) : ('No ratings')}
                </MutedText>
              </Card.Text>
              <Card.Title>{article.heading}</Card.Title>
              <Card.Text>
                {(article.text.length <= this.textLength) ? (article.text) :
                  (article.text.substring(0, this.textLength) + '...')}
              </Card.Text>
              <Button.Dark onClick={() => this.goToArticle(article.id)}>Read article</Button.Dark>
            </Card>
          ))}
        </Grid.Top>
        <Grid.Main>
          {this.articlesMain.map(article => (
            <Card imgSrc={article.image}>
              <Card.Text>
                <MutedText>
                  Published: {moment(article.timePublished).format('DD.MM.YYYY')}
                </MutedText>
                <MutedText floatRight>
                  {article.rating ? ('Rating: ' + Math.round(article.rating * 10) / 10) : ('No ratings')}
                </MutedText>
              </Card.Text>
              <Card.Title>{article.heading}</Card.Title>
              <Card.Text>
                {(article.text.length <= this.textLength) ? (article.text) :
                  (article.text.substring(0, this.textLength) + '...')}
              </Card.Text>
              <Button.Dark onClick={() => this.goToArticle(article.id)}>Read article</Button.Dark>
            </Card>
          ))}
        </Grid.Main>
      </Grid>
    );
  }

  mounted() {
    if (this.props.location.pathname === '/laptop') {
      this.categoryId = 1;
    }
    if (this.props.location.pathname === '/mobile') {
      this.categoryId = 2;
    }
    if (this.props.location.pathname === '/gaming') {
      this.categoryId = 3;
    }
    if (this.props.location.pathname === '/apps') {
      this.categoryId = 4;
    }

    articleService
      .getArticlesByCategory(this.categoryId, this.limit)
      .then(articles => (this.articlesTop = articles.splice(0, 2)))
      .catch((error: Error) => Alert.danger(error.message));

    articleService
      .getArticlesByCategory(this.categoryId, this.limit)
      .then(articles => (this.articlesMain = articles.splice(2)))
      .catch((error: Error) => Alert.danger(error.message));
  }

  goToArticle(id: number) {
    history.push('/articles/' + id);
  }
}

class ArticleInfo extends Component<{ match: { params: { id: number } } }> {
  article = null;
  category = null;
  comments = [];

  ratingValue = null;
  isArticleRated: boolean = false;

  nickname = null;
  comment = null;

  render() {
    if (!this.article) return null;
    if (!this.category) return null;

    return (
      <div className="container my-4">
        <Card imgSrc={this.article.image}>
          <Card.Title big>{this.article.heading}</Card.Title>
          <Card.Text>
            <small>
              <b>Category: </b>
              {this.category.name}
              <br/><b>Published: </b>
              {moment(this.article.timePublished).format('DD.MM.YYYY HH:mm')}
              <br/><b>Written by: </b>
              {this.article.writtenBy}
              <br/><b>Rating: </b>
              {this.article.rating ? (Math.round(this.article.rating * 10) / 10) : ('No ratings')}
            </small>
          </Card.Text>
          <Card.Text>{this.article.text}</Card.Text>
          <Card.Title>Rate this article:</Card.Title>
          {this.isArticleRated ? (
            <Card.Text>You successfully rated this article.</Card.Text>
          ) : (
            <div>
              <FormGroup onChange={event => (this.ratingValue = event.target.value)}>
                <FormGroup.RadioButton name="rating" id="radio1" value="1">1</FormGroup.RadioButton>
                <FormGroup.RadioButton name="rating" id="radio2" value="2">2</FormGroup.RadioButton>
                <FormGroup.RadioButton name="rating" id="radio3" value="3">3</FormGroup.RadioButton>
                <FormGroup.RadioButton name="rating" id="radio4" value="4">4</FormGroup.RadioButton>
                <FormGroup.RadioButton name="rating" id="radio5" value="5">5</FormGroup.RadioButton>
              </FormGroup>
              <Button.Dark onClick={this.addRating}>Submit</Button.Dark>
            </div>
          )}
          <Card.Title>Add a comment:</Card.Title>
          <FormGroup>
            <FormGroup.Input
              id="nickname"
              title="Nickname:"
              type="text"
              placeholder="Nickname"
              onChange={event => (this.nickname = event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.TextArea
              id="comment"
              title="Comment:"
              rows="3"
              placeholder="Write your comment here..."
              onChange={event => (this.comment = event.target.value)}
            />
          </FormGroup>
          <Button.Dark onClick={this.addComment}>Comment</Button.Dark>
          <Card.Title>Comments:</Card.Title>
          <ListGroup>
            {(this.comments.length === 0) ? (
              <ListGroup.Item>This article has no comments yet.</ListGroup.Item>
            ) : (
              this.comments.map(comment => (
                <ListGroup.Item>
                  <MutedText>{moment(comment.timePublished).format('DD.MM.YYYY HH:mm')}</MutedText><br/>
                  <b>{comment.nickname}</b><br/>
                  {comment.text}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      </div>
    );
  }

  mounted() {
    articleService.getArticle(this.props.match.params.id)
      .then(article => {
        this.article = article;
        categoryService.getCategory(article.categoryId)
          .then(category => (this.category = category))
          .catch((error: Error) => Alert.danger(error.message));
      })
      .catch((error: Error) => Alert.danger(error.message));

    commentService.getComments(this.props.match.params.id)
      .then(comments => this.comments = comments)
      .catch((error: Error) => Alert.danger(error.message));

    if (cookies.get('article' + this.props.match.params.id) === 'rated') {
      this.isArticleRated = true;
    }
  }

  addRating() {
    if (!this.ratingValue) return null;

    let rating = new Rating();
    rating.value = Number(this.ratingValue);
    rating.articleId = Number(this.props.match.params.id);
    ratingService.addRating(rating)
      .then(() => {
        cookies.set('article' + this.props.match.params.id, 'rated');
        this.isArticleRated = true;
      }).catch((error: Error) => Alert.danger(error.message));
  }

  addComment() {
    if (!this.nickname || !this.comment) return null;

    let comment = new Comment();
    comment.timePublished = new Date();
    comment.nickname = this.nickname;
    comment.text = this.comment;
    comment.articleId = this.props.match.params.id;
    commentService.addComment(comment)
      .then(() => {
        this.comments.unshift(comment);
        document.getElementById('nickname').value = '';
        document.getElementById('comment').value = '';
      }).catch((error: Error) => Alert.danger(error.message));
  }
}

class ArticleList extends Component {
  articles = [];

  render() {
    return (
      <Card>
        <Button.Dark onClick={() => history.push('/editarticles/add')}>
          Add new article
        </Button.Dark><br/>
        <Card.Title>All articles:</Card.Title>
        <ListGroup>
          {this.articles.map(article => (
            <ListGroup.Item>
              <MutedText>{moment(article.timePublished).format('DD.MM.YYYY HH:mm')}</MutedText><br/>
              <b>{article.heading}</b><br/>
              <Button.Dark onClick={() => history.push('editarticles/edit/' + article.id)}>Edit</Button.Dark>
              <Button.Danger onClick={() => this.deleteArticle(article)}>Delete</Button.Danger>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    );
  }

  mounted() {
    articleService.getArticles()
      .then(articles => (this.articles = articles))
      .catch((error: Error) => Alert.danger(error.message));
  }

  deleteArticle(article: Article) {
    articleService.deleteArticle(article)
      .then(() => {
        let articleList = ArticleList.instance();
        if (articleList) articleList.mounted();
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class ArticleAdd extends Component {
  writtenBy = '';
  heading = '';
  text = '';
  image = '';
  priority: number = 1;
  categoryId: number = 1;

  render() {
    return (
      <div className="container my-4">
        <Card>
          <Card.Title>Add new article:</Card.Title>
          <FormGroup>
            <FormGroup.Select id="category" title="Category:"
                              onChange={event => this.categoryId = Number(event.target.value)}>
              <option value="1">Laptop</option>
              <option value="2">Mobile</option>
              <option value="3">Gaming</option>
              <option value="4">Apps</option>
            </FormGroup.Select>
          </FormGroup>
          <FormGroup>
            <FormGroup.Input
              id="writtenBy"
              title="Written by:"
              type="text"
              placeholder="The person who wrote the article"
              onChange={event => (this.writtenBy = event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Input
              id="header"
              title="Heading:"
              type="text"
              placeholder="Heading"
              onChange={event => (this.heading = event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.TextArea
              id="text"
              title="Content:"
              rows="7"
              placeholder="Write the content of the article here..."
              onChange={event => (this.text = event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Input
              id="image"
              title="Image (link to an online image):"
              type="text"
              placeholder="Image link"
              onChange={event => (this.image = event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Select id="priority" title="Priority:"
                              onChange={event => this.priority = Number(event.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
            </FormGroup.Select>
          </FormGroup>
          <Button.Dark onClick={this.addArticle}>Add article</Button.Dark>
          <Button.Danger onClick={() => history.push('/editarticles')}>Cancel</Button.Danger>
        </Card>
      </div>
    );
  }

  addArticle() {
    if (this.writtenBy === '' || this.heading === '' || this.text === '' || this.image === ''
      || this.priority === 0 || this.categoryId === 0) {
      return null;
    }
    let article = new Article();
    article.timePublished = new Date();
    article.writtenBy = this.writtenBy;
    article.heading = this.heading;
    article.text = this.text;
    article.image = this.image;
    article.priority = this.priority;
    article.categoryId = this.categoryId;

    articleService.addArticle(article)
      .then(history.push('/editarticles'))
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class ArticleEdit extends Component<{ match: { params: { id: number } } }> {
  writtenBy = '';
  heading = '';
  text = '';
  image = '';
  priority: number = 1;
  categoryId: number = 1;

  article = null;
  category = null;

  render() {
    if (!this.article) return null;

    return (
      <div className="container my-4">
        <Card>
          <Card.Title>Edit article:</Card.Title>
          <FormGroup>
            <FormGroup.Select
              id="category"
              title="Category:"
              defaultValue={String(this.article.categoryId)}
              onChange={event => {
                if (this.article) this.article.categoryId = Number(event.target.value);
              }}
            >
              <option value="1">Laptop</option>
              <option value="2">Mobile</option>
              <option value="3">Gaming</option>
              <option value="4">Apps</option>
            </FormGroup.Select>
          </FormGroup>
          <FormGroup>
            <FormGroup.Input
              id="writtenBy"
              title="Written by:"
              type="text"
              placeholder="The person who wrote the article"
              value={this.article.writtenBy}
              onChange={event => {
                if (this.article) this.article.writtenBy = event.target.value;
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Input
              id="header"
              title="Heading:"
              type="text"
              placeholder="Heading"
              value={this.article.heading}
              onChange={event => {
                if (this.article) this.article.heading = event.target.value;
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.TextArea
              id="text"
              title="Content:"
              rows="7"
              placeholder="Write the content of the article here..."
              value={this.article.text}
              onChange={event => {
                if (this.article) this.article.text = event.target.value;
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Input
              id="image"
              title="Image (link to an online image):"
              type="text"
              placeholder="Image link"
              value={this.article.image}
              onChange={event => {
                if (this.article) this.article.image = event.target.value;
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormGroup.Select
              id="priority"
              title="Priority:"
              defaultValue={String(this.article.priority)}
              onChange={event => {
                if (this.article) this.article.priority = Number(event.target.value);
              }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </FormGroup.Select>
          </FormGroup>
          <Button.Dark onClick={this.editArticle}>Save changes</Button.Dark>
          <Button.Danger onClick={() => history.push('/editarticles')}>Cancel</Button.Danger>
        </Card>
      </div>
    );
  }

  mounted() {
    articleService.getArticle(this.props.match.params.id)
      .then(article => this.article = article)
      .catch((error: Error) => Alert.danger(error.message));
  }

  editArticle() {
    if (!this.article) return null;

    if (this.article.writtenBy === '' || this.article.heading === ''
      || this.article.text === '' || this.article.image === '') {
      return null;
    }

    articleService.updateArticle(this.article)
      .then(history.push('/editarticles'))
      .catch((error: Error) => Alert.danger(error.message));
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert/>
        <Menu exact/>
        <Route exact path="/" component={Home}/>
        <Route path="/laptop" component={Category}/>
        <Route path="/mobile" component={Category}/>
        <Route path="/gaming" component={Category}/>
        <Route path="/apps" component={Category}/>
        <Route path="/articles/:id" component={ArticleInfo}/>
        <Route exact path="/editarticles" component={ArticleList}/>
        <Route path="/editarticles/add" component={ArticleAdd}/>
        <Route path="/editarticles/edit/:id" component={ArticleEdit}/>
      </div>
    </HashRouter>,
    root
  );
