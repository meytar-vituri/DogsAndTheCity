
function handle(request, response) {
  const localStorage = window.localStorage;
  let path = request.path;
  if (path === '/') {
      localStorage.setItem(349387598, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים מדהימה","coords":{"lat":"32.090625","lng":"34.776295"}}));
      localStorage.setItem(349387597, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים עובדיה הנביא","coords":{"lat":"32.093861 ","lng":"34.777291"}}));
      localStorage.setItem(349387596, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים עובדיה בילטמור","coords":{"lat":"32.088810","lng":"34.787687"}}));
      localStorage.setItem(349387595, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים עובדיה אוסישקין","coords":{"lat":"32.095292","lng":"34.781428"}}));
      localStorage.setItem(349387594, JSON.stringify({"type":"Veterinarian" ,"description":"טלי אברהם, וטרינרית","coords":{"lat":"32.090631","lng":"34.776009"}}));

    path += 'index.html';
  }
  if (path === '/add_point') {
    localStorage.setItem(request.param.id, request.param.data);
    response.sendJSON({ 'status': 'ok' });

  } else if (path === '/all_points') {
    const allPoints = { ...localStorage };
    response.sendJSON(allPoints);

  } else if (path === '/delete_point'){
    localStorage.removeItem(request.param.id);
    response.sendJSON({ 'status': 'ok' })
  
  } else if (path === '/delete_all'){
    localStorage.clear();
    response.sendJSON({ 'status': 'ok' })
  } else {
    getFile('public' + path).subscribe(file => {
      response.sendFile(file);
    }, err => {
      response.sendText('Page not found');
    });
  }
}
