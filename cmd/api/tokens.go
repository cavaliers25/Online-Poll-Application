package main

import (
	"backend/models"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
)

type registerCredentials struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (app *application) register(w http.ResponseWriter, r *http.Request) {
	var creds registerCredentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		app.errorJSON(w, errors.New("Unauthorized"))
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(creds.Password), 14)

	var reguser models.RegUser
	reguser.ID = creds.ID
	reguser.Name = creds.Name
	reguser.Email = creds.Email
	reguser.Password = string(password)

	log.Println(creds)

	err = app.models.DB.InsertUser(reguser)

	if err != nil {
		app.errorJSON(w, err)
		return
	}

	ok := jsonResp{
		OK: true,
	}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

type loginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (app *application) login(w http.ResponseWriter, r *http.Request) {
	var creds loginCredentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		app.errorJSON(w, errors.New("Unauthorized"))
		return
	}
	// log.Println(creds)
	name, _, err := app.models.DB.Authenticate(creds.Email, creds.Password)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprintf(name)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "mydomain.com"
	claims.Audiences = []string{"mydomain.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(app.config.jwt.secret))
	if err != nil {
		app.errorJSON(w, errors.New("Error signin"))
		return
	}

	app.writeJSON(w, http.StatusOK, string(jwtBytes), "response")

}
