package main

import (
	"fmt"

	"github.com/maru1005/nyain-sweeper/game"
)

func main() {
	g := game.NewGame(1, 3)

	fmt.Println("==== 開ける前 ===")
	printBoard(g)

	g.OpenCell(0, 1)

	fmt.Println("==== (0,1)を開けた後 ===")
	printBoard(g)

	g.ToggleMark(0, 0)
	fmt.Println(g.Board[0][0].IsMarked)
	g.ToggleMark(0, 0)
	fmt.Println(g.Board[0][0].IsMarked)
}

func printBoard(g *game.Game) {
	for _, row := range g.Board {
		for _, cell := range row {

			if cell.HasMine {
				fmt.Print("🐱 ")
			} else if cell.IsOpen {
				fmt.Printf("%d ", cell.Adjacent)
			} else {
				fmt.Print("？ ")
			}
		}
		fmt.Println()
	}
}
