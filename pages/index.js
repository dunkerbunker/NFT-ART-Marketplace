import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Banner, CreatorCard, NFTCard } from '../components';
import images from '../assets';
// function that makes a random id
import { makeId } from '../utils/makeId';

const Home = () => {
  // state to check when to show scroll buttons
  const [hideButtons, setHideButtons] = useState(false);
  // ref to identify scroll element and its parent
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  // theme hook to get the current theme
  const { theme } = useTheme();

  // function to check which direction to scroll when clicked
  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  // check if the scrollable with of the section is greater than the width of its parent.
  // this would mean there is extra space and the scroll buttons should not be shown
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth > parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  // useEffect to check run isScrollable function when the page loads
  // to call it again everytime the window is resized and remove the event listener after calling function
  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (
    <div>
      <div className="flex justify-center sm:px-4 p-12">
        <div className="w-full minmd:w-4/5">
          <Banner
            parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-2 xs:h-44 rounded-3xl"
            childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
            name="Discover, support and show off everything art!"
          />

          <div>
            <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
              Top Creators
            </h1>
            <div
              className="relative flex-1 max-w-full flex mt-3"
              // use of reference from above
              ref={parentRef}
            >
              <div
                className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                ref={scrollRef}
              >
                {/* map through the top creators */}
                {[6, 7, 8, 9, 10].map((i) => (
                  // custom component  from import
                  <CreatorCard
                    key={`creator-${i}`}
                    rank={i}
                    creatorImage={images[`creator${i}`]}
                    creatorName={`0x${makeId(3)}...${makeId(4)}`}
                    creatorEths={10 - i * 0.5}
                  />
                ))}
                {/* when hideButton state is true show buttons */}
                {!hideButtons && (
                <>
                  <div
                    // call above function to scroll left
                    onClick={() => handleScroll('left')}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                  >
                    <Image
                      src={images.left}
                      layout="fill"
                      objectFit="contain"
                      alt="left_arrow"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                  <div
                    // call above fucntion to scroll right
                    onClick={() => handleScroll('right')}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                  >
                    <Image
                      src={images.right}
                      layout="fill"
                      objectFit="contain"
                      alt="right_arrow"
                      className={theme === 'light' && 'filter invert'}
                    />
                  </div>
                </>
                )}
                {/* end of scroll button section */}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
              <h1 className="flex-1 before:first:font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                Trending Art
              </h1>
              <div>SeatchBar</div>
            </div>
            {/* creating a flex wrapper and mapping the trending NFT art in it */}
            <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <NFTCard
                  key={`nft-${i}`}
                  nft={{
                    i,
                    name: `Nifty NFT ${i}`,
                    price: (10 - i * 0.534).toFixed(2),
                    seller: `0x${makeId(3)}...${makeId(4)}`,
                    owner: `0x${makeId(3)}...${makeId(4)}`,
                    description: 'cool NFT on Sale',
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
