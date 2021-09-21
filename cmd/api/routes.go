package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (app *application) routes() http.Handler {
	router := httprouter.New()
	secure := alice.New(app.checkToken)

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	router.HandlerFunc(http.MethodGet, "/v1/poll/:id", app.getOnePoll)
	router.HandlerFunc(http.MethodGet, "/v1/polls", app.getAllPolls)
	router.HandlerFunc(http.MethodGet, "/v1/polls/:category_id", app.getAllPollsByCategory)
	router.HandlerFunc(http.MethodGet, "/v1/categories", app.getAllCategories)
	// router.HandlerFunc(http.MethodPost, "/v1/create", app.createPoll)
	router.POST("/v1/create", app.wrap(secure.ThenFunc(app.createPoll)))
	// router.GET("/v1/categories", app.wrap(secure.ThenFunc(app.getAllCategories)))
	// router.GET("/v1/polls/:category_id", app.wrap(secure.ThenFunc(app.getAllPollsByCategory)))
	// router.GET("/v1/polls", app.wrap(secure.ThenFunc(app.getAllPolls)))
	// router.GET("/v1/poll/:id", app.wrap(secure.ThenFunc(app.getOnePoll)))

	router.HandlerFunc(http.MethodPost, "/v1/update", app.updatePoll)
	router.HandlerFunc(http.MethodPost, "/v1/updateVote", app.updateVote)
	router.HandlerFunc(http.MethodPost, "/v1/register", app.register)
	router.HandlerFunc(http.MethodPost, "/v1/login", app.login)

	return app.enableCORS(router)
}
