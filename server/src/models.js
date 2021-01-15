// @flow

import Sequelize from 'sequelize';
import type { Model } from 'sequelize';

export let sequelize = process.env.CI ? (
  new Sequelize('School', 'root', '', {
    host: 'mysql',
    dialect: 'mysql',
    timezone: '+01:00',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
) : (
  new Sequelize(process.env.DB_NAME, process.env.USERNAME, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    timezone: '+01:00',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
);

export let Categories: Class<Model<{ id?: number, name: string }>> = sequelize.define('Categories', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING
});

export let Articles: Class<Model<{ id?: number, timePublished: string, writtenBy: string, heading: string, text: string, image: string, priority: number, categoryId: number }>> = sequelize.define('Articles', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  timePublished: Sequelize.DATE,
  writtenBy: Sequelize.STRING,
  heading: Sequelize.STRING,
  text: Sequelize.TEXT,
  image: Sequelize.STRING,
  priority: Sequelize.INTEGER,
  categoryId: Sequelize.INTEGER
});

export let Ratings: Class<Model<{ id?: number, value: number, articleId: number }>> = sequelize.define('Ratings', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  value: Sequelize.INTEGER,
  articleId: Sequelize.INTEGER
});

export let Comments: Class<Model<{ id?: number, timePublished: string, nickname: string, text: string, articleId: number }>> = sequelize.define('Comments', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  timePublished: Sequelize.DATE,
  nickname: Sequelize.STRING,
  text: Sequelize.STRING,
  articleId: Sequelize.INTEGER
});

Articles.belongsTo(Categories, { foreignKey: 'categoryId', onDelete: 'cascade'});
Ratings.belongsTo(Articles, { foreignKey: 'articleId', onDelete: 'cascade' });
Comments.belongsTo(Articles, { foreignKey: 'articleId', onDelete: 'cascade'});

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production)
    return Categories.bulkCreate([
      { name: 'Laptop' },
      { name: 'Mobile' },
      { name: 'Gaming' },
      { name: 'Apps' }
    ]).then(() =>
      Articles.bulkCreate([
        {
          timePublished: '2018-11-08 18:36',
          writtenBy: 'Hans Hansen',
          heading: 'New laptop from HP',
          text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
          image: 'https://cdn.mos.cms.futurecdn.net/550709fa268b8fd2d68f71f87aaf07a6.jpg',
          priority: 1,
          categoryId: 1
        },
        {
          timePublished: '2018-11-04 09:02',
          writtenBy: 'Harald Berg',
          heading: 'The top five best student laptops',
          text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
          image: 'http://s1.1zoom.me/b5050/686/362492-commander06_1920x1080.jpg',
          priority: 1,
          categoryId: 1
        },
        {
          timePublished: '2018-10-05 19:47',
          writtenBy: 'Jack Johnson',
          heading: 'New iOS update with a lot of bugs!',
          text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
          image: 'https://i.pinimg.com/originals/d5/84/31/d58431cd37515f48d57312c4c7e5964f.jpg',
          priority: 1,
          categoryId: 2
        },
        {
          timePublished: '2018-11-01 00:01',
          writtenBy: 'Rick Black',
          heading: 'Is this the game of the year 2018?',
          text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
          image: 'https://hdqwalls.com/download/red-dead-redemption-2-62-1920x1080.jpg',
          priority: 1,
          categoryId: 3
        },
        {
          timePublished: '2017-04-22 04:53',
          writtenBy: 'Lars Martinsen',
          heading: '10 interesting apps',
          text: 'Lorem ipsum dolor sit amet, ad officiis menandri est. Porro scripta meliore nam at, et eam solet partem. Te magna affert vocibus sea, ut imperdiet hendrerit consetetur duo, inani albucius contentiones te eam. Vel amet meis facilisi eu. Eam ei populo altera, ex cibo elitr epicuri eam, nec malorum vocibus at.',
          image: 'https://cdn.hipwallpaper.com/i/76/28/B0LneY.jpg',
          priority: 2,
          categoryId: 4
        }
      ])
    ).then(() =>
      Ratings.bulkCreate([
        { value: 5, articleId: 1 },
        { value: 3, articleId: 1 },
        { value: 2, articleId: 2 },
        { value: 3, articleId: 2 },
        { value: 1, articleId: 3 },
        { value: 3, articleId: 3 },
        { value: 5, articleId: 3 },
        { value: 4, articleId: 1 }
      ])
    ).then(() => Comments.bulkCreate([
      {timePublished: '2018-11-06 18:36', nickname: 'Herman Ryen Martinsen', text: 'Good article!', articleId: 1},
      {timePublished: '2018-11-05 17:01', nickname: 'carl', text: 'Very bad article, should be removed!', articleId: 1},
      {timePublished: '2018-11-06 18:36', nickname: 'Petter', text: 'Very nice article!', articleId: 2},
      {timePublished: '2018-11-06 18:36', nickname: 'Gustav', text: 'First!!!', articleId: 3}
    ]));

});
