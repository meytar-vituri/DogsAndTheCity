function handle(request, response) {
  const localStorage = window.localStorage;
  let path = request.path;
  if (path === '/') {
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
