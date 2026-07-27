import AuthLayout from "../components/common/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import logo from "../assets/logo.png";
import lockImg from "../assets/lock-illustration.png"; // Or car image if preferred

const LoginPage = () => {
  return (
    <AuthLayout showCar={false} showLogo={false}>
      <div className="w-full h-full max-w-[1300px] mx-auto px-6 lg:px-12 flex items-center justify-between relative z-20">
        
        {/* Left Side: Scaled Logo & Brand Graphic */}
        <div className="hidden md:flex flex-col items-start gap-10">
          
          {/* Logo Group */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="ATR Logo"
              className="w-28 lg:w-36 xl:w-40 h-auto object-contain shrink-0"
            />
            
            <div className="flex flex-col justify-center text-left leading-none">
              <span className="text-[#CD051F] font-black text-4xl lg:text-5xl uppercase tracking-tight mb-1">
                ATR
              </span>
              <span className="text-white font-extrabold text-3xl lg:text-4xl uppercase tracking-wider whitespace-nowrap">
                AUTOMOTIVE
              </span>
            </div>
          </div>

          {/* Side Graphic */}
          <div className="pl-1">
            <img
              src={lockImg}
              alt="Brand Graphic"
              className="w-[280px] lg:w-[340px] h-auto object-contain pointer-events-none drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side: Dark Form Card Container */}
        <div className="w-full md:w-[460px] lg:w-[480px] shrink-0">
          <LoginForm />
        </div>

      </div>
    </AuthLayout>
  );
};

export default LoginPage;