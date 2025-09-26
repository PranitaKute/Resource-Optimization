import './index.css';
import styles from './style';
import { Navbar, LandingPage, Features, HowItWorks, Ready, FAQ, Footer } from './components';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Verify from './components/Verify/Verify';
import Login from './components/Auth/Login';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';

function App() {

  return (
    <div className='bg-primary w-full overflow-hidden'>
      
      {/* Navbar */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar/>
        </div>
        <Login/>
      </div>

      <Routes>
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <div id="home" className={`bg-primary ${styles.flexStart} section-anchor`}>
              <div className={`${styles.boxWidth}`}>
                <LandingPage/>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className={`bg-primary ${styles.paddingX} ${styles.flexStart} section-anchor`}>
              <div className={`${styles.boxWidth}`}>
                <Features/>
              </div>
            </div>

            {/* How it Works */}
            <div id="how-it-works" className={`bg-primary ${styles.paddingX} ${styles.flexStart} section-anchor`}>
              <div className={`${styles.boxWidth}`}>
                <HowItWorks/>
              </div>
            </div>

            {/* Ready Section */}
            <div className={`bg-primary ${styles.paddingX} ${styles.flexStart} section-anchor`}>
              <div className={`${styles.boxWidth}`}>
                <Ready/>
              </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className={`bg-primary ${styles.paddingX} ${styles.flexStart} section-anchor`}>
              <div className={`${styles.boxWidth}`}>
                <FAQ/>
              </div>
            </div>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>

    </div>
  )
}

export default App
