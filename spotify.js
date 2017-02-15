var getFromApi = function(endpoint, query) {
   const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
   Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
   return fetch(url).then(function(response) {
       if (!response.ok) {
           return Promise.reject(response.statusText);
       }
       return response.json();
   });
};


var artist;
var getArtist = function(name) {

    const query = {
        q: name,
        limit: 1,
        type: 'artist'
    };

    return getFromApi('search', query).then(response =>{
    	artist = response.artists.items[0];
    	const query2 = {
    		id: artist.id
    	}
    	return getFromApi(`artists/${query2.id}/related-artists`,query2);

    }).then(response => {
    	console.log(response);
  	  artist.related = response.artists;
  	  console.log(artist.related);
      let promises = [];
  	  for (var i = 0; i < artist.related.length; i++) {
  	  	var artistId = artist.related[i].id
  	  	var artistPromise = getFromApi(`artists/${artistId}/top-tracks`, {country: "US"});
        promises.push(artistPromise);
  	  }

    	return Promise.all(promises);
    }).then(response => {
        artist.related.forEach((artist,i) => {
          artist.tracks = response[i].tracks;
        })
        return artist;
    })
};
