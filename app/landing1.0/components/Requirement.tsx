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
          @keyframes card {
            0% {
              left: 40%;
              top: 80%;
            }
            100% {
              top: 10%;
              left: 80%;
            }
          }
          .animate-card {
            position: relative;
            animation: card 2s ease-in-out forwards;
          }
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            display: flex;
            animation: scroll-left 30s linear infinite;
          }

          @keyframes scroll-left-reverse {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
          .scroll-container-reverse {
            display: flex;
            animation: scroll-left-reverse 30s linear infinite;
          }
          @keyframes card-snake {
            0% {
              transform: translate(0%, 0%);
            }
            25% {
              transform: translate(25%, 50%);
            }
            50% {
              transform: translate(50%, 0%);
            }
            75% {
              transform: translate(75%, 50%);
            }
            100% {
              transform: translate(100%, 0%);
            }
          }
          .card-snake {
            position: relative;
            animation: card-snake 2s ease-in-out infinite;
          }
            @keyframes card-snake {
            0% {
              transform: translate(100%, 0%);
            }
            25% {
              transform: translate(75%, 50%);
            }
            50% {
              transform: translate(50%, 0%);
            }
            75% {
              transform: translate(25%, 50%);
            }
            100% {
              transform: translate(0%, 0%);
            }
          }
          .card-snake-reverse {
            position: relative;
            animation: card-snake-reverse 2s ease-in-out infinite;
          }
        `}
      </style>
      <div className="w-full h-[80vh]  flex flex-col items-center justify-center">
        <div className="w-full h-[30%] overflow-hidden flex flex-row gap-10  relative">
          <div className="scroll-container flex flex-row gap-10">
            {/* {cards?.map((d, i) => (
              <div
                key={d.id}
                className="w-[70px] h-[100px] relative bg-blue-500 rounded-lg flex-shrink-0"
              >
                <div className="w-[70px] h-[100px] relative bg-blue-300 top-2 rounded-lg left-2"></div>
              </div>
            ))} */}
            {/* <div
                // key={`duplicate-${d.id}`}
                className="w-[70px] card-snake h-[100px] relative bg-blue-500 rounded-lg flex-shrink-0"
                // style={{
                //   animationDelay: `${i * 0.20}s`, // stagger motion!
                // }}
            >


                <div className="w-[70px] h-[100px] relative bg-blue-300 top-2 rounded-lg left-2"></div>
              </div> */}
            {infiniteCards?.map((d, i) => (
              <div
                key={`duplicate-${d.id}`}
                className="w-[70px] card-snake h-[100px] relative  rounded-lg flex-shrink-0"
                style={{
                  animationDelay: `${(d.originalIndex || i) * 0.2}s`, // stagger motion!
                }}
              >
                <div className="w-[70px] h-[100px] relative bg-black  top-2 rounded-lg left-2"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[40%] h-[40%] font-space-grotesk flex text-center flex-col items-center justify-center">
          <div className="text-[30px] font-bold">Requirement</div>
          <div className="text-[30px] font-bold">or</div>
          <div className="text-[30px] font-bold">Creation</div>
        </div>
        <div className="w-full h-[30%] overflow-hidden flex flex-row gap-10  relative">
          <div className="scroll-container-reverse flex flex-row gap-10">
            {infiniteCards?.map((d, i) => (
              <div
                key={d.id}
                style={{
                  animationDelay: `${(d.originalIndex || i) * 0.2}s`, // stagger motion!
                }}
                className="w-[70px] card-snake-reverse h-[100px] relative  rounded-lg flex-shrink-0"
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
