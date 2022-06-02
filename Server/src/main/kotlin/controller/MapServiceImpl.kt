package controller

import model.Level

class MapServiceImpl : MapService {
    override var level: Level = Level()

    override fun addLevel(levelData: Level) {
        level = levelData
    }

    override fun loadLevel(): Level? {
        return level
    }
}