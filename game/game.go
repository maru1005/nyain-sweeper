package game

import (
	"fmt"
	"math/rand"
	"time"
)

type Cell struct {
	HasMine  bool
	IsOpen   bool
	IsMarked bool
	Adjacent int
}

type Game struct {
	ID      string
	Board   [][]Cell
	Status  string
	Level   int
	CatType string
}

func NewGame(level int, mineCount int) *Game {
	size := level + 4

	board := make([][]Cell, size)
	for i := range board {
		board[i] = make([]Cell, size)
	}

	g := &Game{
		ID:     generateID(),
		Level:  level,
		Status: "playing",
		Board:  board,
	}

	g.placeMines(mineCount)
	return g
}

func generateID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}

func (g *Game) placeMines(mineCount int) {
	rows := len(g.Board)
	cols := len(g.Board[0])

	placed := 0
	for placed < mineCount {
		row := rand.Intn(rows)
		col := rand.Intn(cols)
		if !g.Board[row][col].HasMine {
			g.Board[row][col].HasMine = true
			placed++
		}
	}
}
