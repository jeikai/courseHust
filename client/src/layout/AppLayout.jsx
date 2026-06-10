import Footer from "../components/Footer"
import Header from "../components/header/Header"
import ChatWidget from "../components/ChatWidget"

const AppLayout = ({children}) => {
  return (
    <>
        <Header />
          {children}
        <Footer />
        <ChatWidget />
    </>
  )
}

export default AppLayout