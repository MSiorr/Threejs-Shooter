import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import controller.MapServiceImpl
import spark.Request
import spark.Response
import spark.Spark
import spark.kotlin.*
import model.Level
import spark.Spark.staticFileLocation
import java.lang.Exception
import java.sql.DriverManager

val mapServiceImpl = MapServiceImpl()
val conn = DriverManager.getConnection("jdbc:h2:file:./mainBase")

data class Row(val id: Int, val nick: String, val score: Int, val time: Int, val level: String){}

fun main() {

    port(5000)
    staticFileLocation("/public")

//    get("/") {  }
//    get("/game") { }
//    get("/editor") {  }
    post("/add") { addLeveL(response, request) }
    post("/load") { loadLevel(response, request) }

    get("/getLeaderboard") { loadLeaderboard(response, request) }
    post("/addRecord") { addRecord(response, request) }

    after {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        response.header("Access-Control-Allow-Headers", "*")
    }
}

fun addLeveL(res: Response, req: Request) : String {
    val type = object : TypeToken<Level>() {}.type
    val levelData : Level = Gson().fromJson(req.body(), type)
    mapServiceImpl.addLevel(levelData)
    return Gson().toJson(true)
}

fun loadLevel(res: Response, req: Request) : String {
    res.type("application/json");
    val levelData = mapServiceImpl.loadLevel()
    return Gson().toJson(levelData)
}

fun loadLeaderboard(res: Response, req: Request) : String {
    res.type("application/json")
    return try {
        val stmt = conn.createStatement()
        var rs = stmt.executeQuery("SELECT * FROM FPSRecords")
        val myHashMap = HashMap<Int, Row>()
        while (rs.next()) {
            val row = Row(
                rs.getString("id").toInt(),
                rs.getString("nick"),
                rs.getString("score").toInt(),
                rs.getString("time").toInt(),
                rs.getString("level")
            )
            myHashMap.put(rs.getString("id").toInt(), row)
        }
        Gson().toJson(myHashMap)
    } catch (e: Exception) {
        e.message.toString()
    }
}

fun addRecord(res: Response, req: Request) : String {



    res.type("text/plain")
    return try {
        val stmt = conn.createStatement()

        val type = object : TypeToken<Row>() {}.type
        val recordData : Row = Gson().fromJson(req.body(), type)

        val nick = recordData.nick;
        val score = recordData.score;
        val time = recordData.time;
        val level = recordData.level;

        stmt.execute("INSERT INTO FPSRecords (nick, score, time, level) VALUES ('$nick', $score, $time, '$level')")
        Gson().toJson("one record added")
    } catch (e: Exception) {
        println(e.message.toString())
        e.message.toString()
    }
}