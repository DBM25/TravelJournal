import React, { useState } from "react";
import { BookOpen, Sparkles, Palette, Share2 } from "lucide-react";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import bgImage from "../assets/landing-bg.webp";

const Landing = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => setIsLoginMode(!isLoginMode);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* background blur */}
      <div className="min-h-screen w-full bg-white/50 backdrop-blur-[4px] flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">


            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                  <BookOpen className="w-12 h-12 text-primary-600" />
                  <h1 className="text-4xl font-bold text-gray-900">
                    MyTravelJournal
                  </h1>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Your Travel Stories,
                  <span className="text-primary-600 block">
                    Beautifully Crafted
                  </span>
                </h2>

                <p className="text-lg text-gray-1000 mb-8 leading-relaxed">
                  Create stunning, interactive travel journal stories with our
                  intuitive visual editor. Add text, images, videos, and audio
                  to capture your adventures with style.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Interactive Editor
                    </h3>
                    <p className="text-sm text-gray-600">
                      Drag, resize, and rotate elements anywhere on your page
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-secondary-100 p-2 rounded-lg">
                    <Palette className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Rich Content
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add text, images, videos, and audio to your travel stories
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-accent-100 p-2 rounded-lg">
                    <Share2 className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Travel Memories
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create and manage your collection of travel journal
                      entries
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="bg-success-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy to Use</h3>
                    <p className="text-sm text-gray-600">
                      Intuitive interface designed for effortless creativity
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
                {isLoginMode ? (
                  <LoginForm onToggleMode={toggleMode} />
                ) : (
                  <RegisterForm onToggleMode={toggleMode} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
