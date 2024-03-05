import Footer from "../components/Footer"
import Header from "../components/header/Header"

const AppLayout = ({children}) => {
  return (
    <>
        <Header />
          {children}
        <Footer />
    </>
  )
}

export default AppLayout