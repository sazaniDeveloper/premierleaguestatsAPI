const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const app = express()

const PORT = 3300

const url = "https://www.premierleague.com/stats"


const player = {
    top_goalscorer: {
        player:"",
        club: "",
        goals: "",
    }, 
    top_playermaker: {
        player:"",
        club: "",
        assists: ""
    },
    most_clean_sheets:{
        player: "",
        club: "",
        clean_sheets: ""
    }
}

const club = {
    most_goals:{
        club:"",
        goals:""
    },
    most_wins:{
        club:"",
        wins:"",
    },
    most_losses:{
        club:"",
        loses:""
    }
}

const league_table = {
    1:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    2:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    3:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    4:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    5:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    6:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    7:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    8:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    9:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    10:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    11:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    12:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    13:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    14:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    15:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    16:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    17:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    18:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    19:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },
    20:{
        team:"",
        points:"",
        goals_scored: "",
        goals_conceded: ""
    },

}

app.get("/", (req,res)=>{
    res.send("I am going to build a Premier League Stats API!")
})


app.get("/playerStats", (req,res) =>{
    axios.get(url).then(response=>{
        const html = response.data;
        const $ = cheerio.load(html)

        // Player Stats 
        const top_stats_last = $(".top-stats__hero-last").text()
        const first_name_array =[]
        const last_name_array = top_stats_last.split(" ").filter(string => string.length > 0)
        const top_stats_club = $(".top-stats__hero-club-name").text().split(" ").filter(n=>n)
        const stats = $(".top-stats__hero-stat").text().split("\n").map(element => element.trim()).filter(n => n)

        // Splicing
        stats.splice(2,1)
        top_stats_club.splice(2,1)
        last_name_array.splice(2,1)

        const player_stats = stats.slice(0,3)
        const club_stats = stats.slice(3,8);

        const club_names = []


       // Club Names
       $(".top-stats").find(".top-stats__hero-club-name").each(function(){
           var clubName = $(this).text();
           club_names.push(clubName)
       });

       // First Name
       $(".top-stats").find(".top-stats__hero-first").each(function(){
         var firstName = $(this).text();
        first_name_array.push(firstName)
        });

       club_names.splice(2,1)
       club_stats.splice(1,1)

       const properties = ["top_goalscorer","top_playermaker","most_clean_sheets"]
       const statistics = ["goals","assists","clean_sheets"]
      
       for(var i=0; i<properties.length; i++){
            player[properties[i]]["player"]=first_name_array[i]+last_name_array[i]
            player[properties[i]][statistics[i]]=player_stats[i]
            player[properties[i]]["club"]=club_names[i].trim()
       }

        res.json(player)
    })
})


app.get("/clubStats", (req,res) => {
    axios.get(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html)

        const stats = $(".top-stats__hero-stat").text().split("\n").map(element => element.trim()).filter(n => n)
  
        const club_stats = stats.slice(4,8)
        club_stats.splice(1,1)

        const club_statistics= ["most_goals","most_wins","most_losses"]
        const goals_wins_losses = ["goals","wins","loses"]

        const player_club_names = []

        $(".top-stats").find(".top-stats__hero-name").each(function() {
            var clubName = $(this).text();
            player_club_names.push(clubName)
        });

        player_club_names.splice(1,1)

        for(var i=0; i<club_statistics.length; i++){
            club[club_statistics[i]][goals_wins_losses[i]]=club_stats[i]
            club[club_statistics[i]]["club"]=player_club_names[i]
        }

        res.json(club)
    })
})

const premier_league_table = "https://www.premierleague.com/tables"

app.get("/table", (req,res)=> {
    axios.get(premier_league_table).then(response => {
        const html = response.data
        const $ = cheerio.load(html) 
        const current_league_table = []
        $(".league-table__team.team").find(".league-table__team-name.league-table__team-name--long.long").each(function(){     
            var club = $(this).text()
            current_league_table.push(club)
        })
        const points = [] 
        $(".league-table__tbody.isPL").find('.league-table__points.points').each(function(){
            var point = $(this).text()
            points.push(point)
            for (i=1; i<21; i++){
                league_table[i]["team"]=current_league_table[i-1]
                league_table[i]["points"]=points[i-1]
            }
        })
        const goals_scored_conceded_array = []
        const result = [];
        $(".league-table__tbody.isPL").find(".hideSmall").each(function(){      
            var goals_scored_conceded = $(this).text()
            goals_scored_conceded_array.push(goals_scored_conceded)    
        })
        for (let i = 0; i < 40; i+=2) {
            result.push([goals_scored_conceded_array[i], goals_scored_conceded_array[i + 1]]);
        }
        for(var i=1; i<21; i++){
            league_table[i]["goals_scored"]=result[i-1][0]
        }
        for(var i=1; i<21; i++){
            league_table[i]["goals_conceded"]=result[i-1][1]
        }
        res.json(league_table)
    })
})


app.listen(PORT, (res,req)=>{
    console.log(`API is running on ${PORT}`)
})



