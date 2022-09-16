import { useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '../context/NFTContext';
import { Button, Input, Loader } from '../components';
import images from '../assets';

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [fromInput, setFromInput] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();
  const router = useRouter();
  //  getting uploadToIPFS function from NFTContext
  const { uploadToIPFS, createNFT, isLoadingNFT } = useContext(NFTContext);

  // function to be used in dropzone when dropped
  const onDrop = useCallback(async (acceptedFile) => {
    // upload image to blockchain aka IPFS
    const url = await uploadToIPFS(acceptedFile[0]);

    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
      ${isDragActive ? ' border-file-active ' : ''} 
      ${isDragAccept ? ' border-file-accept ' : ''} 
      ${isDragReject ? ' border-file-reject ' : ''}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  // load until the nfts are fetched
  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
          Upload your artwork as NFT!
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>
          <div className="mt-4">
            {/* spreading props provided by getRootProps from the useDropzone hook */}
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-lg">
                  PNG, GIF, SVG, WEBM. Max 10MB.
                </p>

                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file-upload"
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </div>

                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or Browser media on your device
                </p>

              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img
                    src={fileUrl}
                    alt="file-preview"
                  />
                </div>
              </aside>
            )}
          </div>
        </div>

        <Input
          inputType="input"
          title="Name"
          placeholder="NFT art name"
          // spreading the formInput object and replacing what is needed
          handleChange={(e) => setFromInput({ ...fromInput, name: e.target.value })}
        />
        {/* <input
          className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
          placeholder="Test"
          onChange={(e) => console.log(e.target.value)}
        /> */}
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT description"
          // spreading the formInput object and replacing what is needed
          handleChange={(e) => setFromInput({ ...fromInput, description: e.target.value })}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          // spreading the formInput object and replacing what is needed
          handleChange={(e) => setFromInput({ ...fromInput, price: e.target.value })}
        />

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create NFT"
            classStyles="rounded-xl"
            handleClick={async () => {
              // create NFT
              await createNFT(fromInput, fileUrl, router);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
