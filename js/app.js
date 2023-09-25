$(document).ready(function(){
    
    /*
    Buscar discos: https://api.spotify.com/v1/search   // type: 'album',
    Buscar artistas: https://api.spotify.com/v1/search   // type: 'artist',
    Buscar cancion: https://api.spotify.com/v1/search   // type: 'song'
    */
    //alert("probando");
   //$('#rp-q-a').bind("click",abrir);
   //$('#rp-q-b').bind("click",abrir);
   //$('#rp-q-t').bind("click",);
   $('#btnCerrar').bind("click",cerrar);
    function convertirDuracion(duracionms){
        var segundos = Math.floor((duracionms/1000)%60),
        minutos = Math.floor((duracionms/(1000*60))%60);
        minutos =(minutos<10) ? "0" + minutos : minutos;
        segundos =(segundos<10) ? "0" + segundos : segundos;
        return minutos + ":" + segundos
   
    }
   
    $("#btnBuscar").on('click',function(e){
        e.preventDefault();

        $.ajax({
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            data: {
                client_id: '259962f9c85b44e5866da2ab7d916aec',
                client_secret: 'b176a8e3521a454da6079d3d62fd7f65',
                grant_type: 'client_credentials'
            }
        }).always(function(resp){
            var token = resp.access_token;
    
            var query = $("#buscar").val();

            if(query){
                $('#respuesta').html('');
                $.ajax({
                    url: 'https://api.spotify.com/v1/search',
                    data: {
                        q: query,
                        type: 'album,artist,track',
                        access_token: token
                    },
                    success: function (response) {
                        
                    //Separamos los datos en cada bloque
                    var albums    = response.albums.items;
                    var artistas  = response.artists.items;
                    var canciones = response.tracks.items;

                    $('#rp-q-a').html('');
                    $('#rp-q-b').html('');
                    $('#rp-q-t').html('');

                    $("#rp-q-a").append('<span class="tituloColumna">Album buscados</span>');
                    $("#rp-q-b").append('<span class="tituloColumna">Artistas</span>');
                    $("#rp-q-t").append('<span class="tituloColumna">Canciones</span>');

                    //Buble que arma albums
                    for (var index = 0; index < albums.length; index++) {
                        var element = albums[index];
                        
                        let {artists,href,id,images,name,release_date,total_tracks,uri} = element;
                        
                        let imagenURL;
                        if(images[0]){
                                imagenURL = images[0].url;
                        }else{
                            imagenURL = '/img/vinyl-record.svg';
                        }

                        let template = `<div class="contenedor-album">
                                            <img src="${imagenURL}" />
                                            <div class="contenedor-datos-album">
                                                <h2>${name}</h2>
                                                <span>${artists[0].name}</span>
                                            </div>
                                        </div>`;

                        //let nombreArtista = $(`<p>Artista encontrado: ${artists[0].name}</p>`);                           

                        $('#rp-q-a').append(template);
    
                    }
                    
                    //bucle que arma artistas
                    for (let index = 0; index < artistas.length; index++) {
                        const artista = artistas[index];
                        
                        // external_urls: {spotify: "https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2"}
                        // followers: {href: null, total: 16027079}
                        // genres: (5) ["british invasion", "classic rock", "merseybeat", "psychedelic rock", "rock"]
                        // href: "https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2"
                        // id: "3WrFJ7ztbogyGnTHbHJFl2"
                        // images: (3) [{…}, {…}, {…}]
                        // name: "The Beatles"
                        // popularity: 90
                        // type: "artist"
                        // uri: "spotify:artist:3WrFJ7ztbogyGnTHbHJFl2"
                        
                        let {external_urls,followers,name,popularity,images} = artista;
                        let imagenURL;
                        if(images[0]){
                                imagenURL = images[0].url;
                        }else{
                            imagenURL = '/img/banda.svg';
                        }
                        
                        let template = `<div class="contenedor-artista">
                                            <img src="${imagenURL}" />
                                            <div class="contenedor-artista-datos">
                                            <h2>${name}</h2>
                                            <span>Seguidores: ${followers.total}</span>
                                            </div>
                                        </div>`;

                        $('#rp-q-b').append(template);

                    }
                    for (let index = 0; index < canciones.length; index++) {
                        const cancion = canciones[index];
                        let{name,artists,popularity,album,disc_number,duration_ms,href,external_urls,external_ids,preview_url,linked_from,id}= cancion
                        console.log(cancion);
                        let duracion = convertirDuracion(duration_ms)
                        /*et template = `<div class="contenedor-canciones">
                            <h2>${name}</h2>
                            <span class="nombre-artista"> <strong>Artista:</strong> ${artists[0].name}</span>
                            <span class="nombre-album"> <strong>Album:</strong> ${album.name}</span>
                            <span class="popularidad"> <strong>Popularidad:</strong> ${popularity}</span>                                            
                            <span class="duracion"> <strong>Duración:</strong> ${duracion}</span>
                        </div>`;*/

                        let template2 = `<div class="contenedor-canciones" onclick="ArmarIframe('${id}')">
                            <h2>${name}</h2>
                            <span class="nombre-artista"> <strong>Artista:</strong> ${artists[0].name}</span>
                            <span class="nombre-album"> <strong>Album:</strong> ${album.name}</span>
                            <span class="popularidad"> <strong>Popularidad:</strong> ${popularity}</span>                                            
                            <span class="duracion"> <strong>Duración:</strong> ${duracion}</span>
                        </div>`;

                        $('#rp-q-t').append(template2);
                    }
                }
                
        });
            }else{
                alert('La busqueda no puede estar vacía!');
            }
        });
    });
});
                
function ArmarIframe(id){
    //if ($("#popupContenedor").css("display")=="none")
    var miIframe =`<iframe width="100%" height="100%"src="reproductor2.html?idcancion=${id}" frameborder=0'></iframe>`;
    var botonYPopup = '<div class="popup" id="miPopup"> <button id="btnCerrar">X</button> </div>';
    $("#1").html("");
    $("#1").append(botonYPopup);
    $("#miPopup").append(miIframe);
    $('#btnCerrar').bind("click",cerrar);
    $("#1").css("display","flex");    
  }
  function cerrar(){
    //if ($("#popupContenedor").css("display")=="none")
    $("#1").css("display","none");
  }
  