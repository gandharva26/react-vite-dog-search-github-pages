// import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import LoginForm from './LoginForm';
import { Search } from "./Search";


function App() {

  const onSubmitUsername = (username: string, email: string) =>
  alert(
    `You entered: ${username} and Email ${email}, You are being redirected to Search Page`
  );

  return (
    <BrowserRouter
      basename={'/react-vite-gh-pages/'}
    >

<Routes>
        <Route path= {`/`} element={<LoginForm onSubmit={onSubmitUsername} />} />
        <Route path ={ `/search`} element={<Search />} />
      </Routes>


    
    </BrowserRouter>
  )
}

export default App
