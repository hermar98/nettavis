// @flow

import { Categories, Articles, Ratings, Comments, sync } from '../src/models.js';

beforeAll(async () => {
  await sync;
});

describe('Categories test', () => {
  it('correct data', async () => {
    let categories = await Categories.findAll();
    expect(
      categories.map(category => category.toJSON()).map(category => ({
        id: category.id,
        name: category.name
      }))
    ).toEqual([
      { id: 1, name: 'Laptop' },
      { id: 2, name: 'Mobile' },
      { id: 3, name: 'Gaming' },
      { id: 4, name: 'Apps' }
    ]);
  });
});

describe('Articles test', () => {
  it('correct data', async () => {
    let articles = await Articles.findAll();
    expect(
      articles.map(article => article.toJSON()).map(article => ({
        id: article.id,
        timePublished: article.timePublished,
        writtenBy: article.writtenBy,
        heading: article.heading,
        text: article.text,
        image: article.image,
        priority: article.priority,
        categoryId: article.categoryId
      }))
    ).toEqual([
      {
        id: 1,
        timePublished: new Date('2018-11-08 18:36'),
        writtenBy: 'Hans Hansen',
        heading: 'New laptop from HP',
        text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
        image: 'https://cdn.mos.cms.futurecdn.net/550709fa268b8fd2d68f71f87aaf07a6.jpg',
        priority: 1,
        categoryId: 1
      },
      {
        id: 2,
        timePublished: new Date('2018-11-04 09:02'),
        writtenBy: 'Harald Berg',
        heading: 'The top five best student laptops',
        text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
        image: 'http://s1.1zoom.me/b5050/686/362492-commander06_1920x1080.jpg',
        priority: 1,
        categoryId: 1
      },
      {
        id: 3,
        timePublished: new Date('2018-10-05 19:47'),
        writtenBy: 'Jack Johnson',
        heading: 'New iOS update with a lot of bugs!',
        text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
        image: 'https://i.pinimg.com/originals/d5/84/31/d58431cd37515f48d57312c4c7e5964f.jpg',
        priority: 1,
        categoryId: 2
      },
      {
        id: 4,
        timePublished: new Date('2018-11-01 00:01'),
        writtenBy: 'Rick Black',
        heading: 'Is this the game of the year 2018?',
        text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
        image: 'https://hdqwalls.com/download/red-dead-redemption-2-62-1920x1080.jpg',
        priority: 1,
        categoryId: 3
      },
      {
        id: 5,
        timePublished: new Date('2017-04-22 04:53'),
        writtenBy: 'Lars Martinsen',
        heading: '10 interesting apps',
        text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
        image: 'https://cdn.hipwallpaper.com/i/76/28/B0LneY.jpg',
        priority: 2,
        categoryId: 4
      }
    ]);
  });
});

describe('Ratings test', () => {
  it('correct data', async () => {
    let ratings = await Ratings.findAll();
    expect(
      ratings.map(rating => rating.toJSON()).map(rating => ({
        id: rating.id,
        value: rating.value,
        articleId: rating.articleId
      }))
    ).toEqual([
      { id: 1, value: 5, articleId: 1 },
      { id: 2, value: 3, articleId: 1 },
      { id: 3, value: 2, articleId: 2 },
      { id: 4, value: 3, articleId: 2 },
      { id: 5, value: 1, articleId: 3 },
      { id: 6, value: 3, articleId: 3 },
      { id: 7, value: 5, articleId: 3 },
      { id: 8, value: 4, articleId: 1 }
    ]);
  });
});

describe('Comments test', () => {
  it('correct data', async () => {
    let comments = await Comments.findAll();
    expect(
      comments.map(comment => comment.toJSON()).map(comment => ({
        id: comment.id,
        timePublished: comment.timePublished,
        nickname: comment.nickname,
        text: comment.text,
        articleId: comment.articleId
      }))
    ).toEqual([
      {id: 1, timePublished: new Date('2018-11-06 18:36'), nickname: 'Herman Ryen Martinsen', text: 'Good article!', articleId: 1},
      {id: 2, timePublished: new Date('2018-11-05 17:01'), nickname: 'carl', text: 'Very bad article, should be removed!', articleId: 1},
      {id: 3, timePublished: new Date('2018-11-06 18:36'), nickname: 'Petter', text: 'Very nice article!', articleId: 2},
      {id: 4, timePublished: new Date('2018-11-06 18:36'), nickname: 'Gustav', text: 'First!!!', articleId: 3}
    ]);
  });
});
