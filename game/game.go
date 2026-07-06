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
