import React from "react";

function Requirement() {
  // array of cards atleast 20
  const cards = [
    {
      id: 1,
      bgColor: "bg-blue-500",
      text: "Requirement",
    },
    {
      id: 2,
      bgColor: "bg-yellow-500",
      text: "Creation",
    },
    {
      id: 3,
      bgColor: "bg-green-500",
      text: "Requirement",
    },
    {
      id: 4,
      bgColor: "bg-red-500",
      text: "Creation",
    },
    {
      id: 5,
      bgColor: "bg-purple-500",
      text: "Requirement",
    },
    {
      id: 6,
      bgColor: "bg-orange-500",
      text: "Creation",
    },
    {
      id: 7,
      bgColor: "bg-pink-500",
      text: "Requirement",
    },
    {
      id: 8,
      bgColor: "bg-gray-500",
      text: "Creation",
    },
    {
      id: 9,
      bgColor: "bg-brown-500",
      text: "Requirement",
    },
    {
      id: 10,
      bgColor: "bg-black-500",
      text: "Creation",
    },
    {
      id: 11,
      bgColor: "bg-white-500",
      text: "Requirement",
    },
    {
      id: 12,
      bgColor: "bg-gray-500",
      text: "Creation",
    },
    {
      id: 13,
      bgColor: "bg-black-500",
      text: "Requirement",
    },
    {
      id: 14,
      bgColor: "bg-white-500",
      text: "Creation",
    },
    {
      id: 15,
      bgColor: "bg-gray-500",
      text: "Requirement",
    },
    {
      id: 16,
      bgColor: "bg-black-500",
      text: "Creation",
    },
    {
      id: 17,
      bgColor: "bg-white-500",
      text: "Requirement",
    },
    {
      id: 18,
      bgColor: "bg-gray-500",
      text: "Creation",
    },
    {
      id: 19,
      bgColor: "bg-black-500",
      text: "Requirement",
    },
    {
      id: 20,
      bgColor: "bg-white-500",
      text: "Creation",
    },
  ];

  // Create infinite loop by duplicating cards array multiple times
  // This ensures seamless scrolling even with smaller arrays
  const createInfiniteCards = (
    originalCards: typeof cards,
    times: number = 4
  ) => {
    const infiniteCards = [];
    for (let i = 0; i < times; i++) {
      infiniteCards.push(
        ...originalCards.map((card, index) => ({
          ...card,
          id: `${i}-${card.id}`,
          originalIndex: index,
          globalIndex: i * originalCards.length + index, // Continuous index across all sets
        }))
      );
    }
    return infiniteCards;
  };

  const infiniteCards = createInfiniteCards(cards, 4);
  return (
    <>
      <style jsx>
        {`
          @keyframes snake-wave {
            0% { transform: translateY(0px); }
            25% { transform: translateY(-20px); }
            50% { transform: translateY(0px); }
            75% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
          }
          .snake-card {
            animation: snake-wave 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          }
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .scroll-container {
            display: flex;
            animation: scroll-left 20s linear infinite;
          }
          @keyframes scroll-left-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .scroll-container-reverse {
            display: flex;
            animation: scroll-left-reverse 20s linear infinite;
          }
        `}
      </style>
      <div className="w-full h-[80vh]  flex flex-col items-center justify-center">
        {/* Top Row */}
        <div className="w-full h-[30%]  items-center overflow-hidden flex flex-row relative">
          <div className="scroll-container">
            {infiniteCards?.map((d, i) => (
              <div
                key={`top-${i}`}
                className="w-[70px]  snake-card h-[100px] relative rounded-lg flex-shrink-0 mx-4"
                style={{
                  animationDelay: `${i * -0.2}s`, // Negative delay for instant wave
                }}
              >
                <div className="w-[70px] h-[100px] relative bg-black top-2 rounded-lg left-2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Text */}
        <div className="w-[40%] h-[40%] font-space-grotesk flex text-center flex-col items-center justify-center">
          <div className="text-[30px] font-bold">Requirement</div>
          <div className="text-[30px] font-bold">or</div>
          <div className="text-[30px] font-bold">Creation</div>
        </div>

        {/* Bottom Row */}
        <div className="w-full h-[30%] items-center overflow-hidden flex flex-row relative">
          <div className="scroll-container-reverse">
            {infiniteCards?.map((d, i) => (
              <div
                key={`bottom-${i}`}
                className="w-[70px] snake-card h-[100px] relative rounded-lg flex-shrink-0 mx-4"
                style={{
                  animationDelay: `${i * -0.2}s`,
                }}
              >
                <div className="w-[70px] h-[100px] relative bg-black top-2 rounded-lg left-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Requirement;
