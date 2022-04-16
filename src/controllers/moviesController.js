const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const {validationResult} = require('express-validator')


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
            }).catch((error)=> console.log(error))
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            }).catch((error)=> console.log(error));
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
        Genres.findAll()
        .then (allGenres => {
            res.render('moviesAdd',{
                allGenres
            })
        })
    },
    create: function (req,res) {
        const errors = validationResult(req)
        if(errors.isEmpty()){
            const {title,rating,awards, release_date, length, genre_id}=req.body
            Movies.create({//Recibe propiedades
                title,
                rating,
                awards,
                release_date,
                length, 
                genre_id
            })
            .then((movie) => {//captura los datos
            res.redirect('/movies')
            })
            .catch((error)=> console.log(error))
        }
        else{
            Genres.findAll()
        .then (allGenres => {
            res.render('moviesAdd',{
                allGenres,
                errors: errors.mapped(),
                old: req.body
            })
        })
        }
    },
    edit: function(req,res) {
        const movie = Movies.findByPk(req.params.id)
        const genres = Genres.findAll()

        Promise.all([movies, genres])
        .then(([Movie,allGenres]) => {
            res.render('moviesEdit',{
                Movie,
                allGenres
            })
        })
        .catch((error)=> console.log(error))
    },
    update: function (req,res) {
        const errors = validationResult(req)
        if(errors.isEmpty()){
            const {title,rating,awards, release_date, length, genre_id}=req.body
            Movies.create({//Recibe propiedades
                title,
                rating,
                awards,
                release_date,
                length, 
                genre_id
            },{
                where: {
                    id: req.params.id
                }
            })
            .then((movie) => {//captura los datos
            res.redirect('/movies')
            })
            .catch((error)=> console.log(error))
        }
        else{
            const movie = Movies.findByPk(req.params.id)
        const genres = Genres.findAll()

        Promise.all([movies, genres])
        .then(([Movie,allGenres]) => {
            res.render('moviesEdit',{
                Movie,
                allGenres,
                errors: errors.mapped(),
                old:req.body
                })
            })
            .catch((error)=> console.log(error))
        }
    },
    delete: function (req,res) {
        Movies.findByPk(req.params.id)
        .then((Movie)=>{
            res.render('moviesDelete',{
                Movie
            })
        })
    },
    destroy: function (req,res) {
        Movies.destroy({
            where: {
                id:req.params.id
            }
        })
        .then((result) => {
            if(result){
                res.redirect('/movies')
            }
        })
        .catch((error)=> console.log(error))
    }   
}

module.exports = moviesController;