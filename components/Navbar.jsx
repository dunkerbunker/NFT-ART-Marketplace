import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';
import { Button } from '.';

// menu items component that takes in active tab as prop
// and sets the active tab
// generate link funcion assigns link based on count of item in list
const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0: return '/';
      case 1: return '/created-nfts';
      case 2: return '/my-nfts';
      default:
        break;
    }
  };
  // returns the menu items with correct classes and links in a combined component
  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setActive(item);
          }}
          className={`flex flex-row items-center font-poppins font-semibold text-lg dark:hover:text-white hover:text-nft-dark mx-3
          ${active === item
            ? 'dark:text-white text-nft-black-1'
            : 'dark:text-nft-gray-3 text-nft-gray-2'}
          ${isMobile && 'text-4xl my-2'}`}
        >
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

// takes in setActive so that no other tab is highligted when this is pressed
// and router to push to the correct page
const ButtonGroup = ({ setActive, router }) => {
  const hasConnected = true;

  return hasConnected ? (
    // button componenet is used from which is an import from components
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive('');
        router.push('/create-nft');
      }}
    />
  ) : (
    <Button
      btnName="Connect"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {}}
    />
  );
};

const Navbar = () => {
  // all hooks being used
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState('Explore NFTs');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      {/* putting logo on top left */}
      <div className="flex flex-1 flex-row justify-start">
        {/* logo section */}
        <Link href="/">
          <div
            className="flexCenter md:hidden cursor-pointer"
            onClick={() => {}}
          >
            <Image
              src={images.logo02}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
              Art Marketplace
            </p>
          </div>
        </Link>
        {/* logo section end */}
        {/* logo section mobile */}
        <Link href="/">
          <div
            className="hidden md:flex"
            onClick={() => {}}
          >
            <Image
              src={images.logo02}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
          </div>
        </Link>
        {/* logo section mobile end */}
      </div>
      {/* Right side of navBar */}
      <div className="flex flex-initial flex-row justify-end">
        {/* dark and light mode */}
        <div className="flex items-center mr-5">
          {/* changes mode using theme provider by NEXT */}
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            {/* white circle covering the icon not in use. Animiation of ball is in global css */}
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        {/* dark and light mode end */}
        {/* menu items and button group using components with props passed in */}
        <div className="md:hidden flex">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} />
          </div>
        </div>
      </div>
      {/* Mobile navigation bar start */}
      {/* Mobile navigation bar open icon */}
      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            objectFit="contain"
            width={20}
            height={20}
            alt="close"
            onClick={() => setIsOpen(false)}
            // invert color based on theme
            className={`${theme === 'light' && 'filter-invert'}`}
          />
        ) : (
          // mobile naviation bar close icon
          <Image
            src={images.menu}
            objectFit="contain"
            width={25}
            height={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={`${theme === 'light' && 'filter-invert'}`}
          />
        )}
        {/* Mobile navigation bar end  */}

        {/* Open the mobile navbar based on the isOpen state which is changed by clicking above icons */}
        {/* Components follow same system as on large screens */}
        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <ButtonGroup setActive={setActive} router={router} />
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
