// @flow
import axios from 'axios';

axios.interceptors.response.use(response => response.data);

export class Category {
  id: number;
  name: string;
}

export class Article {
  id: number;
  timePublished: Date;
  writtenBy: string;
  heading: string;
  text: string;
  image: string;
  priority: number;
  categoryId: number;
  rating: number;
}

export class Rating {
  id: number;
  value: number;
  articleId: number;
}

export class Comment {
  id: number;
  timePublished: Date;
  nickname: string;
  text: string;
  articleId: number;
}

class CategoryService {
  getCategories(): Promise<Category[]> {
    return axios.get('/categories');
  }

  getCategory(id: number): Promise<Category> {
    return axios.get('/categories/' + id);
  }
}

class ArticleService {
  getArticles(): Promise<Article[]> {
    return axios.get('/articles');
  }

  getArticlesByPriority(priority: number, limit?: number): Promise<Article[]> {
    if (limit) {
      return axios.get('/articles?priority=' + priority + '&limit=' + limit);
    }
    return axios.get('/articles?priority=' + priority);
  }

  getArticlesByCategory(categoryId: number, limit?: number): Promise<Article[]> {
    if (limit) {
      return axios.get('/articles?categoryId=' + categoryId + '&limit=' + limit);
    }
    return axios.get('/articles?categoryId=' + categoryId);
  }

  getArticle(id: number): Promise<Article> {
    return axios.get('/articles/' + id);
  }

  addArticle(article: Article): Promise<void> {
    return axios.post('/articles', article);
  }

  updateArticle(article: Article): Promise<void> {
    return axios.put('/articles/' + article.id, article);
  }

  deleteArticle(article: Article): Promise<void> {
    return axios.delete('/articles/' + article.id);
  }
}

class RatingService {
  getRatings(articleId: number): Promise<Rating> {
    return axios.get('/articles/' + articleId + '/ratings');
  }

  addRating(rating: Rating): Promise<void> {
    return axios.post('/articles/' + rating.articleId + '/ratings', rating);
  }
}

class CommentService {
  getComments(articleId: number): Promise<Comment[]> {
    return axios.get('/articles/' + articleId + '/comments');
  }

  addComment(comment: Comment): Promise<void> {
    return axios.post('/articles/:articleId/comments', comment);
  }
}

export let categoryService = new CategoryService();
export let articleService = new ArticleService();
export let ratingService = new RatingService();
export let commentService = new CommentService();
