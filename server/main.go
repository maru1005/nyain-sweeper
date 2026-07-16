package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/maru1005/nyain-sweeper/game"
)

var store = game.NewStore()

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST"},
		AllowHeaders: []string{"Content-Type"},
	}))

	r.POST("/game/new", handleNewGame)
	r.GET("/game/:id/open", handleGetGame)
	r.POST("/game/:id/open", handleOpenCell)
	r.POST("/game/:id/mark", handleToggleMark)

	r.Run(":8080")
}

func handleNewGame(c *gin.Context) {
	var req struct {
		Level int `json:"level"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	g := game.NewGame(req.Level)
	store.Save(g)
	c.JSON(200, g.ToResponse())
}

func handleGetGame(c *gin.Context) {
	id := c.Param("id")
	g, ok := store.Get(id)
	if !ok {
		c.JSON(404, gin.H{"error": "game not found"})
		return
	}
	c.JSON(200, g.ToResponse())
}

func handleOpenCell(c *gin.Context) {
	id := c.Param("id")
	g, ok := store.Get(id)
	if !ok {
		c.JSON(404, gin.H{"error": "game not found"})
		return
	}

	var req struct {
		Row int `json:"row"`
		Col int `json:"col"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	g.OpenCell(req.Row, req.Col)
	c.JSON(200, g.ToResponse())
}

func handleToggleMark(c *gin.Context) {
	id := c.Param("id")
	g, ok := store.Get(id)
	if !ok {
		c.JSON(404, gin.H{"error": "game not found"})
		return
	}

	var req struct {
		Row int `json:"row"`
		Col int `json:"col"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	g.ToggleMark(req.Row, req.Col)
	c.JSON(200, g.ToResponse())
}
