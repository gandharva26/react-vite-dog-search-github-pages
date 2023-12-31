// import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import './App.css'
import LoginForm from './LoginForm';
import { Search } from "./Search";


function App() {

  const onSubmitUsername = (username: string, email: string): void   =>
  alert(
    `You entered: ${username} and Email ${email}, You are being redirected to Search Page`
  );

  return (
    <HashRouter
   
      
    >

<Routes>
        <Route path= {`/`} element={<LoginForm onSubmit={onSubmitUsername} />} />
        <Route path ={ `/search`} element={<Search />} />
      </Routes>


    

    </HashRouter>
  )
}

export default App
