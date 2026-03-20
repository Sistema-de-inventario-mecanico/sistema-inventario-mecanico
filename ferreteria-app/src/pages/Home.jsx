const handleLogin = (e) => {
  e.preventDefault()
  
  if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
    localStorage.setItem('isAdmin', 'true')
    navigate('/admin')
  } 
  else if (loginCredentials.username === 'oficina' && loginCredentials.password === 'oficina123') {
    localStorage.setItem('isOficina', 'true')
    navigate('/oficina')
  }
  else if (loginCredentials.username === 'area' && loginCredentials.password === 'area123') {
    localStorage.setItem('isArea', 'true')
    navigate('/area')
  }
  else {
    alert('Credenciales incorrectas')
  }
}