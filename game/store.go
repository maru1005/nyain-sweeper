package game

import "sync"

type Store struct {
	mu    sync.Mutex
	games map[string]*Game
}

func NewStore() *Store {
	return &Store{
		games: make(map[string]*Game),
	}
}

func (s *Store) Save(g *Game) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.games[g.ID] = g
}

func (s *Store) Get(id string) (*Game, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	g, ok := s.games[id]
	return g, ok
}
