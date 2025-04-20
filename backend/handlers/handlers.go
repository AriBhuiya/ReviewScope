package handlers

import "github.com/aribhuiya/backend/db"

var dal db.DAL

func SetDAL(d db.DAL) {
	dal = d
}
