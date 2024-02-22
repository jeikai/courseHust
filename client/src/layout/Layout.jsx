import Footer from "../components/Footer"
import Header from "../components/header/Header"

const Layout = ({children}) => {
  return (
    <>
        <Header />
        
        {children}
        
        <Footer />
    </>
  )
}

export default Layout