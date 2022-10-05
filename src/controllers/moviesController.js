const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd");
      },
      create: async function (req, res) {
        try {
          const newMovie = await db.Movie.create({
            title: req.body.title,
            rating: req.body.rating,
            length: req.body.length,
            awards: req.body.awards,
            release_date: req.body.release_date,
          });
          console.log({ newMovie });
          res.redirect("/movies");
        } catch (error) {
          console.log(error);
        }
      },
      edit: async function (req, res) {
        try {
          const Movie = await db.Movie.findByPk(req.params.id);
    
          let date = new Date(Movie.dataValues.release_date).toISOString(); //2010-10-04T00:00:00.000Z
          date = date.split("T");
          date = date[0];
          console.log({ date });
          Movie.dataValues.release_date = date;
          res.render("moviesEdit", { Movie });
        } catch (error) {
          console.log(error);
          res.redirect("/movies");
        }
      },
      update: async function (req, res) {
        try {
          const newMovie = await db.Movie.update(
            {
              title: req.body.title,
              rating: req.body.rating,
              length: req.body.length,
              awards: req.body.awards,
              release_date: req.body.release_date,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          );
          res.redirect("/movies");
        } catch (error) {
          console.log(error);
        }
      },
      delete: async function (req, res) {
        try {
          const Movie = await db.Movie.findByPk(req.params.id);
    
          res.render("moviesDelete", { Movie });
        } catch (error) {
          console.log(error);
        }
      },
      destroy: async function (req, res) {
        try {
          // await db.ActorMovie.destroy({ where: {movie_id: req.params.id}})
          await db.Movie.destroy({
            where: {
              id: req.params.id,
            },
          });
          res.redirect("/movies");
        } catch (error) {
          console.log(error);
        }
      },
}

module.exports = moviesController;