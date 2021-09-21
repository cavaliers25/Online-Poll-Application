package models

import (
	"database/sql"
)

type Models struct {
	DB DBModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		DB: DBModel{DB: db},
	}
}

type PollOptions struct {
	ID       string   `json:"-"`
	Name     string   `json:"name"`
	OgPollID string   `json:"-"`
	Votes    int      `json:"votes"`
	Count    int      `json:"count"`
	VotedBy  []string `json:"votedby"`
}

type Poll struct {
	ID               string             `json:"id"`
	Ques             string             `json:"ques"`
	Poll_PollOptions []Poll_PollOptions `json:"options"`
	PollCategory     []PollCategory     `json:"category"`
}

type Category struct {
	ID           int    `json:"-"`
	CategoryName string `json:"category_name"`
}

type PollCategory struct {
	ID         int      `json:"-"`
	PollID     string   `json:"-"`
	CategoryID int      `json:"-"`
	Category   Category `json:"category"`
}

type Poll_PollOptions struct {
	ID            string      `json:"-"`
	PollID        string      `json:"-"`
	PollOptionsID string      `json:"-"`
	PollOptions   PollOptions `json:"polloptions"`
}

type RegUser struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
