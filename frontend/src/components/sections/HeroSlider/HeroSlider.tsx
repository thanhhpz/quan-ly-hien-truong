"use client";

import React, { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    img: "/images/banner/banner-1.png",
    titleSmall: "ĐIỆN LẠNH",
    titleLarge: "",
    year: "2026",
    duration: "Phản hồi 15 phút",
    season: "Khu vực Quận 7",
    looks: "45 KTV",
    tag: "Khẩn cấp",
    desc: "Sửa chữa điều hòa, tủ lạnh, máy giặt tại nhà và doanh nghiệp. Cam kết phản hồi trong 15 phút, xử lý trong 1 giờ.",
    btnText: "Đặt lịch ngay",
  },
  {
    id: 2,
    img: "/images/banner/banner-2.png",
    titleSmall: "HỆ THỐNG ĐIỆN",
    titleLarge: "",
    year: "2026",
    duration: "Phản hồi 30 phút",
    season: "Toàn thành phố",
    looks: "60 KTV",
    tag: "Doanh nghiệp",
    desc: "Xử lý sự cố điện, lắp đặt hệ thống điện cho tòa nhà, bệnh viện, trường học. Hợp đồng bảo trì định kỳ.",
    btnText: "Xem dịch vụ",
  },
  {
    id: 3,
    img: "/images/banner/banner-3.png",
    titleSmall: "CẤP THOÁT NƯỚC",
    titleLarge: "",
    year: "2026",
    duration: "Phản hồi 1 giờ",
    season: "Khu vực nội thành",
    looks: "38 KTV",
    tag: "Chung cư",
    desc: "Sửa rò rỉ, thông tắc, lắp đặt hệ thống nước cho hộ dân và chung cư. Đội ngũ kỹ thuật viên chuyên nghiệp.",
    btnText: "Xem dịch vụ",
  },
  {
    id: 4,
    img: "/images/banner/banner-4.png",
    titleSmall: "BẢO TRÌ",
    titleLarge: "ĐỊNH KỲ",
    year: "2026",
    duration: "Theo hợp đồng",
    season: "Khách doanh nghiệp",
    looks: "Hợp đồng dài hạn",
    tag: "SLA",
    desc: "Dịch vụ bảo trì định kỳ cho bệnh viện, trường học, tòa nhà văn phòng. Cam kết SLA nghiêm ngặt.",
    btnText: "Liên hệ hợp đồng",
  },
  {
    id: 5,
    img: "/images/banner/banner-5.png",
    titleSmall: "SỬA CHỮA",
    titleLarge: "KHẨN CẤP",
    year: "2026",
    duration: "24/7",
    season: "Toàn thành phố",
    looks: "200 KTV",
    tag: "Hỏa tốc",
    desc: "Đội ngũ kỹ thuật viên trực 24/7, sẵn sàng xử lý sự cố khẩn cấp mọi lúc mọi nơi. Gọi là có mặt.",
    btnText: "Gọi ngay 1900 xxxx",
  },
];
const getResponsiveTransform = (positionClass: string) => {
  let transform = "";
  let opacity = 1;
  let zIndex = 0;
  
  switch (positionClass) {
    case "active":
      transform = "translateX(0) scale(1.15)";
      opacity = 1;
      zIndex = 10;
      break;
    case "prev":
      transform = "translateX(-200px) scale(0.9)";
      opacity = 0.8;
      zIndex = 8;
      break;
    case "next":
      transform = "translateX(200px) scale(0.9)";
      opacity = 0.8;
      zIndex = 8;
      break;
    case "hide-left":
      transform = "translateX(-380px) scale(0.7)";
      opacity = 0.35;
      zIndex = 5;
      break;
    case "hide-right":
      transform = "translateX(380px) scale(0.7)";
      opacity = 0.35;
      zIndex = 5;
      break;
    default:
      return null;
  }
  
  return { transform, opacity, zIndex };
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(2);
  const [isClient, setIsClient] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getClass = (index: number) => {
    const prev = (current - 1 + slides.length) % slides.length;
    const next = (current + 1) % slides.length;
    const hideLeft = (current - 2 + slides.length) % slides.length;
    const hideRight = (current + 2) % slides.length;

    if (index === current) return "active";
    if (index === prev) return "prev";
    if (index === next) return "next";
    if (index === hideLeft) return "hide-left";
    if (index === hideRight) return "hide-right";
    return "";
  };

  const getTransformStyle = (positionClass: string) => {
    if (!isClient) {
      return getResponsiveTransform(positionClass);
    }
    
    const baseStyle = getResponsiveTransform(positionClass);
    if (!baseStyle) return null;
    
    let { transform, opacity, zIndex } = baseStyle;
    const width = windowSize.width;
    
    if (width <= 640) {
      if (positionClass === "prev") transform = "translateX(-110px) scale(0.9)";
      else if (positionClass === "next") transform = "translateX(110px) scale(0.9)";
      else if (positionClass === "hide-left") transform = "translateX(-200px) scale(0.7)";
      else if (positionClass === "hide-right") transform = "translateX(200px) scale(0.7)";
    } else if (width <= 968) {
      if (positionClass === "prev") transform = "translateX(-140px) scale(0.9)";
      else if (positionClass === "next") transform = "translateX(140px) scale(0.9)";
      else if (positionClass === "hide-left") transform = "translateX(-260px) scale(0.7)";
      else if (positionClass === "hide-right") transform = "translateX(260px) scale(0.7)";
    } else if (width <= 1200) {
      if (positionClass === "prev") transform = "translateX(-170px) scale(0.9)";
      else if (positionClass === "next") transform = "translateX(170px) scale(0.9)";
      else if (positionClass === "hide-left") transform = "translateX(-320px) scale(0.7)";
      else if (positionClass === "hide-right") transform = "translateX(320px) scale(0.7)";
    }
    
    return { transform, opacity, zIndex };
  };

  const currentSlide = slides[current];

  return (
    <section
      className="relative w-full min-h-screen flex justify-center items-center overflow-hidden bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${currentSlide.img})`,
        transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.4, 1.2)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#291C0E]/85 via-[#291C0E]/40 to-[#291C0E]/60 backdrop-blur-[3px] z-[1]"></div>

      <div className="max-w-[1400px] w-full mx-auto px-[60px] grid grid-cols-[45%_55%] items-center gap-10 relative z-[5] max-lg:px-10 max-lg:gap-[30px] max-md:grid-cols-1 max-md:text-center max-md:gap-[60px] max-md:px-[30px] max-md:py-[60px]">
        
        {/* Left Content */}
        <div className="text-white z-[5] max-md:text-center">
          <div className="text-xs tracking-[6px] uppercase text-[#A78D78] font-light mb-5">
            COLLECTION 2025
          </div>
          
          <div className="mb-4">
            {currentSlide.titleLarge ? (
              <>
                <h2 className="text-2xl font-normal tracking-[8px] text-[#BEB5A9] mb-2 max-md:text-lg">
                  {currentSlide.titleSmall}
                </h2>
                <h1 className="text-7xl font-bold tracking-[-0.02em] bg-gradient-to-r from-white to-[#A78D78] bg-clip-text text-transparent max-md:text-5xl">
                  {currentSlide.titleLarge}
                </h1>
              </>
            ) : (
              <h1 className="text-6xl font-bold tracking-[-0.02em] bg-gradient-to-r from-white to-[#A78D78] bg-clip-text text-transparent max-md:text-5xl">
                {currentSlide.titleSmall}
              </h1>
            )}
          </div>

          <div className="text-sm text-[#A78D78] font-mono mb-5">
            <span>{currentSlide.year}</span>
            <span className="mx-3">/</span>
            <span>{currentSlide.duration}</span>
          </div>

          <div className="w-[60px] h-[2px] bg-[#A78D78] my-5 max-md:mx-auto"></div>
          
          <div className="flex gap-6 text-xs text-[#BEB5A9] font-light tracking-[1.5px] mb-5 max-md:justify-center">
            <span>{currentSlide.season}</span>
            <span>{currentSlide.looks}</span>
            <span>{currentSlide.tag}</span>
          </div>
          
          <p className="text-sm leading-relaxed text-[#BEB5A9] max-w-[380px] mb-[30px] max-md:max-w-full max-md:mx-auto">
            {currentSlide.desc}
          </p>
          
          <div className="flex gap-4 flex-wrap max-md:justify-center">
            <button className="h-12 px-7 bg-[#A78D78] text-[#291C0E] text-[11px] tracking-[2.5px] uppercase font-semibold transition-all duration-300 hover:bg-[#6E473B] hover:text-white hover:-translate-y-[2px] hover:shadow-lg">
              {currentSlide.btnText}
            </button>
            <button className="h-12 px-7 bg-transparent border-[1.5px] border-[#BEB5A9] text-white text-[11px] tracking-[2.5px] uppercase font-semibold transition-all duration-300 hover:bg-[#A78D78] hover:text-[#291C0E] hover:border-[#A78D78] hover:-translate-y-[2px]">
              Xem Lookbook
            </button>
          </div>
        </div>

        {/* Right Slider */}
        <div className="relative w-full z-[5]">
          <div className="relative w-full h-[500px] flex justify-center items-center max-lg:h-[450px] max-md:h-[400px] max-sm:h-[350px]">
            {slides.map((slide, index) => {
              const positionClass = getClass(index);
              const transformStyle = getTransformStyle(positionClass);
              
              if (!transformStyle) return null;
              
              const cardSize = {
                width: isClient && windowSize.width <= 640 ? 170 : 
                       isClient && windowSize.width <= 968 ? 200 :
                       isClient && windowSize.width <= 1200 ? 230 : 260,
                height: isClient && windowSize.width <= 640 ? 255 :
                       isClient && windowSize.width <= 968 ? 300 :
                       isClient && windowSize.width <= 1200 ? 345 : 390,
              };
              
              return (
                <div
                  key={slide.id}
                  className="absolute overflow-hidden transition-all duration-600 cursor-pointer shadow-2xl"
                  style={{
                    width: `${cardSize.width}px`,
                    height: `${cardSize.height}px`,
                    transform: transformStyle.transform,
                    opacity: transformStyle.opacity,
                    zIndex: transformStyle.zIndex,
                    transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
                  }}
                  onClick={() => setCurrent(index)}
                >
                  <img 
                    src={slide.img} 
                    alt={slide.titleSmall} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#291C0E]/90 to-transparent flex justify-between items-end">
                    <h2 className={`text-white text-lg tracking-[2px] font-semibold ${positionClass === "active" ? "text-xl tracking-[3px] max-sm:text-base" : "max-sm:text-sm"}`}>
                      {slide.titleSmall}
                      {slide.titleLarge && ` ${slide.titleLarge}`}
                    </h2>
                    <span className="text-[#A78D78] text-xs font-mono">{slide.year}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots indicator */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current 
                    ? "bg-[#A78D78] scale-130 shadow-[0_0_6px_rgba(167,141,120,0.5)]" 
                    : "bg-[#BEB5A9]/40"
                }`}
                style={{ transform: idx === current ? "scale(1.3)" : "scale(1)" }}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .duration-600 {
          transition-duration: 600ms;
        }
        .scale-130 {
          transform: scale(1.3);
        }
        .group-hover\\:scale-105:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}