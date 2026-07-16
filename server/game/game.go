package game

import (
	"fmt"
	"math/rand"
	"time"
)

type Cell struct {
	HasMine  bool `json:"-"`
	IsOpen   bool `json:"isOpen"`
	IsMarked bool `json:"isMarked"`
	Adjacent int  `json:"adjacent"`
}

type Game struct {
	ID      string   `json:"id"`
	Board   [][]Cell `json:"board"`
	Status  string   `json:"status"`
	Level   int      `json:"level"`
	CatType string   `json:"catType"`
}

type CellResponse struct {
	HasMine  bool `json:"hasMine,omitempty"`
	IsOpen   bool `json:"isOpen"`
	IsMarked bool `json:"isMarked"`
	Adjacent int  `json:"adjacent"`
}

type GameResponse struct {
	ID      string           `json:"id"`
	Board   [][]CellResponse `json:"board"`
	Status  string           `json:"status"`
	Level   int              `json:"level"`
	CatType string           `json:"catType"`
}

var mineCounts = []int{0, 3, 5, 7, 9, 12, 20, 24, 28, 33, 58}

func NewGame(level int) *Game {
	size := level + 4
	mineCount := mineCounts[level]

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

// 地雷の場所　ランダム
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

// 全マスの周囲地雷数を計算　Boardに保存
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

// セルを開けた時の処理　連鎖
func (g *Game) OpenCell(row, col int) {
	cell := &g.Board[row][col]

	if cell.IsOpen || cell.IsMarked {
		return // すでに空いているor旗があるなら何もしない
	}

	cell.IsOpen = true // マスを開ける

	if cell.HasMine {
		g.Status = "lost"
		return //地雷なら終了
	}

	if cell.Adjacent == 0 { // 周囲に地雷がない0マス
		size := len(g.Board)
		for _, dr := range []int{-1, 0, 1} {
			for _, dc := range []int{-1, 0, 1} {
				r := row + dr
				c := col + dc
				if r >= 0 && r < size && c >= 0 && c < size {
					g.OpenCell(r, c) //周囲8マスに自分自身を呼ぶ
				}

			}
		}
	}
	g.checkWin()
}

// 勝敗判定
func (g *Game) checkWin() {
	for _, row := range g.Board {
		for _, cell := range row {
			if !cell.HasMine && !cell.IsOpen {
				return // !地雷　!マス開いて => まだ勝ちでない
			}
		}
	}
	g.Status = "won"
}

// 🐾マークのON/OFF
func (g *Game) ToggleMark(row, col int) {
	cell := &g.Board[row][col]
	if cell.IsOpen {
		return
	}
	cell.IsMarked = !cell.IsMarked
}

func (g *Game) ToResponse() GameResponse {
	board := make([][]CellResponse, len(g.Board))
	for r, row := range g.Board {
		board[r] = make([]CellResponse, len(row))
		for c, cell := range row {
			board[r][c] = CellResponse{
				HasMine:  g.Status == "lost" && cell.HasMine,
				IsOpen:   cell.IsOpen,
				IsMarked: cell.IsMarked,
				Adjacent: cell.Adjacent,
			}
		}
	}
	return GameResponse{
		ID:      g.ID,
		Board:   board,
		Status:  g.Status,
		Level:   g.Level,
		CatType: g.CatType,
	}
}
