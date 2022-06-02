package controller

import model.Level

interface MapService {
    var level: Level
    fun addLevel(levelData: Level)
    fun loadLevel(): Level?
}