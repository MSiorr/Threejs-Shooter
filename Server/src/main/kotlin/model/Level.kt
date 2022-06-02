package model

data class Level(
    var size:Int = 10,
    var list:MutableList<LevelItem> = mutableListOf<LevelItem>()
)