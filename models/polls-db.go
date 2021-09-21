package models

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type DBModel struct {
	DB *sql.DB
}

func (m *DBModel) Get(id string) (*Poll, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, ques from poll where id = $1
	`

	row := m.DB.QueryRowContext(ctx, query, id)

	var poll Poll

	err := row.Scan(
		&poll.ID,
		&poll.Ques,
	)

	if err != nil {
		return nil, err
	}

	query = `select
				pc.id, pc.poll_id, pc.category_id, c.category_name
			from
				poll_category pc
				left join category c on (c.id = pc.category_id)
			where
				pc.poll_id = $1
	`
	rows1, _ := m.DB.QueryContext(ctx, query, id)
	defer rows1.Close()

	var categories []PollCategory
	for rows1.Next() {
		var pc PollCategory
		err := rows1.Scan(
			&pc.ID,
			&pc.PollID,
			&pc.CategoryID,
			&pc.Category.CategoryName,
		)
		if err != nil {
			return nil, err
		}
		categories = append(categories, pc)
	}

	poll.PollCategory = categories

	query = `select
				ppo.id, ppo.poll_id, ppo.polloptions_id, po.name
			from
				poll_polloptions ppo
				left join polloptions po on (po.id = ppo.polloptions_id)
			where
				ppo.poll_id = $1
	`
	rows2, _ := m.DB.QueryContext(ctx, query, id)
	defer rows2.Close()

	var polloption []Poll_PollOptions
	for rows2.Next() {
		var ppo Poll_PollOptions
		err := rows2.Scan(
			&ppo.ID,
			&ppo.PollID,
			&ppo.PollOptionsID,
			&ppo.PollOptions.Name,
		)
		if err != nil {
			return nil, err
		}
		polloption = append(polloption, ppo)
	}

	poll.Poll_PollOptions = polloption

	return &poll, nil
}

func (m *DBModel) All(category ...int) ([]*Poll, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	where := ""
	if len(category) > 0 {
		where = fmt.Sprintf("where id in (select poll_id from poll_category where category_id = %d)", category[0])
	}

	query := fmt.Sprintf(`select id, ques from poll %s order by ques`, where)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var polls []*Poll

	for rows.Next() {
		var poll Poll
		err := rows.Scan(
			&poll.ID,
			&poll.Ques,
		)
		if err != nil {
			return nil, err
		}

		categoryQuery := `select
			pc.id, pc.poll_id, pc.category_id, c.category_name
		from
			poll_category pc
			left join category c on (c.id = pc.category_id)
		where
			pc.poll_id = $1
		`

		categoryRows, _ := m.DB.QueryContext(ctx, categoryQuery, poll.ID)

		var categories []PollCategory
		for categoryRows.Next() {
			var pc PollCategory
			err := categoryRows.Scan(
				&pc.ID,
				&pc.PollID,
				&pc.CategoryID,
				&pc.Category.CategoryName,
			)
			if err != nil {
				return nil, err
			}
			categories = append(categories, pc)
		}
		categoryRows.Close()
		poll.PollCategory = categories

		optionsQuery := `select
			ppo.id, ppo.poll_id, ppo.polloptions_id, po.name, po.votes, po.count
		from
			poll_polloptions ppo
			left join polloptions po on (po.id = ppo.polloptions_id)
		where
			ppo.poll_id = $1
		`
		optionsRows, _ := m.DB.QueryContext(ctx, optionsQuery, poll.ID)

		var options []Poll_PollOptions
		for optionsRows.Next() {
			var ppo Poll_PollOptions
			err := optionsRows.Scan(
				&ppo.ID,
				&ppo.PollID,
				&ppo.PollOptionsID,
				&ppo.PollOptions.Name,
				&ppo.PollOptions.Votes,
				&ppo.PollOptions.Count,
			)
			if err != nil {
				return nil, err
			}
			options = append(options, ppo)

		}
		optionsRows.Close()
		poll.Poll_PollOptions = options
		polls = append(polls, &poll)
	}

	return polls, nil
}

func (m *DBModel) CategoriesAll() ([]*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, category_name from category order by category_name`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []*Category

	for rows.Next() {
		var c Category
		err := rows.Scan(
			&c.ID,
			&c.CategoryName,
		)
		if err != nil {
			return nil, err
		}
		categories = append(categories, &c)
	}

	return categories, nil
}

func (m *DBModel) InsertPoll(poll Poll) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt1 := `insert into poll (id, ques) values ($1, $2)`

	_, err := m.DB.ExecContext(ctx, stmt1,
		poll.ID,
		poll.Ques,
	)
	if err != nil {
		log.Println(err)
		return err
	}

	for _, ele := range poll.Poll_PollOptions {
		stmt2 := `insert into poll_polloptions
				(id, poll_id, polloptions_id)
				values ($1, $2, $3)`

		_, err1 := m.DB.ExecContext(ctx, stmt2,
			ele.ID,
			ele.PollID,
			ele.PollOptionsID,
		)
		if err1 != nil {
			log.Println(err1)
			return err1
		}

		stmt3 := `insert into polloptions
				(id, name, ogpollid, votes, count)
				values ($1, $2, $3, $4, $5)`

		_, err2 := m.DB.ExecContext(ctx, stmt3,
			ele.PollOptions.ID,
			ele.PollOptions.Name,
			ele.PollOptions.OgPollID,
			ele.PollOptions.Votes,
			ele.PollOptions.Count,
		)
		if err2 != nil {
			log.Println(err2)
			return err2
		}
	}

	for _, ele := range poll.PollCategory {
		stmt4 := `insert into poll_category
				(id, poll_id, category_id)
				values ($1, $2, $3)`

		_, err3 := m.DB.ExecContext(ctx, stmt4,
			ele.ID,
			ele.PollID,
			ele.CategoryID,
		)
		if err3 != nil {
			log.Println(err3)
			return err3
		}
	}

	return nil
}

func (m *DBModel) InsertUser(reguser RegUser) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt := `insert into "user" (id, name, email, password) values ($1, $2, $3, $4)`

	_, err := m.DB.ExecContext(ctx, stmt,
		reguser.ID,
		reguser.Name,
		reguser.Email,
		reguser.Password,
	)
	if err != nil {
		log.Println(err)
		return err
	}
	log.Println(reguser)
	return nil

}

func (m *DBModel) GetUserByID(id string) (*RegUser, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, name, email, password form "user" where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var u RegUser
	err := row.Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.Password,
	)
	if err != nil {
		return nil, err
	}

	return &u, nil

}

func (m *DBModel) Authenticate(email, password string) (string, string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var name string
	var hashedPassword string

	row := m.DB.QueryRowContext(ctx, `select name, password from "user" where email = $1`, email)
	err := row.Scan(&name, &hashedPassword)

	if err != nil {
		return name, "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return "0", "", errors.New("incorrect password")
	} else if err != nil {
		return "0", "", err
	}

	return name, hashedPassword, nil
}

func (m *DBModel) InsertOptions(ele Poll_PollOptions) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	stmt1 := `insert into poll_polloptions
				(id, poll_id, polloptions_id)
				values ($1, $2, $3)`

	_, err1 := m.DB.ExecContext(ctx, stmt1,
		ele.ID,
		ele.PollID,
		ele.PollOptionsID,
	)
	if err1 != nil {
		log.Println(err1)
		return err1
	}

	stmt2 := `insert into polloptions
				(id, name, ogpollid, votes, count)
				values ($1, $2, $3, $4, $5)`

	_, err2 := m.DB.ExecContext(ctx, stmt2,
		ele.PollOptions.ID,
		ele.PollOptions.Name,
		ele.PollOptions.OgPollID,
		ele.PollOptions.Votes,
		ele.PollOptions.Count,
	)
	if err2 != nil {
		log.Println(err2)
		return err2
	}

	return nil
}

func (m *DBModel) UpdateVote(ele []Poll_PollOptions) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	for _, ele := range ele {
		if ele.PollOptions.VotedBy != nil {

			stmt := `update polloptions set
				votes = $2, votedby = votedby || $3 where name = $1`

			_, err := m.DB.ExecContext(ctx, stmt,
				ele.PollOptions.Name,
				ele.PollOptions.Votes,
				pq.Array(ele.PollOptions.VotedBy),
			)
			if err != nil {
				log.Println(err)
				return err
			}
		}
	}

	return nil
}
