require.config({paths:{jquery:"../../lib/jquery",media_player_oembed:"../../eu/media/search-oembed-viewer"}}),require(["jquery"],function(a){require(["media_player_oembed"],function(b){"undefined"!=typeof play_html?(play_html=a("<div />").html(play_html).text(),b.init(a(".oembed-container"),play_html)):console.log("main oembed molecule expects play_html")})});