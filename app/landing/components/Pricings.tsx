import React from "react";

function Pricings() {
  return (
    <div className="w-full h-[90vh] flex sm:flex-row flex-col items-center justify-center md:px-8 p-2 py-8">
      {/* Left side - Text content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-12 mb-8 lg:mb-0">
        <h1 className="text-3xl font-space-grotesk sm:text-4xl lg:text-5xl font-bold text-[#3F3F3F] mb-4 lg:mb-6">
          Pricings
        </h1>
        <p className="text-base sm:text-lg text-[#3F3F3F] leading-relaxed max-w-lg">
          Throughout your customer's entire buying journey, Razor AI allows you
          to delight them at every step of the way, from their first visit to
          the final purchase.
        </p>
      </div>

      {/* Right side - SVG graphics */}
      <div className="md:w-1/2 w-full flex items-center justify-center relative">
        <svg
          viewBox="0 0 932 553"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full hidden sm:block h-full"
        >
          <g filter="url(#filter0_d_868_4)">
            <path
              d="M37.1001 137.729C37.1001 104.592 63.963 77.7287 97.1001 77.7287H281.422C300.373 77.7287 315.736 62.3657 315.736 43.4144C315.736 24.463 331.1 9.09998 350.051 9.09998H589.37C622.791 9.09998 649.77 36.4071 649.366 69.8254L645.758 368.254C645.36 401.106 618.616 427.529 585.762 427.529H443.59C417.705 427.529 396.721 448.513 396.721 474.398C396.721 500.606 375.231 521.721 349.027 521.26L96.0436 516.805C63.3235 516.228 37.1001 489.539 37.1001 456.814V137.729Z"
              fill="url(#paint0_linear_868_4)"
            />
          </g>

          <g filter="url(#filter1_d_868_4)">
            <path
              d="M931.1 137.729C931.1 104.592 904.237 77.7287 871.1 77.7287H686.778C667.827 77.7287 652.464 62.3657 652.464 43.4144C652.464 24.463 637.101 9.09998 618.149 9.09998H378.83C345.409 9.09998 318.43 36.4071 318.834 69.8254L322.443 368.254C322.84 401.106 349.584 427.529 382.438 427.529H524.61C550.495 427.529 571.479 448.513 571.479 474.398C571.479 500.606 592.97 521.721 619.174 521.26L872.157 516.805C904.877 516.228 931.1 489.539 931.1 456.814V137.729Z"
              fill="url(#paint1_linear_868_4)"
            />
          </g>

          <defs>
            <filter
              id="filter0_d_868_4"
              x="9.72748e-05"
              y="-2.47955e-05"
              width="666.47"
              height="566.367"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-10" dy="18" />
              <feGaussianBlur stdDeviation="13.55" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_868_4"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_868_4"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_d_868_4"
              x="308.83"
              y="2.09998"
              width="642.27"
              height="542.167"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="5" dy="8" />
              <feGaussianBlur stdDeviation="7.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_868_4"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_868_4"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_868_4"
              x1="279.6"
              y1="167.1"
              x2="849.1"
              y2="-42.4"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.118178" stopColor="#FAD5A2" />
              <stop offset="1" stopColor="#F9D199" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_868_4"
              x1="660.1"
              y1="293.1"
              x2="269.6"
              y2="177.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="#F9D199" />
            </linearGradient>
          </defs>
        </svg>
        <div className="w-full h-full flex items-center justify-center sm:absolute flex-col sm:flex-row top-0 left-0">
          <div className="w-[10%] h-full "></div>
          <div className="w-[40%] h-[300px] relative p-2 py-6">
            <div className=" sm:text-2xl  font-bold font-space-grotesk">
              Exprince
            </div>
            <div className=" text-[14px] pt-4 text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className="text-white bg-black px-4 py-2 rounded-full text-[14px] font-bold font-space-grotesk bottom-2 absolute">
              buy
            </div>
          </div>
          <div className="w-[50%] h-[300px] mb-20 relative pl-8">
            <div className=" sm:text-2xl font-bold font-space-grotesk">
              Exprince
            </div>
            <div className=" text-[14px] pt-4 text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className="text-white bg-black px-4 py-2 rounded-full text-[14px] font-bold font-space-grotesk bottom-2 absolute">
              buy
            </div>
          </div>
          <div className="w-[50%] h-[300px]  relative p-2 py-6">
            <div className=" sm:text-2xl font-bold font-space-grotesk">
              Exprince
            </div>
            <div className=" text-[14px] pt-4 text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className=" text-[14px] text-[#3F3F3F] leading-relaxed max-w-lg">
              plx
            </div>
            <div className="text-white bg-black px-4 py-2 rounded-full text-[14px] font-bold font-space-grotesk bottom-2 absolute">
              buy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricings;
