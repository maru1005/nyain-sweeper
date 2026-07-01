package main

import (
	"fmt"

	"github.com/maru1005/nyain-sweeper/game"
)

func main() {
	g := game.NewGame(1, 3)
	fmt.Println(g.ID)
	fmt.Println(g.Level)
	fmt.Println(g.Status)

	// 盤目の地雷確認
	for _, row := range g.Board {
		for _, cell := range row {
			if cell.HasMine {
				fmt.Print("🐱")
			} else {
				fmt.Print("・ ")
			}
		}
		fmt.Println()
	}
}
