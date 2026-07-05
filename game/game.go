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
	g.calcAdjacent()
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

func (g *Game) calcAdjacent() {
	size := len(g.Board)
	for row := 0; row < size; row++ {
		for col := 0; col < size; col++ {
			if g.Board[row][col].HasMine {
				continue
			}
			count := 0
			for _, dr := range []int{-1, 0, 1} {
				for _, dc := range []int{-1, 0, 1} {
					r := row + dr
					c := col + dc
					if r >= 0 && r < size && c >= 0 && c < size {
						if g.Board[r][c].HasMine {
							count++
						}
					}
				}
			}
			g.Board[row][col].Adjacent = count
		}
	}
}

func (g *Game) OpenCell(row, col int) {
	cell := &g.Board[row][col]

	if cell.IsOpen || cell.IsMarked {
		return
	}

	cell.IsOpen = true
	if cell.HasMine {
		g.Status = "lost"
		return
	}

	if cell.Adjacent == 0 {
		size := len(g.Board)
		for _, dr := range []int{-1, 0, 1} {
			for _, dc := range []int{-1, 0, 1} {
				r := row + dr
				c := col + dc
				if r >= 0 && r < size && c >= 0 && c < size {
					g.OpenCell(r, c)
				}

			}
		}
	}
}
