import { LoginForm } from "@/components/ui/login-form"
import { Brainlogo } from "@/assets/Brainlogo"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/AuthBackground.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-center px-4 md:px-6 py-8 md:py-12 gap-8 md:gap-12">
        {/* Left Section - Branding */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-5 text-center md:-mt-28 md:-mr-20">
          {/* Logo - Responsive sizing */}
          <div className="w-40 h-40 md:w-64 md:h-64 flex items-center justify-center">
            <Brainlogo className="w-full h-full object-contain"/>
          </div>

          {/* Title - Responsive text size */}
          <h1 className="-mt-6 md:-mt-12 text-4xl md:text-6xl font-['Kavoon'] bg-gradient-to-r from-[#e57a7a] to-[#ef8247] text-transparent bg-clip-text">
            BrainyBox
          </h1>

          {/* Subtitle - Responsive text size */}
          <p className="text-xl md:text-2xl lg:text-4xl font-['lancelot'] text-white font-light max-w-md">
            Cloud for Your Thoughts
          </p>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 flex items-center justify-center w-full px-4 md:px-0">
          <LoginForm className="w-full max-w-[400px]" />
        </div>
      </div>
    </div>
  )
}